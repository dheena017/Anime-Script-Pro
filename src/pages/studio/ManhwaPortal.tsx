import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Sword, 
  Layers, 
  Users, 
  ScrollText, 
  LayoutGrid, 
  Hexagon,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  ChevronRight,
  Smartphone,
  Eye,
  History,
  Box
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useGenerator } from '@/contexts/GeneratorContext';

export default function ManhwaPortal() {
  const navigate = useNavigate();
  const { history, session, episode } = useGenerator();
  const manhwaHistory = history.filter(h => h.contentType === 'Manhwa');

  const stats = [
    { label: 'Active Series', value: '4', icon: Layers, color: 'text-emerald-500' },
    { label: 'Episodes Ready', value: manhwaHistory.length.toString(), icon: Zap, color: 'text-cyan-500' },
    { label: 'Top Genre', value: 'Action/RPG', icon: Target, color: 'text-emerald-400' },
  ];

  const tools = [
    { 
      id: 'script', 
      label: 'Script Forge', 
      desc: 'Vertical-scroll optimized narration and dialogue systems.', 
      icon: ScrollText, 
      path: 'script',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    { 
      id: 'world', 
      label: 'World Matrix', 
      desc: 'System logic, gates, and leveling world-building tools.', 
      icon: Hexagon, 
      path: 'world',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    { 
      id: 'cast', 
      label: 'Evolution Lab', 
      desc: 'Character stat tracking and regression/evolution planning.', 
      icon: Users, 
      path: 'cast',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    { 
      id: 'storyboard', 
      label: 'Canvas Flow', 
      desc: 'Long-strip storyboard planning with AI visual generation.', 
      icon: LayoutGrid, 
      path: 'storyboard',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
  ];

  return (
    <div className="space-y-8 p-4 no-scrollbar">
      {/* 1. HERO SECTION */}
      <div className="relative rounded-[3rem] bg-gradient-to-br from-[#0a0b0e] to-[#040507] border border-studio overflow-hidden p-12 group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-studio to-transparent opacity-50" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-studio opacity-10 blur-[100px] rounded-full pointer-events-none group-hover:opacity-20 transition-opacity duration-1000" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-studio/10 border border-studio/20 text-studio shadow-studio/20">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Manhwa Studio / Level S-Rank</span>
          </div>
          
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none text-shadow-studio">
            Level Up Your <br />
            <span className="text-studio">Storytelling</span>
          </h1>
          
          <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-lg uppercase tracking-wider">
            Optimized production suite for high-impact manhwa and webtoon recaps. Integrated system logic, vertical-flow scripts, and character evolution tracking.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
             <div className="flex items-center gap-2 px-6 py-4 bg-zinc-950/80 border border-studio/30 rounded-full shadow-studio/20">
               <Box className="w-4 h-4 text-studio" />
               <div className="flex flex-col">
                 <span className="text-[9px] font-black text-studio/60 uppercase tracking-widest leading-none mb-1">Active Unit</span>
                 <span className="text-sm font-black text-white font-mono leading-none">SESSION {session} / EPISODE {episode}</span>
               </div>
             </div>
             <Button 
               onClick={() => navigate('script')}
               className="h-14 px-10 rounded-full bg-studio text-black font-black uppercase tracking-[0.25em] text-[11px] shadow-studio hover:bg-studio/90 transition-all hover:-translate-y-1 active:scale-95"
             >
                Start Production <ArrowRight className="w-4 h-4 ml-3" />
             </Button>
          </div>
        </div>

        {/* Floating Motifs */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-6">
           <div className="w-16 h-32 rounded-xl border border-studio/30 bg-studio/5 flex items-center justify-center shadow-studio/10">
              <Smartphone className="w-8 h-8 text-studio opacity-40" />
           </div>
           <div className="w-16 h-32 rounded-xl border border-studio/30 bg-studio/5 flex items-center justify-center shadow-studio/10 self-end">
              <Eye className="w-8 h-8 text-studio opacity-40" />
           </div>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="bg-[#0a0a0a]/50 border-zinc-900 p-8 flex items-center justify-between group hover:border-studio/30 transition-all">
             <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
             </div>
             <div className={cn("p-4 rounded-2xl bg-zinc-950 border border-zinc-800 transition-all group-hover:scale-110", stat.color)}>
                <stat.icon className="w-6 h-6" />
             </div>
          </Card>
        ))}
      </div>

      {/* 3. CORE TOOLS HUB */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
           <h2 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
              <Zap className="w-5 h-5 text-studio fill-current" />
              Manhwa Production Matrix
           </h2>
           <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Select Integrated Module</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {tools.map((tool) => (
             <motion.button
               key={tool.id}
               whileHover={{ y: -5 }}
               onClick={() => navigate(tool.path)}
               className="group flex flex-col text-left p-8 bg-[#0a0a0a]/80 border border-zinc-900 rounded-[2.5rem] hover:border-studio/40 transition-all relative overflow-hidden aspect-[4/5] justify-between shadow-2xl"
             >
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", tool.bg)} />
                <div className="absolute top-0 right-0 w-32 h-32 bg-studio opacity-0 group-hover:opacity-5 blur-[80px] rounded-full pointer-events-none transition-opacity" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className={cn("p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 transition-all group-hover:scale-110 group-hover:shadow-studio/20", "text-studio")}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:text-studio group-hover:translate-x-1 transition-all" />
                </div>

                <div className="relative z-10">
                   <h4 className="text-2xl font-black text-white mb-3 tracking-tighter uppercase">{tool.label}</h4>
                   <p className="text-xs text-zinc-500 font-medium leading-relaxed line-clamp-2">{tool.desc}</p>
                </div>
             </motion.button>
           ))}
        </div>
      </div>

      {/* 4. RECENT SESSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-3">
               <History className="w-4 h-4" /> Recent Manhwa Builds
            </h3>
            <div className="space-y-4">
               {manhwaHistory.length > 0 ? manhwaHistory.slice(0, 3).map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-6 bg-zinc-950/50 border border-zinc-900 rounded-2xl hover:bg-zinc-900 hover:border-studio transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-studio/5 border border-studio/20 flex items-center justify-center">
                          <ScrollText className="w-5 h-5 text-studio" />
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-wider">{item.title}</h4>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Episode {item.episode} • S{item.session}</p>
                       </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase text-studio opacity-0 group-hover:opacity-100">
                       Resume Build <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                 </div>
               )) : (
                 <div className="p-12 border-2 border-dashed border-zinc-900 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                    <History className="w-12 h-12 text-zinc-800 mb-4" />
                    <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">No previous manhwa manifests detected.</p>
                 </div>
               )}
            </div>
         </div>

         {/* 5. QUICK TIPS / PRODUCTION PROTOCOL */}
         <div className="space-y-6">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-3">
               <TrendingUp className="w-4 h-4 text-studio" /> Production Protocol
            </h3>
            <Card className="bg-[#0a0a0a] border-zinc-900 p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-studio/5 blur-[50px]" />
               <div className="space-y-4">
                  <div className="flex gap-4">
                     <div className="w-6 h-6 rounded-full bg-studio text-black text-[10px] font-black flex items-center justify-center shrink-0">1</div>
                     <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                        <span className="text-white font-bold">Vertical Focus:</span> Ensure visuals emphasize the long-strip format for maximum engagement.
                     </p>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-6 h-6 rounded-full bg-studio text-black text-[10px] font-black flex items-center justify-center shrink-0">2</div>
                     <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                        <span className="text-white font-bold">Evolution Mechanics:</span> Track character growth in the Evolution Lab to maintain level consistency.
                     </p>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-6 h-6 rounded-full bg-studio text-black text-[10px] font-black flex items-center justify-center shrink-0">3</div>
                     <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                        <span className="text-white font-bold">Cliffhanger Sync:</span> End scripts with high-tension beats to improve viewer retention.
                     </p>
                  </div>
               </div>
               
               <Button className="w-full bg-white text-black hover:bg-zinc-200 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl mt-4">
                  Enhance Production Pipeline
               </Button>
            </Card>
         </div>
      </div>
    </div>
  );
}
