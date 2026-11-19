// Motor v3 de shorts (más suave): cámara por keyframes con curvas smootherstep y arco de zoom, entradas suaves.
// Basado en el motor v2 de shorts "¿Qué pasaría si...?" — más cercano al formato de referencia:
// gancho con explosión de confeti + flash + ondas, bolas sobre su país, zoom "látigo" entre escenas,
// objetos que aparecen uno a uno, cifras grandes y subtítulos palabra a palabra en el centro.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, Audio} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Atlas21, Face12, FaceMood, Fill, INK} from '../v21/Atlas21';
import {ALL, FL} from '../v21/data21';
import {mainBox} from '../v21/Thumbs21b';

export const W = 1080, H = 1920, FPS = 60;
export const YEL = '#FFD23F', RED = '#FF3B3B', ORG = '#FF8A00';
export type Cam = {x: number; y: number; z: number};
export type Word = {w: string; s: number; e: number};
export type TLine = {k: string; start: number; end: number; words: Word[]; amp?: number[]};
export type Timeline = {total: number; audio: string; lines: TLine[]};
export type Spk = {k: string; mood: FaceMood; endMood?: FaceMood; moods?: [string, FaceMood][]; ghost?: boolean; d?: number; dx?: number; dy?: number; talker?: boolean; at?: string; map?: boolean};
export type Scene = {
	focus?: string; z?: number; cam?: Cam;        // camera: frame a country (ball sits on it) or explicit cam
	spk?: Spk[];
	lift?: string[];
	props?: (t: number, len: number) => React.ReactNode;
	qmarks?: boolean;
};
export type Boom = {k: string; at: number}; // country explodes at absolute frame
export type ShortDef = {title: [string, string?][][]; scenes: Scene[]; booms?: Boom[]; flashAt?: number[]; cta?: string[]};

const rnd = (s: number) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const NAMES: Record<string, string> = {BRA: 'BRASIL', ARG: 'ARGENTINA', URY: 'URUGUAY', FRA: 'FRANCIA', ITA: 'ITALIA', DEU: 'ALEMANIA', ENG: 'INGLATERRA', ESP: 'ESPAÑA', MEX: 'MÉXICO', COL: 'COLOMBIA', USA: 'EE. UU.', PRT: 'PORTUGAL', CHN: 'CHINA', JPN: 'JAPÓN', CAN: 'CANADÁ', CHL: 'CHILE', PER: 'PERÚ', VEN: 'VENEZUELA', BOL: 'BOLIVIA', PRY: 'PARAGUAY', ECU: 'ECUADOR', CUB: 'CUBA', PAN: 'PANAMÁ', NLD: 'PAÍSES BAJOS', HRV: 'CROACIA', MAR: 'MARRUECOS', SWE: 'SUECIA', BIH: 'BOSNIA'};
export const PAL: Record<string, string[]> = {
	BRA: ['#009C3B', '#FFDF00', '#002776', '#FFFFFF'], ARG: ['#74ACDF', '#FFFFFF', '#F6B40E'], URY: ['#0038A8', '#FFFFFF', '#FCD116'], COL: ['#FCD116', '#003893', '#CE1126'],
	CHL: ['#D52B1E', '#FFFFFF', '#0039A6'], PER: ['#D91023', '#FFFFFF'], ECU: ['#FFDD00', '#034EA2', '#ED1C24'], PRY: ['#D52B1E', '#FFFFFF', '#0038A8'],
	VEN: ['#FFCC00', '#00247D', '#CF142B', '#FFFFFF'], BOL: ['#D52B1E', '#F9E300', '#007934'], GUY: ['#009E49', '#FCD116', '#CE1126'], SUR: ['#377E3F', '#FFFFFF', '#B40A2D', '#ECC81D'], GUF: ['#0055A4', '#FFFFFF', '#EF4135'],
	ITA: ['#009246', '#FFFFFF', '#CE2B37', '#FFFFFF'], ESP: ['#AA151B', '#F1BF00', '#AA151B', '#F1BF00', '#FFFFFF'],
};
export const center = (k: string) => { const b = mainBox(k); return {x: (b[0] + b[2]) / 2, y: (b[1] + b[3]) / 2, w: b[2] - b[0], h: b[3] - b[1]}; };
export const toScr = (c: Cam, x: number, y: number) => ({x: W / 2 + (x - c.x) * c.z, y: H / 2 + (y - c.y) * c.z});
const BALL_Y = 700;
const camFor = (s: Scene): Cam => {
	if (s.cam) return s.cam;
	const c = center(s.focus!);
	const z = s.z ?? Math.max(1.2, Math.min(7, 760 / Math.max(c.w, c.h * 0.8)));
	return {x: c.x, y: c.y + (H / 2 - BALL_Y) / z, z};
};

// ---------- text ----------
export const T: React.FC<{size: number; c?: string; sw?: number; children: React.ReactNode; style?: React.CSSProperties; sh?: string}> = ({size, c = '#fff', sw = 0.12, children, style, sh = INK}) => (
	<span style={{fontFamily: LILITA, fontSize: size, lineHeight: 1.0, color: c, WebkitTextStroke: `${size * sw}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.07}px 0 ${sh}`, whiteSpace: 'nowrap', ...style}}>{children}</span>
);
export const pop = (t: number, d = 0, st = 170) => spring({frame: t - d, fps: FPS, config: {damping: 20, stiffness: st, mass: 0.8}});
export const PopIn: React.FC<{t: number; d?: number; children: React.ReactNode; style?: React.CSSProperties; out?: number}> = ({t, d = 0, children, style, out}) => {
	const p = pop(t, d);
	const fi = interpolate(t, [d, d + 10], [0, 1], clamp);
	const o = out !== undefined ? interpolate(t, [out, out + 16], [1, 0], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 1;
	return <div style={{transform: `translateY(${(1 - p) * 40}px) scale(${(0.4 + 0.6 * p) * (out !== undefined ? 0.8 + 0.2 * o : 1)})`, opacity: fi * o, filter: fi < 1 ? `blur(${(1 - fi) * 8}px)` : undefined, ...style}}>{children}</div>;
};
// big yellow stat (like "9/10")
export const Stat: React.FC<{t: number; d?: number; children: React.ReactNode; size?: number; c?: string; y?: number}> = ({t, d = 0, children, size = 150, c = YEL, y = 1000}) => (
	<div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
		<PopIn t={t} d={d}><T size={size} c={c} sw={0.13} sh="#7A2E00">{children}</T></PopIn>
	</div>
);
const Title: React.FC<{rows: [string, string?][][]}> = ({rows}) => (
	<div style={{position: 'absolute', top: 120, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))'}}>
		{rows.map((r, i) => <div key={i} style={{display: 'flex', gap: 14}}>{r.map(([t, c], j) => <T key={j} size={c ? 74 : 60} c={c} sh={c ? '#7A2E00' : INK}>{t}</T>)}</div>)}
	</div>
);
// chunks of 1-3 words; each chunk stays on screen until the first word of the NEXT chunk starts
type Chunk = {words: Word[]; s: number};
const chunkCache = new WeakMap<TLine[], Chunk[]>();
const chunksOf = (lines: TLine[]): Chunk[] => {
	const hit = chunkCache.get(lines); if (hit) return hit;
	const out: Chunk[] = [];
	for (const l of lines) {
		let cur: Word[] = [];
		const flush = () => { if (cur.length) out.push({words: cur, s: cur[0].s}); cur = []; };
		for (const w of l.words) {
			const len = cur.reduce((a, x) => a + x.w.length + 1, 0) + w.w.length;
			if (cur.length && (cur.length >= 3 || len > 15 || /[.!?…,;:]$/.test(cur[cur.length - 1].w))) flush();
			cur.push(w);
		}
		flush();
	}
	chunkCache.set(lines, out);
	return out;
};
const Captions: React.FC<{lines: TLine[]; f: number}> = ({lines, f}) => {
	const ch = chunksOf(lines);
	let ci = -1;
	for (let q = 0; q < ch.length; q++) if (f >= ch[q].s - 1) ci = q;
	if (ci < 0) return null;
	const c = ch[ci];
	const lastEnd = lines[lines.length - 1].end + 30;
	if (ci === ch.length - 1 && f > lastEnd) return null;
	const p = spring({frame: f - c.s + 1, fps: FPS, config: {damping: 18, stiffness: 260, mass: 0.6}});
	const chars = c.words.reduce((a, w) => a + w.w.length, 0) + c.words.length;
	const size = Math.min(96, 1600 / chars);
	let cur = 0;
	c.words.forEach((w, k) => { if (f >= w.s - 1) cur = k; });
	return (
		<div style={{position: 'absolute', top: 1250, left: 30, right: 30, display: 'flex', justifyContent: 'center', gap: 20, transform: `scale(${0.88 + 0.12 * p})`, opacity: Math.min(1, p * 1.6)}}>
			{c.words.map((w, k) => <T key={k} size={size} c={k === cur ? YEL : '#fff'} sh={k === cur ? '#7A2E00' : INK}>{w.w}</T>)}
		</div>
	);
};
// ---------- ball ----------
export const Ball: React.FC<{k: string; d: number; mood: FaceMood; talk?: number; ghost?: boolean; look?: [number, number]; f?: number; name?: boolean}> = ({k, d, mood, talk = 0, ghost, look = [0, 0], f = 0, name = true}) => (
	<div style={{position: 'relative', width: d, height: d, filter: ghost ? 'grayscale(1) brightness(1.15) drop-shadow(0 0 16px rgba(255,255,255,0.9))' : 'drop-shadow(0 10px 0 rgba(0,0,0,0.35))', opacity: ghost ? 0.88 : 1}}>
		<div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', border: `${d * 0.05}px solid #fff`, boxShadow: `0 0 0 ${d * 0.03}px ${INK}`}}>
			<img src={staticFile(`flags/${FL[k] ?? k.toLowerCase()}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45), rgba(255,255,255,0) 32%), radial-gradient(circle at 60% 70%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28) 100%)'}} />
		</div>
		<svg width={d * 0.78} height={d * 0.78} viewBox="0 0 200 200" style={{position: 'absolute', left: d * 0.11, top: d * 0.12, overflow: 'visible'}}><Face12 mood={mood} look={look} talk={talk} blink={(f % 150) < 5 ? 1 : 0} /></svg>
		{name && NAMES[k] && <div style={{position: 'absolute', left: '50%', top: d * 0.98, transform: 'translateX(-50%)', background: '#fff', border: `4px solid ${INK}`, borderRadius: 10, padding: '1px 12px'}}><span style={{fontFamily: LILITA, fontSize: d * 0.11, color: INK}}>{NAMES[k]}</span></div>}
	</div>
);
// ---------- explosion pieces ----------
const Confetti: React.FC<{x: number; y: number; w: number; h: number; t: number; cols: string[]; seed: number; n?: number}> = ({x, y, w, h, t, cols, seed, n = 90}) => {
	if (t < 0 || t > 110) return null;
	const R = rnd(seed * 977 + 13);
	return (
		<svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			{Array.from({length: n}, (_, i) => {
				const ox = (R() - 0.5) * w, oy = (R() - 0.5) * h;
				const a = Math.atan2(oy, ox) + (R() - 0.5) * 1.2, sp = 6 + R() * 16;
				const tt = t * (0.8 + R() * 0.4);
				const px = x + ox + Math.cos(a) * sp * tt * Math.exp(-tt / 60) * 2.2, py = y + oy + Math.sin(a) * sp * tt * Math.exp(-tt / 60) * 2.2 + 0.05 * tt * tt;
				const s = 8 + R() * 16, rot = R() * 360 + tt * (R() * 20 - 10);
				const c = cols[i % cols.length];
				return <rect key={i} x={px - s / 2} y={py - s / 2} width={s} height={s * (R() > 0.5 ? 1 : 0.55)} rx={s * 0.2} fill={c} stroke="rgba(0,0,0,0.35)" strokeWidth={1.2} opacity={interpolate(t, [70, 110], [1, 0], clamp)} transform={`rotate(${rot} ${px} ${py})`} />;
			})}
		</svg>
	);
};
const Ring: React.FC<{x: number; y: number; t: number; r0?: number; r1?: number}> = ({x, y, t, r0 = 30, r1 = 520}) => {
	if (t < 0 || t > 36) return null;
	const r = interpolate(t, [0, 36], [r0, r1], {easing: Easing.out(Easing.cubic)});
	return <svg width={W} height={H} style={{position: 'absolute', inset: 0}}><circle cx={x} cy={y} r={r} fill="none" stroke="#fff" strokeWidth={interpolate(t, [0, 36], [16, 2])} opacity={interpolate(t, [0, 36], [0.95, 0])} /><circle cx={x} cy={y} r={r * 0.7} fill="none" stroke="#fff" strokeWidth={interpolate(t, [0, 36], [8, 1])} opacity={interpolate(t, [0, 36], [0.6, 0])} /></svg>;
};
const QMark: React.FC<{x: number; y: number; t: number; i: number}> = ({x, y, t, i}) => {
	const p = pop(t, i * 4);
	return <div style={{position: 'absolute', left: x - 34, top: y - 60 + Math.sin((t + i * 20) / 12) * 8, transform: `scale(${p})`}}>
		<svg width={68} height={64} viewBox="0 0 68 64"><path d="M6 6 H62 V44 H30 L18 58 L20 44 H6 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><text x={34} y={36} textAnchor="middle" fontFamily={LILITA} fontSize={30} fill={INK}>¿?</text></svg>
	</div>;
};
const Hearts: React.FC<{f: number; keys: string[]}> = ({f, keys}) => {
	const R = rnd(77);
	return <>{Array.from({length: 26}, (_, i) => {
		const x0 = 40 + R() * 1000, sp = 3 + R() * 3, ph = R() * 300, k = keys[i % keys.length];
		const y = 2000 - ((f * sp + ph * 6) % 2200), s = 70 + R() * 60;
		return <div key={i} style={{position: 'absolute', left: x0, top: y, width: s, height: s, transform: `rotate(${Math.sin((f + ph) / 16) * 16}deg)`}}>
			<svg viewBox="0 0 100 100" width={s} height={s}><defs><clipPath id={`hh${i}`}><path d="M50 88 C10 60 0 38 14 22 C28 6 46 14 50 28 C54 14 72 6 86 22 C100 38 90 60 50 88 Z" /></clipPath></defs>
				<image href={staticFile(`flags/${FL[k]}.svg`)} x={-20} y={0} width={140} height={100} preserveAspectRatio="xMidYMid slice" clipPath={`url(#hh${i})`} />
				<path d="M50 88 C10 60 0 38 14 22 C28 6 46 14 50 28 C54 14 72 6 86 22 C100 38 90 60 50 88 Z" fill="none" stroke={INK} strokeWidth={6} /></svg>
		</div>;
	})}</>;
};

// little emotion bubbles next to a ball (pop when the mood changes)
const Emote: React.FC<{mood: FaceMood; t: number; d: number; f: number}> = ({mood, t, d, f}) => {
	const p = pop(t, 0, 260);
	const fade = interpolate(t, [70, 90], [1, 0], clamp);
	if (t > 90 || t < 0) return null;
	const wob = Math.sin(f / 5) * 6;
	const at = (x: number, y: number, ch: React.ReactNode) => <div style={{position: 'absolute', left: d * x, top: d * y, transform: `scale(${p}) rotate(${wob}deg)`, opacity: fade}}>{ch}</div>;
	const txt = (c: string, s: string, size = d * 0.32) => <span style={{fontFamily: LILITA, fontSize: size, color: c, WebkitTextStroke: `${size * 0.12}px ${INK}`, paintOrder: 'stroke fill'}}>{s}</span>;
	if (mood === 'angry') return at(0.78, -0.12, <svg width={d * 0.32} height={d * 0.32} viewBox="-50 -50 100 100"><g stroke={INK} strokeWidth={22} strokeLinecap="round"><path d="M-30 -10 Q-12 -12 -10 -30 M30 -10 Q12 -12 10 -30 M-30 10 Q-12 12 -10 30 M30 10 Q12 12 10 30" /></g><g stroke="#FF2D2D" strokeWidth={12} strokeLinecap="round" fill="none"><path d="M-30 -10 Q-12 -12 -10 -30 M30 -10 Q12 -12 10 -30 M-30 10 Q-12 12 -10 30 M30 10 Q12 12 10 30" /></g></svg>);
	if (mood === 'shock' || mood === 'scared' || mood === 'panic') return at(0.8, -0.18, txt(YEL, '!!'));
	if (mood === 'love' || mood === 'happy') return <>{[0, 1, 2].map((j) => <div key={j} style={{position: 'absolute', left: d * (0.75 + j * 0.08), top: d * (0.05 - ((t * 1.2 + j * 25) % 70) / 100), opacity: fade * (1 - ((t * 1.2 + j * 25) % 70) / 70)}}><svg width={d * 0.16} height={d * 0.16} viewBox="0 0 100 100"><path d="M50 88 C10 60 0 38 14 22 C28 6 46 14 50 28 C54 14 72 6 86 22 C100 38 90 60 50 88 Z" fill="#FF4D6D" stroke={INK} strokeWidth={8} /></svg></div>)}</>;
	if (mood === 'sad' || mood === 'worried') return at(0.82, -0.1, <svg width={d * 0.16} height={d * 0.22} viewBox="0 0 60 80"><path d="M30 4 C44 30 54 44 54 56 A24 24 0 0 1 6 56 C6 44 16 30 30 4 Z" fill="#7FD3FF" stroke={INK} strokeWidth={6} /></svg>);
	if (mood === 'smug' || mood === 'cool') return at(0.8, -0.14, txt('#fff', '¬¬', d * 0.22));
	return null;
};

export const VShort3: React.FC<{tl: Timeline; def: ShortDef}> = ({tl, def}) => {
	const f = useCurrentFrame();
	const L = tl.lines, N = L.length;
	const booms = def.booms ?? [];
	const lastBoom = booms.length ? Math.max(...booms.map((b) => b.at)) : -1;
	// ---- camera like the reference: straight moves in x/y + zoom, one easing curve for all three
	// (no arcs, no overshoot). Every scene has its own slow zoom drift; a transition blends the two
	// drifting states with smootherstep so velocity is continuous at both ends.
	const arrive = (j: number) => (j === 0 ? 0 : L[j].start + 6);
	const ss = (u: number) => { const x = Math.max(0, Math.min(1, u)); return x * x * x * (x * (x * 6 - 15) + 10); };
	const keys = def.scenes.slice(0, N).map((sc0) => camFor(sc0));
	const trav = (q: number) => { const A = keys[q - 1], B = keys[q]; const px = Math.hypot(B.x - A.x, B.y - A.y) * Math.sqrt(A.z * B.z) + Math.abs(Math.log(B.z / A.z)) * 500; return Math.round(Math.min(84, Math.max(48, 40 + px * 0.025))); };
	const DRIFT = 0.00045; // log-zoom per frame (~2.7%/s)
	const state = (j: number, fr: number): [number, number, number] => {
		const K = keys[j];
		let lz = Math.log(K.z) + (j % 2 === 0 ? 1 : -1) * DRIFT * (fr - arrive(j));
		if (j === 0 && booms.length) lz += Math.log(0.75) * ss((fr - lastBoom - 10) / 90);
		return [K.x, K.y, lz];
	};
	const camAt = (fr: number): [number, number, number] => {
		let j = 0;
		while (j + 1 < N && fr >= arrive(j + 1) - trav(j + 1)) j++;
		const B = state(j, fr);
		if (j > 0) {
			const T0 = arrive(j) - trav(j), u = (fr - T0) / trav(j);
			if (u < 1) {
				const A = state(j - 1, fr), e = ss(u);
				return [A[0] + (B[0] - A[0]) * e, A[1] + (B[1] - A[1]) * e, A[2] + (B[2] - A[2]) * e];
			}
		}
		return B;
	};
	const [cx0, cy0, lz0] = camAt(f);
	let cam: Cam = {x: cx0, y: cy0, z: Math.exp(lz0)};
	const leave = (j: number) => (j === N - 1 ? 1e9 : arrive(j + 1) - Math.round(trav(j + 1) * 0.6));
	// soft shake on explosions
	let shake = 0;
	for (const b of booms) shake += interpolate(f - b.at, [0, 3, 24], [0, 3, 0], clamp);
	cam = {...cam, x: cam.x + (Math.sin(f * 0.9) * shake) / cam.z, y: cam.y + (Math.cos(f * 1.1) * shake) / cam.z};
	// ---- which scene's content is on screen (switches while the camera is travelling)
	let i = 0;
	while (i + 1 < N && f >= leave(i) + 16) i++;
	const sc = def.scenes[i];
	const t = f - L[i].start, len = L[i].end - L[i].start;
	const outK = i === N - 1 ? 1 : interpolate(f, [leave(i) - 10, leave(i) + 14], [1, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const inAt = i === 0 ? 0 : arrive(i) - 24;
	// ---- map fills
	const fills: Record<string, Fill> = {};
	for (const c of ALL) {
		if (!WORLD[c]) continue;
		const b = booms.find((x) => x.k === c);
		if (b && f >= b.at) { fills[c] = {color: f < b.at + 5 ? '#F4F6FA' : '#4E535C'}; continue; }
		fills[c] = {flag: FL[c], lift: (sc.lift ?? []).includes(c) && f >= inAt ? 1 : 0};
	}
	const flash = Math.max(0, ...(def.flashAt ?? []).map((a) => interpolate(f - a, [0, 2, 16], [0, 0.85, 0], clamp)));
	// ---- lip sync from the real audio envelope
	const ln = L[i];
	const ai = f - ln.start;
	const amp = ln.amp && ai >= 0 && ai < ln.amp.length ? ln.amp[ai] : 0;
	const ampS = ln.amp ? [0, 1, 2].reduce((a, k) => a + (ln.amp![Math.max(0, Math.min(ln.amp!.length - 1, ai - k))] ?? 0), 0) / 3 : 0;
	const wordIdx = (pre: string) => ln.words.find((w) => w.w.toLowerCase().replace(/[¡!¿?,.…]/g, '').startsWith(pre));
	return (
		<AbsoluteFill style={{background: '#2A72BA', overflow: 'hidden'}}>
			<Fonts />
			<FlagPreload flags={ALL.map((c) => FL[c]).filter(Boolean)} />
			<Atlas21 cam={cam} fills={fills} faces={{}} W={W} H={H} dark={0.05} cullPad={5000} />
			{booms.map((b, k) => { const c = center(b.k); const p = toScr(cam, c.x, c.y); return <React.Fragment key={b.k}><Ring x={p.x} y={p.y} t={f - b.at} r1={Math.max(260, c.w * cam.z * 1.2)} /><Confetti x={p.x} y={p.y} w={c.w * cam.z * 0.8} h={c.h * cam.z * 0.8} t={f - b.at} cols={PAL[b.k] ?? ['#fff', '#ccc']} seed={k + 3} n={Math.min(140, 50 + c.w * 0.5)} /></React.Fragment>; })}
			{sc.qmarks && booms.filter((b) => f > b.at + 30).slice(0, 8).map((b, k) => { const c = center(b.k); const p = toScr(cam, c.x, c.y); return <div key={b.k} style={{opacity: outK}}><QMark x={p.x} y={p.y} t={f - b.at - 30} i={k} /></div>; })}
			{(sc.spk ?? []).map((s, k) => {
				const boom = booms.find((b) => b.k === s.k);
				if (boom && !s.ghost && f >= boom.at + 3) return null;
				const c = center(s.k), p = toScr(cam, c.x, c.y);
				const d = s.d ?? 300;
				const x = s.map ? p.x + (s.dx ?? 0) : 540 + (s.dx ?? 0);
				const y = s.map ? p.y + (s.dy ?? 0) : BALL_Y + (s.dy ?? 0);
				const appear = s.at ? (wordIdx(s.at)?.s ?? ln.start) - 8 : inAt + k * 6;
				const pin = spring({frame: f - appear, fps: FPS, config: {damping: 20, stiffness: 170, mass: 0.8}});
				const preBoom = boom && !s.ghost ? interpolate(f, [boom.at - 6, boom.at + 3], [1, 1.3], clamp) : 1;
				// expression follows the words
				let mood = s.endMood && t > len * 0.5 ? s.endMood : s.mood;
				let moodAt = s.endMood && t > len * 0.5 ? ln.start + len * 0.5 : appear;
				for (const [pre, m] of s.moods ?? []) { const w = wordIdx(pre); if (w && f >= w.s - 4) { mood = m; moodAt = w.s - 4; } }
				const isTalker = s.talker ?? k === 0;
				const talk = isTalker ? Math.min(1, ampS * 1.6) : 0;
				const sq = isTalker ? ampS * 0.025 : 0; // tiny breathing with the voice
				const shk = 0;
				const bob = s.ghost ? Math.sin(f / 40 + k) * 6 : Math.sin(f / 45 + k) * 3;
				const tilt = Math.sin(f / 70 + k) * 1.2;
				const jump = 0;
				const moodPulse = mood !== s.mood && f >= moodAt ? 1 + 0.06 * Math.sin(Math.min(1, (f - moodAt) / 20) * Math.PI) : 1;
				return <div key={s.k} style={{position: 'absolute', left: x - d / 2 + shk, top: y - d / 2 + bob + jump, transform: `scale(${Math.max(0, pin) * preBoom * outK * moodPulse}) scaleX(${1 - sq * 0.5}) scaleY(${1 + sq}) rotate(${tilt}deg)`, transformOrigin: '50% 90%', opacity: (boom && !s.ghost ? interpolate(f, [boom.at, boom.at + 3], [1, 0], clamp) : 1) * Math.min(1, pin * 2)}}>
					<Ball k={s.k} d={d} mood={mood} talk={talk} ghost={s.ghost} f={f + k * 37} look={[Math.sin(f / 70 + k) * 0.25, 0.1]} />
					{f - moodAt >= 0 && f >= appear && <Emote mood={mood} t={f - Math.max(moodAt, appear)} d={d} f={f} />}
				</div>;
			})}
			{sc.props && <div style={{position: 'absolute', inset: 0, opacity: outK, transform: `translateY(${(1 - outK) * -30}px) scale(${0.92 + 0.08 * outK})`, transformOrigin: '50% 55%', filter: outK < 1 ? `blur(${(1 - outK) * 6}px)` : undefined}}>{sc.props(t, len)}</div>}
			{def.cta && i === N - 1 && <Hearts f={f - L[N - 1].start} keys={def.cta} />}
			<div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash}} />
			<Title rows={def.title} />
			<Captions lines={L} f={f} />
			<Audio src={staticFile(tl.audio)} />
		</AbsoluteFill>
	);
};
