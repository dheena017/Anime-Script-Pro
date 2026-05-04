import { useEffect, useState, useCallback } from 'react';
import { 
  RadioTower, 
  MonitorPlay, 
  MessageSquareWarning, 
  Users, 
  Smartphone, 
  Loader2, 
  Globe,
  ShieldCheck,
  Zap,
  Sparkles} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { cn } from '../../lib/utils';
import { settingsService } from '../../services/api/settings';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationSettings() {
  const [channels, setChannels] = useState({
    render: true, alerts: true, collab: true, mobile: true
  });
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function hydrate() {
      const dbSettings = await settingsService.getSettings();
      if (dbSettings && dbSettings.notifications) {
        setChannels({ ...channels, ...dbSettings.notifications });
      }
      setLoading(false);
    }
    hydrate();
  }, []);

  const syncToCloud = useCallback(async (overrides: any) => {
    setIsSaving(true);
    const newConfig = { ...channels, ...overrides };
    await settingsService.updateSettings({ notifications: newConfig });
    setChannels(newConfig);
    setTimeout(() => setIsSaving(false), 800);
  }, [channels]);

  if (loading) {
    return (
     <div className="w-full h-96 flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
         <Loader2 className="w-12 h-12 text-studio animate-spin" />
         <span className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.4em]">Initializing Sync Terminal...</span>
       </div>
     </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 relative selection:bg-studio/30">
      
      {/* 1. ATOMIC SYNC OVERLAY */}
      <AnimatePresence>
        {isSaving && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-8 right-8 z-[100] flex items-center gap-3 px-5 py-2.5 bg-studio/10 border border-studio/20 backdrop-blur-xl rounded-full shadow-[0_20px_50px_rgba(6,182,212,0.2)]"
          >
            <div className="w-2 h-2 rounded-full bg-studio animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-studio">Transmission Sync Active</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. COMMUNICATION SYNC TERMINAL */}
      <Card className="bg-[#0a0a0b] border border-white/5 rounded-[3.5rem] shadow-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-studio/5 blur-[150px] rounded-full pointer-events-none" />
        
        <CardHeader className="border-b border-white/5 p-10 md:p-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="flex items-center gap-8">
               <div className="w-16 h-16 rounded-2xl bg-studio/10 flex items-center justify-center border border-studio/20 shadow-2xl relative">
                  <div className="absolute inset-0 bg-studio/5 blur-xl animate-pulse" />
                  <RadioTower className="w-8 h-8 text-studio relative z-10" />
               </div>
               <div className="space-y-1">
                  <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tighter">Communication Sync</CardTitle>
                  <CardDescription className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Global Studio Updates & Feedback</CardDescription>
               </div>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="hidden xl:flex items-center gap-8 px-8 py-4 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                  <div className="flex flex-col gap-1">
                     <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Global Frequency</span>
                     <span className="text-xs font-black text-studio italic tabular-nums">5.2 GHz</span>
                  </div>
                  <div className="w-px h-8 bg-white/5" />
                  <div className="flex flex-col gap-1">
                     <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Signal Health</span>
                     <span className="text-xs font-black text-emerald-500 italic uppercase">Optimal</span>
                  </div>
               </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-10 md:p-14 space-y-12 relative">
          
          {/* Protocol Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             
             {[
               { 
                 id: 'render', 
                 active: channels.render, 
                 toggle: () => syncToCloud({render: !channels.render}), 
                 icon: MonitorPlay, 
                 color: 'red-500', 
                 nodeId: 'NODE-N1',
                 label: 'Render Notifications', 
                 desc: 'Immediate feedback upon completion of AI frame synthesis.' 
               },
               { 
                 id: 'collab', 
                 active: channels.collab, 
                 toggle: () => syncToCloud({collab: !channels.collab}), 
                 icon: Users, 
                 color: 'fuchsia-500', 
                 nodeId: 'NODE-N2',
                 label: 'Team Collab Pings', 
                 desc: 'Synchronization alerts for multi-architect production nodes.' 
               },
               { 
                 id: 'alerts', 
                 active: channels.alerts, 
                 toggle: () => syncToCloud({alerts: !channels.alerts}), 
                 icon: MessageSquareWarning, 
                 color: 'yellow-500', 
                 nodeId: 'NODE-N3',
                 label: 'Critical API Limits', 
                 desc: 'Sovereign override alerts for token exhaustion protocols.' 
               },
               { 
                 id: 'mobile', 
                 active: channels.mobile, 
                 toggle: () => syncToCloud({mobile: !channels.mobile}), 
                 icon: Smartphone, 
                 color: 'emerald-500', 
                 nodeId: 'NODE-N4',
                 label: 'Mobile Push Sync', 
                 desc: 'Distributed production updates for off-site terminal access.' 
               }
             ].map((node) => (
               <div 
                key={node.id}
                onClick={node.toggle}
                className={cn(
                  "p-10 rounded-[2.5rem] border transition-all duration-700 cursor-pointer group/node overflow-hidden flex flex-col justify-between min-h-[220px]",
                  node.active ? `bg-${node.color}/5 border-${node.color}/30 shadow-2xl` : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                )}
               >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/node:opacity-10 transition-opacity">
                     <node.icon className={cn("w-24 h-24", node.active ? `text-${node.color}` : "text-zinc-800")} />
                  </div>

                  <div className="flex items-start justify-between relative z-10">
                     <div className="flex items-center gap-5">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700", node.active ? `bg-${node.color}/20 text-${node.color}` : "bg-zinc-900 text-zinc-800")}>
                           <node.icon className={cn("w-6 h-6", node.active ? "animate-pulse" : "")} />
                        </div>
                        <div className="space-y-1">
                           <span className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">{node.nodeId}</span>
                           <h4 className="text-lg font-black text-white uppercase italic tracking-tighter group-hover/node:text-studio transition-colors">{node.label}</h4>
                        </div>
                     </div>
                     <div className={cn("w-12 h-6 rounded-full relative transition-colors duration-500", node.active ? `bg-${node.color} shadow-[0_0_15px_rgba(255,255,255,0.2)]` : "bg-zinc-900")}>
                        <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow-2xl transition-all duration-500", node.active ? "left-7" : "left-1 bg-zinc-700")} />
                     </div>
                  </div>

                  <div className="pt-8 relative z-10">
                     <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed max-w-[280px]">
                        {node.desc}
                     </p>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10 mt-4">
                     <div className="flex items-center gap-3">
                        <span className={cn("text-[8px] font-black uppercase tracking-widest", node.active ? `text-${node.color}` : "text-zinc-800")}>
                           {node.active ? "Link Active" : "Link Inactive"}
                        </span>
                     </div>
                     <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest tabular-nums italic">ARCHIVE: #ASP-{node.id.toUpperCase()}</span>
                  </div>
               </div>
             ))}
          </div>

          {/* SIGNAL METRICS FOOTER */}
          <div className="pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-4 hover:bg-white/[0.03] transition-all group/stat">
                <div className="flex items-center gap-3">
                   <Zap className="w-4 h-4 text-studio fill-studio" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Signal Strength</span>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-white tabular-nums">98</span>
                   <span className="text-[9px] font-black text-zinc-700 uppercase">% Peak</span>
                </div>
             </div>
             <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-4 hover:bg-white/[0.03] transition-all group/stat">
                <div className="flex items-center gap-3">
                   <Globe className="w-4 h-4 text-studio" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Global Coverage</span>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-white tabular-nums">100</span>
                   <span className="text-[9px] font-black text-zinc-700 uppercase">% Active</span>
                </div>
             </div>
             <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-4 hover:bg-white/[0.03] transition-all group/stat">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Secure Link</span>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-emerald-500 tabular-nums">AES</span>
                   <span className="text-[9px] font-black text-zinc-700 uppercase">256-BIT</span>
                </div>
             </div>
          </div>

          {/* System Footer Metadata */}
          <footer className="mt-10 flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
             <div className="flex items-center gap-4">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Transmission Hash: #VTH-8842-X</span>
             </div>
             <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                   <Sparkles className="w-3.5 h-3.5 text-studio" />
                   <span>Powered by Studio Architect Communication Node</span>
                </div>
             </div>
          </footer>
        </CardContent>
      </Card>
    </div>
  );
}
