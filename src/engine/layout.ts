// Tamaño del lienzo actual (horizontal 1920x1080 para vídeos, vertical 1080x1920 para Shorts).
// MapVideo lo fija en cada fotograma con useVideoConfig(); el mapa, la cámara y el HUD lo leen de aquí.
export const LAY = { w: 1920, h: 1080, portrait: false };
export const setLayout = (w: number, h: number) => { LAY.w = w; LAY.h = h; LAY.portrait = h > w; };
// Zona segura de YouTube Shorts (vertical): arriba ~ 220 px y abajo ~ 420 px los tapa la interfaz,
// y a la derecha ~ 140 px los botones (me gusta, comentarios…).
export const SAFE = { top: 220, bottom: 430, right: 150 };
