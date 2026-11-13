// "¿Qué países tienen MÁS HABITANTES?" — gira por países con la plantilla común (engine/tour.ts).
// Dato: Banco Mundial, población total 2024 (SP.POP.TOTL). Investigación: research/habitantes.md.
// GANCHO NUEVO: "contador disparado" — un contador gigante sube a 8.140 MILLONES y de golpe India contra China.
import { Video } from '../engine/builder';
import type { ThumbV } from '../engine/Thumb';
import { C } from '../engine/theme';
import { geoBox, nameOf } from '../engine/world';
import { tour, WORLD, FULL, FR, type CatDef } from '../engine/tour';

// Banco Mundial 2024, millones, ordenado de mayor a menor (217 países y territorios; el puesto sale de este orden)
const RAW = 'IN:1450.9 CN:1409 US:340 ID:283.5 PK:251.3 NG:232.7 BR:212 BD:173.6 RU:143.7 ET:132.1 MX:130.9 JP:124 EG:116.5 PH:115.8 CD:109.3 VN:101 IR:91.6 TR:85.5 DE:83.5 TH:71.7 GB:69.3 TZ:68.6 FR:68.6 ZA:64 IT:59 KE:56.4 MM:54.5 CO:52.9 KR:51.8 SD:50.4 UG:50 ES:48.8 DZ:46.8 IQ:46 AR:45.7 AF:42.6 CA:41.3 YE:40.6 MA:38.1 AO:37.9 UA:37.9 PL:36.6 UZ:36.4 MY:35.6 SA:35.3 MZ:34.6 GH:34.4 PE:34.2 MG:32 CI:31.9 NP:29.7 CM:29.1 VE:28.4 AU:27.2 NE:27 KP:26.5 SY:24.7 ML:24.5 BF:23.5 LK:21.9 MW:21.7 ZM:21.3 KZ:20.6 TD:20.3 CL:19.8 RO:19.1 SO:19 SN:18.5 GT:18.4 EC:18.1 NL:18 KH:17.6 ZW:16.6 GN:14.8 BJ:14.5 RW:14.3 BI:14 BO:12.4 TN:12.3 SS:11.9 BE:11.9 HT:11.8 JO:11.6 DO:11.4 AE:11 CU:11 CZ:10.9 HN:10.8 PT:10.7 TJ:10.6 PG:10.6 SE:10.6 GR:10.4 AZ:10.2 IL:10 HU:9.6 AT:9.2 BY:9.1 CH:9 SL:8.6 TG:8.4 LA:7.8 HK:7.5 TM:7.5 LY:7.4 KG:7.2 PY:6.9 NI:6.9 RS:6.6 BG:6.4 SV:6.3 CG:6.3 SG:6 DK:6 LB:5.8 FI:5.6 LR:5.6 NO:5.6 SK:5.4 IE:5.4 CF:5.3 NZ:5.3 PS:5.3 OM:5.3 MR:5.2 CR:5.1 KW:4.9 PA:4.5 HR:3.9 GE:3.8 ER:3.5 MN:3.5 UY:3.4 PR:3.2 BA:3.2 AM:3 NA:3 LT:2.9 QA:2.9 JM:2.8 GM:2.8 GA:2.5 BW:2.5 MD:2.4 AL:2.4 LS:2.3 GW:2.2 SI:2.1 GQ:1.9 LV:1.9 MK:1.8 XK:1.6 BH:1.6 TL:1.4 EE:1.4 TT:1.4 CY:1.4 MU:1.2 SZ:1.2 DJ:1.2 FJ:0.9 KM:0.9 GY:0.8 SB:0.8 BT:0.8 LU:0.7 SR:0.6 ME:0.6 MT:0.6 MV:0.5 CV:0.5 BN:0.5 BZ:0.4 BS:0.4 IS:0.4';
const P: Record<string, number> = {}, RK: Record<string, number> = {};
RAW.split(' ').forEach((s, i) => { const [k, x] = s.split(':'); P[k] = +x; RK[k] = i + 1; });
/** 1450.9 → "1.451 M"; 48.8 → "48,8 M"; 0.4 → "0,4 M" */
const mill = (x: number) => (x >= 100 ? `${Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} M` : `${x.toFixed(1).replace('.', ',')} M`);
const pm = (id: string) => mill(P[id]);

const v = new Video('habitantes', '¿Qué países tienen MÁS HABITANTES?').setFps(60);
const DUR = 485;
export const HAB_MUSIC = ['wallpaper', 'cool_vibes', 'local_forecast', 'bossa_antigua'];
v.soundtrack(DUR, HAB_MUSIC, 0.3);

const CATS: CatDef[] = [
  { key: 'giant', color: C.yes, chip: '100 M o más', range: '100 millones o más', led: '+100 M', mood: 'shocked', hero: 'shocked', left: true },
  { key: 'big', color: C.purple, chip: '50-100 M', range: 'De 50 a 100 millones', led: '50-100', mood: 'happy', hero: 'wow', left: true },
  { key: 'mid', color: C.orange, chip: '10-50 M', range: 'De 10 a 50 millones', led: '10-50', mood: 'happy', hero: 'happy', left: false },
  { key: 'small', color: C.teal, chip: 'menos de 10 M', range: 'Menos de 10 millones', led: '-10 M', mood: 'cool', hero: 'happy', left: false },
];
const catOf = (id: string) => (P[id] >= 100 ? 'giant' : P[id] >= 50 ? 'big' : P[id] >= 10 ? 'mid' : 'small');
const R = tour(v, {
  dur: DUR, cats: CATS, catOf, label: 'HABITANTES',
  pill: pm, tag: (id) => `PUESTO ${RK[id]} · BANCO MUNDIAL`, title: (id) => `${pm(id)} de habitantes`,
  texts: (id) => [`Puesto n.º ${RK[id]} del mundo`], ribbon: (id) => [`¡${pm(id)}!`, 'de habitantes'],
  pairTag: 'BANCO MUNDIAL · 2024', pairTitle: (ids) => ids.map((id) => `${nameOf(id).split(' ')[0]}: ${pm(id)}`).join(' · '),
  pairRibbon: (ids) => [`¡${ids.map(pm).join(' Y ')}!`, 'de habitantes'], groupName: (id) => `${nameOf(id)} · ${pm(id)}`,
});
const { one, pair, rest, section, reg } = R;

// =================== GANCHO "CONTADOR DISPARADO" (0–7 s) ===================
v.hero(0.1, DUR, 'earth', { obj: 'earth', x: 240, y: 320, size: 330, label: 'LA TIERRA', mood: 'shocked' });
v.cam(0, WORLD, { dur: 0, ...FULL });
const STEPS = ['10.000.000', '900.000.000', '3.500.000.000', '6.900.000.000'];
STEPS.forEach((s, i) => { v.big(0.1 + i * 0.44, 0.1 + (i + 1) * 0.44, s, 'personas en el mundo…', C.gold); v.s2(0.1 + i * 0.44, 'tick', 0.4); });
v.big(1.86, 3.0, '8.140 MILLONES', 'de personas en el mundo (2024)', C.yes);
v.s2(1.86, 'boom', 0.35); v.shake(1.88, 12); v.flash(1.86, '#FFFFFF');
v.heroMood(1.9, 'terror');
// India contra China
v.cam(3.0, geoBox(66, 6, 135, 50), { dur: 0.8, left: 0.27, right: 0.2, top: 0.42, bottom: 0.04, pad: 0 });
v.fill(3.1, ['IN'], C.yes, 0.2); v.fill(3.25, ['CN'], C.no, 0.2);
v.face(3.2, 5.0, 'IN', 'proud', { scale: 1.0 }); v.face(3.3, 5.0, 'CN', 'shocked', { scale: 1.0 });
v.big(3.2, 4.85, '1.451 vs 1.409', 'millones · ¡India ya supera a China!', C.gold);
v.s2(3.2, 'boom', 0.3); v.shake(3.22, 10);
v.heroMood(3.3, 'wow');
v.cam(4.85, WORLD, { dur: 1.2, ...FULL });
v.fill(4.9, ['IN', 'CN'], C.land, 0.4);
v.title2(5.0, 6.95, ['¿Qué países tienen', '*MÁS HABITANTES*?'], [C.gold, C.yes], [
  { text: 'Banco Mundial · 2024', color: C.teal }, { text: 'país por país', color: C.purple },
]);
v.bubble(5.3, 6.85, 'hero', '¿Cuántos sois en tu país?', { side: 'right' });
v.s2(6.5, 'riser', 0.35);
R.S.T = 7.0;
R.legend('HABITANTES', '¿Cuántos sois en tu país?');

// =================== 1) AMÉRICA ===================
one('MX', { pad: 0.15, extra: '¡El país hispanohablante más poblado!', bubble: ['MX', '¡Somos un montón!'], moods: ['proud'] });
one('BR', { pad: 0.15, extra: 'El más poblado de Sudamérica', bubble: ['BR', '¡212 millones!'], moods: ['proud'] });
one('CO', { pad: 0.2, extra: '¡Más que España!', bubble: ['CO', '¡Más que España, parcero!'] });
one('AR', { pad: 0.2, extra: 'Casi como España', bubble: ['AR', '¡Che, casi 46 millones!'] });
one('CA', { pad: 0.08, extra: '¡2.º país más grande… y solo 41 M!', bubble: ['CA', '¡Tengo sitio de sobra!'], moods: ['cool'] });
one('PE', { pad: 0.2, bubble: ['PE', '¡34 millones!'] });
one('VE', { pad: 0.2, extra: 'Más que Australia', bubble: ['VE', '¡Más que Australia!'] });
one('CL', { pad: 0.2, bubble: ['CL', '¡Casi 20 millones!'] });
one('CU', { pad: 0.35, extra: '¡Haití ya tiene más!', bubble: ['CU', '¿Haití más que yo?'], moods: ['shocked'] });
rest(9, 'CENTROAMÉRICA', ['GT', 'HN', 'NI', 'SV', 'CR', 'PA'], geoBox(-92, 6.5, -76.5, 18), '¡Guatemala, la más poblada!');
v.subscribe(R.S.T - 8.5, R.S.T - 2.5);
rest(9, 'MÁS DE SUDAMÉRICA', ['EC', 'BO', 'PY', 'UY'], geoBox(-82, -36, -52, 3), '¡Uruguay, solo 3,4 millones!');
rest(9, 'EL CARIBE', ['HT', 'DO', 'JM', 'TT', 'BS'], geoBox(-80, 9, -58, 27.5), '¡Haití y R. Dominicana, 23 M juntos!');
reg('América');

// =================== 2) EUROPA ===================
one('ES', { len: 11, pad: 0.2, extra: '4.º país más poblado de la UE', bubble: ['ES', '¡Casi 49 millones!'], moods: ['proud'] });
one('DE', { pad: 0.25, extra: '¡El más poblado de la UE!', bubble: ['DE', '¡El n.º 1 de la UE!'], moods: ['proud'] });
pair(['GB', 'FR'], 'Reino Unido y Francia', { cam: geoBox(-9, 42, 9, 59), pad: 0, extra: '¡Casi empatados!', bubble: ['FR', '¡Casi empatados!'] });
one('IT', { pad: 0.2, bubble: ['IT', '¡59 millones, mamma mia!'] });
one('PL', { pad: 0.25, bubble: ['PL', '¡36,6 millones!'] });
one('UA', { pad: 0.2, extra: 'Estimación: la guerra complica el censo', bubble: ['UA', '¡Casi 38 millones!'] });
one('RU', { len: 11, pad: 0.05, extra: '¡El más poblado de Europa!', bubble: ['RU', '¡144 millones!'], moods: ['proud'] });
pair(['NL', 'BE'], 'Países Bajos y Bélgica', { cam: geoBox(1, 49, 8, 54), pad: 0, extra: 'Dos de los más densos de Europa', bubble: ['NL', '¡Muy apretados!'] });
pair(['PT', 'GR'], 'Portugal y Grecia', { cam: geoBox(-10, 34.5, 28, 44.5), pad: 0, extra: '¡Casi el mismo número!', bubble: ['GR', '¡Casi empatados!'] });
rest(9, 'MÁS PAÍSES DE EUROPA', ['RO', 'SE', 'AT', 'CH', 'NO', 'IE', 'IS'], geoBox(-24, 41, 32, 71), '¡Islandia, solo 0,4 millones!');
reg('Europa');
v.subscribe(R.S.T - 6.5, R.S.T - 0.5);

// =================== 3) ÁFRICA ===================
one('NG', { len: 11, pad: 0.3, extra: '¡El más poblado de África!', bubble: ['NG', '¡233 millones!'], moods: ['proud'] });
one('ET', { pad: 0.25, extra: '2.º de África', bubble: ['ET', '¡132 millones!'] });
one('EG', { pad: 0.25, extra: 'El más poblado del mundo árabe', bubble: ['EG', '¡Más de 100 millones!'] });
one('CD', { pad: 0.2, bubble: ['CD', '¡109 millones!'] });
pair(['DZ', 'MA'], 'Argelia y Marruecos', { cam: geoBox(-17, 19, 12, 37.5), pad: 0, bubble: ['MA', '¡Vecinos!'] });
one('ZA', { pad: 0.25, bubble: ['ZA', '¡64 millones!'] });
one('KE', { pad: 0.3, bubble: ['KE', '¡56 millones!'] });
rest(9, 'MÁS PAÍSES DE ÁFRICA', ['TZ', 'UG', 'AO', 'GH', 'MG', 'SN'], geoBox(-18, -27, 52, 16), '¡Tanzania, casi como Francia!');
reg('África');

// =================== 4) ASIA Y OCEANÍA ===================
one('TR', { pad: 0.2, bubble: ['TR', '¡85 millones!'] });
one('IR', { pad: 0.2, extra: '¡Más que Alemania!', bubble: ['IR', '¡Más que Alemania!'] });
pair(['SA', 'IQ'], 'Arabia Saudí e Irak', { cam: geoBox(36, 15, 56, 37.5), pad: 0, extra: '¡Irak tiene más!', bubble: ['IQ', '¡Más que mi vecino!'] });
one('JP', { pad: 0.1, extra: '¡Pierde habitantes cada año!', bubble: ['JP', '¡Cada vez somos menos!'], moods: ['worried'] });
one('PH', { pad: 0.15, bubble: ['PH', '¡116 millones!'] });
one('VN', { pad: 0.15, extra: '¡Ya pasó los 100 millones!', bubble: ['VN', '¡101 millones!'] });
one('BD', { pad: 0.2, extra: '¡En menos superficie que Uruguay!', bubble: ['BD', '¡174 millones y poco sitio!'], moods: ['shocked'] });
pair(['AU', 'NZ'], 'Australia y Nueva Zelanda', { cam: geoBox(112, -47, 179, -10), pad: 0, extra: '¡En Nueva Zelanda hay más ovejas!', bubble: ['NZ', '¡Más ovejas que personas!'], moods: ['cool', 'cool'] });
rest(9, 'MÁS DE ASIA', ['TH', 'MM', 'KR', 'MY', 'NP', 'KZ', 'MN'], geoBox(48, 0, 132, 55), '¡Mongolia, solo 3,5 millones!');
reg('Asia y Oceanía');

// =================== 5) TOP 5 ===================
{ const t = section(7, C.yes, '¡EL TOP 5!', 'los países con más habitantes', '¿Quién es el n.º 1?');
  v.subscribe(t + 3.7, t + 6.9, true); }
R.mark();
one('PK', { len: 9, pad: 0.15, tag: 'N.º 5 DEL MUNDO', pills: ['#5 · 251 M'], ribbon: ['#5: ¡251 M!', 'de habitantes'], bubble: ['PK', '¡Top 5!'], moods: ['proud'] });
one('ID', { len: 9, pad: 0.05, tag: 'N.º 4 DEL MUNDO', pills: ['#4 · 284 M'], extra: '¡Repartidos en unas 17.000 islas!', ribbon: ['#4: ¡284 M!', 'de habitantes'], bubble: ['ID', '¡17.000 islas!'], moods: ['proud'] });
one('US', { len: 10, pad: 0.06, tag: 'N.º 3 DEL MUNDO', pills: ['#3 · 340 M'], extra: '¡El 3.º del mundo!', ribbon: ['#3: ¡340 M!', 'de habitantes'], bubble: ['US', '¿Solo el tercero?'], moods: ['shocked'] });
one('CN', { len: 10, pad: 0.1, tag: 'N.º 2 DEL MUNDO', pills: ['#2 · 1.409 M'], extra: '¡Fue el n.º 1 hasta 2023!', ribbon: ['#2: ¡1.409 M!', 'de habitantes'], bubble: ['CN', '¿Ya no soy el primero?'], moods: ['shocked'] });
{ const r = one('IN', { len: 14, pad: 0.1, far: true, tag: 'N.º 1 DEL MUNDO', pills: ['#1 · 1.451 M'], title: '1.451 M de habitantes',
    texts: ['¡El país más poblado del mundo!', '¡Superó a China en 2023!'], ribbon: ['#1: ¡1.451 M!', '¡el más poblado!'], bubble: ['IN', '¿Quién será el n.º 1…?'], moods: ['proud'], climax: true });
  v.flash(r.tc, '#4BE07F'); v.shake(r.tc + 0.05, 18); v.fx(r.tc + 0.1, 'confetti'); v.s2(r.tc + 0.3, 'crowd_roar', 0.3);
  v.bubble(r.tc + 4.6, r.e - 0.3, 'hero', '¡Casi 1 de cada 5 personas!', { side: 'right' });
  v.heroMood(r.tc + 0.2, 'happy'); }
reg('Top 5');

// =================== RESULTADO Y CIERRE ===================
R.results('HABITANTES', 'Banco Mundial · 2024', '¡De 0,4 a 1.451 millones!', '¿Y tu país? ¿Te lo esperabas?');
R.outro('¿Cuántos habitantes tiene tu país? ¡Comenta!', 'habitantes');
R.hud(7.2, 'MÁS DE 50 M', 'MENOS DE 50 M', C.yes, C.orange, 10.6);

export const habitantes = v.end(DUR, 'Banco Mundial (2024) · población total');
export const HAB_DATA = { P, RK, pm };

// ---------- 5 miniaturas ----------
export const habitantesThumbs: ThumbV[] = [
  { layout: 'hero', top: 'LOS PAÍSES CON', bottom: '*MÁS HABITANTES*', accent: '#4BE07F', bg: { kind: 'map', view: geoBox(60, -10, 150, 50), flags: ['IN', 'CN', 'ID', 'PK', 'BD', 'JP', 'PH', 'VN'], faces: ['IN', 'CN', 'ID'] }, hero: { kind: 'object', name: 'earth', mood: 'shocked', glow: '#FFD23F' }, x: 640, y: 372, size: 470, rays: true },
  { layout: 'versus', top: '¿QUIÉN TIENE *MÁS*?', accent: '#FFD23F', left: { hero: { kind: 'country', id: 'IN', mood: 'proud', glow: '#4BE07F' }, bg: { kind: 'sea' }, label: '1.451 M', labelColor: '#4BE07F' }, right: { hero: { kind: 'country', id: 'CN', mood: 'shocked', glow: '#FF3B30' }, bg: { kind: 'dark' }, label: '1.409 M', labelColor: '#FF4B3E' }, size: 480 },
  { layout: 'number', top: '¡SOMOS', big: '8.140', bigColor: '#4BE07F', accent: '#4BE07F', bottom: '*MILLONES!*', bg: { kind: 'dark' }, hero: { kind: 'object', name: 'earth', mood: 'terror', glow: '#4BE07F' }, size: 420 },
  { layout: 'hero', top: 'EL PAÍS MÁS', bottom: '*POBLADO*', accent: '#FFD23F', bg: { kind: 'fire' }, hero: { kind: 'country', id: 'IN', mood: 'proud', glow: '#FFD23F' }, x: 640, y: 370, size: 500, rays: true },
  { layout: 'grid', top: '¿CUÁNTOS', bottom: '*SOIS EN TU PAÍS?*', accent: '#FFD23F', bg: { kind: 'sea' }, grid: { ids: ['IN', 'CN', 'US', 'MX', 'ES', 'AR'], moods: ['proud', 'shocked', 'wow', 'happy', 'happy', 'cool'] } },
];
