// Miniaturas lote nov-2026: vídeos 29-35 (estilo detallado, contorno fino, sin interrogantes sueltos)
import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Fonts, LILITA} from '../fonts';
import {WORLD} from '../v5/WorldLayer5';
import {Map, mainBox, Sticker} from '../v21/Thumbs21b';
import {StickerX, XM} from '../v21/Thumbs21c';
import {TT, Vig, Sparkles, Cup} from '../v22/Thumbs22b';
import {INK, Face12, FaceMood} from '../v21/Atlas21';
import F3 from '../iso3flag.json';
const YEL = '#FFD23F', RED = '#FF3B3B', SW = 0.1;
type Cam = {x: number; y: number; z: number};
const proj = (k: string, c: Cam) => { const [x0, y0, x1, y1] = mainBox(k); return {x: ((x0 + x1) / 2 - c.x) * c.z + 960, y: ((y0 + y1) / 2 - c.y) * c.z + 540, w: (x1 - x0) * c.z, h: (y1 - y0) * c.z}; };
const rnd = (s: number) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };

// dashed white "ghost" outline + inner haze for the disappearing countries
const Ghosts: React.FC<{keys: string[]; cam: Cam}> = ({keys, cam}) => (
	<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
		<defs><pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="14" height="14" fill="rgba(0,0,0,0)" /><rect width="5" height="14" fill="rgba(255,255,255,0.18)" /></pattern></defs>
		<g transform={`translate(960 540) scale(${cam.z}) translate(${-cam.x} ${-cam.y})`}>
			{keys.filter((k) => WORLD[k]).map((k) => (
				<g key={k}>
					<path d={WORLD[k].d} fill="url(#hatch)" />
					<path d={WORLD[k].d} fill="none" stroke="#fff" strokeWidth={4 / cam.z} strokeDasharray={`${14 / cam.z} ${10 / cam.z}`} strokeLinejoin="round" opacity={0.95} />
				</g>
			))}
		</g>
	</svg>
);
// Thanos-like dust flying off a box toward the upper right
const Dust: React.FC<{x: number; y: number; w: number; h: number; n?: number; seed?: number; col?: string; dx?: number}> = ({x, y, w, h, n = 90, seed = 3, col = '#C9CED6', dx = 1}) => {
	const r = rnd(seed * 999 + 7);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			{Array.from({length: n}, (_, i) => {
				const t = r();
				const px = x + (r() - 0.3) * w * 0.8 + dx * t * w * 0.9, py = y + (r() - 0.5) * h * 0.8 - t * h * 0.7;
				const s = 4 + r() * 13 * (1 - t * 0.6);
				return <rect key={i} x={px} y={py} width={s} height={s} rx={s * 0.25} fill={i % 5 === 0 ? '#8C929B' : col} stroke={INK} strokeWidth={1.5} opacity={1 - t * 0.75} transform={`rotate(${r() * 90} ${px} ${py})`} />;
			})}
		</svg>
	);
};
const Glow: React.FC<{c: string; children: React.ReactNode; s?: number}> = ({c, children, s = 1}) => (
	<div style={{position: 'absolute', inset: 0, filter: `drop-shadow(0 0 ${10 * s}px ${c}) drop-shadow(0 0 ${28 * s}px ${c})`}}>{children}</div>
);
const St: React.FC<{k: string; w: number; x: number; y: number; m: XM; glow?: string; look?: [number, number]; rot?: number; ghost?: boolean}> = ({k, w, x, y, m, glow, look = [0, 0.1], rot, ghost}) => {
	const s = <StickerX k={k} w={w} x={x} y={y} m={m} look={look} rot={rot} />;
	if (ghost) return <div style={{position: 'absolute', inset: 0, filter: 'grayscale(1) brightness(1.05) drop-shadow(0 0 14px rgba(255,255,255,0.8))', opacity: 0.92}}>{s}</div>;
	return <div style={{position: 'absolute', inset: 0}}>{glow ? <Glow c={glow}>{s}</Glow> : s}</div>;
};
// little name tag under a country
const Tag: React.FC<{t: string; x: number; y: number; c?: string}> = ({t, x, y, c = '#fff'}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', background: INK, color: c, fontFamily: 'Lilita One, sans-serif', fontSize: 30, padding: '3px 14px', borderRadius: 10, border: '3px solid #fff', whiteSpace: 'nowrap'}}>{t}</div>
);
const Base: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: '#2A72BA'}}><Fonts />{children}</AbsoluteFill>;
const Disappear: React.FC<{keys: string[]; cam: Cam; seed?: number}> = ({keys, cam, seed = 1}) => (
	<>
		<Ghosts keys={keys} cam={cam} />
		{keys.map((k, i) => { const p = proj(k, cam); return p.x > -200 && p.x < 2100 && p.y > -200 && p.y < 1300 ? <Dust key={k} x={p.x} y={p.y} w={Math.max(p.w, 160)} h={Math.max(p.h, 120)} n={Math.min(140, 40 + p.w * 0.25)} seed={seed + i} /> : null; })}
	</>
);


const FLG = (k: string) => ({...(F3 as Record<string, string>), ENG: 'gb-eng', SCT: 'gb-sct'} as Record<string, string>)[k];
const Ball: React.FC<{k: string; d: number; x: number; y: number; mood: FaceMood; look?: [number, number]; rot?: number}> = ({k, d, x, y, mood, look, rot = 0}) => (
	<div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, transform: `rotate(${rot}deg)`}}>
		<div style={{position: 'absolute', inset: 0, borderRadius: '50%', transform: `translate(${d * 0.02}px, ${d * 0.06}px)`, background: 'rgba(0,0,0,0.45)'}} />
		<div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', border: `${d * 0.045}px solid #fff`, boxShadow: `0 0 0 ${d * 0.025}px ${INK}`}}>
			<img src={staticFile(`flags/${FLG(k)}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), rgba(255,255,255,0) 35%), radial-gradient(circle at 60% 70%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.3) 100%)'}} />
		</div>
		<svg width={d * 0.72} height={d * 0.72} viewBox="0 0 200 200" style={{position: 'absolute', left: d * 0.14, top: d * 0.15}}><Face12 mood={mood} look={look} /></svg>
	</div>
);
// fit a sticker in a box
const fitW = (k: string, mw: number, mh: number) => { const [x0, y0, x1, y1] = mainBox(k); return Math.min(mw, (mh * (x1 - x0)) / (y1 - y0)); };
const Hero: React.FC<{k: string; x: number; y: number; mw: number; mh: number; mood?: FaceMood; m?: XM; rot?: number; face?: number; glow?: string; look?: [number, number]; ghost?: boolean}> = ({k, x, y, mw, mh, mood = 'angry', m, rot = -3, face, glow, look, ghost}) => {
	const w = fitW(k, mw, mh);
	const [x0, y0, x1, y1] = mainBox(k);
	const narrow = (x1 - x0) / (y1 - y0) < 0.35;
	const fc = face ?? (narrow ? 3.4 : 0.66);
	const s = m ? <StickerX k={k} w={w} x={x} y={y} m={m} rot={rot} face={fc} look={look} /> : <Sticker k={k} w={w} x={x} y={y} mood={mood} rot={rot} face={fc} look={look} />;
	if (ghost) return <div style={{position: 'absolute', inset: 0, filter: 'grayscale(1) brightness(1.08) drop-shadow(0 0 16px rgba(255,255,255,0.85))', opacity: 0.9}}>{s}</div>;
	return <div style={{position: 'absolute', inset: 0, filter: glow ? `drop-shadow(0 0 12px ${glow}) drop-shadow(0 0 30px ${glow})` : undefined}}>{s}</div>;
};
const camOn = (keys: string[], z: number, dx = 0, dy = 0): Cam => {
	let a = 1e9, b = 1e9, c = -1e9, d = -1e9;
	for (const k of keys) { const [x0, y0, x1, y1] = mainBox(k); a = Math.min(a, x0); b = Math.min(b, y0); c = Math.max(c, x1); d = Math.max(d, y1); }
	return {x: (a + c) / 2 + dx, y: (b + d) / 2 + dy, z};
};
const BigNum: React.FC<{n: string; sub: string; x: number; y: number; col?: string}> = ({n, sub, x, y, col = RED}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%) rotate(-4deg)', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<TT parts={[[n, col]]} size={300} sw={SW} style={{position: 'relative', top: 0}} />
		<TT parts={[[sub]]} size={80} sw={SW} style={{position: 'relative', top: 0, marginTop: -20}} />
	</div>
);
const VS: React.FC<{x: number; y: number}> = ({x, y}) => <div style={{position: 'absolute', left: x - 110, top: y - 110, width: 220, height: 220, borderRadius: '50%', background: YEL, border: `10px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)', boxShadow: '0 10px 0 rgba(0,0,0,0.4)', fontFamily: LILITA, fontSize: 110, color: INK}}>VS</div>;

// ======================= NUNCA HA GANADO (29 COL · 30 CHL · 31 USA)
type NCfg = {k: string; up: string; n: number; rivals: string[]; nem: string; region: string[]; z: number; heroMW: number; heroMH: number};
const NUN: Record<string, NCfg> = {
	COL: {k: 'COL', up: 'COLOMBIA', n: 13, rivals: ['ENG', 'PRT', 'NLD', 'HRV', 'SWE', 'TUR'], nem: 'ENG', region: ['COL', 'VEN', 'ECU', 'PER', 'BRA'], z: 1.5, heroMW: 640, heroMH: 700},
	CHL: {k: 'CHL', up: 'CHILE', n: 18, rivals: ['PRT', 'NLD', 'BEL', 'SCT', 'GRC', 'MAR'], nem: 'PRT', region: ['CHL', 'ARG', 'PER', 'BOL'], z: 1.15, heroMW: 640, heroMH: 980},
	ECU: {k: 'ECU', up: 'ECUADOR', n: 22, rivals: ['ESP', 'FRA', 'ITA', 'ENG', 'NLD', 'JPN'], nem: 'BRA', region: ['ECU', 'COL', 'PER'], z: 1.6, heroMW: 820, heroMH: 760},
	USA: {k: 'USA', up: 'ESTADOS UNIDOS', n: 12, rivals: ['FRA', 'HRV', 'DNK', 'SRB', 'UKR', 'GRC'], nem: 'FRA', region: ['USA', 'MEX', 'CAN'], z: 0.95, heroMW: 820, heroMH: 560},
};
const NunBase: React.FC<{c: NCfg; children: React.ReactNode; dz?: number; dx?: number}> = ({c, children, dz = 1, dx = 0}) => (
	<Base>
		<Map cam={camOn(c.region, c.z * dz, dx)} mood="scared" dark={0.2} big={[]} />
		<Vig o={0.5} />
		{children}
	</Base>
);
const NunA: React.FC<{c: NCfg}> = ({c}) => (
	<NunBase c={c} dx={-60}>
		<Hero k={c.k} x={560} y={560} mw={c.heroMW} mh={c.heroMH} mood="angry" />
		{c.rivals.slice(0, 3).map((k, i) => <Ball key={k} k={k} d={250 - i * 20} x={1300 + (i % 2) * 260} y={330 + i * 230} mood="smug" look={[-0.6, 0]} rot={(i - 1) * 6} />)}
		<TT parts={[[c.up], [' NUNCA', RED]]} size={c.up.length > 10 ? 112 : 130} sw={SW} style={{top: 18}} />
		<TT parts={[['LE HA GANADO A...']]} size={120} sw={SW} style={{top: 920}} />
	</NunBase>
);
const NunB: React.FC<{c: NCfg}> = ({c}) => (
	<NunBase c={c} dx={-100}>
		<Hero k={c.k} x={520} y={580} mw={c.heroMW * 0.92} mh={c.heroMH * 0.92} m="shock" />
		<BigNum n={String(c.n)} sub="SELECCIONES" x={1380} y={540} />
		<TT parts={[['NUNCA HA GANADO A']]} size={110} sw={SW} style={{top: 18}} />
		<TT parts={[[c.up, YEL]]} size={140} sw={SW} style={{top: 905}} />
	</NunBase>
);
const NunC: React.FC<{c: NCfg}> = ({c}) => (
	<NunBase c={c} dz={0.85}>
		<Hero k={c.k} x={500} y={580} mw={c.heroMW * 0.9} mh={c.heroMH * 0.9} m="cry" rot={-5} />
		<Ball k={c.nem} d={480} x={1430} y={560} mood="smug" look={[-0.6, 0.1]} rot={6} />
		<VS x={960} y={560} />
		<TT parts={[['LA PESADILLA DE']]} size={120} sw={SW} style={{top: 18}} />
		<TT parts={[[c.up, YEL]]} size={150} sw={SW} style={{top: 900}} />
	</NunBase>
);
const NunD: React.FC<{c: NCfg}> = ({c}) => (
	<NunBase c={c} dz={1.1}>
		<Sparkles seed={5} n={14} />
		{c.rivals.map((k, i) => { const a = (i / c.rivals.length) * Math.PI * 2 - Math.PI / 2; return <Ball key={k} k={k} d={190} x={960 + Math.cos(a) * 650} y={560 + Math.sin(a) * 300} mood="smug" look={[-Math.cos(a) * 0.6, -Math.sin(a) * 0.4]} />; })}
		<Hero k={c.k} x={960} y={560} mw={c.heroMW * 0.85} mh={c.heroMH * 0.8} m="rage" rot={0} glow="#FF3B3B" />
		<TT parts={[['SELECCIONES QUE']]} size={110} sw={SW} style={{top: 18}} />
		<TT parts={[['NUNCA HA GANADO '], [c.up, YEL]]} size={c.up.length > 10 ? 92 : 110} sw={SW} style={{top: 930}} />
	</NunBase>
);
const NunE: React.FC<{c: NCfg}> = ({c}) => (
	<NunBase c={c} dx={80}>
		<Hero k={c.k} x={1380} y={570} mw={c.heroMW} mh={c.heroMH} mood="worried" rot={4} />
		<div style={{position: 'absolute', left: 120, top: 250, display: 'grid', gridTemplateColumns: 'repeat(3, 210px)', gap: 30}}>
			{c.rivals.map((k, i) => (
				<div key={k} style={{position: 'relative', width: 210, height: 210}}>
					<Ball k={k} d={190} x={105} y={105} mood="smug" />
					<svg width={210} height={210} style={{position: 'absolute', inset: 0}}><circle cx={105} cy={105} r={98} fill="none" stroke="#E8394A" strokeWidth={14} /><path d="M40 170 L170 40" stroke="#E8394A" strokeWidth={14} /></svg>
				</div>
			))}
		</div>
		<TT parts={[['IMBATIBLES PARA']]} size={116} sw={SW} style={{top: 18}} />
		<TT parts={[[c.up, YEL]]} size={150} sw={SW} style={{top: 900}} />
	</NunBase>
);
const mk = (k: string) => [NunA, NunB, NunC, NunD, NunE].map((C) => () => <C c={NUN[k]} />);
export const [T29a, T29b, T29c, T29d, T29e] = mk('COL');
export const [T30a, T30b, T30c, T30d, T30e] = mk('CHL');
export const [T31a, T31b, T31c, T31d, T31e] = mk('USA');
export const [T37a, T37b, T37c, T37d, T37e] = mk('ECU');

// ======================= 32 · SI ARGENTINA DESAPARECIERA
const SAM: Cam = camOn(['ARG', 'BRA', 'CHL', 'URY'], 1.15, 0, 0);
const ArgBase: React.FC<{children: React.ReactNode; cam?: Cam}> = ({children, cam = SAM}) => (
	<Base>
		<Map cam={cam} mood="shock" dark={0.22} grey={(k) => k === 'ARG'} />
		<Disappear keys={['ARG']} cam={cam} seed={3} />
		<Vig o={0.5} />
		{children}
	</Base>
);
export const T32a: React.FC = () => (
	<ArgBase>
		<Hero k="ARG" x={560} y={560} mw={520} mh={760} m="terror" ghost rot={-4} />
		<Dust x={560} y={560} w={520} h={700} n={160} seed={11} />
		<Ball k="BRA" d={260} x={1420} y={420} mood="happy" look={[-0.6, 0]} />
		<Ball k="URY" d={210} x={1660} y={700} mood="smug" look={[-0.6, 0]} />
		<Ball k="FRA" d={200} x={1250} y={760} mood="love" look={[-0.6, 0]} />
		<TT parts={[['SI ARGENTINA']]} size={130} sw={SW} style={{top: 18}} />
		<TT parts={[['DESAPARECIERA...', RED]]} size={140} sw={SW} style={{top: 900}} />
	</ArgBase>
);
export const T32b: React.FC = () => (
	<ArgBase>
		<Hero k="ARG" x={420} y={600} mw={420} mh={640} m="cry" ghost rot={-6} />
		<Dust x={420} y={600} w={420} h={600} n={120} seed={5} />
		<Cup x={1250} y={540} h={420} rot={-6} />
		<Sparkles seed={8} n={18} box={[900, 250, 900, 600]} />
		<Ball k="FRA" d={230} x={1000} y={400} mood="love" look={[0.6, 0]} />
		<Ball k="DEU" d={230} x={1560} y={420} mood="happy" look={[-0.6, 0]} />
		<Ball k="NLD" d={230} x={1500} y={760} mood="love" look={[-0.6, -0.2]} />
		<TT parts={[['SIN ARGENTINA']]} size={130} sw={SW} style={{top: 18}} />
		<TT parts={[['SERÍAN CAMPEONAS', YEL]]} size={130} sw={SW} style={{top: 905}} />
	</ArgBase>
);
export const T32c: React.FC = () => (
	<ArgBase>
		<Hero k="ARG" x={460} y={600} mw={440} mh={660} m="shock" ghost rot={-3} />
		<Dust x={460} y={600} w={440} h={600} n={130} seed={9} />
		<Hero k="BRA" x={1340} y={540} mw={720} mh={640} mood="love" rot={4} glow="#FFD23F" />
		<Sparkles seed={2} n={16} box={[900, 200, 950, 700]} />
		<TT parts={[['BRASIL TENDRÍA']]} size={120} sw={SW} style={{top: 18}} />
		<TT parts={[['18 COPAS AMÉRICA', YEL]]} size={130} sw={SW} style={{top: 905}} />
	</ArgBase>
);
export const T32d: React.FC = () => {
	const cam: Cam = {x: 1880, y: 860, z: 0.62};
	return (
		<Base>
			<Map cam={cam} mood="shock" dark={0.2} grey={(k) => k === 'ARG'} />
			<Disappear keys={['ARG']} cam={cam} seed={4} />
			<Vig o={0.55} />
			<Hero k="ARG" x={960} y={540} mw={420} mh={640} m="terror" ghost rot={0} />
			<Dust x={960} y={540} w={420} h={600} n={170} seed={14} />
			<TT parts={[['EL FÚTBOL SIN']]} size={130} sw={SW} style={{top: 18}} />
			<TT parts={[['ARGENTINA', '#6CB4EE']]} size={160} sw={SW} style={{top: 890}} />
		</Base>
	);
};
export const T32e: React.FC = () => (
	<ArgBase>
		<Hero k="ARG" x={960} y={560} mw={500} mh={700} m="cry" ghost rot={2} />
		<Dust x={960} y={560} w={500} h={660} n={170} seed={21} />
		<Cup x={330} y={430} h={300} rot={-18} />
		<Cup x={1600} y={420} h={300} rot={16} />
		<Cup x={1560} y={760} h={240} rot={-10} />
		<TT parts={[['ARGENTINA']]} size={140} sw={SW} style={{top: 18}} />
		<TT parts={[['DESAPARECE', RED]]} size={160} sw={SW} style={{top: 890}} />
	</ArgBase>
);

// ======================= 33 · ELIMINANDO LATINOAMÉRICA
const LAT = ['ARG', 'BOL', 'BRA', 'CHL', 'COL', 'CRI', 'CUB', 'DOM', 'ECU', 'SLV', 'GTM', 'HTI', 'HND', 'MEX', 'NIC', 'PAN', 'PRY', 'PER', 'URY', 'VEN'];
const LCAM: Cam = camOn(['MEX', 'BRA', 'ARG', 'CUB'], 0.95, 40, 40);
const LatBase: React.FC<{children: React.ReactNode; gone?: string[]; cam?: Cam}> = ({children, gone = ['VEN', 'BOL', 'MEX', 'PER', 'GTM', 'HND', 'NIC'], cam = LCAM}) => (
	<Base>
		<Map cam={cam} mood="panic" dark={0.25} grey={(k) => !LAT.includes(k) || gone.includes(k)} />
		<Disappear keys={gone} cam={cam} seed={7} />
		<Vig o={0.5} />
		{children}
	</Base>
);
const LatTop: React.FC = () => <TT parts={[['ELIMINANDO']]} size={124} sw={SW} style={{top: 18}} />;
const LatBot: React.FC<{t?: string}> = ({t = 'LATINOAMÉRICA'}) => <TT parts={[[t, YEL]]} size={140} sw={SW} style={{top: 900}} />;
export const T33a: React.FC = () => (
	<LatBase>
		<Hero k="BRA" x={1400} y={520} mw={600} mh={560} m="terror" />
		<Hero k="ARG" x={520} y={600} mw={420} mh={600} m="shock" rot={-6} />
		<LatTop /><LatBot />
	</LatBase>
);
export const T33b: React.FC<{W?: React.FC<any>}> = () => (
	<LatBase gone={[]}>
		<Ball k="MEX" d={230} x={260} y={330} mood="panic" look={[0.6, 0]} />
		<Ball k="BRA" d={260} x={300} y={700} mood="scared" look={[0.6, 0]} />
		<Ball k="ARG" d={250} x={1650} y={350} mood="panic" look={[-0.6, 0]} />
		<Ball k="COL" d={220} x={1660} y={720} mood="scared" look={[-0.6, 0]} />
		<div style={{position: 'absolute', left: 960 - 290, top: 270, width: 580, height: 580, borderRadius: '50%', background: '#1B1D26', border: `12px solid ${INK}`, boxShadow: '0 0 0 14px #FFD23F, 0 18px 0 14px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<TT parts={[['1', YEL]]} size={420} sw={SW} style={{position: 'relative', top: 0}} />
		</div>
		<TT parts={[['SOLO QUEDARÁ']]} size={124} sw={SW} style={{top: 18}} />
		<LatBot t="UNA SELECCIÓN" />
	</LatBase>
);
export const T33c: React.FC = () => (
	<LatBase>
		<div style={{position: 'absolute', left: 230, top: 240, display: 'grid', gridTemplateColumns: 'repeat(5, 270px)', gap: 18}}>
			{LAT.map((k, i) => {
				const out = !['URY', 'BRA', 'ARG', 'COL', 'CHL', 'PRY', 'MEX', 'PER'].includes(k);
				return (
					<div key={k} style={{position: 'relative', width: 270, height: 140}}>
						<img src={staticFile(`flags/${FLG(k)}.svg`)} style={{width: 210, height: 140, objectFit: 'cover', borderRadius: 14, border: `6px solid ${INK}`, filter: out ? 'grayscale(1) brightness(0.6)' : 'none', boxShadow: '0 8px 0 rgba(0,0,0,0.4)', transform: `rotate(${((i * 7) % 5) - 2}deg)`}} />
						{out && <svg width={210} height={140} style={{position: 'absolute', left: 0, top: 0}}><path d="M30 20 L180 120 M180 20 L30 120" stroke={INK} strokeWidth={24} strokeLinecap="round" /><path d="M30 20 L180 120 M180 20 L30 120" stroke="#E8394A" strokeWidth={14} strokeLinecap="round" /></svg>}
					</div>
				);
			})}
		</div>
		<LatTop /><LatBot t="HASTA QUE QUEDE 1" />
	</LatBase>
);
export const T33d: React.FC = () => (
	<LatBase>
		<Hero k="MEX" x={420} y={430} mw={520} mh={380} m="cry" rot={-6} />
		<Hero k="COL" x={1500} y={460} mw={380} mh={440} m="terror" rot={6} />
		<Hero k="CHL" x={950} y={640} mw={300} mh={560} m="shock" rot={-2} />
		<LatTop /><LatBot />
	</LatBase>
);
export const T33e: React.FC = () => (
	<LatBase cam={camOn(['BRA', 'ARG', 'URY', 'PRY'], 1.4, 0, 0)} gone={['BOL', 'PER', 'CHL', 'PRY', 'VEN', 'ECU', 'COL']}>
		<Hero k="BRA" x={520} y={540} mw={620} mh={600} m="terror" rot={-4} />
		<VS x={960} y={560} />
		<Hero k="ARG" x={1400} y={580} mw={400} mh={640} m="rage" rot={5} />
		<TT parts={[['SOLO 1 SOBREVIVE']]} size={124} sw={SW} style={{top: 18}} />
		<LatBot t="LATINOAMÉRICA" />
	</LatBase>
);

// ======================= 34 · DESAPARECE SI NUNCA HA... · 35 · SI SU APODO TIENE...
const DTop: React.FC<{size?: number}> = ({size = 108}) => <TT parts={[['TU SELECCIÓN'], [' DESAPARECE', RED]]} size={size} sw={SW} style={{top: 18}} />;
const DBot: React.FC<{t: string; c?: string}> = ({t, c = YEL}) => <TT parts={[[t, c]]} size={112} sw={SW} style={{top: 920}} />;
const EUc: Cam = {x: 2010, y: 450, z: 2.6};
const Tagx: React.FC<{t: string; x: number; y: number; rot?: number; c?: string}> = ({t, x, y, rot = 0, c = '#fff'}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, background: INK, color: c, fontFamily: LILITA, fontSize: 46, padding: '6px 22px', borderRadius: 14, border: '5px solid #fff', whiteSpace: 'nowrap', boxShadow: '0 8px 0 rgba(0,0,0,0.4)'}}>{t}</div>
);
export const T34a: React.FC = () => (
	<Base>
		<Map cam={EUc} mood="panic" dark={0.2} grey={(k) => ['ENG', 'BEL', 'HRV', 'CHE', 'AUT', 'SWE', 'NOR', 'TUR', 'BIH'].includes(k)} />
		<Disappear keys={['ENG', 'BEL', 'HRV', 'CHE', 'AUT', 'SWE', 'NOR', 'BIH']} cam={EUc} seed={5} />
		<Vig o={0.5} />
		<Hero k="ENG" x={520} y={560} mw={420} mh={560} m="cry" rot={-6} />
		<Hero k="NLD" x={1440} y={560} mw={460} mh={480} m="terror" rot={6} />
		<DTop /><DBot t="SI NUNCA HA..." />
	</Base>
);
export const T34b: React.FC = () => (
	<Base>
		<Map cam={{x: 1880, y: 860, z: 0.62}} mood="panic" dark={0.25} />
		<Vig o={0.55} />
		<Cup x={960} y={560} h={520} rot={0} />
		<Sparkles seed={6} n={20} box={[600, 200, 720, 700]} />
		<Ball k="BRA" d={240} x={330} y={380} mood="panic" look={[0.6, 0]} />
		<Ball k="ENG" d={220} x={420} y={720} mood="sad" look={[0.6, 0]} />
		<Ball k="NLD" d={230} x={1600} y={380} mood="scared" look={[-0.6, 0]} />
		<Ball k="ARG" d={230} x={1520} y={730} mood="panic" look={[-0.6, 0]} />
		<DTop /><DBot t="SI NUNCA HA..." />
	</Base>
);
export const T34c: React.FC = () => (
	<Base>
		<Map cam={camOn(['BRA', 'ARG'], 1.3)} mood="panic" dark={0.2} grey={(k) => ['BRA', 'ARG'].includes(k)} />
		<Disappear keys={['BRA', 'ARG']} cam={camOn(['BRA', 'ARG'], 1.3)} seed={8} />
		<Vig o={0.5} />
		<Hero k="BRA" x={600} y={540} mw={620} mh={600} m="terror" ghost rot={-5} />
		<Tagx t="NUNCA HA GANADO LA EURO" x={1380} y={430} rot={4} c={YEL} />
		<Tagx t="5 MUNDIALES... ¡Y FUERA!" x={1380} y={600} rot={-3} />
		<DTop /><DBot t="SI NUNCA HA..." />
	</Base>
);
export const T34d: React.FC = () => (
	<Base>
		<Map cam={EUc} mood="shock" dark={0.22} />
		<Vig o={0.5} />
		<Hero k="ENG" x={420} y={570} mw={380} mh={520} m="cry" rot={-6} />
		<Hero k="DEU" x={1000} y={560} mw={420} mh={520} m="shock" rot={2} />
		<Hero k="FRA" x={1520} y={590} mw={460} mh={480} m="terror" rot={6} />
		<DTop /><DBot t="SI NUNCA HA..." />
	</Base>
);
export const T34e: React.FC = () => (
	<Base>
		<Map cam={{x: 1880, y: 860, z: 0.62}} mood="panic" dark={0.3} grey={(k) => ['USA', 'MEX', 'BRA', 'AUS', 'JPN', 'CAN', 'SAU', 'IRN', 'DZA', 'EGY'].includes(k)} />
		<Disappear keys={['USA', 'MEX', 'BRA', 'AUS', 'JPN', 'CAN', 'SAU', 'IRN', 'DZA', 'EGY']} cam={{x: 1880, y: 860, z: 0.62}} seed={12} />
		<Vig o={0.55} />
		<BigNum n="47" sub="DESAPARECEN" x={960} y={520} />
		<DTop /><DBot t="SI NUNCA HA..." />
	</Base>
);
export const T35a: React.FC = () => (
	<Base>
		<Map cam={EUc} mood="panic" dark={0.2} grey={(k) => ['ENG', 'ESP', 'FRA', 'BEL', 'NLD'].includes(k)} />
		<Disappear keys={['ENG', 'ESP', 'FRA', 'BEL', 'NLD']} cam={EUc} seed={4} />
		<Vig o={0.5} />
		<Hero k="ENG" x={440} y={520} mw={380} mh={500} m="cry" rot={-6} />
		<Hero k="ESP" x={1420} y={580} mw={560} mh={480} m="terror" rot={5} />
		<Tagx t="THREE LIONS" x={440} y={830} rot={-4} c={YEL} />
		<Tagx t="LA ROJA" x={1420} y={850} rot={3} c="#FF6B6B" />
		<DTop /><DBot t="SI SU APODO TIENE..." />
	</Base>
);
export const T35b: React.FC = () => (
	<Base>
		<Map cam={{x: 1880, y: 860, z: 0.62}} mood="panic" dark={0.28} />
		<Vig o={0.55} />
		{[['BRA', 'CANARINHA', 330, 330], ['ENG', 'THREE LIONS', 1590, 330], ['MAR', 'LEONES DEL ATLAS', 330, 720], ['CIV', 'ELEFANTES', 1590, 720]].map(([k, t, x, y]) => (
			<React.Fragment key={k as string}><Ball k={k as string} d={240} x={x as number} y={y as number} mood="panic" /><Tagx t={t as string} x={x as number} y={(y as number) + 150} c={YEL} /></React.Fragment>
		))}
		<DTop /><DBot t="SI SU APODO TIENE UN ANIMAL" />
	</Base>
);
export const T35c: React.FC = () => (
	<Base>
		<Map cam={camOn(['ARG', 'URY', 'PRY', 'BRA'], 1.25)} mood="panic" dark={0.2} grey={(k) => ['ARG', 'URY', 'PRY'].includes(k)} />
		<Disappear keys={['ARG', 'URY', 'PRY']} cam={camOn(['ARG', 'URY', 'PRY', 'BRA'], 1.25)} seed={6} />
		<Vig o={0.5} />
		<Hero k="ARG" x={520} y={580} mw={420} mh={620} m="terror" rot={-5} />
		<Hero k="URY" x={1380} y={520} mw={380} mh={380} m="cry" rot={5} />
		<Tagx t="ALBICELESTE" x={520} y={900 - 60} rot={-4} c="#9AD3FF" />
		<Tagx t="LA CELESTE" x={1380} y={760} rot={3} c="#9AD3FF" />
		<DTop /><DBot t="SI SU APODO TIENE..." />
	</Base>
);
export const T35d: React.FC = () => (
	<Base>
		<Map cam={{x: 1880, y: 860, z: 0.62}} mood="shock" dark={0.28} />
		<Vig o={0.55} />
		{[['ESP', 'LA ROJA', 320, 360, -6], ['BRA', 'CANARINHA', 960, 300, 3], ['FRA', 'LES BLEUS', 1600, 360, 6], ['MEX', 'EL TRI', 520, 700, 4], ['ENG', 'THREE LIONS', 1400, 700, -4]].map(([k, t, x, y, r]) => (
			<React.Fragment key={k as string}><Ball k={k as string} d={230} x={x as number} y={y as number} mood="scared" rot={r as number} /><Tagx t={t as string} x={x as number} y={(y as number) + 150} rot={r as number} c={YEL} /></React.Fragment>
		))}
		<DTop /><DBot t="SI SU APODO TIENE..." />
	</Base>
);
export const T35e: React.FC = () => (
	<Base>
		<Map cam={EUc} mood="panic" dark={0.22} grey={(k) => ['FRA', 'NLD', 'BEL', 'ESP', 'ENG', 'PRT', 'HRV', 'CHE'].includes(k)} />
		<Disappear keys={['FRA', 'NLD', 'BEL', 'ESP', 'ENG', 'PRT', 'HRV', 'CHE']} cam={EUc} seed={10} />
		<Vig o={0.5} />
		<BigNum n="47" sub="APODOS ELIMINADOS" x={1340} y={520} />
		<Hero k="FRA" x={480} y={560} mw={480} mh={500} m="terror" rot={-5} />
		<Tagx t="LES BLEUS" x={480} y={850} rot={-3} c="#9AD3FF" />
		<DTop /><DBot t="SI SU APODO TIENE..." />
	</Base>
);

// ======================= 38 · ELIMINANDO PAÍSES DE LATINOAMÉRICA (geografía)
const PTop: React.FC<{t?: string}> = ({t = 'ELIMINANDO PAÍSES'}) => <TT parts={[[t]]} size={118} sw={SW} style={{top: 18}} />;
export const T38a: React.FC = () => (
	<LatBase gone={['BOL', 'PRY', 'CUB', 'DOM', 'HTI', 'ECU', 'COL']}>
		<Hero k="BRA" x={1400} y={520} mw={600} mh={560} m="terror" />
		<Hero k="MEX" x={520} y={520} mw={600} mh={440} m="shock" rot={-6} />
		<PTop /><LatBot t="DE LATINOAMÉRICA" />
	</LatBase>
);
export const T38b: React.FC = () => (
	<LatBase gone={[]}>
		<Ball k="MEX" d={230} x={260} y={330} mood="panic" look={[0.6, 0]} />
		<Ball k="BRA" d={260} x={300} y={700} mood="scared" look={[0.6, 0]} />
		<Ball k="ARG" d={250} x={1650} y={350} mood="panic" look={[-0.6, 0]} />
		<Ball k="CUB" d={220} x={1660} y={720} mood="scared" look={[-0.6, 0]} />
		<div style={{position: 'absolute', left: 960 - 290, top: 270, width: 580, height: 580, borderRadius: '50%', background: '#1B1D26', border: `12px solid ${INK}`, boxShadow: '0 0 0 14px #FFD23F, 0 18px 0 14px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<TT parts={[['1', YEL]]} size={420} sw={SW} style={{position: 'relative', top: 0}} />
		</div>
		<TT parts={[['SOLO QUEDARÁ']]} size={124} sw={SW} style={{top: 18}} />
		<LatBot t="UN PAÍS" />
	</LatBase>
);
export const T38c: React.FC = () => (
	<LatBase>
		<div style={{position: 'absolute', left: 230, top: 240, display: 'grid', gridTemplateColumns: 'repeat(5, 270px)', gap: 18}}>
			{LAT.map((k, i) => {
				const out = ['BOL', 'PRY', 'CUB', 'DOM', 'HTI', 'ECU', 'COL', 'MEX', 'GTM', 'HND', 'NIC', 'CRI', 'PAN'].includes(k);
				return (
					<div key={k} style={{position: 'relative', width: 270, height: 140}}>
						<img src={staticFile(`flags/${FLG(k)}.svg`)} style={{width: 210, height: 140, objectFit: 'cover', borderRadius: 14, border: `6px solid ${INK}`, filter: out ? 'grayscale(1) brightness(0.6)' : 'none', boxShadow: '0 8px 0 rgba(0,0,0,0.4)', transform: `rotate(${((i * 7) % 5) - 2}deg)`}} />
						{out && <svg width={210} height={140} style={{position: 'absolute', left: 0, top: 0}}><path d="M30 20 L180 120 M180 20 L30 120" stroke={INK} strokeWidth={24} strokeLinecap="round" /><path d="M30 20 L180 120 M180 20 L30 120" stroke="#E8394A" strokeWidth={14} strokeLinecap="round" /></svg>}
					</div>
				);
			})}
		</div>
		<PTop /><LatBot t="HASTA QUE QUEDE 1" />
	</LatBase>
);
export const T38d: React.FC = () => (
	<LatBase cam={camOn(['BOL', 'PRY', 'PER', 'CHL'], 1.6, 0, 0)} gone={['BOL']}>
		<Hero k="BOL" x={560} y={560} mw={620} mh={620} m="cry" rot={-5} ghost />
		<div style={{position: 'absolute', left: 1080, top: 380, width: 760, transform: 'rotate(-4deg)', padding: '18px 26px', borderRadius: 26, background: YEL, border: `10px solid ${INK}`, boxShadow: '0 12px 0 rgba(0,0,0,0.4)', fontFamily: LILITA, fontSize: 104, lineHeight: 1, color: INK, textAlign: 'center'}}>¿POR NO TENER MAR?</div>
		<PTop t="TU PAÍS DESAPARECE" /><LatBot t="LATINOAMÉRICA" />
	</LatBase>
);
export const T38e: React.FC = () => (
	<LatBase cam={camOn(['MEX', 'GTM', 'CUB', 'PAN'], 1.3, 0, 0)} gone={['CUB', 'DOM', 'HTI']}>
		<Hero k="MEX" x={560} y={540} mw={720} mh={520} m="terror" rot={-4} />
		<VS x={1080} y={560} />
		<Hero k="CUB" x={1500} y={560} mw={560} mh={300} m="rage" rot={5} />
		<TT parts={[['SOLO 1 SOBREVIVE']]} size={124} sw={SW} style={{top: 18}} />
		<LatBot t="LATINOAMÉRICA" />
	</LatBase>
);
