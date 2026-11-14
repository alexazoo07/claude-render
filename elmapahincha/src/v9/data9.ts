import {geoNaturalEarth1} from 'd3-geo';

// same projection as world.json (tools/prep_world.mjs)
const proj = geoNaturalEarth1().scale(700).translate([1915, 1000]);
export const LL = (lon: number, lat: number): [number, number] => proj([lon, lat]) as [number, number];

export type Facade = 'concrete' | 'diamonds' | 'gold' | 'metal' | 'brick' | 'white' | 'glass' | 'blue';
export type Roof = 'none' | 'ring' | 'petals' | 'full' | 'canopy' | 'beams';
export type Extra = 'arch' | 'towers' | 'pylons' | 'tower' | 'floods' | 'dstand' | 'redbeams';
export type Art = {
	n: number; // superellipse exponent (2 = oval, 5 = rounded rectangle)
	facade: Facade; facadeCol: string; seats: string[]; roof: Roof; roofCol?: string; extras?: Extra[]; night?: boolean; aspect?: number;
};
export type Stadium = {
	rank: number; key: string; name: string; short: string; city: string; country: string; iso: string; flag: string; lon: number; lat: number;
	cap: number; capNote?: string; year: number; team: string; stat4: [string, string];
	facts: string[]; scores: [number, number, number, number]; // historia, ambiente, diseño, aforo
	art: Art;
};
export const CATS = ['HISTORIA', 'AMBIENTE', 'DISEÑO', 'AFORO'];
export const CAT_COL = ['#C58BFF', '#FF5A5F', '#4FC3F7', '#FFD23F'];
export const nota = (s: Stadium) => s.scores.reduce((a, b) => a + b, 0) / 4;

export const STADIUMS: Stadium[] = [
	{
		rank: 20, key: 'rungrado', name: 'RUNGRADO 1º DE MAYO', short: 'RUNGRADO', city: 'Pionyang', country: 'Corea del Norte', iso: 'PRK', flag: 'kp', lon: 125.776, lat: 39.05,
		cap: 114000, capNote: 'estimado', year: 1989, team: 'Selección de Corea del Norte', stat4: ['TERRENO', '20,7 hectáreas'],
		facts: [
			'Es el estadio más grande del mundo: unas 114.000 personas',
			'Su techo tiene 16 arcos que imitan una flor de magnolia',
			'Récord Guinness en 2007: 100.090 personas en un espectáculo gimnástico',
		],
		scores: [6.5, 5.3, 9, 10],
		art: {n: 2, facade: 'white', facadeCol: '#E9EEF5', seats: ['#3B6FD6', '#E04848', '#3B6FD6'], roof: 'petals', roofCol: '#FFFFFF', aspect: 1},
	},
	{
		rank: 19, key: 'lusail', name: 'ESTADIO DE LUSAIL', short: 'LUSAIL', city: 'Lusail', country: 'Catar', iso: 'QAT', flag: 'qa', lon: 51.49, lat: 25.42,
		cap: 88966, year: 2022, team: 'Selección de Catar', stat4: ['MUNDIAL', '10 partidos'],
		facts: [
			'Final del Mundial 2022: Argentina 3-3 Francia y 4-2 en los penaltis',
			'Su fachada dorada se inspira en los cuencos y faroles del arte árabe',
			'Récord: 88.966 espectadores, igualado en 3 partidos del Mundial',
		],
		scores: [7.5, 6.5, 9, 9],
		art: {n: 2.2, facade: 'gold', facadeCol: '#D9A441', seats: ['#8A1538', '#B01E46', '#8A1538'], roof: 'ring', roofCol: '#F3EEE2', night: true},
	},
	{
		rank: 18, key: 'luz', name: 'ESTÁDIO DA LUZ', short: 'DA LUZ', city: 'Lisboa', country: 'Portugal', iso: 'PRT', flag: 'pt', lon: -9.1847, lat: 38.7527,
		cap: 64642, year: 2003, team: 'Benfica', stat4: ['FINALES', 'Euro 2004 y 2 de Champions'],
		facts: ['Antes de cada partido, el águila Vitória vuela sobre la grada', 'Final de la Euro 2004: Grecia dio la sorpresa ante Portugal (0-1)', 'Final de Champions 2014: Real Madrid 4-1 Atlético, la "Décima"'],
		scores: [8, 8.5, 7.2, 8.7],
		art: {n: 2.6, facade: 'metal', facadeCol: '#C9CED6', seats: ['#D7262E', '#B51E25', '#D7262E'], roof: 'ring', roofCol: '#F4F4F4'},
	},
	{
		rank: 17, key: 'sofi', name: 'SOFI STADIUM', short: 'SOFI', city: 'Los Ángeles', country: 'Estados Unidos', iso: 'USA', flag: 'us', lon: -118.339, lat: 33.953,
		cap: 70240, year: 2020, team: 'Rams y Chargers (NFL)', stat4: ['COSTE', '+5.000 millones $'],
		facts: ['El estadio más caro jamás construido: más de 5.000 millones de dólares', 'Su techo es translúcido y tiene una pantalla gigante de doble cara', 'Mundial 2026: aquí debutó Estados Unidos, y acogerá los Juegos de 2028'],
		scores: [6.5, 7.5, 10, 8.8],
		art: {n: 3, facade: 'glass', facadeCol: '#C9D6E3', seats: ['#1F3B73', '#2B4C8C', '#1F3B73'], roof: 'canopy', roofCol: '#EAF2FA'},
	},
	{
		rank: 16, key: 'celtic', name: 'CELTIC PARK', short: 'CELTIC PARK', city: 'Glasgow', country: 'Escocia', iso: 'SCT', flag: 'gb-sct', lon: -4.2055, lat: 55.8497,
		cap: 60411, year: 1892, team: 'Celtic', stat4: ['APODO', '"Paradise" (el Paraíso)'],
		facts: ['Su apodo es "Paradise": el Paraíso', 'Es el estadio de club más grande de Escocia', 'Cuando suena el "You\'ll Never Walk Alone", las bufandas cubren la grada'],
		scores: [8.5, 10, 6.5, 8.2],
		art: {n: 4.2, facade: 'glass', facadeCol: '#C7CCD3', seats: ['#16924A', '#F4F4F4', '#16924A'], roof: 'ring', roofCol: '#DADDE2'},
	},
	{
		rank: 15, key: 'sdf', name: 'STADE DE FRANCE', short: 'STADE DE FRANCE', city: 'París (Saint-Denis)', country: 'Francia', iso: 'FRA', flag: 'fr', lon: 2.3601, lat: 48.9245,
		cap: 80698, year: 1998, team: 'Selecciones de Francia', stat4: ['MUNDIAL 98', 'Final: Francia 3-0 Brasil'],
		facts: ['Final del Mundial 98: Francia ganó 3-0 a Brasil con 2 goles de Zidane', 'Ha acogido 3 finales de Champions: 2000, 2006 y 2022', 'Su grada baja se puede mover para dejar sitio a una pista de atletismo'],
		scores: [9, 7.4, 8, 9.2],
		art: {n: 2.3, facade: 'concrete', facadeCol: '#C8CBD1', seats: ['#2D57B8', '#4A7BD6', '#2D57B8'], roof: 'ring', roofCol: '#EEF0F3', night: true},
	},
	{
		rank: 14, key: 'tottenham', name: 'TOTTENHAM HOTSPUR STADIUM', short: 'TOTTENHAM', city: 'Londres', country: 'Inglaterra', iso: 'ENG', flag: 'gb-eng', lon: -0.0662, lat: 51.6043,
		cap: 62850, year: 2019, team: 'Tottenham Hotspur', stat4: ['COSTE', 'Unos 1.000 M£'],
		facts: ['Su césped se esconde bajo la grada y debajo aparece otro para la NFL', 'Su grada sur, con 17.500 asientos, es la más grande de un solo piso del Reino Unido', 'Tiene su propia fábrica de cerveza dentro del estadio'],
		scores: [7, 9, 10, 8],
		art: {n: 4.6, facade: 'glass', facadeCol: '#A9B6C6', seats: ['#14295A', '#1E3A78', '#14295A'], roof: 'ring', roofCol: '#E6EAEF', night: true},
	},
	{
		rank: 13, key: 'centenario', name: 'ESTADIO CENTENARIO', short: 'CENTENARIO', city: 'Montevideo', country: 'Uruguay', iso: 'URY', flag: 'uy', lon: -56.1527, lat: -34.8945,
		cap: 60235, year: 1930, team: 'Selección de Uruguay', stat4: ['MUNDIAL 1930', 'Final: Uruguay 4-2 Argentina'],
		facts: ['Aquí se jugó la primera final de la historia del Mundial, en 1930', 'Uruguay ganó esa final 4-2 a Argentina', 'La FIFA lo nombró Monumento Histórico del Fútbol Mundial'],
		scores: [10, 9, 7, 8.4],
		art: {n: 2, facade: 'concrete', facadeCol: '#D8D2C4', seats: ['#6CB4EE', '#DAD4C6', '#6CB4EE'], roof: 'none', extras: ['tower', 'floods']},
	},
	{
		rank: 12, key: 'oldtrafford', name: 'OLD TRAFFORD', short: 'OLD TRAFFORD', city: 'Mánchester', country: 'Inglaterra', iso: 'ENG', flag: 'gb-eng', lon: -2.2913, lat: 53.4631,
		cap: 74310, year: 1910, team: 'Manchester United', stat4: ['APODO', '"El Teatro de los Sueños"'],
		facts: ['Bobby Charlton lo bautizó como "el Teatro de los Sueños"', 'Es el estadio de club más grande del Reino Unido', 'Una bomba lo destrozó en 1941 y el United jugó 8 años en casa del City'],
		scores: [9.5, 8.8, 7.5, 9],
		art: {n: 5, facade: 'brick', facadeCol: '#A63A2E', seats: ['#C8102E', '#A50D26', '#C8102E'], roof: 'ring', roofCol: '#D9DCE1'},
	},
	{
		rank: 11, key: 'monumental', name: 'MÂS MONUMENTAL', short: 'MONUMENTAL', city: 'Buenos Aires', country: 'Argentina', iso: 'ARG', flag: 'ar', lon: -58.4497, lat: -34.5453,
		cap: 85018, year: 1938, team: 'River Plate y Argentina', stat4: ['MUNDIAL 78', 'Final: Argentina 3-1 P. Bajos'],
		facts: ['Es el estadio más grande de Sudamérica: 85.018 espectadores', 'Aquí Argentina ganó su primer Mundial, en 1978', 'River es el club con más público del mundo: 3 años seguidos'],
		scores: [9.5, 9.5, 7, 9.6],
		art: {n: 2.4, facade: 'white', facadeCol: '#ECEFF3', seats: ['#F4F4F4', '#E4002B', '#F4F4F4'], roof: 'none', extras: ['floods']},
	},
	{
		rank: 10, key: 'allianz', name: 'ALLIANZ ARENA', short: 'ALLIANZ', city: 'Múnich', country: 'Alemania', iso: 'DEU', flag: 'de', lon: 11.6247, lat: 48.2188,
		cap: 75024, year: 2005, team: 'Bayern de Múnich', stat4: ['MUNDIAL 2006', 'Partido inaugural'],
		facts: ['Su fachada de 2.874 paneles se ilumina de rojo, azul o blanco', 'Inauguró el Mundial 2006 y la Eurocopa 2024', 'Final de Champions 2025: PSG goleó 5-0 al Inter'],
		scores: [8.5, 9, 9.8, 8.7],
		art: {n: 2.2, facade: 'diamonds', facadeCol: '#DC052D', seats: ['#C8102E', '#9E0B23', '#C8102E'], roof: 'ring', roofCol: '#F2F2F2', night: true},
	},
	{
		rank: 9, key: 'sansiro', name: 'SAN SIRO', short: 'SAN SIRO', city: 'Milán', country: 'Italia', iso: 'ITA', flag: 'it', lon: 9.124, lat: 45.4781,
		cap: 75817, year: 1926, team: 'Milan e Inter', stat4: ['CHAMPIONS', '4 finales'],
		facts: ['Sus 11 torres de espiral son su seña de identidad', 'En febrero de 2026 acogió la inauguración de los Juegos de Invierno', 'Milan e Inter lo compraron en 2025... para demolerlo y hacer uno nuevo'],
		scores: [10, 9.4, 8.2, 8.8],
		art: {n: 4, facade: 'concrete', facadeCol: '#B9B4AA', seats: ['#C8102E', '#1C3F94', '#C8102E'], roof: 'beams', roofCol: '#E9E9E9', extras: ['towers']},
	},
	{
		rank: 8, key: 'anfield', name: 'ANFIELD', short: 'ANFIELD', city: 'Liverpool', country: 'Inglaterra', iso: 'ENG', flag: 'gb-eng', lon: -2.9608, lat: 53.4308,
		cap: 61276, year: 1884, team: 'Liverpool', stat4: ['GRADA', 'The Kop'],
		facts: ['Al principio era el estadio del Everton, ¡el gran rival!', 'Su grada más famosa, The Kop, canta el "You\'ll Never Walk Alone"', 'Los jugadores tocan el cartel "This is Anfield" antes de salir'],
		scores: [10, 10, 8, 8.8],
		art: {n: 5, facade: 'glass', facadeCol: '#D8D2C2', seats: ['#C8102E', '#A00D25', '#C8102E'], roof: 'ring', roofCol: '#DADDE2'},
	},
	{
		rank: 7, key: 'dortmund', name: 'SIGNAL IDUNA PARK', short: 'SIGNAL IDUNA', city: 'Dortmund', country: 'Alemania', iso: 'DEU', flag: 'de', lon: 7.4518, lat: 51.4926,
		cap: 81365, year: 1974, team: 'Borussia Dortmund', stat4: ['MURO AMARILLO', '24.454 de pie'],
		facts: ['Su "Muro Amarillo" es la grada de pie más grande de Europa', 'Es uno de los estadios con más público medio del mundo: más de 80.000', 'Sus 8 pilares amarillos sujetan el techo y se ven desde lejos'],
		scores: [9, 10, 8.6, 9.6],
		art: {n: 5, facade: 'glass', facadeCol: '#4A4A4A', seats: ['#FDE100', '#FDE100', '#1A1A1A'], roof: 'ring', roofCol: '#E0E0E0', extras: ['pylons']},
	},
	{
		rank: 6, key: 'wembley', name: 'WEMBLEY', short: 'WEMBLEY', city: 'Londres', country: 'Inglaterra', iso: 'ENG', flag: 'gb-eng', lon: -0.2795, lat: 51.556,
		cap: 90000, year: 2007, team: 'Selección de Inglaterra', stat4: ['ARCO', '133 metros de alto'],
		facts: ['Su arco de 133 metros se ve desde casi todo Londres', 'El viejo Wembley vio a Inglaterra ganar su único Mundial, en 1966', 'Es el estadio más grande del Reino Unido: 90.000 asientos'],
		scores: [10, 8.8, 9.4, 9.4],
		art: {n: 3, facade: 'glass', facadeCol: '#D4DAE2', seats: ['#C8102E', '#B00D27', '#C8102E'], roof: 'ring', roofCol: '#F4F4F4', extras: ['arch']},
	},
];
const _TOP: Stadium[] = [
	{
		rank: 5, key: 'bombonera', name: 'LA BOMBONERA', short: 'BOMBONERA', city: 'Buenos Aires', country: 'Argentina', iso: 'ARG', flag: 'ar', lon: -58.3647, lat: -34.6356,
		cap: 54000, year: 1940, team: 'Boca Juniors', stat4: ['APODO', '"La caja de bombones"'],
		facts: ['Su forma rara se debe al poco terreno: una grada es casi una pared', 'Dicen que "no tiembla, late"', 'Aquí debutó Maradona con Argentina, con solo 16 años (1977)'],
		scores: [10, 10, 9.5, 8.5],
		art: {n: 3.2, facade: 'blue', facadeCol: '#1D4AA8', seats: ['#F2C230', '#1D4AA8', '#F2C230'], roof: 'none', extras: ['dstand']},
	},
	{
		rank: 4, key: 'azteca', name: 'ESTADIO AZTECA', short: 'AZTECA', city: 'Ciudad de México', country: 'México', iso: 'MEX', flag: 'mx', lon: -99.1505, lat: 19.3029,
		cap: 87000, year: 1966, team: 'América y Selección de México', stat4: ['MUNDIALES', '3 (1970, 1986, 2026)'],
		facts: ['El único estadio que ha inaugurado 3 Mundiales: 1970, 1986 y 2026', 'Aquí Maradona marcó "la Mano de Dios" y el "Gol del Siglo" (1986)', 'Acogió 2 finales: Brasil campeón en 1970 y Argentina en 1986'],
		scores: [10, 9.6, 8.8, 10],
		art: {n: 2.4, facade: 'concrete', facadeCol: '#A7A9AE', seats: ['#F2C230', '#1E8E4E', '#F2C230'], roof: 'ring', roofCol: '#D9DCE1', extras: ['floods']},
	},
	{
		rank: 3, key: 'maracana', name: 'MARACANÁ', short: 'MARACANÁ', city: 'Río de Janeiro', country: 'Brasil', iso: 'BRA', flag: 'br', lon: -43.2302, lat: -22.9122,
		cap: 78838, year: 1950, team: 'Flamengo, Fluminense y Brasil', stat4: ['FINALES DEL MUNDIAL', '2 (1950 y 2014)'],
		facts: ['1950: el "Maracanazo", Uruguay ganó 2-1 a Brasil ante unas 200.000 personas', 'Aquí marcó Pelé su gol número 1.000, en 1969', 'Final del Mundial 2014: Alemania 1-0 Argentina'],
		scores: [10, 10, 9.3, 9.5],
		art: {n: 2, facade: 'white', facadeCol: '#F2F2F2', seats: ['#F2C230', '#2D57B8', '#F4F4F4'], roof: 'ring', roofCol: '#FFFFFF'},
	},
	{
		rank: 2, key: 'bernabeu', name: 'SANTIAGO BERNABÉU', short: 'BERNABÉU', city: 'Madrid', country: 'España', iso: 'ESP', flag: 'es', lon: -3.6883, lat: 40.4531,
		cap: 83186, year: 1947, team: 'Real Madrid', stat4: ['REFORMA', 'Unos 1.760 M€'],
		facts: ['Su reforma costó unos 1.760 millones de euros: piel de acero y techo retráctil', 'Ha acogido 4 finales de Copa de Europa y la final del Mundial 82', 'En 2025 acogió su primer partido de la NFL, y en 2026 un torneo de tenis'],
		scores: [10, 9.5, 10, 9.7],
		art: {n: 4, facade: 'metal', facadeCol: '#C7CCD4', seats: ['#F4F4F4', '#1C2C5B', '#F4F4F4'], roof: 'full', roofCol: '#E9ECF0', night: true},
	},
	{
		rank: 1, key: 'campnou', name: 'SPOTIFY CAMP NOU', short: 'CAMP NOU', city: 'Barcelona', country: 'España', iso: 'ESP', flag: 'es', lon: 2.1228, lat: 41.3809,
		cap: 105000, capNote: 'al acabar la reforma (hoy unos 62.000)', year: 1957, team: 'FC Barcelona', stat4: ['REFORMA', 'Será el más grande de Europa'],
		facts: ['Al acabar la reforma tendrá unos 105.000 asientos: el más grande de Europa', 'Final de Champions 1999: el United remontó al Bayern en el descuento', 'Volvió a abrir en noviembre de 2025 tras 2 años: Barça 4-0 Athletic'],
		scores: [10, 9.8, 9.8, 10],
		art: {n: 2.6, facade: 'white', facadeCol: '#F0F0F0', seats: ['#A50044', '#004D98', '#A50044'], roof: 'none', night: true},
	},
];
STADIUMS.push(..._TOP);
export const BY = Object.fromEntries(STADIUMS.map((s) => [s.key, s])) as Record<string, Stadium>;
export const COUNTDOWN = [...STADIUMS].sort((a, b) => b.rank - a.rank);
