import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CastEmptyStateProps {
  isGeneratingCharacters: boolean;
  handleGenerate: () => void;
  prompt: string;
}

export const CastEmptyState: React.FC<CastEmptyStateProps> = ({
  isGeneratingCharacters,
  handleGenerate,
  prompt
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] text-zinc-600">
      <Users className="w-16 h-16 mb-6 opacity-20" />
      <p className="mb-8 font-sans font-medium text-xs uppercase tracking-widest text-zinc-500">Define your cast to see them come to life.</p>
      <Button 
        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-none shadow-[0_0_20px_rgba(6,182,212,0.4)] font-bold tracking-[0.2em] uppercase text-xs h-12 px-8 rounded-full transition-all hover:scale-105 active:scale-95"
        onClick={handleGenerate}
        disabled={isGeneratingCharacters || !prompt.trim()}
      >
        {isGeneratingCharacters ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
        ) : (
          <UserPlus className="w-4 h-4 mr-3" />
        )}
        Design Characters
      </Button>
    </div>
  );
};
