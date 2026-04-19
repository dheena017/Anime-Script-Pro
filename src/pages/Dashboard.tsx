import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Users, 
  BookOpen, 
  ArrowRight, 
  Activity, 
  History, 
  Send, 
  LayoutGrid, 
  Layers, 
  ScrollText,
  Sparkles,
  Zap,
  Info,
  LogOut,
  ChevronRight,
  Target,
  Brain,
  ShieldAlert
} from 'lucide-react';
import { useGenerator } from '@/contexts/GeneratorContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Dashboard() {
  const { history } = useGenerator();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const totalScripts = history.length;
  const latestSave = history.length > 0 ? history[0] : null;
  const lastStudio = latestSave?.contentType?.toLowerCase() || 'anime';
  const basePath = `/${lastStudio}`;

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 p-6 space-y-8 max-w-[1600px] mx-auto">
      {/* 1. TOP HEADER / NEURAL STATUS */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/50 border border-zinc-800 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80">Neural Sync Active</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <button 
             onClick={() => auth.signOut()}
             className="text-[11px] font-black text-zinc-500 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2"
           >
             Disconnect <LogOut className="w-4 h-4" />
           </button>
           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-red-500/30 p-0.5 relative group cursor-pointer">
              <img 
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                alt="Profile" 
                className="w-full h-full rounded-full grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-[#030303] flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
           </div>
        </div>
      </div>

      {/* 2. CORE STATS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-[#0a0a0a]/50 border-zinc-900 p-6 flex flex-col justify-between group hover:border-red-500/20 transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-500/[0.02] pointer-events-none" />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Total Scripts</p>
            <div className="flex items-baseline gap-2">
               <h3 className="text-5xl font-black text-white">{totalScripts}</h3>
               <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mb-1">
                 <Activity className="w-3 h-3" /> Ready
               </div>
            </div>
         </Card>

         <Card className="bg-[#0a0a0a]/50 border-zinc-900 p-6 flex flex-col justify-between group hover:border-red-500/20 transition-all relative overflow-hidden">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Created This Week</p>
            <h3 className="text-5xl font-black text-white">{history.filter(i => {
               const d = new Date();
               d.setDate(d.getDate() - 7);
               return new Date(i.date) > d;
            }).length}</h3>
         </Card>

         <Card className="bg-[#0a0a0a]/50 border-zinc-900 p-6 flex flex-col justify-center items-start group hover:border-red-500/20 transition-all">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Latest Save</p>
            <p className="text-xs font-bold text-zinc-400 truncate w-full">
              {latestSave ? `${latestSave.title} (S${latestSave.session} E${latestSave.episode})` : 'No saved scripts yet'}
            </p>
         </Card>
      </div>

      {/* 2.1 STUDIO SELECTOR */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
           <LayoutGrid className="w-4 h-4 text-zinc-500" />
           <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Enter Production Studio</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Anime Studio', type: 'Anime', path: '/anime', color: 'border-orange-500/20 text-orange-400 bg-orange-500/5 hover:border-orange-500/50', desc: 'Classic animation recaps & storyboards.' },
            { name: 'Manhwa Studio', type: 'Manhwa', path: '/manhwa', color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:border-emerald-500/50', desc: 'Vertical-scroll webtoon production suite.' },
            { name: 'Comic Studio', type: 'Comic', path: '/comic', color: 'border-blue-500/20 text-blue-400 bg-blue-500/5 hover:border-blue-500/50', desc: 'Western comic & graphic novel production.' },
          ].map((studio) => (
            <button
              key={studio.type}
              onClick={() => navigate(studio.path)}
              className={cn(
                "p-8 rounded-[2rem] border transition-all text-left group hover:scale-[1.02] active:scale-95 relative overflow-hidden",
                studio.color
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-lg font-black uppercase tracking-tighter">{studio.name}</span>
                <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <p className="text-[10px] opacity-60 font-medium leading-relaxed uppercase tracking-widest relative z-10">{studio.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full">
         <div className="xl:col-span-3 space-y-8">
            {/* Quick Actions Title */}
            <div className="flex items-center gap-3">
               <Zap className="w-5 h-5 text-red-600 fill-current" />
               <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white">Quick Actions</h2>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { title: 'Start Script', desc: 'Open the script workspace and generate a new episode draft.', icon: ScrollText, color: 'text-red-500', path: `${basePath}/script` },
                 { title: 'Build Cast', desc: 'Generate and refine character details for your next production.', icon: Users, color: 'text-purple-500', path: `${basePath}/cast` },
                 { title: 'Open Templates', desc: 'Use quick templates to jump-start ideas and script structure.', icon: LayoutGrid, color: 'text-orange-500', path: `${basePath}/template` },
               ].map((item, idx) => (
                 <motion.button 
                   key={idx}
                   whileHover={{ y: -5 }}
                   onClick={() => navigate(item.path)}
                   className="flex flex-col text-left p-8 bg-[#0a0a0a]/80 border border-zinc-900 rounded-[2.5rem] hover:border-red-500/30 transition-all group relative overflow-hidden aspect-[4/3] justify-between shadow-2xl"
                 >
                   <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
                   <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[100px] opacity-0 group-hover:opacity-10 pointer-events-none" />
                   
                   <div className="flex items-center justify-between">
                     <div className={cn("p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 transition-all group-hover:scale-110 group-hover:rotate-6", item.color)}>
                        <item.icon className="w-6 h-6" />
                     </div>
                     <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                   </div>

                   <div>
                      <h4 className="text-2xl font-black text-white mb-3 tracking-tight">{item.title}</h4>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                   </div>
                 </motion.button>
               ))}
            </div>

            {/* Bottom Row (Production Health + Studio Pipeline) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Production Health */}
               <Card className="bg-[#0a0a0a]/50 border-zinc-900 rounded-[2.5rem] p-10 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Production Health</h3>
                  <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl space-y-4">
                     <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                        <p className="text-[11px] font-bold text-zinc-300 leading-relaxed">
                          Keep episodes consistent by setting scene count and runtime before generating.
                        </p>
                     </div>
                     <p className="text-[10px] text-zinc-500 font-medium ml-4">
                        Tip: Save scripts frequently so they show up in Library and the dashboard metrics stay accurate.
                     </p>
                  </div>
               </Card>

               {/* Studio Pipeline */}
               <Card className="bg-[#0a0a0a]/50 border-zinc-900 rounded-[2.5rem] p-10 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Studio Pipeline</h3>
                  <div className="space-y-3">
                    {[
                      { num: '1', label: 'Concept', path: `${basePath}/world` },
                      { num: '2', label: 'Cast', path: `${basePath}/cast` },
                      { num: '3', label: 'Storyboard', path: `${basePath}/storyboard` },
                      { num: '4', label: 'Export', path: '/library' },
                    ].map((step, idx) => (
                      <button 
                        key={idx}
                        onClick={() => navigate(step.path)}
                        className="w-full flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-900 rounded-2xl hover:bg-zinc-900 hover:border-zinc-800 transition-all group"
                      >
                         <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-zinc-600 group-hover:text-red-500 transition-colors uppercase">{step.num}.</span>
                            <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest">{step.label}</span>
                         </div>
                         <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
               </Card>
            </div>
         </div>

         {/* 4. RIGHT SIDEBAR (QUICK JUMP) */}
         <div className="space-y-8">
            <Card className="bg-[#0a0a0a]/80 border-zinc-900 rounded-[2.5rem] p-8 space-y-8 flex flex-col items-center text-center relative overflow-hidden h-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
               <div className="space-y-2">
                 <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Quick Jump</h3>
                 <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Move between studio tools without leaving the dashboard.</p>
               </div>

               <div className="w-full space-y-3">
                 {[
                   { label: 'Script Workspace', icon: ScrollText, path: `${basePath}/script` },
                   { label: 'Cast Builder', icon: Users, path: `${basePath}/cast` },
                   { label: 'Series Planner', icon: Layers, path: `${basePath}/series` },
                   { label: 'Storyboard View', icon: LayoutGrid, path: `${basePath}/storyboard` },
                 ].map((link, idx) => (
                   <Button 
                     key={idx}
                     onClick={() => navigate(link.path)}
                     variant="ghost" 
                     className="w-full justify-between h-14 rounded-2xl bg-zinc-950/30 border border-zinc-900 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-white group px-5"
                   >
                     <div className="flex items-center gap-3">
                        <link.icon className="w-4 h-4 text-zinc-600 group-hover:text-red-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{link.label}</span>
                     </div>
                     <ArrowRight className="w-4 h-4 text-zinc-800 group-hover:text-red-600 transition-all opacity-0 group-hover:opacity-100" />
                   </Button>
                 ))}
               </div>

               <div className="mt-auto grid grid-cols-2 gap-4 w-full">
                  <div className="bg-zinc-950 rounded-2xl p-4 border border-zinc-900">
                     <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total</p>
                     <p className="text-2xl font-black text-white">{totalScripts}</p>
                  </div>
                  <div className="bg-zinc-950 rounded-2xl p-4 border border-zinc-900">
                     <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">This Week</p>
                     <p className="text-2xl font-black text-red-600">{history.filter(i => {
                        const d = new Date();
                        d.setDate(d.getDate() - 7);
                        return new Date(i.date) > d;
                     }).length}</p>
                  </div>
               </div>
            </Card>
         </div>
      </div>

      {/* 5. FOOTER BAR (READY FOR DELIVERY) */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-[#0a0a0a]/90 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl"
      >
        <div className="space-y-1">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Footer Bar</p>
           <h3 className="text-2xl font-black text-white uppercase tracking-tight">Ready For Final Delivery?</h3>
           <p className="text-xs text-zinc-500 font-medium">Review storyboard and export your production package in one step.</p>
        </div>

        <div className="flex items-center gap-4">
           <Button 
             variant="ghost"
             onClick={() => navigate(`${basePath}/storyboard`)}
             className="h-12 px-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white font-black tracking-widest text-[11px]"
           >
             <LayoutGrid className="w-4 h-4 mr-3" /> STORYBOARD
           </Button>
           <Button 
             onClick={() => navigate('/library')}
             className="h-12 px-10 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black tracking-widest text-[11px] shadow-[0_0_20px_rgba(220,38,38,0.3)]"
           >
             EXPORT <ArrowRight className="w-4 h-4 ml-3" />
           </Button>
        </div>
      </motion.div>
    </div>
  );
}
