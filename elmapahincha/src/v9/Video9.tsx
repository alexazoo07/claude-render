import React, {useMemo} from 'react';
import {AbsoluteFill, getInputProps, staticFile, useCurrentFrame} from 'remotion';
const DBG: string = String((getInputProps() as {dbg?: string}).dbg ?? '');
import {WorldLayer, Vis, WCam, bboxOf} from '../v5/WorldLayer5';
import {Mood} from '../Hincha';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {C} from '../data';
import {backOut, clamp01, easeInOut, easeOut, elastic, Panel, Pill, strokeText} from '../ui';
import {blinkAt, camPath, Confetti, Key, Subscribe} from '../common';
import {Hincha} from '../Hincha';
import {FlagPreload} from '../v2/Preload';
import {BY, CATS, CAT_COL, COUNTDOWN, LL, nota, Stadium, STADIUMS} from './data9';
import {StadiumArt} from './StadiumArt';

const FPS = 60;
// ---------------- timeline ----------------
const H_ITEM = 180;
type HookItem = {s: Stadium; q: string; big: string; unit: string};
const HOOK_ITEMS: HookItem[] = [
	{s: BY.rungrado, q: '¿EL MÁS GRANDE DEL MUNDO?', big: '114.000', unit: 'PERSONAS'},
	{s: BY.sofi, q: '¿EL MÁS CARO?', big: '+5.000', unit: 'MILLONES DE DÓLARES'},
	{s: BY.azteca, q: '¿EL MÁS MUNDIALISTA?', big: '3', unit: 'MUNDIALES INAUGURADOS'},
	{s: BY.bombonera, q: '¿EL QUE MÁS VIBRA?', big: 'NO TIEMBLA', unit: '¡LATE!'},
];
const H_BEST = HOOK_ITEMS.length * H_ITEM; // 720
const H_CATS = H_BEST + 180; // 900
const H_ASK = H_CATS + 180; // 1080
const HOOK_END = H_ASK + 180; // 1260
const INTRO = 360;
const STAD = 1380;
const S0 = HOOK_END + INTRO; // 1620
// stadium-scene marks
const M_CARD = 40, M_NAME = 50, M_CHIP = 110, M_FACT = [200, 470, 740], M_SCORE = 960, M_BAR = 990, M_NOTA = 1170;
const TEASE = 210, RECAP = 1200, OUTRO = 720;
type SIt = {s: Stadium; from: number; dur: number; i: number};
const _items: SIt[] = [];
export const TEASES: {from: number; dur: number; rank: number}[] = [];
let _t = S0;
COUNTDOWN.forEach((s, i) => { if (s.rank <= 3) { TEASES.push({from: _t, dur: TEASE, rank: s.rank}); _t += TEASE; } _items.push({s, from: _t, dur: STAD, i}); _t += STAD; });
export const V9_ITEMS = _items;
export const RECAP0 = _t;
export const OUTRO0 = RECAP0 + RECAP;
export const V9_TOTAL = OUTRO0 + OUTRO;

// ---------------- camera ----------------
const cityXY = (s: Stadium) => LL(s.lon, s.lat);
const sceneCam = (s: Stadium): WCam => {
	const b = bboxOf(s.iso);
	const z = Math.max(1.1, Math.min(4.2, Math.min(560 / (b.w + 30), 420 / (b.h + 30))));
	const [x, y] = cityXY(s);
	return {x: x + (960 - 430) / z, y: y + (540 - 590) / z, z};
};
const hookCam = (s: Stadium): WCam => { const [x, y] = cityXY(s); return {x, y: y + 40 / 2.6, z: 2.6}; };
const WORLD_VIEW: WCam = {x: 1915, y: 900, z: 0.52};
const RECAP_VIEW: WCam = {x: 1915 + (960 - 500) / 0.4, y: 860, z: 0.4};
const KEYS_CAM: Key[] = (() => {
	const k: Key[] = [];
	const add = (f: number, c: WCam) => k.push([f, c.x, c.y, c.z]);
	HOOK_ITEMS.forEach((h, i) => { const c = hookCam(h.s); add(i * H_ITEM + (i ? 30 : 0), c); add(i * H_ITEM + H_ITEM - 4, {...c, z: c.z * 1.12}); });
	add(H_BEST + 50, WORLD_VIEW); add(HOOK_END + INTRO - 30, {...WORLD_VIEW, z: WORLD_VIEW.z * 1.1});
	for (const it of V9_ITEMS) { const c = sceneCam(it.s); add(it.from + 50, c); add(it.from + it.dur - 10, {...c, z: c.z * 1.07}); }
	for (const tz of TEASES) { add(tz.from + 60, {...WORLD_VIEW, z: 0.6}); add(tz.from + tz.dur - 10, {...WORLD_VIEW, z: 0.66}); }
	add(RECAP0 + 60, RECAP_VIEW); add(OUTRO0 - 10, {...RECAP_VIEW, z: RECAP_VIEW.z * 1.05});
	add(OUTRO0 + 60, WORLD_VIEW); add(V9_TOTAL, {...WORLD_VIEW, z: WORLD_VIEW.z * 1.06});
	k.sort((a, b) => a[0] - b[0]);
	return k;
})();

// ---------------- sfx & music ----------------
export const v9Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f, name, vol});
	S(0, 'crowd_roar', 0.35);
	HOOK_ITEMS.forEach((_, i) => {
		const f0 = i * H_ITEM;
		S(f0, `whoosh_${(i % 4) + 1}`, 0.45); S(f0 + 10, 'slap', 0.45); S(f0 + 40, 'pop_2', 0.4);
		for (let k = 0; k < 8; k++) S(f0 + 60 + k * 5, 'tick', 0.2);
		S(f0 + 100, i === 3 ? 'boom' : 'confirm', i === 3 ? 0.5 : 0.4);
		if (i === 3) [0, 1, 2, 3].forEach((k) => S(f0 + 70 + k * 26, 'kick', 0.4));
	});
	S(H_BEST, 'whoosh_4', 0.5); S(H_BEST + 16, 'slap', 0.5); S(H_BEST + 30, 'drumroll', 0.4);
	for (let k = 0; k < 20; k++) S(H_BEST + 60 + k * 4, 'click', 0.2);
	S(H_BEST + 150, 'boom', 0.5);
	S(H_CATS, 'whoosh_2', 0.45); [0, 1, 2, 3].forEach((k) => S(H_CATS + 30 + k * 22, `pop_${k + 1}`, 0.45)); S(H_CATS + 130, 'confirm', 0.35);
	S(H_ASK, 'riser', 0.35); S(H_ASK + 40, 'boom', 0.55); S(H_ASK + 44, 'crowd_ohh', 0.45); S(H_ASK + 110, 'pop_3', 0.4);
	S(HOOK_END - 10, 'whoosh_1', 0.5); S(HOOK_END + 6, 'slap', 0.5); S(HOOK_END + 10, 'whistle_long', 0.3); S(HOOK_END + 80, 'crowd_roar', 0.3);
	for (let k = 0; k < 5; k++) S(HOOK_END + 120 + k * 22, `pop_${(k % 4) + 1}`, 0.35);
	S(HOOK_END + INTRO - 40, 'riser', 0.3);
	for (const it of V9_ITEMS) {
		const f0 = it.from;
		S(f0, 'whoosh_' + ((it.i % 4) + 1), 0.45); S(f0 + 12, 'boom', 0.45); S(f0 + 14, 'crowd_roar', 0.22);
		S(f0 + M_CARD, 'whoosh_3', 0.35); S(f0 + M_CARD + 18, 'slap', 0.4); S(f0 + M_NAME + 10, 'pop_1', 0.35);
		[0, 1, 2, 3].forEach((k) => S(f0 + M_CHIP + k * 20, `pop_${k + 1}`, 0.35));
		for (let k = 0; k < 10; k++) S(f0 + M_CHIP + 4 + k * 5, 'tick', 0.16);
		M_FACT.forEach((m, j) => { S(f0 + m - 8, 'whoosh_2', 0.25); S(f0 + m, 'pop_3', 0.42); S(f0 + m + 6, j === 0 ? 'select' : 'click', 0.3); });
		S(f0 + M_SCORE, 'whoosh_4', 0.35);
		[0, 1, 2, 3].forEach((k) => { S(f0 + M_BAR + k * 40, 'up', 0.3); for (let q = 0; q < 5; q++) S(f0 + M_BAR + k * 40 + q * 5, 'tick', 0.14); });
		S(f0 + M_NOTA - 40, 'drumroll', 0.38); S(f0 + M_NOTA, 'boom', 0.55); S(f0 + M_NOTA + 2, 'crowd_roar', 0.3); S(f0 + M_NOTA + 4, 'confirm', 0.35);
		S(f0 + it.dur - 24, 'whoosh_1', 0.3);
		if (it.s.rank === 1) { S(f0 + M_NOTA + 10, 'crowd_roar', 0.5); S(f0 + M_NOTA + 20, 'whistle_long', 0.3); }
	}
	for (const tz of TEASES) {
		S(tz.from, 'whoosh_4', 0.5); S(tz.from + 14, 'slap', 0.5); S(tz.from + 40, 'drumroll', 0.55); S(tz.from + 60, 'riser', 0.3);
		[0, 1, 2].forEach((k) => S(tz.from + 50 + k * 18, `pop_${k + 1}`, 0.4)); S(tz.from + 170, 'boom', 0.5); S(tz.from + 172, 'crowd_ohh', 0.4);
	}
	S(RECAP0, 'whoosh_2', 0.5); S(RECAP0 + 20, 'slap', 0.5);
	for (let k = 0; k < 20; k++) S(RECAP0 + 80 + k * 18, `pop_${(k % 4) + 1}`, 0.3);
	S(RECAP0 + 80 + 19 * 18 + 6, 'confirm', 0.45); S(RECAP0 + 460, 'crowd_roar', 0.35); S(RECAP0 + 700, 'pop_3', 0.45);
	S(OUTRO0, 'whoosh_2', 0.4); S(OUTRO0 + 20, 'slap', 0.45); [0, 1, 2].forEach((i) => S(OUTRO0 + 70 + i * 14, `pop_${i + 1}`, 0.4)); S(OUTRO0 + 300, 'pop_4', 0.4); S(OUTRO0 + 350, 'click', 0.5); S(OUTRO0 + 352, 'bong', 0.35);
	s.sort((a, b) => a.f - b.f);
	return s;
};
export const v9Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	const top3 = TEASES[0].from;
	return [`m_tense:0:${sec(HOOK_END + 30)}`, `m_happy:${sec(HOOK_END)}:${sec(top3 + 40)}`, `m_tense:${sec(top3)}:${sec(V9_ITEMS[V9_ITEMS.length - 1].from + M_NOTA + 20)}`, `m_triumph:${sec(V9_ITEMS[V9_ITEMS.length - 1].from + M_NOTA)}:${sec(V9_TOTAL)}`].join(',');
};

// ---------------- small UI ----------------
const fmt = (v: number) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const Txt: React.FC<{children: React.ReactNode; size?: number; color?: string; p?: number; shadow?: string; style?: React.CSSProperties}> = ({children, size = 84, color = '#fff', p = 1, shadow = C.navy, style}) => (
	<div style={{transform: `scale(${Math.max(0, p)})`, fontFamily: LILITA, fontSize: size, color, ...strokeText(size * 0.15), textShadow: `0 ${size * 0.08}px 0 ${shadow}`, whiteSpace: 'nowrap', lineHeight: 1.05, ...style}}>{children}</div>
);
const Flag: React.FC<{f: string; w: number}> = ({f, w}) => <img src={staticFile(`flags/${f}.svg`)} style={{width: w, height: w * 0.72, borderRadius: w * 0.1, border: `3px solid ${C.navy}`, objectFit: 'cover', boxShadow: '0 0 0 3px #fff', flexShrink: 0}} />;
const CardFrame: React.FC<{s: Stadium; w: number; t: number; id: string; children?: React.ReactNode}> = ({s, w, t, id, children}) => (
	<div style={{position: 'relative', width: w, height: w * 0.57, borderRadius: 26, overflow: 'hidden', border: `7px solid ${C.navy}`, boxShadow: '0 0 0 6px #fff, 0 18px 0 rgba(0,0,0,0.35)', background: '#000'}}>
		{!DBG.includes('noart') && <StadiumArt art={s.art} t={t} w={w - 14} h={(w - 14) * 0.57} id={id} />}
		{children}
	</div>
);
const CatIcon: React.FC<{i: number; s: number}> = ({i, s}) => {
	const col = '#fff';
	return (
		<svg width={s} height={s} viewBox="0 0 40 40">
			{i === 0 && <g fill="none" stroke={col} strokeWidth={3.5} strokeLinecap="round"><circle cx={20} cy={20} r={14} /><path d="M20 11 V20 L26 24" /></g>}
			{i === 1 && <g fill={col}><path d="M8 26 L12 12 L16 26Z" /><path d="M17 26 L21 9 L25 26Z" /><path d="M26 26 L30 13 L34 26Z" /><rect x={6} y={27} width={30} height={5} rx={2} /></g>}
			{i === 2 && <g fill="none" stroke={col} strokeWidth={3.5} strokeLinejoin="round"><path d="M6 30 L20 8 L34 30Z" /><path d="M13 30 L20 19 L27 30" /></g>}
			{i === 3 && <g fill={col}><circle cx={13} cy={14} r={5} /><circle cx={27} cy={14} r={5} /><path d="M4 32 Q13 18 22 32Z" /><path d="M18 32 Q27 18 36 32Z" /></g>}
		</svg>
	);
};

// ---------------- ticker ----------------
const TICKER = [
	'EL ESTADIO MÁS GRANDE DEL MUNDO: RUNGRADO 1º DE MAYO (PIONYANG), UNAS 114.000 PERSONAS',
	'EL MÁS CARO DE LA HISTORIA: SOFI STADIUM (LOS ÁNGELES), MÁS DE 5.000 MILLONES DE DÓLARES',
	'EL AZTECA ES EL ÚNICO ESTADIO QUE HA INAUGURADO 3 MUNDIALES: 1970, 1986 Y 2026',
	'CRITERIOS: HISTORIA · AMBIENTE · DISEÑO · AFORO · NOTA FINAL = MEDIA DE LAS 4',
	'AFOROS ACTUALIZADOS A OCTUBRE DE 2026',
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
				<svg width={36} height={26} viewBox="0 0 36 26"><ellipse cx={18} cy={13} rx={16} ry={10} fill={C.navy} /><ellipse cx={18} cy={13} rx={9} ry={5} fill="#3FA34D" /></svg>
				ESTADIOS EN DATOS
			</div>
		</div>
	);
};

// ---------------- map pin ----------------
const Pin: React.FC<{s: Stadium; z: number; p: number; big: boolean; f: number}> = ({s, z, p, big, f}) => {
	const [x, y] = cityXY(s);
	const k = (big ? 1 : 0.6) / z * Math.max(0, p);
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			{big && <circle cx={0} cy={0} r={30 + ((f % 50) / 50) * 40} fill="none" stroke={C.yellow} strokeWidth={4} opacity={1 - (f % 50) / 50} />}
			<ellipse cx={0} cy={2} rx={14} ry={6} fill="rgba(0,0,0,0.4)" />
			<path d="M0 0 C-10 -14 -26 -26 -26 -46 A26 26 0 1 1 26 -46 C26 -26 10 -14 0 0Z" fill={big ? C.red : '#fff'} stroke={C.navy} strokeWidth={5} />
			<circle cx={0} cy={-46} r={17} fill={big ? '#fff' : C.navy} />
			{big ? <g><ellipse cx={0} cy={-46} rx={12} ry={8} fill={C.navy} /><ellipse cx={0} cy={-46} rx={6} ry={3.5} fill="#3FA34D" /></g> : <text x={0} y={-38} textAnchor="middle" fontFamily="Lilita" fontSize={24} fill="#fff">{s.rank}</text>}
		</g>
	);
};

// ---------------- main ----------------
export const Video9: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS_CAM, f, 9);
	const cur = V9_ITEMS.find((it) => f >= it.from && f < it.from + it.dur);
	const t = cur ? f - cur.from : 0;
	const vis: Record<string, Vis> = {};
	// hook countries pop in/out
	if (f < H_BEST + 30) HOOK_ITEMS.forEach((h, i) => {
		const a = i * H_ITEM + 14, b = (i + 1) * H_ITEM + 10;
		if (f < a || f > b) return;
		const p = Math.max(0, elastic((f - a) / FPS)) * (1 - easeInOut((f - b + 20) / 20));
		vis[h.s.iso] = {flag: h.s.flag, pop: p, mood: 'grito', blink: blinkAt(f, i), open: 0.5 + 0.5 * Math.sin(f / 4), faceScale: 1.2};
	});
	V9_ITEMS.forEach((it, j) => {
		const tp = f - it.from - 30;
		if (tp < 0) return;
		const isCur = cur === it;
		let mood: Mood = 'feliz';
		if (isCur && t >= M_NOTA) mood = 'grito';
		vis[it.s.iso] = {flag: it.s.flag, pop: Math.max(0, elastic(tp / FPS)), mood, blink: blinkAt(f, j + 5), open: 0.5 + 0.5 * Math.sin(f / 4 + j), faceScale: isCur ? 1.25 : 1, glow: isCur ? C.yellow : undefined};
	});
	const curTease = TEASES.find((tz) => f >= tz.from && f < tz.from + tz.dur);
	const pins = V9_ITEMS.filter((it) => f >= it.from + 56);
	const tickIn = f >= HOOK_END && f < OUTRO0 ? easeOut((f - HOOK_END) / 24) * (1 - easeInOut((f - OUTRO0 + 30) / 24)) : 0;
	const hookShake = f < HOOK_END ? (() => { const hits = [10, 190, 370, 550, 870, H_ASK + 40]; const h = hits.find((x) => f >= x && f < x + 14); return h !== undefined ? Math.sin(f * 3) * (h + 14 - f) * 0.9 : 0; })() : 0;
	const sceneShake = cur && t >= 12 && t < 26 ? Math.sin(f * 3) * (26 - t) * 0.8 : cur && t >= M_NOTA && t < M_NOTA + 14 ? Math.sin(f * 3) * (M_NOTA + 14 - t) * 0.8 : 0;
	const shake = hookShake + sceneShake;
	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			<FlagPreload flags={STADIUMS.map((s) => s.flag)} />
			<AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
				{!DBG.includes('nomap') && <WorldLayer cam={cam} vis={vis} ring={null}>
					{f < H_BEST && (() => { const i = Math.floor(f / H_ITEM); return <Pin s={HOOK_ITEMS[i].s} z={cam.z} p={backOut((f - i * H_ITEM - 6) / 14)} big f={f} />; })()}
					{pins.map((it) => <Pin key={it.s.key} s={it.s} z={cam.z} p={backOut((f - it.from - 56) / 14)} big={cur === it} f={f} />)}
				</WorldLayer>}
				{f < H_BEST + 40 && <HookItems f={f} />}
				{f >= H_BEST && f < HOOK_END + 20 && <HookTail f={f} />}
				{f >= HOOK_END - 10 && f < S0 + 20 && <Intro f={f} />}
				{cur && !DBG.includes('noui') && <Scene it={cur} t={t} f={f} />}
				{curTease && <Tease tz={curTease} f={f} />}
				{f >= RECAP0 && f < OUTRO0 + 20 && <Recap t={f - RECAP0} f={f} />}
				{f >= OUTRO0 && <Outro t={f - OUTRO0} f={f} />}
				{cur && cur.s.rank === 1 && <Confetti f={f} start={cur.from + M_NOTA} n={160} />}
			</AbsoluteFill>
			{f >= HOOK_END - 14 && f < HOOK_END + 16 && <AbsoluteFill style={{background: '#fff', opacity: 0.85 * Math.sin(clamp01((f - HOOK_END + 14) / 30) * Math.PI)}} />}
			{tickIn > 0 && <Ticker f={f} y={(1 - tickIn) * 80} />}
		</AbsoluteFill>
	);
};

// ---------------- HOOK ----------------
const HookItems: React.FC<{f: number}> = ({f}) => {
	const i = Math.min(HOOK_ITEMS.length - 1, Math.floor(f / H_ITEM));
	const h = HOOK_ITEMS[i];
	const t = f - i * H_ITEM;
	const out = f >= H_BEST ? easeInOut((f - H_BEST) / 30) : 0;
	const pin = backOut(t / 16);
	const qp = backOut((t - 6) / 12);
	const np = backOut((t - 54) / 14);
	const beat = i === 3 ? 1 + 0.05 * Math.max(0, Math.sin(((t - 70) / 26) * Math.PI * 2)) * (t > 70 ? 1 : 0) : 1;
	const num = h.big.match(/^\+?[\d.]+$/) ? (() => { const v = parseInt(h.big.replace(/[+.]/g, ''), 10); const shown = v * easeOut(clamp01((t - 54) / 46)); return (h.big.startsWith('+') ? '+' : '') + fmt(shown); })() : h.big;
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(5,15,35,0) 30%, rgba(5,15,35,0.6) 100%)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center'}}>
				<Txt size={86} color={C.yellow} p={qp} shadow={C.red}>{h.q}</Txt>
			</div>
			<div style={{position: 'absolute', left: 960 - 470, top: 170, transform: `scale(${pin * beat}) rotate(${(1 - pin) * -8 + (i % 2 ? 1.5 : -1.5)}deg)`}}>
				<CardFrame s={h.s} w={940} t={f} id={`hk${i}`}>
					<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 86, background: 'linear-gradient(0deg, rgba(5,15,35,0.92), rgba(5,15,35,0))'}} />
					<div style={{position: 'absolute', left: 22, bottom: 16, display: 'flex', alignItems: 'center', gap: 14}}>
						<Flag f={h.s.flag} w={64} />
						<div>
							<div style={{fontFamily: LILITA, fontSize: 44, color: '#fff', lineHeight: 1}}>{h.s.name}</div>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: 'rgba(255,255,255,0.85)'}}>{h.s.city.toUpperCase()} · {h.s.country.toUpperCase()}</div>
						</div>
					</div>
				</CardFrame>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 735, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
				<Txt size={i === 3 ? 120 : 150} p={np} shadow={C.red}>{num}</Txt>
				<Txt size={50} color={C.yellow} p={backOut((t - 70) / 12)}>{h.unit}</Txt>
			</div>
			{/* progress dots */}
			<div style={{position: 'absolute', right: 40, top: 60, display: 'flex', flexDirection: 'column', gap: 10}}>
				{HOOK_ITEMS.map((_, k) => <div key={k} style={{width: 22, height: 22, borderRadius: 11, background: k <= i ? C.yellow : 'rgba(255,255,255,0.25)', border: `3px solid ${C.navy}`}} />)}
			</div>
		</AbsoluteFill>
	);
};

const HookTail: React.FC<{f: number}> = ({f}) => {
	const t = f - H_BEST;
	const out = easeInOut((f - HOOK_END + 16) / 16);
	// phase 1: PERO... ¿CUÁL ES EL MEJOR? + 20 mystery cards
	const p1 = t < 180;
	const p2 = t >= 180 && t < 360;
	const p3 = t >= 360;
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{background: 'rgba(5,15,35,0.45)', opacity: clamp01(t / 20)}} />
			{p1 && (
				<>
					<div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
						<Txt size={70} p={backOut((t - 10) / 12)}>PERO DE VERDAD...</Txt>
						<Txt size={104} color={C.yellow} p={backOut((t - 22) / 14)} shadow={C.red}>¿CUÁL ES EL MEJOR DEL MUNDO?</Txt>
					</div>
					<div style={{position: 'absolute', left: 160, right: 160, top: 360, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 16}}>
						{Array.from({length: 20}, (_, k) => {
							const p = backOut((t - 60 - k * 4) / 10);
							const flip = t >= 150 ? Math.sin(clamp01((t - 150 - (k % 10) * 1.5) / 10) * Math.PI) : 0;
							return (
								<div key={k} style={{height: 210, borderRadius: 16, background: k === 19 ? 'linear-gradient(160deg, #FFE27A, #E0A800)' : 'linear-gradient(160deg, #2C4F8F, #17305E)', border: `5px solid ${C.navy}`, boxShadow: '0 0 0 4px #fff, 0 8px 0 rgba(0,0,0,0.35)', transform: `scale(${Math.max(0, p)}) translateY(${-flip * 20}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
									<div style={{fontFamily: LILITA, fontSize: 84, color: k === 19 ? C.navy : '#fff', lineHeight: 1}}>?</div>
									<div style={{fontFamily: LILITA, fontSize: 34, color: k === 19 ? C.navy : C.yellow}}>#{20 - k}</div>
								</div>
							);
						})}
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center'}}>
						<Pill size={34} style={{transform: `scale(${backOut((t - 150) / 12)})`}}>20 ESTADIOS · 1 SOLO GANADOR</Pill>
					</div>
				</>
			)}
			{p2 && (() => {
				const u = t - 180;
				return (
					<>
						<div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center'}}>
							<Txt size={92} p={backOut((u - 4) / 12)}>LOS PUNTUAMOS EN</Txt>
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', gap: 34}}>
							{CATS.map((c, k) => {
								const p = backOut((u - 30 - k * 22) / 12);
								return (
									<div key={c} style={{transform: `scale(${Math.max(0, p)}) rotate(${(k % 2 ? 3 : -3) * (1 - p)}deg)`, width: 360, height: 400, borderRadius: 30, background: CAT_COL[k], border: `7px solid ${C.navy}`, boxShadow: '0 0 0 6px #fff, 0 14px 0 rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18}}>
										<div style={{width: 170, height: 170, borderRadius: 85, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><CatIcon i={k} s={110} /></div>
										<div style={{fontFamily: LILITA, fontSize: 56, color: C.navy}}>{c}</div>
										<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: C.navy, opacity: 0.8}}>DE 0 A 10</div>
									</div>
								);
							})}
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center'}}>
							<Txt size={64} color={C.yellow} p={backOut((u - 130) / 12)}>LA MEDIA DECIDE EL PUESTO</Txt>
						</div>
					</>
				);
			})()}
			{p3 && (() => {
				const u = t - 360;
				const pulse = 1 + 0.04 * Math.sin(u / 5);
				return (
					<>
						<div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center'}}>
							<Txt size={88} p={backOut((u - 4) / 12)}>¿CUÁL CREES QUE ES EL Nº 1?</Txt>
						</div>
						<div style={{position: 'absolute', left: 960 - 230, top: 220, width: 460, height: 520, borderRadius: 36, background: 'linear-gradient(160deg, #FFE27A, #E0A800)', border: `8px solid ${C.navy}`, boxShadow: `0 0 0 7px #fff, 0 18px 0 rgba(0,0,0,0.35)`, transform: `scale(${backOut((u - 30) / 14) * pulse}) rotate(-3deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
							<div style={{fontFamily: LILITA, fontSize: 300, lineHeight: 0.9, color: C.navy}}>1</div>
							<div style={{fontFamily: LILITA, fontSize: 120, lineHeight: 1, color: C.red, ...strokeText(10, '#fff')}}>?</div>
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center'}}>
							<Pill size={38} bg="#fff" style={{transform: `scale(${backOut((u - 100) / 12)})`}}>ESCRÍBELO EN LOS COMENTARIOS</Pill>
						</div>
					</>
				);
			})()}
		</AbsoluteFill>
	);
};

// ---------------- INTRO ----------------
const Intro: React.FC<{f: number}> = ({f}) => {
	const t = f - HOOK_END;
	const out = easeInOut((f - S0 + 30) / 24);
	const strip = STADIUMS.slice(0, 5);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(5,15,35,0.15) 20%, rgba(5,15,35,0.7) 100%)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
				<Txt size={80} p={backOut((t - 6) / 12)}>LOS</Txt>
				<Txt size={250} color={C.yellow} p={backOut((t - 16) / 14)} shadow={C.red}>20</Txt>
				<Txt size={96} p={backOut((t - 28) / 14)}>MEJORES ESTADIOS</Txt>
				<Txt size={96} color={C.yellow} p={backOut((t - 40) / 14)} shadow={C.red}>DEL MUNDO</Txt>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center', gap: 26}}>
				{strip.map((s, k) => (
					<div key={s.key} style={{transform: `scale(${backOut((t - 110 - k * 20) / 12)}) rotate(${k % 2 ? 4 : -4}deg)`}}>
						<CardFrame s={s} w={260} t={f} id={`in${k}`} />
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

// ---------------- STADIUM SCENE ----------------
const Scene: React.FC<{it: (typeof V9_ITEMS)[number]; t: number; f: number}> = ({it, t, f}) => {
	const s = it.s;
	const out = easeInOut((t - it.dur + 26) / 22);
	const slideL = out * -900, slideR = out * 1100;
	// big rank slam then fly to the badge
	const slam = t < 70;
	const sp = t < 14 ? 3 - 2 * easeOut(t / 14) : 1;
	const fly = easeInOut((t - 36) / 26);
	const n = nota(s);
	const facts = s.facts;
	const fi = M_FACT.reduce((a, m, k) => (t >= m ? k : a), -1);
	const ft = fi >= 0 ? t - M_FACT[fi] : 0;
	const [cx, cy] = [430, 590];
	const cardP = backOut((t - M_CARD) / 24);
	const cardX = cx + (1375 - cx) * easeOut((t - M_CARD) / 24), cardY = cy + (318 - cy) * easeOut((t - M_CARD) / 24);
	const chips: [string, string, string][] = [
		['AFORO', t >= M_CHIP ? fmt(s.cap * easeOut(clamp01((t - M_CHIP) / 50))) + (s.capNote ? '*' : '') : '0', C.yellow],
		['INAUGURADO', String(s.year), '#4FC3F7'],
		['EQUIPO', s.team, '#2EC46B'],
		[s.stat4[0], s.stat4[1], '#FF8A3D'],
	];
	const done = V9_ITEMS.filter((x) => x.from + M_NOTA <= it.from + t);
	return (
		<AbsoluteFill>
			{/* name panel */}
			<div style={{position: 'absolute', left: 36, top: 28, transform: `translateX(${slideL + (1 - backOut((t - M_NAME) / 16)) * -900}px)`}}>
				<Panel style={{width: 800, padding: '12px 18px 14px 128px', position: 'relative', borderColor: C.yellow}}>
					<div style={{fontFamily: LILITA, fontSize: s.name.length > 18 ? 50 : 58, lineHeight: 1, color: '#fff', whiteSpace: 'nowrap'}}>{s.name}</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 8}}>
						<Flag f={s.flag} w={46} />
						<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap'}}>{s.city.toUpperCase()} · {s.country.toUpperCase()}</span>
					</div>
				</Panel>
			</div>
			{/* rank: slam in the middle, then becomes the badge */}
			{(() => {
				const x0 = 960, y0 = 470, x1 = 36 + 62, y1 = 28 + 62;
				const x = x0 + (x1 - x0) * fly, y = y0 + (y1 - y0) * fly;
				const size = 330 + (110 - 330) * fly;
				return (
					<div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `translateX(${slideL}px) scale(${slam ? sp : 1})`, borderRadius: '50%', background: C.red, border: `${8 - fly * 3}px solid ${C.navy}`, boxShadow: '0 0 0 5px #fff, 0 10px 0 rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: size * 0.11, letterSpacing: 2, color: '#fff', marginBottom: -size * 0.03}}>PUESTO</div>
						<div style={{fontFamily: LILITA, fontSize: size * 0.5, lineHeight: 1, color: '#fff', ...strokeText(size * 0.03)}}>{s.rank}</div>
					</div>
				);
			})()}
			{/* chips 2x2 */}
			<div style={{position: 'absolute', left: 36, top: 172, width: 840, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, transform: `translateX(${slideL}px)`}}>
				{chips.map(([a, b, col], k) => {
					const p = backOut((t - M_CHIP - k * 20) / 12);
					return (
						<div key={a} style={{transform: `scale(${Math.max(0, p)})`, height: 74, padding: '6px 14px', boxSizing: 'border-box', borderRadius: 16, background: 'rgba(11,30,63,0.94)', border: `4px solid ${col}`, boxShadow: '0 6px 0 rgba(0,0,0,0.3)'}}>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, letterSpacing: 2, color: col}}>{a}</div>
							<div style={{fontFamily: LILITA, fontSize: b.length > 24 ? 24 : b.length > 16 ? 30 : 36, lineHeight: 1.05, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{b}</div>
						</div>
					);
				})}
			</div>
			{s.capNote && t >= M_CHIP + 40 && <div style={{position: 'absolute', left: 36, top: 352, padding: '4px 12px', borderRadius: 10, background: 'rgba(11,30,63,0.92)', border: `3px solid ${C.yellow}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 18, color: '#fff', transform: `translateX(${slideL}px) scale(${backOut((t - M_CHIP - 40) / 12)})`, transformOrigin: 'left center'}}>* aforo {s.capNote}</div>}
			{/* stadium card */}
			{t >= M_CARD && (
				<div style={{position: 'absolute', left: cardX - 500, top: cardY - 290, transform: `translateX(${slideR}px) scale(${Math.max(0.05, cardP)}) rotate(${(1 - cardP) * 10 + 1.2}deg)`}}>
					<CardFrame s={s} w={1000} t={f} id={`sc${s.key}`}>
						<div style={{position: 'absolute', left: 16, top: 16, padding: '6px 16px', borderRadius: 12, background: C.yellow, border: `4px solid ${C.navy}`, fontFamily: LILITA, fontSize: 30, color: C.navy}}>#{s.rank} {s.short}</div>
					</CardFrame>
					{/* nota stamp */}
					{t >= M_NOTA && (
						<div style={{position: 'absolute', right: -30, top: -34, width: 210, height: 210, borderRadius: '50%', background: n >= 9 ? '#2EC46B' : n >= 8 ? C.yellow : '#FF8A3D', border: `8px solid ${C.navy}`, boxShadow: '0 0 0 6px #fff, 0 10px 0 rgba(0,0,0,0.35)', transform: `scale(${1 + 2 * (1 - easeOut((t - M_NOTA) / 12))}) rotate(-10deg)`, opacity: clamp01((t - M_NOTA) / 6), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: C.navy}}>NOTA</div>
							<div style={{fontFamily: LILITA, fontSize: 92, lineHeight: 0.95, color: C.navy}}>{n.toFixed(1).replace('.', ',')}</div>
						</div>
					)}
				</div>
			)}
			{/* facts */}
			{fi >= 0 && (
				<div style={{position: 'absolute', left: 878, top: 640, width: 1000, transform: `translateX(${slideR}px)`}}>
					<Panel style={{padding: '12px 22px 16px', borderColor: '#C58BFF', minHeight: 150, boxSizing: 'border-box'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: '#fff', background: '#8E5BD9', padding: '4px 12px', borderRadius: 8}}>DATO CURIOSO</span>
							<div style={{display: 'flex', gap: 6}}>{facts.map((_, k) => <div key={k} style={{width: 34, height: 8, borderRadius: 4, background: k <= fi ? '#C58BFF' : 'rgba(255,255,255,0.2)'}} />)}</div>
						</div>
						<div style={{marginTop: 10, fontFamily: LILITA, fontSize: 40, lineHeight: 1.12, color: '#fff', opacity: clamp01(ft / 8), transform: `translateY(${(1 - easeOut(ft / 14)) * 30}px)`}}>{facts[fi]}</div>
					</Panel>
				</div>
			)}
			{/* ranking ladder */}
			<div style={{position: 'absolute', left: 878, top: 832, width: 1000, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8, transform: `translateX(${slideR}px) translateY(${(1 - easeOut((t - 60) / 20)) * 300}px)`}}>
				{Array.from({length: 20}, (_, k) => {
					const r = 20 - k;
					const d = done.find((x) => x.s.rank === r);
					const isCur = r === s.rank;
					return (
						<div key={k} style={{height: 80, borderRadius: 12, background: d ? (isCur ? C.yellow : '#2EC46B') : isCur ? '#FFFFFF' : 'rgba(11,30,63,0.9)', border: `3px solid ${isCur ? '#fff' : C.navy}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: isCur ? `scale(${1 + 0.06 * Math.sin(f / 6)})` : undefined}}>
							<div style={{fontFamily: LILITA, fontSize: 28, lineHeight: 1, color: d || isCur ? C.navy : 'rgba(255,255,255,0.6)'}}>#{r}</div>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 11, color: C.navy, whiteSpace: 'nowrap'}}>{d ? d.s.short : isCur ? '???' : ''}</div>
						</div>
					);
				})}
			</div>
			{/* score panel */}
			{t >= M_SCORE && (
				<div style={{position: 'absolute', left: 36, top: 742, width: 820, transform: `translateX(${slideL + (1 - backOut((t - M_SCORE) / 18)) * -900}px)`}}>
					<Panel style={{padding: '12px 18px 14px', borderColor: '#4FC3F7'}}>
						<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: '#4FC3F7', marginBottom: 6}}>PUNTUACIÓN EL MAPA HINCHA</div>
						{CATS.map((c, k) => {
							const p = easeOut((t - M_BAR - k * 40) / 30);
							const v = s.scores[k];
							return (
								<div key={c} style={{display: 'flex', alignItems: 'center', gap: 12, height: 44}}>
									<div style={{width: 40, height: 36, borderRadius: 8, background: CAT_COL[k], display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px solid ${C.navy}`}}><CatIcon i={k} s={26} /></div>
									<div style={{width: 150, fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: '#fff'}}>{c}</div>
									<div style={{flex: 1, height: 24, borderRadius: 12, background: 'rgba(255,255,255,0.12)', border: `3px solid ${C.navy}`, overflow: 'hidden'}}>
										<div style={{width: `${v * 10 * p}%`, height: '100%', background: CAT_COL[k]}} />
									</div>
									<div style={{width: 64, textAlign: 'right', fontFamily: LILITA, fontSize: 34, color: '#fff'}}>{(v * p).toFixed(1).replace('.', ',')}</div>
								</div>
							);
						})}
					</Panel>
				</div>
			)}
		</AbsoluteFill>
	);
};

// ---------------- TOP-3 TEASE ----------------
const Tease: React.FC<{tz: {from: number; dur: number; rank: number}; f: number}> = ({tz, f}) => {
	const t = f - tz.from;
	const inP = clamp01(t / 16), outP = easeInOut((t - tz.dur + 18) / 18);
	const lines: Record<number, [string, string]> = {3: ['ENTRAMOS EN EL', 'TOP 3'], 2: ['Y EN EL', 'PUESTO 2...'], 1: ['Y EL MEJOR ESTADIO DEL MUNDO ES...', 'EL Nº 1']};
	const [a, b] = lines[tz.rank];
	const pulse = 1 + 0.05 * Math.sin(t / 3);
	return (
		<AbsoluteFill style={{opacity: 1 - outP}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(40,10,10,0.75) 0%, rgba(5,10,25,0.92) 70%)', opacity: inP}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
				<Txt size={tz.rank === 1 ? 68 : 80} p={backOut((t - 8) / 12)}>{a}</Txt>
				<Txt size={tz.rank === 1 ? 150 : 170} color={C.yellow} p={backOut((t - 20) / 14) * pulse} shadow={C.red}>{b}</Txt>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', gap: 40}}>
				{[3, 2, 1].map((r, k) => {
					const p = backOut((t - 50 - k * 18) / 12);
					const known = r > tz.rank;
					const cur = r === tz.rank;
					const st = COUNTDOWN.find((x) => x.rank === r)!;
					return (
						<div key={r} style={{transform: `scale(${Math.max(0, p) * (cur ? pulse : 0.9)}) translateY(${cur ? -20 : 0}px)`, width: 300, height: 330, borderRadius: 28, background: cur ? 'linear-gradient(160deg, #FFE27A, #E0A800)' : known ? '#2EC46B' : 'linear-gradient(160deg, #2C4F8F, #17305E)', border: `7px solid ${C.navy}`, boxShadow: '0 0 0 6px #fff, 0 12px 0 rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
							<div style={{fontFamily: LILITA, fontSize: 70, color: cur ? C.navy : '#fff'}}>#{r}</div>
							{known ? <div style={{fontFamily: LILITA, fontSize: 38, color: C.navy, textAlign: 'center', padding: '0 12px'}}>{st.short}</div> : <div style={{fontFamily: LILITA, fontSize: 130, lineHeight: 1, color: cur ? C.red : '#fff'}}>?</div>}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// ---------------- RECAP ----------------
const Recap: React.FC<{t: number; f: number}> = ({t, f}) => {
	const out = easeInOut((t - RECAP + 20) / 20);
	const list = [...COUNTDOWN];
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<div style={{position: 'absolute', left: 40, top: 40, transform: `scale(${backOut((t - 10) / 14)})`, transformOrigin: 'left top'}}>
				<Txt size={78}>EL RANKING</Txt>
				<Txt size={110} color={C.yellow} shadow={C.red}>FINAL</Txt>
			</div>
			<div style={{position: 'absolute', left: 40, top: 800, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start'}}>
				<Pill size={30} bg="#fff" style={{transform: `scale(${backOut((t - 700) / 12)})`, transformOrigin: 'left center'}}>¿ESTÁS DE ACUERDO?</Pill>
				<Pill size={30} style={{transform: `scale(${backOut((t - 740) / 12)})`, transformOrigin: 'left center'}}>DEJA TU TOP 3 EN LOS COMENTARIOS</Pill>
			</div>
			<div style={{position: 'absolute', left: 1000, top: 30, width: 890, display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoFlow: 'column', gridTemplateRows: 'repeat(10, 92px)', gap: '6px 14px'}}>
				{list.map((s, k) => {
					const p = backOut((t - 80 - k * 18) / 12);
					const top = s.rank === 1;
					return (
						<div key={s.key} style={{transform: `scale(${Math.max(0, p)})`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', borderRadius: 16, background: top ? 'linear-gradient(160deg, #FFE27A, #E0A800)' : s.rank <= 3 ? 'rgba(46,196,107,0.95)' : 'rgba(11,30,63,0.94)', border: `4px solid ${top ? '#fff' : C.navy}`, boxShadow: '0 5px 0 rgba(0,0,0,0.3)'}}>
							<div style={{width: 66, fontFamily: LILITA, fontSize: 32, color: top || s.rank <= 3 ? C.navy : C.yellow}}>#{s.rank}</div>
							<Flag f={s.flag} w={40} />
							<div style={{flex: 1, minWidth: 0, fontFamily: LILITA, fontSize: s.short.length > 12 ? 22 : 27, color: top || s.rank <= 3 ? C.navy : '#fff', whiteSpace: 'nowrap', overflow: 'hidden'}}>{s.short}</div>
							<div style={{fontFamily: LILITA, fontSize: 30, color: top || s.rank <= 3 ? C.navy : '#fff'}}>{nota(s).toFixed(1).replace('.', ',')}</div>
						</div>
					);
				})}
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
					<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1.05, color: '#fff', ...strokeText(14)}}>¿QUÉ RANKING</div>
					<div style={{fontFamily: LILITA, fontSize: 80, lineHeight: 1.05, color: C.yellow, ...strokeText(14)}}>HACEMOS AHORA?</div>
				</div>
				<div style={{display: 'flex', gap: 22}}>
					{[['MEJORES AFICIONES', '#C60B1E'], ['CAMISETAS MÁS BONITAS', '#003893'], ['DERBIS MÁS CALIENTES', '#1E8E4E']].map(([n, c], i) => (
						<div key={n} style={{transform: `scale(${outP(60 + i * 14)}) rotate(${(i - 1) * 3}deg)`, padding: '18px 30px', borderRadius: 20, background: c, border: `6px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)', fontFamily: LILITA, fontSize: 44, color: '#fff'}}>{n}</div>
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
