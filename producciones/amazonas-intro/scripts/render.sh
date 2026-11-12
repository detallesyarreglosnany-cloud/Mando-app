#!/usr/bin/env bash
# Render completo, de una sola orden. Uso:
#   bash scripts/render.sh prueba                 -> prueba de 10 s, vertical y horizontal en baja resolución
#   bash scripts/render.sh final                  -> maestro 20 s: vertical 1080x1920 y horizontal 3840x2160
#   bash scripts/render.sh anuncios               -> versiones de 15 s y 10 s, vertical y horizontal
#   bash scripts/render.sh patrocinio             -> recorrido vertical que termina en la sede y funde a blanco, para
#                                                    empalmar con el video de patrocinadores (ver scripts/empalmar.sh)
# Pasos por formato: (1) captura de la escena 3D cuadro por cuadro, (2) capa gráfica en Remotion, (3) MP4 con FFmpeg.
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH=/opt/node24/bin:$PATH
CHROME=${CHROME:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
modo=${1:-prueba}

pieza () { # formato duracion nombre_salida [cierre]
	local formato=$1 dur=$2 nombre=$3 cierre=${4:-titulo}
	local carpeta=salida/frames/$formato
	rm -rf "${carpeta:?}"; mkdir -p "$carpeta"
	node scripts/capturar.js "$formato" --duracion "$dur"
	local n; n=$(ls "$carpeta" | wc -l)
	npx remotion render remotion/index.ts Intro "salida/$nombre.mp4" --public-dir=salida/publico \
		--props="{\"formato\":\"$formato\",\"cuadros\":$n,\"duracion\":$dur,\"cierre\":\"$cierre\"}" \
		--browser-executable="$CHROME" --codec=h264 --crf=16 --concurrency=4 --log=error
	echo "OK salida/$nombre.mp4"
}

case "$modo" in
	prueba)   pieza prueba_vertical 10 prueba-vertical-10s; pieza prueba_horizontal 10 prueba-horizontal-10s ;;
	final)    pieza vertical 20 amazonas-intro-vertical-20s; pieza horizontal 20 amazonas-intro-evento-4k-20s ;;
	anuncios) pieza vertical 15 amazonas-intro-vertical-15s; pieza vertical 10 amazonas-intro-vertical-10s
	          pieza horizontal 15 amazonas-intro-horizontal-15s; pieza horizontal 10 amazonas-intro-horizontal-10s ;;
	patrocinio) # captura vertical en 2 procesos paralelos; el cuadrado reutiliza esos cuadros
		rm -rf salida/frames/vertical; mkdir -p salida/frames/vertical
		node scripts/capturar.js vertical --duracion 20 --desde 0 --hasta 300 & node scripts/capturar.js vertical --duracion 20 --desde 300 --hasta 600 & wait
		for f in vertical cuadrado; do
			npx remotion render remotion/index.ts Intro "salida/amazonas-intro-patrocinio-$f.mp4" --public-dir=salida/publico \
				--props="{\"formato\":\"$f\",\"cuadros\":600,\"duracion\":20,\"cierre\":\"sede\"}" \
				--browser-executable="$CHROME" --codec=h264 --crf=16 --concurrency=4 --log=error
			echo "OK salida/amazonas-intro-patrocinio-$f.mp4"
		done ;;
	*) echo "modo desconocido: $modo"; exit 1 ;;
esac
