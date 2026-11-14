import path from './arg2026.json';

export type M = {date: string; opp: string; gf: number; ga: number; city: string; h2h: number[]; wcPrev: number};
export const PATH = path as M[];
export const OPP: Record<string, {key: string; flag: string; es: string}> = {
	Algeria: {key: 'DZA', flag: 'dz', es: 'Argelia'}, Austria: {key: 'AUT', flag: 'at', es: 'Austria'}, Jordan: {key: 'JOR', flag: 'jo', es: 'Jordania'},
	'Cape Verde': {key: 'CPV', flag: 'cv', es: 'Cabo Verde'}, Egypt: {key: 'EGY', flag: 'eg', es: 'Egipto'}, Switzerland: {key: 'CHE', flag: 'ch', es: 'Suiza'},
	England: {key: 'ENG', flag: 'gb-eng', es: 'Inglaterra'}, Spain: {key: 'ESP', flag: 'es', es: 'España'},
};
export const ROUND = ['FASE DE GRUPOS · J1', 'FASE DE GRUPOS · J2', 'FASE DE GRUPOS · J3', 'DIECISEISAVOS', 'OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'LA FINAL'];
// host cities in the world-map projection (NaturalEarth1, scale 700)
export const CITY: Record<string, [number, number]> = {'Kansas City': [983.3, 517.1], Arlington: [935.2, 595.5], 'Miami Gardens': [1088.6, 679.7], Atlanta: [1066.2, 583.1], 'East Rutherford': [1190.8, 496.0]};
export const CITY_ES: Record<string, string> = {'Kansas City': 'Kansas City', Arlington: 'Arlington (Dallas)', 'Miami Gardens': 'Miami', Atlanta: 'Atlanta', 'East Rutherford': 'Nueva York / Nueva Jersey'};

// World Cup titles (men)
export const TITLES: {key: string; flag: string; es: string; real: number; alt: number}[] = [
	{key: 'BRA', flag: 'br', es: 'Brasil', real: 5, alt: 5},
	{key: 'DEU', flag: 'de', es: 'Alemania', real: 4, alt: 4},
	{key: 'ITA', flag: 'it', es: 'Italia', real: 4, alt: 4},
	{key: 'ARG', flag: 'ar', es: 'Argentina', real: 3, alt: 4},
	{key: 'FRA', flag: 'fr', es: 'Francia', real: 2, alt: 2},
	{key: 'URY', flag: 'uy', es: 'Uruguay', real: 2, alt: 2},
	{key: 'ESP', flag: 'es', es: 'España', real: 2, alt: 1},
	{key: 'ENG', flag: 'gb-eng', es: 'Inglaterra', real: 1, alt: 1},
];
// Argentina in World Cup finals
export const FINALS: {y: string; opp: string; flag: string; s: string; w: boolean; alt?: boolean}[] = [
	{y: '1930', opp: 'Uruguay', flag: 'uy', s: '2-4', w: false},
	{y: '1978', opp: 'Países Bajos', flag: 'nl', s: '3-1', w: true},
	{y: '1986', opp: 'Alemania', flag: 'de', s: '3-2', w: true},
	{y: '1990', opp: 'Alemania', flag: 'de', s: '0-1', w: false},
	{y: '2014', opp: 'Alemania', flag: 'de', s: '0-1', w: false},
	{y: '2022', opp: 'Francia', flag: 'fr', s: '3-3 (pen.)', w: true},
	{y: '2026', opp: 'España', flag: 'es', s: '0-1', w: false, alt: true},
];
// Elo (World Football Elo method) computed from the full dataset; ALT = same data with the 2026 final flipped
export const ELO: {key: string; flag: string; es: string; real: number; alt: number}[] = [
	{key: 'ESP', flag: 'es', es: 'España', real: 2367, alt: 2316},
	{key: 'ARG', flag: 'ar', es: 'Argentina', real: 2254, alt: 2313},
	{key: 'ENG', flag: 'gb-eng', es: 'Inglaterra', real: 2229, alt: 2225},
	{key: 'FRA', flag: 'fr', es: 'Francia', real: 2188, alt: 2188},
	{key: 'PRT', flag: 'pt', es: 'Portugal', real: 2144, alt: 2144},
];
export type React_ = {key: string; flag: string; es: string; mood: 'grito' | 'feliz' | 'triste' | 'enfado' | 'miedo'; line: string; sub: string; col: string};
export const REACT: React_[] = [
	{key: 'BGD', flag: 'bd', es: 'Bangladés', mood: 'grito', line: '¡FIESTA NACIONAL... OTRA VEZ!', sub: 'En 2022, decenas de miles de personas celebraron en las calles de Daca', col: '#FF4FA0'},
	{key: 'IND', flag: 'in', es: 'India', mood: 'grito', line: 'KERALA SE VUELVE LOCA', sub: 'En 2022 levantaron un Messi gigante de cartón en mitad de un río', col: '#FF4FA0'},
	{key: 'HTI', flag: 'ht', es: 'Haití', mood: 'feliz', line: 'MÚSICA EN LA CALLE', sub: 'Miles de haitianos siguen y celebran a Argentina desde los años 70', col: '#FF4FA0'},
	{key: 'BRA', flag: 'br', es: 'Brasil', mood: 'miedo', line: 'SU RIVAL SE ACERCA', sub: 'Argentina se quedaría a una sola estrella de Brasil: 4 contra 5', col: '#FF8A3D'},
	{key: 'URY', flag: 'uy', es: 'Uruguay', mood: 'triste', line: 'EL VECINO, CON EL DOBLE', sub: 'Argentina tendría el doble de Mundiales que Uruguay: 4 contra 2', col: '#FF8A3D'},
	{key: 'ITA', flag: 'it', es: 'Italia', mood: 'enfado', line: 'IGUALADA A 4', sub: 'Italia dejaría de tener más Mundiales que Argentina', col: '#FFD23F'},
	{key: 'DEU', flag: 'de', es: 'Alemania', mood: 'enfado', line: 'TAMBIÉN IGUALADA', sub: 'Alemania, Italia y Argentina, empatadas a 4 estrellas', col: '#FFD23F'},
	{key: 'ENG', flag: 'gb-eng', es: 'Inglaterra', mood: 'enfado', line: 'ELIMINADA POR EL CAMPEÓN', sub: 'Argentina la eliminó en semifinales (2-1): su rivalidad más caliente', col: '#E63946'},
	{key: 'ESP', flag: 'es', es: 'España', mood: 'triste', line: 'SIN SU SEGUNDA ESTRELLA', sub: 'Se quedaría con un solo Mundial (2010)', col: '#E63946'},
];
export const ALL_FLAGS7 = ['ar', 'es', 'dz', 'at', 'jo', 'cv', 'eg', 'ch', 'gb-eng', 'br', 'de', 'it', 'fr', 'uy', 'nl', 'pt', 'bd', 'in', 'ht', 'ma', 'py', 'us', 'mx', 'ca', 'sa', 'be', 'no'];

// ---------- extra data (dataset: international results + goalscorers) ----------
import eloHist from './elohist.json';
export const ELO_HIST = eloHist as {Argentina: [string, number][]; Spain: [string, number][]};
// Argentina goals per match (minute, scorer); og = own goal by rival, rival = goal against
export const GOALS: {m: number; who: string; rival?: boolean; og?: boolean; pen?: boolean}[][] = [
	[{m: 17, who: 'Messi'}, {m: 60, who: 'Messi'}, {m: 76, who: 'Messi'}],
	[{m: 38, who: 'Messi'}, {m: 90, who: 'Messi'}],
	[{m: 19, who: 'Lo Celso'}, {m: 31, who: 'Lautaro', pen: true}, {m: 55, who: 'Al-Taamari', rival: true}, {m: 80, who: 'Messi'}],
	[{m: 29, who: 'Messi'}, {m: 59, who: 'Deroy Duarte', rival: true}, {m: 92, who: 'Lisandro M.'}, {m: 103, who: 'Lopes Cabral', rival: true}, {m: 111, who: 'Diney (p.p.)', og: true}],
	[{m: 15, who: 'Yasser Ibrahim', rival: true}, {m: 67, who: 'Ziko', rival: true}, {m: 79, who: 'Romero'}, {m: 83, who: 'Messi'}, {m: 90, who: 'Enzo'}],
	[{m: 10, who: 'Mac Allister'}, {m: 67, who: 'Ndoye', rival: true}, {m: 112, who: 'Julián Álvarez'}, {m: 120, who: 'Lautaro'}],
	[{m: 55, who: 'Gordon', rival: true}, {m: 85, who: 'Enzo'}, {m: 90, who: 'Lautaro'}],
	[{m: 0, who: 'Ferran Torres (prórroga)', rival: true}],
];
export const MATCH_NOTE = [
	'Hat-trick de Messi en el debut',
	'Messi marca los dos goles',
	'Primera vez contra Jordania en un Mundial',
	'Sufrió hasta la prórroga ante Cabo Verde',
	'Remontada: perdía 0-2 en el minuto 78',
	'Dos goles en la prórroga',
	'Remontada en los últimos cinco minutos',
	'Perdió en la prórroga',
];
// 19 Dec 2022 -> 10 Jun 2026
export const PRE = {p: 39, w: 32, d: 3, l: 4, gf: 85, ga: 14, copa: 6};
export const GROUP: {key: string; flag: string; es: string; pj: number; g: number; e: number; p: number; gf: number; gc: number; pts: number}[] = [
	{key: 'ARG', flag: 'ar', es: 'Argentina', pj: 3, g: 3, e: 0, p: 0, gf: 8, gc: 1, pts: 9},
	{key: 'AUT', flag: 'at', es: 'Austria', pj: 3, g: 1, e: 1, p: 1, gf: 6, gc: 6, pts: 4},
	{key: 'DZA', flag: 'dz', es: 'Argelia', pj: 3, g: 1, e: 1, p: 1, gf: 5, gc: 7, pts: 4},
	{key: 'JOR', flag: 'jo', es: 'Jordania', pj: 3, g: 0, e: 0, p: 3, gf: 3, gc: 8, pts: 0},
];
export const TOPSC: {who: string; flag: string; n: number}[] = [
	{who: 'Kylian Mbappé', flag: 'fr', n: 10}, {who: 'Lionel Messi', flag: 'ar', n: 8}, {who: 'Erling Haaland', flag: 'no', n: 7},
	{who: 'Jude Bellingham', flag: 'gb-eng', n: 7}, {who: 'Harry Kane', flag: 'gb-eng', n: 6}, {who: 'Ousmane Dembélé', flag: 'fr', n: 6}, {who: 'Mikel Oyarzabal', flag: 'es', n: 5},
];
export const ARG_SC_LIST: [string, number][] = [['Messi', 8], ['Lautaro Martínez', 3], ['Enzo Fernández', 2], ['Lo Celso', 1], ['Lisandro Martínez', 1], ['Romero', 1], ['Mac Allister', 1], ['Julián Álvarez', 1], ['Gol en propia puerta', 1]];
export const SPAIN_PATH: {opp: string; flag: string; gf: number; ga: number; city: [number, number]; cityEs: string; r: string}[] = [
	{opp: 'Cabo Verde', flag: 'cv', gf: 0, ga: 0, city: [1066.1, 583.1], cityEs: 'Atlanta', r: 'GRUPOS'},
	{opp: 'Arabia Saudí', flag: 'sa', gf: 4, ga: 0, city: [1066.1, 583.1], cityEs: 'Atlanta', r: 'GRUPOS'},
	{opp: 'Uruguay', flag: 'uy', gf: 1, ga: 0, city: [836.5, 745.0], cityEs: 'Guadalajara', r: 'GRUPOS'},
	{opp: 'Austria', flag: 'at', gf: 3, ga: 0, city: [725.6, 580.7], cityEs: 'Los Ángeles', r: 'DIECISEISAVOS'},
	{opp: 'Portugal', flag: 'pt', gf: 1, ga: 0, city: [935.1, 595.5], cityEs: 'Dallas', r: 'OCTAVOS'},
	{opp: 'Bélgica', flag: 'be', gf: 2, ga: 1, city: [725.6, 580.7], cityEs: 'Los Ángeles', r: 'CUARTOS'},
	{opp: 'Francia', flag: 'fr', gf: 2, ga: 0, city: [935.1, 595.5], cityEs: 'Dallas', r: 'SEMIFINAL'},
	{opp: 'Argentina', flag: 'ar', gf: 1, ga: 0, city: [1190.8, 496.0], cityEs: 'Nueva York / NJ', r: 'FINAL'},
];
export const ELO_PRE = {esp: 2304, arg: 2279, pEsp: 54, pArg: 46};
export const H2H: {y: string; s: string; w: 'A' | 'E' | 'D'; t: string}[] = [
	{y: '1952', s: '1-0', w: 'A', t: 'Amistoso'}, {y: '1953', s: '1-0', w: 'A', t: 'Amistoso'}, {y: '1960', s: '2-0', w: 'A', t: 'Amistoso'}, {y: '1961', s: '0-2', w: 'E', t: 'Amistoso'},
	{y: '1966', s: '2-1', w: 'A', t: 'Mundial'}, {y: '1972', s: '0-1', w: 'E', t: 'Amistoso'}, {y: '1974', s: '1-1', w: 'D', t: 'Amistoso'}, {y: '1988', s: '1-1', w: 'D', t: 'Amistoso'},
	{y: '1995', s: '1-2', w: 'E', t: 'Amistoso'}, {y: '1999', s: '2-0', w: 'A', t: 'Amistoso'}, {y: '2006', s: '1-2', w: 'E', t: 'Amistoso'}, {y: '2009', s: '1-2', w: 'E', t: 'Amistoso'},
	{y: '2010', s: '4-1', w: 'A', t: 'Amistoso'}, {y: '2018', s: '1-6', w: 'E', t: 'Amistoso'}, {y: '2026', s: '0-1', w: 'E', t: 'Final Mundial'},
];
// all-time World Cup match wins (results incl. extra time; shoot-outs count as draws)
export const WCWINS: {key: string; flag: string; es: string; real: number; alt: number}[] = [
	{key: 'BRA', flag: 'br', es: 'Brasil', real: 79, alt: 79}, {key: 'DEU', flag: 'de', es: 'Alemania', real: 70, alt: 70}, {key: 'ARG', flag: 'ar', es: 'Argentina', real: 54, alt: 55},
	{key: 'FRA', flag: 'fr', es: 'Francia', real: 45, alt: 45}, {key: 'ITA', flag: 'it', es: 'Italia', real: 45, alt: 45}, {key: 'ESP', flag: 'es', es: 'España', real: 38, alt: 37}, {key: 'ENG', flag: 'gb-eng', es: 'Inglaterra', real: 38, alt: 38},
];
