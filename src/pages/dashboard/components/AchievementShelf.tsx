import { Trophy, Zap, Command } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function AchievementShelf() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <Trophy className="w-5 h-5 text-fuchsia-500" />
        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Achievement Shelf</h2>
      </div>
      <Card className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
        {[
          { title: 'Early Adopter', desc: 'First 10 creations', icon: Zap, color: 'text-studio', bg: 'bg-studio/10' },
          { title: 'Master Architect', desc: 'Lvl 10 achieved', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { title: 'Data Weaver', desc: '50 assets archived', icon: Command, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
        ].map((badge, idx) => (
          <div key={idx} className="flex items-center gap-6 group cursor-help">
            <div className={cn("p-4 rounded-2xl transition-all group-hover:scale-110", badge.bg, badge.color)}>
              <badge.icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">{badge.title}</h4>
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{badge.desc}</p>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full border-zinc-800 rounded-2xl h-12 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">
          View All Achievements
        </Button>
      </Card>
    </div>
  );
}