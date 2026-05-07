import React from 'react';
import { Hash, Tag, Globe, FileText, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type SEOTab = 'keywords' | 'description' | 'alt-texts' | 'tags' | 'distribution' | 'growth';

interface SEOTabsProps {
  activeTab: SEOTab;
  setActiveTab: (tab: SEOTab) => void;
}

const GLOW_COLORS: Record<SEOTab, string> = {
  keywords: 'bg-emerald-400',
  description: 'bg-blue-400',
  'alt-texts': 'bg-amber-400',
  tags: 'bg-fuchsia-400',
  distribution: 'bg-rose-400',
  growth: 'bg-orange-400',
};

const UNDERLINE_COLORS: Record<SEOTab, string> = {
  keywords: 'from-emerald-400/0 via-emerald-400 to-emerald-400/0',
  description: 'from-blue-400/0 via-blue-400 to-blue-400/0',
  'alt-texts': 'from-amber-400/0 via-amber-400 to-amber-400/0',
  tags: 'from-fuchsia-400/0 via-fuchsia-400 to-fuchsia-400/0',
  distribution: 'from-rose-400/0 via-rose-400 to-rose-400/0',
  growth: 'from-orange-400/0 via-orange-400 to-orange-400/0',
};

export const SEOTabs: React.FC<SEOTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs: { id: SEOTab; label: string; icon: any; color: string }[] = [
    { id: 'keywords', label: 'Keywords', icon: Hash, color: 'text-emerald-400' },
    { id: 'description', label: 'Description', icon: FileText, color: 'text-blue-400' },
    { id: 'alt-texts', label: 'Alt Texts', icon: Globe, color: 'text-amber-400' },
    { id: 'tags', label: 'Meta Tags', icon: Tag, color: 'text-fuchsia-400' },
    { id: 'distribution', label: 'Distribution', icon: Share2, color: 'text-rose-400' },
    { id: 'growth', label: 'Growth Strategy', icon: Globe, color: 'text-orange-400' },
  ];

  return (
    <div className="tabs-nav-container group">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[1.5rem]" />

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "tabs-nav-button group/tab",
              isActive ? tab.color : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="seo-tab-glow"
                className={cn("storyboard-tab-glow", GLOW_COLORS[tab.id])}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
            {isActive && (
              <motion.div
                layoutId="seo-tab-bg"
                className="absolute inset-0 rounded-xl bg-white/[0.04] border border-white/10"
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
            <div className="flex items-center gap-2 relative z-10">
              <tab.icon className={cn("w-3.5 h-3.5 transition-all duration-300", isActive ? "opacity-100 scale-110" : "opacity-40 group-hover/tab:opacity-70 group-hover/tab:scale-105")} />
              <span>{tab.label}</span>
            </div>
            {isActive && (
              <motion.div
                layoutId="seo-tab-underline"
                className={cn("absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r rounded-full", UNDERLINE_COLORS[tab.id])}
                style={{ filter: 'blur(0.5px)', opacity: 0.7 }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
