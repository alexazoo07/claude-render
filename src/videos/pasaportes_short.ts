// SHORT (30 s, vertical 1080x1920) de "¿Qué PASAPORTES son los más PODEROSOS?" — plantilla deuda_short.ts.
// Datos: Henley Passport Index, oct. 2026 (research/pasaportes.md).
// Gancho propio: Afganistán "SOLO 22" en rojo y la pregunta del n.º 1.
import { Video, type Mood } from '../engine/builder';
import { C } from '../engine/theme';
import { geo, geoBox, nameOf } from '../engine/world';
import { PAS_MUSIC } from './pasaportes';

const v = new Video('pasaportes-short', '¿Qué PASAPORTES son los más PODEROSOS? (Short)').setFps(60).short();
const DUR = 30;
v.soundtrack(DUR, [PAS_MUSIC[0]], 0.3);
const FR = { left: 0.04, right: 0.12, top: 0.34, bottom: 0.36 };

type Cat = 'top' | 'good' | 'mid' | 'low';
const CAT: Record<Cat, { color: string; label: string; mood: Mood; hero: Mood }> = {
  top: { color: C.yes, label: '180+ destinos', mood: 'cool', hero: 'happy' },
  good: { color: C.purple, label: '150-179', mood: 'happy', hero: 'happy' },
  mid: { color: C.orange, label: '100-149', mood: 'worried', hero: 'worried' },
  low: { color: C.no, label: '-100 destinos', mood: 'cry', hero: 'shocked' },
};
const vs: { t: number; l: number; r: number }[] = [{ t: 0, l: 0, r: 0 }];
let hi = 0, lo = 0;

// ---------- gancho (0–3 s) ----------
v.hero(0.1, DUR, 'passport', { obj: 'passport', x: 200, y: 520, size: 270, label: 'PASAPORTE', mood: 'shocked' });
v.cam(0, ['AF'], { dur: 0, ...FR, pad: 0.6 });
v.cam(0.01, ['AF'], { dur: 1.4, ...FR, pad: 0.4 });
v.fill(0.05, ['AF'], C.no, 0.25);
v.title2(0.15, 1.45, ['¡*SOLO 22*!', 'Afganistán'], [C.no, C.gold]);
v.s2(0.15, 'boom', 0.35); v.shake(0.18, 12);
v.fill(1.5, ['AF'], C.land, 0.3);
v.title2(1.5, 3.0, ['¿Y el pasaporte', 'más *PODEROSO*?'], [C.gold, C.yes], [{ text: 'Henley · oct. 2026', color: C.teal }]);
v.heroMood(1.5, 'wow');

type Stop = { t: number; len: number; id: string; cat: Cat; cam?: [number, number, number, number]; at?: [number, number]; pad?: number; tag: string; title: string; text: string; ribbon: string; bubble?: string; long?: boolean };
const stop = (o: Stop) => {
  const k = CAT[o.cat], e = o.t + o.len, tc = e - (o.long ? 3.6 : 1.6), at = o.at;
  v.cam(o.t - 0.3, o.cam ?? [o.id], { dur: 1.2, ...FR, pad: o.pad ?? 0.2 });
  v.rope(o.t + 0.15, e - 0.1, o.id, '#FFFFFF', at);
  v.flag(o.t + 0.4, [o.id], 0.3);
  v.fx(o.t + 0.45, 'pulse', { id: o.id, at, color: '#FFFFFF' });
  v.s2(o.t + 0.45, 'pop', 0.5);
  v.face(o.t + 0.5, tc + 0.1, o.id, 'wow', { scale: o.long ? 1.4 : 1.0, at });
  v.face(tc + 0.1, e + 0.1, o.id, k.mood, { scale: o.long ? 1.4 : 1.0, at });
  v.tag(o.t + 0.4, e - 0.1, o.id, nameOf(o.id).toUpperCase(), at);
  v.info(o.t + 0.4, e - 0.1, { flag: o.id, name: nameOf(o.id), tag: o.tag, chip: k.label, chipColor: k.color, chipAt: tc, hideTitle: true, label: 'PASAPORTE', labelColor: k.color, title: o.title, texts: [o.text] });
  v.heroMood(o.t + 0.5, 'wow');
  if (o.bubble) v.bubble(o.t + 0.9, tc - 0.1, o.id, o.bubble, { side: 'right', at });
  v.suspense(tc, 0.8, !o.long);
  v.ribbon(tc, e - 0.15, o.ribbon, k.color, 'destinos sin visado', '★');
  v.heroMood(tc + 0.1, k.hero);
  v.fill(e, [o.id], k.color, 0.3);
  v.face(e + 0.1, DUR, o.id, 'dots', { scale: 0.55, at });
  if (o.cat === 'top' || o.cat === 'good') hi++; else lo++;
  vs.push({ t: tc, l: hi, r: lo });
  return tc;
};

stop({ t: 3.0, len: 4.6, id: 'MX', cat: 'good', pad: 0.12, tag: 'PUESTO 23', title: '155 destinos', text: 'Entra sin visado a Europa', ribbon: '¡155!', bubble: '¿Cuántos tengo yo?' });
stop({ t: 7.6, len: 4.6, id: 'US', cat: 'top', pad: 0.06, tag: 'PUESTO 10', title: '180 destinos', text: '¡Era el n.º 1 en 2014!', ribbon: '¡180!', bubble: '¿Solo el décimo?' });
stop({ t: 12.2, len: 4.6, id: 'ES', cat: 'top', pad: 0.15, tag: 'PUESTO 4', title: '186 destinos', text: '¡Empatado en el 4.º puesto!', ribbon: '¡186!', bubble: '¡Olé!' });
stop({ t: 16.8, len: 4.6, id: 'JP', cat: 'top', cam: geoBox(128, 30, 146, 45), pad: 0, tag: 'N.º 2 DEL MUNDO', title: '188 destinos', text: 'Empatado con Corea y Emiratos', ribbon: '#2: ¡188!', bubble: '¿Seré el n.º 1?' });
const SG: [number, number] = geo(103.82, 1.35);
const tSG = stop({ t: 21.4, len: 6.2, id: 'SG', cat: 'top', at: SG, cam: geoBox(101.5, -0.5, 106.5, 3.5), pad: 0, tag: 'N.º 1 DEL MUNDO', title: '193 destinos', text: '¡El pasaporte más poderoso!', ribbon: '#1: ¡193!', long: true });
v.flash(tSG, '#4BE07F'); v.shake(tSG + 0.05, 18); v.fx(tSG + 0.1, 'confetti'); v.s2(tSG + 0.2, 'crowd_roar', 0.3);
v.bubble(tSG + 0.5, 27.4, 'hero', '¡Casi todo el mundo sin visado!', { side: 'right' });

// ---------- cierre ----------
v.cam(27.4, geoBox(-12, 30, 40, 62), { dur: 1.4, ...FR, pad: 0 });
v.ribbon(27.8, 29.9, '¡VÍDEO COMPLETO!', C.purple, 'en el canal', '▶');
v.heroMood(27.8, 'happy');
v.bubble(28.1, 29.9, 'hero', '¿Y el tuyo? ¡Comenta!', { side: 'right' });

v.versusBar({ t0: 3.0, t1: DUR, left: '+150', right: '-150', lc: C.yes, rc: C.no, steps: vs.map((s) => ({ ...s, t: Math.max(s.t, 3.0) })) });

export const pasaportesShort = v.end(DUR, 'Henley Passport Index (oct. 2026)');
