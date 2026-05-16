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
          <SelectValue placeholder="Gemini-2.5-Flash" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-950 border-white/10 z-[1000]">
          <SelectItem value="gemini-3-pro-preview" className="text-fuchsia-500 font-bold">G3.0 Pro (Diamond)</SelectItem>
          <SelectItem value="gemini-3-flash-preview" className="text-cyan-400 font-bold">G3.0 Flash (Hyper)</SelectItem>
          <SelectItem value="gemini-2.5-flash" className="text-zinc-400">G2.5 Flash (Current Standard)</SelectItem>
          <SelectItem value="gemini-3-pro" className="text-fuchsia-300">G3.0 Pro (Ultra-Intelligence)</SelectItem>
          <SelectItem value="gemini-2.5-pro" className="text-fuchsia-200">G2.5 Pro (Elite Synthesis)</SelectItem>
          <SelectItem value="gemini-3-flash-lite" className="text-cyan-200">G3.0 Flash-Lite</SelectItem>
          <SelectItem value="gemma-3-27b" className="text-green-400 font-bold">Gemma 3-27B (Open Source)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
