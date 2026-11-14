import React, {useMemo} from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {WorldLayer, Vis, WCam, bboxOf} from '../v5/WorldLayer5';
import {Hincha, Mood} from '../Hincha';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {C} from '../data';
import {backOut, clamp01, easeInOut, easeOut, elastic, Panel, Pill, strokeText} from '../ui';
import {blinkAt, camPath, Confetti, Key, Subscribe, Trophy} from '../common';
import {FlagPreload} from '../v2/Preload';
import {ALL_FLAGS11, CHAMPS, EDS, Ed, N, TITLE_KEY, titlesOf} from './data11';

const FPS = 60;
const GREEN = '#2EC46B', RED = C.red, BLUE = '#2F7DE1';
// ---------------- timeline ----------------
export const HOOK = 1200;
const INTRO = 480;
const D = 1200; // per edition
const WAR = 420;
const RANK = 1560;
const OUTRO = 600;
// phases inside an edition
const P_FIN = 250, P_REV = 330, P_CH = 650, P_TOP = 900, P_FACT = 1050;
export type Seg = {kind: 'ed'; from: number; dur: number; i: number; e: Ed} | {kind: 'war'; from: number; dur: number};
export const SEGS: Seg[] = [];
let _t = HOOK + INTRO;
EDS.forEach((e, i) => {
	if (e.y === 1950) { SEGS.push({kind: 'war', from: _t, dur: WAR}); _t += WAR; }
	SEGS.push({kind: 'ed', from: _t, dur: D, i, e}); _t += D;
});
export const RANK0 = _t;
export const OUTRO0 = RANK0 + RANK;
export const V11_TOTAL = OUTRO0 + OUTRO;
const ED_SEGS = SEGS.filter((s): s is Extract<Seg, {kind: 'ed'}> => s.kind === 'ed');
const chFrame = (i: number) => ED_SEGS[i].from + P_CH; // when edition i's champion is crowned

// final score reveal
const revealOrder = (e: Ed) => {
	// interleave goals so the reveal tells the story roughly (winner ends ahead)
	const seq: ('w' | 'l')[] = [];
	let w = 0, l = 0;
	while (w < e.sw || l < e.sl) {
		if (l < e.sl && (l < w || w >= e.sw)) { seq.push('l'); l++; } else { seq.push('w'); w++; }
	}
	return seq;
};
const REV_LEN = 130;
const scoreAt = (e: Ed, t: number): [number, number] => {
	const seq = revealOrder(e);
	let w = 0, l = 0;
	seq.forEach((s, j) => { if (t >= P_REV + ((j + 1) / (seq.length + 1)) * REV_LEN) { if (s === 'w') w++; else l++; } });
	return [w, l];
};
const goalTimes = (e: Ed) => revealOrder(e).map((s, j) => ({s, t: P_REV + ((j + 1) / (revealOrder(e).length + 1)) * REV_LEN}));
const resTxt = (e: Ed) => `${e.sw}-${e.sl}${e.pens ? ` (${e.pens[0]}-${e.pens[1]} pen.)` : e.et ? ' (pr.)' : ''}`;

// ---------------- camera ----------------
const fitBox = (keys: string[], cx = 960, cy = 470, w = 860, h = 520): WCam => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of keys) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	const z = Math.max(0.42, Math.min(3.0, Math.min(w / (x1 - x0 + 40), h / (y1 - y0 + 40))));
	return {x: (x0 + x1) / 2 + (960 - cx) / z, y: (y0 + y1) / 2 + (540 - cy) / z, z};
};
const mapsOf = (ks: string[]) => ks.flatMap((k) => N[k].map);
const WORLD_VIEW: WCam = {x: 1700, y: 900, z: 0.55};
const KEYS_CAM: Key[] = (() => {
	const k: Key[] = [];
	const add = (f: number, c: WCam) => k.push([f, c.x, c.y, c.z]);
	add(0, {...WORLD_VIEW, z: 0.5}); add(640, {...WORLD_VIEW, z: 0.5}); add(700, WORLD_VIEW); add(HOOK, {...WORLD_VIEW, z: 0.58});
	add(HOOK + INTRO - 20, {...WORLD_VIEW, z: 0.6});
	for (const s of SEGS) {
		if (s.kind === 'war') { const c = fitBox(['FRA', 'DEU', 'POL', 'ITA', 'ENG'], 960, 520, 900, 560); add(s.from + 40, c); add(s.from + s.dur - 10, {...c, z: c.z * 1.06}); continue; }
		const e = s.e;
		const h = fitBox(mapsOf(e.host)); add(s.from + 40, h); add(s.from + P_FIN - 10, {...h, z: h.z * 1.05});
		const fn = fitBox(mapsOf([e.win, e.lose])); add(s.from + P_FIN + 40, fn); add(s.from + P_CH - 10, {...fn, z: fn.z * 1.05});
		const ch = fitBox(mapsOf([e.win])); const chz = {...ch, z: Math.min(ch.z, 2.4)};
		add(s.from + P_CH + 40, chz); add(s.from + s.dur - 10, {...chz, z: chz.z * 1.06});
	}
	add(RANK0 + 50, {x: 1650, y: 900, z: 0.55}); add(OUTRO0, {x: 1650, y: 900, z: 0.6}); add(V11_TOTAL, {x: 1650, y: 900, z: 0.64});
	k.sort((a, b) => a[0] - b[0]);
	return k;
})();

// ---------------- hook timing ----------------
const H_SLOT = 260, SLOT = 16, H_MAP = 640, H_Q = 960;
const HOOK_ORDER = ['BRA', 'GER', 'ITA', 'ARG', 'FRA', 'URY', 'ESP', 'ENG'];

// ---------------- sfx & music ----------------
export const v11Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f: Math.round(f), name, vol});
	S(0, 'whoosh_4', 0.45); S(14, 'slap', 0.45); S(40, 'drop', 0.4); S(52, 'boom', 0.6); S(54, 'glass', 0.3); S(120, 'slap', 0.45); S(122, 'crowd_roar', 0.25);
	S(H_SLOT - 20, 'riser', 0.3);
	EDS.forEach((_, i) => { S(H_SLOT + i * SLOT, 'tick', 0.35); S(H_SLOT + i * SLOT + 2, `pop_${(i % 4) + 1}`, 0.22); });
	S(H_MAP, 'whoosh_2', 0.5); S(H_MAP + 20, 'boom', 0.55);
	HOOK_ORDER.forEach((_, i) => { S(H_MAP + 60 + i * 26, `pop_${(i % 4) + 1}`, 0.4); });
	S(H_MAP + 280, 'slap', 0.45);
	S(H_Q, 'whoosh_3', 0.45); S(H_Q + 16, 'slap', 0.5); HOOK_ORDER.forEach((_, i) => S(H_Q + 40 + i * 8, 'click', 0.25)); S(H_Q + 120, 'drumroll', 0.35); S(H_Q + 180, 'crowd_ohh', 0.4);
	S(HOOK - 10, 'whoosh_1', 0.5); S(HOOK + 4, 'whistle_long', 0.35);
	S(HOOK + 30, 'slap', 0.45); [0, 1, 2, 3].forEach((k) => S(HOOK + 60 + k * 30, `pop_${k + 1}`, 0.42)); S(HOOK + 260, 'whoosh_3', 0.4); S(HOOK + 290, 'confirm', 0.35);
	for (const sg of SEGS) {
		const f0 = sg.from;
		if (sg.kind === 'war') { S(f0, 'whoosh_4', 0.5); S(f0 + 20, 'boom', 0.5); S(f0 + 30, 'glitch', 0.3); S(f0 + 140, 'pop_2', 0.4); S(f0 + 230, 'pop_3', 0.4); S(f0 + sg.dur - 24, 'whoosh_1', 0.3); continue; }
		const e = sg.e;
		S(f0, `whoosh_${(sg.i % 4) + 1}`, 0.45); S(f0 + 14, 'slap', 0.5); S(f0 + 18, 'crowd_roar', 0.18);
		for (let k = 0; k < 4; k++) S(f0 + 70 + k * 16, `pop_${(k % 4) + 1}`, 0.3);
		for (let k = 0; k < 8; k++) S(f0 + 140 + k * 9, 'tick', 0.12);
		S(f0 + P_FIN, 'whoosh_2', 0.4); S(f0 + P_FIN + 20, 'whistle_long', 0.35); S(f0 + P_FIN + 24, 'crowd_roar', 0.2);
		for (const g of goalTimes(e)) { S(f0 + g.t - 8, 'kick', 0.4); S(f0 + g.t, 'boom', 0.42); S(f0 + g.t + 2, g.s === 'w' ? 'crowd_roar' : 'crowd_ohh', 0.32); }
		if (e.et) S(f0 + P_REV + REV_LEN + 4, 'drumroll', e.pens ? 0.4 : 0.25);
		if (e.pens) S(f0 + P_REV + REV_LEN + 50, 'confirm', 0.4);
		S(f0 + 480, 'pop_3', 0.35);
		S(f0 + P_CH, 'boom', 0.65); S(f0 + P_CH + 2, 'crowd_roar', 0.55); S(f0 + P_CH + 10, 'glass', 0.3); S(f0 + P_CH + 6, 'whistle_long', 0.3);
		S(f0 + P_CH + 60, 'up', 0.35); S(f0 + P_CH + 80, 'confirm', 0.35);
		S(f0 + P_TOP - 6, 'whoosh_2', 0.25); S(f0 + P_TOP, 'pop_1', 0.4); S(f0 + P_TOP + 40, 'tick', 0.3);
		S(f0 + P_FACT - 6, 'whoosh_3', 0.25); S(f0 + P_FACT, 'pop_4', 0.4);
		S(f0 + D - 20, 'whoosh_1', 0.3);
	}
	S(RANK0, 'whoosh_4', 0.5); S(RANK0 + 20, 'boom', 0.6); S(RANK0 + 40, 'drumroll', 0.3);
	RANK_ORDER.forEach((_, j) => { S(RANK0 + RANK_IN(j), j === 0 ? 'boom' : 'slap', j === 0 ? 0.7 : 0.45); if (j === 0) S(RANK0 + RANK_IN(j) + 2, 'crowd_roar', 0.55); });
	S(RANK0 + 900, 'whoosh_2', 0.45); [0, 1, 2, 3].forEach((k) => S(RANK0 + 930 + k * 90, `pop_${k + 1}`, 0.45));
	S(OUTRO0, 'whoosh_2', 0.4); S(OUTRO0 + 20, 'slap', 0.45); [0, 1, 2].forEach((i) => S(OUTRO0 + 70 + i * 14, `pop_${i + 1}`, 0.4)); S(OUTRO0 + 300, 'pop_4', 0.4); S(OUTRO0 + 350, 'click', 0.5); S(OUTRO0 + 352, 'bong', 0.35);
	s.sort((a, b) => a.f - b.f);
	return s;
};
export const v11Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	const late = ED_SEGS[19].from; // 2018 onwards: tension
	return [`m_tense:0:${sec(HOOK + 30)}`, `m_happy:${sec(HOOK)}:${sec(late + 40)}`, `m_tense:${sec(late)}:${sec(RANK0 + 40)}`, `m_triumph:${sec(RANK0)}:${sec(V11_TOTAL)}`].join(',');
};

// ---------------- small UI ----------------
const Txt: React.FC<{children: React.ReactNode; size?: number; color?: string; p?: number; shadow?: string; style?: React.CSSProperties}> = ({children, size = 84, color = '#fff', p = 1, shadow = C.navy, style}) => (
	<div style={{transform: `scale(${Math.max(0, p)})`, fontFamily: LILITA, fontSize: size, color, ...strokeText(size * 0.15), textShadow: `0 ${size * 0.08}px 0 ${shadow}`, whiteSpace: 'nowrap', lineHeight: 1.05, ...style}}>{children}</div>
);
const Flag: React.FC<{k: string; w: number; style?: React.CSSProperties}> = ({k, w, style}) => <img src={staticFile(`flags/${N[k].flag}.svg`)} style={{width: w, height: w * 0.7, borderRadius: Math.max(3, w * 0.09), border: `${w > 60 ? 4 : 3}px solid ${C.navy}`, objectFit: 'cover', boxShadow: w > 60 ? '0 0 0 3px #fff' : undefined, flexShrink: 0, ...style}} />;
const Star: React.FC<{s: number; on?: boolean; col?: string; style?: React.CSSProperties}> = ({s, on = true, col = C.yellow, style}) => (
	<svg width={s} height={s} viewBox="0 0 40 40" style={style}><path d="M20 3 L25 14.5 L37.5 15.5 L28 24 L31 36.5 L20 30 L9 36.5 L12 24 L2.5 15.5 L15 14.5Z" fill={on ? col : 'rgba(255,255,255,0.15)'} stroke={C.navy} strokeWidth={3} strokeLinejoin="round" /></svg>
);
const up = (s: string) => s.toUpperCase();
const f2 = (v: number) => v.toFixed(2).replace('.', ',');
const nm = (k: string) => up(N[k].name);

// ---------------- ticker ----------------
const TICKER = [
	'23 MUNDIALES · 8 CAMPEONES DISTINTOS · DE URUGUAY 1930 A NORTEAMÉRICA 2026',
	'LA COPA JULES RIMET SE ENTREGÓ HASTA 1970 · EL TROFEO ACTUAL, DESDE 1974',
	'1942 Y 1946: NO HUBO MUNDIAL POR LA SEGUNDA GUERRA MUNDIAL',
	'ALEMANIA FEDERAL (1954, 1974, 1990) CUENTA COMO ALEMANIA',
	'MÁXIMO GOLEADOR HISTÓRICO DE LOS MUNDIALES: KYLIAN MBAPPÉ, 22 GOLES',
	'SOLO EUROPA Y SUDAMÉRICA HAN GANADO EL MUNDIAL',
];
const Ticker: React.FC<{f: number; y: number}> = ({f, y}) => {
	const text = TICKER.join('     •     ') + '     •     ';
	const w = useMemo(() => {
		try { const c = document.createElement('canvas').getContext('2d')!; c.font = `800 22px ${RUBIK}`; return c.measureText(text).width; } catch { return text.length * 14; }
	}, [text]);
	const x = -((f * 2.2) % w);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 56, transform: `translateY(${y}px)`, background: 'linear-gradient(180deg, #0E2A55, #081A38)', borderTop: `4px solid ${C.yellow}`, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 330, top: 0, bottom: 0, right: 0, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: x, top: 13, whiteSpace: 'pre', fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff'}}>{text + text + text}</div>
			</div>
			<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 330, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: C.yellow, fontFamily: LILITA, fontSize: 25, color: C.navy, whiteSpace: 'nowrap', boxShadow: '6px 0 12px rgba(0,0,0,0.4)'}}>
				<div style={{transform: 'scale(0.17)', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Trophy size={200} /></div>
				CAMPEONES DEL MUNDO
			</div>
		</div>
	);
};

// ---------------- main ----------------
export const Video11: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS_CAM, f, 11);
	const seg = SEGS.find((s) => f >= s.from && f < s.from + s.dur);
	const ed = seg?.kind === 'ed' ? seg : null;
	const t = seg ? f - seg.from : 0;
	// map visibility
	const vis: Record<string, Vis> = {};
	const put = (k: string, v: Partial<Vis> & {pop: number}) => { for (const m of N[k].map) vis[m] = {flag: N[k].flag, blink: blinkAt(f, m.charCodeAt(0) + m.charCodeAt(1)), open: 0.5 + 0.5 * Math.sin(f / 4 + m.charCodeAt(2)), ...v}; };
	// champions so far
	const firstTitle: Record<string, number> = {};
	EDS.forEach((e, i) => { const k = TITLE_KEY(e.win); if (firstTitle[k] === undefined) firstTitle[k] = i; });
	if (f >= H_MAP && f < HOOK + 20) HOOK_ORDER.forEach((k, j) => put(k, {pop: elastic((f - H_MAP - 60 - j * 26) / FPS), mood: 'feliz', faceScale: 1.2}));
	if (f >= HOOK + 20) {
		for (const k of CHAMPS) {
			const fi = chFrame(firstTitle[k]);
			if (f < fi && f < RANK0) continue;
			const isCur = ed && TITLE_KEY(ed.e.win) === k && t >= P_CH;
			put(k, {pop: f >= RANK0 ? 1 : elastic((f - fi) / FPS), mood: isCur ? 'grito' : 'feliz', faceScale: isCur ? 1.35 : 1, glow: isCur ? C.yellow : undefined});
		}
	}
	if (ed) {
		const e = ed.e;
		for (const h of e.host) if (!(t >= P_CH && TITLE_KEY(e.win) === TITLE_KEY(h))) put(h, {pop: Math.max(vis[N[h].map[0]]?.pop ?? 0, elastic((t - 20) / FPS)), mood: t < P_FIN ? 'feliz' : 'feliz', faceScale: t < P_FIN ? 1.3 : 1, glow: t < P_FIN ? C.yellow : undefined});
		if (t >= P_FIN - 10) {
			const [w, l] = scoreAt(e, t);
			const done = t >= P_REV + REV_LEN + (e.pens ? 60 : 10);
			const lastG = goalTimes(e).reverse().find((g) => t >= g.t && t < g.t + 50);
			const lookAt = (a: string, b: string): [number, number] => { const A = bboxOf(N[a].map[0]), B = bboxOf(N[b].map[0]); const dx = (B.x0 + B.x1 - A.x0 - A.x1) / 2, dy = (B.y0 + B.y1 - A.y0 - A.y1) / 2; const d = Math.hypot(dx, dy) || 1; return [dx / d, dy / d]; };
			if (!(t >= P_CH)) put(e.win, {pop: Math.max(0, elastic((t - P_FIN + 10) / FPS)), mood: done ? 'grito' : lastG ? (lastG.s === 'w' ? 'grito' : 'triste') : 'enfado', faceScale: 1.3, glow: done ? GREEN : C.yellow, look: lookAt(e.win, e.lose)});
			put(e.lose, {pop: Math.max(0, elastic((t - P_FIN) / FPS)), mood: done ? (t >= P_CH ? 'triste' : 'ko') : lastG ? (lastG.s === 'l' ? 'grito' : 'triste') : 'enfado', faceScale: t >= P_CH ? 1 : 1.3, glow: done ? (t >= P_CH ? undefined : RED) : C.yellow, look: lookAt(e.lose, e.win), color: '#3A4660', colorMix: t >= P_CH ? 0.55 : 0});
			void w; void l;
		}
	}
	// shake
	let shake = 0;
	if (ed) {
		for (const g of goalTimes(ed.e)) { const d = t - g.t; if (d >= 0 && d < 14) shake = Math.sin(f * 3) * (14 - d) * 0.8; }
		if (t >= P_CH && t < P_CH + 18) shake = Math.sin(f * 3) * (P_CH + 18 - t);
	}
	if (f >= 52 && f < 70) shake = Math.sin(f * 3) * (70 - f);
	if (f >= RANK0 + RANK_IN(0) && f < RANK0 + RANK_IN(0) + 18) shake = Math.sin(f * 3) * (RANK0 + RANK_IN(0) + 18 - f);
	const hud = f >= HOOK + 250 && f < RANK0 + 10 ? easeOut((f - HOOK - 250) / 24) * (1 - easeInOut((f - RANK0 + 10) / 20)) : 0;
	const tickIn = f >= HOOK && f < OUTRO0 ? easeOut((f - HOOK) / 24) * (1 - easeInOut((f - OUTRO0 + 30) / 24)) : 0;
	const curI = ed ? ed.i : seg?.kind === 'war' ? 2.5 : f >= RANK0 ? 23 : -1;
	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			<FlagPreload flags={ALL_FLAGS11} />
			<AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
				<WorldLayer cam={cam} vis={vis} ring={null}>
					{ed && <FinalArc e={ed.e} t={t} z={cam.z} f={f} />}
				</WorldLayer>
				{f < HOOK + 20 && <Hook f={f} />}
				{f >= HOOK - 10 && f < HOOK + INTRO + 20 && <Intro t={f - HOOK} f={f} />}
				{hud > 0 && <TimelineBar f={f} cur={curI} p={hud} edT={ed ? t : 0} />}
				{hud > 0 && <Titles f={f} p={hud} />}
				{ed && <EdScene ed={ed} t={t} f={f} />}
				{seg?.kind === 'war' && <War t={t} f={f} />}
				{f >= RANK0 && f < OUTRO0 + 20 && <Ranking t={f - RANK0} f={f} />}
				{f >= OUTRO0 && <Outro t={f - OUTRO0} f={f} />}
				{ed && t >= P_CH && t < P_CH + 260 && <Confetti f={f} start={ed.from + P_CH} n={110} />}
				{f >= RANK0 + RANK_IN(0) && f < RANK0 + 900 && <Confetti f={f} start={RANK0 + RANK_IN(0)} n={160} />}
			</AbsoluteFill>
			{f >= HOOK - 14 && f < HOOK + 16 && <AbsoluteFill style={{background: '#fff', opacity: 0.85 * Math.sin(clamp01((f - HOOK + 14) / 30) * Math.PI)}} />}
			{tickIn > 0 && <Ticker f={f} y={(1 - tickIn) * 80} />}
		</AbsoluteFill>
	);
};

// dashed arc between the two finalists
const FinalArc: React.FC<{e: Ed; t: number; z: number; f: number}> = ({e, t, z, f}) => {
	const c = (k: string) => { const b = bboxOf(N[k].map[0]); return [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2]; };
	const [ax, ay] = c(e.win), [bx, by] = c(e.lose);
	const p = easeOut((t - P_FIN - 40) / 40) * (1 - easeInOut((t - P_CH + 10) / 20));
	if (p <= 0) return null;
	const mx = (ax + bx) / 2, my = (ay + by) / 2 - Math.hypot(bx - ax, by - ay) * 0.25;
	const k = 1 / z;
	const d = `M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`;
	const vx = (ax + 2 * mx + bx) / 4, vy = (ay + 2 * my + by) / 4;
	return (
		<g opacity={p}>
			<path d={d} fill="none" stroke={C.navy} strokeWidth={10 * k} strokeLinecap="round" />
			<path d={d} fill="none" stroke={C.yellow} strokeWidth={5 * k} strokeDasharray={`${16 * k} ${12 * k}`} strokeDashoffset={-f * 1.2 * k} strokeLinecap="round" />
			<g transform={`translate(${vx} ${vy}) scale(${k * backOut((t - P_FIN - 50) / 14)})`}>
				<circle r={34} fill={C.red} stroke={C.navy} strokeWidth={6} />
				<text y={13} textAnchor="middle" fontFamily="Lilita" fontSize={36} fill="#fff">VS</text>
			</g>
		</g>
	);
};

// ---------------- HOOK ----------------
const Hook: React.FC<{f: number}> = ({f}) => {
	const out = easeInOut((f - HOOK + 16) / 16);
	const dark = f < H_MAP ? 0.82 : f < H_Q ? 0.82 * (1 - easeOut((f - H_MAP) / 30)) + 0.15 : 0.15 + 0.45 * easeOut((f - H_Q) / 20);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{background: `rgba(5,10,30,${dark})`}} />
			{f < H_SLOT + 10 && (
				<AbsoluteFill style={{opacity: 1 - easeInOut((f - H_SLOT) / 10)}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', justifyContent: 'center'}}><Txt size={70} p={backOut((f - 6) / 12)}>DE 1930 A 2026</Txt></div>
					<div style={{position: 'absolute', left: 960 - 170, top: 190, transform: `translateY(${(1 - easeOut((f - 30) / 22)) * -700}px) rotate(${Math.sin(f / 10) * 3}deg)`}}><Trophy size={340} /></div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
						<Txt size={92} p={backOut((f - 110) / 12)}>TODOS LOS CAMPEONES</Txt>
						<Txt size={110} color={C.yellow} shadow={C.red} p={backOut((f - 126) / 12)}>DEL MUNDIAL</Txt>
					</div>
				</AbsoluteFill>
			)}
			{f >= H_SLOT && f < H_MAP + 10 && <SlotMontage t={f - H_SLOT} />}
			{f >= H_MAP && f < H_Q + 10 && (
				<AbsoluteFill style={{opacity: 1 - easeInOut((f - H_Q) / 10)}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
						<Txt size={74} p={backOut((f - H_MAP - 10) / 12)}>23 MUNDIALES...</Txt>
						<Txt size={96} color={C.yellow} shadow={C.red} p={backOut((f - H_MAP - 40) / 12)}>¡SOLO 8 CAMPEONES!</Txt>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center', gap: 14}}>
						{HOOK_ORDER.map((k, j) => (
							<div key={k} style={{transform: `scale(${backOut((f - H_MAP - 60 - j * 26) / 10)})`}}><Flag k={k} w={110} /></div>
						))}
					</div>
				</AbsoluteFill>
			)}
			{f >= H_Q && (() => {
				const u = f - H_Q;
				return (
					<AbsoluteFill>
						<div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center'}}><Txt size={96} p={backOut((u - 4) / 12)}>¿QUIÉN TIENE MÁS ESTRELLAS?</Txt></div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', gap: 26}}>
							{HOOK_ORDER.map((k, j) => (
								<div key={k} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transform: `scale(${backOut((u - 40 - j * 8) / 10)}) translateY(${Math.sin(f / 8 + j) * 6}px)`}}>
									<Flag k={k} w={170} />
									<div style={{width: 110, height: 110, borderRadius: 55, background: C.yellow, border: `7px solid ${C.navy}`, boxShadow: '0 0 0 5px #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 72, color: C.navy}}>?</div>
								</div>
							))}
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
							<Txt size={80} color={C.yellow} shadow={C.red} p={backOut((u - 150) / 12)}>¡VAMOS MUNDIAL A MUNDIAL!</Txt>
						</div>
					</AbsoluteFill>
				);
			})()}
		</AbsoluteFill>
	);
};
const SlotMontage: React.FC<{t: number}> = ({t}) => {
	const i = Math.max(0, Math.min(22, Math.floor(t / SLOT)));
	const u = t - i * SLOT;
	const e = EDS[i];
	const out = easeInOut((t - (H_MAP - H_SLOT)) / 10);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 60}}>
				<div style={{fontFamily: LILITA, fontSize: 250, color: C.yellow, ...strokeText(30), textShadow: `0 18px 0 ${C.red}`, transform: `scale(${u < 5 ? 1.25 - 0.05 * u : 1})`, width: 620, textAlign: 'center'}}>{e.y}</div>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, transform: `scale(${u < 5 ? 1.2 - 0.04 * u : 1}) rotate(${(i % 2 ? 3 : -3)}deg)`}}>
					<Flag k={e.win} w={360} />
					<Txt size={72}>{nm(e.win)}</Txt>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 680, display: 'flex', justifyContent: 'center'}}><Pill size={34} bg="#fff">{`CAMPEÓN DEL MUNDO ${e.y}`}</Pill></div>
			<div style={{position: 'absolute', left: 60, right: 60, top: 830, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap'}}>
				{EDS.map((x, j) => (
					<div key={x.y} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, opacity: j <= i ? 1 : 0.15}}>
						<Flag k={x.win} w={66} style={{transform: `scale(${j === i ? 1.2 : 1})`}} />
						<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, color: j === i ? C.yellow : '#fff'}}>{x.y}</span>
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

// ---------------- INTRO ----------------
const Icon: React.FC<{i: number; s: number}> = ({i, s}) => (
	<svg width={s} height={s} viewBox="0 0 40 40">
		{i === 0 && <path d="M6 20 L20 7 L34 20 M10 17 V34 H30 V17 M17 34 V25 H23 V34" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />}
		{i === 1 && <g fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round"><rect x={5} y={10} width={30} height={20} rx={4} /><path d="M20 10 V30" /><circle cx={20} cy={20} r={4} /></g>}
		{i === 2 && <path d="M12 6 H28 V14 Q28 24 20 25 Q12 24 12 14Z M14 34 H26 M20 25 V34 M12 9 H6 Q6 17 13 18 M28 9 H34 Q34 17 27 18" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />}
		{i === 3 && <g fill="none" stroke="#fff" strokeWidth={3.5} strokeLinejoin="round"><circle cx={20} cy={20} r={14} /><path d="M20 12 L27 17 L24 26 L16 26 L13 17Z" fill="#fff" /></g>}
	</svg>
);
const Intro: React.FC<{t: number; f: number}> = ({t}) => {
	const out = easeInOut((t - INTRO + 24) / 20);
	const cards: [string, string, string][] = [['LA SEDE', 'DÓNDE SE JUGÓ', '#4FC3F7'], ['LA FINAL', 'QUIÉN LA JUGÓ', '#FF5A5F'], ['EL CAMPEÓN', 'Y SUS ESTRELLAS', C.yellow], ['EL GOLEADOR', 'LA BOTA DE ORO', '#C58BFF']];
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{background: 'rgba(5,15,35,0.5)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 100, display: 'flex', justifyContent: 'center'}}><Txt size={84} p={backOut((t - 20) / 12)}>EN CADA MUNDIAL VERÁS...</Txt></div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 290, display: 'flex', justifyContent: 'center', gap: 34}}>
				{cards.map(([a, b, col], k) => {
					const p = backOut((t - 60 - k * 30) / 12);
					return (
						<div key={a} style={{transform: `scale(${Math.max(0, p)}) rotate(${(k % 2 ? 3 : -3) * (1 - p)}deg)`, width: 360, height: 380, borderRadius: 30, background: col, border: `7px solid ${C.navy}`, boxShadow: '0 0 0 6px #fff, 0 14px 0 rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18}}>
							<div style={{width: 160, height: 160, borderRadius: 80, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon i={k} s={100} /></div>
							<div style={{fontFamily: LILITA, fontSize: 52, color: C.navy}}>{a}</div>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: C.navy, opacity: 0.8}}>{b}</div>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 780, display: 'flex', justifyContent: 'center'}}><Pill size={34} bg="#fff" style={{transform: `scale(${backOut((t - 260) / 12)})`}}>Y A LA DERECHA, EL CONTADOR DE TÍTULOS</Pill></div>
		</AbsoluteFill>
	);
};

// ---------------- HUD: timeline + titles table ----------------
const TimelineBar: React.FC<{f: number; cur: number; p: number; edT: number}> = ({f, cur, p, edT}) => {
	const W = 68, G = 7; const total = EDS.length * W + (EDS.length - 1) * G + 34;
	const x0 = (1920 - total) / 2;
	return (
		<div style={{position: 'absolute', left: x0, top: 12, height: 74, width: total, transform: `translateY(${(1 - p) * -120}px)`}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 30, height: 10, borderRadius: 5, background: 'rgba(11,30,63,0.9)', border: `3px solid ${C.navy}`}} />
			{EDS.map((e, j) => {
				const x = j * (W + G) + (j >= 3 ? 34 : 0);
				const crowned = j < cur || (j === cur && edT >= P_CH);
				const isCur = j === cur;
				return (
					<div key={e.y} style={{position: 'absolute', left: x, top: 0, width: W, height: 70, borderRadius: 12, background: isCur ? C.yellow : crowned ? 'rgba(11,30,63,0.95)' : 'rgba(11,30,63,0.6)', border: `3px solid ${isCur ? C.navy : crowned ? '#fff' : 'rgba(255,255,255,0.25)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, transform: `scale(${isCur ? 1.12 + 0.03 * Math.sin(f / 6) : 1})`, boxSizing: 'border-box'}}>
						{crowned ? <Flag k={e.win} w={40} style={{transform: `scale(${isCur ? backOut((edT - P_CH) / 10) : 1})`}} /> : <div style={{width: 40, height: 28, borderRadius: 4, border: '3px dashed rgba(255,255,255,0.35)', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 18, color: 'rgba(255,255,255,0.5)'}}>?</div>}
						<div style={{fontFamily: LILITA, fontSize: 19, lineHeight: 1, color: isCur ? C.navy : crowned ? '#fff' : 'rgba(255,255,255,0.55)'}}>{e.y}</div>
					</div>
				);
			})}
			<div style={{position: 'absolute', left: 3 * (W + G) - G / 2 - 4, top: 14, width: 34, textAlign: 'center', fontFamily: LILITA, fontSize: 26, color: cur === 2.5 ? C.red : 'rgba(255,255,255,0.6)'}}>✕</div>
		</div>
	);
};
// title count of k at frame f
const titleCountAt = (k: string, f: number) => EDS.filter((e, i) => TITLE_KEY(e.win) === k && f >= chFrame(i) + 70).length;
const Titles: React.FC<{f: number; p: number}> = ({f, p}) => {
	const rows = CHAMPS.map((k) => ({k, n: titleCountAt(k, f), first: EDS.findIndex((e) => TITLE_KEY(e.win) === k)})).filter((r) => r.n > 0);
	const sorted = [...rows].sort((a, b) => b.n - a.n || a.first - b.first);
	// smooth rank movement: compute rank 30 frames ago and interpolate
	const prevRank = (k: string) => {
		const pr = CHAMPS.map((kk) => ({k: kk, n: titleCountAt(kk, f - 24), first: EDS.findIndex((e) => TITLE_KEY(e.win) === kk)})).filter((r) => r.n > 0).sort((a, b) => b.n - a.n || a.first - b.first);
		const i = pr.findIndex((r) => r.k === k); return i < 0 ? sorted.findIndex((r) => r.k === k) : i;
	};
	const RH = 60;
	return (
		<div style={{position: 'absolute', right: 22, top: 112, width: 372, transform: `translateX(${(1 - p) * 460}px)`}}>
			<Panel style={{padding: '10px 12px 12px', borderColor: C.yellow}}>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
					<span style={{fontFamily: LILITA, fontSize: 34, color: C.yellow}}>TÍTULOS</span>
					<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)'}}>{rows.length} {rows.length === 1 ? 'CAMPEÓN' : 'CAMPEONES'}</span>
				</div>
				<div style={{position: 'relative', height: Math.max(1, sorted.length) * RH, marginTop: 6, transition: 'none'}}>
					{sorted.map((r, j) => {
						const pj = prevRank(r.k);
						const lastWin = Math.max(...EDS.map((e, i) => (TITLE_KEY(e.win) === r.k && f >= chFrame(i) + 70 ? chFrame(i) + 70 : -1)));
						const since = f - lastWin;
						const y = (pj + (j - pj) * easeInOut(clamp01((since) / 24))) * RH;
						const hot = since < 90;
						const appear = r.n === 1 ? backOut(since / 12) : 1;
						return (
							<div key={r.k} style={{position: 'absolute', left: 0, right: 0, top: y, height: RH - 6, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', borderRadius: 12, background: hot ? 'rgba(255,210,63,0.28)' : 'rgba(255,255,255,0.07)', border: `3px solid ${hot ? C.yellow : 'transparent'}`, transform: `scale(${appear})`, boxSizing: 'border-box'}}>
								<span style={{width: 26, fontFamily: LILITA, fontSize: 24, color: 'rgba(255,255,255,0.6)'}}>{j + 1}</span>
								<Flag k={r.k} w={44} />
								<span style={{flex: 1, fontFamily: LILITA, fontSize: 24, color: '#fff', whiteSpace: 'nowrap'}}>{nm(r.k)}</span>
								<div style={{display: 'flex', gap: 0}}>{Array.from({length: r.n}).map((_, s) => <Star key={s} s={22} style={{transform: `scale(${s === r.n - 1 ? backOut(since / 10) : 1})`}} />)}</div>
								<span style={{width: 30, textAlign: 'right', fontFamily: LILITA, fontSize: 32, color: hot ? C.yellow : '#fff', transform: `scale(${hot && since < 20 ? 1.3 - since * 0.015 : 1})`}}>{r.n}</span>
							</div>
						);
					})}
				</div>
			</Panel>
		</div>
	);
};

// ---------------- EDITION SCENE ----------------
const EdCard: React.FC<{e: Ed; t: number}> = ({e, t}) => {
	const p = backOut((t - 20) / 18);
	const out = easeInOut((t - D + 26) / 22);
	const stats: [string, string, number][] = [['SELECCIONES', String(e.teams), 0], ['PARTIDOS', String(e.matches), 1], ['GOLES', String(e.goals), 2], ['GOLES/PARTIDO', f2(e.goals / e.matches), 3]];
	return (
		<div style={{position: 'absolute', left: 22, top: 112, width: 420, transform: `translateX(${((1 - p) + out) * -560}px)`}}>
			<Panel style={{padding: '12px 16px 16px', borderColor: '#4FC3F7'}}>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
					<span style={{fontFamily: LILITA, fontSize: 36, color: '#fff'}}>MUNDIAL</span>
					<span style={{fontFamily: LILITA, fontSize: 60, color: C.yellow, lineHeight: 1}}>{e.y}</span>
				</div>
				<div style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 12, background: 'rgba(79,195,247,0.18)'}}>
					<div style={{width: 40, height: 40, borderRadius: 10, background: '#4FC3F7', border: `3px solid ${C.navy}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Icon i={0} s={28} /></div>
					<div style={{display: 'flex', gap: 6}}>{e.host.map((h) => <Flag key={h} k={h} w={e.host.length > 2 ? 40 : 52} />)}</div>
					<div style={{minWidth: 0, lineHeight: 1}}>
						<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 13, letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)'}}>SEDE</div>
						<div style={{fontFamily: LILITA, fontSize: e.hostName.length > 16 ? 21 : 28, color: '#fff', whiteSpace: 'nowrap'}}>{up(e.hostName)}</div>
					</div>
				</div>
				<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10}}>
					{stats.map(([a, b, j]) => {
						const q = easeOut((t - 70 - j * 16) / 40);
						const num = parseFloat(b.replace(',', '.'));
						const shown = j === 3 ? f2(num * q) : String(Math.round(num * q));
						return (
							<div key={a} style={{borderRadius: 10, background: 'rgba(255,255,255,0.08)', padding: '4px 10px', transform: `scale(${backOut((t - 70 - j * 16) / 10)})`}}>
								<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 13, letterSpacing: 1.2, color: 'rgba(255,255,255,0.7)'}}>{a}</div>
								<div style={{fontFamily: LILITA, fontSize: 36, color: '#fff', lineHeight: 1.05}}>{shown}</div>
							</div>
						);
					})}
				</div>
				<div style={{marginTop: 10, borderRadius: 10, background: 'rgba(255,255,255,0.08)', padding: '6px 10px', opacity: clamp01((t - P_FIN) / 20)}}>
					<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 13, letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)'}}>{e.noFinal ? 'PARTIDO DECISIVO' : 'ESTADIO DE LA FINAL'}</div>
					<div style={{fontFamily: LILITA, fontSize: e.venue.length > 22 ? 22 : 26, color: '#fff', whiteSpace: 'nowrap'}}>{up(e.venue)}</div>
					<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 16, color: C.yellow}}>{up(e.city)}</div>
				</div>
			</Panel>
		</div>
	);
};
const BottomBox: React.FC<{children: React.ReactNode; p: number; col?: string}> = ({children, p, col = C.yellow}) => (
	<div style={{position: 'absolute', left: 470, width: 980, top: 800, transform: `translateY(${(1 - p) * 360}px)`}}>
		<Panel style={{padding: '12px 22px 16px', borderColor: col, minHeight: 140, boxSizing: 'border-box'}}>{children}</Panel>
	</div>
);
const Tag: React.FC<{children: React.ReactNode; bg: string}> = ({children, bg}) => (
	<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: '#fff', background: bg, padding: '4px 12px', borderRadius: 8, whiteSpace: 'nowrap'}}>{children}</span>
);
const EdScene: React.FC<{ed: Extract<Seg, {kind: 'ed'}>; t: number; f: number}> = ({ed, t, f}) => {
	const e = ed.e;
	const out = easeInOut((t - D + 26) / 22);
	const [w, l] = scoreAt(e, t);
	const revDone = t >= P_REV + REV_LEN;
	const nTit = titlesOf(TITLE_KEY(e.win), ed.i).length;
	const sbP = backOut((t - P_FIN) / 16) * (1 - easeInOut((t - P_CH + 20) / 20));
	const curG = goalTimes(e).reverse().find((g) => t >= g.t && t < g.t + 34);
	return (
		<AbsoluteFill>
			<EdCard e={e} t={t} />
			{/* year slam */}
			{t < P_FIN && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 1 - clamp01((t - 150) / 20)}}>
					<div style={{fontFamily: LILITA, fontSize: 210, color: C.yellow, ...strokeText(26), textShadow: `0 16px 0 ${C.red}`, transform: `scale(${t < 12 ? 2 - easeOut(t / 12) : 1})`, opacity: clamp01(t / 6)}}>{e.y}</div>
					<div style={{transform: `scale(${backOut((t - 30) / 12)})`, marginTop: 4}}><Pill size={32} bg="#fff">{`SEDE: ${up(e.hostName)}`}</Pill></div>
				</div>
			)}
			{t >= 150 && t < P_FIN + 10 && (
				<BottomBox p={backOut((t - 150) / 14) * (1 - easeInOut((t - P_FIN + 10) / 10))} col="#4FC3F7">
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}><Tag bg="#2A8FC4">EL TORNEO</Tag></div>
					<div style={{marginTop: 10, fontFamily: LILITA, fontSize: 38, color: '#fff', lineHeight: 1.12}}>{e.teams} selecciones, {e.matches} partidos y {e.goals} goles</div>
				</BottomBox>
			)}
			{/* final scoreboard */}
			{sbP > 0 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - sbP) * -260}px)`}}>
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<div style={{padding: '3px 18px', borderRadius: '12px 12px 0 0', background: C.yellow, border: `4px solid ${C.navy}`, borderBottom: 'none', fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: C.navy}}>{e.noFinal ? `PARTIDO DECISIVO ${e.y}` : `FINAL ${e.y}`}</div>
						<div style={{display: 'flex', alignItems: 'center', borderRadius: 18, background: 'rgba(11,30,63,0.97)', border: `5px solid ${C.navy}`, boxShadow: '0 0 0 4px #fff, 0 8px 0 rgba(0,0,0,0.35)', overflow: 'hidden'}}>
							{([[e.win, w, 0], [e.lose, l, 1]] as [string, number, number][]).map(([k, sc, s]) => {
								const team = (
									<div key={k} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', width: 290, justifyContent: s ? 'flex-start' : 'flex-end', flexDirection: s ? 'row-reverse' : 'row', background: revDone ? (s ? 'rgba(85,96,122,0.4)' : 'rgba(46,196,107,0.35)') : s ? 'rgba(47,125,225,0.25)' : 'rgba(230,57,70,0.25)'}}>
										<div style={{fontFamily: LILITA, fontSize: N[k].name.length > 10 ? 26 : 32, color: '#fff', whiteSpace: 'nowrap'}}>{nm(k)}</div>
										<Flag k={k} w={62} />
									</div>
								);
								const flash = curG && ((curG.s === 'w') === (s === 0));
								const num = <div key={k + 'n'} style={{fontFamily: LILITA, fontSize: 64, width: 50, textAlign: 'center', color: flash ? C.yellow : '#fff', transform: `scale(${flash ? 1.25 : 1})`}}>{sc}</div>;
								return s === 0 ? <React.Fragment key={k}>{team}<div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', background: C.navy, alignSelf: 'stretch'}}>{num}<div style={{fontFamily: LILITA, fontSize: 40, color: 'rgba(255,255,255,0.5)'}}>-</div>{scNum(l, curG?.s === 'l')}</div></React.Fragment> : team;
							})}
						</div>
						<div style={{marginTop: -2, padding: '3px 18px', borderRadius: '0 0 12px 12px', background: revDone ? '#fff' : RED, border: `4px solid ${C.navy}`, borderTop: 'none', fontFamily: LILITA, fontSize: 26, color: revDone ? C.navy : '#fff', minWidth: 100, textAlign: 'center'}}>
							{t < P_REV ? 'EN JUEGO' : !revDone ? 'EN JUEGO' : e.pens ? (t >= P_REV + REV_LEN + 50 ? `PENALTIS ${e.pens[0]}-${e.pens[1]}` : 'PRÓRROGA...') : e.et ? 'FINAL (PRÓRROGA)' : 'FINAL'}
						</div>
					</div>
				</div>
			)}
			{/* final fact */}
			{t >= 470 && t < P_CH + 10 && (
				<BottomBox p={backOut((t - 470) / 14) * (1 - easeInOut((t - P_CH) / 10))} col={RED}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}><Tag bg="#C42D3A">{e.noFinal ? 'EL PARTIDO DECISIVO' : 'LA FINAL'}</Tag><span style={{fontFamily: LILITA, fontSize: 28, color: C.yellow}}>{nm(e.win)} {resTxt(e)} {nm(e.lose)}</span></div>
					<div style={{marginTop: 10, fontFamily: LILITA, fontSize: 38, color: '#fff', lineHeight: 1.12, opacity: clamp01((t - 476) / 8)}}>{e.finalFact}</div>
				</BottomBox>
			)}
			{/* champion stamp */}
			{t >= P_CH && (() => {
				const u = t - P_CH;
				const shrink = easeInOut((u - 230) / 30);
				return (
					<div style={{position: 'absolute', left: 0, right: 0, top: 230 - shrink * 110, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: 1 - out, transform: `scale(${1 - shrink * 0.38})`}}>
						<div style={{transform: `scale(${u < 12 ? 2 - easeOut(u / 12) : 1}) rotate(-3deg)`, opacity: clamp01(u / 6), padding: '12px 28px', borderRadius: 22, background: GREEN, border: `7px solid ${C.navy}`, boxShadow: '0 0 0 5px #fff, 0 10px 0 rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', gap: 16}}>
							<div style={{transform: 'scale(0.36)', width: 70, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Trophy size={200} /></div>
							<Flag k={e.win} w={90} />
							<span style={{fontFamily: LILITA, fontSize: 60, color: '#fff', ...strokeText(8), whiteSpace: 'nowrap'}}>¡{nm(e.win)} CAMPEÓN!</span>
						</div>
						<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 22px', borderRadius: 16, background: 'rgba(11,30,63,0.95)', border: `4px solid ${C.yellow}`, transform: `scale(${backOut((u - 30) / 12)})`}}>
							{Array.from({length: nTit}).map((_, s) => <Star key={s} s={44} style={{transform: `scale(${backOut((u - 50 - s * 8) / 10)})`}} />)}
							<span style={{fontFamily: LILITA, fontSize: 40, color: '#fff', marginLeft: 6}}>{nTit === 1 ? 'SU PRIMER MUNDIAL' : `SU ${ORD[nTit]} MUNDIAL`}</span>
						</div>
					</div>
				);
			})()}
			{/* top scorer */}
			{t >= P_TOP && t < P_FACT + 10 && (
				<BottomBox p={backOut((t - P_TOP) / 14) * (1 - easeInOut((t - P_FACT) / 10))} col="#C58BFF">
					<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
						<div style={{width: 96, height: 96, borderRadius: 20, background: '#8E5BD9', border: `5px solid ${C.navy}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Icon i={3} s={64} /></div>
						<div style={{flex: 1, minWidth: 0}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 12}}><Tag bg="#8E5BD9">MÁXIMO GOLEADOR</Tag>{e.top.note && <span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 16, color: 'rgba(255,255,255,0.75)'}}>{e.top.note}</span>}</div>
							<div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8}}>
								<Flag k={e.top.nat} w={52} />{e.top.nat2 && <Flag k={e.top.nat2} w={52} />}
								<span style={{fontFamily: LILITA, fontSize: 46, color: '#fff', whiteSpace: 'nowrap'}}>{e.top.who}</span>
							</div>
						</div>
						<div style={{textAlign: 'center', flexShrink: 0}}>
							<div style={{fontFamily: LILITA, fontSize: 84, lineHeight: 1, color: C.yellow, ...strokeText(10)}}>{Math.round(e.top.g * easeOut((t - P_TOP - 10) / 40))}</div>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: '#fff'}}>GOLES</div>
						</div>
					</div>
				</BottomBox>
			)}
			{t >= P_FACT && (
				<BottomBox p={backOut((t - P_FACT) / 14) * (1 - out)} col={GREEN}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}><Tag bg="#1E9E55">¿SABÍAS QUE...?</Tag><span style={{fontFamily: LILITA, fontSize: 26, color: C.yellow}}>MUNDIAL {e.y}</span></div>
					<div style={{marginTop: 10, fontFamily: LILITA, fontSize: 38, color: '#fff', lineHeight: 1.12, opacity: clamp01((t - P_FACT - 6) / 8)}}>{e.fact}</div>
				</BottomBox>
			)}
			{void f}
		</AbsoluteFill>
	);
};
const scNum = (v: number, flash: boolean | undefined) => <div style={{fontFamily: LILITA, fontSize: 64, width: 50, textAlign: 'center', color: flash ? C.yellow : '#fff', transform: `scale(${flash ? 1.25 : 1})`}}>{v}</div>;
const ORD = ['', 'PRIMER', 'SEGUNDO', 'TERCER', 'CUARTO', 'QUINTO'];

// ---------------- WAR GAP ----------------
const War: React.FC<{t: number; f: number}> = ({t, f}) => {
	const out = easeInOut((t - WAR + 24) / 20);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{background: 'rgba(20,10,10,0.72)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
				<div style={{display: 'flex', gap: 40}}>
					{['1942', '1946'].map((y, j) => (
						<div key={y} style={{position: 'relative', transform: `scale(${backOut((t - 20 - j * 14) / 12)})`}}>
							<div style={{fontFamily: LILITA, fontSize: 190, color: '#9AA3B5', ...strokeText(24)}}>{y}</div>
							<svg width={420} height={200} style={{position: 'absolute', left: -20, top: 10}}><path d={`M20 180 L${20 + 380 * easeOut((t - 40 - j * 14) / 14)} ${180 - 160 * easeOut((t - 40 - j * 14) / 14)}`} stroke={RED} strokeWidth={22} strokeLinecap="round" /></svg>
						</div>
					))}
				</div>
				<Txt size={92} color={RED} p={backOut((t - 80) / 12)}>NO HUBO MUNDIAL</Txt>
				<Txt size={50} p={backOut((t - 110) / 12)}>POR LA SEGUNDA GUERRA MUNDIAL</Txt>
			</div>
			<BottomBox p={backOut((t - 140) / 14)} col={C.yellow}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12}}><Tag bg="#B8860B">¿SABÍAS QUE...?</Tag></div>
				<div style={{marginTop: 10, fontFamily: LILITA, fontSize: 36, color: '#fff', lineHeight: 1.12}}>El dirigente italiano Ottorino Barassi escondió la copa en una caja de zapatos bajo su cama</div>
			</BottomBox>
			{void f}
		</AbsoluteFill>
	);
};

// ---------------- RANKING ----------------
const RANK_ORDER = ['BRA', 'GER', 'ITA', 'ARG', 'FRA', 'URY', 'ESP', 'ENG']; // final standing
const RANK_IN = (j: number) => [680, 560, 470, 390, 310, 230, 160, 90][j]; // reveal from last to first
const Ranking: React.FC<{t: number; f: number}> = ({t, f}) => {
	const out = easeInOut((t - RANK + 24) / 20);
	const p2 = t >= 900;
	const fadeA = 1 - easeInOut((t - 880) / 20);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{background: 'rgba(5,12,30,0.62)'}} />
			{t < 910 && (
				<AbsoluteFill style={{opacity: fadeA}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', justifyContent: 'center'}}><Txt size={80} color={C.yellow} shadow={C.red} p={backOut((t - 14) / 12)}>EL RANKING DE CAMPEONES</Txt></div>
					<div style={{position: 'absolute', left: 230, right: 230, top: 150, display: 'flex', flexDirection: 'column', gap: 10}}>
						{RANK_ORDER.map((k, j) => {
							const yrs = titlesOf(k);
							const pIn = easeOut((t - RANK_IN(j)) / 16);
							const top = j === 0;
							return (
								<div key={k} style={{height: 80, display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', borderRadius: 18, background: top ? 'rgba(255,210,63,0.95)' : 'rgba(11,30,63,0.95)', border: `5px solid ${top ? C.navy : C.yellow}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)', transform: `translateX(${(1 - pIn) * (j % 2 ? 1500 : -1500)}px) scale(${top ? 1 + 0.02 * Math.sin(f / 6) : 1})`}}>
									<span style={{width: 50, fontFamily: LILITA, fontSize: 46, color: top ? C.navy : C.yellow}}>{j + 1}º</span>
									<Flag k={k} w={80} />
									<span style={{width: 260, fontFamily: LILITA, fontSize: 44, color: top ? C.navy : '#fff', whiteSpace: 'nowrap'}}>{nm(k)}</span>
									<div style={{display: 'flex', gap: 2, width: 270}}>{yrs.map((_, s) => <Star key={s} s={50} col={top ? '#fff' : C.yellow} style={{transform: `scale(${backOut((t - RANK_IN(j) - 10 - s * 6) / 10)})`}} />)}</div>
									<div style={{flex: 1, display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end'}}>
										{yrs.map((y, s) => <span key={y} style={{padding: '2px 8px', borderRadius: 8, background: top ? C.navy : 'rgba(255,255,255,0.12)', fontFamily: LILITA, fontSize: 24, color: top ? C.yellow : '#fff', transform: `scale(${backOut((t - RANK_IN(j) - 20 - s * 6) / 10)})`}}>{y}</span>)}
									</div>
								</div>
							);
						})}
					</div>
				</AbsoluteFill>
			)}
			{p2 && (() => {
				const u = t - 900;
				const card = (j: number, col: string, title: string, body: React.ReactNode) => (
					<div style={{transform: `scale(${backOut((u - 30 - j * 90) / 14)})`, width: 700, height: 300, borderRadius: 28, background: 'rgba(11,30,63,0.96)', border: `6px solid ${col}`, boxShadow: '0 10px 0 rgba(0,0,0,0.35)', padding: '18px 26px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12}}>
						<div style={{fontFamily: LILITA, fontSize: 42, color: col}}>{title}</div>
						{body}
					</div>
				);
				return (
					<>
						<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center'}}><Txt size={76} p={backOut((u - 4) / 12)}>LOS NÚMEROS DE LOS CAMPEONES</Txt></div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'grid', gridTemplateColumns: '700px 700px', gap: 30, justifyContent: 'center'}}>
							{card(0, '#4FC3F7', 'EUROPA 13 · SUDAMÉRICA 10', (
								<>
									<div style={{display: 'flex', height: 70, borderRadius: 16, overflow: 'hidden', border: `4px solid ${C.navy}`}}>
										<div style={{width: `${(13 / 23) * 100}%`, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 40, color: '#fff'}}>13</div>
										<div style={{flex: 1, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 40, color: '#fff'}}>10</div>
									</div>
									<div style={{fontFamily: LILITA, fontSize: 32, color: '#fff', lineHeight: 1.15}}>Ningún país de otro continente ha ganado nunca</div>
								</>
							))}
							{card(1, C.yellow, '6 ANFITRIONES CAMPEONES', (
								<>
									<div style={{display: 'flex', gap: 10}}>{([['URY', 1930], ['ITA', 1934], ['ENG', 1966], ['GER', 1974], ['ARG', 1978], ['FRA', 1998]] as [string, number][]).map(([k, y]) => <div key={y} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}><Flag k={k} w={88} /><span style={{fontFamily: LILITA, fontSize: 26, color: C.yellow}}>{y}</span></div>)}</div>
									<div style={{fontFamily: LILITA, fontSize: 32, color: '#fff', lineHeight: 1.15}}>Ganaron el Mundial jugando en casa</div>
								</>
							))}
							{card(2, GREEN, 'ALEMANIA: 8 FINALES', (
								<>
									<div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>{EDS.filter((e) => TITLE_KEY(e.win) === 'GER' || TITLE_KEY(e.lose) === 'GER').map((e) => <span key={e.y} style={{padding: '4px 10px', borderRadius: 10, background: TITLE_KEY(e.win) === 'GER' ? GREEN : '#55607A', fontFamily: LILITA, fontSize: 30, color: '#fff'}}>{e.y}</span>)}</div>
									<div style={{fontFamily: LILITA, fontSize: 32, color: '#fff', lineHeight: 1.15}}>Más finales que nadie: ganó 4 y perdió 4</div>
								</>
							))}
							{card(3, RED, 'HOLANDA: 3 FINALES, 0 TÍTULOS', (
								<>
									<div style={{display: 'flex', gap: 16, alignItems: 'center'}}><Flag k="NLD" w={110} />{[1974, 1978, 2010].map((y) => <span key={y} style={{padding: '4px 12px', borderRadius: 10, background: '#55607A', fontFamily: LILITA, fontSize: 34, color: '#fff'}}>{y}</span>)}</div>
									<div style={{fontFamily: LILITA, fontSize: 32, color: '#fff', lineHeight: 1.15}}>La mejor selección que nunca ha sido campeona</div>
								</>
							))}
						</div>
					</>
				);
			})()}
		</AbsoluteFill>
	);
};

// ---------------- OUTRO ----------------
const Outro: React.FC<{t: number; f: number}> = ({t, f}) => {
	const outP = (d: number) => backOut((t - d) / 14);
	return (
		<AbsoluteFill style={{background: 'rgba(8,20,40,0.55)'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
				<div style={{transform: `scale(${outP(0)})`, textAlign: 'center'}}>
					<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1.05, color: '#fff', ...strokeText(14)}}>¿QUIÉN SERÁ EL CAMPEÓN</div>
					<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1.05, color: C.yellow, ...strokeText(14)}}>DEL MUNDIAL 2030?</div>
				</div>
				<div style={{display: 'flex', gap: 22}}>
					{['ESP', 'PRT'].map((k, i) => <div key={k} style={{transform: `scale(${outP(60 + i * 14)})`}}><Flag k={k} w={150} /></div>)}
					<div style={{transform: `scale(${outP(88)})`}}><img src={staticFile('flags/ma.svg')} style={{width: 150, height: 105, borderRadius: 13, border: `4px solid ${C.navy}`, boxShadow: '0 0 0 3px #fff', objectFit: 'cover'}} /></div>
				</div>
				<div style={{transform: `scale(${outP(120)})`}}><Pill size={30}>2030: ESPAÑA, PORTUGAL Y MARRUECOS</Pill></div>
				<div style={{transform: `scale(${outP(150)})`}}><Pill size={34} bg="#fff">¡DÍMELO EN LOS COMENTARIOS!</Pill></div>
				<div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 10}}>
					<div style={{transform: `scale(${outP(240)}) rotate(${Math.sin(f / 10) * 4}deg)`}}><Hincha iso="balon" mood="feliz" size={170} scarf={['#FFD23F', '#E63946']} blink={blinkAt(f, 3)} /></div>
					<Subscribe f={t} start={300} />
				</div>
				<div style={{transform: `scale(${outP(260)})`, fontFamily: LILITA, fontSize: 46, color: '#fff', ...strokeText(10)}}>EL MAPA HINCHA</div>
			</div>
			{t >= OUTRO - 40 && <AbsoluteFill style={{background: '#000', opacity: clamp01((t - OUTRO + 40) / 40)}} />}
		</AbsoluteFill>
	);
};
export type {Mood};
