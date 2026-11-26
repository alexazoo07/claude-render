// V40 · ¿Qué pasaría si Colombia hubiese ganado el Mundial? (universo alternativo: Mundial 2026)
import {makeStory, Scene, OutroEls, FL} from '../vs/Story';
import type {Fill, FaceSpec} from '../v12/Atlas';

const f = (k: string) => FL[k];
const C = (lift = 0.8, extra: Record<string, Fill> = {}): Record<string, Fill> => ({COL: {flag: f('COL'), lift}, ...extra});
const fc = (mood: FaceSpec['mood'], s = 1.8, extra: Record<string, FaceSpec> = {}): Record<string, FaceSpec> => ({COL: {mood, size: s, max: 220}, ...extra});
const ALT = 'UNIVERSO ALTERNATIVO';
const GOLD = '#F4C20D';
const CHAMPS = ['URY', 'ITA', 'DEU', 'BRA', 'ARG', 'FRA', 'ESP'];

const S: Scene[] = [
	// ---------------- HOOK
	{dur: 1000, cam: ['COL', 'PAN', 'ECU'], fills: C(0.9), faces: fc('sad', 2.6), music: 'm_tense',
		els: [{t: 'card', at: 10, pos: 'tr', tag: '7 DE JULIO DE 2026 · VANCOUVER', title: 'OCTAVOS: COLOMBIA 0-0 SUIZA', lines: ['120 minutos sin goles', 'Penaltis: 3-4 para Suiza'], col: '#E8394A'}, {t: 'stamp', text: 'ELIMINADA... ¡SIN PERDER!', at: 380, y: 760, x: 1200}, {t: 'bubble', k: 'COL', text: '¡No puede ser!', at: 520, dur: 260}]},
	{dur: 1000, cam: ['COL', 'BRA', 'MEX'], fills: C(1), faces: fc('worried', 2.2), music: 'm_tense', sfx: [[0, 'glitch', 0.5], [200, 'riser', 0.3]],
		els: [{t: 'title', text: '¿Y SI ESE PENALTI HUBIERA ENTRADO?', hl: 'PENALTI', at: 20, size: 84}, {t: 'title', text: '¿QUÉ PASARÍA SI COLOMBIA HUBIESE GANADO EL MUNDIAL?', hl: 'GANADO EL MUNDIAL', at: 300, y: 820, size: 66}]},
	// ---------------- REALIDAD
	{dur: 1500, cam: ['COL', 'PRT', 'UZB', 'COD', 'GHA'], fills: C(0.8, {UZB: {flag: f('UZB'), lift: 0.5}, COD: {flag: f('COD'), lift: 0.5}, PRT: {flag: f('PRT'), lift: 0.5}, GHA: {flag: f('GHA'), lift: 0.5}, CHE: {flag: f('CHE'), lift: 0.5}}), pop: ['UZB', 'COD', 'PRT', 'GHA', 'CHE'], popStep: 120, faces: fc('happy', 1.6, {PRT: {mood: 'worried', size: 1.5, max: 100}, CHE: {mood: 'smug', size: 1.5, max: 80}}), label: 'LO QUE PASÓ DE VERDAD', music: 'm_happy',
		els: [{t: 'title', text: 'SU MUNDIAL 2026, DE VERDAD', hl: 'DE VERDAD', at: 10, size: 80}, {t: 'chips', at: 40, y: 800, step: 110, items: [{flag: f('UZB'), text: '3-1 Uzbekistán', sub: 'Grupo K'}, {flag: f('COD'), text: '1-0 RD Congo', sub: 'Grupo K'}, {flag: f('PRT'), text: '0-0 Portugal', sub: 'Grupo K: ¡primera!'}, {flag: f('GHA'), text: '1-0 Ghana', sub: 'Dieciseisavos (Jhon Arias)'}, {flag: f('CHE'), text: '0-0 Suiza', sub: 'Octavos: 3-4 en penaltis'}]}]},
	{dur: 1200, cam: ['COL'], fills: C(0.9), faces: fc('sad', 2.2), label: 'LO QUE PASÓ DE VERDAD',
		els: [{t: 'big', n: 0, cap: 'DERROTAS EN TODO EL MUNDIAL', at: 30, x: 1350, y: 250}, {t: 'card', at: 300, pos: 'br', title: 'UN MUNDIAL DE CONTRASTES', lines: ['3 victorias y 2 empates', 'Décima de 48 selecciones', 'Y fuera... sin perder un solo partido'], col: '#E8394A'}, {t: 'bubble', k: 'COL', text: '¡Me fui invicta!', at: 160, dur: 200}]},
	{dur: 1500, cam: ['COL', 'USA', 'BRA'], fills: C(0.8), faces: fc('neutral', 1.8), label: 'SU HISTORIA',
		els: [{t: 'title', text: '7 MUNDIALES... Y NUNCA MÁS ALLÁ DE CUARTOS', hl: 'CUARTOS', at: 10, size: 70}, {t: 'chips', at: 60, y: 760, step: 24, items: [{text: '1962'}, {text: '1990', sub: 'Octavos'}, {text: '1994', sub: 'Fase de grupos'}, {text: '1998'}, {text: '2014', sub: '¡Cuartos!'}, {text: '2018', sub: 'Octavos'}, {text: '2026', sub: 'Octavos'}]}, {t: 'card', at: 520, pos: 'tr', title: 'SU TECHO: BRASIL 2014', lines: ['Cayó 2-1 ante Brasil en cuartos', 'James Rodríguez fue Bota de Oro con 6 goles'], col: GOLD}]},
	{dur: 1300, cam: ['COL', 'ARG', 'USA'], fills: C(0.8, {ARG: {flag: f('ARG'), lift: 0.6}, USA: {flag: f('USA'), lift: 0.5}}), faces: fc('sad', 1.8, {ARG: {mood: 'shock', size: 1.4, max: 120}}), label: 'SU HISTORIA',
		els: [{t: 'title', text: 'EL GRAN "¿Y SI...?" DE 1994', hl: '1994', at: 10}, {t: 'card', at: 60, pos: 'br', title: 'LA FAVORITA QUE NO FUE', lines: ['En 1993 goleó 0-5 a Argentina en Buenos Aires', 'Pelé la señaló como gran candidata', 'Pero cayó en la fase de grupos de EE. UU. 94'], col: '#E8394A'}, {t: 'bubble', k: 'ARG', text: '¡No me lo recuerdes!', at: 420, dur: 220}]},
	// ---------------- MULTIVERSO
	{dur: 900, cam: ['COL', 'CHE', 'CAN'], fills: C(1, {CHE: {color: '#9AA3B5', lift: 0.4}}), faces: fc('love', 2.2, {CHE: {mood: 'shock', size: 2, max: 140}}), label: ALT, music: 'm_triumph', sfx: [[0, 'glitch', 0.6], [300, 'crowd_roar', 0.35]],
		els: [{t: 'title', text: 'UNIVERSO ALTERNATIVO', hl: 'ALTERNATIVO', at: 10}, {t: 'card', at: 80, pos: 'tr', title: 'EL ÚLTIMO PENALTI... ¡ENTRA!', tag: 'VANCOUVER', lines: ['Colombia elimina a Suiza', 'Y se planta en cuartos por segunda vez en su historia'], col: GOLD}, {t: 'stamp', text: '¡A CUARTOS!', at: 300, y: 760, x: 1250, col: '#2FA35A'}]},
	{dur: 1500, cam: ['COL', 'ARG'], fills: C(1, {ARG: {flag: f('ARG'), lift: 1}}), faces: fc('angry', 1.8, {ARG: {mood: 'smug', size: 1.6, max: 160}}), label: ALT, music: 'm_tense',
		els: [{t: 'vs', at: 10, a: {flag: f('COL'), label: 'COLOMBIA', sub: 'Invicta'}, b: {flag: f('ARG'), label: 'ARGENTINA', sub: 'Campeona del mundo'}}, {t: 'card', at: 400, pos: 'bl', title: 'CUARTOS: LA REVANCHA', lines: ['La final de la Copa América 2024 fue para Argentina: 1-0 en la prórroga', 'En la realidad, en cuartos Argentina ganó 3-1 a Suiza'], col: '#4C8DFF'}]},
	{dur: 900, cam: ['COL', 'ARG'], fills: C(1, {ARG: {color: '#9AA3B5', lift: 0.4}}), faces: fc('love', 2, {ARG: {mood: 'sad', size: 1.6, max: 160}}), label: ALT, music: 'm_triumph', sfx: [[20, 'crowd_roar', 0.4]],
		els: [{t: 'stamp', text: '¡COLOMBIA A SEMIFINALES!', at: 20, y: 200, col: '#2FA35A'}, {t: 'bubble', k: 'COL', text: '¡Revancha cumplida!', at: 200, dur: 260}, {t: 'card', at: 300, pos: 'br', title: 'POR PRIMERA VEZ EN SU HISTORIA', lines: ['Colombia nunca ha jugado unas semifinales del Mundial'], col: GOLD}]},
	{dur: 1400, camBox: [960, 380, 1990, 1000], fills: C(1, {ENG: {flag: 'gb-eng', lift: 1}}), faces: fc('angry', 2.4, {ENG: {mood: 'smug', size: 2.2, max: 140}}), label: ALT, music: 'm_tense',
		els: [{t: 'vs', at: 10, a: {flag: f('COL'), label: 'COLOMBIA'}, b: {flag: 'gb-eng', label: 'INGLATERRA', sub: 'Eliminó a Noruega'}}, {t: 'card', at: 380, pos: 'bl', title: 'SEMIFINAL: CUENTAS PENDIENTES', lines: ['En el Mundial 2018 Inglaterra eliminó a Colombia en los penaltis', 'En la realidad, esta semifinal la jugó Argentina'], col: '#4C8DFF'}]},
	{dur: 900, camBox: [960, 380, 1990, 1000], fills: C(1, {ENG: {color: '#9AA3B5', lift: 0.4}}), faces: fc('love', 2.4, {ENG: {mood: 'sad', size: 2.2, max: 140}}), label: ALT, music: 'm_triumph', sfx: [[20, 'crowd_roar', 0.4]],
		els: [{t: 'stamp', text: '¡COLOMBIA EN LA FINAL!', at: 20, y: 200, col: '#2FA35A'}, {t: 'bubble', k: 'ENG', text: '¿Otra vez penaltis?', at: 200, dur: 260}]},
	{dur: 1500, camBox: [960, 330, 1990, 1000], fills: C(1, {ESP: {flag: f('ESP'), lift: 1}}), faces: fc('angry', 2.4, {ESP: {mood: 'cool', size: 2, max: 160}}), label: ALT, music: 'm_tense', sfx: [[700, 'drumroll', 0.4]],
		els: [{t: 'vs', at: 10, a: {flag: f('COL'), label: 'COLOMBIA'}, b: {flag: f('ESP'), label: 'ESPAÑA', sub: 'Eliminó a Francia'}}, {t: 'card', at: 380, pos: 'bl', title: 'LA FINAL · 19 DE JULIO', tag: 'NUEVA YORK / NUEVA JERSEY', lines: ['En la realidad, España ganó la final 1-0 a Argentina en la prórroga', 'Pero en este universo, su rival es Colombia...'], col: '#E8394A'}]},
	{dur: 1300, cam: ['COL', 'VEN', 'ECU'], fills: C(1), faces: fc('love', 3), label: ALT, music: 'm_triumph', sfx: [[0, 'whistle_long', 0.5], [40, 'crowd_roar', 0.5]],
		els: [{t: 'title', text: '¡COLOMBIA, CAMPEONA DEL MUNDO!', hl: 'CAMPEONA DEL MUNDO', at: 10, size: 86}, {t: 'confetti', at: 10}, {t: 'stamp', text: '★ 1 ESTRELLA ★', at: 200, y: 800, x: 1250, col: GOLD}]},
	// ---------------- CONSECUENCIAS
	{dur: 1400, cam: {x: 1880, y: 820, z: 0.55}, fills: {...Object.fromEntries([...CHAMPS, 'ENG'].map((k) => [k, {color: GOLD, lift: 0.6}])), COL: {flag: f('COL'), lift: 1}}, pop: [...CHAMPS, 'ENG'], popStep: 20, faces: fc('love', 2.2), label: ALT, music: 'm_happy',
		els: [{t: 'title', text: 'LA 9ª CAMPEONA DE LA HISTORIA', hl: '9ª', at: 10}, {t: 'chips', at: 60, y: 820, step: 18, items: [{flag: f('URY'), text: 'Uruguay'}, {flag: f('ITA'), text: 'Italia'}, {flag: f('DEU'), text: 'Alemania'}, {flag: f('BRA'), text: 'Brasil'}, {flag: 'gb-eng', text: 'Inglaterra'}, {flag: f('ARG'), text: 'Argentina'}, {flag: f('FRA'), text: 'Francia'}, {flag: f('ESP'), text: 'España'}, {flag: f('COL'), text: '¡COLOMBIA!'}]}]},
	{dur: 1300, cam: ['COL', 'BRA', 'ARG', 'URY'], fills: {COL: {flag: f('COL'), lift: 1}, BRA: {flag: f('BRA'), lift: 0.7}, ARG: {flag: f('ARG'), lift: 0.7}, URY: {flag: f('URY'), lift: 0.7}}, faces: fc('cool', 1.8, {BRA: {mood: 'shock', size: 1.4, max: 140}, ARG: {mood: 'angry', size: 1.2, max: 120}}), label: ALT,
		els: [{t: 'title', text: 'SUDAMÉRICA: 4 CAMPEONAS', hl: '4', at: 10}, {t: 'card', at: 80, pos: 'br', title: 'EL CLUB SE AMPLÍA', lines: ['Brasil (5), Argentina (3), Uruguay (2)...', '...y Colombia (1)', 'La primera campeona del norte de Sudamérica'], col: GOLD}, {t: 'bubble', k: 'BRA', text: 'Bem-vinda, Colômbia!', at: 420, dur: 220}, {t: 'bubble', k: 'ARG', text: '¡Pero la Copa América 2024 fue mía!', at: 700, dur: 260}]},
	{dur: 1200, cam: ['ESP', 'COL'], fills: {COL: {flag: f('COL'), lift: 1}, ESP: {color: '#9AA3B5', lift: 0.7}}, faces: fc('happy', 1.8, {ESP: {mood: 'sad', size: 1.8, max: 160}}), label: ALT,
		els: [{t: 'title', text: 'Y ESPAÑA...', hl: 'ESPAÑA', at: 10}, {t: 'card', at: 60, pos: 'br', title: 'SIN SU SEGUNDA ESTRELLA', lines: ['Se quedaría con la de Sudáfrica 2010', 'En la realidad, ganó la de 2026 con un gol de Ferran Torres'], col: '#E8394A'}, {t: 'bubble', k: 'ESP', text: '¡Devuélveme mi estrella!', at: 300, dur: 240}, {t: 'sub', f: 640}]},
	{dur: 1400, cam: ['COL'], fills: C(1), faces: fc('love', 2.6), label: ALT,
		els: [{t: 'title', text: 'ASÍ SE VIVIRÍA EN COLOMBIA', hl: 'COLOMBIA', at: 10, size: 80}, {t: 'card', at: 60, pos: 'br', title: 'UNA FIESTA HISTÓRICA', tag: 'IMAGINA', lines: ['Bogotá, Medellín, Cali y Barranquilla, de fiesta', 'Una estrella dorada sobre el escudo', 'James, campeón del mundo con 35 años', 'Y Luis Díaz, ídolo para siempre'], col: GOLD}, {t: 'bubble', k: 'COL', text: '¡Que viva Colombia!', at: 600, dur: 260}]},
	{dur: 1200, cam: ['COL', 'VEN', 'PER'], fills: C(1), faces: fc('cool', 2.4), label: 'DATO REAL',
		els: [{t: 'title', text: 'NO SERÍA SU PRIMER GRAN TÍTULO', hl: 'PRIMER', at: 10, size: 78}, {t: 'card', at: 60, pos: 'br', title: 'COPA AMÉRICA 2001', lines: ['La ganó en casa', 'Sin recibir ni un solo gol en todo el torneo'], col: GOLD}]},
	// ---------------- REALIDAD
	{dur: 1300, camBox: [960, 330, 1990, 1000], fills: {ESP: {flag: f('ESP'), lift: 1}, ARG: {flag: f('ARG'), lift: 0.6}, COL: {flag: f('COL'), lift: 0.6}}, faces: {ESP: {mood: 'love', size: 2, max: 160}, COL: {mood: 'sad', size: 1.6, max: 140}}, label: 'VOLVEMOS A LA REALIDAD', music: 'm_tense', sfx: [[0, 'glitch', 0.6]],
		els: [{t: 'title', text: 'PERO EN LA REALIDAD...', hl: 'REALIDAD', at: 10}, {t: 'card', at: 80, pos: 'br', title: 'ESPAÑA, CAMPEONA 2026', lines: ['1-0 a Argentina en la prórroga', 'Gol de Ferran Torres', 'Colombia, décima de 48'], col: '#E8394A'}]},
	{dur: 1200, cam: ['COL', 'MAR', 'ESP', 'PRT'], fills: {COL: {flag: f('COL'), lift: 1}, ESP: {flag: f('ESP'), lift: 0.6}, PRT: {flag: f('PRT'), lift: 0.6}, MAR: {flag: f('MAR'), lift: 0.6}}, faces: fc('happy', 1.6), label: 'EL FUTURO', music: 'm_happy',
		els: [{t: 'title', text: 'LA PRÓXIMA OPORTUNIDAD: 2030', hl: '2030', at: 10}, {t: 'card', at: 60, pos: 'br', title: 'MUNDIAL 2030', lines: ['España, Portugal y Marruecos', 'Con partidos del centenario en Uruguay, Argentina y Paraguay'], col: '#4C8DFF'}, {t: 'bubble', k: 'COL', text: '¡Esta vez sí!', at: 380, dur: 240}]},
	{dur: 900, cam: ['COL', 'BRA'], fills: C(1), faces: fc('happy', 2.4), music: 'm_triumph', els: OutroEls('¿Qué selección quieres en el próximo vídeo?')},
];
const SCALE = 1.18;
const W = makeStory({scenes: S.map((s) => ({...s, dur: Math.round(s.dur * SCALE)})), source: 'Resultados reales: Mundial 2026 y anteriores · Las escenas marcadas como "universo alternativo" son ficción', endAsk: ''});
export const Video40 = W.Video;
export const V40_TOTAL = W.TOTAL;
export const v40Sfx = W.sfx;
export const v40Music = W.music;
export const V40_START = W.START;
