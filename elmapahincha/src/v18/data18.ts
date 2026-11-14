import opp from './opp.json';

// From Uruguay's point of view. Internal keys: PAN = nunca le ganó, MIE = bestia negra, RES = igualados, SIN = dominado
export type Cat = 'PAN' | 'MIE' | 'RES' | 'SIN';
// ow = rival wins (Uruguay losses), ol = rival losses (Uruguay wins)
export type Opp = {n: string; flag: string; p: number; ow: number; d: number; ol: number; gf: number; ga: number; first: string; last: [number, number, string, string]; cat: Cat};
export const OPP = opp as unknown as Record<string, Opp>;

export const CAT_COL: Record<Cat, string> = {PAN: '#E8394A', MIE: '#FF9B21', RES: '#9B5DE5', SIN: '#3DB86B'};
export const CAT_DARK: Record<Cat, string> = {PAN: '#A61E2D', MIE: '#C46A00', RES: '#6232A8', SIN: '#1F7E43'};
export const CAT_NAME: Record<Cat, string> = {PAN: 'NUNCA LE GANÓ', MIE: 'BESTIA NEGRA', RES: 'IGUALADOS', SIN: 'DOMINADO'};
export const CAT_STAMP: Record<Cat, string> = {PAN: '¡NUNCA LE HA GANADO!', MIE: '¡BESTIA NEGRA!', RES: '¡EMPATE TÉCNICO!', SIN: '¡DOMINADO!'};
export const CAT_RULE: Record<Cat, string> = {
	PAN: 'Uruguay nunca le ha ganado',
	MIE: 'Le ha ganado más veces a Uruguay',
	RES: 'Mismas victorias que derrotas',
	SIN: 'Uruguay le gana más veces',
};

export const NAME: Record<string, string> = {
	BRA: 'Brasil', ARG: 'Argentina', URY: 'Uruguay', COL: 'Colombia', CHL: 'Chile', PRY: 'Paraguay', PER: 'Perú', VEN: 'Venezuela', ECU: 'Ecuador', BOL: 'Bolivia',
	MEX: 'México', USA: 'Estados Unidos', CAN: 'Canadá', CRI: 'Costa Rica', HND: 'Honduras', PAN: 'Panamá', GTM: 'Guatemala', NIC: 'Nicaragua', HTI: 'Haití', CUB: 'Cuba',
	DOM: 'R. Dominicana', TTO: 'Trinidad y Tobago', JAM: 'Jamaica',
	PRT: 'Portugal', FRA: 'Francia', ITA: 'Italia', ENG: 'Inglaterra', SCT: 'Escocia', IRL: 'Irlanda', NIR: 'Irlanda del Norte', WLS: 'Gales', NLD: 'Países Bajos', DEU: 'Alemania',
	CHE: 'Suiza', AUT: 'Austria', BEL: 'Bélgica', LUX: 'Luxemburgo', DNK: 'Dinamarca', SWE: 'Suecia', NOR: 'Noruega', FIN: 'Finlandia', EST: 'Estonia', UKR: 'Ucrania', RUS: 'Rusia',
	POL: 'Polonia', CZE: 'Chequia', HUN: 'Hungría', ROU: 'Rumanía', BGR: 'Bulgaria', SRB: 'Serbia', SVN: 'Eslovenia', TUR: 'Turquía', GEO: 'Georgia', ISR: 'Israel', ESP: 'España',
	JPN: 'Japón', KOR: 'Corea del Sur', CHN: 'China', SAU: 'Arabia Saudí', IRN: 'Irán', IRQ: 'Irak', JOR: 'Jordania', UZB: 'Uzbekistán', ARE: 'Emiratos Árabes', OMN: 'Omán',
	IND: 'India', IDN: 'Indonesia', THA: 'Tailandia', SGP: 'Singapur', AUS: 'Australia', NZL: 'Nueva Zelanda', PYF: 'Tahití',
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
	F('ARG', SA, 'EL VECINO DEL PLATA', '183 partidos: es su rival más repetido. Uruguay le ganó la primera final de la historia del Mundial: 4-2 en 1930', '¡Te gano 85 a 54!', 'La primera final fue mía'),
	F('BRA', SA, 'LA PENTACAMPEONA', 'En 1950 Uruguay le ganó el Mundial en el Maracaná (2-1) ante 173.850 personas: el Maracanazo', '¡Te gano 37 a 21!', 'Acuérdate del Maracaná'),
	F('CHL', SA, 'LA ROJA', 'Chile le eliminó en la Copa América 2015 (1-0), pero Uruguay le ha ganado 47 de 84 partidos', '¡Te eché de la Copa 2015!', 'Y yo te he ganado 47 veces'),
	F('PRY', SA, 'LA ALBIRROJA', 'Uruguay le ganó la final de la Copa América 2011 (3-0) en Buenos Aires, su 15.ª Copa', '¡Te he ganado 26 veces!', 'Y yo 33, y una final'),
	G(SA, 'EL RESTO DE SUDAMÉRICA', ['PER', 'COL', 'ECU', 'BOL', 'VEN'], '¡A todos les gano más que pierdo!'),
	F('MEX', NA, 'EL TRI', '24 partidos: 8 victorias, 8 empates y 8 derrotas. El empate perfecto', '¡Estamos 8 a 8!', 'En Sudáfrica 2010 gané yo'),
	F('USA', NA, 'EL ANFITRIÓN', 'En noviembre de 2025 Estados Unidos le metió un 5-1 en Tampa. En la Copa América 2024, Uruguay le eliminó (1-0)', '¡5-1 en Tampa!', 'Y yo te eché de tu Copa'),
	G(NA, 'NORTE Y CENTROAMÉRICA', ['CAN', 'CRI', 'HND', 'GTM', 'PAN', 'NIC'], 'Honduras nunca ha perdido conmigo'),
	G(NA, 'EL CARIBE', ['HTI', 'CUB', 'DOM', 'TTO', 'JAM'], 'Solo Jamaica me ganó, en 2004'),
	{kind: 'cta', region: EU, left: 'Ahora, Europa'},
	F('ESP', EU, 'LA CAMPEONA DEL MUNDO', '11 partidos sin ganarle: 5 empates y 6 derrotas. La última, 0-1 en el Mundial 2026, que dejó fuera a Uruguay', '¡Nunca me has ganado!', '¡Algún día caerás!'),
	F('FRA', EU, 'LES BLEUS', 'En el Mundial 1966 ganó Uruguay (2-1); en los cuartos del Mundial 2018, Francia (2-0)', '¡Te eché en 2018!', 'Y yo te gané en 1966'),
	F('DEU', EU, 'LA MÁQUINA', 'Solo le ha ganado una vez: 4-1 en los Juegos Olímpicos de 1928. Desde entonces, 10 partidos sin ganarle', '¡10 partidos sin ganarme!', 'Lo de 1928 nadie me lo quita'),
	F('ITA', EU, 'LA AZZURRA', 'En Brasil 2014 Uruguay la eliminó del Mundial con un gol de cabeza de Godín (1-0)', '¡Tengo cuatro Mundiales!', 'Y en 2014 te eché yo'),
	F('ENG', EU, 'LOS INVENTORES', 'En Brasil 2014 Luis Suárez le marcó los dos goles del 2-1 a Inglaterra', '¡El fútbol lo inventé yo!', 'Y Suárez te marcó dos'),
	F('PRT', EU, 'LOS LUSOS', 'Cavani le marcó dos goles y la eliminó en Rusia 2018 (2-1); en Catar 2022 Portugal ganó 2-0', '¡Catar 2022: 2-0!', 'Rusia 2018: doblete de Cavani'),
	F('NLD', EU, 'LA NARANJA', 'Le eliminó en la semifinal del Mundial 2010 (3-2), pero Uruguay le ganó en los Juegos de 1924 y 1928', '¡Te eché en la semi de 2010!', 'Y aun así te gano 3 a 2'),
	G(EU, 'LOS QUE NUNCA HA PODIDO GANAR', ['BEL', 'DNK', 'SRB', 'BGR', 'GEO'], '¡Cinco europeos que nunca he ganado!'),
	F('RUS', EU, 'EL GIGANTE', 'Contando la antigua URSS, le ha ganado 6 de 9. En el Mundial 2018, en Rusia, Uruguay ganó 3-0', '¡Te gano 6 a 2!', 'En tu Mundial te metí tres'),
	G(EU, 'EL NORTE DE EUROPA', ['SWE', 'NOR', 'FIN', 'EST'], 'Suecia me ganó en 1970 y en 1974'),
	G(EU, 'LAS ISLAS', ['IRL', 'SCT', 'NIR', 'WLS'], 'Irlanda del Norte me ganó dos veces'),
	G(EU, 'EL CENTRO DE EUROPA', ['AUT', 'CHE', 'LUX', 'HUN', 'POL', 'CZE'], 'Austria es la única que me gana más'),
	G(EU, 'EL ESTE Y EL SUR', ['ROU', 'SVN', 'UKR', 'TUR', 'ISR'], 'Rumanía e Israel me ganaron una vez'),
	{kind: 'cta', region: AS, left: 'Quedan Asia, Oceanía y África'},
	F('JPN', AS, 'LOS SAMURÁIS', 'En septiembre de 2026 Japón le ganó 3-1 en el debut de Diego Forlán como seleccionador', '¡Te arruiné el debut de Forlán!', 'Y en 2014 te gané yo'),
	F('KOR', AS, 'LOS GUERREROS', 'Uruguay le ha ganado 8 de 11 partidos. El último, 4-1 en Seúl en septiembre de 2026', '¡Te gané en 2018!', 'Y yo te metí cuatro este año'),
	G(AS, 'ASIA', ['CHN', 'SAU', 'IRN', 'IRQ', 'JOR', 'UZB'], 'A Irán no le he ganado nunca'),
	G(AS, 'DEL GOLFO AL SUDESTE ASIÁTICO', ['ARE', 'OMN', 'IND', 'IDN', 'THA', 'SGP'], '¡A la India le metí seis este año!'),
	G(AS, 'OCEANÍA', ['AUS', 'NZL', 'PYF'], 'Australia me dejó sin el Mundial 2006'),
	F('GHA', AF, 'LAS ESTRELLAS NEGRAS', 'Cuartos del Mundial 2010: la mano de Suárez y pase en penaltis. En Catar 2022, Uruguay ganó 2-0', '¡La mano de Suárez!', 'Y en 2022 te volví a ganar'),
	G(AF, 'EL NORTE DE ÁFRICA', ['MAR', 'DZA', 'TUN', 'EGY', 'LBY'], 'Argelia y Túnez se me resisten'),
	G(AF, 'EL RESTO DE ÁFRICA', ['SEN', 'CIV', 'NGA', 'ZAF', 'AGO'], 'Senegal y Costa de Marfil, ¡tampoco!'),
	F('CPV', AF, 'LA SORPRESA', 'Solo se han enfrentado una vez: 2-2 en el Mundial 2026. Cabo Verde pasó de ronda y Uruguay se fue a casa', '¡Nunca me has ganado!', 'Solo hemos jugado una vez...'),
];
