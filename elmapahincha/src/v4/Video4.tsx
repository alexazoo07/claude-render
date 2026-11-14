import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {WorldLayer, Vis, WCam} from '../v2/WorldLayer';
import {Hincha, Mood} from '../Hincha';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {C} from '../data';
import {backOut, clamp01, easeInOut, easeOut, elastic, Panel, Pill, strokeText} from '../ui';
import {blinkAt, camPath, Key, Subscribe} from '../common';
import {FlagPreload} from '../v2/Preload';
import {bboxOf, WORLD} from '../v2/data2';
import {ALL_FLAGS4, CAT_COL, CAT_SUB, CAT_TXT, Cat, Entry, LIST} from './data4';

const FPS = 60;
const ARG_SCARF: [string, string] = ['#74ACDF', '#FFFFFF'];
const CATS: Cat[] = ['amor', 'mixto', 'pique', 'odio'];

// ---------------- timeline ----------------
type Item = {kind: 'intro' | 'header' | 'entry' | 'suspense' | 'final' | 'outro'; from: number; dur: number; e?: Entry; cat?: Cat; i?: number};
const INTRO = 1080;
const HEADER = 190;
const SUSP = 480;
const FINAL = 1560;
const OUTRO = 840;
const F0 = 170; // first fact
const FD = 270; // per fact
const factsOf = (e: Entry) => [e.f1, e.f2, e.f3, e.f4].filter(Boolean) as string[];
const entryDur = (e: Entry) => F0 + factsOf(e).length * FD + 60;
export const ITEMS4: Item[] = (() => {
	const out: Item[] = [];
	let t = 0;
	const push = (it: Omit<Item, 'from'>) => { out.push({...it, from: t}); t += it.dur; };
	push({kind: 'intro', dur: INTRO});
	let cat: Cat | '' = '';
	LIST.forEach((e, i) => {
		if (e.cat !== cat) { cat = e.cat; push({kind: 'header', dur: HEADER, cat}); }
		if (e.key === 'ENG') push({kind: 'suspense', dur: SUSP});
		push({kind: 'entry', dur: entryDur(e), e, i});
	});
	push({kind: 'final', dur: FINAL});
	push({kind: 'outro', dur: OUTRO});
	return out;
})();
export const V4_TOTAL = ITEMS4.reduce((a, b) => a + b.dur, 0);
const ENTRY_ITEMS = ITEMS4.filter((x) => x.kind === 'entry');
const P_STAMP = 150;

// ---------------- camera ----------------
const fitC = (k: string, focusY = 360, w = 900, h = 440): WCam => {
	const b = bboxOf(k);
	const z = Math.max(0.42, Math.min(5.2, Math.min(w / (b.w + 40), h / (b.h + 30))));
	return {x: b.cx, y: b.cy + (540 - focusY) / z, z};
};
const WORLD_VIEW: WCam = {x: 1915, y: 860, z: 0.5};
const CAT_VIEW: Record<Cat, WCam> = {
	amor: {x: 2700, y: 820, z: 0.62},
	mixto: {x: 2300, y: 700, z: 0.55},
	pique: {x: 1300, y: 1100, z: 0.62},
	odio: {x: 1700, y: 850, z: 0.55},
};
const H_BGD = fitC('BGD', 470, 1000, 520);
const H_SAU = fitC('SAU', 520, 1000, 520);
const H_ENG = fitC('ENG', 500, 900, 520);
const KEYS_CAM: Key[] = (() => {
	const k: Key[] = [];
	const add = (f: number, c: WCam) => k.push([f, c.x, c.y, c.z]);
	add(0, {...H_BGD, z: H_BGD.z * 0.8});
	add(180, {...H_BGD, z: H_BGD.z * 1.05});
	add(212, H_SAU);
	add(392, {...H_SAU, z: H_SAU.z * 1.08});
	add(424, H_ENG);
	add(600, {...H_ENG, z: H_ENG.z * 1.12});
	add(640, {x: 1915, y: 880, z: 0.36});
	add(860, {x: 1915, y: 880, z: 0.4});
	add(INTRO - 10, WORLD_VIEW);
	for (const it of ITEMS4) {
		if (it.kind === 'header') { const v = CAT_VIEW[it.cat!]; add(it.from + 60, v); add(it.from + it.dur, {...v, z: v.z * 1.04}); }
		if (it.kind === 'suspense') { const c = fitC('ENG', 420, 900, 520); add(it.from + 70, {...c, z: c.z * 0.55}); add(it.from + it.dur, {...c, z: c.z * 0.75}); }
		if (it.kind === 'entry') { const c = it.e!.key === 'ENG' ? fitC('ENG', 410, 900, 330) : fitC(it.e!.key); add(it.from + 46, c); add(it.from + it.dur, {...c, z: c.z * 1.05}); }
		if (it.kind === 'final') { add(it.from + 80, WORLD_VIEW); add(it.from + it.dur, {...WORLD_VIEW, z: WORLD_VIEW.z * 1.04}); }
		if (it.kind === 'outro') { add(it.from + 60, {x: 1500, y: 1000, z: 0.62}); add(it.from + it.dur, {x: 1500, y: 1000, z: 0.64}); }
	}
	return k;
})();

// ---------------- hook meter values ----------------
const hookMeter = (f: number) => {
	if (f < 90) return Math.sin(f / 7) * 18;
	if (f < 200) return 95 * elastic((f - 90) / 60);
	if (f < 400) return 95 + (12 - 95) * elastic((f - 200) / 60);
	if (f < 455) return 12 + Math.sin(f / 3) * 4;
	return -100 * Math.min(1.12, elastic((f - 455) / 40)) + (f >= 470 ? Math.sin(f * 2.3) * 3 : 0);
};

// ---------------- sfx ----------------
export const v4Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f, name, vol});
	// HOOK
	S(0, 'glitch', 0.45); S(4, 'whoosh_2', 0.4); S(12, 'slap', 0.5); S(46, 'pop_1', 0.45);
	for (let k = 0; k < 6; k++) S(20 + k * 12, 'tick', 0.25);
	S(88, 'riser', 0.3); S(100, 'slap', 0.55); S(102, 'crowd_roar', 0.35);
	for (let k = 0; k < 10; k++) S(104 + k * 7, `pop_${(k % 4) + 1}`, 0.3);
	S(186, 'whoosh_4', 0.5); S(222, 'drop', 0.5); S(232, 'slap', 0.45); S(282, 'boom', 0.55); S(284, 'glass', 0.25); S(304, 'crowd_roar', 0.4); S(306, 'slap', 0.45);
	S(394, 'whoosh_3', 0.5); S(410, 'glitch', 0.4); S(420, 'drumroll', 0.35); S(436, 'slap', 0.45);
	S(468, 'boom', 0.65); S(470, 'glass', 0.55); S(472, 'error', 0.45); S(474, 'crowd_ohh', 0.5); S(520, 'pop_3', 0.45);
	S(600, 'whoosh_1', 0.45); S(606, 'slap', 0.5); S(616, 'whistle_long', 0.3); S(672, 'click', 0.45);
	S(860, 'whoosh_2', 0.4); CATS.forEach((_, i) => S(880 + i * 26, `pop_${i + 1}`, 0.42)); S(1000, 'click', 0.4); S(1040, 'riser', 0.3);
	for (const it of ITEMS4) {
		if (it.kind === 'header') {
			S(it.from, 'whoosh_4', 0.45); S(it.from + 40, 'slap', 0.5);
			if (it.cat === 'amor') { S(it.from + 44, 'crowd_roar', 0.25); for (let k = 0; k < 4; k++) S(it.from + 60 + k * 10, `pop_${k + 1}`, 0.3); }
			if (it.cat === 'mixto') S(it.from + 46, 'drop', 0.4);
			if (it.cat === 'pique') S(it.from + 46, 'whistle_short', 0.35);
			if (it.cat === 'odio') { S(it.from + 42, 'boom', 0.55); S(it.from + 46, 'crowd_ohh', 0.4); }
		}
		if (it.kind === 'suspense') {
			const f0 = it.from; S(f0, 'whoosh_3', 0.45); S(f0 + 40, 'slap', 0.5); S(f0 + 90, 'glitch', 0.3); S(f0 + 150, 'drumroll', 0.5); S(f0 + 300, 'riser', 0.4);
		}
		if (it.kind === 'entry') {
			const e = it.e!; const f0 = it.from;
			S(f0, 'whoosh_' + ((it.i! % 4) + 1), 0.32); S(f0 + 24, `pop_${(it.i! % 4) + 1}`, 0.42); S(f0 + 34, 'whoosh_3', 0.2);
			if (e.p > 0) for (let k = 0; k < 5; k++) S(f0 + 52 + k * 11, 'tick', 0.2);
			for (let k = 0; k < 6; k++) S(f0 + 78 + k * 10, 'tick', 0.16);
			if (e.cat === 'amor') { S(f0 + P_STAMP, 'confirm', 0.42); S(f0 + P_STAMP + 2, 'crowd_roar', 0.25); for (let k = 0; k < 5; k++) S(f0 + P_STAMP + 6 + k * 9, `pop_${(k % 4) + 1}`, 0.25); }
			else if (e.cat === 'mixto') S(f0 + P_STAMP, 'drop', 0.45);
			else if (e.cat === 'pique') { S(f0 + P_STAMP, 'slap', 0.45); S(f0 + P_STAMP + 2, 'whistle_short', 0.25); }
			else { S(f0 + P_STAMP, 'boom', e.key === 'ENG' ? 0.65 : 0.5); S(f0 + P_STAMP + 2, 'crowd_ohh', 0.4); if (e.key === 'ENG') { S(f0 + P_STAMP + 4, 'glass', 0.5); S(f0 + P_STAMP + 6, 'crowd_roar', 0.4); } }
			factsOf(e).forEach((_, j) => S(f0 + F0 + j * FD, 'click', 0.35));
			S(f0 + it.dur - 22, 'whoosh_1', 0.22);
		}
		if (it.kind === 'final') {
			const f0 = it.from;
			S(f0, 'whoosh_4', 0.5); S(f0 + 30, 'slap', 0.5); S(f0 + 120, 'riser', 0.4); S(f0 + 180, 'boom', 0.45); CATS.forEach((_, i) => S(f0 + 240 + i * 24, 'click', 0.45));
			S(f0 + 640, 'whoosh_2', 0.45); S(f0 + 660, 'slap', 0.45); [0, 1, 2].forEach((i) => S(f0 + 700 + i * 30, `pop_${i + 1}`, 0.45)); S(f0 + 704, 'crowd_roar', 0.3);
			S(f0 + 960, 'whoosh_3', 0.45); S(f0 + 980, 'boom', 0.5); [0, 1, 2].forEach((i) => S(f0 + 1020 + i * 30, `pop_${i + 1}`, 0.45)); S(f0 + 1024, 'crowd_ohh', 0.35);
			S(f0 + 1300, 'slap', 0.45); S(f0 + 1320, 'click', 0.4);
		}
		if (it.kind === 'outro') { S(it.from, 'whoosh_2', 0.4); S(it.from + 20, 'slap', 0.45); [0, 1, 2].forEach((i) => S(it.from + 70 + i * 14, `pop_${i + 1}`, 0.4)); S(it.from + 300, 'pop_4', 0.4); S(it.from + 350, 'click', 0.5); S(it.from + 352, 'bong', 0.35); }
	}
	return s;
};
export const v4Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	const hd = (c: Cat) => ITEMS4.find((x) => x.kind === 'header' && x.cat === c)!.from;
	const fin = ITEMS4.find((x) => x.kind === 'final')!.from;
	return [`m_tense:0:${sec(INTRO + 40)}`, `m_happy:${sec(INTRO)}:${sec(hd('pique') + 40)}`, `m_tense:${sec(hd('pique'))}:${sec(fin + 40)}`, `m_triumph:${sec(fin)}:${sec(V4_TOTAL)}`].join(',');
};

// ---------------- icons ----------------
const HEART = 'M50 88 C20 66 4 50 4 30 C4 14 16 4 30 4 C40 4 47 10 50 18 C53 10 60 4 70 4 C84 4 96 14 96 30 C96 50 80 66 50 88 Z';
const FLAME = 'M50 97 C24 97 11 79 13 60 C15 44 28 36 30 18 C40 27 43 37 43 46 C49 35 53 21 48 3 C71 15 89 40 87 62 C85 82 71 97 50 97 Z';
const FLAME_IN = 'M50 95 C38 95 31 86 32 76 C33 66 41 62 42 52 C48 57 50 63 50 68 C54 62 56 55 54 46 C66 54 70 66 69 76 C68 88 61 95 50 95 Z';
export const Icon: React.FC<{kind: Cat; size: number; style?: React.CSSProperties}> = ({kind, size, style}) => (
	<svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', ...style}}>
		{(kind === 'amor' || kind === 'mixto') && <path d={HEART} fill={kind === 'amor' ? CAT_COL.amor : CAT_COL.mixto} stroke={C.navy} strokeWidth={7} strokeLinejoin="round" />}
		{kind === 'amor' && <ellipse cx={28} cy={26} rx={10} ry={6} transform="rotate(-30 28 26)" fill="#fff" opacity={0.6} />}
		{kind === 'mixto' && <path d="M50 18 L42 38 L56 52 L44 68 L50 88" fill="none" stroke={C.navy} strokeWidth={7} strokeLinejoin="round" />}
		{(kind === 'pique' || kind === 'odio') && (
			<>
				<path d={FLAME} fill={kind === 'odio' ? CAT_COL.odio : CAT_COL.pique} stroke={C.navy} strokeWidth={7} strokeLinejoin="round" />
				<path d={FLAME_IN} fill="#FFD23F" />
			</>
		)}
	</svg>
);

// floating hearts / flames around a country (map coords)
const Floaters: React.FC<{k: string; kind: Cat; t: number; z: number; n?: number; strength?: number}> = ({k, kind, t, z, n = 14, strength = 1}) => {
	const b = bboxOf(k);
	const R = Math.max(b.w, b.h) * 0.6 + 30 / z;
	const s = 34 / z;
	return (
		<g>
			{Array.from({length: n}).map((_, i) => {
				const a = (i * 137.5 * Math.PI) / 180;
				const r = R * (0.55 + ((i * 53) % 45) / 100);
				const life = 90 + ((i * 31) % 50);
				const ph = (t + i * 23) % life;
				const p = ph / life;
				const x = b.cx + Math.cos(a) * r + Math.sin((t + i * 40) / 18) * 6 / z;
				const y = b.cy + Math.sin(a) * r * 0.7 - p * 70 / z;
				const op = Math.sin(p * Math.PI) * strength;
				const sc = s * (0.6 + ((i * 17) % 40) / 100) * (0.6 + 0.4 * Math.sin(p * Math.PI));
				return (
					<g key={i} transform={`translate(${x - sc / 2} ${y - sc / 2}) scale(${sc / 100})`} opacity={op}>
						{kind === 'amor' || kind === 'mixto' ? <path d={HEART} fill={kind === 'amor' ? CAT_COL.amor : CAT_COL.mixto} stroke={C.navy} strokeWidth={8} /> : <><path d={FLAME} fill={kind === 'odio' ? CAT_COL.odio : CAT_COL.pique} stroke={C.navy} strokeWidth={8} /><path d={FLAME_IN} fill="#FFD23F" /></>}
					</g>
				);
			})}
		</g>
	);
};

// ---------------- meter ----------------
const fmt = (v: number) => (Math.round(v) > 0 ? '+' : Math.round(v) < 0 ? '−' : '') + Math.abs(Math.round(v));
const colFor = (v: number) => (v >= 50 ? CAT_COL.amor : v >= -10 ? CAT_COL.mixto : v >= -58 ? CAT_COL.pique : CAT_COL.odio);
export const Meter: React.FC<{v: number; w: number; h?: number; big?: boolean; crack?: number}> = ({v, w, h = 30, big, crack = 0}) => {
	const cv = Math.max(-100, Math.min(100, v));
	const x = ((cv + 100) / 200) * w;
	const lab = big ? 40 : 26;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: big ? 18 : 12}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 6}}>
				<Icon kind="odio" size={lab * 1.25} />
				<span style={{fontFamily: LILITA, fontSize: lab, color: CAT_COL.odio, ...strokeText(big ? 8 : 5)}}>ODIO</span>
			</div>
			<div style={{position: 'relative', width: w, height: h}}>
				<div style={{position: 'absolute', inset: 0, borderRadius: h / 2, border: `${big ? 6 : 4}px solid ${C.navy}`, background: 'linear-gradient(90deg, #E63946 0%, #FF8A3D 28%, #FFD23F 50%, #FF9AC8 74%, #FF4FA0 100%)', boxShadow: '0 6px 0 rgba(0,0,0,0.35)', overflow: 'hidden'}}>
					{[0.25, 0.5, 0.75].map((q) => <div key={q} style={{position: 'absolute', left: `${q * 100}%`, top: 0, bottom: 0, width: q === 0.5 ? 4 : 2, background: 'rgba(11,30,63,0.55)'}} />)}
				</div>
				{crack > 0 && (
					<svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: crack}}>
						<path d={`M${w * 0.04} ${h * 0.1} L${w * 0.09} ${h * 0.6} L${w * 0.06} ${h * 0.9} M${w * 0.09} ${h * 0.6} L${w * 0.15} ${h * 0.4} L${w * 0.2} ${h * 0.8} M${w * 0.15} ${h * 0.4} L${w * 0.13} ${-h * 0.2}`} fill="none" stroke="#fff" strokeWidth={big ? 5 : 3} strokeLinecap="round" />
					</svg>
				)}
				<div style={{position: 'absolute', left: x, top: -h * 0.35, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<div style={{width: big ? 10 : 7, height: h * 1.7, borderRadius: 4, background: '#fff', border: `${big ? 4 : 3}px solid ${C.navy}`}} />
				</div>
				<div style={{position: 'absolute', left: x, top: big ? -h * 1.9 - 30 : -h * 0.35 - 46, transform: 'translateX(-50%)'}}>
					<div style={{padding: big ? '4px 18px' : '2px 12px', borderRadius: 12, background: colFor(cv), border: `${big ? 5 : 4}px solid ${C.navy}`, fontFamily: LILITA, fontSize: big ? 48 : 30, lineHeight: 1.05, color: cv >= -10 && cv < 50 ? C.navy : '#fff', whiteSpace: 'nowrap', boxShadow: '0 4px 0 rgba(0,0,0,0.3)'}}>{fmt(cv)}</div>
				</div>
			</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 6}}>
				<span style={{fontFamily: LILITA, fontSize: lab, color: CAT_COL.amor, ...strokeText(big ? 8 : 5)}}>AMOR</span>
				<Icon kind="amor" size={lab * 1.2} />
			</div>
		</div>
	);
};

// ---------------- helpers ----------------
const argMood = (c: Cat): Mood => (c === 'amor' ? 'feliz' : c === 'mixto' ? 'miedo' : c === 'pique' ? 'enfado' : 'grito');
const cMood = (c: Cat): Mood => (c === 'amor' ? 'feliz' : c === 'mixto' ? 'miedo' : 'enfado');
const Count: React.FC<{v: number; p: number}> = ({v, p}) => <>{Math.round(v * easeOut(p))}</>;
const StatBox: React.FC<{label: string; v: number; p: number; col: string}> = ({label, v, p, col}) => (
	<div style={{width: 112, padding: '4px 0 6px', borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: `3px solid ${col}`, textAlign: 'center'}}>
		<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, letterSpacing: 2, color: col}}>{label}</div>
		<div style={{fontFamily: LILITA, fontSize: 46, lineHeight: 1, color: '#fff'}}><Count v={v} p={p} /></div>
	</div>
);
const needleV = (e: Entry, t: number) => {
	if (t < 70) return 0;
	const p = elastic((t - 70) / 70);
	return e.score * p;
};

const EntryCard: React.FC<{e: Entry; t: number; dur: number}> = ({e, t, dur}) => {
	const pin = backOut((t - 34) / 18), pout = easeInOut((t - dur + 20) / 16);
	const cp = clamp01((t - 50) / 60);
	const sp = backOut((t - P_STAMP) / 14);
	const facts = factsOf(e);
	const col = CAT_COL[e.cat];
	return (
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - pin) * 600 + pout * 600}px)`}}>
			<Panel style={{width: 1200, padding: '14px 26px 14px', borderColor: t >= P_STAMP ? col : C.yellow}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<img src={staticFile(`flags/${e.flag}.svg`)} style={{width: 100, height: 75, borderRadius: 10, border: `4px solid ${C.navy}`, objectFit: 'cover', boxShadow: '0 0 0 3px #fff'}} />
					<div style={{flex: 1}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
							<div style={{fontFamily: LILITA, fontSize: 58, lineHeight: 1, color: '#fff', whiteSpace: 'nowrap'}}>{e.es.toUpperCase()}</div>
							{t >= P_STAMP && (
								<div style={{transform: `scale(${sp}) rotate(-4deg)`, display: 'flex', alignItems: 'center', gap: 8, padding: '4px 14px 4px 8px', borderRadius: 12, background: col, border: `4px solid ${C.navy}`}}>
									<Icon kind={e.cat} size={30} />
									<span style={{fontFamily: LILITA, fontSize: 30, color: e.cat === 'mixto' ? C.navy : '#fff', whiteSpace: 'nowrap'}}>{CAT_TXT[e.cat]}</span>
								</div>
							)}
						</div>
						<div style={{fontFamily: RUBIK, fontWeight: 600, fontSize: 19, color: 'rgba(255,255,255,0.75)', marginTop: 4}}>{e.p > 0 ? `Argentina contra ${e.es}: ${e.p} ${e.p === 1 ? 'partido' : 'partidos'}` : `Argentina y ${e.es} nunca se han enfrentado`}</div>
					</div>
					{e.p > 0 ? (
						<>
							<StatBox label="PARTIDOS" v={e.p} p={cp} col="#fff" />
							<StatBox label="ARG GANA" v={e.w} p={cp} col="#2EC46B" />
							<StatBox label="EMPATE" v={e.d} p={cp} col="#FFD23F" />
							<StatBox label="ARG PIERDE" v={e.l} p={cp} col="#E63946" />
						</>
					) : (
						<div style={{width: 250, padding: '6px 0 8px', borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: '3px solid #fff', textAlign: 'center', transform: `scale(${backOut((t - 50) / 14)})`}}>
							<div style={{fontFamily: LILITA, fontSize: 50, lineHeight: 1, color: '#fff'}}>0</div>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, letterSpacing: 2, color: '#fff'}}>PARTIDOS JUGADOS</div>
						</div>
					)}
				</div>
				<div style={{display: 'flex', justifyContent: 'center', marginTop: 64}}>
					<Meter v={needleV(e, t)} w={880} />
				</div>
				<div style={{marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8}}>
					{facts.map((fx, j) => {
						const ft = t - F0 - j * FD;
						return (
							<div key={j} style={{display: 'flex', alignItems: 'center', gap: 12, opacity: clamp01(ft / 10), transform: `translateX(${(1 - easeOut(ft / 14)) * -40}px)`, height: 36}}>
								<Icon kind={e.cat} size={30} />
								<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 25, color: '#fff', whiteSpace: 'nowrap'}}>{fx}</span>
							</div>
						);
					})}
				</div>
			</Panel>
		</div>
	);
};

// ---------------- main ----------------
export const Video4: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS_CAM, f, 11);
	const cur = ITEMS4.find((it) => f >= it.from && f < it.from + it.dur) ?? ITEMS4[ITEMS4.length - 1];
	const t = f - cur.from;
	const finalIt = ITEMS4.find((x) => x.kind === 'final')!;
	const inFinal = f >= finalIt.from;
	const ft = f - finalIt.from;
	const susp = ITEMS4.find((x) => x.kind === 'suspense')!;

	const vis: Record<string, Vis> = {};
	const revealed: Entry[] = [];
	// hook visitors
	if (f < INTRO) {
		const bg = LIST.find((e) => e.key === 'BGD')!, sa = LIST.find((e) => e.key === 'SAU')!;
		vis.BGD = {flag: bg.flag, pop: Math.max(0, elastic((f - 4) / FPS)), mood: f >= 96 ? 'grito' : 'feliz', blink: blinkAt(f, 2), open: 0.5 + 0.5 * Math.sin(f / 4), faceScale: 1.3};
		if (f >= 200) vis.SAU = {flag: sa.flag, pop: Math.max(0, elastic((f - 214) / FPS)), mood: f >= 290 ? 'grito' : 'feliz', blink: blinkAt(f, 5), open: 0.5 + 0.5 * Math.sin(f / 3), faceScale: 1.3};
	}
	for (const it of ENTRY_ITEMS) {
		const e = it.e!;
		const tp = f - (it.from + 24);
		if (tp < 0) continue;
		if (f >= it.from + P_STAMP) revealed.push(e);
		const isCur = cur === it;
		let mood: Mood = 'feliz';
		if (isCur && t >= P_STAMP - 30) mood = cMood(e.cat);
		if (!isCur) mood = e.cat === 'amor' ? 'feliz' : e.cat === 'odio' ? 'enfado' : 'feliz';
		let colorMix = 0;
		if (inFinal && ft >= 150) colorMix = clamp01((ft - 150) / 60) * 0.7;
		vis[e.key] = {flag: e.flag, pop: Math.max(0, elastic(tp / FPS)), mood, blink: blinkAt(f, it.i!), open: 0.5 + 0.5 * Math.sin(f / 4 + it.i!), color: CAT_COL[e.cat], colorMix, faceScale: isCur ? 1.2 : 1};
	}
	const showArg = f >= 640;
	if (showArg) {
		vis.ARG = {flag: 'ar', pop: Math.max(0, elastic((f - 650) / FPS)), mood: cur.kind === 'entry' && t >= P_STAMP ? argMood(cur.e!.cat) : 'feliz', blink: blinkAt(f, 99), open: 0.5 + 0.5 * Math.sin(f / 4), faceScale: 1.1, look: cur.kind === 'entry' ? (() => {
			const [ax, ay] = WORLD.ARG.c; const [bx, by] = WORLD[cur.e!.key].c; const dl = Math.hypot(bx - ax, by - ay) || 1; return [(bx - ax) / dl, (by - ay) / dl] as [number, number];
		})() : [0, 0]};
	}

	// silhouettes: England in hook and suspense
	const silhouettes: {key: string; p: number}[] = [];
	if (f >= 412 && f < 610) silhouettes.push({key: 'ENG', p: clamp01((f - 412) / 14) * (1 - clamp01((f - 590) / 18))});
	const st = f - susp.from;
	if (st >= 60 && f < susp.from + susp.dur + 30) silhouettes.push({key: 'ENG', p: clamp01((st - 60) / 20) * (1 - clamp01((st - susp.dur - 10) / 20))});

	const ring = cur.kind === 'entry' && t > 20 ? {key: cur.e!.key, p: Math.min(clamp01((t - 20) / 12), 1 - clamp01((t - cur.dur + 20) / 14)), color: t >= P_STAMP ? CAT_COL[cur.e!.cat] : C.yellow} : null;

	const hudIn = easeOut((f - INTRO + 10) / 30);
	const showHud = f >= INTRO - 10 && !(inFinal && ft >= 60);
	const shake = f >= 468 && f < 492 ? Math.sin(f * 3.1) * (492 - f) * 0.9 : (cur.kind === 'entry' && cur.e!.key === 'ENG' && t >= P_STAMP && t < P_STAMP + 20 ? Math.sin(f * 3) * (P_STAMP + 20 - t) * 0.8 : 0);

	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			<FlagPreload flags={ALL_FLAGS4} />
			<AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
				<WorldLayer cam={cam} vis={vis} ring={ring} silhouettes={silhouettes}>
					{f >= 96 && f < 230 && <Floaters k="BGD" kind="amor" t={f - 96} z={cam.z} n={22} strength={1 - clamp01((f - 200) / 30)} />}
					{f >= 290 && f < 410 && <Floaters k="SAU" kind="mixto" t={f - 290} z={cam.z} n={14} strength={1 - clamp01((f - 385) / 25)} />}
					{f >= 470 && f < 610 && <Floaters k="ENG" kind="odio" t={f - 470} z={cam.z} n={18} strength={1 - clamp01((f - 585) / 25)} />}
					{((f >= 420 && f < 600) || (st >= 80 && st < susp.dur)) && (() => {
						const b = bboxOf('ENG');
						const k = 1 / cam.z;
						const p = f < 700 ? backOut((f - 430) / 14) : backOut((st - 90) / 14);
						return <text x={b.cx - 4 * k} y={b.cy + 22 * k} textAnchor="middle" fontFamily="Lilita" fontSize={70 * k} fill="#E63946" stroke="#fff" strokeWidth={4 * k} paintOrder="stroke" transform={`translate(${b.cx} ${b.cy}) scale(${p}) translate(${-b.cx} ${-b.cy})`}>?</text>;
					})()}
					{cur.kind === 'entry' && t >= P_STAMP && <Floaters k={cur.e!.key} kind={cur.e!.cat} t={t - P_STAMP} z={cam.z} n={cur.e!.key === 'ENG' ? 22 : cur.e!.cat === 'mixto' ? 8 : 14} strength={1 - clamp01((t - cur.dur + 40) / 30)} />}
				</WorldLayer>
			</AbsoluteFill>

			{f < INTRO && <HookOverlay f={f} />}

			{/* ---------- HUD ---------- */}
			{showHud && (
				<>
					<div style={{position: 'absolute', left: 28, top: 26, transform: `translateX(${(1 - hudIn) * -400}px)`}}>
						<Panel style={{width: 230, padding: '10px 12px 12px', borderColor: '#9FD0FF', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<Hincha iso="ARG" mood={(vis.ARG?.mood ?? 'feliz') as Mood} size={160} scarf={ARG_SCARF} blink={blinkAt(f, 3)} open={0.5 + 0.5 * Math.sin(f / 4)} sweat={cur.kind === 'entry' && t >= P_STAMP && (cur.e!.cat === 'odio' || cur.e!.cat === 'mixto')} />
							<div style={{fontFamily: LILITA, fontSize: 32, color: '#fff', marginTop: -6}}>ARGENTINA</div>
							<div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 6, width: '100%', marginTop: 6}}>
								{CATS.map((c) => (
									<div key={c} style={{borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: `3px solid ${CAT_COL[c]}`, padding: '3px 4px', textAlign: 'center'}}>
										<div style={{fontFamily: LILITA, fontSize: 30, lineHeight: 1, color: '#fff'}}>{revealed.filter((e) => e.cat === c).length}</div>
										<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 11, letterSpacing: 1, color: CAT_COL[c], whiteSpace: 'nowrap'}}>{CAT_TXT[c]}</div>
									</div>
								))}
							</div>
						</Panel>
					</div>
					<Thermo revealed={revealed} curKey={cur.kind === 'entry' ? cur.e!.key : null} f={f} x={(1 - hudIn) * 300} />
					{/* top tag */}
					{(() => {
						const curCat = cur.kind === 'entry' ? cur.e!.cat : cur.kind === 'header' ? cur.cat! : cur.kind === 'suspense' ? 'odio' : null;
						if (!curCat) return null;
						return (
							<div style={{position: 'absolute', left: 0, right: 0, top: 24, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - hudIn) * -200}px)`}}>
								<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '6px 18px', borderRadius: 16, background: 'rgba(11,30,63,0.92)', border: `4px solid ${CAT_COL[curCat]}`}}>
									<Icon kind={curCat} size={30} />
									<span style={{fontFamily: LILITA, fontSize: 30, color: CAT_COL[curCat]}}>{CAT_TXT[curCat]}</span>
									<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.8)', marginLeft: 6}}>{revealed.length}/{LIST.length} PAÍSES</span>
								</div>
							</div>
						);
					})()}
					<div style={{position: 'absolute', left: 0, right: 0, bottom: 8, textAlign: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.7)', textShadow: '0 2px 4px rgba(0,0,0,0.6)'}}>
						Termómetro: valoración del canal basada en hechos (afición, finales, eliminaciones y polémicas) · Partidos: selección absoluta hasta oct. 2026, penaltis = empate
					</div>
				</>
			)}

			{cur.kind === 'header' && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, transform: `scale(${backOut((t - 36) / 16) * (1 - easeInOut((t - cur.dur + 24) / 20))})`}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 24}}>
						<Icon kind={cur.cat!} size={110} style={{transform: `rotate(${Math.sin(f / 8) * 8}deg)`}} />
						<div style={{fontFamily: LILITA, fontSize: 130, color: CAT_COL[cur.cat!], ...strokeText(18), textShadow: `0 10px 0 ${C.navy}`, whiteSpace: 'nowrap'}}>{CAT_TXT[cur.cat!]}</div>
						<Icon kind={cur.cat!} size={110} style={{transform: `rotate(${-Math.sin(f / 8) * 8}deg)`}} />
					</div>
					<Pill size={34} bg="#fff">{CAT_SUB[cur.cat!]} · {LIST.filter((e) => e.cat === cur.cat).length} PAÍSES</Pill>
				</div>
			)}

			{cur.kind === 'suspense' && <Suspense t={t} f={f} />}
			{cur.kind === 'entry' && <EntryCard e={cur.e!} t={t} dur={cur.dur} />}
			{cur.kind === 'entry' && cur.e!.cat === 'odio' && t >= P_STAMP && t < P_STAMP + 60 && <AbsoluteFill style={{background: CAT_COL.odio, opacity: (cur.e!.key === 'ENG' ? 0.45 : 0.22) * (1 - (t - P_STAMP) / 60)}} />}
			{cur.kind === 'entry' && cur.e!.cat === 'amor' && t >= P_STAMP && t < P_STAMP + 50 && <AbsoluteFill style={{background: CAT_COL.amor, opacity: 0.2 * (1 - (t - P_STAMP) / 50)}} />}
			{cur.kind === 'entry' && cur.e!.key === 'ENG' && t >= P_STAMP && t < cur.dur - 20 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((t - P_STAMP) / 14)})`}}>
					<div style={{fontFamily: LILITA, fontSize: 84, color: '#fff', ...strokeText(14), textShadow: `0 8px 0 ${C.red}`}}>¡LA RIVALIDAD MÁS CALIENTE!</div>
				</div>
			)}

			{inFinal && cur.kind === 'final' && <Final ft={ft} f={f} />}
			{cur.kind === 'outro' && <Outro t={t} f={f} />}
		</AbsoluteFill>
	);
};

// right-side vertical thermometer with flags placed by score
const Thermo: React.FC<{revealed: Entry[]; curKey: string | null; f: number; x: number}> = ({revealed, curKey, f, x}) => {
	const top = 110, H = 560, W = 24, GAP = 26.5;
	const yOf = (v: number) => top + ((100 - v) / 200) * H;
	const sorted = [...revealed].sort((a, b) => b.score - a.score);
	const ys = sorted.map((e) => yOf(e.score));
	for (let i = 1; i < ys.length; i++) ys[i] = Math.max(ys[i], ys[i - 1] + GAP);
	const over = ys.length ? ys[ys.length - 1] - (top + H) : 0;
	if (over > 0) { for (let i = 0; i < ys.length; i++) ys[i] -= over; for (let i = ys.length - 1; i > 0; i--) ys[i - 1] = Math.min(ys[i - 1], ys[i] - GAP); }
	const TX = 150; // tube right offset
	return (
		<div style={{position: 'absolute', right: 20, top: 0, width: 230, height: 720, transform: `translateX(${x}px)`}}>
			<div style={{position: 'absolute', right: TX - 30, top: top - 58, fontFamily: LILITA, fontSize: 24, color: CAT_COL.amor, ...strokeText(6), display: 'flex', alignItems: 'center', gap: 4}}><Icon kind="amor" size={28} />AMOR</div>
			<div style={{position: 'absolute', right: TX - 30, top: top + H + 22, fontFamily: LILITA, fontSize: 24, color: CAT_COL.odio, ...strokeText(6), display: 'flex', alignItems: 'center', gap: 4}}><Icon kind="odio" size={28} />ODIO</div>
			<div style={{position: 'absolute', right: TX, top: top - 16, width: W, height: H + 32, borderRadius: W, border: `4px solid ${C.navy}`, background: 'linear-gradient(180deg, #FF4FA0 0%, #FF9AC8 26%, #FFD23F 50%, #FF8A3D 72%, #E63946 100%)', boxShadow: '0 0 0 3px rgba(255,255,255,0.5), 0 6px 0 rgba(0,0,0,0.35)'}} />
			<svg width={230} height={720} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				{sorted.map((e, i) => {
					const x0 = 230 - TX + 4, y0 = yOf(e.score), x1 = 230 - TX + 46, y1 = ys[i];
					return <path key={e.key} d={`M${x0} ${y0} L${x0 + 14} ${y0} L${x1 - 8} ${y1} L${x1} ${y1}`} fill="none" stroke={e.key === curKey ? '#fff' : 'rgba(255,255,255,0.55)'} strokeWidth={e.key === curKey ? 3 : 2} />;
				})}
			</svg>
			{sorted.map((e, i) => {
				const isCur = e.key === curKey;
				const s = isCur ? 1.15 + 0.08 * Math.sin(f / 5) : 1;
				return (
					<div key={e.key} style={{position: 'absolute', left: 230 - TX + 46, top: ys[i] - 12, display: 'flex', alignItems: 'center', gap: 6, transform: `scale(${s})`, transformOrigin: 'left center'}}>
						<img src={staticFile(`flags/${e.flag}.svg`)} style={{width: 32, height: 24, borderRadius: 5, objectFit: 'cover', border: `2px solid ${isCur ? '#fff' : C.navy}`, boxShadow: isCur ? `0 0 10px ${CAT_COL[e.cat]}` : 'none'}} />
						<span style={{fontFamily: LILITA, fontSize: 19, color: isCur ? '#fff' : CAT_COL[e.cat], ...strokeText(4), whiteSpace: 'nowrap'}}>{fmt(e.score)}</span>
					</div>
				);
			})}
		</div>
	);
};

// ---------------- HOOK ----------------
const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; p: number; shadow?: string}> = ({children, size = 84, color = '#fff', p, shadow = C.navy}) => (
	<div style={{transform: `scale(${p})`, fontFamily: LILITA, fontSize: size, color, ...strokeText(size * 0.16), textShadow: `0 ${size * 0.09}px 0 ${shadow}`, whiteSpace: 'nowrap', lineHeight: 1.05}}>{children}</div>
);
const HookOverlay: React.FC<{f: number}> = ({f}) => {
	const mv = hookMeter(f);
	const meterOut = easeInOut((f - 590) / 20);
	const crack = f >= 470 ? clamp01((f - 470) / 4) : 0;
	return (
		<>
			{/* red vignette for hate */}
			{f >= 400 && f < 620 && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(120,10,20,0.75) 100%)', opacity: clamp01((f - 400) / 20) * (1 - clamp01((f - 600) / 20))}} />}
			{f >= 96 && f < 200 && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(255,79,160,0.45) 100%)', opacity: clamp01((f - 96) / 10) * (1 - clamp01((f - 180) / 20))}} />}
			{f >= 466 && f < 480 && <AbsoluteFill style={{background: '#fff', opacity: 0.7 * (1 - (f - 466) / 14)}} />}

			{/* BEAT 1: Bangladesh */}
			{f < 196 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: 1 - clamp01((f - 184) / 12)}}>
					<Big p={backOut((f - 8) / 12)} size={76}>ESTE PAÍS NUNCA HA JUGADO</Big>
					<Big p={backOut((f - 18) / 12)} size={76}>CONTRA ARGENTINA...</Big>
					{f >= 98 && <Big p={backOut((f - 98) / 12)} size={104} color={CAT_COL.amor}>...Y LA AMA CON LOCURA</Big>}
				</div>
			)}
			{f >= 44 && f < 196 && (
				<div style={{position: 'absolute', right: 120, top: 560, transform: `scale(${backOut((f - 44) / 12)}) rotate(6deg)`, opacity: 1 - clamp01((f - 184) / 12)}}>
					<div style={{padding: '10px 26px', borderRadius: 16, background: '#fff', border: `6px solid ${C.navy}`, textAlign: 'center', boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
						<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1, color: C.navy}}>0</div>
						<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, letterSpacing: 2, color: C.navy}}>PARTIDOS</div>
					</div>
				</div>
			)}

			{/* BEAT 2: Saudi Arabia */}
			{f >= 212 && f < 400 && (
				<div style={{position: 'absolute', left: 70, top: 70, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14, opacity: 1 - clamp01((f - 386) / 12)}}>
					<div style={{transformOrigin: 'left center'}}><Big p={backOut((f - 228) / 12)} size={74}>ESTE DECLARÓ</Big></div>
					<div style={{transformOrigin: 'left center'}}><Big p={backOut((f - 238) / 12)} size={74} color={C.yellow}>FIESTA NACIONAL...</Big></div>
					{f >= 304 && <div style={{transformOrigin: 'left center'}}><Big p={backOut((f - 304) / 12)} size={100} color="#fff" shadow={C.red}>¡POR GANARLE!</Big></div>}
				</div>
			)}
			{f >= 214 && f < 400 && (
				<div style={{position: 'absolute', right: 230, top: 100, transform: `translateY(${(1 - backOut((f - 220) / 16)) * -700}px) rotate(${4 + Math.sin(f / 20)}deg)`, opacity: 1 - clamp01((f - 386) / 12)}}>
					<div style={{width: 360, borderRadius: 24, overflow: 'hidden', border: `7px solid ${C.navy}`, background: '#fff', boxShadow: '0 14px 0 rgba(0,0,0,0.4)'}}>
						<div style={{background: C.red, padding: '10px 0', textAlign: 'center', fontFamily: LILITA, fontSize: 40, color: '#fff'}}>NOVIEMBRE 2022</div>
						<div style={{textAlign: 'center', fontFamily: LILITA, fontSize: 190, lineHeight: 1, color: C.navy, paddingTop: 10}}>23</div>
						<div style={{textAlign: 'center', fontFamily: RUBIK, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: C.navy, paddingBottom: 18}}>MIÉRCOLES</div>
					</div>
					{f >= 280 && (
						<div style={{position: 'absolute', left: -50, top: 300, transform: `scale(${Math.max(1, 3 - (f - 280) / 4)}) rotate(-10deg)`, opacity: clamp01((f - 280) / 3)}}>
							<div style={{padding: '10px 22px', borderRadius: 14, border: '9px solid #E63946', fontFamily: LILITA, fontSize: 54, color: '#E63946', background: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap', letterSpacing: 1}}>FERIADO NACIONAL</div>
						</div>
					)}
					{f >= 320 && <div style={{marginTop: 74, transform: `scale(${backOut((f - 320) / 12)})`, textAlign: 'center'}}><Pill size={24} bg="#fff">EL DÍA DESPUÉS DE GANARLE 2-1 EN QATAR</Pill></div>}
				</div>
			)}

			{/* BEAT 3: the hater */}
			{f >= 424 && f < 600 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: 1 - clamp01((f - 588) / 12)}}>
					<Big p={backOut((f - 432) / 12)} size={80}>Y ESTE...</Big>
					{f >= 470 && <Big p={backOut((f - 470) / 10)} size={112} color={CAT_COL.odio} shadow="#000">LA ODIA DESDE 1966</Big>}
				</div>
			)}
			{f >= 516 && f < 600 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((f - 516) / 12)})`, opacity: 1 - clamp01((f - 588) / 12)}}>
					<Pill size={34} bg={C.yellow}>¿SABES CUÁL ES? DÉJALO EN LOS COMENTARIOS</Pill>
				</div>
			)}

			{/* meter */}
			{f < 610 && (
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 70, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - backOut((f - 4) / 16)) * 300 + meterOut * 300}px)`}}>
					<div style={{padding: '70px 34px 22px', borderRadius: 28, background: 'rgba(11,30,63,0.9)', border: `5px solid ${C.yellow}`, boxShadow: '0 10px 0 rgba(0,0,0,0.35)'}}>
						<Meter v={mv} w={900} h={40} big crack={crack} />
					</div>
				</div>
			)}

			{/* TITLE */}
			{f >= 600 && f < 880 && (() => {
				const pin = backOut((f - 600) / 16), pout = easeInOut((f - 850) / 22);
				return (
					<div style={{position: 'absolute', left: 0, right: 0, top: 210, display: 'flex', justifyContent: 'center', transform: `translateY(${pout * -900}px) scale(${pin}) rotate(${-2 - pout * 6}deg)`}}>
						<div style={{position: 'relative', background: '#FFF6E0', border: `7px solid ${C.navy}`, borderRadius: 34, padding: '26px 70px 32px', boxShadow: '0 16px 0 rgba(0,0,0,0.35)', textAlign: 'center'}}>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: C.red}}>EL MAPA HINCHA</div>
							<div style={{fontFamily: LILITA, fontSize: 104, lineHeight: 1.0, color: C.navy, marginTop: 6}}>¿QUIÉN <span style={{color: CAT_COL.amor}}>AMA</span> Y</div>
							<div style={{fontFamily: LILITA, fontSize: 104, lineHeight: 1.0, color: C.navy}}>QUIÉN <span style={{color: CAT_COL.odio}}>ODIA</span> A</div>
							<div style={{fontFamily: LILITA, fontSize: 104, lineHeight: 1.0, color: '#4FA3E3', WebkitTextStroke: `4px ${C.navy}`, paintOrder: 'stroke fill'}}>ARGENTINA?</div>
							<div style={{marginTop: 16, transform: `scale(${backOut((f - 672) / 14)})`}}><Pill size={28}>{LIST.length} PAÍSES · DEL QUE MÁS LA AMA AL QUE MÁS LA ODIA</Pill></div>
							<div style={{position: 'absolute', left: -80, top: 40, transform: `rotate(${-14 + Math.sin(f / 9) * 6}deg) scale(${backOut((f - 620) / 14)})`}}><Icon kind="amor" size={130} /></div>
							<div style={{position: 'absolute', right: -80, top: 200, transform: `rotate(${12 + Math.sin(f / 7) * 6}deg) scale(${backOut((f - 630) / 14)})`}}><Icon kind="odio" size={140} /></div>
						</div>
					</div>
				);
			})()}
			{f >= 870 && f < INTRO && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: 1 - clamp01((f - INTRO + 30) / 24)}}>
					<div style={{transform: `scale(${backOut((f - 872) / 14)})`}}><Big p={1} size={70}>EL TERMÓMETRO HINCHA</Big></div>
					<div style={{display: 'flex', gap: 18}}>
						{CATS.map((c, i) => (
							<div key={c} style={{transform: `scale(${backOut((f - 880 - i * 26) / 14)})`, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px 12px 14px', borderRadius: 16, background: CAT_COL[c], border: `5px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.3)'}}>
								<Icon kind={c} size={46} />
								<span style={{fontFamily: LILITA, fontSize: 42, color: c === 'mixto' ? C.navy : '#fff', whiteSpace: 'nowrap'}}>{CAT_TXT[c]}</span>
							</div>
						))}
					</div>
					<div style={{transform: `scale(${backOut((f - 1000) / 14)})`}}><Pill size={28} bg="#fff">BASADO EN HECHOS: AFICIÓN, FINALES, ELIMINACIONES Y POLÉMICAS</Pill></div>
				</div>
			)}
		</>
	);
};

// ---------------- SUSPENSE (before #1 hater) ----------------
const Suspense: React.FC<{t: number; f: number}> = ({t, f}) => (
	<>
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(120,10,20,0.7) 100%)', opacity: clamp01(t / 30) * (1 - clamp01((t - SUSP + 20) / 20))}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: 1 - clamp01((t - SUSP + 24) / 20)}}>
			<Big p={backOut((t - 36) / 14)} size={76}>Y EL PAÍS CON EL QUE</Big>
			<Big p={backOut((t - 48) / 14)} size={76}>ARGENTINA TIENE MÁS ODIO ES...</Big>
		</div>
		{t >= 200 && (
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 120, display: 'flex', justifyContent: 'center', gap: 20, opacity: 1 - clamp01((t - SUSP + 24) / 20)}}>
				{['1966', '1986', '1998', '2002', '2026'].map((y, i) => (
					<div key={y} style={{transform: `scale(${backOut((t - 200 - i * 22) / 12)}) rotate(${(i % 2 ? 4 : -4)}deg)`, padding: '10px 26px', borderRadius: 14, background: 'rgba(11,30,63,0.94)', border: `5px solid ${CAT_COL.odio}`, fontFamily: LILITA, fontSize: 52, color: '#fff'}}>{y}</div>
				))}
			</div>
		)}
		{t >= 330 && <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', transform: `scale(${backOut((t - 330) / 12)})`, opacity: 1 - clamp01((t - SUSP + 24) / 20)}}><Pill size={28} bg={C.yellow}>¿LO HABÍAS ACERTADO?</Pill></div>}
	</>
);

// ---------------- FINAL ----------------
const MiniCard: React.FC<{e: Entry; p: number; rank: number}> = ({e, p, rank}) => (
	<div style={{transform: `scale(${p})`, width: 250, padding: '12px 10px', borderRadius: 18, background: 'rgba(11,30,63,0.95)', border: `5px solid ${CAT_COL[e.cat]}`, textAlign: 'center', position: 'relative'}}>
		<div style={{position: 'absolute', left: -14, top: -14, width: 46, height: 46, borderRadius: 23, background: C.yellow, border: `4px solid ${C.navy}`, fontFamily: LILITA, fontSize: 30, color: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{rank}</div>
		<img src={staticFile(`flags/${e.flag}.svg`)} style={{width: 90, height: 66, borderRadius: 8, objectFit: 'cover', border: `3px solid ${C.navy}`, boxShadow: '0 0 0 3px #fff'}} />
		<div style={{fontFamily: LILITA, fontSize: 34, color: '#fff', marginTop: 6, whiteSpace: 'nowrap'}}>{e.es.toUpperCase()}</div>
		<div style={{fontFamily: LILITA, fontSize: 40, color: CAT_COL[e.cat]}}>{fmt(e.score)}</div>
	</div>
);
const Final: React.FC<{ft: number; f: number}> = ({ft, f}) => {
	const sorted = [...LIST].sort((a, b) => b.score - a.score);
	const love = sorted.slice(0, 3), hate = sorted.slice(-3).reverse();
	return (
		<>
			{ft < 620 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, transform: `scale(${backOut((ft - 24) / 16) * (1 - easeInOut((ft - 590) / 24))})`}}>
					<div style={{fontFamily: LILITA, fontSize: 92, color: '#fff', ...strokeText(16), textShadow: `0 10px 0 ${C.red}`}}>EL MAPA DEL AMOR Y EL ODIO</div>
				</div>
			)}
			{ft >= 230 && ft < 640 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center', gap: 20, opacity: 1 - clamp01((ft - 610) / 24)}}>
					{CATS.map((c, i) => (
						<div key={c} style={{transform: `scale(${backOut((ft - 240 - i * 24) / 14)})`, width: 290, padding: '10px 0', borderRadius: 20, background: 'rgba(11,30,63,0.94)', border: `5px solid ${CAT_COL[c]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14}}>
							<Icon kind={c} size={56} />
							<div style={{textAlign: 'left'}}>
								<div style={{fontFamily: LILITA, fontSize: 60, lineHeight: 1, color: '#fff'}}>{LIST.filter((e) => e.cat === c).length}</div>
								<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, letterSpacing: 2, color: CAT_COL[c]}}>{CAT_TXT[c]}</div>
							</div>
						</div>
					))}
				</div>
			)}
			{ft >= 640 && (
				<AbsoluteFill style={{background: `rgba(8,20,40,${0.72 * clamp01((ft - 640) / 24)})`}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((ft - 650) / 14)})`}}>
						<div style={{fontFamily: LILITA, fontSize: 84, color: '#fff', ...strokeText(14), textShadow: `0 8px 0 ${C.red}`}}>EL PODIO</div>
					</div>
					<div style={{position: 'absolute', left: 120, top: 200, width: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
						<div style={{transform: `scale(${backOut((ft - 670) / 14)})`, display: 'flex', alignItems: 'center', gap: 12}}><Icon kind="amor" size={60} /><span style={{fontFamily: LILITA, fontSize: 60, color: CAT_COL.amor, ...strokeText(10)}}>LOS QUE MÁS LA AMAN</span></div>
						<div style={{display: 'flex', gap: 16}}>{love.map((e, i) => <MiniCard key={e.key} e={e} rank={i + 1} p={backOut((ft - 700 - i * 30) / 14)} />)}</div>
					</div>
					<div style={{position: 'absolute', left: 1000, top: 200, width: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
						{ft >= 960 && <div style={{transform: `scale(${backOut((ft - 970) / 14)})`, display: 'flex', alignItems: 'center', gap: 12}}><Icon kind="odio" size={60} /><span style={{fontFamily: LILITA, fontSize: 60, color: CAT_COL.odio, ...strokeText(10)}}>LOS QUE MÁS LA ODIAN</span></div>}
						{ft >= 1000 && <div style={{display: 'flex', gap: 16}}>{hate.map((e, i) => <MiniCard key={e.key} e={e} rank={i + 1} p={backOut((ft - 1020 - i * 30) / 14)} />)}</div>}
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 40}}>
						<div style={{transform: `scale(${backOut((ft - 690) / 16)})`}}><Hincha iso="ARG" mood={ft < 990 ? 'feliz' : 'enfado'} size={260} scarf={ARG_SCARF} blink={blinkAt(f, 4)} sweat={ft >= 990} look={ft < 990 ? [-0.6, -0.3] : [0.6, -0.3]} /></div>
					</div>
					{ft >= 1300 && (
						<div style={{position: 'absolute', left: 0, right: 0, top: 930, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((ft - 1300) / 14)})`}}>
							<Pill size={32} bg={C.yellow}>¿Y TÚ? ¿AMAS U ODIAS A ARGENTINA? ¡COMENTA!</Pill>
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
					<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1.05, color: '#fff', ...strokeText(14)}}>¿A QUÉ SELECCIÓN LE</div>
					<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1.05, color: C.yellow, ...strokeText(14)}}>TOMAMOS LA TEMPERATURA?</div>
				</div>
				<div style={{display: 'flex', gap: 22}}>
					{[['BRASIL', '#1BA34E'], ['ESPAÑA', '#E8A800'], ['MÉXICO', '#CE1126']].map(([n, c], i) => (
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
