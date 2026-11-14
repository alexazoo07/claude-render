export type Cat = 'amor' | 'mixto' | 'pique' | 'odio';
export type Entry = {key: string; flag: string; es: string; cat: Cat; score: number; p: number; w: number; d: number; l: number; f1: string; f2: string; f3?: string; f4?: string; scarf: [string, string]};

export const CAT_COL: Record<Cat, string> = {amor: '#FF4FA0', mixto: '#FFD23F', pique: '#FF8A3D', odio: '#E63946'};
export const CAT_TXT: Record<Cat, string> = {amor: 'AMOR TOTAL', mixto: 'AMOR-ODIO', pique: 'PIQUE', odio: 'ODIO'};
export const CAT_SUB: Record<Cat, string> = {
	amor: 'LOS QUE LA ADORAN',
	mixto: 'LA QUIEREN... PERO NO TANTO',
	pique: 'CUENTAS PENDIENTES',
	odio: 'RIVALIDAD MÁXIMA',
};

// Partidos: selección absoluta, todos los partidos hasta oct. 2026 (penaltis = empate). Dataset martj42.
export const LIST: Entry[] = [
	{key: 'BGD', flag: 'bd', es: 'Bangladés', cat: 'amor', score: 95, p: 0, w: 0, d: 0, l: 0, scarf: ['#006A4E', '#F42A41'],
		f1: 'Nunca ha jugado contra Argentina... y la adora', f2: 'Cientos de miles vieron Qatar 2022 con la camiseta argentina', f3: 'Argentina reabrió su embajada en Daca en 2023, tras 45 años cerrada'},
	{key: 'IND', flag: 'in', es: 'India', cat: 'amor', score: 82, p: 1, w: 1, d: 0, l: 0, scarf: ['#FF9933', '#138808'],
		f1: 'Kerala: un Messi gigante de cartón plantado en mitad de un río (2022)', f2: 'Solo se han enfrentado una vez, en 1984'},
	{key: 'HTI', flag: 'ht', es: 'Haití', cat: 'amor', score: 74, p: 3, w: 3, d: 0, l: 0, scarf: ['#00209F', '#D21034'],
		f1: 'Miles de haitianos celebran en la calle los goles de Argentina', f2: 'El cariño viene de los 70: argentinos en su liga y el Mundial 78'},
	{key: 'ITA', flag: 'it', es: 'Italia', cat: 'mixto', score: 22, p: 16, w: 5, d: 5, l: 6, scarf: ['#009246', '#CE2B37'],
		f1: 'Nápoles adora a Maradona: su estadio lleva su nombre desde 2020', f2: 'Pero en 1990 Argentina eliminó a Italia en su Mundial... en Nápoles'},
	{key: 'SAU', flag: 'sa', es: 'Arabia Saudí', cat: 'mixto', score: 12, p: 5, w: 2, d: 2, l: 1, scarf: ['#006C35', '#FFFFFF'],
		f1: 'Messi fue embajador del turismo saudí', f2: 'Le ganó 2-1 en Qatar 2022 y su rey decretó FERIADO NACIONAL'},
	{key: 'PRT', flag: 'pt', es: 'Portugal', cat: 'mixto', score: 6, p: 8, w: 5, d: 1, l: 2, scarf: ['#006600', '#FF0000'],
		f1: 'Messi contra Cristiano: la gran discusión de toda una generación', f2: 'Solo 8 partidos entre ellos; el último, en 2014 (0-1)'},
	{key: 'CHN', flag: 'cn', es: 'China', cat: 'mixto', score: 2, p: 0, w: 0, d: 0, l: 0, scarf: ['#DE2910', '#FFDE00'],
		f1: '2023: Pekín recibió a Messi con locura (Argentina-Australia)', f2: '2024: tras la ausencia de Messi en Hong Kong, canceló dos amistosos de Argentina'},
	{key: 'ESP', flag: 'es', es: 'España', cat: 'mixto', score: -5, p: 15, w: 6, d: 2, l: 7, scarf: ['#AA151B', '#F1BF00'],
		f1: 'Messi se hizo leyenda en Barcelona', f2: 'Pero España le ganó la final del Mundial 2026 en la prórroga (1-0)'},
	{key: 'NGA', flag: 'ng', es: 'Nigeria', cat: 'pique', score: -18, p: 9, w: 6, d: 1, l: 2, scarf: ['#008751', '#FFFFFF'],
		f1: 'Se han cruzado en 5 Mundiales... y Argentina ganó los 5', f2: '1994, 2002, 2010, 2014 y 2018: siempre en la fase de grupos'},
	{key: 'BOL', flag: 'bo', es: 'Bolivia', cat: 'pique', score: -24, p: 45, w: 33, d: 5, l: 7, scarf: ['#D52B1E', '#007934'],
		f1: 'Sus 7 victorias contra Argentina, TODAS en La Paz (3.600 m)', f2: '2009: el 6-1 en la altura, con Maradona en el banquillo'},
	{key: 'HRV', flag: 'hr', es: 'Croacia', cat: 'pique', score: -30, p: 6, w: 3, d: 1, l: 2, scarf: ['#FF0000', '#FFFFFF'],
		f1: 'Mundial 2018: Croacia le endosó un 0-3', f2: 'Mundial 2022: Argentina le devolvió el 3-0 en la semifinal'},
	{key: 'PER', flag: 'pe', es: 'Perú', cat: 'pique', score: -36, p: 56, w: 37, d: 14, l: 5, scarf: ['#D91023', '#FFFFFF'],
		f1: '1978: el polémico 6-0 que metió a Argentina en la final', f2: '1969: Perú la dejó sin Mundial 70 · no le gana desde 1997'},
	{key: 'CHL', flag: 'cl', es: 'Chile', cat: 'pique', score: -40, p: 91, w: 60, d: 25, l: 6, scarf: ['#D52B1E', '#0039A6'],
		f1: 'Le ganó DOS finales seguidas de Copa América por penaltis (2015 y 2016)', f2: 'Aun así, Chile solo le ha ganado 6 de 91 partidos'},
	{key: 'COL', flag: 'co', es: 'Colombia', cat: 'pique', score: -48, p: 43, w: 21, d: 12, l: 10, scarf: ['#FCD116', '#003893'],
		f1: 'El 0-5 de 1993 en el Monumental todavía duele', f2: 'Argentina se vengó en la final de la Copa América 2024 (1-0)'},
	{key: 'MEX', flag: 'mx', es: 'México', cat: 'pique', score: -55, p: 31, w: 16, d: 11, l: 4, scarf: ['#006847', '#CE1126'],
		f1: 'Argentina le ganó en los Mundiales de 2006, 2010 y 2022', f2: '2022: Canelo Álvarez amenazó a Messi por una camiseta mexicana'},
	{key: 'FRA', flag: 'fr', es: 'Francia', cat: 'odio', score: -62, p: 13, w: 6, d: 4, l: 3, scarf: ['#0055A4', '#EF4135'],
		f1: 'Final de 2022: 3-3 y Argentina campeona por penaltis', f2: 'El Dibu Martínez paseó un muñeco con la cara de Mbappé'},
	{key: 'NLD', flag: 'nl', es: 'Países Bajos', cat: 'odio', score: -68, p: 10, w: 1, d: 5, l: 4, scarf: ['#FF7F00', '#FFFFFF'],
		f1: 'Final de 1978 y dos eliminatorias por penaltis (2014 y 2022)', f2: 'Lusail 2022: 17 amarillas, récord en un Mundial. "¿Qué mirás, bobo?"'},
	{key: 'DEU', flag: 'de', es: 'Alemania', cat: 'odio', score: -72, p: 23, w: 10, d: 6, l: 7, scarf: ['#000000', '#FFCE00'],
		f1: 'TRES finales de Mundial: 1986 (Argentina), 1990 y 2014 (Alemania)', f2: 'Y la eliminó en 2006 (penaltis) y en 2010 (0-4)'},
	{key: 'URY', flag: 'uy', es: 'Uruguay', cat: 'odio', score: -78, p: 183, w: 85, d: 44, l: 54, scarf: ['#5CBFEB', '#FFFFFF'],
		f1: 'El partido entre selecciones más repetido de la historia: 183 veces', f2: '1930: Uruguay le ganó la primera final de un Mundial (4-2)'},
	{key: 'BRA', flag: 'br', es: 'Brasil', cat: 'odio', score: -88, p: 110, w: 41, d: 26, l: 43, scarf: ['#FEDD00', '#009C3B'],
		f1: 'El Superclásico: 110 partidos y Brasil gana por la mínima (43 a 41)', f2: '2021: Argentina le ganó la Copa América en el Maracaná (1-0)'},
	{key: 'ENG', flag: 'gb-eng', es: 'Inglaterra', cat: 'odio', score: -97, p: 16, w: 4, d: 6, l: 6, scarf: ['#FFFFFF', '#CE1124'],
		f1: '1966: el seleccionador inglés llamó "animales" a los argentinos', f2: '1986: la Mano de Dios y el Gol del Siglo, 4 años después de Malvinas', f3: '1998: roja a Beckham ante Simeone · 2002: Beckham se venga de penalti', f4: 'Mundial 2026: Argentina remonta en semifinales (2-1)'},
];
export const ALL_FLAGS4 = [...LIST.map((e) => e.flag), 'ar'];
