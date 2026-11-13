// SHORT (30 s, vertical 1080x1920) de "¿Qué países DEBEN más DINERO?" — plantilla iphone_short.ts.
// Datos: research/deuda.md (FMI, WEO oct. 2026, deuda pública bruta % PIB, año 2025).
// Gancho propio: arranca en seco con la cifra de EE. UU. y luego la pregunta.
import { Video, type Mood } from '../engine/builder';
import { C } from '../engine/theme';
import { geoBox, nameOf } from '../engine/world';
import { DEUDA_MUSIC } from './deuda';

const v = new Video('deuda-short', '¿Qué países DEBEN más DINERO? (Short)').setFps(60).short();
const DUR = 30;
v.soundtrack(DUR, [DEUDA_MUSIC[0]], 0.3);
const FR = { left: 0.04, right: 0.12, top: 0.34, bottom: 0.36 };

type Cat = 'top' | 'good' | 'mid' | 'low';
const CAT: Record<Cat, { color: string; label: string; mood: Mood; hero: Mood }> = {
  top: { color: C.yes, label: '-40 % PIB', mood: 'cool', hero: 'happy' },
  good: { color: C.purple, label: '40-80 % PIB', mood: 'happy', hero: 'happy' },
  mid: { color: C.orange, label: '80-120 % PIB', mood: 'worried', hero: 'worried' },
  low: { color: C.no, label: '+120 % PIB', mood: 'cry', hero: 'shocked' },
};
const vs: { t: number; l: number; r: number }[] = [{ t: 0, l: 0, r: 0 }];
let lo = 0, hi = 0;

// ---------- gancho en seco (0–3 s) ----------
v.hero(0.1, DUR, 'bill', { obj: 'bill', x: 200, y: 520, size: 270, label: 'DEUDA', mood: 'shocked' });
v.cam(0, ['US'], { dur: 0, ...FR, pad: 0.05 });
v.cam(0.01, ['US'], { dur: 1.4, ...FR, pad: 0.02 });
v.fill(0.05, ['US'], C.no, 0.25);
v.title2(0.15, 1.45, ['¡*38 BILLONES $*!', 'debe EE. UU.'], [C.no, C.gold]);
v.s2(0.15, 'boom', 0.35); v.shake(0.18, 12);
v.fill(1.5, ['US'], C.land, 0.3);
v.title2(1.5, 3.0, ['¿Quién *DEBE*', 'más *DINERO*?'], [C.no, C.no], [{ text: '% de su PIB · FMI', color: C.teal }]);
v.heroMood(1.5, 'wow');

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
  v.info(o.t + 0.4, e - 0.1, { flag: o.id, name: nameOf(o.id), tag: o.tag, chip: k.label, chipColor: k.color, chipAt: tc, hideTitle: true, label: 'DEUDA PÚBLICA', labelColor: k.color, title: o.title, texts: [o.text] });
  v.heroMood(o.t + 0.5, 'wow');
  if (o.bubble) v.bubble(o.t + 0.9, tc - 0.1, o.id, o.bubble, { side: 'right' });
  v.suspense(tc, 0.8, !o.long);
  v.ribbon(tc, e - 0.15, o.ribbon, k.color, 'de su PIB', '$');
  v.heroMood(tc + 0.1, k.hero);
  v.fill(e, [o.id], k.color, 0.3);
  v.face(e + 0.1, DUR, o.id, 'dots', { scale: 0.55 });
  if (o.cat === 'mid' || o.cat === 'low') lo++; else hi++;
  vs.push({ t: tc, l: lo, r: hi });
  return tc;
};

stop({ t: 3.0, len: 4.6, id: 'MX', cat: 'good', pad: 0.12, tag: 'FMI 2025', title: '61,7 % del PIB', text: 'Deuda: 1,1 billones $', ribbon: '¡61,7 %!', bubble: '¿Cuánto debo yo?' });
stop({ t: 7.6, len: 4.6, id: 'ES', cat: 'mid', pad: 0.15, tag: 'FMI 2025', title: '100,5 % del PIB', text: '¡Debe más de lo que produce!', ribbon: '¡100,5 %!', bubble: '¿Más de un año entero?' });
stop({ t: 12.2, len: 4.6, id: 'RU', cat: 'top', pad: 0.02, tag: 'FMI 2025', title: '16,6 % del PIB', text: 'Muy poca deuda pese a la guerra', ribbon: '¡16,6 %!', bubble: '¡Verde!' });
stop({ t: 16.8, len: 4.6, id: 'GR', cat: 'low', pad: 0.3, tag: '#5 DEL MUNDO', title: '146,6 % del PIB', text: '3 rescates entre 2010 y 2018', ribbon: '¡146,6 %!', bubble: '¡El que más de Europa!' });
const tJP = stop({ t: 21.4, len: 6.2, id: 'JP', cat: 'low', cam: geoBox(128, 30, 146, 45), pad: 0, tag: '#1 DEL MUNDO', title: '204,8 % del PIB', text: '¡El doble de todo lo que produce!', ribbon: '#1: ¡204,8 %!', long: true });
v.flash(tJP, '#FF5A4E'); v.shake(tJP + 0.05, 20); v.fx(tJP + 0.1, 'confetti'); v.s2(tJP + 0.2, 'crowd_roar', 0.3);
v.bubble(tJP + 0.5, 27.4, 'hero', '¡9,1 billones de dólares!', { side: 'right' });

// ---------- cierre (27,4–30 s) ----------
v.cam(27.4, geoBox(-12, 30, 40, 62), { dur: 1.4, ...FR, pad: 0 });
v.ribbon(27.8, 29.9, '¡VÍDEO COMPLETO!', C.purple, 'en el canal', '▶');
v.heroMood(27.8, 'happy');
v.bubble(28.1, 29.9, 'hero', '¿Y tu país? ¡Comenta!', { side: 'right' });

v.versusBar({ t0: 3.0, t1: DUR, left: '+80 %', right: '-80 %', lc: C.orange, rc: C.yes, steps: vs.map((s) => ({ ...s, t: Math.max(s.t, 3.0) })) });

export const deudaShort = v.end(DUR, 'FMI, World Economic Outlook (oct. 2026)');
