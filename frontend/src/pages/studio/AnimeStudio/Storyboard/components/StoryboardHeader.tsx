import { ImageIcon, ChevronRight, ChevronLeft, Cpu, Save, Sparkles, Square, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useGeneratorDispatch } from '@/hooks/useGenerator';

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
  content?: string | null;
  status?: 'active' | 'draft' | 'empty';
  progress?: number;
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
  episode,
  status = 'empty',
  progress = 0
}) => {
  const { stopGeneration } = useGeneratorDispatch();

  return (
    <TooltipProvider>
      <div className="relative group">
        <div className="header-container">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className="header-icon-box group/icon !bg-orange-500/10 !border-orange-500/30">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                <ImageIcon className="w-7 h-7 text-orange-500 relative z-10 animate-pulse-slow" />
                <div className="absolute inset-0 border-2 border-orange-500/50 rounded-2xl animate-ping opacity-20" />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3">
                <h1 className="header-title">
                  Visual Storyboard
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Cpu className="w-3.5 h-3.5 text-orange-500/40 shrink-0" />
                <p className="header-subtitle !text-orange-500/40">S{session} // EP{episode} // AI Image Prompt Generator</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full lg:w-auto">
            {onPrev && (
              <Tooltip>
                <TooltipTrigger  >
                  <Button
                    variant="outline"
                    className="relative w-full sm:w-auto h-12 px-8 bg-[#050505] border-white/10 text-zinc-400 hover:text-orange-500 hover:border-orange-500/50 font-black uppercase tracking-widest text-[10px] rounded-full transition-all duration-500 group/back shadow-2xl"
                    onClick={onPrev}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2 group-hover/back:-translate-x-1 transition-transform" />
                    PREVIOUS
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Return to Script Editor</p>
                </TooltipContent>
              </Tooltip>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Tooltip>
                <TooltipTrigger  >
                  {isGenerating ? (
                    <Button
                      variant="outline"
                      className="relative w-full sm:w-auto h-12 px-8 bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black font-black uppercase tracking-widest text-[11px] rounded-full transition-all duration-500 group/stop shadow-[0_0_25px_rgba(239,68,68,0.2)]"
                      onClick={stopGeneration}
                    >
                      <Square className="w-4 h-4 mr-3 fill-current group-hover/stop:scale-110 transition-transform" />
                      <span className="relative z-10">STOP SYNTHESIS</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="relative w-full sm:w-auto h-12 px-8 bg-[#050505] border-white/10 text-zinc-100 hover:text-orange-500 hover:border-orange-500/50 font-black uppercase tracking-widest text-[11px] rounded-full transition-all duration-500 group/btn shadow-2xl"
                      onClick={onRegenerate}
                    >
                      <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-full" />
                      <Sparkles className="w-4 h-4 mr-3 text-orange-500 group-hover/btn:scale-125 transition-transform duration-500" />
                      <span className="relative z-10">GENERATE ALL</span>
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">
                    {isGenerating ? "Terminate Active Process" : "Synthesize AI Storyboard"}
                  </p>
                </TooltipContent>
              </Tooltip>

              {onSave && (
                <Tooltip>
                  <TooltipTrigger  >
                    <Button
                      variant="outline"
                      className="relative w-full sm:w-auto h-12 px-6 bg-orange-500/5 border-orange-500/20 text-orange-500 hover:bg-orange-500/10 font-black uppercase tracking-widest text-[11px] rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(249,115,22,0.1)] group/save"
                      onClick={onSave}
                      disabled={isSaving}
                    >
                      <Save className={cn("w-4 h-4 mr-2", isSaving && "animate-pulse")} />
                      {isSaving ? "SAVING..." : "SAVE ALL"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Save all tabs (sync to cloud)</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger  >
                  <Button
                    className="relative w-full sm:w-auto h-12 px-10 rounded-full bg-[#050505] border border-white/10 text-zinc-400 hover:text-orange-500 hover:border-orange-500/50 font-black uppercase tracking-widest text-[10px] transition-all duration-500 group/next shadow-2xl"
                    onClick={onNext}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      NEXT <ChevronRight className="w-4 h-4 group-hover/next:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover/next:opacity-100 transition-opacity duration-500 rounded-full" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Proceed to SEO Studio</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {isGenerating && progress > 0 && (
          <div className="production-progress-container">
            <div 
              className="production-progress-fill" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
