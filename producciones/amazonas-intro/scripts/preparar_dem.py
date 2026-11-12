# Une las teselas Copernicus GLO-30 (N05 y N06, W068) en una malla de elevación liviana para CesiumJS.
# Salida: datos/dem/dem.bin (Float32, filas de norte a sur) + datos/dem/dem.json (límites y tamaño).
import cv2, numpy as np, json, os
D = os.path.join(os.path.dirname(__file__), '..', 'datos', 'dem')
f = lambda t: os.path.join(D, f'Copernicus_DSM_COG_10_{t}_DEM.tif')
norte = cv2.imread(f('N06_00_W068_00'), cv2.IMREAD_UNCHANGED)   # lat 7 → 6
sur = cv2.imread(f('N05_00_W068_00'), cv2.IMREAD_UNCHANGED)     # lat 6 → 5
m = np.vstack([norte, sur]).astype(np.float32)                   # 7200 x 3600, ~30 m
PASO = 2                                                          # ~60 m: suficiente para la escala del video
m = cv2.resize(m, (m.shape[1] // PASO, m.shape[0] // PASO), interpolation=cv2.INTER_AREA)
m.tofile(os.path.join(D, 'dem.bin'))
json.dump({'oeste': -68.0, 'este': -67.0, 'sur': 5.0, 'norte': 7.0, 'ancho': m.shape[1], 'alto': m.shape[0],
           'min': float(m.min()), 'max': float(m.max()), 'base': float(np.percentile(m, 10))}, open(os.path.join(D, 'dem.json'), 'w'), indent=1)
print('dem', m.shape, m.min(), m.max())
