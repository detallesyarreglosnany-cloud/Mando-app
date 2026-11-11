import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, Cuerdas, F, IconoAlpargata, IconoBota, IconoSombrero, LogoMorichal, Sabana, useFuentes} from './comun';

const sombra = '0 6px 22px rgba(0,0,0,0.85)';
const Titulo: React.FC<{escala?: number}> = ({escala = 1}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<div style={{fontFamily: F.titulo, fontSize: 70 * escala, lineHeight: 1, color: C.blanco, textShadow: sombra}}>GRAN</div>
		<div style={{fontFamily: F.titulo, fontSize: 132 * escala, lineHeight: 0.95, color: C.oro, textShadow: `0 0 34px ${C.naranja}, ${sombra}`}}>AMANECER</div>
		<div style={{fontFamily: F.script, fontSize: 92 * escala, lineHeight: 1, marginTop: -6 * escala, color: C.crema, transform: 'rotate(-5deg)', textShadow: sombra}}>Llanero</div>
	</div>
);
const EnVivo: React.FC = () => (
	<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: C.blanco, background: C.rojo, padding: '6px 20px', borderRadius: 30, boxShadow: `0 0 20px ${C.rojo}`}}>● EN VIVO</span>
);
const Gratis: React.FC<{size?: number}> = ({size = 52}) => (
	<span style={{fontFamily: F.titulo, fontSize: size, color: C.noche, background: C.oro, padding: '2px 34px', borderRadius: 50, boxShadow: `0 0 26px ${C.oro}`}}>ENTRADA GRATIS</span>
);
const Datos: React.FC<{ancho?: number}> = ({ancho = 980}) => (
	<div style={{width: ancho, borderRadius: 28, background: 'rgba(11,16,38,0.86)', border: `3px solid ${C.oro}`, padding: '18px 0 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, boxShadow: `0 0 34px ${C.oro}44`}}>
		<div style={{fontFamily: F.titulo, fontSize: 62, color: C.oro, lineHeight: 1.05}}>SÁBADO 21 DE NOVIEMBRE · 8:00 PM</div>
		<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 34, color: C.blanco}}>Tasca El Bodegón de Jony · Av. Principal de Aramare</div>
		<div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 26, color: C.crema}}>Diagonal a los semáforos Las Delicias</div>
		<div style={{marginTop: 12}}><Gratis /></div>
	</div>
);
const Fondo: React.FC<{src: string; pos?: string; filtro?: string}> = ({src, pos = 'center', filtro}) => (
	<Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: filtro}} />
);

// ---------- Flyer 1: la entrada ----------
export const FlyerEntrada: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.noche}}>
			<Fondo src="img/grupo-fachada.jpg" pos="center 30%" filtro="saturate(1.1)" />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,16,38,0.97) 0%, rgba(11,16,38,0.88) 14%, rgba(11,16,38,0.3) 24%, rgba(11,16,38,0) 30%, rgba(11,16,38,0) 60%, rgba(11,16,38,0.9) 76%, rgba(11,16,38,0.97) 100%)'}} />
			<AbsoluteFill style={{alignItems: 'center', top: 18}}>
				<div style={{fontFamily: F.script, fontSize: 34, color: C.crema, textShadow: sombra}}>Ayacucho, desempolva tu sombrero</div>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 2}}>
					<span style={{fontFamily: F.titulo, fontSize: 92, lineHeight: 1, color: C.oro, textShadow: `0 0 26px ${C.naranja}, ${sombra}`}}>GRAN AMANECER</span>
					<span style={{fontFamily: F.script, fontSize: 64, lineHeight: 1, color: C.crema, textShadow: sombra}}>Llanero</span>
				</div>
				<div style={{marginTop: 8}}><EnVivo /></div>
			</AbsoluteFill>
			<div style={{position: 'absolute', right: 22, top: 16, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.7))'}}><LogoMorichal s={120} /></div>
			<AbsoluteFill style={{alignItems: 'center', top: 960}}>
				<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 30, color: C.blanco, textShadow: sombra, marginBottom: 12}}>Reynaldo Camacho · María Joropa · Betzonia Armas · Manuel Salas</div>
				<Datos />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- Flyer 2: adentro, los cantantes en la mesa ----------
const ETIQUETAS: [string, string, number, number, string][] = [
	['Reynaldo Camacho', 'El Rey de la Canta', 0.2, 790, '#E3A73A'],
	['Betzonia Armas', 'Joropo y pasaje criollo', 0.4, 700, C.naranja],
	['Manuel Salas', 'Canta y anima', 0.62, 700, '#3A5BD9'],
	['María Joropa', 'Voz recia femenina', 0.82, 790, '#B57EDC'],
];
export const FlyerAdentro: React.FC = () => {
	useFuentes();
	// foto 941x1672 en 1080x1350 (cover): escala 1.148, recorte vertical centrado en 52%
	const esc = 1080 / 941, ih = 1672 * esc, oy = -(ih - 1350) * 0.52;
	return (
		<AbsoluteFill style={{background: C.noche, overflow: 'hidden'}}>
			<Img src={staticFile('img/interior-cantantes.jpg')} style={{position: 'absolute', left: 0, top: oy, width: 1080, height: ih, filter: 'brightness(0.78) saturate(1.15)'}} />
			<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(11,16,38,0.95) 0%, rgba(11,16,38,0.6) 22%, rgba(11,16,38,0.05) 36%, rgba(11,16,38,0.05) 62%, rgba(11,16,38,0.92) 80%)`}} />
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% 8%, #FFD27A55 0%, transparent 40%)`, mixBlendMode: 'screen'}} />
			<AbsoluteFill style={{alignItems: 'center', top: 22}}>
				<Titulo escala={0.82} />
				<div style={{marginTop: 6, fontFamily: F.texto, fontWeight: 800, fontSize: 30, color: C.crema, textShadow: sombra}}>Tu mesa ya está lista. Las voces también.</div>
			</AbsoluteFill>
			{ETIQUETAS.map(([n, frase, x, y, col]) => (
				<div key={n} style={{position: 'absolute', left: x * 1080, top: y, transform: 'translateX(-50%)', textAlign: 'center', background: 'rgba(11,16,38,0.82)', borderTop: `4px solid ${col}`, borderRadius: 12, padding: '6px 12px', boxShadow: '0 6px 16px rgba(0,0,0,0.6)'}}>
					<div style={{fontFamily: F.titulo, fontSize: 30, color: C.blanco, lineHeight: 1.05, whiteSpace: 'nowrap'}}>{n.toUpperCase()}</div>
					<div style={{fontFamily: F.script, fontSize: 22, color: col, whiteSpace: 'nowrap'}}>{frase}</div>
				</div>
			))}
			<AbsoluteFill style={{alignItems: 'center', top: 968}}>
				<div style={{display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12}}>
					<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 28, color: C.blanco, background: 'rgba(11,16,38,0.85)', border: `2px solid ${C.oro}`, borderRadius: 30, padding: '6px 18px'}}>Polar bien fría + carne en vara</span>
					<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 28, color: C.blanco, background: 'rgba(11,16,38,0.85)', border: `2px solid ${C.oro}`, borderRadius: 30, padding: '6px 18px'}}>+ Morichal Amigo</span>
				</div>
				<Datos />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- Flyer 3: los elementos de la noche, cada cosa en su lugar ----------
const MARCOS: [string, string, string, string, number][] = [
	['img/reynaldo.png', 'REYNALDO', 'CAMACHO', '#E3A73A', 0],
	['img/maria.png', 'MARÍA', 'JOROPA', '#B57EDC', 0],
	['img/betzonia.png', 'BETZONIA', 'ARMAS', C.naranja, 0],
	['img/manuel.png', 'MANUEL', 'SALAS', '#3A5BD9', 0],
];
const Circulo: React.FC<{children: React.ReactNode; texto: string}> = ({children, texto}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
		<div style={{width: 170, height: 170, borderRadius: 85, overflow: 'hidden', border: `5px solid ${C.oro}`, boxShadow: '0 8px 18px rgba(0,0,0,0.7)', background: '#FFF8EC', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
		<div style={{fontFamily: F.titulo, fontSize: 30, color: C.blanco, textShadow: sombra, textAlign: 'center', lineHeight: 1.05}}>{texto}</div>
	</div>
);
export const FlyerElementos: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.noche, overflow: 'hidden'}}>
			<Sabana noche={0.85} sol={0.3} />
			<AbsoluteFill style={{background: 'rgba(11,16,38,0.35)'}} />
			<Cuerdas golpes={[0]} opacidad={0.22} />
			<AbsoluteFill style={{alignItems: 'center', top: 22}}>
				<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: C.crema}}>TASCA EL BODEGÓN DE JONY PRESENTA</div>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
					<span style={{fontFamily: F.titulo, fontSize: 96, lineHeight: 1.05, color: C.oro, textShadow: `0 0 26px ${C.naranja}, ${sombra}`}}>GRAN AMANECER</span>
					<span style={{fontFamily: F.script, fontSize: 66, color: C.crema, textShadow: sombra}}>Llanero</span>
				</div>
				<div style={{marginTop: 4}}><EnVivo /></div>
			</AbsoluteFill>
			{/* los cuatro cantantes, cada uno en su marco */}
			<div style={{position: 'absolute', top: 232, left: 30, right: 30, display: 'flex', justifyContent: 'space-between'}}>
				{MARCOS.map(([src, n1, n2, col]) => (
					<div key={src} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 240}}>
						<div style={{position: 'relative', width: 236, height: 300, borderRadius: '118px 118px 18px 18px', overflow: 'hidden', border: `4px solid ${C.oro}`, background: `linear-gradient(180deg, ${col}55 0%, ${col} 100%)`, boxShadow: `0 0 24px ${col}88, 0 10px 18px rgba(0,0,0,0.6)`}}>
							<Img src={staticFile(src)} style={{position: 'absolute', bottom: 0, left: '50%', height: 270, transform: 'translateX(-50%)'}} />
						</div>
						<div style={{fontFamily: F.titulo, fontSize: 38, lineHeight: 1, color: C.blanco, marginTop: 10, textShadow: sombra}}>{n1}</div>
						<div style={{fontFamily: F.titulo, fontSize: 38, lineHeight: 1, color: C.oro, textShadow: sombra}}>{n2}</div>
					</div>
				))}
			</div>
			{/* combo y agrupación */}
			<div style={{position: 'absolute', top: 642, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 70}}>
				<Circulo texto="CARNE EN VARA"><Img src={staticFile('img/carne.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%'}} /></Circulo>
				<Circulo texto="POLAR BIEN FRÍA"><Img src={staticFile('img/polar.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '25% 42%'}} /></Circulo>
				<Circulo texto={'PRESENTACIÓN ESPECIAL'}><LogoMorichal s={164} /></Circulo>
			</div>
			{/* atuendo */}
			<div style={{position: 'absolute', top: 900, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6}}>
				<IconoSombrero s={84} /><IconoBota s={76} /><IconoAlpargata s={84} />
				<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 32, color: C.crema, marginLeft: 12, textShadow: sombra}}>Trae tu sombrero, tus botas o alpargatas</span>
			</div>
			<AbsoluteFill style={{alignItems: 'center', top: 1002}}>
				<Datos ancho={1000} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
