import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Atlas, Face12, FaceMood, FaceSpec, Fill, INK, toScreen} from '../v12/Atlas';
import {StadiumArt} from './StadiumArt';
import {BY, LL, STADIUMS, Stadium} from './data9';

// New-style thumbnails (same look as video 12): relief map, big cartoon faces, Lilita with thin outline, no glow.
const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#FFF6E0', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.075}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.06}px 0 ${INK}`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const ISOS = Array.from(new Set(STADIUMS.map((s) => s.iso)));
const FLAGS = Array.from(new Set(STADIUMS.map((s) => s.flag)));
const flagOf = (iso: string) => STADIUMS.find((s) => s.iso === iso)!.flag;
const MapBg: React.FC<{cam: {x: number; y: number; z: number}; pins?: boolean}> = ({cam, pins}) => {
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	const moods: FaceMood[] = ['happy', 'love', 'cool', 'smug', 'shock'];
	ISOS.forEach((k, i) => { if (!WORLD[k]) return; fills[k] = {flag: flagOf(k)}; faces[k] = {mood: moods[i % moods.length], size: 0.8, max: 90}; });
	return (
		<>
			<Atlas cam={cam} fills={fills} faces={faces} />
			{pins && STADIUMS.map((s) => {
				const [x, y] = toScreen(cam, ...LL(s.lon, s.lat));
				if (x < -50 || x > 1970 || y < -50 || y > 1130) return null;
				return (
					<div key={s.key} style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -100%)', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<div style={{width: 46, height: 46, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: s.rank <= 3 ? '#FFD23F' : '#E8394A', border: `5px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<span style={{transform: 'rotate(45deg)', fontFamily: LILITA, fontSize: 22, color: s.rank <= 3 ? INK : '#fff'}}>{s.rank}</span>
						</div>
					</div>
				);
			})}
		</>
	);
};
// stadium drawing with a cartoon face on the facade
const Stad: React.FC<{s: Stadium; w: number; x: number; y: number; rot?: number; mood?: FaceMood; label?: boolean; badge?: string}> = ({s, w, x, y, rot = 0, mood, label = true, badge}) => {
	const h = w * 0.57;
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`}}>
			<div style={{position: 'absolute', inset: 0, filter: `drop-shadow(0 ${w * 0.02}px 0 ${INK}) drop-shadow(0 ${w * 0.03}px 0 rgba(0,0,0,0.35))`}}><StadiumArt art={s.art} w={w} h={h} id={'tb' + s.key} bare /></div>
			{mood && <svg width={w * 0.34} height={w * 0.34} viewBox="0 0 200 200" style={{position: 'absolute', left: w * 0.33, top: h * 0.5, overflow: 'visible'}}><Face12 mood={mood} /></svg>}
			{label && (
				<div style={{position: 'absolute', left: 0, right: 0, bottom: -w * 0.05, display: 'flex', justifyContent: 'center'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: w * 0.015, padding: `${w * 0.008}px ${w * 0.025}px`, borderRadius: w * 0.025, background: '#1B1D26', border: `${Math.max(3, w * 0.006)}px solid #fff`}}>
						<img src={staticFile(`flags/${s.flag}.svg`)} style={{width: w * 0.07, height: w * 0.047, borderRadius: 4, objectFit: 'cover', border: `2px solid ${INK}`}} />
						<span style={{fontFamily: LILITA, fontSize: w * 0.06, color: '#fff', whiteSpace: 'nowrap'}}>{s.short}</span>
					</div>
				</div>
			)}
			{badge && (
				<div style={{position: 'absolute', left: w * 0.06, top: h * 0.1, width: w * 0.17, height: w * 0.17, borderRadius: '50%', background: '#FFD23F', border: `${w * 0.012}px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-10deg)'}}>
					<span style={{fontFamily: LILITA, fontSize: w * 0.075, color: INK}}>{badge}</span>
				</div>
			)}
		</div>
	);
};
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
const Base: React.FC<{children: React.ReactNode}> = ({children}) => (
	<AbsoluteFill style={{background: '#2A72BA', overflow: 'hidden'}}>
		<Fonts />
		<FlagPreload flags={FLAGS} />
		{children}
	</AbsoluteFill>
);

// 1: LOS MEJORES ESTADIOS DEL MUNDO with Camp Nou in the middle
export const T9n1: React.FC = () => (
	<Base>
		<MapBg cam={{x: 1700, y: 760, z: 0.78}} />
		<Stad s={BY.campnou} w={1000} x={960} y={500} mood="love" badge="1º?" />
		<Spark x={430} y={360} s={70} /><Spark x={1500} y={330} s={60} /><Spark x={1560} y={720} s={44} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', justifyContent: 'center'}}><Txt size={140}>LOS MEJORES ESTADIOS</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center'}}><Txt size={150} color="#FF4D5E">DEL MUNDO</Txt></div>
	</Base>
);
// 2: VS Camp Nou vs Bernabéu with Spain worried in the middle
export const T9n2: React.FC = () => (
	<Base>
		<div style={{position: 'absolute', left: 0, top: 0, width: 1000, height: 1080, background: 'linear-gradient(160deg, #3E6FD6, #1D3E8F)'}} />
		<div style={{position: 'absolute', right: 0, top: 0, width: 1000, height: 1080, background: 'linear-gradient(200deg, #F4F4F4, #B9C3D6)', clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)'}} />
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><path d="M1010 0 L900 470 L1010 470 L880 1080" fill="none" stroke="#fff" strokeWidth={26} strokeLinejoin="round" /><path d="M1010 0 L900 470 L1010 470 L880 1080" fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round" /></svg>
		<Stad s={BY.campnou} w={820} x={480} y={600} rot={-4} mood="smug" />
		<Stad s={BY.bernabeu} w={820} x={1450} y={600} rot={4} mood="angry" />
		<div style={{position: 'absolute', left: 960 - 120, top: 470, width: 240, height: 240, borderRadius: '50%', background: '#FFD23F', border: `10px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)'}}><Txt size={120} color="#E8394A">VS</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', justifyContent: 'center'}}><Txt size={112}>¿EL MEJOR ESTADIO DEL MUNDO?</Txt></div>
	</Base>
);
// 3: TOP 20 ESTADIOS with three stadiums and rank badges
export const T9n3: React.FC = () => (
	<Base>
		<MapBg cam={{x: 1500, y: 900, z: 0.6}} />
		<Stad s={BY.maracana} w={620} x={960} y={600} mood="happy" badge="3º" />
		<Stad s={BY.bombonera} w={520} x={390} y={720} rot={-5} mood="shock" badge="5º" />
		<Stad s={BY.wembley} w={520} x={1530} y={720} rot={5} mood="cool" badge="6º" />
		<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', justifyContent: 'center', gap: 30, alignItems: 'baseline'}}><Txt size={190} color="#FFD23F">TOP 20</Txt><Txt size={130}>ESTADIOS</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center'}}><Txt size={96}>¿CUÁL ES EL Nº 1?</Txt></div>
	</Base>
);
// 4: map with the 20 pins
export const T9n4: React.FC = () => (
	<Base>
		<MapBg cam={{x: 1700, y: 760, z: 0.72}} pins />
		<Stad s={BY.azteca} w={560} x={1530} y={790} rot={4} mood="love" badge="4º" />
		<Spark x={1250} y={640} s={60} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
			<Txt size={120}>¿DÓNDE ESTÁN LOS</Txt>
			<Txt size={120} color="#FFD23F">MEJORES ESTADIOS?</Txt>
		</div>
	</Base>
);
// 5: Argentina vs England — Bombonera or Wembley
export const T9n5: React.FC = () => (
	<Base>
		<MapBg cam={{x: 2200, y: 900, z: 0.7}} />
		<CountryFace k="ARG" flag="ar" x={270} y={600} w={300} mood="smug" rot={-4} />
		<CountryFace k="ENG" flag="gb-eng" x={1690} y={560} w={360} mood="angry" rot={4} />
		<Stad s={BY.bombonera} w={560} x={700} y={720} rot={-3} />
		<Stad s={BY.wembley} w={560} x={1230} y={720} rot={3} />
		<div style={{position: 'absolute', left: 960 - 90, top: 610, width: 180, height: 180, borderRadius: '50%', background: '#FFD23F', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)'}}><Txt size={100} color="#E8394A">?</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
			<Txt size={118}>LOS MEJORES ESTADIOS</Txt>
			<Txt size={96} color="#FF4D5E">¿BOMBONERA O WEMBLEY?</Txt>
		</div>
	</Base>
);
