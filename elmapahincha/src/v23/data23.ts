import D from './d23.json';
import F3 from '../iso3flag.json';
import NM from '../../tools/v21/names_es.json';

export const FL: Record<string, string> = F3 as Record<string, string>;
export const NAME: Record<string, string> = {...(NM as Record<string, string>), DEU: 'Alemania', ENG: 'Inglaterra', CZE: 'Checoslovaquia'};
export const ERA_REC = (D as any).eras as Record<string, number>[];
export const ELO = (D as any).elo as [number, number][];
export const FIRST = (D as any).first as Record<string, number>;
export const SIGNS = (D as any).signs as Record<string, [number, number][]>;

export type Mood = 'happy' | 'smug' | 'cool' | 'sad' | 'shock' | 'love' | 'angry' | 'worried' | 'panic' | 'scared' | 'neutral';
export type Card = {y: string; title: string; line: string; bubble: string; mood: Mood; foe?: string; foeMood?: Mood};
export type Era = {y0: number; y1: number; name: string; titles: string[]; cards: Card[]};
export const ERAS: Era[] = [
	{y0: 1902, y1: 1929, name: 'LOS PIONEROS', titles: ['Copa América 1921', 'Copa América 1925', 'Copa América 1927', 'Copa América 1929'], cards: [
		{y: '1902', title: 'PRIMER PARTIDO OFICIAL', line: '20 de julio de 1902: Uruguay 0-6 Argentina, en Montevideo', bubble: '¡Empezamos fuerte!', mood: 'happy', foe: 'URY', foeMood: 'shock'},
		{y: '1921', title: 'PRIMERA COPA AMÉRICA', line: 'Campeona en Buenos Aires: 3 partidos, 3 victorias y ni un gol en contra', bubble: '¡La primera de 16!', mood: 'love', foe: 'BRA', foeMood: 'sad'},
		{y: '1928', title: 'PLATA EN ÁMSTERDAM', line: 'Final olímpica contra Uruguay: 1-1 y 2-1 para los uruguayos en el desempate', bubble: '¡Otra vez Uruguay!', mood: 'angry', foe: 'URY', foeMood: 'love'},
	]},
	{y0: 1930, y1: 1949, name: 'LA PRIMERA FINAL', titles: ['Copa América 1937', 'Copa América 1941', 'Copa América 1945', 'Copa América 1946', 'Copa América 1947'], cards: [
		{y: '1930', title: 'FINAL DEL PRIMER MUNDIAL', line: 'Uruguay 4-2 Argentina. Stábile fue el máximo goleador, con 8 goles', bubble: '¡Se nos escapó!', mood: 'sad', foe: 'URY', foeMood: 'love'},
		{y: '1934-54', title: 'LA GRAN AUSENCIA', line: 'Fue a Italia 1934 con amateurs y no jugó los Mundiales de 1938, 1950 ni 1954', bubble: '¡Tanto talento en casa!', mood: 'worried', foe: 'ITA', foeMood: 'smug'},
		{y: '1945-47', title: 'TRICAMPEONA DE AMÉRICA', line: 'Ganó tres Copas América seguidas: 1945, 1946 y 1947', bubble: '¡Nadie nos para!', mood: 'cool', foe: 'CHL', foeMood: 'worried'},
	]},
	{y0: 1950, y1: 1969, name: 'CARASUCIAS Y DESASTRE', titles: ['Copa América 1955', 'Copa América 1957', 'Copa América 1959'], cards: [
		{y: '1957', title: 'LOS CARASUCIAS', line: 'Maschio, Angelillo y Sívori ganan la Copa América en Lima', bubble: '¡Qué delantera!', mood: 'cool', foe: 'PER', foeMood: 'happy'},
		{y: '1958', title: 'EL DESASTRE DE SUECIA', line: 'Checoslovaquia 6-1 Argentina: su peor derrota en un Mundial', bubble: '¡Qué vergüenza!', mood: 'panic', foe: 'CZE', foeMood: 'smug'},
		{y: '1966', title: 'LA EXPULSIÓN DE RATTÍN', line: 'Cuartos en Wembley: Inglaterra 1-0. Nace una rivalidad', bubble: '¡Eso no era roja!', mood: 'angry', foe: 'ENG', foeMood: 'smug'},
	]},
	{y0: 1970, y1: 1979, name: 'LA PRIMERA ESTRELLA', titles: ['Mundial 1978'], cards: [
		{y: '1969', title: 'SIN MUNDIAL 1970', line: 'Perú la dejó fuera con un 2-2 en La Bombonera', bubble: '¡En nuestra casa!', mood: 'sad', foe: 'PER', foeMood: 'love'},
		{y: '1978', title: '¡CAMPEONA DEL MUNDO!', line: 'Final en el Monumental: Argentina 3-1 Países Bajos en la prórroga', bubble: '¡La primera estrella!', mood: 'love', foe: 'NLD', foeMood: 'sad'},
		{y: '1978', title: 'KEMPES, BOTA DE ORO', line: '6 goles en el Mundial, dos de ellos en la final', bubble: '¡El Matador!', mood: 'cool', foe: 'NLD', foeMood: 'sad'},
	]},
	{y0: 1980, y1: 1989, name: 'EL MUNDIAL DE DIEGO', titles: ['Mundial 1986'], cards: [
		{y: '1982', title: 'ESPAÑA 82', line: 'Primer Mundial de Maradona... expulsado contra Brasil', bubble: '¡Tranquilo, Diego!', mood: 'worried', foe: 'BRA', foeMood: 'smug'},
		{y: '1986', title: 'LA MANO DE DIOS Y EL GOL DEL SIGLO', line: 'Cuartos en el Azteca: Argentina 2-1 Inglaterra', bubble: '¡Barrilete cósmico!', mood: 'cool', foe: 'ENG', foeMood: 'angry'},
		{y: '1986', title: '¡LA SEGUNDA ESTRELLA!', line: 'Final: Argentina 3-2 Alemania Federal, con pase de Diego a Burruchaga', bubble: '¡Bicampeones!', mood: 'love', foe: 'DEU', foeMood: 'sad'},
	]},
	{y0: 1990, y1: 2004, name: 'FINALES Y FRUSTRACIONES', titles: ['Copa América 1991', 'Copa Confederaciones 1992', 'Copa América 1993', 'Copa Artemio Franchi 1993', 'Oro olímpico 2004'], cards: [
		{y: '1990', title: 'FINAL PERDIDA EN ROMA', line: 'Alemania Federal 1-0, con un penalti de Brehme a 5 minutos del final', bubble: '¡No era penalti!', mood: 'angry', foe: 'DEU', foeMood: 'love'},
		{y: '1993', title: 'LA ÚLTIMA EN 28 AÑOS', line: 'Copa América de Ecuador: 2-1 a México en la final. La siguiente llegaría en 2021', bubble: '¿¡28 años!?', mood: 'shock', foe: 'ECU', foeMood: 'happy'},
		{y: '2002', title: 'FUERA A LA PRIMERA', line: 'Corea y Japón 2002: el 1-1 con Suecia la eliminó en la fase de grupos', bubble: '¡Éramos favoritos!', mood: 'sad', foe: 'SWE', foeMood: 'happy'},
	]},
	{y0: 2005, y1: 2020, name: 'MESSI Y LAS FINALES', titles: ['Oro olímpico 2008'], cards: [
		{y: '2005', title: 'DEBUTA MESSI', line: 'Amistoso en Budapest contra Hungría... y expulsado al poco de entrar', bubble: '¡Vaya estreno!', mood: 'shock', foe: 'HUN', foeMood: 'worried'},
		{y: '2014', title: 'FINAL DEL MARACANÁ', line: 'Alemania 1-0 en la prórroga, con gol de Götze', bubble: '¡Tan cerca!', mood: 'sad', foe: 'DEU', foeMood: 'love'},
		{y: '2016', title: 'TRES FINALES SEGUIDAS PERDIDAS', line: 'Mundial 2014 y Copas América 2015 y 2016, estas dos por penaltis contra Chile', bubble: '¡Otra vez no!', mood: 'panic', foe: 'CHL', foeMood: 'love'},
	]},
	{y0: 2021, y1: 2026, name: 'LA SCALONETA', titles: ['Copa América 2021', 'Finalissima 2022', 'Mundial 2022', 'Copa América 2024'], cards: [
		{y: '2021', title: 'SE ACABA LA SEQUÍA', line: 'Copa América en el Maracaná: Brasil 0-1 Argentina, gol de Di María', bubble: '¡28 años después!', mood: 'love', foe: 'BRA', foeMood: 'sad'},
		{y: '2022', title: '¡LA TERCERA ESTRELLA!', line: 'Final de Qatar: 3-3 con Francia y 4-2 en los penaltis', bubble: '¡Campeones del mundo!', mood: 'love', foe: 'FRA', foeMood: 'sad'},
		{y: '2026', title: 'LA FINAL CONTRA ESPAÑA', line: 'España 1-0 en la prórroga... y Messi se despide de la selección', bubble: '¡Gracias, capitán!', mood: 'sad', foe: 'ESP', foeMood: 'love'},
	]},
];
export const STARS = [1978, 1986, 2022];
export const CUPS = [1921, 1925, 1927, 1929, 1937, 1941, 1945, 1946, 1947, 1955, 1957, 1959, 1991, 1993, 2021, 2024];
