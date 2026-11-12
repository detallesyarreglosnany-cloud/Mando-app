# Mezcla del video "Cumbre · Patrocinadores": voz (carpeta con 01.wav…16.wav) + música sintetizada + efectos, sincronizados
# con los tiempos de src/Patrocinio.tsx. Uso: python3 mezcla_patrocinio.py <carpeta_voz | sin-voz> <salida.wav> [recorrido.json]
# Con [recorrido.json] (config de producciones/amazonas-intro) la mezcla empieza con el recorrido satelital: su duración
# reemplaza los primeros EXPLOTA segundos y todo lo demás se corre en consecuencia.
import numpy as np, wave, sys, json, subprocess, os
VOZ, OUT = sys.argv[1], sys.argv[2]
SAT = json.load(open(sys.argv[3])) if len(sys.argv) > 3 else None
EXPLOTA_BASE = 9.6
DUR_INTRO = SAT['duracion_s'] if SAT else EXPLOTA_BASE
OFF = DUR_INTRO - EXPLOTA_BASE  # corrimiento de todo lo que pasa desde la explosión
SR = 48000; DUR = 91.0 + OFF; N = int(SR * DUR); rng = np.random.default_rng(7)
def tt(d): return np.arange(int(d * SR)) / SR
def ruido(d): return rng.uniform(-1, 1, int(d * SR))
def lp(x, fc):  # filtro pasa bajos de un polo
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc = (1 - a) * x[i] + a * acc; y[i] = acc
    return y
def canal(): return np.zeros(N), np.zeros(N)
def add(buf, s, t, g=1.0, pan=0.0, fijo=False):
    if not fijo and t >= EXPLOTA_BASE - 1.3: t += OFF  # lo posterior a la explosión se corre junto con el video
    L, R = buf; i = int(t * SR)
    if i >= N: return
    s = s[:N - i] * g; L[i:i + len(s)] += s * np.sqrt(.5 * (1 - pan)); R[i:i + len(s)] += s * np.sqrt(.5 * (1 + pan))
def whoosh(d=0.45):  # barrido tonal (sin ruido: nada suena a estática)
    t = tt(d); f = 260 * 2 ** (2.2 * t / d); fase = 2 * np.pi * np.cumsum(f) / SR
    return 0.35 * (np.sin(fase) + 0.5 * np.sin(2 * fase + 1)) * np.sin(np.pi * t / d) ** 2
def golpe(g=1.0, d=1.2):
    t = tt(d); f = 38 + 90 * np.exp(-t * 10); n = ruido(d)
    return g * (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.5))
def tick(f=1800, g=0.4):
    t = tt(0.06); return g * np.sin(2 * np.pi * f * t) * np.exp(-t * 70)
def tecla(g=0.35):
    t = tt(0.05); return g * (0.7 * np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 140) + 0.5 * np.sin(2 * np.pi * 620 * t) * np.exp(-t * 90))
def pop(g=0.5):
    t = tt(0.15); f = 600 + 900 * np.exp(-t * 40); return g * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 25)
def brillo(d=1.2, g=0.25):
    t = tt(d); return g * sum(np.sin(2 * np.pi * f * t) * np.exp(-t * (3 + k)) for k, f in enumerate((1568, 2093, 2637, 3136)))
def subida(d=2.5):
    t = tt(d); f = 110 * (2 ** (3 * t / d)); fase = 2 * np.pi * np.cumsum(f) / SR
    return 0.3 * (np.sin(fase) + 0.4 * np.sin(2 * fase) + 0.2 * np.sin(3 * fase)) * (t / d) ** 2

fx = canal(); mus = canal(); voz = canal()

# ---- voz
V = {'01': 4.6, '02': 9.7, '03': 13.2, '04': 21.0, '05': 32.0, '06': 35.2, '07': 38.8, '08': 42.0, '09': 45.4, '10': 51.5, '11': 62.6, '12': 66.8, '13': 71.8, '14': 78.2, '15': 81.4, '16': 84.6}
for k, t in (V.items() if VOZ != 'sin-voz' else []):  # 'sin-voz': solo música y efectos
    with wave.open(os.path.join(VOZ, f'{k}.wav')) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, w.getnchannels()).astype(float) / 32768
        assert w.getframerate() == SR
    if SAT and k == '01':  # con el recorrido satelital, la frase 01 termina justo antes de la explosión
        add(voz, x.mean(1), DUR_INTRO - len(x) / SR - 0.3, fijo=True)
    else:
        add(voz, x.mean(1), t)
v = np.abs(voz[0]); voz = (voz[0] / max(1e-9, v.max()) * 0.9, voz[1] / max(1e-9, v.max()) * 0.9)

# ---- efectos (mismos tiempos que src/Patrocinio.tsx)
EXPLOTA = 9.6; T_PARADA = [2.9, 4.0, 5.1, 6.2, 7.3, 8.4]
if SAT:  # recorrido satelital: rótulos y paradas salen de su configuración
    D = SAT['duracion_s']
    add(fx, subida(3.5), 0.2, 0.35, fijo=True)
    for u in (0.10, 0.255, 0.355): add(fx, brillo(1.4, 0.18), u * D, fijo=True)
    paradas = [p['t'] for p in SAT['paradas']] + ([SAT['sede']['desde']] if SAT.get('sede') else [])
    for u in paradas: add(fx, whoosh(0.55), u * D - 0.6, 0.9, rng.uniform(-.5, .5), fijo=True); add(fx, tick(1500, 0.3), u * D, fijo=True)
    if SAT.get('sede'): add(fx, brillo(1.6, 0.3), SAT['sede']['desde'] * D, fijo=True)
else:
    add(fx, subida(2.6), 0.2, 0.45)
    for t in T_PARADA[1:]: add(fx, whoosh(0.55), t - 0.6, 1.0, rng.uniform(-.5, .5))
    for t in T_PARADA: add(fx, tick(1500, 0.3), t)
add(fx, subida(1.2), EXPLOTA - 1.2, 0.6); add(fx, golpe(1.2, 1.6), EXPLOTA); add(fx, brillo(1.8, 0.35), EXPLOTA)
for t in (16.74, 17.63, 18.49): add(fx, golpe(0.7), t); add(fx, brillo(0.8, 0.15), t)
for t in (21.0, 23.5, 24.85): add(fx, whoosh(0.4), t - 0.15, 0.5); add(fx, pop(0.4), t + 0.25)
add(fx, whoosh(0.6), 26.22, 0.6); add(fx, brillo(1.0, 0.2), 27.17)
for t in (31.7, 35.0, 38.6, 41.8): add(fx, whoosh(0.5), t - 0.2, 0.7); add(fx, golpe(0.5), t + 0.05)
for k, t in enumerate((32.0, 35.2, 38.8, 42.0)): add(fx, pop(0.45), t + 0.47)
for t in (45.4, 47.24, 48.42): add(fx, golpe(0.6), t)
llega = []; t = 51.7
for i in range(18): llega.append(t); t += np.interp(i, [0, 16], [0.85, 0.36])
for i, t in enumerate(llega): add(fx, pop(0.5), t, 1.0, (-0.4, 0, 0.4)[i % 3]); add(fx, whoosh(0.3), t + 0.25, 0.35)
add(fx, brillo(1.6, 0.3), 62.6); add(fx, golpe(0.8), 66.8); add(fx, golpe(0.5), 66.8 + 16 / 30)
add(fx, whoosh(0.6), 71.8, 0.5); add(fx, pop(0.4), 73.1); add(fx, pop(0.4), 73.8)
for i in range(len('cumbre.kubiav.com')): add(fx, tecla(0.45), 78.3 + i / 12, 1.0, rng.uniform(-.2, .2))
add(fx, tecla(0.9), 80.15); add(fx, golpe(0.5, 0.5), 80.15); add(fx, brillo(1.4, 0.35), 80.2); add(fx, whoosh(0.5), 80.25, 0.6)
add(fx, pop(0.5), 81.55)
add(fx, whoosh(0.6), 84.3, 0.6); add(fx, golpe(0.6), 84.55)
for t in (87.07, 87.96, 88.81): add(fx, golpe(0.8), t); add(fx, brillo(0.9, 0.18), t)

# ---- música sintetizada: La menor, 100 BPM (pulso 0.6 s). Acordes Am–F–C–G, cada uno 2 compases.
BPM = 100; B = 60 / BPM
ACORDES = [(57, 60, 64), (53, 57, 60), (48, 52, 55), (55, 59, 62)]
mid = lambda m: 440 * 2 ** ((m - 69) / 12)
def pad(notas, d):
    t = tt(d); env = np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.4)
    s = sum(sum(np.sin(2 * np.pi * mid(m) * h * t + h) / h ** 1.6 for h in (1, 2, 3)) for m in notas)
    return 0.06 * s * env
def bajo(m, d):
    t = tt(d); return 0.22 * np.sin(2 * np.pi * mid(m - 24) * t) * np.minimum(1, t / 0.02) * np.exp(-t * 1.2)
def bombo():
    t = tt(0.35); f = 45 + 110 * np.exp(-t * 28); return 0.55 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
def plato():
    t = tt(0.05); return 0.05 * (np.sin(2 * np.pi * 7400 * t) + np.sin(2 * np.pi * 9100 * t)) * np.exp(-t * 90)
def palmas():
    t = tt(0.14); f = 230 + 120 * np.exp(-t * 50); return 0.22 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 28)
BOMBO, PLATO, PALMAS = bombo(), plato(), palmas()
bombo = lambda: BOMBO; plato = lambda: PLATO; palmas = lambda: PALMAS
# introducción (antes de la explosión): solo un colchón grave
d0 = DUR_INTRO; t0 = tt(d0); add(mus, 0.16 * np.sin(2 * np.pi * 55 * t0) * np.minimum(1, t0 / 1.5), 0, fijo=True)
compas = 4 * B; c = 0; t = EXPLOTA
while t < 91.0 - 1.2:  # tiempos en la línea base; add() los corre
    ac = ACORDES[(c // 2) % 4]
    add(mus, pad(ac, compas + 0.3), t); add(mus, bajo(ac[0], compas), t)
    for b in range(4):
        tb = t + b * B
        if tb > 91.0 - 1.2: break
        add(mus, bombo(), tb)
        if tb >= 13.0: add(mus, plato(), tb + B / 2, 1.0, 0.3); add(mus, plato(), tb, 0.6, -0.3)
        if 51.2 <= tb < 66.6 and b % 2 == 1: add(mus, palmas(), tb)
    t += compas; c += 1
add(mus, golpe(1.0, 2.0), 89.35, 0.6)

# ---- mezcla: la música baja cuando habla el locutor
envv = np.abs(voz[0]); k = int(0.25 * SR)
c = np.concatenate([[0], np.cumsum(envv)]); envv = (c[np.minimum(np.arange(N) + k // 2, N)] - c[np.maximum(np.arange(N) - k // 2, 0)]) / k  # media móvil O(N)
envv = np.clip(envv / max(1e-9, np.percentile(envv, 99)), 0, 1)
duck = 1 - 0.7 * envv
mL = mus[0] * duck * 0.9; mR = mus[1] * duck * 0.9
L = voz[0] + mL + fx[0] * 0.5; R = voz[1] + mR + fx[1] * 0.5
fade = np.ones(N); n = int(1.2 * SR); fade[-n:] = np.linspace(1, 0, n)
x = np.stack([L * fade, R * fade], 1); x /= max(1e-9, np.abs(x).max()); x *= 0.95
tmp = OUT + '.tmp.wav'
with wave.open(tmp, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
# medición de sonoridad integrada (primera pasada)
m = subprocess.run(['ffmpeg', '-nostdin', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
m = json.loads(m[m.rindex('{'):m.rindex('}') + 1])
# ganancia fija hasta -14 LUFS + limitador (loudnorm "lineal" vuelve a modo dinámico si choca con el pico)
af = f"volume={-14 - float(m['input_i']):.2f}dB,alimiter=limit=0.84:level=false"
subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', tmp, '-af', af, '-ar', str(SR), OUT], check=True)
os.remove(tmp); print('ok', OUT)
