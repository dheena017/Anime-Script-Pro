import React from 'react';
import { Sparkles, Heart, Clock, Send, Search, ImageIcon, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScriptHeaderInfoProps {
  isLiked: boolean;
  setIsLiked: (l: boolean) => void;
  generatedScript: string | null;
  calculateDuration: (t: string | null) => string;
  handleGenerateScript: () => void;
  isLoading: boolean;
  prompt: string;
  handleContinueScript: () => void;
  isContinuingScript: boolean;
  handleGenerateMetadata: () => void;
  isGeneratingMetadata: boolean;
  handleGenerateImagePrompts: () => void;
  isGeneratingImagePrompts: boolean;
  playVoiceover: (t: string | null) => void;
}

export const ScriptHeaderInfo: React.FC<ScriptHeaderInfoProps> = ({
  isLiked, setIsLiked,
  generatedScript,
  calculateDuration,
  handleGenerateScript,
  isLoading,
  prompt,
  handleContinueScript,
  isContinuingScript,
  handleGenerateMetadata,
  isGeneratingMetadata,
  handleGenerateImagePrompts,
  isGeneratingImagePrompts,
  playVoiceover
}) => {
  return (
    <div className="p-4 border-b border-cyan-500/10 bg-[#0a0a0a]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
      <div className="flex items-center gap-4 relative z-10">
        <div className="flex items-center gap-2 text-cyan-400">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">AI Generated Script</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 rounded-full transition-all duration-300",
            isLiked ? "text-fuchsia-400 bg-fuchsia-500/10 shadow-[0_0_10px_rgba(217,70,239,0.2)]" : "text-zinc-600 hover:text-fuchsia-400 hover:bg-[#0a0a0a]"
          )}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 relative z-10">
        <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono font-bold bg-black/50 px-2 py-1 rounded border border-zinc-800">
          <Clock className="w-3 h-3 text-cyan-500" />
          EST. {calculateDuration(generatedScript)}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-[10px] text-zinc-400 hover:text-cyan-300 hover:bg-cyan-900/20 uppercase tracking-widest font-bold"
            onClick={handleGenerateScript}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <div className="w-3 h-3 border border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mr-1.5" />
            ) : (
              <Send className="w-3 h-3 mr-1.5" />
            )}
            {isLoading ? 'Generating...' : 'Generate Script'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-[10px] text-zinc-400 hover:text-cyan-300 hover:bg-cyan-900/20 uppercase tracking-widest font-bold"
            onClick={handleContinueScript}
            disabled={isContinuingScript || !generatedScript}
          >
            {isContinuingScript ? (
              <div className="w-3 h-3 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mr-1" />
            ) : (
              <Sparkles className="w-3 h-3 mr-1" />
            )}
            Continue
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-[10px] text-zinc-400 hover:text-cyan-300 hover:bg-cyan-900/20 uppercase tracking-widest font-bold"
            onClick={handleGenerateMetadata}
            disabled={isGeneratingMetadata}
          >
            <Search className="w-3 h-3 mr-1" /> SEO
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-[10px] text-zinc-400 hover:text-cyan-300 hover:bg-cyan-900/20 uppercase tracking-widest font-bold"
            onClick={handleGenerateImagePrompts}
            disabled={isGeneratingImagePrompts}
          >
            <ImageIcon className="w-3 h-3 mr-1" /> Prompts
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-[10px] text-zinc-400 hover:text-cyan-300 hover:bg-cyan-900/20 uppercase tracking-widest font-bold"
            onClick={() => playVoiceover(generatedScript)}
          >
            <Play className="w-3 h-3 mr-1" /> Listen
          </Button>
        </div>
      </div>
    </div>
  );
};
