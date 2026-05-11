import React from 'react';
import { Zap, Copy, Download, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { promptsStyles as s } from '../promptsStyles';

interface PromptsToolbarProps {
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
}

export const PromptsToolbar: React.FC<PromptsToolbarProps> = ({
  status,
  content = null,
  isEditing = false,
  onEditingChange,
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
      <div className={s.toolbar.container}>
        <div className={s.toolbar.header}>
          {/* Identity */}
          <div className={s.toolbar.statusBox}>
            <div className={s.toolbar.statusIcon}>
              <Zap className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? s.toolbar.statusActive : s.toolbar.statusInactive)} />
            </div>
            <div className="flex flex-col gap-1">
              <span className={s.toolbar.statusTitle}>
                Prompt Hub {status === 'active' ? 'Active' : 'Standby'}
              </span>
              <span className={s.toolbar.statusSubtitle}>
                Visual Design System // Ready_for_Production
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
                  <p className="font-black uppercase tracking-widest text-[9px]">Copy Prompts</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={s.toolbar.iconButton}
                    disabled={!content}
                  >
                    <Download className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Export Prompts</p>
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
    </TooltipProvider>
  );
};
