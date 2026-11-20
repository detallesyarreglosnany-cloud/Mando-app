# Tarjetas uniformes SIN recortar fondos: cada marca se recorta a su caja real (sin el relleno que le pusimos),
# se centra en una tarjeta BLANCA con tamaño óptico parejo. Si su fondo es de color (placa de identidad), la placa
# se conserva entera con esquinas redondeadas; si es blanco, la marca queda directo sobre el blanco de la tarjeta.
import glob, os, sys
from PIL import Image, ImageChops, ImageDraw, ImageFilter
SRC, DST = sys.argv[1], sys.argv[2]
W, H = 1320, 880
def caja(im, bg, tol=30):
    d = ImageChops.difference(im, Image.new('RGB', im.size, bg)).convert('L').point(lambda v: 255 if v > tol else 0)
    d = d.filter(ImageFilter.MaxFilter(5))
    return d.getbbox()
for p in sorted(glob.glob(f'{SRC}/*.webp')):
    n = os.path.basename(p)[:-5]
    im = Image.open(p).convert('RGB')
    bg = im.getpixel((6, 6))
    blanco = min(bg) > 225
    bb = caja(im, bg)
    if blanco:
        lg = im.crop(bb)  # marca sobre blanco: se recorta a la marca
        frac = 0.56       # área objetivo dentro de la tarjeta
    else:
        # placa de color: se conserva la imagen original completa (sin el relleno de carta que le añadimos)
        bb2 = caja(im, bg, tol=8) or (0, 0, im.width, im.height)
        lg = im.crop(bb2) if (bb2[2]-bb2[0]) * (bb2[3]-bb2[1]) > 0.5 * im.width * im.height else im
        frac = 0.68
    r = lg.width / lg.height
    A = frac * W * H
    w, h = (A * r) ** 0.5, (A / r) ** 0.5
    k = min(1, 0.90 * W / w, 0.84 * H / h)
    w, h = int(w * k), int(h * k)
    lg = lg.resize((w, h), Image.LANCZOS)
    t = Image.new('RGB', (W, H), (255, 255, 255))
    if not blanco:
        m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), radius=int(min(w, h) * 0.08), fill=255)
        t.paste(lg, ((W - w) // 2, (H - h) // 2), m)
    else:
        t.paste(lg, ((W - w) // 2, (H - h) // 2))
    t.save(f'{DST}/{n}.png', optimize=True)
    print(n, 'blanco' if blanco else 'placa', w, h)
