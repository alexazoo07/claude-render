// Miniaturas "1916 vs 2024" (formato año contra año) para Todos los campeones de la Copa América
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Fonts, LILITA} from '../fonts';
import {Map, Sticker} from '../v21/Thumbs21b';
import {FaceMood, INK} from '../v21/Atlas21';
import {Cup, Sparkles} from '../v22/Thumbs22b';

const rnd = (s: number) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
type Cam = {x: number; y: number; z: number};
const camFor = (cx: number, cy: number, sx: number, sy: number, z: number): Cam => ({x: cx - (sx - 960) / z, y: cy - (sy - 540) / z, z});
const CLIP_L = 'polygon(0 0, 1010px 0, 930px 470px, 1000px 480px, 880px 1080px, 0 1080px)';
const CLIP_R = 'polygon(1010px 0, 1920px 0, 1920px 1080px, 880px 1080px, 1000px 480px, 930px 470px)';

// big year with thick dark outline (our Lilita style, thin-ish stroke)
const Year: React.FC<{t: string; x: number; c?: string; size?: number}> = ({t, x, c = '#FFFFFF', size = 190}) => (
	<div style={{position: 'absolute', left: x, top: 108, transform: 'translate(-50%,-50%)', fontFamily: LILITA, fontSize: size, lineHeight: 1, color: c, WebkitTextStroke: `${size * 0.1}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.05}px 0 ${INK}, 0 ${size * 0.09}px 0 ${INK}, 0 0 30px rgba(0,0,0,0.35)`, letterSpacing: 4}}>{t}</div>
);
const Rain: React.FC<{seed?: number}> = ({seed = 2}) => {
	const r = rnd(seed * 77 + 1);
	return <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>{Array.from({length: 170}, (_, i) => { const x = r() * 1100, y = r() * 1080, l = 22 + r() * 30; return <line key={i} x1={x} y1={y} x2={x - l * 0.35} y2={y + l} stroke="#E6ECF2" strokeWidth={2.2} opacity={0.35 + r() * 0.3} strokeLinecap="round" />; })}</svg>;
};
const Firework: React.FC<{x: number; y: number; r: number; c: string; n?: number}> = ({x, y, r, c, n = 18}) => (
	<svg width={r * 2.4} height={r * 2.4} viewBox={`${-r * 1.2} ${-r * 1.2} ${r * 2.4} ${r * 2.4}`} style={{position: 'absolute', left: x - r * 1.2, top: y - r * 1.2, overflow: 'visible', filter: `drop-shadow(0 0 10px ${c})`}}>
		{Array.from({length: n}, (_, i) => { const a = (i / n) * Math.PI * 2, x1 = Math.cos(a) * r * 0.25, y1 = Math.sin(a) * r * 0.25, x2 = Math.cos(a) * r, y2 = Math.sin(a) * r; return <g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={9} strokeLinecap="round" /><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={5} strokeLinecap="round" /><circle cx={x2 * 1.1} cy={y2 * 1.1} r={6} fill="#fff" stroke={INK} strokeWidth={2.5} /></g>; })}
		<circle r={r * 0.12} fill="#fff" stroke={INK} strokeWidth={3} />
	</svg>
);
// old leather ball (1916)
const OldBall: React.FC<{x: number; y: number; d: number}> = ({x, y, d}) => (
	<svg width={d} height={d} viewBox="-110 -110 220 220" style={{position: 'absolute', left: x - d / 2, top: y - d / 2, overflow: 'visible', filter: 'drop-shadow(0 10px 0 rgba(0,0,0,0.45))'}}>
		<defs><radialGradient id="lb" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#C9874A" /><stop offset="0.6" stopColor="#8A4D22" /><stop offset="1" stopColor="#4A2610" /></radialGradient></defs>
		<circle r={100} fill="url(#lb)" stroke={INK} strokeWidth={8} />
		<path d="M-96 -20 C-40 -40 40 -40 96 -20 M-90 38 C-30 18 30 18 90 38 M-20 -98 C-40 -30 -40 30 -22 98 M24 -98 C44 -30 44 30 26 98" fill="none" stroke={INK} strokeWidth={5} opacity={0.75} />
		{[-22, -10, 2, 14].map((dy) => <line key={dy} x1={-14} y1={dy - 40} x2={14} y2={dy - 40} stroke="#F3E1C0" strokeWidth={5} strokeLinecap="round" />)}
		<path d="M0 -70 L0 -20" stroke="#F3E1C0" strokeWidth={4} />
		<ellipse cx={-38} cy={-46} rx={22} ry={12} fill="#fff" opacity={0.25} transform="rotate(-30 -38 -46)" />
	</svg>
);
const OldCup: React.FC<{x: number; y: number; h: number; rot?: number}> = ({x, y, h, rot}) => <div style={{position: 'absolute', inset: 0, filter: 'sepia(0.7) saturate(0.8) brightness(0.92)'}}><Cup x={x} y={y} h={h} rot={rot} /></div>;
const Bolt: React.FC = () => (
	<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
		<path d="M1050 0 L970 460 L1040 472 L915 1080 L845 1080 L960 488 L890 476 L970 0 Z" fill="#fff" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
	</svg>
);

const URY_C = [1352, 1402], ARG_C = [1281, 1472], COL_C = [1139, 950];
type P = {lMood?: FaceMood; rMood?: FaceMood; rK?: string; rC?: number[]; lZ?: number; rZ?: number; rW?: number; lW?: number; colombia?: boolean; gold?: boolean; banner?: boolean; yR?: string};
const Split: React.FC<P> = ({lMood = 'worried', rMood = 'love', rK = 'ARG', rC = ARG_C, lZ = 4, rZ = 1.6, rW = 340, lW = 470, colombia, gold, banner, yR = '2024'}) => {
	const lCam = camFor(URY_C[0], URY_C[1], 440, 600, lZ);
	const rCam = camFor(rC[0], rC[1], rK === 'ARG' ? 1420 : 1440, 640, rZ);
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			{/* 1916: mapa viejo, gris y con lluvia */}
			<div style={{position: 'absolute', inset: 0, clipPath: CLIP_L}}>
				<div style={{position: 'absolute', inset: 0, filter: 'grayscale(0.85) sepia(0.2) brightness(1.08) contrast(0.95)'}}><Map cam={lCam} mood="worried" dark={0.3} faces={false} grey={() => true} /></div>
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(60,64,72,0.45), rgba(60,64,72,0.1))'}} />
				<Rain />
				<div style={{position: 'absolute', inset: 0, filter: 'saturate(0.55) brightness(0.95)'}}><Sticker k="URY" w={lW} x={440} y={600} mood={lMood} look={[0.3, 0.1]} /></div>
				<OldCup x={150} y={600} h={300} rot={-8} />
				<OldBall x={700} y={860} d={180} />
			</div>
			{/* 2024: mapa a color con fuegos artificiales */}
			<div style={{position: 'absolute', inset: 0, clipPath: CLIP_R}}>
				<div style={{position: 'absolute', inset: 0, filter: 'saturate(1.25) brightness(1.05)'}}><Map cam={rCam} mood="happy" dark={0.15} faces={false} /></div>
				<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 75% 55%, rgba(255,240,180,0.25), rgba(0,0,0,0) 60%)'}} />
				<Firework x={1180} y={300} r={95} c="#FF5FD2" /><Firework x={1470} y={250} r={85} c="#5EF0E6" n={16} /><Firework x={1760} y={310} r={95} c="#FFD23F" />
				{colombia && <div style={{position: 'absolute', inset: 0, filter: 'saturate(0.9)'}}><Sticker k="COL" w={210} x={1150} y={760} mood="sad" look={[0.6, -0.2]} /></div>}
				<div style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 0 18px rgba(255,230,140,0.9))'}}><Sticker k={rK} w={rW} x={rK === 'ARG' ? 1420 : 1440} y={rK === 'ARG' ? 660 : 640} mood={rMood} look={[0.2, 0]} face={rK === 'ARG' ? 1.0 : 0.62} fdy={rK === 'ARG' ? -0.17 : 0} /></div>
				<Cup x={1740} y={720} h={330} rot={8} />
				<Sparkles seed={6} n={18} box={[1000, 380, 920, 680]} />
			</div>
			<Bolt />
			<Year t="1916" x={470} />
			<Year t={yR} x={1440} c={gold ? '#FFD23F' : '#FFFFFF'} />
			{banner && (
				<div style={{position: 'absolute', left: 960, top: 1010, transform: 'translate(-50%,-50%) rotate(-2deg)', background: '#FFD23F', border: `7px solid ${INK}`, borderRadius: 18, padding: '6px 34px', boxShadow: `0 8px 0 ${INK}`}}>
					<span style={{fontFamily: LILITA, fontSize: 64, color: INK}}>COPA AMÉRICA</span>
				</div>
			)}
		</AbsoluteFill>
	);
};
export const T25f: React.FC = () => <Split />;
export const T25g: React.FC = () => <Split rMood="happy" gold />;
export const T25h: React.FC = () => <Split rMood="love" colombia gold />;
export const T25i: React.FC = () => <Split lMood="smug" rMood="cool" banner />;
export const T25j: React.FC = () => <Split lMood="worried" rMood="love" lW={540} rW={370} gold banner />;
