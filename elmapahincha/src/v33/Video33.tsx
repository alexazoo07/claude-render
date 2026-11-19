import F3 from '../iso3flag.json';
import {makeWheel, WRound} from '../vw/WheelVideo';

const ALL = ['ARG', 'BOL', 'BRA', 'CHL', 'COL', 'CRI', 'CUB', 'DOM', 'ECU', 'SLV', 'GTM', 'HTI', 'HND', 'MEX', 'NIC', 'PAN', 'PRY', 'PER', 'URY', 'VEN'];
const NAME: Record<string, string> = {ARG: 'Argentina', BOL: 'Bolivia', BRA: 'Brasil', CHL: 'Chile', COL: 'Colombia', CRI: 'Costa Rica', CUB: 'Cuba', DOM: 'R. Dominicana', ECU: 'Ecuador', SLV: 'El Salvador', GTM: 'Guatemala', HTI: 'Haití', HND: 'Honduras', MEX: 'México', NIC: 'Nicaragua', PAN: 'Panamá', PRY: 'Paraguay', PER: 'Perú', URY: 'Uruguay', VEN: 'Venezuela'};
const SLICES = [
	{label: 'SIN MUNDIAL', col: '#16A34A'},
	{label: 'SIN VICTORIAS', col: '#2B2D35'},
	{label: 'SIN TÍTULO', col: '#F4C20D'},
	{label: 'SIN COPA AMÉRICA', col: '#F47B20'},
	{label: 'SOLO 1 COPA', col: '#E9E4D6'},
	{label: 'SIN FINAL', col: '#1D4ED8'},
	{label: 'FINAL VS ALEMANIA', col: '#D3202B'},
	{label: 'FINAL PERDIDA', col: '#6CB4EE'},
	{label: 'SIN GOLES', col: '#9B5DE5'},
	{label: 'NUNCA GANÓ A BRASIL', col: '#7C3AED'},
	{label: 'CAMISETA AZUL', col: '#F15BB5'},
	{label: 'SIN PENALTIS', col: '#8C8F99'},
];
const ROUNDS: WRound[] = [
	{id: 'R1', slice: 0, cond: '¡NUNCA HA JUGADO UN MUNDIAL!', short: 'SIN MUNDIAL', step: 80, cards: [
		{k: 'VEN', title: 'LA VINOTINTO', line: 'La única selección sudamericana que nunca ha jugado un Mundial', dato: 'Rozó el de 2026: en la última jornada perdió 3-6 con Colombia y la repesca fue para Bolivia', bubble: '¡Otra vez será!'},
		{k: 'GTM', title: 'LA BICOLOR', line: 'Nunca ha ido a un Mundial', dato: 'Pero ganó el Campeonato de la CONCACAF de 1967', bubble: '¡Tengo un título!'},
		{k: 'NIC', title: 'LA AZUL Y BLANCO', line: 'Nunca ha jugado un Mundial', dato: 'En Nicaragua el deporte rey no es el fútbol: es el béisbol', bubble: '¡Yo soy de béisbol!'},
		{k: 'DOM', title: 'LOS QUISQUEYANOS', line: 'Nunca ha ido a un Mundial', dato: 'Su mayor goleada: 17-0 a las Islas Vírgenes Británicas en 2010', bubble: '¡Pero metí diecisiete!'},
		{k: 'HTI', title: '¿Y HAITÍ?', line: 'Jugó el Mundial de 1974 y volvió en 2026, 52 años después', dato: 'Se clasificó para 2026 como primera de su grupo', bubble: '¡Por los pelos!', safe: true},
		{k: 'CUB', title: '¿Y CUBA?', line: 'Jugó el Mundial de Francia 1938', dato: 'Fue su único Mundial... y llegó a cuartos', bubble: '¡Fui en 1938!', safe: true},
	]},
	{id: 'R2', slice: 1, cond: '¡NUNCA HA GANADO UN PARTIDO EN UN MUNDIAL!', short: 'SIN VICTORIAS', step: 80, cards: [
		{k: 'BOL', title: 'LA VERDE', line: '3 Mundiales (1930, 1950 y 1994): 1 empate y 5 derrotas', dato: 'Rozó el Mundial 2026: perdió la final de la repesca contra Irak (2-1)', bubble: '¡En La Paz soy otro!'},
		{k: 'SLV', title: 'LA SELECTA', line: '2 Mundiales (1970 y 1982) y 6 derrotas en 6 partidos', dato: 'En 1982 perdió 10-1 con Hungría: la mayor goleada de la historia de los Mundiales', bubble: '¡No me lo recuerdes!'},
		{k: 'HND', title: 'LA H', line: '3 Mundiales (1982, 2010 y 2014): 3 empates y 6 derrotas', dato: 'En 1982 le empató 1-1 a España, la anfitriona, en Valencia', bubble: '¡Le empaté a España!'},
		{k: 'HTI', title: 'LOS GRANADEROS', line: '2 Mundiales (1974 y 2026) y 6 derrotas', dato: 'En 1974 se adelantó 0-1 contra Italia y rompió la imbatibilidad de Zoff', bubble: '¡Le marqué a Zoff!'},
		{k: 'PAN', title: 'LA MAREA ROJA', line: '2 Mundiales (2018 y 2026) y 6 derrotas', dato: 'Su primer gol en un Mundial lo celebró como una victoria: el 6-1 contra Inglaterra en 2018', bubble: '¡Aquel gol valió por mil!'},
		{k: 'CUB', title: '¿Y CUBA?', line: 'En 1938 le ganó 2-1 a Rumanía en el desempate', dato: 'Su único Mundial: 1 victoria, 1 empate y 1 derrota', bubble: '¡Yo sí gané uno!', safe: true},
	]},
	{id: 'R3', slice: 2, cond: '¡NUNCA HA GANADO SU TORNEO CONTINENTAL!', short: 'SIN TÍTULO', step: 80, cards: [
		{k: 'CUB', title: 'LOS LEONES DEL CARIBE', line: 'Nunca ha ganado la Copa Oro ni el Campeonato de la CONCACAF', dato: 'Sobrevivió a dos rondas gracias a 1938... pero aquí no hay escapatoria', bubble: '¡Ahora sí que me toca!'},
		{k: 'ECU', title: 'LA TRI', line: 'Nunca ha ganado la Copa América: su mejor puesto es cuarta', dato: 'Ha jugado 5 Mundiales y en 2006 llegó a octavos', bubble: '¡Con lo bien que iba!'},
		{k: 'CRI', title: '¿Y COSTA RICA?', line: '¡Tiene 3 Campeonatos de la CONCACAF: 1963, 1969 y 1989!', dato: 'Es la gran campeona centroamericana', bubble: '¡Pura vida!', safe: true},
	]},
	{id: 'R4', slice: 3, cond: '¡NUNCA HA GANADO LA COPA AMÉRICA!', short: 'SIN COPA AMÉRICA', step: 80, cards: [
		{k: 'CRI', title: 'LOS TICOS', line: 'La jugó como invitada: su mejor resultado, cuartos (2001 y 2004)', dato: 'En el Mundial 2014 ganó a Uruguay e Italia y llegó a cuartos', bubble: '¡Pero en 2014 fui a cuartos!'},
		{k: 'MEX', title: 'EL TRI', line: 'Finalista como invitada en 1993 y 2001, pero nunca campeona', dato: 'Eso sí: es la selección con más Copas Oro', bubble: '¡Dos finales y nada!'},
		{k: 'COL', title: '¿Y COLOMBIA?', line: 'Ganó la Copa América de 2001, en casa', dato: 'Fue campeona sin recibir ni un gol', bubble: '¡La de 2001 me salva!', safe: true},
	]},
	{id: 'R5', slice: 4, cond: '¡SOLO TIENE UNA COPA AMÉRICA!', short: 'SOLO 1 COPA', step: 80, cards: [
		{k: 'COL', title: 'LOS CAFETEROS', line: 'Su única Copa América es la de 2001', dato: 'Rozó la segunda en 2024: perdió la final 1-0 con Argentina en la prórroga', bubble: '¡Por una Copa!'},
		{k: 'PER', title: '¿Y PERÚ?', line: '¡Tiene dos: 1939 y 1975!', dato: 'Y fue subcampeona en 2019', bubble: '¡Dos, contadas!', safe: true},
		{k: 'PRY', title: '¿Y PARAGUAY?', line: '¡Tiene dos: 1953 y 1979!', dato: 'Y fue finalista en 2011', bubble: '¡Dos Copas!', safe: true},
		{k: 'CHL', title: '¿Y CHILE?', line: '¡Tiene dos, seguidas: 2015 y 2016!', dato: 'Las dos finales, contra Argentina y en los penaltis', bubble: '¡Bicampeona!', safe: true},
	]},
	{id: 'R6', slice: 5, cond: '¡NUNCA HA JUGADO UNA FINAL DEL MUNDIAL!', short: 'SIN FINAL', step: 80, cards: [
		{k: 'PER', title: 'LA BLANQUIRROJA', line: 'Ha jugado 5 Mundiales, pero nunca una final', dato: 'Su mejor Mundial fue el de México 70, donde llegó a cuartos', bubble: '¡Con lo bien que jugaba!'},
		{k: 'CHL', title: 'LA ROJA', line: 'Nunca ha jugado una final del Mundial', dato: 'Su mejor puesto: tercera en 1962, en su casa', bubble: '¡Fui tercera!'},
		{k: 'PRY', title: 'LA ALBIRROJA', line: 'Nunca ha jugado una final del Mundial', dato: 'Su techo: cuartos de final en Sudáfrica 2010, contra España', bubble: '¡Casillas me paró un penalti!'},
		{k: 'URY', title: '¿Y URUGUAY?', line: '¡Ganó la final del primer Mundial, en 1930!', dato: 'Y en 1950 ganó en el Maracaná: el Maracanazo', bubble: '¡Yo inventé las finales!', safe: true},
	]},
	{id: 'R7', slice: 6, cond: '¡HA PERDIDO UNA FINAL DEL MUNDIAL CONTRA ALEMANIA!', short: 'FINAL VS ALEMANIA', step: 80, cards: [
		{k: 'ARG', title: 'LA ALBICELESTE', line: 'Perdió contra Alemania las finales de 1990 y 2014', dato: 'Las dos por 1-0: Brehme de penalti en Roma y Götze en el Maracaná', bubble: '¡Pero tengo 3 Mundiales!'},
		{k: 'BRA', title: '¿Y BRASIL?', line: 'Jugó una final contra Alemania... ¡y la ganó! 2-0 en 2002', dato: 'Doblete de Ronaldo en Yokohama', bubble: '¡Ronaldo me salva!', safe: true},
	]},
	{id: 'R8', slice: 7, cond: '¡HA PERDIDO UNA FINAL DEL MUNDIAL!', short: 'FINAL PERDIDA', step: 80, cards: [
		{k: 'BRA', title: 'LA PENTACAMPEONA', line: 'Perdió la final de 1998 contra Francia (3-0)', dato: 'Tiene 5 Mundiales, más que nadie... pero aquí no basta', bubble: '¡Pero si tengo cinco!'},
		{k: 'URY', title: '¿Y URUGUAY?', line: 'Nunca ha perdido una final del Mundial', dato: 'Ganó en 1930 y en el Maracanazo de 1950', bubble: '¡Invicta en finales!', safe: true},
	]},
];
const ELIMS: Record<string, [string, string][]> = {};
for (const r of ROUNDS) ELIMS[r.id] = r.cards.filter((c) => !c.safe).map((c) => [c.k, '']);

const W = makeWheel({
	ALL, NAME, FL: F3 as Record<string, string>, ROUNDS, SLICES, ELIMS, WINNER: 'URY',
	track: {label: 'LATINOAMÉRICA', keys: ALL},
	hookTitle: ['ELIMINANDO', 'SELECCIONES', 'DE LATINOAMÉRICA...'], hookBadge: 'HASTA QUE QUEDE SOLO 1', hookCols: 5,
	hookCards: [
		{k: 'VEN', at: 420, cond: '...NUNCA HA JUGADO UN MUNDIAL', card: {k: 'VEN', title: 'LA VINOTINTO', line: 'La única de Sudamérica que nunca ha jugado un Mundial', bubble: '¡Otra vez será!'}},
		{k: 'BRA', at: 820, cond: '...HA PERDIDO UNA FINAL DEL MUNDIAL', card: {k: 'BRA', title: '¿LA PENTACAMPEONA?', line: 'Perdió la final de 1998 contra Francia (3-0)', bubble: '¡Pero si tengo cinco!'}},
	],
	hookEnd: {big: '20 SELECCIONES', mid: '8 RONDAS', hint: 'Pista: no es ni Argentina, ni Brasil, ni México'},
	rules: ['La ruleta elige una condición', 'Si tu selección la cumple... ¡DESAPARECE!', 'Las 20 selecciones de Latinoamérica', '¿Aguantará la tuya? Cuéntalo en comentarios'],
	duel: ['BRA', 'URY'], subRound: 3, midRound: 4,
	final: {t1: '¡URUGUAY', t2: 'SOBREVIVE!', badge: 'LA ÚLTIMA DE 20', facts: ['Ganó los Mundiales de 1930 y 1950', 'Tiene 15 Copas América', 'Nunca ha perdido una final del Mundial', 'Con solo 3,4 millones de habitantes'], ask: '¿En qué ronda cayó TU selección?'},
	timing: {CARD: 760, C_BUB: 380, C_STAMP: 560, C_DATO: 210},
});
export const Video33 = W.Video;
export const V33_TOTAL = W.TOTAL;
export const v33Sfx = W.sfx;
export const v33Music = W.music;
export const v33Rnds = W.RNDS; export const v33Fin = W.FIN0;
