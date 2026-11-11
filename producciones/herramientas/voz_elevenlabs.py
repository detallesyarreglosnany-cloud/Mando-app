import subprocess, sys, json, os, tempfile
guion, carpeta, voz = sys.argv[1:4]
os.makedirs(carpeta, exist_ok=True); dur = {}
for linea in open(guion, encoding='utf-8'):
    linea = linea.strip()
    if not linea: continue
    i, txt = linea.split('|', 1)
    cuerpo = {'text': txt, 'model_id': 'eleven_multilingual_v2', 'voice_settings': {'stability': 0.3, 'similarity_boost': 0.85, 'style': 0.6, 'use_speaker_boost': True}}
    req = os.path.join(carpeta, f'{i}.json'); open(req, 'w').write(json.dumps(cuerpo))
    mp3 = os.path.join(carpeta, f'{i}.mp3'); fin = os.path.join(carpeta, f'{i}.wav')
    r = subprocess.run(['curl', '-s', '-o', mp3, '-w', '%{http_code}', '-H', 'xi-api-key: proxy-injected', '-H', 'Content-Type: application/json', '-d', '@' + req, f'https://api.elevenlabs.io/v1/text-to-speech/{voz}?output_format=mp3_44100_128'], capture_output=True, text=True)
    if r.stdout != '200': sys.exit(f'{i}: ElevenLabs respondió {r.stdout}')
    af = 'silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_threshold=-45dB:stop_duration=0.45,aresample=48000'
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', mp3, '-af', af, '-ac', '2', fin], check=True)
    os.remove(req)
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', fin], capture_output=True, text=True).stdout)
    dur[i] = round(d, 3); print(i, dur[i], flush=True)
json.dump(dur, open(os.path.join(carpeta, 'duraciones.json'), 'w'), indent=1)
