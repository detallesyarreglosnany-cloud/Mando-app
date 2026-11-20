import sys, glob, os
from PIL import Image, ImageDraw, ImageFont
SRC, OUT = sys.argv[1], sys.argv[2]
fs = sorted(glob.glob(f'{SRC}/*.png')); W, H, P = 420, 300, 30
cols = 4; rows = (len(fs) + cols - 1) // cols
S = Image.new('RGB', (cols * W, rows * H), (7, 26, 74)); d = ImageDraw.Draw(S)
f = ImageFont.truetype('/home/user/pendon-cumbre/public/fonts/Montserrat.ttf', 18)
for i, p in enumerate(fs):
    im = Image.open(p); im.thumbnail((W - 2 * P, H - 2 * P - 20), Image.LANCZOS)
    x = (i % cols) * W + (W - im.width) // 2; y = (i // cols) * H + P + (H - 2 * P - 20 - im.height) // 2
    S.paste(im, (x, y), im); d.text(((i % cols) * W + 12, (i // cols) * H + H - 28), os.path.basename(p)[:-4], fill=(242, 183, 5), font=f)
S.save(OUT, quality=90)
