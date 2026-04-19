import React from 'react';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Layout, Music, Code, LucideIcon, TrendingUp, CheckCircle, BarChart3, Database, Globe, Cpu, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Template {
  id: string;
  category: string;
  label: string;
  icon: LucideIcon;
  thumbnail?: string;
  prompt: string;
  color: string;
  border: string;
  bg: string;
  shadow: string;
  description: string;
  elements: string[];
  vibe: string;
  stats?: { deployed: string; success: string; complexity: string };
}

interface TemplateDetailModalProps {
  template: Template;
  onClose: () => void;
  handleUsePrompt: (prompt: string) => void;
}

export const TemplateDetailModal: React.FC<TemplateDetailModalProps> = ({
  template,
  onClose,
  handleUsePrompt
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />
      <motion.div
        layoutId={`modal-${template.id}`}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-4xl bg-[#0a0b0e] border border-cyan-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_150px_rgba(6,182,212,0.3)] grid grid-cols-1 lg:grid-cols-2"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-[110] text-zinc-500 hover:text-white transition-all hover:rotate-90 bg-black/40 p-2 rounded-full border border-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Visual Preview Side */}
        <div className="relative h-64 lg:h-full overflow-hidden border-r border-cyan-500/10">
          <img 
            src={template.thumbnail} 
            alt={template.label} 
            className="w-full h-full object-cover animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0a0b0e]/20 to-[#0a0b0e]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-transparent to-transparent" />
          
          <div className="absolute bottom-10 left-10 space-y-4">
             <div className={cn("w-16 h-16 rounded-[2rem] flex items-center justify-center border-2 border-opacity-50 transition-all hover:scale-110 shadow-2xl backdrop-blur-md", template.bg, template.border)}>
               <template.icon className={cn("w-8 h-8", template.color)} />
             </div>
             <div>
               <Badge className="bg-cyan-500 text-white border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] text-[10px] uppercase font-black px-3 py-1 mb-2">
                 {template.category} Standard
               </Badge>
               <h3 className="text-4xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">{template.label}</h3>
             </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="p-10 space-y-10 overflow-y-auto max-h-[80vh] lg:max-h-none no-scrollbar">
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
               <Database className="w-4 h-4 text-cyan-500" /> Analytical Meta-Data
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                 <p className="text-[9px] text-zinc-600 font-bold uppercase">Usage</p>
                 <p className="text-sm text-zinc-200 font-mono font-bold">{template.stats?.deployed}</p>
                 <TrendingUp className="w-3 h-3 text-cyan-500/50" />
               </div>
               <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                 <p className="text-[9px] text-zinc-600 font-bold uppercase">Success</p>
                 <p className="text-sm text-green-400 font-mono font-bold">{template.stats?.success}</p>
                 <CheckCircle className="w-3 h-3 text-green-500/50" />
               </div>
               <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                 <p className="text-[9px] text-zinc-600 font-bold uppercase">Logic</p>
                 <p className={cn("text-sm font-mono font-bold", template.color)}>{template.stats?.complexity}</p>
                 <Cpu className={cn("w-3 h-3 opacity-50", template.color)} />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                 <Layout className="w-4 h-4 text-cyan-500" /> Technical Style
              </h4>
              <div className="space-y-2">
                 <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                   <span className="text-[10px] text-zinc-500 font-bold uppercase">Contrast</span>
                   <span className="text-xs text-white font-mono">High/Noir</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                   <span className="text-[10px] text-zinc-500 font-bold uppercase">Focus</span>
                   <span className="text-xs text-white font-mono">Character-Centric</span>
                 </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                 <Music className="w-4 h-4 text-fuchsia-500" /> Audio Matrix
              </h4>
              <div className="space-y-2">
                 <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                   <span className="text-[10px] text-zinc-500 font-bold uppercase">BGM</span>
                   <span className="text-xs text-white font-mono">Hybrid Synths</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                   <span className="text-[10px] text-zinc-500 font-bold uppercase">Mix</span>
                   <span className="text-xs text-white font-mono">Bass-Driven</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
               <Code className="w-4 h-4 text-orange-500" /> Embedded Directive
            </h4>
            <div className="p-8 bg-[#020202] rounded-3xl border border-zinc-800 shadow-inner group hover:border-cyan-500/30 transition-all">
              <p className="text-[13px] text-zinc-400 font-serif italic leading-relaxed group-hover:text-cyan-100 transition-colors duration-500">"{template.prompt}"</p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-[0.25em] h-14 rounded-full shadow-[0_15px_30px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1 active:scale-95"
              onClick={() => handleUsePrompt(template.prompt)}
            >
              Deploy Component <Zap className="w-4 h-4 ml-2 fill-orange-500 text-orange-500" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
