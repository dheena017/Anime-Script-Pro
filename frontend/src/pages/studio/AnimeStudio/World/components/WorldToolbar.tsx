import React from 'react';
import { Box, Copy, Download, Maximize, Minimize, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorldTabs, WorldTab } from '../tabs/WorldTabs';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface WorldToolbarProps {
  activeTab: WorldTab;
  setActiveTab: (tab: WorldTab) => void;
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
  showTabsOnly?: boolean;
  isEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
}

export const WorldToolbar: React.FC<WorldToolbarProps> = ({
  status,
  session = '1',
  episode = '1',
  content = null,
  showTabsOnly = false,
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
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
    }
  };

  const handleDownload = () => {
    if (content) {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'world_manifest.md';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <TooltipProvider>
      {!showTabsOnly && (
        <div className="toolbar-container flex flex-col gap-4">
          <div className="toolbar-header">
            <div className="toolbar-status-box">
              <div className="toolbar-status-icon">
                <Box className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? "text-studio drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "text-zinc-600")} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-studio/80 to-cyan-400/60 bg-clip-text text-transparent">
                  World Nexus {status === 'active' ? 'Active' : 'Standby'}
                </span>
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                  System Status: Optimal // World_Sync_01
                </span>
              </div>
            </div>

            <div className="toolbar-action-group">
              <div className="flex items-center justify-between w-full md:w-auto gap-4">
                {/* Actions */}
                <div className="toolbar-btn-group">
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
                      <p className="font-black uppercase tracking-widest text-[9px]">Copy Manifest to Clipboard</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger >
                      <Button
                        onClick={handleDownload}
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
                      <p className="font-black uppercase tracking-widest text-[9px]">Export as Markdown</p>
                    </TooltipContent>
                  </Tooltip>

                  <div className="w-px h-5 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1" />

                  <Tooltip>
                    <TooltipTrigger >
                      <Button
                        onClick={() => onEditingChange?.(!isEditing)}
                        variant="ghost"
                        className={cn(
                          "h-9 px-3 gap-2 rounded-lg transition-all duration-300 group relative overflow-hidden border",
                          isEditing
                            ? "text-studio bg-gradient-to-br from-studio/20 to-studio/5 hover:from-studio/30 hover:to-studio/10 border-studio/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                            : "text-zinc-400 hover:text-studio bg-transparent hover:bg-gradient-to-br hover:from-studio/15 hover:to-studio/5 border-transparent hover:border-studio/40"
                        )}
                      >
                        <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {isEditing ? 'Lock Edits' : 'Edit'}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="font-black uppercase tracking-widest text-[9px]">{isEditing ? "Lock Edits" : "Edit Manifest"}</p>
                    </TooltipContent>
                  </Tooltip>

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
        </div>
      )}
    </TooltipProvider>
  );
};





