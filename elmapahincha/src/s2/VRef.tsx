// VRef · motor de shorts calcado de las referencias de El Mapa Animado
// (Argentina / Colombia / Latinoamérica desaparece). Medido a 30 fps:
//  - cámara QUIETA mientras habla cada país; entre países, vuelo de ~18 f@30 (36 f@60):
//    alejar acelerando → cruzar el mapa → acercar frenando (zoom-in exponencial)
//  - la bola del que habla aparece con un pop (5 f@30) al llegar la cámara; está pegada al mapa
//  - hook: bola llorando + vecinos con ojos "¿?" → grietas + temblor → flash blanco, onda, partículas,
//    el país queda gris oscuro y aparece una lápida R.I.P.
//  - subtítulos de 1-3 palabras a ~73 % de altura, palabra activa en amarillo
//  - final: fantasma + corazones + "¡DEJA ...!" con flecha, y vuelta al primer fotograma (loop)
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, Audio} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Atlas21, Fill, INK} from '../v21/Atlas21';
import {ALL, FL} from '../v21/data21';
import {W, H, FPS, center, toScr, NAMES, PAL, Cam, Timeline, TLine, Word} from './VShort3';

export const YL = '#FFC21A', RD = '#F0412F', CREAM = '#FFF6E4';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const rnd = (s: number) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
const cl = (u: number) => Math.max(0, Math.min(1, u));
const eIn3 = (u: number) => cl(u) ** 3;
const eOut3 = (u: number) => 1 - (1 - cl(u)) ** 3;
const eIO3 = (u: number) => { const x = cl(u); return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2; };

export type RMood = 'cry' | 'shock' | 'happy' | 'laugh' | 'smug' | 'angry' | 'sad' | 'worried' | 'peace' | 'love' | 'cool' | 'neutral';
export type Acc = 'tophat' | 'sombrero' | 'beret';
export type RScene = {
	k?: string;                 // país que habla (bola sobre su país)
	z?: number;                 // zoom de la cámara
	at?: [number, number];      // punto del mundo donde va la bola (por defecto, centro del país)
	cam?: Cam;                  // cámara explícita
	mood?: RMood; moods?: [string, RMood][]; acc?: Acc; d?: number;
	props?: (t: number, len: number, f: number) => React.ReactNode;
	eyes?: string[];            // países que miran con ojos (sin bola)
};
export type RDef = {
	k: string; years: string; title: [string, string?][][];
	scenes: RScene[];           // una por línea de audio; la 0 es el hook, la última el cierre
	cta: [string, string]; ctaIcon?: React.ReactNode; orbit?: React.ReactNode[];
};

// ---------------- text ----------------
export const TX: React.FC<{size: number; c?: string; sw?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({size, c = '#fff', sw = 0.13, children, style}) => (
	<span style={{fontFamily: LILITA, fontSize: size, lineHeight: 1.0, color: c, WebkitTextStroke: `${size * sw}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.08}px 0 ${INK}`, whiteSpace: 'nowrap', letterSpacing: size * 0.005, ...style}}>{children}</span>
);
const Title: React.FC<{rows: [string, string?][][]}> = ({rows}) => (
	<div style={{position: 'absolute', top: 236, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
		{rows.map((r, i) => <div key={i} style={{display: 'flex', gap: 16}}>{r.map(([t, c], j) => <TX key={j} size={c ? 118 : t.length > 18 ? 62 : 70} c={c ? YL : '#fff'}>{t}</TX>)}</div>)}
	</div>
);
type Chunk = {words: Word[]; s: number};
const cache = new WeakMap<TLine[], Chunk[]>();
const chunksOf = (lines: TLine[]) => {
	const hit = cache.get(lines); if (hit) return hit;
	const out: Chunk[] = [];
	for (const l of lines) {
		let cur: Word[] = [];
		const flush = () => { if (cur.length) out.push({words: cur, s: cur[0].s}); cur = []; };
		for (const w of l.words) {
			const len = cur.reduce((a, x) => a + x.w.length + 1, 0) + w.w.length;
			if (cur.length && (cur.length >= 3 || len > 16 || /[.!?…,;:]$/.test(cur[cur.length - 1].w))) flush();
			cur.push(w);
		}
		flush();
	}
	cache.set(lines, out); return out;
};
const Captions: React.FC<{lines: TLine[]; f: number}> = ({lines, f}) => {
	const ch = chunksOf(lines);
	let ci = -1;
	for (let q = 0; q < ch.length; q++) if (f >= ch[q].s - 1) ci = q;
	if (ci < 0) return null;
	const c = ch[ci];
	if (ci === ch.length - 1 && f > lines[lines.length - 1].end + 40) return null;
	const p = interpolate(f - c.s + 1, [0, 5], [0.9, 1], {...clamp, easing: Easing.out(Easing.back(2))});
	const chars = c.words.reduce((a, w) => a + w.w.length, 0) + c.words.length;
	const size = Math.min(104, 1700 / chars);
	let cur = 0;
	c.words.forEach((w, k) => { if (f >= w.s - 1) cur = k; });
	return (
		<div style={{position: 'absolute', top: 1356, left: 20, right: 20, display: 'flex', justifyContent: 'center', gap: 18, transform: `scale(${p})`}}>
			{c.words.map((w, k) => <TX key={k} size={size} c={k === cur ? YL : '#fff'}>{w.w}</TX>)}
		</div>
	);
};

// ---------------- face (estilo referencia) ----------------
const EYE = [74, 126], EY = 90;
export const FaceR: React.FC<{mood: RMood; talk?: number; blink?: number; look?: [number, number]; f?: number}> = ({mood, talk = 0, blink = 0, look = [0, 0], f = 0}) => {
	const wide = mood === 'shock';
	const r = wide ? 27 : 24, pr = wide ? 7 : mood === 'worried' ? 9 : 11;
	const closed = mood === 'laugh' || mood === 'peace' || blink > 0.5;
	const lid = mood === 'smug' ? 0.45 : mood === 'cool' ? 0 : mood === 'angry' ? 0.25 : 0;
	const o = Math.min(1, talk);
	return (
		<g>
			{/* tears (behind eyes) */}
			{mood === 'cry' && EYE.map((ex, s) => {
				const drop = ((f * 1.4 + s * 40) % 70) / 70;
				return <g key={s}>
					<path d={`M${ex - 9} ${EY + 18} C${ex - 12} ${EY + 60} ${ex - 14 + s * 0} 150 ${ex - 10} 196 L${ex + 6} 196 C${ex + 4} 150 ${ex + 8} ${EY + 60} ${ex + 9} ${EY + 18} Z`} fill="#9ADBFF" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
					<path d={`M${ex - 2} ${EY + 30} L${ex - 4} 180`} stroke="#E8F8FF" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
					<path transform={`translate(${ex - 2} ${200 + drop * 40})`} d="M0 -12 C6 -2 9 3 9 7 A9 9 0 0 1 -9 7 C-9 3 -6 -2 0 -12 Z" fill="#9ADBFF" stroke={INK} strokeWidth={3.5} opacity={1 - drop} />
				</g>;
			})}
			{/* eyes */}
			{EYE.map((ex, s) => {
				if (closed) {
					const up = mood === 'laugh';
					return <path key={s} d={up ? `M${ex - 20} ${EY + 6} Q${ex} ${EY - 18} ${ex + 20} ${EY + 6}` : `M${ex - 20} ${EY - 2} Q${ex} ${EY + 16} ${ex + 20} ${EY - 2}`} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />;
				}
				if (mood === 'cool') return null;
				const px = ex + look[0] * (r - pr - 5), py = EY + 2 + look[1] * (r - pr - 5);
				return <g key={s}>
					<circle cx={ex} cy={EY} r={r} fill="#fff" stroke={INK} strokeWidth={6.5} />
					{mood === 'love' ? <path transform={`translate(${px} ${py}) scale(1.3)`} d="M0 8 C-14 -2 -10 -14 0 -7 C10 -14 14 -2 0 8Z" fill="#FF4F8B" stroke={INK} strokeWidth={2.5} />
						: <g><circle cx={px} cy={py} r={pr} fill={INK} /><circle cx={px - pr * 0.35} cy={py - pr * 0.4} r={Math.max(2.4, pr * 0.34)} fill="#fff" /></g>}
					{lid > 0 && <path d={`M${ex - r - 3} ${EY - r - 3} H${ex + r + 3} V${EY - r + 2 * r * lid} H${ex - r - 3} Z`} fill={INK} clipPath="none" />}
					{lid > 0 && <path d={`M${ex - r - 2} ${EY - r + 2 * r * lid} H${ex + r + 2}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />}
				</g>;
			})}
			{mood === 'cool' && <g><path d="M40 76 H160 L154 104 Q146 118 122 114 L108 92 H92 L78 114 Q54 118 46 104 Z" fill={INK} /><path d="M58 84 L72 84" stroke="#fff" strokeWidth={5} strokeLinecap="round" /></g>}
			{/* brows */}
			{(mood === 'cry' || mood === 'worried' || mood === 'sad') && <path d="M52 62 Q66 50 92 58 M148 62 Q134 50 108 58" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />}
			{mood === 'shock' && <path d="M50 52 Q72 36 92 48 M150 52 Q128 36 108 48" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />}
			{mood === 'angry' && <path d="M48 52 L94 68 M152 52 L106 68" stroke={INK} strokeWidth={10} strokeLinecap="round" />}
			{mood === 'smug' && <path d="M50 58 Q70 50 94 60 M106 50 Q128 34 152 46" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />}
			{(mood === 'happy' || mood === 'laugh' || mood === 'love') && <path d="M52 56 Q72 44 92 54 M148 56 Q128 44 108 54" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />}
			{/* blush */}
			{(mood === 'peace' || mood === 'love' || mood === 'happy' || mood === 'laugh') && <g fill="#FF7FA0" opacity={0.65}><ellipse cx={50} cy={124} rx={14} ry={8} /><ellipse cx={150} cy={124} rx={14} ry={8} /></g>}
			{/* mouth */}
			{(mood === 'cry' || mood === 'sad' || mood === 'worried') && (o > 0.08 || mood === 'cry'
				? <g><ellipse cx={100} cy={146} rx={15 + o * 4} ry={6 + o * 12} fill="#6E1020" stroke={INK} strokeWidth={5.5} /><ellipse cx={100} cy={152 + o * 6} rx={8 + o * 2} ry={3 + o * 4} fill="#FF8FA5" /></g>
				: mood === 'worried' ? <path d="M78 148 q5 -6 11 0 q5 6 11 0 q5 -6 11 0 q5 6 11 0" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
				: <path d="M80 154 Q100 136 120 154" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />)}
			{mood === 'shock' && <g><rect x={80} y={128 - o * 2} width={40} height={34 + o * 14} rx={14} fill="#6E1020" stroke={INK} strokeWidth={5.5} /><rect x={86} y={130 - o * 2} width={28} height={8} rx={2} fill="#fff" /><ellipse cx={100} cy={154 + o * 10} rx={10} ry={5} fill="#FF8FA5" /></g>}
			{(mood === 'happy' || mood === 'love') && <g><path d={`M72 132 Q100 ${158 + o * 16} 128 132 Z`} fill="#6E1020" stroke={INK} strokeWidth={5.5} strokeLinejoin="round" /><ellipse cx={100} cy={144 + o * 7} rx={10} ry={4 + o * 3} fill="#FF8FA5" /></g>}
			{mood === 'laugh' && <g><path d={`M66 126 Q100 ${172 + o * 10} 134 126 Z`} fill="#6E1020" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><ellipse cx={100} cy={152 + o * 6} rx={14} ry={6} fill="#FF8FA5" /></g>}
			{(mood === 'smug' || mood === 'cool') && <path d={`M78 146 Q108 ${156 + o * 10} 128 134`} fill={o > 0.15 ? '#6E1020' : 'none'} stroke={INK} strokeWidth={6.5} strokeLinecap="round" />}
			{mood === 'angry' && <g><rect x={76} y={132} width={48} height={20 + o * 10} rx={6} fill="#fff" stroke={INK} strokeWidth={5.5} /><path d={`M76 ${142 + o * 5} H124`} stroke={INK} strokeWidth={3} /></g>}
			{mood === 'peace' && <ellipse cx={100} cy={142} rx={7} ry={8} fill="#6E1020" stroke={INK} strokeWidth={4} />}
			{mood === 'neutral' && (o > 0.1 ? <ellipse cx={100} cy={146} rx={13} ry={4 + o * 10} fill="#6E1020" stroke={INK} strokeWidth={5} /> : <path d="M84 146 H116" stroke={INK} strokeWidth={6.5} strokeLinecap="round" />)}
		</g>
	);
};
const Accessory: React.FC<{a: Acc}> = ({a}) => {
	if (a === 'tophat') return <g><rect x={30} y={-20} width={140} height={22} rx={10} fill="#1E1E24" stroke={INK} strokeWidth={5} /><path d="M58 -18 L62 -122 Q100 -132 138 -122 L142 -18 Z" fill="#2A2A33" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><rect x={61} y={-44} width={78} height={14} fill="#4A4A55" /><path d="M78 -110 L80 -40" stroke="#555" strokeWidth={6} strokeLinecap="round" /></g>;
	if (a === 'sombrero') return <g><ellipse cx={100} cy={0} rx={128} ry={30} fill="#E9B65C" stroke={INK} strokeWidth={6} /><path d="M58 -2 Q62 -86 100 -90 Q138 -86 142 -2 Z" fill="#F2C46E" stroke={INK} strokeWidth={6} /><path d="M60 -22 Q100 -10 140 -22" fill="none" stroke="#C0392B" strokeWidth={10} /><path d="M60 -22 Q100 -10 140 -22" fill="none" stroke="#27AE60" strokeWidth={4} strokeDasharray="10 10" /><path d="M-20 4 Q100 40 220 4" fill="none" stroke="#C0392B" strokeWidth={6} /></g>;
	return <g><ellipse cx={92} cy={-6} rx={78} ry={30} fill="#1F2A44" stroke={INK} strokeWidth={6} /><path d="M92 -36 L96 -52" stroke={INK} strokeWidth={8} strokeLinecap="round" /></g>;
};
export const BallR: React.FC<{k: string; d: number; mood: RMood; talk?: number; f?: number; acc?: Acc; label?: boolean; ghost?: number; look?: [number, number]}> = ({k, d, mood, talk = 0, f = 0, acc, label = true, ghost = 0, look = [0, 0.05]}) => (
	<div style={{position: 'relative', width: d, height: d}}>
		{ghost > 0 && <svg width={d * 1.08} height={d * 1.25} viewBox="0 0 108 125" style={{position: 'absolute', left: -d * 0.04, top: d * 0.45, opacity: 0.8 * ghost}}>
			<path d={`M6 0 V${92 + Math.sin(f / 8) * 4} Q15 ${108 + Math.sin(f / 8 + 1) * 5} 24 96 Q33 ${112 + Math.sin(f / 8 + 2) * 5} 42 98 Q54 ${116 + Math.sin(f / 8 + 3) * 5} 64 98 Q75 ${112 + Math.sin(f / 8 + 4) * 5} 84 96 Q95 ${108 + Math.sin(f / 8 + 5) * 5} 102 ${92 + Math.sin(f / 8 + 6) * 4} V0 Z`} fill="#EEF4FF" stroke={INK} strokeWidth={2.5} />
		</svg>}
		<div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', boxShadow: `0 0 0 ${d * 0.022}px ${CREAM}, 0 0 0 ${d * 0.036}px ${INK}`, opacity: ghost > 0 ? 1 - 0.25 * ghost : 1}}>
			<img src={staticFile(`flags/${FL[k] ?? k.toLowerCase()}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: ghost > 0 ? `saturate(${1 - 0.55 * ghost}) brightness(${1 + 0.25 * ghost})` : undefined}} />
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 42%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.42) 100%), radial-gradient(ellipse 34% 20% at 40% 16%, rgba(255,255,255,0.6), rgba(255,255,255,0) 100%)'}} />
			{ghost > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(235,242,255,${0.45 * ghost})`}} />}
		</div>
		<svg width={d} height={d} viewBox="0 0 200 200" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
			<FaceR mood={mood} talk={talk} blink={(f % 170) < 6 && mood !== 'cry' ? 1 : 0} look={look} f={f} />
			{acc && <g transform={acc === 'beret' ? 'translate(0 20)' : 'translate(0 18)'}><Accessory a={acc} /></g>}
		</svg>
		{label && NAMES[k] && <div style={{position: 'absolute', left: '50%', top: d * 1.04, transform: 'translateX(-50%)', background: CREAM, border: `${Math.max(3, d * 0.014)}px solid ${INK}`, borderRadius: d * 0.05, padding: `${d * 0.008}px ${d * 0.05}px`, boxShadow: `0 ${d * 0.016}px 0 ${INK}`}}><span style={{fontFamily: LILITA, fontSize: d * 0.095, color: INK, whiteSpace: 'nowrap', letterSpacing: 1}}>{NAMES[k]}</span></div>}
	</div>
);
// solo ojos sobre un país del mapa (vecinos que miran)
const Peek: React.FC<{x: number; y: number; s: number; f: number; tx: number; ty: number; q?: boolean; scared?: boolean}> = ({x, y, s, f, tx, ty, q = true, scared}) => {
	const a = Math.atan2(ty - y, tx - x), lx = Math.cos(a) * 0.5, ly = Math.sin(a) * 0.5;
	const bl = (f % 140) < 6;
	return <svg width={s * 3} height={s * 3} viewBox="-75 -75 150 150" style={{position: 'absolute', left: x - s * 1.5, top: y - s * 1.5, overflow: 'visible'}}>
		{[-23, 23].map((ex) => bl ? <path key={ex} d={`M${ex - 18} 0 Q${ex} 10 ${ex + 18} 0`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" /> : <g key={ex}><circle cx={ex} cy={0} r={21} fill="#fff" stroke={INK} strokeWidth={5.5} /><circle cx={ex + lx * 10} cy={ly * 10} r={scared ? 6 : 9} fill={INK} /><circle cx={ex + lx * 10 - 3} cy={ly * 10 - 3} r={3} fill="#fff" /></g>)}
		{scared && <path d="M-44 -30 Q-28 -40 -10 -32 M44 -30 Q28 -40 10 -32" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />}
		{q && <text x={0} y={-40} textAnchor="middle" fontFamily={LILITA} fontSize={34} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke" transform={`rotate(${Math.sin(f / 12) * 8} 0 -50)`}>¿?</text>}
	</svg>;
};
const Tomb: React.FC<{name: string; years: string; s: number}> = ({name, years, s}) => (
	<svg width={s} height={s * 1.1} viewBox="0 0 200 220" style={{overflow: 'visible'}}>
		<ellipse cx={100} cy={205} rx={98} ry={16} fill="#6B4A2E" stroke={INK} strokeWidth={5} />
		<path d="M30 205 V70 Q30 12 100 12 Q170 12 170 70 V205 Z" fill="#9AA0AA" stroke={INK} strokeWidth={7} />
		<path d="M44 196 V74 Q44 28 100 28 Q156 28 156 74 V196" fill="none" stroke="#B7BCC4" strokeWidth={5} />
		<path d="M122 30 L112 58 L124 72 L114 96" fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
		<text x={100} y={78} textAnchor="middle" fontFamily={LILITA} fontSize={30} fill="#3A3D44">R.I.P.</text>
		<text x={100} y={122} textAnchor="middle" fontFamily={LILITA} fontSize={name.length > 8 ? 22 : 27} fill="#3A3D44">{name}</text>
		<text x={100} y={160} textAnchor="middle" fontFamily={LILITA} fontSize={24} fill="#3A3D44">{years}</text>
	</svg>
);
// grietas: zig-zags blancos desde el centro hacia fuera
const Cracks: React.FC<{x: number; y: number; w: number; h: number; p: number; seed: number}> = ({x, y, w, h, p, seed}) => {
	if (p <= 0) return null;
	const R = rnd(seed);
	const paths = Array.from({length: 9}, (_, i) => {
		const a = (i / 9) * Math.PI * 2 + R() * 0.5; let px = x + (R() - 0.5) * w * 0.15, py = y + (R() - 0.5) * h * 0.15;
		const pts = [[px, py]]; const n = 6;
		for (let j = 0; j < n; j++) { px += Math.cos(a + (R() - 0.5) * 1.4) * w * 0.09; py += Math.sin(a + (R() - 0.5) * 1.4) * h * 0.09; pts.push([px, py]); }
		const m = Math.max(1, Math.round(pts.length * cl(p * 1.3 - i * 0.04)));
		return pts.slice(0, m).map((q, k) => `${k ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ');
	});
	return <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
		{paths.map((d, i) => <path key={'o' + i} d={d} fill="none" stroke={INK} strokeWidth={11} strokeLinejoin="round" strokeLinecap="round" />)}
		{paths.map((d, i) => <path key={'w' + i} d={d} fill="none" stroke="#fff" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />)}
	</svg>;
};
const Burst: React.FC<{x: number; y: number; w: number; h: number; t: number; cols: string[]}> = ({x, y, w, h, t, cols}) => {
	if (t < 0 || t > 150) return null;
	const R = rnd(4242);
	return <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
		{Array.from({length: 170}, (_, i) => {
			const ox = (R() - 0.5) * w, oy = (R() - 0.5) * h, a = Math.atan2(oy, ox) + (R() - 0.5), sp = 0.6 + R() * 2.2;
			const d = sp * 60 * (1 - Math.exp(-t / 22)) + t * 0.15;
			const px = x + ox + Math.cos(a) * d, py = y + oy + Math.sin(a) * d;
			const s = 5 + R() * 11, c = R() < 0.45 ? '#FFFFFF' : cols[i % cols.length];
			const op = interpolate(t, [0, 4, 100 + R() * 40, 150], [0, 1, 1, 0], clamp);
			return R() < 0.5 ? <circle key={i} cx={px} cy={py} r={s * 0.45} fill={c} stroke="rgba(0,0,0,0.45)" strokeWidth={1.5} opacity={op} /> : <rect key={i} x={px - s / 2} y={py - s / 2} width={s} height={s} fill={c} stroke="rgba(0,0,0,0.45)" strokeWidth={1.5} opacity={op} transform={`rotate(${R() * 360 + t * 2} ${px} ${py})`} />;
		})}
	</svg>;
};
const HeartsR: React.FC<{f: number}> = ({f}) => {
	const R = rnd(91);
	return <>{Array.from({length: 22}, (_, i) => {
		const x0 = 30 + R() * 1020, sp = 2.2 + R() * 2.4, ph = R() * 2000, s = 46 + R() * 50;
		const y = 1900 - ((f * sp + ph) % 1900);
		const p = cl((f - i * 4) / 10);
		return <svg key={i} width={s} height={s} viewBox="0 0 100 100" style={{position: 'absolute', left: x0 + Math.sin((f + ph) / 30) * 20, top: y, transform: `scale(${p}) rotate(${Math.sin((f + ph) / 20) * 14}deg)`}}>
			<path d="M50 88 C10 60 0 38 14 22 C28 6 46 14 50 28 C54 14 72 6 86 22 C100 38 90 60 50 88 Z" fill="#8CC8FF" stroke="#2C5D8F" strokeWidth={7} /><path d="M26 30 Q30 22 38 22" stroke="#DDF0FF" strokeWidth={6} fill="none" strokeLinecap="round" />
		</svg>;
	})}</>;
};

// ---------------- engine ----------------
const BY = 860;            // centro de la bola en pantalla
const D0 = 320;            // diámetro de la bola del que habla
const FLY = 36;            // duración del vuelo (60 fps)
const LEAD = 14;           // el país empieza a hablar 14 f después de llegar la cámara
export const VRef: React.FC<{tl: Timeline; def: RDef}> = ({tl, def}) => {
	const f = useCurrentFrame();
	const L = tl.lines, N = L.length;
	const scs = def.scenes;
	const anchorOf = (s: RScene, j: number): [number, number] => { if (s.at) return s.at; const c = center(s.k ?? def.k); return [c.x, c.y]; };
	const keys: Cam[] = scs.map((s, j) => {
		if (s.cam) return s.cam;
		const k = s.k ?? def.k, c = center(k);
		const z = s.z ?? (k === def.k ? Math.max(1.3, Math.min(12, 760 / c.h, 900 / c.w)) : Math.max(1.3, Math.min(9, 700 / Math.max(c.w, c.h * 0.9))));
		const [ax, ay] = anchorOf(s, j);
		return {x: ax, y: ay + (H / 2 - BY) / z, z};
	});
	const boom = L[0].end + 12;
	const crack0 = boom - 48;
	const arrive = (j: number) => (j === 0 ? 0 : L[j].start - LEAD);
	const fly0 = (j: number) => arrive(j) - FLY;
	// cámara: quieta en cada escena; vuelo con zoom-out acelerando y zoom-in frenando
	const camAt = (fr: number): Cam => {
		let j = 0;
		while (j + 1 < N && fr >= fly0(j + 1)) j++;
		const B = keys[j];
		if (j > 0 && fr < arrive(j)) {
			const A = keys[j - 1], u = (fr - fly0(j)) / FLY;
			const dist = Math.hypot(B.x - A.x, B.y - A.y);
			const zFit = 820 / Math.max(1, dist);
			const zMid = Math.min(A.z, B.z, zFit);
			const p = eIO3(u);
			let lz: number;
			if (zMid < Math.min(A.z, B.z) * 0.85) {
				const a = 0.45;
				lz = u < a ? Math.log(A.z) + (Math.log(zMid) - Math.log(A.z)) * eIn3(u / a) : Math.log(zMid) + (Math.log(B.z) - Math.log(zMid)) * eOut3((u - a) / (1 - a));
			} else lz = Math.log(A.z) + (Math.log(B.z) - Math.log(A.z)) * p;
			return {x: A.x + (B.x - A.x) * p, y: A.y + (B.y - A.y) * p, z: Math.exp(lz)};
		}
		return B;
	};
	// loop: los últimos fotogramas vuelven al estado del primero
	const loopAt = tl.total - 34;
	const looping = f >= loopAt;
	let cam = looping ? keys[0] : camAt(f);
	// temblor durante las grietas y en la explosión
	const shake = f < boom ? interpolate(f, [crack0, boom], [0, 5], clamp) : interpolate(f - boom, [0, 2, 26], [0, 14, 0], clamp);
	cam = {...cam, x: cam.x + (Math.sin(f * 1.9) * shake) / cam.z, y: cam.y + (Math.cos(f * 2.3) * shake) / cam.z};
	let i = 0;
	while (i + 1 < N && f >= fly0(i + 1)) i++;
	const sc = scs[i];
	const ln = L[i];
	const t = f - ln.start, len = ln.end - ln.start;
	// accesorios de la escena se van rápido cuando empieza el vuelo
	const nextFly = i + 1 < N ? fly0(i + 1) : 1e9;
	const propK = interpolate(f, [nextFly - 2, nextFly + 8], [1, 0], clamp);
	const gone = f >= boom && !looping;
	const fills: Record<string, Fill> = {};
	for (const c of ALL) {
		if (!WORLD[c]) continue;
		if (c === def.k && gone) { fills[c] = {color: f < boom + 4 ? '#E9ECF2' : '#4B4E57'}; continue; }
		fills[c] = {flag: FL[c], lift: 0};
	}
	const flash = looping ? interpolate(f, [loopAt, loopAt + 3, loopAt + 14], [0, 0.9, 0], clamp) : interpolate(f - boom, [0, 1, 18], [0, 0.72, 0], clamp);
	// lip sync
	const ai = f - ln.start;
	const ampS = ln.amp ? [0, 1, 2].reduce((a, k) => a + (ln.amp![Math.max(0, Math.min(ln.amp!.length - 1, ai - k))] ?? 0), 0) / 3 : 0;
	const talkNow = ai >= 0 && ai < len ? Math.min(1, ampS * 1.7) : 0;
	const wordAt = (j: number, pre: string) => L[j].words.find((w) => w.w.toLowerCase().replace(/[¡!¿?,.…:;]/g, '').startsWith(pre));
	const moodOf = (j: number, fr: number): RMood => {
		const s = scs[j]; let m: RMood = s.mood ?? 'neutral';
		for (const [pre, mm] of s.moods ?? []) { const w = wordAt(j, pre); if (w && fr >= w.s - 4) m = mm; }
		return m;
	};
	const vc = center(def.k);
	const vp = toScr(cam, vc.x, vc.y);
	const balls: React.ReactNode[] = [];
	// bolas: la de cada escena ya visitada sigue pegada al mapa (las anteriores, más pequeñas y sin etiqueta)
	for (let j = 0; j <= i && j < N - 1; j++) {
		const s = scs[j];
		if (!s.k) continue;
		if (j === 0 && (gone || false)) continue;
		if (j > 0 && s.k === def.k) continue;
		const [ax, ay] = anchorOf(s, j);
		const p = toScr(cam, ax, ay);
		const cur = j === i;
		const shr = cur ? 1 : interpolate(f, [arrive(j + 1) - 2, arrive(j + 1) + 10], [1, 0], {...clamp, easing: Easing.in(Easing.cubic)});
		if (shr <= 0.01) continue;
		const sz = (s.d ?? D0) * Math.min(cur ? 9 : 1, cam.z / keys[j].z) * shr;
		if (sz < 18 || p.x < -sz || p.x > W + sz || p.y < -sz || p.y > H + sz) continue;
		if (!cur && f >= arrive(i)) { const q = toScr(cam, ...anchorOf(sc, i)); if (sc.k && Math.hypot(q.x - p.x, q.y - p.y) < (D0 * 0.5 + sz * 0.5) * 1.05) continue; }
		const popT = j === 0 ? 30 : f - (arrive(j) - 4);
		const pp = spring({frame: popT, fps: FPS, config: {damping: 12, stiffness: 260, mass: 0.6}});
		const preB = j === 0 ? interpolate(f, [boom - 6, boom], [1, 1.18], clamp) : 1;
		const tr = j === 0 && f > crack0 ? Math.sin(f * 2.7) * interpolate(f, [crack0, boom], [0, 5], clamp) : 0;
		const breath = 1 + Math.sin(f / 26 + j) * 0.012;
		const mood: RMood = cur || f < arrive(j + 1) ? moodOf(j, f) : 'neutral';
		balls.push(<div key={'b' + j} style={{position: 'absolute', left: p.x - sz / 2 + tr, top: p.y - sz / 2, transform: `scale(${Math.max(0, pp) * preB * breath})`, transformOrigin: '50% 60%'}}>
			<BallR k={s.k} d={sz} mood={mood} talk={cur ? talkNow : 0} f={f + j * 31} acc={s.acc} label={cur || f < arrive(j + 1)} look={j === 0 && f > crack0 ? [0, -0.2] : [Math.sin(f / 90 + j) * 0.15, 0.05]} />
		</div>);
	}
	// ojos de vecinos (hook y escenas que lo pidan)
	const eyes = (i === 0 && !gone ? scs[0].eyes : sc.eyes) ?? [];
	// lápida pegada al país desaparecido
	const tombP = toScr(cam, vc.x, vc.y + vc.h * 0.05);
	const tombS = Math.min(420, Math.max(60, 300 * cam.z / keys[0].z));
	const tombPop = spring({frame: f - boom - 14, fps: FPS, config: {damping: 10, stiffness: 220, mass: 0.7}});
	const last = i === N - 1 && !looping;
	const ctaT = f - (arrive(N - 1) - 4);
	return (
		<AbsoluteFill style={{background: '#2C6CA8', overflow: 'hidden'}}>
			<Fonts />
			<FlagPreload flags={ALL.map((c) => FL[c]).filter(Boolean)} />
			<Atlas21 cam={cam} fills={fills} faces={{}} W={W} H={H} dark={0.06} cullPad={5000} />
			{!looping && f >= crack0 && f < boom && <Cracks x={vp.x} y={vp.y} w={Math.max(520, vc.w * cam.z)} h={Math.max(700, vc.h * cam.z)} p={(f - crack0) / 44} seed={11} />}
			{gone && <Burst x={vp.x} y={vp.y} w={vc.w * cam.z * 0.9} h={vc.h * cam.z * 0.9} t={f - boom} cols={PAL[def.k] ?? ['#ccc', '#999']} />}
			{gone && f - boom < 34 && (() => { const u = (f - boom) / 34; const r = 120 + eOut3(u) * 700; return <svg width={W} height={H} style={{position: 'absolute', inset: 0}}><circle cx={vp.x} cy={vp.y} r={r} fill="none" stroke="#fff" strokeWidth={8 - 5 * u} opacity={0.9 * (1 - u)} /></svg>; })()}
			{gone && f >= boom + 14 && tombP.y > -400 && tombP.y < H + 400 && <div style={{position: 'absolute', left: tombP.x - tombS / 2 + (last ? 150 * cl(ctaT / 20) : 0), top: tombP.y - tombS * 0.75, transform: `scale(${Math.max(0, tombPop)})`, transformOrigin: '50% 100%', opacity: last ? 1 : 1}}><Tomb name={NAMES[def.k] ?? def.k} years={def.years} s={tombS} /></div>}
			{eyes.map((k) => { const c = center(k); const p = toScr(cam, c.x, c.y); if (p.x < 60 || p.x > W - 60 || p.y < 560 || p.y > H - 200) return null; return <Peek key={k} x={p.x} y={p.y} s={52} f={f} tx={vp.x} ty={vp.y} scared={f > crack0} />; })}
			{balls}
			{sc.props && !looping && <div style={{position: 'absolute', inset: 0, opacity: propK, transform: `scale(${0.9 + 0.1 * propK})`, transformOrigin: '50% 50%'}}>{sc.props(t, len, f)}</div>}
			{last && <>
				<HeartsR f={ctaT} />
				{(() => { const p = toScr(cam, vc.x, vc.y); const gp = spring({frame: ctaT, fps: FPS, config: {damping: 12, stiffness: 140}}); const gy = Math.max(560, p.y - 330) + Math.sin(ctaT / 22) * 16; return <div style={{position: 'absolute', left: p.x - 300, top: gy, transform: `scale(${gp})`, opacity: Math.min(1, gp * 1.4)}}>
					<BallR k={def.k} d={300} mood="peace" f={f} ghost={1} label={false} />
					{(def.orbit ?? []).map((ic, q, arr) => { const a = ctaT / 50 + (q / arr.length) * Math.PI * 2; return <div key={q} style={{position: 'absolute', left: 150 + Math.cos(a) * 230 - 40, top: 150 + Math.sin(a) * 120 - 40, transform: `scale(${cl((ctaT - 10 - q * 5) / 10)})`}}>{ic}</div>; })}
				</div>; })()}
				<div style={{position: 'absolute', top: 1060, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transform: `scale(${spring({frame: ctaT - 20, fps: FPS, config: {damping: 11, stiffness: 200}})})`}}>
					<TX size={64}>{def.cta[0]}</TX>
					<div style={{display: 'flex', alignItems: 'center', gap: 14}}><TX size={Math.min(88, 1500 / def.cta[1].length)} c={YL}>{def.cta[1]}</TX>{def.ctaIcon}</div>
					<svg width={110} height={120} viewBox="0 0 110 120" style={{transform: `translateY(${Math.abs(Math.sin(ctaT / 9)) * 22}px)`}}><path d="M35 6 H75 V58 H102 L55 112 L8 58 H35 Z" fill={YL} stroke={INK} strokeWidth={8} strokeLinejoin="round" /></svg>
				</div>
			</>}
			{looping && <div style={{position: 'absolute', left: toScr(cam, ...anchorOf(scs[0], 0)).x - D0 / 2, top: toScr(cam, ...anchorOf(scs[0], 0)).y - D0 / 2}}><BallR k={def.k} d={D0} mood="cry" f={f} acc={scs[0].acc} /></div>}
			{looping && (scs[0].eyes ?? []).map((k) => { const c = center(k); const p = toScr(cam, c.x, c.y); return <Peek key={'l' + k} x={p.x} y={p.y} s={52} f={f} tx={vp.x} ty={vp.y} />; })}
			<div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash}} />
			<Title rows={def.title} />
			{!looping && <Captions lines={L} f={f} />}
			<Audio src={staticFile(tl.audio)} />
		</AbsoluteFill>
	);
};

// ---------------- kit de props estilo referencia ----------------
const popS = (t: number, d: number) => spring({frame: t - d, fps: FPS, config: {damping: 9, stiffness: 300, mass: 0.6}});
export const At: React.FC<{x: number; y: number; children: React.ReactNode; t: number; d: number; rot?: number; out?: number}> = ({x, y, children, t, d, rot = 0, out}) => {
	let p = popS(t, d);
	if (t < d) return null;
	if (out !== undefined) { if (t >= out + 8) return null; if (t >= out) p *= 1 - (t - out) / 8; }
	return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${Math.max(0, p)}) rotate(${rot}deg)`}}>{children}</div>;
};
// fila de iconos que aparecen uno a uno; los de índice >= darkFrom se apagan en darkAt
export const IconRow: React.FC<{t: number; d: number; n: number; y: number; icon: (i: number, dark: boolean) => React.ReactNode; gap?: number; step?: number; darkFrom?: number; darkAt?: number; w?: number}> = ({t, d, n, y, icon, gap = 140, step = 7, darkFrom = 99, darkAt = 1e9, w = 120}) => (
	<>{Array.from({length: n}, (_, q) => { const x = 540 + (q - (n - 1) / 2) * gap; const dk = q >= darkFrom && t >= darkAt + (q - darkFrom) * 4; return <At key={q} x={x} y={y} t={t} d={d + q * step}><div style={{width: w, display: 'flex', justifyContent: 'center', filter: dk ? 'grayscale(1) brightness(0.45)' : undefined, transition: 'none'}}>{icon(q, dk)}</div></At>; })}</>
);
export const BigNum: React.FC<{t: number; d: number; y: number; children: React.ReactNode; size?: number; c?: string}> = ({t, d, y, children, size = 170, c = YL}) => (
	<At x={540} y={y} t={t} d={d}><TX size={size} c={c} sw={0.11}>{children}</TX></At>
);
export const Tag: React.FC<{t: number; d: number; x: number; y: number; text: string; c?: string; size?: number; rot?: number}> = ({t, d, x, y, text, c = RD, size = 54, rot = -4}) => (
	<At x={x} y={y} t={t} d={d} rot={rot}><span style={{fontFamily: LILITA, fontSize: size, color: c, WebkitTextStroke: `${size * 0.32}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.08}px 0 ${INK}`, whiteSpace: 'nowrap'}}><span style={{WebkitTextStroke: `${size * 0.16}px #fff`, paintOrder: 'stroke fill'}}>{text}</span></span></At>
);
// "JA JA JA" rojo saltando encima de la bola
export const Laugh: React.FC<{t: number; d: number; y?: number; n?: number}> = ({t, d, y = 600, n = 3}) => (
	<>{Array.from({length: n}, (_, q) => <div key={q} style={{position: 'absolute', left: 540 + (q - (n - 1) / 2) * 120 - 50, top: y + Math.sin((t + q * 9) / 5) * 10 - (q === 1 ? 14 : 0)}}><Tag t={t} d={d + q * 5} x={50} y={0} text="JA" size={78} rot={(q - 1) * 8} /></div>)}</>
);
export const Bubble2: React.FC<{t: number; d: number; x: number; y: number; text: string; size?: number; think?: boolean}> = ({t, d, x, y, text, size = 46, think}) => (
	<At x={x} y={y} t={t} d={d}><div style={{position: 'relative', background: '#fff', border: `6px solid ${INK}`, borderRadius: 26, padding: '10px 22px', boxShadow: `0 6px 0 ${INK}`}}>
		<span style={{fontFamily: LILITA, fontSize: size, color: INK, whiteSpace: 'nowrap'}}>{text}</span>
		{think ? <><div style={{position: 'absolute', left: '42%', bottom: -30, width: 22, height: 22, borderRadius: '50%', background: '#fff', border: `5px solid ${INK}`}} /><div style={{position: 'absolute', left: '36%', bottom: -54, width: 13, height: 13, borderRadius: '50%', background: '#fff', border: `4px solid ${INK}`}} /></>
			: <svg width={40} height={34} viewBox="0 0 40 34" style={{position: 'absolute', left: '40%', bottom: -30}}><path d="M2 0 L20 30 L34 0" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><rect x={4} y={-6} width={28} height={8} fill="#fff" /></svg>}
	</div></At>
);
// marcador compacto (bandera bola pequeña + resultado) estilo cartel crema
export const Score: React.FC<{t: number; d: number; y: number; a: string; b: string; sc: string; label: string; greyA?: boolean; greyB?: boolean; out?: number}> = ({t, d, y, a, b, sc, label, greyA, greyB, out}) => {
	const fl = (k: string, g?: boolean) => <div style={{width: 74, height: 74, borderRadius: '50%', overflow: 'hidden', boxShadow: `0 0 0 4px ${CREAM}, 0 0 0 8px ${INK}`, filter: g ? 'grayscale(1) brightness(0.55)' : undefined}}><img src={staticFile(`flags/${FL[k] ?? k.toLowerCase()}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>;
	return <At x={540} y={y} t={t} d={d} out={out}><div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transform: 'scale(1.3)'}}>
		<div style={{background: INK, borderRadius: 12, padding: '4px 14px'}}><span style={{fontFamily: LILITA, fontSize: 30, color: '#fff', whiteSpace: 'nowrap', letterSpacing: 1}}>{label}</span></div>
		<div style={{display: 'flex', alignItems: 'center', gap: 18, background: CREAM, border: `6px solid ${INK}`, borderRadius: 22, padding: '8px 22px', boxShadow: `0 7px 0 ${INK}`}}>
			{fl(a, greyA)}<span style={{fontFamily: LILITA, fontSize: 70, color: INK}}>{sc}</span>{fl(b, greyB)}
		</div>
	</div></At>;
};

// icono al lado de la bola (derecha) y texto pequeño bajo un icono
export const Side: React.FC<{t: number; d: number; children: React.ReactNode; left?: boolean; y?: number}> = ({t, d, children, left, y = 830}) => <At x={left ? 210 : 870} y={y} t={t} d={d} rot={left ? -8 : 8}>{children}</At>;
export const Cap: React.FC<{children: React.ReactNode; size?: number; c?: string}> = ({children, size = 40, c = '#fff'}) => <span style={{fontFamily: LILITA, fontSize: size, color: c, WebkitTextStroke: `${size * 0.26}px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{children}</span>;
export const Col: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>{children}</div>;
