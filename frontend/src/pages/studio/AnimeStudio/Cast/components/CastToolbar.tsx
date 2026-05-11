import React from 'react';
import { Activity, Copy, Download, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CastTabs, CastTab } from '../Tabs/CastTabs';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { castStyles as s } from '../castStyles';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export type { CastTab };

interface CastToolbarProps {
  activeTab: CastTab;
  setActiveTab: (tab: CastTab) => void;
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
  showTabsOnly?: boolean;
}

export const CastToolbar: React.FC<CastToolbarProps> = ({
  status,
  session = '1',
  episode = '1',
  content = null,
  showTabsOnly = false,
  activeTab,
  setActiveTab
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
      a.download = 'cast_manifest.md';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <TooltipProvider>
      {showTabsOnly && (
        <div className="w-full rounded-[1.5rem] border border-cyan-500/20 bg-[#050505]/95 px-3 py-3 shadow-[0_0_30px_rgba(6,182,212,0.06)]">
          <CastTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}

      {!showTabsOnly && (
        <div className={s.toolbar.container}>
          <div className={s.toolbar.header}>
            {/* Identity */}
            <div className={s.toolbar.statusBox}>
              <div className={s.toolbar.statusIcon}>
                <Activity className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? s.toolbar.statusActive : s.toolbar.statusInactive)} />
              </div>
              <div className="flex flex-col gap-1">
                <span className={s.toolbar.statusTitle}>
                  Cast Nexus {status === 'active' ? 'Active' : 'Standby'}
                </span>
                <span className={s.toolbar.statusSubtitle}>
                  {`System Status: Optimal // Cast_Sync_01 // ${session}-${episode}`}
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
                    <p className="font-black uppercase tracking-widest text-[9px]">Copy Cast</p>
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
                    <p className="font-black uppercase tracking-widest text-[9px]">
                      {isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
                    </p>
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
