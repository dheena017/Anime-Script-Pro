import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StudioSideBar as Sidebar } from '@/pages/studio/components/studio/layout/StudioSideBar';
import { cn } from '@/lib/utils';
import { topbarOuterClass, topbarInnerClass } from '@/components/layout/topbarStyles';
import {
  User,
  HelpCircle,
  FolderGit2,
  ChevronDown,
  Search
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { NeuralConsole } from '@/pages/studio/components/studio/NeuralConsole';
import { NeuralErrorSentinel } from '@/pages/studio/components/studio/NeuralErrorSentinel';
import { NotificationCenter } from '@/components/widgets/NotificationCenter';

import { StudioFooter } from '@/pages/studio/components/studio/layout/StudioFooter';

export function Layout() {
  const { isFullscreen, currentProject } = useApp();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);


  const isStudioMode = location.pathname.startsWith('/anime') ||
    location.pathname.startsWith('/manhwa') ||
    location.pathname.startsWith('/comic');

  return (
    <div className={cn(
      "h-screen bg-[#050505] text-zinc-100 flex font-sans selection:bg-red-500/30 overflow-hidden",
      isFullscreen && "studio-fullscreen-mode"
    )}>


      {/* Unified Sidebar (hidden on studio-mode-less routes like /anime) */}
      {!isStudioMode && (
        <Sidebar collapsed={!isSidebarOpen} setCollapsed={(val) => setIsSidebarOpen(!val)} />
      )}

      {/* Content Backdrop / Blur when Sidebar is open */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'linear' }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-[450] cursor-pointer"
          />
        )}
      </AnimatePresence>

      <div
        className="flex-1 flex flex-col min-w-0 bg-[#050505] transition-all duration-300 overflow-hidden"
      >
        <header className={topbarOuterClass}>
          <div className={topbarInnerClass}>
            <div className="flex items-center gap-4">
              {/* Project Selector - Studio Only */}
              {isStudioMode && (
                <Link to="/library" className={cn("hidden lg:flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group no-underline") }>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest leading-none">Architect</span>
                    <span className="text-xs font-bold text-white leading-tight">{currentProject?.title || 'Production'}</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors ml-2" />
                </Link>
              )}
            </div>

            {/* Global Search Bar */}
            <div className="hidden xl:flex flex-1 max-w-md mx-8 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-red-500 transition-all duration-300" />
              <input
                type="text"
                placeholder="Global Search Manifests..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-[10px] font-black text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/30 focus:bg-white/[0.06] transition-all uppercase tracking-[0.2em] shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[8px] font-black text-zinc-500 tracking-tighter">
                ⌘ K
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Quick Actions */}
              <div className="hidden sm:flex items-center gap-4 border-r border-zinc-800 pr-6 mr-2">
                {!isStudioMode && (
                  <Link to="/create-project" className="bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/30 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 no-underline">
                    New Production
                  </Link>
                )}
                <Link to="/help" className="text-zinc-400 hover:text-white transition-colors" title="Help Hub">
                  <HelpCircle className="w-5 h-5" />
                </Link>
                <NotificationCenter />
              </div>


              <Link to="/profile" className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-[#bd4a4a]/50 hover:shadow-[0_0_15px_rgba(189,74,74,0.2)] transition-all group" title="Architect Profile">
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <main className="relative z-10 p-6 md:p-10 min-h-[calc(100vh-200px)]">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence>
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: 'linear' }}
                  style={{ willChange: 'opacity' }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <div className="mt-40 mb-10">
            <StudioFooter />
          </div>
        </div>
      </div>
      <NeuralConsole />
      <NeuralErrorSentinel />
    </div>
  );
}



