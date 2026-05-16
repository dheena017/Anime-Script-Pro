import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Cpu, Layout, Save, Sparkles, Square, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGeneratorDispatch } from '@/hooks/useGenerator';
import { seriesStyles as s } from '../seriesStyles';

interface SeriesHeaderProps {
  onRegenerate: () => void;
  isGenerating: boolean;
  onNext: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  onManifest?: () => void;
  onClear?: () => void;
  isManifestActive?: boolean;
  isSaving?: boolean;
  hasContent?: boolean;
  session: string;
  episode: string;
  content?: string | null;
  status?: 'active' | 'draft' | 'empty';
}

export const SeriesHeader: React.FC<SeriesHeaderProps> = ({
  onRegenerate,
  isGenerating,
  onNext,
  onPrev,
  onSave,
  onManifest,
  onClear,
  isManifestActive,
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
                <Layout className={s.header.icon} />
                <div className="absolute inset-0 border-2 border-emerald-500/40 rounded-2xl opacity-20" />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3">
                 <h1 className={s.header.title}>
                   Series Roadmap
                 </h1>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-300/50 shrink-0" />
                <p className={s.header.subtitle}>S{session} // EP{episode} // AI Story Planner</p>
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
                  <p className="font-black uppercase tracking-widest text-xs">Return to Character Designer</p>
                </TooltipContent>
              </Tooltip>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  {isGenerating ? (
                    <Button
                      className={s.header.actionButtonDanger}
                      onClick={stopGeneration}
                    >
                      <Square className="w-4 h-4 mr-3 fill-current group-hover/stop:scale-110 transition-transform" />
                      <span className="relative z-10">STOP SYNTHESIS</span>
                    </Button>
                  ) : (
                    <Button
                      className={s.header.actionButtonPrimary}
                      onClick={onRegenerate}
                    >
                      <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-full" />
                      <Sparkles className="w-4 h-4 mr-3 text-emerald-500 group-hover/btn:scale-125 transition-transform duration-500" />
                      <span className="relative z-10">GENERATE ALL</span>
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-xs">
                    {isGenerating ? "Terminate Active Process" : "Generate AI Roadmap"}
                  </p>
                </TooltipContent>
              </Tooltip>

              {!isManifestActive && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className={s.header.blueprintButton}
                      onClick={onManifest}
                    >
                      <Box className="w-4 h-4 mr-2" />
                      BLUEPRINT
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-xs">Open Production Blueprint</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {onClear && hasContent && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 rounded-full border border-red-500/10 bg-red-500/5 text-red-400/60 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear the entire production manifest? This action cannot be undone.')) {
                          onClear();
                        }
                      }}
                    >
                      <Square className="w-4 h-4 fill-current opacity-20" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-xs">Clear Manifest (Reset to Empty)</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={s.header.nextButton}
                    onClick={onNext}
                  >
                    <span className="relative z-10 flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                      NEXT <ChevronRight className="w-4 h-4 group-hover/next:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/next:opacity-100 transition-opacity duration-500 rounded-full" />
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





