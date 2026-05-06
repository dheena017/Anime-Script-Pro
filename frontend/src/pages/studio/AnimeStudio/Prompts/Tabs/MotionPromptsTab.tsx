import { Video, Play, Clock, Move } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const MotionPromptsTab = () => {
  const motionPresets = [
    { name: 'Cinematic Pan', speed: 'Slow', type: 'Camera' },
    { name: 'Dynamic Zoom', speed: 'Fast', type: 'Focus' },
    { name: 'Handheld Shake', speed: 'Variable', type: 'Vibe' },
    { name: 'Dolly Zoom', speed: 'Medium', type: 'Perspective' },
  ];

  return (
    <div className="py-10 space-y-16">
      <div className="flex items-center gap-6 border-b border-white/5 pb-10">
        <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <Video className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Motion DNA</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Temporal parameters and motion engine orchestration
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Move className="w-3 h-3" /> Motion Presets
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {motionPresets.map((preset, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-emerald-500/20 transition-all group">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">{preset.name}</h4>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-1">{preset.type} node</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full">{preset.speed}</span>
                  <Play className="w-4 h-4 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-3 h-3" /> Temporal Synthesis
          </h3>
          <Card className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mb-6">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Awaiting Motion Manifest</h4>
            <p className="text-[10px] text-zinc-600 max-w-[220px] mx-auto leading-relaxed">
              Temporal parameters are calculated based on the script pacing and storyboard duration nodes.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};



