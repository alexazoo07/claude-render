import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {WORLD, WCam} from '../v5/WorldLayer5';
import {Fonts, RUBIK} from '../fonts';
import {backOut, clamp01, easeInOut, easeOut} from '../ui';
import {camPath, Key, Subscribe, Confetti} from '../common';
import {Face12, FaceSpec, Fill, INK, toScreen} from '../v12/Atlas';
import {Atlas21} from '../v21/Atlas21';
import {Box, Bubble, Chip, Flag, R, Rec, Source, Star, T, fitBox} from '../v22/Video22';
import {CUPS, ELO, ERAS, ERA_REC, FIRST, FL, Mood, NAME, SIGNS, STARS} from './data23';

const FPS = 60;
const GOLD = '#FFD23F', GREEN = '#3DB86B', RED = '#E63946', CREAM = '#FFF7E6', SKY = '#6CB4EE';
export const HOOK = 1200, ERA = 3600, E_IN = 450, CARD = 900;
export const FIN0 = HOOK + ERAS.length * ERA;
export const V23_TOTAL = FIN0 + 2400;
const eraFrom = (i: number) => HOOK + i * ERA;
const cardFrom = (i: number, j: number) => eraFrom(i) + E_IN + j * CARD;
export const SEGS: [string, number][] = [['Intro', 0], ...ERAS.map((e, i) => [`${e.y0}-${e.y1}: ${e.name}`, eraFrom(i)] as [string, number]), ['Argentina en números', FIN0]];
const nm = (k: string) => NAME[k] ?? k;
const up = (s: string) => s.toUpperCase();
const fmt = (n: number) => (n >= 1000 ? `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, '0')}` : String(n));

// ---------------------------------------------------------------- camera
const WORLD_A: WCam = {x: 1750, y: 930, z: 0.56};
const ARG_CAM = fitBox(['ARG'], 560, 520, 700, 760, 200, 3);
const foeCam = (k: string) => fitBox([k], 520, 450, 820, 620, 170, k === 'ARG' ? 2.2 : 3.2);
const KEYS_CAM: Key[] = (() => {
	const K: Key[] = [];
	const P = (f: number, c: WCam) => K.push([Math.round(f), c.x, c.y, c.z]);
	P(0, ARG_CAM); P(1000, ARG_CAM); P(HOOK - 20, WORLD_A);
	ERAS.forEach((e, i) => {
		P(eraFrom(i) + 30, WORLD_A); P(cardFrom(i, 0) - 30, WORLD_A);
		e.cards.forEach((c, j) => { const f = cardFrom(i, j); P(f + 40, foeCam(c.foe ?? 'ARG')); P(f + CARD - 40, foeCam(c.foe ?? 'ARG')); });
		P(eraFrom(i) + ERA - 380, WORLD_A);
	});
	P(FIN0 + 60, WORLD_A); P(V23_TOTAL, WORLD_A);
	K.sort((a, b) => a[0] - b[0]);
	return K;
})();

// ---------------------------------------------------------------- year
const yearAt = (f: number) => {
	if (f < HOOK) return 1902;
	if (f >= FIN0) return 2026;
	const i = Math.floor((f - HOOK) / ERA); const e = ERAS[i]; const u = f - eraFrom(i);
	const cy = e.cards.map((c) => parseInt(c.y.slice(0, 4), 10));
	const pts: [number, number][] = [[0, e.y0], [E_IN + 40, Math.max(e.y0, cy[0])], [E_IN + CARD - 40, cy[0]], [E_IN + CARD + 40, cy[1]], [E_IN + 2 * CARD - 40, cy[1]], [E_IN + 2 * CARD + 40, cy[2]], [E_IN + 3 * CARD - 40, cy[2]], [ERA - 120, e.y1]];
	for (let q = 1; q < pts.length; q++) if (u <= pts[q][0]) { const [a, ya] = pts[q - 1], [b, yb] = pts[q]; return Math.round(ya + (yb - ya) * clamp01((u - a) / (b - a))); }
	return e.y1;
};
export const colAt = (k: string, y: number) => {
	if (!(k in FIRST) || FIRST[k] > y) return null;
	let s = 0; for (const [yy, v] of SIGNS[k]) if (yy <= y) s = v;
	return s > 0 ? '#7BD389' : s < 0 ? '#F2727F' : '#FFD166';
};

// ---------------------------------------------------------------- sfx / music
export const v23Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f: Math.round(f), name, vol});
	S(0, 'whoosh_4', 0.45); S(30, 'slap', 0.45); S(60, 'pop_1', 0.4); S(100, 'boom', 0.45); S(104, 'crowd_roar', 0.3);
	[260, 520, 780].forEach((f, i) => { S(f, 'whoosh_2', 0.4); S(f + 12, 'slap', 0.45); S(f + 40, i === 0 ? 'crowd_ohh' : 'crowd_roar', 0.3); });
	S(1040, 'riser', 0.3); S(1110, 'boom', 0.5);
	ERAS.forEach((e, i) => {
		const f0 = eraFrom(i);
		S(f0, 'whoosh_4', 0.45); S(f0 + 30, 'slap', 0.45); S(f0 + 80, 'pop_1', 0.4); S(f0 + 140, 'select', 0.3); S(f0 + 200, 'confirm', 0.3);
		e.cards.forEach((c, j) => {
			const f = cardFrom(i, j);
			S(f, 'whoosh_2', 0.4); S(f + 30, 'pop_1', 0.4); S(f + 50, 'slap', 0.4); S(f + 90, 'click', 0.3); S(f + 200, 'pop_2', 0.45);
			if (['love', 'cool'].includes(c.mood)) S(f + 60, 'crowd_roar', 0.35);
			if (['sad', 'panic', 'angry'].includes(c.mood)) S(f + 60, 'crowd_ohh', 0.35);
			if (c.title.includes('CAMPEONA DEL MUNDO') || c.title.includes('ESTRELLA')) { S(f + 70, 'whistle_long', 0.3); S(f + 80, 'confirm', 0.5); }
			S(f + CARD - 30, 'whoosh_1', 0.3);
		});
		const o = eraFrom(i) + ERA - 420;
		S(o, 'whoosh_3', 0.4); e.titles.forEach((_, q) => { S(o + 80 + q * 40, 'bong', 0.25); S(o + 80 + q * 40, 'pop_3', 0.3); });
	});
	S(FIN0, 'whoosh_4', 0.5); S(FIN0 + 40, 'slap', 0.45); S(FIN0 + 220, 'pop_1', 0.45); S(FIN0 + 300, 'confirm', 0.4);
	for (let i = 0; i < 5; i++) S(FIN0 + 1080 + i * 70, 'bong', 0.3); S(FIN0 + 1450, 'boom', 0.5); S(FIN0 + 1454, 'crowd_roar', 0.45);
	S(FIN0 + 1650, 'pop_2', 0.45); S(FIN0 + 1900, 'pop_3', 0.45); S(FIN0 + 2100, 'click', 0.5); S(FIN0 + 2102, 'bong', 0.35);
	s.sort((a, b) => a.f - b.f);
	return s;
};
export const v23Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	const m: [string, number, number][] = [['m_tense', 0, HOOK], ['m_happy', HOOK, eraFrom(2)], ['m_tense', eraFrom(2), eraFrom(3)], ['m_happy', eraFrom(3), eraFrom(5)], ['m_tense', eraFrom(5), eraFrom(7)], ['m_happy', eraFrom(7), FIN0], ['m_triumph', FIN0, V23_TOTAL]];
	return m.map(([n, a, b], i) => `${n}:${sec(a)}:${sec(i === m.length - 1 ? b : b + 40)}`).join(',');
};

// ---------------------------------------------------------------- UI pieces
export const MiniFace: React.FC<{mood: Mood; size: number; talk?: number}> = ({mood, size, talk = 0}) => (
	<div style={{width: size, height: size, borderRadius: size / 2, overflow: 'hidden', border: `5px solid ${INK}`, background: `linear-gradient(${SKY} 0 33%, #fff 33% 66%, ${SKY} 66%)`, flexShrink: 0}}>
		<svg width={size} height={size} viewBox="0 0 200 200"><g transform="translate(10 18) scale(0.9)"><Face12 mood={mood as any} talk={talk} /></g></svg>
	</div>
);
const X0 = 90, X1 = 1830, SY0 = 890, SY1 = 1030;
const ex = (y: number) => X0 + ((y - 1902) / (2026 - 1902)) * (X1 - X0);
const ey = (e: number) => SY1 - ((e - 1450) / (2300 - 1450)) * (SY1 - SY0);
const EloStrip: React.FC<{year: number; op: number; flash?: number}> = ({year, op, flash = 0}) => {
	if (op <= 0.01) return null;
	const pts = ELO.filter(([y]) => y <= year);
	const d = pts.map(([y, e], i) => `${i ? 'L' : 'M'}${ex(y).toFixed(1)} ${ey(e).toFixed(1)}`).join(' ');
	const last = pts[pts.length - 1];
	return (
		<div style={{position: 'absolute', left: 40, right: 40, bottom: 40, height: 180, opacity: op}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: 20, background: 'rgba(14,16,22,0.78)', border: '4px solid #fff'}} />
			<svg width={1840} height={180} viewBox={`40 860 1840 180`} style={{position: 'absolute', inset: 0}}>
				{ERAS.map((e, i) => <rect key={i} x={ex(e.y0)} y={870} width={ex(e.y1 + 1) - ex(e.y0)} height={168} fill={i % 2 ? '#ffffff' : SKY} opacity={0.07} />)}
				{[1910, 1930, 1950, 1970, 1990, 2010].map((y) => <text key={y} x={ex(y)} y={1032} fill="#C9D3E2" fontSize={18} fontFamily={RUBIK} fontWeight={700} textAnchor="middle">{y}</text>)}
				<path d={d} fill="none" stroke={SKY} strokeWidth={5} strokeLinejoin="round" />
				{CUPS.filter((y) => y <= year).map((y) => <circle key={y} cx={ex(y)} cy={ey((ELO.find(([yy]) => yy === y) ?? [y, 1800])[1])} r={7} fill="#fff" stroke={INK} strokeWidth={3} />)}
				{STARS.filter((y) => y <= year).map((y) => { const e = (ELO.find(([yy]) => yy === y) ?? [y, 1900])[1]; return <path key={y} transform={`translate(${ex(y)} ${ey(e)}) scale(1.6)`} d="M0 -11 L3.2 -3.6 L11 -3.4 L5 1.8 L7 9.6 L0 5.2 L-7 9.6 L-5 1.8 L-11 -3.4 L-3.2 -3.6 Z" fill={GOLD} stroke={INK} strokeWidth={2} />; })}
				{last && <circle cx={ex(last[0])} cy={ey(last[1])} r={9 + 4 * Math.abs(Math.sin(flash / 8))} fill={GOLD} stroke={INK} strokeWidth={3} />}
				<text x={58} y={892} fill="#fff" fontSize={20} fontFamily={RUBIK} fontWeight={800}>NIVEL DE ARGENTINA (puntos Elo)</text>
				<text x={1862} y={892} fill="#fff" fontSize={18} fontFamily={RUBIK} fontWeight={600} textAnchor="end">○ Copa América   ★ Mundial</text>
			</svg>
		</div>
	);
};
const EraPanel: React.FC<{i: number; u: number; outro: boolean}> = ({i, u, outro}) => {
	const e = ERAS[i]; const r = ERA_REC[i]; const n = r.W + r.D + r.L;
	const p = backOut(u / 14);
	return (
		<div style={{position: 'absolute', left: 1160, top: 110, width: 720, transform: `scale(${p})`, transformOrigin: 'top right'}}>
			<Box>
				<T size={34} color="#2563EB" stroke={0} shadow={0}>{e.y0}-{e.y1}</T><br />
				<T size={58} color={INK} stroke={0} shadow={0}>{e.name}</T>
				{!outro ? (
					<div style={{marginTop: 12}}>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 12}}><T size={72} color={INK} stroke={0} shadow={0}>{n}</T><R size={30}>partidos</R></div>
						<Rec w={r.W} d={r.D} l={r.L} width={660} big p={easeOut((u - 60) / 50)} />
						<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12}}>
							<R size={30}>{Math.round((r.W / n) * 100)} % de victorias</R><R size={30}>Goles: {r.gf}-{r.ga}</R>
						</div>
					</div>
				) : (
					<div style={{marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8}}>
						<R size={30} color="#6B6F78">Títulos de esta etapa:</R>
						{e.titles.map((t, q) => (
							<div key={t} style={{display: 'flex', alignItems: 'center', gap: 12, transform: `translateX(${(1 - easeOut((u - 80 - q * 40) / 12)) * 800}px)`}}>
								<Star s={40} c={t.startsWith('Mundial') ? GOLD : t.startsWith('Copa América') ? '#fff' : '#E3A86B'} /><R size={32}>{t}</R>
							</div>
						))}
					</div>
				)}
			</Box>
		</div>
	);
};
const CardP: React.FC<{c: {y: string; title: string; line: string; mood: Mood; foe?: string}; v: number}> = ({c, v}) => (
	<div style={{position: 'absolute', left: 1080, top: 130, width: 800, transform: `translateX(${(1 - easeOut((v - 30) / 16)) * 900 + easeInOut((v - CARD + 40) / 20) * 900}px) rotate(1deg)`}}>
		<Box style={{padding: 0, overflow: 'hidden'}}>
			<div style={{background: INK, padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
				<T size={64} color={GOLD}>{c.y}</T>
				{c.foe && <div style={{display: 'flex', alignItems: 'center', gap: 10}}><Flag f={FL.ARG} w={70} /><T size={34}>VS</T><Flag f={FL[c.foe]} w={70} /></div>}
			</div>
			<div style={{padding: '16px 24px', display: 'flex', gap: 18, alignItems: 'center'}}>
				<div style={{transform: `scale(${backOut((v - 60) / 12)})`}}><MiniFace mood={c.mood} size={150} talk={v > 200 && v < 300 ? Math.max(0, Math.sin(v / 4)) * 0.8 : 0} /></div>
				<div style={{flex: 1}}>
					<T size={46} color={INK} stroke={0} shadow={0}>{c.title}</T>
					<div style={{marginTop: 8}}><R size={29} w={700}>{c.line}</R></div>
				</div>
			</div>
		</Box>
	</div>
);

// ---------------------------------------------------------------- HOOK
const Hook: React.FC<{u: number}> = ({u}) => {
	const teas: [number, string, string, Mood][] = [[260, '1958', '1-6 CONTRA CHECOSLOVAQUIA', 'panic'], [520, '1986', 'LA MANO DE DIOS', 'cool'], [780, '2022', '¡CAMPEONA DEL MUNDO!', 'love']];
	return (
		<AbsoluteFill style={{opacity: 1 - easeInOut((u - HOOK + 30) / 24)}}>
			<div style={{position: 'absolute', right: 60, top: 60, textAlign: 'right'}}>
				<div style={{transform: `scale(${backOut((u - 20) / 14)}) rotate(-2deg)`}}><T size={80}>LA EVOLUCIÓN DE</T></div>
				<div style={{transform: `scale(${backOut((u - 40) / 14)}) rotate(-2deg)`}}><T size={150} color={SKY}>ARGENTINA</T></div>
				<div style={{transform: `scale(${backOut((u - 80) / 14)})`, display: 'inline-block', marginTop: 8, padding: '6px 26px', borderRadius: 20, background: INK, border: '5px solid #fff'}}><T size={60} color={GOLD}>1902 → 2026</T></div>
			</div>
			{teas.map(([at, y, t, m], i) => {
				const v = u - at;
				if (v < 0 || v > 280) return null;
				return (
					<div key={i} style={{position: 'absolute', left: 1080, top: 470, width: 800, transform: `translateX(${(1 - easeOut(v / 14)) * 900 + easeInOut((v - 250) / 20) * 900}px) rotate(${i % 2 ? 2 : -2}deg)`}}>
						<Box style={{display: 'flex', alignItems: 'center', gap: 20}}><MiniFace mood={m} size={130} /><div><T size={70} color={i === 0 ? RED : '#2563EB'} stroke={0} shadow={0}>{y}</T><br /><T size={46} color={INK} stroke={0} shadow={0}>{t}</T></div></Box>
					</div>
				);
			})}
			{u >= 1050 && <div style={{position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((u - 1050) / 12)}) rotate(-3deg)`, padding: '14px 40px', borderRadius: 24, background: RED, border: `7px solid ${INK}`}}><T size={90}>124 AÑOS EN 9 MINUTOS</T></div></div>}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- FINAL
const Final: React.FC<{u: number}> = ({u}) => {
	const trophies: [string, number, string][] = [['Mundiales', 3, GOLD], ['Copas América', 16, '#fff'], ['Oros olímpicos', 2, '#E3A86B'], ['Finalissimas', 2, '#9FB7D9'], ['Copa Confederaciones', 1, '#9FB7D9']];
	return (
		<AbsoluteFill>
			<Chip n="★" title="ARGENTINA EN NÚMEROS" u={u} />
			{u >= 1450 && <Confetti f={u} start={1450} n={150} />}
			{u < 1000 && (
				<div style={{position: 'absolute', left: 1160, top: 120, width: 720, transform: `translateX(${(1 - easeOut((u - 200) / 16)) * 900 + easeInOut((u - 980) / 20) * 900}px)`}}>
					<Box>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 12}}><T size={90} color={INK} stroke={0} shadow={0}>1.079</T><R size={32}>partidos</R></div>
						<Rec w={602} d={256} l={221} width={660} big p={easeOut((u - 260) / 60)} />
						<div style={{marginTop: 12}}><R size={30}>2.058 goles a favor · 1.082 en contra</R></div>
						<div style={{marginTop: 12, display: 'flex', alignItems: 'center', gap: 12}}><T size={60} color="#2563EB" stroke={0} shadow={0}>87</T><R size={30}>rivales distintos (en el mapa)</R></div>
					</Box>
				</div>
			)}
			{u >= 1000 && u < 1700 && (
				<div style={{position: 'absolute', left: 1160, top: 120, width: 720, transform: `translateX(${(1 - easeOut((u - 1000) / 16)) * 900 + easeInOut((u - 1680) / 20) * 900}px)`}}>
					<Box>
						<T size={50} color={INK} stroke={0} shadow={0}>LA VITRINA</T>
						<div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10}}>
							{trophies.map(([t, n, c], q) => (
								<div key={t} style={{display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${backOut((u - 1080 - q * 70) / 10)})`, transformOrigin: 'left center'}}><Star s={50} c={c} /><T size={56} color={INK} stroke={0} shadow={0}>{n}</T><R size={32}>{t}</R></div>
							))}
						</div>
					</Box>
					{u >= 1450 && <div style={{marginTop: -20, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((u - 1450) / 12)}) rotate(-4deg)`}}><div style={{padding: '8px 30px', borderRadius: 20, background: RED, border: `6px solid ${INK}`}}><T size={70}>¡24 TÍTULOS!</T></div></div>}
				</div>
			)}
			{u >= 1650 && (
				<div style={{position: 'absolute', left: 1080, right: 40, top: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
					<div style={{transform: `scale(${backOut((u - 1650) / 12)})`, width: 780}}><Box style={{display: 'flex', alignItems: 'center', gap: 18}}><MiniFace mood="love" size={120} /><div><T size={46} color={INK} stroke={0} shadow={0}>MESSI: 125 GOLES</T><br /><R size={28}>en 207 partidos. Máximo goleador de su historia</R></div></Box></div>
					<div style={{transform: `scale(${backOut((u - 1900) / 12)}) rotate(-2deg)`, textAlign: 'center'}}><T size={64} color={GOLD}>¿CUÁL FUE LA MEJOR</T><br /><T size={64} color={GOLD}>ARGENTINA?</T></div>
					<div style={{display: 'flex', gap: 18, transform: `scale(${backOut((u - 1960) / 12)})`}}>{['LA DEL 78', 'LA DEL 86', 'LA DE 2022'].map((x) => <div key={x} style={{padding: '8px 22px', borderRadius: 20, background: '#fff', border: `5px solid ${INK}`}}><T size={40} color={INK} stroke={0} shadow={0}>{x}</T></div>)}</div>
					<Subscribe f={u} start={2050} />
				</div>
			)}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- main
export const Video23: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS_CAM, f);
	const year = yearAt(f);
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	for (const k in FIRST) { if (!WORLD[k]) continue; const c = colAt(k, year); if (c) fills[k] = {color: c}; }
	let mood: Mood = 'happy';
	let talk = 0;
	const tk = Math.max(0, Math.sin(f / 4)) * 0.8;
	let ei = -1, eu = 0, cj = -1, cv = 0;
	if (f < HOOK) { mood = f < 260 ? 'happy' : f < 520 ? 'panic' : f < 780 ? 'cool' : 'love'; talk = f > 120 && f < 220 ? tk : 0; }
	else if (f < FIN0) {
		ei = Math.floor((f - HOOK) / ERA); eu = f - eraFrom(ei);
		cj = Math.floor((eu - E_IN) / CARD); if (cj < 0 || cj > 2) cj = -1;
		if (cj >= 0) {
			cv = eu - E_IN - cj * CARD; const c = ERAS[ei].cards[cj]; mood = c.mood;
			if (c.foe) { const L = easeOut((cv - 30) / 14) * (1 - easeInOut((cv - CARD + 30) / 14)); fills[c.foe] = {...(fills[c.foe] ?? {}), flag: FL[c.foe], lift: L}; faces[c.foe] = {mood: (c.foeMood ?? 'neutral') as any, max: 170, pop: backOut((cv - 40) / 12) * (1 - easeInOut((cv - CARD + 30) / 14)), talk: cv > 330 && cv < 420 ? tk : 0}; }
		} else mood = 'happy';
	} else mood = f - FIN0 < 1400 ? 'happy' : 'love';
	fills.ARG = {flag: FL.ARG, lift: 1};
	faces.ARG = {mood: mood as any, max: 150, talk, pop: 1};
	const stripOp = f < HOOK ? easeOut((f - 1040) / 20) : 1;
	const c = ei >= 0 && cj >= 0 ? ERAS[ei].cards[cj] : null;
	const ac = WORLD.ARG.c; const [ax, ay] = toScreen(cam, ac[0], ac[1]);
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			<Atlas21 cam={cam} fills={fills} faces={faces} />
			{f < HOOK && <Hook u={f} />}
			{ei >= 0 && (
				<>
					<Chip n={String(ei + 1)} title={`${ERAS[ei].y0}-${ERAS[ei].y1} · ${ERAS[ei].name}`} u={eu} />
					<div style={{position: 'absolute', left: 40, top: 110, padding: '2px 18px', borderRadius: 14, background: GOLD, border: `5px solid ${INK}`, transform: `scale(${backOut((eu - 30) / 12)})`, transformOrigin: 'left top'}}><T size={56} color={INK} stroke={0} shadow={0}>{year}</T></div>
					{eu < E_IN && <EraPanel i={ei} u={eu - 40} outro={false} />}
					{eu >= ERA - 420 && eu < ERA - 20 && <div style={{opacity: 1 - easeInOut((eu - ERA + 50) / 24)}}><EraPanel i={ei} u={eu - ERA + 420} outro /></div>}
					{c && <CardP c={c} v={cv} />}
					{c && c.foe && (() => { const k = WORLD[c.foe].c; const [x, y] = toScreen(cam, k[0], k[1]); return <Bubble x={1130} y={560} text={ERAS[ei].cards[cj].bubble} u={cv - 200} dur={CARD - 240} />; })()}
					{!c && eu < E_IN && eu > 200 && ei === 0 && <Bubble x={ax + 30} y={ay - 60} text="¡Allá vamos!" u={eu - 200} dur={220} />}
				</>
			)}
			{f >= FIN0 && <Final u={f - FIN0} />}
			<EloStrip year={year} op={stripOp} flash={f} />
			<Source text="Fuentes: resultados internacionales 1872-2026 (martj42) · FIFA · CONMEBOL · Elo: cálculo propio con todos los partidos · Penaltis = empate" />
		</AbsoluteFill>
	);
};
