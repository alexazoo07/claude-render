// Motor de shorts "¿Qué pasaría si...?" (formato vertical con países que hablan con voces de Cartesia)
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, Audio} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Atlas21, Face12, FaceMood, FaceSpec, Fill, INK} from '../v21/Atlas21';
import {ALL, FL} from '../v21/data21';
import {mainBox} from '../v21/Thumbs21b';

export const W = 1080, H = 1920, FPS = 60;
export const YEL = '#FFD23F', RED = '#FF3B3B';
export type Cam = {x: number; y: number; z: number};
export type Word = {w: string; s: number; e: number};
export type TLine = {k: string; start: number; end: number; words: Word[]};
export type Timeline = {total: number; audio: string; lines: TLine[]};
export type Scene = {
	cam: Cam;
	speaker?: string; ghost?: boolean; mood?: FaceMood; endMood?: FaceMood;
	lift?: string[];
	card?: (t: number, len: number) => React.ReactNode; // t = frames since line start
};
export type ShortDef = {title: [string, string?][][]; scenes: Scene[]; grey?: (k: string, f: number) => number; greyStart?: number; dust?: string[]; cta?: boolean};

const ease = Easing.bezier(0.45, 0, 0.2, 1);
const rnd = (s: number) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
const NAMES: Record<string, string> = {BRA: 'BRASIL', ARG: 'ARGENTINA', URY: 'URUGUAY', FRA: 'FRANCIA', ITA: 'ITALIA', DEU: 'ALEMANIA', ENG: 'INGLATERRA', ESP: 'ESPAÑA', MEX: 'MÉXICO', COL: 'COLOMBIA', USA: 'EE. UU.', PRT: 'PORTUGAL', CHN: 'CHINA', JPN: 'JAPÓN', CAN: 'CANADÁ', CHL: 'CHILE', PER: 'PERÚ', VEN: 'VENEZUELA', BOL: 'BOLIVIA', PRY: 'PARAGUAY', ECU: 'ECUADOR', CUB: 'CUBA', PAN: 'PANAMÁ', NLD: 'PAÍSES BAJOS', HRV: 'CROACIA', MAR: 'MARRUECOS'};
export const center = (k: string) => { const b = mainBox(k); return {x: (b[0] + b[2]) / 2, y: (b[1] + b[3]) / 2}; };
export const toScr = (c: Cam, x: number, y: number) => ({x: W / 2 + (x - c.x) * c.z, y: H / 2 + (y - c.y) * c.z});

// ---------- texts ----------
export const T: React.FC<{size: number; c?: string; sw?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({size, c = '#fff', sw = 0.1, children, style}) => (
	<span style={{fontFamily: LILITA, fontSize: size, lineHeight: 1.02, color: c, WebkitTextStroke: `${size * sw}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.06}px 0 ${INK}`, whiteSpace: 'nowrap', ...style}}>{children}</span>
);
const Title: React.FC<{rows: [string, string?][][]}> = ({rows}) => (
	<div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
		{rows.map((r, i) => <div key={i} style={{display: 'flex', gap: 16}}>{r.map(([t, c], j) => <T key={j} size={i === 1 ? 82 : 66} c={c}>{t}</T>)}</div>)}
	</div>
);
// word-by-word captions (groups of up to 3 words, current word in yellow)
const Captions: React.FC<{lines: TLine[]; f: number}> = ({lines, f}) => {
	const ln = lines.find((l) => f >= l.start && f < l.end + 10);
	if (!ln) return null;
	const ws = ln.words;
	let cur = ws.findIndex((w) => f < w.e);
	if (cur < 0) cur = ws.length - 1;
	const g0 = Math.floor(cur / 3) * 3, grp = ws.slice(g0, g0 + 3);
	const gs = ws[g0].s;
	const p = spring({frame: f - gs, fps: FPS, config: {damping: 12, stiffness: 220}});
	return (
		<div style={{position: 'absolute', top: 1440, left: 40, right: 40, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 18, transform: `scale(${0.85 + 0.15 * p})`}}>
			{grp.map((w, i) => <T key={i} size={84} c={g0 + i === cur && f >= w.s ? YEL : '#fff'}>{w.w}</T>)}
		</div>
	);
};
// ---------- talking country ball ----------
export const Ball: React.FC<{k: string; d: number; x: number; y: number; mood: FaceMood; talk?: number; ghost?: boolean; look?: [number, number]; name?: boolean; f?: number}> = ({k, d, x, y, mood, talk = 0, ghost, look = [0, 0], name = true, f = 0}) => (
	<div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, filter: ghost ? 'grayscale(1) brightness(1.1) drop-shadow(0 0 18px rgba(255,255,255,0.8))' : undefined, opacity: ghost ? 0.9 : 1}}>
		<div style={{position: 'absolute', inset: 0, borderRadius: '50%', transform: `translate(${d * 0.02}px, ${d * 0.07}px)`, background: 'rgba(0,0,0,0.45)'}} />
		<div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', border: `${d * 0.045}px solid #fff`, boxShadow: `0 0 0 ${d * 0.028}px ${INK}`}}>
			<img src={staticFile(`flags/${FL[k] ?? k.toLowerCase()}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.4), rgba(255,255,255,0) 35%), radial-gradient(circle at 60% 70%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.3) 100%)'}} />
		</div>
		<svg width={d * 0.74} height={d * 0.74} viewBox="0 0 200 200" style={{position: 'absolute', left: d * 0.13, top: d * 0.14, overflow: 'visible'}}><Face12 mood={mood} look={look} talk={talk} blink={(f % 170) < 6 ? 1 : 0} /></svg>
		{name && NAMES[k] && <div style={{position: 'absolute', left: '50%', top: d * 1.0, transform: 'translateX(-50%)', background: INK, border: '5px solid #fff', borderRadius: 14, padding: '2px 18px'}}><T size={36} sw={0}>{NAMES[k]}</T></div>}
	</div>
);
// dust cloud flying off a country while it disappears
const Dust: React.FC<{x: number; y: number; r: number; t: number; seed: number}> = ({x, y, r, t, seed}) => {
	if (t < 0 || t > 70) return null;
	const R = rnd(seed * 131 + 7);
	return (
		<svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			{Array.from({length: 26}, (_, i) => {
				const a = R() * Math.PI * 2, sp = 2 + R() * 6, s = 6 + R() * 14;
				const px = x + Math.cos(a) * r * R() + t * sp * Math.cos(a) * 0.9 + t * 1.4, py = y + Math.sin(a) * r * R() + t * sp * Math.sin(a) * 0.9 - t * 1.6;
				return <rect key={i} x={px} y={py} width={s} height={s} rx={s * 0.25} fill={i % 4 ? '#C9CED6' : '#8C929B'} stroke={INK} strokeWidth={1.5} opacity={interpolate(t, [0, 70], [1, 0])} transform={`rotate(${R() * 90 + t * 3} ${px} ${py})`} />;
			})}
		</svg>
	);
};
const Hearts: React.FC<{f: number; keys: string[]}> = ({f, keys}) => {
	const R = rnd(77);
	return <>{Array.from({length: 22}, (_, i) => {
		const x0 = 80 + R() * 920, sp = 1.5 + R() * 2.2, ph = R() * 200, k = keys[i % keys.length];
		const y = 1900 - ((f * sp + ph * 4) % 1500), s = 60 + R() * 50;
		return <div key={i} style={{position: 'absolute', left: x0, top: y, width: s, height: s, transform: `rotate(${Math.sin((f + ph) / 20) * 14}deg)`}}>
			<svg viewBox="0 0 100 100" width={s} height={s}><defs><clipPath id={`h${i}`}><path d="M50 88 C10 60 0 38 14 22 C28 6 46 14 50 28 C54 14 72 6 86 22 C100 38 90 60 50 88 Z" /></clipPath></defs>
				<image href={staticFile(`flags/${FL[k]}.svg`)} x={-20} y={0} width={140} height={100} preserveAspectRatio="xMidYMid slice" clipPath={`url(#h${i})`} />
				<path d="M50 88 C10 60 0 38 14 22 C28 6 46 14 50 28 C54 14 72 6 86 22 C100 38 90 60 50 88 Z" fill="none" stroke={INK} strokeWidth={6} /></svg>
		</div>;
	})}</>;
};

export const VShort: React.FC<{tl: Timeline; def: ShortDef}> = ({tl, def}) => {
	const f = useCurrentFrame();
	const L = tl.lines;
	let i = L.findIndex((l, j) => f < (L[j + 1]?.start ?? 1e9));
	if (i < 0) i = L.length - 1;
	const sc = def.scenes[i], prev = def.scenes[Math.max(0, i - 1)];
	const t = f - L[i].start, len = L[i].end - L[i].start;
	// camera: glide from the previous scene camera during the first 30 frames
	const k = i === 0 ? 1 : interpolate(t, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
	const zl = Math.exp(Math.log(prev.cam.z) + (Math.log(sc.cam.z) - Math.log(prev.cam.z)) * k);
	const cam = {x: prev.cam.x + (sc.cam.x - prev.cam.x) * k, y: prev.cam.y + (sc.cam.y - prev.cam.y) * k, z: zl * (1 + 0.04 * Math.sin(f / 90))};
	// map fills
	const fills: Record<string, Fill> = {}, fc: Record<string, FaceSpec> = {};
	const greyL: string[] = [];
	for (const c of ALL) {
		if (!WORLD[c]) continue;
		const g = def.grey ? def.grey(c, f) : 0;
		if (g >= 1) { fills[c] = {color: '#5B616D'}; greyL.push(c); continue; }
		fills[c] = {flag: FL[c], lift: (sc.lift ?? []).includes(c) ? 1 : 0};
		const b = WORLD[c].b;
		if (b[1][0] - b[0][0] > 22 && b[1][1] - b[0][1] > 14) fc[c] = {mood: g > 0 ? 'panic' : 'neutral', size: 0.8, max: 60, blink: (f + c.charCodeAt(0) * 7) % 200 < 6 ? 1 : 0};
	}
	// speaker
	const sk = sc.speaker;
	const pop = spring({frame: t, fps: FPS, config: {damping: 11, stiffness: 160}});
	const talking = L[i].words.some((w) => f >= w.s && f < w.e);
	const talk = talking ? 0.5 + 0.5 * Math.abs(Math.sin(f / 3.2)) : 0;
	const mood = sc.endMood && t > len * 0.55 ? sc.endMood : sc.mood ?? 'happy';
	const float = sc.ghost ? Math.sin(f / 14) * 14 : Math.sin(f / 22) * 6;
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			<FlagPreload flags={ALL.map((c) => FL[c]).filter(Boolean)} />
			<Atlas21 cam={cam} fills={fills} faces={fc} W={W} H={H} dark={0.1} />
			{/* top shade for the title */}
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,20,45,0.55) 0%, rgba(5,20,45,0) 30%, rgba(5,20,45,0) 70%, rgba(5,20,45,0.45) 100%)'}} />
			{(def.dust ?? []).map((c, j) => { const st = def.greyStart ?? 0; const g0 = st + j * 6; const p = center(c); const s = toScr(cam, p.x, p.y); return <Dust key={c} x={s.x} y={s.y} r={40} t={f - g0} seed={j + 1} />; })}
			{sk && (
				<div style={{position: 'absolute', inset: 0, transform: `translateY(${float}px) scale(${pop})`, transformOrigin: '540px 800px'}}>
					<Ball k={sk} d={330} x={540} y={790} mood={mood} talk={talk} ghost={sc.ghost} f={f} look={[0, 0.15]} />
				</div>
			)}
			{sc.card && sc.card(t, len)}
			{def.cta && i === L.length - 1 && <Hearts f={f} keys={['BRA', 'ARG', 'URY', 'COL', 'CHL', 'PER', 'ECU', 'PRY', 'VEN', 'BOL']} />}
			<Title rows={def.title} />
			<Captions lines={L} f={f} />
			<Audio src={staticFile(tl.audio)} />
		</AbsoluteFill>
	);
};
