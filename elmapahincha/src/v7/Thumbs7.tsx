import React from 'react';
import {AbsoluteFill} from 'remotion';
import {WorldLayer, Vis} from '../v5/WorldLayer5';
import {Hincha, Mood} from '../Hincha';
import {C} from '../data';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {GTxt, Sparkle, Cut} from '../v5/Thumbs5';
import {Trophy} from '../common';
import {ALL_FLAGS7} from './data7';
import {FlagCover} from '../flagCover';

const ARG_SC: [string, string] = ['#74ACDF', '#FFFFFF'];
const ESP_SC: [string, string] = ['#AA151B', '#F1BF00'];
const V = (m: Record<string, [string, Mood]>): Record<string, Vis> => Object.fromEntries(Object.entries(m).map(([k, [flag, mood]]) => [k, {flag, pop: 1, mood, faceScale: 1.1}]));
const SA = V({BRA: ['br', 'enfado'], URY: ['uy', 'triste'], CHL: ['cl', 'feliz'], PRY: ['py', 'feliz'], BOL: ['bo', 'feliz'], PER: ['pe', 'feliz']});
const MapBg: React.FC<{x: number; y: number; z: number; vis?: Record<string, Vis>; dim?: number}> = ({x, y, z, vis = SA, dim = 0}) => (
	<>
		<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}><WorldLayer cam={{x, y, z}} vis={vis} /></div>
		{dim > 0 && <AbsoluteFill style={{background: `rgba(8,20,40,${dim})`}} />}
	</>
);
const Vignette: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)'}} />;
const Star: React.FC<{s: number; on?: boolean}> = ({s, on = true}) => (
	<svg width={s} height={s} viewBox="-50 -50 100 100" style={{overflow: 'visible', filter: on ? 'drop-shadow(0 0 8px #FFD23F) drop-shadow(0 0 18px #fff)' : undefined}}>
		<path d="M0 -46 L13 -14 L47 -14 L19 7 L29 41 L0 21 L-29 41 L-19 7 L-47 -14 L-13 -14 Z" fill={on ? '#FFD23F' : 'rgba(255,255,255,0.18)'} stroke="#10131C" strokeWidth={7} strokeLinejoin="round" />
	</svg>
);
const FlagBox: React.FC<{f: string; w: number}> = ({f, w}) => (
	<svg width={w} height={w * 0.72} style={{borderRadius: w * 0.08, border: '5px solid #10131C', overflow: 'hidden'}} viewBox={`0 0 ${w} ${w * 0.72}`}><FlagCover flag={f} x={0} y={0} w={w} h={w * 0.72} /></svg>
);
const Score: React.FC<{a: string; b: string; fa: string; fb: string; s: string; glow: string; scale?: number; strike?: boolean}> = ({a, b, fa, fb, s, glow, scale = 1, strike}) => (
	<div style={{position: 'relative', display: 'flex', alignItems: 'stretch', borderRadius: 22 * scale, overflow: 'hidden', border: `${7 * scale}px solid #10131C`, boxShadow: `0 0 ${24 * scale}px ${glow}, 0 0 ${50 * scale}px ${glow}`, transform: `scale(${scale})`}}>
		<div style={{display: 'flex', alignItems: 'center', gap: 14, background: '#fff', padding: '12px 22px'}}><FlagBox f={fa} w={84} /><span style={{fontFamily: LILITA, fontSize: 70, color: C.navy}}>{a}</span></div>
		<div style={{background: C.navy, padding: '6px 28px', fontFamily: LILITA, fontSize: 96, color: C.yellow, display: 'flex', alignItems: 'center'}}>{s}</div>
		<div style={{display: 'flex', alignItems: 'center', gap: 14, background: '#fff', padding: '12px 22px'}}><span style={{fontFamily: LILITA, fontSize: 70, color: C.navy}}>{b}</span><FlagBox f={fb} w={84} /></div>
		{strike && <div style={{position: 'absolute', left: -20, right: -20, top: '46%', height: 18, background: '#FF3B30', border: '4px solid #10131C', transform: 'rotate(-8deg)'}} />}
	</div>
);

// 1) Argentina glowing with 4 stars
export const T7a: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={ALL_FLAGS7} />
		<MapBg x={1300} y={1280} z={1.0} dim={0.25} />
		<Vignette />
		<div style={{position: 'absolute', left: 40, top: 30}}><GTxt size={92}>¿Y SI ARGENTINA</GTxt></div>
		<div style={{position: 'absolute', left: 40, top: 150}}><GTxt size={92} color="#74ACDF">GANABA</GTxt></div>
		<div style={{position: 'absolute', left: 40, top: 560}}><GTxt size={100} color={C.yellow}>EL MUNDIAL 2026?</GTxt></div>
		<div style={{position: 'absolute', left: 860, top: 120}}><Cut k="ARG" flag="ar" h={560} mood="grito" faceScale={1.3} /></div>
		<div style={{position: 'absolute', left: 820, top: 30, display: 'flex', gap: 6}}>{[0, 1, 2, 3].map((i) => <div key={i} style={{transform: `translateY(${i === 1 || i === 2 ? -14 : 0}px)`}}><Star s={86} /></div>)}</div>
		<Sparkle x={820} y={300} s={60} /><Sparkle x={1210} y={520} s={50} /><Sparkle x={1190} y={210} s={40} />
	</AbsoluteFill>
);

// 2) the score flips
export const T7b: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={ALL_FLAGS7} />
		<MapBg x={1190} y={520} z={4} dim={0.45} vis={{}} />
		<Vignette />
		<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', justifyContent: 'center'}}><Score a="ESP" b="ARG" fa="es" fb="ar" s="1-0" glow="#FF3B30" scale={0.85} strike /></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 210, display: 'flex', justifyContent: 'center'}}>
			<svg width={120} height={110} viewBox="0 0 120 110" style={{filter: 'drop-shadow(0 0 12px #fff)'}}><path d="M40 5 H80 V55 H112 L60 105 L8 55 H40 Z" fill={C.yellow} stroke="#10131C" strokeWidth={9} strokeLinejoin="round" /></svg>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 340, display: 'flex', justifyContent: 'center'}}><Score a="ARG" b="ESP" fa="ar" fb="es" s="1-0" glow="#FFFFFF" scale={1.15} /></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}><GTxt size={104} color="#74ACDF">¿QUÉ HABRÍA CAMBIADO?</GTxt></div>
		<Sparkle x={250} y={420} s={60} /><Sparkle x={1050} y={360} s={50} />
	</AbsoluteFill>
);

// 3) two timelines
export const T7c: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={ALL_FLAGS7} />
		<div style={{position: 'absolute', left: 0, top: 0, width: 640, height: 720, background: 'linear-gradient(160deg, #C8202A, #4E070B)'}} />
		<div style={{position: 'absolute', left: 640, top: 0, width: 640, height: 720, background: 'linear-gradient(200deg, #8CC4F0, #24427E)'}} />
		<div style={{position: 'absolute', left: 630, top: 0, width: 20, height: 720, background: '#fff', boxShadow: '0 0 30px #fff, 0 0 60px #fff'}} />
		<div style={{position: 'absolute', left: 0, width: 640, top: 22, display: 'flex', justifyContent: 'center'}}><GTxt size={72}>REALIDAD</GTxt></div>
		<div style={{position: 'absolute', left: 640, width: 640, top: 22, display: 'flex', justifyContent: 'center'}}><GTxt size={72} color={C.yellow}>¿Y SI...?</GTxt></div>
		{[['es', ESP_SC, 2, 0, 'grito'], ['ar', ARG_SC, 4, 640, 'grito']].map(([f, sc, n, x, m]) => (
			<div key={f as string} style={{position: 'absolute', left: x as number, width: 640, top: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
				<div style={{filter: 'drop-shadow(0 0 14px #fff) drop-shadow(0 0 30px #fff)'}}><Hincha iso={`img:${f}`} mood={m as Mood} size={300} scarf={sc as [string, string]} /></div>
				<div style={{display: 'flex', gap: 6}}>{Array.from({length: n as number}).map((_, i) => <Star key={i} s={74} />)}</div>
			</div>
		))}
		<div style={{position: 'absolute', left: 0, right: 0, top: 580, display: 'flex', justifyContent: 'center'}}><GTxt size={96}>CAMPEONA 2026</GTxt></div>
	</AbsoluteFill>
);

// 4) bicampeona: two trophies
export const T7d: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={ALL_FLAGS7} />
		<MapBg x={1330} y={1250} z={1.1} dim={0.4} />
		<Vignette />
		<div style={{position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', justifyContent: 'center'}}><GTxt size={110}>¿BICAMPEONA?</GTxt></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 190, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 30}}>
			<div style={{textAlign: 'center'}}><div style={{filter: 'drop-shadow(0 0 16px #FFD23F) drop-shadow(0 0 30px #fff)'}}><Trophy size={230} /></div><GTxt size={70} color={C.yellow}>2022</GTxt></div>
			<div style={{filter: 'drop-shadow(0 0 16px #fff) drop-shadow(0 0 32px #fff)'}}><Hincha iso="img:ar" mood="grito" size={290} scarf={ARG_SC} /></div>
			<div style={{textAlign: 'center'}}><div style={{filter: 'drop-shadow(0 0 16px #FFD23F) drop-shadow(0 0 30px #fff)'}}><Trophy size={230} /></div><GTxt size={70} color="#74ACDF">2026?</GTxt></div>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center'}}><GTxt size={84} color="#FF3B30">SOLO 2 PAÍSES LO HAN LOGRADO</GTxt></div>
		<Sparkle x={260} y={260} s={60} /><Sparkle x={1030} y={230} s={54} />
	</AbsoluteFill>
);

// 5) rewind tape
export const T7e: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={ALL_FLAGS7} />
		<MapBg x={1300} y={1280} z={1.0} dim={0.35} />
		<AbsoluteFill style={{opacity: 0.25, backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.55) 0px, rgba(255,255,255,0.55) 1px, transparent 1px, transparent 4px)'}} />
		<Vignette />
		<div style={{position: 'absolute', left: 36, top: 28, fontFamily: 'monospace', fontWeight: 900, fontSize: 64, color: '#fff', textShadow: '4px 0 0 #ff2a6d, -4px 0 0 #05d9e8, 0 0 20px #fff'}}>◀◀ REW</div>
		<div style={{position: 'absolute', left: 40, top: 150}}><GTxt size={96}>REBOBINAMOS</GTxt></div>
		<div style={{position: 'absolute', left: 40, top: 270}}><GTxt size={96} color={C.yellow}>LA FINAL</GTxt></div>
		<div style={{position: 'absolute', left: 40, top: 430, display: 'flex', alignItems: 'center', gap: 20}}>
			<div style={{filter: 'drop-shadow(0 0 14px #FFD23F) drop-shadow(0 0 28px #fff)'}}><Trophy size={200} /></div>
			<GTxt size={80} color="#74ACDF">→ ARGENTINA</GTxt>
		</div>
		<div style={{position: 'absolute', left: 860, top: 130}}><Cut k="ARG" flag="ar" h={540} mood="grito" faceScale={1.3} /></div>
		<Sparkle x={850} y={180} s={56} /><Sparkle x={1200} y={560} s={50} />
	</AbsoluteFill>
);
