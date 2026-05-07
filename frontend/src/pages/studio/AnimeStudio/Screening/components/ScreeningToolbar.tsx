import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useApp } from '@/contexts/AppContext';
import { Download, Maximize, Copy, Minimize, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScreeningToolbarProps {
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
  activeSession?: number;
  setActiveSession?: (session: number) => void;
}

export const ScreeningToolbar: React.FC<ScreeningToolbarProps> = ({
  status,
  session = '1',
  episode = '1',
  content = null,
  activeSession = 1,
  setActiveSession = () => { }
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
      <div className="flex flex-col gap-6 w-full p-4 md:p-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-0">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-studio/10 border border-studio/20 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.08)]">
              <Monitor className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? "text-studio drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "text-zinc-600")} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-studio/80 to-cyan-400/60 bg-clip-text text-transparent">
                Screening Nexus {status === 'active' ? 'Active' : 'Standby'}
              </span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                Production Viewport // Cinema_Control
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              {/* Session Navigation */}
              <div className="flex items-center bg-black/60 border border-white/5 p-1 rounded-full backdrop-blur-md shadow-inner">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSession(s)}
                    className={cn(
                      "relative h-8 flex items-center px-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                      activeSession === s
                        ? "text-black bg-gradient-to-br from-studio to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        : "text-zinc-500 hover:text-studio/80 hover:bg-studio/5"
                    )}
                  >
                    S{s}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-1.5 p-1.5 bg-black/60 border border-white/5 rounded-xl backdrop-blur-md w-full md:w-auto shadow-inner">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={handleCopy}
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-gradient-to-br hover:from-studio/20 hover:to-studio/5 transition-all duration-300 group relative overflow-hidden"
                    disabled={!content}
                  >
                    <div className="absolute inset-0 bg-studio/0 group-hover:bg-studio/5 transition-colors duration-300" />
                    <Copy className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Copy Viewport Data</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-gradient-to-br hover:from-studio/20 hover:to-studio/5 transition-all duration-300 group relative overflow-hidden"
                    disabled={!content}
                  >
                    <div className="absolute inset-0 bg-studio/0 group-hover:bg-studio/5 transition-colors duration-300" />
                    <Download className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Export Cinema Data</p>
                </TooltipContent>
              </Tooltip>

              <div className="w-px h-5 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1" />

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={toggleFullscreen}
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-gradient-to-br hover:from-studio/20 hover:to-studio/5 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-studio/0 group-hover:bg-studio/5 transition-colors duration-300" />
                    {isFullscreen ? <Minimize className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" /> : <Maximize className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">{isFullscreen ? "Exit Fullscreen" : "Cinema Mode"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

    </TooltipProvider>
  );
};
