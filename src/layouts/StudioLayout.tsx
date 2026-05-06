import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Outlet } from 'react-router-dom';
import { StudioSideBar } from '@/pages/studio/components/studio/layout/StudioSideBar';
import { StudioTopBar } from '@/pages/studio/components/studio/layout/StudioTopBar';
import { StudioFooter } from '@/pages/studio/components/studio/layout/StudioFooter';
import { NeuralConsole } from '@/pages/studio/components/studio/NeuralConsole';
import { NeuralErrorSentinel } from '@/pages/studio/components/studio/NeuralErrorSentinel';
import { NeuralPulseLayer } from '@/components/neural/NeuralPulseLayer';
import { StudioLoading } from '@/pages/studio/components/studio/StudioLoading';
import { DeferredRender } from '@/pages/studio/components/studio/DeferredRender';
import { studioLog, studioGroup, studioEnd } from '@/lib/studio-logger';

export const StudioLayout: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(true); // Default closed
  const [showNotifications, setShowNotifications] = React.useState(false);

  // System Boot Sequence
  React.useEffect(() => {
    studioGroup('SYSTEM', 'Studio Environment Initializing', 'system');
    studioLog('SYSTEM', 'Core engine v2.4.0 active', 'success');
    studioLog('SYSTEM', 'Neural pulse layer synchronized', 'anime');
    studioLog('SYSTEM', 'Global navigation monitor ready', 'info');
    studioEnd();
  }, []);

  // Disable scroll when sidebar is open
  React.useEffect(() => {
    if (!collapsed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [collapsed]);
  const backdropTextureStyle = {
    backgroundImage:
      'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0, transparent 1px), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 0, transparent 1px), radial-gradient(circle at 40% 70%, rgba(255,255,255,0.06) 0, transparent 1px), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.04) 0, transparent 1px)',
    backgroundSize: '24px 24px',
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <NeuralPulseLayer />
      <StudioSideBar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Content Backdrop / Blur when Sidebar is open */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'linear' }}
            onClick={() => setCollapsed(true)}
            className="fixed inset-0 bg-black/60 z-[450] cursor-pointer"
          />
        )}
      </AnimatePresence>
      <main
        className="flex-1 flex flex-col relative overflow-hidden pt-[60px] transition-all duration-300"
      >
        <StudioTopBar
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          <div className="p-6 lg:p-10 flex-1 relative pb-32">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]" style={backdropTextureStyle} />
            <AnimatePresence>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "linear" }}
                className="relative z-10 h-full flex flex-col min-h-[48vh]"
                style={{ willChange: 'opacity' }}
              >
                <DeferredRender delay={32} fallback={<StudioLoading fullPage={false} message="Loading content..." submessage="Preparing the workspace..." />}>
                  <Outlet />
                </DeferredRender>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-40 mb-10 px-6 lg:px-10">
            <StudioFooter />
          </div>
        </div>
      </main>
      <NeuralConsole />
      <NeuralErrorSentinel />
    </div>
  );
};




