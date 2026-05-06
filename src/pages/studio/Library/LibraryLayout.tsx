import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { sharedStyles as s } from '../components/studio/shared/sharedStyles';
import { LibraryHeader, Stat } from './components/LibraryHeader';
import { LibraryToolbar } from './components/LibraryToolbar';

interface NavItem {
  id: string;
  label: string;
  icon: any;
}

interface LibraryLayoutProps {
  title: string;
  subtitle: string;
  brandIcon: any;
  version?: string;
  status?: string;
  stats?: Stat[];
  bottomMetrics?: React.ReactNode;
  
  searchTerm: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: any;
  };
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  
  tabs: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  
  children: React.ReactNode;
}

export const LibraryLayout: React.FC<LibraryLayoutProps> = ({
  title, subtitle, brandIcon: BrandIcon, version = "4.2.0", status = "SYSTEM ONLINE",
  stats = [], bottomMetrics, searchTerm, onSearchChange, searchPlaceholder = "SEARCH WITHIN VAULT...",
  primaryAction, viewMode = 'grid', onViewModeChange, tabs, activeTab, onTabChange, children
}) => {
  return (
    <div className={s.moduleContainer}>
      {/* SECTION 1: HEADER */}
      <LibraryHeader
        title={title}
        subtitle={subtitle}
        brandIcon={BrandIcon}
        version={version}
        status={status}
        stats={stats}
        bottomMetrics={bottomMetrics}
      />

      {/* SECTION 2: TOOLBAR */}
      <LibraryToolbar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        primaryAction={primaryAction}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      {/* SECTION 3: TABS */}
      <div className="relative">
        <nav className={s.tabList}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} className={cn(s.tabItem, activeTab === tab.id ? s.tabActive : s.tabInactive)}>
              {activeTab === tab.id && <motion.div layoutId="libTab" className={s.tabIndicator} />}
              <tab.icon className={cn("w-4 h-4 transition-colors relative z-10", activeTab === tab.id ? "text-[#bd4a4a]" : "text-zinc-700 hover:text-zinc-500")} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* SECTION 4: CONTENT */}
      <div className={s.moduleContent}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
