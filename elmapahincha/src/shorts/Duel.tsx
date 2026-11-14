import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {WORLD, bboxOf} from '../v5/WorldLayer5';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {backOut, clamp01, easeInOut, easeOut, elastic} from '../ui';
import {camPath, Key} from '../common';
import {Atlas, FaceMood, FaceSpec, Fill, INK} from '../v12/Atlas';
import {Center, CountryFace, FLAG, Flag, MiniFace, SH, SW, Spark, Stamp, SubCta, T, blinkOf} from './kit';

export type DuelCfg = {
	a: string; b: string; an: string; bn: string; aw: number; bw: number; colA: string; colB: string;
	ms: [string, number, number, string, string][]; cam: string[];
	key: {y: string; ga: number; gb: number; tag: string; note: string}[];
	dato: string; aLine: string; bLine: string; question: string;
	// optional official tally override [aWins, draws, bWins] and footer
	final?: [number, number, number]; foot?: string;
};
const YEL = '#FFD23F', INKD = '#1B1D26';
const H = 210, C0 = 210, K0 = 780, V0 = 1260, CTA0 = 1620;
export const DUEL_TOTAL = 1980;

export const duelSfx = (c: DuelCfg) => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f: Math.round(f), name, vol});
	S(0, 'boom', 0.55); S(6, 'whoosh_4', 0.45); S(24, 'slap', 0.5); S(40, 'slap', 0.5); S(64, 'boom', 0.5); S(66, 'glass', 0.3); S(110, 'crowd_ohh', 0.3);
	S(C0, 'whoosh_2', 0.5); S(C0 + 20, 'riser', 0.25);
	const n = c.ms.length; const span = 440;
	c.ms.forEach((m, i) => { if (i % Math.max(1, Math.floor(n / 60)) === 0) S(C0 + 60 + (i / n) * span, 'tick', 0.12); });
	S(C0 + 60 + span + 6, 'boom', 0.55); S(C0 + 62 + span + 6, 'crowd_roar', 0.4);
	c.key.forEach((_, i) => { const f0 = K0 + i * 150; S(f0, 'whoosh_3', 0.4); S(f0 + 14, 'slap', 0.45); S(f0 + 40, 'kick', 0.4); S(f0 + 48, 'boom', 0.4); S(f0 + 50, 'crowd_roar', 0.3); });
	S(V0, 'drumroll', 0.45); S(V0 + 80, 'boom', 0.65); S(V0 + 82, 'crowd_roar', 0.5); S(V0 + 90, 'glass', 0.3); S(V0 + 160, 'pop_2', 0.4);
	S(CTA0, 'whoosh_2', 0.45); S(CTA0 + 20, 'pop_1', 0.45); S(CTA0 + 80, 'pop_2', 0.4); S(CTA0 + 200, 'click', 0.55); S(CTA0 + 202, 'bong', 0.4);
	s.sort((x, y) => x.f - y.f);
	return s;
};
const tally = (ms: DuelCfg['ms'], upto: number) => {
	let a = 0, d = 0, b = 0;
	for (let i = 0; i < upto; i++) { const m = ms[i]; if (m[1] > m[2]) a++; else if (m[1] < m[2]) b++; else d++; }
	return [a, d, b];
};
export const DuelShort: React.FC<{c: DuelCfg}> = ({c}) => {
	const f = useCurrentFrame();
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of c.cam) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	const z = Math.min(1000 / (x1 - x0), 1300 / (y1 - y0));
	const base = {x: (x0 + x1) / 2, y: (y0 + y1) / 2, z};
	const KC: Key[] = [[0, base.x, base.y, base.z * 0.9], [DUEL_TOTAL, base.x, base.y, base.z * 1.1]];
	const cam = camPath(KC, f, 2);
	const n = c.ms.length;
	const span = 440;
	const upto = f < C0 + 60 ? 0 : Math.min(n, Math.floor(((f - C0 - 60) / span) * n) + 1);
	const raw = tally(c.ms, upto), rawF = tally(c.ms, n);
	const fin = c.final ?? rawF;
	const [ta, td, tb] = raw.map((v, i) => Math.round(v * fin[i] / Math.max(1, rawF[i])));
	const [fa, fd, fb] = fin;
	const nTot = fa + fd + fb;
	const winner = fa > fb ? c.a : fb > fa ? c.b : null;
	const fills: Record<string, Fill> = {[c.a]: {flag: FLAG[c.a]}, [c.b]: {flag: FLAG[c.b]}};
	const faces: Record<string, FaceSpec> = {};
	const leading = ta > tb ? 'a' : tb > ta ? 'b' : null;
	const moodOf = (side: 'a' | 'b'): FaceMood => {
		if (f >= V0 + 80) return winner === (side === 'a' ? c.a : c.b) ? 'happy' : winner ? 'sad' : 'shock';
		if (f >= C0 + 60) return leading === side ? 'smug' : leading ? 'angry' : 'worried';
		return 'angry';
	};
	const inHero = f < H + 10 || (f >= V0 && f < CTA0 + 10);
	const year = upto > 0 ? c.ms[upto - 1][0].slice(0, 4) : c.ms[0][0].slice(0, 4);
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			<FlagPreload flags={[FLAG[c.a], FLAG[c.b]]} />
			<Atlas cam={cam} fills={fills} faces={faces} W={SW} H={SH} dark={0.38} />
			{inHero && f < H + 10 && (
				<AbsoluteFill style={{opacity: 1 - easeInOut((f - H) / 10)}}>
					<Center y={110} gap={4}>
						<T size={110} p={backOut((f - 2) / 10)} rot={-2}>¿QUIÉN GANA</T>
						<T size={140} color="#FF4D5E" p={backOut((f - 10) / 10)} rot={-2}>MÁS VECES?</T>
					</Center>
					<CountryFace k={c.a} x={300} y={900} w={c.aw} mood="angry" look={[0.6, 0]} blink={blinkOf(f, 1)} p={elastic((f - 14) / 60)} rot={-5} />
					<CountryFace k={c.b} x={790} y={1180} w={c.bw} mood="angry" look={[-0.6, 0]} blink={blinkOf(f, 2)} p={elastic((f - 30) / 60)} rot={5} />
					<div style={{position: 'absolute', left: 540 - 120, top: 940, width: 240, height: 240, borderRadius: '50%', background: YEL, border: `11px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(-8deg) scale(${backOut((f - 60) / 10)})`}}><T size={120} color="#E8394A">VS</T></div>
					<Center y={1620} gap={4}><T size={c.an.length + c.bn.length > 15 ? 76 : 86} p={backOut((f - 80) / 10)}>{c.an.toUpperCase()} <span style={{color: YEL}}>VS</span> {c.bn.toUpperCase()}</T></Center>
				</AbsoluteFill>
			)}
			{f >= C0 && f < K0 + 10 && (
				<AbsoluteFill style={{opacity: 1 - easeInOut((f - K0) / 10)}}>
					<Center y={130} gap={10}>
						<div style={{transform: `scale(${backOut((f - C0 - 4) / 10)})`, padding: '12px 30px', borderRadius: 20, background: INKD, border: '5px solid #fff'}}><T size={58}>{nTot} PARTIDOS DESDE {c.ms[0][0].slice(0, 4)}</T></div>
						<T size={180} color={YEL} p={backOut((f - C0 - 30) / 10)}>{year}</T>
					</Center>
					<CountryFace k={c.a} x={280} y={900} w={c.aw * 0.7} mood={moodOf('a')} look={[0.6, 0]} blink={blinkOf(f, 1)} rot={-5} />
					<CountryFace k={c.b} x={800} y={900} w={c.bw * 0.7} mood={moodOf('b')} look={[-0.6, 0]} blink={blinkOf(f, 2)} rot={5} />
					<Tally c={c} ta={ta} td={td} tb={tb} p={backOut((f - C0 - 40) / 12)} />
				</AbsoluteFill>
			)}
			{f >= K0 && f < V0 + 10 && <KeyMatches c={c} t={f - K0} f={f} />}
			{f >= V0 && f < CTA0 + 10 && (
				<AbsoluteFill style={{opacity: 1 - easeInOut((f - CTA0) / 10)}}>
					<Center y={110}><T size={100} p={backOut((f - V0 - 4) / 10)}>EL VEREDICTO...</T></Center>
					<CountryFace k={c.a} x={winner === c.a ? 540 : 250} y={winner === c.a ? 760 : 1060} w={winner === c.a ? c.aw : c.aw * 0.55} mood={moodOf('a')} blink={blinkOf(f, 1)} rot={-4} />
					<CountryFace k={c.b} x={winner === c.b ? 540 : 830} y={winner === c.b ? 760 : 1060} w={winner === c.b ? c.bw : c.bw * 0.55} mood={moodOf('b')} blink={blinkOf(f, 2)} rot={4} />
					{f >= V0 + 80 && <Stamp text={winner ? `¡GANA ${(winner === c.a ? c.an : c.bn).toUpperCase()}!` : '¡EMPATE!'} col={winner === c.a ? c.colA : c.colB} t={f - V0 - 80} y={300} size={86} />}
					<div style={{position: 'absolute', left: 50, right: 50, top: 1320, transform: `translateY(${(1 - backOut((f - V0 - 150) / 14)) * 700}px)`}}>
						<div style={{borderRadius: 30, background: '#FFF7E6', border: `7px solid ${INK}`, boxShadow: '0 12px 0 rgba(0,0,0,0.35)', padding: '22px 30px'}}>
							<Bar c={c} a={fa} d={fd} b={fb} big />
							<div style={{marginTop: 16, fontFamily: RUBIK, fontWeight: 800, fontSize: 32, color: INK, lineHeight: 1.25}}><span style={{color: '#C46A00'}}>DATO </span>{c.dato}</div>
						</div>
					</div>
					<Spark x={150} y={500} s={70} f={f} /><Spark x={930} y={560} s={56} f={f} />
				</AbsoluteFill>
			)}
			{f >= CTA0 && <DuelCta t={f - CTA0} q={c.question} />}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, background: 'rgba(14,16,22,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 18, color: 'rgba(255,255,255,0.75)'}}>{c.foot ?? `Todos los partidos oficiales y amistosos (${c.ms[0][0].slice(0, 4)} - octubre 2026) · Penaltis = empate`}</div>
		</AbsoluteFill>
	);
};
const Bar: React.FC<{c: DuelCfg; a: number; d: number; b: number; big?: boolean}> = ({c, a, d, b, big}) => {
	const tot = Math.max(1, a + d + b);
	return (
		<div>
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
				{([[a, `GANÓ ${c.an.toUpperCase()}`, c.colA, FLAG[c.a]], [d, 'EMPATES', '#8C8471', ''], [b, `GANÓ ${c.bn.toUpperCase()}`, c.colB, FLAG[c.b]]] as [number, string, string, string][]).map(([v, l, col, fl]) => (
					<div key={l} style={{textAlign: 'center', flex: 1}}>
						{fl && <Flag f={fl} w={big ? 70 : 80} style={{margin: '0 auto 4px'}} />}
						<div style={{fontFamily: LILITA, fontSize: big ? 100 : 120, color: col, lineHeight: 1, WebkitTextStroke: `4px ${INK}`, paintOrder: 'stroke fill'}}>{v}</div>
						<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: big ? 22 : 24, color: big ? INK : '#fff'}}>{l}</div>
					</div>
				))}
			</div>
			<div style={{display: 'flex', height: 40, marginTop: 12, borderRadius: 20, overflow: 'hidden', border: `5px solid ${INK}`, background: '#E6DCC6'}}>
				<div style={{width: `${(a / tot) * 100}%`, background: c.colA}} />
				<div style={{width: `${(d / tot) * 100}%`, background: '#B7AE98'}} />
				<div style={{width: `${(b / tot) * 100}%`, background: c.colB}} />
			</div>
		</div>
	);
};
const Tally: React.FC<{c: DuelCfg; ta: number; td: number; tb: number; p: number}> = ({c, ta, td, tb, p}) => (
	<div style={{position: 'absolute', left: 50, right: 50, top: 1240, transform: `scale(${Math.max(0, p)})`, borderRadius: 30, background: 'rgba(22,24,31,0.92)', border: '6px solid #fff', padding: '24px 30px'}}>
		<Bar c={c} a={ta} d={td} b={tb} />
	</div>
);
const KeyMatches: React.FC<{c: DuelCfg; t: number; f: number}> = ({c, t, f}) => (
	<AbsoluteFill style={{opacity: 1 - easeInOut((t - (V0 - K0)) / 10)}}>
		<AbsoluteFill style={{background: 'rgba(5,12,30,0.3)'}} />
		<Center y={140}><T size={90} p={backOut((t - 2) / 10)}>LOS DUELOS CLAVE</T></Center>
		<div style={{position: 'absolute', left: 50, right: 50, top: 520, display: 'flex', flexDirection: 'column', gap: 34}}>
			{c.key.map((k, i) => {
				const u = t - i * 150;
				const winA = k.ga > k.gb, winB = k.gb > k.ga;
				return (
					<div key={i} style={{padding: '20px 26px', borderRadius: 30, background: '#FFF7E6', border: `7px solid ${winA ? c.colA : winB ? c.colB : '#8C8471'}`, boxShadow: `0 0 0 4px ${INK}, 0 10px 0 rgba(0,0,0,0.35)`, transform: `translateX(${(1 - easeOut(u / 14)) * (i % 2 ? 1300 : -1300)}px) rotate(${(i - 1) * 1.5}deg)`, opacity: u < 0 ? 0 : 1}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
							<span style={{fontFamily: LILITA, fontSize: 52, color: INK}}>{k.y}</span>
							<span style={{padding: '4px 14px', borderRadius: 12, background: INK, fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: '#fff'}}>{k.tag}</span>
						</div>
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, marginTop: 10}}>
							<Flag f={FLAG[c.a]} w={110} />
							<span style={{fontFamily: LILITA, fontSize: 96, color: INK, transform: `scale(${backOut((u - 40) / 10)})`}}>{k.ga} - {k.gb}</span>
							<Flag f={FLAG[c.b]} w={110} />
						</div>
						<div style={{marginTop: 6, fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: '#6B6250', textAlign: 'center', opacity: clamp01((u - 50) / 10)}}>{k.note}</div>
					</div>
				);
			})}
		</div>
		{void f}
	</AbsoluteFill>
);
const DuelCta: React.FC<{t: number; q: string}> = ({t, q}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: 'rgba(5,10,25,0.45)', opacity: easeOut(t / 16)}} />
		<Center y={280} gap={10}>
			{q.split('|').map((line, i) => <T key={i} size={i === 1 ? 110 : 84} color={i === 1 ? YEL : '#FFF6E0'} p={backOut((t - 4 - i * 8) / 10)}>{line}</T>)}
		</Center>
		<Center y={780} gap={30}>
			<div style={{transform: `scale(${backOut((t - 50) / 10)})`, padding: '14px 30px', borderRadius: 20, background: '#fff', border: `6px solid ${INK}`, fontFamily: LILITA, fontSize: 52, color: INK}}>¡Dímelo en comentarios!</div>
			<div style={{transform: `scale(${backOut((t - 90) / 12)})`, marginTop: 30}}><SubCta u={t} at={200} /></div>
			<div style={{transform: `scale(${backOut((t - 120) / 10)})`, display: 'flex', alignItems: 'center', gap: 14}}>
				<MiniFace mood="happy" s={80} bg={YEL} />
				<T size={56}>¡SÍGUEME PARA MÁS DUELOS!</T>
			</div>
		</Center>
	</AbsoluteFill>
);
export {WORLD};
