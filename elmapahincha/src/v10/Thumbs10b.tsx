import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Trophy} from '../common';
import {Atlas, Face12, FaceMood, FaceSpec, Fill, INK, toScreen} from '../v12/Atlas';
import {ALL_KEYS, TEAMS} from './data10';

// New-style thumbnails for video 10 (relief map, big faces, thin outline, no glow)
const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#FFF6E0', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.075}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.06}px 0 ${INK}`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const CountryFace: React.FC<{k: string; flag: string; x: number; y: number; w: number; mood: FaceMood; rot?: number}> = ({k, flag, x, y, w, mood, rot = 0}) => {
	const b = WORLD[k].b; const bw = b[1][0] - b[0][0], bh = b[1][1] - b[0][1];
	const S = w / bw, h = bh * S;
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`}}>
			<svg width={w + 60} height={h + 60} style={{position: 'absolute', left: -30, top: -30, overflow: 'visible'}}>
				<defs><clipPath id={`tf${k}`}><path d={WORLD[k].d} /></clipPath></defs>
				<g transform={`translate(30 30) scale(${S}) translate(${-b[0][0]} ${-b[0][1]})`}>
					<path d={WORLD[k].d} fill="#06142A" opacity={0.4} transform={`translate(${5 / S} ${10 / S})`} />
					<path d={WORLD[k].d} fill="none" stroke={INK} strokeWidth={26 / S} strokeLinejoin="round" />
					<path d={WORLD[k].d} fill="none" stroke="#fff" strokeWidth={16 / S} strokeLinejoin="round" />
					<g clipPath={`url(#tf${k})`}><image href={staticFile(`flags/${flag}.svg`)} x={b[0][0] - 2} y={b[0][1] - 2} width={bw + 4} height={bh + 4} preserveAspectRatio="none" /></g>
					<image href={staticFile('tex/relief.jpg')} x={0} y={20} width={3830} height={1720} preserveAspectRatio="none" clipPath={`url(#tf${k})`} style={{mixBlendMode: 'multiply'}} />
					<path d={WORLD[k].d} fill="none" stroke={INK} strokeWidth={4 / S} strokeLinejoin="round" />
				</g>
			</svg>
			<svg width={w * 0.8} height={w * 0.8} viewBox="0 0 200 200" style={{position: 'absolute', left: w * 0.1, top: h / 2 - w * 0.4, overflow: 'visible'}}><Face12 mood={mood} /></svg>
		</div>
	);
};
const Spark: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<svg width={s} height={s} viewBox="-20 -20 40 40" style={{position: 'absolute', left: x - s / 2, top: y - s / 2}}><path d="M0 -18 Q3 -3 18 0 Q3 3 0 18 Q-3 3 -18 0 Q-3 -3 0 -18Z" fill="#FFE066" stroke={INK} strokeWidth={2.5} /></svg>
);
const FLAGS = ALL_KEYS.map((k) => TEAMS[k].flag);
const MapBg: React.FC<{cam: {x: number; y: number; z: number}}> = ({cam}) => {
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	const moods: FaceMood[] = ['angry', 'cool', 'smug', 'shock', 'happy'];
	ALL_KEYS.forEach((k, i) => { if (!WORLD[k]) return; fills[k] = {flag: TEAMS[k].flag}; faces[k] = {mood: moods[i % moods.length], size: 0.8, max: 90}; });
	return <Atlas cam={cam} fills={fills} faces={faces} />;
};
const Base: React.FC<{children: React.ReactNode}> = ({children}) => (
	<AbsoluteFill style={{background: '#2A72BA', overflow: 'hidden'}}>
		<Fonts />
		<FlagPreload flags={FLAGS} />
		{children}
	</AbsoluteFill>
);
const Year: React.FC<{k: string; x: number; y: number; s?: number; rot?: number}> = ({k, x, y, s = 1, rot = 0}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 22px', borderRadius: 18, background: '#1B1D26', border: '5px solid #fff'}}>
		<img src={staticFile(`flags/${TEAMS[k].flag}.svg`)} style={{width: 64, height: 43, borderRadius: 6, objectFit: 'cover', border: `3px solid ${INK}`}} />
		<span style={{fontFamily: LILITA, fontSize: 52, color: '#fff', whiteSpace: 'nowrap'}}>{TEAMS[k].name.toUpperCase()} <span style={{color: '#FFD23F'}}>{TEAMS[k].year}</span></span>
	</div>
);
const VS: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 230}) => (
	<div style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: '50%', background: '#FFD23F', border: `${s * 0.045}px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)'}}><Txt size={s * 0.5} color="#E8394A">VS</Txt></div>
);
const tf = (k: string) => TEAMS[k].flag;

// 1: Brasil 70 vs Argentina 22 (the simulated final)
export const T10n1: React.FC = () => (
	<Base>
		<MapBg cam={{x: 1500, y: 1050, z: 0.8}} />
		<CountryFace k="BRA" flag={tf('BRA')} x={500} y={620} w={560} mood="angry" rot={-4} />
		<CountryFace k="ARG" flag={tf('ARG')} x={1420} y={640} w={250} mood="smug" rot={4} />
		<VS x={960} y={600} />
		<Year k="BRA" x={500} y={960} rot={-3} /><Year k="ARG" x={1420} y={960} rot={3} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
			<Txt size={104}>¿Y SI SE ENFRENTARAN</Txt>
			<Txt size={104} color="#FFD23F">EN SU MEJOR MOMENTO?</Txt>
		</div>
	</Base>
);
// 2: split VS Brasil 70 vs España 2010
export const T10n2: React.FC = () => (
	<Base>
		<div style={{position: 'absolute', left: 0, top: 0, width: 1000, height: 1080, background: 'linear-gradient(160deg, #3FB66B, #136B36)'}} />
		<div style={{position: 'absolute', right: 0, top: 0, width: 1000, height: 1080, background: 'linear-gradient(200deg, #F25C4C, #9E1B12)', clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)'}} />
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><path d="M1010 0 L900 470 L1010 470 L880 1080" fill="none" stroke="#fff" strokeWidth={26} strokeLinejoin="round" /><path d="M1010 0 L900 470 L1010 470 L880 1080" fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round" /></svg>
		<CountryFace k="BRA" flag={tf('BRA')} x={470} y={600} w={560} mood="cool" rot={-4} />
		<CountryFace k="ESP" flag={tf('ESP')} x={1460} y={600} w={600} mood="angry" rot={4} />
		<VS x={960} y={560} />
		<Year k="BRA" x={470} y={960} rot={-3} /><Year k="ESP" x={1460} y={960} rot={3} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 28, display: 'flex', justifyContent: 'center'}}><Txt size={120}>¿QUIÉN GANARÍA?</Txt></div>
	</Base>
);
// 3: torneo de leyendas with trophy and four legends
export const T10n3: React.FC = () => (
	<Base>
		<MapBg cam={{x: 1800, y: 700, z: 0.75}} />
		<div style={{position: 'absolute', left: 960 - 170, top: 330}}><Trophy size={340} /></div>
		<CountryFace k="NLD" flag={tf('NLD')} x={300} y={470} w={300} mood="shock" rot={-6} />
		<CountryFace k="HUN" flag={tf('HUN')} x={1620} y={470} w={330} mood="cool" rot={6} />
		<CountryFace k="DEU" flag={tf('DEU')} x={520} y={770} w={300} mood="angry" rot={-3} />
		<CountryFace k="FRA" flag={tf('FRA')} x={1420} y={770} w={330} mood="smug" rot={3} />
		<Spark x={760} y={330} s={60} /><Spark x={1180} y={360} s={50} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
			<Txt size={112}>LAS MEJORES SELECCIONES</Txt>
			<Txt size={100} color="#FFD23F">DE LA HISTORIA, CARA A CARA</Txt>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 30, display: 'flex', justifyContent: 'center'}}><Txt size={80} color="#FF4D5E">16 SELECCIONES · 1 CAMPEÓN</Txt></div>
	</Base>
);
const CAM4 = {x: 1750, y: 760, z: 0.75};
// 4: world map of legends with year chips
export const T10n4: React.FC = () => (
	<Base>
		<MapBg cam={CAM4} />
		{([['BRA', 230, 330], ['ARG', 600, 140], ['NLD', 960, 260], ['ESP', 1320, 300], ['HUN', 1690, 300]] as [string, number, number][]).map(([k, x, w], i) => (
			<React.Fragment key={k}>
				<CountryFace k={k} flag={tf(k)} x={x} y={560} w={w} mood={(['angry', 'smug', 'shock', 'cool', 'happy'] as FaceMood[])[i]} rot={i % 2 ? 4 : -4} />
				<Year k={k} x={x} y={790} s={0.62} rot={i % 2 ? 3 : -3} />
			</React.Fragment>
		))}
		<div style={{position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', justifyContent: 'center'}}><Txt size={118}>SELECCIONES EN SU</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center'}}><Txt size={140} color="#FF4D5E">MEJOR MOMENTO</Txt></div>
	</Base>
);
// 5: Argentina 2022 champion of champions?
export const T10n5: React.FC = () => (
	<Base>
		<MapBg cam={{x: 2300, y: 800, z: 0.8}} />
		<CountryFace k="ARG" flag={tf('ARG')} x={960} y={600} w={330} mood="happy" rot={-3} />
		<div style={{position: 'absolute', left: 1180, top: 330, transform: 'rotate(10deg)'}}><Trophy size={300} /></div>
		<CountryFace k="BRA" flag={tf('BRA')} x={330} y={700} w={420} mood="sad" rot={-5} />
		<CountryFace k="ESP" flag={tf('ESP')} x={1640} y={820} w={360} mood="shock" rot={5} />
		<Spark x={700} y={360} s={70} /><Spark x={1250} y={300} s={50} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', justifyContent: 'center'}}><Txt size={110}>¿EL MEJOR EQUIPO DE LA HISTORIA?</Txt></div>
		<Year k="ARG" x={960} y={985} s={1.3} />
	</Base>
);
