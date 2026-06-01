import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { sharedStyles as s } from './sharedStyles';

interface TabItem {
  id: string;
  label: string;
  icon: any;
}

interface StudioTabRailProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  layoutId: string;
}

export const StudioTabRail: React.FC<StudioTabRailProps> = ({ tabs, activeTab, onTabChange, layoutId }) => {
  const navRef = React.useRef<HTMLDivElement | null>(null);
  const tabButtonRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    const element = navRef.current;
    if (!element) return;

    setCanScrollLeft(element.scrollLeft > 4);
    setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 4);
  }, []);

  React.useEffect(() => {
    updateScrollState();
    const element = navRef.current;
    if (!element) return;

    const handleScroll = () => updateScrollState();
    const handleResize = () => updateScrollState();

    element.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      element.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [tabs.length, updateScrollState]);

  React.useEffect(() => {
    const activeButton = tabButtonRefs.current[activeTab];
    if (!activeButton) return;

    activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    requestAnimationFrame(updateScrollState);
  }, [activeTab, updateScrollState]);

  const scrollByAmount = (amount: number) => {
    navRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className={s.tabRail}>
      <button
        type="button"
        aria-label="Scroll tabs left"
        onClick={() => scrollByAmount(-360)}
        className={cn(s.tabArrowButton, 'left-2', !canScrollLeft && s.tabArrowButtonDisabled)}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="px-12">
        <nav ref={navRef} className={s.tabList}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                ref={(node) => {
                  tabButtonRefs.current[tab.id] = node;
                }}
                type="button"
                key={tab.id}
                data-active-tab={isActive}
                onClick={() => onTabChange(tab.id)}
                className={cn(s.tabItem, isActive ? s.tabActive : s.tabInactive)}
              >
                {isActive && <motion.div layoutId={layoutId} className={s.tabIndicator} />}
                <tab.icon className={cn('relative z-10 h-4 w-4 transition-colors', isActive ? 'text-[#bd4a4a]' : 'text-zinc-700 group-hover:text-zinc-500')} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        aria-label="Scroll tabs right"
        onClick={() => scrollByAmount(360)}
        className={cn(s.tabArrowButton, 'right-2', !canScrollRight && s.tabArrowButtonDisabled)}
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Mobile bottom rail (icon-only) */}
      <div className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[320] bg-[#050505]/95 backdrop-blur-md px-3 py-2 rounded-3xl shadow-2xl flex items-center gap-2">
        {tabs.map(tab => (
          <button
            key={`mobile-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
            className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-zinc-300", activeTab === tab.id ? 'bg-white/[0.04] text-white' : 'bg-transparent')}
          >
            <tab.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
};
