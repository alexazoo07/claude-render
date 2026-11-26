import opp from './opp.json';

// From Ecuador's point of view. Internal keys: PAN = nunca le ganó, MIE = bestia negra, RES = igualados, SIN = dominado
export type Cat = 'PAN' | 'MIE' | 'RES' | 'SIN';
// ow = rival wins (Ecuador losses), ol = rival losses (Ecuador wins)
export type Opp = {n: string; flag: string; p: number; ow: number; d: number; ol: number; gf: number; ga: number; first: string; last: [number, number, string, string]; cat: Cat};
export const OPP = opp as unknown as Record<string, Opp>;

export const CAT_COL: Record<Cat, string> = {PAN: '#E8394A', MIE: '#FF9B21', RES: '#9B5DE5', SIN: '#3DB86B'};
export const CAT_DARK: Record<Cat, string> = {PAN: '#A61E2D', MIE: '#C46A00', RES: '#6232A8', SIN: '#1F7E43'};
export const CAT_NAME: Record<Cat, string> = {PAN: 'NUNCA LE GANÓ', MIE: 'BESTIA NEGRA', RES: 'IGUALADOS', SIN: 'DOMINADO'};
export const CAT_SHORT: Record<Cat, string> = {PAN: 'NUNCA', MIE: 'BESTIA NEGRA', RES: 'IGUALADOS', SIN: 'DOMINADO'};
export const CAT_STAMP: Record<Cat, string> = {PAN: '¡NUNCA LE HA GANADO!', MIE: '¡BESTIA NEGRA!', RES: '¡EMPATE TÉCNICO!', SIN: '¡DOMINADO!'};
export const CAT_RULE: Record<Cat, string> = {
	PAN: 'Ecuador nunca le ha ganado',
	MIE: 'Le ha ganado más veces a Ecuador',
	RES: 'Mismas victorias que derrotas',
	SIN: 'Ecuador le gana más veces',
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

Object.assign(NAME, {PRK: 'Corea del Norte', BIH: 'Bosnia', UKR: 'Ucrania', DOM: 'R. Dominicana', CUB: 'Cuba', JAM: 'Jamaica', GTM: 'Guatemala', BFA: 'Burkina Faso', COD: 'RD Congo', CMR: 'Camerún', GHA: 'Ghana', QAT: 'Catar', ARE: 'Emiratos Árabes'});

Object.assign(NAME, {CUW: 'Curazao', TTO: 'Trinidad y Tobago', SEN: 'Senegal', OMN: 'Omán', KWT: 'Kuwait', JOR: 'Jordania', LBN: 'Líbano', UGA: 'Uganda', ZMB: 'Zambia', NGA: 'Nigeria', CPV: 'Cabo Verde', MAR: 'Marruecos', IRQ: 'Irak', SAU: 'Arabia Saudí', NZL: 'Nueva Zelanda', AUS: 'Australia', IRN: 'Irán', ROU: 'Rumanía', BGR: 'Bulgaria', EST: 'Estonia', SWE: 'Suecia', FIN: 'Finlandia', ARM: 'Armenia', TUR: 'Turquía', SRB: 'Serbia', BLR: 'Bielorrusia', MKD: 'Macedonia del Norte', GRC: 'Grecia', SCT: 'Escocia', IRL: 'Irlanda', HRV: 'Croacia', CHE: 'Suiza', CIV: 'Costa de Marfil', ZAF: 'Sudáfrica', CHL: 'Chile'});

export const SCRIPT: Entry[] = [
	F('ARG', SA, 'LA ALBICELESTE', 'Argentina gana 24 a 6. Su peor día: 12-0 en la Copa América de 1942. Pero en 2015 Ecuador ganó por primera vez en Buenos Aires (0-2)', '¡Te metí doce en el 42!', '¡Y yo te gané en tu casa!'),
	F('BRA', SA, 'LA PENTACAMPEONA', 'Solo 2 victorias en 36 partidos, las dos en Quito y por 1-0: en 2001 y en 2004', '¡Te gano 27 a 2!', '¡En Quito te tumbé dos veces!'),
	F('URY', SA, 'LA CELESTE', 'Uruguay gana 31 a 8. Siete de las ocho victorias de Ecuador fueron en Quito', '¡Te gano 31 a 8!', '¡En la altura mando yo!'),
	F('COL', SA, 'LOS CAFETEROS', 'Colombia gana 23 a 14. Pero en noviembre de 2020 Ecuador le metió un 6-1 en Quito', '¡Te gano 23 a 14!', '¡Y en 2020 te metí seis!'),
	F('PER', SA, 'LA BLANQUIRROJA', 'Su rival más repetido: 54 partidos. Perú gana 21 a 17, pero en 1975 Ecuador le metió un 6-0 en Quito', '¡Te gano 21 a 17!', '¡En el 75 te metí seis!'),
	F('CHL', SA, 'LA ROJA', 'Chile gana 29 a 12. En la Copa América de 1955 le ganó 7-1 en Santiago', '¡Te metí siete en el 55!', '¡En 2023 te gané en Quito!'),
	F('PRY', SA, 'LA ALBIRROJA', 'Paraguay gana 22 a 12. En la Copa América de 1993, en Quito, Ecuador le ganó 3-0', '¡Te gano 22 a 12!', '¡En el 93 te metí tres!'),
	F('BOL', SA, 'LA VERDE', 'Ecuador gana 21 de 39. En noviembre de 2024 le metió un 4-0 en Guayaquil', '¡En La Paz sufres!', '¡Y te gano 21 a 6!'),
	F('VEN', SA, 'LA VINOTINTO', 'Ecuador gana 16 a 11. En su Copa América de 1993 le metió un 6-1 en Quito', '¡En 2024 te gané!', '¡Y yo te metí seis!'),
	F('MEX', NA, 'EL TRI', 'México gana 15 a 4 y lo eliminó del Mundial 2026: 2-0 en los dieciseisavos, en Ciudad de México', '¡Te eché de mi Mundial!', '¡En la Copa 2015 te gané!'),
	F('USA', NA, 'EL ANFITRIÓN', 'Ecuador gana 5 a 4. En la Copa América de 1993, en Quito, le ganó 2-0', '¡En 2016 te eliminé!', '¡Y te gano 5 a 4!'),
	F('CRI', NA, 'LOS TICOS', 'Costa Rica solo le ha ganado 1 de 13. En el Mundial 2006, en Hamburgo, Ecuador le ganó 3-0', '¡Te gané una vez!', '¡Y yo siete!'),
	F('HND', NA, 'LA CATRACHA', 'Ecuador gana 7 a 2. En el Mundial 2014, en Curitiba, ganó 2-1 con doblete de Enner Valencia', '¡Solo me ganas 7 a 2!', '¡Enner te metió dos!'),
	G(NA, 'NORTE, CENTROAMÉRICA Y CARIBE', ['CAN', 'GTM', 'SLV', 'PAN', 'HTI', 'JAM', 'TTO', 'CUB', 'CUW'], '¡A Panamá y El Salvador les metí cinco!'),
	{kind: 'cta', region: EU, left: 'Ahora, Europa'},
	F('ESP', EU, 'LA CAMPEONA DEL MUNDO', 'Nunca le ha ganado: 4-0 en Madrid en 2003 y 0-2 en Guayaquil en 2013', '¡Dos de dos para mí!', '¡La próxima es mía!'),
	F('ITA', EU, 'LA AZZURRA', 'Nunca le ha ganado. En el Mundial 2002 Italia ganó 2-0 con doblete de Vieri', '¡Nunca me has ganado!', '¡En 2005 te empaté!'),
	F('ENG', EU, 'LOS INVENTORES', 'Nunca le ha ganado. En los octavos del Mundial 2006, una falta de Beckham lo eliminó (1-0)', '¡Te eliminé en 2006!', '¡En 2014 te empaté 2-2!'),
	F('FRA', EU, 'LES BLEUS', 'Nunca le ha ganado: 2-0 en 2008 y 0-0 en el Mundial 2014, en el Maracaná', '¡Nunca me has ganado!', '¡En el Maracaná te frené!'),
	F('NLD', EU, 'LA NARANJA', 'Cuatro partidos y ninguna victoria. En el Mundial 2022 empató 1-1 con gol de Enner Valencia', '¡Nunca me has ganado!', '¡Te he empatado tres veces!'),
	F('DEU', EU, 'LA MÁQUINA', 'Mundial 2026: Ecuador remontó y ganó 2-1 en Nueva Jersey con goles de Angulo y Plata. ¡La primera vez!', '¡Te gané en 2006 y 2013!', '¡Y yo en el Mundial 2026!'),
	F('PRT', EU, 'LA DE CRISTIANO', 'Igualados: 0-3 en 1972 y 3-2 para Ecuador en Guimarães, en 2013', '¡Te gané en el 72!', '¡Y yo en tu casa!'),
	F('HRV', EU, 'LOS AJEDREZADOS', 'Solo un partido: Mundial 2002, en Yokohama. Ganó 1-0 con gol de Édison Méndez', '¡Solo nos vimos una vez!', '¡Y aquel día gané yo!'),
	F('POL', EU, 'LAS ÁGUILAS', 'Igualados. En el Mundial 2006 Ecuador ganó 2-0 con goles de Tenorio y Delgado', '¡En 2005 te metí tres!', '¡Y yo te gané en el Mundial!'),
	F('CHE', EU, 'LA NATI', 'Solo un partido: Mundial 2014, en Brasilia. Suiza ganó 2-1 con un gol de Seferović en el minuto 93', '¡Te gané en el 93!', '¡Fue en el último minuto!'),
	G(EU, 'LOS QUE NUNCA HA PODIDO GANAR', ['IRL', 'SCT', 'BLR', 'MKD', 'GRC'], '¡Cinco europeos más se me resisten!'),
	G(EU, 'EL RESTO DE EUROPA', ['SRB', 'TUR', 'ROU', 'BGR', 'EST', 'SWE', 'FIN', 'ARM'], '¡A Rumanía y Armenia les metí tres!'),
	{kind: 'cta', region: AS, left: 'Quedan Asia, Oceanía y África'},
	F('JPN', AS, 'LOS SAMURÁIS', 'Cinco partidos sin ganarle. El último, 0-0 en la Kirin Cup de octubre de 2026', '¡Nunca me has ganado!', '¡Pero siempre te empato!'),
	F('KOR', AS, 'LOS GUERREROS TAEGUK', 'Corea gana 2 a 1. En septiembre de 2026 le ganó 3-0 en Suwon', '¡Te metí tres este año!', '¡En el 94 te gané yo!'),
	F('QAT', AS, 'EL ANFITRIÓN DE 2022', 'Partido inaugural del Mundial 2022: Ecuador ganó 2-0 al anfitrión con doblete de Enner Valencia', '¡En 2018 te gané 4-3!', '¡Y yo en tu Mundial!'),
	G(AS, 'ASIA Y OCEANÍA', ['AUS', 'IRN', 'SAU', 'IRQ', 'NZL', 'OMN', 'KWT', 'JOR', 'LBN'], 'Jordania y Líbano se me resisten'),
	F('SEN', AF, 'LOS LEONES', 'Tres partidos, tres derrotas. En el Mundial 2022 Senegal ganó 2-1 y lo eliminó', '¡Tres de tres!', '¡Me la debes de Catar!'),
	F('CIV', AF, 'LOS ELEFANTES', 'Solo un partido: Mundial 2026, en Filadelfia. Costa de Marfil le ganó 1-0 en el debut', '¡Te gané en el debut!', '¡Y aun así pasé de ronda!'),
	G(AF, 'ÁFRICA', ['MAR', 'ZAF', 'NGA', 'ZMB', 'CPV', 'UGA'], '¡A Zambia le metí cuatro!'),
];
