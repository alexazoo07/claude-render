import React, {useId} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Atlas21, Face12, FaceMood, FaceSpec, Fill, FlagFill, INK, REL} from './Atlas21';
import {ALL, FL} from './data21';
import {Wheel} from './Video21';

// ---------- shared pieces ----------
export const YEL = '#FFD23F', RED = '#FF3B3B';
export const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#FFFFFF', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 0.98, color, WebkitTextStroke: `${size * 0.08}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.07}px 0 ${INK}`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
export const Line: React.FC<{parts: [string, string?][]; size: number; style?: React.CSSProperties}> = ({parts, size, style}) => (
	<div style={{display: 'flex', justifyContent: 'center', gap: size * 0.22, ...style}}>{parts.map(([t, c], i) => <Txt key={i} size={size} color={c ?? '#fff'}>{t}</Txt>)}</div>
);
const wide = (k: string) => { const b = WORLD[k].b; return b[1][0] - b[0][0] > 22 && b[1][1] - b[0][1] > 14; };
export const Map: React.FC<{cam: {x: number; y: number; z: number}; grey?: (k: string) => boolean; mood?: FaceMood; dark?: number; faces?: boolean; big?: string[]}> = ({cam, grey = () => false, mood = 'worried', dark = 0.25, faces = true, big = []}) => {
	const fills: Record<string, Fill> = {}, fc: Record<string, FaceSpec> = {};
	for (const k of ALL) {
		if (!WORLD[k]) continue;
		if (grey(k)) { fills[k] = {color: '#5B616D'}; continue; }
		fills[k] = {flag: FL[k]};
		if (big.includes(k)) fc[k] = {mood, size: 1.6, max: 150};
		else if (faces && wide(k)) fc[k] = {mood, size: 0.8, max: 70};
	}
	return <><FlagPreload flags={ALL.map((k) => FL[k])} /><Atlas21 cam={cam} fills={fills} faces={fc} dark={dark} /></>;
};
// main polygon box of a country (ignores far islands)
export const mainBox = (k: string) => {
	const W = WORLD[k];
	const bs = W.pb && W.pb.length ? W.pb : [[W.b[0][0], W.b[0][1], W.b[1][0], W.b[1][1]]];
	return bs.reduce((a, b) => ((b[2] - b[0]) * (b[3] - b[1]) > (a[2] - a[0]) * (a[3] - a[1]) ? b : a));
};
// a single country cut out as a thick white-edged sticker with a big face
const Sticker: React.FC<{k: string; w: number; x: number; y: number; mood: FaceMood; rot?: number; grey?: boolean; face?: number; fdx?: number; fdy?: number; look?: [number, number]}> = ({k, w, x, y, mood, rot = 0, grey, face = 0.62, fdx = 0, fdy = 0, look}) => {
	const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
	const [x0, y0, x1, y1] = mainBox(k);
	const bw = x1 - x0, bh = y1 - y0, pad = Math.max(bw, bh) * 0.08;
	const h = (w * (bh + pad * 2)) / (bw + pad * 2);
	const sc = (bw + pad * 2) / w; // world units per px
	const fs = Math.min(bw, bh) * face;
	const cx = (x0 + x1) / 2 + fdx * bw, cy = (y0 + y1) / 2 + fdy * bh;
	return (
		<svg width={w} height={h} viewBox={`${x0 - pad} ${y0 - pad} ${bw + pad * 2} ${bh + pad * 2}`} style={{position: 'absolute', left: x - w / 2, top: y - h / 2, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
			<defs><clipPath id={`s${uid}`}><path d={WORLD[k].d} /></clipPath></defs>
			<path d={WORLD[k].d} fill="#000" opacity={0.45} transform={`translate(${6 * sc} ${16 * sc})`} stroke="#000" strokeWidth={26 * sc} strokeLinejoin="round" />
			<path d={WORLD[k].d} fill="#fff" stroke="#fff" strokeWidth={26 * sc} strokeLinejoin="round" />
			<path d={WORLD[k].d} fill="none" stroke={INK} strokeWidth={30 * sc} strokeLinejoin="round" style={{opacity: 0}} />
			{grey ? <path d={WORLD[k].d} fill="#7A7F88" /> : <FlagFill k={k} flag={FL[k]} clip={`s${uid}`} />}
			<image href={staticFile('tex/relief.jpg')} x={REL.x} y={REL.y} width={REL.w} height={REL.h} preserveAspectRatio="none" clipPath={`url(#s${uid})`} style={{mixBlendMode: 'multiply'}} opacity={0.8} />
			<path d={WORLD[k].d} fill="none" stroke={INK} strokeWidth={5 * sc} strokeLinejoin="round" />
			<g transform={`translate(${cx} ${cy}) scale(${fs / 200}) translate(-100 -100)`}><Face12 mood={mood} look={look} /></g>
		</svg>
	);
};
// country-ball
const Ball: React.FC<{f: string; d: number; x: number; y: number; mood: FaceMood; look?: [number, number]; grey?: boolean}> = ({f, d, x, y, mood, look, grey}) => (
	<div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d}}>
		<div style={{position: 'absolute', inset: 0, borderRadius: '50%', transform: `translate(${d * 0.02}px, ${d * 0.05}px)`, background: 'rgba(0,0,0,0.45)'}} />
		<div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', border: `${Math.max(5, d * 0.025)}px solid ${INK}`, background: '#888'}}>
			<img src={staticFile(`flags/${f}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: grey ? 'grayscale(1) brightness(0.8)' : undefined}} />
			<div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), rgba(255,255,255,0) 35%), radial-gradient(circle at 60% 70%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)'}} />
		</div>
		<svg width={d * 0.7} height={d * 0.7} viewBox="0 0 200 200" style={{position: 'absolute', left: d * 0.15, top: d * 0.16}}><Face12 mood={mood} look={look} /></svg>
	</div>
);
// flag card with face; melt = part of the flag drained to grey from the top
const FlagCard: React.FC<{f: string; w: number; mood: FaceMood; melt?: number; x?: number; y?: number}> = ({f, w, mood, melt = 0}) => {
	const h = w * 0.68;
	const drips = [0.12, 0.3, 0.5, 0.68, 0.86];
	return (
		<div style={{position: 'relative', width: w, height: h}}>
			<div style={{position: 'absolute', inset: 0, transform: `translate(6px, 12px)`, borderRadius: 14, background: 'rgba(0,0,0,0.45)'}} />
			<div style={{position: 'absolute', inset: 0, borderRadius: 14, overflow: 'hidden', border: `7px solid #fff`, boxShadow: `0 0 0 5px ${INK}`}}>
				<img src={staticFile(`flags/${f}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				{melt > 0 && (
					<svg width="100%" height="100%" viewBox="0 0 100 68" preserveAspectRatio="none" style={{position: 'absolute', inset: 0}}>
						<path d={`M0 0 H100 V${68 * melt} ${drips.map((p, i) => `L${p * 100 + 6} ${68 * melt} Q${p * 100 + 3} ${68 * melt + 9 + (i % 2) * 7} ${p * 100} ${68 * melt}`).reverse().join(' ')} L0 ${68 * melt} Z`} fill="#8C929B" />
					</svg>
				)}
			</div>
			<svg width={w * 0.76} height={w * 0.76} viewBox="0 0 200 200" style={{position: 'absolute', left: w * 0.12, top: h * 0.5 - w * 0.38}}><Face12 mood={mood} /></svg>
		</div>
	);
};
// dark cracked lava background
export const Lava: React.FC<{w?: number; h?: number; seed?: number}> = ({w = 1920, h = 1080, seed = 3}) => (
	<svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
		<defs>
			<filter id={`lv${seed}`} x="0" y="0" width="100%" height="100%">
				<feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={4} seed={seed} />
				<feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 1 1 0 -1.25" />
				<feComponentTransfer><feFuncA type="table" tableValues="0 0 1 0 0" /></feComponentTransfer>
				<feComposite in2="SourceGraphic" operator="in" />
			</filter>
			<radialGradient id="lvbg" cx="50%" cy="55%" r="70%"><stop offset="0%" stopColor="#5A1A0E" /><stop offset="60%" stopColor="#2A0B08" /><stop offset="100%" stopColor="#120404" /></radialGradient>
			<linearGradient id="fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#FF4D00" stopOpacity={0.85} /><stop offset="45%" stopColor="#FF8A00" stopOpacity={0.25} /><stop offset="100%" stopColor="#FF8A00" stopOpacity={0} /></linearGradient>
		</defs>
		<rect width={w} height={h} fill="url(#lvbg)" />
		<rect width={w} height={h} fill="#FFB22C" filter={`url(#lv${seed})`} opacity={0.9} />
		<rect y={h * 0.55} width={w} height={h * 0.45} fill="url(#fire)" />
	</svg>
);
export const Bolt: React.FC<{x: number}> = ({x}) => {
	const p = `M${x + 70} 0 L${x - 10} 420 L${x + 60} 430 L${x - 60} 1080 L${x - 120} 1080 L${x - 30} 520 L${x - 100} 510 L${x - 10} 0 Z`;
	return <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><path d={p} fill="#fff" stroke={INK} strokeWidth={10} strokeLinejoin="round" /></svg>;
};
const Mystery: React.FC<{x: number; y: number; d: number}> = ({x, y, d}) => (
	<div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d}}>
		<svg width={d} height={d} viewBox="-110 -110 220 220">
			<path d="M-70 -80 C-20 -110 40 -100 80 -60 C110 -20 100 50 60 85 C20 110 -50 105 -85 60 C-110 20 -105 -50 -70 -80 Z" fill="#1B1D24" stroke="#fff" strokeWidth={9} />
			<path d="M-70 -80 C-20 -110 40 -100 80 -60 C110 -20 100 50 60 85 C20 110 -50 105 -85 60 C-110 20 -105 -50 -70 -80 Z" fill="none" stroke={INK} strokeWidth={3} />
		</svg>
		<svg width={d * 0.55} height={d * 0.55} viewBox="0 0 200 200" style={{position: 'absolute', left: d * 0.22, top: d * 0.12}}><Face12 mood="smug" /></svg>
		<Txt size={d * 0.42} color={YEL} style={{position: 'absolute', right: -d * 0.12, bottom: -d * 0.05}}>?</Txt>
	</div>
);
const Stamp: React.FC<{text: string; x: number; y: number; size: number; rot?: number; col?: string}> = ({text, x, y, size, rot = -12, col = RED}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, padding: `${size * 0.08}px ${size * 0.3}px`, border: `${size * 0.1}px solid ${col}`, borderRadius: size * 0.18, background: 'rgba(255,255,255,0.92)', boxShadow: `0 0 0 ${size * 0.05}px ${INK}`}}>
		<div style={{fontFamily: LILITA, fontSize: size, color: col, lineHeight: 1}}>{text}</div>
	</div>
);
export const Pill: React.FC<{children: React.ReactNode; x: number; y: number; size: number; bg?: string; col?: string; rot?: number}> = ({children, x, y, size, bg = YEL, col = INK, rot = 0}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, padding: `${size * 0.12}px ${size * 0.4}px`, background: bg, border: `${size * 0.09}px solid ${INK}`, borderRadius: size, boxShadow: `0 ${size * 0.1}px 0 ${INK}`}}>
		<div style={{fontFamily: LILITA, fontSize: size, color: col, lineHeight: 1, whiteSpace: 'nowrap'}}>{children}</div>
	</div>
);
export const Sweat: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<svg width={s} height={s * 1.4} viewBox="0 0 40 56" style={{position: 'absolute', left: x, top: y}}><path d="M20 2 C26 16 36 26 36 38 A16 16 0 0 1 4 38 C4 26 14 16 20 2 Z" fill="#7FD3FF" stroke={INK} strokeWidth={4} /></svg>
);
export const Vs: React.FC<{x: number; y: number; d: number}> = ({x, y, d}) => (
	<div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: '#E63946', border: `${d * 0.07}px solid #fff`, boxShadow: `0 0 0 ${d * 0.04}px ${INK}, 0 ${d * 0.08}px 0 ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
		<Txt size={d * 0.45}>VS</Txt>
	</div>
);

// ---------- 10 new thumbnails ----------
// F: split screen, Spain on the map vs mystery blob in lava
export const T21f: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1830, y: 500, z: 2.4}} dark={0.2} />
		<div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, overflow: 'hidden', clipPath: 'polygon(70px 0, 100% 0, 100% 100%, -60px 100%, 30px 520px, -40px 510px)'}}><div style={{position: 'absolute', left: -960, top: 0}}><Lava seed={5} /></div></div>
		<Bolt x={960} />
		<Sticker k="ESP" w={720} x={480} y={600} mood="panic" look={[0.6, 0]} />
		<Mystery x={1440} y={620} d={560} />
		<Line parts={[['¿QUIÉN'], ['SOBREVIVE?', YEL]]} size={140} style={{position: 'absolute', top: 30, left: 0, right: 0}} />
	</AbsoluteFill>
);
// G: grid of flags draining to grey
const GRID: [string, FaceMood, number][] = [['es', 'panic', 0.55], ['ar', 'scared', 0.35], ['br', 'worried', 0.2], ['mx', 'scared', 0.7], ['de', 'panic', 0.45], ['uy', 'worried', 0.1]];
export const T21g: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1900, y: 800, z: 0.55}} faces={false} dark={0.45} />
		<Line parts={[['¿CUÁL'], ['AGUANTA?', YEL]]} size={150} style={{position: 'absolute', top: 30, left: 0, right: 0}} />
		<div style={{position: 'absolute', left: 120, right: 120, top: 250, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: 50, justifyItems: 'center'}}>
			{GRID.map(([f, m, melt]) => <FlagCard key={f} f={f} w={430} mood={m} melt={melt} />)}
		</div>
	</AbsoluteFill>
);
// H: VS duel
export const T21h: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1500, y: 900, z: 0.75}} faces={false} dark={0.3} />
		<Sticker k="ESP" w={620} x={460} y={560} mood="angry" look={[0.8, 0]} />
		<Sticker k="BRA" w={560} x={1450} y={580} mood="angry" look={[-0.8, 0]} />
		<Vs x={960} y={560} d={230} />
		<Line parts={[['¿QUIÉN'], ['DESAPARECE', RED]]} size={130} style={{position: 'absolute', top: 30, left: 0, right: 0}} />
		<Line parts={[['PRIMERO?', YEL]]} size={150} style={{position: 'absolute', bottom: 40, left: 0, right: 0}} />
	</AbsoluteFill>
);
// I: giant Spain ball over Europe map
export const T21i: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1900, y: 470, z: 1.9}} mood="scared" dark={0.15} />
		<Ball f="es" d={720} x={1450} y={640} mood="panic" />
		<Sweat x={1700} y={230} s={90} />
		<Sweat x={1110} y={330} s={70} />
		<div style={{position: 'absolute', left: 50, top: 50}}><Txt size={170}>¿ESPAÑA</Txt><Txt size={140} color={RED}>DESAPARECE?!</Txt></div>
	</AbsoluteFill>
);
// J: only the 8 champions keep their colour
const CH = ['BRA', 'ARG', 'URY', 'DEU', 'ITA', 'FRA', 'ENG', 'ESP'];
export const T21j: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1900, y: 800, z: 0.55}} grey={() => true} faces={false} dark={0.15} />
		{['br', 'ar', 'uy', 'de', 'it', 'fr', 'gb-eng', 'es'].map((f, i) => <Ball key={f} f={f} d={215} x={150 + i * 231} y={i % 2 ? 610 : 510} mood={(['panic', 'scared', 'worried', 'shock'] as FaceMood[])[i % 4]} />)}
		<Pill x={960} y={110} size={120} bg={YEL}>211 SELECCIONES</Pill>
		<Line parts={[['SOLO QUEDA'], ['1', RED]]} size={170} style={{position: 'absolute', bottom: 40, left: 0, right: 0}} />
	</AbsoluteFill>
);
// K: Argentina half turned to grey
export const T21k: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Lava seed={9} />
		<Sticker k="ARG" w={430} x={600} y={600} mood="panic" rot={-6} />
		<div style={{position: 'absolute', left: 0, top: 0, width: 600, height: 1080, overflow: 'hidden'}}><Sticker k="ARG" w={430} x={600} y={600} mood="panic" rot={-6} grey /></div>
		<div style={{position: 'absolute', right: 60, top: 170, textAlign: 'right'}}><Txt size={150}>¿Y SI</Txt><Txt size={170} color="#6CC4FF">ARGENTINA</Txt><Txt size={150} color={RED}>DESAPARECE?</Txt></div>
		<Pill x={1450} y={900} size={70} bg="#fff">EL MAPA DECIDE</Pill>
	</AbsoluteFill>
);
// L: big wheel with balls around
export const T21l: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1900, y: 800, z: 0.55}} faces={false} dark={0.35} />
		<div style={{position: 'absolute', left: 960 - 330, top: 170}}><Wheel ang={-10} used={[]} hit={null} hitP={0} size={660} title="LA RULETA" /></div>
		<Ball f="es" d={260} x={270} y={420} mood="panic" look={[1, 0]} />
		<Ball f="ar" d={240} x={300} y={800} mood="scared" look={[1, -0.3]} />
		<Ball f="br" d={250} x={1650} y={420} mood="scared" look={[-1, 0]} />
		<Ball f="mx" d={230} x={1620} y={800} mood="panic" look={[-1, -0.3]} />
		<Line parts={[['GIRA'], ['Y DESAPARECE', RED]]} size={120} style={{position: 'absolute', top: 30, left: 0, right: 0}} />
	</AbsoluteFill>
);
// M: crowd of balls, 211 → 1
const CROWD = ['br', 'ar', 'es', 'de', 'fr', 'it', 'gb-eng', 'uy', 'mx', 'co', 'pt', 'nl', 'us', 'jp', 'ma', 'cl', 'be', 'hr', 'sn', 'kr'];
export const T21m: React.FC = () => (
	<AbsoluteFill style={{background: '#1F5F9E'}}><Fonts />
		<Map cam={{x: 1900, y: 800, z: 0.55}} faces={false} dark={0.5} />
		{CROWD.map((f, i) => {
			const row = Math.floor(i / 10), col = i % 10;
			return <Ball key={f} f={f} d={200} x={130 + col * 178 + row * 89} y={700 + row * 190} mood={(['scared', 'panic', 'worried', 'shock'] as FaceMood[])[i % 4]} grey={i % 3 === 1} />;
		})}
		<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 50}}>
			<Txt size={260}>211</Txt><Txt size={200} color={YEL}>→</Txt><Txt size={260} color={RED}>1</Txt>
		</div>
		<Pill x={960} y={360} size={70} bg="#fff">¿CUÁL QUEDA?</Pill>
	</AbsoluteFill>
);
// N: Mexico stamped ELIMINADA
export const T21n: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 900, y: 700, z: 1.5}} mood="shock" dark={0.2} />
		<Sticker k="MEX" w={900} x={720} y={600} mood="sad" />
		<Stamp text="ELIMINADA" x={760} y={760} size={120} rot={-14} />
		<div style={{position: 'absolute', right: 50, top: 60, textAlign: 'right'}}><Txt size={130}>TU</Txt><Txt size={130}>SELECCIÓN</Txt><Txt size={150} color={RED}>FUERA</Txt><Txt size={150} color={YEL}>SI...</Txt></div>
	</AbsoluteFill>
);
// O: three stickers falling into lava
export const T21o: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Lava seed={2} />
		<Sticker k="BRA" w={560} x={360} y={660} mood="panic" rot={-14} />
		<Sticker k="ESP" w={600} x={960} y={740} mood="scared" rot={8} />
		<Sticker k="ITA" w={470} x={1580} y={650} mood="panic" rot={16} />
		<Line parts={[['¿QUIÉN'], ['CAE', RED], ['ANTES?', YEL]]} size={150} style={{position: 'absolute', top: 40, left: 0, right: 0}} />
	</AbsoluteFill>
);
export const T21_NEW = [T21f, T21g, T21h, T21i, T21j, T21k, T21l, T21m, T21n, T21o];
