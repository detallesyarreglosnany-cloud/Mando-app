# Línea de tiempo única del video de 59 s: la leen el montaje (src/Patro59.tsx) y la mezcla (mezcla59.py).
import json
T = json.load(open('voz59/tiempos.json'))
w = lambda k, palabra, n=0: [p[1] for p in T[k]['palabras'] if p[0] == palabra][n]
EX, GOLPE = 4.5, 3.5   # explosión del título (caída de la música) y llegada a Club Parapata
V = {'01': 0.35, '02': 4.6, '03': 7.1, '04': 11.25, '05': 18.6, '06': 21.1, '07': 24.6, '08': 28.1, '09': 31.1, '10': 34.6, '11': 37.3, '12': 40.1, '13': 43.3, '14': 45.6, '15': 48.2, '16': 50.7}
DUR = 56.6
E = {'intro': [0, 7.0], 'pilares': [7.0, 18.5], 'red': [31.0, 34.5], 'patro': [34.5, 40.0], 'invita': [40.0, 45.5], 'web': [45.5, 50.5], 'cierre': [50.5, DUR]}
LIM = [18.5, 21.0, 24.5, 28.0, 31.0]
for k in V: assert True
orden = sorted(V); 
for a, b in zip(orden, orden[1:]):
    if a != '01': assert V[a] + T[a]['dur'] <= V[b] + 0.05, (a, V[a] + T[a]['dur'], V[b])
o = {'EX': EX, 'GOLPE': GOLPE, 'DUR': DUR, 'V': {'v' + k: v for k, v in V.items()}, 'E': E, 'LIM': LIM,
 'pilares': [V['03'] + w('03', x) for x in ('lidera', 'vende', 'crece')],
 'items': [V['04'] + w('04', x) for x in ('capacita', 'organiza', 'posiciona')], 'papel': V['04'] + w('04', 'y'),
 'frases': [V['05'] + w('05', 'lidera'), V['06'] + w('06', 'organiza'), V['07'] + w('07', 'transformación'), V['08'] + w('08', 'posiciona')],
 'red': [V['09'] + w('09', x) for x in ('conecta', 'intercambia', 'consigue')],
 'logos': [34.75 + 0.25 * i for i in range(18)],
 'invita2': V['13'], 'tecleo': 45.6, 'por_letra': 0.05, 'enter': 46.5, 'whatsapp': V['15'] + 0.9,
 'lemas': [V['16'] + w('16', x) for x in ('lidera', 'vende', 'crece')],
 'rotulos': [['4 DE DICIEMBRE', 0.45, 1.2], ['VENEZUELA', 1.2, 1.75], ['AMAZONAS', 1.75, 2.3], ['PUERTO AYACUCHO', 2.3, 3.0]]}
o = json.loads(json.dumps(o), parse_float=lambda x: round(float(x), 3))
# efectos: [archivo, segundo en que debe caer su pico, ganancia]
PICO = {'zoom': 0, 'impacto': 0.02, 'explosion': 0.25, 'swish': 0.15, 'swish2': 0.13, 'pop': 0.01, 'teclas': 0, 'chime': 0, 'riser': 1.42, 'golpe': 0}
fx = [['zoom', 0.0, 0.9], ['riser', GOLPE, 0.5], ['impacto', GOLPE, 1.0], ['explosion', EX, 1.0]]
fx += [['swish2', r[1], 0.45] for r in o['rotulos']]
cortes = [E['pilares'][0]] + LIM + [E['patro'][0], E['invita'][0], E['web'][0], E['cierre'][0]]
fx += [[('swish', 'swish2')[i % 2], t, 0.75] for i, t in enumerate(cortes)]
fx += [['golpe', t, 0.9] for t in o['pilares'] + o['red'] + o['lemas'] + o['frases'] + [V['12'], V['12'] + 0.53, o['invita2'], E['cierre'][0] + 0.13]]
fx += [['pop', t, 0.55] for t in o['items']] + [['pop', t, 0.4] for t in o['logos']] + [['pop', o['whatsapp'], 0.6]]
fx += [['swish', o['papel'] + 0.5, 0.5], ['chime', o['papel'] + 1.1, 0.7], ['chime', V['11'], 0.6], ['riser', E['patro'][0], 0.3], ['riser', E['cierre'][0], 0.35]]
fx += [['teclas', o['tecleo'], 0.9], ['golpe', o['enter'], 0.9], ['chime', o['enter'] + 0.05, 0.8], ['swish', o['enter'] + 0.15, 0.6], ['impacto', o['lemas'][2], 0.5]]
o['fx'] = [[n, round(t - PICO[n], 3), g] for n, t, g in fx]
json.dump(o, open('src/tiempos59.json', 'w'), ensure_ascii=False, indent=1); print('ok', len(o['fx']), 'efectos')
