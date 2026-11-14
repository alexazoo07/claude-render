import React, {useMemo} from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {WorldLayer, Vis, WCam, WORLD, bboxOf} from '../v5/WorldLayer5';
import {Hincha, Mood} from '../Hincha';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {C} from '../data';
import {backOut, clamp01, easeInOut, easeOut, elastic, Panel, Pill, strokeText} from '../ui';
import {blinkAt, camPath, Confetti, Key, Subscribe, Trophy} from '../common';
import {FlagPreload} from '../v2/Preload';
import {ALL_FLAGS7, CITY, CITY_ES, ELO, FINALS, OPP, PATH, REACT, ROUND, TITLES, GOALS, MATCH_NOTE, PRE, GROUP, TOPSC, ARG_SC_LIST, SPAIN_PATH, ELO_PRE, H2H, WCWINS, ELO_HIST} from './data7';

const FPS = 60;
const ARG_SC: [string, string] = ['#74ACDF', '#FFFFFF'];
const ESP_SC: [string, string] = ['#AA151B', '#F1BF00'];
const SKY = '#74ACDF';

// ---------------- timeline ----------------
type Kind = 'hook' | 'nums' | 'p1' | 'pre' | 'group' | 'late' | 'scorers' | 'spainpath' | 'odds' | 'elochart' | 'p2' | 'h2h' | 'wins' | 'match' | 'sum' | 'switch' | 'stars' | 'back2back' | 'era' | 'messi' | 'finals' | 'spain' | 'elo' | 'react' | 'y2030' | 'split' | 'outro';
type Sc = {kind: Kind; dur: number; from: number; i?: number};
const DUR: Partial<Record<Kind, number>> = {hook: 960, p1: 300, pre: 960, group: 840, sum: 720, nums: 960, late: 900, scorers: 900, spainpath: 1260, odds: 780, elochart: 1080, p2: 300, switch: 660, stars: 1080, back2back: 840, era: 840, messi: 960, finals: 1080, spain: 1020, h2h: 1020, wins: 900, elo: 1020, y2030: 960, split: 1080, outro: 840};
export const SCENES: Sc[] = (() => {
	const out: Sc[] = [];
	let t = 0;
	const push = (kind: Kind, dur: number, i?: number) => { out.push({kind, dur, from: t, i}); t += dur; };
	push('hook', DUR.hook!);
	push('p1', DUR.p1!);
	push('pre', DUR.pre!);
	PATH.forEach((_, i) => { push('match', i === PATH.length - 1 ? 960 : 660, i); if (i === 2) push('group', DUR.group!); });
	for (const k of ['sum', 'late', 'scorers', 'spainpath', 'nums', 'odds', 'elochart', 'p2', 'switch', 'stars', 'back2back', 'era', 'messi', 'finals', 'spain', 'h2h', 'wins', 'elo'] as Kind[]) push(k, DUR[k]!);
	REACT.forEach((_, i) => push('react', 420, i));
	push('y2030', DUR.y2030!);
	push('split', DUR.split!);
	push('outro', DUR.outro!);
	return out;
})();
export const V7_TOTAL = SCENES.reduce((a, s) => a + s.dur, 0);
const sceneAt = (f: number) => SCENES.find((s) => f >= s.from && f < s.from + s.dur) ?? SCENES[SCENES.length - 1];

// ---------------- camera ----------------
const fit = (keys: string[], focusY = 400, w = 1300, h = 520): WCam => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of keys) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	const z = Math.max(0.45, Math.min(5, Math.min(w / (x1 - x0 + 60), h / (y1 - y0 + 40))));
	return {x: (x0 + x1) / 2, y: (y0 + y1) / 2 + (540 - focusY) / z, z};
};
const USA: WCam = {x: 1040, y: 640, z: 2.3};
const WORLD_V: WCam = {x: 1915, y: 880, z: 0.5};
const CAM_KEYS: Key[] = (() => {
	const k: Key[] = [];
	const add = (f: number, c: WCam) => k.push([f, c.x, c.y, c.z]);
	add(0, {x: 1190, y: 520, z: 5}); add(900, {x: 1190, y: 520, z: 5.3});
	for (const s of SCENES) {
		const e = s.from + s.dur;
		if (s.kind === 'p1') { add(s.from + 10, {x: 1190, y: 520, z: 3}); add(s.from + 120, USA); }
		if (s.kind === 'match') { const [x, y] = CITY[PATH[s.i!].city]; add(s.from + 50, {x, y: y + 60, z: 3.2}); add(e, {x, y: y + 60, z: 3.35}); }
		if (s.kind === 'pre') { const c = {x: 1281 + 560 / 1.55, y: 1456 - 20 / 1.55, z: 1.55}; add(s.from + 10, {x: 1190, y: 520, z: 2.2}); add(s.from + 110, c); add(e - 60, {...c, z: c.z * 1.05}); add(e, {x: 1000, y: 600, z: 2}); }
		if (s.kind === 'group') { const c = {x: 1650, y: 820, z: 0.55}; add(s.from + 70, c); add(e - 50, {...c, z: c.z * 1.04}); }
		if (s.kind === 'late' || s.kind === 'scorers') { add(s.from + 70, USA); add(e, {...USA, z: USA.z * 1.04}); }
		if (s.kind === 'spainpath') { add(s.from + 70, {x: 1110, y: 630, z: 2.0}); add(e, {x: 1110, y: 630, z: 2.08}); }
		if (s.kind === 'odds' || s.kind === 'elochart' || s.kind === 'h2h') { const c = {x: 1560, y: 1000, z: 0.72}; add(s.from + 70, c); add(e, {...c, z: c.z * 1.03}); }
		if (s.kind === 'p2') { add(s.from + 60, {x: 1190, y: 520, z: 3.4}); add(e, {x: 1190, y: 520, z: 3.8}); }
		if (s.kind === 'nums') { add(s.from + 70, {x: 1000, y: 620, z: 1.6}); add(e, {x: 1000, y: 620, z: 1.66}); }
		if (s.kind === 'wins') { add(s.from + 70, WORLD_V); add(e, {...WORLD_V, z: 0.52}); }
		if (s.kind === 'sum') { add(s.from + 60, USA); add(e, {...USA, z: USA.z * 1.04}); }
		if (s.kind === 'switch') { add(s.from + 60, {x: 1190, y: 520, z: 4}); add(e, {x: 1190, y: 520, z: 4.4}); }
		if (s.kind === 'stars') { const c = {x: 1340 + 520 / 1.1, y: 1250, z: 1.1}; add(s.from + 70, c); add(e, {...c, z: c.z * 1.04}); }
		if (s.kind === 'back2back') { const c = fit(['ITA', 'BRA', 'ARG'], 380, 1500, 620); add(s.from + 70, c); add(e, {...c, z: c.z * 1.04}); }
		if (s.kind === 'era' || s.kind === 'messi' || s.kind === 'finals') { const c = {x: 1281 + 560 / 1.55, y: 1456 - 20 / 1.55, z: 1.55}; add(s.from + 70, c); add(e, {...c, z: c.z * 1.05}); }
		if (s.kind === 'spain') { const c = fit(['ESP', 'PRT'], 360, 900, 520); add(s.from + 70, c); add(e, {...c, z: c.z * 1.05}); }
		if (s.kind === 'elo') { add(s.from + 70, WORLD_V); add(e, {...WORLD_V, z: 0.52}); }
		if (s.kind === 'react') { const c = fit([REACT[s.i!].key], 380, 900, 480); add(s.from + 50, c); add(e, {...c, z: c.z * 1.05}); }
		if (s.kind === 'y2030') { const c = {x: 1560, y: 1000, z: 0.72}; add(s.from + 70, c); add(e, {...c, z: c.z * 1.03}); }
		if (s.kind === 'split' || s.kind === 'outro') { add(s.from + 70, WORLD_V); add(e, {...WORLD_V, z: 0.52}); }
	}
	return k;
})();

// ---------------- sfx & music ----------------
export const v7Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f, name, vol});
	S(0, 'whistle_long', 0.4); S(6, 'crowd_roar', 0.55); S(20, 'slap', 0.5); S(90, 'pop_2', 0.4);
	S(150, 'glitch', 0.6); for (let k = 0; k < 30; k++) S(156 + k * 6, 'tick', 0.22); S(160, 'whoosh_4', 0.4); S(250, 'whoosh_2', 0.4);
	S(330, 'glitch', 0.5); S(336, 'kick', 0.6); S(352, 'crowd_roar', 0.6); S(354, 'boom', 0.55); S(380, 'slap', 0.55); S(390, 'glass', 0.3);
	S(470, 'whoosh_1', 0.45); S(476, 'slap', 0.5); S(540, 'click', 0.45);
	S(720, 'whoosh_2', 0.4); [0, 1, 2].forEach((i) => S(740 + i * 30, `pop_${i + 1}`, 0.42)); S(880, 'riser', 0.3);
	for (const sc of SCENES) {
		const f0 = sc.from;
		if (sc.kind === 'hook' || sc.kind === 'outro') continue;
		S(f0, 'whoosh_' + ((Math.floor(f0 / 100) % 4) + 1), 0.35);
		if (sc.kind === 'match') {
			const m = PATH[sc.i!];
			S(f0 + 40, 'drop', 0.4); S(f0 + 60, 'pop_1', 0.4); S(f0 + 90, 'whistle_short', 0.3);
			for (let k = 0; k < 5; k++) S(f0 + 110 + k * 10, 'tick', 0.18);
			if (m.gf > m.ga) { S(f0 + 170, 'crowd_roar', 0.35); S(f0 + 172, 'confirm', 0.4); } else { S(f0 + 170, 'crowd_ohh', 0.5); S(f0 + 172, 'error', 0.45); S(f0 + 260, 'boom', 0.4); }
			S(f0 + 240, 'click', 0.3);
		}
		if (sc.kind === 'spainpath') { SPAIN_PATH.forEach((_, k) => { S(f0 + 80 + k * 120, 'drop', 0.35); S(f0 + 110 + k * 120, k === 0 ? 'click' : 'pop_' + ((k % 4) + 1), 0.35); }); S(f0 + 1060, 'boom', 0.4); }
		if (sc.kind === 'p1' || sc.kind === 'p2') { S(f0 + 20, 'slap', 0.5); S(f0 + 30, 'glass', 0.25); }
		if (sc.kind === 'match') { GOALS[sc.i!].forEach((g, k) => S(f0 + 300 + k * 26, g.rival ? 'error' : 'pop_' + ((k % 4) + 1), 0.3)); }
		if (sc.kind === 'switch') { S(f0 + 10, 'glitch', 0.55); for (let k = 0; k < 20; k++) S(f0 + 20 + k * 5, 'tick', 0.2); S(f0 + 140, 'kick', 0.6); S(f0 + 160, 'crowd_roar', 0.6); S(f0 + 162, 'boom', 0.55); S(f0 + 220, 'slap', 0.5); S(f0 + 300, 'confirm', 0.45); }
		if (['stars', 'back2back', 'era', 'messi', 'finals', 'spain', 'elo', 'y2030', 'split', 'pre', 'group', 'late', 'scorers', 'odds', 'elochart', 'h2h', 'wins', 'nums'].includes(sc.kind)) {
			S(f0 + 40, 'slap', 0.45); for (let k = 0; k < 6; k++) S(f0 + 120 + k * 40, `pop_${(k % 4) + 1}`, 0.35);
			S(f0 + 420, 'riser', 0.25); S(f0 + 480, 'boom', 0.4); S(f0 + 482, sc.kind === 'spain' ? 'crowd_ohh' : 'crowd_roar', 0.3);
		}
		if (sc.kind === 'react') { const r = REACT[sc.i!]; S(f0 + 40, `pop_${(sc.i! % 4) + 1}`, 0.42); S(f0 + 70, r.mood === 'grito' || r.mood === 'feliz' ? 'crowd_roar' : 'crowd_ohh', 0.3); S(f0 + 110, 'click', 0.3); }
	}
	const o = SCENES[SCENES.length - 1].from;
	S(o, 'whoosh_2', 0.4); S(o + 20, 'slap', 0.45); [0, 1, 2].forEach((i) => S(o + 70 + i * 14, `pop_${i + 1}`, 0.4)); S(o + 300, 'pop_4', 0.4); S(o + 350, 'click', 0.5); S(o + 352, 'bong', 0.35);
	return s;
};
export const v7Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	const sw = SCENES.find((s) => s.kind === 'p2')!.from;
	const rc = SCENES.find((s) => s.kind === 'react')!.from;
	const sp = SCENES.find((s) => s.kind === 'split')!.from;
	return [`m_tense:0:${sec(DUR.hook! + 40)}`, `m_happy:${sec(DUR.hook!)}:${sec(sw + 40)}`, `m_triumph:${sec(sw)}:${sec(rc + 40)}`, `m_happy:${sec(rc)}:${sec(sp + 40)}`, `m_triumph:${sec(sp)}:${sec(V7_TOTAL)}`].join(',');
};

// ---------------- helpers ----------------
const T: React.FC<{children: React.ReactNode; size?: number; color?: string; p: number; shadow?: string}> = ({children, size = 84, color = '#fff', p, shadow = C.navy}) => (
	<div style={{transform: `scale(${Math.max(0, p)})`, fontFamily: LILITA, fontSize: size, color, ...strokeText(size * 0.16), textShadow: `0 ${size * 0.09}px 0 ${shadow}`, whiteSpace: 'nowrap', lineHeight: 1.05}}>{children}</div>
);
const Flag: React.FC<{f: string; w: number; style?: React.CSSProperties}> = ({f, w, style}) => <img src={staticFile(`flags/${f}.svg`)} style={{width: w, height: w * 0.72, objectFit: 'cover', borderRadius: Math.max(4, w * 0.08), border: `${Math.max(2, w * 0.04)}px solid ${C.navy}`, ...style}} />;
const Star: React.FC<{s: number; on?: boolean; glow?: boolean}> = ({s, on = true, glow}) => (
	<svg width={s} height={s} viewBox="-50 -50 100 100" style={{overflow: 'visible', filter: glow ? 'drop-shadow(0 0 10px #FFD23F)' : undefined}}>
		<path d="M0 -46 L13 -14 L47 -14 L19 7 L29 41 L0 21 L-29 41 L-19 7 L-47 -14 L-13 -14 Z" fill={on ? '#FFD23F' : 'rgba(255,255,255,0.15)'} stroke={C.navy} strokeWidth={7} strokeLinejoin="round" />
	</svg>
);
const Board: React.FC<{a: string; b: string; fa: string; fb: string; ga: number | string; gb: number | string; tag?: string; tagCol?: string; scale?: number}> = ({a, b, fa, fb, ga, gb, tag, tagCol = C.red, scale = 1}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 * scale}}>
		{tag && <div style={{padding: `${6 * scale}px ${22 * scale}px`, borderRadius: 12, background: tagCol, border: `5px solid ${C.navy}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 28 * scale, letterSpacing: 3, color: '#fff'}}>{tag}</div>}
		<div style={{display: 'flex', alignItems: 'stretch', borderRadius: 22 * scale, overflow: 'hidden', border: `${7 * scale}px solid ${C.navy}`, boxShadow: '0 14px 0 rgba(0,0,0,0.45)'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 16 * scale, background: '#fff', padding: `${14 * scale}px ${26 * scale}px`}}><Flag f={fa} w={90 * scale} /><span style={{fontFamily: LILITA, fontSize: 76 * scale, color: C.navy}}>{a}</span></div>
			<div style={{background: C.navy, padding: `${8 * scale}px ${34 * scale}px`, fontFamily: LILITA, fontSize: 104 * scale, color: C.yellow, display: 'flex', alignItems: 'center'}}>{ga} - {gb}</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 16 * scale, background: '#fff', padding: `${14 * scale}px ${26 * scale}px`}}><span style={{fontFamily: LILITA, fontSize: 76 * scale, color: C.navy}}>{b}</span><Flag f={fb} w={90 * scale} /></div>
		</div>
	</div>
);
const VHS: React.FC<{f: number; label: string; counter: string; strength?: number}> = ({f, label, counter, strength = 1}) => (
	<>
		<AbsoluteFill style={{opacity: 0.22 * strength, backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.55) 0px, rgba(255,255,255,0.55) 1px, transparent 1px, transparent 4px)', backgroundPosition: `0 ${(f * 5) % 8}px`, mixBlendMode: 'overlay'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: (f * 37) % 1080, height: 26, background: 'rgba(255,255,255,0.18)', filter: 'blur(3px)', opacity: strength}} />
		<div style={{position: 'absolute', left: 60, top: 50, fontFamily: 'monospace', fontWeight: 900, fontSize: 64, color: '#fff', textShadow: '3px 0 0 #ff2a6d, -3px 0 0 #05d9e8', opacity: strength}}>{label}</div>
		<div style={{position: 'absolute', right: 60, top: 50, fontFamily: 'monospace', fontWeight: 900, fontSize: 56, color: '#fff', textShadow: '3px 0 0 #ff2a6d, -3px 0 0 #05d9e8', opacity: strength}}>{counter}</div>
	</>
);

// scrolling ticker
const TICK = [
	'MUNDIAL 2026 REAL: ESPAÑA 1-0 ARGENTINA, GOL DE FERRAN TORRES EN LA PRÓRROGA',
	'ARGENTINA JUGÓ LA PRÓRROGA CON DIEZ POR LA EXPULSIÓN DE ENZO FERNÁNDEZ',
	'MUNDIALES: BRASIL 5 · ALEMANIA 4 · ITALIA 4 · ARGENTINA 3 · FRANCIA 2 · URUGUAY 2 · ESPAÑA 2 · INGLATERRA 1',
	'SOLO ITALIA (1934 Y 1938) Y BRASIL (1958 Y 1962) HAN GANADO DOS MUNDIALES SEGUIDOS',
	'ARGENTINA HA JUGADO 7 FINALES DE MUNDIAL: 1930, 1978, 1986, 1990, 2014, 2022 Y 2026',
	'EL MUNDIAL 2030 SE JUGARÁ EN ESPAÑA, PORTUGAL Y MARRUECOS, CON PARTIDOS INAUGURALES EN URUGUAY, ARGENTINA Y PARAGUAY',
	'ELO: CALCULADO CON LOS 49.945 PARTIDOS INTERNACIONALES DEL DATASET (HASTA OCT. 2026) · ESCENARIO ALTERNATIVO = SIMULACIÓN',
];
const Ticker: React.FC<{f: number; y: number}> = ({f, y}) => {
	const text = TICK.join('     •     ') + '     •     ';
	const w = useMemo(() => { try { const c = document.createElement('canvas').getContext('2d')!; c.font = `800 22px ${RUBIK}`; return c.measureText(text).width; } catch { return text.length * 14; } }, [text]);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 56, transform: `translateY(${y}px)`, background: 'linear-gradient(180deg, #0E2A55, #081A38)', borderTop: `4px solid ${SKY}`, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 330, top: 0, bottom: 0, right: 0, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: -((f * 2.2) % w), top: 13, whiteSpace: 'pre', fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff'}}>{text + text + text}</div>
			</div>
			<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 330, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: SKY, fontFamily: LILITA, fontSize: 28, color: C.navy, boxShadow: '6px 0 12px rgba(0,0,0,0.4)'}}>
				<img src={staticFile('flags/ar.svg')} style={{width: 40, height: 28, borderRadius: 4, border: `2px solid ${C.navy}`, objectFit: 'cover'}} />
				ARGENTINA EN DATOS
			</div>
		</div>
	);
};
// timeline badge (REAL / ALTERNATIVA)
const Line: React.FC<{alt: boolean; p: number}> = ({alt, p}) => (
	<div style={{position: 'absolute', left: 30, top: 28, transform: `translateX(${(1 - easeOut(p)) * -500}px)`, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 14, background: alt ? '#8E5BD9' : 'rgba(11,30,63,0.92)', border: `4px solid ${alt ? '#fff' : C.yellow}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)'}}>
		<div style={{width: 16, height: 16, borderRadius: 8, background: alt ? '#fff' : '#E63946', boxShadow: `0 0 10px ${alt ? '#fff' : '#E63946'}`}} />
		<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, letterSpacing: 3, color: '#fff'}}>{alt ? 'LÍNEA TEMPORAL ALTERNATIVA' : 'LO QUE PASÓ DE VERDAD'}</span>
	</div>
);

// ---------------- main ----------------
export const Video7: React.FC = () => {
	const f = useCurrentFrame();
	const sc = sceneAt(f);
	const t = f - sc.from;
	const cam = camPath(CAM_KEYS, f, 9);
	const altOn = SCENES.findIndex((s) => s === sc) >= SCENES.findIndex((s) => s.kind === 'p2') && sc.kind !== 'outro';

	// map visibility
	const vis: Record<string, Vis> = {};
	const pop = (k: string, flag: string, from: number, mood: Mood = 'feliz', scale = 1, glow?: string) => { vis[k] = {flag, pop: Math.max(0, elastic((f - from) / FPS)), mood, blink: blinkAt(f, k.charCodeAt(0)), open: 0.5 + 0.5 * Math.sin(f / 4), faceScale: scale, glow}; };
	const ARGmood: Mood = sc.kind === 'match' ? (PATH[sc.i!].gf > PATH[sc.i!].ga ? (t > 170 ? 'grito' : 'enfado') : t > 170 ? 'triste' : 'enfado') : sc.kind === 'sum' ? 'triste' : altOn ? 'grito' : 'feliz';
	pop('ARG', 'ar', 0, ARGmood, 1.2);
	if (f < DUR.hook!) { pop('ESP', 'es', 0, f < 330 ? 'grito' : 'triste', 1); }
	SCENES.filter((s) => s.kind === 'match' && f >= s.from + 30).forEach((s) => { const o = OPP[PATH[s.i!].opp]; pop(o.key, o.flag, s.from + 30, sc === s ? (PATH[s.i!].gf > PATH[s.i!].ga ? (t > 170 ? 'triste' : 'enfado') : t > 170 ? 'grito' : 'enfado') : 'feliz', sc === s ? 1.2 : 1, sc === s ? '#FFD23F' : undefined); });
	if (sc.kind === 'group') for (const g of GROUP) pop(g.key, g.flag, sc.from + 20 + GROUP.indexOf(g) * 10, g.key === 'JOR' ? 'triste' : 'feliz', 1, g.key === 'ARG' ? '#FFD23F' : undefined);
	if (sc.kind === 'odds' || sc.kind === 'elochart' || sc.kind === 'h2h') pop('ESP', 'es', sc.from + 20, sc.kind === 'odds' ? 'enfado' : 'feliz', 1.2, '#F1BF00');
	if (sc.kind === 'scorers') for (const [k, fl] of [['FRA', 'fr'], ['NOR', 'no'], ['ENG', 'gb-eng']]) pop(k, fl, sc.from + 20, 'feliz');
	if (sc.kind === 'wins') for (const w of WCWINS) pop(w.key, w.flag, sc.from + 20, w.key === 'ARG' ? 'grito' : 'feliz');
	if (altOn) {
		TITLES.forEach((x, i) => pop(x.key, x.flag, SCENES.find((s) => s.kind === 'stars')!.from + 30 + i * 8, x.key === 'ARG' ? 'grito' : x.key === 'ESP' ? 'triste' : 'feliz'));
		REACT.forEach((r, i) => { const s = SCENES.filter((x) => x.kind === 'react')[i]; if (f >= s.from + 20) pop(r.key, r.flag, s.from + 20, sc === s ? r.mood : r.mood === 'grito' ? 'feliz' : r.mood, sc === s ? 1.25 : 1, sc === s ? r.col : undefined); });
		const y = SCENES.find((s) => s.kind === 'y2030')!;
		if (f >= y.from + 20) for (const [k, fl] of [['PRT', 'pt'], ['MAR', 'ma'], ['PRY', 'py']]) pop(k, fl, y.from + 20, 'feliz');
		if (f >= SCENES.find((s) => s.kind === 'elo')!.from) pop('PRT', 'pt', SCENES.find((s) => s.kind === 'elo')!.from + 20, 'feliz');
	}

	const tickY = f >= DUR.hook! - 10 && sc.kind !== 'outro' ? (1 - easeOut((f - DUR.hook! + 10) / 24)) * 80 : 80;
	const switchSc = SCENES.find((s) => s.kind === 'switch')!;

	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			<FlagPreload flags={ALL_FLAGS7} />
			<WorldLayer cam={cam} vis={vis}>
				{/* route across US host cities */}
				{sc.kind === 'spainpath' && <SpainRoute t={f - sc.from} z={cam.z} />}
				{(sc.kind === 'match' || sc.kind === 'sum' || sc.kind === 'p1' || sc.kind === 'late') && (() => {
					const shown = sc.kind === 'match' ? sc.i! : sc.kind === 'sum' || sc.kind === 'late' ? PATH.length - 1 : -1;
					const k = 1 / cam.z;
					return (
						<g>
							{PATH.slice(0, shown + 1).map((m, i) => {
								if (i === 0) return null;
								const [x0, y0] = CITY[PATH[i - 1].city], [x1, y1] = CITY[m.city];
								const s = SCENES.find((q) => q.kind === 'match' && q.i === i)!;
								const p = sc.kind === 'match' && sc.i === i ? clamp01((t - 10) / 40) : 1;
								if (x0 === x1 && y0 === y1) return null;
								return <path key={i} d={`M${x0} ${y0} Q${(x0 + x1) / 2} ${Math.min(y0, y1) - 40} ${x1} ${y1}`} fill="none" stroke={SKY} strokeWidth={5 * k} strokeDasharray={`${12 * k} ${8 * k}`} pathLength={1} style={{strokeDasharray: undefined}} opacity={p} />;
							})}
							{PATH.slice(0, shown + 1).map((m, i) => {
								const [x, y] = CITY[m.city];
								const lost = m.gf < m.ga;
								const pin = sc.kind === 'match' && sc.i === i ? backOut((t - 30) / 14) : 1;
								return (
									<g key={'c' + i} transform={`translate(${x} ${y}) scale(${k * pin})`}>
										<path d="M0 0 C -14 -22 -28 -34 -28 -54 A28 28 0 1 1 28 -54 C 28 -34 14 -22 0 0 Z" fill={lost ? '#E63946' : '#2EC46B'} stroke={C.navy} strokeWidth={5} />
										<text x={0} y={-44} textAnchor="middle" fontFamily="Lilita" fontSize={30} fill="#fff" stroke={C.navy} strokeWidth={5} paintOrder="stroke">{i + 1}</text>
									</g>
								);
							})}
						</g>
					);
				})()}
			</WorldLayer>

			{sc.kind === 'hook' && <Hook f={f} />}
			{sc.kind !== 'hook' && sc.kind !== 'outro' && <Line alt={altOn} p={(f - DUR.hook!) / 20} />}
			{sc.kind === 'p1' && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, transform: `scale(${backOut((t - 20) / 16) * (1 - easeInOut((t - sc.dur + 24) / 20))})`}}>
					<T p={1} size={104} color={C.yellow} shadow={C.red}>PARTE 1</T>
					<T p={1} size={70}>EL MUNDIAL REAL DE ARGENTINA</T>
					<Pill size={30} bg="#fff">8 PARTIDOS · 5 CIUDADES DE ESTADOS UNIDOS</Pill>
				</div>
			)}
			{sc.kind === 'match' && <MatchCard i={sc.i!} t={t} dur={sc.dur} />}
			{sc.kind === 'pre' && <Pre t={t} dur={sc.dur} />}
			{sc.kind === 'group' && <Group t={t} dur={sc.dur} />}
			{sc.kind === 'late' && <Late t={t} dur={sc.dur} />}
			{sc.kind === 'scorers' && <Scorers t={t} dur={sc.dur} />}
			{sc.kind === 'spainpath' && <SpainPath t={t} dur={sc.dur} />}
			{sc.kind === 'odds' && <Odds t={t} dur={sc.dur} f={f} />}
			{sc.kind === 'elochart' && <EloChart t={t} dur={sc.dur} />}
			{sc.kind === 'p2' && <P2 t={t} dur={sc.dur} />}
			{sc.kind === 'h2h' && <H2HGrid t={t} dur={sc.dur} />}
			{sc.kind === 'wins' && <Wins t={t} dur={sc.dur} />}
			{sc.kind === 'nums' && <Nums t={t} dur={sc.dur} />}
			{sc.kind === 'sum' && <Summary t={t} dur={sc.dur} />}
			{sc.kind === 'switch' && <Switch t={t} f={f} />}
			{sc.kind === 'stars' && <Stars t={t} dur={sc.dur} />}
			{sc.kind === 'back2back' && <Back2Back t={t} dur={sc.dur} />}
			{sc.kind === 'era' && <Era t={t} dur={sc.dur} />}
			{sc.kind === 'messi' && <Messi t={t} dur={sc.dur} f={f} />}
			{sc.kind === 'finals' && <Finals t={t} dur={sc.dur} />}
			{sc.kind === 'spain' && <Spain t={t} dur={sc.dur} f={f} />}
			{sc.kind === 'elo' && <Elo t={t} dur={sc.dur} />}
			{sc.kind === 'react' && <ReactCard i={sc.i!} t={t} dur={sc.dur} />}
			{sc.kind === 'y2030' && <Y2030 t={t} dur={sc.dur} />}
			{sc.kind === 'split' && <Split t={t} f={f} dur={sc.dur} />}
			{sc.kind === 'outro' && <Outro t={t} f={f} />}
			<Ticker f={f} y={tickY} />
			{f >= switchSc.from - 6 && f < switchSc.from + 10 && <AbsoluteFill style={{background: '#fff', opacity: 1 - Math.abs(f - switchSc.from - 2) / 8}} />}
		</AbsoluteFill>
	);
};

// ---------------- HOOK: rewind the final ----------------
const Hook: React.FC<{f: number}> = ({f}) => {
	const rew = f >= 150 && f < 330;
	const play = f >= 330;
	const counter = f < 150 ? "120:00" : rew ? `${String(Math.max(106, 120 - Math.floor((f - 150) / 13))).padStart(3, '0')}:${String(59 - ((f * 7) % 60)).padStart(2, '0')}` : '106:00';
	const scoreReal = f < 250;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: play ? 'radial-gradient(ellipse at 50% 40%, rgba(116,172,223,0.35) 0%, rgba(8,20,40,0.7) 75%)' : 'radial-gradient(ellipse at 50% 40%, rgba(170,21,27,0.35) 0%, rgba(8,20,40,0.75) 75%)'}} />
			{f < 470 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', transform: `scale(${backOut(f / 14)}) ${rew ? `translateX(${Math.sin(f * 1.7) * 6}px)` : ''}`}}>
					{play ? <Board a="ARG" b="ESP" fa="ar" fb="es" ga={f >= 352 ? 1 : 0} gb={0} tag="FINAL · PRÓRROGA" tagCol="#8E5BD9" /> : <Board a="ESP" b="ARG" fa="es" fb="ar" ga={scoreReal ? 1 : 0} gb={0} tag="FINAL DEL MUNDIAL 2026 · PRÓRROGA" />}
				</div>
			)}
			{f < 150 && (
				<>
					<div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
						<T p={backOut((f - 20) / 12)} size={92} color={C.yellow} shadow={C.red}>ESPAÑA, CAMPEONA DEL MUNDO</T>
						<T p={backOut((f - 40) / 12)} size={50}>19 DE JULIO DE 2026 · NUEVA YORK / NUEVA JERSEY</T>
					</div>
					<div style={{position: 'absolute', left: 220, top: 620, transform: `translateY(${(1 - elastic((f - 6) / FPS)) * 400}px)`}}><Hincha iso="img:es" mood="grito" size={330} scarf={ESP_SC} open={0.5 + 0.5 * Math.sin(f / 3)} /></div>
					<div style={{position: 'absolute', left: 1370, top: 620, transform: `translateY(${(1 - elastic((f - 12) / FPS)) * 400}px)`}}><Hincha iso="img:ar" mood="triste" size={330} scarf={ARG_SC} sweat /></div>
					<div style={{position: 'absolute', left: 860, top: 640, transform: `scale(${backOut((f - 60) / 14)})`}}><Trophy size={200} /></div>
				</>
			)}
			{rew && (
				<>
					<VHS f={f} label="◀◀ REBOBINAR" counter={counter} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
						<T p={backOut((f - 170) / 12)} size={80}>¿Y SI ESE GOL...</T>
						{f >= 230 && <T p={backOut((f - 230) / 12)} size={96} color={SKY}>HUBIERA SIDO DE ARGENTINA?</T>}
					</div>
				</>
			)}
			{play && f < 470 && (
				<>
					<VHS f={f} label="▶ PLAY" counter={counter} strength={1 - clamp01((f - 380) / 40)} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 520, display: 'flex', justifyContent: 'center', transform: `scale(${Math.max(1, 3 - (f - 380) / 5)}) rotate(-6deg)`, opacity: f >= 380 ? 1 : 0}}>
						<div style={{padding: '14px 40px', borderRadius: 18, border: '10px solid #8E5BD9', background: 'rgba(20,10,40,0.8)', fontFamily: LILITA, fontSize: 88, color: '#fff'}}>LÍNEA TEMPORAL ALTERNATIVA</div>
					</div>
					<div style={{position: 'absolute', left: 1370, top: 680, transform: `scale(${backOut((f - 352) / 12)})`}}><Hincha iso="img:ar" mood="grito" size={300} scarf={ARG_SC} open={0.5 + 0.5 * Math.sin(f / 3)} /></div>
					<div style={{position: 'absolute', left: 250, top: 680, transform: `scale(${backOut((f - 352) / 12)})`}}><Hincha iso="img:es" mood="triste" size={300} scarf={ESP_SC} sweat /></div>
				</>
			)}
			{f >= 360 && f < 470 && <Confetti f={f} start={360} n={120} />}
			{f >= 470 && f < 730 && (() => {
				const pin = backOut((f - 470) / 16), pout = easeInOut((f - 700) / 22);
				return (
					<div style={{position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', justifyContent: 'center', transform: `translateY(${pout * -900}px) scale(${pin}) rotate(${-2 - pout * 6}deg)`}}>
						<div style={{background: '#FFF6E0', border: `7px solid ${C.navy}`, borderRadius: 34, padding: '26px 64px 32px', boxShadow: '0 16px 0 rgba(0,0,0,0.35)', textAlign: 'center'}}>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: C.red}}>EL MAPA HINCHA</div>
							<div style={{fontFamily: LILITA, fontSize: 88, lineHeight: 1.0, color: C.navy, marginTop: 6}}>¿QUÉ PASARÍA SI</div>
							<div style={{fontFamily: LILITA, fontSize: 88, lineHeight: 1.0, color: SKY, WebkitTextStroke: `4px ${C.navy}`, paintOrder: 'stroke fill'}}>ARGENTINA HUBIESE GANADO</div>
							<div style={{fontFamily: LILITA, fontSize: 88, lineHeight: 1.0, color: C.navy}}>EL MUNDIAL 2026?</div>
							<div style={{marginTop: 16, transform: `scale(${backOut((f - 540) / 14)})`}}><Pill size={28}>LO REAL VS LO QUE PUDO SER · CON DATOS</Pill></div>
						</div>
					</div>
				);
			})()}
			{f >= 720 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', gap: 22, opacity: 1 - clamp01((f - 930) / 24)}}>
					{[['4 ESTRELLAS', C.yellow], ['BICAMPEONA SEGUIDA', '#2EC46B'], ['¿N.º 1 DEL MUNDO?', '#8E5BD9']].map(([s, c], i) => (
						<div key={s} style={{transform: `scale(${backOut((f - 740 - i * 30) / 14)}) rotate(${(i - 1) * 3}deg)`, padding: '16px 30px', borderRadius: 18, background: c, border: `6px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)', fontFamily: LILITA, fontSize: 52, color: c === C.yellow ? C.navy : '#fff'}}>{s}</div>
					))}
				</div>
			)}
		</AbsoluteFill>
	);
};

const pIn = (t: number, dur: number, d = 0) => backOut((t - d) / 16) * (1 - easeInOut((t - dur + 24) / 20));

const MatchCard: React.FC<{i: number; t: number; dur: number}> = ({i, t, dur}) => {
	const m = PATH[i];
	const o = OPP[m.opp];
	const lost = m.gf < m.ga;
	const res = t >= 170;
	const [w, d, l] = m.h2h;
	return (
		<>
			<div style={{position: 'absolute', left: 0, right: 0, top: 100, display: 'flex', justifyContent: 'center', transform: `scale(${pIn(t, dur, 10)})`}}>
				<Pill size={30} bg={i === 7 ? C.red : C.yellow} color={i === 7 ? '#fff' : C.navy}>PARTIDO {i + 1} DE 8 · {ROUND[i]}</Pill>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 80, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - backOut((t - 40) / 18)) * 600 + easeInOut((t - dur + 20) / 16) * 600}px)`}}>
				<Panel style={{width: 1240, padding: '18px 30px', borderColor: res ? (lost ? C.red : '#2EC46B') : C.yellow}}>
					<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 16}}><Hincha iso="img:ar" mood={res ? (lost ? 'triste' : 'grito') : 'enfado'} size={120} scarf={ARG_SC} /><span style={{fontFamily: LILITA, fontSize: 52, color: '#fff'}}>ARGENTINA</span></div>
						<div style={{padding: '4px 28px', borderRadius: 16, background: res ? '#fff' : 'transparent', border: `5px solid ${res ? C.navy : 'transparent'}`, fontFamily: LILITA, fontSize: 84, color: res ? C.navy : C.yellow, transform: `scale(${res ? backOut((t - 170) / 10) : 1})`}}>{res ? `${m.gf} - ${m.ga}` : 'VS'}</div>
						<div style={{display: 'flex', alignItems: 'center', gap: 16, flexDirection: 'row-reverse'}}><Hincha iso={`img:${o.flag}`} mood={res ? (lost ? 'grito' : 'triste') : 'enfado'} size={120} scarf={null} /><span style={{fontFamily: LILITA, fontSize: 52, color: '#fff'}}>{o.es.toUpperCase()}</span></div>
					</div>
					<div style={{display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap'}}>
						{[
							['FECHA', new Date(m.date + 'T12:00:00Z').toLocaleDateString('es-ES', {day: 'numeric', month: 'long'}), '#fff'],
							['ESTADIO', CITY_ES[m.city], SKY],
							['HISTORIAL', `${w + d + l} partidos · ${w} V ${d} E ${l} D`, '#2EC46B'],
							['EN MUNDIALES', m.wcPrev ? `${m.wcPrev} ${m.wcPrev === 1 ? 'duelo' : 'duelos'} antes de este` : 'primer duelo mundialista', C.yellow],
						].map(([a, b, c], j) => (
							<div key={a} style={{transform: `scale(${Math.max(0, backOut((t - 100 - j * 18) / 12))})`, display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: `3px solid ${c}`}}>
								<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 14, letterSpacing: 1.5, color: c}}>{a}</span>
								<span style={{fontFamily: LILITA, fontSize: 25, color: '#fff', whiteSpace: 'nowrap'}}>{b}</span>
							</div>
						))}
					</div>
					{i < 7 && t >= 260 && <GoalBar i={i} t={t - 260} />}
					{i === 7 && t >= 250 && (
						<div style={{marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6}}>
							{['Gol de Ferran Torres en la prórroga', 'Enzo Fernández, expulsado: Argentina jugó la prórroga con diez'].map((s, j) => (
								<div key={j} style={{display: 'flex', alignItems: 'center', gap: 12, opacity: clamp01((t - 250 - j * 70) / 10)}}>
									<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, letterSpacing: 2, color: '#fff', background: C.red, padding: '3px 9px', borderRadius: 7}}>LA FINAL</span>
									<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: '#fff'}}>{s}</span>
								</div>
							))}
						</div>
					)}
				</Panel>
			</div>
			{t >= 440 && <div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((t - 440) / 14) * (1 - easeInOut((t - dur + 24) / 20))}) rotate(-2deg)`}}><Pill size={34} bg={lost ? C.red : '#fff'} color={lost ? '#fff' : C.navy}>{MATCH_NOTE[i].toUpperCase()}</Pill></div>}
			{lost && t >= 170 && t < dur - 20 && <AbsoluteFill style={{background: C.red, opacity: 0.25 * (1 - clamp01((t - 170) / 50)), pointerEvents: 'none'}} />}
		</>
	);
};

const Summary: React.FC<{t: number; dur: number}> = ({t, dur}) => {
	const gf = PATH.reduce((a, m) => a + m.gf, 0), ga = PATH.reduce((a, m) => a + m.ga, 0);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, transform: `scale(${pIn(t, dur, 10)})`}}>
			<T p={1} size={80}>SU MUNDIAL DE VERDAD</T>
			<div style={{display: 'flex', gap: 18}}>
				{[['7', 'VICTORIAS', '#2EC46B'], ['1', 'DERROTA', C.red], [`${gf}`, 'GOLES A FAVOR', C.yellow], [`${ga}`, 'EN CONTRA', '#fff']].map(([n, l, c], i) => (
					<div key={l} style={{transform: `scale(${backOut((t - 60 - i * 20) / 12)})`, width: 260, padding: '14px 0', borderRadius: 20, background: 'rgba(11,30,63,0.95)', border: `5px solid ${c}`, textAlign: 'center'}}>
						<div style={{fontFamily: LILITA, fontSize: 90, lineHeight: 1, color: '#fff'}}>{n}</div>
						<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, letterSpacing: 2, color: c}}>{l}</div>
					</div>
				))}
			</div>
			{t >= 200 && <div style={{transform: `scale(${backOut((t - 200) / 14)})`}}><Pill size={40} bg={C.red} color="#fff">A UN SOLO GOL DE LA HISTORIA</Pill></div>}
		</div>
	);
};

const Switch: React.FC<{t: number; f: number}> = ({t, f}) => (
	<>
		{t < 120 && <VHS f={f} label="◀◀ REBOBINAR" counter={`${String(Math.max(106, 120 - Math.floor(t / 8))).padStart(3, '0')}:00`} />}
		<div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((t - 20) / 14)})`}}>
			<Board a="ARG" b="ESP" fa="ar" fb="es" ga={t >= 160 ? 1 : 0} gb={0} tag="LA FINAL... ALTERNATIVA" tagCol="#8E5BD9" />
		</div>
		{t >= 160 && t < 240 && <div style={{position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center', transform: `scale(${backOut((t - 160) / 10)})`}}><span style={{fontFamily: LILITA, fontSize: 170, color: C.yellow, ...strokeText(22), textShadow: `0 12px 0 ${C.red}`}}>¡GOOOL!</span></div>}
		{t >= 220 && (
			<div style={{position: 'absolute', left: 0, right: 0, top: 440, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
				<T p={backOut((t - 220) / 12)} size={104} color={SKY}>¡ARGENTINA, BICAMPEONA</T>
				<T p={backOut((t - 234) / 12)} size={104} color={SKY}>DEL MUNDO!</T>
				{t >= 300 && <div style={{transform: `scale(${backOut((t - 300) / 12)})`, display: 'flex', gap: 8}}>{[0, 1, 2, 3].map((k) => <div key={k} style={{transform: `scale(${backOut((t - 300 - k * 14) / 10)})`}}><Star s={74} glow={k === 3} /></div>)}</div>}
			</div>
		)}
		{t >= 160 && <Confetti f={t} start={160} n={160} />}
	</>
);

const Stars: React.FC<{t: number; dur: number}> = ({t, dur}) => {
	const alt = t >= 420;
	const rows = [...TITLES].sort((a, b) => (alt ? b.alt - a.alt : b.real - a.real) || (a.key === 'ARG' ? -1 : 0));
	return (
		<div style={{position: 'absolute', right: 60, top: 110, transform: `translateX(${(1 - backOut((t - 20) / 16)) * 1000 + easeInOut((t - dur + 24) / 20) * 1000}px)`}}>
			<Panel style={{width: 760, padding: '18px 26px'}}>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
					<span style={{fontFamily: LILITA, fontSize: 48, color: '#fff'}}>MUNDIALES GANADOS</span>
					<span style={{padding: '4px 14px', borderRadius: 10, background: alt ? '#8E5BD9' : C.red, border: `3px solid ${C.navy}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: '#fff'}}>{alt ? 'ALTERNATIVA' : 'REAL'}</span>
				</div>
				{rows.map((r, i) => {
					const v = alt ? r.alt : r.real;
					const changed = alt && r.alt !== r.real;
					return (
						<div key={r.key} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, opacity: clamp01((t - 60 - i * 14) / 12)}}>
							<div style={{width: 34, fontFamily: LILITA, fontSize: 30, color: C.yellow}}>{i + 1}</div>
							<Flag f={r.flag} w={56} />
							<div style={{width: 190, fontFamily: RUBIK, fontWeight: 800, fontSize: 26, color: changed ? C.yellow : '#fff'}}>{r.es.toUpperCase()}</div>
							<div style={{display: 'flex', gap: 4}}>{[0, 1, 2, 3, 4].map((k) => <Star key={k} s={40} on={k < v} glow={changed && k === v - 1 && r.alt > r.real} />)}</div>
							{changed && <span style={{fontFamily: LILITA, fontSize: 30, color: r.alt > r.real ? '#2EC46B' : C.red, marginLeft: 6}}>{r.alt > r.real ? '+1' : '−1'}</span>}
						</div>
					);
				})}
			</Panel>
			{t >= 500 && <div style={{marginTop: 18, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((t - 500) / 14)})`}}><Pill size={28} bg={C.yellow}>ARGENTINA IGUALARÍA A ALEMANIA E ITALIA</Pill></div>}
		</div>
	);
};

const Back2Back: React.FC<{t: number; dur: number}> = ({t, dur}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, transform: `scale(${pIn(t, dur, 10)})`}}>
		<T p={1} size={80}>CAMPEONES DOS VECES SEGUIDAS</T>
		<div style={{display: 'flex', gap: 24}}>
			{[['it', 'ITALIA', '1934 Y 1938', false], ['br', 'BRASIL', '1958 Y 1962', false], ['ar', 'ARGENTINA', '2022 Y 2026', true]].map(([fl, n, y, alt], i) => (
				<div key={n as string} style={{transform: `scale(${backOut((t - 80 - i * 50) / 14)})`, width: 400, padding: '18px 16px', borderRadius: 24, background: alt ? 'rgba(142,91,217,0.95)' : 'rgba(11,30,63,0.95)', border: `6px solid ${alt ? '#fff' : C.yellow}`, textAlign: 'center', boxShadow: alt ? '0 0 30px #8E5BD9' : 'none'}}>
					<div style={{display: 'flex', justifyContent: 'center', gap: 6}}><Trophy size={90} /><Trophy size={90} /></div>
					<div style={{display: 'flex', justifyContent: 'center', marginTop: 6}}><Flag f={fl as string} w={90} /></div>
					<div style={{fontFamily: LILITA, fontSize: 52, color: '#fff', marginTop: 6}}>{n}</div>
					<div style={{fontFamily: LILITA, fontSize: 40, color: C.yellow}}>{y}</div>
					{alt && <div style={{marginTop: 6, fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: '#fff'}}>SOLO EN LA LÍNEA ALTERNATIVA</div>}
				</div>
			))}
		</div>
		{t >= 360 && <div style={{transform: `scale(${backOut((t - 360) / 14)})`}}><Pill size={32} bg={C.yellow}>SERÍA LA TERCERA SELECCIÓN DE LA HISTORIA EN LOGRARLO</Pill></div>}
	</div>
);

const Era: React.FC<{t: number; dur: number}> = ({t, dur}) => {
	const items: [string, string, string, boolean][] = [['2021', 'COPA AMÉRICA', '1-0 a Brasil', false], ['2022', 'FINALISSIMA', '3-0 a Italia', false], ['2022', 'MUNDIAL', 'penaltis a Francia', false], ['2024', 'COPA AMÉRICA', '1-0 a Colombia', false], ['2026', 'MUNDIAL', '¿1-0 a España?', true]];
	return (
		<div style={{position: 'absolute', right: 50, top: 110, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, transformOrigin: 'right top', transform: `scale(${pIn(t, dur, 10) * 1.12})`}}>
			<T p={1} size={74}>LA ERA DORADA DE ARGENTINA</T>
			<div style={{display: 'flex', gap: 14}}>
				{items.map(([y, n, s, alt], i) => (
					<div key={i} style={{transform: `scale(${backOut((t - 60 - i * 40) / 12)})`, width: 200, padding: '14px 8px', borderRadius: 20, background: alt ? 'rgba(142,91,217,0.95)' : 'rgba(11,30,63,0.95)', border: `5px solid ${alt ? '#fff' : SKY}`, textAlign: 'center'}}>
						<div style={{display: 'flex', justifyContent: 'center'}}><Trophy size={84} /></div>
						<div style={{fontFamily: LILITA, fontSize: 40, color: C.yellow}}>{y}</div>
						<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: 1}}>{n}</div>
						<div style={{fontFamily: RUBIK, fontWeight: 600, fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 4}}>{s}</div>
					</div>
				))}
			</div>
			{t >= 320 && (
				<div style={{display: 'flex', gap: 18, transform: `scale(${backOut((t - 320) / 14)})`}}>
					<div style={{padding: '10px 22px', borderRadius: 14, background: C.red, border: `5px solid ${C.navy}`, fontFamily: LILITA, fontSize: 36, color: '#fff'}}>REAL: 4 TÍTULOS EN 5 AÑOS</div>
					<div style={{padding: '10px 22px', borderRadius: 14, background: '#8E5BD9', border: `5px solid ${C.navy}`, fontFamily: LILITA, fontSize: 36, color: '#fff'}}>ALTERNATIVA: 5 DE 5</div>
				</div>
			)}
		</div>
	);
};

const Messi: React.FC<{t: number; dur: number; f: number}> = ({t, dur, f}) => (
	<div style={{position: 'absolute', right: 60, top: 110, width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, transformOrigin: 'right top', transform: `scale(${pIn(t, dur, 10) * 1.12})`}}>
		<T p={1} size={80} color={SKY}>¿Y MESSI?</T>
		<div style={{display: 'flex', gap: 18}}>
			{[['2014', 'Alemania', 'de', 'PERDIDA', C.red], ['2022', 'Francia', 'fr', 'GANADA', '#2EC46B'], ['2026', 'España', 'es', t >= 360 ? 'GANADA' : 'PERDIDA', t >= 360 ? '#8E5BD9' : C.red]].map(([y, o, fl, r, c], i) => (
				<div key={y} style={{transform: `scale(${backOut((t - 60 - i * 40) / 12)})`, width: 300, padding: '14px 10px', borderRadius: 22, background: 'rgba(11,30,63,0.95)', border: `5px solid ${c}`, textAlign: 'center'}}>
					<div style={{fontFamily: LILITA, fontSize: 44, color: C.yellow}}>FINAL {y}</div>
					<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 6}}><Flag f="ar" w={60} /><span style={{fontFamily: LILITA, fontSize: 30, color: '#fff'}}>VS</span><Flag f={fl} w={60} /></div>
					<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff', marginTop: 4}}>{o}</div>
					<div style={{marginTop: 8, display: 'inline-block', padding: '4px 16px', borderRadius: 10, background: c, border: `3px solid ${C.navy}`, fontFamily: LILITA, fontSize: 30, color: '#fff'}}>{r}</div>
				</div>
			))}
		</div>
		{t >= 420 && <div style={{transform: `scale(${backOut((t - 420) / 14)})`}}><Pill size={32} bg={C.yellow}>DOS COPAS DEL MUNDO, LA ÚLTIMA CON 39 AÑOS</Pill></div>}
		{t >= 520 && <div style={{transform: `scale(${backOut((t - 520) / 14)})`, fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.9)'}}>Messi nació el 24 de junio de 1987: tenía 39 años en la final de 2026</div>}
	</div>
);

const Finals: React.FC<{t: number; dur: number}> = ({t, dur}) => {
	const alt = t >= 480;
	const w = FINALS.filter((x) => (x.alt ? alt : x.w)).length;
	return (
		<div style={{position: 'absolute', right: 60, top: 100, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transformOrigin: 'right top', transform: `scale(${pIn(t, dur, 10) * 1.12})`}}>
			<T p={1} size={70}>LAS 7 FINALES DE ARGENTINA</T>
			<div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12}}>
				{FINALS.map((x, i) => {
					const won = x.alt ? alt : x.w;
					return (
						<div key={x.y} style={{transform: `scale(${backOut((t - 60 - i * 30) / 12)})`, width: 250, padding: '10px 8px', borderRadius: 18, background: x.alt && alt ? 'rgba(142,91,217,0.95)' : 'rgba(11,30,63,0.95)', border: `5px solid ${won ? '#2EC46B' : C.red}`, textAlign: 'center'}}>
							<div style={{fontFamily: LILITA, fontSize: 38, color: C.yellow}}>{x.y}</div>
							<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8}}><Flag f="ar" w={44} /><span style={{fontFamily: LILITA, fontSize: 30, color: '#fff'}}>{x.alt && alt ? '1-0' : x.s}</span><Flag f={x.flag} w={44} /></div>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 16, color: x.alt && alt ? '#fff' : won ? '#2EC46B' : '#FF8A94', marginTop: 4}}>{won ? 'CAMPEONA' : 'SUBCAMPEONA'} · {x.opp}</div>
						</div>
					);
				})}
			</div>
			<div style={{display: 'flex', gap: 18, transform: `scale(${backOut((t - 300) / 14)})`}}>
				<div style={{padding: '10px 22px', borderRadius: 14, background: alt ? '#8E5BD9' : C.red, border: `5px solid ${C.navy}`, fontFamily: LILITA, fontSize: 36, color: '#fff'}}>{alt ? 'ALTERNATIVA' : 'REAL'}: {w} GANADAS · {7 - w} PERDIDAS</div>
			</div>
		</div>
	);
};

const Spain: React.FC<{t: number; dur: number; f: number}> = ({t, dur, f}) => {
	const alt = t >= 420;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 90, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - backOut((t - 20) / 16)) * 700 + easeInOut((t - dur + 24) / 20) * 700}px)`}}>
			<Panel style={{width: 1300, padding: '18px 30px', borderColor: alt ? '#8E5BD9' : C.yellow}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 24}}>
					<Hincha iso="img:es" mood={alt ? 'triste' : 'grito'} size={150} scarf={ESP_SC} sweat={alt} open={0.5 + 0.5 * Math.sin(f / 4)} />
					<div style={{flex: 1}}>
						<div style={{fontFamily: LILITA, fontSize: 56, color: '#fff'}}>¿Y ESPAÑA?</div>
						<div style={{display: 'flex', gap: 12, marginTop: 8}}>
							<div style={{padding: '6px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: `3px solid ${C.yellow}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff'}}>EUROCOPA 2024 ✔</div>
							<div style={{padding: '6px 14px', borderRadius: 12, background: alt ? 'rgba(230,57,70,0.3)' : 'rgba(255,255,255,0.08)', border: `3px solid ${alt ? C.red : C.yellow}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff', textDecoration: alt ? 'line-through' : 'none'}}>MUNDIAL 2026 ✔</div>
							<div style={{display: 'flex', gap: 4, alignItems: 'center'}}><Star s={40} /><Star s={40} on={!alt} /></div>
						</div>
					</div>
					<div style={{textAlign: 'center'}}>
						<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 16, letterSpacing: 2, color: C.yellow}}>ARGENTINA–ESPAÑA</div>
						<div style={{fontFamily: LILITA, fontSize: 40, color: '#fff'}}>{alt ? '7-2-6' : '6-2-7'}</div>
						<div style={{fontFamily: RUBIK, fontWeight: 700, fontSize: 15, color: 'rgba(255,255,255,0.75)'}}>victorias ARG · empates · ESP</div>
					</div>
				</div>
				{t >= 200 && <div style={{marginTop: 12, fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: '#fff', opacity: clamp01((t - 200) / 12)}}>{alt ? 'Sin la final, España se quedaría con un solo Mundial (2010) y el historial pasaría a favor de Argentina' : 'De verdad: España ganó la Eurocopa 2024 y el Mundial 2026, y lidera el historial 7 a 6'}</div>}
			</Panel>
		</div>
	);
};

const Elo: React.FC<{t: number; dur: number}> = ({t, dur}) => {
	const alt = t >= 420;
	const rows = [...ELO].sort((a, b) => (alt ? b.alt - a.alt : b.real - a.real));
	const max = 2400, min = 2050;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center', transform: `scale(${pIn(t, dur, 10)})`}}>
			<Panel style={{width: 1100, padding: '18px 30px', borderColor: alt ? '#8E5BD9' : C.yellow}}>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
					<span style={{fontFamily: LILITA, fontSize: 50, color: '#fff'}}>RANKING ELO MUNDIAL</span>
					<span style={{padding: '4px 14px', borderRadius: 10, background: alt ? '#8E5BD9' : C.red, border: `3px solid ${C.navy}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: '#fff'}}>{alt ? 'ALTERNATIVA' : 'REAL'}</span>
				</div>
				{rows.map((r, i) => {
					const v = alt ? r.alt : r.real;
					return (
						<div key={r.key} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 12}}>
							<div style={{width: 34, fontFamily: LILITA, fontSize: 32, color: C.yellow}}>{i + 1}</div>
							<Flag f={r.flag} w={58} />
							<div style={{width: 200, fontFamily: RUBIK, fontWeight: 800, fontSize: 26, color: '#fff'}}>{r.es.toUpperCase()}</div>
							<div style={{flex: 1, height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.1)', overflow: 'hidden'}}>
								<div style={{width: `${((v - min) / (max - min)) * 100 * easeOut((t - 60) / 40)}%`, height: '100%', background: r.key === 'ARG' ? SKY : r.key === 'ESP' ? '#E8A800' : '#2EC46B', borderRadius: 15, transition: 'none'}} />
							</div>
							<div style={{width: 100, textAlign: 'right', fontFamily: LILITA, fontSize: 36, color: '#fff'}}>{v}</div>
						</div>
					);
				})}
				{t >= 480 && <div style={{marginTop: 14, fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: '#fff', transform: `scale(${backOut((t - 480) / 12)})`}}>España seguiría primera... ¡pero solo 3 puntos por delante de Argentina!</div>}
			</Panel>
		</div>
	);
};

const ReactCard: React.FC<{i: number; t: number; dur: number}> = ({i, t, dur}) => {
	const r = REACT[i];
	return (
		<>
			{i === 0 && t < 120 && <div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center', transform: `scale(${backOut(t / 12) * (1 - easeInOut((t - 100) / 16))})`}}><Pill size={36} bg={C.yellow}>¿CÓMO REACCIONARÍA EL MUNDO?</Pill></div>}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 90, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - backOut((t - 30) / 16)) * 600 + easeInOut((t - dur + 20) / 16) * 600}px)`}}>
				<Panel style={{width: 1200, padding: '16px 28px', borderColor: r.col}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
						<Hincha iso={`img:${r.flag}`} mood={r.mood} size={140} scarf={null} />
						<div style={{flex: 1}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
								<span style={{fontFamily: LILITA, fontSize: 50, color: '#fff'}}>{r.es.toUpperCase()}</span>
								<span style={{padding: '4px 14px', borderRadius: 12, background: r.col, border: `4px solid ${C.navy}`, fontFamily: LILITA, fontSize: 30, color: r.col === '#FFD23F' ? C.navy : '#fff', transform: `scale(${backOut((t - 70) / 10)}) rotate(-3deg)`}}>{r.line}</span>
							</div>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 25, color: 'rgba(255,255,255,0.9)', marginTop: 8, opacity: clamp01((t - 100) / 12)}}>{r.sub}</div>
						</div>
					</div>
				</Panel>
			</div>
		</>
	);
};

const Y2030: React.FC<{t: number; dur: number}> = ({t, dur}) => (
	<div style={{position: 'absolute', left: 0, right: 0, bottom: 90, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - backOut((t - 20) / 16)) * 700 + easeInOut((t - dur + 24) / 20) * 700}px)`}}>
		<Panel style={{width: 1300, padding: '18px 30px', borderColor: '#2EC46B'}}>
			<div style={{fontFamily: LILITA, fontSize: 52, color: '#fff'}}>Y AHORA... EL MUNDIAL 2030</div>
			<div style={{display: 'flex', gap: 12, marginTop: 10, alignItems: 'center'}}>
				{[['es', 'ESPAÑA'], ['pt', 'PORTUGAL'], ['ma', 'MARRUECOS']].map(([fl, n], i) => <div key={n} style={{transform: `scale(${backOut((t - 60 - i * 20) / 12)})`, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: `3px solid ${C.yellow}`}}><Flag f={fl} w={46} /><span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff'}}>{n}</span></div>)}
				<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap'}}>+ centenario en</span>
				{[['uy', 'URUGUAY'], ['ar', 'ARGENTINA'], ['py', 'PARAGUAY']].map(([fl, n], i) => <div key={n} style={{transform: `scale(${backOut((t - 140 - i * 20) / 12)})`, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: `3px solid ${SKY}`}}><Flag f={fl} w={46} /><span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff'}}>{n}</span></div>)}
			</div>
			{t >= 300 && (
				<div style={{display: 'flex', gap: 16, marginTop: 14, transform: `scale(${backOut((t - 300) / 14)})`}}>
					<div style={{flex: 1, padding: '10px 16px', borderRadius: 14, background: 'rgba(230,57,70,0.2)', border: `4px solid ${C.red}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff'}}><b style={{color: C.red}}>REAL:</b> España llegaría a SU Mundial como campeona defensora</div>
					<div style={{flex: 1, padding: '10px 16px', borderRadius: 14, background: 'rgba(142,91,217,0.3)', border: '4px solid #8E5BD9', fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff'}}><b style={{color: '#C9A7FF'}}>ALTERNATIVA:</b> Argentina iría a por su tercer Mundial seguido</div>
				</div>
			)}
		</Panel>
	</div>
);

const Split: React.FC<{t: number; f: number; dur: number}> = ({t, f, dur}) => {
	const p = backOut((t - 20) / 18);
	return (
		<AbsoluteFill style={{opacity: 1 - clamp01((t - dur + 20) / 20)}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, background: 'linear-gradient(160deg, rgba(170,21,27,0.92), rgba(80,8,12,0.92))', transform: `translateX(${(1 - p) * -960}px)`}} />
			<div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, background: 'linear-gradient(200deg, rgba(116,172,223,0.92), rgba(40,70,140,0.92))', transform: `translateX(${(1 - p) * 960}px)`}} />
			<div style={{position: 'absolute', left: 950, top: 0, width: 20, height: 1080, background: '#fff', boxShadow: '0 0 30px #fff', opacity: p}} />
			{[['REAL', 'img:es', ESP_SC, 'ESPAÑA', 2, 'LA LÍNEA REAL'], ['ALTERNATIVA', 'img:ar', ARG_SC, 'ARGENTINA', 4, 'LA LÍNEA ALTERNATIVA']].map(([k, iso, sc, n, st, lab], i) => (
				<div key={k as string} style={{position: 'absolute', left: i * 960, top: 70, width: 960, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transform: `scale(${backOut((t - 40 - i * 20) / 14)})`}}>
					<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: '#fff'}}>{lab as string}</div>
					<Hincha iso={iso as string} mood="grito" size={300} scarf={sc as [string, string]} open={0.5 + 0.5 * Math.sin(f / 4 + i)} />
					<div style={{fontFamily: LILITA, fontSize: 80, color: '#fff', ...strokeText(12)}}>{n as string}</div>
					<div style={{fontFamily: LILITA, fontSize: 44, color: C.yellow, ...strokeText(8)}}>CAMPEONA DEL MUNDO 2026</div>
					<div style={{display: 'flex', gap: 6}}>{Array.from({length: st as number}).map((_, k) => <Star key={k} s={60} glow />)}</div>
				</div>
			))}
			{t >= 300 && <div style={{position: 'absolute', left: 0, right: 0, bottom: 120, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((t - 300) / 14)})`}}><Pill size={38} bg="#fff">¿QUÉ LÍNEA TEMPORAL PREFIERES? ¡COMENTA!</Pill></div>}
		</AbsoluteFill>
	);
};

const Outro: React.FC<{t: number; f: number}> = ({t, f}) => {
	const outP = (d: number) => backOut((t - d) / 14);
	return (
		<AbsoluteFill style={{background: 'rgba(8,20,40,0.55)'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
				<div style={{transform: `scale(${outP(0)})`, textAlign: 'center'}}>
					<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1.05, color: '#fff', ...strokeText(14)}}>¿QUÉ OTRO "¿Y SI...?"</div>
					<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1.05, color: C.yellow, ...strokeText(14)}}>QUIERES VER?</div>
				</div>
				<div style={{display: 'flex', gap: 22}}>
					{[['¿Y SI BRASIL...?', '#1BA34E'], ['¿Y SI ESPAÑA...?', '#E8A800'], ['¿Y SI MÉXICO...?', '#CE1126']].map(([n, c], i) => (
						<div key={n} style={{transform: `scale(${outP(60 + i * 14)}) rotate(${(i - 1) * 3}deg)`, padding: '18px 30px', borderRadius: 20, background: c, border: `6px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)', fontFamily: LILITA, fontSize: 48, color: '#fff'}}>{n}</div>
					))}
				</div>
				<div style={{transform: `scale(${outP(150)})`}}><Pill size={34} bg="#fff">¡DÍMELO EN LOS COMENTARIOS!</Pill></div>
				<div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 16}}>
					<div style={{transform: `scale(${outP(240)}) rotate(${Math.sin(f / 10) * 4}deg)`}}><Hincha iso="balon" mood="feliz" size={190} scarf={['#FFD23F', '#E63946']} blink={blinkAt(f, 3)} /></div>
					<Subscribe f={t} start={300} />
				</div>
				<div style={{transform: `scale(${outP(260)})`, fontFamily: LILITA, fontSize: 46, color: '#fff', ...strokeText(10)}}>EL MAPA HINCHA</div>
			</div>
			{t >= 800 && <AbsoluteFill style={{background: '#000', opacity: clamp01((t - 800) / 40)}} />}
		</AbsoluteFill>
	);
};

// ---------------- goal timeline (0-120') ----------------
const GoalBar: React.FC<{i: number; t: number}> = ({i, t}) => {
	const gs = GOALS[i];
	const et = gs.some((g) => g.m > 95) || i === 5;
	const max = et ? 120 : 95;
	const W = 1170;
	return (
		<div style={{position: 'relative', marginTop: 14, height: 78, opacity: clamp01(t / 12)}}>
			<div style={{position: 'absolute', left: 0, top: 30, width: W, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.18)'}} />
			<div style={{position: 'absolute', left: 0, top: 30, width: W * easeOut(t / 50), height: 10, borderRadius: 5, background: SKY}} />
			{[0, 45, 90, ...(et ? [105, 120] : [])].map((m) => <div key={m} style={{position: 'absolute', left: (m / max) * W - 20, top: 44, width: 40, textAlign: 'center', fontFamily: RUBIK, fontWeight: 800, fontSize: 14, color: 'rgba(255,255,255,0.6)'}}>{m}'</div>)}
			{et && <div style={{position: 'absolute', left: (90 / max) * W, top: 22, width: W - (90 / max) * W, height: 26, borderRadius: 8, border: '2px dashed rgba(255,210,63,0.7)'}}><span style={{position: 'absolute', right: 6, top: -22, fontFamily: RUBIK, fontWeight: 800, fontSize: 13, color: C.yellow, letterSpacing: 1}}>PRÓRROGA</span></div>}
			{gs.map((g, k) => {
				const x = Math.min(W - 10, (Math.min(g.m, max) / max) * W);
				const p = backOut((t - 20 - k * 26) / 10);
				const col = g.rival ? C.red : '#2EC46B';
				return (
					<div key={k} style={{position: 'absolute', left: x, top: k % 2 === 0 ? -8 : 50, transform: `translateX(-50%) scale(${Math.max(0, p)})`, display: 'flex', alignItems: 'center', gap: 6, padding: '2px 10px', borderRadius: 10, background: col, border: `3px solid ${C.navy}`, whiteSpace: 'nowrap', zIndex: 2}}>
						<span style={{fontFamily: LILITA, fontSize: 20, color: '#fff'}}>⚽ {g.m}'</span>
						<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 17, color: '#fff'}}>{g.who}{g.pen ? ' (pen.)' : ''}</span>
					</div>
				);
			})}
		</div>
	);
};

const BigStat: React.FC<{n: string; l: string; c: string; p: number; w?: number}> = ({n, l, c, p, w = 250}) => (
	<div style={{transform: `scale(${Math.max(0, p)})`, width: w, padding: '12px 0', borderRadius: 20, background: 'rgba(11,30,63,0.95)', border: `5px solid ${c}`, textAlign: 'center'}}>
		<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1, color: '#fff'}}>{n}</div>
		<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: c}}>{l}</div>
	</div>
);

const Pre: React.FC<{t: number; dur: number}> = ({t, dur}) => (
	<div style={{position: 'absolute', right: 50, top: 110, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, transformOrigin: 'right top', transform: `scale(${pIn(t, dur, 10)})`}}>
		<T p={1} size={70}>ASÍ LLEGABA ARGENTINA</T>
		<Pill size={26} bg="#fff">DE LA FINAL DE QATAR 2022 AL MUNDIAL 2026</Pill>
		<div style={{display: 'flex', gap: 14}}>
			<BigStat n={`${PRE.p}`} l="PARTIDOS" c="#fff" p={backOut((t - 80) / 12)} w={200} />
			<BigStat n={`${PRE.w}`} l="VICTORIAS" c="#2EC46B" p={backOut((t - 100) / 12)} w={200} />
			<BigStat n={`${PRE.d}`} l="EMPATES" c={C.yellow} p={backOut((t - 120) / 12)} w={200} />
			<BigStat n={`${PRE.l}`} l="DERROTAS" c={C.red} p={backOut((t - 140) / 12)} w={200} />
		</div>
		<div style={{display: 'flex', gap: 14}}>
			<BigStat n={`${PRE.gf}`} l="GOLES A FAVOR" c={SKY} p={backOut((t - 220) / 12)} w={300} />
			<BigStat n={`${PRE.ga}`} l="EN CONTRA" c="#FF8A94" p={backOut((t - 240) / 12)} w={300} />
			<BigStat n={`${Math.round((PRE.w / PRE.p) * 100)}%`} l="DE VICTORIAS" c="#2EC46B" p={backOut((t - 260) / 12)} w={300} />
		</div>
		{t >= 420 && <div style={{transform: `scale(${backOut((t - 420) / 14)})`, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 24px', borderRadius: 16, background: C.yellow, border: `5px solid ${C.navy}`}}><Trophy size={60} /><span style={{fontFamily: LILITA, fontSize: 36, color: C.navy}}>Y CAMPEONA DE LA COPA AMÉRICA 2024</span></div>}
		{t >= 560 && <div style={{transform: `scale(${backOut((t - 560) / 14)})`}}><Pill size={30} bg={C.red} color="#fff">LLEGABA COMO CAMPEONA DEL MUNDO VIGENTE</Pill></div>}
	</div>
);

const Group: React.FC<{t: number; dur: number}> = ({t, dur}) => (
	<div style={{position: 'absolute', left: 0, right: 0, bottom: 90, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - backOut((t - 20) / 16)) * 700 + easeInOut((t - dur + 24) / 20) * 700}px)`}}>
		<Panel style={{width: 1180, padding: '16px 28px'}}>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
				<span style={{fontFamily: LILITA, fontSize: 46, color: '#fff'}}>CLASIFICACIÓN DEL GRUPO</span>
				<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: C.yellow, letterSpacing: 2}}>PJ · G · E · P · GF · GC · PTS</span>
			</div>
			{GROUP.map((g, i) => (
				<div key={g.key} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, padding: '6px 12px', borderRadius: 12, background: i < 2 ? 'rgba(46,196,107,0.18)' : i === 2 ? 'rgba(255,210,63,0.12)' : 'rgba(230,57,70,0.15)', opacity: clamp01((t - 60 - i * 20) / 12), transform: `translateX(${(1 - easeOut((t - 60 - i * 20) / 16)) * -80}px)`}}>
					<div style={{width: 30, fontFamily: LILITA, fontSize: 32, color: C.yellow}}>{i + 1}</div>
					<Flag f={g.flag} w={56} />
					<div style={{width: 300, fontFamily: RUBIK, fontWeight: 800, fontSize: 28, color: '#fff'}}>{g.es.toUpperCase()}</div>
					{[g.pj, g.g, g.e, g.p, g.gf, g.gc].map((v, k) => <div key={k} style={{width: 70, textAlign: 'center', fontFamily: LILITA, fontSize: 30, color: 'rgba(255,255,255,0.85)'}}>{v}</div>)}
					<div style={{width: 80, textAlign: 'center', fontFamily: LILITA, fontSize: 38, color: g.key === 'ARG' ? C.yellow : '#fff'}}>{g.pts}</div>
				</div>
			))}
			{t >= 300 && <div style={{marginTop: 12, display: 'flex', gap: 14, opacity: clamp01((t - 300) / 12)}}>
				<Pill size={24} bg="#2EC46B" color="#fff">PLENO: 9 DE 9 PUNTOS</Pill>
				<Pill size={24} bg="#fff">8 GOLES, SOLO 1 EN CONTRA</Pill>
				<Pill size={24} bg={C.yellow}>AUSTRIA, 2.ª POR GOLES</Pill>
			</div>}
		</Panel>
	</div>
);

const Late: React.FC<{t: number; dur: number}> = ({t, dur}) => {
	const all = GOALS.slice(0, 7).flatMap((g) => g.filter((x) => !x.rival));
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, transform: `scale(${pIn(t, dur, 10)})`}}>
			<T p={1} size={74}>EL EQUIPO DE LOS GOLES TARDÍOS</T>
			<div style={{position: 'relative', width: 1500, height: 170, borderRadius: 24, background: 'rgba(11,30,63,0.95)', border: `5px solid ${C.yellow}`}}>
				<div style={{position: 'absolute', left: 30 + (80 / 120) * 1440, top: 10, bottom: 10, right: 30, borderRadius: 14, background: 'rgba(255,210,63,0.18)', opacity: clamp01((t - 260) / 20)}} />
				{[0, 15, 30, 45, 60, 75, 90, 105, 120].map((m) => <div key={m} style={{position: 'absolute', left: 30 + (m / 120) * 1440 - 20, bottom: 8, width: 40, textAlign: 'center', fontFamily: RUBIK, fontWeight: 800, fontSize: 16, color: 'rgba(255,255,255,0.6)'}}>{m}'</div>)}
				{all.map((g, k) => {
					const late = g.m >= 80;
					const p = backOut((t - 60 - k * 8) / 10);
					const same = all.filter((x, j) => j < k && Math.abs(x.m - g.m) < 3).length;
					return <div key={k} style={{position: 'absolute', left: 30 + (Math.min(g.m, 120) / 120) * 1440 - 20, top: 22 + same * 28, transform: `scale(${Math.max(0, p)})`, width: 40, height: 40, borderRadius: 20, background: late && t >= 260 ? C.yellow : '#fff', border: `4px solid ${C.navy}`, fontSize: 22, textAlign: 'center', lineHeight: '34px', boxShadow: late && t >= 260 ? '0 0 16px #FFD23F' : 'none'}}>⚽</div>;
				})}
			</div>
			{t >= 300 && <div style={{display: 'flex', gap: 18}}>
				<BigStat n="10/19" l="GOLES DESDE EL MINUTO 80" c={C.yellow} p={backOut((t - 300) / 12)} w={400} />
				<BigStat n="3" l="REMONTADAS" c="#2EC46B" p={backOut((t - 330) / 12)} w={300} />
				<BigStat n="3" l="PARTIDOS CON PRÓRROGA" c={SKY} p={backOut((t - 360) / 12)} w={400} />
			</div>}
			{t >= 480 && <div style={{transform: `scale(${backOut((t - 480) / 14)})`}}><Pill size={30} bg={C.red} color="#fff">PERO EN LA FINAL, EL GOL TARDÍO FUE DE ESPAÑA</Pill></div>}
		</div>
	);
};

const Scorers: React.FC<{t: number; dur: number}> = ({t, dur}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center', gap: 30, transform: `scale(${pIn(t, dur, 10)})`}}>
		<Panel style={{width: 760, padding: '16px 24px'}}>
			<div style={{fontFamily: LILITA, fontSize: 40, color: '#fff'}}>MÁXIMOS GOLEADORES DEL MUNDIAL</div>
			{TOPSC.map((r, i) => (
				<div key={r.who} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 9, opacity: clamp01((t - 60 - i * 16) / 12)}}>
					<div style={{width: 28, fontFamily: LILITA, fontSize: 28, color: C.yellow}}>{i + 1}</div>
					<Flag f={r.flag} w={50} />
					<div style={{width: 280, fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: r.flag === 'ar' ? SKY : '#fff'}}>{r.who}</div>
					<div style={{flex: 1, height: 24, borderRadius: 12, background: 'rgba(255,255,255,0.1)'}}><div style={{width: `${(r.n / 10) * 100 * easeOut((t - 80 - i * 16) / 30)}%`, height: '100%', borderRadius: 12, background: r.flag === 'ar' ? SKY : '#2EC46B'}} /></div>
					<div style={{width: 40, textAlign: 'right', fontFamily: LILITA, fontSize: 32, color: '#fff'}}>{r.n}</div>
				</div>
			))}
		</Panel>
		<Panel style={{width: 560, padding: '16px 24px', opacity: clamp01((t - 300) / 14)}}>
			<div style={{fontFamily: LILITA, fontSize: 40, color: '#fff'}}>LOS 19 GOLES DE ARGENTINA</div>
			{ARG_SC_LIST.map(([n, g], i) => (
				<div key={n} style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, opacity: clamp01((t - 320 - i * 12) / 10)}}>
					<div style={{width: 250, fontFamily: RUBIK, fontWeight: 800, fontSize: 21, color: '#fff'}}>{n}</div>
					<div style={{display: 'flex', gap: 3}}>{Array.from({length: g}).map((_, k) => <span key={k} style={{fontSize: 20}}>⚽</span>)}</div>
				</div>
			))}
			{t >= 500 && <div style={{marginTop: 10, fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: C.yellow}}>Messi marcó 8 de los 19: el 42%</div>}
		</Panel>
	</div>
);

const SpainRoute: React.FC<{t: number; z: number}> = ({t, z}) => {
	const k = 1 / z;
	return (
		<g>
			{SPAIN_PATH.map((m, i) => {
				if (i === 0) return null;
				const [x0, y0] = SPAIN_PATH[i - 1].city, [x1, y1] = m.city;
				if (x0 === x1 && y0 === y1) return null;
				return <path key={i} d={`M${x0} ${y0} Q${(x0 + x1) / 2} ${Math.min(y0, y1) - 50} ${x1} ${y1}`} fill="none" stroke="#F1BF00" strokeWidth={5 * k} strokeDasharray={`${12 * k} ${8 * k}`} opacity={clamp01((t - 60 - i * 120) / 20)} />;
			})}
			{SPAIN_PATH.map((m, i) => {
				const pin = backOut((t - 80 - i * 120) / 14);
				if (pin <= 0) return null;
				const off = SPAIN_PATH.slice(0, i).filter((q) => q.city[0] === m.city[0]).length;
				return (
					<g key={'s' + i} transform={`translate(${m.city[0] + off * 14} ${m.city[1]}) scale(${k * pin})`}>
						<path d="M0 0 C -14 -22 -28 -34 -28 -54 A28 28 0 1 1 28 -54 C 28 -34 14 -22 0 0 Z" fill="#AA151B" stroke={C.navy} strokeWidth={5} />
						<text x={0} y={-44} textAnchor="middle" fontFamily="Lilita" fontSize={30} fill="#F1BF00" stroke={C.navy} strokeWidth={5} paintOrder="stroke">{i + 1}</text>
					</g>
				);
			})}
		</g>
	);
};
const SpainPath: React.FC<{t: number; dur: number}> = ({t, dur}) => {
	const shown = Math.min(8, Math.floor((t - 80) / 120) + 1);
	return (
		<>
			<div style={{position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', justifyContent: 'center', transform: `scale(${pIn(t, dur, 10)})`}}><Pill size={32} bg="#AA151B" color="#fff">MIENTRAS TANTO... EL CAMINO DE ESPAÑA</Pill></div>
			<div style={{position: 'absolute', right: 40, top: 180, width: 560, display: 'flex', flexDirection: 'column', gap: 8, transform: `translateX(${(1 - backOut((t - 40) / 16)) * 700 + easeInOut((t - dur + 24) / 20) * 700}px)`}}>
				{SPAIN_PATH.map((m, i) => i < shown && (
					<div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '6px 14px', borderRadius: 14, background: 'rgba(11,30,63,0.95)', border: `4px solid ${m.gf > m.ga ? '#2EC46B' : C.yellow}`, transform: `scale(${backOut((t - 80 - i * 120) / 12)})`}}>
						<div style={{width: 150, fontFamily: RUBIK, fontWeight: 800, fontSize: 15, letterSpacing: 1, color: C.yellow}}>{m.r}</div>
						<Flag f="es" w={40} />
						<div style={{fontFamily: LILITA, fontSize: 30, color: '#fff', width: 70, textAlign: 'center'}}>{m.gf}-{m.ga}</div>
						<Flag f={m.flag} w={40} />
						<div style={{flex: 1, fontFamily: RUBIK, fontWeight: 800, fontSize: 19, color: '#fff'}}>{m.opp}</div>
						<div style={{fontFamily: RUBIK, fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.7)'}}>{m.cityEs}</div>
					</div>
				))}
			</div>
			{t >= 1040 && (
				<div style={{position: 'absolute', left: 60, bottom: 100, display: 'flex', gap: 14}}>
					<BigStat n="14" l="GOLES A FAVOR" c="#2EC46B" p={backOut((t - 1040) / 12)} w={240} />
					<BigStat n="1" l="GOL ENCAJADO EN 8 PARTIDOS" c={C.yellow} p={backOut((t - 1065) / 12)} w={400} />
				</div>
			)}
		</>
	);
};

const Odds: React.FC<{t: number; dur: number; f: number}> = ({t, dur, f}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, transform: `scale(${pIn(t, dur, 10)})`}}>
		<T p={1} size={76}>¿QUIÉN ERA FAVORITO EN LA FINAL?</T>
		<div style={{display: 'flex', alignItems: 'center', gap: 30}}>
			<div style={{textAlign: 'center'}}><Hincha iso="img:es" mood="enfado" size={170} scarf={ESP_SC} open={0.5 + 0.5 * Math.sin(f / 5)} /><div style={{fontFamily: LILITA, fontSize: 34, color: '#fff'}}>ELO {ELO_PRE.esp}</div></div>
			<div style={{width: 900}}>
				<div style={{display: 'flex', height: 90, borderRadius: 22, overflow: 'hidden', border: `6px solid ${C.navy}`, boxShadow: '0 10px 0 rgba(0,0,0,0.35)'}}>
					<div style={{width: `${50 + (ELO_PRE.pEsp - 50) * easeOut((t - 120) / 60)}%`, background: '#AA151B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 56, color: '#F1BF00'}}>{t >= 150 ? `${ELO_PRE.pEsp}%` : ''}</div>
					<div style={{flex: 1, background: SKY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 56, color: '#fff', ...strokeText(6)}}>{t >= 150 ? `${ELO_PRE.pArg}%` : ''}</div>
				</div>
				<div style={{marginTop: 10, textAlign: 'center', fontFamily: RUBIK, fontWeight: 700, fontSize: 20, color: 'rgba(255,255,255,0.8)'}}>Expectativa de resultado según el ranking Elo justo antes de la final</div>
			</div>
			<div style={{textAlign: 'center'}}><Hincha iso="img:ar" mood="enfado" size={170} scarf={ARG_SC} /><div style={{fontFamily: LILITA, fontSize: 34, color: '#fff'}}>ELO {ELO_PRE.arg}</div></div>
		</div>
		{t >= 360 && <div style={{transform: `scale(${backOut((t - 360) / 14)})`}}><Pill size={36} bg={C.yellow}>CASI UNA MONEDA AL AIRE</Pill></div>}
	</div>
);

const EloChart: React.FC<{t: number; dur: number}> = ({t, dur}) => {
	const A = ELO_HIST.Argentina, E = ELO_HIST.Spain;
	const months = Array.from(new Set([...A, ...E].map((x) => x[0]))).sort();
	const W = 1300, H = 440, min = 2000, max = 2400;
	const fill = (arr: [string, number][]) => { let last = arr[0][1]; return months.map((m) => { const h = arr.find((x) => x[0] === m); if (h) last = h[1]; return last; }); };
	const a = fill(A), e = fill(E);
	const pr = clamp01((t - 60) / 360);
	const pts = (v: number[]) => v.slice(0, Math.max(2, Math.ceil(pr * v.length))).map((y, i) => `${(i / (v.length - 1)) * W},${H - ((y - min) / (max - min)) * H}`).join(' ');
	const yr = (m: string) => months.indexOf(m);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center', transform: `scale(${pIn(t, dur, 10)})`}}>
			<Panel style={{width: 1440, padding: '16px 30px'}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
					<span style={{fontFamily: LILITA, fontSize: 46, color: '#fff'}}>ELO: ARGENTINA VS ESPAÑA DESDE QATAR 2022</span>
					<div style={{display: 'flex', gap: 16}}>{[['ARGENTINA', SKY], ['ESPAÑA', '#E8A800']].map(([n, c]) => <span key={n} style={{display: 'flex', alignItems: 'center', gap: 6, fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: '#fff'}}><span style={{width: 26, height: 10, borderRadius: 5, background: c}} />{n}</span>)}</div>
				</div>
				<svg width={W + 80} height={H + 50} style={{marginTop: 10, overflow: 'visible'}}>
					<g transform="translate(60 10)">
						{[2000, 2100, 2200, 2300, 2400].map((v) => <g key={v}><line x1={0} x2={W} y1={H - ((v - min) / (max - min)) * H} y2={H - ((v - min) / (max - min)) * H} stroke="rgba(255,255,255,0.12)" strokeWidth={2} /><text x={-10} y={H - ((v - min) / (max - min)) * H + 6} textAnchor="end" fontFamily="Rubik" fontWeight={800} fontSize={16} fill="rgba(255,255,255,0.6)">{v}</text></g>)}
						{['2023-01', '2024-01', '2025-01', '2026-01'].map((m) => yr(m) >= 0 && <text key={m} x={(yr(m) / (months.length - 1)) * W} y={H + 34} textAnchor="middle" fontFamily="Rubik" fontWeight={800} fontSize={18} fill="rgba(255,255,255,0.7)">{m.slice(0, 4)}</text>)}
						<polyline points={pts(e)} fill="none" stroke="#E8A800" strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
						<polyline points={pts(a)} fill="none" stroke={SKY} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
					</g>
				</svg>
				{t >= 460 && <div style={{display: 'flex', gap: 14, opacity: clamp01((t - 460) / 12)}}>
					<Pill size={24} bg="#E8A800">ESPAÑA: DE {e[0]} A {e[e.length - 1]} (+{e[e.length - 1] - e[0]})</Pill>
					<Pill size={24} bg={SKY}>ARGENTINA: DE {a[0]} A {a[a.length - 1]} (+{a[a.length - 1] - a[0]})</Pill>
				</div>}
				{t >= 600 && <div style={{marginTop: 10, fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: '#fff', opacity: clamp01((t - 600) / 12)}}>España se convirtió en la mejor selección del ranking... y la final lo confirmó</div>}
			</Panel>
		</div>
	);
};

const P2: React.FC<{t: number; dur: number}> = ({t, dur}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, transform: `scale(${backOut((t - 20) / 16) * (1 - easeInOut((t - dur + 24) / 20))})`}}>
		<T p={1} size={104} color="#C9A7FF" shadow="#4B2A8A">PARTE 2</T>
		<T p={1} size={70}>LA LÍNEA TEMPORAL ALTERNATIVA</T>
		<Pill size={30} bg="#fff">¿Y SI EL GOL DE LA FINAL HUBIERA SIDO ARGENTINO?</Pill>
	</div>
);

const H2HGrid: React.FC<{t: number; dur: number}> = ({t, dur}) => {
	const alt = t >= 600;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, transform: `scale(${pIn(t, dur, 10)})`}}>
			<T p={1} size={70}>ARGENTINA VS ESPAÑA: LOS 15 DUELOS</T>
			<div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12}}>
				{H2H.map((h, i) => {
					const last = i === H2H.length - 1;
					const w = last && alt ? 'A' : h.w;
					const col = w === 'A' ? SKY : w === 'E' ? '#E8A800' : 'rgba(255,255,255,0.6)';
					return (
						<div key={i} style={{transform: `scale(${backOut((t - 60 - i * 14) / 10)})`, width: 230, padding: '8px 6px', borderRadius: 16, background: last && alt ? 'rgba(142,91,217,0.95)' : 'rgba(11,30,63,0.95)', border: `5px solid ${col}`, textAlign: 'center'}}>
							<div style={{fontFamily: LILITA, fontSize: 34, color: C.yellow}}>{h.y}</div>
							<div style={{fontFamily: LILITA, fontSize: 34, color: '#fff'}}>ARG {last && alt ? '1-0' : h.s} ESP</div>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, color: col}}>{h.t.toUpperCase()}</div>
						</div>
					);
				})}
			</div>
			<div style={{display: 'flex', gap: 16, transform: `scale(${backOut((t - 320) / 14)})`}}>
				<Pill size={30} bg={alt ? '#8E5BD9' : C.red} color="#fff">{alt ? 'ALTERNATIVA: ARGENTINA 7 · 2 · 6 ESPAÑA' : 'REAL: ARGENTINA 6 · 2 · 7 ESPAÑA'}</Pill>
			</div>
			{t >= 440 && t < 600 && <div style={{opacity: clamp01((t - 440) / 12), fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: '#fff'}}>Solo se habían cruzado una vez en un Mundial: Inglaterra 1966 (2-1 para Argentina)</div>}
		</div>
	);
};

const Wins: React.FC<{t: number; dur: number}> = ({t, dur}) => {
	const alt = t >= 420;
	const rows = [...WCWINS].sort((a, b) => (alt ? b.alt - a.alt : b.real - a.real));
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center', transform: `scale(${pIn(t, dur, 10)})`}}>
			<Panel style={{width: 1100, padding: '16px 30px', borderColor: alt ? '#8E5BD9' : C.yellow}}>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
					<span style={{fontFamily: LILITA, fontSize: 46, color: '#fff'}}>PARTIDOS GANADOS EN MUNDIALES</span>
					<span style={{padding: '4px 14px', borderRadius: 10, background: alt ? '#8E5BD9' : C.red, border: `3px solid ${C.navy}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: '#fff'}}>{alt ? 'ALTERNATIVA' : 'REAL'}</span>
				</div>
				{rows.map((r, i) => {
					const v = alt ? r.alt : r.real;
					return (
						<div key={r.key} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 10}}>
							<div style={{width: 30, fontFamily: LILITA, fontSize: 30, color: C.yellow}}>{i + 1}</div>
							<Flag f={r.flag} w={54} />
							<div style={{width: 190, fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: '#fff'}}>{r.es.toUpperCase()}</div>
							<div style={{flex: 1, height: 26, borderRadius: 13, background: 'rgba(255,255,255,0.1)'}}><div style={{width: `${(v / 80) * 100 * easeOut((t - 60) / 40)}%`, height: '100%', borderRadius: 13, background: r.key === 'ARG' ? SKY : r.key === 'ESP' ? '#E8A800' : '#2EC46B'}} /></div>
							<div style={{width: 60, textAlign: 'right', fontFamily: LILITA, fontSize: 32, color: '#fff'}}>{v}</div>
							{alt && r.alt !== r.real && <span style={{fontFamily: LILITA, fontSize: 26, color: r.alt > r.real ? '#2EC46B' : C.red}}>{r.alt > r.real ? '+1' : '−1'}</span>}
						</div>
					);
				})}
				<div style={{marginTop: 10, fontFamily: RUBIK, fontWeight: 700, fontSize: 18, color: 'rgba(255,255,255,0.7)'}}>Victorias en el tiempo reglamentario o la prórroga (las tandas de penaltis cuentan como empate)</div>
				{t >= 520 && <div style={{marginTop: 8, fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: '#fff', opacity: clamp01((t - 520) / 12)}}>Con un gol, Inglaterra pasaría por delante de España en victorias mundialistas</div>}
			</Panel>
		</div>
	);
};

const Nums: React.FC<{t: number; dur: number}> = ({t, dur}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, transform: `scale(${pIn(t, dur, 10)})`}}>
		<T p={1} size={74}>EL MUNDIAL 2026 EN NÚMEROS</T>
		<div style={{display: 'flex', gap: 14}}>
			<BigStat n="48" l="SELECCIONES" c="#fff" p={backOut((t - 70) / 12)} w={260} />
			<BigStat n="104" l="PARTIDOS" c={SKY} p={backOut((t - 95) / 12)} w={260} />
			<BigStat n="308" l="GOLES" c="#2EC46B" p={backOut((t - 120) / 12)} w={260} />
			<BigStat n="2,96" l="GOLES POR PARTIDO" c={C.yellow} p={backOut((t - 145) / 12)} w={300} />
		</div>
		<div style={{display: 'flex', gap: 14}}>
			<BigStat n="3" l="PAÍSES ANFITRIONES" c="#FF8A94" p={backOut((t - 200) / 12)} w={330} />
			<BigStat n="16" l="CIUDADES SEDE" c="#C9A7FF" p={backOut((t - 225) / 12)} w={330} />
			<BigStat n="10" l="GOLES DE MBAPPÉ (MÁXIMO)" c={C.yellow} p={backOut((t - 250) / 12)} w={420} />
		</div>
		{t >= 420 && <div style={{transform: `scale(${backOut((t - 420) / 14)})`, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 24px', borderRadius: 16, background: 'rgba(11,30,63,0.95)', border: `5px solid ${C.yellow}`}}>
			<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: C.yellow}}>TERCER PUESTO</span>
			<Flag f="fr" w={54} /><span style={{fontFamily: LILITA, fontSize: 40, color: '#fff'}}>FRANCIA 4 - 6 INGLATERRA</span><Flag f="gb-eng" w={54} />
		</div>}
		{t >= 560 && <div style={{transform: `scale(${backOut((t - 560) / 14)})`}}><Pill size={28} bg="#fff">EL PRIMER MUNDIAL CON 48 SELECCIONES: ESTADOS UNIDOS, MÉXICO Y CANADÁ</Pill></div>}
	</div>
);
