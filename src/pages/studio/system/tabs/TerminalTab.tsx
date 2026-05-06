import React, { useState } from 'react';
import { Terminal as TerminalIcon, ChevronRight, Zap, Shield, Cpu } from 'lucide-react';

export const TerminalTab: React.FC = () => {
  const [history, setHistory] = useState<string[]>([
    "AUTHENTICATING USER...",
    "ACCESS GRANTED: [LOCAL-USER-ID]",
    "SYSTEM NODES: OPERATIONAL",
    "ESTABLISHING NEURAL UPLINK...",
    "READY FOR COMMANDS."
  ]);
  const [input, setInput] = useState("");

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    
    setHistory([...history, `> ${input.toUpperCase()}`, `EXECUTING: ${input.toUpperCase()}...`, `ERROR: [PROTOCOL_UNREACHABLE] - NODE PERMISSION REQUIRED.`]);
    setInput("");
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Terminal Window */}
        <div className="bg-black border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_30px_60px_-10px_rgba(0,0,0,0.8)] border-[#bd4a4a]/20">
          <div className="bg-zinc-900/50 border-b border-white/5 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Terminal Uplink // v4.0.2</span>
            </div>
            <div className="flex items-center gap-2">
               <Zap className="w-3.5 h-3.5 text-[#bd4a4a] animate-pulse" />
               <span className="text-[8px] font-black text-[#bd4a4a] uppercase tracking-widest">Live Link</span>
            </div>
          </div>

          <div className="p-8 font-mono text-[11px] space-y-2 h-[450px] overflow-y-auto scrollbar-hide bg-black/40 terminal-overlay">
            {history.map((line, i) => (
              <div key={i} className={line.startsWith('>') ? "text-[#bd4a4a]" : line.startsWith('ERROR') ? "text-red-500" : "text-emerald-500/80"}>
                {line}
              </div>
            ))}
            <div className="flex items-center gap-2 text-white">
              <ChevronRight className="w-4 h-4 text-[#bd4a4a]" />
              <form onSubmit={handleCommand} className="flex-1">
                <input 
                  type="text" 
                  autoFocus
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white placeholder-zinc-800"
                  placeholder="TYPE PROTOCOL COMMAND..."
                />
              </form>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
           <div className="bg-zinc-950 border border-white/5 p-8 rounded-[2rem] space-y-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Command Protocols</h3>
              {[
                { cmd: "/SYNC-CAST", desc: "Forced character re-sync", icon: Shield },
                { cmd: "/PURGE-CACHE", desc: "Clear neural buffers", icon: Cpu },
                { cmd: "/BOOT-ENGINE", desc: "Restart production cycle", icon: Zap },
              ].map(p => (
                <div key={p.cmd} className="flex items-start gap-4 group">
                  <div className="p-2.5 bg-zinc-900 rounded-xl border border-white/5 group-hover:border-[#bd4a4a]/30 transition-colors">
                    <p.icon className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#bd4a4a]" />
                  </div>
                  <div className="space-y-0.5">
                    <code className="text-[10px] font-black text-white uppercase tracking-widest">{p.cmd}</code>
                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{p.desc}</p>
                  </div>
                </div>
              ))}
           </div>

           <div className="bg-[#bd4a4a]/5 border border-[#bd4a4a]/20 p-8 rounded-[2rem]">
              <div className="flex items-center gap-4 mb-4">
                 <TerminalIcon className="w-5 h-5 text-[#bd4a4a]" />
                 <h4 className="text-[10px] font-black text-white uppercase tracking-widest">User Authentication</h4>
              </div>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                 All commands are logged via the global ledger. Unauthorized node access will trigger a system-wide lockdown.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalTab;
