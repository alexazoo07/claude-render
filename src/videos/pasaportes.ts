// "Los PASAPORTES más PODEROSOS del mundo" — formato GIRA POR PAÍSES (plantilla deuda.ts).
// Dato: Henley Passport Index, edición de octubre de 2026 (destinos sin visado previo). Investigación: research/pasaportes.md.
// GANCHO NUEVO (distinto de iphone y deuda): "mapa que se enciende" — el mundo se pinta de verde en oleada con los 193 destinos
// de Singapur y de golpe se apaga: Afganistán solo 22. Después, la pregunta.
import { Video, type Mood } from '../engine/builder';
import type { ThumbV } from '../engine/Thumb';
import { C } from '../engine/theme';
import { geo, geoBox, nameOf, COUNTRIES, BY_ID } from '../engine/world';

const v = new Video('pasaportes', '¿Qué PASAPORTES son los más PODEROSOS?').setFps(60);
const FR = { left: 0.27, right: 0.2, bottom: 0.21, top: 0.11 };
const DUR = 513;
export const PAS_MUSIC = ['bossa_antigua', 'wallpaper', 'cool_vibes', 'local_forecast']; // temas aprobados (nov. 2026)
v.soundtrack(DUR, PAS_MUSIC, 0.3);
const WORLD = geoBox(-150, -45, 160, 72);

// ---------- datos: [puesto, destinos sin visado] (Henley, oct. 2026) ----------
const D: Record<string, [number, number]> = {
  SG: [1, 193], JP: [2, 188], KR: [2, 188], AE: [2, 188], SE: [3, 187], NO: [4, 186], ES: [4, 186], NL: [4, 186], FI: [4, 186], FR: [4, 186],
  DE: [4, 186], DK: [4, 186], IE: [4, 186], IT: [4, 186], BE: [4, 186], PT: [5, 185], GR: [5, 185], CH: [5, 185], AT: [5, 185],
  MY: [6, 184], HU: [6, 184], GB: [6, 184], PL: [6, 184], CA: [7, 183], CZ: [7, 183], NZ: [7, 183], AU: [7, 183], US: [10, 180], IS: [10, 180],
  RO: [11, 178], BG: [11, 178], CL: [14, 174], BR: [15, 170], AR: [16, 169], IL: [17, 167], BB: [19, 164], BS: [21, 158],
  MX: [23, 155], UY: [23, 155], CR: [28, 147], PA: [29, 146], PY: [30, 144], TT: [31, 143], UA: [32, 142], PE: [33, 141], TW: [34, 136],
  RS: [35, 135], GT: [37, 131], SV: [38, 130], CO: [38, 130], HN: [39, 129], NI: [43, 125], GE: [47, 121], VE: [49, 115], RU: [50, 114],
  QA: [51, 112], TR: [51, 112], ZA: [52, 101], KW: [54, 97], EC: [56, 91], SA: [57, 90], BH: [59, 87], OM: [61, 84], CN: [62, 83], JM: [62, 83],
  BY: [65, 78], KZ: [66, 77], TH: [66, 77], BO: [67, 76], DO: [69, 72], ID: [71, 70], KE: [71, 70], MA: [71, 70], GH: [74, 67], PH: [75, 66],
  TN: [76, 65], MN: [77, 64], UZ: [82, 57], CU: [83, 56], SN: [83, 56], DZ: [84, 55], IN: [84, 55], VN: [89, 49], EG: [89, 49], JO: [89, 49],
  NG: [92, 45], LB: [95, 41], ET: [95, 41], LK: [97, 38], IR: [98, 37], KP: [99, 35], BD: [99, 35], NP: [100, 34], SO: [101, 32],
  YE: [102, 30], PK: [103, 29], IQ: [104, 28], SY: [105, 25], AF: [106, 22],
};
const sc = (id: string) => D[id][1];
const rk = (id: string) => D[id][0];

// ---------- categorías (destinos sin visado) ----------
type Cat = 'top' | 'good' | 'mid' | 'low';
const CAT: Record<Cat, { color: string; label: string; range: string; mood: Mood; hero: Mood }> = {
  top: { color: C.yes, label: '180+ destinos', range: '180 o más', mood: 'cool', hero: 'happy' },
  good: { color: C.purple, label: '150-179', range: 'De 150 a 179', mood: 'happy', hero: 'happy' },
  mid: { color: C.orange, label: '100-149', range: 'De 100 a 149', mood: 'worried', hero: 'worried' },
  low: { color: C.no, label: '-100 destinos', range: 'Menos de 100', mood: 'cry', hero: 'shocked' },
};
const catOf = (s: number): Cat => (s >= 180 ? 'top' : s >= 150 ? 'good' : s >= 100 ? 'mid' : 'low');
const cid = (id: string) => catOf(sc(id));

// ---------- marcadores ----------
const n: Record<Cat, number> = { top: 0, good: 0, mid: 0, low: 0 };
const led: Record<Cat, { t: number; v: number }[]> = { top: [{ t: 0, v: 0 }], good: [{ t: 0, v: 0 }], mid: [{ t: 0, v: 0 }], low: [{ t: 0, v: 0 }] };
const vs: { t: number; l: number; r: number }[] = [{ t: 0, l: 0, r: 0 }];
const rows: { t: number; flag: string; name: string; pill: string; color: string }[] = [];
const seen: Record<Cat, string[]> = { top: [], good: [], mid: [], low: [] };
const count = (t: number, cat: Cat, k: number) => {
  n[cat] += k; led[cat].push({ t, v: n[cat] });
  vs.push({ t, l: n.top + n.good, r: n.mid + n.low });
};

let T = 0;
const blk = (len: number) => { const a = T; T += len; return a; };

// ---------- una parada (1-3 países) ----------
type Stop = {
  len?: number; ids: string[]; at?: Record<string, [number, number]>; cam?: string[] | [number, number, number, number]; pad?: number;
  name: string; tag: string; title: string; texts: string[]; pills?: string[]; far?: boolean;
  ribbon: [string, string]; bubble?: [string, string]; moods?: Mood[]; climax?: boolean;
};
const stop = (o: Stop) => {
  const len = o.len ?? 10, t = blk(len), e = t + len, tc = o.climax ? t + 6.5 : e - 3.2;
  const cats = o.ids.map(cid), k = CAT[cats[cats.length - 1]];
  const far = !!o.far;
  v.cam(t - (far ? 0.6 : 0.35), o.cam ?? o.ids, { dur: far ? 2.1 : 1.6, ...FR, pad: o.pad ?? 0.25 });
  o.ids.forEach((id, i) => {
    const d = i * 0.35, kc = CAT[cats[i]], at = o.at?.[id];
    v.rope(t + 0.2 + d, e - 0.15, id, '#FFFFFF', at);
    v.flag(t + 0.5 + d, [id], 0.3);
    v.fx(t + 0.55 + d, 'pulse', { id, at, color: '#FFFFFF' });
    v.s2(t + 0.55 + d, 'pop', 0.5);
    v.face(t + 0.6 + d, tc + 0.1, id, 'wow', { scale: o.climax ? 1.3 : 0.9, at });
    v.face(tc + 0.1, e + 0.1, id, o.moods?.[i] ?? kc.mood, { scale: o.climax ? 1.3 : 0.9, at });
    v.tag(t + 0.5 + d, e - 0.1, id, nameOf(id).toUpperCase(), at);
    v.fill(e, [id], kc.color, 0.35);
    v.face(e + 0.1, DUR, id, 'dots', { scale: 0.55, at });
    rows.push({ t: tc + 0.15 + i * 0.25, flag: id, name: nameOf(id), pill: o.pills?.[i] ?? `${sc(id)}`, color: kc.color });
    count(tc, cats[i], 1); seen[cats[i]].push(id);
  });
  v.info(t + 0.6, e - 0.2, { flag: o.ids[0], name: o.name, tag: o.tag, chip: k.label, chipColor: k.color, chipAt: tc, hideTitle: true, label: 'PASAPORTE', labelColor: k.color, title: o.title, texts: o.texts });
  v.heroMood(t + 0.9, 'wow');
  if (o.bubble) {
    const hero = o.bubble[0] === 'hero';
    v.bubble(t + 2.6, tc - 0.15, hero ? 'hero' : o.bubble[0], o.bubble[1], { side: hero ? 'right' : 'left', at: hero ? undefined : o.at?.[o.bubble[0]] });
  }
  v.suspense(tc, o.climax ? 0.95 : 0.8);
  v.ribbon(tc, o.climax ? tc + 4.5 : e - 0.4, o.ribbon[0], k.color, o.ribbon[1], '★');
  v.heroMood(tc + 0.1, k.hero);
  return { t, e, tc };
};
const one = (id: string, o: Partial<Stop> & { extra?: string; bubble?: [string, string] }) =>
  stop({ ids: [id], name: nameOf(id), tag: `PUESTO ${rk(id)} · HENLEY`, title: `${sc(id)} destinos sin visado`,
    texts: [`Puesto n.º ${rk(id)} del mundo`, ...(o.extra ? [o.extra] : [])], ribbon: [`¡${sc(id)} DESTINOS!`, 'sin visado'], ...o });
const pair = (ids: string[], name: string, o: Partial<Stop> & { extra?: string }) =>
  stop({ len: 11, ids, name, tag: 'HENLEY · OCT. 2026', title: ids.map((id) => `${nameOf(id).split(' ')[0]}: ${sc(id)}`).join(' · '),
    texts: [...ids.map((id) => `${nameOf(id)}: puesto ${rk(id)}`), ...(o.extra ? [o.extra] : [])],
    ribbon: [`¡${ids.map(sc).join(' Y ')}!`, 'destinos sin visado'], ...o });

// ---------- grupo pequeño de países sueltos ----------
const rest = (len: number, title: string, ids: string[], box: [number, number, number, number], bubble: string) => {
  const t = blk(len), e = t + len;
  v.cam(t - 0.35, box, { dur: 1.6, ...FR, pad: 0.02 });
  ids.forEach((id, i) => { const c = cid(id); v.fill(t + 0.6 + i * 0.2, [id], CAT[c].color, 0.3); seen[c].push(id); });
  v.crowd(t + 0.9, DUR, ids, 'dots', 0.5, 0.03);
  v.group(t + 0.5, e - 0.2, title, ids.map((id) => ({ flag: id, name: `${nameOf(id)} · ${sc(id)}`, color: CAT[cid(id)].color })));
  v.s2(t + 0.6, 'whoosh', 0.35);
  v.heroMood(t + 0.8, 'wow');
  v.bubble(t + 1.4, e - 0.4, 'hero', bubble, { side: 'right' });
  ids.forEach((id, i) => rows.push({ t: t + 1.2 + i * 0.25, flag: id, name: nameOf(id), pill: `${sc(id)}`, color: CAT[cid(id)].color }));
  (['top', 'good', 'mid', 'low'] as Cat[]).forEach((c) => { const k = ids.filter((id) => cid(id) === c).length; if (k) count(t + 1.2, c, k); });
};

const section = (len: number, color: string, text: string, sub: string, bubble?: string) => {
  const t = blk(len);
  v.cam(t - 0.3, WORLD, { dur: 1.7, ...FR, pad: 0 });
  v.ribbon(t + 0.4, t + 3.6, text, color, sub, '★');
  v.s2(t + 0.2, 'riser', 0.4);
  v.heroMood(t + 0.5, 'shocked');
  if (bubble) v.bubble(t + 0.6, t + 3.6, 'hero', bubble, { side: 'right' });
  return t;
};

// =================== GANCHO "MAPA QUE SE ENCIENDE" (0–7 s) ===================
const ALL = COUNTRIES.map((c) => c.id).filter((id) => id !== 'AQ' && id !== 'SG' && id !== 'AF');
v.hero(0.1, DUR, 'passport', { obj: 'passport', x: 240, y: 320, size: 330, label: 'PASAPORTE', mood: 'happy' });
v.cam(0, WORLD, { dur: 0, left: 0, right: 0, bottom: 0, top: 0, pad: 0 });
v.fill(0.05, ['SG'], C.gold, 0.2);
v.fx(0.1, 'pulse', { id: 'SG', at: geo(103.82, 1.35), color: '#FFFFFF' });
v.big(0.15, 2.5, '193 PAÍSES', 'sin visado con el pasaporte de Singapur', C.yes);
v.s2(0.15, 'boom', 0.3);
{ const sgc = BY_ID.SG.c;
  const byDist = [...ALL].sort((a, b) => Math.hypot(BY_ID[a].c[0] - sgc[0], BY_ID[a].c[1] - sgc[1]) - Math.hypot(BY_ID[b].c[0] - sgc[0], BY_ID[b].c[1] - sgc[1]));
  const N = 10, per = Math.ceil(byDist.length / N);
  for (let i = 0; i < N; i++) {
    v.fill(0.35 + i * 0.17, byDist.slice(i * per, (i + 1) * per), C.yes, 0.25);
    if (i % 3 === 0) v.s2(0.35 + i * 0.17, 'pop', 0.35);
  } }
v.heroMood(0.4, 'wow');
// apagón: Afganistán
v.fill(2.55, ALL.concat(['SG']), C.land, 0.2);
v.fill(2.6, ['AF'], C.no, 0.2);
v.cam(2.55, ['AF'], { dur: 0.9, ...FR, pad: 1.4 });
v.face(2.7, 4.5, 'AF', 'cry', { scale: 1.0 });
v.big(2.65, 4.4, 'SOLO 22', 'con el pasaporte de Afganistán', C.no);
v.s2(2.65, 'boom', 0.35); v.shake(2.67, 12);
v.heroMood(2.7, 'terror');
v.cam(4.4, WORLD, { dur: 1.3, left: 0, right: 0, bottom: 0, top: 0, pad: 0 });
v.fill(4.45, ['AF'], C.land, 0.4);
v.title2(4.5, 6.95, ['¿Qué *PASAPORTES*', 'son los más', '*PODEROSOS*?'], [C.gold, C.gold, C.yes], [
  { text: 'Henley · oct. 2026', color: C.teal }, { text: 'país por país', color: C.purple },
]);
v.heroMood(4.6, 'wow');
v.bubble(4.9, 6.85, 'hero', '¿Y el tuyo cuántos tiene?', { side: 'right' });
v.s2(6.5, 'riser', 0.35);
T = 7.0;

// =================== LEYENDA ===================
{ const t = blk(3.6);
  v.legend(t + 0.1, t + 3.5, 'DESTINOS SIN VISADO', [
    { color: C.yes, label: '180+', desc: '180 o más' },
    { color: C.purple, label: '150-179', desc: 'De 150 a 179' },
    { color: C.orange, label: '100-149', desc: 'De 100 a 149' },
    { color: C.no, label: '-100', desc: 'Menos de 100' },
  ]);
  v.bubble(t + 0.4, t + 3.4, 'hero', '¿A cuántos países entras sin visado?', { side: 'right' });
  v.heroMood(t + 0.3, 'happy'); }

// =================== 1) AMÉRICA ===================
let s = T;
const reg = (name: string) => { v.region(s, T, name); s = T; };
one('MX', { pad: 0.15, extra: 'Entra sin visado a Europa', bubble: ['MX', '¿Cuántos tengo yo?'] });
one('US', { len: 11, pad: 0.06, extra: '¡Era el n.º 1 en 2014!', bubble: ['US', '¿Solo el décimo?'], moods: ['shocked'] });
one('CA', { pad: 0.08, extra: 'Por delante de EE. UU.', bubble: ['CA', '¡Les gano a mis vecinos!'], moods: ['proud'] });
one('BR', { pad: 0.15, extra: '2.º de Latinoamérica', bubble: ['BR', '¡Morado, quase verde!'] });
one('AR', { pad: 0.2, extra: 'A uno de Brasil', bubble: ['AR', '¡Che, por un destino!'] });
one('CL', { pad: 0.2, extra: '¡El mejor de Latinoamérica!', bubble: ['CL', '¡Soy el campeón aquí!'], moods: ['proud'] });
one('CO', { pad: 0.2, bubble: ['CO', '¡Naranja, parcero!'] });
one('PE', { pad: 0.2, bubble: ['PE', '¡Por encima de Colombia!'] });
one('VE', { pad: 0.2, extra: 'Por debajo de Colombia y Brasil', bubble: ['VE', '¡Naranja, pero cerca del rojo!'], moods: ['worried'] });
one('CU', { pad: 0.35, bubble: ['CU', '¡Solo 56!'] });
rest(9, 'CENTROAMÉRICA', ['CR', 'PA', 'GT', 'SV', 'HN', 'NI'], geoBox(-92, 6.5, -76.5, 18), '¡Costa Rica, la mejor de aquí!');
v.subscribe(T - 8.5, T - 2.5);
rest(9, 'MÁS DE SUDAMÉRICA', ['UY', 'PY', 'EC', 'BO'], geoBox(-82, -36, -52, 3), '¡Uruguay, empatado con México!');
rest(9, 'EL CARIBE', ['BB', 'BS', 'TT', 'JM', 'DO'], geoBox(-80, 9, -58, 27.5), '¡Barbados, el mejor del Caribe!');
reg('América');

// =================== 2) EUROPA ===================
one('ES', { len: 11, pad: 0.2, extra: '¡Empatado en el 4.º puesto!', bubble: ['ES', '¡186 países, olé!'], moods: ['proud'] });
one('FR', { pad: 0.2, bubble: ['FR', '¡Igual que España!'] });
one('DE', { pad: 0.25, bubble: ['DE', '¡Verde, wunderbar!'], moods: ['cool'] });
one('IT', { pad: 0.2, bubble: ['IT', '¡Mamma mia, 186!'] });
one('GB', { pad: 0.2, extra: '¡Era el n.º 1 en 2014!', bubble: ['GB', '¡Antes era el mejor!'], moods: ['worried'] });
pair(['PT', 'GR'], 'Portugal y Grecia', { cam: geoBox(-10, 34.5, 28, 44.5), pad: 0, extra: '¡Empatados en el 5.º puesto!', bubble: ['GR', '¡Empatados!'] });
pair(['PL', 'HU'], 'Polonia y Hungría', { cam: geoBox(12, 45.5, 25, 55.5), pad: 0, bubble: ['PL', '¡184 los dos!'] });
one('UA', { pad: 0.2, extra: 'Supera a Rusia en 28 destinos', bubble: ['UA', '¡Más que Rusia!'] });
one('RU', { pad: 0.05, extra: '¡28 menos que Ucrania!', bubble: ['RU', '¿Solo 114?'], moods: ['shocked'] });
rest(9, 'MÁS PAÍSES DE EUROPA', ['NO', 'CH', 'AT', 'NL', 'IE', 'IS', 'RO', 'BG'], geoBox(-24, 41, 32, 71), '¡Casi toda Europa en verde!');
reg('Europa');
v.subscribe(T - 6.5, T - 0.5);

// =================== 3) ÁFRICA ===================
one('MA', { pad: 0.25, bubble: ['MA', '¡70 destinos!'] });
one('EG', { pad: 0.25, bubble: ['EG', '¡Rojo faraónico!'], moods: ['cry'] });
one('NG', { pad: 0.3, bubble: ['NG', '¡Solo 45!'] });
one('ZA', { pad: 0.25, extra: 'El mejor de África continental', bubble: ['ZA', '¡Por encima de 100!'], moods: ['proud'] });
rest(9, 'MÁS PAÍSES DE ÁFRICA', ['KE', 'GH', 'TN', 'SN', 'DZ', 'ET'], geoBox(-18, -6, 48, 37), '¡África, casi toda en rojo!');
reg('África');

// =================== 4) ORIENTE MEDIO ===================
one('TR', { pad: 0.2, bubble: ['TR', '¡Naranja!'] });
one('IL', { pad: 0.7, extra: 'El mejor de su región tras Emiratos', bubble: ['IL', '¡Morado!'] });
pair(['SA', 'QA'], 'Arabia Saudí y Catar', { cam: geoBox(34, 15, 57, 32.5), pad: 0, extra: '¡Catar le saca 22!', bubble: ['QA', '¡Pequeño pero más fuerte!'] });
rest(9, 'MÁS DE ORIENTE MEDIO', ['KW', 'BH', 'OM', 'JO', 'LB', 'IR'], geoBox(32, 14, 64, 40), '¡Irán, solo 37!');
reg('Oriente Medio');

// =================== 5) ASIA Y OCEANÍA ===================
one('CN', { len: 11, pad: 0.1, extra: 'Hong Kong: ¡175 destinos!', bubble: ['CN', '¿Hong Kong más que yo?'], moods: ['shocked'] });
one('IN', { pad: 0.15, bubble: ['IN', '¡Solo 55!'], moods: ['cry'] });
stop({ len: 12, ids: ['ID', 'PH', 'VN'], cam: geoBox(95, -11, 127, 23), pad: 0, name: 'Indonesia, Filipinas y Vietnam', tag: 'HENLEY · OCT. 2026', title: 'Indonesia 70 · Filipinas 66 · Vietnam 49',
  texts: ['Indonesia: puesto 71', 'Filipinas: puesto 75', 'Vietnam: puesto 89'], ribbon: ['¡70, 66 Y 49!', 'destinos sin visado'], bubble: ['hero', '¡Todo rojo aquí!'], moods: ['worried', 'worried', 'cry'] });
pair(['TH', 'MY'], 'Tailandia y Malasia', { cam: geoBox(97, 0.5, 120, 21), pad: 0, extra: '¡Malasia empata con Reino Unido!', bubble: ['MY', '¡Yo, en verde!'], moods: ['worried', 'proud'] });
pair(['AU', 'NZ'], 'Australia y Nueva Zelanda', { cam: geoBox(112, -47, 179, -10), pad: 0, bubble: ['AU', '¡Empatados, mate!'], moods: ['cool', 'cool'] });
rest(9, 'MÁS DE ASIA', ['KZ', 'UZ', 'MN', 'BD', 'LK', 'NP', 'KP'], geoBox(48, 5, 132, 55), '¡Corea del Norte, solo 35!');
reg('Asia y Oceanía');

// =================== 6) LOS 5 MÁS DÉBILES ===================
{ const t = section(7, C.no, '¡LOS 5 MÁS DÉBILES!', 'los pasaportes con menos destinos', '¿Quién es el último?'); void t; }
const s6 = T;
one('YE', { len: 8, pad: 0.3, tag: 'PEOR N.º 5', pills: ['30 · 5.º peor'], ribbon: ['¡SOLO 30!', 'destinos sin visado'], bubble: ['YE', '¡Solo 30!'], moods: ['cry'] });
one('PK', { len: 8, pad: 0.2, tag: 'PEOR N.º 4', pills: ['29 · 4.º peor'], ribbon: ['¡SOLO 29!', 'destinos sin visado'], bubble: ['PK', '¡Y somos 250 millones!'], moods: ['cry'] });
one('IQ', { len: 8, pad: 0.3, tag: 'PEOR N.º 3', pills: ['28 · 3.º peor'], ribbon: ['¡SOLO 28!', 'destinos sin visado'], bubble: ['IQ', '¡Solo 28!'], moods: ['cry'] });
one('SY', { len: 8, pad: 0.5, tag: 'PEOR N.º 2', pills: ['25 · 2.º peor'], ribbon: ['¡SOLO 25!', 'destinos sin visado'], bubble: ['SY', '¡Casi el último!'], moods: ['cry'] });
{ const r = one('AF', { len: 9, pad: 0.3, tag: 'EL ÚLTIMO DEL MUNDO', pills: ['22 · el peor'], extra: '¡171 menos que Singapur!', ribbon: ['¡SOLO 22!', 'el pasaporte más débil'], bubble: ['AF', '¿El último…?'], moods: ['cry'] });
  v.shake(r.tc + 0.05, 12); v.s2(r.tc + 0.1, 'boom', 0.3); }
v.region(s6, T, 'Los más débiles');

// =================== 7) EL TOP 5 ===================
{ const t = section(7, C.yes, '¡EL TOP 5!', 'los pasaportes más poderosos', '¿Quién es el n.º 1?');
  v.subscribe(t + 3.7, t + 6.9, true); }
const s7 = T;
one('SE', { len: 9, pad: 0.15, tag: 'N.º 3 DEL MUNDO', pills: ['#3 · 187'], extra: '¡El mejor de Europa!', ribbon: ['#3: ¡187!', 'destinos sin visado'], bubble: ['SE', '¡El mejor de Europa!'], moods: ['proud'] });
pair(['JP', 'KR'], 'Japón y Corea del Sur', { len: 10, cam: geoBox(124, 30, 146, 45), pad: 0, tag: 'N.º 2 DEL MUNDO', pills: ['#2 · 188', '#2 · 188'], ribbon: ['#2: ¡188!', 'empatados'], bubble: ['JP', '¡Empatados!'], moods: ['proud', 'proud'] });
one('AE', { len: 9, cam: geoBox(51, 22, 57, 26.5), pad: 0, tag: 'N.º 2 DEL MUNDO', pills: ['#2 · 188'], extra: '¡En 2014 era el 55.º!', ribbon: ['#2: ¡188!', '¡del 55.º al 2.º!'], bubble: ['AE', '¡Subí 53 puestos!'], moods: ['proud'] });
{ const SG: [number, number] = geo(103.82, 1.35);
  const r = one('SG', { len: 14, at: { SG }, cam: geoBox(101.5, -0.5, 106.5, 3.5), pad: 0, far: true, tag: 'N.º 1 DEL MUNDO', pills: ['#1 · 193'], title: '193 destinos sin visado',
    texts: ['¡El pasaporte más poderoso!', '¡Casi todo el mundo sin visado!'], ribbon: ['#1: ¡193!', '¡el más poderoso!'], bubble: ['SG', '¿Quién será el n.º 1…?'], moods: ['proud'], climax: true });
  v.flash(r.tc, '#4BE07F'); v.shake(r.tc + 0.05, 18); v.fx(r.tc + 0.1, 'confetti'); v.s2(r.tc + 0.3, 'crowd_roar', 0.3);
  v.bubble(r.tc + 4.6, r.e - 0.3, 'hero', '¡Y mide menos que Mallorca!', { side: 'right' });
  v.heroMood(r.tc + 0.2, 'happy'); }
v.region(s7, T, 'Top 5');

// =================== RESULTADO FINAL ===================
{ const t = blk(16);
  v.region(t, t + 16, 'Resultado final');
  v.cam(t - 0.3, WORLD, { dur: 1.8, ...FR, pad: 0 });
  const order: Cat[] = ['top', 'good', 'mid', 'low'];
  v.results(t + 0.6, t + 15.6, 'DESTINOS SIN VISADO', order.map((c) => ({ label: CAT[c].range.toUpperCase(), color: CAT[c].color, ids: seen[c].slice(0, 24), count: seen[c].length })), 'Henley · oct. 2026');
  v.s2(t + 1.2, 'crowd_roar', 0.2);
  v.heroMood(t + 1.0, 'wow');
  v.bubble(t + 3.0, t + 8.5, 'hero', '¡De 22 a 193 destinos!', { side: 'right' });
  v.bubble(t + 9.0, t + 15.4, 'hero', '¿Y tu país? ¿Te lo esperabas?', { side: 'right' }); }

// =================== CIERRE ===================
{ const t = blk(DUR - T);
  v.outro(t, DUR - 0.4, '¿Cuántos tiene tu pasaporte? ¡Comenta!');
  v.heroMood(t + 0.2, 'happy');
  v.bubble(t + 1.5, DUR - 0.8, 'hero', '¡Suscríbete para más mapas!', { side: 'right' }); }
if (Math.abs(DUR - T) > 0.01) console.warn('pasaportes: cursor final', T, '≠ DUR', DUR);

// ---------- HUD ----------
v.versusBar({ t0: 7.2, t1: DUR, left: 'MÁS DE 150', right: 'MENOS DE 150', lc: C.yes, rc: C.no, steps: vs.map((x) => ({ ...x, t: Math.max(x.t, 7.2) })) });
v.led({ t0: 7.2, t1: DUR, cells: [
  { label: '180+', color: '#4BE07F', steps: led.top },
  { label: '150-179', color: '#B78CFF', steps: led.good },
  { label: '100-149', color: '#FF9F43', steps: led.mid },
  { label: '-100', color: '#FF5A4E', steps: led.low },
] });
v.list(10.6, DUR, rows.sort((a, b) => a.t - b.t), 6);

export const pasaportes = v.end(DUR, 'Henley Passport Index (oct. 2026) · destinos sin visado previo');
export const PAS_T_END = T;

// ---------- 5 miniaturas ----------
export const pasaportesThumbs: ThumbV[] = [
  { layout: 'hero', top: 'LOS PASAPORTES', bottom: '*MÁS PODEROSOS*', accent: '#4BE07F', bg: { kind: 'map', view: geoBox(60, -15, 150, 45), flags: ['SG', 'JP', 'KR', 'AE', 'CN', 'IN', 'MY', 'TH'], faces: ['SG', 'JP', 'KR'] }, hero: { kind: 'object', name: 'passport', mood: 'proud', glow: '#FFD23F' }, x: 640, y: 372, size: 470, rays: true },
  { layout: 'versus', top: '¿QUÉ PASAPORTE *GANA*?', accent: '#FFD23F', left: { hero: { kind: 'country', id: 'SG', mood: 'proud', glow: '#4BE07F', face: 0.6 }, bg: { kind: 'sea' }, label: '193 PAÍSES', labelColor: '#4BE07F' }, right: { hero: { kind: 'country', id: 'AF', mood: 'cry', glow: '#FF3B30' }, bg: { kind: 'dark' }, label: 'SOLO 22', labelColor: '#FF4B3E' }, size: 480 },
  { layout: 'number', top: '¡SIN VISADO A', big: '193', bigColor: '#4BE07F', accent: '#4BE07F', bottom: '*PAÍSES!*', bg: { kind: 'dark' }, hero: { kind: 'object', name: 'passport', mood: 'wow', glow: '#4BE07F' }, size: 420 },
  { layout: 'hero', top: 'EL PASAPORTE', bottom: '*MÁS DÉBIL*', accent: '#FF4B3E', bg: { kind: 'fire' }, hero: { kind: 'object', name: 'passport', mood: 'terror', glow: '#FF3B30' }, x: 640, y: 370, size: 500, rays: true },
  { layout: 'grid', top: '¿CUÁNTO VALE', bottom: '*TU PASAPORTE?*', accent: '#FFD23F', bg: { kind: 'sea' }, grid: { ids: ['SG', 'ES', 'US', 'MX', 'AR', 'AF'], moods: ['proud', 'happy', 'shocked', 'wow', 'happy', 'cry'] } },
];
