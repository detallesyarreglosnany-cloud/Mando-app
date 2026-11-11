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
				<div class="img" style="${p.foto ? `background-image:url(${p.foto})` : ''}">${p.foto ? '' : '🛍️'}</div>
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

	cargar(); pintar();
})();
