import { Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function ActivityTelemetry() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-studio" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">System Activity</h2>
        </div>
        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Last 12 Solar Cycles</span>
      </div>
      <Card className="glass p-10 rounded-[3rem] border-white/5 flex gap-2 justify-between">
        {Array.from({ length: 48 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-12 rounded-full transition-all hover:scale-y-125 cursor-pointer",
              i % 7 === 0 ? "bg-studio shadow-[0_0_10px_rgba(6,182,212,0.5)]" :
                i % 3 === 0 ? "bg-studio/40" : "bg-zinc-900"
            )}
            title={`${i + 1} transmissions detected`}
          />
        ))}
      </Card>
    </div>
  );
}