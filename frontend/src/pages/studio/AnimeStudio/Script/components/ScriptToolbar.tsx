import React from 'react';
import { ScrollText, Search, Layout, Volume2, Wand2, Download, RefreshCw, Copy, Maximize, Minimize, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScriptTabs, ScriptTab } from '../../Script/Tabs/ScriptTabs';
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
  activeTab: ScriptTab;
  setActiveTab: (tab: ScriptTab) => void;
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
  activeTab,
  setActiveTab,
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
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-studio/10 border border-studio/20 flex items-center justify-center">
              <ScrollText className={cn("w-5 h-5", status === 'active' ? "text-studio" : "text-zinc-600")} />
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
                    className="h-8 px-3 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all text-[9px] font-black uppercase tracking-widest gap-2"
                    onClick={onPrev}
                    disabled={!onPrev}
                  >
                    <ChevronLeft className="w-3 h-3" />
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
                    className="h-8 px-3 rounded-lg text-studio/80 hover:text-studio hover:bg-studio/10 transition-all text-[9px] font-black uppercase tracking-widest gap-2 bg-studio/5 border border-studio/20"
                    onClick={onNext}
                    disabled={!onNext}
                  >
                    NEXT EPISODE
                    <ChevronRight className="w-3 h-3" />
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
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md">
              <Tooltip>
                <TooltipTrigger >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300 group"
                    onClick={onViewSEO}
                  >
                    <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
                    className="h-8 w-8 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300 group"
                    onClick={onViewPrompts}
                  >
                    <Wand2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
                    className="h-8 w-8 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300 group"
                    onClick={onViewStoryboard}
                  >
                    <Layout className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Visual Storyboard</p>
                </TooltipContent>
              </Tooltip>

              <div className="w-px h-4 bg-white/10 mx-1" />

              <Tooltip>
                <TooltipTrigger >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300 group"
                    onClick={onExtend}
                    disabled={!content}
                  >
                    <RefreshCw className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
                    className="h-8 w-8 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300 group"
                    onClick={onListen}
                    disabled={!content}
                  >
                    <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">AI Voiceover</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Production Unit */}
            <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md">
              <span className="text-studio/60 text-xs font-black">#</span>
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none">Production Unit</span>
                <span className="text-sm font-black text-white font-mono leading-none mt-1">S{session}-E{episode}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 p-1.5 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md">
              <Tooltip>
                <TooltipTrigger >
                  <Button
                    onClick={handleCopy}
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300"
                    disabled={!content}
                  >
                    <Copy className="w-4 h-4" />
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
                    className="h-9 w-9 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300"
                    disabled={!content}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Export as PDF</p>
                </TooltipContent>
              </Tooltip>

              <div className="w-px h-5 bg-white/10 mx-1" />

              <Tooltip>
                <TooltipTrigger >
                  <Button
                    onClick={toggleFullscreen}
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300"
                  >
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

      <ScriptTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </TooltipProvider>
  );
};




