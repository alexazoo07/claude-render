import React, {useMemo} from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {WORLD, WCam, bboxOf} from '../v5/WorldLayer5';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, easeInOut, easeOut, elastic} from '../ui';
import {camPath, Key, Subscribe} from '../common';
import {FlagPreload} from '../v2/Preload';
import {Atlas, Face12, FaceMood, FaceSpec, Fill, INK, toScreen} from '../v12/Atlas';
import {CAT_COL, CAT_DARK, CAT_NAME, CAT_RULE, CAT_STAMP, Cat, Cta, Focus, Group, NAME, NEVER, OPP, SCRIPT} from './data20';

const FPS = 60;
const CREAM = '#FFF7E6';
const CELESTE = '#6CB4EE';
const HERO = 'VEN';
const HERO_COL = '#F6C945';
const CATS: Cat[] = ['SIN', 'RES', 'MIE', 'PAN'];

// ---------------------------------------------------------------- timeline
export const HOOK = 1260;
const LEG = 540;
const FOC = 1260;
// focus phases
const P_PIN = 30, P_LINE = 70, P_CARD = 90, P_F = [180, 360, 540], P_B1 = 760, P_B2 = 920, P_REV = 1070, P_FEED = 1120;
// group phases
const G0 = 150, GSTEP = 70, GTAIL = 230;
type Seg = {kind: 'focus'; from: number; dur: number; e: Focus; i: number} | {kind: 'group'; from: number; dur: number; e: Group; i: number} | {kind: 'cta'; from: number; dur: number; e: Cta; i: number};
const CTA = 330;
export const SEGS: Seg[] = [];
let _t = HOOK + LEG;
SCRIPT.forEach((e, i) => {
	if (e.kind === 'focus') { SEGS.push({kind: 'focus', from: _t, dur: FOC, e, i}); _t += FOC; }
	else if (e.kind === 'cta') { SEGS.push({kind: 'cta', from: _t, dur: CTA, e, i}); _t += CTA; }
	else { const dur = G0 + GSTEP * e.keys.length + GTAIL; SEGS.push({kind: 'group', from: _t, dur, e, i}); _t += dur; }
});
export const FIN0 = _t;
const FIN = 1500, OUTRO = 600;
export const OUT0 = FIN0 + FIN;
export const V20_TOTAL = OUT0 + OUTRO;
const FOCI = SEGS.filter((s): s is Extract<Seg, {kind: 'focus'}> => s.kind === 'focus');
const revealAt = (s: Extract<Seg, {kind: 'focus'}>) => s.from + P_REV;
// every reveal (k, frame)
const REV: {k: string; f: number}[] = [];
for (const s of SEGS) {
	if (s.kind === 'focus') REV.push({k: s.e.k, f: s.from + P_REV + 20});
	else if (s.kind === 'group') s.e.keys.forEach((k, j) => REV.push({k, f: s.from + G0 + j * GSTEP + 16}));
}
const ALL_FLAGS = Array.from(new Set(['ve', 'co', 'bo', ...Object.values(OPP).map((o) => o.flag)]));

// ---------------------------------------------------------------- camera
const fitBox = (keys: string[], cx = 1010, cy = 450, w = 700, h = 480, minSpan = 230): WCam => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of keys) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	if (x1 - x0 < minSpan) { const c = (x0 + x1) / 2; x0 = c - minSpan / 2; x1 = c + minSpan / 2; }
	if (y1 - y0 < minSpan * 0.7) { const c = (y0 + y1) / 2; y0 = c - minSpan * 0.35; y1 = c + minSpan * 0.35; }
	const z = Math.max(0.5, Math.min(4.2, Math.min(w / (x1 - x0 + 30), h / (y1 - y0 + 30))));
	return {x: (x0 + x1) / 2 + (960 - cx) / z, y: (y0 + y1) / 2 + (540 - cy) / z, z};
};
const WORLD_CAM: WCam = {x: 1880, y: 880, z: 0.52};
// hook teaser beats
const H_TITLE_OUT = 380, H_T1 = 380, H_T3 = 760, H_END = HOOK;
const CALLS = ['CPV', 'CUW', 'JOR', 'UZB'];
const callAt = (i: number) => 70 + i * 60;
const CLOSED = 330;
// hook: Spain's dating-app profile and six swipes
type Sw = {k: string; v: 'LIKE' | 'NOPE' | 'BLOQ' | 'MAYBE'; say: string};
const SWIPES: Sw[] = [
	{k: 'AND', v: 'LIKE', say: 'Mi equipo juega en tu liga'},
	{k: 'ITA', v: 'NOPE', say: 'Aún me acuerdo de 1994...'},
	{k: 'SAU', v: 'LIKE', say: 'Te traigo la Supercopa'},
	{k: 'NLD', v: 'NOPE', say: 'Lo de 2010 no se olvida'},
	{k: 'GIB', v: 'BLOQ', say: 'La UEFA no nos deja vernos'},
	{k: 'ARG', v: 'MAYBE', say: 'Te di a Messi... y me ganaste'},
];
const SW0 = H_T1 + 10, SWD = 112;
const swAt = (i: number) => SW0 + i * SWD;
const SW_COL: Record<Sw['v'], string> = {LIKE: '#FF4FA0', NOPE: '#E63946', BLOQ: '#1B1D26', MAYBE: '#F2B33D'};
const SW_TXT: Record<Sw['v'], string> = {LIKE: 'LIKE', NOPE: 'NOPE', BLOQ: 'BLOQUEADA', MAYBE: '¿MATCH?'};
const KEYS_CAM: Key[] = (() => {
	const k: Key[] = [];
	const add = (f: number, c: WCam) => k.push([f, c.x, c.y, c.z]);
	add(0, {x: 1500, y: 820, z: 0.52}); add(H_T1 - 20, {x: 1500, y: 820, z: 0.56});
	const ve = fitBox(['VEN', 'COL', 'BOL'], 820, 560, 560, 520); add(H_T1 + 30, ve); add(H_T3 - 20, {...ve, z: ve.z * 1.05});
	add(H_T3 + 40, {...WORLD_CAM, x: 1950, z: 0.5}); add(H_END, {...WORLD_CAM, x: 1950, z: 0.53});
	const sa = fitBox(['UZB', 'KAZ']); add(HOOK + LEG - 40, sa);
	for (const s of SEGS) {
		const c = s.kind === 'focus' ? fitBox([s.e.k], 1010, 450, 700, 480, 110) : s.kind === 'cta' ? {x: 1950, y: 760, z: 0.6} : fitBox(s.e.keys, 1010, 430, 760, 440, 200);
		add(s.from + 60, c); add(s.from + s.dur - 10, {...c, z: c.z * 1.05});
	}
	add(FIN0 + 70, {x: 1880, y: 860, z: 0.5}); add(V20_TOTAL, {x: 1880, y: 860, z: 0.53});
	k.sort((a, b) => a[0] - b[0]);
	return k;
})();

// ---------------------------------------------------------------- sfx / music
export const v20Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f: Math.round(f), name, vol});
	// waiting-room hook
	S(0, 'whoosh_4', 0.45); S(10, 'slap', 0.45); S(20, 'pop_1', 0.4);
	CALLS.forEach((_, i) => { S(callAt(i), 'confirm', 0.4); S(callAt(i) + 2, 'pop_2', 0.35); S(callAt(i) + 20, 'pop_3', 0.3); });
	S(CLOSED, 'glass', 0.45); S(CLOSED + 10, 'slap', 0.5); S(CLOSED + 12, 'crowd_ohh', 0.3);
	S(H_T1, 'whoosh_2', 0.5); S(H_T1 + 10, 'slap', 0.4); S(H_T1 + 50, 'whoosh_1', 0.4); S(H_T1 + 52, 'kick', 0.4);
	for (let k = 0; k < 6; k++) S(H_T1 + 60 + k * 12, 'kick', 0.25);
	S(H_T1 + 150, 'pop_4', 0.4); S(H_T1 + 230, 'boom', 0.5); S(H_T1 + 232, 'crowd_ohh', 0.35);
	S(H_T3, 'whoosh_1', 0.5); S(H_T3 + 16, 'slap', 0.45);
	for (let k = 0; k < 40; k++) S(H_T3 + 40 + k * 5, `pop_${(k % 4) + 1}`, 0.12);
	S(H_T3 + 250, 'boom', 0.55); S(H_T3 + 300, 'drumroll', 0.3);
	S(HOOK - 10, 'whoosh_4', 0.45); S(HOOK + 10, 'whistle_long', 0.35);
	S(HOOK + 40, 'slap', 0.45); CATS.forEach((_, i) => { S(HOOK + 90 + i * 40, `pop_${i + 1}`, 0.45); }); S(HOOK + 330, 'confirm', 0.35); S(HOOK + LEG - 30, 'whoosh_2', 0.4);
	let lastRegion = '';
	for (const sg of SEGS) {
		const f0 = sg.from;
		if (sg.e.region !== lastRegion) { S(f0 + 4, 'slap', 0.4); lastRegion = sg.e.region; }
		if (sg.kind === 'group') {
			S(f0, `whoosh_${(sg.i % 4) + 1}`, 0.45); S(f0 + 40, 'pop_1', 0.35); S(f0 + 90, 'slap', 0.35);
			sg.e.keys.forEach((k, j) => { const g = f0 + G0 + j * GSTEP; S(g, `pop_${(j % 4) + 1}`, 0.42); S(g + 16, OPP[k].cat === 'SIN' ? 'glitch' : 'glass', 0.18); });
			S(f0 + G0 + GSTEP * sg.e.keys.length + 30, 'pop_3', 0.4); S(f0 + G0 + GSTEP * sg.e.keys.length + 34, 'click', 0.3);
			S(f0 + sg.dur - 16, 'whoosh_1', 0.3);
			continue;
		}
		if (sg.kind === 'cta') { S(f0, 'whoosh_3', 0.45); S(f0 + 20, 'pop_1', 0.45); S(f0 + 60, 'pop_2', 0.4); S(f0 + 150, 'pop_3', 0.4); S(f0 + 210, 'click', 0.5); S(f0 + 212, 'bong', 0.35); S(f0 + CTA - 16, 'whoosh_1', 0.35); continue; }
		const cat = OPP[sg.e.k].cat;
		S(f0, `whoosh_${(sg.i % 4) + 1}`, 0.45); S(f0 + P_PIN, 'pop_1', 0.4); S(f0 + P_LINE, 'riser', 0.15);
		S(f0 + P_CARD, 'slap', 0.35); for (let k = 0; k < 8; k++) S(f0 + 130 + k * 9, 'tick', 0.12);
		S(f0 + P_B1, 'pop_2', 0.45); S(f0 + P_B1 + 4, 'click', 0.3); S(f0 + P_B2, 'pop_3', 0.45); S(f0 + P_B2 + 4, 'click', 0.3);
		S(f0 + P_REV - 50, 'drumroll', 0.3);
		S(f0 + P_REV, 'boom', 0.55); S(f0 + P_REV + 4, cat === 'SIN' ? 'glitch' : 'glass', 0.35); S(f0 + P_REV + 6, cat === 'PAN' || cat === 'MIE' ? 'crowd_roar' : 'crowd_ohh', 0.35);
		S(f0 + P_FEED, 'confirm', 0.3); S(f0 + FOC - 16, 'whoosh_1', 0.3);
	}
	for (const c of CTA_OV) { S(c, 'pop_1', 0.35); S(c + 120, 'click', 0.4); S(c + 122, 'bong', 0.25); }
	S(FIN0, 'whoosh_4', 0.5); S(FIN0 + 30, 'boom', 0.55); S(FIN0 + 34, 'crowd_roar', 0.45);
	CATS.forEach((_, i) => { S(FIN0 + 90 + i * 30, `pop_${i + 1}`, 0.45); for (let k = 0; k < 6; k++) S(FIN0 + 92 + i * 30 + k * 5, 'tick', 0.12); });
	CATS.forEach((_, i) => S(FIN0 + 330 + i * 110, 'slap', 0.4));
	S(FIN0 + 1080, 'pop_2', 0.45); S(FIN0 + 1084, 'click', 0.3);
	S(OUT0, 'whoosh_2', 0.45); S(OUT0 + 20, 'pop_1', 0.45); S(OUT0 + 80, 'pop_3', 0.4); S(OUT0 + 230, 'pop_4', 0.4); S(OUT0 + 290, 'click', 0.5); S(OUT0 + 292, 'bong', 0.35);
	s.sort((a, b) => a.f - b.f);
	return s;
};
export const v20Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	const pq = SEGS.find((x) => x.e.region === 'LOS QUE SE QUEDARON CERCA')!.from;
	return [`m_happy:0:${sec(HOOK + 30)}`, `m_happy:${sec(HOOK)}:${sec(pq + 40)}`, `m_tense:${sec(pq)}:${sec(FIN0 + 40)}`, `m_triumph:${sec(FIN0)}:${sec(V20_TOTAL)}`].join(',');
};

// ---------------------------------------------------------------- small UI
const T: React.FC<{children: React.ReactNode; size: number; color?: string; stroke?: number; shadow?: number; style?: React.CSSProperties}> = ({children, size, color = '#fff', stroke, shadow, style}) => (
	<span style={{fontFamily: LILITA, fontSize: size, color, lineHeight: 1, whiteSpace: 'nowrap', WebkitTextStroke: `${stroke ?? size * 0.12}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${shadow ?? size * 0.07}px 0 ${INK}`, ...style}}>{children}</span>
);
const Flag: React.FC<{f: string; w: number; style?: React.CSSProperties}> = ({f, w, style}) => <img src={staticFile(`flags/${f}.svg`)} style={{width: w, height: w * 0.66, borderRadius: Math.max(3, w * 0.12), border: `${w > 50 ? 3 : 2}px solid ${INK}`, objectFit: 'cover', flexShrink: 0, ...style}} />;
const up = (s: string) => s.toUpperCase();
const nm = (k: string) => NAME[k] ?? k;
const MiniFace: React.FC<{mood: FaceMood; s: number; bg?: string}> = ({mood, s, bg}) => (
	<svg width={s} height={s} viewBox="0 0 200 200" style={{flexShrink: 0}}>{bg && <circle cx={100} cy={100} r={96} fill={bg} stroke={INK} strokeWidth={8} />}<g transform={bg ? 'translate(18 14) scale(0.82)' : undefined}><Face12 mood={mood} noBlush /></g></svg>
);
const catMood = (c: Cat): FaceMood => (c === 'PAN' ? 'sad' : c === 'MIE' ? 'worried' : c === 'RES' ? 'neutral' : 'happy');

// dot-matrix digits (5x7)
const DM: Record<string, string[]> = {
	'0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'], '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
	'2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'], '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
	'4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'], '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
	'6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'], '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
	'8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'], '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
};
const DotNum: React.FC<{v: number; col: string; d?: number; flash?: number}> = ({v, col, d = 7, flash = 0}) => {
	const s = String(v).padStart(2, '0');
	return (
		<svg width={(5 * 2 + 1) * d + 6} height={7 * d + 2}>
			{s.split('').map((ch, ci) => DM[ch].map((row, r) => row.split('').map((b, c) => (
				<circle key={`${ci}-${r}-${c}`} cx={3 + (ci * 6 + c) * d + d / 2} cy={1 + r * d + d / 2} r={d * 0.36} fill={b === '1' ? col : 'rgba(255,255,255,0.07)'} opacity={b === '1' ? 0.75 + 0.25 * flash : 1} />
			))))}
		</svg>
	);
};

// ---------------------------------------------------------------- state helpers
const revealedBy = (f: number) => REV.filter((r) => f >= r.f);
const TOT = Object.keys(OPP).length;
const countsAll = () => { const c: Record<Cat, number> = {PAN: 0, MIE: 0, RES: 0, SIN: 0}; for (const k in OPP) c[OPP[k].cat]++; return c; };
const countsAt = (f: number) => {
	const c: Record<Cat, number> = {PAN: 0, MIE: 0, RES: 0, SIN: 0};
	for (const r of revealedBy(f)) c[OPP[r.k].cat]++;
	return c;
};

// ---------------------------------------------------------------- HERO (Spain)
const HB = (() => { const b = WORLD[HERO].b; return {x0: b[0][0], y0: b[0][1], x1: b[1][0], y1: b[1][1]}; })();
const HERO_LEFT = 40;
const HS = Math.min(470 / (HB.x1 - HB.x0), 560 / (HB.y1 - HB.y0));
const HERO_W = (HB.x1 - HB.x0) * HS, HERO_H = (HB.y1 - HB.y0) * HS;
const HERO_TOP = 150 + (420 - HERO_H) / 2;
const FACE_X = HERO_W * 0.5, FACE_Y = HERO_H * 0.46;
export const heroEye = (): [number, number] => [HERO_LEFT + FACE_X + 95, HERO_TOP + FACE_Y - 10];
const Hero: React.FC<{f: number; mood: FaceMood; look: [number, number]; pop: number; glow?: string; talk?: number}> = ({f, mood, look, pop, glow, talk = 0}) => {
	const bob = Math.sin(f / 22) * 4;
	const sq = 1 + Math.sin(f / 22) * 0.008;
	const blink = (() => { const ph = (f + 37) % 210; return ph < 8 ? Math.sin((ph / 8) * Math.PI) : 0; })();
	return (
		<div style={{position: 'absolute', left: HERO_LEFT - 40, top: HERO_TOP - 40, width: HERO_W + 80, height: HERO_H + 80, transform: `translateY(${bob}px) scale(${pop}, ${pop * sq})`, transformOrigin: '50% 90%'}}>
			{glow && <div style={{position: 'absolute', left: -40, top: -20, width: HERO_W + 160, height: HERO_H + 120, borderRadius: '45%', background: `radial-gradient(ellipse at 50% 45%, ${glow} 0%, rgba(0,0,0,0) 65%)`, opacity: 0.7}} />}
			<svg width={HERO_W + 80} height={HERO_H + 80} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				<defs>
					<clipPath id="heroClip"><path d={WORLD[HERO].d} /></clipPath>
					<clipPath id="heroBox"><rect x={HB.x0 - 4} y={HB.y0 - 6} width={HB.x1 - HB.x0 + 36} height={HB.y1 - HB.y0 + 10} /></clipPath>
				</defs>
				<g transform={`translate(40 40) scale(${HS}) translate(${-HB.x0} ${-HB.y0})`} clipPath="url(#heroBox)">
					<path d={WORLD[HERO].d} fill="#06142A" opacity={0.35} transform={`translate(${5 / HS} ${9 / HS})`} />
					<path d={WORLD[HERO].d} fill="none" stroke="#fff" strokeWidth={13 / HS} strokeLinejoin="round" />
					<g clipPath="url(#heroClip)">
						<image href={staticFile('flags/ve.svg')} x={HB.x0 - 2} y={HB.y0 - 2} width={HB.x1 - HB.x0 + 40} height={HB.y1 - HB.y0 + 4} preserveAspectRatio="none" />
						<image href={staticFile('tex/relief.jpg')} x={0} y={20} width={3830} height={1720} preserveAspectRatio="none" style={{mixBlendMode: 'multiply'}} />
					</g>
					<path d={WORLD[HERO].d} fill="none" stroke={INK} strokeWidth={4.5 / HS} strokeLinejoin="round" />
				</g>
			</svg>
			<svg width={280} height={280} viewBox="0 0 200 200" style={{position: 'absolute', left: 40 + FACE_X - 140, top: 40 + FACE_Y - 140, overflow: 'visible'}}>
				<Face12 mood={mood} look={look} blink={blink} talk={talk} />
			</svg>
			<div style={{position: 'absolute', left: 40 + FACE_X - 80, top: HERO_H + 40 + 6, width: 160, display: 'flex', justifyContent: 'center'}}>
				<div style={{padding: '4px 14px', borderRadius: 10, background: '#fff', border: `4px solid ${INK}`, fontFamily: LILITA, fontSize: 26, color: INK}}>VENEZUELA</div>
			</div>
		</div>
	);
};

// ---------------------------------------------------------------- HUD
const RegionPill: React.FC<{text: string; p: number}> = ({text, p}) => (
	<div style={{position: 'absolute', left: 22, top: 20, transform: `translateX(${(1 - p) * -400}px)`, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 20px 8px 14px', borderRadius: 16, background: '#1B1D26', border: '3px solid #2E3140', boxShadow: '0 5px 0 rgba(0,0,0,0.35)'}}>
		<svg width={22} height={28} viewBox="0 0 22 28"><path d="M11 27 C11 27 2 16 2 10 A9 9 0 0 1 20 10 C20 16 11 27 11 27Z" fill="#FFB020" /><circle cx={11} cy={10} r={3.5} fill="#1B1D26" /></svg>
		<span style={{fontFamily: LILITA, fontSize: 30, color: '#fff', letterSpacing: 1}}>{text}</span>
	</div>
);
const TugBar: React.FC<{f: number; p: number}> = ({f, p}) => {
	const c = countsAt(f);
	const fear = c.PAN + c.MIE, nof = c.RES;
	const tot = Math.max(1, fear + nof);
	const pos = fear + nof === 0 ? 0.5 : fear / tot;
	return (
		<div style={{position: 'absolute', left: 520, top: 18, width: 880, height: 60, transform: `translateY(${(1 - p) * -120}px)`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', boxSizing: 'border-box', borderRadius: 30, background: CREAM, border: `4px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)'}}>
			<MiniFace mood="sad" s={38} bg={CAT_COL.PAN} />
			<span style={{fontFamily: LILITA, fontSize: 26, color: CAT_DARK.PAN}}>ROZARON EL MUNDIAL</span>
			<span style={{fontFamily: LILITA, fontSize: 32, color: INK, width: 40, textAlign: 'center'}}>{fear}</span>
			<div style={{flex: 1, height: 26, borderRadius: 13, background: '#E6DCC6', border: `3px solid ${INK}`, overflow: 'hidden', position: 'relative'}}>
				<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pos * 100}%`, background: `repeating-linear-gradient(-45deg, ${CAT_COL.PAN} 0 10px, #F25C6A 10px 20px)`}} />
				<div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${(1 - pos) * 100}%`, background: `repeating-linear-gradient(-45deg, ${CAT_COL.RES} 0 10px, #B385F0 10px 20px)`}} />
				<div style={{position: 'absolute', left: `calc(${pos * 100}% - 22px)`, top: -2, width: 44, height: 26, borderRadius: 8, background: '#FFB020', border: `3px solid ${INK}`, fontFamily: LILITA, fontSize: 18, color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>VS</div>
			</div>
			<span style={{fontFamily: LILITA, fontSize: 32, color: INK, width: 40, textAlign: 'center'}}>{nof}</span>
			<span style={{fontFamily: LILITA, fontSize: 26, color: CAT_DARK.RES}}>MUY LEJOS</span>
			<MiniFace mood="neutral" s={38} bg={CAT_COL.RES} />
		</div>
	);
};
const LedPanel: React.FC<{f: number; p: number}> = ({f, p}) => {
	const c = countsAt(f);
	const last = revealedBy(f).slice(-1)[0];
	const lastCat = last ? OPP[last.k].cat : null;
	const since = last ? f - last.f : 999;
	return (
		<div style={{position: 'absolute', left: 14, bottom: 42, width: 356, padding: 10, boxSizing: 'border-box', borderRadius: 18, background: CREAM, border: `4px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)', transform: `translateX(${(1 - p) * -460}px)`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
			{CATS.map((k) => {
				const hot = lastCat === k && since < 60;
				return (
					<div key={k} style={{borderRadius: 10, background: '#16181F', border: `3px solid ${hot ? CAT_COL[k] : '#2B2E3A'}`, padding: '6px 6px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${hot ? 1 + 0.08 * Math.max(0, 1 - since / 20) : 1})`}}>
						<DotNum v={c[k]} col={CAT_COL[k]} d={7} flash={hot ? 1 : 0} />
						<div style={{display: 'flex', alignItems: 'center', gap: 5, marginTop: 3}}>
							<MiniFace mood={catMood(k)} s={20} bg={CAT_COL[k]} />
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 13, letterSpacing: 1, color: CAT_COL[k]}}>{CAT_NAME[k]}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
};
const Feed: React.FC<{f: number; p: number}> = ({f, p}) => {
	const rows = revealedBy(f).slice(-5);
	return (
		<div style={{position: 'absolute', right: 14, bottom: 42, width: 440, display: 'flex', flexDirection: 'column', gap: 6, transform: `translateX(${(1 - p) * 520}px)`}}>
			{rows.map((r) => {
				const o = OPP[r.k];
				const u = f - r.f;
				return (
					<div key={r.k} style={{height: 42, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', borderRadius: 12, background: '#1B1D26', border: `3px solid ${CAT_COL[o.cat]}`, boxShadow: '0 4px 0 rgba(0,0,0,0.35)', transform: `translateX(${(1 - easeOut(u / 14)) * 480}px)`}}>
						<MiniFace mood={catMood(o.cat)} s={30} bg={CAT_COL[o.cat]} />
						<Flag f={o.flag} w={40} />
						<span style={{flex: 1, fontFamily: LILITA, fontSize: 24, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{up(nm(r.k))}</span>
						<span style={{padding: '3px 10px', borderRadius: 9, background: CAT_COL[o.cat], border: `2px solid ${INK}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 13, letterSpacing: 1, color: '#fff'}}>{CAT_NAME[o.cat]}</span>
					</div>
				);
			})}
		</div>
	);
};
const Footer: React.FC = () => (
	<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 30, background: 'rgba(14,16,22,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.75)'}}>
		Fuentes: FIFA, UEFA, CAF, AFC y prensa (ver descripción) · 211 federaciones de la FIFA; participantes de todos los Mundiales hasta 2026
	</div>
);

// ---------------------------------------------------------------- focus scene pieces
const Pin: React.FC<{x: number; y: number; text: string; p: number; small?: boolean}> = ({x, y, text, p, small}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) scale(${p})`, transformOrigin: '50% 100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<div style={{padding: small ? '3px 10px' : '5px 14px', borderRadius: 12, background: '#1B1D26', border: '3px solid #fff', fontFamily: LILITA, fontSize: small ? 20 : 26, color: '#fff', whiteSpace: 'nowrap', boxShadow: '0 4px 0 rgba(0,0,0,0.35)'}}>{text}</div>
		<svg width={18} height={10}><path d="M0 0 L9 10 L18 0Z" fill="#fff" /></svg>
	</div>
);
const Bubble: React.FC<{x: number; y: number; text: string; p: number; tail: 'down' | 'left' | 'right'}> = ({x, y, text, p, tail}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(${tail === 'down' ? '-50%' : tail === 'right' ? '-100%' : '0'}, -100%) scale(${p})`, transformOrigin: tail === 'down' ? '50% 100%' : tail === 'right' ? '100% 100%' : '0% 100%'}}>
		<div style={{position: 'relative', padding: '14px 24px', borderRadius: 20, background: '#fff', border: `5px solid ${INK}`, boxShadow: '0 7px 0 rgba(0,0,0,0.3)', fontFamily: LILITA, fontSize: 38, color: INK, whiteSpace: 'nowrap'}}>
			{text}
			<svg width={44} height={30} style={{position: 'absolute', left: tail === 'down' ? 'calc(50% - 22px)' : tail === 'right' ? 'calc(100% - 70px)' : 26, bottom: -27}}><path d="M2 0 L22 26 L42 0" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><rect x={4} y={-6} width={36} height={8} fill="#fff" /></svg>
		</div>
	</div>
);
// connection from hero to target (screen space)
const Connect: React.FC<{a: [number, number]; b: [number, number]; p: number; cat: Cat | null; f: number; thin?: boolean}> = ({a, b, p, cat, f, thin}) => {
	if (p <= 0) return null;
	const [ax, ay] = a, [bx, by] = b;
	const mx = (ax + bx) / 2, my = Math.min(ay, by) - Math.max(80, Math.abs(bx - ax) * 0.22);
	const N = 60;
	const pts: [number, number][] = [];
	for (let i = 0; i <= N * p; i++) { const t = i / N; pts.push([(1 - t) * (1 - t) * ax + 2 * (1 - t) * t * mx + t * t * bx, (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * my + t * t * by]); }
	const col = cat ? CAT_COL[cat] : '#fff';
	let d = '';
	if (cat === 'PAN') {
		// zig-zag lightning
		d = pts.map(([x, y], i) => { if (i === 0 || i === pts.length - 1) return `${i ? 'L' : 'M'}${x} ${y}`; const [px, py] = pts[i - 1]; const nx = -(y - py), ny = x - px; const l = Math.hypot(nx, ny) || 1; const o = (i % 2 ? 1 : -1) * 9; return `L${x + (nx / l) * o} ${y + (ny / l) * o}`; }).join(' ');
	} else d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
	const dash = cat === 'MIE' ? '18 12' : cat === 'RES' ? undefined : !cat ? '4 14' : undefined;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			<path d={d} fill="none" stroke={INK} strokeWidth={thin ? 8 : 12} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash ? dash.split(' ').map((v, i) => (i ? +v - 4 : +v + 4)).join(' ') : undefined} strokeDashoffset={dash ? -f * 1.5 + 2 : undefined} opacity={0.85} />
			<path d={d} fill="none" stroke={col} strokeWidth={thin ? 4 : 6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} strokeDashoffset={dash ? -f * 1.5 : undefined} />
			{cat === 'RES' && <path d={d} fill="none" stroke={CAT_COL.SIN} strokeWidth={6} strokeDasharray="6 10" strokeDashoffset={-f} />}
				{cat === 'SIN' && pts.filter((_, i) => i > 4 && i % 9 === 0).map(([x, y], i) => <path key={i} transform={`translate(${x} ${y - 4 + Math.sin(f / 8 + i) * 4}) scale(1.1)`} d="M0 6 C-12 -4 -6 -14 0 -6 C6 -14 12 -4 0 6Z" fill={CAT_COL.SIN} stroke={INK} strokeWidth={2.5} />)}
		</svg>
	);
};
const InfoCard: React.FC<{s: Extract<Seg, {kind: 'focus'}>; t: number}> = ({s, t}) => {
	const k = s.e.k, o = OPP[k];
	const p = backOut((t - P_CARD) / 16) * (1 - easeInOut((t - FOC + 30) / 20));
	const rev = t >= P_REV;
	const q = easeOut((t - 130) / 60);
	const col = rev ? CAT_COL[o.cat] : '#2E3140';
	return (
		<div style={{position: 'absolute', left: 478, width: 920, bottom: 40, transform: `translateY(${(1 - p) * 330}px)`}}>
			<div style={{position: 'absolute', left: 22, top: -22, padding: '4px 14px', borderRadius: '10px 10px 0 0', background: col, border: `3px solid ${INK}`, borderBottom: 'none', fontFamily: RUBIK, fontWeight: 800, fontSize: 15, letterSpacing: 1.5, color: '#fff'}}>{s.e.tab}</div>
			<div style={{borderRadius: 20, background: CREAM, border: `5px solid ${col}`, boxShadow: `0 0 0 3px ${INK}, 0 8px 0 rgba(0,0,0,0.35)`, padding: '14px 22px 16px'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
					<Flag f={o.flag} w={62} />
					<span style={{fontFamily: LILITA, fontSize: 42, color: INK, flex: 1}}>{up(nm(k))}</span>
					<div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 14, background: rev ? CAT_COL[o.cat] : '#D9CFBA', border: `3px solid ${INK}`, transform: `scale(${rev ? 1 + 0.25 * (1 - easeOut((t - P_REV) / 14)) : 1})`}}>
						{rev && <MiniFace mood={catMood(o.cat)} s={30} bg="#fff" />}
						<span style={{fontFamily: LILITA, fontSize: 26, color: rev ? '#fff' : '#6B6250'}}>{rev ? CAT_NAME[o.cat] : '¿? ¿? ¿?'}</span>
					</div>
				</div>
				<div style={{borderTop: '3px dashed #CDBF9F', margin: '10px 0 8px'}} />
				{o.p === 0 ? <div style={{fontFamily: LILITA, fontSize: 30, color: CAT_DARK.PAN, textAlign: 'center'}}>MEJOR INTENTO: {up(o.best)}</div> : <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, color: '#7A6E57', letterSpacing: 1}}>{o.p} PARTIDOS</span>
					{([['ESPAÑA GANÓ', o.ol, '#3DB86B'], ['EMPATES', o.d, '#8C8471'], ['PERDIÓ', o.ow, CAT_COL.PAN]] as [string, number, string][]).map(([a, v, c]) => (
						<div key={a} style={{display: 'flex', alignItems: 'baseline', gap: 6}}>
							<span style={{fontFamily: LILITA, fontSize: 36, color: c}}>{Math.round(v * q)}</span>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, color: INK}}>{a}</span>
						</div>
					))}
					<div style={{flex: 1, height: 18, borderRadius: 9, overflow: 'hidden', border: `3px solid ${INK}`, display: 'flex', background: '#E6DCC6'}}>
						<div style={{width: `${(o.ol / o.p) * 100 * q}%`, background: '#3DB86B'}} />
						<div style={{width: `${(o.d / o.p) * 100 * q}%`, background: '#B7AE98'}} />
						<div style={{width: `${(o.ow / o.p) * 100 * q}%`, background: CAT_COL.PAN}} />
					</div>
				</div>}
				{(() => {
					const n = s.e.facts.length;
					let i = 0; for (let j = 0; j < n; j++) if (t >= P_F[j]) i = j;
					const u = t - P_F[i];
					const sw = i < n - 1 ? easeInOut((t - P_F[i + 1] + 10) / 10) : 0;
					return (
						<div style={{marginTop: 8, height: 58, display: 'flex', gap: 10, alignItems: 'center', opacity: clamp01((t - P_F[0]) / 12) * (1 - sw), transform: `translateX(${(1 - easeOut(u / 12)) * 40}px)`}}>
							<span style={{flexShrink: 0, padding: '3px 10px', borderRadius: 8, background: '#C46A00', fontFamily: RUBIK, fontWeight: 800, fontSize: 15, color: '#fff', letterSpacing: 1}}>DATO {i + 1}/{n}</span>
							<span style={{fontFamily: RUBIK, fontWeight: 700, fontSize: 23, color: INK, lineHeight: 1.22}}>{s.e.facts[i]}</span>
						</div>
					);
				})()}
			</div>
		</div>
	);
};
const Stamp: React.FC<{text: string; sub?: string; col: string; t: number; x?: number; y?: number; rot?: number}> = ({text, sub, col, t, x = 1010, y = 150, rot = -4}) => {
	const p = t < 12 ? 2.2 - 1.2 * easeOut(t / 12) : 1;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${p})`, opacity: clamp01(t / 5), display: 'flex', alignItems: 'baseline', gap: 14, padding: '10px 28px', borderRadius: 18, background: col, border: `5px solid ${INK}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
			<T size={62}>{text}</T>
			{sub && <span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff', whiteSpace: 'nowrap'}}>{sub}</span>}
		</div>
	);
};

// ---------------------------------------------------------------- main
export const Video20: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS_CAM, f, 12);
	const seg = SEGS.find((s) => f >= s.from && f < s.from + s.dur);
	const t = seg ? f - seg.from : 0;
	const foc = seg?.kind === 'focus' ? seg : null;
	const grp = seg?.kind === 'group' ? seg : null;
	// --- map state
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	const blinkOf = (k: string) => { const ph = (f + k.charCodeAt(0) * 7 + k.charCodeAt(1) * 3) % 240; return ph < 8 ? Math.sin((ph / 8) * Math.PI) : 0; };
	fills[HERO] = {flag: 've'};
	const inGroup = new Set(grp ? grp.e.keys : []);
	for (const r of revealedBy(f)) {
		const o = OPP[r.k];
		if ((foc && r.k === foc.e.k) || inGroup.has(r.k)) continue;
		fills[r.k] = {color: CAT_COL[o.cat]};
		faces[r.k] = {mood: catMood(o.cat), size: 0.7, max: 62, blink: blinkOf(r.k), pop: f >= FIN0 ? 1 : elastic((f - r.f) / FPS)};
	}
	// hook fills
	if (f < HOOK + 20) {
		if (f < H_T1 + 10) CALLS.forEach((k, i) => { const u = f - callAt(i); if (u >= 0 && WORLD[k]) { fills[k] = {color: CAT_COL.SIN, lift: 0.8, pop: elastic(u / FPS)}; faces[k] = {mood: 'happy', size: 1, max: 80, pop: elastic((u - 4) / FPS), blink: blinkOf(k)}; } });
		else if (f < H_T3 + 10) {
			fills.COL = {flag: 'co', lift: easeOut((f - H_T1 - 50) / 20)}; faces.COL = {mood: 'happy', size: 1.1, max: 120, pop: elastic((f - H_T1 - 60) / FPS), blink: blinkOf('COL')};
			if (f >= H_T1 + 150) { fills.BOL = {flag: 'bo', lift: 0.8, pop: elastic((f - H_T1 - 150) / FPS)}; faces.BOL = {mood: 'smug', size: 1.1, max: 120, pop: elastic((f - H_T1 - 156) / FPS), blink: blinkOf('BOL')}; }
		} else NEVER.forEach((k, i) => { const u = f - H_T3 - 40 - (i / NEVER.length) * 200; if (u >= 0 && WORLD[k]) { fills[k] = {color: '#8E8676', lift: 0.3, pop: elastic(u / FPS)}; if (WORLD[k].b[1][0] - WORLD[k].b[0][0] > 40) faces[k] = {mood: 'sad', size: 0.9, max: 50, pop: elastic((u - 4) / FPS), blink: blinkOf(k)}; } });
	}
	let heroMood: FaceMood = 'smug';
	let heroLook: [number, number] = [0.6, -0.1];
	let heroGlow: string | undefined;
	let heroTalk = 0;
	if (foc) {
		const k = foc.e.k, o = OPP[k];
		const rev = t >= P_REV;
		const lift = easeOut((t - 10) / 30);
		fills[k] = rev ? {color: CAT_COL[o.cat], lift: 1 - 0.3 * easeOut((t - P_REV) / 20), pop: 1 + 0.06 * Math.sin(clamp01((t - P_REV) / 20) * Math.PI)} : {flag: o.flag, lift, pop: elastic((t - 10) / FPS)};
		const speaking = t >= P_B1 && t < P_B2;
		const oMood: FaceMood = rev ? catMood(o.cat) : speaking ? (o.cat === 'SIN' ? 'happy' : 'neutral') : t >= P_B2 && t < P_REV ? (o.cat === 'SIN' ? 'smug' : o.cat === 'PAN' ? 'sad' : 'worried') : 'neutral';
		faces[k] = {mood: oMood, size: 1.5, pop: elastic((t - 24) / FPS), blink: blinkOf(k), talk: speaking ? Math.abs(Math.sin(t / 3.2)) : 0, look: [-0.7, -0.15]};
		heroLook = [0.9, -0.2];
		if (t >= P_B1 && t < P_B2) heroMood = 'neutral';
		if (t >= P_B2 && t < P_REV) { heroMood = o.cat === 'SIN' ? 'happy' : 'worried'; heroTalk = Math.abs(Math.sin(t / 3.2)); }
		if (rev) { heroMood = o.cat === 'SIN' ? 'shock' : o.cat === 'RES' ? 'cool' : o.cat === 'MIE' ? 'worried' : 'sad'; heroGlow = o.cat === 'SIN' ? 'rgba(61,184,107,0.75)' : o.cat === 'RES' ? 'rgba(155,93,229,0.8)' : o.cat === 'MIE' ? 'rgba(255,138,61,0.8)' : 'rgba(230,57,70,0.8)'; }
	} else if (grp) {
		grp.e.keys.forEach((k, j) => {
			const g = G0 + j * GSTEP; const o = OPP[k];
			if (t < g) return;
			const on = t >= g + 16;
			fills[k] = on ? {color: CAT_COL[o.cat], lift: 0.7, pop: elastic((t - g) / FPS)} : {flag: o.flag, lift: 0.7, pop: elastic((t - g) / FPS)};
			faces[k] = {mood: on ? catMood(o.cat) : 'neutral', size: 1.15, max: 150, pop: elastic((t - g - 6) / FPS), blink: blinkOf(k), look: [-0.6, -0.1]};
		});
		const end = G0 + GSTEP * grp.e.keys.length;
		const cats = grp.e.keys.map((k) => OPP[k].cat);
		const anySin = cats.some((c) => c !== 'SIN');
		heroLook = [0.9, -0.1];
		heroMood = t >= end + 30 ? (anySin ? 'worried' : 'happy') : 'smug';
		if (t >= end + 30 && t < grp.dur - 30) heroTalk = Math.abs(Math.sin(t / 3.2));
		if (t >= end) heroGlow = anySin ? 'rgba(155,93,229,0.6)' : 'rgba(255,214,90,0.7)';
	} else if (f < H_T1) { heroMood = f >= CLOSED ? 'sad' : 'worried'; heroLook = [0.9, -0.3]; }
	else if (f >= H_T1 && f < H_T3) { heroMood = f >= H_T1 + 230 ? 'sad' : 'worried'; heroLook = [0.9, 0.1]; if (f >= H_T1 + 230) heroGlow = 'rgba(232,57,74,0.6)'; }
	else if (f >= H_T3 && f < HOOK) { heroMood = 'shock'; heroLook = [0.9, -0.2]; }
	else if (seg?.kind === 'cta') { heroMood = 'happy'; heroGlow = 'rgba(255,214,90,0.8)'; heroLook = [0.6, 0]; if (t >= 40 && t < 260) heroTalk = Math.abs(Math.sin(t / 3.2)); }
	else if (f >= FIN0) { heroMood = 'happy'; heroGlow = 'rgba(255,214,90,0.8)'; heroLook = [0.6, 0]; if (f >= FIN0 + 1080 && f < FIN0 + 1440) heroTalk = Math.abs(Math.sin(f / 3.2)); }
	const heroPop = f < 40 ? elastic((f - 6) / FPS) : 1;
	const hud = f >= HOOK + LEG - 40 && f < FIN0 + 20 ? easeOut((f - HOOK - LEG + 40) / 24) * (1 - easeInOut((f - FIN0) / 20)) : 0;
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			<FlagPreload flags={ALL_FLAGS} />
			<Atlas cam={cam} fills={fills} faces={faces} dark={f < H_T3 ? 0.18 : f < HOOK ? 0.1 : f < HOOK + LEG - 20 && f >= HOOK - 20 ? 0.35 * Math.sin(clamp01((f - HOOK + 20) / (LEG + 20)) * Math.PI) * 1.2 : 0} />
			{foc && (() => {
				const k = foc.e.k, o = OPP[k];
				const [sx, sy] = toScreen(cam, ...WORLD[k].c);
				const lp = easeInOut((t - P_LINE) / 40) * (1 - easeInOut((t - FOC + 30) / 16));
				const bb = bboxOf(k);
				const topY = 540 + (bb.y0 - cam.y) * cam.z;
				const b1 = foc.e.lines[0], b2 = foc.e.lines[1];
				return (
					<>
						<Connect a={heroEye()} b={[sx, sy - 10]} p={lp} cat={t >= P_REV ? o.cat : null} f={f} />
						<Pin x={sx} y={Math.max(120, topY - 6)} text={up(nm(k))} p={backOut((t - P_PIN) / 12) * (1 - easeInOut((t - FOC + 26) / 14))} />
						{t >= P_B1 && t < P_B2 + 6 && (() => { const r = Math.min(110, Math.max(50, (bb.x1 - bb.x0) * cam.z * 0.3)); const right = sx + r + b1.text.length * 19 + 60 < 1890; return <Bubble x={right ? sx + r * 0.6 : sx - r * 0.6} y={sy - r * 0.15} text={b1.text} p={backOut((t - P_B1) / 12) * (1 - easeInOut((t - P_B2) / 6))} tail={right ? 'left' : 'right'} />; })()}
						{t >= P_B2 && t < P_REV + 6 && <Bubble x={heroEye()[0] + 70} y={heroEye()[1] - 70} text={b2.text} p={backOut((t - P_B2) / 12) * (1 - easeInOut((t - P_REV) / 6))} tail="left" />}
						{t >= P_REV && t < FOC - 20 && <Stamp text={CAT_STAMP[o.cat]} sub={o.best} col={CAT_COL[o.cat]} t={t - P_REV} />}
						<InfoCard s={foc} t={t} />
					</>
				);
			})()}
			{grp && <GroupScene g={grp} t={t} f={f} cam={cam} />}
			{seg?.kind === 'cta' && <CtaScene g={seg} t={t} />}
			<Hero f={f} mood={heroMood} look={heroLook} pop={heroPop} glow={heroGlow} talk={heroTalk} />
			{grp && (() => {
				const end = G0 + GSTEP * grp.e.keys.length + 30;
				return t >= end && t < grp.dur - 24 ? <Bubble x={heroEye()[0] + 70} y={heroEye()[1] - 70} text={grp.e.say} p={backOut((t - end) / 12) * (1 - easeInOut((t - grp.dur + 34) / 8))} tail="left" /> : null;
			})()}
			{f < HOOK + 20 && <Hook f={f} />}
			{f >= HOOK - 10 && f < HOOK + LEG + 10 && <Legend t={f - HOOK} />}
			{hud > 0 && (
				<>
					<RegionPill text={seg ? seg.e.region : 'SUDAMÉRICA'} p={hud} />
					<TugBar f={f} p={hud} />
					<LedPanel f={f} p={hud} />
					<Feed f={f} p={hud} />
				</>
			)}
			{CTA_OV.map((c) => (f >= c && f < c + 280 ? <CtaBanner key={c} u={f - c} /> : null))}
			{seg?.kind === 'cta' && t >= 40 && t < CTA - 30 && <Bubble x={heroEye()[0] + 70} y={heroEye()[1] - 70} text="¡Ayúdame a llegar a más gente!" p={backOut((t - 40) / 12) * (1 - easeInOut((t - CTA + 40) / 8))} tail="left" />}
			{f >= FIN0 && f < OUT0 + 20 && <Finale t={f - FIN0} f={f} />}
			{f >= OUT0 && <Outro t={f - OUT0} f={f} />}
			<Footer />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- GROUP
const GroupScene: React.FC<{g: Extract<Seg, {kind: 'group'}>; t: number; f: number; cam: WCam}> = ({g, t, f, cam}) => {
	const n = g.e.keys.length;
	const out = easeInOut((t - g.dur + 30) / 20);
	const p = backOut((t - 60) / 16) * (1 - out);
	const W = Math.min(920, 200 + n * 130);
	return (
		<>
			{g.e.keys.map((k, j) => {
				const gt = G0 + j * GSTEP;
				if (t < gt) return null;
				const [sx, sy] = toScreen(cam, ...WORLD[k].c);
				const on = t >= gt + 16;
				return <Connect key={'c' + k} a={heroEye()} b={[sx, sy]} p={easeInOut((t - gt) / 18) * (1 - out)} cat={on ? OPP[k].cat : null} f={f} thin />;
			})}
			{g.e.keys.map((k, j) => {
				const gt = G0 + j * GSTEP;
				if (t < gt) return null;
				const [sx, sy] = toScreen(cam, ...WORLD[k].c);
				const bb = bboxOf(k);
				const topY = 540 + (bb.y0 - cam.y) * cam.z;
				const r = Math.min(70, Math.max(26, Math.min(bb.x1 - bb.x0, bb.y1 - bb.y0) * cam.z * 0.4));
				return <Pin key={'p' + k} x={sx} y={Math.max(110, Math.min(sy - r - 4, topY - 4))} text={up(nm(k))} p={backOut((t - gt - 4) / 10) * (1 - easeInOut((t - gt - 110) / 12))} small />;
			})}
			<div style={{position: 'absolute', left: 478 + (920 - W) / 2, width: W, bottom: 40, transform: `translateY(${(1 - p) * 330}px)`}}>
				<div style={{borderRadius: 20, background: CREAM, border: `5px solid ${INK}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)', padding: '12px 18px 14px'}}>
					<div style={{display: 'flex', justifyContent: 'center'}}><T size={38} color={INK} stroke={0} shadow={0}>{g.e.title}</T></div>
					<div style={{textAlign: 'center', fontFamily: RUBIK, fontWeight: 800, fontSize: 13, letterSpacing: 1, marginTop: 2}}>NUNCA HAN IDO A UN MUNDIAL</div>
					<div style={{borderTop: '3px dashed #CDBF9F', margin: '8px 0 10px'}} />
					<div style={{display: 'flex', justifyContent: 'center', gap: 10}}>
						{g.e.keys.map((k, j) => {
							const gt = G0 + j * GSTEP; const o = OPP[k];
							const on = t >= gt + 16;
							return (
								<div key={k} style={{width: 124, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: t >= gt ? 1 : 0.35, transform: `scale(${t >= gt ? 1 + 0.15 * (1 - easeOut((t - gt) / 12)) : 1})`}}>
									<Flag f={o.flag} w={58} />
									<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 14, color: INK, whiteSpace: 'nowrap', maxWidth: 124, overflow: 'hidden', textOverflow: 'ellipsis'}}>{nm(k)}</span>
									<span style={{padding: '2px 8px', borderRadius: 8, background: on ? CAT_COL[o.cat] : '#D9CFBA', border: `2px solid ${INK}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 12, color: on ? '#fff' : '#6B6250', whiteSpace: 'nowrap', transform: `scale(${on ? backOut((t - gt - 16) / 8) : 1})`}}>{on ? CAT_NAME[o.cat] : '¿?'}</span>
									<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 12, color: '#7A6E57', opacity: on ? 1 : 0}}>NUNCA</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};

// ---------------------------------------------------------------- FINALE
const Finale: React.FC<{t: number; f: number}> = ({t, f}) => {
	const c = countsAll();
	const out = easeInOut((t - FIN + 30) / 24);
	const byCat = (k: Cat) => Object.keys(OPP).filter((x) => OPP[x].cat === k);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<div style={{position: 'absolute', left: 420, right: 20, top: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
				<div style={{transform: `scale(${backOut((t - 30) / 14)})`}}><T size={60}>{NEVER.length} SELECCIONES NUNCA HAN IDO A UN MUNDIAL</T></div>
				<div style={{transform: `scale(${backOut((t - 50) / 14)})`}}><T size={34} color="#FFD23F">LA QUE MÁS CERCA ESTUVO: BURKINA FASO (3-3 EN 2013)</T></div>
			</div>
			<div style={{position: 'absolute', left: 470, width: 1420, top: 168, display: 'flex', justifyContent: 'center', gap: 16, transform: `translateY(${(1 - backOut((t - 70) / 16)) * -400}px)`}}>
				{CATS.map((k, i) => (
					<div key={k} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 16, background: '#16181F', border: `4px solid ${CAT_COL[k]}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)'}}>
						<DotNum v={Math.round(c[k] * easeOut((t - 90 - i * 30) / 40))} col={CAT_COL[k]} d={9} flash={t - 90 - i * 30 < 50 ? 1 : 0} />
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}><MiniFace mood={catMood(k)} s={42} bg={CAT_COL[k]} /><span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 14, color: CAT_COL[k]}}>{CAT_NAME[k]}</span></div>
					</div>
				))}
			</div>
			<div style={{position: 'absolute', left: 470, width: 1420, top: 300, transform: `scale(${backOut((t - 300) / 16)})`, borderRadius: 24, background: CREAM, border: `5px solid ${INK}`, boxShadow: '0 10px 0 rgba(0,0,0,0.35)', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10}}>
				{(['SIN', 'RES', 'MIE', 'PAN'] as Cat[]).map((k, i) => {
					const ks = byCat(k);
					const w = 78;
					const st = 330 + i * 110;
					return (
						<div key={k} style={{opacity: clamp01((t - st) / 10)}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6}}>
								<MiniFace mood={catMood(k)} s={34} bg={CAT_COL[k]} />
								<span style={{fontFamily: LILITA, fontSize: 30, color: CAT_DARK[k]}}>{CAT_NAME[k]}</span>
								<span style={{padding: '1px 10px', borderRadius: 8, background: CAT_COL[k], border: `2px solid ${INK}`, fontFamily: LILITA, fontSize: 22, color: '#fff'}}>{ks.length}</span>
								<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 17, color: '#7A6E57'}}>{CAT_RULE[k]}</span>
							</div>
							<div style={{display: 'flex', flexWrap: 'wrap', gap: 5}}>
								{ks.map((x, j) => <div key={x} style={{transform: `scale(${backOut((t - st - 6 - j * (k === 'SIN' ? 2 : 4)) / 8)})`}}><Flag f={OPP[x].flag} w={w} /></div>)}
							</div>
						</div>
					);
				})}
			</div>
			{t >= 1080 && t < 1440 && <Bubble x={heroEye()[0] - 40} y={1000} text="¡En 2030 me toca a mí!" p={backOut((t - 1080) / 12) * (1 - easeInOut((t - 1430) / 8))} tail="left" />}
			{void f}
		</AbsoluteFill>
	);
};
const Outro: React.FC<{t: number; f: number}> = ({t, f}) => (
	<AbsoluteFill>
		<div style={{position: 'absolute', left: 420, right: 20, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
			<div style={{transform: `scale(${backOut((t - 20) / 14)})`, display: 'flex', alignItems: 'center', gap: 16, padding: '18px 34px', borderRadius: 24, background: 'linear-gradient(90deg, #E8394A, #9B5DE5)', border: `5px solid ${INK}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
				<T size={56}>¿Qué selección quieres en el próximo vídeo?</T>
			</div>
			<div style={{transform: `scale(${backOut((t - 80) / 12)})`, padding: '8px 20px', borderRadius: 14, background: '#fff', border: `4px solid ${INK}`, fontFamily: LILITA, fontSize: 34, color: INK}}>Déjalo en los comentarios ↓</div>
			<div style={{marginTop: 20}}><Subscribe f={t} start={230} /></div>
		</div>
		{t >= OUTRO - 40 && <AbsoluteFill style={{background: '#000', opacity: clamp01((t - OUTRO + 40) / 40)}} />}
		{void f}
	</AbsoluteFill>
);

// ---------------------------------------------------------------- HOOK (the World Cup waiting room -> Venezuela's last day -> 128 still waiting)
const Ticket: React.FC<{x: number; y: number; rot: number; txt: string; sub: string}> = ({x, y, rot, txt, sub}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, width: 250, padding: '10px 14px', background: '#FFF7E0', border: `4px solid ${INK}`, borderRadius: 10, boxShadow: '0 6px 0 rgba(0,0,0,0.35)', textAlign: 'center'}}>
		<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 14, letterSpacing: 2, color: '#7A6E57'}}>SU TURNO</div>
		<div style={{fontFamily: LILITA, fontSize: 52, color: INK, lineHeight: 1}}>{txt}</div>
		<div style={{fontFamily: RUBIK, fontWeight: 700, fontSize: 15, color: '#A61E2D'}}>{sub}</div>
	</div>
);
const Hook: React.FC<{f: number}> = ({f}) => {
	const out = easeInOut((f - H_END + 14) / 14);
	const called = CALLS.filter((_, i) => f >= callAt(i)).length;
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			{/* ---------- A: the waiting room */}
			{f < H_T1 + 8 && (() => {
				const o = 1 - easeInOut((f - H_T1 + 10) / 12);
				const closed = f >= CLOSED;
				const k = called ? CALLS[called - 1] : '';
				const u = called ? f - callAt(called - 1) : 0;
				return (
					<AbsoluteFill style={{opacity: o}}>
						<div style={{position: 'absolute', left: 540, right: 40, top: 30, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((f - 6) / 12)}) rotate(-2deg)`}}><T size={60}>LA SALA DE ESPERA DEL MUNDIAL</T></div>
						<div style={{position: 'absolute', left: 760, width: 900, top: 130, transform: `translateY(${(1 - easeOut((f - 16) / 16)) * -400}px)`}}>
							<div style={{borderRadius: 20, background: '#0E1016', border: `6px solid ${INK}`, boxShadow: '0 0 0 3px #fff, 0 10px 0 rgba(0,0,0,0.4)', padding: '14px 24px'}}>
								<div style={{display: 'flex', justifyContent: 'space-between', fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: '#7CFF9E'}}><span>AHORA ATENDIENDO</span><span>MUNDIAL 2026</span></div>
								<div style={{height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, transform: `scale(${closed ? 1 : 1 + 0.12 * Math.max(0, 1 - u / 14)})`}}>
									{closed ? <span style={{fontFamily: LILITA, fontSize: 64, color: '#FF5A5A'}}>CERRADO HASTA 2030</span> : called ? <>
										<Flag f={OPP[k].flag} w={110} />
										<span style={{fontFamily: LILITA, fontSize: 70, color: '#7CFF9E'}}>{up(nm(k))}</span>
										<span style={{fontFamily: LILITA, fontSize: 40, color: '#fff'}}>¡PASE!</span>
									</> : <span style={{fontFamily: LILITA, fontSize: 60, color: '#555'}}>- - -</span>}
								</div>
							</div>
							<div style={{display: 'flex', gap: 12, justifyContent: 'center', marginTop: 14}}>
								{CALLS.map((c, i) => (
									<div key={c} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 12, background: CAT_COL.SIN, border: `4px solid ${INK}`, opacity: f >= callAt(i) ? 1 : 0, transform: `scale(${backOut((f - callAt(i) - 20) / 10)})`}}>
										<Flag f={OPP[c].flag} w={40} /><span style={{fontFamily: LILITA, fontSize: 24, color: INK}}>{up(nm(c))}</span>
									</div>
								))}
							</div>
						</div>
						<Ticket x={600} y={600} rot={-8} txt="VEN-1930" sub="esperando desde siempre" />
						{f >= CLOSED + 10 && <Stamp text="¡OTRA VEZ FUERA!" sub="Venezuela sigue en la sala" col={CAT_COL.PAN} t={f - CLOSED - 10} x={1250} y={760} rot={-4} />}
					</AbsoluteFill>
				);
			})()}
			{/* ---------- B: Venezuela's last day */}
			{f >= H_T1 && f < H_T3 + 6 && (() => {
				const u = f - H_T1;
				const o = 1 - easeInOut((u - (H_T3 - H_T1) + 10) / 10);
				return (
					<AbsoluteFill style={{opacity: o}}>
						<div style={{position: 'absolute', left: 540, right: 40, top: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
							<div style={{transform: `scale(${backOut((u - 8) / 12)}) rotate(-2deg)`}}><T size={56}>LA ÚNICA DE SUDAMÉRICA</T></div>
							<div style={{transform: `scale(${backOut((u - 22) / 12)}) rotate(-2deg)`}}><T size={56} color="#FFD23F">QUE NUNCA HA IDO A UN MUNDIAL</T></div>
						</div>
						<div style={{position: 'absolute', left: 1180, width: 680, top: 250, transform: `translateX(${(1 - easeOut((u - 50) / 16)) * 800}px)`}}>
							<div style={{borderRadius: 20, background: '#16181F', border: `5px solid ${INK}`, boxShadow: '0 0 0 3px #fff, 0 10px 0 rgba(0,0,0,0.4)', padding: '12px 20px'}}>
								<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 16, letterSpacing: 2, color: 'rgba(255,255,255,0.7)'}}>9 SEPT 2025 · MATURÍN · ÚLTIMA JORNADA</div>
								<div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 8}}>
									<Flag f="ve" w={70} /><span style={{flex: 1, fontFamily: LILITA, fontSize: 36, color: '#fff'}}>VENEZUELA</span>
									<span style={{fontFamily: LILITA, fontSize: 64, color: '#FFD23F', whiteSpace: 'nowrap'}}>3 - 6</span>
									<span style={{flex: 1, textAlign: 'right', fontFamily: LILITA, fontSize: 36, color: '#fff'}}>COLOMBIA</span><Flag f="co" w={70} />
								</div>
							</div>
							<div style={{marginTop: 14, borderRadius: 20, background: CREAM, border: `5px solid ${INK}`, padding: '12px 20px', transform: `scale(${backOut((u - 150) / 12)})`, display: 'flex', alignItems: 'center', gap: 14}}>
								<Flag f="bo" w={64} /><span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: INK, lineHeight: 1.2}}>Esa misma noche, Bolivia le ganó 1-0 a Brasil y le quitó la plaza de repesca</span>
							</div>
						</div>
						{u >= 230 && <Stamp text="¡FUERA EN LA ÚLTIMA JORNADA!" col={CAT_COL.PAN} t={u - 230} x={1180} y={800} rot={-3} />}
					</AbsoluteFill>
				);
			})()}
			{/* ---------- C: 128 still waiting */}
			{f >= H_T3 && (() => {
				const u = f - H_T3;
				const n = Math.min(NEVER.length, Math.max(0, Math.round(((u - 40) / 200) * NEVER.length)));
				return (
					<AbsoluteFill>
						<div style={{position: 'absolute', left: 520, right: 20, top: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
							<div style={{transform: `scale(${backOut((u - 16) / 12)}) rotate(-2deg)`}}><T size={120} color="#FFD23F">{n} SELECCIONES</T></div>
							<div style={{transform: `scale(${backOut((u - 40) / 12)}) rotate(-2deg)`}}><T size={54}>DE LA FIFA NUNCA HAN IDO A UN MUNDIAL</T></div>
						</div>
						<div style={{position: 'absolute', left: 560, right: 40, top: 900, display: 'flex', justifyContent: 'center'}}>
							<div style={{transform: `scale(${backOut((u - 300) / 12)})`, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 24px', borderRadius: 16, background: '#fff', border: `4px solid ${INK}`}}>
								<div style={{width: 70, height: 46, borderRadius: 6, border: `3px solid ${INK}`, background: 'linear-gradient(90deg,#999,#555)', filter: 'blur(1px)'}} />
								<T size={40} color={INK} stroke={0} shadow={0}>Y una se quedó a un gol... ¿adivinas cuál?</T>
							</div>
						</div>
					</AbsoluteFill>
				);
			})()}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- CTA
const CTA_OV: number[] = (() => {
	const pick = (k: string) => { const sg = SEGS.find((x) => x.kind === 'focus' && x.e.k === k); return sg ? sg.from + 110 : -1; };
	return ['IND', 'MNE', 'GEO', 'MLI', 'SYR'].map(pick).filter((x) => x > 0);
})();
const SubButton: React.FC<{u: number; at: number; s?: number}> = ({u, at, s = 1}) => {
	const click = u >= at;
	const press = u >= at - 4 && u < at + 6;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 14 * s}}>
			<div style={{padding: `${10 * s}px ${26 * s}px`, borderRadius: 12 * s, background: click ? '#3A3A3A' : '#E1251B', border: `${4 * s}px solid ${INK}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 30 * s, color: '#fff', boxShadow: '0 6px 0 rgba(0,0,0,0.35)', transform: `scale(${press ? 0.9 : 1})`}}>{click ? 'SUSCRITO' : 'SUSCRÍBETE'}</div>
			<svg width={52 * s} height={52 * s} viewBox="0 0 24 24" style={{transform: `rotate(${click ? Math.sin((u - at) / 2.5) * 22 * Math.max(0, 1 - (u - at) / 50) : 0}deg)`}}>
				<path d="M12 2a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V8a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22z" fill="#FFD23F" stroke={INK} strokeWidth={1.3} />
			</svg>
			{u >= at - 30 && u < at + 20 && (
				<svg width={60 * s} height={60 * s} viewBox="0 0 24 24" style={{position: 'absolute', marginLeft: 120 * s, marginTop: 40 * s, transform: `translate(${(1 - easeOut((u - at + 30) / 26)) * 120}px, ${(1 - easeOut((u - at + 30) / 26)) * 80}px)`}}>
					<path d="M5 2 L5 20 L9.5 15.5 L13 22 L16 20.5 L12.5 14 L19 14 Z" fill="#fff" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
				</svg>
			)}
		</div>
	);
};
const CtaBanner: React.FC<{u: number}> = ({u}) => {
	const p = backOut(u / 16) * (1 - easeInOut((u - 250) / 16));
	return (
		<div style={{position: 'absolute', right: 20, top: 100, width: 560, transform: `translateX(${(1 - p) * 640}px)`}}>
			<div style={{position: 'relative', borderRadius: 20, background: 'rgba(22,24,31,0.94)', border: '4px solid #E1251B', boxShadow: '0 8px 0 rgba(0,0,0,0.35)', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
					<MiniFace mood="happy" s={46} bg="#F6C945" />
					<div style={{lineHeight: 1.1}}>
						<div style={{fontFamily: LILITA, fontSize: 30, color: '#fff'}}>¿Te está gustando el vídeo?</div>
						<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.8)'}}>Suscríbete: nos ayuda muchísimo a seguir</div>
					</div>
				</div>
				<SubButton u={u} at={120} s={0.85} />
			</div>
		</div>
	);
};
const CtaScene: React.FC<{g: Extract<Seg, {kind: 'cta'}>; t: number}> = ({g, t}) => {
	const out = easeInOut((t - CTA + 30) / 22);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{background: 'rgba(5,10,25,0.45)', opacity: easeOut(t / 20)}} />
			<div style={{position: 'absolute', left: 620, width: 1100, top: 300, transform: `scale(${backOut((t - 10) / 16)})`, borderRadius: 30, background: CREAM, border: `6px solid ${INK}`, boxShadow: '0 12px 0 rgba(0,0,0,0.35)', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
				<T size={70} color={INK} stroke={0} shadow={0}>¿TE ESTÁ GUSTANDO EL VÍDEO?</T>
				<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: '#6B6250', textAlign: 'center'}}>Si quieres más mapas como este, suscríbete y activa la campanita</div>
				<div style={{position: 'relative', transform: 'scale(1.5)', margin: '20px 0'}}><SubButton u={t} at={210} /></div>
				<div style={{padding: '8px 22px', borderRadius: 14, background: '#1B1D26', border: '3px solid #fff', fontFamily: LILITA, fontSize: 32, color: '#fff', transform: `scale(${backOut((t - 150) / 12)})`}}>{g.e.left} →</div>
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- LEGEND
const Legend: React.FC<{t: number}> = ({t}) => {
	const out = easeInOut((t - LEG + 40) / 20);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<div style={{position: 'absolute', left: 470, width: 1100, top: 150, transform: `scale(${backOut((t - 20) / 14)})`, borderRadius: 26, background: CREAM, border: `5px solid ${INK}`, boxShadow: '0 10px 0 rgba(0,0,0,0.35)', padding: '22px 34px 26px'}}>
				<div style={{display: 'flex', justifyContent: 'center'}}><T size={56} color={INK} stroke={0} shadow={0}>¿CUÁNTO SE ACERCARON?</T></div>
				<div style={{textAlign: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 24, color: '#6B6250', marginTop: 6}}>Su mejor intento de llegar a un Mundial</div>
				<div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20}}>
					{CATS.map((k, i) => {
						const p = easeOut((t - 90 - i * 40) / 16);
						return (
							<div key={k} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '10px 18px', borderRadius: 16, background: '#fff', border: `4px solid ${CAT_COL[k]}`, transform: `translateX(${(1 - p) * -1400}px)`}}>
								<MiniFace mood={catMood(k)} s={64} bg={CAT_COL[k]} />
								<span style={{width: 320, fontFamily: LILITA, fontSize: 44, color: CAT_DARK[k], whiteSpace: 'nowrap'}}>{CAT_NAME[k]}</span>
								<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 28, color: INK}}>{CAT_RULE[k]}</span>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};
export {useMemo};
