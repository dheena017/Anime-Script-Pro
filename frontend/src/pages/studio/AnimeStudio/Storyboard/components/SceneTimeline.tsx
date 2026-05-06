import React from 'react';
import { TimelineHeader } from './TimelineHeader';
import { TimelineTrack } from './TimelineTrack';

interface Scene {
  id: string;
  section: string;
  duration: string;
}

interface SceneTimelineProps {
  scenes: Scene[];
}

export const SceneTimeline = React.memo<SceneTimelineProps>(({ scenes }) => {
  const totalDuration = React.useMemo(() => 
    scenes.reduce((acc, s) => acc + (parseInt(s.duration) || 5), 0),
    [scenes]
  );

  return (
    <div className="space-y-4">
      <TimelineHeader totalDuration={totalDuration} />
      <TimelineTrack scenes={scenes} />
    </div>
  );
});
