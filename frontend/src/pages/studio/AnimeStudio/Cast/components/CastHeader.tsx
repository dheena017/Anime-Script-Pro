import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight, Cpu, Users, Save, Square, Box, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGenerator } from '@/hooks/useGenerator';

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
  episode,
  status = 'empty'
}) => {
  const { stopGeneration } = useGenerator();

  return (
    <TooltipProvider>
      <div className="relative group">
        <div className="header-container">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className="header-icon-box group/icon !bg-fuchsia-500/10 !border-fuchsia-500/30">
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                <Users className="w-7 h-7 text-fuchsia-500 relative z-10 animate-pulse-slow" />
                <div className="absolute inset-0 border-2 border-fuchsia-500/50 rounded-2xl animate-ping opacity-20" />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3">
                <h1 className="header-title">
                  Character Designer
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Cpu className="w-3.5 h-3.5 text-fuchsia-500/40 shrink-0" />
                <p className="header-subtitle !text-fuchsia-500/40">S{session} // EP{episode} // Character Creator</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full lg:w-auto">
            {onPrev && (
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    className="relative w-full sm:w-auto h-10 px-6 bg-gradient-to-r from-fuchsia-500/10 to-fuchsia-500/5 border border-fuchsia-500/30 text-zinc-400 hover:text-fuchsia-500 hover:border-fuchsia-500/60 hover:bg-gradient-to-r hover:from-fuchsia-500/20 hover:to-fuchsia-500/10 font-black uppercase tracking-widest text-[9px] rounded-lg transition-all duration-300 group/back shadow-lg hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]"
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
              <Tooltip>
                <TooltipTrigger>
                  {isGenerating ? (
                    <Button
                      variant="ghost"
                      className="relative w-full sm:w-auto h-10 px-6 bg-red-500/10 border border-red-500/40 text-red-400 hover:text-red-300 hover:border-red-500/60 hover:bg-red-500/15 font-black uppercase tracking-widest text-[9px] rounded-lg transition-all duration-300 group/stop shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                      onClick={stopGeneration}
                    >
                      <Square className="w-4 h-4 mr-2 fill-current group-hover/stop:scale-110 transition-transform" />
                      <span className="relative z-10">STOP</span>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="relative w-full sm:w-auto h-10 px-6 bg-gradient-to-r from-fuchsia-500/15 to-fuchsia-500/5 border border-fuchsia-500/40 text-fuchsia-500 hover:text-fuchsia-400 hover:border-fuchsia-500/70 hover:bg-gradient-to-r hover:from-fuchsia-500/25 hover:to-fuchsia-500/15 font-black uppercase tracking-widest text-[9px] rounded-lg transition-all duration-300 group/btn shadow-lg hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]"
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

              {onSave && hasContent && (
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      className="relative w-full sm:w-auto h-10 px-6 bg-gradient-to-r from-fuchsia-500/10 to-transparent border border-fuchsia-500/30 text-fuchsia-500 hover:text-fuchsia-400 hover:border-fuchsia-500/60 hover:bg-gradient-to-r hover:from-fuchsia-500/20 hover:to-fuchsia-500/10 font-black uppercase tracking-widest text-[9px] rounded-lg transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(217,70,239,0.2)] group/save"
                      onClick={onSave}
                      disabled={isSaving}
                    >
                      <Save className={cn("w-4 h-4 mr-2", isSaving && "animate-pulse")} />
                      {isSaving ? "SAVING" : "SAVE"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Save all tabs (sync to cloud)</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    className="relative w-full sm:w-auto h-10 px-8 rounded-lg bg-gradient-to-r from-white to-zinc-100 text-black hover:from-zinc-50 hover:to-white font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/next shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
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




