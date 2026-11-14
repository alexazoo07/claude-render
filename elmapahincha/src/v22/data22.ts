import D from './d22.json';
import F3 from '../iso3flag.json';
import NM from '../../tools/v21/names_es.json';

export const FL: Record<string, string> = F3 as Record<string, string>;
export const NAME: Record<string, string> = {...(NM as Record<string, string>), USA: 'Estados Unidos', DEU: 'Alemania', ENG: 'Inglaterra'};
export const OPP = (D as any).opp as Record<string, [number, number, number]>;
export const Y2026 = (D as any).y2026 as string[];

// north -> south tour
export type Team = {k: string; wc: number; fact: string};
export const TEAMS: Team[] = [
	{k: 'MEX', wc: 18, fact: 'Cuartos en 1970 y 1986, las dos en casa'},
	{k: 'GTM', wc: 0, fact: 'Campeona de la Concacaf en 1967'},
	{k: 'SLV', wc: 2, fact: '1970 y 1982. Perdió 10-1 con Hungría'},
	{k: 'HND', wc: 3, fact: '1982, 2010 y 2014'},
	{k: 'NIC', wc: 0, fact: 'Aún sin Mundial... ¡pero sumando!'},
	{k: 'CRI', wc: 6, fact: 'Cuartos en Brasil 2014'},
	{k: 'PAN', wc: 2, fact: 'Rusia 2018 y el Mundial 2026'},
	{k: 'CUB', wc: 1, fact: 'Francia 1938: llegó a cuartos'},
	{k: 'HTI', wc: 2, fact: 'Volvió en 2026... 52 años después'},
	{k: 'DOM', wc: 0, fact: 'Su gran deporte es el béisbol'},
	{k: 'VEN', wc: 0, fact: 'La única de Sudamérica sin Mundial'},
	{k: 'COL', wc: 7, fact: 'Cuartos en 2014 con James, Bota de Oro'},
	{k: 'ECU', wc: 5, fact: 'Debutó en 2002 y ya suma 5'},
	{k: 'PER', wc: 5, fact: 'Cuartos en México 1970'},
	{k: 'BRA', wc: 23, fact: 'La única que ha jugado TODOS: 5 títulos'},
	{k: 'BOL', wc: 3, fact: 'Campeona de América en 1963'},
	{k: 'PRY', wc: 9, fact: 'Cuartos en Sudáfrica 2010'},
	{k: 'CHL', wc: 9, fact: 'Tercera en su Mundial de 1962'},
	{k: 'URY', wc: 15, fact: 'Campeona en 1930 y 1950'},
	{k: 'ARG', wc: 19, fact: 'Campeona en 1978, 1986 y 2022'},
];
export const L = TEAMS.map((t) => t.k);
export const SA = ['VEN', 'COL', 'ECU', 'PER', 'BRA', 'BOL', 'PRY', 'CHL', 'URY', 'ARG'];

export type Ed = {y: number; res: 'C' | 'F' | '3' | '4' | 'QF' | 'R2' | 'R1'; k: string[]; cap: string};
export const EDS: Ed[] = [
	{y: 1930, res: 'C', k: ['URY'], cap: 'La final fue Uruguay-Argentina... ¡final entre compañeros!'},
	{y: 1934, res: 'R1', k: ['BRA', 'ARG'], cap: 'Brasil y Argentina cayeron a la primera'},
	{y: 1938, res: '3', k: ['BRA'], cap: 'Brasil, tercera en Francia'},
	{y: 1950, res: 'C', k: ['URY'], cap: 'Sin Maracanazo: Uruguay y Brasil serían el mismo equipo'},
	{y: 1954, res: '4', k: ['URY'], cap: 'Uruguay, cuarta en Suiza'},
	{y: 1958, res: 'C', k: ['BRA'], cap: 'Aparece un tal Pelé, con 17 años'},
	{y: 1962, res: 'C', k: ['BRA'], cap: 'Bicampeones con Garrincha'},
	{y: 1966, res: 'QF', k: ['ARG', 'URY'], cap: 'Cuartos en Inglaterra'},
	{y: 1970, res: 'C', k: ['BRA'], cap: 'El Brasil de Pelé: 4-1 a Italia en la final'},
	{y: 1974, res: '4', k: ['BRA'], cap: 'Brasil, cuarta en Alemania'},
	{y: 1978, res: 'C', k: ['ARG'], cap: 'Argentina campeona en casa'},
	{y: 1982, res: 'R2', k: ['ARG', 'BRA'], cap: 'Ambas caen en la segunda fase... en España'},
	{y: 1986, res: 'C', k: ['ARG'], cap: 'El Mundial de Maradona'},
	{y: 1990, res: 'F', k: ['ARG'], cap: 'Final perdida 1-0 con Alemania'},
	{y: 1994, res: 'C', k: ['BRA'], cap: 'Brasil gana en los penaltis a Italia'},
	{y: 1998, res: 'F', k: ['BRA'], cap: 'Final perdida 3-0 con Francia'},
	{y: 2002, res: 'C', k: ['BRA'], cap: 'El pentacampeonato de Ronaldo'},
	{y: 2006, res: 'QF', k: ['ARG', 'BRA'], cap: 'Cuartos en Alemania'},
	{y: 2010, res: '4', k: ['URY'], cap: 'El Uruguay de Forlán, cuarto'},
	{y: 2014, res: 'F', k: ['ARG'], cap: 'Final perdida 1-0 con Alemania en la prórroga'},
	{y: 2018, res: 'QF', k: ['BRA', 'URY'], cap: 'Cuartos en Rusia'},
	{y: 2022, res: 'C', k: ['ARG'], cap: 'Qatar: la tercera de Argentina, con Messi'},
	{y: 2026, res: 'F', k: ['ARG'], cap: 'Final perdida 1-0 con España en la prórroga'},
];
export const RES: Record<Ed['res'], [string, string]> = {C: ['¡CAMPEONES!', '#FFD23F'], F: ['FINAL', '#D9DEE6'], '3': ['3º', '#E3A86B'], '4': ['4º', '#C8B8A6'], QF: ['CUARTOS', '#9FB7D9'], R2: ['2ª FASE', '#9FB7D9'], R1: ['1ª RONDA', '#9FB7D9']};

export type Hi = {k: string; title: string; line: string; bubble: string; mood: 'smug' | 'sad' | 'happy' | 'cool' | 'worried'};
export const HIS: Hi[] = [
	{k: 'USA', title: 'EL VECINO DEL NORTE', line: 'Le gana más veces de las que pierde', bubble: '¡Aquí mandamos nosotros!', mood: 'smug'},
	{k: 'DEU', title: 'CUATRO FINALES DEL MUNDIAL', line: '1986 y 2002 para Latinoamérica; 1990 y 2014 para Alemania', bubble: '¡Empate a finales!', mood: 'cool'},
	{k: 'FRA', title: 'FINALES DE 1998 Y 2022', line: 'Una para cada uno: Zidane y Messi', bubble: '¡Esa del 2022 duele!', mood: 'worried'},
	{k: 'ENG', title: 'MÉXICO 1986', line: 'La Mano de Dios y el gol del siglo, en el mismo partido', bubble: '¡Eso fue mano!', mood: 'worried'},
	{k: 'ITA', title: 'DOS FINALES PERDIDAS', line: '1970 (4-1) y 1994 (penaltis), ambas contra Brasil', bubble: '¡Mamma mia!', mood: 'sad'},
	{k: 'JPN', title: 'ASIA, A FAVOR', line: 'Más victorias que derrotas contra Japón', bubble: '¡Algún día ganaremos!', mood: 'sad'},
	{k: 'NGA', title: 'LA MEJOR DE ÁFRICA... CASI', line: 'Le tocó Argentina en 5 Mundiales: 1994, 2002, 2010, 2014 y 2018', bubble: '¡Siempre Argentina!', mood: 'sad'},
	{k: 'AUS', title: 'REPESCAS DE INFARTO', line: 'Uruguay (2001 y 2005) y Honduras (2017)', bubble: '¡Siempre nos toca repesca!', mood: 'worried'},
	{k: 'ESP', title: '¡LA BESTIA NEGRA!', line: 'El peor porcentaje de victorias contra cualquier rival: solo un 16 %', bubble: '¡Y la última, en la final del Mundial!', mood: 'cool'},
];

export type Pl = {n: string; k: string; x: number; y: number; fact: string};
export const XI_NOW: Pl[] = [
	{n: 'Alisson', k: 'BRA', x: 0.5, y: 0.9, fact: 'Campeón de Europa con el Liverpool'},
	{n: 'Cuti Romero', k: 'ARG', x: 0.22, y: 0.72, fact: 'Campeón del mundo en 2022'},
	{n: 'Gabriel', k: 'BRA', x: 0.5, y: 0.75, fact: 'Nominado al Balón de Oro 2026'},
	{n: 'Willian Pacho', k: 'ECU', x: 0.78, y: 0.72, fact: 'Nominado al Balón de Oro 2026'},
	{n: 'Mac Allister', k: 'ARG', x: 0.1, y: 0.47, fact: 'Campeón del mundo en 2022'},
	{n: 'Caicedo', k: 'ECU', x: 0.37, y: 0.51, fact: 'El ancla de Ecuador'},
	{n: 'Enzo', k: 'ARG', x: 0.63, y: 0.51, fact: 'Mejor joven del Mundial 2022'},
	{n: 'Fede Valverde', k: 'URY', x: 0.9, y: 0.47, fact: 'El motor de Uruguay'},
	{n: 'Vinícius Jr.', k: 'BRA', x: 0.2, y: 0.2, fact: 'Nominado al Balón de Oro 2026'},
	{n: 'Lautaro Martínez', k: 'ARG', x: 0.5, y: 0.13, fact: 'Nominado al Balón de Oro 2026'},
	{n: 'Luis Díaz', k: 'COL', x: 0.8, y: 0.2, fact: 'Nominado al Balón de Oro 2026'},
];
export const BENCH_NOW: [string, string][] = [['Dibu Martínez', 'ARG'], ['Julián Quiñones', 'MEX'], ['Marquinhos', 'BRA'], ['Raphinha', 'BRA'], ['Piero Hincapié', 'ECU']];
export const XI_LEG: Pl[] = [
	{n: 'Chilavert', k: 'PRY', x: 0.5, y: 0.9, fact: 'El portero que tiraba las faltas'},
	{n: 'Roberto Carlos', k: 'BRA', x: 0.12, y: 0.68, fact: 'Campeón del mundo en 2002'},
	{n: 'Passarella', k: 'ARG', x: 0.37, y: 0.74, fact: 'Capitán campeón en 1978'},
	{n: 'Elías Figueroa', k: 'CHL', x: 0.63, y: 0.74, fact: '3 veces mejor jugador de América'},
	{n: 'Cafú', k: 'BRA', x: 0.88, y: 0.68, fact: '3 finales del Mundial seguidas'},
	{n: 'Valderrama', k: 'COL', x: 0.25, y: 0.47, fact: '111 partidos con Colombia'},
	{n: 'Francescoli', k: 'URY', x: 0.5, y: 0.52, fact: '3 Copas América'},
	{n: 'Maradona', k: 'ARG', x: 0.75, y: 0.47, fact: 'El Mundial de México 86'},
	{n: 'Pelé', k: 'BRA', x: 0.2, y: 0.2, fact: '3 Mundiales ganados'},
	{n: 'Ronaldo', k: 'BRA', x: 0.5, y: 0.13, fact: '15 goles en Mundiales'},
	{n: 'Messi', k: 'ARG', x: 0.8, y: 0.2, fact: '8 Balones de Oro'},
];
export const BENCH_LEG: [string, string][] = [['Hugo Sánchez', 'MEX'], ['Cubillas', 'PER'], ['Alberto Spencer', 'ECU'], ['Zamorano', 'CHL'], ['Luis Suárez', 'URY']];

export type Trow = {label: string; n: number; parts: [string, number][]};
export const CAB: Trow[] = [
	{label: 'MUNDIALES', n: 10, parts: [['BRA', 5], ['ARG', 3], ['URY', 2]]},
	{label: 'COPAS AMÉRICA', n: 48, parts: [['ARG', 16], ['URY', 15], ['BRA', 9], ['PRY', 2], ['PER', 2], ['CHL', 2], ['COL', 1], ['BOL', 1]]},
	{label: 'COPAS DE LA CONCACAF', n: 19, parts: [['MEX', 13], ['CRI', 3], ['HTI', 1], ['GTM', 1], ['HND', 1]]},
	{label: 'OROS OLÍMPICOS', n: 7, parts: [['URY', 2], ['ARG', 2], ['BRA', 2], ['MEX', 1]]},
	{label: 'COPAS CONFEDERACIONES', n: 6, parts: [['BRA', 4], ['ARG', 1], ['MEX', 1]]},
];
