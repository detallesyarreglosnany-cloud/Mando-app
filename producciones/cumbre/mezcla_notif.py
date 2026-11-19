# Efectos del video "Notificación" (sin música ni voz). Cada efecto se alinea por su ataque real
# (primer instante en que pasa del 20% de su pico), así el sonido cae justo en el cuadro del golpe.
import json, os, sys, subprocess, re, wave, numpy as np
T = json.load(open('src/tiemposN.json')); SR = 48000
def carga(n):
    for d in ('sfxN', 'sfx59'):
        p = f'{d}/{n}.wav'
        if os.path.exists(p):
            raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', p, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
            x = np.frombuffer(raw, np.int16).reshape(-1, 2).astype(float) / 32768
            m = np.abs(x).max(1); ataque = int(np.argmax(m > 0.2 * m.max()))
            return x / (m.max() + 1e-9) * 0.5, ataque
    raise SystemExit(n)
cache = {}
y = np.zeros((int(T['DUR'] * SR) + SR, 2))
for n, t, g in T['fx']:
    if n not in cache: cache[n] = carga(n)
    x, a = cache[n]; i = max(0, int(t * SR) - a); seg = x[: len(y) - i]
    y[i:i + len(seg)] += seg * g
y = y[: int(T['DUR'] * SR)]
# efectos sin voz: a unos -18 LUFS, techo suave
def lufs(z):
    tmp = '/tmp/claude-0/-home-user/f756b46d-58a2-5fee-8b5f-41036dcf947b/scratchpad/lufs.wav'; guarda(tmp, z)
    e = subprocess.run(['ffmpeg', '-i', tmp, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e)[-1])
def guarda(p, z):
    with wave.open(p, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(z, -1, 1) * 32767).astype(np.int16).tobytes())
L = lufs(y); y *= 10 ** ((-18 - L) / 20); y = np.tanh(y / 0.89) * 0.89
guarda(sys.argv[1] if len(sys.argv) > 1 else 'public/audio/mezcla-notif.wav', y)
print('LUFS antes', round(L, 1), 'despues', lufs(y), 'pico', round(float(np.abs(y).max()), 3))
