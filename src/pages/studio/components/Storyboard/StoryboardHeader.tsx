import React from 'react';
import { Layout, Heart, BookOpen, ChevronUp, ChevronDown, Plus, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StoryboardHeaderProps {
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  isGuideOpen: boolean;
  setIsGuideOpen: (open: boolean) => void;
  handleAddScene: () => void;
  scenesLength: number;
  handleEnhanceAllVisuals: () => void;
  handleEnhanceAllNarration: () => void;
  handleGenerateAll: () => void;
  isGlobalEnhancing: boolean;
  isGeneratingVisuals: boolean;
  isEnhancingAllVisuals: boolean;
  isEnhancingAllNarration: boolean;
}

export const StoryboardHeader: React.FC<StoryboardHeaderProps> = ({
  isLiked,
  setIsLiked,
  isGuideOpen,
  setIsGuideOpen,
  handleAddScene,
  scenesLength,
  handleEnhanceAllVisuals,
  handleEnhanceAllNarration,
  handleGenerateAll,
  isGlobalEnhancing,
  isGeneratingVisuals,
  isEnhancingAllVisuals,
  isEnhancingAllNarration
}) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black uppercase tracking-[0.15em] flex items-center gap-3 text-cyan-50 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
          <Layout className="w-6 h-6 text-cyan-400" />
          Visual Storyboard
        </h2>
        <p className="text-cyan-500/60 font-bold uppercase tracking-widest text-xs">
          Plan your shots, refine camera angles, and generate visual concepts.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/50 pb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full transition-all duration-300 border border-transparent flex-shrink-0",
              isLiked ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]" : "text-zinc-600 hover:text-cyan-400 hover:bg-zinc-800/50"
            )}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-800 bg-[#0a0a0a]/50 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-zinc-400 uppercase tracking-wider text-[10px] font-bold h-9 transition-colors"
            onClick={() => setIsGuideOpen(!isGuideOpen)}
          >
            <BookOpen className="w-3.5 h-3.5 mr-2" />
            Planning Guide
            {isGuideOpen ? <ChevronUp className="w-3.5 h-3.5 ml-2" /> : <ChevronDown className="w-3.5 h-3.5 ml-2" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-800 bg-[#0a0a0a]/50 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-zinc-400 uppercase tracking-wider text-[10px] font-bold h-9 transition-colors"
            onClick={handleAddScene}
          >
            <Plus className="w-3.5 h-3.5 mr-2" />
            Add Scene
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {scenesLength > 0 ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 uppercase tracking-wider text-[10px] font-bold h-9 shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all"
                onClick={handleEnhanceAllVisuals}
                disabled={isGlobalEnhancing || isGeneratingVisuals}
              >
                {isEnhancingAllVisuals ? (
                  <div className="w-3.5 h-3.5 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                )}
                {isEnhancingAllVisuals ? 'Enhancing...' : 'Refine Camera & Visuals'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 uppercase tracking-wider text-[10px] font-bold h-9 shadow-[0_0_15px_rgba(249,115,22,0.1)] transition-all"
                onClick={handleEnhanceAllNarration}
                disabled={isGlobalEnhancing || isGeneratingVisuals}
              >
                {isEnhancingAllNarration ? (
                  <div className="w-3.5 h-3.5 border-2 border-orange-500/30 border-t-orange-400 rounded-full animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                )}
                {isEnhancingAllNarration ? 'Enhancing...' : 'Refine All Narration'}
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] uppercase tracking-wider text-[10px] font-bold h-9 transition-all"
                onClick={handleGenerateAll}
                disabled={isGeneratingVisuals || isGlobalEnhancing}
              >
                {isGeneratingVisuals ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5 mr-2" />
                )}
                {isGeneratingVisuals ? 'Rendering All...' : 'Render Frames'}
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};
