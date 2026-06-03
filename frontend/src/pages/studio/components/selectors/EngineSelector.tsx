import React from 'react';
import { Cpu } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TEXT_MODELS } from "@/lib/aiModels/textModels";

interface EngineSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const EngineSelector: React.FC<EngineSelectorProps> = ({ value, onChange, className }) => {
  return (
    <div className={cn("flex-1 space-y-3 relative z-10", className)}>
      <label className="text-xs font-black text-fuchsia-500 uppercase tracking-[0.3em] flex items-center gap-2">
        <Cpu className="w-3 h-3" /> AI Engine
      </label>
      <Select value={value} onValueChange={(val) => onChange(val || '')}>
        <SelectTrigger className="w-full h-14 bg-white/[0.02] border-white/10 text-white rounded-2xl hover:border-studio/30 transition-all text-xs font-black uppercase tracking-widest shadow-inner">
          <SelectValue placeholder="Gemini 3.1 Flash Lite" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-950 border-white/10 z-[1000] max-h-72 overflow-y-auto">
          {TEXT_MODELS.map((model) => (
            <SelectItem 
              key={model.id} 
              value={model.id} 
              className={cn(
                model.id === 'gemini-3.1-flash-lite' ? 'text-cyan-400 font-bold' :
                model.id === 'gemini-3.1-flash' ? 'text-cyan-300 font-bold' :
                model.id === 'gemini-3.5-flash' ? 'text-cyan-200 font-bold' :
                model.isFree ? 'text-zinc-400' : 'text-fuchsia-400 font-medium'
              )}
            >
              {model.name} {model.isFree ? '(Free)' : '(Paid)'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
