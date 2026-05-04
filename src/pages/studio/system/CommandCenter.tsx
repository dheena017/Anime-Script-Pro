import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Globe, Users, ScrollText, Layout, Search, 
  Play, ShieldCheck, Cpu, Activity, Database, 
  Settings, BookOpen, MessageSquare, Terminal, 
  LayoutDashboard, Layers, Box, Compass, Sparkles
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
      { label: "Cast", path: "/anime/cast", icon: Users, desc: "Character DNA & relationships" },
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
    color: "text-red-500",
    pages: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, desc: "System-wide telemetry" },
      { label: "Projects", path: "/projects", icon: Box, desc: "Universal blueprint registry" },
      { label: "Library", path: "/library", icon: Database, desc: "Archived production assets" },
      { label: "Discover", path: "/discover", icon: Compass, desc: "Public community creations" },
      { label: "Community", path: "/community", icon: Users, desc: "Studio collaboration hub" },
      { label: "Settings", path: "/settings", icon: Settings, desc: "Core engine configuration" },
    ]
  },
  {
    title: "System Protocols",
    icon: Terminal,
    color: "text-zinc-500",
    pages: [
      { label: "Documentation", path: "/system/docs", icon: BookOpen, desc: "Architectural guidelines" },
      { label: "Neural Health", path: "/system/health", icon: Activity, desc: "Sync stability monitoring" },
      { label: "Feedback", path: "/system/feedback", icon: MessageSquare, desc: "Developer uplink protocol" },
      { label: "Archive", path: "/lore-database", icon: Database, desc: "Raw lore data mining" },
      { label: "Terminal", path: "/api-reference", icon: Terminal, desc: "Direct node accessibility" },
    ]
  },
  {
    title: "Multiverse Studios",
    icon: Sparkles,
    color: "text-violet-500",
    pages: [
      { label: "Manhwa Studio", path: "/manhwa/world", icon: Sparkles, desc: "Webtoon production cycle" },
      { label: "Comic Studio", path: "/comic/world", icon: Zap, desc: "Western graphic production" },
      { label: "Landing", path: "/", icon: Globe, desc: "Public facing portal" },
    ]
  }
];

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black/40 backdrop-blur-xl rounded-[3rem] border border-white/5 p-12 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Header Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-studio/10 border border-studio/20 rounded-full">
            <Cpu className="w-3 h-3 text-studio animate-pulse" />
            <span className="text-[9px] font-black text-studio uppercase tracking-[0.3em]">Master Command Node</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
            STUDIO <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-fuchsia-500 to-studio">ARCHITECT</span> MAP
          </h1>
          <p className="text-zinc-500 max-w-2xl text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed">
            Direct access to all production phases and system protocols within the Anime Script Pro ecosystem.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {MODULES.map((module, mIdx) => (
            <div key={mIdx} className="space-y-8">
              <div className="flex items-center gap-4">
                <module.icon className={cn("w-5 h-5", module.color)} />
                <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">{module.title}</h2>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {module.pages.map((page, pIdx) => (
                  <motion.button
                    key={pIdx}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(page.path)}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center group-hover:bg-studio group-hover:text-black transition-all">
                      <page.icon className="w-4 h-4 text-zinc-600 transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-black text-zinc-300 uppercase tracking-widest group-hover:text-white transition-colors">
                        {page.label}
                      </h4>
                      <p className="text-[9px] font-bold text-zinc-600 line-clamp-1 uppercase tracking-tighter">
                        {page.desc}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* System Footer Telemetry */}
        <div className="pt-20 border-t border-white/5 flex flex-wrap items-center justify-between gap-8 text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
           <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Full Codebase Indexing: Complete</span>
           </div>
           <div className="flex items-center gap-6">
              <span>Nodes: 342</span>
              <span>Sync: 100%</span>
              <span>Uptime: 14:22:04</span>
           </div>
        </div>
      </div>
    </div>
  );
};
