import tour from './tour8.json';
import never from './never8.json';

export type St = 'dom' | 'even' | 'neg' | 'never';
export type Rival = {
	name: string; es: string; key: string; flag: string; conf: string; st: St; p: number; w: number; d: number; l: number; gf: number; ga: number;
	first: string; firstScore: string; last: string; lastScore: string; lastT: string;
	bw: {s: string; y: string} | null; bl: {s: string; y: string} | null; wc: number; seq: string; streak: {t: string; n: number}; pens: {y: string; win: boolean; t: string}[];
};
export type Game = {y: string; s: string; t: string; c: string; res: string};
export const TOUR = tour as Rival[];
export const NEVER_GAMES = never as Record<string, Game[]>;
// the 13 teams Mexico has never beaten, in reveal order (countdown 13 -> 1)
export const NEVER_ORDER = ['UZB', 'KWT', 'JOR', 'QAT', 'TUN', 'LBY', 'ISR', 'LUX', 'SVN', 'ROU', 'BLR', 'PRT', 'ESP'];
export const NEVER = NEVER_ORDER.map((k) => TOUR.find((r) => r.key === k)!);
export const SMALL_NEVER = NEVER.slice(0, 11);
export const PORTUGAL = TOUR.find((r) => r.key === 'PRT')!;
export const SPAIN = TOUR.find((r) => r.key === 'ESP')!;
export const ST_COL: Record<St, string> = {dom: '#2EC46B', even: '#FFD23F', neg: '#FF8A3D', never: '#E63946'};
export const ST_TXT: Record<St, string> = {dom: 'DOMINA', even: 'IGUALADO', neg: 'EN CONTRA', never: 'NUNCA HA GANADO'};
export const CONF_ES: Record<string, string> = {CONMEBOL: 'SUDAMÉRICA', CONCACAF: 'NORTE, CENTROAMÉRICA Y CARIBE', UEFA: 'EUROPA', CAF: 'ÁFRICA', AFC: 'ASIA Y OCEANÍA'};
export const TOTALS = TOUR.reduce((a, r) => ({p: a.p + r.p, w: a.w + r.w, d: a.d + r.d, l: a.l + r.l, gf: a.gf + r.gf, ga: a.ga + r.ga}), {p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0});
export const BEATEN = TOUR.filter((r) => r.w > 0).length;

// hand-written moments (every match checked in the results dataset)
export const MOMENTS: Record<string, string[]> = {
	USA: ['Su gran rival: 76 partidos, el duelo más repetido de México', '"Dos a cero": 4 derrotas 2-0 en Columbus (2001, 2005, 2009 y 2013)'],
	BRA: ['1999: México ganó la final de la Copa Confederaciones en el Azteca (4-3)', 'Brasil le ganó en 4 Mundiales: 1950, 1954, 1962 y 2018'],
	ARG: ['Argentina le eliminó en octavos de 2006 (2-1) y 2010 (3-1)'],
	CHL: ['Copa América 2016: Chile le goleó 0-7 en cuartos de final'],
	DEU: ['2018: México ganó 1-0 a Alemania, la campeona, en el Mundial'],
	FRA: ['2010: México ganó 2-0 a Francia en el Mundial de Sudáfrica'],
	ENG: ['2026: Inglaterra le eliminó de su Mundial en octavos (2-3, Ciudad de México)'],
	NLD: ['2014: Países Bajos le remontó en octavos del Mundial (1-2)'],
	SWE: ['2018: Suecia le goleó 0-3 en el Mundial de Rusia'],
	ITA: ['Tres Mundiales contra Italia: 1970 (1-4), 1994 (1-1) y 2002 (1-1)'],
	KOR: ['Le ha ganado en 3 Mundiales: 1998, 2018 y 2026'],
	POL: ['2022: 0-0 en el Mundial de Catar'],
	ZAF: ['Dos partidos inaugurales de Mundial: 2010 (1-1) y 2026 (2-0)'],
	HRV: ['2014: México ganó 3-1 a Croacia en el Mundial de Brasil'],
	ECU: ['2026: México eliminó a Ecuador en dieciseisavos de su Mundial (2-0)'],
	CZE: ['2026: México goleó 3-0 a Chequia en la fase de grupos'],
};

export const TICKER: string[] = [
	'MÉXICO, ANFITRIÓN DE 3 MUNDIALES: 1970, 1986 Y 2026',
	`${TOTALS.p.toLocaleString('es-ES')} PARTIDOS ANALIZADOS · ${TOTALS.w} VICTORIAS · ${TOTALS.d} EMPATES · ${TOTALS.l} DERROTAS`,
	'1999: CAMPEÓN DE LA COPA CONFEDERACIONES, 4-3 A BRASIL EN LA FINAL',
	`${TOTALS.gf.toLocaleString('es-ES')} GOLES A FAVOR Y ${TOTALS.ga.toLocaleString('es-ES')} EN CONTRA`,
	'2026: OCTAVOS DE FINAL EN SU MUNDIAL, ELIMINADO POR INGLATERRA (2-3)',
	'EL RIVAL MÁS REPETIDO: ESTADOS UNIDOS, 76 PARTIDOS',
	'DATOS: SELECCIÓN ABSOLUTA HASTA OCT. 2026 · PENALTIS = EMPATE · RUSIA INCLUYE LA URSS, SERBIA A YUGOSLAVIA Y CHEQUIA A CHECOSLOVAQUIA · SIN EUSKADI, RDA NI TERRITORIOS FRANCESES',
];
export const ALL_FLAGS8 = [...TOUR.map((r) => r.flag), 'mx'];
