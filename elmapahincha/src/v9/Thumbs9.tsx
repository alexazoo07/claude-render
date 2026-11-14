import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WorldLayer, Vis} from '../v5/WorldLayer5';
import {C} from '../data';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {BY, Stadium, STADIUMS} from './data9';
import {StadiumArt} from './StadiumArt';

// plain thumbnail style (no glow): thin stroke + hard shadow, open blue sea
const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#fff', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.09}px #10131C`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.07}px 0 #10131C`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const vis: Record<string, Vis> = Object.fromEntries(STADIUMS.map((s) => [s.iso, {flag: s.flag, pop: 1, mood: 'feliz' as const}]));
const MapBg: React.FC<{x: number; y: number; z: number}> = ({x, y, z}) => (
	<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}>
		<WorldLayer cam={{x, y, z}} vis={vis} />
	</div>
);
const Card: React.FC<{s: Stadium; w: number; rot?: number; badge?: string; badgeCol?: string; label?: boolean}> = ({s, w, rot = 0, badge, badgeCol = C.red, label = true}) => (
	<div style={{position: 'relative', transform: `rotate(${rot}deg)`}}>
		<div style={{width: w, height: w * 0.57, borderRadius: w * 0.04, overflow: 'hidden', border: `${w * 0.012}px solid #10131C`, boxShadow: `0 0 0 ${w * 0.01}px #fff, 0 ${w * 0.02}px 0 rgba(0,0,0,0.5)`}}>
			<StadiumArt art={s.art} t={40} w={w} h={w * 0.57} id={`th${s.key}${w}`} />
			{label && (
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: `${w * 0.015}px ${w * 0.03}px`, background: 'rgba(11,30,63,0.9)', display: 'flex', alignItems: 'center', gap: w * 0.02}}>
					<img src={staticFile(`flags/${s.flag}.svg`)} style={{width: w * 0.08, height: w * 0.058, borderRadius: 4, border: '2px solid #10131C', objectFit: 'cover'}} />
					<span style={{fontFamily: LILITA, fontSize: w * 0.065, color: '#fff', whiteSpace: 'nowrap'}}>{s.short}</span>
				</div>
			)}
		</div>
		{badge && (
			<div style={{position: 'absolute', left: -w * 0.06, top: -w * 0.08, width: w * 0.24, height: w * 0.24, borderRadius: '50%', background: badgeCol, border: `${w * 0.012}px solid #10131C`, boxShadow: '0 0 0 4px #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: w * 0.12, color: badgeCol === C.yellow ? C.navy : '#fff'}}>{badge}</div>
		)}
	</div>
);
const Base: React.FC<{children: React.ReactNode; x?: number; y?: number; z?: number}> = ({children, x = 1915, y = 820, z = 0.5}) => (
	<AbsoluteFill style={{background: C.navy, overflow: 'hidden'}}>
		<Fonts />
		<FlagPreload flags={STADIUMS.map((s) => s.flag)} />
		<MapBg x={x} y={y} z={z} />
		{children}
	</AbsoluteFill>
);

// 1: title + Bernabéu vs Camp Nou + "?"
export const T9a: React.FC = () => (
	<Base>
		<div style={{position: 'absolute', left: 0, right: 0, top: 22, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<Txt size={84}>LOS MEJORES ESTADIOS</Txt>
			<Txt size={96} color={C.yellow}>DEL MUNDO</Txt>
		</div>
		<div style={{position: 'absolute', left: 40, top: 300}}><Card s={BY.bernabeu} w={540} rot={-4} /></div>
		<div style={{position: 'absolute', right: 40, top: 300}}><Card s={BY.campnou} w={540} rot={4} /></div>
		<div style={{position: 'absolute', left: 640 - 95, top: 400, width: 190, height: 190, borderRadius: '50%', background: C.yellow, border: '10px solid #10131C', boxShadow: '0 0 0 6px #fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Txt size={120} color={C.red}>?</Txt></div>
	</Base>
);
// 2: golden #1 card with question
export const T9b: React.FC = () => (
	<Base x={1700} y={700} z={0.62}>
		<div style={{position: 'absolute', left: 40, top: 50, display: 'flex', flexDirection: 'column', gap: 6}}>
			<Txt size={96}>EL MEJOR</Txt>
			<Txt size={96}>ESTADIO</Txt>
			<Txt size={96} color={C.yellow}>DEL MUNDO</Txt>
			<Txt size={60} color="#fff" style={{marginTop: 14}}>¿CUÁL ES?</Txt>
		</div>
		<div style={{position: 'absolute', right: 70, top: 90, width: 470, height: 540, borderRadius: 40, background: 'linear-gradient(160deg, #FFE27A, #E0A800)', border: '12px solid #10131C', boxShadow: '0 0 0 8px #fff, 0 18px 0 rgba(0,0,0,0.5)', transform: 'rotate(4deg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
			<div style={{fontFamily: LILITA, fontSize: 70, color: C.navy}}>Nº</div>
			<div style={{fontFamily: LILITA, fontSize: 300, lineHeight: 0.85, color: C.navy}}>1</div>
			<Txt size={130} color={C.red}>?</Txt>
		</div>
	</Base>
);
// 3: top 20 with three cards and rank badges
export const T9c: React.FC = () => (
	<Base x={1500} y={900} z={0.48}>
		<div style={{position: 'absolute', left: 0, right: 0, top: 24, display: 'flex', justifyContent: 'center', gap: 22, alignItems: 'baseline'}}>
			<Txt size={110} color={C.yellow}>TOP 20</Txt>
			<Txt size={84}>ESTADIOS</Txt>
		</div>
		<div style={{position: 'absolute', left: 60, top: 230}}><Card s={BY.wembley} w={380} rot={-6} badge="6" /></div>
		<div style={{position: 'absolute', left: 450, top: 330}}><Card s={BY.maracana} w={400} rot={2} badge="3" /></div>
		<div style={{position: 'absolute', right: 50, top: 220}}><Card s={BY.bombonera} w={380} rot={6} badge="5" /></div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 26, display: 'flex', justifyContent: 'center'}}><Txt size={56}>¿CUÁL ES EL Nº 1?</Txt></div>
	</Base>
);
// 4: the biggest... but the best?
export const T9d: React.FC = () => (
	<Base x={3150} y={560} z={1.2}>
		<div style={{position: 'absolute', left: 40, top: 40}}><Card s={BY.rungrado} w={640} rot={-3} /></div>
		<div style={{position: 'absolute', right: 40, top: 60, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6}}>
			<Txt size={60}>EL MÁS GRANDE</Txt>
			<Txt size={130} color={C.yellow}>114.000</Txt>
			<Txt size={52}>PERSONAS</Txt>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', gap: 20}}>
			<Txt size={88}>¿PERO ES</Txt>
			<Txt size={88} color={C.yellow}>EL MEJOR?</Txt>
		</div>
	</Base>
);
// 5: ranking podium
export const T9e: React.FC = () => (
	<Base x={1880} y={540} z={1.6}>
		<div style={{position: 'absolute', left: 0, right: 0, top: 20, display: 'flex', justifyContent: 'center'}}><Txt size={86}>RANKING DE ESTADIOS</Txt></div>
		<div style={{position: 'absolute', left: 30, top: 300}}><Card s={BY.azteca} w={380} rot={-5} badge="4" badgeCol="#2EC46B" /></div>
		<div style={{position: 'absolute', left: 445, top: 170}}><Card s={BY.bernabeu} w={390} rot={0} badge="?" badgeCol={C.yellow} /></div>
		<div style={{position: 'absolute', right: 30, top: 300}}><Card s={BY.campnou} w={380} rot={5} badge="?" badgeCol={C.yellow} /></div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 30, display: 'flex', justifyContent: 'center', gap: 18}}><Txt size={66}>¿MADRID O</Txt><Txt size={66} color={C.yellow}>BARCELONA?</Txt></div>
	</Base>
);
