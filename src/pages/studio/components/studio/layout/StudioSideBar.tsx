import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import {
  ScrollText,
  History,
  Settings2,
  LayoutDashboard,
  Users,
  Brain,
  BookOpen,
  Compass,
  Activity,
  MessageSquare,
  Bell,
  Terminal,
  Database,
  Zap,
  Layout as LayoutGrid,
  Sparkles,
  X} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: History, label: 'My Library', path: '/library' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Compass, label: 'Discover', path: '/discover' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: BookOpen, label: 'Tutorials', path: '/tutorials' },
  { icon: Settings2, label: 'Settings', path: '/settings' },
];

interface StudioSideBarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export const StudioSideBar = React.memo<StudioSideBarProps>(({ collapsed, setCollapsed }) => {
  const location = useLocation();

  const getPrefix = () => {
    if (location.pathname.startsWith('/anime')) return '/anime';
    if (location.pathname.startsWith('/manhwa')) return '/manhwa';
    if (location.pathname.startsWith('/comic')) return '/comic';
    return '/anime';
  };

  const prefix = getPrefix();

  const studioTypes = [
    { id: 'anime', label: 'Anime Studio', path: '/anime', icon: Brain, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { id: 'manhwa', label: 'Manhwa Studio', path: '/manhwa', icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { id: 'comic', label: 'Comic Studio', path: '/comic', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];


  const renderNavGroup = (items: any[], title: string, color: string = "red") => (
    <div className="space-y-1 mt-8">
      {!collapsed && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 mb-4 flex flex-col gap-1"
        >
          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className={cn("w-3 h-[1px]", color === "studio" ? "bg-cyan-500/50" : "bg-red-500/50")} /> {title}
          </p>
          <div className="h-[1px] w-full bg-gradient-to-r from-zinc-800/50 to-transparent" />
        </motion.div>
      )}
      <div className="flex flex-col gap-1">
        {items.map((item, idx) => {
          const fullPath = item.path.startsWith('/') ? item.path : `${prefix}/${item.path}`;
          const isActive = location.pathname === fullPath || (location.pathname.startsWith(fullPath) && item.path !== 'world');
          const Icon = item.icon;
          
          const activeStyles = color === "studio" 
            ? "text-cyan-400 bg-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.1)] border border-cyan-500/20"
            : "text-red-500 bg-red-500/10 shadow-[0_0_25px_rgba(220,38,38,0.1)] border border-red-500/20";
          
          return (
            <motion.div
              key={item.path}
              initial={collapsed ? { opacity: 0, x: -20 } : { opacity: 0, x: -20 }}
              animate={!collapsed ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0 }} 
            >
              <NavLink
                to={fullPath}
                className={({ isActive: _isActive }) => cn(
                  "flex items-center gap-4 px-5 py-3 rounded-2xl text-[10px] font-black transition-all duration-300 group uppercase tracking-[0.2em] relative overflow-hidden mx-2",
                  isActive ? activeStyles : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]",
                  collapsed && "opacity-0"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId={`sidebar-active-indicator-${title}`}
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full",
                      color === "studio" ? "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,1)]" : "bg-red-500 shadow-[0_0_12px_rgba(220,38,38,1)]"
                    )}
                  />
                )}
                <Icon className={cn(
                  "w-4 h-4 transition-all duration-500",
                  isActive 
                    ? (color === "studio" ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]")
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
        x: collapsed ? -324 : 0,
        opacity: 1
      }}
      onClick={() => collapsed && setCollapsed(false)}
      transition={{ duration: 0 }}
      className={cn(
        "fixed top-0 left-0 h-full w-[340px] border-r border-zinc-800/30 bg-black flex flex-col z-[500] shadow-[20px_0_80px_rgba(0,0,0,1)] overflow-hidden transition-colors duration-300 will-change-transform",
        collapsed ? "cursor-pointer hover:bg-red-500/10 border-red-500/20" : "cursor-default"
      )}
    >
      <AnimatePresence>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0 }}
            className="flex items-center gap-4 px-6 h-[80px] border-b border-zinc-800/50 shrink-0 bg-black"
          >
            <div className="w-10 h-10 bg-black border border-red-500/30 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.2)]">
              <ScrollText className="text-red-500 w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-[0.2em] text-[12px] uppercase text-white leading-none">Studio <span className="text-red-500">Architect</span></span>
              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.3em] mt-1.5">Neural Core v2.5</span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-10">
        <nav className="p-4 space-y-8">
          {!collapsed && (
            <div className="px-2 space-y-1">
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] px-3 mb-3">Studio Selection</p>
              <div className="flex flex-col gap-1">
                {studioTypes.map((studio) => {
                  const isActive = location.pathname.startsWith(studio.path);
                  const Icon = studio.icon;
                  return (
                    <NavLink
                      key={studio.id}
                      to={studio.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                        isActive 
                          ? `${studio.bg} ${studio.color} border border-white/10 shadow-lg` 
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent"
                      )}
                    >
                      <Icon className={cn("w-3.5 h-3.5", isActive ? studio.color : "text-zinc-600")} />
                      <span>{studio.label}</span>
                      {isActive && <div className={cn("ml-auto w-1.5 h-1.5 rounded-full animate-pulse", studio.id === 'anime' ? 'bg-cyan-500' : studio.id === 'manhwa' ? 'bg-violet-500' : 'bg-orange-500')} />}
                    </NavLink>
                  );
                })}
              </div>
              <div className="h-px bg-gradient-to-r from-zinc-800/50 to-transparent my-6 mx-2" />
            </div>
          )}

          {/* ALWAYS RENDER CORE NAVIGATION */}
          {renderNavGroup(navItems, "CORE INTERFACE", "red")}

          {!collapsed && (
             <div className="pt-4">
                {renderNavGroup([
                  { icon: BookOpen, label: 'Docs', path: '/system/docs' },
                  { icon: LayoutGrid, label: 'Projects', path: '/projects' },
                  { icon: Terminal, label: 'Terminal', path: '/api-reference' },
                  { icon: Database, label: 'Archive', path: '/lore-database' },
                  { icon: Activity, label: 'Neural Health', path: '/system/health' },
                  { icon: MessageSquare, label: 'Uplink', path: '/system/feedback' },
                ], "NEURAL PROTOCOLS", "red")}
             </div>
          )}
        </nav>
      </div>

      {!collapsed && (
        <div className="p-6 border-t border-zinc-800/40 bg-black">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-5 border border-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-[40px] -z-10 group-hover:bg-cyan-500/10 transition-colors" />
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <Brain className="w-4 h-4 text-cyan-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-200">Neural Engine</span>
            </div>
            <p className="text-[9px] text-zinc-500 font-bold leading-relaxed mb-4 uppercase tracking-wider">
              Level 42 Sync Established. Multi-Session Persistence Online.
            </p>
            <button className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white text-[9px] font-black rounded-xl transition-all tracking-[0.2em] uppercase shadow-[0_5px_15px_rgba(220,38,38,0.3)] hover:scale-[1.02] active:scale-95">
              Sync Premium
            </button>
          </div>
        </div>
      )}
    </motion.aside>
  );
});

