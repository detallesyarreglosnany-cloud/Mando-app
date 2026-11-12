#!/usr/bin/env bash
# Render completo, de una sola orden. Uso:
#   bash scripts/render.sh prueba                 -> prueba de 10 s, vertical y horizontal en baja resolución
#   bash scripts/render.sh final                  -> maestro 20 s: vertical 1080x1920 y horizontal 3840x2160
#   bash scripts/render.sh anuncios               -> versiones de 15 s y 10 s, vertical y horizontal
# Pasos por formato: (1) captura de la escena 3D cuadro por cuadro, (2) capa gráfica en Remotion, (3) MP4 con FFmpeg.
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH=/opt/node24/bin:$PATH
CHROME=${CHROME:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
modo=${1:-prueba}

pieza () { # formato duracion nombre_salida
	local formato=$1 dur=$2 nombre=$3
	local carpeta=salida/frames/$formato
	rm -rf "${carpeta:?}"; mkdir -p "$carpeta"
	node scripts/capturar.js "$formato" --duracion "$dur"
	local n; n=$(ls "$carpeta" | wc -l)
	npx remotion render remotion/index.ts Intro "salida/$nombre.mp4" --public-dir=salida/publico \
		--props="{\"formato\":\"$formato\",\"cuadros\":$n,\"duracion\":$dur}" \
		--browser-executable="$CHROME" --codec=h264 --crf=16 --concurrency=4 --log=error
	echo "OK salida/$nombre.mp4"
}

case "$modo" in
	prueba)   pieza prueba_vertical 10 prueba-vertical-10s; pieza prueba_horizontal 10 prueba-horizontal-10s ;;
	final)    pieza vertical 20 amazonas-intro-vertical-20s; pieza horizontal 20 amazonas-intro-evento-4k-20s ;;
	anuncios) pieza vertical 15 amazonas-intro-vertical-15s; pieza vertical 10 amazonas-intro-vertical-10s
	          pieza horizontal 15 amazonas-intro-horizontal-15s; pieza horizontal 10 amazonas-intro-horizontal-10s ;;
	*) echo "modo desconocido: $modo"; exit 1 ;;
esac
