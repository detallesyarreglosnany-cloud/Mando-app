import sys, cv2, numpy as np
src, dst, tol = sys.argv[1], sys.argv[2], int(sys.argv[3])
huecos = len(sys.argv) > 4  # también quitar huecos blancos encerrados (grandes)
img = cv2.imread(src); h, w = img.shape[:2]
gris = img.min(axis=2)  # blanco = los tres canales altos
mask = np.zeros((h+2, w+2), np.uint8)
borde = [(x, 0) for x in range(0, w, 4)] + [(0, y) for y in range(0, h, 4)] + [(w-1, y) for y in range(0, h, 4)] + [(x, h-1) for x in range(0, w, 4)]
for (x, y) in borde:
    if gris[y, x] >= 238 and mask[y+1, x+1] == 0:
        cv2.floodFill(img.copy(), mask, (x, y), 0, (tol,)*3, (tol,)*3, cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE | 8 | (255 << 8))
fondo = mask[1:-1, 1:-1] > 0
if huecos:
    blanco = (gris >= 246).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(blanco, 4)
    for i in range(1, n):
        if st[i, 4] > 1500: fondo |= lab == i
alpha = np.where(fondo, 0, 255).astype(np.uint8)
alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
alpha = cv2.erode(alpha, np.ones((2, 2), np.uint8)); alpha = cv2.GaussianBlur(alpha, (5, 5), 0)
rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA); rgba[:, :, 3] = alpha
ys, xs = np.where(alpha > 10); rgba = rgba[ys.min():ys.max()+1, xs.min():xs.max()+1]
cv2.imwrite(dst, rgba); print(dst, rgba.shape[1], rgba.shape[0])
