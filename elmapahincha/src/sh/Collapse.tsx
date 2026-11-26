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
export type Geo = {states: Record<string, {d: string; c: number[]; b: number[]; a?: number; o?: string}>; countries: Record<string, {d: string; c: number[]}>};
export type Icon = {e: string; w?: string; to?: 'h' | 'r' | 'j'; fx?: 'pop' | 'big' | 'rain'; n?: number};
export type Line = {who: 'r' | 'j' | 'h'; text: string; icons?: Icon[]};
export type Region = {
	id: string; states: string[]; flag: string; fill?: string; name: string; verb: string; verbCol: string; pill: string; label: string;
	heroMood?: Mood; heroAfter?: Mood; rMood?: Mood; hero?: [number, number];
	joiner?: {flag: string; pos?: [number, number]; country?: string; mood?: Mood; label?: string};
	pct?: number; dur?: number; lines: Line[];
};
export type Hook =
	| {type: 'title'; title: [string, string, string]; based?: string}
	| {type: 'news'; head: string; text: string; ticker: string}
	| {type: 'count'; from: number; to: number; label: string; text: [string, string]}
	| {type: 'flash'; text: [string, string]; sub: string}
	| {type: 'quiz'; q: string; reveal: [string, string]}
	| {type: 'crack'; text: [string, string]}
	| {type: 'lineup'; text: [string, string]};
export type CollapseCfg = {
	geo: Geo; a3?: string; country: string; heroFlag: string; hud: string; hook: Hook; mode?: 'lose' | 'gain';
	regions: Region[]; finale: [string, string, string, string]; start?: [number, number];
	vo: {dur: Record<string, number>; words: Record<string, [string, number][]>}; voPrefix: string;
	intro: Line; fin: Line; music?: string;
};
const norm = (w: string) => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
export const emojiSrc = (e: string) => staticFile(`emoji/${[...e].map((c) => c.codePointAt(0)!.toString(16)).filter((h) => h !== 'fe0f').join('-')}.svg`);

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
const Bubble: React.FC<{text: string; x: number; y: number; p: number; side?: 'l' | 'r'; below?: boolean}> = ({text, x, y, p, side = 'r', below = false}) => {
	const fs = text.length > 26 ? 34 : 40;
	const w = Math.min(text.length * fs * 0.56 + 54, 600);
	let left = side === 'r' ? x - w * 0.12 : x - w * 0.88;
	left = Math.max(24, Math.min(W - 24 - w, left));
	const tail = Math.max(14, Math.min(w - 54, x - left - 20));
	return (
		<div style={{position: 'absolute', left, top: y, width: w, transform: `${below ? '' : 'translateY(-100%) '}scale(${p})`, transformOrigin: `${tail + 20}px ${below ? '0%' : '100%'}`, opacity: clamp01(p * 3)}}>
			<div style={{position: 'relative', padding: '10px 16px', textAlign: 'center', borderRadius: 18, background: '#fff', border: `5px solid ${INK}`, fontFamily: LILITA, fontSize: fs, lineHeight: 1.1, color: INK, boxShadow: '0 5px 0 rgba(0,0,0,0.3)'}}>
				{text}
				<svg width={40} height={26} style={{position: 'absolute', left: tail, ...(below ? {top: -23, transform: 'scaleY(-1)'} : {bottom: -23})}}><path d={side === 'r' ? 'M2 0 L6 24 L30 0' : 'M38 0 L34 24 L10 0'} fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><rect x={4} y={-6} width={32} height={8} fill="#fff" /></svg>
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
type P2 = [number, number];
export function makeCollapse(C: CollapseCfg) {
	const SEG = 280;
	const G = C.geo;
	const HK = C.hook;
	const gain = C.mode === 'gain';
	const isHero = (n: string) => { const o = G.states[n].o; return !o || !C.a3 || o === C.a3; };
	const VOD = C.vo.dur;
	const d = (k: string) => Math.round((VOD[k] ?? 0.9) * FPS);
	const wordAt = (key: string, w?: string) => {
		if (!w) return 6;
		const ws = C.vo.words[key] ?? []; const n = norm(w);
		const hit = ws.find((x) => x[0].startsWith(n)) ?? ws.find((x) => x[0].includes(n));
		return Math.round((hit ? hit[1] : (VOD[key] ?? 1) * 0.35) * FPS);
	};
	// ---- hook timing
	const PRE = HK.type === 'flash' ? 150 : 0;
	const REV = HK.type === 'quiz' ? 96 : 0;
	const LINEUP = HK.type === 'lineup' ? 24 + C.regions.length * 16 + 6 : 0;
	const HELP0 = PRE + (HK.type === 'quiz' ? REV + 16 : HK.type === 'crack' ? 24 : HK.type === 'lineup' ? LINEUP : HK.type === 'count' ? 30 : 40);
	const HELPE = HELP0 + d('intro');
	const CRK = HK.type === 'crack' ? HELPE + 4 : -1;
	const INTRO = Math.max(PRE + (HK.type === 'count' ? 250 : 200), HELPE + (HK.type === 'crack' ? 84 : HK.type === 'count' ? 40 : 20));
	const CE = INTRO - 46; // count end
	// ---- dialogue timing
	type Ln = Line & {a: number; e: number; key: string};
	const LN: Ln[][] = C.regions.map((r) => { let t = 30; return r.lines.map((l, k) => { const key = `${r.id}_${k}`; const a = t; const e = a + d(key); t = e + 2; return {...l, a, e, key}; }); });
	const segs = C.regions.map((r, i) => r.dur ?? Math.max(SEG, (LN[i].length ? LN[i][LN[i].length - 1].e : 200) + 26));
	const FINV = 80, FIN = Math.max(330, FINV + d('fin') + 70);
	const lineAt = (i: number, who: string, u: number) => { const ls = LN[i].filter((l) => l.who === who); for (let k = ls.length - 1; k >= 0; k--) { const l = ls[k]; const nxt = ls[k + 1]; if (u >= l.a && u < (nxt ? nxt.a : l.e + 40)) return l; } return null; };
	const talkOf = (i: number, who: string, u: number) => { const l = LN[i].find((x) => x.who === who && u >= x.a && u < x.e); return l ? talkAt(u, l.a, l.e) : 0; };
	const S0: number[] = [];
	let t0 = INTRO;
	segs.forEach((dd) => { S0.push(t0); t0 += dd; });
	const F0 = t0, TOTAL = F0 + FIN;
	const segIdx = (f: number) => S0.findIndex((s, i) => f >= s && f < s + segs[i]);
	// ---- geometry
	const heroNames = Object.keys(G.states).filter(isHero);
	const allB = (names: string[]) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const n of names) { const b = G.states[n].b; x0 = Math.min(x0, b[0]); y0 = Math.min(y0, b[1]); x1 = Math.max(x1, b[2]); y1 = Math.max(y1, b[3]); } return [x0, y0, x1, y1]; };
	const ALLB = allB(gain ? Object.keys(G.states) : heroNames);
	const boxCam = (b: number[], extra: P2[] = [], fw = 860, fh = 1000, cy = 820): Cam => {
		let [x0, y0, x1, y1] = b;
		for (const [x, y] of extra) { x0 = Math.min(x0, x - 150); x1 = Math.max(x1, x + 150); y0 = Math.min(y0, y - 150); y1 = Math.max(y1, y + 120); }
		const z = Math.min(3.2, fw / (x1 - x0), fh / (y1 - y0));
		return {x: (x0 + x1) / 2, y: (y0 + y1) / 2 + (960 - cy) / z, z};
	};
	const FULL = boxCam(ALLB, [], 1000, 1150, 900);
	const regB = C.regions.map((r) => allB(r.states));
	const regC = regB.map((b) => [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2] as P2);
	const area = (n: string) => G.states[n].a ?? 1;
	const heroArea = heroNames.reduce((a, n) => a + area(n), 0);
	const PCT: number[] = []; { let g = 0; C.regions.forEach((r) => { g += r.states.reduce((a, n) => a + area(n), 0); PCT.push(r.pct ?? Math.round(gain ? ((heroArea + g) / heroArea) * 100 : ((heroArea - g) / heroArea) * 100)); }); }
	const ctry = G.countries[C.country];
	const START: P2 = C.start ?? (ctry ? (ctry.c as P2) : (regC[0] as P2));
	// auto hero / joiner placement
	const HP: P2[] = []; const JP: (P2 | null)[] = [];
	C.regions.forEach((r, i) => {
		const z0 = boxCam(regB[i]).z;
		const rc = regC[i];
		const goneSoFar = new Set(gain ? [] : C.regions.slice(0, i + 1).flatMap((x) => x.states));
		let hp: P2;
		if (r.hero) hp = r.hero;
		else {
			const cands = heroNames.filter((n) => !goneSoFar.has(n)).map((n) => G.states[n].c as P2).map((c) => ({c, ds: Math.hypot(c[0] - rc[0], c[1] - rc[1]) * z0}));
			const sc = (x: {c: P2; ds: number}) => Math.abs(x.c[1] - rc[1]) * z0 * 1.4 + Math.abs(x.ds - 470) + (x.ds < 380 ? 2000 : 0);
			const pick = [...cands].sort((a, b) => sc(a) - sc(b))[0];
			hp = pick ? pick.c : [rc[0] + 400 / z0, rc[1]];
			const ds = Math.hypot(hp[0] - rc[0], hp[1] - rc[1]) * z0;
			if (ds > 520) { const k = 470 / ds; hp = [rc[0] + (hp[0] - rc[0]) * k, rc[1] + (hp[1] - rc[1]) * k]; }
		}
		HP.push(hp);
		if (!r.joiner) { JP.push(null); return; }
		if (r.joiner.pos) { JP.push(r.joiner.pos); return; }
		const jc = r.joiner.country && G.countries[r.joiner.country] ? (G.countries[r.joiner.country].c as P2) : ([rc[0] + 1, rc[1] + 1] as P2);
		let ang = Math.atan2(jc[1] - rc[1], jc[0] - rc[0]);
		const ha = Math.atan2(hp[1] - rc[1], hp[0] - rc[0]);
		let diff = Math.atan2(Math.sin(ang - ha), Math.cos(ang - ha));
		if (Math.abs(diff) < 1.2) ang = ha + (diff >= 0 ? 1.6 : -1.6);
		JP.push([rc[0] + (Math.cos(ang) * 400) / z0, rc[1] + (Math.sin(ang) * 400) / z0]);
	});
	const regCams = C.regions.map((r, i) => boxCam(regB[i], [HP[i], ...(JP[i] ? [JP[i]!] : [])]));
	const lerpC = (a: Cam, b: Cam, t: number): Cam => ({x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * t)});
	const camAt0 = (f: number): Cam => {
		const startCam: Cam = {x: START[0], y: START[1] - 40, z: Math.min(3.4, FULL.z * 3)};
		if (f < PRE) return {...FULL, z: FULL.z * (1 + 0.05 * f / PRE)};
		if (f < INTRO) {
			if (HK.type === 'quiz') return {...FULL, z: FULL.z * (f < REV ? 1.12 - 0.08 * easeOut(f / REV) : 1.04 + 0.04 * clamp01((f - REV) / 120))};
			const t = easeInOut((f - PRE) / 110); const c = lerpC(startCam, FULL, t); return {...c, z: c.z * (1 + 0.06 * clamp01((f - PRE - 100) / 100))};
		}
		for (let i = 0; i < segs.length; i++) {
			if (f < S0[i] + segs[i]) {
				const u = f - S0[i];
				const prev = i === 0 ? {...FULL, z: FULL.z * 1.03} : {...regCams[i - 1], z: regCams[i - 1].z * 1.06};
				const c = lerpC(prev, regCams[i], easeInOut(u / 26));
				const k = Math.max(0, u - 26) / (segs[i] - 26);
				return {...c, x: c.x + (k * 50) / c.z, z: c.z * (1 + 0.1 * k)};
			}
		}
		const u = f - F0; const last = {...regCams[segs.length - 1], z: regCams[segs.length - 1].z * 1.06};
		const c = lerpC(last, FULL, easeInOut(u / 30));
		return {...c, z: c.z * (1 + 0.08 * clamp01((u - 30) / (FIN - 30)))};
	};
	const shakeAt = (f: number) => {
		let s = 0;
		if (HK.type === 'crack' && f >= CRK && f < CRK + 24) s = 14 * (1 - (f - CRK) / 24);
		if (HK.type === 'flash' && f >= PRE - 34 && f < PRE) s = 6;
		if (HK.type === 'count' && f >= CE && f < CE + 20) s = 12 * (1 - (f - CE) / 20);
		return s;
	};
	const camAt = (f: number): Cam => { const c0 = camAt0(f); const sh = shakeAt(f); return {x: c0.x + (Math.sin(f / 53) * 16 + Math.sin(f / 23) * 5 + Math.sin(f * 2.1) * sh) / c0.z, y: c0.y + (Math.cos(f / 41) * 12 + Math.cos(f / 19) * 4 + Math.cos(f * 2.7) * sh) / c0.z, z: c0.z * (1 + 0.014 * Math.sin(f / 37))}; };
	const pctAt = (f: number) => {
		const p0 = 100;
		if (f < PRE) return PCT[PCT.length - 1];
		let p = p0;
		for (let i = 0; i < segs.length; i++) { const u = f - S0[i] - 34; if (u >= 0) { const prev = i === 0 ? p0 : PCT[i - 1]; p = prev + (PCT[i] - prev) * clamp01(u / 40); } }
		return Math.round(p);
	};
	const heroAt = (f: number): {pos: P2; size: number} => {
		if (f < INTRO) return {pos: START, size: f < PRE ? 230 : HK.type === 'quiz' ? 280 : 320 - 60 * easeInOut((f - PRE) / 110)};
		const seg = segIdx(f);
		if (seg >= 0) { const u = f - S0[seg]; const pv = seg === 0 ? START : HP[seg - 1]; const t = easeInOut(u / 26); return {pos: [pv[0] + (HP[seg][0] - pv[0]) * t, pv[1] + (HP[seg][1] - pv[1]) * t], size: 230}; }
		const last = HP[HP.length - 1]; const t = easeInOut((f - F0) / 30); return {pos: [last[0] + (START[0] - last[0]) * t, last[1] + (START[1] - last[1]) * t], size: 210};
	};
	// ---- icon events
	type IE = {g: number; end: number; e: string; from: 'h' | 'r' | 'j'; to?: 'h' | 'r' | 'j'; fx: string; n: number; slot: number; ns: number};
	const IC: IE[] = [];
	const addIcons = (l: Line, key: string, base: number, cap: number) => {
		const ic = l.icons ?? []; const pops = ic.filter((x) => (x.fx ?? 'pop') === 'pop');
		ic.forEach((x) => IC.push({g: base + wordAt(key, x.w), end: Math.min(cap, base + d(key) + 50), e: x.e, from: l.who, to: x.to, fx: x.fx ?? 'pop', n: x.n ?? 10, slot: pops.indexOf(x), ns: pops.length}));
	};
	addIcons(C.intro, 'intro', HELP0, INTRO + 6);
	C.regions.forEach((r, i) => LN[i].forEach((l) => addIcons(l, l.key, S0[i] + l.a, S0[i] + segs[i] - 6)));
	addIcons(C.fin, 'fin', F0 + FINV, TOTAL - 40);
	const countSteps = HK.type === 'count' ? Array.from({length: HK.from - HK.to}, (_, k) => Math.round(56 + ((k + 1) / (HK.from - HK.to)) * (CE - 70))) : [];

	const sfx = () => {
		const o: {f: number; name: string; vol: number}[] = [];
		const S = (f: number, n: string, v = 0.4) => o.push({f: Math.round(f), name: n, vol: v});
		if (HK.type === 'title') { S(0, 'boom', 0.45); S(4, 'slap', 0.45); S(12, 'pop_1', 0.35); S(20, 'pop_2', 0.35); S(70, 'whoosh_2', 0.3); S(95, 'pop_3', 0.35); }
		if (HK.type === 'news') { S(0, 'glitch', 0.4); S(2, 'bong', 0.5); S(10, 'whoosh_1', 0.4); S(20, 'whoosh_2', 0.35); S(26, 'slap', 0.35); }
		if (HK.type === 'count') { S(0, 'boom', 0.45); S(6, 'slap', 0.4); countSteps.forEach((g, k) => { S(g, 'tick', 0.45); S(g, `pop_${(k % 4) + 1}`, 0.25); }); S(CE, 'boom', 0.5); S(CE + 2, 'error', 0.35); }
		if (HK.type === 'flash') { S(0, 'boom', 0.45); S(10, 'slap', 0.4); S(50, 'pop_2', 0.35); S(PRE - 36, 'glitch', 0.45); S(PRE - 34, 'riser', 0.3); S(PRE, 'whoosh_3', 0.45); S(PRE + 4, 'boom', 0.35); }
		if (HK.type === 'quiz') { S(0, 'whoosh_2', 0.35); S(4, 'drumroll', 0.35); [24, 48, 72].forEach((g) => S(g, 'tick', 0.5)); S(REV, 'boom', 0.5); S(REV + 2, 'confirm', 0.4); S(REV + 10, 'pop_1', 0.35); }
		if (HK.type === 'crack') { S(0, 'pop_1', 0.35); S(10, 'slap', 0.35); S(CRK, 'glass', 0.6); S(CRK, 'boom', 0.5); S(CRK + 12, 'slap', 0.4); }
		if (HK.type === 'lineup') { S(0, 'boom', 0.4); C.regions.forEach((_, k) => S(24 + k * 16, `pop_${(k % 4) + 1}`, 0.45)); S(LINEUP - 4, 'slap', 0.35); }
		C.regions.forEach((r, i) => {
			const s = S0[i];
			S(s - 4, `whoosh_${(i % 4) + 1}`, 0.5); S(s + 14, 'glitch', 0.25); S(s + 22, 'boom', 0.45); S(s + 26, 'pop_2', 0.45);
			S(s + 40, 'slap', 0.35); S(s + 52, 'pop_4', 0.3); S(s + 62, 'select', 0.3);
			for (let k = 0; k < 6; k++) S(s + 34 + k * 7, 'tick', 0.15);
			if (r.joiner) S(s + 60, 'pop_2', 0.4);
		});
		IC.forEach((x, k) => {
			if (x.fx === 'big') { S(x.g, 'slap', 0.45); S(x.g + 2, 'boom', 0.25); }
			else if (x.fx === 'rain') S(x.g, 'whoosh_2', 0.3);
			else { S(x.g, `pop_${(k % 4) + 1}`, 0.32); if (x.to) S(x.g + 42, 'whoosh_1', 0.25); }
		});
		const P = C.voPrefix;
		S(HELP0, `${P}_intro`, 1.0);
		C.regions.forEach((r, i) => LN[i].forEach((l) => S(S0[i] + l.a, `${P}_${l.key}`, 1.0)));
		S(F0 + FINV, `${P}_fin`, 1.0);
		S(F0 - 4, 'whoosh_4', 0.5); S(F0 + 30, 'boom', 0.4); S(F0 + 40, 'slap', 0.4); S(F0 + 56, 'slap', 0.4); S(F0 + 150, 'confirm', 0.35); S(F0 + 180, 'pop_1', 0.35);
		return o.sort((a, b) => a.f - b.f);
	};
	const music = () => `${C.music ?? 'm_tense'}:0:${(TOTAL / FPS).toFixed(2)}`;

	function talkAt(f: number, a: number, e: number) { return f >= a && f < e ? 0.35 + 0.65 * Math.abs(Math.sin((f - a) / 3.3)) * (0.6 + 0.4 * Math.sin((f - a) / 7.1)) : 0; }
	const bob = (f: number, ph: number, talking: number) => `translateY(${Math.sin(f / 9 + ph) * 7 - talking * 8}px) rotate(${Math.sin(f / 23 + ph) * 3}deg) scale(${1 + 0.025 * Math.sin(f / 9 + ph) + talking * 0.05}, ${1 - 0.025 * Math.sin(f / 9 + ph) + talking * 0.06})`;
	const Video: React.FC = () => {
		const f = useCurrentFrame();
		const cam = camAt(f);
		const camP = camAt(f - 1);
		const vel = Math.hypot((cam.x - camP.x) * cam.z, (cam.y - camP.y) * cam.z) + Math.abs(Math.log(cam.z / camP.z)) * 900;
		const blur = Math.min(10, vel * 0.12);
		const seg = segIdx(f);
		const u = seg >= 0 ? f - S0[seg] : 0;
		const fin = f >= F0;
		const pre = f < PRE;
		const finLike = fin || pre;
		const uuOf = (i: number) => (pre ? 400 : f - S0[i]);
		const goneIdx = C.regions.map((_, i) => (pre || f >= S0[i] + 14 ? i : -1)).filter((i) => i >= 0);
		const tr = `translate(${W / 2 + 60} ${H / 2 + 60}) scale(${cam.z}) translate(${-cam.x} ${-cam.y})`;
		const toS = (x: number, y: number) => [W / 2 + (x - cam.x) * cam.z, H / 2 + (y - cam.y) * cam.z];
		const z = cam.z;
		const flash = seg >= 0 ? Math.max(0, 1 - Math.abs(u - 12) / 10) * 0.75 : fin ? Math.max(0, 1 - Math.abs(f - F0 - 26) / 12) * 0.8 : 0;
		const hookFlash = HK.type === 'quiz' ? Math.max(0, 1 - Math.abs(f - REV) / 10) : HK.type === 'flash' ? Math.max(0, 1 - Math.abs(f - PRE) / 8) : HK.type === 'crack' ? Math.max(0, 1 - Math.abs(f - CRK) / 6) * 0.7 : 0;
		const goneSet = new Set(C.regions.flatMap((r, i) => (goneIdx.includes(i) ? r.states : [])));
		const silh = HK.type === 'quiz' && f < REV;
		const hs = heroAt(f);
		const anchor = (who: 'h' | 'r' | 'j'): P2 => {
			if (who === 'h') { const [x, y] = toS(...hs.pos); return [x, y]; }
			if (who === 'r' && seg >= 0) { const [x, y] = toS(...regC[seg]); return [x, y - 95]; }
			if (who === 'j' && seg >= 0 && JP[seg]) { const [x, y] = toS(...JP[seg]!); return [x, y]; }
			return [W / 2, 800];
		};
		const stateFill = (n: string) => {
			if (silh) return isHero(n) ? '#23262C' : '#E9D7A5';
			if (!isHero(n)) return '#E9D7A5';
			return goneSet.has(n) ? '#C8452F' : '#E8553D';
		};
		return (
			<AbsoluteFill style={{background: '#0E86B5', overflow: 'hidden'}}>
				<Fonts />
				<div style={{position: 'absolute', inset: -60, transform: `rotate(${Math.sin(f / 97) * 0.5}deg)`, filter: `${blur > 0.6 ? `blur(${blur.toFixed(1)}px)` : ''}${pre && f >= PRE - 34 ? ' saturate(0.4) contrast(1.2)' : ''}` || undefined}}>
					<svg width={W + 120} height={H + 120} style={{position: 'absolute', left: 0, top: 0}}>
						<defs>
							<linearGradient id="sea" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#1A9DCB" /><stop offset="1" stopColor="#0C77A8" /></linearGradient>
							<radialGradient id="lite" cx="30%" cy="20%" r="90%"><stop offset="0" stopColor="#fff" stopOpacity={0.16} /><stop offset="1" stopColor="#000" stopOpacity={0.12} /></radialGradient>
							<pattern id="wav" width={180} height={60} patternUnits="userSpaceOnUse" patternTransform={`translate(${(f * 0.6) % 180} ${Math.sin(f / 40) * 8})`}><path d="M0 30 Q22 14 45 30 T90 30" fill="none" stroke="#7FD8F0" strokeWidth={3} strokeLinecap="round" opacity={0.55} /></pattern>
							{C.regions.map((r) => <clipPath key={r.id} id={`rc${r.id}`}>{r.states.map((n) => <path key={n} d={G.states[n].d} />)}</clipPath>)}
						</defs>
						<rect width={W + 120} height={H + 120} fill="url(#sea)" />
						<g transform={tr}>
							<rect x={-3000} y={-3000} width={10000} height={10000} fill="url(#wav)" opacity={0.5} />
							<g fill="none" stroke="#56C8E6" strokeLinejoin="round">
								<g strokeWidth={46 / z} opacity={0.35}>{Object.values(G.countries).map((c, i) => <path key={i} d={c.d} />)}{heroNames.map((n) => <path key={n} d={G.states[n].d} />)}</g>
								<g strokeWidth={20 / z} opacity={0.6}>{Object.values(G.countries).map((c, i) => <path key={i} d={c.d} />)}{heroNames.map((n) => <path key={n} d={G.states[n].d} />)}</g>
							</g>
							{Object.entries(G.countries).map(([n, c]) => <path key={n} d={c.d} fill={n === C.country ? (silh ? '#23262C' : '#E8553D') : '#E9D7A5'} stroke="#B49F6E" strokeWidth={1.6 / z} strokeLinejoin="round" />)}
							{Object.entries(G.states).map(([n, s]) => <path key={n} d={s.d} fill={stateFill(n)} stroke={isHero(n) ? (silh ? '#3A3E46' : '#F7896D') : '#C9B585'} strokeWidth={1.8 / z} strokeLinejoin="round" />)}
							{C.regions.map((r, i) => {
								if (!goneIdx.includes(i)) return null;
								const uu = uuOf(i);
								const white = uu < 24 ? clamp01((uu - 14) / 4) : 1 - clamp01((uu - 24) / 8);
								const lift = (finLike ? 0.6 : i === seg ? 1 : 0.6) * easeOut((uu - 20) / 14);
								const pop = 1 + 0.05 * Math.sin(clamp01((uu - 20) / 16) * Math.PI);
								const b = regB[i]; const [cx, cy] = regC[i];
								return (
									<g key={r.id} transform={`translate(${cx} ${cy}) scale(${pop}) translate(${-cx} ${-cy - (10 * lift) / z})`}>
										<g transform={`translate(${5 / z} ${(14 * lift) / z})`} opacity={0.35 * lift}>{r.states.map((n) => <path key={n} d={G.states[n].d} fill="#3A0F08" />)}</g>
										<g clipPath={`url(#rc${r.id})`}><FlagCover flag={r.fill ?? r.flag} x={b[0]} y={b[1]} w={b[2] - b[0]} h={b[3] - b[1]} /><rect x={b[0]} y={b[1]} width={b[2] - b[0]} height={b[3] - b[1]} fill="url(#lite)" /></g>
										{r.states.map((n) => <path key={n} d={G.states[n].d} fill="#fff" opacity={white} />)}
										<g fill="none" strokeLinejoin="round">{r.states.map((n) => <path key={n} d={G.states[n].d} stroke="#fff" strokeWidth={5 / z} />)}{r.states.map((n) => <path key={n + 'k'} d={G.states[n].d} stroke={INK} strokeWidth={2.2 / z} />)}</g>
									</g>
								);
							})}
							<g fill="none" stroke="#7E2212" strokeWidth={2.4 / z} strokeLinejoin="round" opacity={0.6}>{heroNames.map((n) => <path key={n} d={G.states[n].d} />)}</g>
						</g>
						<rect width={W + 120} height={H + 120} fill="url(#lite)" />
					</svg>
				</div>
				{seg >= 0 && u >= 20 && u < 70 && (() => { const [sx, sy] = toS(...regC[seg]); const p = easeOut((u - 20) / 50); return <div style={{position: 'absolute', left: sx - 600 * p, top: sy - 600 * p, width: 1200 * p, height: 1200 * p, borderRadius: '50%', border: `${8 * (1 - p) + 2}px solid rgba(255,255,255,${0.9 * (1 - p)})`}} />; })()}
				{/* icons */}
				{IC.map((x, k) => {
					const t = f - x.g;
					if (t < 0 || f > x.end + 16) return null;
					if (x.fx === 'big') {
						if (t > 52) return null;
						const sc = (t < 10 ? 2.4 - 1.4 * easeOut(t / 10) : 1) * (1 - easeInOut((t - 40) / 12)) * 0.82;
						return (
							<div key={k} style={{position: 'absolute', left: W / 2 - 230, top: 150, width: 460, height: 460, transform: `scale(${sc}) rotate(${Math.sin(t / 3) * 8}deg)`}}>
								<svg width={460} height={460} style={{position: 'absolute', left: 0, top: 0, transform: `rotate(${t * 2}deg)`}}>{Array.from({length: 14}, (_, q) => { const a = (q / 14) * Math.PI * 2; return <path key={q} d={`M230 230 L${230 + Math.cos(a - 0.12) * 230} ${230 + Math.sin(a - 0.12) * 230} L${230 + Math.cos(a + 0.12) * 230} ${230 + Math.sin(a + 0.12) * 230}Z`} fill={q % 2 ? '#FFD23F' : '#FF8A3D'} opacity={0.85} />; })}</svg>
								<img src={emojiSrc(x.e)} style={{position: 'absolute', left: 80, top: 80, width: 300, height: 300, filter: 'drop-shadow(0 10px 0 rgba(0,0,0,0.35))'}} />
							</div>
						);
					}
					if (x.fx === 'rain') {
						if (t > 130) return null;
						return <React.Fragment key={k}>{Array.from({length: x.n}, (_, q) => { const sx = ((q * 397 + 113) % 1000) / 1000 * (W - 100) + 50; const y0 = -160 - (q % 4) * 140; const y = y0 + t * 15 * (0.8 + (q % 5) * 0.1); const s = 90 + (q % 3) * 30; return <img key={q} src={emojiSrc(x.e)} style={{position: 'absolute', left: sx - s / 2, top: y, width: s, height: s, transform: `rotate(${t * 4 * (q % 2 ? 1 : -1) + q * 30}deg)`, filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.3))'}} />; })}</React.Fragment>;
					}
					const [ax, ay] = anchor(x.from);
					const base = ax < W / 2 ? 55 : 125;
					const ang = ((base + (x.slot - (x.ns - 1) / 2) * 42) * Math.PI) / 180;
					const R = 235;
					const txx = Math.max(90, Math.min(W - 90, ax + Math.cos(ang) * R)), tyy = Math.max(300, Math.min(1300, ay + Math.sin(ang) * R));
					const p = easeOut(t / 14);
					let X = ax + (txx - ax) * p, Y = ay + (tyy - ay) * p - Math.sin(p * Math.PI) * 60;
					let sc = backOut(t / 14);
					if (x.to) {
						if (t > 62) return null;
						const tt = clamp01((t - 40) / 20);
						if (tt > 0) { const [bx, byy] = anchor(x.to); const e2 = easeInOut(tt); X = X + (bx - X) * e2; Y = Y + (byy - Y) * e2 - Math.sin(e2 * Math.PI) * 140; sc *= 1 - 0.65 * e2; }
					} else sc *= 1 - easeInOut((f - x.end) / 14);
					Y += Math.sin(f / 8 + x.slot) * 8;
					const S = 170;
					return (
						<div key={k} style={{position: 'absolute', left: X - S / 2, top: Y - S / 2, width: S, height: S, transform: `scale(${sc}) rotate(${Math.sin(f / 13 + x.slot * 2) * 12}deg)`}}>
							{t < 14 && <svg width={S * 2} height={S * 2} style={{position: 'absolute', left: -S / 2, top: -S / 2, overflow: 'visible'}}>{Array.from({length: 8}, (_, q) => { const a = (q / 8) * Math.PI * 2; const r0 = S * (0.5 + 0.5 * easeOut(t / 14)), r1 = r0 + 26 * (1 - t / 14); return <line key={q} x1={S + Math.cos(a) * r0} y1={S + Math.sin(a) * r0} x2={S + Math.cos(a) * r1} y2={S + Math.sin(a) * r1} stroke="#fff" strokeWidth={7} strokeLinecap="round" />; })}</svg>}
							<div style={{position: 'absolute', inset: 6, borderRadius: '50%', background: '#fff', border: `6px solid ${INK}`, boxShadow: '0 8px 0 rgba(0,0,0,0.3)'}} />
							<img src={emojiSrc(x.e)} style={{position: 'absolute', left: 26, top: 26, width: S - 52, height: S - 52}} />
						</div>
					);
				})}
				{/* region labels + balls */}
				{C.regions.map((r, i) => {
					if (!goneIdx.includes(i)) return null;
					const uu = uuOf(i);
					const [sx, sy] = toS(...regC[i]);
					const cur = i === seg;
					const small = finLike || !cur;
					const bs = small ? 110 : 190;
					const pop = elastic((uu - 22) / 40);
					const by = sy - bs * 0.5;
					const rm: Mood = r.rMood ?? (gain ? 'angry' : cur && uu > 60 ? 'happy' : 'smug');
					return (
						<React.Fragment key={r.id}>
							<div style={{position: 'absolute', left: sx - bs / 2, top: by - bs * 0.06, transform: `scale(${pop}) ${bob(f, i * 1.7, cur ? talkOf(i, 'r', uu) : 0)}`, transformOrigin: '50% 90%'}}><Ball flag={r.flag} size={bs} mood={rm} t={f + i * 40} id={'r' + r.id} talk={cur ? talkOf(i, 'r', uu) : 0} /></div>
							{(cur || finLike) && <div style={{position: 'absolute', left: sx - 300, width: 600, top: by - (small ? 52 : 70), display: 'flex', justifyContent: 'center', transform: `scale(${backOut((uu - 30) / 12)})`}}><span style={tx(small ? 32 : 44, '#FFD43B', 0.18)}>{r.label}</span></div>}
							{cur && uu < segs[i] - 14 && (() => { const l = lineAt(i, 'r', uu); if (!l) return null; const hx = toS(...HP[i])[0]; const right = hx < sx; return <Bubble key={l.key} text={l.text} x={right ? sx + bs * 0.3 : sx - bs * 0.3} y={by - 76} p={backOut((uu - l.a) / 8)} side={right ? 'r' : 'l'} />; })()}
						</React.Fragment>
					);
				})}
				{/* joiner ball */}
				{seg >= 0 && C.regions[seg].joiner && JP[seg] && (() => {
					const j = C.regions[seg].joiner!; const [sx, sy] = toS(...JP[seg]!); const jl = LN[seg].find((l) => l.who === 'j'); const tJ = jl ? jl.a : 60; const tk = talkOf(seg, 'j', u); const p = elastic((u - Math.min(60, tJ - 10)) / 40);
					const l = lineAt(seg, 'j', u); const right = sx < W / 2;
					return <><div style={{position: 'absolute', left: sx - 90, top: sy - 100, transform: `scale(${p}) ${bob(f, 2.2, tk)}`, transformOrigin: '50% 90%'}}><Ball flag={j.flag} size={180} mood={j.mood ?? 'happy'} t={f} id="jn" talk={tk} /></div>
						{j.label && <div style={{position: 'absolute', left: sx - 300, width: 600, top: sy - 150, display: 'flex', justifyContent: 'center', transform: `scale(${p})`}}><span style={tx(36, '#fff', 0.18)}>{j.label}</span></div>}
						{l && u < segs[seg] - 14 ? <Bubble text={l.text} x={right ? sx + 50 : sx - 50} y={sy - (j.label ? 150 : 100)} p={backOut((u - l.a) / 8)} side={right ? 'r' : 'l'} /> : null}</>;
				})()}
				{/* hero ball */}
				{(() => {
					let mood: Mood = 'worried', bub: string | null = null, bp = 0, alarm = 0, talk = 0, show = 1;
					const {pos, size} = hs;
					if (f < INTRO) {
						if (pre) mood = gain ? 'happy' : 'cry';
						else {
							talk = talkAt(f, HELP0, HELPE);
							if (f > HELP0 && f < HELPE + 40) { bub = C.intro.text; bp = backOut((f - HELP0) / 10); }
							if (HK.type === 'quiz') { show = elastic((f - REV) / 36); mood = f < HELPE + 6 ? 'smug' : 'worried'; }
							if (HK.type === 'crack') mood = f < CRK ? 'smug' : 'shock';
							if (HK.type === 'flash') mood = 'worried';
						}
					} else if (seg >= 0) {
						const r = C.regions[seg];
						const hl = LN[seg].filter((l) => l.who === 'h'); const lastH = hl.length ? hl[hl.length - 1].e : 120;
						const m0: Mood = r.heroMood ?? (gain ? 'happy' : 'shock');
						mood = u < 30 ? (gain ? 'smug' : 'worried') : u < lastH + 6 ? m0 : r.heroAfter ?? (gain ? 'smug' : 'cry');
						alarm = u >= 30 && u < (hl.length ? hl[0].a : 120) && m0 === 'shock' ? 1 : 0;
						talk = talkOf(seg, 'h', u);
						const l = lineAt(seg, 'h', u); if (l && u < segs[seg] - 14) { bub = l.text; bp = backOut((u - l.a) / 8); }
					} else { mood = f - F0 > 60 ? (gain ? 'happy' : 'smug') : gain ? 'smug' : 'cry'; talk = talkAt(f - F0, FINV, FINV + d('fin')); if (f - F0 > FINV && f - F0 < FINV + d('fin') + 40) { bub = C.fin.text; bp = backOut((f - F0 - FINV) / 8); } }
					const [sx, sy] = toS(...pos);
					const jump = seg >= 0 && u >= 30 && u < 44 ? -Math.sin(((u - 30) / 14) * Math.PI) * 30 : 0;
					const shake = mood === 'shock' || mood === 'angry' ? Math.sin(f * 1.7) * 3 : 0;
					return (
						<>
							<div style={{position: 'absolute', left: sx - size / 2 + shake, top: sy - size / 2 + jump, transform: `scale(${show}) ${bob(f, 0, talk)}`, transformOrigin: '50% 90%'}}><Ball flag={C.heroFlag} size={size} mood={mood} t={f} id="hero" talk={talk} /></div>
							{alarm > 0 && <div style={{position: 'absolute', left: sx - 40, top: sy - size * 0.95, fontFamily: LILITA, fontSize: 90, color: '#E0202A', WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill', transform: `scale(${backOut((u - 30) / 8)}) rotate(-8deg)`}}>!!</div>}
							{alarm > 0 && <svg width={size * 1.8} height={size * 1.8} style={{position: 'absolute', left: sx - size * 0.9, top: sy - size * 0.9, overflow: 'visible', opacity: 0.85}}>{Array.from({length: 10}, (_, k) => { const a = (k / 10) * Math.PI * 2 + 0.3; const r0 = size * 0.62, r1 = size * (0.72 + 0.06 * Math.sin(f / 3 + k)); return <line key={k} x1={size * 0.9 + Math.cos(a) * r0} y1={size * 0.9 + Math.sin(a) * r0} x2={size * 0.9 + Math.cos(a) * r1} y2={size * 0.9 + Math.sin(a) * r1} stroke="#fff" strokeWidth={6} strokeLinecap="round" />; })}</svg>}
							{bub && (() => { const rx = seg >= 0 ? toS(...regC[seg])[0] : W / 2; const right = seg >= 0 ? sx > rx : sx < W / 2 + 60; const below = f < INTRO && HK.type === 'count'; return <Bubble text={bub} x={right ? sx + size * 0.25 : sx - size * 0.25} y={below ? sy + size * 0.62 : sy - size * 0.48} p={bp} side={right ? 'r' : 'l'} below={below} />; })()}
						</>
					);
				})()}
				{(flash > 0.01 || hookFlash > 0.01) && <AbsoluteFill style={{background: '#FFFDF5', opacity: Math.max(flash, hookFlash)}} />}
				{/* ---------------- hooks */}
				{HK.type === 'title' && f < INTRO + 20 && (() => {
					const o = 1 - clamp01((f - INTRO + 8) / 14);
					return (
						<>
							<div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: o}}>
								<div style={{transform: `scale(${backOut(f / 10)}) rotate(-3deg)`}}><span style={tx(110, '#FFE14D')}>{HK.title[0]}</span></div>
								<div style={{transform: `scale(${backOut((f - 6) / 10)}) rotate(-3deg)`, marginTop: -6}}><span style={tx(190, '#F03A2E')}>{HK.title[1]}</span></div>
								<div style={{transform: `scale(${backOut((f - 12) / 10)}) rotate(-3deg)`, marginTop: -4}}><span style={tx(96, '#F03A2E')}>{HK.title[2]}</span></div>
							</div>
							{HK.based && f >= 60 && <Pill text={HK.based} p={(f - 60) / 18} y={600} bg="#FFD23F" size={40} />}
						</>
					);
				})()}
				{HK.type === 'news' && f < INTRO + 20 && (() => {
					const o = 1 - clamp01((f - INTRO + 8) / 14);
					const sl = easeOut(f / 16), sl2 = easeOut((f - 8) / 16);
					return (
						<div style={{position: 'absolute', inset: 0, opacity: o}}>
							<div style={{position: 'absolute', left: 40, top: 110, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 26px', background: '#E0202A', borderRadius: 12, border: `5px solid ${INK}`, transform: `scale(${backOut(f / 10)})`}}>
								<div style={{width: 26, height: 26, borderRadius: '50%', background: '#fff', opacity: f % 40 < 24 ? 1 : 0.2}} /><span style={{fontFamily: LILITA, fontSize: 44, color: '#fff'}}>EN DIRECTO</span>
							</div>
							<div style={{position: 'absolute', left: 0, top: 1250, transform: `translateX(${-1100 * (1 - sl)}px) rotate(-2deg)`}}>
								<div style={{display: 'inline-block', padding: '14px 40px', background: '#E0202A', border: `6px solid ${INK}`, borderLeft: 'none'}}><span style={tx(92, '#FFE14D', 0.1)}>{HK.head}</span></div>
							</div>
							<div style={{position: 'absolute', left: 30, right: 30, top: 1390, transform: `translateX(${1100 * (1 - sl2)}px) rotate(-2deg)`, padding: '20px 30px', background: '#fff', border: `6px solid ${INK}`, borderRadius: 14, boxShadow: '0 10px 0 rgba(0,0,0,0.35)'}}>
								<div style={{fontFamily: LILITA, fontSize: 62, lineHeight: 1.08, color: INK, textAlign: 'center'}}>{HK.text}</div>
							</div>
							<div style={{position: 'absolute', left: 0, right: 0, top: 1700, height: 84, background: '#14161A', borderTop: '5px solid #FFD23F', overflow: 'hidden'}}>
								<div style={{position: 'absolute', top: 14, left: W - ((f * 7) % 3600), whiteSpace: 'nowrap', fontFamily: LILITA, fontSize: 46, color: '#fff'}}>{`${HK.ticker}   ●   ${HK.ticker}   ●   ${HK.ticker}`}</div>
							</div>
							<AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.07) 0 2px, rgba(0,0,0,0) 2px 5px)'}} />
						</div>
					);
				})()}
				{HK.type === 'count' && f < INTRO + 20 && (() => {
					const o = 1 - clamp01((f - INTRO + 8) / 14);
					const k = countSteps.filter((g) => f >= g).length; const num = HK.from - k;
					const lastStep = countSteps.filter((g) => f >= g).pop() ?? -99;
					const hit = clamp01(1 - (f - lastStep) / 8);
					const red = k / Math.max(1, countSteps.length);
					const col = `rgb(255,${Math.round(255 - 165 * red)},${Math.round(255 - 190 * red)})`;
					const end = f >= CE;
					return (
						<div style={{position: 'absolute', left: 0, right: 0, top: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: o}}>
							<div style={{transform: `scale(${backOut(f / 10)}) rotate(-3deg)`}}><span style={tx(80, '#FFE14D')}>{HK.label}</span></div>
							<div style={{transform: `scale(${backOut((f - 4) / 10) * (1 + 0.18 * hit) * (end ? 1 + 0.25 * backOut((f - CE) / 10) - 0.25 : 1)}) rotate(${-3 + Math.sin(f * 1.9) * 4 * hit}deg)`, marginTop: -10}}><span style={tx(300, end ? '#F03A2E' : col, 0.1)}>{num}</span></div>
							{end && <div style={{transform: `scale(${backOut((f - CE - 6) / 10)}) rotate(-3deg)`, marginTop: -10}}><span style={tx(82, '#fff')}>{HK.text[0]}</span></div>}
							{end && <div style={{transform: `scale(${backOut((f - CE - 14) / 10)}) rotate(-3deg)`, marginTop: 4}}><span style={tx(96, '#F03A2E')}>{HK.text[1]}</span></div>}
						</div>
					);
				})()}
				{HK.type === 'flash' && f < PRE + 6 && (() => {
					const rw = f >= PRE - 34;
					return (
						<>
							<div style={{position: 'absolute', left: 0, right: 0, top: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: rw ? 0.6 : 1}}>
								<div style={{transform: `scale(${backOut(f / 10)}) rotate(-3deg)`}}><span style={tx(96, '#FFE14D')}>{HK.text[0]}</span></div>
								<div style={{transform: `scale(${backOut((f - 6) / 10)}) rotate(-3deg)`, marginTop: -4}}><span style={tx(170, '#4BE07A')}>{HK.text[1]}</span></div>
							</div>
							{f >= 50 && <Pill text={HK.sub} p={(f - 50) / 16} y={1560} bg="#FFD23F" size={48} />}
							{rw && <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.10) 0 3px, rgba(0,0,0,0) 3px 9px)', transform: `translateX(${Math.sin(f * 3.1) * 14}px)`}} />}
							{rw && <div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center'}}><span style={{...tx(110, '#fff', 0.12), transform: `translateX(${Math.sin(f * 2.3) * 8}px)`}}>◀◀ REBOBINANDO</span></div>}
							{rw && <div style={{position: 'absolute', left: 50, top: 110, fontFamily: LILITA, fontSize: 54, color: '#fff', WebkitTextStroke: `6px ${INK}`, paintOrder: 'stroke fill'}}>{`◀◀ ${String(Math.max(0, 1600 + Math.round((f - PRE + 34) * -9))).padStart(4, '0')}`}</div>}
						</>
					);
				})()}
				{HK.type === 'quiz' && f < INTRO + 20 && (() => {
					const o = 1 - clamp01((f - INTRO + 8) / 14);
					const n = f < 24 ? 3 : f < 48 ? 3 : f < 72 ? 2 : 1;
					return (
						<div style={{position: 'absolute', inset: 0, opacity: o}}>
							{f < REV && <div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', justifyContent: 'center', transform: `scale(${backOut(f / 10)}) rotate(-3deg)`}}><span style={tx(100, '#FFE14D')}>{HK.q}</span></div>}
							{f < REV && <div style={{position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((f - 6) / 12) * (1 + 0.06 * Math.sin(f / 5))}) rotate(${Math.sin(f / 9) * 8}deg)`}}><span style={tx(420, '#fff', 0.06)}>?</span></div>}
							{f >= 20 && f < REV && <div style={{position: 'absolute', left: W / 2 - 90, top: 1420, width: 180, height: 180, borderRadius: '50%', background: '#E0202A', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.2 * clamp01(1 - ((f - 24) % 24) / 8)})`}}><span style={tx(120, '#fff', 0.08)}>{n}</span></div>}
							{f >= REV && <div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
								<div style={{transform: `scale(${backOut((f - REV) / 10)}) rotate(-3deg)`}}><span style={tx(96, '#fff')}>{HK.reveal[0]}</span></div>
								<div style={{transform: `scale(${backOut((f - REV - 8) / 10)}) rotate(-3deg)`}}><span style={tx(150, '#FFE14D')}>{HK.reveal[1]}</span></div>
							</div>}
						</div>
					);
				})()}
				{HK.type === 'crack' && f < INTRO + 20 && (() => {
					const o = 1 - clamp01((f - INTRO + 8) / 14);
					const [hx, hy] = toS(...hs.pos);
					const c = f >= CRK ? easeOut((f - CRK) / 10) : 0;
					return (
						<div style={{position: 'absolute', inset: 0, opacity: o}}>
							<div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
								<div style={{transform: `scale(${backOut((f - 4) / 10)}) rotate(-3deg)`}}><span style={tx(130, '#6EC6FF')}>{HK.text[0]}</span></div>
								<div style={{transform: `scale(${backOut((f - 12) / 10)}) rotate(-3deg)`, marginTop: -4}}><span style={tx(100, f >= CRK ? '#F03A2E' : '#fff')}>{HK.text[1]}</span></div>
							</div>
							{c > 0 && <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>{Array.from({length: 6}, (_, q) => { const a0 = q * 1.05 + 0.3; let x = hx, y = hy; const pts = [[x, y]]; for (let s = 0; s < 7; s++) { const a = a0 + Math.sin(q * 12.9 + s * 7.3) * 0.5; x += Math.cos(a) * 130; y += Math.sin(a) * 130; pts.push([x, y]); } const dstr = 'M' + pts.map((p) => p.map(Math.round).join(' ')).join(' L'); return <g key={q}><path d={dstr} fill="none" stroke={INK} strokeWidth={16} strokeDasharray={1200} strokeDashoffset={1200 * (1 - c)} strokeLinejoin="round" /><path d={dstr} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray={1200} strokeDashoffset={1200 * (1 - c)} strokeLinejoin="round" /></g>; })}</svg>}
							{f >= CRK && <div style={{position: 'absolute', left: 0, right: 0, top: 1380, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((f - CRK) / 8)}) rotate(-6deg)`}}><span style={tx(190, '#FFE14D', 0.12)}>¡CRACK!</span></div>}
						</div>
					);
				})()}
				{HK.type === 'lineup' && f < INTRO + 20 && (() => {
					const o = 1 - clamp01((f - INTRO + 8) / 14);
					const n = C.regions.length; const bs = Math.min(150, 960 / n);
					return (
						<div style={{position: 'absolute', inset: 0, opacity: o}}>
							<div style={{position: 'absolute', left: 0, right: 0, top: 160, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
								<div style={{transform: `scale(${backOut(f / 10)}) rotate(-3deg)`}}><span style={tx(150, '#F03A2E')}>{HK.text[0]}</span></div>
								<div style={{transform: `scale(${backOut((f - 8) / 10)}) rotate(-3deg)`, marginTop: -4}}><span style={tx(80, '#fff')}>{HK.text[1]}</span></div>
							</div>
							{C.regions.map((r, k) => { const x = W / 2 + (k - (n - 1) / 2) * (bs + 14); const p = elastic((f - 24 - k * 16) / 36); return (
								<div key={r.id} style={{position: 'absolute', left: x - bs / 2, top: 1420, transform: `scale(${p}) ${bob(f, k * 1.3, 0)}`, transformOrigin: '50% 90%'}}>
									<Ball flag={r.flag} size={bs} mood="smug" t={f + k * 30} id={'lu' + r.id} />
									<div style={{position: 'absolute', left: bs / 2 - 26, top: -30, width: 52, height: 52, borderRadius: '50%', background: '#FFD23F', border: `5px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 32, color: INK}}>{k + 1}</div>
								</div>
							); })}
						</div>
					);
				})()}
				{/* HUD */}
				{(f >= INTRO - 10 || pre) && !(fin && f - F0 > 26) && (() => {
					const p = pctAt(f); const col = gain ? '#4BE07A' : p > 85 ? '#4BE07A' : p > 65 ? '#FFD23F' : '#FF5A4D';
					const tick = seg >= 0 && u >= 34 && u < 74;
					return (
						<div style={{position: 'absolute', left: 0, right: 0, top: pre ? 1700 : 120, display: 'flex', justifyContent: 'center', transform: `scale(${(pre ? backOut((f - 20) / 12) : backOut((f - INTRO + 10) / 12)) * (tick ? 1 + 0.04 * Math.sin(u) : 1)})`}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '12px 30px', borderRadius: 50, background: '#1D1F24', border: '5px solid #fff', boxShadow: '0 6px 0 rgba(0,0,0,0.35)'}}>
								<img src={staticFile(`flags/${C.heroFlag}.svg`)} style={{width: 62, height: 42, objectFit: 'cover', borderRadius: 6, border: '3px solid #000'}} />
								<span style={{fontFamily: LILITA, fontSize: 46, color: '#fff'}}>{C.hud}</span>
								<span style={{fontFamily: LILITA, fontSize: 52, color: col, minWidth: 110}}>{p}%</span>
							</div>
						</div>
					);
				})()}
				{seg >= 0 && (() => {
					const r = C.regions[seg]; const out = 1 - clamp01((u - segs[seg] + 18) / 12);
					return (
						<div style={{position: 'absolute', left: 0, right: 0, top: 1390, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: out, transform: `scale(${1 + 0.025 * Math.sin(f / 11)}) rotate(${Math.sin(f / 17) * 1.2}deg)`}}>
							<div style={{transform: `scale(${backOut((u - 32) / 10)})`}}><span style={tx(76, '#fff')}>{r.name}</span></div>
							<div style={{transform: `scale(${backOut((u - 44) / 10)}) rotate(-2deg)`, marginTop: 4}}><span style={tx(r.verb.length > 16 ? 80 : r.verb.length > 13 ? 92 : 112, r.verbCol)}>{r.verb}</span></div>
						</div>
					);
				})()}
				{seg >= 0 && <Pill text={C.regions[seg].pill} p={(u - 58) / 16} y={1640} size={38} />}
				{fin && (() => {
					const u2 = f - F0;
					return (
						<>
							<div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
								<div style={{transform: `scale(${backOut((u2 - 36) / 10)}) rotate(-3deg)`}}><span style={tx(104, '#FFE14D')}>{C.finale[0]}</span></div>
								<div style={{transform: `scale(${backOut((u2 - 52) / 10)}) rotate(-3deg)`}}><span style={tx(C.finale[1].length > 9 ? 120 : 150, '#F03A2E')}>{C.finale[1]}</span></div>
							</div>
							<div style={{position: 'absolute', left: 0, right: 0, top: 1450, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((u2 - 140) / 10)})`}}><span style={tx(C.finale[2].length > 14 ? 90 : 110, '#fff')}>{C.finale[2]}</span></div>
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
	return {Video, TOTAL, sfx, music, S0, F0, IC};
}
