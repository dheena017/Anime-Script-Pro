import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Image, RefreshCw, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SceneCardProps {
  scene: any;
  index: number;
  onSelect?: (index: number) => void;
  onRegenerate?: (index: number) => void;
  isActive?: boolean;
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene, index, onSelect, onRegenerate, isActive }) => {
  const title = scene?.scene_id || `Scene ${index}`;
  const summary = scene?.summary || scene?.sceneOutput?.narration || 'No summary available.';
  const characters = scene?.character_focus || [];
  const mins = scene?.estimated_minutes || scene?.sceneOutput?.estimated_minutes || '';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="h-full"
    >
      <Card className={cn(
        "p-6 bg-[#060606]/60 backdrop-blur-md border transition-all duration-500 rounded-[2rem] group h-full flex flex-col justify-between",
        isActive ? "border-studio shadow-[0_0_30px_rgba(6,182,212,0.2)]" : "border-white/5 hover:border-studio/30"
      )}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors",
                isActive ? "bg-studio text-black" : "bg-white/5 text-zinc-500 group-hover:text-studio"
              )}>
                {index}
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">{title}</h4>
                <div className="flex items-center gap-2 mt-1">
                   <Clock className="w-3 h-3 text-zinc-600" />
                   <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{mins ? `${mins}m Estimated` : 'Duration Pending'}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 font-medium leading-relaxed line-clamp-3 group-hover:text-zinc-400 transition-colors italic">
            "{summary}"
          </p>

          {characters?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {characters.slice(0, 3).map((c: string, i: number) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[8px] font-black text-zinc-500 uppercase tracking-widest group-hover:border-studio/20 group-hover:text-studio/60 transition-all">
                  <Users className="w-2.5 h-2.5" />
                  {c}
                </div>
              ))}
              {characters.length > 3 && (
                <div className="px-2 py-1 text-[8px] font-black text-zinc-600 uppercase tracking-widest">+{characters.length - 3} More</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/5">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onSelect?.(index)}
            className="flex-1 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-studio hover:text-black transition-all"
          >
            <Play className="w-3.5 h-3.5 mr-2" />
            Inspect
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onRegenerate?.(index)}
            className="h-9 w-9 rounded-xl hover:text-studio"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default SceneCard;
