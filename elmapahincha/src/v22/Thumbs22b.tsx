import React, {useId} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WORLD, WCam, bboxOf} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {Face12, FaceMood, FlagFill, INK, REL} from '../v21/Atlas21';
import {Map, mainBox, YEL, RED} from '../v21/Thumbs21b';
import {Bevel, FaceX, Folds, StickerX, XM, Storm, Vortex} from '../v21/Thumbs21c';
import {FL, L} from './data22';
import {UNION_FACE} from './Video22';

const uid = () => useId().replace(/[^a-zA-Z0-9]/g, '');
const BLUE = '#5EC8FF', PINK = '#FF5FA2', GOLD = '#FFC93C';

// ------------------------------------------------------------------ text
type P = [string, string?];
export const TT: React.FC<{parts: P[]; size: number; style?: React.CSSProperties; rot?: number}> = ({parts, size, style, rot = 0}) => (
	<div style={{position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: size * 0.2, transform: `rotate(${rot}deg)`, ...style}}>
		{parts.map(([t, c], i) => (
			<span key={i} style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color: c ?? '#fff', WebkitTextStroke: `${size * 0.14}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.045}px 0 ${INK}, 0 ${size * 0.09}px 0 ${INK}, 0 ${size * 0.13}px ${size * 0.12}px rgba(0,0,0,0.55)`, whiteSpace: 'nowrap'}}>{t}</span>
		))}
	</div>
);

// ------------------------------------------------------------------ backgrounds
const fit = (cx: number, cy: number, h: number): WCam => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of L) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	const z = h / (y1 - y0);
	return {x: (x0 + x1) / 2 + (960 - cx) / z, y: (y0 + y1) / 2 + (540 - cy) / z, z};
};
const Bg: React.FC<{cam: {x: number; y: number; z: number}; blur?: number; mood?: FaceMood; dark?: number; latGrey?: boolean}> = ({cam, blur = 0, mood = 'scared', dark = 0.22, latGrey}) => (
	<div style={{position: 'absolute', inset: 0, filter: blur ? `blur(${blur}px) saturate(1.15)` : 'saturate(1.15)'}}>
		<Map cam={cam} mood={mood} dark={dark} grey={latGrey ? (k) => L.includes(k) : undefined} />
	</div>
);
const Vig: React.FC<{o?: number}> = ({o = 0.55}) => <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${o}) 100%)`}} />;
const Rays: React.FC<{c1?: string; c2?: string; cx?: string; cy?: string; n?: number}> = ({c1 = '#FFB800', c2 = '#FF7A00', cx = '50%', cy = '50%', n = 24}) => (
	<div style={{position: 'absolute', inset: 0, background: `repeating-conic-gradient(from 0deg at ${cx} ${cy}, ${c1} 0deg ${180 / n}deg, ${c2} ${180 / n}deg ${360 / n}deg)`}}>
		<div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at ${cx} ${cy}, rgba(255,250,210,0.85) 0%, rgba(255,220,120,0.25) 30%, rgba(0,0,0,0.45) 100%)`}} />
	</div>
);
const Sparkles: React.FC<{seed?: number; n?: number; box?: [number, number, number, number]; col?: string}> = ({seed = 1, n = 18, box = [0, 0, 1920, 1080], col = '#FFF4B0'}) => {
	let s = seed * 9301;
	const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
			{Array.from({length: n}, (_, i) => {
				const x = box[0] + r() * (box[2] - box[0]), y = box[1] + r() * (box[3] - box[1]), k = 10 + r() * 22;
				return <path key={i} d={`M${x} ${y - k} Q${x} ${y} ${x + k} ${y} Q${x} ${y} ${x} ${y + k} Q${x} ${y} ${x - k} ${y} Q${x} ${y} ${x} ${y - k} Z`} fill={col} stroke={INK} strokeWidth={2.5} opacity={0.95} />;
			})}
		</svg>
	);
};
const Confetti: React.FC<{seed?: number; n?: number}> = ({seed = 3, n = 70}) => {
	let s = seed * 7919;
	const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
	const cols = ['#FF3B3B', '#FFD23F', '#3BA3FF', '#2ECC71', '#FF5FA2', '#fff'];
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
			{Array.from({length: n}, (_, i) => <rect key={i} x={r() * 1920} y={r() * 1080} width={10 + r() * 12} height={18 + r() * 14} rx={3} fill={cols[i % cols.length]} transform={`rotate(${r() * 180} ${0} ${0})`} style={{transformBox: 'fill-box', transformOrigin: 'center'}} stroke={INK} strokeWidth={2} />)}
		</svg>
	);
};

// ------------------------------------------------------------------ the union sticker
// drop far-off islands (Galapagos, Revillagigedo, Easter Island...)
const MD: Record<string, string> = {};
for (const k of L) {
	const [a, b, c, d] = mainBox(k), ex = Math.max(c - a, d - b) * 0.15;
	MD[k] = WORLD[k].d.split('M').filter(Boolean).filter((sp) => {
		const n = sp.match(/-?[\d.]+/g)!.map(Number);
		let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
		for (let i = 0; i + 1 < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]); }
		const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
		const md = Math.max(x1 - x0, y1 - y0);
		return md >= 25 || (md >= 7 && cx > a - ex && cx < c + ex && cy > b - ex && cy < d + ex);
	}).map((sp) => 'M' + sp).join('');
}
const UB = (() => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of L) { const [a, b, c, d] = mainBox(k); x0 = Math.min(x0, a); y0 = Math.min(y0, b); x1 = Math.max(x1, c); y1 = Math.max(y1, d); }
	return [x0, y0, x1, y1];
})();
export const unionW = (h: number) => { const pad = (UB[3] - UB[1]) * 0.06; return (h * (UB[2] - UB[0] + pad * 2)) / (UB[3] - UB[1] + pad * 2); };
export const UnionX: React.FC<{h: number; x: number; y: number; m?: XM; f12?: FaceMood; face?: number; look?: [number, number]; glow?: string; rot?: number; fx?: boolean}> = ({h, x, y, m = 'evil', f12, face = 0.5, look, glow, rot = 0, fx = true}) => {
	const u = uid();
	const [x0, y0, x1, y1] = UB;
	const bw = x1 - x0, bh = y1 - y0, pad = bh * 0.06;
	const w = unionW(h);
	const sc = (bh + pad * 2) / h; // world units per px
	const fw = h * face * sc;
	const vb = `${x0 - pad} ${y0 - pad} ${bw + pad * 2} ${bh + pad * 2}`;
	const glowF = glow ? `drop-shadow(0 0 ${h * 0.012}px ${glow}) drop-shadow(0 0 ${h * 0.035}px ${glow}) drop-shadow(0 0 ${h * 0.07}px ${glow})` : undefined;
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`}}>
			{glow && <svg width={w} height={h} viewBox={vb} style={{position: 'absolute', inset: 0, overflow: 'visible', filter: glowF}}><g fill={glow} stroke={glow} strokeWidth={34 * sc} strokeLinejoin="round">{L.map((k) => <path key={k} d={MD[k]} />)}</g></svg>}
			<svg width={w} height={h} viewBox={vb} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<defs>
					<filter id={`sat${u}`}><feColorMatrix type="saturate" values="1.4" /></filter>
					{L.map((k) => <clipPath key={k} id={`c${u}${k}`}><path d={MD[k]} /></clipPath>)}
					<clipPath id={`a${u}`}>{L.map((k) => <path key={k} d={MD[k]} />)}</clipPath>
					<Bevel id={`b${u}`} s={sc * 1.2} k={0.55} /><Bevel id={`bw${u}`} s={sc * 0.6} k={0.45} />
				</defs>
				<g transform={`translate(${8 * sc} ${22 * sc})`} opacity={0.5} fill="#000" stroke="#000" strokeWidth={34 * sc} strokeLinejoin="round">{L.map((k) => <path key={k} d={MD[k]} />)}</g>
				<g fill={INK} stroke={INK} strokeWidth={40 * sc} strokeLinejoin="round">{L.map((k) => <path key={k} d={MD[k]} />)}</g>
				<g filter={`url(#bw${u})`}><g fill="#F6F6F6" stroke="#F6F6F6" strokeWidth={30 * sc} strokeLinejoin="round">{L.map((k) => <path key={k} d={MD[k]} />)}</g></g>
				<g filter={`url(#b${u})`}>
					<g filter={`url(#sat${u})`}>{L.map((k) => <FlagFill key={k} k={k} flag={FL[k]} clip={`c${u}${k}`} />)}</g>
					<g clipPath={`url(#a${u})`}><Folds x={x0 - pad} y={y0 - pad} w={bw + pad * 2} h={bh + pad * 2} id={`f${u}`} o={0.12} /></g>
					<image href={staticFile('tex/relief.jpg')} x={REL.x} y={REL.y} width={REL.w} height={REL.h} preserveAspectRatio="none" clipPath={`url(#a${u})`} style={{mixBlendMode: 'multiply'}} opacity={0.7} />
				</g>
				<g fill="none" stroke={INK} strokeWidth={2.2 * sc} strokeLinejoin="round" opacity={0.85}>{L.map((k) => <path key={k} d={MD[k]} />)}</g>
				<g transform={`translate(${UNION_FACE.x + 20} ${UNION_FACE.y}) scale(${fw / 200}) translate(-100 -100)`}>{f12 ? <Face12 mood={f12} look={look} /> : <FaceX m={m} look={look} fx={fx} />}</g>
			</svg>
		</div>
	);
};

// ------------------------------------------------------------------ props
const QBadge: React.FC<{x: number; y: number; d: number; c?: string}> = ({x, y, d, c = '#E3262E'}) => (
	<div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #FF7A7A, ${c} 55%, #7A0A10)`, border: `${d * 0.06}px solid ${INK}`, boxShadow: `0 0 ${d * 0.15}px ${d * 0.05}px ${c}, 0 0 ${d * 0.4}px ${c}, 0 ${d * 0.06}px 0 ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
		<span style={{fontFamily: LILITA, fontSize: d * 0.68, color: '#fff', WebkitTextStroke: `${d * 0.07}px ${INK}`, paintOrder: 'stroke fill', lineHeight: 1, marginTop: d * 0.04}}>?</span>
	</div>
);
const Tile: React.FC<{k: string; w: number; x: number; y: number; rot?: number}> = ({k, w, x, y, rot = 0}) => {
	const h = w * 0.66;
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`}}>
			<div style={{position: 'absolute', inset: 0, transform: `translate(${w * 0.02}px, ${w * 0.06}px)`, borderRadius: w * 0.08, background: 'rgba(0,0,0,0.5)'}} />
			<div style={{position: 'absolute', inset: 0, borderRadius: w * 0.08, overflow: 'hidden', border: `${w * 0.06}px solid #fff`, boxShadow: `0 0 0 ${w * 0.03}px ${INK}`}}>
				<img src={staticFile(`flags/${FL[k]}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.4)'}} />
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 35%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.3) 100%)'}} />
			</div>
		</div>
	);
};
const BallX: React.FC<{k: string; d: number; x: number; y: number; m: XM; look?: [number, number]; f12?: FaceMood}> = ({k, d, x, y, m, look, f12}) => {
	const u = uid();
	return (
		<svg width={d} height={d} viewBox="-115 -115 230 230" style={{position: 'absolute', left: x - d / 2, top: y - d / 2, overflow: 'visible'}}>
			<defs><clipPath id={`c${u}`}><circle r={100} /></clipPath><Bevel id={`b${u}`} s={0.55} k={0.6} /><filter id={`s${u}`}><feColorMatrix type="saturate" values="1.4" /></filter></defs>
			<circle cx={5} cy={14} r={112} fill="#000" opacity={0.45} />
			<circle r={112} fill={INK} />
			<circle r={108} fill="#F6F6F6" />
			<g filter={`url(#b${u})`}><g clipPath={`url(#c${u})`}><image href={staticFile(`flags/${FL[k]}.svg`)} x={-150} y={-100} width={300} height={200} preserveAspectRatio="xMidYMid slice" filter={`url(#s${u})`} /></g></g>
			<circle r={100} fill="none" stroke={INK} strokeWidth={4} />
			<g transform="translate(-74 -70) scale(0.74)">{f12 ? <Face12 mood={f12} look={look} /> : <FaceX m={m} look={look} />}</g>
		</svg>
	);
};
const Plus: React.FC<{x: number; y: number; s: number; t?: string; c?: string}> = ({x, y, s, t = '+', c = YEL}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', fontFamily: LILITA, fontSize: s, lineHeight: 1, color: c, WebkitTextStroke: `${s * 0.14}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${s * 0.07}px 0 ${INK}`}}>{t}</div>
);
const Arrow: React.FC<{x: number; y: number; w: number; rot?: number; flip?: boolean; c?: string}> = ({x, y, w, rot = 0, flip, c = '#fff'}) => (
	<svg width={w} height={w * 0.55} viewBox="0 0 300 165" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.275, transform: `rotate(${rot}deg) scaleX(${flip ? -1 : 1})`, overflow: 'visible'}}>
		<path d="M14 150 Q90 30 214 56 L206 22 L292 88 L196 132 L206 100 Q110 84 54 160 Z" fill="#000" opacity={0.4} transform="translate(4 10)" />
		<path d="M14 150 Q90 30 214 56 L206 22 L292 88 L196 132 L206 100 Q110 84 54 160 Z" fill={c} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
		<path d="M40 128 Q100 52 200 70" fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={6} strokeLinecap="round" />
	</svg>
);
const VsX: React.FC<{x: number; y: number; d: number}> = ({x, y, d}) => (
	<div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FF6B6B, #D7192A 60%, #7A0A10)', border: `${d * 0.06}px solid #fff`, boxShadow: `0 0 0 ${d * 0.035}px ${INK}, 0 0 ${d * 0.25}px #FF2A2A, 0 ${d * 0.07}px 0 ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
		<span style={{fontFamily: LILITA, fontSize: d * 0.46, color: '#fff', WebkitTextStroke: `${d * 0.06}px ${INK}`, paintOrder: 'stroke fill', lineHeight: 1}}>VS</span>
	</div>
);
const Cup: React.FC<{x: number; y: number; h: number; rot?: number}> = ({x, y, h, rot = 0}) => (
	<svg width={h * 0.8} height={h} viewBox="0 0 160 200" style={{position: 'absolute', left: x - h * 0.4, top: y - h / 2, transform: `rotate(${rot}deg)`, overflow: 'visible', filter: `drop-shadow(0 0 ${h * 0.06}px #FFD54A)`}}>
		<defs><linearGradient id="cupg" x1="0" x2="1"><stop offset="0" stopColor="#B07A08" /><stop offset="0.35" stopColor="#FFE680" /><stop offset="0.6" stopColor="#F2B705" /><stop offset="1" stopColor="#8A5A00" /></linearGradient></defs>
		<path d="M38 22 C10 22 6 64 44 82 M122 22 C150 22 154 64 116 82" fill="none" stroke={INK} strokeWidth={20} strokeLinecap="round" />
		<path d="M38 22 C10 22 6 64 44 82 M122 22 C150 22 154 64 116 82" fill="none" stroke="url(#cupg)" strokeWidth={11} strokeLinecap="round" />
		<path d="M32 12 H128 Q130 90 92 112 L92 140 Q92 150 112 156 L112 172 H48 L48 156 Q68 150 68 140 L68 112 Q30 90 32 12 Z" fill="url(#cupg)" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
		<rect x={34} y={172} width={92} height={22} rx={5} fill="#3B2A12" stroke={INK} strokeWidth={6} />
		<path d="M50 24 Q48 70 70 96" fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={7} strokeLinecap="round" />
	</svg>
);
const Crown: React.FC<{x: number; y: number; w: number; rot?: number}> = ({x, y, w, rot = 0}) => (
	<svg width={w} height={w * 0.7} viewBox="0 0 200 140" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.35, transform: `rotate(${rot}deg)`, overflow: 'visible', filter: `drop-shadow(0 0 ${w * 0.05}px #FFD54A)`}}>
		<defs><linearGradient id="crg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF1A0" /><stop offset="0.5" stopColor="#F5B800" /><stop offset="1" stopColor="#A86E00" /></linearGradient></defs>
		<path d="M14 122 L6 34 L56 74 L100 12 L144 74 L194 34 L186 122 Z" fill="url(#crg)" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
		<rect x={12} y={108} width={176} height={26} rx={6} fill="url(#crg)" stroke={INK} strokeWidth={8} />
		{[[6, 34], [100, 12], [194, 34]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={11} fill="#FFE680" stroke={INK} strokeWidth={6} />)}
		<circle cx={100} cy={84} r={14} fill="#E3262E" stroke={INK} strokeWidth={5} /><circle cx={56} cy={96} r={9} fill="#2E8BFF" stroke={INK} strokeWidth={4} /><circle cx={144} cy={96} r={9} fill="#2ECC71" stroke={INK} strokeWidth={4} />
	</svg>
);
const StarX: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = 0}) => (
	<svg width={s} height={s} viewBox="-13 -13 26 26" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, transform: `rotate(${rot}deg)`, overflow: 'visible', filter: `drop-shadow(0 0 ${s * 0.12}px #FFD54A)`}}>
		<path d="M0 -11 L3.2 -3.6 L11 -3.4 L5 1.8 L7 9.6 L0 5.2 L-7 9.6 L-5 1.8 L-11 -3.4 L-3.2 -3.6 Z" fill="#FFD23F" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
		<path d="M-3 -4 L0 -9 L1.6 -4" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" />
	</svg>
);
const Heart: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = 0}) => (
	<svg width={s} height={s} viewBox="0 0 100 92" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, transform: `rotate(${rot}deg)`, overflow: 'visible', filter: `drop-shadow(0 0 ${s * 0.12}px ${PINK})`}}>
		<path d="M50 88 C20 66 4 48 4 28 C4 12 16 4 28 4 C40 4 47 12 50 20 C53 12 60 4 72 4 C84 4 96 12 96 28 C96 48 80 66 50 88 Z" fill={PINK} stroke={INK} strokeWidth={6} />
		<path d="M20 24 Q22 14 32 13" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" />
	</svg>
);
const Zap: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = 0}) => (
	<svg width={s * 0.7} height={s} viewBox="0 0 70 100" style={{position: 'absolute', left: x - s * 0.35, top: y - s / 2, transform: `rotate(${rot}deg)`, overflow: 'visible', filter: `drop-shadow(0 0 ${s * 0.1}px #FFD23F)`}}>
		<path d="M40 2 L6 56 L32 56 L22 98 L64 38 L38 38 Z" fill="#FFD23F" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
	</svg>
);
const SplitBolt: React.FC<{x: number}> = ({x}) => {
	const p = `M${x + 70} 0 L${x - 10} 420 L${x + 60} 430 L${x - 60} 1080 L${x - 120} 1080 L${x - 30} 520 L${x - 100} 510 L${x - 10} 0 Z`;
	return <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.7))'}}><path d={p} fill="#fff" stroke={INK} strokeWidth={10} strokeLinejoin="round" /></svg>;
};
const RightClip: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div style={{position: 'absolute', inset: 0, overflow: 'hidden', clipPath: 'polygon(1020px 0, 100% 0, 100% 100%, 890px 100%, 1012px 431px, 944px 421px)'}}>{children}</div>
);

// ------------------------------------------------------------------ thumbnails
const LATc = fit(960, 560, 900);
const WORLDc = {x: 1915, y: 880, z: 0.62};

// 1. title top + bottom, glowing union centre (like "¿Y si Argentina conquistara todo?")
export const U1: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Bg cam={WORLDc} mood="scared" />
		<Vig />
		<UnionX h={800} x={960} y={560} m="evil" glow="#FFD23F" look={[0.3, 0.1]} />
		<QBadge x={330} y={560} d={130} /><QBadge x={1590} y={420} d={110} /><QBadge x={1520} y={700} d={90} />
		<TT parts={[['¿Y SI'], ['LATINOAMÉRICA', YEL]]} size={128} style={{top: 22}} />
		<TT parts={[['FUESE UNA'], ['SELECCIÓN?', RED]]} size={128} style={{top: 900}} />
	</AbsoluteFill>
);
// 2. battle royale: union vs Spain
export const U2: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Bg cam={{x: 1500, y: 800, z: 0.9}} blur={5} dark={0.35} />
		<Vig o={0.6} />
		<UnionX h={880} x={440} y={585} m="rage" glow="#FF3B3B" look={[0.6, 0]} />
		<StickerX k="ESP" w={660} x={1490} y={580} m="terror" look={[-0.6, 0]} />
		<VsX x={960} y={570} d={230} />
		<TT parts={[['LATINOAMÉRICA', YEL], ['VS'], ['ESPAÑA', RED]]} size={112} style={{top: 26}} />
		<TT parts={[['¿QUIÉN GANA?']]} size={140} style={{top: 905}} />
	</AbsoluteFill>
);
// 3. split: 20 flags on the map | bolt | union on golden rays
const G20 = L.slice(0, 20);
export const U3: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Bg cam={LATc} blur={3} dark={0.4} />
		<div style={{position: 'absolute', inset: 0, background: 'rgba(5,20,45,0.25)'}} />
		{G20.map((k, i) => <Tile key={k} k={k} w={180} x={130 + (i % 4) * 205} y={300 + Math.floor(i / 4) * 160} rot={((i * 37) % 11) - 5} />)}
		<RightClip><Rays cx="72%" cy="55%" /><Confetti seed={5} n={40} /></RightClip>
		<SplitBolt x={960} />
		<UnionX h={800} x={1440} y={600} m="evil" glow="#FFF3A0" look={[-0.3, 0]} />
		<TT parts={[['¿20 SELECCIONES'], ['=', YEL], ['1?!', YEL]]} size={120} style={{top: 24}} />
	</AbsoluteFill>
);
// 4. equation: balls + balls + ... = union
export const U4: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Bg cam={WORLDc} blur={4} dark={0.35} mood="worried" />
		<Vig o={0.6} />
		<BallX k="MEX" d={230} x={190} y={430} m="shock" look={[0.5, 0]} />
		<Plus x={345} y={430} s={110} />
		<BallX k="BRA" d={230} x={500} y={430} m="evil" look={[0.5, 0]} />
		<Plus x={655} y={430} s={110} />
		<BallX k="ARG" d={230} x={810} y={430} m="rage" look={[0.5, 0]} />
		<BallX k="URY" d={190} x={260} y={700} m="shock" look={[0.5, -0.2]} />
		<Plus x={400} y={700} s={100} />
		<BallX k="COL" d={190} x={540} y={700} m="terror" look={[0.5, -0.2]} />
		<Plus x={680} y={700} s={100} />
		<Plus x={790} y={700} s={110} t="..." c="#fff" />
		<Plus x={1000} y={560} s={190} t="=" />
		<UnionX h={820} x={1480} y={590} m="evil" glow="#FFD23F" look={[-0.4, 0]} />
		<TT parts={[['¿LA SELECCIÓN'], ['DEFINITIVA?', YEL]]} size={120} style={{top: 26}} />
	</AbsoluteFill>
);
// 5. champion: crown, 10 stars, cup, rays
export const U5: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Rays cx="50%" cy="60%" n={28} c1="#1F6FD1" c2="#1556A8" />
		<Confetti seed={9} n={80} />
		<UnionX h={720} x={960} y={620} m="evil" glow="#FFD23F" look={[0, 0.1]} />
		<Crown x={1010} y={262} w={250} rot={10} />
		{Array.from({length: 10}, (_, i) => { const a = Math.PI * (1.08 + (i / 9) * 0.84); return <StarX key={i} x={960 + Math.cos(a) * 560} y={640 + Math.sin(a) * 430} s={92} rot={(i - 4.5) * 6} />; })}
		<Cup x={330} y={700} h={360} rot={-10} />
		<Cup x={1600} y={700} h={360} rot={10} />
		<TT parts={[['¿10'], ['MUNDIALES?!', YEL]]} size={150} style={{top: 14}} />
		<TT parts={[['LATINOAMÉRICA UNIDA']]} size={110} style={{top: 930}} />
	</AbsoluteFill>
);
// 6. the world trembles: whole map scared, union glowing
export const U6: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Bg cam={{x: 1700, y: 760, z: 0.75}} mood="panic" dark={0.3} latGrey />
		<Vig o={0.5} />
		<UnionX h={900} x={500} y={560} m="evil" glow="#FF8A00" look={[0.6, 0]} />
		<Zap x={1470} y={600} s={210} rot={12} /><Zap x={1160} y={790} s={160} rot={-14} />
		<QBadge x={1230} y={560} d={140} /><QBadge x={1720} y={740} d={120} />
		<TT parts={[['¿EL MUNDO']]} size={150} style={{top: 36, left: 880}} />
		<TT parts={[['TIEMBLA?', RED]]} size={190} style={{top: 200, left: 880}} />
		<TT parts={[['SI LATINOAMÉRICA'], ['SE UNE', YEL]]} size={96} style={{top: 940, left: 760}} />
	</AbsoluteFill>
);
// 7. split: map | storm, angry union with steam
export const U7: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Bg cam={{x: 1850, y: 520, z: 1.4}} dark={0.25} mood="panic" />
		<RightClip><Storm /></RightClip>
		<SplitBolt x={960} />
		<StickerX k="DEU" w={520} x={300} y={420} m="terror" look={[0.6, 0]} rot={-6} />
		<StickerX k="FRA" w={500} x={560} y={760} m="shock" look={[0.6, 0]} rot={5} />
		<UnionX h={840} x={1450} y={600} m="rage" glow="#B46BFF" look={[-0.6, 0]} />
		<TT parts={[['¿LA MÁS FUERTE'], ['DEL MUNDO?', YEL]]} size={112} style={{top: 20}} />
	</AbsoluteFill>
);
// 8. love: heart eyes, hearts, ring of flag balls
export const U8: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Bg cam={LATc} blur={4} dark={0.35} />
		<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 58%, rgba(255,95,162,0.35), rgba(0,0,0,0.45) 75%)'}} />
		{['MEX', 'COL', 'PER', 'CHL', 'URY', 'PRY', 'ECU', 'BOL'].map((k, i) => { const a = Math.PI * (0.62 + (i / 7) * 1.76) + Math.PI / 2; return <BallX key={k} k={k} d={170} x={960 + Math.cos(a) * 720} y={610 + Math.sin(a) * 370} m="shock" f12="love" />; })}
		<UnionX h={740} x={960} y={600} f12="love" glow={PINK} />
		<Heart x={560} y={420} s={110} rot={-14} /><Heart x={1300} y={280} s={90} rot={12} /><Heart x={1250} y={880} s={80} rot={-8} />
		<TT parts={[['¿UNIDOS', PINK], ['SERÍAN'], ['IMBATIBLES?', YEL]]} size={104} style={{top: 26}} />
	</AbsoluteFill>
);
export const T22_U = [U1, U2, U3, U4, U5, U6, U7, U8];
