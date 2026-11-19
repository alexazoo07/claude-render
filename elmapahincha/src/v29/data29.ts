import opp from './opp.json';

// From Colombia's point of view. Internal keys: PAN = nunca le ganó, MIE = bestia negra, RES = igualados, SIN = dominado
export type Cat = 'PAN' | 'MIE' | 'RES' | 'SIN';
// ow = rival wins (Colombia losses), ol = rival losses (Colombia wins)
export type Opp = {n: string; flag: string; p: number; ow: number; d: number; ol: number; gf: number; ga: number; first: string; last: [number, number, string, string]; cat: Cat};
export const OPP = opp as unknown as Record<string, Opp>;

export const CAT_COL: Record<Cat, string> = {PAN: '#E8394A', MIE: '#FF9B21', RES: '#9B5DE5', SIN: '#3DB86B'};
export const CAT_DARK: Record<Cat, string> = {PAN: '#A61E2D', MIE: '#C46A00', RES: '#6232A8', SIN: '#1F7E43'};
export const CAT_NAME: Record<Cat, string> = {PAN: 'NUNCA LE GANÓ', MIE: 'BESTIA NEGRA', RES: 'IGUALADOS', SIN: 'DOMINADO'};
export const CAT_SHORT: Record<Cat, string> = {PAN: 'NUNCA', MIE: 'BESTIA NEGRA', RES: 'IGUALADOS', SIN: 'DOMINADO'};
export const CAT_STAMP: Record<Cat, string> = {PAN: '¡NUNCA LE HA GANADO!', MIE: '¡BESTIA NEGRA!', RES: '¡EMPATE TÉCNICO!', SIN: '¡DOMINADO!'};
export const CAT_RULE: Record<Cat, string> = {
	PAN: 'Colombia nunca le ha ganado',
	MIE: 'Le ha ganado más veces a Colombia',
	RES: 'Mismas victorias que derrotas',
	SIN: 'Colombia le gana más veces',
};

export const NAME: Record<string, string> = {
	BRA: 'Brasil', ARG: 'Argentina', URY: 'Uruguay', COL: 'Colombia', CHL: 'Chile', PRY: 'Paraguay', PER: 'Perú', VEN: 'Venezuela', ECU: 'Ecuador', BOL: 'Bolivia',
	MEX: 'México', USA: 'Estados Unidos', CAN: 'Canadá', CRI: 'Costa Rica', HND: 'Honduras', PAN: 'Panamá', SLV: 'El Salvador', HTI: 'Haití', PRI: 'Puerto Rico',
	PRT: 'Portugal', FRA: 'Francia', ITA: 'Italia', ENG: 'Inglaterra', SCT: 'Escocia', IRL: 'Irlanda', NIR: 'Irlanda del Norte', WLS: 'Gales', NLD: 'Países Bajos', DEU: 'Alemania',
	CHE: 'Suiza', AUT: 'Austria', BEL: 'Bélgica', LUX: 'Luxemburgo', LIE: 'Liechtenstein', AND: 'Andorra', SMR: 'San Marino', MLT: 'Malta', FRO: 'Islas Feroe', CYP: 'Chipre',
	DNK: 'Dinamarca', SWE: 'Suecia', NOR: 'Noruega', ISL: 'Islandia', FIN: 'Finlandia', EST: 'Estonia', LVA: 'Letonia', LTU: 'Lituania', BLR: 'Bielorrusia', UKR: 'Ucrania', RUS: 'Rusia',
	POL: 'Polonia', CZE: 'Chequia', SVK: 'Eslovaquia', HUN: 'Hungría', ROU: 'Rumanía', BGR: 'Bulgaria', HRV: 'Croacia', SRB: 'Serbia', BIH: 'Bosnia', SVN: 'Eslovenia', MKD: 'Macedonia del Norte',
	ALB: 'Albania', KOS: 'Kosovo', GRC: 'Grecia', TUR: 'Turquía', GEO: 'Georgia', ARM: 'Armenia', AZE: 'Azerbaiyán', ISR: 'Israel',
	JPN: 'Japón', KOR: 'Corea del Sur', CHN: 'China', SAU: 'Arabia Saudí', IRN: 'Irán', IRQ: 'Irak', JOR: 'Jordania', AUS: 'Australia', NZL: 'Nueva Zelanda', PYF: 'Tahití',
	MAR: 'Marruecos', DZA: 'Argelia', TUN: 'Túnez', EGY: 'Egipto', NGA: 'Nigeria', ZAF: 'Sudáfrica', CIV: 'Costa de Marfil', GNQ: 'Guinea Ecuatorial', CPV: 'Cabo Verde',
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

Object.assign(NAME, {UZB: 'Uzbekistán', COD: 'RD Congo', GHA: 'Ghana', QAT: 'Catar', ARE: 'Emiratos Árabes', ROU: 'Rumanía', JAM: 'Jamaica', GTM: 'Guatemala', CMR: 'Camerún', SEN: 'Senegal', KOR: 'Corea del Sur'});

export const SCRIPT: Entry[] = [
	F('ARG', SA, 'LA ALBICELESTE', '43 partidos: Argentina gana 21 y Colombia 10. Pero en 1993 Colombia le metió un 5-0 en Buenos Aires', '¡Te gané la final de 2024!', '¡Y yo te metí cinco en tu casa!'),
	F('BRA', SA, 'LA PENTACAMPEONA', '38 partidos y solo 4 victorias. La más recordada: 1-0 en la Copa América 2015', '¡Te gano 22 a 4!', '¡Pero en 2015 te gané!'),
	F('URY', SA, 'LA CELESTE', 'Uruguay gana 21 y Colombia 13. En los octavos del Mundial 2014, James le marcó los dos goles del 2-0', '¡Te gano 21 a 13!', '¡James te eliminó en 2014!'),
	F('CHL', SA, 'LA ROJA', 'Casi igualados: 13 victorias, 18 empates y 15 derrotas. En 2024 Colombia le goleó 4-0 en Barranquilla', '¡Te gano 15 a 13!', '¡Y te metí cuatro en 2024!'),
	F('PER', SA, 'LA BLANQUIRROJA', 'Su rival más repetido: 63 partidos. Colombia gana 22 y Perú 17. El último, 2-0 en octubre de 2026', '¡Te gané la final del 75!', '¡Pero te gano 22 a 17!'),
	F('PRY', SA, 'LA ALBIRROJA', '52 partidos: Colombia gana 23 y Paraguay 19. En la Copa América 2007 Paraguay le metió un 5-0', '¡Te metí cinco en 2007!', '¡Y te gano 23 a 19!'),
	F('ECU', SA, 'LA TRI', 'Colombia le gana 23 a 14. Pero en 2020 Ecuador le goleó 6-1 en las Eliminatorias', '¡Te metí seis en 2020!', '¡Te gano 23 a 14!'),
	F('VEN', SA, 'LA VINOTINTO', 'Colombia le gana 21 a 6. En septiembre de 2025 le ganó 6-3 en las Eliminatorias', '¡Te metí tres goles!', '¡Y yo seis!'),
	F('BOL', SA, 'LA VERDE', 'Colombia le ha ganado 17 de 34. En 2013 le metió un 5-0 en Barranquilla', '¡En La Paz soy otro!', '¡Te gano 17 a 7!'),
	F('MEX', NA, 'EL TRI', 'Empate perfecto: 10 victorias, 10 empates y 10 derrotas. Colombia le ganó la final de la Copa América 2001 (1-0)', '¡Estamos 10 a 10!', '¡La Copa del 2001 fue mía!'),
	F('USA', NA, 'LAS BARRAS Y ESTRELLAS', 'Colombia le gana 13 a 3. Pero en el Mundial 94 Estados Unidos le ganó 2-1 en Pasadena', '¡Te eché del Mundial 94!', '¡Y te gano 13 a 3!'),
	F('CRI', NA, 'LOS TICOS', '12 victorias en 15 partidos. En la Copa América 2024 le ganó 3-0', '¡En 2016 te gané!', '¡Te gano 12 a 3!'),
	G(NA, 'NORTE Y CENTROAMÉRICA', ['PAN', 'HND', 'SLV', 'GTM', 'CAN'], '¡A Panamá le metí cinco en 2024!'),
	G(NA, 'EL CARIBE', ['JAM', 'HTI', 'TTO'], '¡El Caribe es todo verde!'),
	{kind: 'cta', region: EU, left: 'Ahora, Europa'},
	F('ENG', EU, 'LOS INVENTORES', '6 partidos sin ganarle: 3 empates y 3 derrotas. En 2018 Inglaterra la eliminó en los penaltis del Mundial', '¡Te eché en los penaltis!', '¡Aquel partido era mío!'),
	F('RUS', EU, 'EL GIGANTE', 'Nunca le ha ganado. Pero en el Mundial 1962 (4-4), Marcos Coll le marcó a Yashin el único gol olímpico de la historia de los Mundiales', '¡Nunca me has ganado!', '¡Le hice un gol olímpico a Yashin!'),
	F('PRT', EU, 'LA DE CRISTIANO', 'Solo un partido: 0-0 en la fase de grupos del Mundial 2026, en Miami', '¡Solo nos vimos una vez!', '¡Y no me ganaste!'),
	F('DEU', EU, 'LA MÁQUINA', '5 partidos: 1 victoria, 2 empates y 2 derrotas. En el Mundial 90 Rincón le empató 1-1 en el último minuto', '¡Te gano 2 a 1!', '¡Rincón te empató en el 90!'),
	F('FRA', EU, 'LES BLEUS', 'Francia gana 4 de 5. La victoria de Colombia: 3-2 en Saint-Denis en 2018, remontando un 0-2', '¡Te gano 4 a 1!', '¡Te remonté en París!'),
	F('ESP', EU, 'LA CAMPEONA DEL MUNDO', 'Empatados: 1 victoria, 2 empates y 1 derrota. En 2024 Colombia le ganó 1-0 en Londres', '¡Soy campeona del mundo!', '¡Y en Londres te gané!'),
	F('CHE', EU, 'LA SUIZA', 'En los octavos del Mundial 2026, Suiza la eliminó en los penaltis tras un 0-0', '¡Te eché del Mundial!', '¡Fue en los penaltis!'),
	G(EU, 'LOS QUE NUNCA HA PODIDO GANAR', ['NLD', 'SWE', 'NOR', 'HUN', 'IRL', 'TUR', 'HRV'], '¡Siete europeos se me resisten!'),
	F('POL', EU, 'LOS POLACOS', 'Mundial 2018 en Kazán: Colombia le ganó 3-0 con goles de Mina, Falcao y Cuadrado', '¡En 1980 te metí cuatro!', '¡Y en Rusia te metí tres!'),
	G(EU, 'EL RESTO DE EUROPA', ['GRC', 'SCT', 'ROU', 'BEL', 'SRB'], '¡A Grecia le metí tres en Brasil!'),
	{kind: 'cta', region: AS, left: 'Quedan Asia, Oceanía y África'},
	F('JPN', AS, 'LOS SAMURÁIS', 'Colombia gana 4 de 6. En el Mundial 2014 le metió un 4-1, pero en 2018 Japón se vengó 2-1', '¡Te gané en Rusia!', '¡Y yo te metí cuatro en Brasil!'),
	F('KOR', AS, 'LOS GUERREROS TAEGUK', '8 partidos y solo una victoria colombiana: 2-1 en Los Ángeles en 2005', '¡Te gano 4 a 1!', '¡Algún día te alcanzo!'),
	G(AS, 'ASIA Y OCEANÍA', ['AUS', 'SAU', 'CHN', 'UZB', 'QAT', 'NZL'], '¡A Uzbekistán le gané en el Mundial!'),
	F('CMR', AF, 'LOS LEONES', 'Mundial 1990: Roger Milla le marcó dos en la prórroga y la eliminó (1-2)', '¡Milla te eliminó!', '¡Y en 2017 te metí cuatro!'),
	F('SEN', AF, 'LOS LEONES DE TERANGA', 'Mundial 2018: un cabezazo de Yerry Mina le dio el 1-0 y el pase a octavos', '¡Nunca te he ganado!', '¡Mina te dejó fuera!'),
	G(AF, 'ÁFRICA', ['CIV', 'GHA', 'COD', 'NGA', 'MAR'], '¡A Ghana le gané en el Mundial!'),
	G(AF, 'LOS QUE SE LE RESISTEN', ['DZA', 'EGY', 'ZAF'], 'Argelia me metió tres en 2019'),
];
