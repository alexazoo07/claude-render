// Short 1 · ¿Y si México se desmoronara? (basado en hechos reales)
import {makeCollapse} from './Collapse';
import G from './mx.json';
import VO from './vo_el1.json';

const S = makeCollapse({
	geo: G as any, country: 'Mexico', heroFlag: 'mx', hud: 'MÉXICO RESTANTE:', start: [2120, 2080], vo: VO as any, voPrefix: 'vo_el1',
	hook: {type: 'title', title: ['¿Y SI', 'MÉXICO', 'SE DESMORONARA?'], based: 'BASADO EN HECHOS REALES'}, intro: {who: 'h', text: "Uf… algo no va bien. ¡Siento que me estoy desmoronando!", icons: [{e: '😰', w: 'uf'}, {e: '💔', w: 'desmoronando'}]}, fin: {who: 'h', text: "Bueno… al menos me queda la capital. ¿Quién sigue?", icons: [{e: '🏙️', w: 'capital'}, {e: '❓', w: 'quien'}]},
	regions: [
		{id: 'yuc', states: ['Yucatán', 'Campeche', 'Quintana Roo'], flag: 'x/yucatan', label: 'YUCATÁN', name: 'YUCATÁN', verb: 'SE INDEPENDIZA', verbCol: '#4BE07A', pill: 'REPÚBLICA DE YUCATÁN (1841-1848)', hero: [2830, 2440], lines: [{who: 'r', text: "¡Me voy, México! Me llevo mis playas, mis cenotes y mis ruinas mayas.", icons: [{e: '🏖️', w: 'playas', to: 'r'}, {e: '🌊', w: 'cenotes', to: 'r'}, {e: '🏛️', w: 'ruinas', to: 'r'}]}, {who: 'h', text: "¡¿Qué?! ¡Yucatán, no me hagas esto!", icons: [{e: '😱', w: 'que', fx: 'big'}]}, {who: 'r', text: "Ya lo hice en 1841, ¿no te acuerdas?", icons: [{e: '📅', w: '1841'}]}], pct: 93},
		{id: 'rgr', states: ['Tamaulipas', 'Nuevo León', 'Coahuila'], flag: 'x/riogrande', label: 'RÍO GRANDE', name: 'EL NORTE', verb: 'SE SEPARA', verbCol: '#FF5A4D', pill: 'REPÚBLICA DEL RÍO GRANDE (1840)', hero: [2150, 2060], lines: [{who: 'r', text: "¡Órale! ¡El norte también se va! ¡Viva la República del Río Grande!", icons: [{e: '🤠', w: 'orale'}, {e: '🎉', w: 'viva'}]}, {who: 'h', text: "¡No, no, no! ¡Otra vez no!", icons: [{e: '💧', fx: 'rain', n: 12}]}], pct: 78},
		{id: 'chp', states: ['Chiapas'], flag: 'gt', label: 'CHIAPAS', name: 'CHIAPAS', verb: 'VUELVE A GUATEMALA', verbCol: '#6EC6FF', pill: 'SE UNIÓ A MÉXICO EN 1824', heroMood: 'angry', hero: [2560, 2560], joiner: {flag: 'gt', pos: [3150, 2790]}, lines: [{who: 'r', text: "¡Yo me regreso con mi hermano Guatemala!", icons: [{e: '🤝', w: 'hermano'}]}, {who: 'j', text: "¡Bienvenido a casa, Chiapas! ¡Te extrañé desde 1824!", icons: [{e: '🏠', w: 'casa'}, {e: '❤️', w: 'extrane'}]}, {who: 'h', text: "¡¿Guatemala?! ¡Eso es mío!", icons: [{e: '😡', w: 'guatemala', fx: 'big'}]}], pct: 74},
		{id: 'baj', states: ['Baja California', 'Baja California Sur', 'Sonora'], flag: 'x/bajacal', label: 'BAJA Y SONORA', name: 'BAJA Y SONORA', verb: 'SE VAN', verbCol: '#FF9F2E', pill: 'REPÚBLICA DE WALKER (1853-1854)', hero: [1530, 1520], lines: [{who: 'r', text: "Baja California y Sonora nos vamos a la playa… para siempre.", icons: [{e: '🌵', w: 'sonora'}, {e: '🏄', w: 'playa'}, {e: '😎', w: 'siempre'}]}, {who: 'h', text: "¡Mis playas! ¡Mi Cancún! Ah, no… ese ya se fue con Yucatán.", icons: [{e: '🏝️', w: 'cancun'}, {e: '🤦', w: 'ah'}]}], pct: 57},
		{id: 'jal', states: ['Jalisco'], flag: 'x/jalisco', label: 'JALISCO', name: 'JALISCO', verb: 'SE DECLARA LIBRE', verbCol: '#FFD23F', pill: 'ESTADO LIBRE Y SOBERANO (1823)', hero: [2120, 2230], lines: [{who: 'r', text: "¡Jalisco libre y soberano! ¡Y el tequila y el mariachi se vienen conmigo!", icons: [{e: '🥃', w: 'tequila', to: 'r'}, {e: '🎺', w: 'mariachi', to: 'r'}]}, {who: 'h', text: "¡Mi tequila no! ¡Sin mariachi no soy nadie!", icons: [{e: '💧', fx: 'rain', n: 12}, {e: '💔', w: 'nadie', fx: 'big'}]}], pct: 53},
	],
	finale: ['¿UN NUEVO', 'MÉXICO?', '¿QUIÉN SIGUE?', 'COMENTA ABAJO ↓'],
});
export const Short1 = S.Video;
export const SH1_TOTAL = S.TOTAL;
export const sh1Sfx = S.sfx;
export const sh1Music = S.music;
export const SX = S;
