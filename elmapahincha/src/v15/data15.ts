import opp from './opp.json';

// From Brazil's point of view. PAN = never beat Brazil, MIE = beats Brazil < 1 in 4, RES = beats it sometimes, SIN = wins >= losses
export type Cat = 'PAN' | 'MIE' | 'RES' | 'SIN';
// ow = rival wins (Brazil losses), ol = rival losses (Brazil wins)
export type Opp = {n: string; flag: string; p: number; ow: number; d: number; ol: number; gf: number; ga: number; first: string; last: [number, number, string, string]; cat: Cat};
export const OPP = opp as unknown as Record<string, Opp>;

export const CAT_COL: Record<Cat, string> = {PAN: '#E8394A', MIE: '#FF9B21', RES: '#3DB86B', SIN: '#9B5DE5'};
export const CAT_DARK: Record<Cat, string> = {PAN: '#A61E2D', MIE: '#C46A00', RES: '#1F7E43', SIN: '#6232A8'};
export const CAT_NAME: Record<Cat, string> = {PAN: 'PÁNICO', MIE: 'MIEDO', RES: 'RESPETO', SIN: 'SIN MIEDO'};
export const CAT_STAMP: Record<Cat, string> = {PAN: '¡PÁNICO TOTAL!', MIE: '¡LE TIENE MIEDO!', RES: 'RESPETO', SIN: '¡NO LE TEME!'};
export const CAT_RULE: Record<Cat, string> = {
	PAN: 'Nunca le ha ganado a Brasil',
	MIE: 'Le gana menos de 1 de cada 4 partidos',
	RES: 'Le gana a veces, pero pierde más',
	SIN: 'Le gana tantas o más veces de las que pierde',
};

export const NAME: Record<string, string> = {
	ARG: 'Argentina', URY: 'Uruguay', PRY: 'Paraguay', CHL: 'Chile', PER: 'Perú', BOL: 'Bolivia', COL: 'Colombia', ECU: 'Ecuador', VEN: 'Venezuela',
	MEX: 'México', USA: 'Estados Unidos', CAN: 'Canadá', CRI: 'Costa Rica', PAN: 'Panamá', HND: 'Honduras', GTM: 'Guatemala', SLV: 'El Salvador', JAM: 'Jamaica', HTI: 'Haití',
	ENG: 'Inglaterra', SCT: 'Escocia', WLS: 'Gales', IRL: 'Irlanda', NIR: 'Irlanda del Norte', DEU: 'Alemania', FRA: 'Francia', ITA: 'Italia', NLD: 'Países Bajos', ESP: 'España',
	PRT: 'Portugal', CHE: 'Suiza', AUT: 'Austria', POL: 'Polonia', CZE: 'Chequia', SVK: 'Eslovaquia', HUN: 'Hungría', SWE: 'Suecia', DNK: 'Dinamarca', ISL: 'Islandia',
	FIN: 'Finlandia', NOR: 'Noruega', EST: 'Estonia', LVA: 'Letonia', LTU: 'Lituania', UKR: 'Ucrania', RUS: 'Rusia', BEL: 'Bélgica', HRV: 'Croacia', SRB: 'Serbia',
	BIH: 'Bosnia', ROU: 'Rumanía', BGR: 'Bulgaria', AND: 'Andorra', GRC: 'Grecia', TUR: 'Turquía', ISR: 'Israel',
	MAR: 'Marruecos', DZA: 'Argelia', TUN: 'Túnez', EGY: 'Egipto', CMR: 'Camerún', SEN: 'Senegal', NGA: 'Nigeria', GHA: 'Ghana', CIV: 'Costa de Marfil', GIN: 'Guinea',
	GAB: 'Gabón', COD: 'RD Congo', ZMB: 'Zambia', ZWE: 'Zimbabue', TZA: 'Tanzania', ZAF: 'Sudáfrica',
	JPN: 'Japón', KOR: 'Corea del Sur', CHN: 'China', PRK: 'Corea del Norte', HKG: 'Hong Kong', SAU: 'Arabia Saudí', QAT: 'Catar', ARE: 'Emiratos Árabes', IRQ: 'Irak',
	IRN: 'Irán', OMN: 'Omán', IND: 'India', THA: 'Tailandia', MYS: 'Malasia', AUS: 'Australia', NZL: 'Nueva Zelanda',
};

// ------------------------------------------------------------ script
export type Line = {who: 'opp' | 'hero'; text: string};
export type Focus = {kind: 'focus'; k: string; region: string; tab: string; dato: string; lines: Line[]};
export type Group = {kind: 'group'; region: string; title: string; keys: string[]; say: string};
export type Cta = {kind: 'cta'; region: string; left: string};
export type Entry = Focus | Group | Cta;
const F = (k: string, region: string, tab: string, dato: string, opp: string, hero: string): Focus => ({kind: 'focus', k, region, tab, dato, lines: [{who: 'opp', text: opp}, {who: 'hero', text: hero}]});
const G = (region: string, title: string, keys: string[], say: string): Group => ({kind: 'group', region, title, keys, say});
const SA = 'SUDAMÉRICA', NA = 'CONCACAF', EU = 'EUROPA', AF = 'ÁFRICA', AS = 'ASIA Y OCEANÍA';

export const SCRIPT: Entry[] = [
	F('ARG', SA, 'EL ETERNO RIVAL', 'Según la AFA, 111 partidos: 43 victorias de Argentina, 26 empates y 42 de Brasil. Su último golpe: 4-1 en Buenos Aires (marzo de 2025)', '¿Miedo yo? Te gano 43 a 42', 'Pero yo tengo cinco estrellas'),
	F('URY', SA, 'LA CELESTE', 'En 1950 le ganó 2-1 en el Maracaná el partido decisivo del Mundial: el famoso Maracanazo', '¿Te acuerdas del Maracanazo?', 'Hace 76 años de eso...'),
	F('PRY', SA, 'LA ALBIRROJA', 'Le eliminó de las Copas América 2011 y 2015, pero en los penaltis: cuentan como empate. Su última victoria: 1-0 en Asunción (2024)', '¡Te eché de dos Copas América!', 'En penaltis. Y te gané 50 veces'),
	F('CHL', SA, 'LA ROJA', 'No le gana desde 2015 (2-0 en Santiago). Brasil le eliminó en 4 Mundiales: 1962, 1998, 2010 y 2014', '¡En 2015 te gané 2-0!', 'Y yo te eché de 4 Mundiales'),
	F('COL', SA, 'LOS CAFETEROS', 'Su última victoria: 2-1 en Barranquilla (noviembre de 2023) con doblete de Luis Díaz', '¡Luis Díaz te metió dos!', 'Y yo te he ganado 22 veces'),
	G(SA, 'EL RESTO DE SUDAMÉRICA', ['PER', 'BOL', 'ECU', 'VEN'], 'Bolivia me ganó en 2025... a 4.000 metros'),
	F('MEX', NA, 'EL TRI', 'Le ganó la final de la Copa Confederaciones 1999 (4-3), pero en los Mundiales nunca: 4 victorias de Brasil y 1 empate', '¡Te gané la final del 99!', 'En Mundiales nunca me ganaste'),
	G(NA, 'NORTEAMÉRICA', ['USA', 'CAN', 'CRI', 'HND', 'PAN'], 'Solo tres me ganaron... una vez'),
	G(NA, 'CENTROAMÉRICA Y EL CARIBE', ['SLV', 'GTM', 'JAM', 'HTI'], '¡Ninguno me ha ganado nunca!'),
	{kind: 'cta', region: EU, left: 'Ahora, Europa'},
	F('ENG', EU, 'LOS INVENTORES', 'Inglaterra no le gana desde 2013 (2-1 en Wembley). En el Mundial 2002, Ronaldinho la eliminó con un gol de falta', '¡En Wembley te gané!', 'Y Ronaldinho te echó en 2002'),
	G(EU, 'ISLAS BRITÁNICAS', ['WLS', 'IRL', 'NIR'], 'Gales e Irlanda me ganaron una vez'),
	F('SCT', EU, 'LOS ESCOCESES', '11 partidos y nunca le ha ganado: el último, 3-0 en el Mundial 2026 en Miami', '¡En 1974 te saqué un empate!', 'Y llevas 11 sin ganarme'),
	F('DEU', EU, 'LA MÁQUINA', 'Le metió el 7-1 en la semifinal del Mundial 2014... pero Brasil le ganó la final de 2002 (2-0, doblete de Ronaldo)', 'Mineirão, 2014: 7-1', 'Yokohama, 2002: 2-0'),
	F('FRA', EU, 'LES BLEUS', 'Le ganó la final del Mundial 98 (3-0), le eliminó en 2006 y le ganó 2-1 en marzo de 2026', 'Zidane, final del 98: 3-0', 'Aun así te gano 7 a 6'),
	F('ITA', EU, 'LA AZZURRA', 'Brasil le ganó dos finales del Mundial: 1970 (4-1) y 1994 (en penaltis). Italia le eliminó en 1982 con tres goles de Paolo Rossi', '¡Paolo Rossi, 1982!', 'México 70: 4-1 en la final'),
	F('NLD', EU, 'LA NARANJA', 'Le eliminó del Mundial 2010 (2-1) y le ganó 3-0 el partido por el tercer puesto de 2014', '¿Miedo? Te gano 4 a 3', 'Ya caerás, naranjita...'),
	F('ESP', EU, 'LA ROJA', 'Brasil le ganó 3-0 la final de la Copa Confederaciones 2013 en el Maracaná. Su último duelo: 3-3 en el Bernabéu (2024)', '¡Soy la campeona del mundo!', 'Y yo te metí tres en el Maracaná'),
	F('PRT', EU, 'LOS DE CRISTIANO', 'Portugal no le gana desde 2007 (2-0 en Londres). Brasil le ha ganado 14 de 21 partidos', '¡Tengo a Cristiano!', 'Y yo 14 victorias contra ti'),
	G(EU, 'EUROPA CENTRAL', ['CHE', 'AUT', 'POL', 'CZE', 'SVK'], 'Suiza es la que más me ha ganado: 2'),
	F('HUN', EU, 'LOS MAGIARES', 'Le eliminó del Mundial 1954 en la "Batalla de Berna" (4-2) y le volvió a ganar en el Mundial 1966 (3-1)', '¡Te gané en 1954 y en 1966!', 'Hace 60 años... ¡y aún duele!'),
	G(EU, 'LOS NÓRDICOS', ['SWE', 'DNK', 'ISL', 'FIN'], 'Suecia: 2 victorias en 15 partidos'),
	F('NOR', EU, 'LA PESADILLA', 'Brasil nunca le ha ganado: 4-2 en 1997, 2-1 en el Mundial 98 y 2-1 en los octavos del Mundial 2026', '¡Haaland te echó del Mundial!', 'Noruega... me das escalofríos'),
	G(EU, 'EL BÁLTICO Y EL ESTE', ['EST', 'LVA', 'LTU', 'UKR', 'RUS'], 'Solo Rusia me ganó, en 1980'),
	F('BEL', EU, 'LOS DIABLOS ROJOS', 'Le eliminó en los cuartos del Mundial 2018 (2-1 en Kazán). Brasil se lo cobró en el Mundial 2002 (2-0)', '¡Kazán 2018: 2-1!', 'Y yo te eliminé en 2002'),
	G(EU, 'LOS BALCANES', ['HRV', 'SRB', 'BIH', 'ROU', 'BGR'], '¡Cinco de cinco, en pánico!'),
	G(EU, 'EL MEDITERRÁNEO', ['AND', 'GRC', 'TUR', 'ISR'], '¡Ninguno me ha ganado nunca!'),
	{kind: 'cta', region: AF, left: 'Quedan África, Asia y Oceanía'},
	G(AF, 'EL NORTE DE ÁFRICA', ['MAR', 'DZA', 'TUN', 'EGY'], 'Marruecos me ganó en 2023'),
	F('CMR', AF, 'LOS LEONES', 'En Catar 2022 le ganó 1-0 con un gol de Aboubakar en el minuto 92: el primer africano que ganó a Brasil en un Mundial', '¡Aboubakar, minuto 92!', 'Y luego le expulsaron...'),
	F('SEN', AF, 'LOS LEONES DE TERANGA', 'En 2023 le ganó 4-2 en Lisboa: la primera vez que Brasil encajaba 4 goles desde el 7-1', '¡Te metí cuatro en Lisboa!', 'Y yo te gané en Londres'),
	G(AF, 'ÁFRICA OCCIDENTAL', ['NGA', 'GHA', 'CIV', 'GIN', 'GAB'], '¡Todos en pánico!'),
	G(AF, 'EL SUR DE ÁFRICA', ['COD', 'ZMB', 'ZWE', 'TZA', 'ZAF'], '¡Nueve partidos, nueve victorias!'),
	F('JPN', AS, 'LOS SAMURÁIS', 'Su única victoria: 3-2 en Tokio (octubre de 2025) remontando un 0-2. Brasil se vengó en el Mundial 2026 (2-1)', '¡Te remonté en Tokio!', 'Y yo te eché del Mundial'),
	G(AS, 'EXTREMO ORIENTE', ['KOR', 'CHN', 'PRK', 'HKG'], 'Solo Corea me ganó, en 1999'),
	G(AS, 'ORIENTE MEDIO', ['SAU', 'QAT', 'ARE', 'IRQ', 'IRN', 'OMN'], '¡Seis de seis, en pánico!'),
	G(AS, 'INDIA Y EL SUDESTE ASIÁTICO', ['IND', 'THA', 'MYS'], 'A Tailandia le metí siete'),
	G(AS, 'OCEANÍA', ['AUS', 'NZL'], 'Australia me ganó en 2001'),
];
