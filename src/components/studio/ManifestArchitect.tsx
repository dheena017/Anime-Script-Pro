import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, Layers, PlaySquare, ChevronRight, Calculator, CloudUpload, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ManifestScaffolderProps {
  onContinue?: (config: { sessions: number; episodes: number; scenes: number }) => void;
  isLoading?: boolean;
}

export function ManifestScaffolder({ onContinue, isLoading }: ManifestScaffolderProps) {
  const [config, setConfig] = React.useState({
    sessions: 1,
    episodes: 12,
    scenes: 16
  });

  const totalItems = config.sessions * config.episodes * config.scenes;

  const handleInputChange = (field: keyof typeof config, value: string) => {
    const num = parseInt(value) || 0;
    setConfig(prev => ({ ...prev, [field]: num }));
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl"
      >
        {/* Header - Hardware Feel */}
        <div className="p-8 border-b border-dashed border-zinc-800 bg-[#0c0c0c]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-studio flex items-center gap-2">
              <Box className="w-4 h-4" /> Production Manifest
            </h3>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            </div>
          </div>
          <p className="text-zinc-500 text-xs font-medium">Configure the structural hierarchy for this production cycle.</p>
        </div>

        {/* Action Controls */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sessions Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Sessions</label>
                <Layers className="w-3 h-3 text-zinc-700" />
              </div>
              <Input 
                type="number"
                min="1"
                value={config.sessions}
                onChange={(e) => handleInputChange('sessions', e.target.value)}
                className="h-12 bg-black border-zinc-800 focus:border-studio focus:ring-studio text-white font-mono text-lg rounded-xl transition-all"
              />
            </div>

            {/* Episodes Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Episodes</label>
                <Table className="w-3 h-3 text-zinc-700" />
              </div>
              <Input 
                type="number"
                min="1"
                value={config.episodes}
                onChange={(e) => handleInputChange('episodes', e.target.value)}
                className="h-12 bg-black border-zinc-800 focus:border-studio focus:ring-studio text-white font-mono text-lg rounded-xl transition-all"
              />
            </div>

            {/* Scenes Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Scenes</label>
                <PlaySquare className="w-3 h-3 text-zinc-700" />
              </div>
              <Input 
                type="number"
                min="1"
                value={config.scenes}
                onChange={(e) => handleInputChange('scenes', e.target.value)}
                className="h-12 bg-black border-zinc-800 focus:border-studio focus:ring-studio text-white font-mono text-lg rounded-xl transition-all"
              />
            </div>
          </div>

          {/* Summary Section - Technical Precise */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-studio/50 to-fuchsia-500/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative p-6 bg-black border border-zinc-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-studio" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sequence Summary</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-600">O(n³) Generator</span>
              </div>
              
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white tracking-tighter">
                  <motion.span
                    key={totalItems}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {totalItems.toLocaleString()}
                  </motion.span>
                </span>
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">total production items</span>
              </div>
              
              <p className="text-[10px] text-zinc-600 leading-tight">
                This operation will generate a unique entry for every combination starting from (1,1,1) up to ({config.sessions},{config.episodes},{config.scenes}).
              </p>
            </div>
          </div>

          {/* Continue Button - Bold Action */}
          <Button 
            onClick={() => onContinue?.(config)}
            disabled={isLoading || totalItems <= 0}
            className={cn(
              "w-full h-14 bg-studio hover:bg-white hover:text-black transition-all duration-300 font-black uppercase tracking-[0.3em] text-xs rounded-xl shadow-studio group overflow-hidden relative"
            )}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="relative z-10 flex items-center gap-2">
                  Continue <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </>
            )}
          </Button>
        </div>

        {/* Footer Technical Metadata */}
        <div className="px-8 py-4 bg-[#080808] border-t border-zinc-900 flex justify-between items-center text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
          <span>Architect Build: v2.4.9</span>
          <span>Latency: 24ms</span>
        </div>
      </motion.div>
    </div>
  );
}
