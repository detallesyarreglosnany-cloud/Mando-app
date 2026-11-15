# Línea de tiempo del video de agradecimiento ("El muro"): la leen src/Gracias.tsx y mezcla_gracias.py.
import json
T = json.load(open('vozG/tiempos.json'))
w = lambda k, palabra, n=0: [p[1] for p in T[k]['palabras'] if p[0] == palabra][n]
D = 2.0  # caída de la música = primer logo
V = {'01': 0.25, '02': 2.3, '03': 8.7, '04': 12.6, '05': 24.7, '06': 28.6, '07': 33.2}
orden = sorted(V)
for a, b in zip(orden, orden[1:]): assert V[a] + T[a]['dur'] <= V[b] + 0.05, (a, V[a] + T[a]['dur'], V[b])
N = 26
o = {'D': D, 'DUR': 39.5, 'V': V, 'E': {'gancho': [0, 2.0], 'muro': [2.0, 12.5], 'valor': [12.5, 24.5], 'espacio': [24.5, 33.0], 'cierre': [33.0, 39.5]},
 'logos': [D + 0.25 * i for i in range(N)], 'completo': 8.5, 'realidad': V['03'] + w('03', 'esta'),
 'tarde': V['04'] + w('04', 'una'), 'pilares': [V['04'] + w('04', x) for x in ('liderar', 'vender', 'crecer')], 'numeros': V['04'] + w('04', 'números'), 'marca': V['04'] + w('04', 'marca'),
 'queda': V['05'] + w('05', 'queda'), 'hoy': V['05'] + w('05', 'hoy'), 'horas': 28.5, 'oportunidad': V['06'] + w('06', 'oportunidad'),
 'mapa': V['07'] + w('07', 'mapa'), 'ytu': V['07'] + w('07', 'y'), 'contacto': 36.7, 'lemas': [37.5, 38.0, 38.5]}
o = json.loads(json.dumps(o), parse_float=lambda x: round(float(x), 3))
PICO = {'zoom': 0, 'impacto': 0.02, 'explosion': 0.25, 'swish': 0.15, 'swish2': 0.13, 'pop': 0.01, 'chime': 0, 'riser': 1.42, 'golpe': 0}
fx = [['golpe', V['01'] + 0.7, 0.9], ['riser', D, 0.7], ['explosion', D, 0.9]]
fx += [['pop', t, 0.5] for t in o['logos']] + [['swish2', t, 0.25] for t in o['logos'][::2]]
fx += [['impacto', o['completo'], 0.9], ['chime', o['completo'] + 0.1, 0.8], ['golpe', o['realidad'], 0.7]]
fx += [['swish', 12.5, 0.8], ['golpe', o['tarde'], 0.7]] + [['golpe', t, 1.0] for t in o['pilares']] + [['pop', o['numeros'], 0.5], ['pop', o['marca'], 0.5]]
fx += [['swish2', 24.5, 0.8], ['chime', o['queda'] + 0.4, 0.6], ['golpe', o['hoy'], 1.0], ['riser', o['horas'], 0.6], ['impacto', o['horas'], 1.0], ['golpe', o['oportunidad'], 0.7]]
fx += [['swish', 33.0, 0.8], ['zoom', 33.0, 0.5], ['impacto', o['mapa'], 0.9], ['golpe', o['ytu'] + 0.19, 0.9], ['swish2', o['contacto'], 0.6], ['pop', o['contacto'] + 0.2, 0.5]] + [['golpe', t, 0.9] for t in o['lemas']] + [['chime', o['lemas'][2], 0.6]]
o['fx'] = [[n, round(t - PICO[n], 3), g] for n, t, g in fx]
json.dump(o, open('src/tiemposG.json', 'w'), ensure_ascii=False, indent=1); print('ok', len(o['fx']), 'efectos')
