import F3 from '../iso3flag.json';
import ELIM from '../v24/elim24.json';
import {makeWheel, WRound} from '../vw/WheelVideo';

const ALL = (ELIM as any).U as string[];
const NAME = (ELIM as any).names as Record<string, string>;
const FL: Record<string, string> = {...(F3 as Record<string, string>), SCT: 'gb-sct', ENG: 'gb-eng'};
const SLICES = [
	{label: 'UN ANIMAL', col: '#16A34A'},
	{label: 'UN COLOR', col: '#D3202B'},
	{label: 'UN NÚMERO', col: '#F4C20D'},
	{label: 'UNA PERSONA', col: '#F47B20'},
	{label: 'UN ASTRO', col: '#2B2D35'},
	{label: 'UN SER MÍTICO', col: '#7C3AED'},
	{label: 'UNA BEBIDA', col: '#8B5A2B'},
	{label: 'FUEGO', col: '#FF6B1A'},
	{label: 'UN ESCUDO', col: '#1D4ED8'},
	{label: 'ABREVIATURA', col: '#E9E4D6'},
	{label: 'INGLÉS', col: '#6CB4EE'},
	{label: '«SELECCIÓN»', col: '#F15BB5'},
];
const C = (k: string, title: string, line: string, bubble: string, safe = false) => ({k, title, line, bubble, ...(safe ? {safe: true} : {})});
const ROUNDS: WRound[] = [
	{id: 'R1', slice: 0, cond: '¡SU APODO TIENE UN ANIMAL!', short: 'ANIMAL', step: 80, cards: [
		C('ENG', 'THE THREE LIONS', 'Los tres leones del escudo de Inglaterra', '¡It\'s not coming home!'),
		C('BRA', 'LA CANARINHA', 'El «canarito», por su camiseta amarilla', '¡La pentacampeona, fuera!'),
		C('MAR', 'LOS LEONES DEL ATLAS', 'Por el león del Atlas y la cordillera del Atlas', '¡Semifinalista en 2022!'),
		C('SEN', 'LOS LEONES DE LA TERANGA', 'El león, símbolo de Senegal. Teranga significa hospitalidad', '¡Rugimos... y desaparecemos!'),
		C('IRQ', 'LOS LEONES DE MESOPOTAMIA', 'El león y la tierra entre los ríos Tigris y Éufrates', '¡Demasiados leones!'),
		C('CIV', 'LOS ELEFANTES', 'El elefante, símbolo de Costa de Marfil', '¡Ni con trompa!'),
		C('COD', 'LOS LEOPARDOS', 'El leopardo aparece en el escudo del país', '¡Nos pillaron!'),
		C('CPV', 'LOS TIBURONES AZULES', 'Tiburones, por el océano que rodea las islas', '¡Y además tengo color!'),
		C('DZA', 'LOS ZORROS DEL DESIERTO', 'Les Fennecs: el zorro del desierto del Sáhara', '¡Ni el desierto nos salva!'),
		C('SAU', 'LOS HALCONES VERDES', 'El halcón, muy querido en Arabia, y el verde de su bandera', '¡Volamos fuera!'),
		C('TUN', 'LAS ÁGUILAS DE CARTAGO', 'Las águilas de la antigua Cartago', '¡Águilas abatidas!'),
		C('UZB', 'LOS LOBOS BLANCOS', 'Así llaman a la selección uzbeka', '¡Auuu!'),
		C('AUS', '¿SOCCEROOS?', 'Soccer + kangaroos: ¡fútbol y canguros!', '¡El canguro estaba escondido!'),
	]},
	{id: 'R2', slice: 1, cond: '¡SU APODO TIENE UN COLOR!', short: 'COLOR', step: 80, cards: [
		C('ESP', 'LA ROJA', 'La campeona del mundo lleva el color en el apodo', '¡Pero si soy campeona!'),
		C('ARG', 'LA ALBICELESTE', 'Blanca y celeste: dos colores en una palabra', '¡Dos colores, el doble de mala suerte!'),
		C('FRA', 'LES BLEUS', '«Los azules», por su camiseta', '¡Pas possible!'),
		C('URY', 'LA CELESTE', 'El celeste de su camiseta desde 1910', '¡Nooo, la Celeste!'),
		C('NLD', 'ORANJE', 'El naranja de la Casa de Orange', '¡Tres finales y ni así!'),
		C('BEL', 'LOS DIABLOS ROJOS', 'Diablos... y rojos', '¡Los diablos, al infierno!'),
		C('PRY', 'LA ALBIRROJA', 'Blanca y roja, como sus rayas', '¡Las rayas no me salvan!'),
		C('JPN', 'SAMURAI BLUE', 'Samuráis... de azul', '¡Nuestro azul es tradición!'),
		C('GHA', 'LAS ESTRELLAS NEGRAS', 'Por la estrella negra de su bandera', '¡Estrellas negras, fuera!'),
		C('NZL', 'LOS ALL WHITES', '«Todos blancos», en contraste con los All Blacks del rugby', '¡Ni siquiera vestimos de blanco!'),
		C('CAN', 'LES ROUGES', '«Los rojos», en francés', '¡Otro anfitrión fuera!'),
		C('PAN', 'LA MAREA ROJA', 'Por su camiseta y su afición', '¡La marea se retira!'),
		C('QAT', 'AL-ANNABI', '«Los granates», en árabe', '¡El granate también es color!'),
		C('SWE', 'BLÅGULT', '«Azul y amarillo», en sueco', '¡Dos colores en una palabra!'),
		C('CUW', 'LA OLA AZUL', 'The Blue Wave: azul, como el Caribe', '¡Semper blou!'),
		C('MEX', '¿Y EL TRI?', 'Viene de «tricolor»... pero no dice ningún color', '¡Uf, por los pelos!', true),
	]},
	{id: 'R3', slice: 2, cond: '¡SU APODO TIENE UN NÚMERO!', short: 'NÚMERO', step: 80, cards: [
		C('MEX', 'EL TRI', '«Tri», de tres: los tres colores de su bandera', '¡Me salvé del color para esto!'),
		C('ECU', 'LA TRI', 'También «Tri»: tres colores, tres', '¡Tres veces mala suerte!'),
	]},
	{id: 'R4', slice: 3, cond: '¡SU APODO HABLA DE PERSONAS!', short: 'PERSONAS', step: 80, cards: [
		C('EGY', 'LOS FARAONES', 'Los reyes del antiguo Egipto', '¡Ni las pirámides nos salvan!'),
		C('KOR', 'LOS GUERREROS TAEGUK', 'Guerreros, por el símbolo del taeguk de su bandera', '¡Fui semifinalista en 2002!'),
		C('HTI', 'LES GRENADIERS', '«Los granaderos»: soldados de la independencia haitiana', '¡Granaderos en retirada!'),
		C('JOR', 'AL-NASHAMA', '«Los valientes», en árabe', '¡Valientes, pero fuera!'),
		C('ZAF', 'BAFANA BAFANA', '«Los chicos», en zulú', '¡Aaay, Bafana!'),
	]},
	{id: 'R5', slice: 4, cond: '¡SU APODO TIENE UN ASTRO!', short: 'ASTRO', step: 80, cards: [
		C('USA', 'STARS AND STRIPES', 'Las barras y estrellas de su bandera', '¡En nuestra casa no!'),
		C('TUR', 'AY-YILDIZLILAR', '«Los de la media luna y la estrella», en turco', '¡Ay, ay, ay!'),
	]},
	{id: 'R6', slice: 5, cond: '¡SU APODO TIENE UN SER MITOLÓGICO!', short: 'MITOLOGÍA', step: 80, cards: [
		C('BIH', 'ZMAJEVI', '«Los dragones», el apodo de todos sus deportistas', '¡Los dragones no existen!'),
	]},
	{id: 'R7', slice: 6, cond: '¡SU APODO TIENE UNA BEBIDA!', short: 'BEBIDA', step: 80, cards: [
		C('COL', 'LOS CAFETEROS', 'Por el café, el producto más famoso de Colombia', '¡Me tomo un tinto y me voy!'),
	]},
	{id: 'R8', slice: 7, cond: '¡SU APODO TIENE FUEGO!', short: 'FUEGO', step: 80, cards: [
		C('HRV', 'VATRENI', '«Los ardientes»: viene de vatra, fuego en croata', '¡Ni con Modric!'),
	]},
	{id: 'R9', slice: 8, cond: '¡SU APODO TIENE UN ESCUDO!', short: 'ESCUDO', step: 80, cards: [
		C('PRT', 'SELEÇÃO DAS QUINAS', 'Las quinas son los cinco escudos de su bandera', '¡Cristiano, haz algo!'),
	]},
	{id: 'R10', slice: 9, cond: '¡SU APODO ES UNA ABREVIATURA!', short: 'ABREVIATURA', step: 80, cards: [
		C('CHE', 'LA NATI', 'Abreviatura de Nationalmannschaft', '¡Neutrales hasta el final!'),
		C('CZE', 'REPRE', 'Abreviatura de reprezentace, «la representación»', '¡Ni la Euro del 76 nos salva!'),
	]},
	{id: 'R11', slice: 10, cond: '¡SU APODO TIENE UNA PALABRA EN INGLÉS!', short: 'INGLÉS', step: 80, cards: [
		C('AUT', 'DAS TEAM', '«Das» es alemán... pero «team» es inglés', '¡Medio inglés también cuenta!'),
		C('IRN', 'TEAM MELLI', '«El equipo nacional», mezclando inglés y persa', '¡Team, team, team!'),
		C('SCT', 'TARTAN ARMY', 'El «ejército del tartán»: así se conoce a su afición', '¡Esta vez tampoco!'),
	]},
	{id: 'R12', slice: 11, cond: '¡SU APODO SIGNIFICA «LA SELECCIÓN»!', short: 'SELECCIÓN', step: 80, cards: [
		C('NOR', 'LANDSLAGET', 'En noruego significa, literalmente, «la selección nacional»', '¡Haaland, haz algo!'),
		C('DEU', '¿Y ALEMANIA?', 'Die Mannschaft significa solo «el equipo»', '¡Equipo, no selección!', true),
	]},
];
const ELIMS: Record<string, [string, string][]> = {};
for (const r of ROUNDS) ELIMS[r.id] = r.cards.filter((c) => !c.safe).map((c) => [c.k, '']);

const W = makeWheel({
	ALL, NAME, FL, ROUNDS, SLICES, ELIMS, WINNER: 'DEU',
	track: {label: 'LAS DE HABLA HISPANA', keys: ['ARG', 'COL', 'ECU', 'MEX', 'PAN', 'PRY', 'URY', 'ESP']},
	hookTitle: ['TU SELECCIÓN', 'DESAPARECE', 'SI SU APODO TIENE...'], hookBadge: 'LAS 48 DEL MUNDIAL 2026', hookCols: 8,
	hookCards: [
		{k: 'ESP', at: 420, cond: '...UN COLOR', card: {k: 'ESP', title: '¿LA CAMPEONA DEL MUNDO?', line: 'La Roja: el color está en el apodo', bubble: '¡Pero si soy campeona!'}},
		{k: 'ENG', at: 820, cond: '...UN ANIMAL', card: {k: 'ENG', title: 'THE THREE LIONS', line: 'Los tres leones de su escudo', bubble: '¡It\'s not coming home!'}},
	],
	hookEnd: {big: '48 SELECCIONES', mid: '12 RONDAS', hint: 'Pista: no es ni Argentina, ni Brasil, ni España'},
	rules: ['La ruleta elige una palabra', 'Si el apodo de tu selección la tiene... ¡DESAPARECE!', 'Las 48 selecciones del Mundial 2026', '¿Aguantará la tuya? Cuéntalo en comentarios'],
	duel: ['NOR', 'DEU'], subRound: 3, midRound: 5,
	final: {t1: '¡ALEMANIA', t2: 'SOBREVIVE!', badge: 'LA ÚNICA DE 48', facts: ['Su apodo: Die Mannschaft', 'Significa simplemente «el equipo»', 'Sin animales, colores ni números', '4 Mundiales y 3 Eurocopas'], ask: '¿En qué ronda cayó TU selección?'},
});
export const Video35 = W.Video;
export const V35_TOTAL = W.TOTAL;
export const v35Sfx = W.sfx;
export const v35Music = W.music;
