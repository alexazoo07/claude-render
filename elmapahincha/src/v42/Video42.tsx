// V42 · ¿Qué pasaría si Latinoamérica recuperara su territorio perdido?
import React from 'react';
import {staticFile} from 'remotion';
import {makeStory, Scene, OutroEls, FL} from '../vs/Story';
import type {Fill, FaceSpec} from '../v12/Atlas';
import {INK} from '../v12/Atlas';
import {WORLD} from '../v5/WorldLayer5';
import {FlagCover} from '../flagCover';
import {clamp01, easeOut} from '../ui';
import LOST from './lost.json';

const f = (k: string) => FL[k];
type LK = keyof typeof LOST | 'PAN' | 'FLK' | 'BLZ';
const OWN: Record<string, string> = {TEXAS: 'MEX', CESION: 'MEX', LITORAL: 'BOL', ACRE: 'BOL', CHACO: 'BOL', TARAPACA: 'PER', FORMOSA: 'PRY', MATOGROSSO: 'PRY', AMAZONIA_EC: 'ECU', PAN: 'COL', ESEQUIBO: 'VEN', FLK: 'ARG', BLZ: 'GTM'};
const LAND = ['CHL', 'BOL', 'PER', 'BRA', 'PRY', 'ARG', 'ECU', 'GUY', 'VEN', 'COL', 'USA'];
const geo = (k: string) => (k in LOST ? (LOST as any)[k] : {d: WORLD[k].d, c: WORLD[k].c, b: WORLD[k].b});
// overlay: lost territories painted with the claimant's flag (appear at t0, staggered)
const Lost: React.FC<{keys: string[]; t: number; at?: number; step?: number}> = ({keys, t, at = 60, step = 40}) => (
	<g>
		<defs>
			<clipPath id="lland">{LAND.map((k) => <path key={k} d={WORLD[k].d} />)}</clipPath>
			{keys.map((k) => <clipPath key={k} id={'lc' + k}><path d={geo(k).d} /></clipPath>)}
		</defs>
		{keys.map((k, i) => {
			const p = easeOut((t - at - i * step) / 30);
			if (p <= 0) return null;
			const g = geo(k); const [[x0, y0], [x1, y1]] = g.b;
			const inner = (
				<g opacity={p}>
					<g clipPath={`url(#lc${k})`}>
						{x1 - x0 < 30 ? <rect x={x0 - 2} y={y0 - 2} width={x1 - x0 + 4} height={y1 - y0 + 4} fill="#74ACDF" /> : <FlagCover flag={f(OWN[k])} x={x0} y={y0} w={x1 - x0} h={y1 - y0} />}
						<image href={staticFile('tex/relief.jpg')} x={0} y={20} width={3830} height={1720} preserveAspectRatio="none" style={{mixBlendMode: 'multiply'}} />
					</g>
					<path d={g.d} fill="none" stroke="#fff" strokeWidth={k === "FLK" ? 1.2 : 2.4} strokeDasharray={k === "FLK" ? "2 2" : "5 4"} strokeLinejoin="round" />
				</g>
			);
			return <g key={k} clipPath={k in LOST && k !== 'TEXAS' && k !== 'CESION' ? 'url(#lland)' : undefined}>{inner}</g>;
		})}
	</g>
);
const base = (ks: string[], extra: Record<string, Fill> = {}): Record<string, Fill> => ({...Object.fromEntries(ks.map((k) => [k, {flag: f(k), lift: 0.3}])), ...extra});
const fc = (m: Record<string, [FaceSpec['mood'], number?]>): Record<string, FaceSpec> => Object.fromEntries(Object.entries(m).map(([k, [mood, s]]) => [k, {mood, size: s ?? 1.3, max: 130}]));
const ALLK = ['TEXAS', 'CESION', 'LITORAL', 'ACRE', 'CHACO', 'TARAPACA', 'FORMOSA', 'MATOGROSSO', 'AMAZONIA_EC', 'PAN', 'ESEQUIBO', 'FLK', 'BLZ'];
const LATK = ['MEX', 'GTM', 'SLV', 'HND', 'NIC', 'CRI', 'CUB', 'HTI', 'DOM', 'COL', 'VEN', 'ECU', 'PER', 'BOL', 'BRA', 'PRY', 'CHL', 'ARG', 'URY'];
const LCAM = ['MEX', 'BRA', 'ARG', 'CUB', 'CHL', 'USA'];
const MCAM: [number, number, number, number] = [640, 440, 1010, 760];
const SAM = ['PER', 'BOL', 'CHL', 'PRY', 'BRA', 'ARG'];

const S: Scene[] = [
	{dur: 1100, cam: LCAM, fills: base(LATK), faces: fc({MEX: ['smug', 1.2], BOL: ['happy', 1.2], USA: ['shock', 1.2]}), map: (t) => <Lost keys={ALLK} t={t} at={200} step={30} />, music: 'm_tense', sfx: [[200, 'riser', 0.3]],
		els: [{t: 'title', text: '¿Y SI LATINOAMÉRICA RECUPERARA SU TERRITORIO PERDIDO?', hl: 'TERRITORIO PERDIDO', at: 10, size: 72}, {t: 'bubble', k: 'USA', text: '¡Eh! ¡Eso es mío!', at: 620, dur: 260}]},
	{dur: 800, cam: LCAM, fills: base(LATK), faces: fc({MEX: ['happy'], BRA: ['happy']}), label: 'LAS REGLAS', music: 'm_happy',
		els: [{t: 'card', at: 20, pos: 'br', title: 'CÓMO FUNCIONA', tag: 'REGLAS', col: '#3DB86B', lines: ['Repasamos territorios que países de Latinoamérica perdieron o reclaman', 'Los devolvemos al mapa, uno a uno', 'Y vemos quién gana... y quién pierde']}]},
	// ---------------- MÉXICO
	{dur: 1300, camBox: MCAM, fills: base(['MEX'], {USA: {color: '#B9C3D6'}}), faces: fc({MEX: ['sad', 1.6], USA: ['smug', 1.4]}), label: 'MÉXICO',
		els: [{t: 'title', text: 'MÉXICO: EL QUE MÁS PERDIÓ', hl: 'MÁS PERDIÓ', at: 10}, {t: 'card', at: 120, pos: 'br', title: 'MÁS DE LA MITAD DE SU TERRITORIO', lines: ['Entre 1836 y 1853', 'Todo fue a parar a Estados Unidos'], col: '#E8394A'}, {t: 'bubble', k: 'MEX', text: '¡Me duele recordarlo!', at: 420, dur: 240}]},
	{dur: 1400, camBox: MCAM, fills: base(['MEX'], {USA: {color: '#B9C3D6'}}), faces: fc({MEX: ['happy', 1.6], USA: ['worried', 1.4]}), map: (t) => <Lost keys={['TEXAS']} t={t} at={60} />, label: 'MÉXICO',
		els: [{t: 'card', at: 120, pos: 'br', title: 'TEXAS', tag: '1836 · 1845', lines: ['Se independizó de México en 1836', 'Y se unió a Estados Unidos en 1845', 'Hoy mide casi 700.000 km²'], col: '#3DB86B'}, {t: 'bubble', k: 'MEX', text: '¡Texas vuelve a casa!', at: 500, dur: 260}]},
	{dur: 1500, camBox: MCAM, fills: base(['MEX'], {USA: {color: '#B9C3D6'}}), faces: fc({MEX: ['love', 1.8], USA: ['shock', 1.4]}), map: (t) => <Lost keys={['TEXAS', 'CESION']} t={t} at={-100} step={160} />, label: 'MÉXICO',
		els: [{t: 'card', at: 120, pos: 'br', title: 'EL TRATADO DE GUADALUPE HIDALGO', tag: '1848', lines: ['Tras la guerra con Estados Unidos (1846-1848)', 'California, Nevada, Utah, Arizona, Nuevo México...', '...y parte de Colorado y Wyoming'], col: '#3DB86B'}, {t: 'bubble', k: 'USA', text: '¿Y mi Hollywood?', at: 700, dur: 260}]},
	{dur: 1300, cam: {x: 1880, y: 820, z: 0.55}, fills: base(['MEX'], {USA: {color: '#B9C3D6'}}), faces: fc({MEX: ['cool', 1.6]}), map: (t) => <Lost keys={['TEXAS', 'CESION']} t={t} at={-200} />, label: 'MÉXICO',
		els: [{t: 'rank', at: 20, title: 'NUEVO RANKING DE TAMAÑO', unit: 'millones de km² (aprox.)', dec: 1, rows: [{k: 'RUS', label: 'Rusia', v: 17.1}, {k: 'CAN', label: 'Canadá', v: 9.98}, {k: 'CHN', label: 'China', v: 9.6}, {k: 'BRA', label: 'Brasil', v: 8.5}, {k: 'AUS', label: 'Australia', v: 7.7}, {k: 'USA', label: 'EE. UU. (sin esas tierras)', v: 7.3}, {k: 'MEX', label: 'MÉXICO', v: 4.4, hl: true}, {k: 'IND', label: 'India', v: 3.3}]}]},
	// ---------------- BOLIVIA
	{dur: 1100, cam: SAM, fills: base(SAM), faces: fc({BOL: ['sad', 1.6]}), label: 'BOLIVIA',
		els: [{t: 'title', text: 'BOLIVIA: PERDIÓ CON CASI TODOS SUS VECINOS', hl: 'CASI TODOS', at: 10, size: 72}, {t: 'chips', at: 200, y: 820, step: 40, items: [{flag: f('CHL'), text: 'Chile', sub: 'El mar'}, {flag: f('BRA'), text: 'Brasil', sub: 'El Acre'}, {flag: f('PRY'), text: 'Paraguay', sub: 'El Chaco'}]}]},
	{dur: 1400, camBox: [1080, 1100, 1380, 1340], fills: base(['BOL', 'CHL', 'PER', 'ARG']), faces: fc({BOL: ['love', 1.6], CHL: ['worried', 1.2]}), map: (t) => <Lost keys={['LITORAL']} t={t} at={60} />, label: 'BOLIVIA', sfx: [[60, 'crowd_ohh', 0.2]],
		els: [{t: 'card', at: 120, pos: 'br', title: 'EL LITORAL BOLIVIANO', tag: 'GUERRA DEL PACÍFICO · 1879-1884', lines: ['Perdió su salida al mar frente a Chile', 'Unos 400 km de costa', 'Hoy es la región chilena de Antofagasta'], col: '#3DB86B'}, {t: 'bubble', k: 'BOL', text: '¡Vuelvo a tener mar!', at: 500, dur: 260}]},
	{dur: 1300, cam: ['BOL', 'BRA', 'PER'], fills: base(['BOL', 'BRA', 'PER']), faces: fc({BOL: ['happy', 1.6], BRA: ['worried', 1.2]}), map: (t) => <Lost keys={['LITORAL', 'ACRE']} t={t} at={-200} step={260} />, label: 'BOLIVIA',
		els: [{t: 'card', at: 120, pos: 'br', title: 'EL ACRE', tag: 'TRATADO DE PETRÓPOLIS · 1903', lines: ['Una región de selva rica en caucho', 'Pasó a Brasil tras la Guerra del Acre', 'Hoy es un estado brasileño de unos 164.000 km²'], col: '#3DB86B'}]},
	{dur: 1300, cam: ['BOL', 'PRY'], fills: base(['BOL', 'PRY', 'ARG']), faces: fc({BOL: ['cool', 1.6], PRY: ['angry', 1.4]}), map: (t) => <Lost keys={['LITORAL', 'ACRE', 'CHACO']} t={t} at={-400} step={260} />, label: 'BOLIVIA',
		els: [{t: 'card', at: 120, pos: 'br', title: 'EL CHACO BOREAL', tag: 'GUERRA DEL CHACO · 1932-1935', lines: ['La guerra más sangrienta de Sudamérica en el siglo XX', 'Paraguay se quedó con la mayor parte del Chaco Boreal'], col: '#3DB86B'}, {t: 'bubble', k: 'PRY', text: '¡Eh, eso lo gané yo!', at: 500, dur: 260}]},
	// ---------------- PERÚ
	{dur: 1300, camBox: [1080, 1100, 1380, 1340], fills: base(['PER', 'CHL', 'BOL']), faces: fc({PER: ['happy', 1.5], CHL: ['shock', 1.2]}), map: (t) => <Lost keys={['LITORAL', 'TARAPACA']} t={t} at={-200} step={260} />, label: 'PERÚ',
		els: [{t: 'card', at: 120, pos: 'br', title: 'TARAPACÁ Y ARICA', tag: 'GUERRA DEL PACÍFICO', lines: ['Perú cedió Tarapacá en 1883', 'Y Arica en 1929', 'Tacna sí volvió a Perú ese mismo año'], col: '#3DB86B'}, {t: 'bubble', k: 'CHL', text: '¿Y mi desierto del norte?', at: 560, dur: 260}]},
	// ---------------- PARAGUAY
	{dur: 1400, cam: ['PRY', 'ARG', 'BRA', 'BOL'], fills: base(['PRY', 'ARG', 'BRA', 'BOL', 'URY']), faces: fc({PRY: ['happy', 1.5], ARG: ['worried', 1.1]}), map: (t) => <Lost keys={['FORMOSA', 'MATOGROSSO']} t={t} at={60} step={120} />, label: 'PARAGUAY',
		els: [{t: 'card', at: 120, pos: 'br', title: 'LA GUERRA DE LA TRIPLE ALIANZA', tag: '1864-1870', lines: ['Contra Argentina, Brasil y Uruguay', 'Perdió territorios con Argentina y Brasil', 'Y una parte enorme de su población'], col: '#3DB86B'}, {t: 'bubble', k: 'PRY', text: '¡Pero me quitáis el Chaco!', at: 700, dur: 280}]},
	// ---------------- ECUADOR
	{dur: 1300, cam: ['ECU', 'PER', 'COL'], fills: base(['ECU', 'PER', 'COL']), faces: fc({ECU: ['love', 1.6], PER: ['worried', 1.2]}), map: (t) => <Lost keys={['AMAZONIA_EC']} t={t} at={60} />, label: 'ECUADOR',
		els: [{t: 'card', at: 120, pos: 'br', title: 'LA AMAZONÍA ECUATORIANA', tag: '1941-1942', lines: ['Guerra con Perú en 1941', 'Protocolo de Río de Janeiro en 1942', 'La paz definitiva llegó en 1998'], col: '#3DB86B'}, {t: 'bubble', k: 'ECU', text: '¡Mi Amazonía!', at: 500, dur: 240}]},
	// ---------------- COLOMBIA
	{dur: 1300, cam: ['COL', 'PAN', 'CRI'], fills: base(['COL', 'CRI', 'VEN']), faces: fc({COL: ['happy', 1.5], PAN: ['angry', 2]}), map: (t) => <Lost keys={['PAN']} t={t} at={60} />, label: 'COLOMBIA',
		els: [{t: 'card', at: 120, pos: 'br', title: 'PANAMÁ', tag: '1903', lines: ['Se separó de Colombia en 1903', 'Con el apoyo de Estados Unidos', 'Poco después empezó a construirse el canal'], col: '#3DB86B'}, {t: 'bubble', k: 'PAN', text: '¡Ni hablar!', at: 500, dur: 240}]},
	// ---------------- RECLAMACIONES ACTUALES
	{dur: 1400, cam: ['VEN', 'GUY', 'SUR'], fills: base(['VEN', 'GUY', 'BRA']), faces: fc({VEN: ['happy', 1.5], GUY: ['angry', 1.6]}), map: (t) => <Lost keys={['ESEQUIBO']} t={t} at={60} />, label: 'RECLAMACIÓN ACTUAL', music: 'm_tense',
		els: [{t: 'card', at: 120, pos: 'br', title: 'LA GUAYANA ESEQUIBA', tag: 'EN DISPUTA', lines: ['Venezuela la reclama; hoy la administra Guyana', 'Son unos 159.500 km²: dos tercios de Guyana', 'El caso está en la Corte Internacional de Justicia'], col: '#F47B20'}]},
	{dur: 1300, camBox: [1180, 1380, 1460, 1700], fills: base(['ARG', 'CHL', 'URY']), faces: fc({ARG: ['love', 1.5]}), map: (t) => <Lost keys={['FLK']} t={t} at={60} />, label: 'RECLAMACIÓN ACTUAL',
		els: [{t: 'card', at: 120, pos: 'br', title: 'LAS ISLAS MALVINAS', tag: 'EN DISPUTA', lines: ['Bajo control británico desde 1833', 'Escenario de la guerra de 1982', 'Argentina mantiene su reclamación de soberanía'], col: '#F47B20'}]},
	{dur: 1200, cam: ['GTM', 'BLZ', 'MEX', 'HND'], fills: base(['GTM', 'MEX', 'HND']), faces: fc({GTM: ['happy', 1.5], BLZ: ['worried', 2]}), map: (t) => <Lost keys={['BLZ']} t={t} at={60} />, label: 'RECLAMACIÓN ACTUAL',
		els: [{t: 'card', at: 120, pos: 'br', title: 'BELICE', tag: 'EN DISPUTA', lines: ['Guatemala reclama gran parte de su territorio', 'Ambos países llevaron el caso a la Corte Internacional de Justicia'], col: '#F47B20'}, {t: 'sub', f: 640}]},
	// ---------------- RESULTADO
	{dur: 1500, cam: LCAM, fills: base(LATK), faces: fc({MEX: ['love', 1.4], BOL: ['love', 1.3], USA: ['sad', 1.3]}), map: (t) => <Lost keys={ALLK} t={t} at={20} step={14} />, label: 'EL NUEVO MAPA', music: 'm_triumph',
		els: [{t: 'title', text: 'EL NUEVO MAPA DE LATINOAMÉRICA', hl: 'NUEVO MAPA', at: 10, size: 74}, {t: 'chips', at: 300, y: 830, step: 30, items: [{flag: f('MEX'), text: 'México', sub: 'Más del doble'}, {flag: f('BOL'), text: 'Bolivia', sub: '¡Con mar!'}, {flag: f('PER'), text: 'Perú', sub: 'Tarapacá y Arica'}, {flag: f('COL'), text: 'Colombia', sub: 'Con Panamá'}, {flag: f('VEN'), text: 'Venezuela', sub: 'El Esequibo'}, {flag: f('ARG'), text: 'Argentina', sub: 'Las Malvinas'}]}]},
	{dur: 1300, cam: LCAM, fills: base(['USA', 'CHL', 'BRA', 'GUY', 'BLZ', 'PRY']), faces: fc({USA: ['angry', 1.4], CHL: ['sad', 1.2], BRA: ['worried', 1.3]}), map: (t) => <Lost keys={ALLK} t={t} at={-400} />, label: '¿Y QUIÉN PIERDE?', music: 'm_tense',
		els: [{t: 'card', at: 20, pos: 'br', title: 'LOS QUE PIERDEN', col: '#E8394A', lines: ['Estados Unidos: casi una cuarta parte de su territorio', 'Chile: todo su norte', 'Brasil: el Acre y parte de Mato Grosso do Sul', 'Guyana y Belice: buena parte de su país', 'Y el Reino Unido, las Malvinas']}, {t: 'bubble', k: 'USA', text: '¡Pues me quedo sin California!', at: 300, dur: 260}, {t: 'bubble', k: 'CHL', text: '¿Y mi cobre?', at: 640, dur: 240}]},
	{dur: 900, cam: LCAM, fills: base(LATK), faces: fc({MEX: ['happy', 1.3], BRA: ['happy', 1.3]}), music: 'm_triumph', els: OutroEls('¿Conocías todas estas historias?')},
];
const SCALE = 1.18;
const W = makeStory({scenes: S.map((s) => ({...s, dur: Math.round(s.dur * SCALE)})), source: 'Fronteras históricas aproximadas · Escenario hipotético: no es una propuesta política', endAsk: ''});
export const Video42 = W.Video;
export const V42_TOTAL = W.TOTAL;
export const v42Sfx = W.sfx;
export const v42Music = W.music;
export const V42_START = W.START;
