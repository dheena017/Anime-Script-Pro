import React from 'react';
import { RefreshCw, Zap, Monitor, Cpu, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

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
      <div className="relative group">
        
        <div className="header-container">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-studio/10 border border-studio/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] group/icon overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-studio/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                <Monitor className="w-7 h-7 text-studio relative z-10 animate-pulse-slow" />
                <div className="absolute inset-0 border-2 border-studio/50 rounded-2xl animate-ping opacity-20" />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-white italic leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-400">
                  Screening Management
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Cpu className="w-3.5 h-3.5 text-studio/40 shrink-0" />
                <p className="text-[8px] md:text-[9px] font-black text-studio/40 uppercase tracking-[0.2em] md:tracking-[0.4em]">S{session} // EP{episode} // AI Video Engine</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {onPrev && (
                <Tooltip>
                  <TooltipTrigger >
                    <Button 
                      variant="ghost" 
                      className="relative w-full sm:w-auto h-10 px-6 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 text-zinc-400 hover:text-cyan-500 hover:border-cyan-500/60 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-cyan-500/10 font-black uppercase tracking-widest text-[9px] rounded-lg transition-all duration-300 group/back shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                      onClick={onPrev}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2 group-hover/back:-translate-x-1 transition-transform" />
                      PREVIOUS
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Return to Prompt Oracle</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Tooltip>
                <TooltipTrigger >
                  <Button 
                    variant="ghost" 
                    className="relative w-full sm:w-auto h-10 px-6 bg-gradient-to-r from-cyan-500/15 to-cyan-500/5 border border-cyan-500/40 text-cyan-500 hover:text-cyan-400 hover:border-cyan-500/70 hover:bg-gradient-to-r hover:from-cyan-500/25 hover:to-cyan-500/15 font-black uppercase tracking-widest text-[9px] rounded-lg transition-all duration-300 group/btn shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                    onClick={onRender}
                    disabled={isRendering || !hasScript}
                  >
                    {isRendering ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Zap className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                    )}
                    <span className="relative z-10">{isRendering ? "RENDERING" : "RENDER"}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Execute Cinema Rendering</p>
                </TooltipContent>
              </Tooltip>

              {onSave && hasContent && (
                <Tooltip>
                  <TooltipTrigger >
                    <Button 
                      variant="ghost"
                      className="relative w-full sm:w-auto h-10 px-6 bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/30 text-cyan-500 hover:text-cyan-400 hover:border-cyan-500/60 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-cyan-500/10 font-black uppercase tracking-widest text-[9px] rounded-lg transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] group/save"
                      onClick={onSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2 group-hover/save:scale-110 transition-transform" />
                      )}
                      <span>{isSaving ? "SAVING..." : "SAVE ALL"}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Save all tabs (sync to cloud)</p>
                  </TooltipContent>
                </Tooltip>
              )}

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
                  <p className="font-black uppercase tracking-widest text-[9px]">Proceed to Engine Controls</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};




