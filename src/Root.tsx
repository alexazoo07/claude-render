import React from 'react';
import { Composition, Still } from 'remotion';
import { MapVideo } from './engine/MapVideo';
import { Thumb } from './engine/Thumb';
import { VIDEOS } from './videos';

export const Root: React.FC = () => (
  <>
    {VIDEOS.map(({ spec, thumbs }) => (
      <React.Fragment key={spec.id}>
        <Composition id={`V-${spec.id}`} component={MapVideo} durationInFrames={Math.round(spec.dur * (spec.fps ?? 30))} fps={spec.fps ?? 30} width={spec.vw ?? 1920} height={spec.vh ?? 1080} defaultProps={{ spec }} />
        {thumbs.map((cfg, n) => (
          <Still key={n} id={`T-${spec.id}-${n + 1}`} component={Thumb} width={1280} height={720} defaultProps={{ cfg }} />
        ))}
      </React.Fragment>
    ))}
  </>
);
