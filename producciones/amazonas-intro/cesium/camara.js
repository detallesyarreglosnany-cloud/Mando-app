// Trayectoria de cámara a partir de config/recorrido.json.
// Interpola, en el tiempo normalizado u (0..1), el punto mirado (lat, lng), la distancia (en escala logarítmica, para que
// el acercamiento desde el espacio sea acelerado y suave), el rumbo y la inclinación, con curvas de Hermite
// (Catmull-Rom no uniforme): velocidad continua, sin frenazos ni saltos. Entre paradas lejanas inserta un punto
// intermedio más alto, para que el traslado sea un arco aéreo y no un barrido mareador a ras del suelo.
function construirRuta(cfg, alturaFn) {
	const K = [];
	cfg.camara.forEach((c) => K.push({t: c.t, lat: c.lat, lng: c.lng, rango: c.rango_m, rumbo: c.rumbo, inc: c.inclinacion}));
	const p = cfg.paradas;
	p.forEach((s, i) => {
		const prev = i === 0 ? K[K.length - 1] : {lat: p[i - 1].lat, lng: p[i - 1].lng, t: p[i - 1].t, rango: p[i - 1].rango_m, rumbo: p[i - 1].rumbo};
		const dist = distanciaM(prev.lat, prev.lng, s.lat, s.lng);
		if (i > 0 && dist > 8000) {
			K.push({t: (prev.t + s.t) / 2, lat: (prev.lat + s.lat) / 2, lng: (prev.lng + s.lng) / 2,
				rango: Math.max(prev.rango, s.rango_m, dist * 0.9), rumbo: angMedio(prev.rumbo, s.rumbo), inc: -62});
		}
		K.push({t: s.t, lat: s.lat, lng: s.lng, rango: s.rango_m, rumbo: s.rumbo, inc: s.inclinacion});
	});
	const ult = p[p.length - 1];
	K.push({t: cfg.final.t, lat: ult.lat, lng: ult.lng, rango: cfg.final.rango_m, rumbo: cfg.final.rumbo, inc: cfg.final.inclinacion});
	K.sort((a, b) => a.t - b.t);
	// rumbo sin saltos de 360°
	for (let i = 1; i < K.length; i++) { while (K[i].rumbo - K[i - 1].rumbo > 180) K[i].rumbo -= 360; while (K[i].rumbo - K[i - 1].rumbo < -180) K[i].rumbo += 360; }
	// altura del suelo en cada punto clave (se interpola suave: el punto mirado no tiembla con el relieve)
	K.forEach((k) => { k.suelo = k.rango < 200000 && alturaFn ? alturaFn(k.lat, k.lng) * (cfg.exageracion_relieve || 1) : 0; k.lr = Math.log(k.rango); });

	const canales = ['lat', 'lng', 'lr', 'rumbo', 'inc', 'suelo'];
	const T = K.map((k) => k.t);
	const tangente = (c, i) => (i === 0 || i === K.length - 1) ? 0 : (K[i + 1][c] - K[i - 1][c]) / (T[i + 1] - T[i - 1]);
	return (u) => {
		u = Math.max(0, Math.min(1, u));
		let i = 0; while (i < K.length - 2 && u > T[i + 1]) i++;
		const h = T[i + 1] - T[i], s = h > 0 ? (u - T[i]) / h : 0;
		const h00 = 2 * s ** 3 - 3 * s ** 2 + 1, h10 = s ** 3 - 2 * s ** 2 + s, h01 = -2 * s ** 3 + 3 * s ** 2, h11 = s ** 3 - s ** 2;
		const o = {};
		canales.forEach((c) => { o[c] = h00 * K[i][c] + h10 * h * tangente(c, i) + h01 * K[i + 1][c] + h11 * h * tangente(c, i + 1); });
		return {lat: o.lat, lng: o.lng, rango: Math.exp(o.lr), rumbo: o.rumbo, inclinacion: Math.min(-5, o.inc), alturaSuelo: o.suelo};
	};
}
function distanciaM(a1, o1, a2, o2) {
	const R = 6371000, r = Math.PI / 180, dA = (a2 - a1) * r, dO = (o2 - o1) * r;
	const x = Math.sin(dA / 2) ** 2 + Math.cos(a1 * r) * Math.cos(a2 * r) * Math.sin(dO / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(x));
}
function angMedio(a, b) { let d = b - a; while (d > 180) d -= 360; while (d < -180) d += 360; return a + d / 2; }
if (typeof module !== 'undefined') module.exports = {construirRuta, distanciaM};
