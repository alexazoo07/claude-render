import run from './run14.json';

// ---------------- types
export type Goal = {t: string; m: number; who: string};
export type AMatch = {tag: 'G1' | 'G2' | 'G3' | 'R16' | 'QF' | 'SF' | 'F'; o: string; ga: number; gb: number; et: boolean; pens: [number, number] | null; goals: Goal[]; pos: number; sha: number; shb: number; p: [number, number, number]; city: string; stadium: string; elo: [number, number]};
export type Row = {t: string; pts: number; w: number; d: number; l: number; gf: number; ga: number};
export type KO = {a: string; b: string; ga: number; gb: number; et: boolean; pens: [number, number] | null; win: string};
type Run = {
	groups: Record<string, string[]>; tables: Record<string, Row[]>; gm: Record<string, {a: string; b: string; ga: number; gb: number}[]>; thirds: string[]; ko: KO[][];
	arg: AMatch[]; elo: Record<string, number>; sims: {N: number; champ: Record<string, number>; reach: Record<string, number>; elim: Record<string, number>; finals: Record<string, number>};
	h2h: Record<string, {p: number; w: number; d: number; l: number; gf: number; ga: number}>; tot: {p: number; w: number; d: number; l: number}; wc: {p: number; w: number; d: number; l: number};
	es: Record<string, string>; flag: Record<string, string>;
};
export const R = run as unknown as Run;
export const NAME = R.es;
export const FL = R.flag;
export const TEAMS23 = Object.keys(R.h2h);

// ---------------- historial categories (from Argentina's point of view)
export type Cat = 'GANA' | 'IGUAL' | 'PIERDE' | 'NUNCA';
export const catOf = (k: string): Cat => { const h = R.h2h[k]; if (!h || h.p === 0) return 'NUNCA'; return h.w > h.l ? 'GANA' : h.w === h.l ? 'IGUAL' : 'PIERDE'; };
export const CAT_COL: Record<Cat, string> = {GANA: '#3DB86B', IGUAL: '#F2B33D', PIERDE: '#E8394A', NUNCA: '#9B8FB0'};
export const CAT_DARK: Record<Cat, string> = {GANA: '#1F7E43', IGUAL: '#B27A10', PIERDE: '#A61E2D', NUNCA: '#5E5375'};
export const CAT_NAME: Record<Cat, string> = {GANA: 'LE DOMINA', IGUAL: 'IGUALADOS', PIERDE: 'LE CUESTA', NUNCA: 'SIN JUGAR'};
export const CAT_STAMP: Record<Cat, string> = {GANA: '¡ARGENTINA MANDA!', IGUAL: '¡EMPATE TÉCNICO!', PIERDE: '¡HUESO DURO!', NUNCA: '¡NUNCA SE CRUZARON!'};

export type Focus = {kind: 'focus'; k: string; tab: string; dato: string; lines: [string, string]};
export type Group = {kind: 'group'; title: string; keys: string[]; say: string};
export type Step = Focus | Group;
export const SCRIPT: Step[] = [
	{kind: 'focus', k: 'DEU', tab: 'LA MANNSCHAFT', dato: 'Es el europeo al que más veces ha ganado (10). Pero en Mundiales solo una: la final del 86 (3-2).', lines: ['¿Te acuerdas de Götze en 2014?', '¿Y vos de Burruchaga en el 86?']},
	{kind: 'focus', k: 'ITA', tab: 'LA AZZURRA', dato: 'Finalissima 2022 en Wembley: Argentina le ganó 3-0 a la campeona de Europa.', lines: ['Tengo cuatro estrellas, ¿y tú?', 'Tres... y en Wembley te hice tres']},
	{kind: 'group', title: 'OTROS GIGANTES', keys: ['PRT', 'CHE', 'BEL', 'HRV'], say: '¡A estos les tengo tomada la medida!'},
	{kind: 'focus', k: 'NLD', tab: 'LA ORANJE', dato: 'Solo 1 victoria en 10 partidos: la final del Mundial 78 (3-1). En 2014 y 2022 pasó en los penaltis.', lines: ['Solo me has ganado una vez', 'Sí... la final de un Mundial']},
	{kind: 'focus', k: 'FRA', tab: 'LES BLEUS', dato: 'Final de Qatar 2022: 3-3 y Argentina campeona en los penaltis. En 2018 Francia ganó 4-3.', lines: ['Mbappé te metió tres en la final', 'Y la copa me la llevé yo']},
	{kind: 'group', title: 'EL NORTE DE EUROPA', keys: ['NOR', 'DNK', 'SWE', 'SCT', 'IRL'], say: 'El frío del norte se me atraganta...'},
	{kind: 'focus', k: 'ENG', tab: 'THE THREE LIONS', dato: '1986: la Mano de Dios y el Gol del Siglo. Y en el Mundial 2026, 2-1 en la semifinal.', lines: ['Esta vez juegas en mi casa', 'Mejor. Que lo vea todo Wembley']},
	{kind: 'group', title: 'CENTRO Y BALCANES', keys: ['AUT', 'GRC', 'HUN', 'SVN', 'BIH'], say: '¡Solo una derrota en 16 partidos!'},
	{kind: 'focus', k: 'ESP', tab: 'LA ROJA · CAMPEONA DEL MUNDO', dato: 'Le ganó la final del Mundial 2026: 1-0 en la prórroga con gol de Ferran Torres.', lines: ['Soy campeona de Europa y del mundo', 'Disfrútalo... por poco tiempo']},
	{kind: 'group', title: 'NUNCA SE HAN CRUZADO', keys: ['TUR', 'KOS', 'UKR'], say: '¡A estos ni los conozco!'},
];
export const MATCH_LABEL: Record<AMatch['tag'], string> = {G1: 'JORNADA 1 · GRUPO C', G2: 'JORNADA 2 · GRUPO C', G3: 'JORNADA 3 · GRUPO C', R16: 'OCTAVOS DE FINAL', QF: 'CUARTOS DE FINAL', SF: 'SEMIFINAL', F: 'LA GRAN FINAL'};
export const MATCH_SAY: Record<AMatch['tag'], [string, string]> = {
	G1: ['¡A ver qué tal esa Eurocopa!', '¡Primera victoria en Europa!'],
	G2: ['Croacia... otra vez nos vemos', '¡Tres de Kramarić! Me complica todo'],
	G3: ['Hay que ganar a Bosnia sí o sí', '¡Qué locura! Casi me quedo fuera'],
	R16: ['Alemania... tenemos cuentas pendientes', '¡Esta va por la final de 2014!'],
	QF: ['La revancha de Qatar 2022', '¡Francia, otra vez a casa!'],
	SF: ['A un paso de la final en Wembley', '¡A LA FINAL!'],
	F: ['La revancha del Mundial 2026', '¡CAMPEONA DE EUROPA!'],
};
// penalty shootout in the final (Spain shoots first)
export const PENS: {t: string; who: string; ok: boolean; save?: boolean}[] = [
	{t: 'ESP', who: 'Oyarzabal', ok: true}, {t: 'ARG', who: 'Julián Álvarez', ok: true},
	{t: 'ESP', who: 'Pedri', ok: false, save: true}, {t: 'ARG', who: 'Lautaro Martínez', ok: true},
	{t: 'ESP', who: 'Lamine Yamal', ok: true}, {t: 'ARG', who: 'Enzo Fernández', ok: false},
	{t: 'ESP', who: 'Merino', ok: true}, {t: 'ARG', who: 'Mac Allister', ok: true},
	{t: 'ESP', who: 'Dani Olmo', ok: false, save: true}, {t: 'ARG', who: 'Nico Paz', ok: true},
];
