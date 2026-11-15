import opp from './opp.json';

// From Perú's point of view. Internal keys: PAN = nunca le ganó, MIE = bestia negra, RES = igualados, SIN = dominado
export type Cat = 'PAN' | 'MIE' | 'RES' | 'SIN';
// ow = rival wins (Perú losses), ol = rival losses (Perú wins)
export type Opp = {n: string; flag: string; p: number; ow: number; d: number; ol: number; gf: number; ga: number; first: string; last: [number, number, string, string]; cat: Cat};
export const OPP = opp as unknown as Record<string, Opp>;

export const CAT_COL: Record<Cat, string> = {PAN: '#E8394A', MIE: '#FF9B21', RES: '#9B5DE5', SIN: '#3DB86B'};
export const CAT_DARK: Record<Cat, string> = {PAN: '#A61E2D', MIE: '#C46A00', RES: '#6232A8', SIN: '#1F7E43'};
export const CAT_NAME: Record<Cat, string> = {PAN: 'NUNCA LE GANÓ', MIE: 'BESTIA NEGRA', RES: 'IGUALADOS', SIN: 'DOMINADO'};
export const CAT_STAMP: Record<Cat, string> = {PAN: '¡NUNCA LE HA GANADO!', MIE: '¡BESTIA NEGRA!', RES: '¡EMPATE TÉCNICO!', SIN: '¡DOMINADO!'};
export const CAT_RULE: Record<Cat, string> = {
	PAN: 'Perú nunca le ha ganado',
	MIE: 'Le ha ganado más veces a Perú',
	RES: 'Mismas victorias que derrotas',
	SIN: 'Perú le gana más veces',
};

export const NAME: Record<string, string> = {
	BRA: 'Brasil', ARG: 'Argentina', URY: 'Perú', COL: 'Colombia', CHL: 'Chile', PRY: 'Paraguay', PER: 'Perú', VEN: 'Venezuela', ECU: 'Ecuador', BOL: 'Bolivia',
	MEX: 'México', USA: 'Estados Unidos', CAN: 'Canadá', CRI: 'Costa Rica', HND: 'Honduras', PAN: 'Panamá', GTM: 'Guatemala', NIC: 'Nicaragua', HTI: 'Haití', CUB: 'Cuba',
	DOM: 'R. Dominicana', TTO: 'Trinidad y Tobago', JAM: 'Jamaica',
	PRT: 'Portugal', FRA: 'Francia', ITA: 'Italia', ENG: 'Inglaterra', SCT: 'Escocia', IRL: 'Irlanda', NIR: 'Irlanda del Norte', WLS: 'Gales', NLD: 'Países Bajos', DEU: 'Alemania',
	CHE: 'Suiza', AUT: 'Austria', BEL: 'Bélgica', LUX: 'Luxemburgo', DNK: 'Dinamarca', SWE: 'Suecia', NOR: 'Noruega', FIN: 'Finlandia', EST: 'Estonia', UKR: 'Ucrania', RUS: 'Rusia',
	POL: 'Polonia', CZE: 'Chequia', HUN: 'Hungría', ROU: 'Rumanía', BGR: 'Bulgaria', SRB: 'Serbia', SVN: 'Eslovenia', TUR: 'Turquía', GEO: 'Georgia', ISR: 'Israel', ESP: 'España',
	JPN: 'Japón', KOR: 'Corea del Sur', CHN: 'China', SAU: 'Arabia Saudí', IRN: 'Irán', IRQ: 'Irak', JOR: 'Jordania', UZB: 'Uzbekistán', ARE: 'Emiratos Árabes', OMN: 'Omán',
	IND: 'India', HRV: 'Croacia', CMR: 'Camerún', SLV: 'El Salvador', ISL: 'Islandia', QAT: 'Catar', SVK: 'Eslovaquia', ARM: 'Armenia', BLR: 'Bielorrusia', IDN: 'Indonesia', THA: 'Tailandia', SGP: 'Singapur', AUS: 'Australia', NZL: 'Nueva Zelanda', PYF: 'Tahití',
	MAR: 'Marruecos', DZA: 'Argelia', TUN: 'Túnez', EGY: 'Egipto', LBY: 'Libia', NGA: 'Nigeria', ZAF: 'Sudáfrica', CIV: 'Costa de Marfil', SEN: 'Senegal', GHA: 'Ghana', AGO: 'Angola', CPV: 'Cabo Verde',
};

// ------------------------------------------------------------ script
export type Line = {who: 'opp' | 'hero'; text: string};
export type Focus = {kind: 'focus'; k: string; region: string; tab: string; dato: string; lines: Line[]};
export type Group = {kind: 'group'; region: string; title: string; keys: string[]; say: string};
export type Cta = {kind: 'cta'; region: string; left: string};
export type Entry = Focus | Group | Cta;
const F = (k: string, region: string, tab: string, dato: string, opp: string, hero: string): Focus => ({kind: 'focus', k, region, tab, dato, lines: [{who: 'opp', text: opp}, {who: 'hero', text: hero}]});
const G = (region: string, title: string, keys: string[], say: string): Group => ({kind: 'group', region, title, keys, say});
const SA = 'SUDAMÉRICA', NA = 'CONCACAF', EU = 'EUROPA', AS = 'ASIA Y OCEANÍA', AF = 'ÁFRICA';

export const SCRIPT: Entry[] = [
	F('ARG', SA, 'LA ALBICELESTE', '56 partidos y solo 5 victorias de Perú. Pero en 1969, un 2-2 en la Bombonera dejó a Argentina sin el Mundial de México 70', '¡Te gano 37 a 5!', '¡Y yo te dejé sin Mundial!'),
	F('BRA', SA, 'LA PENTACAMPEONA', 'Brasil le ha ganado 38 de 52. Pero en la Copa América 2016, un gol de Ruidíaz (1-0) la eliminó en la fase de grupos', '¡Te gano 38 a 5!', '¡Ruidíaz te mandó a casa!'),
	F('CHL', SA, 'EL CLÁSICO DEL PACÍFICO', '88 partidos: su rival más repetido. Chile gana 48 y Perú 24, pero en la semifinal de la Copa América 2019 Perú le goleó 3-0', '¡Te gano 48 a 24!', '¡Y te metí tres en la semi!'),
	F('URY', SA, 'LA CELESTE', 'Uruguay le ha ganado 39 de 71. Pero en 1939 Perú le ganó 2-1 en Lima y levantó su primera Copa América', '¡Te gano 39 a 16!', '¡La Copa del 39 fue mía!'),
	F('COL', SA, 'LOS CAFETEROS', 'Casi empate: 17 victorias de Perú, 24 empates y 22 de Colombia. Perú le ganó la final de la Copa América 1975 (1-0 en Caracas)', '¡Te gano 22 a 17!', '¡La final del 75 fue mía!'),
	F('PRY', SA, 'LA ALBIRROJA', '59 partidos: Paraguay gana 24 y Perú 18. En la Copa América 1939, Perú le ganó 3-0 camino del título', '¡Te gano 24 a 18!', '¡En el 39 te metí tres!'),
	F('ECU', SA, 'LA TRI', 'Perú le gana 21 a 17 en 54 partidos. En la Copa América 1939 se estrenó con un 5-2 a Ecuador', '¡Cada vez estoy más cerca!', '¡Te gano 21 a 17!'),
	F('BOL', SA, 'LA VERDE', 'Perú le ha ganado 26 de 53. En marzo de 2025 ganó 3-1 en Lima con goles de Polo, Guerrero y Flores', '¡En La Paz te gané 2-0!', '¡Pero te gano 26 a 15!'),
	G(SA, 'EL ÚLTIMO DE SUDAMÉRICA', ['VEN'], '¡A Venezuela le gano 23 a 9!'),
	F('MEX', NA, 'EL TRI', '30 partidos: México gana 12, Perú 9 y empatan 9. El último, 1-1 en septiembre de 2026', '¡Te gano 12 a 9!', '¡Este año empatamos!'),
	F('USA', NA, 'EL ANFITRIÓN', 'Estados Unidos le ha ganado 4 de 8. El último, 4-1 en Orlando en septiembre de 2026', '¡4-1 en Orlando!', '¡Y yo te he ganado dos!'),
	G(NA, 'NORTE Y CENTROAMÉRICA', ['CAN', 'CRI', 'PAN', 'HND', 'SLV', 'GTM', 'NIC'], 'Canadá me gana y Honduras empata'),
	G(NA, 'EL CARIBE', ['HTI', 'JAM', 'TTO', 'DOM'], '¡El Caribe es todo verde!'),
	{kind: 'cta', region: EU, left: 'Ahora, Europa'},
	F('ESP', EU, 'LA CAMPEONA DEL MUNDO', '4 partidos, 4 derrotas. La última, 1-3 en Puebla (México) en junio de 2026, días antes del Mundial', '¡4 de 4!', '¡Ese gol te lo metí yo!'),
	F('DEU', EU, 'LA MÁQUINA', 'Mundial 1970: Gerd Müller le marcó tres goles en 20 minutos (3-1). Perú nunca le ha ganado: 0 de 3', '¡Müller te metió tres!', '¡Y Cubillas te marcó uno!'),
	F('NLD', EU, 'LA NARANJA', '4 partidos sin ganarle: 3 derrotas y el 0-0 del Mundial 1978 en Mendoza', '¡Nunca me has ganado!', '¡En el 78 no me ganaste!'),
	F('ITA', EU, 'LA AZZURRA', 'Solo un partido: 1-1 en el Mundial 1982, en Vigo. Italia acabó siendo campeona del mundo', '¡Fui campeona en el 82!', '¡Y conmigo empataste!'),
	F('POL', EU, 'LOS POLACOS', '3 partidos, 3 derrotas. En el Mundial 1982 le metió un 5-1 en A Coruña', '¡Te metí cinco en España!', 'Eso fue hace mucho...'),
	F('RUS', EU, 'EL GIGANTE', '4 partidos: 2 derrotas y 2 empates. El último, 1-1 en San Petersburgo en noviembre de 2025', '¡Nunca me has ganado!', '¡Pero tampoco me goleas!'),
	F('FRA', EU, 'LES BLEUS', 'Empate técnico: Perú le ganó 1-0 en París en 1982 y Francia le ganó 1-0 en el Mundial 2018', '¡Te gané en el Mundial!', '¡Y yo en tu casa!'),
	F('ENG', EU, 'LOS INVENTORES', 'En 1959 Perú le goleó 4-1 en Lima. En 1962, también en Lima, Inglaterra se vengó: 0-4', '¡Te metí cuatro en el 62!', '¡Y yo a ti en el 59!'),
	F('SCT', EU, 'LOS ESCOCESES', 'Mundial 1978: Perú remontó y ganó 3-1 en Córdoba con dos goles de Cubillas', '¡Te marqué primero!', '¡Y Cubillas te metió dos!'),
	F('BGR', EU, 'LOS LEONES', 'Mundial 1970: Bulgaria ganaba 0-2 y Perú remontó en 23 minutos para ganar 3-2', '¡Yo también te he ganado dos!', '¡En México te remonté!'),
	G(EU, 'LOS QUE NUNCA HA PODIDO GANAR', ['BEL', 'CZE', 'CHE', 'BLR', 'SWE', 'DNK'], '¡Seis europeos que nunca he ganado!'),
	G(EU, 'EL RESTO DE EUROPA', ['ROU', 'HUN', 'SVK', 'HRV', 'ISL', 'ARM'], 'Rumanía me ganó en mi primer Mundial'),
	{kind: 'cta', region: AS, left: 'Quedan Asia, Oceanía y África'},
	F('AUS', AS, 'LOS SOCCEROOS', 'Mundial 2018: Perú le ganó 2-0. En 2022, Australia le quitó el Mundial de Catar en los penaltis (0-0)', '¡Te quité Catar 2022!', '¡Y yo te gané en Rusia!'),
	F('JPN', AS, 'LOS SAMURÁIS', '8 partidos: 3 victorias de Perú, 3 empates y 2 de Japón. La última, 4-1 para Japón en 2023', '¡4-1 en 2023!', '¡Y aun así te gano 3 a 2!'),
	F('IRN', AS, 'LOS PERSAS', 'Solo un partido: Mundial 1978, 4-1 para Perú con tres goles de Teófilo Cubillas', '¡Solo hemos jugado una vez!', '¡Y Cubillas te metió tres!'),
	G(AS, 'ASIA Y OCEANÍA', ['KOR', 'CHN', 'IND', 'NZL'], 'Con China estoy empatado'),
	G(AS, 'ORIENTE MEDIO', ['SAU', 'QAT', 'IRQ', 'ARE'], 'A Emiratos no le he podido ganar'),
	G(AF, 'ÁFRICA', ['MAR', 'NGA', 'SEN', 'DZA', 'CMR', 'TUN'], 'Argelia, Camerún y Túnez se me resisten'),
];
