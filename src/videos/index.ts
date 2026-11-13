import { mexico, mexicoThumbs } from './mexico';
import { chicle, chicleThumbs } from './chicle';
import { chicleShort } from './chicle_short';
import { dinero, dineroThumbs } from './dinero';
import { dineroShort } from './dinero_short';
import { iphone, iphoneThumbs } from './iphone';
import { iphoneShort } from './iphone_short';
import { deuda, deudaThumbs } from './deuda';
import { deudaShort } from './deuda_short';
import { pasaportes, pasaportesThumbs } from './pasaportes';
import { pasaportesShort } from './pasaportes_short';
import { habitantes, habitantesThumbs } from './habitantes';
import { habitantesShort } from './habitantes_short';
import { ci, ciThumbs } from './ci';
import { ciShort } from './ci_short';
import { ejercitos, ejercitosThumbs } from './ejercitos';
import { ejercitosShort } from './ejercitos_short';
import type { Spec } from '../engine/builder';
import type { ThumbV } from '../engine/Thumb';
// Registra aquí cada vídeo nuevo: { spec, thumbs: [5 miniaturas] }
export const VIDEOS: { spec: Spec; thumbs: ThumbV[] }[] = [{ spec: mexico, thumbs: mexicoThumbs }, { spec: chicle, thumbs: chicleThumbs }, { spec: chicleShort, thumbs: [] }, { spec: dinero, thumbs: dineroThumbs }, { spec: dineroShort, thumbs: [] }, { spec: iphone, thumbs: iphoneThumbs }, { spec: iphoneShort, thumbs: [] }, { spec: deuda, thumbs: deudaThumbs }, { spec: deudaShort, thumbs: [] }, { spec: pasaportes, thumbs: pasaportesThumbs }, { spec: pasaportesShort, thumbs: [] },
  { spec: habitantes, thumbs: habitantesThumbs }, { spec: habitantesShort, thumbs: [] },
  { spec: ci, thumbs: ciThumbs }, { spec: ciShort, thumbs: [] },
  { spec: ejercitos, thumbs: ejercitosThumbs }, { spec: ejercitosShort, thumbs: [] }];
// Shorts: mismo registro, con .short() en el builder (composición V-<id>-short de 1080x1920)
