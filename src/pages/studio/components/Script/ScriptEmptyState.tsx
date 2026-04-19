import React from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScriptEmptyStateProps {
  isLoading: boolean;
  prompt: string;
  handleGenerateScript: () => void;
}

export const ScriptEmptyState: React.FC<ScriptEmptyStateProps> = ({
  isLoading,
  prompt,
  handleGenerateScript
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] text-zinc-600">
      <Sparkles className="w-16 h-16 mb-6 opacity-20" />
      <p className="mb-8 font-sans font-medium text-xs uppercase tracking-widest">Awaiting prompt to initialize sequence.</p>
      <Button 
        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-none shadow-[0_0_20px_rgba(6,182,212,0.4)] font-bold tracking-[0.2em] uppercase text-xs h-12 px-8 rounded-full transition-all hover:scale-105 active:scale-95"
        onClick={handleGenerateScript}
        disabled={isLoading || !prompt.trim()}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
        ) : (
          <Send className="w-4 h-4 mr-3" />
        )}
        Launch Production
      </Button>
    </div>
  );
};
