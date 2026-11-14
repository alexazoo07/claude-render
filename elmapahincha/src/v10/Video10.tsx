import React, {useMemo} from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {WorldLayer, Vis, WCam, WORLD, bboxOf} from '../v5/WorldLayer5';
import {Hincha, Mood} from '../Hincha';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {C} from '../data';
import {backOut, clamp01, easeInOut, easeOut, elastic, Panel, Pill, strokeText} from '../ui';
import {blinkAt, camPath, Confetti, Key, Subscribe, Trophy} from '../common';
import {FlagPreload} from '../v2/Preload';
import {ALL_FLAGS10, ALL_KEYS, CATS, CAT_COL, Match, NEXT_NAME, ovr, REAL, ROUND_NAME, ROUNDS, TEAMS, Team} from './data10';

const FPS = 60;
const GREEN = '#2EC46B', RED = C.red, BLUE = '#2F7DE1';
// ---------------- timeline ----------------
export const HOOK = 1200;
const INTRO = 600;
const BRK = 360;
const CHAMP = 960;
const OUTRO = 660;
const BEAT = 200, INFO0 = 160, PROB = 130, BANNER = 70, KICK = 46, POST = 210;
const M90 = [600, 660, 720, 960];
type Beat = {kind: 'fact'; team: string; text: string} | {kind: 'real'; text: string} | {kind: 'path'; team: string};
export type MI = {m: Match; r: number; i: number; from: number; beats: Beat[]; PRE: number; K: number; M: number; etS: number; etF: number; penS: number; E: number; dur: number};
const keyOf = (m: Match) => `${m.a}-${m.b}`;
const usedFacts: Record<string, number> = {};
const nextFact = (k: string): string | null => { const i = usedFacts[k] ?? 0; const t = TEAMS[k].facts[i]; if (!t) return null; usedFacts[k] = i + 1; return t; };
type Seg = {kind: 'bracket'; from: number; dur: number; r: number} | {kind: 'match'; from: number; dur: number; mi: MI};
export const SEGS: Seg[] = [];
export const MATCHES: MI[] = [];
let _t = HOOK + INTRO;
ROUNDS.forEach((ms, r) => {
	SEGS.push({kind: 'bracket', from: _t, dur: BRK, r}); _t += BRK;
	ms.forEach((m, i) => {
		const beats: Beat[] = [];
		const real = REAL[keyOf(m)];
		const fact = (k: string): Beat => { const t = nextFact(k); return t ? {kind: 'fact', team: k, text: t} : {kind: 'path', team: k}; };
		if (r === 0) { beats.push(fact(m.a), fact(m.b)); if (real) beats.push({kind: 'real', text: real}); }
		else if (r < 3) { if (real) beats.push({kind: 'real', text: real}); beats.push(fact(m.a), fact(m.b)); }
		else { beats.push({kind: 'real', text: real}, {kind: 'path', team: m.a}, {kind: 'path', team: m.b}, fact(m.a), fact(m.b)); }
		const PRE = INFO0 + beats.length * BEAT;
		const K = PRE + PROB;
		const M = M90[r];
		const etF = Math.round(M * 0.36);
		const etS = K + M + BANNER;
		const penS = m.et ? etS + etF : K + M;
		const E = m.pens ? penS + BANNER + m.pens.seq.length * KICK + 30 : m.et ? etS + etF : K + M;
		const dur = E + (r === 3 ? 150 : POST);
		const mi: MI = {m, r, i, from: _t, beats, PRE, K, M, etS, etF, penS, E, dur};
		MATCHES.push(mi); SEGS.push({kind: 'match', from: _t, dur, mi}); _t += dur;
	});
});
export const CHAMP0 = _t;
export const OUTRO0 = CHAMP0 + CHAMP;
export const V10_TOTAL = OUTRO0 + OUTRO;
const CHAMPION = ROUNDS[3][0].win;

// match helpers
const goalFrame = (mi: MI, m: number) => (m <= 90 ? mi.K + (m / 90) * mi.M : mi.etS + ((m - 90) / 30) * mi.etF);
const minuteAt = (mi: MI, t: number): number | null => {
	if (t < mi.K) return null;
	if (t < mi.K + mi.M) return Math.floor(((t - mi.K) / mi.M) * 90) + 1;
	if (!mi.m.et) return 90;
	if (t < mi.etS) return 90;
	return Math.min(120, 90 + Math.floor(((t - mi.etS) / mi.etF) * 30) + 1);
};
const scoreAt = (mi: MI, t: number) => {
	let a = 0, b = 0;
	for (const g of mi.m.goals) if (goalFrame(mi, g.m) <= t) { if (g.t === mi.m.a) a++; else b++; }
	return [a, b];
};
const penFrame = (mi: MI, j: number) => mi.penS + BANNER + j * KICK + 20;
const loser = (m: Match) => (m.win === m.a ? m.b : m.a);
const resultTxt = (m: Match) => `${m.ga}-${m.gb}${m.pens ? ` (${m.pens.a}-${m.pens.b} pen.)` : m.et ? ' (pr.)' : ''}`;

// ---------------- camera ----------------
const fitBox = (keys: string[], cx = 960, cy = 470, w = 760, h = 470): WCam => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of keys) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	const z = Math.max(0.4, Math.min(3.2, Math.min(w / (x1 - x0 + 40), h / (y1 - y0 + 40))));
	return {x: (x0 + x1) / 2 + (960 - cx) / z, y: (y0 + y1) / 2 + (540 - cy) / z, z};
};
const WORLD_VIEW: WCam = {x: 1700, y: 900, z: 0.55};
const KEYS_CAM: Key[] = (() => {
	const k: Key[] = [];
	const add = (f: number, c: WCam) => k.push([f, c.x, c.y, c.z]);
	add(0, {x: 1500, y: 1000, z: 0.62}); add(HOOK - 20, {x: 1600, y: 950, z: 0.7});
	add(HOOK + 40, WORLD_VIEW); add(HOOK + INTRO, {...WORLD_VIEW, z: 0.58});
	for (const s of SEGS) {
		if (s.kind === 'bracket') { add(s.from + 50, WORLD_VIEW); add(s.from + s.dur - 10, {...WORLD_VIEW, z: 0.6}); }
		else { const c = fitBox([s.mi.m.a, s.mi.m.b]); add(s.from + 50, c); add(s.from + s.dur - 10, {...c, z: c.z * 1.08}); }
	}
	const cc = fitBox([CHAMPION], 1300, 560, 700, 640);
	add(CHAMP0 + 60, cc); add(OUTRO0 - 10, {...cc, z: cc.z * 1.08});
	add(OUTRO0 + 60, WORLD_VIEW); add(V10_TOTAL, {...WORLD_VIEW, z: 0.6});
	k.sort((a, b) => a[0] - b[0]);
	return k;
})();

// ---------------- hook timing ----------------
const H_SEL = 300, H_VS = 540, H_RAPID = 780, H_END = HOOK;
const GRID = ['BRA', 'ESP', 'HUN', 'NLD', 'ARG', 'DEU', 'FRA', 'ITA', 'URY', 'ENG', 'PRT', 'HRV', 'BEL', 'MAR', 'CHL', 'MEX'];
const P1_PATH = [8, 9, 1, 2, 10, 3, 4, 0], P2_PATH = [15, 14, 6, 5, 13, 12, 4, 1];
const RAPID: [string, string][] = [['HUN', 'DEU'], ['NLD', 'ARG'], ['URY', 'FRA']];

// ---------------- sfx & music ----------------
export const v10Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f: Math.round(f), name, vol});
	S(0, 'whoosh_4', 0.45); S(8, 'slap', 0.45); S(30, 'riser', 0.25);
	GRID.forEach((_, i) => S(24 + i * 4, `pop_${(i % 4) + 1}`, 0.25));
	P1_PATH.forEach((_, i) => { S(110 + i * 18, 'select', 0.3); });
	P2_PATH.forEach((_, i) => { S(118 + i * 18, 'click', 0.3); });
	S(258, 'confirm', 0.45); S(262, 'crowd_roar', 0.25);
	S(H_SEL, 'whoosh_2', 0.5); S(H_SEL + 30, 'boom', 0.6); S(H_SEL + 32, 'glass', 0.3);
	[0, 1, 2, 3].forEach((k) => { S(H_SEL + 70 + k * 16, 'up', 0.28); S(H_SEL + 74 + k * 16, 'up', 0.22); });
	S(H_SEL + 160, 'drumroll', 0.4); S(H_SEL + 200, 'crowd_ohh', 0.45);
	RAPID.forEach((_, i) => { const f0 = H_VS + i * 80; S(f0, `whoosh_${(i % 4) + 1}`, 0.45); S(f0 + 12, 'slap', 0.5); S(f0 + 20, 'boom', 0.4); });
	S(H_RAPID, 'whoosh_4', 0.5); S(H_RAPID + 20, 'boom', 0.6);
	for (let k = 0; k < 16; k++) S(H_RAPID + 60 + k * 6, `pop_${(k % 4) + 1}`, 0.3);
	S(H_RAPID + 190, 'slap', 0.5); S(H_RAPID + 260, 'riser', 0.35); S(H_RAPID + 300, 'boom', 0.6); S(H_RAPID + 302, 'crowd_roar', 0.4);
	S(H_END - 8, 'whoosh_1', 0.5); S(H_END + 6, 'whistle_long', 0.35);
	S(HOOK + 30, 'slap', 0.45); [0, 1, 2, 3].forEach((k) => S(HOOK + 60 + k * 24, `pop_${k + 1}`, 0.42)); S(HOOK + 300, 'whoosh_3', 0.4); S(HOOK + 330, 'kick', 0.4); S(HOOK + 400, 'confirm', 0.35);
	for (const sg of SEGS) {
		if (sg.kind === 'bracket') {
			const f0 = sg.from; S(f0, 'whoosh_4', 0.5); S(f0 + 20, 'slap', 0.5);
			const n = ROUNDS[sg.r].length * 2; for (let k = 0; k < n; k++) S(f0 + 70 + k * Math.min(12, 160 / n), `pop_${(k % 4) + 1}`, 0.3);
			S(f0 + 260, 'confirm', 0.35);
			continue;
		}
		const mi = sg.mi; const f0 = sg.from;
		S(f0, `whoosh_${(mi.i % 4) + 1}`, 0.45); S(f0 + 20, 'slap', 0.45); S(f0 + 40, 'pop_1', 0.35); S(f0 + 52, 'pop_2', 0.35);
		for (let k = 0; k < 8; k++) S(f0 + 70 + k * 12, 'tick', 0.15);
		mi.beats.forEach((_, j) => { S(f0 + INFO0 + j * BEAT - 6, 'whoosh_2', 0.22); S(f0 + INFO0 + j * BEAT, 'pop_3', 0.38); });
		S(f0 + mi.PRE, 'whoosh_3', 0.35); S(f0 + mi.PRE + 40, 'confirm', 0.3);
		S(f0 + mi.K, 'whistle_long', 0.4); S(f0 + mi.K + 4, 'crowd_roar', 0.22);
		S(f0 + mi.K + mi.M / 2, 'whistle_short', 0.3);
		for (const g of mi.m.goals) { const gf = f0 + goalFrame(mi, g.m); S(gf - 8, 'kick', 0.45); S(gf, 'boom', 0.5); S(gf + 2, 'crowd_roar', 0.5); }
		S(f0 + mi.K + mi.M, 'whistle_long', 0.4);
		if (mi.m.et) { S(f0 + mi.K + mi.M + 10, 'drumroll', 0.35); S(f0 + mi.etS + mi.etF, 'whistle_long', 0.4); }
		if (mi.m.pens) {
			S(f0 + mi.penS, 'drumroll', 0.45); S(f0 + mi.penS + 20, 'crowd_ohh', 0.3);
			mi.m.pens.seq.forEach((p, j) => { const pf = f0 + penFrame(mi, j); S(pf - 10, 'kick', 0.45); S(pf, p.ok ? 'confirm' : 'error', 0.42); S(pf + 2, p.ok ? 'crowd_roar' : 'crowd_ohh', 0.35); });
		}
		S(f0 + mi.E + 20, 'boom', 0.5); S(f0 + mi.E + 22, 'crowd_roar', 0.45); S(f0 + mi.E + 30, 'glass', 0.25);
		S(f0 + mi.dur - 24, 'whoosh_1', 0.3);
	}
	S(CHAMP0, 'whoosh_4', 0.5); S(CHAMP0 + 20, 'boom', 0.7); S(CHAMP0 + 22, 'crowd_roar', 0.6); S(CHAMP0 + 30, 'whistle_long', 0.35);
	S(CHAMP0 + 200, 'crowd_roar', 0.4); [0, 1, 2, 3].forEach((k) => S(CHAMP0 + 300 + k * 30, `pop_${k + 1}`, 0.42)); S(CHAMP0 + 620, 'pop_3', 0.45); S(CHAMP0 + 700, 'click', 0.4);
	S(OUTRO0, 'whoosh_2', 0.4); S(OUTRO0 + 20, 'slap', 0.45); [0, 1, 2].forEach((i) => S(OUTRO0 + 70 + i * 14, `pop_${i + 1}`, 0.4)); S(OUTRO0 + 300, 'pop_4', 0.4); S(OUTRO0 + 350, 'click', 0.5); S(OUTRO0 + 352, 'bong', 0.35);
	s.sort((a, b) => a.f - b.f);
	return s;
};
export const v10Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	const qf = SEGS.find((s) => s.kind === 'bracket' && s.r === 1)!.from;
	const sf = SEGS.find((s) => s.kind === 'bracket' && s.r === 2)!.from;
	return [`m_tense:0:${sec(HOOK + 30)}`, `m_happy:${sec(HOOK)}:${sec(sf + 40)}`, `m_tense:${sec(sf)}:${sec(CHAMP0 + 40)}`, `m_triumph:${sec(CHAMP0)}:${sec(V10_TOTAL)}`].join(',');
	void qf;
};

// ---------------- small UI ----------------
const Txt: React.FC<{children: React.ReactNode; size?: number; color?: string; p?: number; shadow?: string; style?: React.CSSProperties}> = ({children, size = 84, color = '#fff', p = 1, shadow = C.navy, style}) => (
	<div style={{transform: `scale(${Math.max(0, p)})`, fontFamily: LILITA, fontSize: size, color, ...strokeText(size * 0.15), textShadow: `0 ${size * 0.08}px 0 ${shadow}`, whiteSpace: 'nowrap', lineHeight: 1.05, ...style}}>{children}</div>
);
const Flag: React.FC<{k: string; w: number; style?: React.CSSProperties}> = ({k, w, style}) => <img src={staticFile(`flags/${TEAMS[k].flag}.svg`)} style={{width: w, height: w * 0.7, borderRadius: Math.max(3, w * 0.09), border: `${w > 60 ? 4 : 3}px solid ${C.navy}`, objectFit: 'cover', boxShadow: w > 60 ? '0 0 0 3px #fff' : undefined, flexShrink: 0, ...style}} />;
const f1 = (v: number) => v.toFixed(1).replace('.', ',');
const label = (k: string) => `${TEAMS[k].name.toUpperCase()} ${TEAMS[k].year}`;
const CatIcon: React.FC<{i: number; s: number}> = ({i, s}) => (
	<svg width={s} height={s} viewBox="0 0 40 40">
		{i === 0 && <g fill="#fff"><circle cx={20} cy={20} r={13} fill="none" stroke="#fff" strokeWidth={3.5} /><path d="M20 12 L27 17 L24 26 L16 26 L13 17Z" /></g>}
		{i === 1 && <g fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round"><circle cx={20} cy={20} r={13} /><path d="M7 20 H33" /><circle cx={20} cy={20} r={4} fill="#fff" /></g>}
		{i === 2 && <path d="M20 5 L33 10 V20 Q33 30 20 36 Q7 30 7 20 V10Z" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinejoin="round" />}
		{i === 3 && <path d="M20 4 L24.5 15 L36 15.5 L27 23 L30 35 L20 28.5 L10 35 L13 23 L4 15.5 L15.5 15Z" fill="#fff" />}
	</svg>
);
const Bars: React.FC<{k: string; t: number; w: number; compact?: boolean}> = ({k, t, w, compact}) => (
	<div style={{display: 'flex', flexDirection: 'column', gap: compact ? 6 : 8}}>
		{CATS.map((c, j) => {
			const p = easeOut((t - j * 14) / 34);
			const v = TEAMS[k].r[j];
			return (
				<div key={c} style={{display: 'flex', alignItems: 'center', gap: 10, width: w}}>
					<div style={{width: compact ? 30 : 36, height: compact ? 28 : 34, borderRadius: 8, background: CAT_COL[j], border: `3px solid ${C.navy}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><CatIcon i={j} s={compact ? 20 : 24} /></div>
					{!compact && <div style={{width: 112, fontFamily: RUBIK, fontWeight: 800, fontSize: 17, color: '#fff'}}>{c}</div>}
					<div style={{flex: 1, height: compact ? 16 : 20, borderRadius: 10, background: 'rgba(255,255,255,0.12)', border: `3px solid ${C.navy}`, overflow: 'hidden'}}>
						<div style={{width: `${v * p}%`, height: '100%', background: CAT_COL[j]}} />
					</div>
					<div style={{width: compact ? 36 : 44, textAlign: 'right', fontFamily: LILITA, fontSize: compact ? 24 : 28, color: '#fff'}}>{Math.round(v * p)}</div>
				</div>
			);
		})}
	</div>
);

// ---------------- ticker ----------------
const TICKER = [
	'SIMULACIÓN HIPOTÉTICA: CADA SELECCIÓN EN SU MEJOR MOMENTO DE LA HISTORIA',
	'VALORACIÓN = MEDIA DE ATAQUE, CENTRO, DEFENSA Y ESTRELLA (DE 0 A 100)',
	'16 SELECCIONES · 15 PARTIDOS · 1 SOLO CAMPEÓN',
	'BRASIL 1970 GANÓ SUS 6 PARTIDOS DEL MUNDIAL Y MARCÓ 19 GOLES',
	'HUNGRÍA 1954 ESTUVO 31 PARTIDOS SEGUIDOS SIN PERDER',
	'EMPATE = PRÓRROGA DE 30 MINUTOS Y, SI SIGUE IGUAL, PENALTIS',
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
			<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 330, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: C.yellow, fontFamily: LILITA, fontSize: 28, color: C.navy, boxShadow: '6px 0 12px rgba(0,0,0,0.4)'}}>
				<div style={{transform: 'scale(0.17)', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Trophy size={200} /></div>
				TORNEO DE LEYENDAS
			</div>
		</div>
	);
};

// ---------------- main ----------------
export const Video10: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS_CAM, f, 10);
	const seg = SEGS.find((s) => f >= s.from && f < s.from + s.dur);
	const mi = seg?.kind === 'match' ? seg.mi : null;
	const t = seg ? f - seg.from : 0;
	// which teams are alive/eliminated at frame f
	const elim = new Set<string>();
	for (const x of MATCHES) if (f >= x.from + x.E + 20) elim.add(loser(x.m));
	const vis: Record<string, Vis> = {};
	const showAll = f >= HOOK + 40;
	if (showAll) ALL_KEYS.forEach((k, j) => {
		const tp = f - (HOOK + 40 + j * 5);
		if (tp < 0) return;
		const out = elim.has(k);
		let mood: Mood = out ? 'triste' : 'feliz';
		let faceScale = 1, glow: string | undefined;
		let look: [number, number] = [0, 0];
		if (mi && (k === mi.m.a || k === mi.m.b)) {
			const other = k === mi.m.a ? mi.m.b : mi.m.a;
			const [ax, ay] = WORLD[k].c, [bx, by] = WORLD[other].c; const dl = Math.hypot(bx - ax, by - ay) || 1; look = [(bx - ax) / dl, (by - ay) / dl];
			faceScale = 1.3; glow = C.yellow; mood = 'enfado';
			if (t >= mi.K) mood = 'miedo';
			const lastG = [...mi.m.goals].reverse().find((g) => goalFrame(mi, g.m) <= t && t < goalFrame(mi, g.m) + 90);
			if (lastG) mood = lastG.t === k ? 'grito' : 'triste';
			if (t >= mi.E + 20) { mood = mi.m.win === k ? 'grito' : 'ko'; glow = mi.m.win === k ? GREEN : RED; }
		}
		if (f >= CHAMP0 && k === CHAMPION) { mood = 'grito'; faceScale = 1.4; glow = C.yellow; }
		vis[k] = {flag: TEAMS[k].flag, pop: Math.max(0, elastic(tp / FPS)), mood, look, blink: blinkAt(f, j), open: 0.5 + 0.5 * Math.sin(f / 4 + j), faceScale, glow, color: '#3A4660', colorMix: out && !(mi && (k === mi.m.a || k === mi.m.b)) ? 0.72 : 0};
	});
	// goal flash shake
	let shake = 0;
	if (mi) {
		for (const g of mi.m.goals) { const d = t - goalFrame(mi, g.m); if (d >= 0 && d < 16) shake = Math.sin(f * 3) * (16 - d) * 0.9; }
		if (t >= mi.E + 20 && t < mi.E + 36) shake = Math.sin(f * 3) * (mi.E + 36 - t) * 0.9;
	}
	if (f >= H_SEL + 30 && f < H_SEL + 46) shake = Math.sin(f * 3) * (H_SEL + 46 - f);
	if (f >= CHAMP0 + 20 && f < CHAMP0 + 40) shake = Math.sin(f * 3) * (CHAMP0 + 40 - f);
	const tickIn = f >= HOOK && f < OUTRO0 ? easeOut((f - HOOK) / 24) * (1 - easeInOut((f - OUTRO0 + 30) / 24)) : 0;
	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			<FlagPreload flags={ALL_FLAGS10} />
			<AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
				<WorldLayer cam={cam} vis={vis} ring={null}>
					{mi && <Rivalry mi={mi} t={t} z={cam.z} f={f} />}
				</WorldLayer>
				{f < H_END + 20 && <Hook f={f} />}
				{f >= HOOK - 10 && f < HOOK + INTRO + 20 && <Intro t={f - HOOK} f={f} />}
				{seg?.kind === 'bracket' && <Bracket r={seg.r} t={t} f={f} dur={seg.dur} />}
				{mi && <MatchScene mi={mi} t={t} f={f} />}
				{f >= CHAMP0 && f < OUTRO0 + 20 && <Champion t={f - CHAMP0} f={f} />}
				{f >= OUTRO0 && <Outro t={f - OUTRO0} f={f} />}
				{f >= CHAMP0 && f < OUTRO0 && <Confetti f={f} start={CHAMP0 + 20} n={180} />}
				{mi && mi.r === 3 && t >= mi.E + 20 && <Confetti f={f} start={mi.from + mi.E + 20} n={120} />}
			</AbsoluteFill>
			{f >= HOOK - 14 && f < HOOK + 16 && <AbsoluteFill style={{background: '#fff', opacity: 0.85 * Math.sin(clamp01((f - HOOK + 14) / 30) * Math.PI)}} />}
			{tickIn > 0 && <Ticker f={f} y={(1 - tickIn) * 80} />}
		</AbsoluteFill>
	);
};

// dashed arc between the two rivals on the map
const Rivalry: React.FC<{mi: MI; t: number; z: number; f: number}> = ({mi, t, z, f}) => {
	const [ax, ay] = WORLD[mi.m.a].c, [bx, by] = WORLD[mi.m.b].c;
	const p = easeOut((t - 60) / 40) * (1 - easeInOut((t - mi.dur + 30) / 20));
	if (p <= 0) return null;
	const mx = (ax + bx) / 2, my = (ay + by) / 2 - Math.hypot(bx - ax, by - ay) * 0.25;
	const k = 1 / z;
	const d = `M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`;
	const vx = (ax + 2 * mx + bx) / 4, vy = (ay + 2 * my + by) / 4;
	return (
		<g opacity={p}>
			<path d={d} fill="none" stroke={C.navy} strokeWidth={10 * k} strokeLinecap="round" />
			<path d={d} fill="none" stroke={C.yellow} strokeWidth={5 * k} strokeDasharray={`${16 * k} ${12 * k}`} strokeDashoffset={-f * 1.2 * k} strokeLinecap="round" />
			<g transform={`translate(${vx} ${vy}) scale(${k * backOut((t - 70) / 14)})`}>
				<circle r={34} fill={C.red} stroke={C.navy} strokeWidth={6} />
				<text y={13} textAnchor="middle" fontFamily="Lilita" fontSize={36} fill="#fff">VS</text>
			</g>
		</g>
	);
};

// ---------------- HOOK ----------------
const Tile: React.FC<{k: string; w: number; h: number; dim?: number}> = ({k, w, h, dim = 0}) => (
	<div style={{width: w, height: h, borderRadius: 16, background: 'linear-gradient(170deg, #22457F, #122A55)', border: `5px solid ${C.navy}`, boxShadow: '0 6px 0 rgba(0,0,0,0.4)', overflow: 'hidden', display: 'flex', flexDirection: 'column', filter: dim ? `brightness(${1 - dim * 0.55})` : undefined, boxSizing: 'border-box'}}>
		<img src={staticFile(`flags/${TEAMS[k].flag}.svg`)} style={{width: '100%', height: h * 0.56, objectFit: 'cover', borderBottom: `4px solid ${C.navy}`}} />
		<div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
			<div style={{fontFamily: LILITA, fontSize: TEAMS[k].name.length > 8 ? 25 : 29, color: '#fff', lineHeight: 1}}>{TEAMS[k].name.toUpperCase()}</div>
			<div style={{fontFamily: LILITA, fontSize: 30, color: C.yellow, lineHeight: 1.05}}>{TEAMS[k].year}</div>
		</div>
	</div>
);
const VSCard: React.FC<{k: string; side: 0 | 1; t: number}> = ({k, side, t}) => {
	const T = TEAMS[k];
	const p = backOut((t - 6) / 16);
	return (
		<div style={{transform: `translateX(${(1 - p) * (side ? 900 : -900)}px) rotate(${side ? 2 : -2}deg)`, width: 680}}>
			<Panel style={{padding: '18px 24px 22px', borderColor: side ? BLUE : RED}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<Flag k={k} w={150} />
					<div>
						<div style={{fontFamily: LILITA, fontSize: 70, color: '#fff', lineHeight: 1}}>{T.name.toUpperCase()}</div>
						<div style={{fontFamily: LILITA, fontSize: 64, color: C.yellow, lineHeight: 1}}>{T.year}</div>
					</div>
				</div>
				<div style={{marginTop: 12, fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.85)'}}>ESTRELLA: <span style={{color: '#fff'}}>{T.star.toUpperCase()}</span></div>
				<div style={{marginTop: 12}}><Bars k={k} t={t - 70} w={630} /></div>
			</Panel>
		</div>
	);
};
const Hook: React.FC<{f: number}> = ({f}) => {
	const out = easeInOut((f - H_END + 16) / 16);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(10,25,60,0.55) 0%, rgba(5,10,30,0.9) 100%)'}} />
			{f < H_SEL + 10 && <SelectScreen f={f} />}
			{f >= H_SEL && f < H_VS && <VSScreen a="BRA" b="ESP" t={f - H_SEL} />}
			{f >= H_VS && f < H_RAPID && (() => {
				const i = Math.min(2, Math.floor((f - H_VS) / 80)); const u = f - H_VS - i * 80; const [a, b] = RAPID[i];
				return (
					<AbsoluteFill>
						<div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, background: `linear-gradient(90deg, rgba(230,57,70,0.55), rgba(230,57,70,0.1))`, transform: `translateX(${(1 - easeOut(u / 10)) * -960}px)`}} />
						<div style={{position: 'absolute', right: 0, top: 0, width: 960, height: 1080, background: `linear-gradient(270deg, rgba(47,125,225,0.55), rgba(47,125,225,0.1))`, transform: `translateX(${(1 - easeOut(u / 10)) * 960}px)`}} />
						{[a, b].map((k, s) => (
							<div key={k} style={{position: 'absolute', top: 300, left: s ? 1080 : 120, width: 720, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transform: `scale(${backOut((u - 4 - s * 4) / 12)})`}}>
								<Flag k={k} w={300} />
								<Txt size={78}>{TEAMS[k].name.toUpperCase()}</Txt>
								<Txt size={70} color={C.yellow} shadow={C.red}>{TEAMS[k].year}</Txt>
							</div>
						))}
						<div style={{position: 'absolute', left: 960 - 110, top: 360, width: 220, height: 220, borderRadius: '50%', background: C.yellow, border: `10px solid ${C.navy}`, boxShadow: '0 0 0 7px #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${backOut((u - 12) / 10)}) rotate(-8deg)`}}><Txt size={110} color={C.red}>VS</Txt></div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center'}}><Txt size={64} p={backOut(u / 10)}>¿Y ESTE PARTIDO?</Txt></div>
					</AbsoluteFill>
				);
			})()}
			{f >= H_RAPID && <HookFinale t={f - H_RAPID} f={f} />}
		</AbsoluteFill>
	);
};
const SelectScreen: React.FC<{f: number}> = ({f}) => {
	const W = 200, Hh = 236, G = 18;
	const x0 = (1920 - (8 * W + 7 * G)) / 2;
	const pos = (i: number) => ({x: x0 + (i % 8) * (W + G), y: 300 + Math.floor(i / 8) * (Hh + G)});
	const cur = (path: number[], start: number) => { const j = Math.max(0, Math.min(path.length - 1, Math.floor((f - start) / 18))); return f < start ? -1 : path[j]; };
	const c1 = cur(P1_PATH, 110), c2 = cur(P2_PATH, 118);
	const locked = f >= 258;
	const out = easeInOut((f - H_SEL + 10) / 10);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
				<Txt size={58} p={backOut((f - 4) / 12)}>¿Y SI LAS MEJORES SELECCIONES DE LA HISTORIA</Txt>
				<Txt size={80} color={C.yellow} shadow={C.red} p={backOut((f - 16) / 12)}>SE ENFRENTARAN?</Txt>
			</div>
			{GRID.map((k, i) => {
				const {x, y} = pos(i);
				const p = backOut((f - 24 - i * 4) / 12);
				const sel = locked && (k === 'BRA' || k === 'ESP');
				return <div key={k} style={{position: 'absolute', left: x, top: y, transform: `scale(${Math.max(0, p) * (sel ? 1.08 + 0.03 * Math.sin(f / 3) : 1)})`}}><Tile k={k} w={W} h={Hh} dim={locked && !sel ? 1 : 0} /></div>;
			})}
			{[[c1, RED, '1P'], [c2, BLUE, '2P']].map(([c, col, lab], s) => {
				if ((c as number) < 0) return null;
				const {x, y} = pos(c as number);
				return (
					<div key={s} style={{position: 'absolute', left: x - 10, top: y - 10, width: W + 20, height: Hh + 20, borderRadius: 22, border: `8px solid ${col}`, boxShadow: `0 0 0 4px #fff`, transform: locked ? `scale(${1.08 + 0.03 * Math.sin(f / 3)})` : undefined}}>
						<div style={{position: 'absolute', left: s ? undefined : -8, right: s ? -8 : undefined, top: -44, padding: '2px 14px', borderRadius: 10, background: col as string, border: `4px solid ${C.navy}`, fontFamily: LILITA, fontSize: 30, color: '#fff'}}>{lab}</div>
					</div>
				);
			})}
			<div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center'}}>
				{locked ? <Txt size={70} color={C.yellow} shadow={C.red} p={backOut((f - 258) / 10)}>¡LISTOS!</Txt> : <Pill size={30} style={{transform: `scale(${backOut((f - 90) / 12)})`}}>CADA SELECCIÓN EN SU MEJOR MOMENTO</Pill>}
			</div>
		</AbsoluteFill>
	);
};
const VSScreen: React.FC<{a: string; b: string; t: number}> = ({a, b, t}) => (
	<AbsoluteFill>
		<div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, background: 'linear-gradient(90deg, rgba(230,57,70,0.5), rgba(230,57,70,0))'}} />
		<div style={{position: 'absolute', right: 0, top: 0, width: 960, height: 1080, background: 'linear-gradient(270deg, rgba(47,125,225,0.5), rgba(47,125,225,0))'}} />
		<div style={{position: 'absolute', left: 90, top: 210}}><VSCard k={a} side={0} t={t} /></div>
		<div style={{position: 'absolute', right: 90, top: 210}}><VSCard k={b} side={1} t={t} /></div>
		<div style={{position: 'absolute', left: 960 - 120, top: 380, width: 240, height: 240, borderRadius: '50%', background: C.yellow, border: `10px solid ${C.navy}`, boxShadow: '0 0 0 8px #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${t < 30 ? 0 : 1 + 2 * (1 - easeOut((t - 30) / 12))}) rotate(-8deg)`, opacity: clamp01((t - 30) / 6)}}><Txt size={120} color={C.red}>VS</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 50, display: 'flex', justifyContent: 'center'}}><Txt size={76} p={backOut((t - 4) / 12)}>BRASIL DE PELÉ CONTRA EL TIKI-TAKA</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center'}}><Txt size={96} color={C.yellow} shadow={C.red} p={backOut((t - 170) / 12)}>¿QUIÉN GANARÍA?</Txt></div>
	</AbsoluteFill>
);
const HookFinale: React.FC<{t: number; f: number}> = ({t, f}) => {
	const R = 330;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(255,210,63,0.25) 0%, rgba(5,10,30,0) 60%)'}} />
			{GRID.map((k, i) => {
				const a = (i / 16) * Math.PI * 2 - Math.PI / 2 + t / 300;
				const p = backOut((t - 60 - i * 6) / 12);
				const x = 960 + Math.cos(a) * R * 1.55, y = 540 + Math.sin(a) * R;
				return <div key={k} style={{position: 'absolute', left: x - 55, top: y - 39, transform: `scale(${Math.max(0, p)})`}}><Flag k={k} w={110} /></div>;
			})}
			<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 1 - clamp01((t - 296) / 6)}}>
				<Txt size={170} color={C.yellow} shadow={C.red} p={backOut((t - 20) / 14)}>16</Txt>
				<Txt size={70} p={backOut((t - 34) / 12)}>SELECCIONES</Txt>
				<Txt size={46} color="#fff" p={backOut((t - 190) / 12)}>EN SU MEJOR MOMENTO</Txt>
			</div>
			{t >= 300 && (
				<AbsoluteFill style={{background: 'rgba(5,10,30,0.6)'}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
						<div style={{transform: `scale(${backOut((t - 300) / 14) * (1 + 0.04 * Math.sin(f / 5))})`}}><Trophy size={360} /></div>
						<Txt size={110} color={C.yellow} shadow={C.red} p={backOut((t - 310) / 12)}>1 SOLO CAMPEÓN</Txt>
						<Txt size={50} p={backOut((t - 340) / 12)}>¿QUIÉN CREES QUE GANA? COMÉNTALO</Txt>
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------------- INTRO: how it works ----------------
const Intro: React.FC<{t: number; f: number}> = ({t, f}) => {
	const out = easeInOut((t - INTRO + 24) / 20);
	const p2 = t >= 300;
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{background: 'rgba(5,15,35,0.5)'}} />
			{!p2 && (
				<>
					<div style={{position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', justifyContent: 'center'}}><Txt size={86} p={backOut((t - 20) / 12)}>VALORAMOS CADA SELECCIÓN EN</Txt></div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 290, display: 'flex', justifyContent: 'center', gap: 34}}>
						{CATS.map((c, k) => {
							const p = backOut((t - 60 - k * 24) / 12);
							return (
								<div key={c} style={{transform: `scale(${Math.max(0, p)}) rotate(${(k % 2 ? 3 : -3) * (1 - p)}deg)`, width: 360, height: 400, borderRadius: 30, background: CAT_COL[k], border: `7px solid ${C.navy}`, boxShadow: '0 0 0 6px #fff, 0 14px 0 rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18}}>
									<div style={{width: 170, height: 170, borderRadius: 85, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><CatIcon i={k} s={110} /></div>
									<div style={{fontFamily: LILITA, fontSize: 56, color: C.navy}}>{c}</div>
									<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: C.navy, opacity: 0.8}}>DE 0 A 100</div>
								</div>
							);
						})}
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center'}}><Txt size={60} color={C.yellow} p={backOut((t - 190) / 12)}>LA MEDIA ES SU VALORACIÓN</Txt></div>
				</>
			)}
			{p2 && (() => {
				const u = t - 300;
				const rows: [string, string, string][] = [['1', 'CADA PARTIDO SE SIMULA UNA VEZ CON ESAS NOTAS', GREEN], ['2', 'SI HAY EMPATE: PRÓRROGA DE 30 MINUTOS', C.yellow], ['3', 'SI SIGUE EL EMPATE: PENALTIS', RED]];
				return (
					<>
						<div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center'}}><Txt size={96} p={backOut((u - 4) / 12)}>LAS REGLAS</Txt></div>
						<div style={{position: 'absolute', left: 260, right: 260, top: 300, display: 'flex', flexDirection: 'column', gap: 28}}>
							{rows.map(([n, s, col], k) => (
								<div key={n} style={{display: 'flex', alignItems: 'center', gap: 24, transform: `translateX(${(1 - easeOut((u - 30 - k * 40) / 16)) * -1400}px)`}}>
									<div style={{width: 110, height: 110, borderRadius: 55, background: col, border: `7px solid ${C.navy}`, boxShadow: '0 0 0 5px #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 70, color: C.navy}}>{n}</div>
									<div style={{flex: 1, padding: '20px 30px', borderRadius: 24, background: 'rgba(11,30,63,0.95)', border: `5px solid ${col}`, fontFamily: LILITA, fontSize: 46, color: '#fff'}}>{s}</div>
								</div>
							))}
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center'}}><Pill size={34} bg="#fff" style={{transform: `scale(${backOut((u - 170) / 12)})`}}>ES HIPOTÉTICO: ¡NO TE ENFADES SI PIERDE LA TUYA!</Pill></div>
					</>
				);
			})()}
			{void f}
		</AbsoluteFill>
	);
};

// ---------------- BRACKET ----------------
const SW = 240, SH = 62;
const slotPos = (round: number, idx: number): {x: number; y: number} => {
	// round 0: 16 slots (8 per side); round 1: 8; round 2: 4; round 3 (final): 2
	if (round === 3) return {x: 960 - SW / 2, y: idx === 0 ? 470 : 600};
	const per = 16 >> round; const half = per / 2;
	const side = idx < half ? 0 : 1; const j = idx % half;
	const gap = 860 / half;
	const y = 150 + gap * j + gap / 2 - SH / 2;
	const xs = [30, 300, 570];
	const x = side === 0 ? xs[round] : 1920 - xs[round] - SW;
	return {x, y};
};
const Bracket: React.FC<{r: number; t: number; f: number; dur: number}> = ({r, t, f, dur}) => {
	const out = easeInOut((t - dur + 24) / 20);
	const inn = easeOut(t / 20);
	// teams per round
	const teamsAt = (round: number): string[] => (round === 0 ? ROUNDS[0].flatMap((m) => [m.a, m.b]) : ROUNDS[round - 1].map((m) => m.win));
	const slots: {k: string; round: number; idx: number; res?: string; won?: boolean; delay: number}[] = [];
	for (let round = 0; round <= r; round++) {
		const ts = teamsAt(round);
		ts.forEach((k, idx) => {
			const m = ROUNDS[round][Math.floor(idx / 2)];
			const done = round < r;
			slots.push({k, round, idx, res: done ? String(idx % 2 ? m.gb : m.ga) + (m.pens ? ` (${idx % 2 ? m.pens.b : m.pens.a})` : '') : undefined, won: done ? m.win === k : undefined, delay: round === r ? 70 + idx * Math.min(12, 160 / ts.length) : 0});
		});
	}
	const lines: React.ReactNode[] = [];
	for (let round = 0; round < Math.min(r, 3); round++) {
		const n = 16 >> round;
		for (let idx = 0; idx < n; idx += 2) {
			const a = slotPos(round, idx), b = slotPos(round, idx + 1), c = slotPos(round + 1, idx / 2);
			const left = round === 2 ? idx < 2 : idx < n / 2;
			const xe = left ? a.x + SW : a.x;
			const xm = left ? xe + (round === 2 ? 40 : 25) : xe - (round === 2 ? 40 : 25);
			const xc = round === 2 ? (left ? c.x + 20 : c.x + SW - 20) : left ? c.x : c.x + SW;
			const yc = c.y + SH / 2;
			lines.push(<path key={`${round}-${idx}`} d={round === 2 ? `M${xe} ${a.y + SH / 2} H${xc} V${yc - (left ? SH / 2 : -SH / 2)}` : `M${xe} ${a.y + SH / 2} H${xm} V${b.y + SH / 2} H${xe} M${xm} ${yc} H${xc}`} fill="none" stroke="#fff" strokeWidth={4} opacity={0.75} />);
		}
	}
	return (
		<AbsoluteFill style={{opacity: inn * (1 - out)}}>
			<AbsoluteFill style={{background: 'rgba(5,12,30,0.78)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', justifyContent: 'center'}}><Txt size={80} color={C.yellow} shadow={C.red} p={backOut((t - 14) / 12)}>{ROUND_NAME[r]}</Txt></div>
			<div style={{position: 'absolute', left: 960 - 80, top: 240, transform: `scale(${backOut((t - 30) / 14) * (r === 3 ? 1 + 0.04 * Math.sin(f / 5) : 1)})`}}><Trophy size={160} /></div>
			<div style={{position: 'absolute', left: 960 - 60, top: 410, fontFamily: RUBIK, fontWeight: 800, fontSize: 22, letterSpacing: 3, color: C.yellow, width: 120, textAlign: 'center'}}>FINAL</div>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>{lines}</svg>
			{slots.map((s) => {
				const {x, y} = slotPos(s.round, s.idx);
				const p = s.delay ? backOut((t - s.delay) / 12) : 1;
				const lost = s.won === false;
				const cur = s.round === r;
				return (
					<div key={`${s.round}-${s.idx}`} style={{position: 'absolute', left: x, top: y, width: SW, height: SH, transform: `scale(${Math.max(0, p)})`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', boxSizing: 'border-box', borderRadius: 14, background: cur ? 'rgba(255,255,255,0.97)' : s.won ? GREEN : 'rgba(30,45,75,0.95)', border: `4px solid ${cur ? C.yellow : C.navy}`, opacity: lost ? 0.55 : 1, boxShadow: '0 5px 0 rgba(0,0,0,0.35)'}}>
						<Flag k={s.k} w={46} />
						<div style={{flex: 1, minWidth: 0, lineHeight: 1}}>
							<div style={{fontFamily: LILITA, fontSize: TEAMS[s.k].name.length > 8 ? 20 : 23, color: cur || s.won ? C.navy : '#fff', whiteSpace: 'nowrap'}}>{TEAMS[s.k].name.toUpperCase()}</div>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, color: cur || s.won ? C.navy : C.yellow}}>{TEAMS[s.k].year}</div>
						</div>
						{s.res !== undefined && <div style={{fontFamily: LILITA, fontSize: s.res.length > 2 ? 22 : 30, color: s.won ? C.navy : '#fff', whiteSpace: 'nowrap'}}>{s.res}</div>}
					</div>
				);
			})}
			<div style={{position: 'absolute', left: 0, right: 0, top: 940, display: 'flex', justifyContent: 'center'}}>
				<Pill size={26} bg="#fff" style={{transform: `scale(${backOut((t - 250) / 12)})`}}>{r === 0 ? '8 PARTIDOS · EL QUE PIERDE, A CASA' : r === 3 ? 'SOLO QUEDAN DOS' : `QUEDAN ${16 >> r} SELECCIONES`}</Pill>
			</div>
		</AbsoluteFill>
	);
};

// ---------------- MATCH SCENE ----------------
const TeamCard: React.FC<{k: string; side: 0 | 1; t: number; mi: MI}> = ({k, side, t, mi}) => {
	const T = TEAMS[k];
	const p = backOut((t - 30) / 18);
	const out = easeInOut((t - mi.dur + 26) / 22);
	const won = t >= mi.E + 20 ? mi.m.win === k : null;
	const col = won === null ? (side ? BLUE : RED) : won ? GREEN : '#55607A';
	return (
		<div style={{position: 'absolute', top: 150, [side ? 'right' : 'left']: 26, width: 440, transform: `translateX(${((1 - p) + out) * (side ? 600 : -600)}px)`} as React.CSSProperties}>
			<Panel style={{padding: '14px 16px 16px', borderColor: col, filter: won === false ? 'saturate(0.4)' : undefined}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
					<Flag k={k} w={104} />
					<div style={{minWidth: 0}}>
						<div style={{fontFamily: LILITA, fontSize: T.name.length > 8 ? 44 : 50, color: '#fff', lineHeight: 1, whiteSpace: 'nowrap'}}>{T.name.toUpperCase()}</div>
						<div style={{fontFamily: LILITA, fontSize: 44, color: C.yellow, lineHeight: 1}}>{T.year}</div>
					</div>
				</div>
				<div style={{marginTop: 10, display: 'inline-block', padding: '4px 12px', borderRadius: 10, background: col, border: `3px solid ${C.navy}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 16, letterSpacing: 1.5, color: '#fff', whiteSpace: 'nowrap'}}>{T.nick}</div>
				<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10}}>
					{[['ENTRENADOR', T.coach], ['ESTRELLA', T.star]].map(([a, b]) => (
						<div key={a} style={{borderRadius: 10, background: 'rgba(255,255,255,0.08)', padding: '4px 10px'}}>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 13, letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)'}}>{a}</div>
							<div style={{fontFamily: LILITA, fontSize: b.length > 14 ? 19 : 24, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{b}</div>
						</div>
					))}
				</div>
				<div style={{marginTop: 12}}><Bars k={k} t={t - 70} w={398} compact /></div>
				<div style={{marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, background: 'rgba(255,255,255,0.08)', padding: '6px 14px'}}>
					<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: C.yellow}}>VALORACIÓN</span>
					<span style={{fontFamily: LILITA, fontSize: 46, color: '#fff', transform: `scale(${backOut((t - 140) / 12)})`}}>{f1(ovr(k))}</span>
				</div>
			</Panel>
		</div>
	);
};
const Scoreboard: React.FC<{mi: MI; t: number}> = ({mi, t}) => {
	const [sa, sb] = scoreAt(mi, t);
	const p = backOut((t - 14) / 16);
	const out = easeInOut((t - mi.dur + 26) / 22);
	const min = minuteAt(mi, t);
	const flash = (k: string) => mi.m.goals.some((g) => g.t === k && t - goalFrame(mi, g.m) >= 0 && t - goalFrame(mi, g.m) < 40);
	const state = t < mi.K ? 'PREVIA' : t < mi.K + mi.M ? `${min}'` : mi.m.et && t < mi.etS ? 'PRÓRROGA' : mi.m.et && t < mi.etS + mi.etF ? `${min}'` : mi.m.pens && t < mi.E ? 'PENALTIS' : 'FINAL';
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 20, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - p + out) * -220}px)`}}>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<div style={{padding: '3px 16px', borderRadius: '12px 12px 0 0', background: C.yellow, border: `4px solid ${C.navy}`, borderBottom: 'none', fontFamily: RUBIK, fontWeight: 800, fontSize: 17, letterSpacing: 2, color: C.navy}}>{ROUND_NAME[mi.r]}{mi.r < 2 ? ` · ${mi.i + 1}/${ROUNDS[mi.r].length}` : mi.r === 2 ? ` · ${mi.i + 1}/2` : ''}</div>
				<div style={{display: 'flex', alignItems: 'center', borderRadius: 18, background: 'rgba(11,30,63,0.97)', border: `5px solid ${C.navy}`, boxShadow: '0 0 0 4px #fff, 0 8px 0 rgba(0,0,0,0.35)', overflow: 'hidden'}}>
					{[mi.m.a, mi.m.b].map((k, s) => {
						const el = (
							<div key={k} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px', width: 290, justifyContent: s ? 'flex-start' : 'flex-end', flexDirection: s ? 'row-reverse' : 'row', background: s ? 'rgba(47,125,225,0.25)' : 'rgba(230,57,70,0.25)'}}>
								<div style={{textAlign: s ? 'left' : 'right', lineHeight: 1}}>
									<div style={{fontFamily: LILITA, fontSize: TEAMS[k].name.length > 8 ? 28 : 32, color: '#fff', whiteSpace: 'nowrap'}}>{TEAMS[k].name.toUpperCase()}</div>
									<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 16, color: C.yellow}}>{TEAMS[k].year}</div>
								</div>
								<Flag k={k} w={58} />
							</div>
						);
						return el;
					}).reduce<React.ReactNode[]>((acc, el, s) => (s === 0 ? [el] : [...acc, (
						<div key="sc" style={{display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', background: C.navy, alignSelf: 'stretch'}}>
							<div style={{fontFamily: LILITA, fontSize: 60, color: flash(mi.m.a) ? C.yellow : '#fff', transform: `scale(${flash(mi.m.a) ? 1.25 : 1})`, width: 40, textAlign: 'center'}}>{sa}</div>
							<div style={{fontFamily: LILITA, fontSize: 40, color: 'rgba(255,255,255,0.5)'}}>-</div>
							<div style={{fontFamily: LILITA, fontSize: 60, color: flash(mi.m.b) ? C.yellow : '#fff', transform: `scale(${flash(mi.m.b) ? 1.25 : 1})`, width: 40, textAlign: 'center'}}>{sb}</div>
						</div>
					), el]), [])}
				</div>
				<div style={{marginTop: -2, padding: '3px 18px', borderRadius: '0 0 12px 12px', background: t >= mi.K && t < mi.E ? RED : '#fff', border: `4px solid ${C.navy}`, borderTop: 'none', fontFamily: LILITA, fontSize: 26, color: t >= mi.K && t < mi.E ? '#fff' : C.navy, minWidth: 90, textAlign: 'center'}}>
					{state}{mi.m.pens && t >= mi.penS ? ` ${penScore(mi, t).join('-')}` : ''}
				</div>
			</div>
		</div>
	);
};
const penScore = (mi: MI, t: number) => {
	let a = 0, b = 0;
	mi.m.pens?.seq.forEach((p, j) => { if (penFrame(mi, j) <= t && p.ok) { if (p.t === mi.m.a) a++; else b++; } });
	return [a, b];
};
const BottomBox: React.FC<{children: React.ReactNode; p: number; col?: string}> = ({children, p, col = C.yellow}) => (
	<div style={{position: 'absolute', left: 500, width: 920, top: 770, transform: `translateY(${(1 - p) * 360}px)`}}>
		<Panel style={{padding: '12px 22px 16px', borderColor: col, minHeight: 160, boxSizing: 'border-box'}}>{children}</Panel>
	</div>
);
const pathOf = (k: string, uptoRound: number) => {
	const out: {r: number; m: Match}[] = [];
	for (let r = 0; r < uptoRound; r++) { const m = ROUNDS[r].find((x) => x.a === k || x.b === k); if (m) out.push({r, m}); }
	return out;
};
const MatchScene: React.FC<{mi: MI; t: number; f: number}> = ({mi, t, f}) => {
	const out = easeInOut((t - mi.dur + 26) / 22);
	const m = mi.m;
	const beatI = t >= INFO0 && t < mi.PRE ? Math.floor((t - INFO0) / BEAT) : -1;
	const bt = beatI >= 0 ? t - INFO0 - beatI * BEAT : 0;
	const beat = beatI >= 0 ? mi.beats[beatI] : null;
	const min = minuteAt(mi, t);
	const live = t >= mi.K && t < mi.E + 20;
	const prog = t < mi.K ? 0 : Math.min(1, (min ?? 0) / 90);
	const goalsShown = m.goals.filter((g) => goalFrame(mi, g.m) <= t);
	const curGoal = [...m.goals].reverse().find((g) => t - goalFrame(mi, g.m) >= 0 && t - goalFrame(mi, g.m) < 75);
	const inPens = !!m.pens && t >= mi.penS;
	return (
		<AbsoluteFill>
			<Scoreboard mi={mi} t={t} />
			<TeamCard k={m.a} side={0} t={t} mi={mi} />
			<TeamCard k={m.b} side={1} t={t} mi={mi} />
			{/* info beats */}
			{beat && (
				<BottomBox p={backOut(bt / 14) * (1 - easeInOut((bt - BEAT + 10) / 10))} col={beat.kind === 'real' ? GREEN : '#C58BFF'}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: '#fff', background: beat.kind === 'real' ? '#1E9E55' : '#8E5BD9', padding: '4px 12px', borderRadius: 8}}>{beat.kind === 'real' ? 'EN LA REALIDAD' : beat.kind === 'path' ? 'SU CAMINO HASTA AQUÍ' : 'DATO'}</span>
						{beat.kind !== 'real' && <><Flag k={beat.team} w={40} /><span style={{fontFamily: LILITA, fontSize: 28, color: '#fff'}}>{label(beat.team)}</span></>}
					</div>
					{beat.kind === 'path' ? (
						<div style={{display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap'}}>
							{pathOf(beat.team, mi.r).map(({r, m: pm}, j) => {
								const opp = pm.a === beat.team ? pm.b : pm.a;
								return (
									<div key={r} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: `3px solid ${GREEN}`, transform: `scale(${backOut((bt - 10 - j * 12) / 10)})`}}>
										<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 14, color: GREEN}}>{['OCT.', 'CUA.', 'SEMI'][r]}</span>
										<Flag k={opp} w={34} />
										<span style={{fontFamily: LILITA, fontSize: 28, color: '#fff', whiteSpace: 'nowrap'}}>{pm.a === beat.team ? resultTxt(pm) : resultTxt({...pm, ga: pm.gb, gb: pm.ga, pens: pm.pens ? {...pm.pens, a: pm.pens.b, b: pm.pens.a} : null})}</span>
									</div>
								);
							})}
						</div>
					) : (
						<div style={{marginTop: 10, fontFamily: LILITA, fontSize: 38, lineHeight: 1.12, color: '#fff', opacity: clamp01(bt / 8)}}>{beat.text}</div>
					)}
				</BottomBox>
			)}
			{/* probabilities */}
			{t >= mi.PRE && t < mi.K + 20 && (() => {
				const u = t - mi.PRE;
				const pp = easeOut((u - 20) / 40);
				const [pa, pd, pb] = m.p;
				return (
					<BottomBox p={backOut(u / 14) * (1 - easeInOut((t - mi.K) / 16))} col="#fff">
						<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: '#fff', textAlign: 'center'}}>PROBABILIDADES ANTES DEL PARTIDO</div>
						<div style={{display: 'flex', height: 56, marginTop: 12, borderRadius: 14, overflow: 'hidden', border: `4px solid ${C.navy}`}}>
							{[[pa, RED, TEAMS[m.a].name], [pd, '#8A93A8', 'EMPATE'], [pb, BLUE, TEAMS[m.b].name]].map(([v, col, n]) => (
								<div key={n as string} style={{width: `${(v as number)}%`, background: col as string, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 30, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden'}}>{Math.round((v as number) * pp)}%</div>
							))}
						</div>
						<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: RUBIK, fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.8)'}}><span>GANA {TEAMS[m.a].name.toUpperCase()}</span><span>EMPATE</span><span>GANA {TEAMS[m.b].name.toUpperCase()}</span></div>
					</BottomBox>
				);
			})()}
			{/* live panel */}
			{live && !inPens && (
				<BottomBox p={backOut((t - mi.K) / 14)} col={RED}>
					<div style={{display: 'flex', gap: 22}}>
						<div style={{width: 360}}>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 16, letterSpacing: 2, color: 'rgba(255,255,255,0.8)'}}>POSESIÓN</div>
							<div style={{display: 'flex', height: 30, marginTop: 6, borderRadius: 10, overflow: 'hidden', border: `3px solid ${C.navy}`}}>
								{(() => { const ps = Math.round(m.pos + Math.sin(f / 40) * 3 * (1 - prog)); return (<><div style={{width: `${ps}%`, background: RED, fontFamily: LILITA, fontSize: 22, color: '#fff', paddingLeft: 8}}>{ps}%</div><div style={{flex: 1, background: BLUE, fontFamily: LILITA, fontSize: 22, color: '#fff', textAlign: 'right', paddingRight: 8}}>{100 - ps}%</div></>); })()}
							</div>
							<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10}}>
								{[['TIROS', Math.round(m.sha * prog), Math.round(m.shb * prog)], ['A PUERTA', Math.round(Math.max(m.ga, m.sha * 0.42) * prog), Math.round(Math.max(m.gb, m.shb * 0.42) * prog)]].map(([n, a, b]) => (
									<div key={n as string} style={{textAlign: 'center', width: 170, borderRadius: 10, background: 'rgba(255,255,255,0.08)', padding: '2px 0'}}>
										<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 14, letterSpacing: 1.5, color: 'rgba(255,255,255,0.75)'}}>{n}</div>
										<div style={{fontFamily: LILITA, fontSize: 30, color: '#fff'}}><span style={{color: '#FF8A8F'}}>{a}</span> · <span style={{color: '#8FC1FF'}}>{b}</span></div>
									</div>
								))}
							</div>
						</div>
						<div style={{flex: 1, minWidth: 0}}>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 16, letterSpacing: 2, color: 'rgba(255,255,255,0.8)'}}>GOLES</div>
							<div style={{display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4}}>
								{goalsShown.length === 0 && <div style={{fontFamily: LILITA, fontSize: 28, color: 'rgba(255,255,255,0.45)', marginTop: 6}}>Todavía nada...</div>}
								{goalsShown.slice(-3).map((g) => (
									<div key={g.m} style={{display: 'flex', alignItems: 'center', gap: 10, transform: `translateX(${(1 - easeOut((t - goalFrame(mi, g.m)) / 12)) * 60}px)`, opacity: clamp01((t - goalFrame(mi, g.m)) / 6)}}>
										<span style={{width: 56, fontFamily: LILITA, fontSize: 26, color: C.yellow}}>{g.m}'</span>
										<Flag k={g.t} w={36} />
										<span style={{fontFamily: LILITA, fontSize: 28, color: '#fff', whiteSpace: 'nowrap'}}>{g.who}</span>
									</div>
								))}
								{goalsShown.length > 3 && <div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,0.6)'}}>+{goalsShown.length - 3} goles antes</div>}
							</div>
						</div>
					</div>
				</BottomBox>
			)}
			{/* penalties */}
			{inPens && t < mi.E + POST - 20 && m.pens && (() => {
				const u = t - mi.penS;
				return (
					<BottomBox p={backOut(u / 14)} col={C.yellow}>
						<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
							<span style={{fontFamily: LILITA, fontSize: 34, color: C.yellow}}>TANDA DE PENALTIS</span>
							{(() => { const j = m.pens!.seq.findIndex((_, jj) => penFrame(mi, jj) > t); const nxt = j >= 0 ? m.pens!.seq[j] : null; return nxt ? <span style={{display: 'flex', alignItems: 'center', gap: 8, fontFamily: LILITA, fontSize: 26, color: '#fff'}}>LANZA <Flag k={nxt.t} w={34} /> {nxt.who}</span> : null; })()}
						</div>
						{[m.a, m.b].map((k) => (
							<div key={k} style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8}}>
								<Flag k={k} w={44} />
								<span style={{width: 150, fontFamily: LILITA, fontSize: 26, color: '#fff'}}>{TEAMS[k].name.toUpperCase()}</span>
								{m.pens!.seq.map((p, j) => (p.t !== k ? null : (
									<div key={j} style={{width: 40, height: 40, borderRadius: 20, border: `4px solid ${C.navy}`, background: penFrame(mi, j) <= t ? (p.ok ? GREEN : RED) : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 24, color: '#fff', transform: `scale(${penFrame(mi, j) <= t ? backOut((t - penFrame(mi, j)) / 8) : 1})`}}>{penFrame(mi, j) <= t ? (p.ok ? '✓' : '✗') : ''}</div>
								)))}
							</div>
						))}
					</BottomBox>
				);
			})()}
			{/* banners: kick-off, ET, pens */}
			{t >= mi.K - 10 && t < mi.K + 50 && <CenterBanner t={t - mi.K + 10} text="¡EMPIEZA EL PARTIDO!" />}
			{m.et && t >= mi.K + mi.M && t < mi.etS + 10 && <CenterBanner t={t - mi.K - mi.M} text="¡PRÓRROGA!" col={C.yellow} />}
			{m.pens && t >= mi.penS && t < mi.penS + BANNER + 10 && <CenterBanner t={t - mi.penS} text="¡A LOS PENALTIS!" col={C.yellow} />}
			{/* goal flash */}
			{curGoal && (() => {
				const u = t - goalFrame(mi, curGoal.m);
				return (
					<div style={{position: 'absolute', left: 480, right: 480, top: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 1 - clamp01((u - 60) / 15)}}>
						<Txt size={110} color={C.yellow} shadow={C.red} p={u < 10 ? 2.2 - 1.2 * easeOut(u / 10) : 1}>¡GOOOL!</Txt>
						<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '6px 18px', borderRadius: 14, background: 'rgba(11,30,63,0.95)', border: `4px solid ${C.yellow}`, transform: `scale(${backOut((u - 8) / 10)})`}}>
							<Flag k={curGoal.t} w={46} />
							<span style={{fontFamily: LILITA, fontSize: 38, color: '#fff', whiteSpace: 'nowrap'}}>{curGoal.who} {curGoal.m}'</span>
						</div>
					</div>
				);
			})()}
			{/* winner stamp */}
			{t >= mi.E + 20 && mi.r < 3 && (() => {
				const u = t - mi.E - 20;
				return (
					<div style={{position: 'absolute', left: 480, right: 480, top: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: 1 - out}}>
						<div style={{transform: `scale(${u < 12 ? 2 - easeOut(u / 12) : 1}) rotate(-4deg)`, opacity: clamp01(u / 6), padding: '10px 26px', borderRadius: 20, background: GREEN, border: `7px solid ${C.navy}`, boxShadow: '0 0 0 5px #fff, 0 10px 0 rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', gap: 14}}>
							<Flag k={m.win} w={70} />
							<span style={{fontFamily: LILITA, fontSize: 54, color: '#fff', ...strokeText(6)}}>{TEAMS[m.win].name.toUpperCase()} {NEXT_NAME[mi.r]}</span>
						</div>
						<div style={{transform: `scale(${backOut((u - 24) / 12)})`, padding: '6px 18px', borderRadius: 12, background: 'rgba(11,30,63,0.95)', border: `4px solid ${RED}`, fontFamily: LILITA, fontSize: 30, color: '#fff'}}>ELIMINADA: {label(loser(m))}</div>
					</div>
				);
			})()}
			{mi.r === 3 && t >= mi.E + 20 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center'}}><Txt size={120} color={C.yellow} shadow={C.red} p={backOut((t - mi.E - 20) / 12)}>¡FINAL DEL PARTIDO!</Txt></div>
			)}
		</AbsoluteFill>
	);
};
const CenterBanner: React.FC<{t: number; text: string; col?: string}> = ({t, text, col = '#fff'}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', opacity: 1 - clamp01((t - 50) / 12)}}>
		<Txt size={96} color={col} shadow={C.red} p={backOut(t / 12)}>{text}</Txt>
	</div>
);

// ---------------- CHAMPION ----------------
const Champion: React.FC<{t: number; f: number}> = ({t, f}) => {
	const k = CHAMPION;
	const out = easeInOut((t - CHAMP + 20) / 20);
	const path = pathOf(k, 4);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 50%, rgba(255,210,63,0.35) 0%, rgba(5,10,30,0.55) 60%)'}} />
			<div style={{position: 'absolute', left: 60, top: 50, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4}}>
				<Txt size={70} p={backOut((t - 20) / 12)} style={{transformOrigin: 'left center'}}>EL CAMPEÓN DE CAMPEONES ES...</Txt>
			</div>
			<div style={{position: 'absolute', left: 80, top: 170, display: 'flex', alignItems: 'center', gap: 30, transform: `scale(${backOut((t - 60) / 16)})`, transformOrigin: 'left center'}}>
				<div style={{transform: `rotate(${Math.sin(f / 12) * 4}deg)`}}><Trophy size={300} /></div>
				<div>
					<Flag k={k} w={240} />
					<Txt size={110} style={{marginTop: 14}}>{TEAMS[k].name.toUpperCase()}</Txt>
					<Txt size={110} color={C.yellow} shadow={C.red}>{TEAMS[k].year}</Txt>
				</div>
			</div>
			<div style={{position: 'absolute', left: 80, top: 640, width: 900, display: 'flex', flexDirection: 'column', gap: 10}}>
				{path.map(({r, m}, j) => {
					const opp = m.a === k ? m.b : m.a;
					const rt = m.a === k ? resultTxt(m) : resultTxt({...m, ga: m.gb, gb: m.ga, pens: m.pens ? {...m.pens, a: m.pens.b, b: m.pens.a} : null});
					return (
						<div key={r} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '6px 16px', borderRadius: 14, background: 'rgba(11,30,63,0.95)', border: `4px solid ${GREEN}`, transform: `translateX(${(1 - easeOut((t - 300 - j * 30) / 14)) * -1200}px)`}}>
							<span style={{width: 150, fontFamily: RUBIK, fontWeight: 800, fontSize: 17, letterSpacing: 1.5, color: GREEN}}>{ROUND_NAME[r].replace(' DE FINAL', '')}</span>
							<Flag k={opp} w={44} />
							<span style={{flex: 1, fontFamily: LILITA, fontSize: 30, color: '#fff'}}>{label(opp)}</span>
							<span style={{fontFamily: LILITA, fontSize: 32, color: C.yellow, whiteSpace: 'nowrap'}}>{rt}</span>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', right: 60, top: 820, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12}}>
				<Pill size={30} bg="#fff" style={{transform: `scale(${backOut((t - 620) / 12)})`, transformOrigin: 'right center'}}>¿ESTÁS DE ACUERDO?</Pill>
				<Pill size={30} style={{transform: `scale(${backOut((t - 680) / 12)})`, transformOrigin: 'right center'}}>¿QUÉ SELECCIÓN HA FALTADO?</Pill>
			</div>
		</AbsoluteFill>
	);
};

// ---------------- OUTRO ----------------
const Outro: React.FC<{t: number; f: number}> = ({t, f}) => {
	const outP = (d: number) => backOut((t - d) / 14);
	return (
		<AbsoluteFill style={{background: 'rgba(8,20,40,0.55)'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
				<div style={{transform: `scale(${outP(0)})`, textAlign: 'center'}}>
					<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1.05, color: '#fff', ...strokeText(14)}}>¿QUÉ TORNEO</div>
					<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1.05, color: C.yellow, ...strokeText(14)}}>SIMULAMOS AHORA?</div>
				</div>
				<div style={{display: 'flex', gap: 22}}>
					{[['SOLO SELECCIONES DE AMÉRICA', '#C60B1E'], ['LOS MEJORES CLUBES', '#003893'], ['EL MEJOR ONCE DE CADA PAÍS', '#1E8E4E']].map(([n, c], i) => (
						<div key={n} style={{transform: `scale(${outP(60 + i * 14)}) rotate(${(i - 1) * 3}deg)`, padding: '18px 26px', borderRadius: 20, background: c, border: `6px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)', fontFamily: LILITA, fontSize: 40, color: '#fff'}}>{n}</div>
					))}
				</div>
				<div style={{transform: `scale(${outP(150)})`}}><Pill size={34} bg="#fff">¡DÍMELO EN LOS COMENTARIOS!</Pill></div>
				<div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 16}}>
					<div style={{transform: `scale(${outP(240)}) rotate(${Math.sin(f / 10) * 4}deg)`}}><Hincha iso="balon" mood="feliz" size={190} scarf={['#FFD23F', '#E63946']} blink={blinkAt(f, 3)} /></div>
					<Subscribe f={t} start={300} />
				</div>
				<div style={{transform: `scale(${outP(260)})`, fontFamily: LILITA, fontSize: 46, color: '#fff', ...strokeText(10)}}>EL MAPA HINCHA</div>
			</div>
			{t >= OUTRO - 40 && <AbsoluteFill style={{background: '#000', opacity: clamp01((t - OUTRO + 40) / 40)}} />}
		</AbsoluteFill>
	);
};
export type {Team};
