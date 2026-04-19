import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Zap, CheckCircle2, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Beat {
  label: string;
  duration: string;
  description: string;
}

interface BeatCardProps {
  name: string;
  beats: Beat[];
  isSelected: boolean;
  onSelect: () => void;
  onApply: (e: React.MouseEvent) => void;
  isApplied: boolean;
  icon: LucideIcon;
}

export const BeatCard: React.FC<BeatCardProps> = ({
  name,
  beats,
  isSelected,
  onSelect,
  onApply,
  isApplied,
  icon: Icon
}) => {
  return (
    <Card 
      onClick={onSelect}
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-500 border-zinc-800 bg-[#0a0a0a] hover:border-cyan-500/50",
        isSelected && "border-cyan-500 ring-1 ring-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
        <Icon className="w-24 h-24 text-cyan-500" />
      </div>
      
      <div className="p-6 space-y-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
            <Icon className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-wider text-sm text-cyan-50">{name}</h3>
            <p className="text-[10px] text-zinc-500 font-bold tracking-tight uppercase">{beats.length} Sequential Beats</p>
          </div>
        </div>

        <div className="space-y-3">
          {beats.slice(0, 3).map((beat, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-zinc-300">{beat.label}</p>
                <p className="text-[10px] text-zinc-500 leading-tight line-clamp-1">{beat.description}</p>
              </div>
            </div>
          ))}
          {beats.length > 3 && (
            <p className="text-[10px] text-cyan-500/60 font-bold italic pl-4">+ {beats.length - 3} more structural beats...</p>
          )}
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Button 
            size="sm"
            variant="ghost" 
            className="text-[10px] font-black uppercase tracking-widest text-cyan-500 hover:text-cyan-300 hover:bg-cyan-500/10 p-0 h-auto"
          >
            View Breakdown <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
          
          <Button
            size="sm"
            className={cn(
              "h-8 px-4 text-[10px] font-black uppercase tracking-widest transition-all",
              isSelected ? "bg-cyan-500 text-black hover:bg-cyan-400" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-cyan-200"
            )}
            onClick={onApply}
          >
            {isApplied 
              ? <CheckCircle2 className="w-3 h-3 mr-2" /> 
              : <Zap className="w-3 h-3 mr-2" />}
            Apply Structure
          </Button>
        </div>
      </div>
    </Card>
  );
};
