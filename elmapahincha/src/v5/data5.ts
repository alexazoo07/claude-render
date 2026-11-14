import tour from './tour5.json';

export type St = 'dom' | 'even' | 'neg' | 'never';
export type Rival = {
	name: string; es: string; key: string; flag: string; conf: string; st: St; p: number; w: number; d: number; l: number; gf: number; ga: number;
	first: string; firstScore: string; last: string; lastScore: string; lastT: string;
	bw: {s: string; y: string} | null; bl: {s: string; y: string} | null; wc: number; seq: string; streak: {t: string; n: number}; pens: {y: string; win: boolean; t: string}[];
};
export const TOUR = tour as Rival[];
export const NORWAY = TOUR.find((r) => r.key === 'NOR')!;
export const ST_COL: Record<St, string> = {dom: '#2EC46B', even: '#FFD23F', neg: '#FF8A3D', never: '#E63946'};
export const ST_TXT: Record<St, string> = {dom: 'DOMINA', even: 'IGUALADO', neg: 'EN CONTRA', never: 'NUNCA HA GANADO'};
export const CONF_ES: Record<string, string> = {CONMEBOL: 'SUDAMÉRICA', CONCACAF: 'NORTE, CENTROAMÉRICA Y CARIBE', UEFA: 'EUROPA', CAF: 'ÁFRICA', AFC: 'ASIA Y OCEANÍA'};
export const TOTALS = TOUR.reduce((a, r) => ({p: a.p + r.p, w: a.w + r.w, d: a.d + r.d, l: a.l + r.l, gf: a.gf + r.gf, ga: a.ga + r.ga}), {p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0});
export const BEATEN = TOUR.filter((r) => r.w > 0).length;

// hand-written moments (well-documented matches, all present in the results dataset)
export const MOMENTS: Record<string, string[]> = {
	ARG: ['Su gran rival: 110 partidos, el duelo más repetido de Brasil', 'Final de la Copa América 2021: Argentina ganó 0-1 en el Maracaná'],
	URY: ['1950, el "Maracanazo": Uruguay le ganó el Mundial en Río (1-2)'],
	PRY: ['Paraguay le eliminó por penaltis en las Copas América 2011 y 2015'],
	CHL: ['Brasil eliminó a Chile en 4 Mundiales: 1962, 1998, 2010 y 2014'],
	DEU: ['2002: Brasil ganó la final del Mundial (2-0)', '2014: el 1-7 de Belo Horizonte, en su propio Mundial'],
	ITA: ['Dos finales de Mundial ganadas: 1970 (4-1) y 1994 (penaltis)'],
	FRA: ['1998: Francia le ganó la final del Mundial (0-3)'],
	NLD: ['Le eliminó en 1974 y 2010, y le ganó el tercer puesto de 2014 (0-3)'],
	SWE: ['1958: su primer Mundial, ganando la final 5-2 con Pelé de 17 años'],
	HUN: ['1954: la "Batalla de Berna", Hungría ganó 2-4 en cuartos del Mundial'],
	ENG: ['2002: Brasil eliminó a Inglaterra en cuartos del Mundial (2-1)'],
	ESP: ['2013: Brasil arrolló a España en la final de la Copa Confederaciones (3-0)'],
};

export const TICKER: string[] = [
	'BRASIL ES LA ÚNICA SELECCIÓN QUE HA JUGADO TODOS LOS MUNDIALES',
	'5 MUNDIALES: 1958, 1962, 1970, 1994 Y 2002',
	`${TOTALS.p.toLocaleString('es-ES')} PARTIDOS ANALIZADOS · ${TOTALS.w} VICTORIAS · ${TOTALS.d} EMPATES · ${TOTALS.l} DERROTAS`,
	'PELÉ, EL ÚNICO JUGADOR CON 3 MUNDIALES (1958, 1962 Y 1970)',
	`${TOTALS.gf.toLocaleString('es-ES')} GOLES A FAVOR Y ${TOTALS.ga} EN CONTRA`,
	'9 COPAS AMÉRICA Y 4 COPAS CONFEDERACIONES',
	'1950: EL MARACANAZO, URUGUAY GANA EL MUNDIAL EN RÍO',
	'2014: EL 1-7 CONTRA ALEMANIA EN BELO HORIZONTE',
	'DATOS: SELECCIÓN ABSOLUTA HASTA OCT. 2026 · PENALTIS = EMPATE · RUSIA INCLUYE LA URSS, SERBIA A YUGOSLAVIA Y CHEQUIA A CHECOSLOVAQUIA · SIN CATALUÑA NI LA RDA',
];
export const ALL_FLAGS5 = [...TOUR.map((r) => r.flag), 'br'];
