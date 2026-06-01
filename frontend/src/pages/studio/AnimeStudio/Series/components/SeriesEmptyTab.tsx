import { motion } from 'framer-motion';
import { LucideIcon, Sparkles, Box, Layout as LayoutIcon, Layers, Zap, Film, Map, Database, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useGeneratorState } from '@/hooks/useGenerator';

interface SeriesEmptyTabProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accentColor?: string;
  onGenerate?: () => void;
}

export function SeriesEmptyTab({ 
  icon: Icon, 
  title, 
  description,
  accentColor = "studio",
  onGenerate
}: SeriesEmptyTabProps) {
  const { isGeneratingSeries } = useGeneratorState();

  const triggerGenerate = () => {
    if (onGenerate) {
      onGenerate();
    } else {
      window.dispatchEvent(new CustomEvent('show-notification', { detail: { message: 'Open the Blueprint tab and set explicit sessions/episodes/scenes before generating.', type: 'warning' } }));
    }
  };

  // Ensure the empty tab disappears immediately when synthesis begins
  if (isGeneratingSeries) return null;

  const modules = [
    { icon: Film, name: 'Episodes', desc: 'Narrative arc and beat sheets' },
    { icon: Map, name: 'Roadmap', desc: 'Holistic series timeline' },
    { icon: Database, name: 'Assets', desc: 'Production resource matrix' },
    { icon: Activity, name: 'Arcs', desc: 'Character & world evolution' },
    { icon: Layers, name: 'Blueprint', desc: 'Structural technical specs' },
    { icon: Box, name: 'Inventory', desc: 'Location & prop indexing' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[800px] py-12 px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-studio/5 to-transparent pointer-events-none" />

      {/* Main Center Stage */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl bg-[#050505]/40 backdrop-blur-2xl border border-white/5 rounded-[4rem] p-12 md:p-20 relative z-10 shadow-2xl overflow-hidden group mb-12"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-50" />

        <div className="flex flex-col items-center text-center space-y-10 relative z-10">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className={cn(
              "w-28 h-28 rounded-[2.5rem] bg-black border-2 border-white/5 flex items-center justify-center relative shadow-2xl transition-all duration-500 group-hover:border-studio/40",
              `shadow-[0_0_60px_rgba(var(--${accentColor}-rgb),0.1)]`
            )}
          >
            <div className="absolute inset-0 blur-3xl rounded-full bg-studio/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <Icon className="w-14 h-14 relative z-10 text-studio" />
          </motion.div>

          <div className="space-y-4 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">
              {title}
            </h2>
            <p className="text-zinc-500 text-sm md:text-base font-bold uppercase tracking-[0.3em] leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 pt-4">
            <Button
              onClick={triggerGenerate}
              className="h-20 px-16 rounded-full font-black uppercase tracking-[0.3em] text-sm bg-studio text-black hover:bg-studio/80 transition-all duration-500 shadow-[0_20px_50px_rgba(6,182,212,0.3)] group/gen"
            >
              <Sparkles className="w-5 h-5 mr-4 animate-pulse" />
              Begin AI Series Synthesis
            </Button>

            <button className="text-xs font-black text-zinc-600 uppercase tracking-[0.4em] hover:text-zinc-400 transition-colors">
              // Load Production Template 01
            </button>
          </div>
        </div>
      </motion.div>

      {/* Module Previews (Mirroring Cast Module) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {modules.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2rem] bg-zinc-900/20 border border-white/5 flex flex-col items-start gap-4 hover:bg-zinc-900/40 hover:border-white/10 transition-all group/mod"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover/mod:bg-studio/10 group-hover/mod:border-studio/20 transition-all">
              <m.icon className="w-6 h-6 text-zinc-600 group-hover/mod:text-studio transition-colors" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest group-hover/mod:text-white transition-colors">{m.name}</h4>
              <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">{m.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 flex items-center gap-2 opacity-30">
        <LayoutIcon className="w-4 h-4 text-zinc-600" />
        <span className="text-xs font-black text-zinc-600 uppercase tracking-[0.5em]">Neural Architecture v1.4 // Production Ready</span>
      </div>
    </div>
  );
}
