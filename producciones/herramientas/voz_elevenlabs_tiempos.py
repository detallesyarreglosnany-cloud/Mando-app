# Voz por líneas con ElevenLabs y tiempos por carácter (endpoint with-timestamps), para sincronizar animaciones palabra a palabra.
# Uso: python3 voz_elevenlabs_tiempos.py <guion "NN|texto"> <carpeta> <voice_id> [velocidad] [solo=NN,NN]
# Escribe NN.wav (48 kHz, recortado al habla) y tiempos.json: {NN: {dur, palabras: [[palabra, inicio_s], ...]}}
import subprocess, sys, json, os, base64, re
guion, carpeta, voz = sys.argv[1:4]
vel = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
solo = set(sys.argv[5].split('=')[1].split(',')) if len(sys.argv) > 5 else None
os.makedirs(carpeta, exist_ok=True)
jt = os.path.join(carpeta, 'tiempos.json'); T = json.load(open(jt)) if os.path.exists(jt) else {}
for linea in open(guion, encoding='utf-8'):
    linea = linea.strip()
    if not linea: continue
    i, txt = linea.split('|', 1)
    if solo and i not in solo: continue
    cuerpo = {'text': txt, 'model_id': 'eleven_multilingual_v2', 'voice_settings': {'stability': 0.32, 'similarity_boost': 0.8, 'style': 0.7, 'use_speaker_boost': True, 'speed': vel}}
    req = os.path.join(carpeta, f'{i}.req.json'); open(req, 'w').write(json.dumps(cuerpo))
    out = os.path.join(carpeta, f'{i}.resp.json')
    r = subprocess.run(['curl', '-s', '-o', out, '-w', '%{http_code}', '-H', 'xi-api-key: proxy-injected', '-H', 'Content-Type: application/json', '-d', '@' + req, f'https://api.elevenlabs.io/v1/text-to-speech/{voz}/with-timestamps?output_format=mp3_44100_128'], capture_output=True, text=True)
    if r.stdout != '200': sys.exit(f'{i}: ElevenLabs respondió {r.stdout}: {open(out).read()[:300]}')
    j = json.load(open(out)); al = j['alignment']; ch = al['characters']; st = al['character_start_times_seconds']; en = al['character_end_times_seconds']
    mp3 = os.path.join(carpeta, f'{i}.mp3'); open(mp3, 'wb').write(base64.b64decode(j['audio_base64']))
    letras = [k for k, c in enumerate(ch) if c.isalnum()]
    a = max(0, st[letras[0]] - 0.03); b = en[letras[-1]] + 0.18
    fin = os.path.join(carpeta, f'{i}.wav')
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', mp3, '-af', f'atrim={a}:{b},asetpts=PTS-STARTPTS,aresample=48000', '-ac', '1', '-sample_fmt', 's16', fin], check=True)
    palabras = []; k = 0
    for m in re.finditer(r'\S+', txt):
        ks = [q for q in range(m.start(), m.end()) if ch[q].isalnum()]
        if ks: palabras.append([re.sub(r'[^\wáéíóúñü]', '', m.group().lower()), round(st[ks[0]] - a, 3)])
    T[i] = {'dur': round(b - a, 3), 'palabras': palabras}
    os.remove(req); os.remove(out); print(i, T[i]['dur'], flush=True)
    json.dump(T, open(jt, 'w'), ensure_ascii=False, indent=1)
