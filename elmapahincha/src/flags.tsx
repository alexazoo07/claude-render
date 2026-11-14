import React from 'react';

export type Iso = 'ARG' | 'BRA' | 'URY' | 'COL' | 'ECU' | 'PRY' | 'PER' | 'CHL' | 'VEN' | 'BOL' | 'MEX' | 'ESP' | 'POR' | 'FRA';

// Simplified national flags drawn in a 300x200 box (no coats of arms detail).
const Sun: React.FC<{cx: number; cy: number; r: number; fill?: string}> = ({cx, cy, r, fill = '#F6B40E'}) => {
	const rays = [];
	for (let i = 0; i < 16; i++) {
		const a = (i / 16) * Math.PI * 2;
		const r1 = r * 1.05, r2 = r * (i % 2 ? 1.55 : 1.8);
		rays.push(
			<line key={i} x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1} x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2}
				stroke={fill} strokeWidth={r * 0.28} strokeLinecap="round" />
		);
	}
	return (
		<g>
			{rays}
			<circle cx={cx} cy={cy} r={r} fill={fill} stroke="#8C5A2B" strokeWidth={r * 0.1} />
		</g>
	);
};

const Star: React.FC<{cx: number; cy: number; r: number; fill?: string}> = ({cx, cy, r, fill = '#fff'}) => {
	const pts = [];
	for (let i = 0; i < 10; i++) {
		const a = -Math.PI / 2 + (i * Math.PI) / 5;
		const rr = i % 2 ? r * 0.42 : r;
		pts.push(`${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`);
	}
	return <polygon points={pts.join(' ')} fill={fill} />;
};

export const FlagArt: React.FC<{iso: Iso}> = ({iso}) => {
	switch (iso) {
		case 'ARG':
			return (
				<g>
					<rect width={300} height={200} fill="#74ACDF" />
					<rect y={66.7} width={300} height={66.6} fill="#fff" />
					<Sun cx={150} cy={100} r={17} />
				</g>
			);
		case 'BRA':
			return (
				<g>
					<rect width={300} height={200} fill="#009C3B" />
					<polygon points="150,22 278,100 150,178 22,100" fill="#FEDD00" />
					<circle cx={150} cy={100} r={46} fill="#002776" />
					<path d="M106 88 Q150 76 194 106 L192 116 Q150 88 104 98 Z" fill="#fff" />
				</g>
			);
		case 'URY': {
			const s = [];
			for (let i = 0; i < 9; i++) s.push(<rect key={i} y={(i * 200) / 9} width={300} height={200 / 9} fill={i % 2 ? '#0038A8' : '#fff'} />);
			return (
				<g>
					{s}
					<rect width={122} height={(200 / 9) * 5} fill="#fff" />
					<Sun cx={61} cy={55} r={17} fill="#FCD116" />
				</g>
			);
		}
		case 'COL':
			return (
				<g>
					<rect width={300} height={200} fill="#CE1126" />
					<rect width={300} height={150} fill="#003893" />
					<rect width={300} height={100} fill="#FCD116" />
				</g>
			);
		case 'ECU':
			return (
				<g>
					<rect width={300} height={200} fill="#ED1C24" />
					<rect width={300} height={150} fill="#034EA2" />
					<rect width={300} height={100} fill="#FFDD00" />
					<ellipse cx={150} cy={100} rx={20} ry={26} fill="#7BB6E6" stroke="#8C5A2B" strokeWidth={4} />
					<path d="M126 78 Q150 64 174 78" fill="none" stroke="#5B3A1A" strokeWidth={6} />
				</g>
			);
		case 'PRY':
			return (
				<g>
					<rect width={300} height={200} fill="#0038A8" />
					<rect width={300} height={133.3} fill="#fff" />
					<rect width={300} height={66.7} fill="#D52B1E" />
					<circle cx={150} cy={100} r={22} fill="#fff" stroke="#1B7F3A" strokeWidth={5} />
					<Star cx={150} cy={100} r={10} fill="#F6C200" />
				</g>
			);
		case 'PER':
			return (
				<g>
					<rect width={300} height={200} fill="#D91023" />
					<rect x={100} width={100} height={200} fill="#fff" />
				</g>
			);
		case 'CHL':
			return (
				<g>
					<rect width={300} height={200} fill="#D52B1E" />
					<rect width={300} height={100} fill="#fff" />
					<rect width={100} height={100} fill="#0039A6" />
					<Star cx={50} cy={50} r={22} />
				</g>
			);
		case 'VEN': {
			const stars = [];
			for (let i = 0; i < 8; i++) {
				const a = Math.PI * (1.18 + (i * 0.64) / 7);
				stars.push(<Star key={i} cx={150 + Math.cos(a) * 44} cy={128 + Math.sin(a) * 44} r={8} />);
			}
			return (
				<g>
					<rect width={300} height={200} fill="#CF142B" />
					<rect width={300} height={133.3} fill="#00247D" />
					<rect width={300} height={66.7} fill="#FFCC00" />
					{stars}
				</g>
			);
		}
		case 'BOL':
			return (
				<g>
					<rect width={300} height={200} fill="#007934" />
					<rect width={300} height={133.3} fill="#F9E300" />
					<rect width={300} height={66.7} fill="#D52B1E" />
				</g>
			);
		case 'MEX':
			return (
				<g>
					<rect width={100} height={200} fill="#006847" />
					<rect x={100} width={100} height={200} fill="#fff" />
					<rect x={200} width={100} height={200} fill="#CE1126" />
					<circle cx={150} cy={100} r={18} fill="#8C5A2B" />
				</g>
			);
		case 'ESP':
			return (
				<g>
					<rect width={300} height={200} fill="#AA151B" />
					<rect y={50} width={300} height={100} fill="#F1BF00" />
				</g>
			);
		case 'POR':
			return (
				<g>
					<rect width={120} height={200} fill="#006600" />
					<rect x={120} width={180} height={200} fill="#FF0000" />
					<circle cx={120} cy={100} r={34} fill="#FFE000" stroke="#8C5A2B" strokeWidth={3} />
				</g>
			);
		case 'FRA':
			return (
				<g>
					<rect width={100} height={200} fill="#0055A4" />
					<rect x={100} width={100} height={200} fill="#fff" />
					<rect x={200} width={100} height={200} fill="#EF4135" />
				</g>
			);
	}
};

// Flag filling an arbitrary box in user space.
export const Flag: React.FC<{iso: Iso; x: number; y: number; w: number; h: number; mode?: 'slice' | 'none' | 'meet'}> = ({iso, x, y, w, h, mode}) => {
	const ar = w / h;
	const m = mode ?? (ar > 0.55 && ar < 2.6 ? 'slice' : 'none');
	return (
		<svg x={x} y={y} width={w} height={h} viewBox="0 0 300 200" preserveAspectRatio={m === 'none' ? 'none' : `xMidYMid ${m}`} overflow="hidden">
			<FlagArt iso={iso} />
		</svg>
	);
};

export const FlagChip: React.FC<{iso: Iso; w: number; h?: number; style?: React.CSSProperties; dim?: boolean}> = ({iso, w, h, style, dim}) => {
	const hh = h ?? (w * 2) / 3;
	return (
		<svg width={w} height={hh} viewBox="0 0 300 200" preserveAspectRatio="none"
			style={{borderRadius: Math.max(3, w * 0.08), boxShadow: '0 0 0 3px #0B1E3F', filter: dim ? 'grayscale(1) brightness(0.55)' : undefined, ...style}}>
			<FlagArt iso={iso} />
		</svg>
	);
};
