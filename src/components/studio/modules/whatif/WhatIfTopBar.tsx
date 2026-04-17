import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { StudioModuleWrapper } from '@/components/studio/core/StudioModuleWrapper';

interface WhatIfHeaderProps {
  children?: React.ReactNode;
}

export function WhatIfTopBar({ children }: WhatIfHeaderProps) {
  return (
    <StudioModuleWrapper
      title="WHAT IF? ENGINE"
      subtitle="Narrative Divergence"
      description="Simulate alternate timelines based on your current script. The AI will analyze the 'Ripple Effects' to show how the rest of your story would transform."
      icon={<HelpCircle className="w-3 h-3" />}
      actions={
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
           <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
           <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">Simulation Active</span>
        </div>
      }
    >
      {children}
    </StudioModuleWrapper>
  );
}
