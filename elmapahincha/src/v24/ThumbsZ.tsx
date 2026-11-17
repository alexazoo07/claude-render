// Miniaturas v24 con más detalle: mapas con zoom (países grandes), países "desintegrándose", camisetas y efectos
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Fonts} from '../fonts';
import {WORLD} from '../v5/WorldLayer5';
import {Map, mainBox} from '../v21/Thumbs21b';
import {StickerX, XM, Storm} from '../v21/Thumbs21c';
import {TT, Vig, Sparkles} from '../v22/Thumbs22b';
import {INK} from '../v21/Atlas21';
import {Jersey, Wheel} from './Video24';
import {KIT} from './data24';

const YEL = '#FFD23F', RED = '#FF3B3B', SW = 0.1;
type Cam = {x: number; y: number; z: number};
const proj = (k: string, c: Cam) => { const [x0, y0, x1, y1] = mainBox(k); return {x: ((x0 + x1) / 2 - c.x) * c.z + 960, y: ((y0 + y1) / 2 - c.y) * c.z + 540, w: (x1 - x0) * c.z, h: (y1 - y0) * c.z}; };
const rnd = (s: number) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };

// dashed white "ghost" outline + inner haze for the disappearing countries
const Ghosts: React.FC<{keys: string[]; cam: Cam}> = ({keys, cam}) => (
	<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
		<defs><pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="14" height="14" fill="rgba(0,0,0,0)" /><rect width="5" height="14" fill="rgba(255,255,255,0.18)" /></pattern></defs>
		<g transform={`translate(960 540) scale(${cam.z}) translate(${-cam.x} ${-cam.y})`}>
			{keys.filter((k) => WORLD[k]).map((k) => (
				<g key={k}>
					<path d={WORLD[k].d} fill="url(#hatch)" />
					<path d={WORLD[k].d} fill="none" stroke="#fff" strokeWidth={4 / cam.z} strokeDasharray={`${14 / cam.z} ${10 / cam.z}`} strokeLinejoin="round" opacity={0.95} />
				</g>
			))}
		</g>
	</svg>
);
// Thanos-like dust flying off a box toward the upper right
const Dust: React.FC<{x: number; y: number; w: number; h: number; n?: number; seed?: number; col?: string; dx?: number}> = ({x, y, w, h, n = 90, seed = 3, col = '#C9CED6', dx = 1}) => {
	const r = rnd(seed * 999 + 7);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			{Array.from({length: n}, (_, i) => {
				const t = r();
				const px = x + (r() - 0.3) * w * 0.8 + dx * t * w * 0.9, py = y + (r() - 0.5) * h * 0.8 - t * h * 0.7;
				const s = 4 + r() * 13 * (1 - t * 0.6);
				return <rect key={i} x={px} y={py} width={s} height={s} rx={s * 0.25} fill={i % 5 === 0 ? '#8C929B' : col} stroke={INK} strokeWidth={1.5} opacity={1 - t * 0.75} transform={`rotate(${r() * 90} ${px} ${py})`} />;
			})}
		</svg>
	);
};
const Glow: React.FC<{c: string; children: React.ReactNode; s?: number}> = ({c, children, s = 1}) => (
	<div style={{position: 'absolute', inset: 0, filter: `drop-shadow(0 0 ${10 * s}px ${c}) drop-shadow(0 0 ${28 * s}px ${c})`}}>{children}</div>
);
const St: React.FC<{k: string; w: number; x: number; y: number; m: XM; glow?: string; look?: [number, number]; rot?: number; ghost?: boolean}> = ({k, w, x, y, m, glow, look = [0, 0.1], rot, ghost}) => {
	const s = <StickerX k={k} w={w} x={x} y={y} m={m} look={look} rot={rot} />;
	if (ghost) return <div style={{position: 'absolute', inset: 0, filter: 'grayscale(1) brightness(1.05) drop-shadow(0 0 14px rgba(255,255,255,0.8))', opacity: 0.92}}>{s}</div>;
	return <div style={{position: 'absolute', inset: 0}}>{glow ? <Glow c={glow}>{s}</Glow> : s}</div>;
};
const J: React.FC<{k: string; w: number; x: number; y: number; rot?: number; x2?: boolean; glow?: string}> = ({k, w, x, y, rot = 0, x2, glow}) => (
	<div style={{position: 'absolute', left: x - w / 2, top: y - w / 2, transform: `rotate(${rot}deg)`, filter: glow ? `drop-shadow(0 0 10px ${glow}) drop-shadow(0 0 24px ${glow})` : 'drop-shadow(0 8px 0 rgba(0,0,0,0.45))'}}>
		<Jersey kit={KIT[k]} w={w} id={'z' + k + Math.round(x) + Math.round(y)} />
		{x2 && <svg width={w} height={w} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0}}><path d="M24 24 L76 80 M76 24 L24 80" stroke={INK} strokeWidth={15} strokeLinecap="round" /><path d="M24 24 L76 80 M76 24 L24 80" stroke="#E8394A" strokeWidth={9} strokeLinecap="round" /></svg>}
	</div>
);
// little name tag under a country
const Tag: React.FC<{t: string; x: number; y: number; c?: string}> = ({t, x, y, c = '#fff'}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', background: INK, color: c, fontFamily: 'Lilita One, sans-serif', fontSize: 30, padding: '3px 14px', borderRadius: 10, border: '3px solid #fff', whiteSpace: 'nowrap'}}>{t}</div>
);
const Base: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: '#2A72BA'}}><Fonts />{children}</AbsoluteFill>;
const Top: React.FC<{size?: number}> = ({size = 108}) => <TT parts={[['TU SELECCIÓN'], ['DESAPARECE', RED]]} size={size} sw={SW} style={{top: 18}} />;
const Bottom: React.FC<{c: string; col: string; pre?: string}> = ({c, col, pre = 'SI SU CAMISETA ES'}) => <TT parts={[[pre], [c, col]]} size={98} sw={SW} style={{top: 930}} />;
const Disappear: React.FC<{keys: string[]; cam: Cam; seed?: number}> = ({keys, cam, seed = 1}) => (
	<>
		<Ghosts keys={keys} cam={cam} />
		{keys.map((k, i) => { const p = proj(k, cam); return p.x > -200 && p.x < 2100 && p.y > -200 && p.y < 1300 ? <Dust key={k} x={p.x} y={p.y} w={Math.max(p.w, 160)} h={Math.max(p.h, 120)} n={Math.min(140, 40 + p.w * 0.25)} seed={seed + i} /> : null; })}
	</>
);

// 1 · Sudamérica con zoom: los de camiseta amarilla se desintegran
const SA: Cam = {x: 1240, y: 1210, z: 1.3};
export const T24l: React.FC = () => {
	const gone = ['BRA', 'COL', 'ECU'];
	const b = proj('BRA', SA);
	return (
		<Base>
			<Map cam={SA} mood="panic" dark={0.2} grey={(k) => gone.includes(k)} />
			<Disappear keys={gone} cam={SA} seed={4} />
			<Vig o={0.5} />
			<St k="BRA" w={400} x={1640} y={420} m="terror" ghost look={[-0.6, 0.2]} />
			<J k="BRA" w={230} x={330} y={330} rot={-14} x2 />
			<J k="COL" w={190} x={250} y={620} rot={10} x2 />
			<J k="ECU" w={170} x={420} y={830} rot={-6} x2 />
			<Top />
			<Bottom c="AMARILLA" col={YEL} />
		</Base>
	);
};
// 2 · Europa con zoom: los de camiseta roja se borran, España gigante delante
const EU: Cam = {x: 2010, y: 440, z: 3.0};
export const T24m: React.FC = () => {
	const gone = ['ESP', 'PRT', 'CHE', 'AUT', 'CZE', 'BEL', 'TUR', 'NOR'];
	return (
		<Base>
			<Map cam={EU} mood="panic" dark={0.2} grey={(k) => gone.includes(k)} />
			<Disappear keys={gone} cam={EU} seed={9} />
			<Vig o={0.5} />
			<St k="ESP" w={640} x={470} y={600} m="terror" glow="#FF3B3B" look={[0.6, -0.2]} />
			<J k="ESP" w={250} x={1680} y={760} rot={12} x2 />
			<Top />
			<Bottom c="ROJA" col={RED} />
		</Base>
	);
};
// 3 · la ruleta de colores sobre el mapa, con las favoritas temblando
export const T24n: React.FC = () => (
	<Base>
		<div style={{position: 'absolute', inset: 0, filter: 'blur(3px)'}}><Map cam={{x: 1700, y: 820, z: 1.1}} mood="panic" dark={0.3} /></div>
		<Vig o={0.65} />
		<Sparkles seed={3} n={20} />
		<div style={{position: 'absolute', left: 1220 - 400, top: 560 - 400, filter: 'drop-shadow(0 0 30px rgba(255,220,120,0.6))'}}><Wheel ang={-22} used={[]} hit={null} hitP={0} size={800} title="¿QUÉ COLOR?" /></div>
		<St k="BRA" w={300} x={260} y={330} m="terror" glow="#FFD23F" look={[0.7, 0]} />
		<St k="ESP" w={330} x={330} y={620} m="shock" glow="#FF3B3B" look={[0.7, 0]} />
		<St k="ARG" w={170} x={560} y={830} m="terror" glow="#6CB4EE" look={[0.7, -0.2]} />
		<St k="MEX" w={250} x={180} y={880} m="cry" glow="#4CD964" look={[0.7, -0.2]} />
		<Top size={104} />
		<TT parts={[['¿QUÉ COLOR', '#fff'], ['TE TOCA?', YEL]]} size={84} sw={SW} style={{top: 980, left: 760, right: 0}} />
	</Base>
);
// 4 · Norteamérica: México se desintegra, EE.UU. y Canadá alucinan
const NA: Cam = {x: 954, y: 666, z: 1.9};
export const T24o: React.FC = () => {
	const gone = ['MEX'];
	const m = proj('MEX', NA);
	return (
		<Base>
			<Map cam={NA} mood="shock" dark={0.2} grey={(k) => gone.includes(k)} />
			<Disappear keys={gone} cam={NA} seed={2} />
			<Dust x={m.x + 150} y={m.y - 100} w={500} h={300} n={110} seed={21} />
			<Vig o={0.5} />
			<St k="MEX" w={560} x={1420} y={560} m="terror" ghost look={[-0.6, 0.1]} />
			<J k="MEX" w={260} x={1700} y={840} rot={12} x2 />
			<Top />
			<Bottom c="VERDE" col="#4CD964" />
		</Base>
	);
};
// 5 · Europa + África: los de camiseta blanca se esfuman (Alemania, Inglaterra, Argelia, Senegal...)
const EA: Cam = {x: 1915, y: 620, z: 1.7};
export const T24p: React.FC = () => {
	const gone = ['ENG', 'DEU', 'DZA', 'SEN', 'GHA', 'IRN', 'JOR', 'IRQ'];
	return (
		<Base>
			<Map cam={EA} mood="panic" dark={0.2} grey={(k) => gone.includes(k)} />
			<Disappear keys={gone} cam={EA} seed={14} />
			<Vig o={0.5} />
			<St k="DEU" w={330} x={1640} y={430} m="terror" ghost look={[-0.5, 0]} />
			<J k="DEU" w={220} x={1700} y={760} rot={10} x2 />
			<J k="ENG" w={200} x={250} y={760} rot={-10} x2 />
			<St k="ENG" w={250} x={270} y={430} m="cry" ghost look={[0.5, 0]} />
			<Top />
			<Bottom c="BLANCA" col="#FFFFFF" />
		</Base>
	);
};
// 6 · antes / después: Sudamérica con caras vs. Sudamérica borrada
const SA2: Cam = {x: 1300, y: 1230, z: 1.6};
export const T24q: React.FC = () => {
	const all = ['BRA', 'COL', 'ECU', 'ARG', 'URY', 'PRY', 'PER', 'CHL', 'BOL', 'VEN', 'GUY', 'SUR'];
	return (
		<Base>
			<Map cam={SA2} mood="happy" dark={0.2} />
			<div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, overflow: 'hidden', clipPath: 'polygon(70px 0, 100% 0, 100% 100%, -60px 100%, 30px 520px, -40px 510px)'}}>
				<div style={{position: 'absolute', left: -960, top: 0, width: 1920, height: 1080}}>
					<Map cam={SA2} mood="panic" dark={0.35} grey={() => true} />
					<div style={{position: 'absolute', inset: 0, opacity: 0.3}}><Storm /></div>
					<Disappear keys={all} cam={SA2} seed={30} />
				</div>
			</div>
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><path d="M1030 0 L950 420 L1020 430 L900 1080 L840 1080 L930 520 L860 510 L950 0 Z" fill="#fff" stroke={INK} strokeWidth={10} strokeLinejoin="round" /></svg>
			<St k="ARG" w={230} x={1700} y={560} m="terror" ghost look={[-0.5, 0]} />
			<St k="BRA" w={300} x={260} y={760} m="shock" glow="#FFD23F" look={[0.6, -0.2]} />
			<TT parts={[['ANTES']]} size={100} sw={SW} style={{top: 22, left: 0, right: 960}} />
			<TT parts={[['DESPUÉS', RED]]} size={100} sw={SW} style={{top: 22, left: 960, right: 0}} />
			<TT parts={[['¿SOBREVIVE'], ['TU SELECCIÓN?', YEL]]} size={92} sw={SW} style={{top: 940}} />
		</Base>
	);
};
