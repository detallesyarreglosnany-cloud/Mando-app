import sys, numpy as np, cv2, onnxruntime as ort
m, src, dst = sys.argv[1], sys.argv[2], sys.argv[3]
crop_bottom = int(sys.argv[4]) if len(sys.argv) > 4 else 0
s = ort.InferenceSession(m, providers=['CPUExecutionProvider'])
img = cv2.imread(src)
if crop_bottom: img = img[:img.shape[0]-crop_bottom]
h, w = img.shape[:2]
x = cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), (1024, 1024)).astype(np.float32) / 255.
x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
x = x.transpose(2, 0, 1)[None].astype(np.float32)
out = s.run(None, {s.get_inputs()[0].name: x})[0][0, 0]
a = 1 / (1 + np.exp(-out)) if out.min() < 0 or out.max() > 1 else out
a = cv2.resize(a, (w, h))
rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA); rgba[:, :, 3] = (np.clip(a, 0, 1) * 255).astype(np.uint8)
ys, xs = np.where(rgba[:, :, 3] > 20); rgba = rgba[ys.min():ys.max()+1, xs.min():xs.max()+1]
cv2.imwrite(dst, rgba); print(dst, rgba.shape[1], rgba.shape[0])
