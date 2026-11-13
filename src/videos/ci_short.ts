// SHORT (30 s, vertical) de "¿Qué países tienen el CI más alto?" — plantilla habitantes_short.ts.
// Gancho: quiz EE. UU. / Alemania / Irán y la pregunta del n.º 1.
import { Video, type Mood } from '../engine/builder';
import { C } from '../engine/theme';
import { geoBox, nameOf } from '../engine/world';
import { CI_MUSIC, CI_DATA } from './ci';

const { q } = CI_DATA;
const v = new Video('ci-short', '¿Qué países tienen el CI más alto? (Short)').setFps(60).short();
const DUR = 30;
v.soundtrack(DUR, [CI_MUSIC[0]], 0.3);
const FR = { left: 0.04, right: 0.12, top: 0.34, bottom: 0.36 };
const vs: { t: number; l: number; r: number }[] = [{ t: 0, l: 0, r: 0 }];
let hi = 0, lo = 0;

// ---------- gancho (0–3 s) ----------
v.hero(0.1, DUR, 'brain', { obj: 'brain', x: 200, y: 520, size: 270, label: 'CEREBRO', mood: 'worried' });
v.cam(0, geoBox(-150, -45, 160, 72), { dur: 0, ...FR, pad: 0 });
v.title2(0.05, 1.5, ['¿EE. UU., Alemania', 'o *IRÁN*?'], [C.gold, C.yes]);
v.title2(1.5, 3.0, ['¿Qué país tiene', 'el *CI* más alto?'], [C.gold, C.yes], [{ text: 'test online IIT · 2025', color: C.teal }]);
v.heroMood(1.5, 'wow');

type Stop = { t: number; len: number; id: string; hi: boolean; mood: Mood; color: string; cam?: [number, number, number, number]; pad?: number; tag: string; text: string; ribbon: string; bubble?: string; long?: boolean };
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
  v.info(o.t + 0.4, e - 0.1, { flag: o.id, name: nameOf(o.id), tag: o.tag, chip: q(o.id), chipColor: o.color, chipAt: tc, hideTitle: true, label: 'CI MEDIO', labelColor: o.color, title: `${q(o.id)} de media`, texts: [o.text] });
  v.heroMood(o.t + 0.5, 'wow');
  if (o.bubble) v.bubble(o.t + 0.9, tc - 0.1, o.id, o.bubble, { side: 'right' });
  v.suspense(tc, 0.8, !o.long);
  v.ribbon(tc, e - 0.15, o.ribbon, o.color, 'de CI medio', '★');
  v.heroMood(tc + 0.1, 'shocked');
  v.fill(e, [o.id], o.color, 0.3);
  v.face(e + 0.1, DUR, o.id, 'dots', { scale: 0.55 });
  if (o.hi) hi++; else lo++;
  vs.push({ t: tc, l: hi, r: lo });
  return tc;
};

stop({ t: 3.0, len: 4.6, id: 'MX', hi: false, mood: 'happy', color: C.teal, pad: 0.12, tag: 'TEST IIT 2025', text: 'Casi igual que Costa Rica', ribbon: '¡93,6!', bubble: '¿Cuánto sacamos?' });
stop({ t: 7.6, len: 4.6, id: 'US', hi: true, mood: 'happy', color: C.purple, pad: 0.06, tag: 'TEST IIT 2025', text: '¡Por encima de 100!', ribbon: '¡101,0!', bubble: '¿Aprobado?' });
stop({ t: 12.2, len: 4.6, id: 'ES', hi: true, mood: 'proud', color: C.purple, pad: 0.15, tag: 'N.º 1 DE LA UE', text: '¡El más alto de la UE!', ribbon: '¡102,2!', bubble: '¿Y yo?' });
stop({ t: 16.8, len: 4.6, id: 'JP', hi: true, mood: 'proud', color: C.yes, cam: geoBox(128, 30, 146, 45), pad: 0, tag: 'N.º 3 DE LOS PAÍSES', text: '¡Top 3 del mundo!', ribbon: '#3: ¡106,3!', bubble: '¿Seré el n.º 1?' });
const tKR = stop({ t: 21.4, len: 6.2, id: 'KR', hi: true, mood: 'proud', color: C.yes, cam: geoBox(123, 33, 132, 39.5), pad: 0, tag: 'N.º 1 DE LOS PAÍSES', text: '¡El CI medio más alto!', ribbon: '#1: ¡107,0!', long: true });
v.flash(tKR, '#4BE07F'); v.shake(tKR + 0.05, 18); v.fx(tKR + 0.1, 'confetti'); v.s2(tKR + 0.2, 'crowd_roar', 0.3);
v.bubble(tKR + 0.5, 27.4, 'hero', '¡Corea del Sur, n.º 1!', { side: 'right' });

// ---------- cierre ----------
v.cam(27.4, geoBox(-12, 30, 40, 62), { dur: 1.4, ...FR, pad: 0 });
v.ribbon(27.8, 29.9, '¡VÍDEO COMPLETO!', C.purple, 'en el canal', '▶');
v.heroMood(27.8, 'happy');
v.bubble(28.1, 29.9, 'hero', '¿Y tu país? ¡Comenta!', { side: 'right' });

v.versusBar({ t0: 3.0, t1: DUR, left: '+100', right: '-100', lc: C.yes, rc: C.orange, steps: vs.map((s) => ({ ...s, t: Math.max(s.t, 3.0) })) });

export const ciShort = v.end(DUR, 'International IQ Test (2025) · test online');
