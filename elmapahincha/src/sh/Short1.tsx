// Short 1 · ¿Y si México se desmoronara? (basado en hechos reales)
import {makeCollapse} from './Collapse';
import G from './mx.json';
import VO from './vo_el1.json';

const S = makeCollapse({
	geo: G as any, country: 'Mexico', heroFlag: 'mx', hud: 'MÉXICO RESTANTE:', start: [2120, 2080], vo: VO, voPrefix: 'vo_el1',
	title: ['¿Y SI', 'MÉXICO', 'SE DESMORONARA?'], based: 'BASADO EN HECHOS REALES', help: '¡AYUDA! ¡ME DESMORONO!', introText: "Uf… algo no va bien. ¡Siento que me estoy desmoronando!", finText: "Bueno… al menos me queda la capital. ¿Quién sigue?",
	regions: [
		{id: 'yuc', states: ['Yucatán', 'Campeche', 'Quintana Roo'], flag: 'x/yucatan', label: 'YUCATÁN', name: 'YUCATÁN', verb: 'SE INDEPENDIZA', verbCol: '#4BE07A', pill: 'REPÚBLICA DE YUCATÁN (1841-1848)', bubble: '¡ADIÓS, MÉXICO!', heroBubble: '¡NOOO!', hero: [2830, 2440], lines: [{who: 'r', text: "¡Me voy, México! Me llevo mis playas, mis cenotes y mis ruinas mayas."}, {who: 'h', text: "¡¿Qué?! ¡Yucatán, no me hagas esto!"}, {who: 'r', text: "Ya lo hice en 1841, ¿no te acuerdas?"}], pct: 93},
		{id: 'rgr', states: ['Tamaulipas', 'Nuevo León', 'Coahuila'], flag: 'x/riogrande', label: 'RÍO GRANDE', name: 'EL NORTE', verb: 'SE SEPARA', verbCol: '#FF5A4D', pill: 'REPÚBLICA DEL RÍO GRANDE (1840)', bubble: '¡NOS VAMOS!', heroBubble: '¡OTRA VEZ NO!', hero: [2150, 2060], lines: [{who: 'r', text: "¡Órale! ¡El norte también se va! ¡Viva la República del Río Grande!"}, {who: 'h', text: "¡No, no, no! ¡Otra vez no!"}], pct: 78},
		{id: 'chp', states: ['Chiapas'], flag: 'gt', label: 'CHIAPAS', name: 'CHIAPAS', verb: 'VUELVE A GUATEMALA', verbCol: '#6EC6FF', pill: 'SE UNIÓ A MÉXICO EN 1824', bubble: '¡HOLA, HERMANO!', heroBubble: '¿¡GUATEMALA!?', heroMood: 'angry', hero: [2560, 2560], joiner: {flag: 'gt', pos: [3150, 2790], bubble: '¡BIENVENIDO A CASA!'}, lines: [{who: 'r', text: "¡Yo me regreso con mi hermano Guatemala!"}, {who: 'j', text: "¡Bienvenido a casa, Chiapas! ¡Te extrañé desde 1824!"}, {who: 'h', text: "¡¿Guatemala?! ¡Eso es mío!"}], pct: 74},
		{id: 'baj', states: ['Baja California', 'Baja California Sur', 'Sonora'], flag: 'x/bajacal', label: 'BAJA Y SONORA', name: 'BAJA Y SONORA', verb: 'SE VAN', verbCol: '#FF9F2E', pill: 'REPÚBLICA DE WALKER (1853-1854)', bubble: '¡HASTA LUEGO!', heroBubble: '¡MIS PLAYAS!', hero: [1530, 1520], lines: [{who: 'r', text: "Baja California y Sonora nos vamos a la playa… para siempre."}, {who: 'h', text: "¡Mis playas! ¡Mi Cancún! Ah, no… ese ya se fue con Yucatán."}], pct: 57},
		{id: 'jal', states: ['Jalisco'], flag: 'x/jalisco', label: 'JALISCO', name: 'JALISCO', verb: 'SE DECLARA LIBRE', verbCol: '#FFD23F', pill: 'ESTADO LIBRE Y SOBERANO (1823)', bubble: '¡Y EL TEQUILA ES MÍO!', heroBubble: '¡MI TEQUILA NO!', hero: [2120, 2230], lines: [{who: 'r', text: "¡Jalisco libre y soberano! ¡Y el tequila y el mariachi se vienen conmigo!"}, {who: 'h', text: "¡Mi tequila no! ¡Sin mariachi no soy nadie!"}], pct: 53},
	],
	finale: ['¿UN NUEVO', 'MÉXICO?', '¿QUIÉN SIGUE?', 'COMENTA ABAJO ↓'],
});
export const Short1 = S.Video;
export const SH1_TOTAL = S.TOTAL;
export const sh1Sfx = S.sfx;
export const sh1Music = S.music;
