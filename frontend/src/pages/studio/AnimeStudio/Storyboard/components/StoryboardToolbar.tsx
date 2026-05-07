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
      <div className="toolbar-container">
        <div className="toolbar-header">
          {/* Identity */}
          <div className="toolbar-status-box">
            <div className="toolbar-status-icon">
              <Palette className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? "text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.6)]" : "text-zinc-600")} />
            </div>
            <div className="flex flex-col gap-1">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r",
                isGlobalEnhancing ? "from-fuchsia-400 to-studio animate-pulse" : "from-fuchsia-400 to-fuchsia-300"
              )}>
                Storyboard Nexus {status === 'active' ? 'Active' : 'Standby'}
              </span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
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
                    className="h-9 px-4 rounded-xl font-black uppercase tracking-widest text-[9px] text-zinc-300 border-zinc-700 hover:text-fuchsia-400 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10 transition-all duration-300 group"
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
                    className="h-8 w-8 rounded-lg text-zinc-400 hover:text-fuchsia-400 border border-transparent hover:border-fuchsia-500/40 hover:bg-fuchsia-500/10 transition-all duration-300"
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
                    className="h-8 w-8 rounded-lg text-zinc-400 hover:text-fuchsia-400 border border-transparent hover:border-fuchsia-500/40 hover:bg-fuchsia-500/10 transition-all duration-300"
                    onClick={onEnhanceVisuals}
                    disabled={isGlobalEnhancing}
                  >
                    <Zap className={cn("w-4 h-4", isGlobalEnhancing && "animate-pulse text-fuchsia-400")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Refine Visuals</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="toolbar-action-group">
            <div className="toolbar-btn-group">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={handleCopy}
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-lg text-zinc-400 hover:text-fuchsia-400 border border-transparent hover:border-fuchsia-500/40 hover:bg-fuchsia-500/10 transition-all duration-300"
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
                    className="h-9 w-9 rounded-lg text-zinc-400 hover:text-fuchsia-400 border border-transparent hover:border-fuchsia-500/40 hover:bg-fuchsia-500/10 transition-all duration-300"
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
                    className="h-9 w-9 rounded-lg text-zinc-400 hover:text-fuchsia-400 border border-transparent hover:border-fuchsia-500/40 hover:bg-fuchsia-500/10 transition-all duration-300"
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
