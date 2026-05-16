import { Card } from '@/components/ui/card';

export function NodeIntegrity() {
  return (
    <Card className="glass p-10 rounded-[3rem] border-white/5 bg-gradient-to-br from-studio/5 to-transparent">
      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 mb-8">Node Integrity Monitor</h3>
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center p-10 rounded-full border-[8px] border-zinc-900 w-48 h-48 mx-auto relative">
          <div className="absolute inset-0 rounded-full border-[8px] border-studio border-t-transparent animate-spin-slow opacity-20" />
          <span className="text-2xl font-black text-white italic tracking-tighter">88%</span>
          <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Optimized</span>
        </div>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest text-center leading-relaxed">
          Identity node is performing at peak efficiency. Complete dossier setup for 100% sync.
        </p>
      </div>
    </Card>
  );
}
