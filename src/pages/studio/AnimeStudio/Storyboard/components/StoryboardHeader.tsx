import React from 'react';
import { RefreshCw, Image as ImageIcon, ChevronRight, ChevronLeft, Cpu, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface StoryboardHeaderProps {
  isLiked?: boolean;
  setIsLiked?: (liked: boolean) => void;
  isGuideOpen?: boolean;
  setIsGuideOpen?: (open: boolean) => void;
  handleEnhanceAllVisuals?: () => void;
  handleEnhanceAllNarration?: () => void;
  onRegenerate: () => void;
  isGlobalEnhancing?: boolean;
  isGenerating: boolean;
  onNext: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  hasContent?: boolean;
  session: string;
  episode: string;
}

export const StoryboardHeader: React.FC<StoryboardHeaderProps> = ({
  onRegenerate,
  onNext,
  onPrev,
  onSave,
  isSaving,
  hasContent,
  isGenerating,
  session,
  episode
}) => {
  return (
    <TooltipProvider>
      <div className="relative group">
        <div className="storyboard-header-box">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10 w-full lg:w-auto">
            <div className="storyboard-icon-box">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
              <ImageIcon className="w-7 h-7 text-orange-500 relative z-10 animate-pulse-slow" />
              <div className="absolute inset-0 border-2 border-orange-500/50 rounded-2xl animate-ping opacity-20" />
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h1 className="storyboard-title">
                Visual Storyboard
              </h1>
              <div className="storyboard-subtitle">
                <Cpu className="w-3.5 h-3.5 text-orange-500/40 shrink-0" />
                <p>S{session} // EP{episode} // AI Image Prompt Generator</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full lg:w-auto">
            {onPrev && (
              <Tooltip>
                <TooltipTrigger>
                  <Button 
                    variant="outline" 
                    className="relative w-full sm:w-auto h-12 px-8 bg-[#050505] border-white/10 text-zinc-400 hover:text-orange-500 hover:border-orange-500/50 font-black uppercase tracking-widest text-[10px] rounded-full transition-all duration-500 backdrop-blur-md group/back shadow-2xl"
                    onClick={onPrev}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2 group-hover/back:-translate-x-1 transition-transform" />
                    PREVIOUS
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Return to Script Architect</p>
                </TooltipContent>
              </Tooltip>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Tooltip>
                <TooltipTrigger>
                  <Button 
                    variant="outline" 
                    className="relative w-full sm:w-auto h-12 px-8 bg-[#050505] border-white/10 text-zinc-100 hover:text-orange-500 hover:border-orange-500/50 font-black uppercase tracking-widest text-[11px] rounded-full transition-all duration-500 backdrop-blur-md group/btn shadow-2xl"
                    onClick={onRegenerate}
                    disabled={isGenerating}
                  >
                    <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-full" />
                    {isGenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-3 text-orange-500" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-3 text-orange-500 group-hover/btn:scale-125 transition-transform duration-500" />
                    )}
                    <span className="relative z-10">GENERATE</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Generate AI Storyboard Prompts</p>
                </TooltipContent>
              </Tooltip>

              {onSave && hasContent && (
                <Tooltip>
                  <TooltipTrigger>
                    <Button 
                      variant="outline" 
                      className="relative w-full sm:w-auto h-12 px-6 bg-orange-500/5 border-orange-500/20 text-orange-500 hover:bg-orange-500/10 font-black uppercase tracking-widest text-[11px] rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(249,115,22,0.1)] group/save"
                      onClick={onSave}
                      disabled={isSaving}
                    >
                      <Save className={cn("w-4 h-4 mr-2", isSaving && "animate-pulse")} />
                      {isSaving ? "SAVING..." : "SAVE"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Manual Cloud Sync</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger>
                  <Button 
                    className="relative w-full sm:w-auto h-12 px-10 rounded-full bg-[#050505] border border-white/10 text-zinc-400 hover:text-orange-500 hover:border-orange-500/50 font-black uppercase tracking-widest text-[10px] transition-all duration-500 backdrop-blur-md group/next shadow-2xl"
                    onClick={onNext}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      NEXT <ChevronRight className="w-4 h-4 group-hover/next:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover/next:opacity-100 transition-opacity duration-500 rounded-full" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Proceed to Next Phase</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
