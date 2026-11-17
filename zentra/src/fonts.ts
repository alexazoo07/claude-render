import {continueRender, delayRender, staticFile} from 'remotion';
const faces: [string, string, string][] = [
  ['Inter Display', 'fonts/InterDisplay-Black.otf', '900'],
  ['Inter Display', 'fonts/InterDisplay-ExtraBold.otf', '800'],
  ['Inter', 'fonts/Inter-Black.otf', '900'],
  ['Inter', 'fonts/Inter-ExtraBold.otf', '800'],
  ['Inter', 'fonts/Inter-Bold.otf', '700'],
  ['Permanent Marker', 'fonts/marker.woff2', '400'],
];
if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(faces.map(([fam, src, w]) => new FontFace(fam, `url(${staticFile(src)})`, {weight: w}).load()))
    .then((loaded) => { loaded.forEach((f) => (document as any).fonts.add(f)); continueRender(h); })
    .catch((e) => { console.error(e); continueRender(h); });
}
export {};
