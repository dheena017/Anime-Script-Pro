import React from 'react';
import { Users, Fingerprint, Brain, Database, Sparkles } from 'lucide-react';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';
import { Button } from '@/components/ui/button';

interface CastEmptyStateProps {
  onLaunch: () => void;
  onLoadDemo?: () => void;
  isGenerating: boolean;
}

export const CastEmptyState: React.FC<CastEmptyStateProps> = ({
  onLaunch,
  onLoadDemo,
  isGenerating
}) => {
  const features = [
    { icon: Fingerprint, title: 'DNA Synthesis', description: 'Unique personality markers and backstories' },
    { icon: Brain, title: 'Cognitive Mapping', description: 'AI determines relationship dynamics and arcs' },
    { icon: Database, title: 'Lore Integration', description: 'Auto-checks for consistency with world history' }
  ];

  return (
    <div className="space-y-6">
      <StudioEmptyState
        icon={Users}
        title="Empty Cast List"
        description="Your production has no characters yet. Generate a rich cast with unique personalities, backstories, and dynamic relationships."
        actionLabel="Create Characters"
        loadingLabel="Assembling Your Cast..."
        onAction={onLaunch}
        isLoading={isGenerating}
        features={features}
        accentColor="cyan"
      />
      
      {!isGenerating && onLoadDemo && (
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            onClick={onLoadDemo}
            className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500 hover:text-cyan-400 transition-all gap-2"
          >
            <Sparkles className="w-3 h-3" />
            Load Aetheria Sample Cast
          </Button>
        </div>
      )}
    </div>
  );
};




