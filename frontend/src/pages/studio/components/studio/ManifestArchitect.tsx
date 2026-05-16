import React from 'react';
import { motion } from 'framer-motion';
import { Box, Layers, PlaySquare, ChevronRight, Calculator, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ProjectConfiguratorProps {
  onContinue?: (config: { sessions: number; episodes: number; scenes: number }) => void;
  isLoading?: boolean;
  initialConfig?: { sessions: number; episodes: number; scenes: number };
  externalConfig?: { sessions: number; episodes: number; scenes: number };
  onExternalConfigChange?: (config: { sessions: number; episodes: number; scenes: number } | ((prev: any) => any)) => void;
}

export function ProjectConfigurator({ onContinue, isLoading, initialConfig, externalConfig, onExternalConfigChange }: ProjectConfiguratorProps) {
  const [internalConfig, setInternalConfig] = React.useState({
    sessions: initialConfig?.sessions || 1,
    episodes: initialConfig?.episodes || 12,
    scenes: initialConfig?.scenes || 16
  });

  const config = externalConfig || internalConfig;
  const setConfig = onExternalConfigChange || setInternalConfig;

  React.useEffect(() => {
    if (initialConfig && !externalConfig) {
      setConfig(prev => ({
        ...prev,
        ...initialConfig
      }));
    }
  }, [initialConfig, externalConfig, setConfig]);

  const totalItems = config.sessions * config.episodes * config.scenes;

  const handleInputChange = (field: keyof typeof config, value: string) => {
    const num = parseInt(value) || 0;
    setConfig(prev => ({ ...prev, [field]: num }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group"
      >
        {/* Outer Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-studio/20 via-fuchsia-500/20 to-studio/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
        
        <div className="relative bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
          {/* Hardware Header */}
          <div className="p-10 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-studio/10 border border-studio/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <Box className="w-6 h-6 text-studio" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-studio">
                    Production Manifest Architect
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-studio animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">Neural Link Active // 0x-7FF</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-mono text-zinc-700">CORE_V3.SYNC</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-3 h-1 bg-zinc-800 rounded-full overflow-hidden">
                       <motion.div 
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        className="w-full h-full bg-studio/40"
                       />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-zinc-500 text-xs font-medium max-w-sm leading-relaxed">
              Design the structural foundation of your series production. This manifest defines the scope for scripts, scenes, and asset allocation.
            </p>
          </div>

          {/* Action Controls */}
          <div className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sessions Input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">SESSIONS</label>
                  <Layers className="w-3.5 h-3.5 text-zinc-800" />
                </div>
                <div className="relative group/input">
                  <Input 
                    type="number"
                    min="1"
                    value={config.sessions}
                    onChange={(e) => handleInputChange('sessions', e.target.value)}
                    className="h-14 bg-black/60 border-white/5 focus:border-studio/50 focus:ring-studio/20 text-white font-mono text-xl rounded-2xl transition-all pl-12 shadow-inner"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-studio/40 font-mono text-xs">S.</div>
                </div>
              </div>

              {/* Episodes Input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">EPISODES</label>
                  <Table className="w-3.5 h-3.5 text-zinc-800" />
                </div>
                <div className="relative group/input">
                  <Input 
                    type="number"
                    min="1"
                    value={config.episodes}
                    onChange={(e) => handleInputChange('episodes', e.target.value)}
                    className="h-14 bg-black/60 border-white/5 focus:border-studio/50 focus:ring-studio/20 text-white font-mono text-xl rounded-2xl transition-all pl-12 shadow-inner"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-studio/40 font-mono text-xs">E.</div>
                </div>
              </div>

              {/* Scenes Input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">SCENES</label>
                  <PlaySquare className="w-3.5 h-3.5 text-zinc-800" />
                </div>
                <div className="relative group/input">
                  <Input 
                    type="number"
                    min="1"
                    value={config.scenes}
                    onChange={(e) => handleInputChange('scenes', e.target.value)}
                    className="h-14 bg-black/60 border-white/5 focus:border-studio/50 focus:ring-studio/20 text-white font-mono text-xl rounded-2xl transition-all pl-12 shadow-inner"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-studio/40 font-mono text-xs">SC.</div>
                </div>
              </div>
            </div>

            {/* Visual Breakdown / Summary */}
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-r from-studio/40 via-transparent to-fuchsia-500/40 rounded-3xl opacity-20" />
              <div className="relative p-8 bg-black/40 border border-white/5 rounded-3xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-5 h-5 text-studio" />
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Manifest Computation</span>
                  </div>
                  <div className="px-3 py-1 bg-studio/5 border border-studio/20 rounded-full">
                    <span className="text-xs font-mono text-studio font-black tracking-widest uppercase">Linear Expansion Mode</span>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <motion.span
                      key={totalItems}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {totalItems.toLocaleString()}
                    </motion.span>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em]">Production Nodes</span>
                    <span className="text-studio/60 text-xs font-mono">ESTIMATED STORAGE: {Math.round(totalItems * 0.15)}MB</span>
                  </div>
                </div>
                
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                   <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                    "Structural blueprint maps {config.sessions} session(s) across {config.episodes} episodes, generating {totalItems} unique narrative scene blocks for AI synthesis."
                  </p>
                </div>
              </div>
            </div>

            {/* Execute Button */}
            <Button 
              onClick={() => onContinue?.(config)}
              disabled={isLoading || totalItems <= 0}
              className={cn(
                "w-full h-16 bg-studio text-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 font-black uppercase tracking-[0.4em] text-xs rounded-2xl shadow-[0_20px_40px_-15px_rgba(6,182,212,0.4)] group relative overflow-hidden"
              )}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span className="relative z-10 flex items-center gap-3">
                    Initialize Blueprint <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </>
              )}
            </Button>
          </div>

          {/* Technical Footer */}
          <div className="px-10 py-6 bg-black/40 border-t border-white/5 flex justify-between items-center text-xs font-mono text-zinc-700 uppercase tracking-[0.4em]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2"> <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" /> SYSTEM_OK</span>
              <span className="flex items-center gap-2"> <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" /> DB_IDLE</span>
            </div>
            <span>MNFST_HASH: 0x82A..F91</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}



