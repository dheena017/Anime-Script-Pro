import React from 'react';
import { Globe, Map, Book, Shield, Sparkles } from 'lucide-react';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';
import { Button } from '@/components/ui/button';

interface WorldEmptyStateProps {
  onLaunch: () => void;
  onLoadDemo?: () => void;
  isGenerating: boolean;
}

export const WorldEmptyState: React.FC<WorldEmptyStateProps> = ({
  onLaunch,
  onLoadDemo,
  isGenerating
}) => {
  const features = [
    { icon: Map, title: 'Geographic Synthesis', description: 'AI manifests terrain, climates, and strategic points' },
    { icon: Book, title: 'Lore Generation', description: 'Auto-generates historical timelines and cultural norms' },
    { icon: Shield, title: 'Rule Definition', description: 'Defines the metaphysical and physical laws of reality' }
  ];

  return (
    <div className="space-y-6">
      <StudioEmptyState
        icon={Globe}
        title="Build Your World"
        description="Your story's foundation is currently empty. Generate your world to see its history, geography, and laws come to life."
        actionLabel="Create My World"
        loadingLabel="Crafting Your World..."
        onAction={onLaunch}
        isLoading={isGenerating}
        features={features}
        accentColor="studio"
      />
      
      {!isGenerating && onLoadDemo && (
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            onClick={onLoadDemo}
            className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500 hover:text-studio transition-all gap-2"
          >
            <Sparkles className="w-3 h-3" />
            Load Aetheria World Lore
          </Button>
        </div>
      )}
    </div>
  );
};




