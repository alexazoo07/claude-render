import {geoMercator} from 'd3-geo';
import geo from './geo3.json';

export type Iso = string;
export const proj = geoMercator().center([-88, 33]).scale(1000).translate([960, 540]);
export const P = (lon: number, lat: number): [number, number] => proj([lon, lat]) as [number, number];

export type Team = {iso: Iso; name: string; short: string; rank: number; pts: number; scarf: [string, string]; label: [number, number] | null; flag: string};

// Strength: FIFA ranking points, 7 Oct 2026 (football-ranking.com, CONCACAF table)
export const TEAMS: Team[] = [
	{iso: 'MEX', name: 'México', short: 'MEX', rank: 10, pts: 1754.3, scarf: ['#006847', '#FFFFFF'], label: [-102.5, 24], flag: 'mx'},
	{iso: 'USA', name: 'Estados Unidos', short: 'USA', rank: 16, pts: 1690.33, scarf: ['#B22234', '#FFFFFF'], label: [-99, 39.5], flag: 'us'},
	{iso: 'CAN', name: 'Canadá', short: 'CAN', rank: 30, pts: 1571.34, scarf: ['#D80621', '#FFFFFF'], label: [-100, 54], flag: 'ca'},
	{iso: 'PAN', name: 'Panamá', short: 'PAN', rank: 44, pts: 1478.41, scarf: ['#DA121A', '#072357'], label: null, flag: 'pa'},
	{iso: 'CRI', name: 'Costa Rica', short: 'CRC', rank: 51, pts: 1456.03, scarf: ['#CE1126', '#002B7F'], label: null, flag: 'cr'},
	{iso: 'HND', name: 'Honduras', short: 'HON', rank: 66, pts: 1378.97, scarf: ['#0073CF', '#FFFFFF'], label: null, flag: 'hn'},
	{iso: 'JAM', name: 'Jamaica', short: 'JAM', rank: 71, pts: 1357.84, scarf: ['#009B3A', '#FED100'], label: null, flag: 'jm'},
	{iso: 'CUW', name: 'Curazao', short: 'CUW', rank: 82, pts: 1285.64, scarf: ['#002B7F', '#F9E814'], label: null, flag: 'cw'},
	{iso: 'HTI', name: 'Haití', short: 'HAI', rank: 88, pts: 1264.58, scarf: ['#00209F', '#D21034'], label: null, flag: 'ht'},
	{iso: 'GTM', name: 'Guatemala', short: 'GUA', rank: 97, pts: 1238.74, scarf: ['#4997D0', '#FFFFFF'], label: null, flag: 'gt'},
	{iso: 'SLV', name: 'El Salvador', short: 'SLV', rank: 100, pts: 1225.34, scarf: ['#0047AB', '#FFFFFF'], label: null, flag: 'sv'},
	{iso: 'TTO', name: 'Trinidad y Tobago', short: 'TRI', rank: 101, pts: 1219.59, scarf: ['#CE1126', '#000000'], label: null, flag: 'tt'},
	{iso: 'NIC', name: 'Nicaragua', short: 'NCA', rank: 131, pts: 1114.63, scarf: ['#0067C6', '#FFFFFF'], label: null, flag: 'ni'},
	{iso: 'DOM', name: 'República Dominicana', short: 'DOM', rank: 144, pts: 1076.5, scarf: ['#002D62', '#CE1126'], label: null, flag: 'do'},
	{iso: 'PRI', name: 'Puerto Rico', short: 'PUR', rank: 154, pts: 1024.3, scarf: ['#ED0000', '#0050F0'], label: null, flag: 'pr'},
	{iso: 'CUB', name: 'Cuba', short: 'CUB', rank: 164, pts: 981.42, scarf: ['#002A8F', '#CF142B'], label: [-79.5, 21.9], flag: 'cu'},
	{iso: 'BLZ', name: 'Belice', short: 'BLZ', rank: 180, pts: 907.0, scarf: ['#003F87', '#CE1126'], label: null, flag: 'bz'},
];
export const T = Object.fromEntries(TEAMS.map((t) => [t.iso, t])) as Record<Iso, Team>;

// land borders + short sea links (dashed on the map)
const NB: Record<string, string[]> = {
	MEX: ['USA', 'GTM', 'BLZ', 'CUB'], USA: ['CAN', 'MEX', 'CUB'], CAN: ['USA'], GTM: ['MEX', 'BLZ', 'SLV', 'HND'], BLZ: ['MEX', 'GTM'],
	SLV: ['GTM', 'HND'], HND: ['GTM', 'SLV', 'NIC'], NIC: ['HND', 'CRI'], CRI: ['NIC', 'PAN'], PAN: ['CRI', 'CUW'],
	CUB: ['MEX', 'USA', 'JAM', 'HTI'], JAM: ['CUB', 'HTI'], HTI: ['DOM', 'CUB', 'JAM'], DOM: ['HTI', 'PRI', 'CUW'], PRI: ['DOM', 'TTO'],
	TTO: ['PRI', 'CUW'], CUW: ['PAN', 'DOM', 'TTO'],
};
export const SEA_LINKS: [string, string][] = [['MEX', 'CUB'], ['USA', 'CUB'], ['CUB', 'JAM'], ['CUB', 'HTI'], ['JAM', 'HTI'], ['DOM', 'PRI'], ['PRI', 'TTO'], ['TTO', 'CUW'], ['CUW', 'DOM'], ['PAN', 'CUW']];

type GeoTeam = {d: string; c: [number, number]; b: [[number, number], [number, number]]; nb: string[]};
const g = geo as unknown as {teams: Record<string, Omit<GeoTeam, 'nb'>>; bg: string[]};
export const GEO = {teams: Object.fromEntries(Object.entries(g.teams).map(([k, v]) => [k, {...v, nb: NB[k]}])) as Record<Iso, GeoTeam>, bg: g.bg};

export const winProb = (a: Iso, b: Iso) => 1 / (Math.pow(10, -(T[a].pts - T[b].pts) / 600) + 1);
export const POP_ORDER: Iso[] = ['CAN', 'USA', 'MEX', 'CUB', 'BLZ', 'GTM', 'HND', 'SLV', 'NIC', 'JAM', 'HTI', 'DOM', 'PRI', 'CRI', 'PAN', 'CUW', 'TTO'];
export {C} from '../data';
