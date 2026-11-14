import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Hincha} from './Hincha';
import {Fonts, LILITA, RUBIK} from './fonts';

export const LogoA: React.FC = () => (
	<AbsoluteFill style={{background: 'repeating-linear-gradient(90deg, #1E8E4E 0px, #1E8E4E 100px, #24A05A 100px, #24A05A 200px)'}}>
		<svg width={800} height={800} style={{position: 'absolute'}}>
			<line x1={0} y1={400} x2={800} y2={400} stroke="#fff" strokeWidth={8} opacity={0.5} />
			<circle cx={400} cy={400} r={290} fill="none" stroke="#fff" strokeWidth={8} opacity={0.5} />
			<circle cx={400} cy={400} r={12} fill="#fff" opacity={0.5} />
			<circle cx={400} cy={400} r={385} fill="none" stroke="#0B1E3F" strokeWidth={30} />
			<circle cx={400} cy={400} r={363} fill="none" stroke="#FFD23F" strokeWidth={14} />
		</svg>
		<div style={{position: 'absolute', left: 100, top: 96}}>
			<Hincha iso="balon" mood="grito" size={600} scarf={['#FFD23F', '#E63946']} />
		</div>
	</AbsoluteFill>
);

const Box: React.FC<{left: number; border: string; top: string; topColor: string; num: string; bottom: string}> = ({left, border, top, topColor, num, bottom}) => (
	<div style={{position: 'absolute', left, top: 560, width: 360, height: 300, boxSizing: 'border-box', borderRadius: 32, background: '#0B1E3F', border: `6px solid ${border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
		<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: topColor}}>{top}</div>
		<div style={{fontFamily: LILITA, fontSize: 150, lineHeight: 1, color: '#fff'}}>{num}</div>
		<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: '#fff'}}>{bottom}</div>
	</div>
);

const H: React.FC<{x: number; y: number; s: number; iso: any; mood: any; scarf: [string, string]}> = ({x, y, s, iso, mood, scarf}) => (
	<div style={{position: 'absolute', left: x, top: y}}>
		<Hincha iso={iso} mood={mood} size={s} scarf={scarf} />
	</div>
);

export const BannerB: React.FC = () => (
	<AbsoluteFill
		style={{
			backgroundColor: '#0E5E33',
			backgroundImage:
				'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 3px, transparent 3px, transparent 120px), repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 3px, transparent 3px, transparent 120px)',
		}}
	>
		<Fonts />
		<svg width={2560} height={1440} style={{position: 'absolute'}}>
			{[
				['M380 250 Q450 520 695 724', '#FFD23F', 1],
				['M2300 230 Q2150 480 1865 724', '#FFD23F', 1],
				['M500 1220 Q540 960 695 724', '#E63946', 1],
				['M2120 1220 Q2060 960 1865 724', '#E63946', 1],
				['M1260 211 Q1600 300 1865 724', '#FFFFFF', 0.7],
			].map(([d, c, o], i) => (
				<path key={i} d={d as string} fill="none" stroke={c as string} strokeWidth={10} strokeDasharray="2 28" strokeLinecap="round" opacity={o as number} />
			))}
		</svg>
		<Box left={110} border="#FFD23F" top="QUEDAN EN PIE" topColor="#FFD23F" num="211" bottom="SELECCIONES" />
		<Box left={2090} border="#E63946" top="RONDA" topColor="#FF8A94" num="1" bottom="¿QUIÉN GANA?" />
		<H x={260} y={130} s={240} iso="MEX" mood="grito" scarf={['#006847', '#FFFFFF']} />
		<H x={2180} y={120} s={240} iso="ESP" mood="enfado" scarf={['#AA151B', '#F1BF00']} />
		<H x={1150} y={110} s={220} iso="POR" mood="miedo" scarf={['#006600', '#FF0000']} />
		<H x={380} y={1110} s={240} iso="COL" mood="grito" scarf={['#FCD116', '#003893']} />
		<H x={2000} y={1110} s={240} iso="URY" mood="enfado" scarf={['#0038A8', '#FFFFFF']} />
		<H x={1180} y={1150} s={220} iso="FRA" mood="miedo" scarf={['#0055A4', '#FFFFFF']} />
		<div style={{position: 'absolute', left: 0, top: 520, width: 2560, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div style={{fontFamily: LILITA, fontSize: 100, lineHeight: 1, color: '#FFD23F', WebkitTextStroke: '14px #0B1E3F', paintOrder: 'stroke fill', letterSpacing: 4}}>EL MAPA</div>
			<div style={{fontFamily: LILITA, fontSize: 232, lineHeight: 0.95, color: '#fff', WebkitTextStroke: '22px #0B1E3F', paintOrder: 'stroke fill', textShadow: '0 16px 0 #0B1E3F', letterSpacing: 6}}>HINCHA</div>
			<div style={{marginTop: 22, padding: '12px 40px', borderRadius: 999, background: '#FFD23F', border: '6px solid #0B1E3F', fontFamily: RUBIK, fontWeight: 800, fontSize: 29, letterSpacing: 2, color: '#0B1E3F'}}>
				IMPERIALISMO · RIVALIDADES · ¿QUÉ PASARÍA SI…?
			</div>
		</div>
		<H x={560} y={600} s={270} iso="ARG" mood="enfado" scarf={['#74ACDF', '#FFFFFF']} />
		<H x={1730} y={600} s={270} iso="BRA" mood="grito" scarf={['#FEDD00', '#009C3B']} />
	</AbsoluteFill>
);
