import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  ScrollText, 
  UserPlus, 
  LayoutGrid, 
  Layers, 
  Search, 
  ImageIcon, 
  BookOpen, 
  FileText, 
  Play,
  Globe,
  Zap
} from 'lucide-react';

const STUDIO_NAV = [
  { icon: BookOpen, label: 'Template', path: '/template' },
  { icon: FileText, label: 'Methods', path: '/framework' },
  { icon: Globe, label: 'World', path: '/world' },
  { icon: Zap, label: 'Beats', path: '/beats' },
  { icon: UserPlus, label: 'Cast', path: '/cast' },
  { icon: Layers, label: 'Series', path: '/series' },
  { icon: ScrollText, label: 'Script', path: '/script' },
  { icon: LayoutGrid, label: 'Storyboard', path: '/storyboard' },
  { icon: Search, label: 'SEO', path: '/seo' },
  { icon: ImageIcon, label: 'Prompts', path: '/prompts' },
  { icon: Play, label: 'Screening', path: '/example' },
];

export const StudioNavigation: React.FC<{ basePath: string }> = ({ basePath }) => {
  return (
    <div className="flex bg-[#0a0a0a]/80 p-2 rounded-[2rem] border border-cyan-500/20 backdrop-blur-2xl self-start overflow-x-auto no-scrollbar max-w-full shadow-[0_4px_25px_rgba(0,0,0,0.5)] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-cyan-500/50 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
      {STUDIO_NAV.map((item) => (
        <NavLink
          key={item.path}
          to={`${basePath}${item.path}`}
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-6 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all whitespace-nowrap relative group border",
            isActive 
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-105 z-10" 
              : "text-zinc-500 border-transparent hover:border-cyan-500/20 hover:text-cyan-200 hover:bg-white/[0.02]"
          )}
        >
          {({ isActive }) => (
            <>
              <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-cyan-400" : "text-zinc-600")} />
              {item.label}
              {isActive && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-cyan-500/20 blur-xl -z-10 rounded-full"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};
