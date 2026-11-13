// "¿Qué EJÉRCITOS son los más PODEROSOS?" — gira por países con la plantilla común (engine/tour.ts).
// Dato: Global Firepower 2026 (puesto de 145 según su PowerIndex). Investigación: research/ejercitos.md.
// GANCHO NUEVO: "latigazo triple" — la cámara salta EE. UU. → Rusia → China con un "¿N.º 1?" gigante en cada uno.
import { Video } from '../engine/builder';
import type { ThumbV } from '../engine/Thumb';
import { C } from '../engine/theme';
import { geoBox, nameOf } from '../engine/world';
import { tour, WORLD, FULL, FR, type CatDef } from '../engine/tour';

// Global Firepower 2026: puesto (1 = más poderoso) de 145 países
const ORDER = 'US RU CN IN KR FR JP GB TR IT BR DE ID PK IL IR AU ES EG UA PL TW VN TH SA SE DZ CA SG GR KP AR NG NL MM MX BD PT NO ZA PH MY CO IQ DK CH ET FI CL PE VE RO UZ AE CZ MA HU KZ AO AZ BE BG RS CD CU SD AT LK SK BY QA EC HR JO BH KW AL TM TN LY PY BO KH KE TD OM SY LT TZ NZ SI MZ MN IE GE GT UY YE CM TJ AM LV HN ML ZW EE UG CI KG LU ZM GH SS MK DO NI CG LB ER NE AF NA MR NP LA SN BF ME SV BW MG GA BA IS PA MD SO BJ XK SL LR SR CF BZ BT';
const RK: Record<string, number> = {};
ORDER.split(' ').forEach((id, i) => { RK[id] = i + 1; });
const has = (id: string) => RK[id] !== undefined;
const rk = (id: string) => (has(id) ? `n.º ${RK[id]}` : 'sin ejército');

const v = new Video('ejercitos', '¿Qué EJÉRCITOS son los más PODEROSOS?').setFps(60);
const DUR = 492;
export const EJ_MUSIC = ['local_forecast', 'bossa_antigua', 'wallpaper', 'cool_vibes'];
v.soundtrack(DUR, EJ_MUSIC, 0.3);

const CATS: CatDef[] = [
  { key: 'top', color: C.yes, chip: 'TOP 10', range: 'Top 10', led: 'TOP 10', mood: 'cool', hero: 'wow', left: true },
  { key: 'good', color: C.purple, chip: 'puesto 11-30', range: 'Del 11 al 30', led: '11-30', mood: 'proud', hero: 'happy', left: true },
  { key: 'mid', color: C.orange, chip: 'puesto 31-60', range: 'Del 31 al 60', led: '31-60', mood: 'happy', hero: 'happy', left: false },
  { key: 'low', color: C.no, chip: 'puesto 61+', range: 'Del 61 en adelante', led: '61+', mood: 'worried', hero: 'worried', left: false },
];
const catOf = (id: string) => (!has(id) ? 'low' : RK[id] <= 10 ? 'top' : RK[id] <= 30 ? 'good' : RK[id] <= 60 ? 'mid' : 'low');
const R = tour(v, {
  dur: DUR, cats: CATS, catOf, label: 'EJÉRCITO',
  pill: rk, tag: () => 'GLOBAL FIREPOWER 2026', title: (id) => `Puesto ${RK[id]} de 145`,
  texts: (id) => [`Ranking de poder militar: ${rk(id)}`], ribbon: (id) => [`¡N.º ${RK[id]}!`, 'de 145 ejércitos'],
  pairTag: 'GLOBAL FIREPOWER 2026', pairTitle: (ids) => ids.map((id) => `${nameOf(id).split(' ')[0]}: ${rk(id)}`).join(' · '),
  pairRibbon: (ids) => [`¡N.º ${ids.map((id) => RK[id]).join(' Y ')}!`, 'de 145 ejércitos'], groupName: (id) => `${nameOf(id)} · ${rk(id)}`,
});
const { one, pair, rest, section, reg } = R;

// =================== GANCHO "LATIGAZO TRIPLE" (0–7 s) ===================
v.hero(0.1, DUR, 'tank', { obj: 'tank', x: 240, y: 320, size: 330, label: 'EJÉRCITO', mood: 'shocked' });
const WHIP: [string, number][] = [['US', 0.06], ['RU', 0.05], ['CN', 0.1]];
WHIP.forEach(([id, pad], i) => {
  const t = 0.05 + i * 1.15;
  v.cam(t, [id], { dur: i === 0 ? 0 : 0.45, ...FR, pad });
  v.fill(t + 0.2, [id], C.no, 0.15); v.flag(t + 0.25, [id], 0.2);
  v.face(t + 0.3, i < 2 ? t + 1.15 : 3.6, id, 'evil', { scale: 1.0 });
  v.big(t + 0.3, t + 1.12, `¿${{ US: 'EE. UU.', RU: 'RUSIA', CN: 'CHINA' }[id]}?`, '¿el ejército n.º 1?', C.gold);
  v.s2(t + 0.3, 'boom', 0.3); v.shake(t + 0.32, 10); v.flash(t + 0.3, '#FFFFFF');
});
v.heroMood(0.4, 'terror');
v.cam(3.55, WORLD, { dur: 1.1, ...FULL });
v.fill(3.6, ['US', 'RU', 'CN'], C.land, 0.4);
v.title2(4.0, 6.95, ['¿Qué *EJÉRCITOS*', 'son los más', '*PODEROSOS*?'], [C.gold, C.gold, C.yes], [
  { text: 'Global Firepower 2026', color: C.teal }, { text: 'país por país', color: C.purple },
]);
v.heroMood(4.1, 'wow');
v.bubble(4.4, 6.85, 'hero', '¿En qué puesto está el tuyo?', { side: 'right' });
v.s2(6.5, 'riser', 0.35);
R.S.T = 7.0;
R.legend('PODER MILITAR · PUESTO', '¡Hay 145 ejércitos en el ranking!');

// =================== 1) AMÉRICA ===================
one('MX', { pad: 0.15, bubble: ['MX', '¿Solo el 36?'], moods: ['shocked'] });
one('BR', { pad: 0.15, extra: '¡El más fuerte de Latinoamérica!', bubble: ['BR', '¡N.º 1 de aquí!'], moods: ['proud'] });
one('AR', { pad: 0.2, bubble: ['AR', '¡Che, puesto 32!'] });
one('CO', { pad: 0.2, bubble: ['CO', '¡Puesto 43!'] });
one('CL', { pad: 0.2, bubble: ['CL', '¡Puesto 49!'] });
one('PE', { pad: 0.2, extra: '¡A uno de Chile!', bubble: ['PE', '¡Pegado a Chile!'] });
one('VE', { pad: 0.2, extra: '¡A uno de Perú!', bubble: ['VE', '¡Puesto 51!'] });
one('CU', { pad: 0.35, bubble: ['CU', '¡Puesto 65!'] });
one('CA', { pad: 0.08, extra: '¡Su vecino es el n.º 1!', bubble: ['CA', '¡Mi vecino da miedo!'], moods: ['worried'] });
stop0();
rest(9, 'CENTROAMÉRICA', ['GT', 'HN', 'NI', 'SV', 'PA'], geoBox(-92, 6.5, -76.5, 18), '¡Guatemala, la más fuerte de aquí!');
v.subscribe(R.S.T - 8.5, R.S.T - 2.5);
rest(9, 'MÁS DE SUDAMÉRICA', ['EC', 'PY', 'BO', 'UY'], geoBox(-82, -36, -52, 3), '¡Ecuador, puesto 72!');
reg('América');
// Costa Rica: sin ejército desde 1948 (no está en el ranking)
function stop0() {
  R.stop({ ids: ['CR'], pad: 0.4, name: 'Costa Rica', tag: 'SIN EJÉRCITO', title: 'Sin ejército desde 1948', texts: ['¡Abolió su ejército en 1948!', 'No aparece en el ranking'],
    pills: ['sin ejército'], ribbon: ['¡SIN EJÉRCITO!', 'desde 1948'], special: { color: C.teal, chip: 'sin ejército' }, bubble: ['CR', '¿Ejército? ¡Pura vida!'], moods: ['cool'] });
}

// =================== 2) EUROPA ===================
one('ES', { len: 11, pad: 0.2, extra: 'Por delante de Egipto y Ucrania', bubble: ['ES', '¡Puesto 18!'], moods: ['proud'] });
one('FR', { pad: 0.2, extra: '¡El más fuerte de la UE!', bubble: ['FR', '¡Top 10, oh là là!'], moods: ['cool'] });
one('GB', { pad: 0.2, bubble: ['GB', '¡Top 10!'], moods: ['cool'] });
one('IT', { pad: 0.2, extra: '¡Entra justo en el top 10!', bubble: ['IT', '¡Décimo, mamma mia!'] });
one('DE', { pad: 0.25, extra: '¡Se queda fuera del top 10!', bubble: ['DE', '¿Puesto 12?'], moods: ['shocked'] });
one('UA', { pad: 0.2, extra: '¡Por delante de Polonia!', bubble: ['UA', '¡Puesto 20!'] });
one('PL', { pad: 0.25, bubble: ['PL', '¡Puesto 21!'] });
pair(['GR', 'PT'], 'Grecia y Portugal', { cam: geoBox(-10, 34.5, 28, 44.5), pad: 0, bubble: ['GR', '¡Yo, el 30!'] });
pair(['SE', 'FI'], 'Suecia y Finlandia', { cam: geoBox(10, 55, 32, 70), pad: 0, bubble: ['SE', '¡Puesto 26!'] });
pair(['NL', 'BE'], 'Países Bajos y Bélgica', { cam: geoBox(1, 49, 8, 54), pad: 0, bubble: ['NL', '¡Puesto 34!'] });
rest(9, 'MÁS PAÍSES DE EUROPA', ['NO', 'DK', 'CH', 'RO', 'CZ', 'HU', 'AT'], geoBox(-24, 41, 32, 71), '¡Noruega, puesto 39!');
reg('Europa');
v.subscribe(R.S.T - 6.5, R.S.T - 0.5);

// =================== 3) ÁFRICA ===================
one('EG', { len: 11, pad: 0.25, extra: '¡El más fuerte de África!', bubble: ['EG', '¡N.º 1 de África!'], moods: ['proud'] });
one('DZ', { pad: 0.25, extra: '2.º de África', bubble: ['DZ', '¡Puesto 27!'] });
one('NG', { pad: 0.3, bubble: ['NG', '¡Puesto 33!'] });
one('ZA', { pad: 0.25, bubble: ['ZA', '¡Puesto 40!'] });
one('ET', { pad: 0.25, bubble: ['ET', '¡Puesto 47!'] });
one('MA', { pad: 0.25, bubble: ['MA', '¡Puesto 56!'] });
rest(9, 'MÁS PAÍSES DE ÁFRICA', ['AO', 'TN', 'KE', 'LY', 'SD'], geoBox(-14, -18, 42, 38), '¡Angola, puesto 59!');
reg('África');

// =================== 4) ORIENTE MEDIO, ASIA Y OCEANÍA ===================
one('TR', { pad: 0.2, extra: '¡Top 10 del mundo!', bubble: ['TR', '¡Noveno!'], moods: ['cool'] });
pair(['IL', 'IR'], 'Israel e Irán', { cam: geoBox(33, 24, 63, 40), pad: 0, extra: '¡Separados por un solo puesto!', bubble: ['IR', '¡Uno por detrás!'] });
one('SA', { pad: 0.2, bubble: ['SA', '¡Puesto 25!'] });
one('PK', { pad: 0.15, extra: 'Por delante de Israel e Irán', bubble: ['PK', '¡Puesto 14!'] });
one('JP', { pad: 0.1, extra: '¡Por delante de Reino Unido!', bubble: ['JP', '¡Séptimo!'], moods: ['cool'] });
one('KP', { pad: 0.3, extra: '¡Lejos de Corea del Sur!', bubble: ['KP', '¿Solo el 31?'], moods: ['angry'] });
one('ID', { pad: 0.05, extra: '¡El más fuerte del sudeste asiático!', bubble: ['ID', '¡Puesto 13!'], moods: ['proud'] });
one('VN', { pad: 0.15, bubble: ['VN', '¡Puesto 23!'] });
pair(['AU', 'NZ'], 'Australia y Nueva Zelanda', { cam: geoBox(112, -47, 179, -10), pad: 0, extra: '¡73 puestos de diferencia!', bubble: ['AU', '¡Yo, el 17!'], moods: ['proud', 'worried'] });
rest(9, 'MÁS DE ASIA', ['TW', 'TH', 'SG', 'MM', 'BD', 'PH', 'MY'], geoBox(85, -2, 128, 30), '¡Taiwán, puesto 22!');
reg('Asia y Oceanía');

// =================== 5) TOP 5 ===================
{ const t = section(7, C.yes, '¡EL TOP 5!', 'los ejércitos más poderosos', '¿Quién es el n.º 1?');
  v.subscribe(t + 3.7, t + 6.9, true); }
R.mark();
one('KR', { len: 9, cam: geoBox(124, 33, 131, 39.5), pad: 0, pills: ['#5'], extra: '¡26 puestos por delante del Norte!', ribbon: ['¡N.º 5!', 'del mundo'], bubble: ['KR', '¡Top 5!'], moods: ['cool'] });
one('IN', { len: 9, pad: 0.15, pills: ['#4'], ribbon: ['¡N.º 4!', 'del mundo'], bubble: ['IN', '¡Cuarto!'], moods: ['cool'] });
one('CN', { len: 9, pad: 0.1, pills: ['#3'], ribbon: ['¡N.º 3!', 'del mundo'], bubble: ['CN', '¡Bronce!'], moods: ['cool'] });
one('RU', { len: 9, pad: 0.05, pills: ['#2'], ribbon: ['¡N.º 2!', 'del mundo'], bubble: ['RU', '¡Casi el primero!'], moods: ['angry'] });
{ const r = one('US', { len: 14, pad: 0.06, far: true, pills: ['#1'], title: 'Puesto 1 de 145',
    texts: ['¡El ejército más poderoso del mundo!', 'PowerIndex 0,0741 (cuanto menos, mejor)'], ribbon: ['¡N.º 1!', '¡el más poderoso!'], bubble: ['US', '¿Quién será el n.º 1…?'], moods: ['cool'], climax: true });
  v.flash(r.tc, '#4BE07F'); v.shake(r.tc + 0.05, 18); v.fx(r.tc + 0.1, 'confetti'); v.s2(r.tc + 0.3, 'crowd_roar', 0.3);
  v.bubble(r.tc + 4.6, r.e - 0.3, 'hero', '¡Rusia y China, justo detrás!', { side: 'right' });
  v.heroMood(r.tc + 0.2, 'shocked'); }
reg('Top 5');

// =================== RESULTADO Y CIERRE ===================
R.results('PODER MILITAR', 'Global Firepower 2026', '¡145 ejércitos en el ranking!', '¿Y tu país? ¿Te lo esperabas?');
R.outro('¿En qué puesto está tu país? ¡Comenta!', 'ejercitos');
R.hud(7.2, 'TOP 30', 'PUESTO 31+', C.yes, C.no, 10.6);

export const ejercitos = v.end(DUR, 'Global Firepower 2026 · ranking de poder militar (145 países)');
export const EJ_DATA = { RK };

// ---------- 5 miniaturas ----------
export const ejercitosThumbs: ThumbV[] = [
  { layout: 'hero', top: 'LOS EJÉRCITOS', bottom: '*MÁS PODEROSOS*', accent: '#4BE07F', bg: { kind: 'map', view: geoBox(-130, 10, 140, 65), flags: ['US', 'RU', 'CN', 'IN', 'FR', 'GB'], faces: ['US', 'RU', 'CN'] }, hero: { kind: 'object', name: 'tank', mood: 'evil', glow: '#FFD23F' }, x: 640, y: 372, size: 470, rays: true },
  { layout: 'versus', top: '¿QUIÉN *GANA*?', accent: '#FFD23F', left: { hero: { kind: 'country', id: 'US', mood: 'evil', glow: '#4BE07F' }, bg: { kind: 'sea' }, label: 'N.º 1', labelColor: '#4BE07F' }, right: { hero: { kind: 'country', id: 'RU', mood: 'angry', glow: '#FF3B30' }, bg: { kind: 'dark' }, label: 'N.º 2', labelColor: '#FF4B3E' }, size: 480 },
  { layout: 'number', top: '¡RANKING DE', big: '145', bigColor: '#4BE07F', accent: '#4BE07F', bottom: '*EJÉRCITOS!*', bg: { kind: 'dark' }, hero: { kind: 'object', name: 'tank', mood: 'evil', glow: '#4BE07F' }, size: 420 },
  { layout: 'hero', top: 'EL EJÉRCITO', bottom: '*MÁS PODEROSO*', accent: '#FFD23F', bg: { kind: 'fire' }, hero: { kind: 'object', name: 'tank', mood: 'angry', glow: '#FF3B30' }, x: 640, y: 370, size: 500, rays: true },
  { layout: 'grid', top: '¿QUÉ PUESTO', bottom: '*TIENE TU PAÍS?*', accent: '#FFD23F', bg: { kind: 'sea' }, grid: { ids: ['US', 'RU', 'CN', 'ES', 'MX', 'CR'], moods: ['cool', 'angry', 'evil', 'proud', 'shocked', 'cool'] } },
];
