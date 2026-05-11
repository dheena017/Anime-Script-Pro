import React from 'react';
import { Hash, Tag, Globe, FileText, Share2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type SEOTab = 'keywords' | 'description' | 'alt-texts' | 'tags' | 'distribution' | 'growth';

interface SEOTabsProps {
  activeTab: SEOTab;
  setActiveTab: (tab: SEOTab) => void;
}

const TABS: { id: SEOTab; label: string; icon: React.FC<any>; color: string; glow: string }[] = [
  { id: 'keywords',     label: 'KEYWORDS',        icon: Hash,        color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.3)]'   },
  { id: 'description',  label: 'DESCRIPTION',     icon: FileText,    color: 'text-blue-400',    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]'   },
  { id: 'alt-texts',    label: 'ALT TEXTS',       icon: Globe,       color: 'text-amber-400',   glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]'   },
  { id: 'tags',         label: 'META TAGS',       icon: Tag,         color: 'text-fuchsia-400', glow: 'shadow-[0_0_15px_rgba(192,38,211,0.3)]'   },
  { id: 'distribution', label: 'DISTRIBUTION',    icon: Share2,      color: 'text-rose-400',    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]'    },
  { id: 'growth',       label: 'GROWTH STRATEGY', icon: TrendingUp,  color: 'text-orange-400',  glow: 'shadow-[0_0_15px_rgba(251,146,60,0.3)]'   },
];

export const SEOTabs: React.FC<SEOTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="flex items-center gap-1 bg-black/50 border border-white/10 p-1.5 rounded-full backdrop-blur-xl shadow-2xl relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-5 py-2 text-[10px] font-black tracking-[0.2em] transition-all duration-500 uppercase flex items-center gap-2.5",
              isActive ? tab.color : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {/* Per-tab color neon glow pill */}
            {isActive && (
              <motion.div
                layoutId="seo-active-pill"
                className={cn(
                  "absolute inset-0 bg-white/10 border border-white/20 rounded-full z-0",
                  tab.glow
                )}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            <div className="relative z-10 flex items-center gap-2.5">
              <tab.icon className={cn("w-3.5 h-3.5 transition-all duration-500", isActive ? "opacity-100 scale-110" : "opacity-40")} />
              <span className="hidden lg:inline">{tab.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
