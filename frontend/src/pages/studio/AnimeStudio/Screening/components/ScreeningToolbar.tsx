import { Download, Maximize, Copy, Minimize, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useApp } from '@/contexts/AppContext';
import { screeningStyles as s } from '../screeningStyles';

interface ScreeningToolbarProps {
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
  activeSession?: number;
  setActiveSession?: (session: number) => void;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
}

export const ScreeningToolbar: React.FC<ScreeningToolbarProps> = ({
  status,
  session = '1',
  episode = '1',
  content = null,
  activeSession = 1,
  setActiveSession = () => { }
  ,
  isEditing = false,
  onEditingChange,
}) => {
  const { isFullscreen, showNotification } = useApp();

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
              <Monitor className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? s.toolbar.statusActive : s.toolbar.statusInactive)} />
            </div>
            <div className="flex flex-col gap-1">
              <span className={s.toolbar.statusTitle}>
                Screening Nexus {status === 'active' ? 'Active' : 'Standby'}
              </span>
              <span className={s.toolbar.statusSubtitle}>
                Production Viewport // Cinema_Control
              </span>
            </div>
          </div>

          {/* Session Navigation */}
          <div className="flex items-center bg-black/60 border border-white/5 p-1 rounded-full backdrop-blur-md shadow-inner">
            {[1, 2, 3, 4].map((s_num) => (
              <button
                key={s_num}
                onClick={() => setActiveSession(s_num)}
                className={cn(
                  "relative h-8 flex items-center px-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                  activeSession === s_num
                    ? "text-black bg-gradient-to-br from-studio to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "text-zinc-500 hover:text-studio/80 hover:bg-studio/5"
                )}
              >
                S{s_num}
              </button>
            ))}
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
                  <p className="font-black uppercase tracking-widest text-[9px]">Copy Viewport</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={s.toolbar.iconButton}
                    disabled={!content}
                    onClick={() => showNotification?.('This feature is currently in development.', 'info')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Export Cinema</p>
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
                  <p className="font-black uppercase tracking-widest text-[9px]">{isFullscreen ? "Exit Fullscreen" : "Cinema Mode"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
