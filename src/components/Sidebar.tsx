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
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
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

const studioItems = [
  { icon: FileText, label: 'Script', path: 'script' },
  { icon: UserPlus, label: 'Cast', path: 'cast' },
  { icon: Layers, label: 'Series', path: 'series' },
  { icon: LayoutIcon, label: 'Storyboard', path: 'storyboard' },
  { icon: Search, label: 'SEO', path: 'seo' },
  { icon: ImageIcon, label: 'Prompts', path: 'prompts' },
  { icon: Play, label: 'Example', path: 'example' },
  { icon: ScrollText, label: 'Template', path: 'template' },
  { icon: LayoutGrid, label: 'Framework', path: 'framework' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  
  // Determine current mode prefix
  const getPrefix = () => {
    if (location.pathname.startsWith('/anime')) return '/anime';
    if (location.pathname.startsWith('/manhwa')) return '/manhwa';
    if (location.pathname.startsWith('/comic')) return '/comic';
    return '/anime'; // Default
  };

  const prefix = getPrefix();

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <ScrollText className="text-white w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-sm">CREATOR STUDIO <span className="text-red-500">PRO</span></span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-8">
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Modes</p>
            {modeItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700" 
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

          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Studio Tools</p>
            {studioItems.map((item) => {
              const fullPath = `${prefix}/${item.path}`;
              const isActive = location.pathname === fullPath || (location.pathname === prefix && item.path === 'script');
              
              return (
                <NavLink
                  key={item.path}
                  to={fullPath}
                  onClick={onClose}
                  className={cn(
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
              );
            })}
          </div>

          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Global</p>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
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
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-black/40 backdrop-blur-xl hidden lg:flex flex-col h-screen sticky top-0 shrink-0">
        {content}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-zinc-950 border-r border-zinc-800 z-[60] lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
