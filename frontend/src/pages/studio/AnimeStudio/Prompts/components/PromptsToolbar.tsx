import React from 'react';
import { Zap, Copy, Download, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PromptsTabs, PromptsTab } from '../Tabs/PromptsTabs';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export type { PromptsTab };

interface PromptsToolbarProps {
  activeTab: PromptsTab;
  setActiveTab: (tab: PromptsTab) => void;
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
  showTabsOnly?: boolean;
}

export const PromptsToolbar: React.FC<PromptsToolbarProps> = ({
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
    <TooltipProvider>
      <div className="flex flex-col gap-6 w-full p-4 md:p-0">
        {!showTabsOnly && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-studio/10 border border-studio/20 flex items-center justify-center">
                <Zap className={cn("w-5 h-5", status === 'active' ? "text-studio" : "text-zinc-600")} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
              <div className="flex items-center justify-between w-full md:w-auto gap-4">

                {/* Production Unit */}
                <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md grow md:grow-0">
                  <span className="text-studio/60 text-xs font-black">#</span>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none">Production Unit</span>
                    <span className="text-sm font-black text-white font-mono leading-none mt-1">S{session}-E{episode}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-1 p-1.5 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md w-full md:w-auto">
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={handleCopy}
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300"
                      disabled={!content}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Copy Prompts to Clipboard</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300"
                      disabled={!content}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-black uppercase tracking-widest text-[9px]">Export Prompts</p>
                  </TooltipContent>
                </Tooltip>

                <div className="w-px h-5 bg-white/10 mx-1" />

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={toggleFullscreen}
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300"
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
        )}

        <PromptsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </TooltipProvider>
  );
};



