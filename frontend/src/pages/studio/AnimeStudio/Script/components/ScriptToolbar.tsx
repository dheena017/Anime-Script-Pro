import React from 'react';
import { ScrollText, Search, Layout, Volume2, Wand2, Download, RefreshCw, Copy, Maximize, Minimize, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScriptTab } from '../../Script/Tabs/ScriptTabs';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export type { ScriptTab };

interface ScriptToolbarProps {
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
  onExport: () => void;
  onViewSEO: () => void;
  onViewPrompts: () => void;
  onViewStoryboard: () => void;
  onExtend: () => void;
  onListen: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  showTabsOnly?: boolean;
}

export const ScriptToolbar: React.FC<ScriptToolbarProps> = ({
  status,
  session = '1',
  episode = '1',
  content = null,
  onExport,
  onViewSEO,
  onViewPrompts,
  onViewStoryboard,
  onExtend,
  onListen,
  onPrev,
  onNext,
  showTabsOnly = false
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
      {!showTabsOnly && (
      <div className="flex flex-col gap-6 w-full rounded-[2rem] border border-cyan-500/20 bg-[#050505]/95 px-4 py-4 md:px-6 md:py-5 shadow-[0_0_40px_rgba(6,182,212,0.08)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10 flex items-center justify-between">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.08)]">
              <ScrollText className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "text-zinc-600")} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-cyan-300 to-studio bg-clip-text text-transparent">
                Script Nexus {status === 'active' ? 'Active' : 'Standby'}
              </span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                Synthesis Mode: Sequential // Episode_Ready
              </span>
            </div>
          </div>

          {/* Sequence Control */}
          {status === 'active' && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
              <Tooltip>
                <TooltipTrigger >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-gradient-to-br hover:from-studio/15 hover:to-studio/5 transition-all text-[9px] font-black uppercase tracking-widest gap-2 group relative overflow-hidden"
                    onClick={onPrev}
                    disabled={!onPrev}
                  >
                    <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform duration-300" />
                    PREV EPISODE
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Load Previous Episode</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 rounded-lg text-studio/80 hover:text-studio transition-all text-[9px] font-black uppercase tracking-widest gap-2 bg-gradient-to-br from-studio/10 to-studio/5 border border-studio/30 hover:border-studio/50 hover:from-studio/20 hover:to-studio/10 group"
                    onClick={onNext}
                    disabled={!onNext}
                  >
                    NEXT EPISODE
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Synthesize Next Episode</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          <div className="flex items-center gap-6">
            {/* Quick Actions */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/70 border border-white/5 rounded-2xl backdrop-blur-md shadow-inner">
              <Tooltip>
                <TooltipTrigger >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-cyan-400/5 transition-all duration-300 group relative overflow-hidden"
                    onClick={onViewSEO}
                  >
                    <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-300" />
                    <Search className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">SEO Matrix</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-cyan-400/5 transition-all duration-300 group relative overflow-hidden"
                    onClick={onViewPrompts}
                  >
                    <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-300" />
                    <Wand2 className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">AI Prompts</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-cyan-400/5 transition-all duration-300 group relative overflow-hidden"
                    onClick={onViewStoryboard}
                  >
                    <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-300" />
                    <Layout className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Visual Storyboard</p>
                </TooltipContent>
              </Tooltip>

              <div className="w-px h-4 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1" />

              <Tooltip>
                <TooltipTrigger >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-cyan-400/5 transition-all duration-300 group relative overflow-hidden"
                    onClick={onExtend}
                    disabled={!content}
                  >
                    <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-300" />
                    <RefreshCw className="w-4 h-4 relative z-10 group-hover:scale-110 group-hover:rotate-180 transition-all duration-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Extend Script</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-cyan-400/5 transition-all duration-300 group relative overflow-hidden"
                    onClick={onListen}
                    disabled={!content}
                  >
                    <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-300" />
                    <Volume2 className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">AI Voiceover</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 p-1.5 bg-black/60 border border-white/5 rounded-xl backdrop-blur-md shadow-inner">
              <Tooltip>
                <TooltipTrigger >
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
                  <p className="font-black uppercase tracking-widest text-[9px]">Copy Script</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger >
                  <Button
                    onClick={onExport}
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
                  <p className="font-black uppercase tracking-widest text-[9px]">Export as PDF</p>
                </TooltipContent>
              </Tooltip>

              <div className="w-px h-5 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1" />

              <Tooltip>
                <TooltipTrigger >
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
                  <p className="font-black uppercase tracking-widest text-[9px]">{isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}</p>
                </TooltipContent>
              </Tooltip>
            </div>

          </div>
        </div>
      </div>
      )}
    </TooltipProvider>
  );
};
