import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Palette,
  Film,
  Clock,
  ScrollText,
  ChevronRight,
  Terminal,
  Lock,
  Layers,
  AlertCircle,
  CheckCircle2,
  CpuIcon,
  Sparkles,
  Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/api-utils';
import { projectsStyles as s } from './projectsStyles';

const GENRES = [
  'Shonen', 'Seinen', 'Cyberpunk', 'Isekai', 'Slice of Life', 'Mecha', 'Psychological', 'Dark Fantasy'
];

const STYLE_PRESETS = [
  'Studio Ghibli', '90s Retro Anime', 'Ufotable Dynamic', 'Makoto Shinkai', 'Cyberpunk Edgerunners'
];

export default function CreateProject() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Shonen');
  const [artStyle, setArtStyle] = useState('');
  const [description, setDescription] = useState('');
  const [episodeLength, setEpisodeLength] = useState<'SHORT' | 'FULL'>('FULL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setCurrentProject, refreshAppData } = useApp();

  const handleInitialize = async () => {
    if (!title.trim()) return;
    setError(null);
    setLoading(true);
    
    try {
      // Route directly to the unsaved studio view
      // The user will save the project at the end of their workflow
      setTimeout(() => {
        navigate('/studio/engine', {
          state: {
            title,
            genre,
            artStyle,
            description,
            episodeLength
          }
        });
      }, 800);
    } catch (err: any) {
      console.error('Routing Failed:', err);
      setError(err.message || 'TRANSMISSION ERROR: NODE INITIALIZATION FAILED');
      setLoading(false);
    }
  };

  return (
    <div className={s.pageContainer}>
      {/* Visual Decor */}
      <div className={s.decorBgTopRight} />
      <div className={s.decorBgBottomLeft} />

      <div className="max-w-3xl mx-auto space-y-16 relative z-10 py-24">
        
        {/* HEADER */}
        <header className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 opacity-50">
            <div className="w-8 h-[1px] bg-studio" />
            <span className="text-[9px] font-black uppercase tracking-[0.6em] text-studio">Node Initialization</span>
            <div className="w-8 h-[1px] bg-studio" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
            New <span className="text-studio">Nexus.</span>
          </h1>
        </header>

        {/* MAIN FORM */}
        <div className="space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* TITLE */}
            <div className="space-y-4">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.4em] ml-2">Project Identifier</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ENTER PROJECT TITLE..."
                  className={cn(s.textInput, "text-4xl md:text-5xl py-10 border-white/5 bg-white/[0.02]")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* GENRE */}
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.4em] ml-2">Production Genre</label>
                <div className="relative">
                   <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className={cn(s.selectInput, "bg-white/[0.02] border-white/5")}
                   >
                     {GENRES.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
                   </select>
                   <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* PROTOCOL LENGTH */}
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.4em] ml-2">Protocol Length</label>
                <div className={cn(s.toggleButtonGroup, "bg-white/[0.02] border-white/5 p-2")}>
                  {['SHORT', 'FULL'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setEpisodeLength(type as any)}
                      className={cn(
                        s.toggleButton,
                        "py-4",
                        episodeLength === type ? s.toggleButtonActive : "text-zinc-600"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-4">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.4em] ml-2">Narrative Core</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="DEFINE PRODUCTION DIRECTIVE..."
                rows={6}
                className="w-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] px-10 py-10 text-lg font-bold uppercase tracking-widest text-white placeholder:text-zinc-800 focus:border-studio/50 outline-none transition-all resize-none leading-relaxed"
              />
            </div>
          </motion.div>

          {/* ERROR & SUBMIT */}
          <div className="space-y-6 pt-12">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 flex items-center justify-center"
                >
                   <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={!title || loading}
              onClick={handleInitialize}
              className={cn(
                "w-full h-28 rounded-[2.5rem] font-black uppercase tracking-[0.8em] transition-all flex items-center justify-center gap-6 text-sm relative overflow-hidden group",
                loading ? "bg-zinc-900 text-zinc-700" : "bg-studio hover:scale-[1.01] active:scale-[0.99] text-black shadow-[0_30px_60px_rgba(6,182,212,0.2)]"
              )}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-6">
                    <div className="w-6 h-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
                    SYNCING NODE...
                  </motion.div>
                ) : (
                  <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-6">
                    Establish Nexus
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform duration-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .glass {
          background: rgba(10, 10, 11, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
      `}</style>
    </div>
  );
}
