import React from 'react';
import { ScrollText, Search, Layout, Volume2, Wand2, Download, RefreshCw, Copy, Maximize, Minimize, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
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
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
  showTabsOnly?: boolean;
}

export const ScriptToolbar: React.FC<ScriptToolbarProps> = ({
  status,
  content = null,
  onExport,
  onViewSEO,
  onViewPrompts,
  onViewStoryboard,
  onExtend,
  onListen,
  onPrev,
  onNext,
  isEditing = false,
  onEditingChange,
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
        <div className="toolbar-container">
          <div className="toolbar-header">
            {/* Identity */}
            <div className="toolbar-status-box">
              <div className="toolbar-status-icon">
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
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-studio/10 transition-all text-[9px] font-black uppercase tracking-widest gap-2 group relative overflow-hidden"
                      onClick={onPrev}
                      disabled={!onPrev}
                    >
                      <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform duration-300" />
                      PREV
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Previous Episode</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 rounded-lg text-studio/80 hover:text-studio transition-all text-[9px] font-black uppercase tracking-widest gap-2 bg-studio/10 border border-studio/30 hover:border-studio/50 group"
                      onClick={onNext}
                      disabled={!onNext}
                    >
                      NEXT
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Next Episode</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            <div className="toolbar-action-group">
              <div className="toolbar-btn-group">
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-lg transition-all duration-300 border border-transparent",
                        isEditing 
                          ? "text-cyan-400 border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.2)]" 
                          : "text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/40 hover:bg-cyan-500/10"
                      )}
                      onClick={() => onEditingChange?.(!isEditing)}
                    >
                      <Edit3 className={cn("w-4 h-4", isEditing && "animate-pulse")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">{isEditing ? "Disable Editing" : "Enable Editing"}</p>
                  </TooltipContent>
                </Tooltip>

                <div className="w-px h-4 bg-white/10 mx-1" />

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all duration-300"
                      onClick={onViewSEO}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">SEO Matrix</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all duration-300"
                      onClick={onViewPrompts}
                    >
                      <Wand2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">AI Prompts</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all duration-300"
                      onClick={onViewStoryboard}
                    >
                      <Layout className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Storyboard</p>
                  </TooltipContent>
                </Tooltip>

                <div className="w-px h-4 bg-white/10 mx-1" />

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all duration-300"
                      onClick={onExtend}
                      disabled={!content}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Extend Script</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all duration-300"
                      onClick={onListen}
                      disabled={!content}
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Voiceover</p>
                  </TooltipContent>
                </Tooltip>

                <div className="w-px h-4 bg-white/10 mx-1" />

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={handleCopy}
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-studio/10 transition-all duration-300"
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
                  <TooltipTrigger>
                    <Button
                      onClick={onExport}
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-studio/10 transition-all duration-300"
                      disabled={!content}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Export PDF</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={toggleFullscreen}
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-studio/10 transition-all duration-300"
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
    </TooltipProvider>
  );
};
