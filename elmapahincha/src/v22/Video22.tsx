import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {WORLD, WCam, bboxOf, isTiny} from '../v5/WorldLayer5';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, easeInOut, easeOut} from '../ui';
import {camPath, Key, Subscribe, Confetti} from '../common';
import {Face12, FaceMood, FaceSpec, Fill, INK, toScreen} from '../v12/Atlas';
import {Atlas21, FlagFill, REL} from '../v21/Atlas21';
import {BENCH_LEG, BENCH_NOW, CAB, EDS, FL, HIS, L, NAME, OPP, Pl, RES, TEAMS, XI_LEG, XI_NOW, Y2026} from './data22';

const FPS = 60;
const CREAM = '#FFF7E6';
const GOLD = '#FFD23F';
const GREEN = '#3DB86B', RED = '#E63946', YEL = '#FFBE0B';

// ---------------------------------------------------------------- timeline
export const TEAMS0 = 1320, VIT0 = 4920, WC0 = 9420, PRE0 = 14220, MUN0 = 18420, ONCE0 = 23220, LEY0 = 27420, FIN0 = 31020;
export const V22_TOTAL = 33420;
const T_STEP = 150, T_IN = 240;
const ED0 = 300, ED_STEP = 150;
const HI0 = 1700, HI_STEP = 320, HI_LAST = 520;
const P_IN = 300, P_STEP = 290; // once de hoy
const G_IN = 240, G_STEP = 260; // leyendas
export const SEGS: [string, number][] = [['Intro', 0], ['Las 20 que se unen', TEAMS0], ['La vitrina', VIT0], ['El Mundial si fuesen una', WC0], ['El precio de unirse', PRE0], ['Contra el mundo', MUN0], ['El once de hoy', ONCE0], ['El once de leyenda', LEY0], ['El veredicto', FIN0]];
const hiFrom = (i: number) => MUN0 + HI0 + i * HI_STEP;

// ---------------------------------------------------------------- camera
export const fitBox = (keys: string[], cx = 960, cy = 570, w = 1300, h = 700, minSpan = 220, zMax = 4.6): WCam => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of keys) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	if (x1 - x0 < minSpan) { const c = (x0 + x1) / 2; x0 = c - minSpan / 2; x1 = c + minSpan / 2; }
	if (y1 - y0 < minSpan * 0.6) { const c = (y0 + y1) / 2; y0 = c - minSpan * 0.3; y1 = c + minSpan * 0.3; }
	const z = Math.max(0.5, Math.min(zMax, Math.min(w / (x1 - x0 + 30), h / (y1 - y0 + 30))));
	return {x: (x0 + x1) / 2 + (960 - cx) / z, y: (y0 + y1) / 2 + (540 - cy) / z, z};
};
const WORLD_CAM: WCam = {x: 1880, y: 860, z: 0.52};
const LATL = fitBox(L, 540, 560, 800, 960, 200);
const LATC = fitBox(L, 960, 570, 1200, 940, 200);
const teamCam = (k: string) => fitBox([k], 540, 560, 700, 640, 160, isTiny(k) ? 2 : 3.2);
const hiCam = (k: string) => fitBox([k], 520, 580, 760, 640, 170, k === 'USA' ? 1.6 : 3.4);
const KEYS_CAM: Key[] = (() => {
	const K: Key[] = [];
	const P = (f: number, c: WCam) => K.push([Math.round(f), c.x, c.y, c.z]);
	P(0, {x: 1880, y: 820, z: 0.6}); P(150, LATC); P(TEAMS0 - 30, LATC);
	P(TEAMS0 + 60, LATL);
	TEAMS.forEach((t, i) => { const f = TEAMS0 + T_IN + i * T_STEP; P(f + 25, teamCam(t.k)); P(f + T_STEP - 10, teamCam(t.k)); });
	P(VIT0 - 200, LATL); P(VIT0 + 60, LATL);
	P(WC0 - 30, LATL); P(WC0 + 60, LATC); P(PRE0 - 30, LATC);
	P(PRE0 + 60, LATL); P(MUN0 - 20, LATL);
	P(MUN0 + 200, WORLD_CAM); P(MUN0 + HI0 - 40, WORLD_CAM);
	HIS.forEach((h, i) => { const f = hiFrom(i); const d = i === HIS.length - 1 ? HI_LAST : HI_STEP; P(f + 30, hiCam(h.k)); P(f + d - 30, hiCam(h.k)); });
	P(ONCE0 + 60, LATL); P(FIN0 - 30, LATL);
	P(FIN0 + 60, LATL); P(V22_TOTAL, LATL);
	K.sort((a, b) => a[0] - b[0]);
	return K;
})();

// ---------------------------------------------------------------- sfx / music
export const v22Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f: Math.round(f), name, vol});
	S(0, 'whoosh_4', 0.45); for (let i = 0; i < 20; i++) S(30 + i * 6, `pop_${(i % 4) + 1}`, 0.15); S(60, 'slap', 0.45);
	S(240, 'riser', 0.35); S(320, 'boom', 0.6); S(322, 'crowd_roar', 0.4);
	[440, 620, 800].forEach((f) => { S(f, 'whoosh_2', 0.4); S(f + 12, 'slap', 0.45); S(f + 30, 'select', 0.3); });
	S(1000, 'whoosh_3', 0.45); S(1030, 'drumroll', 0.3); S(1120, 'boom', 0.5); S(1124, 'crowd_ohh', 0.35); S(1220, 'pop_2', 0.45);
	S(TEAMS0, 'whoosh_4', 0.45); S(TEAMS0 + 40, 'slap', 0.4);
	TEAMS.forEach((t, i) => { const f = TEAMS0 + T_IN + i * T_STEP; S(f, 'whoosh_1', 0.3); S(f + 22, `pop_${(i % 4) + 1}`, 0.45); S(f + 40, 'click', 0.3); if (t.wc) S(f + 60, 'select', 0.25); });
	S(VIT0 - 330, 'riser', 0.3); S(VIT0 - 250, 'boom', 0.45);
	S(VIT0, 'whoosh_4', 0.45); S(VIT0 + 40, 'slap', 0.4);
	CAB.forEach((r, i) => { const f = VIT0 + 140 + i * 520; S(f, 'whoosh_2', 0.4); S(f + 10, 'pop_1', 0.4);
		if (i === 0) for (let j = 0; j < 10; j++) { S(f + 40 + j * 40, 'up', 0.25); S(f + 70 + j * 40, 'bong', 0.25); }
		else { for (let j = 0; j < 8; j++) S(f + 40 + j * 22, 'tick', 0.3); S(f + 220, 'confirm', 0.4); } });
	S(VIT0 + 2800, 'drumroll', 0.3); S(VIT0 + 2900, 'boom', 0.55); S(VIT0 + 2904, 'crowd_roar', 0.4);
	S(VIT0 + 3150, 'whoosh_3', 0.4); for (let i = 0; i < 6; i++) S(VIT0 + 3220 + i * 60, `pop_${(i % 4) + 1}`, 0.4);
	S(VIT0 + 3700, 'drumroll', 0.3); S(VIT0 + 3800, 'boom', 0.5); S(VIT0 + 3802, 'crowd_ohh', 0.35); S(VIT0 + 3950, 'pop_2', 0.45);
	S(WC0, 'whoosh_4', 0.45); S(WC0 + 40, 'slap', 0.4);
	EDS.forEach((e, i) => { const f = WC0 + ED0 + i * ED_STEP; S(f, `pop_${(i % 4) + 1}`, 0.4); S(f + 10, 'click', 0.3); if (e.res === 'C') { S(f + 30, 'confirm', 0.45); S(f + 34, 'crowd_roar', 0.25); } if (e.res === 'F') S(f + 30, 'crowd_ohh', 0.25); });
	const W2 = WC0 + ED0 + EDS.length * ED_STEP + 60;
	S(W2, 'whoosh_3', 0.45); [0, 120, 240].forEach((d) => { S(W2 + 60 + d, 'slap', 0.45); S(W2 + 64 + d, 'boom', 0.35); }); S(W2 + 480, 'pop_2', 0.4);
	S(PRE0, 'whoosh_4', 0.45); S(PRE0 + 40, 'slap', 0.4); for (let i = 0; i < 9; i++) S(PRE0 + 220 + i * 18, `pop_${(i % 4) + 1}`, 0.35);
	S(PRE0 + 640, 'riser', 0.3); S(PRE0 + 720, 'glass', 0.45); S(PRE0 + 740, 'boom', 0.5); S(PRE0 + 900, 'pop_2', 0.45); S(PRE0 + 1100, 'pop_3', 0.45);
	S(PRE0 + 1500, 'whoosh_2', 0.4); for (let i = 0; i < 16; i++) S(PRE0 + 1600 + i * 14, 'tick', 0.3); S(PRE0 + 1900, 'drop', 0.4); for (let i = 0; i < 16; i++) S(PRE0 + 1950 + i * 30, 'glass', 0.12); S(PRE0 + 2450, 'boom', 0.5);
	S(PRE0 + 2700, 'whoosh_3', 0.45); for (let i = 0; i < 6; i++) S(PRE0 + 2850 + i * 50, 'whoosh_1', 0.25); [3200, 3420, 3640, 3860].forEach((d) => S(PRE0 + d, 'slap', 0.4)); S(PRE0 + 4000, 'glass', 0.4);
	S(MUN0, 'whoosh_4', 0.45); S(MUN0 + 40, 'slap', 0.4); S(MUN0 + 300, 'pop_1', 0.45); S(MUN0 + 380, 'confirm', 0.35);
	for (let i = 0; i < 30; i++) S(MUN0 + 500 + i * 40, 'tick', 0.22); S(MUN0 + 1720, 'boom', 0.4);
	HIS.forEach((h, i) => { const f = hiFrom(i); S(f, 'whoosh_2', 0.4); S(f + 30, 'slap', 0.4); S(f + 70, 'select', 0.3); S(f + 140, 'pop_2', 0.45);
		if (h.k === 'ESP') { S(f + 40, 'drumroll', 0.3); S(f + 150, 'boom', 0.55); S(f + 154, 'crowd_ohh', 0.4); } });
	S(ONCE0, 'whistle_short', 0.4); S(ONCE0 + 30, 'whoosh_4', 0.45);
	XI_NOW.forEach((p, i) => { const f = ONCE0 + P_IN + i * P_STEP; S(f, 'kick', 0.4); S(f + 16, 'pop_1', 0.45); S(f + 40, 'crowd_roar', 0.15); });
	S(ONCE0 + P_IN + 11 * P_STEP + 40, 'whoosh_2', 0.4); for (let i = 0; i < 5; i++) S(ONCE0 + P_IN + 11 * P_STEP + 100 + i * 40, `pop_${(i % 4) + 1}`, 0.35);
	S(LEY0, 'whistle_short', 0.4); S(LEY0 + 30, 'whoosh_4', 0.45);
	XI_LEG.forEach((p, i) => { const f = LEY0 + G_IN + i * G_STEP; S(f, 'kick', 0.4); S(f + 16, 'pop_2', 0.45); S(f + 40, 'crowd_roar', 0.2); });
	S(LEY0 + G_IN + 11 * G_STEP + 40, 'whoosh_2', 0.4); for (let i = 0; i < 5; i++) S(LEY0 + G_IN + 11 * G_STEP + 100 + i * 40, `pop_${(i % 4) + 1}`, 0.35);
	S(FIN0, 'whoosh_4', 0.5); S(FIN0 + 60, 'slap', 0.45);
	for (let i = 0; i < 6; i++) { S(FIN0 + 200 + i * 150, i < 3 ? 'confirm' : 'error', 0.4); }
	S(FIN0 + 1250, 'boom', 0.5); S(FIN0 + 1254, 'crowd_roar', 0.45); S(FIN0 + 1700, 'click', 0.5); S(FIN0 + 1702, 'bong', 0.35);
	s.sort((a, b) => a.f - b.f);
	return s;
};
export const v22Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	return [`m_tense:0:${sec(TEAMS0 + 40)}`, `m_happy:${sec(TEAMS0)}:${sec(PRE0 + 40)}`, `m_tense:${sec(PRE0)}:${sec(ONCE0 + 40)}`, `m_happy:${sec(ONCE0)}:${sec(FIN0 + 40)}`, `m_triumph:${sec(FIN0)}:${sec(V22_TOTAL)}`].join(',');
};

// ---------------------------------------------------------------- small UI
export const T: React.FC<{children: React.ReactNode; size: number; color?: string; stroke?: number; shadow?: number; style?: React.CSSProperties}> = ({children, size, color = '#fff', stroke, shadow, style}) => (
	<span style={{fontFamily: LILITA, fontSize: size, color, lineHeight: 1.05, WebkitTextStroke: `${stroke ?? Math.max(2, size * 0.07)}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${shadow ?? size * 0.07}px 0 ${INK}`, ...style}}>{children}</span>
);
export const Flag: React.FC<{f: string; w: number; style?: React.CSSProperties}> = ({f, w, style}) => <img src={staticFile(`flags/${f}.svg`)} style={{width: w, height: w * 0.66, borderRadius: Math.max(3, w * 0.08), border: `${w > 50 ? 4 : 2}px solid ${INK}`, objectFit: 'cover', flexShrink: 0, ...style}} />;
export const R: React.FC<{children: React.ReactNode; size: number; color?: string; w?: number}> = ({children, size, color = INK, w = 800}) => <span style={{fontFamily: RUBIK, fontWeight: w, fontSize: size, color}}>{children}</span>;
const up = (s: string) => s.toUpperCase();
const nm = (k: string) => NAME[k] ?? k;
const fl = (k: string) => FL[k];
export const Box: React.FC<{children: React.ReactNode; style?: React.CSSProperties; bg?: string}> = ({children, style, bg = CREAM}) => <div style={{borderRadius: 22, background: bg, border: `6px solid ${INK}`, boxShadow: '0 10px 0 rgba(0,0,0,0.35)', padding: '18px 24px', ...style}}>{children}</div>;
const slideIn = (u: number, dur: number, dx = 1000) => `translateX(${(1 - easeOut(u / 16)) * dx + easeInOut((u - dur + 24) / 20) * dx}px)`;
const fmt = (n: number) => n.toLocaleString('es-ES').replace(/,/g, '.');
const nfmt = (n: number) => (n >= 10000 ? fmt(n) : n >= 1000 ? `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, '0')}` : String(n));

export const Bubble: React.FC<{x: number; y: number; text: string; u: number; dur?: number; side?: 'l' | 'r'}> = ({x, y, text, u, dur = 200, side = 'r'}) => {
	const p = backOut(u / 12) * (1 - easeInOut((u - dur + 14) / 12));
	if (p <= 0.01) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(${side === 'r' ? 0 : -100}%, -100%) scale(${p})`, transformOrigin: side === 'r' ? 'bottom left' : 'bottom right'}}>
			<div style={{position: 'relative', padding: '12px 22px', borderRadius: 26, background: '#fff', border: `5px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.3)', whiteSpace: 'nowrap'}}>
				<T size={38} color={INK} stroke={0} shadow={0}>{text}</T>
				<svg width={40} height={30} style={{position: 'absolute', bottom: -27, [side === 'r' ? 'left' : 'right']: 18}}><path d={side === 'r' ? 'M2 0 L12 26 L30 0' : 'M38 0 L28 26 L10 0'} fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><rect x={0} y={-6} width={40} height={8} fill="#fff" /></svg>
			</div>
		</div>
	);
};
export const Chip: React.FC<{n: string; title: string; u: number}> = ({n, title, u}) => (
	<div style={{position: 'absolute', left: 36, top: 30, display: 'flex', alignItems: 'center', gap: 12, transform: `translateX(${(1 - easeOut(u / 18)) * -700}px)`}}>
		<div style={{width: 62, height: 62, borderRadius: 31, background: GOLD, border: `5px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><T size={36} color={INK} stroke={0} shadow={0}>{n}</T></div>
		<div style={{padding: '6px 22px', borderRadius: 16, background: INK, border: '4px solid #fff'}}><T size={40}>{title}</T></div>
	</div>
);
export const Source: React.FC<{text: string}> = ({text}) => (
	<div style={{position: 'absolute', left: 0, right: 0, bottom: 10, display: 'flex', justifyContent: 'center'}}>
		<div style={{padding: '4px 16px', borderRadius: 12, background: 'rgba(14,16,22,0.72)', fontFamily: RUBIK, fontWeight: 600, fontSize: 19, color: '#E8ECF2'}}>{text}</div>
	</div>
);
export const Rec: React.FC<{w: number; d: number; l: number; width: number; big?: boolean; p?: number}> = ({w, d, l, width, big, p = 1}) => {
	const t = w + d + l;
	const c = (n: number) => Math.round(n * p);
	return (
		<div>
			<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 6}}>
				<R size={big ? 40 : 30} color={GREEN}>{nfmt(c(w))} V</R><R size={big ? 40 : 30} color="#8A8F99">{nfmt(c(d))} E</R><R size={big ? 40 : 30} color={RED}>{nfmt(c(l))} D</R>
			</div>
			<div style={{display: 'flex', width, height: big ? 34 : 24, borderRadius: 12, overflow: 'hidden', border: `4px solid ${INK}`}}>
				<div style={{width: `${(w / t) * 100 * p}%`, background: GREEN}} /><div style={{width: `${(d / t) * 100 * p}%`, background: '#B9BEC7'}} /><div style={{width: `${(l / t) * 100 * p}%`, background: RED}} />
			</div>
		</div>
	);
};
export const Star: React.FC<{s: number; c?: string}> = ({s, c = GOLD}) => (
	<svg width={s} height={s} viewBox="-12 -12 24 24"><path d="M0 -11 L3.2 -3.6 L11 -3.4 L5 1.8 L7 9.6 L0 5.2 L-7 9.6 L-5 1.8 L-11 -3.4 L-3.2 -3.6 Z" fill={c} stroke={INK} strokeWidth={2} strokeLinejoin="round" /></svg>
);

// ---------------------------------------------------------------- union layer (map coords)
export const UC = WORLD.BRA.c;
export const UNION_FACE = {x: UC[0] - 70, y: UC[1] - 30};
export const Union: React.FC<{cam: WCam; op: number; mood: FaceMood; talk?: number; pop?: number; keys?: string[]; f: number}> = ({cam, op, mood, talk = 0, pop = 1, keys = L, f}) => {
	if (op <= 0.001) return null;
	const z = cam.z;
	const sz = (230 / z) * pop;
	const blink = 0;
	return (
		<g opacity={op}>
			<defs>
				{keys.map((k) => <clipPath key={k} id={`u22${k}`}><path d={WORLD[k].d} /></clipPath>)}
				<clipPath id="u22all">{keys.map((k) => <path key={k} d={WORLD[k].d} />)}</clipPath>
			</defs>
			<g transform={`translate(${3 / z} ${7 / z})`} opacity={0.35}>{keys.map((k) => <path key={k} d={WORLD[k].d} fill="#06142A" />)}</g>
			<g fill="none" stroke="#fff" strokeWidth={9 / z} strokeLinejoin="round">{keys.map((k) => <path key={k} d={WORLD[k].d} />)}</g>
			<g fill="none" stroke={INK} strokeWidth={4 / z} strokeLinejoin="round">{keys.map((k) => <path key={k} d={WORLD[k].d} />)}</g>
			{keys.map((k) => <path key={'b' + k} d={WORLD[k].d} fill="#EEE" stroke="#EEE" strokeWidth={1.2 / z} />)}
			{keys.map((k) => <FlagFill key={'f' + k} k={k} flag={fl(k)} clip={`u22${k}`} />)}
			<image href={staticFile('tex/relief.jpg')} x={REL.x} y={REL.y} width={REL.w} height={REL.h} preserveAspectRatio="none" clipPath="url(#u22all)" style={{mixBlendMode: 'multiply'}} />
			{pop > 0.02 && <g transform={`translate(${UNION_FACE.x} ${UNION_FACE.y}) scale(${sz / 100}) translate(-100 -100)`}><Face12 mood={mood} blink={blink} talk={talk} look={[Math.sin(f / 90) * 0.4, 0]} /></g>}
		</g>
	);
};
const unionScreen = (cam: WCam) => toScreen(cam, UNION_FACE.x, UNION_FACE.y);

// ---------------------------------------------------------------- HOOK
const Hook: React.FC<{u: number; cam: WCam}> = ({u, cam}) => {
	const o = 1 - easeInOut((u - TEAMS0 + 30) / 24);
	const cnt = Math.round(20 - 19 * easeInOut((u - 240) / 80));
	const teas: [number, string, React.ReactNode][] = [
		[440, '10 MUNDIALES', <div style={{display: 'flex'}}>{Array.from({length: 10}).map((_, i) => <Star key={i} s={34} />)}</div>],
		[620, 'DE 9 PLAZAS... A 1', <R size={28}>Mundial 2026: 9 selecciones latinas</R>],
		[800, 'UN ONCE DE LEYENDA', <R size={28}>Pelé, Maradona, Messi, Ronaldo...</R>],
	];
	const [fx, fy] = unionScreen(cam);
	const esp = WORLD.ESP; const eb = esp.b;
	return (
		<AbsoluteFill style={{opacity: o}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 1 - easeInOut((u - 400) / 20)}}>
				<div style={{transform: `scale(${backOut((u - 40) / 14)}) rotate(-2deg)`}}><T size={84}>¿Y SI LATINOAMÉRICA FUESE</T></div>
				<div style={{transform: `scale(${backOut((u - 70) / 14)}) rotate(-2deg)`}}><T size={108} color={GOLD}>UNA SOLA SELECCIÓN?</T></div>
			</div>
			{u >= 200 && u < 420 && (
				<div style={{position: 'absolute', left: 120, top: 420, transform: `scale(${backOut((u - 200) / 12)})`, padding: '10px 30px', borderRadius: 24, background: INK, border: '6px solid #fff', opacity: 1 - easeInOut((u - 400) / 16)}}>
					<T size={96}>{cnt === 1 ? 20 : cnt} → </T><T size={96} color={GOLD}>{cnt === 1 ? 1 : '?'}</T>
				</div>
			)}
			{u >= 430 && u < 1000 && teas.map(([at, title, sub], i) => (
				<div key={i} style={{position: 'absolute', left: 1080, top: 140 + i * 230, width: 780, transform: `${slideIn(u - at, 1000 - at)} rotate(${i % 2 ? 1 : -1}deg)`}}>
					<Box><T size={64} color={i === 1 ? RED : INK} stroke={0} shadow={0}>{title}</T><div style={{marginTop: 6}}>{sub}</div></Box>
				</div>
			))}
			{u >= 1000 && (
				<div style={{position: 'absolute', left: 1000, top: 110, width: 880, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
					<div style={{transform: `scale(${backOut((u - 1000) / 12)})`, textAlign: 'center'}}><T size={60}>PERO HAY UNA SELECCIÓN</T><br /><T size={60}>A LA QUE CASI NUNCA GANA...</T></div>
					<div style={{transform: `scale(${backOut((u - 1110) / 14)})`, position: 'relative'}}>
						<svg width={420} height={340} viewBox={`${eb[0][0] - 6} ${eb[0][1] - 6} ${eb[1][0] - eb[0][0] + 12} ${eb[1][1] - eb[0][1] + 12}`}><path d={esp.d} fill={INK} stroke="#fff" strokeWidth={1.2} /></svg>
						<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><T size={170} color={GOLD}>?</T></div>
					</div>
					<div style={{transform: `scale(${backOut((u - 1200) / 12)})`, padding: '8px 26px', borderRadius: 30, background: '#fff', border: `5px solid ${INK}`}}><R size={34}>Solo 13 victorias en 83 partidos</R></div>
				</div>
			)}
			{u >= 330 && <Bubble x={fx + 120} y={fy - 150} text="¡Ahora somos UNO!" u={u - 340} dur={90} />}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- TEAMS
const appsSoFar = (i: number) => TEAMS.slice(0, i + 1).reduce((a, t) => a + t.wc, 0);
const Teams: React.FC<{u: number}> = ({u}) => {
	const idx = Math.floor((u - T_IN) / T_STEP);
	const cur = idx >= 0 && idx < TEAMS.length ? idx : -1;
	const joined = Math.min(TEAMS.length, Math.max(0, Math.floor((u - T_IN - 22) / T_STEP) + 1));
	const total = joined > 0 ? appsSoFar(joined - 1) : 0;
	const end = VIT0 - TEAMS0;
	const out = easeInOut((u - end + 30) / 24);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Chip n="1" title="LAS 20 QUE SE UNEN" u={u} />
			<div style={{position: 'absolute', left: 1120, top: 120, width: 760, transform: `translateX(${(1 - easeOut((u - 20) / 18)) * 900}px)`}}>
				<Box>
					<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
						<T size={42} color={INK} stroke={0} shadow={0}>SELECCIONES: {joined}/20</T>
						<div style={{padding: '4px 14px', borderRadius: 12, background: INK}}><T size={34} color={GOLD}>{total} MUNDIALES</T></div>
					</div>
					<div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14}}>
						{TEAMS.map((t, i) => (
							<div key={t.k} style={{width: 132, height: 90, borderRadius: 10, border: `3px dashed ${i < joined ? 'transparent' : '#B8AE98'}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								{i < joined && <div style={{transform: `scale(${backOut((u - T_IN - i * T_STEP - 22) / 12)})`}}><Flag f={fl(t.k)} w={118} /></div>}
							</div>
						))}
					</div>
				</Box>
			</div>
			{cur >= 0 && (() => {
				const t = TEAMS[cur];
				const v = u - T_IN - cur * T_STEP;
				return (
					<div style={{position: 'absolute', left: 120, top: 830, width: 860, transform: `translateY(${(1 - easeOut((v - 14) / 14)) * 300 + easeInOut((v - T_STEP + 16) / 14) * 300}px)`}}>
						<Box style={{display: 'flex', alignItems: 'center', gap: 20, padding: '14px 22px'}}>
							<Flag f={fl(t.k)} w={110} />
							<div style={{flex: 1}}>
								<T size={50} color={INK} stroke={0} shadow={0}>{up(nm(t.k))}</T><br />
								<R size={27} w={700}>{t.fact}</R>
							</div>
							<div style={{textAlign: 'center', padding: '6px 14px', borderRadius: 14, background: t.wc ? INK : RED}}><T size={52} color={t.wc ? GOLD : '#fff'}>{t.wc}</T><br /><R size={18} color="#fff">MUNDIALES</R></div>
						</Box>
					</div>
				);
			})()}
			{u >= end - 330 && (
				<div style={{position: 'absolute', left: 1120, top: 790, width: 760, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((u - end + 330) / 14)}) rotate(-2deg)`}}>
					<div style={{padding: '12px 30px', borderRadius: 24, background: INK, border: '6px solid #fff', textAlign: 'center'}}><T size={54} color={GOLD}>20 SELECCIONES · 129 MUNDIALES</T><br /><T size={40}>¡Y AHORA SE FUSIONAN!</T></div>
				</div>
			)}
			<Source text="Participaciones en Mundiales 1930-2026 · Fuente: FIFA / resultados internacionales (martj42)" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- VITRINA
const Vitrina: React.FC<{u: number; cam: WCam}> = ({u, cam}) => {
	const end = WC0 - VIT0;
	const out = easeInOut((u - end + 30) / 24);
	const cabOut = easeInOut((u - 3080) / 24);
	const [fx, fy] = unionScreen(cam);
	const bars: [string, string, number][] = [['LATINOAMÉRICA', '', 10], ['BRASIL', 'BRA', 5], ['ALEMANIA', 'DEU', 4], ['ITALIA', 'ITA', 4], ['ARGENTINA', 'ARG', 3], ['FRANCIA', 'FRA', 2], ['ESPAÑA', 'ESP', 2]];
	const stars: {k: string; at: number; j: number}[] = [];
	let j = 0; for (const [k, n] of CAB[0].parts) for (let i = 0; i < n; i++) { stars.push({k, at: 140 + 40 + j * 40, j}); j++; }
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Chip n="2" title="LA VITRINA" u={u} />
			{cabOut < 1 && (
				<div style={{position: 'absolute', left: 1020, top: 110, width: 860, transform: `translateX(${(1 - easeOut((u - 20) / 18)) * 1000 + cabOut * 1000}px)`}}>
					<Box style={{padding: '16px 22px'}}>
						{CAB.map((r, i) => {
							const at = 140 + i * 520;
							if (u < at) return <div key={i} style={{height: 132}} />;
							const p = easeOut((u - at - 30) / 190);
							return (
								<div key={i} style={{height: 132, borderBottom: i < 4 ? '3px solid #E2D6BC' : 'none', transform: `translateX(${(1 - easeOut((u - at) / 14)) * 400}px)`, opacity: easeOut((u - at) / 14)}}>
									<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
										<T size={36} color={INK} stroke={0} shadow={0}>{r.label}</T>
										<T size={54} color={i === 0 ? '#E0A800' : INK} stroke={0} shadow={0}>{i === 0 ? stars.filter((s) => u >= s.at + 30).length : Math.round(r.n * p)}</T>
									</div>
									<div style={{display: 'flex', gap: 8, marginTop: 4, alignItems: 'center'}}>
										{i === 0 ? stars.map((s) => <div key={s.j} style={{opacity: u >= s.at + 30 ? 1 : 0.15}}><Star s={46} /></div>) :
											r.parts.map(([k, n], q) => (
												<div key={k} style={{display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 10, background: '#fff', border: `3px solid ${INK}`, transform: `scale(${backOut((u - at - 40 - q * 22) / 10)})`}}>
													<Flag f={fl(k)} w={42} /><R size={26}>{n}</R>
												</div>
											))}
									</div>
								</div>
							);
						})}
					</Box>
				</div>
			)}
			{stars.map((s) => {
				const v = u - s.at;
				if (v < 0 || v > 30) return null;
				const c = WORLD[s.k].c; const [sx, sy] = toScreen(cam, c[0], c[1]);
				const tx = 1060 + s.j * 54 + 23, ty = 110 + 22 + 62 + 23;
				const e = easeInOut(v / 30);
				return <div key={s.j} style={{position: 'absolute', left: sx + (tx - sx) * e - 30, top: sy + (ty - sy) * e - 30 - Math.sin(e * Math.PI) * 160, transform: `scale(${1.3 - 0.3 * e}) rotate(${e * 360}deg)`}}><Star s={60} /></div>;
			})}
			{u >= 2880 && u < 3110 && (
				<div style={{position: 'absolute', left: 1020, width: 860, top: 420, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((u - 2880) / 12)}) rotate(-6deg)`}}>
					<div style={{padding: '14px 40px', borderRadius: 24, background: RED, border: `7px solid ${INK}`, boxShadow: '0 10px 0 rgba(0,0,0,0.4)'}}><T size={110}>¡90 TÍTULOS!</T></div>
				</div>
			)}
			{u >= 3110 && (
				<div style={{position: 'absolute', left: 1000, top: 110, width: 880, transform: `translateX(${(1 - easeOut((u - 3110) / 18)) * 1000}px)`}}>
					<Box>
						<T size={46} color={INK} stroke={0} shadow={0}>MUNDIALES GANADOS</T>
						<div style={{marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12}}>
							{bars.map(([lab, k, n], i) => {
								const p = easeOut((u - 3200 - i * 60) / 30);
								return (
									<div key={lab} style={{display: 'flex', alignItems: 'center', gap: 12, opacity: clamp01(p * 3)}}>
										<div style={{width: 64}}>{k ? <Flag f={fl(k)} w={60} /> : <Star s={56} />}</div>
										<div style={{width: 250}}><R size={28}>{lab}</R></div>
										<div style={{height: 46, width: 46 * n * p, background: i === 0 ? GOLD : '#7FA7D8', border: `4px solid ${INK}`, borderRadius: 10}} />
										<T size={44} color={INK} stroke={0} shadow={0}>{n}</T>
									</div>
								);
							})}
							{u >= 3780 && (
								<div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, paddingTop: 12, borderTop: `4px dashed ${INK}`, transform: `scale(${backOut((u - 3780) / 12)})`, transformOrigin: 'left center'}}>
									<div style={{width: 64}}><Flag f="eu" w={60} /></div>
									<div style={{width: 250}}><R size={28} color={RED}>EUROPA JUNTA</R></div>
									<div style={{height: 46, width: 46 * 13 * easeOut((u - 3800) / 30), background: RED, border: `4px solid ${INK}`, borderRadius: 10}} />
									<T size={44} color={RED} stroke={0} shadow={0}>13</T>
								</div>
							)}
						</div>
					</Box>
				</div>
			)}
			{u >= 3300 && u < 3700 && <Bubble x={fx - 80} y={fy - 170} text="¡El doble que Brasil!" u={u - 3300} dur={400} />}
			{u >= 3950 && <Bubble x={fx - 80} y={fy - 170} text="¡Pero ellos son 55 países!" u={u - 3950} dur={500} />}
			<Source text={u < 3110 ? 'Fuentes: FIFA · CONMEBOL · Concacaf · COI (títulos absolutos)' : 'Europa: Alemania 4, Italia 4, Francia 2, España 2 e Inglaterra 1 · Fuente: FIFA'} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- WORLD CUP GRID
const WCGrid: React.FC<{u: number}> = ({u}) => {
	const end = PRE0 - WC0;
	const out = easeInOut((u - end + 30) / 24);
	const cur = Math.floor((u - ED0) / ED_STEP);
	const sumAt = ED0 + EDS.length * ED_STEP + 60;
	const gridOut = easeInOut((u - sumAt) / 24);
	const titles = EDS.filter((e, i) => e.res === 'C' && u >= ED0 + i * ED_STEP + 30).length;
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Chip n="3" title="EL MUNDIAL SI FUESEN UNA" u={u} />
			{u < ED0 + 20 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
					<div style={{transform: `scale(${backOut((u - 40) / 14)})`}}><T size={74}>23 MUNDIALES DESDE 1930</T></div>
					<div style={{transform: `scale(${backOut((u - 110) / 14)})`, padding: '10px 26px', borderRadius: 24, background: '#fff', border: `5px solid ${INK}`, maxWidth: 1300, textAlign: 'center'}}><R size={36}>Regla: Latinoamérica llega tan lejos como su mejor selección</R></div>
				</div>
			)}
			{u >= ED0 && gridOut < 1 && (
				<div style={{position: 'absolute', left: 175, top: 130, width: 1570, display: 'flex', flexWrap: 'wrap', gap: 14, opacity: 1 - gridOut}}>
					{EDS.map((e, i) => {
						const at = ED0 + i * ED_STEP;
						if (u < at) return <div key={e.y} style={{width: 250, height: 150, borderRadius: 18, border: '4px dashed rgba(255,255,255,0.35)'}} />;
						const [lab, col] = RES[e.res];
						const on = i === cur;
						return (
							<div key={e.y} style={{width: 250, height: 150, borderRadius: 18, background: e.res === 'C' ? '#FFF3C4' : CREAM, border: `${on ? 7 : 5}px solid ${on ? GOLD : INK}`, boxShadow: on ? `0 0 0 5px ${INK}` : '0 6px 0 rgba(0,0,0,0.35)', transform: `scale(${backOut((u - at) / 12) * (on ? 1.06 : 1)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4}}>
								<div style={{display: 'flex', alignItems: 'center', gap: 8}}><T size={44} color={INK} stroke={0} shadow={0}>{e.y}</T>{e.res === 'C' && <Star s={36} />}</div>
								<div style={{display: 'flex', gap: 5}}>{e.k.map((k) => <Flag key={k} f={fl(k)} w={46} />)}</div>
								<div style={{padding: '1px 12px', borderRadius: 10, background: col, border: `3px solid ${INK}`}}><R size={22}>{lab}</R></div>
							</div>
						);
					})}
				</div>
			)}
			{cur >= 0 && cur < EDS.length && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 870, display: 'flex', justifyContent: 'center'}}>
					<div key={cur} style={{padding: '10px 30px', borderRadius: 20, background: INK, border: '5px solid #fff', transform: `scale(${backOut((u - ED0 - cur * ED_STEP - 8) / 10)})`}}><T size={42}>{EDS[cur].y}: {EDS[cur].cap}</T></div>
				</div>
			)}
			{u >= ED0 && u < sumAt + 10 && (
				<div style={{position: 'absolute', right: 40, top: 30, padding: '6px 20px', borderRadius: 16, background: GOLD, border: `5px solid ${INK}`, display: 'flex', alignItems: 'center', gap: 10}}><Star s={44} /><T size={46} color={INK} stroke={0} shadow={0}>{titles} TÍTULOS</T></div>
			)}
			{u >= sumAt && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
					<div style={{display: 'flex', gap: 40}}>
						{[['23/23', 'MUNDIALES JUGADOS', '#fff'], ['14', 'FINALES', '#D9DEE6'], ['10', 'TÍTULOS', GOLD]].map(([n, lab, c], i) => (
							<div key={i} style={{transform: `scale(${backOut((u - sumAt - 60 - i * 120) / 12)})`}}>
								<Box style={{width: 420, textAlign: 'center', background: i === 2 ? '#FFF3C4' : CREAM}}><T size={130} color={i === 2 ? '#E0A800' : INK} stroke={0} shadow={0}>{n}</T><br /><R size={34}>{lab}</R></Box>
							</div>
						))}
					</div>
					<div style={{width: 1000, transform: `scale(${backOut((u - sumAt + -480) / 12)})`}}>
						<Box><R size={32}>En Mundiales, contra selecciones de fuera de Latinoamérica:</R><div style={{height: 14}} /><Rec w={185} d={97} l={148} width={940} big p={easeOut((u - sumAt - 520) / 60)} /></Box>
					</div>
				</div>
			)}
			<Source text="Fuente: FIFA · resultados internacionales 1872-2026 (martj42) · Los penaltis cuentan como empate" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- PRICE
const PAIRS: [string, string, number][] = [['ARG', 'URY', 183], ['ARG', 'BRA', 110], ['ARG', 'PRY', 107], ['ARG', 'CHL', 91], ['CHL', 'PER', 88], ['CHL', 'URY', 84]];
const APPS = TEAMS.filter((t) => t.wc > 0).sort((a, b) => b.wc - a.wc);
const Price: React.FC<{u: number; cam: WCam}> = ({u, cam}) => {
	const end = MUN0 - PRE0;
	const out = easeInOut((u - end + 30) / 24);
	const sp = (k: string) => { const c = WORLD[k].c; return toScreen(cam, c[0], c[1]); };
	const merged = easeInOut((u - 640) / 80);
	const [fx, fy] = unionScreen(cam);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Chip n="4" title="EL PRECIO DE UNIRSE" u={u} />
			{u < 1500 && (
				<div style={{position: 'absolute', left: 1180, top: 130, width: 700, transform: `translateX(${(1 - easeOut((u - 30) / 18)) * 900 + easeInOut((u - 1470) / 20) * 900}px)`}}>
					<Box>
						<T size={46} color={INK} stroke={0} shadow={0}>MUNDIAL 2026</T><br /><R size={30}>Selecciones latinoamericanas clasificadas</R>
						<div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14, minHeight: 230, alignItems: 'center'}}>
							{Y2026.map((k, i) => {
								const gone = merged > 0 && k !== 'ARG';
								return <div key={k} style={{transform: `scale(${backOut((u - 220 - i * 18) / 10) * (gone ? 1 - merged : 1)})`, width: gone ? 120 * (1 - merged) : 120}}><Flag f={fl(k)} w={116} /></div>;
							})}
						</div>
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 10}}>
							<T size={110} color={merged > 0.5 ? RED : INK} stroke={0} shadow={0}>{merged > 0.5 ? 1 : 9}</T>
							<R size={36}>{merged > 0.5 ? 'SOLA PLAZA' : 'PLAZAS'}</R>
						</div>
					</Box>
				</div>
			)}
			{u >= 880 && u < 1500 && (() => { const [x, y] = sp('HTI'); return <Bubble x={x + 20} y={y - 30} text="¡Esperamos 52 años!" u={u - 880} dur={300} />; })()}
			{u >= 1150 && u < 1500 && (() => { const [x, y] = sp('PAN'); return <Bubble x={x - 10} y={y + 40} text="¿Y nosotros qué?" u={u - 1150} dur={330} side="l" />; })()}
			{u >= 1500 && u < 2700 && (
				<div style={{position: 'absolute', left: 1040, top: 120, width: 840, transform: `translateX(${(1 - easeOut((u - 1500) / 18)) * 900 + easeInOut((u - 2670) / 20) * 900}px)`}}>
					<Box>
						<T size={42} color={INK} stroke={0} shadow={0}>PARTICIPACIONES EN MUNDIALES</T>
						<div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14}}>
							{APPS.map((t, i) => {
								const x = u >= 1950 + i * 30;
								return (
									<div key={t.k} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 10, background: '#fff', border: `3px solid ${INK}`, transform: `scale(${backOut((u - 1600 - i * 14) / 10)})`, opacity: x ? 0.45 : 1}}>
										<Flag f={fl(t.k)} w={48} /><R size={28}>{t.wc}</R>
										{x && <svg width={110} height={50} style={{position: 'absolute', left: 0, top: 0}}><path d="M8 8 L100 42 M100 8 L8 42" stroke={RED} strokeWidth={7} strokeLinecap="round" /></svg>}
									</div>
								);
							})}
						</div>
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: 18}}>
							<div style={{textAlign: 'center'}}><T size={100} color={INK} stroke={0} shadow={0}>{u < 1900 ? 129 : Math.round(129 - 106 * easeInOut((u - 1900) / 520))}</T><br /><R size={26}>participaciones</R></div>
							{u >= 2450 && <div style={{transform: `scale(${backOut((u - 2450) / 12)}) rotate(-4deg)`, padding: '8px 24px', borderRadius: 18, background: RED, border: `6px solid ${INK}`}}><T size={80}>−106</T></div>}
						</div>
					</Box>
				</div>
			)}
			{u >= 2700 && (
				<>
					<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
						{PAIRS.map(([a, b, n], i) => {
							const p = easeOut((u - 2850 - i * 50) / 30) * (1 - easeInOut((u - 3980) / 30));
							if (p <= 0) return null;
							const [x1, y1] = sp(a), [x2, y2] = sp(b);
							const mx = (x1 + x2) / 2 + (y2 - y1) * 0.25, my = (y1 + y2) / 2 - (x2 - x1) * 0.25 - 30;
							return <g key={i}><path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} fill="none" stroke={INK} strokeWidth={11} strokeDasharray={`${p * 1400} 1400`} /><path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} fill="none" stroke={GOLD} strokeWidth={5} strokeDasharray={`${p * 1400} 1400`} /></g>;
						})}
					</svg>
					<div style={{position: 'absolute', left: 1040, top: 120, width: 840, transform: `translateX(${(1 - easeOut((u - 2720) / 18)) * 900}px)`}}>
						<Box>
							<T size={50} color={RED} stroke={0} shadow={0}>¡ADIÓS A LOS CLÁSICOS!</T>
							<div style={{display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 8}}><T size={90} color={INK} stroke={0} shadow={0}>4.465</T><R size={30}>partidos entre ellas desaparecerían</R></div>
							{[[3200, 'ARG', 'URY', '183 partidos: el más repetido de la historia'], [3420, 'ARG', 'BRA', '110 partidos: el Superclásico de América'], [3640, 'URY', 'BRA', 'El Maracanazo de 1950 no habría existido'], [3860, '', '', 'Y la Copa América (869 partidos)... ¡sin rivales!']].map(([at, a, b, txt], i) => (
								<div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, padding: '8px 12px', borderRadius: 14, background: '#fff', border: `3px solid ${INK}`, transform: `translateX(${(1 - easeOut((u - (at as number)) / 14)) * 900}px)`}}>
									{a ? <><Flag f={fl(a as string)} w={52} /><Flag f={fl(b as string)} w={52} /></> : <Star s={44} c="#7FA7D8" />}
									<R size={27}>{txt}</R>
								</div>
							))}
						</Box>
					</div>
				</>
			)}
			<Source text={u < 1500 ? 'Mundial 2026: Argentina, Brasil, Colombia, Ecuador, Paraguay, Uruguay, México, Panamá y Haití · Fuente: FIFA' : 'Partidos oficiales y amistosos 1872-2026 · Fuente: resultados internacionales (martj42)'} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- WORLD RECORD
const OPPK = Object.keys(OPP).filter((k) => WORLD[k]);
const oCol = (k: string) => { const [w, , l] = OPP[k]; return w > l ? '#7BD389' : w < l ? '#F2727F' : '#FFD166'; };
const sweepX = (u: number) => -100 + 4000 * clamp01((u - 500) / 1200);
const Mundo: React.FC<{u: number; cam: WCam}> = ({u, cam}) => {
	const end = ONCE0 - MUN0;
	const out = easeInOut((u - end + 30) / 24);
	const sx = sweepX(u);
	const seen = OPPK.filter((k) => WORLD[k].c[0] < sx);
	const g = seen.filter((k) => OPP[k][0] > OPP[k][2]).length, r = seen.filter((k) => OPP[k][0] < OPP[k][2]).length, e = seen.length - g - r;
	const hi = Math.floor((u - HI0) / HI_STEP);
	const hiI = u >= HI0 ? Math.min(HIS.length - 1, hi) : -1;
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Chip n="5" title="CONTRA EL MUNDO" u={u} />
			{u < HI0 && (
				<div style={{position: 'absolute', left: 1180, top: 120, width: 700, transform: `translateX(${(1 - easeOut((u - 250) / 18)) * 900 + easeInOut((u - HI0 + 40) / 20) * 900}px)`}}>
					<Box>
						<R size={30}>Contra el resto del mundo:</R>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 12}}><T size={84} color={INK} stroke={0} shadow={0}>3.993</T><R size={30}>partidos</R></div>
						<Rec w={1877} d={924} l={1192} width={640} p={easeOut((u - 320) / 60)} />
						<div style={{marginTop: 10}}><R size={28} w={700}>Goles: 6.707 a favor · 4.652 en contra</R></div>
						{u >= 500 && (
							<div style={{marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8}}>
								{[['#7BD389', 'Les gana más que pierde', g], ['#F2727F', 'Le ganan más', r], ['#FFD166', 'Empate', e]].map(([c, lab, n]) => (
									<div key={lab as string} style={{display: 'flex', alignItems: 'center', gap: 12}}>
										<div style={{width: 34, height: 34, borderRadius: 8, background: c as string, border: `4px solid ${INK}`}} />
										<div style={{flex: 1}}><R size={28}>{lab}</R></div><T size={46} color={INK} stroke={0} shadow={0}>{n}</T>
									</div>
								))}
							</div>
						)}
					</Box>
				</div>
			)}
			{hiI >= 0 && (() => {
				const h = HIS[hiI];
				const from = HI0 + hiI * HI_STEP;
				const dur = hiI === HIS.length - 1 ? HI_LAST : HI_STEP;
				const v = u - from;
				const [w, d, l] = OPP[h.k];
				const c = WORLD[h.k].c; const [bx, by] = toScreen(cam, c[0], c[1]);
				const esp = h.k === 'ESP';
				return (
					<>
						<div style={{position: 'absolute', left: 1040, top: 170, width: 840, transform: `${slideIn(v - 20, dur - 20, 900)} rotate(1deg)`}}>
							<Box bg={esp ? '#FFE3E3' : CREAM}>
								<div style={{display: 'flex', alignItems: 'center', gap: 14}}><Flag f={fl(h.k)} w={80} /><T size={52} color={INK} stroke={0} shadow={0}>{up(nm(h.k))}</T></div>
								<div style={{marginTop: 8}}><T size={44} color={esp ? RED : '#2563EB'} stroke={0} shadow={0}>{h.title}</T></div>
								<div style={{marginTop: 10}}><R size={26} w={700}>Latinoamérica contra {nm(h.k)}: {w + d + l} partidos</R></div>
								<div style={{marginTop: 8}}><Rec w={w} d={d} l={l} width={770} big p={easeOut((v - 50) / 40)} /></div>
								<div style={{marginTop: 12}}><R size={28} w={700}>{h.line}</R></div>
							</Box>
						</div>
						{esp && v >= 150 && <div style={{position: 'absolute', left: 1300, top: 70, transform: `scale(${backOut((v - 150) / 10)}) rotate(-5deg)`, padding: '6px 22px', borderRadius: 14, background: RED, border: `6px solid ${INK}`}}><T size={50}>¡SOLO 13 VICTORIAS!</T></div>}
						<Bubble x={bx - 30} y={by - 60} text={h.bubble} u={v - 140} dur={dur - 150} side="l" />
					</>
				);
			})()}
			<Source text="Todos los partidos de las 20 selecciones contra rivales de fuera de Latinoamérica, 1872-2026 · Fuente: resultados internacionales (martj42)" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- PITCH
const PW = 740, PH = 940;
const Pitch: React.FC<{u: number; xi: Pl[]; bench: [string, string][]; inT: number; step: number; title: string; n: string; end: number; note?: React.ReactNode; extra?: React.ReactNode}> = ({u, xi, bench, inT, step, title, n, end, note, extra}) => {
	const out = easeInOut((u - end + 30) / 24);
	const cur = Math.floor((u - inT) / step);
	const shown = Math.min(xi.length, Math.max(0, cur + 1));
	const benchAt = inT + xi.length * step + 40;
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Chip n={n} title={title} u={u} />
			<div style={{position: 'absolute', left: 1130, top: 70, width: PW, height: PH, transform: `translateX(${(1 - easeOut((u - 20) / 20)) * 900}px)`}}>
				<svg width={PW} height={PH} style={{position: 'absolute', inset: 0}}>
					<rect x={4} y={4} width={PW - 8} height={PH - 8} rx={26} fill="#3FA34D" stroke={INK} strokeWidth={8} />
					{Array.from({length: 8}).map((_, i) => <rect key={i} x={10} y={10 + i * ((PH - 20) / 8)} width={PW - 20} height={(PH - 20) / 16} fill="#4BB35A" />)}
					<g fill="none" stroke="#fff" strokeWidth={5} opacity={0.85}>
						<rect x={30} y={30} width={PW - 60} height={PH - 60} /><line x1={30} y1={PH / 2} x2={PW - 30} y2={PH / 2} /><circle cx={PW / 2} cy={PH / 2} r={90} />
						<rect x={PW / 2 - 170} y={30} width={340} height={140} /><rect x={PW / 2 - 170} y={PH - 170} width={340} height={140} />
					</g>
				</svg>
				{xi.slice(0, shown).map((p, i) => {
					const at = inT + i * step;
					const on = i === cur && cur < xi.length;
					return (
						<div key={p.n} style={{position: 'absolute', left: 30 + p.x * (PW - 60), top: 30 + p.y * (PH - 60), transform: `translate(-50%, -50%) scale(${backOut((u - at - 10) / 12) * (on ? 1.15 : 1)})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<div style={{width: 96, height: 96, borderRadius: 48, overflow: 'hidden', border: `5px solid ${on ? GOLD : INK}`, background: '#fff', boxShadow: '0 6px 0 rgba(0,0,0,0.35)'}}><img src={staticFile(`flags/${fl(p.k)}.svg`)} style={{width: 150, height: 96, objectFit: 'cover', marginLeft: -27}} /></div>
							<div style={{marginTop: -8, padding: '2px 10px', borderRadius: 10, background: INK, border: '3px solid #fff', whiteSpace: 'nowrap'}}><T size={26} stroke={0} shadow={0}>{p.n}</T></div>
						</div>
					);
				})}
			</div>
			{cur >= 0 && cur < xi.length && (() => {
				const p = xi[cur];
				const v = u - inT - cur * step;
				return (
					<div style={{position: 'absolute', left: 90, top: 840, width: 900, transform: `translateY(${(1 - easeOut((v - 10) / 14)) * 300 + easeInOut((v - step + 16) / 14) * 300}px)`}}>
						<Box style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 22px'}}>
							<Flag f={fl(p.k)} w={100} />
							<div><T size={52} color={INK} stroke={0} shadow={0}>{up(p.n)}</T><br /><R size={28} w={700}>{nm(p.k)} · {p.fact}</R></div>
						</Box>
					</div>
				);
			})()}
			{u < inT && note && <div style={{position: 'absolute', left: 90, top: 300, width: 940, transform: `scale(${backOut((u - 40) / 14)})`}}>{note}</div>}
			{u >= benchAt && (
				<div style={{position: 'absolute', left: 90, top: 150, width: 960, transform: `translateX(${(1 - easeOut((u - benchAt) / 16)) * -1100}px)`}}>
					<Box>
						<T size={46} color={INK} stroke={0} shadow={0}>BANQUILLO</T>
						<div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10}}>
							{bench.map(([name, k], i) => (
								<div key={name} style={{display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${backOut((u - benchAt - 60 - i * 40) / 10)})`, transformOrigin: 'left center'}}><Flag f={fl(k)} w={64} /><R size={34}>{name}</R><R size={26} color="#6B6F78" w={600}>{nm(k)}</R></div>
							))}
						</div>
					</Box>
					{extra && u >= benchAt + 360 && <div style={{marginTop: 24, transform: `scale(${backOut((u - benchAt - 360) / 12)})`, transformOrigin: 'left center'}}>{extra}</div>}
				</div>
			)}
			<Source text={n === '6' ? 'Once elegido por El Mapa Hincha · Nominados al Balón de Oro 2026: France Football' : 'Once histórico elegido por El Mapa Hincha · ¿Cambiarías a alguien?'} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- FINAL
const Final: React.FC<{u: number}> = ({u}) => {
	const rows: [boolean, string][] = [[true, '10 Mundiales: más que nadie'], [true, '90 títulos en la vitrina'], [true, 'Un once de miedo'], [false, 'De 9 plazas en el Mundial a 1'], [false, 'Adiós a 4.465 clásicos'], [false, 'España seguiría siendo su pesadilla']];
	return (
		<AbsoluteFill>
			<Chip n="8" title="EL VEREDICTO" u={u} />
			{u >= 1250 && <Confetti f={u} start={1250} n={140} />}
			<div style={{position: 'absolute', left: 1080, top: 110, width: 800, transform: `translateX(${(1 - easeOut((u - 80) / 18)) * 900}px)`, opacity: 1 - easeInOut((u - 1180) / 20)}}>
				<Box>
					<T size={46} color={INK} stroke={0} shadow={0}>¿MERECERÍA LA PENA?</T>
					<div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14}}>
						{rows.map(([ok, txt], i) => (
							<div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, transform: `translateX(${(1 - easeOut((u - 200 - i * 150) / 14)) * 900}px)`}}>
								<div style={{width: 52, height: 52, borderRadius: 26, background: ok ? GREEN : RED, border: `5px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><T size={34} stroke={0} shadow={0}>{ok ? '✓' : '✗'}</T></div>
								<R size={34}>{txt}</R>
							</div>
						))}
					</div>
				</Box>
			</div>
			{u >= 1200 && (
				<div style={{position: 'absolute', left: 1000, right: 40, top: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
					<div style={{transform: `scale(${backOut((u - 1220) / 14)}) rotate(-2deg)`, textAlign: 'center'}}><T size={80} color={GOLD}>¿UNIRÍAS A</T><br /><T size={80} color={GOLD}>LATINOAMÉRICA?</T></div>
					<div style={{display: 'flex', gap: 30, transform: `scale(${backOut((u - 1320) / 12)})`}}>
						<div style={{padding: '10px 40px', borderRadius: 24, background: GREEN, border: `6px solid ${INK}`}}><T size={70}>SÍ</T></div>
						<div style={{padding: '10px 40px', borderRadius: 24, background: RED, border: `6px solid ${INK}`}}><T size={70}>NO</T></div>
					</div>
					<div style={{transform: `scale(${backOut((u - 1420) / 12)})`, padding: '10px 26px', borderRadius: 30, background: '#fff', border: `5px solid ${INK}`}}><T size={40} color={INK} stroke={0} shadow={0}>¡Déjalo en los comentarios!</T></div>
					<div style={{marginTop: 30}}><Subscribe f={u} start={1650} /></div>
				</div>
			)}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- main
export const Video22: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS_CAM, f);
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	let uop = 0, umood: FaceMood = 'happy', utalk = 0, upop = 1;
	const allFlags = (lift?: string, mood: FaceMood = 'happy') => { for (const k of L) fills[k] = {flag: fl(k), lift: k === lift ? 1 : 0}; };
	const talk = Math.max(0, Math.sin(f / 4)) * 0.8;
	if (f < TEAMS0) {
		uop = easeInOut((f - 240) / 80); upop = backOut((f - 300) / 16);
		umood = f < 1000 ? (f < 620 ? 'happy' : f < 800 ? 'shock' : 'cool') : 'worried';
		utalk = f > 340 && f < 420 ? talk : 0;
		if (uop < 1) { allFlags(); for (const k of L) faces[k] = {mood: 'happy', max: 54, pop: (1 - uop) * backOut((f - 30 - L.indexOf(k) * 6) / 12)}; }
	} else if (f < VIT0) {
		const u = f - TEAMS0;
		const joined = Math.max(0, Math.floor((u - T_IN - 22) / T_STEP) + 1);
		const cur = Math.floor((u - T_IN) / T_STEP);
		TEAMS.forEach((t, i) => { if (i < joined || i === cur) fills[t.k] = {flag: fl(t.k), lift: i === cur ? easeOut((u - T_IN - i * T_STEP - 10) / 14) * (1 - easeInOut((u - T_IN - i * T_STEP - T_STEP + 14) / 14)) : 0, pop: i === cur ? 1 + 0.06 * backOut((u - T_IN - i * T_STEP - 14) / 10) - 0.06 : 1}; });
		if (cur >= 0 && cur < TEAMS.length) { const k = TEAMS[cur].k; faces[k] = {mood: TEAMS[cur].wc ? 'happy' : 'worried', max: 150, pop: backOut((u - T_IN - cur * T_STEP - 16) / 12), talk: u - T_IN - cur * T_STEP > 40 && u - T_IN - cur * T_STEP < 100 ? talk : 0}; }
		uop = easeInOut((u - (VIT0 - TEAMS0) + 260) / 60); upop = backOut((u - (VIT0 - TEAMS0) + 220) / 14);
		umood = 'love';
	} else if (f < WC0) {
		const u = f - VIT0; uop = 1;
		umood = u < 2850 ? 'happy' : u < 3300 ? 'love' : u < 3800 ? 'smug' : 'shock';
		utalk = (u > 3300 && u < 3420) || (u > 3950 && u < 4080) ? talk : 0;
	} else if (f < PRE0) {
		const u = f - WC0; uop = 1; upop = 1 - 0.5 * easeInOut((u - 280) / 30);
		umood = 'cool';
	} else if (f < MUN0) {
		const u = f - PRE0;
		const m = easeInOut((u - 640) / 80);
		uop = m; upop = backOut((u - 720) / 14) * (1 - 0.35 * easeInOut((u - 1500) / 30)); umood = u < 2700 ? 'sad' : 'worried';
		if (m < 1) for (const k of L) { const q = Y2026.includes(k); fills[k] = q ? {flag: fl(k), lift: (1 - m) * easeOut((u - 200) / 20), pop: 1} : {color: '#CFC6B2'}; if (q) faces[k] = {mood: 'happy', max: 70, pop: (1 - m) * backOut((u - 220 - Y2026.indexOf(k) * 18) / 10)}; }
		if (u >= 860 && u < 1500) { faces.HTI = {mood: 'sad', max: 60, pop: backOut((u - 860) / 10), talk: u < 960 ? talk : 0}; faces.PAN = {mood: 'angry', max: 60, pop: backOut((u - 1130) / 10), talk: u > 1150 && u < 1250 ? talk : 0}; }
	} else if (f < ONCE0) {
		const u = f - MUN0; uop = 1; upop = 0.5; umood = 'neutral';
		const sx = sweepX(u);
		for (const k of OPPK) if (WORLD[k].c[0] < sx) fills[k] = {color: oCol(k)};
		const hi = Math.floor((u - HI0) / HI_STEP);
		if (u >= HI0) {
			const i = Math.min(HIS.length - 1, hi); const h = HIS[i]; const v = u - HI0 - i * HI_STEP; const dur = i === HIS.length - 1 ? HI_LAST : HI_STEP;
			fills[h.k] = {color: oCol(h.k), flag: fl(h.k), lift: easeOut((v - 20) / 14) * (1 - easeInOut((v - dur + 14) / 14))};
			faces[h.k] = {mood: h.mood as FaceMood, max: 170, pop: backOut((v - 30) / 12) * (1 - easeInOut((v - dur + 14) / 14)), talk: v > 140 && v < 230 ? talk : 0};
		}
	} else if (f < FIN0) {
		const lg = f >= LEY0; const u = f - (lg ? LEY0 : ONCE0); const xi = lg ? XI_LEG : XI_NOW; const inT = lg ? G_IN : P_IN; const st = lg ? G_STEP : P_STEP;
		const cur = Math.floor((u - inT) / st);
		const ck = cur >= 0 && cur < 11 ? xi[cur].k : '';
		allFlags(ck);
		if (ck) { const v = u - inT - cur * st; fills[ck].lift = easeOut((v - 6) / 12) * (1 - easeInOut((v - st + 12) / 12)); faces[ck] = {mood: 'love', max: 140, pop: backOut((v - 10) / 10) * (1 - easeInOut((v - st + 12) / 12))}; }
		if (!lg && u > P_IN + 11 * P_STEP + 400) faces.MEX = {mood: 'angry', max: 90, pop: backOut((u - P_IN - 11 * P_STEP - 400) / 10), talk: u < P_IN + 11 * P_STEP + 520 ? talk : 0};
	} else {
		const u = f - FIN0; uop = 1; upop = backOut((u - 20) / 14); umood = u < 650 ? 'happy' : u < 1200 ? 'worried' : 'cool';
		utalk = u > 1220 && u < 1380 ? talk : 0;
	}
	if (uop >= 0.999) for (const k of L) if (fills[k] && !fills[k].lift) delete fills[k];
	const [fx, fy] = unionScreen(cam);
	const onceEnd = P_IN + 11 * P_STEP;
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			<Atlas21 cam={cam} fills={fills} faces={faces} dark={f >= WC0 + 280 && f < PRE0 ? 0.6 * easeInOut((f - WC0 - 280) / 30) * (1 - easeInOut((f - PRE0 + 50) / 30)) : 0}>
				<Union cam={cam} op={uop} mood={umood} talk={utalk} pop={upop} f={f} />
			</Atlas21>
			{f < TEAMS0 && <Hook u={f} cam={cam} />}
			{f >= TEAMS0 && f < VIT0 && <Teams u={f - TEAMS0} />}
			{f >= VIT0 && f < WC0 && <Vitrina u={f - VIT0} cam={cam} />}
			{f >= WC0 && f < PRE0 && <WCGrid u={f - WC0} />}
			{f >= PRE0 && f < MUN0 && <Price u={f - PRE0} cam={cam} />}
			{f >= MUN0 && f < ONCE0 && <Mundo u={f - MUN0} cam={cam} />}
			{f >= ONCE0 && f < LEY0 && <Pitch u={f - ONCE0} xi={XI_NOW} bench={BENCH_NOW} inT={P_IN} step={P_STEP} title="EL ONCE DE HOY" n="6" end={LEY0 - ONCE0}
				note={<Box><T size={52} color={INK} stroke={0} shadow={0}>¿Y MESSI?</T><br /><R size={32} w={700}>Se retiró de la selección el 31 de agosto de 2026, tras el Mundial. ¡Lo guardamos para el once de leyenda!</R></Box>}
				extra={<Box bg="#FFF3C4"><R size={30}>8 latinoamericanos en el top 30 del Balón de Oro 2026</R></Box>} />}
			{f >= ONCE0 && f < LEY0 && f - ONCE0 > onceEnd + 400 && (() => { const c = WORLD.MEX.c; const [x, y] = toScreen(cam, c[0], c[1]); return <Bubble x={x + 30} y={y - 40} text="¿¡Y yo en el banquillo!?" u={f - ONCE0 - onceEnd - 410} dur={300} />; })()}
			{f >= LEY0 && f < FIN0 && <Pitch u={f - LEY0} xi={XI_LEG} bench={BENCH_LEG} inT={G_IN} step={G_STEP} title="EL ONCE DE LEYENDA" n="7" end={FIN0 - LEY0} extra={<Box bg="#FFF3C4"><R size={30}>Entre Pelé, Maradona y Messi: 5 Mundiales ganados</R></Box>} />}
			{f >= FIN0 && <Final u={f - FIN0} />}
			{f >= FIN0 + 1220 && f < FIN0 + 1400 && <Bubble x={fx + 100} y={fy - 140} text="¡Yo lo tengo claro!" u={f - FIN0 - 1220} dur={180} />}
		</AbsoluteFill>
	);
};
