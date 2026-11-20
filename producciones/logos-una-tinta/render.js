// Exporta cada logo: SVG negro, SVG blanco, PNG negro y PNG blanco (transparentes, 2000 px el lado largo).
const fs = require('fs'); const {chromium} = require('playwright');
const L = require('./logos');
(async () => {
	fs.mkdirSync('salida', {recursive: true});
	const b = await chromium.launch(); const p = await b.newPage();
	const solo = process.argv.slice(2);
	for (const [id, fn] of Object.entries(L)) {
		if (solo.length && !solo.includes(id)) continue;
		const {w, h, cuerpo} = fn();
		// La versión blanca es la MISMA pieza negra recoloreada por filtro (no se tocan los calados)
		const svg = (color) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs><filter id="blanco" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/></filter></defs><g ${color === '#fff' ? 'filter="url(#blanco)"' : ''}><g fill="#000" stroke-width="0">${cuerpo}</g></g></svg>`;
		for (const [nombre, col] of [['negro', '#000'], ['blanco', '#fff']]) {
			const s = svg(col); fs.writeFileSync(`salida/${id}-${nombre}.svg`, s);
			const k = 2000 / Math.max(w, h);
			await p.setViewportSize({width: Math.ceil(w * k), height: Math.ceil(h * k)});
			await p.setContent(`<html><body style="margin:0;background:transparent">${s.replace(`width="${w}" height="${h}"`, `width="${Math.ceil(w * k)}" height="${Math.ceil(h * k)}"`)}</body></html>`);
			await p.screenshot({path: `salida/${id}-${nombre}.png`, omitBackground: true, clip: {x: 0, y: 0, width: Math.ceil(w * k), height: Math.ceil(h * k)}});
		}
		console.log('ok', id);
	}
	await b.close();
})();
