(() => {
	const $ = (s) => document.querySelector(s);
	const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

	// ---- Cuenta regresiva ----
	const fin = new Date(INICIO_EVENTO).getTime();
	const pad = (n) => String(n).padStart(2, '0');
	const tic = () => {
		const d = Math.max(0, fin - Date.now());
		$('#c-dias').textContent = Math.floor(d / 864e5);
		$('#c-horas').textContent = pad(Math.floor(d / 36e5) % 24);
		$('#c-min').textContent = pad(Math.floor(d / 6e4) % 60);
		$('#c-seg').textContent = pad(Math.floor(d / 1e3) % 60);
	};
	tic(); setInterval(tic, 1000);

	// ---- Ponentes ----
	$('#grilla-ponentes').innerHTML = PONENTES.map((p) => `
		<button class="ponente" data-id="${p.id}">
			<div class="arco"><img src="${p.foto}" alt="${esc(p.nombre)}" loading="lazy"></div>
			<h3>${esc(p.nombre)}</h3>
			<b>${esc(p.resultado)}</b>
			<small>${esc(p.area)}</small>
			<span class="ver">Ver perfil →</span>
		</button>`).join('');

	const ficha = $('#ficha');
	const abrir = (id) => {
		const p = PONENTES.find((x) => x.id === id);
		if (!p) return;
		const lista = (titulo, items) => items && items.length ? `<h4>${titulo}</h4><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '';
		const enlaces = [
			p.whatsapp && `<a class="btn btn-oro btn-chico" href="${esc(p.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`,
			p.sitio && `<a class="btn btn-linea-oscuro btn-chico" href="${esc(p.sitio)}" target="_blank" rel="noopener">${esc(p.sitio.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))}</a>`,
			p.instagram && `<a class="btn btn-linea-oscuro btn-chico" href="${esc(p.instagram)}" target="_blank" rel="noopener">Instagram</a>`,
			p.correo && `<a class="btn btn-linea-oscuro btn-chico" href="mailto:${esc(p.correo)}">Correo</a>`,
		].filter(Boolean).join('');
		$('#ficha-contenido').innerHTML = `
			<div class="ficha-cabeza">
				<div class="arco chico"><img src="${p.foto}" alt=""></div>
				<div>
					<h3>${esc(p.nombre)}</h3>
					<p class="cargo">${esc(p.cargo)}</p>
					<span class="etiqueta">${esc(p.resultado)}</span>
				</div>
			</div>
			${p.bio ? `<p>${esc(p.bio)}</p>` : '<p class="pendiente">Biografía en preparación.</p>'}
			${lista('Experiencia', p.experiencia)}
			${lista('Proyectos', p.proyectos)}
			${p.entrega ? `<div class="entrega"><h4>🎁 Lo que te llevas de su ponencia</h4><p>${esc(p.entrega)}</p>${p.material && p.material.length ? `<ul>${p.material.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}${p.demo ? `<a class="btn btn-oro" href="${esc(p.demo)}" target="_blank" rel="noopener">Ver la demo</a>` : ''}</div>` : ''}
			${enlaces ? `<div class="enlaces">${enlaces}</div>` : ''}`;
		ficha.showModal();
	};
	document.addEventListener('click', (e) => {
		const b = e.target.closest('.ponente');
		if (b) abrir(b.dataset.id);
		if (e.target === ficha) ficha.close();
	});

	// ---- Programa ----
	$('#linea').innerHTML = PROGRAMA.map((x) => `
		<li class="${x.tipo}">
			<time>${esc(x.hora)}</time>
			<div>
				${x.ponente ? `<button class="enlace-ponente" data-ponente="${x.ponente}">${esc(x.titulo)}</button>` : `<b>${esc(x.titulo)}</b>`}
				${x.detalle ? `<small>${esc(x.detalle)}</small>` : ''}
			</div>
		</li>`).join('');
	document.addEventListener('click', (e) => {
		const b = e.target.closest('.enlace-ponente');
		if (b) abrir(b.dataset.ponente);
	});

	// ---- Patrocinadores: dos filas en movimiento, en sentidos opuestos ----
	const logo = (s, copia) => {
		const img = `<img src="img/patrocinadores/${s.logo}.webp" width="480" height="320" alt="${copia ? '' : esc(s.nombre)}" title="${esc(s.nombre)}" loading="lazy">`;
		const extra = copia ? ' tabindex="-1" aria-hidden="true"' : '';
		return s.enlace ? `<a class="logo" href="${esc(s.enlace)}" target="_blank" rel="noopener"${extra}>${img}</a>` : `<span class="logo"${copia ? ' aria-hidden="true"' : ''}>${img}</span>`;
	};
	const mitad = Math.ceil(PATROCINADORES.length / 2);
	const filas = [PATROCINADORES.slice(0, mitad), PATROCINADORES.slice(mitad)];
	$('#carrusel').innerHTML = filas.map((f, i) => `
		<div class="fila ${i ? 'der' : 'izq'}"><div class="pista">${f.map((s) => logo(s, false)).join('')}${f.map((s) => logo(s, true)).join('')}</div></div>`).join('');

	// ---- Video promocional: botón grande de reproducir ----
	const promo = $('#promo'), play = $('#promo-play');
	if (promo && play) {
		play.addEventListener('click', () => { promo.play(); });
		promo.addEventListener('play', () => { play.hidden = true; });
		promo.addEventListener('ended', () => { play.hidden = false; });
	}

	const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// ---- Aparición al hacer scroll ----
	const revelar = document.querySelectorAll('.titulo, .intro, .promo-tel, .promo-texto, .tarjeta, .ponente, .panel, .linea li, .unete, .carrusel, details, .lugar .dos-col > *, .cierre .dos-col > *');
	if (quieto || !('IntersectionObserver' in window)) revelar.forEach((el) => el.classList.add('visto'));
	else {
		const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), {threshold: 0.12});
		revelar.forEach((el, i) => { el.classList.add('revela'); el.style.setProperty('--retraso', `${(i % 4) * 90}ms`); io.observe(el); });
	}

	// ---- Luz que sigue al cursor en las tarjetas ----
	document.querySelectorAll('.tarjeta, .boleto, .unete').forEach((el) => el.addEventListener('pointermove', (e) => {
		const r = el.getBoundingClientRect();
		el.style.setProperty('--x', `${e.clientX - r.left}px`);
		el.style.setProperty('--y', `${e.clientY - r.top}px`);
	}));

	// ---- Red de datos en la portada ----
	const lienzo = $('#red');
	if (lienzo && lienzo.getContext) {
		const ctx = lienzo.getContext('2d');
		const portada = lienzo.parentElement;
		let w, h, nodos = [], raton = null, activo = true;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const medir = () => {
			w = portada.clientWidth; h = portada.clientHeight;
			lienzo.width = w * dpr; lienzo.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const n = Math.min(90, Math.round(w * h / 14000));
			nodos = Array.from({length: n}, () => ({x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: 1.2 + Math.random() * 1.8}));
		};
		const pintar = () => {
			ctx.clearRect(0, 0, w, h);
			const lejos = 130;
			for (let i = 0; i < nodos.length; i++) {
				const a = nodos[i];
				if (!quieto) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > w) a.vx *= -1; if (a.y < 0 || a.y > h) a.vy *= -1; }
				for (let j = i + 1; j < nodos.length; j++) {
					const b = nodos[j], d = Math.hypot(a.x - b.x, a.y - b.y);
					if (d < lejos) { ctx.strokeStyle = `rgba(30,79,216,${(1 - d / lejos) * .22})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
				}
				if (raton) {
					const d = Math.hypot(a.x - raton.x, a.y - raton.y);
					if (d < 180) { ctx.strokeStyle = `rgba(47,168,224,${(1 - d / 180) * .55})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(raton.x, raton.y); ctx.stroke(); }
				}
				ctx.fillStyle = i % 7 === 0 ? 'rgba(245,168,0,.75)' : 'rgba(30,79,216,.45)';
				ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 7); ctx.fill();
			}
		};
		const bucle = () => { if (activo) pintar(); if (!quieto) requestAnimationFrame(bucle); };
		medir(); bucle();
		let ancho = window.innerWidth;
		window.addEventListener('resize', () => { if (window.innerWidth === ancho) return; ancho = window.innerWidth; medir(); if (quieto) pintar(); });
		portada.addEventListener('pointermove', (e) => { const r = portada.getBoundingClientRect(); raton = {x: e.clientX - r.left, y: e.clientY - r.top}; });
		portada.addEventListener('pointerleave', () => { raton = null; });
		if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { activo = e.isIntersecting; }).observe(portada);
	}
})();
