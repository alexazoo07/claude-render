import F3 from '../iso3flag.json';
import ELIM from '../v24/elim24.json';
import {makeWheel, WRound} from '../vw/WheelVideo';

const ALL = (ELIM as any).U as string[];
const NAME = (ELIM as any).names as Record<string, string>;
const FL: Record<string, string> = {...(F3 as Record<string, string>), SCT: 'gb-sct', ENG: 'gb-eng'};
const SLICES = [
	{label: 'IR A UN MUNDIAL', col: '#16A34A'},
	{label: 'GANAR EN UN MUNDIAL', col: '#2B2D35'},
	{label: 'PASAR DE GRUPOS', col: '#F4C20D'},
	{label: 'GANAR SU CONTINENTE', col: '#F47B20'},
	{label: 'LLEGAR A CUARTOS', col: '#E9E4D6'},
	{label: 'LLEGAR A SEMIS', col: '#1D4ED8'},
	{label: 'JUGAR UNA FINAL', col: '#D3202B'},
	{label: 'GANAR UN MUNDIAL', col: '#6CB4EE'},
	{label: 'GANAR FUERA', col: '#9B5DE5'},
	{label: 'GANAR LA EURO', col: '#7C3AED'},
	{label: 'GANAR 4 EUROS', col: '#F15BB5'},
	{label: 'PERDER 10-0', col: '#8C8F99'},
];
const ROUNDS: WRound[] = [
	{id: 'R1', slice: 0, cond: '¡NUNCA HABÍA IDO A UN MUNDIAL ANTES DE 2026!', short: 'DEBUTANTES', step: 80, cards: [
		{k: 'CPV', title: 'LOS TIBURONES AZULES', line: 'Su primer Mundial fue el de 2026... y llegó a dieciseisavos', bubble: '¡Y casi elimino a Argentina!'},
		{k: 'CUW', title: 'THE BLUE WAVE', line: 'El país más pequeño que ha jugado un Mundial debutó en 2026', bubble: '¡Pero si acabo de llegar!'},
		{k: 'JOR', title: 'LOS NASHAMA', line: 'Debutó en 2026, después de ser finalista de la Copa de Asia 2023', bubble: '¡Nos estrenamos y ya nos vamos!'},
		{k: 'UZB', title: 'LOS LOBOS BLANCOS', line: 'Su primer Mundial fue el de 2026', bubble: '¡Debutamos y adiós!'},
		{k: 'HTI', title: '¿Y HAITÍ?', line: 'Ya había jugado el Mundial de 1974', bubble: '¡Yo fui hace 52 años!', safe: true},
	]},
	{id: 'R2', slice: 1, cond: '¡NUNCA HA GANADO UN PARTIDO EN UN MUNDIAL!', short: 'SIN VICTORIAS', step: 80, cards: [
		{k: 'HTI', title: 'LOS GRANADEROS', line: '2 Mundiales (1974 y 2026) y 6 derrotas en 6 partidos', bubble: '¡Le marqué a Zoff en el 74!'},
		{k: 'IRQ', title: 'LOS LEONES DE MESOPOTAMIA', line: '2 Mundiales (1986 y 2026) y 6 derrotas', bubble: '¡40 años esperando para esto!'},
		{k: 'NZL', title: 'LOS ALL WHITES', line: '3 Mundiales sin ganar: 4 empates y 5 derrotas', bubble: '¡En 2010 no perdí ni uno!'},
		{k: 'PAN', title: 'LA MAREA ROJA', line: '2 Mundiales (2018 y 2026) y 6 derrotas', bubble: '¡Celebré un gol como un título!'},
		{k: 'QAT', title: 'LOS GRANATES', line: 'Perdió los 3 partidos de su Mundial, en 2022. En 2026: 1 empate y 2 derrotas', bubble: '¡Ni en casa!'},
	]},
	{id: 'R3', slice: 2, cond: '¡NUNCA HA PASADO DE LA FASE DE GRUPOS!', short: 'FUERA EN GRUPOS', step: 80, cards: [
		{k: 'IRN', title: 'TEAM MELLI', line: '7 Mundiales y siempre fuera en la primera fase', bubble: '¡Siete veces, siete!'},
		{k: 'SCT', title: 'LA TARTAN ARMY', line: '9 Mundiales y nunca ha pasado de la primera fase', bubble: '¡Esta vez tampoco!'},
		{k: 'TUN', title: 'LAS ÁGUILAS DE CARTAGO', line: '7 Mundiales y nunca ha superado la primera fase', bubble: '¡Volamos fuera!'},
		{k: 'CZE', title: 'CHEQUIA', line: 'Como República Checa ha jugado 2006 y 2026: fuera en grupos las dos veces', bubble: '¡Las finales eran de Checoslovaquia!'},
		{k: 'ZAF', title: '¿Y SUDÁFRICA?', line: 'En 2026, en su cuarto Mundial, por fin pasó de la fase de grupos', bubble: '¡A la cuarta fue la vencida!', safe: true},
	]},
	{id: 'R4', slice: 3, cond: '¡NUNCA HA GANADO SU TORNEO CONTINENTAL!', short: 'SIN TÍTULO CONTINENTAL', step: 80, cards: [
		{k: 'ENG', title: 'THE THREE LIONS', line: 'Campeona del mundo en 1966... y ni una Eurocopa: perdió las finales de 2021 y 2024', bubble: '¡It\'s not coming home!'},
		{k: 'BEL', title: 'LOS DIABLOS ROJOS', line: 'Subcampeona de la Eurocopa en 1980, pero nunca campeona', bubble: '¡Nuestra generación dorada!'},
		{k: 'HRV', title: 'LOS VATRENI', line: 'Subcampeona del mundo en 2018, pero en la Eurocopa nunca ha pasado de cuartos', bubble: '¡Ni con Modric!'},
		{k: 'TUR', title: 'LA MEDIA LUNA', line: 'Semifinalista de la Eurocopa 2008, pero nunca campeona', bubble: '¡Fui tercera en el Mundial 2002!'},
		{k: 'SWE', title: 'BLÅGULT', line: 'Semifinalista de la Eurocopa 1992, en casa, pero nunca campeona', bubble: '¡Y eso que la organicé yo!'},
		{k: 'CHE', title: 'LA NATI', line: 'En la Eurocopa nunca ha pasado de cuartos', bubble: '¡Neutrales hasta el final!'},
		{k: 'AUT', title: 'DAS TEAM', line: 'Nunca ha ganado la Eurocopa. Su mejor Mundial: tercera en 1954', bubble: '¡Ni con el Wunderteam!'},
		{k: 'NOR', title: 'LA NORUEGA DE HAALAND', line: 'Solo ha jugado una Eurocopa, la del año 2000', bubble: '¡Haaland, haz algo!'},
		{k: 'BIH', title: 'LOS DRAGONES', line: 'Nunca se ha clasificado para una Eurocopa', bubble: '¡Ni siquiera la he jugado!'},
		{k: 'ECU', title: 'LA TRI', line: 'Nunca ha ganado la Copa América: su mejor puesto es cuarta', bubble: '¡Con lo bien que iba!'},
		{k: 'CAN', title: '¿Y CANADÁ?', line: '¡Ganó la Copa Oro del año 2000!', bubble: '¡Tengo una Copa Oro!', safe: true},
	]},
	{id: 'R5', slice: 4, cond: '¡NUNCA HA LLEGADO A CUARTOS DE UN MUNDIAL!', short: 'SIN CUARTOS', step: 80, cards: [
		{k: 'AUS', title: 'LOS SOCCEROOS', line: 'Su techo son los octavos, en 2006 y 2022', bubble: '¡Desde la otra punta del mundo!'},
		{k: 'CAN', title: 'LOS CANUCKS', line: 'Su mejor Mundial fue el de 2026, en casa: octavos', bubble: '¡Otro anfitrión fuera!'},
		{k: 'CIV', title: 'LOS ELEFANTES', line: '4 Mundiales y nunca ha pasado de dieciseisavos', bubble: '¡Ni con Drogba!'},
		{k: 'COD', title: 'LOS LEOPARDOS', line: 'En 2026 cayó en dieciseisavos contra Inglaterra (2-1)', bubble: '¡Casi tumbo a Inglaterra!'},
		{k: 'DZA', title: 'LOS ZORROS DEL DESIERTO', line: 'Su techo: octavos en 2014, contra la futura campeona, Alemania', bubble: '¡Le aguanté 90 minutos!'},
		{k: 'EGY', title: 'LOS FARAONES', line: 'En 2026 pasó su primera eliminatoria... y cayó en octavos con Argentina (3-2)', bubble: '¡Ni con Salah!'},
		{k: 'JPN', title: 'SAMURAI BLUE', line: 'Ha llegado 4 veces a octavos, pero nunca a cuartos', bubble: '¡Siempre a las puertas!'},
		{k: 'SAU', title: 'LOS HALCONES VERDES', line: 'Su techo: octavos en 1994', bubble: '¡Pero le gané a Argentina!'},
		{k: 'ZAF', title: 'BAFANA BAFANA', line: 'Pasó por fin de grupos en 2026... y cayó en dieciseisavos', bubble: '¡Aaay, Bafana!'},
	]},
	{id: 'R6', slice: 5, cond: '¡NUNCA HA LLEGADO A SEMIFINALES DE UN MUNDIAL!', short: 'SIN SEMIS', step: 80, cards: [
		{k: 'COL', title: 'LOS CAFETEROS', line: 'Su techo: cuartos en 2014, con James de máximo goleador del Mundial', bubble: '¡James, haz algo!'},
		{k: 'GHA', title: 'LAS ESTRELLAS NEGRAS', line: 'Rozó las semifinales en 2010: Suárez paró un gol con la mano en el último minuto', bubble: '¡Aún me duele esa mano!'},
		{k: 'MEX', title: 'EL TRI', line: '18 Mundiales y su techo son los cuartos: 1970 y 1986, los dos en casa', bubble: '¡El maldito quinto partido!'},
		{k: 'PRY', title: 'LA ALBIRROJA', line: 'Su techo: cuartos en 2010, contra España', bubble: '¡Casillas me paró un penalti!'},
		{k: 'SEN', title: 'LOS LEONES DE LA TERANGA', line: 'Debutó en 2002 ganando a Francia, la campeona, y llegó a cuartos', bubble: '¡Le gané a la campeona!'},
	]},
	{id: 'R7', slice: 6, cond: '¡NUNCA HA JUGADO UNA FINAL DEL MUNDIAL!', short: 'SIN FINAL', step: 80, cards: [
		{k: 'KOR', title: 'LOS GUERREROS TAEGUK', line: 'Su mejor Mundial: cuarta en 2002, en casa', bubble: '¡Fui semifinalista!'},
		{k: 'MAR', title: 'LOS LEONES DEL ATLAS', line: 'En Catar 2022 fue la primera africana en llegar a semifinales', bubble: '¡Hice historia!'},
		{k: 'USA', title: 'EL ANFITRIÓN', line: 'Semifinalista en el primer Mundial, en 1930', bubble: '¡En nuestra casa no!'},
		{k: 'PRT', title: 'LA SELEÇÃO', line: 'Semifinalista en 1966 y 2006, pero nunca finalista', bubble: '¡Cristiano, haz algo!'},
	]},
	{id: 'R8', slice: 7, cond: '¡NUNCA HA GANADO UN MUNDIAL!', short: 'SIN MUNDIAL', step: 80, cards: [
		{k: 'NLD', title: 'LA ORANJE', line: 'Tres finales y tres derrotas: 1974, 1978 y 2010', bubble: '¡Tres finales y ni así!'},
	]},
	{id: 'R9', slice: 8, cond: '¡NUNCA HA GANADO UN MUNDIAL FUERA DE SU CONTINENTE!', short: 'SOLO EN CASA', step: 80, cards: [
		{k: 'FRA', title: 'LES BLEUS', line: 'Sus dos Mundiales, 1998 y 2018, los ganó en Europa', bubble: '¡Pas possible!'},
		{k: 'URY', title: 'LA CELESTE', line: 'Ganó en 1930, en casa, y en 1950, en Brasil: los dos en Sudamérica', bubble: '¡Nooo, la Celeste!'},
		{k: 'ARG', title: '¿Y ARGENTINA?', line: 'Ganó el Mundial de Catar 2022, en Asia', bubble: '¡Gracias, Messi!', safe: true},
		{k: 'BRA', title: '¿Y BRASIL?', line: 'Ganó en Suecia 1958 y en Corea y Japón 2002', bubble: '¡Gano en todas partes!', safe: true},
		{k: 'DEU', title: '¿Y ALEMANIA?', line: 'En Brasil 2014 fue la primera europea campeona en América', bubble: '¡Ach, por poco!', safe: true},
		{k: 'ESP', title: '¿Y ESPAÑA?', line: 'Ganó en Sudáfrica 2010 y en Norteamérica 2026', bubble: '¡África y América!', safe: true},
	]},
	{id: 'R10', slice: 9, cond: '¡NUNCA HA GANADO LA EUROCOPA!', short: 'SIN EURO', step: 80, cards: [
		{k: 'ARG', title: 'LA ALBICELESTE', line: '3 Mundiales y 16 Copas América... pero la Eurocopa no la puede jugar', bubble: '¡Eso es trampa!'},
		{k: 'BRA', title: 'LA PENTACAMPEONA', line: '5 Mundiales, más que nadie... pero ni una Eurocopa', bubble: '¡No me dejan jugarla!'},
	]},
	{id: 'R11', slice: 10, cond: '¡NUNCA HA GANADO 4 EUROCOPAS!', short: '4 EUROS', step: 80, cards: [
		{k: 'DEU', title: 'DIE MANNSCHAFT', line: 'Tiene 3 Eurocopas: 1972, 1980 y 1996', bubble: '¡Cuatro Mundiales y fuera!'},
		{k: 'ESP', title: 'LA CAMPEONA DEL MUNDO', line: '¡Tiene 4 Eurocopas: 1964, 2008, 2012 y 2024!', bubble: '¡Más que nadie!', safe: true},
	]},
];
const ELIMS: Record<string, [string, string][]> = {};
for (const r of ROUNDS) ELIMS[r.id] = r.cards.filter((c) => !c.safe).map((c) => [c.k, '']);

const W = makeWheel({
	ALL, NAME, FL, ROUNDS, SLICES, ELIMS, WINNER: 'ESP',
	track: {label: 'LAS DE HABLA HISPANA', keys: ['ARG', 'COL', 'ECU', 'MEX', 'PAN', 'PRY', 'URY', 'ESP']},
	hookTitle: ['TU SELECCIÓN', 'DESAPARECE', 'SI NUNCA HA...'], hookBadge: 'LAS 48 DEL MUNDIAL 2026', hookCols: 8,
	hookCards: [
		{k: 'ENG', at: 420, cond: '...GANADO SU TORNEO CONTINENTAL', card: {k: 'ENG', title: '¿LA CAMPEONA DE 1966?', line: 'Ni una Eurocopa: perdió las finales de 2021 y 2024', bubble: '¡It\'s not coming home!'}},
		{k: 'BRA', at: 820, cond: '...GANADO LA EUROCOPA', card: {k: 'BRA', title: '¿LA PENTACAMPEONA?', line: '5 Mundiales... pero ni una Eurocopa', bubble: '¡No me dejan jugarla!'}},
	],
	hookEnd: {big: '48 SELECCIONES', mid: '11 RONDAS', hint: 'Pista: no es ni Argentina, ni Brasil'},
	rules: ['La ruleta elige algo que tu selección NUNCA ha hecho', 'Si tu selección nunca lo ha hecho... ¡DESAPARECE!', 'Las 48 selecciones del Mundial 2026', '¿Aguantará la tuya? Cuéntalo en comentarios'],
	duel: ['DEU', 'ESP'], subRound: 4, midRound: 5,
	final: {t1: '¡ESPAÑA', t2: 'SOBREVIVE!', badge: 'LA ÚNICA DE 48', facts: ['Campeona del mundo en 2010 y 2026', '4 Eurocopas: nadie tiene más', 'Nunca ha perdido una final del Mundial', 'Campeona en Europa, África y América'], ask: '¿En qué ronda cayó TU selección?'},
});
export const Video34 = W.Video;
export const V34_TOTAL = W.TOTAL;
export const v34Sfx = W.sfx;
export const v34Music = W.music;
export const v34Rnds = W.RNDS; export const v34Fin = W.FIN0;
