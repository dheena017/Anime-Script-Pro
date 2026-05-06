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
      const project = await apiRequest<any>('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          title,
          genre,
          art_style: artStyle,
          description,
          episode_length: episodeLength,
          status: 'draft',
          content_type: 'ANIME'
        })
      });

      await apiRequest(`/api/generate/god-mode/${project.id}`, {
        method: 'POST'
      });

      setCurrentProject(project);
      await refreshAppData();
      navigate('/library', { state: { newlyCreated: true } });
    } catch (err: any) {
      console.error('Project Initialization Failed:', err);
      setError(err.message || 'TRANSMISSION ERROR: NODE INITIALIZATION FAILED');
    } finally {
      setLoading(false);
    }
  };

  // Complexity Calculation
  const complexity = (title.length * 2) + (description.length / 5) + (artStyle ? 20 : 0);
  const expectedNodes = Math.floor(complexity / 10) + 5;

  return (
    <div className={s.pageContainer}>
      {/* Visual Decor */}
      <div className={s.decorBgTopRight} />
      <div className={s.decorBgBottomLeft} />

      <div className={s.contentWrapper}>
        
        {/* 1. HERO TITLE SECTION */}
        <header className={s.heroSection}>
          <div className={s.heroTag}>
            <div className={s.heroTagLine} />
            <span className={s.heroTagText}>Initialization Protocol</span>
          </div>
          <div className={s.heroTitleWrapper}>
            <div className={s.heroTitleSection}>
              <h1 className={s.heroTitle}>
                Initialize <span className={s.heroTitleAccent}>Production.</span>
              </h1>
              <p className={s.heroSubtitle}>
                Systematic establishment of multi-dimensional narrative blueprints and architectural assets.
              </p>
            </div>

            <div className={s.metricsGroup}>
               <div className={s.metricCard}>
                  <span className={s.metricLabel}>Expected Nodes</span>
                  <span className={s.metricValue}>{expectedNodes}</span>
               </div>
               <div className={s.metricCard}>
                  <span className={s.metricLabel}>Complexity Index</span>
                  <div className={s.metricComplexity}>
                    <div className={s.metricIndicator} />
                    <span className={s.metricPercentage}>{Math.min(complexity, 100)}%</span>
                  </div>
               </div>
            </div>
          </div>
        </header>

        {/* 3. CONFIGURATION MATRIX */}
        <div className={s.configGrid}>
          
          <div className={s.configLeftCol}>
            
            {/* NODE-P1: PROJECT IDENTITY */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={s.configCard}
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Terminal className="w-32 h-32 text-studio" />
              </div>
              <div className={s.configHeader}>
                <div className="flex items-center gap-4">
                  <div className={s.configIcon}>
                    <Database className="w-5 h-5 text-studio" />
                  </div>
                  <h2 className={s.configTitle}>Project Identity</h2>
                </div>
                <span className={s.configBadge}>NODE-P1-REGISTRY</span>
              </div>

              <div className="space-y-10">
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ENTER PRODUCTION TITLE..."
                    className={s.textInput}
                  />
                  <AnimatePresence>
                     {title.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute right-6 top-1/2 -translate-y-1/2 text-studio">
                           <CheckCircle2 className="w-6 h-6" />
                        </motion.div>
                     )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] ml-2">Production Genre</label>
                    <div className="relative">
                       <select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className={s.selectInput}
                       >
                         {GENRES.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
                       </select>
                       <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 rotate-90 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] ml-2 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      Protocol Length
                    </label>
                    <div className={s.toggleButtonGroup}>
                      {['SHORT', 'FULL'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setEpisodeLength(type as any)}
                          className={cn(
                            s.toggleButton,
                            episodeLength === type ? s.toggleButtonActive : s.toggleButtonInactive
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* NODE-P2: VISUAL DIRECTIVE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={s.configCard}
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Palette className="w-32 h-32 text-studio" />
              </div>
              <div className="flex items-center gap-4 mb-12">
                <div className={s.configIcon}>
                  <Film className="w-5 h-5 text-studio" />
                </div>
                <h2 className={s.configTitle}>Visual Directive</h2>
              </div>

              <div className="space-y-10">
                <input
                  type="text"
                  value={artStyle}
                  onChange={(e) => setArtStyle(e.target.value)}
                  placeholder="STYLE REFERENCE (E.G. STUDIO GHIBLI)..."
                  className={s.textInput}
                />
                <div className="flex flex-wrap gap-3">
                  {STYLE_PRESETS.map(styleOption => (
                    <button
                      key={styleOption}
                      onClick={() => setArtStyle(styleOption)}
                      className={cn(
                        s.presetButton,
                        artStyle === styleOption ? "bg-studio text-black border-studio shadow-[0_10px_30px_rgba(6,182,212,0.3)]" : ""
                      )}
                    >
                      {styleOption}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* NODE-P3: NARRATIVE CORE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={s.configCard}
            >
              <div className="flex items-center gap-4 mb-12">
                <div className={s.configIcon}>
                  <ScrollText className="w-5 h-5 text-studio" />
                </div>
                <h2 className={s.configTitle}>Narrative Core</h2>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="DEFINE PRODUCTION DIRECTIVE..."
                rows={6}
                className="w-full bg-black/40 border border-zinc-900 rounded-[2.5rem] px-10 py-10 text-xs font-black uppercase tracking-widest text-white placeholder:text-zinc-800 focus:border-studio/50 outline-none transition-all resize-none leading-relaxed shadow-inner"
              />
            </motion.div>
          </div>

          {/* 4. SIDEBAR: ANALYSIS ENGINE */}
          <div className={s.configRightCol}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(s.sidebarCard, "glass bg-gradient-to-br from-studio/5 to-transparent")}
            >
              <div className="flex items-center gap-4 mb-12">
                <div className="w-10 h-10 rounded-xl bg-studio flex items-center justify-center">
                  <Zap className="w-5 h-5 text-black fill-black" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white italic">Analysis Engine</h3>
              </div>

              <div className="space-y-4 mb-12">
                {[
                  { icon: CpuIcon, label: 'Expected Nodes', value: expectedNodes },
                  { icon: Sparkles, label: 'Complexity Index', value: `${Math.min(complexity, 100)}%` },
                  { icon: Layers, label: 'Render Protocol', value: 'ULTRA-L' },
                  { icon: Lock, label: 'Encryption', value: 'AES-256' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-4">
                      <stat.icon className="w-4 h-4 text-zinc-700" />
                      <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">{stat.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-white italic tracking-widest">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Error Display Protocol */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 mb-8 flex items-start gap-4"
                  >
                     <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                     <p className={s.errorMessage}>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                disabled={!title || loading}
                onClick={handleInitialize}
                className={cn(
                  "w-full h-20 rounded-3xl font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 text-xs",
                  loading ? "bg-zinc-900 text-zinc-600" : "bg-studio hover:bg-studio/80 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                )}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
                      <div className="w-5 h-5 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
                      INITIALIZING...
                    </motion.div>
                  ) : (
                    <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
                      INITIALIZE NODE
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
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
