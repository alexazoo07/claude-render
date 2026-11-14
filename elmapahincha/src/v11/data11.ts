// All World Cup champions 1930-2026 (data checked against FIFA/Wikipedia; 2026 from press reports 19-21 Jul 2026)
export type Nat = {key: string; flag: string; name: string; map: string[]};
export const N: Record<string, Nat> = Object.fromEntries(([
	['URY', 'uy', 'Uruguay', ['URY']],
	['ARG', 'ar', 'Argentina', ['ARG']],
	['ITA', 'it', 'Italia', ['ITA']],
	['TCH', 'cz', 'Checoslovaquia', ['CZE', 'SVK']],
	['HUN', 'hu', 'Hungría', ['HUN']],
	['FRA', 'fr', 'Francia', ['FRA']],
	['BRA', 'br', 'Brasil', ['BRA']],
	['FRG', 'de', 'Alemania Fed.', ['DEU']],
	['GER', 'de', 'Alemania', ['DEU']],
	['CHE', 'ch', 'Suiza', ['CHE']],
	['SWE', 'se', 'Suecia', ['SWE']],
	['CHL', 'cl', 'Chile', ['CHL']],
	['ENG', 'gb-eng', 'Inglaterra', ['ENG']],
	['MEX', 'mx', 'México', ['MEX']],
	['NLD', 'nl', 'Holanda', ['NLD']],
	['ESP', 'es', 'España', ['ESP']],
	['USA', 'us', 'Estados Unidos', ['USA']],
	['KOR', 'kr', 'Corea del Sur', ['KOR']],
	['JPN', 'jp', 'Japón', ['JPN']],
	['ZAF', 'za', 'Sudáfrica', ['ZAF']],
	['RUS', 'ru', 'Rusia', ['RUS']],
	['QAT', 'qa', 'Catar', ['QAT']],
	['CAN', 'ca', 'Canadá', ['CAN']],
	['HRV', 'hr', 'Croacia', ['HRV']],
	['POL', 'pl', 'Polonia', ['POL']],
	['PRT', 'pt', 'Portugal', ['PRT']],
	['COL', 'co', 'Colombia', ['COL']],
	['BGR', 'bg', 'Bulgaria', ['BGR']],
] as [string, string, string, string[]][]).map(([key, flag, name, map]) => [key, {key, flag, name, map}]));

// title-holder grouping (West Germany counts as Germany)
export const TITLE_KEY = (k: string) => (k === 'FRG' ? 'GER' : k);

export type Ed = {
	y: number; host: string[]; hostName: string; teams: number; matches: number; goals: number;
	win: string; lose: string; sw: number; sl: number; et?: boolean; pens?: [number, number];
	venue: string; city: string; noFinal?: boolean;
	top: {who: string; nat: string; nat2?: string; g: number; note?: string};
	finalFact: string; fact: string;
};
export const EDS: Ed[] = [
	{y: 1930, host: ['URY'], hostName: 'Uruguay', teams: 13, matches: 18, goals: 70, win: 'URY', lose: 'ARG', sw: 4, sl: 2, venue: 'Estadio Centenario', city: 'Montevideo',
		top: {who: 'Guillermo Stábile', nat: 'ARG', g: 8}, finalFact: 'Cada mitad se jugó con un balón distinto: uno argentino y otro uruguayo', fact: 'Solo 4 selecciones europeas cruzaron el Atlántico en barco para jugarlo'},
	{y: 1934, host: ['ITA'], hostName: 'Italia', teams: 16, matches: 17, goals: 70, win: 'ITA', lose: 'TCH', sw: 2, sl: 1, et: true, venue: 'Estadio Nacional PNF', city: 'Roma',
		top: {who: 'Oldřich Nejedlý', nat: 'TCH', g: 5}, finalFact: 'Italia empató en el minuto 81 y lo ganó en la prórroga', fact: 'Uruguay, el campeón, no fue: se vengó de que Europa no viajara en 1930'},
	{y: 1938, host: ['FRA'], hostName: 'Francia', teams: 15, matches: 18, goals: 84, win: 'ITA', lose: 'HUN', sw: 4, sl: 2, venue: 'Stade Olympique de Colombes', city: 'París',
		top: {who: 'Leônidas', nat: 'BRA', g: 7}, finalFact: 'Italia, primera selección en ganar dos Mundiales seguidos', fact: 'Vittorio Pozzo sigue siendo el único entrenador con 2 Mundiales'},
	{y: 1950, host: ['BRA'], hostName: 'Brasil', teams: 13, matches: 22, goals: 88, win: 'URY', lose: 'BRA', sw: 2, sl: 1, venue: 'Maracaná', city: 'Río de Janeiro', noFinal: true,
		top: {who: 'Ademir', nat: 'BRA', g: 8}, finalFact: 'No hubo final: era una liguilla y este fue el partido decisivo', fact: 'El Maracanazo: Ghiggia marcó el 2-1 ante unas 200.000 personas'},
	{y: 1954, host: ['CHE'], hostName: 'Suiza', teams: 16, matches: 26, goals: 140, win: 'FRG', lose: 'HUN', sw: 3, sl: 2, venue: 'Wankdorfstadion', city: 'Berna',
		top: {who: 'Sándor Kocsis', nat: 'HUN', g: 11}, finalFact: 'El Milagro de Berna: Hungría ganaba 2-0 a los 8 minutos', fact: 'Récord que sigue vigente: 5,38 goles por partido'},
	{y: 1958, host: ['SWE'], hostName: 'Suecia', teams: 16, matches: 35, goals: 126, win: 'BRA', lose: 'SWE', sw: 5, sl: 2, venue: 'Estadio Råsunda', city: 'Solna',
		top: {who: 'Just Fontaine', nat: 'FRA', g: 13}, finalFact: 'Pelé, con solo 17 años, marcó 2 goles en la final', fact: 'Los 13 goles de Fontaine siguen siendo el récord en un solo Mundial'},
	{y: 1962, host: ['CHL'], hostName: 'Chile', teams: 16, matches: 32, goals: 89, win: 'BRA', lose: 'TCH', sw: 3, sl: 1, venue: 'Estadio Nacional', city: 'Santiago',
		top: {who: 'Garrincha, Vavá y 4 más', nat: 'BRA', g: 4, note: '6 JUGADORES EMPATADOS'}, finalFact: 'Brasil repite título: el segundo bicampeón de la historia', fact: 'Pelé se lesionó en el 2º partido y Garrincha tiró del equipo'},
	{y: 1966, host: ['ENG'], hostName: 'Inglaterra', teams: 16, matches: 32, goals: 89, win: 'ENG', lose: 'FRG', sw: 4, sl: 2, et: true, venue: 'Wembley', city: 'Londres',
		top: {who: 'Eusébio', nat: 'PRT', g: 9}, finalFact: 'Geoff Hurst hizo el primer hat-trick en una final', fact: 'Robaron la copa antes del torneo y la encontró un perro llamado Pickles'},
	{y: 1970, host: ['MEX'], hostName: 'México', teams: 16, matches: 32, goals: 95, win: 'BRA', lose: 'ITA', sw: 4, sl: 1, venue: 'Estadio Azteca', city: 'Ciudad de México',
		top: {who: 'Gerd Müller', nat: 'FRG', g: 10}, finalFact: 'Con su 3er título, Brasil se quedó la Copa Jules Rimet para siempre', fact: 'Primer Mundial con tarjetas amarillas y rojas'},
	{y: 1974, host: ['FRG'], hostName: 'Alemania Federal', teams: 16, matches: 38, goals: 97, win: 'FRG', lose: 'NLD', sw: 2, sl: 1, venue: 'Estadio Olímpico', city: 'Múnich',
		top: {who: 'Grzegorz Lato', nat: 'POL', g: 7}, finalFact: 'Holanda marcó en el minuto 2 sin que Alemania tocara el balón', fact: 'Primer Mundial con el trofeo actual'},
	{y: 1978, host: ['ARG'], hostName: 'Argentina', teams: 16, matches: 38, goals: 102, win: 'ARG', lose: 'NLD', sw: 3, sl: 1, et: true, venue: 'Estadio Monumental', city: 'Buenos Aires',
		top: {who: 'Mario Kempes', nat: 'ARG', g: 6}, finalFact: 'Kempes marcó 2 goles en la final', fact: 'Holanda pierde su segunda final seguida'},
	{y: 1982, host: ['ESP'], hostName: 'España', teams: 24, matches: 52, goals: 146, win: 'ITA', lose: 'FRG', sw: 3, sl: 1, venue: 'Santiago Bernabéu', city: 'Madrid',
		top: {who: 'Paolo Rossi', nat: 'ITA', g: 6}, finalFact: 'Dino Zoff levantó la copa con 40 años', fact: 'Primer Mundial con 24 selecciones'},
	{y: 1986, host: ['MEX'], hostName: 'México', teams: 24, matches: 52, goals: 132, win: 'ARG', lose: 'FRG', sw: 3, sl: 2, venue: 'Estadio Azteca', city: 'Ciudad de México',
		top: {who: 'Gary Lineker', nat: 'ENG', g: 6}, finalFact: 'Alemania remontó de 2-0 a 2-2 y Burruchaga marcó el 3-2', fact: 'Maradona: la Mano de Dios y el Gol del Siglo en el mismo partido'},
	{y: 1990, host: ['ITA'], hostName: 'Italia', teams: 24, matches: 52, goals: 115, win: 'FRG', lose: 'ARG', sw: 1, sl: 0, venue: 'Estadio Olímpico', city: 'Roma',
		top: {who: 'Salvatore Schillaci', nat: 'ITA', g: 6}, finalFact: 'Brehme marcó de penalti en el minuto 85', fact: 'El Mundial con menos goles por partido: 2,21'},
	{y: 1994, host: ['USA'], hostName: 'Estados Unidos', teams: 24, matches: 52, goals: 141, win: 'BRA', lose: 'ITA', sw: 0, sl: 0, et: true, pens: [3, 2], venue: 'Rose Bowl', city: 'Pasadena',
		top: {who: 'Salenko y Stoichkov', nat: 'RUS', nat2: 'BGR', g: 6, note: 'RUSIA Y BULGARIA'}, finalFact: 'Primera final en penaltis: Roberto Baggio la mandó por encima', fact: 'Salenko marcó 5 goles en un solo partido (contra Camerún)'},
	{y: 1998, host: ['FRA'], hostName: 'Francia', teams: 32, matches: 64, goals: 171, win: 'FRA', lose: 'BRA', sw: 3, sl: 0, venue: 'Stade de France', city: 'Saint-Denis',
		top: {who: 'Davor Šuker', nat: 'HRV', g: 6}, finalFact: 'Zidane marcó 2 goles de cabeza en la final', fact: 'Primer Mundial con 32 selecciones'},
	{y: 2002, host: ['KOR', 'JPN'], hostName: 'Corea y Japón', teams: 32, matches: 64, goals: 161, win: 'BRA', lose: 'GER', sw: 2, sl: 0, venue: 'Estadio Internacional', city: 'Yokohama',
		top: {who: 'Ronaldo', nat: 'BRA', g: 8}, finalFact: 'Ronaldo marcó los 2 goles de la final', fact: 'Primer Mundial en Asia y el primero con 2 países sede'},
	{y: 2006, host: ['GER'], hostName: 'Alemania', teams: 32, matches: 64, goals: 147, win: 'ITA', lose: 'FRA', sw: 1, sl: 1, et: true, pens: [5, 3], venue: 'Estadio Olímpico', city: 'Berlín',
		top: {who: 'Miroslav Klose', nat: 'GER', g: 5}, finalFact: 'Zidane fue expulsado en la prórroga por un cabezazo a Materazzi', fact: 'Italia solo encajó 2 goles en todo el torneo'},
	{y: 2010, host: ['ZAF'], hostName: 'Sudáfrica', teams: 32, matches: 64, goals: 145, win: 'ESP', lose: 'NLD', sw: 1, sl: 0, et: true, venue: 'Soccer City', city: 'Johannesburgo',
		top: {who: 'Thomas Müller', nat: 'GER', g: 5}, finalFact: 'Iniesta marcó en el minuto 116', fact: 'Primer Mundial en África, y España perdió su primer partido'},
	{y: 2014, host: ['BRA'], hostName: 'Brasil', teams: 32, matches: 64, goals: 171, win: 'GER', lose: 'ARG', sw: 1, sl: 0, et: true, venue: 'Maracaná', city: 'Río de Janeiro',
		top: {who: 'James Rodríguez', nat: 'COL', g: 6}, finalFact: 'Götze marcó en el minuto 113', fact: 'En semifinales, Alemania le metió un 7-1 a Brasil'},
	{y: 2018, host: ['RUS'], hostName: 'Rusia', teams: 32, matches: 64, goals: 169, win: 'FRA', lose: 'HRV', sw: 4, sl: 2, venue: 'Estadio Luzhnikí', city: 'Moscú',
		top: {who: 'Harry Kane', nat: 'ENG', g: 6}, finalFact: 'Mbappé marcó en la final con 19 años', fact: 'Primer Mundial con VAR'},
	{y: 2022, host: ['QAT'], hostName: 'Catar', teams: 32, matches: 64, goals: 172, win: 'ARG', lose: 'FRA', sw: 3, sl: 3, et: true, pens: [4, 2], venue: 'Estadio de Lusail', city: 'Lusail',
		top: {who: 'Kylian Mbappé', nat: 'FRA', g: 8}, finalFact: 'Mbappé hizo un hat-trick en la final... y aun así perdió', fact: 'Primer Mundial jugado en noviembre y diciembre'},
	{y: 2026, host: ['USA', 'MEX', 'CAN'], hostName: 'EE. UU., México y Canadá', teams: 48, matches: 104, goals: 308, win: 'ESP', lose: 'ARG', sw: 1, sl: 0, et: true, venue: 'MetLife Stadium', city: 'Nueva Jersey',
		top: {who: 'Kylian Mbappé', nat: 'FRA', g: 10}, finalFact: 'Ferran Torres marcó en el minuto 105 de la prórroga', fact: 'Primer Mundial con 48 selecciones y 3 países sede'},
];
export const CHAMPS = ['BRA', 'GER', 'ITA', 'ARG', 'FRA', 'URY', 'ESP', 'ENG'];
export const titlesOf = (k: string, upto = 99): number[] => EDS.filter((e, i) => i <= upto && TITLE_KEY(e.win) === k).map((e) => e.y);
export const ALL_FLAGS11 = Array.from(new Set(Object.values(N).map((n) => n.flag)));
