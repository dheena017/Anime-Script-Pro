import React from 'react';
import { Brain } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ToneSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ToneSelector: React.FC<ToneSelectorProps> = ({ value, onChange, className }) => {
  return (
    <div className={cn("flex-1 space-y-3 relative z-10", className)}>
      <label className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-2">
        <Brain className="w-3 h-3" /> Narrative Tone
      </label>
      <Select value={value} onValueChange={(val) => onChange(val || '')}>
        <SelectTrigger className="w-full h-14 bg-white/[0.02] border-white/10 text-white rounded-2xl hover:border-studio/30 transition-all text-xs font-black uppercase tracking-widest shadow-inner">
          <SelectValue placeholder="Hype/Energetic" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-950 border-white/10 z-[1000]">
          <SelectItem value="Hype/Energetic">Hype / Action</SelectItem>
          <SelectItem value="Dark/Gritty">Dark / Seinen</SelectItem>
          <SelectItem value="Emotional/Sad">Emotional / Drama</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
