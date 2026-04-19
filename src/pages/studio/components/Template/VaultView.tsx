import React from 'react';
import { Plus, Layout, Brain, Smartphone, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const VaultView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] space-y-10 bg-[#050505]/50 border border-studio/10 rounded-[3rem] text-center relative overflow-hidden group">
       <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,var(--studio-primary)_0%,transparent_70%)] group-hover:opacity-[0.05] transition-opacity duration-1000" />
       
       <div className="relative">
         <div className="w-32 h-32 rounded-full bg-studio/5 flex items-center justify-center border border-studio/10 shadow-studio/10 group-hover:scale-110 transition-transform duration-700">
            <Lock className="w-12 h-12 text-studio/50 group-hover:text-studio group-hover:rotate-12 transition-all" />
         </div>
         <div className="absolute -top-2 -right-2 p-2 bg-studio/20 rounded-lg border border-studio/30 shadow-studio">
            <Sparkles className="w-4 h-4 text-studio" />
         </div>
       </div>

       <div className="space-y-4 max-w-lg px-6 relative z-10">
         <div className="inline-block px-3 py-1 bg-studio/10 border border-studio/30 rounded-full text-[10px] uppercase tracking-[0.3em] text-studio font-bold mb-2 shadow-studio/10">
           Private Encryption Layer
         </div>
         <h3 className="text-4xl font-black text-white uppercase tracking-tighter text-shadow-studio">The Private Vault</h3>
         <p className="text-sm text-zinc-500 leading-relaxed font-medium">
           Secure your custom prompt architectures and personal blueprints in an encrypted personal library. Advanced prompt versioning and variable support coming in <span className="text-studio font-bold">Studio v2.0</span>.
         </p>
       </div>

       <Button className="bg-[#0a0a0a] border border-studio/30 text-studio hover:bg-studio/10 hover:text-studio/80 font-black uppercase tracking-[0.25em] h-14 px-12 rounded-full shadow-studio active:scale-95 transition-all hover:-translate-y-1">
         Authorize Vault Access
       </Button>

       <div className="grid grid-cols-3 gap-12 pt-10 opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
          <div className="flex flex-col items-center gap-3">
            <Layout className="w-7 h-7 text-purple-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Modular</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Brain className="w-7 h-7 text-purple-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Neural</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Smartphone className="w-7 h-7 text-purple-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Sync</span>
          </div>
       </div>
    </div>
  );
};
