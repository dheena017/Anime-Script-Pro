import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Cpu, FileText, RefreshCw, Sparkles, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScriptHeaderProps {
  onRegenerate: () => void;
  isGenerating: boolean;
  onNext: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  hasContent?: boolean;
  session: string;
  episode: string;
}

export const ScriptHeader: React.FC<ScriptHeaderProps> = ({
  onRegenerate,
  isGenerating,
  onNext,
  onPrev,
  onSave,
  isSaving,
  hasContent,
  session,
  episode
}) => {
  return (
    <TooltipProvider>
      <div className="relative group">


        <div className="relative flex flex-col lg:flex-row items-center justify-between p-4 md:p-5 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden gap-6 lg:gap-0">

          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)] group/icon overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                <FileText className="w-7 h-7 text-blue-500 relative z-10 animate-pulse-slow" />
                <div className="absolute inset-0 border-2 border-blue-500/50 rounded-2xl animate-ping opacity-20" />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-white italic leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-400">
                  Script Architect
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Cpu className="w-3.5 h-3.5 text-blue-500/40 shrink-0" />
                <p className="text-[8px] md:text-[9px] font-black text-blue-500/40 uppercase tracking-[0.2em] md:tracking-[0.4em]">S{session} // EP{episode} // AI Script Engine</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full lg:w-auto">
            {onPrev && (
              <Tooltip>
                <TooltipTrigger>
                  <Button 
                    variant="outline" 
                    className="relative w-full sm:w-auto h-12 px-8 bg-[#050505] border-white/10 text-zinc-400 hover:text-blue-500 hover:border-blue-500/50 font-black uppercase tracking-widest text-[10px] rounded-full transition-all duration-500 backdrop-blur-md group/back shadow-2xl"
                    onClick={onPrev}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2 group-hover/back:-translate-x-1 transition-transform" />
                    PREVIOUS
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Return to Series Roadmap</p>
                </TooltipContent>
              </Tooltip>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Tooltip>
                <TooltipTrigger>
                  <Button 
                    variant="outline" 
                    className="relative w-full sm:w-auto h-12 px-8 bg-[#050505] border-white/10 text-zinc-100 hover:text-blue-500 hover:border-blue-500/50 font-black uppercase tracking-widest text-[11px] rounded-full transition-all duration-500 backdrop-blur-md group/btn shadow-2xl"
                    onClick={onRegenerate}
                    disabled={isGenerating}
                  >
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-full" />
                    {isGenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-3 text-blue-500" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-3 text-blue-500 group-hover/btn:scale-125 transition-transform duration-500" />
                    )}
                    <span className="relative z-10">GENERATE</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Generate AI Script</p>
                </TooltipContent>
              </Tooltip>

              {onSave && hasContent && (
                <Tooltip>
                  <TooltipTrigger>
                    <Button 
                      variant="outline" 
                      className="relative w-full sm:w-auto h-12 px-6 bg-blue-500/5 border-blue-500/20 text-blue-500 hover:bg-blue-500/10 font-black uppercase tracking-widest text-[11px] rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.1)] group/save"
                      onClick={onSave}
                      disabled={isSaving}
                    >
                      <Save className={cn("w-4 h-4 mr-2", isSaving && "animate-pulse")} />
                      {isSaving ? "SAVING..." : "SAVE"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Manual Cloud Sync</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger>
                  <Button 
                    className="relative w-full sm:w-auto h-12 px-10 rounded-full bg-[#050505] border border-white/10 text-zinc-400 hover:text-blue-500 hover:border-blue-500/50 font-black uppercase tracking-widest text-[10px] transition-all duration-500 backdrop-blur-md group/next shadow-2xl"
                    onClick={onNext}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      NEXT <ChevronRight className="w-4 h-4 group-hover/next:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/next:opacity-100 transition-opacity duration-500 rounded-full" />
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




