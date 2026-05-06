import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { ChevronRight, Cpu, Save } from 'lucide-react';
import { cn } from '@/lib/utils';


interface EngineHeaderProps {
  session: string;
  episode: string;
  onNext?: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
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
}) => {

  return (
    <TooltipProvider>
      <div className="relative group">
        <div className="header-container">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className="header-icon-box group/icon">
                <div className="absolute inset-0 bg-gradient-to-br from-studio/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                <Cpu className="w-7 h-7 text-studio relative z-10 animate-pulse-slow" />
                <div className="absolute inset-0 border-2 border-studio/50 rounded-2xl animate-ping opacity-20" />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3">
                <h1 className="header-title">
                   Engine Settings
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Cpu className="w-3.5 h-3.5 text-studio/40 shrink-0" />
                <p className="header-subtitle">S{session} // EP{episode} // AI Core V5.1</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full lg:w-auto">
            {onPrev && (
              <Tooltip>
                <TooltipTrigger>
                  <Button 
                    variant="outline" 
                    className="relative w-full sm:w-auto h-12 px-8 bg-[#050505] border-white/10 text-zinc-400 hover:text-studio hover:border-studio/50 font-black uppercase tracking-widest text-[10px] rounded-full transition-all duration-500 backdrop-blur-md group/back shadow-2xl"
                    onClick={onPrev}
                  >
                    <ChevronRight className="w-4 h-4 mr-2 group-hover/back:-translate-x-1 transition-transform rotate-180" />
                    PREVIOUS
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Return to Screening Lab</p>
                </TooltipContent>
              </Tooltip>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {onSave && hasContent && (
                <Tooltip>
                  <TooltipTrigger>
                    <Button 
                      variant="outline" 
                      className="relative w-full sm:w-auto h-12 px-6 bg-studio/5 border-studio/20 text-studio hover:bg-studio/10 font-black uppercase tracking-widest text-[11px] rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(0,200,255,0.1)] group/save"
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

              {onNext && (
                <Tooltip>
                  <TooltipTrigger >
                    <Button 
                      className="relative w-full sm:w-auto h-12 px-10 rounded-full bg-[#050505] border border-white/10 text-zinc-400 hover:text-studio hover:border-studio/50 font-black uppercase tracking-widest text-[10px] transition-all duration-500 group/next shadow-2xl"
                      onClick={onNext}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        NEXT <ChevronRight className="w-4 h-4 group-hover/next:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-studio/5 opacity-0 group-hover/next:opacity-100 transition-opacity duration-500 rounded-full" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Proceed to World Builder</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};