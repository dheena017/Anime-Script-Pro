import React from 'react';
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, LucideIcon, TrendingUp, CheckCircle, BarChart3 } from 'lucide-react';
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

interface TemplateCardProps {
  template: Template;
  idx: number;
  handleUsePrompt: (prompt: string) => void;
  setShowTemplateDetails: (id: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  idx,
  handleUsePrompt,
  setShowTemplateDetails
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.05 }}
    >
      <Card className={cn(
        "h-full bg-gradient-to-br from-[#111318] to-[#0a0b0e] border transition-all duration-500 overflow-hidden group flex flex-col relative",
        template.border,
        template.shadow,
        "hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]"
      )}>
        {/* Thumbnail Preview */}
        {template.thumbnail && (
          <div className="relative h-40 overflow-hidden">
            <img 
              src={template.thumbnail} 
              alt={template.label} 
              className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-transparent to-transparent" />
            <div className="absolute top-4 left-4 z-20">
               <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-1 border shadow-lg", template.bg, template.border, template.color)}>
                 {template.category}
               </Badge>
            </div>
          </div>
        )}

        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.01)_0%,transparent_70%)] pointer-events-none group-hover:translate-x-10 group-hover:translate-y-10 transition-transform duration-1000" />
        
        <CardHeader className="p-6 pb-0 relative z-10">
          <div className="flex justify-between items-start mb-2">
            {!template.thumbnail && (
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border shadow-xl transition-transform group-hover:rotate-6", template.bg, template.border)}>
                <template.icon className={cn("w-5 h-5", template.color)} />
              </div>
            )}
            {template.stats && (
               <div className="flex gap-4 ml-auto">
                 <div className="text-right">
                   <p className="text-[8px] text-zinc-600 font-black uppercase tracking-tighter flex items-center gap-1 justify-end">
                     <TrendingUp className="w-2.5 h-2.5" /> Deployed
                   </p>
                   <p className="text-[10px] text-zinc-300 font-mono font-bold tracking-tighter">{template.stats.deployed}</p>
                 </div>
               </div>
            )}
          </div>
          <CardTitle className="text-xl font-black uppercase tracking-tighter text-white group-hover:text-cyan-400 transition-colors leading-tight">
            {template.label}
          </CardTitle>
          <CardDescription className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-wider leading-relaxed">
            {template.vibe}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 flex flex-col flex-1 relative z-10">
          <div className="flex flex-wrap gap-1.5 mb-6">
            {template.elements.map(el => (
              <span key={el} className="text-[8px] font-black uppercase px-2 py-0.5 bg-white/5 border border-white/5 text-zinc-400 rounded-sm italic group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-colors">
                #{el.replace(' ', '')}
              </span>
            ))}
          </div>

          {template.stats && (
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
                 <CheckCircle className="w-3 h-3 text-green-500" />
                 <div className="flex flex-col">
                   <span className="text-[7px] text-zinc-600 font-black uppercase tracking-widest">Success</span>
                   <span className="text-[9px] text-green-400 font-mono font-bold">{template.stats.success}</span>
                 </div>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
                 <BarChart3 className={cn("w-3 h-3", template.color)} />
                 <div className="flex flex-col">
                   <span className="text-[7px] text-zinc-600 font-black uppercase tracking-widest">Logic</span>
                   <span className={cn("text-[9px] font-mono font-bold", template.color)}>{template.stats.complexity}</span>
                 </div>
              </div>
            </div>
          )}

          <div className="mt-auto space-y-3">
            <Button 
              onClick={() => handleUsePrompt(template.prompt)}
              className={cn(
                "w-full h-11 bg-white text-black hover:bg-zinc-200 text-[11px] font-black uppercase tracking-[0.25em] transition-all relative overflow-hidden group/btn",
                "shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 translate-y-0 hover:-translate-y-1"
              )}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
              Deploy Blueprint <Zap className={cn("w-3.5 h-3.5 ml-2 transition-all group-hover/btn:scale-125", template.color.replace('text', 'fill'))} />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setShowTemplateDetails(template.id)}
              className="w-full text-[9px] text-zinc-500 hover:text-cyan-400 uppercase tracking-widest font-black h-8 group-hover:translate-x-1 transition-transform"
            >
              Examine Technical Specifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
