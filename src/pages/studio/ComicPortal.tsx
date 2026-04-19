import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Shield, 
  Layers, 
  Users, 
  ScrollText, 
  LayoutGrid, 
  Book,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  ChevronRight,
  PenTool,
  History,
  Box
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useGenerator } from '@/contexts/GeneratorContext';

export default function ComicPortal() {
  const navigate = useNavigate();
  const { history, session, episode } = useGenerator();
  const comicHistory = history.filter(h => h.contentType === 'Comic');

  const stats = [
    { label: 'Issues Published', value: '8', icon: Book, color: 'text-blue-500' },
    { label: 'Hero Designs', value: comicHistory.length.toString(), icon: Shield, color: 'text-indigo-500' },
    { label: 'Active Arcs', value: '3', icon: Target, color: 'text-cyan-500' },
  ];

  const tools = [
    { 
      id: 'script', 
      label: 'Script Desk', 
      desc: 'Panel-by-panel script generation for western comics.', 
      icon: ScrollText, 
      path: 'script',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    { 
      id: 'world', 
      label: 'Universe Ark', 
      desc: 'Multiverse logic, city layouts, and alternate timelines.', 
      icon: Sparkles, 
      path: 'world',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    { 
      id: 'cast', 
      label: 'Origin Lab', 
      desc: 'Superhero origins, secret identities, and power sets.', 
      icon: Users, 
      path: 'cast',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    { 
      id: 'storyboard', 
      label: 'Panel Flow', 
      desc: 'Dynamic panel layout planning and AI lettering prompts.', 
      icon: LayoutGrid, 
      path: 'storyboard',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
  ];

  return (
    <div className="space-y-8 p-4 no-scrollbar">
      {/* 1. HERO SECTION */}
      <div className="relative rounded-[3rem] bg-gradient-to-br from-[#0c0e14] to-[#050609] border border-studio overflow-hidden p-12 group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-studio to-transparent opacity-50" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-studio opacity-10 blur-[100px] rounded-full pointer-events-none group-hover:opacity-20 transition-opacity duration-1000" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-studio/10 border border-studio/20 text-studio shadow-studio/20">
            <PenTool className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Comic Studio / Universe Architect</span>
          </div>
          
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none text-shadow-studio">
            Assemble Your <br />
            <span className="text-studio">Universe</span>
          </h1>
          
          <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-lg uppercase tracking-wider">
            Optimized for Western comic book storytelling. Create complex multiverses, dynamic origins, and panel-perfect recap scripts.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
             <div className="flex items-center gap-2 px-6 py-4 bg-zinc-950/80 border border-studio/30 rounded-full shadow-studio/20">
               <Box className="w-4 h-4 text-studio" />
               <div className="flex flex-col">
                 <span className="text-[9px] font-black text-studio/60 uppercase tracking-widest leading-none mb-1">Active Unit</span>
                 <span className="text-sm font-black text-white font-mono leading-none">VOL {session} / ISSUE {episode}</span>
               </div>
             </div>
             <Button 
               onClick={() => navigate('script')}
               className="h-14 px-10 rounded-full bg-studio text-white font-black uppercase tracking-[0.25em] text-[11px] shadow-studio hover:bg-studio/90 transition-all hover:-translate-y-1 active:scale-95"
             >
                Start Authoring <ArrowRight className="w-4 h-4 ml-3" />
             </Button>
          </div>
        </div>

        {/* Floating Motifs */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-6">
           <div className="w-16 h-32 rounded-xl border border-studio/30 bg-studio/5 flex items-center justify-center shadow-studio/10">
              <Shield className="w-8 h-8 text-studio opacity-40" />
           </div>
           <div className="w-16 h-32 rounded-xl border border-studio/30 bg-studio/5 flex items-center justify-center shadow-studio/10 self-end">
              <Book className="w-8 h-8 text-studio opacity-40" />
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
              Comic Production Deck
           </h2>
           <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Active Modules</p>
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
               <History className="w-4 h-4" /> Recent Comic Issues
            </h3>
            <div className="space-y-4">
               {comicHistory.length > 0 ? comicHistory.slice(0, 3).map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-6 bg-zinc-950/50 border border-zinc-900 rounded-2xl hover:bg-zinc-900 hover:border-studio transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-studio/5 border border-studio/20 flex items-center justify-center">
                          <ScrollText className="w-5 h-5 text-studio" />
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-wider">{item.title}</h4>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Issue {item.episode} • Vol {item.session}</p>
                       </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase text-studio opacity-0 group-hover:opacity-100">
                       Resume Build <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                 </div>
               )) : (
                 <div className="p-12 border-2 border-dashed border-zinc-900 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                    <History className="w-12 h-12 text-zinc-800 mb-4" />
                    <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">No previous comic drafts detected.</p>
                 </div>
               )}
            </div>
         </div>

         {/* 5. PRODUCTION PROTOCOL */}
         <div className="space-y-6">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-3">
               <TrendingUp className="w-4 h-4 text-studio" /> Comic Standards
            </h3>
            <Card className="bg-[#0a0a0a] border-zinc-900 p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-studio/5 blur-[50px]" />
               <div className="space-y-4">
                  <div className="flex gap-4">
                     <div className="w-6 h-6 rounded-full bg-studio text-white text-[10px] font-black flex items-center justify-center shrink-0">1</div>
                     <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                        <span className="text-white font-bold">Panel Flow:</span> Ensure your script transitions clearly between panels for the illustrator.
                     </p>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-6 h-6 rounded-full bg-studio text-white text-[10px] font-black flex items-center justify-center shrink-0">2</div>
                     <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                        <span className="text-white font-bold">Sound Effects:</span> Use bold onomatopoeia as distinct script elements.
                     </p>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-6 h-6 rounded-full bg-studio text-white text-[10px] font-black flex items-center justify-center shrink-0">3</div>
                     <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                        <span className="text-white font-bold">Issue Continuity:</span> Check previous issue events in the Universe Ark before writing.
                     </p>
                  </div>
               </div>
               
               <Button className="w-full bg-white text-black hover:bg-zinc-200 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl mt-4">
                  Universe Assets
               </Button>
            </Card>
         </div>
      </div>
    </div>
  );
}
