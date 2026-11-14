import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WorldLayer, Vis} from './WorldLayer';
import {Eyes, Hincha, Mood, Mouth} from '../Hincha';
import {Flag} from '../flags';
import {C, GEO} from '../data';
import {Fonts, LILITA} from '../fonts';
import {NEVER, TOUR, bboxOf} from './data2';
import {labelPt} from '../MapLayer';
import {FlagPreload} from './Preload';

const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#fff', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.11}px #10131C`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.07}px 0 #10131C, 0 ${size * 0.1}px ${size * 0.12}px rgba(0,0,0,0.55)`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const Vignette: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)'}} />;

const ArgCut: React.FC<{h: number; mood: Mood; tears?: boolean; glow?: string; faceScale?: number}> = ({h, mood, tears, glow = '#9FD0FF', faceScale = 2.3}) => {
	const g = GEO.teams.ARG;
	const [[x0, y0], [x1, y1]] = g.b;
	const pad = 12, vw = x1 - x0 + pad * 2, vh = y1 - y0 + pad * 2;
	const [lx, ly] = labelPt('ARG');
	const fs = Math.min(vw, vh) * 0.42 * faceScale;
	return (
		<svg width={(h * vw) / vh} height={h} viewBox={`${x0 - pad} ${y0 - pad} ${vw} ${vh}`} style={{overflow: 'visible', filter: `drop-shadow(0 0 ${h * 0.02}px ${glow}) drop-shadow(0 0 ${h * 0.02}px ${glow}) drop-shadow(0 ${h * 0.025}px 0 rgba(0,0,0,0.45))`}}>
			<defs><clipPath id="argcut"><path d={g.d} /></clipPath></defs>
			<path d={g.d} fill="none" stroke={glow} strokeWidth={vh * 0.022} strokeLinejoin="round" />
			<g clipPath="url(#argcut)"><Flag iso="ARG" x={x0} y={y0} w={x1 - x0} h={y1 - y0} /></g>
			<path d={g.d} fill="none" stroke={C.navy} strokeWidth={vh * 0.008} />
			<g transform={`translate(${lx} ${ly - 20}) scale(${fs / 100}) translate(-100 -98)`}>
				<Eyes mood={mood} look={[0, -0.2]} />
				<Mouth mood={mood} open={1} />
				{tears && (
					<g fill="#5BC0FF" stroke={C.navy} strokeWidth={3}>
						<path d="M66 104 q-8 30 0 52 q10 -24 0 -52 Z" />
						<path d="M134 104 q-8 30 0 52 q10 -24 0 -52 Z" />
					</g>
				)}
			</g>
		</svg>
	);
};

const worldVis = (mood: Mood): Record<string, Vis> => Object.fromEntries(TOUR.filter((r) => r.st !== 'never').map((r) => [r.key, {flag: r.flag, pop: 1, mood, look: [0, 0.3] as [number, number]}]));

const Pins: React.FC<{z: number; reveal?: string[]}> = ({z, reveal = []}) => (
	<>
		{NEVER.map((r) => {
			const b = bboxOf(r.key);
			const k = 1.15 / z;
			const known = reveal.includes(r.key);
			return (
				<g key={r.key} transform={`translate(${b.cx} ${b.cy}) scale(${k})`}>
					<path d="M0 0 C -16 -24 -34 -40 -34 -64 A34 34 0 1 1 34 -64 C 34 -40 16 -24 0 0 Z" fill="#E63946" stroke="#10131C" strokeWidth={5} />
					<circle cx={0} cy={-64} r={24} fill="#fff" stroke="#10131C" strokeWidth={3} />
					{known ? (
						<>
							<clipPath id={'tp' + r.key}><circle cx={0} cy={-64} r={22} /></clipPath>
							<image href={staticFile(`flags/${r.flag}.svg`)} x={-30} y={-86} width={60} height={44} preserveAspectRatio="xMidYMid slice" clipPath={`url(#tp${r.key})`} />
						</>
					) : <text x={0} y={-50} textAnchor="middle" fontFamily="Lilita" fontSize={40} fill="#10131C">?</text>}
				</g>
			);
		})}
	</>
);

// 1) 6 SELECCIONES QUE ARGENTINA NUNCA HA GANADO — crying Argentina + pins
export const T2a: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts />
		<FlagPreload />
		<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}>
			<WorldLayer cam={{x: 2150, y: 560, z: 0.9}} vis={worldVis('feliz')}><Pins z={0.9} /></WorldLayer>
		</div>
		<Vignette />
		<div style={{position: 'absolute', left: 0, right: 0, top: 24, display: 'flex', justifyContent: 'center'}}><Txt size={104}>PAÍSES QUE ARGENTINA</Txt></div>
		<div style={{position: 'absolute', left: 480, top: 150}}><ArgCut h={430} mood="triste" tears /></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center'}}><Txt size={104} color="#FF3B30">NUNCA HA GANADO</Txt></div>
	</AbsoluteFill>
);

// 2) Split ARGENTINA 597 vs ??? 0
export const T2b: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts />
		<FlagPreload />
		<div style={{position: 'absolute', left: 0, top: 0, width: 660, height: 720, background: 'linear-gradient(160deg, #2C8BE0, #11508F)'}} />
		<div style={{position: 'absolute', left: 620, top: 0, width: 660, height: 720, background: 'radial-gradient(circle at 60% 45%, #7A1020, #24060C 75%)'}} />
		<svg width={1280} height={720} style={{position: 'absolute'}}>
			<path d="M690 -10 L600 330 L680 330 L590 730 L760 300 L670 300 L760 -10 Z" fill="#FFD23F" stroke="#10131C" strokeWidth={10} strokeLinejoin="round" />
		</svg>
		<div style={{position: 'absolute', left: 30, top: 30, width: 560, display: 'flex', justifyContent: 'center'}}><Txt size={92}>ARGENTINA</Txt></div>
		<div style={{position: 'absolute', left: 690, top: 30, width: 560, display: 'flex', justifyContent: 'center'}}><Txt size={96}>???</Txt></div>
		<div style={{position: 'absolute', left: 140, top: 150}}><Hincha iso="ARG" mood="miedo" size={360} scarf={['#74ACDF', '#FFFFFF']} sweat look={[0.6, 0]} /></div>
		<div style={{position: 'absolute', left: 780, top: 150}}>
			<svg width={360} height={360} viewBox="0 0 200 200" style={{overflow: 'visible', filter: 'drop-shadow(0 0 18px #FF3B30)'}}>
				<circle cx={100} cy={92} r={76} fill="#0A0A12" stroke="#FF3B30" strokeWidth={6} />
				<Eyes mood="enfado" look={[-0.6, 0]} />
				<path d="M78 124 Q100 140 122 124" fill="none" stroke="#FF3B30" strokeWidth={6} strokeLinecap="round" />
			</svg>
		</div>
		<div style={{position: 'absolute', left: 40, top: 545, width: 580, display: 'flex', justifyContent: 'center'}}><Txt size={110} color="#2EC46B">597 V</Txt></div>
		<div style={{position: 'absolute', left: 680, top: 545, width: 560, display: 'flex', justifyContent: 'center'}}><Txt size={110} color="#FF3B30">0 V</Txt></div>
	</AbsoluteFill>
);

// 3) Scoreboard ARG 0-1 CMR + "¿Y LAS OTRAS 5?"
export const T2c: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #3A1020 0%, #14060C 75%)'}}>
		<Fonts />
		<FlagPreload />
		<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center'}}>
			<div style={{display: 'flex', alignItems: 'stretch', borderRadius: 18, overflow: 'hidden', border: '6px solid #10131C', boxShadow: '0 10px 0 rgba(0,0,0,0.45)'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '10px 20px'}}>
					<img src={staticFile('flags/ar.svg')} style={{width: 70, height: 52, borderRadius: 6, border: '3px solid #10131C', objectFit: 'cover'}} />
					<span style={{fontFamily: LILITA, fontSize: 60, color: '#10131C'}}>ARG</span>
				</div>
				<div style={{background: '#10131C', padding: '6px 28px', fontFamily: LILITA, fontSize: 84, color: '#FFD23F', display: 'flex', alignItems: 'center'}}>0 - 1</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '10px 20px'}}>
					<span style={{fontFamily: LILITA, fontSize: 60, color: '#10131C'}}>CMR</span>
					<img src={staticFile('flags/cm.svg')} style={{width: 70, height: 52, borderRadius: 6, border: '3px solid #10131C', objectFit: 'cover'}} />
				</div>
			</div>
		</div>
		<div style={{position: 'absolute', left: 90, top: 200}}><Hincha iso="ARG" mood="triste" size={340} scarf={['#74ACDF', '#FFFFFF']} sweat /></div>
		<div style={{position: 'absolute', left: 520, top: 220, display: 'flex', flexDirection: 'column', gap: 18}}>
			<Txt size={96}>NUNCA LE</Txt>
			<Txt size={96}>HA GANADO</Txt>
			<Txt size={96} color="#FF3B30">¿Y A QUIÉN MÁS?</Txt>
		</div>
	</AbsoluteFill>
);

// 4) "¿A QUIÉN NUNCA HA GANADO ARGENTINA?" world map + big Argentina head
export const T2d: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts />
		<FlagPreload />
		<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}>
			<WorldLayer cam={{x: 1950, y: 760, z: 0.62}} vis={worldVis('grito')}><Pins z={0.62} /></WorldLayer>
		</div>
		<Vignette />
		<div style={{position: 'absolute', left: 36, top: 36, display: 'flex', flexDirection: 'column', gap: 14}}>
			<Txt size={100}>¿A QUIÉN</Txt>
			<Txt size={100} color="#FF3B30">NUNCA HA</Txt>
			<Txt size={100} color="#FF3B30">GANADO?</Txt>
		</div>
		<div style={{position: 'absolute', left: 820, top: 330}}><Hincha iso="ARG" mood="enfado" size={380} scarf={['#74ACDF', '#FFFFFF']} sweat look={[-0.4, -0.4]} /></div>
	</AbsoluteFill>
);
