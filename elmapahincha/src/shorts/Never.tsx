import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {WORLD, bboxOf} from '../v5/WorldLayer5';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {backOut, clamp01, easeInOut, easeOut, elastic} from '../ui';
import {camPath, Key} from '../common';
import {Atlas, FaceMood, FaceSpec, Fill, INK} from '../v12/Atlas';
import {Bubble, Card, Center, CountryFace, FLAG, Flag, MiniFace, SH, SW, Spark, Stamp, SubCta, T} from './kit';
import {blinkOf} from './kit';

export type Rec = {p: number; w: number; d: number; l: number; n?: string; ms?: [string, number, number, string, string][]};
export type NeverCfg = {
	hero: string; heroName: string; stars: number; heroCam: string[]; heroW: number;
	opp: Record<string, Rec>; since: string;
	rivals: [string, string][]; // beaten big rivals [key, name]
	featured: string; featuredName: string; featuredCam: {z: number; dx?: number; dy?: number}; faceMax?: number;
	dato: string; heroLine: string; esNames: Record<string, string>;
};
const GREEN = '#3DB86B', RED = '#E8394A', YEL = '#FFD23F';
const H = 180, C0 = 180, N0 = 560, B0 = 860, R0 = 1000, CTA0 = 1640;
export const NEVER_TOTAL = 1980;
const TOUR = (t: string) => (/World Cup$/.test(t) && !/qualification/.test(t) ? 'MUNDIAL' : /Olympic/.test(t) ? 'JJ. OO.' : /Confederations/.test(t) ? 'CONFED.' : /Gold Cup/.test(t) ? 'COPA ORO' : /Copa Am/.test(t) ? 'COPA AMÉRICA' : /Euro/.test(t) && !/qualif/.test(t) ? 'EUROCOPA' : /qualif/.test(t) ? 'CLASIFICACIÓN' : /Nations League/.test(t) ? 'NATIONS LEAGUE' : 'AMISTOSO');

const fit = (keys: string[], w: number, h: number, cy = SH / 2) => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of keys) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	const z = Math.min(w / (x1 - x0), h / (y1 - y0));
	return {x: (x0 + x1) / 2, y: (y0 + y1) / 2 + (SH / 2 - cy) / z, z};
};
const CAM_WORLD = {x: 1900, y: 800, z: 0.29};

export const neverSfx = (c: NeverCfg) => {
	const KEYS = Object.keys(c.opp).filter((k) => WORLD[k]);
	const WON = KEYS.filter((k) => c.opp[k].w > 0);
	const NEV = KEYS.filter((k) => c.opp[k].w === 0);
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f: Math.round(f), name, vol});
	S(0, 'boom', 0.55); S(4, 'whoosh_4', 0.45); S(20, 'slap', 0.5); S(44, 'slap', 0.5); S(90, 'pop_2', 0.4); S(120, 'crowd_ohh', 0.25);
	S(C0, 'whoosh_2', 0.5); S(C0 + 30, 'pop_1', 0.4);
	const step = Math.min(3, 250 / WON.length);
	WON.forEach((_, i) => S(C0 + 70 + i * step, `pop_${(i % 4) + 1}`, 0.12)); S(C0 + 70 + WON.length * step + 6, 'boom', 0.55); S(C0 + 72 + WON.length * step + 6, 'crowd_roar', 0.35);
	c.rivals.forEach((_, i) => { S(N0 + i * 100, 'whoosh_3', 0.35); S(N0 + i * 100 + 10, 'slap', 0.45); S(N0 + i * 100 + 40, 'confirm', 0.35); });
	S(B0, 'glitch', 0.4); S(B0 + 10, 'drumroll', 0.45); S(B0 + 60, 'crowd_ohh', 0.35);
	S(R0, 'boom', 0.65); S(R0 + 4, 'whoosh_1', 0.4); S(R0 + 40, 'pop_1', 0.45);
	S(R0 + 90, 'slap', 0.5); S(R0 + 92, 'crowd_roar', 0.45);
	if (NEV.length > 1) NEV.forEach((_, i) => S(R0 + 120 + i * 6, `pop_${(i % 4) + 1}`, 0.2));
	S(R0 + 170, 'pop_2', 0.4); for (let k = 0; k < 8; k++) S(R0 + 190 + k * 8, 'tick', 0.15);
	(c.opp[c.featured].ms ?? []).slice(-5).forEach((m, i) => S(R0 + 260 + i * 34, m[1] < m[2] ? 'error' : 'pop_3', 0.35));
	S(R0 + 450, 'pop_4', 0.4); S(R0 + 455, 'crowd_ohh', 0.3);
	S(CTA0, 'whoosh_2', 0.45); S(CTA0 + 20, 'pop_1', 0.45); S(CTA0 + 80, 'pop_2', 0.4); S(CTA0 + 200, 'click', 0.55); S(CTA0 + 202, 'bong', 0.4);
	s.sort((a, b) => a.f - b.f);
	return s;
};

export const NeverShort: React.FC<{c: NeverCfg}> = ({c}) => {
	const f = useCurrentFrame();
	const KEYS = Object.keys(c.opp).filter((k) => WORLD[k]);
	const WON = KEYS.filter((k) => c.opp[k].w > 0);
	const NEV = KEYS.filter((k) => c.opp[k].w === 0).sort((a, b) => c.opp[b].p - c.opp[a].p);
	const multi = NEV.length > 1;
	const camHero = fit(c.heroCam, 1000, 1200, 1000);
	const fz = c.featuredCam.z; const [fx, fy] = WORLD[c.featured].c;
	const camFeat = {x: fx + (c.featuredCam.dx ?? 0), y: fy + (c.featuredCam.dy ?? 0) + (SH / 2 - 760) / fz, z: fz};
	const KC: Key[] = [
		[0, camHero.x, camHero.y, camHero.z * 0.95], [H - 20, camHero.x, camHero.y, camHero.z],
		[C0 + 60, CAM_WORLD.x, CAM_WORLD.y, CAM_WORLD.z], [B0, CAM_WORLD.x, CAM_WORLD.y, CAM_WORLD.z * 1.04],
		[R0 + 60, camFeat.x, camFeat.y, camFeat.z], [CTA0, camFeat.x, camFeat.y, camFeat.z * 1.05],
		[CTA0 + 60, CAM_WORLD.x, CAM_WORLD.y, CAM_WORLD.z], [NEVER_TOTAL, CAM_WORLD.x, CAM_WORLD.y, CAM_WORLD.z * 1.04],
	];
	const cam = camPath(KC, f, 1);
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	const step = Math.min(3, 250 / WON.length);
	const greenN = f < C0 + 70 ? 0 : Math.min(WON.length, Math.floor((f - C0 - 70) / step) + 1);
	if (f >= C0 + 70) WON.slice(0, greenN).forEach((k, i) => { fills[k] = {color: GREEN}; faces[k] = {mood: 'scared', size: 0.8, max: 60, pop: elastic((f - C0 - 70 - i * step) / 60), blink: blinkOf(f, i)}; });
	if (f >= C0 + 40) fills[c.hero] = {color: YEL};
	const rt = f - R0;
	if (f >= R0 - 10) {
		NEV.forEach((k, i) => {
			if (k === c.featured) return;
			const u = rt - 120 - i * 6;
			if (multi && u >= 0) { fills[k] = {color: RED}; faces[k] = {mood: 'smug', size: 0.9, max: 70, pop: elastic(u / 60)}; }
		});
		if (f < CTA0 + 60) { fills[c.featured] = {flag: FLAG[c.featured], lift: easeOut(rt / 20), pop: elastic(rt / 60)}; faces[c.featured] = {mood: rt > 90 ? 'smug' : 'shock', size: 1.6, max: c.faceMax ?? 330, blink: blinkOf(f, 3), pop: elastic((rt - 6) / 60)}; }
		else { fills[c.featured] = {color: RED}; faces[c.featured] = {mood: 'smug', size: 1, max: 80}; }
	}
	const darkB = f >= B0 && f < R0 + 10 ? 0.55 * easeOut((f - B0) / 16) * (1 - easeInOut((f - R0) / 10)) : 0;
	const flags = Array.from(new Set([FLAG[c.hero], ...c.rivals.map(([k]) => FLAG[k]), ...NEV.map((k) => FLAG[k])]));
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			<FlagPreload flags={flags} />
			<Atlas cam={cam} fills={fills} faces={faces} W={SW} H={SH} dark={darkB + (f < H ? 0.15 : 0)} />
			{f < H + 10 && <Hook c={c} t={f} f={f} />}
			{f >= C0 && f < N0 + 10 && <Count c={c} t={f - C0} n={greenN} total={KEYS.length} won={WON.length} />}
			{f >= N0 && f < B0 + 6 && <Rivals c={c} t={f - N0} />}
			{f >= B0 && f < R0 + 10 && <Mystery t={f - B0} f={f} n={NEV.length} />}
			{f >= R0 && f < CTA0 + 10 && <Reveal c={c} t={rt} f={f} nev={NEV} />}
			{f >= CTA0 && <Cta t={f - CTA0} />}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, background: 'rgba(14,16,22,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 18, color: 'rgba(255,255,255,0.75)'}}>Todos los partidos de {c.heroName} ({c.since} - octubre 2026) · Penaltis = empate</div>
		</AbsoluteFill>
	);
};

const out = (t: number, dur: number) => 1 - easeInOut((t - dur + 12) / 12);
const Hook: React.FC<{c: NeverCfg; t: number; f: number}> = ({c, t, f}) => (
	<AbsoluteFill style={{opacity: out(t, H + 10)}}>
		<Center y={150} gap={4}>
			<T size={92} p={backOut((t - 2) / 10)} rot={-2}>¿A QUIÉN</T>
			<T size={118} color="#FF4D5E" p={backOut((t - 8) / 10)} rot={-2} style={{display: 'inline-block'}}>NUNCA</T>
			<T size={92} p={backOut((t - 14) / 10)} rot={-2}>HA GANADO</T>
			<T size={c.heroName.length > 7 ? 130 : 150} color={YEL} p={backOut((t - 20) / 10)} rot={-2}>{c.heroName.toUpperCase()}?</T>
		</Center>
		<CountryFace k={c.hero} x={540} y={1330} w={c.heroW} mood="smug" look={[0, 0.2]} blink={blinkOf(f, 1)} p={elastic((t - 10) / 60)} rot={-3} />
		{c.stars > 0 && (
			<div style={{position: 'absolute', left: 0, right: 0, top: 1720, display: 'flex', justifyContent: 'center', gap: 6, transform: `scale(${backOut((t - 60) / 10)})`}}>
				{Array.from({length: c.stars}).map((_, i) => <svg key={i} width={70} height={70} viewBox="0 0 40 40"><path d="M20 3 L25 14.5 L37.5 15.5 L28 24 L31 36.5 L20 30 L9 36.5 L12 24 L2.5 15.5 L15 14.5Z" fill={YEL} stroke={INK} strokeWidth={3} /></svg>)}
			</div>
		)}
		<Spark x={160} y={1060} s={70} f={f} /><Spark x={920} y={1000} s={56} f={f} />
	</AbsoluteFill>
);
const Count: React.FC<{c: NeverCfg; t: number; n: number; total: number; won: number}> = ({c, t, n, total, won}) => (
	<AbsoluteFill style={{opacity: out(t, N0 - C0 + 10)}}>
		<Center y={170} gap={14}>
			<div style={{transform: `scale(${backOut((t - 6) / 10)})`, padding: '12px 30px', borderRadius: 20, background: '#1B1D26', border: '5px solid #fff'}}><T size={c.heroName.length > 7 ? 50 : 56}>{c.heroName.toUpperCase()} HA JUGADO CONTRA</T></div>
			<T size={140} color={YEL} p={backOut((t - 20) / 10)}>{total} PAÍSES</T>
		</Center>
		<Center y={1340} gap={10}>
			<div style={{transform: `scale(${backOut((t - 70) / 10)})`, display: 'flex', alignItems: 'center', gap: 20, padding: '16px 36px', borderRadius: 24, background: GREEN, border: `7px solid ${INK}`, boxShadow: '0 10px 0 rgba(0,0,0,0.35)'}}>
				<T size={64} color="#fff">LE HA GANADO A</T><T size={130} color={YEL} style={{width: 170}}>{n}</T>
			</div>
			{n >= won && <T size={70} p={backOut((t - 330) / 10)} rot={-3}>{total - won === 1 ? '¡CASI TODOS!' : '¡A CASI TODOS!'}</T>}
		</Center>
	</AbsoluteFill>
);
const Rivals: React.FC<{c: NeverCfg; t: number}> = ({c, t}) => (
	<AbsoluteFill style={{opacity: out(t, B0 - N0 + 6)}}>
		<AbsoluteFill style={{background: 'rgba(5,12,30,0.35)'}} />
		<Center y={200}><T size={90} p={backOut((t - 2) / 10)}>LE HA GANADO A...</T></Center>
		<div style={{position: 'absolute', left: 70, right: 70, top: 420, display: 'flex', flexDirection: 'column', gap: 40}}>
			{c.rivals.map(([k, n], i) => {
				const u = t - i * 100;
				const o = c.opp[k];
				return (
					<div key={k} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '22px 30px', borderRadius: 30, background: '#FFF7E6', border: `7px solid ${INK}`, boxShadow: '0 10px 0 rgba(0,0,0,0.35)', transform: `translateX(${(1 - easeOut(u / 14)) * (i % 2 ? 1200 : -1200)}px) rotate(${(i - 1) * 2}deg)`}}>
						<Flag f={FLAG[k]} w={190} />
						<div style={{flex: 1}}>
							<div style={{fontFamily: LILITA, fontSize: n.length > 11 ? 56 : 70, color: INK, lineHeight: 1}}>{n.toUpperCase()}</div>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 34, color: '#6B6250'}}>{o.w} {o.w === 1 ? 'victoria' : 'victorias'} de {c.heroName}</div>
						</div>
						<div style={{width: 110, height: 110, borderRadius: 55, background: GREEN, border: `6px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${backOut((u - 40) / 10)})`}}>
							<svg width={64} height={64} viewBox="0 0 24 24"><path d="M4 12.5 L9.5 18 L20 6" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></svg>
						</div>
					</div>
				);
			})}
		</div>
	</AbsoluteFill>
);
const Mystery: React.FC<{t: number; f: number; n: number}> = ({t, f, n}) => (
	<AbsoluteFill style={{opacity: out(t, R0 - B0 + 10)}}>
		<Center y={250} gap={8}>
			<T size={100} p={backOut((t - 4) / 10)} rot={-3}>{n === 1 ? 'PERO HAY' : 'PERO HAY'}</T>
			<T size={n === 1 ? 130 : 120} color="#FF4D5E" p={backOut((t - 16) / 10)} rot={-3}>{n === 1 ? 'UNO QUE NO...' : `${n} QUE NO...`}</T>
		</Center>
		<div style={{position: 'absolute', left: 540 - 280, top: 780, transform: `scale(${backOut((t - 30) / 12)}) rotate(${Math.sin(f / 5) * 4}deg) translateX(${Math.sin(f * 1.3) * 4}px)`}}>
			<svg width={560} height={470} viewBox="0 0 360 300">
				<path d="M60 150 C40 90 90 40 150 50 C190 20 260 40 280 90 C330 110 330 190 290 220 C270 270 190 280 150 255 C100 270 50 240 60 200 C30 190 30 165 60 150Z" fill="#2B2F3D" stroke="#fff" strokeWidth={8} />
				<text x={180} y={200} textAnchor="middle" fontFamily="Lilita" fontSize={170} fill={YEL} stroke={INK} strokeWidth={8} paintOrder="stroke">?</text>
			</svg>
		</div>
	</AbsoluteFill>
);
const Reveal: React.FC<{c: NeverCfg; t: number; f: number; nev: string[]}> = ({c, t, f, nev}) => {
	const o = c.opp[c.featured];
	const ms = (o.ms ?? []).slice(-5);
	const others = nev.filter((k) => k !== c.featured);
	const heroMood: FaceMood = t > 90 ? 'sad' : 'shock';
	return (
		<AbsoluteFill style={{opacity: out(t, CTA0 - R0 + 10)}}>
			<Center y={110} gap={6}>
				<T size={c.featuredName.length > 9 ? 120 : 150} color="#fff" p={backOut((t - 30) / 10)} rot={-3}>¡{c.featuredName.toUpperCase()}!</T>
			</Center>
			{t >= 90 && <Stamp text={nev.length === 1 ? '¡NUNCA LE HA GANADO!' : `¡Y ${nev.length - 1} MÁS!`} col={RED} t={t - 90} y={300} size={74} />}
			<CountryFace k={c.hero} x={860} y={1010} w={Math.min(300, c.heroW * 0.4)} mood={heroMood} look={[-0.6, -0.4]} blink={blinkOf(f, 2)} p={backOut((t - 60) / 12)} rot={6} />
			{t >= 120 && t < 330 && <Bubble x={720} y={880} text={c.heroLine} p={backOut((t - 120) / 10) * (1 - easeInOut((t - 320) / 8))} size={46} />}
			<Card y={1150} p={backOut((t - 170) / 14)} col={RED}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<Flag f={FLAG[c.hero]} w={86} /><span style={{fontFamily: LILITA, fontSize: 52, color: INK}}>VS</span><Flag f={FLAG[c.featured]} w={86} />
					<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: '#6B6250', marginLeft: 'auto'}}>{o.p} {o.p === 1 ? 'PARTIDO' : 'PARTIDOS'}</span>
				</div>
				<div style={{display: 'flex', justifyContent: 'space-around', marginTop: 14}}>
					{([[String(o.w), `GANÓ ${c.heroName.toUpperCase()}`, GREEN], [String(o.d), 'EMPATES', '#8C8471'], [String(o.l), `GANÓ ${c.featuredName.toUpperCase()}`, RED]] as [string, string, string][]).map(([v, l, col], i) => (
						<div key={l} style={{textAlign: 'center', transform: `scale(${backOut((t - 200 - i * 12) / 10)})`}}>
							<div style={{fontFamily: LILITA, fontSize: 96, color: col, lineHeight: 1}}>{v}</div>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: INK}}>{l}</div>
						</div>
					))}
				</div>
				<div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18, justifyContent: 'center'}}>
					{ms.map(([y, gf, ga, tour], i) => {
						const lost = gf < ga;
						return (
							<div key={y + i} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px', borderRadius: 14, background: lost ? '#FBD9D6' : '#ECE6D6', border: `4px solid ${lost ? RED : '#B7AE98'}`, transform: `scale(${backOut((t - 260 - i * 34) / 10)})`}}>
								<span style={{fontFamily: LILITA, fontSize: 34, color: INK}}>{y}</span>
								<span style={{fontFamily: LILITA, fontSize: 34, color: lost ? RED : '#6B6250'}}>{Math.max(gf, ga)}-{Math.min(gf, ga)}</span>
								<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: TOUR(tour) === 'MUNDIAL' ? RED : '#6B6250'}}>{TOUR(tour)}</span>
							</div>
						);
					})}
				</div>
				{others.length > 0 && (
					<div style={{marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', alignItems: 'center'}}>
						<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: RED}}>Y TAMPOCO A:</span>
						{others.map((k, i) => <div key={k} style={{transform: `scale(${backOut((t - 330 - i * 5) / 8)})`}}><Flag f={FLAG[k]} w={62} /></div>)}
					</div>
				)}
				<div style={{marginTop: 16, fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: INK, lineHeight: 1.25, opacity: clamp01((t - 450) / 10)}}>
					<span style={{color: '#C46A00'}}>DATO </span>{c.dato}
				</div>
			</Card>
		</AbsoluteFill>
	);
};
export const Cta: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: 'rgba(5,10,25,0.45)', opacity: easeOut(t / 16)}} />
		<Center y={260} gap={10}>
			<T size={84} p={backOut((t - 4) / 10)}>¿A QUIÉN NUNCA</T>
			<T size={84} p={backOut((t - 12) / 10)}>HA GANADO TU</T>
			<T size={110} color={YEL} p={backOut((t - 20) / 10)}>SELECCIÓN?</T>
		</Center>
		<Center y={760} gap={30}>
			<div style={{transform: `scale(${backOut((t - 50) / 10)})`, padding: '14px 30px', borderRadius: 20, background: '#fff', border: `6px solid ${INK}`, fontFamily: LILITA, fontSize: 52, color: INK}}>¡Dímelo en comentarios!</div>
			<div style={{transform: `scale(${backOut((t - 90) / 12)})`, marginTop: 30}}><SubCta u={t} at={200} /></div>
			<div style={{transform: `scale(${backOut((t - 120) / 10)})`, display: 'flex', alignItems: 'center', gap: 14}}>
				<MiniFace mood="happy" s={80} bg={YEL} />
				<T size={56}>¡UN PAÍS CADA DÍA!</T>
			</div>
		</Center>
	</AbsoluteFill>
);
