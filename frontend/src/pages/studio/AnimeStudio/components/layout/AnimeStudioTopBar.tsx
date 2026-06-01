import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  Bell,
  Cpu,
  Menu,
  Brain,
  XCircle,
  Loader2,
  Zap,
  Volume2,
  VolumeX,
  Check,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/hooks/useAuth';
import { NotificationItem } from '@/pages/studio/Notifications/components/NotificationItem';
import { apiRequest } from '@/lib/api-utils';

interface AnimeStudioTopBarProps {
  onToggleEngine: () => void;
  isEngineOpen: boolean;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleGlobalSidebar?: () => void;
  isGlobalSidebarOpen?: boolean;
}

export const AnimeStudioTopBar = React.memo<AnimeStudioTopBarProps>(({
  onToggleEngine,
  isEngineOpen,
  onToggleSidebar,
  onToggleGlobalSidebar,
  isGlobalSidebarOpen,
  isSidebarCollapsed,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    prompt, 
    isDemoMode,
    isIntelligenceOpen,
    isGeneratingWorld,
    isGeneratingCharacters,
    isGeneratingSeries,
    isGeneratingLore,
    isGeneratingPowers,
    isGeneratingFactions,
    isGeneratingArchitecture,
    isGeneratingAtlas,
    isGeneratingCulture,
    isGeneratingSystems,
    generationProgress,
    selectedModel,
    temperature,
    maxTokens,
    isSaving,
  } = useGeneratorState();
  
  const { 
    setIsIntelligenceOpen, 
    clearProject,
    setTemperature,
    setMaxTokens
  } = useGeneratorDispatch();

  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  // Local config states
  const [isParamsDrawerOpen, setIsParamsDrawerOpen] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [activeNotificationTab, setActiveNotificationTab] = React.useState<'all' | 'alerts' | 'system'>('all');
  const [simulating, setSimulating] = React.useState(false);
  const [purging, setPurging] = React.useState(false);
  const [markingAll, setMarkingAll] = React.useState(false);
  const [readingId, setReadingId] = React.useState<number | null>(null);

  const notificationsWrapperRef = React.useRef<HTMLDivElement>(null);

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

  // Play retro-futuristic chime when a new notification arrives
  const prevUnreadCountRef = React.useRef(unreadCount);
  React.useEffect(() => {
    if (unreadCount > prevUnreadCountRef.current) {
      playNeonSound('beep');
    }
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount]);

  // Click outside listener for notifications popover
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsWrapperRef.current && !notificationsWrapperRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pure Client Web Audio API Synth chime player
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

  // Fullscreen Cinema mode handlers
  const toggleFullscreen = () => {
    playNeonSound('click');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const isAnyGenerating = 
    isGeneratingWorld || isGeneratingCharacters || isGeneratingSeries || 
    isGeneratingLore || isGeneratingPowers || isGeneratingFactions || 
    isGeneratingArchitecture || isGeneratingAtlas || isGeneratingCulture || 
    isGeneratingSystems;

  const getActiveGeneratingLabel = () => {
    if (isGeneratingWorld) return 'Compiling World Blueprint';
    if (isGeneratingCharacters) return 'Sequencing Cast DNA';
    if (isGeneratingSeries) return 'Materializing Episodic Matrix';
    if (isGeneratingLore) return 'Generating Historical Chronicles';
    if (isGeneratingPowers) return 'Synthesizing Aether Dynamics';
    if (isGeneratingFactions) return 'Structuring Political Castes';
    if (isGeneratingArchitecture) return 'Designing floating structures';
    if (isGeneratingAtlas) return 'Plotting geographical archipelagos';
    if (isGeneratingCulture) return 'Formulating societal dynamics';
    if (isGeneratingSystems) return 'Calibrating steam systems';
    return 'Orchestrating script files';
  };

  const currentPath = location.pathname.split('/').pop() || 'world';
  const displayTitle = prompt && prompt.length > 0 ? prompt : "New Production";
  
  const phaseMap: { [key: string]: { phase: string; label: string } } = {
    'engine': { phase: 'PHASE 1: FOUNDATION', label: 'Creative Engine' },
    'world': { phase: 'PHASE 1: FOUNDATION', label: 'World Builder' },
    'protocols': { phase: 'PHASE 1: FOUNDATION', label: 'Directives Hub' },
    'cast': { phase: 'PHASE 2: STRUCTURE', label: 'Cast' },
    'series': { phase: 'PHASE 2: STRUCTURE', label: 'Series' },
    'storyboard': { phase: 'PHASE 3: PRODUCTION', label: 'Storyboard' },
    'assets': { phase: 'PHASE 3: PRODUCTION', label: 'Assets' },
    'seo': { phase: 'PHASE 4: DISTRIBUTION', label: 'SEO' },
    'prompts': { phase: 'PHASE 4: DISTRIBUTION', label: 'Prompts' },
    'screening': { phase: 'PHASE 4: DISTRIBUTION', label: 'Screening Room' }
  };
  
  const phaseInfo = phaseMap[currentPath] || { phase: 'PHASE 1: FOUNDATION', label: currentPath.charAt(0).toUpperCase() + currentPath.slice(1) };

  return (
    <div className="sticky top-0 z-[300] flex flex-col w-full">
      {/* Mobile compact header (icon-first) */}
      <div className="sm:hidden w-full bg-[#050505]/95 border-b border-white/5 flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playNeonSound('click');
              if (onToggleSidebar) onToggleSidebar();
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-300 bg-transparent border border-transparent"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 truncate">
          <h2 className="text-sm font-black uppercase tracking-wider text-white truncate max-w-[60vw]">{displayTitle}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playNeonSound('click');
              onToggleEngine();
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-300 bg-transparent border border-transparent"
            title="Toggle Engine"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsIntelligenceOpen(!isIntelligenceOpen)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-300 bg-transparent border border-transparent"
            title="Open Intelligence"
          >
            <Brain className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-300 bg-transparent border border-transparent relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black bg-rose-500 rounded-full text-white">{unreadCount}</span>}
          </button>
        </div>
      </div>
      <header className={cn(
        "hidden sm:flex min-h-[72px] bg-gradient-to-r from-black/90 via-zinc-950/80 to-black/90 border-b border-cyan-500/10 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.03),0_10px_30px_rgba(0,0,0,0.35)] sm:flex-wrap md:flex-nowrap items-center justify-between gap-y-3 px-4 py-3 md:py-0 md:px-8 transition-all duration-500 relative",
        isEngineOpen ? "border-studio/20" : ""
      )}>
        {/* Left: Branding & Sidebars Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1 md:flex-none">
          <button
            onClick={() => {
              playNeonSound('click');
              if (onToggleSidebar) onToggleSidebar();
            }}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer border",
              isSidebarCollapsed
                ? "text-zinc-500 hover:text-white hover:bg-white/5 border-transparent"
                : "text-cyan-400 bg-cyan-500/5 border-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            )}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className={cn("w-5 h-5 transition-transform duration-500", isSidebarCollapsed && "rotate-90")} />
          </button>

          {onToggleGlobalSidebar && (
            <button
              onClick={() => {
                playNeonSound('click');
                onToggleGlobalSidebar();
              }}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer border",
                isGlobalSidebarOpen
                  ? "text-cyan-400 bg-cyan-500/5 border-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  : "text-zinc-500 hover:text-white hover:bg-white/5 border-transparent"
              )}
              title={isGlobalSidebarOpen ? "Close Global Sidebar" : "Open Global Sidebar"}
            >
              <Globe className={cn("w-5 h-5 transition-transform duration-500", isGlobalSidebarOpen && "scale-110")} />
            </button>
          )}

          <div className="h-8 w-px bg-zinc-800/50 hidden lg:block" />

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-gradient-to-br from-black to-zinc-950 rounded-xl border border-cyan-500/60 shadow-[0_0_18px_rgba(6,182,212,0.18),inset_0_1px_0_rgba(255,255,255,0.04)] select-none shrink-0">
              <Cpu className="w-4 h-4 text-cyan-500" />
              <span className="hidden sm:inline text-[11px] font-black uppercase tracking-[0.22em] text-cyan-400">Anime Studio</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-700 hidden sm:block" />
            <div className="flex flex-col text-left min-w-0 max-w-[48vw] xl:max-w-[520px]">
              <h1 className="text-[10px] sm:text-[11px] md:text-sm font-extrabold uppercase tracking-[0.14em] text-white leading-tight truncate">{displayTitle}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1 min-w-0">
                {isAnyGenerating ? (
                  <div className="flex items-center gap-1.5 animate-pulse select-none">
                    <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.22em] sm:tracking-[0.25em] text-cyan-400">
                      {getActiveGeneratingLabel()}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-cyan-500 font-mono">({generationProgress}%)</span>
                  </div>
                ) : (
                  <>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.28em] text-cyan-400">
                      {phaseInfo.phase}
                    </span>
                    <span className="hidden sm:inline text-xs font-black uppercase tracking-[0.2em] text-zinc-600">•</span>
                    <span className="hidden sm:inline text-[11px] font-bold text-zinc-400 uppercase tracking-[0.24em]">
                      {phaseInfo.label}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-2 md:gap-3 shrink-0 w-auto md:w-auto flex-nowrap">
          {/* Autosave Sync Status indicator */}
          <div 
            className={cn(
              "hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-black/80 border rounded-full shrink-0 select-none backdrop-blur-sm",
              isSaving 
                ? "border-amber-500/30 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]" 
                : "border-zinc-800/80 text-zinc-500"
            )}
            title={isSaving ? "Saving production state..." : "Workspace synchronized"}
          >
            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", isSaving ? "bg-amber-400 animate-pulse" : "bg-emerald-500 animate-pulse")} />
            <span className="text-[8px] font-black uppercase tracking-[0.18em] font-mono">
              {isSaving ? "Syncing" : "Synced"}
            </span>
          </div>

          {/* Sound waves toggle */}
          <button
            type="button"
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
              "w-10 h-10 flex items-center justify-center rounded-xl border transition-all cursor-pointer backdrop-blur-sm",
              soundEnabled 
                ? "text-cyan-400 bg-cyan-950/10 border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.1)]" 
                : "text-zinc-600 bg-zinc-950/20 border-zinc-900/40"
            )}
            title={soundEnabled ? "Disable UI Sound" : "Enable UI Sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* AI parameters quick drawer */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              playNeonSound('click');
              setIsParamsDrawerOpen(!isParamsDrawerOpen);
            }}
            className={cn(
              "hidden sm:flex w-10 h-10 items-center justify-center rounded-xl transition-all duration-300 border cursor-pointer backdrop-blur-sm",
              isParamsDrawerOpen
                ? "text-cyan-400 bg-cyan-950/20 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                : "text-zinc-500 hover:text-white hover:bg-white/5 border-transparent"
            )}
            title="AI Orchestration Config"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Fullscreen Immersion toggler */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 border border-transparent text-zinc-500 hover:text-white hover:bg-white/5 cursor-pointer animate-none backdrop-blur-sm"
            title={isFullscreen ? "Exit Cinema Mode" : "Cinema Immersion Mode"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4.5 h-4.5" />}
          </button>

          {/* Notifications Popover */}
          <div ref={notificationsWrapperRef} className="hidden sm:flex items-center gap-3 relative">
            <button 
              onClick={() => {
                playNeonSound('click');
                setShowNotifications(!showNotifications);
              }} 
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 relative cursor-pointer backdrop-blur-sm",
                showNotifications 
                  ? "text-white bg-zinc-800 border-zinc-700 shadow-lg" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5 border-transparent hover:border-zinc-800/60"
              )}
              title="Neural Signals"
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
          </div>

          {isDemoMode && (
            <button
              onClick={(e) => {
                e.preventDefault();
                playNeonSound('click');
                clearProject();
              }}
              className="flex items-center gap-2 px-3.5 py-2 text-[10px] font-black text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all uppercase tracking-widest cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit Demo</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              playNeonSound('beep');
              setIsIntelligenceOpen(!isIntelligenceOpen);
            }}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 border relative z-50 cursor-pointer backdrop-blur-sm",
              isIntelligenceOpen
                ? "text-studio bg-studio/10 border-studio/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "text-zinc-500 hover:text-white hover:bg-white/5 border-transparent"
            )}
            title="System Intelligence"
          >
            <Brain className={cn(
              "w-5 h-5",
              isAnyGenerating ? "animate-spin-slow text-cyan-400" : "animate-pulse-slow text-zinc-500"
            )} />
          </button>
        </div>

        {/* Neon Compiling Progress Bar at the absolute bottom edge of the header */}
        <AnimatePresence>
          {isAnyGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-zinc-950/60 z-50 overflow-hidden"
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                style={{ width: `${generationProgress}%` }}
                layoutId="topbar-progress"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Futuristic Parametric AI Config Drawer */}
      <AnimatePresence>
        {isParamsDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-zinc-950/95 border-b border-zinc-900/60 backdrop-blur-md overflow-hidden relative"
          >
            <div className="px-8 py-5 flex flex-col md:flex-row gap-6 items-center justify-between font-sans">
              {/* Telemetry info */}
              <div className="flex flex-col gap-1 text-left shrink-0 select-none">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">AI Compiler Telemetry</span>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Engine: {selectedModel || 'gemini-3.1-flash'}</span>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Active session synchronized</span>
              </div>
              
              <div className="w-[1px] h-10 bg-zinc-900/60 hidden md:block" />

              {/* Temperature Parameter */}
              <div className="flex-1 w-full flex flex-col gap-2">
                <div className="flex justify-between text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                  <span>Creativity Temperature</span>
                  <span className="text-cyan-400 font-mono">{(temperature ?? 0.85).toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.5" 
                  step="0.05"
                  value={temperature ?? 0.85}
                  onChange={(e) => {
                    setTemperature(parseFloat(e.target.value));
                  }}
                  className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[7px] font-bold text-zinc-700 uppercase tracking-widest select-none">
                  <span>Deterministic</span>
                  <span>Creative Jitter</span>
                </div>
              </div>

              <div className="w-[1px] h-10 bg-zinc-900/60 hidden md:block" />

              {/* Max Tokens Parameter */}
              <div className="flex-1 w-full flex flex-col gap-2">
                <div className="flex justify-between text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                  <span>Max Tokens Capacity</span>
                  <span className="text-cyan-400 font-mono">{maxTokens ?? 2048}</span>
                </div>
                <input 
                  type="range" 
                  min="512" 
                  max="8192" 
                  step="256"
                  value={maxTokens ?? 2048}
                  onChange={(e) => {
                    setMaxTokens(parseInt(e.target.value));
                  }}
                  className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[7px] font-bold text-zinc-700 uppercase tracking-widest select-none">
                  <span>512 Tokens</span>
                  <span>8192 Max Limit</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
