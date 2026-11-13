// "¿Dónde está PROHIBIDO el CHICLE?" — v3, FORMATO GIRA POR PAÍSES (como "Países que nunca han ido a un Mundial").
// El chicle protagonista va país por país: cuerda, bandera, cara, tarjeta con 2-3 datos rotando y VEREDICTO de categoría.
// Nada de historias largas: ~10 s por parada, grupos para el resto del mundo y suspense hasta Singapur (el único que lo prohíbe).
// Investigación y fuentes: research/chicle.md
import { Video, type Mood } from '../engine/builder';
import type { ThumbV } from '../engine/Thumb';
import { C } from '../engine/theme';
import { CONTINENTS, geo, geoBox, nameOf } from '../engine/world';

const v = new Video('chicle', '¿Dónde está PROHIBIDO el CHICLE?').setFps(60);
const FR = { left: 0.27, right: 0.2, bottom: 0.21, top: 0.11 };
const DUR = 556;
v.soundtrack(DUR, ['pixel_peeker_polka', 'carefree', 'life_of_riley', 'wallpaper'], 0.38); // v3.1: fuera «Sneaky Snitch» (al usuario no le gustó el inicio)
const WORLD = geoBox(-150, -45, 160, 72);

// ---------- categorías ----------
type Cat = 'ok' | 'fine' | 'hard' | 'ban';
const CAT: Record<Cat, { color: string; label: string; ribbon: string; icon: string; card: string; mood: Mood; hero: Mood }> = {
  ok: { color: C.yes, label: 'PERMITIDO', ribbon: '¡PERMITIDO!', icon: '✓', card: 'SE VENDE', mood: 'happy', hero: 'love' },
  fine: { color: C.purple, label: 'MULTA', ribbon: '¡MULTA!', icon: '€', card: 'SI LO TIRAS', mood: 'angry', hero: 'worried' },
  hard: { color: C.orange, label: 'MULTA DURA', ribbon: '¡MULTA DURA!', icon: '!', card: 'SI LO TIRAS', mood: 'evil', hero: 'shocked' },
  ban: { color: C.no, label: 'PROHIBIDO', ribbon: '¡PROHIBIDO!', icon: '✕', card: 'VENDERLO', mood: 'angry', hero: 'cry' },
};
// territorios que no son miembros de la ONU: se pintan pero no cuentan en los marcadores (193 países)
const NON_UN = new Set('GL PR BM KY TC VG VI AI AW CW SX MS PM BL MF FK GF NC PF GU MP AS CK NU AU-AC FO AX GG JE IM EH SO-SL CY-N IN-SG HK MO TF HM GS AQ XK TW VA PS'.split(' '));
const cnt = (ids: string[]) => ids.filter((i) => !NON_UN.has(i)).length;

// ---------- marcadores ----------
const n: Record<Cat, number> = { ok: 0, fine: 0, hard: 0, ban: 0 };
const led: Record<Cat, { t: number; v: number }[]> = { ok: [{ t: 0, v: 0 }], fine: [{ t: 0, v: 0 }], hard: [{ t: 0, v: 0 }], ban: [{ t: 0, v: 0 }] };
const vs: { t: number; l: number; r: number }[] = [{ t: 0, l: 0, r: 0 }];
const rows: { t: number; flag: string; name: string; pill: string; color: string }[] = [];
const seen: Record<Cat, string[]> = { ok: [], fine: [], hard: [], ban: [] };
const count = (t: number, cat: Cat, k: number) => {
  n[cat] += k; led[cat].push({ t, v: n[cat] });
  vs.push({ t, l: n.ban, r: n.ok + n.fine + n.hard });
};

let T = 0;
const blk = (len: number) => { const a = T; T += len; return a; };

// ---------- una parada (1-3 países) ----------
type Stop = {
  len?: number; ids: string[]; cat: Cat; at?: Record<string, [number, number]>; cam?: string[] | [number, number, number, number]; pad?: number;
  name: string; tag: string; title: string; texts: string[]; pills: string[]; labels?: string[];
  bubble?: [string, string]; ribbon?: [string, string]; moods?: Mood[];
};
const stop = (o: Stop) => {
  const len = o.len ?? 10, t = blk(len), e = t + len, k = CAT[o.cat], tc = e - 3.2;
  v.cam(t - 0.35, o.cam ?? o.ids, { dur: 1.6, ...FR, pad: o.pad ?? 0.25 });
  o.ids.forEach((id, i) => {
    const at = o.at?.[id], d = i * 0.35;
    v.rope(t + 0.2 + d, e - 0.15, id, '#FFFFFF', at);
    v.flag(t + 0.5 + d, [id], 0.3);
    v.fx(t + 0.55 + d, 'pulse', { id, at, color: '#FFFFFF' });
    v.s2(t + 0.55 + d, 'pop', 0.5);
    v.face(t + 0.6 + d, e + 0.1, id, o.moods?.[i] ?? k.mood, { scale: 0.9, at });
    v.tag(t + 0.5 + d, e - 0.1, id, o.labels?.[i] ?? nameOf(id).toUpperCase(), at);
    v.fill(e, [id], k.color, 0.35);
    v.face(e + 0.1, DUR, id, 'dots', { scale: 0.55, at });
    rows.push({ t: tc + 0.15 + i * 0.25, flag: id, name: nameOf(id), pill: o.pills[i], color: k.color });
    seen[o.cat].push(id);
  });
  v.info(t + 0.6, e - 0.2, { flag: o.ids[0], name: o.name, tag: o.tag, chip: k.label, chipColor: k.color, chipAt: tc, label: k.card, labelColor: k.color, title: o.title, texts: o.texts });
  v.heroMood(t + 0.9, 'wow');
  if (o.bubble) {
    const hero = o.bubble[0] === 'hero';
    v.bubble(t + 3.0, tc - 0.15, hero ? 'hero' : o.bubble[0], o.bubble[1], { side: hero ? 'right' : 'left', at: hero ? undefined : o.at?.[o.bubble[0]] });
  }
  v.suspense(tc); // redoble + pandereta que acaba justo cuando sale el veredicto
  v.ribbon(tc, e - 0.4, o.ribbon?.[0] ?? k.ribbon, k.color, o.ribbon?.[1] ?? o.pills[0], k.icon);
  v.heroMood(tc + 0.1, k.hero);
  count(tc, o.cat, cnt(o.ids));
  return t;
};

// ---------- grupo "el resto" (se vende sin problema) ----------
const FEATURED = new Set('US GT BZ AR GR DK FI RW TM JP KR CN TW VN PH ID TH AU NZ ZA BR EC PA CU CH SE AT FR IT BE NL PL DE IE GB ES TR SA QA AE HK MY CA MX CO PE CL SG'.split(' '));
const restOf = (cont: string, extra: string[] = []) => CONTINENTS[cont].filter((i) => !FEATURED.has(i) && !extra.includes(i));
const rest = (len: number, title: string, ids: string[], show: string[], box: [number, number, number, number], bubble: string) => {
  const t = blk(len), e = t + len;
  v.cam(t - 0.35, box, { dur: 1.6, ...FR, pad: 0.02 });
  ids.forEach((id, i) => v.fill(t + 0.6 + i * 0.03, [id], C.yes, 0.3));
  v.crowd(t + 0.8, DUR, ids, 'dots', 0.5, 0.03);
  v.group(t + 0.5, e - 0.2, title, show.map((id) => ({ flag: id, name: nameOf(id), color: C.yes })), `+${cnt(ids)} países: se vende sin problema`);
  v.s2(t + 0.6, 'whoosh', 0.35);
  v.heroMood(t + 0.8, 'happy');
  v.bubble(t + 1.4, e - 0.4, 'hero', bubble, { side: 'right' });
  rows.push({ t: t + 1.2, flag: show[0], name: title.replace(/^EL RESTO DE /, 'Resto de '), pill: `+${cnt(ids)}`, color: C.yes });
  seen.ok.push(...show);
  count(t + 1.2, 'ok', cnt(ids));
};

// ---------- transición entre categorías ----------
const section = (len: number, cat: Cat, text: string, sub: string, bubble?: string) => {
  const t = blk(len);
  v.cam(t - 0.3, WORLD, { dur: 1.7, ...FR, pad: 0 });
  v.ribbon(t + 0.4, t + len - 0.3, text, CAT[cat].color, sub, CAT[cat].icon);
  v.s2(t + 0.2, 'riser', 0.4);
  v.heroMood(t + 0.5, CAT[cat].hero);
  if (bubble) v.bubble(t + 0.6, t + len - 0.2, 'hero', bubble, { side: 'right' });
  return t;
};

// =================== INTRO (0–22 s) ===================
v.cam(0, WORLD, { dur: 0, left: 0, right: 0, bottom: 0, top: 0, pad: 0 });
v.cam(0.01, WORLD, { dur: 4, left: 0, right: 0, bottom: 0, top: 0, pad: 0, zoom: 1.06 });
v.hero(0.25, DUR, 'gum', { obj: 'gum', x: 240, y: 320, size: 330, label: 'CHICLE', mood: 'wow' });
v.title2(0.2, 4.3, ['¿Dónde está', '*PROHIBIDO*', 'el *CHICLE*?'], [C.gold, '#FF4B3E', '#FF8DC0'], [
  { text: '193 países', color: C.teal }, { text: 'país por país', color: C.purple },
]);
v.bubble(1.2, 4.1, 'hero', '¡Yo no he hecho nada!', { side: 'right' });
v.ribbon(4.5, 7.6, '¡SOLO 1 PAÍS LO PROHÍBE!', C.no, 'de 193', '!');
v.shake(4.55, 14); v.s2(4.5, 'boom', 0.3);
v.heroMood(4.6, 'shocked');
v.cam(7.6, geoBox(-125, -40, -30, 50), { dur: 1.6, ...FR, pad: 0 });
v.bubble(7.9, 10.8, 'hero', '¿Cuál será? ¿Estará en América?', { side: 'right' });
v.cam(10.9, geoBox(-15, 30, 45, 66), { dur: 1.6, ...FR, pad: 0 });
v.bubble(11.2, 13.9, 'hero', '¿O en Europa?', { side: 'right' });
v.heroMood(11.2, 'worried');
v.cam(14.0, geoBox(60, -12, 150, 45), { dur: 1.6, ...FR, pad: 0 });
v.ribbon(14.4, 17.4, '¡Y EN OTROS TE MULTAN!', C.orange, 'si lo tiras al suelo', '€');
v.heroMood(14.5, 'terror');
v.cam(17.6, WORLD, { dur: 1.7, ...FR, pad: 0 });
v.bubble(18.0, 21.7, 'hero', '¡Vamos país por país!', { side: 'right' });
v.heroMood(18.0, 'happy');
v.s2(21.0, 'riser', 0.4);
T = 22;

// =================== CÓMO LO MEDIMOS (22–32 s) ===================
{ const t = blk(10);
  v.region(t, t + 10, 'Cómo lo medimos');
  v.legend(t + 0.2, t + 9.8, 'CÓMO LO MEDIMOS', [
    { color: C.yes, label: 'PERMITIDO', desc: 'Se vende sin problema' },
    { color: C.purple, label: 'MULTA', desc: 'Tirarlo: menos de 100 €' },
    { color: C.orange, label: 'MULTA DURA', desc: 'Tirarlo: 100 € o más' },
    { color: C.no, label: 'PROHIBIDO', desc: 'Ni siquiera se puede vender' },
  ]); }

// =================== 1) SE VENDE SIN PROBLEMA ===================
let s0 = T;
stop({ len: 12, ids: ['US'], cat: 'ok', pad: 0.15, name: 'Estados Unidos', tag: 'EL PAÍS DEL CHICLE', title: 'Se vende en cualquier tienda', pills: ['LIBRE'],
  texts: ['Seattle quitó 1.070 kg de chicle de su Gum Wall', 'Y los parques Disney no venden chicle'], bubble: ['US', '¡Aquí se vende en todas partes!'], moods: ['cool'] });
stop({ len: 13, ids: ['GT', 'BZ'], cat: 'ok', cam: geoBox(-94, 13, -85, 20), pad: 0, name: 'Guatemala y Belice', tag: 'LA CUNA DEL CHICLE', title: 'De aquí sale el chicle natural', pills: ['LIBRE', 'LIBRE'],
  texts: ['Sale de la savia del árbol de chicozapote', 'Guatemala aprobó en 2024 una ley chiclera', 'Belice distingue 4 tipos de chicle'], bubble: ['hero', '¡Mis raíces están en estos árboles!'], moods: ['proud', 'happy'] });
rest(9, 'CENTROAMÉRICA Y EL CARIBE', restOf('namerica', ['US', 'CA', 'MX']), ['DO', 'CR', 'HN', 'JM', 'SV', 'NI', 'HT'], geoBox(-95, 5, -58, 28), '¡Aquí me quieren todos!');
stop({ ids: ['AR'], cat: 'ok', pad: 0.2, name: 'Argentina', tag: 'BUENOS AIRES', title: 'Se vende sin problema', pills: ['LIBRE'],
  texts: ['Quitaron 90.000 chicles de la calle Florida', 'Los despegaron con hielo seco a −79 °C'], bubble: ['hero', '¡A −79 °C! ¡Brrr!'] });
rest(9, 'EL RESTO DE SUDAMÉRICA', restOf('samerica'), ['VE', 'BO', 'PY', 'UY', 'GY', 'SR'], geoBox(-82, -56, -34, 13), '¡Sudamérica, sin problema!');
stop({ ids: ['GR'], cat: 'ok', pad: 0.3, name: 'Grecia', tag: 'ISLA DE QUÍOS', title: 'Se vende sin problema', pills: ['LIBRE'],
  texts: ['La almáciga de Quíos es patrimonio UNESCO', 'Una resina que se masca desde la Antigüedad'], bubble: ['GR', '¡Nuestro chicle sale de un árbol!'], moods: ['proud'] });
stop({ len: 12, ids: ['DK', 'FI'], cat: 'ok', cam: geoBox(4, 53, 32, 67), pad: 0, name: 'Dinamarca y Finlandia', tag: 'LOS CHICLES MÁS ANTIGUOS', title: 'Se vende sin problema', pills: ['LIBRE', 'LIBRE'],
  texts: ['Dinamarca: un chicle de abedul de 5.700 años', 'De sus marcas se sacó un ADN humano entero', 'Finlandia: otro de unos 5.500 años'], bubble: ['hero', '¡Mis tatarabuelos de piedra!'], moods: ['wow', 'happy'] });
rest(9, 'EL RESTO DE EUROPA', restOf('europe'), ['PT', 'NO', 'CZ', 'HU', 'RO', 'HR', 'RU'], geoBox(-12, 34, 45, 70), '¡Europa me deja pasar!');
stop({ len: 12, ids: ['RW', 'TM'], cat: 'ok', cam: geoBox(25, -12, 70, 45), pad: 0, name: 'Ruanda y Turkmenistán', tag: 'MITOS DE INTERNET', title: '¿Prohibido? ¡FALSO!', pills: ['MITO', 'MITO'],
  texts: ['Ruanda prohíbe las bolsas de plástico, no el chicle', 'En Turkmenistán tampoco hay ley contra el chicle'], ribbon: ['¡ES UN MITO!', 'se vende en los dos'], bubble: ['hero', '¡Bulos! ¡Allí también me venden!'], moods: ['cool', 'happy'] });
rest(9, 'EL RESTO DE ÁFRICA', restOf('africa'), ['NG', 'EG', 'MA', 'KE', 'ET', 'SN', 'GH'], geoBox(-20, -36, 52, 38), '¡Toda África, sin problema!');
rest(9, 'EL RESTO DE ASIA', restOf('asia'), ['IN', 'PK', 'IR', 'KZ', 'IL', 'BD', 'MN'], geoBox(25, -10, 150, 56), '¡Y casi toda Asia!');
rest(8, 'OCEANÍA', restOf('oceania'), ['FJ', 'PG', 'WS', 'TO', 'VU', 'SB'], geoBox(135, -30, 185, 2), '¡Hasta en las islas del Pacífico!');
v.region(s0, T, 'Se vende sin problema');

// =================== 2) MULTA (< 100 €) ===================
s0 = section(4, 'fine', '¡AHORA, LAS MULTAS!', 'menos de 100 €', 'Uy… ¿y si me tiran al suelo?');
v.subscribe(s0 + 4.3, s0 + 10.5);
const s1 = T;
stop({ ids: ['JP'], cat: 'fine', at: { JP: geo(139.7, 35.66) }, cam: geoBox(128, 30, 146, 43), pad: 0, name: 'Japón', tag: 'TOKIO · SHIBUYA', title: '2.000 yenes por tirar basura', pills: ['2.000 ¥'],
  texts: ['Shibuya pone más papeleras… y multas', 'Los fabricantes de chicle limpian Ginza cada año'], bubble: ['JP', '¡Aquí la calle se respeta!'] });
stop({ ids: ['KR'], cat: 'fine', pad: 0.35, name: 'Corea del Sur', tag: 'SEÚL', title: 'Hasta 50.000 wones por escupir chicle', pills: ['50.000 ₩'],
  texts: ['Unos 30 €', 'La norma se creó para el G20 de 2010'], bubble: ['hero', '¡Ni escupirme se puede!'] });
stop({ ids: ['CN'], cat: 'fine', at: { CN: geo(113.26, 23.13) }, cam: geoBox(100, 15, 125, 33), pad: 0, name: 'China', tag: 'METRO DE CANTÓN', title: 'Hasta 500 yuanes por escupir chicle', pills: ['500 CNY'], labels: ['CANTÓN'],
  texts: ['Norma en vigor desde enero de 2024', 'Fuera del metro, se vende sin problema'], bubble: ['hero', '¡En el metro, ni se te ocurra!'] });
stop({ ids: ['TW'], cat: 'fine', cam: geoBox(115, 19, 127, 28), pad: 0, name: 'Taiwán', tag: 'TAIPÉI', title: 'Mínimo 2.400 NT$ por escupir chicle', pills: ['2.400 NT$'],
  texts: ['La misma multa que escupir jugo de betel', 'En todo el país: de 1.200 a 6.000 NT$'], bubble: ['TW', '¡Aquí lo nombramos con todas las letras!'] });
stop({ len: 13, ids: ['VN', 'PH', 'ID'], cat: 'fine', cam: geoBox(95, -11, 130, 22), pad: 0, name: 'Sudeste asiático', tag: 'TIRAR BASURA A LA CALLE', title: 'Multas por ensuciar la calle', pills: ['2 M ₫', '1.000 ₱', '500.000 Rp'],
  texts: ['Vietnam: hasta 2 millones de dongs', 'Filipinas: hasta 1.000 pesos o servicio social', 'Yakarta: hasta 500.000 rupias'], bubble: ['hero', '¡Tres multas de golpe!'] });
stop({ ids: ['TH'], cat: 'fine', pad: 0.3, name: 'Tailandia', tag: 'BANGKOK', title: 'Hasta 2.000 bat por tirarlo', pills: ['2.000 THB'],
  texts: ['Unos 50 €', 'Inspectores patrullan las zonas turísticas'], bubble: ['TH', '¡A la papelera, por favor!'] });
stop({ ids: ['AU'], cat: 'fine', at: { AU: geo(146.5, -32.5) }, pad: 0.1, name: 'Australia', tag: 'NUEVA GALES DEL SUR', title: '160 dólares en el acto', pills: ['160 AUD'],
  texts: ['Unos 90 €', 'Y hasta 5.000 si el caso va a juicio'], bubble: ['AU', '¡Ni se te ocurra, mate!'] });
stop({ len: 9, ids: ['NZ'], cat: 'fine', pad: 0.3, name: 'Nueva Zelanda', tag: 'UPPER HUTT', title: '100 dólares por tirar un chicle', pills: ['100 NZD'],
  texts: ['La norma lo llama «basura menor»', 'Tarifa vigente desde julio de 2026'], bubble: ['hero', '¿«Basura menor»? ¡Oye!'] });
stop({ len: 9, ids: ['ZA'], cat: 'fine', at: { ZA: geo(18.42, -33.92) }, cam: geoBox(12, -36, 32, -24), pad: 0, name: 'Sudáfrica', tag: 'CIUDAD DEL CABO', title: '500 rands por tirar basura', pills: ['500 ZAR'], labels: ['CIUDAD DEL CABO'],
  texts: ['Unos 25 €', 'Un caso viral: multado al tirarla desde el coche'] });
stop({ ids: ['BR'], cat: 'fine', at: { BR: geo(-40.3, -20.3) }, cam: geoBox(-56, -28, -34, -10), pad: 0, name: 'Brasil', tag: 'VITÓRIA · CÓDIGO DE TRÁFICO', title: '130 reales por escupir un chicle', pills: ['130 R$'], labels: ['VITÓRIA'],
  texts: ['Desde el coche: infracción media', 'Y además, 4 puntos del carné'], bubble: ['hero', '¡Desde el coche tampoco!'] });
stop({ len: 13, ids: ['EC', 'PA', 'CU'], cat: 'fine', cam: geoBox(-92, -6, -72, 24), pad: 0, name: 'Ecuador, Panamá y Cuba', tag: 'TIRAR CHICLE O BASURA', title: 'Multas en sus ciudades', pills: ['63 USD', '100 B/.', '3.000 CUP'],
  texts: ['Quito: desde 63 $ por escupir chicle', 'Arraiján: prohibido tirar chicle al suelo', 'La Habana: hasta 3.000 pesos cubanos'], bubble: ['hero', '¡El Caribe también vigila!'] });
stop({ ids: ['CH'], cat: 'fine', pad: 0.4, name: 'Suiza', tag: 'TODO EL PAÍS', title: '80 francos por tirar un chicle', pills: ['80 CHF'],
  texts: ['Multa única nacional desde agosto de 2026', 'La ley pone el chicle como ejemplo'], bubble: ['CH', '¡Puntuales y limpios!'] });
stop({ ids: ['SE'], cat: 'fine', pad: 0.2, name: 'Suecia', tag: 'DESDE 2022', title: '800 coronas por un chicle en el suelo', pills: ['800 SEK'],
  texts: ['Unos 70 €', 'Allí hay «chicles» de resina de 10.000 años'], bubble: ['hero', '¡10.000 años! ¡Más que mi tatarabuelo!'] });
stop({ len: 9, ids: ['AT'], cat: 'fine', at: { AT: geo(16.37, 48.21) }, pad: 0.35, name: 'Austria', tag: 'VIENA', title: '70 € por tirar basura', pills: ['70 €'], labels: ['VIENA'],
  texts: ['Los «Waste Watchers» patrullan la ciudad', 'Y te hacen recoger lo que tiras'] });
v.region(s1, T, 'Multa pequeña');

// =================== 3) MULTA DURA (≥ 100 €) ===================
s0 = section(8, 'hard', '¡LAS MULTAS DURAS!', '100 € o más', '¡Esto ya se pone serio!');
v.subscribe(s0 + 3.9, s0 + 7.9, true);
const s2 = T;
stop({ ids: ['FR'], cat: 'hard', pad: 0.3, name: 'Francia', tag: 'TODO EL PAÍS', title: '135 € por tirar un chicle', pills: ['135 €'],
  texts: ['La misma multa que una colilla', 'Multa fija en toda Francia'], bubble: ['FR', '¡Oh là là! ¡Eso no se tira!'] });
stop({ ids: ['IT'], cat: 'hard', pad: 0.25, name: 'Italia', tag: 'LEY DE 2025', title: 'De 80 a 320 € por tirar un chicle', pills: ['320 €'],
  texts: ['Lo mismo que por una colilla', 'Desde el coche: de 216 a 866 €'], bubble: ['IT', '¡Mamma mia, qué multa!'] });
stop({ len: 11, ids: ['BE', 'NL'], cat: 'hard', cam: geoBox(1, 49.3, 8, 53.8), pad: 0, name: 'Bélgica y Países Bajos', tag: 'BRUSELAS Y RÓTERDAM', title: 'Hasta 200 € por un chicle', pills: ['200 €', '160 €'],
  texts: ['Bruselas: 200 € (antes eran 100 €)', 'Róterdam: 160 € por tirar basura'], bubble: ['hero', '¡Han doblado la multa!'] });
stop({ len: 9, ids: ['PL'], cat: 'hard', pad: 0.3, name: 'Polonia', tag: 'TODO EL PAÍS', title: 'Mínimo 500 eslotis', pills: ['500 PLN'],
  texts: ['Unos 118 €', 'Pegar chicle cuenta como ensuciar'] });
stop({ ids: ['DE'], cat: 'hard', at: { DE: geo(13.4, 52.52) }, pad: 0.2, name: 'Alemania', tag: 'BERLÍN', title: '55 € de aviso… y hasta 500 €', pills: ['500 €'], labels: ['BERLÍN'],
  texts: ['Si no pagas a tiempo: de 250 a 500 €', 'La multa crece como un globo'], bubble: ['hero', '¡Paga rápido o sube!'] });
stop({ len: 9, ids: ['IE'], cat: 'hard', pad: 0.35, name: 'Irlanda', tag: 'DESDE SEPTIEMBRE DE 2026', title: '250 € por tirar basura', pills: ['250 €'],
  texts: ['Antes eran 150 €', 'La acaban de subir'] });
stop({ len: 12, ids: ['GB'], cat: 'hard', pad: 0.25, name: 'Reino Unido', tag: 'INGLATERRA · DESDE 2023', title: 'Hasta 500 £ por tirar un chicle', pills: ['500 £'],
  texts: ['Y hasta 2.500 £ si llega a juicio', 'El 87 % de las calles tienen manchas de chicle', 'Limpiarlo cuesta unos 7 millones de £ al año'], bubble: ['GB', '¡Estamos hartos de manchas!'] });
stop({ len: 11, ids: ['ES'], cat: 'hard', pad: 0.3, name: 'España', tag: 'VALENCIA Y GETAFE', title: 'Hasta 1.500 € por tirar chicle', pills: ['1.500 €'],
  texts: ['Cada ayuntamiento pone su multa', 'De las más caras de Europa'], bubble: ['hero', '¡1.500 euros por mí!'] });
stop({ ids: ['TR'], cat: 'hard', pad: 0.25, name: 'Turquía', tag: 'TODO EL PAÍS · 2026', title: '8.700 liras por tirar basura', pills: ['8.700 TRY'],
  texts: ['Unos 170 €', 'Si repites en 3 años, se duplica'], bubble: ['TR', '¡Y la segunda vez, el doble!'] });
stop({ len: 13, ids: ['SA', 'QA', 'AE'], cat: 'hard', at: { QA: geo(51.2, 25.3) }, cam: geoBox(34, 14, 60, 32), pad: 0, name: 'El Golfo', tag: 'ARABIA SAUDÍ · CATAR · EMIRATOS', title: '500 por tirar basura', pills: ['500 SAR', '500 QAR', '500 AED'],
  texts: ['Arabia Saudí: 500 riales', 'Catar: 500 riales por escupir en la calle', 'Dubái: 100 dírhams por mascarlo en el metro'], bubble: ['hero', '¡¿Ni mascarme en el metro?!'] });
stop({ ids: ['HK'], cat: 'hard', at: { HK: geo(114.17, 22.32) }, cam: geoBox(110, 19, 118, 25.5), pad: 0, name: 'Hong Kong', tag: 'MULTA FIJA', title: '3.000 HK$ por tirar basura', pills: ['3.000 HK$'],
  texts: ['Unos 350 €', 'En 2024 pusieron casi 32.000 multas'], bubble: ['HK', '¡32.000 multas en un año!'] });
stop({ len: 11, ids: ['MY'], cat: 'hard', pad: 0.2, name: 'Malasia', tag: 'TODO EL PAÍS', title: 'Hasta 2.000 ringgit', pills: ['2.000 MYR'],
  texts: ['Unos 400 €', 'Y desde 2026, a barrer las calles'], bubble: ['MY', '¡Y mi vecino es todavía peor…!'] });
stop({ ids: ['CA'], cat: 'hard', at: { CA: geo(-79.38, 43.65) }, cam: geoBox(-92, 38, -66, 52), pad: 0, name: 'Canadá', tag: 'TORONTO', title: '500 dólares por tirar basura', pills: ['500 CAD'], labels: ['TORONTO'],
  texts: ['Unos 310 €', 'Lo dice su ordenanza de basura'], bubble: ['hero', '¡Qué frío… y qué caro!'] });
stop({ len: 11, ids: ['MX'], cat: 'hard', at: { MX: geo(-99.1, 19.4) }, pad: 0.15, name: 'México', tag: 'CIUDAD DE MÉXICO', title: 'Multa, trabajo comunitario… o arresto', pills: ['ARRESTO'],
  texts: ['«Chicle» viene del náhuatl «tzictli»', 'Tirarlo a la calle es una falta cívica'], bubble: ['hero', '¡Hasta en mi propia tierra!'], moods: ['worried'] });
stop({ ids: ['CO'], cat: 'hard', at: { CO: geo(-74.07, 4.65) }, pad: 0.2, name: 'Colombia', tag: 'BOGOTÁ · 2026', title: '933.816 pesos por arrojar basura', pills: ['933.816 $'],
  texts: ['Casi un millón de pesos', 'Código Nacional de Policía'], bubble: ['CO', '¡Parcero, a la caneca!'] });
stop({ ids: ['PE'], cat: 'hard', at: { PE: geo(-79.03, -8.11) }, pad: 0.2, name: 'Perú', tag: 'TRUJILLO', title: '1.375 soles por tirar basura', pills: ['1.375 S/'], labels: ['TRUJILLO'],
  texts: ['Un 25 % de la UIT de 2026', 'Unos 345 €'], bubble: ['hero', '¡Uf, eso es mucho!'] });
stop({ ids: ['CL'], cat: 'hard', at: { CL: geo(-70.6, -33.45) }, pad: 0.05, name: 'Chile', tag: 'ÑUÑOA (SANTIAGO)', title: 'Hasta 5 UTM por tirar un chicle', pills: ['5 UTM'],
  texts: ['La ordenanza nombra el chicle', 'Junto a colillas y otras incivilidades'], bubble: ['CL', '¡Aquí te nombramos, chicle!'] });
v.subscribe(s2 + 70, s2 + 76.5);
v.region(s2, T, 'Multa dura');

// =================== 4) EL ÚNICO: SINGAPUR (34 s) ===================
{ const t = blk(34), e = t + 34, SG: [number, number] = geo(103.82, 1.35);
  v.region(t, e, '¿Y el que lo prohíbe?');
  v.cam(t - 0.3, geoBox(92, -10, 118, 12), { dur: 1.7, ...FR, pad: 0 });
  v.heroMood(t + 0.4, 'terror');
  v.bubble(t + 0.6, t + 3.6, 'hero', '¿Y el único que me prohíbe…?', { side: 'right' });
  v.cam(t + 2.4, geoBox(100.5, -1, 107, 5), { dur: 1.7, ...FR, pad: 0 });
  v.suspense(t + 4.4, 0.9); // redoble largo hasta el gran veredicto
  v.rope(t + 3.8, e - 0.2, 'SG', '#FF4B3E', SG);
  v.flag(t + 4.2, ['SG'], 0.3);
  v.fx(t + 4.2, 'pulse', { id: 'SG', at: SG, color: '#FF4B3E' });
  v.fx(t + 4.5, 'pulse', { id: 'SG', at: SG, color: '#FF4B3E' });
  v.face(t + 4.3, e + 0.1, 'SG', 'angry', { scale: 1.35, at: SG });
  v.tag(t + 4.2, e - 0.2, 'SG', 'SINGAPUR', SG);
  v.ribbon(t + 4.4, t + 8.0, '¡SINGAPUR: PROHIBIDO!', C.no, 'desde 1992', '✕');
  v.flash(t + 4.4, '#FF4B3E'); v.shake(t + 4.45, 26); v.s2(t + 4.4, 'boom', 0.3); v.s2(t + 4.8, 'crowd_ohh', 0.4);
  v.heroMood(t + 4.6, 'shocked');
  count(t + 4.6, 'ban', 1); seen.ban.push('SG');
  rows.push({ t: t + 4.7, flag: 'SG', name: 'Singapur', pill: 'PROHIBIDO', color: C.no });
  v.info(t + 4.6, t + 18.8, { flag: 'SG', name: 'Singapur', tag: 'EL ÚNICO PAÍS DEL MUNDO', chip: 'PROHIBIDO', chipColor: C.no, label: 'VENDERLO', labelColor: C.no, title: 'Prohibido desde el 3 de enero de 1992',
    texts: ['Venderlo: hasta 2.000 S$ de multa', '¿Por qué? Atascaba las puertas del metro', 'Desde 2004: solo chicle medicinal en farmacia'] });
  v.bubble(t + 8.4, t + 12.4, 'SG', '¡Aquí ni lo intentes!', { side: 'right', at: SG });
  v.heroMood(t + 12.5, 'cry');
  v.bubble(t + 12.6, t + 18.5, 'hero', '¡Snif! ¿Y yo qué hice?', { side: 'right' });
  v.info(t + 19.0, e - 0.3, { flag: 'SG', name: 'Singapur', tag: 'Y SI LO TIRAS AL SUELO', chip: 'RÉCORD', chipColor: C.no, label: 'MULTA', labelColor: C.no, title: 'Hasta 2.000 S$… y 10.000 S$ si repites',
    texts: ['Y hasta 12 horas limpiando calles', 'Puedes traer un poco para ti, pero no venderlo'] });
  v.ribbon(t + 19.6, t + 23.0, '¡HASTA 10.000 S$!', C.no, 'si reincides', '!');
  v.shake(t + 19.65, 18); v.s2(t + 19.6, 'error', 0.45);
  v.heroMood(t + 19.8, 'terror');
  v.bubble(t + 23.4, t + 28.4, 'hero', '¡Mi peor enemigo del mapa!', { side: 'right' });
  v.heroMood(t + 28.6, 'angry');
  v.bubble(t + 28.8, e - 0.4, 'SG', '¡Y las calles, impecables!', { side: 'right', at: SG });
  v.fill(e, ['SG'], C.no, 0.3);
  v.face(e + 0.1, DUR, 'SG', 'angry', { scale: 0.6, at: SG }); }

// =================== RESULTADO FINAL (24 s) ===================
{ const t = blk(24);
  v.region(t, t + 24, 'Resultado final');
  v.cam(t - 0.3, WORLD, { dur: 1.8, ...FR, pad: 0 });
  v.results(t + 0.6, t + 23.6, 'SOLO 1 PAÍS PROHÍBE EL CHICLE', [
    { label: 'PROHIBIDO', color: C.no, ids: seen.ban },
    { label: 'MULTA DURA', color: C.orange, ids: seen.hard },
    { label: 'MULTA', color: C.purple, ids: seen.fine },
    { label: 'PERMITIDO', color: C.yes, ids: seen.ok, count: 193 - 1 - cnt(seen.hard) - cnt(seen.fine) },
  ], 'pero en muchos te multan si lo tiras al suelo');
  // marcadores finales sobre 193 países
  const fin = t + 0.6;
  led.ok.push({ t: fin, v: 193 - 1 - n.hard - n.fine }); vs.push({ t: fin, l: 1, r: 192 });
  v.fx(t + 1.0, 'confetti'); v.s2(t + 1.0, 'confirm', 0.4); v.s2(t + 1.2, 'crowd_roar', 0.25);
  v.heroMood(t + 1.0, 'happy');
  v.bubble(t + 3.0, t + 11.5, 'hero', '¡Solo 1 país me prohíbe!', { side: 'right' });
  v.heroMood(t + 12.0, 'worried');
  v.bubble(t + 12.2, t + 23.4, 'hero', '…pero mejor, ¡a la papelera!', { side: 'right' }); }

// =================== CIERRE ===================
{ const t = blk(DUR - T);
  v.outro(t, DUR - 0.4, '¿En tu país multan por tirar chicle? ¡Comenta!');
  v.heroMood(t + 0.2, 'wow');
  v.bubble(t + 1.5, DUR - 0.8, 'hero', '¡Suscríbete para más mapas!', { side: 'right' }); }
if (T > DUR + 0.01 || DUR - T > 0.01) console.warn('chicle: cursor final', T, '≠ DUR', DUR);

// ---------- HUD ----------
v.versusBar({ t0: 22.2, t1: DUR, left: 'PROHIBIDO', right: 'PERMITIDO', lc: C.no, rc: C.yes, steps: vs.map((s) => ({ ...s, t: Math.max(s.t, 22.2) })) });
v.led({ t0: 22.2, t1: DUR, cells: [
  { label: 'PROHIBIDO', color: '#FF5A4E', steps: led.ban },
  { label: 'MULTA DURA', color: '#FF9F43', steps: led.hard },
  { label: 'MULTA', color: '#B78CFF', steps: led.fine },
  { label: 'PERMITIDO', color: '#4BE07F', steps: led.ok, digits: 3 },
] });
v.list(32, DUR, rows.sort((a, b) => a.t - b.t), 6);

export const chicle = v.end(DUR, 'Gobiernos y ayuntamientos de cada país · NEA Singapur · UNESCO · Univ. de Copenhague · prensa local (ver descripción)');

// ---------- 5 miniaturas ----------
export const chicleThumbs: ThumbV[] = [
  { layout: 'hero', top: '¿DÓNDE ESTÁ *PROHIBIDO*', bottom: '*EL CHICLE?*', accent: '#FF4B3E', bg: { kind: 'map', view: geoBox(85, -12, 125, 22), flags: ['SG', 'MY', 'ID', 'TH', 'VN', 'KH', 'PH'], faces: ['MY', 'ID', 'TH', 'VN'] }, hero: { kind: 'object', name: 'gum', mood: 'terror', glow: '#FF4B3E' }, x: 640, y: 372, size: 470 },
  { layout: 'versus', top: '¿SOLO *1 PAÍS* LO PROHÍBE?', accent: '#FFD23F', left: { hero: { kind: 'object', name: 'gum', mood: 'cry', glow: '#FF8DC0' }, bg: { kind: 'sea' }, label: 'CHICLE', labelColor: '#FF8DC0' }, right: { hero: { kind: 'object', name: 'ban', mood: 'angry', glow: '#FF3B30', face: 0.4 }, bg: { kind: 'dark' }, label: 'SINGAPUR', labelColor: '#FF4B3E' }, size: 500 },
  { layout: 'number', top: '¡MULTA POR UN *CHICLE*!', big: '10.000$', bigColor: '#FF4B3E', accent: '#FF4B3E', bg: { kind: 'map', view: geoBox(85, -12, 125, 22), flags: ['SG', 'MY', 'ID'] }, hero: { kind: 'object', name: 'gum', mood: 'shocked', glow: '#FFFFFF' }, size: 460 },
  { layout: 'hero', top: '*PROHIBIDO* EN', bottom: '*¿QUÉ PAÍS?*', accent: '#FF4B3E', bg: { kind: 'dark' }, hero: { kind: 'object', name: 'ban', glow: '#FF2D2D', mood: 'angry', face: 0.4 }, x: 640, y: 372, size: 470, rays: false },
  { layout: 'grid', top: '¿DÓNDE TE *MULTAN*', bottom: '*POR UN CHICLE?*', accent: '#FFD23F', bg: { kind: 'sea' }, grid: { ids: ['SG', 'GB', 'FR', 'ES', 'TH', 'MX'], moods: ['angry', 'terror', 'shocked', 'evil', 'angry', 'cry'] } },
];
