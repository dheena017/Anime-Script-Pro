import React from 'react';
import { Settings, Cpu, ChevronRight, ChevronLeft, RefreshCw, Zap, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface EngineHeaderProps {
  session: string;
  episode: string;
  onNext?: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  isGenerating?: boolean;
  hasContent?: boolean;
}

export const EngineHeader: React.FC<EngineHeaderProps> = ({
  session,
  episode,
  onNext,
  onPrev,
  onSave,
  isSaving,
  hasContent,
  isGenerating = false
}) => {
  return (
    <TooltipProvider>
      <div className="relative group">
        <div className="header-container !p-3 md:!p-4 !rounded-2xl">
          <div className="flex items-center gap-6 z-10">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-studio/10 border border-studio/30 flex items-center justify-center shadow-lg group/icon overflow-hidden">
                <Cpu className="w-5 h-5 text-studio relative z-10" />
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-lg font-black uppercase tracking-widest text-white italic leading-none">
                Engine Architect
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-[7px] font-black text-studio/40 uppercase tracking-[0.3em]">S{session} // EP{episode} // Neural Core V5.1</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 z-10">
            {onPrev && (
              <Button 
                variant="outline" 
                className="h-10 px-4 bg-[#050505] border-white/10 text-zinc-400 hover:text-studio hover:border-studio/50 font-black uppercase tracking-widest text-[9px] rounded-xl transition-all group/back"
                onClick={onPrev}
              >
                <ChevronLeft className="w-3 h-3 mr-2 group-hover/back:-translate-x-1 transition-transform" />
                PREV
              </Button>
            )}

            <div className="flex items-center gap-2">
              {onSave && hasContent && (
                <Button 
                  variant="outline" 
                  className="h-10 px-4 bg-studio/5 border-studio/20 text-studio hover:bg-studio/10 font-black uppercase tracking-widest text-[9px] rounded-xl transition-all"
                  onClick={onSave}
                  disabled={isSaving}
                >
                  <Save className={cn("w-3 h-3 mr-2", isSaving && "animate-pulse")} />
                  {isSaving ? "SYNCING" : "SAVE"}
                </Button>
              )}

              <Button 
                variant="outline" 
                className="h-10 px-4 bg-studio border-none text-black hover:bg-studio/90 font-black uppercase tracking-widest text-[9px] rounded-xl transition-all shadow-lg"
                onClick={() => {}} 
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RefreshCw className="w-3 h-3 animate-spin mr-2" />
                ) : (
                  <Zap className="w-3 h-3 mr-2 fill-current" />
                )}
                GENERATE
              </Button>

              {onNext && (
                <Button 
                  className="h-10 px-6 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 font-black uppercase tracking-widest text-[9px] transition-all group/next"
                  onClick={onNext}
                >
                  NEXT <ChevronRight className="w-3 h-3 ml-2 group-hover/next:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
