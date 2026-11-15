import ELIM from './elim24.json';
import F3 from '../iso3flag.json';

// Home shirts of the 48 teams at the 2026 World Cup (sources: Okdiario, Goal, CNN, Footballfashion — May/June 2026)
export const FL: Record<string, string> = {...(F3 as Record<string, string>), SCT: 'gb-sct', ENG: 'gb-eng'};
export const NAME = (ELIM as any).names as Record<string, string>;
export const ALL = (ELIM as any).U as string[];
const RAW = (ELIM as any).rounds as Record<string, [string, string][]>;

export type Kit = {c: string; p?: 'stripes' | 'checks'; c2?: string; t?: string};
const RED = '#D3202B', WHITE = '#F4F4F2', BLUE = '#1F4FBF', NAVY = '#1B2A4A', YELLOW = '#F7CF1D', GREEN = '#0E7A3E', ORANGE = '#F47B20', SKY = '#79C3EE', MAROON = '#7A1F2B', BLACK = '#1E1E22';
export const KIT: Record<string, Kit> = {
	MEX: {c: GREEN, t: WHITE}, SAU: {c: GREEN, t: '#6B3FA0'}, NZL: {c: BLACK, t: WHITE},
	BRA: {c: YELLOW, t: GREEN}, COL: {c: YELLOW, t: '#1D3A8F'}, ECU: {c: YELLOW, t: '#1D3A8F'}, AUS: {c: YELLOW, t: GREEN}, ZAF: {c: YELLOW, t: GREEN}, SWE: {c: YELLOW, t: '#2C5BAA'},
	NLD: {c: ORANGE, t: BLACK}, CIV: {c: ORANGE, t: GREEN},
	ENG: {c: WHITE, t: NAVY}, DEU: {c: WHITE, t: BLACK}, USA: {c: '#EDEBE4', t: '#1B2A6B'}, DZA: {c: WHITE, t: GREEN}, JOR: {c: WHITE, t: RED}, IRQ: {c: WHITE, t: GREEN}, GHA: {c: WHITE, t: YELLOW}, SEN: {c: WHITE, t: GREEN}, IRN: {c: WHITE, t: GREEN},
	FRA: {c: BLUE, t: WHITE}, JPN: {c: BLUE, t: WHITE}, HTI: {c: BLUE, t: RED}, SCT: {c: NAVY, t: WHITE}, BIH: {c: BLUE, t: YELLOW}, CPV: {c: BLUE, t: RED}, UZB: {c: BLUE, t: WHITE}, CUW: {c: '#1D4FD8', t: YELLOW},
	ESP: {c: RED, t: YELLOW}, KOR: {c: RED, t: BLACK}, CZE: {c: RED, t: WHITE}, CAN: {c: RED, t: WHITE}, MAR: {c: RED, t: GREEN}, TUR: {c: RED, t: WHITE}, TUN: {c: RED, t: WHITE}, EGY: {c: RED, t: WHITE}, AUT: {c: RED, t: WHITE},
	BEL: {c: '#D0312D', t: YELLOW}, CHE: {c: RED, t: WHITE}, NOR: {c: RED, t: NAVY}, PAN: {c: RED, t: WHITE}, PRT: {c: MAROON, t: GREEN}, QAT: {c: MAROON, t: WHITE},
	URY: {c: SKY, t: WHITE}, COD: {c: '#4FB6EE', t: RED},
	ARG: {c: WHITE, p: 'stripes', c2: SKY, t: BLACK}, PRY: {c: WHITE, p: 'stripes', c2: RED, t: BLUE},
	HRV: {c: WHITE, p: 'checks', c2: RED, t: BLUE},
};

export type Card = {k: string; title: string; line: string; bubble: string; safe?: boolean};
export type Slice = {label: string; col: string};
export const SLICES: Slice[] = [
	{label: 'VERDE', col: '#16A34A'},
	{label: 'NEGRA', col: '#2B2D35'},
	{label: 'AMARILLA', col: '#F4C20D'},
	{label: 'NARANJA', col: '#F47B20'},
	{label: 'BLANCA', col: '#E9E4D6'},
	{label: 'AZUL', col: '#1D4ED8'},
	{label: 'ROJA', col: '#D3202B'},
	{label: 'CELESTE', col: '#6CB4EE'},
	{label: 'A RAYAS', col: '#9B5DE5'},
	{label: 'MORADA', col: '#7C3AED'},
	{label: 'ROSA', col: '#F15BB5'},
	{label: 'GRIS', col: '#8C8F99'},
];
export type Round = {id: string; slice: number; cond: string; short: string; step: number; cards: Card[]};
export const ROUNDS: Round[] = [
	{id: 'VERDE', slice: 0, cond: '¡SU CAMISETA ES VERDE!', short: 'VERDE', step: 80, cards: [
		{k: 'MEX', title: 'EL TRI, DE VERDE', line: 'Verde con detalles aztecas y el lema «Somos México» en la espalda', bubble: '¡Pero si jugábamos en casa!'},
		{k: 'SAU', title: 'VERDE CON ROMBOS', line: 'Verde con rombos violetas, inspirados en las puertas decoradas del país', bubble: '¡Ni siquiera es verde liso!'},
	]},
	{id: 'NEGRA', slice: 1, cond: '¡SU CAMISETA ES NEGRA!', short: 'NEGRA', step: 80, cards: [
		{k: 'NZL', title: '¡LOS ALL WHITES... DE NEGRO!', line: 'Su apodo viene del blanco, pero su primera camiseta del Mundial 2026 es negra', bubble: '¡Nos pasamos al lado oscuro!'},
	]},
	{id: 'AMARILLA', slice: 2, cond: '¡SU CAMISETA ES AMARILLA!', short: 'AMARILLA', step: 80, cards: [
		{k: 'BRA', title: 'LA CANARINHA', line: 'El amarillo más famoso del fútbol... y la selección con más Mundiales: 5', bubble: '¡La pentacampeona, fuera!'},
		{k: 'COL', title: 'LA TRICOLOR', line: 'Amarilla, como la mitad de su bandera', bubble: '¡No, por favor!'},
		{k: 'ECU', title: 'LA TRI', line: 'Prácticamente amarilla entera', bubble: '¡Ni un detalle de otro color!'},
		{k: 'AUS', title: 'LOS SOCCEROOS', line: 'Amarilla con detalles verdes, los colores deportivos de Australia', bubble: '¡Desde la otra punta del mundo para esto!'},
		{k: 'ZAF', title: 'BAFANA BAFANA', line: 'Primera equipación amarilla con detalles verdes', bubble: '¡Aaay, Bafana!'},
		{k: 'SWE', title: 'SUECIA', line: 'Amarilla con detalles azules: los colores de su bandera', bubble: '¡Nuestro amarillo es más bonito!'},
	]},
	{id: 'NARANJA', slice: 3, cond: '¡SU CAMISETA ES NARANJA!', short: 'NARANJA', step: 80, cards: [
		{k: 'NLD', title: 'LA ORANJE', line: 'Juega de naranja por la Casa de Orange, la familia real neerlandesa', bubble: '¡Tres finales y ni así!'},
		{k: 'CIV', title: 'LOS ELEFANTES', line: 'Naranja con verde, como su bandera', bubble: '¡Nos ha tocado muy pronto!'},
	]},
	{id: 'BLANCA', slice: 4, cond: '¡SU CAMISETA ES BLANCA!', short: 'BLANCA', step: 80, cards: [
		{k: 'ENG', title: 'THE THREE LIONS', line: 'Blanca, con algo de azul en las mangas y el cuello', bubble: '¡It\'s not coming home!'},
		{k: 'DEU', title: 'DIE MANNSCHAFT', line: 'Blanca, con un toque retro y la bandera en el pecho', bubble: '¡Cuatro Mundiales y fuera!'},
		{k: 'USA', title: 'EL ANFITRIÓN', line: 'Blanco roto, con un diseño que parece la bandera ondeando', bubble: '¡En nuestra casa no!'},
		{k: 'DZA', title: 'LOS ZORROS DEL DESIERTO', line: 'El blanco representa a Argelia en su primera equipación', bubble: '¡Ni el desierto nos salva!'},
		{k: 'JOR', title: 'EL DEBUTANTE, DE BLANCO', line: 'Blanca la primera y roja la segunda. Era su primer Mundial', bubble: '¡Nos estrenamos y ya nos vamos!'},
		{k: 'IRQ', title: 'LOS LEONES DE MESOPOTAMIA', line: 'Blanca con figuras geométricas. Volvió al Mundial 40 años después de México 86', bubble: '¡40 años esperando!'},
		{k: 'GHA', title: 'LAS ESTRELLAS NEGRAS', line: 'Camiseta blanca con líneas de colores', bubble: '¡Estrellas negras, camiseta blanca!'},
		{k: 'SEN', title: 'LOS LEONES DE LA TERANGA', line: 'Base blanca con motivos de tejidos tradicionales', bubble: '¡Rugimos... y desaparecemos!'},
		{k: 'IRN', title: 'TEAM MELLI', line: 'Blanca y lisa, con ribetes con los colores de su bandera', bubble: '¡Clásica, pero eliminada!'},
	]},
	{id: 'AZUL', slice: 5, cond: '¡SU CAMISETA ES AZUL!', short: 'AZUL', step: 80, cards: [
		{k: 'FRA', title: 'LES BLEUS', line: '¡Azules hasta en el apodo! Campeona del mundo en 1998 y 2018', bubble: '¡Pas possible!'},
		{k: 'JPN', title: 'SAMURAI BLUE', line: 'Azul con toques blancos... aunque su bandera sea blanca y roja', bubble: '¡Nuestro azul es tradición!'},
		{k: 'HTI', title: 'HAITÍ', line: 'Azul con el escudo en el centro. Volvió al Mundial 52 años después de 1974', bubble: '¡Medio siglo esperando!'},
		{k: 'SCT', title: 'ESCOCIA', line: 'Su habitual azul oscuro', bubble: '¡El azul marino también es azul!'},
		{k: 'BIH', title: 'LOS DRAGONES', line: 'Azul con líneas amarillas, como su bandera', bubble: '¡Qué mala suerte!'},
		{k: 'CPV', title: 'LOS TIBURONES AZULES', line: 'Debutó en el Mundial 2026 vestido de azul océano', bubble: '¡Tiburones azules, claro!'},
		{k: 'UZB', title: 'UZBEKISTÁN', line: 'Azul fuerte para su primer Mundial', bubble: '¡Debutamos y adiós!'},
		{k: 'CUW', title: 'THE BLUE WAVE', line: 'El país más pequeño que ha jugado un Mundial... de azul real', bubble: '¡Semper blou!'},
		{k: 'URY', title: '¿EL CELESTE CUENTA?', line: 'El celeste no es azul... ¡La Celeste se salva!', bubble: '¡Celeste, no azul!', safe: true},
		{k: 'ARG', title: '¿Y LA ALBICELESTE?', line: 'Rayas celestes y blancas: ¡tampoco es azul!', bubble: '¡Uf, por poco!', safe: true},
		{k: 'COD', title: '¿Y LOS LEOPARDOS?', line: 'Azul claro brillante... ¡eso es celeste!', bubble: '¡Leopardos celestes!', safe: true},
	]},
	{id: 'ROJA', slice: 6, cond: '¡SU CAMISETA ES ROJA!', short: 'ROJA', step: 80, cards: [
		{k: 'ESP', title: '¡LA CAMPEONA DEL MUNDO!', line: 'La Roja: hasta su apodo es el color de la camiseta', bubble: '¡Pero si soy campeona del mundo!'},
		{k: 'KOR', title: 'COREA DEL SUR', line: 'Roja, como su famosa afición: los «Diablos Rojos»', bubble: '¡Fuera en rojo!'},
		{k: 'CZE', title: 'CHEQUIA', line: 'Roja, como la franja de abajo de su bandera', bubble: '¡Ni la Euro del 76 nos salva!'},
		{k: 'CAN', title: 'OTRO ANFITRIÓN', line: 'Roja, como la hoja de arce de su bandera', bubble: '¡Otro anfitrión fuera!'},
		{k: 'MAR', title: 'LOS LEONES DEL ATLAS', line: 'Roja con detalles verdes. Semifinalista en Catar 2022', bubble: '¡Llegamos a semis en 2022!'},
		{k: 'TUR', title: 'TURQUÍA', line: 'Roja, como su bandera de la media luna', bubble: '¡Ay, ay, ay!'},
		{k: 'TUN', title: 'LAS ÁGUILAS DE CARTAGO', line: 'El rojo de su bandera en la primera equipación', bubble: '¡Volamos fuera!'},
		{k: 'EGY', title: 'LOS FARAONES', line: 'Roja con una estrella en el centro', bubble: '¡Ni las pirámides nos salvan!'},
		{k: 'AUT', title: 'AUSTRIA', line: 'Una camiseta completamente roja', bubble: '¡El rojo nos traicionó!'},
		{k: 'BEL', title: 'LOS DIABLOS ROJOS', line: 'Un tono entre rojo y naranja... que cuenta como rojo', bubble: '¡Los diablos, al infierno!'},
		{k: 'CHE', title: 'LA NATI', line: 'Roja, como su bandera con la cruz blanca', bubble: '¡Neutrales hasta el final!'},
		{k: 'NOR', title: 'LA NORUEGA DE HAALAND', line: 'Roja, como la bandera de Noruega', bubble: '¡Haaland, haz algo!'},
		{k: 'PAN', title: 'LA MAREA ROJA', line: 'Roja con detalles blancos', bubble: '¡La marea se retira!'},
		{k: 'PRT', title: '¿EL GRANATE CUENTA?', line: 'El granate de Portugal es un rojo oscuro... ¡y cuenta!', bubble: '¡Cristiano, haz algo!'},
		{k: 'QAT', title: 'EL GRANATE DE CATAR', line: 'Granate, el color de su bandera', bubble: '¡El granate también es rojo!'},
		{k: 'HRV', title: '¿Y LOS CUADROS?', line: 'Roja y blanca a cuadros: no es una camiseta roja', bubble: '¡Los cuadros nos salvan!', safe: true},
		{k: 'PRY', title: '¿Y LA ALBIRROJA?', line: 'Rayas rojas y blancas: tampoco es roja del todo', bubble: '¡Las rayas nos salvan!', safe: true},
	]},
	{id: 'CELESTE', slice: 7, cond: '¡SU CAMISETA ES CELESTE!', short: 'CELESTE', step: 80, cards: [
		{k: 'URY', title: 'LA CELESTE', line: 'Se salvó del azul... pero ahora le toca al celeste', bubble: '¡Nooo, la Celeste!'},
		{k: 'COD', title: 'LOS LEOPARDOS', line: 'Azul claro brillante con estampado de leopardo', bubble: '¡Nos pillaron!'},
	]},
	{id: 'RAYAS', slice: 8, cond: '¡SU CAMISETA ES A RAYAS!', short: 'A RAYAS', step: 80, cards: [
		{k: 'ARG', title: 'LA ALBICELESTE', line: 'Rayas verticales celestes y blancas: la camiseta de 3 Mundiales', bubble: '¡Las rayas nos condenan!'},
		{k: 'PRY', title: 'LA ALBIRROJA', line: 'Rayas rojas y blancas, como siempre', bubble: '¡Tan cerca del final!'},
	]},
];
export const ELIMS: Record<string, [string, string][]> = RAW;
export const LATAM = ['ARG', 'COL', 'ECU', 'MEX', 'PAN', 'PRY', 'URY', 'ESP'];
export const WINNER = 'HRV';
