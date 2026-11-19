# Línea de tiempo del video "Notificación" (agenda + ponentes + 31 patrocinadores + entradas), SIN música y SIN voz.
# La leen src/Notificacion.tsx y mezcla_notif.py. La voz se graba después sobre estos tiempos.
import json
o = {'DUR': 71.0,
 'vibra': 0.25, 'notif': 0.5, 'tap': 2.9, 'l': [3.35, 4.3, 5.3], 'desbloqueo': 6.9,
 'tarjeta': 7.3, 'pilares': [8.5, 9.1, 9.7],
 'ponentes': [11.0, 16.0, 21.0, 26.0], 'por_ponente': 5.0,
 'gracias': 31.0, 'pares': [32.4 + 1.0 * i for i in range(16)], 'por_par': 1.0,
 'muro': 48.4, 'parte': 51.4, 'socio': 51.7, 'equipo': 52.9, 'herramientas': 54.1, 'amazonas': 55.7,
 'cta': 58.6, 'contacto': 60.0, 'cierre': 63.4}
fx = [['vibracion', o['vibra'], 0.9], ['notificacion', o['notif'], 0.8], ['tap', o['tap'], 0.9], ['deslizar', o['tap'] + 0.1, 0.35]]
fx += [['pop', t, 0.5] for t in o['l']] + [['desbloqueo', o['desbloqueo'], 0.9], ['impacto', o['tarjeta'], 0.6]]
fx += [['golpe', t, 0.8] for t in o['pilares']]
for t in o['ponentes'] + [o['gracias']]:
    fx += [['deslizar', t - 0.05, 0.8]]
for t in o['ponentes']:
    fx += [['golpe', t + 0.35, 0.6], ['pop', t + 1.0, 0.45], ['check', t + 3.6, 0.7]]
fx += [['golpe', o['gracias'] + 0.6, 0.7]]
for i, t in enumerate(o['pares']):
    fx += [['swish2', t, 0.35], ['encaje', t + 0.22, 0.6]] + ([['encaje', t + 0.3, 0.45]] if i < 15 else [])
fx += [['swish', o['muro'] - 0.05, 0.7]] + [['encaje', o['muro'] + 0.12 * r + 0.3, 0.5] for r in range(5)] + [['chime', o['muro'] + 1.0, 0.5]]
fx += [['deslizar', o['parte'], 0.6], ['golpe', o['socio'], 0.7], ['golpe', o['equipo'], 0.7], ['pop', o['herramientas'], 0.5], ['impacto', o['amazonas'], 0.6]]
fx += [['deslizar', o['cta'] - 0.1, 0.7], ['golpe', o['cta'] + 0.2, 0.8], ['notificacion', o['contacto'], 0.7], ['check', o['cierre'], 0.7]]
o['fx'] = fx
o = json.loads(json.dumps(o), parse_float=lambda x: round(float(x), 3))
json.dump(o, open('src/tiemposN.json', 'w'), ensure_ascii=False, indent=1); print('ok', len(fx), 'efectos')
