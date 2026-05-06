import { 
  Search, 
  Bell, 
  MessageSquare, 
  ScrollText, 
  Zap, 
  SlidersHorizontal, 
  Loader2,
  Grid
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGenerator } from '@/hooks/useGenerator';

export const StudioTopBar: React.FC<{ 
  showNotifications: boolean; 
  setShowNotifications: (val: boolean) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}> = ({ showNotifications, setShowNotifications, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isStudioMode = location.pathname.startsWith('/anime') || 
                      location.pathname.startsWith('/manhwa') || 
                      location.pathname.startsWith('/comic');

  const { isLoading } = useGenerator();



  return (
    <header 
      className="fixed top-0 left-0 right-0 h-[60px] border-b border-zinc-800/40 flex items-center justify-between px-6 bg-black/60 backdrop-blur-md z-[400] transition-all duration-300 ease-out"
    >
      <div className="flex items-center gap-5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 group active:scale-90",
            !collapsed 
              ? "text-red-500 bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              : "text-zinc-500 hover:text-white hover:bg-white/5"
          )}
          title={collapsed ? "Open Sidebar" : "Close Sidebar"}
        >
          <Grid className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center gap-3 group no-underline">
          <div className="w-9 h-9 bg-black border border-red-500/30 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.15)] group-hover:border-red-500 transition-all group-hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]">
            <ScrollText className="text-red-500 w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-[0.2em] text-[10px] uppercase text-white leading-none">Creator</span>
          </div>
        </Link>

        <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-zinc-800 to-transparent mx-2 hidden lg:block" />

        <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-zinc-800 to-transparent mx-2 hidden lg:block" />


        <div className="hidden lg:flex items-center gap-3 bg-zinc-950/50 px-5 py-2 rounded-full border border-zinc-800/50 w-72 xl:w-96 group focus-within:border-red-500/40 focus-within:bg-black transition-all shadow-inner">
          <Search className="w-3.5 h-3.5 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
          <input 
            className="bg-transparent border-none text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 placeholder:text-zinc-700 focus:outline-none w-full" 
            placeholder="Search Manifests..." 
          />
          <div className="flex items-center gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity">
             <span className="text-[8px] font-black text-zinc-700 border border-zinc-800 px-1 rounded">ESC</span>
          </div>
        </div>
      </div>

      {/* Center Production Controls - Only visible in Studio Mode */}
      {isStudioMode && (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 border border-zinc-800/50 p-1.5 rounded-2xl backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
           <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(location.search);
              const isOpen = params.get('engine') === 'open';
              if (isOpen) params.delete('engine');
              else params.set('engine', 'open');
              navigate({ search: params.toString() }, { replace: true });
            }}
            className={cn(
              "h-8 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300",
              location.search.includes('engine=open')
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                : "text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/5 border border-transparent"
            )}
          >
            <SlidersHorizontal className="w-3 h-3 mr-2" />
            Creative Engine
          </Button>

          <div className="w-px h-4 bg-zinc-800/50 mx-1" />

          <Button
            variant="default"
            size="sm"
            disabled={isLoading}
            onClick={() => window.dispatchEvent(new CustomEvent('studio-generate-all'))}
            className="h-8 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-[9px] shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all active:scale-95 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 fill-current animate-pulse" />
                <span>Start Generation</span>
              </div>
            )}
          </Button>
        </div>
      )}

      <div className="flex items-center gap-6">
        {/* System Status Indicators */}
        <div className="hidden xl:flex items-center gap-8 px-6 border-r border-zinc-800/50 mr-2">
          <div className="flex flex-col items-end group cursor-help">
            <span className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.2em] leading-none mb-1 group-hover:text-emerald-500 transition-colors">System Sync</span>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-tighter">Optimal</span>
            </div>
          </div>
          <div className="flex flex-col items-end group cursor-help">
            <span className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.2em] leading-none mb-1 group-hover:text-blue-500 transition-colors">Latency</span>
            <div className="flex items-center gap-2">
              <Zap className="w-2.5 h-2.5 text-blue-500/50" />
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">12ms</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="relative p-2.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
          >
            <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-black shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          </button>
          
          <button 
            className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-[1px] bg-zinc-800 mx-2" />

        <button 
          onClick={() => navigate('/profile')} 
          className="flex items-center gap-4 pl-2 pr-1 py-1 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
        >
          <div className="text-right hidden md:block">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white leading-none mb-1">Creator</p>
            <p className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest">Level 42 Sync</p>
          </div>
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden group-hover:border-red-500/50 transition-all shadow-2xl">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Creator" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
        </button>
      </div>
    </header>
  );
};

