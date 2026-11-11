import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Brillos, C, Destello, F, FondoMarca, Foto, Pildora, S, Velo, clamp, entra, golpe, sacudir, sombra, sube, useFuentes} from './comun';

const Txt: React.FC<{children: React.ReactNode; size: number; font?: string; color?: string; peso?: number; style?: React.CSSProperties}> = ({children, size, font = F.titulo, color = C.blanco, peso, style}) => (
	<div style={{fontFamily: font, fontWeight: peso, fontSize: size, lineHeight: 1.08, color, textAlign: 'center', textShadow: sombra, ...style}}>{children}</div>
);

// ---------- Gancho: radiografía del negocio (0–6 s) ----------
const PUNTOS: [string, number, number][] = [['VENTAS', 0.2, 0.42], ['DINERO', 0.78, 0.36], ['ACCESO', 0.28, 0.66], ['MARCA', 0.74, 0.62]];
const Gancho: React.FC = () => {
	const f = useCurrentFrame();
	const scan = interpolate(f, [6, 70], [-0.05, 1.05], clamp);
	const rayos = interpolate(f, [0, 12], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<Foto src="img/super.jpg" dur={S(6)} zoom={[1.0, 1.1]} />
			<AbsoluteFill style={{opacity: rayos}}>
				<Foto src="img/super.jpg" dur={S(6)} zoom={[1.0, 1.1]} filtro="grayscale(1) invert(1) contrast(1.5) brightness(0.9)" />
				<AbsoluteFill style={{background: '#0A3DFF', mixBlendMode: 'color', opacity: 0.85}} />
				<AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, transparent 0 3px, rgba(79,195,247,0.08) 3px 4px)'}} />
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: `${scan * 100}%`, height: 6, background: C.celeste, boxShadow: `0 0 40px 12px ${C.celeste}`}} />
			{PUNTOS.map(([n, x, y]) => {
				const on = scan > y;
				const d = S(0.2) + Math.round(y * 64);
				const pulso = 1 + 0.25 * Math.sin((f - d) / 3);
				return on ? (
					<div key={n} style={{position: 'absolute', left: `${x * 100}%`, top: `${y * 100}%`, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: entra(f, d, 3)}}>
						<div style={{width: 46, height: 46, borderRadius: 30, background: C.rojo, transform: `scale(${pulso})`, boxShadow: `0 0 0 ${12 * pulso}px ${C.rojo}44, 0 0 30px ${C.rojo}`}} />
						<div style={{marginTop: 10}}><Pildora fondo={C.rojo} color={C.blanco} size={28}>{n}</Pildora></div>
					</div>
				) : null;
			})}
			<AbsoluteFill style={{alignItems: 'center', top: 210}}>
				<Txt size={84} style={{opacity: entra(f, S(2.2), 4), transform: `scale(${golpe(f, S(2.2), 1.5)})`}}>UN NEGOCIO SIN ESTRUCTURA</Txt>
				<Txt size={44} font={F.texto} peso={700} style={{marginTop: 12, opacity: entra(f, S(3.0), 6), maxWidth: 900}}>pierde capital e ingresos por varios lados <span style={{color: C.oro}}>al mismo tiempo</span>.</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 380}}>
				<Txt size={46} font={F.texto} peso={800} color={C.celeste} style={{opacity: entra(f, S(4.4), 6)}}>Y casi nunca se da cuenta.</Txt>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- Plantilla de cada fuga ----------
type Fuga = {
	num: number; area: string; dur: number;
	fotos: {src: string; desde: number; pos?: string}[];
	dolores: {texto: React.ReactNode; t: number}[];
	ponente: {nombre: string; tema: string; foto: string; pos: string; t: number};
	previo?: React.ReactNode; // contenido antes de la etiqueta (solo Acceso)
	inicioEtiqueta?: number;
};
const BloqueFuga: React.FC<{d: Fuga}> = ({d}) => {
	const f = useCurrentFrame();
	const tE = S(d.inicioEtiqueta ?? 0);
	const tP = S(d.ponente.t);
	const foto = [...d.fotos].reverse().find((x) => f >= S(x.desde)) ?? d.fotos[0];
	const salidaDolor = interpolate(f, [tP - 6, tP], [1, 0], clamp);
	return (
		<AbsoluteFill style={{transform: sacudir(f, tE, 10)}}>
			{d.fotos.map((x, i) => f >= S(x.desde) && (i === d.fotos.length - 1 || f < S(d.fotos[i + 1].desde)) && (
				<Sequence key={x.src} from={S(x.desde)} layout="none"><Foto src={x.src} dur={S(d.dur)} pos={x.pos} /></Sequence>
			))}
			<Velo arriba={0.85} abajo={0.95} medio={0.15} />
			<AbsoluteFill style={{background: C.marino, opacity: interpolate(f, [tP, tP + 10], [0, 0.45], clamp)}} />
			{d.previo}
			{f >= tE && (
				<>
					<AbsoluteFill style={{alignItems: 'center', top: 200}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: entra(f, tE, 4), transform: `scale(${golpe(f, tE, 1.4)})`}}>
							<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.celeste}}>FUGA {d.num} DE 4</span>
						</div>
						<Txt size={130} color={C.oro} style={{marginTop: 4, opacity: entra(f, tE + 2, 3), transform: `scale(${golpe(f, tE + 2, 1.8)})`, textShadow: `0 0 30px ${C.oro}66, ${sombra}`}}>{d.area}</Txt>
					</AbsoluteFill>
					<AbsoluteFill style={{alignItems: 'center', top: 760, opacity: salidaDolor, gap: 26, padding: '0 70px'}}>
						{d.dolores.map((x, i) => (
							<div key={i} style={{opacity: entra(f, S(x.t), 5), transform: `translateY(${sube(f, S(x.t))}px)`, background: 'rgba(7,26,74,0.78)', borderLeft: `8px solid ${C.rojo}`, borderRadius: 14, padding: '16px 26px', maxWidth: 940}}>
								<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 48, lineHeight: 1.2, color: C.blanco}}>{x.texto}</div>
							</div>
						))}
					</AbsoluteFill>
				</>
			)}
			{f >= tP && <TarjetaPonente p={d.ponente} f={f - tP} />}
			<Destello en={0} dur={6} max={0.5} />
			{f >= tP && <Destello en={tP} dur={6} max={0.35} color={C.celeste} />}
		</AbsoluteFill>
	);
};
const TarjetaPonente: React.FC<{p: Fuga['ponente']; f: number}> = ({p, f}) => {
	const y = interpolate(f, [0, 14], [900, 0], {...clamp, easing: Easing.out(Easing.back(1.2))});
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 560, transform: `translateY(${y}px)`}}>
			<div style={{width: 900, borderRadius: 30, overflow: 'hidden', border: `5px solid ${C.oro}`, boxShadow: `0 0 50px ${C.celeste}55, 0 20px 40px rgba(0,0,0,0.6)`, background: C.marino}}>
				<div style={{height: 560, overflow: 'hidden'}}>
					<Img src={staticFile(p.foto)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: p.pos, transform: `scale(${1.04 + f * 0.0012})`}} />
				</div>
				<div style={{padding: '22px 30px 28px', background: `linear-gradient(90deg, ${C.azul}, ${C.marino})`}}>
					<div style={{fontFamily: F.titulo, fontSize: 76, lineHeight: 1, color: C.blanco}}>{p.nombre.toUpperCase()}</div>
					<div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 38, lineHeight: 1.25, color: C.oro, marginTop: 10, opacity: entra(f, 10, 8)}}>{p.tema}</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const roja = (t: string) => <span style={{color: '#FF8A8C'}}>{t}</span>;
const FUGAS: Fuga[] = [
	{
		num: 1, area: 'VENTAS', dur: 10,
		fotos: [{src: 'img/ruta.jpg', desde: 0}, {src: 'img/se-va.jpg', desde: 4.6}],
		dolores: [{texto: <>Vendedores que solo despachan {roja('lo que se vende solo')}.</>, t: 0.8}, {texto: <>Una cartera de clientes {roja('que no crece')}.</>, t: 3.2}],
		ponente: {nombre: 'José Rodríguez', tema: 'Vender mostrando lo que gana tu cliente en cada compra.', foto: 'img/jose-tarima.jpg', pos: '30% 30%', t: 5.6},
	},
	{
		num: 2, area: 'DINERO', dur: 11,
		fotos: [{src: 'img/cuentas.jpg', desde: 0}, {src: 'img/deposito.jpg', desde: 4.8}],
		dolores: [{texto: <>Vendes todos los días, pero tu margen {roja('no está a la vista')}.</>, t: 0.8}, {texto: <>{roja('Precios sin cálculo.')} {roja('Inventario sin seguimiento.')}</>, t: 3.4}],
		ponente: {nombre: 'Juan Ernesto Sierra', tema: 'Finanzas inteligentes y ganancias reales.', foto: 'img/juan-tarima.jpg', pos: '25% 25%', t: 6.4},
	},
	{
		num: 3, area: 'ACCESO', dur: 13, inicioEtiqueta: 3,
		fotos: [{src: 'img/solazo.jpg', desde: 0, pos: 'center 35%'}],
		dolores: [{texto: <>Tu negocio cerró. Pero tu cliente {roja('quiere comprar')}…</>, t: 3.6}, {texto: <>…o al menos ver tus productos {roja('con precios')}.</>, t: 5.6}],
		ponente: {nombre: 'Daniela Silva', tema: 'Catálogo, pedidos y ventas 24/7, aunque la santamaría esté abajo.', foto: 'img/daniela-tarima.jpg', pos: '30% 25%', t: 8.0},
		previo: <PreguntaCliente />,
	},
	{
		num: 4, area: 'MARCA', dur: 10,
		fotos: [{src: 'img/dos-locales.jpg', desde: 0}, {src: 'img/solo-todo.jpg', desde: 4.4}],
		dolores: [{texto: <>Clientes que {roja('solo te comparan por precio')}.</>, t: 0.8}, {texto: <>Un negocio que {roja('depende de ti para todo')}.</>, t: 3.4}],
		ponente: {nombre: 'Tania Alzuru', tema: 'Neuromarketing y marca empresarial, para que te elijan siempre.', foto: 'img/tania-tarima.jpg', pos: '30% 25%', t: 5.6},
	},
];

// Texto del cliente en el bloque de Acceso: palabra por palabra, sin voz
function PreguntaCliente() {
	const f = useCurrentFrame();
	const palabras = '¿Y ahora cómo le digo a mi hijo cuánto me tiene que mandar?'.split(' ');
	const fuera = interpolate(f, [S(2.7), S(3.0)], [1, 0], clamp);
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 80px', opacity: fuera}}>
			<div style={{fontFamily: F.texto, fontStyle: 'italic', fontWeight: 800, fontSize: 64, lineHeight: 1.25, color: C.blanco, textAlign: 'center', textShadow: sombra, background: 'rgba(7,26,74,0.55)', padding: '24px 34px', borderRadius: 24}}>
				{palabras.map((p, i) => <span key={i} style={{opacity: entra(f, 6 + i * 4, 3)}}>{p} </span>)}
			</div>
		</AbsoluteFill>
	);
}

// ---------- Riesgo (50–55 s) ----------
const Riesgo: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Foto src="img/sobre.jpg" dur={S(5)} zoom={[1.15, 1.02]} />
			<Velo arriba={0.85} abajo={0.9} medio={0.25} />
			<AbsoluteFill style={{alignItems: 'center', top: 230, gap: 16}}>
				<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.celeste, opacity: entra(f, 0, 4)}}>Y ADEMÁS</span>
				<Txt size={110} color={C.oro} style={{opacity: entra(f, 4, 3), transform: `scale(${golpe(f, 4, 1.7)})`}}>PANEL TRIBUTARIO<br />Y LABORAL</Txt>
				<div style={{marginTop: 10, opacity: entra(f, 14, 5)}}><Pildora fondo={C.azul} color={C.blanco} size={32}>Experto tributario + Asesor laboral</Pildora></div>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 420}}>
				<Txt size={48} font={F.texto} peso={800} style={{opacity: entra(f, 40, 8), maxWidth: 900}}>Los riesgos que nadie ve… <span style={{color: '#FF8A8C'}}>hasta que llega la multa.</span></Txt>
			</AbsoluteFill>
			<Destello en={0} dur={6} max={0.5} />
		</AbsoluteFill>
	);
};

// ---------- Síntesis (55–61 s) ----------
const PONENTES: [string, string, string][] = [
	['José Rodríguez', 'img/jose-tarima.jpg', '28% 25%'],
	['Juan Ernesto Sierra', 'img/juan-tarima.jpg', '22% 20%'],
	['Daniela Silva', 'img/daniela-tarima.jpg', '26% 20%'],
	['Tania Alzuru', 'img/tania-tarima.jpg', '26% 20%'],
];
const Cuadricula: React.FC<{f: number; d: number; sello?: string}> = ({f, d, sello}) => (
	<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, width: 940}}>
		{PONENTES.map(([n, src, pos], i) => (
			<div key={n} style={{position: 'relative', height: 430, borderRadius: 24, overflow: 'hidden', border: `4px solid ${C.oro}`, opacity: entra(f, d + i * 3, 4), transform: `scale(${golpe(f, d + i * 3, 1.4)})`, boxShadow: `0 0 30px ${C.celeste}44`}}>
				<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} />
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '40px 14px 14px', background: `linear-gradient(180deg, transparent, ${C.marino}EE)`, fontFamily: F.titulo, fontSize: 42, color: C.blanco, textAlign: 'center'}}>{n.toUpperCase()}</div>
				{sello && (
					<div style={{position: 'absolute', top: 18, right: -6, transform: `rotate(8deg) scale(${golpe(f, d + 20 + i * 4, 2.2)})`, opacity: entra(f, d + 20 + i * 4, 2), fontFamily: F.texto, fontWeight: 900, fontSize: 24, color: C.rojo, border: `4px solid ${C.rojo}`, borderRadius: 10, padding: '4px 12px', background: 'rgba(255,255,255,0.92)'}}>{sello}</div>
				)}
			</div>
		))}
	</div>
);
const Sintesis: React.FC = () => {
	const f = useCurrentFrame();
	const frases: [string, number][] = [['CUATRO FUGAS.', 0], ['CUATRO ESPECIALISTAS.', 18], ['UNA SOLA SALA.', 36]];
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="sin" />
			<AbsoluteFill style={{alignItems: 'center', top: 150}}>
				{frases.map(([t, d]) => <Txt key={t} size={88} color={t.startsWith('UNA') ? C.oro : C.blanco} style={{opacity: entra(f, d, 3), transform: `scale(${golpe(f, d, 1.6)})`}}>{t}</Txt>)}
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 500}}>
				<Cuadricula f={f} d={20} />
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 260}}>
				<Txt size={58} color={C.oro} style={{opacity: entra(f, 50, 6)}}>VIERNES 4 DE DICIEMBRE</Txt>
				<Txt size={38} font={F.texto} peso={700} style={{opacity: entra(f, 56, 6)}}>Club Parapata · Puerto Ayacucho</Txt>
			</AbsoluteFill>
			<Destello en={0} dur={6} max={0.5} color={C.celeste} />
		</AbsoluteFill>
	);
};

// ---------- Tarjeta final común ----------
const TarjetaFinal: React.FC<{f: number; boton: string; children: React.ReactNode}> = ({f, boton, children}) => (
	<AbsoluteFill>
		<FondoMarca />
		<Brillos semilla="fin" />
		<AbsoluteFill style={{alignItems: 'center', top: 170, gap: 10}}>
			<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 40, color: C.blanco, letterSpacing: 2, textAlign: 'center', lineHeight: 1.1, opacity: entra(f, 0, 5)}}>CUMBRE DE TRANSFORMACIÓN<br /><span style={{fontSize: 64}}>EMPRESARIAL</span></div>
			<div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 32, color: C.celeste, opacity: entra(f, 4, 5)}}>Amazonas 2026</div>
			<div style={{marginTop: 26, width: 920, opacity: entra(f, 8, 6), transform: `translateY(${sube(f, 8)}px)`}}>{children}</div>
			<div style={{marginTop: 30, fontFamily: F.texto, fontWeight: 900, fontSize: 52, color: C.marino, background: C.oro, padding: '18px 56px', borderRadius: 70, boxShadow: `0 0 0 ${6 + 4 * Math.sin(f / 5)}px ${C.oro}55, 0 0 40px ${C.oro}`, transform: `scale(${golpe(f, 22, 0.4)})`}}>{boton}</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 26, opacity: entra(f, 30, 6)}}>
				<Img src={staticFile('img/qr.png')} style={{width: 170, height: 170, borderRadius: 14, border: `6px solid ${C.blanco}`}} />
				<div style={{fontFamily: F.texto, color: C.blanco, lineHeight: 1.3}}>
					<div style={{fontWeight: 900, fontSize: 40, color: C.oro}}>wa.link/8e9pr6</div>
					<div style={{fontWeight: 700, fontSize: 30}}>Viernes 4 de diciembre</div>
					<div style={{fontWeight: 700, fontSize: 30}}>Club Parapata · Puerto Ayacucho</div>
				</div>
			</div>
		</AbsoluteFill>
	</AbsoluteFill>
);

// ---------- FINAL A · Patrocinadores (61–86 s) ----------
const Valla: React.FC<{f: number}> = ({f}) => (
	<svg width={520} height={360} viewBox="0 0 520 360">
		<rect x={60} y={40} width={400} height={190} rx={6} fill="#C9CED6" stroke="#6B7280" strokeWidth={8} />
		<rect x={240} y={230} width={40} height={130} fill="#6B7280" />
		{[0, 1, 2].map((k) => <rect key={k} x={((f * 22 + k * 200) % 700) - 120} y={322} width={80} height={26} rx={8} fill="#4B5563" />)}
		<text x={260} y={150} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={34} fill="#6B7280">TU ANUNCIO</text>
	</svg>
);
const Radio: React.FC<{f: number}> = ({f}) => {
	const x = 120 + ((Math.sin(f / 4) + 1) / 2) * 280;
	return (
		<svg width={520} height={300} viewBox="0 0 520 300">
			<rect x={40} y={60} width={440} height={180} rx={30} fill="#9CA3AF" />
			<rect x={80} y={100} width={360} height={60} rx={8} fill="#E5E7EB" />
			{new Array(13).fill(0).map((_, k) => <line key={k} x1={100 + k * 26} y1={110} x2={100 + k * 26} y2={k % 2 ? 125 : 135} stroke="#6B7280" strokeWidth={3} />)}
			<line x1={x} y1={100} x2={x} y2={160} stroke={C.rojo} strokeWidth={5} />
			<circle cx={120} cy={200} r={22} fill="#6B7280" /><circle cx={400} cy={200} r={22} fill="#6B7280" />
		</svg>
	);
};
const Contraste: React.FC = () => {
	const f = useCurrentFrame();
	const giro = S(4.2);
	const gris = f < giro;
	return (
		<AbsoluteFill>
			{gris ? (
				<AbsoluteFill style={{background: '#2B2F36'}}>
					<AbsoluteFill style={{alignItems: 'center', top: 160}}>
						<div style={{opacity: entra(f, 0, 5), transform: 'scale(1.5)', margin: '90px 0 110px'}}><Valla f={f} /></div>
						<Txt size={62} color="#D1D5DB" style={{opacity: entra(f, 6, 5)}}>Una valla se mira 2 segundos.</Txt>
					</AbsoluteFill>
					<AbsoluteFill style={{alignItems: 'center', top: 960}}>
						<div style={{opacity: entra(f, S(1.8), 5), transform: 'scale(1.5)', margin: '70px 0 90px'}}><Radio f={f} /></div>
						<Txt size={62} color="#D1D5DB" style={{opacity: entra(f, S(2.0), 5)}}>Una cuña se cambia de emisora.</Txt>
					</AbsoluteFill>
				</AbsoluteFill>
			) : (
				<AbsoluteFill>
					<Foto src="img/jose-tarima.jpg" dur={S(3)} zoom={[1.1, 1.0]} pos="center 70%" />
					<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(7,26,74,0.3) 0%, rgba(7,26,74,0) 35%, rgba(7,26,74,0.85) 62%, rgba(7,26,74,0.97) 80%)'}} />
					<AbsoluteFill style={{alignItems: 'center', top: 1180, padding: '0 60px'}}>
						<Txt size={72} style={{opacity: entra(f, giro, 4), transform: `scale(${golpe(f, giro, 1.4)})`}}>AQUÍ, TU MARCA ESTÁ</Txt>
						<Txt size={72} color={C.oro} style={{opacity: entra(f, giro + 6, 4)}}>EN LA SALA</Txt>
						<Txt size={44} font={F.texto} peso={700} style={{marginTop: 14, opacity: entra(f, giro + 14, 6)}}>donde los dueños de negocio vienen a decidir cómo crecer.</Txt>
					</AbsoluteFill>
					<Destello en={giro} dur={8} max={0.8} />
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};
const CANALES = ['TARIMA', 'PANTALLAS', 'RADIO', 'PERIFONEO', 'REDES DE LOS 4 PONENTES', 'STAND CARA A CARA'];
const Asociacion: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="aso" />
			<AbsoluteFill style={{alignItems: 'center', top: 150}}>
				<Txt size={70} style={{opacity: entra(f, 0, 4)}}>AL LADO DE LOS</Txt>
				<Txt size={70} color={C.oro} style={{opacity: entra(f, 4, 4)}}>ESPECIALISTAS</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 360}}>
				<div style={{transform: 'scale(0.82)', transformOrigin: 'top center'}}><Cuadricula f={f} d={6} /></div>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 540, top: 360 + 441 * 0.82, transform: `translate(-50%,-50%) scale(${golpe(f, 26, 0.3)})`, opacity: entra(f, 26, 3), width: 300, height: 170, borderRadius: 20, border: `5px dashed ${C.oro}`, background: 'rgba(7,26,74,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${C.oro}88`}}>
				<div style={{fontFamily: F.titulo, fontSize: 52, color: C.oro, textAlign: 'center', lineHeight: 1}}>TU MARCA<br />AQUÍ</div>
			</div>
			<AbsoluteFill style={{alignItems: 'center', top: 1150}}>
				<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, width: 960}}>
					{CANALES.map((c, i) => <div key={c} style={{opacity: entra(f, 40 + i * 9, 3), transform: `scale(${golpe(f, 40 + i * 9, 1.6)})`}}><Pildora fondo={i === 5 ? C.oro : C.azul} color={i === 5 ? C.marino : C.blanco} size={32}>{c}</Pildora></div>)}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
const Prueba: React.FC = () => {
	const f = useCurrentFrame();
	const logos = new Array(13).fill(0).map((_, i) => `logos/logo${i + 1}.png`);
	return (
		<AbsoluteFill>
			<FondoMarca />
			<AbsoluteFill style={{alignItems: 'center', top: 170}}>
				<Txt size={80} style={{opacity: entra(f, 0, 4)}}><span style={{color: C.oro}}>13 MARCAS</span> YA ENTENDIERON</Txt>
				<Txt size={80} style={{opacity: entra(f, 4, 4)}}>LA DIFERENCIA</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 220px)', gap: 18}}>
					{logos.map((src, i) => (
						<div key={src} style={{height: 200, borderRadius: 18, background: C.blanco, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', opacity: entra(f, 6 + i * 3, 3), transform: `scale(${golpe(f, 6 + i * 3, 1.5)})`, boxShadow: '0 8px 20px rgba(0,0,0,0.5)'}}>
							<Img src={staticFile(src)} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
						</div>
					))}
					{[0, 1, 2].map((k) => (
						<div key={k} style={{height: 200, borderRadius: 18, border: `4px dashed ${C.oro}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: entra(f, 50, 4) * (0.55 + 0.45 * Math.abs(Math.sin(f / 6 + k))), fontFamily: F.titulo, fontSize: 40, color: C.oro, textAlign: 'center', lineHeight: 1}}>TU<br />LOGO</div>
					))}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
const CierreA: React.FC = () => {
	const f = useCurrentFrame();
	const tarjeta = S(3.5);
	if (f < tarjeta) {
		return (
			<AbsoluteFill style={{background: '#030B24', justifyContent: 'center', alignItems: 'center', padding: '0 70px', gap: 30}}>
				<Txt size={66} font={F.texto} peso={800} style={{opacity: entra(f, 8, 6)}}>La pregunta no es cuánto cuesta estar.</Txt>
				<Txt size={66} font={F.texto} peso={800} color={C.oro} style={{opacity: entra(f, 44, 6)}}>Es quién va a ocupar tu lugar si no estás tú…</Txt>
				<Txt size={56} font={F.texto} peso={700} color={C.celeste} style={{opacity: entra(f, 80, 6)}}>y qué clientes se va a llevar.</Txt>
			</AbsoluteFill>
		);
	}
	const g = f - tarjeta;
	return (
		<TarjetaFinal f={g} boton="QUIERO SER PATROCINADOR">
			<div style={{display: 'flex', gap: 20, justifyContent: 'center'}}>
				{[['ORO', '2 entradas VIP'], ['DIAMANTE', '3 entradas VIP']].map(([n, v]) => (
					<div key={n} style={{flex: 1, borderRadius: 22, border: `3px solid ${C.oro}`, background: 'rgba(7,26,74,0.85)', padding: '18px 10px', textAlign: 'center'}}>
						<div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 26, color: C.celeste, letterSpacing: 4}}>PATROCINIO</div>
						<div style={{fontFamily: F.titulo, fontSize: 70, color: C.oro, lineHeight: 1.05}}>{n}</div>
						<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 30, color: C.blanco}}>{v}</div>
					</div>
				))}
			</div>
			<div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 28, color: C.blanco, textAlign: 'center', marginTop: 16, lineHeight: 1.4}}>Ambos incluyen stand · radio · perifoneo · redes de los ponentes · pantallas · mención en tarima</div>
		</TarjetaFinal>
	);
};

// ---------- FINAL B · Público (61–84 s) ----------
const Anclaje: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="anc" />
			<AbsoluteFill style={{alignItems: 'center', top: 140, padding: '0 60px'}}>
				<Txt size={54} font={F.texto} peso={800} style={{opacity: entra(f, 0, 5)}}>Sentarte con cada uno de ellos te costaría <span style={{color: C.oro}}>mucho más que una tarde</span>.</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 370}}>
				<div style={{transform: 'scale(0.86)', transformOrigin: 'top center'}}><Cuadricula f={f} d={6} sello="ASESORÍA PRIVADA" /></div>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 1200, gap: 14}}>
				<div style={{opacity: entra(f, S(4.4), 4), transform: `scale(${golpe(f, S(4.4), 1.5)})`}}><Pildora fondo={C.azul} color={C.blanco} size={36}>+ PANEL TRIBUTARIO Y LABORAL</Pildora></div>
				<div style={{opacity: entra(f, S(5.6), 4), transform: `scale(${golpe(f, S(5.6), 1.5)})`}}><Pildora fondo={C.azul} color={C.blanco} size={36}>+ LOS EMPRESARIOS DE LA REGIÓN</Pildora></div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
const Precio: React.FC = () => {
	const f = useCurrentFrame();
	const tacha = interpolate(f, [S(1.6), S(2.1)], [0, 100], clamp);
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="pre" />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 20, paddingBottom: 160}}>
				<Txt size={44} font={F.texto} peso={800} color={C.celeste} style={{opacity: entra(f, 0, 4), letterSpacing: 4}}>TODO ESO</Txt>
				<div style={{position: 'relative', opacity: entra(f, 4, 4)}}>
					<Txt size={110} color="#C7CEDB">VALORADO EN $400</Txt>
					<div style={{position: 'absolute', left: 0, top: '52%', height: 12, width: `${tacha}%`, background: C.rojo, borderRadius: 6, transform: 'rotate(-4deg)', boxShadow: `0 0 20px ${C.rojo}`}} />
				</div>
				<div style={{opacity: entra(f, S(2.4), 3), transform: `scale(${golpe(f, S(2.4), 2.2)})`, marginTop: 20}}>
					<Txt size={64} font={F.texto} peso={900}>TU ENTRADA:</Txt>
					<Txt size={260} color={C.oro} style={{lineHeight: 1, textShadow: `0 0 50px ${C.oro}88, ${sombra}`}}>$50</Txt>
				</div>
			</AbsoluteFill>
			<Destello en={S(2.4)} dur={8} max={0.6} color={C.oro} />
		</AbsoluteFill>
	);
};
const CierreB: React.FC = () => {
	const f = useCurrentFrame();
	const flip = interpolate(f, [S(0.6), S(1.4)], [0, 180], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const tarjeta = S(6);
	if (f < tarjeta) {
		return (
			<AbsoluteFill style={{background: '#030B24', alignItems: 'center', paddingTop: 200}}>
				<div style={{width: 420, height: 420, perspective: 1200}}>
					<div style={{position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transform: `rotateX(${flip}deg)`}}>
						{[['DIC', '2026', 0], ['ENE', '2027', 180]].map(([m, a, r]) => (
							<div key={String(a)} style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: `rotateX(${r}deg)`, borderRadius: 30, background: C.blanco, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'}}>
								<div style={{height: 120, background: r ? C.azul : C.rojo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.titulo, fontSize: 80, color: C.blanco}}>{m}</div>
								<div style={{fontFamily: F.titulo, fontSize: 190, color: C.marino, textAlign: 'center', lineHeight: 1.5}}>{a}</div>
							</div>
						))}
					</div>
				</div>
				<div style={{marginTop: 70, padding: '0 70px', display: 'flex', flexDirection: 'column', gap: 26}}>
					<Txt size={58} font={F.texto} peso={800} style={{opacity: entra(f, S(1.6), 6)}}>El próximo año tu negocio puede seguir igual…</Txt>
					<Txt size={58} font={F.texto} peso={800} color="#FF8A8C" style={{opacity: entra(f, S(2.8), 6)}}>o puede que ya no exista.</Txt>
					<Txt size={50} font={F.texto} peso={700} color={C.oro} style={{opacity: entra(f, S(4.0), 6)}}>La diferencia está en lo que vas a aprender el 4 de diciembre.</Txt>
				</div>
			</AbsoluteFill>
		);
	}
	const g = f - tarjeta;
	return (
		<TarjetaFinal f={g} boton="QUIERO ASISTIR">
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, borderRadius: 22, border: `3px solid ${C.oro}`, background: 'rgba(7,26,74,0.85)', padding: '16px 10px'}}>
				<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 32, color: '#C7CEDB', textDecoration: 'line-through', textDecorationColor: C.rojo}}>Valorado en $400</div>
				<div style={{fontFamily: F.titulo, fontSize: 84, color: C.oro, lineHeight: 1}}>$50</div>
			</div>
			<div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 28, color: C.blanco, textAlign: 'center', marginTop: 16, lineHeight: 1.4}}>4 ponencias · panel tributario y laboral · networking · recorrido por los stands</div>
		</TarjetaFinal>
	);
};

// ---------- Línea de tiempo ----------
type Escena = [number, number, React.FC];
const CUERPO: Escena[] = [
	[0, 6, Gancho],
	[6, 16, () => <BloqueFuga d={FUGAS[0]} />],
	[16, 27, () => <BloqueFuga d={FUGAS[1]} />],
	[27, 40, () => <BloqueFuga d={FUGAS[2]} />],
	[40, 50, () => <BloqueFuga d={FUGAS[3]} />],
	[50, 55, Riesgo],
	[55, 61, Sintesis],
];
const FINAL_A: Escena[] = [[61, 68, Contraste], [68, 75, Asociacion], [75, 79, Prueba], [79, 86, CierreA]];
const FINAL_B: Escena[] = [[61, 69, Anclaje], [69, 75, Precio], [75, 84, CierreB]];

export const Cumbre: React.FC<{version: 'A' | 'B'; conAudio?: boolean}> = ({version, conAudio = true}) => {
	useFuentes();
	const escenas = [...CUERPO, ...(version === 'A' ? FINAL_A : FINAL_B)];
	return (
		<AbsoluteFill style={{background: C.marino}}>
			{conAudio && <Audio src={staticFile(`audio/efectos-${version}.wav`)} />}
			{escenas.map(([a, b, Comp]) => (
				<Sequence key={a} from={S(a)} durationInFrames={S(b) - S(a)}><Comp /></Sequence>
			))}
		</AbsoluteFill>
	);
};
