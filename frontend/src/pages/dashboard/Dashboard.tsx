import { useState } from 'react';
import {
  ArrowRight,
  Activity,
  Layout as LayoutGrid,
  Zap,
  ChevronRight,
  FolderGit2,
  Cpu,
  Brain,
  Globe,
  BarChart3,
  History,
  Layers,
  Terminal as TerminalIcon,
  ShieldCheck,
  SignalHigh
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { StudioLoading } from '@/pages/studio/components/studio/StudioLoading';
import { logsApi } from '@/services/api/logs';
import { projectService } from '@/services/api/projects';
import { useOptimizedData } from '@/hooks/useOptimizedData';
import { StatsGridSkeleton, ProjectsGridSkeleton, SystemLogsSkeleton } from '@/pages/studio/components/studio/skeletons/SkeletonLoaders';


import { studioLog } from '@/lib/studio-logger';
import React from 'react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    studioLog('Dashboard', 'Primary interface synchronized and active.', 'success');
  }, []);

  const [error, setError] = useState<string | null>(null);
  const lightweightCardClass = 'bg-zinc-950/55 border border-white/5 shadow-[0_4px_12px_rgba(0,0,0,0.25)]';

  // Fetch projects with caching - 5 minute TTL, 2.5s timeout (was 10s)
  const { data: projects = [], loading: projectsLoading } = useOptimizedData(
    () => projectService.getProjects().catch(err => {
      console.error("Project fetch failed:", err);
      return [];
    }),
    [user?.id],
    { cacheKey: 'dashboard_projects', cacheTTL: 5 * 60 * 1000, timeout: 2500 }
  );

  // Fetch system logs with caching - 2 minute TTL, 2.5s timeout
  const { data: systemLogs = [], loading: logsLoading } = useOptimizedData(
    () => logsApi.getLogs(5).catch(err => {
      console.error("Logs fetch failed:", err);
      return [];
    }),
    [user?.id],
    { cacheKey: 'dashboard_logs', cacheTTL: 2 * 60 * 1000, timeout: 2500 }
  );

  const safeProjects = projects ?? [];
  const safeSystemLogs = systemLogs ?? [];

  // Calculate stats from projects
  const stats = {
    total: safeProjects.length,
    week: safeProjects.filter(p => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(p.updated_at) > weekAgo;
    }).length,
    recent: safeProjects[0] || null
  };

  const recentProjects = safeProjects.slice(0, 4);

  // Only show fullscreen loading during auth phase
  const showFullscreenLoader = authLoading || !user;

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  return (
    <div className={cn("min-h-screen bg-[#050505] text-zinc-100 max-w-[1600px] mx-auto relative overflow-hidden")}>
      {/* Fullscreen loader only during auth phase */}
      {showFullscreenLoader && (
        <div className="fixed inset-0 z-[100]">
          <StudioLoading message="Setting up your dashboard..." submessage="Getting your latest updates ready..." />
        </div>
      )}

      <div className={cn("space-y-10 pt-16 pb-20 px-6 transition-opacity duration-200", showFullscreenLoader ? "opacity-0 pointer-events-none" : "opacity-100")}>
        {/* 1. TOP HEADER / SYSTEM STATUS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10 relative">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="space-y-4 relative">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-studio/10 border border-studio/20 rounded-full">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]",
                error ? "bg-amber-500 shadow-amber-500/80" : "bg-studio"
              )} />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-[0.3em]",
                error ? "text-amber-500" : "text-studio"
              )}>
                {error ? "Connection Issue" : "System Connected"}
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-[-0.04em] leading-[0.85]">
              GREETINGS,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-fuchsia-500 to-studio">
                {user?.email?.split('@')[0] || 'ARCHITECT'}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-8 text-right pb-2">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">System Stability</p>
              <p className={cn(
                "text-xs font-bold uppercase tracking-tighter",
                error ? "text-amber-400" : "text-emerald-400"
              )}>
                {error ? "DEGRADED" : "OPTIMAL SYNC"}
              </p>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="space-y-1">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Active Node</p>
              <p className="text-xs font-bold text-studio uppercase tracking-tighter">CENTRAL HUB-01</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-12 rounded-[3rem] border border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <Brain className="w-8 h-8 text-amber-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">System Desync</h3>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">{error}</p>
              </div>
            </div>
            <Button
              onClick={handleRetry}
              variant="outline"
              className="bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-500 px-8 h-14 rounded-2xl font-black uppercase tracking-widest transition-colors"
            >
              Retry Sync Transmission
            </Button>
          </div>
        )}

        {/* 2. CORE STATS BAR - Shows skeleton while loading */}
        {projectsLoading ? (
          <StatsGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Production Archives', val: stats.total, sub: 'Online', icon: Activity, color: 'from-studio/20 to-transparent', border: 'hover:border-studio/40' },
              { label: 'Studio Activity', val: stats.week, sub: 'Active', icon: Zap, color: 'from-fuchsia-500/20 to-transparent', border: 'hover:border-fuchsia-500/40' },
              { label: 'Latency', val: error ? 'INF' : '24ms', sub: error ? 'DISRUPTED' : 'STABLE', icon: SignalHigh, color: 'from-emerald-500/20 to-transparent', border: 'hover:border-emerald-500/40' },
              { label: 'Active Blueprint', val: stats.recent?.title?.substring(0, 8) || 'N/A', sub: 'SYNCED', icon: Cpu, color: 'from-violet-500/20 to-transparent', border: 'hover:border-violet-500/40' },
            ].map((stat, i) => (
              <Card key={i} className={cn("cyber-panel p-8 flex flex-col justify-between group transition-colors duration-300", stat.border)}>

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.4em]">{stat.label}</p>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-white/10 transition-colors">
                    <stat.icon className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>

                <div className="space-y-2 relative z-10">
                  <div className="text-4xl font-black text-white tracking-tighter truncate leading-none group-hover:translate-x-1 transition-transform duration-500">{stat.val}</div>
                  <div className="flex items-center gap-2 text-[9px] text-emerald-500 font-black tracking-[0.2em] uppercase">
                    <div className={cn("w-1.5 h-1.5 rounded-full", error ? "bg-amber-500" : "bg-emerald-500")} />
                    {stat.sub}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 3. CORE WORKSPACE GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">

          {/* LEFT COLUMN: BLUEPRINTS & TELEMETRY */}
          <div className="xl:col-span-8 space-y-12">

            {/* STUDIO SELECTOR (ENVIRONMENTAL NODES) */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <LayoutGrid className="w-5 h-5 text-fuchsia-500" />
                <h2 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em]">Environmental Nodes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Anime Studio', type: 'Anime', path: '/anime/engine', icon: Zap, color: 'hover:border-studio/50', glow: 'bg-studio/5', desc: 'Master configuration & blueprinting.', accent: 'text-studio' },
                  { name: 'Manhwa Studio', type: 'Manhwa', path: '/manhwa/engine', icon: Globe, color: 'hover:border-emerald-500/50', glow: 'bg-emerald-500/5', desc: 'Master configuration & blueprinting.', accent: 'text-emerald-500' },
                  { name: 'Comic Studio', type: 'Comic', path: '/comic/engine', icon: ShieldCheck, color: 'hover:border-fuchsia-500/50', glow: 'bg-fuchsia-500/5', desc: 'Master configuration & blueprinting.', accent: 'text-fuchsia-500' },
                ].map((studio) => (
                  <button
                    key={studio.type}
                    onClick={() => navigate(studio.path)}
                    className={cn(
                      "p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] transition-all duration-300 text-left group relative overflow-hidden",
                      studio.color,
                      "hover:bg-white/[0.04] hover:-translate-y-1"
                    )}
                  >
                    <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500", studio.glow)} />
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="p-3 bg-black/60 border border-white/10 rounded-2xl group-hover:border-white/20 transition-colors">
                        <studio.icon className={cn("w-5 h-5 transition-colors", studio.accent)} />
                      </div>
                      <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/5 transition-all">
                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 relative z-10">{studio.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed relative z-10">{studio.desc}</p>

                    {/* Decorative element */}
                    <div className="absolute bottom-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                      <studio.icon className="w-16 h-16" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* BLUEPRINT HUB (REGISTRY) */}
            <div className="space-y-8 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <History className="w-5 h-5 text-studio" />
                  <h2 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em]">Blueprint Registry</h2>
                </div>
                <button
                  onClick={() => navigate('/projects')}
                  className="text-[9px] font-black text-zinc-600 hover:text-studio uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                  View Full Archive <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {projectsLoading ? (
                <ProjectsGridSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentProjects.length > 0 ? (
                    recentProjects.map((project) => (
                      <Card key={project.id} className={cn(lightweightCardClass, "p-6 group hover:border-studio/30 transition-all duration-300 rounded-[2rem] cursor-pointer hover:bg-white/[0.02]")} onClick={() => navigate(`/anime/script?id=${project.id}`)}>
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-studio/20 transition-colors">
                            <Layers className="w-6 h-6 text-zinc-600 group-hover:text-studio transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="text-sm font-bold text-white uppercase truncate tracking-tight">{project.title}</h4>
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{project.model_used || 'GPT-4O'}</span>
                              <div className="w-1 h-1 rounded-full bg-zinc-800" />
                              <span className="text-[9px] font-black text-studio uppercase tracking-widest">Active</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-white transition-colors" />
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-2 p-12 rounded-[2rem] border border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                      <FolderGit2 className="w-8 h-8 text-zinc-800" />
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">No blueprints found in registry.</p>
                      <Button onClick={() => navigate('/projects/new')} variant="outline" className="h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest border-zinc-800 hover:bg-studio/5">Create First Blueprint</Button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: TELEMETRY & STATUS */}
          <div className="xl:col-span-4 space-y-12">

            {/* SYSTEM TELEMETRY */}
            <Card className="cyber-panel p-10 space-y-8">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <BarChart3 className="w-32 h-32 text-studio" />
              </div>

              <div className="space-y-1 relative z-10">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">System Performance</h2>
                <p className="text-[9px] font-bold text-studio/60 uppercase">Real-time Node Status</p>
              </div>

              <div className="space-y-6 relative z-10">
                {[
                  { label: 'Orchestrator Load', val: 12, unit: '%', color: 'bg-studio' },
                  { label: 'Server Load', val: 88, unit: '%', color: 'bg-fuchsia-500' },
                  { label: 'Memory Allocation', val: 45, unit: '%', color: 'bg-emerald-500' },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-zinc-500">{metric.label}</span>
                      <span className="text-white">{metric.val}{metric.unit}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${metric.val}%` }}
                        className={cn("h-full rounded-full transition-[width] duration-300", metric.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 grid grid-cols-2 gap-4 relative z-10">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Uptime</p>
                  <p className="text-xs font-bold text-zinc-300">14:22:04</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Region</p>
                  <p className="text-xs font-bold text-zinc-300 uppercase">AS-S1</p>
                </div>
              </div>
            </Card>

            {/* SYSTEM FEED (SYSTEM LOGS) */}
            <Card className="cyber-panel p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TerminalIcon className="w-4 h-4 text-studio" />
                  <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">System Feed</h2>
                </div>
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-studio" />
                  <div className="w-1 h-1 rounded-full bg-fuchsia-500" />
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                </div>
              </div>

              {logsLoading ? (
                <SystemLogsSkeleton />
              ) : (
                <div className="space-y-6">
                  {safeSystemLogs.length > 0 ? (
                    safeSystemLogs.map((log, idx) => (
                      <div key={log.id || idx} className="flex items-start gap-4 group/log">
                        <div className={cn(
                          "w-1 h-1 rounded-full mt-2 shrink-0",
                          log.level === 'CRITICAL' ? 'bg-red-500 shadow-red-500/50' :
                            log.level === 'WARNING' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-studio shadow-studio/50'
                        )} />
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-zinc-300 leading-relaxed uppercase tracking-tight group-hover/log:text-white transition-colors">
                            {log.message}
                          </p>
                          <p className="text-[8px] text-zinc-600 font-medium uppercase tracking-widest">
                            {log.source} // {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'JUST NOW'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 rounded-2xl border border-dashed border-white/5 text-center">
                      <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">System is quiet.</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
