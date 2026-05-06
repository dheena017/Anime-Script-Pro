import { Copy, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EngineTabs, EngineTab } from '../tabs/EngineTabs';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

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
    <div className="flex flex-col gap-4 w-full">
      {!showTabsOnly && (
        <div className="flex items-center justify-between px-4 py-2 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">
                Engine Nexus <span className={cn(status === 'active' ? "text-studio" : "text-zinc-700")}>{status === 'active' ? 'Active' : 'Standby'}</span>
              </span>
            </div>
            <div className="w-px h-3 bg-white/5" />
            <div className="flex items-center gap-2">
              <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Unit:</span>
              <span className="text-[9px] font-black text-white font-mono tracking-widest">S{session}-E{episode}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              onClick={handleCopy}
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-lg text-zinc-600 hover:text-studio transition-all"
              disabled={!content}
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button
              onClick={toggleFullscreen}
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-lg text-zinc-600 hover:text-studio transition-all"
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <EngineTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};
