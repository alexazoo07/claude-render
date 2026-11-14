import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {WORLD, WCam, bboxOf} from '../v5/WorldLayer5';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, easeInOut, easeOut, elastic} from '../ui';
import {camPath, Confetti, Key, Subscribe, Trophy} from '../common';
import {FlagPreload} from '../v2/Preload';
import {Atlas, Face12, FaceMood, FaceSpec, Fill, INK, toScreen} from '../v12/Atlas';
import {AMatch, CAT_COL, CAT_DARK, CAT_NAME, CAT_STAMP, Cat, FL, Focus, Group, MATCH_LABEL, MATCH_SAY, NAME, PENS, R, SCRIPT, TEAMS23, catOf} from './data14';

const FPS = 60;
const CREAM = '#FFF7E6';
const CEL = '#6CB4EE';
const YEL = '#FFD23F';
const HERO = 'ARG';
const CATS: Cat[] = ['GANA', 'IGUAL', 'PIERDE', 'NUNCA'];
const up = (s: string) => s.toUpperCase();
const nm = (k: string) => NAME[k] ?? k;
const pct = (v: number) => v.toFixed(1).replace('.', ',');

// ================================================================ timeline
export const HOOK = 1260;
const HINT = 420;
const FOC = 780;
const P_PIN = 30, P_LINE = 70, P_CARD = 90, P_B1 = 220, P_B2 = 400, P_REV = 580, P_FEED = 630;
const G0 = 150, GSTEP = 70, GTAIL = 230;
const SUM = 600, CTA = 330, DRAW = 1500, TAB = 900, BR = 300, SIMS = 2400, FIN = 600, OUTRO = 600;
const MD: Record<AMatch['tag'], number> = {G1: 1680, G2: 1680, G3: 1680, R16: 1800, QF: 1800, SF: 1800, F: 2900};
const KICK = 360, MPF = 10, FT = KICK + 90 * MPF; // 1260
const ETK = FT + 40, ETEND = ETK + 30 * MPF; // 1300 .. 1600
const PK0 = ETEND + 50, PKS = 64; // penalties
const CEL0 = PK0 + PENS.length * PKS + 40;

type Seg =
	| {kind: 'hint'; from: number; dur: number}
	| {kind: 'focus'; from: number; dur: number; e: Focus; i: number}
	| {kind: 'group'; from: number; dur: number; e: Group; i: number}
	| {kind: 'sum'; from: number; dur: number}
	| {kind: 'cta'; from: number; dur: number; next: string}
	| {kind: 'draw'; from: number; dur: number}
	| {kind: 'match'; from: number; dur: number; m: AMatch; i: number}
	| {kind: 'table'; from: number; dur: number}
	| {kind: 'bracket'; from: number; dur: number; stage: number}
	| {kind: 'sims'; from: number; dur: number}
	| {kind: 'fin'; from: number; dur: number}
	| {kind: 'outro'; from: number; dur: number};
export const SEGS: Seg[] = [];
let _t = HOOK;
type DistOmit<T> = T extends unknown ? Omit<T, 'from'> : never;
const push = (s: DistOmit<Seg>) => { SEGS.push({...s, from: _t} as Seg); _t += s.dur; };
push({kind: 'hint', dur: HINT});
SCRIPT.forEach((e, i) => {
	if (e.kind === 'focus') push({kind: 'focus', dur: FOC, e, i});
	else push({kind: 'group', dur: G0 + GSTEP * e.keys.length + GTAIL, e, i});
});
push({kind: 'sum', dur: SUM});
push({kind: 'cta', dur: CTA, next: 'Empieza la Eurocopa'});
push({kind: 'draw', dur: DRAW});
R.arg.slice(0, 3).forEach((m, i) => push({kind: 'match', dur: MD[m.tag], m, i}));
push({kind: 'table', dur: TAB});
push({kind: 'cta', dur: CTA, next: 'Empiezan las eliminatorias'});
R.arg.slice(3).forEach((m, i) => { push({kind: 'bracket', dur: BR, stage: i}); push({kind: 'match', dur: MD[m.tag], m, i: i + 3}); });
push({kind: 'sims', dur: SIMS});
push({kind: 'fin', dur: FIN});
push({kind: 'outro', dur: OUTRO});
export const V14_TOTAL = _t;
export const segStart = (kind: Seg['kind'], n = 0) => SEGS.filter((s) => s.kind === kind)[n].from;
const HIST_END = segStart('sum') + SUM;
const DRAW0 = segStart('draw');
const TAB0 = segStart('table');
const SIMS0 = segStart('sims');

// every historial reveal
const REV: {k: string; f: number}[] = [];
for (const s of SEGS) {
	if (s.kind === 'focus') REV.push({k: s.e.k, f: s.from + P_REV + 20});
	else if (s.kind === 'group') s.e.keys.forEach((k, j) => REV.push({k, f: s.from + G0 + j * GSTEP + 16}));
}
const revealedBy = (f: number) => REV.filter((r) => f >= r.f);
const countsAt = (f: number) => { const c: Record<Cat, number> = {GANA: 0, IGUAL: 0, PIERDE: 0, NUNCA: 0}; for (const r of revealedBy(f)) c[catOf(r.k)]++; return c; };
const ALL_FLAGS = Array.from(new Set(Object.values(FL)));

// goal frame inside a match seg
const goalF = (m: number) => (m <= 90 ? KICK + m * MPF : ETK + (m - 90) * MPF);
const minuteAt = (m: AMatch, t: number) => {
	if (t < KICK) return 0;
	if (t < FT) return Math.floor((t - KICK) / MPF);
	if (!m.et || t < ETK) return 90;
	return Math.min(120, 90 + Math.floor((t - ETK) / MPF));
};
const scoreAt = (m: AMatch, t: number): [number, number] => {
	let a = 0, b = 0;
	for (const g of m.goals) if (t >= goalF(g.m)) { if (g.t === 'ARG') a++; else b++; }
	return [a, b];
};
const endOf = (m: AMatch) => (m.pens ? CEL0 : m.et ? ETEND : FT);

// ================================================================ camera
const fitBox = (keys: string[], cx = 1010, cy = 450, w = 700, h = 480, minSpan = 230): WCam => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of keys) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	if (x1 - x0 < minSpan) { const c = (x0 + x1) / 2; x0 = c - minSpan / 2; x1 = c + minSpan / 2; }
	if (y1 - y0 < minSpan * 0.7) { const c = (y0 + y1) / 2; y0 = c - minSpan * 0.35; y1 = c + minSpan * 0.35; }
	const z = Math.max(0.5, Math.min(4.2, Math.min(w / (x1 - x0 + 30), h / (y1 - y0 + 30))));
	return {x: (x0 + x1) / 2 + (960 - cx) / z, y: (y0 + y1) / 2 + (540 - cy) / z, z};
};
const SA_CAM = fitBox(['ARG', 'BRA', 'CHL', 'PER'], 1100, 520, 900, 700);
const EU_CAM = fitBox(['PRT', 'IRL', 'NOR', 'GRC', 'TUR', 'UKR', 'ISL'], 1130, 520, 1300, 860);
const UK_CAM = fitBox(['ENG', 'SCT', 'IRL', 'WLS', 'NIR'], 1130, 560, 800, 700);
const ATL_CAM: WCam = {x: (SA_CAM.x + EU_CAM.x) / 2, y: (SA_CAM.y + EU_CAM.y) / 2, z: 0.42};
const H_FLY = 300, H_EU = 480, H_REV = 760, H_MESSI = 1000;
const KEYS_CAM: Key[] = (() => {
	const k: Key[] = [];
	const add = (f: number, c: WCam) => k.push([f, c.x, c.y, c.z]);
	add(0, {...SA_CAM, z: SA_CAM.z * 0.92}); add(H_FLY, SA_CAM); add(H_FLY + 90, ATL_CAM); add(H_EU, EU_CAM); add(HOOK, {...EU_CAM, z: EU_CAM.z * 1.06});
	for (const s of SEGS) {
		let c: WCam;
		if (s.kind === 'focus') c = fitBox([s.e.k]);
		else if (s.kind === 'group') c = fitBox(s.e.keys, 1010, 430, 760, 440, 200);
		else if (s.kind === 'draw') c = UK_CAM;
		else if (s.kind === 'match') c = fitBox([s.m.o], 1150, 560, 520, 360, 120);
		else c = EU_CAM;
		add(s.from + 60, c); add(s.from + s.dur - 10, {...c, z: c.z * 1.05});
	}
	k.sort((a, b) => a[0] - b[0]);
	return k;
})();

// ================================================================ sfx / music
export const v14Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f: Math.round(f), name, vol});
	S(0, 'whoosh_4', 0.5); S(14, 'boom', 0.55); S(30, 'slap', 0.5); S(46, 'slap', 0.5); S(62, 'pop_3', 0.45); S(120, 'crowd_ohh', 0.25);
	S(H_FLY, 'riser', 0.3); S(H_FLY + 20, 'whoosh_1', 0.45); S(H_EU - 20, 'whoosh_2', 0.4);
	TEAMS23.forEach((_, i) => S(H_EU + 30 + i * 6, `pop_${(i % 4) + 1}`, 0.16)); S(H_EU + 200, 'boom', 0.5); S(H_EU + 202, 'crowd_ohh', 0.35);
	[0, 1, 2].forEach((i) => { S(H_REV + 30 + i * 50, 'slap', 0.45); S(H_REV + 50 + i * 50, 'glitch', 0.2); }); S(H_REV + 200, 'drumroll', 0.3);
	S(H_MESSI, 'whoosh_3', 0.45); S(H_MESSI + 20, 'boom', 0.55); for (let i = 0; i < 30; i++) S(H_MESSI + 80 + i * 3, 'tick', 0.12); S(H_MESSI + 170, 'pop_2', 0.45); S(H_MESSI + 200, 'crowd_ohh', 0.35);
	for (const sg of SEGS) {
		const f0 = sg.from;
		if (sg.kind === 'hint') { S(f0, 'whoosh_2', 0.45); S(f0 + 40, 'slap', 0.45); for (let i = 0; i < 12; i++) S(f0 + 80 + i * 5, 'tick', 0.12); CATS.forEach((_, i) => S(f0 + 200 + i * 30, `pop_${i + 1}`, 0.4)); }
		if (sg.kind === 'group') {
			S(f0, `whoosh_${(sg.i % 4) + 1}`, 0.45); S(f0 + 60, 'slap', 0.35);
			sg.e.keys.forEach((k, j) => { const g = f0 + G0 + j * GSTEP; S(g, `pop_${(j % 4) + 1}`, 0.42); S(g + 16, catOf(k) === 'PIERDE' ? 'glitch' : 'glass', 0.18); });
			S(f0 + sg.dur - 16, 'whoosh_1', 0.3);
		}
		if (sg.kind === 'focus') {
			const cat = catOf(sg.e.k);
			S(f0, `whoosh_${(sg.i % 4) + 1}`, 0.45); S(f0 + P_PIN, 'pop_1', 0.4); S(f0 + P_LINE, 'riser', 0.15);
			S(f0 + P_CARD, 'slap', 0.35); for (let k = 0; k < 8; k++) S(f0 + 130 + k * 9, 'tick', 0.12);
			S(f0 + P_B1, 'pop_2', 0.45); S(f0 + P_B2, 'pop_3', 0.45); S(f0 + P_REV - 50, 'drumroll', 0.3);
			S(f0 + P_REV, 'boom', 0.55); S(f0 + P_REV + 4, cat === 'PIERDE' ? 'glitch' : 'glass', 0.35); S(f0 + P_REV + 6, cat === 'GANA' ? 'crowd_roar' : 'crowd_ohh', 0.35);
			S(f0 + FOC - 16, 'whoosh_1', 0.3);
		}
		if (sg.kind === 'sum') { S(f0, 'whoosh_4', 0.5); S(f0 + 30, 'boom', 0.5); CATS.forEach((_, i) => S(f0 + 90 + i * 40, `pop_${i + 1}`, 0.45)); S(f0 + 380, 'pop_2', 0.4); }
		if (sg.kind === 'cta') { S(f0, 'whoosh_3', 0.45); S(f0 + 20, 'pop_1', 0.45); S(f0 + 60, 'pop_2', 0.4); S(f0 + 150, 'pop_3', 0.4); S(f0 + 210, 'click', 0.5); S(f0 + 212, 'bong', 0.35); S(f0 + CTA - 16, 'whoosh_1', 0.35); }
		if (sg.kind === 'draw') {
			S(f0, 'whoosh_2', 0.45); S(f0 + 30, 'slap', 0.4); for (let i = 0; i < 5; i++) S(f0 + 90 + i * 60, 'pop_1', 0.35);
			S(f0 + 560, 'whoosh_4', 0.4); for (let p = 0; p < 4; p++) for (let g = 0; g < 6; g++) S(f0 + 640 + p * 150 + g * 18, `pop_${(g % 4) + 1}`, 0.25);
			S(f0 + 1240, 'boom', 0.5); S(f0 + 1244, 'crowd_ohh', 0.3);
		}
		if (sg.kind === 'match') {
			const m = sg.m;
			S(f0, 'whoosh_4', 0.45); S(f0 + 60, 'slap', 0.4); S(f0 + 90, 'pop_2', 0.35);
			S(f0 + KICK, 'whistle_long', 0.5); S(f0 + KICK + 4, 'crowd_roar', 0.25);
			for (const g of m.goals) { const gf = f0 + goalF(g.m); S(gf - 8, 'kick', 0.5); S(gf, 'boom', 0.55); S(gf + 2, g.t === 'ARG' ? 'crowd_roar' : 'crowd_ohh', 0.5); S(gf + 12, 'slap', 0.4); }
			S(f0 + FT - 10, 'whistle_long', 0.5);
			if (m.et) { S(f0 + ETK, 'whistle_short', 0.45); S(f0 + ETEND, 'whistle_long', 0.5); }
			if (m.pens) {
				S(f0 + PK0 - 30, 'drumroll', 0.35);
				PENS.forEach((p, i) => { const k = f0 + PK0 + i * PKS; S(k, 'whistle_short', 0.3); S(k + 24, 'kick', 0.5); S(k + 32, p.ok ? (p.t === 'ARG' ? 'crowd_roar' : 'glass') : 'crowd_ohh', 0.45); if (!p.ok) S(k + 32, 'slap', 0.4); });
				S(f0 + CEL0, 'boom', 0.65); S(f0 + CEL0 + 2, 'crowd_roar', 0.7); S(f0 + CEL0 + 20, 'glass', 0.35);
			} else { S(f0 + endOf(m) + 30, 'pop_2', 0.4); S(f0 + endOf(m) + 34, m.ga > m.gb ? 'crowd_roar' : m.ga < m.gb ? 'crowd_ohh' : 'crowd_ohh', 0.4); }
			S(f0 + sg.dur - 16, 'whoosh_1', 0.3);
		}
		if (sg.kind === 'table') { S(f0, 'whoosh_2', 0.45); S(f0 + 40, 'slap', 0.4); for (let i = 0; i < 4; i++) S(f0 + 80 + i * 20, 'pop_1', 0.3); S(f0 + 300, 'drumroll', 0.35); S(f0 + 420, 'boom', 0.5); S(f0 + 424, 'crowd_roar', 0.45); }
		if (sg.kind === 'bracket') { S(f0, 'whoosh_3', 0.45); S(f0 + 30, 'slap', 0.35); for (let i = 0; i < 8; i++) S(f0 + 50 + i * 8, 'tick', 0.15); S(f0 + 160, 'pop_2', 0.4); }
		if (sg.kind === 'sims') {
			S(f0, 'whoosh_4', 0.5); S(f0 + 20, 'glitch', 0.3); for (let i = 0; i < 40; i++) S(f0 + 60 + i * 3, 'tick', 0.12); S(f0 + 190, 'boom', 0.5);
			for (let i = 0; i < 8; i++) S(f0 + 280 + i * 50, `pop_${(i % 4) + 1}`, 0.4); S(f0 + 760, 'crowd_ohh', 0.35);
			S(f0 + 1000, 'whoosh_2', 0.45); for (let i = 0; i < 5; i++) S(f0 + 1060 + i * 70, 'pop_3', 0.4); S(f0 + 1500, 'boom', 0.45);
			S(f0 + 1700, 'whoosh_3', 0.45); for (let i = 0; i < 6; i++) S(f0 + 1760 + i * 50, 'pop_1', 0.35); S(f0 + 2100, 'glitch', 0.3); S(f0 + 2104, 'slap', 0.45);
		}
		if (sg.kind === 'fin') { S(f0, 'whoosh_4', 0.5); S(f0 + 30, 'boom', 0.55); S(f0 + 34, 'crowd_roar', 0.45); for (let i = 0; i < 3; i++) S(f0 + 120 + i * 70, 'pop_2', 0.4); }
		if (sg.kind === 'outro') { S(f0, 'whoosh_2', 0.45); S(f0 + 20, 'pop_1', 0.45); S(f0 + 80, 'pop_3', 0.4); S(f0 + 230, 'pop_4', 0.4); S(f0 + 290, 'click', 0.5); S(f0 + 292, 'bong', 0.35); }
	}
	for (const c of CTA_OV) { S(c, 'pop_1', 0.35); S(c + 120, 'click', 0.4); S(c + 122, 'bong', 0.25); }
	s.sort((a, b) => a.f - b.f);
	return s;
};
export const v14Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	const m1 = SEGS.find((x) => x.kind === 'match')!.from;
	const r16 = SEGS.find((x) => x.kind === 'match' && x.m.tag === 'R16')!.from;
	const fin = SEGS.find((x) => x.kind === 'match' && x.m.tag === 'F')!;
	return [`m_tense:0:${sec(HOOK + 30)}`, `m_happy:${sec(HOOK)}:${sec(m1 + 40)}`, `m_tense:${sec(m1)}:${sec(TAB0 + 40)}`, `m_happy:${sec(TAB0)}:${sec(r16 + 40)}`, `m_tense:${sec(r16)}:${sec(fin.from + CEL0 + 40)}`, `m_triumph:${sec(fin.from + CEL0)}:${sec(SIMS0 + 40)}`, `m_happy:${sec(SIMS0)}:${sec(segStart('fin') + 40)}`, `m_triumph:${sec(segStart('fin'))}:${sec(V14_TOTAL)}`].join(',');
};

// ================================================================ small UI
const T: React.FC<{children: React.ReactNode; size: number; color?: string; stroke?: number; shadow?: number; style?: React.CSSProperties}> = ({children, size, color = '#fff', stroke, shadow, style}) => (
	<span style={{fontFamily: LILITA, fontSize: size, color, lineHeight: 1, whiteSpace: 'nowrap', WebkitTextStroke: `${stroke ?? size * 0.1}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${shadow ?? size * 0.07}px 0 ${INK}`, ...style}}>{children}</span>
);
const Flag: React.FC<{k: string; w: number; style?: React.CSSProperties}> = ({k, w, style}) => <img src={staticFile(`flags/${FL[k]}.svg`)} style={{width: w, height: w * 0.66, borderRadius: Math.max(3, w * 0.12), border: `${w > 50 ? 3 : 2}px solid ${INK}`, objectFit: 'cover', flexShrink: 0, ...style}} />;
const MiniFace: React.FC<{mood: FaceMood; s: number; bg?: string}> = ({mood, s, bg}) => (
	<svg width={s} height={s} viewBox="0 0 200 200" style={{flexShrink: 0}}>{bg && <circle cx={100} cy={100} r={96} fill={bg} stroke={INK} strokeWidth={8} />}<g transform={bg ? 'translate(18 14) scale(0.82)' : undefined}><Face12 mood={mood} noBlush /></g></svg>
);
const catMood = (c: Cat): FaceMood => (c === 'GANA' ? 'scared' : c === 'IGUAL' ? 'neutral' : c === 'PIERDE' ? 'smug' : 'cool');
const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; col?: string}> = ({children, style, col = INK}) => (
	<div style={{borderRadius: 22, background: CREAM, border: `5px solid ${col}`, boxShadow: `0 0 0 ${col === INK ? 0 : 3}px ${INK}, 0 9px 0 rgba(0,0,0,0.35)`, padding: '16px 22px', boxSizing: 'border-box', ...style}}>{children}</div>
);
const Dark: React.FC<{children: React.ReactNode; style?: React.CSSProperties; col?: string}> = ({children, style, col = '#fff'}) => (
	<div style={{borderRadius: 18, background: 'rgba(22,24,31,0.94)', border: `4px solid ${col}`, boxShadow: '0 7px 0 rgba(0,0,0,0.35)', padding: '10px 18px', boxSizing: 'border-box', ...style}}>{children}</div>
);
const Pill: React.FC<{text: string; p: number; x: number; y: number; bg?: string; size?: number; anchor?: 'c' | 'l'}> = ({text, p, x, y, bg = '#1B1D26', size = 30, anchor = 'c'}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(${anchor === 'c' ? '-50%' : '0'}, -50%) scale(${Math.max(0, p)})`, padding: '6px 18px', borderRadius: 14, background: bg, border: '3px solid #fff', boxShadow: '0 5px 0 rgba(0,0,0,0.35)', fontFamily: LILITA, fontSize: size, color: '#fff', whiteSpace: 'nowrap'}}>{text}</div>
);

// ================================================================ HERO (Argentina sticker)
const HB = (() => { const b = WORLD[HERO].b; return {x0: b[0][0], y0: b[0][1], x1: b[1][0], y1: b[1][1]}; })();
const HERO_LEFT = 70;
const HS = Math.min(300 / (HB.x1 - HB.x0), 600 / (HB.y1 - HB.y0));
const HERO_W = (HB.x1 - HB.x0) * HS, HERO_H = (HB.y1 - HB.y0) * HS;
const HERO_TOP = 150 + (440 - HERO_H) / 2;
const FACE_X = HERO_W * 0.52, FACE_Y = HERO_H * 0.3, FACE_S = 250;
export const heroEye = (): [number, number] => [HERO_LEFT + FACE_X + 80, HERO_TOP + FACE_Y - 6];
const Hero: React.FC<{f: number; mood: FaceMood; look: [number, number]; pop: number; glow?: string; talk?: number}> = ({f, mood, look, pop, glow, talk = 0}) => {
	const bob = Math.sin(f / 22) * 4;
	const sq = 1 + Math.sin(f / 22) * 0.008;
	const blink = (() => { const ph = (f + 37) % 210; return ph < 8 ? Math.sin((ph / 8) * Math.PI) : 0; })();
	return (
		<div style={{position: 'absolute', left: HERO_LEFT - 40, top: HERO_TOP - 40, width: HERO_W + 80, height: HERO_H + 80, transform: `translateY(${bob}px) scale(${pop}, ${pop * sq})`, transformOrigin: '50% 90%'}}>
			{glow && <div style={{position: 'absolute', left: -80, top: -20, width: HERO_W + 240, height: HERO_H + 120, borderRadius: '45%', background: `radial-gradient(ellipse at 50% 40%, ${glow} 0%, rgba(0,0,0,0) 65%)`, opacity: 0.7}} />}
			<svg width={HERO_W + 80} height={HERO_H + 80} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				<defs><clipPath id="heroClip14"><path d={WORLD[HERO].d} /></clipPath></defs>
				<g transform={`translate(40 40) scale(${HS}) translate(${-HB.x0} ${-HB.y0})`}>
					<path d={WORLD[HERO].d} fill="#06142A" opacity={0.35} transform={`translate(${5 / HS} ${9 / HS})`} />
					<path d={WORLD[HERO].d} fill="none" stroke="#fff" strokeWidth={13 / HS} strokeLinejoin="round" />
					<g clipPath="url(#heroClip14)">
						<image href={staticFile('flags/ar.svg')} x={HB.x0 - 2} y={HB.y0 - 2} width={HB.x1 - HB.x0 + 4} height={HB.y1 - HB.y0 + 4} preserveAspectRatio="none" />
						<image href={staticFile('tex/relief.jpg')} x={0} y={20} width={3830} height={1720} preserveAspectRatio="none" style={{mixBlendMode: 'multiply'}} />
					</g>
					<path d={WORLD[HERO].d} fill="none" stroke={INK} strokeWidth={4.5 / HS} strokeLinejoin="round" />
				</g>
			</svg>
			<svg width={FACE_S} height={FACE_S} viewBox="0 0 200 200" style={{position: 'absolute', left: 40 + FACE_X - FACE_S / 2, top: 40 + FACE_Y - FACE_S / 2, overflow: 'visible'}}>
				<Face12 mood={mood} look={look} blink={blink} talk={talk} />
			</svg>
			<div style={{position: 'absolute', left: 40 + HERO_W / 2 - 100, top: HERO_H + 40 + 6, width: 200, display: 'flex', justifyContent: 'center'}}>
				<div style={{padding: '4px 14px', borderRadius: 10, background: '#fff', border: `4px solid ${INK}`, fontFamily: LILITA, fontSize: 26, color: INK}}>ARGENTINA</div>
			</div>
		</div>
	);
};

// ================================================================ shared scene pieces
const PinM: React.FC<{x: number; y: number; text: string; p: number; small?: boolean}> = ({x, y, text, p, small}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) scale(${Math.max(0, p)})`, transformOrigin: '50% 100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<div style={{padding: small ? '3px 10px' : '5px 14px', borderRadius: 12, background: '#1B1D26', border: '3px solid #fff', fontFamily: LILITA, fontSize: small ? 20 : 26, color: '#fff', whiteSpace: 'nowrap', boxShadow: '0 4px 0 rgba(0,0,0,0.35)'}}>{text}</div>
		<svg width={18} height={10}><path d="M0 0 L9 10 L18 0Z" fill="#fff" /></svg>
	</div>
);
const Bubble: React.FC<{x: number; y: number; text: string; p: number; tail: 'down' | 'left' | 'right'; size?: number}> = ({x, y, text, p, tail, size = 36}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(${tail === 'down' ? '-50%' : tail === 'right' ? '-100%' : '0'}, -100%) scale(${Math.max(0, p)})`, transformOrigin: tail === 'down' ? '50% 100%' : tail === 'right' ? '100% 100%' : '0% 100%', zIndex: 5}}>
		<div style={{position: 'relative', padding: '12px 22px', borderRadius: 20, background: '#fff', border: `5px solid ${INK}`, boxShadow: '0 7px 0 rgba(0,0,0,0.3)', fontFamily: LILITA, fontSize: size, color: INK, whiteSpace: 'nowrap'}}>
			{text}
			<svg width={44} height={30} style={{position: 'absolute', left: tail === 'down' ? 'calc(50% - 22px)' : tail === 'right' ? 'calc(100% - 70px)' : 26, bottom: -27}}><path d="M2 0 L22 26 L42 0" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><rect x={4} y={-6} width={36} height={8} fill="#fff" /></svg>
		</div>
	</div>
);
const HeroSay: React.FC<{text: string; p: number}> = ({text, p}) => <Bubble x={heroEye()[0] + 60} y={heroEye()[1] - 10} text={text} p={p} tail="left" />;
const Connect: React.FC<{a: [number, number]; b: [number, number]; p: number; cat: Cat | null; f: number; thin?: boolean}> = ({a, b, p, cat, f, thin}) => {
	if (p <= 0) return null;
	const [ax, ay] = a, [bx, by] = b;
	const mx = (ax + bx) / 2, my = Math.min(ay, by) - Math.max(80, Math.abs(bx - ax) * 0.22);
	const N = 60;
	const pts: [number, number][] = [];
	for (let i = 0; i <= N * p; i++) { const t = i / N; pts.push([(1 - t) * (1 - t) * ax + 2 * (1 - t) * t * mx + t * t * bx, (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * my + t * t * by]); }
	const col = cat ? CAT_COL[cat] : '#fff';
	let d = '';
	if (cat === 'GANA' || cat === 'PIERDE') {
		d = pts.map(([x, y], i) => { if (i === 0 || i === pts.length - 1) return `${i ? 'L' : 'M'}${x} ${y}`; const [px, py] = pts[i - 1]; const nx = -(y - py), ny = x - px; const l = Math.hypot(nx, ny) || 1; const o = (i % 2 ? 1 : -1) * 9; return `L${x + (nx / l) * o} ${y + (ny / l) * o}`; }).join(' ');
	} else d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
	const dash = cat === 'IGUAL' ? '18 12' : !cat ? '4 14' : cat === 'NUNCA' ? '6 12' : undefined;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			<path d={d} fill="none" stroke={INK} strokeWidth={thin ? 8 : 12} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} strokeDasharray={dash} strokeDashoffset={dash ? -f * 1.5 : undefined} />
			<path d={d} fill="none" stroke={col} strokeWidth={thin ? 4 : 6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} strokeDashoffset={dash ? -f * 1.5 : undefined} />
		</svg>
	);
};
const Stamp: React.FC<{text: string; sub?: string; col: string; t: number; x?: number; y?: number; rot?: number; size?: number}> = ({text, sub, col, t, x = 1110, y = 150, rot = -4, size = 62}) => {
	const p = t < 12 ? 2.2 - 1.2 * easeOut(t / 12) : 1;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${p})`, opacity: clamp01(t / 5), display: 'flex', alignItems: 'baseline', gap: 14, padding: '10px 28px', borderRadius: 18, background: col, border: `5px solid ${INK}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)', zIndex: 4}}>
			<T size={size}>{text}</T>
			{sub && <span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff', whiteSpace: 'nowrap'}}>{sub}</span>}
		</div>
	);
};
const Footer: React.FC<{f: number}> = ({f}) => (
	<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 30, background: 'rgba(14,16,22,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.75)', zIndex: 9}}>
		{f < HIST_END ? 'Fuente: todos los partidos oficiales y amistosos de la selección argentina absoluta (1902 - octubre 2026) · Los penaltis cuentan como empate' : 'Simulación ficticia: ranking Elo calculado con todos los partidos internacionales hasta octubre de 2026 · Formato y sedes de la Eurocopa 2028'}
	</div>
);

// ================================================================ HUD (historial)
const RegionPill: React.FC<{text: string; p: number}> = ({text, p}) => (
	<div style={{position: 'absolute', left: 22, top: 20, transform: `translateX(${(1 - p) * -500}px)`, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 20px 8px 14px', borderRadius: 16, background: '#1B1D26', border: '3px solid #2E3140', boxShadow: '0 5px 0 rgba(0,0,0,0.35)', zIndex: 6}}>
		<svg width={22} height={28} viewBox="0 0 22 28"><path d="M11 27 C11 27 2 16 2 10 A9 9 0 0 1 20 10 C20 16 11 27 11 27Z" fill="#FFB020" /><circle cx={11} cy={10} r={3.5} fill="#1B1D26" /></svg>
		<span style={{fontFamily: LILITA, fontSize: 30, color: '#fff', letterSpacing: 1}}>{text}</span>
	</div>
);
const TugBar: React.FC<{f: number; p: number}> = ({f, p}) => {
	const c = countsAt(f);
	const a = c.GANA, b = c.PIERDE;
	const pos = a + b === 0 ? 0.5 : a / (a + b);
	return (
		<div style={{position: 'absolute', left: 560, top: 18, width: 860, height: 60, transform: `translateY(${(1 - p) * -120}px)`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', boxSizing: 'border-box', borderRadius: 30, background: CREAM, border: `4px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)', zIndex: 6}}>
			<MiniFace mood="happy" s={38} bg={CAT_COL.GANA} />
			<span style={{fontFamily: LILITA, fontSize: 26, color: CAT_DARK.GANA}}>LE DOMINA</span>
			<span style={{fontFamily: LILITA, fontSize: 32, color: INK, width: 40, textAlign: 'center'}}>{a}</span>
			<div style={{flex: 1, height: 26, borderRadius: 13, background: '#E6DCC6', border: `3px solid ${INK}`, overflow: 'hidden', position: 'relative'}}>
				<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pos * 100}%`, background: `repeating-linear-gradient(-45deg, ${CAT_COL.GANA} 0 10px, #5BCB85 10px 20px)`}} />
				<div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${(1 - pos) * 100}%`, background: `repeating-linear-gradient(-45deg, ${CAT_COL.PIERDE} 0 10px, #F25C6A 10px 20px)`}} />
				<div style={{position: 'absolute', left: `calc(${pos * 100}% - 22px)`, top: -2, width: 44, height: 26, borderRadius: 8, background: '#FFB020', border: `3px solid ${INK}`, fontFamily: LILITA, fontSize: 18, color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>VS</div>
			</div>
			<span style={{fontFamily: LILITA, fontSize: 32, color: INK, width: 40, textAlign: 'center'}}>{b}</span>
			<span style={{fontFamily: LILITA, fontSize: 26, color: CAT_DARK.PIERDE}}>LE CUESTA</span>
			<MiniFace mood="worried" s={38} bg={CAT_COL.PIERDE} />
		</div>
	);
};
const Feed: React.FC<{f: number; p: number}> = ({f, p}) => {
	const rows = revealedBy(f).slice(-5);
	return (
		<div style={{position: 'absolute', right: 14, bottom: 42, width: 420, display: 'flex', flexDirection: 'column', gap: 6, transform: `translateX(${(1 - p) * 520}px)`, zIndex: 6}}>
			{rows.map((r) => {
				const c = catOf(r.k), h = R.h2h[r.k];
				const u = f - r.f;
				return (
					<div key={r.k} style={{height: 42, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', borderRadius: 12, background: '#1B1D26', border: `3px solid ${CAT_COL[c]}`, boxShadow: '0 4px 0 rgba(0,0,0,0.35)', transform: `translateX(${(1 - easeOut(u / 14)) * 480}px)`}}>
						<Flag k={r.k} w={40} />
						<span style={{flex: 1, fontFamily: LILITA, fontSize: 24, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{up(nm(r.k))}</span>
						<span style={{fontFamily: LILITA, fontSize: 20, color: '#fff'}}>{h.w}-{h.d}-{h.l}</span>
						<span style={{padding: '3px 10px', borderRadius: 9, background: CAT_COL[c], border: `2px solid ${INK}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 13, letterSpacing: 1, color: '#fff'}}>{CAT_NAME[c]}</span>
					</div>
				);
			})}
		</div>
	);
};
const CatPanel: React.FC<{f: number; p: number}> = ({f, p}) => {
	const c = countsAt(f);
	return (
		<div style={{position: 'absolute', left: 14, bottom: 42, width: 400, padding: 10, boxSizing: 'border-box', borderRadius: 18, background: CREAM, border: `4px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)', transform: `translateX(${(1 - p) * -460}px)`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, zIndex: 6}}>
			{CATS.map((k) => (
				<div key={k} style={{borderRadius: 10, background: '#16181F', border: `3px solid ${CAT_COL[k]}`, padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 8}}>
					<span style={{fontFamily: LILITA, fontSize: 40, color: CAT_COL[k], width: 50, textAlign: 'center'}}>{c[k]}</span>
					<div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
						<MiniFace mood={catMood(k)} s={24} bg={CAT_COL[k]} />
						<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 13, letterSpacing: 1, color: CAT_COL[k]}}>{CAT_NAME[k]}</span>
					</div>
				</div>
			))}
		</div>
	);
};

// ================================================================ focus card
const InfoCard: React.FC<{s: Extract<Seg, {kind: 'focus'}>; t: number}> = ({s, t}) => {
	const k = s.e.k, h = R.h2h[k], c = catOf(k);
	const p = backOut((t - P_CARD) / 16) * (1 - easeInOut((t - FOC + 30) / 20));
	const rev = t >= P_REV;
	const q = easeOut((t - 130) / 60);
	const col = rev ? CAT_COL[c] : '#2E3140';
	return (
		<div style={{position: 'absolute', left: 478, width: 960, bottom: 40, transform: `translateY(${(1 - p) * 330}px)`, zIndex: 6}}>
			<div style={{position: 'absolute', left: 22, top: -22, padding: '4px 14px', borderRadius: '10px 10px 0 0', background: col, border: `3px solid ${INK}`, borderBottom: 'none', fontFamily: RUBIK, fontWeight: 800, fontSize: 15, letterSpacing: 1.5, color: '#fff'}}>{s.e.tab}</div>
			<div style={{borderRadius: 20, background: CREAM, border: `5px solid ${col}`, boxShadow: `0 0 0 3px ${INK}, 0 8px 0 rgba(0,0,0,0.35)`, padding: '14px 22px 16px'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
					<Flag k="ARG" w={54} /><span style={{fontFamily: LILITA, fontSize: 30, color: '#8C8471'}}>VS</span><Flag k={k} w={62} />
					<span style={{fontFamily: LILITA, fontSize: 42, color: INK, flex: 1}}>{up(nm(k))}</span>
					<div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 14, background: rev ? CAT_COL[c] : '#D9CFBA', border: `3px solid ${INK}`, transform: `scale(${rev ? 1 + 0.25 * (1 - easeOut((t - P_REV) / 14)) : 1})`}}>
						{rev && <MiniFace mood={catMood(c)} s={30} bg="#fff" />}
						<span style={{fontFamily: LILITA, fontSize: 26, color: rev ? '#fff' : '#6B6250'}}>{rev ? CAT_NAME[c] : '¿? ¿? ¿?'}</span>
					</div>
				</div>
				<div style={{borderTop: '3px dashed #CDBF9F', margin: '10px 0 8px'}} />
				<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, color: '#7A6E57', letterSpacing: 1}}>{h.p} PARTIDOS</span>
					{([['ARGENTINA GANÓ', h.w, CAT_COL.GANA], ['EMPATES', h.d, '#8C8471'], ['PERDIÓ', h.l, CAT_COL.PIERDE]] as [string, number, string][]).map(([a, v, cc]) => (
						<div key={a} style={{display: 'flex', alignItems: 'baseline', gap: 6}}>
							<span style={{fontFamily: LILITA, fontSize: 36, color: cc}}>{Math.round(v * q)}</span>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, color: INK}}>{a}</span>
						</div>
					))}
					<div style={{flex: 1, height: 18, borderRadius: 9, overflow: 'hidden', border: `3px solid ${INK}`, display: 'flex', background: '#E6DCC6'}}>
						<div style={{width: `${(h.w / h.p) * 100 * q}%`, background: CAT_COL.GANA}} />
						<div style={{width: `${(h.d / h.p) * 100 * q}%`, background: '#B7AE98'}} />
						<div style={{width: `${(h.l / h.p) * 100 * q}%`, background: CAT_COL.PIERDE}} />
					</div>
				</div>
				<div style={{marginTop: 8, display: 'flex', gap: 10, alignItems: 'baseline', opacity: clamp01((t - 170) / 12)}}>
					<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 17, color: '#C46A00', letterSpacing: 1}}>DATO</span>
					<span style={{fontFamily: RUBIK, fontWeight: 600, fontSize: 21, color: INK, lineHeight: 1.25}}>{s.e.dato}</span>
				</div>
			</div>
		</div>
	);
};
const GroupScene: React.FC<{g: Extract<Seg, {kind: 'group'}>; t: number; f: number; cam: WCam}> = ({g, t, f, cam}) => {
	const n = g.e.keys.length;
	const out = easeInOut((t - g.dur + 30) / 20);
	const p = backOut((t - 60) / 16) * (1 - out);
	const W = Math.min(940, 220 + n * 140);
	return (
		<>
			{g.e.keys.map((k, j) => {
				const gt = G0 + j * GSTEP;
				if (t < gt) return null;
				const [sx, sy] = toScreen(cam, ...WORLD[k].c);
				return <Connect key={'c' + k} a={heroEye()} b={[sx, sy]} p={easeInOut((t - gt) / 18) * (1 - out)} cat={t >= gt + 16 ? catOf(k) : null} f={f} thin />;
			})}
			{g.e.keys.map((k, j) => {
				const gt = G0 + j * GSTEP;
				if (t < gt) return null;
				const [sx, sy] = toScreen(cam, ...WORLD[k].c);
				const bb = bboxOf(k);
				const topY = 540 + (bb.y0 - cam.y) * cam.z;
				const r = Math.min(70, Math.max(26, Math.min(bb.x1 - bb.x0, bb.y1 - bb.y0) * cam.z * 0.4));
				return <PinM key={'p' + k} x={sx} y={Math.max(110, Math.min(sy - r - 4, topY - 4))} text={up(nm(k))} p={backOut((t - gt - 4) / 10) * (1 - easeInOut((t - gt - 110) / 12))} small />;
			})}
			<div style={{position: 'absolute', left: 478 + (960 - W) / 2, width: W, bottom: 40, transform: `translateY(${(1 - p) * 330}px)`, zIndex: 6}}>
				<Card>
					<div style={{display: 'flex', justifyContent: 'center'}}><T size={38} color={INK} stroke={0} shadow={0}>{g.e.title}</T></div>
					<div style={{textAlign: 'center', fontFamily: RUBIK, fontWeight: 800, fontSize: 13, letterSpacing: 1, marginTop: 2}}><span style={{color: CAT_DARK.GANA}}>ARGENTINA GANÓ</span><span style={{color: '#8C8471'}}> · EMPATES · </span><span style={{color: CAT_DARK.PIERDE}}>PERDIÓ</span></div>
					<div style={{borderTop: '3px dashed #CDBF9F', margin: '8px 0 10px'}} />
					<div style={{display: 'flex', justifyContent: 'center', gap: 10}}>
						{g.e.keys.map((k, j) => {
							const gt = G0 + j * GSTEP; const c = catOf(k); const h = R.h2h[k];
							const on = t >= gt + 16;
							return (
								<div key={k} style={{width: 132, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: t >= gt ? 1 : 0.35, transform: `scale(${t >= gt ? 1 + 0.15 * (1 - easeOut((t - gt) / 12)) : 1})`}}>
									<Flag k={k} w={58} />
									<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 14, color: INK, whiteSpace: 'nowrap'}}>{nm(k)}</span>
									<span style={{padding: '2px 8px', borderRadius: 8, background: on ? CAT_COL[c] : '#D9CFBA', border: `2px solid ${INK}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 12, color: on ? '#fff' : '#6B6250', whiteSpace: 'nowrap'}}>{on ? CAT_NAME[c] : '¿?'}</span>
									<span style={{fontFamily: LILITA, fontSize: 18, opacity: on ? 1 : 0}}><span style={{color: CAT_DARK.GANA}}>{h.w}</span><span style={{color: '#8C8471'}}> · {h.d} · </span><span style={{color: CAT_DARK.PIERDE}}>{h.l}</span></span>
								</div>
							);
						})}
					</div>
				</Card>
			</div>
		</>
	);
};

// ================================================================ CTA
const CTA_OV: number[] = (() => {
	const xs: number[] = [];
	const foc = SEGS.find((s) => s.kind === 'focus' && s.e.k === 'NLD'); if (foc) xs.push(foc.from + 120);
	const g2 = SEGS.find((s) => s.kind === 'match' && s.m.tag === 'G2'); if (g2) xs.push(g2.from + KICK + 80);
	const qf = SEGS.find((s) => s.kind === 'match' && s.m.tag === 'QF'); if (qf) xs.push(qf.from + KICK + 80);
	xs.push(SIMS0 + 1100);
	return xs;
})();
const SubButton: React.FC<{u: number; at: number; s?: number}> = ({u, at, s = 1}) => {
	const click = u >= at;
	const press = u >= at - 4 && u < at + 6;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 14 * s, position: 'relative'}}>
			<div style={{padding: `${10 * s}px ${26 * s}px`, borderRadius: 12 * s, background: click ? '#3A3A3A' : '#E1251B', border: `${4 * s}px solid ${INK}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 30 * s, color: '#fff', boxShadow: '0 6px 0 rgba(0,0,0,0.35)', transform: `scale(${press ? 0.9 : 1})`}}>{click ? 'SUSCRITO' : 'SUSCRÍBETE'}</div>
			<svg width={52 * s} height={52 * s} viewBox="0 0 24 24" style={{transform: `rotate(${click ? Math.sin((u - at) / 2.5) * 22 * Math.max(0, 1 - (u - at) / 50) : 0}deg)`}}>
				<path d="M12 2a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V8a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22z" fill="#FFD23F" stroke={INK} strokeWidth={1.3} />
			</svg>
			{u >= at - 30 && u < at + 20 && (
				<svg width={60 * s} height={60 * s} viewBox="0 0 24 24" style={{position: 'absolute', left: 120 * s, top: 30 * s, transform: `translate(${(1 - easeOut((u - at + 30) / 26)) * 120}px, ${(1 - easeOut((u - at + 30) / 26)) * 80}px)`}}>
					<path d="M5 2 L5 20 L9.5 15.5 L13 22 L16 20.5 L12.5 14 L19 14 Z" fill="#fff" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
				</svg>
			)}
		</div>
	);
};
const CtaBanner: React.FC<{u: number}> = ({u}) => {
	const p = backOut(u / 16) * (1 - easeInOut((u - 250) / 16));
	return (
		<div style={{position: 'absolute', right: 20, top: 100, width: 560, transform: `translateX(${(1 - p) * 640}px)`, zIndex: 8}}>
			<div style={{borderRadius: 20, background: 'rgba(22,24,31,0.95)', border: '4px solid #E1251B', boxShadow: '0 8px 0 rgba(0,0,0,0.35)', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
					<MiniFace mood="happy" s={46} bg={CEL} />
					<div style={{lineHeight: 1.1}}>
						<div style={{fontFamily: LILITA, fontSize: 30, color: '#fff'}}>¿Te está gustando el vídeo?</div>
						<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.8)'}}>Suscríbete: nos ayuda muchísimo a seguir</div>
					</div>
				</div>
				<SubButton u={u} at={120} s={0.85} />
			</div>
		</div>
	);
};
const CtaScene: React.FC<{g: Extract<Seg, {kind: 'cta'}>; t: number}> = ({g, t}) => {
	const out = easeInOut((t - CTA + 30) / 22);
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 7}}>
			<AbsoluteFill style={{background: 'rgba(5,10,25,0.45)', opacity: easeOut(t / 20)}} />
			<div style={{position: 'absolute', left: 600, width: 1120, top: 280, transform: `scale(${backOut((t - 10) / 16)})`}}>
				<Card style={{padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
					<T size={70} color={INK} stroke={0} shadow={0}>¿TE ESTÁ GUSTANDO EL VÍDEO?</T>
					<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: '#6B6250', textAlign: 'center'}}>Si quieres más simulaciones como esta, suscríbete y activa la campanita</div>
					<div style={{transform: 'scale(1.5)', margin: '20px 0'}}><SubButton u={t} at={210} /></div>
					<div style={{padding: '8px 22px', borderRadius: 14, background: '#1B1D26', border: '3px solid #fff', fontFamily: LILITA, fontSize: 32, color: '#fff', transform: `scale(${backOut((t - 150) / 12)})`}}>{g.next} →</div>
				</Card>
			</div>
		</AbsoluteFill>
	);
};

// ================================================================ HOOK
const Hook: React.FC<{f: number; cam: WCam}> = ({f, cam}) => {
	const out = easeInOut((f - HOOK + 14) / 14);
	const [ax, ay] = toScreen(cam, ...WORLD.ARG.c);
	const [bx, by] = toScreen(cam, ...WORLD.ENG.c);
	const fly = easeInOut((f - H_FLY) / 170);
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 6}}>
			{f < H_FLY + 60 && (
				<AbsoluteFill style={{opacity: 1 - easeInOut((f - H_FLY - 20) / 30)}}>
					<div style={{position: 'absolute', left: 560, right: 40, top: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
						<div style={{transform: `scale(${backOut((f - 14) / 12)}) rotate(-2deg)`}}><T size={100}>¿Y si <span style={{color: CEL}}>ARGENTINA</span></T></div>
						<div style={{transform: `scale(${backOut((f - 30) / 12)}) rotate(-2deg)`}}><T size={92}>jugara la</T></div>
						<div style={{transform: `scale(${backOut((f - 46) / 12)}) rotate(-2deg)`}}><T size={150} color={YEL}>EUROCOPA?</T></div>
					</div>
					<div style={{position: 'absolute', left: 900, top: 640, transform: `scale(${backOut((f - 120) / 12)}) rotate(-3deg)`}}>
						<Dark col={YEL}><span style={{fontFamily: LILITA, fontSize: 40, color: '#fff'}}>La subcampeona del mundo contra toda Europa</span></Dark>
					</div>
				</AbsoluteFill>
			)}
			{f >= H_FLY && f < H_EU + 40 && (() => {
				const pts: [number, number][] = [];
				const mx = (ax + bx) / 2, my = Math.min(ay, by) - 260;
				for (let i = 0; i <= 50 * fly; i++) { const t = i / 50; pts.push([(1 - t) * (1 - t) * ax + 2 * (1 - t) * t * mx + t * t * bx, (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * my + t * t * by]); }
				const last = pts[pts.length - 1] ?? [ax, ay];
				const prev = pts[Math.max(0, pts.length - 3)] ?? [ax, ay];
				const ang = (Math.atan2(last[1] - prev[1], last[0] - prev[0]) * 180) / Math.PI;
				return (
					<AbsoluteFill style={{opacity: 1 - easeInOut((f - H_EU) / 30)}}>
						<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
							<path d={pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="14 12" strokeLinecap="round" />
						</svg>
						<div style={{position: 'absolute', left: last[0] - 40, top: last[1] - 40, width: 80, height: 80, transform: `rotate(${ang}deg)`}}>
							<svg width={80} height={80} viewBox="-40 -40 80 80"><path d="M30 0 L-10 -8 L-18 -30 L-26 -30 L-20 -6 L-34 -4 L-38 -14 L-44 -14 L-40 0 L-44 14 L-38 14 L-34 4 L-20 6 L-26 30 L-18 30 L-10 8 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" /></svg>
						</div>
						<div style={{position: 'absolute', left: 560, right: 40, top: 60, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((f - H_FLY - 10) / 12)})`}}><T size={70}>RUMBO A EUROPA...</T></div></div>
					</AbsoluteFill>
				);
			})()}
			{f >= H_EU && f < H_REV + 10 && (() => {
				const u = f - H_EU;
				return (
					<div style={{position: 'absolute', left: 520, right: 0, top: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: 1 - easeInOut((u - (H_REV - H_EU) + 10) / 10)}}>
						<div style={{transform: `scale(${backOut((u - 10) / 12)}) rotate(-2deg)`}}><Dark><T size={54}>23 SELECCIONES EUROPEAS</T></Dark></div>
						<div style={{transform: `scale(${backOut((u - 190) / 12)}) rotate(-2deg)`, padding: '8px 24px', borderRadius: 16, background: CEL, border: `5px solid ${INK}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}><T size={50}>+ 1 INVITADA DE LUJO</T></div>
					</div>
				);
			})()}
			{f >= H_REV && f < H_MESSI + 10 && (() => {
				const u = f - H_REV;
				const cards: [string, string, string, string][] = [['DEU', '2014', 'FINAL DEL MUNDIAL', '0-1'], ['FRA', '2018', 'OCTAVOS DEL MUNDIAL', '3-4'], ['ESP', '2026', 'FINAL DEL MUNDIAL', '0-1 (pr.)']];
				return (
					<AbsoluteFill style={{opacity: 1 - easeInOut((u - (H_MESSI - H_REV) + 10) / 10)}}>
						<div style={{position: 'absolute', left: 520, right: 0, top: 50, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((u - 6) / 12)}) rotate(-2deg)`}}><T size={80} color="#FF4D5E">CUENTAS PENDIENTES</T></div></div>
						<div style={{position: 'absolute', left: 560, width: 1320, top: 230, display: 'flex', justifyContent: 'center', gap: 26}}>
							{cards.map(([k, y, w, s], i) => (
								<div key={k} style={{width: 390, transform: `translateY(${(1 - backOut((u - 30 - i * 50) / 14)) * 700}px) rotate(${(i - 1) * 3}deg)`}}>
									<Card col="#E8394A" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
										<span style={{fontFamily: LILITA, fontSize: 52, color: INK}}>{y}</span>
										<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: '#7A6E57'}}>{w}</span>
										<div style={{display: 'flex', alignItems: 'center', gap: 14}}><Flag k="ARG" w={70} /><span style={{fontFamily: LILITA, fontSize: 50, color: INK}}>{s}</span><Flag k={k} w={70} /></div>
										<span style={{padding: '3px 16px', borderRadius: 10, background: '#E8394A', border: `3px solid ${INK}`, fontFamily: LILITA, fontSize: 28, color: '#fff'}}>PERDIÓ</span>
									</Card>
								</div>
							))}
						</div>
						<div style={{position: 'absolute', left: 520, right: 0, top: 640, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((u - 200) / 12)}) rotate(-3deg)`}}><Dark col={YEL}><T size={58} color={YEL}>¿SE VENGARÍA EN LA EURO?</T></Dark></div></div>
					</AbsoluteFill>
				);
			})()}
			{f >= H_MESSI && (() => {
				const u = f - H_MESSI;
				const n = Math.min(10000, Math.round(10000 * easeOut((u - 80) / 90)));
				return (
					<AbsoluteFill>
						<AbsoluteFill style={{background: 'rgba(5,10,25,0.4)', opacity: easeOut(u / 20)}} />
						<div style={{position: 'absolute', left: 520, right: 0, top: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
							<div style={{transform: `scale(${backOut((u - 10) / 12)}) rotate(-2deg)`}}><T size={76}>Y POR PRIMERA VEZ... <span style={{color: '#FF4D5E'}}>SIN MESSI</span></T></div>
							<div style={{transform: `scale(${backOut((u - 30) / 12)})`, fontFamily: RUBIK, fontWeight: 800, fontSize: 28, color: '#fff', textShadow: `0 3px 0 ${INK}`}}>Se despidió de la selección en 2026: 207 partidos y 125 goles</div>
						</div>
						<div style={{position: 'absolute', left: 620, top: 300, transform: `scale(${backOut((u - 70) / 12)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
							<Dark col={YEL} style={{padding: '14px 30px'}}><div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 26, color: 'rgba(255,255,255,0.8)', textAlign: 'center'}}>SIMULAMOS</div><div style={{fontFamily: LILITA, fontSize: 110, color: YEL, textAlign: 'center', lineHeight: 1}}>{n.toLocaleString('es-ES')}</div><div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 26, color: 'rgba(255,255,255,0.8)', textAlign: 'center'}}>EUROCOPAS</div></Dark>
						</div>
						<div style={{position: 'absolute', left: 1230, top: 290, transform: `scale(${backOut((u - 150) / 14)}) rotate(${Math.sin(f / 9) * 3}deg)`}}>
							<svg width={380} height={320} viewBox="0 0 360 300">
								<path d="M60 150 C40 90 90 40 150 50 C190 20 260 40 280 90 C330 110 330 190 290 220 C270 270 190 280 150 255 C100 270 50 240 60 200 C30 190 30 165 60 150Z" fill="#2B2F3D" stroke={INK} strokeWidth={8} />
								<g transform="translate(118 74) scale(0.62)"><Trophy size={200} /></g>
								<text x={280} y={80} fontFamily="Lilita" fontSize={100} fill="#FFD23F" stroke={INK} strokeWidth={6} paintOrder="stroke" transform="rotate(12 280 80)">?</text>
							</svg>
						</div>
						<div style={{position: 'absolute', left: 520, right: 0, top: 800, display: 'flex', justifyContent: 'center'}}>
							<div style={{transform: `scale(${backOut((u - 190) / 12)})`, padding: '10px 26px', borderRadius: 16, background: '#fff', border: `5px solid ${INK}`}}><T size={46} color={INK} stroke={0} shadow={0}>¿SERÍA CAMPEONA? ¡QUÉDATE HASTA EL FINAL!</T></div>
						</div>
					</AbsoluteFill>
				);
			})()}
		</AbsoluteFill>
	);
};

// ================================================================ HIST intro + summary
const HistIntro: React.FC<{t: number}> = ({t}) => {
	const out = easeInOut((t - HINT + 30) / 20);
	const q = easeOut((t - 80) / 60);
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 6}}>
			<div style={{position: 'absolute', left: 500, width: 1360, top: 120, transform: `scale(${backOut((t - 14) / 14)})`}}>
				<Card style={{padding: '22px 34px'}}>
					<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18}}><Flag k="ARG" w={80} /><T size={64} color={INK} stroke={0} shadow={0}>ARGENTINA VS EUROPA</T></div>
					<div style={{textAlign: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 24, color: '#6B6250', marginTop: 4}}>Todos sus partidos contra selecciones europeas</div>
					<div style={{display: 'flex', justifyContent: 'center', gap: 40, marginTop: 18}}>
						{([['PARTIDOS', R.tot.p, INK], ['GANÓ', R.tot.w, CAT_COL.GANA], ['EMPATES', R.tot.d, '#8C8471'], ['PERDIÓ', R.tot.l, CAT_COL.PIERDE]] as [string, number, string][]).map(([l, v, c]) => (
							<div key={l} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
								<span style={{fontFamily: LILITA, fontSize: 84, color: c, lineHeight: 1}}>{Math.round(v * q)}</span>
								<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: INK}}>{l}</span>
							</div>
						))}
					</div>
					<div style={{textAlign: 'center', marginTop: 12, fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: INK, opacity: clamp01((t - 160) / 12)}}><span style={{color: '#C46A00'}}>EN MUNDIALES: </span>{R.wc.p} partidos · {R.wc.w} victorias · {R.wc.d} empates · {R.wc.l} derrotas</div>
				</Card>
			</div>
			<div style={{position: 'absolute', left: 500, width: 1360, top: 590, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
				{CATS.map((k, i) => {
					const p = easeOut((t - 200 - i * 30) / 16);
					const rule = k === 'GANA' ? 'Argentina le ha ganado más veces' : k === 'IGUAL' ? 'Mismas victorias que derrotas' : k === 'PIERDE' ? 'Argentina ha perdido más veces' : 'Nunca se han enfrentado';
					return (
						<div key={k} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '8px 16px', borderRadius: 16, background: '#fff', border: `4px solid ${CAT_COL[k]}`, transform: `translateX(${(1 - p) * -1500}px)`}}>
							<MiniFace mood={catMood(k)} s={54} bg={CAT_COL[k]} />
							<span style={{width: 210, fontFamily: LILITA, fontSize: 36, color: CAT_DARK[k]}}>{CAT_NAME[k]}</span>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 21, color: INK}}>{rule}</span>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
const Summary: React.FC<{t: number}> = ({t}) => {
	const out = easeInOut((t - SUM + 30) / 20);
	const byCat = (k: Cat) => TEAMS23.filter((x) => catOf(x) === k).sort((a, b) => R.h2h[b].p - R.h2h[a].p);
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 6}}>
			<div style={{position: 'absolute', left: 480, right: 20, top: 40, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((t - 20) / 14)})`}}><T size={62}>LOS 23 RIVALES DE ESTA EUROCOPA</T></div></div>
			<div style={{position: 'absolute', left: 520, width: 1340, top: 150, transform: `scale(${backOut((t - 50) / 16)})`}}>
				<Card style={{display: 'flex', flexDirection: 'column', gap: 12}}>
					{CATS.map((k, i) => {
						const ks = byCat(k);
						const st = 90 + i * 40;
						return (
							<div key={k} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: t >= st ? 1 : 0}}>
								<div style={{width: 250, display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 14, background: CAT_COL[k], border: `3px solid ${INK}`}}>
									<MiniFace mood={catMood(k)} s={40} bg="#fff" />
									<span style={{fontFamily: LILITA, fontSize: 28, color: '#fff'}}>{CAT_NAME[k]}</span>
									<span style={{marginLeft: 'auto', fontFamily: LILITA, fontSize: 34, color: '#fff'}}>{ks.length}</span>
								</div>
								<div style={{flex: 1, display: 'flex', flexWrap: 'wrap', gap: 8}}>
									{ks.map((x, j) => <div key={x} style={{transform: `scale(${backOut((t - st - 6 - j * 4) / 8)})`}}><Flag k={x} w={66} /></div>)}
								</div>
							</div>
						);
					})}
				</Card>
			</div>
			<div style={{position: 'absolute', left: 520, width: 1340, top: 720, display: 'flex', justifyContent: 'center', opacity: clamp01((t - 300) / 12)}}>
				<Dark col={YEL}><span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 28, color: '#fff'}}>Ranking Elo de hoy: Argentina es la <span style={{color: YEL}}>2ª mejor selección del mundo</span>, solo por detrás de España</span></Dark>
			</div>
		</AbsoluteFill>
	);
};

// ================================================================ DRAW
const DrawScene: React.FC<{t: number}> = ({t}) => {
	const out = easeInOut((t - DRAW + 30) / 20);
	const rulesOut = easeInOut((t - 540) / 20);
	const rules: [string, string][] = [['24', 'selecciones: las 23 mejores de Europa en el ranking Elo + Argentina'], ['🏟', 'Sedes reales de la Eurocopa 2028: Reino Unido e Irlanda'], ['6', 'grupos de 4: pasan los 2 primeros y los 4 mejores terceros'], ['🏆', 'Octavos, cuartos, semifinales y final en Wembley'], ['⚽', 'Cada partido se simula según la fuerza (Elo) de cada selección']];
	const elo5 = ['ESP', 'ARG', 'ENG', 'FRA', 'PRT'];
	const POTS = [['ESP', 'ARG', 'ENG', 'FRA', 'PRT', 'CHE'], ['NLD', 'BEL', 'ITA', 'DEU', 'NOR', 'DNK'], ['HRV', 'AUT', 'GRC', 'SWE', 'TUR', 'SCT'], ['SVN', 'HUN', 'IRL', 'KOS', 'UKR', 'BIH']];
	const G = 'ABCDEF'.split('');
	const hl = t >= 1240;
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 6}}>
			{t < 580 && (
				<AbsoluteFill style={{opacity: 1 - rulesOut}}>
					<div style={{position: 'absolute', left: 500, width: 960, top: 90, transform: `scale(${backOut((t - 20) / 14)})`}}>
						<Card style={{padding: '20px 30px'}}>
							<div style={{display: 'flex', justifyContent: 'center'}}><T size={58} color={INK} stroke={0} shadow={0}>LAS REGLAS</T></div>
							<div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14}}>
								{rules.map(([ic, txt], i) => {
									const p = easeOut((t - 80 - i * 50) / 14);
									return (
										<div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '6px 12px', borderRadius: 14, background: '#fff', border: `3px solid ${INK}`, transform: `translateX(${(1 - p) * -1200}px)`}}>
											<span style={{width: 56, height: 50, borderRadius: 10, background: i % 2 ? CEL : YEL, border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 32, color: INK}}>{ic}</span>
											<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 23, color: INK}}>{txt}</span>
										</div>
									);
								})}
							</div>
						</Card>
					</div>
					<div style={{position: 'absolute', left: 1490, width: 400, top: 120, transform: `translateX(${(1 - backOut((t - 320) / 14)) * 600}px)`}}>
						<Dark col={YEL}>
							<div style={{fontFamily: LILITA, fontSize: 30, color: YEL, textAlign: 'center'}}>RANKING ELO MUNDIAL</div>
							{elo5.map((k, i) => (
								<div key={k} style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, padding: '4px 8px', borderRadius: 10, background: k === 'ARG' ? 'rgba(108,180,238,0.35)' : 'transparent'}}>
									<span style={{fontFamily: LILITA, fontSize: 28, color: '#fff', width: 28}}>{i + 1}</span><Flag k={k} w={44} />
									<span style={{flex: 1, fontFamily: LILITA, fontSize: 26, color: '#fff'}}>{up(nm(k))}</span>
									<span style={{fontFamily: LILITA, fontSize: 28, color: YEL}}>{R.elo[k]}</span>
								</div>
							))}
						</Dark>
					</div>
				</AbsoluteFill>
			)}
			{t >= 560 && (
				<>
					<div style={{position: 'absolute', left: 480, right: 20, top: 40, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((t - 570) / 14)})`}}><T size={66}>{hl ? '¡GRUPO DE LA MUERTE!' : 'EL SORTEO'}</T></div></div>
					<div style={{position: 'absolute', left: 500, width: 1380, top: 150, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12}}>
						{G.map((g) => {
							const isC = g === 'C';
							const sc = hl ? (isC ? 1 + 0.12 * easeOut((t - 1240) / 20) : 1) : 1;
							return (
								<div key={g} style={{transform: `translateY(${(1 - backOut((t - 580 - G.indexOf(g) * 10) / 14)) * 900}px) scale(${sc})`, opacity: hl && !isC ? 0.45 : 1, zIndex: isC ? 2 : 1}}>
									<Card col={isC && hl ? CEL : INK} style={{padding: '10px 10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
										<span style={{fontFamily: LILITA, fontSize: 34, color: INK}}>GRUPO {g}</span>
										{R.groups[g].map((k, i) => {
											const pi = POTS.findIndex((p) => p.includes(k));
											const at = 640 + pi * 150 + G.indexOf(g) * 18;
											return (
												<div key={k} style={{width: '100%', height: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', borderRadius: 10, background: k === 'ARG' ? 'rgba(108,180,238,0.45)' : '#fff', border: `3px solid ${INK}`, boxSizing: 'border-box', opacity: t >= at ? 1 : 0.15, transform: `scale(${t >= at ? backOut((t - at) / 10) : 1})`}}>
													{t >= at ? <><Flag k={k} w={42} /><span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 16, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{nm(k)}</span></> : <span style={{fontFamily: LILITA, fontSize: 20, color: '#8C8471'}}>BOMBO {i + 1}</span>}
												</div>
											);
										})}
									</Card>
								</div>
							);
						})}
					</div>
					{hl && <Stamp text="ARGENTINA, GRUPO C" sub="Países Bajos · Croacia · Bosnia" col={CEL} t={t - 1250} x={1190} y={680} />}
				</>
			)}
		</AbsoluteFill>
	);
};

// ================================================================ MATCH
const Scoreboard: React.FC<{m: AMatch; t: number}> = ({m, t}) => {
	const [a, b] = scoreAt(m, t);
	const min = minuteAt(m, t);
	const p = backOut((t - 50) / 14) * (1 - easeInOut((t - MD[m.tag] + 26) / 16));
	const live = t >= KICK && t < endOf(m);
	const lastG = m.goals.filter((g) => t >= goalF(g.m)).slice(-1)[0];
	const flash = lastG ? Math.max(0, 1 - (t - goalF(lastG.m)) / 30) : 0;
	return (
		<div style={{position: 'absolute', left: 560, width: 860, top: 18, transform: `translateY(${(1 - p) * -200}px)`, zIndex: 6}}>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 18px', borderRadius: 22, background: 'rgba(22,24,31,0.96)', border: '4px solid #fff', boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, width: 300}}><Flag k="ARG" w={70} /><span style={{fontFamily: LILITA, fontSize: 36, color: '#fff'}}>ARGENTINA</span></div>
				<div style={{display: 'flex', alignItems: 'center', gap: 10, transform: `scale(${1 + flash * 0.25})`}}>
					<span style={{fontFamily: LILITA, fontSize: 72, color: lastG?.t === 'ARG' && flash > 0 ? YEL : '#fff'}}>{a}</span>
					<span style={{fontFamily: LILITA, fontSize: 52, color: 'rgba(255,255,255,0.6)'}}>-</span>
					<span style={{fontFamily: LILITA, fontSize: 72, color: lastG && lastG.t !== 'ARG' && flash > 0 ? YEL : '#fff'}}>{b}</span>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, width: 300, justifyContent: 'flex-end'}}><span style={{fontFamily: LILITA, fontSize: 36, color: '#fff', whiteSpace: 'nowrap'}}>{up(nm(m.o))}</span><Flag k={m.o} w={70} /></div>
			</div>
			<div style={{display: 'flex', justifyContent: 'center', marginTop: -4, gap: 8}}>
				<div style={{padding: '4px 22px', borderRadius: '0 0 14px 14px', background: live ? '#E8394A' : YEL, border: `3px solid ${INK}`, fontFamily: LILITA, fontSize: 32, color: live ? '#fff' : INK}}>
					{t < KICK ? 'PREVIA' : live ? `${min}'` : m.pens && t >= PK0 ? (t >= CEL0 ? `PENALTIS ${m.pens[0]}-${m.pens[1]}` : 'PENALTIS') : m.et ? 'FINAL (PRÓRROGA)' : 'FINAL'}
				</div>
			</div>
		</div>
	);
};
const MatchPill: React.FC<{m: AMatch; t: number}> = ({m, t}) => (
	<div style={{position: 'absolute', left: 22, top: 20, transform: `translateX(${(1 - backOut((t - 20) / 14)) * -500}px)`, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 6}}>
		<div style={{padding: '8px 18px', borderRadius: 14, background: m.tag === 'F' ? YEL : '#1B1D26', border: `3px solid ${m.tag === 'F' ? INK : '#2E3140'}`, fontFamily: LILITA, fontSize: 30, color: m.tag === 'F' ? INK : '#fff', boxShadow: '0 5px 0 rgba(0,0,0,0.35)'}}>{MATCH_LABEL[m.tag]}</div>
		<div style={{padding: '4px 14px', borderRadius: 10, background: 'rgba(22,24,31,0.9)', fontFamily: RUBIK, fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.85)', alignSelf: 'flex-start'}}>🏟 {m.stadium} · {m.city}</div>
	</div>
);
const PreCard: React.FC<{m: AMatch; t: number}> = ({m, t}) => {
	const p = backOut((t - 90) / 16) * (1 - easeInOut((t - KICK + 20) / 16));
	if (p <= 0) return null;
	const h = R.h2h[m.o];
	return (
		<div style={{position: 'absolute', left: 520, width: 900, bottom: 46, transform: `translateY(${(1 - p) * 360}px)`, zIndex: 6}}>
			<Card>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
					<span style={{fontFamily: LILITA, fontSize: 30, color: INK}}>PREVIA</span>
					<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: '#7A6E57'}}>ELO: ARGENTINA {m.elo[0]} · {up(nm(m.o))} {m.elo[1]}</span>
				</div>
				<div style={{display: 'flex', height: 44, marginTop: 10, borderRadius: 14, overflow: 'hidden', border: `4px solid ${INK}`}}>
					{([[m.p[0], CEL, 'GANA ARG'], [m.p[1], '#B7AE98', 'EMPATE'], [m.p[2], '#E8394A', `GANA ${up(nm(m.o)).split(' ')[0]}`]] as [number, string, string][]).map(([v, c, l]) => (
						<div key={l} style={{width: `${v * easeOut((t - 120) / 40)}%`, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 26, color: '#fff', WebkitTextStroke: `2px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap', overflow: 'hidden'}}>{v >= 26 ? `${l} ${v}%` : `${v}%`}</div>
					))}
				</div>
				<div style={{marginTop: 10, fontFamily: RUBIK, fontWeight: 800, fontSize: 21, color: INK, opacity: clamp01((t - 170) / 12)}}>
					<span style={{color: '#C46A00'}}>HISTORIAL </span>{h.p === 0 ? 'Nunca se han enfrentado' : `${h.p} partidos: Argentina ganó ${h.w}, ${h.d} empates y perdió ${h.l}`}
				</div>
			</Card>
		</div>
	);
};
const GoalFeed: React.FC<{m: AMatch; t: number}> = ({m, t}) => {
	const gs = m.goals.filter((g) => t >= goalF(g.m) + 60);
	const out = 1 - easeInOut((t - MD[m.tag] + 30) / 16);
	return (
		<div style={{position: 'absolute', right: 16, top: 160, width: 380, display: 'flex', flexDirection: 'column', gap: 6, opacity: out, zIndex: 6}}>
			{gs.map((g, i) => (
				<div key={i} style={{height: 44, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', borderRadius: 12, background: 'rgba(22,24,31,0.94)', border: `3px solid ${g.t === 'ARG' ? CEL : '#E8394A'}`, transform: `translateX(${(1 - easeOut((t - goalF(g.m) - 60) / 14)) * 420}px)`}}>
					<span style={{fontSize: 24}}>⚽</span><Flag k={g.t} w={38} />
					<span style={{flex: 1, fontFamily: RUBIK, fontWeight: 800, fontSize: 21, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{g.who}</span>
					<span style={{fontFamily: LILITA, fontSize: 24, color: YEL}}>{g.m}'</span>
				</div>
			))}
		</div>
	);
};
const GoalPop: React.FC<{m: AMatch; t: number}> = ({m, t}) => {
	const g = m.goals.filter((x) => t >= goalF(x.m) && t < goalF(x.m) + 110).slice(-1)[0];
	if (!g) return null;
	const u = t - goalF(g.m);
	const out = 1 - easeInOut((u - 96) / 14);
	return (
		<AbsoluteFill style={{opacity: out, zIndex: 7}}>
			<Stamp text="¡GOOOL!" col={g.t === 'ARG' ? CEL : '#E8394A'} t={u} x={1150} y={330} size={110} rot={g.t === 'ARG' ? -5 : 4} />
			<div style={{position: 'absolute', left: 1150, top: 450, transform: `translate(-50%, 0) scale(${backOut((u - 12) / 10)})`}}>
				<Dark><div style={{display: 'flex', alignItems: 'center', gap: 12}}><Flag k={g.t} w={56} /><T size={44}>{up(g.who)} {g.m}'</T></div></Dark>
			</div>
		</AbsoluteFill>
	);
};
const EndCard: React.FC<{m: AMatch; t: number}> = ({m, t}) => {
	const e = endOf(m) + 40;
	const p = backOut((t - e) / 16) * (1 - easeInOut((t - MD[m.tag] + 30) / 16));
	if (t < e || m.tag === 'F') return null;
	const win = m.ga > m.gb, draw = m.ga === m.gb;
	return (
		<div style={{position: 'absolute', left: 520, width: 900, bottom: 46, transform: `translateY(${(1 - p) * 360}px)`, zIndex: 6}}>
			<Card col={win ? CAT_COL.GANA : draw ? CAT_COL.IGUAL : CAT_COL.PIERDE}>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18}}>
					<Flag k="ARG" w={66} /><span style={{fontFamily: LILITA, fontSize: 60, color: INK}}>{m.ga} - {m.gb}</span><Flag k={m.o} w={66} />
					<span style={{marginLeft: 16, padding: '4px 16px', borderRadius: 12, background: win ? CAT_COL.GANA : draw ? CAT_COL.IGUAL : CAT_COL.PIERDE, border: `3px solid ${INK}`, fontFamily: LILITA, fontSize: 30, color: '#fff'}}>{win ? 'VICTORIA' : draw ? 'EMPATE' : 'DERROTA'}</span>
				</div>
				<div style={{display: 'flex', gap: 26, marginTop: 12, alignItems: 'center'}}>
					{([['POSESIÓN', m.pos, 100 - m.pos, '%'], ['TIROS', m.sha, m.shb, '']] as [string, number, number, string][]).map(([l, a, b, u]) => (
						<div key={l} style={{flex: 1}}>
							<div style={{display: 'flex', justifyContent: 'space-between', fontFamily: LILITA, fontSize: 26, color: INK}}><span>{a}{u}</span><span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 17, color: '#7A6E57'}}>{l}</span><span>{b}{u}</span></div>
							<div style={{display: 'flex', height: 16, borderRadius: 8, overflow: 'hidden', border: `3px solid ${INK}`}}><div style={{width: `${(a / (a + b)) * 100}%`, background: CEL}} /><div style={{flex: 1, background: '#E8394A'}} /></div>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
};
const Shootout: React.FC<{t: number}> = ({t}) => {
	const u = t - PK0 + 30;
	if (u < 0 || t >= CEL0 + 40) return null;
	const idx = Math.min(PENS.length - 1, Math.max(0, Math.floor((t - PK0) / PKS)));
	const cur = PENS[idx];
	const k0 = PK0 + idx * PKS;
	const shown = (i: number) => t >= PK0 + i * PKS + 32;
	const out = 1 - easeInOut((t - CEL0) / 20);
	const row = (team: string) => PENS.map((p, i) => ({p, i})).filter((x) => x.p.t === team);
	return (
		<AbsoluteFill style={{opacity: out, zIndex: 7}}>
			<div style={{position: 'absolute', left: 560, width: 860, top: 200, transform: `scale(${backOut(u / 14)})`}}>
				<Card style={{padding: '16px 26px'}}>
					<div style={{display: 'flex', justifyContent: 'center'}}><T size={46} color={INK} stroke={0} shadow={0}>TANDA DE PENALTIS</T></div>
					{['ESP', 'ARG'].map((team) => (
						<div key={team} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 12}}>
							<Flag k={team} w={66} /><span style={{width: 220, fontFamily: LILITA, fontSize: 34, color: INK}}>{up(nm(team))}</span>
							{row(team).map(({p, i}) => (
								<div key={i} style={{width: 56, height: 56, borderRadius: 28, border: `4px solid ${INK}`, background: shown(i) ? (p.ok ? CAT_COL.GANA : '#E8394A') : '#E6DCC6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 34, color: '#fff', transform: `scale(${shown(i) ? backOut((t - PK0 - i * PKS - 32) / 8) : 1})`}}>{shown(i) ? (p.ok ? '✓' : '✗') : ''}</div>
							))}
							<span style={{marginLeft: 'auto', fontFamily: LILITA, fontSize: 52, color: INK}}>{row(team).filter(({p, i}) => shown(i) && p.ok).length}</span>
						</div>
					))}
				</Card>
			</div>
			{t < CEL0 && (
				<div style={{position: 'absolute', left: 990, top: 560, transform: `translate(-50%, 0) scale(${backOut((t - k0) / 10)})`}}>
					<Dark col={cur.t === 'ARG' ? CEL : '#E8394A'}><div style={{display: 'flex', alignItems: 'center', gap: 12}}><Flag k={cur.t} w={50} /><T size={40}>{up(cur.who)}</T></div></Dark>
				</div>
			)}
			{t >= k0 + 32 && t < k0 + PKS && t < CEL0 && <Stamp text={cur.ok ? '¡GOL!' : cur.save ? '¡PARA DIBU!' : '¡FALLA!'} col={cur.ok ? (cur.t === 'ARG' ? CEL : '#E8394A') : cur.save ? CEL : '#8C8471'} t={t - k0 - 32} x={990} y={720} size={76} />}
		</AbsoluteFill>
	);
};
const Celebration: React.FC<{t: number; f: number}> = ({t, f}) => {
	if (t < CEL0) return null;
	const u = t - CEL0;
	return (
		<AbsoluteFill style={{zIndex: 7}}>
			<AbsoluteFill style={{background: 'rgba(5,10,25,0.15)', opacity: easeOut(u / 20)}} />
			<div style={{position: 'absolute', left: 1060, top: 170, transform: `translate(-50%, 0) scale(${elastic(u / 50)})`}}><Trophy size={330} /></div>
			<Stamp text="¡ARGENTINA, CAMPEONA DE EUROPA!" col={CEL} t={u - 20} x={1100} y={600} size={70} />
			<div style={{position: 'absolute', left: 1100, top: 690, transform: `translate(-50%, 0) scale(${backOut((u - 60) / 12)})`}}>
				<Dark col={YEL}><span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 28, color: '#fff'}}>2-2 tras la prórroga · 4-3 en los penaltis · Wembley</span></Dark>
			</div>
			<Confetti f={f} start={f - u} n={160} />
		</AbsoluteFill>
	);
};
const MatchScene: React.FC<{s: Extract<Seg, {kind: 'match'}>; t: number; f: number; cam: WCam}> = ({s, t, f, cam}) => {
	const m = s.m;
	const [sx, sy] = toScreen(cam, ...WORLD[m.o].c);
	const bb = bboxOf(m.o);
	const topY = 540 + (bb.y0 - cam.y) * cam.z;
	const say = MATCH_SAY[m.tag];
	const e = endOf(m);
	return (
		<>
			<PinM x={sx} y={Math.max(190, topY - 6)} text={up(nm(m.o))} p={backOut((t - 40) / 12) * (1 - easeInOut((t - s.dur + 26) / 14))} />
			<MatchPill m={m} t={t} />
			<Scoreboard m={m} t={t} />
			<PreCard m={m} t={t} />
			<GoalFeed m={m} t={t} />
			<GoalPop m={m} t={t} />
			{m.et && t >= FT && t < ETK + 30 && <Stamp text="¡PRÓRROGA!" col="#FFB020" t={t - FT} x={1150} y={400} size={80} />}
			{m.pens && <Shootout t={t} />}
			<EndCard m={m} t={t} />
			{m.tag === 'F' && <Celebration t={t} f={f} />}
			{t >= 140 && t < KICK - 20 && <HeroSay text={say[0]} p={backOut((t - 140) / 12) * (1 - easeInOut((t - KICK + 30) / 8))} />}
			{t >= e + 70 && t < s.dur - 40 && m.tag !== 'F' && <HeroSay text={say[1]} p={backOut((t - e - 70) / 12) * (1 - easeInOut((t - s.dur + 50) / 8))} />}
			{m.tag === 'F' && t >= CEL0 + 120 && t < s.dur - 30 && <HeroSay text={say[1]} p={backOut((t - CEL0 - 120) / 12)} />}
			{void sy}
		</>
	);
};

// ================================================================ TABLE
const MiniTable: React.FC<{g: string; big?: boolean; t: number}> = ({g, big, t}) => {
	const rows = R.tables[g];
	return (
		<Card style={{padding: big ? '14px 20px' : '8px 10px'}}>
			<div style={{fontFamily: LILITA, fontSize: big ? 40 : 24, color: INK, textAlign: 'center'}}>GRUPO {g}</div>
			{big && <div style={{display: 'flex', fontFamily: RUBIK, fontWeight: 800, fontSize: 16, color: '#7A6E57', padding: '4px 10px'}}><span style={{flex: 1}}>SELECCIÓN</span>{['PJ', 'G', 'E', 'P', 'GF', 'GC', 'PTS'].map((h) => <span key={h} style={{width: 56, textAlign: 'center'}}>{h}</span>)}</div>}
			{rows.map((r, i) => {
				const q = i < 2 ? CAT_COL.GANA : i === 2 ? (R.thirds.includes(g) ? '#FFB020' : '#E8394A') : '#E8394A';
				return (
					<div key={r.t} style={{display: 'flex', alignItems: 'center', gap: big ? 10 : 6, height: big ? 58 : 34, marginTop: 4, padding: big ? '0 10px' : '0 6px', borderRadius: 10, background: r.t === 'ARG' ? 'rgba(108,180,238,0.4)' : '#fff', border: `3px solid ${INK}`, borderLeft: `10px solid ${q}`, transform: `translateX(${(1 - easeOut((t - 40 - i * 12) / 14)) * 300}px)`}}>
						<span style={{fontFamily: LILITA, fontSize: big ? 28 : 18, color: INK, width: big ? 24 : 14}}>{i + 1}</span>
						<Flag k={r.t} w={big ? 50 : 30} />
						<span style={{flex: 1, fontFamily: RUBIK, fontWeight: 800, fontSize: big ? 24 : 15, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{big ? nm(r.t) : r.t}</span>
						{big && [r.w + r.d + r.l, r.w, r.d, r.l, r.gf, r.ga].map((v, j) => <span key={j} style={{width: 56, textAlign: 'center', fontFamily: LILITA, fontSize: 26, color: INK}}>{v}</span>)}
						<span style={{width: big ? 56 : 28, textAlign: 'center', fontFamily: LILITA, fontSize: big ? 32 : 20, color: INK}}>{r.pts}</span>
					</div>
				);
			})}
		</Card>
	);
};
const TableScene: React.FC<{t: number}> = ({t}) => {
	const out = easeInOut((t - TAB + 30) / 20);
	const thirds = 'ABCDEF'.split('').map((g) => ({g, r: R.tables[g][2]})).sort((a, b) => b.r.pts - a.r.pts || b.r.gf - b.r.ga - (a.r.gf - a.r.ga) || b.r.gf - a.r.gf);
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 6}}>
			<div style={{position: 'absolute', left: 480, right: 20, top: 30, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((t - 10) / 14)})`}}><T size={60}>FASE DE GRUPOS: ¿SE CLASIFICA?</T></div></div>
			<div style={{position: 'absolute', left: 500, width: 820, top: 130, transform: `scale(${backOut((t - 30) / 14)})`}}><MiniTable g="C" big t={t} /></div>
			<div style={{position: 'absolute', left: 1350, width: 540, top: 130, opacity: clamp01((t - 220) / 14), transform: `translateX(${(1 - easeOut((t - 220) / 16)) * 600}px)`}}>
				<Card style={{padding: '12px 14px'}}>
					<div style={{fontFamily: LILITA, fontSize: 30, color: INK, textAlign: 'center'}}>MEJORES TERCERAS</div>
					{thirds.map((x, i) => (
						<div key={x.g} style={{display: 'flex', alignItems: 'center', gap: 8, height: 46, marginTop: 5, padding: '0 8px', borderRadius: 10, background: x.r.t === 'ARG' ? 'rgba(108,180,238,0.4)' : '#fff', border: `3px solid ${INK}`, borderLeft: `10px solid ${i < 4 ? CAT_COL.GANA : '#E8394A'}`}}>
							<span style={{fontFamily: LILITA, fontSize: 22, width: 22, color: INK}}>{i + 1}</span><Flag k={x.r.t} w={40} />
							<span style={{flex: 1, fontFamily: RUBIK, fontWeight: 800, fontSize: 19, color: INK}}>{nm(x.r.t)}</span>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 16, color: '#7A6E57'}}>{x.r.gf - x.r.ga > 0 ? '+' : ''}{x.r.gf - x.r.ga}</span>
							<span style={{width: 36, textAlign: 'center', fontFamily: LILITA, fontSize: 26, color: INK}}>{x.r.pts}</span>
							<span style={{padding: '1px 8px', borderRadius: 8, background: i < 4 ? CAT_COL.GANA : '#E8394A', border: `2px solid ${INK}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 12, color: '#fff'}}>{i < 4 ? 'PASA' : 'FUERA'}</span>
						</div>
					))}
				</Card>
			</div>
			{t >= 420 && <Stamp text="¡SE SALVA COMO TERCERA!" sub="4 puntos" col={CEL} t={t - 420} x={910} y={540} />}
			<div style={{position: 'absolute', left: 500, width: 1390, top: 640, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, opacity: clamp01((t - 520) / 14)}}>
				{'ABDEF'.split('').map((g, i) => <div key={g} style={{transform: `translateY(${(1 - backOut((t - 520 - i * 14) / 14)) * 500}px)`}}><MiniTable g={g} t={t - 520} /></div>)}
			</div>
			{t >= 640 && <Stamp text="¡PORTUGAL, ELIMINADA!" col="#E8394A" t={t - 640} x={1500} y={600} size={44} rot={4} />}
		</AbsoluteFill>
	);
};

// ================================================================ BRACKET
const BracketScene: React.FC<{stage: number; t: number}> = ({stage, t}) => {
	const out = easeInOut((t - BR + 26) / 18);
	const cols = ['OCTAVOS', 'CUARTOS', 'SEMIS', 'FINAL'];
	const isArg = (x: {a: string; b: string}) => x.a === 'ARG' || x.b === 'ARG';
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 6}}>
			<AbsoluteFill style={{background: 'rgba(5,10,25,0.35)', opacity: easeOut(t / 16)}} />
			<div style={{position: 'absolute', left: 480, right: 20, top: 26, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((t - 6) / 14)})`}}><T size={56}>EL CUADRO · {cols[stage]}</T></div></div>
			<div style={{position: 'absolute', left: 500, width: 1390, top: 110, height: 900, display: 'flex', gap: 18}}>
				{cols.map((c, ri) => {
					const ms = R.ko[ri];
					const visible = ri <= stage;
					return (
						<div key={c} style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', opacity: visible ? 1 : 0.25}}>
							{ms.map((m, j) => {
								const played = ri < stage;
								const hl = isArg(m);
								const ap = backOut((t - 20 - ri * 30 - j * 6) / 12);
								return (
									<div key={j} style={{transform: `scale(${visible ? ap : 1})`, borderRadius: 12, background: hl ? 'rgba(108,180,238,0.95)' : CREAM, border: `3px solid ${INK}`, padding: '4px 8px', boxShadow: '0 4px 0 rgba(0,0,0,0.35)'}}>
										{[[m.a, m.ga], [m.b, m.gb]].map(([k, g]) => (
											<div key={k as string} style={{display: 'flex', alignItems: 'center', gap: 6, height: 30, opacity: played && m.win !== k ? 0.45 : 1}}>
												{visible ? <Flag k={k as string} w={34} /> : <span style={{width: 34}} />}
												<span style={{flex: 1, fontFamily: RUBIK, fontWeight: 800, fontSize: 16, color: INK, whiteSpace: 'nowrap', overflow: 'hidden'}}>{visible ? nm(k as string) : '¿?'}</span>
												{played && <span style={{fontFamily: LILITA, fontSize: 22, color: INK}}>{g as number}</span>}
											</div>
										))}
										{played && (m.pens || m.et) && <div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 11, color: '#6B6250', textAlign: 'right'}}>{m.pens ? `pen. ${m.pens[0]}-${m.pens[1]}` : 'prórroga'}</div>}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// ================================================================ SIMS
const SimsScene: React.FC<{t: number}> = ({t}) => {
	const S = R.sims; const N = S.N;
	const out = easeInOut((t - SIMS + 30) / 20);
	const champ = Object.entries(S.champ).sort((a, b) => b[1] - a[1]);
	const top = champ.slice(0, 8);
	const reach: [string, number][] = [['OCTAVOS', S.reach.R16], ['CUARTOS', S.reach.QF], ['SEMIS', S.reach.SF], ['FINAL', S.reach.F], ['CAMPEONA', S.reach.CH]];
	const elim = Object.entries(S.elim).filter(([k]) => k !== 'GRUPOS').sort((a, b) => b[1] - a[1]).slice(0, 5);
	const n = Math.min(N, Math.round(N * easeOut((t - 60) / 120)));
	const ph = t < 1000 ? 0 : t < 1700 ? 1 : 2;
	const fade = (a: number, b: number) => clamp01((t - a) / 14) * (1 - clamp01((t - b) / 14));
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 6}}>
			<div style={{position: 'absolute', left: 480, right: 20, top: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: fade(0, 260)}}>
				<div style={{transform: `scale(${backOut((t - 6) / 14)})`}}><T size={58}>PERO ESO ERA SOLO UNA SIMULACIÓN...</T></div>
				<div style={{transform: `scale(${backOut((t - 40) / 14)})`}}><Dark col={YEL}><span style={{fontFamily: LILITA, fontSize: 64, color: YEL}}>{n.toLocaleString('es-ES')}</span><span style={{fontFamily: LILITA, fontSize: 40, color: '#fff'}}> EUROCOPAS SIMULADAS</span></Dark></div>
			</div>
			{ph === 0 && t >= 240 && (
				<div style={{position: 'absolute', left: 520, width: 1360, top: 60, opacity: fade(240, 990)}}>
					<div style={{display: 'flex', justifyContent: 'center', marginBottom: 10}}><T size={50}>¿QUIÉN GANA MÁS EUROCOPAS?</T></div>
					<Card style={{display: 'flex', flexDirection: 'column', gap: 8}}>
						{top.map(([k, v], i) => {
							const p = easeOut((t - 280 - i * 50) / 30);
							const w = (v / top[0][1]) * 100;
							return (
								<div key={k} style={{display: 'flex', alignItems: 'center', gap: 12, height: 62, opacity: t >= 280 + i * 50 ? 1 : 0.2}}>
									<span style={{width: 34, fontFamily: LILITA, fontSize: 32, color: INK}}>{i + 1}</span><Flag k={k} w={64} />
									<span style={{width: 230, fontFamily: LILITA, fontSize: 32, color: INK}}>{up(nm(k))}</span>
									<div style={{flex: 1, height: 38, borderRadius: 12, background: '#E6DCC6', border: `3px solid ${INK}`, overflow: 'hidden'}}><div style={{width: `${w * p}%`, height: '100%', background: k === 'ARG' ? CEL : k === 'ESP' ? '#E8394A' : '#9AA3B5'}} /></div>
									<span style={{width: 150, textAlign: 'right', fontFamily: LILITA, fontSize: 36, color: k === 'ARG' ? '#2E7FC2' : INK}}>{pct((v / N) * 100 * p)} %</span>
								</div>
							);
						})}
					</Card>
					{t >= 760 && <Stamp text={`ARGENTINA, 2ª FAVORITA: ${pct((S.champ.ARG / N) * 100)} %`} col={CEL} t={t - 760} x={700} y={700} size={50} />}
				</div>
			)}
			{ph === 1 && (
				<div style={{position: 'absolute', left: 520, width: 1360, top: 60, opacity: fade(1000, 1690)}}>
					<div style={{display: 'flex', justifyContent: 'center', marginBottom: 14}}><T size={54}>¿HASTA DÓNDE LLEGA ARGENTINA?</T></div>
					<div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 22, height: 600}}>
						{reach.map(([l, v], i) => {
							const p = easeOut((t - 1060 - i * 70) / 30);
							const h = (v / N) * 520;
							return (
								<div key={l} style={{width: 210, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
									<span style={{fontFamily: LILITA, fontSize: 44, color: '#fff', WebkitTextStroke: `3px ${INK}`, paintOrder: 'stroke fill', opacity: p}}>{pct((v / N) * 100 * p)} %</span>
									<div style={{width: '100%', height: h * p, borderRadius: '16px 16px 0 0', background: i === 4 ? YEL : CEL, border: `4px solid ${INK}`, borderBottom: 'none'}} />
									<div style={{width: '100%', padding: '6px 0', textAlign: 'center', borderRadius: 10, background: '#1B1D26', border: '3px solid #fff', fontFamily: LILITA, fontSize: 26, color: '#fff'}}>{l}</div>
								</div>
							);
						})}
					</div>
					{t >= 1500 && <Stamp text="¡CAMPEONA EN 1 DE CADA 5 EUROCOPAS!" col={YEL} t={t - 1500} x={680} y={160} size={46} />}
				</div>
			)}
			{ph === 2 && (
				<div style={{position: 'absolute', left: 520, width: 1360, top: 60, opacity: fade(1700, 2400)}}>
					<div style={{display: 'flex', justifyContent: 'center', marginBottom: 14}}><T size={54}>¿QUIÉN ELIMINA MÁS A ARGENTINA?</T></div>
					<Card style={{display: 'flex', flexDirection: 'column', gap: 10}}>
						{elim.map(([k, v], i) => {
							const p = easeOut((t - 1760 - i * 50) / 30);
							return (
								<div key={k} style={{display: 'flex', alignItems: 'center', gap: 14, height: 70, opacity: t >= 1760 + i * 50 ? 1 : 0.2}}>
									<MiniFace mood={i === 0 ? 'smug' : 'cool'} s={56} bg="#E8394A" /><Flag k={k} w={70} />
									<span style={{width: 260, fontFamily: LILITA, fontSize: 36, color: INK}}>{up(nm(k))}</span>
									<div style={{flex: 1, height: 38, borderRadius: 12, background: '#E6DCC6', border: `3px solid ${INK}`, overflow: 'hidden'}}><div style={{width: `${(v / elim[0][1]) * 100 * p}%`, height: '100%', background: '#E8394A'}} /></div>
									<span style={{width: 150, textAlign: 'right', fontFamily: LILITA, fontSize: 38, color: INK}}>{pct((v / N) * 100 * p)} %</span>
								</div>
							);
						})}
					</Card>
					{t >= 2100 && <Stamp text="SU BESTIA NEGRA: ESPAÑA" sub={`la elimina en el ${pct((S.elim.ESP / N) * 100)} % de las Euros`} col="#E8394A" t={t - 2100} x={700} y={560} size={52} />}
				</div>
			)}
		</AbsoluteFill>
	);
};

// ================================================================ FIN / OUTRO
const FinScene: React.FC<{t: number}> = ({t}) => {
	const S = R.sims; const N = S.N;
	const out = easeInOut((t - FIN + 30) / 20);
	const pts: [string, string][] = [
		['🥈', `Sería la 2ª favorita: campeona en el ${pct((S.champ.ARG / N) * 100)} % de las simulaciones`],
		['🇪🇸', `Solo España tendría más opciones (${pct((S.champ.ESP / N) * 100)} %)`],
		['⚽', `Llegaría a semifinales en más de la mitad de los torneos (${pct((S.reach.SF / N) * 100)} %)`],
		['🏆', 'Y en nuestra simulación... ¡campeona en Wembley ante España!'],
	];
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 6}}>
			<div style={{position: 'absolute', left: 480, right: 20, top: 40, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((t - 20) / 14)})`}}><T size={60}>SI ARGENTINA JUGARA LA EUROCOPA...</T></div></div>
			<div style={{position: 'absolute', left: 520, width: 1340, top: 170, display: 'flex', flexDirection: 'column', gap: 16}}>
				{pts.map(([ic, txt], i) => (
					<div key={i} style={{transform: `translateX(${(1 - easeOut((t - 100 - i * 70) / 16)) * 1500}px)`}}>
						<Card style={{display: 'flex', alignItems: 'center', gap: 18, padding: '14px 22px'}}>
							<span style={{width: 70, height: 64, borderRadius: 14, background: i % 2 ? YEL : CEL, border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38}}>{ic}</span>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: INK}}>{txt}</span>
						</Card>
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};
const Outro: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill style={{zIndex: 6}}>
		<div style={{position: 'absolute', left: 440, right: 20, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
			<div style={{transform: `scale(${backOut((t - 20) / 14)})`, padding: '18px 34px', borderRadius: 24, background: 'linear-gradient(90deg, #6CB4EE, #2E7FC2)', border: `5px solid ${INK}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
				<T size={54}>¿Qué selección metemos en otro torneo?</T>
			</div>
			<div style={{transform: `scale(${backOut((t - 80) / 12)})`, padding: '8px 20px', borderRadius: 14, background: '#fff', border: `4px solid ${INK}`, fontFamily: LILITA, fontSize: 34, color: INK}}>Déjalo en los comentarios ↓</div>
			<div style={{marginTop: 20}}><Subscribe f={t} start={230} /></div>
		</div>
		{t >= OUTRO - 40 && <AbsoluteFill style={{background: '#000', opacity: clamp01((t - OUTRO + 40) / 40)}} />}
	</AbsoluteFill>
);

// ================================================================ main
export const Video14: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS_CAM, f, 14);
	const seg = SEGS.find((s) => f >= s.from && f < s.from + s.dur);
	const t = seg ? f - seg.from : 0;
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	const blinkOf = (k: string) => { const ph = (f + k.charCodeAt(0) * 7 + k.charCodeAt(1) * 3) % 240; return ph < 8 ? Math.sin((ph / 8) * Math.PI) : 0; };
	fills[HERO] = {color: CEL};
	const foc = seg?.kind === 'focus' ? seg : null;
	const grp = seg?.kind === 'group' ? seg : null;
	const mat = seg?.kind === 'match' ? seg : null;
	// --- map fills
	if (f < HOOK) {
		if (f >= H_EU) TEAMS23.forEach((k, i) => { const u = f - H_EU - 30 - i * 6; if (u >= 0) { fills[k] = {flag: FL[k], pop: elastic(u / FPS)}; faces[k] = {mood: f >= H_REV ? 'smug' : 'angry', size: 0.8, max: 60, pop: elastic(u / FPS), blink: blinkOf(k)}; } });
	} else if (f < HIST_END) {
		const inGroup = new Set(grp ? grp.e.keys : []);
		for (const r of revealedBy(f)) {
			if ((foc && r.k === foc.e.k) || inGroup.has(r.k)) continue;
			fills[r.k] = {color: CAT_COL[catOf(r.k)]};
			faces[r.k] = {mood: catMood(catOf(r.k)), size: 0.7, max: 56, blink: blinkOf(r.k), pop: elastic((f - r.f) / FPS)};
		}
	} else {
		// tournament: participants with flags, eliminated dimmed
		const out = new Set<string>();
		if (f >= TAB0 + 200) for (const g of 'ABCDEF') { const tb = R.tables[g]; if (!R.thirds.includes(g)) out.add(tb[2].t); out.add(tb[3].t); }
		const koSegs = SEGS.filter((s): s is Extract<Seg, {kind: 'bracket'}> => s.kind === 'bracket');
		koSegs.forEach((s, ri) => { if (f >= s.from + 60) for (let r = 0; r < ri; r++) for (const m of R.ko[r]) out.add(m.win === m.a ? m.b : m.a); });
		const champDone = f >= SIMS0;
		if (champDone) for (const m of R.ko[3]) out.add(m.win === m.a ? m.b : m.a);
		for (const k of TEAMS23) {
			if (out.has(k)) { fills[k] = {color: '#D8CDB4'}; continue; }
			fills[k] = {flag: FL[k]};
			faces[k] = {mood: 'neutral', size: 0.7, max: 44, blink: blinkOf(k)};
		}
		if (f >= SIMS0 && f < SIMS0 + SIMS) {
			const S = R.sims;
			for (const k of TEAMS23) { const v = (S.champ[k] ?? 0) / S.N; fills[k] = v > 0.05 ? {flag: FL[k], lift: 0.4} : {color: v > 0.01 ? '#E9D9A8' : '#D8CDB4'}; faces[k] = v > 0.05 ? {mood: k === 'ESP' ? 'smug' : 'happy', size: 0.9, max: 70, blink: blinkOf(k)} : (undefined as unknown as FaceSpec); if (!faces[k]) delete faces[k]; }
		}
	}
	// --- hero
	let heroMood: FaceMood = 'smug';
	let heroLook: [number, number] = [0.6, -0.1];
	let heroGlow: string | undefined;
	let heroTalk = 0;
	if (f < HOOK) {
		heroMood = f < H_FLY ? 'happy' : f < H_EU ? 'cool' : f < H_REV ? 'smug' : f < H_MESSI ? 'angry' : 'worried';
		heroLook = [0.9, -0.1];
	}
	if (foc) {
		const k = foc.e.k, c = catOf(k);
		const rev = t >= P_REV;
		fills[k] = rev ? {color: CAT_COL[c], lift: 1 - 0.3 * easeOut((t - P_REV) / 20)} : {flag: FL[k], lift: easeOut((t - 10) / 30), pop: elastic((t - 10) / FPS)};
		const speaking = t >= P_B1 && t < P_B2;
		const oMood: FaceMood = rev ? catMood(c) : speaking ? 'smug' : t >= P_B2 && t < P_REV ? 'angry' : 'neutral';
		faces[k] = {mood: oMood, size: 1.5, pop: elastic((t - 24) / FPS), blink: blinkOf(k), talk: speaking ? Math.abs(Math.sin(t / 3.2)) : 0, look: [-0.7, -0.15]};
		heroLook = [0.9, -0.2];
		if (t >= P_B1 && t < P_B2) heroMood = 'neutral';
		if (t >= P_B2 && t < P_REV) { heroMood = 'smug'; heroTalk = Math.abs(Math.sin(t / 3.2)); }
		if (rev) { heroMood = c === 'GANA' ? 'happy' : c === 'PIERDE' ? 'worried' : 'neutral'; heroGlow = c === 'GANA' ? 'rgba(61,184,107,0.75)' : c === 'PIERDE' ? 'rgba(232,57,74,0.75)' : 'rgba(242,179,61,0.75)'; }
	} else if (grp) {
		grp.e.keys.forEach((k, j) => {
			const g = G0 + j * GSTEP; const c = catOf(k);
			if (t < g) return;
			const on = t >= g + 16;
			fills[k] = on ? {color: CAT_COL[c], lift: 0.7, pop: elastic((t - g) / FPS)} : {flag: FL[k], lift: 0.7, pop: elastic((t - g) / FPS)};
			faces[k] = {mood: on ? catMood(c) : 'neutral', size: 1.15, max: 140, pop: elastic((t - g - 6) / FPS), blink: blinkOf(k), look: [-0.6, -0.1]};
		});
		const end = G0 + GSTEP * grp.e.keys.length;
		heroLook = [0.9, -0.1];
		heroMood = t >= end + 30 ? 'happy' : 'smug';
		if (t >= end + 30 && t < grp.dur - 30) heroTalk = Math.abs(Math.sin(t / 3.2));
		if (t >= end) heroGlow = 'rgba(255,214,90,0.6)';
	} else if (mat) {
		const m = mat.m;
		const [a, b] = scoreAt(m, t);
		const lastG = m.goals.filter((g) => t >= goalF(g.m)).slice(-1)[0];
		const since = lastG ? t - goalF(lastG.m) : 999;
		const done = t >= endOf(m);
		const won = m.pens ? m.pens[0] > m.pens[1] : m.ga > m.gb;
		let om: FaceMood = 'angry';
		if (since < 120) { om = lastG!.t === 'ARG' ? 'shock' : 'happy'; heroMood = lastG!.t === 'ARG' ? 'happy' : 'shock'; heroGlow = lastG!.t === 'ARG' ? 'rgba(108,180,238,0.85)' : 'rgba(232,57,74,0.7)'; }
		else if (done) { om = won ? 'sad' : m.ga === m.gb && !m.pens ? 'neutral' : 'happy'; heroMood = won ? 'happy' : m.ga === m.gb ? 'worried' : 'sad'; if (won) heroGlow = 'rgba(255,214,90,0.8)'; }
		else if (t >= KICK) { om = b > a ? 'smug' : a > b ? 'worried' : 'angry'; heroMood = a > b ? 'smug' : b > a ? 'worried' : 'angry'; }
		else heroMood = 'smug';
		if (m.pens && t >= PK0 && t < CEL0) { const i = Math.min(PENS.length - 1, Math.floor((t - PK0) / PKS)); const p = PENS[i]; const shown = t >= PK0 + i * PKS + 32; heroMood = shown ? ((p.t === 'ARG') === p.ok ? 'happy' : 'shock') : 'worried'; om = shown ? ((p.t === 'ESP') === p.ok ? 'happy' : 'shock') : 'worried'; }
		fills[m.o] = {flag: FL[m.o], lift: easeOut((t - 10) / 30), pop: elastic((t - 10) / FPS)};
		faces[m.o] = {mood: om, size: 1.45, max: 220, pop: elastic((t - 24) / FPS), blink: blinkOf(m.o), look: [-0.7, -0.15]};
		heroLook = [0.9, -0.15];
		if ((t >= 140 && t < KICK - 20) || (t >= endOf(m) + 70 && t < mat.dur - 40)) heroTalk = Math.abs(Math.sin(t / 3.2));
	} else if (seg?.kind === 'cta') { heroMood = 'happy'; heroGlow = 'rgba(255,214,90,0.8)'; if (t >= 40 && t < 260) heroTalk = Math.abs(Math.sin(t / 3.2)); }
	else if (seg?.kind === 'draw') { heroMood = t >= 1240 ? 'worried' : 'smug'; heroLook = [0.9, -0.2]; }
	else if (seg?.kind === 'table') { heroMood = t >= 420 ? 'happy' : 'worried'; if (t >= 420) heroGlow = 'rgba(108,180,238,0.8)'; }
	else if (seg?.kind === 'sims') { heroMood = t >= 1700 ? 'worried' : t >= 760 ? 'happy' : 'smug'; }
	else if (seg?.kind === 'fin' || seg?.kind === 'outro' || seg?.kind === 'sum') { heroMood = 'happy'; heroGlow = 'rgba(255,214,90,0.8)'; }
	const heroPop = f < 40 ? elastic((f - 6) / FPS) : 1;
	const histHud = f >= HOOK + HINT - 30 && f < HIST_END - 560 ? easeOut((f - HOOK - HINT + 30) / 24) * (1 - easeInOut((f - HIST_END + 600) / 20)) : 0;
	const dark = f < H_FLY ? 0.3 : seg?.kind === 'bracket' || seg?.kind === 'sims' || seg?.kind === 'fin' || seg?.kind === 'outro' || seg?.kind === 'table' || seg?.kind === 'sum' || seg?.kind === 'draw' || seg?.kind === 'hint' ? 0.32 : 0;
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			<FlagPreload flags={ALL_FLAGS} />
			<Atlas cam={cam} fills={fills} faces={faces} dark={dark} />
			{foc && (() => {
				const k = foc.e.k, c = catOf(k), h = R.h2h[k];
				const [sx, sy] = toScreen(cam, ...WORLD[k].c);
				const lp = easeInOut((t - P_LINE) / 40) * (1 - easeInOut((t - FOC + 30) / 16));
				const bb = bboxOf(k);
				const topY = 540 + (bb.y0 - cam.y) * cam.z;
				const b1 = foc.e.lines[0];
				return (
					<>
						<Connect a={heroEye()} b={[sx, sy - 10]} p={lp} cat={t >= P_REV ? c : null} f={f} />
						<PinM x={sx} y={Math.max(250, topY - 6)} text={up(nm(k))} p={backOut((t - P_PIN) / 12) * (1 - easeInOut((t - FOC + 26) / 14))} />
						{t >= P_B1 && t < P_B2 + 6 && (() => { const r = Math.min(110, Math.max(50, (bb.x1 - bb.x0) * cam.z * 0.3)); const right = sx + r + b1.length * 19 + 60 < 1890; return <Bubble x={right ? sx + r * 0.6 : sx - r * 0.6} y={sy - r * 0.15} text={b1} p={backOut((t - P_B1) / 12) * (1 - easeInOut((t - P_B2) / 6))} tail={right ? 'left' : 'right'} />; })()}
						{t >= P_B2 && t < P_REV + 6 && <HeroSay text={foc.e.lines[1]} p={backOut((t - P_B2) / 12) * (1 - easeInOut((t - P_REV) / 6))} />}
						{t >= P_REV && t < FOC - 20 && <Stamp text={CAT_STAMP[c]} sub={`Argentina ganó ${h.w} de ${h.p}`} col={CAT_COL[c]} t={t - P_REV} y={150} />}
						<InfoCard s={foc} t={t} />
					</>
				);
			})()}
			{grp && <GroupScene g={grp} t={t} f={f} cam={cam} />}
			{mat && <MatchScene s={mat} t={t} f={f} cam={cam} />}
			<Hero f={f} mood={heroMood} look={heroLook} pop={heroPop} glow={heroGlow} talk={heroTalk} />
			{grp && (() => { const end = G0 + GSTEP * grp.e.keys.length + 30; return t >= end && t < grp.dur - 24 ? <HeroSay text={grp.e.say} p={backOut((t - end) / 12) * (1 - easeInOut((t - grp.dur + 34) / 8))} /> : null; })()}
			{f < HOOK && <Hook f={f} cam={cam} />}
			{seg?.kind === 'hint' && <HistIntro t={t} />}
			{seg?.kind === 'sum' && <Summary t={t} />}
			{seg?.kind === 'sum' && t >= 380 && t < SUM - 40 && <HeroSay text="¡13 me temen y solo 6 me cuestan!" p={backOut((t - 380) / 12) * (1 - easeInOut((t - SUM + 50) / 8))} />}
			{histHud > 0 && (
				<>
					<RegionPill text="ARGENTINA VS EUROPA" p={histHud} />
					<TugBar f={f} p={histHud} />
					<CatPanel f={f} p={histHud} />
					<Feed f={f} p={histHud} />
				</>
			)}
			{seg?.kind === 'cta' && <CtaScene g={seg} t={t} />}
			{seg?.kind === 'cta' && t >= 40 && t < CTA - 30 && <HeroSay text="¡Ayúdame a llegar a más gente!" p={backOut((t - 40) / 12) * (1 - easeInOut((t - CTA + 40) / 8))} />}
			{seg?.kind === 'draw' && <DrawScene t={t} />}
			{seg?.kind === 'draw' && t >= 1300 && t < DRAW - 30 && <HeroSay text="¿Croacia otra vez? Vamos..." p={backOut((t - 1300) / 12) * (1 - easeInOut((t - DRAW + 40) / 8))} />}
			{seg?.kind === 'table' && <TableScene t={t} />}
			{seg?.kind === 'bracket' && <BracketScene stage={seg.stage} t={t} />}
			{seg?.kind === 'sims' && <SimsScene t={t} />}
			{seg?.kind === 'fin' && <FinScene t={t} />}
			{seg?.kind === 'fin' && t >= 380 && t < FIN - 30 && <HeroSay text="¡Que me inviten ya a la Euro!" p={backOut((t - 380) / 12)} />}
			{seg?.kind === 'outro' && <Outro t={t} />}
			{CTA_OV.map((c) => (f >= c && f < c + 280 ? <CtaBanner key={c} u={f - c} /> : null))}
			<Footer f={f} />
		</AbsoluteFill>
	);
};
