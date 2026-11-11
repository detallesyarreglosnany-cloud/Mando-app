import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

const C = {noche: '#060A14', oro: '#F5B82E', amazonas: '#1ED37F', bolivar: '#FF8A1F', blanco: '#FFFFFF'};
const TITULO = 'Anton, sans-serif';
const TEXTO = 'TikTokSans, sans-serif';

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

const Logo: React.FC<{l: L; x: number; y: number; tam: number}> = ({l, x, y, tam}) => (
	<div style={{position: 'absolute', left: x - tam / 2, top: y - tam / 2, width: tam, height: tam, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
		<Img src={staticFile(l.logo)} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: l.tarjeta ? 16 : 0, border: l.tarjeta ? `3px solid ${C.oro}` : undefined, filter: `drop-shadow(0 0 16px ${l.color}) drop-shadow(0 10px 14px rgba(0,0,0,0.85))`}} />
	</div>
);

const Etiqueta: React.FC<{texto: string; color: string; x: number; y: number}> = ({texto, color, x, y}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: 'translateX(-50%)', fontFamily: TEXTO, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: C.noche, background: color, padding: '8px 26px', borderRadius: 40, boxShadow: `0 0 26px ${color}99`}}>{texto}</div>
);

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

export const Flyer: React.FC = () => {
	useFuentes();
	const sombra = '0 6px 22px rgba(0,0,0,0.85)';
	return (
		<AbsoluteFill style={{background: C.noche, overflow: 'hidden'}}>
			{/* foto del enfrentamiento */}
			<Img src={staticFile('img/enfrentamiento.jpg')} style={{position: 'absolute', left: 0, top: -170, width: 1080, height: 1920, objectFit: 'cover'}} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,10,20,0.92) 0%, rgba(6,10,20,0.35) 22%, rgba(6,10,20,0.05) 34%, rgba(6,10,20,0.35) 50%, rgba(6,10,20,0.9) 62%, rgba(6,10,20,0.97) 100%)'}} />
			<AbsoluteFill style={{background: `linear-gradient(90deg, ${C.amazonas}2E 0%, transparent 35%, transparent 65%, ${C.bolivar}2E 100%)`}} />

			{/* encabezado */}
			<AbsoluteFill style={{alignItems: 'center', top: 42}}>
				<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 30, letterSpacing: 7, color: C.blanco, textShadow: sombra}}>GRAN ENCUENTRO DE KICKINGBALL</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 6}}>
					<span style={{fontFamily: TITULO, fontSize: 114, color: C.amazonas, textShadow: `0 0 34px ${C.amazonas}AA, ${sombra}`}}>AMAZONAS</span>
					<span style={{width: 96, height: 96, borderRadius: 48, background: C.oro, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TITULO, fontSize: 56, color: C.noche, boxShadow: `0 0 34px ${C.oro}`}}>VS</span>
					<span style={{fontFamily: TITULO, fontSize: 114, color: C.bolivar, textShadow: `0 0 34px ${C.bolivar}AA, ${sombra}`}}>BOLÍVAR</span>
				</div>
				<div style={{fontFamily: TITULO, fontSize: 64, color: C.blanco, letterSpacing: 2, marginTop: -4, textShadow: sombra}}>
					LA CANCHA <span style={{color: C.oro, textShadow: `0 0 30px #FF6A00, ${sombra}`}}>ARDE</span>
				</div>
			</AbsoluteFill>

			{/* equipos: Amazonas a la izquierda (camiseta verde), Bolívar a la derecha (camiseta naranja) */}
			<Etiqueta texto="AMAZONAS" color={C.amazonas} x={250} y={615} />
			<Logo l={AMAZONAS[0]} x={150} y={765} tam={180} />
			<Logo l={AMAZONAS[1]} x={350} y={765} tam={180} />
			<Logo l={AMAZONAS[2]} x={150} y={950} tam={180} />
			<Logo l={AMAZONAS[3]} x={350} y={950} tam={180} />

			<Etiqueta texto="BOLÍVAR" color={C.bolivar} x={830} y={615} />
			<Logo l={BOLIVAR[0]} x={730} y={765} tam={185} />
			<Logo l={BOLIVAR[1]} x={930} y={765} tam={185} />
			<Logo l={BOLIVAR[2]} x={830} y={950} tam={185} />

			{/* trofeo pequeño al centro */}
			<div style={{position: 'absolute', left: 540 - 62, top: 715, width: 124, height: 220}}>
				<Img src={staticFile('img/trofeo.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'screen', filter: 'saturate(0.7) brightness(0.85)'}} />
			</div>
			<div style={{position: 'absolute', left: 540, top: 935, transform: 'translateX(-50%)', fontFamily: TITULO, fontSize: 34, lineHeight: 1.05, color: C.oro, textAlign: 'center', textShadow: sombra}}>SOLO UNO<br />SE LO LLEVA</div>

			{/* información */}
			<AbsoluteFill style={{top: 1055, alignItems: 'center'}}>
				<div style={{width: 1000, height: 3, background: `linear-gradient(90deg, transparent, ${C.oro}, transparent)`}} />
				<div style={{fontFamily: TITULO, fontSize: 88, lineHeight: 1.05, color: C.oro, marginTop: 12, textShadow: `0 0 26px ${C.oro}66`}}>13 Y 14 DE NOVIEMBRE</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 6}}>
					<span style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 42, color: C.blanco}}><span style={{color: C.oro}}>HORA:</span> 4:30 P.M.</span>
					<span style={{width: 10, height: 10, borderRadius: 5, background: C.oro}} />
					<span style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 42, color: C.blanco}}>Cancha Av. del Ejército</span>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 14}}>
					<span style={{fontFamily: TITULO, fontSize: 44, color: C.noche, background: C.amazonas, padding: '4px 30px', borderRadius: 40, boxShadow: `0 0 24px ${C.amazonas}99`}}>ENTRADA GRATIS</span>
					<span style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 34, color: C.blanco}}>¡Trae a tu barra!</span>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
