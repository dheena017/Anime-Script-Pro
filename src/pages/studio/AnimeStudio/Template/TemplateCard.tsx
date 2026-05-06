import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Binary, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getIconComponent } from '@/hooks/useTemplates';
import { templateStyles as s } from './templateStyles';

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
      <Card className={cn(s.card, s.cardHover, "group border-white/5")}>
        {/* Visual Header */}
        <div className={s.thumbnailBox}>
          {template.thumbnail ? (
            <img 
              src={template.thumbnail} 
              alt={template.label} 
            className={s.thumbnailImg}
            />
          ) : (
             <div className="absolute inset-0 flex items-center justify-center opacity-10">
             <Icon className={cn("w-32 h-32", template.color)} />
             </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          
          <div className="absolute top-6 left-6 z-20">
           <div className={cn(s.badge, "border border-white/10 backdrop-blur-md bg-black/40", template.color)}>
               {template.category}
             </div>
          </div>

          <div className="absolute bottom-4 left-6 z-20">
           <div className={s.readyRow}>
             <div className={s.readyDot} />
             <span className={s.readyText}>System_Ready</span>
             </div>
          </div>
        </div>

        <CardHeader className="px-8 pt-6 pb-0 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className={s.cardMetaBox}>
              <Icon className={cn("w-5 h-5", template.color)} />
            </div>
            {template.stats && (
               <div className="text-right">
                  <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Architecture</p>
                  <p className="text-[10px] font-mono font-bold text-zinc-400">V{idx + 1}.0</p>
               </div>
            )}
          </div>
          <CardTitle className={s.title}>
            {template.label}
          </CardTitle>
          <CardDescription className={s.vibe}>
            {template.vibe}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8 flex flex-col flex-1 relative z-10">
          <div className="flex flex-wrap gap-2 mb-8">
            {template.elements.slice(0, 3).map(el => (
              <span key={el} className={s.elementTag}>
                {el}
              </span>
            ))}
            {template.elements.length > 3 && (
               <span className={s.cardMoreText}>+{template.elements.length - 3} MORE</span>
            )}
          </div>

          {template.stats && (
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className={s.statBox}>
                 <Binary className="w-3.5 h-3.5 text-zinc-700 group-hover:text-studio transition-colors" />
                 <div className="flex flex-col">
                    <span className={s.statLabel}>Logic</span>
                    <span className={cn(s.statValue, "text-zinc-400 uppercase")}>{template.stats.complexity}</span>
                 </div>
              </div>
              <div className={s.statBox}>
                 <Activity className="w-3.5 h-3.5 text-zinc-700 group-hover:text-studio transition-colors" />
                 <div className="flex flex-col">
                    <span className={s.statLabel}>Stability</span>
                    <span className={cn(s.statValue, "text-zinc-400 uppercase")}>98%</span>
                 </div>
              </div>
            </div>
          )}

          <div className="mt-auto space-y-3">
            <Button 
              onClick={() => handleUsePrompt(template.prompt)}
              className={cn(s.deployBtn, "group/btn")}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
              <Zap className={cn("w-3.5 h-3.5 mr-2", template.color)} />
              DEPLOY BLUEPRINT
            </Button>
            <button 
              onClick={() => setShowTemplateDetails(template.id)}
              className={s.detailsButton}
            >
              EXAMINE_TECHNICAL_SPECS
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
