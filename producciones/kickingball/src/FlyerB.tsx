import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

// Versión 2: pantalla partida en diagonal. Amazonas arriba (selva), Bolívar abajo (Salto Ángel).
const C = {noche: '#060A14', oro: '#F5B82E', amazonas: '#1ED37F', bolivar: '#FF8A1F', blanco: '#FFFFFF'};
const TITULO = 'Anton, sans-serif';
const TEXTO = 'TikTokSans, sans-serif';
const sombra = '0 6px 22px rgba(0,0,0,0.85)';

type L = {logo: string; color: string; tarjeta?: boolean};
const AMAZONAS: L[] = [
	{logo: 'logos/fenix.png', color: '#FF7A1A'},
	{logo: 'logos/alpha.png', color: '#3A6BFF'},
	{logo: 'logos/segundabase.png', color: '#2747C9'},
	{logo: 'logos/chiks.png', color: '#C0175A'},
];
const BOLIVAR: L[] = [
	{logo: 'logos/apacuanas.jpg', color: '#D9A93A', tarjeta: true},
	{logo: 'logos/panteras.png', color: '#E3182D'},
	{logo: 'logos/sportgirls.png', color: '#C431D8'},
];

const Fila: React.FC<{lista: L[]; y: number; tam: number; gap: number}> = ({lista, y, tam, gap}) => {
	const ancho = lista.length * tam + (lista.length - 1) * gap;
	return (
		<>
			{lista.map((l, k) => (
				<div key={l.logo} style={{position: 'absolute', left: (1080 - ancho) / 2 + k * (tam + gap), top: y, width: tam, height: tam, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Img src={staticFile(l.logo)} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: l.tarjeta ? 18 : 0, border: l.tarjeta ? `3px solid ${C.oro}` : undefined, filter: `drop-shadow(0 0 18px ${l.color}) drop-shadow(0 12px 16px rgba(0,0,0,0.9))`}} />
				</div>
			))}
		</>
	);
};

const useFuentes = () => {
	const [h] = useState(() => delayRender('fuentes'));
	useEffect(() => {
		const caras = [
			new FontFace('Anton', `url(${staticFile('fonts/Anton-Regular.ttf')})`),
			new FontFace('TikTokSans', `url(${staticFile('fonts/TikTokSans-SemiBold.ttf')})`, {weight: '600'}),
			new FontFace('TikTokSans', `url(${staticFile('fonts/TikTokSans-ExtraBold.ttf')})`, {weight: '800'}),
		];
		Promise.all(caras.map((c) => c.load())).then((cs) => {
			cs.forEach((c) => document.fonts.add(c));
			continueRender(h);
		});
	}, [h]);
};

// La costura diagonal: de (0, 640) a (1080, 560)
const ARRIBA = 'polygon(0 0, 100% 0, 100% 560px, 0 640px)';
const ABAJO = 'polygon(0 640px, 100% 560px, 100% 1060px, 0 1060px)';

export const FlyerB: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.noche, overflow: 'hidden'}}>
			{/* Amazonas */}
			<AbsoluteFill style={{clipPath: ARRIBA}}>
				<Img src={staticFile('img/amazonas.jpg')} style={{position: 'absolute', left: 0, top: -560, width: 1080, height: 1920, objectFit: 'cover'}} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,10,20,0.92) 0%, rgba(4,30,18,0.55) 30%, rgba(4,40,22,0.6) 100%)'}} />
			</AbsoluteFill>
			{/* Bolívar */}
			<AbsoluteFill style={{clipPath: ABAJO}}>
				<Img src={staticFile('img/bolivar.jpg')} style={{position: 'absolute', left: 0, top: -260, width: 1080, height: 1920, objectFit: 'cover'}} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(50,20,0,0.55) 0%, rgba(40,16,0,0.6) 70%, rgba(6,10,20,0.95) 100%)'}} />
			</AbsoluteFill>
			{/* costura dorada */}
			<svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
				<line x1={0} y1={640} x2={1080} y2={560} stroke={C.oro} strokeWidth={8} style={{filter: `drop-shadow(0 0 16px ${C.oro})`}} />
			</svg>

			{/* encabezado */}
			<AbsoluteFill style={{alignItems: 'center', top: 34}}>
				<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 28, letterSpacing: 7, color: C.oro, textShadow: sombra}}>GRAN ENCUENTRO DE KICKINGBALL</div>
				<div style={{fontFamily: TITULO, fontSize: 92, lineHeight: 1.05, color: C.blanco, marginTop: 4, textShadow: sombra}}>¿CON QUIÉN ESTÁS TÚ?</div>
			</AbsoluteFill>

			{/* Amazonas */}
			<div style={{position: 'absolute', left: 40, top: 205, fontFamily: TITULO, fontSize: 76, color: C.amazonas, textShadow: `0 0 26px ${C.amazonas}99, ${sombra}`, transform: 'rotate(-4deg)'}}>AMAZONAS</div>
			<Fila lista={AMAZONAS} y={310} tam={225} gap={26} />

			{/* VS */}
			<div style={{position: 'absolute', left: 540 - 72, top: 600 - 72, width: 144, height: 144, borderRadius: 72, background: C.oro, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 50px ${C.oro}, 0 8px 20px rgba(0,0,0,0.7)`, border: `5px solid ${C.noche}`}}>
				<span style={{fontFamily: TITULO, fontSize: 78, color: C.noche}}>VS</span>
			</div>

			{/* Bolívar */}
			<Fila lista={BOLIVAR} y={700} tam={255} gap={34} />
			<div style={{position: 'absolute', right: 40, top: 960, fontFamily: TITULO, fontSize: 76, color: C.bolivar, textShadow: `0 0 26px ${C.bolivar}99, ${sombra}`, transform: 'rotate(-4deg)'}}>BOLÍVAR</div>

			{/* información */}
			<div style={{position: 'absolute', left: 40, right: 40, top: 1080, height: 235, borderRadius: 28, background: 'rgba(6,10,20,0.88)', border: `3px solid ${C.oro}`, boxShadow: `0 0 40px ${C.oro}44`, display: 'flex', alignItems: 'center'}}>
				<div style={{width: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: `3px solid ${C.oro}66`}}>
					<div style={{fontFamily: TITULO, fontSize: 112, lineHeight: 1, color: C.oro}}>13 Y 14</div>
					<div style={{fontFamily: TITULO, fontSize: 50, lineHeight: 1.1, color: C.blanco, letterSpacing: 2}}>DE NOVIEMBRE</div>
				</div>
				<div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
					<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 46, color: C.blanco}}><span style={{color: C.oro}}>HORA:</span> 4:30 P.M.</div>
					<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 40, color: C.blanco}}>Cancha Av. del Ejército</div>
					<div style={{marginTop: 6, fontFamily: TITULO, fontSize: 44, color: C.noche, background: C.amazonas, padding: '2px 30px', borderRadius: 40, boxShadow: `0 0 22px ${C.amazonas}99`}}>ENTRADA GRATIS</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
