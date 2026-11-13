// API para escribir vídeos: tiempos en segundos. El builder añade los SFX solo.
import { bboxOf, BY_ID, H, W } from './world';

export type Mood = 'terror' | 'cry' | 'evil' | 'dots' | 'happy' | 'wow' | 'proud' | 'shocked' | 'sad' | 'cool' | 'sleep' | 'angry' | 'worried' | 'love';
export type Cam = { t: number; x: number; y: number; w: number; dur: number };
export type Fill = { t: number; ids: string[]; color?: string; flag?: boolean; dur: number };
export type Face = { t0: number; t1: number; id: string; mood: Mood; scale: number; tag?: string; tagColor?: string; at?: [number, number] };
export type Txt = { t0: number; t1: number };
export type Title = Txt & { top: string; main: string; sub?: string; color?: string };
export type Chapter = Txt & { label: string; idx?: number; total?: number; icon?: string };
export type Card = Txt & { flag: string; name: string; sub?: string; value?: number; dec?: number; unit?: string; badge?: string; color?: string };
export type Banner = Txt & { text: string; color?: string; y?: number };
export type Stamp = Txt & { text: string; color?: string; x?: number; y?: number; rot?: number; size?: number };
export type Big = Txt & { text: string; sub?: string; color?: string };
export type BoardRow = { t: number; flag: string; name: string; value: number; dec?: number; unit?: string; note?: string };
export type Board = Txt & { title: string; rows: BoardRow[]; sort?: boolean };
export type Gauge = Txt & { label: string; unit: string; max: number; min?: number; log?: boolean; dec?: number; icon?: string; scale?: string; marks: { t: number; value: number; flag: string }[] };
export type Progress = Txt & { labels: string[]; steps: { t: number; idx: number; flag?: string }[] };
export type Outro = Txt & { question: string; cta?: string };
export type Sfx = { t: number; name: string; gain: number };
export type Music = { src: string; t0: number; t1: number; gain: number; offset?: number };
// ---- estilo v2 (protagonista + cuerdas + bocadillos + marcadores) ----
export type Hero = Txt & { id: string; obj?: string; x: number; y: number; size: number; label?: string; moods: { t: number; mood: Mood }[] };
export type Rope = Txt & { to: string; at?: [number, number]; color: string };
export type Tag = Txt & { id: string; text: string; at?: [number, number]; color?: string };
export type Bubble = Txt & { id: string; text: string; at?: [number, number]; side?: 'left' | 'right' };
export type Ribbon = Txt & { text: string; sub?: string; color: string; icon?: string };
export type Info = Txt & { flag: string; name: string; tag?: string; chip?: string; chipColor?: string; label?: string; labelColor?: string; title?: string; text?: string; texts?: string[]; chipAt?: number; hideTitle?: boolean };
export type Group = Txt & { title: string; sub?: string; items: { flag: string; name: string; color?: string }[] };
export type Legend = Txt & { title: string; rows: { color: string; label: string; desc: string }[] };
export type Subscribe = Txt & { big?: boolean };
export type Results = Txt & { title: string; sub?: string; cats: { label: string; color: string; ids: string[]; count?: number }[] };
export type Versus = Txt & { left: string; right: string; lc: string; rc: string; steps: { t: number; l: number; r: number }[] };
export type Led = Txt & { cells: { label: string; color: string; steps: { t: number; v: number }[]; digits?: number }[] };
export type ListRow = { t: number; flag: string; name: string; pill: string; color: string };
export type List = Txt & { rows: ListRow[]; max?: number };
export type Region = Txt & { text: string };
export type Title2 = Txt & { lines: string[]; colors: string[]; chips?: { text: string; color: string }[] };
export type Fx = { t: number; kind: 'pulse' | 'confetti' | 'punch'; id?: string; at?: [number, number]; color?: string; amp?: number };

export type Spec = {
  id: string; title: string; dur: number; source?: string; dataScale?: string;
  cams: Cam[]; fills: Fill[]; faces: Face[]; titles: Title[]; chapters: Chapter[]; cards: Card[]; banners: Banner[];
  stamps: Stamp[]; bigs: Big[]; boards: Board[]; gauges: Gauge[]; progress: Progress[]; outros: Outro[];
  sfx: Sfx[]; music: Music[]; shakes: { t: number; amp: number }[]; flashes: { t: number; color: string }[];
  fps?: number; credits?: string; heroes: Hero[]; ropes: Rope[]; tags: Tag[]; bubbles: Bubble[]; ribbons: Ribbon[]; infos: Info[]; groups: Group[]; versus: Versus[]; leds: Led[]; lists: List[]; regions: Region[]; titles2: Title2[]; fx: Fx[];
  legends?: Legend[]; subs?: Subscribe[]; results?: Results[];
  ducks?: { t0: number; t1: number; amt: number }[]; // la música baja en estos tramos (redobles)
  vw?: number; vh?: number; // tamaño del lienzo: 1920x1080 (vídeo) o 1080x1920 (Short)
};


// ---------- Librería de música sin copyright (Kevin MacLeod, incompetech.com, CC BY 4.0) ----------
// Para añadir temas: descárgalos (con permiso del usuario) a public/music/lib y regístralos aquí.
export const MUSIC_LIB: Record<string, { file: string; title: string; len: number; mood: string }> = {
  pixel_peeker_polka: { file: 'music/lib/pixel_peeker_polka.mp3', title: 'Pixel Peeker Polka - faster', len: 202, mood: 'rápida, divertida (rankings, retos, eliminaciones)' },
  life_of_riley: { file: 'music/lib/life_of_riley.mp3', title: 'Life of Riley', len: 235, mood: 'alegre, luminosa (récords, curiosidades)' },
  carefree: { file: 'music/lib/carefree.mp3', title: 'Carefree', len: 205, mood: 'desenfadada (vueltas al mundo, mapas de categorías)' },
  wallpaper: { file: 'music/lib/wallpaper.mp3', title: 'Wallpaper', len: 220, mood: 'positiva, constante (relleno de vídeos largos)' },
  sneaky_snitch: { file: 'music/lib/sneaky_snitch.mp3', title: 'Sneaky Snitch', len: 137, mood: 'traviesa, misterio cómico (prohibiciones, secretos)' },
  investigations: { file: 'music/lib/investigations.mp3', title: 'Investigations', len: 94, mood: 'intriga (preguntas, "¿qué pasaría si…?")' },
  // aprobadas por el usuario (nov. 2026) como fondo de mapas interactivos: usar estas + wallpaper, a ~0,3 de volumen
  cool_vibes: { file: 'music/lib/cool_vibes.mp3', title: 'Cool Vibes', len: 218, mood: 'groove tranquilo (fondo de mapas, aprobada)' },
  bossa_antigua: { file: 'music/lib/bossa_antigua.mp3', title: 'Bossa Antigua', len: 283, mood: 'bossa suave (fondo de mapas, aprobada)' },
  local_forecast: { file: 'music/lib/local_forecast.mp3', title: 'Local Forecast - Elevator', len: 189, mood: 'ligera, de fondo (fondo de mapas, aprobada)' },
};
export const musicCredits = (keys: string[]) =>
  [...new Set(keys)].map((k) => `«${MUSIC_LIB[k].title}» de Kevin MacLeod (incompetech.com)`).join('\n') +
  '\nLicencia: Creative Commons Attribution 4.0 — http://creativecommons.org/licenses/by/4.0/';

export class Video {
  s: Spec;
  constructor(id: string, title: string) {
    // (vw/vh se fijan con short())
    this.s = { id, title, dur: 10, cams: [], fills: [], faces: [], titles: [], chapters: [], cards: [], banners: [], stamps: [], bigs: [], boards: [], gauges: [], progress: [], outros: [], sfx: [], music: [], shakes: [], flashes: [], heroes: [], ropes: [], tags: [], bubbles: [], ribbons: [], infos: [], groups: [], versus: [], leds: [], lists: [], regions: [], titles2: [], fx: [], legends: [], subs: [], results: [], ducks: [] };
  }
  // ---------- formato "gira por países" (v2.5) ----------
  /** Leyenda central de categorías ("Cómo lo medimos"). */
  legend(t0: number, t1: number, title: string, rows: Legend['rows']) { this.s.legends!.push({ t0, t1, title, rows }); this.s2(t0, 'select', 0.4); rows.forEach((_, i) => this.s2(t0 + 0.35 + i * 0.3, 'pop', 0.35)); return this; }
  /** Aviso de suscripción: pequeño arriba a la derecha (por defecto) o grande en el centro. */
  subscribe(t0: number, t1: number, big = false) { this.s.subs!.push({ t0, t1, big }); this.s2(t0, 'up', 0.35); this.s2(t0 + (big ? 1.6 : 1.2), 'click', 0.5); return this; }
  /** Tablero final con todas las banderas por categoría. */
  results(t0: number, t1: number, title: string, cats: Results['cats'], sub?: string) { this.s.results!.push({ t0, t1, title, sub, cats }); this.s2(t0, 'select', 0.4); cats.forEach((_, i) => this.s2(t0 + 0.4 + i * 0.5, 'whoosh', 0.3)); return this; }
  // ---------- cámara ----------
  /** Encuadra países (o 'world') con márgenes. safe = fracción de pantalla tapada por el HUD a la derecha/abajo. */
  cam(t: number, target: string[] | 'world' | [number, number, number, number], o: { dur?: number; pad?: number; right?: number; left?: number; bottom?: number; top?: number; full?: boolean; zoom?: number } = {}) {
    const dur = o.dur ?? 1.6;
    let [x0, y0, x1, y1] = target === 'world' ? [0, 120, W, H - 120] : Array.isArray(target) && typeof target[0] === 'number' ? (target as number[]) : bboxOf(target as string[], o.full);
    const pad = o.pad ?? 0.12;
    const right = o.right ?? 0.2, left = o.left ?? 0, bottom = o.bottom ?? 0.16, top = o.top ?? 0.1; // zona útil de pantalla
    const useW = 1 - right - left - 0.03, useH = 1 - bottom - top;
    let bw = (x1 - x0) * (1 + pad * 2), bh = (y1 - y0) * (1 + pad * 2);
    const VW = this.s.vw ?? 1920, VH = this.s.vh ?? 1080;
    let w = Math.max(bw / useW, (bh / useH) * (VW / VH));
    w = Math.max(w, VW > VH ? 260 : 150) / (o.zoom ?? 1);
    w = Math.min(w, W * 1.05);
    const h = (w * VH) / VW;
    // centro de la zona útil desplazado respecto al centro de pantalla
    const cx = (x0 + x1) / 2 + w * (right - left - 0.03) / 2;
    const cy = (y0 + y1) / 2 - h * (top - bottom) / 2;
    this.s.cams.push({ t, x: cx, y: cy, w, dur });
    if (this.s.cams.length > 1 && dur > 0.5) this.sfx(t, 'whoosh', 0.35);
    return this;
  }
  // ---------- mapa ----------
  fill(t: number, ids: string[], color: string, dur = 0.6) { this.s.fills.push({ t, ids, color, dur }); return this; }
  flag(t: number, ids: string[], dur = 0.5) { this.s.fills.push({ t, ids, flag: true, dur }); return this; }
  face(t0: number, t1: number, id: string, mood: Mood = 'happy', o: Partial<Face> = {}) {
    if (!BY_ID[id]) { console.warn('face: país no encontrado', id); return this; }
    this.s.faces.push({ t0, t1, id, mood, scale: 1, ...o });
    return this;
  }
  /** Caras pequeñas de ambiente (los demás países "miran"). */
  crowd(t0: number, t1: number, ids: string[], mood: Mood = 'sleep', scale = 0.55, stagger = 0.04) {
    ids.forEach((id, i) => BY_ID[id] && this.s.faces.push({ t0: t0 + i * stagger, t1, id, mood, scale }));
    return this;
  }
  // ---------- HUD ----------
  title(t0: number, t1: number, top: string, main: string, sub?: string) { this.s.titles.push({ t0, t1, top, main, sub }); this.sfx(t0 + 0.1, 'pop', 0.6); this.sfx(t0 + 0.35, 'stamp', 0.5); return this; }
  chapter(t0: number, t1: number, label: string, idx?: number, total?: number, icon?: string) { this.s.chapters.push({ t0, t1, label, idx, total, icon }); return this; }
  card(t0: number, t1: number, c: Omit<Card, 't0' | 't1'>) { this.s.cards.push({ t0, t1, ...c }); this.sfx(t0, 'swipe', 0.45); if (c.value !== undefined) this.sfx(t0 + 1.25, 'ding', 0.45); return this; }
  banner(t0: number, t1: number, text: string, color?: string) { this.s.banners.push({ t0, t1, text, color }); this.sfx(t0, 'pop', 0.4); return this; }
  stamp(t0: number, t1: number, text: string, o: Partial<Stamp> = {}) { this.s.stamps.push({ t0, t1, text, ...o }); this.sfx(t0 + 0.12, 'stamp', 0.75); this.shake(t0 + 0.12, 14); return this; }
  big(t0: number, t1: number, text: string, sub?: string, color?: string) { this.s.bigs.push({ t0, t1, text, sub, color }); this.sfx(t0, 'pop', 0.6); return this; }
  board(t0: number, t1: number, title: string, rows: BoardRow[], sort = false) { this.s.boards.push({ t0, t1, title, rows, sort }); rows.forEach((r) => this.sfx(r.t, 'tick', 0.35)); return this; }
  gauge(g: Gauge) { this.s.gauges.push(g); return this; }
  progress(p: Progress) { this.s.progress.push(p); return this; }
  outro(t0: number, t1: number, question: string, cta = '¡Suscríbete para más mapas!') { this.s.outros.push({ t0, t1, question, cta }); this.sfx(t0, 'riser', 0.4); return this; }
  // ---------- efectos/audio ----------
  shake(t: number, amp = 10) { this.s.shakes.push({ t, amp }); return this; }
  flash(t: number, color = '#FFFFFF') { this.s.flashes.push({ t, color }); return this; }
  sfx(t: number, name: string, gain = 0.5) { this.s.sfx.push({ t, name, gain }); return this; }
  music(src: string, t0: number, t1: number, gain = 0.55, offset = 0) { this.s.music.push({ src, t0, t1, gain, offset }); return this; }
  // ---------- estilo v2 ----------
  private n = 0;
  /** SFX del banco del canal (public/sfx2) con variaciones aleatorias deterministas */
  s2(t: number, base: 'pop' | 'whoosh' | string, gain = 0.5) {
    const vars: Record<string, number> = { pop: 4, whoosh: 4 };
    const name = vars[base] ? `${base}_${(this.n++ % vars[base]) + 1}` : base;
    return this.sfx(t, `sfx2/${name}`, gain);
  }
  hero(t0: number, t1: number, id: string, o: { x?: number; y?: number; size?: number; label?: string; mood?: Mood; obj?: string } = {}) {
    this.s.heroes.push({ t0, t1, id, obj: o.obj, x: o.x ?? 230, y: o.y ?? 300, size: o.size ?? 360, label: o.label, moods: [{ t: t0, mood: o.mood ?? 'wow' }] });
    this.s2(t0, 'up', 0.5);
    return this;
  }
  heroMood(t: number, mood: Mood) { const h = this.s.heroes[this.s.heroes.length - 1]; h.moods.push({ t, mood }); return this; }
  rope(t0: number, t1: number, to: string, color = '#FFFFFF', at?: [number, number]) { this.s.ropes.push({ t0, t1, to, color, at }); this.s2(t0, 'whoosh', 0.3); return this; }
  tag(t0: number, t1: number, id: string, text?: string, at?: [number, number]) { this.s.tags.push({ t0, t1, id, text: (text ?? BY_ID[id]?.name ?? id).toUpperCase(), at }); return this; }
  bubble(t0: number, t1: number, id: string, text: string, o: { at?: [number, number]; side?: 'left' | 'right' } = {}) { this.s.bubbles.push({ t0, t1, id, text, ...o }); this.s2(t0, 'pop', 0.45); return this; }
  ribbon(t0: number, t1: number, text: string, color: string, sub?: string, icon?: string) { this.s.ribbons.push({ t0, t1, text, color, sub, icon }); this.s2(t0, 'slap', 0.6); this.shake(t0 + 0.05, 6); return this; } // sin "punch" de zoom: la imagen no rebota
  /** INTRIGA antes de un veredicto: redoble de caja + pandereta (public/sfx2/roll.wav, 2,4 s) que termina
   *  EXACTAMENTE en `reveal`, golpe final (hit.wav) en `reveal` y la música baja durante el redoble. */
  suspense(reveal: number, gain = 0.8, short = false) {
    const len = short ? 1.4 : 2.4; // short = redoble corto (roll_s.wav) para los Shorts
    this.s2(reveal - len, short ? 'roll_s' : 'roll', gain);
    this.s2(reveal, 'hit', gain * 0.85);
    this.s.ducks!.push({ t0: reveal - len, t1: reveal + 0.3, amt: 0.45 });
    return this;
  }
  info(t0: number, t1: number, i: Omit<Info, 't0' | 't1'>) { this.s.infos.push({ t0, t1, ...i }); this.s2(t0, 'select', 0.35); return this; }
  group(t0: number, t1: number, title: string, items: Group['items'], sub?: string) { this.s.groups.push({ t0, t1, title, sub, items }); this.s2(t0, 'select', 0.35); items.forEach((_, i) => this.s2(t0 + 0.15 + i * 0.12, 'pop', 0.3)); return this; }
  versusBar(x: Versus) { this.s.versus.push(x); x.steps.slice(1).forEach((s) => this.s2(s.t, 'tick', 0.4)); return this; }
  led(x: Led) { this.s.leds.push(x); return this; }
  list(t0: number, t1: number, rows: ListRow[], max = 6) { this.s.lists.push({ t0, t1, rows, max }); rows.forEach((r) => this.s2(r.t, 'click', 0.4)); return this; }
  region(t0: number, t1: number, text: string) { this.s.regions.push({ t0, t1, text }); return this; }
  title2(t0: number, t1: number, lines: string[], colors: string[], chips?: { text: string; color: string }[]) { this.s.titles2.push({ t0, t1, lines, colors, chips }); lines.forEach((_, i) => this.s2(t0 + 0.12 + i * 0.22, 'pop', 0.55)); return this; }
  fx(t: number, kind: Fx['kind'], o: Partial<Fx> = {}) { this.s.fx.push({ t, kind, ...o }); if (kind === 'confetti') this.s2(t, 'confirm', 0.5); return this; }
  setFps(fps: number) { this.s.fps = fps; return this; }
  /** Formato SHORT vertical 1080x1920 (YouTube Shorts). Llamar antes de cualquier cam(). */
  short() { this.s.vw = 1080; this.s.vh = 1920; return this; }
  /** Banda sonora encadenando temas de MUSIC_LIB (fundido cruzado de 2 s). Guarda los créditos en spec.credits. */
  soundtrack(dur: number, keys: string[], gain = 0.4) {
    let t = 0, i = 0;
    const used: string[] = [];
    while (t < dur - 0.5) {
      const k = keys[i % keys.length], len = MUSIC_LIB[k].len;
      const end = Math.min(dur, t + len);
      this.music(MUSIC_LIB[k].file, t, end, gain);
      used.push(k);
      if (end >= dur) break;
      t = end - 2; i++;
    }
    this.s.credits = musicCredits(used);
    return this;
  }
  end(dur: number, source?: string) { this.s.dur = dur; this.s.source = source; this.s.cams.sort((a, b) => a.t - b.t); this.s.fills.sort((a, b) => a.t - b.t); return this.s; }
}

