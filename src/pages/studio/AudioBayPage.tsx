import React, { useState } from 'react';
import { useGenerator } from '@/contexts/GeneratorContext';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { AudioBayTopBar } from '@/components/studio/modules/audio/AudioBayTopBar';
import { AudioBayPanel } from '@/components/studio/modules/audio/AudioBayPanel';

export function AudioBayPage() {
  const { generatedScript } = useGenerator();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingSfx, setIsGeneratingSfx] = useState(false);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const handleTableRead = () => {
    if (!generatedScript || isPlaying) return;
    setIsPlaying(true);
    
    const lines = generatedScript.split('\n').filter(l => l.trim());
    let currentIdx = 0;

    const speakNext = () => {
      if (currentIdx >= lines.length) {
        setIsPlaying(false);
        setActiveSegment(null);
        setProgress(100);
        return;
      }

      setActiveSegment(currentIdx);
      setProgress((currentIdx / lines.length) * 100);
      
      const text = lines[currentIdx];
      const utterance = new SpeechSynthesisUtterance(text.replace(/\|/g, ' '));
      
      // Basic voice assignment simulation
      if (text.includes(':')) {
        utterance.pitch = 1.2;
      } else {
        utterance.pitch = 0.8;
      }

      utterance.onend = () => {
        currentIdx++;
        speakNext();
      };

      window.speechSynthesis.speak(utterance);
    };

    try {
      speakNext();
    } catch (error) {
       handleFirestoreError(error, OperationType.GET, 'audio-bay-read');
       setIsPlaying(false);
    }
  };

  const stopTableRead = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setActiveSegment(null);
  };

  const handleGenerateSfx = () => {
    setIsGeneratingSfx(true);
    setTimeout(() => setIsGeneratingSfx(false), 2000);
  };

  return (
    <div className="pb-20">
      <AudioBayTopBar
        onAction={isPlaying ? stopTableRead : handleTableRead}
        actionDisabled={!generatedScript}
        actionLabel={isPlaying ? 'ABORT READ' : 'START TABLE READ'}
      >
        <AudioBayPanel
          generatedScript={generatedScript}
          progress={progress}
          activeSegment={activeSegment}
          isGeneratingSfx={isGeneratingSfx}
          onGenerateSfx={handleGenerateSfx}
        />
      </AudioBayTopBar>
    </div>
  );
}
