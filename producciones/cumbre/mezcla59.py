# Mezcla del video de 57 s: voz por líneas + música (re-editada para que su caída coincida con la explosión del título)
# + efectos, todo desde src/tiempos59.json. Uso: python3 mezcla59.py <salida.wav>
import numpy as np, wave, json, subprocess, sys, os, tempfile
T = json.load(open('src/tiempos59.json')); SR = 48000; DUR = T['DUR']; N = int(DUR * SR)
def cargar(p, af=None):
    tmp = tempfile.mktemp(suffix='.wav')
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', p] + (['-af', af] if af else []) + ['-ar', str(SR), '-ac', '2', '-sample_fmt', 's16', tmp], check=True)
    with wave.open(tmp) as w: x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(float) / 32768
    os.remove(tmp); return x
def poner(buf, x, t, g=1.0):
    i = int(round(t * SR))
    if i < 0: x = x[-i:]; i = 0
    x = x[:max(0, N - i)]; buf[i:i + len(x)] += x * g
# --- música: [16.55–21.05] subida y silencio (zoom) | caída en la explosión | compases repetidos para llegar al final
m = cargar('sfx59/musica.wav'); B = 0.03  # los cortes van 20 ms antes del bombo
def tramo(a, b): 
    x = m[int((a - B) * SR):int((b - B) * SR)].copy(); f = int(0.012 * SR); x[:f] *= np.linspace(0, 1, f)[:, None]; x[-f:] *= np.linspace(1, 0, f)[:, None]; return x
DROP = 21.05
mus = np.zeros((N, 2)); t = T['EX'] - (DROP - 16.55)
for a, b in [(16.55, DROP), (DROP, 45.05), (29.05, 45.05), (37.05, 45.05), (45.05, 53.0)]:  # la base rítmica llega hasta el final
    x = tramo(a, b); poner(mus, x, t); t += b - a
# --- voz: presencia, compresión y nivel parejo por línea
AF = 'highpass=f=85,equalizer=f=220:t=q:w=1:g=-2,equalizer=f=3400:t=q:w=1.2:g=3.5,equalizer=f=9000:t=h:w=4000:g=2,acompressor=threshold=-22dB:ratio=4:attack=4:release=70:makeup=4,alimiter=limit=0.9'
voz = np.zeros((N, 2))
for k, v in T['V'].items():
    x = cargar(f'voz59/{k[1:]}.wav', AF); x *= 0.5 / max(1e-9, np.sqrt((x ** 2).mean())) * 0.22; poner(voz, x, v)
voz *= 0.9 / max(1e-9, np.abs(voz).max())
# --- efectos
fx = np.zeros((N, 2)); cache = {}
for n, t, g in T['fx']:
    if n not in cache:
        x = cargar(f'sfx59/{n}.wav'); x /= max(1e-9, np.abs(x).max())
        if n == 'teclas': x = x[:int(1.0 * SR)]; x[-2400:] *= np.linspace(1, 0, 2400)[:, None]
        cache[n] = x
    poner(fx, cache[n], t, g)
# --- la música baja cuando hay voz
env = np.abs(voz).mean(1); k = int(0.2 * SR); c = np.concatenate([[0], np.cumsum(env)])
env = (c[np.minimum(np.arange(N) + k // 2, N)] - c[np.maximum(np.arange(N) - k // 2, 0)]) / k
env = np.clip(env / max(1e-9, np.percentile(env, 95)), 0, 1)
mus *= (0.62 * (1 - 0.6 * env))[:, None]
x = voz + mus + fx * 0.6
f = np.ones(N); n = int(1.4 * SR); f[-n:] = np.linspace(1, 0, n) ** 1.5; x *= f[:, None]
x *= 0.95 / np.abs(x).max()
tmp = sys.argv[1] + '.tmp.wav'
with wave.open(tmp, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
r = subprocess.run(['ffmpeg', '-nostdin', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
j = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', tmp, '-af', f"volume={-14 - float(j['input_i']):.2f}dB,alimiter=limit=0.89:level=false", '-ar', str(SR), sys.argv[1]], check=True)
os.remove(tmp); print('ok', sys.argv[1], 'LUFS de entrada', j['input_i'])
# niveles relativos, para control
rms = lambda a: 20 * np.log10(np.sqrt((a ** 2).mean()) + 1e-9)
print('voz', round(rms(voz[voz.any(1)]), 1), 'música', round(rms(mus[int(6 * SR):int(50 * SR)]), 1), 'efectos', round(rms(fx * 0.6), 1))
