// Utilidades para logos a UNA TINTA en vector: texto convertido a trazos (opentype.js), texto en arco,
// laureles y máscaras de calado. Todo se dibuja en negro (#000); el blanco del pendón es la misma pieza recoloreada.
const ot = require('opentype.js');
const path = require('path');
const fs = require('fs');
const FS = (p) => path.join(__dirname, 'node_modules/@fontsource', p);
const ARCH = {
	lilita: 'lilita-one/files/lilita-one-latin-400-normal.woff',
	pacifico: 'pacifico/files/pacifico-latin-400-normal.woff',
	vibes: 'great-vibes/files/great-vibes-latin-400-normal.woff',
	playfair: 'playfair-display/files/playfair-display-latin-900-normal.woff',
	cinzel: 'cinzel/files/cinzel-latin-900-normal.woff',
	m9: 'montserrat/files/montserrat-latin-900-normal.woff',
	m7: 'montserrat/files/montserrat-latin-700-normal.woff',
	anton: 'anton/files/anton-latin-400-normal.woff',
	bowlby: 'bowlby-one/files/bowlby-one-latin-400-normal.woff',
	dancing: 'dancing-script/files/dancing-script-latin-700-normal.woff',
};
const FONT = {};
for (const [k, f] of Object.entries(ARCH)) {
	const b = fs.readFileSync(FS(f));
	FONT[k] = ot.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
}
const esc = (n) => n.toFixed(2);
function glifos(s, f, size, ls) {
	const font = FONT[f], gl = font.stringToGlyphs(s), k = size / font.unitsPerEm;
	return gl.map((g, i) => ({g, adv: g.advanceWidth * k + (i < gl.length - 1 ? font.getKerningValue(g, gl[i + 1]) * k + ls : 0)}));
}
function ancho(s, f, size, ls = 0) { return glifos(s, f, size, ls).reduce((a, b) => a + b.adv, 0); }
// Texto recto → atributo d de un <path>
function txt(s, f, size, x, y, {anchor = 'middle', ls = 0} = {}) {
	const gs = glifos(s, f, size, ls), w = gs.reduce((a, b) => a + b.adv, 0);
	let cx = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x, d = '';
	for (const {g, adv} of gs) { d += g.getPath(cx, y, size).toPathData(2); cx += adv; }
	return d;
}
// Texto en arco. arriba: se lee en sentido horario, la letra crece hacia fuera desde el radio r.
// abajo: se lee de izquierda a derecha por la parte inferior, la letra crece hacia el centro desde r.
function arco(s, f, size, cx, cy, r, {abajo = false, ls = 0} = {}) {
	const gs = glifos(s, f, size, ls), total = gs.reduce((a, b) => a + b.adv, 0);
	let out = '', s0 = 0;
	for (const {g, adv} of gs) {
		const w = g.advanceWidth * size / FONT[f].unitsPerEm;
		const mid = abajo ? Math.PI / 2 + total / (2 * r) - (s0 + w / 2) / r : -Math.PI / 2 - total / (2 * r) + (s0 + w / 2) / r;
		const x = cx + r * Math.cos(mid), y = cy + r * Math.sin(mid);
		const rot = mid * 180 / Math.PI + (abajo ? -90 : 90);
		out += `<path transform="translate(${esc(x)},${esc(y)}) rotate(${esc(rot)})" d="${g.getPath(-w / 2, 0, size).toPathData(2)}"/>`;
		s0 += adv;
	}
	return out;
}
// Hoja de laurel (forma de almendra) centrada en (x,y), largo l, ancho a, ángulo ang (grados)
function hoja(x, y, l, a, ang) {
	return `<path transform="translate(${esc(x)},${esc(y)}) rotate(${esc(ang)})" d="M${-l / 2},0 Q0,${-a} ${l / 2},0 Q0,${a} ${-l / 2},0Z"/>`;
}
// Rama de laurel siguiendo un arco: de a0 a a1 (grados), radio r, lado ±1
function laurel(cx, cy, r, a0, a1, n, l, a, lado) {
	let o = `<path d="M${esc(cx + r * Math.cos(a0 * Math.PI / 180))},${esc(cy + r * Math.sin(a0 * Math.PI / 180))} A${r},${r} 0 0 ${a1 > a0 ? 1 : 0} ${esc(cx + r * Math.cos(a1 * Math.PI / 180))},${esc(cy + r * Math.sin(a1 * Math.PI / 180))}" fill="none" stroke="#000" stroke-width="${a * 0.35}" stroke-linecap="round"/>`;
	for (let i = 0; i < n; i++) {
		const t = (a0 + (a1 - a0) * (i + 0.5) / n) * Math.PI / 180, tg = t * 180 / Math.PI + (a1 > a0 ? 90 : -90);
		for (const s of [-1, 1]) {
			const rr = r + s * a * 0.9;
			o += hoja(cx + rr * Math.cos(t), cy + rr * Math.sin(t), l, a, tg + s * 32 * lado);
		}
	}
	return o;
}
module.exports = {txt, arco, ancho, hoja, laurel, FONT};
