import React from 'react';
import { Layers, Copy, Download, Maximize, Minimize, FileText, Plus, ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { seriesStyles as s } from '../seriesStyles';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface SeriesToolbarProps {
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
  onManifestClick?: () => void;
  onExportClick?: () => void;
  onAddEpisode?: () => void;
  onFilterArchive?: () => void;
}

export const SeriesToolbar: React.FC<SeriesToolbarProps> = ({
  status,
  session = '1',
  episode = '1',
  content = null,
  onManifestClick,
  onExportClick,
  onAddEpisode,
  onFilterArchive


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
    if (onExportClick) {
      onExportClick();
      return;
    }

    if (content) {
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `series-manifest-S${session}-E${episode}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleManifestClick = () => {
    if (onManifestClick) {
      onManifestClick();
    }
  };

  return (
    <TooltipProvider>
      <div className={s.toolbar.container}>
        <div className={s.toolbar.header}>
          {/* Identity */}
          <div className={s.toolbar.statusBox}>
            <div className={s.toolbar.statusIcon}>
              <Layers className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? s.toolbar.statusActive : s.toolbar.statusInactive)} />
            </div>
            <div className="flex flex-col gap-1">
              <span className={s.toolbar.statusTitle}>
                Series Nexus {status === 'active' ? 'Active' : 'Standby'}
              </span>
              <span className={s.toolbar.statusSubtitle}>
                System Status: Optimal // Series_Sync_01
              </span>
            </div>
          </div>

          <div className={s.toolbar.actionGroup}>
            <div className={s.toolbar.btnGroup}>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={handleManifestClick}
                    size="icon"
                    variant="ghost"
                    className={s.toolbar.iconButton}
                    disabled={!onManifestClick}
                  >
                    <FileText className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-xs">Series Manifest</p>
                </TooltipContent>
              </Tooltip>

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
                  <p className="font-black uppercase tracking-widest text-xs">Copy JSON</p>
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
                  <p className="font-black uppercase tracking-widest text-xs">Export File</p>
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
                  <p className="font-black uppercase tracking-widest text-xs">{isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 border-l border-white/5 pl-8">
              <Button
                variant="outline"
                className="h-11 px-5 border-white/10 bg-black/40 text-zinc-500 hover:text-studio hover:border-studio/40 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300"
                onClick={onFilterArchive}
              >
                <ListFilter className="w-4 h-4 mr-3" /> Filter Archive
              </Button>

              <Button
                className="h-11 px-8 bg-studio text-black font-black uppercase tracking-widest text-[10px] hover:bg-studio/80 shadow-[0_0_30px_rgba(6,182,212,0.3)] rounded-xl transition-all duration-300"
                onClick={onAddEpisode}
              >
                <Plus className="w-5 h-5 mr-3" /> New Episode
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

