import React from 'react';
import { ScriptView } from '../components/ScriptView';

interface TeleprompterTabProps {
  generatedScript: string | null;
  prompt: string;
  session: string;
  episode: string;
  audience: string;
  visualData: any;
}

export const TeleprompterTab: React.FC<TeleprompterTabProps> = ({
  generatedScript,
  prompt,
  session,
  episode,
  audience,
  visualData
}) => {
  if (!generatedScript) return null;

  return (
    <ScriptView
      generatedScript={generatedScript}
      prompt={prompt}
      session={session}
      episode={episode}
      audience={audience}
      visualData={visualData}
    />
  );
};



