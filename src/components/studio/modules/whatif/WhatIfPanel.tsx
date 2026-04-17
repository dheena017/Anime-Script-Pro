import React from 'react';
import { WhatIfGenerator } from '@/components/studio/core/WhatIfGenerator';

interface WhatIfPanelProps {
  scriptContext: string;
  model: string;
}

export function WhatIfPanel({ scriptContext, model }: WhatIfPanelProps) {
  return (
    <div className="bg-zinc-950/40 backdrop-blur-3xl rounded-[40px] border border-white/5 p-10 min-h-[700px] flex flex-col shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[100px] group-hover:bg-red-600/10 transition-all duration-1000" />
      
      <div className="mb-10 relative z-10">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">Divergence <span className="text-red-600">Sequencer</span></h2>
        <p className="text-zinc-500 text-sm font-medium italic leading-relaxed max-w-2xl">
          Deploying neural simulation across alternate probability paths. Adjust the "Divergence Point" to observe systemic narrative transformations.
        </p>
      </div>

      <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 overflow-hidden shadow-inner relative z-10">
        <div className="p-8 h-full">
          <WhatIfGenerator 
            scriptContext={scriptContext} 
            model={model} 
          />
        </div>
      </div>
    </div>
  );
}
