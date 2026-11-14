import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WorldLayer, Vis, WORLD} from './WorldLayer5';
import {Eyes, Hincha, Mood, Mouth} from '../Hincha';
import {C} from '../data';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {ALL_FLAGS5, TOUR} from './data5';
import {FlagCover} from '../flagCover';

const SCARF: [string, string] = ['#FEDD00', '#009C3B'];
// glowing thumbnail text (white outer glow like the reference thumbnails)
export const GTxt: React.FC<{children: React.ReactNode; size: number; color?: string; glow?: string; style?: React.CSSProperties}> = ({children, size, color = '#fff', glow = '#FFFFFF', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.12}px #10131C`, paintOrder: 'stroke fill', whiteSpace: 'nowrap', filter: `drop-shadow(0 0 ${size * 0.05}px ${glow}) drop-shadow(0 0 ${size * 0.1}px ${glow}) drop-shadow(0 ${size * 0.06}px ${size * 0.06}px rgba(0,0,0,0.6))`, ...style}}>{children}</div>
);
export const Sparkle: React.FC<{x: number; y: number; s: number; c?: string}> = ({x, y, s, c = '#FFF7C2'}) => (
	<svg width={s} height={s} viewBox="-50 -50 100 100" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, overflow: 'visible', filter: `drop-shadow(0 0 ${s * 0.15}px #fff)`}}>
		<path d="M0 -50 C6 -10 10 -6 50 0 C10 6 6 10 0 50 C-6 10 -10 6 -50 0 C-10 -6 -6 -10 0 -50 Z" fill={c} />
	</svg>
);
const Vignette: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)'}} />;

// country cut-out with flag, face and a white glow halo
export const Cut: React.FC<{k: string; flag: string; h: number; mood: Mood; glow?: string; faceScale?: number; tears?: boolean; silhouette?: boolean; look?: [number, number]}> = ({k, flag, h, mood, glow = '#FFFFFF', faceScale = 1, tears, silhouette, look = [0, 0]}) => {
	const g = WORLD[k];
	const [[x0, y0], [x1, y1]] = g.b;
	const pad = 10, vw = x1 - x0 + pad * 2, vh = y1 - y0 + pad * 2;
	const [lx, ly] = g.c;
	const fs = Math.min(vw, vh) * 0.42 * faceScale;
	const boxes = g.pb?.length ? g.pb : [[x0, y0, x1, y1]];
	return (
		<svg width={(h * vw) / vh} height={h} viewBox={`${x0 - pad} ${y0 - pad} ${vw} ${vh}`} style={{overflow: 'visible', filter: `drop-shadow(0 0 ${h * 0.012}px ${glow}) drop-shadow(0 0 ${h * 0.03}px ${glow}) drop-shadow(0 0 ${h * 0.05}px ${glow}) drop-shadow(0 ${h * 0.02}px ${h * 0.01}px rgba(0,0,0,0.5))`}}>
			<defs><clipPath id={'tc' + k}><path d={g.d} /></clipPath></defs>
			{silhouette ? <path d={g.d} fill="#0A1224" /> : (
				<g clipPath={`url(#tc${k})`}>
					{boxes.map((q, i) => <FlagCover key={i} flag={flag} x={q[0] - 1} y={q[1] - 1} w={q[2] - q[0] + 2} h={q[3] - q[1] + 2} />)}
				</g>
			)}
			<path d={g.d} fill="none" stroke={silhouette ? '#E63946' : C.navy} strokeWidth={vh * (silhouette ? 0.012 : 0.008)} strokeLinejoin="round" />
			{silhouette ? (
				<text x={lx} y={ly + vh * 0.12} textAnchor="middle" fontFamily="Lilita" fontSize={vh * 0.36} fill="#E63946" stroke="#fff" strokeWidth={vh * 0.02} paintOrder="stroke">?</text>
			) : (
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
			)}
		</svg>
	);
};

const allVis = (mood: Mood, skip: string[] = []): Record<string, Vis> => Object.fromEntries(TOUR.filter((r) => !skip.includes(r.key)).map((r) => [r.key, {flag: r.flag, pop: 1, mood, look: [0, 0.2] as [number, number], faceScale: 1.1}]));
const MapBg: React.FC<{x: number; y: number; z: number; mood?: Mood; skip?: string[]; sil?: string[]}> = ({x, y, z, mood = 'feliz', skip = [], sil = []}) => (
	<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}>
		<WorldLayer cam={{x, y, z}} vis={allVis(mood, skip)} silhouettes={sil.map((k) => ({key: k, p: 1}))} />
	</div>
);

// 1) Brazil glowing in the center of a world full of flags
export const T5a: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={[...ALL_FLAGS5, 'no']} />
		<MapBg x={1500} y={1000} z={0.75} skip={['NOR']} sil={['NOR']} />
		<Vignette />
		<div style={{position: 'absolute', left: 0, right: 0, top: 18, display: 'flex', justifyContent: 'center'}}><GTxt size={92}>¿A QUÉ PAÍSES</GTxt></div>
		<div style={{position: 'absolute', left: 430, top: 125}}><Cut k="BRA" flag="br" h={430} mood="miedo" faceScale={1.3} /></div>
		<Sparkle x={430} y={200} s={70} /><Sparkle x={860} y={170} s={50} /><Sparkle x={820} y={500} s={60} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center'}}><GTxt size={100} color="#FF3B30">NUNCA GANÓ BRASIL?</GTxt></div>
	</AbsoluteFill>
);

// 2) Brazil crying vs the mystery silhouette of Norway
export const T5b: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={[...ALL_FLAGS5, 'no']} />
		<MapBg x={2080} y={330} z={1.5} skip={['NOR']} />
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0) 30%, rgba(90,8,16,0.75) 100%)'}} />
		<div style={{position: 'absolute', left: 30, top: 24}}><GTxt size={96}>BRASIL NUNCA</GTxt></div>
		<div style={{position: 'absolute', left: 30, top: 128}}><GTxt size={96} color="#FF3B30">LE HA GANADO</GTxt></div>
		<div style={{position: 'absolute', left: 760, top: 160}}><Cut k="NOR" flag="no" h={420} mood="enfado" silhouette glow="#FF4D5E" /></div>
		<Sparkle x={760} y={230} s={60} c="#FFD3D8" /><Sparkle x={1180} y={560} s={50} c="#FFD3D8" />
		<div style={{position: 'absolute', left: 40, top: 300}}><Cut k="BRA" flag="br" h={380} mood="triste" tears faceScale={1.25} look={[0.5, -0.3]} /></div>
	</AbsoluteFill>
);

// 3) the steel brick: "su único muro"
export const T5c: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1E4B8A 0%, #0B1E3F 70%, #050D1E 100%)'}}>
		<Fonts /><FlagPreload flags={[...ALL_FLAGS5, 'no']} />
		<AbsoluteFill style={{opacity: 0.18, backgroundImage: `url(${staticFile('tex/ocean.png')})`, backgroundSize: '600px 600px'}} />
		{TOUR.filter((r) => r.w > 0).slice(0, 14).map((r, i) => (
			<img key={r.key} src={staticFile(`flags/${r.flag}.svg`)} style={{position: 'absolute', left: 40 + (i % 7) * 175 + ((i * 37) % 30), top: i < 7 ? 470 + ((i * 53) % 40) : 600 + ((i * 29) % 40), width: 130, height: 86, objectFit: 'cover', border: `5px solid ${C.navy}`, borderRadius: 10, transform: `rotate(${((i * 47) % 50) - 25}deg)`, opacity: 0.9}} />
		))}
		<div style={{position: 'absolute', left: 0, right: 0, top: 18, display: 'flex', justifyContent: 'center'}}><GTxt size={100}>87 CAÍDOS...</GTxt></div>
		<div style={{position: 'absolute', left: 700, top: 170, width: 440, height: 250, borderRadius: 22, background: 'linear-gradient(160deg, #5A6577 0%, #2B3240 55%, #1A1F29 100%)', border: '9px solid #0A0E16', boxShadow: '0 0 0 6px #E63946, 0 0 60px rgba(230,57,70,0.9)'}}>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 190, color: '#E63946', WebkitTextStroke: '14px #fff', paintOrder: 'stroke fill'}}>?</div>
		</div>
		<div style={{position: 'absolute', left: 150, top: 150, transform: 'rotate(-14deg)', filter: 'drop-shadow(0 0 18px #fff) drop-shadow(0 0 36px #fff)'}}><Hincha iso="img:br" mood="ko" size={360} scarf={SCARF} /></div>
		<div style={{position: 'absolute', left: 520, top: 120, transform: 'rotate(-12deg)'}}><GTxt size={70} color={C.yellow}>¡CLONC!</GTxt></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center'}}><GTxt size={104} color="#FF3B30">...Y UNO INVENCIBLE</GTxt></div>
	</AbsoluteFill>
);

// 4) 87 vs 0 split
export const T5d: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={[...ALL_FLAGS5, 'no']} />
		<div style={{position: 'absolute', left: 0, top: 0, width: 660, height: 720, background: 'linear-gradient(160deg, #1BA34E, #0B5C2B)'}} />
		<div style={{position: 'absolute', left: 620, top: 0, width: 660, height: 720, background: 'radial-gradient(circle at 60% 45%, #7A1020, #24060C 75%)'}} />
		<svg width={1280} height={720} style={{position: 'absolute'}}>
			<path d="M690 -10 L600 330 L680 330 L590 730 L760 300 L670 300 L760 -10 Z" fill="#FFD23F" stroke="#10131C" strokeWidth={10} strokeLinejoin="round" />
		</svg>
		<div style={{position: 'absolute', left: 30, top: 26, width: 560, display: 'flex', justifyContent: 'center'}}><GTxt size={100}>BRASIL</GTxt></div>
		<div style={{position: 'absolute', left: 690, top: 26, width: 560, display: 'flex', justifyContent: 'center'}}><GTxt size={100}>???</GTxt></div>
		<div style={{position: 'absolute', left: 140, top: 150, filter: 'drop-shadow(0 0 16px #fff) drop-shadow(0 0 32px #fff)'}}><Hincha iso="img:br" mood="miedo" size={360} scarf={SCARF} sweat look={[0.6, 0]} /></div>
		<div style={{position: 'absolute', left: 780, top: 150, filter: 'drop-shadow(0 0 16px #FF3B30) drop-shadow(0 0 32px #FF3B30)'}}>
			<svg width={360} height={360} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
				<circle cx={100} cy={92} r={76} fill="#0A0A12" stroke="#FF3B30" strokeWidth={6} />
				<Eyes mood="enfado" look={[-0.6, 0]} />
				<path d="M78 124 Q100 140 122 124" fill="none" stroke="#FF3B30" strokeWidth={6} strokeLinecap="round" />
			</svg>
		</div>
		<div style={{position: 'absolute', left: 40, top: 560, width: 580, display: 'flex', justifyContent: 'center'}}><GTxt size={110} color="#2EC46B">87 SÍ</GTxt></div>
		<div style={{position: 'absolute', left: 680, top: 560, width: 560, display: 'flex', justifyContent: 'center'}}><GTxt size={110} color="#FF3B30">1 NUNCA</GTxt></div>
	</AbsoluteFill>
);

// 5) World Cup 2026 scoreboard tease
export const T5e: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={[...ALL_FLAGS5, 'no']} />
		<MapBg x={1700} y={700} z={0.62} mood="grito" skip={['NOR']} />
		<AbsoluteFill style={{background: 'rgba(8,20,40,0.45)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', justifyContent: 'center'}}>
			<div style={{display: 'flex', alignItems: 'stretch', borderRadius: 18, overflow: 'hidden', border: '6px solid #10131C', boxShadow: '0 0 20px #fff, 0 0 40px #fff, 0 10px 0 rgba(0,0,0,0.45)'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '10px 20px'}}>
					<img src={staticFile('flags/br.svg')} style={{width: 76, height: 56, borderRadius: 6, border: '3px solid #10131C', objectFit: 'cover'}} />
					<span style={{fontFamily: LILITA, fontSize: 64, color: '#10131C'}}>BRA</span>
				</div>
				<div style={{background: '#10131C', padding: '6px 28px', fontFamily: LILITA, fontSize: 90, color: '#FFD23F', display: 'flex', alignItems: 'center'}}>1 - 2</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '10px 20px'}}>
					<span style={{fontFamily: LILITA, fontSize: 64, color: '#10131C'}}>???</span>
				</div>
			</div>
		</div>
		<div style={{position: 'absolute', left: 60, top: 210}}><Cut k="BRA" flag="br" h={380} mood="triste" tears faceScale={1.3} /></div>
		<Sparkle x={70} y={250} s={60} /><Sparkle x={430} y={560} s={50} />
		<div style={{position: 'absolute', left: 520, top: 250, display: 'flex', flexDirection: 'column', gap: 14}}>
			<GTxt size={86}>NUNCA LE</GTxt>
			<GTxt size={86}>HA GANADO</GTxt>
			<GTxt size={86} color="#FF3B30">¿SABES QUIÉN?</GTxt>
		</div>
	</AbsoluteFill>
);
