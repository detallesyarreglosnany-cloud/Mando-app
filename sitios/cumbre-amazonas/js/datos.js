// =====================================================================
// DATOS DEL EVENTO — editar aquí. El sitio se arma solo con esta información.
// Campos vacíos ('') no se muestran: así se puede publicar aunque falte algo.
// =====================================================================

const WHATSAPP_EVENTO = 'https://wa.link/8e9pr6';

const PONENTES = [
	{
		id: 'jose',
		nombre: 'José Rodríguez',
		cargo: 'Asesor en Ventas y Liderazgo Comercial',
		resultado: 'Vende más',
		area: 'Ventas y liderazgo',
		foto: 'img/jose.webp',
		bio: '', // PENDIENTE: biografía
		experiencia: [], // PENDIENTE: ['Más de X años...', ...]
		proyectos: [], // PENDIENTE
		entrega: '', // PENDIENTE: material que entrega en el evento
		whatsapp: '', // PENDIENTE: 'https://wa.me/58...'
		sitio: '', // PENDIENTE
		instagram: '', // PENDIENTE
	},
	{
		id: 'tania',
		nombre: 'Tania Alzuru',
		cargo: 'Asesora en Neuromarketing',
		resultado: 'Que te elijan',
		area: 'Neuromarketing y marca',
		foto: 'img/tania.webp',
		bio: '', experiencia: [], proyectos: [], entrega: '', whatsapp: '', sitio: '', instagram: '',
	},
	{
		id: 'juan',
		nombre: 'Juan Ernesto Sierra',
		cargo: 'Asesor en Finanzas',
		resultado: 'Gana más',
		area: 'Finanzas y ganancias',
		foto: 'img/juan.webp',
		bio: '', experiencia: [], proyectos: [], entrega: '', whatsapp: '', sitio: '', instagram: '',
	},
	{
		id: 'daniela',
		nombre: 'Daniela Silva',
		cargo: 'Desarrolladora de Soluciones Digitales · KubIA Soluciones',
		resultado: 'Vende 24/7',
		area: 'Tu negocio digital',
		foto: 'img/daniela.webp',
		bio: '', // PENDIENTE
		experiencia: [],
		proyectos: ['KubIA Soluciones'],
		entrega: 'Tu propia tienda virtual de prueba: sube tu logo, tus productos, precios, horario y WhatsApp, y mira cómo se vería tu negocio vendiendo las 24 horas.',
		demo: 'demo.html', // demo interactivo en vivo
		whatsapp: '', sitio: '', instagram: '',
	},
];

// Programa (sin duraciones ni temas, como se pidió)
const PROGRAMA = [
	{hora: '2:00 PM', titulo: 'Registro y recepción', tipo: 'logistica'},
	{hora: '2:30 PM', titulo: 'Apertura oficial', detalle: 'Bienvenida y reconocimiento a los patrocinadores', tipo: 'logistica'},
	{hora: '2:45 PM', titulo: 'José Rodríguez', tipo: 'ponencia', ponente: 'jose'},
	{hora: '4:00 PM', titulo: 'Coffee break', detalle: 'Recorrido por los stands de los patrocinadores', tipo: 'pausa'},
	{hora: '4:30 PM', titulo: 'Juan Ernesto Sierra', tipo: 'ponencia', ponente: 'juan'},
	{hora: '5:45 PM', titulo: 'Segundo coffee break', detalle: 'Segundo recorrido por los stands', tipo: 'pausa'},
	{hora: '6:00 PM', titulo: 'Daniela Silva', tipo: 'ponencia', ponente: 'daniela'},
	{hora: '6:45 PM', titulo: 'Tania Alzuru', tipo: 'ponencia', ponente: 'tania'},
	{hora: '8:00 PM', titulo: 'Panel central', detalle: 'Los cuatro ponentes, un experto tributario y un asesor laboral', tipo: 'panelc'},
	{hora: '9:00 PM', titulo: 'Cierre y networking', tipo: 'logistica'},
];

// Patrocinadores: 'claro' = logo con dibujo oscuro (va sobre fondo claro); 'oscuro' = logo con dibujo claro
const PATROCINADORES = [
	{logo: 'logo3', nombre: 'Ferreconi', fondo: 'claro'},
	{logo: 'logo4', nombre: 'Orthosmile', fondo: 'claro'},
	{logo: 'logo6', nombre: 'Inversiones Navas Maldonado', fondo: 'claro'},
	{logo: 'logo8', nombre: 'Tecnoama', fondo: 'claro'},
	{logo: 'logo9', nombre: 'Abasto y Panadería Jesús de Nazareth', fondo: 'claro'},
	{logo: 'logo12', nombre: 'MultiEmpresariales', fondo: 'claro'},
	{logo: 'logo14', nombre: 'Farma-Descuento Ayacucho Plus', fondo: 'claro'},
	{logo: 'logo16', nombre: 'Marco Repuestos', fondo: 'claro'},
	{logo: 'logo1', nombre: 'Perfumes Factory', fondo: 'oscuro'},
	{logo: 'logo2', nombre: 'Distribuidora de Suministros Puerto Venado', fondo: 'oscuro'},
	{logo: 'logo5', nombre: 'Moto Repuestos Daniel 2011', fondo: 'oscuro'},
	{logo: 'logo10', nombre: 'Galaxia Luxe Nails', fondo: 'oscuro'},
	{logo: 'logo11', nombre: 'La Casita del Sabor', fondo: 'oscuro'},
	{logo: 'logo13', nombre: 'Milsi Beauty Studio', fondo: 'oscuro'},
	{logo: 'logo15', nombre: 'Las Delicias del Llano', fondo: 'oscuro'},
	{logo: 'logo17', nombre: 'KubIA Soluciones', fondo: 'oscuro'},
	// Para agregar el enlace de cada uno: , enlace: 'https://instagram.com/...'
];

// Fecha y hora de inicio (Venezuela, UTC-4)
const INICIO_EVENTO = '2026-12-04T14:00:00-04:00';
