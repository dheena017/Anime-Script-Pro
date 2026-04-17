import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Clock, 
  Plus, 
  ArrowUpRight, 
  Play, 
  History,
  Zap,
  Sparkles,
  Layout as LayoutIcon,
  Search,
  Activity,
  Terminal,
  Cpu,
  Layers,
  ChevronRight,
  TrendingUp,
  Fingerprint,
  Mic2,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function DashboardPage() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, filter: 'blur(10px)' },
    visible: { 
      y: 0, 
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-full bg-[#000000] text-white selection:bg-red-500/30 overflow-hidden">
      {/* High-Fidelity Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.08)_0%,transparent_70%)] blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.04)_0%,transparent_70%)] blur-[140px]" />
        
        {/* Animated Grid Scanline */}
        <motion.div 
          initial={{ y: "-100%" }}
          animate={{ y: "100%" }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent h-[10%] w-full opacity-20"
        />
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-[1700px] mx-auto px-10 py-16 space-y-16">
        
        {/* Cinematic Header */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-12"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-600/10 box-glow-red">
                <Terminal className="w-6 h-6 text-red-500" />
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-[0.6em] text-red-500/60 leading-none">CORE MAINFRAME ACTIVE</p>
                 <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] font-mono">NODE_AUTH: {user?.uid?.slice(0, 16).toUpperCase() || 'ANONYMOUS'}</h2>
              </div>
            </div>
            
            <div className="space-y-2">
               <h1 className="text-7xl lg:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] text-white text-glow-red">
                  {user?.displayName?.split(' ')[0] || 'CREATOR'}<span className="text-zinc-900 block lg:inline ml-0 lg:ml-6">.SYSTEM</span>
               </h1>
            </div>

            <p className="text-zinc-500 max-w-xl text-lg font-medium leading-relaxed italic border-l-4 border-red-600 pl-8">
               Synchronize your creative neural paths. The production terminal is primed for deployment. Evolution is mandatory.
            </p>
          </div>
          
          <div className="flex flex-col gap-6 items-end">
            <div className="flex gap-4">
               <div className="px-8 py-5 rounded-3xl glass-card flex items-center gap-6">
                  <div>
                     <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Compute Load</p>
                     <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                        <span className="text-2xl font-black italic text-white tracking-tighter">0.42ms</span>
                     </div>
                  </div>
                  <div className="h-10 w-px bg-white/5" />
                  <div>
                     <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Encryption</p>
                     <span className="text-2xl font-black italic text-emerald-500 tracking-tighter uppercase transition-colors">AES-256</span>
                  </div>
               </div>
            </div>
            <Button 
              onClick={() => navigate('/studio/script')}
              className="h-24 px-12 rounded-[32px] bg-red-600 text-white hover:bg-white hover:text-black transition-all duration-500 shadow-[0_20px_60px_rgba(220,38,38,0.3)] font-black uppercase tracking-[0.3em] text-[12px] group active:scale-95 border-none"
            >
              <Plus className="w-8 h-8 mr-4 group-hover:rotate-90 transition-transform duration-700" />
              Deploy Project
            </Button>
          </div>
        </motion.div>

        {/* Dynamic Metric Tiles */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            { icon: Zap, label: 'Neural Cycles', val: '14,204', trend: '+12%', color: 'text-red-500' },
            { icon: Clock, label: 'Uptime (M-T-D)', val: '862H', trend: 'Optimal', color: 'text-amber-500' },
            { icon: Sparkles, label: 'Creative Flux', val: 'HIGH', trend: 'Consistent', color: 'text-purple-500' },
            { icon: Layers, label: 'Bible Nodes', val: '04.2', trend: 'Syncing', color: 'text-blue-500' },
          ].map((stat) => (
            <motion.div 
              key={stat.label} 
              variants={itemVariants}
              className="relative group p-10 rounded-[40px] glass-card hover:bg-zinc-900/40 transition-all duration-500 cursor-default"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center justify-between">
                    <div className={`p-4 rounded-2xl bg-zinc-900 border border-white/5 ${stat.color} group-hover:scale-110 transition-transform duration-700 shadow-xl`}>
                       <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-black text-zinc-700 uppercase tracking-widest">{stat.trend}</span>
                 </div>
                 <div>
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white group-hover:text-red-500 transition-colors duration-500">{stat.val}</h3>
                    <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-2 italic">{stat.label}</p>
                 </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Console: Production Feed */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            className="lg:col-span-8 space-y-10"
          >
            <div className="flex items-center justify-between px-6">
               <div className="space-y-1">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Active <span className="text-zinc-800">Archives</span></h2>
                  <div className="flex items-center gap-3">
                     <span className="h-1.5 w-12 bg-red-600 rounded-full" />
                     <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em]">Neural Extraction Ready</p>
                  </div>
               </div>
               <Button variant="ghost" className="h-14 px-8 rounded-2xl glass-card text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white group">
                  Global Database <ChevronRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
               </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[
                { name: 'Tokyo Noir: Protocol 0', status: 'In Production', date: '2.4H AGO', color: 'bg-red-600', sub: 'Chapter 02: Neon Shadows', progress: 84 },
                { name: 'Project Icarus', status: 'Sequencing', date: 'YESTERDAY', color: 'bg-amber-600', sub: 'World Bible Compilation', progress: 42 },
                { name: 'Last Call: Genesis', status: 'Success', date: 'DEC 22', color: 'bg-emerald-600', sub: 'Full Script Finalized', progress: 100 },
              ].map((project) => (
                <div 
                  key={project.name}
                  className="p-10 rounded-[48px] glass-card group hover:bg-zinc-900/60 transition-all duration-700 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-12 cursor-pointer border-white/5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative z-10 flex items-center gap-10">
                     <div className="w-28 h-28 rounded-[36px] bg-zinc-950 border border-white/10 flex items-center justify-center text-red-500 relative group-hover:scale-105 transition-all duration-700 group-hover:border-red-500/40">
                        <LayoutIcon className="w-12 h-12 opacity-20 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                           <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div>
                           <h3 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-300 group-hover:text-white transition-colors duration-500 block mb-1">{project.name}</h3>
                           <p className="text-[12px] font-black text-zinc-700 uppercase tracking-widest italic">{project.sub}</p>
                        </div>
                        <div className="flex items-center gap-8">
                           <div className="flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                             <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">{project.date}</span>
                           </div>
                           <div className="flex items-center gap-3">
                             <Activity className="w-4 h-4 text-zinc-800" />
                             <span className="text-[11px] font-black text-zinc-700 uppercase tracking-widest">{project.status}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="relative z-10 w-full md:w-64 space-y-6">
                     <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">{project.progress}% SYNC</span>
                        <TrendingUp className="w-4 h-4 text-red-900" />
                     </div>
                     <div className="h-3 w-full bg-zinc-900/50 rounded-full overflow-hidden border border-white/5 p-0.5">
                        <motion.div 
                          className={`h-full ${project.color} rounded-full shadow-[0_0_15px_rgba(220,38,38,0.3)]`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${project.progress}%` }}
                          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                        />
                     </div>
                     <div className="flex justify-end gap-3 pt-2">
                        <Button size="icon" variant="ghost" className="rounded-2xl h-14 w-14 glass-card hover:bg-white hover:text-black hover:border-none transition-all duration-500">
                           <Share2 className="w-5 h-5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="rounded-2xl h-14 w-14 bg-red-600 text-white hover:bg-white hover:text-black transition-all duration-500 border-none">
                           <ArrowUpRight className="w-6 h-6" />
                        </Button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Subsystem Console: Neural Tools */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            className="lg:col-span-4 space-y-10"
          >
            <div className="px-6 space-y-1">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Neural <span className="text-zinc-800">Array</span></h2>
              <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em]">Direct Subsystem access</p>
            </div>

            <div className="p-10 rounded-[56px] glass-card space-y-10 border-white/5 bg-zinc-950/40 relative group/panel overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-transparent to-transparent opacity-60" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-600/5 rounded-full blur-[80px]" />
              
              <div className="space-y-6">
                 {[
                   { name: 'Neural Scripting', desc: 'AI Orchestrated Narrative Engine', icon: Mic2, color: 'text-red-500', bg: 'bg-red-500/10' },
                   { name: 'Visual Synapse', desc: 'Synchronized Storyboard Rendering', icon: LayoutIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                   { name: 'Audio Deployment', desc: 'High-Fidelity V.O. Terminal', icon: Play, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                 ].map((tool) => (
                   <button 
                    key={tool.name} 
                    className="w-full p-8 rounded-[40px] bg-black/40 border border-white/5 hover:border-red-500/30 transition-all duration-500 flex items-start gap-6 text-left group relative shadow-xl"
                   >
                     <div className={`p-5 rounded-[24px] ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform duration-700 shadow-2xl border border-white/5`}>
                        <tool.icon className="w-8 h-8" />
                     </div>
                     <div className="pt-2">
                        <p className="text-xl font-black text-white uppercase tracking-tight italic mb-2 leading-none group-hover:text-red-500 transition-colors">{tool.name}</p>
                        <p className="text-[12px] text-zinc-600 font-black uppercase tracking-widest leading-relaxed italic">{tool.desc}</p>
                     </div>
                   </button>
                 ))}
              </div>

              <div className="p-10 rounded-[40px] bg-red-600 text-center space-y-6 shadow-2xl relative overflow-hidden group/cta">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/microfabrics.png')] opacity-10" />
                 <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity" />
                 
                 <div className="relative z-10 space-y-6">
                    <p className="text-[12px] font-black text-white uppercase tracking-[0.4em] mb-4 text-glow-red">Connect to Hive Mind</p>
                    <div className="flex justify-center -space-x-4">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="w-14 h-14 rounded-full border-4 border-red-600 bg-zinc-950 flex items-center justify-center shadow-2xl relative">
                            <Activity className="w-5 h-5 text-red-500 opacity-40" />
                         </div>
                       ))}
                    </div>
                    <Button className="w-full h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl active:scale-95 border-none">
                       Join Terminal Discord
                    </Button>
                 </div>
              </div>
            </div>

            {/* Status Monitoring Feed */}
            <div className="p-10 rounded-[48px] glass-card space-y-6 border-white/5 bg-black/60 backdrop-blur-3xl">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                     <Activity className="w-4 h-4 text-red-500" />
                     <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600">Global Sync Feed</span>
                  </div>
                  <div className="h-1 w-1 bg-red-500 rounded-full animate-ping" />
               </div>
               <div className="space-y-4">
                  {[
                    '[04:32:01] Neural Bridge Optimized',
                    '[04:12:44] Database Integrity Verified',
                    '[03:59:12] Cache Flushed (Zone 4)',
                    '[03:44:00] Icarus Deployment Active'
                  ].map((log, i) => (
                    <div key={i} className="flex gap-6 text-[10px] font-mono font-bold leading-none py-1 border-b border-white/[0.02] last:border-none">
                       <span className="text-zinc-800 shrink-0">{log.split(' ')[0]}</span>
                       <span className="text-zinc-500 uppercase tracking-tight">{log.split(' ').slice(1).join(' ')}</span>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Extreme Footer Console */}
      <div className="relative border-t border-white/5 pt-12 pb-20 mt-20 bg-zinc-950/40 backdrop-blur-3xl">
         <div className="max-w-[1700px] mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col md:flex-row items-center gap-16">
               <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
                  <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em]">Subsystem Status: NORMAL</p>
               </div>
               <div className="flex items-center gap-4">
                  <Cpu className="w-5 h-5 text-zinc-800" />
                  <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em]">Memory Load: 12.4%</p>
               </div>
            </div>
            
            <div className="flex items-center gap-12">
               <span className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.6em] italic">FORGED IN THE VOID</span>
               <div className="h-6 w-px bg-white/5" />
               <p className="text-[11px] font-black text-zinc-800 uppercase tracking-[0.4em]">NEXUS PROTOTYPE V4.2.0 • BUILT 2026</p>
            </div>
         </div>
      </div>
    </div>
  );
}
