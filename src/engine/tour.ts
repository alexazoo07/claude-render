// GIRA POR PAÍSES reutilizable (sacada de pasaportes.ts): paradas, grupos, secciones, marcadores, HUD y resultado.
// Cada vídeo solo define datos, categorías, gancho y la lista de paradas. Ver habitantes.ts como ejemplo.
import { Video, type Mood } from './builder';
import { geoBox, nameOf } from './world';

export const FR = { left: 0.27, right: 0.2, bottom: 0.21, top: 0.11 };
export const WORLD = geoBox(-150, -45, 160, 72);
export const FULL = { left: 0, right: 0, bottom: 0, top: 0, pad: 0 };

export type CatDef = { key: string; color: string; chip: string; range: string; led: string; mood: Mood; hero: Mood; left: boolean };
export type TourCfg = {
  dur: number;
  cats: CatDef[];                       // en orden de "mejor/mayor" a "peor/menor"
  catOf: (id: string) => string;        // clave de categoría de cada país
  label: string;                        // rótulo de la tarjeta (PASAPORTE, HABITANTES…)
  pill: (id: string) => string;         // texto corto para la lista lateral
  tag: (id: string) => string;          // etiqueta superior de la tarjeta (PUESTO 4 · …)
  title: (id: string) => string;        // cifra principal de la tarjeta
  texts: (id: string) => string[];      // líneas que rotan en la tarjeta
  ribbon: (id: string) => [string, string];
  icon?: string;
  pairTag: string;
  pairTitle: (ids: string[]) => string;
  pairRibbon: (ids: string[]) => [string, string];
  groupName: (id: string) => string;    // texto de cada país en los grupos `rest`
};

export type Stop = {
  len?: number; ids: string[]; at?: Record<string, [number, number]>; cam?: string[] | [number, number, number, number]; pad?: number;
  name: string; tag: string; title: string; texts: string[]; pills?: string[]; far?: boolean;
  ribbon: [string, string]; bubble?: [string, string]; moods?: Mood[]; climax?: boolean;
};
type Opt = Partial<Stop> & { extra?: string };

export function tour(v: Video, cfg: TourCfg) {
  const DUR = cfg.dur;
  const K: Record<string, CatDef> = Object.fromEntries(cfg.cats.map((c) => [c.key, c]));
  const cid = (id: string) => cfg.catOf(id);
  const n: Record<string, number> = {}, led: Record<string, { t: number; v: number }[]> = {}, seen: Record<string, string[]> = {};
  cfg.cats.forEach((c) => { n[c.key] = 0; led[c.key] = [{ t: 0, v: 0 }]; seen[c.key] = []; });
  const vs: { t: number; l: number; r: number }[] = [{ t: 0, l: 0, r: 0 }];
  const rows: { t: number; flag: string; name: string; pill: string; color: string }[] = [];
  const count = (t: number, cat: string, k: number) => {
    n[cat] += k; led[cat].push({ t, v: n[cat] });
    const l = cfg.cats.filter((c) => c.left).reduce((a, c) => a + n[c.key], 0);
    const r = cfg.cats.filter((c) => !c.left).reduce((a, c) => a + n[c.key], 0);
    vs.push({ t, l, r });
  };
  const S = { T: 0, s: 0 };
  const blk = (len: number) => { const a = S.T; S.T += len; return a; };

  const stop = (o: Stop) => {
    const len = o.len ?? 10, t = blk(len), e = t + len, tc = o.climax ? t + 6.5 : e - 3.2;
    const cats = o.ids.map(cid), k = K[cats[cats.length - 1]];
    const far = !!o.far;
    v.cam(t - (far ? 0.6 : 0.35), o.cam ?? o.ids, { dur: far ? 2.1 : 1.6, ...FR, pad: o.pad ?? 0.25 });
    o.ids.forEach((id, i) => {
      const d = i * 0.35, kc = K[cats[i]], at = o.at?.[id];
      v.rope(t + 0.2 + d, e - 0.15, id, '#FFFFFF', at);
      v.flag(t + 0.5 + d, [id], 0.3);
      v.fx(t + 0.55 + d, 'pulse', { id, at, color: '#FFFFFF' });
      v.s2(t + 0.55 + d, 'pop', 0.5);
      v.face(t + 0.6 + d, tc + 0.1, id, 'wow', { scale: o.climax ? 1.3 : 0.9, at });
      v.face(tc + 0.1, e + 0.1, id, o.moods?.[i] ?? kc.mood, { scale: o.climax ? 1.3 : 0.9, at });
      v.tag(t + 0.5 + d, e - 0.1, id, nameOf(id).toUpperCase(), at);
      v.fill(e, [id], kc.color, 0.35);
      v.face(e + 0.1, DUR, id, 'dots', { scale: 0.55, at });
      rows.push({ t: tc + 0.15 + i * 0.25, flag: id, name: nameOf(id), pill: o.pills?.[i] ?? cfg.pill(id), color: kc.color });
      count(tc, cats[i], 1); seen[cats[i]].push(id);
    });
    v.info(t + 0.6, e - 0.2, { flag: o.ids[0], name: o.name, tag: o.tag, chip: k.chip, chipColor: k.color, chipAt: tc, hideTitle: true, label: cfg.label, labelColor: k.color, title: o.title, texts: o.texts });
    v.heroMood(t + 0.9, 'wow');
    if (o.bubble) {
      const hero = o.bubble[0] === 'hero';
      v.bubble(t + 2.6, tc - 0.15, hero ? 'hero' : o.bubble[0], o.bubble[1], { side: hero ? 'right' : 'left', at: hero ? undefined : o.at?.[o.bubble[0]] });
    }
    v.suspense(tc, o.climax ? 0.95 : 0.8);
    v.ribbon(tc, o.climax ? tc + 4.5 : e - 0.4, o.ribbon[0], k.color, o.ribbon[1], cfg.icon ?? '★');
    v.heroMood(tc + 0.1, k.hero);
    return { t, e, tc };
  };
  const one = (id: string, o: Opt = {}) =>
    stop({ ids: [id], name: nameOf(id), tag: cfg.tag(id), title: cfg.title(id), texts: [...cfg.texts(id), ...(o.extra ? [o.extra] : [])], ribbon: cfg.ribbon(id), ...o });
  const pair = (ids: string[], name: string, o: Opt = {}) =>
    stop({ len: 11, ids, name, tag: cfg.pairTag, title: cfg.pairTitle(ids), texts: [...ids.map((id) => `${nameOf(id)}: ${cfg.pill(id)}`), ...(o.extra ? [o.extra] : [])], ribbon: cfg.pairRibbon(ids), ...o });

  const rest = (len: number, title: string, ids: string[], box: [number, number, number, number], bubble: string) => {
    const t = blk(len), e = t + len;
    v.cam(t - 0.35, box, { dur: 1.6, ...FR, pad: 0.02 });
    ids.forEach((id, i) => { const c = cid(id); v.fill(t + 0.6 + i * 0.2, [id], K[c].color, 0.3); seen[c].push(id); });
    v.crowd(t + 0.9, DUR, ids, 'dots', 0.5, 0.03);
    v.group(t + 0.5, e - 0.2, title, ids.map((id) => ({ flag: id, name: cfg.groupName(id), color: K[cid(id)].color })));
    v.s2(t + 0.6, 'whoosh', 0.35);
    v.heroMood(t + 0.8, 'wow');
    v.bubble(t + 1.4, e - 0.4, 'hero', bubble, { side: 'right' });
    ids.forEach((id, i) => rows.push({ t: t + 1.2 + i * 0.25, flag: id, name: nameOf(id), pill: cfg.pill(id), color: K[cid(id)].color }));
    cfg.cats.forEach((c) => { const k = ids.filter((id) => cid(id) === c.key).length; if (k) count(t + 1.2, c.key, k); });
  };

  const section = (len: number, color: string, text: string, sub: string, bubble?: string) => {
    const t = blk(len);
    v.cam(t - 0.3, WORLD, { dur: 1.7, ...FR, pad: 0 });
    v.ribbon(t + 0.4, t + 3.6, text, color, sub, cfg.icon ?? '★');
    v.s2(t + 0.2, 'riser', 0.4);
    v.heroMood(t + 0.5, 'shocked');
    if (bubble) v.bubble(t + 0.6, t + 3.6, 'hero', bubble, { side: 'right' });
    return t;
  };
  const reg = (name: string) => { v.region(S.s, S.T, name); S.s = S.T; };
  const mark = () => { S.s = S.T; };

  const legend = (title: string, bubble: string) => {
    const t = blk(3.6);
    v.legend(t + 0.1, t + 3.5, title, cfg.cats.map((c) => ({ color: c.color, label: c.led, desc: c.range })));
    v.bubble(t + 0.4, t + 3.4, 'hero', bubble, { side: 'right' });
    v.heroMood(t + 0.3, 'happy');
    S.s = S.T;
  };

  const results = (title: string, sub: string, b1: string, b2: string) => {
    const t = blk(16);
    v.region(t, t + 16, 'Resultado final');
    v.cam(t - 0.3, WORLD, { dur: 1.8, ...FR, pad: 0 });
    v.results(t + 0.6, t + 15.6, title, cfg.cats.map((c) => ({ label: c.range.toUpperCase(), color: c.color, ids: seen[c.key].slice(0, 24), count: seen[c.key].length })), sub);
    v.s2(t + 1.2, 'crowd_roar', 0.2);
    v.heroMood(t + 1.0, 'wow');
    v.bubble(t + 3.0, t + 8.5, 'hero', b1, { side: 'right' });
    v.bubble(t + 9.0, t + 15.4, 'hero', b2, { side: 'right' });
  };

  const outro = (question: string, name: string) => {
    const t = blk(DUR - S.T);
    v.outro(t, DUR - 0.4, question);
    v.heroMood(t + 0.2, 'happy');
    v.bubble(t + 1.5, DUR - 0.8, 'hero', '¡Suscríbete para más mapas!', { side: 'right' });
    if (Math.abs(DUR - S.T) > 0.01) console.warn(name, ': cursor final', S.T, '≠ DUR', DUR);
  };

  const hud = (t0: number, left: string, right: string, lc: string, rc: string, listT0: number) => {
    v.versusBar({ t0, t1: DUR, left, right, lc, rc, steps: vs.map((x) => ({ ...x, t: Math.max(x.t, t0) })) });
    v.led({ t0, t1: DUR, cells: cfg.cats.map((c) => ({ label: c.led, color: c.color, steps: led[c.key] })) });
    v.list(listT0, DUR, rows.sort((a, b) => a.t - b.t), 6);
  };

  return { S, blk, stop, one, pair, rest, section, reg, mark, legend, results, outro, hud, seen, K };
}

/** Número con puntos de miles (es-ES). */
export const fmtN = (x: number) => Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
