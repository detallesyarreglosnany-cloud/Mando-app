// Rediseños a UNA TINTA (negro sobre transparente). Cada función devuelve {w, h, cuerpo}.
// Regla de grosor: ninguna línea por debajo del 2% del ancho del logo.
const {txt, arco, ancho, hoja, laurel} = require('./lib');
const P = (d, extra = '') => `<path d="${d}" ${extra}/>`;
// Calado: todo lo que esté dentro de <mask> en negro queda transparente
const mascara = (id, w, h, huecos) => `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#fff"/><g fill="#000" stroke="#000">${huecos}</g></mask>`;
// Letras con contorno tipo calcomanía: borde exterior + filete calado + letra llena
const rotulo = (id, d, w, h, borde, filete) => `${mascara(id, w, h, `<path d="${d}" fill="none" stroke-width="${filete}" stroke-linejoin="round"/>`)}
	<path d="${d}" fill="#000" stroke="#000" stroke-width="${borde}" stroke-linejoin="round" mask="url(#${id})"/><path d="${d}" fill="#000"/>`;

const L = {};

// ── Laboratorio Betty Guillén: anillo con el nombre calado, ADN y microscopio
L['betty-guillen'] = () => {
	const W = 1000, c = 500;
	const textos = arco('BETTY GUILLEN', 'm9', 74, c, c, 418, {ls: 8}) + arco('LABORATORIO DE ESP. CLÍNICAS Y BACTERIOLÓGICAS', 'm9', 33, c, c, 462, {abajo: true, ls: 1.5})
		+ `<circle cx="${c - 437}" cy="${c}" r="11"/><circle cx="${c + 437}" cy="${c}" r="11"/>`;
	let adn = '', pasos = 15;
	const hebra = (fase) => { let d = ''; for (let i = 0; i <= 60; i++) { const t = i / 60, y = -250 + 500 * t, x = 78 * Math.sin(t * Math.PI * 2.5 + fase); d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); } return d; };
	for (let i = 1; i < pasos; i++) { const t = i / pasos, y = -250 + 500 * t, x = 78 * Math.sin(t * Math.PI * 2.5); if (Math.abs(x) > 30) adn += `<line x1="${-x * 0.82}" y1="${y}" x2="${x * 0.82}" y2="${y}" stroke="#000" stroke-width="18" stroke-linecap="round"/>`; }
	adn += `<path d="${hebra(0)}" fill="none" stroke="#000" stroke-width="24" stroke-linecap="round"/><path d="${hebra(Math.PI)}" fill="none" stroke="#000" stroke-width="24" stroke-linecap="round"/>`;
	const micro = `<g transform="translate(${c + 175},${c - 95}) scale(1.05)">
		<rect x="-14" y="-118" width="34" height="96" rx="8" transform="rotate(-28)"/><rect x="-32" y="-140" width="56" height="26" rx="6" transform="rotate(-28)"/>
		<path d="M-10,-18 C-75,-5 -80,70 -20,95" fill="none" stroke="#000" stroke-width="26" stroke-linecap="round"/>
		<rect x="-60" y="10" width="90" height="20" rx="6"/><rect x="-75" y="96" width="150" height="26" rx="10"/></g>`;
	return {w: W, h: W, cuerpo: `${mascara('mB', W, W, textos)}
		<circle cx="${c}" cy="${c}" r="440" fill="none" stroke="#000" stroke-width="110" mask="url(#mB)"/>
		<circle cx="${c}" cy="${c}" r="352" fill="none" stroke="#000" stroke-width="18"/>
		<g transform="translate(${c - 50},${c + 10}) rotate(-15)">${adn}</g>${micro}`};
};

// ── Condimentos del Sur: sello con mortero, hojas y "AMAZONAS" en cinta
L['condimentos'] = () => {
	const W = 1000, c = 500;
	const mortero = `<g transform="translate(${c},${c + 10}) scale(0.9)">
		<rect x="40" y="-235" width="52" height="230" rx="26" transform="rotate(32)"/>
		<path d="M-175,-20 L175,-20 C175,95 95,150 0,150 C-95,150 -175,95 -175,-20Z"/>
		<rect x="-200" y="-48" width="400" height="40" rx="20"/><rect x="-70" y="150" width="140" height="34" rx="12"/>
		${hoja(-150, -120, 130, 42, -55)}${hoja(-215, -70, 110, 36, -20)}
		<circle cx="-60" cy="-95" r="16"/><circle cx="-10" cy="-125" r="12"/><circle cx="-105" cy="-130" r="10"/></g>`;
	const cinta = `<path d="M180,808 L820,808 L792,850 L820,892 L180,892 L208,850Z"/>`;
	return {w: W, h: W, cuerpo: `
		<circle cx="${c}" cy="${c}" r="472" fill="none" stroke="#000" stroke-width="26"/><circle cx="${c}" cy="${c}" r="430" fill="none" stroke="#000" stroke-width="10"/>
		<g>${arco('CONDIMENTOS', 'lilita', 104, c, c + 40, 318, {ls: 3})}</g>
		${mortero}
		${P(txt('DEL SUR', 'lilita', 108, c, 735, {ls: 6}))}${P(txt('AROMA & CALIDAD', 'm9', 34, c, 785, {ls: 6}))}
		${mascara('mC', W, W, P(txt('AMAZONAS', 'm9', 50, c, 869, {ls: 10})))}<g mask="url(#mC)">${cinta}</g>`};
};

// ── Wahari Pizza: tepuy, círculo, rotulación con contorno y porción de pizza
L['wahari'] = () => {
	const W = 1200, H = 980;
	const dW = txt('WAHARI', 'bowlby', 236, 600, 520, {ls: 6}), dP = txt('Pizza', 'pacifico', 250, 600, 820);
	const tepuy = `<path d="M330,330 L410,250 L470,265 L520,205 L700,205 L760,250 L820,240 L880,330Z"/>`;
	const pizza = `<g transform="translate(318,560) rotate(-24) scale(0.78)"><path d="M0,0 L-80,210 Q0,240 80,210Z" fill="none" stroke="#000" stroke-width="22" stroke-linejoin="round"/>
		<path d="M-82,206 Q0,250 82,206" fill="none" stroke="#000" stroke-width="36" stroke-linecap="round"/><circle cx="-6" cy="90" r="20"/><circle cx="-28" cy="160" r="18"/><circle cx="30" cy="150" r="16"/></g>`;
	return {w: W, h: H, cuerpo: `
		${mascara('mW0', W, H, `<path d="${dW}" stroke-width="58" stroke-linejoin="round"/><path d="${dP}" stroke-width="58" stroke-linejoin="round"/>`)}
		<g mask="url(#mW0)"><circle cx="600" cy="560" r="400" fill="none" stroke="#000" stroke-width="26"/>${tepuy}</g>
		${rotulo('mW1', dW, W, H, 44, 20)}${rotulo('mW2', dP, W, H, 44, 20)}`};
};

// ── Shabono by Nelson Méndez: monograma NM partido y firma con separación propia
L['shabono'] = () => {
	const W = 1200, H = 760;
	const nm = txt('NM', 'playfair', 560, 600, 700, {ls: -10}), firma = txt('Nelson Méndez', 'vibes', 168, 600, 492);
	return {w: W, h: H, cuerpo: `
		${P(txt('SHABONO BY', 'm9', 66, 600, 200, {ls: 14}))}
		${mascara('mS', W, H, `<rect x="0" y="404" width="${W}" height="104"/><path d="${firma}" stroke-width="30" stroke-linejoin="round"/>`)}
		<path d="${nm}" mask="url(#mS)"/>
		<path d="${firma}"/>`};
};

// ── Gran Hotel Apure: corona, escudo con H y A, y nombre
L['gran-hotel-apure'] = () => {
	const W = 1000, H = 1190;
	const corona = `<path d="M330,215 L300,70 L410,150 L500,40 L590,150 L700,70 L670,215Z"/><rect x="322" y="228" width="356" height="34" rx="10"/>`;
	const escudo = 'M245,470 L755,470 L755,690 C755,860 640,955 500,1000 C360,955 245,860 245,690Z';
	const dH = txt('H', 'cinzel', 320, 500, 760), dA = txt('A', 'cinzel', 170, 500, 935);
	const linea = (x1, x2, y) => `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="16" rx="8"/>`;
	return {w: W, h: H, cuerpo: `${corona}
		${P(txt('GRAN', 'cinzel', 84, 500, 345, {ls: 10}))}
		${P(txt('HOTEL', 'cinzel', 112, 500, 455, {ls: 34}))}${linea(60, 200, 418)}${linea(800, 940, 418)}
		<path d="${escudo}" fill="none" stroke="#000" stroke-width="34" stroke-linejoin="round" transform="translate(0,40)"/>
		<path d="${escudo}" fill="none" stroke="#000" stroke-width="12" stroke-linejoin="round" transform="translate(500,580) scale(0.86) translate(-500,-580) translate(0,40)"/>
		${P(dH)}${P(dA)}
		${P(txt('APURE', 'm9', 190, 500, 1180, {ls: 8}))}${linea(20, 120, 1100)}${linea(880, 980, 1100)}`};
};

// ── Ferretería Reyes & Rivero: arco, laureles, mezcladora y placa
L['reyes-rivero'] = () => {
	const W = 1100, H = 1120, cx = 550, cy = 560;
	const mezcladora = `<g transform="translate(${cx},${cy + 10})">
		<path d="M-120,-150 L90,-185 L150,40 L-60,75Z"/>
		<rect x="140" y="-150" width="90" height="230" rx="14"/>
		<path d="M-60,75 L-150,160 M60,60 L20,160" stroke="#000" stroke-width="30" stroke-linecap="round"/>
		<circle cx="120" cy="170" r="72" fill="none" stroke="#000" stroke-width="30"/><circle cx="120" cy="170" r="20"/>
		<circle cx="-200" cy="-40" r="70" fill="none" stroke="#000" stroke-width="22"/><path d="M-200,-40 L-120,-60" stroke="#000" stroke-width="22"/>
		<rect x="-210" y="150" width="120" height="26" rx="10"/></g>`;
	const bandas = `<path d="M-108,-104 L105,-140 M-92,-44 L122,-80 M-76,16 L138,-20" stroke-width="22" stroke-linecap="round" transform="translate(${cx},${cy + 10})"/>`;
	return {w: W, h: H, cuerpo: `
		${arco('FERRETERÍA', 'lilita', 150, cx, cy + 40, 360, {ls: 6})}
		${laurel(cx, cy + 40, 430, 205, 140, 5, 92, 34, 1)}${laurel(cx, cy + 40, 430, -25, 40, 5, 92, 34, -1)}
		${mascara('mR', W, H, bandas)}<g mask="url(#mR)">${mezcladora}</g>
		<rect x="120" y="808" width="860" height="292" rx="36" fill="none" stroke="#000" stroke-width="20"/>
		${P(txt('INVERSIONES Y CONSTRUCCIONES', 'm9', 31, cx, 872, {ls: 1}))}
		${P(txt('REYES & RIVERO C.A.', 'm9', 74, cx, 975))}
		${P(txt('INNOVAMOS · SERVIMOS', 'm7', 38, cx, 1052, {ls: 6}))}`};
};

// ── La Esquina Caliente: anillo con textos calados, horno con llama, pan y cinta con el nombre
L['esquina-caliente'] = () => {
	const W = 1000, c = 500;
	const textos = arco('PANADERÍA Y CHARCUTERÍA', 'm9', 58, c, c, 416, {ls: 4}) + arco('RESTAURANTE · CHARCUTERÍA · VANGUARDISTA', 'm9', 30, c, c, 464, {abajo: true, ls: 1});
	const horno = `<g transform="translate(${c},${c - 30})">
		<path d="M-230,120 L-230,-10 C-230,-170 230,-170 230,-10 L230,120Z"/>
		<path d="M-120,120 L-120,30 C-120,-60 120,-60 120,30 L120,120Z" fill="#fff"/></g>`;
	const llama = `<path transform="translate(${c},${c + 60})" d="M0,-120 C40,-70 85,-40 70,10 C60,45 30,55 0,55 C-30,55 -60,45 -70,10 C-80,-30 -40,-50 -30,-90 C-10,-60 0,-50 10,-60 C20,-80 5,-100 0,-120Z"/>`;
	const pan = `<g transform="translate(${c},${c - 245})"><path d="M-150,40 C-150,-30 -80,-60 0,-60 C80,-60 150,-30 150,40Z"/>
		<path d="M-70,-30 L-40,20 M0,-40 L20,20 M70,-30 L80,20" stroke="#fff" stroke-width="18" stroke-linecap="round"/></g>`;
	const huecoHorno = `<path transform="translate(${c},${c - 30})" d="M-120,120 L-120,30 C-120,-60 120,-60 120,30 L120,120Z"/>
		<path transform="translate(${c},${c - 245})" d="M-70,-30 L-40,20 M0,-40 L20,20 M70,-30 L80,20" stroke-width="18" stroke-linecap="round" fill="none"/>`;
	const dN = txt('LA ESQUINA CALIENTE', 'lilita', 80, c, 744, {ls: 2});
	return {w: W, h: W, cuerpo: `${mascara('mE', W, W, textos)}${mascara('mE2', W, W, huecoHorno)}${mascara('mE3', W, W, `<path d="${dN}"/>`)}
		<g mask="url(#mE3)"><circle cx="${c}" cy="${c}" r="440" fill="none" stroke="#000" stroke-width="104" mask="url(#mE)"/>
		<g mask="url(#mE2)"><path transform="translate(${c},${c - 30})" d="M-230,120 L-230,-10 C-230,-170 230,-170 230,-10 L230,120Z"/>
		<path transform="translate(${c},${c - 245})" d="M-150,40 C-150,-30 -80,-60 0,-60 C80,-60 150,-30 150,40Z"/></g>${llama}
		<path d="M40,660 L960,660 L922,715 L960,770 L40,770 L78,715Z"/></g>`};
};

// ── Club Parapata: sello con nombre en arco, edificio del club, palmas y cinta CLUB PRIVADO
L['parapata'] = () => {
	const W = 1000, c = 500;
	const textos = arco('CDAD. PARAPATA', 'lilita', 96, c, c, 398, {ls: 6}) + arco('EL CLUB DE LOS MEJORES EVENTOS', 'm9', 32, c, c, 452, {abajo: true, ls: 2});
	const palma = (x, s) => `<g transform="translate(${x},640) scale(${s * 0.85},0.85)"><path d="M0,0 C-6,-90 6,-170 0,-230" fill="none" stroke="#000" stroke-width="22" stroke-linecap="round"/>
		${hoja(-55, -235, 120, 26, 20)}${hoja(55, -235, 120, 26, -20)}${hoja(-40, -270, 100, 24, -35)}${hoja(40, -270, 100, 24, 35)}${hoja(0, -290, 90, 22, 90)}</g>`;
	const edificio = `<g transform="translate(${c},0)">
		<path d="M-250,345 L0,265 L250,345 L250,375 L-250,375Z"/>
		<rect x="-215" y="395" width="430" height="22" rx="6"/>
		${[-180, -105, -30, 45, 120].map((x) => `<rect x="${x}" y="430" width="55" height="70" rx="6"/>`).join('')}
		<rect x="-230" y="515" width="460" height="22" rx="6"/>
		${[-180, -105, 45, 120].map((x) => `<rect x="${x}" y="550" width="55" height="70" rx="6"/>`).join('')}
		<path d="M-30,630 L-30,555 C-30,530 30,530 30,555 L30,630Z"/><rect x="-250" y="630" width="500" height="22" rx="6"/></g>`;
	const cinta = 'M110,668 L890,668 L852,724 L890,780 L110,780 L148,724Z';
	const dC = txt('CLUB PRIVADO', 'lilita', 84, c, 756, {ls: 4});
	return {w: W, h: W, cuerpo: `${mascara('mP', W, W, textos)}${mascara('mP2', W, W, `<path d="${dC}"/>`)}
		<circle cx="${c}" cy="${c}" r="432" fill="none" stroke="#000" stroke-width="112" mask="url(#mP)"/>
		${edificio}${palma(196, 1)}${palma(804, -1)}
		<path d="${cinta}" mask="url(#mP2)"/>`};
};

// ── Farma-Descuento Ayacucho Plus: disco, cápsula guiñando con corazón y cruz, textos en arco
L['farma'] = () => {
	const W = 1000, c = 500;
	const capsula = `<g transform="translate(${c + 60},${c + 40}) rotate(12)">
		<path d="M-95,40 L-95,-120 C-95,-245 95,-245 95,-120 L95,40Z"/>
		<path d="M-95,40 L95,40 L95,170 C95,280 -95,280 -95,170Z" fill="none" stroke="#000" stroke-width="26"/></g>`;
	const cara = `<g transform="translate(${c + 60},${c + 40}) rotate(12)"><circle cx="-38" cy="-100" r="28"/><path d="M22,-104 Q48,-124 70,-104" stroke-width="16" fill="none" stroke-linecap="round"/>
		<path d="M-50,-30 Q0,20 55,-30" stroke-width="18" fill="none" stroke-linecap="round"/></g>`;
	const corazon = `<path transform="translate(${c - 150},${c + 120}) scale(1.15)" d="M0,70 C-90,10 -120,-40 -90,-80 C-62,-115 -15,-105 0,-70 C15,-105 62,-115 90,-80 C120,-40 90,10 0,70Z"/>`;
	const cruz = `<path transform="translate(${c - 150},${c + 105})" d="M-16,-55 L16,-55 L16,-16 L55,-16 L55,16 L16,16 L16,55 L-16,55 L-16,16 L-55,16 L-55,-16 L-16,-16Z"/>`;
	return {w: W, h: W, cuerpo: `${mascara('mF', W, W, `${cara}${cruz}`)}
		<circle cx="${c}" cy="${c}" r="470" fill="none" stroke="#000" stroke-width="24"/>
		${arco('FARMA-DESCUENTO', 'lilita', 96, c, c, 360, {ls: 3})}
		${arco('AYACUCHO PLUS', 'lilita', 80, c, c, 272, {ls: 3})}
		<g mask="url(#mF)">${capsula}${corazon}</g>
		${arco('AL SERVICIO DE SU SALUD', 'm9', 40, c, c, 432, {abajo: true, ls: 4})}`};
};
module.exports = L;
