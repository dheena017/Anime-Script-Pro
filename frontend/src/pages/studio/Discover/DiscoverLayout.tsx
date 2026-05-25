import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, LayoutGrid, List, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StudioTabRail } from '../components/studio/shared/StudioTabRail';
import { sharedStyles as s } from '../components/studio/shared/sharedStyles';

interface Stat {
  label: string;
  value: string;
  icon: any;
  color?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
}

interface DiscoverLayoutProps {
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

export const DiscoverLayout: React.FC<DiscoverLayoutProps> = ({
  title, subtitle, brandIcon: BrandIcon, version = "4.2.0", status = "SYSTEM ONLINE",
  stats = [], bottomMetrics, searchTerm, onSearchChange, searchPlaceholder = "SEARCH WITHIN VAULT...",
  primaryAction, viewMode = 'grid', onViewModeChange, tabs, activeTab, onTabChange, children
}) => {
  return (
    <div className={s.moduleContainer}>
      {/* SECTION 1: HEADER */}
      <header className={s.moduleHeader}>
        <div className={s.headerMain}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={s.brandSection}>
            <div className="relative">
              <div className="absolute inset-0 bg-[#bd4a4a] blur-3xl opacity-20 animate-pulse" />
              <div className="relative p-6 bg-zinc-950 border border-[#bd4a4a]/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(189,74,74,0.15)]">
                <BrandIcon className="w-10 h-10 text-[#bd4a4a]" />
              </div>
            </div>
            <div className={s.titleSection}>
              <div className={s.headerBadges}>
                <span className={cn(s.headerBadge, s.headerBadgeRed)}>Version {version}</span>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-emerald-500/20 rounded-full">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">{status}</span>
                </div>
              </div>
              <h1 className={s.headerTitle}>
                {title.split(' ').map((word, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-zinc-800 mx-2">/</span>}
                    <span className={i === 1 ? "text-[#bd4a4a]" : "text-white"}>{word}</span>
                  </React.Fragment>
                ))}
              </h1>
              <p className={s.headerSubtitle}>{subtitle}</p>
            </div>
          </motion.div>

          <div className={s.statsGrid}>
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={s.statCard}>
                <div className={s.statLabel}>
                  <stat.icon className={cn("w-3.5 h-3.5", stat.color || "text-[#bd4a4a]")} />
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                </div>
                <span className={s.statValue}>{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {bottomMetrics && (
          <div className="flex flex-wrap items-center gap-12 pt-4">
            {bottomMetrics}
          </div>
        )}
      </header>

      {/* SECTION 2: TOOLBAR */}
      <div className={s.toolbar}>
        <div className={s.toolbarLeft}>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input type="text" placeholder={searchPlaceholder} value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className={s.searchInput} />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 px-2 py-1 bg-zinc-950 border border-white/5 rounded text-xs font-black text-zinc-600 uppercase">Ctrl+K</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-12 px-6 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center gap-3 hover:bg-zinc-800 hover:border-white/10 transition-all text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white active:scale-95">
            <SlidersHorizontal className="w-4 h-4" /><span>Advanced Filters</span>
          </button>
          <button className="h-12 px-6 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center gap-3 hover:bg-zinc-800 hover:border-white/10 transition-all text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white active:scale-95">
            <span>Sort: Recently Modified</span><ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center p-1 bg-zinc-950 border border-white/5 rounded-2xl">
            <button onClick={() => onViewModeChange?.('grid')} className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-[#bd4a4a] text-white shadow-[0_0_15px_rgba(189,74,74,0.3)]" : "text-zinc-600")}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => onViewModeChange?.('list')} className={cn("p-2.5 rounded-xl transition-all", viewMode === 'list' ? "bg-[#bd4a4a] text-white shadow-[0_0_15px_rgba(189,74,74,0.3)]" : "text-zinc-600")}><List className="w-4 h-4" /></button>
          </div>

          {primaryAction && (
            <button onClick={primaryAction.onClick} className="h-12 px-8 bg-[#bd4a4a] text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-[0_10px_20px_rgba(189,74,74,0.2)] hover:shadow-[0_15px_30px_rgba(189,74,74,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all">
              {primaryAction.icon ? <primaryAction.icon className="w-4 h-4" /> : <Plus className="w-4 h-4" />}<span>{primaryAction.label}</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 3: TABS */}
      <StudioTabRail tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} layoutId="discTab" />

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
