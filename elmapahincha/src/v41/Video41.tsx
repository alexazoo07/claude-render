// V41 · Si el mar subiera sin parar, ¿qué país latinoamericano sobrevive? (relieve real)
import {makeStory, Scene, OutroEls, FL, El} from '../vs/Story';
import type {Fill, FaceSpec} from '../v12/Atlas';
import P from './peaks.json';

const LAT = ['MEX', 'GTM', 'SLV', 'HND', 'NIC', 'CRI', 'PAN', 'CUB', 'HTI', 'DOM', 'COL', 'VEN', 'ECU', 'PER', 'BOL', 'BRA', 'PRY', 'CHL', 'ARG', 'URY'];
const NAME: Record<string, string> = {ARG: 'ARGENTINA', BOL: 'BOLIVIA', BRA: 'BRASIL', CHL: 'CHILE', COL: 'COLOMBIA', CRI: 'COSTA RICA', CUB: 'CUBA', DOM: 'R. DOMINICANA', ECU: 'ECUADOR', SLV: 'EL SALVADOR', GTM: 'GUATEMALA', HTI: 'HAITÍ', HND: 'HONDURAS', MEX: 'MÉXICO', NIC: 'NICARAGUA', PAN: 'PANAMÁ', PRY: 'PARAGUAY', PER: 'PERÚ', URY: 'URUGUAY', VEN: 'VENEZUELA'};
const PEAK: Record<string, [string, number]> = {URY: ['Cerro Catedral', 514], PRY: ['Cerro Tres Kandú', 842], CUB: ['Pico Turquino', 1974], NIC: ['Cerro Mogotón', 2107], HTI: ['Pic la Selle', 2680], SLV: ['Cerro El Pital', 2730], HND: ['Cerro Las Minas', 2870], BRA: ['Pico da Neblina', 2995], DOM: ['Pico Duarte', 3098], PAN: ['Volcán Barú', 3474], CRI: ['Cerro Chirripó', 3821], GTM: ['Volcán Tajumulco', 4220], VEN: ['Pico Bolívar', 4978], MEX: ['Pico de Orizaba', 5636], COL: ['Pico Cristóbal Colón', 5730], ECU: ['Chimborazo', 6263], BOL: ['Nevado Sajama', 6542], PER: ['Huascarán', 6768], CHL: ['Ojos del Salado', 6893], ARG: ['Aconcagua', 6961]};
const ORDER = Object.keys(PEAK);
const f = (k: string) => FL[k];
const LCAM = ['MEX', 'BRA', 'ARG', 'CUB', 'CHL'];
const fillsAt = (gone: string[], hl: string[] = []): Record<string, Fill> => Object.fromEntries(LAT.map((k) => [k, gone.includes(k) ? {color: '#6F7A88'} : {flag: f(k), lift: hl.includes(k) ? 0.8 : 0.25}]));
const facesAt = (gone: string[], mood: FaceSpec['mood'] = 'worried', hl: Record<string, FaceSpec['mood']> = {}): Record<string, FaceSpec> => Object.fromEntries(LAT.filter((k) => !gone.includes(k) || hl[k]).map((k) => [k, {mood: hl[k] ?? mood, size: hl[k] ? 1.6 : 0.9, max: hl[k] ? 150 : 70}]));
const fmt = (n: number) => n.toLocaleString('es-ES').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

// elimination scene: water rises from h0 to the peak, then the country sinks
const elim = (ks: string[], h0: number, opts: {cam?: string[]; lines?: string[]; title?: string; dur?: number; bubble?: string; music?: string} = {}): Scene => {
	const gone = ORDER.slice(0, ORDER.indexOf(ks[0]));
	const top = PEAK[ks[ks.length - 1]][1];
	const dur = opts.dur ?? 1200 + (ks.length - 1) * 300;
	const rise = 380 + (ks.length - 1) * 200;
	const els: El[] = [];
	if (opts.title) els.push({t: 'title', text: opts.title, at: 10, size: 74});
	ks.forEach((k, i) => {
		const at = Math.round(40 + ((PEAK[k][1] - h0) / Math.max(1, top - h0)) * (rise - 40));
		els.push({t: 'stamp', text: `¡${NAME[k]} SE HUNDE!`, at: at + 10, y: 230 + i * 130, x: 1250});
	});
	els.push({t: 'card', at: rise + 60, pos: 'br', title: ks.map((k) => `${NAME[k]}: ${fmt(PEAK[k][1])} m`).join(' · '), tag: 'SU PUNTO MÁS ALTO', lines: [...ks.map((k) => `${PEAK[k][0]} (${fmt(PEAK[k][1])} m)`), ...(opts.lines ?? [])], col: '#1D6FD8'});
	if (opts.bubble) els.push({t: 'bubble', k: ks[0], text: opts.bubble, at: 60, dur: 220});
	const hl = Object.fromEntries(ks.map((k) => [k, 'panic' as FaceSpec['mood']]));
	return {dur, cam: opts.cam ?? LCAM, level: [h0, top + 2, 30, rise], fills: fillsAt(gone, ks), faces: facesAt(gone, 'scared', hl), label: `QUEDAN ${LAT.length - gone.length}`, music: opts.music, els, sfx: [[20, 'riser', 0.25], ...ks.map((k): [number, string, number] => [Math.round(40 + ((PEAK[k][1] - h0) / Math.max(1, top - h0)) * (rise - 40)) + 10, 'drop', 0.5])]};
};
// post-elimination fills: after a scene the sunk countries go grey (scene fills computed from ORDER)
const S: Scene[] = [
	// ---------------- HOOK
	{dur: 1100, cam: LCAM, level: [0, 260, 200, 1000], fills: fillsAt([]), faces: facesAt([], 'panic'), music: 'm_tense', sfx: [[200, 'riser', 0.3]],
		els: [{t: 'title', text: 'SI EL MAR SUBIERA SIN PARAR...', hl: 'SIN PARAR', at: 10, size: 84}, {t: 'title', text: '¿QUÉ PAÍS LATINOAMERICANO SOBREVIVE?', hl: 'SOBREVIVE', at: 120, y: 900, size: 70}, {t: 'bubble', k: 'BRA', text: '¡Que alguien pare esto!', at: 520, dur: 260}]},
	{dur: 900, cam: LCAM, level: [0, 0, 0, 1], fills: fillsAt([]), faces: facesAt([], 'worried'), label: 'LAS REGLAS', music: 'm_happy',
		els: [{t: 'card', at: 20, pos: 'br', title: 'CÓMO FUNCIONA', tag: 'REGLAS', col: '#3DB86B', lines: ['El mar sube metro a metro', 'Usamos el relieve real de cada país', 'Un país se hunde cuando el agua cubre su punto más alto', 'El último en pie... ¡sobrevive!']}]},
	{dur: 1200, cam: ['URY', 'ARG', 'PRY', 'BRA'], level: [0, 20, 60, 900], fills: fillsAt([], ['URY', 'ARG']), faces: facesAt([], 'worried', {ARG: 'worried', URY: 'scared'}), label: 'EMPIEZA',
		els: [{t: 'title', text: '+20 METROS', hl: '20', at: 10}, {t: 'card', at: 300, pos: 'br', title: 'PRIMERAS VÍCTIMAS: LAS COSTAS', lines: ['Las zonas más bajas de la costa y los deltas', 'El Río de la Plata y el delta del Paraná', 'El norte de Brasil, junto a la desembocadura del Amazonas'], col: '#1D6FD8'}]},
	{dur: 1300, cam: LCAM, level: [20, 70, 40, 700], fills: fillsAt([]), faces: facesAt([], 'scared'), label: 'EL LÍMITE REAL',
		els: [{t: 'big', n: 70, pre: '+', suf: ' m', cap: 'Lo que subiría el mar si se derritiera TODO el hielo del planeta (aprox.)', at: 30, x: 1350, y: 240}, {t: 'card', at: 520, pos: 'br', title: 'A PARTIR DE AQUÍ...', tag: 'AVISO', lines: ['...todo es imaginario', 'Pero así vemos qué país tiene el relieve más alto'], col: '#E8394A'}]},
	{dur: 1500, cam: ['COL', 'BRA', 'PER', 'VEN'], level: [70, 200, 30, 900], fills: fillsAt([], ['BRA']), faces: facesAt([], 'panic', {BRA: 'panic', COL: 'scared'}), label: 'LA AMAZONÍA', music: 'm_tense',
		els: [{t: 'title', text: 'LA AMAZONÍA SE CONVIERTE EN UN MAR', hl: 'UN MAR', at: 10, size: 74}, {t: 'card', at: 700, pos: 'br', title: 'CON +200 METROS', tag: 'SEGÚN NUESTRO RELIEVE', lines: ['Más de la mitad de Venezuela y de Colombia, bajo el agua', 'Casi todo Uruguay y casi toda Cuba', 'Brasil pierde más de un tercio'], col: '#1D6FD8'}, {t: 'bubble', k: 'BRA', text: '¡Mi selva!', at: 300, dur: 220}]},
	elim(['URY'], 200, {cam: ['URY', 'ARG', 'BRA', 'PRY'], bubble: '¡Soy demasiado plano!', lines: ['El primero en desaparecer']}),
	elim(['PRY'], 514, {cam: ['URY', 'ARG', 'BRA', 'PRY'], lines: ['Sin mar... ¡y ahora todo es mar!']}),
	{dur: 1200, cam: LCAM, level: [842, 1000, 30, 500], fills: fillsAt(['URY', 'PRY']), faces: facesAt(['URY', 'PRY'], 'scared'), label: 'QUEDAN 18',
		els: [{t: 'title', text: '+1.000 m: ADIÓS A MUCHAS CAPITALES', hl: 'CAPITALES', at: 10, size: 72}, {t: 'chips', at: 200, y: 800, step: 30, items: [{flag: f('ARG'), text: 'Buenos Aires'}, {flag: f('PER'), text: 'Lima'}, {flag: f('CHL'), text: 'Santiago', sub: 'unos 570 m'}, {flag: f('VEN'), text: 'Caracas', sub: 'unos 900 m'}, {flag: f('BRA'), text: 'Río de Janeiro'}]}, {t: 'sub', f: 640}]},
	elim(['CUB'], 1000, {cam: ['CUB', 'HTI', 'DOM', 'MEX'], bubble: '¡Se acabó la isla!'}),
	elim(['NIC'], 1974, {cam: ['NIC', 'HND', 'CRI', 'SLV']}),
	{dur: 1100, cam: ['MEX', 'GTM', 'COL'], level: [2107, 2240, 30, 500], fills: fillsAt(['URY', 'PRY', 'CUB', 'NIC'], ['MEX']), faces: facesAt(['URY', 'PRY', 'CUB', 'NIC'], 'scared', {MEX: 'shock'}), label: 'QUEDAN 16',
		els: [{t: 'title', text: '+2.240 m: CIUDAD DE MÉXICO, BAJO EL AGUA', hl: 'CIUDAD DE MÉXICO', at: 10, size: 68}, {t: 'card', at: 300, pos: 'br', title: 'PERO MÉXICO AGUANTA', lines: ['Sus volcanes siguen fuera del agua', 'El Pico de Orizaba mide 5.636 m'], col: '#3DB86B'}, {t: 'bubble', k: 'MEX', text: '¡Aún tengo volcanes!', at: 600, dur: 240}]},
	elim(['HTI', 'SLV'], 2240, {cam: ['HTI', 'SLV', 'HND', 'DOM']}),
	elim(['HND'], 2730, {cam: ['HND', 'GTM', 'NIC']}),
	elim(['BRA'], 2870, {cam: ['BRA', 'VEN', 'COL'], dur: 1400, title: '¡CAE EL GIGANTE!', bubble: '¡Si soy enorme!', lines: ['El país más grande de Latinoamérica... y de los más bajos']}),
	elim(['DOM'], 2995, {cam: ['DOM', 'HTI', 'CUB']}),
	elim(['PAN', 'CRI'], 3098, {cam: ['PAN', 'CRI', 'NIC', 'COL'], lines: ['Y con +3.640 m, La Paz, la capital más alta, también cae']}),
	elim(['GTM'], 3821, {cam: ['GTM', 'MEX', 'HND'], lines: ['La montaña más alta de Centroamérica']}),
	elim(['VEN'], 4220, {cam: ['VEN', 'COL'], bubble: '¡Mi Salto Ángel ya no se ve!'}),
	elim(['MEX', 'COL'], 4978, {cam: ['MEX', 'COL', 'GTM'], music: 'm_tense', title: '¡CAEN DOS GIGANTES!'}),
	elim(['ECU'], 5730, {cam: ['ECU', 'PER', 'COL'], lines: ['Su cima es el punto más alejado del centro de la Tierra... pero no el más alto sobre el mar']}),
	elim(['BOL'], 6263, {cam: ['BOL', 'PER', 'CHL']}),
	elim(['PER'], 6542, {cam: ['PER', 'BOL', 'CHL'], bubble: '¡Mi Huascarán!'}),
	{dur: 1300, cam: ['CHL', 'ARG'], level: [6768, 6780, 0, 100], fills: fillsAt(ORDER.slice(0, ORDER.indexOf('CHL')), ['CHL', 'ARG']), faces: {CHL: {mood: 'angry', size: 1.6, max: 160}, ARG: {mood: 'angry', size: 1.6, max: 160}}, label: 'DUELO FINAL', music: 'm_tense', sfx: [[600, 'drumroll', 0.4]],
		els: [{t: 'vs', at: 10, a: {flag: f('CHL'), label: 'CHILE', sub: 'Ojos del Salado: 6.893 m'}, b: {flag: f('ARG'), label: 'ARGENTINA', sub: 'Aconcagua: 6.961 m'}}, {t: 'title', text: '¡SOLO 68 METROS DE DIFERENCIA!', hl: '68 METROS', at: 400, y: 860, size: 70}]},
	elim(['CHL'], 6780, {cam: ['CHL', 'ARG'], bubble: '¡Por 68 metros!', lines: ['El volcán más alto del mundo, en la frontera con Argentina']}),
	{dur: 1400, cam: ['ARG', 'CHL'], level: [6893, 6955, 0, 600], fills: {...fillsAt(ORDER.slice(0, -1)), ARG: {flag: f('ARG'), lift: 1}}, faces: {ARG: {mood: 'love', size: 2, max: 200}}, label: 'EL ÚLTIMO EN PIE', music: 'm_triumph', sfx: [[60, 'crowd_roar', 0.35]],
		els: [{t: 'title', text: '¡ARGENTINA SOBREVIVE!', hl: 'ARGENTINA', at: 30, size: 92}, {t: 'confetti', at: 40}, {t: 'card', at: 240, pos: 'br', title: 'GRACIAS AL ACONCAGUA', tag: '6.961 m', lines: ['La montaña más alta de América', 'Y la más alta del mundo fuera de Asia', 'Con +6.955 m, solo asoma su cumbre'], col: '#F4C20D'}, {t: 'bubble', k: 'ARG', text: '¡El último en pie!', at: 500, dur: 300}]},
	{dur: 1200, cam: LCAM, fills: fillsAt([]), faces: facesAt([], 'happy'), label: 'CLASIFICACIÓN', music: 'm_happy',
		els: [{t: 'rank', at: 20, title: 'LOS ÚLTIMOS EN HUNDIRSE', unit: 'punto más alto (m)', rows: [{k: 'ARG', label: 'Argentina', v: 6961, hl: true}, {k: 'CHL', label: 'Chile', v: 6893}, {k: 'PER', label: 'Perú', v: 6768}, {k: 'BOL', label: 'Bolivia', v: 6542}, {k: 'ECU', label: 'Ecuador', v: 6263}, {k: 'COL', label: 'Colombia', v: 5730}, {k: 'MEX', label: 'México', v: 5636}, {k: 'URY', label: 'Uruguay (el 1º en caer)', v: 514}]}]},
	{dur: 900, cam: LCAM, fills: fillsAt([]), faces: facesAt([], 'happy'), music: 'm_triumph', els: OutroEls('¿En qué puesto cayó tu país?')},
];
const SCALE = 1.0;
const W = makeStory({scenes: S.map((s) => ({...s, dur: Math.round(s.dur * SCALE)})), source: 'Relieve: Terrarium (AWS Terrain Tiles) · Puntos más altos: datos oficiales · Escenario imaginario', endAsk: '', flood: {layers: [{href: 'tex/elev_world.png', box: {x: 0, y: 20, w: 3830, h: 1720}}, {href: 'tex/elev_latam.png', box: P.box}], max: 7000}});
export const Video41 = W.Video;
export const V41_TOTAL = W.TOTAL;
export const v41Sfx = W.sfx;
export const v41Music = W.music;
export const V41_START = W.START;
