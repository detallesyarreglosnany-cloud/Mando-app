// =====================================================================
// DATOS DEL EVENTO — editar aquí. El sitio se arma solo con esta información.
// Campos vacíos ('') no se muestran: así se puede publicar aunque falte algo.
// =====================================================================

const WHATSAPP_EVENTO = 'https://wa.link/8e9pr6';

const PONENTES = [
	{
		id: 'jose',
		nombre: 'José Rodríguez',
		cargo: 'Administrador de Empresas · Coach Empresarial · CEO de MultiEmpresariales.com',
		resultado: 'Vende más',
		area: 'Ventas y liderazgo',
		foto: 'img/jose.webp',
		bio: 'Su carrera va de la banca a la calle: gerenció una división bancaria durante cinco años y pasó otros diez en el área comercial, dominando merchandising, mercadeo y estrategias de ventas guiadas por indicadores (KPI). Esa experiencia lo llevó a emprender y a descubrir su vocación como formador. Desde 2007 se especializó en coaching empresarial, PNL e inteligencia emocional, y se certificó como Conferencista de Impacto (UNIMET–IESA) y como consultor empresarial (IEBS). Hoy acompaña a empresas a formar equipos que lideran, venden y atienden mejor. Un abridor de caminos para el emprendimiento en Amazonas.',
		experiencia: [
			'Licenciado en Administración de Empresas (UNESR)',
			'5 años en la gerencia de una división bancaria',
			'10 años en el área comercial: merchandising, mercadeo y ventas por KPI',
			'Profesor universitario durante 3 años',
			'Coach Neurointegrativo, en PNL e Inteligencia Emocional (ILACOT)',
			'Life Coach y Coach Empresarial (IHCA, Orlando, Florida)',
			'Certificación de Conferencistas de Impacto (UNIMET–IESA)',
			'Consultor y asesor empresarial certificado (IEBS)',
			'Productor y moderador de «Motivación Empresarial» en Amazonas TV',
		],
		proyectos: [
			'CEO de MultiEmpresariales.com: asesoría, training, coaching y conferencias en liderazgo, ventas, atención al cliente y trabajo en equipo',
			'Partner de IA Opportunity (Bucaramanga, Colombia)',
			'Colaborador de Prosocio en el apoyo a nuevos emprendimientos',
			'Asesor del Centro de Formación Gerencia Empresarial Amazonas',
			'Talleres: Autodisciplina, El Liderazgo y Programa Empresarial 360',
		],
		entrega: 'Material exclusivo para los asistentes de su ponencia:',
		material: [
			'Guía: Cómo hacer el análisis FODA de tu negocio',
			'Plantillas FODA para tu empresa y para ti',
			'Reto: Duplica tu productividad en 14 días',
			'Guía de cross-selling y up-selling: vende más al mismo cliente',
		],
		whatsapp: 'https://wa.me/584267617944?text=Hola%20Jos%C3%A9%2C%20te%20vi%20en%20la%20Cumbre',
		correo: 'multiempresariales.com@gmail.com',
		sitio: '',
		instagram: '',
	},
	{
		id: 'tania',
		nombre: 'Tania Alzuru',
		cargo: 'Empresaria · Publicista · Especialista en Neuromarketing',
		resultado: 'Que te elijan',
		area: 'Neuromarketing y marca',
		foto: 'img/tania.webp',
		bio: 'Treinta años en el mundo de los negocios y una marca propia que lo demuestra: hace más de quince años creó su marca de ropa, fabricada en Venezuela y en Perú. Sabe lo que cuesta construir una marca desde cero y sostenerla en dos países. Comunicadora social y publicista, con diplomado en Neuromarketing Digital y formación avanzada en gestión de negocios, hoy dedica su experiencia a capacitar emprendedores para que estructuren su negocio, descubran su valor diferencial y lo lleven a la meta que se propusieron.',
		experiencia: [
			'30 años en el mundo de los negocios',
			'Fundadora de su marca de ropa desde hace más de 15 años, fabricada en Venezuela y Perú',
			'Comunicadora social y publicista',
			'Diplomado en Neuromarketing Digital',
			'Curso avanzado en gestión de negocios',
			'Autora de cuatro libros inspirados en sus principios de fe',
		],
		proyectos: ['Programa de formación para emprendedores: estructura del negocio, valor diferencial y logro de metas'],
		entrega: '', material: [], whatsapp: '', correo: '', sitio: '', instagram: '',
	},
	{
		id: 'juan',
		nombre: 'Juan Ernesto Sierra',
		cargo: 'Contador Público · Asesor Financiero y Consultor Gerencial',
		resultado: 'Gana más',
		area: 'Finanzas y ganancias',
		foto: 'img/juan.webp',
		bio: 'Más de 25 años liderando gestión financiera, control de costos, auditoría y dirección estratégica de negocios. Conoce las finanzas desde todos los lados de la mesa: la empresa multinacional, la cooperación internacional y el control fiscal del Estado. Licenciado en Contaduría Pública por la Universidad de Carabobo y docente universitario, en esta cumbre compartirá herramientas prácticas para cuidar la salud financiera de tu negocio: estructura de costos, rentabilidad y decisiones estratégicas para crecer de forma sostenible.',
		experiencia: [
			'Expresidente del Colegio de Contadores Públicos del Estado Amazonas',
			'Ex Director de Control Posterior de la Contraloría del Estado Amazonas',
			'Especialista de Administración en Nestlé de Venezuela',
			'Jefe de Compras Internacionales',
			'Responsable de Logística y Administración en organizaciones internacionales de cooperación en Amazonas',
			'Profesor universitario en la UNA y la USM: Contaduría, Sistemas Contables y Auditoría',
		],
		proyectos: [],
		entrega: '', material: [], whatsapp: '', correo: '', sitio: '', instagram: '',
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
		entrega: 'Tu propia tienda virtual de prueba en menos de un minuto: elige tu rubro, pon tu WhatsApp y hazte un pedido a ti mismo para ver cómo te llegan las ventas.',
		material: [],
		demo: 'demo.html', // demo interactivo en vivo
		whatsapp: 'https://wa.me/584221754245?text=Hola%20Daniela%2C%20te%20vi%20en%20la%20Cumbre', correo: '', sitio: '', instagram: '',
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
	{logo: 'logo12', nombre: 'MultiEmpresariales.com', fondo: 'claro', enlace: 'https://wa.me/584267617944?text=Hola%2C%20te%20vi%20en%20la%20Cumbre'},
	{logo: 'logo14', nombre: 'Farma-Descuento Ayacucho Plus', fondo: 'claro'},
	{logo: 'logo16', nombre: 'Marco Repuestos', fondo: 'claro'},
	{logo: 'logo1', nombre: 'Perfumes Factory', fondo: 'oscuro'},
	{logo: 'logo2', nombre: 'Distribuidora de Suministros Puerto Venado', fondo: 'oscuro'},
	{logo: 'logo5', nombre: 'Moto Repuestos Daniel 2011', fondo: 'oscuro'},
	{logo: 'logo10', nombre: 'Galaxia Luxe Nails', fondo: 'oscuro'},
	{logo: 'logo11', nombre: 'La Casita del Sabor', fondo: 'oscuro'},
	{logo: 'logo13', nombre: 'Milsi Beauty Studio', fondo: 'oscuro'},
	{logo: 'logo15', nombre: 'Las Delicias del Llano', fondo: 'oscuro'},
	{logo: 'logo17', nombre: 'KubIA Soluciones', fondo: 'oscuro', enlace: 'https://wa.me/584221754245?text=Hola%2C%20te%20vi%20en%20la%20Cumbre'},
	// Para agregar el enlace de cada uno: , enlace: 'https://instagram.com/...'
];

// Fecha y hora de inicio (Venezuela, UTC-4)
const INICIO_EVENTO = '2026-12-04T14:00:00-04:00';
