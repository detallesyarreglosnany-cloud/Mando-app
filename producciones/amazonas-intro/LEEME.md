# Amazonas · Intro satelital cinematográfica (Cumbre de Transformación Empresarial 2026)

Aproximación satelital: la Tierra desde el espacio, Sudamérica, Venezuela, el estado Amazonas, Puerto Ayacucho y un recorrido por 6 lugares emblemáticos, hasta la Plaza Bolívar y el cierre con la identidad de la Cumbre.

Todo se genera con código desde **una sola configuración**. Para cambiar un lugar, un nombre, un texto o la duración no hay que rehacer nada: se edita `config/recorrido.json` y se vuelve a renderizar.

## Arquitectura

| Pieza | Herramienta | Por qué |
|---|---|---|
| Globo 3D, relieve e imagen satelital | **CesiumJS 1.146** (código abierto, Apache 2.0), sin Cesium ion | Motor geográfico 3D real en el navegador, sin cuentas ni licencias de terceros |
| Captura cuadro por cuadro | **Playwright** + Chromium (ya instalado en el entorno) | Render determinista: cada cuadro espera a que carguen todas las teselas |
| Títulos, rótulos, atribución, logo, música | **Remotion 4.0.532** | Capa gráfica editable y la misma para todos los formatos |
| Codificación final | **FFmpeg**, vía Remotion | MP4 H.264 |

Se descartó **Blender**: para un vuelo geográfico con datos reales, CesiumJS ya da cámara, relieve e imagen, y Blender sumaría una herramienta pesada sin mejorar el resultado.

## Estructura

```
config/recorrido.json   ← todo lo editable: paradas, tiempos, cámara, textos, formatos, logo, música
cesium/escena.html      ← escena 3D (imagen, relieve, contorno de Venezuela, marcadores)
cesium/camara.js        ← trayectoria de cámara interpolada (Hermite / Catmull-Rom, sin frenazos)
remotion/               ← capa gráfica (Intro.tsx) y composición
scripts/preparar_dem.py ← prepara el relieve Copernicus (una sola vez)
scripts/capturar.js     ← captura los cuadros de la escena 3D
scripts/render.sh       ← orden única: prueba | final | anuncios
datos/dem/              ← elevación Copernicus GLO-30 (teselas N05/N06 W068)
salida/                 ← cuadros capturados y videos
```

## Cómo ejecutar

Requisitos: Node 24, Python 3 con numpy y opencv (solo para `preparar_dem.py`) y Chromium (en el entorno: `/opt/pw-browsers`).

```bash
npm install
python3 scripts/preparar_dem.py      # una sola vez
bash scripts/render.sh prueba        # prueba de 10 s, vertical y horizontal, baja resolución
bash scripts/render.sh final         # maestro de 20 s: vertical 1080x1920 y evento 3840x2160
bash scripts/render.sh anuncios      # 15 s y 10 s, vertical y horizontal
npm run estudio                      # vista previa interactiva de la capa gráfica
```

## Qué se edita y dónde (`config/recorrido.json`)

- **`paradas`:** nombre, detalle, coordenadas, momento (`t`, de 0 a 1), distancia de la cámara (`rango_m`), rumbo e inclinación. El orden de la lista es el orden del recorrido.
- **`camara`:** la aproximación desde el espacio (Tierra, Venezuela, Amazonas, Orinoco).
- **`duracion_s`:** duración total. Los tiempos son fracciones, así que todo se reescala solo.
- **`textos`:** país, estado, ciudad, títulos del cierre y atribución.
- **`logo` y `musica`:** ruta del archivo dentro de `salida/publico/` (por ejemplo, `logo-cumbre.png`). Si están vacíos, el cierre muestra un espacio reservado para el logo y el video sale sin música.
- **`exageracion_relieve`:** cuánto se realzan los cerros (1 = real).

## Fuentes y licencias (verificadas en las páginas oficiales el 2026-11-12)

| Fuente | Uso | Licencia | Estado |
|---|---|---|---|
| **Sentinel-2 cloudless 2016**, EOX (capa `s2cloudless_3857`) | Imagen satelital de todo el recorrido | **CC BY 4.0**, permite uso comercial con atribución | ✅ En uso |
| **Copernicus DEM GLO-30** | Relieve | Licencia libre mundial, con aviso obligatorio | ✅ En uso |
| **Natural Earth**, vía world-atlas | Contorno de Venezuela | Dominio público | ✅ En uso |
| Sentinel-2 cloudless **2018 a 2025** | — | CC BY-NC-SA, **no comercial** | ⛔ No se usa |
| Sentinel-2 cloudless 2017 | — | CC BY 4.0, pero solo cubre Europa | ⛔ No sirve aquí |
| NASA Blue Marble | — | Uso comercial con condiciones: no implicar respaldo de la NASA | ⏸ No se necesita |
| Google Earth / Google Maps | — | Restricciones comerciales | ⛔ Excluido por pedido |
| Mapbox Satellite, Esri World Imagery, Cesium ion (Bing / Google 3D), Maxar | Toma cercana de alta resolución | Requieren cuenta o contrato comercial | ⏸ Pendiente de autorización |

**Atribución obligatoria:** va dentro del video, en el pie de pantalla. Está en `textos.atribucion`.

## Límite técnico conocido
La imagen libre (Sentinel-2) tiene unos **10 m por píxel**. Se ve nítida desde el espacio hasta el nivel de barrios y manzanas, pero no permite una toma aérea cercana de la Plaza Bolívar con detalle de calles y árboles. Por eso la cámara no baja de unos 4 km.

Para el plano final cercano hay dos opciones:
1. **Toma de dron propia** de la Plaza Bolívar, 5 a 10 s en 4K. Se monta al final con una transición desde la imagen satelital. Es la opción recomendada: costo bajo y derechos propios.
2. **Imagen comercial de alta resolución** (Maxar, Mapbox, Esri u otro proveedor) con una licencia que cubra publicidad pagada, redes sociales y proyección pública. Requiere contrato del proveedor.

## Verificación de las ubicaciones (OpenStreetMap / Nominatim)
- Tobogán de la Selva: coincide (La Coromoto, Municipio Atures, Amazonas).
- Puerto Nuevo (El Burro): coincide con El Burro, **Municipio Cedeño, estado Bolívar**, unos 61 km al norte de Puerto Ayacucho, del otro lado del límite de Amazonas.
- El Aparo: Centro Cultural Aparo Acústico, Urb. Carinaguita, Puerto Ayacucho.
- Plaza Yo Amo Amazonas: monumento "Soy Amazonas", Av. 9 de Diciembre.
- Catedral María Auxiliadora: Av. Río Negro, casco central.
- Plaza Bolívar: casco central de Puerto Ayacucho.
