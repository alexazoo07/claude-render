import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WorldLayer, Vis, WORLD} from '../v5/WorldLayer5';
import {Eyes, Hincha, Mood, Mouth} from '../Hincha';
import {C} from '../data';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {ALL_FLAGS8, NEVER, TOUR} from './data8';
import {FlagCover} from '../flagCover';

// plain thumbnail style (like the Argentina video): stroke + hard shadow, no glow
const SCARF: [string, string] = ['#006847', '#CE1126'];
const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#fff', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.11}px #10131C`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.07}px 0 #10131C, 0 ${size * 0.1}px ${size * 0.12}px rgba(0,0,0,0.55)`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const Vignette: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)'}} />;
const NEVER_KEYS = NEVER.map((r) => r.key);

const Cut: React.FC<{k: string; flag: string; h: number; mood: Mood; faceScale?: number; tears?: boolean; look?: [number, number]}> = ({k, flag, h, mood, faceScale = 1, tears, look = [0, 0]}) => {
	const g = WORLD[k];
	const [[x0, y0], [x1, y1]] = g.b;
	const pad = 10, vw = x1 - x0 + pad * 2, vh = y1 - y0 + pad * 2;
	const [lx, ly] = g.c;
	const fs = Math.min(vw, vh) * 0.42 * faceScale;
	const boxes = g.pb?.length ? g.pb : [[x0, y0, x1, y1]];
	return (
		<svg width={(h * vw) / vh} height={h} viewBox={`${x0 - pad} ${y0 - pad} ${vw} ${vh}`} style={{overflow: 'visible', filter: `drop-shadow(0 ${h * 0.025}px 0 rgba(0,0,0,0.5))`}}>
			<defs><clipPath id={'t8' + k}><path d={g.d} /></clipPath></defs>
			<path d={g.d} fill="#fff" stroke="#fff" strokeWidth={vh * 0.03} strokeLinejoin="round" />
			<g clipPath={`url(#t8${k})`}>{boxes.map((q, i) => <FlagCover key={i} flag={flag} x={q[0] - 1} y={q[1] - 1} w={q[2] - q[0] + 2} h={q[3] - q[1] + 2} />)}</g>
			<path d={g.d} fill="none" stroke={C.navy} strokeWidth={vh * 0.009} strokeLinejoin="round" />
			<g transform={`translate(${lx} ${ly}) scale(${fs / 100}) translate(-100 -98)`}>
				<Eyes mood={mood} look={look} />
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

const beatenVis = (mood: Mood): Record<string, Vis> => Object.fromEntries(TOUR.filter((r) => r.st !== 'never' && r.key !== 'MEX').map((r) => [r.key, {flag: r.flag, pop: 1, mood, look: [0, 0.2] as [number, number]}]));
const MapBg: React.FC<{x: number; y: number; z: number; mood?: Mood; sil?: boolean}> = ({x, y, z, mood = 'feliz', sil = true}) => (
	<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}>
		<WorldLayer cam={{x, y, z}} vis={beatenVis(mood)} silhouettes={sil ? NEVER_KEYS.map((k) => ({key: k, p: 1})) : []} />
	</div>
);
const LCard: React.FC<{flag: string; name: string; n: string; w: number; back?: boolean; stamp?: boolean}> = ({flag, name, n, w, back, stamp}) => {
	const k = w / 200, h = w * 1.21;
	if (back) {
		return (
			<div style={{width: w, height: h, borderRadius: 14 * k, background: 'repeating-linear-gradient(45deg, #C2185B 0 14px, #A0124B 14px 28px)', border: `${6 * k}px solid #10131C`, boxShadow: '0 8px 0 rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>
				<div style={{width: w * 0.6, height: w * 0.6, borderRadius: '50%', background: '#FFF6E0', border: `${5 * k}px solid #10131C`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 92 * k, color: '#E63946'}}>?</div>
			</div>
		);
	}
	return (
		<div style={{position: 'relative', width: w, height: h, borderRadius: 14 * k, background: '#FFF6E0', border: `${6 * k}px solid #10131C`, boxShadow: '0 10px 0 rgba(0,0,0,0.45)', padding: 8 * k, boxSizing: 'border-box', display: 'flex', flexDirection: 'column'}}>
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 30 * k}}>
				<span style={{fontFamily: LILITA, fontSize: 28 * k, color: '#10131C'}}>{n}</span>
				<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 12 * k, letterSpacing: 1.5 * k, color: '#C2185B'}}>LOTERÍA</span>
			</div>
			<div style={{flex: 1, borderRadius: 8 * k, overflow: 'hidden', border: `${4 * k}px solid #10131C`, margin: `${4 * k}px 0`}}>
				<img src={staticFile(`flags/${flag}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</div>
			<div style={{height: 34 * k, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 25 * k, color: '#10131C'}}>{name}</div>
			{stamp && <div style={{position: 'absolute', left: -30 * k, top: 95 * k, transform: 'rotate(-18deg)', padding: `${2 * k}px ${16 * k}px`, border: `${8 * k}px solid #E63946`, borderRadius: 14 * k, fontFamily: LILITA, fontSize: 62 * k, color: '#E63946', background: 'rgba(255,246,224,0.92)', whiteSpace: 'nowrap'}}>NUNCA</div>}
		</div>
	);
};

// 1) PAÍSES QUE MÉXICO NUNCA HA GANADO — crying Mexico over the world map
export const T8a: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={ALL_FLAGS8} />
		<MapBg x={1900} y={700} z={0.62} />
		<Vignette />
		<div style={{position: 'absolute', left: 0, right: 0, top: 22, display: 'flex', justifyContent: 'center'}}><Txt size={100}>PAÍSES QUE MÉXICO</Txt></div>
		<div style={{position: 'absolute', left: 390, top: 150}}><Cut k="MEX" flag="mx" h={400} mood="triste" tears faceScale={1.4} /></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center'}}><Txt size={104} color="#FF3B30">NUNCA HA GANADO</Txt></div>
	</AbsoluteFill>
);

// 2) Split MÉXICO vs ESPAÑA: 0 victorias en 7 partidos
export const T8b: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={ALL_FLAGS8} />
		<div style={{position: 'absolute', left: 0, top: 0, width: 660, height: 720, background: 'linear-gradient(160deg, #0F8A4C, #064A28)'}} />
		<div style={{position: 'absolute', left: 620, top: 0, width: 660, height: 720, background: 'linear-gradient(160deg, #D21A2C, #7A0B16)'}} />
		<svg width={1280} height={720} style={{position: 'absolute'}}>
			<path d="M690 -10 L600 330 L680 330 L590 730 L760 300 L670 300 L760 -10 Z" fill="#FFD23F" stroke="#10131C" strokeWidth={10} strokeLinejoin="round" />
		</svg>
		<div style={{position: 'absolute', left: 30, top: 30, width: 560, display: 'flex', justifyContent: 'center'}}><Txt size={96}>MÉXICO</Txt></div>
		<div style={{position: 'absolute', left: 690, top: 30, width: 560, display: 'flex', justifyContent: 'center'}}><Txt size={96} color="#FFD23F">ESPAÑA</Txt></div>
		<div style={{position: 'absolute', left: 140, top: 150}}><Hincha iso="img:mx" mood="triste" size={350} scarf={SCARF} sweat look={[0.6, 0]} /></div>
		<div style={{position: 'absolute', left: 790, top: 150}}><Hincha iso="img:es" mood="grito" size={350} scarf={['#C60B1E', '#FFC400']} look={[-0.6, 0]} /></div>
		<div style={{position: 'absolute', left: 40, top: 540, width: 580, display: 'flex', justifyContent: 'center'}}><Txt size={120} color="#FF3B30">0 V</Txt></div>
		<div style={{position: 'absolute', left: 680, top: 540, width: 560, display: 'flex', justifyContent: 'center'}}><Txt size={120} color="#2EC46B">4 V</Txt></div>
	</AbsoluteFill>
);

// 3) Lotería: Spain card stamped NUNCA + 12 face-down cards
export const T8c: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #8E1B4E 0%, #4A0D2A 60%, #22050F 100%)'}}>
		<Fonts /><FlagPreload flags={ALL_FLAGS8} />
		<div style={{position: 'absolute', left: 60, top: 140, transform: 'rotate(-5deg)'}}><LCard flag="es" name="ESPAÑA" n="1" w={330} stamp /></div>
		<div style={{position: 'absolute', left: 470, top: 175, display: 'grid', gridTemplateColumns: 'repeat(4, 150px)', gap: 18}}>
			{Array.from({length: 8}).map((_, j) => <div key={j} style={{transform: `rotate(${((j % 3) - 1) * 4}deg)`}}><LCard flag="es" name="" n="" w={150} back /></div>)}
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 18, display: 'flex', justifyContent: 'center'}}><Txt size={96}>MÉXICO NUNCA LES</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center'}}><Txt size={104} color="#FF3B30">HA GANADO</Txt></div>
		<div style={{position: 'absolute', left: 1135, top: 250, transform: 'rotate(10deg)', display: 'flex', flexDirection: 'column', alignItems: 'center'}}><Txt size={150} color="#FFD23F">13</Txt></div>
	</AbsoluteFill>
);

// 4) "¿A QUIÉN NUNCA HA GANADO?" world map + big angry Mexico head
export const T8d: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={ALL_FLAGS8} />
		<MapBg x={1950} y={760} z={0.62} mood="grito" />
		<Vignette />
		<div style={{position: 'absolute', left: 36, top: 36, display: 'flex', flexDirection: 'column', gap: 14}}>
			<Txt size={100}>¿A QUIÉN</Txt>
			<Txt size={100} color="#FF3B30">NUNCA HA</Txt>
			<Txt size={100} color="#FF3B30">GANADO?</Txt>
		</div>
		<div style={{position: 'absolute', left: 820, top: 330}}><Hincha iso="img:mx" mood="enfado" size={380} scarf={SCARF} sweat look={[-0.4, -0.4]} /></div>
	</AbsoluteFill>
);

// 5) Scoreboard MEX 1-7 ESP (1928) + "¿Y LAS OTRAS 12?"
export const T8e: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #3A1020 0%, #14060C 75%)'}}>
		<Fonts /><FlagPreload flags={ALL_FLAGS8} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center'}}>
			<div style={{display: 'flex', alignItems: 'stretch', borderRadius: 18, overflow: 'hidden', border: '6px solid #10131C', boxShadow: '0 10px 0 rgba(0,0,0,0.45)'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '10px 20px'}}>
					<img src={staticFile('flags/mx.svg')} style={{width: 70, height: 52, borderRadius: 6, border: '3px solid #10131C', objectFit: 'cover'}} />
					<span style={{fontFamily: LILITA, fontSize: 60, color: '#10131C'}}>MEX</span>
				</div>
				<div style={{background: '#10131C', padding: '6px 28px', fontFamily: LILITA, fontSize: 84, color: '#FFD23F', display: 'flex', alignItems: 'center'}}>1 - 7</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '10px 20px'}}>
					<span style={{fontFamily: LILITA, fontSize: 60, color: '#10131C'}}>ESP</span>
					<img src={staticFile('flags/es.svg')} style={{width: 70, height: 52, borderRadius: 6, border: '3px solid #10131C', objectFit: 'cover'}} />
				</div>
			</div>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 160, display: 'flex', justifyContent: 'center'}}><Txt size={40} color="#FFD23F">1928 · 7 PARTIDOS · 0 VICTORIAS</Txt></div>
		<div style={{position: 'absolute', left: 90, top: 230}}><Hincha iso="img:mx" mood="triste" size={340} scarf={SCARF} sweat /></div>
		<div style={{position: 'absolute', left: 480, top: 250, display: 'flex', flexDirection: 'column', gap: 18}}>
			<Txt size={96}>NUNCA LE</Txt>
			<Txt size={96}>HA GANADO</Txt>
			<Txt size={84} color="#FF3B30">¿Y A QUIÉN MÁS?</Txt>
		</div>
	</AbsoluteFill>
);
