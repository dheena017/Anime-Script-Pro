import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Image as ImageIcon, Play, Speaker, X, Sparkles, Layout, ScanLine, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SceneViewProps {
  scene: any | null;
  index?: number;
  onClose?: () => void;
  onRegenerate?: (index?: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  totalScenes?: number;
}

export const SceneView: React.FC<SceneViewProps> = ({ scene, index, onClose, onRegenerate, onNext, onPrev, totalScenes }) => {
  if (!scene) {
    return (
      <Card className="p-12 bg-[#040404]/60 backdrop-blur-xl border border-white/5 rounded-[3rem] text-center flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-center">
            <Layout className="w-8 h-8 text-zinc-800" />
        </div>
        <p className="text-zinc-600 font-black uppercase text-xs tracking-[0.4em]">Initialize production unit inspection</p>
      </Card>
    );
  }

  const narration = scene?.sceneOutput?.narration || scene?.summary || '';
  const visuals = scene?.sceneOutput?.visuals || '';
  const sound = scene?.sceneOutput?.sound || '';
  const thumbnails = scene?.imagePrompts || [];

  return (
    <Card className="relative overflow-hidden bg-[#060606]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-studio/5 via-transparent to-transparent opacity-50" />
      
      <div className="relative z-10 p-10 space-y-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-studio/10 border border-studio/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-studio" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                        {scene?.scene_id || `Scene ${index}`}
                    </h3>
                    <p className="text-xs text-zinc-500 font-black uppercase tracking-[0.3em]">Module Synthesis Active</p>
                </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/5 border border-white/5 p-1 rounded-xl mr-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={!onPrev || (index !== undefined && index <= 1)}
                onClick={onPrev}
                className="w-8 h-8 rounded-lg text-zinc-500 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-2 text-xs font-black text-zinc-600 uppercase tracking-widest">
                {index} / {totalScenes || '?'}
              </span>
              <Button
                variant="ghost"
                size="icon"
                disabled={!onNext || (index !== undefined && totalScenes !== undefined && index >= totalScenes)}
                onClick={onNext}
                className="w-8 h-8 rounded-lg text-zinc-500 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-8">
            <div className="p-8 bg-black/40 border border-white/5 rounded-[2rem] space-y-4">
                <h4 className="text-xs font-black text-studio uppercase tracking-[0.4em] flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
                    Narrative Scripting & Subtext
                </h4>
                <p className="text-zinc-300 text-sm leading-relaxed font-medium italic">
                    "{narration}"
                </p>
                {scene?.psychological_stakes && (
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-xs text-studio/60 font-black uppercase tracking-widest mb-1">Psychological Stakes</p>
                    <p className="text-zinc-500 text-xs leading-relaxed italic">{scene.psychological_stakes}</p>
                  </div>
                )}
            </div>

            {scene?.script_dialogue_teaser && (
              <div className="p-8 bg-studio/5 border border-studio/20 rounded-[2rem] space-y-4">
                  <h4 className="text-xs font-black text-studio uppercase tracking-[0.4em] flex items-center gap-3">
                      Dialogue Preview
                  </h4>
                  <p className="text-studio/90 text-sm leading-relaxed font-mono whitespace-pre-wrap">
                      {scene.script_dialogue_teaser}
                  </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 hover:border-fuchsia-500/20 transition-all group/box">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest group-hover/box:text-fuchsia-400">Visual DNA & Framing</h4>
                        <ImageIcon className="w-3.5 h-3.5 text-zinc-700" />
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed font-medium">{visuals || scene?.visual_direction}</p>
                    {scene?.shot_list_preview && (
                      <ul className="mt-3 space-y-1.5">
                        {scene.shot_list_preview.map((shot: string, i: number) => (
                          <li key={i} className="text-xs text-zinc-500 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-fuchsia-500/40" />
                            {shot}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>

                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 hover:border-emerald-500/20 transition-all group/box">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest group-hover/box:text-emerald-400">Audio Forge & VA Guidance</h4>
                        <Speaker className="w-3.5 h-3.5 text-zinc-700" />
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed font-medium">{sound || scene?.audio_direction}</p>
                    {scene?.voice_acting_notes && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-xs text-emerald-400/60 font-black uppercase tracking-widest mb-1">VA Direction</p>
                        <p className="text-zinc-500 text-xs leading-relaxed italic">{scene.voice_acting_notes}</p>
                      </div>
                    )}
                </div>
            </div>

            {scene?.production_stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Cast', val: scene.production_stats.cast_count, color: 'text-blue-400' },
                  { label: 'Extras', val: scene.production_stats.extra_count, color: 'text-zinc-400' },
                  { label: 'Stunts', val: scene.production_stats.stunt_required ? 'YES' : 'NO', color: scene.production_stats.stunt_required ? 'text-red-400' : 'text-zinc-600' },
                  { label: 'VFX Difficulty', val: `${scene.production_stats.animation_difficulty_score || '3'}/5`, color: 'text-amber-400' }
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl text-center space-y-1">
                    <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">{stat.label}</p>
                    <p className={cn("text-sm font-black tracking-tight", stat.color)}>{stat.val}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <ScanLine className="w-3.5 h-3.5" /> Thumnails & Previews
                    </h4>
                    <span className="text-xs font-black text-zinc-700 uppercase tracking-widest">Unit Data v1.0.4</span>
                </div>
                <ScrollArea className="w-full">
                    <div className="flex gap-4 pb-4">
                        {Array.isArray(thumbnails) && thumbnails.length > 0 ? (
                            thumbnails.map((t: string, i: number) => (
                                <div 
                                    key={i} 
                                    className="w-48 h-28 bg-black/60 border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center group/thumb relative shrink-0"
                                >
                                    <div className="absolute inset-0 bg-studio/10 opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                                    <ImageIcon className="w-8 h-8 text-zinc-800 group-hover:text-studio/40 transition-colors" />
                                </div>
                            ))
                        ) : (
                            <div className="w-full h-28 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-xs font-black text-zinc-700 uppercase tracking-widest">
                                Resource Matrix Empty
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-wrap gap-4">
            <Button size="lg" className="flex-1 h-14 bg-studio text-black font-black uppercase tracking-widest rounded-2xl hover:bg-studio/80 transition-all shadow-studio">
                <Play className="w-4 h-4 mr-3" /> Execute Production
            </Button>
            <Button size="lg" variant="outline" onClick={() => onRegenerate?.(index)} className="flex-1 h-14 bg-black/40 border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all">
                <Sparkles className="w-4 h-4 mr-3 text-studio" /> Regenerate Data
            </Button>
        </div>
      </div>
    </Card>
  );
};

export default SceneView;
