import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, RefreshCw, Clock, Users, Activity, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SceneCardProps {
  scene: any;
  index: number;
  onSelect?: (index: number) => void;
  onRegenerate?: (index: number) => void;
  isActive?: boolean;
}

/**
 * SceneCard - The Technical HUD
 * A granular production unit card that highlights technical subtext.
 */
export const SceneCard: React.FC<SceneCardProps> = ({ scene, index, onSelect, onRegenerate, isActive }) => {
  const title = scene?.scene_id || `Sequence ${index}`;
  const summary = scene?.summary || scene?.sceneOutput?.narration || 'Narrative subtext pending synthesis...';
  const characters = scene?.character_focus || [];
  const mins = scene?.estimated_minutes || scene?.sceneOutput?.estimated_minutes || '';

  return (
    <div className="h-full">

      <Card className={cn(
        "p-6 bg-[#050505]/60 backdrop-blur-xl border transition-all duration-700 rounded-[2.5rem] group h-full flex flex-col justify-between relative overflow-hidden",
        isActive 
          ? "border-studio shadow-[0_0_40px_rgba(6,182,212,0.15)] bg-studio/[0.02]" 
          : "border-white/5 hover:border-studio/30"
      )}>
        
        {/* Holographic Subtle Glow */}
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity duration-1000",
          isActive ? "bg-studio/20 opacity-100" : "bg-studio/10 opacity-0 group-hover:opacity-100"
        )} />

        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex flex-col items-center justify-center border transition-all duration-500",
                isActive 
                  ? "bg-studio border-studio text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" 
                  : "bg-black border-white/10 text-zinc-500 group-hover:border-studio/50 group-hover:text-studio"
              )}>
                <span className="text-xs font-black uppercase tracking-widest opacity-60">Unit</span>
                <span className="font-black text-lg leading-none">{index}</span>
              </div>
              <div>
                <h4 className={cn(
                  "text-xs font-black uppercase tracking-widest transition-colors",
                  isActive ? "text-studio" : "text-white"
                )}>
                  {title}
                </h4>
                <div className="flex items-center gap-3 mt-1.5">
                   <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-zinc-600" />
                      <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                        {mins ? `${mins}m` : 'TBD'}
                      </span>
                   </div>
                   <div className="w-1 h-1 rounded-full bg-zinc-800" />
                   <div className="flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-zinc-600" />
                      <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                        Act {scene.act || 1}
                      </span>
                   </div>
                </div>
              </div>
            </div>
            {isActive && <Activity className="w-4 h-4 text-studio animate-pulse" />}
          </div>

          <div className="relative">
             <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-studio/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <p className="text-[12px] text-zinc-400 font-medium leading-relaxed pl-4 line-clamp-3 group-hover:text-zinc-200 transition-colors">
               <span className="text-studio/60 font-black mr-2 tracking-tighter">SYNOPSIS:</span>
               "{summary}"
             </p>
          </div>

          {characters?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {characters.slice(0, 3).map((c: string, i: number) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-xs font-black text-zinc-500 uppercase tracking-widest group-hover:border-studio/20 group-hover:text-studio/60 transition-all">
                  <div className="w-1 h-1 rounded-full bg-studio/40" />
                  {c}
                </div>
              ))}
              {characters.length > 3 && (
                <div className="px-2 py-1.5 text-xs font-black text-zinc-700 uppercase tracking-widest">+{characters.length - 3} Units</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/5 relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => onSelect?.(index)}
            className={cn(
              "flex-1 h-12 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all",
              isActive 
                ? "bg-studio text-black hover:bg-studio/80" 
                : "bg-white/5 text-zinc-500 hover:bg-studio/10 hover:text-studio"
            )}
          >
            <Play className={cn("w-4 h-4 mr-2", isActive ? "fill-black" : "opacity-40")} />
            Inspect Unit
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => onRegenerate?.(index)}
            className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 hover:text-studio transition-all"
          >
            <RefreshCw className="w-4 h-4 opacity-40 hover:opacity-100" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SceneCard;
