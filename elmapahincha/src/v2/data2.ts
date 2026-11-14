import world from '../world.json';
import tour from '../v2tour.json';

export type St = 'dom' | 'even' | 'neg' | 'never';
export type Rival = {name: string; es: string; key: string; flag: string; conf: string; st: St; p: number; w: number; d: number; l: number; gf: number; ga: number; first: string; last: string; fact: string; fact2: string | null};
export const WORLD = world as unknown as Record<string, {d: string; c: [number, number]; b: [[number, number], [number, number]]}>;
export const TOUR = tour as Rival[];

export const ST_COL: Record<St, string> = {dom: '#2EC46B', even: '#FFD23F', neg: '#FF8A3D', never: '#E63946'};
export const ST_TXT: Record<St, string> = {dom: 'DOMINA', even: 'IGUALADO', neg: 'EN CONTRA', never: 'NUNCA HA GANADO'};
export const CONF_ES: Record<string, string> = {CONMEBOL: 'SUDAMÉRICA', CONCACAF: 'NORTE, CENTROAMÉRICA Y CARIBE', UEFA: 'EUROPA', CAF: 'ÁFRICA', AFC: 'ASIA Y OCEANÍA'};

// small countries: give them a minimum visible size
export const bboxOf = (k: string) => {
	const b = WORLD[k].b;
	let [x0, y0] = b[0], [x1, y1] = b[1];
	const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
	const minS = 14;
	if (x1 - x0 < minS) { x0 = cx - minS / 2; x1 = cx + minS / 2; }
	if (y1 - y0 < minS) { y0 = cy - minS / 2; y1 = cy + minS / 2; }
	return {x0, y0, x1, y1, cx, cy, w: x1 - x0, h: y1 - y0};
};
export const isTiny = (k: string) => {
	const b = WORLD[k].b;
	return Math.max(b[1][0] - b[0][0], b[1][1] - b[0][1]) < 14;
};
export const TOTALS = TOUR.reduce((a, r) => ({p: a.p + r.p, w: a.w + r.w, d: a.d + r.d, l: a.l + r.l}), {p: 0, w: 0, d: 0, l: 0});
export const NEVER = TOUR.filter((r) => r.st === 'never');
