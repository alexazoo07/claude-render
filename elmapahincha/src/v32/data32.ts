import opp from './opp.json';

// From Argentina's point of view. Internal keys: PAN = nunca le ganó, MIE = bestia negra, RES = igualados, SIN = dominado
export type Cat = 'PAN' | 'MIE' | 'RES' | 'SIN';
// ow = rival wins (Argentina losses), ol = rival losses (Argentina wins)
export type Opp = {n: string; flag: string; p: number; ow: number; d: number; ol: number; gf: number; ga: number; first: string; last: [number, number, string, string]; cat: Cat};
export const OPP = opp as unknown as Record<string, Opp>;

export const CAT_COL: Record<Cat, string> = {PAN: '#E8394A', MIE: '#FF9B21', RES: '#9B5DE5', SIN: '#3DB86B'};
export const CAT_DARK: Record<Cat, string> = {PAN: '#A61E2D', MIE: '#C46A00', RES: '#6232A8', SIN: '#1F7E43'};
export const CAT_NAME: Record<Cat, string> = {PAN: 'CAMPEONA DEL MUNDO', MIE: 'GANARÍA TÍTULOS', RES: 'SIN SU VERDUGO', SIN: 'NI SE ENTERA'};
export const CAT_SHORT: Record<Cat, string> = {PAN: 'MUNDIAL', MIE: 'TÍTULOS', RES: 'SIN VERDUGO', SIN: 'NI SE ENTERA'};
export const CAT_STAMP: Record<Cat, string> = {PAN: '¡CAMPEONA DEL MUNDO!', MIE: '¡GANARÍA TÍTULOS!', RES: '¡SE LIBRA DE SU VERDUGO!', SIN: '¡NI SE ENTERARÍA!'};
export const CAT_RULE: Record<Cat, string> = {
	PAN: 'Ganaría un Mundial que ganó Argentina',
	MIE: 'Heredaría Copas u otros títulos',
	RES: 'Argentina la eliminó de un Mundial',
	SIN: 'Su historia casi no cambiaría',
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

Object.assign(NAME, {CPV: 'Cabo Verde', EGY: 'Egipto', SAU: 'Arabia Saudí', NGA: 'Nigeria', CMR: 'Camerún', HRV: 'Croacia', CHE: 'Suiza', DNK: 'Dinamarca', LTU: 'Lituania', BLR: 'Bielorrusia', NOR: 'Noruega', CHN: 'China', JAM: 'Jamaica', GHA: 'Ghana', SEN: 'Senegal'});

export const SCRIPT: Entry[] = [
	F('BRA', SA, 'LA PENTACAMPEONA', 'Heredaría 9 Copas América: pasaría de 9 a 18 y sería la reina de América. Además, Argentina la eliminó del Mundial 90 (1-0)', '¡Tendría 18 Copas América!', '¡Esas Copas te las gané yo!'),
	F('URY', SA, 'LA CELESTE', 'Su rival más repetido: 184 partidos. Heredaría las Copas de 1927 y 1941 y tendría 17. La final del Mundial 1930 la ganó igualmente (4-2)', '¡Sumaría 17 Copas América!', '¡Y aun así Brasil te pasaría!'),
	F('PRY', SA, 'LA ALBIRROJA', 'Heredaría las Copas de 1929 y 1947 (pasaría de 2 a 4) y el oro olímpico de Atenas 2004, donde perdió la final 1-0', '¡Tendría un oro olímpico!', '¡Tévez te lo quitó en 2004!'),
	F('CHL', SA, 'LA ROJA', 'Le ganó dos finales seguidas de Copa América, en 2015 y 2016. Sin Argentina, también tendría la de 1955: serían 3', '¡Tendría tres Copas América!', '¡Y dos me las ganaste a mí!'),
	F('COL', SA, 'LOS CAFETEROS', 'Perdió la final de la Copa América 2024 (1-0 en la prórroga). Sin Argentina, tendría su segunda Copa', '¡La Copa 2024 sería mía!', '¡Lautaro te dejó sin ella!'),
	F('PER', SA, 'LA BLANQUIRROJA', 'En 1969 dejó a Argentina sin el Mundial de México 70: Perú ya sabe cómo es un Mundial sin Argentina', '¡Yo ya te eché de un Mundial!', '¡Y yo te metí seis en el 78!'),
	G(SA, 'EL RESTO DE SUDAMÉRICA', ['ECU', 'BOL', 'VEN'], '¡A Venezuela le metí once!'),
	F('MEX', NA, 'EL TRI', 'Heredaría la Copa América 1993, que perdió en la final (2-1). Y se libraría de su verdugo: Argentina la eliminó en los Mundiales 2006 y 2010', '¡Tendría una Copa América!', '¡Te eché en 2006 y 2010!'),
	F('USA', NA, 'EL ANFITRIÓN', 'Perdió la semifinal del primer Mundial, en 1930, por 6-1. Sin Argentina, habría jugado la primera final de la historia contra Uruguay', '¡Jugaría la final de 1930!', '¡Te metí seis en esa semi!'),
	G(NA, 'EL RESTO DE CONCACAF', ['CAN', 'CRI', 'HND', 'JAM', 'PAN', 'SLV'], '¡Estos ni se enterarían!'),
	{kind: 'cta', region: EU, left: 'Ahora, Europa'},
	F('NLD', EU, 'LA NARANJA', 'Perdió la final del Mundial 1978 (3-1 en la prórroga). Sin Argentina, sería campeona del mundo. Además, Argentina la eliminó en 2014 y 2022', '¡Tendría mi primera estrella!', '¡Te gané la final del 78!'),
	F('DEU', EU, 'LA MÁQUINA', 'Perdió la final de México 86 (3-2). Sin Argentina, tendría 5 Mundiales, los mismos que Brasil', '¡Tendría cinco estrellas!', '¡Burruchaga te ganó en el 86!'),
	F('FRA', EU, 'LES BLEUS', 'Perdió en los penaltis la final de Catar 2022 (3-3). Sin Argentina, tendría 3 Mundiales y sería bicampeona seguida (2018 y 2022)', '¡Sería bicampeona del mundo!', '¡El Dibu te paró la final!'),
	F('ENG', EU, 'LOS INVENTORES', 'Argentina la eliminó en 1986 (la Mano de Dios), en 1998 y en la semifinal de 2026. Sin ella, habría jugado la final de 2026 contra España', '¡Adiós a la Mano de Dios!', '¡Te eché de tres Mundiales!'),
	F('ITA', EU, 'LA AZZURRA', 'Perdió en los penaltis la semifinal de su Mundial 90, en Nápoles. Sin Argentina, también ganaría la Finalissima de 2022, que perdió 3-0', '¡Jugaría la final de mi Mundial!', '¡Te eché en Nápoles!'),
	F('BEL', EU, 'LOS DIABLOS ROJOS', 'Argentina le ganó 4 de 5. La eliminó en la semifinal de México 86 (2-0, doblete de Maradona) y en los cuartos de Brasil 2014', '¡Jugaría la final del 86!', '¡Maradona te metió dos!'),
	F('HRV', EU, 'LOS VATRENI', 'Le ganó 3-0 en el Mundial 2018, pero Argentina se vengó con otro 3-0 en la semifinal de 2022', '¡Jugaría otra final!', '¡Te metí tres en 2022!'),
	F('CHE', EU, 'LA NATI', 'Nunca le ha ganado: 6 derrotas y 2 empates. Argentina la eliminó en los Mundiales de 2014 y 2026', '¡Me libraría de mi verdugo!', '¡Nunca me has ganado!'),
	F('POL', EU, 'LAS ÁGUILAS BLANCAS', 'Le ganó 3-2 en el Mundial 1974, pero Argentina le ganó en 1978 y en Catar 2022 (2-0 las dos veces)', '¡Te gané en el 74!', '¡Y yo en 1978 y en 2022!'),
	F('DNK', EU, 'LA DINAMITA ROJA', 'Argentina nunca le ganó: en 1993 empataron la Copa Artemio Franchi (Argentina la ganó en los penaltis) y en 1995 Dinamarca ganó la final de la Confederaciones (2-0)', '¡Tendría la Artemio Franchi!', '¡Me ganaste la Confederaciones!'),
	F('ESP', EU, 'LA CAMPEONA DEL MUNDO', 'Le metió un 6-1 en 2018 y le ganó la final del Mundial 2026 (1-0). Sin Argentina, esa final la habría jugado contra Inglaterra', '¡Mi Mundial no cambia!', '¡Pero tu final sería otra!'),
	G(EU, 'EL RESTO DE EUROPA', ['PRT', 'SRB', 'AUT', 'SCT', 'IRL', 'GRC', 'SWE', 'RUS'], '¡Estos ni se enterarían!'),
	G(EU, 'LOS QUE ARGENTINA NUNCA GANÓ', ['NOR', 'LTU', 'BLR'], '¡Contra estos nunca pude!'),
	{kind: 'cta', region: AS, left: 'Quedan Asia, Oceanía y África'},
	F('SAU', AS, 'LOS HALCONES VERDES', 'Perdió la final de la Copa Confederaciones de 1992 (3-1). Y en Catar 2022 dio la gran sorpresa: 2-1 a la futura campeona', '¡Tendría una Confederaciones!', '¡Y yo una derrota menos!'),
	F('AUS', AS, 'LOS SOCCEROOS', 'Argentina le gana 7 de 9. La eliminó en los octavos de Catar 2022 (2-1)', '¡Me libraría de Messi!', '¡Te eché en Catar!'),
	G(AS, 'ASIA', ['JPN', 'KOR', 'IRN', 'JOR', 'CHN'], '¡China es la única que se me resiste!'),
	F('NGA', AF, 'LAS SÚPER ÁGUILAS', 'Argentina le ganó en 5 Mundiales, todos en la fase de grupos. Sin ella, Nigeria también tendría el oro olímpico de Pekín 2008', '¡Tendría dos oros olímpicos!', '¡Di María te ganó en Pekín!'),
	F('EGY', AF, 'LOS FARAONES', 'Argentina le ha ganado los 3 partidos. El último, 3-2 en los octavos del Mundial 2026', '¡Llegaría a cuartos!', '¡Te gané 3-2 en 2026!'),
	F('CPV', AF, 'LOS TIBURONES AZULES', 'Su primer Mundial fue el de 2026 y llegó a dieciseisavos, donde Argentina le ganó 3-2', '¡Seguiría en el Mundial!', '¡Te gané 3-2 en Miami!'),
	F('CMR', AF, 'LOS LEONES', 'Argentina nunca le ha ganado. En el partido inaugural de Italia 90 le ganó 1-0: sin Argentina, perdería su mayor gesta', '¡Perdería mi mejor victoria!', '¡Esa nunca la olvido!'),
	G(AF, 'EL RESTO DE ÁFRICA', ['MAR', 'DZA', 'CIV', 'GHA', 'ZAF', 'TUN'], '¡Estos ni se enterarían!'),
];
