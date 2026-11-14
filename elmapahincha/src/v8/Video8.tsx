import React, {useMemo} from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {WorldLayer, Vis, WCam, WORLD, bboxOf} from '../v5/WorldLayer5';
import {Eyes, Hincha, Mood, Mouth} from '../Hincha';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {C} from '../data';
import {backOut, clamp01, easeInOut, easeOut, elastic, Panel, Pill, strokeText} from '../ui';
import {blinkAt, camPath, Key, Subscribe} from '../common';
import {FlagPreload} from '../v2/Preload';
import {ALL_FLAGS8, BEATEN, CONF_ES, Game, MOMENTS, NEVER, NEVER_GAMES, PORTUGAL, Rival, SMALL_NEVER, SPAIN, ST_COL, ST_TXT, St, TICKER, TOTALS, TOUR} from './data8';

const FPS = 60;
const ME = 'MEX';
const ME_FLAG = 'mx';
const SCARF: [string, string] = ['#006847', '#CE1126'];

// ---------------- timeline ----------------
type Item = {kind: 'intro' | 'region' | 'rival' | 'burst' | 'final' | 'outro'; from: number; dur: number; r?: Rival; rs?: Rival[]; conf?: string; i?: number};
const INTRO = 960;
const REGION = 150;
const FINAL = 3770;
// final-phase marks (relative to the start of the final)
const F_SIL = 620, F_REV = 900, F_STEP = 70, F_PRT = 1700, F_ROLL = 2360, F_ESP = 2460, F_BEST = 3170;
const revFrame = (k: string) => { const i = SMALL_NEVER.findIndex((r) => r.key === k); return i >= 0 ? F_REV + i * F_STEP : k === 'PRT' ? F_PRT : F_ESP; };
const OUTRO = 840;
const P_STATUS = 110;
const size = (r: Rival) => (r.p >= 40 ? 'big' : r.p >= 10 ? 'mid' : r.p >= 3 ? 'small' : 'tiny');
const rivalDur = (r: Rival) => {
	const m = (MOMENTS[r.key] ?? []).length;
	if (size(r) === 'big') return 600 + Math.max(0, m - 1) * 110;
	if (size(r) === 'mid') return 400 + m * 110;
	return 300 + m * 110;
};
const BURST = 300;
export const ITEMS8: Item[] = (() => {
	const out: Item[] = [];
	let t = 0;
	const push = (it: Omit<Item, 'from'>) => { out.push({...it, from: t}); t += it.dur; };
	push({kind: 'intro', dur: INTRO});
const list = TOUR.filter((r) => r.st !== 'never');
	let conf = '';
	let buf: Rival[] = [];
	let idx = 0;
	const flush = () => { while (buf.length) { const g = buf.splice(0, buf.length === 4 ? 2 : 3); push({kind: 'burst', dur: BURST, rs: g, i: idx++}); } };
	list.forEach((r) => {
		if (r.conf !== conf) { flush(); conf = r.conf; push({kind: 'region', dur: REGION, conf}); }
		if (size(r) === 'tiny') { buf.push(r); return; }
		flush();
		push({kind: 'rival', dur: rivalDur(r), r, i: idx++});
	});
	flush();
	push({kind: 'final', dur: FINAL});
	push({kind: 'outro', dur: OUTRO});
	return out;
})();
export const V8_TOTAL = ITEMS8.reduce((a, b) => a + b.dur, 0);
const SHOWN = ITEMS8.filter((x) => x.kind === 'rival' || x.kind === 'burst');
const finalIt = ITEMS8.find((x) => x.kind === 'final')!;

// ---------------- camera ----------------
const fitBox = (keys: string[], focusY = 360, w = 1000, h = 430): WCam => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of keys) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	const bw = x1 - x0, bh = y1 - y0;
	const z = Math.max(0.42, Math.min(5.2, Math.min(w / (bw + 40), h / (bh + 30))));
	return {x: (x0 + x1) / 2, y: (y0 + y1) / 2 + (540 - focusY) / z, z};
};
const REGION_VIEW: Record<string, WCam> = {
	CONMEBOL: {x: 1280, y: 1300, z: 0.95},
	CONCACAF: {x: 1000, y: 780, z: 0.9},
	UEFA: {x: 2010, y: 520, z: 1.25},
	CAF: {x: 2050, y: 1030, z: 0.85},
	AFC: {x: 3000, y: 800, z: 0.62},
};
const WORLD_VIEW: WCam = {x: 1915, y: 880, z: 0.5};
const shiftL = (c: WCam, px: number): WCam => ({...c, x: c.x + px / c.z});
const SMALL_VIEW = shiftL(fitBox(SMALL_NEVER.map((r) => r.key), 560, 980, 820), 330);
const PRT_VIEW = shiftL(fitBox(['PRT'], 560, 700, 560), 380);
const ESP_VIEW = shiftL(fitBox(['ESP'], 560, 760, 560), 380);
const IBERIA_VIEW = fitBox(['ESP', 'PRT'], 540, 1100, 700);
const KEYS_CAM: Key[] = (() => {
	const k: Key[] = [];
	const add = (f: number, c: WCam) => k.push([f, c.x, c.y, c.z]);
	add(0, {x: 1300, y: 1150, z: 1.4});
	add(470, {x: 1300, y: 1150, z: 1.5});
	add(520, {x: 1500, y: 1050, z: 0.75});
	add(720, {x: 1700, y: 950, z: 0.6});
	add(INTRO - 10, {x: 1700, y: 950, z: 0.62});
	for (const it of ITEMS8) {
		if (it.kind === 'region') { const v = REGION_VIEW[it.conf!]; add(it.from + 60, v); add(it.from + it.dur, {...v, z: v.z * 1.04}); }
		if (it.kind === 'rival') { const c = fitBox([it.r!.key]); add(it.from + 46, c); add(it.from + it.dur, {...c, z: c.z * 1.05}); }
		if (it.kind === 'burst') { const c = fitBox(it.rs!.map((r) => r.key), 360, 1100, 430); add(it.from + 46, c); add(it.from + it.dur, {...c, z: c.z * 1.04}); }
		if (it.kind === 'final') {
			const f0 = it.from;
add(f0 + 80, WORLD_VIEW); add(f0 + F_SIL - 40, {...WORLD_VIEW, z: WORLD_VIEW.z * 1.04}); add(f0 + F_REV - 120, {...WORLD_VIEW, z: WORLD_VIEW.z * 1.08});
			add(f0 + F_REV - 10, SMALL_VIEW); add(f0 + F_PRT - 60, {...SMALL_VIEW, z: SMALL_VIEW.z * 1.05});
			add(f0 + F_PRT + 10, PRT_VIEW); add(f0 + F_ROLL - 30, {...PRT_VIEW, z: PRT_VIEW.z * 1.06});
			add(f0 + F_ROLL + 20, IBERIA_VIEW); add(f0 + F_ESP - 10, {...IBERIA_VIEW, z: IBERIA_VIEW.z * 1.05});
			add(f0 + F_ESP + 20, ESP_VIEW); add(f0 + F_BEST - 30, {...ESP_VIEW, z: ESP_VIEW.z * 1.06});
			add(f0 + F_BEST + 30, WORLD_VIEW); add(f0 + it.dur, {...WORLD_VIEW, z: WORLD_VIEW.z * 1.05});
		}
		if (it.kind === 'outro') { add(it.from + 60, {x: 1500, y: 1000, z: 0.62}); add(it.from + it.dur, {x: 1500, y: 1000, z: 0.64}); }
	}
	return k;
})();

// ---------------- hook geometry (lotería board) ----------------
const LCOLS = 8, LROWS = 3, CW = 196, CH = 238, CG = 16;
const CARDS = TOUR.filter((r) => r.w > 0).sort((a, b) => b.p - a.p).slice(0, LCOLS * LROWS);
const cardPos = (i: number) => {
	const row = Math.floor(i / LCOLS), col = i % LCOLS;
	return {x: (1920 - (LCOLS * CW + (LCOLS - 1) * CG)) / 2 + col * (CW + CG), y: 262 + row * (CH + CG)};
};
const DEAL = (i: number) => 4 + i * 2.5;
const BEAN0 = 64, BEAN_GAP = 5;
const BEAN_ORDER = CARDS.map((_, i) => i).sort((a, b) => ((a * 7) % 24) - ((b * 7) % 24));
const beanFrame = (i: number) => BEAN0 + BEAN_ORDER.indexOf(i) * BEAN_GAP;
const BIG0 = 214, BEAN_FAIL = 262, STAMP = 292, PART3 = 330;

// ---------------- sfx ----------------
export const v8Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f, name, vol});
	S(0, 'whoosh_2', 0.45); S(6, 'crowd_roar', 0.25); S(20, 'riser', 0.22);
	CARDS.forEach((_, i) => { if (i % 3 === 0) S(Math.round(DEAL(i)), 'click', 0.22); });
	CARDS.forEach((_, i) => S(beanFrame(i), `pop_${(i % 4) + 1}`, 0.28));
	for (let k = 0; k < 24; k++) S(BEAN0 + k * 6, 'tick', 0.14);
	S(196, 'confirm', 0.35); S(BIG0, 'whoosh_4', 0.5); S(BIG0 + 14, 'slap', 0.5); S(BEAN_FAIL - 34, 'drumroll', 0.35);
	S(BEAN_FAIL, 'pop_3', 0.45); S(BEAN_FAIL + 4, 'error', 0.45); S(STAMP, 'boom', 0.6); S(STAMP + 2, 'crowd_ohh', 0.5);
	S(PART3, 'whoosh_2', 0.4); for (let j = 0; j < 12; j++) S(PART3 + 24 + j * 5, 'click', 0.26); S(PART3 + 96, 'slap', 0.45);
	S(400, 'pop_3', 0.4); S(430, 'click', 0.4);
	S(470, 'whoosh_1', 0.45); S(476, 'slap', 0.5); S(486, 'whistle_long', 0.3); S(540, 'click', 0.45);
	S(720, 'whoosh_2', 0.4); [0, 1, 2, 3].forEach((i) => S(740 + i * 24, `pop_${i + 1}`, 0.42)); S(860, 'riser', 0.3);
	for (const it of ITEMS8) {
		if (it.kind === 'region') { S(it.from, 'whoosh_4', 0.45); S(it.from + 40, 'slap', 0.45); S(it.from + 46, 'whistle_short', 0.25); }
		if (it.kind === 'rival') {
			const r = it.r!; const f0 = it.from;
			S(f0, 'whoosh_' + ((it.i! % 4) + 1), 0.32); S(f0 + 24, `pop_${(it.i! % 4) + 1}`, 0.42); S(f0 + 34, 'whoosh_3', 0.2);
			for (let k = 0; k < 6; k++) S(f0 + 52 + k * 11, 'tick', 0.18);
			if (r.st === 'neg') { S(f0 + P_STATUS - 60, 'drumroll', 0.3); S(f0 + P_STATUS, 'error', 0.45); S(f0 + P_STATUS + 2, 'crowd_ohh', 0.4); }
			else if (r.st === 'even') S(f0 + P_STATUS, 'drop', 0.45);
			else { S(f0 + P_STATUS, 'confirm', 0.4); if (r.p >= 20) S(f0 + P_STATUS + 2, 'crowd_roar', 0.22); }
			for (let c = 0; c < 4; c++) S(f0 + 130 + c * 28, 'click', 0.22);
			(MOMENTS[r.key] ?? []).forEach((_, j) => S(f0 + momentAt(r) + j * 110, 'pop_2', 0.35));
			S(f0 + it.dur - 22, 'whoosh_1', 0.22);
		}
		if (it.kind === 'burst') {
			const f0 = it.from; S(f0, 'whoosh_3', 0.35);
			it.rs!.forEach((_, j) => { S(f0 + 30 + j * 22, `pop_${(j % 4) + 1}`, 0.42); S(f0 + 80 + j * 22, 'confirm', 0.25); });
			S(f0 + it.dur - 22, 'whoosh_1', 0.22);
		}
		if (it.kind === 'final') {
			const f0 = it.from;
			S(f0, 'whoosh_4', 0.5); S(f0 + 30, 'slap', 0.5); S(f0 + 120, 'riser', 0.4); S(f0 + 180, 'boom', 0.45); [0, 1, 2, 3].forEach((i) => S(f0 + 240 + i * 24, 'click', 0.45));
			S(f0 + F_SIL - 20, 'whoosh_3', 0.45); S(f0 + F_SIL + 20, 'slap', 0.45); S(f0 + F_SIL + 80, 'drumroll', 0.5);
			SMALL_NEVER.forEach((r, i) => { const a = f0 + revFrame(r.key); S(a, i === 0 ? 'boom' : 'slap', i === 0 ? 0.55 : 0.42); S(a + 4, `pop_${(i % 4) + 1}`, 0.4); S(a + 30, 'error', 0.22); });
			S(f0 + F_PRT - 40, 'drumroll', 0.45); S(f0 + F_PRT, 'boom', 0.6); S(f0 + F_PRT + 2, 'crowd_ohh', 0.5);
			NEVER_GAMES.PRT.forEach((g, i) => S(f0 + F_PRT + 120 + i * 50, g.res === 'L' ? 'error' : 'drop', 0.38));
			S(f0 + F_PRT + 500, 'slap', 0.42);
			S(f0 + F_ROLL, 'whoosh_3', 0.45); S(f0 + F_ROLL + 10, 'drumroll', 0.6);
			S(f0 + F_ESP, 'boom', 0.7); S(f0 + F_ESP + 2, 'crowd_ohh', 0.6); S(f0 + F_ESP + 4, 'glass', 0.4);
			NEVER_GAMES.ESP.forEach((g, i) => S(f0 + F_ESP + 120 + i * 50, g.res === 'L' ? 'error' : 'drop', 0.38));
			S(f0 + F_ESP + 520, 'slap', 0.45);
			S(f0 + F_BEST, 'whoosh_2', 0.45); S(f0 + F_BEST + 40, 'slap', 0.5); [0, 1, 2].forEach((i) => S(f0 + F_BEST + 80 + i * 40, `pop_${i + 1}`, 0.45));
			S(f0 + F_BEST + 280, 'pop_4', 0.4); S(f0 + F_BEST + 480, 'whoosh_1', 0.4); S(f0 + F_BEST + 510, 'click', 0.45);
		}
		if (it.kind === 'outro') { S(it.from, 'whoosh_2', 0.4); S(it.from + 20, 'slap', 0.45); [0, 1, 2].forEach((i) => S(it.from + 70 + i * 14, `pop_${i + 1}`, 0.4)); S(it.from + 300, 'pop_4', 0.4); S(it.from + 350, 'click', 0.5); S(it.from + 352, 'bong', 0.35); }
	}
	return s;
};
export const v8Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	const uefa = ITEMS8.find((x) => x.kind === 'region' && x.conf === 'UEFA')!.from;
	const caf = ITEMS8.find((x) => x.kind === 'region' && x.conf === 'CAF')!.from;
	const f0 = finalIt.from;
	return [`m_tense:0:${sec(INTRO + 40)}`, `m_happy:${sec(INTRO)}:${sec(uefa + 40)}`, `m_tense:${sec(uefa)}:${sec(caf + 40)}`, `m_happy:${sec(caf)}:${sec(f0 + 40)}`,`m_tense:${sec(f0)}:${sec(f0 + F_BEST + 40)}`, `m_triumph:${sec(f0 + F_BEST)}:${sec(V8_TOTAL)}`].join(',');
};

// ---------------- helpers ----------------
const moodFor = (st: St): Mood => (st === 'dom' ? 'grito' : st === 'even' ? 'miedo' : st === 'neg' ? 'enfado' : 'triste');
const rivalMood = (st: St): Mood => (st === 'dom' ? 'miedo' : st === 'even' ? 'enfado' : st === 'neg' ? 'feliz' : 'grito');
const Count: React.FC<{v: number; p: number}> = ({v, p}) => <>{Math.round(v * easeOut(p))}</>;
const momentAt = (r: Rival) => (size(r) === 'big' ? 250 : 240);
const RES_COL: Record<string, string> = {W: '#2EC46B', D: '#FFD23F', L: '#E63946'};

const chipsOf = (r: Rival): [string, string, string][] => {
	const c: [string, string, string][] = [];
	if (r.bw) c.push(['MAYOR VICTORIA', `${r.bw.s} (${r.bw.y})`, '#2EC46B']);
	if (r.bl) c.push(['PEOR DERROTA', `${r.bl.s} (${r.bl.y})`, '#E63946']);
	if (r.wc > 0) c.push(['EN MUNDIALES', `${r.wc} ${r.wc === 1 ? 'partido' : 'partidos'}`, '#4FA3E3']);
	if (r.streak.n >= 2) c.push(['RACHA ACTUAL', `${r.streak.n} ${r.streak.t === 'W' ? 'victorias' : r.streak.t === 'D' ? 'empates' : 'derrotas'}`, RES_COL[r.streak.t]]);
	else c.push(['ÚLTIMO', `${r.last.slice(0, 4)} · ${r.lastScore}`, '#FFFFFF']);
	if (r.pens.length) c.push(['PENALTIS', `${r.pens.filter((p) => p.win).length} ganadas · ${r.pens.filter((p) => !p.win).length} perdidas`, '#C58BFF']);
	return c.slice(0, size(r) === 'small' ? 3 : 4);
};

const StatBox: React.FC<{label: string; v: number | string; p: number; col: string; w?: number}> = ({label, v, p, col, w = 112}) => (
	<div style={{width: w, padding: '4px 0 6px', borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: `3px solid ${col}`, textAlign: 'center'}}>
		<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, letterSpacing: 2, color: col}}>{label}</div>
		<div style={{fontFamily: LILITA, fontSize: 46, lineHeight: 1, color: '#fff'}}>{typeof v === 'number' ? <Count v={v} p={p} /> : v}</div>
	</div>
);

const Strip: React.FC<{r: Rival; t: number; w: number}> = ({r, t, w}) => {
	const n = r.seq.length;
	const gap = n > 60 ? 1.5 : 3;
	const sq = Math.min(26, (w - gap * (n - 1)) / n);
	const shown = Math.floor(n * clamp01((t - 50) / 90));
	return (
		<div>
			<div style={{display: 'flex', gap, height: 22, alignItems: 'center'}}>
				{r.seq.split('').map((c, i) => (
					<div key={i} style={{width: sq, height: i < shown ? 22 : 6, borderRadius: Math.min(5, sq / 2), background: i < shown ? RES_COL[c] : 'rgba(255,255,255,0.15)', transition: 'none'}} />
				))}
			</div>
			<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: RUBIK, fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,0.7)', letterSpacing: 1}}>
				<span>{r.first.slice(0, 4)} · PRIMER PARTIDO {r.firstScore}</span>
				<span>CADA CUADRO ES UN PARTIDO</span>
				<span>ÚLTIMO {r.lastScore} · {r.last.slice(0, 4)}</span>
			</div>
		</div>
	);
};

const RivalCard: React.FC<{r: Rival; t: number; dur: number}> = ({r, t, dur}) => {
	const pin = backOut((t - 34) / 18), pout = easeInOut((t - dur + 20) / 16);
	const cp = clamp01((t - 50) / 60);
	const sp = backOut((t - P_STATUS) / 14);
	const chips = chipsOf(r);
	const moments = MOMENTS[r.key] ?? [];
	return (
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 74, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - pin) * 600 + pout * 600}px)`}}>
			<Panel style={{width: 1320, padding: '12px 24px 14px', borderColor: t >= P_STATUS ? ST_COL[r.st] : C.yellow}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<img src={staticFile(`flags/${r.flag}.svg`)} style={{width: 96, height: 72, borderRadius: 10, border: `4px solid ${C.navy}`, objectFit: 'cover', boxShadow: '0 0 0 3px #fff'}} />
					<div style={{flex: 1, minWidth: 0}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
							<div style={{fontFamily: LILITA, fontSize: 54, lineHeight: 1, color: '#fff', whiteSpace: 'nowrap'}}>{r.es.toUpperCase()}</div>
							{t >= P_STATUS && <div style={{transform: `scale(${sp}) rotate(-4deg)`, padding: '4px 14px', borderRadius: 12, background: ST_COL[r.st], border: `4px solid ${C.navy}`, fontFamily: LILITA, fontSize: 28, color: r.st === 'even' ? C.navy : '#fff', whiteSpace: 'nowrap'}}>{ST_TXT[r.st]}</div>}
						</div>
						<div style={{fontFamily: RUBIK, fontWeight: 600, fontSize: 19, color: 'rgba(255,255,255,0.78)', marginTop: 4, whiteSpace: 'nowrap'}}>México contra {r.es} · desde {r.first.slice(0, 4)} · goles {r.gf}-{r.ga}</div>
					</div>
					<StatBox label="PARTIDOS" v={r.p} p={cp} col="#fff" />
					<StatBox label="GANA" v={r.w} p={cp} col={ST_COL.dom} />
					<StatBox label="EMPATA" v={r.d} p={cp} col={ST_COL.even} />
					<StatBox label="PIERDE" v={r.l} p={cp} col={ST_COL.never} />
				</div>
				<div style={{marginTop: 12}}><Strip r={r} t={t} w={1270} /></div>
				<div style={{display: 'flex', gap: 10, marginTop: 10, height: 40}}>
					{chips.map(([a, b, col], i) => {
						const p = backOut((t - 130 - i * 28) / 12);
						return (
							<div key={a} style={{transform: `scale(${Math.max(0, p)})`, display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: `3px solid ${col}`}}>
								<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 14, letterSpacing: 1.5, color: col}}>{a}</span>
								<span style={{fontFamily: LILITA, fontSize: 25, color: '#fff', whiteSpace: 'nowrap'}}>{b}</span>
							</div>
						);
					})}
				</div>
				{moments.length > 0 && (
					<div style={{marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6}}>
						{moments.map((m, j) => {
							const mt = t - momentAt(r) - j * 110;
							return (
								<div key={j} style={{display: 'flex', alignItems: 'center', gap: 12, opacity: clamp01(mt / 10), transform: `translateX(${(1 - easeOut(mt / 14)) * -40}px)`, height: 32}}>
									<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, letterSpacing: 2, color: '#fff', background: j % 2 ? '#2F7DE1' : '#8E5BD9', padding: '3px 9px', borderRadius: 7}}>HISTORIA</span>
									<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: '#fff', whiteSpace: 'nowrap'}}>{m}</span>
								</div>
							);
						})}
					</div>
				)}
			</Panel>
		</div>
	);
};

const BurstCards: React.FC<{rs: Rival[]; t: number; dur: number}> = ({rs, t, dur}) => {
	const pout = easeInOut((t - dur + 20) / 16);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 74, display: 'flex', justifyContent: 'center', gap: 22, transform: `translateY(${pout * 600}px)`}}>
			<div style={{position: 'absolute', top: -58, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((t - 14) / 12)})`}}>
				<Pill size={24} bg={C.yellow}>RÁFAGA · RIVALES CON 1 O 2 PARTIDOS</Pill>
			</div>
			{rs.map((r, j) => {
				const p = backOut((t - 30 - j * 22) / 14);
				const sp = backOut((t - 80 - j * 22) / 12);
				return (
					<div key={r.key} style={{transform: `scale(${Math.max(0, p)})`}}>
						<Panel style={{width: 400, padding: '12px 16px 14px', borderColor: t >= 80 + j * 22 ? ST_COL[r.st] : C.yellow}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
								<img src={staticFile(`flags/${r.flag}.svg`)} style={{width: 70, height: 52, borderRadius: 8, border: `3px solid ${C.navy}`, objectFit: 'cover', boxShadow: '0 0 0 3px #fff'}} />
								<div style={{flex: 1, minWidth: 0}}>
									<div style={{fontFamily: LILITA, fontSize: 36, lineHeight: 1, color: '#fff', whiteSpace: 'nowrap'}}>{r.es.toUpperCase()}</div>
									<div style={{fontFamily: RUBIK, fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.75)', marginTop: 3}}>{r.p} {r.p === 1 ? 'partido' : 'partidos'} · {r.w}G {r.d}E {r.l}P</div>
								</div>
							</div>
							<div style={{display: 'flex', gap: 10, marginTop: 10, alignItems: 'center'}}>
								{r.seq.split('').map((c, i) => (
									<div key={i} style={{padding: '4px 12px', borderRadius: 10, background: RES_COL[c], border: `3px solid ${C.navy}`, fontFamily: LILITA, fontSize: 26, color: c === 'D' ? C.navy : '#fff', whiteSpace: 'nowrap'}}>
										{i === 0 ? r.firstScore : r.lastScore} <span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 14}}>{i === 0 ? r.first.slice(0, 4) : r.last.slice(0, 4)}</span>
									</div>
								))}
								<div style={{flex: 1}} />
								{t >= 80 + j * 22 && <div style={{transform: `scale(${sp})`, padding: '3px 10px', borderRadius: 10, background: ST_COL[r.st], border: `3px solid ${C.navy}`, fontFamily: LILITA, fontSize: 20, color: r.st === 'even' ? C.navy : '#fff', whiteSpace: 'nowrap'}}>{ST_TXT[r.st]}</div>}
							</div>
						</Panel>
					</div>
				);
			})}
		</div>
	);
};

// scrolling news ticker
const Ticker: React.FC<{f: number; y: number}> = ({f, y}) => {
	const text = TICKER.join('     •     ') + '     •     ';
	const w = useMemo(() => {
		try {
			const c = document.createElement('canvas').getContext('2d')!;
			c.font = `800 22px ${RUBIK}`;
			return c.measureText(text).width;
		} catch { return text.length * 14; }
	}, [text]);
	const x = -((f * 2.2) % w);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 56, transform: `translateY(${y}px)`, background: 'linear-gradient(180deg, #0E2A55, #081A38)', borderTop: `4px solid ${C.yellow}`, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 300, top: 0, bottom: 0, right: 0, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: x, top: 13, whiteSpace: 'pre', fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff'}}>{text + text + text}</div>
			</div>
			<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: C.yellow, fontFamily: LILITA, fontSize: 28, color: C.navy, boxShadow: '6px 0 12px rgba(0,0,0,0.4)'}}>
<img src={staticFile('flags/mx.svg')} style={{width: 40, height: 28, borderRadius: 4, border: `2px solid ${C.navy}`, objectFit: 'cover'}} />
MÉXICO EN DATOS
			</div>
		</div>
	);
};

// ---------------- main ----------------
export const Video8: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS_CAM, f, 5);
	const cur = ITEMS8.find((it) => f >= it.from && f < it.from + it.dur) ?? ITEMS8[ITEMS8.length - 1];
	const t = f - cur.from;
	const inFinal = f >= finalIt.from;
	const ft = f - finalIt.from;

	const vis: Record<string, Vis> = {};
	const revealed: Rival[] = [];
	for (const it of SHOWN) {
		const list = it.kind === 'rival' ? [it.r!] : it.rs!;
		list.forEach((r, j) => {
			const tp = f - (it.from + 24 + j * 22);
			if (tp < 0) return;
			if (f >= it.from + (it.kind === 'rival' ? P_STATUS : 80 + j * 22)) revealed.push(r);
			const isCur = cur === it;
			let mood: Mood = 'feliz';
			if (isCur && t >= P_STATUS - 30) mood = rivalMood(r.st);
			let colorMix = 0;
			if (inFinal && ft >= 150 && ft < 700) colorMix = clamp01((ft - 150) / 60) * 0.55 * (1 - clamp01((ft - 640) / 50));
			let col = ST_COL[r.st];
			if (inFinal && ft >= F_SIL - 30 && ft < F_BEST + 30) { col = '#1E2A44'; colorMix = 0.78 * clamp01((ft - F_SIL + 30) / 40) * (1 - clamp01((ft - F_BEST) / 30)); }
			vis[r.key] = {flag: r.flag, pop: Math.max(0, elastic(tp / FPS)), mood, blink: blinkAt(f, it.i! + j), open: 0.5 + 0.5 * Math.sin(f / 4 + j), color: col, colorMix, faceScale: isCur ? 1.15 : 1, glow: isCur ? (t >= P_STATUS ? ST_COL[r.st] : '#FFFFFF') : undefined};
		});
	}
	const neverEnd = (k: string) => (k === 'PRT' ? F_ROLL : k === 'ESP' ? F_BEST : revFrame(k) + F_STEP);
	const curNever = inFinal ? NEVER.find((r) => ft >= revFrame(r.key) && ft < neverEnd(r.key)) : undefined;
	if (inFinal) NEVER.forEach((r, j) => {
		const rf = revFrame(r.key);
		if (ft < rf) return;
		const isCur = curNever === r;
		vis[r.key] = {flag: r.flag, pop: Math.max(0, elastic((ft - rf) / FPS)), mood: 'grito', blink: blinkAt(f, 40 + j), open: 0.5 + 0.5 * Math.sin(f / 4 + j), faceScale: isCur ? 1.3 : 1, glow: isCur ? '#E63946' : undefined, color: ST_COL.never, colorMix: 0};
	});
	const showMe = f >= 480;
	if (showMe) {
		vis[ME] = {flag: ME_FLAG, pop: Math.max(0, elastic((f - 490) / FPS)), mood: cur.kind === 'rival' && t >= P_STATUS ? moodFor(cur.r!.st) :inFinal && ft >= F_REV && ft < F_BEST ? 'triste' : 'feliz', blink: blinkAt(f, 99), open: 0.5 + 0.5 * Math.sin(f / 4), faceScale: 1.1, look: cur.kind === 'rival' ? (() => {
			const [ax, ay] = WORLD[ME].c; const [bx, by] = WORLD[cur.r!.key].c; const dl = Math.hypot(bx - ax, by - ay) || 1; return [(bx - ax) / dl, (by - ay) / dl] as [number, number];
		})() : [0, 0]};
	}
	const counts = {dom: 0, even: 0, neg: 0, never: 0} as Record<St, number>;
	let W = 0, D = 0, L = 0;
	revealed.forEach((r) => { counts[r.st]++; W += r.w; D += r.d; L += r.l; });


	const silhouettes: {key: string; p: number}[] = [];
if (inFinal && ft >= F_SIL) NEVER.forEach((r) => { const rf = revFrame(r.key); if (ft < rf + 14) silhouettes.push({key: r.key, p: clamp01((ft - F_SIL) / 20) * (1 - clamp01((ft - rf) / 14))}); });
	const ring = cur.kind === 'rival' && t > 20 ? {key: cur.r!.key, p: Math.min(clamp01((t - 20) / 12), 1 - clamp01((t - cur.dur + 20) / 14)), color: t >= P_STATUS ? ST_COL[cur.r!.st] : C.yellow}: curNever ? {key: curNever.key, p: Math.min(clamp01((ft - revFrame(curNever.key)) / 12), 1 - clamp01((ft - neverEnd(curNever.key) + 14) / 14)), color: '#E63946'} : null;

	const hudIn = easeOut((f - INTRO + 10) / 30);
	const showHud = f >= INTRO - 10 && !(inFinal && ft >= 60);
	const tickIn = f >= INTRO - 10 && cur.kind !== 'outro' ? easeOut((f - INTRO + 10) / 24) : 0;
	const log = revealed.slice(-5).reverse();
	const totalRiv = TOUR.length;
const hit = [F_REV, F_PRT, F_ESP].find((h) => inFinal && ft >= h && ft < h + 16);
	const shake = hit !== undefined ? Math.sin(f * 3) * (hit + 16 - ft) * 0.8 : 0;

	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
<FlagPreload flags={ALL_FLAGS8} />
			<AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
				<WorldLayer cam={cam} vis={vis} ring={ring} silhouettes={silhouettes}>
{inFinal && ft >= F_SIL + 40 && NEVER.map((r) => {
						const rf = revFrame(r.key);
						if (ft >= rf) return null;
						const b = bboxOf(r.key); const k = 1 / cam.z; const big = r.key === 'ESP' || r.key === 'PRT';
						const p = backOut((ft - F_SIL - 40) / 14) * (r.key === 'ESP' && ft >= F_ROLL ? 1 + 0.12 * Math.sin(ft / 5) : 1);
						const fs = (big ? 70 : 40) * k;
						return <text key={r.key} x={b.cx} y={b.cy + fs * 0.35} textAnchor="middle" fontFamily="Lilita" fontSize={fs} fill="#E63946" stroke="#fff" strokeWidth={4 * k} paintOrder="stroke" transform={`translate(${b.cx} ${b.cy}) scale(${p}) translate(${-b.cx} ${-b.cy})`}>?</text>;
					})}
					{inFinal && ft >= F_REV && ft < F_PRT && SMALL_NEVER.map((r, i) => {
						const rf = revFrame(r.key);
						if (ft < rf + 10) return null;
						const b = bboxOf(r.key); const k = 1 / cam.z; const p = backOut((ft - rf - 10) / 12);
						return (
							<g key={'n' + r.key} transform={`translate(${b.cx} ${b.y0 - 6 * k}) scale(${p * k})`}>
								<circle cx={0} cy={-20} r={20} fill="#E63946" stroke="#10131C" strokeWidth={4} />
								<text x={0} y={-11} textAnchor="middle" fontFamily="Lilita" fontSize={26} fill="#fff">{NEVER.length - i}</text>
							</g>
						);
					})}
				</WorldLayer>
			</AbsoluteFill>

			{f < 520 && <AbsoluteFill style={{opacity: 1 - clamp01((f - 470) / 30)}}><LoteriaHook f={f} /></AbsoluteFill>}
			{f >= 462 && f < 490 && <AbsoluteFill style={{background: '#fff', opacity: 0.85 * Math.sin(clamp01((f - 462) / 28) * Math.PI)}} />}
			{f >= 470 && f < INTRO && <IntroCards f={f} />}

			{showHud && (
				<>
					<div style={{position: 'absolute', left: 28, top: 26, transform: `translateX(${(1 - hudIn) * -400}px)`}}>
						<Panel style={{width: 250, padding: '10px 12px 14px', borderColor: '#2EC46B', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<Hincha iso={`img:${ME_FLAG}`} mood={(vis[ME]?.mood ?? 'feliz') as Mood} size={160} scarf={SCARF} blink={blinkAt(f, 3)} open={0.5 + 0.5 * Math.sin(f / 4)} sweat={cur.kind === 'rival' && t >= P_STATUS && cur.r!.st === 'neg'} />
							<div style={{fontFamily: LILITA, fontSize: 34, color: '#fff', marginTop: -6}}>MÉXICO</div>
							<div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, width: '100%', marginTop: 8}}>
								{(['dom', 'even', 'neg', 'never'] as St[]).map((s) => (
									<div key={s} style={{borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: `3px solid ${ST_COL[s]}`, padding: '4px 6px', textAlign: 'center'}}>
										<div style={{fontFamily: LILITA, fontSize: 34, lineHeight: 1, color: '#fff'}}>{s === 'never' && counts.never === 0 ? '?' : counts[s]}</div>
										<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 11, letterSpacing: 1, color: ST_COL[s], whiteSpace: 'nowrap'}}>{ST_TXT[s]}</div>
									</div>
								))}
							</div>
							<div style={{marginTop: 8, width: '100%', borderRadius: 10, background: 'rgba(255,255,255,0.08)', padding: '4px 8px', display: 'flex', justifyContent: 'space-between', fontFamily: RUBIK, fontWeight: 800, fontSize: 14, color: 'rgba(255,255,255,0.85)'}}>
								<span>PARTIDOS</span><span style={{fontFamily: LILITA, fontSize: 20, color: '#fff'}}>{W + D + L}</span>
							</div>
						</Panel>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 22, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - hudIn) * -200}px)`}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '8px 18px', borderRadius: 18, background: 'rgba(11,30,63,0.92)', border: `4px solid ${C.yellow}`}}>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: ST_COL.dom}}>VICTORIAS {W}</span>
							<div style={{width: 420, height: 20, borderRadius: 10, overflow: 'hidden', display: 'flex', border: `3px solid ${C.navy}`, background: 'rgba(255,255,255,0.12)'}}>
								{W + D + L > 0 && (<>
									<div style={{width: `${(W / (W + D + L)) * 100}%`, background: ST_COL.dom}} />
									<div style={{width: `${(D / (W + D + L)) * 100}%`, background: ST_COL.even}} />
									<div style={{width: `${(L / (W + D + L)) * 100}%`, background: ST_COL.never}} />
								</>)}
							</div>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: ST_COL.never}}>DERROTAS {L}</span>
							<span style={{fontFamily: LILITA, fontSize: 26, color: '#fff', marginLeft: 8}}>{revealed.length}/{totalRiv}</span>
						</div>
					</div>
					<div style={{position: 'absolute', right: 28, top: 26, display: 'flex', flexDirection: 'column', gap: 8, transform: `translateX(${(1 - hudIn) * 500}px)`}}>
						{log.map((r, i) => (
							<div key={r.key} style={{display: 'flex', alignItems: 'center', gap: 10, width: 360, padding: '6px 10px', borderRadius: 12, background: 'rgba(11,30,63,0.9)', border: `3px solid ${i === 0 ? ST_COL[r.st] : 'rgba(255,255,255,0.25)'}`, opacity: 1 - i * 0.13}}>
								<img src={staticFile(`flags/${r.flag}.svg`)} style={{width: 42, height: 31, borderRadius: 5, objectFit: 'cover', border: `2px solid ${C.navy}`}} />
								<span style={{flex: 1, fontFamily: RUBIK, fontWeight: 800, fontSize: 18, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden'}}>{r.es}</span>
								<span style={{fontFamily: LILITA, fontSize: 18, color: 'rgba(255,255,255,0.85)'}}>{r.w}-{r.d}-{r.l}</span>
								<span style={{padding: '2px 8px', borderRadius: 7, background: ST_COL[r.st], fontFamily: RUBIK, fontWeight: 800, fontSize: 13, color: r.st === 'even' ? C.navy : '#fff', whiteSpace: 'nowrap'}}>{ST_TXT[r.st]}</span>
							</div>
						))}
					</div>
				</>
			)}

			{cur.kind === 'region' && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, transform: `scale(${backOut((t - 36) / 16) * (1 - easeInOut((t - cur.dur + 24) / 20))})`}}>
					<div style={{fontFamily: LILITA, fontSize: 110, color: C.yellow, ...strokeText(16), textShadow: `0 10px 0 ${C.red}`, whiteSpace: 'nowrap'}}>{CONF_ES[cur.conf!]}</div>
					<Pill size={32} bg="#fff">{TOUR.filter((r) => r.conf === cur.conf).length} RIVALES · {TOUR.filter((r) => r.conf === cur.conf).reduce((a, r) => a + r.p, 0)} PARTIDOS</Pill>
				</div>
			)}
			{cur.kind === 'rival' && <RivalCard r={cur.r!} t={t} dur={cur.dur} />}
			{cur.kind === 'burst' && <BurstCards rs={cur.rs!} t={t} dur={cur.dur} />}
			{cur.kind === 'rival' && cur.r!.st === 'neg' && t >= P_STATUS && t < P_STATUS + 60 && <AbsoluteFill style={{background: '#FF8A3D', opacity: 0.3 * (1 - (t - P_STATUS) / 60)}} />}
			{cur.kind === 'rival' && cur.r!.st === 'neg' && t >= P_STATUS && t < cur.dur - 20 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((t - P_STATUS) / 14)})`}}>
					<div style={{fontFamily: LILITA, fontSize: 84, color: '#fff', ...strokeText(14), textShadow: `0 8px 0 #FF8A3D`}}>¡HISTORIAL EN CONTRA!</div>
				</div>
			)}

			{inFinal && cur.kind === 'final' && <Final ft={ft} f={f} />}
			{cur.kind === 'outro' && <Outro t={t} f={f} />}
			{tickIn > 0 && <Ticker f={f} y={(1 - tickIn) * 80} />}
		</AbsoluteFill>
	);
};

// ---------------- HOOK: the lotería board ----------------
const Txt: React.FC<{children: React.ReactNode; size?: number; color?: string; p: number; shadow?: string}> = ({children, size = 84, color = '#fff', p, shadow = C.navy}) => (
	<div style={{transform: `scale(${Math.max(0, p)})`, fontFamily: LILITA, fontSize: size, color, ...strokeText(size * 0.16), textShadow: `0 ${size * 0.09}px 0 ${shadow}`, whiteSpace: 'nowrap', lineHeight: 1.05}}>{children}</div>
);
const LCard: React.FC<{r: Rival; n: number | string; w: number; h: number; back?: boolean}> = ({r, n, w, h, back}) => {
	const k = w / CW;
	if (back) {
		return (
			<div style={{width: w, height: h, borderRadius: 14 * k, background: 'repeating-linear-gradient(45deg, #C2185B 0 14px, #A0124B 14px 28px)', border: `${6 * k}px solid #10131C`, boxShadow: '0 8px 0 rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>
				<div style={{width: w * 0.6, height: w * 0.6, borderRadius: '50%', background: '#FFF6E0', border: `${5 * k}px solid #10131C`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 92 * k, color: '#E63946'}}>?</div>
			</div>
		);
	}
	const nm = r.es.toUpperCase();
	return (
		<div style={{width: w, height: h, borderRadius: 14 * k, background: '#FFF6E0', border: `${6 * k}px solid #10131C`, boxShadow: '0 8px 0 rgba(0,0,0,0.4)', padding: 8 * k, boxSizing: 'border-box', display: 'flex', flexDirection: 'column'}}>
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 30 * k}}>
				<span style={{fontFamily: LILITA, fontSize: 28 * k, color: '#10131C'}}>{n}</span>
				<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 12 * k, letterSpacing: 1.5 * k, color: '#C2185B'}}>LOTERÍA</span>
			</div>
			<div style={{flex: 1, borderRadius: 8 * k, overflow: 'hidden', border: `${4 * k}px solid #10131C`, margin: `${4 * k}px 0`}}>
				<img src={staticFile(`flags/${r.flag}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</div>
			<div style={{height: 34 * k, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: (nm.length > 14 ? 16 : nm.length > 11 ? 20 : 25) * k, color: '#10131C', whiteSpace: 'nowrap'}}>{nm}</div>
		</div>
	);
};
const Bean: React.FC<{s: number}> = ({s}) => (
	<svg width={s} height={s * 0.7} viewBox="0 0 100 70" style={{overflow: 'visible'}}>
		<ellipse cx={50} cy={40} rx={44} ry={27} fill="rgba(0,0,0,0.35)" />
		<ellipse cx={50} cy={36} rx={44} ry={27} fill="#7A4222" stroke="#10131C" strokeWidth={6} />
		<path d="M54 12 Q44 36 56 60" stroke="#3E1F0E" strokeWidth={4} fill="none" strokeLinecap="round" />
		<ellipse cx={34} cy={26} rx={13} ry={6} fill="rgba(255,255,255,0.4)" />
	</svg>
);
const LoteriaHook: React.FC<{f: number}> = ({f}) => {
	const count = Math.min(BEATEN, Math.round(BEATEN * easeOut(clamp01((f - BEAN0) / (24 * BEAN_GAP + 20)))));
	const dim = clamp01((f - BIG0 + 10) / 20);
	const bigIn = backOut((f - BIG0) / 16);
	const p3 = easeInOut((f - PART3) / 24);
	const bx = 960 - 170 - p3 * 560, by = 300 - p3 * 30, bs = 1 - p3 * 0.32;
	const beanVis = f >= BEAN_FAIL - 24 && f < PART3;
	let beanX = 960 - 55, beanY = -200, beanR = 0;
	if (beanVis) {
		if (f < BEAN_FAIL) { const u = (f - BEAN_FAIL + 24) / 24; beanY = -140 + 560 * u * u; }
		else { const v = (f - BEAN_FAIL) / 40; beanY = 420 - 240 * Math.sin(Math.min(v, 1) * Math.PI * 0.85) + 1100 * Math.max(0, v - 0.55) ** 2; beanX = 960 - 55 + 560 * v; beanR = v * 600; }
	}
	const shake = f >= STAMP && f < STAMP + 14 ? Math.sin(f * 2.7) * 12 : 0;
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #8E1B4E 0%, #4A0D2A 60%, #22050F 100%)', overflow: 'hidden', transform: `translate(${shake}px, ${shake * 0.5}px)`}}>
			<AbsoluteFill style={{opacity: 0.1, backgroundImage: `url(${staticFile('tex/ocean.png')})`, backgroundSize: '700px 700px'}} />
			<AbsoluteFill style={{opacity: 1 - dim * 0.82, filter: dim > 0 ? `blur(${dim * 4}px)` : undefined}}>
				{CARDS.map((r, i) => {
					const {x, y} = cardPos(i);
					const d = f - DEAL(i);
					if (d < 0) return null;
					const bf = f - beanFrame(i);
					return (
						<div key={r.key} style={{position: 'absolute', left: x, top: y, transform: `scaleX(${easeOut(d / 10)}) rotate(${((i % 5) - 2) * 0.8}deg)`}}>
							<LCard r={r} n={i + 1} w={CW} h={CH} />
							{bf >= 6 && <div style={{position: 'absolute', inset: 0, borderRadius: 14, background: 'rgba(46,196,107,0.3)', opacity: clamp01((bf - 6) / 8)}} />}
							{bf >= 0 && (
								<div style={{position: 'absolute', left: CW / 2 - 42, top: CH / 2 - 34 - Math.max(0, 1 - bf / 8) * 140, transform: `scale(${bf < 8 ? 1 : 1 + 0.18 * Math.sin(Math.min(1, (bf - 8) / 6) * Math.PI)}) rotate(${((i * 37) % 60) - 30}deg)`}}>
									<Bean s={84} />
								</div>
							)}
						</div>
					);
				})}
			</AbsoluteFill>
			{f < BIG0 + 6 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, opacity: 1 - clamp01((f - BIG0) / 6)}}>
					<div style={{transform: `scale(${Math.max(0, backOut((f - 6) / 12))})`}}><Hincha iso={`img:${ME_FLAG}`} mood="grito" size={180} scarf={SCARF} open={0.5 + 0.5 * Math.sin(f / 3)} blink={blinkAt(f, 2)} /></div>
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
						<Txt p={backOut((f - 10) / 12)} size={64}>MÉXICO LE HA GANADO A</Txt>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 18, transform: `scale(${Math.max(0, backOut((f - 26) / 12))})`, transformOrigin: 'left center'}}>
							<span style={{fontFamily: LILITA, fontSize: 118, lineHeight: 1, color: '#2EC46B', ...strokeText(16), textShadow: `0 10px 0 ${C.navy}`}}>{count}</span>
							<span style={{fontFamily: LILITA, fontSize: 64, color: '#fff', ...strokeText(12)}}>SELECCIONES</span>
						</div>
					</div>
				</div>
			)}
			{f >= BIG0 && (
				<div style={{position: 'absolute', left: bx, top: by, transform: `scale(${Math.max(0, bigIn) * bs}) rotate(${-3 + Math.sin(f / 14) * 1.5}deg)`}}>
					<LCard r={SPAIN} n="¿?" w={340} h={412} />
					{f >= STAMP && <div style={{position: 'absolute', left: -50, top: 150, transform: `scale(${backOut((f - STAMP) / 8)}) rotate(-18deg)`, padding: '4px 24px', border: '10px solid #E63946', borderRadius: 18, fontFamily: LILITA, fontSize: 84, color: '#E63946', background: 'rgba(255,246,224,0.9)', whiteSpace: 'nowrap'}}>NUNCA</div>}
				</div>
			)}
			{beanVis && <div style={{position: 'absolute', left: beanX, top: beanY, transform: `rotate(${beanR}deg)`}}><Bean s={110} /></div>}
			{f >= BIG0 && f < PART3 + 6 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 1 - clamp01((f - PART3) / 6)}}>
					<Txt p={backOut((f - BIG0 - 6) / 12)} size={76}>...PERO A ESPAÑA</Txt>
					{f >= STAMP - 4 && <Txt p={backOut((f - STAMP + 4) / 10)} size={92} color="#FF3B30" shadow="#000">¡NUNCA LE HA GANADO!</Txt>}
				</div>
			)}
			{f >= PART3 && (
				<>
					<div style={{position: 'absolute', left: 0, right: 0, top: 50, display: 'flex', justifyContent: 'center'}}>
						<Txt p={backOut((f - PART3 - 4) / 12)} size={84}>...Y NO ES LA ÚNICA</Txt>
					</div>
					<div style={{position: 'absolute', left: 640, top: 240, display: 'grid', gridTemplateColumns: 'repeat(6, 150px)', gap: 14}}>
						{Array.from({length: 12}).map((_, j) => (
							<div key={j} style={{transform: `scale(${Math.max(0, backOut((f - PART3 - 24 - j * 5) / 10))}) rotate(${((j % 3) - 1) * 3}deg)`}}><LCard r={SPAIN} n="" w={150} h={182} back /></div>
						))}
					</div>
					{f >= PART3 + 96 && (
						<div style={{position: 'absolute', left: 0, right: 0, top: 650, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, transform: `scale(${backOut((f - PART3 - 96) / 12)})`}}>
							<span style={{fontFamily: LILITA, fontSize: 84, color: '#fff', ...strokeText(14)}}>EN TOTAL SON</span>
							<span style={{fontFamily: LILITA, fontSize: 150, lineHeight: 1, color: '#FF3B30', ...strokeText(18), textShadow: '0 10px 0 #000'}}>13</span>
						</div>
					)}
					{f >= 400 && (
						<div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
							<div style={{transform: `scale(${backOut((f - 400) / 12)})`}}><Pill size={34} bg={C.yellow}>¿CUÁLES SON? ESCRÍBELO EN LOS COMENTARIOS</Pill></div>
							{f >= 430 && <div style={{transform: `scale(${backOut((f - 430) / 12)})`}}><Pill size={26} bg="#fff">PISTA: OTRA ES VECINA DE ESPAÑA</Pill></div>}
						</div>
					)}
				</>
			)}
		</AbsoluteFill>
	);
};
const IntroCards: React.FC<{f: number}> = ({f}) => (
	<>
		{f < 740 && (() => {
			const pin = backOut((f - 480) / 16), pout = easeInOut((f - 710) / 22);
			return (
				<div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center', transform: `translateY(${pout * -900}px) scale(${pin}) rotate(${-2 - pout * 6}deg)`}}>
					<div style={{background: '#FFF6E0', border: `7px solid ${C.navy}`, borderRadius: 34, padding: '26px 64px 32px', boxShadow: '0 16px 0 rgba(0,0,0,0.35)', textAlign: 'center'}}>
						<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: C.red}}>EL MAPA HINCHA</div>
						<div style={{fontFamily: LILITA, fontSize: 92, lineHeight: 1.0, color: C.navy, marginTop: 6}}>¿A QUÉ SELECCIONES</div>
						<div style={{fontFamily: LILITA, fontSize: 92, lineHeight: 1.0, color: C.red}}>NUNCA HA GANADO</div>
						<div style={{fontFamily: LILITA, fontSize: 92, lineHeight: 1.0,color: '#0A8F4E', WebkitTextStroke: `5px ${C.navy}`, paintOrder: 'stroke fill'}}>MÉXICO?</div>
						<div style={{marginTop: 16, transform: `scale(${backOut((f - 540) / 14)})`}}><Pill size={28}>{TOUR.length} RIVALES · {TOTALS.p.toLocaleString('es-ES')} PARTIDOS · UNO A UNO</Pill></div>
					</div>
				</div>
			);
		})()}
		{f >= 720 && (
			<div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: 1 - clamp01((f - INTRO + 30) / 24)}}>
				<div style={{display: 'flex', gap: 18}}>
					{(['dom', 'even', 'neg', 'never'] as St[]).map((s, i) => (
						<div key={s} style={{transform: `scale(${backOut((f - 740 - i * 24) / 14)})`, padding: '12px 26px', borderRadius: 16, background: ST_COL[s], border: `5px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.3)', fontFamily: LILITA, fontSize: 40, color: s === 'even' ? C.navy : '#fff'}}>{ST_TXT[s]}</div>
					))}
				</div>
				<div style={{transform: `scale(${backOut((f - 840) / 14)})`}}><Pill size={30} bg="#fff">CADA RIVAL CON SU HISTORIAL, SUS GOLEADAS Y SUS RACHAS</Pill></div>
			</div>
		)}
	</>
);

// ---------------- FINAL ----------------
const CITY: Record<string, string> = {'Mexico City': 'Cdad. de México', Seville: 'Sevilla', Moscow: 'Moscú', 'Kuwait City': 'Kuwait', Bucharest: 'Bucarest', Luxembourg: 'Luxemburgo', Amman: 'Amán', Benghazi: 'Bengasi', Kazan: 'Kazán', Amsterdam: 'Ámsterdam', Minsk: 'Minsk', Borisov: 'Borísov'};
const tName = (g: Game) => (g.t === 'Gold Cup' ? 'COPA ORO' : g.t);
const cName = (g: Game) => CITY[g.c] ?? g.c;
const GameRow: React.FC<{g: Game; rf: string; p: number}> = ({g, rf, p}) => (
	<div style={{transform: `scale(${Math.max(0, p)})`, transformOrigin: 'right center', display: 'flex', alignItems: 'stretch', alignSelf: 'flex-end', borderRadius: 14, overflow: 'hidden', border: `5px solid ${g.t === 'MUNDIAL' ? '#E63946' : C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.4)'}}>
		<div style={{background: '#0B1E3F', padding: '4px 14px', fontFamily: LILITA, fontSize: 32, color: '#fff', display: 'flex', alignItems: 'center'}}>{g.y}</div>
		<div style={{background: '#fff', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 10}}>
			<img src={staticFile(`flags/${ME_FLAG}.svg`)} style={{width: 44, height: 32, borderRadius: 5, border: `2px solid ${C.navy}`, objectFit: 'cover'}} />
			<span style={{fontFamily: LILITA, fontSize: 36, color: C.navy}}>{g.s}</span>
			<img src={staticFile(`flags/${rf}.svg`)} style={{width: 44, height: 32, borderRadius: 5, border: `2px solid ${C.navy}`, objectFit: 'cover'}} />
		</div>
		<div style={{background: RES_COL[g.res], padding: '4px 14px', display: 'flex', alignItems: 'center', fontFamily: RUBIK, fontWeight: 800, fontSize: 19, color: g.res === 'D' ? C.navy : '#fff', width: 320, whiteSpace: 'nowrap'}}>{tName(g)} · {cName(g)}</div>
	</div>
);
const BigReveal: React.FC<{ft: number; r: Rival; at: number; end: number; rank: number; summary: string; note: string; noteAt: number}> = ({ft, r, at, end, rank, summary, note, noteAt}) => {
	const games = NEVER_GAMES[r.key];
	const out = 1 - easeInOut((ft - end + 28) / 24);
	return (
		<>
			<div style={{position: 'absolute', left: 0, right: 0, top: 34, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((ft - at - 2) / 12) * out})`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 24}}>
					<div style={{width: 96, height: 96, borderRadius: 48, background: '#E63946', border: `6px solid ${C.navy}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 60, color: '#fff'}}>{rank}</div>
					<img src={staticFile(`flags/${r.flag}.svg`)} style={{width: 150, height: 110, borderRadius: 14, border: `6px solid ${C.navy}`, objectFit: 'cover', boxShadow: '0 0 0 5px #fff, 0 0 40px #E63946'}} />
					<div style={{fontFamily: LILITA, fontSize: 140, color: '#fff', ...strokeText(20), textShadow: `0 12px 0 ${C.red}`}}>¡{r.es.toUpperCase()}!</div>
				</div>
			</div>
			<div style={{position: 'absolute', right: 60, top: 220, display: 'flex', flexDirection: 'column', gap: 12, opacity: out}}>
				<div style={{transform: `scale(${backOut((ft - at - 90) / 12)})`, transformOrigin: 'right center', alignSelf: 'flex-end'}}><Pill size={26} bg={C.yellow}>{summary}</Pill></div>
				{games.map((g, i) => <GameRow key={i} g={g} rf={r.flag} p={backOut((ft - at - 120 - i * 50) / 12)} />)}
			</div>
			{ft >= at + noteAt && (
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 80, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((ft - at - noteAt) / 14) * out})`}}>
					<Pill size={32} bg="#fff">{note}</Pill>
				</div>
			)}
		</>
	);
};
const Final: React.FC<{ft: number; f: number}> = ({ft, f}) => {
	const cnt = {dom: 0, even: 0, neg: 0, never: 0} as Record<St, number>;
	TOUR.forEach((r) => cnt[r.st]++);
	const worst = ['BRA', 'ARG', 'ITA'].map((k) => TOUR.find((r) => r.key === k)!);
	const usa = TOUR.find((r) => r.key === 'USA')!;
	const smallShown = SMALL_NEVER.filter((r) => ft >= revFrame(r.key));
	const smallOut = 1 - easeInOut((ft - F_PRT + 40) / 24);
	const rec = (r: Rival) => `${r.w}G ${r.d}E ${r.l}P`;
	return (
		<>
			{ft < 620 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, transform: `scale(${backOut((ft - 24) / 16) * (1 - easeInOut((ft - 590) / 24))})`}}>
					<div style={{fontFamily: LILITA, fontSize: 96, color: '#fff', ...strokeText(16), textShadow: `0 10px 0 ${C.red}`}}>EL RESULTADO FINAL</div>
					{ft >= 180 && <div style={{transform: `scale(${backOut((ft - 180) / 14)})`}}><Pill size={30} bg={C.yellow}>{TOUR.length} RIVALES · {TOTALS.p.toLocaleString('es-ES')} PARTIDOS · {TOTALS.w} VICTORIAS · {TOTALS.d} EMPATES · {TOTALS.l} DERROTAS</Pill></div>}
				</div>
			)}
			{ft >= 230 && ft < 640 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center', gap: 20, opacity: 1 - clamp01((ft - 610) / 24)}}>
					{(['dom', 'even', 'neg', 'never'] as St[]).map((s, i) => (
						<div key={s} style={{transform: `scale(${backOut((ft - 240 - i * 24) / 14)})`, width: 300, padding: '12px 0', borderRadius: 20, background: 'rgba(11,30,63,0.94)', border: `5px solid ${ST_COL[s]}`, textAlign: 'center'}}>
							<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1, color: '#fff'}}>{s === 'never' ? '?' : cnt[s]}</div>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: ST_COL[s]}}>{ST_TXT[s]}</div>
						</div>
					))}
				</div>
			)}
			{ft >= F_SIL && ft < F_REV && (
				<>
					<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(120,10,20,0.7) 100%)', opacity: clamp01((ft - F_SIL) / 30)}} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: 1 - clamp01((ft - F_REV + 16) / 14)}}>
						<Txt p={backOut((ft - F_SIL - 20) / 14)} size={70}>LAS {NEVER.length} SELECCIONES A LAS QUE</Txt>
						<Txt p={backOut((ft - F_SIL - 36) / 14)} size={70} color="#FF3B30" shadow="#000">MÉXICO NUNCA HA GANADO SON...</Txt>
					</div>
				</>
			)}
			{ft >= F_REV && ft < F_PRT && (
				<>
					<div style={{position: 'absolute', left: 40, top: 30, transform: `scale(${backOut((ft - F_REV) / 12) * smallOut})`, transformOrigin: 'left top'}}>
						<div style={{fontFamily: LILITA, fontSize: 60, color: '#fff', ...strokeText(12), textShadow: `0 7px 0 ${C.red}`, whiteSpace: 'nowrap'}}>NUNCA LES HA GANADO</div>
						<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: C.yellow, letterSpacing: 2, marginTop: 4, ...strokeText(5)}}>CUENTA ATRÁS · DE LA 13 A LA 1</div>
					</div>
					<div style={{position: 'absolute', right: 48, top: 40, display: 'flex', flexDirection: 'column', gap: 9, opacity: smallOut}}>
						{smallShown.map((r, i) => {
							const rf = revFrame(r.key);
							const g = NEVER_GAMES[r.key];
							const cur = ft < rf + F_STEP;
							return (
								<div key={r.key} style={{transform: `translateX(${(1 - easeOut((ft - rf) / 12)) * 700}px)`, display: 'flex', alignItems: 'center', gap: 12, width: 780, height: 70, padding: '0 12px', boxSizing: 'border-box', borderRadius: 14, background: 'rgba(11,30,63,0.94)', border: `4px solid ${cur ? '#E63946' : 'rgba(255,255,255,0.25)'}`, boxShadow: cur ? '0 0 24px rgba(230,57,70,0.8)' : undefined}}>
									<div style={{width: 46, height: 46, borderRadius: 23, background: '#E63946', border: `3px solid ${C.navy}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 28, color: '#fff', flexShrink: 0}}>{NEVER.length - i}</div>
									<img src={staticFile(`flags/${r.flag}.svg`)} style={{width: 58, height: 42, borderRadius: 6, border: `2px solid ${C.navy}`, objectFit: 'cover', flexShrink: 0}} />
									<span style={{width: 210, fontFamily: LILITA, fontSize: 32, color: '#fff', whiteSpace: 'nowrap'}}>{r.es.toUpperCase()}</span>
									<span style={{flex: 1, fontFamily: RUBIK, fontWeight: 700, fontSize: 18, color: 'rgba(255,255,255,0.82)', whiteSpace: 'pre', overflow: 'hidden'}}>{g.map((x) => `${x.y} · ${x.s}`).join('  /  ')}</span>
									<span style={{padding: '3px 10px', borderRadius: 9, background: '#E63946', border: `3px solid ${C.navy}`, fontFamily: LILITA, fontSize: 22, color: '#fff', whiteSpace: 'nowrap'}}>{rec(r)}</span>
								</div>
							);
						})}
					</div>
				</>
			)}
			{(ft >= F_PRT && ft < F_PRT + 16) || (ft >= F_ESP && ft < F_ESP + 16) ? <AbsoluteFill style={{background: '#E63946', opacity: 0.5 * (1 - ((ft - (ft >= F_ESP ? F_ESP : F_PRT)) / 16))}} /> : null}
			{ft >= F_PRT && ft < F_ROLL && <BigReveal ft={ft} r={PORTUGAL} at={F_PRT} end={F_ROLL} rank={2} summary={`${PORTUGAL.p} PARTIDOS: 0 VICTORIAS · ${PORTUGAL.d} EMPATES · ${PORTUGAL.l} DERROTAS`} note="2006: PORTUGAL LE GANÓ 2-1 EN EL MUNDIAL DE ALEMANIA" noteAt={500} />}
			{ft >= F_ROLL && ft < F_ESP && (
				<>
					<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 30%, rgba(120,10,20,0.75) 100%)', opacity: clamp01((ft - F_ROLL) / 20)}} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
						<Txt p={backOut((ft - F_ROLL - 6) / 12)} size={80}>Y LA NÚMERO 1...</Txt>
						<Txt p={backOut((ft - F_ROLL - 30) / 12)} size={60} color={C.yellow}>LA QUE MÁS LE DUELE</Txt>
					</div>
				</>
			)}
			{ft >= F_ESP && ft < F_BEST && <BigReveal ft={ft} r={SPAIN} at={F_ESP} end={F_BEST} rank={1} summary={`${SPAIN.p} PARTIDOS DESDE 1928: 0 VICTORIAS · ${SPAIN.d} EMPATES · ${SPAIN.l} DERROTAS`} note="NO SE ENFRENTAN DESDE 2010: 16 AÑOS ESPERANDO LA PRIMERA" noteAt={520} />}
			{ft >= F_BEST && (
				<AbsoluteFill style={{background: `rgba(8,20,40,${0.78 * clamp01((ft - F_BEST) / 24)})`}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center', transform: `scale(${backOut((ft - F_BEST - 30) / 14)})`}}>
						<span style={{fontFamily: LILITA, fontSize: 100, color: C.yellow, ...strokeText(16), textShadow: `0 10px 0 ${C.red}`}}>SUS BESTIAS NEGRAS</span>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 240, display: 'flex', justifyContent: 'center', gap: 34}}>
						{worst.map((r, i) => (
							<div key={r.key} style={{transform: `scale(${backOut((ft - F_BEST - 80 - i * 40) / 14)})`, width: 420, padding: '18px 16px 20px', borderRadius: 24, background: 'rgba(11,30,63,0.96)', border: `6px solid ${ST_COL[r.st]}`, textAlign: 'center', position: 'relative'}}>
								<div style={{position: 'absolute', left: -18, top: -18, width: 60, height: 60, borderRadius: 30, background: C.yellow, border: `5px solid ${C.navy}`, fontFamily: LILITA, fontSize: 38, color: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
								<div style={{display: 'flex', justifyContent: 'center'}}><Hincha iso={`img:${r.flag}`} mood="grito" size={170} scarf={null} open={0.5 + 0.5 * Math.sin(f / 4 + i)} /></div>
								<div style={{fontFamily: LILITA, fontSize: 48, color: '#fff', marginTop: -4}}>{r.es.toUpperCase()}</div>
								<div style={{display: 'flex', justifyContent: 'center', gap: 10, marginTop: 8}}>
									<span style={{padding: '4px 12px', borderRadius: 10, background: ST_COL.dom, border: `3px solid ${C.navy}`, fontFamily: LILITA, fontSize: 28, color: '#fff'}}>{r.w} G</span>
									<span style={{padding: '4px 12px', borderRadius: 10, background: ST_COL.even, border: `3px solid ${C.navy}`, fontFamily: LILITA, fontSize: 28, color: C.navy}}>{r.d} E</span>
									<span style={{padding: '4px 12px', borderRadius: 10, background: ST_COL.never, border: `3px solid ${C.navy}`, fontFamily: LILITA, fontSize: 28, color: '#fff'}}>{r.l} P</span>
								</div>
								<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.8)', marginTop: 10}}>{ST_TXT[r.st]} · {r.p} PARTIDOS</div>
							</div>
						))}
					</div>
					{ft >= F_BEST + 280 && (
						<div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((ft - F_BEST - 280) / 14)})`}}>
							<Pill size={30} bg={C.yellow}>Y CONTRA ESTADOS UNIDOS: {usa.w} VICTORIAS Y {usa.l} DERROTAS EN {usa.p} PARTIDOS</Pill>
						</div>
					)}
					{ft >= F_BEST + 510 && (
						<div style={{position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((ft - F_BEST - 510) / 14)})`}}>
							<Pill size={30} bg="#fff">¿CUÁNTAS ACERTASTE? ¡CUÉNTAMELO EN LOS COMENTARIOS!</Pill>
						</div>
					)}
				</AbsoluteFill>
			)}
		</>
	);
};
const Outro: React.FC<{t: number; f: number}> = ({t, f}) => {
	const outP = (d: number) => backOut((t - d) / 14);
	return (
		<AbsoluteFill style={{background: 'rgba(8,20,40,0.55)'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
				<div style={{transform: `scale(${outP(0)})`, textAlign: 'center'}}>
					<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1.05, color: '#fff', ...strokeText(14)}}>¿QUÉ SELECCIÓN</div>
					<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1.05, color: C.yellow, ...strokeText(14)}}>ANALIZAMOS AHORA?</div>
				</div>
				<div style={{display: 'flex', gap: 22}}>
					{[['ESPAÑA', '#C60B1E'], ['COLOMBIA', '#003893'], ['URUGUAY', '#4FA3E3']].map(([n, c], i) => (
						<div key={n} style={{transform: `scale(${outP(60 + i * 14)}) rotate(${(i - 1) * 3}deg)`, padding: '18px 34px', borderRadius: 20, background: c, border: `6px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)', fontFamily: LILITA, fontSize: 56, color: '#fff'}}>{n}</div>
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

export {Eyes, Mouth};
