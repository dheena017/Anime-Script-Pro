import React from 'react';
import { Users, UserPlus, Sparkles, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';

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
  const { session, episode } = useGenerator();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-studio text-shadow-studio">
          <Users className="w-5 h-5 text-studio" />
          Character Cast
        </h2>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-studio/5 border border-studio/20 rounded-lg">
          <Box className="w-3 h-3 text-studio/50" />
          <span className="text-[10px] font-black text-studio/60 uppercase tracking-tighter">Unit</span>
          <span className="text-xs font-black text-white font-mono">S{session}-E{episode}</span>
        </div>
      </div>
      <Button 
        size="sm" 
        className="bg-studio hover:bg-studio/80 text-white font-black tracking-widest uppercase text-xs h-9 px-6 shadow-studio"
        onClick={handleGenerate}
        disabled={isGeneratingCharacters || !prompt.trim()}
      >
        {isGeneratingCharacters ? (
          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
        ) : (
          <Sparkles className="w-3 h-3 mr-2" />
        )}
        {isGeneratingCharacters ? 'Sketching...' : 'Generate'}
      </Button>
    </div>
  );
};
