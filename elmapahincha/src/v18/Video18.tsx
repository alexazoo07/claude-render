import React, {useMemo} from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {WORLD, WCam, bboxOf} from '../v5/WorldLayer5';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, easeInOut, easeOut, elastic} from '../ui';
import {camPath, Key, Subscribe} from '../common';
import {FlagPreload} from '../v2/Preload';
import {Atlas, Face12, FaceMood, FaceSpec, Fill, INK, toScreen} from '../v12/Atlas';
import {CAT_COL, CAT_DARK, CAT_NAME, CAT_RULE, CAT_STAMP, Cat, Cta, Focus, Group, NAME, OPP, SCRIPT} from './data18';

const FPS = 60;
const CREAM = '#FFF7E6';
const CELESTE = '#6CB4EE';
const HERO = 'URY';
const CATS: Cat[] = ['PAN', 'MIE', 'RES', 'SIN'];

// ---------------------------------------------------------------- timeline
export const HOOK = 1260;
const LEG = 540;
const FOC = 840;
// focus phases
const P_PIN = 30, P_LINE = 70, P_CARD = 90, P_B1 = 230, P_B2 = 430, P_REV = 620, P_FEED = 670;
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
export const V18_TOTAL = OUT0 + OUTRO;
const FOCI = SEGS.filter((s): s is Extract<Seg, {kind: 'focus'}> => s.kind === 'focus');
const revealAt = (s: Extract<Seg, {kind: 'focus'}>) => s.from + P_REV;
// every reveal (k, frame)
const REV: {k: string; f: number}[] = [];
for (const s of SEGS) {
	if (s.kind === 'focus') REV.push({k: s.e.k, f: s.from + P_REV + 20});
	else if (s.kind === 'group') s.e.keys.forEach((k, j) => REV.push({k, f: s.from + G0 + j * GSTEP + 16}));
}
const ALL_FLAGS = Array.from(new Set(['uy', ...Object.values(OPP).map((o) => o.flag)]));

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
const H_TITLE_OUT = 380, H_T1 = 380, H_T3 = 720, H_END = HOOK;
const NEVER = Object.keys(OPP).filter((k) => OPP[k].cat === 'PAN').sort((a, b) => OPP[b].p - OPP[a].p || a.localeCompare(b));
// Maracanazo, 16 July 1950 (FIFA): Friaça 47', Schiaffino 66', Ghiggia 79'
const GOALS = [{u: 100, t: 'BRA', who: 'Friaça', m: 47}, {u: 190, t: 'URY', who: 'Schiaffino', m: 66}, {u: 270, t: 'URY', who: 'Ghiggia', m: 79}];
const SILENCE = 315;
const KEYS_CAM: Key[] = (() => {
	const k: Key[] = [];
	const add = (f: number, c: WCam) => k.push([f, c.x, c.y, c.z]);
	const br = fitBox(['BRA', 'URY'], 1150, 600, 900, 700);
	add(0, {...br, z: br.z * 0.85}); add(H_T1 - 30, {...br, z: br.z * 1.06});
	const sa0 = fitBox(['URY'], 1150, 470, 620, 330, 330); add(H_T1 + 30, sa0); add(H_T3 - 20, {...sa0, z: sa0.z * 1.05});
	add(H_T3 + 40, {x: 2150, y: 640, z: 0.6}); add(H_END, {x: 2150, y: 650, z: 0.63});
	const sa = fitBox(['BRA', 'ARG', 'COL', 'CHL']); add(HOOK + LEG - 40, sa);
	for (const s of SEGS) {
		const c = s.kind === 'focus' ? fitBox([s.e.k]) : s.kind === 'cta' ? {x: 1950, y: 760, z: 0.6} : fitBox(s.e.keys, 1010, 430, 760, 440, 200);
		add(s.from + 60, c); add(s.from + s.dur - 10, {...c, z: c.z * 1.05});
	}
	add(FIN0 + 70, {x: 1880, y: 860, z: 0.5}); add(V18_TOTAL, {x: 1880, y: 860, z: 0.53});
	k.sort((a, b) => a[0] - b[0]);
	return k;
})();

// ---------------------------------------------------------------- sfx / music
export const v18Sfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f: Math.round(f), name, vol});
	// cold open: the Maracanazo
	S(0, 'crowd_loop', 0.3); S(6, 'whistle_short', 0.4); S(20, 'slap', 0.45); S(40, 'pop_1', 0.4);
	for (let k = 0; k < 14; k++) S(60 + k * 16, 'tick', 0.1);
	S(GOALS[0].u, 'kick', 0.45); S(GOALS[0].u + 4, 'crowd_roar', 0.55);
	S(GOALS[1].u, 'kick', 0.45); S(GOALS[1].u + 4, 'crowd_ohh', 0.45); S(GOALS[1].u + 6, 'slap', 0.35);
	S(GOALS[2].u, 'kick', 0.45); S(GOALS[2].u + 4, 'crowd_ohh', 0.55); S(GOALS[2].u + 8, 'boom', 0.5);
	S(SILENCE, 'whistle_long', 0.45); S(SILENCE + 40, 'glass', 0.4); S(SILENCE + 42, 'boom', 0.6);
	S(H_T1, 'whoosh_2', 0.5); S(H_T1 + 10, 'slap', 0.45); S(H_T1 + 24, 'slap', 0.4); S(H_T1 + 70, 'pop_2', 0.4);
	for (let k = 0; k < 8; k++) S(H_T1 + 72 + k * 6, 'tick', 0.12);
	[0, 1, 2].forEach((i) => { S(H_T1 + 130 + i * 45, `pop_${i + 1}`, 0.45); S(H_T1 + 132 + i * 45, 'confirm', 0.25); });
	S(H_T1 + 270, 'pop_3', 0.4);
	S(H_T3, 'whoosh_1', 0.5); S(H_T3 + 20, 'slap', 0.45); S(H_T3 + 50, 'drop', 0.45); S(H_T3 + 52, 'boom', 0.55); S(H_T3 + 100, 'pop_1', 0.4);
	NEVER.forEach((_, i) => { S(H_T3 + 110 + i * 14, 'glitch', 0.16); S(H_T3 + 110 + i * 14, `pop_${(i % 4) + 1}`, 0.2); });
	S(H_T3 + 300, 'drumroll', 0.35); S(H_T3 + 360, 'boom', 0.55); S(H_T3 + 362, 'crowd_ohh', 0.4); S(H_T3 + 440, 'slap', 0.45);
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
export const v18Music = () => {
	const sec = (f: number) => (f / FPS).toFixed(2);
	const eu = SEGS.find((x) => x.e.region === 'EUROPA')!.from;
	const af = SEGS.find((x) => x.e.region === 'ÁFRICA')!.from;
	return [`m_tense:0:${sec(HOOK + 30)}`, `m_happy:${sec(HOOK)}:${sec(eu + 40)}`, `m_tense:${sec(eu)}:${sec(af + 40)}`, `m_happy:${sec(af)}:${sec(FIN0 + 40)}`, `m_triumph:${sec(FIN0)}:${sec(V18_TOTAL)}`].join(',');
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
const catMood = (c: Cat): FaceMood => (c === 'PAN' ? 'smug' : c === 'MIE' ? 'angry' : c === 'RES' ? 'cool' : 'scared');

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
const HS = Math.min(430 / (HB.x1 - HB.x0), 560 / (HB.y1 - HB.y0));
const HERO_W = (HB.x1 - HB.x0) * HS, HERO_H = (HB.y1 - HB.y0) * HS;
const HERO_TOP = 150 + (420 - HERO_H) / 2;
const FACE_X = HERO_W * 0.55, FACE_Y = HERO_H * 0.6;
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
						<image href={staticFile('flags/uy.svg')} x={HB.x0 - 2} y={HB.y0 - 2} width={HB.x1 - HB.x0 + 40} height={HB.y1 - HB.y0 + 4} preserveAspectRatio="none" />
						<image href={staticFile('tex/relief.jpg')} x={0} y={20} width={3830} height={1720} preserveAspectRatio="none" style={{mixBlendMode: 'multiply'}} />
					</g>
					<path d={WORLD[HERO].d} fill="none" stroke={INK} strokeWidth={4.5 / HS} strokeLinejoin="round" />
				</g>
			</svg>
			<svg width={280} height={280} viewBox="0 0 200 200" style={{position: 'absolute', left: 40 + FACE_X - 140, top: 40 + FACE_Y - 140, overflow: 'visible'}}>
				<Face12 mood={mood} look={look} blink={blink} talk={talk} />
			</svg>
			<div style={{position: 'absolute', left: 40 + FACE_X - 80, top: HERO_H + 40 + 6, width: 160, display: 'flex', justifyContent: 'center'}}>
				<div style={{padding: '4px 14px', borderRadius: 10, background: '#fff', border: `4px solid ${INK}`, fontFamily: LILITA, fontSize: 26, color: INK}}>URUGUAY</div>
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
	const fear = c.PAN + c.MIE + c.RES, nof = c.SIN;
	const tot = Math.max(1, fear + nof);
	const pos = fear + nof === 0 ? 0.5 : fear / tot;
	return (
		<div style={{position: 'absolute', left: 520, top: 18, width: 880, height: 60, transform: `translateY(${(1 - p) * -120}px)`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', boxSizing: 'border-box', borderRadius: 30, background: CREAM, border: `4px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)'}}>
			<MiniFace mood="smug" s={38} bg={CAT_COL.PAN} />
			<span style={{fontFamily: LILITA, fontSize: 26, color: CAT_DARK.PAN}}>SE LE RESISTEN</span>
			<span style={{fontFamily: LILITA, fontSize: 32, color: INK, width: 40, textAlign: 'center'}}>{fear}</span>
			<div style={{flex: 1, height: 26, borderRadius: 13, background: '#E6DCC6', border: `3px solid ${INK}`, overflow: 'hidden', position: 'relative'}}>
				<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pos * 100}%`, background: `repeating-linear-gradient(-45deg, ${CAT_COL.PAN} 0 10px, #F25C6A 10px 20px)`}} />
				<div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${(1 - pos) * 100}%`, background: `repeating-linear-gradient(-45deg, ${CAT_COL.SIN} 0 10px, #B385F0 10px 20px)`}} />
				<div style={{position: 'absolute', left: `calc(${pos * 100}% - 22px)`, top: -2, width: 44, height: 26, borderRadius: 8, background: '#FFB020', border: `3px solid ${INK}`, fontFamily: LILITA, fontSize: 18, color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>VS</div>
			</div>
			<span style={{fontFamily: LILITA, fontSize: 32, color: INK, width: 40, textAlign: 'center'}}>{nof}</span>
			<span style={{fontFamily: LILITA, fontSize: 26, color: CAT_DARK.SIN}}>DOMINADOS</span>
			<MiniFace mood="scared" s={38} bg={CAT_COL.SIN} />
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
		Fuente: resultados de todos los partidos oficiales y amistosos de la selección uruguaya absoluta (1902 - octubre 2026) · Japón-Uruguay 2026: El Gráfico · Los penaltis cuentan como empate
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
	if (cat === 'PAN' || cat === 'SIN') {
		// zig-zag lightning
		d = pts.map(([x, y], i) => { if (i === 0 || i === pts.length - 1) return `${i ? 'L' : 'M'}${x} ${y}`; const [px, py] = pts[i - 1]; const nx = -(y - py), ny = x - px; const l = Math.hypot(nx, ny) || 1; const o = (i % 2 ? 1 : -1) * 9; return `L${x + (nx / l) * o} ${y + (ny / l) * o}`; }).join(' ');
	} else d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
	const dash = cat === 'MIE' ? '18 12' : cat === 'RES' ? undefined : !cat ? '4 14' : undefined;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			<path d={d} fill="none" stroke={INK} strokeWidth={thin ? 8 : 12} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash ? dash.split(' ').map((v, i) => (i ? +v - 4 : +v + 4)).join(' ') : undefined} strokeDashoffset={dash ? -f * 1.5 + 2 : undefined} opacity={0.85} />
			<path d={d} fill="none" stroke={col} strokeWidth={thin ? 4 : 6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} strokeDashoffset={dash ? -f * 1.5 : undefined} />
			{cat === 'RES' && <path d={d} fill="none" stroke="#1F7E43" strokeWidth={6} strokeDasharray="6 10" strokeDashoffset={-f} />}
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
				<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, color: '#7A6E57', letterSpacing: 1}}>{o.p} PARTIDOS</span>
					{([['URUGUAY GANÓ', o.ol, CAT_COL.SIN], ['EMPATES', o.d, '#8C8471'], ['PERDIÓ', o.ow, CAT_COL.PAN]] as [string, number, string][]).map(([a, v, c]) => (
						<div key={a} style={{display: 'flex', alignItems: 'baseline', gap: 6}}>
							<span style={{fontFamily: LILITA, fontSize: 36, color: c}}>{Math.round(v * q)}</span>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 15, color: INK}}>{a}</span>
						</div>
					))}
					<div style={{flex: 1, height: 18, borderRadius: 9, overflow: 'hidden', border: `3px solid ${INK}`, display: 'flex', background: '#E6DCC6'}}>
						<div style={{width: `${(o.ol / o.p) * 100 * q}%`, background: CAT_COL.SIN}} />
						<div style={{width: `${(o.d / o.p) * 100 * q}%`, background: '#B7AE98'}} />
						<div style={{width: `${(o.ow / o.p) * 100 * q}%`, background: CAT_COL.PAN}} />
					</div>
				</div>
				<div style={{marginTop: 8, display: 'flex', gap: 10, alignItems: 'baseline', opacity: clamp01((t - 180) / 12)}}>
					<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 17, color: '#C46A00', letterSpacing: 1}}>DATO</span>
					<span style={{fontFamily: RUBIK, fontWeight: 600, fontSize: 21, color: INK, lineHeight: 1.25}}>{s.e.dato}</span>
				</div>
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
export const Video18: React.FC = () => {
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
	fills[HERO] = {color: CELESTE};
	const inGroup = new Set(grp ? grp.e.keys : []);
	for (const r of revealedBy(f)) {
		const o = OPP[r.k];
		if ((foc && r.k === foc.e.k) || inGroup.has(r.k)) continue;
		fills[r.k] = {color: CAT_COL[o.cat]};
		faces[r.k] = {mood: catMood(o.cat), size: 0.7, max: 62, blink: blinkOf(r.k), pop: f >= FIN0 ? 1 : elastic((f - r.f) / FPS)};
	}
	// hook teaser fills
	if (f < HOOK + 20) {
		if (f < H_T1 + 10) {
			// Brazil hosting the 1950 decider
			const g = GOALS.filter((x) => f >= x.u).length;
			const bm: FaceMood = g === 0 ? 'happy' : g === 1 ? 'smug' : g === 2 ? 'worried' : f >= SILENCE ? 'sad' : 'shock';
			fills.BRA = {flag: 'br', lift: easeOut((f - 10) / 30), pop: elastic((f - 10) / FPS)};
			faces.BRA = {mood: bm, size: 1.5, pop: elastic((f - 24) / FPS), blink: blinkOf('BRA'), look: [-0.4, 0.4]};
		} else if (f < H_T3 + 10) {
			fills[HERO] = {color: CELESTE, lift: 1, pop: 1 + 0.05 * Math.sin((f - H_T1) / 8)};
			faces.ARG = {mood: 'shock', size: 0.9, max: 90, pop: elastic((f - H_T1 - 40) / FPS), blink: blinkOf('ARG'), look: [0.3, 0.3]};
			faces.BRA = {mood: 'scared', size: 1.1, max: 120, pop: elastic((f - H_T1 - 50) / FPS), blink: blinkOf('BRA'), look: [-0.5, 0.4]};
		} else {
			NEVER.forEach((k, i) => { const u = f - H_T3 - 110 - i * 14; if (u >= 0 && WORLD[k]) { fills[k] = {color: '#1B1D26', lift: 0.6, pop: elastic(u / FPS)}; faces[k] = {mood: k === 'ESP' && f >= H_T3 + 360 ? 'smug' : 'cool', size: 1, max: 80, pop: elastic((u - 6) / FPS), blink: blinkOf(k)}; } });
			if (f >= H_T3 + 360) fills.ESP = {color: CAT_COL.PAN, lift: 1, pop: 1 + 0.08 * Math.sin(clamp01((f - H_T3 - 360) / 20) * Math.PI)};
		}
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
		const oMood: FaceMood = rev ? catMood(o.cat) : speaking ? (o.cat === 'SIN' ? 'cool' : 'happy') : t >= P_B2 && t < P_REV ? (o.cat === 'SIN' ? 'worried' : 'smug') : 'neutral';
		faces[k] = {mood: oMood, size: 1.5, pop: elastic((t - 24) / FPS), blink: blinkOf(k), talk: speaking ? Math.abs(Math.sin(t / 3.2)) : 0, look: [-0.7, -0.15]};
		heroLook = [0.9, -0.2];
		if (t >= P_B1 && t < P_B2) heroMood = o.cat === 'SIN' ? 'neutral' : 'worried';
		if (t >= P_B2 && t < P_REV) { heroMood = o.cat === 'SIN' ? 'smug' : 'worried'; heroTalk = Math.abs(Math.sin(t / 3.2)); }
		if (rev) { heroMood = o.cat === 'SIN' ? 'happy' : o.cat === 'RES' ? 'worried' : o.cat === 'MIE' ? 'sad' : 'shock'; heroGlow = o.cat === 'SIN' ? 'rgba(61,184,107,0.75)' : o.cat === 'RES' ? 'rgba(155,93,229,0.8)' : o.cat === 'MIE' ? 'rgba(255,155,33,0.8)' : 'rgba(232,57,74,0.8)'; }
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
	} else if (f < H_T1) { const g = GOALS.filter((x) => f >= x.u).length; heroMood = g === 0 ? 'neutral' : g === 1 ? 'worried' : g === 2 ? 'smug' : 'happy'; heroLook = [0.9, -0.3]; if (g >= 3) heroGlow = 'rgba(108,180,238,0.85)'; }
	else if (f >= H_T1 && f < H_T3) { heroMood = 'cool'; heroLook = [0.8, -0.1]; heroGlow = 'rgba(255,214,90,0.8)'; }
	else if (f >= H_T3 && f < HOOK) { heroMood = f >= H_T3 + 360 ? 'shock' : 'worried'; heroLook = [0.9, -0.2]; heroGlow = 'rgba(232,57,74,0.6)'; }
	else if (seg?.kind === 'cta') { heroMood = 'happy'; heroGlow = 'rgba(255,214,90,0.8)'; heroLook = [0.6, 0]; if (t >= 40 && t < 260) heroTalk = Math.abs(Math.sin(t / 3.2)); }
	else if (f >= FIN0) { heroMood = 'happy'; heroGlow = 'rgba(255,214,90,0.8)'; heroLook = [0.6, 0]; if (f >= FIN0 + 1080 && f < FIN0 + 1440) heroTalk = Math.abs(Math.sin(f / 3.2)); }
	const heroPop = f < 40 ? elastic((f - 6) / FPS) : 1;
	const hud = f >= HOOK + LEG - 40 && f < FIN0 + 20 ? easeOut((f - HOOK - LEG + 40) / 24) * (1 - easeInOut((f - FIN0) / 20)) : 0;
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			<FlagPreload flags={ALL_FLAGS} />
			<Atlas cam={cam} fills={fills} faces={faces} dark={f < H_TITLE_OUT ? 0.15 : f >= H_T3 && f < HOOK ? 0.3 : f < HOOK + LEG - 20 && f >= HOOK - 20 ? 0.35 * Math.sin(clamp01((f - HOOK + 20) / (LEG + 20)) * Math.PI) * 1.2 : 0} />
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
						{t >= P_REV && t < FOC - 20 && <Stamp text={CAT_STAMP[o.cat]} sub={o.ol === 0 ? 'Uruguay nunca le ganó' : `Uruguay ganó ${o.ol} de ${o.p}`} col={CAT_COL[o.cat]} t={t - P_REV} />}
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
					<div style={{textAlign: 'center', fontFamily: RUBIK, fontWeight: 800, fontSize: 13, letterSpacing: 1, marginTop: 2}}><span style={{color: CAT_DARK.SIN}}>URUGUAY GANÓ</span><span style={{color: '#8C8471'}}> · EMPATES · </span><span style={{color: CAT_DARK.PAN}}>PERDIÓ</span></div>
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
									<span style={{fontFamily: LILITA, fontSize: 16, opacity: on ? 1 : 0}}><span style={{color: CAT_DARK.SIN}}>{o.ol}</span><span style={{color: '#8C8471'}}> · {o.d} · </span><span style={{color: CAT_DARK.PAN}}>{o.ow}</span></span>
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
	const byCat = (k: Cat) => Object.keys(OPP).filter((x) => OPP[x].cat === k).sort((a, b) => OPP[b].p - OPP[a].p);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<div style={{position: 'absolute', left: 420, right: 20, top: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
				<div style={{transform: `scale(${backOut((t - 30) / 14)})`}}><T size={66}>URUGUAY: <span style={{color: '#3DB86B'}}>{TOT - c.PAN} DE {TOT}</span> RIVALES GANADOS</T></div>
				<div style={{transform: `scale(${backOut((t - 50) / 14)})`}}><T size={34} color="#FFD23F">{c.PAN} SE LE RESISTEN... Y UNA ES LA CAMPEONA DEL MUNDO</T></div>
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
				{(['PAN', 'MIE', 'RES', 'SIN'] as Cat[]).map((k, i) => {
					const ks = byCat(k);
					const w = k === 'SIN' ? 44 : 60;
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
			{t >= 1080 && t < 1440 && <Bubble x={heroEye()[0] - 40} y={1000} text="España, ¡voy a por ti!" p={backOut((t - 1080) / 12) * (1 - easeInOut((t - 1430) / 8))} tail="left" />}
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

// ---------------------------------------------------------------- HOOK (cold open: the Maracanazo -> the smallest champion -> the black list)
const minuteAt = (f: number) => {
	const K: [number, number][] = [[0, 0], [GOALS[0].u, 47], [GOALS[1].u, 66], [GOALS[2].u, 79], [SILENCE, 90]];
	if (f >= SILENCE) return 90;
	for (let i = 1; i < K.length; i++) if (f < K[i][0]) { const [a, ma] = K[i - 1], [b, mb] = K[i]; return Math.floor(ma + ((f - a) / (b - a)) * (mb - ma)); }
	return 90;
};
const Trophy: React.FC<{s: number; col?: string}> = ({s, col = '#FFD23F'}) => (
	<svg width={s} height={s} viewBox="0 0 100 100" style={{flexShrink: 0}}>
		<path d="M28 12 H72 V34 C72 50 62 60 50 60 C38 60 28 50 28 34Z" fill={col} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
		<path d="M28 18 H14 C14 34 20 40 30 42 M72 18 H86 C86 34 80 40 70 42" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
		<path d="M44 60 H56 V74 H44Z" fill={col} stroke={INK} strokeWidth={5} />
		<path d="M30 74 H70 V88 H30Z" fill="#8B5A2B" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
		<path d="M38 20 C36 30 38 40 44 46" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
	</svg>
);
const Hook: React.FC<{f: number}> = ({f}) => {
	const out = easeInOut((f - H_END + 14) / 14);
	const g = GOALS.filter((x) => f >= x.u);
	const sb = g.filter((x) => x.t === 'BRA').length, su = g.filter((x) => x.t === 'URY').length;
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			{/* ---------- A: 16 July 1950 */}
			{f < H_T1 + 10 && (() => {
				const o = 1 - easeInOut((f - H_T1 + 10) / 14);
				const last = g[g.length - 1];
				const flash = last ? Math.max(0, 1 - (f - last.u) / 18) : 0;
				return (
					<AbsoluteFill style={{opacity: o}}>
						<div style={{position: 'absolute', left: 560, right: 40, top: 26, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - easeOut((f - 4) / 16)) * -120}px)`}}>
							<div style={{padding: '6px 22px', borderRadius: 14, background: '#1B1D26', border: '3px solid #fff', fontFamily: LILITA, fontSize: 30, color: '#fff', letterSpacing: 1}}>16 DE JULIO DE 1950 · RÍO DE JANEIRO</div>
						</div>
						<div style={{position: 'absolute', left: 700, width: 1060, top: 92, transform: `scale(${backOut((f - 20) / 14)})`}}>
							<div style={{borderRadius: 22, background: '#16181F', border: `5px solid ${INK}`, boxShadow: `0 0 0 3px #fff, 0 10px 0 rgba(0,0,0,0.4)`, padding: '10px 22px 14px'}}>
								<div style={{display: 'flex', justifyContent: 'space-between', fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: 'rgba(255,255,255,0.7)'}}><span>ESTADIO MARACANÃ</span><span>PARTIDO DECISIVO · MUNDIAL 1950</span></div>
								<div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 8}}>
									<Flag f="br" w={86} />
									<span style={{flex: 1, fontFamily: LILITA, fontSize: 54, color: '#fff'}}>BRASIL</span>
									<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '4px 22px', borderRadius: 14, background: '#000', border: '3px solid #444', transform: `scale(${1 + 0.18 * flash})`}}>
										<span style={{fontFamily: LILITA, fontSize: 78, color: '#FFD23F'}}>{sb}</span><span style={{fontFamily: LILITA, fontSize: 54, color: '#777'}}>-</span><span style={{fontFamily: LILITA, fontSize: 78, color: su ? CELESTE : '#FFD23F'}}>{su}</span>
									</div>
									<span style={{flex: 1, textAlign: 'right', fontFamily: LILITA, fontSize: 54, color: '#fff'}}>URUGUAY</span>
									<Flag f="uy" w={86} />
								</div>
								<div style={{display: 'flex', justifyContent: 'center', marginTop: 6}}>
									<span style={{padding: '2px 16px', borderRadius: 10, background: f >= SILENCE ? '#E8394A' : '#2E3140', fontFamily: LILITA, fontSize: 30, color: '#fff'}}>{f >= SILENCE ? 'FINAL' : `${minuteAt(f)}'`}</span>
								</div>
							</div>
							<div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12}}>
								{g.map((x) => (
									<div key={x.who} style={{alignSelf: x.t === 'BRA' ? 'flex-start' : 'flex-end', display: 'flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 12, background: x.t === 'BRA' ? '#F6C945' : CELESTE, border: `4px solid ${INK}`, boxShadow: '0 5px 0 rgba(0,0,0,0.35)', transform: `translateX(${(1 - easeOut((f - x.u) / 12)) * (x.t === 'BRA' ? -500 : 500)}px)`}}>
										<svg width={30} height={30} viewBox="0 0 30 30"><circle cx={15} cy={15} r={13} fill="#fff" stroke={INK} strokeWidth={3} /><path d="M15 8 L21 12 L19 19 L11 19 L9 12Z" fill={INK} /></svg>
										<span style={{fontFamily: LILITA, fontSize: 32, color: INK}}>{x.m}' {x.who.toUpperCase()}</span>
									</div>
								))}
							</div>
						</div>
						<div style={{position: 'absolute', right: 40, bottom: 60, transform: `translateX(${(1 - easeOut((f - 50) / 16)) * 600}px)`, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 16, background: CREAM, border: `4px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)'}}>
							<svg width={54} height={40} viewBox="0 0 54 40">{[0, 1, 2, 3, 4].map((i) => <g key={i}><circle cx={7 + i * 10} cy={14 - (i % 2) * 4} r={6} fill={i % 2 ? '#F6C945' : '#3DB86B'} stroke={INK} strokeWidth={2} /><rect x={1 + i * 10} y={22 - (i % 2) * 4} width={12} height={18} rx={5} fill={i % 2 ? '#F6C945' : '#3DB86B'} stroke={INK} strokeWidth={2} /></g>)}</svg>
							<div style={{lineHeight: 1}}>
								<div style={{fontFamily: LILITA, fontSize: 44, color: f >= SILENCE ? '#A61E2D' : INK}}>{f >= SILENCE ? 'SILENCIO...' : '173.850'}</div>
								<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 17, color: '#7A6E57'}}>{f >= SILENCE ? 'en el estadio más grande del mundo' : 'ESPECTADORES (CIFRA OFICIAL)'}</div>
							</div>
						</div>
						{f >= SILENCE + 40 && <Stamp text="¡MARACANAZO!" sub="Uruguay, campeón del mundo en Brasil" col={CELESTE} t={f - SILENCE - 40} x={1150} y={880} rot={-3} />}
					</AbsoluteFill>
				);
			})()}
			{/* ---------- B: the smallest world champion */}
			{f >= H_T1 && f < H_T3 + 6 && (() => {
				const u = f - H_T1;
				const o = 1 - easeInOut((u - (H_T3 - H_T1) + 10) / 10);
				const cards: [string, string, string][] = [['2', 'MUNDIALES', '1930 · 1950'], ['2', 'OROS OLÍMPICOS', '1924 · 1928'], ['15', 'COPAS AMÉRICA', 'solo Argentina tiene más: 16']];
				return (
					<AbsoluteFill style={{opacity: o}}>
						<div style={{position: 'absolute', left: 520, right: 20, top: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
							<div style={{transform: `scale(${backOut((u - 10) / 12)}) rotate(-2deg)`}}><T size={70}>EL PAÍS MÁS PEQUEÑO</T></div>
							<div style={{transform: `scale(${backOut((u - 24) / 12)}) rotate(-2deg)`}}><T size={70} color="#FFD23F">QUE HA GANADO UN MUNDIAL</T></div>
						</div>
						<div style={{position: 'absolute', left: 520, right: 20, top: 240, display: 'flex', justifyContent: 'center'}}>
							<div style={{transform: `scale(${backOut((u - 70) / 12)})`, display: 'flex', alignItems: 'baseline', gap: 14, padding: '8px 26px', borderRadius: 16, background: '#1B1D26', border: `4px solid ${CELESTE}`}}>
								<T size={56} color={CELESTE}>{Math.round(3444263 * easeOut((u - 70) / 50)).toLocaleString('es-ES')}</T>
								<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: '#fff'}}>HABITANTES</span>
								<span style={{fontFamily: RUBIK, fontWeight: 600, fontSize: 18, color: 'rgba(255,255,255,0.65)'}}>Censo 2023 (INE Uruguay)</span>
							</div>
						</div>
						<div style={{position: 'absolute', left: 560, right: 40, top: 640, display: 'flex', justifyContent: 'center', gap: 22}}>
							{cards.map(([n, a, b], i) => (
								<div key={a} style={{width: 412, transform: `translateY(${(1 - backOut((u - 130 - i * 45) / 14)) * 500}px) rotate(${(i - 1) * 2}deg)`, borderRadius: 20, background: CREAM, border: `5px solid ${INK}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12}}>
									<Trophy s={92} col={i === 1 ? '#F2B33D' : i === 2 ? '#E8E2D0' : '#FFD23F'} />
									<div style={{lineHeight: 1.05}}>
										<div style={{display: 'flex', alignItems: 'baseline', gap: 10}}><T size={70} color={CELESTE}>{n}</T><span style={{fontFamily: LILITA, fontSize: 28, color: INK, whiteSpace: 'nowrap'}}>{a}</span></div>
										<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 16, color: '#7A6E57', whiteSpace: 'nowrap'}}>{b}</div>
									</div>
								</div>
							))}
						</div>
						<div style={{position: 'absolute', left: 520, right: 20, top: 900, display: 'flex', justifyContent: 'center'}}>
							<div style={{transform: `scale(${backOut((u - 270) / 12)})`, padding: '8px 24px', borderRadius: 14, background: '#fff', border: `4px solid ${INK}`}}><T size={40} color={INK} stroke={0} shadow={0}>¿A quién le va a tener miedo un país así?</T></div>
						</div>
					</AbsoluteFill>
				);
			})()}
			{/* ---------- C: the black list */}
			{f >= H_T3 && (() => {
				const u = f - H_T3;
				const n = Math.min(NEVER.length, Math.max(0, Math.floor((u - 110) / 14) + 1));
				const shake = u >= 50 && u < 80 ? Math.sin(u * 2.2) * 6 * (1 - (u - 50) / 30) : 0;
				const spain = u >= 360;
				return (
					<AbsoluteFill>
						<div style={{position: 'absolute', left: 500, width: 760, top: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
							<div style={{transform: `scale(${backOut((u - 20) / 12)}) rotate(-2deg)`}}><T size={58}>PERO URUGUAY TIENE UNA...</T></div>
							<div style={{transform: `translateX(${shake}px) scale(${u < 50 ? 0 : u < 62 ? 2 - easeOut((u - 50) / 12) : 1}) rotate(-3deg)`, padding: '6px 30px', borderRadius: 18, background: '#111', border: `5px solid ${CAT_COL.PAN}`, boxShadow: '0 8px 0 rgba(0,0,0,0.4)'}}><T size={110} color={CAT_COL.PAN}>LISTA NEGRA</T></div>
						</div>
						<div style={{position: 'absolute', left: 500, width: 760, top: 820, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((u - 100) / 12)})`}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '8px 22px', borderRadius: 16, background: CREAM, border: `4px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)'}}>
								<T size={84} color={CAT_COL.PAN}>{n}</T>
								<div style={{lineHeight: 1.05}}><div style={{fontFamily: LILITA, fontSize: 32, color: INK}}>SELECCIONES A LAS QUE</div><div style={{fontFamily: LILITA, fontSize: 32, color: CAT_DARK.PAN}}>NUNCA HA GANADO</div></div>
							</div>
						</div>
						<div style={{position: 'absolute', left: 1300, width: 590, top: 26, transform: `translateX(${(1 - easeOut((u - 70) / 18)) * 700}px) rotate(1.5deg)`}}>
							<div style={{position: 'relative', borderRadius: '10px 22px 22px 10px', background: '#17181D', border: `5px solid ${INK}`, boxShadow: '0 12px 0 rgba(0,0,0,0.45)', padding: '16px 20px 18px 34px'}}>
								<div style={{position: 'absolute', left: 8, top: 0, bottom: 0, width: 10, background: 'repeating-linear-gradient(#444 0 6px, #17181D 6px 22px)'}} />
								<div style={{position: 'absolute', right: 46, top: -5, bottom: -5, width: 18, background: CELESTE, border: `3px solid ${INK}`}} />
								<div style={{fontFamily: LILITA, fontSize: 34, color: '#fff', letterSpacing: 1}}>LISTA NEGRA DE URUGUAY</div>
								<div style={{fontFamily: RUBIK, fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 8}}>Nunca les ha ganado · 1902 - 2026</div>
								<div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
									{NEVER.map((k, i) => {
										const on = u >= 110 + i * 14;
										const open = spain && k === 'ESP';
										return (
											<div key={k} style={{height: 50, display: 'flex', alignItems: 'center', gap: 12, padding: '0 10px', borderRadius: 10, background: open ? CAT_COL.PAN : 'rgba(255,255,255,0.06)', border: `2px solid ${open ? '#fff' : 'rgba(255,255,255,0.12)'}`, opacity: on ? 1 : 0, transform: `translateX(${(1 - easeOut((u - 110 - i * 14) / 10)) * 80}px) scale(${open ? 1 + 0.1 * Math.sin(clamp01((u - 360) / 20) * Math.PI) : 1})`}}>
												<span style={{width: 26, fontFamily: LILITA, fontSize: 22, color: 'rgba(255,255,255,0.6)'}}>{i + 1}</span>
												<Flag f={OPP[k].flag} w={52} style={{filter: open ? undefined : 'blur(7px) grayscale(0.6)'}} />
												{open ? <span style={{flex: 1, fontFamily: LILITA, fontSize: 30, color: '#fff'}}>ESPAÑA · ¡LA CAMPEONA!</span> : <span style={{flex: 1, height: 20, borderRadius: 4, background: '#2E3140', maxWidth: 160 + ((i * 37) % 120)}} />}
												<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 14, color: open ? '#fff' : CAT_COL.PAN}}>{open ? '0 DE 11' : '???'}</span>
											</div>
										);
									})}
								</div>
							</div>
						</div>
						{spain && u < 470 && <Stamp text="¡LA CAMPEONA DEL MUNDO!" col={CAT_COL.PAN} t={u - 360} x={880} y={640} rot={-3} />}
						<div style={{position: 'absolute', left: 500, width: 760, top: 965, display: 'flex', justifyContent: 'center'}}>
							<div style={{transform: `scale(${backOut((u - 440) / 12)})`, padding: '8px 24px', borderRadius: 14, background: '#fff', border: `4px solid ${INK}`}}><T size={36} color={INK} stroke={0} shadow={0}>¿Y las otras 12? ¡Vamos a verlo!</T></div>
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
	return ['BRA', 'ITA', 'PRT', 'KOR'].map(pick).filter((x) => x > 0);
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
				<div style={{display: 'flex', justifyContent: 'center'}}><T size={56} color={INK} stroke={0} shadow={0}>¿CÓMO LO MEDIMOS?</T></div>
				<div style={{textAlign: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 24, color: '#6B6250', marginTop: 6}}>Todos los partidos de Uruguay contra cada selección</div>
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
