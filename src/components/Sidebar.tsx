import { useLocation, NavLink } from 'react-router-dom';
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
  X,
  Clapperboard,
  Zap,
  Sword,
  Shield,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: History, label: 'My Library', path: '/library' },
  { icon: Compass, label: 'Discover', path: '/discover' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: BookOpen, label: 'Tutorials', path: '/tutorials' },
  { icon: Settings2, label: 'Settings', path: '/settings' },
];

const modeItems = [
  { icon: Sword, label: 'Anime Studio', path: '/anime', color: 'text-red-500' },
  { icon: Clapperboard, label: 'Manhwa Studio', path: '/manhwa', color: 'text-blue-500' },
  { icon: FileText, label: 'Comic Studio', path: '/comic', color: 'text-green-500' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  
  const getPrefix = () => {
    if (location.pathname.startsWith('/anime')) return '/anime';
    if (location.pathname.startsWith('/manhwa')) return '/manhwa';
    if (location.pathname.startsWith('/comic')) return '/comic';
    return '/anime';
  };

  const prefix = getPrefix();

  const foundationItems = [
    { icon: BookOpen, label: 'Template', path: 'template' },
    { icon: FileText, label: 'Methods', path: 'framework' },
    { icon: Globe, label: 'World Lore', path: 'world' },
  ];

  const architectureItems = [
    { icon: Zap, label: 'Narrative Beats', path: 'beats' },
    { icon: UserPlus, label: 'Cast', path: 'cast' },
    { icon: Layers, label: 'Series', path: 'series' },
  ];

  const generationItems = [
    { icon: ScrollText, label: 'Script', path: 'script' },
    { icon: LayoutIcon, label: 'Storyboard', path: 'storyboard' },
  ];

  const distributionItems = [
    { icon: Search, label: 'SEO', path: 'seo' },
    { icon: ImageIcon, label: 'Prompts', path: 'prompts' },
    { icon: Play, label: 'Screening Room', path: 'example' },
  ];

  const renderNavGroup = (items: any[], title: string) => (
    <div className="space-y-1 mt-6">
      <p className="px-4 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
        <span className="w-4 h-[1px] bg-zinc-800" /> {title}
      </p>
      {items.map((item) => {
        const fullPath = `${prefix}/${item.path}`;
        const isActive = location.pathname === fullPath || (location.pathname === prefix && item.path === 'script' && title.includes("GENERATION"));
        
        return (
          <NavLink
            key={item.path}
            to={fullPath}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 group uppercase tracking-widest",
              isActive 
                ? "bg-red-600/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.1)]" 
                : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50"
            )}
          >
            <item.icon className={cn(
              "w-4 h-4",
              isActive ? "text-red-500" : "text-zinc-600 group-hover:text-zinc-300",
              "group-hover:scale-110 transition-transform"
            )} />
            {item.label}
          </NavLink>
        );
      })}
    </div>
  );

  const content = (
    <div className="flex flex-col h-full bg-[#050505]">
      <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black border border-red-600/50 rounded flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <ScrollText className="text-red-600 w-5 h-5" />
          </div>
          <span className="font-black tracking-tighter text-sm uppercase">Studio <span className="text-red-600">Architect</span></span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <nav className="p-4">
          <div className="space-y-1 mb-8">
            <p className="px-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">Core Hub</p>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 group uppercase tracking-widest",
                  isActive 
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700" 
                    : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 text-zinc-600 group-hover:text-zinc-200",
                  "group-hover:scale-110 transition-transform"
                )} />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="space-y-1 mb-8">
            <p className="px-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">Live Modes</p>
            {modeItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 group uppercase tracking-widest",
                  isActive 
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-[0_5px_15px_rgba(0,0,0,0.5)]" 
                    : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4",
                  item.color,
                  "group-hover:scale-110 transition-transform"
                )} />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="h-[1px] bg-zinc-900 mx-4 my-6" />

          {renderNavGroup(foundationItems, "PHASE 1: FOUNDATION")}
          {renderNavGroup(architectureItems, "PHASE 2: ARCHITECTURE")}
          {renderNavGroup(generationItems, "PHASE 3: GENERATION")}
          {renderNavGroup(distributionItems, "PHASE 4: DISTRIBUTION")}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800/50 bg-black/40">
        <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Pro Pipeline</span>
          </div>
          <p className="text-[9px] text-zinc-500 leading-relaxed mb-3">
            Advanced AI models & Multi-Session persistence enabled.
          </p>
          <button className="w-full py-2 bg-red-600/10 border border-red-600/30 hover:bg-red-600/20 text-red-500 text-[10px] font-black rounded-lg transition-all tracking-widest">
            UPGRADE ACCESS
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="w-64 border-r border-zinc-800 bg-[#050505] hidden lg:flex flex-col h-screen sticky top-0 shrink-0 z-50">
        {content}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#050505] border-r border-zinc-800 z-[70] lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
