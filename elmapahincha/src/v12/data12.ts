import opp from './opp.json';

export type Cat = 'PAN' | 'MIE' | 'RES' | 'SIN';
export type Opp = {n: string; flag: string; p: number; ow: number; d: number; ol: number; gf: number; ga: number; first: string; last: [number, number, string, string]; cat: Cat};
export const OPP = opp as unknown as Record<string, Opp>;

export const CAT_COL: Record<Cat, string> = {PAN: '#E8394A', MIE: '#FF9B21', RES: '#3DB86B', SIN: '#9B5DE5'};
export const CAT_DARK: Record<Cat, string> = {PAN: '#A61E2D', MIE: '#C46A00', RES: '#1F7E43', SIN: '#6232A8'};
export const CAT_NAME: Record<Cat, string> = {PAN: 'PÁNICO', MIE: 'MIEDO', RES: 'RESPETO', SIN: 'SIN MIEDO'};
export const CAT_STAMP: Record<Cat, string> = {PAN: '¡PÁNICO TOTAL!', MIE: '¡LE TIENE MIEDO!', RES: 'RESPETO', SIN: '¡NO LE TEME!'};
export const CAT_RULE: Record<Cat, string> = {
	PAN: 'Nunca le ha ganado a Argentina',
	MIE: 'Le gana menos de 1 de cada 4 partidos',
	RES: 'Le gana a veces, pero pierde más',
	SIN: 'Le gana tantas o más veces de las que pierde',
};

export const NAME: Record<string, string> = {
	URY: 'Uruguay', BRA: 'Brasil', PRY: 'Paraguay', CHL: 'Chile', PER: 'Perú', BOL: 'Bolivia', COL: 'Colombia', ECU: 'Ecuador', VEN: 'Venezuela',
	MEX: 'México', USA: 'Estados Unidos', CAN: 'Canadá', CRI: 'Costa Rica', PAN: 'Panamá', HND: 'Honduras', GTM: 'Guatemala', SLV: 'El Salvador', NIC: 'Nicaragua',
	JAM: 'Jamaica', HTI: 'Haití', TTO: 'Trinidad y Tobago', CUW: 'Curazao', PRI: 'Puerto Rico',
	DEU: 'Alemania', ENG: 'Inglaterra', ITA: 'Italia', ESP: 'España', FRA: 'Francia', RUS: 'Rusia', POL: 'Polonia', NLD: 'Países Bajos', BGR: 'Bulgaria', PRT: 'Portugal',
	CHE: 'Suiza', HUN: 'Hungría', ROU: 'Rumanía', HRV: 'Croacia', BEL: 'Bélgica', IRL: 'Irlanda', SCT: 'Escocia', SRB: 'Serbia', SWE: 'Suecia', AUT: 'Austria',
	BIH: 'Bosnia', NOR: 'Noruega', WLS: 'Gales', DNK: 'Dinamarca', GRC: 'Grecia', ISL: 'Islandia', NIR: 'Irlanda del Norte', LTU: 'Lituania', BLR: 'Bielorrusia',
	ALB: 'Albania', SVN: 'Eslovenia', EST: 'Estonia', ISR: 'Israel',
	NGA: 'Nigeria', ZAF: 'Sudáfrica', EGY: 'Egipto', MAR: 'Marruecos', CMR: 'Camerún', CIV: 'Costa de Marfil', AGO: 'Angola', DZA: 'Argelia', LBY: 'Libia', TUN: 'Túnez',
	GHA: 'Ghana', MRT: 'Mauritania', ZMB: 'Zambia', CPV: 'Cabo Verde', BFA: 'Burkina Faso', BEN: 'Benín',
	JPN: 'Japón', KOR: 'Corea del Sur', SAU: 'Arabia Saudí', IRN: 'Irán', QAT: 'Catar', IND: 'India', CHN: 'China', HKG: 'Hong Kong', SGP: 'Singapur', IRQ: 'Irak',
	ARE: 'Emiratos Árabes', IDN: 'Indonesia', JOR: 'Jordania', AUS: 'Australia',
};

// ------------------------------------------------------------ script
export type Line = {who: 'opp' | 'hero'; text: string};
export type Focus = {kind: 'focus'; k: string; region: string; tab: string; dato: string; lines: Line[]};
export type Group = {kind: 'group'; region: string; title: string; keys: string[]; say: string};
export type Entry = Focus | Group;
const F = (k: string, region: string, tab: string, dato: string, opp: string, hero: string): Focus => ({kind: 'focus', k, region, tab, dato, lines: [{who: 'opp', text: opp}, {who: 'hero', text: hero}]});
const G = (region: string, title: string, keys: string[], say: string): Group => ({kind: 'group', region, title, keys, say});
const SA = 'SUDAMÉRICA', NA = 'CONCACAF', EU = 'EUROPA', AF = 'ÁFRICA', AS = 'ASIA', OC = 'OCEANÍA';

export const SCRIPT: Entry[] = [
	F('URY', SA, 'EL CLÁSICO MÁS VIEJO', 'Se enfrentaron por primera vez en 1902: el primer partido entre selecciones jugado fuera de las islas británicas', '¡Te gané la final del primer Mundial!', 'Y yo te gané 85 partidos...'),
	F('BRA', SA, 'EL GRAN RIVAL', 'Es la única selección de Sudamérica que le ha ganado más veces de las que ha perdido', '¿Miedo yo? Te gano 43 a 41', 'Pero la final del Maracaná 2021 fue mía'),
	F('CHL', SA, 'EL VECINO', 'Le ganó 2 finales de Copa América (2015 y 2016)... pero las dos en penaltis: cuentan como empate', '¡Te gané dos Copas América!', 'En penaltis. Ganarme, solo 6 veces en 91'),
	F('PRY', SA, 'EL VECINO GUARANÍ', 'Su última victoria fue un 2-1 en Asunción, en noviembre de 2024', '¡La última vez te gané yo!', 'Sí... 1 de cada 6 veces'),
	F('PER', SA, 'LOS INCAS', 'No le gana desde 1997: aquel 2-1 en la Copa América de Bolivia', 'Algún día te volveré a ganar...', 'Llevas desde 1997 diciendo eso'),
	F('BOL', SA, 'LA ALTURA', 'Sus 7 victorias fueron todas en La Paz, a más de 3.600 metros de altura: incluido un 6-1 en 2009', '¡Ven a jugar a La Paz!', 'Mejor a nivel del mar, gracias'),
	F('COL', SA, 'LOS CAFETEROS', 'En 1993 le metió un histórico 5-0 en Buenos Aires... y en 2024 perdió la final de la Copa América con Argentina', '¡Acuérdate del 5-0!', 'Y tú de la final de 2024'),
	F('ECU', SA, 'LA TRI', 'Le ganó 1-0 en septiembre de 2025 en Guayaquil, pero solo suma 6 victorias en 42 partidos', '¡Te gané hace nada!', 'Y yo te gané 24 veces'),
	F('VEN', SA, 'LA VINOTINTO', 'Tardó 44 años en ganarle: la primera vez fue en 2011 (1-0)', '¡En 2011 te gané!', 'Tardaste 44 años...'),
	F('MEX', NA, 'EL TRI', 'Argentina lo eliminó en los Mundiales 2006 y 2010 y le ganó 2-0 en Catar 2022', '¡Ya verás en el próximo Mundial!', 'Eso dijiste en 2006, 2010 y 2022'),
	F('USA', NA, 'EL TÍO SAM', 'Su gran día fue un 3-0 en la Copa América de 1995; en 2016 Argentina le ganó 4-0', '¡En 1995 te metí tres!', 'Y en 2016 yo te metí cuatro'),
	G(NA, 'CENTROAMÉRICA', ['CRI', 'PAN', 'HND', 'GTM', 'SLV', 'NIC'], '¡Ninguno me ha ganado nunca!'),
	G(NA, 'EL CARIBE Y CANADÁ', ['CAN', 'JAM', 'HTI', 'TTO', 'CUW', 'PRI'], '¡Seis de seis, todos en pánico!'),
	F('ESP', EU, 'LA ROJA', 'Le ganó la final del Mundial 2026 (1-0) y un 6-1 en un amistoso de 2018', '¡El Mundial 2026 es mío!', 'No me lo recuerdes...'),
	F('PRT', EU, 'LA ERA CRISTIANO', 'Su última victoria fue en 2014 (1-0), con Messi y Cristiano en el campo', '¡Cristiano es el mejor!', 'Y yo te gané 5 de 8'),
	F('FRA', EU, 'LES BLEUS', 'Le ganó 4-3 en Rusia 2018, pero perdió la final de Catar 2022 en los penaltis', '¡El 4-3 de 2018 fue mío!', 'Y la final de 2022, mía'),
	F('ENG', EU, 'LOS INVENTORES', 'Le gana 6 a 4... aunque Argentina le eliminó en la semifinal del Mundial 2026', '¡Te gano 6 a 4 en total!', 'Pero acuérdate de 1986'),
	G(EU, 'ISLAS BRITÁNICAS', ['IRL', 'SCT', 'WLS', 'NIR'], 'Solo Escocia me ha ganado'),
	F('NLD', EU, 'LA NARANJA', 'Argentina solo le ha ganado una vez: la final del Mundial 78', 'Solo me ganaste una vez', 'Sí... pero fue una final'),
	F('DEU', EU, 'LA MÁQUINA', 'Se cruzaron en 3 finales de Mundial: 1986 (Argentina), 1990 y 2014 (Alemania)', '¡2014, Götze, minuto 113!', 'Y yo 1986, con Maradona'),
	G(EU, 'EUROPA CENTRAL', ['CHE', 'AUT', 'HUN', 'POL', 'BEL', 'SVN'], 'Polonia es la que más me ha ganado: 3 veces'),
	G(EU, 'EL NORTE DE EUROPA', ['SWE', 'NOR', 'DNK', 'ISL', 'EST', 'LTU'], 'Los nórdicos no me tienen miedo...'),
	G(EU, 'EUROPA DEL ESTE', ['RUS', 'BLR', 'ROU', 'BGR'], 'Rusia solo me ganó 2 de 13'),
	F('ITA', EU, 'LA AZZURRA', 'Le gana 6 a 5, pero en la Finalissima 2022 Argentina le metió un 3-0 en Wembley', '¡Te sigo ganando 6 a 5!', 'Wembley 2022: 3-0. Fin'),
	F('HRV', EU, 'LOS AJEDRECISTAS', 'En 2018 le metió un 3-0... y en 2022 Argentina le devolvió el 3-0 en semifinales', '¡3-0 en 2018!', '3-0 en 2022. Estamos en paz'),
	G(EU, 'LOS BALCANES', ['SRB', 'BIH', 'ALB', 'GRC'], 'Serbia es la única que me ganó'),
	G(AF, 'EL NORTE DE ÁFRICA', ['MAR', 'DZA', 'TUN', 'LBY', 'EGY', 'MRT'], '¡Todo el norte, en pánico!'),
	F('CMR', AF, 'LOS LEONES', 'En el Mundial 90 le ganó 1-0 al campeón... ¡terminando con 9 jugadores!', '¡Nunca me has ganado!', 'Solo hemos jugado dos veces...'),
	G(AF, 'ÁFRICA OCCIDENTAL', ['NGA', 'GHA', 'CIV', 'BFA', 'BEN', 'CPV'], 'Solo Nigeria se atreve conmigo'),
	G(AF, 'EL SUR DE ÁFRICA', ['ZAF', 'AGO', 'ZMB'], 'Sudáfrica: una victoria para cada uno'),
	G(AS, 'ORIENTE MEDIO', ['ISR', 'IRN', 'IRQ', 'JOR', 'QAT', 'ARE'], 'Solo Israel me ganó una vez'),
	F('SAU', AS, 'EL BATACAZO', 'En Catar 2022 le ganó 2-1 y cortó una racha de 36 partidos sin perder... y Argentina acabó campeona', '¡2-1 en Catar!', 'Y luego gané el Mundial'),
	G(AS, 'INDIA Y EL SUDESTE ASIÁTICO', ['IND', 'SGP', 'IDN'], 'Tres partidos, tres victorias'),
	G(AS, 'EXTREMO ORIENTE', ['JPN', 'KOR', 'CHN', 'HKG'], '¿China me ganó? Fue en 1984...'),
	G(OC, 'OCEANÍA', ['AUS'], 'Australia: 1 victoria en 9 partidos'),
];
