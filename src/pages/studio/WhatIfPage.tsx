import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/page/PageShell';
import { WhatIfGenerator } from '@/components/studio/core/WhatIfGenerator';
import { useGenerator } from '@/contexts/GeneratorContext';

export function WhatIfPage() {
  const { generatedScript, selectedModel } = useGenerator();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <SectionHeading
        title="What If? Engine"
        icon={<HelpCircle className="w-5 h-5 text-red-500" />}
        actions={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
             <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
             <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">Simulation Active</span>
          </div>
        }
      />

      <Card className="studio-panel p-6 min-h-[600px] flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-black text-zinc-200 uppercase tracking-tight italic">NARRATIVE DIVERGENCE</h2>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Simulate alternate timelines based on your current script. The AI will analyze the "Ripple Effects" to show how the rest of your story would transform under new conditions.
          </p>
        </div>

        <div className="flex-1 bg-black/20 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="p-4 h-full">
            <WhatIfGenerator 
              scriptContext={generatedScript || ''} 
              model={selectedModel} 
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
