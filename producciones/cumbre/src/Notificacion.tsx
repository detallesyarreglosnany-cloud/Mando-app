import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {C, F, S, clamp, entra, golpe, sombra, sube, useFuentes} from './comun';
import T from './tiemposN.json';

// "Notificación" (71 s, sin música ni voz): el teléfono avisa, se desbloquea, la cumbre, los 4 ponentes (5 s cada uno),
// los 31 patrocinadores de dos en dos, la pared de logos en filas alternas y las entradas con el contacto en pantalla.
// Estilo limpio: empujes, máscaras y desenfoque de movimiento; sin brillos ni partículas. Tiempos: tiemposN.json.
export const DURACION_NOTIF = T.DUR;
const fps = 30;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const expo = Easing.out(Easing.exp);
const suave = Easing.inOut(Easing.cubic);
const Txt: React.FC<{children: React.ReactNode; size: number; font?: string; color?: string; peso?: number; style?: React.CSSProperties}> = ({children, size, font = F.titulo, color = C.blanco, peso, style}) => (
	<div style={{fontFamily: font, fontWeight: peso, fontSize: size, lineHeight: 1.06, color, textAlign: 'center', ...style}}>{children}</div>
);
const Oro: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: C.oro}}>{children}</span>;
const Fondo: React.FC<{color?: string}> = ({color = '#12358F'}) => (
	<AbsoluteFill style={{background: `radial-gradient(ellipse 90% 60% at 50% 42%, ${color} 0%, ${C.marino} 62%, #020920 100%)`}} />
);

// ---------------------------------------------------------------- 0–7 s: pantalla de bloqueo y notificación
const Ticket: React.FC<{s: number}> = ({s}) => (
	<svg viewBox="0 0 48 48" width={s} height={s}><path fill={C.marino} d="M6 14a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v5a5 5 0 0 0 0 10v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-5a5 5 0 0 0 0-10z" /><path stroke={C.oro} strokeWidth={2.4} strokeDasharray="3 3" d="M30 12v24" /></svg>
);
const Bloqueo: React.FC = () => {
	const f = useCurrentFrame();
	const kN = f - S(T.notif), kT = f - S(T.tap), kU = f - S(T.desbloqueo);
	const despierta = entra(f, S(T.vibra) + 4, 8);
	const baja = kN >= 0 ? spring({frame: kN, fps, config: {damping: 16, stiffness: 140}}) : 0;
	const vib = f >= S(T.vibra) && f < S(T.vibra) + 22 ? Math.sin(f * 2.6) * 7 * (1 - (f - S(T.vibra)) / 22) : 0;
	const abre = kT >= 0 ? interpolate(kT, [3, 15], [0, 1], {...clamp, easing: suave}) : 0;
	const top = lerp(lerp(-320, 700, baja), 520, abre), alto = lerp(250, 860, abre);
	const sube_ = kU >= 0 ? interpolate(kU, [0, 13], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)}) : 0;
	const r = (s: number) => f - S(s);
	return (
		<AbsoluteFill style={{transform: `translateY(${-1920 * sube_}px)`, filter: sube_ > 0 ? `blur(${10 * sube_}px)` : undefined}}>
			<AbsoluteFill style={{background: '#000'}} />
			<AbsoluteFill style={{opacity: despierta * 0.9}}><Fondo color="#0B2466" /></AbsoluteFill>
			{/* candado y "desliza" */}
			<AbsoluteFill style={{alignItems: 'center', top: 170, opacity: despierta}}>
				<svg viewBox="0 0 24 24" width={58} height={58}><path fill="none" stroke="#fff" strokeWidth={1.8} d="M7 11V8a5 5 0 0 1 10 0v3M5.5 11h13v10h-13z" /></svg>
				<Txt size={34} font={F.texto} peso={600} color="rgba(255,255,255,0.85)" style={{marginTop: 16, letterSpacing: 1}}>Cumbre de Transformación Empresarial</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 1760, opacity: entra(f, S(5.9), 8) * (0.6 + 0.4 * Math.sin(f / 5))}}>
				<div style={{width: 300, height: 10, borderRadius: 10, background: '#fff'}} />
			</AbsoluteFill>
			{/* tarjeta de notificación */}
			<div style={{position: 'absolute', left: 46, width: 988, top, height: alto, transform: `translateX(${vib}px) scale(${kT >= 0 && kT < 6 ? 1 - 0.025 * Math.sin((kT / 6) * Math.PI) : 1})`, borderRadius: 48, background: 'rgba(246,247,250,0.96)', boxShadow: '0 30px 80px rgba(0,0,0,0.55)', overflow: 'hidden'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '30px 34px 0'}}>
					<div style={{width: 92, height: 92, borderRadius: 22, background: `linear-gradient(140deg, #FFD95A, ${C.oro})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ticket s={64} /></div>
					<div style={{flex: 1, fontFamily: F.texto, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: '#5F6573'}}>CUMBRE AMAZONAS 2026</div>
					<div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 28, color: '#8A909C'}}>ahora</div>
				</div>
				<div style={{padding: '18px 38px 0', fontFamily: F.texto, fontWeight: 800, fontSize: 46, lineHeight: 1.15, color: '#0D1220'}}>¿Ya tienes tu entrada para este viernes?</div>
				{/* contenido al abrir */}
				<div style={{position: 'absolute', left: 0, right: 0, top: 270, opacity: abre, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
					<div style={{width: 860, height: 2, background: '#E1E4EA', marginBottom: 40}} />
					<Txt size={46} font={F.texto} peso={800} color="#3A4150" style={{opacity: entra(r(T.l[0]), 0, 5)}}>Más de</Txt>
					<Txt size={150} color={C.marino} style={{opacity: entra(r(T.l[0]), 0, 3), transform: `scale(${golpe(r(T.l[0]), 0, 1.5)})`, lineHeight: 1}}>31 EMPRESARIOS</Txt>
					<Txt size={46} font={F.texto} peso={700} color="#3A4150" style={{marginTop: 14, opacity: entra(r(T.l[1]), 0, 5), transform: `translateY(${sube(r(T.l[1]), 0, 30)}px)`}}>se van a encontrar<br />en un <b style={{color: C.azul}}>mismo lugar</b></Txt>
					<div style={{marginTop: 34, opacity: entra(r(T.l[2]), 0, 4), transform: `scale(${golpe(r(T.l[2]), 0, 1.4)})`, fontFamily: F.texto, fontWeight: 900, fontSize: 34, letterSpacing: 2, color: C.blanco, background: C.azul, borderRadius: 60, padding: '14px 32px'}}>4 DE DICIEMBRE · PUERTO AYACUCHO</div>
				</div>
				{/* toque */}
				{kT >= 0 && kT < 14 && <div style={{position: 'absolute', left: 494 - 60, top: 140 - 60, width: 120, height: 120, borderRadius: 120, background: 'rgba(30,79,216,0.25)', transform: `scale(${interpolate(kT, [0, 14], [0.3, 2.4])})`, opacity: interpolate(kT, [0, 14], [1, 0])}} />}
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 7–11 s: la cumbre
const Cumbre: React.FC = () => {
	const f = useCurrentFrame(); // 0 = T.desbloqueo
	const r = (s: number) => f - S(s - T.desbloqueo);
	const k = r(T.tarjeta);
	return (
		<AbsoluteFill>
			<Fondo />
			<AbsoluteFill style={{alignItems: 'center', top: 330, transform: `scale(${interpolate(f, [0, S(4.5)], [1.04, 1], clamp)})`}}>
				<Txt size={46} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 10, opacity: entra(k, 0, 6)}}>CUMBRE DE</Txt>
				<div style={{overflow: 'hidden', marginTop: 10}}><Txt size={136} style={{transform: `translateY(${interpolate(k, [2, 12], [100, 0], {...clamp, easing: expo})}%)`}}>TRANSFORMACIÓN</Txt></div>
				<div style={{overflow: 'hidden'}}><Txt size={136} style={{transform: `translateY(${interpolate(k, [5, 15], [100, 0], {...clamp, easing: expo})}%)`}}>EMPRESARIAL</Txt></div>
				<div style={{marginTop: 24, height: 6, width: interpolate(k, [10, 22], [0, 620], {...clamp, easing: expo}), background: C.oro, borderRadius: 6}} />
				<Txt size={92} color={C.oro} style={{marginTop: 22, letterSpacing: 6, opacity: entra(k, 14, 6)}}>AMAZONAS 2026</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'flex-start', top: 1200, flexDirection: 'row', justifyContent: 'center', gap: 30}}>
				{(['LIDERA', 'VENDE', 'CRECE'] as const).map((w, i) => {
					const kp = r(T.pilares[i]);
					return (
						<React.Fragment key={w}>
							{i > 0 && <div style={{width: 14, height: 14, marginTop: 56, borderRadius: 14, background: C.celeste, opacity: entra(kp, 0, 4)}} />}
							<div style={{overflow: 'hidden'}}><Txt size={110} color={[C.blanco, C.celeste, C.oro][i]} style={{transform: `translateY(${interpolate(kp, [0, 8], [100, 0], {...clamp, easing: expo})}%)`}}>{w}</Txt></div>
						</React.Fragment>
					);
				})}
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 1420}}>
				<Txt size={34} font={F.texto} peso={800} color="rgba(255,255,255,0.85)" style={{letterSpacing: 4, opacity: entra(r(T.pilares[2]), 6, 8)}}>VIERNES 4 DE DICIEMBRE · CLUB PARAPATA</Txt>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 11–31 s: los cuatro ponentes, 5 s cada uno
const PONENTES = [
	{nombre: 'JUAN ERNESTO SIERRA', area: 'FINANZAS Y TRIBUTOS', clave: 'TRIBUTOS', foto: 'img/juan-recorte.png', ancho: 1000, col: '#0E7C86',
		tema: <>Actualízate con las <Oro>nuevas modalidades tributarias</Oro>.</>},
	{nombre: 'JOSÉ RODRÍGUEZ', area: 'VENTAS', clave: 'VENTAS', foto: 'img/jose-recorte.png', ancho: 1196, col: C.azul,
		tema: <>El <Oro>cierre de venta estratégico</Oro> que tu negocio necesita. No más ventas perdidas.</>},
	{nombre: 'TANIA ALZURU', area: 'NEUROMARKETING Y MARCA', clave: 'MARCA', foto: 'img/tania-recorte.png', ancho: 900, col: '#C2571A',
		tema: <>Que tu cliente <Oro>te elija siempre</Oro>, sin bajar tu precio.</>},
	{nombre: 'DANIELA SILVA', area: 'SISTEMAS DIGITALES', clave: 'DIGITAL', foto: 'img/daniela-recorte.png', ancho: 1094, col: '#5B3FD6',
		tema: <>Reportes, inventario al día y <Oro>tu tienda vendiendo 24/7</Oro>, desde tu teléfono.</>},
];
const Ponente: React.FC<{i: number}> = ({i}) => {
	const f = useCurrentFrame(); // 0 = inicio de su bloque
	const p = PONENTES[i];
	const dur = S(T.por_ponente);
	const kC = f - S(3.6);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Fondo color={p.col} />
			{/* palabra clave gigante, en contorno, detrás */}
			<AbsoluteFill style={{top: 560, alignItems: 'center'}}>
				<div style={{fontFamily: F.titulo, fontSize: 380, lineHeight: 1, color: 'transparent', WebkitTextStroke: '3px rgba(255,255,255,0.13)', whiteSpace: 'nowrap', transform: `translateX(${interpolate(f, [0, dur + 10], [90, -90])}px)`}}>{p.clave}</div>
			</AbsoluteFill>
			{/* la persona, apoyada en el borde inferior: el corte de la foto queda fuera del cuadro */}
			<Img src={staticFile(p.foto)} style={{position: 'absolute', left: 540 - p.ancho / 2, top: 430, width: p.ancho, transformOrigin: '50% 30%', transform: `scale(${interpolate(f, [0, dur], [1, 1.045])}) translateY(${interpolate(f, [0, 12], [40, 0], {...clamp, easing: expo})}px)`, filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.45))'}} />
			<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(2,9,32,0.75) 0%, rgba(2,9,32,0) 24%, rgba(2,9,32,0) 62%, rgba(2,9,32,0.92) 86%, rgba(2,9,32,0.97) 100%)`}} />
			{/* nombre arriba */}
			<AbsoluteFill style={{alignItems: 'center', top: 120}}>
				<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 32, letterSpacing: 6, color: C.marino, background: C.oro, borderRadius: 50, padding: '10px 30px', opacity: entra(f, 4, 5), transform: `translateY(${sube(f, 4, 24)}px)`}}>{p.area}</div>
				<div style={{overflow: 'hidden', marginTop: 18}}><Txt size={108} style={{textShadow: sombra, transform: `translateY(${interpolate(f, [8, 18], [100, 0], {...clamp, easing: expo})}%)`}}>{p.nombre}</Txt></div>
			</AbsoluteFill>
			{/* lo que te llevas, abajo */}
			<AbsoluteFill style={{top: 1490, padding: '0 70px', alignItems: 'center'}}>
				<Txt size={34} font={F.texto} peso={800} color={C.celeste} style={{letterSpacing: 6, opacity: entra(f, 26, 5)}}>TE LLEVAS</Txt>
				<Txt size={58} font={F.texto} peso={800} style={{marginTop: 12, lineHeight: 1.2, opacity: entra(f, 30, 6), transform: `translateY(${sube(f, 30, 40)}px)`}}>{p.tema}</Txt>
				<div style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 12, opacity: entra(kC, 0, 4), transform: `scale(${golpe(kC, 0, 1.4)})`, fontFamily: F.texto, fontWeight: 900, fontSize: 28, letterSpacing: 3, color: C.blanco}}>
					<svg viewBox="0 0 24 24" width={40} height={40}><circle cx={12} cy={12} r={11} fill="#22C55E" /><path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
					EN TU AGENDA DEL 4 DE DICIEMBRE
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 31–48.4 s: patrocinadores de dos en dos
const PARES = [['ferreconi', 'gran-hotel-apure'], ['perfumes', 'navas'], ['mas-network', 'amavision'], ['galaxia', 'tecnoama'], ['betty-guillen', 'reyes-rivero'], ['jesus-nazareth', 'marco'], ['shamanika', 'puerto-venado'], ['multiempresariales', 'orthosmile'], ['esquina-caliente', 'tania'], ['wahari', 'condimentos'], ['delicias', 'moto-daniel'], ['shabono', 'milsi'], ['divino-nino', 'broaster'], ['kubia', 'farma'], ['jac', 'casita'], ['parapata']];
const TODOS = PARES.flat();
const N = TODOS.length; // 31
const logo = (l: string) => staticFile(`patroHD/${l}.webp`);
const PW = 860, PH = PW * 2 / 3;
const Gracias: React.FC = () => {
	const f = useCurrentFrame(); // 0 = T.gracias
	const t = f / fps + T.gracias;
	const P = S(T.por_par);
	const fin = f - S(T.muro - T.gracias);
	const idx = Math.floor((t - T.pares[0]) / T.por_par);
	const vistos = idx < 0 ? 0 : PARES.slice(0, Math.min(PARES.length, idx + 1)).flat().length;
	const fundido = fin > 0 ? interpolate(fin, [0, 10], [1, 0], clamp) : 1;
	return (
		<AbsoluteFill style={{opacity: fundido}}>
			<Fondo />
			<AbsoluteFill style={{alignItems: 'center', top: 120, opacity: fin > 0 ? interpolate(fin, [0, 8], [1, 0], clamp) : 1}}>
				<Txt size={38} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 8, opacity: entra(f, 2, 5)}}>ESTO LO HACEN POSIBLE</Txt>
				<div style={{overflow: 'hidden', marginTop: 10}}><Txt size={86} style={{transform: `translateY(${interpolate(f, [S(0.5), S(0.5) + 10], [100, 0], {...clamp, easing: expo})}%)`}}>LOS QUE LE APUESTAN A <Oro>AMAZONAS</Oro></Txt></div>
			</AbsoluteFill>
			{PARES.map((par, j) => {
				const k = Math.round((t - T.pares[j]) * fps);
				const ultimo = j === PARES.length - 1;
				if (k < 0 || (!ultimo && k > P + 8)) return null;
				return par.map((l, m) => {
					const kk = k - m * 2;
					const lado = par.length === 1 ? 1 : m === 0 ? -1 : 1; // arriba entra por la izquierda, abajo por la derecha
					const e = interpolate(kk, [0, 9], [0, 1], {...clamp, easing: expo});
					const s = ultimo ? 0 : interpolate(k, [P - 3, P + 5], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
					const x = lado * 1200 * (1 - e) - lado * 1200 * s;
					const vel = Math.abs(lado * 1200 * (interpolate(kk + 1, [0, 9], [0, 1], {...clamp, easing: expo}) - e)) + (s > 0 && s < 1 ? 160 : 0);
					const cy = par.length === 1 ? 1000 : m === 0 ? 720 : 1330;
					const sale = ultimo && fin > 0 ? interpolate(fin, [0, 10], [0, 1], {...clamp, easing: suave}) : 0;
					return (
						<div key={l} style={{position: 'absolute', left: 540 - PW / 2 + x, top: cy - PH / 2, width: PW, height: PH, borderRadius: 30, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 4px rgba(255,255,255,0.9)', filter: vel > 2 ? `blur(${Math.min(14, vel / 14)}px)` : undefined, opacity: 1 - sale, transform: `scale(${1 - 0.3 * sale})`}}>
							<Img src={logo(l)} style={{width: '100%', height: '100%', display: 'block'}} />
						</div>
					);
				});
			})}
			<AbsoluteFill style={{alignItems: 'center', top: 1730, opacity: fin > 0 ? 0 : entra(f, S(1.4), 6)}}>
				<Txt size={30} font={F.texto} peso={900} style={{letterSpacing: 6}}>PATROCINADORES OFICIALES · <Oro>{String(vistos).padStart(2, '0')}</Oro> / {N}</Txt>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 48.4 s → final: la pared en 5 filas alternas (no se va)
const FILAS = [TODOS.slice(0, 6), TODOS.slice(6, 12), TODOS.slice(12, 19), TODOS.slice(19, 25), TODOS.slice(25, 31)];
const COMPLETO = {w: 300, h: 200, g: 22, y: [430, 652, 874, 1096, 1318]};
const PARTIDO = {w: 210, h: 140, g: 14, y: [28, 182, 1456, 1610, 1764]};
const Pared: React.FC<{atenuar: number}> = ({atenuar}) => {
	const f = useCurrentFrame(); // 0 = T.muro
	const t = f / fps;
	const kP = f - S(T.parte - T.muro);
	const p = kP >= 0 ? interpolate(kP, [0, 20], [0, 1], {...clamp, easing: suave}) : 0;
	const w = lerp(COMPLETO.w, PARTIDO.w, p), h = lerp(COMPLETO.h, PARTIDO.h, p), g = lerp(COMPLETO.g, PARTIDO.g, p);
	return (
		<AbsoluteFill>
			{FILAS.map((fila, r) => {
				const dir = r % 2 === 0 ? -1 : 1;
				const paso = w + g, largo = fila.length * paso;
				const entrada = interpolate(f - r * 4, [0, 16], [1, 0], {...clamp, easing: expo});
				const avance = ((t * 46) % largo + largo) % largo;
				const x0 = (dir < 0 ? -avance : avance - largo) - 200 - dir * 1500 * entrada;
				const copias = Math.ceil((1080 + 600) / largo) + 2;
				const y = lerp(COMPLETO.y[r], PARTIDO.y[r], p);
				return (
					<div key={r} style={{position: 'absolute', left: 0, top: y, height: h, width: 1080, filter: entrada > 0.02 ? `blur(${Math.min(12, entrada * 20)}px)` : undefined}}>
						{new Array(copias).fill(0).flatMap((_, c) => fila.map((l, q) => (
							<div key={`${c}-${q}`} style={{position: 'absolute', left: x0 + (c * fila.length + q) * paso, top: 0, width: w, height: h, borderRadius: lerp(18, 14, p), overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.45)'}}>
								<Img src={logo(l)} style={{width: '100%', height: '100%', display: 'block'}} />
							</div>
						)))}
					</div>
				);
			})}
			<AbsoluteFill style={{background: `rgba(2,9,32,${atenuar})`}} />
		</AbsoluteFill>
	);
};
const Final: React.FC = () => {
	const f = useCurrentFrame(); // 0 = T.muro
	const r = (s: number) => f - S(s - T.muro);
	const kP = r(T.parte), kV = r(T.cta), kA = r(T.amazonas), kC = r(T.contacto), kZ = r(T.cierre);
	const banda = kP >= 0 ? interpolate(kP, [0, 20], [0, 1], {...clamp, easing: suave}) : 0;
	const fueraVen = interpolate(kA, [-6, 0], [1, 0], clamp), fueraAm = interpolate(kV, [-6, 0], [1, 0], clamp);
	return (
		<AbsoluteFill>
			<Fondo />
			<Pared atenuar={0} />
			{/* gracias sobre la pared completa */}
			<AbsoluteFill style={{alignItems: 'center', top: 150, opacity: 1 - banda}}>
				<Txt size={40} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 8, opacity: entra(f, 10, 6)}}>GRACIAS A TODOS ELLOS</Txt>
				<Txt size={92} style={{marginTop: 10, opacity: entra(f, 16, 6), transform: `scale(${golpe(f, 16, 1.3)})`}}><Oro>{N}</Oro> MARCAS QUE CREEN</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 1600, opacity: (1 - banda) * entra(f, 24, 8)}}>
				<Txt size={40} font={F.texto} peso={800}>EN EL TALENTO DE <Oro>AMAZONAS</Oro></Txt>
			</AbsoluteFill>
			{/* franja central */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 352, height: 1076, background: 'linear-gradient(180deg, rgba(2,9,32,0.0) 0%, rgba(2,9,32,0.86) 6%, rgba(2,9,32,0.86) 94%, rgba(2,9,32,0) 100%)', opacity: banda}} />
			{kP >= 0 && kV < 0 && (
				<>
					<AbsoluteFill style={{alignItems: 'center', top: 470, opacity: fueraVen}}>
						<Txt size={124} style={{opacity: entra(r(T.socio), 0, 3), transform: `scale(${golpe(r(T.socio), 0, 1.5)})`}}>VEN CON TU <Oro>SOCIO</Oro></Txt>
						<Txt size={124} style={{opacity: entra(r(T.equipo), 0, 3), transform: `scale(${golpe(r(T.equipo), 0, 1.5)})`}}>VEN CON TU <Oro>EQUIPO</Oro></Txt>
						<Txt size={54} font={F.texto} peso={800} style={{marginTop: 50, padding: '0 80px', lineHeight: 1.2, opacity: entra(r(T.herramientas), 0, 6), transform: `translateY(${sube(r(T.herramientas), 0, 30)}px)`}}>y llévate las herramientas<br />que <span style={{color: C.celeste}}>tu negocio necesita</span></Txt>
					</AbsoluteFill>
					<AbsoluteFill style={{alignItems: 'center', top: 560, opacity: entra(kA, 0, 5) * fueraAm}}>
						<Txt size={54} font={F.texto} peso={800} color={C.celeste} style={{letterSpacing: 4}}>NO HACE FALTA</Txt>
						<Txt size={132} style={{marginTop: 10, transform: `scale(${golpe(kA, 0, 1.3)})`}}>SALIR DE<br /><Oro>AMAZONAS</Oro></Txt>
						<Txt size={50} font={F.texto} peso={700} style={{marginTop: 30}}>para vivir un evento de este nivel</Txt>
					</AbsoluteFill>
				</>
			)}
			{kV >= 0 && (
				<AbsoluteFill style={{alignItems: 'center', top: 395}}>
					<Txt size={48} font={F.texto} peso={900} style={{letterSpacing: 4, opacity: entra(kV, 0, 5)}}>LAS ENTRADAS</Txt>
					<Txt size={128} color={C.oro} style={{opacity: entra(kV, 4, 3), transform: `scale(${golpe(kV, 4, 1.5)})`, lineHeight: 1}}>YA ESTÁN A LA VENTA</Txt>
					<div style={{marginTop: 44, display: 'flex', alignItems: 'center', gap: 36, opacity: entra(kC, 0, 6), transform: `translateY(${sube(kC, 0, 50)}px)`}}>
						<Img src={staticFile('img/qr.png')} style={{width: 300, height: 300, background: '#fff', borderRadius: 24, padding: 14}} />
						<div style={{display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
							<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: C.celeste}}>COMPRA TU ENTRADA AQUÍ</span>
							<div style={{display: 'flex', alignItems: 'center', gap: 14, background: '#25D366', borderRadius: 80, padding: '14px 30px', transform: `scale(${1 + 0.02 * Math.sin(f / 7)})`}}>
								<svg viewBox="0 0 32 32" width={54} height={54}><path fill="#fff" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.2.6 4.4 1.7 6.3L3 29l7.3-1.9c1.8 1 3.8 1.5 5.8 1.5 7 0 12.7-5.7 12.7-12.6C28.7 8.6 23 3 16 3zm0 23.2c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-4.3 1.1 1.2-4.2-.3-.4a10.4 10.4 0 0 1-1.6-5.5C5.3 9.8 10.1 5.1 16 5.1s10.6 4.7 10.6 10.5S21.9 26.2 16 26.2z" /></svg>
								<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 52, color: C.blanco}}>0426-761-7944</span>
							</div>
							<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 40, color: C.oro}}>cumbre.kubiav.com</span>
						</div>
					</div>
					<Txt size={36} font={F.texto} peso={800} style={{marginTop: 40, letterSpacing: 3, lineHeight: 1.35, opacity: entra(kC, 8, 6)}}>VIERNES 4 DE DICIEMBRE · 2:00 PM<br /><Oro>CLUB PARAPATA</Oro> · PUERTO AYACUCHO</Txt>
					<div style={{marginTop: 46, opacity: entra(kZ, 0, 6), transform: `translateY(${sube(kZ, 0, 30)}px)`}}>
						<Txt size={46} font={F.texto} peso={800} color={C.celeste} style={{letterSpacing: 2}}>EL 2027 DE TU NEGOCIO</Txt>
						<Txt size={96}>EMPIEZA EL <Oro>4 DE DICIEMBRE</Oro></Txt>
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- montaje: empujes horizontales entre escenas
const EMPUJE = 10; // cuadros
const Empuje: React.FC<{desde: number; hasta: number; entraEmpujando?: boolean; saleEmpujando?: boolean; children: React.ReactNode}> = ({desde, hasta, entraEmpujando = true, saleEmpujando = true, children}) => {
	const f = useCurrentFrame();
	const a = S(desde), b = S(hasta);
	if (f < a || f > b + EMPUJE) return null;
	const eIn = entraEmpujando ? interpolate(f - a, [0, EMPUJE], [0, 1], {...clamp, easing: suave}) : 1;
	const eOut = saleEmpujando ? interpolate(f - b, [0, EMPUJE], [0, 1], {...clamp, easing: suave}) : 0;
	if (!saleEmpujando && f > b) return null;
	const x = 1080 * (1 - eIn) - 1080 * eOut;
	const mov = (eIn > 0 && eIn < 1) || (eOut > 0 && eOut < 1);
	return (
		<AbsoluteFill style={{transform: `translateX(${x}px)`, filter: mov ? `blur(${6 * Math.sin(Math.PI * (eIn < 1 ? eIn : eOut))}px)` : undefined}}>
			<Desfase a={a}>{children}</Desfase>
		</AbsoluteFill>
	);
};
// reinicia el contador de cuadros para la escena
const Desfase: React.FC<{a: number; children: React.ReactNode}> = ({a, children}) => <Sequence from={a} layout="none">{children}</Sequence>;

export const Notificacion: React.FC<{conAudio?: boolean}> = ({conAudio = true}) => {
	useFuentes();
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{conAudio && <Audio src={staticFile('audio/mezcla-notif.wav')} />}
			{f >= S(T.desbloqueo) && f < S(T.ponentes[0]) + EMPUJE + 1 && (
				<Empuje desde={T.desbloqueo} hasta={T.ponentes[0]} entraEmpujando={false}><Cumbre /></Empuje>
			)}
			{PONENTES.map((_, i) => <Empuje key={i} desde={T.ponentes[i]} hasta={i < 3 ? T.ponentes[i + 1] : T.gracias}><Ponente i={i} /></Empuje>)}
			{f >= S(T.muro) && <Sequence from={S(T.muro)} layout="none"><Final /></Sequence>}
			<Empuje desde={T.gracias} hasta={T.muro + 0.4} saleEmpujando={false}><Gracias /></Empuje>
			{f < S(T.desbloqueo) + 16 && <Bloqueo />}
		</AbsoluteFill>
	);
};
