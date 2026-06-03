import React from 'react';
import { RefreshCw, Zap, Monitor, Cpu, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { SaveProjectDialog } from '../../components/layout/SaveProjectDialog';
import { screeningStyles as s } from '../screeningStyles';

interface ScreeningHeaderProps {
  activeSession?: number;
  setActiveSession?: (session: number) => void;
  isRendering?: boolean;
  onRender?: () => void;
  hasScript?: boolean;
  session: string;
  episode: string;
  onPrev?: () => void;
  onNext?: () => void;
  isLiked?: boolean;
  setIsLiked?: (liked: boolean) => void;
  onSave?: () => void;
  isSaving?: boolean;
  hasContent?: boolean;
}

export const ScreeningHeader: React.FC<ScreeningHeaderProps> = ({
  isRendering = false,
  onRender = () => {},
  hasScript = true,
  session,
  episode,
  onPrev,
  onNext,
  onSave,
  isSaving,
  hasContent
}) => {
  return (
    <TooltipProvider>
      <div className={s.header.wrapper}>
        <div className={s.header.glow} />
        <div className={s.header.container}>
          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-8 z-10 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className={s.header.iconBox}>
                <div className={s.header.iconGlow} />
                <Monitor className={s.header.icon} />
                <div className="absolute inset-0 border-2 border-emerald-500/40 rounded-2xl opacity-20" />
              </div>
            </div>

            <div className="flex flex-row items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3">
                <h1 className={s.header.title}>
                  Screening Management
                </h1>
              </div>

            </div>
          </div>

          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-4 z-10 w-full lg:w-auto justify-center sm:justify-start">
            <div className="flex flex-row items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
              {onPrev && (
                <Tooltip>
                  <TooltipTrigger >
                    <Button 
                      className={s.header.actionButton}
                      onClick={onPrev}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2 group-hover/back:-translate-x-1 transition-transform" />
                      PREVIOUS
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-xs">Return to Prompt Oracle</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Save Project */}
            <SaveProjectDialog />

          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};




