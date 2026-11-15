import run from './run28.json';

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

// ---------------- historial categories (from Spain's point of view)
export type Cat = 'GANA' | 'IGUAL' | 'PIERDE' | 'NUNCA';
export const catOf = (k: string): Cat => { const h = R.h2h[k]; if (!h || h.p === 0) return 'NUNCA'; return h.w > h.l ? 'GANA' : h.w === h.l ? 'IGUAL' : 'PIERDE'; };
export const CAT_COL: Record<Cat, string> = {GANA: '#3DB86B', IGUAL: '#F2B33D', PIERDE: '#E8394A', NUNCA: '#9B8FB0'};
export const CAT_DARK: Record<Cat, string> = {GANA: '#1F7E43', IGUAL: '#B27A10', PIERDE: '#A61E2D', NUNCA: '#5E5375'};
export const CAT_NAME: Record<Cat, string> = {GANA: 'LE DOMINA', IGUAL: 'IGUALADOS', PIERDE: 'LE CUESTA', NUNCA: 'SIN JUGAR'};
export const CAT_STAMP: Record<Cat, string> = {GANA: '¡ESPAÑA MANDA!', IGUAL: '¡EMPATE TÉCNICO!', PIERDE: '¡HUESO DURO!', NUNCA: '¡NUNCA SE CRUZARON!'};

export type Focus = {kind: 'focus'; k: string; tab: string; dato: string; lines: [string, string]};
export type Group = {kind: 'group'; title: string; keys: string[]; say: string};
export type Step = Focus | Group;
export const SCRIPT: Step[] = [
	{kind: 'focus', k: 'BRA', tab: 'LA PENTACAMPEONA', dato: 'Es la única de la Copa que le gana el historial: 5 victorias de Brasil, 3 empates y 2 de España. Brasil le ganó 3-0 la final de la Copa Confederaciones 2013.', lines: ['¿Te acuerdas del Maracaná?', 'Esta vez no juegas en casa']},
	{kind: 'focus', k: 'ARG', tab: 'LA ALBICELESTE · 16 COPAS', dato: 'España 7 victorias, Argentina 6 y 2 empates. La última, la final del Mundial 2026: 1-0 con gol de Ferran Torres.', lines: ['Tengo 16 Copas América', 'Y yo me llevé tu Mundial']},
	{kind: 'focus', k: 'URY', tab: 'LA CELESTE · 15 COPAS', dato: 'Uruguay nunca le ha ganado: 6 victorias de España y 5 empates. La última, 1-0 en el Mundial 2026.', lines: ['Tengo 15 Copas América', 'Y ni una victoria contra mí']},
	{kind: 'focus', k: 'COL', tab: 'LOS CAFETEROS', dato: 'La última selección que le ganó: 1-0 en Londres en marzo de 2024. El historial, empatado: 1 victoria cada una y 2 empates.', lines: ['¡Fui la última en ganarte!', 'Y desde entonces, nadie']},
	{kind: 'focus', k: 'CHL', tab: 'LA ROJA', dato: 'España le ha ganado 8 de 11. Pero Chile la eliminó del Mundial 2014 con un 2-0 en Maracaná.', lines: ['¡Te eché en Maracaná!', 'Y yo te he ganado 8 veces']},
	{kind: 'focus', k: 'PRY', tab: 'LA ALBIRROJA', dato: 'Nunca le ha ganado: 2 victorias de España y 2 empates. En los cuartos del Mundial 2010, España ganó 1-0 con gol de Villa.', lines: ['¡Casi te elimino en 2010!', 'Casi... pero gané yo']},
	{kind: 'group', title: 'EL RESTO DE SUDAMÉRICA', keys: ['PER', 'ECU', 'VEN', 'BOL'], say: '¡Ninguno me ha ganado nunca!'},
	{kind: 'focus', k: 'MEX', tab: 'EL TRI', dato: 'México nunca le ha ganado: 4 victorias de España y 3 empates. Se enfrentaron por primera vez en los Juegos Olímpicos de 1928.', lines: ['¡Esta vez te gano!', 'Llevas casi 100 años intentándolo']},
	{kind: 'focus', k: 'USA', tab: 'EL ANFITRIÓN', dato: 'Le ganó la semifinal de la Copa Confederaciones 2009 (2-0). Los otros 4 partidos los ganó España.', lines: ['¡Te corté la racha en 2009!', 'Y desde entonces, 4 a 0']},
	{kind: 'group', title: 'EL RESTO DE CONCACAF', keys: ['CAN', 'PAN', 'CRI'], say: '¡Ninguno me ha ganado nunca!'},
];
export const MATCH_LABEL: Record<AMatch['tag'], string> = {G1: 'JORNADA 1 · GRUPO D', G2: 'JORNADA 2 · GRUPO D', G3: 'JORNADA 3 · GRUPO D', R16: 'OCTAVOS DE FINAL', QF: 'CUARTOS DE FINAL', SF: 'SEMIFINAL', F: 'LA GRAN FINAL'};
export const MATCH_SAY: Record<AMatch['tag'], [string, string]> = {
	G1: ['¡A estrenarme en América!', '¡México me gana por primera vez!'],
	G2: ['Hay que reaccionar ya', '¡Doblete de Nico Williams!'],
	G3: ['Si gano, soy primera de grupo', '¡Primera del grupo D!'],
	R16: ['', ''],
	QF: ['Aquí no hay prórroga: si empato, penaltis', '¡A semifinales!'],
	SF: ['México otra vez... ¡la revancha!', '¡Venganza servida: a la final!'],
	F: ['Argentina, otra final contra ti', '¡CAMPEONA DE AMÉRICA!'],
};
// penalty shootout in the final (Argentina shoots first)
export const PENS: {t: string; who: string; ok: boolean; save?: boolean}[] = [
	{t: 'ARG', who: 'Julián Álvarez', ok: true}, {t: 'ESP', who: 'Oyarzabal', ok: true},
	{t: 'ARG', who: 'Lautaro Martínez', ok: true}, {t: 'ESP', who: 'Pedri', ok: true},
	{t: 'ARG', who: 'Enzo Fernández', ok: false, save: true}, {t: 'ESP', who: 'Lamine Yamal', ok: true},
	{t: 'ARG', who: 'Mac Allister', ok: true}, {t: 'ESP', who: 'Merino', ok: true},
	{t: 'ARG', who: 'Nico Paz', ok: false},
];
