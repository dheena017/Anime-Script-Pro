import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { ChevronRight, Cpu } from 'lucide-react';
import { engineStyles as s } from '../engineStyles';


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
      <div className={s.header.wrapper}>
        <div className={s.header.glow} />
        <div className={s.header.container}>
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 sm:gap-8 z-10">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
              <div className="relative shrink-0">
                <div className={s.header.iconBox}>
                  <div className={s.header.iconGlow} />
                  <Cpu className={s.header.icon} />
                  <div className="absolute inset-0 border-2 border-studio/50 rounded-2xl opacity-20" />
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <h1 className={s.header.title}>
                    Engine Settings
                  </h1>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Cpu className="w-3.5 h-3.5 text-studio/40 shrink-0" />
                  <p className={s.header.subtitle}>S{session} // EP{episode} // AI Core V5.1</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
              {onNext && (
                <Tooltip>
                  <TooltipTrigger >
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