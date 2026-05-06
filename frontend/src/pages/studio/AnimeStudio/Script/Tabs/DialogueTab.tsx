import React from 'react';
import { MessageSquare, User } from 'lucide-react';

export const DialogueTab: React.FC = () => {
  const characters = [
    { name: 'Protagonist', lines: 48, tone: 'Determined', color: 'studio' },
    { name: 'Antagonist', lines: 22, tone: 'Menacing', color: 'rose' },
    { name: 'Ally', lines: 31, tone: 'Supportive', color: 'emerald' },
    { name: 'Mentor', lines: 15, tone: 'Wise', color: 'amber' },
  ];

  const sampleLines = [
    { char: 'Protagonist', line: '"The darkness won\'t stop me — I\'ve seen worse in my own reflection."', scene: '12' },
    { char: 'Mentor', line: '"Strength alone won\'t win this war. You must learn to bend."', scene: '08' },
    { char: 'Antagonist', line: '"You call that fighting? I call it a prologue to your end."', scene: '19' },
  ];

  return (
    <div className="py-12 space-y-12">
      <div className="flex items-center gap-6 border-b border-white/5 pb-10">
        <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Dialogue Matrix</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Character voice profiles and line distribution</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {characters.map((char, i) => (
          <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-[2rem] space-y-4 hover:border-emerald-500/20 transition-all group text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <User className="w-6 h-6 text-zinc-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">{char.name}</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{char.tone}</p>
            </div>
            <div>
              <span className="text-3xl font-black text-white font-mono">{char.lines}</span>
              <p className="text-[8px] text-zinc-600 uppercase tracking-widest mt-1">Lines</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <MessageSquare className="w-3 h-3" /> Featured Lines
        </h3>
        {sampleLines.map((item, i) => (
          <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-2 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-400/80 uppercase tracking-widest">{item.char}</span>
              <span className="text-[9px] font-black text-zinc-600 uppercase">Scene #{item.scene}</span>
            </div>
            <p className="text-zinc-300 text-sm font-medium italic leading-relaxed">{item.line}</p>
          </div>
        ))}
      </div>
    </div>
  );
};



