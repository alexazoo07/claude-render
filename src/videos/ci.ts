// "¿Qué países tienen el COEFICIENTE INTELECTUAL más alto?" — gira por países con la plantilla común (engine/tour.ts).
// Dato: International IQ Test (IIT), resultados 2025 (vía World Population Review). Es un test ONLINE: no es un estudio
// representativo; se avisa en la leyenda, en la fuente y en la descripción. Tono neutro: sin caras tristes para los bajos.
// GANCHO NUEVO: "quiz" — ¿cuál de estos 3 tiene la media más alta? EE. UU. / Alemania / Irán → sorpresa: Irán.
import { Video } from '../engine/builder';
import type { ThumbV } from '../engine/Thumb';
import { C } from '../engine/theme';
import { geoBox, nameOf } from '../engine/world';
import { tour, WORLD, FULL, FR, type CatDef } from '../engine/tour';

// IIT 2025, de mayor a menor (incluye territorios: Hong Kong, Macao, Feroe, Reunión, Puerto Rico; el puesto sale de este orden)
const RAW = 'HK:107.73 KR:106.97 CN:106.48 MO:106.32 JP:106.30 TW:105.80 IR:104.80 AU:104.45 RU:103.78 SG:103.56 MN:102.61 NZ:102.35 VN:102.26 ES:102.24 CY:102.12 CA:102.09 GB:101.57 LK:101.22 SI:101.15 BY:101.05 US:101.04 AL:101.00 CH:100.84 GE:100.35 IT:100.33 NL:100.27 PE:100.20 HU:100.15 AM:100.13 FR:100.12 FI:99.97 PT:99.95 LT:99.95 TH:99.94 RS:99.83 AT:99.80 BE:99.74 MT:99.68 GR:99.55 CZ:99.36 DE:99.32 HR:99.32 PL:99.14 LB:99.13 EE:99.08 LV:99.01 RO:98.88 MK:98.88 SK:98.87 LU:98.75 IL:98.57 MY:98.51 IN:98.44 ME:98.43 SY:98.41 NO:98.31 MM:98.28 SE:98.22 IE:98.22 AZ:98.03 QA:97.94 DK:97.68 DZ:97.53 TN:97.46 AE:97.39 BD:97.32 NP:97.31 IS:97.25 MA:97.24 FO:97.23 BA:97.13 AR:97.11 TR:97.00 PK:96.93 MD:96.85 EG:96.74 UZ:96.54 BG:96.54 BN:96.54 CU:96.40 CL:96.34 UY:96.09 ET:96.00 KZ:95.92 JO:95.73 MV:95.71 PH:95.68 UA:95.66 BO:95.56 EC:95.45 BR:95.44 TT:94.81 LY:94.76 MU:94.66 CO:94.62 KG:94.48 BH:94.25 SA:94.07 CR:93.80 MX:93.64 ZA:93.63 IQ:93.62 YE:93.43 TJ:93.39 RE:93.25 KW:93.13 KH:93.12 ZM:93.05 PR:93.01 LA:92.97 PS:92.94 NG:92.76 VE:92.61 PY:92.38 SN:92.26 OM:92.18 JM:92.00 BJ:91.96 KE:91.69 PA:91.65 ZW:91.64 GH:91.40 GT:91.35 CM:90.59 HN:90.41 CI:90.37 MZ:90.33 NA:90.29 DO:90.11 SV:90.00 ID:89.96 BW:89.72 TZ:89.57 AF:89.31 CD:88.60 UG:88.49 GA:88.35 AO:87.89 NI:87.75 RW:86.90 TL:86.70 SO:83.84';
const Q: Record<string, number> = {}, RK: Record<string, number> = {};
RAW.split(' ').forEach((s, i) => { const [k, x] = s.split(':'); Q[k] = +x; RK[k] = i + 1; });
const q = (id: string) => Q[id].toFixed(1).replace('.', ',');

const v = new Video('ci', '¿Qué países tienen el COEFICIENTE INTELECTUAL más alto?').setFps(60);
const DUR = 503;
export const CI_MUSIC = ['cool_vibes', 'local_forecast', 'bossa_antigua', 'wallpaper'];
v.soundtrack(DUR, CI_MUSIC, 0.3);

const CATS: CatDef[] = [
  { key: 'top', color: C.yes, chip: '103 o más', range: '103 o más', led: '103+', mood: 'proud', hero: 'wow', left: true },
  { key: 'good', color: C.purple, chip: '100-103', range: 'De 100 a 103', led: '100-103', mood: 'happy', hero: 'happy', left: true },
  { key: 'mid', color: C.orange, chip: '95-100', range: 'De 95 a 100', led: '95-100', mood: 'happy', hero: 'happy', left: false },
  { key: 'low', color: C.teal, chip: 'menos de 95', range: 'Menos de 95', led: '-95', mood: 'wow', hero: 'wow', left: false },
];
const catOf = (id: string) => (Q[id] >= 103 ? 'top' : Q[id] >= 100 ? 'good' : Q[id] >= 95 ? 'mid' : 'low');
const R = tour(v, {
  dur: DUR, cats: CATS, catOf, label: 'CI MEDIO',
  pill: q, tag: (id) => `PUESTO ${RK[id]} · TEST IIT`, title: (id) => `${q(id)} de media`,
  texts: (id) => [`Puesto n.º ${RK[id]} del ranking`], ribbon: (id) => [`¡${q(id)}!`, 'de CI medio'],
  pairTag: 'TEST IIT · 2025', pairTitle: (ids) => ids.map((id) => `${nameOf(id).split(' ')[0]}: ${q(id)}`).join(' · '),
  pairRibbon: (ids) => [`¡${ids.map(q).join(' Y ')}!`, 'de CI medio'], groupName: (id) => `${nameOf(id)} · ${q(id)}`,
});
const { one, pair, rest, section, reg } = R;

// =================== GANCHO "QUIZ" (0–7,6 s) ===================
v.hero(0.1, DUR, 'brain', { obj: 'brain', x: 240, y: 320, size: 320, label: 'CEREBRO', mood: 'wow' });
v.cam(0, WORLD, { dur: 0, ...FULL });
v.title2(0.1, 3.6, ['¿Cuál tiene el', '*CI MEDIO* más alto?'], [C.gold, C.yes]);
v.group(0.7, 3.7, 'ELIGE UNO', [{ flag: 'US', name: 'A) Estados Unidos', color: C.purple }, { flag: 'DE', name: 'B) Alemania', color: C.orange }, { flag: 'IR', name: 'C) Irán', color: C.yes }]);
v.heroMood(0.6, 'worried');
([['US', C.purple], ['DE', C.orange], ['IR', C.yes]] as [string, string][]).forEach(([id], i) => {
  v.fill(0.8 + i * 0.35, [id], C.gold, 0.2); v.fx(0.85 + i * 0.35, 'pulse', { id, color: '#FFFFFF' });
  v.face(0.9 + i * 0.35, 3.6, id, 'wow', { scale: 0.9 }); v.s2(0.85 + i * 0.35, 'pop', 0.4);
});
v.fill(3.6, ['US', 'DE'], C.land, 0.3);
v.suspense(3.7, 0.8);
v.cam(3.6, ['IR'], { dur: 0.8, ...FR, pad: 0.5 });
v.fill(3.75, ['IR'], C.yes, 0.2); v.face(3.8, 5.9, 'IR', 'proud', { scale: 1.1 });
v.big(3.75, 5.75, '¡IRÁN! 104,8', 'por delante de EE. UU. (101,0) y Alemania (99,3)', C.yes);
v.s2(3.75, 'boom', 0.35); v.shake(3.77, 12); v.flash(3.75, '#4BE07F');
v.heroMood(3.8, 'shocked');
v.cam(5.75, WORLD, { dur: 1.2, ...FULL });
v.fill(5.8, ['IR'], C.land, 0.4);
v.title2(5.9, 7.55, ['¿Qué países tienen el', '*CI* más *ALTO*?'], [C.gold, C.yes], [
  { text: 'test online IIT · 2025', color: C.teal }, { text: 'país por país', color: C.purple },
]);
v.s2(7.1, 'riser', 0.35);
R.S.T = 7.6;
R.legend('CI MEDIO · TEST ONLINE IIT', '¡Ojo: es un test online, no un estudio oficial!');

// =================== 1) AMÉRICA ===================
one('MX', { pad: 0.15, extra: 'Casi igual que Costa Rica (93,8)', bubble: ['MX', '¿Cuánto sacamos?'] });
one('US', { len: 11, pad: 0.06, extra: '¡Por encima de 100!', bubble: ['US', '¡Aprobado!'] });
one('CA', { pad: 0.08, extra: '¡Por encima de EE. UU.!', bubble: ['CA', '¡Les gano a mis vecinos!'], moods: ['proud'] });
one('BR', { pad: 0.15, bubble: ['BR', '¡95,4!'] });
one('AR', { pad: 0.2, extra: '2.º de Latinoamérica', bubble: ['AR', '¡Che, segundo!'], moods: ['proud'] });
one('CL', { pad: 0.2, bubble: ['CL', '¡96,3!'] });
one('CO', { pad: 0.2, bubble: ['CO', '¡94,6, parcero!'] });
one('PE', { pad: 0.2, extra: '¡El más alto de Latinoamérica!', bubble: ['PE', '¡El n.º 1 de aquí!'], moods: ['proud'] });
one('VE', { pad: 0.2, bubble: ['VE', '¡92,6!'] });
one('CU', { pad: 0.35, extra: '¡Un pelo por encima de Chile!', bubble: ['CU', '¡Más que Chile!'] });
rest(9, 'CENTROAMÉRICA', ['CR', 'PA', 'GT', 'HN', 'SV', 'NI'], geoBox(-92, 6.5, -76.5, 18), '¡Costa Rica, la más alta de aquí!');
v.subscribe(R.S.T - 8.5, R.S.T - 2.5);
rest(9, 'MÁS DE SUDAMÉRICA', ['UY', 'BO', 'EC', 'PY'], geoBox(-82, -36, -52, 3), '¡Uruguay, 96,1!');
rest(9, 'EL CARIBE', ['TT', 'DO', 'JM'], geoBox(-80, 9, -58, 27.5), '¡Trinidad y Tobago, 94,8!');
reg('América');

// =================== 2) EUROPA ===================
one('ES', { len: 11, pad: 0.2, extra: '¡El más alto de la UE!', bubble: ['ES', '¡Olé, n.º 1 de la UE!'], moods: ['proud'] });
one('FR', { pad: 0.2, bubble: ['FR', '¡Por encima de 100!'] });
one('DE', { pad: 0.25, extra: '¡Por debajo de España!', bubble: ['DE', '¿Por debajo de 100?'], moods: ['shocked'] });
one('IT', { pad: 0.2, bubble: ['IT', '¡100,3, perfetto!'] });
one('GB', { pad: 0.2, extra: 'Por encima de Francia', bubble: ['GB', '¡Más que Francia!'], moods: ['proud'] });
pair(['PT', 'GR'], 'Portugal y Grecia', { cam: geoBox(-10, 34.5, 28, 44.5), pad: 0, extra: '¡Casi empatados!', bubble: ['GR', '¡Casi 100!'] });
pair(['NL', 'BE'], 'Países Bajos y Bélgica', { cam: geoBox(1, 49, 8, 54), pad: 0, bubble: ['NL', '¡Vecinos y casi iguales!'] });
one('PL', { pad: 0.25, bubble: ['PL', '¡99,1!'] });
one('UA', { pad: 0.2, bubble: ['UA', '¡95,7!'] });
one('RU', { len: 11, pad: 0.05, extra: '¡El más alto de Europa!', bubble: ['RU', '¡El n.º 1 de Europa!'], moods: ['proud'] });
rest(9, 'MÁS PAÍSES DE EUROPA', ['CH', 'AT', 'SE', 'NO', 'FI', 'DK', 'IE'], geoBox(-24, 41, 32, 71), '¡Suiza, por encima de 100!');
reg('Europa');
v.subscribe(R.S.T - 6.5, R.S.T - 0.5);

// =================== 3) ÁFRICA ===================
one('EG', { pad: 0.25, extra: '¡Más que Brasil!', bubble: ['EG', '¡96,7!'] });
pair(['DZ', 'MA'], 'Argelia y Marruecos', { cam: geoBox(-17, 19, 12, 37.5), pad: 0, extra: '¡Argelia, la más alta de África!', bubble: ['DZ', '¡N.º 1 de África!'], moods: ['proud', 'happy'] });
one('NG', { pad: 0.3, bubble: ['NG', '¡92,8!'] });
one('ET', { pad: 0.25, extra: '¡Más que Brasil!', bubble: ['ET', '¡96!'] });
one('ZA', { pad: 0.25, extra: 'Igual que México (93,6)', bubble: ['ZA', '¡Empatado con México!'] });
one('KE', { pad: 0.3, bubble: ['KE', '¡91,7!'] });
rest(9, 'MÁS PAÍSES DE ÁFRICA', ['TN', 'GH', 'SN', 'CM', 'TZ', 'AO'], geoBox(-18, -18, 42, 38), '¡Túnez, casi como Argelia!');
reg('África');

// =================== 4) ORIENTE MEDIO, ASIA Y OCEANÍA ===================
one('TR', { pad: 0.2, bubble: ['TR', '¡97!'] });
pair(['SA', 'AE'], 'Arabia Saudí y Emiratos', { cam: geoBox(34, 15, 57, 32.5), pad: 0, extra: '¡Emiratos le saca 3 puntos!', bubble: ['AE', '¡Les gano!'] });
one('IL', { pad: 0.7, bubble: ['IL', '¡98,6!'] });
one('IN', { pad: 0.15, extra: 'Casi como Noruega (98,3)', bubble: ['IN', '¡98,4!'] });
one('VN', { pad: 0.15, extra: '¡Más que EE. UU.!', bubble: ['VN', '¡Por encima de 102!'], moods: ['proud'] });
pair(['TH', 'MY'], 'Tailandia y Malasia', { cam: geoBox(97, 0.5, 120, 21), pad: 0, extra: '¡Tailandia, casi 100!', bubble: ['TH', '¡Casi 100!'] });
one('ID', { pad: 0.05, bubble: ['ID', '¡90!'] });
one('PH', { pad: 0.15, bubble: ['PH', '¡95,7!'] });
pair(['AU', 'NZ'], 'Australia y Nueva Zelanda', { cam: geoBox(112, -47, 179, -10), pad: 0, extra: '¡Australia, en el grupo más alto!', bubble: ['AU', '¡104,5, mate!'], moods: ['proud', 'happy'] });
rest(9, 'MÁS DE ASIA', ['MN', 'LK', 'BD', 'NP', 'KZ', 'UZ'], geoBox(48, 5, 132, 55), '¡Mongolia, 102,6!');
reg('Asia y Oceanía');

// =================== 5) TOP 5 (países; Hong Kong y Macao no cuentan) ===================
{ const t = section(7, C.yes, '¡EL TOP 5!', 'los CI medios más altos', '¿Quién es el n.º 1?');
  v.subscribe(t + 3.7, t + 6.9, true); }
R.mark();
one('IR', { len: 9, pad: 0.2, tag: 'N.º 5 DE LOS PAÍSES', pills: ['#5 · 104,8'], extra: '¡Por delante de EE. UU. y Alemania!', ribbon: ['#5: ¡104,8!', 'de CI medio'], bubble: ['IR', '¡Os lo dije!'], moods: ['proud'] });
one('TW', { len: 9, cam: geoBox(117, 20.5, 125, 27), pad: 0, tag: 'N.º 4 DE LOS PAÍSES', pills: ['#4 · 105,8'], ribbon: ['#4: ¡105,8!', 'de CI medio'], bubble: ['TW', '¡Top 4!'], moods: ['proud'] });
one('JP', { len: 9, cam: geoBox(128, 30, 146, 45), pad: 0, tag: 'N.º 3 DE LOS PAÍSES', pills: ['#3 · 106,3'], ribbon: ['#3: ¡106,3!', 'de CI medio'], bubble: ['JP', '¡Bronce!'], moods: ['proud'] });
one('CN', { len: 9, pad: 0.1, tag: 'N.º 2 DE LOS PAÍSES', pills: ['#2 · 106,5'], extra: 'Hong Kong: ¡107,7! (no es un país)', ribbon: ['#2: ¡106,5!', 'de CI medio'], bubble: ['CN', '¡Y Hong Kong aún más!'], moods: ['proud'] });
{ const r = one('KR', { len: 14, cam: geoBox(123, 33, 132, 39.5), pad: 0, far: true, tag: 'N.º 1 DE LOS PAÍSES', pills: ['#1 · 107,0'], title: '107,0 de media',
    texts: ['¡El CI medio más alto de los países!', 'Solo le supera Hong Kong (territorio)'], ribbon: ['#1: ¡107,0!', '¡el más alto!'], bubble: ['KR', '¿Quién será el n.º 1…?'], moods: ['proud'], climax: true });
  v.flash(r.tc, '#4BE07F'); v.shake(r.tc + 0.05, 18); v.fx(r.tc + 0.1, 'confetti'); v.s2(r.tc + 0.3, 'crowd_roar', 0.3);
  v.bubble(r.tc + 4.6, r.e - 0.3, 'hero', '¡Asia oriental, arriba del todo!', { side: 'right' });
  v.heroMood(r.tc + 0.2, 'happy'); }
reg('Top 5');

// =================== RESULTADO Y CIERRE ===================
R.results('CI MEDIO', 'test online IIT · 2025', '¡Asia oriental, arriba del todo!', '¿Y tu país? ¿Te lo esperabas?');
R.outro('¿Qué nota sacaría tu país? ¡Comenta!', 'ci');
R.hud(7.8, 'MÁS DE 100', 'MENOS DE 100', C.yes, C.orange, 11.2);

export const ci = v.end(DUR, 'International IQ Test (2025) · test online, no es un estudio oficial');
export const CI_DATA = { Q, RK, q };

// ---------- 5 miniaturas ----------
export const ciThumbs: ThumbV[] = [
  { layout: 'hero', top: 'LOS PAÍSES MÁS', bottom: '*INTELIGENTES*', accent: '#4BE07F', bg: { kind: 'map', view: geoBox(95, 15, 150, 50), flags: ['KR', 'CN', 'JP', 'TW', 'MN', 'VN'], faces: ['KR', 'JP', 'CN'] }, hero: { kind: 'object', name: 'brain', mood: 'proud', glow: '#FFD23F' }, x: 640, y: 372, size: 470, rays: true },
  { layout: 'versus', top: '¿QUIÉN SACA *MÁS*?', accent: '#FFD23F', left: { hero: { kind: 'country', id: 'IR', mood: 'proud', glow: '#4BE07F' }, bg: { kind: 'sea' }, label: '104,8', labelColor: '#4BE07F' }, right: { hero: { kind: 'country', id: 'US', mood: 'shocked', glow: '#B78CFF' }, bg: { kind: 'dark' }, label: '101,0', labelColor: '#B78CFF' }, size: 480 },
  { layout: 'number', top: '¡CI MEDIO DE', big: '107', bigColor: '#4BE07F', accent: '#4BE07F', bottom: '*EN COREA!*', bg: { kind: 'dark' }, hero: { kind: 'object', name: 'brain', mood: 'wow', glow: '#4BE07F' }, size: 420 },
  { layout: 'hero', top: '¿QUÉ PAÍS ES', bottom: '*MÁS LISTO?*', accent: '#FFD23F', bg: { kind: 'fire' }, hero: { kind: 'object', name: 'brain', mood: 'shocked', glow: '#FFD23F' }, x: 640, y: 370, size: 500, rays: true },
  { layout: 'grid', top: '¿QUÉ NOTA', bottom: '*SACA TU PAÍS?*', accent: '#FFD23F', bg: { kind: 'sea' }, grid: { ids: ['KR', 'JP', 'ES', 'US', 'MX', 'AR'], moods: ['proud', 'proud', 'happy', 'wow', 'happy', 'happy'] } },
];
