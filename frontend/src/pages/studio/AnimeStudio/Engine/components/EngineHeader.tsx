import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { ChevronRight, Cpu } from 'lucide-react';
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
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 sm:gap-8 z-10">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
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
            <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
              {onNext && (
                <Tooltip>
                  <TooltipTrigger >
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
                    <p className="font-black uppercase tracking-widest text-[9px]">Proceed to World Builder</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
        </div>
        </div>
      </div>
    </TooltipProvider>
  )
};