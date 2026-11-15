import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {WORLD, WCam} from '../v5/WorldLayer5';
import {Fonts, RUBIK} from '../fonts';
import {backOut, clamp01, easeInOut, easeOut} from '../ui';
import {camPath, Key, Subscribe, Confetti} from '../common';
import {Face12, FaceSpec, Fill, INK, toScreen} from '../v12/Atlas';
import {Atlas21} from '../v21/Atlas21';
import {Box, Bubble, Chip, Flag, R, Source, Star, T, fitBox} from '../v22/Video22';
import {CHAMPS, COL, EDS, ERAS, FACT, FL, KIND, NAME, PENS} from './data25';

const FPS = 60;
const GOLD = '#FFD23F', RED = '#E63946', CREAM = '#FFF7E6';
export const HOOK = 1200, E_IN = 300, CARD = 450, E_OUT = 240;
const ERA = E_IN + 6 * CARD + E_OUT;
export const FIN0 = HOOK + ERAS.length * ERA;
export const V25_TOTAL = FIN0 + 2400;
const eraFrom = (i: number) => HOOK + i * ERA;
const cardFrom = (i: number, j: number) => eraFrom(i) + E_IN + j * CARD;
const C_WIN = 110; // champion stamp inside a card
const ED = Object.fromEntries(EDS.map((e) => [e.y, e]));
const ORDER = ERAS.flatMap((e) => e.eds);
const WIN_AT: Record<string, number> = {};
ERAS.forEach((e, i) => e.eds.forEach((y, j) => (WIN_AT[y] = cardFrom(i, j) + C_WIN)));
const nm = (k: string) => NAME[k] ?? k;
const up = (s: string) => s.toUpperCase();
const yl = (y: string) => y.slice(0, 4);
// titles of each country after edition index n (exclusive)
const titlesAt = (f: number) => { const c: Record<string, number> = {}; for (const y of ORDER) if (f >= WIN_AT[y]) c[ED[y].c] = (c[ED[y].c] ?? 0) + 1; return c; };
const nth = (y: string) => ORDER.slice(0, ORDER.indexOf(y) + 1).filter((x) => ED[x].c === ED[y].c).length;
export const SEGS: [string, number][] = [['Intro', 0], ...ERAS.map((e, i) => [`${yl(e.eds[0])}-${yl(e.eds[5])}: ${e.name}`, eraFrom(i)] as [string, number]), ['El palmarés', FIN0]];

// ---------------------------------------------------------------- camera
const SA = ['ARG', 'BRA', 'CHL', 'PER', 'COL', 'VEN', 'URY'];
const SA_CAM = fitBox(SA, 560, 560, 900, 900, 200, 3);
const WIDE: WCam = {...SA_CAM, z: SA_CAM.z * 0.82};
const camFor = (y: string) => {
	const e = ED[y]; const ks = [e.c, ...(e.hk ? [e.hk] : []), ...(KIND[yl(y)] || KIND[y] ? [e.last.o] : [])].filter((k) => WORLD[k]);
	return fitBox(ks, 520, 560, 820, 760, 260, 2.2);
};
const KEYS_CAM: Key[] = (() => {
	const K: Key[] = [];
	const P = (f: number, c: WCam) => K.push([Math.round(f), c.x, c.y, c.z]);
	P(0, WIDE); P(HOOK - 20, SA_CAM);
	ERAS.forEach((e, i) => {
		P(eraFrom(i) + 30, SA_CAM); P(cardFrom(i, 0) - 30, SA_CAM);
		e.eds.forEach((y, j) => { const f = cardFrom(i, j); P(f + 40, camFor(y)); P(f + CARD - 30, camFor(y)); });
		P(eraFrom(i) + ERA - 120, SA_CAM);
	});
	P(FIN0 + 60, WIDE); P(V25_TOTAL, WIDE);
	K.sort((a, b) => a[0] - b[0]);
	return K;
})();

// ---------------------------------------------------------------- sfx / music
export const v25Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f: Math.round(f), name, vol});
	S(0, 'whoosh_4', 0.45); S(20, 'slap', 0.45); S(40, 'riser', 0.3);
	ORDER.forEach((_, i) => S(140 + i * 13, 'tick', 0.18));
	S(140 + 40 * 13, 'boom', 0.5); S(140 + 40 * 13 + 4, 'crowd_ohh', 0.35); S(900, 'drumroll', 0.35); S(1100, 'boom', 0.55);
	ERAS.forEach((e, i) => {
		const f0 = eraFrom(i);
		S(f0, 'whoosh_4', 0.45); S(f0 + 30, 'slap', 0.45); S(f0 + 90, 'pop_1', 0.4);
		e.eds.forEach((y, j) => {
			const f = cardFrom(i, j);
			S(f, 'whoosh_2', 0.4); S(f + 30, 'pop_1', 0.4); S(f + 60, 'click', 0.3); S(f + C_WIN - 30, 'drumroll', 0.22); S(f + C_WIN, 'boom', 0.5); S(f + C_WIN + 2, 'crowd_roar', 0.4); S(f + C_WIN + 6, 'confirm', 0.3);
			S(f + 220, 'pop_2', 0.4); S(f + 300, 'pop_3', 0.35); S(f + CARD - 26, 'whoosh_1', 0.3);
		});
		S(eraFrom(i) + ERA - E_OUT + 20, 'whoosh_3', 0.4); S(eraFrom(i) + ERA - E_OUT + 60, 'bong', 0.3);
	});
	S(FIN0, 'whoosh_4', 0.5); S(FIN0 + 40, 'slap', 0.45); for (let i = 0; i < 8; i++) S(FIN0 + 120 + i * 60, `pop_${(i % 4) + 1}`, 0.4);
	S(FIN0 + 700, 'boom', 0.55); S(FIN0 + 704, 'crowd_roar', 0.45); S(FIN0 + 1500, 'pop_2', 0.45); S(FIN0 + 1800, 'click', 0.5); S(FIN0 + 1802, 'bong', 0.35);
	s.sort((a, b) => a.f - b.f);
	return s;
};
export const v25Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	const m: [string, number, number][] = [['m_tense', 0, HOOK], ['m_happy', HOOK, eraFrom(3)], ['m_tense', eraFrom(3), eraFrom(5)], ['m_happy', eraFrom(5), eraFrom(7)], ['m_tense', eraFrom(7), FIN0], ['m_triumph', FIN0, V25_TOTAL]];
	return m.map(([n, a, b], i) => `${n}:${sec(a)}:${sec(i === m.length - 1 ? b : b + 40)}`).join(',');
};

// ---------------------------------------------------------------- UI pieces
const Palmares: React.FC<{f: number; x?: number; y?: number; big?: boolean}> = ({f, x = 36, y = 120, big}) => {
	const c = titlesAt(f);
	const rows = CHAMPS.filter((k) => c[k]).sort((a, b) => c[b] - c[a] || CHAMPS.indexOf(a) - CHAMPS.indexOf(b));
	const last = ORDER.filter((y2) => f >= WIN_AT[y2]).pop();
	const flash = last ? clamp01(1 - (f - WIN_AT[last]) / 30) : 0;
	const max = Math.max(1, ...Object.values(c));
	const W = big ? 820 : 420;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: W, padding: big ? '16px 20px' : '10px 14px', borderRadius: 18, background: 'rgba(20,22,29,0.88)', border: '4px solid #fff'}}>
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6}}><T size={big ? 44 : 28} color={GOLD}>PALMARÉS</T><R size={big ? 24 : 17} color="#C9D3E2">Copas América</R></div>
			{rows.map((k, i) => (
				<div key={k} style={{display: 'flex', alignItems: 'center', gap: 10, height: big ? 62 : 36, marginTop: 4, transform: `translateY(0px) scale(${k === ED[last ?? '1916']?.c ? 1 + 0.06 * flash : 1})`, transformOrigin: 'left center'}}>
					<span style={{width: big ? 34 : 22, fontFamily: RUBIK, fontWeight: 900, fontSize: big ? 28 : 18, color: '#fff'}}>{i + 1}</span>
					<Flag f={FL[k]} w={big ? 60 : 38} />
					<div style={{flex: 1, height: big ? 40 : 22, borderRadius: 10, background: 'rgba(255,255,255,0.12)', overflow: 'hidden'}}><div style={{width: `${(c[k] / max) * 100}%`, height: '100%', background: COL[k], borderRight: `3px solid ${INK}`}} /></div>
					<T size={big ? 46 : 28}>{c[k]}</T>
				</div>
			))}
		</div>
	);
};
const TimeStrip: React.FC<{f: number; op: number}> = ({f, op}) => {
	if (op <= 0.01) return null;
	const x = (i: number) => 60 + i * ((1800 - 60) / (ORDER.length - 1));
	return (
		<div style={{position: 'absolute', left: 30, right: 30, bottom: 44, height: 92, opacity: op}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: 18, background: 'rgba(14,16,22,0.8)', border: '4px solid #fff'}} />
			<svg width={1860} height={92} style={{position: 'absolute', inset: 0}}>
				<line x1={40} x2={1820} y1={46} y2={46} stroke="#5B616D" strokeWidth={4} />
				{ORDER.map((y, i) => {
					const on = f >= WIN_AT[y];
					return (
						<g key={y}>
							<circle cx={x(i)} cy={46} r={on ? 14 : 6} fill={on ? COL[ED[y].c] : '#8C8F99'} stroke={INK} strokeWidth={on ? 3 : 2} />
							{['1916', '1929', '1942', '1956', '1975', '1993', '2007', '2024'].includes(y) && <text x={x(i)} y={84} fill="#C9D3E2" fontSize={15} fontFamily={RUBIK} fontWeight={800} textAnchor="middle">{y}</text>}
						</g>
					);
				})}
			</svg>
		</div>
	);
};
const CardE: React.FC<{y: string; v: number}> = ({y, v}) => {
	const e = ED[y]; const kind = KIND[y] ?? KIND[yl(y)]; const won = v >= C_WIN;
	const n = nth(y);
	return (
		<div style={{position: 'absolute', left: 1060, top: 120, width: 820, transform: `translateX(${(1 - easeOut((v - 20) / 16)) * 900 + easeInOut((v - CARD + 40) / 20) * 900}px) rotate(1deg)`}}>
			<Box style={{padding: 0, overflow: 'hidden'}}>
				<div style={{background: INK, padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
					<T size={70} color={GOLD}>{yl(y)}</T>
					<div style={{display: 'flex', alignItems: 'center', gap: 10}}>{e.hk ? <><R size={22} color="#C9D3E2">SEDE</R><Flag f={FL[e.hk]} w={60} /><T size={32}>{up(nm(e.hk))}</T></> : <T size={30}>SIN SEDE FIJA</T>}</div>
				</div>
				<div style={{padding: '16px 24px'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
						<div style={{transform: `scale(${backOut((v - 40) / 12)})`}}><Flag f={FL[e.c]} w={150} /></div>
						<div>
							<R size={24} color="#6B6F78">CAMPEONA</R><br />
							<T size={64} color={INK} stroke={0} shadow={0}>{up(nm(e.c))}</T><br />
							<div style={{transform: `scale(${backOut((v - C_WIN) / 10)})`, transformOrigin: 'left center', display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 4, padding: '2px 14px', borderRadius: 12, background: GOLD, border: `4px solid ${INK}`}}>
								<Star s={30} /><T size={30} color={INK} stroke={0} shadow={0}>{n === 1 ? 'SU PRIMERA COPA' : `SU COPA N.º ${n}`}</T>
							</div>
						</div>
					</div>
					<div style={{marginTop: 14, display: 'flex', gap: 10, opacity: clamp01((v - 200) / 10)}}>
						{([['PARTIDOS', e.p, INK], ['GANÓ', e.w, '#1F7E43'], ['EMPATÓ', e.d, '#8C8471'], ['PERDIÓ', e.l, '#A61E2D'], ['GOLES', `${e.gf}-${e.ga}`, '#2563EB']] as [string, number | string, string][]).map(([l, val, cc]) => (
							<div key={l} style={{flex: 1, padding: '4px 0', borderRadius: 12, background: '#fff', border: `3px solid ${INK}`, textAlign: 'center'}}><T size={36} color={cc} stroke={0} shadow={0}>{val}</T><br /><R size={15}>{l}</R></div>
						))}
					</div>
					{kind && (
						<div style={{marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px', borderRadius: 14, background: '#1B1D26', opacity: clamp01((v - 260) / 10)}}>
							<R size={20} color={GOLD}>{kind}</R>
							<Flag f={FL[e.c]} w={44} /><T size={40}>{e.last.sa}-{e.last.sb}</T><Flag f={FL[e.last.o] ?? 'un'} w={44} /><R size={22} color="#fff">{nm(e.last.o)}</R>
							{PENS[yl(y)] && <R size={20} color="#C9D3E2">({PENS[yl(y)]})</R>}
						</div>
					)}
					{FACT[y] && <div style={{marginTop: 12, opacity: clamp01((v - 300) / 12)}}><R size={27} w={700}>{FACT[y]}</R></div>}
				</div>
			</Box>
			{won && v < CARD - 40 && (
				<div style={{position: 'absolute', right: 30, top: 70, transform: `scale(${2 - easeOut((v - C_WIN) / 10)}) rotate(-8deg)`, opacity: clamp01((v - C_WIN) / 6) * (1 - clamp01((v - 200) / 20))}}>
					<div style={{padding: '6px 22px', border: `8px solid ${RED}`, borderRadius: 16, background: 'rgba(255,255,255,0.9)'}}><T size={60} color={RED} stroke={4}>¡CAMPEONA!</T></div>
				</div>
			)}
		</div>
	);
};

const EraIntro: React.FC<{i: number; u: number}> = ({i, u}) => {
	const e = ERAS[i]; const o = 1 - easeInOut((u - E_IN + 30) / 20);
	return (
		<div style={{position: 'absolute', left: 1000, top: 200, width: 860, opacity: o, transform: `scale(${backOut((u - 20) / 14)})`}}>
			<Box>
				<T size={40} color="#2563EB" stroke={0} shadow={0}>ETAPA {i + 1} · {yl(e.eds[0])}-{yl(e.eds[5])}</T><br />
				<T size={62} color={INK} stroke={0} shadow={0}>{e.name}</T>
				<div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginTop: 16}}>
					{e.eds.map((y, j) => (
						<div key={y} style={{padding: '8px 0', borderRadius: 14, background: INK, border: '3px solid #fff', textAlign: 'center', transform: `scale(${backOut((u - 60 - j * 18) / 10)})`}}>
							<T size={32} color={GOLD}>{yl(y)}</T><br /><T size={44}>?</T>
						</div>
					))}
				</div>
			</Box>
		</div>
	);
};

// ---------------------------------------------------------------- HOOK: the title race in fast-forward
const RACE0 = 140, RSTEP = 13, RSTOP = 43; // stops after 40 editions (2011: Uruguay ahead)
const Hook: React.FC<{u: number}> = ({u}) => {
	const n = Math.max(0, Math.min(RSTOP, Math.floor((u - RACE0) / RSTEP) + 1));
	const c: Record<string, number> = {}; ORDER.slice(0, n).forEach((y) => (c[ED[y].c] = (c[ED[y].c] ?? 0) + 1));
	const rows = CHAMPS.slice().sort((a, b) => (c[b] ?? 0) - (c[a] ?? 0) || CHAMPS.indexOf(a) - CHAMPS.indexOf(b));
	const yr = n ? yl(ORDER[n - 1]) : '1916';
	const stop = u >= RACE0 + RSTOP * RSTEP;
	return (
		<AbsoluteFill style={{opacity: 1 - easeInOut((u - HOOK + 30) / 24)}}>
			<div style={{position: 'absolute', right: 60, top: 40, textAlign: 'right'}}>
				<div style={{transform: `scale(${backOut((u - 10) / 14)}) rotate(-2deg)`}}><T size={70}>TODAS LAS CAMPEONAS DE LA</T></div>
				<div style={{transform: `scale(${backOut((u - 30) / 14)}) rotate(-2deg)`}}><T size={130} color={GOLD}>COPA AMÉRICA</T></div>
			</div>
			<div style={{position: 'absolute', left: 960, top: 330, width: 900, transform: `translateX(${(1 - easeOut((u - 80) / 18)) * 1000}px)`}}>
				<Box>
					<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><T size={44} color={INK} stroke={0} shadow={0}>LA CARRERA DE LAS COPAS</T><T size={60} color="#2563EB" stroke={0} shadow={0}>{yr}</T></div>
					{rows.map((k, i) => (
						<div key={k} style={{position: 'absolute', left: 20, right: 20, top: 90 + i * 58, display: 'flex', alignItems: 'center', gap: 12, transition: 'none'}}>
							<Flag f={FL[k]} w={60} />
							<div style={{flex: 1, height: 40, borderRadius: 10, background: '#E6DCC6', border: `3px solid ${INK}`, overflow: 'hidden'}}><div style={{width: `${((c[k] ?? 0) / 16) * 100}%`, height: '100%', background: COL[k]}} /></div>
							<T size={44} color={INK} stroke={0} shadow={0}>{c[k] ?? 0}</T>
						</div>
					))}
					<div style={{height: 8 * 58 + 20}} />
				</Box>
			</div>
			{stop && u < 1150 && (
				<div style={{position: 'absolute', left: 1000, top: 900, transform: `scale(${backOut((u - RACE0 - RSTOP * RSTEP) / 12)}) rotate(-3deg)`, padding: '10px 30px', borderRadius: 20, background: RED, border: `6px solid ${INK}`}}><T size={46}>2011: ¡URUGUAY VA PRIMERA! ¿Y DESPUÉS?</T></div>
			)}
			{u >= 1100 && <div style={{position: 'absolute', left: 0, right: 0, top: 440, display: 'flex', justifyContent: 'center'}}><div style={{transform: `scale(${backOut((u - 1100) / 10)}) rotate(-3deg)`, padding: '14px 40px', borderRadius: 24, background: INK, border: '7px solid #fff'}}><T size={86} color={GOLD}>48 COPAS EN 8 MINUTOS</T></div></div>}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- FINAL
const Final: React.FC<{u: number; f: number}> = ({u, f}) => (
	<AbsoluteFill>
		<Chip n="★" title="EL PALMARÉS FINAL" u={u} />
		{u >= 700 && <Confetti f={u} start={700} n={150} />}
		<div style={{position: 'absolute', left: 1040, top: 120, transform: `translateX(${(1 - easeOut((u - 60) / 16)) * 1000}px)`}}><Palmares f={f} x={0} y={0} big /></div>
		{u >= 700 && u < 1400 && <div style={{position: 'absolute', left: 1040, width: 860, top: 760, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((u - 700) / 12)}) rotate(-3deg)`}}><div style={{padding: '10px 30px', borderRadius: 20, background: RED, border: `6px solid ${INK}`}}><T size={54}>ARGENTINA, LA REINA: 16 COPAS</T></div></div>}
		{u >= 1400 && (
			<div style={{position: 'absolute', left: 1040, width: 860, top: 740, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
				<div style={{transform: `scale(${backOut((u - 1400) / 12)})`, padding: '10px 26px', borderRadius: 30, background: '#F15BB5', border: `5px solid ${INK}`}}><T size={44}>¿Quién ganará la próxima Copa?</T></div>
				<Subscribe f={u} start={1700} />
			</div>
		)}
	</AbsoluteFill>
);

// ---------------------------------------------------------------- main
export const Video25: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS_CAM, f);
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	const tc = titlesAt(f);
	for (const k of CHAMPS) if (tc[k] && WORLD[k]) fills[k] = {flag: FL[k]};
	if (f < HOOK) { const n = Math.max(0, Math.min(RSTOP, Math.floor((f - RACE0) / RSTEP) + 1)); const hc: Record<string, number> = {}; ORDER.slice(0, n).forEach((yy) => (hc[ED[yy].c] = (hc[ED[yy].c] ?? 0) + 1)); for (const k of CHAMPS) if (hc[k] && WORLD[k]) { fills[k] = {flag: FL[k], lift: 0.4}; faces[k] = {mood: 'happy', max: 80 + hc[k] * 5}; } }
	let ei = -1, eu = 0, cj = -1, v = 0;
	if (f >= HOOK && f < FIN0) {
		ei = Math.floor((f - HOOK) / ERA); eu = f - eraFrom(ei);
		cj = Math.floor((eu - E_IN) / CARD); if (cj < 0 || cj > 5) cj = -1;
		if (cj >= 0) v = eu - E_IN - cj * CARD;
	}
	const y = cj >= 0 ? ERAS[ei].eds[cj] : null;
	if (y) {
		const e = ED[y]; const L = easeOut((v - 30) / 14) * (1 - easeInOut((v - CARD + 30) / 14));
		const kind = KIND[y] ?? KIND[yl(y)];
		if (e.hk && WORLD[e.hk] && e.hk !== e.c) { fills[e.hk] = {...(fills[e.hk] ?? {}), flag: FL[e.hk], lift: 0.5 * L}; }
		if (kind && WORLD[e.last.o] && e.last.o !== e.c) { fills[e.last.o] = {flag: FL[e.last.o], lift: L}; faces[e.last.o] = {mood: v >= C_WIN ? 'sad' : 'worried', max: 130, pop: backOut((v - 40) / 12) * (1 - easeInOut((v - CARD + 30) / 14))}; }
		fills[e.c] = {flag: FL[e.c], lift: L, pop: v >= C_WIN && v < C_WIN + 30 ? 1 + 0.08 * Math.sin(((v - C_WIN) / 30) * Math.PI) : 1};
		faces[e.c] = {mood: v >= C_WIN ? 'love' : 'worried', max: 170, pop: backOut((v - 30) / 12) * (1 - easeInOut((v - CARD + 30) / 14)), talk: v > 330 && v < 420 ? Math.max(0, Math.sin(f / 4)) * 0.8 : 0};
	}
	if (f >= FIN0) for (const k of CHAMPS) if (WORLD[k]) faces[k] = {mood: k === 'ARG' ? 'love' : k === 'URY' ? 'smug' : 'happy', max: k === 'ARG' ? 150 : 90, pop: backOut((f - FIN0 - 100 - CHAMPS.indexOf(k) * 20) / 12)};
	const stripOp = f < HOOK ? 0 : f >= FIN0 ? 1 - easeInOut((f - FIN0) / 30) : easeOut((f - HOOK) / 20);
	const bubbleK = y ? ED[y].c : null;
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			<Atlas21 cam={cam} fills={fills} faces={faces} dark={f < HOOK ? 0.25 : 0} />
			{f < HOOK && <Hook u={f} />}
			{ei >= 0 && (
				<>
					<Chip n={String(ei + 1)} title={`${yl(ERAS[ei].eds[0])}-${yl(ERAS[ei].eds[5])} · ${ERAS[ei].name}`} u={eu} />
					{f < FIN0 && <div style={{opacity: 1}}><Palmares f={f} /></div>}
					{eu < E_IN && <EraIntro i={ei} u={eu} />}
					{y && <CardE y={y} v={v} />}
					{y && bubbleK && WORLD[bubbleK] && (() => { const c = WORLD[bubbleK].c; const [x, yy] = toScreen(cam, c[0], c[1]); return <Bubble x={Math.min(900, x + 40)} y={Math.max(160, yy - 90)} text={nth(y) === 1 ? '¡Mi primera Copa!' : `¡Ya van ${nth(y)}!`} u={v - C_WIN - 20} dur={260} />; })()}
				</>
			)}
			{f >= FIN0 && <Final u={f - FIN0} f={f} />}
			<TimeStrip f={f} op={stripOp} />
			<Source text="Fuentes: CONMEBOL (palmarés oficial) · resultados internacionales 1916-2024 (martj42) · Los penaltis cuentan como empate" />
			{void Face12}
		</AbsoluteFill>
	);
};
