import React from 'react';
import { NavLink } from 'react-router-dom';
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
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Generator', path: '/' },
  { icon: History, label: 'My Library', path: '/library' },
  { icon: Compass, label: 'Discover', path: '/discover' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: BookOpen, label: 'Tutorials', path: '/tutorials' },
  { icon: Settings2, label: 'Settings', path: '/settings' },
];

const studioItems = [
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
  return (
    <aside className="w-64 border-r border-zinc-800 bg-black/40 backdrop-blur-xl hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <ScrollText className="text-white w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-sm">ANIME SCRIPT <span className="text-red-500">PRO</span></span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-6">
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Main</p>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-red-600/10 text-red-500 border border-red-500/20" 
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4",
                  "group-hover:scale-110 transition-transform"
                )} />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Studio</p>
            {studioItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-red-600/10 text-red-500 border border-red-500/20" 
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4",
                  "group-hover:scale-110 transition-transform"
                )} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800/50">
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Pro Plan</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed mb-3">
            Unlock advanced AI models and unlimited cloud storage.
          </p>
          <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold rounded-lg transition-colors">
            UPGRADE NOW
          </button>
        </div>
      </div>
    </aside>
  );
}
