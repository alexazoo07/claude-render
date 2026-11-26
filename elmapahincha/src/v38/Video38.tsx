// V38 · Eliminando PAÍSES de Latinoamérica hasta que quede 1 (geografía)
import F3 from '../iso3flag.json';
import {makeWheel, WRound} from '../vw/WheelVideo';

const ALL = ['ARG', 'BOL', 'BRA', 'CHL', 'COL', 'CRI', 'CUB', 'DOM', 'ECU', 'SLV', 'GTM', 'HTI', 'HND', 'MEX', 'NIC', 'PAN', 'PRY', 'PER', 'URY', 'VEN'];
const NAME: Record<string, string> = {ARG: 'Argentina', BOL: 'Bolivia', BRA: 'Brasil', CHL: 'Chile', COL: 'Colombia', CRI: 'Costa Rica', CUB: 'Cuba', DOM: 'R. Dominicana', ECU: 'Ecuador', SLV: 'El Salvador', GTM: 'Guatemala', HTI: 'Haití', HND: 'Honduras', MEX: 'México', NIC: 'Nicaragua', PAN: 'Panamá', PRY: 'Paraguay', PER: 'Perú', URY: 'Uruguay', VEN: 'Venezuela'};
const SLICES = [
	{label: 'SIN MAR', col: '#16A34A'},
	{label: 'ES UNA ISLA', col: '#2B2D35'},
	{label: 'CAPITAL EN ALTURA', col: '#F4C20D'},
	{label: 'DOS OCÉANOS', col: '#1D4ED8'},
	{label: 'CRUZA EL ECUADOR', col: '#E9E4D6'},
	{label: '+1 MILLÓN KM²', col: '#F47B20'},
	{label: 'ANTÁRTIDA', col: '#6CB4EE'},
	{label: 'MONTAÑAS +4.000 M', col: '#D3202B'},
	{label: 'MÁS VACAS', col: '#9B5DE5'},
	{label: 'DESIERTO', col: '#7C3AED'},
	{label: 'SELVA', col: '#F15BB5'},
	{label: 'VOLCANES', col: '#8C8F99'},
];
const ROUNDS: WRound[] = [
	{id: 'R1', slice: 0, cond: '¡NO TIENE SALIDA AL MAR!', short: 'SIN MAR', step: 80, cards: [
		{k: 'BOL', title: 'BOLIVIA', line: 'Perdió su costa en la Guerra del Pacífico (1879-1884)', dato: 'Aun así tiene Armada: navega por el lago Titicaca', bubble: '¡Tengo barcos en un lago!'},
		{k: 'PRY', title: 'PARAGUAY', line: 'Uno de los dos países de Sudamérica sin mar', dato: 'Comparte con Brasil la presa de Itaipú, una de las más grandes del mundo', bubble: '¡Pero tengo Itaipú!'},
		{k: 'CHL', title: '¿Y CHILE?', line: '¡Más de 4.000 km de costa, de norte a sur!', dato: 'Es uno de los países más largos y estrechos del mundo', bubble: '¡Mar me sobra!', safe: true},
	]},
	{id: 'R2', slice: 1, cond: '¡ES UNA ISLA O ESTÁ EN UNA!', short: 'ISLA', step: 80, cards: [
		{k: 'CUB', title: 'CUBA', line: 'La isla más grande del Caribe', dato: 'Mide unos 1.250 km de punta a punta', bubble: '¡Soy la más grande!'},
		{k: 'DOM', title: 'REPÚBLICA DOMINICANA', line: 'Comparte con Haití la isla de La Española', dato: 'Tiene el pico más alto del Caribe: el Duarte, de 3.098 m', bubble: '¡Tengo el techo del Caribe!'},
		{k: 'HTI', title: 'HAITÍ', line: 'La otra mitad de La Española', dato: 'Fue el primer país independiente de Latinoamérica, en 1804', bubble: '¡Fui la primera en ser libre!'},
	]},
	{id: 'R3', slice: 2, cond: '¡SU CAPITAL ESTÁ A MÁS DE 2.500 METROS!', short: 'CAPITAL ALTA', step: 80, cards: [
		{k: 'ECU', title: 'ECUADOR', line: 'Quito está a unos 2.850 metros de altura', dato: 'Y su volcán Chimborazo es el punto más alejado del centro de la Tierra', bubble: '¡Estoy más cerca del cielo!'},
		{k: 'COL', title: 'COLOMBIA', line: 'Bogotá está a unos 2.640 metros de altura', dato: 'Es el único país de Sudamérica con costa en el Pacífico y en el Caribe', bubble: '¡Bogotá me ha delatado!'},
		{k: 'MEX', title: '¿Y MÉXICO?', line: 'Ciudad de México está a unos 2.240 metros', dato: '¡Se salva por poco más de 250 metros!', bubble: '¡Por los pelos!', safe: true},
	]},
	{id: 'R4', slice: 3, cond: '¡TIENE COSTA EN DOS OCÉANOS!', short: 'DOS OCÉANOS', step: 80, cards: [
		{k: 'MEX', title: 'MÉXICO', line: 'Pacífico y golfo de México: más de 11.000 km de costa', dato: 'Es el país con más hispanohablantes del mundo', bubble: '¡No me escapo esta vez!'},
		{k: 'GTM', title: 'GUATEMALA', line: 'Pacífico y mar Caribe', dato: 'Tiene la montaña más alta de Centroamérica: el volcán Tajumulco (4.220 m)', bubble: '¡Mi Caribe es pequeñito!'},
		{k: 'HND', title: 'HONDURAS', line: 'Mar Caribe y Pacífico, por el golfo de Fonseca', dato: 'En Honduras están las ruinas mayas de Copán', bubble: '¡Si mi Pacífico es mínimo!'},
		{k: 'NIC', title: 'NICARAGUA', line: 'Mar Caribe y Pacífico', dato: 'El país más grande de Centroamérica, con tiburones en un lago de agua dulce', bubble: '¡Mis tiburones os vengarán!'},
		{k: 'CRI', title: 'COSTA RICA', line: 'Mar Caribe y Pacífico', dato: 'Abolió su ejército en 1948', bubble: '¡Pura vida... hasta aquí!'},
		{k: 'PAN', title: 'PANAMÁ', line: 'Mar Caribe y Pacífico, unidos por su canal', dato: 'El canal de Panamá mide unos 80 km', bubble: '¡Yo uno los dos océanos!'},
		{k: 'SLV', title: '¿Y EL SALVADOR?', line: '¡Solo tiene costa en el Pacífico!', dato: 'Es el único país de Centroamérica sin costa en el Caribe', bubble: '¡Mi único océano me salva!', safe: true},
	]},
	{id: 'R5', slice: 4, cond: '¡LO CRUZA LA LÍNEA DEL ECUADOR!', short: 'ECUADOR', step: 80, cards: [
		{k: 'BRA', title: 'BRASIL', line: 'La línea del ecuador pasa junto a Macapá, en el norte', dato: 'Tiene frontera con todos los países de Sudamérica menos Chile y Ecuador', bubble: '¡Soy demasiado grande!'},
		{k: 'PER', title: '¿Y PERÚ?', line: '¡Queda entero al sur del ecuador... por muy poco!', dato: 'Ecuador y Colombia, que sí lo cruzan, ya se habían ido', bubble: '¡Me libro por kilómetros!', safe: true},
	]},
	{id: 'R6', slice: 5, cond: '¡MIDE MÁS DE 1 MILLÓN DE KM²!', short: '+1 MILLÓN KM²', step: 80, cards: [
		{k: 'ARG', title: 'ARGENTINA', line: '2,78 millones de km²: el país de habla hispana más grande', dato: 'Tiene el Aconcagua (6.961 m), la montaña más alta fuera de Asia', bubble: '¡Ser grande me condena!'},
		{k: 'PER', title: 'PERÚ', line: '1,28 millones de km²', dato: 'En Perú está Machu Picchu, una de las 7 nuevas maravillas del mundo', bubble: '¡Esta vez no me libro!'},
		{k: 'VEN', title: '¿Y VENEZUELA?', line: '916.445 km²: ¡se queda por debajo!', dato: 'Le faltan unos 84.000 km² para llegar al millón', bubble: '¡Me salvo por poco!', safe: true},
	]},
	{id: 'R7', slice: 6, cond: '¡RECLAMA TERRITORIO EN LA ANTÁRTIDA!', short: 'ANTÁRTIDA', step: 80, cards: [
		{k: 'CHL', title: 'CHILE', line: 'Reclama el Territorio Chileno Antártico desde 1940', dato: 'Y tiene el Atacama, el desierto no polar más seco del mundo', bubble: '¡Del desierto al hielo!'},
		{k: 'URY', title: '¿Y URUGUAY?', line: 'Tiene una base, la Artigas, ¡pero no reclama territorio!', dato: 'La base Artigas está en la isla Rey Jorge', bubble: '¡Solo estoy de visita!', safe: true},
	]},
	{id: 'R8', slice: 7, cond: '¡TIENE MONTAÑAS DE MÁS DE 4.000 METROS!', short: '+4.000 M', step: 80, cards: [
		{k: 'VEN', title: 'VENEZUELA', line: 'El pico Bolívar mide 4.978 metros', dato: 'Y tiene el salto Ángel, la cascada más alta del mundo (979 m)', bubble: '¡Mi cascada no me salva!'},
		{k: 'SLV', title: '¿Y EL SALVADOR?', line: 'Su punto más alto, el cerro El Pital, mide 2.730 m', dato: '¡Le faltan más de 1.200 metros!', bubble: '¡Sigo vivo!', safe: true},
		{k: 'URY', title: '¿Y URUGUAY?', line: 'Su punto más alto, el cerro Catedral, mide 514 m', dato: 'Es uno de los países más llanos de Sudamérica', bubble: '¡Soy plano y feliz!', safe: true},
	]},
	{id: 'R9', slice: 8, cond: '¡TIENE MÁS VACAS QUE PERSONAS!', short: 'MÁS VACAS', step: 80, cards: [
		{k: 'URY', title: 'URUGUAY', line: 'Unos 12 millones de vacas para 3,4 millones de habitantes', dato: '¡Más de 3 vacas por persona!', bubble: '¡Me traicionó el asado!'},
	]},
];
const ELIMS: Record<string, [string, string][]> = {};
for (const r of ROUNDS) ELIMS[r.id] = r.cards.filter((c) => !c.safe).map((c) => [c.k, '']);

const W = makeWheel({
	ALL, NAME, FL: F3 as Record<string, string>, ROUNDS, SLICES, ELIMS, WINNER: 'SLV',
	track: {label: 'LATINOAMÉRICA', keys: ALL},
	hookTitle: ['ELIMINANDO', 'PAÍSES', 'DE LATINOAMÉRICA...'], hookBadge: 'HASTA QUE QUEDE SOLO 1', hookCols: 5,
	hookCards: [
		{k: 'BOL', at: 420, cond: '...NO TIENE SALIDA AL MAR', card: {k: 'BOL', title: 'BOLIVIA', line: 'Perdió su costa en la Guerra del Pacífico', bubble: '¡Tengo barcos en un lago!'}},
		{k: 'BRA', at: 820, cond: '...LO CRUZA LA LÍNEA DEL ECUADOR', card: {k: 'BRA', title: '¿EL GIGANTE?', line: 'La línea del ecuador pasa por el norte de Brasil', bubble: '¡Soy demasiado grande!'}},
	],
	hookEnd: {big: '20 PAÍSES', mid: '9 RONDAS', hint: 'Pista: es uno de los países más pequeños'},
	rules: ['La ruleta elige una condición', 'Si tu país la cumple... ¡DESAPARECE!', 'Los 20 países de Latinoamérica', '¿Aguantará el tuyo? Cuéntalo en comentarios'],
	duel: ['URY', 'SLV'], subRound: 3, midRound: 5,
	final: {t1: '¡EL SALVADOR', t2: 'SOBREVIVE!', badge: 'EL ÚLTIMO DE 20', facts: ['El país más pequeño de América continental', 'El único de Centroamérica sin costa en el Caribe', 'Le llaman la tierra de los volcanes', 'Su punto más alto, El Pital, mide 2.730 m'], ask: '¿En qué ronda cayó TU país?'},
	timing: {CARD: 800, C_BUB: 400, C_STAMP: 590, C_DATO: 220},
	ifText: 'SI TU PAÍS...',
});
export const Video38 = W.Video;
export const V38_TOTAL = W.TOTAL;
export const v38Sfx = W.sfx;
export const v38Music = W.music;
export const v38Rnds = W.RNDS; export const v38Fin = W.FIN0;
