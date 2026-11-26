// V36 · Tu país desaparece si su BANDERA tiene… ¿Cuál sobrevive? (195 países)
import F3 from '../iso3flag.json';
import D from './data36.json';
import {makeWheel, WRound} from '../vw/WheelVideo';

const ALL = D.ALL as string[];
const NAME = D.NAME as Record<string, string>;
const FL: Record<string, string> = {...(F3 as Record<string, string>), ENG: 'gb', SCT: 'gb', WLS: 'gb', NIR: 'gb'};
const ROUNDS: WRound[] = (D.ROUNDS as any[]).map(({elim, ...r}) => r as WRound);
const ELIMS: Record<string, [string, string][]> = Object.fromEntries((D.ROUNDS as any[]).map((r) => [r.id, r.elim as [string, string][]]));
const HISP = ['ARG', 'BOL', 'CHL', 'COL', 'CRI', 'CUB', 'DOM', 'ECU', 'SLV', 'GTM', 'HND', 'MEX', 'NIC', 'PAN', 'PRY', 'PER', 'ESP', 'URY', 'VEN', 'GNQ'];
const HOOK_K = ['MEX', 'USA', 'CAN', 'BRA', 'ARG', 'COL', 'PER', 'CHL', 'URY', 'ECU', 'VEN', 'BOL', 'ESP', 'FRA', 'ITA', 'DEU', 'ENG', 'PRT', 'RUS', 'CHN', 'JPN', 'IND', 'AUS', 'EGY', 'MAR', 'ZAF', 'SAU', 'TUR', 'KOR', 'NGA', 'CUB', 'PRY'];

const W = makeWheel({
	ALL, NAME, FL, ROUNDS, SLICES: D.SLICES, ELIMS, WINNER: 'COL',
	link: {ENG: ['SCT', 'WLS', 'NIR']},
	hookKeys: HOOK_K, ifText: 'SI TU PAÍS...',
	track: {label: 'LOS DE HABLA HISPANA', keys: HISP},
	hookTitle: ['TU PAÍS', 'DESAPARECE', 'SI SU BANDERA TIENE...'], hookBadge: 'LOS 195 PAÍSES DEL MUNDO', hookCols: 8,
	hookCards: [
		{k: 'ESP', at: 420, cond: '...UN ANIMAL', card: {k: 'ESP', title: '¿ESPAÑA? ¡HAY UN LEÓN!', line: 'En su escudo está el león del antiguo Reino de León', bubble: '¡Pero si casi no se ve!'}},
		{k: 'BRA', at: 820, cond: '...UNA ESTRELLA', card: {k: 'BRA', title: '27 ESTRELLAS', line: 'Una por cada estado más el Distrito Federal', bubble: '¡Mi cielo entero, fuera!'}},
	],
	hookEnd: {big: '195 PAÍSES', mid: '12 RONDAS', hint: 'Pista: es de Sudamérica y su bandera es muy simple'},
	rules: ['La ruleta elige algo que puede tener una bandera', 'Si la bandera de tu país lo tiene... ¡DESAPARECE!', 'Los 195 países: ONU, Vaticano y Palestina', 'Usamos la bandera oficial que ves en el mapa'],
	duel: ['ARM', 'COL'], subRound: 3, midRound: 5,
	final: {t1: '¡COLOMBIA', t2: 'SOBREVIVE!', badge: 'LA ÚNICA DE 195', facts: ['Amarillo, azul y rojo: solo tres franjas', 'Sin escudo, ni estrellas, ni sol', 'El amarillo ocupa la mitad de la bandera', 'Sobrevivió a las 12 rondas'], ask: '¿En qué ronda cayó TU país?'},
});
export const Video36 = W.Video;
export const V36_TOTAL = W.TOTAL;
export const v36Sfx = W.sfx;
export const v36Music = W.music;
export const v36Rnds = W.RNDS; export const v36Fin = W.FIN0;
