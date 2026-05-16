import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Cpu, Layout, Save, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { seriesStyles as s } from '../seriesStyles';

interface SeriesHeaderProps {
  onNext: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  onManifest?: () => void;

  isManifestActive?: boolean;
  isSaving?: boolean;
  hasContent?: boolean;
  session: string;
  episode: string;
  content?: string | null;
  status?: 'active' | 'draft' | 'empty';
}

export const SeriesHeader: React.FC<SeriesHeaderProps> = ({
  onNext,
  onPrev,
  onSave,
  onManifest,

  isManifestActive,
  isSaving,
  hasContent,
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-10 h-10 rounded-xl border transition-all duration-500 group/manifest",
                      isManifestActive 
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                        : "bg-white/5 border-white/10 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5"
                    )}
                    onClick={onManifest}
                  >
                    <Box className={cn("w-5 h-5 transition-transform duration-500 group-hover/manifest:scale-110", isManifestActive && "animate-pulse")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-xs">Production Blueprint</p>
                </TooltipContent>
              </Tooltip>



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





