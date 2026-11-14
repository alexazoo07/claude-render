import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {WorldLayer, Vis, WCam} from './WorldLayer';
import {Eyes, Hincha, Mood, Mouth} from '../Hincha';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {C} from '../data';
import {backOut, clamp01, easeInOut, easeOut, elastic, Panel, Pill, strokeText} from '../ui';
import {blinkAt, camPath, Key, StadiumVS, Subscribe} from '../common';
import {FlagPreload} from './Preload';
import {bboxOf, CONF_ES, NEVER, Rival, ST_COL, ST_TXT, TOTALS, TOUR, WORLD, St} from './data2';

const FPS = 60;
const ARGK = 'ARG';
const ARG_FLAG = 'ar';

// ---------------- timeline ----------------
type Item = {kind: 'intro' | 'region' | 'rival' | 'final' | 'outro'; from: number; dur: number; r?: Rival; conf?: string; i?: number};
const INTRO = 900;
const REGION = 150;
const FINAL = 2160;
const OUTRO = 840;
const rivalDur = (r: Rival) => {
	let d = 215 + Math.min(150, 45 * Math.log2(r.p + 1));
	if (r.st === 'never') d += 150;
	if (r.st === 'neg') d += 90;
	if (r.fact2) d += 40;
	return Math.round(d);
};
export const ITEMS: Item[] = (() => {
	const out: Item[] = [];
	let t = 0;
	const push = (it: Omit<Item, 'from'>) => { out.push({...it, from: t}); t += it.dur; };
	push({kind: 'intro', dur: INTRO});
	let conf = '';
	TOUR.forEach((r, i) => {
		if (r.conf !== conf) { conf = r.conf; push({kind: 'region', dur: REGION, conf}); }
		push({kind: 'rival', dur: rivalDur(r), r, i});
	});
	push({kind: 'final', dur: FINAL});
	push({kind: 'outro', dur: OUTRO});
	return out;
})();
export const V2_TOTAL = ITEMS.reduce((a, b) => a + b.dur, 0);
const RIVAL_ITEMS = ITEMS.filter((x) => x.kind === 'rival');
const P_STATUS = 110;
const statusFrame = (it: Item) => it.from + P_STATUS;

// ---------------- camera ----------------
const fitRival = (k: string): WCam => {
	const b = bboxOf(k);
	const z = Math.max(0.42, Math.min(5.5, Math.min(1000 / (b.w + 40), 430 / (b.h + 30))));
	return {x: b.cx, y: b.cy + 120 / z, z};
};
const REGION_VIEW: Record<string, WCam> = {
	CONMEBOL: {x: 1280, y: 1300, z: 0.95},
	CONCACAF: {x: 1000, y: 780, z: 0.9},
	UEFA: {x: 2010, y: 520, z: 1.25},
	CAF: {x: 2050, y: 1030, z: 0.85},
	AFC: {x: 3000, y: 800, z: 0.62},
};
const WORLD_VIEW: WCam = {x: 1915, y: 880, z: 0.5};
const KEYS_CAM: Key[] = (() => {
	const k: Key[] = [];
	const add = (f: number, c: WCam) => k.push([f, c.x, c.y, c.z]);
	add(0, {x: 1915, y: 880, z: 0.36});
	add(150, {x: 1915, y: 880, z: 0.38});
	add(250, {x: 1915, y: 780, z: 0.5});
	add(420, {x: 1960, y: 780, z: 0.54});
	add(INTRO - 10, {x: 1700, y: 1000, z: 0.55});
	for (const it of ITEMS) {
		if (it.kind === 'region') {
			const v = REGION_VIEW[it.conf!];
			add(it.from + 60, v);
			add(it.from + it.dur, {...v, z: v.z * 1.04});
		}
		if (it.kind === 'rival') {
			const c = fitRival(it.r!.key);
			add(it.from + 46, c);
			add(it.from + it.dur, {...c, z: c.z * 1.05});
		}
		if (it.kind === 'final') {
			add(it.from + 80, WORLD_VIEW);
			add(it.from + it.dur, {...WORLD_VIEW, z: WORLD_VIEW.z * 1.04});
		}
		if (it.kind === 'outro') {
			add(it.from + 60, {x: 1500, y: 1000, z: 0.62});
			add(it.from + it.dur, {x: 1500, y: 1000, z: 0.64});
		}
	}
	return k;
})();

// ---------------- sfx ----------------
export const v2Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f, name, vol});
	// intro
	S(0, 'glitch', 0.5); S(6, 'slap', 0.55); S(8, 'boom', 0.45); S(40, 'boom', 0.6); S(42, 'crowd_ohh', 0.5); S(46, 'slap', 0.5);
	S(100, 'whoosh_2', 0.4); S(104, 'error', 0.35); S(140, 'whoosh_4', 0.5); S(150, 'glitch', 0.3);
	for (let k = 0; k < 14; k++) S(160 + k * 5, 'tick', 0.3);
	S(232, 'confirm', 0.45); S(244, 'slap', 0.45); S(248, 'error', 0.35);
	NEVER.forEach((_, i) => { S(262 + i * 16, 'drop', 0.45); S(264 + i * 16, 'boom', 0.18); });
	S(345, 'pop_2', 0.45); S(372, 'pop_3', 0.4);
	S(420, 'whoosh_1', 0.4); S(424, 'slap', 0.5); S(436, 'whistle_long', 0.3); S(480, 'click', 0.45);
	S(660, 'whoosh_2', 0.4); [0, 1, 2, 3].forEach((i) => S(690 + i * 26, `pop_${i + 1}`, 0.42)); S(820, 'riser', 0.35);
	for (const it of ITEMS) {
		if (it.kind === 'region') { S(it.from, 'whoosh_4', 0.45); S(it.from + 40, 'slap', 0.45); S(it.from + 46, 'whistle_short', 0.25); }
		if (it.kind === 'rival') {
			const r = it.r!;
			S(it.from, 'whoosh_' + ((it.i! % 4) + 1), 0.32); S(it.from + 24, `pop_${(it.i! % 4) + 1}`, 0.42); S(it.from + 34, 'whoosh_3', 0.2);
			for (let k = 0; k < 5; k++) S(it.from + 52 + k * 11, 'tick', 0.22);
			if (r.st === 'never') { S(it.from + P_STATUS - 70, 'drumroll', 0.4); S(statusFrame(it), 'boom', 0.55); S(statusFrame(it) + 2, 'crowd_ohh', 0.45); S(statusFrame(it) + 4, 'error', 0.4); }
			else if (r.st === 'neg') { S(statusFrame(it), 'error', 0.45); S(statusFrame(it) + 2, 'crowd_ohh', 0.35); }
			else if (r.st === 'even') S(statusFrame(it), 'drop', 0.45);
			else { S(statusFrame(it), 'confirm', 0.42); if (r.p >= 20) S(statusFrame(it) + 2, 'crowd_roar', 0.25); }
			S(it.from + 132, 'click', 0.3);
			S(it.from + it.dur - 22, 'whoosh_1', 0.22);
		}
		if (it.kind === 'final') {
			const f0 = it.from;
			S(f0, 'whoosh_4', 0.5); S(f0 + 30, 'slap', 0.5); S(f0 + 120, 'riser', 0.4); S(f0 + 180, 'boom', 0.45); [0, 1, 2, 3].forEach((i) => S(f0 + 240 + i * 24, 'click', 0.45));
			S(f0 + 600, 'whoosh_2', 0.4); S(f0 + 640, 'slap', 0.4);
			S(f0 + 840, 'drumroll', 0.45); S(f0 + 930, 'boom', 0.55); NEVER.forEach((_, i) => S(f0 + 960 + i * 40, `pop_${(i % 4) + 1}`, 0.45));
			S(f0 + 1500, 'whoosh_3', 0.45); S(f0 + 1536, 'boom', 0.6); S(f0 + 1538, 'crowd_roar', 0.5); S(f0 + 1600, 'slap', 0.4);
		}
		if (it.kind === 'outro') { S(it.from, 'whoosh_2', 0.4); S(it.from + 20, 'slap', 0.45); [0, 1, 2].forEach((i) => S(it.from + 70 + i * 14, `pop_${i + 1}`, 0.4)); S(it.from + 300, 'pop_4', 0.4); S(it.from + 350, 'click', 0.5); S(it.from + 352, 'bong', 0.35); }
	}
	return s;
};

// ---------------- helpers ----------------
const moodFor = (st: St): Mood => (st === 'dom' ? 'grito' : st === 'even' ? 'miedo' : st === 'neg' ? 'enfado' : 'triste');
const rivalMood = (st: St): Mood => (st === 'dom' ? 'miedo' : st === 'even' ? 'enfado' : st === 'neg' ? 'feliz' : 'grito');
const Count: React.FC<{v: number; p: number}> = ({v, p}) => <>{Math.round(v * easeOut(p))}</>;

const StatBox: React.FC<{label: string; v: number; p: number; col: string}> = ({label, v, p, col}) => (
	<div style={{width: 128, padding: '6px 0 8px', borderRadius: 16, background: 'rgba(255,255,255,0.08)', border: `3px solid ${col}`, textAlign: 'center'}}>
		<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 17, letterSpacing: 2, color: col}}>{label}</div>
		<div style={{fontFamily: LILITA, fontSize: 54, lineHeight: 1, color: '#fff'}}><Count v={v} p={p} /></div>
	</div>
);

const RivalCard: React.FC<{r: Rival; t: number; dur: number}> = ({r, t, dur}) => {
	const pin = backOut((t - 34) / 18), pout = easeInOut((t - dur + 20) / 16);
	const cp = clamp01((t - 50) / 60);
	const sp = backOut((t - P_STATUS) / 14);
	const total = r.p;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 742, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - pin) * 400 + pout * 400}px)`}}>
			<Panel style={{width: 1060, padding: '14px 26px 16px', borderColor: t >= P_STATUS ? ST_COL[r.st] : C.yellow}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
					<img src={staticFile(`flags/${r.flag}.svg`)} style={{width: 96, height: 72, borderRadius: 10, border: `4px solid ${C.navy}`, objectFit: 'cover', boxShadow: '0 0 0 3px #fff'}} />
					<div style={{flex: 1}}>
						<div style={{fontFamily: LILITA, fontSize: 56, lineHeight: 1, color: '#fff', whiteSpace: 'nowrap'}}>{r.es.toUpperCase()}</div>
						<div style={{fontFamily: RUBIK, fontWeight: 600, fontSize: 19, color: 'rgba(255,255,255,0.75)', marginTop: 4}}>Argentina contra {r.es} · desde {r.first.slice(0, 4)}</div>
					</div>
					<StatBox label="PARTIDOS" v={r.p} p={cp} col="#fff" />
					<StatBox label="GANA" v={r.w} p={cp} col={ST_COL.dom} />
					<StatBox label="EMPATA" v={r.d} p={cp} col={ST_COL.even} />
					<StatBox label="PIERDE" v={r.l} p={cp} col={ST_COL.never} />
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 12}}>
					<div style={{flex: 1, height: 22, borderRadius: 11, overflow: 'hidden', display: 'flex', border: `3px solid ${C.navy}`, background: 'rgba(255,255,255,0.1)'}}>
						<div style={{width: `${(r.w / total) * 100 * easeOut(cp)}%`, background: ST_COL.dom}} />
						<div style={{width: `${(r.d / total) * 100 * easeOut(cp)}%`, background: ST_COL.even}} />
						<div style={{width: `${(r.l / total) * 100 * easeOut(cp)}%`, background: ST_COL.never}} />
					</div>
					{t >= P_STATUS && (
						<div style={{transform: `scale(${sp})`, padding: '6px 18px', borderRadius: 12, background: ST_COL[r.st], border: `4px solid ${C.navy}`, fontFamily: LILITA, fontSize: 30, color: r.st === 'even' ? C.navy : '#fff', whiteSpace: 'nowrap'}}>{ST_TXT[r.st]}</div>
					)}
				</div>
				{t >= 130 && (
					<div style={{marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6, opacity: clamp01((t - 130) / 10)}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 16, letterSpacing: 2, color: '#fff', background: '#8E5BD9', padding: '3px 9px', borderRadius: 7}}>DATO</span>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 23, color: '#fff'}}>{r.fact}</span>
						</div>
						{r.fact2 && t >= 160 && (
							<div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: clamp01((t - 160) / 10)}}>
								<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 16, letterSpacing: 2, color: '#fff', background: '#2F7DE1', padding: '3px 9px', borderRadius: 7}}>DATO</span>
								<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 23, color: '#fff'}}>{r.fact2}</span>
							</div>
						)}
					</div>
				)}
			</Panel>
		</div>
	);
};

// ---------------- main ----------------
export const Video2: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS_CAM, f, 7);
	const cur = ITEMS.find((it) => f >= it.from && f < it.from + it.dur) ?? ITEMS[ITEMS.length - 1];
	const t = f - cur.from;
	const finalIt = ITEMS.find((x) => x.kind === 'final')!;
	const inFinal = f >= finalIt.from;
	const ft = f - finalIt.from;

	// visited
	const vis: Record<string, Vis> = {};
	const revealed: Rival[] = [];
	for (const it of RIVAL_ITEMS) {
		const r = it.r!;
		const tp = f - (it.from + 24);
		if (tp < 0) continue;
		if (f >= statusFrame(it)) revealed.push(r);
		const isCur = cur === it;
		let mood: Mood = 'feliz';
		let look: [number, number] = [0, 0];
		if (isCur && t >= P_STATUS - 30) mood = rivalMood(r.st);
		if (inFinal && ft >= 840 && ft < 1500) mood = r.st === 'never' ? 'grito' : 'feliz';
		let colorMix = 0;
		if (inFinal && ft >= 150) colorMix = clamp01((ft - 150) / 60) * 0.85;
		if (inFinal && ft >= 840 && ft < 1500 && r.st !== 'never') colorMix = 0.85;
		vis[r.key] = {flag: r.flag, pop: Math.max(0, elastic(tp / FPS)), mood, look, blink: blinkAt(f, it.i!), open: 0.5 + 0.5 * Math.sin(f / 4 + it.i!), color: ST_COL[r.st], colorMix, faceScale: isCur ? 1.15 : 1};
	}
	// Argentina always on map
	vis[ARGK] = {flag: ARG_FLAG, pop: f < 150 ? 0 : Math.max(0, elastic((f - 150) / FPS)), mood: cur.kind === 'rival' && t >= P_STATUS ? moodFor(cur.r!.st) : 'feliz', blink: blinkAt(f, 99), open: 0.5 + 0.5 * Math.sin(f / 4), faceScale: 1.1, look: cur.kind === 'rival' ? (() => {
		const [ax, ay] = WORLD[ARGK].c; const [bx, by] = WORLD[cur.r!.key].c; const dl = Math.hypot(bx - ax, by - ay) || 1; return [(bx - ax) / dl, (by - ay) / dl] as [number, number];
	})() : [0, 0]};

	const counts = {dom: 0, even: 0, neg: 0, never: 0} as Record<St, number>;
	let W = 0, D = 0, L = 0;
	revealed.forEach((r) => { counts[r.st]++; W += r.w; D += r.d; L += r.l; });

	// intro silhouettes (the 6)
	const silhouettes: {key: string; p: number}[] = [];
	const ring = cur.kind === 'rival' && t > 20 ? {key: cur.r!.key, p: Math.min(clamp01((t - 20) / 12), 1 - clamp01((t - cur.dur + 20) / 14)), color: t >= P_STATUS ? ST_COL[cur.r!.st] : C.yellow} : null;

	const hudIn = easeOut((f - 700) / 30);
	const showHud = f >= 700 && !(inFinal && ft >= 60) ;
	const log = revealed.slice(-5).reverse();
	const totalRiv = TOUR.length;

	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			<FlagPreload />
			<WorldLayer cam={cam} vis={vis} ring={ring} silhouettes={silhouettes}>
				{f >= 255 && f < 450 && NEVER.map((r, i) => {
					const b = bboxOf(r.key);
					const d = f - 262 - i * 16;
					if (d < -8) return null;
					const drop = d < 0 ? -1 : 1 - Math.min(1, Math.max(0, d) / 10);
					const sq = d >= 10 && d < 18 ? 1 - 0.18 * Math.sin(((d - 10) / 8) * Math.PI) : 1;
					const k = 0.8 / cam.z;
					const fade = 1 - clamp01((f - 420) / 24);
					const known = r.key === 'CMR';
					return (
						<g key={'pin' + r.key} transform={`translate(${b.cx} ${b.cy - drop * 300 * k}) scale(${k})`} opacity={fade * (d < 0 ? 0 : 1)}>
							<ellipse cx={0} cy={2} rx={16} ry={6} fill="#000" opacity={0.35} />
							<g transform={`scale(${1 / sq} ${sq})`}>
								<path d="M0 0 C -16 -24 -34 -40 -34 -64 A34 34 0 1 1 34 -64 C 34 -40 16 -24 0 0 Z" fill="#E63946" stroke="#0B1E3F" strokeWidth={5} />
								<circle cx={0} cy={-64} r={24} fill="#fff" stroke="#0B1E3F" strokeWidth={3} />
								{known ? (
									<>
										<clipPath id={'pc' + r.key}><circle cx={0} cy={-64} r={22} /></clipPath>
										<image href={staticFile(`flags/${r.flag}.svg`)} x={-30} y={-86} width={60} height={44} preserveAspectRatio="xMidYMid slice" clipPath={`url(#pc${r.key})`} />
									</>
								) : (
									<text x={0} y={-50} textAnchor="middle" fontFamily="Lilita" fontSize={40} fill="#0B1E3F">?</text>
								)}
							</g>
						</g>
					);
				})}
				{inFinal && ft >= 900 && ft < 1500 && NEVER.map((r, i) => {
					const b = bboxOf(r.key);
					const p = clamp01((ft - 960 - i * 40) / 14);
					return <circle key={r.key} cx={b.cx} cy={b.cy} r={(Math.max(b.w, b.h) * 0.7 + 14) * (1 + 0.08 * Math.sin(f / 6))} fill="none" stroke="#E63946" strokeWidth={6 / cam.z} opacity={p} />;
				})}
			</WorldLayer>

			{/* ---------- INTRO (cold open: the 1990 shock) ---------- */}
			{f < 160 && (
				<AbsoluteFill style={{opacity: 1 - clamp01((f - 140) / 18)}}>
					<ColdOpen f={f} />
				</AbsoluteFill>
			)}
			{f >= 136 && f < 160 && <AbsoluteFill style={{background: '#fff', opacity: 0.85 * Math.sin(clamp01((f - 136) / 24) * Math.PI)}} />}
			{f >= 150 && f < 440 && (
				<div style={{position: 'absolute', right: 50, top: 600, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, opacity: 1 - clamp01((f - 410) / 24)}}>
					<div style={{transform: `scale(${backOut((f - 156) / 14)})`, display: 'flex', alignItems: 'baseline', gap: 18}}>
						<span style={{fontFamily: LILITA, fontSize: 130, lineHeight: 1, color: ST_COL.dom, ...strokeText(16)}}>{Math.round(TOTALS.w * easeOut((f - 160) / 72))}</span>
						<span style={{fontFamily: LILITA, fontSize: 64, color: '#fff', ...strokeText(12)}}>VICTORIAS</span>
					</div>
					{f >= 244 && (
						<div style={{transform: `scale(${backOut((f - 244) / 14)})`, display: 'flex', alignItems: 'baseline', gap: 18}}>
							<span style={{fontFamily: LILITA, fontSize: 64, color: '#fff', ...strokeText(12)}}>...Y</span>
							<span style={{fontFamily: LILITA, fontSize: 130, lineHeight: 1, color: ST_COL.never, ...strokeText(16)}}>0</span>
							<span style={{fontFamily: LILITA, fontSize: 64, color: '#fff', ...strokeText(12)}}>CONTRA ESTAS 6</span>
						</div>
					)}
				</div>
			)}
			{f >= 345 && f < 440 && (
				<div style={{position: 'absolute', left: 50, top: 60, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, opacity: 1 - clamp01((f - 410) / 24)}}>
					<div style={{transform: `scale(${backOut((f - 345) / 14)})`, transformOrigin: 'left center', fontFamily: LILITA, fontSize: 80, color: '#fff', ...strokeText(14)}}>¿ADIVINAS LAS OTRAS 5?</div>
					{f >= 372 && <div style={{transform: `scale(${backOut((f - 372) / 12)})`}}><Pill size={28} bg={C.yellow}>DÉJALO EN LOS COMENTARIOS ANTES DE VERLAS</Pill></div>}
				</div>
			)}
			{f >= 420 && f < 690 && (() => {
				const pin = backOut((f - 420) / 16), pout = easeInOut((f - 660) / 22);
				return (
					<div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center', transform: `translateY(${pout * -900}px) scale(${pin}) rotate(${-2 - pout * 6}deg)`}}>
						<div style={{background: '#FFF6E0', border: `7px solid ${C.navy}`, borderRadius: 34, padding: '26px 64px 32px', boxShadow: '0 16px 0 rgba(0,0,0,0.35)', textAlign: 'center'}}>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: C.red}}>EL MAPA HINCHA</div>
							<div style={{fontFamily: LILITA, fontSize: 92, lineHeight: 1.0, color: C.navy, marginTop: 6}}>¿A QUÉ SELECCIONES</div>
							<div style={{fontFamily: LILITA, fontSize: 92, lineHeight: 1.0, color: C.red}}>NUNCA HA GANADO</div>
							<div style={{fontFamily: LILITA, fontSize: 92, lineHeight: 1.0, color: '#4FA3E3', WebkitTextStroke: `4px ${C.navy}`, paintOrder: 'stroke fill'}}>ARGENTINA?</div>
							<div style={{marginTop: 16, transform: `scale(${backOut((f - 480) / 14)})`}}><Pill size={28}>TODOS SUS RIVALES, UNO A UNO</Pill></div>
						</div>
					</div>
				);
			})()}
			{f >= 680 && f < 900 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: 1 - clamp01((f - 870) / 24)}}>
					<div style={{display: 'flex', gap: 18}}>
						{(['dom', 'even', 'neg', 'never'] as St[]).map((s, i) => (
							<div key={s} style={{transform: `scale(${backOut((f - 690 - i * 26) / 14)})`, padding: '12px 26px', borderRadius: 16, background: ST_COL[s], border: `5px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.3)', fontFamily: LILITA, fontSize: 40, color: s === 'even' ? C.navy : '#fff'}}>{ST_TXT[s]}</div>
						))}
					</div>
					<div style={{transform: `scale(${backOut((f - 800) / 14)})`}}><Pill size={32} bg={C.red} color="#fff">Y AL FINAL... SU GRAN BESTIA NEGRA</Pill></div>
				</div>
			)}

			{/* ---------- HUD ---------- */}
			{showHud && (
				<>
					<div style={{position: 'absolute', left: 28, top: 26, transform: `translateX(${(1 - hudIn) * -400}px)`}}>
						<Panel style={{width: 250, padding: '10px 12px 14px', borderColor: '#9FD0FF', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<Hincha iso="ARG" mood={(vis[ARGK].mood ?? 'feliz') as Mood} size={170} scarf={['#74ACDF', '#FFFFFF']} blink={blinkAt(f, 3)} open={0.5 + 0.5 * Math.sin(f / 4)} sweat={cur.kind === 'rival' && t >= P_STATUS && (cur.r!.st === 'never' || cur.r!.st === 'neg')} />
							<div style={{fontFamily: LILITA, fontSize: 34, color: '#fff', marginTop: -6}}>ARGENTINA</div>
							<div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, width: '100%', marginTop: 8}}>
								{(['dom', 'even', 'neg', 'never'] as St[]).map((s) => (
									<div key={s} style={{borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: `3px solid ${ST_COL[s]}`, padding: '4px 6px', textAlign: 'center'}}>
										<div style={{fontFamily: LILITA, fontSize: 34, lineHeight: 1, color: '#fff'}}>{counts[s]}</div>
										<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 11, letterSpacing: 1, color: ST_COL[s], whiteSpace: 'nowrap'}}>{ST_TXT[s]}</div>
									</div>
								))}
							</div>
						</Panel>
					</div>
					{/* top bar */}
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
					{/* log */}
					<div style={{position: 'absolute', right: 28, top: 26, display: 'flex', flexDirection: 'column', gap: 8, transform: `translateX(${(1 - hudIn) * 500}px)`}}>
						{log.map((r, i) => (
							<div key={r.key} style={{display: 'flex', alignItems: 'center', gap: 10, width: 360, padding: '6px 10px', borderRadius: 12, background: 'rgba(11,30,63,0.9)', border: `3px solid ${i === 0 ? ST_COL[r.st] : 'rgba(255,255,255,0.25)'}`, opacity: 1 - i * 0.13}}>
								<img src={staticFile(`flags/${r.flag}.svg`)} style={{width: 42, height: 31, borderRadius: 5, objectFit: 'cover', border: `2px solid ${C.navy}`}} />
								<span style={{flex: 1, fontFamily: RUBIK, fontWeight: 800, fontSize: 18, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden'}}>{r.es}</span>
								<span style={{padding: '2px 8px', borderRadius: 7, background: ST_COL[r.st], fontFamily: RUBIK, fontWeight: 800, fontSize: 13, color: r.st === 'even' ? C.navy : '#fff', whiteSpace: 'nowrap'}}>{ST_TXT[r.st]}</span>
							</div>
						))}
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, bottom: 8, textAlign: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.7)', textShadow: '0 2px 4px rgba(0,0,0,0.6)'}}>
						Datos: todos los partidos de la selección absoluta (1902 – oct. 2026), penaltis = empate · Rusia incluye la URSS, Serbia a Yugoslavia y Chequia a Checoslovaquia
					</div>
				</>
			)}

			{/* region intro */}
			{cur.kind === 'region' && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, transform: `scale(${backOut((t - 36) / 16) * (1 - easeInOut((t - cur.dur + 24) / 20))})`}}>
					<div style={{fontFamily: LILITA, fontSize: 110, color: C.yellow, ...strokeText(16), textShadow: `0 10px 0 ${C.red}`, whiteSpace: 'nowrap'}}>{CONF_ES[cur.conf!]}</div>
					<Pill size={32} bg="#fff">{TOUR.filter((r) => r.conf === cur.conf).length} RIVALES</Pill>
				</div>
			)}
			{/* rival card */}
			{cur.kind === 'rival' && <RivalCard r={cur.r!} t={t} dur={cur.dur} />}
			{cur.kind === 'rival' && cur.r!.st === 'never' && t >= P_STATUS && t < P_STATUS + 70 && (
				<AbsoluteFill style={{background: '#E63946', opacity: 0.35 * (1 - (t - P_STATUS) / 70), pointerEvents: 'none'}} />
			)}
			{cur.kind === 'rival' && cur.r!.st === 'never' && t >= P_STATUS && t < cur.dur - 20 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((t - P_STATUS) / 14)})`}}>
					<div style={{fontFamily: LILITA, fontSize: 92, color: '#fff', ...strokeText(14), textShadow: `0 8px 0 ${C.red}`}}>¡NUNCA LE HA GANADO!</div>
				</div>
			)}

			{/* ---------- FINAL ---------- */}
			{inFinal && cur.kind === 'final' && <Final ft={ft} />}
			{cur.kind === 'outro' && <Outro t={t} f={f} />}
		</AbsoluteFill>
	);
};

const FlagHead: React.FC<{flag: string; size: number; mood: Mood; open?: number; look?: [number, number]}> = ({flag, size, mood, open = 1, look}) => (
	<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
		<defs><clipPath id={'fh' + flag}><circle cx={100} cy={92} r={76} /></clipPath></defs>
		<ellipse cx={100} cy={192} rx={64} ry={8} fill="#000" opacity={0.25} />
		<image href={staticFile(`flags/${flag}.svg`)} x={0} y={16} width={200} height={152} preserveAspectRatio="xMidYMid slice" clipPath={`url(#fh${flag})`} />
		<circle cx={100} cy={92} r={76} fill="none" stroke="#0B1E3F" strokeWidth={7} />
		<ellipse cx={70} cy={46} rx={20} ry={10} transform="rotate(-28 70 46)" fill="#fff" opacity={0.35} />
		<Eyes mood={mood} look={look} />
		<Mouth mood={mood} open={open} />
	</svg>
);

const ColdOpen: React.FC<{f: number}> = ({f}) => {
	const drop = backOut(f / 10);
	const stamp = f >= 40 ? Math.max(1, 3.2 - (f - 40) / 4) : 0;
	const shake = f >= 40 && f < 52 ? Math.sin(f * 3) * (52 - f) * 0.8 : 0;
	const lines = (f * 3) % 8;
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #3A1020 0%, #14060C 70%)', transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
			<AbsoluteFill style={{opacity: 0.18, backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 4px)', backgroundPosition: `0 ${lines}px`}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - drop) * -300}px)`}}>
				<div style={{padding: '8px 26px', borderRadius: 12, background: '#E1251B', border: '5px solid #0B1E3F', fontFamily: RUBIK, fontWeight: 800, fontSize: 32, letterSpacing: 3, color: '#fff'}}>MUNDIAL 1990 · PARTIDO INAUGURAL</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', justifyContent: 'center', transform: `scale(${drop})`}}>
				<div style={{display: 'flex', alignItems: 'stretch', borderRadius: 22, overflow: 'hidden', border: '7px solid #0B1E3F', boxShadow: '0 14px 0 rgba(0,0,0,0.45)'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#fff', padding: '16px 30px'}}>
						<img src={staticFile('flags/ar.svg')} style={{width: 96, height: 72, borderRadius: 8, border: '4px solid #0B1E3F', objectFit: 'cover'}} />
						<span style={{fontFamily: LILITA, fontSize: 84, color: '#0B1E3F'}}>ARGENTINA</span>
					</div>
					<div style={{background: '#0B1E3F', padding: '10px 40px', fontFamily: LILITA, fontSize: 110, color: '#FFD23F', display: 'flex', alignItems: 'center'}}>0 - 1</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#fff', padding: '16px 30px'}}>
						<span style={{fontFamily: LILITA, fontSize: 84, color: '#0B1E3F'}}>CAMERÚN</span>
						<img src={staticFile('flags/cm.svg')} style={{width: 96, height: 72, borderRadius: 8, border: '4px solid #0B1E3F', objectFit: 'cover'}} />
					</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: 300, top: 430, transform: `translateY(${(1 - elastic((f - 6) / FPS)) * 500}px)`}}>
				<Hincha iso="ARG" mood={f >= 40 ? 'miedo' : 'enfado'} size={420} scarf={['#74ACDF', '#FFFFFF']} sweat={f >= 40} look={[0.6, -0.3]} />
			</div>
			<div style={{position: 'absolute', left: 1200, top: 430, transform: `translateY(${(1 - elastic((f - 12) / FPS)) * 500}px)`}}>
				<FlagHead flag="cm" size={420} mood="grito" open={0.5 + 0.5 * Math.sin(f / 4)} look={[-0.6, -0.3]} />
			</div>
			{f >= 40 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', transform: `scale(${stamp}) rotate(-8deg)`, opacity: clamp01((f - 40) / 3)}}>
					<div style={{padding: '14px 40px', borderRadius: 16, border: '10px solid #E63946', fontFamily: LILITA, fontSize: 96, color: '#E63946', background: 'rgba(20,6,12,0.75)', letterSpacing: 2}}>NUNCA LE HA GANADO</div>
				</div>
			)}
			{f >= 100 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 930, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((f - 100) / 12)})`}}>
					<Pill size={40} bg="#fff">...Y NO ES LA ÚNICA</Pill>
				</div>
			)}
		</AbsoluteFill>
	);
};

const Final: React.FC<{ft: number}> = ({ft}) => {
	const cnt = {dom: 0, even: 0, neg: 0, never: 0} as Record<St, number>;
	TOUR.forEach((r) => cnt[r.st]++);
	const brazil = TOUR.find((r) => r.key === 'BRA')!;
	const uru = TOUR.find((r) => r.key === 'URY')!;
	return (
		<>
			{ft < 600 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, transform: `scale(${backOut((ft - 24) / 16) * (1 - easeInOut((ft - 570) / 24))})`}}>
					<div style={{fontFamily: LILITA, fontSize: 96, color: '#fff', ...strokeText(16), textShadow: `0 10px 0 ${C.red}`}}>EL RESULTADO FINAL</div>
					{ft >= 180 && <div style={{transform: `scale(${backOut((ft - 180) / 14)})`}}><Pill size={30} bg={C.yellow}>{TOUR.length} RIVALES · {TOTALS.p.toLocaleString('es-ES')} PARTIDOS · {TOTALS.w} VICTORIAS · {TOTALS.d} EMPATES · {TOTALS.l} DERROTAS</Pill></div>}
				</div>
			)}
			{ft >= 230 && ft < 870 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center', gap: 20, opacity: 1 - clamp01((ft - 840) / 24)}}>
					{(['dom', 'even', 'neg', 'never'] as St[]).map((s, i) => (
						<div key={s} style={{transform: `scale(${backOut((ft - 240 - i * 24) / 14)})`, width: 300, padding: '12px 0', borderRadius: 20, background: 'rgba(11,30,63,0.94)', border: `5px solid ${ST_COL[s]}`, textAlign: 'center'}}>
							<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1, color: '#fff'}}>{cnt[s]}</div>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: ST_COL[s]}}>{ST_TXT[s]}</div>
						</div>
					))}
				</div>
			)}
			{ft >= 620 && ft < 870 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((ft - 640) / 14)})`}}>
					<Pill size={34} bg="#fff">EN GRIS: MÁS DE 120 SELECCIONES CONTRA LAS QUE NUNCA HA JUGADO</Pill>
				</div>
			)}
			{ft >= 870 && ft < 1500 && (
				<>
					<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((ft - 880) / 16) * (1 - easeInOut((ft - 1470) / 24))})`}}>
						<div style={{fontFamily: LILITA, fontSize: 80, color: '#fff', ...strokeText(14), textShadow: `0 8px 0 ${C.red}`, whiteSpace: 'nowrap'}}>LAS 6 A LAS QUE NUNCA HA GANADO</div>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', gap: 14, opacity: 1 - clamp01((ft - 1470) / 24)}}>
						{NEVER.map((r, i) => (
							<div key={r.key} style={{transform: `scale(${backOut((ft - 960 - i * 40) / 14)})`, width: 270, padding: '12px 10px', borderRadius: 18, background: 'rgba(11,30,63,0.94)', border: `5px solid ${ST_COL.never}`, textAlign: 'center'}}>
								<img src={staticFile(`flags/${r.flag}.svg`)} style={{width: 90, height: 66, borderRadius: 8, objectFit: 'cover', border: `3px solid ${C.navy}`, boxShadow: '0 0 0 3px #fff'}} />
								<div style={{fontFamily: LILITA, fontSize: 36, color: '#fff', marginTop: 6, whiteSpace: 'nowrap'}}>{r.es.toUpperCase()}</div>
								<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: 'rgba(255,255,255,0.85)'}}>{r.p} PJ · {r.d} E · {r.l} P</div>
							</div>
						))}
					</div>
				</>
			)}
			{ft >= 1500 && (
				<AbsoluteFill style={{background: `rgba(8,20,40,${0.75 * clamp01((ft - 1500) / 24)})`}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center', transform: `scale(${backOut((ft - 1530) / 14)})`}}>
						<span style={{fontFamily: LILITA, fontSize: 104, color: C.yellow, ...strokeText(16), textShadow: `0 10px 0 ${C.red}`}}>SU BESTIA NEGRA</span>
					</div>
					<div style={{position: 'absolute', left: 300, top: 230, transform: `translateX(${(1 - backOut((ft - 1536) / 18)) * -800}px)`}}>
						<Hincha iso="ARG" mood="enfado" size={400} scarf={['#74ACDF', '#FFFFFF']} look={[0.6, 0]} sweat />
					</div>
					<div style={{position: 'absolute', left: 1220, top: 230, transform: `translateX(${(1 - backOut((ft - 1540) / 18)) * 800}px)`}}>
						<Hincha iso="BRA" mood="grito" size={400} scarf={['#FEDD00', '#009C3B']} look={[-0.6, 0]} open={0.5 + 0.5 * Math.sin(ft / 4)} />
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', transform: `scale(${backOut((ft - 1560) / 14)})`}}>
						<span style={{fontFamily: LILITA, fontSize: 130, color: '#fff', ...strokeText(16)}}>BRASIL</span>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
						<div style={{transform: `scale(${backOut((ft - 1600) / 14)})`, display: 'flex', gap: 16}}>
							<div style={{padding: '10px 22px', borderRadius: 14, background: ST_COL.dom, border: `5px solid ${C.navy}`, fontFamily: LILITA, fontSize: 40, color: '#fff'}}>{brazil.w} VICTORIAS</div>
							<div style={{padding: '10px 22px', borderRadius: 14, background: ST_COL.even, border: `5px solid ${C.navy}`, fontFamily: LILITA, fontSize: 40, color: C.navy}}>{brazil.d} EMPATES</div>
							<div style={{padding: '10px 22px', borderRadius: 14, background: ST_COL.never, border: `5px solid ${C.navy}`, fontFamily: LILITA, fontSize: 40, color: '#fff'}}>{brazil.l} DERROTAS</div>
						</div>
						{ft >= 1680 && <div style={{transform: `scale(${backOut((ft - 1680) / 14)})`}}><Pill size={30} bg="#fff">LA ÚNICA GRAN RIVAL CON LA QUE ARGENTINA TIENE SALDO NEGATIVO ({brazil.p} PARTIDOS)</Pill></div>}
						{ft >= 1800 && <div style={{transform: `scale(${backOut((ft - 1800) / 14)})`, fontFamily: RUBIK, fontWeight: 800, fontSize: 26, color: 'rgba(255,255,255,0.85)'}}>Uruguay le ha ganado más veces ({uru.l}), pero Argentina le ha ganado {uru.w}</div>}
					</div>
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
					{[['BRASIL', '#1BA34E'], ['MÉXICO', '#CE1126'], ['ESPAÑA', '#E8A800']].map(([n, c], i) => (
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
