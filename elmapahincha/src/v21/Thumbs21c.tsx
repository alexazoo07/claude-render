import React, {useId} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagFill, INK, REL} from './Atlas21';
import {FL} from './data21';
import {Bolt, Lava, Line, mainBox, Map, RED, YEL} from './Thumbs21b';

// ---------------------------------------------------------------------------
// Detailed expressive face (200x200 box): bloodshot eyes, teeth, tears, steam
// ---------------------------------------------------------------------------
export type XM = 'terror' | 'rage' | 'evil' | 'cry' | 'shock';
const uidOf = () => useId().replace(/[^a-zA-Z0-9]/g, '');
const VEINS = [[200, 1], [230, 0.8], [260, 1], [300, 0.7], [330, 1], [20, 0.8], [60, 0.9], [110, 0.7], [150, 0.9], [175, 0.8]];
const Eye: React.FC<{cx: number; cy: number; rx: number; ry: number; m: XM; side: number; look: [number, number]; u: string}> = ({cx, cy, rx, ry, m, side, look, u}) => {
	const id = `${u}e${side}`;
	// angled lid for rage / evil
	const lid = m === 'rage' ? 0.42 : m === 'evil' ? 0.5 : 0;
	const tilt = m === 'rage' ? 0.55 * side : m === 'evil' ? -0.15 * side : 0;
	const yl = cy - ry + ry * 2 * lid;
	const clip = lid ? `M${cx - rx - 10} ${yl - tilt * (rx + 10)} L${cx + rx + 10} ${yl + tilt * (rx + 10)} L${cx + rx + 10} ${cy + ry + 10} L${cx - rx - 10} ${cy + ry + 10} Z` : `M${cx - rx - 10} ${cy - ry - 10} H${cx + rx + 10} V${cy + ry + 10} H${cx - rx - 10} Z`;
	const pr = m === 'terror' ? 5.5 : m === 'shock' ? 7 : m === 'rage' ? 7 : m === 'cry' ? 13 : 10;
	const ir = m === 'terror' ? 10 : m === 'shock' ? 12 : m === 'rage' ? 12 : m === 'cry' ? 20 : 15;
	const irisCol = m === 'rage' ? '#C1121F' : m === 'evil' ? '#F2B705' : '#5A3A22';
	const px = cx + look[0] * rx * 0.35, py = cy + look[1] * ry * 0.3 + (lid ? ry * 0.25 : 0);
	const veins = m === 'cry' ? [] : VEINS;
	return (
		<g>
			<defs>
				<clipPath id={`c${id}`}><path d={clip} /></clipPath>
				<clipPath id={`w${id}`}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} /></clipPath>
				<radialGradient id={`g${id}`} cx="50%" cy="45%" r="60%"><stop offset="55%" stopColor="#FFFFFF" /><stop offset="100%" stopColor={m === 'cry' ? '#DDEBFF' : '#FFC4C4'} /></radialGradient>
				<radialGradient id={`i${id}`} cx="40%" cy="35%" r="65%"><stop offset="0%" stopColor="#fff" stopOpacity={0.5} /><stop offset="35%" stopColor={irisCol} /><stop offset="100%" stopColor="#1A0A04" /></radialGradient>
			</defs>
			<g clipPath={`url(#c${id})`}>
				<ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#g${id})`} />
				<g clipPath={`url(#w${id})`} stroke="#D62828" fill="none" strokeLinecap="round">
					{veins.map(([a, l], i) => {
						const r = (a * Math.PI) / 180, ex = cx + Math.cos(r) * rx, ey = cy + Math.sin(r) * ry;
						const L = 0.42 * l, mx = cx + Math.cos(r + 0.25) * rx * (1 - L * 0.5), my = cy + Math.sin(r + 0.25) * ry * (1 - L * 0.5);
						const tx = cx + Math.cos(r - 0.1) * rx * (1 - L), ty = cy + Math.sin(r - 0.1) * ry * (1 - L);
						const bx = cx + Math.cos(r + 0.35) * rx * (1 - L * 0.8), by = cy + Math.sin(r + 0.35) * ry * (1 - L * 0.8);
						return <g key={i}><path d={`M${ex} ${ey} Q${mx} ${my} ${tx} ${ty}`} strokeWidth={1.8} /><path d={`M${mx} ${my} L${bx} ${by}`} strokeWidth={1.1} /></g>;
					})}
				</g>
				{m === 'cry' && <ellipse cx={cx} cy={cy + ry * 0.55} rx={rx * 0.95} ry={ry * 0.4} fill="#7FC8FF" opacity={0.55} clipPath={`url(#w${id})`} />}
				<circle cx={px} cy={py} r={ir} fill={`url(#i${id})`} stroke={INK} strokeWidth={1.5} />
				<circle cx={px} cy={py} r={pr} fill="#0B0B0E" />
				<circle cx={px - ir * 0.35} cy={py - ir * 0.4} r={Math.max(2.6, ir * 0.3)} fill="#fff" />
				<circle cx={px + ir * 0.35} cy={py + ir * 0.3} r={Math.max(1.4, ir * 0.13)} fill="#fff" />
			</g>
			{lid ? <path d={`M${cx - rx - 2} ${yl - tilt * (rx + 2)} L${cx + rx + 2} ${yl + tilt * (rx + 2)}`} stroke={INK} strokeWidth={6} strokeLinecap="round" /> : null}
			<ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth={5.5} clipPath={`url(#c${id})`} />
			{/* under-eye bags */}
			{(m === 'terror' || m === 'shock' || m === 'rage') && <path d={`M${cx - rx * 0.7} ${cy + ry + 7} Q${cx} ${cy + ry + 15} ${cx + rx * 0.7} ${cy + ry + 7}`} stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.75} />}
		</g>
	);
};
const Brow: React.FC<{cx: number; cy: number; side: number; m: XM}> = ({cx, cy, side, m}) => {
	// side -1 = left eye, +1 = right eye; inner end is toward the middle
	const inner = cx - side * 30, outer = cx + side * 32;
	const [yi, yo] = m === 'rage' ? [cy + 10, cy - 14] : m === 'evil' ? [cy + 4, cy - 10] : m === 'cry' ? [cy - 16, cy + 2] : m === 'shock' ? [cy - 12, cy - 12] : [cy - 18, cy - 4];
	const t = m === 'rage' ? 14 : 12;
	return <path d={`M${outer} ${yo} Q${(inner + outer) / 2} ${Math.min(yi, yo) - (m === 'shock' ? 10 : 6)} ${inner} ${yi} L${inner + side * 2} ${yi + t} Q${(inner + outer) / 2} ${Math.min(yi, yo) + t - 6} ${outer - side * 4} ${yo + t * 0.6} Z`} fill={INK} stroke={INK} strokeWidth={2} strokeLinejoin="round" />;
};
const Teeth: React.FC<{x0: number; x1: number; y0: number; y1: number; n: number; mid?: boolean}> = ({x0, x1, y0, y1, n, mid}) => (
	<g stroke={INK} strokeWidth={2.4}>
		{Array.from({length: n - 1}, (_, i) => { const x = x0 + ((i + 1) * (x1 - x0)) / n; return <line key={i} x1={x} y1={y0} x2={x} y2={y1} />; })}
		{mid && <line x1={x0} y1={(y0 + y1) / 2} x2={x1} y2={(y0 + y1) / 2} />}
	</g>
);
const Mouth: React.FC<{m: XM; u: string}> = ({m, u}) => {
	if (m === 'rage') {
		const d = 'M48 140 Q100 128 152 140 Q156 158 146 176 Q100 168 54 176 Q44 158 48 140 Z';
		return (
			<g>
				<defs><clipPath id={`m${u}`}><path d={d} /></clipPath></defs>
				<path d={d} fill="#F4F1EA" />
				<g clipPath={`url(#m${u})`}><Teeth x0={46} x1={154} y0={120} y1={180} n={9} mid /><rect x={40} y={170} width={120} height={10} fill="#C9C2B3" opacity={0.6} /></g>
				<path d={d} fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
			</g>
		);
	}
	if (m === 'evil') {
		const d = 'M50 138 Q100 150 152 128 Q146 170 100 174 Q62 172 50 138 Z';
		return (
			<g>
				<defs><clipPath id={`m${u}`}><path d={d} /></clipPath></defs>
				<path d={d} fill="#5A0E12" />
				<g clipPath={`url(#m${u})`}><path d="M40 120 L160 110 L160 152 Q100 160 40 146 Z" fill="#F4F1EA" /><Teeth x0={50} x1={152} y0={120} y1={156} n={8} /></g>
				<path d={d} fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
			</g>
		);
	}
	if (m === 'cry') {
		const d = 'M62 160 Q100 128 138 160 Q100 150 62 160 Z';
		return <g><path d="M60 162 Q100 126 140 162 Q120 172 100 170 Q80 172 60 162 Z" fill="#5A0E12" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><path d={d} fill="#F4F1EA" opacity={0.95} /><path d="M78 168 Q100 158 122 168" stroke="#E05570" strokeWidth={8} strokeLinecap="round" fill="none" /></g>;
	}
	// terror / shock: screaming open mouth with upper teeth and tongue
	const big = m === 'terror';
	const d = big ? 'M68 134 Q84 127 100 132 Q116 127 132 134 Q152 172 132 194 Q100 206 68 194 Q48 172 68 134 Z' : 'M76 140 Q100 128 124 140 Q130 168 100 178 Q70 168 76 140 Z';
	return (
		<g>
			<defs><clipPath id={`m${u}`}><path d={d} /></clipPath></defs>
			<path d={d} fill="#4A0B10" />
			<g clipPath={`url(#m${u})`}>
				<path d="M50 112 H150 V142 Q100 136 50 142 Z" fill="#F4F1EA" />
				<Teeth x0={56} x1={144} y0={120} y1={140} n={big ? 8 : 6} />{big && <><path d="M50 200 Q100 188 150 200 V210 H50 Z" fill="#F4F1EA" /><Teeth x0={60} x1={140} y0={188} y1={204} n={6} /></>}
				<ellipse cx={100} cy={big ? 192 : 180} rx={big ? 30 : 20} ry={big ? 20 : 14} fill="#E05570" />
				<path d={`M100 ${big ? 176 : 168} V${big ? 192 : 180}`} stroke="#B23A54" strokeWidth={2} />
			</g>
			<path d={d} fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
		</g>
	);
};
const Drop: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = 0}) => (
	<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
		<path d="M0 -18 C6 -6 13 2 13 10 A13 13 0 0 1 -13 10 C-13 2 -6 -6 0 -18 Z" fill="#8FDBFF" stroke={INK} strokeWidth={3.5} />
		<ellipse cx={-4} cy={6} rx={3} ry={5} fill="#fff" opacity={0.85} />
	</g>
);
const Puff: React.FC<{x: number; y: number; s: number; flip?: boolean}> = ({x, y, s, flip}) => (
	<g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill="#F2F4F7" stroke={INK} strokeWidth={3.5}>
		<circle cx={0} cy={0} r={13} /><circle cx={-14} cy={-12} r={11} /><circle cx={-6} cy={-26} r={9} /><circle cx={4} cy={-36} r={6} />
	</g>
);
export const FaceX: React.FC<{m: XM; look?: [number, number]; fx?: boolean}> = ({m, look = [0, 0], fx = true}) => {
	const u = uidOf();
	const ey = 82, rx = m === 'rage' ? 34 : m === 'evil' ? 32 : 36, ry = m === 'rage' ? 32 : m === 'evil' ? 28 : 42;
	return (
		<g>
			{fx && (m === 'terror' || m === 'shock') && <><Drop x={10} y={40} s={1.1} rot={-15} /><Drop x={190} y={50} s={0.9} rot={15} /><Drop x={176} y={10} s={0.65} rot={10} /></>}
			{fx && m === 'rage' && <><Puff x={-4} y={36} s={1.25} /><Puff x={204} y={36} s={1.25} flip /></>}
			<Eye cx={58} cy={ey} rx={rx} ry={ry} m={m} side={-1} look={look} u={u} />
			<Eye cx={142} cy={ey} rx={rx} ry={ry} m={m} side={1} look={look} u={u} />
			<Brow cx={58} cy={ey - ry - 8} side={-1} m={m} />
			<Brow cx={142} cy={ey - ry - 8} side={1} m={m} />
			{m === 'cry' && (
				<g fill="#7FC8FF" stroke={INK} strokeWidth={3}>
					<path d={`M40 ${ey + ry - 4} Q30 ${ey + 80} 36 ${ey + 120} L50 ${ey + 120} Q46 ${ey + 80} 54 ${ey + ry - 2} Z`} />
					<path d={`M146 ${ey + ry - 2} Q154 ${ey + 80} 150 ${ey + 120} L164 ${ey + 120} Q170 ${ey + 80} 160 ${ey + ry - 4} Z`} />
				</g>
			)}
			<Mouth m={m} u={u} />
		</g>
	);
};

// ---------------------------------------------------------------------------
// Bevel filter (lit from the top-left) for flags, stickers and the rock blob
// ---------------------------------------------------------------------------
export const Bevel: React.FC<{id: string; s: number; k?: number}> = ({id, s, k = 0.7}) => (
	<filter id={id} x="-5%" y="-5%" width="110%" height="110%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
		<feGaussianBlur in="SourceAlpha" stdDeviation={6 * s} result="b" />
		<feSpecularLighting in="b" surfaceScale={5} specularConstant={0.9} specularExponent={40} lightingColor="#ffffff" result="sp"><feDistantLight azimuth={225} elevation={42} /></feSpecularLighting>
		<feComposite in="sp" in2="SourceAlpha" operator="in" result="spi" />
		<feGaussianBlur in="SourceAlpha" stdDeviation={10 * s} result="b2" />
		<feOffset in="b2" dx={-7 * s} dy={-9 * s} result="o" />
		<feComposite in="SourceAlpha" in2="o" operator="out" result="inner" />
		<feFlood floodColor="#000" floodOpacity={0.3} />
		<feComposite in2="inner" operator="in" result="sh" />
		<feComposite in="SourceGraphic" in2="spi" operator="arithmetic" k1={0} k2={1} k3={k} k4={0} result="lit" />
		<feMerge><feMergeNode in="lit" /><feMergeNode in="sh" /></feMerge>
	</filter>
);
// cloth folds: soft vertical light/dark bands
export const Folds: React.FC<{x: number; y: number; w: number; h: number; id: string; o?: number}> = ({x, y, w, h, id, o = 0.22}) => (
	<>
		<defs>
			<linearGradient id={id} x1="0" y1="0" x2="1" y2="0.18">
				{[0, 0.14, 0.3, 0.46, 0.62, 0.78, 0.92, 1].map((p, i) => <stop key={i} offset={p} stopColor={i % 2 ? '#000' : '#fff'} stopOpacity={i % 2 ? o * 0.9 : o} />)}
			</linearGradient>
		</defs>
		<rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
	</>
);

// country sticker with bevel + cloth folds + detailed face
export const StickerX: React.FC<{k: string; w: number; x: number; y: number; m: XM; rot?: number; face?: number; fdx?: number; fdy?: number; look?: [number, number]}> = ({k, w, x, y, m, rot = 0, face = 0.66, fdx = 0, fdy = 0, look}) => {
	const u = uidOf();
	const [x0, y0, x1, y1] = mainBox(k);
	const bw = x1 - x0, bh = y1 - y0, pad = Math.max(bw, bh) * 0.12;
	const h = (w * (bh + pad * 2)) / (bw + pad * 2);
	const sc = (bw + pad * 2) / w;
	const fs = Math.min(bw, bh) * face;
	const cx = (x0 + x1) / 2 + fdx * bw, cy = (y0 + y1) / 2 + fdy * bh;
	return (
		<svg width={w} height={h} viewBox={`${x0 - pad} ${y0 - pad} ${bw + pad * 2} ${bh + pad * 2}`} style={{position: 'absolute', left: x - w / 2, top: y - h / 2, transform: `rotate(${rot}deg)`, overflow: 'hidden'}}>
			<defs><filter id={`sat${u}`}><feColorMatrix type="saturate" values="1.35" /></filter><clipPath id={`s${u}`}><path d={WORLD[k].d} /></clipPath><Bevel id={`b${u}`} s={sc} /><Bevel id={`bw${u}`} s={sc * 0.6} k={0.5} /></defs>
			<path d={WORLD[k].d} fill="#000" opacity={0.5} transform={`translate(${8 * sc} ${20 * sc})`} stroke="#000" strokeWidth={30 * sc} strokeLinejoin="round" />
			<g filter={`url(#bw${u})`}><path d={WORLD[k].d} fill="#F4F4F4" stroke="#F4F4F4" strokeWidth={30 * sc} strokeLinejoin="round" /></g>
			<path d={WORLD[k].d} fill="none" stroke={INK} strokeWidth={30 * sc + 6 * sc} strokeLinejoin="round" opacity={0} />
			<g filter={`url(#b${u})`}>
				<g filter={`url(#sat${u})`}><FlagFill k={k} flag={FL[k]} clip={`s${u}`} /></g>
				<g clipPath={`url(#s${u})`}><Folds x={x0 - pad} y={y0 - pad} w={bw + pad * 2} h={bh + pad * 2} id={`f${u}`} o={0.16} /></g>
				<image href={staticFile('tex/relief.jpg')} x={REL.x} y={REL.y} width={REL.w} height={REL.h} preserveAspectRatio="none" clipPath={`url(#s${u})`} style={{mixBlendMode: 'multiply'}} opacity={0.75} />
			</g>
			<path d={WORLD[k].d} fill="none" stroke={INK} strokeWidth={5 * sc} strokeLinejoin="round" />
			<g transform={`translate(${cx} ${cy}) scale(${fs / 200}) translate(-100 -100)`}><FaceX m={m} look={look} /></g>
		</svg>
	);
};
// cracked rock blob with lava veins
const ROCK = 'M-78 -70 C-40 -112 30 -108 72 -78 C108 -50 112 10 92 52 C74 92 20 112 -26 104 C-74 96 -108 58 -110 8 C-112 -30 -100 -50 -78 -70 Z';
export const Rock: React.FC<{x: number; y: number; d: number; m?: XM}> = ({x, y, d, m = 'evil'}) => {
	const u = uidOf();
	return (
		<div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d}}>
			<svg width={d} height={d} viewBox="-125 -125 250 250" style={{overflow: 'visible'}}>
				<defs>
					<radialGradient id={`r${u}`} cx="38%" cy="32%" r="75%"><stop offset="0%" stopColor="#5E5A5C" /><stop offset="55%" stopColor="#2C2A2E" /><stop offset="100%" stopColor="#111014" /></radialGradient>
					<clipPath id={`k${u}`}><path d={ROCK} /></clipPath>
					<filter id={`n${u}`}><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={3} seed={4} /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 0.9" /></filter>
					<Bevel id={`b${u}`} s={0.6} k={0.45} />
				</defs>
				<path d={ROCK} fill="#000" opacity={0.5} transform="translate(6 14)" />
				<g filter={`url(#b${u})`}>
					<path d={ROCK} fill={`url(#r${u})`} />
					<g clipPath={`url(#k${u})`}>
						<rect x={-125} y={-125} width={250} height={250} filter={`url(#n${u})`} opacity={0.55} />
						<g fill="none" strokeLinecap="round" strokeLinejoin="round">
							{['M-110 10 L-70 0 L-50 22 L-20 14', 'M60 -90 L44 -50 L66 -30 L58 0', 'M-40 104 L-30 70 L-56 52', 'M92 52 L60 50 L50 76 L20 84', 'M-80 -66 L-56 -40 L-70 -20'].map((p, i) => (
								<g key={i}><path d={p} stroke="#FF5A00" strokeWidth={9} /><path d={p} stroke="#FFD34D" strokeWidth={3.5} /></g>
							))}
						</g>
					</g>
				</g>
				<path d={ROCK} fill="none" stroke={INK} strokeWidth={6} />
				<g transform="translate(-88 -92) scale(0.88)"><FaceX m={m} fx={false} /></g>
			</svg>
		</div>
	);
};
// beveled flag card with folds, frame and drips to grey
export type FX = 'none' | 'cracks' | 'fire' | 'drops' | 'ice' | 'burn' | 'band' | 'bolt';
export const FlagX: React.FC<{f: string; w: number; m: XM; melt?: number; look?: [number, number]; fx?: FX}> = ({f, w, m, melt = 0, look, fx = 'none'}) => {
	const u = uidOf();
	const h = w * 0.72, W = 300, H = 216;
	const ym = H * melt;
	const drips = [[0.1, 26], [0.27, 14], [0.44, 34], [0.62, 18], [0.8, 30], [0.93, 12]];
	return (
		<div style={{position: 'relative', width: w, height: h}}>
			<svg width={w} height={h} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
				<defs>
					<clipPath id={`c${u}`}><rect x={0} y={0} width={W} height={H} rx={14} /></clipPath>
					<Bevel id={`b${u}`} s={0.55} k={0.6} /><filter id={`sat${u}`}><feColorMatrix type="saturate" values="1.4" /></filter>
				</defs>
				<rect x={4} y={12} width={W} height={H} rx={14} fill="#000" opacity={0.45} />
				<g filter={`url(#b${u})`}>
					<g clipPath={`url(#c${u})`}>
						<image href={staticFile(`flags/${f}.svg`)} x={-2} y={-2} width={W + 4} height={H + 4} preserveAspectRatio="none" filter={`url(#sat${u})`} />
						<Folds x={0} y={0} w={W} h={H} id={`f${u}`} o={0.1} />
						<FxIn fx={fx} />
						{melt > 0 && <path d={`M0 0 H${W} V${ym} ${drips.map(([p, l]) => `L${p * W + 9} ${ym} Q${p * W + 9} ${ym + l} ${p * W} ${ym + l} Q${p * W - 9} ${ym + l} ${p * W - 9} ${ym}`).reverse().join(' ')} L0 ${ym} Z`} fill="#8E949C" />}
					</g>
				</g>
				<rect x={0} y={0} width={W} height={H} rx={14} fill="none" stroke="#fff" strokeWidth={8} />
				<FxOut fx={fx} />
				<rect x={-5} y={-5} width={W + 10} height={H + 10} rx={18} fill="none" stroke={INK} strokeWidth={4} />
				<g transform={`translate(${W / 2 - 92} ${H / 2 - 98}) scale(0.92)`}><FaceX m={m} look={look} /></g>
			</svg>
		</div>
	);
};

// ---------------------------------------------------------------------------
// Thumbnails: split versions (from #6) and grid versions (from #7)
// ---------------------------------------------------------------------------
const SplitBg: React.FC<{cam: {x: number; y: number; z: number}; seed: number; bg?: React.ReactNode}> = ({cam, seed, bg}) => (
	<>
		<Map cam={cam} dark={0.2} />
		<div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden', clipPath: 'polygon(1020px 0, 100% 0, 100% 100%, 890px 100%, 1012px 431px, 944px 421px)'}}>{bg ?? <Lava seed={seed} />}</div>
		<Bolt x={960} />
	</>
);
const Q: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<div style={{position: 'absolute', left: x, top: y, fontFamily: LILITA, fontSize: s, color: YEL, WebkitTextStroke: `${s * 0.08}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${s * 0.06}px 0 ${INK}`, transform: 'rotate(12deg)'}}>?</div>
);
const TITLE_S: [string, string?][] = [['¿QUIÉN'], ['SOBREVIVE?', YEL]];
const TITLE_D: [string, string?][] = [['¿QUIÉN'], ['DESAPARECE?', RED]];
const Title: React.FC<{t: [string, string?][]}> = ({t}) => <Line parts={t} size={140} style={{position: 'absolute', top: 26, left: 0, right: 0}} />;

export const X1: React.FC = () => (
	<AbsoluteFill><Fonts />
		<SplitBg cam={{x: 1830, y: 500, z: 2.4}} seed={5} />
		<StickerX k="ESP" w={880} x={480} y={620} m="terror" look={[0.5, 0]} />
		<Rock x={1440} y={640} d={600} />
		<Q x={1640} y={640} s={240} />
		<Title t={TITLE_S} />
	</AbsoluteFill>
);
export const X2: React.FC = () => (
	<AbsoluteFill><Fonts />
		<SplitBg cam={{x: 1300, y: 1150, z: 1.6}} seed={7} />
		<StickerX k="BRA" w={780} x={480} y={630} m="terror" look={[0.5, 0]} />
		<Rock x={1440} y={640} d={600} />
		<Q x={1640} y={640} s={240} />
		<Title t={TITLE_D} />
	</AbsoluteFill>
);
export const X3: React.FC = () => (
	<AbsoluteFill><Fonts />
		<SplitBg cam={{x: 1830, y: 500, z: 2.4}} seed={11} />
		<StickerX k="ESP" w={880} x={480} y={620} m="rage" look={[0.6, 0]} />
		<Rock x={1440} y={640} d={600} />
		<Q x={1640} y={640} s={240} />
		<Title t={TITLE_D} />
	</AbsoluteFill>
);
export const X4: React.FC = () => (
	<AbsoluteFill><Fonts />
		<SplitBg cam={{x: 1350, y: 1250, z: 1.5}} seed={13} />
		<StickerX k="ARG" w={470} x={470} y={650} m="cry" face={0.95} fdy={-0.18} />
		<Rock x={1440} y={640} d={600} />
		<Q x={1640} y={640} s={240} />
		<Title t={TITLE_S} />
	</AbsoluteFill>
);
const Grid: React.FC<{items: [string, XM, number][]; W?: number; gap?: number}> = ({items, W = 380, gap = 90}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'grid', gridTemplateColumns: `repeat(3, ${W}px)`, justifyContent: 'center', columnGap: gap, rowGap: 64}}>
		{items.map(([f, m]) => <FlagX key={f} f={f} w={W} m={m} />)}
	</div>
);
export const X5: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1900, y: 800, z: 0.55}} faces={false} dark={0.45} />
		<Title t={TITLE_S} />
		<Grid items={[['es', 'terror', 0.5], ['ar', 'cry', 0.3], ['br', 'shock', 0.18], ['mx', 'terror', 0.66], ['de', 'rage', 0.42], ['uy', 'shock', 0.1]]} />
	</AbsoluteFill>
);
export const X6: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1900, y: 800, z: 0.55}} faces={false} dark={0.45} />
		<Title t={TITLE_D} />
		<Grid items={[['fr', 'terror', 0.55], ['it', 'rage', 0.35], ['gb-eng', 'cry', 0.62], ['pt', 'shock', 0.25], ['nl', 'terror', 0.45], ['co', 'cry', 0.15]]} />
	</AbsoluteFill>
);
export const X7: React.FC = () => (
	<AbsoluteFill><Fonts />
		<div style={{position: 'absolute', inset: 0}}><Lava seed={21} /></div>
		<Title t={TITLE_D} />
		<Grid items={[['es', 'rage', 0.3], ['ar', 'terror', 0.58], ['br', 'cry', 0.45], ['de', 'terror', 0.2], ['fr', 'shock', 0.7], ['it', 'cry', 0.12]]} />
	</AbsoluteFill>
);
export const X8: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1900, y: 800, z: 0.55}} faces={false} dark={0.45} />
		<Title t={TITLE_S} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 260, display: 'flex', justifyContent: 'center', gap: 80}}>
			<FlagX f="es" w={760} m="terror" melt={0.42} look={[0.4, 0]} />
			<FlagX f="ar" w={760} m="cry" melt={0.2} look={[-0.4, 0]} />
		</div>
	</AbsoluteFill>
);

const Split: React.FC<{k: string; w: number; m: XM; cam: {x: number; y: number; z: number}; seed: number; t: [string, string?][]; y?: number; face?: number; fdy?: number; rock?: XM}> = ({k, w, m, cam, seed, t, y = 640, face, fdy, rock = 'evil'}) => (
	<AbsoluteFill><Fonts />
		<SplitBg cam={cam} seed={seed} />
		<StickerX k={k} w={w} x={470} y={y} m={m} look={[0.5, 0]} face={face} fdy={fdy} />
		<Rock x={1440} y={640} d={600} m={rock} />
		<Q x={1640} y={640} s={240} />
		<Title t={t} />
	</AbsoluteFill>
);
export const S1: React.FC = () => <Split k="ESP" w={880} m="terror" cam={{x: 1830, y: 500, z: 2.4}} seed={5} t={TITLE_S} y={620} />;
export const S2: React.FC = () => <Split k="ARG" w={470} m="cry" cam={{x: 1350, y: 1250, z: 1.5}} seed={13} t={TITLE_S} y={650} face={0.95} fdy={-0.18} />;
export const S3: React.FC = () => <Split k="BRA" w={780} m="rage" cam={{x: 1300, y: 1150, z: 1.6}} seed={7} t={TITLE_D} />;
export const S4: React.FC = () => <Split k="MEX" w={860} m="terror" cam={{x: 800, y: 760, z: 2.2}} seed={17} t={TITLE_D} face={0.62} />;
export const S5: React.FC = () => <Split k="ITA" w={640} m="shock" cam={{x: 1900, y: 480, z: 2.6}} seed={23} t={TITLE_S} />;
export const S6: React.FC = () => <Split k="DEU" w={620} m="rage" cam={{x: 1900, y: 420, z: 2.6}} seed={29} t={TITLE_D} />;
export const G1: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1900, y: 800, z: 0.55}} faces={false} dark={0.35} />
		<Title t={TITLE_S} />
		<Grid items={[['es', 'terror', 0], ['ar', 'cry', 0], ['br', 'shock', 0], ['mx', 'terror', 0], ['de', 'rage', 0], ['uy', 'shock', 0]]} />
	</AbsoluteFill>
);
export const G2: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1900, y: 800, z: 0.55}} faces={false} dark={0.35} />
		<Title t={TITLE_D} />
		<Grid items={[['fr', 'terror', 0], ['it', 'rage', 0], ['gb-eng', 'cry', 0], ['pt', 'shock', 0], ['nl', 'terror', 0], ['co', 'cry', 0]]} />
	</AbsoluteFill>
);
export const G3: React.FC = () => (
	<AbsoluteFill><Fonts />
		<div style={{position: 'absolute', inset: 0}}><Lava seed={21} /></div>
		<Title t={TITLE_D} />
		<Grid items={[['es', 'rage', 0], ['ar', 'terror', 0], ['br', 'cry', 0], ['de', 'terror', 0], ['fr', 'shock', 0], ['it', 'cry', 0]]} />
	</AbsoluteFill>
);
export const G4: React.FC = () => (
	<AbsoluteFill><Fonts />
		<div style={{position: 'absolute', inset: 0}}><Lava seed={31} /></div>
		<Title t={TITLE_S} />
		<Grid items={[['es', 'terror', 0], ['br', 'rage', 0], ['ar', 'cry', 0], ['mx', 'shock', 0], ['uy', 'terror', 0], ['co', 'cry', 0]]} />
	</AbsoluteFill>
);
export const T21_X = [X1, X2, X3, X4, X5, X6, X7, X8, S1, S2, S3, S4, S5, S6, G1, G2, G3, G4];

// ---------------------------------------------------------------------------
// Extra flag effects (inside the flag = clipped, outside = over the frame)
// ---------------------------------------------------------------------------
const rnd = (seed: number) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const FxIn: React.FC<{fx: FX}> = ({fx}) => {
	const u = uidOf();
	if (fx === 'cracks') {
		const lines = ['M210 70 L170 40 L150 0', 'M210 70 L250 30 L300 20', 'M210 70 L260 110 L300 130', 'M210 70 L200 130 L230 216', 'M210 70 L150 100 L90 90 L40 120', 'M170 40 L130 50', 'M200 130 L160 160 L150 216', 'M260 110 L250 160'];
		return <g fill="none" strokeLinejoin="round" strokeLinecap="round">{lines.map((d, i) => <g key={i}><path d={d} stroke={INK} strokeWidth={4.5} /><path d={d} stroke="#fff" strokeWidth={1.6} transform="translate(-1.5 -1.5)" /></g>)}<circle cx={210} cy={70} r={7} fill={INK} /></g>;
	}
	if (fx === 'drops') {
		const r = rnd(7);
		return <g>{Array.from({length: 12}, (_, i) => { const x = 15 + r() * 270, y = 15 + r() * 180; return <g key={i}><path d={`M${x} ${y} V${y + 20 + r() * 30}`} stroke="#BFE9FF" strokeWidth={3} opacity={0.6} strokeLinecap="round" /><Drop x={x} y={y + 6} s={0.45 + r() * 0.3} /></g>; })}</g>;
	}
	if (fx === 'burn') {
		return (
			<g>
				<defs><radialGradient id={`bn${u}`}><stop offset="0%" stopColor="#120804" stopOpacity={0.95} /><stop offset="60%" stopColor="#3A1606" stopOpacity={0.7} /><stop offset="100%" stopColor="#3A1606" stopOpacity={0} /></radialGradient></defs>
				{[[0, 0, 90], [300, 216, 110], [300, 0, 60], [0, 216, 70], [150, 230, 60]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={`url(#bn${u})`} />)}
				<g fill="none" stroke="#FF7A1A" strokeWidth={2.5} strokeLinecap="round"><path d="M10 40 L30 30 L42 46" /><path d="M260 190 L250 170 L270 160" /><path d="M280 30 L262 20" /></g>
			</g>
		);
	}
	if (fx === 'ice') {
		return (
			<g>
				<defs><linearGradient id={`ic${u}`} x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stopColor="#E8F8FF" stopOpacity={0.85} /><stop offset="40%" stopColor="#BDE8FF" stopOpacity={0.3} /><stop offset="100%" stopColor="#9FD8FF" stopOpacity={0.15} /></linearGradient></defs>
				<rect width={300} height={216} fill={`url(#ic${u})`} />
				<g stroke="#fff" strokeWidth={2.2} strokeLinecap="round" opacity={0.9}>{[[40, 170], [260, 60], [230, 180]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>{[0, 60, 120].map((a) => <line key={a} x1={-11} y1={0} x2={11} y2={0} transform={`rotate(${a})`} />)}</g>)}</g>
			</g>
		);
	}
	if (fx === 'fire') return <rect y={110} width={300} height={106} fill="#FF5A00" opacity={0.28} />;
	return null;
};
const FxOut: React.FC<{fx: FX}> = ({fx}) => {
	if (fx === 'fire') {
		const fl = (x: number, h: number, w: number) => `M${x - w} 222 Q${x - w * 0.9} ${222 - h * 0.5} ${x - w * 0.2} ${222 - h * 0.7} Q${x - w * 0.5} ${222 - h * 0.9} ${x} ${222 - h} Q${x + w * 0.4} ${222 - h * 0.75} ${x + w * 0.6} ${222 - h * 0.55} Q${x + w} ${222 - h * 0.35} ${x + w} 222 Z`;
		const xs: [number, number, number][] = [[20, 70, 30], [70, 95, 34], [125, 60, 28], [175, 105, 36], [230, 75, 30], [282, 90, 32]];
		return <g strokeLinejoin="round">{xs.map(([x, h, w], i) => <path key={i} d={fl(x, h, w)} fill="#FF5A1F" stroke={INK} strokeWidth={4} />)}{xs.map(([x, h, w], i) => <path key={'y' + i} d={fl(x, h * 0.6, w * 0.55)} fill="#FFD23F" />)}</g>;
	}
	if (fx === 'ice') {
		const xs = [20, 48, 80, 115, 150, 188, 222, 255, 284];
		return (
			<g stroke={INK} strokeWidth={3.5} strokeLinejoin="round">
				{xs.map((x, i) => { const l = 22 + ((i * 37) % 40); return <path key={i} d={`M${x - 11} 214 L${x} ${214 + l} L${x + 11} 214 Z`} fill="#BFEAFF" />; })}
				<path d="M-8 6 Q10 -14 30 -4 Q50 -18 72 -4 Q96 -16 118 -4 Q142 -18 166 -4 Q190 -16 212 -4 Q236 -18 258 -4 Q282 -16 308 6 L308 14 Q280 24 254 14 Q228 26 200 14 Q170 26 140 14 Q110 26 80 14 Q50 26 24 14 Q4 22 -8 14 Z" fill="#FFFFFF" />
			</g>
		);
	}
	if (fx === 'burn') return <g><Puff x={30} y={-8} s={1.3} /><Puff x={270} y={-4} s={1.1} flip /></g>;
	if (fx === 'band') {
		const B = (r: number) => (
			<g transform={`translate(255 40) rotate(${r})`}>
				<rect x={-60} y={-16} width={120} height={32} rx={16} fill="#F2C38F" stroke={INK} strokeWidth={4} />
				<rect x={-18} y={-12} width={36} height={24} rx={4} fill="#E3A96C" />
				{[-44, -34, 34, 44].map((x) => <circle key={x} cx={x} cy={0} r={2.2} fill="#B97C45" />)}
			</g>
		);
		return <g>{B(40)}{B(-40)}</g>;
	}
	if (fx === 'bolt') return <path d="M70 -40 L20 70 L58 74 L10 190 L110 50 L68 46 L120 -40 Z" fill="#FFE14D" stroke={INK} strokeWidth={5} strokeLinejoin="round" />;
	if (fx === 'drops') return <g><Drop x={-14} y={60} s={1.1} rot={-30} /><Drop x={316} y={140} s={1.0} rot={30} /><Drop x={300} y={-10} s={0.8} rot={20} /></g>;
	if (fx === 'cracks') return <g fill="#fff" stroke={INK} strokeWidth={3}><path d="M240 220 L262 216 L254 238 Z" /><path d="M200 232 L214 228 L210 246 Z" /><path d="M280 214 L296 222 L284 234 Z" /></g>;
	return null;
};

// ---------------------------------------------------------------------------
// Alternative right-hand backgrounds for the split thumbnails
// ---------------------------------------------------------------------------
const W0 = 1920, H0 = 1080;
export const Storm: React.FC = () => {
	const r = rnd(11);
	return (
		<svg width={W0} height={H0} style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id="st" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#120B2B" /><stop offset="100%" stopColor="#3B2470" /></linearGradient>
				<filter id="stc"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves={4} seed={3} /><feColorMatrix values="0 0 0 0 0.12  0 0 0 0 0.1  0 0 0 0 0.22  0 0 0 1.6 -0.5" /></filter>
			</defs>
			<rect width={W0} height={H0} fill="url(#st)" />
			<rect width={W0} height={H0} filter="url(#stc)" />
			<g stroke="#9DB4FF" strokeWidth={3} opacity={0.35} strokeLinecap="round">{Array.from({length: 120}, (_, i) => { const x = 900 + r() * 1100, y = r() * 1080; return <line key={i} x1={x} y1={y} x2={x - 18} y2={y + 46} />; })}</g>
			{['M1840 200 L1790 360 L1830 370 L1750 560', 'M1900 520 L1850 700 L1890 710 L1810 920', 'M1100 760 L1130 880 L1090 890 L1140 1080'].map((d, i) => <g key={i} fill="none" strokeLinejoin="round" strokeLinecap="round"><path d={d} stroke={INK} strokeWidth={22} /><path d={d} stroke="#FFF27A" strokeWidth={11} /><path d={d} stroke="#fff" strokeWidth={4} /></g>)}
		</svg>
	);
};
export const Space: React.FC = () => {
	const r = rnd(5);
	return (
		<svg width={W0} height={H0} style={{position: 'absolute', inset: 0}}>
			<defs>
				<radialGradient id="sp1" cx="72%" cy="30%" r="45%"><stop offset="0%" stopColor="#7B2FBE" stopOpacity={0.7} /><stop offset="100%" stopColor="#7B2FBE" stopOpacity={0} /></radialGradient>
				<radialGradient id="sp2" cx="62%" cy="85%" r="40%"><stop offset="0%" stopColor="#1E6FD9" stopOpacity={0.6} /><stop offset="100%" stopColor="#1E6FD9" stopOpacity={0} /></radialGradient>
				<radialGradient id="pl" cx="35%" cy="30%" r="75%"><stop offset="0%" stopColor="#FFB36B" /><stop offset="70%" stopColor="#C2410C" /><stop offset="100%" stopColor="#5A1A05" /></radialGradient>
			</defs>
			<rect width={W0} height={H0} fill="#05061A" />
			<rect width={W0} height={H0} fill="url(#sp1)" /><rect width={W0} height={H0} fill="url(#sp2)" />
			{Array.from({length: 260}, (_, i) => <circle key={i} cx={900 + r() * 1020} cy={r() * 1080} r={0.8 + r() * 2.4} fill="#fff" opacity={0.4 + r() * 0.6} />)}
			{[[1180, 140], [1790, 980], [1840, 300]].map(([x, y], i) => <path key={i} d={`M${x} ${y - 22} L${x + 6} ${y - 6} L${x + 22} ${y} L${x + 6} ${y + 6} L${x} ${y + 22} L${x - 6} ${y + 6} L${x - 22} ${y} L${x - 6} ${y - 6} Z`} fill="#FFF7C2" />)}
			<g transform="translate(1790 170)"><circle r={95} fill="url(#pl)" stroke={INK} strokeWidth={7} /><ellipse rx={170} ry={36} fill="none" stroke="#F4D7A1" strokeWidth={14} transform="rotate(-18)" /><ellipse rx={170} ry={36} fill="none" stroke={INK} strokeWidth={4} transform="rotate(-18)" /></g>
		</svg>
	);
};
const Toxic: React.FC = () => {
	const r = rnd(9);
	return (
		<svg width={W0} height={H0} style={{position: 'absolute', inset: 0}}>
			<defs>
				<radialGradient id="tx" cx="60%" cy="60%" r="70%"><stop offset="0%" stopColor="#3D7A12" /><stop offset="100%" stopColor="#0C1F05" /></radialGradient>
				<filter id="txn"><feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves={4} seed={8} /><feColorMatrix values="0 0 0 0 0.6  0 0 0 0 1  0 0 0 0 0.1  0 0 0 1.8 -0.9" /></filter>
			</defs>
			<rect width={W0} height={H0} fill="url(#tx)" />
			<rect width={W0} height={H0} filter="url(#txn)" opacity={0.6} />
			{Array.from({length: 40}, (_, i) => { const x = 950 + r() * 950, y = 200 + r() * 880, rr = 8 + r() * 30; return <g key={i}><circle cx={x} cy={y} r={rr} fill="#B6FF3B" opacity={0.25} stroke="#D9FF7A" strokeWidth={3} /><circle cx={x - rr * 0.35} cy={y - rr * 0.35} r={rr * 0.22} fill="#fff" opacity={0.7} /></g>; })}
			<g transform="translate(1760 180)" opacity={0.9}>
				<circle r={110} fill="#FFD400" stroke={INK} strokeWidth={8} />
				{[0, 120, 240].map((a) => <path key={a} d="M0 -22 L-48 -92 A96 96 0 0 1 48 -92 Z" fill={INK} transform={`rotate(${a})`} />)}
				<circle r={18} fill={INK} />
			</g>
		</svg>
	);
};
const Ice: React.FC = () => {
	const r = rnd(13);
	return (
		<svg width={W0} height={H0} style={{position: 'absolute', inset: 0}}>
			<defs><linearGradient id="ib" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stopColor="#D7F3FF" /><stop offset="50%" stopColor="#5BB8F0" /><stop offset="100%" stopColor="#0E4C8A" /></linearGradient></defs>
			<rect width={W0} height={H0} fill="url(#ib)" />
			<g fill="none" stroke="#fff" strokeWidth={4} opacity={0.75} strokeLinejoin="round">
				{['M1100 300 L1260 360 L1330 300 L1500 380 L1620 340', 'M1260 360 L1300 520 L1240 640 L1290 820', 'M1500 380 L1560 560 L1700 600 L1920 560', 'M1300 520 L1450 560 L1560 560', 'M1240 640 L1080 700 L980 860', 'M1700 600 L1760 800 L1700 1080']
					.map((d, i) => <g key={i}><path d={d} stroke="#0B3A6A" strokeWidth={8} opacity={0.4} transform="translate(3 4)" /><path d={d} /></g>)}
			</g>
			<g stroke="#fff" strokeWidth={4} strokeLinecap="round">{Array.from({length: 26}, (_, i) => { const x = 980 + r() * 920, y = r() * 1080, s = 8 + r() * 16; return <g key={i} transform={`translate(${x} ${y})`} opacity={0.6 + r() * 0.4}>{[0, 60, 120].map((a) => <line key={a} x1={-s} y1={0} x2={s} y2={0} transform={`rotate(${a})`} />)}</g>; })}</g>
		</svg>
	);
};
export const Vortex: React.FC = () => (
	<svg width={W0} height={H0} style={{position: 'absolute', inset: 0}}>
		<defs>
			<radialGradient id="vx" cx="1440" cy="640" r="900" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#000" /><stop offset="22%" stopColor="#000" /><stop offset="30%" stopColor="#FF8A00" /><stop offset="42%" stopColor="#7A1FA2" /><stop offset="70%" stopColor="#1A0B3A" /><stop offset="100%" stopColor="#05030F" /></radialGradient>
		</defs>
		<rect width={W0} height={H0} fill="url(#vx)" />
		<g fill="none" strokeLinecap="round" transform="translate(1440 640)">
			{Array.from({length: 14}, (_, i) => <ellipse key={i} rx={260 + i * 48} ry={150 + i * 30} stroke={i % 2 ? '#FFB347' : '#B66DFF'} strokeWidth={6 - i * 0.3} strokeDasharray={`${120 + i * 30} ${80 + i * 20}`} opacity={0.75 - i * 0.04} transform={`rotate(${-18 + i * 9})`} />)}
		</g>
	</svg>
);
export const Hazard: React.FC = () => (
	<svg width={W0} height={H0} style={{position: 'absolute', inset: 0}}>
		<defs>
			<pattern id="hz" width={140} height={140} patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width={140} height={140} fill="#FFC300" /><rect width={70} height={140} fill="#16161C" /></pattern>
			<radialGradient id="hzr" cx="75%" cy="55%" r="60%"><stop offset="0%" stopColor="#FF1E1E" stopOpacity={0.55} /><stop offset="100%" stopColor="#5A0000" stopOpacity={0.85} /></radialGradient>
		</defs>
		<rect width={W0} height={H0} fill="url(#hz)" />
		<rect width={W0} height={H0} fill="url(#hzr)" />
	</svg>
);

// ---------------------------------------------------------------------------
// New batch: split with alternative backgrounds + flags with effects
// ---------------------------------------------------------------------------
const Split2: React.FC<{k: string; w: number; m: XM; cam: {x: number; y: number; z: number}; bg: React.ReactNode; t: [string, string?][]; y?: number; face?: number; fdy?: number; rock?: XM}> = ({k, w, m, cam, bg, t, y = 640, face, fdy, rock = 'evil'}) => (
	<AbsoluteFill><Fonts />
		<SplitBg cam={cam} seed={1} bg={bg} />
		<StickerX k={k} w={w} x={470} y={y} m={m} look={[0.5, 0]} face={face} fdy={fdy} />
		<Rock x={1440} y={640} d={600} m={rock} />
		<Q x={1640} y={640} s={240} />
		<Title t={t} />
	</AbsoluteFill>
);
const ESPc = {x: 1830, y: 500, z: 2.4}, ARGc = {x: 1350, y: 1250, z: 1.5}, BRAc = {x: 1300, y: 1150, z: 1.6};
export const P1: React.FC = () => <Split2 k="ESP" w={880} m="terror" cam={ESPc} y={620} bg={<Storm />} t={TITLE_S} />;
export const P2: React.FC = () => <Split2 k="ARG" w={470} m="cry" cam={ARGc} y={650} face={0.95} fdy={-0.18} bg={<Space />} t={TITLE_S} />;
export const P3: React.FC = () => <Split2 k="BRA" w={780} m="terror" cam={BRAc} bg={<Toxic />} t={TITLE_D} />;
export const P4: React.FC = () => <Split2 k="ESP" w={880} m="shock" cam={ESPc} y={620} bg={<Ice />} t={TITLE_D} />;
export const P5: React.FC = () => <Split2 k="ARG" w={470} m="terror" cam={ARGc} y={650} face={0.95} fdy={-0.18} bg={<Vortex />} t={TITLE_D} />;
export const P6: React.FC = () => <Split2 k="BRA" w={780} m="rage" cam={BRAc} bg={<Hazard />} t={TITLE_S} />;
type GI = [string, XM, FX];
const GridFx: React.FC<{items: GI[]; W?: number; gap?: number}> = ({items, W = 380, gap = 90}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: 262, display: 'grid', gridTemplateColumns: `repeat(3, ${W}px)`, justifyContent: 'center', columnGap: gap, rowGap: 92}}>
		{items.map(([f, m, fx]) => <FlagX key={f} f={f} w={W} m={m} fx={fx} />)}
	</div>
);
const MapBg: React.FC = () => <Map cam={{x: 1900, y: 800, z: 0.55}} faces={false} dark={0.35} />;
export const F1: React.FC = () => (
	<AbsoluteFill><Fonts /><MapBg /><Title t={TITLE_S} />
		<GridFx items={[['es', 'terror', 'fire'], ['ar', 'cry', 'drops'], ['br', 'shock', 'cracks'], ['mx', 'terror', 'ice'], ['de', 'rage', 'burn'], ['uy', 'shock', 'band']]} />
	</AbsoluteFill>
);
export const F2: React.FC = () => (
	<AbsoluteFill><Fonts /><MapBg /><Title t={TITLE_D} />
		<GridFx items={[['fr', 'terror', 'cracks'], ['it', 'rage', 'fire'], ['gb-eng', 'cry', 'drops'], ['pt', 'shock', 'bolt'], ['nl', 'terror', 'ice'], ['co', 'cry', 'burn']]} />
	</AbsoluteFill>
);
export const F3: React.FC = () => (
	<AbsoluteFill><Fonts /><div style={{position: 'absolute', inset: 0}}><Lava seed={21} /></div><Title t={TITLE_D} />
		<GridFx items={[['es', 'terror', 'fire'], ['ar', 'terror', 'fire'], ['br', 'rage', 'fire'], ['de', 'shock', 'burn'], ['fr', 'terror', 'burn'], ['it', 'cry', 'burn']]} />
	</AbsoluteFill>
);
export const F4: React.FC = () => (
	<AbsoluteFill><Fonts /><div style={{position: 'absolute', inset: 0}}><Ice /></div><Title t={TITLE_S} />
		<GridFx items={[['es', 'shock', 'ice'], ['br', 'terror', 'ice'], ['ar', 'cry', 'ice'], ['mx', 'terror', 'cracks'], ['uy', 'shock', 'ice'], ['co', 'cry', 'cracks']]} />
	</AbsoluteFill>
);
export const F5: React.FC = () => (
	<AbsoluteFill><Fonts /><div style={{position: 'absolute', inset: 0}}><Storm /></div><Title t={TITLE_D} />
		<GridFx items={[['es', 'terror', 'bolt'], ['ar', 'cry', 'drops'], ['br', 'shock', 'bolt'], ['de', 'rage', 'drops'], ['fr', 'terror', 'cracks'], ['it', 'cry', 'drops']]} />
	</AbsoluteFill>
);
export const F6: React.FC = () => (
	<AbsoluteFill><Fonts /><MapBg /><Title t={TITLE_S} />
		<GridFx items={[['es', 'cry', 'band'], ['ar', 'terror', 'cracks'], ['br', 'rage', 'burn'], ['mx', 'shock', 'drops'], ['de', 'terror', 'fire'], ['uy', 'cry', 'ice']]} />
	</AbsoluteFill>
);
export const T21_Y = [P1, P2, P3, P4, P5, P6, F1, F2, F3, F4, F5, F6];
