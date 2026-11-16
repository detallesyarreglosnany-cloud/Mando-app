import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {Brillos, C, Destello, F, FondoMarca, Pildora, S, clamp, entra, golpe, sombra, sube, useFuentes} from './comun';
import T from './tiemposH.json';

// "Un antes y un después" (57 s): gancho, los cuatro ponentes en pantalla dividida, apagón, título de la cumbre,
// lo que se aprende, agradecimiento con los 28 patrocinadores uno por uno (1 s cada uno), muro completo y entradas.
// Tiempos: tiemposH.json (gen_tiempos_gracias2.py), que también usa mezcla_gracias2.py. Cortes al pulso (120 BPM).
export const DURACION_GRACIAS2 = T.DUR;
const E = T.E as unknown as Record<'gancho' | 'ponentes' | 'titulo' | 'valor' | 'logos' | 'cta', readonly [number, number]>;
const ATRIBUCION = 'Imágenes: Sentinel-2 cloudless — s2maps.eu, EOX IT Services GmbH (contiene datos modificados de Copernicus Sentinel 2016), CC BY 4.0';
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const Txt: React.FC<{children: React.ReactNode; size: number; font?: string; color?: string; peso?: number; style?: React.CSSProperties}> = ({children, size, font = F.titulo, color = C.blanco, peso, style}) => (
	<div style={{fontFamily: font, fontWeight: peso, fontSize: size, lineHeight: 1.08, color, textAlign: 'center', textShadow: sombra, ...style}}>{children}</div>
);
const cuadroSat = (i: number) => staticFile(`sat59/${String(Math.max(0, Math.min(599, Math.round(i))) + 1).padStart(4, '0')}.jpg`);

// ---------------------------------------------------------------- 0. GANCHO: antes | después
const Gancho: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / 30;
	const kA = f - S(T.antes), kD = f - S(T.despues);
	const fuente = (x: number) => lerp(4, 100, Easing.out(Easing.cubic)(Math.min(1, x / 2.2)));
	const barrido = interpolate(kD, [0, 9], [0, 100], {...clamp, easing: Easing.out(Easing.cubic)}); // el color entra con "después"
	const capas = (gris: boolean) => [0, 1, 2, 3].map((j) => <Img key={j} src={cuadroSat(fuente(t + j / 120))} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 1 / (j + 1), filter: gris ? 'grayscale(1) brightness(0.55)' : 'saturate(1.25)'}} />);
	return (
		<AbsoluteFill style={{background: '#01040D'}}>
			<AbsoluteFill>{capas(true)}</AbsoluteFill>
			<AbsoluteFill style={{clipPath: `inset(0 ${100 - barrido}% 0 0)`}}>{capas(false)}</AbsoluteFill>
			{kD >= 0 && barrido < 100 && <div style={{position: 'absolute', top: 0, bottom: 0, left: `${barrido}%`, width: 10, marginLeft: -5, background: '#fff', boxShadow: `0 0 60px 20px ${C.oro}`}} />}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(1,4,13,0.8) 0%, rgba(1,4,13,0.25) 40%, rgba(1,4,13,0.25) 60%, rgba(1,4,13,0.85) 100%)'}} />
			<AbsoluteFill style={{alignItems: 'center', top: 250, gap: 10}}>
				<div style={{opacity: entra(f, 3, 4), transform: `scale(${golpe(f, 3, 1.6)})`}}><Pildora size={46}>ESTE 4 DE DICIEMBRE</Pildora></div>
				<Txt size={190} style={{marginTop: 20, opacity: entra(f, S(T.V['01'] + 1.3), 2), transform: `scale(${golpe(f, S(T.V['01'] + 1.3), 2.2)})`, lineHeight: 1}}>AMAZONAS</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 1090, gap: 0}}>
				<Txt size={150} color="#AEB6C4" style={{opacity: entra(kA, 0, 2), transform: `scale(${golpe(kA, 0, 2)})`, letterSpacing: 6, lineHeight: 1, textDecoration: kD >= 0 ? 'line-through' : undefined, textDecorationColor: C.oro}}>UN ANTES</Txt>
				<Txt size={56} font={F.texto} peso={900} color={C.celeste} style={{opacity: entra(kD, -6, 4), margin: '6px 0'}}>Y UN</Txt>
				<Txt size={230} color={C.oro} style={{opacity: entra(kD, 0, 2), transform: `scale(${golpe(kD, 0, 2.6)})`, textShadow: `0 0 80px ${C.oro}AA, ${sombra}`, lineHeight: 0.95}}>DESPUÉS</Txt>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 30, right: 30, bottom: 22, fontFamily: F.texto, fontWeight: 500, fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'center'}}>{ATRIBUCION}</div>
			<Destello en={S(T.despues)} dur={8} max={0.6} color="#FFF6D8" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 1. LOS CUATRO PONENTES, pantalla dividida, y apagón
const PONENTES = [
	{n: ['JOSÉ', 'RODRÍGUEZ'], tema: 'LIDERA TU EQUIPO', foto: 'img/jose-recorte.png', col: C.azul},
	{n: ['JUAN ERNESTO', 'SIERRA'], tema: 'ORGANIZA TUS FINANZAS', foto: 'img/juan-recorte.png', col: '#0E7C86'},
	{n: ['DANIELA', 'SILVA'], tema: 'TRANSFORMACIÓN DIGITAL', foto: 'img/daniela-recorte.png', col: '#5B3FD6'},
	{n: ['TANIA', 'ALZURU'], tema: 'POSICIONA TU MARCA', foto: 'img/tania-recorte.png', col: '#C2571A'},
];
const Ponentes: React.FC = () => {
	const f = useCurrentFrame();
	const kA = f - S(T.apagon - E.ponentes[0]);
	// apagón: parpadeo y negro
	const luz = kA < 0 ? 1 : [1, 0.25, 0.8, 0.1, 0.45, 0][Math.min(5, kA)];
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{filter: `brightness(${luz})`}}>
				{PONENTES.map((p, i) => {
					const k = f - S(T.ponentes[i] - E.ponentes[0]);
					if (k < 0) return null;
					const col = i % 2, fila = Math.floor(i / 2);
					const e = interpolate(k, [0, 7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
					const dx = (col ? 1 : -1) * 540 * (1 - e), dy = (fila ? 1 : -1) * 200 * (1 - e);
					return (
						<div key={i} style={{position: 'absolute', left: col * 540, top: fila * 960, width: 540, height: 960, overflow: 'hidden', transform: `translate(${dx}px, ${dy}px)`, background: `linear-gradient(160deg, ${p.col} 0%, ${C.marino} 78%)`, boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.18)'}}>
							<div style={{position: 'absolute', left: 270 - 220, top: 330, width: 440, height: 440, borderRadius: '50%', border: `5px solid ${C.oro}`, opacity: 0.8, transform: `scale(${golpe(k, 2, 0.6)})`}} />
							<Img src={staticFile(p.foto)} style={{position: 'absolute', bottom: 0, left: '50%', height: 700, transform: `translateX(-50%) scale(${interpolate(k, [0, 100], [1.04, 1.12], clamp)})`, transformOrigin: 'bottom center', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.6))'}} />
							<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 330, background: `linear-gradient(180deg, transparent, ${C.marino} 70%)`}} />
							<div style={{position: 'absolute', left: 0, right: 0, top: 44, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
								<Txt size={p.n[0].length > 8 ? 56 : 72} style={{opacity: entra(k, 2, 3), transform: `scale(${golpe(k, 2, 1.5)})`, lineHeight: 1}}>{p.n[0]}</Txt>
								<Txt size={72} color={C.oro} style={{opacity: entra(k, 4, 3), transform: `scale(${golpe(k, 4, 1.5)})`, lineHeight: 1}}>{p.n[1]}</Txt>
							</div>
							<div style={{position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center', opacity: entra(k, 7, 3), transform: `scale(${golpe(k, 7, 1.5)})`}}>
								<Pildora size={p.tema.length > 18 ? 26 : 30}>{p.tema}</Pildora>
							</div>
							{k < 6 && <AbsoluteFill style={{background: '#fff', opacity: interpolate(k, [0, 6], [0.7, 0], clamp)}} />}
						</div>
					);
				})}
				{/* cruz divisoria */}
				<div style={{position: 'absolute', left: 537, top: 0, width: 6, height: 1920, background: C.oro, opacity: entra(f, 0, 6), boxShadow: `0 0 30px ${C.oro}`}} />
				<div style={{position: 'absolute', left: 0, top: 957, width: 1080, height: 6, background: C.oro, opacity: entra(f, 15, 6), boxShadow: `0 0 30px ${C.oro}`}} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 2. LA GRAN CUMBRE
const Titulo: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="tit" n={34} />
			{new Array(40).fill(0).map((_, i) => {
				const ang = random(`a${i}`) * Math.PI * 2, d = interpolate(f, [0, 30], [0, 300 + random(`d${i}`) * 700], {...clamp, easing: Easing.out(Easing.cubic)});
				const s = 5 + random(`s${i}`) * 9;
				return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(ang) * d, top: 900 + Math.sin(ang) * d, width: s, height: s, borderRadius: s, background: i % 3 ? C.oro : '#fff', opacity: interpolate(f, [0, 6, 44], [0, 1, 0], clamp), boxShadow: `0 0 ${s * 3}px ${C.oro}`}} />;
			})}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 4, padding: '0 40px', transform: `scale(${interpolate(f, [0, 135], [1, 1.06])})`}}>
				<Txt size={64} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 16, opacity: entra(f, 2, 3)}}>LA GRAN</Txt>
				<Txt size={250} style={{opacity: entra(f, 0, 2), transform: `scale(${golpe(f, 0, 2.6)})`, lineHeight: 0.95}}>CUMBRE</Txt>
				<Txt size={50} font={F.texto} peso={900} style={{letterSpacing: 8, opacity: entra(f, S(0.9), 3)}}>DE</Txt>
				<Txt size={136} style={{opacity: entra(f, S(1.0), 2), transform: `scale(${golpe(f, S(1.0), 2)})`, lineHeight: 1}}>TRANSFORMACIÓN</Txt>
				<Txt size={150} color={C.oro} style={{opacity: entra(f, S(1.7), 2), transform: `scale(${golpe(f, S(1.7), 2)})`, textShadow: `0 0 60px ${C.oro}99, ${sombra}`, lineHeight: 1}}>EMPRESARIAL</Txt>
				<div style={{marginTop: 30, opacity: entra(f, S(2.4), 3), transform: `scale(${golpe(f, S(2.4), 1.8)})`}}><Pildora fondo={C.azul} color={C.blanco} size={62}>AMAZONAS 2026</Pildora></div>
				<Txt size={34} font={F.texto} peso={800} color={C.celeste} style={{letterSpacing: 5, marginTop: 34, opacity: entra(f, S(3.1), 5)}}>CLUB PARAPATA · PUERTO AYACUCHO · 2:00 PM</Txt>
			</AbsoluteFill>
			<Destello en={0} dur={14} max={1} color="#FFF6D8" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 3. LO QUE TE LLEVAS
const Valor: React.FC = () => {
	const f = useCurrentFrame();
	const r = (s: number) => f - S(s - E.valor[0]);
	const pilares: [string, string, number, string][] = [['LIDERA', 'tu equipo', T.pilares[0], C.azul], ['VENDE', 'más', T.pilares[1], C.celeste], ['CRECE', 'con tu negocio', T.pilares[2], C.oro]];
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="val" n={22} />
			<AbsoluteFill style={{alignItems: 'center', top: 190, gap: 6}}>
				<Txt size={62} font={F.texto} peso={900} style={{opacity: entra(f, 2, 4), transform: `translateY(${sube(f, 2, 30)}px)`}}>UNA TARDE PARA</Txt>
				<Txt size={120} color={C.oro} style={{opacity: entra(f, 8, 3), transform: `scale(${golpe(f, 8, 1.6)})`, textShadow: `0 0 50px ${C.oro}88, ${sombra}`}}>APRENDER A</Txt>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 70, right: 70, top: 600, display: 'flex', flexDirection: 'column', gap: 50}}>
				{pilares.map(([w, sub, s, col], i) => {
					const k = r(s);
					if (k < 0) return null;
					const x = interpolate(k, [0, 9], [i % 2 ? 600 : -600, 0], {...clamp, easing: Easing.out(Easing.cubic)});
					return (
						<div key={w} style={{display: 'flex', alignItems: 'center', gap: 30, transform: `translateX(${x}px)`, opacity: entra(k, 0, 3)}}>
							<div style={{width: 22, alignSelf: 'stretch', borderRadius: 11, background: col, boxShadow: `0 0 40px ${col}`}} />
							<div style={{fontFamily: F.titulo, fontSize: 240, lineHeight: 0.95, color: col === C.oro ? C.oro : C.blanco, textShadow: sombra, transform: `scale(${golpe(k, 0, 1.5)})`, transformOrigin: 'left center'}}>{w}</div>
							<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 46, lineHeight: 1.15, color: C.blanco, opacity: entra(k, 7, 5), flex: 1}}>{sub}</div>
						</div>
					);
				})}
			</div>
			{T.pilares.map((s, i) => <Destello key={i} en={S(s - E.valor[0])} dur={6} max={0.3} color={C.celeste} />)}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 4. LOS 28, UNO POR UNO, Y EL MURO
const LOGOS = ['parapata', 'ferreconi', 'mas-network', 'perfumes', 'navas', 'amavision', 'galaxia', 'tecnoama', 'betty-guillen', 'jesus-nazareth', 'marco', 'shamanika', 'puerto-venado', 'multiempresariales', 'orthosmile', 'tania', 'wahari', 'condimentos', 'delicias', 'moto-daniel', 'shabono', 'milsi', 'divino-nino', 'broaster', 'kubia', 'farma', 'jac', 'casita'];
const N = LOGOS.length;
const GW = 880, GH = GW * 2 / 3, GCX = 540, GCY = 640; // logo grande
const MW = 132, MH = 88, MG = 12, MTOP = 1392; // mosaico pequeño 7 x 4
const mini = (i: number) => ({x: 540 - (7 * MW + 6 * MG) / 2 + (i % 7) * (MW + MG), y: MTOP + Math.floor(i / 7) * (MH + MG), w: MW, h: MH});
const TW = 240, TH = 160, GAP = 16, TOP = 400; // muro final 4 x 7
const muro = (i: number) => ({x: 540 - (4 * TW + 3 * GAP) / 2 + (i % 4) * (TW + GAP), y: TOP + Math.floor(i / 4) * (TH + GAP), w: TW, h: TH});
const FRASES = ['Los que creyeron en el talento amazonense', 'Los que apostaron por Amazonas', 'Los que construyen, desde ya, su futuro', '28 marcas que ya son parte de esta historia'];
const Logos: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / 30 + E.logos[0];
	const kM = f - S(T.muro - E.logos[0]);
	const kG = f - S(T.gracias - E.logos[0]);
	const eM = kM >= 0 ? spring({frame: kM, fps: 30, config: {damping: 15, stiffness: 110}}) : 0;
	const actual = Math.max(0, Math.min(N - 1, Math.floor((t - T.logos[0]) / T.por_logo)));
	const P = Math.round(T.por_logo * 30);
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="log" n={24} />
			{kM < 0 && (
				<>
					<AbsoluteFill style={{alignItems: 'center', top: 96}}>
						<Txt size={36} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 8, opacity: entra(f, 2, 5)}}>ESTO ES POSIBLE GRACIAS A</Txt>
					</AbsoluteFill>
					{/* marco del logo destacado */}
					<div style={{position: 'absolute', left: GCX - GW / 2 - 14, top: GCY - GH / 2 - 14, width: GW + 28, height: GH + 28, borderRadius: 44, border: `3px solid ${C.oro}55`, opacity: entra(f, 8, 6)}} />
					{/* frases de la voz */}
					{FRASES.map((x, i) => {
						const a = f - S(T.frases[i] - E.logos[0]), b = f - S(T.frases_fin[i] - E.logos[0]);
						if (a < 0 || b > 8) return null;
						return (
							<AbsoluteFill key={i} style={{alignItems: 'center', top: 1010, padding: '0 70px', opacity: Math.min(entra(a, 0, 4), interpolate(b, [0, 8], [1, 0], clamp)), transform: `translateY(${sube(a, 0, 30)}px)`}}>
								<Txt size={64} style={{lineHeight: 1.12}}>{x.toUpperCase()}</Txt>
							</AbsoluteFill>
						);
					})}
					<div style={{position: 'absolute', left: 60, top: 1300, display: 'flex', alignItems: 'baseline', gap: 10, opacity: entra(f, 12, 5)}}>
						<span style={{fontFamily: F.titulo, fontSize: 74, lineHeight: 1, color: C.oro}}>{String(Math.min(N, t >= T.logos[0] ? actual + 1 : 0)).padStart(2, '0')}</span>
						<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 26, color: C.blanco, letterSpacing: 4}}>/ {N} PATROCINADORES OFICIALES</span>
					</div>
				</>
			)}
			{kM >= 0 && (
				<AbsoluteFill style={{alignItems: 'center', top: 110}}>
					<Txt size={34} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 8, opacity: entra(kM, 4, 5)}}>A CADA UNA</Txt>
					<Txt size={200} color={C.oro} style={{opacity: entra(kG, 0, 2), transform: `scale(${golpe(kG, 0, 2.4)})`, textShadow: `0 0 70px ${C.oro}99, ${sombra}`, lineHeight: 1}}>¡GRACIAS!</Txt>
				</AbsoluteFill>
			)}
			{LOGOS.map((l, i) => {
				const k = Math.round((t - T.logos[i]) * 30);
				if (k < 0) return null;
				const m = mini(i), w = muro(i);
				const tipo = i % 4; // cuatro entradas distintas
				const e = interpolate(k, [0, 7], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.5))});
				const sale = interpolate(k, [P - 7, P], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}); // vuelo al mosaico
				const enGrande = sale < 1;
				// destino: mosaico pequeño y, al final, el muro
				const dx = lerp(m.x, w.x, eM), dy = lerp(m.y, w.y, eM), dw = lerp(m.w, w.w, eM), dh = lerp(m.h, w.h, eM);
				const W = lerp(GW * (tipo === 0 ? lerp(0.25, 1, e) : 1), dw, sale), H = lerp(GH * (tipo === 0 ? lerp(0.25, 1, e) : 1), dh, sale);
				const ex = tipo === 1 ? -1100 * (1 - e) : tipo === 2 ? 1100 * (1 - e) : 0, ey = tipo === 3 ? -900 * (1 - e) : 0;
				const cx = lerp(GCX + ex, dx + dw / 2, sale), cy = lerp(GCY + ey, dy + dh / 2, sale);
				const late = enGrande ? 1 + 0.02 * Math.sin(Math.min(1, k / P) * Math.PI) : 1;
				const ola = kM >= 0 ? Math.exp(-(((kM - 10 - ((i % 4) + Math.floor(i / 4)) * 1.6) / 3.2) ** 2)) : 0;
				const brillo = interpolate(k, [3, 14], [-1.3, 1.3], clamp);
				return (
					<div key={l} style={{position: 'absolute', left: cx - W / 2, top: cy - H / 2, width: W, height: H, borderRadius: lerp(34, lerp(10, 18, eM), sale), overflow: 'hidden', transform: `scale(${late * (1 + 0.13 * ola)}) rotate(${tipo === 0 ? (1 - e) * -8 : 0}deg)`, zIndex: enGrande ? 10 : ola > 0.2 ? 5 : 1, boxShadow: enGrande ? `0 0 0 6px ${C.oro}, 0 0 90px ${C.oro}77, 0 30px 60px rgba(0,0,0,0.55)` : `0 0 0 ${2 + 3 * ola}px rgba(${ola > 0.1 ? '242,194,48' : '255,255,255'},${0.18 + 0.82 * ola}), 0 0 ${50 * ola}px ${C.oro}, 0 6px 16px rgba(0,0,0,0.45)`, filter: ola > 0.05 ? `brightness(${1 + 0.5 * ola})` : undefined}}>
						<Img src={staticFile(`patroHD/${l}.webp`)} style={{width: '100%', height: '100%', display: 'block'}} />
						{enGrande && k < 15 && <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.7) 50%, transparent 62%)', transform: `translateX(${brillo * 100}%)`}} />}
					</div>
				);
			})}
			{kM >= 0 && (
				<AbsoluteFill style={{alignItems: 'center', top: 1660}}>
					<Txt size={50} font={F.texto} peso={900} style={{letterSpacing: 6, opacity: entra(kM, 14, 6)}}>{N} MARCAS · <span style={{color: C.oro}}>UNA CUMBRE</span></Txt>
				</AbsoluteFill>
			)}
			{T.logos.map((s, i) => <Destello key={i} en={S(s - E.logos[0])} dur={5} max={0.16} color={C.oro} />)}
			<Destello en={S(T.muro - E.logos[0])} dur={10} max={0.7} color="#FFF6D8" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 5. ENTRADAS
const Cta: React.FC = () => {
	const f = useCurrentFrame();
	const r = (s: number) => f - S(s - E.cta[0]);
	const kV = r(T.venta), kA = r(T.asegura), kD = r(T.vive), kC = r(T.contacto);
	const fin = interpolate(f, [S(E.cta[1] - E.cta[0]) - 12, S(E.cta[1] - E.cta[0])], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="cta" n={30} />
			<AbsoluteFill style={{alignItems: 'center', top: 150, gap: 4}}>
				<Txt size={66} font={F.texto} peso={900} style={{opacity: entra(f, 4, 4)}}>LAS ENTRADAS</Txt>
				<Txt size={160} color={C.oro} style={{opacity: entra(kV, -8, 3), transform: `scale(${golpe(kV, -8, 2)})`, textShadow: `0 0 60px ${C.oro}99, ${sombra}`, lineHeight: 1}}>YA ESTÁN<br />A LA VENTA</Txt>
				<div style={{marginTop: 40, opacity: entra(kA, 0, 3), transform: `scale(${golpe(kA, 0, 1.8) * (1 + 0.025 * Math.sin(f * 0.4))})`}}><Pildora size={64} fondo={C.blanco} color={C.marino}>ASEGURA LA TUYA</Pildora></div>
				<div style={{marginTop: 60, opacity: entra(kD, 0, 4), transform: `scale(${golpe(kD, 0, 1.5)})`}}>
					<Txt size={50} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 6}}>VIVE ESTE</Txt>
					<Txt size={110}><span style={{color: '#AEB6C4'}}>ANTES</span> Y <span style={{color: C.oro}}>DESPUÉS</span></Txt>
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 1130, gap: 16}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 34, opacity: entra(kC, 0, 5), transform: `translateY(${sube(kC, 0, 50)}px)`}}>
					<Img src={staticFile('img/qr.png')} style={{width: 290, height: 290, background: '#fff', borderRadius: 24, padding: 16}} />
					<div style={{display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 14, background: '#25D366', borderRadius: 80, padding: '14px 32px', boxShadow: '0 0 40px #25D36688'}}>
							<svg viewBox="0 0 32 32" width={50} height={50}><path fill="#fff" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.2.6 4.4 1.7 6.3L3 29l7.3-1.9c1.8 1 3.8 1.5 5.8 1.5 7 0 12.7-5.7 12.7-12.6C28.7 8.6 23 3 16 3zm0 23.2c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-4.3 1.1 1.2-4.2-.3-.4a10.4 10.4 0 0 1-1.6-5.5C5.3 9.8 10.1 5.1 16 5.1s10.6 4.7 10.6 10.5S21.9 26.2 16 26.2z" /></svg>
							<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 48, color: C.blanco}}>0426-761-7944</span>
						</div>
						<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 44, color: C.oro}}>cumbre.kubiav.com</span>
						<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 28, color: C.blanco, letterSpacing: 2}}>VIERNES 4 DIC · 2:00 PM<br />CLUB PARAPATA</span>
					</div>
				</div>
				<div style={{display: 'flex', gap: 28, marginTop: 44, opacity: entra(kC, 10, 6)}}>
					{(['LIDERA', 'VENDE', 'CRECE'] as const).map((w, i) => <Txt key={w} size={104} color={[C.blanco, C.celeste, C.oro][i]} style={{transform: `scale(${golpe(kC, 10 + i * 5, 1.6)})`, opacity: entra(kC, 10 + i * 5, 3)}}>{w}</Txt>)}
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{background: '#000', opacity: fin}} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- montaje
const ESCENAS: [readonly [number, number], React.FC][] = [[E.gancho, Gancho], [E.ponentes, Ponentes], [E.titulo, Titulo], [E.valor, Valor], [E.logos, Logos], [E.cta, Cta]];
const SIN_GOLPE = new Set([0, 2]); // el gancho abre el video y el título entra desde el apagón: sin acercamiento
const Corte: React.FC<{children: React.ReactNode; dur: number; plano: boolean; sinSalida?: boolean}> = ({children, dur, plano, sinSalida}) => {
	const f = useCurrentFrame();
	const e = plano ? 1 : interpolate(f, [0, 7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const sale = sinSalida ? 0 : interpolate(f, [dur - 3, dur], [0, 1], clamp);
	return (
		<AbsoluteFill style={{transform: `scale(${1.22 - 0.22 * e + sale * 0.1})`, filter: e < 1 || sale > 0 ? `blur(${(1 - e) * 16 + sale * 10}px)` : undefined}}>
			{children}
			{!plano && <Destello en={0} dur={5} max={0.3} color="#CFEAFF" />}
		</AbsoluteFill>
	);
};
const Pulso: React.FC<{children: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	const t = f / 30 - T.D;
	const fase = t >= 0 ? (t % 0.5) / 0.5 : 1;
	return <AbsoluteFill style={{transform: `scale(${1 + 0.01 * Math.exp(-fase * 5)})`}}>{children}</AbsoluteFill>;
};

export const Gracias2: React.FC<{conAudio?: boolean}> = ({conAudio = true}) => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.marino}}>
			{conAudio && <Audio src={staticFile('audio/mezcla-gracias2.wav')} />}
			<Pulso>
				{ESCENAS.map(([[a, b], Comp], i) => (
					<Sequence key={i} from={S(a)} durationInFrames={S(b) - S(a)}><Corte dur={S(b) - S(a)} plano={SIN_GOLPE.has(i)} sinSalida={i === 1 || i === 5}><Comp /></Corte></Sequence>
				))}
			</Pulso>
		</AbsoluteFill>
	);
};
