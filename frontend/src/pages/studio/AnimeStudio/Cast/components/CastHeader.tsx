import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight, Cpu, Users, Save, Square, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { castStyles as s } from '../castStyles';

interface CastHeaderProps {
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

export const CastHeader: React.FC<CastHeaderProps> = ({
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
  const { numCharacters } = useGeneratorState();
  const { stopGeneration, setNumCharacters } = useGeneratorDispatch();

  return (
    <TooltipProvider>
      <div className={s.header.wrapper}>
        <div className={s.header.glow} />
        <div className={s.header.container}>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className={s.header.iconBox}>
                <div className={s.header.iconGlow} />
                <Users className="w-7 h-7 text-fuchsia-400 relative z-10 drop-shadow-[0_6px_20px_rgba(236,72,153,0.18)]" />
                <div className="absolute inset-0 border-2 border-fuchsia-500/40 rounded-2xl opacity-20" />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3">
                <h1 className={s.header.title}>
                  Character Designer
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Cpu className="w-3.5 h-3.5 text-fuchsia-300/50 shrink-0" />
                <p className={s.header.subtitle}>S{session} // EP{episode} // Character Creator</p>
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
                  <p className="font-black uppercase tracking-widest text-[9px]">Return to Modules Hub</p>
                </TooltipContent>
              </Tooltip>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {/* Squad Scale Selector */}
              <div className={s.header.scaleSelector}>
                <div className={s.header.scaleLabelBox}>
                  <Users className="w-3 h-3 text-fuchsia-500/50" />
                  <span className={s.header.scaleLabel}>Scale</span>
                </div>
                <select
                  value={numCharacters}
                  onChange={(e) => setNumCharacters(Number(e.target.value))}
                  className={s.header.scaleSelect}
                >
                  {[3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25, 30].map(n => (
                    <option key={n} value={n} className="bg-zinc-950 text-white">{n} UNITS</option>
                  ))}
                </select>
              </div>

              <Tooltip>
                <TooltipTrigger>
                  {isGenerating ? (
                    <Button
                      variant="ghost"
                      className={s.header.actionButtonDanger}
                      onClick={stopGeneration}
                    >
                      <Square className="w-4 h-4 mr-2 fill-current group-hover/stop:scale-110 transition-transform" />
                      <span className="relative z-10">STOP</span>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className={s.header.actionButtonPrimary}
                      onClick={onRegenerate}
                    >
                      <Sparkles className="w-4 h-4 mr-2 group-hover/btn:scale-125 transition-transform duration-300" />
                      <span className="relative z-10">GENERATE</span>
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">
                    {isGenerating ? "Stop Generation" : "Generate Characters"}
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




