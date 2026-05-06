import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight, Cpu, Terminal, RefreshCw, Save, Square } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';

interface ProtocolsHeaderProps {
  onRegenerate: () => void;
  isGenerating: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
  isSaving: boolean;
  hasContent: boolean;
  session: string;
  episode: string;
}

export const ProtocolsHeader: React.FC<ProtocolsHeaderProps> = ({
  onRegenerate,
  isGenerating,
  onPrev,
  onNext,
  onSave,
  isSaving,
  hasContent,
  session,
  episode
}) => {
  const { stopGeneration } = useGenerator();

  return (
    <TooltipProvider>
      <div className="relative group">
        <div className="header-container">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className="header-icon-box group/icon">
                <div className="absolute inset-0 bg-gradient-to-br from-studio/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                <Terminal className="w-7 h-7 text-studio relative z-10 animate-pulse-slow" />
                <div className="absolute inset-0 border-2 border-studio/50 rounded-2xl animate-ping opacity-20" />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3">
                <h1 className="header-title italic">
                  Production <span className="text-studio not-italic">Modules Hub</span>
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Cpu className="w-3.5 h-3.5 text-studio/40 shrink-0" />
                <p className="header-subtitle">S{session} // EP{episode} // Core AI Directives</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full lg:w-auto">
            <Tooltip>
              <TooltipTrigger>
                <Button 
                  variant="outline" 
                  className="relative w-full sm:w-auto h-12 px-8 bg-[#050505] border-white/10 text-zinc-400 hover:text-studio hover:border-studio/50 font-black uppercase tracking-widest text-[10px] rounded-full transition-all duration-500 group/back shadow-2xl"
                  onClick={onPrev}
                >
                  <ChevronLeft className="w-4 h-4 mr-2 group-hover/back:-translate-x-1 transition-transform" />
                  WORLD SETTINGS
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Return to World Builder</p>
              </TooltipContent>
            </Tooltip>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Tooltip>
                <TooltipTrigger>
                  {isGenerating ? (
                    <Button 
                      variant="outline" 
                      className="relative w-full sm:w-auto h-12 px-8 bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black font-black uppercase tracking-widest text-[11px] rounded-full transition-all duration-500 group/stop shadow-[0_0_25px_rgba(239,68,68,0.2)]"
                      onClick={stopGeneration}
                    >
                      <Square className="w-4 h-4 mr-3 fill-current group-hover/stop:scale-110 transition-transform" />
                      <span className="relative z-10">STOP GENERATION</span>
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="relative w-full sm:w-auto h-12 px-8 bg-[#050505] border-white/10 text-zinc-100 hover:text-studio hover:border-studio/50 font-black uppercase tracking-widest text-[11px] rounded-full transition-all duration-500 backdrop-blur-md group/btn shadow-2xl"
                      onClick={onRegenerate} 
                    >
                      <div className="absolute inset-0 bg-studio/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-full" />
                      <RefreshCw className="w-4 h-4 mr-3 text-studio group-hover/btn:rotate-180 transition-transform duration-700" />
                      <span className="relative z-10">RELOAD</span>
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">
                    {isGenerating ? "Cancel Active Process" : "Refresh Modules"}
                  </p>
                </TooltipContent>
              </Tooltip>

              {hasContent && (
                <Tooltip>
                  <TooltipTrigger>
                    <Button 
                      variant="outline" 
                      className="relative w-full sm:w-auto h-12 px-6 bg-studio/5 border-studio/20 text-studio hover:bg-studio/10 font-black uppercase tracking-widest text-[11px] rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(6,182,212,0.1)] group/save"
                      onClick={onSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2 group-hover/save:scale-110 transition-transform" />
                      )}
                      {isSaving ? "SYNCING..." : "DEPLOY"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Deploy Directives</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger>
                  <Button 
                    className="relative w-full sm:w-auto h-12 px-10 rounded-full bg-[#050505] border border-white/10 text-zinc-400 hover:text-studio hover:border-studio/50 font-black uppercase tracking-widest text-[10px] transition-all duration-500 group/next shadow-2xl"
                    onClick={onNext}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      NEXT <ChevronRight className="w-4 h-4 group-hover/next:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-studio/5 opacity-0 group-hover/next:opacity-100 transition-opacity duration-1000 rounded-full" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Proceed to Character Designer</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

