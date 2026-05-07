import React from 'react';
import { Zap } from 'lucide-react';

interface WorldEmptyStateProps {
  isGenerating: boolean;
  label?: string;
}

export const WorldEmptyState: React.FC<WorldEmptyStateProps> = ({
  isGenerating,
  label = "World Lore"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
      <div className="relative">
        <Zap className={`w-12 h-12 text-studio ${isGenerating ? 'animate-pulse' : 'opacity-20'}`} />
        {isGenerating && (
          <div className="absolute inset-0 bg-studio/20 blur-xl rounded-full animate-pulse" />
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/90">
          {isGenerating ? 'Synthesizing...' : 'Empty Manifest'}
        </h3>
        <p className="text-xs text-zinc-500 max-w-[280px] leading-relaxed tracking-wider">
          {isGenerating 
            ? `Our Neural Engine is architecting your ${label.toLowerCase()} now.` 
            : `Your ${label.toLowerCase()} is currently empty. Generate the output to continue.`}
        </p>
      </div>

    </div>
  );
};




