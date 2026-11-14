import {geoMercator} from 'd3-geo';
import geo from './geo6.json';
import teams from './teams6.json';

export type Iso = string;
export const proj = geoMercator().center([14, 55]).scale(900).translate([960, 540]);
export const P = (lon: number, lat: number): [number, number] => proj([lon, lat]) as [number, number];

export type Team = {iso: Iso; name: string; short: string; rank: number; pts: number; scarf: [string, string]; label: [number, number] | null; flag: string};

// Strength: Elo rating computed from every international result in the dataset (until Oct 2026)
export const TEAMS: Team[] = (teams as any[]).map((t) => ({iso: t.iso, name: t.name, short: t.iso, rank: t.rank, pts: t.elo, scarf: t.scarf, label: t.label, flag: t.flag}));
export const T = Object.fromEntries(TEAMS.map((t) => [t.iso, t])) as Record<Iso, Team>;

export const SEA_LINKS: [string, string][] = [['ENG', 'FRA'], ['ENG', 'NLD'], ['SCT', 'NIR'], ['WLS', 'IRL'], ['ISL', 'FRO'], ['FRO', 'SCT'], ['FRO', 'NOR'], ['DNK', 'SWE'], ['DNK', 'NOR'], ['FIN', 'EST'], ['MLT', 'ITA'], ['CYP', 'TUR'], ['CYP', 'GRC'], ['CYP', 'ISR'], ['ISR', 'TUR'], ['ITA', 'ALB']];
const NB: Record<string, string[]> = {};
for (const [k, v] of Object.entries((geo as any).nb as Record<string, string[]>)) NB[k] = [...v];
for (const [a, b] of SEA_LINKS) { NB[a].push(b); NB[b].push(a); }

type GeoTeam = {d: string; c: [number, number]; b: [[number, number], [number, number]]; pb: number[][]; nb: string[]};
const g = geo as unknown as {teams: Record<string, Omit<GeoTeam, 'nb'>>; bg: string[]};
export const GEO = {teams: Object.fromEntries(Object.entries(g.teams).map(([k, v]) => [k, {...v, nb: NB[k]}])) as Record<Iso, GeoTeam>, bg: g.bg};

// European-only boxes for the giants (so empire flags are sized to Europe, not Siberia)
const box = (lo0: number, la0: number, lo1: number, la1: number): [[number, number], [number, number]] => { const a = P(lo0, la0), b = P(lo1, la1); return [[Math.min(a[0], b[0]), Math.min(a[1], b[1])], [Math.max(a[0], b[0]), Math.max(a[1], b[1])]]; };
export const EU_BOX: Record<string, [[number, number], [number, number]]> = {RUS: box(27, 70, 60, 42), KAZ: box(46, 55, 70, 40)};
export const boxOf = (k: Iso) => EU_BOX[k] ?? GEO.teams[k].b;
export const BONUS = 15;
export const winProb = (a: Iso, b: Iso) => 1 / (Math.pow(10, -(T[a].pts - T[b].pts) / 400) + 1);
export const POP_ORDER: Iso[] = TEAMS.map((t) => t.iso);
export {C} from '../data';
