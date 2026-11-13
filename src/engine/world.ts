import { geoNaturalEarth1 } from 'd3-geo';
import WORLD from '../../public/world.json';

// misma proyección que tools/build-map.mjs -> lon/lat a espacio mundo
const PROJ = geoNaturalEarth1().fitExtent([[20, 20], [(WORLD.W as number) - 20, (WORLD.H as number) - 20]], { type: 'Sphere' });
export const geo = (lon: number, lat: number): [number, number] => PROJ([lon, lat]) as [number, number];
/** Caja de cámara en grados: oeste, sur, este, norte */
export const geoBox = (w: number, s: number, e: number, n: number): [number, number, number, number] => {
  const pts = [geo(w, s), geo(e, n), geo(w, n), geo(e, s), geo((w + e) / 2, n), geo((w + e) / 2, s)];
  return [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))];
};

export type Country = { id: string; name: string; en: string; d: string; dm: string; c: [number, number]; bb: number[][]; fb: number[][]; area: number };
export const W = WORLD.W as number;
export const H = WORLD.H as number;
export const SPHERE = WORLD.sphere as string;
export const COUNTRIES = WORLD.countries as Country[];
export const BY_ID: Record<string, Country> = Object.fromEntries(COUNTRIES.map((c) => [c.id, c]));
export const nameOf = (id: string) => BY_ID[id]?.name ?? id;

// Continentes (ISO alpha-2). Rusia y Turquía en Europa; Egipto en África; México y Centroamérica/Caribe en Norteamérica.
export const CONTINENTS: Record<string, string[]> = {
  africa: 'DZ AO BJ BW BF BI CM CV CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO SO-SL ZA SS SD TZ TG TN UG EH ZM ZW'.split(' '),
  europe: 'AL AD AT BY BE BA BG HR CY CY-N CZ DK EE FI FR DE GR HU IS IE IT XK LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SE CH UA GB VA FO AX GG JE IM'.split(' '),
  asia: 'AF AM AZ BH BD BT BN KH CN GE IN ID IR IQ IL JP JO KZ KW KG LA LB MY MV MN MM NP KP OM PK PS PH QA SA SG KR LK SY TW TJ TH TL TR TM AE UZ VN YE HK MO IN-SG'.split(' '),
  namerica: 'AG BS BB BZ CA CR CU DM DO SV GD GT HT HN JM MX NI PA KN LC VC TT US GL PR BM KY TC VG VI AI AW CW SX MS PM BL MF'.split(' '),
  samerica: 'AR BO BR CL CO EC GY PY PE SR UY VE FK GF'.split(' '),
  oceania: 'AU FJ KI MH FM NR NZ PW PG WS SB TO TV VU NC PF GU MP AS CK NU AU-AC'.split(' '),
  antarctica: 'AQ TF HM GS'.split(' '),
};
export const CONT_NAME: Record<string, string> = { africa: 'África', europe: 'Europa', asia: 'Asia', namerica: 'Norteamérica', samerica: 'Sudamérica', oceania: 'Oceanía', antarctica: 'Antártida' };
// Encuadres recomendados por continente [x0,y0,x1,y1] en espacio mundo (evitan islas lejanas)
export const inMap = (ids: string[]) => ids.filter((i) => BY_ID[i]);

export const bboxOf = (ids: string[], full = false): [number, number, number, number] => {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const id of ids) {
    const c = BY_ID[id];
    if (!c) continue;
    const b = full ? c.fb : c.bb;
    x0 = Math.min(x0, b[0][0]); y0 = Math.min(y0, b[0][1]); x1 = Math.max(x1, b[1][0]); y1 = Math.max(y1, b[1][1]);
  }
  return [x0, y0, x1, y1];
};
