import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {bboxOf} from '../v5/WorldLayer5';
import {Fonts} from '../fonts';
import {Atlas, Face12, FaceMood, Fill, INK} from '../v12/Atlas';
import {CountryFace, FLAG, SH, SW, Spark} from './kit';

// Text-free vertical thumbnails for the Shorts (1080x1920)
const VIG = 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(4,10,26,0) 30%, rgba(4,10,26,0.25) 60%, rgba(4,10,26,0.6) 85%, rgba(4,10,26,0.8) 100%)';
const camOf = (ks: string[], fw = 900, fh = 1500, dx = 0, dy = 0) => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of ks) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	const z = Math.min(fw / (x1 - x0), fh / (y1 - y0));
	return {x: (x0 + x1) / 2 + dx / z, y: (y0 + y1) / 2 + dy / z, z};
};
const Bg: React.FC<{ks: string[]; fills: Record<string, Fill>; fw?: number; fh?: number; dx?: number; dy?: number}> = ({ks, fills, fw, fh, dx, dy}) => (
	<>
		<Atlas cam={camOf(ks, fw, fh, dx, dy)} fills={fills} W={SW} H={SH} dark={0.12} />
		<AbsoluteFill style={{background: VIG}} />
	</>
);
// lightning clash badge (no text)
const Clash: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 300}) => (
	<svg width={s} height={s} viewBox="-100 -100 200 200" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, overflow: 'visible'}}>
		<path d="M0 -92 L22 -40 L80 -62 L48 -10 L96 14 L40 26 L58 86 L8 46 L-34 92 L-30 36 L-92 40 L-48 0 L-90 -44 L-30 -30 L-40 -88 Z" fill="#FFD23F" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
		<path d="M14 -60 L-26 6 L2 6 L-16 62 L30 -10 L4 -10 Z" fill="#E8394A" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
	</svg>
);
// big red question badge
const Mystery: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 260}) => (
	<svg width={s} height={s} viewBox="-100 -100 200 200" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, overflow: 'visible', transform: 'rotate(10deg)'}}>
		<circle r={88} fill="#E8394A" stroke={INK} strokeWidth={10} />
		<path d="M-32 -26 Q-32 -64 0 -64 Q34 -64 34 -32 Q34 -8 8 4 Q0 10 0 26" fill="none" stroke="#fff" strokeWidth={24} strokeLinecap="round" />
		<circle cy={54} r={14} fill="#fff" />
	</svg>
);
const Cross: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 200}) => (
	<svg width={s} height={s} viewBox="-100 -100 200 200" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, overflow: 'visible', transform: 'rotate(-8deg)'}}>
		<circle r={88} fill="#E8394A" stroke={INK} strokeWidth={10} />
		<path d="M-40 -40 L40 40 M40 -40 L-40 40" stroke="#fff" strokeWidth={26} strokeLinecap="round" />
	</svg>
);
// round flag badge with face (for tiny countries)
const FlagFace: React.FC<{k: string; x: number; y: number; s: number; mood: FaceMood; rot?: number}> = ({k, x, y, s, mood, rot = 0}) => (
	<div style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, transform: `rotate(${rot}deg)`}}>
		<div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', border: `${s * 0.03}px solid #fff`, boxShadow: `0 0 0 ${s * 0.025}px ${INK}, 0 ${s * 0.04}px 0 ${s * 0.03}px rgba(0,0,0,0.35)`}}>
			<img src={staticFile(`flags/${FLAG[k]}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
		</div>
		<svg width={s * 0.8} height={s * 0.8} viewBox="0 0 200 200" style={{position: 'absolute', left: s * 0.1, top: s * 0.12, overflow: 'visible'}}><Face12 mood={mood} /></svg>
	</div>
);
const Ball: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = 0}) => (
	<svg width={s} height={s} viewBox="-100 -100 200 200" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
		<circle r={90} fill="#fff" stroke={INK} strokeWidth={10} />
		<path d="M0 -30 L29 -9 L18 25 L-18 25 L-29 -9 Z" fill={INK} />
		{[0, 72, 144, 216, 288].map((a) => <g key={a} transform={`rotate(${a})`}><path d="M0 -30 L0 -58" stroke={INK} strokeWidth={7} /><path d="M-22 -86 L0 -58 L22 -86 Q0 -94 -22 -86Z" fill={INK} /></g>)}
	</svg>
);
const Wrap: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: '#2A72BA'}}><Fonts />{children}</AbsoluteFill>;

export const TS1: React.FC = () => (
	<Wrap>
		<Bg ks={['BRA', 'NOR']} fills={{}} fw={1400} fh={1900} />
		<CountryFace k="NOR" x={760} y={560} w={420} mood="smug" look={[-0.5, 0.4]} rot={6} />
		<Mystery x={300} y={360} s={230} />
		<CountryFace k="BRA" x={480} y={1290} w={760} mood="panic" look={[0.5, -0.5]} rot={-5} />
		<Spark x={140} y={900} s={80} f={20} /><Spark x={960} y={1050} s={64} f={60} />
	</Wrap>
);
const DuelT: React.FC<{a: string; b: string; aw: number; bw: number; ma: FaceMood; mb: FaceMood; ball?: boolean}> = ({a, b, aw, bw, ma, mb, ball}) => (
	<Wrap>
		<Bg ks={[a, b]} fills={{}} />
		<CountryFace k={a} x={a === 'ARG' ? 300 : 420} y={a === 'ARG' ? 1240 : 640} w={aw} mood={ma} look={[0.6, a === 'ARG' ? -0.5 : 0.5]} rot={-6} />
		<CountryFace k={b} x={b === 'PRT' ? 820 : 700} y={b === 'PRT' ? 1300 : 650} w={bw} mood={mb} look={[-0.6, b === 'BRA' ? 0.5 : -0.4]} rot={6} />
		<Clash x={a === 'ARG' ? 640 : 600} y={a === 'ARG' ? 1080 : 1060} s={300} />
		{ball && <Ball x={220} y={300} s={200} rot={-15} />}
		<Spark x={150} y={1700} s={80} f={20} /><Spark x={960} y={260} s={70} f={60} />
	</Wrap>
);
export const TS2: React.FC = () => <DuelT a="ARG" b="BRA" aw={380} bw={720} ma="angry" mb="angry" />;
export const TS3: React.FC = () => <DuelT a="ARG" b="BRA" aw={380} bw={720} ma="smug" mb="shock" ball />;
export const TS4: React.FC = () => (
	<Wrap>
		<Bg ks={['ESP', 'CPV', 'MAR']} fills={{}} fw={1100} fh={1700} />
		<FlagFace k="CPV" x={720} y={520} s={440} mood="smug" rot={6} />
		<Cross x={330} y={330} s={210} />
		<CountryFace k="ESP" x={470} y={1300} w={760} mood="shock" look={[0.5, -0.6]} rot={-5} />
		<Spark x={140} y={900} s={80} f={20} /><Spark x={960} y={980} s={64} f={60} />
	</Wrap>
);
export const TS5: React.FC = () => <DuelT a="ESP" b="PRT" aw={720} bw={330} ma="angry" mb="angry" />;
export const TS6: React.FC = () => (
	<Wrap>
		<Bg ks={['MEX', 'ESP']} fills={{}} fw={1500} fh={1800} />
		<CountryFace k="ESP" x={700} y={560} w={560} mood="smug" look={[-0.5, 0.5]} rot={6} />
		<Mystery x={250} y={330} s={220} />
		<CountryFace k="MEX" x={500} y={1320} w={800} mood="sad" look={[0.5, -0.6]} rot={-5} />
		<Spark x={140} y={960} s={80} f={20} /><Spark x={960} y={1050} s={64} f={60} />
	</Wrap>
);
const RING = ['CHE', 'CRI', 'IRL', 'MAR', 'KOR', 'EGY', 'CAN', 'AUT', 'IRN', 'GRC', 'ISL', 'QAT', 'GHA', 'WLS', 'JAM', 'PAN'];
export const TS7: React.FC = () => {
	const fills: Record<string, Fill> = {ARG: {flag: FLAG.ARG}};
	return (
		<Wrap>
			<Atlas cam={camOf(['CAN', 'ARG', 'IDN', 'ISL'], 1500, 1100)} fills={{...fills, ...Object.fromEntries(['CAN', 'CRI', 'JAM', 'SLV', 'PAN', 'HTI', 'HND', 'GTM', 'TTO', 'NIC', 'CHE', 'IRL', 'BIH', 'AUT', 'ISL', 'GRC', 'SVN', 'LTU', 'EST', 'BLR', 'ALB', 'MAR', 'EGY', 'DZA', 'CIV', 'AGO', 'ZMB', 'TUN', 'MRT', 'LBY', 'GHA', 'BFA', 'BEN', 'KOR', 'QAT', 'IRN', 'JOR', 'IRQ', 'IND', 'IDN', 'ARE'].map((k) => [k, {color: '#E8394A'}]))}} W={SW} H={SH} dark={0.15} />
			<AbsoluteFill style={{background: VIG}} />
			{RING.map((k, i) => {
				const a = (i / RING.length) * Math.PI * 2 - Math.PI / 2;
				return <FlagFace key={k} k={k} x={540 + Math.cos(a) * 420} y={960 + Math.sin(a) * 700} s={170} mood={i % 3 === 0 ? 'panic' : 'scared'} rot={(i % 2 ? 1 : -1) * 8} />;
			})}
			<CountryFace k="ARG" x={540} y={960} w={440} mood="cool" look={[0, 0.2]} rot={-4} />
		</Wrap>
	);
};

// ---------------- batch 2
const NeverT: React.FC<{hero: string; feat: string; hw: number; fw: number; flagFace?: boolean}> = ({hero, feat, hw, fw, flagFace}) => (
	<Wrap>
		<Bg ks={[hero, feat]} fills={{}} fw={1500} fh={1800} />
		{flagFace ? <FlagFace k={feat} x={720} y={540} s={440} mood="smug" rot={6} /> : <CountryFace k={feat} x={700} y={560} w={fw} mood="smug" look={[-0.5, 0.5]} rot={6} />}
		<Mystery x={250} y={330} s={220} />
		<CountryFace k={hero} x={500} y={1320} w={hw} mood="panic" look={[0.5, -0.6]} rot={-5} />
		<Spark x={140} y={960} s={80} f={20} /><Spark x={960} y={1050} s={64} f={60} />
	</Wrap>
);
const DuelV: React.FC<{a: string; b: string; aw: number; bw: number; ma: FaceMood; mb: FaceMood}> = ({a, b, aw, bw, ma, mb}) => (
	<Wrap>
		<Bg ks={[a, b]} fills={{}} />
		<CountryFace k={a} x={470} y={560} w={aw} mood={ma} look={[0.4, 0.6]} rot={-6} />
		<CountryFace k={b} x={610} y={1360} w={bw} mood={mb} look={[-0.4, -0.6]} rot={6} />
		<Clash x={540} y={960} s={300} />
		<Spark x={150} y={1700} s={80} f={20} /><Spark x={960} y={260} s={70} f={60} />
	</Wrap>
);
export const TS8: React.FC = () => <NeverT hero="URY" feat="ESP" hw={620} fw={600} />;
export const TS9: React.FC = () => <NeverT hero="ARG" feat="CMR" hw={460} fw={520} />;
export const TS10: React.FC = () => <DuelV a="URY" b="ARG" aw={560} bw={420} ma="angry" mb="angry" />;
export const TS11: React.FC = () => <DuelV a="BRA" b="URY" aw={700} bw={560} ma="shock" mb="smug" />;
export const TS12: React.FC = () => <DuelV a="ESP" b="ITA" aw={700} bw={520} ma="angry" mb="angry" />;
export const TS13: React.FC = () => <DuelV a="ESP" b="NLD" aw={700} bw={560} ma="smug" mb="angry" />;
export const TS14: React.FC = () => <DuelV a="ESP" b="FRA" aw={700} bw={640} ma="cool" mb="shock" />;
export const TS15: React.FC = () => <DuelV a="ARG" b="ENG" aw={420} bw={600} ma="smug" mb="angry" />;
