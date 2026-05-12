import React from 'react';
import { Palette, Mic2, Zap, Download, Copy, Maximize, Minimize, Plus, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { storyboardStyles as s } from '../storyboardStyles';

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
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
}

export const StoryboardToolbar: React.FC<StoryboardToolbarProps> = ({
  status,
  session = '1',
  episode = '1',
  content = null,
  onAddScene,
  onEnhanceNarration,
  onEnhanceVisuals,
  isGlobalEnhancing,
  isEditing = false,
  onEditingChange
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
      <div className={s.toolbar.container}>
        <div className={s.toolbar.header}>
          {/* Identity */}
          <div className={s.toolbar.statusBox}>
            <div className={s.toolbar.statusIcon}>
              <Palette className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? s.toolbar.statusActive : s.toolbar.statusInactive)} />
            </div>
            <div className="flex flex-col gap-1">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r",
                isGlobalEnhancing ? "from-orange-400 to-studio animate-pulse" : "from-orange-400 to-orange-300"
              )}>
                Storyboard Nexus {status === 'active' ? 'Active' : 'Standby'}
              </span>
              <span className={s.toolbar.statusSubtitle}>
                Visual Design Engine // Frame_Ready
              </span>
            </div>
          </div>

          {/* Contextual Actions */}
          <div className="flex items-center gap-4">
            {onAddScene && (
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    className={s.toolbar.primaryButton}
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

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 border border-white/5 rounded-2xl backdrop-blur-md shadow-inner">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      s.toolbar.iconButton,
                      isEditing
                        ? "text-orange-400 border-orange-500/40 bg-orange-500/10 shadow-[0_0_10px_rgba(249,115,22,0.2)]"
                        : "text-zinc-400 hover:text-orange-400 hover:border-orange-500/40 hover:bg-orange-500/10"
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

              <div className="w-px h-4 bg-white/10 mx-0.5" />

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={s.toolbar.iconButton}
                    onClick={onEnhanceNarration}
                    disabled={isGlobalEnhancing}
                  >
                    <Mic2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Audio Synthesis</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={s.toolbar.iconButton}
                    onClick={onEnhanceVisuals}
                    disabled={isGlobalEnhancing}
                  >
                    <Zap className={cn("w-4 h-4", isGlobalEnhancing && "animate-pulse text-orange-400")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Refine Visuals</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className={s.toolbar.actionGroup}>
            <div className={s.toolbar.btnGroup}>
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
                  <p className="font-black uppercase tracking-widest text-[9px]">Copy Storyboard</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={handleDownload}
                    size="icon"
                    variant="ghost"
                    className={s.toolbar.iconButton}
                    disabled={!content}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Export JSON</p>
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
    </TooltipProvider>
  );
};
