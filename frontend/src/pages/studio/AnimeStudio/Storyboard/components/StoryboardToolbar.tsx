import React from 'react';
import { Palette, Mic2, Zap, Download, Copy, Maximize, Minimize, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface StoryboardToolbarProps {
  onAddScene?: () => void;
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
  onEnhanceNarration?: () => void;
  onEnhanceVisuals?: () => void;
  isGlobalEnhancing?: boolean;
}

export const StoryboardToolbar: React.FC<StoryboardToolbarProps> = ({
  status,
  session = '1',
  episode = '1',
  content = null,
  onAddScene,
  onEnhanceNarration,
  onEnhanceVisuals,
  isGlobalEnhancing
}) => {
  const { isFullscreen } = useApp();

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) { console.error(err); }
  };

  const handleCopy = () => { if (content) navigator.clipboard.writeText(content); };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `storyboard-S${session}-E${episode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 w-full rounded-[2rem] border border-fuchsia-500/20 bg-[#050505]/95 px-4 py-4 md:px-6 md:py-5 shadow-[0_0_40px_rgba(217,70,239,0.08)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-0">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(217,70,239,0.08)]">
              <Palette className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? "text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.6)]" : "text-zinc-600")} />
            </div>
            <div className="flex flex-col gap-1">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r",
                isGlobalEnhancing ? "from-fuchsia-400 to-studio animate-pulse" : "from-fuchsia-400/80 to-fuchsia-300/50"
              )}>
                Storyboard Nexus {status === 'active' ? 'Active' : 'Standby'}
              </span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                Visual Design Engine // Frame_Ready
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row items-center w-full md:w-auto gap-4">
              {onAddScene && (
                <Tooltip>
                  <TooltipTrigger >
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto h-11 px-5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-zinc-300 border-zinc-700 hover:text-fuchsia-400 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5 transition-all duration-300 group"
                      onClick={onAddScene}
                    >
                      <Plus className="w-3.5 h-3.5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                      Append Scene
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Add New Frame Sequence</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                {/* Quick Actions */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/70 border border-white/5 rounded-2xl backdrop-blur-md grow sm:grow-0 justify-center shadow-inner">
                  <Tooltip>
                    <TooltipTrigger >
                      <Button
                        variant="ghost"
                        size="icon"
                          className="h-8 w-8 rounded-lg text-zinc-400 hover:text-fuchsia-400 border border-transparent hover:border-fuchsia-500/40 hover:bg-gradient-to-br hover:from-fuchsia-500/20 hover:to-fuchsia-500/5 transition-all duration-300 group relative overflow-hidden"
                        onClick={onEnhanceNarration}
                        disabled={isGlobalEnhancing}
                      >
                        <div className="absolute inset-0 bg-fuchsia-500/0 group-hover:bg-fuchsia-500/5 transition-colors duration-300" />
                        <Mic2 className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="font-black uppercase tracking-widest text-[9px]">Audio Synthesis Matrix</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger >
                      <Button
                        variant="ghost"
                        size="icon"
                          className="h-8 w-8 rounded-lg text-zinc-400 hover:text-fuchsia-400 border border-transparent hover:border-fuchsia-500/40 hover:bg-gradient-to-br hover:from-fuchsia-500/20 hover:to-fuchsia-500/5 transition-all duration-300 group relative overflow-hidden"
                        onClick={onEnhanceVisuals}
                        disabled={isGlobalEnhancing}
                      >
                        <div className="absolute inset-0 bg-fuchsia-500/0 group-hover:bg-fuchsia-500/5 transition-colors duration-300" />
                        <Zap className={cn("w-4 h-4 relative z-10 group-hover:scale-110 transition-all duration-300", isGlobalEnhancing && "animate-pulse text-fuchsia-400")} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="font-black uppercase tracking-widest text-[9px]">Refine Visual Matrix</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                  {/* Actions */}
                  <div className="flex items-center gap-1 p-1.5 bg-black/60 border border-white/5 rounded-xl backdrop-blur-md shrink-0 shadow-inner">
                    <Tooltip>
                      <TooltipTrigger >
                        <Button onClick={handleCopy} size="icon" variant="ghost"
                          className="h-9 w-9 rounded-lg text-zinc-400 hover:text-fuchsia-400 border border-transparent hover:border-fuchsia-500/40 hover:bg-gradient-to-br hover:from-fuchsia-500/20 hover:to-fuchsia-500/5 transition-all duration-300 group relative overflow-hidden"
                          disabled={!content}>
                          <div className="absolute inset-0 bg-fuchsia-500/0 group-hover:bg-fuchsia-500/5 transition-colors duration-300" />
                          <Copy className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="font-black uppercase tracking-widest text-[9px]">Copy Storyboard to Clipboard</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger >
                        <Button onClick={handleDownload} size="icon" variant="ghost"
                          className="h-9 w-9 rounded-lg text-zinc-400 hover:text-fuchsia-400 border border-transparent hover:border-fuchsia-500/40 hover:bg-gradient-to-br hover:from-fuchsia-500/20 hover:to-fuchsia-500/5 transition-all duration-300 group relative overflow-hidden"
                          disabled={!content}>
                          <div className="absolute inset-0 bg-fuchsia-500/0 group-hover:bg-fuchsia-500/5 transition-colors duration-300" />
                          <Download className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="font-black uppercase tracking-widest text-[9px]">Export Storyboard JSON</p>
                      </TooltipContent>
                    </Tooltip>

                    <div className="w-px h-5 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1" />

                    <Tooltip>
                      <TooltipTrigger >
                        <Button onClick={toggleFullscreen} size="icon" variant="ghost"
                          className="h-9 w-9 rounded-lg text-zinc-400 hover:text-fuchsia-400 border border-transparent hover:border-fuchsia-500/40 hover:bg-gradient-to-br hover:from-fuchsia-500/20 hover:to-fuchsia-500/5 transition-all duration-300 group relative overflow-hidden">
                          <div className="absolute inset-0 bg-fuchsia-500/0 group-hover:bg-fuchsia-500/5 transition-colors duration-300" />
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
        </div>
      </div>
    </TooltipProvider>
  );
};
