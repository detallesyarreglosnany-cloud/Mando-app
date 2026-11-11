import subprocess, sys, json, os
guion, carpeta, modelo, vpy = sys.argv[1:5]
dur = {}
for linea in open(guion, encoding='utf-8'):
    linea = linea.strip()
    if not linea: continue
    i, txt = linea.split('|', 1)
    raw = os.path.join(carpeta, f'{i}-raw.wav'); fin = os.path.join(carpeta, f'{i}.wav')
    subprocess.run([vpy, '-m', 'piper', '-m', modelo, '--length-scale', '0.84', '--sentence-silence', '0.18', '-f', raw], input=txt.encode(), check=True, capture_output=True)
    af = 'highpass=f=70,equalizer=f=140:t=q:w=1:g=3,equalizer=f=3200:t=q:w=1.2:g=2.5,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=3,silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_threshold=-45dB:stop_duration=0.4,aresample=48000'
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', raw, '-af', af, '-ac', '2', fin], check=True)
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', fin], capture_output=True, text=True).stdout)
    dur[i] = round(d, 3); print(i, dur[i])
json.dump(dur, open(os.path.join(carpeta, 'duraciones.json'), 'w'), indent=1)
