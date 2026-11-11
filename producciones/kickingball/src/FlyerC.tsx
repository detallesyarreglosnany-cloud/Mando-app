import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

// Versión 3: los 7 escudos en rueda alrededor del VS, sobre el estadio de noche.
const C = {noche: '#060A14', oro: '#F5B82E', amazonas: '#1ED37F', bolivar: '#FF8A1F', blanco: '#FFFFFF'};
const TITULO = 'Anton, sans-serif';
const TEXTO = 'TikTokSans, sans-serif';
const sombra = '0 6px 22px rgba(0,0,0,0.85)';

type L = {logo: string; color: string; estado: 'A' | 'B'; tarjeta?: boolean};
// Ángulos en grados desde arriba, sentido horario. Amazonas a la izquierda + arriba, Bolívar a la derecha.
const RUEDA: (L & {ang: number})[] = [
	{logo: 'logos/fenix.png', color: '#FF7A1A', estado: 'A', ang: 0},
	{logo: 'logos/apacuanas.jpg', color: '#D9A93A', estado: 'B', ang: 51.4, tarjeta: true},
	{logo: 'logos/panteras.png', color: '#E3182D', estado: 'B', ang: 102.9},
	{logo: 'logos/sportgirls.png', color: '#C431D8', estado: 'B', ang: 154.3},
	{logo: 'logos/chiks.png', color: '#C0175A', estado: 'A', ang: 205.7},
	{logo: 'logos/segundabase.png', color: '#2747C9', estado: 'A', ang: 257.1},
	{logo: 'logos/alpha.png', color: '#3A6BFF', estado: 'A', ang: 308.6},
];
const CX = 540, CY = 600, R = 320, TAM = 200;

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

const Ficha: React.FC<{titulo: string; children: React.ReactNode}> = ({titulo, children}) => (
	<div style={{flex: 1, height: 150, borderRadius: 22, background: 'rgba(6,10,20,0.85)', border: `2px solid ${C.oro}88`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
		<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: C.oro}}>{titulo}</div>
		{children}
	</div>
);

export const FlyerC: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.noche, overflow: 'hidden'}}>
			<Img src={staticFile('img/estadio.jpg')} style={{position: 'absolute', left: 0, top: -250, width: 1080, height: 1920, objectFit: 'cover'}} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,10,20,0.85) 0%, rgba(6,10,20,0.45) 30%, rgba(6,10,20,0.55) 60%, rgba(6,10,20,0.95) 80%)'}} />
			<AbsoluteFill style={{background: `radial-gradient(circle at ${CX}px ${CY}px, ${C.oro}33 0%, transparent 38%)`}} />
			{/* mitades de color por estado */}
			<AbsoluteFill style={{background: `linear-gradient(90deg, ${C.amazonas}30 0%, transparent 40%, transparent 60%, ${C.bolivar}30 100%)`}} />

			{/* encabezado */}
			<AbsoluteFill style={{alignItems: 'center', top: 34}}>
				<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 28, letterSpacing: 7, color: C.blanco, textShadow: sombra}}>GRAN ENCUENTRO DE KICKINGBALL</div>
				<div style={{fontFamily: TITULO, fontSize: 66, color: C.blanco, marginTop: 2, textShadow: sombra, letterSpacing: 1}}>
					<span style={{color: C.oro}}>7</span> EQUIPOS · <span style={{color: C.oro}}>2</span> ESTADOS · <span style={{color: C.oro}}>1</span> TROFEO
				</div>
			</AbsoluteFill>

			{/* aro */}
			<svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
				<circle cx={CX} cy={CY} r={R} fill="none" stroke={C.oro} strokeWidth={4} strokeDasharray="14 12" opacity={0.75} style={{filter: `drop-shadow(0 0 10px ${C.oro})`}} />
			</svg>

			{/* centro */}
			<div style={{position: 'absolute', left: CX - 210, top: CY - 190, width: 420, height: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
				<Img src={staticFile('img/trofeo.jpg')} style={{width: 72, height: 128, objectFit: 'cover', mixBlendMode: 'screen', filter: 'saturate(0.7) brightness(0.85)'}} />
				<div style={{fontFamily: TITULO, fontSize: 78, lineHeight: 1, color: C.amazonas, marginTop: 6, textShadow: `0 0 24px ${C.amazonas}99, ${sombra}`}}>AMAZONAS</div>
				<div style={{fontFamily: TITULO, fontSize: 50, lineHeight: 1.15, color: C.oro, textShadow: sombra}}>VS</div>
				<div style={{fontFamily: TITULO, fontSize: 78, lineHeight: 1, color: C.bolivar, textShadow: `0 0 24px ${C.bolivar}99, ${sombra}`}}>BOLÍVAR</div>
			</div>

			{/* escudos */}
			{RUEDA.map((l) => {
				const a = (l.ang * Math.PI) / 180;
				const x = CX + R * Math.sin(a), y = CY - R * Math.cos(a);
				const aro = l.estado === 'A' ? C.amazonas : C.bolivar;
				return (
					<div key={l.logo} style={{position: 'absolute', left: x - TAM / 2, top: y - TAM / 2, width: TAM, height: TAM, borderRadius: TAM, background: 'radial-gradient(circle, rgba(20,26,40,0.95) 55%, rgba(6,10,20,0.95) 100%)', border: `6px solid ${aro}`, boxShadow: `0 0 26px ${aro}AA, 0 12px 20px rgba(0,0,0,0.8)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<Img src={staticFile(l.logo)} style={{maxWidth: l.tarjeta ? '84%' : '80%', maxHeight: '80%', objectFit: 'contain', borderRadius: l.tarjeta ? 10 : 0, filter: `drop-shadow(0 0 8px ${l.color})`}} />
					</div>
				);
			})}

			{/* información */}
			<div style={{position: 'absolute', left: 40, right: 40, top: 1055, display: 'flex', gap: 18}}>
				<Ficha titulo="FECHA">
					<div style={{fontFamily: TITULO, fontSize: 64, lineHeight: 1, color: C.blanco, marginTop: 6}}>13 Y 14</div>
					<div style={{fontFamily: TITULO, fontSize: 30, color: C.blanco, letterSpacing: 2}}>DE NOVIEMBRE</div>
				</Ficha>
				<Ficha titulo="HORA">
					<div style={{fontFamily: TITULO, fontSize: 72, lineHeight: 1.1, color: C.blanco, marginTop: 6}}>4:30 P.M.</div>
				</Ficha>
				<Ficha titulo="LUGAR">
					<div style={{fontFamily: TITULO, fontSize: 38, lineHeight: 1.05, color: C.blanco, textAlign: 'center', marginTop: 8}}>CANCHA<br />AV. DEL EJÉRCITO</div>
				</Ficha>
			</div>
			<div style={{position: 'absolute', left: 40, right: 40, top: 1225, height: 92, borderRadius: 50, background: C.amazonas, boxShadow: `0 0 30px ${C.amazonas}88`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26}}>
				<span style={{fontFamily: TITULO, fontSize: 56, color: C.noche}}>ENTRADA GRATIS</span>
				<span style={{width: 10, height: 10, borderRadius: 5, background: C.noche}} />
				<span style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 36, color: C.noche}}>¡Ven a apoyar a tu equipo!</span>
			</div>
		</AbsoluteFill>
	);
};
