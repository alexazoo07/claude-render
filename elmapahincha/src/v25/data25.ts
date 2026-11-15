import EDS0 from './eds.json';
import F3 from '../iso3flag.json';
import NM from '../../tools/v21/names_es.json';

export const FL: Record<string, string> = F3 as Record<string, string>;
export const NAME: Record<string, string> = {...(NM as Record<string, string>), USA: 'Estados Unidos'};
const HOSTN: Record<string, string> = {Argentina: 'ARG', Uruguay: 'URY', Brazil: 'BRA', Chile: 'CHL', Peru: 'PER', Ecuador: 'ECU', Bolivia: 'BOL', Paraguay: 'PRY', Colombia: 'COL', Venezuela: 'VEN', 'United States': 'USA'};
export type Ed = {y: string; yr: number; c: string; host: string; nh: number; teams: string[]; p: number; w: number; d: number; l: number; gf: number; ga: number; last: {o: string; sa: number; sb: number; date: string; city: string}};
export const EDS = (EDS0 as unknown as Ed[]).map((e) => ({...e, hk: e.nh > 1 ? null : HOSTN[e.host]}));
// decisive game label: a real final, a play-off, or the last game of a final round
export const KIND: Record<string, string> = {
	'1919': 'DESEMPATE', '1922': 'DESEMPATE', '1937': 'DESEMPATE', '1949': 'DESEMPATE', '1953': 'DESEMPATE', '1975': 'DESEMPATE DE LA FINAL', '1979': 'DESEMPATE DE LA FINAL', '1983': 'FINAL (VUELTA)',
	'1987': 'FINAL', '1989': 'PARTIDO DECISIVO', '1991': 'PARTIDO DECISIVO', '1993': 'FINAL', '1995': 'FINAL', '1997': 'FINAL', '1999': 'FINAL', '2001': 'FINAL', '2004': 'FINAL', '2007': 'FINAL',
	'2011': 'FINAL', '2015': 'FINAL', '2016': 'FINAL', '2019': 'FINAL', '2021': 'FINAL', '2024': 'FINAL',
};
export const PENS: Record<string, string> = {'1995': '5-3 pen.', '2004': '4-2 pen.', '2015': '4-1 pen.', '2016': '4-2 pen.', '2024': 'prórroga'};
export const FACT: Record<string, string> = {
	'1916': 'La primera Copa América de la historia: solo 4 selecciones',
	'1919': 'Primer título de Brasil, en un desempate de 150 minutos contra Uruguay',
	'1921': 'Primera Copa de Argentina: 3 victorias y ni un gol en contra',
	'1924': 'Ese mismo año, Uruguay ganó el oro olímpico en París',
	'1925': 'Solo se apuntaron 3 selecciones: Argentina, Brasil y Paraguay',
	'1939': 'Primera Copa de Perú, en casa',
	'1949': 'Brasil arrolla a Paraguay en el desempate: 7-0',
	'1953': 'Primera Copa de Paraguay: le ganó el desempate a Brasil en Lima',
	'1957': 'Los «Carasucias»: Maschio, Angelillo y Sívori',
	'1959a': '1959 tuvo dos Copas América: la primera, en Argentina',
	'1959b': 'La segunda Copa de 1959 se jugó en Ecuador',
	'1963': 'La única Copa de Bolivia, jugando en casa',
	'1975': 'Sin sede fija: Perú gana el desempate a Colombia en Caracas',
	'1979': 'Paraguay gana su segunda Copa tras un desempate con Chile',
	'1983': 'Uruguay gana la final a doble partido contra Brasil',
	'1993': 'Primera Copa con invitados de la CONCACAF: México llegó a la final',
	'1997': 'Brasil gana la final en La Paz, a más de 3.600 metros',
	'2001': 'La única Copa de Colombia: en casa y sin recibir ni un gol',
	'2004': 'Brasil empata en el último minuto y gana a Argentina en los penaltis',
	'2011': 'Uruguay llega a 15 Copas y adelanta a Argentina',
	'2015': 'Primera Copa de Chile, en casa, ganando a Argentina en los penaltis',
	'2016': 'Copa Centenario en Estados Unidos: Chile repite ante Argentina',
	'2021': 'Final en Maracaná: Argentina gana su primera Copa en 28 años',
	'2024': 'Lautaro marca en la prórroga y Argentina llega a 16 Copas',
};
export type Era = {name: string; eds: string[]};
export const ERAS: Era[] = [
	{name: 'LOS PIONEROS', eds: ['1916', '1917', '1919', '1920', '1921', '1922']},
	{name: 'EL CLÁSICO DEL RÍO DE LA PLATA', eds: ['1923', '1924', '1925', '1926', '1927', '1929']},
	{name: 'LLEGA PERÚ', eds: ['1935', '1937', '1939', '1941', '1942', '1945']},
	{name: 'PARAGUAY ROMPE EL MOLDE', eds: ['1946', '1947', '1949', '1953', '1955', '1956']},
	{name: 'DOS COPAS EN UN AÑO', eds: ['1957', '1959a', '1959b', '1963', '1967', '1975']},
	{name: 'SIN SEDE... Y CON INVITADOS', eds: ['1979', '1983', '1987', '1989', '1991', '1993']},
	{name: 'LA ERA DE BRASIL', eds: ['1995', '1997', '1999', '2001', '2004', '2007']},
	{name: 'CHILE Y LA SCALONETA', eds: ['2011', '2015', '2016', '2019', '2021', '2024']},
];
export const CHAMPS = ['ARG', 'URY', 'BRA', 'PER', 'PRY', 'CHL', 'COL', 'BOL'];
export const COL: Record<string, string> = {ARG: '#6CB4EE', URY: '#3A8DDE', BRA: '#F7CF1D', PER: '#D91023', PRY: '#E8394A', CHL: '#C8102E', COL: '#FCD116', BOL: '#2E9E4F'};
