// "Los países MÁS ENDEUDADOS del mundo" — formato GIRA POR PAÍSES (plantilla iphone.ts).
// Dato: deuda pública bruta en % del PIB (FMI, WEO oct. 2026, año 2025). Total en USD y por habitante: cálculo propio con PIB y población del mismo WEO.
// GANCHO NUEVO (distinto de iphone): arranque en seco con 2 cifras impactantes (EE. UU. 38 billones $, Grecia 147 %) y después la pregunta.
// Investigación y fuentes: research/deuda.md.
import { Video, type Mood } from '../engine/builder';
import type { ThumbV } from '../engine/Thumb';
import { C } from '../engine/theme';
import { geo, geoBox, nameOf } from '../engine/world';

const v = new Video('deuda', '¿Qué países DEBEN más DINERO?').setFps(60);
const FR = { left: 0.27, right: 0.2, bottom: 0.21, top: 0.11 };
const DUR = 573;
export const DEUDA_MUSIC = ['cool_vibes', 'bossa_antigua', 'local_forecast', 'wallpaper']; // temas aprobados por el usuario (nov. 2026)
v.soundtrack(DUR, DEUDA_MUSIC, 0.3);
const WORLD = geoBox(-150, -45, 160, 72);

// ---------- datos: % PIB · total (miles de millones USD) · USD por habitante ----------
const D: Record<string, [number, number, number]> = {
  JP: [204.8, 9120, 73971], SD: [204.4, 74.6, 1480], SG: [165.7, 1001, 164656], LY: [153.8, 68.8, 9224], GR: [146.6, 411.2, 39643], BH: [144.3, 70.7, 44079],
  LB: [139.4, 48.1, 8221], IT: [137.1, 3496, 59324], MV: [129.4, 10.0, 24429], SN: [127.7, 47.3, 2469], US: [124.4, 38392, 112292], FR: [115.5, 3907, 56743],
  CA: [113.6, 2637, 63383], BE: [107.9, 782.3, 65837], UA: [107.1, 229.4, 6982], GB: [102.1, 4097, 58953], ZM: [100.6, 28.9, 1318], ES: [100.5, 1918, 38788],
  CN: [98.6, 19351, 13774], LK: [96.8, 105.4, 4844], BB: [96.2, 7.6, 26172], SR: [96.9, 4.6, 6988], BR: [93.3, 2127, 9967], MZ: [90.3, 21.3, 595],
  PT: [89.7, 310.7, 28762], FI: [88.4, 281.3, 50172], SV: [87.6, 32.2, 5038], EG: [86.8, 316.5, 2933], IN: [84.3, 3295, 2251], BO: [83.3, 54.3, 4319],
  AT: [81.4, 472.2, 51427], AR: [80.1, 547.6, 11534], ZA: [78.4, 334.9, 5307], HU: [74.6, 184.4, 19284], PK: [72.8, 297.1, 1236], KE: [71.3, 96.9, 1816],
  MY: [70.5, 333.3, 9845], IL: [67.9, 418.6, 41352], MA: [66.6, 122.5, 3249], JM: [66.0, 14.9, 5415], UY: [65.6, 56.1, 16104], TH: [64.7, 373.3, 5213],
  DE: [62.7, 3208, 38407], MX: [61.7, 1132, 8489], CR: [60.4, 62.2, 11574], RO: [60.4, 259.3, 13616], CO: [59.9, 273.8, 5161], PL: [59.7, 621.2, 17021],
  PH: [59.1, 287.9, 2528], DO: [59.0, 75.5, 6932], PA: [56.6, 51.2, 11214], NZ: [54.7, 142.0, 26667], NO: [54.0, 286.3, 50958], KR: [52.4, 986.0, 19078],
  DZ: [52.1, 148.2, 3124], AU: [51.9, 955.4, 34451], IQ: [52.8, 139.5, 3064], GH: [48.8, 56.0, 1596], NL: [44.7, 590.9, 32749], CZ: [44.2, 173.2, 16039],
  ET: [43.3, 54.7, 495], QA: [42.5, 91.6, 28854], BD: [42.0, 192.3, 1107], CL: [41.5, 148.3, 7402], ID: [40.9, 591.3, 2077], HN: [40.3, 16.0, 1450],
  CH: [40.1, 425.3, 46994], PY: [38.2, 18.8, 2933], NG: [36.1, 104.9, 441], IR: [35.6, 132.1, 1518], IE: [34.8, 236.8, 43080], OM: [34.7, 38.0, 7155],
  SE: [34.5, 233.4, 21863], NI: [34.6, 7.7, 1155], AE: [33.9, 208.3, 18357], SA: [31.8, 405.0, 11248], VN: [30.5, 150.7, 1473], PE: [30.1, 102.9, 2991],
  DK: [27.4, 129.0, 21532], GT: [26.7, 32.9, 1762], EE: [24.0, 11.3, 8315], TR: [23.7, 379.9, 4426], RU: [16.6, 427.0, 2965], KW: [14.6, 23.0, 4610],
  BS: [71.7, 12.3, 29894], EC: [54.5, 71.0, 3923], JO: [83.6, 51.6, 4321],
};
const es = (x: number, d = 1) => x.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const pct = (id: string) => `${es(D[id][0])} %`;
const tot = (id: string) => { const b = D[id][1]; return b >= 1000 ? `${es(b / 1000)} billones $` : `${Math.round(b * 1000).toLocaleString('de-DE')} millones $`; };
const pc = (id: string) => `${Math.round(D[id][2]).toLocaleString('de-DE')} $`;
/** Textos por defecto de la tarjeta: deuda total y por habitante (+ curiosidad opcional). */
const tx = (id: string, extra?: string) => [`Deuda total: ${tot(id)}`, `Por habitante: ${pc(id)}`, ...(extra ? [extra] : [])];

// ---------- categorías ----------
type Cat = 'top' | 'good' | 'mid' | 'low';
const CAT: Record<Cat, { color: string; label: string; range: string; mood: Mood; hero: Mood }> = {
  top: { color: C.yes, label: '-40 % PIB', range: 'Menos del 40 %', mood: 'cool', hero: 'happy' },
  good: { color: C.purple, label: '40-80 % PIB', range: 'Del 40 al 80 %', mood: 'happy', hero: 'happy' },
  mid: { color: C.orange, label: '80-120 % PIB', range: 'Del 80 al 120 %', mood: 'worried', hero: 'worried' },
  low: { color: C.no, label: '+120 % PIB', range: 'Más del 120 %', mood: 'cry', hero: 'shocked' },
};
const catOf = (p: number): Cat => (p < 40 ? 'top' : p < 80 ? 'good' : p < 120 ? 'mid' : 'low');
const cid = (id: string) => catOf(D[id][0]);

// ---------- marcadores ----------
const n: Record<Cat, number> = { top: 0, good: 0, mid: 0, low: 0 };
const led: Record<Cat, { t: number; v: number }[]> = { top: [{ t: 0, v: 0 }], good: [{ t: 0, v: 0 }], mid: [{ t: 0, v: 0 }], low: [{ t: 0, v: 0 }] };
const vs: { t: number; l: number; r: number }[] = [{ t: 0, l: 0, r: 0 }];
const rows: { t: number; flag: string; name: string; pill: string; color: string }[] = [];
const seen: Record<Cat, string[]> = { top: [], good: [], mid: [], low: [] };
const count = (t: number, cat: Cat, k: number) => {
  n[cat] += k; led[cat].push({ t, v: n[cat] });
  vs.push({ t, l: n.mid + n.low, r: n.top + n.good });
};

let T = 0;
const blk = (len: number) => { const a = T; T += len; return a; };

// ---------- una parada (1-3 países); la categoría sale de D ----------
type Stop = {
  len?: number; ids: string[]; at?: Record<string, [number, number]>; cam?: string[] | [number, number, number, number]; pad?: number;
  name: string; tag: string; title: string; texts: string[]; pills?: string[];
  ribbon: [string, string]; bubble?: [string, string]; moods?: Mood[]; climax?: boolean;
};
const stop = (o: Stop) => {
  const len = o.len ?? 10, t = blk(len), e = t + len, tc = o.climax ? t + 6.5 : e - 3.2;
  const cats = o.ids.map(cid), k = CAT[cats[cats.length - 1]];
  const far = o.tag.startsWith('#');
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
    rows.push({ t: tc + 0.15 + i * 0.25, flag: id, name: nameOf(id), pill: o.pills?.[i] ?? pct(id), color: kc.color });
    count(tc, cats[i], 1); seen[cats[i]].push(id);
  });
  v.info(t + 0.6, e - 0.2, { flag: o.ids[0], name: o.name, tag: o.tag, chip: k.label, chipColor: k.color, chipAt: tc, hideTitle: true, label: 'DEUDA PÚBLICA', labelColor: k.color, title: o.title, texts: o.texts });
  v.heroMood(t + 0.9, 'wow');
  if (o.bubble) {
    const hero = o.bubble[0] === 'hero';
    v.bubble(t + 2.6, tc - 0.15, hero ? 'hero' : o.bubble[0], o.bubble[1], { side: hero ? 'right' : 'left', at: hero ? undefined : o.at?.[o.bubble[0]] });
  }
  v.suspense(tc, o.climax ? 0.95 : 0.8); // redoble + pandereta que acaba justo en el veredicto
  v.ribbon(tc, o.climax ? tc + 4.5 : e - 0.4, o.ribbon[0], k.color, o.ribbon[1], '$');
  v.heroMood(tc + 0.1, k.hero);
  return { t, e, tc };
};
const one = (id: string, o: Partial<Stop> & { tag: string; extra?: string; bubble?: [string, string] }) =>
  stop({ ids: [id], name: nameOf(id), title: `${pct(id)} de su PIB`, texts: tx(id, o.extra), ribbon: [`¡${pct(id)}!`, 'de su PIB en deuda'], ...o });

// ---------- grupo pequeño de países sueltos de una región ----------
const rest = (len: number, title: string, ids: string[], box: [number, number, number, number], bubble: string) => {
  const t = blk(len), e = t + len;
  v.cam(t - 0.35, box, { dur: 1.6, ...FR, pad: 0.02 });
  ids.forEach((id, i) => { const c = cid(id); v.fill(t + 0.6 + i * 0.2, [id], CAT[c].color, 0.3); seen[c].push(id); });
  v.crowd(t + 0.9, DUR, ids, 'dots', 0.5, 0.03);
  v.group(t + 0.5, e - 0.2, title, ids.map((id) => ({ flag: id, name: `${nameOf(id)} · ${pct(id)}`, color: CAT[cid(id)].color })));
  v.s2(t + 0.6, 'whoosh', 0.35);
  v.heroMood(t + 0.8, 'wow');
  v.bubble(t + 1.4, e - 0.4, 'hero', bubble, { side: 'right' });
  ids.forEach((id, i) => rows.push({ t: t + 1.2 + i * 0.25, flag: id, name: nameOf(id), pill: pct(id), color: CAT[cid(id)].color }));
  (['top', 'good', 'mid', 'low'] as Cat[]).forEach((c) => { const k = ids.filter((id) => cid(id) === c).length; if (k) count(t + 1.2, c, k); });
};

// ---------- transición de bloque ----------
const section = (len: number, color: string, text: string, sub: string, bubble?: string) => {
  const t = blk(len);
  v.cam(t - 0.3, WORLD, { dur: 1.7, ...FR, pad: 0 });
  v.ribbon(t + 0.4, t + 3.6, text, color, sub, '★');
  v.s2(t + 0.2, 'riser', 0.4);
  v.heroMood(t + 0.5, 'shocked');
  if (bubble) v.bubble(t + 0.6, t + 3.6, 'hero', bubble, { side: 'right' });
  return t;
};

// =================== GANCHO "EN SECO" (0–7 s): dos cifras de golpe y luego la pregunta ===================
v.hero(0.1, DUR, 'bill', { obj: 'bill', x: 240, y: 320, size: 330, label: 'DEUDA', mood: 'shocked' });
v.cam(0, ['US'], { dur: 0, ...FR, pad: 0.1 });
v.cam(0.01, ['US'], { dur: 1.9, ...FR, pad: 0.04 });
v.fill(0.05, ['US'], C.no, 0.25);
v.face(0.15, 2.0, 'US', 'shocked', { scale: 1.1 });
v.big(0.2, 1.85, '38 BILLONES $', 'lo que debe Estados Unidos', C.no);
v.s2(0.2, 'boom', 0.35); v.shake(0.22, 12);
v.cam(1.75, ['GR'], { dur: 1.15, ...FR, pad: 0.5 });
v.fill(2.0, ['GR'], C.no, 0.25);
v.face(2.1, 3.75, 'GR', 'cry', { scale: 1.0 });
v.big(2.2, 3.7, '147 %', 'de su PIB: lo que debe Grecia', C.no);
v.s2(2.2, 'boom', 0.3); v.shake(2.22, 10);
v.heroMood(2.2, 'terror');
v.cam(3.7, WORLD, { dur: 1.4, left: 0, right: 0, bottom: 0, top: 0, pad: 0 });
v.fill(3.75, ['US', 'GR'], C.land, 0.4);
v.title2(3.8, 6.9, ['¿Qué países', '*DEBEN* más', '*DINERO*?'], [C.gold, C.no, C.no], [
  { text: 'Deuda pública · FMI', color: C.teal }, { text: 'país por país', color: C.purple },
]);
v.heroMood(3.9, 'wow');
v.bubble(4.4, 6.8, 'hero', '¿Y quién es el n.º 1…?', { side: 'right' });
v.s2(6.5, 'riser', 0.35);
T = 7.0;

// =================== LEYENDA EXPRESS (7–10,6 s) ===================
{ const t = blk(3.6);
  v.legend(t + 0.1, t + 3.5, 'DEUDA PÚBLICA (% DEL PIB)', [
    { color: C.yes, label: '-40 %', desc: 'Menos del 40 %' },
    { color: C.purple, label: '40-80 %', desc: 'Del 40 al 80 %' },
    { color: C.orange, label: '80-120 %', desc: 'Del 80 al 120 %' },
    { color: C.no, label: '+120 %', desc: 'Más del 120 %' },
  ]);
  v.bubble(t + 0.4, t + 3.4, 'hero', 'Deuda ÷ todo lo que produce', { side: 'right' });
  v.heroMood(t + 0.3, 'happy'); }

// =================== 1) AMÉRICA ===================
let s = T;
const reg = (name: string) => { v.region(s, T, name); s = T; };
one('MX', { pad: 0.15, tag: 'FMI 2025', bubble: ['MX', '¿Cuánto debo yo?'] });
one('CA', { pad: 0.08, tag: 'FMI 2025', extra: 'Más que la media mundial (94 %)', bubble: ['CA', '¡Sorry, debo bastante!'], moods: ['shocked'] });
one('BR', { pad: 0.15, tag: 'FMI 2025', extra: 'La mayor deuda de Latinoamérica', bubble: ['BR', '¡Eu devo muito!'] });
one('AR', { len: 11, pad: 0.2, tag: 'FMI 2025', extra: '¡El mayor deudor del FMI!', bubble: ['AR', '¡Che, justo en el 80!'], moods: ['worried'] });
one('CO', { pad: 0.2, tag: 'FMI 2025', bubble: ['CO', '¡Morado, parcero!'] });
one('CL', { pad: 0.15, tag: 'FMI 2025', bubble: ['CL', '¡Casi verde!'], moods: ['proud'] });
one('PE', { pad: 0.2, tag: 'FMI 2025', extra: 'De las más bajas de Sudamérica', bubble: ['PE', '¡Yo debo poquito!'], moods: ['cool'] });
stop({ len: 11, ids: ['SV', 'GT'], cam: geoBox(-93, 12.5, -87.5, 18.2), pad: 0, name: 'El Salvador y Guatemala', tag: 'FMI 2025', title: 'El Salvador: 87,6 % · Guatemala: 26,7 %',
  texts: [`El Salvador: ${tot('SV')}`, `Guatemala: ${tot('GT')}`, '¡Vecinos y opuestos!'], ribbon: ['¡87,6 % Y 26,7 %!', 'de su PIB en deuda'], bubble: ['GT', '¡Yo, de las más bajas!'], moods: ['worried', 'cool'] });
rest(9, 'CENTROAMÉRICA', ['CR', 'PA', 'HN', 'NI'], geoBox(-90, 6.5, -76.5, 16.5), '¡Toda morada o verde!');
v.subscribe(T - 8.5, T - 2.5);
rest(9, 'MÁS DE SUDAMÉRICA', ['EC', 'BO', 'UY', 'PY'], geoBox(-82, -36, -52, 3), '¡Bolivia, en naranja!');
rest(9, 'EL CARIBE', ['DO', 'JM', 'BS', 'SR', 'BB'], geoBox(-80, 2, -55, 27.5), '¡Barbados y Surinam, casi 97 %!');
reg('América');

// =================== 2) EUROPA ===================
one('ES', { len: 11, pad: 0.2, tag: 'FMI 2025', extra: '¡Más de 100 % del PIB!', bubble: ['ES', '¿Debo más de lo que gano?'], moods: ['worried'] });
one('PT', { pad: 0.4, tag: 'FMI 2025', bubble: ['PT', '¡Algo menos que España!'] });
one('FR', { pad: 0.2, tag: 'FMI 2025', extra: 'Casi 4 billones de dólares', bubble: ['FR', '¡Oh là là, naranja!'] });
one('GB', { pad: 0.2, tag: 'FMI 2025', extra: 'La mayor deuda de Europa en dinero', bubble: ['GB', '¡4 billones, oh dear!'] });
one('DE', { pad: 0.25, tag: 'FMI 2025', extra: 'Su Constitución frena la deuda', bubble: ['DE', '¡Yo controlo mis gastos!'], moods: ['proud'] });
one('BE', { pad: 0.5, tag: 'FMI 2025', extra: 'Casi 66.000 $ por habitante', bubble: ['BE', '¡Pequeño pero endeudado!'] });
one('UA', { pad: 0.2, tag: 'FMI 2025', extra: 'En 2024 era el 89,7 %: la guerra', bubble: ['hero', '¡La guerra dispara la deuda!'] });
one('RU', { pad: 0.05, tag: 'FMI 2025', extra: 'Muy poca deuda pese a la guerra', bubble: ['RU', '¡Verde, y enorme!'], moods: ['cool'] });
stop({ len: 11, ids: ['PL', 'CZ'], cam: geoBox(12, 47.5, 25, 55.5), pad: 0, name: 'Polonia y Chequia', tag: 'FMI 2025', title: 'Polonia: 59,7 % · Chequia: 44,2 %',
  texts: [`Polonia: ${tot('PL')}`, `Chequia: ${tot('CZ')}`], ribbon: ['¡59,7 % Y 44,2 %!', 'de su PIB en deuda'], bubble: ['CZ', '¡Morados los dos!'] });
stop({ len: 11, ids: ['SE', 'DK'], cam: geoBox(7, 54, 25, 69.5), pad: 0, name: 'Suecia y Dinamarca', tag: 'FMI 2025', title: 'Suecia: 34,5 % · Dinamarca: 27,4 %',
  texts: [`Suecia: ${tot('SE')}`, `Dinamarca: ${tot('DK')}`, '¡Los nórdicos ahorradores!'], ribbon: ['¡34,5 % Y 27,4 %!', 'de su PIB en deuda'], bubble: ['DK', '¡Verde, verde!'], moods: ['cool', 'cool'] });
stop({ len: 11, ids: ['HU', 'RO'], cam: geoBox(16, 43.5, 30, 49), pad: 0, name: 'Hungría y Rumanía', tag: 'FMI 2025', title: 'Hungría: 74,6 % · Rumanía: 60,4 %',
  texts: [`Hungría: ${tot('HU')}`, `Rumanía: ${tot('RO')}`], ribbon: ['¡74,6 % Y 60,4 %!', 'de su PIB en deuda'], bubble: ['HU', '¡Rozando el naranja!'] });
rest(9, 'MÁS PAÍSES DE EUROPA', ['NO', 'FI', 'CH', 'AT', 'NL', 'IE', 'EE'], geoBox(-11, 44, 32, 71), '¡Estonia: la que menos de la UE!');
reg('Europa');
v.subscribe(T - 6.5, T - 0.5);

// =================== 3) ÁFRICA ===================
one('EG', { pad: 0.25, tag: 'FMI 2025', bubble: ['EG', '¡Naranja faraónico!'] });
one('NG', { pad: 0.3, tag: 'FMI 2025', extra: '¡Solo 441 $ por habitante!', bubble: ['NG', '¡Verde! ¿Sorpresa?'], moods: ['cool'] });
one('ZA', { pad: 0.25, tag: 'FMI 2025', bubble: ['ZA', '¡A punto del naranja!'] });
stop({ len: 11, ids: ['ZM', 'MZ'], cam: geoBox(21, -27, 41.5, -8), pad: 0, name: 'Zambia y Mozambique', tag: 'FMI 2025', title: 'Zambia: 100,6 % · Mozambique: 90,3 %',
  texts: [`Zambia: ${tot('ZM')}`, 'Zambia dejó de pagar en 2020', `Mozambique: ${tot('MZ')}`], ribbon: ['¡100,6 % Y 90,3 %!', 'de su PIB en deuda'], bubble: ['ZM', '¡Dejé de pagar en 2020!'], moods: ['cry', 'worried'] });
rest(9, 'MÁS PAÍSES DE ÁFRICA', ['KE', 'ET', 'MA', 'DZ', 'GH'], geoBox(-18, -6, 48, 37), '¡Ghana y Etiopía, en impago!');
reg('África');

// =================== 4) ORIENTE MEDIO ===================
one('TR', { pad: 0.2, tag: 'FMI 2025', extra: 'Mucho menos que Europa', bubble: ['TR', '¡Verde, yo controlo!'], moods: ['cool'] });
one('IL', { pad: 0.7, tag: 'FMI 2025', bubble: ['IL', '¡Morado!'] });
stop({ len: 11, ids: ['SA', 'AE'], cam: geoBox(34, 15, 57, 32.5), pad: 0, name: 'Arabia Saudí y Emiratos', tag: 'FMI 2025', title: 'Arabia S.: 31,8 % · Emiratos: 33,9 %',
  texts: [`Arabia Saudí: ${tot('SA')}`, `Emiratos: ${tot('AE')}`, '¡El petróleo ayuda!'], ribbon: ['¡31,8 % Y 33,9 %!', 'de su PIB en deuda'], bubble: ['SA', '¡Pago con petróleo!'], moods: ['cool', 'cool'] });
stop({ len: 11, ids: ['QA', 'KW'], cam: geoBox(45.5, 24, 53, 30.5), pad: 0, name: 'Catar y Kuwait', tag: 'FMI 2025', title: 'Catar: 42,5 % · Kuwait: 14,6 %',
  texts: [`Catar: ${tot('QA')}`, `Kuwait: ${tot('KW')}`, '¡Kuwait, de los que menos del mundo!'], ribbon: ['¡42,5 % Y 14,6 %!', 'de su PIB en deuda'], bubble: ['KW', '¡Solo un 14,6 %!'], moods: ['happy', 'cool'] });
rest(8, 'MÁS DE ORIENTE MEDIO', ['IQ', 'IR', 'OM', 'JO'], geoBox(34, 15, 64, 40), '¡Jordania, la que más de aquí!');
reg('Oriente Medio');

// =================== 5) ASIA Y OCEANÍA ===================
one('CN', { pad: 0.1, tag: 'FMI 2025', extra: '¡La 2.ª mayor deuda en dinero!', bubble: ['CN', '¡19 billones de dólares!'] });
one('IN', { pad: 0.15, tag: 'FMI 2025', bubble: ['IN', '¡Más de 3 billones!'] });
stop({ len: 11, ids: ['PK', 'BD'], cam: geoBox(60, 20, 93, 37.5), pad: 0, name: 'Pakistán y Bangladés', tag: 'FMI 2025', title: 'Pakistán: 72,8 % · Bangladés: 42 %',
  texts: [`Pakistán: ${tot('PK')}`, `Bangladés: ${tot('BD')}`], ribbon: ['¡72,8 % Y 42 %!', 'de su PIB en deuda'], bubble: ['BD', '¡Morados los dos!'] });
one('LK', { pad: 0.6, tag: 'FMI 2025', extra: 'Dejó de pagar su deuda en 2022', bubble: ['LK', '¡Yo ya quebré en 2022!'], moods: ['cry'] });
one('KR', { pad: 0.3, tag: 'FMI 2025', bubble: ['KR', '¡Morado y tranquilo!'] });
stop({ len: 12, ids: ['ID', 'PH', 'VN'], cam: geoBox(95, -11, 127, 23), pad: 0, name: 'Indonesia, Filipinas y Vietnam', tag: 'FMI 2025', title: '40,9 % · 59,1 % · 30,5 %',
  texts: [`Indonesia: ${tot('ID')}`, `Filipinas: ${tot('PH')}`, `Vietnam: ${tot('VN')}`], ribbon: ['¡ENTRE 30 Y 59 %!', 'de su PIB en deuda'], bubble: ['hero', '¡Nada de rojo aquí!'], moods: ['happy', 'happy', 'cool'] });
stop({ len: 11, ids: ['TH', 'MY'], cam: geoBox(97, 0.5, 120, 21), pad: 0, name: 'Tailandia y Malasia', tag: 'FMI 2025', title: 'Tailandia: 64,7 % · Malasia: 70,5 %',
  texts: [`Tailandia: ${tot('TH')}`, `Malasia: ${tot('MY')}`], ribbon: ['¡64,7 % Y 70,5 %!', 'de su PIB en deuda'], bubble: ['TH', '¡Morados!'] });
stop({ len: 11, ids: ['AU', 'NZ'], cam: geoBox(112, -47, 179, -10), pad: 0, name: 'Australia y Nueva Zelanda', tag: 'FMI 2025', title: 'Australia: 51,9 % · N. Zelanda: 54,7 %',
  texts: [`Australia: ${tot('AU')}`, `N. Zelanda: ${tot('NZ')}`], ribbon: ['¡51,9 % Y 54,7 %!', 'de su PIB en deuda'], bubble: ['AU', '¡Casi empatados, mate!'] });
reg('Asia y Oceanía');

// =================== ESPECIAL: EL QUE MÁS DINERO DEBE ===================
{ const r = one('US', { len: 12, pad: 0.08, tag: 'LA MAYOR DEUDA EN DINERO', title: '124,4 % de su PIB', texts: ['Deuda total: ¡38,4 billones $!', 'Por habitante: 112.292 $', '¡Se queda a las puertas del top 10!'],
    ribbon: ['¡38,4 BILLONES $!', 'la mayor deuda del planeta'], bubble: ['US', '¿Yo no estoy en el top 10?'], moods: ['shocked'] });
  v.flash(r.tc, '#FF5A4E'); v.shake(r.tc + 0.05, 14); v.s2(r.tc + 0.1, 'boom', 0.3); }
reg('Estados Unidos');

// =================== 6) TOP 10: LOS MÁS ENDEUDADOS (% PIB) ===================
{ const t = section(8, C.no, '¡EL TOP 10!', 'los más endeudados del mundo', '¿Quién debe más que EE. UU.?');
  v.subscribe(t + 3.9, t + 7.8, true); }
const s6 = T;
const SG: [number, number] = geo(103.82, 1.35), BH: [number, number] = geo(50.55, 26.05), MV: [number, number] = geo(73.4, 3.6);
one('SN', { len: 9, pad: 0.4, tag: '#10 · FMI 2025', pills: ['#10 · 127,7 %'], extra: 'El FMI destapó 7.000 M$ de deuda oculta', ribbon: ['#10: ¡127,7 %!', 'de su PIB en deuda'], bubble: ['SN', '¡Tenía deuda escondida!'], moods: ['shocked'] });
one('MV', { len: 9, at: { MV }, cam: geoBox(70, -1.5, 77, 8.5), pad: 0, tag: '#9 · FMI 2025', pills: ['#9 · 129,4 %'], ribbon: ['#9: ¡129,4 %!', 'de su PIB en deuda'], bubble: ['MV', '¡Paraíso… endeudado!'] });
one('IT', { len: 9, pad: 0.2, tag: '#8 · FMI 2025', pills: ['#8 · 137,1 %'], extra: '¡3,5 billones de dólares!', ribbon: ['#8: ¡137,1 %!', 'de su PIB en deuda'], bubble: ['IT', '¡Mamma mia!'] });
one('LB', { len: 9, cam: geoBox(33, 32.3, 38, 35.2), pad: 0, tag: '#7 · FMI 2025', pills: ['#7 · 139,4 %'], extra: 'Dejó de pagar en 2020', ribbon: ['#7: ¡139,4 %!', 'de su PIB en deuda'], bubble: ['LB', '¡Llevo años sin pagar!'] });
one('BH', { len: 9, at: { BH }, cam: geoBox(48.5, 24.2, 52.5, 27.6), pad: 0, tag: '#6 · FMI 2025', pills: ['#6 · 144,3 %'], extra: 'El más endeudado del Golfo', ribbon: ['#6: ¡144,3 %!', 'de su PIB en deuda'], bubble: ['BH', '¿Y mis vecinos tan ricos?'] });
one('GR', { len: 9, pad: 0.3, tag: '#5 · FMI 2025', pills: ['#5 · 146,6 %'], extra: '3 rescates entre 2010 y 2018', ribbon: ['#5: ¡146,6 %!', 'de su PIB en deuda'], bubble: ['GR', '¡El que más de Europa!'] });
one('LY', { len: 9, pad: 0.15, tag: '#4 · FMI 2025', pills: ['#4 · 153,8 %'], ribbon: ['#4: ¡153,8 %!', 'de su PIB en deuda'], bubble: ['LY', '¿Con tanto petróleo?'] });
one('SG', { len: 9, at: { SG }, cam: geoBox(101.5, -0.5, 106.5, 3.5), pad: 0, tag: '#3 · FMI 2025', pills: ['#3 · 165,7 %'], extra: 'Pero tiene aún más en ahorros', ribbon: ['#3: ¡165,7 %!', 'de su PIB en deuda'], bubble: ['SG', '¡Debo, pero invierto!'], moods: ['cool'] });
one('SD', { len: 9, pad: 0.15, tag: '#2 · FMI 2025', pills: ['#2 · 204,4 %'], extra: 'La guerra hundió su economía', ribbon: ['#2: ¡204,4 %!', 'de su PIB en deuda'], bubble: ['SD', '¡Por la guerra!'], moods: ['cry'] });
{ const r = one('JP', { len: 16, cam: geoBox(128, 30, 146, 45), pad: 0, tag: '#1 · FMI 2025', pills: ['#1 · 204,8 %'], title: '204,8 % de su PIB', texts: ['Deuda total: ¡9,1 billones $!', 'Por habitante: 73.971 $', '¡Debe el doble de todo lo que produce!'],
    ribbon: ['#1: ¡204,8 %!', '¡el doble de su PIB!'], bubble: ['JP', '¿Quién será el número 1…?'], moods: ['terror'], climax: true });
  v.flash(r.tc, '#FF5A4E'); v.shake(r.tc + 0.05, 22); v.fx(r.tc + 0.1, 'confetti'); v.s2(r.tc + 0.1, 'boom', 0.3); v.s2(r.tc + 0.3, 'crowd_roar', 0.3);
  v.bubble(r.tc + 4.8, r.e - 0.3, 'hero', '¡Por solo 0,4 puntos!', { side: 'right' });
  v.heroMood(r.tc + 4.6, 'terror'); }
v.region(s6, T, 'Top 10');

// =================== RESULTADO FINAL (20 s) ===================
{ const t = blk(20);
  v.region(t, t + 20, 'Resultado final');
  v.cam(t - 0.3, WORLD, { dur: 1.8, ...FR, pad: 0 });
  const order: Cat[] = ['low', 'mid', 'good', 'top'];
  v.results(t + 0.6, t + 19.6, 'DEUDA PÚBLICA (% DEL PIB)', order.map((c) => ({ label: CAT[c].range.toUpperCase(), color: CAT[c].color, ids: seen[c].slice(0, 24), count: seen[c].length })), 'FMI · año 2025');
  v.s2(t + 1.2, 'crowd_roar', 0.2);
  v.heroMood(t + 1.0, 'worried');
  v.bubble(t + 3.0, t + 10.0, 'hero', '¡Del 14,6 % al 204,8 %!', { side: 'right' });
  v.heroMood(t + 10.5, 'wow');
  v.bubble(t + 10.6, t + 19.4, 'hero', '¿Y tu país? ¿Te lo esperabas?', { side: 'right' }); }

// =================== CIERRE ===================
{ const t = blk(DUR - T);
  v.outro(t, DUR - 0.4, '¿Cuánto debe tu país? ¡Comenta!');
  v.heroMood(t + 0.2, 'happy');
  v.bubble(t + 1.5, DUR - 0.8, 'hero', '¡Suscríbete para más mapas!', { side: 'right' }); }
if (DUR - T > 0.01 || T - DUR > 0.01) console.warn('deuda: cursor final', T, '≠ DUR', DUR);

// ---------- HUD ----------
v.versusBar({ t0: 7.2, t1: DUR, left: 'MÁS DEL 80 %', right: 'MENOS DEL 80 %', lc: C.orange, rc: C.yes, steps: vs.map((x) => ({ ...x, t: Math.max(x.t, 7.2) })) });
v.led({ t0: 7.2, t1: DUR, cells: [
  { label: '-40 %', color: '#4BE07F', steps: led.top },
  { label: '40-80 %', color: '#B78CFF', steps: led.good },
  { label: '80-120 %', color: '#FF9F43', steps: led.mid },
  { label: '+120 %', color: '#FF5A4E', steps: led.low },
] });
v.list(10.6, DUR, rows.sort((a, b) => a.t - b.t), 6);

export const deuda = v.end(DUR, 'FMI, World Economic Outlook (oct. 2026) · deuda pública bruta, año 2025');
export const DEUDA_T_END = T;

// ---------- 5 miniaturas ----------
const WFLAGS = ['US', 'JP', 'GR', 'IT', 'FR', 'ES', 'GB', 'CA', 'BR', 'AR', 'MX', 'CN'];
export const deudaThumbs: ThumbV[] = [
  { layout: 'hero', top: '¿QUÉ PAÍSES *DEBEN*', bottom: '*MÁS DINERO?*', accent: '#FF4B3E', bg: { kind: 'map', view: geoBox(-20, 30, 40, 62), flags: ['GR', 'IT', 'FR', 'ES', 'GB', 'DE', 'PT', 'BE'], faces: ['GR', 'IT', 'FR', 'ES'] }, hero: { kind: 'object', name: 'bill', mood: 'terror', glow: '#FF3B30' }, x: 640, y: 372, size: 470 },
  { layout: 'versus', top: '¿QUIÉN *DEBE MÁS*?', accent: '#FFD23F', left: { hero: { kind: 'country', id: 'JP', mood: 'terror', glow: '#FF3B30' }, bg: { kind: 'dark' }, label: '205 % DEL PIB', labelColor: '#FF4B3E' }, right: { hero: { kind: 'country', id: 'US', mood: 'shocked', glow: '#FF3B30', face: 0.6 }, bg: { kind: 'sea' }, label: '38 BILLONES $', labelColor: '#FFD23F' }, size: 480 },
  { layout: 'number', top: '¡LA DEUDA DE *JAPÓN*!', big: '205 %', bigColor: '#FF4B3E', accent: '#FF4B3E', bg: { kind: 'dark' }, hero: { kind: 'object', name: 'bill', mood: 'cry', glow: '#FF3B30' }, size: 420 },
  { layout: 'hero', top: 'LOS PAÍSES *MÁS*', bottom: '*ENDEUDADOS*', accent: '#FF4B3E', bg: { kind: 'fire' }, hero: { kind: 'object', name: 'bill', mood: 'evil', glow: '#FF3B30' }, x: 640, y: 370, size: 500, rays: true },
  { layout: 'grid', top: '¿CUÁNTO *DEBE*', bottom: '*TU PAÍS?*', accent: '#FFD23F', bg: { kind: 'sea' }, grid: { ids: ['US', 'JP', 'ES', 'AR', 'MX', 'GR'], moods: ['shocked', 'terror', 'worried', 'worried', 'happy', 'cry'] } },
];
void WFLAGS;
