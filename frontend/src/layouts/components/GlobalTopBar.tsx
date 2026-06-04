import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  ScrollText,
  Plus,
  Command
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { NotificationCenter } from '@/components/widgets/NotificationCenter';

export const GlobalTopBar: React.FC = () => {
  const { currentProject, isFullscreen } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isStudioMode = location.pathname.startsWith('/projects/') && !location.pathname.endsWith('/new') && !location.pathname.endsWith('/projects');
  const isInStudio = location.pathname.startsWith('/studio');

  // Keyboard shortcut for search focus (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Placeholder for search navigation
      console.log('Searching for:', searchQuery);
      // Example: navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (isFullscreen || isStudioMode || isInStudio) return null;

  return (
    <header className="sticky top-0 z-[400] w-full border-b border-white/5 bg-black/60 backdrop-blur-xl transition-all duration-300 transform-gpu will-change-transform">
      <div className="max-w-full mx-auto px-6 h-[70px] flex items-center justify-between gap-8">
        
        {/* Left: Logo & Project Selector */}
        <div className="flex items-center gap-6 shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3 group no-underline">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-900 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)] group-hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
              <ScrollText className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-[0.25em] text-[12px] uppercase text-white leading-none">Studio</span>
              <span className="font-black tracking-[0.25em] text-xs uppercase text-red-500 leading-none mt-1">Creator</span>
            </div>
          </Link>

          <div className="h-8 w-[1px] bg-white/5 mx-2 hidden lg:block" />

          {/* Project Context */}
          {isStudioMode && (
            <Link 
              to="/studio/library" 
              className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer group no-underline"
            >
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 uppercase font-black tracking-widest leading-none mb-1">Current Manifest</span>
                <span className="text-xs font-bold text-white leading-tight uppercase tracking-wider">{currentProject?.title || 'Production'}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors ml-1" />
            </Link>
          )}
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl relative group">
          <div className="absolute inset-0 bg-red-500/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <form onSubmit={handleSearch} className="relative w-full flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-zinc-500 group-focus-within:text-red-500 transition-all duration-300" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets, manifests, or lore..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-16 py-3 text-xs font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/30 focus:bg-black/40 transition-all uppercase tracking-[0.15em] shadow-inner"
            />
            <div className="absolute right-4 flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-xs font-black text-zinc-500 tracking-tighter cursor-pointer" onClick={() => searchInputRef.current?.focus()}>
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </form>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          
          {/* Quick Stats - Subtle indicators */}
          <div className="hidden xl:flex items-center gap-6 border-r border-white/5 pr-8 mr-2">
            <div className="flex flex-col items-end group cursor-help">
              <span className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Network</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                <span className="text-xs font-black text-emerald-500/80 uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">Secure</span>
              </div>
              <div className="absolute -bottom-8 right-0 bg-black/90 border border-emerald-500/30 px-2 py-1 rounded text-xs text-emerald-500 font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                ENCRYPTED TRANSCEIVER ACTIVE
              </div>
            </div>
            <div className="flex flex-col items-end group cursor-help">
              <span className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Creator v2</span>
              <span className="text-xs font-black text-white/50 uppercase tracking-tighter group-hover:text-white transition-colors">Active</span>
              <div className="absolute -bottom-8 right-16 bg-black/90 border border-white/10 px-2 py-1 rounded text-xs text-white/50 font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                BUILD 2.0.4 - STABLE RELEASE
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            {!isStudioMode && (
              <button 
                onClick={() => navigate('/projects/new')}
                className="hidden sm:flex items-center gap-2 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Initialize</span>
              </button>
            )}

            <Link 
              to="/help" 
              className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all hover:rotate-12"
              title="Information Terminal"
            >
              <HelpCircle className="w-5 h-5" />
            </Link>

            <NotificationCenter />
          </div>

          <div className="h-8 w-[1px] bg-white/5 mx-1" />

          <Link 
            to="/profile" 
            className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-red-500/50 transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-red-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="flex flex-col items-end relative z-10 hidden sm:flex">
              <span className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1">Creator</span>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">LVL 42</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden relative z-10 group-hover:border-red-500/50 transition-all shadow-xl">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Architect" 
                alt="Profile" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
