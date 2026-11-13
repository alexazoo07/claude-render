import React, { useMemo } from 'react';
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Spec } from './builder';
import { FaceSvg } from './Face';
import { BannerBox, BigText, BoardBox, ChapterPill, GaugeBox, InfoCard, OutroBox, pop, ProgressBar, StampBox, TitleCard, vis } from './Hud';
import { BubbleBox, FxLayer, GroupBox, HeroSprite, InfoBox, LedBoard, LegendBox, punchAt, RegionPill, ResultsBox, RibbonBox, RopeLine, screenOf, SideList, SubscribeBox, TagPill, Title2Box, VersusBar } from './Hud2';
import { camAt, MapLayer, toScreen, useFlags, Waves } from './MapLayer';
import { setLayout } from './layout';
import { BODY, C, DISPLAY, stroke } from './theme';
import { BY_ID } from './world';

export const MapVideo: React.FC<{ spec: Spec }> = ({ spec }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  setLayout(width, height); // horizontal (vídeo) o vertical (Short)
  const VW = width, VH = height;
  const t = frame / fps;
  if ((getInputProps() as { audioOnly?: boolean }).audioOnly) return <AudioTrack spec={spec} fps={fps} />;
  const flagIds = useMemo(() => [...new Set([...spec.fills.filter((f) => f.flag).flatMap((f) => f.ids), ...spec.heroes.map((h) => h.id)])], [spec]);
  const flags = useFlags(flagIds);

  const v = camAt(t, spec.cams);
  // sacudida de cámara
  let sx = 0, sy = 0;
  for (const s of spec.shakes) {
    const d = t - s.t;
    if (d >= 0 && d < 0.45) { const k = (1 - d / 0.45) ** 2 * s.amp; sx += Math.sin(d * 90) * k; sy += Math.cos(d * 70) * k; }
  }
  const punch = punchAt(spec.fx, t);
  const hero = spec.heroes.find((h) => vis(t, h));
  const heroAnchor: [number, number] | null = hero ? [hero.x + hero.size * 0.3, hero.y + hero.size * 0.05] : null;
  const ropes = spec.ropes.filter((r) => vis(t, r));
  const gaze = ropes.length ? screenOf(v, ropes[ropes.length - 1].to, ropes[ropes.length - 1].at) : null;

  return (
    <AbsoluteFill style={{ background: C.oceanDeep, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px,${sy}px) scale(${1.02 * punch})` }}>
        {flags && <MapLayer v={v} fills={spec.fills} t={t} flags={flags} />}
        <Waves v={v} t={t} />
        {/* caras sobre los países */}
        {spec.faces.filter((f) => t >= f.t0 && t <= f.t1).map((f, i) => {
          const c = BY_ID[f.id];
          const [px, py] = f.at ? toScreen(v, f.at[0], f.at[1]) : toScreen(v, c.c[0], c.c[1]);
          const bw = ((c.bb[1][0] - c.bb[0][0]) / v.w) * VW, bh = ((c.bb[1][1] - c.bb[0][1]) / v.w) * VW;
          const base = Math.max(30, Math.min(340, Math.min(bw, bh * 1.3) * 0.7));
          const size = f.scale >= 0.85 ? Math.max(base * f.scale, 200 * Math.max(1, f.scale)) : base * f.scale; // protagonistas siempre legibles
          if (size < 22 || px < -200 || px > VW + 200 || py < -200 || py > VH + 200) return null;
          const a = pop(t, f.t0, f.t1, 0.4, 0.2);
          return (
            <div key={i} style={{ position: 'absolute', left: px - size / 2, top: py - size / 2, width: size, height: size, transform: `scale(${a})` }}>
              <FaceSvg mood={f.mood} t={t} seed={i * 1.7} size={size} gaze={hero && f.mood !== 'dots' ? [-0.8, -0.2] : undefined} />
              {f.tag && (
                <div style={{ position: 'absolute', top: size * 0.86, left: '50%', transform: 'translateX(-50%)', background: f.tagColor ?? C.ink, color: C.white, border: `3px solid #fff`, borderRadius: 20, padding: '2px 14px', fontFamily: DISPLAY, fontSize: Math.max(22, Math.min(40, size * 0.24)), whiteSpace: 'nowrap', boxShadow: `0 4px 0 rgba(0,0,0,.25)` }}>{f.tag}</div>
              )}
            </div>
          );
        })}
        {spec.tags.filter((x) => vis(t, x)).map((x, i) => <TagPill key={i} x={x} t={t} v={v} />)}
        <FxLayer fx={spec.fx.filter((f) => f.kind === 'pulse')} t={t} v={v} />
      </AbsoluteFill>

      {/* viñeta muy suave */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 62%, rgba(10,40,80,.22) 100%)', pointerEvents: 'none' }} />

      {/* protagonista + cuerdas */}
      {heroAnchor && ropes.map((r, i) => <RopeLine key={i} r={r} t={t} from={heroAnchor} to={screenOf(v, r.to, r.at)} />)}
      {hero && flags && <HeroSprite h={hero} t={t} flag={flags[hero.id]} gaze={gaze} />}

      {/* HUD */}
      {spec.regions.filter((x) => vis(t, x)).map((x, i) => <RegionPill key={i} x={x} t={t} />)}
      {spec.versus.filter((x) => vis(t, x)).map((x, i) => <VersusBar key={i} x={x} t={t} />)}
      {spec.progress.filter((x) => vis(t, x)).map((x, i) => <ProgressBar key={i} x={x} t={t} />)}
      {spec.chapters.filter((x) => vis(t, x)).map((x, i) => <ChapterPill key={i} x={x} t={t} />)}
      {spec.boards.filter((x) => vis(t, x)).map((x, i) => <BoardBox key={i} x={x} t={t} />)}
      {spec.gauges.filter((x) => vis(t, x)).map((x, i) => <GaugeBox key={i} x={x} t={t} />)}
      {spec.leds.filter((x) => vis(t, x)).map((x, i) => <LedBoard key={i} x={x} t={t} />)}
      {spec.lists.filter((x) => vis(t, x)).map((x, i) => <SideList key={i} x={x} t={t} />)}
      {spec.banners.filter((x) => vis(t, x)).map((x, i) => <BannerBox key={i} x={x} t={t} />)}
      {spec.cards.filter((x) => vis(t, x)).map((x, i) => <InfoCard key={i} x={x} t={t} />)}
      {spec.infos.filter((x) => vis(t, x)).map((x, i) => <InfoBox key={i} x={x} t={t} />)}
      {spec.groups.filter((x) => vis(t, x)).map((x, i) => <GroupBox key={i} x={x} t={t} />)}
      {(spec.legends ?? []).filter((x) => vis(t, x)).map((x, i) => <LegendBox key={i} x={x} t={t} />)}
      {(spec.results ?? []).filter((x) => vis(t, x)).map((x, i) => <ResultsBox key={i} x={x} t={t} />)}
      {spec.ribbons.filter((x) => vis(t, x)).map((x, i) => <RibbonBox key={i} x={x} t={t} />)}
      {(spec.subs ?? []).filter((x) => vis(t, x)).map((x, i) => <SubscribeBox key={i} x={x} t={t} />)}
      {spec.bubbles.filter((x) => vis(t, x)).map((x, i) => <BubbleBox key={i} x={x} t={t} v={v} hero={hero} />)}
      {spec.bigs.filter((x) => vis(t, x)).map((x, i) => <BigText key={i} x={x} t={t} />)}
      {spec.stamps.filter((x) => vis(t, x)).map((x, i) => <StampBox key={i} x={x} t={t} />)}
      {spec.titles.filter((x) => vis(t, x)).map((x, i) => <TitleCard key={i} x={x} t={t} />)}
      {spec.titles2.filter((x) => vis(t, x)).map((x, i) => <Title2Box key={i} x={x} t={t} />)}
      {spec.outros.filter((x) => vis(t, x)).map((x, i) => <OutroBox key={i} x={x} t={t} />)}
      <FxLayer fx={spec.fx.filter((f) => f.kind === 'confetti')} t={t} v={v} />

      {/* destellos */}
      {spec.flashes.map((f, i) => {
        const d = t - f.t;
        if (d < 0 || d > 0.35) return null;
        return <AbsoluteFill key={i} style={{ background: f.color, opacity: 0.45 * (1 - d / 0.35) }} />;
      })}
      {spec.source && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 4, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,.85)', textShadow: stroke(1.2, 'rgba(0,0,0,.55)') }}>Fuente: {spec.source}</div>
      )}

      <AudioTrack spec={spec} fps={fps} />
    </AbsoluteFill>
  );
};

// la música baja (con rampas de 0,3 s) durante los redobles de intriga
const duckAt = (spec: Spec, t: number) => {
  let g = 1;
  for (const d of spec.ducks ?? []) {
    if (t < d.t0 - 0.3 || t > d.t1 + 0.6) continue;
    const k = t < d.t0 ? (t - (d.t0 - 0.3)) / 0.3 : t > d.t1 ? 1 - (t - d.t1) / 0.6 : 1;
    g = Math.min(g, 1 - d.amt * Math.max(0, Math.min(1, k)));
  }
  return g;
};

// pistas de audio (también usadas en el modo solo audio: --props='{"audioOnly":true}')
const AudioTrack: React.FC<{ spec: Spec; fps: number }> = ({ spec, fps }) => (
    <AbsoluteFill>
      {spec.music.map((m, i) => (
        <Sequence key={'m' + i} from={Math.round(m.t0 * fps)} durationInFrames={Math.round((m.t1 - m.t0) * fps)}>
          <Audio
            src={staticFile(m.src)}
            startFrom={Math.round((m.offset ?? 0) * fps)}
            volume={(f) => m.gain * duckAt(spec, m.t0 + f / fps) * interpolate(f, [0, 0.6 * fps, (m.t1 - m.t0 - 2.5) * fps, (m.t1 - m.t0) * fps], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          />
        </Sequence>
      ))}
      {spec.sfx.map((s, i) => (
        <Sequence key={'s' + i} from={Math.max(0, Math.round(s.t * fps))} durationInFrames={Math.round(3 * fps)}>
          <Audio src={staticFile(s.name.includes('/') ? `${s.name}.wav` : `audio/sfx/${s.name}.wav`)} volume={s.gain} />
        </Sequence>
      ))}
    </AbsoluteFill>
);
