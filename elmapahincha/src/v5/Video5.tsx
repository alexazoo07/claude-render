import React, {useMemo} from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {WorldLayer, Vis, WCam, WORLD, bboxOf} from './WorldLayer5';
import {Eyes, Hincha, Mood, Mouth} from '../Hincha';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {C} from '../data';
import {backOut, clamp01, easeInOut, easeOut, elastic, Panel, Pill, strokeText} from '../ui';
import {blinkAt, camPath, Key, Subscribe} from '../common';
import {FlagPreload} from '../v2/Preload';
import {ALL_FLAGS5, BEATEN, CONF_ES, MOMENTS, NORWAY, Rival, ST_COL, ST_TXT, St, TICKER, TOTALS, TOUR} from './data5';

const FPS = 60;
const ME = 'BRA';
const ME_FLAG = 'br';
const SCARF: [string, string] = ['#FEDD00', '#009C3B'];

// ---------------- timeline ----------------
type Item = {kind: 'intro' | 'region' | 'rival' | 'burst' | 'final' | 'outro'; from: number; dur: number; r?: Rival; rs?: Rival[]; conf?: string; i?: number};
const INTRO = 960;
const REGION = 150;
const FINAL = 2520;
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
export const ITEMS5: Item[] = (() => {
	const out: Item[] = [];
	let t = 0;
	const push = (it: Omit<Item, 'from'>) => { out.push({...it, from: t}); t += it.dur; };
	push({kind: 'intro', dur: INTRO});
	const list = TOUR.filter((r) => r.key !== 'NOR');
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
export const V5_TOTAL = ITEMS5.reduce((a, b) => a + b.dur, 0);
const SHOWN = ITEMS5.filter((x) => x.kind === 'rival' || x.kind === 'burst');
const finalIt = ITEMS5.find((x) => x.kind === 'final')!;

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
const NOR_VIEW = fitBox(['NOR'], 470, 900, 500);
const KEYS_CAM: Key[] = (() => {
	const k: Key[] = [];
	const add = (f: number, c: WCam) => k.push([f, c.x, c.y, c.z]);
	add(0, {x: 1300, y: 1150, z: 1.4});
	add(470, {x: 1300, y: 1150, z: 1.5});
	add(520, {x: 1500, y: 1050, z: 0.75});
	add(720, {x: 1700, y: 950, z: 0.6});
	add(INTRO - 10, {x: 1700, y: 950, z: 0.62});
	for (const it of ITEMS5) {
		if (it.kind === 'region') { const v = REGION_VIEW[it.conf!]; add(it.from + 60, v); add(it.from + it.dur, {...v, z: v.z * 1.04}); }
		if (it.kind === 'rival') { const c = fitBox([it.r!.key]); add(it.from + 46, c); add(it.from + it.dur, {...c, z: c.z * 1.05}); }
		if (it.kind === 'burst') { const c = fitBox(it.rs!.map((r) => r.key), 360, 1100, 430); add(it.from + 46, c); add(it.from + it.dur, {...c, z: c.z * 1.04}); }
		if (it.kind === 'final') {
			const f0 = it.from;
			add(f0 + 80, WORLD_VIEW); add(f0 + 560, {...WORLD_VIEW, z: WORLD_VIEW.z * 1.04});
			add(f0 + 680, {...NOR_VIEW, z: NOR_VIEW.z * 0.7}); add(f0 + 1000, NOR_VIEW); add(f0 + 1700, {...NOR_VIEW, z: NOR_VIEW.z * 1.06});
			add(f0 + 1780, WORLD_VIEW); add(f0 + it.dur, {...WORLD_VIEW, z: WORLD_VIEW.z * 1.05});
		}
		if (it.kind === 'outro') { add(it.from + 60, {x: 1500, y: 1000, z: 0.62}); add(it.from + it.dur, {x: 1500, y: 1000, z: 0.64}); }
	}
	return k;
})();

// ---------------- hook geometry (brick wall) ----------------
const COLS = 9, ROWS = 5, BW = 186, BH = 106;
const BRICKS = TOUR.filter((r) => r.w > 0).sort((a, b) => b.p - a.p).slice(0, COLS * ROWS - 1);
const brickPos = (i: number) => {
	const row = Math.floor(i / COLS), col = i % COLS;
	const off = row % 2 ? BW / 2 : 0;
	return {x: 64 + col * (BW + 8) + off - (row % 2 ? 50 : 0), y: 300 + row * (BH + 8)};
};
// snake order so the ball zig-zags through the wall
const ORDER = (() => {
	const o: number[] = [];
	for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) { const cc = r % 2 ? COLS - 1 - c : c; const i = r * COLS + cc; if (i < BRICKS.length) o.push(i); }
	return o;
})();
const HIT0 = 50, HIT_GAP = 4;
const hitFrame = (i: number) => HIT0 + ORDER.indexOf(i) * HIT_GAP;
const BALL_SIZE = 190;
const ballPos = (f: number): [number, number] => {
	const centers = ORDER.map((i) => { const p = brickPos(i); return [p.x + BW / 2, p.y + BH / 2] as [number, number]; });
	if (f < HIT0) { const p = easeOut(f / HIT0); return [-200 + (centers[0][0] + 200) * p, centers[0][1] - 260 * (1 - p)]; }
	const k = (f - HIT0) / HIT_GAP;
	const i = Math.min(centers.length - 1, Math.floor(k));
	if (i >= centers.length - 1) { const tt = clamp01((f - (HIT0 + (centers.length - 1) * HIT_GAP)) / 30); const c = centers[centers.length - 1]; return [c[0] + 300 * tt, c[1] + 400 * tt * tt]; }
	const a = centers[i], b = centers[i + 1], u = k - i;
	return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * 30];
};
const STEEL = {x: 1100, y: 470};
const CHARGE0 = 300, IMPACT = 336;

// ---------------- sfx ----------------
export const v5Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f, name, vol});
	S(0, 'whoosh_2', 0.45); S(8, 'crowd_roar', 0.3); S(20, 'riser', 0.25);
	ORDER.forEach((i, j) => { S(hitFrame(i), j % 3 === 0 ? 'glass' : `pop_${(j % 4) + 1}`, j % 3 === 0 ? 0.22 : 0.3); if (j % 6 === 0) S(hitFrame(i), 'kick', 0.3); });
	for (let k = 0; k < 30; k++) S(HIT0 + k * 7, 'tick', 0.16);
	S(250, 'crowd_roar', 0.4); S(262, 'slap', 0.45); S(280, 'drumroll', 0.35);
	S(CHARGE0, 'whoosh_4', 0.5); S(IMPACT, 'boom', 0.65); S(IMPACT + 1, 'slap', 0.55); S(IMPACT + 2, 'crowd_ohh', 0.55); S(IMPACT + 4, 'error', 0.4);
	S(400, 'pop_3', 0.4); S(430, 'click', 0.4);
	S(470, 'whoosh_1', 0.45); S(476, 'slap', 0.5); S(486, 'whistle_long', 0.3); S(540, 'click', 0.45);
	S(720, 'whoosh_2', 0.4); [0, 1, 2, 3].forEach((i) => S(740 + i * 24, `pop_${i + 1}`, 0.42)); S(860, 'riser', 0.3);
	for (const it of ITEMS5) {
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
			S(f0 + 600, 'whoosh_3', 0.45); S(f0 + 640, 'slap', 0.45); S(f0 + 700, 'drumroll', 0.55);
			S(f0 + 900, 'boom', 0.65); S(f0 + 902, 'crowd_ohh', 0.55); S(f0 + 904, 'glass', 0.4);
			[0, 1, 2, 3, 4].forEach((i) => S(f0 + 1060 + i * 60, NORWAY.seq[i] === 'L' ? 'error' : 'drop', 0.4));
			S(f0 + 1400, 'slap', 0.45);
			S(f0 + 1720, 'whoosh_2', 0.45); S(f0 + 1760, 'slap', 0.5); [0, 1, 2].forEach((i) => S(f0 + 1800 + i * 40, `pop_${i + 1}`, 0.45));
			S(f0 + 2000, 'pop_4', 0.4); S(f0 + 2250, 'whoosh_1', 0.4); S(f0 + 2280, 'click', 0.45);
		}
		if (it.kind === 'outro') { S(it.from, 'whoosh_2', 0.4); S(it.from + 20, 'slap', 0.45); [0, 1, 2].forEach((i) => S(it.from + 70 + i * 14, `pop_${i + 1}`, 0.4)); S(it.from + 300, 'pop_4', 0.4); S(it.from + 350, 'click', 0.5); S(it.from + 352, 'bong', 0.35); }
	}
	return s;
};
export const v5Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	const uefa = ITEMS5.find((x) => x.kind === 'region' && x.conf === 'UEFA')!.from;
	const caf = ITEMS5.find((x) => x.kind === 'region' && x.conf === 'CAF')!.from;
	const f0 = finalIt.from;
	return [`m_tense:0:${sec(INTRO + 40)}`, `m_happy:${sec(INTRO)}:${sec(uefa + 40)}`, `m_tense:${sec(uefa)}:${sec(caf + 40)}`, `m_happy:${sec(caf)}:${sec(f0 + 40)}`, `m_tense:${sec(f0)}:${sec(f0 + 1040)}`, `m_triumph:${sec(f0 + 1000)}:${sec(V5_TOTAL)}`].join(',');
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
						<div style={{fontFamily: RUBIK, fontWeight: 600, fontSize: 19, color: 'rgba(255,255,255,0.78)', marginTop: 4, whiteSpace: 'nowrap'}}>Brasil contra {r.es} · desde {r.first.slice(0, 4)} · goles {r.gf}-{r.ga}</div>
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
				<img src={staticFile('flags/br.svg')} style={{width: 40, height: 28, borderRadius: 4, border: `2px solid ${C.navy}`, objectFit: 'cover'}} />
				BRASIL EN DATOS
			</div>
		</div>
	);
};

// ---------------- main ----------------
export const Video5: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS_CAM, f, 5);
	const cur = ITEMS5.find((it) => f >= it.from && f < it.from + it.dur) ?? ITEMS5[ITEMS5.length - 1];
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
			vis[r.key] = {flag: r.flag, pop: Math.max(0, elastic(tp / FPS)), mood, blink: blinkAt(f, it.i! + j), open: 0.5 + 0.5 * Math.sin(f / 4 + j), color: ST_COL[r.st], colorMix, faceScale: isCur ? 1.15 : 1, glow: isCur ? (t >= P_STATUS ? ST_COL[r.st] : '#FFFFFF') : undefined};
		});
	}
	if (inFinal && ft >= 900) {
		vis.NOR = {flag: 'no', pop: Math.max(0, elastic((ft - 900) / FPS)), mood: 'grito', blink: blinkAt(f, 44), open: 0.5 + 0.5 * Math.sin(f / 4), faceScale: 1.3, glow: ft < 1720 ? '#E63946' : undefined, color: ST_COL.never, colorMix: ft >= 1780 ? 0 : 0};
	}
	const showMe = f >= 480;
	if (showMe) {
		vis[ME] = {flag: ME_FLAG, pop: Math.max(0, elastic((f - 490) / FPS)), mood: cur.kind === 'rival' && t >= P_STATUS ? moodFor(cur.r!.st) : inFinal && ft >= 900 && ft < 1720 ? 'triste' : 'feliz', blink: blinkAt(f, 99), open: 0.5 + 0.5 * Math.sin(f / 4), faceScale: 1.1, look: cur.kind === 'rival' ? (() => {
			const [ax, ay] = WORLD[ME].c; const [bx, by] = WORLD[cur.r!.key].c; const dl = Math.hypot(bx - ax, by - ay) || 1; return [(bx - ax) / dl, (by - ay) / dl] as [number, number];
		})() : [0, 0]};
	}
	const counts = {dom: 0, even: 0, neg: 0, never: 0} as Record<St, number>;
	let W = 0, D = 0, L = 0;
	revealed.forEach((r) => { counts[r.st]++; W += r.w; D += r.d; L += r.l; });
	if (vis.NOR && ft >= 900) { counts.never = 1; W += NORWAY.w; D += NORWAY.d; L += NORWAY.l; }

	const silhouettes: {key: string; p: number}[] = [];
	if (inFinal && ft >= 640 && ft < 920) silhouettes.push({key: 'NOR', p: clamp01((ft - 640) / 20) * (1 - clamp01((ft - 900) / 14))});
	const ring = cur.kind === 'rival' && t > 20 ? {key: cur.r!.key, p: Math.min(clamp01((t - 20) / 12), 1 - clamp01((t - cur.dur + 20) / 14)), color: t >= P_STATUS ? ST_COL[cur.r!.st] : C.yellow} : inFinal && ft >= 900 && ft < 1700 ? {key: 'NOR', p: clamp01((ft - 900) / 12), color: '#E63946'} : null;

	const hudIn = easeOut((f - INTRO + 10) / 30);
	const showHud = f >= INTRO - 10 && !(inFinal && ft >= 60);
	const tickIn = f >= INTRO - 10 && cur.kind !== 'outro' ? easeOut((f - INTRO + 10) / 24) : 0;
	const log = revealed.slice(-5).reverse();
	const totalRiv = TOUR.length;
	const shake = inFinal && ft >= 900 && ft < 916 ? Math.sin(f * 3) * (916 - ft) * 0.8 : 0;

	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			<FlagPreload flags={[...ALL_FLAGS5, 'no']} />
			<AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
				<WorldLayer cam={cam} vis={vis} ring={ring} silhouettes={silhouettes}>
					{inFinal && ft >= 660 && ft < 900 && (() => {
						const b = bboxOf('NOR'); const k = 1 / cam.z; const p = backOut((ft - 680) / 14);
						return <text x={b.cx} y={b.cy + 26 * k} textAnchor="middle" fontFamily="Lilita" fontSize={80 * k} fill="#E63946" stroke="#fff" strokeWidth={4 * k} paintOrder="stroke" transform={`translate(${b.cx} ${b.cy}) scale(${p}) translate(${-b.cx} ${-b.cy})`}>?</text>;
					})()}
				</WorldLayer>
			</AbsoluteFill>

			{f < 520 && <AbsoluteFill style={{opacity: 1 - clamp01((f - 470) / 30)}}><BrickHook f={f} /></AbsoluteFill>}
			{f >= 462 && f < 490 && <AbsoluteFill style={{background: '#fff', opacity: 0.85 * Math.sin(clamp01((f - 462) / 28) * Math.PI)}} />}
			{f >= 470 && f < INTRO && <IntroCards f={f} />}

			{showHud && (
				<>
					<div style={{position: 'absolute', left: 28, top: 26, transform: `translateX(${(1 - hudIn) * -400}px)`}}>
						<Panel style={{width: 250, padding: '10px 12px 14px', borderColor: '#2EC46B', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<Hincha iso={`img:${ME_FLAG}`} mood={(vis[ME]?.mood ?? 'feliz') as Mood} size={160} scarf={SCARF} blink={blinkAt(f, 3)} open={0.5 + 0.5 * Math.sin(f / 4)} sweat={cur.kind === 'rival' && t >= P_STATUS && cur.r!.st === 'neg'} />
							<div style={{fontFamily: LILITA, fontSize: 34, color: '#fff', marginTop: -6}}>BRASIL</div>
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
							<span style={{fontFamily: LILITA, fontSize: 26, color: '#fff', marginLeft: 8}}>{revealed.length + (counts.never && vis.NOR ? 1 : 0)}/{totalRiv}</span>
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

// ---------------- HOOK: smashing the wall ----------------
const Txt: React.FC<{children: React.ReactNode; size?: number; color?: string; p: number; shadow?: string}> = ({children, size = 84, color = '#fff', p, shadow = C.navy}) => (
	<div style={{transform: `scale(${Math.max(0, p)})`, fontFamily: LILITA, fontSize: size, color, ...strokeText(size * 0.16), textShadow: `0 ${size * 0.09}px 0 ${shadow}`, whiteSpace: 'nowrap', lineHeight: 1.05}}>{children}</div>
);
const BrickHook: React.FC<{f: number}> = ({f}) => {
	const count = Math.min(BEATEN, Math.round(BEATEN * easeOut(clamp01((f - HIT0) / (ORDER.length * HIT_GAP + 20)))));
	const [bx, by] = ballPos(f);
	// charge at the steel brick
	let cx = 0, cy = 0, ko = false, squash = 1;
	const charging = f >= CHARGE0 - 6;
	if (charging) {
		if (f < IMPACT) { const u = easeInOut((f - CHARGE0 + 6) / (IMPACT - CHARGE0 + 6)); cx = -200 + (STEEL.x - 120 - -200) * u; cy = STEEL.y + 60 - Math.sin(u * Math.PI) * 80; }
		else { const u = clamp01((f - IMPACT) / 40); cx = STEEL.x - 120 - 520 * easeOut(u); cy = STEEL.y + 60 - Math.sin(u * Math.PI) * 160 + 140 * u * u; ko = true; squash = f < IMPACT + 8 ? 1 - 0.35 * Math.sin(((f - IMPACT) / 8) * Math.PI) : 1; }
	}
	const steelShake = f >= IMPACT && f < IMPACT + 18 ? Math.sin(f * 3.3) * (IMPACT + 18 - f) * 0.7 : 0;
	const steelP = backOut((f - 238) / 14);
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1E4B8A 0%, #0B1E3F 70%, #050D1E 100%)', overflow: 'hidden', transform: f >= IMPACT && f < IMPACT + 14 ? `translate(${Math.sin(f * 2.7) * 14}px, ${Math.cos(f * 3.1) * 8}px)` : undefined}}>
			<AbsoluteFill style={{opacity: 0.12, backgroundImage: `url(${staticFile('tex/ocean.png')})`, backgroundSize: '700px 700px'}} />
			{/* bricks */}
			{BRICKS.map((r, i) => {
				const {x, y} = brickPos(i);
				const h = hitFrame(i);
				if (f < h) {
					const enter = backOut((f - i * 0.6) / 12);
					return (
						<div key={r.key} style={{position: 'absolute', left: x, top: y, width: BW, height: BH, transform: `scale(${Math.max(0, enter)})`, borderRadius: 12, overflow: 'hidden', border: `5px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.45), inset 0 0 0 3px rgba(255,255,255,0.35)'}}>
							<img src={staticFile(`flags/${r.flag}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
						</div>
					);
				}
				const tt = f - h;
				if (tt > 50) return null;
				const quads = [[0, 0], [1, 0], [0, 1], [1, 1]];
				return quads.map(([qx, qy], q) => {
					const vx = (qx ? 1 : -1) * (5 + ((i * 7 + q * 3) % 6)), vy = -8 - ((i + q * 5) % 7);
					const px = vx * tt, py = vy * tt + 0.55 * tt * tt;
					const rot = (qx ? 1 : -1) * tt * (6 + (q % 3) * 3);
					const clip = `polygon(${qx * 50}% ${qy * 50}%, ${qx * 50 + 50}% ${qy * 50}%, ${qx * 50 + 50}% ${qy * 50 + 50}%, ${qx * 50}% ${qy * 50 + 50}%)`;
					return (
						<div key={r.key + q} style={{position: 'absolute', left: x, top: y, width: BW, height: BH, clipPath: clip, transform: `translate(${px}px, ${py}px) rotate(${rot}deg)`, opacity: 1 - clamp01((tt - 30) / 20), borderRadius: 12, overflow: 'hidden', border: `5px solid ${C.navy}`}}>
							<img src={staticFile(`flags/${r.flag}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
						</div>
					);
				});
			})}
			{/* impact sparks */}
			{ORDER.map((i) => {
				const tt = f - hitFrame(i);
				if (tt < 0 || tt > 12) return null;
				const {x, y} = brickPos(i);
				return <div key={'s' + i} style={{position: 'absolute', left: x + BW / 2 - 70, top: y + BH / 2 - 70, width: 140, height: 140, borderRadius: 70, border: `${8 - tt * 0.6}px solid #FFF6B0`, transform: `scale(${0.4 + tt / 10})`, opacity: 1 - tt / 12}} />;
			})}
			{/* the steel brick that never breaks */}
			{f >= 236 && (
				<div style={{position: 'absolute', left: STEEL.x, top: STEEL.y, width: 300, height: 170, transform: `translateX(${steelShake}px) scale(${steelP})`}}>
					<div style={{position: 'absolute', inset: 0, borderRadius: 16, background: 'linear-gradient(160deg, #5A6577 0%, #2B3240 55%, #1A1F29 100%)', border: '7px solid #0A0E16', boxShadow: '0 0 0 4px #E63946, 0 0 40px rgba(230,57,70,0.7), 0 12px 0 rgba(0,0,0,0.5)'}} />
					{[[16, 16], [266, 16], [16, 136], [266, 136]].map(([a, b], i) => <div key={i} style={{position: 'absolute', left: a, top: b, width: 16, height: 16, borderRadius: 8, background: '#9AA5B8', border: '3px solid #0A0E16'}} />)}
					<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 130, color: '#E63946', ...strokeText(12, '#fff')}}>?</div>
				</div>
			)}
			{/* ball */}
			{f < 250 && (
				<div style={{position: 'absolute', left: bx - BALL_SIZE / 2, top: by - BALL_SIZE / 2, transform: `rotate(${f * 9}deg)`}}>
					<Hincha iso={`img:${ME_FLAG}`} mood="grito" size={BALL_SIZE} scarf={SCARF} open={0.5 + 0.5 * Math.sin(f / 3)} />
				</div>
			)}
			{charging && (
				<div style={{position: 'absolute', left: cx - 110, top: cy - 110, transform: `scale(${1 / squash}, ${squash}) rotate(${ko ? (f - IMPACT) * -6 : 0}deg)`}}>
					<Hincha iso={`img:${ME_FLAG}`} mood={ko ? 'ko' : 'grito'} size={220} scarf={SCARF} open={1} />
				</div>
			)}
			{f >= IMPACT && f < 470 && (
				<div style={{position: 'absolute', left: STEEL.x - 260, top: STEEL.y - 90, transform: `scale(${backOut((f - IMPACT) / 8)}) rotate(-12deg)`, fontFamily: LILITA, fontSize: 92, color: C.yellow, ...strokeText(14)}}>¡CLONC!</div>
			)}
			{/* texts */}
			{f >= 10 && f < 250 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 1 - clamp01((f - 236) / 12)}}>
					<Txt p={backOut((f - 10) / 12)} size={70}>BRASIL HA GANADO A</Txt>
					<div style={{display: 'flex', alignItems: 'baseline', gap: 18, transform: `scale(${backOut((f - 30) / 12)})`}}>
						<span style={{fontFamily: LILITA, fontSize: 140, lineHeight: 1, color: '#2EC46B', ...strokeText(18), textShadow: `0 10px 0 ${C.navy}`}}>{count}</span>
						<span style={{fontFamily: LILITA, fontSize: 70, color: '#fff', ...strokeText(12)}}>SELECCIONES</span>
					</div>
				</div>
			)}
			{f >= 250 && f < 470 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
					<Txt p={backOut((f - 252) / 12)} size={74}>...PERO HAY UNA A LA QUE</Txt>
					<Txt p={backOut((f - 264) / 12)} size={104} color="#FF3B30" shadow="#000">NUNCA HA GANADO</Txt>
				</div>
			)}
			{f >= 380 && f < 470 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
					<div style={{transform: `scale(${backOut((f - 380) / 12)})`}}><Pill size={36} bg={C.yellow}>¿SABES CUÁL ES? ESCRÍBELO EN LOS COMENTARIOS</Pill></div>
					{f >= 410 && <div style={{transform: `scale(${backOut((f - 410) / 12)})`}}><Pill size={28} bg="#fff">PISTA: LE ELIMINÓ DEL MUNDIAL 2026</Pill></div>}
				</div>
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
						<div style={{fontFamily: LILITA, fontSize: 92, lineHeight: 1.0, color: '#FEDD00', WebkitTextStroke: `5px ${C.navy}`, paintOrder: 'stroke fill'}}>BRASIL?</div>
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
const Final: React.FC<{ft: number; f: number}> = ({ft, f}) => {
	const cnt = {dom: 0, even: 0, neg: 0, never: 0} as Record<St, number>;
	TOUR.forEach((r) => cnt[r.st]++);
	const nor = NORWAY;
	const games = [
		{y: '1988', s: '1-1', c: 'Amistoso · Oslo'},
		{y: '1997', s: '2-4', c: 'Amistoso · Oslo'},
		{y: '1998', s: '1-2', c: 'MUNDIAL · Marsella'},
		{y: '2006', s: '1-1', c: 'Amistoso · Oslo'},
		{y: '2026', s: '1-2', c: 'MUNDIAL · octavos'},
	];
	const worst = ['NOR', 'HUN', 'NLD'].map((k) => TOUR.find((r) => r.key === k)!);
	const arg = TOUR.find((r) => r.key === 'ARG')!;
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
			{ft >= 620 && ft < 900 && (
				<>
					<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(120,10,20,0.7) 100%)', opacity: clamp01((ft - 620) / 30)}} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
						<Txt p={backOut((ft - 640) / 14)} size={70}>LA ÚNICA SELECCIÓN A LA QUE</Txt>
						<Txt p={backOut((ft - 656) / 14)} size={70}>BRASIL NUNCA HA GANADO ES...</Txt>
					</div>
				</>
			)}
			{ft >= 900 && ft < 916 && <AbsoluteFill style={{background: '#E63946', opacity: 0.5 * (1 - (ft - 900) / 16)}} />}
			{ft >= 900 && ft < 1720 && (
				<>
					<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((ft - 902) / 12) * (1 - easeInOut((ft - 1690) / 24))})`}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 24}}>
							<img src={staticFile('flags/no.svg')} style={{width: 150, height: 110, borderRadius: 14, border: `6px solid ${C.navy}`, objectFit: 'cover', boxShadow: '0 0 0 5px #fff, 0 0 40px #E63946'}} />
							<div style={{fontFamily: LILITA, fontSize: 150, color: '#fff', ...strokeText(20), textShadow: `0 12px 0 ${C.red}`}}>¡NORUEGA!</div>
						</div>
					</div>
					<div style={{position: 'absolute', right: 60, top: 240, display: 'flex', flexDirection: 'column', gap: 12, opacity: 1 - clamp01((ft - 1690) / 24)}}>
						<div style={{transform: `scale(${backOut((ft - 1010) / 12)})`, transformOrigin: 'right center', textAlign: 'right'}}><Pill size={26} bg={C.yellow}>SUS 5 PARTIDOS: 0 VICTORIAS · {nor.d} EMPATES · {nor.l} DERROTAS</Pill></div>
						{games.map((g, i) => {
							const p = backOut((ft - 1060 - i * 60) / 12);
							const res = nor.seq[i];
							return (
								<div key={g.y} style={{transform: `scale(${Math.max(0, p)})`, transformOrigin: 'right center', display: 'flex', alignItems: 'stretch', alignSelf: 'flex-end', borderRadius: 14, overflow: 'hidden', border: `5px solid ${g.c.startsWith('MUNDIAL') ? '#E63946' : C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.4)'}}>
									<div style={{background: '#0B1E3F', padding: '6px 14px', fontFamily: LILITA, fontSize: 34, color: '#fff', display: 'flex', alignItems: 'center'}}>{g.y}</div>
									<div style={{background: '#fff', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 10}}>
										<img src={staticFile('flags/br.svg')} style={{width: 46, height: 34, borderRadius: 5, border: `2px solid ${C.navy}`, objectFit: 'cover'}} />
										<span style={{fontFamily: LILITA, fontSize: 40, color: C.navy}}>{g.s}</span>
										<img src={staticFile('flags/no.svg')} style={{width: 46, height: 34, borderRadius: 5, border: `2px solid ${C.navy}`, objectFit: 'cover'}} />
									</div>
									<div style={{background: RES_COL[res], padding: '6px 14px', display: 'flex', alignItems: 'center', fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: res === 'D' ? C.navy : '#fff', width: 250}}>{g.c}</div>
								</div>
							);
						})}
					</div>
					{ft >= 1400 && (
						<div style={{position: 'absolute', left: 0, right: 0, bottom: 110, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((ft - 1400) / 14) * (1 - easeInOut((ft - 1690) / 24))})`}}>
							<Pill size={32} bg="#fff">2026: NORUEGA ELIMINÓ A BRASIL DEL MUNDIAL EN OCTAVOS (2-1)</Pill>
						</div>
					)}
				</>
			)}
			{ft >= 1720 && (
				<AbsoluteFill style={{background: `rgba(8,20,40,${0.78 * clamp01((ft - 1720) / 24)})`}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center', transform: `scale(${backOut((ft - 1750) / 14)})`}}>
						<span style={{fontFamily: LILITA, fontSize: 100, color: C.yellow, ...strokeText(16), textShadow: `0 10px 0 ${C.red}`}}>SUS BESTIAS NEGRAS</span>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 240, display: 'flex', justifyContent: 'center', gap: 34}}>
						{worst.map((r, i) => (
							<div key={r.key} style={{transform: `scale(${backOut((ft - 1800 - i * 40) / 14)})`, width: 420, padding: '18px 16px 20px', borderRadius: 24, background: 'rgba(11,30,63,0.96)', border: `6px solid ${ST_COL[r.st]}`, textAlign: 'center', position: 'relative'}}>
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
					{ft >= 2000 && (
						<div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((ft - 2000) / 14)})`}}>
							<Pill size={30} bg={C.yellow}>Y CONTRA ARGENTINA: {arg.w} VICTORIAS Y {arg.l} DERROTAS EN {arg.p} PARTIDOS</Pill>
						</div>
					)}
					{ft >= 2280 && (
						<div style={{position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((ft - 2280) / 14)})`}}>
							<Pill size={30} bg="#fff">¿LO SABÍAS? ¡CUÉNTAMELO EN LOS COMENTARIOS!</Pill>
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
					{[['ESPAÑA', '#E8A800'], ['MÉXICO', '#CE1126'], ['ALEMANIA', '#222222']].map(([n, c], i) => (
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
