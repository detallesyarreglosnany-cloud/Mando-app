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
			p.sitio && `<a class="btn btn-linea-oscuro btn-chico" href="${esc(p.sitio)}" target="_blank" rel="noopener">Sitio web</a>`,
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
			${p.entrega ? `<div class="entrega"><h4>🎁 Lo que te llevas de su ponencia</h4><p>${esc(p.entrega)}</p>${p.material && p.material.length ? `<ul>${p.material.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}${p.demo ? `<a class="btn btn-oro" href="${p.demo}">Pruébalo ahora</a>` : ''}</div>` : ''}
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

	// ---- Patrocinadores ----
	const logo = (s) => {
		const img = `<img src="img/logos/${s.logo}.webp" alt="${esc(s.nombre)}" title="${esc(s.nombre)}" loading="lazy">`;
		return s.enlace ? `<a href="${esc(s.enlace)}" target="_blank" rel="noopener">${img}</a>` : `<span>${img}</span>`;
	};
	$('#logos-claros').innerHTML = PATROCINADORES.filter((s) => s.fondo === 'claro').map(logo).join('');
	$('#logos-oscuros').innerHTML = PATROCINADORES.filter((s) => s.fondo === 'oscuro').map(logo).join('');
})();
