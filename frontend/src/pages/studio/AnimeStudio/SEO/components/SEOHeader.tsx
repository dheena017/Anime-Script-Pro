import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Cpu, Search, Sparkles, Save, Square, Box, Globe, RefreshCw, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGeneratorDispatch } from '@/hooks/useGenerator';
import { seoStyles as s } from '../seoStyles';

interface SEOHeaderProps {
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

export const SEOHeader: React.FC<SEOHeaderProps> = ({
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
      <div className={s.header.wrapper}>
        <div className={s.header.glow} />
        <div className={s.header.container}>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className={s.header.iconBox}>
                <div className={s.header.iconGlow} />
                <Globe className={s.header.icon} />
                <div className="absolute inset-0 border-2 border-emerald-500/40 rounded-2xl opacity-20" />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3">
                <h1 className={s.header.title}>
                  SEO Master
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300/50 shrink-0" />
                <p className={s.header.subtitle}>S{session} // EP{episode} // Distribution Protocol</p>
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
                      className="relative w-full sm:w-auto h-10 px-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/60 hover:text-emerald-300 font-black uppercase tracking-widest text-[9px] transition-all duration-300 shadow-lg"
                    >
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      <span className="relative z-10">ANALYZING...</span>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="relative w-full sm:w-auto h-10 px-8 rounded-full border border-white/10 bg-white text-black hover:bg-zinc-100 hover:border-emerald-500/50 hover:text-emerald-500 font-black uppercase tracking-widest text-[9px] transition-all duration-300 shadow-lg"
                      onClick={onRegenerate}
                    >
                      <Sparkles className="w-4 h-4 mr-2 group-hover/btn:scale-125 transition-transform duration-300" />
                      <span className="relative z-10">OPTIMIZE ALL</span>
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">
                    {isGenerating ? "Optimization in progress" : "Launch full metadata optimization"}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    className="relative w-full sm:w-auto h-10 px-8 rounded-full border border-white/10 bg-white text-black hover:bg-zinc-100 hover:border-emerald-500/50 hover:text-emerald-500 font-black uppercase tracking-widest text-[9px] transition-all duration-300 shadow-lg"
                    onClick={onNext}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      NEXT <ChevronRight className="w-4 h-4 group-hover/next:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Proceed to Global Prompts</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};





