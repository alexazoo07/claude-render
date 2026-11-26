// Short 1 · ¿Y si México se desmoronara? (basado en hechos reales)
import {makeCollapse} from './Collapse';
import G from './mx.json';

const S = makeCollapse({
	geo: G as any, country: 'Mexico', heroFlag: 'mx', hud: 'MÉXICO RESTANTE:', start: [2120, 2080],
	title: ['¿Y SI', 'MÉXICO', 'SE DESMORONARA?'], based: 'BASADO EN HECHOS REALES', help: '¡AYUDA!',
	regions: [
		{id: 'yuc', states: ['Yucatán', 'Campeche', 'Quintana Roo'], flag: 'x/yucatan', label: 'YUCATÁN', name: 'YUCATÁN', verb: 'SE INDEPENDIZA', verbCol: '#4BE07A', pill: 'REPÚBLICA DE YUCATÁN (1841-1848)', bubble: '¡ADIÓS, MÉXICO!', heroBubble: '¡NO!', hero: [2830, 2440], pct: 93},
		{id: 'rgr', states: ['Tamaulipas', 'Nuevo León', 'Coahuila'], flag: 'x/riogrande', label: 'RÍO GRANDE', name: 'EL NORTE', verb: 'SE SEPARA', verbCol: '#FF5A4D', pill: 'REPÚBLICA DEL RÍO GRANDE (1840)', bubble: '¡NOS VAMOS!', heroBubble: '¡OTRA VEZ NO!', hero: [2150, 2060], pct: 78},
		{id: 'chp', states: ['Chiapas'], flag: 'gt', label: 'CHIAPAS', name: 'CHIAPAS', verb: 'VUELVE A GUATEMALA', verbCol: '#6EC6FF', pill: 'SE UNIÓ A MÉXICO EN 1824', bubble: '¡HOLA, HERMANO!', heroBubble: '¿GUATEMALA?!', heroMood: 'angry', hero: [2560, 2560], joiner: {flag: 'gt', pos: [3150, 2790], bubble: '¡BIENVENIDO!'}, pct: 74},
		{id: 'baj', states: ['Baja California', 'Baja California Sur', 'Sonora'], flag: 'x/bajacal', label: 'BAJA Y SONORA', name: 'BAJA Y SONORA', verb: 'SE VAN', verbCol: '#FF9F2E', pill: 'REPÚBLICA DE WALKER (1853-1854)', bubble: '¡HASTA LUEGO!', heroBubble: '¡MIS PLAYAS!', hero: [1530, 1520], pct: 57},
		{id: 'jal', states: ['Jalisco'], flag: 'x/jalisco', label: 'JALISCO', name: 'JALISCO', verb: 'SE DECLARA LIBRE', verbCol: '#FFD23F', pill: 'ESTADO LIBRE Y SOBERANO (1823)', bubble: '¡Y EL TEQUILA ES MÍO!', heroBubble: '¡MI TEQUILA!', hero: [2120, 2230], pct: 53},
	],
	finale: ['¿UN NUEVO', 'MÉXICO?', '¿QUIÉN SIGUE?', 'COMENTA ABAJO ↓'],
});
export const Short1 = S.Video;
export const SH1_TOTAL = S.TOTAL;
export const sh1Sfx = S.sfx;
export const sh1Music = S.music;
