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
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border border-white/5 rounded-2xl backdrop-blur-md shadow-inner">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-0.5">
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest bg-gradient-to-r bg-clip-text text-transparent",
                status === 'active' ? "from-studio/80 to-cyan-400/60" : "from-zinc-500 to-zinc-600"
              )}>
                Engine Nexus{' '}
                <span className={cn(status === 'active' ? 'text-studio' : 'text-zinc-700')}>{status === 'active' ? 'Active' : 'Standby'}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              onClick={handleCopy}
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-gradient-to-br hover:from-studio/20 hover:to-studio/5 transition-all duration-300 group relative overflow-hidden"
              disabled={!content}
            >
              <div className="absolute inset-0 bg-studio/0 group-hover:bg-studio/5 transition-colors duration-300" />
              <Copy className="w-3.5 h-3.5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </Button>
            <Button
              onClick={toggleFullscreen}
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-gradient-to-br hover:from-studio/20 hover:to-studio/5 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-studio/0 group-hover:bg-studio/5 transition-colors duration-300" />
              {isFullscreen ? <Minimize className="w-3.5 h-3.5 relative z-10 group-hover:scale-110 transition-transform duration-300" /> : <Maximize className="w-3.5 h-3.5 relative z-10 group-hover:scale-110 transition-transform duration-300" />}
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
