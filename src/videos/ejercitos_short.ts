// SHORT (30 s, vertical) de "¿Qué EJÉRCITOS son los más PODEROSOS?" — plantilla habitantes_short.ts.
// Gancho: latigazo EE. UU. / Rusia / China con "¿N.º 1?".
import { Video, type Mood } from '../engine/builder';
import { C } from '../engine/theme';
import { geoBox, nameOf } from '../engine/world';
import { EJ_MUSIC } from './ejercitos';

const v = new Video('ejercitos-short', '¿Qué EJÉRCITOS son los más PODEROSOS? (Short)').setFps(60).short();
const DUR = 30;
v.soundtrack(DUR, [EJ_MUSIC[0]], 0.3);
const FR = { left: 0.04, right: 0.12, top: 0.34, bottom: 0.36 };
const vs: { t: number; l: number; r: number }[] = [{ t: 0, l: 0, r: 0 }];
let hi = 0, lo = 0;

// ---------- gancho (0–3 s) ----------
v.hero(0.1, DUR, 'tank', { obj: 'tank', x: 200, y: 520, size: 270, label: 'EJÉRCITO', mood: 'shocked' });
v.cam(0, geoBox(-150, -45, 160, 72), { dur: 0, ...FR, pad: 0 });
v.title2(0.05, 1.5, ['¿EE. UU., Rusia', 'o *CHINA*?'], [C.gold, C.no]);
v.s2(0.1, 'boom', 0.3); v.shake(0.12, 10);
v.title2(1.5, 3.0, ['¿Qué ejército es', 'el más *PODEROSO*?'], [C.gold, C.yes], [{ text: 'Global Firepower 2026', color: C.teal }]);
v.heroMood(1.5, 'wow');

type Stop = { t: number; len: number; id: string; hi: boolean; mood: Mood; color: string; cam?: [number, number, number, number]; pad?: number; tag: string; chip: string; text: string; ribbon: string; bubble?: string; long?: boolean };
const stop = (o: Stop) => {
  const e = o.t + o.len, tc = e - (o.long ? 3.6 : 1.6);
  v.cam(o.t - 0.3, o.cam ?? [o.id], { dur: 1.2, ...FR, pad: o.pad ?? 0.2 });
  v.rope(o.t + 0.15, e - 0.1, o.id, '#FFFFFF');
  v.flag(o.t + 0.4, [o.id], 0.3);
  v.fx(o.t + 0.45, 'pulse', { id: o.id, color: '#FFFFFF' });
  v.s2(o.t + 0.45, 'pop', 0.5);
  v.face(o.t + 0.5, tc + 0.1, o.id, 'wow', { scale: o.long ? 1.4 : 1.0 });
  v.face(tc + 0.1, e + 0.1, o.id, o.mood, { scale: o.long ? 1.4 : 1.0 });
  v.tag(o.t + 0.4, e - 0.1, o.id, nameOf(o.id).toUpperCase());
  v.info(o.t + 0.4, e - 0.1, { flag: o.id, name: nameOf(o.id), tag: o.tag, chip: o.chip, chipColor: o.color, chipAt: tc, hideTitle: true, label: 'EJÉRCITO', labelColor: o.color, title: o.chip, texts: [o.text] });
  v.heroMood(o.t + 0.5, 'wow');
  if (o.bubble) v.bubble(o.t + 0.9, tc - 0.1, o.id, o.bubble, { side: 'right' });
  v.suspense(tc, 0.8, !o.long);
  v.ribbon(tc, e - 0.15, o.ribbon, o.color, 'de 145 ejércitos', '★');
  v.heroMood(tc + 0.1, 'shocked');
  v.fill(e, [o.id], o.color, 0.3);
  v.face(e + 0.1, DUR, o.id, 'dots', { scale: 0.55 });
  if (o.hi) hi++; else lo++;
  vs.push({ t: tc, l: hi, r: lo });
  return tc;
};

stop({ t: 3.0, len: 4.6, id: 'MX', hi: false, mood: 'shocked', color: C.orange, pad: 0.12, tag: 'GLOBAL FIREPOWER', chip: 'Puesto 36', text: 'Brasil es el n.º 1 de Latinoamérica', ribbon: '¡N.º 36!', bubble: '¿Qué puesto tengo?' });
stop({ t: 7.6, len: 4.6, id: 'ES', hi: true, mood: 'proud', color: C.purple, pad: 0.15, tag: 'GLOBAL FIREPOWER', chip: 'Puesto 18', text: 'Por delante de Egipto y Ucrania', ribbon: '¡N.º 18!', bubble: '¿Y yo?' });
stop({ t: 12.2, len: 4.6, id: 'CN', hi: true, mood: 'cool', color: C.yes, pad: 0.1, tag: 'N.º 3 DEL MUNDO', chip: 'Puesto 3', text: '¡Top 3 del mundo!', ribbon: '¡N.º 3!', bubble: '¿Seré el n.º 1?' });
stop({ t: 16.8, len: 4.6, id: 'RU', hi: true, mood: 'angry', color: C.yes, pad: 0.05, tag: 'N.º 2 DEL MUNDO', chip: 'Puesto 2', text: '¡Casi el primero!', ribbon: '¡N.º 2!', bubble: '¿Solo segundo?' });
const tUS = stop({ t: 21.4, len: 6.2, id: 'US', hi: true, mood: 'cool', color: C.yes, pad: 0.06, tag: 'N.º 1 DEL MUNDO', chip: 'Puesto 1', text: '¡El ejército más poderoso!', ribbon: '¡N.º 1!', long: true });
v.flash(tUS, '#4BE07F'); v.shake(tUS + 0.05, 18); v.fx(tUS + 0.1, 'confetti'); v.s2(tUS + 0.2, 'crowd_roar', 0.3);
v.bubble(tUS + 0.5, 27.4, 'hero', '¡EE. UU., el n.º 1!', { side: 'right' });

// ---------- cierre ----------
v.cam(27.4, geoBox(-12, 30, 40, 62), { dur: 1.4, ...FR, pad: 0 });
v.ribbon(27.8, 29.9, '¡VÍDEO COMPLETO!', C.purple, 'en el canal', '▶');
v.heroMood(27.8, 'happy');
v.bubble(28.1, 29.9, 'hero', '¿Y tu país? ¡Comenta!', { side: 'right' });

v.versusBar({ t0: 3.0, t1: DUR, left: 'TOP 30', right: '31+', lc: C.yes, rc: C.no, steps: vs.map((s) => ({ ...s, t: Math.max(s.t, 3.0) })) });

export const ejercitosShort = v.end(DUR, 'Global Firepower 2026');
