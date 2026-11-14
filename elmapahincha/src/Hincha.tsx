import React, {useId} from 'react';
import {FlagArt, Iso} from './flags';
import {staticFile} from 'remotion';
import {FlagCover} from './flagCover';

export type Mood = 'feliz' | 'grito' | 'enfado' | 'miedo' | 'triste' | 'ko';
const INK = '#0B1E3F';

export const Eyes: React.FC<{mood: Mood; blink?: number; look?: [number, number]}> = ({mood, blink = 0, look = [0, 0]}) => {
	const [lx, ly] = look;
	const sy = Math.max(0.08, 1 - blink);
	if (mood === 'ko') {
		return (
			<g stroke={INK} strokeWidth={7} strokeLinecap="round">
				<path d="M62 70 L90 96 M90 70 L62 96" />
				<path d="M110 70 L138 96 M138 70 L110 96" />
			</g>
		);
	}
	const big = mood === 'miedo';
	const rx = big ? 19 : 17;
	const ry = mood === 'enfado' ? 18 : big ? 24 : 21;
	const pr = big ? 5 : 8;
	return (
		<g>
			{mood === 'grito' && <path d="M58 56 Q76 46 92 56 M108 56 Q124 46 142 56" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
			{mood === 'triste' && <path d="M58 62 Q74 52 92 58 M108 58 Q126 52 142 62" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
			<g transform={`translate(0 ${84 * (1 - sy)}) scale(1 ${sy})`}>
				<ellipse cx={76} cy={84} rx={rx} ry={ry} fill="#fff" stroke={INK} strokeWidth={5} />
				<ellipse cx={124} cy={84} rx={rx} ry={ry} fill="#fff" stroke={INK} strokeWidth={5} />
				<circle cx={78 + lx * 6} cy={87 + ly * 6} r={pr} fill={INK} />
				<circle cx={122 + lx * 6} cy={87 + ly * 6} r={pr} fill={INK} />
				{!big && <circle cx={81 + lx * 6} cy={84 + ly * 6} r={2.5} fill="#fff" />}
				{!big && <circle cx={125 + lx * 6} cy={84 + ly * 6} r={2.5} fill="#fff" />}
			</g>
			{mood === 'enfado' && <path d="M54 60 L94 74 M146 60 L106 74" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />}
		</g>
	);
};

export const Mouth: React.FC<{mood: Mood; open?: number}> = ({mood, open = 1}) => {
	switch (mood) {
		case 'feliz':
			return <path d="M80 118 Q100 138 120 118" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />;
		case 'grito': {
			const o = 0.55 + 0.45 * open;
			return (
				<g transform={`translate(100 114) scale(1 ${o}) translate(-100 -114)`}>
					<path d="M80 112 Q100 152 120 112 Z" fill="#7A1020" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
					<path d="M89 133 Q100 145 111 133 Q100 127 89 133 Z" fill="#FF6B81" />
				</g>
			);
		}
		case 'enfado':
			return <path d="M82 128 Q100 116 118 128" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />;
		case 'triste':
			return <path d="M84 130 Q100 118 116 130" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />;
		case 'ko':
			return <ellipse cx={100} cy={124} rx={10} ry={7} fill={INK} />;
		case 'miedo':
			return (
				<path d="M78 126 q5.5 -6 11 0 q5.5 6 11 0 q5.5 -6 11 0 q5.5 6 11 0" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
			);
	}
};

export const Hincha: React.FC<{
	iso: Iso | 'balon' | string;
	mood?: Mood;
	size: number;
	scarf?: [string, string] | null;
	blink?: number;
	open?: number;
	look?: [number, number];
	style?: React.CSSProperties;
	sweat?: boolean;
}> = ({iso, mood = 'feliz', size, scarf, blink = 0, open = 1, look, style, sweat}) => {
	const raw = useId();
	const id = 'h' + raw.replace(/[^a-zA-Z0-9]/g, '');
	return (
		<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible', ...style}}>
			<defs>
				<clipPath id={id + 'c'}>
					<circle cx={100} cy={92} r={76} />
				</clipPath>
				<clipPath id={id + 's'}>
					<path d="M20 146 Q100 182 180 146 L182 170 Q100 206 18 170 Z" />
				</clipPath>
			</defs>
			<ellipse cx={100} cy={192} rx={64} ry={8} fill="#000" opacity={0.25} />
			<g clipPath={`url(#${id}c)`}>
				{iso === 'balon' ? (
					<g>
						<rect width={200} height={200} fill="#fff" />
						<path d="M81 27.8 L52 40 M119 27.8 L148 40 M111.8 50.2 L126 64 M88.2 50.2 L74 64 M55 91.8 L66 136 M145 91.8 L134 136" stroke="#C9D4DE" strokeWidth={3} fill="none" />
						<polygon points="100,14 119,27.8 111.8,50.2 88.2,50.2 81,27.8" fill={INK} />
						<polygon points="36,78 55,91.8 47.8,114.2 24.2,114.2 17,91.8" fill={INK} />
						<polygon points="164,78 183,91.8 175.8,114.2 152.2,114.2 145,91.8" fill={INK} />
						<polygon points="66,136 85,149.8 77.8,172.2 54.2,172.2 47,149.8" fill={INK} />
						<polygon points="134,136 153,149.8 145.8,172.2 122.2,172.2 115,149.8" fill={INK} />
					</g>
				) : typeof iso === 'string' && iso.startsWith('img:') ? (
					<FlagCover flag={iso.slice(4)} x={4} y={4} w={192} h={180} />
				) : (
					<svg x={-14} y={16} width={228} height={152} viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
						<FlagArt iso={iso as Iso} />
					</svg>
				)}
			</g>
			<circle cx={100} cy={92} r={76} fill="none" stroke={INK} strokeWidth={7} />
			<ellipse cx={70} cy={46} rx={20} ry={10} transform="rotate(-28 70 46)" fill="#fff" opacity={0.35} />
			{scarf && (
				<g>
					<g transform="rotate(8 145 182)">
						<rect x={132} y={168} width={26} height={28} fill={scarf[0]} stroke={INK} strokeWidth={4} />
						<rect x={134} y={176} width={22} height={8} fill={scarf[1]} />
						<path d="M136 196 L136 200 M142 196 L142 200 M148 196 L148 200 M154 196 L154 200" stroke={INK} strokeWidth={3} />
					</g>
					<path d="M20 146 Q100 182 180 146 L182 170 Q100 206 18 170 Z" fill={scarf[0]} />
					<g clipPath={`url(#${id}s)`} fill={scarf[1]}>
						<rect x={34} y={120} width={18} height={100} />
						<rect x={70} y={120} width={18} height={100} />
						<rect x={106} y={120} width={18} height={100} />
						<rect x={142} y={120} width={18} height={100} />
					</g>
					<path d="M20 146 Q100 182 180 146 L182 170 Q100 206 18 170 Z" fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
				</g>
			)}
			<Eyes mood={mood} blink={blink} look={look} />
			<Mouth mood={mood} open={open} />
			{sweat && <path d="M158 36 q9 13 0 20 q-9 -7 0 -20 Z" fill="#8FD3FF" stroke={INK} strokeWidth={3} />}
		</svg>
	);
};
