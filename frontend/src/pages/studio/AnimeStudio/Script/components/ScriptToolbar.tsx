import React from 'react';
import { ScrollText, Search, Layout, Volume2, Wand2, Download, RefreshCw, Copy, Maximize, Minimize, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScriptTab } from '../../Script/Tabs/ScriptTabs';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { scriptStyles as s } from '../scriptStyles';

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
        <div className={s.toolbar.container}>
          <div className={s.toolbar.header}>
            {/* Identity */}
            <div className={s.toolbar.statusBox}>
              <div className={s.toolbar.statusIcon}>
                <ScrollText className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? s.toolbar.statusActive : s.toolbar.statusInactive)} />
              </div>
              <div className="flex flex-col gap-1">
                <span className={s.toolbar.statusTitle}>
                  Script Nexus {status === 'active' ? 'Active' : 'Standby'}
                </span>
                <span className={s.toolbar.statusSubtitle}>
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
                      className={s.toolbar.navButton}
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
                      className={s.toolbar.navButtonActive}
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

            <div className={s.toolbar.actionGroup}>
              <div className={s.toolbar.btnGroup}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                          s.toolbar.iconButton,
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
                      className={s.toolbar.iconButton}
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
                      className={s.toolbar.iconButton}
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
                      className={s.toolbar.iconButton}
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
                      className={s.toolbar.iconButton}
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
                      className={s.toolbar.iconButton}
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
                      className={s.toolbar.iconButton}
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
                      className={s.toolbar.iconButton}
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
                      className={s.toolbar.iconButton}
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
