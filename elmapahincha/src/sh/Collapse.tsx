// "¿Y si X se desmoronara?" vertical short engine (countryball style, reference: What if Spain collapses)
import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {FlagCover} from '../flagCover';

export const W = 1080, H = 1920, FPS = 60;
const INK = '#17130F';
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeInOut = (t: number) => { t = clamp01(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const backOut = (t: number) => { t = clamp01(t); const c = 2.2; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const elastic = (t: number) => (t <= 0 ? 0 : t >= 1.6 ? 1 : 1 - Math.exp(-6 * t) * Math.cos(11 * t));

export type Mood = 'worried' | 'shock' | 'cry' | 'happy' | 'smug' | 'angry';
export type Geo = {states: Record<string, {d: string; c: number[]; b: number[]}>; countries: Record<string, {d: string; c: number[]}>};
export type Region = {
	id: string; states: string[]; flag: string; name: string; verb: string; verbCol: string; pill: string; label: string;
	bubble: string; heroBubble: string; heroMood?: Mood; hero: [number, number]; joiner?: {flag: string; pos: [number, number]; bubble: string};
	pct: number; dur?: number;
};
export type CollapseCfg = {
	geo: Geo; country: string; heroFlag: string; hud: string; title: [string, string, string]; based: string; help: string;
	regions: Region[]; finale: [string, string, string, string]; pct0?: number; start: [number, number];
	vo?: Record<string, number>; voPrefix?: string;
};

// ---------------------------------------------------------------- countryball
export const Ball: React.FC<{flag: string; size: number; mood: Mood; t: number; id: string; look?: number; talk?: number}> = ({flag, size, mood, t, id, look = 0, talk = 0}) => {
	const blink = (t % 170) < 6 && mood !== 'cry' && mood !== 'happy';
	const lx = look * 6;
	const eye = (cx: number, flip: number) => {
		if (mood === 'happy') return <path d={`M${cx - 22} ${102} Q${cx} ${80} ${cx + 22} ${102}`} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />;
		if (mood === 'cry') return <g><path d={`M${cx - 24} ${96} Q${cx} ${110} ${cx + 24} ${96}`} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" /><rect x={cx - 12} y={104} width={24} height={90} rx={10} fill="#7FD3FF" opacity={0.85} /></g>;
		const ry = mood === 'shock' ? 34 : 30, rx = mood === 'shock' ? 28 : 27;
		return (
			<g>
				<ellipse cx={cx} cy={96} rx={rx} ry={blink ? 3 : ry} fill="#fff" stroke={INK} strokeWidth={7} />
				{!blink && <circle cx={cx + lx + (mood === 'worried' ? 0 : 0)} cy={mood === 'worried' ? 108 : 98} r={mood === 'shock' ? 7 : 10} fill={INK} />}
				{(mood === 'worried' || mood === 'smug') && !blink && <path d={`M${cx - rx - 4} ${mood === 'smug' ? 92 : 86 + flip * 6} L${cx + rx + 4} ${mood === 'smug' ? 92 : 86 - flip * 6} L${cx + rx + 4} 60 L${cx - rx - 4} 60Z`} fill={`url(#bf${id})`} stroke="none" />}
				{(mood === 'worried' || mood === 'smug') && !blink && <path d={`M${cx - rx - 2} ${mood === 'smug' ? 92 : 86 + flip * 6} L${cx + rx + 2} ${mood === 'smug' ? 92 : 86 - flip * 6}`} stroke={INK} strokeWidth={7} strokeLinecap="round" />}
				{mood === 'angry' && <path d={`M${cx - 30} ${64 - flip * 10} L${cx + 30} ${64 + flip * 10}`} stroke={INK} strokeWidth={10} strokeLinecap="round" />}
			</g>
		);
	};
	const mouth =
		mood === 'happy' ? <path d="M70 140 Q100 172 130 140Z" fill="#7A1020" stroke={INK} strokeWidth={6} strokeLinejoin="round" /> :
		mood === 'smug' ? <path d="M78 148 Q104 160 128 140" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" /> :
		mood === 'shock' ? <ellipse cx={100} cy={152} rx={14} ry={18} fill="#7A1020" stroke={INK} strokeWidth={6} /> :
		mood === 'cry' ? <path d="M72 158 Q100 126 128 158Z" fill="#7A1020" stroke={INK} strokeWidth={6} strokeLinejoin="round" /> :
		mood === 'angry' ? <g><rect x={70} y={138} width={60} height={24} rx={6} fill="#fff" stroke={INK} strokeWidth={6} /><path d="M85 138V162M100 138V162M115 138V162" stroke={INK} strokeWidth={4} /></g> :
		<path d="M74 150 L84 142 L94 150 L104 142 L114 150 L124 142" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />;
	const mouthT = talk > 0.02 ? (mood === 'angry' ? <g><rect x={70} y={136} width={60} height={14 + 22 * talk} rx={8} fill="#7A1020" stroke={INK} strokeWidth={6} /><rect x={74} y={138} width={52} height={8} fill="#fff" /></g> : <g><ellipse cx={100} cy={150} rx={20 + 6 * talk} ry={6 + 18 * talk} fill="#7A1020" stroke={INK} strokeWidth={6} /><ellipse cx={100} cy={158 + 8 * talk} rx={10} ry={4 * talk} fill="#E2606E" /></g>) : null;
	return (
		<svg width={size} height={size * 1.12} viewBox="0 0 200 224" style={{overflow: 'visible', display: 'block'}}>
			<defs>
				<clipPath id={`bc${id}`}><circle cx={100} cy={100} r={92} /></clipPath>
				<radialGradient id={`bg${id}`} cx="35%" cy="28%" r="80%"><stop offset="0%" stopColor="#fff" stopOpacity={0.45} /><stop offset="35%" stopColor="#fff" stopOpacity={0.05} /><stop offset="75%" stopColor="#000" stopOpacity={0.18} /><stop offset="100%" stopColor="#000" stopOpacity={0.5} /></radialGradient>
				<linearGradient id={`gl${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5B2D8C" stopOpacity={0.75} /><stop offset="1" stopColor="#5B2D8C" stopOpacity={0} /></linearGradient>
				<pattern id={`bf${id}`} width={200} height={200} patternUnits="userSpaceOnUse"><FlagCover flag={flag} x={-20} y={8} w={240} h={184} /></pattern>
			</defs>
			<ellipse cx={100} cy={206} rx={78} ry={14} fill="#000" opacity={0.3} />
			<g clipPath={`url(#bc${id})`}>
				<FlagCover flag={flag} x={-20} y={8} w={240} h={184} />
				<rect width={200} height={200} fill={`url(#bg${id})`} />
				{mood === 'worried' && <rect width={200} height={70} fill={`url(#gl${id})`} />}
			</g>
			<circle cx={100} cy={100} r={92} fill="none" stroke={INK} strokeWidth={8} />
			<g transform={`translate(${lx * 0.5} 0)`}>{eye(68, 1)}{eye(132, -1)}{mouthT ?? mouth}</g>
			{mood === 'worried' && <path d="M168 50 Q176 66 168 74 Q160 66 168 50Z" fill="#7FD3FF" stroke={INK} strokeWidth={3} />}
			{mood === 'angry' && <g transform="translate(160 24)"><path d="M-12 -2 L-2 -2 L-2 -12 M12 -2 L2 -2 L2 -12 M-12 2 L-2 2 L-2 12 M12 2 L2 2 L2 12" stroke="#E0202A" strokeWidth={6} fill="none" strokeLinecap="round" /></g>}
		</svg>
	);
};

// ---------------------------------------------------------------- text helpers
const tx = (size: number, color: string, sw = 0.16): React.CSSProperties => ({fontFamily: LILITA, fontSize: size, color, lineHeight: 1, WebkitTextStroke: `${size * sw}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.08}px 0 ${INK}`, whiteSpace: 'nowrap', letterSpacing: 1});
const Bubble: React.FC<{text: string; x: number; y: number; p: number; side?: 'l' | 'r'}> = ({text, x, y, p, side = 'r'}) => {
	const w = text.length * 23 + 54;
	let left = side === 'r' ? x - w * 0.12 : x - w * 0.88;
	left = Math.max(24, Math.min(W - 24 - w, left));
	const tail = Math.max(14, Math.min(w - 54, x - left - 20));
	return (
		<div style={{position: 'absolute', left, top: y, width: w, transform: `translateY(-100%) scale(${p})`, transformOrigin: `${tail + 20}px 100%`, opacity: clamp01(p * 3)}}>
			<div style={{position: 'relative', padding: '10px 0', textAlign: 'center', borderRadius: 18, background: '#fff', border: `5px solid ${INK}`, fontFamily: LILITA, fontSize: 40, color: INK, whiteSpace: 'nowrap', boxShadow: '0 5px 0 rgba(0,0,0,0.3)'}}>
				{text}
				<svg width={40} height={26} style={{position: 'absolute', left: tail, bottom: -23}}><path d={side === 'r' ? 'M2 0 L6 24 L30 0' : 'M38 0 L34 24 L10 0'} fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><rect x={4} y={-6} width={32} height={8} fill="#fff" /></svg>
			</div>
		</div>
	);
};
const Pill: React.FC<{text: string; p: number; y: number; bg?: string; size?: number}> = ({text, p, y, bg = '#F7E7B0', size = 36}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: clamp01(p * 4)}}>
		<div style={{maxWidth: 980 * easeOut(p), overflow: 'hidden', padding: '10px 30px', borderRadius: 40, background: bg, border: `5px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)', fontFamily: LILITA, fontSize: size, color: INK, whiteSpace: 'nowrap'}}>{text}</div>
	</div>
);

// ---------------------------------------------------------------- engine
type Cam = {x: number; y: number; z: number};
export function makeCollapse(C: CollapseCfg) {
	const INTRO = 200, FIN = 420, SEG = 280;
	const VO = C.vo ?? {};
	const d = (k: string) => Math.round((VO[k] ?? 0.9) * FPS);
	// per-segment voice timings (frames from segment start): region line, joiner line, hero line
	const TM = C.regions.map((r) => { const tR = 64; const tJ = r.joiner ? tR + d('r_' + r.id) + 6 : -1; const tH = (r.joiner ? tJ + d('j_' + r.id) : tR + d('r_' + r.id)) + 8; return {tR, tJ, tH, eR: tR + d('r_' + r.id), eJ: r.joiner ? tJ + d('j_' + r.id) : -1, eH: tH + d('h_' + r.id)}; });
	const segs = C.regions.map((r, i) => r.dur ?? Math.max(SEG, TM[i].eH + 70));
	const HELP0 = 92, HELPE = HELP0 + d('h_intro'), FINV = 140;
	const S0: number[] = [];
	let t0 = INTRO;
	segs.forEach((d) => { S0.push(t0); t0 += d; });
	const F0 = t0, TOTAL = F0 + FIN;
	const G = C.geo;
	const tgt = Object.values(G.states);
	const allB = (names: string[]) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const n of names) { const b = G.states[n].b; x0 = Math.min(x0, b[0]); y0 = Math.min(y0, b[1]); x1 = Math.max(x1, b[2]); y1 = Math.max(y1, b[3]); } return [x0, y0, x1, y1]; };
	const ALLB = allB(Object.keys(G.states));
	const boxCam = (b: number[], extra: [number, number][] = [], fw = 860, fh = 1000, cy = 820): Cam => {
		let [x0, y0, x1, y1] = b;
		for (const [x, y] of extra) { x0 = Math.min(x0, x - 150); x1 = Math.max(x1, x + 150); y0 = Math.min(y0, y - 150); y1 = Math.max(y1, y + 120); }
		const z = Math.min(3.2, fw / (x1 - x0), fh / (y1 - y0));
		return {x: (x0 + x1) / 2, y: (y0 + y1) / 2 + (960 - cy) / z, z};
	};
	const FULL = boxCam(ALLB, [], 1000, 1150, 900);
	const regB = C.regions.map((r) => allB(r.states));
	const regC = regB.map((b) => [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2] as [number, number]);
	const regCams = C.regions.map((r, i) => boxCam(regB[i], [r.hero, ...(r.joiner ? [r.joiner.pos] : [])]));
	const camAt = (f: number): Cam => { const c0 = camAt0(f); return {x: c0.x + (Math.sin(f / 53) * 16 + Math.sin(f / 23) * 5) / c0.z, y: c0.y + (Math.cos(f / 41) * 12 + Math.cos(f / 19) * 4) / c0.z, z: c0.z * (1 + 0.014 * Math.sin(f / 37))}; };
	const camAt0 = (f: number): Cam => {
		const lerp = (a: Cam, b: Cam, t: number): Cam => ({x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * t)});
		const startCam: Cam = {x: C.start[0], y: C.start[1] - 40, z: 3.4};
		if (f < INTRO) { const t = easeInOut(f / 110); const c = lerp(startCam, FULL, t); return {...c, z: c.z * (1 + 0.06 * clamp01((f - 100) / 100))}; }
		for (let i = 0; i < segs.length; i++) {
			if (f < S0[i] + segs[i]) {
				const u = f - S0[i];
				const prev = i === 0 ? {...FULL, z: FULL.z * 1.03} : {...regCams[i - 1], z: regCams[i - 1].z * 1.06};
				const t = easeInOut(u / 26);
				const c = lerp(prev, regCams[i], t);
				const k = Math.max(0, u - 26) / (segs[i] - 26);
				return {...c, x: c.x + (k * 50) / c.z, z: c.z * (1 + 0.1 * k)};
			}
		}
		const u = f - F0; const last = {...regCams[segs.length - 1], z: regCams[segs.length - 1].z * 1.06};
		const c = lerp(last, FULL, easeInOut(u / 30));
		return {...c, z: c.z * (1 + 0.08 * clamp01((u - 30) / (FIN - 30)))};
	};
	const pctAt = (f: number) => {
		let p = C.pct0 ?? 100;
		for (let i = 0; i < segs.length; i++) { const u = f - S0[i] - 34; if (u >= 0) { const prev = i === 0 ? (C.pct0 ?? 100) : C.regions[i - 1].pct; p = prev + (C.regions[i].pct - prev) * clamp01(u / 40); } }
		return Math.round(p);
	};

	const sfx = () => {
		const o: {f: number; name: string; vol: number}[] = [];
		const S = (f: number, n: string, v = 0.4) => o.push({f: Math.round(f), name: n, vol: v});
		S(0, 'boom', 0.45); S(4, 'slap', 0.45); S(12, 'pop_1', 0.35); S(20, 'pop_2', 0.35); S(70, 'whoosh_2', 0.3); S(95, 'pop_3', 0.35);
		C.regions.forEach((r, i) => {
			const s = S0[i];
			S(s - 4, `whoosh_${(i % 4) + 1}`, 0.5); S(s + 14, 'glitch', 0.25); S(s + 22, 'boom', 0.45); S(s + 26, 'pop_2', 0.45);
			S(s + 40, 'slap', 0.35); S(s + 52, 'pop_4', 0.3); S(s + 62, 'select', 0.3);
			for (let k = 0; k < 6; k++) S(s + 34 + k * 7, 'tick', 0.15);
			S(s + 70, 'pop_1', 0.35); S(s + 105, 'pop_3', 0.35); S(s + 150, 'error', 0.25);
			if (r.joiner) S(s + 80, 'pop_2', 0.4);
		});
		const P = C.voPrefix ?? 'vo';
		S(HELP0, `${P}_h_intro`, 1.0);
		C.regions.forEach((r, i) => { const s = S0[i]; S(s + TM[i].tR, `${P}_r_${r.id}`, 1.0); if (r.joiner) S(s + TM[i].tJ, `${P}_j_${r.id}`, 1.0); S(s + TM[i].tH, `${P}_h_${r.id}`, 1.0); });
		S(F0 + FINV, `${P}_h_fin`, 1.0);
		S(F0 - 4, 'whoosh_4', 0.5); S(F0 + 30, 'boom', 0.4); S(F0 + 40, 'slap', 0.4); S(F0 + 56, 'slap', 0.4); S(F0 + 150, 'confirm', 0.35); S(F0 + 180, 'pop_1', 0.35);
		return o.sort((a, b) => a.f - b.f);
	};
	const music = () => `m_tense:0:${(TOTAL / FPS).toFixed(2)}`;

	const talkAt = (f: number, a: number, e: number) => (f >= a && f < e ? 0.35 + 0.65 * Math.abs(Math.sin((f - a) / 3.3)) * (0.6 + 0.4 * Math.sin((f - a) / 7.1)) : 0);
	const bob = (f: number, ph: number, talking: number) => `translateY(${Math.sin(f / 9 + ph) * 7 - talking * 8}px) rotate(${Math.sin(f / 23 + ph) * 3}deg) scale(${1 + 0.025 * Math.sin(f / 9 + ph) + talking * 0.05}, ${1 - 0.025 * Math.sin(f / 9 + ph) + talking * 0.06})`;
	const Video: React.FC = () => {
		const f = useCurrentFrame();
		const cam = camAt(f);
		const camP = camAt(f - 1);
		const vel = Math.hypot((cam.x - camP.x) * cam.z, (cam.y - camP.y) * cam.z) + Math.abs(Math.log(cam.z / camP.z)) * 900;
		const blur = Math.min(10, vel * 0.12);
		const seg = S0.findIndex((s, i) => f >= s && f < s + segs[i]);
		const u = seg >= 0 ? f - S0[seg] : 0;
		const fin = f >= F0;
		// regions already gone (incl. current after flash)
		const goneIdx = C.regions.map((_, i) => (f >= S0[i] + 14 ? i : -1)).filter((i) => i >= 0);
		const tr = `translate(${W / 2 + 60} ${H / 2 + 60}) scale(${cam.z}) translate(${-cam.x} ${-cam.y})`;
		const toS = (x: number, y: number) => [W / 2 + (x - cam.x) * cam.z, H / 2 + (y - cam.y) * cam.z];
		const z = cam.z;
		const flash = seg >= 0 ? Math.max(0, 1 - Math.abs(u - 12) / 10) * 0.75 : fin ? Math.max(0, 1 - Math.abs(f - F0 - 26) / 12) * 0.8 : 0;
		const tgtIdx = new Set(C.regions.flatMap((r, i) => (goneIdx.includes(i) ? r.states : [])));
		return (
			<AbsoluteFill style={{background: '#0E86B5', overflow: 'hidden'}}>
				<Fonts />
				<div style={{position: 'absolute', inset: -60, transform: `rotate(${Math.sin(f / 97) * 0.5}deg)`, filter: blur > 0.6 ? `blur(${blur.toFixed(1)}px)` : undefined}}>
					<svg width={W + 120} height={H + 120} style={{position: 'absolute', left: 0, top: 0}}>
						<defs>
							<linearGradient id="sea" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#1A9DCB" /><stop offset="1" stopColor="#0C77A8" /></linearGradient>
							<radialGradient id="lite" cx="30%" cy="20%" r="90%"><stop offset="0" stopColor="#fff" stopOpacity={0.16} /><stop offset="1" stopColor="#000" stopOpacity={0.12} /></radialGradient>
							<pattern id="wav" width={180} height={60} patternUnits="userSpaceOnUse" patternTransform={`translate(${(f * 0.6) % 180} ${Math.sin(f / 40) * 8})`}><path d="M0 30 Q22 14 45 30 T90 30" fill="none" stroke="#7FD8F0" strokeWidth={3} strokeLinecap="round" opacity={0.55} /></pattern>
							<radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="60%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.4} /></radialGradient>
							{C.regions.map((r, i) => <clipPath key={r.id} id={`rc${r.id}`}>{r.states.map((n) => <path key={n} d={G.states[n].d} />)}</clipPath>)}
						</defs>
						<rect width={W + 120} height={H + 120} fill="url(#sea)" />
						<g transform={tr}>
							<rect x={-2000} y={-2000} width={8000} height={8000} fill="url(#wav)" opacity={0.5} />
							{/* shallow coastal band */}
							<g fill="none" stroke="#56C8E6" strokeLinejoin="round">
								<g strokeWidth={46 / z} opacity={0.35}>{Object.values(G.countries).map((c, i) => <path key={i} d={c.d} />)}</g>
								<g strokeWidth={20 / z} opacity={0.6}>{Object.values(G.countries).map((c, i) => <path key={i} d={c.d} />)}</g>
							</g>
							{Object.entries(G.countries).map(([n, c]) => <path key={n} d={c.d} fill={n === C.country ? '#E8553D' : '#E9D7A5'} stroke="#B49F6E" strokeWidth={1.6 / z} strokeLinejoin="round" />)}
							{Object.entries(G.states).map(([n, s]) => <path key={n} d={s.d} fill={tgtIdx.has(n) ? '#C8452F' : '#E8553D'} stroke="#F7896D" strokeWidth={1.8 / z} strokeLinejoin="round" />)}
							{/* broken-away regions, lifted with flag */}
							{C.regions.map((r, i) => {
								if (!goneIdx.includes(i)) return null;
								const uu = f - S0[i];
								const white = uu < 24 ? clamp01((uu - 14) / 4) : 1 - clamp01((uu - 24) / 8);
								const lift = (fin ? 0.6 : i === seg ? 1 : 0.6) * easeOut((uu - 20) / 14);
								const pop = 1 + 0.05 * Math.sin(clamp01((uu - 20) / 16) * Math.PI);
								const b = regB[i]; const [cx, cy] = regC[i];
								return (
									<g key={r.id} transform={`translate(${cx} ${cy}) scale(${pop}) translate(${-cx} ${-cy - (10 * lift) / z})`}>
										<g transform={`translate(${5 / z} ${14 * lift / z})`} opacity={0.35 * lift}>{r.states.map((n) => <path key={n} d={G.states[n].d} fill="#3A0F08" />)}</g>
										<g clipPath={`url(#rc${r.id})`}><FlagCover flag={r.flag} x={b[0]} y={b[1]} w={b[2] - b[0]} h={b[3] - b[1]} /><rect x={b[0]} y={b[1]} width={b[2] - b[0]} height={b[3] - b[1]} fill="url(#lite)" /></g>
										{r.states.map((n) => <path key={n} d={G.states[n].d} fill="#fff" opacity={white} />)}
										<g fill="none" strokeLinejoin="round">{r.states.map((n) => <path key={n} d={G.states[n].d} stroke="#fff" strokeWidth={5 / z} />)}{r.states.map((n) => <path key={n + 'k'} d={G.states[n].d} stroke={INK} strokeWidth={2.2 / z} />)}</g>
									</g>
								);
							})}
							{/* target outline */}
							<g fill="none" stroke="#7E2212" strokeWidth={2.4 / z} strokeLinejoin="round" opacity={0.6}>{tgt.map((s, i) => <path key={i} d={s.d} />)}</g>
						</g>
						<rect width={W + 120} height={H + 120} fill="url(#lite)" />
					</svg>
				</div>
				{/* shockwave ring */}
				{seg >= 0 && u >= 20 && u < 70 && (() => { const [sx, sy] = toS(...regC[seg]); const p = easeOut((u - 20) / 50); return <div style={{position: 'absolute', left: sx - 600 * p, top: sy - 600 * p, width: 1200 * p, height: 1200 * p, borderRadius: '50%', border: `${8 * (1 - p) + 2}px solid rgba(255,255,255,${0.9 * (1 - p)})`}} />; })()}
				{/* region labels + balls */}
				{C.regions.map((r, i) => {
					if (!goneIdx.includes(i)) return null;
					const uu = f - S0[i];
					const [sx, sy] = toS(...regC[i]);
					const cur = i === seg;
					const small = fin || !cur;
					const bs = small ? 110 : 190;
					const pop = elastic((uu - 22) / 40);
					const by = sy - bs * 0.5;
					return (
						<React.Fragment key={r.id}>
							<div style={{position: 'absolute', left: sx - bs / 2, top: by - bs * 0.06, transform: `scale(${pop}) ${bob(f, i * 1.7, cur ? talkAt(uu, TM[i].tR, TM[i].eR) : 0)}`, transformOrigin: '50% 90%'}}><Ball flag={r.flag} size={bs} mood={cur && uu > 60 ? 'happy' : 'smug'} t={f + i * 40} id={'r' + r.id} talk={cur ? talkAt(uu, TM[i].tR, TM[i].eR) : 0} /></div>
							{(cur || fin) && <div style={{position: 'absolute', left: sx - 300, width: 600, top: by - (small ? 52 : 70), display: 'flex', justifyContent: 'center', transform: `scale(${backOut((uu - 30) / 12)})`}}><span style={tx(small ? 32 : 44, '#FFD43B', 0.18)}>{r.label}</span></div>}
							{cur && uu > TM[i].tR && uu < segs[i] - 16 && (() => { const hx = toS(...r.hero)[0]; const right = hx < sx; return <Bubble text={r.bubble} x={right ? sx + bs * 0.3 : sx - bs * 0.3} y={by - 76} p={backOut((uu - TM[i].tR) / 10)} side={right ? 'r' : 'l'} />; })()}
						</React.Fragment>
					);
				})}
				{/* joiner ball (e.g. neighbour that absorbs the region) */}
				{seg >= 0 && C.regions[seg].joiner && (() => { const j = C.regions[seg].joiner!; const [sx, sy] = toS(...j.pos); const tm = TM[seg]; const tk = talkAt(u, tm.tJ, tm.eJ); const p = elastic((u - tm.tJ + 30) / 40); return <><div style={{position: 'absolute', left: sx - 90, top: sy - 100, transform: `scale(${p}) ${bob(f, 2.2, tk)}`, transformOrigin: '50% 90%'}}><Ball flag={j.flag} size={180} mood="happy" t={f} id="jn" talk={tk} /></div>{u > tm.tJ && u < segs[seg] - 16 && <Bubble text={j.bubble} x={sx + 50} y={sy - 90} p={backOut((u - tm.tJ) / 10)} />}</>; })()}
				{/* hero ball */}
				{(() => {
					let pos: [number, number] = C.start, mood: Mood = 'worried', bub: string | null = null, bp = 0, size = 260, alarm = 0, talk = 0;
					if (f < INTRO) { size = 320 - 60 * easeInOut(f / 110); talk = talkAt(f, HELP0, HELPE); if (f > HELP0) { bub = C.help; bp = backOut((f - HELP0) / 10); } }
					else if (seg >= 0) {
						const r = C.regions[seg]; const prevPos = seg === 0 ? C.start : C.regions[seg - 1].hero;
						const t = easeInOut(u / 26);
						pos = [prevPos[0] + (r.hero[0] - prevPos[0]) * t, prevPos[1] + (r.hero[1] - prevPos[1]) * t];
						const tm = TM[seg];
						mood = u < 30 ? 'worried' : u < tm.tH ? (r.heroMood ?? 'shock') : u < tm.eH + 10 ? (r.heroMood === 'angry' ? 'angry' : 'shock') : 'cry';
						alarm = u >= 30 && u < tm.eH && (r.heroMood ?? 'shock') === 'shock' ? 1 : 0;
						talk = talkAt(u, tm.tH, tm.eH);
						if (u > tm.tH && u < segs[seg] - 16) { bub = r.heroBubble; bp = backOut((u - tm.tH) / 10); }
						size = 230;
					} else { const last = C.regions[C.regions.length - 1].hero; const t = easeInOut((f - F0) / 30); pos = [last[0] + (C.start[0] - last[0]) * t, last[1] + (C.start[1] - last[1]) * t]; mood = f - F0 > 60 ? 'smug' : 'cry'; size = 210; talk = talkAt(f - F0, FINV, FINV + d('h_fin')); }
					const [sx, sy] = toS(...pos);
					const jump = seg >= 0 && u >= 30 && u < 44 ? -Math.sin(((u - 30) / 14) * Math.PI) * 30 : 0;
					const shake = mood === 'shock' || mood === 'angry' ? Math.sin(f * 1.7) * 3 : 0;
					return (
						<>
							<div style={{position: 'absolute', left: sx - size / 2 + shake, top: sy - size / 2 + jump, transform: bob(f, 0, talk), transformOrigin: '50% 90%'}}><Ball flag={C.heroFlag} size={size} mood={mood} t={f} id="hero" talk={talk} /></div>
							{alarm > 0 && <div style={{position: 'absolute', left: sx - 40, top: sy - size * 0.95, fontFamily: LILITA, fontSize: 90, color: '#E0202A', WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill', transform: `scale(${backOut((u - 30) / 8)}) rotate(-8deg)`}}>!!</div>}
							{alarm > 0 && <svg width={size * 1.8} height={size * 1.8} style={{position: 'absolute', left: sx - size * 0.9, top: sy - size * 0.9, overflow: 'visible', opacity: 0.85}}>{Array.from({length: 10}, (_, k) => { const a = (k / 10) * Math.PI * 2 + 0.3; const r0 = size * 0.62, r1 = size * (0.72 + 0.06 * Math.sin(f / 3 + k)); return <line key={k} x1={size * 0.9 + Math.cos(a) * r0} y1={size * 0.9 + Math.sin(a) * r0} x2={size * 0.9 + Math.cos(a) * r1} y2={size * 0.9 + Math.sin(a) * r1} stroke="#fff" strokeWidth={6} strokeLinecap="round" />; })}</svg>}
							{bub && (() => { const rx = seg >= 0 ? toS(...regC[seg])[0] : 0; const right = seg >= 0 ? sx > rx : true; return <Bubble text={bub} x={right ? sx + size * 0.25 : sx - size * 0.25} y={sy - size * 0.48} p={bp} side={right ? 'r' : 'l'} />; })()}
						</>
					);
				})()}
				{/* white flash */}
				{flash > 0.01 && <AbsoluteFill style={{background: '#FFFDF5', opacity: flash}} />}
				{/* intro title */}
				{f < INTRO + 20 && (() => {
					const o = 1 - clamp01((f - INTRO + 8) / 14);
					return (
						<div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: o}}>
							<div style={{transform: `scale(${backOut(f / 10)}) rotate(-3deg)`}}><span style={tx(110, '#FFE14D')}>{C.title[0]}</span></div>
							<div style={{transform: `scale(${backOut((f - 6) / 10)}) rotate(-3deg)`, marginTop: -6}}><span style={tx(190, '#F03A2E')}>{C.title[1]}</span></div>
							<div style={{transform: `scale(${backOut((f - 12) / 10)}) rotate(-3deg)`, marginTop: -4}}><span style={tx(96, '#F03A2E')}>{C.title[2]}</span></div>
						</div>
					);
				})()}
				{f >= 60 && f < INTRO + 20 && <Pill text={C.based} p={(f - 60) / 18} y={600} bg="#FFD23F" size={40} />}
				{/* HUD */}
				{f >= INTRO - 10 && !(fin && f - F0 > 26) && (() => {
					const p = pctAt(f); const col = p > 85 ? '#4BE07A' : p > 65 ? '#FFD23F' : '#FF5A4D';
					const tick = seg >= 0 && u >= 34 && u < 74;
					return (
						<div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((f - INTRO + 10) / 12) * (tick ? 1 + 0.04 * Math.sin(u) : 1)})`}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '12px 30px', borderRadius: 50, background: '#1D1F24', border: '5px solid #fff', boxShadow: '0 6px 0 rgba(0,0,0,0.35)'}}>
								<img src={staticFile(`flags/${C.heroFlag}.svg`)} style={{width: 62, height: 42, objectFit: 'cover', borderRadius: 6, border: '3px solid #000'}} />
								<span style={{fontFamily: LILITA, fontSize: 46, color: '#fff'}}>{C.hud}</span>
								<span style={{fontFamily: LILITA, fontSize: 52, color: col, minWidth: 110}}>{p}%</span>
							</div>
						</div>
					);
				})()}
				{/* captions */}
				{seg >= 0 && (() => {
					const r = C.regions[seg]; const out = 1 - clamp01((u - segs[seg] + 18) / 12);
					return (
						<div style={{position: 'absolute', left: 0, right: 0, top: 1390, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: out, transform: `scale(${1 + 0.025 * Math.sin(f / 11)}) rotate(${Math.sin(f / 17) * 1.2}deg)`}}>
							<div style={{transform: `scale(${backOut((u - 32) / 10)})`}}><span style={tx(76, '#fff')}>{r.name}</span></div>
							<div style={{transform: `scale(${backOut((u - 44) / 10)}) rotate(-2deg)`, marginTop: 4}}><span style={tx(r.verb.length > 14 ? 92 : 112, r.verbCol)}>{r.verb}</span></div>
						</div>
					);
				})()}
				{seg >= 0 && <Pill text={C.regions[seg].pill} p={(u - 58) / 16} y={1640} size={38} />}
				{/* finale */}
				{fin && (() => {
					const u2 = f - F0;
					return (
						<>
							<div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
								<div style={{transform: `scale(${backOut((u2 - 36) / 10)}) rotate(-3deg)`}}><span style={tx(104, '#FFE14D')}>{C.finale[0]}</span></div>
								<div style={{transform: `scale(${backOut((u2 - 52) / 10)}) rotate(-3deg)`}}><span style={tx(150, '#F03A2E')}>{C.finale[1]}</span></div>
							</div>
							<div style={{position: 'absolute', left: 0, right: 0, top: 1450, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((u2 - 140) / 10)})`}}><span style={tx(110, '#fff')}>{C.finale[2]}</span></div>
							<Pill text={C.finale[3]} p={(u2 - 175) / 16} y={1610} bg="#FFD23F" size={50} />
							{u2 > FIN - 40 && <AbsoluteFill style={{background: '#000', opacity: clamp01((u2 - FIN + 40) / 40)}} />}
						</>
					);
				})()}
				<AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.35) 100%)'}} />
				<span style={{display: 'none', fontFamily: RUBIK}} />
			</AbsoluteFill>
		);
	};
	return {Video, TOTAL, sfx, music, S0, F0};
}
