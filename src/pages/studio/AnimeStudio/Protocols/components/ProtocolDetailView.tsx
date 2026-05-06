import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Terminal,
  ShieldAlert,
  Binary
} from 'lucide-react';

interface PromptItem {
  id: string;
  name: string;
  content: string | Function;
  description: string;
  version: string;
}

interface ProtocolDetailViewProps {
  title: string;
  icon: React.ElementType;
  description: string;
  prompts: PromptItem[];
  color: string;
}

export const ProtocolDetailView: React.FC<ProtocolDetailViewProps> = ({
  title,
  icon: Icon,
  description,
  prompts,
  color
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, content: string | Function) => {
    const text = typeof content === 'function' ? content.toString() : content;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* MISSION CONTROL HEADER */}
      <div className="relative group p-10 rounded-[3rem] bg-[#050505] border border-white/5 overflow-hidden shadow-2xl">
        <div className={cn(
          "absolute -inset-24 opacity-5 blur-[100px] pointer-events-none group-hover:opacity-10 transition-opacity duration-1000",
          `bg-${color}`
        )} />
        
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="relative flex flex-col lg:flex-row items-center gap-10">
          <div className={cn(
            "w-24 h-24 rounded-[2rem] flex items-center justify-center border shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:scale-110 group-hover:rotate-6",
            `bg-${color}/10 border-${color}/30 text-${color}`
          )}>
            <Icon className="w-12 h-12 drop-shadow-[0_0_15px_currentColor]" />
          </div>
          
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <h1 className="text-5xl font-black uppercase tracking-tighter text-white italic leading-none">
                {title} <span className={cn("not-italic", `text-${color}`)}>Matrix</span>
              </h1>
              <div className="flex justify-center lg:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-zinc-500 uppercase tracking-widest">Sector_0{prompts.length}</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-500 uppercase tracking-widest">System_Stable</span>
              </div>
            </div>
            <p className="text-zinc-500 max-w-3xl text-[13px] font-bold uppercase tracking-widest leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="hidden xl:flex flex-col items-end gap-3 border-l border-white/5 pl-10">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Link Integrity</div>
                <div className="text-[10px] font-mono font-bold text-white tracking-widest">99.98% SYNC</div>
              </div>
              <div className="w-10 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[99%]" />
              </div>
            </div>
            <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] flex items-center gap-2">
              <Terminal className="w-3 h-3" />
              L3_ADMIN_ACCESS
            </div>
          </div>
        </div>
      </div>

      {/* DIRECTIVE GRID */}
      <div className="grid grid-cols-1 gap-8">
        {prompts.map((prompt, idx) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.8 }}
          >
            <Card className="group bg-[#030303] border-white/5 hover:border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-700 shadow-xl relative">
              {/* Card Scanline Effect */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="flex flex-col lg:flex-row">
                {/* TECHNICAL SIDEBAR */}
                <div className="lg:w-96 p-10 border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                    <Binary className="w-32 h-32 text-white rotate-12" />
                  </div>
                  
                  <div className="relative space-y-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", `bg-${color}`)} />
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Protocol Directive</span>
                      </div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-studio transition-colors">{prompt.name}</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">Strategic Objective</div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed font-bold uppercase tracking-widest italic">
                        {prompt.description}
                      </p>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">System_Version</span>
                        <span className="text-[11px] font-mono font-bold text-zinc-400">v{prompt.version}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">Logic_Core</span>
                        <div className={cn(
                          "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                          typeof prompt.content === 'function' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        )}>
                          {typeof prompt.content === 'function' ? 'Dynamic_Seed' : 'Static_Logic'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NEURAL TERMINAL AREA */}
                <div className="flex-1 p-10 bg-black/20 flex flex-col">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-4 h-4 text-zinc-700" />
                      <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">System_Instruction_Manifest</span>
                    </div>
                    
                    <button 
                      onClick={() => handleCopy(prompt.id, prompt.content)}
                      className="group/btn relative px-6 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-studio hover:border-studio transition-all duration-500"
                    >
                      <div className="relative z-10 flex items-center gap-3">
                        {copiedKey === prompt.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-black" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-black">Manifest_Cloned</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover/btn:text-black transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover/btn:text-black transition-colors">Clone_Directive</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>

                  <div className="flex-1 bg-black/60 rounded-[2rem] p-8 border border-white/5 font-mono text-sm relative group/term overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_70%)]" />
                    <pre className="relative z-10 text-zinc-400 whitespace-pre-wrap leading-loose text-[13px] selection:bg-studio/30 selection:text-white">
                      {typeof prompt.content === 'function' ? prompt.content.toString() : String(prompt.content)}
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ARCHITECTURAL CLEARANCE WARNING */}
      <div className="p-10 rounded-[3rem] bg-amber-500/[0.03] border border-amber-500/10 flex flex-col md:flex-row items-center gap-8 shadow-inner">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
          <ShieldAlert className="w-8 h-8 text-amber-500 animate-pulse" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h4 className="text-sm font-black uppercase text-amber-500 tracking-[0.4em]">Directive Tamper Alert</h4>
          <p className="text-[11px] font-bold text-amber-500/50 uppercase tracking-widest leading-relaxed italic">
            Alteration of sub-neural directives can lead to narrative fragmentation, character inconsistency, or complete system collapse. Unauthorized modification of 'Static_Logic' cores is strictly logged.
          </p>
        </div>
        <div className="px-6 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 text-[9px] font-black text-amber-500/60 uppercase tracking-widest">
          Auth_Level: 07
        </div>
      </div>
    </div>
  );
};



