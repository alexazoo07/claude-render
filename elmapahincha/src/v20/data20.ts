import F3 from '../iso3flag.json';
import NEVER_RAW from './never.json';

// Países que nunca han ido a un Mundial. Internal keys: SIN = YA ESCAPÓ (debut 2026), RES = MUY LEJOS, MIE = SE QUEDÓ CERCA, PAN = A UN PARTIDO
export type Cat = 'PAN' | 'MIE' | 'RES' | 'SIN';
export type Opp = {n: string; flag: string; p: number; ow: number; d: number; ol: number; cat: Cat; best: string};
export const NEVER = NEVER_RAW as string[];
const FL = F3 as Record<string, string>;

export const CAT_COL: Record<Cat, string> = {SIN: '#3DB86B', RES: '#9B5DE5', MIE: '#FF8A3D', PAN: '#E63946'};
export const CAT_DARK: Record<Cat, string> = {SIN: '#1F7E43', RES: '#6232A8', MIE: '#C2561A', PAN: '#A61E2D'};
export const CAT_NAME: Record<Cat, string> = {SIN: 'YA ESCAPÓ', RES: 'MUY LEJOS', MIE: 'SE QUEDÓ CERCA', PAN: 'A UN PARTIDO'};
export const CAT_STAMP: Record<Cat, string> = {SIN: '¡POR FIN ESCAPÓ!', RES: '¡MUY LEJOS!', MIE: '¡SE QUEDÓ CERCA!', PAN: '¡A UN PARTIDO!'};
export const CAT_RULE: Record<Cat, string> = {
	SIN: 'Debutó en el Mundial 2026',
	RES: 'Nunca pasó de la fase de clasificación',
	MIE: 'Llegó a una repesca o a una Eurocopa',
	PAN: 'Se quedó fuera en el último partido',
};

export const NAME: Record<string, string> = {
	VEN: 'Venezuela', UZB: 'Uzbekistán', CPV: 'Cabo Verde', CUW: 'Curazao', JOR: 'Jordania', LUX: 'Luxemburgo', IND: 'India', ARM: 'Armenia', MNE: 'Montenegro',
	FIN: 'Finlandia', ALB: 'Albania', GEO: 'Georgia', GAB: 'Gabón', MLI: 'Malí', ZMB: 'Zambia', SYR: 'Siria', BHR: 'Baréin', KOS: 'Kosovo', BFA: 'Burkina Faso',
	COL: 'Colombia', BOL: 'Bolivia', LTU: 'Lituania', LVA: 'Letonia', EST: 'Estonia', BLR: 'Bielorrusia', MDA: 'Moldavia', AZE: 'Azerbaiyán', AND: 'Andorra', SMR: 'San Marino',
	LIE: 'Liechtenstein', MLT: 'Malta', CYP: 'Chipre', FRO: 'Islas Feroe', THA: 'Tailandia', VNM: 'Vietnam', PHL: 'Filipinas', MYS: 'Malasia', SGP: 'Singapur', MMR: 'Myanmar',
	OMN: 'Omán', YEM: 'Yemen', LBN: 'Líbano', KAZ: 'Kazajistán', TJK: 'Tayikistán', KGZ: 'Kirguistán', ETH: 'Etiopía', SDN: 'Sudán', COG: 'Congo', KEN: 'Kenia', UGA: 'Uganda',
	GIN: 'Guinea', GTM: 'Guatemala', NIC: 'Nicaragua', DOM: 'R. Dominicana', SUR: 'Surinam', GUY: 'Guyana', PRI: 'Puerto Rico', FJI: 'Fiyi', PNG: 'Papúa N. Guinea',
	NCL: 'Nueva Caledonia', PYF: 'Tahití', SLB: 'Islas Salomón', VUT: 'Vanuatu',
};

export type Line = {who: 'opp' | 'hero'; text: string};
export type Focus = {kind: 'focus'; k: string; cat: Cat; region: string; tab: string; best: string; facts: string[]; lines: Line[]};
export type Group = {kind: 'group'; region: string; title: string; keys: string[]; say: string; cat: Cat};
export type Cta = {kind: 'cta'; region: string; left: string};
export type Entry = Focus | Group | Cta;
const E = 'LOS QUE ESCAPARON', L = 'LOS QUE SIGUEN LEJOS', C = 'LOS QUE SE QUEDARON CERCA', U = 'A UN SOLO PARTIDO';
const F = (k: string, cat: Cat, region: string, tab: string, best: string, facts: string[], opp: string, hero: string): Focus => ({kind: 'focus', k, cat, region, tab, best, facts, lines: [{who: 'opp', text: opp}, {who: 'hero', text: hero}]});
const G = (region: string, title: string, keys: string[], say: string, cat: Cat = 'RES'): Group => ({kind: 'group', region, title, keys, say, cat});

export const SCRIPT: Entry[] = [
	F('UZB', 'SIN', E, 'LOS LOBOS BLANCOS', 'Mundial 2026 (debut)', [
		'Mundial 2006: la FIFA hizo repetir su repesca contra Baréin por un error arbitral',
		'En la repetición empató 1-1, luego 0-0 en Baréin, y quedó fuera por los goles a domicilio',
		'En 2026 por fin debutó en un Mundial, tras quedar segunda de su grupo detrás de Irán',
	], '¡Por fin salí de la sala!', '¡Qué envidia me das!'),
	G(E, 'LOS OTROS DEBUTANTES DE 2026', ['CPV', 'CUW', 'JOR'], '¡Y yo sigo esperando!', 'SIN'),
	F('LUX', 'RES', L, 'EL GRAN DUCADO', 'Fase de clasificación', [
		'Nunca ha jugado ni un Mundial ni una Eurocopa',
		'Es uno de los países más pequeños de Europa: unos 680.000 habitantes',
		'En 2017 le sacó un 0-0 a Francia en Toulouse',
	], '¡Le saqué un empate a Francia!', '¡Algo es algo!'),
	F('IND', 'RES', L, 'LOS TIGRES AZULES', 'Clasificada en 1950 (no fue)', [
		'En 1950 se clasificó para el Mundial... pero renunció a ir',
		'Es el país más poblado del mundo, con más de 1.400 millones de habitantes',
		'Sunil Chhetri, su leyenda, ha marcado más de 90 goles con la India',
	], '¡En 1950 pude ir!', '¿Y por qué no fuiste?'),
	F('ARM', 'RES', L, 'LOS ARMENIOS', 'Fase de clasificación', [
		'Juega como selección independiente desde 1992',
		'Mkhitaryan, su máximo goleador, nunca ha jugado un Mundial ni una Eurocopa',
		'Nunca ha llegado ni a una repesca de un gran torneo',
	], '¡Tengo a Mkhitaryan!', 'Y yo tenía a Rondón...'),
	F('MNE', 'RES', L, 'LOS BRAVOS', 'Repesca de la Euro 2012', [
		'Es independiente desde 2006 y juega como selección desde 2007',
		'Stevan Jovetić es su máximo goleador histórico',
		'Llegó a la repesca de la Eurocopa 2012, pero nunca a un gran torneo',
	], '¡Solo tengo 20 años!', '¡Ya te tocará!'),
	G(L, 'EL ESTE DE EUROPA', ['LTU', 'LVA', 'EST', 'BLR', 'MDA', 'AZE'], 'Ninguno ha llegado nunca'),
	G(L, 'LOS PEQUEÑOS DE EUROPA', ['AND', 'SMR', 'LIE', 'MLT', 'CYP', 'FRO'], '¡Los más pequeños de Europa!'),
	G(L, 'EL SUDESTE ASIÁTICO', ['THA', 'VNM', 'PHL', 'MYS', 'SGP', 'MMR'], 'Todos siguen esperando'),
	G(L, 'ASIA CENTRAL Y ORIENTE MEDIO', ['OMN', 'YEM', 'LBN', 'KAZ', 'TJK', 'KGZ'], '¡Seguimos intentándolo!'),
	{kind: 'cta', region: C, left: 'Ahora, los que se quedaron cerca'},
	F('FIN', 'MIE', C, 'LOS BÚHOS', 'Eurocopa 2020', [
		'Debutó en una Eurocopa en 2020 y le ganó 1-0 a Dinamarca',
		'Jari Litmanen, leyenda del Ajax y del Barça, nunca jugó un Mundial',
		'Nunca ha ido a un Mundial',
	], '¡Fui a una Eurocopa!', '¡Ya es más que yo!'),
	F('ALB', 'MIE', C, 'LAS ÁGUILAS', 'Eurocopas 2016 y 2024', [
		'Ha jugado dos Eurocopas: 2016 y 2024',
		'En 2024, Bajrami le marcó a Italia a los 23 segundos: el gol más rápido de la Eurocopa',
		'Pero nunca ha ido a un Mundial',
	], '¡Dos Eurocopas!', '¡Pero ningún Mundial!'),
	F('GEO', 'MIE', C, 'LOS CRUZADOS', 'Octavos de la Euro 2024', [
		'Debutó en la Eurocopa 2024 y llegó a octavos',
		'En aquella Eurocopa le ganó 2-0 a Portugal',
		'Kvaratskhelia, su estrella, nunca ha jugado un Mundial',
	], '¡Le gané a Cristiano!', '¡Qué nivel!'),
	F('GAB', 'MIE', C, 'LAS PANTERAS', 'Cuartos de la Copa África', [
		'Aubameyang, mejor jugador africano de 2015, nunca jugó un Mundial',
		'Organizó la Copa África en 2012 (con Guinea Ecuatorial) y en 2017',
		'Su techo: los cuartos de final de la Copa África',
	], '¡Tenía a Aubameyang!', '¡Y no te llevó!'),
	F('MLI', 'MIE', C, 'LAS ÁGUILAS DE MALÍ', 'Repesca 2022', [
		'2022: perdió la repesca africana contra Túnez por un gol en propia puerta',
		'Fue subcampeona de la Copa África en 1972',
		'Seydou Keita, campeón con el Barça, nunca pudo jugar un Mundial',
	], '¡Por un gol en propia!', '¡Qué mala suerte!'),
	G(C, 'EL RESTO DE ÁFRICA', ['ETH', 'SDN', 'COG', 'KEN', 'UGA', 'GIN'], 'Etiopía, Sudán y Congo ganaron la Copa África'),
	G(C, 'CENTROAMÉRICA Y EL CARIBE', ['GTM', 'NIC', 'DOM', 'SUR', 'GUY', 'PRI'], 'Toda esta zona sigue esperando'),
	G(C, 'OCEANÍA', ['FJI', 'PNG', 'NCL', 'PYF', 'SLB', 'VUT'], 'Solo Australia y Nueva Zelanda han ido'),
	{kind: 'cta', region: U, left: 'Y ahora... los que se quedaron a un partido'},
	F('ZMB', 'PAN', U, 'LOS CHIPOLOPOLO', 'Último partido de 1993', [
		'En 1993 perdió a casi toda su selección en un accidente aéreo',
		'Meses después, con un equipo nuevo, le bastaba un empate en Marruecos... y perdió 1-0',
		'En 2012 ganó la Copa África',
	], '¡Me faltó un empate!', '¡Qué historia!'),
	F('SYR', 'PAN', U, 'LAS ÁGUILAS DE QASIOUN', 'Repesca asiática 2017', [
		'Por la guerra, jugó como local en Malasia',
		'Repesca de 2017: cayó 2-1 contra Australia en la prórroga',
		'En el último minuto, una falta de Al Somah dio en el poste',
	], '¡Al Somah dio al poste!', '¡Por centímetros!'),
	F('BHR', 'PAN', U, 'LOS ROJOS', 'Repescas 2005 y 2009', [
		'2005: perdió la repesca contra Trinidad y Tobago (1-1 y 0-1)',
		'2009: volvió a caer en la repesca, contra Nueva Zelanda (0-0 y 0-1)',
		'En la vuelta de 2009 falló un penalti',
	], '¡Dos repescas perdidas!', '¡Yo ni he llegado a una!'),
	F('KOS', 'PAN', U, 'LOS DARDANOS', 'Final de la repesca 2026', [
		'Es miembro de la FIFA y de la UEFA desde 2016',
		'31 de marzo de 2026: perdió 0-1 contra Turquía la final de la repesca',
		'Con 1,6 millones de habitantes, habría sido de los países más pequeños del Mundial',
	], '¡A un partido del Mundial!', '¡A un solo partido!'),
	F('BFA', 'PAN', U, 'LOS SEMENTALES', 'Repesca 2013 (3-3)', [
		'2013: ganó 3-2 a Argelia en la ida de la repesca',
		'Perdió 1-0 en la vuelta: 3-3 en el global y fuera por los goles a domicilio',
		'Ese mismo año fue subcampeona de la Copa África',
	], '¡Empatamos la eliminatoria!', '¡La que más cerca estuvo!'),
];

export const OPP: Record<string, Opp> = {};
for (const e of SCRIPT) {
	if (e.kind === 'focus') OPP[e.k] = {n: NAME[e.k], flag: FL[e.k], p: 0, ow: 0, d: 0, ol: 0, cat: e.cat, best: e.best};
	if (e.kind === 'group') for (const k of e.keys) OPP[k] = {n: NAME[k], flag: FL[k], p: 0, ow: 0, d: 0, ol: 0, cat: e.cat, best: ''};
}
