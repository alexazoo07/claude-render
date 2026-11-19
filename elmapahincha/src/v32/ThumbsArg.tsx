// Miniaturas v2 para "¿Qué pasaría si Argentina desapareciera del fútbol?" — más expresión y detalle
import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Fonts, LILITA} from '../fonts';
import {INK} from '../v21/Atlas21';
import {Map} from '../v21/Thumbs21b';
import {StickerX, XM, Storm, Bevel, FaceX} from '../v21/Thumbs21c';
import {TT, Vig, Rays, Sparkles, Cup, Crown, Arrow, SplitBolt, RightClip, VsX, Zap} from '../v22/Thumbs22b';
import F3 from '../iso3flag.json';

const FLG = (k: string) => ({...(F3 as Record<string, string>), ENG: 'gb-eng'})[k];
const YEL = '#FFD23F', RED = '#FF3B3B', CEL = '#8FD0FF';
const SW = 0.1;
const SA = {x: 1180, y: 1180, z: 0.95};
const WORLD = {x: 1915, y: 880, z: 0.62};
const rnd = (s: number) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };

const Base: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: '#2A72BA', overflow: 'hidden'}}><Fonts />{children}</AbsoluteFill>;
const Bg: React.FC<{cam: {x: number; y: number; z: number}; mood?: any; dark?: number; argGrey?: boolean; blur?: number}> = ({cam, mood = 'shock', dark = 0.25, argGrey = true, blur = 0}) => (
	<div style={{position: 'absolute', inset: 0, filter: `${blur ? `blur(${blur}px) ` : ''}saturate(1.15)`}}><Map cam={cam} mood={mood} dark={dark} grey={argGrey ? (k) => k === 'ARG' : undefined} /></div>
);
const Glow: React.FC<{c: string; children: React.ReactNode; s?: number}> = ({c, children, s = 1}) => (
	<div style={{position: 'absolute', inset: 0, filter: `drop-shadow(0 0 ${10 * s}px ${c}) drop-shadow(0 0 ${30 * s}px ${c})`}}>{children}</div>
);
// Argentina "fantasma": sticker en gris translúcido con halo blanco
const Ghost: React.FC<{children: React.ReactNode; o?: number}> = ({children, o = 0.85}) => (
	<div style={{position: 'absolute', inset: 0, opacity: o, filter: 'grayscale(1) brightness(1.15) drop-shadow(0 0 14px rgba(255,255,255,0.95)) drop-shadow(0 0 40px rgba(180,220,255,0.8))'}}>{children}</div>
);
const Ball: React.FC<{k: string; d: number; x: number; y: number; m: XM; look?: [number, number]; id: string; rot?: number}> = ({k, d, x, y, m, look, id, rot = 0}) => (
	<svg width={d} height={d} viewBox="-115 -115 230 230" style={{position: 'absolute', left: x - d / 2, top: y - d / 2, overflow: 'visible', transform: `rotate(${rot}deg)`}}>
		<defs><clipPath id={`c${id}`}><circle r={100} /></clipPath><Bevel id={`b${id}`} s={0.55} k={0.6} /></defs>
		<circle cx={5} cy={14} r={112} fill="#000" opacity={0.45} />
		<circle r={112} fill={INK} /><circle r={108} fill="#F6F6F6" />
		<g filter={`url(#b${id})`}><g clipPath={`url(#c${id})`}><image href={staticFile(`flags/${FLG(k)}.svg`)} x={-150} y={-100} width={300} height={200} preserveAspectRatio="xMidYMid slice" /></g></g>
		<circle r={100} fill="none" stroke={INK} strokeWidth={4} />
		<g transform="translate(-74 -70) scale(0.74)"><FaceX m={m} look={look} /></g>
	</svg>
);
// partículas que se desprenden (Argentina desintegrándose)
const Dust: React.FC<{x: number; y: number; w: number; h: number; n?: number; seed?: number; dir?: number}> = ({x, y, w, h, n = 140, seed = 3, dir = 1}) => {
	const R = rnd(seed * 911 + 7);
	return <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
		{Array.from({length: n}, (_, i) => {
			const t = R();
			const px = x + (R() - 0.3) * w * 0.6 * dir + t * 520 * dir, py = y + (R() - 0.5) * h - t * 160 + Math.sin(i) * 20;
			const s = (1 - t) * 26 + 6;
			const c = ['#74ACDF', '#FFFFFF', '#F6B40E', '#BFD9F2'][i % 4];
			return <rect key={i} x={px} y={py} width={s} height={s} rx={s * 0.2} fill={c} stroke={INK} strokeWidth={2} opacity={1 - t * 0.7} transform={`rotate(${R() * 90} ${px} ${py})`} />;
		})}
	</svg>;
};
const Tomb: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = -6}) => (
	<svg width={s} height={s * 1.15} viewBox="-6 -6 112 124" style={{position: 'absolute', left: x - s / 2, top: y - s * 0.58, overflow: 'visible', transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 10px 0 rgba(0,0,0,0.4))'}}>
		<path d="M8 112 V44 Q8 4 50 4 Q92 4 92 44 V112 Z" fill="#B8BEC8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
		<path d="M20 44 Q22 18 46 14" stroke="#E2E6EC" strokeWidth={6} fill="none" strokeLinecap="round" />
		<path d="M70 70 l8 8 M26 96 l6 -4" stroke="#8E95A1" strokeWidth={3} strokeLinecap="round" />
		<text x={50} y={44} textAnchor="middle" fontFamily={LILITA} fontSize={17} fill={INK}>R.I.P.</text>
		<text x={50} y={66} textAnchor="middle" fontFamily={LILITA} fontSize={12} fill={INK}>ARGENTINA</text>
		<text x={50} y={84} textAnchor="middle" fontFamily={LILITA} fontSize={12} fill={INK}>1901-2026</text>
		<path d="M0 112 H100" stroke={INK} strokeWidth={6} strokeLinecap="round" />
		<path d="M4 112 q8 -12 14 0 q6 -10 12 0 M70 112 q6 -12 12 0 q6 -9 12 0" stroke="#2F8F4E" strokeWidth={5} fill="none" strokeLinecap="round" />
	</svg>
);
// goma de borrar gigante
const Eraser: React.FC<{x: number; y: number; w: number; rot?: number}> = ({x, y, w, rot = -30}) => (
	<svg width={w} height={w * 0.5} viewBox="0 0 200 100" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.25, transform: `rotate(${rot}deg)`, overflow: 'visible', filter: 'drop-shadow(0 10px 0 rgba(0,0,0,0.4))'}}>
		<path d="M10 20 Q10 8 22 8 H110 V92 H22 Q10 92 10 80 Z" fill="#FF8FA8" stroke={INK} strokeWidth={7} />
		<path d="M110 8 H178 Q190 8 190 20 V80 Q190 92 178 92 H110 Z" fill="#3F7FE0" stroke={INK} strokeWidth={7} />
		<path d="M24 22 H96" stroke="#FFD0DB" strokeWidth={7} strokeLinecap="round" />
		<path d="M122 22 H176" stroke="#8EB8FF" strokeWidth={7} strokeLinecap="round" />
		<text x={150} y={62} textAnchor="middle" fontFamily={LILITA} fontSize={26} fill="#fff">FIFA</text>
	</svg>
);
// rótulo inclinado
const Tag: React.FC<{text: string; x: number; y: number; size?: number; bg?: string; c?: string; rot?: number}> = ({text, x, y, size = 56, bg = YEL, c = INK, rot = -5}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, background: bg, border: `${size * 0.1}px solid ${INK}`, borderRadius: size * 0.25, padding: `${size * 0.02}px ${size * 0.28}px`, boxShadow: `0 ${size * 0.12}px 0 ${INK}`, fontFamily: LILITA, fontSize: size, color: c, whiteSpace: 'nowrap', lineHeight: 1.15}}>{text}</div>
);
const Arg: React.FC<{w: number; x: number; y: number; m: XM; look?: [number, number]; rot?: number; glow?: string; ghost?: boolean}> = ({w, x, y, m, look = [0, 0.1], rot = 0, glow, ghost}) => {
	const s = <StickerX k="ARG" w={w * 1.25} x={x} y={y} m={m} look={look} rot={rot} face={1.55} />;
	if (ghost) return <Ghost>{s}</Ghost>;
	return <div style={{position: 'absolute', inset: 0}}>{glow ? <Glow c={glow}>{s}</Glow> : s}</div>;
};

// 1 · pantalla dividida: CON ARGENTINA (copas, sol) | SIN ARGENTINA (tormenta, fantasma)
export const TA1: React.FC = () => (
	<Base>
		<Bg cam={SA} argGrey={false} mood="happy" dark={0.15} />
		<Rays c1="rgba(255,210,63,0.35)" c2="rgba(255,150,0,0.15)" cx="25%" cy="55%" n={26} />
		<RightClip><Bg cam={SA} mood="shock" dark={0.45} /><Storm /></RightClip>
		<SplitBolt x={960} />
		<Arg w={340} x={430} y={600} m="evil" glow="#FFD23F" />
		<Cup x={180} y={480} h={190} rot={-12} /><Cup x={700} y={430} h={170} rot={10} /><Cup x={660} y={780} h={150} rot={-6} />
		<Arg w={340} x={1440} y={600} m="cry" ghost />
		<Dust x={1460} y={600} w={340} h={500} seed={4} />
		<TT parts={[['CON ARGENTINA', CEL]]} size={84} sw={SW} style={{top: 40, left: 0, right: 960}} />
		<TT parts={[['SIN ARGENTINA', RED]]} size={84} sw={SW} style={{top: 40, left: 960, right: 0}} />
		<TT parts={[['¿QUÉ CAMBIARÍA?', YEL]]} size={120} sw={SW} style={{top: 925}} />
	</Base>
);
// 2 · Argentina desintegrándose en el centro del mundo + rivales felices
export const TA2: React.FC = () => (
	<Base>
		<Bg cam={WORLD} mood="happy" />
		<Vig />
		<Arg w={480} x={900} y={560} m="terror" ghost look={[0, -0.2]} />
		<TT parts={[['¿Y SI ARGENTINA']]} size={116} sw={SW} style={{top: 20}} />
		<TT parts={[['DESAPARECIERA?', RED]]} size={140} sw={SW} style={{top: 905}} />
	</Base>
);
// 3 · R.I.P. Argentina: fantasma llorando sobre su tumba, Brasil celebrando con corona
export const TA3: React.FC = () => (
	<Base>
		<Bg cam={SA} dark={0.35} />
		<Vig o={0.65} />
		<Tomb x={700} y={720} s={330} />
		<Arg w={330} x={480} y={500} m="cry" ghost rot={-8} />
		<div style={{position: 'absolute', inset: 0}}><Glow c="#FFD23F"><StickerX k="BRA" w={560} x={1420} y={600} m="evil" look={[-0.6, 0]} /></Glow></div>
		<Crown x={1430} y={250} w={260} rot={8} />
		<Sparkles seed={5} n={16} />
		<TT parts={[['¿ADIÓS,'], ['ARGENTINA?!', CEL]]} size={128} sw={SW} style={{top: 20}} />
		<Tag text="¡18 COPAS AMÉRICA!" x={1420} y={960} size={60} />
	</Base>
);
// 4 · la goma de la FIFA borrando Argentina del mapa
export const TA4: React.FC = () => (
	<Base>
		<Bg cam={{x: 1240, y: 1260, z: 1.25}} mood="shock" dark={0.25} />
		<Vig />
		<div style={{position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}>
			<Arg w={420} x={820} y={600} m="terror" look={[0.5, -0.5]} glow="#FF3B3B" />
		</div>
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><path d="M640 330 Q760 420 700 520 Q640 640 760 720 Q860 800 800 900" stroke="#EDE7D8" strokeWidth={110} strokeLinecap="round" fill="none" opacity={0.92} /></svg>
		<Eraser x={900} y={300} w={520} rot={-28} />
		<Dust x={760} y={520} w={240} h={500} seed={2} n={90} dir={-1} />
		<Ball k="URY" d={200} x={1420} y={560} m="shock" id="u4" look={[-0.6, 0]} />
		<Ball k="CHL" d={180} x={1640} y={790} m="shock" id="c4" look={[-0.6, -0.2]} />
		<TT parts={[['BORRAMOS A'], ['ARGENTINA', CEL]]} size={124} sw={SW} style={{top: 20}} />
		<TT parts={[['DEL FÚTBOL', RED]]} size={120} sw={SW} style={{top: 920}} />
	</Base>
);
// 5 · sus 3 copas del mundo volando hacia Francia, Alemania y Países Bajos
export const TA5: React.FC = () => (
	<Base>
		<Bg cam={{x: 1700, y: 900, z: 0.78}} mood="happy" dark={0.3} />
		<Vig o={0.6} />
		<Arg w={360} x={330} y={620} m="cry" ghost rot={-6} />
		<Arrow x={760} y={420} w={300} rot={-20} c="#fff" />
		<Arrow x={780} y={640} w={300} rot={0} c="#fff" />
		<Arrow x={760} y={860} w={300} rot={20} c="#fff" />
		<Cup x={1120} y={330} h={170} rot={-8} /><Cup x={1150} y={620} h={170} rot={6} /><Cup x={1120} y={880} h={170} rot={-4} />
		<Ball k="NLD" d={190} x={1420} y={330} m="evil" id="n5" look={[-0.6, 0]} />
		<Ball k="DEU" d={190} x={1450} y={620} m="evil" id="d5" look={[-0.6, 0]} />
		<Ball k="FRA" d={190} x={1420} y={880} m="evil" id="f5" look={[-0.6, 0]} />
		<Tag text="1978" x={1650} y={330} size={50} rot={6} /><Tag text="1986" x={1680} y={620} size={50} rot={-4} /><Tag text="2022" x={1650} y={880} size={50} rot={5} />
		<TT parts={[['SIN ARGENTINA,'], ['¿QUIÉN GANA?', YEL]]} size={110} sw={SW} style={{top: 20}} />
	</Base>
);
// 6 · VS: Argentina fantasma contra Brasil pletórico (pantalla dividida inclinada)
export const TA6: React.FC = () => (
	<Base>
		<Bg cam={SA} argGrey mood="shock" dark={0.4} />
		<RightClip><Bg cam={{x: 1300, y: 1050, z: 1.1}} argGrey={false} mood="happy" dark={0.1} /><Rays c1="rgba(0,156,59,0.45)" c2="rgba(255,223,0,0.25)" cx="70%" cy="55%" n={28} /></RightClip>
		<SplitBolt x={960} />
		<Arg w={380} x={460} y={600} m="cry" ghost />
		<Dust x={480} y={600} w={360} h={480} seed={7} n={120} dir={-1} />
		<div style={{position: 'absolute', inset: 0}}><Glow c="#FFD23F"><StickerX k="BRA" w={640} x={1440} y={600} m="evil" look={[-0.6, 0]} /></Glow></div>
		<Zap x={1180} y={300} s={130} rot={14} /><Zap x={1750} y={860} s={110} rot={-12} />
		<VsX x={960} y={560} d={200} />
		<TT parts={[['16 COPAS'], ['→ BRASIL', YEL]]} size={112} sw={SW} style={{top: 20}} />
		<TT parts={[['¿SIN ARGENTINA?', RED]]} size={112} sw={SW} style={{top: 925}} />
	</Base>
);

// ================= V34 · "Tu selección desaparece si nunca ha…"
const S: React.FC<{k: string; w: number; x: number; y: number; m: XM; look?: [number, number]; rot?: number; glow?: string; ghost?: boolean; face?: number}> = ({k, w, x, y, m, look = [0, 0.1], rot = 0, glow, ghost, face}) => {
	const s = <StickerX k={k} w={w} x={x} y={y} m={m} look={look} rot={rot} face={face} />;
	if (ghost) return <Ghost>{s}</Ghost>;
	return <div style={{position: 'absolute', inset: 0}}>{glow ? <Glow c={glow}>{s}</Glow> : s}</div>;
};
const BgG: React.FC<{cam: {x: number; y: number; z: number}; grey?: string[]; mood?: any; dark?: number}> = ({cam, grey = [], mood = 'shock', dark = 0.25}) => (
	<div style={{position: 'absolute', inset: 0, filter: 'saturate(1.15)'}}><Map cam={cam} mood={mood} dark={dark} grey={(k) => grey.includes(k)} /></div>
);
const T1 = () => <TT parts={[['TU SELECCIÓN'], ['DESAPARECE', RED]]} size={104} sw={SW} style={{top: 20}} />;
const T2: React.FC<{t?: string; c?: string}> = ({t = 'SI NUNCA HA...', c = YEL}) => <TT parts={[[t, c]]} size={130} sw={SW} style={{top: 915}} />;
const EUc = {x: 1990, y: 560, z: 1.55};
// split genérico: izquierda mapa del mundo con la selección "viva", derecha tormenta morada con su fantasma
const Split: React.FC<{k: string; cam: {x: number; y: number; z: number}; wL: number; wR: number; mL: XM; mR: XM; glowL?: string; tagL?: string; tagR?: string; faceS?: number; dust?: boolean; ty?: number}> = ({k, cam, wL, wR, mL, mR, glowL = '#FFD23F', tagL, tagR, faceS, dust = true, ty = 800}) => (
	<Base>
		<BgG cam={cam} mood="happy" dark={0.18} />
		<RightClip><BgG cam={cam} grey={[k]} mood="shock" dark={0.45} /><Storm /></RightClip>
		<SplitBolt x={960} />
		<S k={k} w={wL} x={470} y={540} m={mL} glow={glowL} look={[0.5, 0]} face={faceS} />
		<S k={k} w={wR} x={1450} y={540} m={mR} ghost look={[-0.5, 0]} face={faceS} />
		{dust && <Dust x={1480} y={590} w={wR} h={460} seed={6} n={110} />}
		{tagL && <Tag text={tagL} x={470} y={ty} size={52} rot={-4} bg="#7CFF8A" />}
		{tagR && <Tag text={tagR} x={1450} y={ty} size={52} rot={4} bg="#FF4D5E" c="#fff" />}
		<T1 /><T2 />
	</Base>
);
export const TN1: React.FC = () => <Split k="BRA" cam={{x: 1300, y: 1050, z: 1.0}} wL={640} wR={640} mL="evil" mR="cry" tagL="5 MUNDIALES" tagR="0 EUROCOPAS" dust={false} ty={830} />;
export const TN2: React.FC = () => <Split k="ENG" cam={EUc} wL={470} wR={470} mL="rage" mR="cry" tagL="CAMPEONA 1966" tagR="0 EUROCOPAS" />;
export const TN3: React.FC = () => <Split k="NLD" cam={EUc} wL={520} wR={520} mL="evil" mR="terror" tagL="3 FINALES" tagR="0 MUNDIALES" />;
// fantasma gris en el centro del mapa del mundo (como la de Argentina)
export const TN4: React.FC = () => (
	<Base>
		<BgG cam={WORLD} grey={['BRA']} mood="shock" />
		<Vig />
		<S k="BRA" w={680} x={940} y={560} m="terror" ghost look={[0, -0.2]} />
		<T1 /><T2 />
	</Base>
);
export const TN5: React.FC = () => (
	<Base>
		<BgG cam={EUc} grey={['ENG']} mood="shock" dark={0.3} />
		<Vig />
		<S k="ENG" w={580} x={960} y={570} m="cry" ghost look={[0, -0.1]} />
		<T1 /><T2 />
	</Base>
);
// fila de fantasmas: hasta las grandes desaparecen
export const TN6: React.FC = () => (
	<Base>
		<BgG cam={WORLD} grey={['BRA', 'ARG', 'ENG', 'NLD', 'FRA']} mood="panic" dark={0.35} />
		<Vig o={0.65} />
		<S k="ARG" w={230} x={280} y={560} m="cry" ghost face={1.55} />
		<S k="BRA" w={420} x={700} y={560} m="terror" ghost />
		<S k="FRA" w={300} x={1170} y={560} m="shock" ghost />
		<S k="NLD" w={250} x={1590} y={560} m="cry" ghost />
		<T1 /><T2 t="¿SOLO SOBREVIVE 1?" c={YEL} />
	</Base>
);
// vs dividido: una fuerte y viva (izq) contra una fantasma (der)
export const TN7: React.FC = () => (
	<Base>
		<BgG cam={WORLD} mood="happy" dark={0.18} />
		<RightClip><BgG cam={WORLD} grey={['MEX']} mood="shock" dark={0.45} /><Storm /></RightClip>
		<SplitBolt x={960} />
		<S k="DEU" w={420} x={470} y={580} m="evil" glow="#FFD23F" look={[0.5, 0]} />
		<S k="MEX" w={560} x={1450} y={590} m="cry" ghost look={[-0.5, 0]} />
		<Dust x={1480} y={590} w={500} h={420} seed={8} n={110} />
		<VsX x={960} y={560} d={190} />
		<T1 /><T2 t="SI NUNCA HA..." />
	</Base>
);
