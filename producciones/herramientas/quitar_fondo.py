import sys, cv2, numpy as np
def flood(src, dst, tol):
    img = cv2.imread(src); h, w = img.shape[:2]
    mask = np.zeros((h+2, w+2), np.uint8)
    seeds = [(x, y) for x in range(0, w, 8) for y in (0, h-1)] + [(x, y) for y in range(0, h, 8) for x in (0, w-1)]
    for s in seeds:
        if mask[s[1]+1, s[0]+1] == 0:
            cv2.floodFill(img.copy(), mask, s, 0, (tol,)*3, (tol,)*3, cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE | 4 | (255 << 8))
    bg = mask[1:-1, 1:-1] > 0
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, np.ones((3,3), np.uint8))
    alpha = cv2.GaussianBlur(alpha, (3,3), 0)
    save(img, alpha, dst)
def circle(src, dst, cx, cy, r):
    img = cv2.imread(src); h, w = img.shape[:2]
    alpha = np.zeros((h, w), np.uint8); cv2.circle(alpha, (cx, cy), r, 255, -1, cv2.LINE_AA)
    save(img, alpha, dst, (cx-r, cy-r, cx+r, cy+r))
def save(img, alpha, dst, box=None):
    rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA); rgba[:, :, 3] = alpha
    if box is None:
        ys, xs = np.where(alpha > 10); box = (xs.min(), ys.min(), xs.max()+1, ys.max()+1)
    x0, y0, x1, y1 = [max(0, v) for v in box]
    cv2.imwrite(dst, rgba[y0:y1, x0:x1]); print(dst, x1-x0, y1-y0)
m = sys.argv[1]
if m == 'flood': flood(sys.argv[2], sys.argv[3], int(sys.argv[4]))
else: circle(sys.argv[2], sys.argv[3], *map(int, sys.argv[4:7]))
