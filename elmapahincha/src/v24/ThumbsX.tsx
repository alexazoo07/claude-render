// Thumbnails for videos 24-28, in the El Mapa Animado style (big glowing stickers, thick titles, badges)
import React, {useId} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Fonts, LILITA} from '../fonts';
import {INK} from '../v21/Atlas21';
import {Bevel, FaceX, StickerX, XM, Storm} from '../v21/Thumbs21c';
import {TT, Bg, Vig, Rays, Sparkles, Confetti, QBadge, Plus, VsX, Cup, Crown, StarX, Zap, SplitBolt, RightClip, Arrow} from '../v22/Thumbs22b';
import F3 from '../iso3flag.json';
import {Jersey, Wheel} from './Video24';
import {KIT} from './data24';

const FLG = (k: string) => ({...(F3 as Record<string, string>), ENG: 'gb-eng', SCT: 'gb-sct'})[k];
const YEL = '#FFD23F', RED = '#FF3B3B', BLUE = '#5EC8FF', GOLD = '#FFC93C';
const uid = () => useId().replace(/[^a-zA-Z0-9]/g, '');
const SA_CAM = {x: 1180, y: 1180, z: 0.95};
const WORLD_CAM = {x: 1915, y: 880, z: 0.62};
const EU_CAM = {x: 1980, y: 560, z: 1.6};

// a glowing sticker (StickerX wrapped in a glow halo)
const Glow: React.FC<{c: string; children: React.ReactNode; s?: number}> = ({c, children, s = 1}) => (
	<div style={{position: 'absolute', inset: 0, filter: `drop-shadow(0 0 ${10 * s}px ${c}) drop-shadow(0 0 ${30 * s}px ${c})`}}>{children}</div>
);
const Ball: React.FC<{k: string; d: number; x: number; y: number; m: XM; look?: [number, number]}> = ({k, d, x, y, m, look}) => {
	const u = uid();
	return (
		<svg width={d} height={d} viewBox="-115 -115 230 230" style={{position: 'absolute', left: x - d / 2, top: y - d / 2, overflow: 'visible'}}>
			<defs><clipPath id={`c${u}`}><circle r={100} /></clipPath><Bevel id={`b${u}`} s={0.55} k={0.6} /><filter id={`s${u}`}><feColorMatrix type="saturate" values="1.4" /></filter></defs>
			<circle cx={5} cy={14} r={112} fill="#000" opacity={0.45} />
			<circle r={112} fill={INK} /><circle r={108} fill="#F6F6F6" />
			<g filter={`url(#b${u})`}><g clipPath={`url(#c${u})`}><image href={staticFile(`flags/${FLG(k)}.svg`)} x={-150} y={-100} width={300} height={200} preserveAspectRatio="xMidYMid slice" filter={`url(#s${u})`} /></g></g>
			<circle r={100} fill="none" stroke={INK} strokeWidth={4} />
			<g transform="translate(-74 -70) scale(0.74)"><FaceX m={m} look={look} /></g>
		</svg>
	);
};
const J: React.FC<{k: string; w: number; x: number; y: number; rot?: number; x2?: boolean}> = ({k, w, x, y, rot = 0, x2}) => (
	<div style={{position: 'absolute', left: x - w / 2, top: y - w / 2, transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 8px 0 rgba(0,0,0,0.4))'}}>
		<Jersey kit={KIT[k]} w={w} id={'t' + k + Math.round(x)} />
		{x2 && <svg width={w} height={w} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0}}><path d="M22 22 L78 82 M78 22 L22 82" stroke={INK} strokeWidth={15} strokeLinecap="round" /><path d="M22 22 L78 82 M78 22 L22 82" stroke="#E8394A" strokeWidth={9} strokeLinecap="round" /></svg>}
	</div>
);
const Big: React.FC<{n: string; c?: string; size?: number; x: number; y: number; rot?: number}> = ({n, c = YEL, size = 300, x, y, rot = -4}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg)`, fontFamily: LILITA, fontSize: size, lineHeight: 1, color: c, WebkitTextStroke: `${size * 0.09}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.05}px 0 ${INK}, 0 ${size * 0.09}px 0 ${INK}`}}>{n}</div>
);
const Stamp: React.FC<{t: string; x: number; y: number; c?: string; size?: number; rot?: number}> = ({t, x, y, c = '#E8394A', size = 64, rot = -8}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg)`, padding: `${size * 0.1}px ${size * 0.35}px`, border: `${size * 0.12}px solid ${c}`, borderRadius: size * 0.25, background: 'rgba(255,255,255,0.92)', boxShadow: `0 0 0 ${size * 0.05}px ${INK}`}}>
		<span style={{fontFamily: LILITA, fontSize: size, color: c, WebkitTextStroke: `${size * 0.05}px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{t}</span>
	</div>
);
const Base: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: '#2A72BA'}}><Fonts />{children}</AbsoluteFill>;

// ================================================================ V24 · camisetas
export const T24a: React.FC = () => (
	<Base>
		<Bg cam={WORLD_CAM} mood="scared" />
		<Vig />
		<div style={{position: 'absolute', left: 1020, top: 160}}><Wheel ang={-18} used={[]} hit={null} hitP={0} size={820} title="¿QUÉ COLOR?" /></div>
		<div style={{position: 'absolute', left: 40, top: 230, width: 980, height: 820}}><Glow c="#FF3B3B"><StickerX k="ESP" w={560} x={440} y={420} m="terror" look={[0.6, 0]} /></Glow></div>
		<J k="ESP" w={300} x={780} y={760} rot={12} x2 />
		<TT parts={[['TU SELECCIÓN'], ['DESAPARECE', RED]]} size={118} style={{top: 20, left: 0, right: 0}} />
		<TT parts={[['SI SU CAMISETA ES...', YEL]]} size={84} style={{top: 940, left: 0, right: 760}} />
	</Base>
);
export const T24b: React.FC = () => (
	<Base>
		<Bg cam={WORLD_CAM} blur={4} dark={0.35} />
		<Vig o={0.6} />
		{(['ESP', 'ARG', 'BRA', 'MEX', 'FRA', 'DEU'] as string[]).map((k, i) => <J key={k} k={k} w={300} x={250 + (i % 3) * 330 + (i >= 3 ? 160 : 0)} y={i < 3 ? 410 : 720} rot={((i * 37) % 13) - 6} x2={i % 2 === 0} />)}
		<QBadge x={1650} y={520} d={240} />
		<TT parts={[['TU SELECCIÓN'], ['DESAPARECE', RED], ['SI...']]} size={110} style={{top: 24}} />
		<TT parts={[['SU CAMISETA ES...', YEL]]} size={110} style={{top: 920}} />
	</Base>
);
export const T24c: React.FC = () => (
	<Base>
		<Bg cam={SA_CAM} dark={0.25} />
		<RightClip><Storm /></RightClip>
		<SplitBolt x={960} />
		<div style={{position: 'absolute', left: 0, top: 120, width: 960, height: 900}}><Glow c="#6CB4EE"><StickerX k="ARG" w={430} x={430} y={460} m="terror" look={[0.7, 0]} /></Glow></div>
		<J k="ARG" w={460} x={1440} y={560} rot={8} />
		<QBadge x={1720} y={300} d={170} />
		<TT parts={[['¿SOBREVIVE LA'], ['ALBICELESTE?', BLUE]]} size={112} style={{top: 20}} />
	</Base>
);
export const T24d: React.FC = () => (
	<Base>
		<Rays c1="#1F6FD1" c2="#1556A8" cx="50%" cy="55%" />
		{Object.keys(KIT).slice(0, 24).map((k, i) => <J key={k} k={k} w={150} x={130 + (i % 12) * 152} y={i < 12 ? 300 : 470} rot={((i * 41) % 15) - 7} x2={i !== 11} />)}
		<Big n="48" x={620} y={780} size={330} />
		<TT parts={[['CAMISETAS', '#fff']]} size={110} style={{top: 700, left: 900, right: 0}} />
		<TT parts={[['SOLO', '#fff'], ['1', YEL], ['SOBREVIVE', RED]]} size={96} style={{top: 840, left: 900, right: 0}} />
		<TT parts={[['¿CUÁL SOBREVIVE?']]} size={118} style={{top: 30}} />
	</Base>
);
export const T24e: React.FC = () => (
	<Base>
		<Bg cam={SA_CAM} mood="scared" />
		<Vig />
		<div style={{position: 'absolute', left: 0, top: 120, width: 1100, height: 960}}><Glow c="#FFD23F"><StickerX k="BRA" w={620} x={520} y={500} m="terror" look={[0.6, -0.1]} /></Glow></div>
		<J k="BRA" w={420} x={1450} y={560} rot={8} />
		<Stamp t="¡DESAPARECE!" x={1450} y={600} size={78} />
		<TT parts={[['¿Y SI TU CAMISETA'], ['ES AMARILLA?', YEL]]} size={104} style={{top: 24}} />
	</Base>
);

// ================================================================ V25 · campeonas Copa América
export const T25a: React.FC = () => (
	<Base>
		<Bg cam={SA_CAM} mood="happy" />
		<Vig />
		<Cup x={960} y={600} h={600} />
		<div style={{position: 'absolute', left: 0, top: 160, width: 760, height: 920}}><Glow c="#6CB4EE"><StickerX k="ARG" w={360} x={360} y={470} m="evil" look={[0.6, 0]} /></Glow></div>
		<div style={{position: 'absolute', left: 1180, top: 160, width: 740, height: 920}}><Glow c="#3A8DDE"><StickerX k="URY" w={420} x={360} y={470} m="rage" look={[-0.6, 0]} /></Glow></div>
		<TT parts={[['TODAS LAS CAMPEONAS']]} size={104} style={{top: 20}} />
		<TT parts={[['DE LA'], ['COPA AMÉRICA', YEL]]} size={110} style={{top: 920}} />
	</Base>
);
export const T25b: React.FC = () => (
	<Base>
		<Bg cam={SA_CAM} blur={5} dark={0.35} />
		<Vig o={0.6} />
		<Ball k="ARG" d={420} x={440} y={560} m="evil" look={[0.5, 0]} />
		<Ball k="URY" d={420} x={1480} y={560} m="rage" look={[-0.5, 0]} />
		<Big n="16" x={440} y={900} size={170} c={BLUE} />
		<Big n="15" x={1480} y={900} size={170} c={BLUE} />
		<VsX x={960} y={560} d={230} />
		<TT parts={[['¿QUIÉN TIENE MÁS'], ['COPAS?', YEL]]} size={110} style={{top: 30}} />
	</Base>
);
export const T25c: React.FC = () => (
	<Base>
		<Rays c1="#FFB800" c2="#FF7A00" cx="50%" cy="60%" />
		<Confetti seed={4} n={60} />
		{['ARG', 'URY', 'BRA', 'PER', 'PRY', 'CHL', 'COL', 'BOL'].map((k, i) => <Ball key={k} k={k} d={200} x={150 + i * 232} y={560 + (i % 2) * 60} m={i < 3 ? 'evil' : 'shock'} look={[0, 0]} />)}
		{[16, 15, 9, 2, 2, 2, 1, 1].map((n, i) => <Big key={i} n={String(n)} x={150 + i * 232} y={780 + (i % 2) * 60} size={110} />)}
		<TT parts={[['SOLO 8 HAN GANADO LA'], ['COPA AMÉRICA', YEL]]} size={96} style={{top: 40}} />
	</Base>
);
export const T25d: React.FC = () => (
	<Base>
		<Bg cam={SA_CAM} mood="sad" />
		<Vig />
		<div style={{position: 'absolute', left: 0, top: 160, width: 900, height: 900}}><Glow c="#FCD116"><StickerX k="COL" w={420} x={420} y={460} m="cry" look={[0.6, 0]} /></Glow></div>
		<div style={{position: 'absolute', left: 900, top: 160, width: 900, height: 900}}><Glow c="#2E9E4F"><StickerX k="BOL" w={420} x={460} y={460} m="cry" look={[-0.6, 0]} /></Glow></div>
		<StarX x={460} y={850} s={130} /><StarX x={1420} y={850} s={130} />
		<TT parts={[['¿SOLO'], ['1 COPA', RED], ['EN 108 AÑOS?']]} size={100} style={{top: 30}} />
	</Base>
);
export const T25e: React.FC = () => (
	<Base>
		<Rays c1="#1F6FD1" c2="#1556A8" cx="50%" cy="58%" n={28} />
		<Sparkles seed={7} n={22} />
		<Big n="48" x={600} y={560} size={460} />
		<Cup x={1360} y={560} h={560} rot={8} />
		<TT parts={[['COPAS AMÉRICA', YEL]]} size={120} style={{top: 860, left: 0, right: 760}} />
		<TT parts={[['¿QUIÉN GANÓ CADA UNA?']]} size={104} style={{top: 30}} />
	</Base>
);

// ================================================================ V26 · Perú nunca ha ganado
export const T26a: React.FC = () => (
	<Base>
		<Bg cam={WORLD_CAM} mood="smug" />
		<Vig />
		<div style={{position: 'absolute', left: 560, top: 160, width: 800, height: 900}}><Glow c="#FF3B3B"><StickerX k="PER" w={440} x={400} y={460} m="rage" look={[0, 0.1]} /></Glow></div>
		<QBadge x={330} y={520} d={150} /><QBadge x={1600} y={420} d={130} /><QBadge x={1560} y={720} d={110} />
		<TT parts={[['¿A QUIÉN NUNCA'], ['HA GANADO', RED]]} size={112} style={{top: 20}} />
		<TT parts={[['PERÚ?', YEL]]} size={150} style={{top: 900}} />
	</Base>
);
export const T26b: React.FC = () => (
	<Base>
		<Bg cam={{x: 1500, y: 800, z: 0.9}} blur={5} dark={0.35} />
		<Vig o={0.6} />
		<div style={{position: 'absolute', left: 0, top: 140, width: 960, height: 940}}><Glow c="#FF3B3B"><StickerX k="PER" w={460} x={440} y={470} m="terror" look={[0.6, 0]} /></Glow></div>
		<StickerX k="ESP" w={640} x={1460} y={600} m="evil" look={[-0.6, 0]} />
		<VsX x={960} y={600} d={220} />
		<TT parts={[['PERÚ NUNCA HA'], ['GANADO A', RED]]} size={104} style={{top: 20}} />
		<TT parts={[['ESPAÑA', YEL]]} size={140} style={{top: 920}} />
	</Base>
);
export const T26c: React.FC = () => (
	<Base>
		<Bg cam={EU_CAM} mood="smug" dark={0.3} />
		<Vig />
		<div style={{position: 'absolute', left: 0, top: 140, width: 900, height: 940}}><Glow c="#FF3B3B"><StickerX k="PER" w={420} x={420} y={470} m="cry" look={[0.6, 0]} /></Glow></div>
		<Big n="16" x={1360} y={520} size={420} c={RED} />
		<TT parts={[['SELECCIONES', '#fff']]} size={96} style={{top: 760, left: 900, right: 0}} />
		<TT parts={[['QUE PERÚ'], ['NUNCA HA GANADO', RED]]} size={96} style={{top: 30}} />
	</Base>
);
export const T26d: React.FC = () => (
	<Base>
		<Bg cam={SA_CAM} dark={0.25} />
		<RightClip><Storm /></RightClip>
		<SplitBolt x={960} />
		<div style={{position: 'absolute', left: 0, top: 140, width: 960, height: 940}}><Glow c="#FF3B3B"><StickerX k="PER" w={440} x={440} y={470} m="evil" look={[0.6, 0]} /></Glow></div>
		<Ball k="DEU" d={260} x={1300} y={420} m="evil" /><Ball k="NLD" d={240} x={1640} y={520} m="shock" /><Ball k="ITA" d={230} x={1420} y={760} m="evil" />
		<TT parts={[['¿LA LISTA NEGRA'], ['DE PERÚ?', RED]]} size={104} style={{top: 20}} />
	</Base>
);
export const T26e: React.FC = () => (
	<Base>
		<Bg cam={SA_CAM} mood="scared" />
		<Vig />
		<div style={{position: 'absolute', left: 0, top: 160, width: 900, height: 920}}><Glow c="#FF3B3B"><StickerX k="PER" w={420} x={420} y={470} m="evil" look={[0.6, 0]} /></Glow></div>
		<Ball k="BRA" d={240} x={1100} y={430} m="shock" /><Ball k="ARG" d={240} x={1420} y={560} m="terror" /><Ball k="CHL" d={220} x={1700} y={420} m="cry" />
		<Zap x={1260} y={760} s={170} rot={10} /><Zap x={1620} y={780} s={150} rot={-12} />
		<TT parts={[['TUMBÓ A BRASIL...'], ['PERO NO A ESTOS', RED]]} size={96} style={{top: 26}} />
	</Base>
);

// ================================================================ V27 · miedo a España
export const T27a: React.FC = () => (
	<Base>
		<Bg cam={WORLD_CAM} mood="panic" />
		<Vig />
		<div style={{position: 'absolute', left: 560, top: 180, width: 800, height: 880}}><Glow c="#FF3B3B" s={1.2}><StickerX k="ESP" w={620} x={400} y={430} m="evil" look={[0, 0.1]} /></Glow></div>
		<Ball k="ENG" d={190} x={300} y={420} m="terror" /><Ball k="FRA" d={180} x={1620} y={420} m="shock" /><Ball k="ITA" d={170} x={1600} y={760} m="terror" /><Ball k="PRT" d={170} x={330} y={760} m="cry" />
		<TT parts={[['¿QUÉ PAÍSES LE'], ['TIENEN MIEDO', RED]]} size={110} style={{top: 20}} />
		<TT parts={[['A ESPAÑA?', YEL]]} size={140} style={{top: 910}} />
	</Base>
);
export const T27b: React.FC = () => (
	<Base>
		<Bg cam={WORLD_CAM} blur={4} dark={0.35} />
		<Vig o={0.6} />
		<div style={{position: 'absolute', left: 0, top: 160, width: 900, height: 920}}><Glow c="#FF3B3B"><StickerX k="ESP" w={600} x={430} y={460} m="evil" look={[0.6, 0]} /></Glow></div>
		<Big n="50" x={1400} y={500} size={400} c={RED} />
		<TT parts={[['PAÍSES', '#fff']]} size={110} style={{top: 760, left: 900, right: 0}} />
		<TT parts={[['NUNCA HAN GANADO'], ['A ESPAÑA', YEL]]} size={104} style={{top: 30}} />
	</Base>
);
export const T27c: React.FC = () => (
	<Base>
		<Rays c1="#FFB800" c2="#FF7A00" cx="50%" cy="58%" />
		<Confetti seed={8} n={60} />
		<div style={{position: 'absolute', left: 560, top: 230, width: 800, height: 840}}><Glow c="#FFF3A0"><StickerX k="ESP" w={620} x={400} y={430} m="evil" look={[0, 0.1]} /></Glow></div>
		<Crown x={960} y={250} w={260} rot={6} />
		<Cup x={300} y={640} h={380} rot={-10} /><Cup x={1620} y={640} h={380} rot={10} />
		<TT parts={[['LA CAMPEONA DEL MUNDO']]} size={96} style={{top: 20}} />
		<TT parts={[['¿QUIÉN LE TEME?', YEL]]} size={120} style={{top: 920}} />
	</Base>
);
export const T27d: React.FC = () => (
	<Base>
		<Bg cam={EU_CAM} blur={5} dark={0.35} />
		<Vig o={0.6} />
		<StickerX k="ESP" w={640} x={470} y={600} m="shock" look={[0.6, 0]} />
		<StickerX k="ENG" w={460} x={1470} y={600} m="evil" look={[-0.6, 0]} />
		<VsX x={960} y={600} d={220} />
		<TT parts={[['EL QUE'], ['NO LE TEME', RED]]} size={110} style={{top: 20}} />
		<TT parts={[['A ESPAÑA', YEL]]} size={130} style={{top: 920}} />
	</Base>
);
export const T27e: React.FC = () => (
	<Base>
		<Bg cam={EU_CAM} dark={0.25} mood="panic" />
		<RightClip><Storm /></RightClip>
		<SplitBolt x={960} />
		<Ball k="DEU" d={230} x={250} y={420} m="terror" /><Ball k="ITA" d={220} x={560} y={600} m="shock" /><Ball k="PRT" d={220} x={260} y={780} m="cry" />
		<div style={{position: 'absolute', left: 960, top: 120, width: 960, height: 960}}><Glow c="#B46BFF"><StickerX k="ESP" w={640} x={480} y={480} m="rage" look={[-0.6, 0]} /></Glow></div>
		<TT parts={[['¿PÁNICO'], ['A ESPAÑA?', RED]]} size={120} style={{top: 20}} />
	</Base>
);

// ================================================================ V28 · España en la Copa América
export const T28a: React.FC = () => (
	<Base>
		<Bg cam={{x: 1300, y: 900, z: 0.7}} mood="scared" />
		<Vig />
		<div style={{position: 'absolute', left: 0, top: 140, width: 1000, height: 940}}><Glow c="#FF3B3B"><StickerX k="ESP" w={600} x={480} y={460} m="evil" look={[0.6, 0]} /></Glow></div>
		<Arrow x={1050} y={560} w={300} rot={-10} />
		<Cup x={1480} y={600} h={500} rot={8} />
		<QBadge x={1720} y={330} d={150} />
		<TT parts={[['¿Y SI ESPAÑA JUGARA'], ['LA COPA', YEL]]} size={100} style={{top: 20}} />
		<TT parts={[['AMÉRICA?', YEL]]} size={140} style={{top: 920}} />
	</Base>
);
export const T28b: React.FC = () => (
	<Base>
		<Bg cam={{x: 1300, y: 900, z: 0.7}} blur={5} dark={0.35} />
		<Vig o={0.6} />
		<div style={{position: 'absolute', left: 0, top: 140, width: 960, height: 940}}><Glow c="#FF3B3B"><StickerX k="ESP" w={600} x={470} y={470} m="rage" look={[0.6, 0]} /></Glow></div>
		<div style={{position: 'absolute', left: 960, top: 140, width: 960, height: 940}}><Glow c="#6CB4EE"><StickerX k="ARG" w={380} x={500} y={470} m="rage" look={[-0.6, 0]} /></Glow></div>
		<VsX x={960} y={600} d={220} />
		<TT parts={[['LA REVANCHA', RED]]} size={130} style={{top: 20}} />
		<TT parts={[['¿EN LA COPA AMÉRICA?', YEL]]} size={100} style={{top: 930}} />
	</Base>
);
export const T28c: React.FC = () => (
	<Base>
		<Rays c1="#FFB800" c2="#FF7A00" cx="50%" cy="58%" />
		<Confetti seed={11} n={60} />
		<div style={{position: 'absolute', left: 560, top: 230, width: 800, height: 840}}><Glow c="#FFF3A0"><StickerX k="ESP" w={620} x={400} y={430} m="evil" look={[0, 0.1]} /></Glow></div>
		<Crown x={960} y={250} w={260} rot={6} />
		<Ball k="ARG" d={220} x={250} y={600} m="cry" /><Ball k="BRA" d={210} x={1680} y={560} m="terror" /><Ball k="MEX" d={200} x={330} y={860} m="shock" /><Ball k="URY" d={200} x={1600} y={860} m="cry" />
		<TT parts={[['¿CAMPEONA'], ['DE AMÉRICA?', YEL]]} size={110} style={{top: 20}} />
	</Base>
);
export const T28d: React.FC = () => (
	<Base>
		<Bg cam={{x: 1300, y: 900, z: 0.7}} dark={0.25} />
		<RightClip><Storm /></RightClip>
		<SplitBolt x={960} />
		<Ball k="ARG" d={220} x={240} y={420} m="evil" /><Ball k="BRA" d={210} x={560} y={520} m="evil" /><Ball k="URY" d={200} x={260} y={760} m="rage" /><Ball k="MEX" d={200} x={600} y={820} m="rage" />
		<div style={{position: 'absolute', left: 960, top: 140, width: 960, height: 940}}><Glow c="#FF3B3B"><StickerX k="ESP" w={600} x={480} y={470} m="terror" look={[-0.6, 0]} /></Glow></div>
		<TT parts={[['ESPAÑA CONTRA'], ['TODA AMÉRICA', YEL]]} size={104} style={{top: 20}} />
	</Base>
);
export const T28e: React.FC = () => (
	<Base>
		<Bg cam={{x: 1500, y: 900, z: 0.62}} mood="scared" />
		<Vig />
		<Ball k="ESP" d={330} x={1560} y={360} m="evil" />
		<Arrow x={1100} y={560} w={420} rot={160} />
		<Ball k="ARG" d={230} x={500} y={700} m="terror" /><Ball k="BRA" d={220} x={780} y={560} m="shock" /><Ball k="MEX" d={200} x={360} y={420} m="cry" />
		<TT parts={[['RUMBO A'], ['AMÉRICA', YEL]]} size={120} style={{top: 20}} />
		<TT parts={[['¿QUIÉN LA PARA?', RED]]} size={110} style={{top: 920}} />
	</Base>
);

// ---- Perú v2: sin interrogantes, Perú centrado y más grande, borde de letras más fino
const PeruV: React.FC<{w: number; m: XM; glow: string; cam?: {x: number; y: number; z: number}; mood?: any; cy?: number; look?: [number, number]}> = ({w, m, glow, cam = WORLD_CAM, mood = 'smug', cy = 560, look = [0, 0.1]}) => (
	<Base>
		<Bg cam={cam} mood={mood} />
		<Vig />
		<div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}}><Glow c={glow}><StickerX k="PER" w={w} x={960} y={cy} m={m} look={look} /></Glow></div>
		<TT parts={[['¿A QUIÉN NUNCA'], ['HA GANADO', RED]]} size={112} sw={0.1} style={{top: 20}} />
		<TT parts={[['PERÚ?', YEL]]} size={150} sw={0.1} style={{top: 900}} />
	</Base>
);
export const T26f: React.FC = () => <PeruV w={540} m="rage" glow="#FF3B3B" />;
export const T26g: React.FC = () => <PeruV w={600} m="rage" glow="#FF3B3B" cy={540} />;
export const T26h: React.FC = () => <PeruV w={540} m="evil" glow="#FFD23F" />;
export const T26i: React.FC = () => <PeruV w={540} m="terror" glow="#FF3B3B" mood="panic" />;
export const T26j: React.FC = () => <PeruV w={540} m="rage" glow="#FFFFFF" cy={545} cam={{x: 1500, y: 860, z: 0.85}} />;

// ---- España pánico v2: España más grande, borde de letras más fino
const PanicV: React.FC<{w: number; m: XM; glow: string; cx?: number; cy?: number}> = ({w, m, glow, cx = 1440, cy = 590}) => (
	<Base>
		<Bg cam={EU_CAM} dark={0.25} mood="panic" />
		<RightClip><Storm /></RightClip>
		<SplitBolt x={960} />
		<Ball k="DEU" d={230} x={250} y={420} m="terror" /><Ball k="ITA" d={220} x={560} y={600} m="shock" /><Ball k="PRT" d={220} x={260} y={780} m="cry" />
		<div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}}><Glow c={glow}><StickerX k="ESP" w={w} x={cx} y={cy} m={m} look={[-0.6, 0]} /></Glow></div>
		<TT parts={[['¿PÁNICO'], ['A ESPAÑA?', RED]]} size={120} sw={0.1} style={{top: 20}} />
	</Base>
);
export const T27f: React.FC = () => <PanicV w={760} m="rage" glow="#B46BFF" />;
export const T27g: React.FC = () => <PanicV w={840} m="rage" glow="#B46BFF" cx={1430} cy={600} />;
export const T27h: React.FC = () => <PanicV w={780} m="evil" glow="#FF3B3B" />;
export const T27i: React.FC = () => <PanicV w={780} m="rage" glow="#FF3B3B" />;
export const T27j: React.FC = () => <PanicV w={800} m="evil" glow="#B46BFF" />;

// ---- serie "¿A quién nunca ha ganado X?" (idéntica a Perú / España / México)
const NuncaV: React.FC<{k: string; up: string; w: number; m: XM; glow: string; cam?: {x: number; y: number; z: number}; mood?: any; cy?: number; look?: [number, number]; alt?: boolean}> = ({k, up, w, m, glow, cam = WORLD_CAM, mood = 'smug', cy = 560, look = [0, 0.1], alt}) => (
	<Base>
		<Bg cam={cam} mood={mood} />
		<Vig />
		<div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}}><Glow c={glow}><StickerX k={k} w={w} x={960} y={cy} m={m} look={look} /></Glow></div>
		{alt ? <>
			<TT parts={[[`PAÍSES QUE ${up}`]]} size={112} sw={0.1} style={{top: 20}} />
			<TT parts={[['NUNCA HA GANADO', RED]]} size={130} sw={0.1} style={{top: 910}} />
		</> : <>
			<TT parts={[['¿A QUIÉN NUNCA'], ['HA GANADO', RED]]} size={112} sw={0.1} style={{top: 20}} />
			<TT parts={[[`${up}?`, YEL]]} size={150} sw={0.1} style={{top: 900}} />
		</>}
	</Base>
);
export const T29f: React.FC = () => <NuncaV k="COL" up="COLOMBIA" w={560} m="rage" glow="#FF3B3B" />;
export const T29g: React.FC = () => <NuncaV k="COL" up="COLOMBIA" w={620} m="rage" glow="#FF3B3B" cy={545} />;
export const T29h: React.FC = () => <NuncaV k="COL" up="COLOMBIA" w={560} m="evil" glow="#FFD23F" />;
export const T29i: React.FC = () => <NuncaV k="COL" up="COLOMBIA" w={580} m="rage" glow="#FF3B3B" alt cy={555} />;
export const T29j: React.FC = () => <NuncaV k="COL" up="COLOMBIA" w={560} m="terror" glow="#FF3B3B" mood="panic" />;
