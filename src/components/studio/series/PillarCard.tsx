import React from 'react';

interface PillarCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

export function PillarCard({ icon: Icon, title, description, color }: PillarCardProps) {
  return (
    <div className="p-8 rounded-[32px] bg-zinc-950 border border-white/5 group hover:border-blue-600/20 transition-all shadow-xl">
      <div className={`w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-[12px] font-black uppercase tracking-widest text-zinc-200 mb-3 italic">{title}</h4>
      <p className="text-[11px] text-zinc-500 font-medium italic leading-relaxed">{description}</p>
    </div>
  );
}
