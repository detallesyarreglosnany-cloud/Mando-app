# Logos para la GRILLA ABIERTA (sin tarjetas). No se borra ningún fondo:
#  - Marca sobre blanco: se recorta a su caja real; sobre la superficie blanca del pendón el blanco desaparece solo.
#  - Marca con fondo propio (placa de identidad): se conserva entera, con esquinas suavemente redondeadas.
# Salida: PNG + medidas (tipo, proporción) en logos.json para el tamaño óptico en el diseño.
import glob, os, sys, json
from PIL import Image, ImageChops, ImageDraw, ImageFilter
SRC, DST = sys.argv[1], sys.argv[2]
def caja(im, bg, tol):
    d = ImageChops.difference(im, Image.new('RGB', im.size, bg)).convert('L').point(lambda v: 255 if v > tol else 0)
    return d.filter(ImageFilter.MaxFilter(5)).getbbox()
out = {}
for p in sorted(glob.glob(f'{SRC}/*.webp')):
    n = os.path.basename(p)[:-5]
    im = Image.open(p).convert('RGB'); bg = im.getpixel((6, 6))
    lg = im.crop(caja(im, bg, 30 if min(bg) > 225 else 8) or (0, 0, im.width, im.height))
    # ¿El borde de lo recortado es blanco? -> marca sobre blanco. Si no, es placa.
    px = [lg.getpixel((x, y)) for x in range(0, lg.width, 7) for y in (2, lg.height - 3)] + [lg.getpixel((x, y)) for y in range(0, lg.height, 7) for x in (2, lg.width - 3)]
    blanco_borde = sum(1 for c in px if min(c) > 225) / len(px) > 0.6
    tipo = 'blanco' if blanco_borde else 'placa'
    if tipo == 'placa':
        m = Image.new('L', lg.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, lg.width - 1, lg.height - 1), radius=int(min(lg.size) * 0.07), fill=255)
        lg = lg.convert('RGBA'); lg.putalpha(m)
    lg.thumbnail((1400, 1400), Image.LANCZOS)
    lg.save(f'{DST}/{n}.png', optimize=True)
    out[n] = {'tipo': tipo, 'r': round(lg.width / lg.height, 3)}
json.dump(out, open(f'{DST}/logos.json', 'w'), indent=1)
print({k: v['tipo'] for k, v in out.items()})
