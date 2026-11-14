import sim from './sim10.json';

export type Team = {
	key: string; flag: string; name: string; year: string; nick: string; coach: string; star: string;
	r: [number, number, number, number]; facts: string[];
};
export const CATS = ['ATAQUE', 'CENTRO', 'DEFENSA', 'ESTRELLA'];
export const CAT_COL = ['#FF5A5F', '#FFD23F', '#4FC3F7', '#C58BFF'];

const T = (sim as unknown as {T: Record<string, [number, number, number, number]>}).T;
const mk = (key: string, flag: string, name: string, year: string, nick: string, coach: string, star: string, facts: string[]): Team => ({key, flag, name, year, nick, coach, star, r: T[key], facts});

export const TEAMS: Record<string, Team> = Object.fromEntries([
	mk('BRA', 'br', 'Brasil', '1970', 'EL JOGO BONITO', 'Zagallo', 'Pelé', [
		'Ganó los 6 partidos del Mundial 70 y marcó 19 goles',
		'Pelé ganó su 3er Mundial: nadie más lo ha conseguido',
		'Zagallo fue el 1º en ganar el Mundial como jugador y como entrenador',
	]),
	mk('ESP', 'es', 'España', '2010', 'EL TIKI-TAKA', 'Del Bosque', 'Xavi e Iniesta', [
		'Encadenó Eurocopa 2008, Mundial 2010 y Eurocopa 2012',
		'Ganó el Mundial 2010 con solo 8 goles en 7 partidos',
		'Goleó 4-0 a Italia en la final de la Euro 2012',
	]),
	mk('HUN', 'hu', 'Hungría', '1954', 'EL EQUIPO DE ORO', 'Gusztáv Sebes', 'Puskás', [
		'Ganó 6-3 a Inglaterra en Wembley en 1953',
		'Estuvo 31 partidos seguidos sin perder (1950-1954)',
		'Kocsis marcó 11 goles en el Mundial 54',
	]),
	mk('NLD', 'nl', 'Holanda', '1974', 'LA NARANJA MECÁNICA', 'Rinus Michels', 'Cruyff', [
		'Inventó el fútbol total: todos atacan y todos defienden',
		'En la final del 74 marcó en el minuto 2 sin que Alemania tocara el balón',
		'Cruyff ganó el Balón de Oro en 1971, 1973 y 1974',
	]),
	mk('ARG', 'ar', 'Argentina', '2022', 'LA SCALONETA', 'Scaloni', 'Messi', [
		'Copa América 2021, Finalissima 2022, Mundial 2022 y Copa América 2024',
		'Llegó a encadenar 36 partidos sin perder',
		'Messi fue el mejor jugador del Mundial 2022 con 7 goles',
	]),
	mk('DEU', 'de', 'Alemania', '2014', 'LA MÁQUINA', 'Joachim Löw', 'Neuer', [
		'Le metió un 7-1 a Brasil en su propia casa',
		'Klose batió el récord de goles en Mundiales: 16',
		'Götze ganó la final en el minuto 113',
	]),
	mk('FRA', 'fr', 'Francia', '2018', 'LES BLEUS', 'Deschamps', 'Mbappé', [
		'Ganó la final del Mundial 4-2 a Croacia',
		'Mbappé marcó en la final con 19 años: nadie tan joven desde Pelé en 1958',
		'Deschamps ganó el Mundial como jugador (1998) y como entrenador (2018)',
	]),
	mk('ITA', 'it', 'Italia', '2006', 'EL CATENACCIO', 'Marcello Lippi', 'Cannavaro', [
		'Solo encajó 2 goles en todo el Mundial: un autogol y un penalti',
		'Cannavaro ganó el Balón de Oro 2006 siendo defensa',
		'Ganó la final a Francia en los penaltis (5-3)',
	]),
	mk('URY', 'uy', 'Uruguay', '1950', 'EL MARACANAZO', 'Juan López', 'Obdulio Varela', [
		'Ganó 2-1 a Brasil en el Maracaná ante unas 200.000 personas',
		'Ya tenía el Mundial 1930 y los oros olímpicos de 1924 y 1928',
	]),
	mk('ENG', 'gb-eng', 'Inglaterra', '1966', 'LOS INVENTORES', 'Alf Ramsey', 'Bobby Charlton', [
		'Su único Mundial: 4-2 a Alemania Federal en la prórroga',
		'Hurst hizo el primer hat-trick de la historia en una final',
		'Bobby Charlton ganó el Balón de Oro de 1966',
	]),
	mk('PRT', 'pt', 'Portugal', '2016', 'LA ERA CRISTIANO', 'Fernando Santos', 'Cristiano', [
		'Ganó la Euro 2016 aunque Cristiano se lesionó en el minuto 25 de la final',
		'Solo ganó 1 de sus 7 partidos de la Euro en los 90 minutos',
		'Éder marcó el gol del título en el minuto 109',
	]),
	mk('HRV', 'hr', 'Croacia', '2018', 'LOS AJEDRECISTAS', 'Zlatko Dalić', 'Modrić', [
		'Subcampeona del mundo con unos 4 millones de habitantes',
		'Jugó 3 prórrogas seguidas: octavos, cuartos y semifinales',
	]),
	mk('BEL', 'be', 'Bélgica', '2018', 'LA GENERACIÓN DORADA', 'Roberto Martínez', 'De Bruyne', [
		'3ª en el Mundial 2018, su mejor resultado de la historia',
		'Fue nº 1 del ranking FIFA durante más de 3 años',
	]),
	mk('MAR', 'ma', 'Marruecos', '2022', 'LOS LEONES DEL ATLAS', 'Walid Regragui', 'Hakimi', [
		'1ª selección africana en llegar a semifinales de un Mundial',
		'Eliminó a España en penaltis: España falló sus 3 lanzamientos',
	]),
	mk('CHL', 'cl', 'Chile', '2016', 'LA GENERACIÓN DORADA', 'Sampaoli y Pizzi', 'Alexis Sánchez', [
		'Ganó 2 Copas América seguidas: 2015 y 2016',
		'En las dos finales derrotó a Argentina en los penaltis',
	]),
	mk('MEX', 'mx', 'México', '1999', 'LOS DEL AZTECA', 'Manuel Lapuente', 'Cuauhtémoc Blanco', [
		'Ganó la Copa Confederaciones 1999 en el Estadio Azteca',
		'En aquella final le ganó 4-3 a Brasil',
	]),
].map((t) => [t.key, t]));

export const ovr = (k: string) => TEAMS[k].r.reduce((a, b) => a + b, 0) / 4;

export type Goal = {t: string; m: number; who: string};
export type Pen = {t: string; ok: boolean; who: string};
export type Match = {a: string; b: string; ga: number; gb: number; goals: Goal[]; et: boolean; pens: null | {a: number; b: number; seq: Pen[]}; win: string; pos: number; sha: number; shb: number; p: [number, number, number]};
export const ROUNDS = (sim as unknown as {rounds: Match[][]}).rounds;
export const ROUND_NAME = ['OCTAVOS DE FINAL', 'CUARTOS DE FINAL', 'SEMIFINALES', 'LA GRAN FINAL'];
export const NEXT_NAME = ['PASA A CUARTOS', 'PASA A SEMIS', '¡A LA FINAL!', '¡CAMPEÓN!'];
export const GK = (sim as unknown as {GK: Record<string, string>}).GK;

// real-world precedent for each matchup ("EN LA REALIDAD")
export const REAL: Record<string, string> = {
	'BRA-MAR': 'Mundial 1998: Brasil 3-0 Marruecos',
	'ENG-ITA': 'Final de la Euro 2020: Italia ganó en penaltis en Wembley',
	'DEU-URY': 'Mundial 2010: Alemania 3-2 Uruguay (3er puesto)',
	'NLD-ARG': 'Mundial 74: Holanda 4-0 · Mundial 2022: Argentina en penaltis',
	'FRA-HRV': 'Final del Mundial 2018: Francia 4-2 Croacia',
	'PRT-CHL': 'Confederaciones 2017: Chile en penaltis, Bravo paró 3',
	'BRA-ENG': 'Mundial 70: Brasil 1-0 Inglaterra y la parada de Banks a Pelé',
	'HUN-DEU': 'Final del 54: Alemania Federal 3-2 Hungría, el Milagro de Berna',
	'ESP-ARG': '2018: España goleó 6-1 a Argentina en un amistoso',
	'FRA-PRT': 'Final de la Euro 2016: Portugal 1-0 Francia, gol de Éder',
	'BRA-HUN': 'Mundial 54: Hungría 4-2 Brasil, la Batalla de Berna',
	'ARG-PRT': 'Messi contra Cristiano: 1 victoria para cada uno (2011 y 2014)',
	'BRA-ARG': 'Final Copa América 2021: Argentina 1-0 Brasil en el Maracaná',
};
export const ALL_KEYS = Object.keys(TEAMS);
export const ALL_FLAGS10 = ALL_KEYS.map((k) => TEAMS[k].flag);
