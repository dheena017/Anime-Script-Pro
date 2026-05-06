import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ScrollText,
  Globe,
  UserPlus,
  ImageIcon,
  Zap, 
  Layers, 
  Search, 
  SlidersHorizontal,
  Terminal,
} from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import {
  TooltipProvider
} from '@/components/ui/tooltip';

const MODULE_TABS = [
  { id: 'script', label: 'Script', path: 'architect', icon: ScrollText, sector: 'SC-01' },
  { id: 'world', label: 'World', path: 'oracle', icon: Globe, sector: 'WD-02' },
  { id: 'cast', label: 'Cast', path: 'forge', icon: UserPlus, sector: 'CT-03' },
  { id: 'visual', label: 'Visual', path: 'visual', icon: ImageIcon, sector: 'VS-04' },
  { id: 'motion', label: 'Motion', path: 'motion', icon: Zap, sector: 'MN-05' },
  { id: 'series', label: 'Series', path: 'showrunner', icon: Layers, sector: 'SR-06' },
  { id: 'seo', label: 'SEO', path: 'seo', icon: Search, sector: 'SO-07' },
  { id: 'utils', label: 'Utils', path: 'aide', icon: SlidersHorizontal, sector: 'UT-08' },
];

import { ProtocolsContext } from '../ProtocolsLayout';
import React from 'react';

interface ProtocolsToolbarProps {
  showTabsOnly?: boolean;
}

export function ProtocolsToolbar({ showTabsOnly = false }: ProtocolsToolbarProps) {
  const { session, episode } = useGenerator();
  const { searchQuery, setSearchQuery } = React.useContext(ProtocolsContext);


  return (
    <TooltipProvider>
      <div className="toolbar-container">
        {!showTabsOnly && (
          <div className="toolbar-header">
            <div className="toolbar-status-box">
              <div className="toolbar-status-icon">
                <Terminal className="w-5 h-5 text-studio" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">
                  Production Modules <span className="text-studio">Active</span>
                </span>
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                  System Synchronization: Active // Release_v4
                </span>
              </div>
            </div>

            <div className="toolbar-action-group">
              <div className="flex items-center justify-between w-full md:w-auto gap-4">
                <div className="toolbar-unit-box">
                  <span className="text-studio/60 text-xs font-black">#</span>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none">Production Unit</span>
                    <span className="text-sm font-black text-white font-mono leading-none mt-1">S{session}-E{episode}</span>
                  </div>
                </div>

                <div className="toolbar-btn-group">
                  <div className="relative group/search">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-focus-within/search:text-studio transition-colors" />
                    <input 
                      type="text"
                      placeholder="Search Directives..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-black/40 border border-white/5 rounded-xl pl-9 pr-4 h-9 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-zinc-700 focus:outline-none focus:border-studio/50 w-40 md:w-60 transition-all"
                    />
                  </div>




                </div>
              </div>
            </div>
          </div>
        )}

        <div className="tabs-nav-container">
          {MODULE_TABS.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) => cn(
                "tabs-nav-button group",
                isActive ? "text-studio" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {({ isActive }) => (
                <>
                  <div className="flex flex-col items-start gap-0.5 relative z-10">
                    <span className={cn(
                      "text-[7px] font-black tracking-widest transition-colors duration-500",
                      isActive ? "text-studio/60" : "text-zinc-700 group-hover:text-zinc-500"
                    )}>
                      {tab.sector}
                    </span>
                    <div className="flex items-center gap-2">
                      <tab.icon className={cn("w-3.5 h-3.5 transition-colors duration-500", isActive ? "text-studio" : "text-zinc-600")} />
                      <span className="relative z-10">{tab.label}</span>
                    </div>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="module-active-pill"
                      className="tabs-nav-active-glow"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}



