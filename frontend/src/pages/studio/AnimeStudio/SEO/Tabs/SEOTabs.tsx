import React from 'react';
import { Hash, Tag, Globe, FileText, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type SEOTab = 'keywords' | 'description' | 'alt-texts' | 'tags' | 'distribution' | 'growth';

interface SEOTabsProps {
  activeTab: SEOTab;
  setActiveTab: (tab: SEOTab) => void;
}

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
    <div className="flex items-center gap-2 p-1.5 bg-[#080808]/60 border border-white/5 rounded-[1.5rem] backdrop-blur-md relative overflow-x-auto no-scrollbar group">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "relative px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3 group/tab shrink-0 whitespace-nowrap",
            activeTab === tab.id ? tab.color : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="seo-tab-glow"
              className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <tab.icon className={cn("w-3.5 h-3.5 transition-transform duration-300 group-hover/tab:scale-110", activeTab === tab.id ? "opacity-100" : "opacity-40")} />
          <span className="relative z-10">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div 
              layoutId="seo-tab-underline"
              className="absolute -bottom-1 left-4 right-4 h-0.5 bg-current rounded-full opacity-50"
            />
          )}
        </button>
      ))}
    </div>
  );
};



