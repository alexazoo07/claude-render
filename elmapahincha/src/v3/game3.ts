import sim from './simlog3.json';
import type {Iso} from './flagimg3';
import {GEO, T, TEAMS} from './data3';

export type War = {t: 'war'; a: Iso; d: Iso; p: number; win: Iso; s: [number, number]};
export type Rebel = {t: 'rebel'; a: Iso; c: Iso};
export type Ev = War | Rebel;

export const LOG = (sim as any).log as Ev[];
export const CHAMP = (sim as any).champ as Iso;
const ALL = TEAMS.map((t) => t.iso);

export type Owners = Record<Iso, Iso>;
export const initialOwners = (): Owners => Object.fromEntries(ALL.map((i) => [i, i])) as Owners;

export const applyEv = (o: Owners, e: Ev): Owners => {
	const n = {...o};
	if (e.t === 'war') {
		const loser = e.win === e.a ? e.d : e.a;
		for (const c of ALL) if (n[c] === loser) n[c] = e.win;
	} else n[e.c] = e.c;
	return n;
};

// states[i] = owners BEFORE event i ; states[LOG.length] = final
export const STATES: Owners[] = (() => {
	const s: Owners[] = [initialOwners()];
	for (const e of LOG) s.push(applyEv(s[s.length - 1], e));
	return s;
})();
export const aliveOf = (o: Owners) => Array.from(new Set(Object.values(o))) as Iso[];
export const territoriesOf = (o: Owners, k: Iso) => ALL.filter((c) => o[c] === k);

// probability shown (same as the simulation): FIFA points + 25 per extra territory
export const effPts = (o: Owners, k: Iso) => T[k].pts + 25 * (territoriesOf(o, k).length - 1);
export const winProbO = (o: Owners, a: Iso, b: Iso) => 1 / (Math.pow(10, -(effPts(o, a) - effPts(o, b)) / 600) + 1);

// closest pair of neighbouring countries between two owners (for the attack arrow)
export const frontPair = (o: Owners, a: Iso, d: Iso): [Iso, Iso] => {
	let best: [Iso, Iso] = [a, d], bd = 1e9;
	for (const c of territoriesOf(o, a))
		for (const n of GEO.teams[c].nb as Iso[]) {
			if (o[n] !== d) continue;
			const [x1, y1] = GEO.teams[c].c, [x2, y2] = GEO.teams[n].c;
			const dist = Math.hypot(x1 - x2, y1 - y2) + (c === a ? -40 : 0) + (n === d ? -40 : 0);
			if (dist < bd) { bd = dist; best = [c, n]; }
		}
	return best;
};

// Verified football facts shown on each duel card
export const FACTS: Record<number, string> = {
	1: 'Final del primer Mundial (1930): Uruguay 4-2 Argentina',
	2: 'Final de la Copa América 2021 en el Maracaná: Argentina 1-0 Brasil',
	3: 'Guerra del Chaco (1932-1935): Paraguay y Bolivia se enfrentaron por el Chaco Boreal',
	4: 'Copa América 2015: Chile ganó a Ecuador en el partido inaugural y acabó campeón',
	5: 'Venezuela es la única selección sudamericana que nunca ha jugado un Mundial',
	7: 'Paraguay ganó la Copa América en 1953 y en 1979',
	8: 'Colombia ganó su única Copa América en 2001, como anfitriona',
	9: 'Ecuador juega de local en Quito, a unos 2.850 metros de altitud',
	12: 'Bolivia juega de local en La Paz, a más de 3.600 metros de altitud',
	14: 'Bolivia ganó la Copa América de 1963, como anfitriona',
	15: 'Brasil es la selección con más Mundiales: 5 (1958, 1962, 1970, 1994 y 2002)',
	16: 'Mundiales: Brasil 5 · Argentina 3 (1978, 1986 y 2022)',
};

// deterministic RNG
export const rand = (seed: number) => {
	let x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
	return x - Math.floor(x);
};

// goal timeline for a duel: returns [{min, by}] sorted, by = 'a' | 'd'
export const goals = (idx: number, e: War) => {
	const wa = e.win === e.a;
	const ga = wa ? e.s[0] : e.s[1];
	const gd = wa ? e.s[1] : e.s[0];
	const list: {min: number; by: 'a' | 'd'}[] = [];
	for (let i = 0; i < ga; i++) list.push({min: 0, by: 'a'});
	for (let i = 0; i < gd; i++) list.push({min: 0, by: 'd'});
	// shuffle deterministically but make the winner score last
	for (let i = list.length - 1; i > 0; i--) {
		const j = Math.floor(rand(idx * 97 + i) * (i + 1));
		[list[i], list[j]] = [list[j], list[i]];
	}
	const wk = wa ? 'a' : 'd';
	const lastW = list.map((g) => g.by).lastIndexOf(wk);
	if (lastW !== list.length - 1) { const g = list.splice(lastW, 1)[0]; list.push(g); }
	const mins = list.map((_, i) => 4 + Math.floor(rand(idx * 31 + i * 7) * 86)).sort((x, y) => x - y);
	// ensure distinct minutes
	for (let i = 1; i < mins.length; i++) if (mins[i] <= mins[i - 1] + 3) mins[i] = Math.min(90, mins[i - 1] + 4);
	return list.map((g, i) => ({...g, min: mins[i]}));
};
