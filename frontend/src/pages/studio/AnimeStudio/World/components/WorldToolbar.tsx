import React from 'react';
import { Box, Copy, Download, Maximize, Minimize, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorldTabs, WorldTab } from '../tabs/WorldTabs';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { worldStyles as s } from '../worldStyles';

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
        <div className={cn(s.toolbar.container, "flex flex-col gap-4")}>
          <div className={s.toolbar.header}>
            <div className={s.toolbar.statusBox}>
              <div className={s.toolbar.statusIcon}>
                <Box className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? s.toolbar.statusActive : s.toolbar.statusInactive)} />
              </div>
              <div className="flex flex-col gap-1">
                <span className={s.toolbar.statusTitle}>
                  World Nexus {status === 'active' ? 'Active' : 'Standby'}
                </span>
                <span className={s.toolbar.statusSubtitle}>
                  System Status: Optimal // World_Sync_01
                </span>
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
                      <Copy className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Copy Manifest</p>
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
                      <Download className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Export Markdown</p>
                  </TooltipContent>
                </Tooltip>

                <div className="w-px h-4 bg-white/10 mx-1" />

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={() => onEditingChange?.(!isEditing)}
                      variant="ghost"
                      className={cn(
                        s.toolbar.iconButtonActive,
                        !isEditing && "bg-transparent border-white/10 hover:border-studio/40 hover:text-studio"
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
                  <TooltipTrigger>
                    <Button
                      onClick={toggleFullscreen}
                      size="icon"
                      variant="ghost"
                      className={s.toolbar.iconButton}
                    >
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
