import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StudioFooter } from '@/pages/studio/components/studio/layout/StudioFooter';

interface ProductionLayoutProps {
  topBar: React.ReactNode;
  navigation?: React.ReactNode;
  sidePanel?: React.ReactNode;
  bgClass?: string;
  accentGlow?: React.ReactNode;
}

export const ProductionLayout: React.FC<ProductionLayoutProps> = ({
  topBar,
  navigation,
  sidePanel,
  bgClass = "bg-[#020203]" }) => {
  const location = useLocation();

  return (
    <div className={`fixed inset-0 ${bgClass} flex flex-col overflow-hidden z-[1000] studio-engine-root`}>


      {/* Scrollable Container for everything EXCEPT TopBar */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
        {/* Top Bar Section (Now part of scroll if needed, or we keep it outside) */}
        {/* Actually, let's keep TopBar FIXED at top, and scroll everything else */}
        {/* Wait, the user wants the footer at the BOTTOM after content. */}
        {/* So TopBar stays fixed, Content + Footer scroll. */}

        {/* Content Section */}
        <div className="flex-1 flex overflow-hidden lg:overflow-visible relative">
          <div className="flex-1 flex flex-col min-w-0 relative">


            {/* Optional Navigation Section (Within scroll area) */}
            {navigation}

            <div className="w-full max-w-[1600px] mx-auto px-0 py-8 relative z-10">
              <div className="w-full min-h-[calc(100vh-280px)] bg-black/40 backdrop-blur-md border border-white/5 shadow-2xl rounded-[2.5rem] relative overflow-hidden">


                <div className="relative z-10 w-full h-full p-2 md:p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, ease: "linear" }}
                      className="w-full h-full"
                      style={{ willChange: 'opacity' }}
                    >
                      <Outlet />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Fixed Footer at the end of content scroll */}
            <StudioFooter />
          </div>

          {/* Optional Right Side Panel (e.g., Creative Engine) */}
          {sidePanel}
        </div>
      </div>

      {/* Keep Top Bar FIXED at top of viewport */}
      <div className="absolute top-0 left-0 right-0 z-[1100]">
        {topBar}
      </div>
    </div>
  );
};

