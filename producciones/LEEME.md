# Producciones de video

Proyectos de video hechos con [Remotion](https://www.remotion.dev) (animación con código). Cada carpeta tiene todo lo necesario para volver a generar sus videos.

| Carpeta | Proyecto | Videos finales en `salida/` |
|---|---|---|
| `kickingball/` | Encuentro de kickingball Amazonas vs Bolívar (13 y 14 de noviembre) | Video promocional 30 s, versión WhatsApp, 3 flyers |
| `llanera/` | Gran Amanecer Llanero · Tasca El Bodegón de Jony (21 de noviembre) | Video vertical y cuadrado sincronizado con la cuña, 3 flyers |
| `cumbre/` | Cumbre de Transformación Empresarial Amazonas 2026 (4 de diciembre) | Versiones A (patrocinadores), B (público), directa, v2 y v3 con voz |
| `herramientas/` | Scripts de apoyo | Efectos de sonido, voz (Piper), recortes de fondo, montaje |

## Estructura de cada proyecto

- `src/` — la animación (React + Remotion). `Root.tsx` lista las composiciones.
- `public/` — imágenes, logos, recortes sin fondo, fuentes y audios que usa el video.
- `salida/` — videos y flyers finales.
- `orig/`, `logos-orig/` — material original recibido.

## Cómo volver a generar un video

Requiere Node 24 y ffmpeg.

```bash
cd producciones/cumbre
npm install
npx remotion studio            # vista previa en el navegador
npx remotion render src/index.ts CumbreDirectoVoz salida/video.mp4
```

Composiciones principales:
- **cumbre:** `CumbrePatrocinadores`, `CumbrePublico`, `CumbreSencilla`, `CumbreDirecto`, `CumbreDirectoVoz`
- **llanera:** `LlaneraVertical`, `LlaneraCuadrado`, `FlyerEntrada`, `FlyerAdentro`, `FlyerElementos`
- **kickingball:** `Promo`, `Flyer`, `FlyerB`, `FlyerC`

## Voz y tiempos (cumbre v3)

- `cumbre/guion-locucion.txt` — el texto de cada frase de la locución.
- `cumbre/src/tiempos.ts` — la duración de cada escena, calculada desde la voz real.
- `herramientas/voz.py` genera la voz frase por frase; `herramientas/montaje_directo.py` arma la línea de tiempo, la pista de voz y los efectos.
- Si se cambia la voz (por ejemplo, a ElevenLabs), se regeneran las frases y se vuelve a correr `montaje_directo.py`: el video se ajusta solo.

## Notas

- Los efectos de sonido son sintetizados (sin derechos de terceros) y **no usan ruido**: nada suena a "radio sin señal".
- Los recortes de los ponentes se hicieron con BiRefNet (licencia MIT).
- Contacto de la cumbre: wa.link/8e9pr6 · 0412-272-1986.
