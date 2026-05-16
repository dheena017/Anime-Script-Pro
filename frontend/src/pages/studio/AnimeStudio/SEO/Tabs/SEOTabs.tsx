import React from 'react';
import { Search, Tag, FileText, Share2, TrendingUp, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { seoStyles as s } from '../seoStyles';

export type SEOTab = 'keywords' | 'description' | 'tags' | 'alt' | 'distribution' | 'growth';

interface SEOTabsProps {
  activeTab: SEOTab;
  setActiveTab: (tab: SEOTab) => void;
  loadingStates?: Partial<Record<SEOTab, boolean>>;
}

const TABS: { id: SEOTab; label: string; icon: React.FC<any>; color: string; glow: string }[] = [
  { id: 'keywords',     label: 'KEYWORDS',     icon: Hash,       color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
  { id: 'description',  label: 'DESCRIPTION',  icon: FileText,   color: 'text-studio',    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]'     },
  { id: 'tags',         label: 'TAGS',         icon: Tag,        color: 'text-cyan-400',  glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]'    },
  { id: 'alt',          label: 'ALT TEXT',     icon: Search,     color: 'text-amber-400',   glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]'    },
  { id: 'distribution', label: 'DISTRIBUTION', icon: Share2,     color: 'text-indigo-400', glow: 'shadow-[0_0_15px_rgba(129,140,248,0.3)]'  },
  { id: 'growth',       label: 'GROWTH',       icon: TrendingUp, color: 'text-rose-400',   glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]'     },
];

export const SEOTabs: React.FC<SEOTabsProps> = ({
  activeTab,
  setActiveTab,
  loadingStates = {}
}) => {
  return (
    <div className={s.tabs.container}>
      <div className={s.tabs.overlay} />

      {TABS.map((tab) => {
        const loading = loadingStates[tab.id] || false;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(s.tabs.button, isActive ? s.tabs.buttonActive : s.tabs.buttonInactive)}
          >
            {/* Per-tab color neon glow pill */}
            {isActive && (
              <motion.div
                layoutId="seo-active-pill"
                className={cn(s.tabs.pill, tab.glow)}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            <div className="relative z-10 flex items-center gap-2.5">
              {loading ? (
                <div className={s.tabs.spinner} />
              ) : (
                <tab.icon className={cn(s.tabs.icon, isActive ? s.tabs.iconActive : s.tabs.iconInactive)} />
              )}
              <span className={s.tabs.label}>{tab.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
