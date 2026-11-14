import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WorldLayer, Vis} from '../v5/WorldLayer5';
import {C} from '../data';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Trophy} from '../common';
import {ALL_FLAGS11, CHAMPS, EDS, N, titlesOf} from './data11';

// plain thumbnail style (no glow): thin stroke + hard shadow, open blue sea
const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#fff', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.09}px #10131C`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.07}px 0 #10131C`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const vis: Record<string, Vis> = {};
for (const k of CHAMPS) for (const m of N[k].map) vis[m] = {flag: N[k].flag, pop: 1, mood: 'feliz'};
const Base: React.FC<{children: React.ReactNode; x?: number; y?: number; z?: number; faces?: boolean}> = ({children, x = 1700, y = 860, z = 0.55, faces = true}) => (
	<AbsoluteFill style={{background: C.navy, overflow: 'hidden'}}>
		<Fonts />
		<FlagPreload flags={ALL_FLAGS11} />
		<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}><WorldLayer cam={{x, y, z}} vis={faces ? vis : {}} /></div>
		{children}
	</AbsoluteFill>
);
const Flag: React.FC<{k: string; w: number; rot?: number}> = ({k, w, rot = 0}) => (
	<img src={staticFile(`flags/${N[k].flag}.svg`)} style={{width: w, height: w * 0.68, borderRadius: w * 0.07, border: `${Math.max(4, w * 0.03)}px solid #10131C`, boxShadow: `0 0 0 ${Math.max(3, w * 0.02)}px #fff, 0 ${w * 0.04}px 0 rgba(0,0,0,0.45)`, objectFit: 'cover', transform: `rotate(${rot}deg)`, display: 'block'}} />
);
const Star: React.FC<{s: number; col?: string}> = ({s, col = C.yellow}) => (
	<svg width={s} height={s} viewBox="0 0 40 40"><path d="M20 3 L25 14.5 L37.5 15.5 L28 24 L31 36.5 L20 30 L9 36.5 L12 24 L2.5 15.5 L15 14.5Z" fill={col} stroke="#10131C" strokeWidth={2.6} strokeLinejoin="round" /></svg>
);
const ORDER = ['BRA', 'GER', 'ITA', 'ARG', 'FRA', 'URY', 'ESP', 'ENG'];

// 1: title + trophy + 8 flags
export const T11a: React.FC = () => (
	<Base x={1650} y={900} z={0.55}>
		<div style={{position: 'absolute', left: 0, right: 0, top: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
			<Txt size={88}>TODOS LOS CAMPEONES</Txt>
			<Txt size={104} color={C.yellow}>DEL MUNDIAL</Txt>
		</div>
		<div style={{position: 'absolute', left: 640 - 140, top: 250}}><Trophy size={280} /></div>
		{ORDER.map((k, i) => {
			const left = i < 4;
			const j = i % 4;
			return <div key={k} style={{position: 'absolute', left: left ? 40 + (j % 2) * 210 : 1280 - 40 - 190 - (j % 2) * 210, top: 250 + Math.floor(j / 2) * 200}}><Flag k={k} w={190} rot={left ? -4 : 4} /></div>;
		})}
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 22, display: 'flex', justifyContent: 'center'}}><Txt size={60}>1930 - 2026</Txt></div>
	</Base>
);
// 2: ranking of stars
export const T11b: React.FC = () => (
	<Base x={1500} y={900} z={0.5}>
		<div style={{position: 'absolute', left: 0, right: 0, top: 18, display: 'flex', justifyContent: 'center', gap: 18}}><Txt size={74}>TODOS LOS CAMPEONES</Txt><Txt size={74} color={C.yellow}>DEL MUNDIAL</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 20, display: 'flex', justifyContent: 'center'}}><Txt size={62} color={C.yellow}>¿QUIÉN TIENE MÁS ESTRELLAS?</Txt></div>
		<div style={{position: 'absolute', left: 70, right: 70, top: 120, display: 'flex', flexDirection: 'column', gap: 10}}>
			{ORDER.slice(0, 4).map((k, j) => (
				<div key={k} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '6px 18px', borderRadius: 18, background: j === 0 ? 'rgba(255,210,63,0.95)' : 'rgba(11,30,63,0.92)', border: `5px solid #10131C`}}>
					<Txt size={50} color={j === 0 ? '#fff' : C.yellow} style={{width: 70}}>{j + 1}º</Txt>
					<Flag k={k} w={110} />
					<Txt size={56} style={{width: 330}}>{N[k].name.toUpperCase()}</Txt>
					<div style={{display: 'flex'}}>{titlesOf(k).map((y) => <Star key={y} s={70} col={j === 0 ? '#fff' : C.yellow} />)}</div>
				</div>
			))}
		</div>
	</Base>
);
// 3: timeline of all champion flags
export const T11c: React.FC = () => (
	<Base x={1650} y={850} z={0.6}>
		<div style={{position: 'absolute', left: 0, right: 0, top: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
			<Txt size={84}>TODOS LOS CAMPEONES</Txt>
			<Txt size={84} color={C.yellow}>DEL MUNDIAL (1930-2026)</Txt>
		</div>
		<div style={{position: 'absolute', left: 30, right: 30, top: 230, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 12, justifyItems: 'center'}}>
			{EDS.map((e) => (
				<div key={e.y} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
					<Flag k={e.win} w={118} />
					<Txt size={30} color={C.yellow}>{e.y}</Txt>
				</div>
			))}
		</div>
	</Base>
);
// 4: Spain 2026, the latest champion
export const T11d: React.FC = () => (
	<Base x={1450} y={760} z={1.0}>
		<div style={{position: 'absolute', left: 0, right: 0, top: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
			<Txt size={80}>TODOS LOS CAMPEONES</Txt>
			<Txt size={80} color={C.yellow}>DEL MUNDIAL</Txt>
		</div>
		<div style={{position: 'absolute', left: 60, top: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
			<Flag k="URY" w={300} rot={-5} />
			<Txt size={70} color={C.yellow}>1930</Txt>
		</div>
		<div style={{position: 'absolute', left: 640 - 110, top: 300}}><Trophy size={220} /></div>
		<div style={{position: 'absolute', right: 60, top: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
			<Flag k="ESP" w={300} rot={5} />
			<Txt size={70} color={C.yellow}>2026</Txt>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 24, display: 'flex', justifyContent: 'center'}}><Txt size={64}>DE URUGUAY A ESPAÑA</Txt></div>
	</Base>
);
// 5: map with the 8 champions
export const T11e: React.FC = () => (
	<Base x={1760} y={800} z={0.62}>
		<div style={{position: 'absolute', left: 0, right: 0, top: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}><Txt size={80}>TODOS LOS CAMPEONES</Txt><Txt size={80} color={C.yellow}>DEL MUNDIAL</Txt></div>
		<div style={{position: 'absolute', right: 40, top: 330, transform: 'rotate(4deg)'}}><Txt size={70} color={C.yellow}>¡SOLO 8 PAÍSES!</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 24, display: 'flex', justifyContent: 'center', gap: 12}}>
			{ORDER.map((k) => <Flag key={k} k={k} w={130} />)}
		</div>
	</Base>
);
