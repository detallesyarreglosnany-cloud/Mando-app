#!/usr/bin/env bash
# Empalma el recorrido satelital (modo 'patrocinio' de render.sh) con el video de patrocinadores de la Cumbre:
#   recorrido 20 s -> sede (Club Parapata) -> fundido a blanco -> explosión del título -> resto del video.
# Uso: bash scripts/empalmar.sh [carpeta_voz | sin-voz]
# Requiere: salida/amazonas-intro-patrocinio-vertical.mp4 y salida/frames/vertical/ (de render.sh patrocinio).
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH=/opt/node24/bin:$PATH
CHROME=${CHROME:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
VIDEO=${VIDEO_CUMBRE:-/home/user/video-cumbre}
HERR=$(cd ../herramientas && pwd)
VOZ=${1:-sin-voz}
INTRO=salida/amazonas-intro-patrocinio-vertical.mp4
EXPLOTA_CUADRO=288   # 9,6 s x 30 fps: la explosión del título en src/Patrocinio.tsx

# 1. fondo tras la explosión = último cuadro satelital (sin rótulos)
mkdir -p "$VIDEO/public/satelite"
cp "$(ls salida/frames/vertical/*.jpg | tail -1)" "$VIDEO/public/satelite/final.jpg"
# 2. audio: efectos del recorrido + todo el video corrido a la nueva duración
python3 "$HERR/mezcla_patrocinio.py" "$VOZ" salida/mezcla-satelite.wav config/recorrido.json
# 3. el video de patrocinadores desde la explosión, sin audio (va aparte)
(cd "$VIDEO" && npx remotion render src/index.ts CumbreInvitaPatrocinio "$OLDPWD/salida/patro-cola.mp4" \
	--props='{"conAudio":false}' --frames=$EXPLOTA_CUADRO- --browser-executable="$CHROME" --codec=h264 --crf=18 --concurrency=4 --log=error)
# 4. unión + audio
ffmpeg -nostdin -v error -y -i "$INTRO" -i salida/patro-cola.mp4 -i salida/mezcla-satelite.wav \
	-filter_complex "[0:v]fps=30,format=yuv420p[a];[1:v]fps=30,format=yuv420p[b];[a][b]concat=n=2:v=1:a=0[v]" \
	-map "[v]" -map 2:a -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart \
	salida/cumbre-patrocinadores-satelite.mp4
echo "OK salida/cumbre-patrocinadores-satelite.mp4"
