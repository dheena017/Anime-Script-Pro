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
          {/* Subtle Background Circuit Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
          
          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-6 md:gap-10 z-10 w-full lg:w-auto">
            <div className="relative shrink-0 group/icon">
              <div className={s.header.iconBox}>
                <div className={s.header.iconGlow} />
                <Layout className={s.header.icon} />
              </div>
              {/* Outer Pulsing Ring */}
              <div className="absolute -inset-2 border border-emerald-500/20 rounded-[2rem] animate-[ping_3s_infinite] opacity-0 group-hover/icon:opacity-100 transition-opacity" />
            </div>

            <div className="flex flex-row items-center sm:items-start text-center sm:text-left space-y-1">
              <div className="flex items-center gap-4">
                 <h1 className={s.header.title}>
                   Series Roadmap
                 </h1>
                 {hasContent && (
                   <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-in fade-in slide-in-from-left-2 duration-500">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                     <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Production Active</span>
                   </div>
                 )}
              </div>

            </div>
          </div>

          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-5 z-10 w-full lg:w-auto justify-center sm:justify-start">
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
                <TooltipContent side="bottom" className="bg-black/90 border-white/10 backdrop-blur-xl">
                  <p className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Return to Character Designer</p>
                </TooltipContent>
              </Tooltip>
            )}

            <div className="flex flex-row items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-12 h-12 rounded-2xl border transition-all duration-700 group/manifest relative overflow-hidden",
                      isManifestActive 
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]" 
                        : "bg-white/[0.03] border-white/10 text-zinc-600 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/5"
                    )}
                    onClick={onManifest}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover/manifest:opacity-100 transition-opacity" />
                    <Box className={cn("w-5 h-5 relative z-10 transition-transform duration-500 group-hover/manifest:scale-110", isManifestActive && "animate-pulse")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-black/90 border-white/10 backdrop-blur-xl">
                  <p className="font-black uppercase tracking-widest text-[10px] text-emerald-500/80">Production Blueprint</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={cn(s.header.nextButton, "relative group/next overflow-hidden")}
                    onClick={onNext}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/next:translate-x-full transition-transform duration-1000 ease-in-out" />
                    <span className="relative z-10 flex items-center gap-2">
                      NEXT <ChevronRight className="w-4 h-4 group-hover/next:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-black/90 border-white/10 backdrop-blur-xl">
                  <p className="font-black uppercase tracking-widest text-[10px] text-emerald-400">Proceed to Next Phase</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};





