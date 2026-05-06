import React from 'react';
import { Clapperboard } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface StudioSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const StudioSelector: React.FC<StudioSelectorProps> = ({ value, onChange, className }) => {
  return (
    <div className={cn("flex-1 space-y-3 relative z-10", className)}>
      <label className="text-[9px] font-black text-studio uppercase tracking-[0.3em] flex items-center gap-2">
        <Clapperboard className="w-3 h-3" /> Studio Identity
      </label>
      <Select value={value} onValueChange={(val) => onChange(val || '')}>
        <SelectTrigger className="w-full h-14 bg-white/[0.02] border-white/10 text-white rounded-2xl hover:border-studio/30 transition-all text-[11px] font-black uppercase tracking-widest shadow-inner">
          <SelectValue placeholder="Anime" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-950 border-white/10 z-[1000]">
          <SelectItem value="Anime">Anime Studio</SelectItem>
          <SelectItem value="Manhwa">Manhwa Studio</SelectItem>
          <SelectItem value="Comic">Comic Studio</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
