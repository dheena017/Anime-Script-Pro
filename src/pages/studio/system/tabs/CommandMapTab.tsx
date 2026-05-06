import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Globe, Users, ScrollText, Layout, Search, 
  Play, ShieldCheck, Database,
  Settings,
  LayoutDashboard, Layers, Box, Compass
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageNode {
  label: string;
  path: string;
  icon: any;
  desc: string;
}

interface ModuleGroup {
  title: string;
  icon: any;
  color: string;
  pages: PageNode[];
}

const MODULES: ModuleGroup[] = [
  {
    title: "Anime Production Suite",
    icon: Zap,
    color: "text-cyan-400",
    pages: [
      { label: "Engine", path: "/anime/engine", icon: Zap, desc: "Core production orchestration" },
      { label: "World", path: "/anime/world", icon: Globe, desc: "Lore & geography architecture" },
      { label: "Cast", path: "/anime/cast", icon: Users, desc: "Character profiles & relationships" },
      { label: "Series", path: "/anime/series", icon: Layers, desc: "Episodic management" },
      { label: "Script", path: "/anime/script", icon: ScrollText, desc: "Beat-by-beat generation" },
      { label: "Storyboard", path: "/anime/storyboard", icon: Layout, desc: "Visual scene mapping" },
      { label: "SEO", path: "/anime/seo", icon: Search, desc: "Distribution optimization" },
      { label: "Screening", path: "/anime/screening", icon: Play, desc: "Real-time production review" },
      { label: "Protocols", path: "/anime/protocols", icon: ShieldCheck, desc: "AI specialized agents" },
    ]
  },
  {
    title: "Global Hub Interface",
    icon: LayoutDashboard,
    color: "text-[#bd4a4a]",
    pages: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, desc: "System-wide telemetry" },
      { label: "Projects", path: "/projects", icon: Box, desc: "Universal blueprint registry" },
      { label: "Library", path: "/library", icon: Database, desc: "Archived production assets" },
      { label: "Discover", path: "/discover", icon: Compass, desc: "Public community creations" },
      { label: "Community", path: "/community", icon: Users, desc: "Studio collaboration hub" },
      { label: "Settings", path: "/settings", icon: Settings, desc: "Core engine configuration" },
    ]
  }
];

export const CommandMapTab: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
          STUDIO <span className="text-[#bd4a4a]">ARCHITECT</span> MAP
        </h2>
        <p className="text-zinc-500 max-w-2xl text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">
          Direct access to all production phases and system protocols within the Anime Script Pro ecosystem.
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {MODULES.map((module, mIdx) => (
          <div key={mIdx} className="space-y-6">
            <div className="flex items-center gap-4">
              <module.icon className={cn("w-4 h-4", module.color)} />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">{module.title}</h3>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {module.pages.map((page, pIdx) => (
                <motion.button
                  key={pIdx}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(page.path)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-950 border border-white/5 hover:border-[#bd4a4a]/30 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-[#bd4a4a] group-hover:text-white transition-all">
                    <page.icon className="w-3.5 h-3.5 text-zinc-600 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest group-hover:text-white transition-colors">
                      {page.label}
                    </h4>
                    <p className="text-[8px] font-bold text-zinc-600 line-clamp-1 uppercase tracking-tighter">
                      {page.desc}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandMapTab;
