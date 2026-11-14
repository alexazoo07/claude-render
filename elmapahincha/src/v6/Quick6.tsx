import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {MapLayer, Cam, FaceState, labelPt} from './MapLayer6';
import {FlagChip, Iso} from './flagimg6';
import {C, GEO, T, TEAMS, boxOf} from './data6';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, Counter, easeInOut, easeOut, FlagBar, Panel, Pill, strokeText} from './ui6';
import {blinkAt, camPath, Key} from './common6';
import {aliveOf, frontPair, LOG, STATES, territoriesOf, War, winProbO} from './game6';
import {LastPlays, logIso, logLine} from './Round6';

const ORDER = TEAMS.map((t) => t.iso);
const bbox = (isos: Iso[], extra: [number, number][] = []) => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const i of isos) { const b = boxOf(i); x0 = Math.min(x0, b[0][0]); y0 = Math.min(y0, b[0][1]); x1 = Math.max(x1, b[1][0]); y1 = Math.max(y1, b[1][1]); }
	for (const [x, y] of extra) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
	return {x0, y0, x1, y1};
};
const fit = (isos: Iso[], extra: [number, number][] = []): Cam => {
	const b = bbox(isos, extra);
	// Russia / Kazakhstan are huge: frame only around their label point
	if (isos.some((i) => i === 'RUS' || i === 'KAZ')) { const pts = isos.map((i) => labelPt(i)); const bb = {x0: Math.min(...pts.map((p) => p[0])) - 120, x1: Math.max(...pts.map((p) => p[0])) + 120, y0: Math.min(...pts.map((p) => p[1])) - 100, y1: Math.max(...pts.map((p) => p[1])) + 100}; Object.assign(b, bb); }
	const w = b.x1 - b.x0 + 200, h = b.y1 - b.y0 + 160;
	const z = Math.max(0.7, Math.min(2.6, Math.min(1500 / w, 520 / h)));
	return {x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2 + 150 / z, z};
};

// ---------------- records (biggest empire so far) ----------------
const RECORD: (null | {k: Iso; n: number})[] = (() => {
	let best = 3;
	return LOG.map((_, i) => {
		const o = STATES[i + 1];
		let top: {k: Iso; n: number} | null = null;
		for (const k of new Set(Object.values(o))) { const n = territoriesOf(o, k as Iso).length; if (n > best) { best = n; top = {k: k as Iso, n}; } }
		return top;
	});
})();

export const planQuick = (idx: number) => {
	const e = LOG[idx];
	const before = STATES[idx];
	const war = e.t === 'war' ? (e as War) : null;
	const upset = war ? (war.win === war.a) !== (war.p >= 0.5) && Math.min(war.p, 1 - war.p) < 0.35 : false;
	const rec = RECORD[idx];
	const Q: Record<string, number> = {};
	if (war) {
		Q.ARROW = 20; Q.CARD = 26; Q.RES = 96; Q.WIPE0 = 112; Q.WIPE1 = 160; Q.COUNT = 150; Q.LOG = 156;
		Q.END = 206 + (upset ? 60 : 0) + (rec ? 50 : 0);
	} else {
		Q.CARD = 30; Q.WIPE0 = 96; Q.WIPE1 = 146; Q.COUNT = 140; Q.LOG = 146; Q.RES = 96; Q.ARROW = 0;
		Q.END = 230;
	}
	const front: [Iso, Iso] = war ? frontPair(before, war.a, war.d) : [(e as any).c, (e as any).c];
	const cam = war ? fit([front[0], front[1]], [labelPt(war.a), labelPt(war.d)]) : fit([(e as any).c]);
	return {idx, e, war, before, after: STATES[idx + 1], upset, rec, Q, front, cam};
};

export const quickSfx = (pl: ReturnType<typeof planQuick>) => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f, name, vol});
	const {Q, war} = pl;
	S(0, 'whoosh_' + ((pl.idx % 4) + 1), 0.3);
	if (war) {
		S(Q.CARD, `pop_${(pl.idx % 4) + 1}`, 0.4); S(Q.ARROW + 6, 'whoosh_3', 0.25);
		for (let k = 0; k < 4; k++) S(Q.CARD + 20 + k * 12, 'tick', 0.18);
		S(Q.RES - 18, 'kick', 0.45); S(Q.RES, 'crowd_roar', 0.38); S(Q.RES + 2, 'slap', 0.45);
		if (pl.upset) { S(Q.RES + 6, 'crowd_ohh', 0.5); S(Q.RES + 8, 'boom', 0.45); }
		S(Q.WIPE0, 'whoosh_2', 0.35); S(Q.COUNT, 'confirm', 0.35); S(Q.LOG, 'click', 0.3);
	} else {
		S(Q.CARD, 'drumroll', 0.4); S(Q.WIPE0, 'glass', 0.45); S(Q.WIPE0 + 2, 'boom', 0.4); S(Q.WIPE0 + 4, 'crowd_roar', 0.35); S(Q.COUNT, 'confirm', 0.35);
	}
	if (pl.rec) { S(Q.END - 60, 'riser', 0.25); S(Q.END - 44, 'pop_4', 0.4); }
	return s;
};

export const QuickWar: React.FC<{idx: number; start: Cam; total: number}> = ({idx, start, total}) => {
	const f = useCurrentFrame();
	const pl = planQuick(idx);
	const {e, war, before, after, Q, front} = pl;
	const loser = war ? (war.win === war.a ? war.d : war.a) : null;
	const keys: Key[] = [[0, start.x, start.y, start.z], [36, pl.cam.x, pl.cam.y, pl.cam.z], [Q.END, pl.cam.x, pl.cam.y, pl.cam.z * 1.05]];
	const cam = camPath(keys, f, idx + 7);
	const owners = f >= Q.WIPE1 ? after : before;
	const conquest = f >= Q.WIPE0 && f < Q.WIPE1 ? (() => {
		if (war && loser) {
			const from = GEO.teams[war.win === war.a ? front[0] : front[1]].c as [number, number];
			const ls = territoriesOf(before, loser);
			let r = 0;
			for (const c of ls) { const b = GEO.teams[c].b; for (const [x, y] of [[b[0][0], b[0][1]], [b[1][0], b[1][1]], [b[0][0], b[1][1]], [b[1][0], b[0][1]]]) r = Math.max(r, Math.hypot(x - from[0], y - from[1])); }
			return {countries: ls, to: war.win, p: easeInOut((f - Q.WIPE0) / (Q.WIPE1 - Q.WIPE0)), from, radius: Math.min(r + 20, 2600)};
		}
		const c = (e as any).c as Iso; const b = GEO.teams[c].b;
		return {countries: [c], to: c, p: easeInOut((f - Q.WIPE0) / (Q.WIPE1 - Q.WIPE0)), from: GEO.teams[c].c as [number, number], radius: Math.hypot(b[1][0] - b[0][0], b[1][1] - b[0][1])};
	})() : null;

	const faces: Partial<Record<Iso, FaceState>> = {};
	aliveOf(owners).forEach((o, i) => {
		let mood: FaceState['mood'] = 'feliz', scale = 1;
		const [lx, ly] = labelPt(o);
		const dx = pl.cam.x - lx, dy = pl.cam.y - ly, dl = Math.hypot(dx, dy) || 1;
		if (war) {
			if (o === war.a && f < Q.RES) mood = 'enfado';
			if (o === war.d && f < Q.RES) mood = 'miedo';
			if (f >= Q.RES && o === war.win) { mood = 'grito'; scale = 1.15; }
			if (f >= Q.RES && o === loser) { mood = 'ko'; if (f >= Q.WIPE0 + 6) { if (f >= Q.WIPE0 + 30) return; scale = 1 - (f - Q.WIPE0 - 6) / 24; } }
		} else if (o === (e as any).a && f >= Q.CARD) mood = f >= Q.WIPE0 ? 'triste' : 'miedo';
		faces[o] = {mood, blink: mood === 'ko' ? 0 : blinkAt(f, ORDER.indexOf(o)), open: 0.5 + 0.5 * Math.sin(f / 4 + i), look: [dx / dl, dy / dl], scale};
	});
	if (!war && f >= Q.WIPE1 - 6) { const c = (e as any).c as Iso; faces[c] = {mood: 'grito', open: 0.5 + 0.5 * Math.sin(f / 4), scale: backOut((f - Q.WIPE1 + 6) / 16)}; }

	const highlight: Partial<Record<Iso, number>> = {};
	if (war && f < Q.WIPE0) for (const c of territoriesOf(before, war.d)) highlight[c] = 0.45 + 0.35 * Math.sin(f / 5);
	if (!war && f < Q.WIPE1) highlight[(e as any).c] = 0.5 + 0.5 * Math.sin(f / 3.5);

	const A = GEO.teams[front[0]].c as [number, number], B = GEO.teams[front[1]].c as [number, number];
	const mx = (A[0] + B[0]) / 2 - (B[1] - A[1]) * 0.3, my = (A[1] + B[1]) / 2 + (B[0] - A[0]) * 0.3;
	const arrowP = clamp01((f - Q.ARROW) / 30);

	const count = aliveOf(f >= Q.COUNT ? after : before).length;
	const hist = LOG.slice(0, f >= Q.LOG ? idx + 1 : idx).map((x) => [logIso(x), logLine(x)] as [Iso, string]).reverse().slice(0, 3);
	const pA = war ? winProbO(before, war.a, war.d) : 0;
	const pin = backOut((f - Q.CARD) / 16), pout = easeInOut((f - Q.END + 18) / 16);
	const hh = war ? ((war as any).h2h as number[]) : null;
	const ta = war ? territoriesOf(before, war.a).length : 0, td = war ? territoriesOf(before, war.d).length : 0;
	const ga = war ? (war.win === war.a ? war.s[0] : war.s[1]) : 0, gd = war ? (war.win === war.a ? war.s[1] : war.s[0]) : 0;

	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			<MapLayer cam={cam} owners={owners} faces={faces} highlight={highlight} conquest={conquest}>
				{war && f < Q.WIPE1 && (
					<g opacity={1 - clamp01((f - Q.WIPE0) / 20)}>
						<path d={`M${A[0]} ${A[1]} Q${mx} ${my} ${B[0]} ${B[1]}`} fill="none" stroke={C.navy} strokeWidth={14 / cam.z} strokeLinecap="round" pathLength={1} strokeDasharray={`${arrowP} 1`} />
						<path d={`M${A[0]} ${A[1]} Q${mx} ${my} ${B[0]} ${B[1]}`} fill="none" stroke={C.red} strokeWidth={8 / cam.z} strokeLinecap="round" pathLength={1} strokeDasharray={`${arrowP} 1`} />
					</g>
				)}
			</MapLayer>
			<Counter value={count} total={TEAMS.length} flash={f >= Q.COUNT ? Math.max(0, 1 - (f - Q.COUNT) / 24) : 0} />
			<div style={{position: 'absolute', left: 36, top: 214, padding: '8px 18px', borderRadius: 14, background: '#2F7DE1', border: `4px solid ${C.navy}`, boxShadow: '0 5px 0 rgba(0,0,0,0.35)', fontFamily: RUBIK, fontWeight: 800, fontSize: 20, letterSpacing: 2, color: '#fff'}}>GUERRA {idx + 1} · RELÁMPAGO</div>
			<FlagBar alive={Object.fromEntries(ORDER.map((i) => [i, aliveOf(f >= Q.COUNT ? after : before).includes(i)]))} pulse={war ? {[war.win]: f >= Q.RES && f < Q.RES + 30 ? Math.sin(((f - Q.RES) / 30) * Math.PI) : 0} : {}} />
			{hist.length > 0 && <LastPlays lines={hist} p={1} />}

			{/* duel card */}
			{war && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - pin) * 500 + pout * 500}px)`}}>
					<Panel style={{width: 1180, padding: '14px 28px 14px', borderColor: pl.upset && f >= Q.RES ? '#FF8A3D' : C.yellow}}>
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
							{[war.a, war.d].map((k, j) => {
								const won = f >= Q.RES && k === war.win;
								const lost = f >= Q.RES && k !== war.win;
								const pct = Math.round((j === 0 ? pA : 1 - pA) * 100 * easeOut((f - Q.CARD - 14) / 50));
								return (
									<div key={k} style={{display: 'flex', alignItems: 'center', gap: 14, flexDirection: j ? 'row-reverse' : 'row', width: 430, opacity: lost ? 0.55 : 1}}>
										<FlagChip iso={k} w={92} style={{boxShadow: won ? `0 0 0 4px ${C.navy}, 0 0 18px #FFD23F` : '0 0 0 4px #0B1E3F'}} />
										<div style={{textAlign: j ? 'right' : 'left'}}>
											<div style={{fontFamily: LILITA, fontSize: 44, lineHeight: 1, color: '#fff', whiteSpace: 'nowrap'}}>{T[k].name.toUpperCase()}</div>
											<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 17, color: 'rgba(255,255,255,0.75)', marginTop: 4, whiteSpace: 'nowrap'}}>n.º {T[k].rank} · {j ? td : ta} {(j ? td : ta) === 1 ? 'territorio' : 'territorios'}</div>
										</div>
										<div style={{fontFamily: LILITA, fontSize: 54, color: j ? '#FF8A94' : C.yellow, marginLeft: j ? 0 : 'auto', marginRight: j ? 'auto' : 0}}>{pct}%</div>
									</div>
								);
							})}
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 14, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
							{f < Q.RES ? (
								<div style={{fontFamily: LILITA, fontSize: 70, color: C.yellow, ...strokeText(10), textShadow: `0 6px 0 ${C.red}`, transform: `scale(${1 + 0.05 * Math.sin(f / 4)})`}}>VS</div>
							) : (
								<div style={{transform: `scale(${backOut((f - Q.RES) / 10)})`, display: 'flex', alignItems: 'center', gap: 10, padding: '4px 20px', borderRadius: 14, background: '#fff', border: `5px solid ${C.navy}`, fontFamily: LILITA, fontSize: 56, color: C.navy}}>{ga} - {gd}</div>
							)}
						</div>
						<div style={{position: 'relative', height: 18, borderRadius: 9, overflow: 'hidden', border: `3px solid ${C.navy}`, background: T[war.d].scarf[0], marginTop: 10}}>
							<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${50 + (pA * 100 - 50) * easeOut((f - Q.CARD - 14) / 50)}%`, background: T[war.a].scarf[0], borderRight: `3px solid ${C.navy}`}} />
						</div>
						<div style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 12, opacity: clamp01((f - Q.CARD - 30) / 12)}}>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, letterSpacing: 2, color: '#fff', background: '#8E5BD9', padding: '3px 9px', borderRadius: 7, whiteSpace: 'nowrap'}}>HISTORIAL REAL</span>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 21, color: '#fff', whiteSpace: 'nowrap'}}>
								{hh && hh[0] + hh[1] + hh[2] > 0 ? `${hh[0] + hh[1] + hh[2]} partidos: ${T[war.a].name} ${hh[0]} victorias · ${hh[1]} empates · ${T[war.d].name} ${hh[2]}` : 'Nunca se han enfrentado en un partido oficial'}
							</span>
						</div>
					</Panel>
				</div>
			)}
			{war && pl.upset && f >= Q.RES && f < Q.END - 20 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 190, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((f - Q.RES - 4) / 12)}) rotate(-4deg)`}}>
					<div style={{fontFamily: LILITA, fontSize: 80, color: '#fff', ...strokeText(14), textShadow: `0 8px 0 #FF8A3D`}}>¡SORPRESA! SOLO TENÍA UN {Math.round((war.win === war.a ? pA : 1 - pA) * 100)} %</div>
				</div>
			)}
			{war && f >= Q.RES && f < Q.WIPE1 + 30 && !pl.upset && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 130, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((f - Q.RES) / 12) * (1 - easeInOut((f - Q.WIPE1 - 10) / 20))})`}}>
					<Pill size={38} bg={C.yellow}>{T[war.win].name.toUpperCase()} CONQUISTA {T[loser!].name.toUpperCase()}</Pill>
				</div>
			)}
			{!war && f >= Q.CARD && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transform: `scale(${backOut((f - Q.CARD) / 14) * (1 - easeInOut((f - Q.END + 20) / 16))})`}}>
					<div style={{fontFamily: LILITA, fontSize: 104, color: f >= Q.WIPE1 ? '#fff' : '#C9A7FF', ...strokeText(16), textShadow: `0 10px 0 ${C.navy}`}}>{f >= Q.WIPE1 ? `¡${T[(e as any).c].name.toUpperCase()} VUELVE A LA PARTIDA!` : `¡REBELIÓN EN ${T[(e as any).c].name.toUpperCase()}!`}</div>
					<Pill size={30} bg="#8E5BD9" color="#fff">SE INDEPENDIZA DE {T[(e as any).a].name.toUpperCase()}</Pill>
				</div>
			)}
			{pl.rec && f >= Q.END - 50 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 220, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((f - Q.END + 50) / 12) * (1 - easeInOut((f - Q.END + 10) / 10))})`}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 26px', borderRadius: 18, background: '#2EC46B', border: `5px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
						<FlagChip iso={pl.rec.k} w={60} />
						<span style={{fontFamily: LILITA, fontSize: 40, color: '#fff', ...strokeText(6)}}>NUEVO MAYOR IMPERIO: {pl.rec.n} TERRITORIOS</span>
					</div>
				</div>
			)}
		</AbsoluteFill>
	);
};
