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
  handleNextEpisode: () => void;
  handleGenerateMetadata: () => void;
  isGeneratingMetadata: boolean;
  handleGenerateImagePrompts: () => void;
  isGeneratingImagePrompts: boolean;
  playVoiceover: (t: string | null) => void;
  session: string;
  episode: string;
  narrativeBeats: string | null;
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
  handleNextEpisode,
  handleGenerateMetadata,
  isGeneratingMetadata,
  handleGenerateImagePrompts,
  isGeneratingImagePrompts,
  playVoiceover,
  session,
  episode,
  narrativeBeats
}) => {
  return (
    <div className="p-4 border-b border-studio/10 bg-[#0a0a0a]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
      <div className="flex items-center gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-studio/10 border border-studio/20 rounded-lg flex items-center gap-2">
            <span className="text-[10px] font-black text-studio uppercase tracking-tighter">Unit</span>
            <span className="text-xs font-black text-white font-mono">S{session}-E{episode}</span>
          </div>
          <div className="w-[1px] h-4 bg-zinc-800" />
          <div className="flex items-center gap-2 text-zinc-500">
            <Sparkles className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-shadow-studio">Active Script</span>
          </div>
          {narrativeBeats && (
            <>
              <div className="w-[1px] h-4 bg-zinc-800" />
              <div className="flex items-center gap-2 text-emerald-500/70">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Beats Synced</span>
              </div>
            </>
          )}
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
          <Clock className="w-3 h-3 text-studio" />
          EST. {calculateDuration(generatedScript)}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Button 
            size="sm" 
            className="bg-studio hover:bg-studio/80 text-white font-black tracking-widest uppercase text-[10px] shadow-studio"
            onClick={handleGenerateScript}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Sparkles className="w-3 h-3 mr-2" />
            )}
            {isLoading ? 'Generating...' : 'Regenerate'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 border-studio/30 bg-studio/5 hover:bg-studio/20 text-studio hover:text-studio text-[10px] font-black uppercase tracking-[0.2em] px-4 shadow-studio"
            onClick={handleNextEpisode}
            disabled={isLoading || !generatedScript}
          >
            <Send className="w-3 h-3 mr-2" />
            Next Episode
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-[10px] text-zinc-400 hover:text-studio hover:bg-studio/10 uppercase tracking-widest font-bold"
            onClick={handleContinueScript}
            disabled={isContinuingScript || !generatedScript}
          >
            {isContinuingScript ? (
              <div className="w-3 h-3 border-2 border-studio/30 border-t-studio rounded-full animate-spin mr-1" />
            ) : (
              <Sparkles className="w-3 h-3 mr-1" />
            )}
            Extend
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-[10px] text-zinc-400 hover:text-studio hover:bg-studio/10 uppercase tracking-widest font-bold"
            onClick={handleGenerateMetadata}
            disabled={isGeneratingMetadata}
          >
            <Search className="w-3 h-3 mr-1" /> SEO
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-[10px] text-zinc-400 hover:text-studio hover:bg-studio/10 uppercase tracking-widest font-bold"
            onClick={handleGenerateImagePrompts}
            disabled={isGeneratingImagePrompts}
          >
            <ImageIcon className="w-3 h-3 mr-1" /> Prompts
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-[10px] text-zinc-400 hover:text-studio hover:bg-studio/10 uppercase tracking-widest font-bold"
            onClick={() => playVoiceover(generatedScript)}
          >
            <Play className="w-3 h-3 mr-1" /> Listen
          </Button>
        </div>
      </div>
    </div>
  );
};
