import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StudioSideBar as Sidebar } from '@/pages/studio/components/studio/layout/StudioSideBar';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { NeuralErrorSentinel } from '@/pages/studio/components/studio/NeuralErrorSentinel';

import { GlobalTopBar } from './components/GlobalTopBar';

export function Layout() {
  const { isFullscreen } = useApp();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const isStudioMode = location.pathname.startsWith('/projects/') && !location.pathname.endsWith('/new') && !location.pathname.endsWith('/projects');

  return (
    <div className={cn(
      "h-screen bg-[#050505] text-zinc-100 flex font-sans selection:bg-red-500/30 overflow-hidden",
      isFullscreen && "studio-fullscreen-mode"
    )}>

      {/* Unified Sidebar (hidden on studio-mode-less routes like /projects/:id) */}
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
        <GlobalTopBar />

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
        </div>
      </div>
      <NeuralErrorSentinel />
    </div>
  );
}
