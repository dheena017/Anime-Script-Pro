import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight, Cpu, Terminal, Sparkles, Save, Square, Box, Zap } from 'lucide-react';
import { useGeneratorDispatch } from '@/hooks/useGenerator';
import { promptsStyles as s } from '../promptsStyles';

interface PromptsHeaderProps {
  onRegenerate: () => void;
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
}

export const PromptsHeader: React.FC<PromptsHeaderProps> = ({
  onRegenerate,
  onNext,
  onPrev,
  onSave,
  isSaving,
  hasContent,
  isGenerating,
  session,
  episode,
  status = 'empty'
}) => {
  return (
    <TooltipProvider>
      <div className={s.header.wrapper}>
        <div className={s.header.glow} />
        <div className={s.header.container}>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className={s.header.iconBox}>
                <div className={s.header.iconGlow} />
                <Zap className={s.header.icon} />
                <div className="absolute inset-0 border-2 border-red-500/40 rounded-2xl opacity-20" />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3">
                <h1 className={s.header.title}>
                  System Prompts
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Terminal className="w-3.5 h-3.5 text-red-300/50 shrink-0" />
                <p className={s.header.subtitle}>S{session} // EP{episode} // Global Context</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full lg:w-auto">
            {onPrev && (
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    className={s.header.actionButton}
                    onClick={onPrev}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2 group-hover/back:-translate-x-1 transition-transform" />
                    PREVIOUS
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Return to Script Engine</p>
                </TooltipContent>
              </Tooltip>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Tooltip>
                <TooltipTrigger>
                  {isGenerating ? (
                    <Button
                      variant="ghost"
                      className={s.header.actionButtonDanger}
                    >
                      <Square className="w-4 h-4 mr-2 fill-current animate-pulse" />
                      <span className="relative z-10 text-[9px]">BUSY...</span>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className={s.header.actionButtonPrimary}
                      onClick={onRegenerate}
                    >
                      <Sparkles className="w-4 h-4 mr-2 group-hover/btn:scale-125 transition-transform duration-300" />
                      <span className="relative z-10">REBUILD ALL</span>
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">
                    {isGenerating ? "Synthesis in progress" : "Rebuild global prompt nexus"}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    className={s.header.actionButtonPrimary}
                    onClick={onNext}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      NEXT <ChevronRight className="w-4 h-4 group-hover/next:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Proceed to Post-Production</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};




