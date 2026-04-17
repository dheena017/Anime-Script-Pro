import React from 'react';
import { Package } from 'lucide-react';
import { StudioModuleWrapper } from '@/components/studio/core/StudioModuleWrapper';
import { Progress } from '@/components/ui/progress';

interface ExportHeaderProps {
  children?: React.ReactNode;
}

export function ExportTopBar({ children }: ExportHeaderProps) {
  return (
    <StudioModuleWrapper
      title="EXPORT ENGINE"
      subtitle="Logistics & Finalization"
      description="From neural concept to production-ready assets. Stitch animatics, synthesize pitch decks, and deploy your vision to the industry."
      icon={<Package className="w-3 h-3" />}
      actions={
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-6 min-w-[280px]">
           <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                 <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Project Health</span>
                 <span className="text-[9px] font-black text-emerald-500 uppercase">READY</span>
              </div>
              <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[98%]" />
              </div>
           </div>
           <div className="h-8 w-px bg-white/5" />
           <div className="text-[10px] font-black text-zinc-300 uppercase italic">98% SYNC</div>
        </div>
      }
    >
      {children}
    </StudioModuleWrapper>
  );
}
