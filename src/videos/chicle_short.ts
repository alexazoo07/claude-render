// SHORT (30 s, vertical 1080x1920) de "¿Dónde está PROHIBIDO el CHICLE?" — mismo estilo que el vídeo largo.
// Estructura de Short del canal: gancho (3 s) → 4 paradas rápidas (~4,6 s, redoble corto + veredicto)
// → clímax (el caso extremo, redoble largo) → cierre que manda al vídeo completo. Datos de research/chicle_v3.md.
import { Video, type Mood } from '../engine/builder';
import { C } from '../engine/theme';
import { geo, geoBox, nameOf } from '../engine/world';

const v = new Video('chicle-short', '¿Dónde está PROHIBIDO el CHICLE? (Short)').setFps(60).short();
const DUR = 30;
v.soundtrack(DUR, ['pixel_peeker_polka'], 0.36);
// zona útil del Short: arriba el protagonista (y la interfaz de YouTube), abajo la tarjeta, a la derecha los botones
const FR = { left: 0.04, right: 0.12, top: 0.34, bottom: 0.36 };

type Cat = 'ok' | 'fine' | 'hard' | 'ban';
const CAT: Record<Cat, { color: string; label: string; ribbon: string; icon: string; card: string; mood: Mood; hero: Mood }> = {
  ok: { color: C.yes, label: 'PERMITIDO', ribbon: '¡PERMITIDO!', icon: '✓', card: 'SE VENDE', mood: 'happy', hero: 'love' },
  fine: { color: C.purple, label: 'MULTA', ribbon: '¡MULTA!', icon: '€', card: 'SI LO TIRAS', mood: 'angry', hero: 'worried' },
  hard: { color: C.orange, label: 'MULTA DURA', ribbon: '¡MULTA DURA!', icon: '!', card: 'SI LO TIRAS', mood: 'evil', hero: 'shocked' },
  ban: { color: C.no, label: 'PROHIBIDO', ribbon: '¡PROHIBIDO!', icon: '✕', card: 'VENDERLO', mood: 'angry', hero: 'cry' },
};
const vs: { t: number; l: number; r: number }[] = [{ t: 0, l: 0, r: 0 }];
let nOk = 0;

// ---------- gancho (0–3 s) ----------
v.cam(0, geoBox(-20, 20, 40, 62), { dur: 0, ...FR, pad: 0 });
v.cam(0.01, geoBox(-20, 20, 40, 62), { dur: 3, ...FR, pad: 0, zoom: 1.08 });
v.hero(0.1, DUR, 'gum', { obj: 'gum', x: 200, y: 520, size: 270, label: 'CHICLE', mood: 'wow' });
v.title2(0.1, 3.0, ['¿Dónde está', '*PROHIBIDO*', 'el *CHICLE*?'], [C.gold, '#FF4B3E', '#FF8DC0'], [{ text: 'país por país', color: C.purple }]);
v.bubble(0.6, 2.9, 'hero', '¡Yo no he hecho nada!', { side: 'right' });

// ---------- parada rápida ----------
type Stop = { t: number; len: number; id: string; cat: Cat; at?: [number, number]; cam?: [number, number, number, number]; pad?: number; tag: string; title: string; text: string; pill: string; bubble?: string; long?: boolean };
const stop = (o: Stop) => {
  const k = CAT[o.cat], e = o.t + o.len, tc = e - (o.long ? 3.6 : 1.6);
  v.cam(o.t - 0.3, o.cam ?? [o.id], { dur: 1.2, ...FR, pad: o.pad ?? 0.2 });
  v.rope(o.t + 0.15, e - 0.1, o.id, '#FFFFFF', o.at);
  v.flag(o.t + 0.4, [o.id], 0.3);
  v.fx(o.t + 0.45, 'pulse', { id: o.id, at: o.at, color: '#FFFFFF' });
  v.s2(o.t + 0.45, 'pop', 0.5);
  v.face(o.t + 0.5, e + 0.1, o.id, k.mood, { scale: o.long ? 1.4 : 1.0, at: o.at });
  v.tag(o.t + 0.4, e - 0.1, o.id, nameOf(o.id).toUpperCase(), o.at);
  v.info(o.t + 0.4, e - 0.1, { flag: o.id, name: nameOf(o.id), tag: o.tag, chip: k.label, chipColor: k.color, chipAt: tc, label: k.card, labelColor: k.color, title: o.title, texts: [o.text] });
  v.heroMood(o.t + 0.5, 'wow');
  if (o.bubble) v.bubble(o.t + 0.9, tc - 0.1, o.id, o.bubble, { side: 'right', at: o.at });
  v.suspense(tc, 0.8, !o.long); // redoble (corto en las paradas, largo en el clímax) que acaba en el veredicto
  v.ribbon(tc, e - 0.15, k.ribbon, k.color, o.pill, k.icon);
  v.heroMood(tc + 0.1, k.hero);
  v.fill(e, [o.id], k.color, 0.3);
  v.face(e + 0.1, DUR, o.id, 'dots', { scale: 0.55, at: o.at });
  if (o.cat === 'ban') vs.push({ t: tc, l: 1, r: nOk }); else vs.push({ t: tc, l: 0, r: ++nOk });
  return tc;
};

// ---------- 4 paradas (3,0–21,6 s) ----------
stop({ t: 3.0, len: 4.6, id: 'US', cat: 'ok', pad: 0.12, tag: 'EL PAÍS DEL CHICLE', title: 'Se vende en cualquier tienda', text: 'Seattle quitó 1.070 kg de su Gum Wall', pill: 'LIBRE', bubble: '¡Aquí, sin problema!' });
stop({ t: 7.6, len: 4.6, id: 'JP', cat: 'fine', at: geo(139.7, 35.66), cam: geoBox(129, 30, 146, 44), pad: 0, tag: 'TOKIO · SHIBUYA', title: '2.000 ¥ por tirar basura', text: 'Unos 12 €', pill: '2.000 ¥' });
stop({ t: 12.2, len: 4.6, id: 'GB', cat: 'hard', pad: 0.15, tag: 'INGLATERRA · DESDE 2023', title: 'Hasta 500 £ por tirar un chicle', text: 'Y hasta 2.500 £ si llega a juicio', pill: '500 £', bubble: '¡Hartos de manchas!' });
stop({ t: 16.8, len: 4.6, id: 'MY', cat: 'hard', pad: 0.12, tag: 'TODO EL PAÍS', title: 'Hasta 2.000 ringgit', text: 'Unos 400 €… ¡y a barrer calles!', pill: '2.000 MYR', bubble: '¿Y mi vecino…?' });

// ---------- clímax: SINGAPUR (21,4–27,6 s) ----------
const SG: [number, number] = geo(103.82, 1.35);
const tSG = stop({ t: 21.4, len: 6.2, id: 'SG', cat: 'ban', at: SG, cam: geoBox(101.5, -0.5, 106.5, 3.5), pad: 0, tag: 'EL ÚNICO PAÍS DEL MUNDO', title: 'Prohibido venderlo desde 1992', text: 'Multa: hasta 10.000 S$ si repites', pill: 'desde 1992', long: true });
v.flash(tSG, '#FF4B3E'); v.shake(tSG + 0.05, 20); v.fx(tSG + 0.1, 'confetti'); v.s2(tSG + 0.2, 'crowd_ohh', 0.4);
v.bubble(tSG + 0.5, 27.4, 'hero', '¡¿Por qué a mí?!', { side: 'right' });
vs.push({ t: tSG + 0.6, l: 1, r: 192 }); // de 193 países, solo 1 lo prohíbe

// ---------- cierre (27,6–30 s) ----------
v.cam(27.4, geoBox(60, -15, 150, 45), { dur: 1.4, ...FR, pad: 0 });
v.ribbon(27.8, 29.9, '¡VÍDEO COMPLETO!', C.purple, 'en el canal', '▶');
v.heroMood(27.8, 'happy');
v.bubble(28.1, 29.9, 'hero', '¿Y en tu país? ¡Comenta!', { side: 'right' });

// ---------- HUD ----------
v.versusBar({ t0: 3.0, t1: DUR, left: 'PROHIBIDO', right: 'PERMITIDO', lc: C.no, rc: C.yes, steps: vs.map((s) => ({ ...s, t: Math.max(s.t, 3.0) })) });

export const chicleShort = v.end(DUR, 'NEA Singapur · gobiernos y ayuntamientos (ver vídeo completo)');
