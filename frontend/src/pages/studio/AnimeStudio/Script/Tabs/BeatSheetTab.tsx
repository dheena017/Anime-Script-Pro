import React from 'react';
import { ListMusic, Zap } from 'lucide-react';

export const BeatSheetTab: React.FC = () => {
  const beats = [
    { label: 'Cold Open', time: '0:00–2:00', type: 'Hook', intensity: 40 },
    { label: 'Inciting Incident', time: '2:00–5:00', type: 'Trigger', intensity: 60 },
    { label: 'Rising Tension', time: '5:00–12:00', type: 'Conflict', intensity: 75 },
    { label: 'Mid-Point Shift', time: '12:00–14:00', type: 'Pivot', intensity: 85 },
    { label: 'Dark Moment', time: '14:00–18:00', type: 'Crisis', intensity: 95 },
    { label: 'Climax', time: '18:00–21:00', type: 'Peak', intensity: 100 },
    { label: 'Resolution', time: '21:00–24:00', type: 'Release', intensity: 50 },
  ];

  return (
    <div className="py-12 space-y-12">
      <div className="flex items-center gap-6 border-b border-white/5 pb-10">
        <div className="w-16 h-16 rounded-[2rem] bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center">
          <ListMusic className="w-8 h-8 text-fuchsia-400" />
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Beat Sheet</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Emotional arc mapping and pacing diagnostics</p>
        </div>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {beats.map((beat, i) => (
          <div key={i} className="flex items-center gap-6 p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-fuchsia-500/20 transition-all group">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest w-6">{String(i + 1).padStart(2, '0')}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">{beat.label}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-zinc-500 uppercase">{beat.time}</span>
                  <span className="text-[9px] font-black text-fuchsia-400/70 uppercase tracking-widest px-2 py-0.5 bg-fuchsia-500/10 rounded-full">{beat.type}</span>
                </div>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-fuchsia-500/60 to-fuchsia-400 rounded-full transition-all duration-700 group-hover:opacity-100 opacity-70"
                  style={{ width: `${beat.intensity}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-fuchsia-500/50" />
              <span className="text-[10px] font-black text-fuchsia-400">{beat.intensity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



