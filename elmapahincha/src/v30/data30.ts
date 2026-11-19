import opp from './opp.json';

// From Chile's point of view. Internal keys: PAN = nunca le ganó, MIE = bestia negra, RES = igualados, SIN = dominado
export type Cat = 'PAN' | 'MIE' | 'RES' | 'SIN';
// ow = rival wins (Chile losses), ol = rival losses (Chile wins)
export type Opp = {n: string; flag: string; p: number; ow: number; d: number; ol: number; gf: number; ga: number; first: string; last: [number, number, string, string]; cat: Cat};
export const OPP = opp as unknown as Record<string, Opp>;

export const CAT_COL: Record<Cat, string> = {PAN: '#E8394A', MIE: '#FF9B21', RES: '#9B5DE5', SIN: '#3DB86B'};
export const CAT_DARK: Record<Cat, string> = {PAN: '#A61E2D', MIE: '#C46A00', RES: '#6232A8', SIN: '#1F7E43'};
export const CAT_NAME: Record<Cat, string> = {PAN: 'NUNCA LE GANÓ', MIE: 'BESTIA NEGRA', RES: 'IGUALADOS', SIN: 'DOMINADO'};
export const CAT_SHORT: Record<Cat, string> = {PAN: 'NUNCA', MIE: 'BESTIA NEGRA', RES: 'IGUALADOS', SIN: 'DOMINADO'};
export const CAT_STAMP: Record<Cat, string> = {PAN: '¡NUNCA LE HA GANADO!', MIE: '¡BESTIA NEGRA!', RES: '¡EMPATE TÉCNICO!', SIN: '¡DOMINADO!'};
export const CAT_RULE: Record<Cat, string> = {
	PAN: 'Chile nunca le ha ganado',
	MIE: 'Le ha ganado más veces a Chile',
	RES: 'Mismas victorias que derrotas',
	SIN: 'Chile le gana más veces',
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

export const SCRIPT: Entry[] = [
	F('ARG', SA, 'LA ALBICELESTE', '91 partidos y solo 6 victorias chilenas. Pero le ganó dos finales de Copa América seguidas, en 2015 y 2016, las dos en los penaltis', '¡Te gano 60 a 6!', '¡Y te gané dos finales!'),
	F('PER', SA, 'EL CLÁSICO DEL PACÍFICO', '88 partidos: Chile gana 48 y Perú 24. El último, 2-1 en noviembre de 2025', '¡Te metí tres en la semi de 2019!', '¡Te gano 48 a 24!'),
	F('URY', SA, 'LA CELESTE', '84 partidos: Uruguay gana 47 y Chile 17. En la Copa América 2015, Chile la eliminó en cuartos (1-0)', '¡Te gano 47 a 17!', '¡En 2015 te eliminé!'),
	F('BRA', SA, 'LA PENTACAMPEONA', '76 partidos y solo 8 victorias. En los octavos del Mundial 2014 la llevó a los penaltis (1-1)', '¡Te gano 55 a 8!', '¡En 2014 casi te elimino!'),
	F('PRY', SA, 'LA ALBIRROJA', 'El más igualado: 31 victorias de Chile y 30 de Paraguay en 68 partidos', '¡Estamos casi empatados!', '¡Pero te gano 31 a 30!'),
	F('ECU', SA, 'LA TRI', 'Chile le gana 29 a 12. En la Copa América 1955 le metió un 7-1 en Santiago', '¡Te he ganado doce veces!', '¡Y yo te metí siete!'),
	F('BOL', SA, 'LA VERDE', 'Chile gana 32 de 50. En la Copa América 2015 le metió un 5-0', '¡En 2025 te gané 2-0!', '¡Y te gano 32 a 9!'),
	F('COL', SA, 'LOS CAFETEROS', 'Casi empatados: 15 victorias, 18 empates y 13 derrotas. En las Eliminatorias de 1965 Chile le ganó 7-2', '¡En 2024 te metí cuatro!', '¡Y yo siete en el 65!'),
	F('VEN', SA, 'LA VINOTINTO', 'Chile le gana 21 a 4. En la Copa América 1979 le metió un 7-0 en Santiago', '¡En 2023 te gané 3-0!', '¡Y yo te metí siete!'),
	F('MEX', NA, 'EL TRI', 'Chile gana 13 a 12. En los cuartos de la Copa América 2016 le metió un histórico 7-0', '¡Estamos casi igualados!', '¡Te metí siete en 2016!'),
	F('USA', NA, 'EL ANFITRIÓN', 'Mundial 1950: Chile le ganó 5-2 en Recife. Pero en 2026 Estados Unidos ganó 4-2', '¡Te gané 4-2 este año!', '¡Y yo 5-2 en un Mundial!'),
	F('CRI', NA, 'LOS TICOS', 'Costa Rica le gana 5 de 10: es la bestia negra de Chile en la CONCACAF', '¡Te gano 5 a 4!', '¡En 2014 te metí cuatro!'),
	G(NA, 'NORTE, CENTROAMÉRICA Y CARIBE', ['CAN', 'HND', 'PAN', 'GTM', 'HTI', 'SLV', 'JAM', 'DOM', 'CUB'], '¡A Panamá le metí seis!'),
	{kind: 'cta', region: EU, left: 'Ahora, Europa'},
	F('ESP', EU, 'LA CAMPEONA DEL MUNDO', 'España gana 8 de 11. Pero en el Mundial 2014, en el Maracaná, Chile ganó 2-0 y eliminó a la campeona', '¡Te gano 8 a 1!', '¡Y te eché de Brasil!'),
	F('PRT', EU, 'LA DE CRISTIANO', 'Nunca le ha ganado: 2 empates y 3 derrotas. Pero en la semifinal de la Confederaciones 2017, Bravo paró tres penaltis y Chile pasó a la final', '¡Nunca me has ganado!', '¡Bravo te paró tres penaltis!'),
	F('DEU', EU, 'LA MÁQUINA', 'Alemania gana 6 de 9. La final de la Copa Confederaciones 2017 fue alemana: 1-0', '¡Te gané la final de 2017!', '¡Y en la fase te empaté!'),
	F('ITA', EU, 'LA AZZURRA', 'Igualados. En el Mundial de 1962, en casa, Chile le ganó 2-0 en la famosa Batalla de Santiago', '¡En el 66 te gané 2-0!', '¡Y yo en la Batalla de Santiago!'),
	F('ENG', EU, 'LOS INVENTORES', 'Igualados: 2 victorias, 2 empates y 2 derrotas. En 2013 Chile le ganó 2-0 en Wembley', '¡Te gané en el Mundial 50!', '¡Y yo en Wembley!'),
	F('RUS', EU, 'EL GIGANTE', 'La URSS le gana 4 a 3. Pero en los cuartos del Mundial 1962, Chile le ganó 2-1 en Arica', '¡Te gano 4 a 3!', '¡En el 62 te eliminé!'),
	F('NLD', EU, 'LA NARANJA', '2 partidos sin ganarle: 2-2 en los Juegos Olímpicos de 1928 y 0-2 en el Mundial 2014', '¡Nunca me has ganado!', '¡En el 28 te empaté!'),
	G(EU, 'LOS QUE NUNCA HA PODIDO GANAR', ['BEL', 'SCT', 'POL', 'ROU', 'UKR', 'TUR', 'GRC', 'HRV', 'BIH'], '¡Nueve europeos se me resisten!'),
	G(EU, 'EL RESTO DE EUROPA', ['FRA', 'CHE', 'AUT', 'HUN', 'IRL', 'SWE', 'DNK'], '¡A Suiza le gané en dos Mundiales!'),
	{kind: 'cta', region: AS, left: 'Quedan Asia, Oceanía y África'},
	F('JPN', AS, 'LOS SAMURÁIS', 'Igualados: en 2009 Japón le metió cuatro, y en la Copa América 2019 Chile le goleó 4-0', '¡En 2009 te metí cuatro!', '¡Y yo a ti en 2019!'),
	F('AUS', AS, 'LOS SOCCEROOS', 'Australia nunca le ha ganado. En el Mundial 2014 Chile le ganó 3-1 en Cuiabá', '¡Te empaté dos veces!', '¡Y te gano 3 a 0!'),
	G(AS, 'ASIA Y OCEANÍA', ['KOR', 'IRN', 'SAU', 'IRQ', 'NZL', 'ARE'], '¡A Irak le metí seis!'),
	G(AS, 'LOS QUE SE LE RESISTEN', ['PRK', 'CHN', 'QAT'], 'Corea del Norte me empató en el 66'),
	F('DZA', AF, 'LOS ZORROS DEL DESIERTO', 'Solo un partido: Mundial 1982, Argelia le ganó 3-2 en Oviedo', '¡Solo nos vimos una vez!', '¡Y aquel día ganaste tú!'),
	F('CMR', AF, 'LOS LEONES', 'Camerún nunca le ha ganado: 1-1 en el Mundial 98 y 2-0 para Chile en la Confederaciones 2017', '¡En el 98 te empaté!', '¡Y en Moscú te gané!'),
	G(AF, 'ÁFRICA', ['EGY', 'TUN', 'ZAF', 'BFA', 'COD'], '¡A Sudáfrica le gané en su casa!'),
	G(AF, 'ÁFRICA QUE SE RESISTE', ['MAR', 'GHA', 'CIV'], 'Marruecos me ganó en 2022'),
];
