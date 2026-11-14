import React from 'react';
import {NeverCfg, NeverShort} from './Never';
import bra from './bra_opp.json';
import esp from './esp_opp.json';
import mex from './mex_opp.json';

export const C_BRA: NeverCfg = {
	hero: 'BRA', heroName: 'Brasil', stars: 5, heroCam: ['BRA', 'ARG', 'COL'], heroW: 760, opp: bra as any, since: '1914',
	rivals: [['ARG', 'Argentina'], ['DEU', 'Alemania'], ['FRA', 'Francia']],
	featured: 'NOR', featuredName: 'Noruega', featuredCam: {z: 4.6, dx: -18, dy: 20},
	dato: 'En el Mundial 2026, Haaland le marcó dos goles y la eliminó en octavos', heroLine: '¡No puede ser!', esNames: {},
};
export const C_ESP: NeverCfg = {
	hero: 'ESP', heroName: 'España', stars: 2, heroCam: ['ESP', 'PRT', 'FRA'], heroW: 860, opp: esp as any, since: '1920',
	rivals: [['ARG', 'Argentina'], ['FRA', 'Francia'], ['ITA', 'Italia']],
	featured: 'CPV', featuredName: 'Cabo Verde', featuredCam: {z: 14, dx: 0, dy: -8}, faceMax: 170,
	dato: 'Solo han jugado una vez: 0-0 en el debut de España en el Mundial 2026... que luego ganó', heroLine: '¡Solo jugamos una vez!', esNames: {},
};
export const C_MEX: NeverCfg = {
	hero: 'MEX', heroName: 'México', stars: 0, heroCam: ['MEX', 'GTM'], heroW: 780, opp: mex as any, since: '1923',
	rivals: [['BRA', 'Brasil'], ['ARG', 'Argentina'], ['DEU', 'Alemania']],
	featured: 'ESP', featuredName: 'España', featuredCam: {z: 3.2, dx: 0, dy: 10},
	dato: 'Tampoco le ha ganado nunca a Portugal: 0 victorias en 6 partidos', heroLine: '¡Algún día te ganaré!', esNames: {},
};
export const Short1: React.FC = () => <NeverShort c={C_BRA} />;
export const Short4: React.FC = () => <NeverShort c={C_ESP} />;
export const Short6: React.FC = () => <NeverShort c={C_MEX} />;

// ---------------- duels
import {DuelCfg, DuelShort} from './Duel';
import argbra from './arg_bra.json';
import espprt from './esp_prt.json';
export const D_ARGBRA: DuelCfg = {
	a: 'ARG', b: 'BRA', an: 'Argentina', bn: 'Brasil', aw: 330, bw: 640, colA: '#5AA9E6', colB: '#2EB24C', ms: argbra as any, cam: ['ARG', 'BRA'],
	key: [
		{y: '1990', ga: 1, gb: 0, tag: 'MUNDIAL', note: 'Caniggia elimina a Brasil en octavos'},
		{y: '2007', ga: 0, gb: 3, tag: 'FINAL COPA AMÉRICA', note: 'Brasil arrolla a Argentina en Maracaibo'},
		{y: '2021', ga: 1, gb: 0, tag: 'FINAL COPA AMÉRICA', note: 'Di María gana la final en el Maracaná'},
	],
	dato: 'Argentina lleva 1 victoria de ventaja. Su último golpe: 4-1 en Buenos Aires (marzo de 2025)', aLine: '', bLine: '', question: '¿QUIÉN ES|MEJOR?',
	final: [43, 26, 42], foot: 'Historial según la AFA: 111 partidos (1914 - 5 de noviembre de 2026)',
};
export const D_ESPPRT: DuelCfg = {
	a: 'ESP', b: 'PRT', an: 'España', bn: 'Portugal', aw: 640, bw: 300, colA: '#E23B3B', colB: '#1E8E4E', ms: espprt as any, cam: ['ESP', 'PRT'],
	key: [
		{y: '2010', ga: 1, gb: 0, tag: 'MUNDIAL', note: 'Villa elimina a Portugal camino del título'},
		{y: '2018', ga: 3, gb: 3, tag: 'MUNDIAL', note: 'Hat-trick de Cristiano en Sochi'},
		{y: '2026', ga: 1, gb: 0, tag: 'MUNDIAL', note: 'Gol de Merino en octavos: España, campeona'},
	],
	dato: 'Con 18 empates, Portugal es el rival contra el que España más ha empatado', aLine: '', bLine: '', question: '¿QUIÉN ES|MEJOR?',
};
export const Short2: React.FC = () => <DuelShort c={D_ARGBRA} />;
export const Short5: React.FC = () => <DuelShort c={D_ESPPRT} />;

// ---------------- batch 2 (Nov 2026): shorts from long videos already published
import ury from './ury_opp.json';
import arg from './arg_opp.json';
import uryarg from './ury_arg.json';
import braury from './bra_ury.json';
import espita from './esp_ita.json';
import espnld from './esp_nld.json';
import espfra from './esp_fra.json';
import argeng from './arg_eng.json';
export const C_URY: NeverCfg = {
	hero: 'URY', heroName: 'Uruguay', stars: 2, heroCam: ['URY', 'ARG', 'BRA'], heroW: 620, opp: ury as any, since: '1902',
	rivals: [['BRA', 'Brasil'], ['ARG', 'Argentina'], ['ITA', 'Italia']],
	featured: 'ESP', featuredName: 'España', featuredCam: {z: 3.2, dx: 0, dy: 10},
	dato: '11 partidos sin ganarle. El último, 0-1 en el Mundial 2026, que la dejó fuera', heroLine: '¡Algún día caerás!', esNames: {},
};
export const C_ARG: NeverCfg = {
	hero: 'ARG', heroName: 'Argentina', stars: 3, heroCam: ['ARG', 'CHL', 'URY'], heroW: 420, opp: arg as any, since: '1901',
	rivals: [['BRA', 'Brasil'], ['DEU', 'Alemania'], ['FRA', 'Francia']],
	featured: 'CMR', featuredName: 'Camerún', featuredCam: {z: 3.6, dx: 0, dy: 0},
	dato: 'En el estreno del Mundial 1990, Camerún le ganó 1-0... acabando con 9 jugadores', heroLine: '¡No me lo recuerdes!', esNames: {},
};
export const Short8: React.FC = () => <NeverShort c={C_URY} />;
export const Short9: React.FC = () => <NeverShort c={C_ARG} />;
const Q = '¿QUIÉN ES|MEJOR?';
export const D_URYARG: DuelCfg = {
	a: 'URY', b: 'ARG', an: 'Uruguay', bn: 'Argentina', aw: 560, bw: 330, colA: '#1C5FB8', colB: '#5AA9E6', ms: uryarg as any, cam: ['URY', 'ARG'],
	key: [
		{y: '1930', ga: 4, gb: 2, tag: 'FINAL DEL MUNDIAL', note: 'Uruguay gana el primer Mundial de la historia'},
		{y: '2011', ga: 1, gb: 1, tag: 'COPA AMÉRICA', note: 'Uruguay elimina a Argentina en los penaltis'},
		{y: '2023', ga: 2, gb: 0, tag: 'ELIMINATORIAS', note: 'Uruguay gana en la Bombonera'},
	],
	dato: 'Es el partido entre selecciones más repetido de la historia: 183 veces', aLine: '', bLine: '', question: Q,
	foot: 'Historial: 183 partidos (1902 - 2025). Los penaltis cuentan como empate',
};
export const D_BRAURY: DuelCfg = {
	a: 'BRA', b: 'URY', an: 'Brasil', bn: 'Uruguay', aw: 640, bw: 420, colA: '#2EB24C', colB: '#1C5FB8', ms: braury as any, cam: ['BRA', 'URY'],
	key: [
		{y: '1950', ga: 1, gb: 2, tag: 'MUNDIAL', note: 'El Maracanazo: Uruguay, campeón en Río'},
		{y: '1970', ga: 3, gb: 1, tag: 'SEMIFINAL MUNDIAL', note: 'Brasil se venga en Guadalajara'},
		{y: '2024', ga: 0, gb: 0, tag: 'COPA AMÉRICA', note: 'Uruguay elimina a Brasil en los penaltis'},
	],
	dato: 'Brasil le ha ganado 37 de 79... pero Uruguay le quitó el Mundial 1950 en su casa', aLine: '', bLine: '', question: Q,
	foot: 'Historial: 79 partidos (1916 - 2024). Los penaltis cuentan como empate',
};
export const D_ESPITA: DuelCfg = {
	a: 'ESP', b: 'ITA', an: 'España', bn: 'Italia', aw: 640, bw: 420, colA: '#E23B3B', colB: '#1E5FD8', ms: espita as any, cam: ['ESP', 'ITA'],
	key: [
		{y: '2008', ga: 0, gb: 0, tag: 'EUROCOPA', note: 'Casillas para dos penaltis en cuartos'},
		{y: '2012', ga: 4, gb: 0, tag: 'FINAL EUROCOPA', note: 'La mayor goleada de una final de la Eurocopa'},
		{y: '2016', ga: 0, gb: 2, tag: 'EUROCOPA', note: 'Italia elimina a la campeona en octavos'},
	],
	dato: 'Se han cruzado en cinco Eurocopas seguidas: de 2008 a 2024', aLine: '', bLine: '', question: Q,
	foot: 'Historial: 41 partidos (1920 - 2024). Los penaltis cuentan como empate',
};
export const D_ESPNLD: DuelCfg = {
	a: 'ESP', b: 'NLD', an: 'España', bn: 'Países Bajos', aw: 640, bw: 420, colA: '#E23B3B', colB: '#FF7A00', ms: espnld as any, cam: ['ESP', 'NLD'],
	key: [
		{y: '2010', ga: 1, gb: 0, tag: 'FINAL DEL MUNDIAL', note: 'Iniesta, minuto 116: España, campeona'},
		{y: '2014', ga: 1, gb: 5, tag: 'MUNDIAL', note: 'La venganza naranja en Salvador'},
		{y: '2025', ga: 3, gb: 3, tag: 'LIGA DE NACIONES', note: 'España pasa en los penaltis en Valencia'},
	],
	dato: 'Países Bajos va por delante: 6 victorias contra 5', aLine: '', bLine: '', question: Q,
	foot: 'Historial: 15 partidos (1920 - 2025). Los penaltis cuentan como empate',
};
export const D_ESPFRA: DuelCfg = {
	a: 'ESP', b: 'FRA', an: 'España', bn: 'Francia', aw: 640, bw: 560, colA: '#E23B3B', colB: '#2F4FB8', ms: espfra as any, cam: ['ESP', 'FRA'],
	key: [
		{y: '1984', ga: 0, gb: 2, tag: 'FINAL EUROCOPA', note: 'El fallo de Arconada'},
		{y: '2024', ga: 2, gb: 1, tag: 'SEMIFINAL EUROCOPA', note: 'El golazo de Lamine Yamal'},
		{y: '2026', ga: 2, gb: 0, tag: 'SEMIFINAL MUNDIAL', note: 'Camino de la segunda estrella'},
	],
	dato: 'España le ha ganado 19 de 39 partidos, con dos semifinales seguidas', aLine: '', bLine: '', question: Q,
	foot: 'Historial: 39 partidos (1922 - 2026). Los penaltis cuentan como empate',
};
export const D_ARGENG: DuelCfg = {
	a: 'ARG', b: 'ENG', an: 'Argentina', bn: 'Inglaterra', aw: 330, bw: 460, colA: '#5AA9E6', colB: '#C8102E', ms: argeng as any, cam: ['ARG', 'ENG'],
	key: [
		{y: '1986', ga: 2, gb: 1, tag: 'MUNDIAL', note: 'La Mano de Dios y el Gol del Siglo'},
		{y: '1998', ga: 2, gb: 2, tag: 'MUNDIAL', note: 'Argentina pasa en los penaltis'},
		{y: '2026', ga: 2, gb: 1, tag: 'SEMIFINAL MUNDIAL', note: 'Argentina la elimina en Atlanta'},
	],
	dato: 'Inglaterra ha ganado 6 y Argentina 4. Se han cruzado en 6 Mundiales', aLine: '', bLine: '', question: Q,
	foot: 'Historial: 16 partidos (1951 - 2026). Los penaltis cuentan como empate',
};
export const Short10: React.FC = () => <DuelShort c={D_URYARG} />;
export const Short11: React.FC = () => <DuelShort c={D_BRAURY} />;
export const Short12: React.FC = () => <DuelShort c={D_ESPITA} />;
export const Short13: React.FC = () => <DuelShort c={D_ESPNLD} />;
export const Short14: React.FC = () => <DuelShort c={D_ESPFRA} />;
export const Short15: React.FC = () => <DuelShort c={D_ARGENG} />;
