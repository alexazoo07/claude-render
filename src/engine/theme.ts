import { LILITA, RUBIK600, RUBIK800 } from './fontdata';

// Fuentes INCRUSTADAS como @font-face (data URL). Sin delayRender: con Edge, las pestañas de render en
// segundo plano no completan FontFace.load() y el render se cuelga (ver SKILL.md).
export const DISPLAY = 'LilitaLocal';   // títulos, cifras, sellos
export const BODY = 'RubikLocal';       // textos
if (typeof document !== 'undefined' && !document.getElementById('mapamundi-fonts')) {
  const st = document.createElement('style');
  st.id = 'mapamundi-fonts';
  st.textContent = [
    `@font-face{font-family:'${DISPLAY}';src:url(${LILITA}) format('woff2');font-display:block}`,
    `@font-face{font-family:'${BODY}';src:url(${RUBIK800}) format('woff2');font-weight:800 900;font-display:block}`,
    `@font-face{font-family:'${BODY}';src:url(${RUBIK600}) format('woff2');font-weight:400 700;font-display:block}`,
  ].join('\n');
  document.head.appendChild(st);
}
// Paleta "Atlas Kawaii": océano nocturno + tierra crema + acentos vivos
export const C = {
  ocean: '#3A8DD8',
  oceanDeep: '#2C74BF',
  wave: 'rgba(255,255,255,0.10)',
  land: '#F2EADB',
  landDim: '#E6DCC8',
  border: '#A99E88',
  shadow: 'rgba(16,52,96,0.28)',
  ink: '#1B1A2E',
  cream: '#FFF6E5',
  gold: '#FFC83D',
  goldDark: '#C98A00',
  red: '#EE4540',
  teal: '#2EC4B6',
  blue: '#3D8BFD',
  orange: '#FF8A3D',
  green: '#3BB273',
  pink: '#FF8FAB',
  white: '#FFFFFF',
  purple: '#8E5BD8',
  yes: '#35B864',
  no: '#E8453C',
  grey: '#B9BEC7',
};

// Escalas de datos (bajo -> alto)
export const SCALES: Record<string, string[]> = {
  heat: ['#FFF1C1', '#FFD166', '#FF9F43', '#F25F3A', '#C0262D', '#7A0F1F'],
  cold: ['#E8F6FF', '#A9DCFF', '#5FB2F5', '#2F7FD8', '#1D4FA6', '#14286B'],
  green: ['#EAF8D9', '#B8E68F', '#7CCB5B', '#3FA34D', '#1F7A3A', '#0F4D27'],
  purple: ['#F1E6FF', '#D3B8FF', '#AC85F5', '#8456E0', '#5D35B0', '#3A1D78'],
};

export const hex2rgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const mix = (a: string, b: string, t: number) => {
  if (a === b) return a;
  const A = hex2rgb(a), B = hex2rgb(b);
  const r = A.map((v, i) => Math.round(v + (B[i] - v) * Math.max(0, Math.min(1, t))));
  return '#' + r.map((v) => v.toString(16).padStart(2, '0')).join('');
};
export const scaleColor = (scale: string, t: number) => {
  const s = SCALES[scale] || SCALES.heat;
  const x = Math.max(0, Math.min(0.9999, t)) * (s.length - 1);
  const i = Math.floor(x);
  return mix(s[i], s[i + 1], x - i);
};

// Formato numérico en español: 1.476,6 (siempre agrupa miles)
export const fmt = (v: number, dec = 0) => {
  const [i, d] = Math.abs(v).toFixed(dec).split('.');
  const g = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (v < 0 ? '−' : '') + g + (d ? ',' + d : '');
};

// Contorno de texto "pegatina" (grueso, legible sobre cualquier fondo)
export const stroke = (w: number, col = C.ink) => {
  const s: string[] = [];
  for (let a = 0; a < 16; a++) {
    const r = (a / 16) * Math.PI * 2;
    s.push(`${(Math.cos(r) * w).toFixed(1)}px ${(Math.sin(r) * w).toFixed(1)}px 0 ${col}`);
  }
  s.push(`0px ${w + 4}px 0 ${col}`);
  return s.join(',');
};

