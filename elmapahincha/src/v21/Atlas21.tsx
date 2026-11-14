import React, {useId} from 'react';
import {staticFile, useCurrentFrame} from 'remotion';
import {WORLD, WCam, bboxOf, isTiny} from '../v5/WorldLayer5';
import {FlagCover} from '../flagCover';

// ---------------------------------------------------------------------------
// "Atlas" map: hill-shaded beige land, depth-tinted sea with wave lines,
// thin borders, lifted (focused) countries and big cartoon faces.
// Raster layers are in the same NaturalEarth1 projection as world.json.
// ---------------------------------------------------------------------------
export const KEYS = Object.keys(WORLD);
export const BEIGE = '#F7ECCF';
export const INK = '#15161C';
export const REL = {x: 0, y: 20, w: 3830, h: 1720};

export type Fill = {color?: string; flag?: string; lift?: number; pop?: number; dim?: number};
export type FaceMood = 'happy' | 'smug' | 'scared' | 'panic' | 'angry' | 'worried' | 'sad' | 'neutral' | 'love' | 'shock' | 'cool';
export type FaceSpec = {mood: FaceMood; max?: number; size?: number; look?: [number, number]; blink?: number; talk?: number; pop?: number; dx?: number; dy?: number};

export const toScreen = (cam: WCam, x: number, y: number): [number, number] => [960 + (x - cam.x) * cam.z, 540 + (y - cam.y) * cam.z];

export const FlagFill: React.FC<{k: string; flag: string; clip: string}> = ({k, flag, clip}) => {
	const W = WORLD[k];
	const boxes = W.pb && W.pb.length ? W.pb : [[W.b[0][0], W.b[0][1], W.b[1][0], W.b[1][1]]];
	return (
		<g clipPath={`url(#${clip})`}>
			{boxes.map((q, i) => <FlagCover key={i} flag={flag} x={q[0] - 1.5} y={q[1] - 1.5} w={q[2] - q[0] + 3} h={q[3] - q[1] + 3} />)}
		</g>
	);
};

export const Atlas21: React.FC<{cam: WCam; fills: Record<string, Fill>; faces?: Record<string, FaceSpec>; children?: React.ReactNode; top?: React.ReactNode; dark?: number; W?: number; H?: number; flagImg?: boolean; grey?: string[]; greyCol?: string}> = ({cam, fills, faces = {}, children, top, dark = 0, W = 1920, H = 1080, flagImg, grey = [], greyCol = '#5B616D'}) => {
	const vx0 = cam.x - W / 2 / cam.z - 20, vx1 = cam.x + W / 2 / cam.z + 20, vy0 = cam.y - H / 2 / cam.z - 20, vy1 = cam.y + H / 2 / cam.z + 20;
	const inView = (k: string) => { const b = WORLD[k].b; return b[1][0] >= vx0 && b[0][0] <= vx1 && b[1][1] >= vy0 && b[0][1] <= vy1; };
	const f = useCurrentFrame();
	const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
	const z = cam.z;
	const tf = `translate(${W / 2} ${H / 2}) scale(${z}) translate(${-cam.x} ${-cam.y})`;
	const wx = (-cam.x * z * 0.35 + f * 0.35) % 448, wy = (-cam.y * z * 0.35 + Math.sin(f / 50) * 6) % 112;
	const lifted = Object.keys(fills).filter((k) => WORLD[k] && (fills[k].lift ?? 0) > 0.001);
	const flagged = Object.keys(fills).filter((k) => WORLD[k] && fills[k].flag && !((fills[k].lift ?? 0) > 0.001) && inView(k));
	return (
		<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
			<defs>
				<pattern id={`wv${uid}`} width={448} height={112} patternUnits="userSpaceOnUse" patternTransform={`translate(${wx} ${wy})`}>
					<image href={staticFile('tex/waves.png')} width={448} height={112} />
				</pattern>
				<clipPath id={`land${uid}`}>{KEYS.map((k) => <path key={k} d={WORLD[k].d} />)}</clipPath>
				{[...lifted, ...flagged].map((k) => <clipPath key={k} id={`c${uid}${k}`}><path d={WORLD[k].d} /></clipPath>)}
				<radialGradient id={`vg${uid}`} cx="50%" cy="48%" r="75%">
					<stop offset="55%" stopColor="#000" stopOpacity={0} />
					<stop offset="100%" stopColor="#031024" stopOpacity={0.42} />
				</radialGradient>
			</defs>
			<rect width={W} height={H} fill="#2A72BA" />
			<g transform={tf}><image href={staticFile('tex/ocean.jpg')} x={REL.x} y={REL.y} width={REL.w} height={REL.h} preserveAspectRatio="none" /></g>
			<rect width={W} height={H} fill={`url(#wv${uid})`} />
			<g transform={tf}>
				{/* coastal light band + soft drop shadow of the land */}
				<g fill="none" strokeLinejoin="round" stroke="#CFEAFF">
					<g strokeWidth={10 / z} opacity={0.16}>{KEYS.map((k) => <path key={k} d={WORLD[k].d} />)}</g>
					<g strokeWidth={4 / z} opacity={0.3}>{KEYS.map((k) => <path key={k} d={WORLD[k].d} />)}</g>
				</g>
				<g transform={`translate(${2 / z} ${4 / z})`} opacity={0.28}>{KEYS.map((k) => <path key={k} d={WORLD[k].d} fill="#0A2342" />)}</g>
				{/* land base */}
				{KEYS.map((k) => {
					const fl = fills[k];
					return <path key={k} d={WORLD[k].d} fill={fl?.color ?? BEIGE} />;
				})}
				{flagImg && <image href={staticFile('tex/flagmap21.png')} x={REL.x} y={REL.y} width={REL.w} height={REL.h} preserveAspectRatio="none" />}
				{flagImg && grey.map((k) => <path key={'g' + k} d={WORLD[k].d} fill={greyCol} />)}
				{flagged.map((k) => <FlagFill key={k} k={k} flag={fills[k].flag!} clip={`c${uid}${k}`} />)}
				{/* hill shading */}
				<image href={staticFile('tex/relief.jpg')} x={REL.x} y={REL.y} width={REL.w} height={REL.h} preserveAspectRatio="none" clipPath={`url(#land${uid})`} style={{mixBlendMode: 'multiply'}} />
				{/* borders */}
				<g fill="none" stroke="#5E5141" strokeWidth={0.9 / z} strokeLinejoin="round" opacity={0.75}>{KEYS.map((k) => <path key={k} d={WORLD[k].d} />)}</g>
				{/* lifted countries */}
				{lifted.map((k) => {
					const fl = fills[k];
					const L = fl.lift ?? 0;
					const [cx, cy] = WORLD[k].c;
					const s = (fl.pop ?? 1) * (1 + 0.035 * L);
					const tr = `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy - 4 * L / z})`;
					return (
						<g key={'l' + k}>
							<path d={WORLD[k].d} fill="#06142A" opacity={0.35 * L} transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx + 4 / z} ${-cy + 8 * L / z})`} />
							<g transform={tr}>
								<path d={WORLD[k].d} fill="none" stroke="#fff" strokeWidth={7 / z} strokeLinejoin="round" opacity={L} />
								<path d={WORLD[k].d} fill={fl.color ?? BEIGE} />
								{fl.flag && <FlagFill k={k} flag={fl.flag} clip={`c${uid}${k}`} />}
								<image href={staticFile('tex/relief.jpg')} x={REL.x} y={REL.y} width={REL.w} height={REL.h} preserveAspectRatio="none" clipPath={`url(#c${uid}${k})`} style={{mixBlendMode: 'multiply'}} />
								<path d={WORLD[k].d} fill="none" stroke={INK} strokeWidth={2.6 / z} strokeLinejoin="round" />
							</g>
						</g>
					);
				})}
				{children}
				{Object.keys(faces).map((k) => {
					const F = faces[k];
					if (!WORLD[k] || (F.pop ?? 1) < 0.02 || !inView(k)) return null;
					const bb = bboxOf(k);
					const [cx, cy] = WORLD[k].c;
					const base = isTiny(k) ? 10 : Math.max(9, Math.min(70, Math.min(bb.w, bb.h) * 0.62));
					const sz = Math.min(base * (F.size ?? 1), (F.max ?? 230) / z) * (F.pop ?? 1);
					return <g key={'f' + k} transform={`translate(${cx + (F.dx ?? 0)} ${cy + (F.dy ?? 0)}) scale(${sz / 100}) translate(-100 -100)`}><Face12 {...F} /></g>;
				})}
				{top}
			</g>
			<rect width={W} height={H} fill={`url(#vg${uid})`} />
			{dark > 0 && <rect width={W} height={H} fill="#06101F" opacity={dark} />}
		</svg>
	);
};

// ---------------------------------------------------------------------------
// Face12: big expressive cartoon face in a 200x200 box (centre 100,100)
// ---------------------------------------------------------------------------
const lidPath = (cx: number, cy: number, rx: number, ry: number, yl: number, tilt: number) => {
	const pts: string[] = [];
	for (let i = 0; i <= 48; i++) {
		const a = (i / 48) * Math.PI * 2;
		const x = cx + Math.cos(a) * rx, y0 = cy + Math.sin(a) * ry;
		const lim = yl + (x - cx) * tilt;
		pts.push(`${x.toFixed(1)} ${Math.min(y0, lim).toFixed(1)}`);
	}
	return 'M' + pts.join(' L') + 'Z';
};
export const Face12: React.FC<FaceSpec & {noBlush?: boolean}> = ({mood, look = [0, 0], blink = 0, talk = 0, noBlush}) => {
	const [lx, ly] = look;
	const eyes = [62, 138];
	const cy = 86;
	const wide = mood === 'scared' || mood === 'panic' || mood === 'shock';
	const rx = wide ? 33 : 30, ry = wide ? 40 : 36;
	const pr = mood === 'panic' || mood === 'shock' ? 8 : mood === 'scared' ? 10 : 15;
	// upper lid amount (0 open .. 1 closed) and tilt per eye
	const lid = mood === 'smug' ? 0.5 : mood === 'cool' ? 0.38 : mood === 'angry' ? 0.3 : mood === 'sad' ? 0.3 : mood === 'worried' ? 0.12 : 0;
	const tilt = (s: number) => (mood === 'angry' ? (s ? -0.45 : 0.45) : mood === 'sad' || mood === 'worried' ? (s ? 0.35 : -0.35) : 0);
	const bl = Math.max(0, Math.min(1, blink));
	const ink = INK;
	const red = mood === 'angry';
	return (
		<g>
			{/* eyes */}
			{eyes.map((ex, s) => {
				const yl = cy - ry + 2 * ry * Math.max(lid, bl);
				const px = ex + lx * (rx - pr - 6), py = cy + 4 + ly * (ry - pr - 8);
				return (
					<g key={s}>
						<ellipse cx={ex} cy={cy} rx={rx} ry={ry} fill="#fff" stroke={ink} strokeWidth={7} />
						{mood === 'love' ? (
							<path transform={`translate(${px} ${py}) scale(1.25)`} d="M0 8 C-14 -2 -10 -14 0 -7 C10 -14 14 -2 0 8Z" fill="#FF4F8B" stroke={ink} strokeWidth={2.5} />
						) : (
							<g>
								{red && <circle cx={px} cy={py} r={pr + 7} fill="#E8394A" />}
								<circle cx={px} cy={py} r={pr} fill={ink} />
								<circle cx={px - pr * 0.35} cy={py - pr * 0.4} r={Math.max(2.5, pr * 0.32)} fill="#fff" />
							</g>
						)}
						{(lid > 0 || bl > 0) && <path d={lidPath(ex, cy, rx + 1, ry + 1, yl, tilt(s))} fill={ink} />}
						{(lid > 0 || bl > 0.05) && <path d={`M${ex - rx - 2} ${yl + (-rx) * tilt(s)} L${ex + rx + 2} ${yl + rx * tilt(s)}`} stroke={ink} strokeWidth={5} strokeLinecap="round" />}
						<ellipse cx={ex} cy={cy} rx={rx} ry={ry} fill="none" stroke={ink} strokeWidth={7} />
					</g>
				);
			})}
			{/* brows */}
			{mood === 'angry' && <path d="M30 38 L88 56 M170 38 L112 56" stroke={ink} strokeWidth={11} strokeLinecap="round" />}
			{(mood === 'worried' || mood === 'scared' || mood === 'panic') && <path d="M34 44 Q56 30 86 38 M166 44 Q144 30 114 38" fill="none" stroke={ink} strokeWidth={9} strokeLinecap="round" transform={mood === 'panic' ? 'translate(0 -8)' : undefined} />}
			{mood === 'cool' && <path d="M34 42 Q58 34 86 44 M114 36 Q140 24 168 32" fill="none" stroke={ink} strokeWidth={9} strokeLinecap="round" />}
			{mood === 'sad' && <path d="M36 50 Q58 40 86 44 M164 50 Q142 40 114 44" fill="none" stroke={ink} strokeWidth={9} strokeLinecap="round" />}
			{/* blush */}
			{!noBlush && (mood === 'happy' || mood === 'love' || mood === 'smug' || mood === 'cool') && (
				<g fill="#FF7FA0" opacity={0.6}><ellipse cx={34} cy={134} rx={15} ry={9} /><ellipse cx={166} cy={134} rx={15} ry={9} /></g>
			)}
			{/* mouth */}
			<g transform="translate(0 4)">
				{mood === 'happy' && <path d={`M70 136 Q100 ${168 + talk * 10} 130 136 Z`} fill="#7A1426" stroke={ink} strokeWidth={6} strokeLinejoin="round" />}
				{mood === 'love' && <path d="M72 138 Q100 166 128 138" fill="none" stroke={ink} strokeWidth={7} strokeLinecap="round" />}
				{(mood === 'smug' || mood === 'cool') && <path d={`M76 146 Q104 ${154 + talk * 8} 128 134`} fill="none" stroke={ink} strokeWidth={7} strokeLinecap="round" />}
				{mood === 'neutral' && <path d="M82 146 L118 146" stroke={ink} strokeWidth={7} strokeLinecap="round" />}
				{(mood === 'scared' || mood === 'worried') && <path d="M66 148 q8 -9 17 0 q8 9 17 0 q8 -9 17 0 q8 9 17 0" fill="none" stroke={ink} strokeWidth={6.5} strokeLinecap="round" />}
				{mood === 'sad' && <path d="M76 156 Q100 132 124 156" fill="none" stroke={ink} strokeWidth={7} strokeLinecap="round" />}
				{(mood === 'panic' || mood === 'shock') && <ellipse cx={100} cy={150} rx={mood === 'panic' ? 20 : 14} ry={(mood === 'panic' ? 24 : 18) * (0.8 + 0.25 * talk)} fill="#5A0E1C" stroke={ink} strokeWidth={6} />}
				{mood === 'angry' && (
					<g>
						<rect x={66} y={134} width={68} height={30} rx={8} fill="#fff" stroke={ink} strokeWidth={6} />
						<path d="M66 149 H134 M83 134 V164 M100 134 V164 M117 134 V164" stroke={ink} strokeWidth={4} />
					</g>
				)}
			</g>
			{/* sweat & tears */}
			{(mood === 'scared' || mood === 'panic' || mood === 'worried') && <path d="M178 26 C186 40 190 48 182 54 C174 58 168 50 172 42 C174 36 176 32 178 26Z" fill="#7CC8FF" stroke={ink} strokeWidth={4} />}
			{mood === 'panic' && <path d="M22 30 C30 44 34 52 26 58 C18 62 12 54 16 46 C18 40 20 36 22 30Z" fill="#7CC8FF" stroke={ink} strokeWidth={4} />}
			{mood === 'sad' && <path d="M140 124 C146 136 148 142 142 146 C136 148 132 142 135 136Z" fill="#7CC8FF" stroke={ink} strokeWidth={3} />}
		</g>
	);
};
