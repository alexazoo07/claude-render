import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {MapLayer, Cam, FaceState, labelPt} from './MapLayer6';
import {Hincha, Mood} from '../Hincha';
import {FlagChip, Iso} from './flagimg6';
import {hi} from './flagimg6';
import {C, GEO, T, TEAMS, boxOf} from './data6';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, Counter, easeInOut, easeOut, FlagBar, Footer, Panel, Pill, RoundTag, strokeText, Wheel} from './ui6';
import {ACTION_SLICES, ActionWheel, blinkAt, camPath, FPS, Key, Scoreboard, Subscribe} from './common6';
import {aliveOf, effPts, Ev, FACTS, frontPair, goals, LOG, Owners, rand, STATES, territoriesOf, War, winProbO} from './game6';

const ORDER = TEAMS.map((t) => t.iso);

export const OVERVIEW: Cam = {x: 1330, y: 640, z: 0.88};
export const CENTER: Cam = {x: 1060, y: 640, z: 0.88};

const sortAlive = (o: Owners) => ORDER.filter((i) => aliveOf(o).includes(i));

export const logLine = (e: Ev) => (e.t === 'war' ? `${T[e.win].name} conquista ${T[e.win === e.a ? e.d : e.a].name}` : `${T[e.c].name} se rebela contra ${T[e.a].name}`);
export const logIso = (e: Ev) => (e.t === 'war' ? e.win : e.c);

const bboxOf = (isos: Iso[]) => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const i of isos) {
		const b = boxOf(i);
		x0 = Math.min(x0, b[0][0]); y0 = Math.min(y0, b[0][1]); x1 = Math.max(x1, b[1][0]); y1 = Math.max(y1, b[1][1]);
	}
	return {x0, y0, x1, y1};
};
const fitCam = (isos: Iso[], extra: [number, number][] = [], maxZ = 3.6): Cam => {
	const b = bboxOf(isos);
	for (const [x, y] of extra) { b.x0 = Math.min(b.x0, x); b.x1 = Math.max(b.x1, x); b.y0 = Math.min(b.y0, y); b.y1 = Math.max(b.y1, y); }
	const w = b.x1 - b.x0 + 160, h = b.y1 - b.y0 + 160;
	const z = Math.max(0.42, Math.min(maxZ, Math.min(1500 / w, 640 / h)));
	return {x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2 + 30 / z, z};
};

export type Plan = ReturnType<typeof planRound>;
export const planRound = (idx: number, isFinal = false) => {
	const e = LOG[idx];
	const before = STATES[idx];
	const after = STATES[idx + 1];
	const alive = sortAlive(before);
	const attacker = e.a;
	const hasW2 = territoriesOf(before, attacker).length > 1;
	const spin1 = idx < 6 ? 180 : 160;
	const P: Record<string, number> = {};
	P.W1_IN = 10; P.SP1_0 = 34; P.SP1_1 = P.SP1_0 + spin1; P.RES1 = P.SP1_1;
	let t = P.RES1 + 36;
	if (hasW2) { P.W2_IN = t; P.SP2_0 = t + 20; P.SP2_1 = P.SP2_0 + 110; P.RES2 = P.SP2_1; t = P.RES2 + 44; }
	P.W_OUT = t;
	if (e.t === 'war') {
		P.TGT0 = P.W_OUT + 8; P.TGT1 = P.TGT0 + 72;
		P.ZOOM0 = P.TGT1 + 6; P.ZOOM1 = P.ZOOM0 + 46;
		P.VS_IN = P.ZOOM1 + 2; P.VS_OUT = P.VS_IN + (isFinal ? 480 : 360);
		P.M0 = P.VS_OUT + 12; P.CLK0 = P.M0 + 22; const match = isFinal ? 1260 : 560; P.CLK1 = P.CLK0 + match;
		P.FW = P.CLK1 + 4; P.CARD = P.FW + 44; P.WIPE0 = P.CARD + 8; P.WIPE1 = P.WIPE0 + 64; P.COUNT = P.WIPE0 + 44; P.LOG = P.COUNT + 6;
		P.END = P.WIPE1 + (isFinal ? 30 : 56);
	} else {
		P.ZOOM0 = P.W_OUT + 4; P.ZOOM1 = P.ZOOM0 + 44;
		P.REB0 = P.ZOOM1 + 4; P.WIPE0 = P.REB0 + 130; P.WIPE1 = P.WIPE0 + 60; P.COUNT = P.WIPE1 - 6; P.LOG = P.COUNT + 6; P.END = P.WIPE1 + 130;
	}
	// geometry
	let front: [Iso, Iso] = [attacker, attacker];
	let pairCam: Cam = OVERVIEW;
	if (e.t === 'war') {
		front = frontPair(before, e.a, e.d);
		pairCam = fitCam([front[0], front[1]], [labelPt(e.a), labelPt(e.d)]);
	} else {
		pairCam = fitCam([e.c], [], 3.6);
	}
	const endCam: Cam = e.t === 'war' ? {x: pairCam.x, y: pairCam.y, z: Math.max(0.92, pairCam.z * 0.82)} : {x: pairCam.x, y: pairCam.y, z: Math.max(0.92, pairCam.z * 0.85)};
	// wheel 1 landing
	const ia = alive.indexOf(attacker);
	const n = alive.length;
	const TH1 = -(ia * (360 / n) + 180 / n) + 360 * 6;
	const actIdxs = ACTION_SLICES.map((s, i) => [s, i] as const).filter(([s]) => (e.t === 'war' ? s === 'ATACAR' : s === 'REBELIÓN')).map(([, i]) => i);
	const iw2 = actIdxs[Math.floor(rand(idx * 13) * actIdxs.length)];
	const TH2 = -(iw2 * 45 + 22.5) + 360 * 4;
	const candidates = e.t === 'war' ? sortAlive(before).filter((k) => k !== e.a && territoriesOf(before, e.a).some((c) => (GEO.teams[c].nb as Iso[]).some((nb) => before[nb] === k))) : [];
	const gl = e.t === 'war' ? goals(idx, e) : [];
	return {idx, e, before, after, alive, attacker, hasW2, P, front, pairCam, endCam, TH1, TH2, n, candidates, gl, isFinal};
};

const spinE = (t: number) => 1 - Math.pow(1 - clamp01(t), 4);
const angle1 = (pl: Plan, f: number) => (f < pl.P.SP1_0 ? -5 * Math.sin((f - pl.P.W1_IN) / 8) * clamp01((f - pl.P.W1_IN) / 10) : pl.TH1 * spinE((f - pl.P.SP1_0) / (pl.P.SP1_1 - pl.P.SP1_0)));
const angle2 = (pl: Plan, f: number) => (f < pl.P.SP2_0 ? 0 : pl.TH2 * spinE((f - pl.P.SP2_0) / (pl.P.SP2_1 - pl.P.SP2_0)));
const ticksOf = (fn: (f: number) => number, f0: number, f1: number, step: number) => {
	const out: number[] = [];
	let prev = Math.floor(fn(f0) / step);
	for (let f = f0 + 1; f <= f1; f++) {
		const k = Math.floor(fn(f) / step);
		if (k !== prev && (out.length === 0 || f - out[out.length - 1] >= 3)) out.push(f);
		prev = k;
	}
	return out;
};
const goalFrame = (pl: Plan, min: number) => Math.round(pl.P.CLK0 + (min / 90) * (pl.P.CLK1 - pl.P.CLK0));
// non-goal chances (for variety)
const chances = (pl: Plan) => {
	if (pl.e.t !== 'war') return [] as {min: number; by: 'a' | 'd'; kind: string}[];
	const out: {min: number; by: 'a' | 'd'; kind: string}[] = [];
	const kinds = ['¡AL PALO!', '¡PARADÓN!', '¡FUERA POR POCO!', '¡TARJETA AMARILLA!'];
	const k = pl.isFinal ? 4 : 2;
	for (let i = 0; i < k; i++) {
		const min = 6 + Math.floor(rand(pl.idx * 57 + i * 11) * 80);
		if (pl.gl.some((g) => Math.abs(g.min - min) < 9) || out.some((c) => Math.abs(c.min - min) < 9)) continue;
		out.push({min, by: rand(pl.idx * 3 + i) < 0.5 ? 'a' : 'd', kind: kinds[Math.floor(rand(pl.idx * 5 + i * 3) * kinds.length)]});
	}
	return out;
};

export const roundSfx = (pl: Plan) => {
	const P = pl.P;
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f, name, vol});
	S(0, 'whoosh_2', 0.35); S(P.W1_IN - 6, 'whoosh_4', 0.4);
	ticksOf((f) => angle1(pl, f), P.SP1_0, P.SP1_1, 360 / pl.n).forEach((f) => S(f, 'tick', 0.4));
	S(P.RES1 + 2, 'confirm', 0.45);
	if (pl.hasW2) {
		S(P.W2_IN - 4, 'whoosh_3', 0.35);
		ticksOf((f) => angle2(pl, f), P.SP2_0, P.SP2_1, 45).forEach((f) => S(f, 'tick', 0.38));
		S(P.RES2 + 2, pl.e.t === 'rebel' ? 'boom' : 'slap', 0.45);
	}
	S(P.W_OUT, 'whoosh_1', 0.4);
	if (pl.e.t === 'war') {
		for (let f = P.TGT0 + 4; f < P.TGT1; f += 9) S(f, 'click', 0.28);
		S(P.TGT1, 'drop', 0.45); S(P.ZOOM0, 'whoosh_4', 0.4); S(P.ZOOM0 + 14, 'up', 0.3);
		S(P.VS_IN, 'whoosh_3', 0.4); S(P.VS_IN + 18, 'boom', 0.32); S(P.VS_IN + 120, 'pop_2', 0.35);
		S(P.VS_OUT - 90, 'drumroll', 0.38);
		S(P.CLK0 - 4, 'whistle_short', 0.4);
		pl.gl.forEach((g) => {
			const gf = goalFrame(pl, g.min);
			S(gf - 24, 'kick', 0.6); S(gf - 20, 'whoosh_3', 0.3); S(gf, 'crowd_roar', 0.55); S(gf + 2, 'boom', 0.4);
		});
		chances(pl).forEach((c) => {
			const cf = goalFrame(pl, c.min);
			S(cf - 18, 'kick', 0.45); S(cf, c.kind.includes('AMARILLA') ? 'whistle_short' : 'crowd_ohh', 0.45);
		});
		S(P.FW, 'whistle_long', 0.4); S(P.CARD, 'slap', 0.6); S(P.WIPE0, 'whoosh_2', 0.45); S(P.COUNT, 'confirm', 0.45); S(P.LOG, 'click', 0.4);
	} else {
		S(P.ZOOM0, 'whoosh_4', 0.4); S(P.REB0, 'drumroll', 0.45); S(P.REB0 + 6, 'riser', 0.35); S(P.WIPE0, 'glass', 0.5); S(P.WIPE0 + 2, 'boom', 0.45);
		S(P.WIPE0 + 4, 'crowd_roar', 0.4); S(P.WIPE1, 'pop_3', 0.45); S(P.COUNT, 'confirm', 0.45); S(P.LOG, 'click', 0.4);
	}
	return s;
};

export const LastPlays: React.FC<{lines: [Iso, string][]; p: number}> = ({lines, p}) => (
	<div style={{position: 'absolute', right: 36, top: 30, transform: `translateX(${(1 - easeOut(p)) * 560}px)`}}>
		<Panel style={{width: 480, padding: '14px 20px', borderColor: '#fff'}}>
			<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: C.yellow, marginBottom: 6}}>ÚLTIMAS JUGADAS</div>
			{lines.map(([iso, txt], i) => (
				<div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, opacity: i === 0 ? 1 : 0.7}}>
					<FlagChip iso={iso} w={40} />
					<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: '#fff', whiteSpace: 'nowrap'}}>{txt}</span>
				</div>
			))}
		</Panel>
	</div>
);

export const Round: React.FC<{idx: number; start: Cam; isFinal?: boolean; cta?: boolean}> = ({idx, start, isFinal = false, cta = false}) => {
	const f = useCurrentFrame();
	const pl = planRound(idx, isFinal);
	const {e, P, before, after, front} = pl;
	const war = e.t === 'war' ? (e as War) : null;
	const loser = war ? (war.win === war.a ? war.d : war.a) : null;

	// ---------- camera ----------
	const keys: Key[] = [
		[0, start.x, start.y, start.z],
		[40, OVERVIEW.x, OVERVIEW.y, OVERVIEW.z],
		[P.W_OUT, OVERVIEW.x, OVERVIEW.y, OVERVIEW.z * 1.02],
	];
	if (war) {
		keys.push([P.TGT0 + 20, CENTER.x, CENTER.y, CENTER.z]);
		keys.push([P.TGT1, CENTER.x, CENTER.y, CENTER.z * 1.02]);
		keys.push([P.ZOOM1, pl.pairCam.x, pl.pairCam.y, pl.pairCam.z]);
		keys.push([P.FW, pl.pairCam.x + 8, pl.pairCam.y - 4, pl.pairCam.z * 1.06]);
		keys.push([P.WIPE0, pl.pairCam.x + 8, pl.pairCam.y - 4, pl.pairCam.z * 1.06]);
		keys.push([P.END, pl.endCam.x, pl.endCam.y, pl.endCam.z]);
	} else {
		keys.push([P.ZOOM1, pl.pairCam.x, pl.pairCam.y, pl.pairCam.z]);
		keys.push([P.WIPE0, pl.pairCam.x, pl.pairCam.y, pl.pairCam.z * 1.05]);
		keys.push([P.END, pl.endCam.x, pl.endCam.y, pl.endCam.z]);
	}
	const cam = camPath(keys, f, idx);

	// ---------- ownership ----------
	const done = f >= P.WIPE1;
	const owners = done ? after : before;
	const conquest = f >= P.WIPE0 && f < P.WIPE1 ? (() => {
		if (war && loser) {
			const from = GEO.teams[war.win === war.a ? front[0] : front[1]].c as [number, number];
			const ls = territoriesOf(before, loser);
			let r = 0;
			for (const c of ls) { const b = GEO.teams[c].b; for (const [x, y] of [[b[0][0], b[0][1]], [b[1][0], b[1][1]], [b[0][0], b[1][1]], [b[1][0], b[0][1]]]) r = Math.max(r, Math.hypot(x - from[0], y - from[1])); }
			return {countries: ls, to: war.win, p: easeInOut((f - P.WIPE0) / (P.WIPE1 - P.WIPE0)), from, radius: r + 20};
		}
		const c = (e as any).c as Iso;
		const b = GEO.teams[c].b;
		return {countries: [c], to: c, p: easeInOut((f - P.WIPE0) / (P.WIPE1 - P.WIPE0)), from: GEO.teams[c].c as [number, number], radius: Math.hypot(b[1][0] - b[0][0], b[1][1] - b[0][1])};
	})() : null;

	// ---------- match state ----------
	const minuteRaw = war && f >= P.CLK0 ? Math.min(90, Math.floor(((f - P.CLK0) / (P.CLK1 - P.CLK0)) * 90)) : null;
	const scored = war ? pl.gl.filter((g) => f >= goalFrame(pl, g.min)) : [];
	const ga = scored.filter((g) => g.by === 'a').length, gd = scored.filter((g) => g.by === 'd').length;
	const lastGoal = scored.length ? scored[scored.length - 1] : null;
	const lastGoalF = lastGoal ? goalFrame(pl, lastGoal.min) : -999;
	const goalAge = f - lastGoalF;
	const chs = chances(pl);
	const activeCh = chs.find((c) => f >= goalFrame(pl, c.min) && f < goalFrame(pl, c.min) + 50);

	// ---------- faces ----------
	const focus: [number, number] = [pl.pairCam.x, pl.pairCam.y];
	const faces: Partial<Record<Iso, FaceState>> = {};
	aliveOf(owners).forEach((o, i) => {
		const [lx, ly] = labelPt(o);
		const dx = focus[0] - lx, dy = focus[1] - ly, dl = Math.hypot(dx, dy) || 1;
		let mood: Mood = 'feliz';
		let look: [number, number] = f > P.ZOOM0 ? [dx / dl, dy / dl] : f > P.W1_IN && f < P.W_OUT ? [1, 0] : [0, 0];
		let scale = 1;
		if (f >= P.RES1 && f < P.W_OUT && o === pl.attacker) { mood = war ? 'grito' : 'miedo'; scale = 1.15; }
		if (war && f >= P.TGT0) {
			if (o === war.a) mood = 'enfado';
			if (o === war.d) mood = f >= P.TGT1 ? 'miedo' : mood;
			if (minuteRaw !== null && f < P.FW + 20) {
				if (o === war.a || o === war.d) {
					mood = 'enfado';
					if (lastGoal && goalAge < 70) mood = (lastGoal.by === 'a') === (o === war.a) ? 'grito' : 'triste';
					if (activeCh) mood = (activeCh.by === 'a') === (o === war.a) ? 'grito' : 'miedo';
				}
			}
			if (f >= P.FW + 20 && f < P.END) {
				if (o === war.win) { mood = 'grito'; scale = 1.15; }
				if (o === loser) mood = f >= P.CARD ? 'ko' : 'triste';
			}
			if (o === loser && f >= P.WIPE0 + 10) {
				if (f >= P.WIPE0 + 34) return;
				scale = 1 - (f - P.WIPE0 - 10) / 24;
			}
		}
		if (!war && f >= P.REB0 && o === pl.attacker && f < P.END) mood = f >= P.WIPE0 ? 'triste' : 'miedo';
		faces[o] = {mood, blink: mood === 'ko' ? 0 : blinkAt(f, ORDER.indexOf(o)), open: 0.5 + 0.5 * Math.sin(f / 4 + i), look, scale};
	});
	if (!war && f >= P.WIPE1 - 6) {
		const c = (e as any).c as Iso;
		faces[c] = {mood: 'grito', open: 0.5 + 0.5 * Math.sin(f / 4), scale: backOut((f - P.WIPE1 + 6) / 16), look: [0, -0.4]};
	}

	// ---------- highlights / dim ----------
	const highlight: Partial<Record<Iso, number>> = {};
	let dim = 0;
	if (war) {
		if (f >= P.TGT0 && f < P.TGT1 + 10) {
			const cands = pl.candidates;
			const tt = clamp01((f - P.TGT0) / (P.TGT1 - P.TGT0));
			const steps = Math.floor(14 * (1 - Math.pow(1 - tt, 2)));
			const idD = cands.indexOf(war.d);
			const cur = f >= P.TGT1 ? war.d : cands[(((idD - 14 + steps) % cands.length) + cands.length * 20) % cands.length];
			for (const c of territoriesOf(before, cur)) highlight[c] = f >= P.TGT1 ? 0.6 + 0.4 * Math.sin(f / 5) : 0.9;
		}
		if (f >= P.ZOOM0 && f < P.WIPE1 + 20) {
			dim = Math.min(clamp01((f - P.ZOOM0) / 20), 1 - clamp01((f - P.WIPE1) / 20)) * 0.75;
			for (const c of [...territoriesOf(before, war.a), ...territoriesOf(before, war.d)]) highlight[c] = Math.max(highlight[c] ?? 0, 0.001);
			if (f < P.FW) for (const c of territoriesOf(before, war.d)) highlight[c] = 0.35 + 0.25 * Math.sin(f / 6);
		}
	} else {
		const c = (e as any).c as Iso;
		if (f >= P.REB0 - 10 && f < P.WIPE1 + 30) {
			dim = Math.min(clamp01((f - P.REB0 + 10) / 20), 1 - clamp01((f - P.WIPE1) / 30)) * 0.6;
			for (const k of territoriesOf(before, pl.attacker)) highlight[k] = 0.001;
			highlight[c] = f < P.WIPE0 ? 0.5 + 0.5 * Math.sin(f / 3.5) : 0.8;
		}
	}
	if (f < P.RES1 + 30 && f >= P.RES1) for (const c of territoriesOf(before, pl.attacker)) highlight[c] = Math.max(highlight[c] ?? 0, 0.6 + 0.4 * Math.sin(f / 6));

	// ---------- arrow + ball ----------
	const A = GEO.teams[front[0]].c as [number, number], B = GEO.teams[front[1]].c as [number, number];
	const mx = (A[0] + B[0]) / 2 - (B[1] - A[1]) * 0.3, my = (A[1] + B[1]) / 2 + (B[0] - A[0]) * 0.3;
	const arrowP = clamp01((f - P.ZOOM0 - 10) / 36);
	let ball: [number, number] | null = null;
	if (war) {
		const shots = [...pl.gl.map((g) => ({min: g.min, by: g.by})), ...chs.map((c) => ({min: c.min, by: c.by}))];
		for (const s of shots) {
			const gf = goalFrame(pl, s.min);
			if (f >= gf - 24 && f < gf + 4) {
				const t = clamp01((f - gf + 24) / 24);
				const [P0, P2] = s.by === 'a' ? [A, B] : [B, A];
				const cx = (P0[0] + P2[0]) / 2, cy = (P0[1] + P2[1]) / 2 - 60 / cam.z;
				ball = [(1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * cx + t * t * P2[0], (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * cy + t * t * P2[1]];
			}
		}
	}

	// ---------- HUD values ----------
	const aliveBefore = aliveOf(before).length, aliveAfter = aliveOf(after).length;
	const count = f >= P.COUNT ? aliveAfter : aliveBefore;
	const aliveMap = Object.fromEntries(ORDER.map((i) => [i, aliveOf(f >= P.COUNT ? after : before).includes(i)]));
	const hist = LOG.slice(0, f >= P.LOG ? idx + 1 : idx).map((x) => [logIso(x), logLine(x)] as [Iso, string]).reverse().slice(0, 3);
	const logP = f < P.W1_IN + 10 ? 1 - clamp01((f - P.W1_IN + 6) / 14) : f >= P.LOG ? clamp01((f - P.LOG) / 14) : 0;
	const pA = war ? winProbO(before, war.a, war.d) : 0;

	const W1 = pl.alive;
	const wheelOut = (f0: number) => easeInOut((f - f0) / 22) * 900;

	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			<MapLayer cam={cam} owners={owners} faces={faces} highlight={highlight} dim={dim} conquest={conquest}>
				{war && f >= P.ZOOM0 && f < P.CLK0 && (
					<g>
						<path d={`M${A[0]} ${A[1]} Q${mx} ${my} ${B[0]} ${B[1]}`} fill="none" stroke={C.navy} strokeWidth={14 / cam.z} strokeLinecap="round" pathLength={1} strokeDasharray={`${arrowP} 1`} />
						<path d={`M${A[0]} ${A[1]} Q${mx} ${my} ${B[0]} ${B[1]}`} fill="none" stroke={C.red} strokeWidth={8 / cam.z} strokeLinecap="round" pathLength={1} strokeDasharray={`${arrowP} 1`} />
					</g>
				)}
				{ball && (
					<g transform={`translate(${ball[0]} ${ball[1]}) rotate(${f * 18}) scale(${0.24 / Math.sqrt(cam.z)})`}>
						<g transform="translate(-100 -92)">
							<circle cx={100} cy={92} r={76} fill="#fff" stroke={C.navy} strokeWidth={8} />
							<polygon points="100,44 128,64 118,96 82,96 72,64" fill={C.navy} />
						</g>
					</g>
				)}
			</MapLayer>

			{/* HUD */}
			<Counter value={count} total={TEAMS.length} flash={f >= P.COUNT ? Math.max(0, 1 - (f - P.COUNT) / 24) : 0} />
			<RoundTag n={idx + 1} style={{transform: `scale(${f < 16 ? backOut(f / 16) : 1})`}} />
			<FlagBar alive={aliveMap} pulse={{[pl.attacker]: f >= P.RES1 && f < P.RES1 + 30 ? Math.sin(((f - P.RES1) / 30) * Math.PI) : 0}} />
			{hist.length > 0 && <LastPlays lines={hist} p={logP} />}

			{/* wheel 1 */}
			{f >= P.W1_IN && f < (pl.hasW2 ? P.W2_IN + 24 : P.W_OUT + 24) && (
				<div style={{position: 'absolute', left: 1180, top: 120, transform: `translateX(${(1 - backOut((f - P.W1_IN) / 18)) * 800 + wheelOut(pl.hasW2 ? P.W2_IN - 6 : P.W_OUT)}px)`}}>
					<Wheel teams={W1} angle={angle1(pl, f)} size={560} title={'¿QUIÉN ATACA?'} result={f >= P.RES1 ? T[pl.attacker].name : null} resultIso={pl.attacker} resultP={(f - P.RES1) / 12} />
				</div>
			)}
			{/* wheel 2 */}
			{pl.hasW2 && f >= P.W2_IN && f < P.W_OUT + 24 && (
				<div style={{position: 'absolute', left: 1180, top: 120, transform: `translateX(${(1 - backOut((f - P.W2_IN) / 18)) * 800 + wheelOut(P.W_OUT)}px)`}}>
					<ActionWheel angle={angle2(pl, f)} size={560} title={`¿QUÉ HARÁ ${T[pl.attacker].name.toUpperCase()}?`} result={f >= P.RES2 ? (war ? 'ATACAR' : 'REBELIÓN') : null} resultP={(f - P.RES2) / 12} />
				</div>
			)}

			{/* target question */}
			{war && f >= P.TGT0 && f < P.VS_OUT && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: 1 - clamp01((f - P.VS_OUT + 12) / 12)}}>
					<div style={{transform: `scale(${backOut((f - P.TGT0) / 14)})`, padding: '10px 34px', borderRadius: 999, background: '#fff', border: `5px solid ${C.navy}`, fontFamily: LILITA, fontSize: 52, color: C.navy, boxShadow: '0 6px 0 rgba(0,0,0,0.3)'}}>
						¿A QUIÉN ATACA {T[war.a].name.toUpperCase()}?
					</div>
					{f >= P.TGT1 && (
						<div style={{transform: `scale(${backOut((f - P.TGT1) / 14)})`, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 26px', borderRadius: 18, background: C.red, border: `5px solid ${C.navy}`}}>
							<FlagChip iso={war.d} w={52} />
							<span style={{fontFamily: LILITA, fontSize: 44, color: '#fff'}}>{T[war.d].name.toUpperCase()}</span>
						</div>
					)}
				</div>
			)}

			{/* VS card */}
			{war && f >= P.VS_IN && f < P.VS_OUT + 16 && (() => {
				const pin = backOut((f - P.VS_IN) / 18);
				const pout = easeInOut((f - P.VS_OUT) / 14);
				const cnt = easeOut((f - P.VS_IN - 30) / 50);
				const a = Math.round(pA * 100 * cnt), b = Math.round((1 - pA) * 100 * cnt);
				const hh = (war as any).h2h as number[] | undefined;
				const fact = hh ? (hh[0] + hh[1] + hh[2] > 0 ? `Historial real: ${hh[0] + hh[1] + hh[2]} partidos · ${T[war.a].name} ${hh[0]} victorias · ${hh[1]} empates · ${T[war.d].name} ${hh[2]}` : 'Nunca se han enfrentado en un partido oficial') : FACTS[idx];
				const ta = territoriesOf(before, war.a).length, td = territoriesOf(before, war.d).length;
				return (
					<div style={{position: 'absolute', left: 0, right: 0, top: 520, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - pin) * 600 + pout * 700}px)`}}>
						<Panel style={{width: 1120, padding: '18px 36px 22px'}}>
							<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
								<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
									<Hincha iso={hi(war.a)} mood="enfado" size={160} scarf={T[war.a].scarf} look={[0.5, 0]} blink={blinkAt(f, 1)} />
									<div>
										<div style={{fontFamily: LILITA, fontSize: 50, color: '#fff'}}>{T[war.a].name.toUpperCase()}</div>
										<div style={{fontFamily: LILITA, fontSize: 80, color: C.yellow, lineHeight: 0.9}}>{a}%</div>
									</div>
								</div>
								<div style={{fontFamily: LILITA, fontSize: 104, color: C.yellow, ...strokeText(14), textShadow: `0 8px 0 ${C.red}`}}>VS</div>
								<div style={{display: 'flex', alignItems: 'center', gap: 18, flexDirection: 'row-reverse'}}>
									<Hincha iso={hi(war.d)} mood={pA > 0.6 ? 'miedo' : 'enfado'} size={160} scarf={T[war.d].scarf} look={[-0.5, 0]} blink={blinkAt(f, 4)} />
									<div style={{textAlign: 'right'}}>
										<div style={{fontFamily: LILITA, fontSize: 50, color: '#fff'}}>{T[war.d].name.toUpperCase()}</div>
										<div style={{fontFamily: LILITA, fontSize: 80, color: '#FF8A94', lineHeight: 0.9}}>{b}%</div>
									</div>
								</div>
							</div>
							<div style={{position: 'relative', height: 30, borderRadius: 15, overflow: 'hidden', border: `4px solid ${C.navy}`, background: T[war.d].scarf[0], marginTop: 8}}>
								<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${50 + (pA * 100 - 50) * cnt}%`, background: T[war.a].scarf[0], borderRight: `4px solid ${C.navy}`}} />
							</div>
							<div style={{marginTop: 8, display: 'flex', justifyContent: 'space-between', fontFamily: RUBIK, fontWeight: 600, fontSize: 19, color: 'rgba(255,255,255,0.8)'}}>
								<span>n.º {T[war.a].rank} de Europa · {ta} {ta === 1 ? 'territorio' : 'territorios'} · {Math.round(effPts(before, war.a))} Elo</span>
								<span>{Math.round(effPts(before, war.d))} Elo · {td} {td === 1 ? 'territorio' : 'territorios'} · n.º {T[war.d].rank} de Europa</span>
							</div>
							{fact && f >= P.VS_IN + 70 && (
								<div style={{marginTop: 12, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 18px', borderRadius: 14, background: '#FFF6E0', border: `4px solid ${C.navy}`, transform: `scale(${backOut((f - P.VS_IN - 70) / 14)})`}}>
									<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: '#fff', background: '#8E5BD9', padding: '4px 10px', borderRadius: 8, whiteSpace: 'nowrap'}}>DATO REAL</span>
									<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 25, color: C.navy}}>{fact}</span>
								</div>
							)}
						</Panel>
					</div>
				);
			})()}

			{/* scoreboard */}
			{war && f >= P.M0 && f < P.END && <Scoreboard a={war.a} d={war.d} ga={ga} gd={gd} minute={f < P.FW ? minuteRaw : null} p={(f - P.M0) / 16} flashA={lastGoal?.by === 'a' ? Math.max(0, 1 - goalAge / 40) : 0} flashD={lastGoal?.by === 'd' ? Math.max(0, 1 - goalAge / 40) : 0} />}
			{/* goal list */}
			{war && f >= P.M0 && f < P.FW + 40 && scored.length > 0 && (
				<div style={{position: 'absolute', right: 36, top: 150, display: 'flex', flexDirection: 'column', gap: 10, opacity: 1 - clamp01((f - P.FW - 20) / 20)}}>
					{scored.map((g, i) => (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 14, background: 'rgba(11,30,63,0.92)', border: `4px solid ${C.yellow}`, transform: `translateX(${(1 - easeOut((f - goalFrame(pl, g.min)) / 12)) * 300}px)`}}>
							<svg width={30} height={30} viewBox="0 0 200 200"><circle cx={100} cy={100} r={84} fill="#fff" stroke={C.navy} strokeWidth={14} /><polygon points="100,52 128,72 118,104 82,104 72,72" fill={C.navy} /></svg>
							<span style={{fontFamily: LILITA, fontSize: 30, color: C.yellow}}>{g.min}'</span>
							<FlagChip iso={g.by === 'a' ? war.a : war.d} w={42} />
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff'}}>{T[g.by === 'a' ? war.a : war.d].name}</span>
						</div>
					))}
				</div>
			)}
			{/* goal burst */}
			{war && lastGoal && goalAge >= 0 && goalAge < 46 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', transform: `scale(${backOut(goalAge / 12) * (1 - easeInOut((goalAge - 32) / 14))})`}}>
					<div style={{fontFamily: LILITA, fontSize: 170, lineHeight: 1, color: C.yellow, ...strokeText(22), textShadow: `0 12px 0 ${C.red}`}}>¡GOOOL!</div>
					<div style={{display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 8, padding: '8px 24px', borderRadius: 999, background: '#fff', border: `5px solid ${C.navy}`}}>
						<FlagChip iso={lastGoal.by === 'a' ? war.a : war.d} w={50} />
						<span style={{fontFamily: LILITA, fontSize: 44, color: C.navy}}>DE {T[lastGoal.by === 'a' ? war.a : war.d].name.toUpperCase()}</span>
					</div>
				</div>
			)}
			{/* chances */}
			{war && activeCh && (() => {
				const age = f - goalFrame(pl, activeCh.min);
				return (
					<div style={{position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center', transform: `scale(${backOut(age / 10) * (1 - easeInOut((age - 38) / 12))})`}}>
						<Pill size={46} bg={activeCh.kind.includes('AMARILLA') ? C.yellow : '#fff'}>{activeCh.kind}</Pill>
					</div>
				);
			})()}
			{/* final whistle */}
			{war && f >= P.FW && f < P.CARD + 30 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((f - P.FW) / 12) * (1 - easeInOut((f - P.CARD - 16) / 14))})`}}>
					<Pill size={40} bg={C.red} color="#fff">¡FINAL DEL PARTIDO!</Pill>
				</div>
			)}
			{/* red card */}
			{war && loser && f >= P.CARD && f < P.WIPE1 + 10 && (() => {
				const p = backOut((f - P.CARD) / 10);
				const [lx, ly] = labelPt(loser);
				const sx = 960 + (lx - cam.x) * cam.z, sy = 540 + (ly - cam.y) * cam.z;
				return (
					<div style={{position: 'absolute', left: Math.max(80, Math.min(1760, sx - 55)), top: Math.max(160, Math.min(760, sy - 150)), opacity: 1 - clamp01((f - P.WIPE1) / 10), transform: `scale(${p + (1 - p) * 3}) rotate(${12 - 6 * p}deg)`}}>
						<div style={{width: 110, height: 150, borderRadius: 12, background: '#E1251B', border: `6px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}} />
						<div style={{position: 'absolute', left: -90, top: 160, transform: 'rotate(-8deg)', whiteSpace: 'nowrap'}}>
							<Pill size={28} bg="#fff" color={C.red}>{T[loser].name.toUpperCase()} ELIMINADO</Pill>
						</div>
					</div>
				);
			})()}
			{/* rebellion texts */}
			{!war && f >= P.REB0 && f < P.END && (() => {
				const c = (e as any).c as Iso;
				const back = f >= P.WIPE1;
				const p0 = back ? backOut((f - P.WIPE1) / 14) : backOut((f - P.REB0) / 14);
				return (
					<div style={{position: 'absolute', left: 0, right: 0, top: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transform: `scale(${p0})`}}>
						<div style={{fontFamily: LILITA, fontSize: back ? 84 : 110, color: back ? '#fff' : '#C9A7FF', ...strokeText(16), textShadow: `0 10px 0 ${C.navy}`}}>
							{back ? `¡${T[c].name.toUpperCase()} VUELVE A LA PARTIDA!` : `¡REBELIÓN EN ${T[c].name.toUpperCase()}!`}
						</div>
						{!back && <Pill size={30} bg="#8E5BD9" color="#fff">SE INDEPENDIZA DE {T[pl.attacker].name.toUpperCase()}</Pill>}
					</div>
				);
			})()}
			{/* mid-video CTA */}
			{cta && war && f < P.CLK0 + 260 && <div style={{position: 'absolute', left: 40, bottom: 130, opacity: 1 - clamp01((f - P.CLK0 - 240) / 20)}}><Subscribe f={f} start={P.CLK0 + 40} /></div>}
		</AbsoluteFill>
	);
};
