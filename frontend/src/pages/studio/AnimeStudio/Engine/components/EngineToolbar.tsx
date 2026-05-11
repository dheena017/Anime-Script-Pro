import { Box, Copy, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EngineTabs, EngineTab } from '../tabs/EngineTabs';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { engineStyles as s } from '../engineStyles';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export type { EngineTab };

interface EngineToolbarProps {
  activeTab: EngineTab;
  setActiveTab: (tab: EngineTab) => void;
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
  showTabsOnly?: boolean;
}

export const EngineToolbar: React.FC<EngineToolbarProps> = ({
  activeTab,
  setActiveTab,
  status,
  session = '1',
  episode = '1',
  content = null,
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
    <div className={cn(s.toolbar.container, "flex flex-col gap-4")}>
      {!showTabsOnly && (
        <div className={s.toolbar.header}>
          {/* Identity */}
          <div className={s.toolbar.statusBox}>
            <div className={s.toolbar.statusIcon}>
              <Box className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? s.toolbar.statusActive : s.toolbar.statusInactive)} />
            </div>
            <div className="flex flex-col gap-1">
              <span className={s.toolbar.statusTitle}>
                Engine Nexus {status === 'active' ? 'Active' : 'Standby'}
              </span>
              <span className={s.toolbar.statusSubtitle}>
                System Status: Optimal // Engine_Sync_01
              </span>
            </div>
          </div>

          <div className={s.toolbar.actionGroup}>
            <div className={s.toolbar.btnGroup}>
              <TooltipProvider>
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
                    <p className="font-black uppercase tracking-widest text-[9px]">Copy Output</p>
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
              </TooltipProvider>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <EngineTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};
