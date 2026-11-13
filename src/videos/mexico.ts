// Prueba v2 (30 s): "¿Qué países son MÁS GRANDES que MÉXICO?"
// Datos: Wikipedia, List of countries and dependencies by area (superficie total, km²). México 1.964.375 km² (13.º).
import { Video, type Mood } from '../engine/builder';
import type { ThumbV } from '../engine/Thumb';
import { C, fmt } from '../engine/theme';
import { geo, geoBox } from '../engine/world';

const MX = 1964375;
type P = { id: string; name: string; area: number; rank: number };
const P: Record<string, P> = Object.fromEntries(
  ([
    ['SA', 'Arabia Saudí', 2149690, 12], ['CD', 'R. D. del Congo', 2344858, 11], ['DZ', 'Argelia', 2381741, 10], ['KZ', 'Kazajistán', 2724910, 9],
    ['AR', 'Argentina', 2780400, 8], ['IN', 'India', 3287263, 7], ['AU', 'Australia', 7741220, 6], ['BR', 'Brasil', 8510346, 5],
    ['US', 'Estados Unidos', 9525067, 4], ['CN', 'China', 9596960, 3], ['CA', 'Canadá', 9984670, 2], ['RU', 'Rusia', 17098246, 1],
  ] as [string, string, number, number][]).map(([id, name, area, rank]) => [id, { id, name, area, rank }]),
);
const ratio = (id: string) => `x${fmt(P[id].area / MX, 1)}`;
const AT: Record<string, [number, number]> = { RU: geo(60, 60), CA: geo(-105, 60), US: geo(-99, 39), CN: geo(103, 34) };

const v = new Video('mexico', '¿Qué países son MÁS GRANDES que MÉXICO?').setFps(60);
const FR = { left: 0.27, right: 0.2, bottom: 0.21, top: 0.11 };
v.soundtrack(30, ['pixel_peeker_polka'], 0.4);

// ---------- INTRO (0–3,4 s) ----------
v.cam(0, geoBox(-150, -45, 160, 72), { dur: 0, left: 0, right: 0, bottom: 0, top: 0, pad: 0 });
v.cam(0.01, geoBox(-150, -45, 160, 72), { dur: 3.4, left: 0, right: 0, bottom: 0, top: 0, pad: 0, zoom: 1.08 });
v.hero(0.25, 30, 'MX', { x: 250, y: 330, size: 380, label: 'MÉXICO', mood: 'wow' });
v.flag(0.2, ['MX'], 0.3);
v.crowd(0.6, 3.5, ['RU', 'CA', 'US', 'CN', 'BR', 'AU', 'IN', 'AR', 'KZ', 'DZ', 'CD', 'SA'], 'dots', 0.75, 0.05);
v.title2(0.2, 3.3, ['¿Qué países son', '*MÁS GRANDES*', 'que *MÉXICO*?'], [C.gold, C.gold, C.yes], [
  { text: '1.964.375 km²', color: C.teal }, { text: 'Puesto 13 del mundo', color: C.purple },
]);
v.bubble(1.2, 3.2, 'hero', '¡Seguro que pocos!');

// ---------- HUD fijo ----------
const steps: { t: number; l: number; r: number }[] = [{ t: 3.4, l: 0, r: 180 }];
const ledBig: { t: number; v: number }[] = [{ t: 3.4, v: 0 }];
const ledRank: { t: number; v: number }[] = [{ t: 3.4, v: 13 }];
const rows: { t: number; flag: string; name: string; pill: string; color: string }[] = [];
let count = 0;
const hit = (t: number, id: string) => {
  count++;
  steps.push({ t, l: count, r: 180 });
  ledBig.push({ t, v: count });
  ledRank.push({ t, v: P[id].rank });
  rows.push({ t, flag: id, name: P[id].name, pill: ratio(id), color: C.yes });
};
[[3.4, 5.6, 'Oriente Medio'], [7.95, 9.95, 'Asia Central'], [9.95, 12.1, 'Sudamérica'], [12.15, 14.1, 'Asia'], [14.15, 16.1, 'Oceanía'], [16.15, 18.1, 'Sudamérica'], [21.45, 25.9, 'Eurasia']].forEach(([a, b, n]) => v.region(a as number, b as number, n as string));

// Presenta un país: cuerda, bandera, cara, etiqueta y tarjeta
const show = (t: number, id: string, dur: number, o: { mood?: Mood; card?: boolean; ropeColor?: string } = {}) => {
  v.rope(t, t + dur - 0.1, id, o.ropeColor ?? '#FFFFFF', AT[id]);
  v.flag(t + 0.35, [id], 0.3);
  v.fx(t + 0.35, 'pulse', { id, at: AT[id], color: '#FFFFFF' });
  v.s2(t + 0.35, 'pop', 0.5);
  v.face(t + 0.4, t + dur + 0.1, id, o.mood ?? 'wow', { scale: 0.9, at: AT[id] });
  v.tag(t + 0.3, t + dur, id, P[id].name, AT[id]);
  v.fill(t + dur, [id], C.yes, 0.35);
  v.face(t + dur + 0.1, 30, id, 'dots', { scale: 0.55, at: AT[id] });
  hit(t + 0.45, id);
  if (o.card !== false)
    v.info(t + 0.3, t + dur - 0.05, { flag: id, name: P[id].name, tag: `N.º ${P[id].rank} DEL MUNDO`, chip: '¡MÁS GRANDE!', chipColor: C.yes, label: 'ÁREA', title: `${fmt(P[id].area)} km²`, text: `${fmt(P[id].area / MX, 1)} veces México` });
};

// 1) Arabia Saudí
v.cam(3.35, ['SA'], { dur: 0.9, ...FR, pad: 0.35 });
show(3.6, 'SA', 2.0);
v.heroMood(3.9, 'worried');
v.bubble(4.4, 5.6, 'SA', '¡Por solo 185.000 km²!');

// 2) África: Argelia + RD Congo
v.cam(5.55, ['DZ', 'CD'], { dur: 0.9, ...FR, pad: 0.08 });
show(5.8, 'DZ', 2.2, { card: false });
show(6.2, 'CD', 1.8, { card: false });
v.group(6.0, 7.9, 'ÁFRICA', [{ flag: 'DZ', name: 'Argelia · x1,2' }, { flag: 'CD', name: 'R. D. Congo · x1,2' }]);
v.region(5.6, 8.0, 'África');
v.heroMood(6.3, 'shocked');
v.bubble(6.6, 7.9, 'hero', '¡¿Dos de golpe?!');

// 3) Kazajistán
v.cam(7.95, ['KZ'], { dur: 0.9, ...FR, pad: 0.3 });
show(8.2, 'KZ', 1.8);
v.heroMood(8.4, 'worried');
v.bubble(8.8, 9.9, 'KZ', '¡Y sin salida al mar!');

// 4) Argentina (cinta)
v.cam(9.95, ['AR'], { dur: 1.0, ...FR, pad: 0.12 });
show(10.2, 'AR', 2.0);
v.ribbon(10.8, 12.0, '¡EL PAÍS HISPANO MÁS GRANDE!', C.purple, '', '★');
v.heroMood(10.9, 'angry');

// 5) India
v.cam(12.15, ['IN'], { dur: 1.0, ...FR, pad: 0.25 });
show(12.4, 'IN', 1.8);
v.heroMood(12.6, 'worried');
v.bubble(12.9, 14.1, 'IN', '¡Y con 1.476 millones de personas!', { side: 'left' });

// 6) Australia
v.cam(14.15, ['AU'], { dur: 1.0, ...FR, pad: 0.15 });
show(14.4, 'AU', 1.8);
v.bubble(14.9, 16.1, 'AU', '¡Soy casi un continente!', { side: 'left' });

// 7) Brasil
v.cam(16.15, ['BR'], { dur: 1.0, ...FR, pad: 0.12 });
show(16.4, 'BR', 1.8);
v.heroMood(16.6, 'shocked');
v.bubble(16.9, 18.1, 'hero', '¡Más de 4 Méxicos!');

// 8) Los gigantes: EE. UU., China, Canadá
v.cam(18.15, geoBox(-140, 8, 140, 72), { dur: 1.1, ...FR, pad: 0.02 });
v.region(18.2, 21.6, 'Los gigantes');
show(18.5, 'US', 3.0, { card: false, mood: 'cool' });
show(18.9, 'CN', 2.6, { card: false, mood: 'proud' });
show(19.3, 'CA', 2.2, { card: false, mood: 'cool' });
v.group(18.7, 21.4, 'LOS GIGANTES', [{ flag: 'US', name: 'EE. UU. · x4,8' }, { flag: 'CN', name: 'China · x4,9' }, { flag: 'CA', name: 'Canadá · x5,1' }]);
v.heroMood(19.0, 'sad');

// 9) Rusia: clímax
v.cam(21.45, ['RU'], { dur: 1.0, ...FR, pad: 0.06 });
v.s2(20.9, 'drumroll', 0.5);
show(21.7, 'RU', 4.3, { mood: 'proud', ropeColor: C.gold });
v.ribbon(22.5, 25.6, '¡8,7 VECES MÉXICO!', C.red, '17.098.246 km²', '!');
v.fx(22.5, 'confetti');
v.flash(22.5, '#FFFFFF');
v.shake(22.55, 22);
v.s2(22.5, 'boom', 0.45);
v.heroMood(22.6, 'sad');
v.bubble(23.6, 25.6, 'hero', '¡Cabemos casi 9 veces!');

// ---------- CIERRE (26–30 s) ----------
v.cam(25.95, geoBox(-150, -45, 160, 75), { dur: 1.2, left: 0.2, right: 0.18, bottom: 0.05, top: 0.1, pad: 0 });
v.face(26.6, 30, 'GL', 'wow', { scale: 0.9 });
v.tag(26.6, 29.9, 'GL', 'GROENLANDIA');
v.bubble(26.8, 28.6, 'GL', '¡Yo también! …pero no soy país');
v.tag(27.6, 29.9, 'ID', 'INDONESIA');
v.face(27.6, 30, 'ID', 'worried', { scale: 0.8 });
v.bubble(28.0, 29.9, 'ID', '¡Me quedé a 60.000 km²!', { side: 'left' });
v.heroMood(27.2, 'happy');
v.outro(28.4, 30, '¿Y tu país? ¡Comenta!', '');

v.versusBar({ t0: 3.4, t1: 30, left: 'MÁS GRANDES', right: 'MÁS PEQUEÑOS', lc: C.yes, rc: C.no, steps });
v.led({ t0: 3.4, t1: 30, cells: [{ label: 'MÁS GRANDES', color: '#3CFF8A', steps: ledBig }, { label: 'PUESTO', color: '#FFC83D', steps: ledRank }] });
v.list(3.6, 30, rows, 6);

export const mexico = v.end(30, 'Wikipedia · List of countries by area (superficie total)');

// ---- 5 miniaturas (foco = México asustado / Rusia gigante) ----
const AMERICAS: [number, number, number, number] = geoBox(-125, 5, -60, 40);
const MAPFLAGS = ['US', 'MX', 'CA', 'GT', 'CU', 'HN', 'NI', 'CO', 'VE', 'BR', 'PE', 'EC', 'BZ', 'SV', 'CR', 'PA', 'HT', 'DO', 'JM'];
export const mexicoThumbs: ThumbV[] = [
  { layout: 'hero', top: '¿QUIÉN ES MÁS *GRANDE*', bottom: '*QUE MÉXICO?*', accent: '#FFD23F', bg: { kind: 'map', view: AMERICAS, flags: MAPFLAGS, faces: ['US', 'CU', 'GT', 'CO', 'VE', 'HN'] }, hero: { kind: 'country', id: 'MX', mood: 'terror', glow: '#FFD23F' }, x: 640, y: 365, size: 500 },
  { layout: 'versus', top: '¿QUIÉN ES *MÁS GRANDE*?', accent: '#FFD23F', left: { hero: { kind: 'country', id: 'MX', mood: 'cry', glow: '#7CC8FF' }, bg: { kind: 'sea' }, label: '1,9 M km²', labelColor: '#FFFFFF' }, right: { hero: { kind: 'country', id: 'RU', mood: 'evil', glow: '#FF3B30', face: 0.55 }, bg: { kind: 'dark' }, label: '17 M km²', labelColor: '#FF4B3E', scale: 1.25 }, size: 520 },
  { layout: 'number', top: '¡RUSIA ES *8,7 MÉXICOS*!', big: 'x8,7', bigColor: '#FF4B3E', accent: '#FF4B3E', bg: { kind: 'map', view: geoBox(20, 30, 150, 75), flags: ['RU', 'KZ', 'CN', 'MN', 'UA', 'FI', 'NO', 'SE'] }, hero: { kind: 'country', id: 'MX', mood: 'shocked', glow: '#FFFFFF' }, size: 470 },
  { layout: 'hero', top: '¿*12 PAÍSES* MÁS GRANDES', bottom: '*QUE MÉXICO?*', accent: '#35E06F', bg: { kind: 'dark' }, hero: { kind: 'country', id: 'RU', silhouette: true, mark: '¿x8,7?', glow: '#FF2D2D' }, x: 640, y: 370, size: 760, rays: false },
  { layout: 'grid', top: '¿SON MÁS *GRANDES*', bottom: '*QUE MÉXICO?*', accent: '#FFD23F', bg: { kind: 'sea' }, grid: { ids: ['RU', 'CA', 'US', 'CN', 'BR', 'AR'], moods: ['evil', 'terror', 'shocked', 'evil', 'cry', 'terror'] } },
];