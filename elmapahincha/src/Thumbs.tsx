import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MapLayer, FaceState, labelPt} from './MapLayer';
import {Eyes, Mood, Mouth} from './Hincha';
import {Flag, Iso} from './flags';
import {C, GEO, P, TEAMS} from './data';
import {Fonts, LILITA} from './fonts';

const ALL = TEAMS.map((t) => t.iso);
const OWN = Object.fromEntries(ALL.map((i) => [i, i])) as Record<Iso, Iso>;

// Big country cut-out with flag, face and glow
const CountryCut: React.FC<{iso: Iso; h: number; mood: Mood; glow?: string; look?: [number, number]; faceScale?: number; tears?: boolean; style?: React.CSSProperties}> = ({iso, h, mood, glow = '#FFD23F', look = [0, 0], faceScale = 1, tears, style}) => {
	const g = GEO.teams[iso];
	const [[x0, y0], [x1, y1]] = g.b;
	const pad = 12;
	const vw = x1 - x0 + pad * 2, vh = y1 - y0 + pad * 2;
	const w = (h * vw) / vh;
	const [lx, ly] = labelPt(iso);
	const fs = Math.min(vw, vh) * 0.42 * faceScale;
	const id = 'cc' + iso;
	return (
		<svg width={w} height={h} viewBox={`${x0 - pad} ${y0 - pad} ${vw} ${vh}`} style={{overflow: 'visible', filter: `drop-shadow(0 0 ${h * 0.02}px ${glow}) drop-shadow(0 0 ${h * 0.02}px ${glow}) drop-shadow(0 ${h * 0.025}px 0 rgba(0,0,0,0.45))`, ...style}}>
			<defs>
				<clipPath id={id}><path d={g.d} /></clipPath>
			</defs>
			<path d={g.d} fill="none" stroke={glow} strokeWidth={vh * 0.022} strokeLinejoin="round" />
			<g clipPath={`url(#${id})`}>
				<Flag iso={iso} x={x0} y={y0} w={x1 - x0} h={y1 - y0} />
			</g>
			<path d={g.d} fill="none" stroke={C.navy} strokeWidth={vh * 0.008} strokeLinejoin="round" />
			<g transform={`translate(${lx} ${ly}) scale(${fs / 100}) translate(-100 -98)`}>
				<Eyes mood={mood} look={look} />
				<Mouth mood={mood} open={1} />
				{tears && (
					<g fill="#5BC0FF" stroke={C.navy} strokeWidth={3}>
						<path d="M70 106 q-6 22 0 40 q8 -18 0 -40 Z" />
						<path d="M130 106 q-6 22 0 40 q8 -18 0 -40 Z" />
					</g>
				)}
			</g>
		</svg>
	);
};

const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; stroke?: number; style?: React.CSSProperties}> = ({children, size, color = '#fff', stroke, style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${stroke ?? size * 0.11}px #10131C`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.07}px 0 #10131C, 0 ${size * 0.1}px ${size * 0.12}px rgba(0,0,0,0.55)`, letterSpacing: size * 0.01, whiteSpace: 'nowrap', ...style}}>{children}</div>
);

const Sparkle: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<svg width={s} height={s} viewBox="0 0 40 40" style={{position: 'absolute', left: x, top: y}}>
		<path d="M20 0 C22 14 26 18 40 20 C26 22 22 26 20 40 C18 26 14 22 0 20 C14 18 18 14 20 0 Z" fill="#FFF3B0" stroke="#10131C" strokeWidth={2} />
	</svg>
);

const Vignette: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)'}} />;

const bgFaces = (mood: Mood, look: [number, number] = [0, 0], skip: Iso[] = []): Partial<Record<Iso, FaceState>> =>
	Object.fromEntries(ALL.filter((i) => !skip.includes(i)).map((i, k) => [i, {mood, look, blink: 0, open: 1, scale: 1}]));

// 1) 10 SELECCIONES · ¡SOLO 1 SOBREVIVE!  (close map, giant angry eyes)
export const Thumb1: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts />
		<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080, transform: 'scale(1.0)'}}>
			<MapLayer cam={{x: 870, y: 420, z: 2.0}} owners={OWN} faces={Object.fromEntries(ALL.map((i) => [i, {mood: 'enfado' as Mood, look: [0, 0.3] as [number, number], scale: 1.9}]))} />
		</div>
		<Vignette />
		<div style={{position: 'absolute', left: 0, right: 0, top: 205, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
			<Txt size={132}>10 SELECCIONES</Txt>
			<Txt size={118} color="#FF3B30">¡SOLO 1 SOBREVIVE!</Txt>
		</div>
	</AbsoluteFill>
);

// 2) Split screen ARGENTINA #2 vs BRASIL #6
export const Thumb2: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts />
		<div style={{position: 'absolute', left: 0, top: 0, width: 660, height: 720, overflow: 'hidden', background: 'linear-gradient(160deg, #2C8BE0, #11508F)'}}>
			<div style={{position: 'absolute', inset: 0, opacity: 0.25, backgroundImage: 'repeating-radial-gradient(circle at 30% 120%, transparent 0 18px, rgba(255,255,255,0.5) 18px 21px)'}} />
		</div>
		<div style={{position: 'absolute', left: 620, top: 0, width: 660, height: 720, overflow: 'hidden', background: 'linear-gradient(200deg, #1BA34E, #0B5C2B)'}}>
			<div style={{position: 'absolute', inset: 0, opacity: 0.25, backgroundImage: 'repeating-radial-gradient(circle at 70% 120%, transparent 0 18px, rgba(255,255,255,0.5) 18px 21px)'}} />
		</div>
		<svg width={1280} height={720} style={{position: 'absolute'}}>
			<path d="M690 -10 L600 330 L680 330 L590 730 L760 300 L670 300 L760 -10 Z" fill="#FFD23F" stroke="#10131C" strokeWidth={10} strokeLinejoin="round" />
		</svg>
		<div style={{position: 'absolute', left: 30, top: 30, width: 560, display: 'flex', justifyContent: 'center'}}><Txt size={96}>ARGENTINA</Txt></div>
		<div style={{position: 'absolute', left: 690, top: 30, width: 560, display: 'flex', justifyContent: 'center'}}><Txt size={96}>BRASIL</Txt></div>
		<div style={{position: 'absolute', left: 150, top: 150}}><CountryCut iso="ARG" h={460} mood="enfado" look={[0.6, 0]} faceScale={2.2} /></div>
		<div style={{position: 'absolute', left: 735, top: 175}}><CountryCut iso="BRA" h={400} mood="grito" look={[-0.6, 0]} faceScale={1.25} /></div>
		<div style={{position: 'absolute', left: 40, top: 560, width: 300, display: 'flex', justifyContent: 'center'}}><Txt size={120} color="#FFD23F">#2</Txt></div>
		<div style={{position: 'absolute', left: 940, top: 560, width: 300, display: 'flex', justifyContent: 'center'}}><Txt size={120} color="#FFD23F">#6</Txt></div>
	</AbsoluteFill>
);

// 3) ¿QUIÉN CONQUISTA SUDAMÉRICA? (mystery silhouette)
export const Thumb3: React.FC = () => {
	const q = P(-60, -16);
	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}>
				<MapLayer cam={{x: 760, y: 560, z: 0.82}} owners={OWN} faces={{}} silhouette={1}>
					{Object.keys(GEO.teams).map((c) => (
						<path key={c} d={GEO.teams[c as Iso].d} fill="none" stroke="#FFD23F" strokeWidth={10} strokeLinejoin="round" opacity={0.9} />
					))}
					{Object.keys(GEO.teams).map((c) => (
						<path key={'f' + c} d={GEO.teams[c as Iso].d} fill="#0A1224" />
					))}
					<g transform={`translate(${q[0]} ${q[1]})`}>
						<text x={0} y={120} textAnchor="middle" fontFamily="Lilita" fontSize={420} fill="#FFD23F" stroke="#10131C" strokeWidth={14} paintOrder="stroke">?</text>
						<g transform="translate(-150 -330) scale(1.5)">
							<ellipse cx={76} cy={84} rx={17} ry={21} fill="#fff" stroke="#10131C" strokeWidth={5} />
							<ellipse cx={124} cy={84} rx={17} ry={21} fill="#fff" stroke="#10131C" strokeWidth={5} />
							<circle cx={82} cy={90} r={8} fill="#10131C" />
							<circle cx={118} cy={90} r={8} fill="#10131C" />
							<path d="M54 60 L94 74 M146 60 L106 74" fill="none" stroke="#FFD23F" strokeWidth={8} strokeLinecap="round" />
						</g>
					</g>
				</MapLayer>
			</div>
			<Vignette />
			<div style={{position: 'absolute', left: 36, top: 120, display: 'flex', flexDirection: 'column', gap: 14}}>
				<Txt size={112}>¿QUIÉN</Txt>
				<Txt size={112}>CONQUISTA</Txt>
				<Txt size={112} color="#FF3B30">SUDAMÉRICA?</Txt>
			</div>
		</AbsoluteFill>
	);
};

// 4) Protagonist like "PAÍSES QUE ... ": ¿QUIÉN FRENA A ARGENTINA?
export const Thumb4: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts />
		<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}>
			<MapLayer cam={{x: 960, y: 560, z: 1.05}} owners={OWN} faces={bgFaces('miedo', [0, 0.5], ['ARG'])} dim={0.45} />
		</div>
		<Vignette />
		<div style={{position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', justifyContent: 'center'}}><Txt size={112}>¿QUIÉN FRENA A</Txt></div>
		<div style={{position: 'absolute', left: 470, top: 148}}><CountryCut iso="ARG" h={430} mood="grito" faceScale={2.4} /></div>
		<Sparkle x={420} y={210} s={60} /><Sparkle x={760} y={180} s={44} /><Sparkle x={780} y={470} s={54} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center'}}><Txt size={112} color="#FF3B30">ARGENTINA?</Txt></div>
	</AbsoluteFill>
);

// 5) IMPERIALISMO SUDAMERICANO with ARG vs BRA face to face on the map
export const Thumb5: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts />
		<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}>
			<MapLayer cam={{x: 960, y: 560, z: 0.95}} owners={OWN} faces={bgFaces('miedo', [0, -0.6], ['ARG', 'BRA'])} dim={0.5} />
		</div>
		<Vignette />
		<div style={{position: 'absolute', left: 0, right: 0, top: 22, display: 'flex', justifyContent: 'center'}}><Txt size={104}>IMPERIALISMO</Txt></div>
		<div style={{position: 'absolute', left: 120, top: 175}}><CountryCut iso="ARG" h={430} mood="enfado" look={[1, -0.2]} faceScale={2.2} glow="#9FD0FF" /></div>
		<div style={{position: 'absolute', left: 720, top: 160}}><CountryCut iso="BRA" h={380} mood="enfado" look={[-1, 0]} faceScale={0.95} glow="#FFD23F" /></div>
		<div style={{position: 'absolute', left: 520, top: 300}}><Txt size={140} color="#FFD23F">VS</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center'}}><Txt size={96} color="#FF3B30">SUDAMERICANO</Txt></div>
	</AbsoluteFill>
);
