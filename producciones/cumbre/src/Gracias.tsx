import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {Brillos, C, Destello, F, FondoMarca, Pildora, S, clamp, entra, golpe, sombra, sube, useFuentes} from './comun';
import T from './tiemposG.json';

// Video de agradecimiento a los patrocinadores, "El muro" (39,5 s): los logos llenan un muro uno por uno, queda un
// solo espacio vacío ("TU MARCA") y se cierra la lista. Tiempos: tiemposG.json (gen_tiempos_gracias.py), que también
// usa la mezcla (mezcla_gracias.py). Cortes al pulso de la música (120 BPM).
export const DURACION_GRACIAS = T.DUR;
const E = T.E as unknown as Record<'gancho' | 'muro' | 'valor' | 'espacio' | 'cierre', readonly [number, number]>;
const ATRIBUCION = 'Imágenes: Sentinel-2 cloudless — s2maps.eu, EOX IT Services GmbH (contiene datos modificados de Copernicus Sentinel 2016), CC BY 4.0';
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Txt: React.FC<{children: React.ReactNode; size: number; font?: string; color?: string; peso?: number; style?: React.CSSProperties}> = ({children, size, font = F.titulo, color = C.blanco, peso, style}) => (
	<div style={{fontFamily: font, fontWeight: peso, fontSize: size, lineHeight: 1.08, color, textAlign: 'center', textShadow: sombra, ...style}}>{children}</div>
);

// ---------------------------------------------------------------- el muro: 26 marcas + 1 espacio
const LOGOS = ['ferreconi', 'parapata', 'perfumes', 'navas', 'mas-network', 'galaxia', 'tecnoama', 'jesus-nazareth', 'amavision', 'marco', 'puerto-venado', 'shamanika', 'multiempresariales-2', 'orthosmile', 'wahari', 'condimentos', 'delicias', 'moto-daniel', 'shabono', 'milsi', 'divino-nino', 'broaster', 'kubia', 'farma', 'jac', 'casita'];
const TW = 240, TH = 160, GAP = 16, TOP = 330, COLS = 4;
const X0 = 540 - (COLS * TW + (COLS - 1) * GAP) / 2;
const Y_ULT = TOP + 6 * (TH + GAP);
const X_ULT = (p: number) => 540 - (3 * TW + 2 * GAP) / 2 + p * (TW + GAP);
// las 24 primeras llenan 6 filas; la última fila va centrada: marca · ESPACIO · marca
const slot = (i: number) => (i < 24 ? {x: X0 + (i % COLS) * (TW + GAP), y: TOP + Math.floor(i / COLS) * (TH + GAP)} : {x: X_ULT(i === 24 ? 0 : 2), y: Y_ULT});
const VACIO = {x: X_ULT(1), y: Y_ULT};
const sombraTile = '0 0 0 2px rgba(255,255,255,0.15), 0 10px 26px rgba(0,0,0,0.45)';

const Espacio: React.FC<{brillo: number; texto?: boolean}> = ({brillo, texto = true}) => (
	<div style={{position: 'absolute', left: VACIO.x, top: VACIO.y, width: TW, height: TH, borderRadius: 18, border: `4px dashed ${C.oro}`, opacity: 0.25 + 0.75 * brillo, boxShadow: `0 0 ${60 * brillo}px ${C.oro}, inset 0 0 ${40 * brillo}px ${C.oro}55`, background: `rgba(242,194,48,${0.14 * brillo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
		{texto && <><span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 20, letterSpacing: 4, color: C.blanco, opacity: brillo}}>AQUÍ VA</span><span style={{fontFamily: F.titulo, fontSize: 50, color: C.oro, lineHeight: 1, opacity: brillo}}>TU MARCA</span></>}
	</div>
);
const MuroFijo: React.FC<{o?: number; filtro?: string}> = ({o = 1, filtro}) => (
	<AbsoluteFill style={{opacity: o, filter: filtro}}>
		{LOGOS.map((l, i) => { const s = slot(i); return <Img key={l} src={staticFile(`patro/${l}.webp`)} style={{position: 'absolute', left: s.x, top: s.y, width: TW, height: TH, borderRadius: 18, boxShadow: sombraTile}} />; })}
	</AbsoluteFill>
);

// ---------------------------------------------------------------- 0. GANCHO
const Gancho: React.FC = () => {
	const f = useCurrentFrame();
	const k = f - S(T.V['01']);
	const sube2 = interpolate(f, [0, S(T.D)], [1, 1.12]);
	return (
		<AbsoluteFill style={{background: '#020814'}}>
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${C.azul}66 0%, transparent ${interpolate(f, [0, S(T.D)], [10, 70])}%)`}} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 0, transform: `scale(${sube2})`}}>
				<Txt size={150} style={{opacity: entra(k, 0, 2), transform: `scale(${golpe(k, 0, 2.4)})`}}>ELLOS</Txt>
				<Txt size={150} style={{opacity: entra(k, 12, 2), transform: `scale(${golpe(k, 12, 2.4)})`}}>YA LO</Txt>
				<Txt size={176} color={C.oro} style={{opacity: entra(k, 20, 2), transform: `scale(${golpe(k, 20, 2.6)})`, textShadow: `0 0 60px ${C.oro}99, ${sombra}`}}>DECIDIERON</Txt>
			</AbsoluteFill>
			<Destello en={S(T.V['01'] + 0.7)} dur={6} max={0.4} color="#FFF6D8" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 1. EL MURO SE LLENA
const Muro: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / 30 + E.muro[0];
	const kC = f - S(T.completo - E.muro[0]); // muro completo
	const kR = f - S(T.realidad - E.muro[0]);
	const cuenta = Math.min(LOGOS.length, T.logos.filter((x) => x <= t).length);
	const atras = kC >= 0 ? interpolate(spring({frame: kC, fps: 30, config: {damping: 14, stiffness: 120}}), [0, 1], [1.07, 1]) : 1;
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="mur" n={20} />
			{kC < 0 && (
				<>
					<div style={{position: 'absolute', left: 60, top: 150, opacity: entra(f, 0, 5)}}>
						<Txt size={34} font={F.texto} peso={900} color={C.oro} style={{letterSpacing: 7, textAlign: 'left'}}>PATROCINADORES<br />OFICIALES</Txt>
					</div>
					<div style={{position: 'absolute', right: 60, top: 96, display: 'flex', alignItems: 'baseline', gap: 10}}>
						<span style={{fontFamily: F.titulo, fontSize: 170, lineHeight: 1, color: C.blanco, textShadow: `0 0 40px ${C.celeste}88`, transform: `scale(${1 + 0.12 * Math.exp(-((t - (T.logos[cuenta - 1] ?? 0)) * 14))})`, display: 'inline-block'}}>{String(cuenta).padStart(2, '0')}</span>
						<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 30, color: C.celeste, letterSpacing: 4}}>MARCAS</span>
					</div>
				</>
			)}
			{kC >= 0 && (
				<AbsoluteFill style={{alignItems: 'center', top: 96}}>
					<Txt size={190} color={C.oro} style={{opacity: entra(kC, 0, 2), transform: `scale(${golpe(kC, 0, 2.2)})`, textShadow: `0 0 70px ${C.oro}99, ${sombra}`, lineHeight: 1}}>¡GRACIAS!</Txt>
				</AbsoluteFill>
			)}
			<AbsoluteFill style={{transform: `scale(${atras})`, transformOrigin: '50% 50%'}}>
				<Espacio brillo={0} texto={false} />
				{LOGOS.map((l, i) => {
					const k = Math.round((t - T.logos[i]) * 30);
					if (k < 0) return null;
					const s = slot(i);
					const vuelo = interpolate(k, [5, 11], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
					const tipo = i % 3; // tres entradas distintas: golpe, giro y barrido lateral
					const e = interpolate(k, [0, 5], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.8))});
					const W = lerp(640, TW, vuelo) * (vuelo < 1 ? (tipo === 0 ? lerp(0.3, 1, e) : 1) : 1), H = W * 2 / 3;
					const cx = lerp(540 + (tipo === 2 ? (i % 2 ? 1 : -1) * 700 * (1 - e) : 0), s.x + TW / 2, vuelo), cy = lerp(1010, s.y + TH / 2, vuelo);
					const giro = tipo === 1 ? (1 - e) * (i % 2 ? 26 : -26) * (1 - vuelo) : 0;
					// ola dorada al completarse el muro, en diagonal
					const ola = kC >= 0 ? Math.exp(-(((kC - 3 - ((i % COLS) + Math.floor(i / COLS)) * 1.6) / 3.2) ** 2)) : 0;
					const late = kC >= 22 ? 0.03 * Math.exp(-(((kC - 22) % 15) / 15) * 5) : 0;
					const brillo = interpolate(k, [0, 6], [-1.2, 1.2], clamp);
					return (
						<div key={l} style={{position: 'absolute', left: cx - W / 2, top: cy - H / 2, width: W, height: H, borderRadius: 18 + 16 * (1 - vuelo), overflow: 'hidden', transform: `rotate(${giro}deg) scale(${1 + 0.13 * ola + late})`, boxShadow: vuelo < 1 ? `0 0 0 ${2 + 4 * (1 - vuelo)}px ${C.oro}, 0 ${10 + 20 * (1 - vuelo)}px ${26 + 30 * (1 - vuelo)}px rgba(0,0,0,0.5)` : `0 0 0 ${2 + 3 * ola}px rgba(${ola > 0.1 ? '242,194,48' : '255,255,255'},${0.15 + 0.85 * ola}), 0 0 ${50 * ola}px ${C.oro}, 0 10px 26px rgba(0,0,0,0.45)`, zIndex: vuelo < 1 ? 10 : ola > 0.2 ? 5 : 1, filter: ola > 0.05 ? `brightness(${1 + 0.5 * ola})` : undefined}}>
							<Img src={staticFile(`patro/${l}.webp`)} style={{width: '100%', height: '100%', display: 'block'}} />
							{k < 7 && <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.7) 50%, transparent 62%)', transform: `translateX(${brillo * 100}%)`}} />}
						</div>
					);
				})}
			</AbsoluteFill>
			{kC >= 0 && (
				<AbsoluteFill style={{alignItems: 'center', top: 1590, gap: 6}}>
					<Txt size={44} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 7, opacity: entra(kC, 8, 5)}}>{LOGOS.length} MARCAS · UNA CUMBRE</Txt>
					<Txt size={92} style={{opacity: entra(kR, 0, 3), transform: `scale(${golpe(kR, 0, 1.6)})`}}>ES UNA <span style={{color: C.oro}}>REALIDAD</span></Txt>
				</AbsoluteFill>
			)}
			{T.logos.map((s, i) => <Destello key={i} en={S(s - E.muro[0])} dur={4} max={0.1} color={C.oro} />)}
			<Destello en={S(T.completo - E.muro[0])} dur={10} max={0.7} color="#FFF6D8" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 2. EL VALOR DE ESE DÍA
const PONENTES = [['jose', 0], ['daniela', 1], ['juan', 3], ['tania', 4]] as const; // aparecen con: liderar, vender, números, marca
const Valor: React.FC = () => {
	const f = useCurrentFrame();
	const r = (s: number) => f - S(s - E.valor[0]);
	const kT = r(T.tarde);
	const pilares: [string, string, number, string][] = [['LIDERA', 'tu equipo', T.pilares[0], C.azul], ['VENDE', 'más y mejor', T.pilares[1], C.celeste], ['CRECE', 'con tus números en orden y tu marca bien posicionada', T.pilares[2], C.oro]];
	const tiempos = [T.pilares[0], T.pilares[1], 0, T.numeros, T.marca];
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="val" n={22} />
			<AbsoluteFill style={{alignItems: 'center', top: 130, gap: 18}}>
				<div style={{display: 'flex', gap: 14, opacity: entra(f, 2, 5), transform: `translateY(${sube(f, 2, 30)}px)`}}>
					<Pildora size={36}>VIERNES 4 DE DICIEMBRE</Pildora>
					<Pildora size={36} fondo={C.azul} color={C.blanco}>2:00 PM</Pildora>
				</div>
				<Txt size={30} font={F.texto} peso={800} color={C.celeste} style={{letterSpacing: 7, opacity: entra(f, 6, 5)}}>CLUB PARAPATA · PUERTO AYACUCHO</Txt>
				<div style={{marginTop: 26, opacity: entra(kT, 0, 3), transform: `scale(${golpe(kT, 0, 1.5)})`}}>
					<Txt size={58} font={F.texto} peso={900}>UNA TARDE QUE</Txt>
					<Txt size={104} color={C.oro} style={{textShadow: `0 0 50px ${C.oro}88, ${sombra}`}}>CAMBIA TU NEGOCIO</Txt>
				</div>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 70, right: 70, top: 640, display: 'flex', flexDirection: 'column', gap: 26}}>
				{pilares.map(([w, sub, s, col], i) => {
					const k = r(s);
					if (k < 0) return null;
					const x = interpolate(k, [0, 9], [i % 2 ? 500 : -500, 0], {...clamp, easing: Easing.out(Easing.cubic)});
					return (
						<div key={w} style={{display: 'flex', alignItems: 'center', gap: 26, transform: `translateX(${x}px)`, opacity: entra(k, 0, 3)}}>
							<div style={{width: 16, alignSelf: 'stretch', borderRadius: 8, background: col, boxShadow: `0 0 30px ${col}`}} />
							<div style={{fontFamily: F.titulo, fontSize: 150, lineHeight: 1, color: col === C.oro ? C.oro : C.blanco, textShadow: sombra, transform: `scale(${golpe(k, 0, 1.5)})`, transformOrigin: 'left center'}}>{w}</div>
							<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: sub.length > 20 ? 30 : 44, lineHeight: 1.2, color: C.blanco, opacity: entra(k, 8, 5), flex: 1}}>{sub}</div>
						</div>
					);
				})}
			</div>
			{/* los cuatro especialistas, con el mismo peso */}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 560, display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
				{PONENTES.map(([n, idx], i) => {
					const k = r(tiempos[idx]);
					const y = interpolate(spring({frame: k, fps: 30, config: {damping: 13, stiffness: 150}}), [0, 1], [600, 0]);
					return <Img key={n} src={staticFile(`img/${n}-recorte.png`)} style={{height: 520, marginLeft: i ? -70 : 0, transform: `translateY(${y}px)`, filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.6))'}} />;
				})}
			</div>
			<AbsoluteFill style={{background: `linear-gradient(180deg, transparent 88%, ${C.marino} 100%)`}} />
			{T.pilares.map((s, i) => <Destello key={i} en={S(s - E.valor[0])} dur={6} max={0.3} color={C.celeste} />)}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 3. QUEDA UN ESPACIO · ÚLTIMAS HORAS
const Queda: React.FC = () => {
	const f = useCurrentFrame();
	const r = (s: number) => f - S(s - E.espacio[0]);
	const kQ = r(T.queda), kH = r(T.hoy), kU = r(T.horas), kO = r(T.oportunidad);
	const acerca = interpolate(f, [0, S(T.horas - E.espacio[0])], [1, 1.28], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const fase2 = kU >= 0;
	const lat = fase2 ? 0.55 + 0.45 * Math.abs(Math.sin(f * 0.42)) : 0.6 + 0.4 * Math.abs(Math.sin(f * 0.16)); // el espacio late; en la fase 2, más rápido
	return (
		<AbsoluteFill>
			<FondoMarca />
			<AbsoluteFill style={{transform: `scale(${acerca * (fase2 ? interpolate(kU, [0, 8], [1.12, 1], clamp) : 1)})`, transformOrigin: `${VACIO.x + TW / 2}px ${VACIO.y + TH / 2}px`}}>
				<MuroFijo o={interpolate(f, [0, 14], [1, 0.3], clamp)} filtro={`grayscale(${interpolate(f, [0, 14], [0, 0.85], clamp)}) blur(${interpolate(f, [0, 14], [0, 2.5], clamp)}px)`} />
				<Espacio brillo={interpolate(f, [4, 14], [0, 1], clamp) * lat} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(7,26,74,0.92) 0%, rgba(7,26,74,0.55) 38%, transparent 62%)`}} />
			{!fase2 && (
				<AbsoluteFill style={{alignItems: 'center', top: 170, gap: 4}}>
					<Txt size={62} font={F.texto} peso={900} style={{opacity: entra(f, 6, 5)}}>EN ESTE MURO</Txt>
					<Txt size={128} color={C.oro} style={{opacity: entra(kQ, 0, 3), transform: `scale(${golpe(kQ, 0, 1.7)})`, textShadow: `0 0 50px ${C.oro}88, ${sombra}`}}>QUEDA UN ESPACIO</Txt>
					<div style={{marginTop: 50, opacity: entra(kH, 0, 2), transform: `scale(${golpe(kH, 0, 2)})`}}>
						<Txt size={54} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 8}}>HOY</Txt>
						<Txt size={110}>CERRAMOS LA LISTA</Txt>
					</div>
				</AbsoluteFill>
			)}
			{fase2 && (
				<AbsoluteFill style={{alignItems: 'center', top: 150, gap: 6}}>
					<div style={{opacity: entra(kU, 0, 3), transform: `scale(${golpe(kU, 0, 1.6)})`, marginBottom: 14}}><Pildora size={38} fondo={C.blanco} color={C.marino}>ÚLTIMOS PATROCINIOS</Pildora></div>
					<Txt size={210} color={C.oro} style={{opacity: entra(kU, 0, 2), transform: `scale(${golpe(kU, 0, 2.4) * (1 + 0.02 * Math.sin(f * 0.42))})`, textShadow: `0 0 70px ${C.oro}AA, ${sombra}`, lineHeight: 0.95}}>ÚLTIMAS<br />HORAS</Txt>
					<Txt size={46} font={F.texto} peso={800} style={{marginTop: 26, opacity: entra(kU, 14, 5), padding: '0 70px'}}>para cerrar</Txt>
					<Txt size={76} style={{opacity: entra(kO, 0, 3), transform: `scale(${golpe(kO, 0, 1.5)})`, padding: '0 50px'}}>LA OPORTUNIDAD QUE <span style={{color: C.oro}}>TU NEGOCIO</span> NECESITA</Txt>
				</AbsoluteFill>
			)}
			<Destello en={S(T.horas - E.espacio[0])} dur={10} max={0.75} color="#FFF6D8" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 4. CIERRE: Amazonas en el mapa
const cuadroSat = (i: number) => staticFile(`sat59/${String(Math.max(0, Math.min(599, Math.round(i))) + 1).padStart(4, '0')}.jpg`);
const PIN = {x: 448, y: 1008}; // Puerto Ayacucho en el cuadro 100
const Cierre: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / 30;
	const r = (s: number) => f - S(s - E.cierre[0]);
	const kM = r(T.mapa), kY = r(T.ytu), kC = r(T.contacto);
	const fuente = (x: number) => lerp(8, 100, Easing.out(Easing.cubic)(Math.min(1, x / 1.0)));
	const fin = interpolate(f, [S(E.cierre[1] - E.cierre[0]) - 12, S(E.cierre[1] - E.cierre[0])], [0, 1], clamp);
	const baja = kY >= 0 ? interpolate(kY, [0, 12], [0, 1], clamp) : 0;
	return (
		<AbsoluteFill style={{background: '#01040D'}}>
			<AbsoluteFill style={{transform: `scale(${interpolate(f, [30, 195], [1, 1.1], clamp)})`, filter: `brightness(${1 - 0.45 * baja}) blur(${3 * baja}px)`}}>
				{[0, 1, 2, 3, 4, 5].map((j) => <Img key={j} src={cuadroSat(fuente(t + j / 180))} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 1 / (j + 1)}} />)}
				{kM >= 0 && (
					<>
						{[0, 6].map((d) => { const q = kM - d; return q >= 0 ? <div key={d} style={{position: 'absolute', left: PIN.x - q * 22, top: PIN.y - q * 22, width: q * 44, height: q * 44, borderRadius: '50%', border: `${Math.max(1, 9 - q * 0.4)}px solid ${C.oro}`, opacity: interpolate(q, [0, 24], [0.9, 0], clamp)}} /> : null; })}
						<svg width={120} height={160} viewBox="0 0 24 32" style={{position: 'absolute', left: PIN.x - 60, top: PIN.y - 160, transform: `translateY(${interpolate(spring({frame: kM, fps: 30, config: {damping: 9, stiffness: 220, mass: 0.6}}), [0, 1], [-900, 0])}px)`, filter: `drop-shadow(0 0 30px ${C.oro})`}}>
							<path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 32 12 32s12-11.2 12-20.1C24 5.3 18.6 0 12 0zm0 16.5a4.6 4.6 0 1 1 0-9.2 4.6 4.6 0 0 1 0 9.2z" fill={C.oro} stroke="#fff" strokeWidth={0.6} />
						</svg>
					</>
				)}
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(1,4,13,0.85) 0%, transparent 34%, transparent 58%, rgba(1,4,13,0.92) 100%)'}} />
			<AbsoluteFill style={{alignItems: 'center', top: 130, gap: 2, opacity: 1 - 0.0 * baja}}>
				<Txt size={170} style={{opacity: entra(f, 4, 3), transform: `scale(${golpe(f, 4, 1.8)})`, lineHeight: 1}}>AMAZONAS</Txt>
				<Txt size={52} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 6, opacity: entra(f, 18, 5)}}>VUELVE A ESTAR</Txt>
				<Txt size={150} color={C.oro} style={{opacity: entra(kM, 0, 2), transform: `scale(${golpe(kM, 0, 2.2)})`, textShadow: `0 0 60px ${C.oro}99, ${sombra}`, lineHeight: 1}}>EN EL MAPA</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 1080, gap: 14}}>
				<Txt size={150} style={{opacity: entra(kY, 4, 2), transform: `scale(${golpe(kY, 4, 2)})`, lineHeight: 1}}>¿Y <span style={{color: C.oro}}>TU MARCA</span>?</Txt>
				<div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#25D366', borderRadius: 80, padding: '16px 40px', marginTop: 22, opacity: entra(kC, 0, 4), transform: `scale(${golpe(kC, 0, 1.5)})`, boxShadow: '0 0 50px #25D36688'}}>
					<svg viewBox="0 0 32 32" width={62} height={62}><path fill="#fff" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.2.6 4.4 1.7 6.3L3 29l7.3-1.9c1.8 1 3.8 1.5 5.8 1.5 7 0 12.7-5.7 12.7-12.6C28.7 8.6 23 3 16 3zm0 23.2c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-4.3 1.1 1.2-4.2-.3-.4a10.4 10.4 0 0 1-1.6-5.5C5.3 9.8 10.1 5.1 16 5.1s10.6 4.7 10.6 10.5S21.9 26.2 16 26.2z" /></svg>
					<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 60, color: C.blanco}}>0426-761-7944</span>
				</div>
				<Txt size={50} font={F.texto} peso={900} color={C.oro} style={{opacity: entra(kC, 6, 5)}}>cumbre.kubiav.com</Txt>
				<div style={{display: 'flex', gap: 28, marginTop: 26}}>
					{(['LIDERA', 'VENDE', 'CRECE'] as const).map((w, i) => { const k = r(T.lemas[i]); return <Txt key={w} size={104} color={[C.blanco, C.celeste, C.oro][i]} style={{opacity: entra(k, 0, 3), transform: `scale(${golpe(k, 0, 1.8)})`}}>{w}</Txt>; })}
				</div>
				<Txt size={28} font={F.texto} peso={800} color={C.celeste} style={{letterSpacing: 5, opacity: entra(r(T.lemas[2]), 6, 6)}}>CUMBRE DE TRANSFORMACIÓN EMPRESARIAL · AMAZONAS 2026</Txt>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 40, right: 40, bottom: 26, fontFamily: F.texto, fontWeight: 500, fontSize: 14, textAlign: 'center', color: 'rgba(255,255,255,0.6)'}}>{ATRIBUCION}</div>
			<Destello en={S(T.mapa - E.cierre[0])} dur={8} max={0.6} color="#FFF6D8" />
			<AbsoluteFill style={{background: '#000', opacity: fin}} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- montaje
const ESCENAS: [readonly [number, number], React.FC][] = [[E.gancho, Gancho], [E.muro, Muro], [E.valor, Valor], [E.espacio, Queda], [E.cierre, Cierre]];
const Corte: React.FC<{children: React.ReactNode; dur: number; primero?: boolean}> = ({children, dur, primero}) => {
	const f = useCurrentFrame();
	const e = primero ? 1 : interpolate(f, [0, 7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const sale = interpolate(f, [dur - 3, dur], [0, 1], clamp);
	return (
		<AbsoluteFill style={{transform: `scale(${1.22 - 0.22 * e + sale * 0.1})`, filter: e < 1 || sale > 0 ? `blur(${(1 - e) * 16 + sale * 10}px)` : undefined}}>
			{children}
			{!primero && <Destello en={0} dur={5} max={0.3} color="#CFEAFF" />}
		</AbsoluteFill>
	);
};
const Pulso: React.FC<{children: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	const t = f / 30 - T.D;
	const quieto = f / 30 > E.espacio[0] && f / 30 < T.horas; // sin pulso mientras la música se apaga
	const fase = t >= 0 && !quieto ? (t % 0.5) / 0.5 : 1;
	return <AbsoluteFill style={{transform: `scale(${1 + 0.012 * Math.exp(-fase * 5)})`}}>{children}</AbsoluteFill>;
};

export const Gracias: React.FC<{conAudio?: boolean}> = ({conAudio = true}) => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.marino}}>
			{conAudio && <Audio src={staticFile('audio/mezcla-gracias.wav')} />}
			<Pulso>
				{ESCENAS.map(([[a, b], Comp], i) => (
					<Sequence key={i} from={S(a)} durationInFrames={S(b) - S(a)}><Corte dur={S(b) - S(a)} primero={i === 0}><Comp /></Corte></Sequence>
				))}
			</Pulso>
		</AbsoluteFill>
	);
};
