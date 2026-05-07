import React from 'react';
import { Zap, Copy, Download, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface PromptsToolbarProps {
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
}

export const PromptsToolbar: React.FC<PromptsToolbarProps> = ({
  status,
  session = '1',
  episode = '1',
  content = null
}) => {
  const { isFullscreen } = useApp();

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 w-full rounded-[2rem] border border-cyan-500/20 bg-[#050505]/95 px-4 py-4 md:px-6 md:py-5 shadow-[0_0_40px_rgba(6,182,212,0.08)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-0">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.08)]">
              <Zap className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "text-zinc-600")} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-cyan-300 to-studio bg-clip-text text-transparent">
                Prompt Hub {status === 'active' ? 'Active' : 'Standby'}
              </span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                Visual Design System // Ready_for_Production
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <div className="flex items-center justify-center gap-1 p-1.5 bg-black/70 border border-white/5 rounded-xl backdrop-blur-md w-full md:w-auto shadow-inner">
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={handleCopy}
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-cyan-400/5 transition-all duration-300 group relative overflow-hidden"
                      disabled={!content}
                    >
                      <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-300" />
                      <Copy className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Copy Prompts to Clipboard</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-cyan-400/5 transition-all duration-300 group relative overflow-hidden"
                      disabled={!content}
                    >
                      <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-300" />
                      <Download className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Export Prompts</p>
                  </TooltipContent>
                </Tooltip>

                <div className="w-px h-5 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1" />

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={toggleFullscreen}
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-cyan-400/5 transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-300" />
                      {isFullscreen ? <Minimize className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" /> : <Maximize className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">{isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
