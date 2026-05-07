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
      <div className="flex flex-col gap-6 w-full p-4 md:p-0">
        {!showTabsOnly && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-0">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center">
              <Palette className={cn("w-5 h-5", status === 'active' ? "text-fuchsia-400" : "text-zinc-600")} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">
                Storyboard Nexus {status === 'active' ? 'Active' : 'Standby'}
              </span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
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
                      className="w-full sm:w-auto h-11 px-5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-zinc-300 border-zinc-700 hover:text-white hover:border-studio transition-all duration-300"
                      onClick={onAddScene}
                    >
                      <Plus className="w-3.5 h-3.5 mr-2" />
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
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md grow sm:grow-0 justify-center">
                  <Tooltip>
                    <TooltipTrigger >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300 group"
                        onClick={onEnhanceNarration}
                        disabled={isGlobalEnhancing}
                      >
                        <Mic2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
                        className="h-8 w-8 rounded-lg text-zinc-500 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-all duration-300 group"
                        onClick={onEnhanceVisuals}
                        disabled={isGlobalEnhancing}
                      >
                        <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="font-black uppercase tracking-widest text-[9px]">Refine Visual Matrix</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Production Unit */}
                <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md grow sm:grow-0 relative overflow-hidden group/unit">
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r from-studio/10 via-transparent to-transparent opacity-0 transition-opacity duration-700",
                    isGlobalEnhancing && "opacity-100"
                  )} />
                  {isGlobalEnhancing && (
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-studio animate-[shimmer_2s_infinite]" />
                  )}
                  <span className={cn(
                    "text-xs font-black transition-colors duration-500",
                    isGlobalEnhancing ? "text-studio animate-pulse" : "text-fuchsia-400/60"
                  )}>
                    {isGlobalEnhancing ? "⚡" : "#"}
                  </span>
                  <div className="flex flex-col relative z-10">
                    <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                      {isGlobalEnhancing ? "AI Refinement" : "Production Unit"}
                    </span>
                    <span className="text-sm font-black text-white font-mono leading-none mt-1">S{session}-E{episode}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              {/* Actions */}
              <div className="flex items-center gap-1 p-1.5 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md shrink-0">
                <Tooltip>
                  <TooltipTrigger >
                    <Button onClick={handleCopy} size="icon" variant="ghost"
                      className="h-9 w-9 rounded-lg text-zinc-500 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-all"
                      disabled={!content}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Copy Storyboard to Clipboard</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger >
                    <Button onClick={handleDownload} size="icon" variant="ghost"
                      className="h-9 w-9 rounded-lg text-zinc-500 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-all"
                      disabled={!content}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Export Storyboard JSON</p>
                  </TooltipContent>
                </Tooltip>

                <div className="w-px h-5 bg-white/10 mx-1" />

                <Tooltip>
                  <TooltipTrigger >
                    <Button onClick={toggleFullscreen} size="icon" variant="ghost"
                      className="h-9 w-9 rounded-lg text-zinc-500 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-all">
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
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
        )}
      </div>
    </TooltipProvider>
  );
};




