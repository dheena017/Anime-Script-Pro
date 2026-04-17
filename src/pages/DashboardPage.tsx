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
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden p-12 rounded-[40px] bg-zinc-950 border border-white/5 shadow-2xl group"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(220,38,38,0.1),transparent_70%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20">
              <Zap className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">System Ready</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter text-white">
              Welcome Back, <span className="text-red-600">{user?.displayName?.split(' ')[0] || 'Creator'}</span>
            </h1>
            <p className="text-zinc-500 max-w-lg text-sm font-medium leading-relaxed italic border-l-2 border-red-600/20 pl-4">
              Your neural production terminal is active. Continue your legacy or forge a new narrative path.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/studio/script')}
            className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] group/btn active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5 mr-3 group-hover/btn:rotate-90 transition-transform" />
            New Script
          </Button>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { icon: Zap, label: 'Neural Cycles', val: '1,284', trend: '+12%' },
          { icon: Clock, label: 'Studio Time', val: '42.5h', trend: '+5h' },
          { icon: Sparkles, label: 'AI Infusion', val: '98%', trend: 'Max' },
          { icon: BarChart3, label: 'Complexity', val: 'High', trend: 'Stable' },
        ].map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="bg-zinc-950 border-white/5 rounded-3xl overflow-hidden hover:border-red-500/30 transition-colors group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-red-500 transition-colors">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{stat.trend}</span>
                </div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-white italic uppercase tracking-tighter">{stat.val}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Projects */}
        <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-black uppercase italic tracking-widest text-white flex items-center gap-3">
              <History className="w-5 h-5 text-red-500" /> Recent Archives
            </h2>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">View All</Button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Neon Samurai Chronicles', status: 'In Production', date: '2h ago', items: 12 },
              { name: 'Void Runner: Episode 04', status: 'Paused', date: 'Yesterday', items: 8 },
              { name: 'Synthesized Dreams', status: 'Archived', date: '3 days ago', items: 24 },
            ].map((project, i) => (
              <div 
                key={project.name}
                className="p-6 rounded-[32px] bg-zinc-950 border border-white/5 flex items-center justify-between group hover:border-red-500/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                    <LayoutIcon className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-1 group-hover:text-red-500 transition-colors">{project.name}</h3>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {project.date}</span>
                      <span className="flex items-center gap-1.5"><Search className="w-3 h-3" /> {project.items} Scenes</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    project.status === 'In Production' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    project.status === 'Paused' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                    'bg-zinc-800 text-zinc-500 border-zinc-700'
                  }`}>
                    {project.status}
                  </div>
                  <Button size="icon" variant="ghost" className="rounded-full hover:bg-white hover:text-black">
                     <ArrowUpRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Tools */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
           <h2 className="text-lg font-black uppercase italic tracking-widest text-white flex items-center gap-3 px-2">
            <Zap className="w-5 h-5 text-red-500" /> Neural Shortcuts
          </h2>
          <Card className="bg-zinc-950 border-white/5 rounded-[40px] overflow-hidden p-8 space-y-6 shadow-2xl">
              {[
                { name: 'Storyboard Gen', desc: 'Sync script to visual grid', icon: LayoutIcon, color: 'text-purple-500' },
                { name: 'SEO Optimizer', desc: 'Max platform visibility', icon: Search, color: 'text-blue-500' },
                { name: 'Voice Synthesis', desc: 'Audio Bay deployment', icon: Play, color: 'text-red-500' },
              ].map(tool => (
                <button key={tool.name} className="w-full p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-white/10 transition-all flex items-start gap-4 text-left group">
                   <div className={`mt-1 ${tool.color} group-hover:scale-110 transition-transform`}><tool.icon className="w-5 h-5" /></div>
                   <div>
                      <p className="font-black text-zinc-200 uppercase tracking-tight italic text-sm mb-1">{tool.name}</p>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{tool.desc}</p>
                   </div>
                </button>
              ))}
              <div className="pt-4 border-t border-white/5">
                 <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.2em] text-center italic">Advanced Controls Locked [V3.0 Beta]</p>
              </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
