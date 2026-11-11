// Demo de tienda virtual de KubIA Soluciones.
// Todo se guarda solo en el navegador de quien lo usa (localStorage). Nada sale del dispositivo.
(() => {
	const MAX = 10;
	const CLAVE = 'kubia-demo-tienda';
	const $ = (s) => document.querySelector(s);
	const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

	let estado = {nombre: '', frase: '', wa: '', horario: '', color: '#1E4FD8', logo: '', productos: []};
	let carrito = {};
	let fotoNueva = '';

	const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* sin espacio o bloqueado: el demo sigue funcionando */ } };
	const cargar = () => { try { const d = JSON.parse(localStorage.getItem(CLAVE)); if (d) estado = {...estado, ...d}; } catch (e) { /* nada guardado */ } };

	// Reduce la imagen antes de guardarla para no llenar el almacenamiento
	const leerImagen = (file, lado) => new Promise((ok) => {
		const r = new FileReader();
		r.onload = () => {
			const img = new Image();
			img.onload = () => {
				const k = Math.min(1, lado / Math.max(img.width, img.height));
				const c = document.createElement('canvas');
				c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
				c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
				ok(c.toDataURL('image/webp', 0.82));
			};
			img.src = r.result;
		};
		r.readAsDataURL(file);
	});

	const numeroWa = () => {
		let n = (estado.wa || '').replace(/\D/g, '');
		if (n.startsWith('0')) n = '58' + n.slice(1);
		return n;
	};

	const pintar = () => {
		$('#in-nombre').value = estado.nombre; $('#in-frase').value = estado.frase;
		$('#in-wa').value = estado.wa; $('#in-horario').value = estado.horario; $('#in-color').value = estado.color;
		$('#logo-prev').style.backgroundImage = estado.logo ? `url(${estado.logo})` : '';
		$('#logo-prev').textContent = estado.logo ? '' : 'Sube tu logo';
		$('#contador').textContent = `${estado.productos.length} / ${MAX}`;
		$('#lista-prod').innerHTML = estado.productos.map((p, i) => `
			<li>${p.foto ? `<img src="${p.foto}" alt="">` : '<span class="sin-foto"></span>'}
			<b>${esc(p.nombre)}</b><span>$${esc(p.precio)}</span>
			<button type="button" data-borrar="${i}" aria-label="Quitar">×</button></li>`).join('');

		// Vista del teléfono
		$('#t-cabeza').style.setProperty('--marca', estado.color);
		$('#t-logo').style.backgroundImage = estado.logo ? `url(${estado.logo})` : '';
		$('#t-logo').textContent = estado.logo ? '' : (estado.nombre || 'T').charAt(0).toUpperCase();
		$('#t-nombre').textContent = estado.nombre || 'Tu negocio';
		$('#t-frase').textContent = estado.frase || 'Tu frase aquí';
		$('#t-horario').textContent = estado.horario ? `🕑 ${estado.horario}` : '';
		$('#t-estado').innerHTML = '<span class="abierto">● Recibiendo pedidos 24/7</span>';
		$('#t-productos').innerHTML = estado.productos.length ? estado.productos.map((p, i) => `
			<div class="t-prod">
				<div class="img" style="${p.foto ? `background-image:url(${p.foto})` : `background:${estado.color}18`}">${p.foto ? '' : (p.emoji || '🛍️')}</div>
				<div class="txt"><b>${esc(p.nombre)}</b><small>${esc(p.desc)}</small>
				<span class="precio" style="color:${estado.color}">$${esc(p.precio)}</span>
				<button type="button" data-sumar="${i}" style="background:${estado.color}">${carrito[i] ? `En tu pedido: ${carrito[i]}` : 'Agregar'}</button></div>
			</div>`).join('') : '<div class="t-vacio">Agrega tu primer producto y aparecerá aquí ✨</div>';

		// Carrito → mensaje de WhatsApp
		const items = Object.entries(carrito).filter(([, c]) => c > 0);
		$('#t-carrito').hidden = !items.length;
		if (items.length) {
			const total = items.reduce((s, [i, c]) => s + c * (parseFloat(String(estado.productos[i].precio).replace(',', '.')) || 0), 0);
			$('#t-total').textContent = `Total: $${total.toFixed(2)}`;
			const lineas = items.map(([i, c]) => `• ${c} x ${estado.productos[i].nombre}`).join('\n');
			const texto = `Hola ${estado.nombre || ''}, quiero hacer este pedido:\n${lineas}\nTotal: $${total.toFixed(2)}`;
			const n = numeroWa();
			$('#t-pedir').href = n ? `https://wa.me/${n}?text=${encodeURIComponent(texto)}` : '#';
			$('#t-pedir').textContent = n ? 'Pedir por WhatsApp' : 'Agrega tu WhatsApp ↑';
		}
	};

	// Eventos del editor
	['nombre', 'frase', 'wa', 'horario', 'color'].forEach((k) => {
		$(`#in-${k}`).addEventListener('input', (e) => { estado[k] = e.target.value; guardar(); pintar(); });
	});
	$('#in-logo').addEventListener('change', async (e) => {
		if (!e.target.files[0]) return;
		estado.logo = await leerImagen(e.target.files[0], 300); guardar(); pintar();
	});
	$('#in-foto').addEventListener('change', async (e) => {
		if (!e.target.files[0]) return;
		fotoNueva = await leerImagen(e.target.files[0], 500);
		$('#foto-prev').style.backgroundImage = `url(${fotoNueva})`; $('#foto-prev').innerHTML = '';
	});
	$('#form-prod').addEventListener('submit', (e) => {
		e.preventDefault();
		if (estado.productos.length >= MAX) { alert(`En la prueba puedes cargar hasta ${MAX} productos. ¡En tu tienda real no hay límite!`); return; }
		estado.productos.push({nombre: $('#in-pnombre').value.trim(), precio: $('#in-precio').value.trim(), desc: $('#in-desc').value.trim(), foto: fotoNueva});
		fotoNueva = ''; e.target.reset();
		$('#foto-prev').style.backgroundImage = ''; $('#foto-prev').innerHTML = '📷<br>Foto';
		guardar(); pintar();
	});
	document.addEventListener('click', (e) => {
		const b = e.target.closest('[data-borrar]');
		if (b) { estado.productos.splice(+b.dataset.borrar, 1); carrito = {}; guardar(); pintar(); }
		const s = e.target.closest('[data-sumar]');
		if (s) { carrito[s.dataset.sumar] = (carrito[s.dataset.sumar] || 0) + 1; pintar(); }
	});
	$('#btn-borrar').addEventListener('click', () => {
		if (!confirm('¿Borrar todos los datos de la prueba?')) return;
		estado = {nombre: '', frase: '', wa: '', horario: '', color: '#1E4FD8', logo: '', productos: []}; carrito = {}; guardar(); pintar();
	});
	$('#btn-ejemplo').addEventListener('click', () => {
		estado = {
			nombre: 'Bodega La Esquina', frase: 'Todo para tu hogar, cerca de ti', wa: '', horario: 'Lun a Sáb · 7am a 8pm', color: '#0E8A5F', logo: '',
			productos: [
				{nombre: 'Harina de maíz 1 kg', precio: '1.20', desc: 'Para tus arepas de cada día', foto: ''},
				{nombre: 'Café molido 500 g', precio: '4.50', desc: 'Tostado y molido local', foto: ''},
				{nombre: 'Aceite vegetal 1 L', precio: '3.10', desc: '', foto: ''},
				{nombre: 'Arroz 1 kg', precio: '1.35', desc: 'Grano largo', foto: ''},
			],
		};
		carrito = {}; guardar(); pintar();
	});

	// ---- Modo rápido: tienda lista por rubro ----
	const RUBROS = {
		bodega: {nombre: 'Bodega', emoji: '🛒', color: '#0E8A5F', frase: 'Todo para tu hogar, cerca de ti', horario: 'Lun a Sáb · 7am a 8pm', productos: [['Harina de maíz 1 kg', '1.20', '🌽'], ['Arroz 1 kg', '1.35', '🍚'], ['Aceite vegetal 1 L', '3.10', '🫗'], ['Café molido 500 g', '4.50', '☕'], ['Pasta 1 kg', '1.60', '🍝'], ['Huevos (cartón 30)', '6.00', '🥚']]},
		ferreteria: {nombre: 'Ferretería', emoji: '🔧', color: '#C0392B', frase: 'Lo que necesitas para construir y reparar', horario: 'Lun a Sáb · 8am a 5pm', productos: [['Martillo de acero', '8.50', '🔨'], ['Juego de destornilladores', '12.00', '🪛'], ['Cinta métrica 5 m', '4.20', '📏'], ['Pintura 1 galón', '18.00', '🎨'], ['Bombillo LED 9W', '1.80', '💡'], ['Candado de seguridad', '6.50', '🔒']]},
		farmacia: {nombre: 'Farmacia', emoji: '💊', color: '#E8590C', frase: 'Al servicio de tu salud', horario: 'Todos los días · 7am a 10pm', productos: [['Acetaminofén 500 mg', '2.10', '💊'], ['Vitamina C 1 g', '5.40', '🍊'], ['Alcohol 70% 1 L', '3.00', '🧴'], ['Tapabocas (caja 50)', '4.50', '😷'], ['Protector solar', '9.80', '☀️'], ['Termómetro digital', '7.00', '🌡️']]},
		belleza: {nombre: 'Belleza', emoji: '💅', color: '#C2185B', frase: 'Tu momento de brillar', horario: 'Mar a Sáb · 9am a 7pm', productos: [['Manicure tradicional', '8.00', '💅'], ['Uñas acrílicas', '20.00', '✨'], ['Pedicure spa', '12.00', '🦶'], ['Corte y secado', '10.00', '💇'], ['Maquillaje social', '25.00', '💄'], ['Perfume 100 ml', '30.00', '🌸']]},
		comida: {nombre: 'Comida', emoji: '🍔', color: '#D35400', frase: 'Sabor que se pide por WhatsApp', horario: 'Todos los días · 11am a 11pm', productos: [['Hamburguesa clásica', '6.50', '🍔'], ['Perro caliente especial', '3.50', '🌭'], ['Papas fritas', '2.50', '🍟'], ['Parrilla para 2', '18.00', '🥩'], ['Refresco 1,5 L', '2.00', '🥤'], ['Torta de chocolate', '3.00', '🍰']]},
		ropa: {nombre: 'Ropa', emoji: '👗', color: '#6C3483', frase: 'Moda que te representa', horario: 'Lun a Sáb · 9am a 6pm', productos: [['Franela básica', '9.00', '👕'], ['Jean clásico', '22.00', '👖'], ['Vestido casual', '28.00', '👗'], ['Zapatos deportivos', '35.00', '👟'], ['Gorra', '7.00', '🧢'], ['Bolso de mano', '19.00', '👜']]},
		repuestos: {nombre: 'Repuestos', emoji: '🏍️', color: '#1F3A93', frase: 'Repuestos para que no te detengas', horario: 'Lun a Sáb · 8am a 5pm', productos: [['Aceite de motor 1 L', '7.50', '🛢️'], ['Pastillas de freno', '12.00', '🛑'], ['Batería 12V', '45.00', '🔋'], ['Bujía', '3.50', '⚡'], ['Cadena de moto', '18.00', '⛓️'], ['Caucho de moto', '38.00', '🛞']]},
		servicios: {nombre: 'Servicios', emoji: '🧰', color: '#117A65', frase: 'Soluciones profesionales a tu medida', horario: 'Lun a Vie · 8am a 5pm', productos: [['Asesoría inicial', '15.00', '🗂️'], ['Instalación a domicilio', '20.00', '🏠'], ['Mantenimiento', '25.00', '🛠️'], ['Plan mensual', '40.00', '📅'], ['Diagnóstico', '10.00', '🔍'], ['Servicio express', '30.00', '🚀']]},
	};
	let rubroElegido = 'bodega';
	$('#rubros').innerHTML = Object.entries(RUBROS).map(([k, r]) => `<button type="button" class="rubro${k === rubroElegido ? ' activo' : ''}" data-rubro="${k}"><span>${r.emoji}</span>${r.nombre}</button>`).join('');
	document.addEventListener('click', (e) => {
		const r = e.target.closest('[data-rubro]');
		if (!r) return;
		rubroElegido = r.dataset.rubro;
		document.querySelectorAll('.rubro').forEach((b) => b.classList.toggle('activo', b === r));
	});
	$('#r-crear').addEventListener('click', () => {
		const r = RUBROS[rubroElegido];
		estado = {
			nombre: $('#r-nombre').value.trim() || `Mi ${r.nombre}`,
			frase: r.frase, wa: $('#r-wa').value.trim(), horario: r.horario, color: r.color, logo: '',
			productos: r.productos.map(([nombre, precio, emoji]) => ({nombre, precio, emoji, desc: '', foto: ''})),
		};
		carrito = {}; guardar(); pintar();
		document.querySelector('.telefono').scrollIntoView({behavior: 'smooth', block: 'center'});
	});

	cargar(); pintar();
})();
