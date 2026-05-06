import React, { useState } from 'react';
import { 
  Video, 
  Globe, 
  X, 
  Zap, 
  ShieldCheck, 
  Send, 
  Activity, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
       setSubStatus('error');
       return;
    }

    setSubStatus('loading');
    // Simulate Neural Link established
    setTimeout(() => {
      setSubStatus('success');
      setEmail('');
      setTimeout(() => setSubStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#050505] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-studio/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* 1. BRAND & NEWSLETTER PROTOCOL */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-6">
              <a href="/" className="flex items-center gap-3 no-underline group">
                <div className="w-9 h-9 rounded-xl bg-studio flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-110 transition-transform">
                   <Zap className="w-5 h-5 text-black fill-black" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase text-white italic">
                  ANIME<span className="text-studio">SCRIPT</span> PRO
                </span>
              </a>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium uppercase tracking-tight">
                The world's first autonomous production engine for anime and manga. Engineered for the architects of the new digital age.
              </p>
            </div>

            {/* NEURAL UPDATES MODULE */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-studio">System Updates</h4>
              <form onSubmit={handleSubscribe} className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-studio/50 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500" />
                 <div className="relative flex gap-2">
                    <Input 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (subStatus === 'error') setSubStatus('idle');
                      }}
                      placeholder="ARCHITECT@STUDIO.IO"
                      className="bg-zinc-900/50 border-zinc-800 rounded-xl h-14 font-black uppercase tracking-widest text-[10px] focus:border-studio/50 transition-all pl-6"
                    />
                    <Button 
                      disabled={subStatus === 'loading'}
                      className="bg-studio text-black hover:bg-white h-14 px-6 rounded-xl transition-all shadow-2xl shrink-0"
                    >
                      {subStatus === 'loading' ? (
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                 </div>
                 
                 <AnimatePresence>
                   {subStatus === 'success' && (
                     <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 flex items-center gap-2 text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em]"
                     >
                        <CheckCircle2 className="w-3.5 h-3.5" /> System Link Established
                     </motion.div>
                   )}
                   {subStatus === 'error' && (
                     <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 flex items-center gap-2 text-red-500 text-[9px] font-black uppercase tracking-[0.2em]"
                     >
                        <AlertCircle className="w-3.5 h-3.5" /> Invalid Terminal Address
                     </motion.div>
                   )}
                 </AnimatePresence>
              </form>
            </div>

            <div className="flex items-center gap-4">
              {[Video, Globe, X].map((Icon, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center hover:border-studio/50 hover:bg-studio/10 hover:text-studio transition-all text-zinc-500 group"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. NAVIGATION GRIDS */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Platform Nodes</h4>
              <ul className="space-y-4">
                <li><a href="/anime" className="text-zinc-600 hover:text-studio text-[11px] font-black uppercase tracking-widest transition-all no-underline">Pro Studio Engine</a></li>
                <li><a href="/pricing" className="text-zinc-600 hover:text-studio text-[11px] font-black uppercase tracking-widest transition-all no-underline">Pricing Protocol</a></li>
                <li><a href="/community" className="text-zinc-600 hover:text-studio text-[11px] font-black uppercase tracking-widest transition-all no-underline">Social Hub</a></li>
                <li><a href="/library" className="text-zinc-600 hover:text-studio text-[11px] font-black uppercase tracking-widest transition-all no-underline">Asset Archives</a></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Academy</h4>
              <ul className="space-y-4">
                <li><a href="/tutorials" className="text-zinc-600 hover:text-studio text-[11px] font-black uppercase tracking-widest transition-all no-underline">Production Docs</a></li>
                <li><a href="https://youtube.com" target="_blank" className="text-zinc-600 hover:text-studio text-[11px] font-black uppercase tracking-widest transition-all no-underline">Youtube Guides</a></li>
                <li><a href="/api-reference" className="text-zinc-600 hover:text-studio text-[11px] font-black uppercase tracking-widest transition-all no-underline">API Interface</a></li>
                <li><a href="/lore-database" className="text-zinc-600 hover:text-studio text-[11px] font-black uppercase tracking-widest transition-all no-underline">World Oracle</a></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Support Node</h4>
              <ul className="space-y-4">
                <li><a href="/contact" className="text-zinc-600 hover:text-studio text-[11px] font-black uppercase tracking-widest transition-all no-underline">Terminal Support</a></li>
                <li><a href="/help" className="text-zinc-600 hover:text-studio text-[11px] font-black uppercase tracking-widest transition-all no-underline">Help Center</a></li>
                <li><a href="/system/status" className="text-zinc-600 hover:text-studio text-[11px] font-black uppercase tracking-widest transition-all no-underline">System Status</a></li>
                <li><a href="/terms" className="text-zinc-600 hover:text-studio text-[11px] font-black uppercase tracking-widest transition-all no-underline">Terms of Protocol</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. TERMINAL INFO BAR */}
        <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
             <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Verified Studio Engine</span>
             </div>
             <span className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.2em]">
                © 2026 AnimeScript Pro // Engineered by DeepMind Swarm
             </span>
          </div>

          <div className="flex items-center gap-12">
            <div className="hidden sm:flex items-center gap-3">
               <Activity className="w-4 h-4 text-zinc-800" />
               <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">Shard: Node-01-Global</span>
            </div>
            <Button 
              onClick={() => navigate('/login')} 
              className="h-14 px-10 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-studio hover:scale-105 transition-all shadow-3xl"
            >
              Initialize Sync
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};


