import {geoMercator} from 'd3-geo';
import geo from './geo.json';
import type {Iso} from './flags';

export const proj = geoMercator().center([-60, -21]).scale(780).translate([960, 540]);
export const P = (lon: number, lat: number): [number, number] => proj([lon, lat]) as [number, number];

export type Team = {
	iso: Iso;
	name: string;
	short: string;
	rank: number; // FIFA ranking, 7 Oct 2026
	pts: number;
	scarf: [string, string];
	label: [number, number]; // lon, lat for face
};

// Source: FIFA/Coca-Cola Men's World Ranking published 7 Oct 2026
// (Pregón de Jujuy 7-10-2026; Opinión Bolivia 8-10-2026 for Bolivia).
export const TEAMS: Team[] = [
	{iso: 'ARG', name: 'Argentina', short: 'ARG', rank: 2, pts: 1972.8, scarf: ['#74ACDF', '#FFFFFF'], label: [-65.5, -36]},
	{iso: 'BRA', name: 'Brasil', short: 'BRA', rank: 6, pts: 1806.51, scarf: ['#FEDD00', '#009C3B'], label: [-51.5, -9.5]},
	{iso: 'COL', name: 'Colombia', short: 'COL', rank: 11, pts: 1735.8, scarf: ['#FCD116', '#003893'], label: [-73.5, 4]},
	{iso: 'URY', name: 'Uruguay', short: 'URU', rank: 20, pts: 1635.54, scarf: ['#0038A8', '#FFFFFF'], label: [-56, -32.7]},
	{iso: 'ECU', name: 'Ecuador', short: 'ECU', rank: 24, pts: 1587.07, scarf: ['#FFDD00', '#034EA2'], label: [-78.3, -1.5]},
	{iso: 'PRY', name: 'Paraguay', short: 'PAR', rank: 33, pts: 1552.3, scarf: ['#D52B1E', '#FFFFFF'], label: [-58.3, -23.3]},
	{iso: 'VEN', name: 'Venezuela', short: 'VEN', rank: 49, pts: 1465.87, scarf: ['#CF142B', '#FFCC00'], label: [-65.8, 7]},
	{iso: 'CHL', name: 'Chile', short: 'CHI', rank: 50, pts: 1458.97, scarf: ['#D52B1E', '#0039A6'], label: [-69.6, -24.5]},
	{iso: 'PER', name: 'Perú', short: 'PER', rank: 53, pts: 1450.95, scarf: ['#D91023', '#FFFFFF'], label: [-75, -9.8]},
	{iso: 'BOL', name: 'Bolivia', short: 'BOL', rank: 78, pts: 1322.19, scarf: ['#007934', '#F9E300'], label: [-64.6, -16.6]},
];
export const T = Object.fromEntries(TEAMS.map((t) => [t.iso, t])) as Record<Iso, Team>;

type GeoTeam = {d: string; c: [number, number]; b: [[number, number], [number, number]]; nb: string[]};
export const GEO = geo as unknown as {teams: Record<Iso, GeoTeam>; bg: string[]};

// FIFA ranking formula for expected result: We = 1 / (10^(-dr/600) + 1)
export const winProb = (a: Iso, b: Iso) => 1 / (Math.pow(10, -(T[a].pts - T[b].pts) / 600) + 1);

// Pop-in order on the map (north to south)
export const POP_ORDER: Iso[] = ['VEN', 'COL', 'ECU', 'BRA', 'PER', 'BOL', 'PRY', 'CHL', 'URY', 'ARG'];

export const C = {
	navy: '#0B1E3F',
	ink: '#0B1E3F',
	yellow: '#FFD23F',
	red: '#E63946',
	green: '#1E8E4E',
	green2: '#24A05A',
	ocean: '#123A6B',
	ocean2: '#16467F',
	land: '#3B4A63',
	white: '#FFFFFF',
};
