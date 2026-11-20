# Informe de calidad · Logos de patrocinadores en blanco (#FFFFFF + transparencia)

**Fuentes:** los 32 archivos originales de la carpeta de Drive. Todos son raster: 25 JPG/PNG sin transparencia y 1 PNG con alfa. **Ninguno es vectorial.**
**Método:** extracción por píxel con Python, OpenCV y Pillow, sin IA y sin redibujar. Cada píxel conserva su lugar y solo se calcula su opacidad.
- **fondo:** la opacidad sale de la distancia de color CIELAB al fondo.
- **claro:** para marcas claras sobre fondo oscuro, la opacidad sale de la luminancia.
- **plantilla:** igual que *fondo*, pero los contornos de un color dado quedan calados para no perder la estructura interna.

El borde suavizado sale del propio degradado de la opacidad; no hay umbral duro. Herramienta y parámetros: `herramientas/logos_blancos.py` y `logos_blancos.json`.

## Resultado por logo
**Limpios y fieles (17):** CEFOAGE, Ferreconi, Galaxia, JAC, KubIA, MultiEmpresariales, Navas Maldonado, Orthosmile, Perfumes Factory, Puerto Venado, Tania Alzuru, Tecnoama, Milsi, Más Network, Las Delicias del Llano, Club Parapata, La Esquina Caliente.

**Necesitaron intervención manual por logo (9), resuelta:**
- Amavisión: el texto rojo se cala para que se lea.
- Betty Guillén: el texto marrón del anillo se cala.
- Broaster: se limpiaron restos del borde.
- Farma: se quitó la línea superior del archivo; el rojo se cala.
- Jesús de Nazareth: el contorno granate se cala.
- Marco: el fondo era un degradado; se limpiaron los restos sueltos.
- Moto Daniel: marco del archivo recortado.
- Shamanika: el logo está sobre una foto; se recortó a la zona de la marca.
- Reyes & Rivero: el negro se cala.

**Requieren revisión de la marca (6).** Son ilustraciones o fotos a todo color. En una sola tinta pierden parte de su identidad; se reconocen, pero no con la fidelidad de un logo plano:
- La Casita de Charles
- El Divino Niño
- Condimentos del Sur
- Wahari Pizza
- Shabono by Nelson Méndez: el guion dorado sobre las letras se pierde.
- Gran Hotel Apure: los destellos quedan como halos suaves.

Lo recomendable es pedir a estas marcas su versión en una tinta (blanco o negro), o en vector. Si no la tienen, se usa esta versión o se decide una excepción.

## Controles hechos
- Están los 32 patrocinadores; ninguno inventado ni duplicado.
- Revisados uno por uno sobre azul marino: sin rectángulos, sin restos de fondo y sin halos de recorte.
- Las fotos de los ponentes y todos los textos del pendón están intactos.
- QR decodificado desde el archivo final a tamaño real: abre WhatsApp al 0426-761-7944 con el mensaje de la Cumbre.
- Archivo final: 5316 × 8859 px = 90 × 150 cm a 150 ppi.

## Pendiente antes de imprenta
- Sangrado y perfil CMYK de la imprenta.
- Prueba física del QR.
- Visto bueno de las 6 marcas marcadas.
