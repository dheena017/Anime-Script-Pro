import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, CheckCircle, BarChart3, Binary, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getIconComponent } from '@/hooks/useTemplates';

interface Template {
  id: string | number;
  category: string;
  label: string;
  icon: string;
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
  setShowTemplateDetails: (id: string | number) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  idx,
  handleUsePrompt,
  setShowTemplateDetails
}) => {
  const Icon = getIconComponent(template.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ 
        duration: 0.5,
        delay: idx * 0.05,
        ease: [0.23, 1, 0.32, 1]
      }}
      className="h-full"
    >
      <Card className="template-card group template-card-hover border-white/5">
        {/* Visual Header */}
        <div className="relative h-48 overflow-hidden bg-zinc-950">
          {template.thumbnail ? (
            <img 
              src={template.thumbnail} 
              alt={template.label} 
              className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-50 group-hover:scale-110 transition-all duration-1000"
            />
          ) : (
             <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Icon className={cn("w-32 h-32", template.color)} />
             </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          
          <div className="absolute top-6 left-6 z-20">
             <div className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md bg-black/40", template.color)}>
               {template.category}
             </div>
          </div>

          <div className="absolute bottom-4 left-6 z-20">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
                <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Neural_Ready</span>
             </div>
          </div>
        </div>

        <CardHeader className="px-8 pt-6 pb-0 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 bg-white/[0.02] shadow-2xl transition-all duration-500 group-hover:border-studio/30 group-hover:bg-studio/5")}>
              <Icon className={cn("w-5 h-5", template.color)} />
            </div>
            {template.stats && (
               <div className="text-right">
                  <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Architecture</p>
                  <p className="text-[10px] font-mono font-bold text-zinc-400">V{idx + 1}.0</p>
               </div>
            )}
          </div>
          <CardTitle className="template-title">
            {template.label}
          </CardTitle>
          <CardDescription className="template-vibe">
            {template.vibe}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8 flex flex-col flex-1 relative z-10">
          <div className="flex flex-wrap gap-2 mb-8">
            {template.elements.slice(0, 3).map(el => (
              <span key={el} className="template-element-tag">
                {el}
              </span>
            ))}
            {template.elements.length > 3 && (
               <span className="text-[7px] font-black text-zinc-700 flex items-center">+{template.elements.length - 3} MORE</span>
            )}
          </div>

          {template.stats && (
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="template-stat-box">
                 <Binary className="w-3.5 h-3.5 text-zinc-700 group-hover:text-studio transition-colors" />
                 <div className="flex flex-col">
                    <span className="template-stat-label">Logic</span>
                    <span className="template-stat-value text-zinc-400 uppercase">{template.stats.complexity}</span>
                 </div>
              </div>
              <div className="template-stat-box">
                 <Activity className="w-3.5 h-3.5 text-zinc-700 group-hover:text-studio transition-colors" />
                 <div className="flex flex-col">
                    <span className="template-stat-label">Stability</span>
                    <span className="template-stat-value text-zinc-400 uppercase">98%</span>
                 </div>
              </div>
            </div>
          )}

          <div className="mt-auto space-y-3">
            <Button 
              onClick={() => handleUsePrompt(template.prompt)}
              className="template-deploy-btn group/btn"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
              <Zap className={cn("w-3.5 h-3.5 mr-2", template.color)} />
              DEPLOY BLUEPRINT
            </Button>
            <button 
              onClick={() => setShowTemplateDetails(template.id)}
              className="w-full text-[8px] text-zinc-600 hover:text-studio uppercase tracking-[0.3em] font-black py-2 transition-all flex items-center justify-center gap-2"
            >
              EXAMINE_TECHNICAL_SPECS
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
