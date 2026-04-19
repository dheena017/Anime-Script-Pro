import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CastHeaderProps {
  isGeneratingCharacters: boolean;
  handleGenerate: () => void;
  prompt: string;
}

export const CastHeader: React.FC<CastHeaderProps> = ({
  isGeneratingCharacters,
  handleGenerate,
  prompt
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-100 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">
        <Users className="w-5 h-5 text-cyan-400" />
        Character Cast
      </h2>
      <Button 
        variant="outline" 
        size="sm" 
        className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 h-8 px-3"
        onClick={handleGenerate}
        disabled={isGeneratingCharacters || !prompt.trim()}
      >
        {isGeneratingCharacters ? (
          <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mr-2" />
        ) : (
          <UserPlus className="w-4 h-4 mr-2" />
        )}
        {isGeneratingCharacters ? 'Designing...' : 'Regenerate Cast'}
      </Button>
    </div>
  );
};
