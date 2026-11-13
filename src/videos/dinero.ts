// "¿Cuánto DINERO tiene una PERSONA MEDIA en cada país?" — formato GIRA POR PAÍSES (plantilla chicle.ts v3.1).
// Dato: RIQUEZA MEDIA POR ADULTO (casa + ahorros + inversiones − deudas), en dólares.
// Fuente: UBS Global Wealth Report 2026 (fin de 2025, 56 mercados); países fuera de la muestra: UBS Global Wealth Databook 2023 (fin de 2022).
// Investigación y fuentes: research/dinero.md. El primer minuto lo aprobó el usuario (11-11-2026): no tocarlo.
import { Video, type Mood } from '../engine/builder';
import type { ThumbV } from '../engine/Thumb';
import { C } from '../engine/theme';
import { CONTINENTS, geo, geoBox, nameOf } from '../engine/world';

const v = new Video('dinero', '¿Cuánto DINERO tiene una PERSONA MEDIA en cada país?').setFps(60);
const FR = { left: 0.27, right: 0.2, bottom: 0.21, top: 0.11 };
const DUR = 510;
v.soundtrack(DUR, ['pixel_peeker_polka', 'life_of_riley', 'carefree', 'wallpaper'], 0.38);
const WORLD = geoBox(-150, -45, 160, 72);

// ---------- datos: riqueza media por adulto (USD) ----------
// 2022 = UBS Global Wealth Databook 2023 (fin de 2022), vía Wikipedia "List of countries by wealth per adult".
const D22: Record<string, number> = {
  AL: 34839, DZ: 12491, AO: 5418, AG: 30634, AR: 13323, AM: 34988, AZ: 21578, BS: 72971, BH: 84313, BD: 9796, BB: 91291, BY: 34835, BZ: 14966, BJ: 2823,
  BO: 14222, BA: 33593, BW: 16567, BN: 39908, BG: 47074, BF: 1713, BI: 947, KH: 6036, CM: 3271, CF: 952, TD: 1297, CN: 75731, KM: 5285, CD: 1662, CG: 1465,
  CR: 55545, HR: 70461, CY: 158321, CZ: 90393, DJ: 3853, DM: 44406, EC: 21650, EG: 20195, SV: 47422, GQ: 30333, ER: 3688, EE: 78777, ET: 4905, FJ: 17998,
  GA: 16217, GM: 2996, GE: 28169, GH: 6423, GD: 64092, GN: 6638, GW: 1791, GY: 18587, HT: 626, HU: 59348, IS: 498290, IN: 16500, ID: 17457, IR: 51147,
  JM: 24547, JO: 38923, KZ: 58205, KE: 14829, KW: 175072, KG: 8542, LA: 6191, LV: 97583, LS: 1531, LR: 5886, LY: 13420, LT: 69541, MG: 2257, MW: 2415,
  MY: 29314, MV: 25187, ML: 2658, MR: 3013, MU: 68846, MD: 20590, MN: 7578, ME: 81900, MA: 13862, MZ: 1353, MM: 7670, NA: 20690, NP: 4672, NI: 16083,
  NE: 1436, NG: 6879, OM: 48951, PK: 5226, PA: 50917, PG: 8606, PY: 14809, PE: 22514, PH: 14486, PL: 52741, RO: 44320, RU: 39514, RW: 5561, WS: 11929,
  ST: 4162, SA: 90975, SN: 5009, RS: 34080, SC: 94620, SL: 749, SK: 62125, SI: 112526, SB: 11660, ZA: 23956, LK: 23991, LC: 42301, VC: 23728, SR: 7885,
  SY: 1911, TJ: 4592, TZ: 4869, TH: 25956, TG: 1520, TO: 55898, TT: 55939, TN: 21087, TR: 17578, UG: 2780, VU: 16347, VE: 33420, VN: 14569, YE: 6492, ZM: 3761,
};
// 2025 = UBS Global Wealth Report 2026 (top 30 + anexo de Latinoamérica)
const D25: Record<string, number> = {
  CH: 910382, US: 696277, LU: 654732, HK: 648267, AU: 616306, SG: 527217, DK: 523344, NZ: 449852, NO: 425391, NL: 415287, BE: 407920, SE: 406406, CA: 399886,
  DE: 346613, FR: 341359, TW: 332533, IE: 314167, IL: 312108, KR: 311260, ES: 306412, GB: 292808, AT: 279989, IT: 279439, JP: 211846, FI: 209135, PT: 195761,
  QA: 188505, MT: 163655, AE: 157612, GR: 143343, UY: 91000, MX: 75000, CL: 66400, BR: 27000, CO: 21500,
};
const wealth = (id: string) => D25[id] ?? D22[id];

// ---------- categorías (riqueza media por adulto) ----------
type Cat = 'low' | 'mid' | 'high' | 'top';
const CAT: Record<Cat, { color: string; label: string; range: string; mood: Mood; hero: Mood }> = {
  low: { color: C.no, label: '-10 MIL $', range: 'Menos de 10.000 $', mood: 'sad', hero: 'cry' },
  mid: { color: C.orange, label: '10-50 MIL $', range: 'De 10.000 a 50.000 $', mood: 'worried', hero: 'worried' },
  high: { color: C.purple, label: '50-250 MIL $', range: 'De 50.000 a 250.000 $', mood: 'happy', hero: 'happy' },
  top: { color: C.yes, label: '+250 MIL $', range: 'Más de 250.000 $', mood: 'cool', hero: 'love' },
};
const catOf = (w: number): Cat => (w < 10000 ? 'low' : w < 50000 ? 'mid' : w < 250000 ? 'high' : 'top');

// ---------- marcadores ----------
const n: Record<Cat, number> = { low: 0, mid: 0, high: 0, top: 0 };
const led: Record<Cat, { t: number; v: number }[]> = { low: [{ t: 0, v: 0 }], mid: [{ t: 0, v: 0 }], high: [{ t: 0, v: 0 }], top: [{ t: 0, v: 0 }] };
const vs: { t: number; l: number; r: number }[] = [{ t: 0, l: 0, r: 0 }];
const rows: { t: number; flag: string; name: string; pill: string; color: string }[] = [];
const seen: Record<Cat, string[]> = { low: [], mid: [], high: [], top: [] };
const count = (t: number, cat: Cat, k: number) => {
  n[cat] += k; led[cat].push({ t, v: n[cat] });
  vs.push({ t, l: n.low + n.mid, r: n.high + n.top });
};

let T = 0;
const blk = (len: number) => { const a = T; T += len; return a; };

// ---------- una parada (1-3 países) ----------
type Stop = {
  len?: number; ids: string[]; cats: Cat[]; at?: Record<string, [number, number]>; cam?: string[] | [number, number, number, number]; pad?: number;
  name: string; tag: string; title: string; texts: string[]; pills: string[];
  ribbon: [string, string]; bubble?: [string, string]; moods?: Mood[]; climax?: boolean;
};
const stop = (o: Stop) => {
  const len = o.len ?? 10, t = blk(len), e = t + len, tc = o.climax ? t + 6.5 : e - 3.2, k = CAT[o.cats[o.cats.length - 1]];
  const far = o.tag.startsWith('#'); // top 10: saltos largos entre continentes, viaje más largo
  v.cam(t - (far ? 0.6 : 0.35), o.cam ?? o.ids, { dur: far ? 2.1 : 1.6, ...FR, pad: o.pad ?? 0.25 });
  o.ids.forEach((id, i) => {
    const d = i * 0.35, kc = CAT[o.cats[i]], at = o.at?.[id];
    v.rope(t + 0.2 + d, e - 0.15, id, '#FFFFFF', at);
    v.flag(t + 0.5 + d, [id], 0.3);
    v.fx(t + 0.55 + d, 'pulse', { id, at, color: '#FFFFFF' });
    v.s2(t + 0.55 + d, 'pop', 0.5);
    v.face(t + 0.6 + d, tc + 0.1, id, 'wow', { scale: o.climax ? 1.3 : 0.9, at });
    v.face(tc + 0.1, e + 0.1, id, o.moods?.[i] ?? kc.mood, { scale: o.climax ? 1.3 : 0.9, at }); // la cara cambia con el veredicto
    v.tag(t + 0.5 + d, e - 0.1, id, nameOf(id).toUpperCase(), at);
    v.fill(e, [id], kc.color, 0.35);
    v.face(e + 0.1, DUR, id, 'dots', { scale: 0.55, at });
    rows.push({ t: tc + 0.15 + i * 0.25, flag: id, name: nameOf(id), pill: o.pills[i], color: kc.color });
    count(tc, o.cats[i], 1); seen[o.cats[i]].push(id);
  });
  v.info(t + 0.6, e - 0.2, { flag: o.ids[0], name: o.name, tag: o.tag, chip: k.label, chipColor: k.color, chipAt: tc, hideTitle: true, label: 'RIQUEZA MEDIA', labelColor: k.color, title: o.title, texts: o.texts });
  v.heroMood(t + 0.9, 'wow');
  if (o.bubble) {
    const hero = o.bubble[0] === 'hero';
    v.bubble(t + 2.6, tc - 0.15, hero ? 'hero' : o.bubble[0], o.bubble[1], { side: hero ? 'right' : 'left', at: hero ? undefined : o.at?.[o.bubble[0]] });
  }
  v.suspense(tc, o.climax ? 0.95 : 0.8); // redoble + pandereta que acaba justo cuando sale la cifra
  v.ribbon(tc, o.climax ? tc + 4.5 : e - 0.4, o.ribbon[0], k.color, o.ribbon[1], '$');
  v.heroMood(tc + 0.1, k.hero);
  return { t, e, tc };
};

// ---------- grupo "el resto" de una región: cada país en el color de su categoría ----------
const FEATURED = new Set<string>();
const rest = (len: number, title: string, conts: string[], show: string[], box: [number, number, number, number], bubble: string) => {
  const t = blk(len), e = t + len;
  const ids = conts.flatMap((c) => CONTINENTS[c]).filter((id) => !FEATURED.has(id) && wealth(id) !== undefined);
  v.cam(t - 0.35, box, { dur: 1.6, ...FR, pad: 0.02 });
  ids.forEach((id, i) => { const c = catOf(wealth(id)); v.fill(t + 0.6 + i * 0.04, [id], CAT[c].color, 0.3); seen[c].push(id); });
  v.crowd(t + 0.9, DUR, ids, 'dots', 0.5, 0.03);
  v.group(t + 0.5, e - 0.2, title, show.map((id) => ({ flag: id, name: `${nameOf(id)} · ${fmtK(wealth(id))}`, color: CAT[catOf(wealth(id))].color })), `+${ids.length} países más`);
  v.s2(t + 0.6, 'whoosh', 0.35);
  v.heroMood(t + 0.8, 'wow');
  v.bubble(t + 1.4, e - 0.4, 'hero', bubble, { side: 'right' });
  rows.push({ t: t + 1.2, flag: show[0], name: title.replace(/^EL RESTO DE /, 'Resto de '), pill: `+${ids.length}`, color: C.ink });
  (['low', 'mid', 'high', 'top'] as Cat[]).forEach((c) => { const k = ids.filter((id) => catOf(wealth(id)) === c).length; if (k) count(t + 1.2, c, k); });
};
const fmtK = (w: number) => (w >= 1000 ? `${Math.round(w / 1000)} mil $` : `${w} $`);

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

// =================== GANCHO (0–6,4 s): directo al grano ===================
v.cam(0, WORLD, { dur: 0, left: 0, right: 0, bottom: 0, top: 0, pad: 0 });
v.cam(0.01, WORLD, { dur: 6, left: 0, right: 0, bottom: 0, top: 0, pad: 0, zoom: 1.05 });
v.hero(0.15, DUR, 'money', { obj: 'money', x: 240, y: 320, size: 330, label: 'DINERO', mood: 'wow' });
v.title2(0.1, 3.4, ['¿Cuánto *DINERO* tiene', 'una *PERSONA MEDIA*', 'en cada *PAÍS*?'], [C.gold, C.yes, C.gold], [
  { text: 'riqueza por adulto', color: C.teal }, { text: 'país por país', color: C.purple },
]);
v.bubble(0.9, 3.3, 'hero', '¿Cuánto tienes tú?', { side: 'right' });
v.ribbon(3.5, 6.3, '¡HASTA 1.000 VECES MÁS!', C.no, 'de un país a otro', '!');
v.shake(3.55, 12); v.s2(3.5, 'boom', 0.3);
v.heroMood(3.6, 'shocked');
v.s2(5.9, 'riser', 0.35);
T = 6.4;

// =================== LEYENDA EXPRESS (6,4–10 s) ===================
{ const t = blk(3.6);
  v.legend(t + 0.1, t + 3.5, 'RIQUEZA MEDIA POR ADULTO', [
    { color: C.yes, label: '+250 MIL $', desc: 'Más de 250.000 $' },
    { color: C.purple, label: '50-250 MIL $', desc: 'De 50.000 a 250.000 $' },
    { color: C.orange, label: '10-50 MIL $', desc: 'De 10.000 a 50.000 $' },
    { color: C.no, label: '-10 MIL $', desc: 'Menos de 10.000 $' },
  ]);
  v.bubble(t + 0.4, t + 3.4, 'hero', 'Casa + ahorros − deudas', { side: 'right' });
  v.heroMood(t + 0.3, 'happy'); }

// =================== 1) LATINOAMÉRICA (10–90 s) ===================
let s = T;
const reg = (name: string) => { v.region(s, T, name); s = T; };
const st = (o: Stop) => { o.ids.forEach((id) => FEATURED.add(id)); return stop(o); };
st({ ids: ['MX'], cats: ['high'], pad: 0.15, name: 'México', tag: 'UBS 2026', title: 'Más de 75.000 $ por adulto', pills: ['75.000 $'],
  texts: ['333.000 millonarios en dólares', 'Pero la mitad tiene menos de 14.500 $'], ribbon: ['¡MÁS DE 75.000 $!', 'por adulto'], bubble: ['MX', '¿Cuánto tendré yo?'], moods: ['proud'] });
st({ ids: ['CO'], cats: ['mid'], pad: 0.2, name: 'Colombia', tag: 'UBS 2026', title: 'Unos 21.500 $ por adulto', pills: ['21.500 $'],
  texts: ['La mitad tiene menos de 4.995 $', 'Media de Latinoamérica: 42.924 $'], ribbon: ['¡21.500 $!', 'por adulto'], bubble: ['CO', '¡A ver, a ver…!'] });
st({ ids: ['BR'], cats: ['mid'], pad: 0.15, name: 'Brasil', tag: 'UBS 2026', title: 'Unos 27.000 $ por adulto', pills: ['27.000 $'],
  texts: ['386.000 millonarios: récord en Latinoamérica', 'Pero la mitad tiene menos de 5.090 $', 'El 4.º más desigual de 56 países'], ribbon: ['¡27.000 $!', 'por adulto'], bubble: ['hero', '¡Muchos ricos… y mucha desigualdad!'] });
st({ ids: ['AR'], cats: ['mid'], pad: 0.2, name: 'Argentina', tag: 'ÚLTIMO DATO DE UBS: 2022', title: 'Unos 13.300 $ por adulto', pills: ['13.300 $'],
  texts: ['La mitad tiene menos de 4.354 $', 'No entra en la muestra de UBS 2026'], ribbon: ['¡13.300 $!', 'por adulto'], bubble: ['AR', '¡Che, qué poquito!'], moods: ['sad'] });
st({ ids: ['CL', 'UY'], cats: ['high', 'high'], cam: geoBox(-76, -56, -52, -17), pad: 0, name: 'Chile y Uruguay', tag: 'UBS 2026', title: 'Chile: 66.400 $ · Uruguay: 91.000 $', pills: ['66.400 $', '91.000 $'],
  texts: ['Uruguay: el más rico de Sudamérica', 'Mediana de Uruguay: 34.800 $'], ribbon: ['¡66.400 $ Y 91.000 $!', 'por adulto'], bubble: ['UY', '¡Somos los más ricos de aquí!'], moods: ['proud', 'cool'] });
v.subscribe(52.5, 58.5);
st({ len: 12, ids: ['PE', 'EC', 'BO'], cats: ['mid', 'mid', 'mid'], cam: geoBox(-82, -23, -57, 2), pad: 0, name: 'Perú, Ecuador y Bolivia', tag: 'DATOS UBS 2022', title: '22.500 $ · 21.700 $ · 14.200 $', pills: ['22.500 $', '21.700 $', '14.200 $'],
  texts: ['Mediana de Perú: 7.555 $', 'Mediana de Ecuador: 7.610 $', 'Mediana de Bolivia: 4.913 $'], ribbon: ['¡ENTRE 14.000 Y 22.500 $!', 'por adulto'], bubble: ['hero', '¡Los Andes, en naranja!'] });
FEATURED.add('US'); // EE. UU. se guarda para el top 10
['CA', 'NL', 'NO', 'NZ', 'DK', 'SG', 'AU', 'HK', 'LU', 'CH'].forEach((id) => FEATURED.add(id));
rest(9, 'EL RESTO DE SUDAMÉRICA', ['samerica'], ['VE', 'PY', 'GY', 'SR'], geoBox(-82, -40, -50, 13), '¡Venezuela, la más alta de aquí!');
rest(9, 'CENTROAMÉRICA Y EL CARIBE', ['namerica'], ['CR', 'PA', 'SV', 'JM', 'BS', 'HT'], geoBox(-95, 5, -58, 28), '¡Haití: solo 626 $! 😢');
reg('Latinoamérica');

// =================== 2) CANADÁ (90–100 s) ===================
FEATURED.delete('CA');
st({ ids: ['CA'], cats: ['top'], pad: 0.08, name: 'Canadá', tag: 'PUESTO 13 · UBS 2026', title: '399.886 $ por adulto', pills: ['399.886 $'],
  texts: ['Mediana: 147.811 $ (7.ª del mundo)', 'El 13.º país más rico del mundo'], ribbon: ['¡399.886 $!', 'por adulto'], bubble: ['hero', '¿Y EE. UU.? ¡Lo dejo para el final!'], moods: ['cool'] });
reg('Norteamérica');

// =================== 3) EUROPA (100–215 s) ===================
st({ len: 11, ids: ['ES'], cats: ['top'], pad: 0.2, name: 'España', tag: 'PUESTO 20 · UBS 2026', title: '306.412 $ por adulto', pills: ['306.412 $'],
  texts: ['Mediana: 111.575 $ (17.ª del mundo)', '1.077.000 millonarios', 'El 20.º país más rico del mundo'], ribbon: ['¡306.412 $!', 'por adulto'], bubble: ['ES', '¡Olé! ¡Por los pelos!'], moods: ['proud'] });
st({ ids: ['PT'], cats: ['high'], pad: 0.4, name: 'Portugal', tag: 'PUESTO 26 · UBS 2026', title: '195.761 $ por adulto', pills: ['195.761 $'],
  texts: ['Mediana: 76.978 $', '181.000 millonarios'], ribbon: ['¡195.761 $!', 'por adulto'], bubble: ['PT', '¡Casi casi verde!'] });
st({ ids: ['FR'], cats: ['top'], pad: 0.2, name: 'Francia', tag: 'PUESTO 15 · UBS 2026', title: '341.359 $ por adulto', pills: ['341.359 $'],
  texts: ['2.388.000 millonarios', 'Mediana: 121.898 $'], ribbon: ['¡341.359 $!', 'por adulto'], bubble: ['FR', '¡Oh là là!'] });
st({ len: 11, ids: ['IT', 'GR'], cats: ['top', 'high'], cam: geoBox(6, 35, 28, 47), pad: 0, name: 'Italia y Grecia', tag: 'UBS 2026', title: 'Italia: 279.439 $ · Grecia: 143.343 $', pills: ['279.439 $', '143.343 $'],
  texts: ['Italia: mediana 131.001 $ (11.ª)', '1.235.000 millonarios en Italia', 'Grecia: 82.000 millonarios'], ribbon: ['¡279.439 $ Y 143.343 $!', 'por adulto'], bubble: ['IT', '¡Mamma mia, qué riqueza!'], moods: ['proud', 'happy'] });
st({ len: 11, ids: ['GB', 'IE'], cats: ['top', 'top'], cam: geoBox(-11, 49.5, 3, 59.5), pad: 0, name: 'Reino Unido e Irlanda', tag: 'UBS 2026', title: 'R. Unido: 292.808 $ · Irlanda: 314.167 $', pills: ['292.808 $', '314.167 $'],
  texts: ['Reino Unido: 2.428.000 millonarios', 'Irlanda: 192.000 millonarios', '¡Irlanda supera al Reino Unido!'], ribbon: ['¡292.808 $ Y 314.167 $!', 'por adulto'], bubble: ['IE', '¡Esta vez gano yo!'], moods: ['cool', 'proud'] });
st({ ids: ['DE'], cats: ['top'], pad: 0.25, name: 'Alemania', tag: 'PUESTO 14 · UBS 2026', title: '346.613 $ por adulto', pills: ['346.613 $'],
  texts: ['2.648.000 millonarios: 4.º del mundo', 'Pero su mediana: solo 53.485 $'], ribbon: ['¡346.613 $!', 'por adulto'], bubble: ['hero', '¡Muchos millonarios, poca mediana!'] });
st({ ids: ['BE'], cats: ['top'], pad: 0.45, name: 'Bélgica', tag: 'PUESTO 11 · UBS 2026', title: '407.920 $ por adulto', pills: ['407.920 $'],
  texts: ['Mediana: 277.166 $ ¡la 2.ª del mundo!', 'Uno de los repartos más iguales'], ribbon: ['¡407.920 $!', 'por adulto'], bubble: ['BE', '¡Aquí casi todos tienen!'], moods: ['proud'] });
st({ len: 11, ids: ['SE', 'FI'], cats: ['top', 'high'], cam: geoBox(8, 54, 33, 70), pad: 0, name: 'Suecia y Finlandia', tag: 'UBS 2026', title: 'Suecia: 406.406 $ · Finlandia: 209.135 $', pills: ['406.406 $', '209.135 $'],
  texts: ['Suecia: 507.000 millonarios', 'Finlandia: mediana 89.695 $'], ribbon: ['¡406.406 $ Y 209.135 $!', 'por adulto'], bubble: ['SE', '¡Vecinos, pero no iguales!'], moods: ['cool', 'happy'] });
st({ ids: ['IS'], cats: ['top'], pad: 0.3, name: 'Islandia', tag: 'DATO UBS 2022', title: '498.290 $ por adulto', pills: ['498.290 $'],
  texts: ['Mediana: 413.193 $ ¡altísima!', 'No entra en la muestra de UBS 2026'], ribbon: ['¡498.290 $!', 'por adulto'], bubble: ['IS', '¡Sorpresa en el Ártico!'], moods: ['cool'] });
st({ len: 11, ids: ['PL', 'RU'], cats: ['high', 'mid'], cam: geoBox(14, 42, 60, 62), pad: 0, name: 'Polonia y Rusia', tag: 'DATOS UBS 2022', title: 'Polonia: 52.741 $ · Rusia: 39.514 $', pills: ['52.741 $', '39.514 $'],
  texts: ['Rusia: Gini 0,82, de los más desiguales', 'Rusia: 447.000 millonarios', 'Polonia: 101.000 millonarios'], ribbon: ['¡52.741 $ Y 39.514 $!', 'por adulto'], bubble: ['RU', '¡Pocos con mucho!'], moods: ['happy', 'worried'] });
rest(10, 'EL RESTO DE EUROPA', ['europe'], ['AT', 'CZ', 'HU', 'RO', 'HR', 'MT'], geoBox(-10, 35, 42, 64), '¡Austria y Malta, en lo alto!');
reg('Europa');
v.subscribe(T - 6.5, T - 0.5);

// =================== 4) ÁFRICA (215–267 s) ===================
st({ len: 11, ids: ['EG', 'MA'], cats: ['mid', 'mid'], cam: geoBox(-14, 20, 37, 37), pad: 0, name: 'Egipto y Marruecos', tag: 'DATOS UBS 2022', title: 'Egipto: 20.195 $ · Marruecos: 13.862 $', pills: ['20.195 $', '13.862 $'],
  texts: ['Mediana de Egipto: 6.656 $', 'Mediana de Marruecos: 3.896 $'], ribbon: ['¡20.195 $ Y 13.862 $!', 'por adulto'], bubble: ['EG', '¡Las pirámides no cuentan!'] });
st({ ids: ['NG'], cats: ['low'], pad: 0.3, name: 'Nigeria', tag: 'DATO UBS 2022', title: '6.879 $ por adulto', pills: ['6.879 $'],
  texts: ['Mediana: 1.507 $', 'El país más poblado de África'], ribbon: ['¡6.879 $!', 'por adulto'], bubble: ['hero', '¡Primer país en rojo!'] });
st({ ids: ['ZA'], cats: ['mid'], pad: 0.25, name: 'Sudáfrica', tag: 'DATO UBS 2022', title: '23.956 $ por adulto', pills: ['23.956 $'],
  texts: ['Gini 0,81: 3.º más desigual (2026)', '97.000 millonarios (2026)'], ribbon: ['¡23.956 $!', 'por adulto'], bubble: ['ZA', '¡Muy repartido no está!'] });
st({ len: 11, ids: ['ET', 'CD'], cats: ['low', 'low'], cam: geoBox(11, -14, 48, 16), pad: 0, name: 'Etiopía y R. D. Congo', tag: 'DATOS UBS 2022', title: 'Etiopía: 4.905 $ · R. D. Congo: 1.662 $', pills: ['4.905 $', '1.662 $'],
  texts: ['Etiopía: mediana 2.124 $', 'R. D. Congo: mediana 492 $'], ribbon: ['¡4.905 $ Y 1.662 $!', 'por adulto'], bubble: ['hero', '¡Qué diferencia con Europa!'], moods: ['sad', 'cry'] });
rest(10, 'EL RESTO DE ÁFRICA', ['africa'], ['KE', 'DZ', 'GH', 'MU', 'SC', 'BI'], geoBox(-20, -36, 52, 38), '¡Seychelles y Mauricio, arriba!');
reg('África');

// =================== 5) ORIENTE MEDIO (267–299 s) ===================
st({ ids: ['IL'], cats: ['top'], pad: 0.7, name: 'Israel', tag: 'PUESTO 18 · UBS 2026', title: '312.108 $ por adulto', pills: ['312.108 $'],
  texts: ['195.000 millonarios', 'Mediana: 83.843 $'], ribbon: ['¡312.108 $!', 'por adulto'], bubble: ['IL', '¡Pequeño pero rico!'], moods: ['cool'] });
st({ len: 11, ids: ['QA', 'AE'], cats: ['high', 'high'], cam: geoBox(49, 21, 58, 27.5), pad: 0, name: 'Catar y Emiratos', tag: 'UBS 2026', title: 'Catar: 188.505 $ · EAU: 157.612 $', pills: ['188.505 $', '157.612 $'],
  texts: ['Catar: mediana 95.499 $', 'EAU: Gini 0,82, el más desigual de 56'], ribbon: ['¡188.505 $ Y 157.612 $!', 'por adulto'], bubble: ['AE', '¿Solo morado? ¡Con tanto petróleo!'] });
st({ len: 11, ids: ['SA', 'TR'], cats: ['high', 'mid'], cam: geoBox(25, 15, 56, 43), pad: 0, name: 'Arabia Saudí y Turquía', tag: 'DATOS UBS 2022', title: 'Arabia S.: 90.975 $ · Turquía: 17.578 $', pills: ['90.975 $', '17.578 $'],
  texts: ['Arabia Saudí: 348.000 millonarios (2026)', 'Turquía: 93.000 millonarios (2026)'], ribbon: ['¡90.975 $ Y 17.578 $!', 'por adulto'], bubble: ['TR', '¡La inflación no ayuda!'], moods: ['proud', 'worried'] });
reg('Oriente Medio');

// =================== 6) ASIA (299–362 s) ===================
st({ ids: ['IN'], cats: ['mid'], pad: 0.15, name: 'India', tag: 'DATO UBS 2022', title: '16.500 $ por adulto', pills: ['16.500 $'],
  texts: ['944.000 millonarios ¡como Suiza! (2026)', 'Pero la mediana: 3.755 $'], ribbon: ['¡16.500 $!', 'por adulto'], bubble: ['IN', '¡Somos muchísimos!'] });
st({ ids: ['CN'], cats: ['high'], pad: 0.1, name: 'China', tag: 'DATO UBS 2022', title: '75.731 $ por adulto', pills: ['75.731 $'],
  texts: ['5.305.000 millonarios: 2.º del mundo (2026)', 'Mediana: 27.273 $'], ribbon: ['¡75.731 $!', 'por adulto'], bubble: ['CN', '¡Y subiendo!'], moods: ['proud'] });
st({ ids: ['JP'], cats: ['high'], cam: geoBox(128, 30, 146, 45), pad: 0, name: 'Japón', tag: 'PUESTO 24 · UBS 2026', title: '211.846 $ por adulto', pills: ['211.846 $'],
  texts: ['Mediana: 135.745 $ (10.ª del mundo)', '2.902.000 millonarios: 3.º del mundo'], ribbon: ['¡211.846 $!', 'por adulto'], bubble: ['JP', '¡Muy bien repartido!'] });
st({ len: 11, ids: ['KR', 'TW'], cats: ['top', 'top'], cam: geoBox(119, 21.5, 131, 39), pad: 0, name: 'Corea del Sur y Taiwán', tag: 'UBS 2026', title: 'Corea: 311.260 $ · Taiwán: 332.533 $', pills: ['311.260 $', '332.533 $'],
  texts: ['Corea del Sur: 1.317.000 millonarios', 'Taiwán: 772.000 millonarios'], ribbon: ['¡311.260 $ Y 332.533 $!', 'por adulto'], bubble: ['TW', '¡Los chips dan dinero!'], moods: ['cool', 'proud'] });
st({ len: 12, ids: ['ID', 'PH', 'VN'], cats: ['mid', 'mid', 'mid'], cam: geoBox(95, -11, 127, 23), pad: 0, name: 'Indonesia, Filipinas y Vietnam', tag: 'DATOS UBS 2022', title: '17.457 $ · 14.486 $ · 14.569 $', pills: ['17.457 $', '14.486 $', '14.569 $'],
  texts: ['Mediana de Indonesia: 4.819 $', 'Mediana de Filipinas: 3.155 $', 'Mediana de Vietnam: 5.309 $'], ribbon: ['¡ENTRE 14.000 Y 17.500 $!', 'por adulto'], bubble: ['hero', '¡Todo el sudeste, en naranja!'] });
rest(10, 'EL RESTO DE ASIA Y OCEANÍA', ['asia', 'oceania'], ['KW', 'KZ', 'TH', 'MY', 'PK', 'FJ'], geoBox(35, -20, 180, 55), '¡Kuwait, el más alto del resto!');
reg('Asia');

// =================== 7) TOP 10 MUNDIAL (362–477 s) ===================
['CA', 'NL', 'NO', 'NZ', 'DK', 'SG', 'AU', 'HK', 'LU', 'CH', 'US'].forEach((id) => FEATURED.delete(id));
{ const t = section(8, C.gold, '¡EL TOP 10 MUNDIAL!', 'UBS 2026', '¡Ahora vienen los más ricos!');
  v.subscribe(t + 3.9, t + 7.8, true); }
const s7 = T;
const SG: [number, number] = geo(103.82, 1.35), HK: [number, number] = geo(114.17, 22.32), LU: [number, number] = geo(6.13, 49.8);
st({ ids: ['NL'], cats: ['top'], pad: 0.5, name: 'Países Bajos', tag: '#10 DEL MUNDO', title: '415.287 $ por adulto', pills: ['#10 · 415.287 $'],
  texts: ['1.294.000 millonarios', 'Mediana: 127.407 $'], ribbon: ['#10: ¡415.287 $!', 'por adulto'], bubble: ['NL', '¡Entro en el top!'], moods: ['proud'] });
st({ ids: ['NO'], cats: ['top'], pad: 0.15, name: 'Noruega', tag: '#9 DEL MUNDO', title: '425.391 $ por adulto', pills: ['#9 · 425.391 $'],
  texts: ['Mediana: 140.003 $ (9.ª del mundo)', 'Sus ingresos por petróleo van a un fondo público'], ribbon: ['#9: ¡425.391 $!', 'por adulto'], bubble: ['NO', '¡Fiordos y dólares!'], moods: ['cool'] });
st({ ids: ['NZ'], cats: ['top'], pad: 0.15, name: 'Nueva Zelanda', tag: '#8 DEL MUNDO', title: '449.852 $ por adulto', pills: ['#8 · 449.852 $'],
  texts: ['Mediana: 206.617 $ (4.ª del mundo)', 'Más que Noruega por adulto'], ribbon: ['#8: ¡449.852 $!', 'por adulto'], bubble: ['NZ', '¡Desde el fin del mundo!'], moods: ['happy'] });
st({ ids: ['DK'], cats: ['top'], pad: 0.6, name: 'Dinamarca', tag: '#7 DEL MUNDO', title: '523.344 $ por adulto', pills: ['#7 · 523.344 $'],
  texts: ['Mediana: 203.771 $ (5.ª del mundo)', '¡Más de medio millón por adulto!'], ribbon: ['#7: ¡523.344 $!', 'por adulto'], bubble: ['DK', '¡Medio millón, ja!'], moods: ['cool'] });
st({ ids: ['SG'], cats: ['top'], at: { SG }, cam: geoBox(101.5, -0.5, 106.5, 3.5), pad: 0, name: 'Singapur', tag: '#6 DEL MUNDO', title: '527.217 $ por adulto', pills: ['#6 · 527.217 $'],
  texts: ['244.000 millonarios', 'Mediana: 96.434 $'], ribbon: ['#6: ¡527.217 $!', 'por adulto'], bubble: ['SG', '¡Pequeñito pero riquísimo!'], moods: ['proud'] });
st({ ids: ['AU'], cats: ['top'], pad: 0.1, name: 'Australia', tag: '#5 DEL MUNDO', title: '616.306 $ por adulto', pills: ['#5 · 616.306 $'],
  texts: ['Mediana: 210.783 $ (3.ª del mundo)', '1.634.000 millonarios'], ribbon: ['#5: ¡616.306 $!', 'por adulto'], bubble: ['AU', '¡Más de 600.000, mate!'], moods: ['cool'] });
st({ ids: ['HK'], cats: ['top'], at: { HK }, cam: geoBox(110.5, 19.5, 118, 25), pad: 0, name: 'Hong Kong', tag: '#4 DEL MUNDO', title: '648.267 $ por adulto', pills: ['#4 · 648.267 $'],
  texts: ['628.000 millonarios', 'Mediana: 187.968 $'], ribbon: ['#4: ¡648.267 $!', 'por adulto'], bubble: ['HK', '¡Rascacielos de dinero!'], moods: ['proud'] });
st({ ids: ['LU'], cats: ['top'], at: { LU }, cam: geoBox(2.5, 47.8, 9.8, 51.7), pad: 0, name: 'Luxemburgo', tag: '#3 DEL MUNDO', title: '654.732 $ por adulto', pills: ['#3 · 654.732 $'],
  texts: ['Mediana: 394.005 $ ¡la 1.ª del mundo!', '85.000 millonarios'], ribbon: ['#3: ¡654.732 $!', 'por adulto'], bubble: ['LU', '¡Y la mediana más alta!'], moods: ['cool'] });
st({ len: 11, ids: ['US'], cats: ['top'], pad: 0.1, name: 'Estados Unidos', tag: '#2 DEL MUNDO', title: '696.277 $ por adulto', pills: ['#2 · 696.277 $'],
  texts: ['23.627.000 millonarios: n.º 1 del mundo', 'Pero su mediana: 68.998 $ (28.ª)'], ribbon: ['#2: ¡696.277 $!', 'por adulto'], bubble: ['US', '¿Solo segundos? ¿Quién nos gana?'], moods: ['shocked'] });
{ const r = st({ len: 16, ids: ['CH'], cats: ['top'], cam: geoBox(4.5, 45, 12, 48.5), pad: 0, name: 'Suiza', tag: '#1 DEL MUNDO', title: '910.382 $ por adulto', pills: ['#1 · 910.382 $'],
    texts: ['Repite como n.º 1 del mundo', 'Mediana: 145.555 $', '944.000 millonarios'], ribbon: ['#1: ¡910.382 $!', '¡casi 1 millón por adulto!'], bubble: ['CH', '¿Quién será el número 1…?'], moods: ['love'], climax: true });
  v.flash(r.tc, '#FFD23F'); v.shake(r.tc + 0.05, 22); v.fx(r.tc + 0.1, 'confetti'); v.s2(r.tc + 0.1, 'boom', 0.3); v.s2(r.tc + 0.3, 'crowd_roar', 0.3);
  v.bubble(r.tc + 4.8, r.e - 0.3, 'hero', '¡Casi 1 MILLÓN por adulto!', { side: 'right' });
  v.heroMood(r.tc + 4.6, 'love'); }
v.region(s7, T, 'Top 10 mundial');

// =================== RESULTADO FINAL (22 s) ===================
{ const t = blk(22);
  v.region(t, t + 22, 'Resultado final');
  v.cam(t - 0.3, WORLD, { dur: 1.8, ...FR, pad: 0 });
  const order: Cat[] = ['top', 'high', 'mid', 'low'];
  v.results(t + 0.6, t + 21.6, 'LA RIQUEZA MEDIA EN EL MUNDO', order.map((c) => ({ label: CAT[c].range.toUpperCase(), color: CAT[c].color, ids: seen[c].slice(0, 24), count: seen[c].length })), 'riqueza media por adulto · UBS');
  v.fx(t + 1.0, 'confetti'); v.s2(t + 1.2, 'crowd_roar', 0.2);
  v.heroMood(t + 1.0, 'happy');
  v.bubble(t + 3.0, t + 11.0, 'hero', '¡De 626 $ a 910.382 $!', { side: 'right' });
  v.heroMood(t + 11.5, 'wow');
  v.bubble(t + 11.6, t + 21.4, 'hero', '¿Y en tu país? ¿Te lo esperabas?', { side: 'right' }); }

// =================== CIERRE ===================
{ const t = blk(DUR - T);
  v.outro(t, DUR - 0.4, '¿Cuánto crees que tiene una persona media en tu país? ¡Comenta!');
  v.heroMood(t + 0.2, 'happy');
  v.bubble(t + 1.5, DUR - 0.8, 'hero', '¡Suscríbete para más mapas!', { side: 'right' }); }
if (T > DUR + 0.01 || DUR - T > 0.01) console.warn('dinero: cursor final', T, '≠ DUR', DUR);

// ---------- HUD ----------
v.versusBar({ t0: 6.6, t1: DUR, left: 'MENOS DE 50 MIL $', right: 'MÁS DE 50 MIL $', lc: C.orange, rc: C.yes, steps: vs.map((x) => ({ ...x, t: Math.max(x.t, 6.6) })) });
v.led({ t0: 6.6, t1: DUR, cells: [
  { label: '+250 MIL $', color: '#4BE07F', steps: led.top },
  { label: '50-250 MIL $', color: '#B78CFF', steps: led.high },
  { label: '10-50 MIL $', color: '#FF9F43', steps: led.mid },
  { label: '-10 MIL $', color: '#FF5A4E', steps: led.low },
] });
v.list(10, DUR, rows.sort((a, b) => a.t - b.t), 6);

export const dinero = v.end(DUR, 'UBS Global Wealth Report 2026 (fin de 2025) · UBS Global Wealth Databook 2023 (países fuera de la muestra, fin de 2022)');

// ---------- 5 miniaturas ----------
const EUFLAGS = ['CH', 'DE', 'FR', 'ES', 'IT', 'GB', 'LU', 'BE', 'NL', 'AT', 'PL', 'PT', 'IE', 'DK', 'NO', 'SE'];
export const dineroThumbs: ThumbV[] = [
  { layout: 'hero', top: '¿CUÁNTO *DINERO* TIENE', bottom: '*UNA PERSONA MEDIA?*', accent: '#35E06F', bg: { kind: 'map', view: geoBox(-12, 36, 30, 60), flags: EUFLAGS, faces: ['DE', 'FR', 'ES', 'IT', 'PL'] }, hero: { kind: 'object', name: 'money', mood: 'shocked', glow: '#FFD23F' }, x: 640, y: 372, size: 470 },
  { layout: 'versus', top: '¡*1.000 VECES* MÁS RICO!', accent: '#FFD23F', left: { hero: { kind: 'country', id: 'CH', mood: 'love', glow: '#FFD23F' }, bg: { kind: 'sea' }, label: '910.382 $', labelColor: '#35E06F' }, right: { hero: { kind: 'country', id: 'HT', mood: 'cry', glow: '#FF3B30', face: 0.55 }, bg: { kind: 'dark' }, label: '626 $', labelColor: '#FF4B3E', scale: 1.15 }, size: 500 },
  { layout: 'number', top: '¡LO QUE TIENE UN *SUIZO*!', big: '910.382$', bigColor: '#35E06F', accent: '#35E06F', bg: { kind: 'map', view: geoBox(-2, 42, 18, 52), flags: EUFLAGS }, hero: { kind: 'country', id: 'CH', mood: 'evil', glow: '#FFD23F' }, size: 440 },
  { layout: 'hero', top: '¿EL PAÍS *MÁS RICO*', bottom: '*DEL MUNDO?*', accent: '#FFD23F', bg: { kind: 'dark' }, hero: { kind: 'country', id: 'CH', silhouette: true, mark: '¿$?', glow: '#FFD23F' }, x: 640, y: 370, size: 520, rays: true },
  { layout: 'grid', top: '¿CUÁNTO *DINERO*', bottom: '*TIENE TU PAÍS?*', accent: '#35E06F', bg: { kind: 'sea' }, grid: { ids: ['MX', 'ES', 'AR', 'US', 'CO', 'CH'], moods: ['shocked', 'evil', 'cry', 'evil', 'terror', 'love'] } },
];
