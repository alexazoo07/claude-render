import opp from './opp.json';

// From Spain's point of view. PAN = never beat Spain, MIE = beats Spain < 1 in 4, RES = beats it sometimes, SIN = wins >= losses
export type Cat = 'PAN' | 'MIE' | 'RES' | 'SIN';
// ow = rival wins (Spain losses), ol = rival losses (Spain wins)
export type Opp = {n: string; flag: string; p: number; ow: number; d: number; ol: number; gf: number; ga: number; first: string; last: [number, number, string, string]; cat: Cat};
export const OPP = opp as unknown as Record<string, Opp>;

export const CAT_COL: Record<Cat, string> = {PAN: '#E8394A', MIE: '#FF9B21', RES: '#3DB86B', SIN: '#9B5DE5'};
export const CAT_DARK: Record<Cat, string> = {PAN: '#A61E2D', MIE: '#C46A00', RES: '#1F7E43', SIN: '#6232A8'};
export const CAT_NAME: Record<Cat, string> = {PAN: 'PÁNICO', MIE: 'MIEDO', RES: 'RESPETO', SIN: 'SIN MIEDO'};
export const CAT_STAMP: Record<Cat, string> = {PAN: '¡PÁNICO TOTAL!', MIE: '¡LE TIENE MIEDO!', RES: 'RESPETO', SIN: '¡NO LE TEME!'};
export const CAT_RULE: Record<Cat, string> = {
	PAN: 'Nunca le ha ganado a España',
	MIE: 'Le gana menos de 1 de cada 4 partidos',
	RES: 'Le gana a veces, pero pierde más',
	SIN: 'Le gana tantas o más veces de las que pierde',
};

export const NAME: Record<string, string> = {
	ARG: 'Argentina', BRA: 'Brasil', URY: 'Uruguay', PRY: 'Paraguay', CHL: 'Chile', PER: 'Perú', BOL: 'Bolivia', COL: 'Colombia', ECU: 'Ecuador', VEN: 'Venezuela',
	MEX: 'México', USA: 'Estados Unidos', CAN: 'Canadá', CRI: 'Costa Rica', PAN: 'Panamá', HND: 'Honduras', GTM: 'Guatemala', SLV: 'El Salvador', JAM: 'Jamaica', HTI: 'Haití',
	ENG: 'Inglaterra', SCT: 'Escocia', WLS: 'Gales', IRL: 'Irlanda', NIR: 'Irlanda del Norte', DEU: 'Alemania', FRA: 'Francia', ITA: 'Italia', NLD: 'Países Bajos', ESP: 'España',
	PRT: 'Portugal', CHE: 'Suiza', AUT: 'Austria', POL: 'Polonia', CZE: 'Chequia', SVK: 'Eslovaquia', HUN: 'Hungría', SWE: 'Suecia', DNK: 'Dinamarca', ISL: 'Islandia',
	FIN: 'Finlandia', NOR: 'Noruega', EST: 'Estonia', LVA: 'Letonia', LTU: 'Lituania', UKR: 'Ucrania', RUS: 'Rusia', BEL: 'Bélgica', HRV: 'Croacia', SRB: 'Serbia',
	BIH: 'Bosnia', ROU: 'Rumanía', BGR: 'Bulgaria', AND: 'Andorra', GRC: 'Grecia', TUR: 'Turquía', ISR: 'Israel',
	MAR: 'Marruecos', DZA: 'Argelia', TUN: 'Túnez', EGY: 'Egipto', CMR: 'Camerún', SEN: 'Senegal', NGA: 'Nigeria', GHA: 'Ghana', CIV: 'Costa de Marfil', GIN: 'Guinea',
	GAB: 'Gabón', COD: 'RD Congo', ZMB: 'Zambia', ZWE: 'Zimbabue', TZA: 'Tanzania', ZAF: 'Sudáfrica', CPV: 'Cabo Verde', GNQ: 'Guinea Ecuatorial', ALB: 'Albania', MKD: 'Macedonia del Norte', MLT: 'Malta', LIE: 'Liechtenstein', LUX: 'Luxemburgo', SMR: 'San Marino', FRO: 'Islas Feroe', ARM: 'Armenia', AZE: 'Azerbaiyán', BLR: 'Bielorrusia', KOS: 'Kosovo', SVN: 'Eslovenia', CYP: 'Chipre', GEO: 'Georgia', JOR: 'Jordania', PYF: 'Tahití',
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
	F('ARG', SA, 'LA ALBICELESTE', 'Argentina le ha ganado 6 de 15. Pero la final del Mundial 2026 fue para España: 1-0 en la prórroga, gol de Ferran Torres', '¡Te he ganado 6 veces!', '¡Y yo la final del Mundial!'),
	F('BRA', SA, 'LA PENTACAMPEONA', 'Brasil le gana 5 a 2 en 10 partidos. El último, un 3-3 en Madrid en marzo de 2024', '¡Te gano 5 a 2!', '¡Algún día te remonto!'),
	F('URY', SA, 'LA CELESTE', 'Uruguay nunca le ha ganado: 5 empates y 6 derrotas. En el Mundial 2026, España ganó 1-0 en Zapopan', '¡Nunca te he ganado...!', '¡Ni lo harás!'),
	F('COL', SA, 'LOS CAFETEROS', 'La última selección que le ganó: 0-1 en Londres en marzo de 2024. Desde entonces, España no ha vuelto a perder', '¡Fui la última en ganarte!', '¡Y desde entonces, nadie!'),
	F('CHL', SA, 'LA ROJA', 'Solo le ha ganado una vez en 11 partidos: el 2-0 del Mundial 2014 en Maracaná, que eliminó a España', '¡Te eché del Mundial 2014!', '¡Una vez en 11 partidos!'),
	G(SA, 'EL RESTO DE SUDAMÉRICA', ['PER', 'PRY', 'ECU', 'BOL', 'VEN'], '¡Ninguno me ha ganado nunca!'),
	F('MEX', NA, 'EL TRI', 'México nunca le ha ganado en 7 partidos. El primero fue en los Juegos Olímpicos de 1928', '¡Te empaté en 2010!', '¡Pero nunca me has ganado!'),
	F('USA', NA, 'EL ANFITRIÓN', 'Le ganó la semifinal de la Copa Confederaciones 2009 (2-0) y cortó la racha de 35 partidos sin perder de España', '¡Te corté la racha en 2009!', '¡Y yo te he ganado 4!'),
	G(NA, 'NORTE Y CENTROAMÉRICA', ['CAN', 'CRI', 'HND', 'PAN', 'SLV', 'HTI'], '¡Ninguno me ha ganado nunca!'),
	{kind: 'cta', region: EU, left: 'Ahora, Europa'},
	F('ENG', EU, 'LOS INVENTORES', 'Inglaterra le gana 13 a 12. Pero España le ganó la final de la Euro 2024 (2-1) y en septiembre de 2026 remontó en Wembley (2-3)', '¡Te gano 13 a 12!', '¡La final de 2024 fue mía!'),
	F('DEU', EU, 'LA MÁQUINA', 'Empate perfecto: 9 victorias, 9 empates y 9 derrotas. España le ganó la final de la Euro 2008 y la semifinal del Mundial 2010', '¡Estamos 9 a 9!', '¡Las finales son mías!'),
	F('NLD', EU, 'LA NARANJA', 'Países Bajos le gana 6 a 5, con un 5-1 en el Mundial 2014. Pero la final del Mundial 2010 fue para España (1-0)', '¡Te metí cinco en 2014!', '¡Iniesta, minuto 116!'),
	F('PRT', EU, 'EL VECINO', 'Su rival más repetido: 43 partidos. Portugal solo le ha ganado 8. En el Mundial 2026, España la eliminó en octavos (1-0)', '¡18 empates!', '¡Y te eché del Mundial!'),
	F('ITA', EU, 'LA AZZURRA', 'Italia le ha ganado 11 de 41. La final de la Euro 2012 fue 4-0 para España', '¡Te he ganado 11 veces!', '¡4-0 en la final de 2012!'),
	F('FRA', EU, 'LES BLEUS', 'Francia le ha ganado 13 de 39. En la semifinal del Mundial 2026, España ganó 2-0', '¡Te he ganado 13 veces!', '¡La semifinal fue mía!'),
	F('BEL', EU, 'LOS DIABLOS ROJOS', 'Bélgica le ha ganado 5 de 23. En los cuartos del Mundial 2026, España ganó 2-1', '¡Te he ganado 5 veces!', '¡Y yo te eché en cuartos!'),
	F('CHE', EU, 'LOS SUIZOS', 'Solo 2 victorias en 27 partidos. Una, el 1-0 del estreno del Mundial 2010... que acabó ganando España', '¡Te gané en Sudáfrica!', '¡Y yo gané el Mundial!'),
	F('SCT', EU, 'LOS ESCOCESES', 'Escocia le ganó 2-0 en Glasgow en marzo de 2023: la última derrota de España en partido oficial', '¡Te gané en Glasgow!', '¡Te gano 7 a 4!'),
	F('IRL', EU, 'LOS IRLANDESES', 'Irlanda le ha ganado 4 de 26. En la Euro 2012, España ganó 4-0 en Gdansk', '¡Te he ganado 4 veces!', '¡Y yo 15!'),
	G(EU, 'LAS ISLAS Y EL NORTE', ['NIR', 'WLS', 'DNK', 'SWE', 'NOR', 'ISL', 'FIN'], 'Todos me han ganado alguna vez... pero poco'),
	G(EU, 'EL CENTRO Y EL ESTE', ['AUT', 'HUN', 'POL', 'SVK', 'UKR', 'RUS', 'ROU'], 'Rumanía es la que más se me resiste'),
	G(EU, 'LOS BALCANES Y EL ESTE', ['HRV', 'GRC', 'TUR', 'CYP', 'GEO'], 'Croacia me ha ganado tres veces'),
	G(EU, 'NUNCA LE HAN GANADO', ['CZE', 'SRB', 'BIH', 'BGR', 'ALB', 'MKD', 'ISR', 'SVN', 'LTU', 'LVA', 'EST'], '¡Once europeos sin ganarme!'),
	G(EU, 'LOS PEQUEÑOS DE EUROPA', ['MLT', 'LIE', 'LUX', 'AND', 'SMR', 'FRO', 'ARM', 'AZE', 'BLR', 'KOS'], '¡A Liechtenstein le metí ocho!'),
	{kind: 'cta', region: AF, left: 'Quedan África, Asia y Oceanía'},
	F('MAR', AF, 'LOS LEONES DEL ATLAS', 'Nunca le ha ganado en el tiempo de juego... pero en el Mundial 2022 la eliminó en los penaltis (0-0)', '¡Te eché en Catar!', '¡Los penaltis no cuentan!'),
	F('NGA', AF, 'LAS SÚPER ÁGUILAS', 'Mundial 1998: Nigeria le ganó 3-2 y España cayó en la primera fase. En la Confederaciones 2013, España ganó 3-0', '¡Te eché del Mundial 98!', '¡Y yo te metí tres!'),
	G(AF, 'EL RESTO DE ÁFRICA', ['ZAF', 'EGY', 'TUN', 'DZA', 'CIV', 'GNQ', 'CPV'], 'Sudáfrica me ganó una vez'),
	F('JPN', AS, 'LOS SAMURÁIS', 'Japón le ganó 2-1 en el Mundial 2022 y España solo le ha ganado una vez', '¡Te gané en Catar!', '¡Y yo en 2001!'),
	F('KOR', AS, 'LOS GUERREROS', 'Nunca le ha ganado, pero en el Mundial 2002 la eliminó en los penaltis tras un 0-0', '¡Te eché en 2002!', '¡Pero nunca me has ganado!'),
	G(AS, 'ASIA Y OCEANÍA', ['SAU', 'IRN', 'IRQ', 'JOR', 'CHN', 'AUS', 'NZL', 'PYF'], '¡A Tahití le metí diez!'),
];
