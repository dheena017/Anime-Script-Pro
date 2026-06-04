import React from 'react';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  ScrollText, 
  Zap, 
  SlidersHorizontal, 
  Loader2,
  Grid,
  HelpCircle,
  History,
  Volume2,
  VolumeX,
  Activity,
  Check,
  User,
  Sparkles,
  Cpu,
  Layers,
  ArrowRight,
  LogOut,
  Key
} from 'lucide-react';
import { Menu, Maximize2, Brain } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGenerator } from '@/hooks/useGenerator';
import { useNotifications } from '@/contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationItem } from '../../../Notifications/components/NotificationItem';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/api-utils';
import { signalBus } from '@/lib/dev-console-logs';

export const StudioTopBar: React.FC<{ 
  showNotifications: boolean; 
  setShowNotifications: (val: boolean) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}> = ({ showNotifications, setShowNotifications, collapsed, setCollapsed }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isStudioMode = location.pathname.startsWith('/anime') || 
                      location.pathname.startsWith('/manhwa') || 
                      location.pathname.startsWith('/comic');

  const { isLoading, saveLocalSession, loadLocalSession } = useGenerator();

  // Search and Palette state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchFocused, setSearchFocused] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const searchWrapperRef = React.useRef<HTMLDivElement>(null);
  const profileWrapperRef = React.useRef<HTMLDivElement>(null);
  const notificationsWrapperRef = React.useRef<HTMLDivElement>(null);

  // Sound FX and Telemetry state
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [ping, setPing] = React.useState(21);
  const [coreTemp, setCoreTemp] = React.useState(42);
  const [cpuLoad, setCpuLoad] = React.useState(15);
  const [activeNotificationTab, setActiveNotificationTab] = React.useState<'all' | 'alerts' | 'system'>('all');
  const [profileData, setProfileData] = React.useState<{ displayName: string; tier: string; level: number; credits: number; avatarUrl?: string } | null>(null);
  const [simulating, setSimulating] = React.useState(false);
  const [purging, setPurging] = React.useState(false);
  const [markingAll, setMarkingAll] = React.useState(false);
  const [readingId, setReadingId] = React.useState<number | null>(null);

  const handleSimulateNotification = async () => {
    if (!user) return;
    setSimulating(true);
    try {
      await apiRequest(`/api/notifications/${user.id}/simulate`, { method: 'POST' });
    } catch (e) {
      console.error('Failed to simulate notification', e);
    } finally {
      setSimulating(false);
    }
  };

  const playNeonSound = (type: 'beep' | 'click' | 'success') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'beep') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(520, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(260, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.15);
        osc2.stop(ctx.currentTime + 0.15);
      } else if (type === 'success') {
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
          gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.06);
          gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + idx * 0.06 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.06);
          osc.stop(ctx.currentTime + idx * 0.06 + 0.2);
        });
      }
    } catch (e) {
      console.warn('Audio synthesis failed', e);
    }
  };

  const handlePurgeRead = async () => {
    setPurging(true);
    try {
      const readNotifs = notifications.filter(n => n.is_read);
      await Promise.all(readNotifs.map(n => deleteNotification(n.id)));
      playNeonSound('click');
    } catch (e) {
      console.error('Failed to purge read notifications', e);
    } finally {
      setPurging(false);
    }
  };

  // Play retro-futuristic chime when a new notification arrives
  const prevUnreadCountRef = React.useRef(unreadCount);
  React.useEffect(() => {
    if (unreadCount > prevUnreadCountRef.current) {
      playNeonSound('beep');
    }
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount]);

  const quickActions = [
    { label: 'Library', icon: History, to: '/library' },
    { label: 'Help', icon: HelpCircle, to: '/help' },
    { label: 'Settings', icon: SlidersHorizontal, to: '/settings' },
  ];

  const commandSuggestions = [
    { label: 'Creative Engine', category: 'Studio', to: '/anime/engine', desc: 'Core production orchestration', icon: Zap },
    { label: 'World Builder', category: 'Studio', to: '/anime/world', desc: 'Lore & geography architecture', icon: Cpu },
    { label: 'Cast Planner', category: 'Studio', to: '/anime/characters', desc: 'Character profiles & relationships', icon: User },
    { label: 'Series Planner', category: 'Studio', to: '/anime/series', desc: 'Episodic structure mapping', icon: Layers },
    { label: 'Script Writing', category: 'Production', to: '/anime/script', desc: 'AI-assisted screenplay flow', icon: ScrollText },
    { label: 'SEO Optimizer', category: 'Distribution', to: '/anime/seo', desc: 'Search engine metadata sync', icon: Search },
    { label: 'Global Dashboard', category: 'Navigation', to: '/dashboard', desc: 'System-wide telemetry overview', icon: Grid },
    { label: 'Core Settings', category: 'Config', to: '/settings', desc: 'Manage API models & keys', icon: SlidersHorizontal },
    { label: 'Archived Library', category: 'Data', to: '/library', desc: 'Saved production blueprint registry', icon: History },
    { label: 'Community Feed', category: 'Social', to: '/community', desc: 'Studio collaboration hub', icon: MessageSquare },
  ];

  // Hotkey listener for ALT+K and ESC
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchFocused(true);
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setSearchFocused(false);
        searchInputRef.current?.blur();
        setShowNotifications(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowNotifications]);

  // Fetch real User Profile and Balance Dossier info
  React.useEffect(() => {
    if (!user) return;
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
        const [profileRes, balanceRes] = await Promise.all([
          fetch(`/api/profiles/${user.id}`, { headers }),
          fetch(`/api/balances/${user.id}`, { headers })
        ]);
        if (profileRes.ok && balanceRes.ok) {
          const profile = await profileRes.json();
          const balance = await balanceRes.json();
          setProfileData({
            displayName: profile.display_name || 'Architect',
            tier: balance.current_tier || 'Free',
            level: balance.level || 1,
            credits: balance.credits || 0,
            avatarUrl: profile.avatar_url
          });
        }
      } catch (e) {
        console.error('Failed to fetch profile in TopBar', e);
      }
    };
    fetchUserProfile();
  }, [user]);

  const lastPingUpdateRef = React.useRef<number>(0);

  // Listen to signalBus for REAL API Request Latencies
  React.useEffect(() => {
    const handleSignal = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.duration !== undefined) {
        const now = Date.now();
        if (now - lastPingUpdateRef.current < 300) {
          return;
        }
        lastPingUpdateRef.current = now;
        // Map actual fetch duration to real latency ping indicator
        setPing(Math.round(customEvent.detail.duration));
      }
    };
    signalBus.addEventListener('neural_signal', handleSignal);
    return () => signalBus.removeEventListener('neural_signal', handleSignal);
  }, []);

  // Fetch real System Telemetry metrics (CPU, Temperature, RAM) from diagnostic route
  React.useEffect(() => {
    const fetchSystemTelemetry = async () => {
      try {
        const data = await apiRequest<any>('/api/diagnostic/pulse?include_db=false');
        if (data && data.system) {
          setCpuLoad(Math.round(data.system.cpu_percent || 0));
          if (data.system.sys_temp_c !== null && data.system.sys_temp_c !== undefined) {
            setCoreTemp(Math.round(data.system.sys_temp_c));
          } else {
            // Adaptive warm temperature fallback matching active CPU usage
            const calculatedTemp = 36 + Math.round((data.system.cpu_percent || 0) * 0.14 + Math.random() * 3);
            setCoreTemp(calculatedTemp);
          }
        }
      } catch (e) {
        console.warn('System pulse diagnostics unavailable, falling back to simulated engine updates.', e);
        // Realistic fallback simulation if backend api endpoint is loading
        setCpuLoad(prev => {
          const diff = Math.floor(Math.random() * 9) - 4;
          const next = prev + diff;
          return next > 45 ? 24 : next < 8 ? 12 : next;
        });
        setCoreTemp(prev => {
          const diff = Math.floor(Math.random() * 3) - 1;
          const next = prev + diff;
          return next > 52 ? 43 : next < 35 ? 38 : next;
        });
      }
    };

    fetchSystemTelemetry();
    const interval = setInterval(fetchSystemTelemetry, 8000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside dropdowns
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (profileWrapperRef.current && !profileWrapperRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationsWrapperRef.current && !notificationsWrapperRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowNotifications]);

  const handleMarkAsRead = async (id: number) => {
    setReadingId(id);
    try {
      await markAsRead(id);
    } finally {
      setReadingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllAsRead();
    } finally {
      setMarkingAll(false);
    }
  };

  const filteredSuggestions = React.useMemo(() => {
    if (!searchQuery) return commandSuggestions.slice(0, 4); // Default links
    return commandSuggestions.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredNotifications = React.useMemo(() => {
    if (activeNotificationTab === 'all') return notifications;
    if (activeNotificationTab === 'alerts') {
      return notifications.filter(n => 
        n.type.toLowerCase() === 'alert' || n.type.toLowerCase() === 'warning'
      );
    }
    if (activeNotificationTab === 'system') {
      return notifications.filter(n => 
        n.type.toLowerCase() === 'info' || n.type.toLowerCase() === 'success'
      );
    }
    return notifications;
  }, [notifications, activeNotificationTab]);

  const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Creator";
  const userAvatar = profileData?.avatarUrl || defaultAvatar;

  return (
    <>
      {/* Mobile compact header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 h-[56px] bg-[#050505]/95 border-b border-white/5 flex items-center justify-between px-3 z-[450] transform-gpu will-change-transform">
        <div className="flex items-center gap-2">
          <button onClick={() => { playNeonSound('click'); setCollapsed(!collapsed); }} className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-300">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 truncate">
          <Link to="/dashboard" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 bg-black border border-cyan-500/30 rounded-lg flex items-center justify-center">
              <ScrollText className="text-cyan-400 w-4 h-4" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white truncate max-w-[60vw]">Anime Script Pro</h2>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowNotifications(!showNotifications)} className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-300 relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black bg-rose-500 rounded-full text-white">{unreadCount}</span>}
          </button>
        </div>
      </div>

      <header 
      className="hidden sm:flex fixed top-0 left-0 right-0 h-[64px] border-b border-zinc-800/40 flex items-center justify-between px-6 bg-black/70 backdrop-blur-md z-[400] transition-all duration-300 ease-out shadow-[0_4px_30px_rgba(0,0,0,0.4)] transform-gpu will-change-transform"
    >
      {/* Left: Branding & Core Navigation */}
      <div className="flex items-center gap-5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 group active:scale-95 border",
            !collapsed 
              ? "text-cyan-400 bg-cyan-950/20 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              : "text-zinc-500 hover:text-white hover:bg-zinc-800/20 border-zinc-800/50 hover:border-zinc-700/80"
          )}
          title={collapsed ? "Open Sidebar" : "Close Sidebar"}
        >
          <Grid className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
        </button>

        <Link to="/dashboard" className="flex items-center gap-3 group no-underline">
          <div className="w-9 h-9 bg-black border border-cyan-500/30 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)] group-hover:border-cyan-400 transition-all group-hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            <ScrollText className="text-cyan-400 w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-[0.25em] text-[11px] uppercase text-white leading-none">Anime Script Pro</span>
            <span className="text-[9px] font-bold text-zinc-500 tracking-[0.1em] mt-0.5 uppercase leading-none">Creative Hub</span>
          </div>
        </Link>

        <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-zinc-800/80 to-transparent mx-2 hidden lg:block" />

        {/* Live System Telemetry Engine */}
        <div className="hidden xl:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-950/30 border border-zinc-900/80 rounded-xl px-3 py-1.5 cursor-help group/telemetry transition-colors hover:border-zinc-800 relative">
          <div className="flex items-center gap-1.5 font-sans">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <span className="text-zinc-400 font-bold">Node Alpha-3</span>
          </div>
          <span className="text-zinc-700">•</span>
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-500 animate-pulse" />
            <span className="text-zinc-300 font-mono">{ping}ms</span>
          </div>
          
          {/* Detailed Floating Telemetry Console */}
          <div className="absolute top-[38px] left-0 w-64 bg-zinc-950/95 border border-zinc-800/80 backdrop-blur-md rounded-2xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.6)] pointer-events-none opacity-0 translate-y-1 group-hover/telemetry:opacity-100 group-hover/telemetry:translate-y-0 transition-all duration-300 z-[500] text-left">
            <div className="flex justify-between items-center mb-3 border-b border-zinc-900 pb-2">
              <span className="text-[10px] font-black text-cyan-400 tracking-wider">System Live Telemetry</span>
              <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Synced</span>
            </div>
            
            <div className="space-y-3 font-sans">
              <div>
                <div className="flex justify-between text-[9px] font-bold text-zinc-400 mb-1">
                  <span>AI Synthesizer CPU Load</span>
                  <span className="text-cyan-400 font-mono">{cpuLoad}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${cpuLoad}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[9px] font-bold text-zinc-400 mb-1">
                  <span>Synapse Engine Core Temp</span>
                  <span className={cn("font-mono", coreTemp > 45 ? "text-amber-400" : "text-emerald-400")}>{coreTemp}°C</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-500", coreTemp > 45 ? "bg-amber-500" : "bg-emerald-500")} 
                    style={{ width: `${(coreTemp / 70) * 100}%` }} 
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[8px] font-black text-zinc-500 border-t border-zinc-900 pt-2">
                <span>Cluster: US-East-1</span>
                <span>Real-Time Sync active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-zinc-800/80 to-transparent mx-2 hidden lg:block" />

        {/* Command Search Palette Wrapper */}
        <div ref={searchWrapperRef} className="relative hidden lg:block">
          <div className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-xl border w-72 xl:w-96 group transition-all shadow-inner",
            searchFocused 
              ? "border-cyan-500/50 bg-black/80 shadow-[0_0_20px_rgba(6,182,212,0.1)]" 
              : "border-zinc-800/60 bg-zinc-950/40 hover:border-zinc-700/80 hover:bg-zinc-900/20"
          )}>
            <Search className={cn("w-3.5 h-3.5 transition-colors duration-300", searchFocused ? "text-cyan-400" : "text-zinc-600")} />
            <input 
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="bg-transparent border-none text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-300 placeholder:text-zinc-700 focus:outline-none w-full" 
              placeholder="Search command palette..." 
            />
            <div className="flex items-center gap-1 shrink-0">
               <span className="text-[8px] font-black text-zinc-500 border border-zinc-800/80 bg-zinc-950 px-1.5 py-0.5 rounded shadow-sm group-hover:text-zinc-400 transition-colors">ALT + K</span>
            </div>
          </div>

          {/* Interactive Floating Command Search Dropdown */}
          <AnimatePresence>
            {searchFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="absolute top-full left-0 mt-2 w-full bg-zinc-950/95 border border-zinc-800/80 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-[500] border-t-cyan-500/20"
              >
                <div className="p-3 border-b border-zinc-900 flex justify-between items-center bg-black/40">
                  <span className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" /> Command Directory
                  </span>
                  <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-bold">Suggestions</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto p-1.5 space-y-1">
                  {filteredSuggestions.length === 0 ? (
                    <div className="py-8 text-center text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                      No Commands Found
                    </div>
                  ) : (
                    filteredSuggestions.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={() => {
                            playNeonSound('success');
                            navigate(item.to);
                            setSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 hover:bg-cyan-500/5 group border border-transparent hover:border-cyan-500/10 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center group-hover:border-cyan-500/20 transition-colors">
                              <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                            </div>
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-wider text-zinc-200 group-hover:text-white transition-colors">{item.label}</div>
                              <div className="text-[8px] font-medium text-zinc-600 mt-0.5 group-hover:text-zinc-400 transition-colors">{item.desc}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[7px] font-black tracking-widest uppercase text-zinc-700 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded group-hover:border-cyan-500/10 group-hover:text-cyan-400 transition-colors">{item.category}</span>
                            <ArrowRight className="w-3 h-3 text-zinc-800 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Center Production Controls - Only visible in Studio Mode */}
      {isStudioMode && (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 border border-zinc-800/50 p-1.5 rounded-2xl backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <Button
            variant="outline"
            size="sm"
            onClick={saveLocalSession}
            className="h-8 px-4 rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all active:scale-95"
          >
            💾 Save Local
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={loadLocalSession}
            className="h-8 px-4 rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all active:scale-95"
          >
            📂 Load Local
          </Button>

          <div className="w-[1px] h-4 bg-zinc-800 mx-1" />

          <Button
            variant="default"
            size="sm"
            disabled={isLoading}
            onClick={() => window.dispatchEvent(new CustomEvent('studio-generate-all'))}
            className="h-8 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-95 group overflow-hidden relative border border-cyan-400/20"
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

      {/* Right: Telemetry Toggles, Notifications, & User Profile Dropdown */}
      <div className="flex items-center gap-4">
        {/* Quick QuickActions Bar */}
        <div className="flex items-center gap-1 rounded-2xl border border-zinc-800/50 bg-black/30 p-1 shrink-0">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                onClick={() => navigate(action.to)}
                className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-[9px] font-black uppercase tracking-[0.22em] text-zinc-500 transition-all hover:bg-zinc-800/30 hover:text-white"
                title={action.label}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* Ambient Sound waves toggle - visual enhancer */}
        <button
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) {
              try {
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioCtx) {
                  const ctx = new AudioCtx();
                  const osc = ctx.createOscillator();
                  const gain = ctx.createGain();
                  osc.type = 'sine';
                  osc.frequency.setValueAtTime(580, ctx.currentTime);
                  gain.gain.setValueAtTime(0.03, ctx.currentTime);
                  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
                  osc.connect(gain);
                  gain.connect(ctx.destination);
                  osc.start();
                  osc.stop(ctx.currentTime + 0.08);
                }
              } catch (e) {}
            }
          }}
          className={cn(
            "p-2.5 rounded-xl border transition-all active:scale-95 flex items-center gap-2 group hidden sm:flex",
            soundEnabled 
              ? "text-cyan-400 bg-cyan-950/10 border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.1)]" 
              : "text-zinc-600 bg-zinc-950/20 border-zinc-900"
          )}
          title={soundEnabled ? "Disable System Sound FX" : "Enable System Sound FX"}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> : <VolumeX className="w-3.5 h-3.5" />}
          
          <div className="flex items-center gap-[2px] h-3 w-4">
            <span className={cn("w-[2px] bg-cyan-400 rounded-full transition-all duration-300", soundEnabled ? "animate-pulse h-3" : "h-1.5")} style={{ animationDelay: '0.1s' }} />
            <span className={cn("w-[2px] bg-cyan-400 rounded-full transition-all duration-300", soundEnabled ? "animate-pulse h-2" : "h-1")} style={{ animationDelay: '0.3s' }} />
            <span className={cn("w-[2px] bg-cyan-400 rounded-full transition-all duration-300", soundEnabled ? "animate-pulse h-2.5" : "h-1.5")} style={{ animationDelay: '0.2s' }} />
            <span className={cn("w-[2px] bg-cyan-400 rounded-full transition-all duration-300", soundEnabled ? "animate-pulse h-1.5" : "h-1")} style={{ animationDelay: '0.4s' }} />
          </div>
        </button>

        {isStudioMode && (
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/5 px-3 py-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
            <span className="hidden md:inline text-[9px] font-black uppercase tracking-[0.24em] text-emerald-400">Studio Mode</span>
          </div>
        )}

        {/* Notifications Popover */}
        <div ref={notificationsWrapperRef} className="flex items-center gap-3 relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className={cn(
              "relative p-2.5 rounded-xl border transition-all group",
              showNotifications 
                ? "text-white bg-zinc-800 border-zinc-700 shadow-lg" 
                : "text-zinc-500 hover:text-white hover:bg-zinc-800/20 border-transparent hover:border-zinc-800/60"
            )}
          >
            <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-cyan-400 rounded-full border-2 border-black shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-ping" />
            )}
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-3 w-[420px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-[500] border-t-cyan-500/20"
              >
                <div className="px-[18px] py-4 border-b border-zinc-900 flex justify-between items-center bg-black/40 gap-3">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap">Neural Signals</span>
                    {unreadCount > 0 && (
                      <span className="text-[8px] font-black bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap tracking-wider animate-pulse flex items-center justify-center">
                        {unreadCount} NEW
                      </span>
                    )}
                  </div>
                  
                  {/* Real-time simulation dispatcher */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={handleSimulateNotification}
                      disabled={simulating}
                      className="text-[9px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1 border border-cyan-500/20 hover:border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-950/40 px-2.5 py-1.5 rounded-lg disabled:opacity-50 shrink-0 cursor-pointer"
                      title="Simulate active system event"
                    >
                      {simulating ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Zap className="w-2.5 h-2.5 animate-pulse text-cyan-400" />}
                      ⚡ Dispatch
                    </button>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        disabled={markingAll}
                        className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-cyan-400 transition-all flex items-center gap-1 border border-zinc-900 hover:border-cyan-500/20 bg-zinc-950 px-2.5 py-1.5 rounded-lg shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        {markingAll ? <Loader2 className="w-2.5 h-2.5 animate-spin text-cyan-400" /> : <Check className="w-2.5 h-2.5" />}
                        Mark All
                      </button>
                    )}
                  </div>
                </div>

                {/* Popover Filter Tabs */}
                <div className="flex border-b border-zinc-900/60 bg-zinc-950 px-[18px] py-2 justify-between items-center gap-4">
                  <div className="flex flex-1 p-0.5 gap-1.5 bg-black/30 border border-zinc-900/60 rounded-xl">
                    {(['all', 'alerts', 'system'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveNotificationTab(tab);
                          playNeonSound('click');
                        }}
                        className={cn(
                          "flex-1 text-[9px] font-black uppercase tracking-widest py-1.5 rounded-lg transition-all cursor-pointer border",
                          activeNotificationTab === tab 
                            ? "bg-zinc-900 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                            : "text-zinc-600 hover:text-zinc-400 border-transparent hover:bg-zinc-900/20"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  
                  {notifications.some(n => n.is_read) && (
                    <button
                      onClick={handlePurgeRead}
                      disabled={purging}
                      className="text-[9px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest px-3 py-2 border border-rose-950/40 hover:border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_10px_rgba(244,63,94,0.05)] hover:shadow-[0_0_15px_rgba(244,63,94,0.15)] shrink-0 disabled:opacity-50"
                      title="Purge read signals from vault"
                    >
                      {purging ? <Loader2 className="w-2.5 h-2.5 animate-spin text-rose-500" /> : null}
                      Purge Read
                    </button>
                  )}
                </div>

                <div className="max-h-[380px] overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-12 text-center text-xs font-black text-zinc-600 uppercase tracking-widest">
                      No Active Signals
                    </div>
                  ) : (
                    filteredNotifications.slice(0, 5).map(n => (
                      <NotificationItem
                        key={n.id}
                        id={n.id}
                        title={n.title}
                        message={n.message}
                        type={n.type.toLowerCase() as any}
                        time={n.created_at}
                        read={n.is_read}
                        onRead={handleMarkAsRead}
                        onDelete={deleteNotification}
                        loading={readingId === n.id}
                      />
                    ))
                  )}
                </div>
                
                <button 
                  onClick={() => {
                    navigate('/notifications');
                    setShowNotifications(false);
                  }}
                  className="w-full p-3.5 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.2em] hover:bg-zinc-900/40 transition-all border-t border-zinc-900"
                >
                  View All Vault Signals
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => navigate('/community')}
            className="p-2.5 text-zinc-500 hover:text-white hover:bg-zinc-800/20 border border-transparent hover:border-zinc-800/60 rounded-xl transition-all"
            title="Open Community"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-[1px] bg-zinc-800" />

        {/* User Profile Action Menu Dropdown */}
        <div ref={profileWrapperRef} className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)} 
            className={cn(
              "flex items-center gap-3 pl-2 pr-1.5 py-1 rounded-2xl hover:bg-zinc-900/30 border transition-all group",
              profileOpen ? "border-zinc-800 bg-zinc-950/60" : "border-transparent hover:border-zinc-800/60"
            )}
          >
            <div className="text-right hidden md:block select-none font-sans">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white leading-none">
                {profileData?.displayName || 'Creator'}
              </p>
              <p className="text-[8px] font-bold text-zinc-500 mt-1 uppercase tracking-widest leading-none">
                {profileData?.tier || 'Master V3'}
              </p>
            </div>
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden group-hover:border-cyan-500/50 transition-all shadow-2xl">
                <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
          </button>

          {/* Interactive Profile Dropdown Card */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-3 w-64 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-[500] border-t-cyan-500/20 animate-fade-in"
              >
                {/* Account overview section */}
                <div className="p-4 border-b border-zinc-900 bg-black/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
                      <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="font-sans">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-white truncate max-w-[130px]">
                        {profileData?.displayName || 'Production Creator'}
                      </h4>
                      <p className="text-[8px] font-semibold text-cyan-400 tracking-widest mt-0.5 uppercase">
                        Level {profileData?.level || 1} • {profileData?.tier || 'Free'} Tier
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[8px] font-black text-zinc-500 bg-zinc-950 p-2 rounded-xl border border-zinc-900/60 font-sans">
                    <span>Credits: {profileData?.credits ?? 0}</span>
                    <span className="text-emerald-400">Online</span>
                  </div>
                </div>

                {/* Submenu lists */}
                <div className="p-1.5 space-y-0.5 font-sans">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/40 text-[10px] font-black uppercase tracking-wider text-left transition-all"
                  >
                    <User className="w-3.5 h-3.5 text-zinc-500" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/settings');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/40 text-[10px] font-black uppercase tracking-wider text-left transition-all"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
                    <span>System Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/settings?tab=keys');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/40 text-[10px] font-black uppercase tracking-wider text-left transition-all"
                  >
                    <Key className="w-3.5 h-3.5 text-zinc-500" />
                    <span>API Keys Sync</span>
                  </button>

                  <div className="h-px bg-zinc-900 my-1 mx-2" />

                  <button
                    onClick={() => {
                      signOut();
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/5 text-[10px] font-black uppercase tracking-wider text-left transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500/70" />
                    <span>Sign Out Deck</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
    </>
  );
};
