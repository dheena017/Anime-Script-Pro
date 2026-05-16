import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Cpu, FileText, Sparkles, Save, Square, Box } from 'lucide-react';
import { useGeneratorDispatch } from '@/hooks/useGenerator';
import { scriptStyles as s } from '../scriptStyles';

interface ScriptHeaderProps {
  onRegenerate: () => void;
  onGenerateAll?: () => void;
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

export const ScriptHeader: React.FC<ScriptHeaderProps> = ({
  onRegenerate,
  onGenerateAll,
  isGenerating,
  onNext,
  onPrev,
  onSave,
  isSaving,
  hasContent,
  session,
  episode,
  status = 'empty'
}) => {
  const { stopGeneration } = useGeneratorDispatch();

  return (
    <TooltipProvider>
      <div className={s.header.wrapper}>
        <div className={s.header.glow} />
        <div className={s.header.container}>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className={s.header.iconBox}>
                <div className={s.header.iconGlow} />
                <FileText className={s.header.icon} />
                <div className="absolute inset-0 border-2 border-blue-500/40 rounded-2xl opacity-20" />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3">
                <h1 className={s.header.title}>
                   Script Editor
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Cpu className="w-3.5 h-3.5 text-blue-300/50 shrink-0" />
                <p className={s.header.subtitle}>S{session} // EP{episode} // AI Script Engine</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full lg:w-auto">
            {onPrev && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={s.header.actionButton}
                    onClick={onPrev}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2 group-hover/back:-translate-x-1 transition-transform" />
                    PREVIOUS
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-xs">Return to Series Roadmap</p>
                </TooltipContent>
              </Tooltip>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isGenerating ? (
                      <Button
                        className={s.header.actionButtonDanger}
                        onClick={stopGeneration}
                      >
                        <Square className="w-4 h-4 mr-2 fill-current group-hover/stop:scale-110 transition-transform" />
                        <span className="relative z-10">STOP</span>
                      </Button>
                    ) : (
                      <Button
                        className={s.header.actionButtonPrimary}
                        onClick={onRegenerate}
                      >
                        <Sparkles className="w-4 h-4 mr-2 group-hover/btn:scale-125 transition-transform duration-300" />
                        <span className="relative z-10">GENERATE</span>
                      </Button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-xs">
                      {isGenerating ? "Terminate Active Process" : "Generate Current AI Script"}
                    </p>
                  </TooltipContent>
                </Tooltip>

                {!isGenerating && onGenerateAll && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className={s.header.actionButtonPrimary}
                        onClick={onGenerateAll}
                      >
                        <Box className="w-4 h-4 mr-2 group-hover/batch:rotate-12 transition-transform duration-300" />
                        <span className="relative z-10">GENERATE ALL</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="font-black uppercase tracking-widest text-xs">Batch Generate Entire Series</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
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
                  <p className="font-black uppercase tracking-widest text-xs">Proceed to Next Phase</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};




