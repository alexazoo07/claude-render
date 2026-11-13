// SHORT (30 s, vertical) de "¿Qué países tienen MÁS HABITANTES?" — plantilla pasaportes_short.ts.
// Gancho: contador a 8.140 MILLONES y la pregunta del n.º 1.
import { Video, type Mood } from '../engine/builder';
import { C } from '../engine/theme';
import { geoBox, nameOf } from '../engine/world';
import { HAB_MUSIC, HAB_DATA } from './habitantes';

const { RK, pm } = HAB_DATA;
const v = new Video('habitantes-short', '¿Qué países tienen MÁS HABITANTES? (Short)').setFps(60).short();
const DUR = 30;
v.soundtrack(DUR, [HAB_MUSIC[0]], 0.3);
const FR = { left: 0.04, right: 0.12, top: 0.34, bottom: 0.36 };
const vs: { t: number; l: number; r: number }[] = [{ t: 0, l: 0, r: 0 }];
let hi = 0, lo = 0;

// ---------- gancho (0–3 s) ----------
v.hero(0.1, DUR, 'earth', { obj: 'earth', x: 200, y: 520, size: 270, label: 'LA TIERRA', mood: 'shocked' });
v.cam(0, geoBox(-150, -45, 160, 72), { dur: 0, ...FR, pad: 0 });
v.title2(0.05, 0.7, ['¿Cuántas personas', 'hay en el *MUNDO*?'], [C.gold, C.gold]);
v.title2(0.7, 1.65, ['¡*8.140*', 'MILLONES*!*'], [C.yes, C.gold]);
v.s2(0.7, 'boom', 0.35); v.shake(0.72, 12);
v.title2(1.65, 3.0, ['¿Qué país tiene', '*MÁS* habitantes?'], [C.gold, C.yes], [{ text: 'Banco Mundial · 2024', color: C.teal }]);
v.heroMood(1.6, 'wow');

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
  v.info(o.t + 0.4, e - 0.1, { flag: o.id, name: nameOf(o.id), tag: o.tag, chip: pm(o.id), chipColor: o.color, chipAt: tc, hideTitle: true, label: 'HABITANTES', labelColor: o.color, title: `${pm(o.id)} de habitantes`, texts: [o.text] });
  v.heroMood(o.t + 0.5, 'wow');
  if (o.bubble) v.bubble(o.t + 0.9, tc - 0.1, o.id, o.bubble, { side: 'right' });
  v.suspense(tc, 0.8, !o.long);
  v.ribbon(tc, e - 0.15, o.ribbon, o.color, 'de habitantes', '★');
  v.heroMood(tc + 0.1, 'shocked');
  v.fill(e, [o.id], o.color, 0.3);
  v.face(e + 0.1, DUR, o.id, 'dots', { scale: 0.55 });
  if (o.hi) hi++; else lo++;
  vs.push({ t: tc, l: hi, r: lo });
  return tc;
};

stop({ t: 3.0, len: 4.6, id: 'MX', hi: true, mood: 'proud', color: C.yes, pad: 0.12, tag: `PUESTO ${RK.MX}`, text: '¡El país hispanohablante más poblado!', ribbon: '¡131 M!', bubble: '¿Cuántos somos?' });
stop({ t: 7.6, len: 4.6, id: 'ES', hi: false, mood: 'happy', color: C.orange, pad: 0.15, tag: `PUESTO ${RK.ES}`, text: '4.º país más poblado de la UE', ribbon: '¡48,8 M!', bubble: '¿Y yo?' });
stop({ t: 12.2, len: 4.6, id: 'US', hi: true, mood: 'shocked', color: C.yes, pad: 0.06, tag: 'N.º 3 DEL MUNDO', text: '¡El 3.º del mundo!', ribbon: '#3: ¡340 M!', bubble: '¿Solo el tercero?' });
stop({ t: 16.8, len: 4.6, id: 'CN', hi: true, mood: 'shocked', color: C.yes, pad: 0.1, tag: 'N.º 2 DEL MUNDO', text: '¡Fue el n.º 1 hasta 2023!', ribbon: '#2: ¡1.409 M!', bubble: '¿Ya no soy el primero?' });
const tIN = stop({ t: 21.4, len: 6.2, id: 'IN', hi: true, mood: 'proud', color: C.yes, pad: 0.1, tag: 'N.º 1 DEL MUNDO', text: '¡El país más poblado del mundo!', ribbon: '#1: ¡1.451 M!', long: true });
v.flash(tIN, '#4BE07F'); v.shake(tIN + 0.05, 18); v.fx(tIN + 0.1, 'confetti'); v.s2(tIN + 0.2, 'crowd_roar', 0.3);
v.bubble(tIN + 0.5, 27.4, 'hero', '¡Casi 1 de cada 5 personas!', { side: 'right' });

// ---------- cierre ----------
v.cam(27.4, geoBox(-12, 30, 40, 62), { dur: 1.4, ...FR, pad: 0 });
v.ribbon(27.8, 29.9, '¡VÍDEO COMPLETO!', C.purple, 'en el canal', '▶');
v.heroMood(27.8, 'happy');
v.bubble(28.1, 29.9, 'hero', '¿Y en tu país? ¡Comenta!', { side: 'right' });

v.versusBar({ t0: 3.0, t1: DUR, left: '+50 M', right: '-50 M', lc: C.yes, rc: C.orange, steps: vs.map((s) => ({ ...s, t: Math.max(s.t, 3.0) })) });

export const habitantesShort = v.end(DUR, 'Banco Mundial (2024)');
