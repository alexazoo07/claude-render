import {geoNaturalEarth1} from 'd3-geo';
import feat from './feat16.json';
import sim from './sim16.json';

const proj = geoNaturalEarth1().scale(700).translate([1915, 1000]);
export const LL = (lon: number, lat: number): [number, number] => proj([lon, lat]) as [number, number];
export const CITY = {
	ROSARIO: LL(-60.65, -32.95), BARCELONA: LL(2.17, 41.39), BAIRES: LL(-58.38, -34.6), BUDAPEST: LL(19.04, 47.5), MOSCU: LL(37.6, 55.75), LONDRES: LL(-0.13, 51.5),
};

export type FMatch = {round: string; opp: string; sc: [number, number]; pens: [number, number] | null; et: boolean; p: number; p0?: number; win: boolean; messi: number; real: [number, number] | null};
export type FTour = {champ_p: number; boost: number; elo: number; elo_m: number; matches: FMatch[]; champ: boolean; before: [string, number, number, string][]};
export const FEAT = feat as unknown as {esp: Record<string, FTour>; arg: Record<string, {with: number; without: number}>};
type SimT = {id: string; champ: number; base_champ: number};
export const SIMF = sim as unknown as {ESP: SimT[]; ARG: SimT[]};
export const simOf = (team: 'ESP' | 'ARG', id: string) => SIMF[team].find((x) => x.id === id)!;

export const NAME: Record<string, string> = {
	ESP: 'España', ARG: 'Argentina', FRA: 'Francia', BRA: 'Brasil', PRT: 'Portugal', ITA: 'Italia', NLD: 'Países Bajos', CHL: 'Chile', AUS: 'Australia', MEX: 'México',
	CRI: 'Costa Rica', DEU: 'Alemania', RUS: 'Rusia', HRV: 'Croacia', ENG: 'Inglaterra', MAR: 'Marruecos', AUT: 'Austria', CHE: 'Suiza', ZAF: 'Sudáfrica', POL: 'Polonia',
	UKR: 'Ucrania', QAT: 'Catar', USA: 'Estados Unidos', CAN: 'Canadá', HUN: 'Hungría', PRY: 'Paraguay', COL: 'Colombia',
};
export const FL: Record<string, string> = {
	ESP: 'es', ARG: 'ar', FRA: 'fr', BRA: 'br', PRT: 'pt', ITA: 'it', NLD: 'nl', CHL: 'cl', AUS: 'au', MEX: 'mx', CRI: 'cr', DEU: 'de', RUS: 'ru', HRV: 'hr', ENG: 'gb-eng',
	MAR: 'ma', AUT: 'at', CHE: 'ch', ZAF: 'za', POL: 'pl', UKR: 'ua', QAT: 'qa', USA: 'us', CAN: 'ca', HUN: 'hu', PRY: 'py', COL: 'co',
};

export type Cup = 'WC' | 'EU';
export type Tour = {id: string; label: string; host: string[]; hostName: string; age: number; cup: Cup; kind: 'real' | 'replay'; real: string; say: [string, string]};
export const TOURS: Tour[] = [
	{id: 'WC2006', label: 'MUNDIAL 2006', host: ['DEU'], hostName: 'ALEMANIA', age: 19, cup: 'WC', kind: 'replay', real: 'Octavos: España 1-3 Francia', say: ['¡Mi primer Mundial con la Roja!', 'Brasil... aún soy muy joven']},
	{id: 'EU2008', label: 'EUROCOPA 2008', host: ['AUT', 'CHE'], hostName: 'AUSTRIA Y SUIZA', age: 21, cup: 'EU', kind: 'real', real: 'Final: Alemania 0-1 España (Viena)', say: ['¡Campeona de Europa!', '']},
	{id: 'WC2010', label: 'MUNDIAL 2010', host: ['ZAF'], hostName: 'SUDÁFRICA', age: 23, cup: 'WC', kind: 'real', real: 'Final: Países Bajos 0-1 España (prórroga)', say: ['¡Mi primera estrella!', '']},
	{id: 'EU2012', label: 'EUROCOPA 2012', host: ['POL', 'UKR'], hostName: 'POLONIA Y UCRANIA', age: 25, cup: 'EU', kind: 'real', real: 'Final: España 4-0 Italia (Kiev)', say: ['¡Bicampeona de Europa!', '']},
	{id: 'WC2014', label: 'MUNDIAL 2014', host: ['BRA'], hostName: 'BRASIL', age: 27, cup: 'WC', kind: 'replay', real: 'Fuera en grupos: 1-5 Países Bajos y 0-2 Chile', say: ['Esta vez no me pasa lo del 1-5', '¡CAMPEONA EN EL MARACANÁ!']},
	{id: 'EU2016', label: 'EUROCOPA 2016', host: ['FRA'], hostName: 'FRANCIA', age: 29, cup: 'EU', kind: 'replay', real: 'Octavos: Italia 2-0 España', say: ['Italia, esta vez no', 'Alemania en los penaltis...']},
	{id: 'WC2018', label: 'MUNDIAL 2018', host: ['RUS'], hostName: 'RUSIA', age: 31, cup: 'WC', kind: 'replay', real: 'Octavos: España 1-1 Rusia (3-4 en penaltis)', say: ['Rusia en casa... a por ellos', '¡TERCERA ESTRELLA!']},
	{id: 'EU2020', label: 'EUROCOPA 2020', host: ['ENG', 'ITA', 'DEU', 'ESP'], hostName: 'TODA EUROPA (2021)', age: 34, cup: 'EU', kind: 'replay', real: 'Semifinal: Italia 1-1 España (4-2 en penaltis)', say: ['A la final en Wembley', 'Wembley... otra vez los penaltis']},
	{id: 'WC2022', label: 'MUNDIAL 2022', host: ['QAT'], hostName: 'CATAR', age: 35, cup: 'WC', kind: 'replay', real: 'Octavos: Marruecos 0-0 España (3-0 en penaltis)', say: ['Marruecos, esta vez sí', '¡Cristiano me ganó esta!']},
	{id: 'EU2024', label: 'EUROCOPA 2024', host: ['DEU'], hostName: 'ALEMANIA', age: 37, cup: 'EU', kind: 'real', real: 'Final: España 2-1 Inglaterra (Berlín)', say: ['¡Cuarta Eurocopa!', '']},
	{id: 'WC2026', label: 'MUNDIAL 2026', host: ['USA', 'MEX', 'CAN'], hostName: 'EE. UU., MÉXICO Y CANADÁ', age: 39, cup: 'WC', kind: 'real', real: 'Final: España 1-0 Argentina (prórroga)', say: ['¡Y en la final, Argentina!', '']},
];
// real titles of Spain since 2006 (in order)
export const REAL_TITLES: {id: string; cup: Cup}[] = [{id: 'EU2008', cup: 'EU'}, {id: 'WC2010', cup: 'WC'}, {id: 'EU2012', cup: 'EU'}, {id: 'EU2024', cup: 'EU'}, {id: 'WC2026', cup: 'WC'}];

// Argentina without Messi
export type ATitle = {id: string; label: string; host: string[]; real: string; withP: number; withoutP: number; verdict: string; keeps: boolean};
export const ATITLES: ATitle[] = [
	{id: 'CA2021', label: 'COPA AMÉRICA 2021', host: ['BRA'], real: 'Final: Brasil 0-1 Argentina (Maracaná)', withP: FEAT.arg.CA2021.with, withoutP: FEAT.arg.CA2021.without, verdict: 'SIN MESSI: CAE EN CUARTOS', keeps: false},
	{id: 'FIN2022', label: 'FINALISSIMA 2022', host: ['ENG'], real: 'Italia 0-3 Argentina (Wembley)', withP: FEAT.arg.FIN2022.with, withoutP: FEAT.arg.FIN2022.without, verdict: 'SIN MESSI: ¡GANA, PERO A CARA O CRUZ!', keeps: true},
	{id: 'WC2022', label: 'MUNDIAL 2022', host: ['QAT'], real: 'Final: Argentina 3-3 Francia (4-2 en penaltis)', withP: FEAT.arg.WC2022.with, withoutP: FEAT.arg.WC2022.without, verdict: 'SIN MESSI: CAE EN CUARTOS (PAÍSES BAJOS)', keeps: false},
	{id: 'CA2024', label: 'COPA AMÉRICA 2024', host: ['USA'], real: 'Final: Argentina 1-0 Colombia (prórroga)', withP: FEAT.arg.CA2024.with, withoutP: FEAT.arg.CA2024.without, verdict: 'SIN MESSI: ¡SIGUE CAMPEONA!', keeps: true},
];
