import React from 'react';
import { Layout, Brain, Smartphone, Lock, Sparkles, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const VaultView: React.FC = () => {
  return (
    <div className="vault-container">
       <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,var(--studio-primary)_0%,transparent_70%)] group-hover:opacity-[0.05] transition-opacity duration-1000" />
       
       <div className="relative">
         <div className="vault-icon-circle">
            <Lock className="w-12 h-12 text-studio/30 group-hover:text-studio group-hover:rotate-6 transition-all duration-700" />
         </div>
         <div className="absolute -top-3 -right-3 p-3 bg-studio/10 rounded-2xl border border-studio/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-bounce-slow">
            <Fingerprint className="w-5 h-5 text-studio" />
         </div>
       </div>

       <div className="space-y-6 max-w-lg px-6 relative z-10">
         <div className="vault-badge">
           Private Encryption Layer
         </div>
         <h3 className="vault-title">The Private Vault</h3>
         <p className="vault-desc">
           Secure your custom prompt architectures and personal blueprints in an encrypted personal library. Advanced prompt versioning and variable support coming in <span className="text-studio font-black">Studio v2.0</span>.
         </p>
       </div>

       <Button className="vault-btn">
         Authorize Vault Access
       </Button>

       <div className="grid grid-cols-3 gap-16 pt-12 opacity-10 group-hover:opacity-40 transition-opacity duration-1000">
          <div className="flex flex-col items-center gap-4">
            <Layout className="w-6 h-6 text-studio" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">Modular</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Brain className="w-6 h-6 text-studio" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">Neural</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Smartphone className="w-6 h-6 text-studio" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">Sync</span>
          </div>
       </div>
    </div>
  );
};
