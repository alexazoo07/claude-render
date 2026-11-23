import React from 'react';
import './fonts';
import {Composition} from 'remotion';
import {Full, FPS} from './Full';
import {NFull} from './NFull';
import J from './beats.json';
import N from './npc.json';
import {S1, S1FPS, S1END} from './S1';
import {S2, S2END} from './S2';
import {S3, S3END} from './S3';
import {S4, S4END} from './S4';
import {S5, S5END} from './S5';
import {LV2, LV2HQ, LV2END} from './LV2';
import {Thumb1, Thumb2, Thumb3, Thumb4, Thumb5} from './Thumbs';
import {LV1HQ, LV1END} from './LV1';
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="JasonLucia" component={Full} durationInFrames={Math.round((J as any).end * FPS)} fps={FPS} width={1920} height={1080} />
    <Composition id="NPCs" component={NFull} durationInFrames={Math.round((N as any).end * FPS)} fps={FPS} width={1920} height={1080} />
    <Composition id="Short1" component={S1} durationInFrames={Math.round(S1END * S1FPS)} fps={S1FPS} width={1080} height={1920} />
    <Composition id="Short2" component={S2} durationInFrames={Math.round(S2END * 60)} fps={60} width={1080} height={1920} />
    <Composition id="Short3" component={S3} durationInFrames={Math.round(S3END * 60)} fps={60} width={1080} height={1920} />
    <Composition id="Short4" component={S4} durationInFrames={Math.round(S4END * 60)} fps={60} width={1080} height={1920} />
    <Composition id="Short5" component={S5} durationInFrames={Math.round(S5END * 60)} fps={60} width={1080} height={1920} />
    <Composition id="LV2" component={LV2} durationInFrames={Math.round(LV2END * 60)} fps={60} width={1920} height={1080} />
    <Composition id="LV2HQ" component={LV2HQ} durationInFrames={Math.round(LV2END * 60)} fps={60} width={2560} height={1440} />
    <Composition id="Thumb1" component={Thumb1} durationInFrames={1} fps={60} width={1080} height={1920} />
    <Composition id="Thumb2" component={Thumb2} durationInFrames={1} fps={60} width={1080} height={1920} />
    <Composition id="Thumb3" component={Thumb3} durationInFrames={1} fps={60} width={1080} height={1920} />
    <Composition id="Thumb4" component={Thumb4} durationInFrames={1} fps={60} width={1080} height={1920} />
    <Composition id="Thumb5" component={Thumb5} durationInFrames={1} fps={60} width={1080} height={1920} />
    <Composition id="LV1" component={LV1HQ} durationInFrames={Math.round(LV1END * 60)} fps={60} width={2560} height={1440} />
  </>
);
