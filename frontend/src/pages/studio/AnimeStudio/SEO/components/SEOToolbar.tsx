import React from 'react';
import { Search, Copy, Download, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface SEOToolbarProps {
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
}

export const SEOToolbar: React.FC<SEOToolbarProps> = ({
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
      <div className="flex flex-col gap-6 w-full rounded-[2rem] border border-emerald-500/20 bg-[#050505]/95 px-4 py-4 md:px-6 md:py-5 shadow-[0_0_40px_rgba(16,185,129,0.08)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-0">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.08)]">
              <Search className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "text-zinc-600")} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-emerald-400/80 to-emerald-300/50 bg-clip-text text-transparent">
                SEO Manager {status === 'active' ? 'Active' : 'Standby'}
              </span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                Strategic Content Metadata // Search_Ready
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              {/* Actions */}
              <div className="flex items-center justify-center gap-1 p-1.5 bg-black/70 border border-white/5 rounded-xl backdrop-blur-md w-full md:w-auto shadow-inner">
                <Tooltip>
                  <TooltipTrigger>
                    <Button 
                      onClick={handleCopy} 
                      size="icon" 
                      variant="ghost" 
                      className="h-9 w-9 rounded-lg text-zinc-400 hover:text-emerald-400 border border-transparent hover:border-emerald-500/40 hover:bg-gradient-to-br hover:from-emerald-500/20 hover:to-emerald-500/5 transition-all duration-300 group relative overflow-hidden"
                      disabled={!content}
                    >
                      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-300" />
                      <Copy className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Copy SEO Matrix to Clipboard</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-9 w-9 rounded-lg text-zinc-400 hover:text-emerald-400 border border-transparent hover:border-emerald-500/40 hover:bg-gradient-to-br hover:from-emerald-500/20 hover:to-emerald-500/5 transition-all duration-300 group relative overflow-hidden"
                      disabled={!content}
                    >
                      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-300" />
                      <Download className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Export SEO Data</p>
                  </TooltipContent>
                </Tooltip>

                <div className="w-px h-5 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1" />

                <Tooltip>
                  <TooltipTrigger>
                    <Button 
                      onClick={toggleFullscreen} 
                      size="icon" 
                      variant="ghost" 
                      className="h-9 w-9 rounded-lg text-zinc-400 hover:text-emerald-400 border border-transparent hover:border-emerald-500/40 hover:bg-gradient-to-br hover:from-emerald-500/20 hover:to-emerald-500/5 transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-300" />
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
