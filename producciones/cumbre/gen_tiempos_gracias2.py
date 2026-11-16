# Línea de tiempo del video "Un antes y un después" (agradecimiento a los 28 patrocinadores): la leen
# src/Gracias2.tsx y mezcla_gracias2.py.
import json
T = json.load(open('vozH/tiempos.json'))
w = lambda k, palabra, n=0: [p[1] for p in T[k]['palabras'] if p[0] == palabra][n]
D = 8.0  # caída de la música = título de la cumbre
V = {'01': 0.2, '02': 4.1, '03': 8.1, '04': 12.6, '05': 18.2, '06': 35.0, '07': 46.8, '08': 50.2}
orden = sorted(V)
for a, b in zip(orden, orden[1:]): assert V[a] + T[a]['dur'] <= V[b] + 0.05, (a, V[a] + T[a]['dur'], V[b])
N = 28
o = {'D': D, 'DUR': 57.0, 'V': V, 'E': {'gancho': [0, 4.0], 'ponentes': [4.0, 8.0], 'titulo': [8.0, 12.5], 'valor': [12.5, 18.0], 'logos': [18.0, 50.0], 'cta': [50.0, 57.0]},
 'antes': V['01'] + w('01', 'antes'), 'despues': V['01'] + w('01', 'después'), 'ponentes': [4.0, 4.5, 5.0, 5.5], 'apagon': 7.4,
 'pilares': [V['04'] + w('04', x) for x in ('liderar', 'vender', 'crecer')],
 'logos': [18.5 + 1.0 * i for i in range(N)], 'por_logo': 1.0,
 'frases': [V['05'] + w('05', 'los', 0), V['05'] + w('05', 'los', 1), V['05'] + w('05', 'los', 2), V['06']], 'frases_fin': [V['05'] + 3.7, V['05'] + 6.0, V['05'] + 9.6, V['06'] + 3.6],
 'muro': 46.5, 'gracias': V['07'] + w('07', 'gracias'), 'venta': V['08'] + w('08', 'venta'), 'asegura': V['08'] + w('08', 'asegura'), 'vive': V['08'] + w('08', 'vive'), 'contacto': 54.0}
o = json.loads(json.dumps(o), parse_float=lambda x: round(float(x), 3))
PICO = {'zoom': 0, 'impacto': 0.02, 'explosion': 0.25, 'swish': 0.15, 'swish2': 0.13, 'pop': 0.01, 'chime': 0, 'riser': 1.42, 'golpe': 0}
fx = [['zoom', 0.0, 0.45], ['golpe', o['antes'], 0.8], ['impacto', o['despues'], 0.8]]
fx += [['swish', t, 0.6] for t in o['ponentes']] + [['golpe', t, 0.9] for t in o['ponentes']] + [['golpe', o['apagon'], 1.0], ['riser', D, 0.6], ['explosion', D, 1.0]]
fx += [['swish', 12.5, 0.8]] + [['golpe', t, 1.0] for t in o['pilares']] + [['swish2', 18.0, 0.8]]
fx += [['golpe', t, 0.85] for t in o['logos']] + [['swish2', t + 0.8, 0.3] for t in o['logos']]
fx += [['impacto', o['muro'], 0.9], ['chime', o['muro'] + 0.1, 0.8], ['golpe', o['gracias'], 0.9], ['swish', 50.0, 0.8], ['golpe', o['venta'], 0.9], ['golpe', o['asegura'], 0.7], ['impacto', o['vive'] + 1.1, 0.6], ['pop', o['contacto'], 0.5], ['chime', o['contacto'] + 0.3, 0.6]]
o['fx'] = [[n, round(t - PICO[n], 3), g] for n, t, g in fx]
json.dump(o, open('src/tiemposH.json', 'w'), ensure_ascii=False, indent=1); print('ok', len(o['fx']), 'efectos')
