import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  Maximize2,
  SlidersHorizontal,
  Bell,
  Cpu,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { studioTopbarOuterClass } from '@/components/layout/topbarStyles';
import { Button } from '@/components/ui/button';

interface AnimeStudioTopBarProps {
  onToggleEngine: () => void;
  isEngineOpen: boolean;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleGlobalSidebar?: () => void;
  isGlobalSidebarOpen?: boolean;
}

export const AnimeStudioTopBar = React.memo<AnimeStudioTopBarProps>(({
  onToggleEngine,
  isEngineOpen,
  onToggleSidebar,
  isSidebarCollapsed,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract current phase from path
  const currentPath = location.pathname.split('/').pop() || 'world';
  
  // Map path segments to phase display names
  const phaseMap: { [key: string]: { phase: string; label: string } } = {
    'engine': { phase: 'PHASE 1: FOUNDATION', label: 'Creative Engine' },
    'world': { phase: 'PHASE 1: FOUNDATION', label: 'World Builder' },
    'protocols': { phase: 'PHASE 1: FOUNDATION', label: 'Directives Hub' },
    'cast': { phase: 'PHASE 2: STRUCTURE', label: 'Cast' },
    'series': { phase: 'PHASE 2: STRUCTURE', label: 'Series' },
    'script': { phase: 'PHASE 3: PRODUCTION', label: 'Script' },
    'storyboard': { phase: 'PHASE 3: PRODUCTION', label: 'Storyboard' },
    'assets': { phase: 'PHASE 3: PRODUCTION', label: 'Assets' },
    'seo': { phase: 'PHASE 4: DISTRIBUTION', label: 'SEO' },
    'prompts': { phase: 'PHASE 4: DISTRIBUTION', label: 'Prompts' },
    'screening': { phase: 'PHASE 4: DISTRIBUTION', label: 'Screening Room' }
  };
  
  const phaseInfo = phaseMap[currentPath] || { phase: 'PHASE 1: FOUNDATION', label: currentPath.charAt(0).toUpperCase() + currentPath.slice(1) };

  return (
    <header className={cn(
      studioTopbarOuterClass,
      isEngineOpen ? "border-studio/20" : ""
    )}>
      {/* Left: Branding & Sidebars Toggle */}
      <div className="flex items-center gap-4">
        {/* (Removed Global Hub and Studio Sidebar toggles) */}
        <button
          onClick={onToggleSidebar}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300",
            isSidebarCollapsed
              ? "text-zinc-500 hover:text-white hover:bg-white/5"
              : "text-cyan-400 bg-cyan-500/5 border border-cyan-500/10"
          )}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu className={cn("w-5 h-5 transition-transform duration-500", isSidebarCollapsed && "rotate-90")} />
        </button>

        <div className="h-8 w-px bg-zinc-800/50 hidden lg:block" />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl border border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Cpu className="w-4 h-4 text-cyan-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500">Anime Studio</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-700 hidden sm:block" />
          <div className="flex flex-col">
            <h1 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] text-white leading-none">New Production</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-[8px] font-black uppercase tracking-[0.28em] text-cyan-400">
                {phaseInfo.phase}
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700">•</span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                {phaseInfo.label}
              </span>
            </div>
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
                ? "bg-red-500/10 text-red-500 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
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
            className="ml-2 w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-red-500/50 transition-all p-0.5"
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Architect" alt="Profile" className="w-full h-full object-cover rounded-lg" />
          </button>
        </div>
      </div>
    </header>
  );
});
