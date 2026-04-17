import React from 'react';

interface MetricBoxProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

export function MetricBox({ title, value, icon: Icon, color }: MetricBoxProps) {
  return (
    <div className="p-8 rounded-[32px] bg-zinc-950 border border-white/5 shadow-xl group hover:border-white/10 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">{title}</span>
      </div>
      <p className="text-xl font-black uppercase italic tracking-tighter text-white">{value}</p>
    </div>
  );
}
