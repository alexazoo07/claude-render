// SHORT (30 s, vertical 1080x1920) de "¿Cuántas HORAS tienes que trabajar para comprarte un iPHONE?" — plantilla dinero_short.ts.
// Datos: research/iphone.md (precio iPhone 17 256 GB nov. 2026 ÷ sueldo medio por hora).
import { Video, type Mood } from '../engine/builder';
import { C } from '../engine/theme';
import { geoBox, nameOf } from '../engine/world';

const v = new Video('iphone-short', '¿Cuántas HORAS trabajas por un iPHONE? (Short)').setFps(60).short();
const DUR = 30;
v.soundtrack(DUR, ['life_of_riley'], 0.36);
const FR = { left: 0.04, right: 0.12, top: 0.34, bottom: 0.36 };

type Cat = 'top' | 'good' | 'mid' | 'low';
const CAT: Record<Cat, { color: string; label: string; mood: Mood; hero: Mood }> = {
  top: { color: C.yes, label: '-50 HORAS', mood: 'cool', hero: 'love' },
  good: { color: C.purple, label: '50-150 HORAS', mood: 'happy', hero: 'happy' },
  mid: { color: C.orange, label: '150-500 HORAS', mood: 'worried', hero: 'worried' },
  low: { color: C.no, label: '+500 HORAS', mood: 'cry', hero: 'cry' },
};
const vs: { t: number; l: number; r: number }[] = [{ t: 0, l: 0, r: 0 }];
let lo = 0, hi = 0;

// ---------- gancho (0–3 s) ----------
v.cam(0, geoBox(-105, -12, -60, 38), { dur: 0, ...FR, pad: 0 });
v.cam(0.01, geoBox(-105, -12, -60, 38), { dur: 3, ...FR, pad: 0, zoom: 1.08 });
v.hero(0.1, DUR, 'phone', { obj: 'phone', x: 200, y: 520, size: 270, label: 'iPHONE', mood: 'wow' });
v.title2(0.1, 3.0, ['¿Cuántas *HORAS*', 'trabajas por', 'un *iPHONE*?'], [C.gold, C.gold, C.yes], [{ text: 'país por país', color: C.purple }]);
v.bubble(0.6, 2.9, 'hero', '¿Cuánto te cuesto?', { side: 'right' });

type Stop = { t: number; len: number; id: string; cat: Cat; cam?: [number, number, number, number]; pad?: number; tag: string; title: string; text: string; ribbon: string; bubble?: string; long?: boolean };
const stop = (o: Stop) => {
  const k = CAT[o.cat], e = o.t + o.len, tc = e - (o.long ? 3.6 : 1.6);
  v.cam(o.t - 0.3, o.cam ?? [o.id], { dur: 1.2, ...FR, pad: o.pad ?? 0.2 });
  v.rope(o.t + 0.15, e - 0.1, o.id, '#FFFFFF');
  v.flag(o.t + 0.4, [o.id], 0.3);
  v.fx(o.t + 0.45, 'pulse', { id: o.id, color: '#FFFFFF' });
  v.s2(o.t + 0.45, 'pop', 0.5);
  v.face(o.t + 0.5, tc + 0.1, o.id, 'wow', { scale: o.long ? 1.4 : 1.0 });
  v.face(tc + 0.1, e + 0.1, o.id, k.mood, { scale: o.long ? 1.4 : 1.0 });
  v.tag(o.t + 0.4, e - 0.1, o.id, nameOf(o.id).toUpperCase());
  v.info(o.t + 0.4, e - 0.1, { flag: o.id, name: nameOf(o.id), tag: o.tag, chip: k.label, chipColor: k.color, chipAt: tc, hideTitle: true, label: 'HORAS DE TRABAJO', labelColor: k.color, title: o.title, texts: [o.text] });
  v.heroMood(o.t + 0.5, 'wow');
  if (o.bubble) v.bubble(o.t + 0.9, tc - 0.1, o.id, o.bubble, { side: 'right' });
  v.suspense(tc, 0.8, !o.long);
  v.ribbon(tc, e - 0.15, o.ribbon, k.color, 'por un iPhone', 'h');
  v.heroMood(tc + 0.1, k.hero);
  v.fill(e, [o.id], k.color, 0.3);
  v.face(e + 0.1, DUR, o.id, 'dots', { scale: 0.55 });
  if (o.cat === 'mid' || o.cat === 'low') lo++; else hi++;
  vs.push({ t: tc, l: lo, r: hi });
  return tc;
};

stop({ t: 3.0, len: 4.6, id: 'MX', cat: 'mid', pad: 0.12, tag: 'SUELDO OIT 2025', title: '356 horas', text: 'iPhone 17: 21.999 pesos', ribbon: '¡356 HORAS!', bubble: '¿Cuántas me tocan?' });
stop({ t: 7.6, len: 4.6, id: 'ES', cat: 'good', pad: 0.15, tag: 'EUROSTAT 2025', title: '65,6 horas', text: 'iPhone 17: 1.109 €', ribbon: '¡65,6 HORAS!', bubble: '¡Venga, que no es tanto!' });
stop({ t: 12.2, len: 4.6, id: 'IN', cat: 'low', pad: 0.12, tag: 'SUELDO OIT 2025', title: '1.089 horas', text: '¡Medio año de trabajo!', ribbon: '¡1.089 HORAS!', bubble: '¡Si aquí se fabrican!' });
stop({ t: 16.8, len: 4.6, id: 'US', cat: 'top', pad: 0.08, tag: '#2 DEL MUNDO', title: '21,4 horas', text: '929 $ · sueldo: 43,49 $/h', ribbon: '¡21,4 HORAS!', bubble: '¿Solo segundos?' });
const tCH = stop({ t: 21.4, len: 6.2, id: 'CH', cat: 'top', cam: geoBox(4.5, 44.5, 12, 49), pad: 0, tag: '#1 DEL MUNDO', title: '18,7 horas', text: '¡Pakistán: 2.866 horas!', ribbon: '#1: ¡18,7 HORAS!', long: true });
v.flash(tCH, '#FFD23F'); v.shake(tCH + 0.05, 20); v.fx(tCH + 0.1, 'confetti'); v.s2(tCH + 0.2, 'crowd_roar', 0.3);
v.bubble(tCH + 0.5, 27.4, 'hero', '¡Ni 3 días de trabajo!', { side: 'right' });

// ---------- cierre (27,6–30 s) ----------
v.cam(27.4, geoBox(-12, 30, 40, 62), { dur: 1.4, ...FR, pad: 0 });
v.ribbon(27.8, 29.9, '¡VÍDEO COMPLETO!', C.purple, 'en el canal', '▶');
v.heroMood(27.8, 'happy');
v.bubble(28.1, 29.9, 'hero', '¿Y en tu país? ¡Comenta!', { side: 'right' });

v.versusBar({ t0: 3.0, t1: DUR, left: '+150 H', right: '-150 H', lc: C.orange, rc: C.yes, steps: vs.map((s) => ({ ...s, t: Math.max(s.t, 3.0) })) });

export const iphoneShort = v.end(DUR, 'Apple Store (nov. 2026) · Sueldos: OIT y Eurostat');
