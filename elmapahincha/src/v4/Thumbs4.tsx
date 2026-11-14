import React from 'react';
import {AbsoluteFill} from 'remotion';
import {WorldLayer, Vis} from '../v2/WorldLayer';
import {Hincha} from '../Hincha';
import {C} from '../data';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {bboxOf} from '../v2/data2';
import {ALL_FLAGS4, CAT_COL, LIST} from './data4';
import {Icon, Meter} from './Video4';

const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#fff', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.11}px #10131C`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.07}px 0 #10131C, 0 ${size * 0.1}px ${size * 0.12}px rgba(0,0,0,0.55)`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const Vignette: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)'}} />;
const ARG: [string, string] = ['#74ACDF', '#FFFFFF'];
const tinted = (mix: number): Record<string, Vis> => {
	const v: Record<string, Vis> = Object.fromEntries(LIST.map((e) => [e.key, {flag: e.flag, pop: 1, mood: e.cat === 'amor' ? 'feliz' : e.cat === 'odio' ? 'enfado' : 'miedo', color: CAT_COL[e.cat], colorMix: mix, faceScale: 1.2} as Vis]));
	v.ARG = {flag: 'ar', pop: 1, mood: 'miedo', faceScale: 1.3};
	return v;
};
const Hearts: React.FC<{n: number; seed: number; w: number; h: number; kind: 'amor' | 'odio'}> = ({n, seed, w, h, kind}) => (
	<>
		{Array.from({length: n}).map((_, i) => {
			const x = ((i * 397 + seed * 131) % 1000) / 1000 * w, y = ((i * 613 + seed * 71) % 1000) / 1000 * h;
			const s = 40 + ((i * 37) % 50);
			return <div key={i} style={{position: 'absolute', left: x, top: y, transform: `rotate(${((i * 53) % 60) - 30}deg)`, opacity: 0.9}}><Icon kind={kind} size={s} /></div>;
		})}
	</>
);

// 1) AMOR vs ODIO split, Argentina in the middle
export const T4a: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={ALL_FLAGS4} />
		<div style={{position: 'absolute', left: 0, top: 0, width: 660, height: 720, background: 'linear-gradient(160deg, #FF6FB5, #B3166A)', overflow: 'hidden'}}><Hearts n={12} seed={3} w={600} h={680} kind="amor" /></div>
		<div style={{position: 'absolute', left: 620, top: 0, width: 660, height: 720, background: 'linear-gradient(200deg, #F0483E, #6E0A12)', overflow: 'hidden'}}><Hearts n={12} seed={7} w={600} h={680} kind="odio" /></div>
		<svg width={1280} height={720} style={{position: 'absolute'}}>
			<path d="M690 -10 L600 330 L680 330 L590 730 L760 300 L670 300 L760 -10 Z" fill="#FFD23F" stroke="#10131C" strokeWidth={10} strokeLinejoin="round" />
		</svg>
		<div style={{position: 'absolute', left: 20, top: 26, width: 600, display: 'flex', justifyContent: 'center'}}><Txt size={128} color="#FFE3F1">LA AMAN</Txt></div>
		<div style={{position: 'absolute', left: 680, top: 26, width: 580, display: 'flex', justifyContent: 'center'}}><Txt size={128} color="#FFE07A">LA ODIAN</Txt></div>
		<div style={{position: 'absolute', left: 80, top: 230}}><Hincha iso="img:bd" mood="feliz" size={300} scarf={['#006A4E', '#F42A41']} look={[0.6, 0]} /></div>
		<div style={{position: 'absolute', left: 900, top: 230}}><Hincha iso="img:gb-eng" mood="enfado" size={300} scarf={['#FFFFFF', '#CE1124']} look={[-0.6, 0]} /></div>
		<div style={{position: 'absolute', left: 455, top: 300}}><Hincha iso="ARG" mood="miedo" size={370} scarf={ARG} sweat /></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center'}}><Txt size={96} color="#9FD0FF">ARGENTINA</Txt></div>
	</AbsoluteFill>
);

// 2) World map tinted + question
export const T4b: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={ALL_FLAGS4} />
		<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}>
			<WorldLayer cam={{x: 2050, y: 820, z: 0.62}} vis={tinted(0.55)} />
		</div>
		<Vignette />
		<div style={{position: 'absolute', left: 36, top: 30, display: 'flex', flexDirection: 'column', gap: 10}}>
			<Txt size={96}>¿QUIÉN <span style={{color: CAT_COL.amor}}>AMA</span></Txt>
			<Txt size={96}>Y QUIÉN <span style={{color: '#FF3B30'}}>ODIA</span></Txt>
			<Txt size={96} color="#9FD0FF">A ARGENTINA?</Txt>
		</div>
		<div style={{position: 'absolute', left: 860, top: 330}}><Hincha iso="ARG" mood="miedo" size={360} scarf={ARG} sweat look={[-0.5, -0.4]} /></div>
		<div style={{position: 'absolute', left: 820, top: 300, transform: 'rotate(-18deg)'}}><Icon kind="amor" size={110} /></div>
		<div style={{position: 'absolute', left: 1130, top: 300, transform: 'rotate(14deg)'}}><Icon kind="odio" size={120} /></div>
	</AbsoluteFill>
);

// 3) Meter broken on ODIO + mystery silhouette
export const T4c: React.FC = () => {
	const b = bboxOf('ENG');
	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts /><FlagPreload flags={ALL_FLAGS4} />
			<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}>
				<WorldLayer cam={{x: b.cx - 34, y: b.cy + 6, z: 6}} vis={{}} silhouettes={[{key: 'ENG', p: 1}]}>
					<text x={b.cx - 2} y={b.cy + 8} textAnchor="middle" fontFamily="Lilita" fontSize={16} fill="#E63946" stroke="#fff" strokeWidth={1} paintOrder="stroke">?</text>
				</WorldLayer>
			</div>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(120,10,20,0.8) 100%)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 22, display: 'flex', justifyContent: 'center'}}><Txt size={100} color="#FF3B30">LA ODIA DESDE 1966</Txt></div>
			<div style={{position: 'absolute', left: 50, top: 220}}><Hincha iso="ARG" mood="enfado" size={300} scarf={ARG} sweat look={[0.7, 0]} /></div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', transform: 'scale(0.82)'}}>
				<div style={{padding: '70px 30px 20px', borderRadius: 26, background: 'rgba(11,30,63,0.94)', border: `5px solid ${C.yellow}`}}>
					<Meter v={-100} w={820} h={40} big crack={1} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

// 4) Feriado nacional
export const T4d: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #1D6B3E 0%, #0A2A18 75%)'}}>
		<Fonts /><FlagPreload flags={ALL_FLAGS4} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 24, display: 'flex', justifyContent: 'center'}}><Txt size={100}>FIESTA NACIONAL...</Txt></div>
		<div style={{position: 'absolute', left: 60, top: 170}}><Hincha iso="img:sa" mood="grito" size={360} scarf={['#006C35', '#FFFFFF']} look={[0.5, 0]} /></div>
		<div style={{position: 'absolute', left: 470, top: 160, transform: 'rotate(5deg)'}}>
			<div style={{width: 310, borderRadius: 22, overflow: 'hidden', border: `7px solid ${C.navy}`, background: '#fff', boxShadow: '0 12px 0 rgba(0,0,0,0.4)'}}>
				<div style={{background: C.red, padding: '8px 0', textAlign: 'center', fontFamily: LILITA, fontSize: 34, color: '#fff'}}>NOV 2022</div>
				<div style={{textAlign: 'center', fontFamily: LILITA, fontSize: 170, lineHeight: 1, color: C.navy, padding: '8px 0 16px'}}>23</div>
			</div>
			<div style={{position: 'absolute', left: -40, top: 150, transform: 'rotate(-12deg)', padding: '6px 16px', borderRadius: 12, border: '8px solid #E63946', fontFamily: LILITA, fontSize: 50, color: '#E63946', background: 'rgba(255,255,255,0.92)', whiteSpace: 'nowrap'}}>FERIADO</div>
		</div>
		<div style={{position: 'absolute', left: 850, top: 230}}><Hincha iso="ARG" mood="triste" size={330} scarf={ARG} sweat look={[-0.5, 0]} /></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center'}}><Txt size={110} color="#FFD23F">¡POR GANARLE!</Txt></div>
	</AbsoluteFill>
);
