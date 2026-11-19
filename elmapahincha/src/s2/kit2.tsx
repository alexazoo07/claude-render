// Iconos propios para los shorts v3 — mismo estilo que el mapa: contorno tinta grueso, colores planos,
// brillo blanco arriba a la izquierda y sombra dura abajo. Todos animables con props simples.
import React from 'react';
import {interpolate, Easing} from 'remotion';
import {INK} from '../v21/Atlas21';
import {LILITA} from '../fonts';

const SH = 'drop-shadow(0 7px 0 rgba(0,0,0,0.35))';
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const SW = 6; // ink stroke in a 100-unit box

// --- calendario con año y aspa roja que se dibuja (x: 0..1)
export const Calendar: React.FC<{s: number; year: string; x?: number; top?: string}> = ({s, year, x = 0, top = 'MUNDIAL'}) => {
	const len = 120;
	return (
		<svg width={s} height={s * 1.05} viewBox="-6 -10 112 116" style={{overflow: 'visible', filter: SH}}>
			<rect x={4} y={8} width={92} height={90} rx={12} fill="#FFFDF6" stroke={INK} strokeWidth={SW} />
			<path d="M4 20 a12 12 0 0 1 12 -12 H84 a12 12 0 0 1 12 12 V34 H4 Z" fill="#E8394A" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
			<text x={50} y={29} textAnchor="middle" fontFamily={LILITA} fontSize={15} fill="#fff">{top}</text>
			{[28, 72].map((cx) => <g key={cx}><rect x={cx - 5} y={-4} width={10} height={20} rx={5} fill="#D9DEE6" stroke={INK} strokeWidth={4} /></g>)}
			<text x={50} y={78} textAnchor="middle" fontFamily={LILITA} fontSize={33} fill={INK}>{year}</text>
			<path d="M12 40 H40" stroke="#E9E1CF" strokeWidth={4} strokeLinecap="round" />
			{x > 0 && <g fill="none" strokeLinecap="round">
				<path d="M14 44 L86 92" stroke={INK} strokeWidth={17} strokeDasharray={len} strokeDashoffset={len * (1 - Math.min(1, x * 2))} />
				<path d="M86 44 L14 92" stroke={INK} strokeWidth={17} strokeDasharray={len} strokeDashoffset={len * (1 - Math.max(0, x * 2 - 1))} />
				<path d="M14 44 L86 92" stroke="#FF3B3B" strokeWidth={9} strokeDasharray={len} strokeDashoffset={len * (1 - Math.min(1, x * 2))} />
				<path d="M86 44 L14 92" stroke="#FF3B3B" strokeWidth={9} strokeDasharray={len} strokeDashoffset={len * (1 - Math.max(0, x * 2 - 1))} />
			</g>}
		</svg>
	);
};

// --- estadio (vista lateral con torres de focos que se encienden: on 0..1)
export const Stadium: React.FC<{s: number; on?: number; label?: string; f?: number}> = ({s, on = 1, label, f = 0}) => (
	<svg width={s} height={s * 0.72} viewBox="-6 -14 132 96" style={{overflow: 'visible', filter: SH}}>
		{[10, 110].map((x, i) => (
			<g key={x}>
				<path d={`M${x} 60 L${x} 4`} stroke={INK} strokeWidth={8} strokeLinecap="round" />
				<path d={`M${x} 60 L${x} 4`} stroke="#9AA3B2" strokeWidth={3} strokeLinecap="round" />
				<rect x={x - 11} y={-8} width={22} height={13} rx={3} fill={on > 0.5 ? '#FFF6B0' : '#8B93A1'} stroke={INK} strokeWidth={4} />
				{on > 0.5 && <path d={`M${x} 5 L${x + (i ? -34 : 34)} 46 L${x + (i ? -10 : 10)} 50 Z`} fill="#FFF6B0" opacity={0.35 + 0.1 * Math.sin(f / 6 + i)} />}
			</g>
		))}
		<path d="M14 34 Q60 14 106 34 L112 62 Q60 76 8 62 Z" fill="#3D4A63" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
		<path d="M18 40 Q60 24 102 40" fill="none" stroke="#56658A" strokeWidth={4} />
		<path d="M14 48 Q60 32 106 48" fill="none" stroke="#56658A" strokeWidth={4} />
		{Array.from({length: 13}, (_, i) => <circle key={i} cx={22 + i * 6.3} cy={37 - Math.sin((i / 12) * Math.PI) * 7 + Math.sin(f / 4 + i) * 0.8} r={1.7} fill={['#E8394A', '#FFD23F', '#fff', '#3FA9F5'][i % 4]} />)}
		<path d="M22 58 Q60 46 98 58 Q60 68 22 58 Z" fill="#3BB273" stroke={INK} strokeWidth={4} />
		<path d="M60 49 L60 66" stroke="#fff" strokeWidth={2} opacity={0.8} />
		<ellipse cx={60} cy={58} rx={7} ry={3} fill="none" stroke="#fff" strokeWidth={1.6} opacity={0.8} />
		<path d="M30 30 Q44 24 56 22" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.5} fill="none" />
		{label && <g><rect x={20} y={66} width={80} height={18} rx={6} fill={INK} /><text x={60} y={80} textAnchor="middle" fontFamily={LILITA} fontSize={13} fill="#fff">{label}</text></g>}
	</svg>
);

// --- mandíbula de dibujos (bite 0..1 cierra la boca)
export const Teeth: React.FC<{s: number; bite: number}> = ({s, bite}) => {
	const gap = interpolate(bite, [0, 1], [26, 0]);
	const jaw = (top: boolean) => {
		const y0 = top ? 30 - gap / 2 : 54 + gap / 2;
		const dir = top ? 1 : -1;
		return (
			<g>
				<path d={top ? `M8 ${y0} Q8 ${y0 - 26} 50 ${y0 - 28} Q92 ${y0 - 26} 92 ${y0} Z` : `M8 ${y0} Q8 ${y0 + 26} 50 ${y0 + 28} Q92 ${y0 + 26} 92 ${y0} Z`} fill="#FF7A93" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
				{Array.from({length: 6}, (_, i) => { const x = 12 + i * 13.2; const w = 12.4; return <path key={i} d={`M${x} ${y0} H${x + w} V${y0 + dir * (i === 0 || i === 5 ? 10 : 14)} Q${x + w / 2} ${y0 + dir * (i === 0 || i === 5 ? 14 : 19)} ${x} ${y0 + dir * (i === 0 || i === 5 ? 10 : 14)} Z`} fill="#fff" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />; })}
				{top && <path d={`M20 ${y0 - 18} Q34 ${y0 - 24} 48 ${y0 - 24}`} stroke="#FFC2CE" strokeWidth={4} strokeLinecap="round" fill="none" />}
			</g>
		);
	};
	return (
		<svg width={s} height={s * 0.95} viewBox="0 -12 100 104" style={{overflow: 'visible', filter: SH}}>
			{jaw(false)}{jaw(true)}
			{bite > 0.95 && <g stroke={INK} strokeWidth={4} strokeLinecap="round"><path d="M-4 30 L-14 24 M-4 42 L-16 42 M-4 54 L-14 60 M104 30 L114 24 M104 42 L116 42 M104 54 L114 60" /></g>}
		</svg>
	);
};

// --- tarjeta roja con brillo
export const RedCard: React.FC<{s: number; rot?: number}> = ({s, rot = 0}) => (
	<svg width={s * 0.72} height={s} viewBox="-6 -6 84 112" style={{overflow: 'visible', filter: SH, transform: `rotate(${rot}deg)`}}>
		<rect x={4} y={4} width={64} height={92} rx={9} fill="#E8394A" stroke={INK} strokeWidth={SW} />
		<path d="M14 14 L14 46" stroke="#FF8A97" strokeWidth={6} strokeLinecap="round" />
		<path d="M14 54 L14 60" stroke="#FF8A97" strokeWidth={6} strokeLinecap="round" />
		<rect x={4} y={4} width={64} height={92} rx={9} fill="none" stroke="#B5172A" strokeWidth={2} transform="translate(3 3) scale(0.92)" opacity={0.6} />
	</svg>
);

// --- entrada/billete con avión
export const Ticket: React.FC<{s: number; text: string; sub?: string}> = ({s, text, sub}) => (
	<svg width={s} height={s * 0.5} viewBox="-6 -6 172 86" style={{overflow: 'visible', filter: SH}}>
		<path d="M10 4 H150 a10 10 0 0 0 10 10 V24 a12 12 0 0 0 0 24 V60 a10 10 0 0 0 -10 10 H10 a10 10 0 0 0 -10 -10 V48 a12 12 0 0 0 0 -24 V14 a10 10 0 0 0 10 -10 Z" fill={'#FFD23F'} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
		<path d="M118 10 V64" stroke={INK} strokeWidth={3} strokeDasharray="5 5" />
		<g transform="translate(139 37) rotate(-30)"><path d="M-14 2 L14 -2 M-2 0 L-8 -12 M-2 0 L-8 12 M10 -1 L13 -7 M10 -1 L13 5" stroke={INK} strokeWidth={4.5} strokeLinecap="round" fill="none" /></g>
		<text x={60} y={sub ? 38 : 47} textAnchor="middle" fontFamily={LILITA} fontSize={30} fill={INK}>{text}</text>
		{sub && <text x={60} y={58} textAnchor="middle" fontFamily={LILITA} fontSize={15} fill="#7A4A1A">{sub}</text>}
		<path d="M14 12 H60" stroke="#FFF3B0" strokeWidth={4} strokeLinecap="round" />
	</svg>
);

// --- tarta de cumpleaños con n velas (llamas que bailan)
export const Cake: React.FC<{s: number; n: number; f: number; lit?: number}> = ({s, n, f, lit = 1}) => (
	<svg width={s} height={s} viewBox="-4 -24 108 128" style={{overflow: 'visible', filter: SH}}>
		<ellipse cx={50} cy={96} rx={50} ry={7} fill="#D9DEE6" stroke={INK} strokeWidth={5} />
		<path d="M10 56 H90 V90 Q50 98 10 90 Z" fill="#F3A6C0" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
		<path d="M12 40 H88 V60 Q80 70 72 60 Q64 70 56 60 Q48 70 40 60 Q32 70 24 60 Q16 70 12 60 Z" fill="#FFF7EE" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
		<path d="M10 72 H90" stroke="#E07A9A" strokeWidth={4} />
		{Array.from({length: n}, (_, i) => {
			const x = 16 + (i * 68) / Math.max(1, n - 1);
			const c = ['#3FA9F5', '#FFD23F', '#3BB273', '#E8394A'][i % 4];
			const fl = Math.sin(f / 4 + i * 1.7) * 1.5;
			return <g key={i}>
				<rect x={x - 2.6} y={24} width={5.2} height={18} rx={2} fill={c} stroke={INK} strokeWidth={2.5} />
				{lit > i / n && <path d={`M${x} ${10 + fl * 0.3} Q${x + 4.5} ${17} ${x} ${22} Q${x - 4.5} ${17} ${x + fl * 0.4} ${10 + fl * 0.3} Z`} fill="#FFB020" stroke={INK} strokeWidth={2} />}
			</g>;
		})}
		<path d="M18 46 H40" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
	</svg>
);

// --- tele antigua apagada / sin señal (con ruido animado)
export const TV: React.FC<{s: number; f: number; text?: string}> = ({s, f, text = 'SIN SEÑAL'}) => (
	<svg width={s} height={s * 0.9} viewBox="-6 -24 112 114" style={{overflow: 'visible', filter: SH}}>
		<path d="M36 -2 L50 12 L66 -16" stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
		<circle cx={66} cy={-17} r={4} fill="#E8394A" stroke={INK} strokeWidth={3} />
		<rect x={2} y={12} width={96} height={68} rx={14} fill="#B56A3A" stroke={INK} strokeWidth={SW} />
		<rect x={10} y={20} width={64} height={52} rx={8} fill="#2B2F3A" stroke={INK} strokeWidth={4} />
		{Array.from({length: 9}, (_, i) => <rect key={i} x={12} y={22 + i * 5.6} width={60} height={2} fill="#fff" opacity={0.12 + 0.18 * Math.abs(Math.sin(f / 3 + i * 2.3))} />)}
		<text x={42} y={51} textAnchor="middle" fontFamily={LILITA} fontSize={11} fill="#fff">{text}</text>
		<circle cx={86} cy={32} r={6} fill="#FFD23F" stroke={INK} strokeWidth={3.5} />
		<circle cx={86} cy={50} r={6} fill="#FFD23F" stroke={INK} strokeWidth={3.5} />
		<path d="M14 24 L30 24" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
		<path d="M14 80 L10 90 M86 80 L90 90" stroke={INK} strokeWidth={6} strokeLinecap="round" />
	</svg>
);

// --- porción de pizza con queso que gotea
export const Pizza: React.FC<{s: number; f: number}> = ({s, f}) => (
	<svg width={s} height={s * 1.05} viewBox="-6 -6 112 118" style={{overflow: 'visible', filter: SH}}>
		<path d="M50 104 L4 14 Q50 -6 96 14 Z" fill="#FFC94A" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
		<path d="M4 14 Q50 -6 96 14 L92 24 Q50 6 8 24 Z" fill="#D98A3A" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
		{[[34, 36], [62, 40], [48, 60], [40, 82 - 8], [60, 66 + 4]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={7.5} fill="#E8394A" stroke={INK} strokeWidth={3.5} /><circle cx={x - 2} cy={y - 2} r={2} fill="#FF8A97" /></g>)}
		<path d={`M70 30 Q72 ${44 + Math.sin(f / 9) * 4} 68 ${48 + Math.sin(f / 9) * 5}`} stroke="#FFC94A" strokeWidth={6} strokeLinecap="round" fill="none" />
		<path d="M22 28 Q40 22 52 22" stroke="#FFF0B8" strokeWidth={4} strokeLinecap="round" fill="none" />
		<path d="M28 44 l4 3 M54 50 l3 -3 M44 72 l3 2" stroke="#3BB273" strokeWidth={4} strokeLinecap="round" />
	</svg>
);

// --- estrella dorada de campeón (con brillo que gira)
export const GoldStar: React.FC<{s: number; f: number; grey?: boolean}> = ({s, f, grey}) => (
	<svg width={s} height={s} viewBox="-55 -55 110 110" style={{overflow: 'visible', filter: grey ? 'grayscale(1) brightness(0.65)' : SH}}>
		<path d="M0 -46 L13 -14 L46 -12 L20 9 L29 42 L0 23 L-29 42 L-20 9 L-46 -12 L-13 -14 Z" fill="#FFD23F" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
		<path d="M0 -30 L8 -10 L28 -8 L12 5" fill="none" stroke="#FFF3B0" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

// --- cartel de madera tipo "turista" / etiqueta grande
export const Sign: React.FC<{text: string; size?: number; bg?: string; c?: string; rot?: number}> = ({text, size = 56, bg = '#fff', c = INK, rot = -3}) => (
	<div style={{transform: `rotate(${rot}deg)`, background: bg, border: `6px solid ${INK}`, borderRadius: 18, padding: '4px 22px', boxShadow: `0 8px 0 ${INK}`, fontFamily: LILITA, fontSize: size, color: c, whiteSpace: 'nowrap', lineHeight: 1.1}}>{text}</div>
);

// helper: progreso suave 0..1 entre dos fotogramas
export const prog = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});

// ===================== iconos lote 2 (comidas, objetos del fútbol)
const Sv: React.FC<{w: number; h: number; vb: string; children: React.ReactNode; rot?: number}> = ({w, h, vb, children, rot = 0}) => (
	<svg width={w} height={h} viewBox={vb} style={{overflow: 'visible', filter: SH, transform: `rotate(${rot}deg)`}}>{children}</svg>
);
export const Sausage: React.FC<{s: number; f?: number}> = ({s, f = 0}) => (
	<Sv w={s} h={s * 0.6} vb="-6 -6 132 78" rot={-10 + Math.sin(f / 12) * 4}>
		<path d="M14 40 Q4 30 14 20 Q30 10 60 12 Q90 10 106 20 Q116 30 106 40 Q90 52 60 50 Q30 52 14 40 Z" fill="#E8A35C" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
		<path d="M10 30 Q2 30 4 24 M110 30 Q118 30 116 24" stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
		<path d="M24 34 Q22 22 40 18 Q60 16 80 18 Q100 22 98 34 Q80 42 60 40 Q40 42 24 34 Z" fill="#C2562E" stroke={INK} strokeWidth={5} />
		<path d="M30 26 Q38 22 48 24 Q56 28 64 24 Q72 20 80 24 Q88 28 94 26" stroke="#FFD23F" strokeWidth={4} strokeLinecap="round" fill="none" />
		<path d="M40 22 Q50 19 58 20" stroke="#F09A74" strokeWidth={3} strokeLinecap="round" fill="none" />
	</Sv>
);
export const Baguette: React.FC<{s: number; f?: number}> = ({s, f = 0}) => (
	<Sv w={s} h={s * 0.42} vb="-6 -6 172 72" rot={-14 + Math.sin(f / 12) * 4}>
		<path d="M10 40 Q0 24 18 14 Q60 -2 140 10 Q162 16 156 32 Q150 46 120 50 Q60 60 24 54 Q14 52 10 40 Z" fill="#D9963A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
		{[30, 58, 86, 114, 138].map((x) => <path key={x} d={`M${x} 20 Q${x + 8} 30 ${x + 4} 42`} stroke="#F6D28B" strokeWidth={5} strokeLinecap="round" fill="none" />)}
		<path d="M24 20 Q60 8 110 12" stroke="#F4C77A" strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.7} />
	</Sv>
);
export const Taco: React.FC<{s: number; f?: number}> = ({s, f = 0}) => (
	<Sv w={s} h={s * 0.7} vb="-6 -16 132 96" rot={Math.sin(f / 12) * 5}>
		{[[22, '#3BB273'], [44, '#E8394A'], [66, '#3BB273'], [86, '#FFD23F']].map(([x, c], i) => <circle key={i} cx={x as number} cy={14 + (i % 2) * 4} r={11} fill={c as string} stroke={INK} strokeWidth={4} />)}
		<path d="M8 70 Q8 10 60 10 Q112 10 112 70 Z" fill="#F2C14E" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
		<path d="M20 60 Q22 24 58 22" stroke="#FFE59A" strokeWidth={5} fill="none" strokeLinecap="round" />
		{[[40, 44], [72, 36], [86, 56], [54, 58]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.5} fill="#B47A1E" />)}
	</Sv>
);
export const TeaCup: React.FC<{s: number; f?: number}> = ({s, f = 0}) => (
	<Sv w={s} h={s} vb="-6 -30 122 126">
		{[0, 1, 2].map((j) => <path key={j} d={`M${34 + j * 16} ${-4 - ((f * 0.6 + j * 14) % 26)} q6 -8 0 -16`} stroke="#fff" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.7} />)}
		<path d="M14 18 H86 Q86 70 50 74 Q14 70 14 18 Z" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
		<path d="M86 28 Q106 28 104 44 Q102 58 82 56" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
		<ellipse cx={50} cy={18} rx={36} ry={7} fill="#B5651D" stroke={INK} strokeWidth={5} />
		<path d="M30 36 H70" stroke="#3F7FE0" strokeWidth={6} /><path d="M34 46 H66" stroke="#E8394A" strokeWidth={5} />
		<ellipse cx={50} cy={84} rx={46} ry={8} fill="#fff" stroke={INK} strokeWidth={5} />
	</Sv>
);
export const Mate: React.FC<{s: number; f?: number}> = ({s, f = 0}) => (
	<Sv w={s * 0.8} h={s} vb="-6 -30 92 126" rot={Math.sin(f / 14) * 4}>
		<path d="M54 -24 L44 40" stroke={INK} strokeWidth={9} strokeLinecap="round" /><path d="M54 -24 L44 40" stroke="#D9DEE6" strokeWidth={4} strokeLinecap="round" />
		<path d="M14 30 Q6 60 20 82 Q40 98 60 82 Q74 60 66 30 Z" fill="#9B6A3A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
		<rect x={10} y={22} width={60} height={12} rx={5} fill="#D9DEE6" stroke={INK} strokeWidth={5} />
		<path d="M18 26 Q30 20 46 24" fill="#3BB273" stroke={INK} strokeWidth={3} />
		<path d="M22 46 Q20 66 30 78" stroke="#C99560" strokeWidth={5} fill="none" strokeLinecap="round" />
	</Sv>
);
export const Nata: React.FC<{s: number; f?: number}> = ({s, f = 0}) => (
	<Sv w={s} h={s * 0.7} vb="-6 -6 122 86" rot={Math.sin(f / 12) * 4}>
		<path d="M8 30 L18 70 H96 L106 30 Z" fill="#E3A24A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
		{[24, 40, 56, 72, 88].map((x) => <path key={x} d={`M${x} 34 L${x + 2} 66`} stroke="#B97422" strokeWidth={3} />)}
		<ellipse cx={57} cy={28} rx={50} ry={14} fill="#FFD66B" stroke={INK} strokeWidth={6} />
		{[[38, 26], [62, 22], [74, 32], [48, 33]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={7} ry={4} fill="#8A4B12" opacity={0.8} />)}
	</Sv>
);
// mano (Mano de Dios / mano de Suárez)
export const Hand: React.FC<{s: number; f?: number; c?: string}> = ({s, f = 0, c = '#F2C29A'}) => (
	<Sv w={s * 0.8} h={s} vb="-6 -6 92 122" rot={-10 + Math.sin(f / 10) * 5}>
		<path d="M20 112 L18 64 Q8 50 10 40 Q16 34 24 46 L26 20 Q26 10 34 10 Q40 10 40 20 L40 8 Q40 0 48 0 Q56 0 56 8 L56 14 Q56 6 64 6 Q72 6 72 16 L72 26 Q72 18 78 18 Q86 18 86 28 L84 70 Q80 92 70 112 Z" fill={c} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
		<path d="M40 20 V48 M56 14 V46 M72 26 V50" stroke="#C98F66" strokeWidth={4} strokeLinecap="round" />
		<path d="M30 30 Q30 22 34 18" stroke="#FFE0C8" strokeWidth={4} strokeLinecap="round" fill="none" />
		<rect x={16} y={104} width={58} height={14} rx={4} fill="#3F7FE0" stroke={INK} strokeWidth={5} />
	</Sv>
);
// balón clásico
export const Ball: React.FC<{s: number; f?: number; gold?: boolean}> = ({s, f = 0, gold}) => (
	<Sv w={s} h={s} vb="-55 -55 110 110" rot={f * 3}>
		<circle r={46} fill={gold ? '#FFD23F' : '#fff'} stroke={INK} strokeWidth={7} />
		<path d="M0 -16 L15 -5 L9 13 L-9 13 L-15 -5 Z" fill={INK} />
		{[0, 72, 144, 216, 288].map((a) => <g key={a} transform={`rotate(${a})`}><path d="M0 -16 L0 -30 M0 -30 L14 -40 M0 -30 L-14 -40" stroke={INK} strokeWidth={4} fill="none" /><path d="M-8 -46 L0 -40 L8 -46" fill={INK} /></g>)}
		<path d="M-30 -24 Q-22 -34 -10 -38" stroke="#fff" strokeWidth={5} strokeLinecap="round" fill="none" opacity={gold ? 0.8 : 0} />
	</Sv>
);
// portería con balón (gol fantasma / penaltis)
export const Goal: React.FC<{s: number; f?: number; line?: boolean}> = ({s, f = 0, line}) => (
	<Sv w={s} h={s * 0.62} vb="-8 -8 176 106">
		<path d="M10 90 L10 8 H150 V90" fill="none" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
		<path d="M10 90 L10 8 H150 V90" fill="none" stroke="#fff" strokeWidth={6} strokeLinejoin="round" />
		{Array.from({length: 9}, (_, i) => <path key={i} d={`M${24 + i * 14} 14 V88`} stroke="#fff" strokeWidth={1.6} opacity={0.6} />)}
		{Array.from({length: 5}, (_, i) => <path key={i} d={`M14 ${24 + i * 14} H146`} stroke="#fff" strokeWidth={1.6} opacity={0.6} />)}
		<path d="M-4 92 H164" stroke="#fff" strokeWidth={5} />
		<g transform={`translate(${line ? 80 : 80} ${line ? 84 : 60}) rotate(${f * 4}) scale(0.32)`}><circle r={46} fill="#fff" stroke={INK} strokeWidth={9} /><path d="M0 -16 L15 -5 L9 13 L-9 13 L-15 -5 Z" fill={INK} /></g>
	</Sv>
);
// libro de reglas 1863
export const RuleBook: React.FC<{s: number; f?: number; text?: string}> = ({s, f = 0, text = '1863'}) => (
	<Sv w={s} h={s * 1.1} vb="-6 -6 112 124" rot={-6 + Math.sin(f / 14) * 3}>
		<rect x={10} y={4} width={84} height={108} rx={8} fill="#B5172A" stroke={INK} strokeWidth={6} />
		<rect x={4} y={10} width={12} height={96} rx={4} fill="#7A0E1C" stroke={INK} strokeWidth={5} />
		<rect x={28} y={22} width={56} height={30} rx={5} fill="#FFD23F" stroke={INK} strokeWidth={4} />
		<text x={56} y={44} textAnchor="middle" fontFamily={LILITA} fontSize={20} fill={INK}>{text}</text>
		<text x={56} y={80} textAnchor="middle" fontFamily={LILITA} fontSize={14} fill="#FFD23F">REGLAS</text>
		<path d="M26 92 H84" stroke="#FFD23F" strokeWidth={3} />
	</Sv>
);
// medalla de oro
export const Medal: React.FC<{s: number; f?: number; text?: string}> = ({s, f = 0, text = '1º'}) => (
	<Sv w={s * 0.8} h={s} vb="-6 -6 92 122" rot={Math.sin(f / 12) * 6}>
		<path d="M18 0 L40 48 L52 48 L30 0 Z" fill="#3F7FE0" stroke={INK} strokeWidth={5} /><path d="M66 0 L44 48 L32 48 L54 0 Z" fill="#E8394A" stroke={INK} strokeWidth={5} />
		<circle cx={42} cy={78} r={30} fill="#FFD23F" stroke={INK} strokeWidth={6} />
		<circle cx={42} cy={78} r={21} fill="none" stroke="#E0A800" strokeWidth={4} />
		<text x={42} y={87} textAnchor="middle" fontFamily={LILITA} fontSize={24} fill={INK}>{text}</text>
		<path d="M26 66 Q30 58 38 56" stroke="#FFF3B0" strokeWidth={4} strokeLinecap="round" fill="none" />
	</Sv>
);
// bocadillo de diálogo con texto
export const Bubble: React.FC<{text: string; size?: number; bg?: string}> = ({text, size = 64, bg = '#fff'}) => (
	<div style={{position: 'relative', background: bg, border: `${size * 0.1}px solid ${INK}`, borderRadius: size * 0.45, padding: `${size * 0.08}px ${size * 0.4}px`, fontFamily: LILITA, fontSize: size, color: INK, boxShadow: `0 ${size * 0.12}px 0 ${INK}`, whiteSpace: 'nowrap'}}>
		{text}
		<svg width={size * 0.7} height={size * 0.6} viewBox="0 0 40 34" style={{position: 'absolute', left: size * 0.5, bottom: -size * 0.52}}><path d="M2 0 L38 0 L8 32 Z" fill={bg} stroke={INK} strokeWidth={5} strokeLinejoin="round" /><path d="M0 -3 H40" stroke={bg} strokeWidth={7} /></svg>
	</div>
);
// barras comparativas animadas
export const Bars: React.FC<{items: {k: string; v: number; c: string; label: string}[]; t: number; d: number; h?: number}> = ({items, t, d, h = 300}) => {
	const mx = Math.max(...items.map((i) => i.v));
	return (
		<div style={{display: 'flex', gap: 30, alignItems: 'flex-end', height: h + 90}}>
			{items.map((it, j) => {
				const p = prog(t, d + j * 8, d + j * 8 + 30);
				return <div key={it.k} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
					<span style={{fontFamily: LILITA, fontSize: 64, color: '#fff', WebkitTextStroke: `7px ${INK}`, paintOrder: 'stroke fill'}}>{Math.round(it.v * p)}</span>
					<div style={{width: 120, height: Math.max(8, (h * it.v * p) / mx), background: it.c, border: `6px solid ${INK}`, borderRadius: 14, boxShadow: `0 7px 0 ${INK}`}} />
					<div style={{background: INK, borderRadius: 10, padding: '2px 12px', fontFamily: LILITA, fontSize: 30, color: '#fff'}}>{it.label}</div>
				</div>;
			})}
		</div>
	);
};
