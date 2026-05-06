import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  Brain, 
  Globe, 
  Users, 
  ChevronRight,
  Database,
  Activity,
  Zap
} from 'lucide-react';
import { useGeneratorState } from '@/hooks/useGenerator';
import { cn } from '@/lib/utils';

export function StudioIntelligenceHUD() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    generatedWorld, 
    castList, 
    generatedSeriesPlan,
    prompt,
    selectedModel,
    isGeneratingWorld,
    isGeneratingCharacters,
    isGeneratingSeries
  } = useGeneratorState();

  const stats = [
    { 
      label: 'World Data', 
      icon: Globe, 
      value: generatedWorld ? 'SYNCHRONIZED' : 'PENDING',
      status: generatedWorld ? 'success' : 'warning',
      details: generatedWorld ? `${(generatedWorld.length / 1024).toFixed(1)}KB Lore` : 'Needs Generation'
    },
    { 
      label: 'Cast Manifest', 
      icon: Users, 
      value: castList?.length ? `${castList.length} ENTITIES` : 'PENDING',
      status: castList?.length ? 'success' : 'warning',
      details: castList?.length ? `${castList.length} Characters Synced` : 'Awaiting DNA Scan'
    },
    { 
      label: 'Series Plan', 
      icon: Database, 
      value: generatedSeriesPlan?.length ? `${generatedSeriesPlan.length} PHASES` : 'PENDING',
      status: generatedSeriesPlan?.length ? 'success' : 'warning',
      details: generatedSeriesPlan?.length ? 'Roadmap Active' : 'Blueprint Missing'
    },
    { 
      label: 'Neural Engine', 
      icon: Brain, 
      value: selectedModel.toUpperCase(),
      status: 'info',
      details: `LLM: ${selectedModel}`
    }
  ];

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex items-center">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-10 h-24 bg-black/80 backdrop-blur-xl border-l border-y border-white/10 rounded-l-2xl flex flex-col items-center justify-center gap-4 transition-all duration-500 group overflow-hidden",
          isOpen ? "translate-x-full opacity-0" : "translate-x-0 opacity-100 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-studio/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Brain className={cn(
          "w-4 h-4 text-studio animate-pulse-slow",
          (isGeneratingWorld || isGeneratingCharacters || isGeneratingSeries) && "animate-spin-slow"
        )} />
        <span className="[writing-mode:vertical-lr] text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-studio transition-colors">
          INTELLIGENCE
        </span>
      </button>

      {/* Main HUD Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-80 bg-black/90 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] flex flex-col h-[600px] rounded-l-[2rem] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-studio/10 border border-studio/20 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-studio" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white">System Nexus</h3>
                  <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Real-time Intelligence Feed</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {/* Primary Prompt Context */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-studio" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Core Directive</span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                  <p className="text-[10px] text-zinc-400 leading-relaxed italic line-clamp-3">
                    {prompt || "No active production prompt..."}
                  </p>
                </div>
              </div>

              {/* Module Statuses */}
              <div className="space-y-4">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Production Matrix</span>
                <div className="grid grid-cols-1 gap-3">
                  {stats.map((stat, i) => (
                    <div key={i} className="group/stat relative p-4 rounded-2xl bg-black border border-white/5 hover:border-studio/30 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-studio/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity rounded-2xl" />
                      <div className="flex items-center justify-between mb-2 relative z-10">
                        <div className="flex items-center gap-3">
                          <stat.icon className={cn(
                            "w-4 h-4 transition-colors",
                            stat.status === 'success' ? 'text-studio' : 'text-zinc-600'
                          )} />
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300">{stat.label}</span>
                        </div>
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                          stat.status === 'success' ? 'bg-studio/10 border-studio/20 text-studio' : 
                          stat.status === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                          'bg-zinc-500/10 border-zinc-500/20 text-zinc-400'
                        )}>
                          {stat.value}
                        </span>
                      </div>
                      <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest relative z-10 ml-7">
                        {stat.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Reference Context */}
              <div className="space-y-4">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Quick Reference</span>
                <div className="space-y-3">
                  {/* World Lore Snippet */}
                  <div className="p-3 rounded-xl bg-zinc-900/30 border border-white/5 space-y-2 hover:border-studio/20 transition-all cursor-default">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3 text-studio/60" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Lore Fragment</span>
                    </div>
                    <p className="text-[8px] text-zinc-500 leading-relaxed line-clamp-4 italic">
                      {generatedWorld ? (generatedWorld.substring(0, 300) + '...') : 'World lore not yet synthesized. Context is missing.'}
                    </p>
                  </div>

                  {/* Cast DNA Snippet */}
                  <div className="p-3 rounded-xl bg-zinc-900/30 border border-white/5 space-y-2 hover:border-fuchsia-500/20 transition-all cursor-default">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-fuchsia-500/60" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Cast DNA</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {castList?.length ? castList.slice(0, 5).map((char, i) => (
                        <span key={i} className="text-[7px] font-bold px-1.5 py-0.5 rounded bg-fuchsia-500/5 text-fuchsia-300 border border-fuchsia-500/10">
                          {char.name}
                        </span>
                      )) : (
                        <span className="text-[8px] text-zinc-600 italic">No entities detected in current nexus.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Generation Stream */}
              <div className="space-y-3">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Live Synthesis</span>
                <div className="space-y-2">
                  {[
                    { label: 'Neural Sync', value: '100%', color: 'text-studio' },
                    { label: 'Context Buffer', value: '42KB', color: 'text-zinc-500' },
                    { label: 'Latency', value: '124ms', color: 'text-studio/60' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-2">
                      <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{item.label}</span>
                      <span className={cn("text-[8px] font-black tracking-widest", item.color)}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-studio/5 border-t border-studio/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-studio animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-studio">Neural Integrity 100%</span>
              </div>
              <p className="text-[7px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                All production nodes synchronized via Gemini 1.5 Pro
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
