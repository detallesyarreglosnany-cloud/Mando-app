// Captura cuadro por cuadro la escena 3D (CesiumJS) con Playwright y la guarda como JPG.
// Uso: node scripts/capturar.js <formato> [--duracion 10] [--desde 0] [--hasta N]
//   formato: vertical | horizontal | prueba_vertical | prueba_horizontal (ver config/recorrido.json)
const http = require('http'), fs = require('fs'), path = require('path');
const {chromium} = require('playwright');
const RAIZ = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(RAIZ, 'config/recorrido.json'), 'utf8'));
const args = process.argv.slice(2);
const formato = args[0] || 'prueba_vertical';
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? Number(args[i + 1]) : d; };
const F = cfg.formatos[formato]; if (!F) throw new Error('Formato desconocido: ' + formato);
const W = F.render_ancho || F.ancho, H = F.render_alto || F.alto;
const duracion = opt('duracion', cfg.duracion_s), fps = cfg.fps, total = Math.round(duracion * fps);
const desde = opt('desde', 0), hasta = Math.min(total, opt('hasta', total));
const salida = path.join(RAIZ, 'salida/frames', formato); fs.mkdirSync(salida, {recursive: true});

const TIPOS = {'.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.bin': 'application/octet-stream', '.wasm': 'application/wasm', '.png': 'image/png', '.jpg': 'image/jpeg', '.xml': 'text/xml', '.glsl': 'text/plain'};
const servidor = http.createServer((req, res) => {
	const p = path.join(RAIZ, decodeURIComponent(req.url.split('?')[0]));
	if (!p.startsWith(RAIZ) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
	res.writeHead(200, {'Content-Type': TIPOS[path.extname(p)] || 'application/octet-stream'}); fs.createReadStream(p).pipe(res);
});
(async () => {
	await new Promise((r) => servidor.listen(0, r));
	const puerto = servidor.address().port;
	const nav = await chromium.launch({args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']});
	const pag = await nav.newPage({viewport: {width: W, height: H}, deviceScaleFactor: 1});
	pag.on('pageerror', (e) => console.error('ERROR página:', e.message));
	await pag.goto(`http://127.0.0.1:${puerto}/cesium/escena.html`);
	await pag.waitForFunction(() => window.listo || window.errorEscena, null, {timeout: 120000});
	const err = await pag.evaluate(() => window.errorEscena); if (err) throw new Error(err);
	const t0 = Date.now();
	for (let i = desde; i < hasta; i++) {
		const u = total > 1 ? i / (total - 1) : 0;
		// se lee el lienzo WebGL directamente (preserveDrawingBuffer): más rápido y fiable que una captura de pantalla
		const {datos, info} = await pag.evaluate(async (u) => { const info = await window.cuadro(u); return {info, datos: document.querySelector('#mapa canvas').toDataURL('image/jpeg', 0.93)}; }, u);
		if (process.env.DETALLE) console.log(i, JSON.stringify(info));
		fs.writeFileSync(path.join(salida, String(i).padStart(4, '0') + '.jpg'), Buffer.from(datos.split(',')[1], 'base64'));
		if (i % 15 === 0) console.log(`${formato} cuadro ${i + 1}/${total} · ${((Date.now() - t0) / 1000 / (i - desde + 1)).toFixed(1)} s/cuadro`);
	}
	await nav.close(); servidor.close();
	console.log('listo', formato, hasta - desde, 'cuadros en', salida);
})().catch((e) => { console.error(e); process.exit(1); });
