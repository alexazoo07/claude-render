import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {WORLD, WCam, bboxOf} from '../v5/WorldLayer5';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, easeInOut, easeOut, elastic} from '../ui';
import {camPath, Confetti, Key, Subscribe, Trophy} from '../common';
import {FlagPreload} from '../v2/Preload';
import {Atlas, Face12, FaceMood, FaceSpec, Fill, INK, toScreen} from '../v12/Atlas';
import {ATITLES, CITY, Cup, FEAT, FL, FMatch, NAME, REAL_TITLES, TOURS, Tour, simOf} from './data16';

const FPS = 60;
const CREAM = '#FFF7E6';
const ROJA = '#D7263D';
const YEL = '#FFD23F';
const CEL = '#6CB4EE';
const GREEN = '#3DB86B';
const up = (s: string) => s.toUpperCase();
const nm = (k: string) => NAME[k] ?? k;
const pct = (v: number) => (v * 100).toFixed(1).replace('.', ',');

// ================================================================ timeline
export const HOOK = 1200;
const STORY = 4200, RULES = 1200, CTA = 330, ARG_IN = 420, ARG_T = 840, ARG_SUM = 480, FIN = 2400, OUTRO = 600;
const T_REAL = 600, T_IN = 360, T_M = 420, T_G = 300, T_OUT = 420;
type Seg =
	| {kind: 'hook'; from: number; dur: number}
	| {kind: 'story'; from: number; dur: number}
	| {kind: 'rules'; from: number; dur: number}
	| {kind: 'tour'; from: number; dur: number; tr: Tour; i: number; mt: number[]}
	| {kind: 'cta'; from: number; dur: number; next: string}
	| {kind: 'argin'; from: number; dur: number}
	| {kind: 'atitle'; from: number; dur: number; i: number}
	| {kind: 'argsum'; from: number; dur: number}
	| {kind: 'fin'; from: number; dur: number}
	| {kind: 'outro'; from: number; dur: number};
export const SEGS: Seg[] = [];
let _t = 0;
type DistOmit<T> = T extends unknown ? Omit<T, 'from'> : never;
const push = (s: DistOmit<Seg>) => { SEGS.push({...s, from: _t} as Seg); _t += s.dur; };
push({kind: 'hook', dur: HOOK});
push({kind: 'story', dur: STORY});
push({kind: 'rules', dur: RULES});
TOURS.forEach((tr, i) => {
	if (tr.kind === 'real') push({kind: 'tour', dur: T_REAL, tr, i, mt: []});
	else {
		const ms = FEAT.esp[tr.id].matches;
		const mt: number[] = []; let x = T_IN;
		for (const m of ms) { mt.push(x); x += m.round.startsWith('GRUPO') ? T_G : T_M; }
		push({kind: 'tour', dur: x + T_OUT, tr, i, mt});
	}
	if (tr.id === 'EU2012') push({kind: 'cta', dur: CTA, next: 'Ahora, los torneos que España perdió'});
	if (tr.id === 'WC2026') push({kind: 'cta', dur: CTA, next: 'Y ahora... ¿Argentina sin Messi?'});
});
push({kind: 'argin', dur: ARG_IN});
ATITLES.forEach((_, i) => push({kind: 'atitle', dur: ARG_T, i}));
push({kind: 'argsum', dur: ARG_SUM});
push({kind: 'fin', dur: FIN});
push({kind: 'outro', dur: OUTRO});
export const V16_TOTAL = _t;
const segOf = (kind: Seg['kind'], n = 0) => SEGS.filter((s) => s.kind === kind)[n];
const RULES0 = segOf('rules').from;
const ARG0 = segOf('argin').from;
const FIN0 = segOf('fin').from;
const tourSeg = (id: string) => SEGS.find((s) => s.kind === 'tour' && s.tr.id === id) as Extract<Seg, {kind: 'tour'}>;
const verdictF = (s: Extract<Seg, {kind: 'tour'}>) => (s.tr.kind === 'real' ? 120 : s.dur - T_OUT + 20);

// trophies over time (alt world)
const ALT_TITLES: {id: string; cup: Cup; f: number; real: boolean}[] = TOURS.filter((tr) => tr.kind === 'real' || FEAT.esp[tr.id].champ).map((tr) => { const s = tourSeg(tr.id); return {id: tr.id, cup: tr.cup, f: s.from + verdictF(s), real: tr.kind === 'real'}; });

// ================================================================ camera
const fitBox = (keys: string[], cx = 1060, cy = 470, w = 760, h = 520, minSpan = 230): WCam => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of keys) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	if (x1 - x0 < minSpan) { const c = (x0 + x1) / 2; x0 = c - minSpan / 2; x1 = c + minSpan / 2; }
	if (y1 - y0 < minSpan * 0.7) { const c = (y0 + y1) / 2; y0 = c - minSpan * 0.35; y1 = c + minSpan * 0.35; }
	const z = Math.max(0.5, Math.min(4.2, Math.min(w / (x1 - x0 + 30), h / (y1 - y0 + 30))));
	return {x: (x0 + x1) / 2 + (960 - cx) / z, y: (y0 + y1) / 2 + (540 - cy) / z, z};
};
const at = (p: [number, number], z: number, cx = 960, cy = 540): WCam => ({x: p[0] + (960 - cx) / z, y: p[1] + (540 - cy) / z, z});
const WORLD_CAM: WCam = {x: 1900, y: 820, z: 0.5};
const EU_CAM = fitBox(['PRT', 'IRL', 'NOR', 'GRC', 'TUR', 'UKR'], 1100, 520, 1200, 820);
const camFor = (keys: string[]) => {
	if (keys.includes('RUS')) return at(CITY.MOSCU, 1.9, 1080, 520);
	if (keys.length === 4) return EU_CAM;
	return fitBox(keys);
};
const H_SPLIT = 300, H_VHS = 560, H_TEASE = 760;
const KEYS_CAM: Key[] = (() => {
	const k: Key[] = [];
	const add = (f: number, c: WCam) => k.push([f, c.x, c.y, c.z]);
	add(0, at(CITY.BARCELONA, 2.2)); add(H_SPLIT, at(CITY.BARCELONA, 1.6)); add(H_VHS, {x: 1700, y: 900, z: 0.6}); add(H_TEASE, EU_CAM); add(HOOK, {...EU_CAM, z: EU_CAM.z * 1.05});
	for (const s of SEGS) {
		if (s.kind === 'hook') continue;
		if (s.kind === 'story') {
			const f0 = s.from;
			add(f0 + 40, at(CITY.ROSARIO, 2.4, 1100, 520)); add(f0 + 300, at(CITY.ROSARIO, 2.6, 1100, 520)); add(f0 + 520, {x: (CITY.ROSARIO[0] + CITY.BARCELONA[0]) / 2, y: (CITY.ROSARIO[1] + CITY.BARCELONA[1]) / 2, z: 0.62});
			add(f0 + 760, at(CITY.BARCELONA, 2.4, 1100, 520)); add(f0 + 900, at(CITY.BARCELONA, 2.5, 1100, 520)); add(f0 + 1000, fitBox(['ESP', 'PRT'], 1100, 500, 700, 520)); add(f0 + 1760, fitBox(['ESP', 'PRT'], 1100, 500, 760, 560));
			add(f0 + 1980, at(CITY.BAIRES, 2.4, 1100, 520)); add(f0 + 2660, at(CITY.BAIRES, 2.6, 1100, 520));
			add(f0 + 2880, at(CITY.BUDAPEST, 2.6, 1100, 520)); add(f0 + 3360, at(CITY.BUDAPEST, 2.8, 1100, 520));
			add(f0 + 3560, WORLD_CAM); add(f0 + 4160, {...WORLD_CAM, z: 0.52});
			continue;
		}
		if (s.kind === 'tour') {
			const base = camFor(s.tr.host);
			add(s.from + 60, base);
			if (s.tr.kind === 'replay') {
				const ms = FEAT.esp[s.tr.id].matches;
				ms.forEach((m, j) => { const c = s.tr.host.includes('RUS') || s.tr.host.length === 4 ? base : fitBox([m.opp, ...s.tr.host], 1060, 470, 760, 520); add(s.from + s.mt[j] + 20, c); add(s.from + s.mt[j] + (m.round.startsWith('GRUPO') ? T_G : T_M) - 20, {...c, z: c.z * 1.06}); });
				add(s.from + s.dur - 20, {...base, z: base.z * 1.05});
			} else add(s.from + s.dur - 10, {...base, z: base.z * 1.08});
			continue;
		}
		if (s.kind === 'atitle') { const tt = ATITLES[s.i]; const c = tt.host.includes('ENG') ? at(CITY.LONDRES, 2.6, 1100, 520) : fitBox(tt.host); add(s.from + 60, c); add(s.from + s.dur - 10, {...c, z: c.z * 1.07}); continue; }
		if (s.kind === 'argin' || s.kind === 'argsum') { const c = fitBox(['ARG', 'BRA', 'CHL'], 1100, 520, 800, 700); add(s.from + 60, c); add(s.from + s.dur - 10, {...c, z: c.z * 1.04}); continue; }
		const c = s.kind === 'rules' ? EU_CAM : WORLD_CAM;
		add(s.from + 60, c); add(s.from + s.dur - 10, {...c, z: c.z * 1.04});
	}
	k.sort((a, b) => a[0] - b[0]);
	return k;
})();

// ================================================================ sfx / music
export const v16Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f: Math.round(f), name, vol});
	// hook
	for (let i = 0; i < 4; i++) { S(20 + i * 60, 'bong', 0.3); S(24 + i * 60, 'tick', 0.25); }
	S(140, 'slap', 0.45); S(200, 'pop_2', 0.4);
	S(H_SPLIT, 'whoosh_2', 0.5); S(H_SPLIT + 30, 'slap', 0.45); S(H_SPLIT + 60, 'slap', 0.45); S(H_SPLIT + 120, 'drumroll', 0.3); S(H_SPLIT + 170, 'boom', 0.55); S(H_SPLIT + 172, 'crowd_roar', 0.35);
	S(H_VHS, 'glitch', 0.5); S(H_VHS + 10, 'riser', 0.35); for (let i = 0; i < 20; i++) S(H_VHS + 20 + i * 6, 'tick', 0.14); S(H_VHS + 150, 'boom', 0.55); S(H_VHS + 160, 'slap', 0.45);
	S(H_TEASE, 'whoosh_4', 0.5); S(H_TEASE + 20, 'pop_1', 0.45); for (let i = 0; i < 18; i++) S(H_TEASE + 40 + i * 4, 'tick', 0.12); S(H_TEASE + 120, 'boom', 0.5);
	S(H_TEASE + 170, 'pop_3', 0.45); S(H_TEASE + 176, 'crowd_ohh', 0.35); S(H_TEASE + 290, 'pop_2', 0.45); S(H_TEASE + 360, 'slap', 0.45);
	for (const sg of SEGS) {
		const f0 = sg.from;
		if (sg.kind === 'story') {
			[60, 420, 600, 1000, 1200, 1500, 1980, 2160, 2400, 2880, 3060, 3560, 3640, 3720, 3800, 3960].forEach((x, i) => S(f0 + x, i % 3 === 0 ? 'whoosh_1' : `pop_${(i % 4) + 1}`, 0.42));
			S(f0 + 330, 'whoosh_3', 0.45); S(f0 + 1240, 'love', 0.0); S(f0 + 1500, 'slap', 0.45); S(f0 + 2400, 'crowd_roar', 0.35); S(f0 + 3060, 'whistle_long', 0.45); S(f0 + 3080, 'glitch', 0.35); S(f0 + 3080, 'crowd_ohh', 0.4);
			for (let i = 0; i < 30; i++) S(f0 + 3600 + i * 4, 'tick', 0.1); S(f0 + 3960, 'drumroll', 0.3); S(f0 + 4080, 'boom', 0.5);
		}
		if (sg.kind === 'rules') { S(f0, 'whoosh_2', 0.45); S(f0 + 30, 'slap', 0.4); for (let i = 0; i < 4; i++) S(f0 + 110 + i * 110, `pop_${i + 1}`, 0.42); for (let i = 0; i < 11; i++) S(f0 + 600 + i * 14, 'tick', 0.15); S(f0 + 900, 'pop_2', 0.4); }
		if (sg.kind === 'cta') { S(f0, 'whoosh_3', 0.45); S(f0 + 20, 'pop_1', 0.45); S(f0 + 60, 'pop_2', 0.4); S(f0 + 150, 'pop_3', 0.4); S(f0 + 210, 'click', 0.5); S(f0 + 212, 'bong', 0.35); S(f0 + CTA - 16, 'whoosh_1', 0.35); }
		if (sg.kind === 'tour') {
			S(f0, `whoosh_${(sg.i % 4) + 1}`, 0.5); S(f0 + 30, 'slap', 0.45); S(f0 + 70, 'pop_2', 0.4);
			if (sg.tr.kind === 'real') { S(f0 + 110, 'drumroll', 0.25); S(f0 + 120, 'boom', 0.55); S(f0 + 124, 'crowd_roar', 0.5); S(f0 + 140, 'glass', 0.35); S(f0 + 300, 'pop_3', 0.4); }
			else {
				S(f0 + 150, 'pop_1', 0.4); S(f0 + 200, 'glitch', 0.25);
				FEAT.esp[sg.tr.id].matches.forEach((m, j) => {
					const a = f0 + sg.mt[j];
					S(a, 'whoosh_2', 0.4); S(a + 30, 'whistle_short', 0.4);
					const n = m.sc[0] + m.sc[1];
					for (let g = 0; g < n; g++) S(a + 70 + g * Math.min(30, 120 / Math.max(1, n)), g < m.sc[0] ? 'kick' : 'slap', 0.35);
					if (m.pens) { S(a + 200, 'drumroll', 0.3); }
					S(a + 240, m.win ? 'crowd_roar' : 'crowd_ohh', 0.5); S(a + 244, m.win ? 'pop_3' : 'glitch', 0.4);
					if (m.messi > 0) S(a + 280, 'pop_4', 0.4);
				});
				const v = f0 + sg.dur - T_OUT + 20;
				S(v - 30, 'drumroll', 0.3); S(v, 'boom', 0.6); S(v + 2, FEAT.esp[sg.tr.id].champ ? 'crowd_roar' : 'crowd_ohh', 0.55); if (FEAT.esp[sg.tr.id].champ) S(v + 20, 'glass', 0.4);
				S(v + 160, 'pop_2', 0.4);
			}
			S(f0 + sg.dur - 16, 'whoosh_1', 0.3);
		}
		if (sg.kind === 'argin') { S(f0, 'whoosh_4', 0.5); S(f0 + 30, 'boom', 0.5); S(f0 + 34, 'crowd_ohh', 0.35); for (let i = 0; i < 4; i++) S(f0 + 160 + i * 40, `pop_${i + 1}`, 0.4); }
		if (sg.kind === 'atitle') {
			S(f0, `whoosh_${(sg.i % 4) + 1}`, 0.5); S(f0 + 30, 'slap', 0.45); S(f0 + 120, 'pop_2', 0.4);
			for (let i = 0; i < 16; i++) S(f0 + 240 + i * 5, 'tick', 0.12); S(f0 + 340, 'pop_3', 0.4); for (let i = 0; i < 16; i++) S(f0 + 360 + i * 5, 'tick', 0.12); S(f0 + 460, 'pop_1', 0.4);
			S(f0 + 540, 'drumroll', 0.3); S(f0 + 600, 'boom', 0.55); S(f0 + 604, ATITLES[sg.i].keeps ? 'crowd_roar' : 'crowd_ohh', 0.5); S(f0 + 606, ATITLES[sg.i].keeps ? 'glass' : 'glitch', 0.35);
			S(f0 + sg.dur - 16, 'whoosh_1', 0.3);
		}
		if (sg.kind === 'argsum') { S(f0, 'whoosh_2', 0.45); for (let i = 0; i < 4; i++) S(f0 + 80 + i * 40, `pop_${i + 1}`, 0.4); S(f0 + 300, 'boom', 0.5); S(f0 + 304, 'crowd_ohh', 0.4); }
		if (sg.kind === 'fin') {
			S(f0, 'whoosh_4', 0.5); S(f0 + 30, 'boom', 0.55); for (let i = 0; i < 7; i++) S(f0 + 160 + i * 30, `pop_${(i % 4) + 1}`, 0.35); S(f0 + 420, 'boom', 0.5); S(f0 + 424, 'crowd_roar', 0.45);
			for (let i = 0; i < 4; i++) S(f0 + 700 + i * 30, `pop_${(i % 4) + 1}`, 0.35); S(f0 + 900, 'boom', 0.5); S(f0 + 904, 'crowd_ohh', 0.45);
			S(f0 + 1250, 'whoosh_3', 0.45); for (let i = 0; i < 3; i++) S(f0 + 1300 + i * 90, 'pop_2', 0.4); S(f0 + 1800, 'slap', 0.45); S(f0 + 1820, 'pop_3', 0.4);
		}
		if (sg.kind === 'outro') { S(f0, 'whoosh_2', 0.45); S(f0 + 20, 'pop_1', 0.45); S(f0 + 80, 'pop_3', 0.4); S(f0 + 230, 'pop_4', 0.4); S(f0 + 290, 'click', 0.5); S(f0 + 292, 'bong', 0.35); }
	}
	for (const c of CTA_OV) { S(c, 'pop_1', 0.35); S(c + 120, 'click', 0.4); S(c + 122, 'bong', 0.25); }
	return s.filter((x) => x.vol > 0).sort((a, b) => a.f - b.f);
};
export const v16Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	const t14 = tourSeg('WC2014').from, t16 = tourSeg('EU2016').from, t18 = tourSeg('WC2018'), t20 = tourSeg('EU2020').from;
	return [`m_tense:0:${sec(HOOK + 30)}`, `m_happy:${sec(HOOK)}:${sec(t14 + 40)}`, `m_tense:${sec(t14)}:${sec(t14 + tourSeg('WC2014').dur - T_OUT + 60)}`, `m_triumph:${sec(t14 + tourSeg('WC2014').dur - T_OUT + 20)}:${sec(t16 + 40)}`, `m_happy:${sec(t16)}:${sec(t18.from + 40)}`, `m_tense:${sec(t18.from)}:${sec(t18.from + t18.dur - T_OUT + 60)}`, `m_triumph:${sec(t18.from + t18.dur - T_OUT + 20)}:${sec(t20 + 40)}`, `m_happy:${sec(t20)}:${sec(ARG0 + 40)}`, `m_tense:${sec(ARG0)}:${sec(FIN0 + 40)}`, `m_triumph:${sec(FIN0)}:${sec(V16_TOTAL)}`].join(',');
};

// ================================================================ small UI
const T: React.FC<{children: React.ReactNode; size: number; color?: string; stroke?: number; shadow?: number; style?: React.CSSProperties}> = ({children, size, color = '#fff', stroke, shadow, style}) => (
	<span style={{fontFamily: LILITA, fontSize: size, color, lineHeight: 1.05, whiteSpace: 'nowrap', WebkitTextStroke: `${stroke ?? size * 0.1}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${shadow ?? size * 0.07}px 0 ${INK}`, ...style}}>{children}</span>
);
const Flag: React.FC<{k: string; w: number; style?: React.CSSProperties}> = ({k, w, style}) => <img src={staticFile(`flags/${FL[k]}.svg`)} style={{width: w, height: w * 0.66, borderRadius: Math.max(3, w * 0.12), border: `${w > 50 ? 3 : 2}px solid ${INK}`, objectFit: 'cover', flexShrink: 0, ...style}} />;
const MiniFace: React.FC<{mood: FaceMood; s: number; bg?: string}> = ({mood, s, bg}) => (
	<svg width={s} height={s} viewBox="0 0 200 200" style={{flexShrink: 0}}>{bg && <circle cx={100} cy={100} r={96} fill={bg} stroke={INK} strokeWidth={8} />}<g transform={bg ? 'translate(18 14) scale(0.82)' : undefined}><Face12 mood={mood} noBlush /></g></svg>
);
const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; col?: string}> = ({children, style, col = INK}) => (
	<div style={{borderRadius: 22, background: CREAM, border: `5px solid ${col}`, boxShadow: `0 0 0 ${col === INK ? 0 : 3}px ${INK}, 0 9px 0 rgba(0,0,0,0.35)`, padding: '16px 22px', boxSizing: 'border-box', ...style}}>{children}</div>
);
const Dark: React.FC<{children: React.ReactNode; style?: React.CSSProperties; col?: string}> = ({children, style, col = '#fff'}) => (
	<div style={{borderRadius: 18, background: 'rgba(22,24,31,0.94)', border: `4px solid ${col}`, boxShadow: '0 7px 0 rgba(0,0,0,0.35)', padding: '10px 18px', boxSizing: 'border-box', ...style}}>{children}</div>
);
const Stamp: React.FC<{text: string; sub?: string; col: string; t: number; x?: number; y?: number; rot?: number; size?: number}> = ({text, sub, col, t, x = 1110, y = 150, rot = -4, size = 62}) => {
	const p = t < 12 ? 2.2 - 1.2 * easeOut(t / 12) : 1;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${p})`, opacity: clamp01(t / 5), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 28px', borderRadius: 18, background: col, border: `5px solid ${INK}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)', zIndex: 6}}>
			<T size={size}>{text}</T>
			{sub && <span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: '#fff', whiteSpace: 'nowrap', textShadow: '0 2px 0 rgba(0,0,0,0.4)'}}>{sub}</span>}
		</div>
	);
};
const Bubble: React.FC<{x: number; y: number; text: string; p: number; tail: 'down' | 'left' | 'right'; size?: number}> = ({x, y, text, p, tail, size = 36}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(${tail === 'down' ? '-50%' : tail === 'right' ? '-100%' : '0'}, -100%) scale(${Math.max(0, p)})`, transformOrigin: tail === 'down' ? '50% 100%' : tail === 'right' ? '100% 100%' : '0% 100%', zIndex: 7}}>
		<div style={{position: 'relative', padding: '12px 22px', borderRadius: 20, background: '#fff', border: `5px solid ${INK}`, boxShadow: '0 7px 0 rgba(0,0,0,0.3)', fontFamily: LILITA, fontSize: size, color: INK, whiteSpace: 'nowrap'}}>
			{text}
			<svg width={44} height={30} style={{position: 'absolute', left: tail === 'down' ? 'calc(50% - 22px)' : tail === 'right' ? 'calc(100% - 70px)' : 26, bottom: -27}}><path d="M2 0 L22 26 L42 0" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><rect x={4} y={-6} width={36} height={8} fill="#fff" /></svg>
		</div>
	</div>
);
const PinM: React.FC<{x: number; y: number; text: string; p: number}> = ({x, y, text, p}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) scale(${Math.max(0, p)})`, transformOrigin: '50% 100%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3}}>
		<div style={{padding: '5px 14px', borderRadius: 12, background: '#1B1D26', border: '3px solid #fff', fontFamily: LILITA, fontSize: 26, color: '#fff', whiteSpace: 'nowrap', boxShadow: '0 4px 0 rgba(0,0,0,0.35)'}}>{text}</div>
		<svg width={18} height={10}><path d="M0 0 L9 10 L18 0Z" fill="#fff" /></svg>
	</div>
);
const Pill: React.FC<{children: React.ReactNode; p: number; x: number; y: number; bg?: string}> = ({children, p, x, y, bg = '#1B1D26'}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translateX(${(1 - p) * -700}px)`, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 20px', borderRadius: 16, background: bg, border: '3px solid #fff', boxShadow: '0 5px 0 rgba(0,0,0,0.35)', zIndex: 6}}>{children}</div>
);
const EuroCup: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size} viewBox="0 0 200 220">
		<path d="M62 18 H138 L132 120 Q100 150 68 120 Z" fill="#D9DEE8" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
		<path d="M62 30 Q30 40 40 80 Q48 104 70 110" fill="none" stroke={INK} strokeWidth={14} /><path d="M62 30 Q30 40 40 80 Q48 104 70 110" fill="none" stroke="#D9DEE8" strokeWidth={6} />
		<path d="M138 30 Q170 40 160 80 Q152 104 130 110" fill="none" stroke={INK} strokeWidth={14} /><path d="M138 30 Q170 40 160 80 Q152 104 130 110" fill="none" stroke="#D9DEE8" strokeWidth={6} />
		<rect x={86} y={136} width={28} height={36} fill="#B9C0CE" stroke={INK} strokeWidth={7} />
		<rect x={58} y={172} width={84} height={30} rx={6} fill="#8A93A6" stroke={INK} strokeWidth={7} />
	</svg>
);
const CupIcon: React.FC<{cup: Cup | 'CA' | 'FIN'; size: number}> = ({cup, size}) => (cup === 'WC' ? <Trophy size={size} /> : cup === 'EU' ? <EuroCup size={size} /> : <div style={{width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{transform: `scale(${size / 200})`, transformOrigin: 'center'}}><svg width={200} height={220} viewBox="0 0 200 220"><path d="M60 20 H140 L128 110 Q100 140 72 110 Z" fill={cup === 'CA' ? '#F2C14E' : '#C9A227'} stroke={INK} strokeWidth={8} /><circle cx={100} cy={64} r={20} fill="#fff" stroke={INK} strokeWidth={6} /><rect x={84} y={130} width={32} height={40} fill="#9C7A1E" stroke={INK} strokeWidth={7} /><rect x={56} y={170} width={88} height={32} rx={6} fill="#5A4410" stroke={INK} strokeWidth={7} /></svg></div></div>);

// Messi jersey (no face): a red or albiceleste shirt with MESSI 10
export const Jersey: React.FC<{size: number; kit: 'arg' | 'esp'; rot?: number}> = ({size, kit, rot = 0}) => (
	<svg width={size} height={size} viewBox="0 0 200 200" style={{transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
		<defs>
			<clipPath id={`js_${kit}`}><path d="M60 22 L84 14 Q100 30 116 14 L140 22 L182 52 L162 88 L146 78 L146 186 L54 186 L54 78 L38 88 L18 52 Z" /></clipPath>
		</defs>
		<path d="M60 22 L84 14 Q100 30 116 14 L140 22 L182 52 L162 88 L146 78 L146 186 L54 186 L54 78 L38 88 L18 52 Z" fill={kit === 'esp' ? ROJA : '#fff'} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
		{kit === 'arg' && <g clipPath="url(#js_arg)">{[0, 1, 2, 3].map((i) => <rect key={i} x={30 + i * 44} y={0} width={22} height={200} fill={CEL} />)}</g>}
		{kit === 'esp' && <g clipPath="url(#js_esp)"><rect x={0} y={170} width={200} height={20} fill={YEL} /><path d="M18 52 L38 88 L54 78" fill="none" stroke={YEL} strokeWidth={8} /><path d="M182 52 L162 88 L146 78" fill="none" stroke={YEL} strokeWidth={8} /></g>}
		<path d="M60 22 L84 14 Q100 30 116 14 L140 22 L182 52 L162 88 L146 78 L146 186 L54 186 L54 78 L38 88 L18 52 Z" fill="none" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
		<text x={100} y={74} textAnchor="middle" fontFamily="Lilita" fontSize={26} fill={kit === 'esp' ? YEL : INK} stroke={kit === 'esp' ? INK : '#fff'} strokeWidth={2} paintOrder="stroke">MESSI</text>
		<text x={100} y={150} textAnchor="middle" fontFamily="Lilita" fontSize={84} fill={kit === 'esp' ? YEL : INK} stroke={kit === 'esp' ? INK : '#fff'} strokeWidth={4} paintOrder="stroke">10</text>
	</svg>
);

// ================================================================ HERO sticker (Spain with Messi, or Argentina)
const HERO_LEFT = 70;
const heroGeom = (k: string) => {
	const b = WORLD[k].b; const HB = {x0: b[0][0], y0: b[0][1], x1: b[1][0], y1: b[1][1]};
	const HS = Math.min(380 / (HB.x1 - HB.x0), 520 / (HB.y1 - HB.y0));
	const W = (HB.x1 - HB.x0) * HS, H = (HB.y1 - HB.y0) * HS;
	return {HB, HS, W, H, top: 180 + (440 - H) / 2};
};
const heroEye = (k: string): [number, number] => { const g = heroGeom(k); return [HERO_LEFT + g.W * 0.5 + 80, g.top + g.H * (k === 'ARG' ? 0.28 : 0.45) - 6]; };
const Hero: React.FC<{k: string; f: number; mood: FaceMood; look: [number, number]; pop: number; glow?: string; talk?: number; jersey?: boolean}> = ({k, f, mood, look, pop, glow, talk = 0, jersey}) => {
	const g = heroGeom(k);
	const bob = Math.sin(f / 22) * 4;
	const blink = (() => { const ph = (f + 37) % 210; return ph < 8 ? Math.sin((ph / 8) * Math.PI) : 0; })();
	const FX = g.W * 0.5, FY = g.H * (k === 'ARG' ? 0.28 : 0.45), FS = k === 'ARG' ? 230 : 250;
	return (
		<div style={{position: 'absolute', left: HERO_LEFT - 40, top: g.top - 40, width: g.W + 80, height: g.H + 80, transform: `translateY(${bob}px) scale(${pop})`, transformOrigin: '50% 90%', zIndex: 4}}>
			{glow && <div style={{position: 'absolute', left: -80, top: -20, width: g.W + 240, height: g.H + 120, borderRadius: '45%', background: `radial-gradient(ellipse at 50% 40%, ${glow} 0%, rgba(0,0,0,0) 65%)`, opacity: 0.7}} />}
			<svg width={g.W + 80} height={g.H + 80} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				<defs><clipPath id={`hero16_${k}`}><path d={WORLD[k].d} /></clipPath></defs>
				<g transform={`translate(40 40) scale(${g.HS}) translate(${-g.HB.x0} ${-g.HB.y0})`}>
					<path d={WORLD[k].d} fill="#06142A" opacity={0.35} transform={`translate(${5 / g.HS} ${9 / g.HS})`} />
					<path d={WORLD[k].d} fill="none" stroke="#fff" strokeWidth={13 / g.HS} strokeLinejoin="round" />
					<g clipPath={`url(#hero16_${k})`}>
						<image href={staticFile(`flags/${FL[k]}.svg`)} x={g.HB.x0 - 2} y={g.HB.y0 - 2} width={g.HB.x1 - g.HB.x0 + 4} height={g.HB.y1 - g.HB.y0 + 4} preserveAspectRatio="none" />
						<image href={staticFile('tex/relief.jpg')} x={0} y={20} width={3830} height={1720} preserveAspectRatio="none" style={{mixBlendMode: 'multiply'}} />
					</g>
					<path d={WORLD[k].d} fill="none" stroke={INK} strokeWidth={4.5 / g.HS} strokeLinejoin="round" />
				</g>
			</svg>
			<svg width={FS} height={FS} viewBox="0 0 200 200" style={{position: 'absolute', left: 40 + FX - FS / 2, top: 40 + FY - FS / 2, overflow: 'visible'}}>
				<Face12 mood={mood} look={look} blink={blink} talk={talk} />
			</svg>
			{jersey && <div style={{position: 'absolute', left: g.W - 30, top: g.H - 70, transform: `rotate(${8 + Math.sin(f / 30) * 3}deg)`}}><Jersey size={130} kit="esp" /></div>}
			<div style={{position: 'absolute', left: 40 + g.W / 2 - 140, top: g.H + 40 + 6, width: 280, display: 'flex', justifyContent: 'center'}}>
				<div style={{padding: '4px 14px', borderRadius: 10, background: '#fff', border: `4px solid ${INK}`, fontFamily: LILITA, fontSize: 26, color: INK, whiteSpace: 'nowrap'}}>{k === 'ESP' ? (jersey ? 'ESPAÑA + MESSI' : 'ESPAÑA') : 'ARGENTINA SIN MESSI'}</div>
			</div>
		</div>
	);
};
const HeroSay: React.FC<{k: string; text: string; p: number}> = ({k, text, p}) => <Bubble x={heroEye(k)[0] + 70} y={heroEye(k)[1] - 30} text={text} p={p} tail="left" />;

const Footer: React.FC<{f: number}> = ({f}) => (
	<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 30, background: 'rgba(14,16,22,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.75)', zIndex: 9}}>
		{f < RULES0 ? 'Fuentes: FIFA, UEFA, CONMEBOL, AFA, LaLiga, FC Barcelona, Infobae, Goal · Messi con Argentina: 208 partidos y 126 goles (2005-2026)' : 'Simulación ficticia · Elo calculado con todos los partidos internacionales hasta octubre de 2026 · Resultados reales: FIFA, UEFA y CONMEBOL'}
	</div>
);

// trophy cabinet HUD (bottom-left)
const Cabinet: React.FC<{f: number; p: number}> = ({f, p}) => {
	const alt = ALT_TITLES.filter((x) => f >= x.f);
	const real = REAL_TITLES.filter((x) => { const s = tourSeg(x.id); return f >= s.from + verdictF(s); });
	const row = (label: string, items: {cup: Cup; id: string; f?: number; real?: boolean}[], col: string) => (
		<div style={{display: 'flex', alignItems: 'center', gap: 8, height: 54}}>
			<span style={{width: 132, fontFamily: LILITA, fontSize: 22, color: col}}>{label}</span>
			{items.map((x) => <div key={x.id} style={{transform: `scale(${x.f ? backOut((f - x.f) / 14) : 1})`, filter: x.real === false ? 'drop-shadow(0 0 8px rgba(255,214,90,0.95))' : undefined}}><CupIcon cup={x.cup} size={46} /></div>)}
			<span style={{marginLeft: 'auto', fontFamily: LILITA, fontSize: 34, color: '#fff'}}>{items.length}</span>
		</div>
	);
	return (
		<div style={{position: 'absolute', left: 20, bottom: 44, width: 470, transform: `translateX(${(1 - p) * -560}px)`, zIndex: 6}}>
			<Dark col={YEL} style={{padding: '8px 14px'}}>
				<div style={{fontFamily: LILITA, fontSize: 24, color: YEL, marginBottom: 2}}>VITRINA DE ESPAÑA (desde 2006)</div>
				{row('REALIDAD', real, '#C9CFDA')}
				{row('CON MESSI', alt, YEL)}
			</Dark>
		</div>
	);
};

// ================================================================ CTA
const CTA_OV: number[] = (() => {
	const xs: number[] = [];
	const a = tourSeg('WC2014'); xs.push(a.from + a.mt[2] + 40);
	const b = tourSeg('WC2018'); xs.push(b.from + b.mt[2] + 40);
	const c = SEGS.find((s) => s.kind === 'atitle' && s.i === 2); if (c) xs.push(c.from + 60);
	xs.push(FIN0 + 1300);
	return xs;
})();
const SubButton: React.FC<{u: number; at: number; s?: number}> = ({u, at: a, s = 1}) => {
	const click = u >= a;
	const press = u >= a - 4 && u < a + 6;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 14 * s, position: 'relative'}}>
			<div style={{padding: `${10 * s}px ${26 * s}px`, borderRadius: 12 * s, background: click ? '#3A3A3A' : '#E1251B', border: `${4 * s}px solid ${INK}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 30 * s, color: '#fff', boxShadow: '0 6px 0 rgba(0,0,0,0.35)', transform: `scale(${press ? 0.9 : 1})`}}>{click ? 'SUSCRITO' : 'SUSCRÍBETE'}</div>
			<svg width={52 * s} height={52 * s} viewBox="0 0 24 24" style={{transform: `rotate(${click ? Math.sin((u - a) / 2.5) * 22 * Math.max(0, 1 - (u - a) / 50) : 0}deg)`}}>
				<path d="M12 2a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V8a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22z" fill="#FFD23F" stroke={INK} strokeWidth={1.3} />
			</svg>
			{u >= a - 30 && u < a + 20 && (
				<svg width={60 * s} height={60 * s} viewBox="0 0 24 24" style={{position: 'absolute', left: 120 * s, top: 30 * s, transform: `translate(${(1 - easeOut((u - a + 30) / 26)) * 120}px, ${(1 - easeOut((u - a + 30) / 26)) * 80}px)`}}>
					<path d="M5 2 L5 20 L9.5 15.5 L13 22 L16 20.5 L12.5 14 L19 14 Z" fill="#fff" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
				</svg>
			)}
		</div>
	);
};
const CtaBanner: React.FC<{u: number; y: number}> = ({u, y}) => {
	const p = backOut(u / 16) * (1 - easeInOut((u - 250) / 16));
	return (
		<div style={{position: 'absolute', right: 20, top: y, width: 560, transform: `translateX(${(1 - p) * 640}px)`, zIndex: 8}}>
			<div style={{borderRadius: 20, background: 'rgba(22,24,31,0.95)', border: '4px solid #E1251B', boxShadow: '0 8px 0 rgba(0,0,0,0.35)', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
					<MiniFace mood="happy" s={46} bg={ROJA} />
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
			<div style={{position: 'absolute', left: 600, width: 1120, top: 250, transform: `scale(${backOut((t - 10) / 16)})`}}>
				<Card style={{padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
					<T size={70} color={INK} stroke={0} shadow={0}>¿TE ESTÁ GUSTANDO EL VÍDEO?</T>
					<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: '#6B6250', textAlign: 'center'}}>Si quieres más "¿qué pasaría si...?", suscríbete y activa la campanita</div>
					<div style={{transform: 'scale(1.5)', margin: '20px 0'}}><SubButton u={t} at={210} /></div>
					<div style={{padding: '8px 22px', borderRadius: 14, background: '#1B1D26', border: '3px solid #fff', fontFamily: LILITA, fontSize: 32, color: '#fff', transform: `scale(${backOut((t - 150) / 12)})`}}>{g.next} →</div>
				</Card>
			</div>
		</AbsoluteFill>
	);
};

// ================================================================ HOOK: the phone call + VHS rewind
const Phone: React.FC<{f: number; ring: boolean}> = ({f, ring}) => {
	const sh = ring ? Math.sin(f * 1.9) * 7 : 0;
	return (
		<svg width={260} height={220} viewBox="0 0 260 220" style={{transform: `rotate(${sh}deg)`, overflow: 'visible'}}>
			<path d="M40 120 Q40 90 80 86 L180 86 Q220 90 220 120 L232 196 Q232 210 216 210 L44 210 Q28 210 28 196 Z" fill="#B3262E" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
			<circle cx={130} cy={150} r={40} fill="#F4E6C8" stroke={INK} strokeWidth={7} />
			{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => { const a = (i / 10) * Math.PI * 1.6 - Math.PI * 1.05; return <circle key={i} cx={130 + Math.cos(a) * 26} cy={150 + Math.sin(a) * 26} r={6} fill="#1B1D26" />; })}
			<g transform={`translate(0 ${ring ? -Math.abs(Math.sin(f * 0.9)) * 18 : 0})`}>
				<path d="M20 70 Q20 40 50 40 L210 40 Q240 40 240 70 L240 84 Q240 96 226 96 L196 96 Q186 96 186 84 L186 70 L74 70 L74 84 Q74 96 64 96 L34 96 Q20 96 20 84 Z" fill="#C93A42" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
			</g>
			{ring && [0, 1, 2].map((i) => <path key={i} d={`M${16 - i * 16} ${40 - i * 8} Q${-4 - i * 16} 60 ${16 - i * 16} 80`} fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 5 + i))} />)}
			{ring && [0, 1, 2].map((i) => <path key={'r' + i} d={`M${244 + i * 16} ${40 - i * 8} Q${264 + i * 16} 60 ${244 + i * 16} 80`} fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 5 + i))} />)}
		</svg>
	);
};
const Hook: React.FC<{f: number}> = ({f}) => {
	const out = easeInOut((f - HOOK + 14) / 14);
	const a = f < H_SPLIT, b = f >= H_SPLIT && f < H_VHS, c = f >= H_VHS && f < H_TEASE, d = f >= H_TEASE;
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 7}}>
			{a && (
				<AbsoluteFill>
					<div style={{position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', justifyContent: 'center'}}>
						<div style={{transform: `scale(${backOut((f - 6) / 12)}) rotate(-2deg)`}}><Dark col={YEL}><span style={{fontFamily: LILITA, fontSize: 52, color: YEL}}>BARCELONA · 2003</span></Dark></div>
					</div>
					<div style={{position: 'absolute', left: 300, top: 330, transform: `scale(${backOut((f - 14) / 14)})`}}><Phone f={f} ring={f < 250} /></div>
					<div style={{position: 'absolute', left: 290, top: 570, width: 300, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((f - 40) / 12)})`}}><div style={{padding: '6px 14px', borderRadius: 12, background: ROJA, border: `4px solid ${INK}`, fontFamily: LILITA, fontSize: 26, color: '#fff', textAlign: 'center', lineHeight: 1.1}}>LLAMA LA FEDERACIÓN<br />ESPAÑOLA DE FÚTBOL</div></div>
					<div style={{position: 'absolute', left: 1180, top: 270, transform: `scale(${backOut((f - 100) / 14)}) rotate(${Math.sin(f / 18) * 4}deg)`}}><Jersey size={420} kit="arg" /></div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center'}}>
						<div style={{transform: `scale(${backOut((f - 140) / 12)})`}}><T size={68}>Quieren a un chico de 16 años del Barça...</T></div>
					</div>
				</AbsoluteFill>
			)}
			{b && (() => {
				const u = f - H_SPLIT;
				const sl = easeOut(u / 24);
				const pick = u >= 170;
				return (
					<AbsoluteFill>
						<div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, transform: `translateX(${(1 - sl) * -960}px)`, opacity: pick ? 1 : 0.92}}>
							<img src={staticFile('flags/ar.svg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.1)'}} />
							<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.25), rgba(0,0,0,0))'}} />
						</div>
						<div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, transform: `translateX(${(1 - sl) * 960}px)`, filter: pick ? 'grayscale(0.85) brightness(0.6)' : undefined}}>
							<img src={staticFile('flags/es.svg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
						</div>
						<div style={{position: 'absolute', left: 955, top: 0, width: 10, height: 1080, background: INK}} />
						<div style={{position: 'absolute', left: 0, right: 0, top: 50, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((u - 20) / 12)})`}}><T size={74}>TUVO QUE ELEGIR...</T></div></div>
						<div style={{position: 'absolute', left: 0, width: 960, top: 800, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((u - 40) / 12)})`}}><T size={110}>ARGENTINA</T></div>
						<div style={{position: 'absolute', left: 960, width: 960, top: 800, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((u - 60) / 12)})`}}><T size={110}>ESPAÑA</T></div>
						<div style={{position: 'absolute', left: 960 - 170, top: 360, transform: `translateX(${pick ? -easeInOut((u - 170) / 20) * 470 : Math.sin(u / 6) * 40}px) scale(${0.8 + 0.2 * easeOut((u - 100) / 20)})`}}><Jersey size={340} kit="arg" /></div>
						{pick && <Stamp text="¡ELIGIÓ ARGENTINA!" col={CEL} t={u - 172} x={480} y={250} size={70} />}
					</AbsoluteFill>
				);
			})()}
			{c && (() => {
				const u = f - H_VHS;
				const jit = Math.sin(u * 3.1) * 6;
				const yr = Math.max(2004, Math.round(2026 - (22 * easeInOut(u / 140))));
				return (
					<AbsoluteFill style={{background: 'rgba(10,14,30,0.55)'}}>
						<AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0 2px, rgba(0,0,0,0) 2px 6px)', transform: `translateY(${(u * 9) % 6}px)`}} />
						{[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: ((u * 23 + i * 360) % 1200) - 60, height: 26, background: 'rgba(255,255,255,0.18)', filter: 'blur(3px)'}} />)}
						<div style={{position: 'absolute', left: 60, top: 50, fontFamily: 'monospace', fontWeight: 900, fontSize: 56, color: '#fff', textShadow: '3px 0 #ff2a6d, -3px 0 #05d9e8', transform: `translateX(${jit}px)`}}>◀◀ REBOBINANDO</div>
						<div style={{position: 'absolute', right: 70, top: 50, fontFamily: 'monospace', fontWeight: 900, fontSize: 56, color: '#fff', textShadow: '3px 0 #ff2a6d, -3px 0 #05d9e8'}}>{yr}</div>
						<div style={{position: 'absolute', left: 760, top: 300, transform: `translateX(${jit}px) scale(${u < 140 ? 1 : 1 + 0.15 * backOut((u - 140) / 12)})`}}><Jersey size={400} kit={u < 140 ? 'arg' : 'esp'} rot={u < 140 ? Math.sin(u / 2) * 8 : 0} /></div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((u - 150) / 12)}) rotate(-2deg)`}}><T size={92}>¿Y SI HUBIERA DICHO <span style={{color: YEL}}>QUE SÍ</span>?</T></div></div>
					</AbsoluteFill>
				);
			})()}
			{d && (() => {
				const u = f - H_TEASE;
				const spin = u < 120 ? 2 + Math.floor((u / 4) % 6) : 4;
				return (
					<AbsoluteFill>
						<div style={{position: 'absolute', left: 560, right: 20, top: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
							<div style={{transform: `scale(${backOut((u - 10) / 12)}) rotate(-2deg)`}}><T size={78}>¿Qué pasaría si <span style={{color: YEL}}>MESSI</span></T></div>
							<div style={{transform: `scale(${backOut((u - 26) / 12)}) rotate(-2deg)`}}><T size={96}>hubiera jugado con <span style={{color: '#FF5A5F'}}>ESPAÑA</span>?</T></div>
						</div>
						<div style={{position: 'absolute', left: 600, top: 330, width: 560, transform: `scale(${backOut((u - 40) / 12)}) rotate(-3deg)`}}>
							<Card style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
								<span style={{fontFamily: LILITA, fontSize: 38, color: INK}}>¿CUÁNTOS MUNDIALES?</span>
								<div style={{display: 'flex', alignItems: 'center', gap: 14}}><Trophy size={110} /><span style={{fontFamily: LILITA, fontSize: 140, color: ROJA, WebkitTextStroke: `5px ${INK}`, paintOrder: 'stroke fill'}}>{u < 120 ? spin : '?'}</span></div>
							</Card>
						</div>
						<div style={{position: 'absolute', left: 1240, top: 360, width: 560, transform: `scale(${backOut((u - 170) / 12)}) rotate(3deg)`}}>
							<Card style={{display: 'flex', alignItems: 'center', gap: 16}}>
								<MiniFace mood="sad" s={120} bg={CEL} />
								<div style={{display: 'flex', flexDirection: 'column'}}><span style={{fontFamily: LILITA, fontSize: 40, color: INK}}>¿Y ARGENTINA</span><span style={{fontFamily: LILITA, fontSize: 40, color: '#2E7FC2'}}>SIN MESSI?</span></div>
							</Card>
						</div>
						<div style={{position: 'absolute', left: 560, right: 20, top: 720, display: 'flex', justifyContent: 'center', gap: 20}}>
							{[['11', 'TORNEOS'], ['10.000', 'SIMULACIONES'], ['1', 'DECISIÓN']].map(([n, l], i) => (
								<div key={l} style={{transform: `scale(${backOut((u - 290 - i * 14) / 10)})`, display: 'flex', alignItems: 'baseline', gap: 10, padding: '10px 22px', borderRadius: 16, background: '#fff', border: `5px solid ${INK}`}}>
									<T size={56} color={i === 2 ? ROJA : INK} stroke={0} shadow={0}>{n}</T><span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#6B6250'}}>{l}</span>
								</div>
							))}
						</div>
						{u >= 360 && <div style={{position: 'absolute', left: 560, right: 20, top: 880, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((u - 360) / 12)})`, padding: '8px 22px', borderRadius: 14, background: ROJA, border: `4px solid ${INK}`}}><T size={44}>EL RESULTADO TE VA A SORPRENDER</T></div></div>}
					</AbsoluteFill>
				);
			})()}
		</AbsoluteFill>
	);
};

// ================================================================ STORY
const Arc: React.FC<{a: [number, number]; b: [number, number]; p: number; col?: string}> = ({a, b, p, col = '#fff'}) => {
	if (p <= 0) return null;
	const [ax, ay] = a, [bx, by] = b;
	const mx = (ax + bx) / 2, my = Math.min(ay, by) - Math.max(90, Math.abs(bx - ax) * 0.3);
	const pts: [number, number][] = [];
	for (let i = 0; i <= 80 * p; i++) { const t = i / 80; pts.push([(1 - t) * (1 - t) * ax + 2 * (1 - t) * t * mx + t * t * bx, (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * my + t * t * by]); }
	const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
	const [hx, hy] = pts[pts.length - 1];
	const [px, py] = pts[Math.max(0, pts.length - 3)];
	const ang = (Math.atan2(hy - py, hx - px) * 180) / Math.PI;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', zIndex: 2}}>
			<path d={d} fill="none" stroke={INK} strokeWidth={12} strokeLinecap="round" strokeDasharray="20 14" />
			<path d={d} fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" strokeDasharray="20 14" />
			{p < 1 && <g transform={`translate(${hx} ${hy}) rotate(${ang})`}><path d="M18 0 L-14 -12 L-8 0 L-14 12 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" /><path d="M2 0 L-6 -22 L-12 -20 L-6 0 L-12 20 L-6 22 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" /></g>}
		</svg>
	);
};
const Fact: React.FC<{u: number; date: string; title: string; text: React.ReactNode; col?: string; x?: number; y?: number; w?: number}> = ({u, date, title, text, col = YEL, x = 560, y = 640, w = 1300}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, transform: `translateY(${(1 - easeOut(u / 18)) * 400}px)`, opacity: clamp01(u / 10), zIndex: 5}}>
		<Card style={{display: 'flex', gap: 20, alignItems: 'center'}}>
			<div style={{padding: '8px 16px', borderRadius: 14, background: col, border: `4px solid ${INK}`, fontFamily: LILITA, fontSize: 34, color: INK, whiteSpace: 'nowrap'}}>{date}</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
				<span style={{fontFamily: LILITA, fontSize: 40, color: INK}}>{title}</span>
				<span style={{fontFamily: RUBIK, fontWeight: 700, fontSize: 26, color: '#4E4636'}}>{text}</span>
			</div>
		</Card>
	</div>
);
const Story: React.FC<{t: number; cam: WCam}> = ({t, cam}) => {
	const ro = toScreen(cam, ...CITY.ROSARIO), bcn = toScreen(cam, ...CITY.BARCELONA), ba = toScreen(cam, ...CITY.BAIRES), bud = toScreen(cam, ...CITY.BUDAPEST);
	const win = (a: number, b: number) => clamp01((t - a) / 12) * (1 - clamp01((t - b) / 12));
	return (
		<AbsoluteFill>
			<Pill p={easeOut((t - 10) / 20) * (1 - easeInOut((t - 3520) / 20))} x={22} y={20}><span style={{fontFamily: LILITA, fontSize: 32, color: '#fff'}}>LA HISTORIA REAL</span></Pill>
			{t < 900 && (
				<>
					{t >= 40 && <PinM x={ro[0]} y={ro[1] - 8} text="ROSARIO" p={backOut((t - 40) / 12) * (1 - easeInOut((t - 880) / 12))} />}
					<Arc a={ro} b={bcn} p={easeInOut((t - 330) / 220) * (1 - easeInOut((t - 880) / 12))} col={YEL} />
					{t >= 560 && <PinM x={bcn[0]} y={bcn[1] - 8} text="BARCELONA" p={backOut((t - 560) / 12) * (1 - easeInOut((t - 880) / 12))} />}
					{t >= 60 && t < 330 && <div style={{opacity: win(60, 320)}}><Fact u={t - 60} date="24/06/1987" title="Nace Lionel Messi en Rosario" text="Juega en las inferiores de Newell's Old Boys" /></div>}
					{t >= 600 && <div style={{opacity: win(600, 880)}}><Fact u={t - 600} date="14/12/2000" title="El Barça le ficha... ¡en una servilleta!" text="Con 13 años, se muda con su familia a Barcelona" /></div>}
				</>
			)}
			{t >= 900 && t < 1800 && (
				<>
					{t >= 1000 && <Stamp text="¡ESPAÑA LE QUIERE!" col={ROJA} t={t - 1000} x={1160} y={150} size={70} />}
					{t >= 1200 && <div style={{opacity: win(1200, 1490)}}><Fact u={t - 1200} date="2003" title="La Federación Española intenta convocarle" text="Le quiere para su selección sub-17... y ser español por residencia" col="#FF8A8A" /></div>}
					{t >= 1500 && <div style={{opacity: win(1500, 1790)}}><Fact u={t - 1500} date="NO" title="Messi y su familia dicen que no" text={<span>«Nunca hubiera elegido jugar para España porque soy argentino» <i>(Messi, 2014)</i></span>} col={CEL} /></div>}
				</>
			)}
			{t >= 1800 && t < 2700 && (
				<>
					{t >= 1980 && <PinM x={ba[0]} y={ba[1] - 8} text="BUENOS AIRES" p={backOut((t - 1980) / 12) * (1 - easeInOut((t - 2680) / 12))} />}
					{t >= 2160 && <div style={{opacity: win(2160, 2690)}}><Fact u={t - 2160} date="29/06/2004" title="Argentina monta un amistoso sub-20 para tenerle ya" text="Contra Paraguay: gana 8-0... y Messi marca un gol" col={CEL} /></div>}
					{t >= 2400 && <Stamp text="¡ES ARGENTINO!" col={CEL} t={t - 2400} x={1160} y={150} size={70} />}
				</>
			)}
			{t >= 2700 && t < 3400 && (
				<>
					{t >= 2880 && <PinM x={bud[0]} y={bud[1] - 8} text="BUDAPEST" p={backOut((t - 2880) / 12) * (1 - easeInOut((t - 3380) / 12))} />}
					{t >= 2900 && <div style={{opacity: win(2900, 3390)}}><Fact u={t - 2900} date="17/08/2005" title="Debut con la absoluta: Hungría 1-2 Argentina" text="Entra en la segunda parte... y le expulsan nada más entrar" col={CEL} /></div>}
					{t >= 3080 && <Stamp text="¡ROJA EN SU DEBUT!" col="#E8394A" t={t - 3080} x={1160} y={150} size={64} />}
				</>
			)}
			{t >= 3400 && (() => {
				const u = t - 3400;
				const titles: [string, 'CA' | 'FIN' | 'WC'][] = [['COPA AMÉRICA 2021', 'CA'], ['FINALISSIMA 2022', 'FIN'], ['MUNDIAL 2022', 'WC'], ['COPA AMÉRICA 2024', 'CA']];
				return (
					<AbsoluteFill style={{opacity: 1 - easeInOut((t - STORY + 24) / 20)}}>
						<AbsoluteFill style={{background: 'rgba(5,10,25,0.35)', opacity: easeOut(u / 20)}} />
						<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((u - 10) / 12)})`}}><T size={62}>MESSI CON ARGENTINA (2005-2026)</T></div></div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', gap: 30}}>
							{[[208, 'PARTIDOS', 100], [126, 'GOLES', 180], [4, 'TÍTULOS', 260]].map(([n, l, s]) => (
								<div key={l as string} style={{transform: `scale(${backOut((u - (s as number)) / 12)})`}}>
									<Dark col={YEL} style={{padding: '14px 34px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
										<span style={{fontFamily: LILITA, fontSize: 110, color: YEL, lineHeight: 1}}>{Math.round((n as number) * easeOut((u - (s as number)) / 60))}</span>
										<span style={{fontFamily: LILITA, fontSize: 34, color: '#fff'}}>{l}</span>
									</Dark>
								</div>
							))}
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 480, display: 'flex', justifyContent: 'center', gap: 22}}>
							{titles.map(([l, c], i) => (
								<div key={l} style={{transform: `translateY(${(1 - backOut((u - 320 - i * 40) / 12)) * 500}px)`}}>
									<Card style={{width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 10px'}}><CupIcon cup={c} size={120} /><span style={{fontFamily: LILITA, fontSize: 26, color: INK, textAlign: 'center'}}>{l}</span></Card>
								</div>
							))}
						</div>
						{u >= 520 && <div style={{position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((u - 520) / 12)})`}}><Dark><span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: '#fff'}}>Y subcampeón del Mundial 2026: perdió la final... <span style={{color: '#FF5A5F'}}>¡contra España!</span> (1-0)</span></Dark></div></div>}
						{u >= 640 && <div style={{position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((u - 640) / 12)}) rotate(-2deg)`}}><T size={60}>Pero... ¿y si hubiera elegido <span style={{color: '#FF5A5F'}}>ESPAÑA</span>?</T></div></div>}
					</AbsoluteFill>
				);
			})()}
		</AbsoluteFill>
	);
};

// ================================================================ RULES
const Rules: React.FC<{t: number}> = ({t}) => {
	const out = easeInOut((t - RULES + 30) / 20);
	const rules = [
		['1', 'Messi juega con España desde el Mundial 2006'],
		['2', 'Lo que España ganó sin él, se queda igual'],
		['3', 'Messi entra en el partido en que España cayó y se rejuega: si gana, hereda el camino de quien la eliminó'],
		['4', 'Cada partido se decide con el ranking Elo real de ese momento'],
	];
	const bars = TOURS.map((tr) => ({l: tr.id.slice(2), v: tr.kind === 'real' ? FEAT.esp[tr.id]?.boost ?? null : FEAT.esp[tr.id].boost}));
	const B: Record<string, number> = {WC2006: 50, EU2008: 100, WC2010: 120, EU2012: 140, WC2014: 130, EU2016: 120, WC2018: 100, EU2020: 90, WC2022: 110, EU2024: 60, WC2026: 70};
	void bars;
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 6}}>
			<AbsoluteFill style={{background: 'rgba(5,10,25,0.3)', opacity: easeOut(t / 16)}} />
			<div style={{position: 'absolute', left: 520, right: 20, top: 30, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((t - 10) / 12)})`}}><T size={60}>ASÍ LO HEMOS SIMULADO</T></div></div>
			<div style={{position: 'absolute', left: 520, width: 760, top: 130, display: 'flex', flexDirection: 'column', gap: 14}}>
				{rules.map(([n, txt], i) => (
					<div key={n} style={{transform: `translateX(${(1 - easeOut((t - 110 - i * 110) / 16)) * -1200}px)`}}>
						<Card style={{display: 'flex', alignItems: 'center', gap: 16, padding: '12px 18px'}}>
							<span style={{width: 56, height: 56, borderRadius: 28, background: ROJA, border: `4px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 34, color: '#fff', flexShrink: 0}}>{n}</span>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 26, color: INK}}>{txt}</span>
						</Card>
					</div>
				))}
			</div>
			<div style={{position: 'absolute', left: 1310, width: 590, top: 130, opacity: clamp01((t - 560) / 14), transform: `translateY(${(1 - easeOut((t - 560) / 18)) * 300}px)`}}>
				<Card style={{padding: '12px 16px'}}>
					<div style={{fontFamily: LILITA, fontSize: 30, color: INK, textAlign: 'center'}}>LO QUE SUMA MESSI</div>
					<div style={{fontFamily: RUBIK, fontWeight: 700, fontSize: 18, color: '#7A6E57', textAlign: 'center', marginBottom: 8}}>Puntos Elo extra para España, según su edad (estimación)</div>
					<div style={{display: 'flex', alignItems: 'flex-end', gap: 6, height: 300}}>
						{TOURS.map((tr, i) => {
							const v = B[tr.id]; const p = easeOut((t - 600 - i * 14) / 24);
							return (
								<div key={tr.id} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
									<span style={{fontFamily: LILITA, fontSize: 18, color: INK, opacity: p}}>+{v}</span>
									<div style={{width: '100%', height: (v / 140) * 220 * p, borderRadius: '8px 8px 0 0', background: tr.cup === 'WC' ? YEL : '#9AA3B5', border: `3px solid ${INK}`, borderBottom: 'none'}} />
									<span style={{fontFamily: LILITA, fontSize: 16, color: INK}}>{`'${tr.id.slice(4)}`}</span>
								</div>
							);
						})}
					</div>
					<div style={{display: 'flex', justifyContent: 'center', gap: 18, marginTop: 8, fontFamily: RUBIK, fontWeight: 800, fontSize: 16, color: INK}}><span><span style={{color: '#C99A00'}}>■</span> Mundial</span><span><span style={{color: '#7C869A'}}>■</span> Eurocopa</span><span>Máx: +140 (Euro 2012)</span></div>
				</Card>
			</div>
			{t >= 900 && <div style={{position: 'absolute', left: 520, right: 20, top: 780, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((t - 900) / 12)})`}}><Dark col={YEL}><span style={{fontFamily: LILITA, fontSize: 40, color: '#fff'}}>Y cada torneo, <span style={{color: YEL}}>10.000 veces</span>, para calcular sus opciones</span></Dark></div></div>}
		</AbsoluteFill>
	);
};

// ================================================================ TOURNAMENT
const MatchCard: React.FC<{m: FMatch; u: number; small?: boolean}> = ({m, u, small}) => {
	const sp = easeOut((u - 60) / 150);
	const a = Math.min(m.sc[0], Math.floor(m.sc[0] * sp + 0.0001)), b = Math.min(m.sc[1], Math.floor(m.sc[1] * sp + 0.0001));
	const done = u >= 240;
	const col = done ? (m.win ? GREEN : '#E8394A') : INK;
	const h = small ? 74 : 96;
	return (
		<div style={{transform: `translateX(${(1 - easeOut(u / 18)) * 900}px)`, opacity: clamp01(u / 8)}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 12, height: h, padding: '0 14px', borderRadius: 16, background: CREAM, border: `4px solid ${col}`, boxShadow: `0 0 0 ${done ? 3 : 0}px ${INK}, 0 6px 0 rgba(0,0,0,0.35)`}}>
				<span style={{width: small ? 110 : 140, fontFamily: LILITA, fontSize: small ? 20 : 24, color: '#7A6E57'}}>{m.round}</span>
				<Flag k="ESP" w={small ? 52 : 66} />
				<span style={{fontFamily: LILITA, fontSize: small ? 48 : 62, color: INK, width: small ? 120 : 150, textAlign: 'center'}}>{a} - {b}</span>
				<Flag k={m.opp} w={small ? 52 : 66} />
				<span style={{flex: 1, fontFamily: RUBIK, fontWeight: 800, fontSize: small ? 20 : 24, color: INK, whiteSpace: 'nowrap', overflow: 'hidden'}}>{nm(m.opp)}</span>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2}}>
					{(m.et || m.pens) && u >= 200 && <span style={{padding: '1px 8px', borderRadius: 8, background: '#1B1D26', fontFamily: RUBIK, fontWeight: 800, fontSize: 15, color: '#fff'}}>{m.pens ? `penaltis ${m.pens[0]}-${m.pens[1]}` : 'prórroga'}</span>}
					{m.messi > 0 && u >= 260 && <span style={{display: 'flex', alignItems: 'center', gap: 4, transform: `scale(${backOut((u - 260) / 10)})`}}>{Array.from({length: m.messi}).map((_, i) => <span key={i} style={{fontSize: small ? 18 : 22}}>⚽</span>)}<span style={{fontFamily: LILITA, fontSize: small ? 18 : 22, color: ROJA}}>MESSI</span></span>}
				</div>
			</div>
		</div>
	);
};
const ProbBar: React.FC<{m: FMatch; u: number}> = ({m, u}) => {
	const p = easeOut((u - 100) / 60);
	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: 6, opacity: clamp01((u - 90) / 10)}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
				<span style={{width: 200, fontFamily: LILITA, fontSize: 24, color: YEL}}>CON MESSI</span>
				<div style={{flex: 1, height: 26, borderRadius: 10, background: 'rgba(255,255,255,0.15)', border: '3px solid #fff', overflow: 'hidden'}}><div style={{width: `${m.p * 100 * p}%`, height: '100%', background: YEL}} /></div>
				<span style={{width: 110, textAlign: 'right', fontFamily: LILITA, fontSize: 28, color: YEL}}>{pct(m.p * p)}%</span>
			</div>
			{m.p0 !== undefined && (
				<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
					<span style={{width: 200, fontFamily: LILITA, fontSize: 24, color: '#C9CFDA'}}>SIN MESSI</span>
					<div style={{flex: 1, height: 26, borderRadius: 10, background: 'rgba(255,255,255,0.15)', border: '3px solid #fff', overflow: 'hidden'}}><div style={{width: `${m.p0 * 100 * p}%`, height: '100%', background: '#9AA3B5'}} /></div>
					<span style={{width: 110, textAlign: 'right', fontFamily: LILITA, fontSize: 28, color: '#C9CFDA'}}>{pct(m.p0 * p)}%</span>
				</div>
			)}
			<span style={{fontFamily: RUBIK, fontWeight: 700, fontSize: 17, color: 'rgba(255,255,255,0.7)'}}>Probabilidad de que España gane este partido</span>
		</div>
	);
};
const TourScene: React.FC<{s: Extract<Seg, {kind: 'tour'}>; t: number; f: number}> = ({s, t, f}) => {
	const tr = s.tr;
	const out = easeInOut((t - s.dur + 26) / 18);
	const head = easeOut((t - 6) / 20) * (1 - out);
	const sim = simOf('ESP', tr.id);
	if (tr.kind === 'real') {
		return (
			<AbsoluteFill style={{zIndex: 6}}>
				<Pill p={head} x={22} y={20}><CupIcon cup={tr.cup} size={44} /><span style={{fontFamily: LILITA, fontSize: 34, color: '#fff'}}>{tr.label}</span><span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: 'rgba(255,255,255,0.75)'}}>{tr.hostName}</span></Pill>
				<Pill p={head} x={22} y={88} bg={ROJA}><span style={{fontFamily: LILITA, fontSize: 26, color: '#fff'}}>MESSI: {tr.age} AÑOS</span></Pill>
				{t >= 120 && <Stamp text={tr.cup === 'WC' ? '¡CAMPEONA DEL MUNDO!' : '¡CAMPEONA DE EUROPA!'} sub="Igual que en la realidad" col={YEL} t={t - 120} x={1180} y={180} size={64} />}
				{t >= 120 && t < 200 && <Confetti f={t} start={120} n={90} />}
				<div style={{position: 'absolute', left: 620, width: 1120, top: 330, opacity: clamp01((t - 160) / 12) * (1 - out), transform: `translateY(${(1 - easeOut((t - 160) / 16)) * 300}px)`}}>
					<Dark col={YEL} style={{display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 24px'}}>
						<span style={{fontFamily: LILITA, fontSize: 36, color: '#fff'}}>{tr.real}</span>
						{t >= 300 && <span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 28, color: 'rgba(255,255,255,0.85)', opacity: clamp01((t - 300) / 12)}}>Con Messi, sus opciones de ganarla pasaban del <span style={{color: '#C9CFDA'}}>{pct(sim.base_champ)}%</span> al <span style={{color: YEL}}>{pct(sim.champ)}%</span></span>}
					</Dark>
				</div>
			</AbsoluteFill>
		);
	}
	const F = FEAT.esp[tr.id];
	const ms = F.matches;
	const vF = s.dur - T_OUT + 20;
	const j = s.mt.reduce((acc, x, i) => (t >= x ? i : acc), -1);
	const small = ms.length > 4;
	const lastLoss = ms.find((m) => !m.win);
	const vt = F.champ ? (tr.cup === 'WC' ? '¡CAMPEONA DEL MUNDO!' : '¡CAMPEONA DE EUROPA!') : `ELIMINADA EN ${lastLoss!.round}`;
	return (
		<AbsoluteFill style={{zIndex: 6}}>
			<Pill p={head} x={22} y={20}><CupIcon cup={tr.cup} size={44} /><span style={{fontFamily: LILITA, fontSize: 34, color: '#fff'}}>{tr.label}</span><span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: 'rgba(255,255,255,0.75)'}}>{tr.hostName}</span></Pill>
			<Pill p={head} x={22} y={88} bg={ROJA}><span style={{fontFamily: LILITA, fontSize: 26, color: '#fff'}}>MESSI: {tr.age} AÑOS · +{F.boost} ELO</span></Pill>
			{/* reality card */}
			<div style={{position: 'absolute', left: 620, width: 1180, top: 24, opacity: clamp01((t - 30) / 12) * (1 - out), transform: `scale(${backOut((t - 30) / 14)})`}}>
				<Dark col="#E8394A" style={{display: 'flex', alignItems: 'center', gap: 16, padding: '10px 18px'}}>
					<span style={{padding: '4px 12px', borderRadius: 10, background: '#E8394A', border: `3px solid ${INK}`, fontFamily: LILITA, fontSize: 26, color: '#fff'}}>REALIDAD</span>
					<span style={{fontFamily: LILITA, fontSize: 32, color: '#fff'}}>{tr.real}</span>
				</Dark>
			</div>
			{t >= 150 && t < T_IN + 30 && <Stamp text="¡AHORA, CON MESSI!" col={YEL} t={t - 150} x={1180} y={330} size={70} />}
			{/* match ladder */}
			<div style={{position: 'absolute', left: 620, width: 1180, top: 130, display: 'flex', flexDirection: 'column', gap: small ? 8 : 14, opacity: 1 - out}}>
				{ms.map((m, i) => (t >= s.mt[i] ? <MatchCard key={i} m={m} u={t - s.mt[i]} small={small} /> : null))}
			</div>
			{j >= 0 && t < vF - 10 && (() => {
				const m = ms[j]; const u = t - s.mt[j];
				return (
					<div style={{position: 'absolute', left: 620, width: 1180, top: small ? 730 : 700, opacity: (1 - easeInOut((u - (m.round.startsWith('GRUPO') ? T_G : T_M) + 30) / 12))}}>
						<Dark col={YEL} style={{padding: '12px 20px'}}><ProbBar m={m} u={u} />{m.real && u >= 160 && <div style={{marginTop: 6, fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: '#FF8A8A', opacity: clamp01((u - 160) / 10)}}>En la realidad: España {m.real[0]}-{m.real[1]} {nm(m.opp)}</div>}</Dark>
					</div>
				);
			})()}
			{t >= vF && <Stamp text={vt} sub={`Probabilidad de título con Messi: ${pct(F.champ_p)}%`} col={F.champ ? YEL : '#E8394A'} t={t - vF} x={1210} y={small ? 790 : 720} size={58} />}
			{F.champ && t >= vF && t < vF + 200 && <Confetti f={t} start={vF} n={140} />}
		</AbsoluteFill>
	);
};

// ================================================================ ARGENTINA WITHOUT MESSI
const ArgIntro: React.FC<{t: number}> = ({t}) => {
	const out = easeInOut((t - ARG_IN + 26) / 18);
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 6}}>
			<div style={{position: 'absolute', left: 560, right: 20, top: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
				<div style={{transform: `scale(${backOut((t - 20) / 12)}) rotate(-2deg)`}}><T size={90}>¿Y ARGENTINA...</T></div>
				<div style={{transform: `scale(${backOut((t - 50) / 12)}) rotate(-2deg)`}}><T size={110} color={CEL}>SIN MESSI?</T></div>
			</div>
			<div style={{position: 'absolute', left: 580, right: 40, top: 400, display: 'flex', justifyContent: 'center', gap: 20}}>
				{ATITLES.map((a, i) => (
					<div key={a.id} style={{transform: `translateY(${(1 - backOut((t - 160 - i * 40) / 12)) * 500}px)`}}>
						<Card style={{width: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 10px'}}>
							<CupIcon cup={a.id.startsWith('CA') ? 'CA' : a.id.startsWith('FIN') ? 'FIN' : 'WC'} size={110} />
							<span style={{fontFamily: LILITA, fontSize: 26, color: INK, textAlign: 'center'}}>{a.label}</span>
						</Card>
					</div>
				))}
			</div>
			{t >= 320 && <div style={{position: 'absolute', left: 560, right: 20, top: 780, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((t - 320) / 12)})`}}><Dark><span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: '#fff'}}>¿Cuántos de sus 4 títulos habría ganado sin él?</span></Dark></div></div>}
		</AbsoluteFill>
	);
};
const ATitleScene: React.FC<{i: number; t: number}> = ({i, t}) => {
	const a = ATITLES[i];
	const out = easeInOut((t - ARG_T + 26) / 18);
	const p1 = easeOut((t - 240) / 80), p2 = easeOut((t - 360) / 80);
	const mx = Math.max(a.withP, a.withoutP);
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 6}}>
			<Pill p={easeOut((t - 6) / 20)} x={22} y={20} bg="#1B1D26"><CupIcon cup={a.id.startsWith('CA') ? 'CA' : a.id.startsWith('FIN') ? 'FIN' : 'WC'} size={44} /><span style={{fontFamily: LILITA, fontSize: 34, color: '#fff'}}>{a.label}</span></Pill>
			<div style={{position: 'absolute', left: 620, width: 1180, top: 40, transform: `scale(${backOut((t - 30) / 14)})`}}>
				<Dark col={CEL} style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<span style={{padding: '4px 12px', borderRadius: 10, background: CEL, border: `3px solid ${INK}`, fontFamily: LILITA, fontSize: 26, color: INK}}>REALIDAD: CAMPEONA</span>
					<span style={{fontFamily: LILITA, fontSize: 32, color: '#fff'}}>{a.real}</span>
				</Dark>
			</div>
			<div style={{position: 'absolute', left: 620, width: 1180, top: 180, opacity: clamp01((t - 120) / 12), transform: `translateY(${(1 - easeOut((t - 120) / 16)) * 300}px)`}}>
				<Card style={{display: 'flex', flexDirection: 'column', gap: 18, padding: '20px 26px'}}>
					<span style={{fontFamily: LILITA, fontSize: 34, color: INK}}>PROBABILIDAD DE SER CAMPEONA (antes del torneo)</span>
					{[['CON MESSI', a.withP, p1, CEL], ['SIN MESSI', a.withoutP, p2, '#9AA3B5']].map(([l, v, p, c]) => (
						<div key={l as string} style={{display: 'flex', alignItems: 'center', gap: 14}}>
							<span style={{width: 220, fontFamily: LILITA, fontSize: 32, color: INK}}>{l as string}</span>
							<div style={{flex: 1, height: 52, borderRadius: 14, background: '#E6DCC6', border: `4px solid ${INK}`, overflow: 'hidden'}}><div style={{width: `${((v as number) / mx) * 100 * (p as number)}%`, height: '100%', background: c as string}} /></div>
							<span style={{width: 150, textAlign: 'right', fontFamily: LILITA, fontSize: 46, color: INK}}>{pct((v as number) * (p as number))}%</span>
						</div>
					))}
					{t >= 470 && <span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 26, color: '#6B6250', opacity: clamp01((t - 470) / 12)}}>Sin Messi, sus opciones caen un {Math.round((1 - a.withoutP / a.withP) * 100)}%</span>}
				</Card>
			</div>
			{t >= 600 && <Stamp text={a.verdict} col={a.keeps ? GREEN : '#E8394A'} t={t - 600} x={1210} y={720} size={52} />}
		</AbsoluteFill>
	);
};
const ArgSum: React.FC<{t: number}> = ({t}) => {
	const out = easeInOut((t - ARG_SUM + 26) / 18);
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 6}}>
			<div style={{position: 'absolute', left: 560, right: 20, top: 60, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((t - 10) / 12)})`}}><T size={64}>ARGENTINA SIN MESSI</T></div></div>
			<div style={{position: 'absolute', left: 580, right: 40, top: 220, display: 'flex', justifyContent: 'center', gap: 20}}>
				{ATITLES.map((a, i) => (
					<div key={a.id} style={{transform: `scale(${backOut((t - 80 - i * 40) / 12)})`, opacity: a.keeps ? 1 : 0.55}}>
						<Card col={a.keeps ? GREEN : '#E8394A'} style={{width: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 10px', filter: a.keeps ? undefined : 'grayscale(0.8)'}}>
							<CupIcon cup={a.id.startsWith('CA') ? 'CA' : a.id.startsWith('FIN') ? 'FIN' : 'WC'} size={110} />
							<span style={{fontFamily: LILITA, fontSize: 26, color: INK, textAlign: 'center'}}>{a.label}</span>
							<span style={{fontFamily: LILITA, fontSize: 30, color: a.keeps ? GREEN : '#E8394A'}}>{a.keeps ? 'LA GANA' : 'LA PIERDE'}</span>
						</Card>
					</div>
				))}
			</div>
			{t >= 300 && <Stamp text="DE 4 TÍTULOS... A 2" sub="Y adiós al Mundial 2022" col="#E8394A" t={t - 300} x={1210} y={700} size={64} />}
		</AbsoluteFill>
	);
};

// ================================================================ FINAL BALANCE
const Shelf: React.FC<{title: string; col: string; rows: {label: string; items: (Cup | 'CA' | 'FIN')[]; n: number; hl?: boolean}[]; t: number; t0: number}> = ({title, col, rows, t, t0}) => (
	<Card col={col} style={{display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 18px'}}>
		<span style={{fontFamily: LILITA, fontSize: 40, color: INK, textAlign: 'center'}}>{title}</span>
		{rows.map((r, ri) => (
			<div key={r.label} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 14, background: r.hl ? 'rgba(255,210,63,0.35)' : '#fff', border: `3px solid ${INK}`, opacity: clamp01((t - t0 - ri * 260) / 12)}}>
				<span style={{width: 150, fontFamily: LILITA, fontSize: 24, color: INK}}>{r.label}</span>
				<div style={{display: 'flex', gap: 2, flex: 1}}>{r.items.map((c, i) => <div key={i} style={{transform: `scale(${backOut((t - t0 - ri * 260 - 20 - i * 26) / 10)})`}}><CupIcon cup={c} size={58} /></div>)}</div>
				<span style={{fontFamily: LILITA, fontSize: 52, color: INK}}>{r.n}</span>
			</div>
		))}
	</Card>
);
const FinScene: React.FC<{t: number}> = ({t}) => {
	const out = easeInOut((t - FIN + 30) / 20);
	const phase2 = t >= 1250;
	return (
		<AbsoluteFill style={{opacity: 1 - out, zIndex: 6}}>
			<AbsoluteFill style={{background: 'rgba(5,10,25,0.35)', opacity: easeOut(t / 20)}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((t - 10) / 12)})`}}><T size={66}>EL BALANCE FINAL</T></div></div>
			{!phase2 && (
				<div style={{position: 'absolute', left: 140, right: 140, top: 140, display: 'flex', gap: 30, opacity: 1 - easeInOut((t - 1220) / 20)}}>
					<div style={{flex: 1, transform: `translateX(${(1 - easeOut((t - 40) / 20)) * -900}px)`}}>
						<Shelf title="ESPAÑA" col={ROJA} t={t} t0={140} rows={[
							{label: 'REALIDAD', items: ['WC', 'WC', 'EU', 'EU', 'EU'], n: 5},
							{label: 'CON MESSI', items: ['WC', 'WC', 'WC', 'WC', 'EU', 'EU', 'EU'], n: 7, hl: true},
						]} />
					</div>
					<div style={{flex: 1, transform: `translateX(${(1 - easeOut((t - 540) / 20)) * 900}px)`}}>
						<Shelf title="ARGENTINA" col={CEL} t={t} t0={640} rows={[
							{label: 'REALIDAD', items: ['WC', 'CA', 'CA', 'FIN'], n: 4},
							{label: 'SIN MESSI', items: ['CA', 'FIN'], n: 2, hl: true},
						]} />
					</div>
				</div>
			)}
			{!phase2 && t >= 420 && t < 1220 && <Stamp text="¡4 MUNDIALES!" sub="2010, 2014, 2018 y 2026" col={YEL} t={t - 420} x={560} y={640} size={66} />}
			{!phase2 && t >= 900 && t < 1220 && <Stamp text="¡SIN ESTRELLA EN QATAR!" col="#E8394A" t={t - 900} x={1360} y={640} size={52} rot={4} />}
			{phase2 && (
				<div style={{position: 'absolute', left: 560, width: 1300, top: 160, display: 'flex', flexDirection: 'column', gap: 16}}>
					{[
						['🏆', 'En nuestra simulación, España pasa de 5 a 7 títulos: 4 Mundiales y 3 Eurocopas'],
						['🎲', `De media en 10.000 simulaciones: ${(5 + Object.values(FEAT.esp).reduce((a, x) => a + (x.champ_p ?? 0), 0)).toFixed(1).replace('.', ',')} títulos para España (5 en la realidad)`],
						['🇦🇷', 'Argentina sin Messi conservaría de media 2,5 de sus 4 títulos'],
						['⚽', 'Y el Mundial 2022... probablemente nunca habría sido argentino'],
					].map(([ic, txt], i) => (
						<div key={i} style={{transform: `translateX(${(1 - easeOut((t - 1300 - i * 90) / 16)) * 1500}px)`}}>
							<Card style={{display: 'flex', alignItems: 'center', gap: 18, padding: '14px 22px'}}>
								<span style={{width: 70, height: 64, borderRadius: 14, background: i % 2 ? CEL : YEL, border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, flexShrink: 0}}>{ic}</span>
								<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: INK}}>{txt}</span>
							</Card>
						</div>
					))}
				</div>
			)}
			{phase2 && t >= 1800 && <div style={{position: 'absolute', left: 560, width: 1300, top: 820, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((t - 1800) / 12)}) rotate(-2deg)`}}><T size={56}>¿Crees que Messi eligió bien?</T></div></div>}
		</AbsoluteFill>
	);
};
const Outro: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill style={{zIndex: 6}}>
		<div style={{position: 'absolute', left: 520, right: 20, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
			<div style={{transform: `scale(${backOut((t - 20) / 14)})`, padding: '18px 34px', borderRadius: 24, background: `linear-gradient(90deg, ${ROJA}, #8E1B2B)`, border: `5px solid ${INK}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
				<T size={54}>¿Qué otro "qué pasaría si" quieres ver?</T>
			</div>
			<div style={{transform: `scale(${backOut((t - 80) / 12)})`, padding: '8px 20px', borderRadius: 14, background: '#fff', border: `4px solid ${INK}`, fontFamily: LILITA, fontSize: 34, color: INK}}>Déjalo en los comentarios ↓</div>
			<div style={{marginTop: 20}}><Subscribe f={t} start={230} /></div>
		</div>
		{t >= OUTRO - 40 && <AbsoluteFill style={{background: '#000', opacity: clamp01((t - OUTRO + 40) / 40)}} />}
	</AbsoluteFill>
);

// ================================================================ main
const ALL_FLAGS = Array.from(new Set(Object.values(FL)));
export const Video16: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS_CAM, f, 16);
	const seg = SEGS.find((s) => f >= s.from && f < s.from + s.dur)!;
	const t = f - seg.from;
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	const blinkOf = (k: string) => { const ph = (f + k.charCodeAt(0) * 7 + k.charCodeAt(1) * 3) % 240; return ph < 8 ? Math.sin((ph / 8) * Math.PI) : 0; };
	let heroK: string | null = null;
	let heroMood: FaceMood = 'happy';
	let heroLook: [number, number] = [0.8, -0.1];
	let heroGlow: string | undefined;
	let heroTalk = 0;
	let say: {text: string; a: number; b: number} | null = null;
	const talk = (a: number, b: number) => (t >= a && t < b ? Math.abs(Math.sin(t / 3.2)) : 0);
	if (seg.kind === 'hook') {
		fills.ESP = {flag: 'es', lift: f >= H_TEASE ? 0.8 : 0};
		if (f >= H_TEASE) faces.ESP = {mood: 'smug', size: 1.3, max: 200, blink: blinkOf('ESP'), pop: elastic((f - H_TEASE) / FPS)};
	} else if (seg.kind === 'story') {
		fills.ARG = {flag: 'ar'}; faces.ARG = {mood: t < 1800 ? 'happy' : t < 2700 ? 'love' : 'happy', size: 1, max: 140, blink: blinkOf('ARG')};
		fills.ESP = {flag: 'es', lift: t >= 1000 && t < 1800 ? 0.9 : 0};
		faces.ESP = {mood: t >= 1000 && t < 1500 ? 'love' : t >= 1500 && t < 1800 ? 'sad' : 'neutral', size: 1, max: 140, blink: blinkOf('ESP')};
		if (t >= 2700 && t < 3400) { fills.HUN = {flag: 'hu', lift: 0.8}; faces.HUN = {mood: t >= 3080 ? 'shock' : 'neutral', size: 1.2, max: 160, blink: blinkOf('HUN')}; }
	} else {
		heroK = 'ESP';
		fills.ESP = {flag: 'es'}; faces.ESP = {mood: 'happy', size: 0.9, max: 100, blink: blinkOf('ESP')};
		fills.ARG = {flag: 'ar'}; faces.ARG = {mood: 'neutral', size: 0.8, max: 90, blink: blinkOf('ARG')};
	}
	if (seg.kind === 'rules') { heroMood = 'smug'; say = {text: '¡Con el 10, imparable!', a: 980, b: RULES - 30}; }
	if (seg.kind === 'tour') {
		const tr = seg.tr;
		tr.host.forEach((k) => { if (k !== 'ESP') fills[k] = {flag: FL[k] ?? undefined, color: FL[k] ? undefined : '#E9D9A8', lift: 0.3}; });
		if (tr.kind === 'real') {
			heroMood = t >= 120 ? 'happy' : 'smug'; if (t >= 120) heroGlow = 'rgba(255,214,90,0.85)';
			say = {text: tr.say[0], a: 200, b: T_REAL - 30};
			if (tr.id === 'WC2026') { fills.ARG = {flag: 'ar', lift: 0.6}; faces.ARG = {mood: t >= 120 ? 'sad' : 'angry', size: 1.1, max: 120, blink: blinkOf('ARG')}; }
		} else {
			const F = FEAT.esp[tr.id]; const ms = F.matches;
			const j = seg.mt.reduce((acc, x, i) => (t >= x ? i : acc), -1);
			const vF = seg.dur - T_OUT + 20;
			heroMood = 'smug';
			if (j >= 0 && t < vF) {
				const m = ms[j]; const u = t - seg.mt[j];
				fills[m.opp] = {flag: FL[m.opp], lift: 0.9, pop: elastic((u - 10) / FPS)};
				const done = u >= 240;
				faces[m.opp] = {mood: done ? (m.win ? 'sad' : 'happy') : u >= 60 ? 'angry' : 'smug', size: 1.4, max: 210, blink: blinkOf(m.opp), pop: elastic((u - 20) / FPS), look: [-0.7, -0.1]};
				heroMood = done ? (m.win ? 'happy' : 'sad') : u >= 60 ? 'angry' : 'cool';
				if (done && m.win) heroGlow = 'rgba(255,214,90,0.7)';
				if (done && !m.win) heroGlow = 'rgba(232,57,74,0.6)';
			}
			if (t < T_IN) { heroMood = t >= 150 ? 'cool' : 'worried'; say = {text: tr.say[0], a: 180, b: T_IN - 10}; }
			if (t >= vF) { heroMood = F.champ ? 'happy' : 'sad'; heroGlow = F.champ ? 'rgba(255,214,90,0.9)' : undefined; say = {text: tr.say[1], a: vF + 160, b: seg.dur - 30}; }
		}
	}
	if (seg.kind === 'cta') { heroMood = 'happy'; heroGlow = 'rgba(255,214,90,0.8)'; say = {text: '¡Ayúdame a llegar a más gente!', a: 40, b: CTA - 30}; }
	if (seg.kind === 'argin' || seg.kind === 'atitle' || seg.kind === 'argsum') {
		heroK = 'ARG';
		fills.ARG = {flag: 'ar'}; faces.ARG = {mood: 'worried', size: 0.9, max: 100, blink: blinkOf('ARG')};
		heroMood = 'worried';
		if (seg.kind === 'argin') { heroMood = 'shock'; say = {text: '¿Yo sin mi 10? Ni lo pienses...', a: 200, b: ARG_IN - 20}; }
		if (seg.kind === 'atitle') {
			const a = ATITLES[seg.i];
			a.host.forEach((k) => { fills[k] = {flag: FL[k], lift: 0.6}; });
			heroMood = t >= 600 ? (a.keeps ? 'happy' : 'sad') : t >= 360 ? 'worried' : 'neutral';
			if (t >= 600) heroGlow = a.keeps ? 'rgba(61,184,107,0.7)' : 'rgba(232,57,74,0.6)';
		}
		if (seg.kind === 'argsum') { heroMood = 'sad'; say = {text: 'Messi, ¡gracias por elegirme!', a: 200, b: ARG_SUM - 20}; }
	}
	if (seg.kind === 'fin' || seg.kind === 'outro') { heroK = seg.kind === 'fin' && t < 1250 ? null : 'ESP'; heroMood = 'happy'; heroGlow = 'rgba(255,214,90,0.8)'; if (seg.kind === 'fin') say = {text: '¡Cuatro estrellas, Messi!', a: 1500, b: 2100}; }
	if (heroK) delete faces[heroK];
	if (say && t >= say.a && t < say.b) heroTalk = talk(say.a, say.b);
	const heroPop = heroK ? (f < RULES0 + 40 ? elastic((f - RULES0) / FPS) : seg.kind === 'argin' && t < 40 ? elastic(t / FPS) : seg.kind === 'fin' && t < 40 ? elastic(t / FPS) : 1) : 0;
	const dark = seg.kind === 'hook' ? (f < H_TEASE ? 0.55 : 0.3) : seg.kind === 'rules' || seg.kind === 'fin' || seg.kind === 'outro' || seg.kind === 'argin' || seg.kind === 'argsum' ? 0.3 : seg.kind === 'story' && t >= 3400 ? 0.3 : 0;
	const cabP = f >= RULES0 + RULES && f < ARG0 ? easeOut((f - RULES0 - RULES) / 24) * (1 - easeInOut((f - ARG0 + 30) / 20)) : 0;
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			<FlagPreload flags={ALL_FLAGS} />
			<Atlas cam={cam} fills={fills} faces={faces} dark={dark} />
			{seg.kind === 'story' && <Story t={t} cam={cam} />}
			{heroK && <Hero k={heroK} f={f} mood={heroMood} look={heroLook} pop={heroPop} glow={heroGlow} talk={heroTalk} jersey={heroK === 'ESP'} />}
			{heroK && say && t >= say.a && t < say.b && say.text && <HeroSay k={heroK} text={say.text} p={backOut((t - say.a) / 12) * (1 - easeInOut((t - say.b + 10) / 8))} />}
			{cabP > 0 && <Cabinet f={f} p={cabP} />}
			{seg.kind === 'hook' && <Hook f={f} />}
			{seg.kind === 'rules' && <Rules t={t} />}
			{seg.kind === 'tour' && <TourScene s={seg} t={t} f={f} />}
			{seg.kind === 'cta' && <CtaScene g={seg} t={t} />}
			{seg.kind === 'argin' && <ArgIntro t={t} />}
			{seg.kind === 'atitle' && <ATitleScene i={seg.i} t={t} />}
			{seg.kind === 'argsum' && <ArgSum t={t} />}
			{seg.kind === 'fin' && <FinScene t={t} />}
			{seg.kind === 'outro' && <Outro t={t} />}
			{CTA_OV.map((c, i) => (f >= c && f < c + 280 ? <CtaBanner key={c} u={f - c} y={[430, 500, 600, 840][i]} /> : null))}
			<Footer f={f} />
		</AbsoluteFill>
	);
};
