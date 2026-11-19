import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {WORLD, WCam, bboxOf, isTiny} from '../v5/WorldLayer5';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, easeInOut, easeOut, elastic} from '../ui';
import {camPath, Key, Subscribe, Confetti} from '../common';
import {FlagPreload} from '../v2/Preload';
import {Face12, FaceMood, FaceSpec, Fill, INK, toScreen} from '../v12/Atlas';
import {Atlas21} from '../v21/Atlas21';
import type {Card, Round, Slice} from '../v24/data24';
export type WCard = Card & {dato?: string};
export type WRound = Omit<Round, 'cards'> & {cards: WCard[]};
export type WCfg = {
	ALL: string[]; NAME: Record<string, string>; FL: Record<string, string>; ROUNDS: WRound[]; SLICES: Slice[]; ELIMS: Record<string, [string, string][]>; WINNER: string;
	track: {label: string; keys: string[]}; hookTitle: [string, string, string]; hookBadge: string; hookCols: number; hookCards: {k: string; at: number; card: WCard; cond: string}[];
	hookEnd: {big: string; mid: string; hint: string}; rules: string[]; duel: string[]; subRound: number; midRound: number;
	final: {t1: string; t2: string; badge: string; facts: string[]; ask: string};
	timing?: {CARD: number; C_BUB: number; C_STAMP: number; C_DATO: number};
};
export function makeWheel(C: WCfg) {
const {ALL, NAME, FL, ROUNDS, SLICES, ELIMS, WINNER} = C;
const LATAM = C.track.keys;

const FPS = 60;
const GREY = '#5B616D';
const CREAM = '#FFF7E6';
const GOLD = '#FFD23F';

// ---------------------------------------------------------------- timeline
const HOOK = 1720;
const RULES = 480;
const SPIN = 450, SP0 = 40, SP1 = 290;
const TM = C.timing ?? {CARD: 420, C_BUB: 140, C_STAMP: 270, C_DATO: 9999};
const CARD = TM.CARD, C_IN = 40, C_BUB = TM.C_BUB, C_STAMP = TM.C_STAMP, C_POOF = TM.C_STAMP + 12, C_DATO = TM.C_DATO;
const TAIL = 70;
const HP = 282;
const mapH = (u: number) => { const A = [0, 40, 140, 270, 282, 420], B = [0, 40, C_BUB, C_STAMP, C_POOF, CARD]; if (u <= 0) return u; for (let i = 1; i < A.length; i++) if (u <= A[i]) return B[i - 1] + ((u - A[i - 1]) / (A[i] - A[i - 1])) * (B[i] - B[i - 1]); return CARD + (u - 420); };
type Step = {k: string; from: number; dur: number; lab: string; card?: Card; poof: number | null};
type Rnd = {i: number; from: number; spinEnd: number; to: number; steps: Step[]; startAng: number; endAng: number};
const RNDS: Rnd[] = [];
let _t = HOOK + RULES;
let _ang = 0;
ROUNDS.forEach((r, i) => {
	const from = _t;
	const sc = r.slice * 30 + 15;
	const startAng = _ang;
	let endAng = Math.ceil((startAng + 360 * 4 + sc) / 360) * 360 - sc;
	if (endAng < startAng + 360 * 4) endAng += 360;
	_ang = endAng % 360;
	_t += SPIN;
	const spinEnd = _t;
	const elim = ELIMS[r.id];
	const cardOf: Record<string, Card> = {};
	r.cards.filter((c) => !c.safe).forEach((c) => (cardOf[c.k] = c));
	const allCards = elim.every(([k]) => cardOf[k]);
	const order: [string, string, Card | undefined][] = allCards ? r.cards.filter((c) => !c.safe).map((c) => [c.k, '', c]) : elim.map(([k, lab]) => [k, lab, cardOf[k]]);
	r.cards.filter((c) => c.safe).forEach((c) => order.push([c.k, '', c]));
	const steps: Step[] = [];
	for (const [k, lab, card] of order) {
		const dur = card ? CARD : r.step;
		steps.push({k, from: _t, dur, lab, card, poof: card ? (card.safe ? null : _t + C_POOF) : _t + 14});
		_t += dur;
	}
	_t += TAIL;
	RNDS.push({i, from, spinEnd, to: _t, steps, startAng, endAng});
});
const FIN0 = _t;
const FIN = 1560;
const V24_TOTAL = FIN0 + FIN;
const POOFS: {k: string; f: number}[] = RNDS.flatMap((r) => r.steps.filter((s) => s.poof !== null).map((s) => ({k: s.k, f: s.poof as number})));
const POOF_AT: Record<string, number> = {};
POOFS.forEach((p) => (POOF_AT[p.k] = p.f));
// hook teaser eliminations
const H_FRA = 420, H_ENG = 820, H_END3 = 1220;
const HOOK_CARDS = C.hookCards;

// ---------------------------------------------------------------- camera
const fitBox = (keys: string[], cx = 960, cy = 570, w = 1300, h = 700, minSpan = 220, zMax = 4.6): WCam => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of keys) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	if (x1 - x0 < minSpan) { const c = (x0 + x1) / 2; x0 = c - minSpan / 2; x1 = c + minSpan / 2; }
	if (y1 - y0 < minSpan * 0.6) { const c = (y0 + y1) / 2; y0 = c - minSpan * 0.3; y1 = c + minSpan * 0.3; }
	const z = Math.max(0.5, Math.min(zMax, Math.min(w / (x1 - x0 + 30), h / (y1 - y0 + 30))));
	return {x: (x0 + x1) / 2 + (960 - cx) / z, y: (y0 + y1) / 2 + (540 - cy) / z, z};
};
const WORLD_CAM: WCam = {x: 1880, y: 860, z: 0.52};
const SPIN_CAM: WCam = {x: 2250, y: 860, z: 0.5};
const cardCam = (k: string) => fitBox([k], 520, 580, 760, 640, 170, isTiny(k) ? 1.8 : 4.6);
const KEYS_CAM: Key[] = (() => {
	const K: Key[] = [];
	const P = (f: number, c: WCam) => K.push([Math.round(f), c.x, c.y, c.z]);
	P(0, {x: 1880, y: 820, z: 0.62}); P(200, WORLD_CAM);
	for (const h of HOOK_CARDS) { P(h.at + 40, cardCam(h.k)); P(h.at + 380, cardCam(h.k)); }
	P(H_END3 + 40, WORLD_CAM); P(HOOK, {x: 1880, y: 860, z: 0.56}); P(HOOK + RULES - 30, SPIN_CAM);
	for (const r of RNDS) {
		P(r.from + 20, SPIN_CAM); P(r.spinEnd - 20, SPIN_CAM);
		r.steps.forEach((s, j) => {
			if (s.card) { P(s.from + 30, cardCam(s.k)); P(s.from + CARD - 40, cardCam(s.k)); return; }
			const win = r.steps.slice(Math.max(0, j - 1), j + 2).filter((x) => !x.card).map((x) => x.k);
			P(s.from + Math.min(20, s.dur * 0.4), fitBox(win, 960, 600, 1250, 640, 200, 2.6));
		});
		P(r.to - 20, WORLD_CAM);
	}
	P(FIN0 + 30, WORLD_CAM); P(FIN0 + 200, fitBox([WINNER], 600, 600, 700, 700, 160)); P(V24_TOTAL, fitBox([WINNER], 600, 600, 700, 700, 160));
	K.sort((a, b) => a[0] - b[0]);
	return K;
})();

// ---------------------------------------------------------------- sfx / music
const v24Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f: Math.round(f), name, vol});
	S(0, 'whoosh_4', 0.45); for (let i = 0; i < 24; i++) S(10 + i * 5, `pop_${(i % 4) + 1}`, 0.15); S(40, 'slap', 0.5); S(90, 'boom', 0.45);
	const cardSfx = (f0: number, safe: boolean, hk = false) => {
		const cb = hk ? 140 : C_BUB, cs = hk ? 270 : C_STAMP, cp = hk ? HP : C_POOF, cd = hk ? 420 : CARD;
		S(f0, 'whoosh_2', 0.4); S(f0 + 22, 'pop_1', 0.4); S(f0 + C_IN, 'slap', 0.4); S(f0 + C_IN + 30, 'select', 0.3);
		if (!hk && C_DATO < cd) { S(f0 + C_DATO, 'pop_3', 0.35); S(f0 + C_DATO + 3, 'click', 0.25); }
		S(f0 + cb, 'pop_2', 0.45); S(f0 + cb + 4, 'click', 0.3); S(f0 + cs - 50, 'drumroll', 0.25);
		if (safe) { S(f0 + cs, 'confirm', 0.5); S(f0 + cs + 4, 'crowd_roar', 0.35); }
		else { S(f0 + cs, 'boom', 0.5); S(f0 + cp, 'glass', 0.4); S(f0 + cp + 2, 'crowd_ohh', 0.3); }
		S(f0 + cd - 30, 'whoosh_1', 0.3);
	};
	for (const h of HOOK_CARDS) cardSfx(h.at, false, true);
	S(H_END3, 'whoosh_4', 0.5); S(H_END3 + 30, 'slap', 0.45); S(H_END3 + 90, 'pop_2', 0.45); S(H_END3 + 150, 'pop_3', 0.45); S(H_END3 + 230, 'riser', 0.3); S(H_END3 + 300, 'boom', 0.55); S(H_END3 + 302, 'crowd_ohh', 0.3);
	S(HOOK, 'whoosh_3', 0.45); S(HOOK + 30, 'pop_1', 0.45); S(HOOK + 110, 'pop_2', 0.4); S(HOOK + 200, 'pop_3', 0.4); S(HOOK + 290, 'pop_4', 0.4);
	for (const r of RNDS) {
		S(r.from, 'whoosh_1', 0.45); S(r.from + 20, 'pop_1', 0.45); S(r.from + SP0, 'up', 0.35);
		// ticks when the pointer crosses a slice border
		let last = Math.floor(spinAng(r, r.from + SP0) / 30);
		for (let f = r.from + SP0; f <= r.from + SP1; f++) { const c = Math.floor(spinAng(r, f) / 30); if (c !== last) { S(f, 'tick', 0.35); last = c; } }
		S(r.from + SP1, 'confirm', 0.5); S(r.from + SP1 + 4, 'slap', 0.45); S(r.from + 312, 'boom', 0.5); S(r.from + 314, 'crowd_ohh', 0.3); S(r.spinEnd - 30, 'whoosh_2', 0.4);
		r.steps.forEach((st, j) => {
			if (st.card) return cardSfx(st.from, !!st.card.safe);
			S(st.from, `pop_${(j % 4) + 1}`, 0.35); S(st.from + 14, 'glass', 0.14); S(st.from + 14, 'drop', 0.12);
		});
	}
	S(FIN0, 'whoosh_4', 0.5); S(FIN0 + 60, 'drumroll', 0.35); S(FIN0 + 200, 'boom', 0.6); S(FIN0 + 204, 'crowd_roar', 0.5); S(FIN0 + 210, 'whistle_long', 0.35);
	for (let i = 0; i < 4; i++) { S(FIN0 + 420 + i * 90, `pop_${i + 1}`, 0.45); S(FIN0 + 424 + i * 90, 'click', 0.3); }
	S(FIN0 + 900, 'pop_2', 0.45); S(FIN0 + 1050, 'pop_3', 0.45); S(FIN0 + 1100, 'click', 0.5); S(FIN0 + 1102, 'bong', 0.35);
	s.sort((a, b) => a.f - b.f);
	return s;
};
const v24Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	const mid = RNDS[C.midRound].from;
	return [`m_happy:0:${sec(mid + 40)}`, `m_tense:${sec(mid)}:${sec(FIN0 + 40)}`, `m_triumph:${sec(FIN0)}:${sec(V24_TOTAL)}`].join(',');
};

// ---------------------------------------------------------------- small UI
const T: React.FC<{children: React.ReactNode; size: number; color?: string; stroke?: number; shadow?: number; style?: React.CSSProperties}> = ({children, size, color = '#fff', stroke, shadow, style}) => (
	<span style={{fontFamily: LILITA, fontSize: size, color, lineHeight: 1.05, WebkitTextStroke: `${stroke ?? size * 0.12}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${shadow ?? size * 0.07}px 0 ${INK}`, ...style}}>{children}</span>
);
const Flag: React.FC<{f: string; w: number; style?: React.CSSProperties}> = ({f, w, style}) => <img src={staticFile(`flags/${f}.svg`)} style={{width: w, height: w * 0.66, borderRadius: Math.max(3, w * 0.08), border: `${w > 50 ? 4 : 2}px solid ${INK}`, objectFit: 'cover', flexShrink: 0, ...style}} />;
const up = (s: string) => s.toUpperCase();
const nm = (k: string) => NAME[k] ?? k;
const fl = (k: string) => FL[k];

// ---------------------------------------------------------------- wheel
function spinAng(r: Rnd, f: number) {
	const u = clamp01((f - r.from - SP0) / (SP1 - SP0));
	const e = 1 - Math.pow(1 - u, 4);
	return r.startAng + (r.endAng - r.startAng) * e;
}
const Wheel: React.FC<{ang: number; used: number[]; hit: number | null; hitP: number; size: number; title: string}> = ({ang, used, hit, hitP, size, title}) => {
	const R = 300;
	const wedge = (i: number) => {
		const a0 = ((i * 30) * Math.PI) / 180, a1 = (((i + 1) * 30) * Math.PI) / 180;
		return `M0 0 L${R * Math.sin(a0)} ${-R * Math.cos(a0)} A${R} ${R} 0 0 1 ${R * Math.sin(a1)} ${-R * Math.cos(a1)} Z`;
	};
	return (
		<div style={{position: 'relative', width: size, height: size + 70}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, display: 'flex', justifyContent: 'center', zIndex: 3}}>
				<div style={{padding: '6px 26px', borderRadius: 30, background: CREAM, border: `5px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)'}}><T size={38} color={INK} stroke={0} shadow={0}>{title}</T></div>
			</div>
			<svg width={size} height={size} viewBox="-340 -340 680 680" style={{position: 'absolute', top: 70}}>
				<circle r={332} fill="#0B0D12" opacity={0.35} cy={10} />
				<circle r={330} fill={GOLD} stroke={INK} strokeWidth={10} />
				{Array.from({length: 24}).map((_, i) => { const a = (i / 24) * Math.PI * 2; return <circle key={i} cx={316 * Math.sin(a)} cy={-316 * Math.cos(a)} r={7} fill={(i + Math.floor(ang / 15)) % 2 ? '#FFF6C2' : '#FF9F1C'} stroke={INK} strokeWidth={2} />; })}
				<g transform={`rotate(${ang})`}>
					{SLICES.map((s, i) => {
						const isUsed = used.includes(i);
						const isHit = hit === i;
						return (
							<g key={i}>
								<path d={wedge(i)} fill={isUsed ? '#3A3F4A' : s.col} stroke={INK} strokeWidth={5} />
								{isHit && <path d={wedge(i)} fill="#fff" opacity={0.5 * Math.abs(Math.sin(hitP * Math.PI * 3))} />}
								<g transform={`rotate(${i * 30 + 15}) translate(0 -160) rotate(-90)`}>
									<text textAnchor="middle" dominantBaseline="middle" fontFamily={LILITA} fontSize={s.label.length > 13 ? 21 : 25} fill="#fff" stroke={INK} strokeWidth={5} paintOrder="stroke" opacity={isUsed ? 0.45 : 1}>{s.label}</text>
								</g>
								{isUsed && <g transform={`rotate(${i * 30 + 15}) translate(0 -255)`}><path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#E63946" strokeWidth={8} strokeLinecap="round" /></g>}
							</g>
						);
					})}
				</g>
				<circle r={62} fill={CREAM} stroke={INK} strokeWidth={8} />
				<text textAnchor="middle" dominantBaseline="central" fontFamily={LILITA} fontSize={74} fill={INK}>?</text>
				<path d="M-34 -352 L34 -352 L0 -286 Z" fill="#E63946" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
			</svg>
		</div>
	);
};

// ---------------------------------------------------------------- card art
const Art: React.FC<{k: string; w: number; mood?: FaceMood}> = ({k, w, mood = 'scared'}) => (
	<div style={{position: 'relative', width: w, height: w * 0.66}}>
		<img src={staticFile(`flags/${FL[k]}.svg`)} style={{width: w, height: w * 0.66, borderRadius: w * 0.06, border: `${Math.max(3, w * 0.015)}px solid ${INK}`, objectFit: 'cover', boxShadow: '0 10px 0 rgba(0,0,0,0.35)', boxSizing: 'border-box'}} />
		<svg width={w * 0.5} height={w * 0.5} viewBox="0 0 200 200" style={{position: 'absolute', left: w * 0.25, top: w * 0.08, overflow: 'visible'}}><Face12 mood={mood} /></svg>
	</div>
);

// ---------------------------------------------------------------- card
const CardPanel: React.FC<{c: WCard; t: number; hook?: boolean}> = ({c, t, hook}) => {
	const pin = easeOut((t - C_IN) / 18) - easeInOut((t - CARD + 40) / 18);
	if (pin <= 0) return null;
	const lens = easeOut((t - C_IN - 20) / 40);
	const st = t - C_STAMP;
	const col = c.safe ? '#3DB86B' : '#E63946';
	return (
		<div style={{position: 'absolute', left: 1030, top: 170, width: 820, transform: `translateX(${(1 - pin) * 900}px) rotate(1deg)`}}>
			<div style={{borderRadius: 26, background: CREAM, border: `6px solid ${INK}`, boxShadow: '0 12px 0 rgba(0,0,0,0.35)', padding: 26}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14}}>
					<Flag f={fl(c.k)} w={64} /><T size={44} color={INK} stroke={0} shadow={0}>{up(nm(c.k))}</T>
				</div>
				<div style={{position: 'relative', height: 420, borderRadius: 16, overflow: 'hidden', border: `5px solid ${INK}`}}>
					<img src={staticFile(`flags/${fl(c.k)}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(3px) saturate(1.2)', transform: 'scale(1.05)'}} />
					<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.55), rgba(0,0,0,0.25))'}} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', justifyContent: 'center', transform: `scale(${0.6 + 0.4 * lens}) rotate(${(1 - lens) * -8}deg)`}}><Art k={c.k} w={440} mood={c.safe && t >= C_STAMP ? 'happy' : t >= C_BUB ? 'panic' : 'scared'} /></div>
				</div>
				<div style={{marginTop: 18}}><T size={48} color="#E8A100" stroke={4} shadow={3}>{c.title}</T></div>
				<div style={{marginTop: 10, fontFamily: RUBIK, fontWeight: 700, fontSize: 30, color: INK, lineHeight: 1.25}}>{c.line}</div>
				{c.dato && t >= C_DATO && <div style={{marginTop: 12, display: 'flex', gap: 10, alignItems: 'flex-start', transform: `translateX(${(1 - easeOut((t - C_DATO) / 14)) * 60}px)`, opacity: clamp01((t - C_DATO) / 10)}}><span style={{flexShrink: 0, padding: '2px 10px', borderRadius: 8, background: '#E8A100', fontFamily: LILITA, fontSize: 24, color: '#fff'}}>DATO</span><span style={{fontFamily: RUBIK, fontWeight: 700, fontSize: 26, color: '#4A4335', lineHeight: 1.25}}>{c.dato}</span></div>}
			</div>
			{st >= 0 && (
				<div style={{position: 'absolute', left: 120, top: 250, transform: `scale(${2.2 - 1.2 * easeOut(st / 10)}) rotate(-10deg)`, opacity: clamp01(st / 6)}}>
					<div style={{padding: '10px 34px', border: `10px solid ${col}`, borderRadius: 18, background: 'rgba(255,255,255,0.9)'}}><T size={96} color={col} stroke={6}>{c.safe ? '¡SE SALVA!' : hook ? '¡FUERA!' : '¡DESAPARECE!'}</T></div>
				</div>
			)}
		</div>
	);
};
const Bubble: React.FC<{x: number; y: number; text: string; p: number}> = ({x, y, text, p}) => p <= 0 ? null : (
	<div style={{position: 'absolute', left: Math.max(20, Math.min(1000, x - 40)), top: Math.max(130, y - 150), transform: `scale(${backOut(p)})`, transformOrigin: 'bottom left'}}>
		<div style={{position: 'relative', padding: '14px 24px', background: '#fff', border: `5px solid ${INK}`, borderRadius: 24, boxShadow: '0 6px 0 rgba(0,0,0,0.3)', maxWidth: 480}}>
			<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 34, color: INK}}>{text}</span>
			<div style={{position: 'absolute', left: 34, bottom: -26, width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: `26px solid ${INK}`}} />
		</div>
	</div>
);

// ---------------------------------------------------------------- HUD
const Quedan: React.FC<{n: number; flash: number}> = ({n, flash}) => (
	<div style={{position: 'absolute', right: 34, top: 28, minWidth: 190, padding: '8px 22px 12px', borderRadius: 18, background: '#14161D', border: `5px solid ${flash > 0 ? '#E63946' : '#fff'}`, boxShadow: '0 8px 0 rgba(0,0,0,0.4)', textAlign: 'center', transform: `scale(${1 + 0.12 * flash})`}}>
		<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: 'rgba(255,255,255,0.75)'}}>QUEDAN</div>
		<div style={{fontFamily: LILITA, fontSize: 76, lineHeight: 1, color: '#fff'}}>{n}</div>
	</div>
);
const RoundChip: React.FC<{i: number; p: number}> = ({i, p}) => {
	const r = ROUNDS[i], s = SLICES[r.slice];
	return (
		<div style={{position: 'absolute', left: 34, top: 30, transform: `scale(${p})`, transformOrigin: 'top left', display: 'flex', alignItems: 'stretch', borderRadius: 16, overflow: 'hidden', border: `5px solid ${INK}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
			<div style={{padding: '8px 16px', background: CREAM, fontFamily: RUBIK, fontWeight: 900, fontSize: 26, color: INK, display: 'flex', alignItems: 'center'}}>{i === ROUNDS.length - 1 ? 'DUELO FINAL' : `RONDA ${i + 1}/${ROUNDS.length}`}</div>
			<div style={{padding: '8px 18px', background: s.col, display: 'flex', alignItems: 'center'}}><T size={32}>{s.label}</T></div>
		</div>
	);
};
const Tracker: React.FC<{gone: Set<string>; p: number}> = ({gone, p}) => {
	const left = LATAM.filter((k) => !gone.has(k)).length;
	return (
		<div style={{position: 'absolute', left: 30, bottom: 28, padding: '10px 14px', borderRadius: 16, background: 'rgba(20,22,29,0.88)', border: '4px solid #fff', transform: `translateY(${(1 - p) * 240}px)`}}>
			<div style={{display: 'flex', justifyContent: 'space-between', fontFamily: RUBIK, fontWeight: 800, fontSize: 19, color: '#fff', letterSpacing: 1, marginBottom: 8}}><span>{C.track.label}</span><span style={{color: GOLD}}>{left}/{LATAM.length}</span></div>
			<div style={{display: 'grid', gridTemplateColumns: `repeat(${Math.min(10, LATAM.length)}, 40px)`, gap: 6}}>
				{LATAM.map((k) => (
					<div key={k} style={{position: 'relative'}}>
						<Flag f={fl(k)} w={40} style={{filter: gone.has(k) ? 'grayscale(1) brightness(0.55)' : 'none'}} />
						{gone.has(k) && <svg width={40} height={27} style={{position: 'absolute', left: 0, top: 0}}><path d="M8 5 L32 22 M32 5 L8 22" stroke="#E63946" strokeWidth={5} strokeLinecap="round" /></svg>}
					</div>
				))}
			</div>
		</div>
	);
};

// ---------------------------------------------------------------- poof
const Poof: React.FC<{x: number; y: number; r: number; u: number}> = ({x, y, r, u}) => {
	if (u < 0 || u > 40) return null;
	const p = easeOut(u / 30), o = 1 - clamp01((u - 14) / 26);
	return (
		<g opacity={o}>
			{Array.from({length: 8}).map((_, i) => { const a = (i / 8) * Math.PI * 2 + 0.3; const d = r * (0.2 + 0.9 * p); return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={r * (0.35 + 0.35 * p)} fill="#E9ECF2" stroke="#9AA1AE" strokeWidth={r * 0.06} />; })}
			<circle cx={x} cy={y} r={r * 0.6 * (1 - p * 0.5)} fill="#fff" />
		</g>
	);
};

// ---------------------------------------------------------------- video
const ALL_FLAGS = Array.from(new Set(ALL.map((k) => FL[k]).filter(Boolean)));
const blinkOf = (f: number, k: string) => { const ph = (f + k.charCodeAt(0) * 7 + k.charCodeAt(1) * 3 + k.charCodeAt(2)) % 240; return ph < 8 ? Math.sin((ph / 8) * Math.PI) : 0; };
const wide = (k: string) => { const b = WORLD[k].b; return b[1][0] - b[0][0] > 22 && b[1][1] - b[0][1] > 14; };
const cen = (k: string) => WORLD[k].c as unknown as [number, number];

const Video24: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS_CAM, f, 21);
	const inHook = f < HOOK;
	const rnd = RNDS.find((r) => f >= r.from && f < r.to);
	const step = rnd?.steps.find((s) => f >= s.from && f < s.from + s.dur);
	const t = step ? f - step.from : 0;
	const hc = inHook ? HOOK_CARDS.find((h) => f >= h.at && f < h.at + 420) : undefined;
	const ht = hc ? mapH(f - hc.at) : 0;
	// ---- elimination state
	const gone = new Set<string>();
	if (inHook) { for (const h of HOOK_CARDS) if (f >= h.at + HP && f < H_END3 + 300) gone.add(h.k); }
	else for (const p of POOFS) if (f >= p.f) gone.add(p.k);
	const alive = ALL.length - gone.size;
	const lastPoof = inHook ? HOOK_CARDS.map((h) => h.at + HP).filter((x) => x <= f).pop() ?? -99 : POOFS.filter((p) => p.f <= f).map((p) => p.f).pop() ?? -99;
	const flash = clamp01(1 - (f - lastPoof) / 14);
	const spinning = rnd && f < rnd.spinEnd;
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	const tops: React.ReactNode[] = [];
	const intro = (k: string) => elastic((f - 6 - (cen(k)[0] / 4000) * 110) / FPS);
	const useImg = false;
	const greyK: string[] = [];
	const vx0 = cam.x - 960 / cam.z - 30, vx1 = cam.x + 960 / cam.z + 30, vy0 = cam.y - 540 / cam.z - 30, vy1 = cam.y + 540 / cam.z + 30;
	const vis = (k: string) => { const b = WORLD[k].b; return b[1][0] >= vx0 && b[0][0] <= vx1 && b[1][1] >= vy0 && b[0][1] <= vy1; };
	for (const k of ALL) {
		if (!WORLD[k]) continue;
		if (gone.has(k)) {
			if (useImg) greyK.push(k); else fills[k] = {color: GREY};
			const pf = inHook ? (HOOK_CARDS.find((h) => h.k === k)!.at + HP) : POOF_AT[k];
			const u = f - pf;
			if (u < 30) faces[k] = {mood: 'sad', size: 0.9, max: 70, pop: 1 - clamp01(u / 26)};
			continue;
		}
		const finalDim = f >= FIN0 && k !== WINNER;
		if (finalDim) { if (useImg) greyK.push(k); else fills[k] = {color: GREY}; continue; }
		if (!useImg) fills[k] = {flag: FL[k], pop: f < 200 ? intro(k) : 1};
		if (vis(k) && wide(k)) faces[k] = {mood: spinning && f - rnd!.from > SP0 ? 'worried' : 'neutral', size: 0.75, max: 64, blink: blinkOf(f, k), pop: f < 200 ? intro(k) : 1, look: spinning ? [0.6, -0.3] : [0, 0]};
	}
	// ---- focus (card or team step)
	const focus = (k: string, u: number, card: Card | undefined, poofU: number | null) => {
		const [cx, cy] = cen(k);
		if (poofU === null || poofU < 0) {
			fills[k] = {flag: FL[k], lift: easeOut((u - 6) / 16), pop: 1 + 0.08 * Math.sin(clamp01(u / 20) * Math.PI)};
			const mood: FaceMood = card ? (card.safe && u >= C_STAMP ? 'happy' : u >= C_BUB ? 'panic' : 'scared') : 'scared';
			const talk = card && u >= C_BUB && u < C_BUB + 90 ? Math.abs(Math.sin(u / 3.2)) : 0;
			faces[k] = {mood, size: 1.2, max: card ? 170 : 90, pop: elastic((u - 4) / FPS), blink: blinkOf(f, k), talk, look: card ? [0.8, -0.2] : [0, 0]};
		}
		if (poofU !== null) { const bb = bboxOf(k); tops.push(<Poof key={'p' + k} x={cx} y={cy} r={Math.max(Math.max(bb.w, bb.h) * 0.28, 26 / cam.z)} u={poofU} />); }
		if (isTiny(k) || bboxOf(k).w * cam.z < 26) tops.push(<circle key={'m' + k} cx={cx} cy={cy} r={(30 + 4 * Math.sin(f / 5)) / cam.z} fill="none" stroke="#fff" strokeWidth={6 / cam.z} />);
	};
	if (hc) focus(hc.k, ht, hc.card, f >= hc.at + HP ? f - hc.at - HP : null);
	if (step) focus(step.k, t, step.card, step.poof !== null && f >= step.poof ? f - step.poof : null);
	if (f >= FIN0) {
		const u = f - FIN0;
		fills[WINNER] = {flag: FL[WINNER], lift: easeOut((u - 150) / 30), pop: 1 + 0.1 * Math.sin(clamp01((u - 190) / 30) * Math.PI)};
		faces[WINNER] = {mood: u < 200 ? 'worried' : 'love', size: 1.6, max: 260, blink: blinkOf(f, WINNER), talk: u > 900 && u < 1050 ? Math.abs(Math.sin(u / 3.2)) : 0};
	}
	// ---- screen-space overlays
	const hudP = inHook ? easeOut((f - 120) / 20) : 1;
	const roundIdx = rnd ? (f >= rnd.from + SP1 + 10 ? rnd.i : rnd.i - 1) : f >= FIN0 ? ROUNDS.length - 1 : -1;
	const sp = (k: string) => toScreen(cam, cen(k)[0], cen(k)[1]);
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			{!useImg && <FlagPreload flags={ALL_FLAGS} />}
			<Atlas21 cam={cam} fills={fills} faces={faces} top={<>{tops}</>} flagImg={useImg} grey={greyK} dark={spinning ? 0.35 * easeOut((f - rnd!.from) / 20) * (1 - easeInOut((f - rnd!.spinEnd + 40) / 30)) : f >= FIN0 ? 0.25 * easeOut((f - FIN0) / 40) : f >= HOOK && f < HOOK + RULES ? 0.4 * easeOut((f - HOOK) / 20) * (1 - easeInOut((f - HOOK - RULES + 30) / 30)) : 0} />
			{/* HOOK */}
			{inHook && <HookOverlay f={f} />}
			{hc && (() => { const [x, y] = sp(hc.k); return <><CardPanel c={hc.card} t={ht} hook /><Bubble x={x} y={y - 60} text={hc.card.bubble} p={clamp01((ht - C_BUB) / 12) * (1 - clamp01((ht - C_STAMP + 10) / 10))} /><div style={{position: 'absolute', left: 40, right: 40, top: 40, display: 'flex', justifyContent: 'center', opacity: 1 - clamp01((ht - CARD + 40) / 20)}}><div style={{transform: `scale(${backOut((ht - 8) / 12)}) rotate(-1deg)`}}><T size={50} color={GOLD}>{hc.cond}</T></div></div></>; })()}
			{f >= HOOK && f < HOOK + RULES && <Rules u={f - HOOK} />}
			{/* ROUND */}
			{rnd && f < rnd.spinEnd && <SpinOverlay r={rnd} f={f} />}
			{step && !step.card && (() => {
				const [x, y] = sp(step.k);
				const p = backOut(t / 8);
				return (
					<div style={{position: 'absolute', left: Math.max(40, Math.min(1480, x - 200)), top: Math.max(140, Math.min(820, y - 170)), width: 400, display: 'flex', justifyContent: 'center', transform: `scale(${p})`}}>
						<div style={{padding: '8px 16px', borderRadius: 16, background: CREAM, border: `5px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)', textAlign: 'center'}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center'}}><Flag f={fl(step.k)} w={46} /><T size={34} color={INK} stroke={0} shadow={0}>{up(nm(step.k))}</T></div>
							{step.lab && <div style={{marginTop: 4, fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: '#C1121F', whiteSpace: 'nowrap'}}>{step.lab}</div>}
						</div>
					</div>
				);
			})()}
			{step?.card && (() => { const [x, y] = sp(step.k); return <><CardPanel c={step.card} t={t} /><Bubble x={x} y={y - 70} text={step.card.bubble} p={clamp01((t - C_BUB) / 12) * (1 - clamp01((t - C_STAMP + 10) / 10))} /></>; })()}
			{rnd && f >= rnd.spinEnd - 10 && f < rnd.to && (
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', opacity: easeOut((f - rnd.spinEnd + 10) / 14)}}>
					<div style={{padding: '8px 26px', borderRadius: 30, background: 'rgba(20,22,29,0.85)', border: `4px solid ${SLICES[ROUNDS[rnd.i].slice].col}`}}><T size={34} color="#fff" stroke={4} shadow={0}>{'DESAPARECE SI ' + ROUNDS[rnd.i].cond.replace(/[¡!]/g, '')}</T></div>
				</div>
			)}
			{rnd && rnd.i === C.subRound && f >= rnd.from + 60 && f < rnd.from + 400 && <Subscribe f={f} start={rnd.from + 60} style={{position: 'absolute', left: 60, top: 470}} />}
			{/* HUD */}
			{roundIdx >= 0 && <RoundChip i={roundIdx} p={1} />}
			{f >= 100 && <div style={{opacity: hudP}}><Quedan n={alive} flash={flash} /></div>}
			{f >= HOOK && f < FIN0 + 60 && <Tracker gone={gone} p={easeOut((f - HOOK - RULES + 60) / 30) * (1 - easeInOut((f - FIN0) / 40))} />}
			{f >= FIN0 && <Final u={f - FIN0} />}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- hook text
const JORDER = ALL.slice().sort((a, b) => cen(a)[0] - cen(b)[0]);
const HookOverlay: React.FC<{f: number}> = ({f}) => {
	const o1 = 1 - easeInOut((f - H_FRA + 10) / 14);
	const u = f - H_END3;
	return (
		<>
			{f < H_FRA + 10 && (
				<AbsoluteFill style={{opacity: o1}}>
					<div style={{position: 'absolute', left: 40, top: 60, width: 760, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4}}>
						<div style={{transform: `scale(${backOut((f - 20) / 14)}) rotate(-2deg)`}}><T size={92}>{C.hookTitle[0]}</T></div>
						<div style={{transform: `scale(${backOut((f - 36) / 14)}) rotate(-2deg)`}}><T size={110} color="#E63946">{C.hookTitle[1]}</T></div>
						<div style={{transform: `scale(${backOut((f - 52) / 14)}) rotate(-2deg)`}}><T size={80}>{C.hookTitle[2]}</T></div>
					</div>
					<div style={{position: 'absolute', left: 820, top: 70, width: 1060, display: 'grid', gridTemplateColumns: `repeat(${C.hookCols}, 1fr)`, gap: 10}}>
						{JORDER.map((k, i) => {
							const d = 30 + i * 5;
							const p = easeOut((f - d) / 18);
							return (
								<div key={k} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: f >= d ? 1 : 0, transform: `translateY(${(1 - p) * -500}px) rotate(${(1 - p) * ((i % 2) * 2 - 1) * 30}deg)`}}>
									<Art k={k} w={Math.min(150, 1000 / C.hookCols)} mood="worried" />
								</div>
							);
						})}
					</div>
					<div style={{position: 'absolute', left: 60, top: 520, transform: `scale(${backOut((f - 300) / 12)}) rotate(-3deg)`, padding: '10px 24px', borderRadius: 16, background: INK, border: '5px solid #fff'}}><T size={46} color={GOLD}>{C.hookBadge}</T></div>
				</AbsoluteFill>
			)}
			{u >= 0 && (
				<AbsoluteFill style={{alignItems: 'center', paddingTop: 60, gap: 10, opacity: 1 - easeInOut((f - HOOK + 16) / 16)}}>
					<div style={{transform: `scale(${backOut((u - 20) / 12)}) rotate(-2deg)`}}><T size={120} color={GOLD}>{C.hookEnd.big}</T></div>
					<div style={{display: 'flex', gap: 30}}>
						<div style={{transform: `scale(${backOut((u - 90) / 12)})`}}><T size={70}>{C.hookEnd.mid}</T></div>
						<div style={{transform: `scale(${backOut((u - 150) / 12)})`}}><T size={70} color="#E63946">SOLO 1 SOBREVIVE</T></div>
					</div>
					<div style={{marginTop: 300, transform: `scale(${backOut((u - 300) / 12)}) rotate(-3deg)`, padding: '18px 44px', borderRadius: 24, background: INK, border: '6px solid #fff'}}><T size={92} color={GOLD}>¿CUÁL SOBREVIVE?</T></div>
					<div style={{transform: `scale(${backOut((u - 360) / 12)})`, padding: '8px 22px', borderRadius: 30, background: '#fff', border: `4px solid ${INK}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: INK}}>{C.hookEnd.hint}</div>
				</AbsoluteFill>
			)}
		</>
	);
};
const Rules: React.FC<{u: number}> = ({u}) => {
	const o = 1 - easeInOut((u - RULES + 30) / 24);
	const lines = C.rules;
	return (
		<AbsoluteFill style={{opacity: o}}>
			<div style={{position: 'absolute', left: 80, top: 150, width: 860}}>
				<div style={{transform: `scale(${backOut((u - 10) / 12)}) rotate(-2deg)`, transformOrigin: 'left center', marginBottom: 30}}><T size={84} color={GOLD}>CÓMO SE JUEGA</T></div>
				{lines.map((l, i) => (
					<div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22, transform: `translateX(${(1 - easeOut((u - 30 - i * 90) / 16)) * -1000}px)`}}>
						<div style={{width: 64, height: 64, borderRadius: 32, background: SLICES[i].col, border: `5px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><T size={40}>{i + 1}</T></div>
						<div style={{padding: '10px 20px', borderRadius: 16, background: CREAM, border: `5px solid ${INK}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 34, color: INK}}>{l}</div>
					</div>
				))}
			</div>
			<div style={{position: 'absolute', left: 1080, top: 150, transform: `scale(${backOut((u - 20) / 16) * 0.95})`, transformOrigin: 'top left'}}>
				<Wheel ang={u * 1.2} used={[]} hit={null} hitP={0} size={720} title="LA RULETA" />
			</div>
		</AbsoluteFill>
	);
};
const SpinOverlay: React.FC<{r: Rnd; f: number}> = ({r, f}) => {
	const u = f - r.from;
	const R = ROUNDS[r.i];
	const pin = backOut(u / 16) * (1 - easeInOut((u - SPIN + 70) / 30));
	const landed = u >= SP1;
	const used = ROUNDS.slice(0, r.i).map((x) => x.slice);
	const ban = u - SP1 - 22;
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 1140, top: 120, transform: `scale(${pin * (landed ? 1 - 0.25 * easeInOut((u - SP1 - 10) / 20) : 1)})`, transformOrigin: 'center center'}}>
				<Wheel ang={spinAng(r, f)} used={used} hit={landed ? R.slice : null} hitP={clamp01((u - SP1) / 40)} size={700} title={r.i === ROUNDS.length - 1 ? '¡DUELO FINAL!' : `RONDA ${r.i + 1}`} />
			</div>
			{r.i === ROUNDS.length - 1 && u < SP1 && (
				<div style={{position: 'absolute', left: 140, top: 330, display: 'flex', alignItems: 'center', gap: 40, transform: `scale(${backOut((u - 10) / 14)})`}}>
					{C.duel.map((k, i) => <React.Fragment key={k}>{i > 0 && <T size={90} color={GOLD}>VS</T>}<Flag f={fl(k)} w={200} /></React.Fragment>)}
				</div>
			)}
			{ban >= 0 && (
				<div style={{position: 'absolute', left: 60, right: 760, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: 1 - easeInOut((u - SPIN + 40) / 20)}}>
					<div style={{transform: `scale(${backOut(ban / 12)}) rotate(-2deg)`}}><T size={64}>SI TU SELECCIÓN...</T></div>
					<div style={{transform: `scale(${backOut((ban - 12) / 12)}) rotate(-2deg)`, padding: '18px 34px', borderRadius: 24, background: SLICES[R.slice].col, border: `7px solid ${INK}`, boxShadow: '0 10px 0 rgba(0,0,0,0.4)', textAlign: 'center'}}><T size={72}>{R.cond}</T></div>
					<div style={{transform: `scale(${backOut((ban - 40) / 12)})`, padding: '8px 22px', borderRadius: 30, background: '#fff', border: `4px solid ${INK}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 32, color: INK}}>{ELIMS[R.id].length === 1 ? 'Solo cae una...' : `Caen ${ELIMS[R.id].length} selecciones`}</div>
				</div>
			)}
		</AbsoluteFill>
	);
};
const Final: React.FC<{u: number}> = ({u}) => {
	const facts = C.final.facts;
	return (
		<AbsoluteFill>
			{u >= 200 && <Confetti f={u} start={200} n={160} />}
			<div style={{position: 'absolute', left: 1000, right: 40, top: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
				<div style={{transform: `scale(${backOut((u - 200) / 14)}) rotate(-2deg)`}}><T size={96} color={GOLD}>{C.final.t1}</T></div>
				<div style={{transform: `scale(${backOut((u - 216) / 14)}) rotate(-2deg)`}}><T size={96} color={GOLD}>{C.final.t2}</T></div>
				<div style={{transform: `scale(${backOut((u - 280) / 12)})`, padding: '8px 26px', borderRadius: 30, background: '#fff', border: `5px solid ${INK}`}}><T size={40} color={INK} stroke={0} shadow={0}>{C.final.badge}</T></div>
				<div style={{marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14, width: 780}}>
					{facts.map((x, i) => (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 18px', borderRadius: 16, background: CREAM, border: `5px solid ${INK}`, transform: `translateX(${(1 - easeOut((u - 420 - i * 90) / 16)) * 1000}px)`}}>
							<div style={{width: 22, height: 22, borderRadius: 11, background: '#D3202B', border: `4px solid ${INK}`}} />
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 34, color: INK}}>{x}</span>
						</div>
					))}
				</div>
			</div>
			{u >= 900 && (
				<div style={{position: 'absolute', left: 1000, right: 40, top: 840, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
					<div style={{transform: `scale(${backOut((u - 900) / 12)})`, padding: '12px 30px', borderRadius: 40, background: '#F15BB5', border: `5px solid ${INK}`}}><T size={44}>{C.final.ask}</T></div>
					<Subscribe f={u} start={1050} />
				</div>
			)}
		</AbsoluteFill>
	);
};
return {Video: Video24, TOTAL: V24_TOTAL, sfx: v24Sfx, music: v24Music, RNDS, FIN0, HOOK};
}
