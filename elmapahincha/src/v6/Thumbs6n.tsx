import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Trophy} from '../common';
import {Atlas, Face12, FaceMood, FaceSpec, Fill, INK} from '../v12/Atlas';
import iso from '../iso3flag.json';

// Imperialismo Europeo thumbnails (new style): Europe of flags with faces, darkened, big characters, no glow.
const FLAG = iso as Record<string, string>;
const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#FFF6E0', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.075}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.06}px 0 ${INK}`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const HB = (() => { const b = WORLD.ARG.b; return {x0: b[0][0], y0: b[0][1], x1: b[1][0], y1: b[1][1]}; })();
const BigArg: React.FC<{h: number; x: number; y: number; mood: FaceMood; look?: [number, number]; rot?: number}> = ({h, x, y, mood, look = [0, 0], rot = 0}) => {
	const S = h / (HB.y1 - HB.y0), W = (HB.x1 - HB.x0) * S;
	return (
		<div style={{position: 'absolute', left: x - W / 2, top: y, width: W, height: h, transform: `rotate(${rot}deg) scaleX(1.18)`}}>
			<svg width={W + 80} height={h + 80} style={{position: 'absolute', left: -40, top: -40, overflow: 'visible'}}>
				<defs><clipPath id="tA"><path d={WORLD.ARG.d} /></clipPath></defs>
				<g transform={`translate(40 40) scale(${S}) translate(${-HB.x0} ${-HB.y0})`}>
					<path d={WORLD.ARG.d} fill="#06142A" opacity={0.4} transform={`translate(${6 / S} ${12 / S})`} />
					<path d={WORLD.ARG.d} fill="none" stroke={INK} strokeWidth={30 / S} strokeLinejoin="round" />
					<path d={WORLD.ARG.d} fill="none" stroke="#fff" strokeWidth={20 / S} strokeLinejoin="round" />
					<g clipPath="url(#tA)">
						<image href={staticFile('flags/ar.svg')} x={HB.x0 - 120} y={HB.y0 + 10} width={(HB.x1 - HB.x0) + 240} height={(HB.y1 - HB.y0) * 0.75} preserveAspectRatio="none" />
						<rect x={HB.x0 - 10} y={HB.y0 + (HB.y1 - HB.y0) * 0.75} width={HB.x1 - HB.x0 + 20} height={(HB.y1 - HB.y0) * 0.3} fill="#6CB4EE" />
						<image href={staticFile('tex/relief.jpg')} x={0} y={20} width={3830} height={1720} preserveAspectRatio="none" style={{mixBlendMode: 'multiply'}} />
					</g>
					<path d={WORLD.ARG.d} fill="none" stroke={INK} strokeWidth={5 / S} strokeLinejoin="round" />
				</g>
			</svg>
			<svg width={W * 1.6} height={W * 1.6} viewBox="0 0 200 200" style={{position: 'absolute', left: W * 0.52 - W * 0.8, top: h * 0.27 - W * 0.75, overflow: 'visible'}}>
				<Face12 mood={mood} look={look} />
			</svg>
		</div>
	);
};
const Spark: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<svg width={s} height={s} viewBox="-20 -20 40 40" style={{position: 'absolute', left: x - s / 2, top: y - s / 2}}><path d="M0 -18 Q3 -3 18 0 Q3 3 0 18 Q-3 3 -18 0 Q-3 -3 0 -18Z" fill="#FFE066" stroke={INK} strokeWidth={2.5} /></svg>
);
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
import teams from './teams6.json';
const EU = (teams as {iso: string; flag: string}[]).map((t) => t.iso).filter((k) => WORLD[k]);
const MOODS: FaceMood[] = ['happy', 'shock', 'scared', 'worried', 'neutral', 'cool'];
const EuMap: React.FC<{cam: {x: number; y: number; z: number}; dark?: number; spain?: number; vig?: number}> = ({cam, dark = 0.36, spain = 0, vig = 0.45}) => {
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	EU.forEach((k, i) => {
		const conquered = spain > 0 && k !== 'ESP' && (i * 37) % 100 < spain * 100;
		fills[k] = {flag: conquered ? 'es' : FLAG[k] ?? 'es'};
		faces[k] = {mood: conquered ? 'sad' : MOODS[(i * 7) % MOODS.length], size: 0.85, max: 130, look: [0.3 * Math.sin(i), 0.2 * Math.cos(i)]};
	});
	return (
		<>
			<Atlas cam={cam} fills={fills} faces={faces} dark={dark} />
			<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, rgba(5,12,30,0) 30%, rgba(5,12,30,${vig}) 100%)`}} />
		</>
	);
};
const Base: React.FC<{children: React.ReactNode}> = ({children}) => (
	<AbsoluteFill style={{background: '#163E6E', overflow: 'hidden'}}>
		<Fonts />
		<FlagPreload flags={Object.values(FLAG)} />
		{children}
	</AbsoluteFill>
);
const CAM = {x: 2010, y: 410, z: 2.5};
const Top: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 150}) => <div style={{position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', justifyContent: 'center'}}><Txt size={size} color="#FFFFFF">{children}</Txt></div>;
const Bottom: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 170, color = '#FF4D5E'}) => <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center'}}><Txt size={size} color={color}>{children}</Txt></div>;
const Crown: React.FC<{x: number; y: number; w: number; rot?: number}> = ({x, y, w, rot = 0}) => (
	<svg width={w} height={w * 0.62} viewBox="0 0 200 124" style={{position: 'absolute', left: x - w / 2, top: y, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
		<path d="M14 108 L8 28 L58 70 L100 10 L142 70 L192 28 L186 108 Z" fill="#FFD23F" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
		<rect x={14} y={96} width={172} height={20} rx={6} fill="#F5B700" stroke={INK} strokeWidth={8} />
		<circle cx={100} cy={10} r={10} fill="#E8394A" stroke={INK} strokeWidth={6} />
		<circle cx={8} cy={28} r={8} fill="#E8394A" stroke={INK} strokeWidth={5} /><circle cx={192} cy={28} r={8} fill="#E8394A" stroke={INK} strokeWidth={5} />
	</svg>
);
const VSb: React.FC<{y?: number}> = ({y = 470}) => <div style={{position: 'absolute', left: 960 - 115, top: y, width: 230, height: 230, borderRadius: '50%', background: '#FFD23F', border: `10px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)'}}><Txt size={115} color="#E8394A">VS</Txt></div>;

// 1: like the reference — Spain with a crown over Europe
export const T6n1: React.FC = () => (
	<Base>
		<EuMap cam={CAM} />
		<CountryFace k="ESP" flag="es" x={960} y={600} w={760} mood="happy" rot={-2} />
		<Crown x={960} y={170} w={340} rot={-4} />
		<Spark x={560} y={330} s={70} /><Spark x={1370} y={300} s={56} /><Spark x={1400} y={760} s={46} />
		<Top>¿QUIÉN CONQUISTA</Top>
		<Bottom color="#4FA3F7">EUROPA?</Bottom>
	</Base>
);
// 2: IMPERIALISMO EUROPEO — smug Spain with crown
export const T6n2: React.FC = () => (
	<Base>
		<EuMap cam={{x: 2060, y: 400, z: 2.3}} />
		<CountryFace k="ESP" flag="es" x={900} y={610} w={720} mood="smug" rot={-4} />
		<Crown x={880} y={200} w={300} rot={-10} />
		<Spark x={1300} y={420} s={64} /><Spark x={500} y={360} s={50} />
		<Top size={150}>IMPERIALISMO</Top>
		<Bottom size={180} color="#FFD23F">EUROPEO</Bottom>
	</Base>
);
// 3: España vs Inglaterra
export const T6n3: React.FC = () => (
	<Base>
		<EuMap cam={CAM} dark={0.44} />
		<CountryFace k="ESP" flag="es" x={530} y={590} w={680} mood="angry" rot={-4} />
		<CountryFace k="ENG" flag="gb-eng" x={1430} y={570} w={480} mood="angry" rot={4} />
		<VSb />
		<Top size={136}>¿QUIÉN CONQUISTA EUROPA?</Top>
		<Bottom size={140}>¿ESPAÑA O INGLATERRA?</Bottom>
	</Base>
);
// 4: four powers lined up, crown hanging over them
export const T6n4: React.FC = () => (
	<Base>
		<EuMap cam={CAM} dark={0.42} />
		<CountryFace k="ESP" flag="es" x={300} y={600} w={400} mood="smug" rot={-5} />
		<CountryFace k="FRA" flag="fr" x={760} y={590} w={380} mood="angry" rot={3} />
		<CountryFace k="DEU" flag="de" x={1180} y={590} w={330} mood="cool" rot={-3} />
		<CountryFace k="ENG" flag="gb-eng" x={1610} y={600} w={330} mood="shock" rot={5} />
		<Crown x={960} y={200} w={260} rot={6} />
		<Top size={130}>¿QUIÉN SE QUEDA CON</Top>
		<Bottom size={170} color="#4FA3F7">EUROPA?</Bottom>
	</Base>
);
// 5: Europe painted with the Spanish flag
export const T6n5: React.FC = () => (
	<Base>
		<EuMap cam={CAM} spain={0.7} dark={0.38} />
		<CountryFace k="ESP" flag="es" x={960} y={600} w={700} mood="happy" rot={3} />
		<Crown x={960} y={190} w={320} rot={4} />
		<Spark x={600} y={330} s={64} /><Spark x={1330} y={330} s={52} />
		<Top size={130}>¿Y SI ESPAÑA CONQUISTARA</Top>
		<Bottom color="#FFD23F">EUROPA?</Bottom>
	</Base>
);

// VS series: IMPERIALISMO / EUROPEO with two countries
const Duel: React.FC<{a: [string, string, number, FaceMood]; b: [string, string, number, FaceMood]; cam?: {x: number; y: number; z: number}}> = ({a, b, cam = CAM}) => (
	<Base>
		<EuMap cam={cam} dark={0.44} />
		<CountryFace k={a[0]} flag={a[1]} x={500} y={580} w={a[2]} mood={a[3]} rot={-4} />
		<CountryFace k={b[0]} flag={b[1]} x={1420} y={580} w={b[2]} mood={b[3]} rot={4} />
		<VSb y={460} />
		<Top size={160}>IMPERIALISMO</Top>
		<Bottom size={170}>EUROPEO</Bottom>
	</Base>
);
export const T6v1: React.FC = () => <Duel a={['ESP', 'es', 680, 'angry']} b={['ENG', 'gb-eng', 480, 'angry']} />;
export const T6v2: React.FC = () => <Duel a={['FRA', 'fr', 600, 'angry']} b={['DEU', 'de', 500, 'smug']} />;
export const T6v3: React.FC = () => <Duel a={['ESP', 'es', 680, 'smug']} b={['FRA', 'fr', 600, 'angry']} />;
export const T6v4: React.FC = () => <Duel a={['ITA', 'it', 560, 'cool']} b={['DEU', 'de', 500, 'angry']} />;
export const T6v5: React.FC = () => <Duel a={['PRT', 'pt', 330, 'angry']} b={['ESP', 'es', 680, 'shock']} />;

// ---------------------------------------------------------------- FLAT style (like "¿Y si Argentina hubiese ganado?")
const FLAT_FLAGGED = EU.filter((k) => k !== 'ESP' && k !== 'FRA').concat(['USA', 'CAN', 'MEX', 'BRA', 'ARG', 'COL', 'VEN', 'DZA', 'MAR', 'EGY', 'SAU', 'IRN', 'NGA', 'COD', 'ETH', 'CHN', 'IND']);
const FLAT_MOODS: FaceMood[] = ['scared', 'worried', 'shock', 'neutral', 'happy'];
const FlatMap: React.FC<{cam: {x: number; y: number; z: number}}> = ({cam}) => {
	const z = cam.z;
	const tf = `translate(960 540) scale(${z}) translate(${-cam.x} ${-cam.y})`;
	const KEYS = Object.keys(WORLD);
	return (
		<AbsoluteFill>
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
				<defs>{FLAT_FLAGGED.filter((k) => WORLD[k] && FLAG[k]).map((k) => <clipPath key={k} id={`fl${k}`}><path d={WORLD[k].d} /></clipPath>)}</defs>
				<rect width={1920} height={1080} fill="#1E4C86" />
				<g transform={tf}>
					<image href={staticFile('tex/contours.png')} x={0} y={20} width={3830} height={1720} preserveAspectRatio="none" />
					{KEYS.map((k) => <path key={k} d={WORLD[k].d} fill="#272D3B" stroke="#1A1F2A" strokeWidth={0.8 / z} />)}
					{FLAT_FLAGGED.filter((k) => WORLD[k] && FLAG[k]).map((k) => {
						const b = WORLD[k].b;
						return (
							<g key={'f' + k}>
								<g clipPath={`url(#fl${k})`}><image href={staticFile(`flags/${FLAG[k]}.svg`)} x={b[0][0] - 1} y={b[0][1] - 1} width={b[1][0] - b[0][0] + 2} height={b[1][1] - b[0][1] + 2} preserveAspectRatio="none" /></g>
								<path d={WORLD[k].d} fill="none" stroke="#11151E" strokeWidth={1.4 / z} strokeLinejoin="round" />
							</g>
						);
					})}
					{FLAT_FLAGGED.filter((k) => WORLD[k] && FLAG[k]).map((k, i) => {
						const b = WORLD[k].b; const [cx, cy] = WORLD[k].c;
						const sz = Math.max(7, Math.min(36, Math.min(b[1][0] - b[0][0], b[1][1] - b[0][1]) * 0.55, 110 / z));
						return <g key={'e' + k} transform={`translate(${cx} ${cy}) scale(${sz / 100}) translate(-100 -100)`}><Face12 mood={FLAT_MOODS[(i * 3) % FLAT_MOODS.length]} noBlush /></g>;
					})}
				</g>
			</svg>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 78% 74% at 50% 50%, rgba(4,10,26,0) 25%, rgba(4,10,26,0.25) 55%, rgba(4,10,26,0.6) 85%, rgba(4,10,26,0.8) 100%)'}} />
		</AbsoluteFill>
	);
};
const BigT: React.FC<{children: React.ReactNode; size: number; color?: string}> = ({children, size, color = '#FFFFFF'}) => (
	<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: size, lineHeight: 1, color, letterSpacing: size * 0.01, WebkitTextStroke: `${size * 0.11}px #121624`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.06}px 0 #121624, 0 ${size * 0.1}px ${size * 0.12}px rgba(0,0,0,0.55)`, whiteSpace: 'nowrap', textTransform: 'uppercase'}}>{children}</div>
);
const SKY = '#7CC6FF', RED3 = '#F2433A';
const FlatDuel: React.FC<{top: React.ReactNode; bottom: React.ReactNode; ts?: number; bs?: number; cam?: {x: number; y: number; z: number}}> = ({top, bottom, ts = 150, bs = 160, cam = {x: 2010, y: 410, z: 2.5}}) => (
	<Base>
		<FlatMap cam={cam} />
		<CountryFace k="ESP" flag="es" x={500} y={580} w={680} mood="smug" rot={-4} />
		<CountryFace k="FRA" flag="fr" x={1420} y={580} w={600} mood="angry" rot={4} />
		<VSb y={460} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 24, display: 'flex', justifyContent: 'center'}}><BigT size={ts}>{top}</BigT></div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center'}}><BigT size={bs} color={RED3}>{bottom}</BigT></div>
	</Base>
);
export const T6f1: React.FC = () => <FlatDuel top="IMPERIALISMO" bottom="EUROPEO" />;
export const T6f2: React.FC = () => <FlatDuel top={<>IMPERIALISMO <span style={{color: SKY}}>EUROPEO</span></>} ts={118} bottom="¿QUIÉN GANA?" />;
export const T6f3: React.FC = () => <FlatDuel top={<>¿QUIÉN <span style={{color: SKY}}>CONQUISTA</span></>} bottom="EUROPA?" bs={170} />;
export const T6f4: React.FC = () => <FlatDuel top={<>¿Y SI... <span style={{color: SKY}}>EUROPA</span></>} bottom="FUESE UN IMPERIO?" bs={130} cam={{x: 2030, y: 430, z: 1.9}} />;
export const T6f5: React.FC = () => <FlatDuel top={<>IMPERIALISMO <span style={{color: SKY}}>EUROPEO</span></>} ts={118} bottom="¿ESPAÑA O FRANCIA?" bs={130} cam={{x: 2000, y: 450, z: 1.6}} />;

// lighter versions of T6v3
const DuelL: React.FC<{dark: number; vig: number}> = ({dark, vig}) => (
	<Base>
		<EuMap cam={CAM} dark={dark} vig={vig} />
		<CountryFace k="ESP" flag="es" x={500} y={580} w={680} mood="smug" rot={-4} />
		<CountryFace k="FRA" flag="fr" x={1420} y={580} w={600} mood="angry" rot={4} />
		<VSb y={460} />
		<Top size={160}>IMPERIALISMO</Top>
		<Bottom size={170}>EUROPEO</Bottom>
	</Base>
);
export const T6l1: React.FC = () => <DuelL dark={0.36} vig={0.42} />;
export const T6l2: React.FC = () => <DuelL dark={0.3} vig={0.4} />;
export const T6l3: React.FC = () => <DuelL dark={0.25} vig={0.38} />;
export const T6l4: React.FC = () => <DuelL dark={0.2} vig={0.36} />;
export const T6l5: React.FC = () => <DuelL dark={0.15} vig={0.34} />;
