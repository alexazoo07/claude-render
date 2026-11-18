import React from 'react';
import './fonts';
import {Composition} from 'remotion';
import {Full, FPS} from './Full';
import {NFull} from './NFull';
import J from './beats.json';
import N from './npc.json';
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="JasonLucia" component={Full} durationInFrames={Math.round((J as any).end * FPS)} fps={FPS} width={1920} height={1080} />
    <Composition id="NPCs" component={NFull} durationInFrames={Math.round((N as any).end * FPS)} fps={FPS} width={1920} height={1080} />
  </>
);
