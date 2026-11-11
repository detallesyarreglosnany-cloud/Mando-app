import cv2, numpy as np, sys, os
src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
def clave(n, tol=38, suave=30):
    im=cv2.imread(f'{src}/logo{n}.png'); b=np.concatenate([im[0],im[-1],im[:,0],im[:,-1]]).astype(float)
    bg=np.median(b,0); d=np.linalg.norm(im.astype(float)-bg,axis=2)
    a=np.clip((d-tol)/suave,0,1)
    return guardar(n, im, a)
def circulo(n, cx, cy, r):
    im=cv2.imread(f'{src}/logo{n}.png'); h,w=im.shape[:2]; a=np.zeros((h,w),np.uint8)
    cv2.circle(a,(int(cx*w),int(cy*h)),int(r*w),255,-1,cv2.LINE_AA); return guardar(n, im, a/255.)
def guardar(n, im, a):
    a=(cv2.GaussianBlur((a*255).astype(np.uint8),(3,3),0))
    rgba=cv2.cvtColor(im,cv2.COLOR_BGR2BGRA); rgba[:,:,3]=a
    ys,xs=np.where(a>20); rgba=rgba[ys.min():ys.max()+1, xs.min():xs.max()+1]
    # luminancia media del dibujo (para decidir fondo)
    m=rgba[:,:,3]>128; lum=cv2.cvtColor(rgba[:,:,:3],cv2.COLOR_BGR2GRAY)[m].mean()
    cv2.imwrite(f'{dst}/logo{n}.png', rgba); print(n, rgba.shape[1], rgba.shape[0], 'lum', int(lum))
for n in (1,2,3,4,5,6,8,9,10,12,13,16): clave(n)
circulo(11, 0.5, 0.5, 0.47)   # La Casita: insignia circular
circulo(15, 0.5, 0.5, 0.495)  # Las Delicias: insignia circular
circulo(14, 0.49, 0.6, 0.30)  # Farma-Descuento: círculo central
