# Conversión de logotipos ORIGINALES a blanco puro #FFFFFF con canal alfa. Sin IA ni redibujado:
# cada píxel conserva su posición; solo se calcula cuánta "marca" hay en él (alfa) y se pinta blanco.
# Métodos (elegidos por logo tras inspección):
#   fondo     – alfa = distancia de color (CIELAB) al fondo externo. Lo que es fondo, y los huecos internos
#               del mismo color (contraformas de letras), quedan transparentes.
#   claro     – marca clara sobre fondo oscuro: alfa = luminancia por encima del fondo (conserva matices y brillos).
#   plantilla – como "fondo", pero además un color de línea/contorno de la marca se convierte en hueco:
#               conserva la estructura interna de logos de varios colores (sus contornos quedan calados).
# El borde suavizado (antialias) sale del propio degradado del alfa; no hay umbral duro.
import sys, json, numpy as np, cv2
from PIL import Image
ORIG, DST = sys.argv[1], sys.argv[2]
CFG = json.load(open(sys.argv[3]))
def lab(a): return cv2.cvtColor(a.astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)
def rampa(x, t0, t1): return np.clip((x - t0) / max(1e-6, t1 - t0), 0, 1)
for nombre, c in CFG.items():
    if nombre.startswith('_'): continue
    im = Image.open(f"{ORIG}/{c['archivo']}").convert('RGB')
    if 'recorte' in c:
        x0, y0, x1, y1 = c['recorte']; im = im.crop((int(x0 * im.width), int(y0 * im.height), int(x1 * im.width), int(y1 * im.height)))
    if max(im.size) > 2000: im.thumbnail((2000, 2000), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32); L = lab(a)
    borde = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
    bg = np.array(c.get('fondo', np.median(borde, 0)), np.float32)
    dE = np.linalg.norm(L - lab(bg.reshape(1, 1, 3)), axis=2) * (100 / 255)
    m = c['metodo']; t0, t1 = c.get('t', [6, 18])
    if m == 'claro':
        lum = L[..., 0] * 100 / 255; lbg = lab(bg.reshape(1, 1, 3))[0, 0, 0] * 100 / 255
        al = rampa(lum - lbg, t0, t1) ** c.get('gamma', 1.0)
    else:
        al = rampa(dE, t0, t1)
        if m == 'plantilla':
            for hc in c['huecos']:
                dh = np.linalg.norm(L - lab(np.array(hc, np.float32).reshape(1, 1, 3)), axis=2) * (100 / 255)
                h0, h1 = c.get('th', [10, 22])
                al = al * rampa(dh, h0, h1)
            if 'oscuro' in c:  # además, todo lo más oscuro que este nivel (L*) se cala
                al = al * rampa(L[..., 0] * 100 / 255, c['oscuro'], c['oscuro'] + 8)
    if 'componentes' in c:  # conserva solo las piezas de la marca (las de área >= fracción de la mayor)
        n, lab_, st, _ = cv2.connectedComponentsWithStats((al > 0.3).astype(np.uint8), 8)
        if n > 1:
            mayor = st[1:, cv2.CC_STAT_AREA].max(); keep = np.zeros(n, bool)
            keep[1:] = st[1:, cv2.CC_STAT_AREA] >= c['componentes'] * mayor
            dil = cv2.dilate(keep[lab_].astype(np.uint8), np.ones((5, 5), np.uint8))
            al = al * dil
    al = cv2.GaussianBlur(al, (0, 0), 0.6)  # solo suaviza el escalón de compresión JPEG del borde
    al[al < 0.04] = 0
    ys, xs = np.where(al > 0.1)
    if len(xs) == 0: print('VACÍO', nombre); continue
    pad = int(0.02 * max(im.size))
    y0, y1, x0, x1 = max(0, ys.min() - pad), min(al.shape[0], ys.max() + pad), max(0, xs.min() - pad), min(al.shape[1], xs.max() + pad)
    out = np.zeros((y1 - y0, x1 - x0, 4), np.uint8); out[..., :3] = 255; out[..., 3] = (al[y0:y1, x0:x1] * 255).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(f'{DST}/{nombre}.png', optimize=True)
    print(f'{nombre:20s} {m:9s} {x1-x0}x{y1-y0}')
