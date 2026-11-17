import React from 'react';
import './fonts';
import {Composition} from 'remotion';
import {Full, FPS} from './Full';
import J from './beats.json';
export const RemotionRoot: React.FC = () => (
  <Composition id="JasonLucia" component={Full} durationInFrames={Math.round((J as any).end * FPS)} fps={FPS} width={1920} height={1080} />
);
