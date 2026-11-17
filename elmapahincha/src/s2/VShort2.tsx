// Motor v2 de shorts "¿Qué pasaría si...?" — más cercano al formato de referencia:
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
export type TLine = {k: string; start: number; end: number; words: Word[]};
export type Timeline = {total: number; audio: string; lines: TLine[]};
export type Spk = {k: string; mood: FaceMood; endMood?: FaceMood; ghost?: boolean; d?: number; dx?: number; dy?: number; talker?: boolean};
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
export const NAMES: Record<string, string> = {BRA: 'BRASIL', ARG: 'ARGENTINA', URY: 'URUGUAY', FRA: 'FRANCIA', ITA: 'ITALIA', DEU: 'ALEMANIA', ENG: 'INGLATERRA', ESP: 'ESPAÑA', MEX: 'MÉXICO', COL: 'COLOMBIA', USA: 'EE. UU.', PRT: 'PORTUGAL', CHN: 'CHINA', JPN: 'JAPÓN', CAN: 'CANADÁ', CHL: 'CHILE', PER: 'PERÚ', VEN: 'VENEZUELA', BOL: 'BOLIVIA', PRY: 'PARAGUAY', ECU: 'ECUADOR', CUB: 'CUBA', PAN: 'PANAMÁ', NLD: 'PAÍSES BAJOS', HRV: 'CROACIA', MAR: 'MARRUECOS'};
export const PAL: Record<string, string[]> = {
	BRA: ['#009C3B', '#FFDF00', '#002776', '#FFFFFF'], ARG: ['#74ACDF', '#FFFFFF', '#F6B40E'], URY: ['#0038A8', '#FFFFFF', '#FCD116'], COL: ['#FCD116', '#003893', '#CE1126'],
	CHL: ['#D52B1E', '#FFFFFF', '#0039A6'], PER: ['#D91023', '#FFFFFF'], ECU: ['#FFDD00', '#034EA2', '#ED1C24'], PRY: ['#D52B1E', '#FFFFFF', '#0038A8'],
	VEN: ['#FFCC00', '#00247D', '#CF142B', '#FFFFFF'], BOL: ['#D52B1E', '#F9E300', '#007934'], GUY: ['#009E49', '#FCD116', '#CE1126'], SUR: ['#377E3F', '#FFFFFF', '#B40A2D', '#ECC81D'], GUF: ['#0055A4', '#FFFFFF', '#EF4135'],
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
export const pop = (t: number, d = 0, st = 200) => spring({frame: t - d, fps: FPS, config: {damping: 9, stiffness: st, mass: 0.7}});
export const PopIn: React.FC<{t: number; d?: number; children: React.ReactNode; style?: React.CSSProperties; out?: number}> = ({t, d = 0, children, style, out}) => {
	const p = pop(t, d);
	const o = out !== undefined ? interpolate(t, [out, out + 10], [1, 0], clamp) : 1;
	return <div style={{transform: `scale(${p * (out !== undefined ? 0.6 + 0.4 * o : 1)})`, opacity: t < d ? 0 : o, ...style}}>{children}</div>;
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
const Captions: React.FC<{lines: TLine[]; f: number}> = ({lines, f}) => {
	const ln = lines.find((l) => f >= l.start && f < l.end + 8);
	if (!ln || !ln.words.length) return null;
	const ws = ln.words;
	let cur = ws.findIndex((w) => f < w.e);
	if (cur < 0) cur = ws.length - 1;
	const g0 = Math.floor(cur / 2) * 2, grp = ws.slice(g0, g0 + 2);
	const p = spring({frame: f - ws[g0].s, fps: FPS, config: {damping: 10, stiffness: 260}});
	const chars = grp.reduce((a, w) => a + w.w.length, 0) + grp.length;
	const size = Math.min(92, 1700 / chars);
	return (
		<div style={{position: 'absolute', top: 1170, left: 30, right: 30, display: 'flex', justifyContent: 'center', gap: 20, transform: `scale(${0.7 + 0.3 * p})`}}>
			{grp.map((w, i) => <T key={i} size={size} c={g0 + i === cur && f >= w.s ? YEL : '#fff'} sh={g0 + i === cur ? '#7A2E00' : INK}>{w.w}</T>)}
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

export const VShort2: React.FC<{tl: Timeline; def: ShortDef}> = ({tl, def}) => {
	const f = useCurrentFrame();
	const L = tl.lines;
	const LEAD = 28; // the camera starts flying a bit before the next line is spoken
	const st = (j: number) => L[j].start - (j > 0 ? LEAD : 0);
	let i = L.findIndex((l, j) => f < (j + 1 < L.length ? st(j + 1) : 1e9));
	if (i < 0) i = L.length - 1;
	const sc = def.scenes[i];
	const tc = f - st(i);
	const t = f - L[i].start, len = L[i].end - L[i].start;
	// whip-zoom camera between scenes
	const c1 = camFor(sc), c0 = camFor(def.scenes[Math.max(0, i - 1)]);
	// camera flight across the map: pan from one place to the next, pulling back just enough to travel
	const TR = 44;
	const e = i === 0 ? 1 : interpolate(tc, [0, TR], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
	const dist = Math.hypot(c1.x - c0.x, c1.y - c0.y);
	const lzMid = Math.min(Math.log(c0.z), Math.log(c1.z), Math.log(900 / (dist + 1)));
	const lzLin = (Math.log(c0.z) + Math.log(c1.z)) / 2;
	const dip = i === 0 ? 0 : Math.sin(Math.PI * e) * Math.max(0, lzLin - lzMid);
	const lz = Math.log(c0.z) + (Math.log(c1.z) - Math.log(c0.z)) * e - dip;
	let cam: Cam = {x: c0.x + (c1.x - c0.x) * e, y: c0.y + (c1.y - c0.y) * e, z: Math.exp(lz)};
	// slow push-in while a scene is on screen
	cam.z *= 1 + 0.0009 * Math.max(0, tc - TR);
	// hook: zoom out after the explosions
	const booms = def.booms ?? [];
	const lastBoom = booms.length ? Math.max(...booms.map((b) => b.at)) : -1;
	if (i === 0 && booms.length) cam.z *= interpolate(f, [lastBoom + 10, lastBoom + 50], [1, 0.62], {...clamp, easing: Easing.inOut(Easing.cubic)});
	// camera shake after explosions + flashes
	let shake = 0;
	for (const b of booms) shake += interpolate(f - b.at, [0, 4, 22], [0, 14, 0], clamp);
	cam = {...cam, x: cam.x + (Math.sin(f * 1.7) * shake) / cam.z, y: cam.y + (Math.cos(f * 2.3) * shake) / cam.z};
	const blur = 0;
	// fills: flags everywhere (no faces), exploded countries grey
	const fills: Record<string, Fill> = {};
	for (const c of ALL) {
		if (!WORLD[c]) continue;
		const b = booms.find((x) => x.k === c);
		if (b && f >= b.at) { fills[c] = {color: f < b.at + 5 ? '#F4F6FA' : '#4E535C'}; continue; }
		fills[c] = {flag: FL[c], lift: (sc.lift ?? []).includes(c) ? 1 : 0};
	}
	// flash overlay
	const flash = Math.max(0, ...(def.flashAt ?? []).map((a) => interpolate(f - a, [0, 2, 16], [0, 0.85, 0], clamp)));
	// speakers
	const talking = L[i].words.some((w) => f >= w.s && f < w.e);
	return (
		<AbsoluteFill style={{background: '#2A72BA', overflow: 'hidden'}}>
			<Fonts />
			<FlagPreload flags={ALL.map((c) => FL[c]).filter(Boolean)} />
			<div style={{position: 'absolute', inset: 0, filter: blur > 0.3 ? `blur(${blur}px)` : undefined}}>
				<Atlas21 cam={cam} fills={fills} faces={{}} W={W} H={H} dark={0.05} />
			</div>
			{/* explosions */}
			{booms.map((b, j) => { const c = center(b.k); const s = toScr(cam, c.x, c.y); return <React.Fragment key={b.k}><Ring x={s.x} y={s.y} t={f - b.at} r1={Math.max(260, c.w * cam.z * 1.2)} /><Confetti x={s.x} y={s.y} w={c.w * cam.z * 0.8} h={c.h * cam.z * 0.8} t={f - b.at} cols={PAL[b.k] ?? ['#fff', '#ccc']} seed={j + 3} n={Math.min(140, 50 + c.w * 0.5)} /></React.Fragment>; })}
			{sc.qmarks && booms.filter((b) => f > b.at + 30).slice(0, 8).map((b, j) => { const c = center(b.k); const s = toScr(cam, c.x, c.y); return <QMark key={b.k} x={s.x} y={s.y} t={f - b.at - 30} i={j} />; })}
			{/* speaker balls (sit on their country) */}
			{(sc.spk ?? []).map((s, j) => {
				const boom = booms.find((b) => b.k === s.k);
				if (boom && !s.ghost && f >= boom.at + 3) return null;
				const c = center(s.k), p = toScr(cam, c.x, c.y);
				const d = s.d ?? 300;
				const isMain = j === 0;
				const x = isMain && !s.dx && !(sc.spk!.length > 1) ? 540 : p.x + (s.dx ?? 0);
				const y = isMain && !(sc.spk!.length > 1) ? BALL_Y + (p.y - BALL_Y) * 0.15 : p.y + (s.dy ?? 0);
				const pin = spring({frame: tc - (i === 0 ? 0 : TR - 4) - j * 4, fps: FPS, config: {damping: 8, stiffness: 220, mass: 0.6}});
				const preBoom = boom && !s.ghost ? interpolate(f, [boom.at - 4, boom.at + 3], [1, 1.35], clamp) : 1;
				const mood = s.endMood && t > len * 0.5 ? s.endMood : s.mood;
				const tk = (s.talker ?? isMain) && talking ? 0.5 + 0.5 * Math.abs(Math.sin(f / 3)) : 0;
				const shk = mood === 'panic' || mood === 'scared' || mood === 'shock' ? Math.sin(f * 2.1) * 3 : 0;
				const bob = s.ghost ? Math.sin(f / 12) * 12 : Math.sin(f / 18 + j) * 5;
				return <div key={s.k} style={{position: 'absolute', left: x - d / 2 + shk, top: y - d / 2 + bob, transform: `scale(${pin * preBoom})`, opacity: boom && !s.ghost ? interpolate(f, [boom.at, boom.at + 3], [1, 0], clamp) : 1}}>
					<Ball k={s.k} d={d} mood={mood} talk={tk} ghost={s.ghost} f={f + j * 30} look={[0, 0.1]} />
				</div>;
			})}
			{sc.props && sc.props(t, len)}
			{def.cta && i === L.length - 1 && <Hearts f={f} keys={def.cta} />}
			<div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash}} />
			<Title rows={def.title} />
			<Captions lines={L} f={f} />
			<Audio src={staticFile(tl.audio)} />
		</AbsoluteFill>
	);
};
