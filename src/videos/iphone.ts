// "¿Cuántas HORAS tienes que trabajar en cada país para comprarte un iPHONE?" — formato GIRA POR PAÍSES (plantilla dinero.ts).
// Dato: HORAS = precio actual del iPhone 17 de 256 GB (nov. 2026, tras la subida del 9-9-2026) ÷ sueldo medio bruto por hora,
// ambos en moneda local. Sueldos: OIT (ILOSTAT, ganancia media por hora) y, en la UE, Eurostat 2025 (sueldo bruto medio a tiempo completo).
// Investigación y fuentes: research/iphone.md.
import { Video, type Mood } from '../engine/builder';
import type { ThumbV } from '../engine/Thumb';
import { C } from '../engine/theme';
import { geo, geoBox, nameOf } from '../engine/world';

const v = new Video('iphone', '¿Cuántas HORAS tienes que trabajar para comprarte un iPHONE?').setFps(60);
const FR = { left: 0.27, right: 0.2, bottom: 0.21, top: 0.11 };
const DUR = 551;
v.soundtrack(DUR, ['life_of_riley', 'pixel_peeker_polka', 'carefree', 'wallpaper'], 0.38);
const WORLD = geoBox(-150, -45, 160, 72);

// ---------- datos: horas de trabajo para pagar un iPhone 17 (256 GB) ----------
const H: Record<string, number> = {
  CH: 18.7, US: 21.4, LU: 26.8, CA: 32.4, DK: 33.0, NO: 35.6, AT: 36.4, IE: 38.0, NL: 38.3, BE: 39.0, DE: 39.3, GB: 41.5, FI: 43.7, AU: 45, SE: 46.4,
  FR: 52.3, QA: 52, SG: 54, NZ: 55, KR: 58, IT: 58.5, IL: 61, ES: 65.6, EE: 79.4, CZ: 81.6, PL: 82.7, PT: 85.2, RO: 90.2, JP: 90, TW: 93, HU: 94.5, SA: 110,
  MK: 155, CL: 186, CR: 188, CN: 216, UA: 260, MY: 269, AR: 302, DO: 349, KZ: 349, MX: 356, PE: 364, TH: 371, GT: 381, BR: 396, TR: 415, CO: 435, ZA: 451, JO: 478,
  PH: 581, UZ: 595, VN: 646, TN: 1000, IN: 1089, ID: 1206, UG: 1224, KE: 1906, EG: 2355, BD: 2438, NG: 2798, PK: 2866,
};

// ---------- categorías ----------
type Cat = 'top' | 'good' | 'mid' | 'low';
const CAT: Record<Cat, { color: string; label: string; range: string; mood: Mood; hero: Mood }> = {
  top: { color: C.yes, label: '-50 HORAS', range: 'Menos de 50 horas', mood: 'cool', hero: 'love' },
  good: { color: C.purple, label: '50-150 HORAS', range: 'De 50 a 150 horas', mood: 'happy', hero: 'happy' },
  mid: { color: C.orange, label: '150-500 HORAS', range: 'De 150 a 500 horas', mood: 'worried', hero: 'worried' },
  low: { color: C.no, label: '+500 HORAS', range: 'Más de 500 horas', mood: 'cry', hero: 'cry' },
};
const catOf = (h: number): Cat => (h < 50 ? 'top' : h < 150 ? 'good' : h < 500 ? 'mid' : 'low');
const hs = (id: string) => { const h = H[id]; return h < 100 ? `${String(Math.round(h * 10) / 10).replace('.', ',')} h` : `${Math.round(h).toLocaleString('de-DE')} h`; };

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

// ---------- una parada (1-3 países); la categoría sale de H ----------
type Stop = {
  len?: number; ids: string[]; at?: Record<string, [number, number]>; cam?: string[] | [number, number, number, number]; pad?: number;
  name: string; tag: string; title: string; texts: string[]; pills?: string[];
  ribbon: [string, string]; bubble?: [string, string]; moods?: Mood[]; climax?: boolean;
};
const stop = (o: Stop) => {
  const len = o.len ?? 10, t = blk(len), e = t + len, tc = o.climax ? t + 6.5 : e - 3.2;
  const cats = o.ids.map((id) => catOf(H[id])), k = CAT[cats[cats.length - 1]];
  const far = o.tag.startsWith('#'); // top 10: saltos largos entre continentes
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
    rows.push({ t: tc + 0.15 + i * 0.25, flag: id, name: nameOf(id), pill: o.pills?.[i] ?? hs(id), color: kc.color });
    count(tc, cats[i], 1); seen[cats[i]].push(id);
  });
  v.info(t + 0.6, e - 0.2, { flag: o.ids[0], name: o.name, tag: o.tag, chip: k.label, chipColor: k.color, chipAt: tc, hideTitle: true, label: 'HORAS DE TRABAJO', labelColor: k.color, title: o.title, texts: o.texts });
  v.heroMood(t + 0.9, 'wow');
  if (o.bubble) {
    const hero = o.bubble[0] === 'hero';
    v.bubble(t + 2.6, tc - 0.15, hero ? 'hero' : o.bubble[0], o.bubble[1], { side: hero ? 'right' : 'left', at: hero ? undefined : o.at?.[o.bubble[0]] });
  }
  v.suspense(tc, o.climax ? 0.95 : 0.8); // redoble + pandereta que acaba justo cuando salen las horas
  v.ribbon(tc, o.climax ? tc + 4.5 : e - 0.4, o.ribbon[0], k.color, o.ribbon[1], 'h');
  v.heroMood(tc + 0.1, k.hero);
  return { t, e, tc };
};

// ---------- grupo pequeño de países sueltos de una región ----------
const rest = (len: number, title: string, ids: string[], box: [number, number, number, number], bubble: string) => {
  const t = blk(len), e = t + len;
  v.cam(t - 0.35, box, { dur: 1.6, ...FR, pad: 0.02 });
  ids.forEach((id, i) => { const c = catOf(H[id]); v.fill(t + 0.6 + i * 0.2, [id], CAT[c].color, 0.3); seen[c].push(id); });
  v.crowd(t + 0.9, DUR, ids, 'dots', 0.5, 0.03);
  v.group(t + 0.5, e - 0.2, title, ids.map((id) => ({ flag: id, name: `${nameOf(id)} · ${hs(id)}`, color: CAT[catOf(H[id])].color })));
  v.s2(t + 0.6, 'whoosh', 0.35);
  v.heroMood(t + 0.8, 'wow');
  v.bubble(t + 1.4, e - 0.4, 'hero', bubble, { side: 'right' });
  ids.forEach((id, i) => rows.push({ t: t + 1.2 + i * 0.25, flag: id, name: nameOf(id), pill: hs(id), color: CAT[catOf(H[id])].color }));
  (['top', 'good', 'mid', 'low'] as Cat[]).forEach((c) => { const k = ids.filter((id) => catOf(H[id]) === c).length; if (k) count(t + 1.2, c, k); });
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

// =================== GANCHO (0–6,4 s) ===================
v.cam(0, WORLD, { dur: 0, left: 0, right: 0, bottom: 0, top: 0, pad: 0 });
v.cam(0.01, WORLD, { dur: 6, left: 0, right: 0, bottom: 0, top: 0, pad: 0, zoom: 1.05 });
v.hero(0.15, DUR, 'phone', { obj: 'phone', x: 240, y: 320, size: 330, label: 'iPHONE', mood: 'wow' });
v.title2(0.1, 3.4, ['¿Cuántas *HORAS* trabajas', 'para comprarte', 'un *iPHONE*?'], [C.gold, C.gold, C.yes], [
  { text: 'iPhone 17 · 256 GB', color: C.teal }, { text: 'país por país', color: C.purple },
]);
v.bubble(0.9, 3.3, 'hero', '¿Cuánto te cuesto a ti?', { side: 'right' });
v.ribbon(3.5, 6.3, '¡DE 19 HORAS A CASI 2.900!', C.no, 'según el país', '!');
v.shake(3.55, 12); v.s2(3.5, 'boom', 0.3);
v.heroMood(3.6, 'shocked');
v.s2(5.9, 'riser', 0.35);
T = 6.4;

// =================== LEYENDA EXPRESS (6,4–10 s) ===================
{ const t = blk(3.6);
  v.legend(t + 0.1, t + 3.5, 'HORAS DE TRABAJO POR UN iPHONE', [
    { color: C.yes, label: '-50 HORAS', desc: 'Menos de 50 horas' },
    { color: C.purple, label: '50-150 HORAS', desc: 'De 50 a 150 horas' },
    { color: C.orange, label: '150-500 HORAS', desc: 'De 150 a 500 horas' },
    { color: C.no, label: '+500 HORAS', desc: 'Más de 500 horas' },
  ]);
  v.bubble(t + 0.4, t + 3.4, 'hero', 'Precio ÷ sueldo por hora', { side: 'right' });
  v.heroMood(t + 0.3, 'happy'); }

// =================== 1) LATINOAMÉRICA (10–91 s) ===================
let s = T;
const reg = (name: string) => { v.region(s, T, name); s = T; };
stop({ ids: ['MX'], pad: 0.15, name: 'México', tag: 'SUELDO OIT 2025', title: '356 horas de trabajo',
  texts: ['iPhone 17: 21.999 pesos (1.182 $)', 'Sueldo medio: 3,21 $ la hora', '¡44 jornadas de 8 horas!'], ribbon: ['¡356 HORAS!', 'por un iPhone'], bubble: ['MX', '¿Cuántas horas me tocan?'] });
stop({ ids: ['CO'], pad: 0.2, name: 'Colombia', tag: 'SUELDO OIT 2025', title: '435 horas de trabajo',
  texts: ['iPhone 17: 4.699.000 pesos (1.434 $)', 'Sueldo medio: 2,66 $ la hora', '¡54 jornadas de trabajo!'], ribbon: ['¡435 HORAS!', 'por un iPhone'], bubble: ['CO', '¡Ay, no, qué caro!'], moods: ['cry'] });
stop({ ids: ['BR'], pad: 0.15, name: 'Brasil', tag: 'SUELDO OIT 2025', title: '396 horas de trabajo',
  texts: ['iPhone 17: 8.299 reales (1.494 $)', 'Sueldo medio: 3,75 $ la hora', 'La Apple Store más cara de América'], ribbon: ['¡396 HORAS!', 'por un iPhone'], bubble: ['hero', '¡En Brasil cuesto 1.494 $!'] });
stop({ ids: ['AR'], pad: 0.2, name: 'Argentina', tag: 'PRECIO ENE. 2026 · OIT 2025', title: '302 horas de trabajo',
  texts: ['iPhone 17: 1.999.990 pesos (1.294 $)', 'Sueldo medio: 5,35 $ la hora', 'Arancel 0 a los móviles desde 2026'], ribbon: ['¡302 HORAS!', 'por un iPhone'], bubble: ['AR', '¡Che, algo mejor!'] });
stop({ ids: ['CL'], pad: 0.15, name: 'Chile', tag: 'SUELDO OIT 2024', title: '186 horas de trabajo',
  texts: ['iPhone 17: 1.099.990 pesos (1.135 $)', 'Sueldo medio: 6,26 $ la hora', 'El más asequible de Latinoamérica'], ribbon: ['¡186 HORAS!', 'por un iPhone'], bubble: ['CL', '¡Los que menos de aquí!'], moods: ['proud'] });
v.subscribe(52.5, 58.5);
stop({ ids: ['PE'], pad: 0.2, name: 'Perú', tag: 'SUELDO OIT 2025', title: '364 horas de trabajo',
  texts: ['iPhone 17: 4.299 soles (1.259 $)', 'Sueldo medio: 3,31 $ la hora', '¡Más de 45 jornadas!'], ribbon: ['¡364 HORAS!', 'por un iPhone'], bubble: ['PE', '¡Uf, más de 45 días!'] });
stop({ len: 11, ids: ['GT', 'CR'], cam: geoBox(-93, 7.5, -81.5, 18.5), pad: 0, name: 'Guatemala y Costa Rica', tag: 'SUELDOS OIT 2025', title: 'Guatemala: 381 h · Costa Rica: 188 h',
  texts: ['Guatemala: 8.995 quetzales (1.176 $)', 'Costa Rica: 599.900 colones (1.325 $)', '¡Costa Rica, la mitad de horas!'], ribbon: ['¡381 Y 188 HORAS!', 'por un iPhone'], bubble: ['CR', '¡Pura vida: la mitad!'], moods: ['cry', 'happy'] });
stop({ ids: ['DO'], pad: 0.35, name: 'República Dominicana', tag: 'PRECIO MEDIO DE TIENDA', title: 'Unas 349 horas de trabajo',
  texts: ['iPhone 17: unos 63.000 pesos (1.037 $)', 'Sueldo medio: 2,91 $ la hora', 'En tienda: de 56.000 a 70.000 pesos'], ribbon: ['¡UNAS 349 HORAS!', 'por un iPhone'], bubble: ['DO', '¡Casi 44 jornadas!'] });
reg('Latinoamérica');

// =================== 2) EUROPA (91–213 s) ===================
stop({ len: 11, ids: ['ES'], pad: 0.2, name: 'España', tag: 'EUROSTAT 2025', title: '65,6 horas de trabajo',
  texts: ['iPhone 17: 1.109 € (1.244 $)', 'Sueldo medio: 16,90 € la hora', '¡Más de 8 jornadas de trabajo!'], ribbon: ['¡65,6 HORAS!', 'por un iPhone'], bubble: ['ES', '¡Venga, que no es tanto!'], moods: ['proud'] });
stop({ ids: ['PT'], pad: 0.4, name: 'Portugal', tag: 'EUROSTAT 2025', title: '85,2 horas de trabajo',
  texts: ['iPhone 17: 1.139 € (1.277 $)', 'Sueldo medio: 13,38 € la hora', '¡20 horas más que España!'], ribbon: ['¡85,2 HORAS!', 'por un iPhone'], bubble: ['PT', '¡Más que mis vecinos!'], moods: ['worried'] });
stop({ ids: ['FR'], pad: 0.2, name: 'Francia', tag: 'EUROSTAT 2025', title: '52,3 horas de trabajo',
  texts: ['iPhone 17: 1.119 € (1.255 $)', 'Sueldo medio: 21,39 € la hora'], ribbon: ['¡52,3 HORAS!', 'por un iPhone'], bubble: ['FR', '¡Oh là là! ¡Casi verde!'] });
stop({ ids: ['IT'], pad: 0.2, name: 'Italia', tag: 'EUROSTAT 2025', title: '58,5 horas de trabajo',
  texts: ['iPhone 17: 1.129 € (1.266 $)', 'Sueldo medio: 19,29 € la hora'], ribbon: ['¡58,5 HORAS!', 'por un iPhone'], bubble: ['IT', '¡Mamma mia, una semana y pico!'] });
stop({ ids: ['GB'], pad: 0.2, name: 'Reino Unido', tag: 'SUELDO OIT 2025', title: '41,5 horas de trabajo',
  texts: ['iPhone 17: 899 libras (1.207 $)', 'Sueldo medio: 21,67 libras la hora', '¡Primer país en verde!'], ribbon: ['¡41,5 HORAS!', 'por un iPhone'], bubble: ['hero', '¡Una semana de trabajo!'], moods: ['cool'] });
stop({ ids: ['DE'], pad: 0.25, name: 'Alemania', tag: 'EUROSTAT 2025', title: '39,3 horas de trabajo',
  texts: ['iPhone 17: 1.099 € (1.232 $)', 'Sueldo medio: 27,94 € la hora', 'Se queda a las puertas del top 10'], ribbon: ['¡39,3 HORAS!', 'por un iPhone'], bubble: ['DE', '¡Menos de 40 horas!'] });
stop({ len: 11, ids: ['SE', 'FI'], cam: geoBox(8, 54, 33, 70), pad: 0, name: 'Suecia y Finlandia', tag: 'EUROSTAT 2025', title: 'Suecia: 46,4 h · Finlandia: 43,7 h',
  texts: ['Suecia: 12.495 coronas (1.275 $)', 'Finlandia: 1.149 € (1.288 $)', 'Finlandia: el iPhone más caro en euros'], ribbon: ['¡46,4 Y 43,7 HORAS!', 'por un iPhone'], bubble: ['FI', '¡Ni una semana!'] });
stop({ len: 11, ids: ['PL', 'CZ'], cam: geoBox(12, 47.5, 25, 55.5), pad: 0, name: 'Polonia y Chequia', tag: 'EUROSTAT 2025', title: 'Polonia: 82,7 h · Chequia: 81,6 h',
  texts: ['Polonia: 4.499 zlotys (1.150 $)', 'Chequia: 25.990 coronas (1.198 $)', '¡Casi empatados!'], ribbon: ['¡82,7 Y 81,6 HORAS!', 'por un iPhone'], bubble: ['PL', '¡Empate técnico!'] });
stop({ len: 11, ids: ['HU', 'RO'], cam: geoBox(16, 43.5, 30, 49), pad: 0, name: 'Hungría y Rumanía', tag: 'EUROSTAT 2025', title: 'Hungría: 94,5 h · Rumanía: 90,2 h',
  texts: ['Hungría: 419.990 forintos (1.298 $)', 'Rumanía: 5.199 lei (1.091 $)', 'Rumanía: precio de tienda, sin Apple Store'], ribbon: ['¡94,5 Y 90,2 HORAS!', 'por un iPhone'], bubble: ['HU', '¡Casi 100 horas!'], moods: ['worried', 'happy'] });
stop({ ids: ['UA'], pad: 0.2, name: 'Ucrania', tag: 'SUELDO 2026 (DERZHSTAT)', title: '260 horas de trabajo',
  texts: ['iPhone 17: 49.199 grivnas (1.079 $)', 'Sueldo medio: 4,16 $ la hora', '¡32 jornadas de trabajo!'], ribbon: ['¡260 HORAS!', 'por un iPhone'], bubble: ['hero', '¡Primer naranja de Europa!'] });
stop({ ids: ['TR'], pad: 0.2, name: 'Turquía', tag: 'SUELDO OIT 2025', title: '415 horas de trabajo',
  texts: ['iPhone 17: 99.999 liras (1.991 $)', '¡El iPhone más caro del vídeo en dólares!', 'Sueldo medio: 4,80 $ la hora'], ribbon: ['¡415 HORAS!', 'por un iPhone'], bubble: ['TR', '¡¿1.991 dólares?!'], moods: ['cry'] });
rest(8, 'MÁS PAÍSES DE EUROPA', ['EE', 'MK'], geoBox(10, 38, 32, 62), '¡Estonia, en morado!');
reg('Europa');
v.subscribe(T - 6.5, T - 0.5);

// =================== 3) ÁFRICA (213–255 s) ===================
stop({ len: 11, ids: ['EG', 'TN'], cam: geoBox(6, 21, 37, 38), pad: 0, name: 'Egipto y Túnez', tag: 'OIT 2024 (EGIPTO) · 2019 (TÚNEZ)', title: 'Egipto: 2.355 h · Túnez: 1.000 h',
  texts: ['Egipto: 77.500 libras (1.453 $)', 'Sueldo en Egipto: 0,62 $ la hora', 'Túnez: 4.999 dinares (1.663 $)'], ribbon: ['¡2.355 Y 1.000 HORAS!', 'por un iPhone'], bubble: ['EG', '¡Más de 2.000 horas!'] });
stop({ ids: ['NG'], pad: 0.3, name: 'Nigeria', tag: 'SUELDO OIT 2024', title: '2.798 horas de trabajo',
  texts: ['iPhone 17: 1.530.000 nairas (1.133 $)', 'Sueldo medio: 0,40 $ la hora', '¡350 jornadas: casi un año!'], ribbon: ['¡2.798 HORAS!', '¡casi un año entero!'], bubble: ['hero', '¡¿Un año de trabajo?!'] });
stop({ len: 11, ids: ['KE', 'UG'], cam: geoBox(28, -6, 43, 6), pad: 0, name: 'Kenia y Uganda', tag: 'OIT 2019 (KENIA) · 2021 (UGANDA)', title: 'Kenia: 1.906 h · Uganda: 1.224 h',
  texts: ['Kenia: 190.800 chelines (1.468 $)', 'Uganda: 4.300.000 chelines (1.066 $)', 'Kenia: 238 jornadas de trabajo'], ribbon: ['¡1.906 Y 1.224 HORAS!', 'por un iPhone'], bubble: ['KE', '¡Eso son meses!'] });
stop({ ids: ['ZA'], pad: 0.25, name: 'Sudáfrica', tag: 'SUELDO OIT 2020', title: '451 horas de trabajo',
  texts: ['iPhone 17: 20.800 rands (1.261 $)', 'Sueldo medio: unos 2,80 $ la hora', 'El mejor de África en el vídeo'], ribbon: ['¡451 HORAS!', 'por un iPhone'], bubble: ['ZA', '¡El mejor de África!'], moods: ['proud'] });
reg('África');

// =================== 4) ORIENTE MEDIO (255–286 s) ===================
stop({ ids: ['IL'], pad: 0.7, name: 'Israel', tag: 'PRECIO DE LANZAMIENTO · OIT 2021', title: '61 horas de trabajo',
  texts: ['iPhone 17: 3.999 séqueles (1.259 $)', 'Sueldo medio: 20,78 $ la hora'], ribbon: ['¡61 HORAS!', 'por un iPhone'], bubble: ['IL', '¡Morado!'] });
stop({ len: 11, ids: ['SA', 'QA'], cam: geoBox(35, 15, 56, 32), pad: 0, name: 'Arabia Saudí y Catar', tag: 'OIT 2022', title: 'Arabia S.: 110 h · Catar: 52 h',
  texts: ['Arabia Saudí: 4.299 riales (1.146 $)', 'Catar: 3.599 riales (989 $)', 'Catar: ¡el doble de rápido!'], ribbon: ['¡110 Y 52 HORAS!', 'por un iPhone'], bubble: ['QA', '¡Casi verde!'] });
stop({ ids: ['JO'], pad: 0.5, name: 'Jordania', tag: 'SUELDO OIT 2024', title: '478 horas de trabajo',
  texts: ['iPhone 17: 879 dinares (1.240 $)', 'Sueldo medio: 2,59 $ la hora', '¡Casi 60 jornadas!'], ribbon: ['¡478 HORAS!', 'por un iPhone'], bubble: ['JO', '¡Rozando el rojo!'] });
reg('Oriente Medio');

// =================== 5) ASIA Y OCEANÍA (286–404 s) ===================
stop({ len: 11, ids: ['KZ', 'UZ'], cam: geoBox(46, 34, 88, 57), pad: 0, name: 'Kazajistán y Uzbekistán', tag: 'OIT 2022 · PRECIOS 2025', title: 'Kazajistán: 349 h · Uzbekistán: 595 h',
  texts: ['Kazajistán: 624.990 tenges (1.397 $)', 'Uzbekistán: 17.300.000 sums (1.445 $)', 'Uzbekistán: ¡74 jornadas!'], ribbon: ['¡349 Y 595 HORAS!', 'por un iPhone'], bubble: ['UZ', '¡Casi 600 horas!'], moods: ['worried', 'cry'] });
stop({ ids: ['IN'], pad: 0.15, name: 'India', tag: 'SUELDO OIT 2025', title: '1.089 horas de trabajo',
  texts: ['iPhone 17: 99.900 rupias (1.063 $)', 'Sueldo medio: 0,98 $ la hora', '¡136 jornadas: medio año!'], ribbon: ['¡1.089 HORAS!', '¡medio año de trabajo!'], bubble: ['IN', '¡Pero si aquí se fabrican!'] });
stop({ ids: ['BD'], pad: 0.4, name: 'Bangladés', tag: 'SUELDO OIT 2024', title: '2.438 horas de trabajo',
  texts: ['iPhone 17: 179.999 takas (1.444 $)', 'Sueldo medio: 0,59 $ la hora', '¡305 jornadas de trabajo!'], ribbon: ['¡2.438 HORAS!', 'por un iPhone'], bubble: ['hero', '¡Ya casi como Nigeria!'] });
{ const r = stop({ len: 12, ids: ['PK'], pad: 0.2, name: 'Pakistán', tag: 'EL QUE MÁS · OIT 2025', title: '2.866 horas de trabajo',
    texts: ['iPhone 17: 399.000 rupias (1.441 $)', 'Sueldo medio: 0,50 $ la hora', '¡358 jornadas: más de un año!'], ribbon: ['¡2.866 HORAS!', '¡el récord del vídeo!'], bubble: ['PK', '¿Más que Nigeria…?'], moods: ['cry'] });
  v.flash(r.tc, '#FF5A4E'); v.shake(r.tc + 0.05, 16); v.s2(r.tc + 0.1, 'boom', 0.3); }
stop({ ids: ['CN'], pad: 0.1, name: 'China', tag: 'OIT 2022 (SECTOR PRIVADO URBANO)', title: '216 horas de trabajo',
  texts: ['iPhone 17: 6.799 yuanes (1.017 $)', 'Sueldo medio: 4,70 $ la hora', 'Aquí se fabrican casi todos'], ribbon: ['¡216 HORAS!', 'por un iPhone'], bubble: ['CN', '¡Y los fabrico yo!'] });
stop({ len: 11, ids: ['KR', 'TW'], cam: geoBox(119, 21.5, 131, 39), pad: 0, name: 'Corea del Sur y Taiwán', tag: 'OIT 2022 · TAIWÁN: DGBAS 2024', title: 'Corea: 58 h · Taiwán: 93 h',
  texts: ['Corea: 1.450.000 wones (1.081 $)', 'Taiwán: 32.900 dólares taiw. (999 $)', 'En Taiwán se hacen sus chips'], ribbon: ['¡58 Y 93 HORAS!', 'por un iPhone'], bubble: ['KR', '¡La patria de Samsung!'] });
stop({ ids: ['JP'], cam: geoBox(128, 30, 146, 45), pad: 0, name: 'Japón', tag: 'OIT 2021', title: '90 horas de trabajo',
  texts: ['iPhone 17: 159.800 yenes (1.008 $)', 'Sueldo medio: 11,21 $ la hora', 'Uno de los iPhone más baratos en $'], ribbon: ['¡90 HORAS!', 'por un iPhone'], bubble: ['JP', '¡Morado!'] });
stop({ len: 11, ids: ['TH', 'MY'], cam: geoBox(97, 0.5, 120, 21), pad: 0, name: 'Tailandia y Malasia', tag: 'OIT 2025 · 2020', title: 'Tailandia: 371 h · Malasia: 269 h',
  texts: ['Tailandia: 34.900 bats (1.040 $)', 'Malasia: 4.299 ringgits (1.060 $)', 'Tailandia: 46 jornadas'], ribbon: ['¡371 Y 269 HORAS!', 'por un iPhone'], bubble: ['TH', '¡Naranja los dos!'] });
stop({ len: 12, ids: ['ID', 'PH', 'VN'], cam: geoBox(95, -11, 127, 23), pad: 0, name: 'Indonesia, Filipinas y Vietnam', tag: 'OIT 2024-2025', title: '1.206 h · 581 h · 646 h',
  texts: ['Indonesia: 0,94 $ la hora', 'Filipinas: 69.990 pesos (1.111 $)', 'Vietnam: 28.999.000 dongs (1.132 $)'], ribbon: ['¡ENTRE 581 Y 1.206 HORAS!', 'por un iPhone'], bubble: ['hero', '¡Todo el sudeste, en rojo!'] });
const SG: [number, number] = geo(103.82, 1.35), LU: [number, number] = geo(6.13, 49.8);
stop({ ids: ['SG'], at: { SG }, cam: geoBox(101.5, -0.5, 106.5, 3.5), pad: 0, name: 'Singapur', tag: 'OIT 2021', title: '54 horas de trabajo',
  texts: ['iPhone 17: 1.449 dólares sing. (1.131 $)', 'Sueldo medio: 21,12 $ la hora', 'Al lado, Indonesia: 1.206 h'], ribbon: ['¡54 HORAS!', 'por un iPhone'], bubble: ['SG', '¡Pequeño pero rápido!'] });
stop({ len: 11, ids: ['AU', 'NZ'], cam: geoBox(112, -47, 179, -10), pad: 0, name: 'Australia y Nueva Zelanda', tag: 'OIT 2021-2022', title: 'Australia: 45 h · N. Zelanda: 55 h',
  texts: ['Australia: 1.549 dólares aus. (1.065 $)', 'N. Zelanda: 1.899 dólares nz. (1.065 $)', 'Australia: ¡verde!'], ribbon: ['¡45 Y 55 HORAS!', 'por un iPhone'], bubble: ['AU', '¡Una semanita, mate!'], moods: ['cool', 'happy'] });
reg('Asia y Oceanía');

// =================== 6) TOP 10: LOS QUE MENOS TRABAJAN (404–519 s) ===================
{ const t = section(8, C.gold, '¡EL TOP 10!', 'los que menos horas necesitan', '¿Dónde cuesto menos?');
  v.subscribe(t + 3.9, t + 7.8, true); }
const s6 = T;
stop({ ids: ['BE'], pad: 0.45, name: 'Bélgica', tag: '#10 · EUROSTAT 2025', title: '39 horas de trabajo', pills: ['#10 · 39 h'],
  texts: ['iPhone 17: 1.119 € (1.255 $)', 'Sueldo medio: 28,68 € la hora'], ribbon: ['#10: ¡39 HORAS!', 'por un iPhone'], bubble: ['BE', '¡Entro en el top!'], moods: ['proud'] });
stop({ ids: ['NL'], pad: 0.5, name: 'Países Bajos', tag: '#9 · EUROSTAT 2025', title: '38,3 horas de trabajo', pills: ['#9 · 38,3 h'],
  texts: ['iPhone 17: 1.119 € (1.255 $)', 'Sueldo medio: 29,21 € la hora'], ribbon: ['#9: ¡38,3 HORAS!', 'por un iPhone'], bubble: ['NL', '¡Por poquito!'] });
stop({ ids: ['IE'], pad: 0.4, name: 'Irlanda', tag: '#8 · EUROSTAT 2025', title: '38 horas de trabajo', pills: ['#8 · 38 h'],
  texts: ['iPhone 17: 1.129 € (1.266 $)', 'Sueldo medio: 29,73 € la hora'], ribbon: ['#8: ¡38 HORAS!', 'por un iPhone'], bubble: ['IE', '¡Menos de una semana!'], moods: ['proud'] });
stop({ ids: ['AT'], pad: 0.4, name: 'Austria', tag: '#7 · EUROSTAT 2025', title: '36,4 horas de trabajo', pills: ['#7 · 36,4 h'],
  texts: ['iPhone 17: 1.099 € (1.232 $)', 'Sueldo medio: 30,17 € la hora'], ribbon: ['#7: ¡36,4 HORAS!', 'por un iPhone'], bubble: ['AT', '¡Wunderbar!'] });
stop({ ids: ['NO'], pad: 0.15, name: 'Noruega', tag: '#6 · EUROSTAT 2023', title: '35,6 horas de trabajo', pills: ['#6 · 35,6 h'],
  texts: ['iPhone 17: 12.490 coronas (1.319 $)', 'Sueldo medio: 37,03 $ la hora'], ribbon: ['#6: ¡35,6 HORAS!', 'por un iPhone'], bubble: ['NO', '¡Fiordos y iPhones!'], moods: ['cool'] });
stop({ ids: ['DK'], pad: 0.6, name: 'Dinamarca', tag: '#5 · EUROSTAT 2025', title: '33 horas de trabajo', pills: ['#5 · 33 h'],
  texts: ['iPhone 17: 8.499 coronas (1.275 $)', 'Sueldo medio: 38,62 $ la hora'], ribbon: ['#5: ¡33 HORAS!', 'por un iPhone'], bubble: ['DK', '¡Cuatro días y listo!'], moods: ['cool'] });
stop({ ids: ['CA'], pad: 0.08, name: 'Canadá', tag: '#4 · OIT 2025', title: '32,4 horas de trabajo', pills: ['#4 · 32,4 h'],
  texts: ['iPhone 17: 1.299 dólares can. (917 $)', 'Sueldo medio: 28,69 $ la hora', 'Precio sin impuestos, como en EE. UU.'], ribbon: ['#4: ¡32,4 HORAS!', 'por un iPhone'], bubble: ['CA', '¡Ni cuatro días!'], moods: ['happy'] });
stop({ ids: ['LU'], at: { LU }, cam: geoBox(2.5, 47.8, 9.8, 51.7), pad: 0, name: 'Luxemburgo', tag: '#3 · EUROSTAT 2025', title: '26,8 horas de trabajo', pills: ['#3 · 26,8 h'],
  texts: ['iPhone 17: 1.082 € (1.213 $)', 'Sueldo medio: 40,35 € la hora', 'El iPhone más barato de la zona euro'], ribbon: ['#3: ¡26,8 HORAS!', 'por un iPhone'], bubble: ['LU', '¡Pequeño pero rico!'], moods: ['cool'] });
stop({ len: 11, ids: ['US'], pad: 0.1, name: 'Estados Unidos', tag: '#2 · OIT 2025', title: '21,4 horas de trabajo', pills: ['#2 · 21,4 h'],
  texts: ['iPhone 17: 929 $ (sin impuestos)', 'Sueldo medio: 43,49 $ la hora', '¡Menos de 3 jornadas!'], ribbon: ['#2: ¡21,4 HORAS!', 'por un iPhone'], bubble: ['US', '¿Solo segundos? ¿Quién nos gana?'], moods: ['shocked'] });
{ const r = stop({ len: 16, ids: ['CH'], cam: geoBox(4.5, 45, 12, 48.5), pad: 0, name: 'Suiza', tag: '#1 · OIT 2025', title: '18,7 horas de trabajo', pills: ['#1 · 18,7 h'],
    texts: ['iPhone 17: 899 francos (1.095 $)', 'Sueldo medio: 48,11 francos la hora', '¡Ni dos jornadas y media!'], ribbon: ['#1: ¡18,7 HORAS!', '¡ni 3 días de trabajo!'], bubble: ['CH', '¿Quién será el número 1…?'], moods: ['love'], climax: true });
  v.flash(r.tc, '#FFD23F'); v.shake(r.tc + 0.05, 22); v.fx(r.tc + 0.1, 'confetti'); v.s2(r.tc + 0.1, 'boom', 0.3); v.s2(r.tc + 0.3, 'crowd_roar', 0.3);
  v.bubble(r.tc + 4.8, r.e - 0.3, 'hero', '¡150 veces menos que Pakistán!', { side: 'right' });
  v.heroMood(r.tc + 4.6, 'love'); }
v.region(s6, T, 'Top 10');

// =================== RESULTADO FINAL (22 s) ===================
{ const t = blk(22);
  v.region(t, t + 22, 'Resultado final');
  v.cam(t - 0.3, WORLD, { dur: 1.8, ...FR, pad: 0 });
  const order: Cat[] = ['top', 'good', 'mid', 'low'];
  v.results(t + 0.6, t + 21.6, 'HORAS PARA PAGAR UN iPHONE', order.map((c) => ({ label: CAT[c].range.toUpperCase(), color: CAT[c].color, ids: seen[c].slice(0, 24), count: seen[c].length })), 'iPhone 17 de 256 GB · sueldo medio por hora');
  v.fx(t + 1.0, 'confetti'); v.s2(t + 1.2, 'crowd_roar', 0.2);
  v.heroMood(t + 1.0, 'happy');
  v.bubble(t + 3.0, t + 11.0, 'hero', '¡De 18,7 a 2.866 horas!', { side: 'right' });
  v.heroMood(t + 11.5, 'wow');
  v.bubble(t + 11.6, t + 21.4, 'hero', '¿Y en tu país? ¿Te lo esperabas?', { side: 'right' }); }

// =================== CIERRE ===================
{ const t = blk(DUR - T);
  v.outro(t, DUR - 0.4, '¿Cuántas horas trabajas tú para comprarte un iPhone? ¡Comenta!');
  v.heroMood(t + 0.2, 'happy');
  v.bubble(t + 1.5, DUR - 0.8, 'hero', '¡Suscríbete para más mapas!', { side: 'right' }); }
if (T > DUR + 0.01 || DUR - T > 0.01) console.warn('iphone: cursor final', T, '≠ DUR', DUR);

// ---------- HUD ----------
v.versusBar({ t0: 6.6, t1: DUR, left: 'MÁS DE 150 H', right: 'MENOS DE 150 H', lc: C.orange, rc: C.yes, steps: vs.map((x) => ({ ...x, t: Math.max(x.t, 6.6) })) });
v.led({ t0: 6.6, t1: DUR, cells: [
  { label: '-50 H', color: '#4BE07F', steps: led.top },
  { label: '50-150 H', color: '#B78CFF', steps: led.good },
  { label: '150-500 H', color: '#FF9F43', steps: led.mid },
  { label: '+500 H', color: '#FF5A4E', steps: led.low },
] });
v.list(10, DUR, rows.sort((a, b) => a.t - b.t), 6);

export const iphone = v.end(DUR, 'Precios: Apple Store y tiendas oficiales (nov. 2026) · Sueldos: OIT (ILOSTAT) y Eurostat 2025');

// ---------- 5 miniaturas ----------
const EUFLAGS = ['CH', 'DE', 'FR', 'ES', 'IT', 'GB', 'LU', 'BE', 'NL', 'AT', 'PL', 'PT', 'IE', 'DK', 'NO', 'SE'];
export const iphoneThumbs: ThumbV[] = [
  { layout: 'hero', top: '¿CUÁNTAS *HORAS* TRABAJAS', bottom: '*POR UN iPHONE?*', accent: '#FFD23F', bg: { kind: 'map', view: geoBox(-12, 36, 30, 60), flags: EUFLAGS, faces: ['DE', 'FR', 'ES', 'IT', 'PL'] }, hero: { kind: 'object', name: 'phone', mood: 'shocked', glow: '#FFD23F' }, x: 640, y: 372, size: 470 },
  { layout: 'versus', top: '¡*150 VECES* MÁS HORAS!', accent: '#FFD23F', left: { hero: { kind: 'country', id: 'CH', mood: 'love', glow: '#35E06F' }, bg: { kind: 'sea' }, label: '19 HORAS', labelColor: '#35E06F' }, right: { hero: { kind: 'country', id: 'PK', mood: 'cry', glow: '#FF3B30', face: 0.6 }, bg: { kind: 'dark' }, label: '2.866 HORAS', labelColor: '#FF4B3E' }, size: 480 },
  { layout: 'number', top: '¡HORAS POR UN *iPHONE*!', big: '2.866 H', bigColor: '#FF4B3E', accent: '#FF4B3E', bg: { kind: 'dark' }, hero: { kind: 'object', name: 'phone', mood: 'terror', glow: '#FF3B30' }, size: 420 },
  { layout: 'hero', top: '¿DÓNDE ES *MÁS BARATO*', bottom: '*UN iPHONE?*', accent: '#35E06F', bg: { kind: 'dark' }, hero: { kind: 'object', name: 'phone', mood: 'evil', glow: '#35E06F' }, x: 640, y: 370, size: 500, rays: true },
  { layout: 'grid', top: '¿CUÁNTAS *HORAS*', bottom: '*TRABAJAS TÚ?*', accent: '#FFD23F', bg: { kind: 'sea' }, grid: { ids: ['MX', 'ES', 'AR', 'US', 'CO', 'CH'], moods: ['shocked', 'happy', 'worried', 'cool', 'cry', 'love'] } },
];
