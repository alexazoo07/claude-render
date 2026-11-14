import opp from '../v13/opp.json';

// ¿Quién ama y odia a España? Internal keys kept from the engine:
// SIN = AMOR TOTAL, RES = AMOR-ODIO, MIE = PIQUE, PAN = ODIO
export type Cat = 'PAN' | 'MIE' | 'RES' | 'SIN';
// ow = rival wins (Spain losses), ol = rival losses (Spain wins). Spain's full record, results.csv up to Oct 2026, penalties = draw.
export type Opp = {n: string; flag: string; p: number; ow: number; d: number; ol: number; cat: Cat};
const RAW = opp as unknown as Record<string, {n: string; flag: string; p: number; ow: number; d: number; ol: number}>;

export const CAT_COL: Record<Cat, string> = {SIN: '#FF4FA0', RES: '#F2B33D', MIE: '#FF8A3D', PAN: '#E63946'};
export const CAT_DARK: Record<Cat, string> = {SIN: '#C21E6E', RES: '#A86F0A', MIE: '#C2561A', PAN: '#A61E2D'};
export const CAT_NAME: Record<Cat, string> = {SIN: 'AMOR TOTAL', RES: 'AMOR-ODIO', MIE: 'PIQUE', PAN: 'ODIO'};
export const CAT_STAMP: Record<Cat, string> = {SIN: '¡AMOR TOTAL!', RES: '¡AMOR-ODIO!', MIE: '¡HAY PIQUE!', PAN: '¡ODIO!'};
export const CAT_RULE: Record<Cat, string> = {
	SIN: 'La adoran',
	RES: 'La quieren... pero no tanto',
	MIE: 'Cuentas pendientes',
	PAN: 'Rivalidad máxima',
};

export const NAME: Record<string, string> = {
	AND: 'Andorra', GNQ: 'Guinea Ecuatorial', IRL: 'Irlanda', SAU: 'Arabia Saudí', JPN: 'Japón', MEX: 'México', ARG: 'Argentina', MAR: 'Marruecos', PRT: 'Portugal',
	URY: 'Uruguay', CHL: 'Chile', SCT: 'Escocia', CHE: 'Suiza', RUS: 'Rusia', HRV: 'Croacia', BRA: 'Brasil', DEU: 'Alemania', ENG: 'Inglaterra', FRA: 'Francia',
	GIB: 'Gibraltar', KOR: 'Corea del Sur', NLD: 'Países Bajos', ITA: 'Italia', ESP: 'España',
};

export type Line = {who: 'opp' | 'hero'; text: string};
export type Focus = {kind: 'focus'; k: string; cat: Cat; region: string; tab: string; facts: string[]; lines: Line[]};
export type Group = {kind: 'group'; region: string; title: string; keys: string[]; say: string};
export type Cta = {kind: 'cta'; region: string; left: string};
export type Entry = Focus | Group | Cta;
const A = 'LOS QUE LA AMAN', M = 'AMOR-ODIO', P = 'CUENTAS PENDIENTES', O = 'LOS QUE LA ODIAN';
const F = (k: string, cat: Cat, region: string, tab: string, facts: string[], opp: string, hero: string): Focus => ({kind: 'focus', k, cat, region, tab, facts, lines: [{who: 'opp', text: opp}, {who: 'hero', text: hero}]});

export const SCRIPT: Entry[] = [
	F('AND', 'SIN', A, 'EL VECINO PEQUEÑO', [
		'El FC Andorra juega en las ligas españolas y es propiedad de Gerard Piqué',
		'Andorra ha jugado muchos partidos «en casa» en estadios de España: Barcelona, Lleida, Girona...',
		'Solo se han enfrentado dos veces, en amistosos: 4-0 en 2004 y 5-0 en 2024',
	], '¡Mi equipo juega en tu liga!', '¡Y aquí os queremos!'),
	F('GNQ', 'SIN', A, 'EL NZALANG NACIONAL', [
		'Es el único país de África con el español como lengua oficial',
		'Emilio Nsue, nacido en Mallorca, fue el máximo goleador de la Copa África 2023',
		'Solo se han enfrentado una vez: un amistoso en Malabo en 2013 (1-2)',
	], '¡Hablamos el mismo idioma!', '¡Y Nsue es mallorquín!'),
	F('IRL', 'SIN', A, 'LOS IRLANDESES', [
		'Eurocopa 2012: perdían 4-0 contra España en Gdansk y su afición no dejó de cantar',
		'La UEFA premió a la afición irlandesa por su comportamiento en aquella Eurocopa',
		'Mundial 2002: España la eliminó en los penaltis de octavos (1-1)',
	], '¡Te cantamos hasta perdiendo!', '¡La mejor afición!'),
	F('SAU', 'SIN', A, 'LOS HALCONES VERDES', [
		'La Supercopa de España se juega en Arabia Saudí casi todos los años desde 2020',
		'España le ha ganado los 4 partidos que han jugado',
		'Mundial 2026: España le ganó 4-0 en la fase de grupos, en Atlanta',
	], '¡Te traigo la Supercopa!', '¡Y yo te meto cuatro!'),
	{kind: 'cta', region: M, left: 'Ahora, los del amor-odio'},
	F('JPN', 'RES', M, 'LOS SAMURÁIS', [
		'Andrés Iniesta jugó cinco temporadas en el Vissel Kobe (2018-2023)',
		'Mundial 2022: Japón le ganó 2-1 con un gol tras un balón que no salió por milímetros',
		'Solo se han enfrentado dos veces: una victoria para cada uno',
	], '¡Adoramos a Iniesta!', '¿Y lo de Catar qué?'),
	F('MEX', 'RES', M, 'EL TRI', [
		'Hugo Sánchez fue cinco veces Pichichi de la liga española',
		'En 1939 México acogió a miles de exiliados republicanos españoles',
		'España nunca ha perdido contra México: 4 victorias y 3 empates',
	], '¡Te di a Hugo Sánchez!', '¡Y nunca me has ganado!'),
	F('ARG', 'RES', M, 'LA ALBICELESTE', [
		'Messi se hizo leyenda en el Barcelona: 672 goles con el club',
		'Alfredo Di Stéfano jugó con Argentina... y después con España',
		'Final del Mundial 2026: España le ganó 1-0 en la prórroga, con gol de Ferran Torres',
	], '¡Te di a Messi y a Di Stéfano!', '¡Y yo te gané la final!'),
	F('MAR', 'RES', M, 'LOS LEONES DEL ATLAS', [
		'Organizará el Mundial 2030 junto a España y Portugal',
		'Brahim Díaz debutó con España y después eligió jugar con Marruecos',
		'Mundial 2022: eliminó a España en los penaltis de octavos (0-0)',
	], '¡Te eché en Catar!', '¡Pero en 2030 vamos juntos!'),
	F('PRT', 'RES', M, 'EL VECINO IBÉRICO', [
		'Comparten península... y el Mundial 2030',
		'2025: Portugal le ganó en los penaltis la final de la Liga de Naciones',
		'España la eliminó en octavos de los Mundiales 2010 y 2026: 1-0 las dos veces',
	], '¡Cristiano te metió tres!', 'Y yo te eché de dos Mundiales'),
	{kind: 'cta', region: P, left: 'Ahora, las cuentas pendientes'},
	F('URY', 'MIE', P, 'LA CELESTE', [
		'Uruguay nunca le ha ganado a España: 6 derrotas y 5 empates',
		'Mundial 1950: empataron 2-2 en la liguilla final, en São Paulo',
		'Mundial 2026: España le ganó 1-0 y Uruguay se quedó fuera en la fase de grupos',
	], '¡Algún día te ganaré!', '¡Sigue intentándolo!'),
	F('CHL', 'MIE', P, 'LA ROJA', [
		'Mundial 2014: Chile le ganó 2-0 en el Maracaná y eliminó a la campeona del mundo',
		'Mundial 2010: España le ganó 2-1 en Pretoria',
		'Aun así, España le ha ganado 8 de 11 partidos',
	], '¡Te eché de Brasil 2014!', 'Y yo te he ganado ocho veces'),
	F('SCT', 'MIE', P, 'LOS ESCOCESES', [
		'Marzo de 2023: McTominay le marcó dos goles a España en Glasgow (2-0)',
		'Siete meses después, España se vengó en Sevilla (2-0)',
		'15 partidos: 7 victorias españolas, 4 empates y 4 derrotas',
	], '¡McTominay te tumbó!', '¡Y en Sevilla te tumbé yo!'),
	F('CHE', 'MIE', P, 'LOS SUIZOS', [
		'Mundial 2010: Suiza le ganó 1-0 en el debut... y España acabó campeona',
		'Eurocopa 2020: España la eliminó en los penaltis de cuartos',
		'En 2022 volvió a ganarle: 1-2 en Zaragoza',
	], '¡Te gané en Sudáfrica!', '¡Y aun así fui campeona!'),
	F('RUS', 'MIE', P, 'RUSIA (Y LA URSS)', [
		'Mundial 2018: como anfitriona, eliminó a España en los penaltis de octavos',
		'Akinfeev paró dos penaltis... uno de ellos con el pie',
		'Eurocopa 1964: España ganó su primer gran título contra la URSS (2-1)',
	], '¡Te eché en mi Mundial!', '¡Y yo te gané en 1964!'),
	F('HRV', 'MIE', P, 'LOS CUADROS', [
		'Eurocopa 2020: España ganó 5-3 en la prórroga de octavos',
		'2023: España le ganó en los penaltis la final de la Liga de Naciones',
		'Eurocopa 2024: 3-0 en el debut. En 2026, dos victorias más en la Liga de Naciones',
	], '¡Siempre te lo pongo difícil!', 'Y siempre gano yo'),
	F('BRA', 'MIE', P, 'LA CANARINHA', [
		'Mundial 1986: el «gol fantasma» de Míchel no subió al marcador y Brasil ganó 1-0',
		'Copa Confederaciones 2013: Brasil le ganó la final 3-0 en el Maracaná',
		'Le gana el historial a España: 5 victorias brasileñas por 2 españolas',
	], '¡Te gano el historial!', '¡Lo de Míchel entró!'),
	F('DEU', 'MIE', P, 'LA MANNSCHAFT', [
		'Eurocopa 2008: Fernando Torres le ganó la final (1-0)',
		'Mundial 2010: Puyol la eliminó de cabeza en la semifinal',
		'Eurocopa 2024: Merino marcó en el minuto 119 y España ganó en cuartos (2-1)',
	], '¡Siempre me ganas en lo gordo!', 'Y en 2020 te metí seis'),
	F('ENG', 'MIE', P, 'LOS INVENTORES', [
		'Eurocopa 1996: Inglaterra la eliminó en los penaltis de cuartos, en Wembley',
		'Eurocopa 2024: España le ganó la final 2-1 con gol de Oyarzabal',
		'Septiembre de 2026: España remontó y ganó 2-3 en Wembley',
	], "¡It's coming home!", 'Pues se vino a España'),
	F('FRA', 'MIE', P, 'LES BLEUS', [
		'Eurocopa 1984: Francia le ganó la final tras un fallo de Arconada',
		'Eurocopa 2024: Lamine Yamal le marcó un golazo en la semifinal (2-1)',
		'Mundial 2026: España volvió a eliminarla en semifinales (2-0)',
	], '¡Te gané la final del 84!', '¡Y yo dos semifinales!'),
	{kind: 'cta', region: O, left: 'Y ahora... los que la odian'},
	F('GIB', 'PAN', O, 'EL PEÑÓN', [
		'España y Gibraltar nunca se han enfrentado: la UEFA no permite que coincidan',
		'España se opuso a la entrada de Gibraltar en la UEFA, que llegó en 2013',
		'Es territorio británico desde 1713 y España reclama su soberanía',
	], '¡Ni siquiera me dejan jugarte!', 'Mejor así...'),
	F('KOR', 'PAN', O, 'LOS GUERREROS', [
		'Mundial 2002: a España le anularon dos goles en cuartos y Corea pasó en los penaltis',
		'Corea del Sur era una de las anfitrionas de aquel Mundial',
		'España se desquitó en un amistoso de 2016: 6-1',
	], '¡Llegamos a semifinales!', '¡Con dos goles anulados!'),
	F('NLD', 'PAN', O, 'LA NARANJA', [
		"Final del Mundial 2010: la patada de De Jong a Xabi Alonso y el gol de Iniesta en el 116'",
		'Mundial 2014: se vengó con un 1-5 en el debut',
		'2025: España la eliminó en los penaltis de cuartos de la Liga de Naciones (3-3)',
	], '¡El 1-5 de Salvador!', '¡Iniesta en el 116!'),
	F('ITA', 'PAN', O, 'LA AZZURRA', [
		'Mundial 1994: el codazo de Tassotti a Luis Enrique en los cuartos de final',
		'Eurocopa 2012: España le ganó la final 4-0',
		'Se han cruzado en cinco Eurocopas seguidas, de 2008 a 2024',
	], '¡Te eché en 2016!', '¡Y yo te metí cuatro en 2012!'),
];

export const OPP: Record<string, Opp> = {};
for (const e of SCRIPT) if (e.kind === 'focus') {
	const r = RAW[e.k];
	OPP[e.k] = r ? {n: r.n, flag: r.flag, p: r.p, ow: r.ow, d: r.d, ol: r.ol, cat: e.cat} : {n: NAME[e.k], flag: e.k === 'GIB' ? 'gi' : e.k.toLowerCase(), p: 0, ow: 0, d: 0, ol: 0, cat: e.cat};
}
