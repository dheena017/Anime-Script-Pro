import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusSquare, 
  ScrollText, 
  Users, 
  Layout, 
  Sparkles,
  ChevronRight,
  Database,
  Activity,
  Zap,
  Cpu,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { projectService } from '@/services/api/projects';
import { MOCK_STORY_BIBLE } from '@/services/generators/mockData';
import { cn } from '@/lib/utils';

const WIZARD_OPTIONS = [
  {
    id: 'script',
    title: 'New Script',
    nodeId: 'NODE-W1',
    description: 'Craft a new narrative beat or episode script using AI resonance.',
    icon: ScrollText,
    color: 'text-studio',
    path: '/anime/script'
  },
  {
    id: 'character',
    title: 'New Character',
    nodeId: 'NODE-W2',
    description: 'Design a character DNA with unique visual and personality traits.',
    icon: Users,
    color: 'text-fuchsia-500',
    path: '/anime/cast'
  },
  {
    id: 'scene',
    title: 'New Storyboard',
    nodeId: 'NODE-W3',
    description: 'Scaffold a new scene with visual prompts and camera directions.',
    icon: Layout,
    color: 'text-amber-500',
    path: '/anime/storyboard'
  }
];

export default function ProjectWizard() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setCurrentProject, refreshAppData } = useApp();

  const handleCreate = async (opt: any) => {
    if (!title.trim()) return;
    setError(null);
    setLoading(true);
    
    try {
      const project = await projectService.createProject({
        title,
        content_type: opt.title,
        model_used: 'gemini-2.0-flash',
        status: 'draft'
      });

      if (!project) throw new Error('TRANSMISSION ERROR: BLUEPRINT FAILED');

      setCurrentProject(project);
      await refreshAppData();
      navigate(opt.path);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'NODE INITIALIZATION FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 py-12 px-6 relative overflow-hidden flex items-center justify-center selection:bg-studio/30">
      {/* Visual Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-studio/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/5 blur-[180px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10 space-y-16">
        <div className="grid gap-4 rounded-[2rem] border border-studio/20 bg-studio/5 p-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-studio">
              <Sparkles className="w-4 h-4" />
              Shared story bible
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
              {MOCK_STORY_BIBLE.title}
            </h2>
            <p className="max-w-3xl text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              {MOCK_STORY_BIBLE.logline}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-center">
              <Database className="mx-auto mb-2 h-4 w-4 text-studio" />
              {MOCK_STORY_BIBLE.worldName}
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-center">
              <ShieldCheck className="mx-auto mb-2 h-4 w-4 text-emerald-400" />
              {MOCK_STORY_BIBLE.powerSystem}
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-center">
              <Sparkles className="mx-auto mb-2 h-4 w-4 text-fuchsia-400" />
              {MOCK_STORY_BIBLE.theme}
            </div>
          </div>
        </div>
        
        {/* 1. INITIALIZATION HEADER */}
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-studio/5 border border-studio/20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-studio/10 blur-xl animate-pulse" />
            <PlusSquare className="w-10 h-10 text-studio relative z-10" />
          </motion.div>
          
          <div className="space-y-4">
             <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
                Initialize <span className="text-studio">Blueprint.</span>
             </h1>
             <p className="text-zinc-600 font-black uppercase text-[11px] tracking-[0.4em]">Every masterpiece begins with a single production directive.</p>
          </div>

          {/* TERMINAL TELEMETRY */}
          <div className="flex flex-wrap items-center justify-center gap-12 pt-8 border-t border-white/5 max-w-3xl mx-auto">
             <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-studio animate-pulse" />
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Link Status: Optimal</span>
             </div>
             <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-fuchsia-500" />
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Latency: 142ms</span>
             </div>
             <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-amber-500" />
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Registry Sync Active</span>
             </div>
          </div>
        </div>

        {/* 2. CONFIGURATION TERMINAL */}
        <div className="bg-[#0a0a0b] border border-white/5 rounded-[4rem] p-10 md:p-20 shadow-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-studio/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="max-w-xl mx-auto mb-20 space-y-6">
            <div className="flex items-center justify-between px-2">
               <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Blueprint Identity</label>
               <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest tabular-nums">REG-ID: #8842-ARCHIVE</span>
            </div>
            <div className="relative">
               <input 
                 type="text"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder="ENTER PRODUCTION TITLE..."
                 className="w-full bg-black/60 border border-zinc-900 rounded-[2rem] px-10 py-8 text-2xl font-black text-white placeholder:text-zinc-900 focus:border-studio/50 transition-all outline-none italic tracking-tighter"
               />
               <AnimatePresence>
                 {title.length > 0 && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute right-8 top-1/2 -translate-y-1/2 text-studio">
                      <Zap className="w-6 h-6 fill-studio" />
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WIZARD_OPTIONS.map((opt, idx) => (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (idx * 0.1) }}
                disabled={!title || loading}
                onClick={() => handleCreate(opt)}
                className="group relative flex flex-col p-10 bg-black/40 border border-white/5 rounded-[2.5rem] hover:border-studio/40 transition-all text-left disabled:opacity-20 disabled:cursor-not-allowed hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <opt.icon className={cn("w-24 h-24", opt.color)} />
                </div>

                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-10 transition-all duration-700 group-hover:bg-studio group-hover:text-black group-hover:-rotate-6">
                  <opt.icon className={cn("w-7 h-7 transition-colors", opt.color, "group-hover:text-black")} />
                </div>

                <div className="space-y-4 relative z-10 flex-grow">
                   <div className="space-y-1">
                      <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">{opt.nodeId}</span>
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-studio transition-colors">{opt.title}</h3>
                   </div>
                   <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                      {opt.description}
                   </p>
                </div>

                <div className="mt-12 flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                  <div className="flex items-center gap-3 text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                    Initialize <ArrowRight className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:text-studio transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Error Display Protocol */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-12 p-6 rounded-[1.5rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center gap-4 mx-auto max-w-xl"
              >
                 <AlertCircle className="w-5 h-5 text-red-500" />
                 <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. TERMINAL FOOTER */}
        <footer className="mt-10 flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
           <div className="flex items-center gap-4">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified Production Link: #ASP-8842-X</span>
           </div>
           <div className="flex items-center gap-3 text-zinc-600">
             <Sparkles className="w-3.5 h-3.5 text-studio" />
             Powered by Studio Architect Engine Node
           </div>
        </footer>
      </div>
    </div>
  );
}
