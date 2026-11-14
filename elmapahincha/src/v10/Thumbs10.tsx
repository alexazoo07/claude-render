import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WorldLayer, Vis} from '../v5/WorldLayer5';
import {C} from '../data';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Trophy} from '../common';
import {ALL_FLAGS10, ALL_KEYS, CATS, CAT_COL, TEAMS} from './data10';

// plain thumbnail style (no glow): thin stroke + hard shadow, open blue sea
const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#fff', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.09}px #10131C`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.07}px 0 #10131C`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const vis: Record<string, Vis> = Object.fromEntries(ALL_KEYS.map((k) => [k, {flag: TEAMS[k].flag, pop: 1, mood: 'feliz' as const}]));
const Base: React.FC<{children: React.ReactNode; x?: number; y?: number; z?: number}> = ({children, x = 1700, y = 860, z = 0.55}) => (
	<AbsoluteFill style={{background: C.navy, overflow: 'hidden'}}>
		<Fonts />
		<FlagPreload flags={ALL_FLAGS10} />
		<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}><WorldLayer cam={{x, y, z}} vis={vis} /></div>
		{children}
	</AbsoluteFill>
);
const Flag: React.FC<{k: string; w: number; rot?: number}> = ({k, w, rot = 0}) => (
	<img src={staticFile(`flags/${TEAMS[k].flag}.svg`)} style={{width: w, height: w * 0.68, borderRadius: w * 0.07, border: `${Math.max(5, w * 0.03)}px solid #10131C`, boxShadow: `0 0 0 ${Math.max(4, w * 0.02)}px #fff, 0 ${w * 0.04}px 0 rgba(0,0,0,0.45)`, objectFit: 'cover', transform: `rotate(${rot}deg)`}} />
);
const Team: React.FC<{k: string; w: number; rot?: number; ys?: number}> = ({k, w, rot = 0, ys = 1}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 * ys}}>
		<Flag k={k} w={w} rot={rot} />
		<Txt size={w * 0.2} color={C.yellow} style={{marginTop: 6}}>{TEAMS[k].year}</Txt>
	</div>
);
const VS: React.FC<{s: number; style?: React.CSSProperties}> = ({s, style}) => (
	<div style={{width: s, height: s, borderRadius: '50%', background: C.yellow, border: `${s * 0.05}px solid #10131C`, boxShadow: `0 0 0 ${s * 0.035}px #fff`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)', ...style}}><Txt size={s * 0.45} color={C.red}>VS</Txt></div>
);

// 1: title + Brasil 70 vs Argentina 22
export const T10a: React.FC = () => (
	<Base>
		<div style={{position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
			<Txt size={74}>¿QUÉ PASARÍA SI SE ENFRENTARAN</Txt>
			<Txt size={88} color={C.yellow}>EN SU MEJOR MOMENTO?</Txt>
		</div>
		<div style={{position: 'absolute', left: 60, top: 270}}><Team k="BRA" w={430} rot={-4} /></div>
		<div style={{position: 'absolute', right: 60, top: 270}}><Team k="ARG" w={430} rot={4} /></div>
		<VS s={190} style={{position: 'absolute', left: 640 - 95, top: 330}} />
	</Base>
);
// 2: arcade select grid
export const T10b: React.FC = () => {
	const keys = ['BRA', 'ESP', 'HUN', 'NLD', 'ARG', 'DEU', 'FRA', 'ITA'];
	return (
		<Base x={1500} y={900} z={0.5}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 24, display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'baseline'}}>
				<Txt size={92}>ELIGE TU</Txt><Txt size={110} color={C.yellow}>LEYENDA</Txt>
			</div>
			<div style={{position: 'absolute', left: 70, right: 70, top: 190, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22}}>
				{keys.map((k) => {
					const sel = k === 'BRA' || k === 'ARG';
					return (
						<div key={k} style={{borderRadius: 18, overflow: 'hidden', border: `7px solid ${sel ? (k === 'BRA' ? C.red : '#2F7DE1') : '#10131C'}`, boxShadow: '0 0 0 5px #fff, 0 8px 0 rgba(0,0,0,0.45)', background: '#152F5E', transform: sel ? 'scale(1.06)' : undefined}}>
							<img src={staticFile(`flags/${TEAMS[k].flag}.svg`)} style={{width: '100%', height: 130, objectFit: 'cover', display: 'block', borderBottom: '5px solid #10131C'}} />
							<div style={{textAlign: 'center', padding: '6px 0 8px'}}><Txt size={46} color={C.yellow}>{TEAMS[k].year}</Txt></div>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 26, display: 'flex', justifyContent: 'center'}}><Txt size={64}>¿QUIÉN GANARÍA EL TORNEO?</Txt></div>
		</Base>
	);
};
// 3: trophy with 4 candidates
export const T10c: React.FC = () => (
	<Base x={1900} y={700} z={0.62}>
		<div style={{position: 'absolute', left: 0, right: 0, top: 24, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<Txt size={84}>LAS MEJORES SELECCIONES</Txt>
			<Txt size={84} color={C.yellow}>DE LA HISTORIA</Txt>
		</div>
		<div style={{position: 'absolute', left: 640 - 150, top: 250}}><Trophy size={300} /></div>
		<div style={{position: 'absolute', left: 60, top: 240}}><Team k="BRA" w={300} rot={-6} /></div>
		<div style={{position: 'absolute', right: 60, top: 240}}><Team k="ESP" w={300} rot={6} /></div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 24, display: 'flex', justifyContent: 'center'}}><Txt size={66}>1 TORNEO · 1 CAMPEÓN</Txt></div>
	</Base>
);
// 4: Brasil 70 vs España 10 stat duel
const Card: React.FC<{k: string; col: string; rot: number}> = ({k, col, rot}) => (
	<div style={{width: 470, padding: '16px 20px 20px', borderRadius: 28, background: 'rgba(11,30,63,0.95)', border: `7px solid ${col}`, boxShadow: '0 12px 0 rgba(0,0,0,0.45)', transform: `rotate(${rot}deg)`}}>
		<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
			<Flag k={k} w={150} />
			<div><Txt size={54}>{TEAMS[k].name.toUpperCase()}</Txt><Txt size={60} color={C.yellow}>{TEAMS[k].year}</Txt></div>
		</div>
		<div style={{marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10}}>
			{CATS.map((c, j) => (
				<div key={c} style={{display: 'flex', alignItems: 'center', gap: 10}}>
					<div style={{width: 120, fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: '#fff'}}>{c}</div>
					<div style={{flex: 1, height: 24, borderRadius: 12, background: 'rgba(255,255,255,0.12)', border: '3px solid #10131C', overflow: 'hidden'}}><div style={{width: `${TEAMS[k].r[j]}%`, height: '100%', background: CAT_COL[j]}} /></div>
					<div style={{width: 46, fontFamily: LILITA, fontSize: 32, color: '#fff', textAlign: 'right'}}>{TEAMS[k].r[j]}</div>
				</div>
			))}
		</div>
	</div>
);
export const T10d: React.FC = () => (
	<Base x={1400} y={1000} z={0.6}>
		<div style={{position: 'absolute', left: 0, right: 0, top: 22, display: 'flex', justifyContent: 'center'}}><Txt size={86}>¿QUIÉN GANARÍA?</Txt></div>
		<div style={{position: 'absolute', left: 50, top: 170}}><Card k="BRA" col={C.red} rot={-3} /></div>
		<div style={{position: 'absolute', right: 50, top: 170}}><Card k="ESP" col="#2F7DE1" rot={3} /></div>
		<VS s={150} style={{position: 'absolute', left: 640 - 75, top: 330}} />
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 24, display: 'flex', justifyContent: 'center'}}><Txt size={58} color={C.yellow}>SELECCIONES EN SU MEJOR MOMENTO</Txt></div>
	</Base>
);
// 5: 16 flags + question
export const T10e: React.FC = () => (
	<Base x={2000} y={760} z={0.7}>
		<div style={{position: 'absolute', left: 0, right: 0, top: 22, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<Txt size={80}>16 SELECCIONES LEGENDARIAS</Txt>
		</div>
		<div style={{position: 'absolute', left: 60, right: 60, top: 150, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 16}}>
			{ALL_KEYS.map((k) => (
				<div key={k} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
					<Flag k={k} w={125} />
					<Txt size={30} color={C.yellow}>{TEAMS[k].year}</Txt>
				</div>
			))}
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center', gap: 18}}><Txt size={96}>¿QUIÉN</Txt><Txt size={96} color={C.yellow}>GANA?</Txt></div>
	</Base>
);
