// Pre-registro: guarda el cupo en la base de la Cumbre (Supabase) y luego invita a confirmar por WhatsApp.
// La llave publicable solo permite llamar a preregistrar(): no puede leer ni modificar registros.
(() => {
	const SUPABASE_URL = 'https://pzrrkcsftchkqmxczlhu.supabase.co';
	const LLAVE_PUBLICA = 'sb_publishable_jqG79oqq5nREgs34lntZFg_LCf_Usuj';
	const NUMERO = '584267617944';

	// Origen de la visita (enlaces con ?utm_source=instagram&...): se recuerda durante la sesión
	const utm = {};
	try {
		const q = new URLSearchParams(location.search);
		['utm_source', 'utm_medium', 'utm_campaign'].forEach((k) => {
			const v = q.get(k) || sessionStorage.getItem(k);
			if (v) { utm[k] = v.slice(0, 80); sessionStorage.setItem(k, utm[k]); }
		});
	} catch (e) { /* sin almacenamiento: seguimos sin UTM */ }

	const form = document.getElementById('form-registro');
	if (!form) return;
	const aviso = document.getElementById('registro-aviso');
	const boton = form.querySelector('button[type=submit]');
	const MENSAJES = {
		nombre_invalido: 'Escribe tu nombre y apellido.',
		telefono_invalido: 'Revisa el número de WhatsApp (ejemplo: 0412 123 4567).',
		demasiados_intentos: 'Demasiados intentos desde esta conexión. Escríbenos por WhatsApp.',
	};
	const avisar = (t, error) => { aviso.textContent = t; aviso.classList.toggle('error', !!error); };
	const exito = (nombre, repetido) => {
		const primero = nombre.split(/\s+/)[0];
		const texto = `Hola, soy ${nombre}. ${repetido ? 'Ya estaba' : 'Acabo de'} pre-registrarme en la Cumbre Amazonas 2026 y quiero confirmar mi entrada.`;
		document.getElementById('ok-nombre').textContent = primero;
		document.getElementById('ok-whatsapp').href = `https://wa.me/${NUMERO}?text=${encodeURIComponent(texto)}`;
		form.hidden = true;
		const ok = document.getElementById('registro-ok');
		ok.hidden = false;
		ok.scrollIntoView({behavior: 'smooth', block: 'center'});
		try { window.dispatchEvent(new CustomEvent('cumbre:preregistro', {detail: {repetido}})); } catch (e) { /* navegador viejo */ }
	};

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const d = Object.fromEntries(new FormData(form));
		if (d.web) return; // trampa para robots
		const nombre = (d.nombre || '').trim().replace(/\s+/g, ' ');
		const tel = (d.whatsapp || '').replace(/\D/g, '');
		if (nombre.length < 2) return avisar(MENSAJES.nombre_invalido, true);
		if (tel.length < 10) return avisar(MENSAJES.telefono_invalido, true);
		if (!form.acepto.checked) return avisar('Marca la casilla para que podamos escribirte.', true);

		boton.disabled = true; avisar('Guardando…');
		try {
			const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/preregistrar`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json', apikey: LLAVE_PUBLICA},
				body: JSON.stringify({
					p_nombre: nombre, p_whatsapp: d.whatsapp, p_negocio: d.negocio || null,
					p_rubro: d.rubro || null, p_origen: d.origen || null,
					p_utm_source: utm.utm_source || null, p_utm_medium: utm.utm_medium || null, p_utm_campaign: utm.utm_campaign || null,
				}),
			});
			const res = r.ok ? await r.json() : 'error';
			if (res === 'ok' || res === 'ya_registrado') return exito(nombre, res === 'ya_registrado');
			avisar(MENSAJES[res] || 'No pudimos guardar tu registro. Inténtalo de nuevo o escríbenos por WhatsApp.', true);
		} catch (err) {
			avisar('Sin conexión. Inténtalo de nuevo o escríbenos por WhatsApp.', true);
		} finally {
			boton.disabled = false;
		}
	});
})();
