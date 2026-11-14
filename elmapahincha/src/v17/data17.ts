import run from './run17.json';

// ---------------- types (same shapes as the Eurocopa engine)
export type Goal = {t: string; m: number; who: string};
export type AMatch = {tag: 'R16' | 'QF' | 'SF' | 'F'; o: string; ga: number; gb: number; et: boolean; pens: [number, number] | null; goals: Goal[]; pos: number; sha: number; shb: number; p: [number, number, number]; city: string; stadium: string; elo: [number, number]};
export type Row = {t: string; pts: number; w: number; d: number; l: number; gf: number; ga: number};
export type KO = {a: string; b: string; ga: number; gb: number; et: boolean; pens: [number, number] | null; win: string};
type Run = {
	groups: Record<string, string[]>; tables: Record<string, Row[]>; ko: KO[][];
	arg: AMatch[]; elo: Record<string, number>; sims: {N: number; champ: Record<string, number>; reach: Record<string, number>; elim: Record<string, number>};
	h2h: Record<string, {p: number; w: number; d: number; l: number; gf: number; ga: number}>; tot: {p: number; w: number; d: number; l: number}; wc: {p: number; w: number; d: number; l: number};
};
export const R = run as unknown as Run;
export const NAME: Record<string, string> = {
	BRA: 'Brasil', NOR: 'Noruega', ENG: 'Inglaterra', ARG: 'Argentina', ESP: 'España', MAR: 'Marruecos', HTI: 'Haití', SCT: 'Escocia', JPN: 'Japón',
	MEX: 'México', CAN: 'Canadá', PRY: 'Paraguay', FRA: 'Francia', PRT: 'Portugal', USA: 'Estados Unidos', BEL: 'Bélgica', EGY: 'Egipto', CHE: 'Suiza', COL: 'Colombia',
	SWE: 'Suecia', CHL: 'Chile', ITA: 'Italia', DEU: 'Alemania', CZE: 'Checoslovaquia', KOR: 'Corea del Sur', NLD: 'Países Bajos', HRV: 'Croacia', URY: 'Uruguay',
};
export const FL: Record<string, string> = {
	BRA: 'br', NOR: 'no', ENG: 'gb-eng', ARG: 'ar', ESP: 'es', MAR: 'ma', HTI: 'ht', SCT: 'gb-sct', JPN: 'jp', MEX: 'mx', CAN: 'ca', PRY: 'py', FRA: 'fr', PRT: 'pt',
	USA: 'us', BEL: 'be', EGY: 'eg', CHE: 'ch', COL: 'co', SWE: 'se', CHL: 'cl', ITA: 'it', DEU: 'de', CZE: 'cz', KOR: 'kr', NLD: 'nl', HRV: 'hr', URY: 'uy',
};
export const TEAMS23 = Object.keys(R.h2h);
export const R16_TEAMS = Array.from(new Set(R.ko[0].flatMap((m) => [m.a, m.b])));

// ---------------- historial categories (from Brazil's point of view)
export type Cat = 'GANA' | 'IGUAL' | 'PIERDE' | 'NUNCA';
export const catOf = (k: string): Cat => { const h = R.h2h[k]; if (!h || h.p === 0) return 'NUNCA'; return h.w > h.l ? 'GANA' : h.w === h.l ? 'IGUAL' : 'PIERDE'; };
export const CAT_COL: Record<Cat, string> = {GANA: '#3DB86B', IGUAL: '#F2B33D', PIERDE: '#E8394A', NUNCA: '#9B8FB0'};
export const CAT_DARK: Record<Cat, string> = {GANA: '#1F7E43', IGUAL: '#B27A10', PIERDE: '#A61E2D', NUNCA: '#5E5375'};
export const CAT_NAME: Record<Cat, string> = {GANA: 'LE DOMINA', IGUAL: 'IGUALADOS', PIERDE: 'LE CUESTA', NUNCA: 'SIN JUGAR'};
export const CAT_STAMP: Record<Cat, string> = {GANA: '¡BRASIL MANDA!', IGUAL: '¡EMPATE TÉCNICO!', PIERDE: '¡HUESO DURO!', NUNCA: '¡NUNCA SE CRUZARON!'};

export type Focus = {kind: 'focus'; k: string; tab: string; dato: string; lines: [string, string]};
export type Group = {kind: 'group'; title: string; keys: string[]; say: string};
export type Step = Focus | Group;
export const SCRIPT: Step[] = [
	{kind: 'group', title: 'SU GRUPO DEL MUNDIAL 2026', keys: ['MAR', 'HTI', 'SCT'], say: '¡Primero de grupo, sin perder!'},
	{kind: 'focus', k: 'JPN', tab: 'LOS SAMURÁIS', dato: 'Brasil le ha ganado 12 de 15, pero Japón le remontó un 0-2 en Tokio (2025). En dieciseisavos del Mundial: Brasil 2-1', lines: ['¡Te remonté en Tokio!', 'Y yo te eché del Mundial']},
	{kind: 'focus', k: 'NOR', tab: 'LA PESADILLA', dato: 'Brasil nunca le ha ganado: 3 derrotas y 2 empates. La última, en los octavos del Mundial 2026', lines: ['¡Haaland te echó del Mundial!', 'Eso fue en la realidad...']},
	{kind: 'focus', k: 'ENG', tab: 'LOS INVENTORES', dato: 'Brasil le ha ganado 12 de 27 partidos. En el Mundial 2002 la eliminó con el gol de falta de Ronaldinho', lines: ['Este año llego a semifinales', 'Si no te cruzas conmigo...']},
	{kind: 'focus', k: 'ARG', tab: 'EL ETERNO RIVAL', dato: 'Según la AFA: 43 victorias de Argentina, 26 empates y 42 de Brasil. Nunca se han cruzado en una semifinal del Mundial', lines: ['Te gano el historial 43 a 42', '¿Y en una semifinal?']},
	{kind: 'focus', k: 'ESP', tab: 'LA CAMPEONA', dato: 'Brasil le ha ganado 5 de 10. En 2013 le ganó la final de la Copa Confederaciones: 3-0 en el Maracaná', lines: ['Este Mundial es mío', 'Ya lo veremos en la final']},
];
export const MATCH_LABEL: Record<AMatch['tag'], string> = {R16: 'OCTAVOS DE FINAL', QF: 'CUARTOS DE FINAL', SF: 'SEMIFINAL', F: 'LA GRAN FINAL'};
export const MATCH_SAY: Record<AMatch['tag'], [string, string]> = {
	R16: ['Noruega... esta vez no', '¡Por fin le gano a Noruega!'],
	QF: ['Inglaterra, como en 2002', '¡A semifinales!'],
	SF: ['¡SUPERCLÁSICO EN SEMIS!', '¡A LA FINAL!'],
	F: ['España... a por la sexta', '¡HEXACAMPEÓN!'],
};
export const PENS: {t: string; who: string; ok: boolean; save?: boolean}[] = [];

// ---------------- Brazil's five stars and the drought (FIFA)
export const STARS: {y: string; host: string[]; hostName: string; opp: string; score: string; city: string; hero: string; dato: string}[] = [
	{y: '1958', host: ['SWE'], hostName: 'SUECIA', opp: 'SWE', score: '5-2', city: 'Solna', hero: 'PELÉ', dato: 'Con 17 años, Pelé marcó dos goles en la final'},
	{y: '1962', host: ['CHL'], hostName: 'CHILE', opp: 'CZE', score: '3-1', city: 'Santiago', hero: 'GARRINCHA', dato: 'Con Pelé lesionado, Garrincha fue el mejor jugador del torneo'},
	{y: '1970', host: ['MEX'], hostName: 'MÉXICO', opp: 'ITA', score: '4-1', city: 'Ciudad de México', hero: 'PELÉ', dato: 'Pelé, el único jugador con tres Mundiales ganados'},
	{y: '1994', host: ['USA'], hostName: 'ESTADOS UNIDOS', opp: 'ITA', score: '0-0 (3-2 pen.)', city: 'Pasadena', hero: 'ROMÁRIO', dato: 'Romário, mejor jugador del Mundial. La primera final decidida en penaltis'},
	{y: '2002', host: ['JPN', 'KOR'], hostName: 'COREA Y JAPÓN', opp: 'DEU', score: '2-0', city: 'Yokohama', hero: 'RONALDO', dato: 'Ronaldo marcó los dos goles de la final y fue el máximo goleador (8)'},
];
export const DROUGHT: {y: string; round: string; opp: string; score: string}[] = [
	{y: '2006', round: 'CUARTOS', opp: 'FRA', score: '0-1'},
	{y: '2010', round: 'CUARTOS', opp: 'NLD', score: '1-2'},
	{y: '2014', round: 'SEMIFINAL', opp: 'DEU', score: '1-7'},
	{y: '2018', round: 'CUARTOS', opp: 'BEL', score: '1-2'},
	{y: '2022', round: 'CUARTOS', opp: 'HRV', score: '1-1 (2-4 pen.)'},
	{y: '2026', round: 'OCTAVOS', opp: 'NOR', score: '1-2'},
];
// World Cup titles (men): real vs alternative (Brazil beats Spain in the 2026 final)
export const TITLES: {key: string; real: number; alt: number}[] = [
	{key: 'BRA', real: 5, alt: 6}, {key: 'DEU', real: 4, alt: 4}, {key: 'ITA', real: 4, alt: 4}, {key: 'ARG', real: 3, alt: 3},
	{key: 'FRA', real: 2, alt: 2}, {key: 'URY', real: 2, alt: 2}, {key: 'ESP', real: 2, alt: 1}, {key: 'ENG', real: 1, alt: 1},
];
