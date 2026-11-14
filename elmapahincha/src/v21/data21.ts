import ELIM from './elim.json';
import F3 from '../iso3flag.json';

export const FL: Record<string, string> = {...(F3 as Record<string, string>), GIB: 'gi'};
export const NAME = (ELIM as any).names as Record<string, string>;
export const ALL = (ELIM as any).U as string[];
const RAW = (ELIM as any).rounds as Record<string, [string, string][]>;

export type Card = {k: string; title: string; line: string; bubble: string; safe?: boolean};
export type Slice = {label: string; col: string};
export const SLICES: Slice[] = [
	{label: 'GOLEADA DE 10+', col: '#E63946'},
	{label: 'SIN MUNDIAL', col: '#9B5DE5'},
	{label: 'CERO VICTORIAS', col: '#FF8A3D'},
	{label: 'SIN COPA', col: '#2EC4B6'},
	{label: 'SIN FINAL', col: '#3A86FF'},
	{label: 'SIN ESTRELLA', col: '#FFBE0B'},
	{label: 'CAMISETA AZUL', col: '#1D4ED8'},
	{label: 'FINAL PERDIDA', col: '#F15BB5'},
	{label: 'NO GANÓ EN CASA', col: '#3DB86B'},
	{label: 'CAMISETA ROJA', col: '#C1121F'},
	{label: '4 ESTRELLAS', col: '#B08968'},
	{label: 'CAMISETA AMARILLA', col: '#F4D35E'},
];
export type Round = {id: string; slice: number; cond: string; short: string; step: number; cards: Card[]};
export const ROUNDS: Round[] = [
	{id: 'BIG', slice: 0, cond: '¡HA PERDIDO POR 10 GOLES O MÁS!', short: 'GOLEADA DE 10+', step: 46, cards: [
		{k: 'ASM', title: '0-31 CONTRA AUSTRALIA', line: 'Abril de 2001: la mayor goleada de la historia del fútbol internacional', bubble: '¡Nuestro portero ni la vio!'},
		{k: 'FRA', title: '1-17 CONTRA DINAMARCA', line: 'Juegos Olímpicos de Londres 1908. Sí... la Francia de dos Mundiales', bubble: '¿¡Eso cuenta!?'},
		{k: 'ECU', title: '0-12 CONTRA ARGENTINA', line: 'Copa América de 1942, en Montevideo', bubble: '¡Argentina, no tuviste piedad!'},
		{k: 'USA', title: '0-11 CONTRA NORUEGA', line: 'Amistoso en Oslo, agosto de 1948', bubble: '¡Pero si fuimos a 12 Mundiales!'},
		{k: 'PRT', title: '0-10 CONTRA INGLATERRA', line: 'Amistoso en Lisboa, 1947. Mucho antes de Eusébio y Cristiano', bubble: '¡Cristiano no había nacido!'},
	]},
	{id: 'NEV', slice: 1, cond: '¡NUNCA HA IDO A UN MUNDIAL!', short: 'SIN MUNDIAL', step: 40, cards: [
		{k: 'BFA', title: 'A UN GOL DEL MUNDIAL 2014', line: 'Ganó 3-2 a Argelia en la ida de la repesca, perdió 1-0 en la vuelta... y fuera por los goles a domicilio', bubble: '¡Por un gol fuera de casa!'},
		{k: 'SYR', title: 'A UNA PRÓRROGA DE RUSIA 2018', line: 'Repesca asiática de 2017: 1-1 en casa y 2-1 para Australia en la prórroga', bubble: '¡Ese palo en el último minuto!'},
		{k: 'KOS', title: 'A UN PARTIDO DEL MUNDIAL 2026', line: 'Perdió 1-0 contra Turquía la final de la repesca europea', bubble: '¡La próxima vamos!'},
	]},
	{id: 'NOWIN', slice: 2, cond: '¡NUNCA HA GANADO UN PARTIDO EN UN MUNDIAL!', short: 'CERO VICTORIAS', step: 90, cards: [
		{k: 'BOL', title: '3 MUNDIALES, 0 VICTORIAS', line: '1930, 1950 y 1994: 6 partidos, 1 empate y 5 derrotas', bubble: '¡La altura no viaja con nosotros!'},
		{k: 'CHN', title: 'SU ÚNICO MUNDIAL: 2002', line: '3 partidos, 0 goles y 0 puntos', bubble: '¡Ni un gol!'},
		{k: 'QAT', title: 'ANFITRIONA SIN VICTORIAS', line: 'En su Mundial de 2022 perdió los 3 partidos. En 2026 sumó solo un empate', bubble: '¡Y eso que jugábamos en casa!'},
	]},
	{id: 'CONT', slice: 3, cond: '¡NUNCA HA GANADO LA COPA DE SU CONTINENTE!', short: 'SIN COPA', step: 90, cards: [
		{k: 'ENG', title: 'CAMPEONA DEL MUNDO... SIN EUROCOPA', line: 'Ganó el Mundial de 1966, pero perdió las finales de la Eurocopa de 2021 y 2024', bubble: '¡Pero si tenemos una estrella!'},
		{k: 'BEL', title: 'Nº1 DEL RANKING FIFA SIN TÍTULOS', line: 'Subcampeona de la Euro 1980 y tercera del Mundial 2018', bubble: '¡La generación dorada!'},
		{k: 'HRV', title: 'FINALISTA DEL MUNDIAL 2018', line: 'Y tercera en 1998 y 2022... pero nunca ha ganado la Eurocopa', bubble: '¡Modrić no se lo merece!'},
	]},
	{id: 'FINAL', slice: 4, cond: '¡NUNCA HA JUGADO UNA FINAL DEL MUNDIAL!', short: 'SIN FINAL', step: 80, cards: [
		{k: 'MEX', title: '18 MUNDIALES Y 0 FINALES', line: 'Nunca ha pasado de cuartos: 1970 y 1986, las dos en casa', bubble: '¡El quinto partido!'},
		{k: 'CHL', title: 'TERCERA EN SU MUNDIAL', line: 'Chile 1962: tercera. Y bicampeona de América en 2015 y 2016', bubble: '¡Nos faltó tan poco!'},
		{k: 'MAR', title: 'LA MEJOR DE ÁFRICA', line: 'Semifinalista en Qatar 2022... pero nunca ha jugado una final', bubble: '¡Casi, casi!'},
	]},
	{id: 'CHAMP', slice: 5, cond: '¡NUNCA HA GANADO UN MUNDIAL!', short: 'SIN ESTRELLA', step: 80, cards: [
		{k: 'NLD', title: '3 FINALES, 3 DERROTAS', line: '1974, 1978 y 2010: la mejor selección sin Mundial', bubble: '¡Otra vez no!'},
		{k: 'CZE', title: '2 FINALES COMO CHECOSLOVAQUIA', line: 'Perdió la de 1934 contra Italia y la de 1962 contra Brasil', bubble: '¡Y ganamos la Euro del 76!'},
	]},
	{id: 'AZUL', slice: 6, cond: '¡SU CAMISETA ES AZUL!', short: 'CAMISETA AZUL', step: 80, cards: [
		{k: 'ITA', title: 'LA AZZURRA', line: '¡Azul hasta en el apodo! 4 Mundiales... pero esta vez no se salva', bubble: '¡Mamma mia!'},
		{k: 'URY', title: '¿EL CELESTE CUENTA?', line: 'El celeste no es azul... ¡La Celeste se salva!', bubble: '¡Celeste, no azul!', safe: true},
		{k: 'ARG', title: '¿Y LA ALBICELESTE?', line: 'Rayas celestes y blancas: ¡tampoco es azul!', bubble: '¡Uf, por poco!', safe: true},
	]},
	{id: 'LOSTF', slice: 7, cond: '¡HA PERDIDO UNA FINAL DEL MUNDIAL!', short: 'FINAL PERDIDA', step: 80, cards: [
		{k: 'ARG', title: '4 FINALES PERDIDAS', line: '1930, 1990, 2014... y la del Mundial 2026 contra España', bubble: '¡No me lo recuerdes!'},
		{k: 'BRA', title: 'LA FINAL DE 1998', line: 'Francia le ganó 3-0 en París', bubble: '¡Zidane...!'},
		{k: 'DEU', title: '4 FINALES PERDIDAS', line: '1966, 1982, 1986 y 2002', bubble: '¡Y eso que ganamos cuatro!'},
	]},
	{id: 'HOME', slice: 8, cond: '¡NO GANÓ EL MUNDIAL QUE ORGANIZÓ!', short: 'NO GANÓ EN CASA', step: 80, cards: [
		{k: 'ESP', title: 'ANFITRIONA EN 1982', line: 'Jugó su Mundial en casa y cayó en la segunda fase', bubble: '¡Naranjito no nos ayudó!'},
		{k: 'URY', title: 'ANFITRIONA EN 1930', line: 'Organizó el primer Mundial... ¡y lo ganó! 4-2 a Argentina en la final', bubble: '¡El primero de la historia!', safe: true},
	]},
];
// eliminated keys per round in tour order with data label
export const ELIMS: Record<string, [string, string][]> = RAW;
export const LATAM = ['ARG', 'BOL', 'BRA', 'CHL', 'COL', 'CRI', 'CUB', 'ECU', 'SLV', 'GTM', 'HND', 'MEX', 'NIC', 'PAN', 'PRY', 'PER', 'DOM', 'URY', 'VEN', 'ESP'];
export const WINNER = 'URY';
