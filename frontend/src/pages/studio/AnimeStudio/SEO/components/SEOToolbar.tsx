import React from 'react';
import { Search, Copy, Download, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface SEOToolbarProps {
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
}

export const SEOToolbar: React.FC<SEOToolbarProps> = ({
  status,
  content = null
  ,
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
      <div className="toolbar-container">
        <div className="toolbar-header">
          {/* Identity */}
          <div className="toolbar-status-box">
            <div className="toolbar-status-icon">
              <Search className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "text-zinc-600")} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
                SEO Manager {status === 'active' ? 'Active' : 'Standby'}
              </span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                Strategic Content Metadata // Search_Ready
              </span>
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
                    className="h-9 w-9 rounded-lg text-zinc-400 hover:text-emerald-400 border border-transparent hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all duration-300"
                    disabled={!content}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Copy SEO Matrix</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-lg text-zinc-400 hover:text-emerald-400 border border-transparent hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all duration-300"
                    disabled={!content}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-[9px]">Export Data</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={toggleFullscreen}
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-lg text-zinc-400 hover:text-emerald-400 border border-transparent hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all duration-300"
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
