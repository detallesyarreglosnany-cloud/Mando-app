# Logos a una tinta hechos por Daniela (blanco con contorno negro) → blanco #FFFFFF + alfa.
# El blanco del dibujo queda blanco; el negro (contornos y detalles) queda transparente y deja ver el fondo.
# Fondo exterior: transparencia real si existe; si viene un cuadriculado pintado, se elimina por relleno desde el borde
# (todo lo claro conectado con el borde de la imagen sin cruzar el contorno negro).
import sys, numpy as np, cv2
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGBA'); a = np.asarray(im).astype(np.float32)
al0 = a[..., 3] / 255; L = (a[..., :3].mean(2)) * al0  # compuesto sobre negro
oscuro = (L < 100).astype(np.uint8)
n, lab = cv2.connectedComponents(1 - oscuro, connectivity=4)
borde = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0} if True else set()
fondo = np.isin(lab, list(borde)) & (oscuro == 0)
alfa = np.clip((L - 170) / 55, 0, 1) * (~fondo)
alfa = cv2.GaussianBlur(alfa, (0, 0), 0.6); alfa[alfa < 0.05] = 0
ys, xs = np.where(alfa > 0.1); p = 12
alfa = alfa[max(0, ys.min() - p):ys.max() + p, max(0, xs.min() - p):xs.max() + p]
o = np.zeros(alfa.shape + (4,), np.uint8); o[..., :3] = 255; o[..., 3] = (alfa * 255).astype(np.uint8)
Image.fromarray(o, 'RGBA').save(dst)
