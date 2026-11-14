import opp from './opp.json';

// From Spain's point of view. Internal keys: PAN = nunca le ganó, MIE = bestia negra, RES = igualados, SIN = dominado
export type Cat = 'PAN' | 'MIE' | 'RES' | 'SIN';
// ow = rival wins (Spain losses), ol = rival losses (Spain wins)
export type Opp = {n: string; flag: string; p: number; ow: number; d: number; ol: number; gf: number; ga: number; first: string; last: [number, number, string, string]; cat: Cat};
export const OPP = opp as unknown as Record<string, Opp>;

export const CAT_COL: Record<Cat, string> = {PAN: '#E8394A', MIE: '#FF9B21', RES: '#9B5DE5', SIN: '#3DB86B'};
export const CAT_DARK: Record<Cat, string> = {PAN: '#A61E2D', MIE: '#C46A00', RES: '#6232A8', SIN: '#1F7E43'};
export const CAT_NAME: Record<Cat, string> = {PAN: 'NUNCA LE GANÓ', MIE: 'BESTIA NEGRA', RES: 'IGUALADOS', SIN: 'DOMINADO'};
export const CAT_SHORT: Record<Cat, string> = {PAN: 'NUNCA', MIE: 'BESTIA NEGRA', RES: 'IGUALADOS', SIN: 'DOMINADO'};
export const CAT_STAMP: Record<Cat, string> = {PAN: '¡NUNCA LE HA GANADO!', MIE: '¡BESTIA NEGRA!', RES: '¡EMPATE TÉCNICO!', SIN: '¡DOMINADO!'};
export const CAT_RULE: Record<Cat, string> = {
	PAN: 'España nunca le ha ganado',
	MIE: 'Le ha ganado más veces a España',
	RES: 'Mismas victorias que derrotas',
	SIN: 'España le gana más veces',
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

export const SCRIPT: Entry[] = [
	F('BRA', SA, 'LA PENTACAMPEONA', 'Le metió un 6-1 en el Mundial 1950 y un 3-0 en la final de la Copa Confederaciones 2013', '¡Te gano 5 a 2!', 'Pero el campeón del mundo soy yo'),
	F('ARG', SA, 'LA ALBICELESTE', 'España le ganó la final del Mundial 2026 (1-0 en la prórroga) y un 6-1 en un amistoso de 2018', '¡En 2010 te metí un 4-1!', 'Y yo te gané la final de 2026'),
	F('URY', SA, 'LA CELESTE', 'Uruguay nunca le ha ganado a España: 6 victorias españolas y 5 empates', '¡Yo tengo dos Mundiales!', 'Pero a mí nunca me ganaste'),
	F('COL', SA, 'LOS CAFETEROS', 'Su única victoria fue un 1-0 en un amistoso jugado en Londres en 2024', '¡La última vez gané yo!', 'Y yo te gané en 2011'),
	F('CHL', SA, 'LA ROJA DE CHILE', 'Su única victoria: 2-0 en el Maracaná en el Mundial 2014, que eliminó al campeón', '¡Te eché del Mundial 2014!', 'Y yo te gané las otras 8 veces'),
	G(SA, 'EL RESTO DE SUDAMÉRICA', ['PRY', 'PER', 'VEN', 'ECU', 'BOL'], '¡Ninguno me ha ganado nunca!'),
	F('MEX', NA, 'EL TRI', 'México nunca le ha ganado: 4 victorias de España y 3 empates desde 1928', '¡Algún día te ganaré!', 'Llevas desde 1928 intentándolo'),
	G(NA, 'NORTEAMÉRICA', ['USA', 'CAN', 'CRI', 'HND'], 'Solo EE. UU. me ganó, en 2009'),
	G(NA, 'CENTROAMÉRICA Y EL CARIBE', ['PAN', 'SLV', 'HTI', 'PRI'], 'Cuatro partidos, cuatro victorias'),
	{kind: 'cta', region: EU, left: 'Ahora, Europa'},
	F('PRT', EU, 'EL VECINO', 'Con 18 empates, es la selección contra la que España más ha empatado', '¡En 2010 te metí cuatro!', 'Y yo te gané en el Mundial 2026'),
	F('FRA', EU, 'LES BLEUS', 'España le ganó 2-0 en la semifinal del Mundial 2026', '¡Te gané la Nations League 2021!', 'Y yo la semifinal del Mundial'),
	F('ITA', EU, 'LA AZZURRA', 'En la final de la Euro 2012, España le ganó 4-0', '¡Te eliminé en la Euro 2016!', 'Y yo te metí cuatro en 2012'),
	G(EU, 'LOS PEQUEÑOS', ['AND', 'SMR', 'MLT', 'FRO', 'CYP'], 'Solo Chipre me ganó, en 1998'),
	F('ENG', EU, 'LOS INVENTORES', 'España ganó la final de la Euro 2024 (2-1) y en septiembre de 2026 (3-2), pero Inglaterra aún manda: 13 a 12', '¡Todavía te gano 13 a 12!', 'Pues la final de 2024 fue mía'),
	G(EU, 'ISLAS BRITÁNICAS', ['IRL', 'NIR', 'WLS'], 'Los tres me han ganado alguna vez'),
	F('SCT', EU, 'LOS ESCOCESES', 'Le ganó 2-0 en Glasgow en marzo de 2023, pero España se vengó en Sevilla con otro 2-0', '¡Hampden 2023 fue mío!', 'Y en Sevilla te devolví el 2-0'),
	F('NLD', EU, 'LA NARANJA', 'Le metió un 5-1 en el Mundial 2014... pero España le ganó la final de 2010', '¡Acuérdate del 5-1!', 'Y tú de Iniesta en 2010'),
	G(EU, 'EL CENTRO DE EUROPA', ['CHE', 'AUT', 'BEL', 'LUX', 'LIE'], 'Suiza me ganó en 2010... y aun así fui campeón'),
	F('DEU', EU, 'LA MÁQUINA', '9 victorias, 9 empates y 9 derrotas: el empate perfecto', '¡Estamos 9 a 9!', 'La final de la Euro 2008 fue mía'),
	G(EU, 'ESCANDINAVIA', ['DNK', 'SWE', 'NOR', 'ISL', 'FIN'], 'Suecia es la que más me ha ganado: 4 veces'),
	G(EU, 'EL BÁLTICO Y EL ESTE', ['EST', 'LVA', 'LTU', 'BLR', 'UKR', 'RUS'], 'Rusia me eliminó en 2018... en penaltis'),
	G(EU, 'EUROPA CENTRAL', ['POL', 'CZE', 'SVK', 'HUN', 'ROU', 'BGR'], 'Rumanía es la que más me ha ganado: 5 veces'),
	F('HRV', EU, 'LOS AJEDRECISTAS', 'Le ganó 3 veces (1994, 2016 y 2018), pero desde 2021 España le ha ganado 4 veces', '¡Te gané en la Euro 2016!', 'Y yo 4 veces desde 2021'),
	G(EU, 'LOS BALCANES', ['SRB', 'BIH', 'SVN', 'MKD'], '¡Ninguno me ha ganado nunca!'),
	G(EU, 'EL SUR DE LOS BALCANES', ['ALB', 'KOS', 'GRC'], 'Solo Grecia me ganó, en 2003'),
	G(EU, 'DE TURQUÍA AL CÁUCASO', ['TUR', 'GEO', 'ARM', 'AZE', 'ISR'], 'Georgia me ganó en 2016... en Getafe'),
	{kind: 'cta', region: AS, left: 'Quedan Asia, Oceanía y África'},
	F('JPN', AS, 'LOS SAMURÁIS', 'En Catar 2022 Japón le ganó 2-1 con un gol que parecía fuera por milímetros', '¡Catar 2022: 2-1!', 'Y en 2001 te gané yo'),
	G(AS, 'ASIA', ['KOR', 'CHN', 'SAU', 'IRN', 'IRQ', 'JOR'], 'Ninguno me ha ganado nunca'),
	G(AS, 'OCEANÍA', ['AUS', 'NZL', 'PYF'], 'A Tahití le metí un 10-0 en 2013'),
	G(AF, 'EL NORTE DE ÁFRICA', ['MAR', 'DZA', 'TUN', 'EGY'], 'Marruecos me eliminó en 2022... en penaltis'),
	F('NGA', AF, 'LAS SÚPER ÁGUILAS', 'En el Mundial 98 Nigeria le ganó 3-2 en el debut; España se vengó en 2013 (3-0)', '¡Mundial 98: 3-2!', 'Confederaciones 2013: 3-0'),
	G(AF, 'EL RESTO DE ÁFRICA', ['ZAF', 'CIV', 'GNQ'], 'Sudáfrica me ganó en 2013'),
	F('CPV', AF, 'LA ÚNICA', 'Solo se han enfrentado una vez: 0-0 en el debut de España en el Mundial 2026... que luego ganó', '¡Nunca me has ganado!', 'Solo hemos jugado una vez...'),
];
