// Nuevas miniaturas v24 · "Tu selección desaparece si su camiseta..."
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Fonts} from '../fonts';
import {Map, Lava, Bolt} from '../v21/Thumbs21b';
import {StickerX, XM, Storm} from '../v21/Thumbs21c';
import {TT, Vig, Rays, Sparkles} from '../v22/Thumbs22b';
import {Jersey} from './Video24';
import {KIT} from './data24';
import E from './elim24.json';

const YEL = '#FFD23F', RED = '#FF3B3B', BLUE = '#5EC8FF', WHITE = '#FFFFFF';
const R = (E as any).rounds as Record<string, [string, string][]>;
const set = (...rs: string[]) => new Set(rs.flatMap((r) => (R[r] ?? []).map((x) => x[0])));
const WORLD_CAM = {x: 1915, y: 880, z: 0.62};
const SW = 0.1;
const Glow: React.FC<{c: string; children: React.ReactNode}> = ({c, children}) => (
	<div style={{position: 'absolute', inset: 0, filter: `drop-shadow(0 0 10px ${c}) drop-shadow(0 0 30px ${c})`}}>{children}</div>
);
const St: React.FC<{k: string; w: number; x: number; y: number; m: XM; glow: string; look?: [number, number]}> = ({k, w, x, y, m, glow, look = [0, 0.1]}) => (
	<div style={{position: 'absolute', inset: 0}}><Glow c={glow}><StickerX k={k} w={w} x={x} y={y} m={m} look={look} /></Glow></div>
);
const J: React.FC<{k: string; w: number; x: number; y: number; rot?: number; glow?: string}> = ({k, w, x, y, rot = 0, glow}) => (
	<div style={{position: 'absolute', left: x - w / 2, top: y - w / 2, transform: `rotate(${rot}deg)`, filter: glow ? `drop-shadow(0 0 12px ${glow}) drop-shadow(0 0 30px ${glow})` : 'drop-shadow(0 8px 0 rgba(0,0,0,0.4))'}}>
		<Jersey kit={KIT[k]} w={w} id={'y' + k + Math.round(x)} />
	</div>
);
const Base: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: '#2A72BA'}}><Fonts />{children}</AbsoluteFill>;
const Top: React.FC = () => <TT parts={[['TU SELECCIÓN'], ['DESAPARECE', RED]]} size={112} sw={SW} style={{top: 20}} />;

// 1 · estilo adjunto: mapa con caras, Brasil gigante al centro
export const T24f: React.FC = () => (
	<Base>
		<Map cam={WORLD_CAM} mood="scared" dark={0.2} />
		<Vig />
		<St k="BRA" w={560} x={960} y={540} m="terror" glow="#FFD23F" />
		<Top />
		<TT parts={[['SI SU CAMISETA ES'], ['AMARILLA', YEL]]} size={100} sw={SW} style={{top: 925}} />
	</Base>
);
// 2 · España al centro y los países de camiseta roja ya borrados del mapa
const RojaV: React.FC<{w: number; y?: number}> = ({w, y = 545}) => {
	const g = set('ROJA');
	return (
		<Base>
			<Map cam={WORLD_CAM} mood="panic" dark={0.2} grey={(k) => g.has(k)} />
			<Vig />
			<St k="ESP" w={w} x={960} y={y} m="terror" glow="#FF3B3B" />
			<Top />
			<TT parts={[['SI SU CAMISETA ES'], ['ROJA', RED]]} size={104} sw={SW} style={{top: 920}} />
		</Base>
	);
};
// 3 · lava: Argentina cayendo con su camiseta
export const T24h: React.FC = () => (
	<Base>
		<Lava seed={5} />
		<Vig o={0.4} />
		<St k="ARG" w={460} x={720} y={560} m="terror" glow="#FF7A00" look={[0.5, -0.2]} />
		<J k="ARG" w={360} x={1330} y={600} rot={10} glow="#6CB4EE" />
		<Top />
		<TT parts={[['SI SU CAMISETA TIENE'], ['RAYAS', BLUE]]} size={104} sw={SW} style={{top: 920}} />
	</Base>
);
// 4 · mapa casi vacío: solo quedan unos pocos
export const T24i: React.FC = () => {
	const keep = new Set(['URY', 'COD', 'ARG', 'PRY', 'HRV']);
	return (
		<Base>
			<Map cam={WORLD_CAM} mood="panic" dark={0.25} grey={(k) => !keep.has(k)} />
			<Vig />
			<TT parts={[['48 SELECCIONES']]} size={120} sw={SW} style={{top: 24}} />
			<TT parts={[['SOLO'], ['1', YEL], ['SOBREVIVE', RED]]} size={150} sw={SW} style={{top: 860}} />
		</Base>
	);
};
// 5 · pantalla partida: mapa normal | mapa borrado, camiseta al centro
export const T24j: React.FC = () => {
	const g = set('VERDE', 'NEGRA', 'AMARILLA', 'NARANJA', 'BLANCA', 'AZUL', 'ROJA', 'CELESTE');
	return (
		<Base>
			<Map cam={{x: 1500, y: 900, z: 0.75}} mood="happy" dark={0.2} />
			<div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, overflow: 'hidden', clipPath: 'polygon(70px 0, 100% 0, 100% 100%, -60px 100%, 30px 520px, -40px 510px)'}}>
				<div style={{position: 'absolute', left: -960, top: 0, width: 1920, height: 1080, filter: 'brightness(0.8)'}}><Map cam={{x: 1500, y: 900, z: 0.75}} mood="panic" dark={0.35} grey={() => true} /></div>
			</div>
			<Bolt x={960} />
			<J k="MEX" w={380} x={480} y={560} rot={-8} glow="#4CD964" />
			<St k="MEX" w={520} x={1450} y={560} m="terror" glow="#FF3B3B" look={[-0.6, 0]} />
			<TT parts={[['ANTES'], ['DESPUÉS', RED]]} size={110} sw={SW} style={{top: 24, gap: 540}} />
			<TT parts={[['SI SU CAMISETA ES'], ['VERDE', '#4CD964']]} size={100} sw={SW} style={{top: 925}} />
		</Base>
	);
};
// 6 · rayos de colores: la camiseta como protagonista
export const T24k: React.FC = () => (
	<Base>
		<Rays c1="#C81E2A" c2="#9E1520" cx="50%" cy="55%" n={26} />
		<Sparkles seed={9} n={24} />
		<J k="ESP" w={520} x={960} y={560} rot={-4} />
		<St k="DEU" w={230} x={330} y={600} m="shock" glow="#FFFFFF" />
		<St k="BRA" w={230} x={1600} y={520} m="cry" glow="#FFD23F" />
		<St k="ARG" w={170} x={1560} y={850} m="terror" glow="#6CB4EE" />
		<St k="FRA" w={210} x={360} y={860} m="terror" glow="#5E8BFF" />
		<Top />
		<TT parts={[['SI SU CAMISETA ES...', YEL]]} size={110} sw={SW} style={{top: 920}} />
	</Base>
);

export const T24g: React.FC = () => <RojaV w={600} />;
export const T24r: React.FC = () => <RojaV w={740} y={540} />;
export const T24s: React.FC = () => <RojaV w={840} y={535} />;
