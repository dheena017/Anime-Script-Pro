import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  ScrollText, 
  History, 
  Settings2, 
  LayoutDashboard, 
  Sparkles,
  Users,
  BookOpen,
  Compass,
  FileText,
  Layers,
  Search,
  Image as ImageIcon,
  Layout as LayoutIcon,
  LayoutGrid,
  Play,
  UserPlus,
  Box,
  Cpu,
  Zap,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const mainNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: History, label: 'My Library', path: '/library' },
  { icon: Compass, label: 'Discover', path: '/discover' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: BookOpen, label: 'Tutorials', path: '/tutorials' },
  { icon: Settings2, label: 'Settings', path: '/settings' },
];

const studioNav = [
  { icon: FileText, label: 'Script', path: '/studio/script' },
  { icon: UserPlus, label: 'Cast', path: '/studio/cast' },
  { icon: Layers, label: 'Series', path: '/studio/series' },
  { icon: LayoutIcon, label: 'Storyboard', path: '/studio/storyboard' },
  { icon: Search, label: 'SEO', path: '/studio/seo' },
  { icon: ImageIcon, label: 'Prompts', path: '/studio/prompts' },
  { icon: Play, label: 'Example', path: '/studio/example' },
  { icon: ScrollText, label: 'Template', path: '/studio/template' },
  { icon: LayoutGrid, label: 'Framework', path: '/studio/framework' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-72 hidden flex-col overflow-hidden border-r border-zinc-900 bg-black lg:flex shadow-2xl">
      {/* Dynamic Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,_rgba(220,38,38,0.08)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_100%,_rgba(37,99,235,0.05)_0%,_transparent_50%)]" />
      
      {/* Brand Header */}
      <div className="relative border-b border-zinc-900 px-7 py-8">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-2 bg-red-600/20 rounded-2xl blur-xl group-hover:bg-red-600/40 transition-all" />
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-600 to-red-900 shadow-2xl">
                <ScrollText className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-[0.3em] text-white uppercase italic leading-none">ANIME SCRIPT</span>
            <span className="text-[10px] font-black tracking-[0.6em] text-red-600 mt-1 uppercase">PRO UNIT</span>
          </div>
        </div>
      </div>
      
      {/* Navigation Space */}
      <div className="relative flex-1 overflow-y-auto no-scrollbar py-8 px-4 space-y-10">
        {/* Main Sector */}
        <section className="space-y-3">
          <div className="flex items-center gap-3 mb-2 px-3">
             <Box className="w-3.5 h-3.5 text-zinc-700" />
             <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">Operations</h3>
          </div>
          <div className="space-y-1">
            {mainNav.map((item) => (
               <NavItem key={item.path} item={item} isActive={location.pathname === item.path} />
            ))}
          </div>
        </section>

        {/* Studio Sector */}
        <section className="space-y-3">
          <div className="flex items-center gap-3 mb-2 px-3">
             <Cpu className="w-3.5 h-3.5 text-zinc-700" />
             <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">Production Studio</h3>
          </div>
          <div className="space-y-1">
            {studioNav.map((item) => (
               <NavItem key={item.path} item={item} isActive={location.pathname === item.path} />
            ))}
          </div>
        </section>
      </div>

      {/* Pro Footer */}
      <div className="relative p-6 border-t border-zinc-900">
        <div className="p-5 rounded-[24px] bg-gradient-to-br from-zinc-900/50 to-black border border-zinc-800/50 relative overflow-hidden group/pro">
           <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-600/5 rounded-full blur-2xl group-hover/pro:bg-red-600/10 transition-all duration-1000" />
           <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-200 font-mono">Archive Active</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-medium italic leading-relaxed">
                 Unlimited neural processing and high-priority studio rendering.
              </p>
              <button className="w-full h-10 rounded-xl bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 active:scale-95">
                 Expand Terminal
              </button>
           </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ item, isActive }: { item: any; isActive: boolean }) {
  return (
    <NavLink
      to={item.path}
      className={cn(
        "group relative flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
        isActive 
          ? "bg-red-600/10 text-white shadow-inner" 
          : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
      )}
    >
      <div className="flex items-center gap-3">
        <item.icon className={cn(
          "h-4 w-4 transition-all duration-500",
          isActive ? "text-red-500 scale-110 rotate-3" : "text-zinc-600 group-hover:text-white"
        )} />
        <span className={cn(
           "text-[10px] font-black uppercase tracking-widest transition-all duration-300",
           isActive ? "translate-x-1" : ""
        )}>
           {item.label}
        </span>
      </div>
      
      <AnimatePresence>
        {isActive && (
           <motion.div 
             layoutId="active-indicator"
             className="w-1 h-3 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"
             initial={{ opacity: 0, x: -5 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -5 }}
           />
        )}
      </AnimatePresence>
    </NavLink>
  );
}

