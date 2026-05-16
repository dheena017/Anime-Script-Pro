import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ScrollText,
  UserPlus,
  Layers,
  Zap,
  Loader2,
  SlidersHorizontal,
  X,
  Brain,
  Search,
  ImageIcon,
  Play,
  LayoutDashboard,
  Layout as LayoutIcon,
  Cpu,
  Globe
} from 'lucide-react';
import React from 'react';

interface AnimeStudioSideBarProps {
  basePath: string;
  handleGenerate?: () => void;
  isLoading?: boolean;
  rightSidebarOpen?: boolean;
  onToggleRightSidebar?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AnimeStudioSideBar = React.memo<AnimeStudioSideBarProps>(({
  basePath,
  handleGenerate,
  isLoading,
  rightSidebarOpen,
  onToggleRightSidebar,
  collapsed = false,
  onToggleCollapse
}) => {
  const location = useLocation();

  const foundationItems = [
    { icon: Zap, label: 'Creative Engine', path: '/engine' },
    { icon: Globe, label: 'World Builder', path: '/world' },
  ];

  const architectureItems = [
    { icon: UserPlus, label: 'Cast', path: '/cast' },
    { icon: Layers, label: 'Series', path: '/series' },
  ];

  const generationItems = [
    { icon: ScrollText, label: 'Script', path: '/script' },
    { icon: LayoutIcon, label: 'Storyboard', path: '/storyboard' },
    { icon: Layers, label: 'Assets', path: '/assets' },
  ];

  const distributionItems = [
    { icon: Search, label: 'SEO', path: '/seo' },
    { icon: ImageIcon, label: 'Prompts', path: '/prompts' },
    { icon: Play, label: 'Screening Room', path: '/screening' },
  ];

  const renderNavGroup = (items: any[], title: string, _color: string = "studio") => (
    <div className="space-y-1 mt-8">
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 mb-4 flex flex-col gap-1"
        >
          <p className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2">
            {title}
          </p>
        </motion.div>
      )}
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const fullPath = `${basePath}${item.path}`;
          const isActive = location.pathname.startsWith(fullPath);
          const Icon = item.icon;

          return (
            <motion.div
              key={item.path}
              initial={collapsed ? { opacity: 0, x: -20 } : { opacity: 0, x: -20 }}
              animate={!collapsed ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0 }}
            >
              <NavLink
                to={fullPath}
                title={collapsed ? item.label : undefined}
                onClick={() => { if (!collapsed) onToggleCollapse?.(); }}
                className={({ isActive: _isActive }) => cn(
                  "flex items-center gap-4 px-5 py-3 rounded-2xl text-xs font-black transition-all duration-300 group uppercase tracking-[0.2em] relative overflow-hidden mx-2",
                  isActive
                    ? "text-cyan-400 bg-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.1)] border border-cyan-500/20"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]",
                  collapsed && "opacity-40"
                )}
              >
                {isActive && !collapsed && (
                  <div className="absolute inset-0 bg-cyan-500/5 z-0" />
                )}
                <Icon className={cn(
                  "w-4 h-4 transition-all duration-500",
                  isActive
                    ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                    : "text-zinc-700 group-hover:text-zinc-400 group-hover:scale-110 group-hover:rotate-6"
                )} />
                <span className="relative z-10">{item.label}</span>
              </NavLink>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? 0 : 340,
        opacity: 1
      }}
      transition={{ duration: 0 }}
      className={cn(
        "fixed top-0 left-0 h-full bg-black flex flex-col z-[500] overflow-hidden transition-all duration-300",
        collapsed ? "cursor-pointer hover:bg-cyan-500/10" : "cursor-default"
      )}
      onClick={() => collapsed && onToggleCollapse?.()}
    >
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0 }}
            className="flex items-center gap-4 px-6 h-[80px] shrink-0 bg-black"
          >
            <Link to="/dashboard" className="flex items-center gap-4 group cursor-pointer transition-all active:scale-95">
              <div className="w-10 h-10 bg-black border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.2)] group-hover:border-cyan-400 group-hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] transition-all duration-500">
                <Zap className="text-cyan-500 w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-black tracking-[0.2em] text-[12px] uppercase text-white leading-none italic group-hover:text-cyan-400 transition-colors">Anime <span className="text-cyan-500">Studio</span></span>
                <span className="text-xs font-bold text-zinc-600 uppercase tracking-[0.3em] mt-1.5">Studio v2.5</span>
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse?.();
              }}
              className="ml-auto p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-10">
        <nav className="p-4">
          <div className="space-y-1 mb-8">
            {!collapsed && (
              <div className="px-5 mb-6 space-y-4">
                <p className="text-xs font-black text-cyan-500 uppercase tracking-[0.5em]">Production Studio</p>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-4 px-5 py-3 rounded-2xl text-xs font-black transition-all duration-300 group uppercase tracking-[0.2em] text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/5 border border-transparent hover:border-cyan-500/20"
                >
                  <LayoutDashboard className="w-4 h-4 text-zinc-700 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-500" />
                  <span>Return to Dashboard</span>
                </Link>
                <div className="h-px bg-zinc-800/50 mx-2" />
              </div>
            )}

            {renderNavGroup(foundationItems, "PHASE 1: FOUNDATION")}
            {renderNavGroup(architectureItems, "PHASE 2: STRUCTURE")}
            {renderNavGroup(generationItems, "PHASE 3: PRODUCTION")}
            {renderNavGroup(distributionItems, "PHASE 4: DISTRIBUTION")}
          </div>
        </nav>
      </div>


    </motion.aside>
  );
});
