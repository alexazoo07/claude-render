import opp from './opp.json';

// From Estados Unidos's point of view. Internal keys: PAN = nunca le ganó, MIE = bestia negra, RES = igualados, SIN = dominado
export type Cat = 'PAN' | 'MIE' | 'RES' | 'SIN';
// ow = rival wins (Estados Unidos losses), ol = rival losses (Estados Unidos wins)
export type Opp = {n: string; flag: string; p: number; ow: number; d: number; ol: number; gf: number; ga: number; first: string; last: [number, number, string, string]; cat: Cat};
export const OPP = opp as unknown as Record<string, Opp>;

export const CAT_COL: Record<Cat, string> = {PAN: '#E8394A', MIE: '#FF9B21', RES: '#9B5DE5', SIN: '#3DB86B'};
export const CAT_DARK: Record<Cat, string> = {PAN: '#A61E2D', MIE: '#C46A00', RES: '#6232A8', SIN: '#1F7E43'};
export const CAT_NAME: Record<Cat, string> = {PAN: 'NUNCA LE GANÓ', MIE: 'BESTIA NEGRA', RES: 'IGUALADOS', SIN: 'DOMINADO'};
export const CAT_SHORT: Record<Cat, string> = {PAN: 'NUNCA', MIE: 'BESTIA NEGRA', RES: 'IGUALADOS', SIN: 'DOMINADO'};
export const CAT_STAMP: Record<Cat, string> = {PAN: '¡NUNCA LE HA GANADO!', MIE: '¡BESTIA NEGRA!', RES: '¡EMPATE TÉCNICO!', SIN: '¡DOMINADO!'};
export const CAT_RULE: Record<Cat, string> = {
	PAN: 'Estados Unidos nunca le ha ganado',
	MIE: 'Le ha ganado más veces a Estados Unidos',
	RES: 'Mismas victorias que derrotas',
	SIN: 'Estados Unidos le gana más veces',
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

Object.assign(NAME, {TTO: 'Trinidad y Tobago', IDN: 'Indonesia', PRK: 'Corea del Norte', MKD: 'Macedonia del Norte', SVK: 'Eslovaquia', UKR: 'Ucrania', SRB: 'Serbia', CMR: 'Camerún', TUN: 'Túnez', HTI: 'Haití', CUB: 'Cuba', SLV: 'El Salvador', GTM: 'Guatemala', HND: 'Honduras', BIH: 'Bosnia', WLS: 'Gales', NGA: 'Nigeria', DZA: 'Argelia', CIV: 'Costa de Marfil', ZAF: 'Sudáfrica', NZL: 'Nueva Zelanda', CHN: 'China', SAU: 'Arabia Saudí'});

export const SCRIPT: Entry[] = [
	F('MEX', NA, 'EL GRAN RIVAL', '76 partidos: México gana 36 y Estados Unidos 24. Pero en el Mundial 2002 le eliminó en octavos con un histórico 2-0', '¡Te metí cinco en la Copa Oro!', '¡Y yo te eché del Mundial 2002!'),
	F('CAN', NA, 'EL VECINO DEL NORTE', '43 partidos: Estados Unidos gana 19 y Canadá 13. En 1957 Canadá le metió un 5-1 en Toronto', '¡En el 57 te metí cinco!', '¡Y yo te gano 19 a 13!'),
	F('CRI', NA, 'LOS TICOS', 'Estados Unidos gana 20 a 15. En 2016 le metió un 4-0 en la Copa América, pero ese año perdió 4-0 en San José', '¡En 2016 te metí cuatro!', '¡Y yo a ti ese mismo año!'),
	F('JAM', NA, 'LOS REGGAE BOYZ', '34 partidos y solo 3 derrotas. Jamaica le eliminó en las semifinales de la Copa Oro 2015 (2-1)', '¡En 2015 te eché de la Copa Oro!', '¡Y yo te gano 21 a 3!'),
	F('PAN', NA, 'LOS CANALEROS', 'Estados Unidos gana 18 de 29. Pero Panamá le eliminó de su Copa América 2024 con un 2-1 en Atlanta', '¡Te eché de tu Copa América!', '¡Y yo te gano 18 a 4!'),
	F('TTO', NA, 'LA PESADILLA DE 2017', 'Estados Unidos gana 23 de 30. Pero en octubre de 2017 Trinidad le ganó 2-1 en Couva y le dejó sin Mundial 2018', '¡Te dejé sin Mundial!', '¡Y yo te gano 23 a 4!'),
	G(NA, 'CENTROAMÉRICA Y CARIBE', ['HND', 'SLV', 'GTM', 'HTI', 'CUB', 'BLZ', 'NIC'], '¡A El Salvador le metí siete!'),
	F('BRA', SA, 'LA PENTACAMPEONA', '20 partidos y solo una victoria: Copa Oro 1998. En la final de la Confederaciones 2009 ganaba 2-0 y perdió 3-2', '¡Te gano 18 a 1!', '¡Pero en el 98 te gané!'),
	F('ARG', SA, 'LA ALBICELESTE', 'Argentina gana 6 de 10. En los Juegos de 1928 le metió once, pero en la Copa América 1995 Estados Unidos ganó 3-0', '¡En el 28 te metí once!', '¡Y yo tres en la Copa del 95!'),
	F('COL', SA, 'LOS CAFETEROS', 'Colombia gana 13 de 21. Pero en el Mundial 94, en Pasadena, Estados Unidos ganó 2-1', '¡En 2024 te metí cinco!', '¡Y yo te gané en el Mundial 94!'),
	F('URY', SA, 'LA CELESTE', 'Empate perfecto: 3 victorias, 3 empates y 3 derrotas. En noviembre de 2025 le metió un 5-1 en Tampa', '¡Te eché de la Copa América!', '¡Y en 2025 te metí cinco!'),
	F('PRY', SA, 'LA ALBIRROJA', 'Estados Unidos gana 6 de 10. En su Mundial 2026 abrió con un 4-1 a Paraguay en Inglewood', '¡En 2007 te gané 3-1!', '¡Y yo te metí cuatro en el Mundial!'),
	F('CHL', SA, 'LA ROJA', 'Muy igualado: 4 victorias, 3 empates y 5 derrotas. Chile le ganó 5-2 en el Mundial 1950', '¡En el Mundial 50 te metí cinco!', '¡Y yo cuatro este año!'),
	G(SA, 'EL RESTO DE SUDAMÉRICA', ['ECU', 'PER', 'BOL', 'VEN'], '¡A Perú le metí cuatro este año!'),
	{kind: 'cta', region: EU, left: 'Ahora, Europa'},
	F('ENG', EU, 'LOS INVENTORES', 'Inglaterra gana 8 de 12. Pero en el Mundial 1950, en Belo Horizonte, Estados Unidos le ganó 1-0: uno de los mayores batacazos de la historia', '¡En el 64 te metí diez!', '¡Y yo te gané en un Mundial!'),
	F('FRA', EU, 'LES BLEUS', 'Nunca le ha ganado: 1 empate y 3 derrotas. El mejor resultado, un 1-1 en Lyon en 2018', '¡Nunca me has ganado!', '¡En 2018 te empaté!'),
	F('DEU', EU, 'LA MÁQUINA', 'Alemania gana 9 de 13. En los cuartos del Mundial 2002 ganó 1-0', '¡Te eché del Mundial 2002!', '¡Pero te he ganado cuatro!'),
	F('ESP', EU, 'LA CAMPEONA DEL MUNDO', 'España gana 4 de 5. Pero en la semifinal de la Confederaciones 2009, Estados Unidos le ganó 2-0', '¡En 2011 te metí cuatro!', '¡Y yo te eché en 2009!'),
	F('PRT', EU, 'LA DE CRISTIANO', 'Igualados: 2 victorias, 3 empates y 3 derrotas. En el Mundial 2002 Estados Unidos ganó 3-2', '¡Te gané este año 2-0!', '¡Y yo en el Mundial 2002!'),
	F('ITA', EU, 'LA AZZURRA', 'Una sola victoria en 10 partidos: 1-0 en Génova en 2012. En el Mundial de 1934 Italia le metió siete', '¡En el 34 te metí siete!', '¡Y en 2012 te gané en tu casa!'),
	F('NLD', EU, 'LA NARANJA', 'Países Bajos gana 5 de 6 y le eliminó en el Mundial 2022 (3-1). Pero en 2015 Estados Unidos ganó 4-3 en Ámsterdam', '¡Te eché del Mundial 2022!', '¡Y yo te metí cuatro en tu casa!'),
	F('BEL', EU, 'LOS DIABLOS ROJOS', 'Bélgica gana 8 de 9. En el Mundial 2026 le eliminó con un 4-1 en Seattle', '¡Te eché de tu Mundial!', '¡En 1930 te metí tres!'),
	G(EU, 'LOS QUE NUNCA HA PODIDO GANAR', ['HRV', 'UKR', 'DNK', 'GRC', 'MKD', 'SRB', 'SVK'], '¡Siete europeos se me resisten!'),
	G(EU, 'EL RESTO DE EUROPA', ['SCT', 'IRL', 'RUS', 'POL', 'SWE', 'NOR', 'CHE', 'WLS', 'BIH'], '¡A Escocia le metí cinco!'),
	{kind: 'cta', region: AS, left: 'Quedan Asia, Oceanía y África'},
	F('IRN', AS, 'EL PARTIDO MÁS TENSO', 'En el Mundial 98 Irán ganó 2-1 en Lyon. En Catar 2022, Estados Unidos ganó 1-0 y la eliminó', '¡En el 98 te gané!', '¡Y en Catar te eliminé!'),
	F('AUS', AS, 'LOS SOCCEROOS', 'Estados Unidos gana 3 de 5. En su Mundial 2026 le ganó 2-0', '¡En el 92 te gané!', '¡Y yo en el Mundial!'),
	G(AS, 'ASIA Y OCEANÍA', ['JPN', 'KOR', 'CHN', 'SAU', 'NZL'], '¡A China le metí cinco!'),
	G(AS, 'LOS QUE SE LE RESISTEN', ['IDN', 'PRK'], 'Indonesia me metió siete en 1956'),
	F('GHA', AF, 'LAS ESTRELLAS NEGRAS', 'Ghana le eliminó en los Mundiales de 2006 y 2010. En 2014 se vengó: 2-1 en Natal', '¡Te eché de dos Mundiales!', '¡Y en 2014 me vengué!'),
	G(AF, 'ÁFRICA', ['NGA', 'EGY', 'MAR', 'ZAF', 'DZA', 'CIV'], '¡A Argelia le gané en el minuto 91!'),
	G(AF, 'ÁFRICA QUE SE RESISTE', ['TUN', 'CMR'], 'Túnez y Camerún me empataron'),
];
