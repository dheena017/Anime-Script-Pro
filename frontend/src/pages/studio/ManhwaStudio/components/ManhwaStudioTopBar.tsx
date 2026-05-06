import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  Maximize2,
  SlidersHorizontal,
  Bell,
  Cpu,
  Menu,
  Grid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ManhwaStudioTopBarProps {
  onToggleEngine: () => void;
  isEngineOpen: boolean;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleGlobalSidebar?: () => void;
  isGlobalSidebarOpen?: boolean;
}

export function ManhwaStudioTopBar({
  onToggleEngine,
  isEngineOpen,
  onToggleSidebar,
  isSidebarCollapsed,
  onToggleGlobalSidebar,
  isGlobalSidebarOpen
}: ManhwaStudioTopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract current phase from path
  const currentPath = location.pathname.split('/').pop() || 'world';
  
  // Map path segments to phase display names
  const phaseMap: { [key: string]: string } = {
    'engine': 'Engine',
    'world': 'Anime World',
    'cast': 'Cast',
    'series': 'Series',
    'script': 'Script',
    'storyboard': 'Storyboard',
    'seo': 'SEO',
    'prompts': 'Prompts',
    'screening': 'Screening Room'
  };
  
  const phaseLabel = phaseMap[currentPath] || currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

  return (
    <header className={cn(
      "h-[70px] bg-black/60 border-b border-zinc-800/50 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 transition-all duration-500",
      isEngineOpen ? "backdrop-blur-2xl border-violet-500/20" : "backdrop-blur-md"
    )}>
      {/* Left: Branding & Sidebars Toggle */}
      <div className="flex items-center gap-4">
        {/* Global Hub Toggle */}
        <button
          onClick={onToggleGlobalSidebar}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300",
            !isGlobalSidebarOpen
              ? "text-zinc-500 hover:text-white hover:bg-white/5"
              : "text-violet-500 bg-violet-500/10 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
          )}
          title="Global Hub"
        >
          <Grid className="w-5 h-5" />
        </button>

        {/* Studio Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300",
            isSidebarCollapsed
              ? "text-zinc-500 hover:text-white hover:bg-white/5"
              : "text-violet-400 bg-violet-500/5 border border-violet-500/10"
          )}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu className={cn("w-5 h-5 transition-transform duration-500", isSidebarCollapsed && "rotate-90")} />
        </button>

        <div className="h-8 w-px bg-zinc-800/50 hidden lg:block" />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl border border-violet-500/80 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Cpu className="w-4 h-4 text-violet-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500">Manhwa Studio</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-700 hidden sm:block" />
          <div className="flex flex-col">
            <h1 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] text-white leading-none">New Production</h1>
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Phase: {phaseLabel}</p>
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:mr-4 md:pr-4 md:border-r border-zinc-800/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleEngine}
            className={cn(
              "h-9 px-2 md:px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300",
              isEngineOpen
                ? "bg-violet-500/10 text-violet-500 border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 md:mr-2" />
            <span className="hidden md:inline">Creative Engine</span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-9 h-9 hidden sm:flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Bell className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 hidden sm:flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="ml-2 w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-violet-500/50 transition-all p-0.5"
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Creator" alt="Profile" className="w-full h-full object-cover rounded-lg" />
          </button>
        </div>
      </div>
    </header>
  );
}
