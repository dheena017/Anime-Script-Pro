import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ImageIcon, 
  Sparkles, 
  GripVertical, 
  Wand2, 
  Edit2, 
  X, 
  Save, 
  Zap 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Scene {
  id: string;
  originalIndex: number;
  section: string;
  narration: string;
  visuals: string;
  sound: string;
  duration: string;
}

interface SceneCardProps {
  scene: Scene;
  index: number;
  visualData: Record<number, string>;
  editingSceneId: string | null;
  editForm: Partial<Scene>;
  isEnhancingNarration: boolean;
  isEnhancing: boolean;
  isRewritingTension: boolean;
  setEditForm: React.Dispatch<React.SetStateAction<Partial<Scene>>>;
  handleGenerateVisual: (idx: number, visuals: string) => void;
  startEditing: (scene: Scene) => void;
  cancelEditing: () => void;
  saveSceneEdits: () => void;
  handleEnhanceNarration: () => void;
  handleEnhanceVisuals: () => void;
  handleRewriteTension: () => void;
  suggestDuration: (narration: string) => Promise<string>;
  dragHandleProps?: any;
  draggableProps?: any;
  innerRef?: (element: HTMLElement | null) => void;
  isDragging?: boolean;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  index,
  visualData,
  editingSceneId,
  editForm,
  isEnhancingNarration,
  isEnhancing,
  isRewritingTension,
  setEditForm,
  handleGenerateVisual,
  startEditing,
  cancelEditing,
  saveSceneEdits,
  handleEnhanceNarration,
  handleEnhanceVisuals,
  handleRewriteTension,
  suggestDuration,
  dragHandleProps,
  draggableProps,
  innerRef,
  isDragging
}) => {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      style={{
        ...draggableProps?.style,
        opacity: isDragging ? 0.8 : 1,
      }}
    >
      <Card className={cn(
        "bg-gradient-to-br from-[#111318] to-[#0a0b0e] border transition-all duration-500 overflow-hidden group hover:scale-[1.02]",
        isDragging 
          ? "border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.3)] scale-[1.02] z-50 relative" 
          : "border-zinc-800 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]"
      )}>
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
        
        {/* Scene Image Area */}
        <div className="aspect-video bg-zinc-950/50 flex items-center justify-center border-b border-white/5 relative overflow-hidden z-10">
          {visualData[scene.originalIndex] === 'loading' ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              <p className="text-[9px] text-cyan-400 uppercase tracking-widest font-medium">Generating Frame...</p>
            </div>
          ) : visualData[scene.originalIndex] ? (
            <img 
              src={visualData[scene.originalIndex]} 
              alt={`Scene ${index + 1}`} 
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="p-6 text-center">
              <ImageIcon className="w-10 h-10 mx-auto mb-3 text-zinc-800" />
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-medium">Awaiting Visual Generation</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4 h-8 text-[10px] text-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10 uppercase tracking-wider font-semibold transition-all"
                onClick={() => handleGenerateVisual(scene.originalIndex, scene.visuals)}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Generate Visual
              </Button>
            </div>
          )}

          {/* Scene Label & Drag Handle */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-cyan-500/30 text-cyan-100 text-[9px] font-bold px-2.5 py-1.5 rounded shadow-[0_0_10px_rgba(6,182,212,0.2)] flex items-center gap-1.5 uppercase tracking-widest">
            <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing mr-1">
              <GripVertical className="w-3.5 h-3.5 opacity-70 hover:opacity-100 transition-opacity text-cyan-400" />
            </div>
            Scene {String(index + 1).padStart(2, '0')}
          </div>

          {visualData[scene.originalIndex] && visualData[scene.originalIndex] !== 'loading' && (
            <button 
              onClick={() => handleGenerateVisual(scene.originalIndex, scene.visuals)}
              className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md border border-cyan-500/30 hover:bg-cyan-600 hover:border-cyan-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              title="Regenerate Visual"
            >
              <Wand2 className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <p className="text-[10px] text-zinc-200 font-semibold uppercase tracking-widest line-clamp-1">{scene.section}</p>
          </div>
        </div>

        {/* Scene Content Area */}
        <div className="p-5 space-y-4 relative z-10">
          {editingSceneId === scene.id ? (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Section</label>
                <Input 
                  value={editForm.section || ''} 
                  onChange={(e) => setEditForm({...editForm, section: e.target.value})}
                  className="h-8 text-xs bg-black/50 border-white/10 focus-visible:ring-cyan-500/50"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Narration</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2.5 text-[9px] text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 uppercase tracking-wider font-bold"
                    onClick={handleEnhanceNarration}
                    disabled={isEnhancingNarration}
                  >
                    {isEnhancingNarration ? (
                      <div className="w-3 h-3 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mr-1.5" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1.5" />
                    )}
                    {isEnhancingNarration ? 'Enhancing...' : 'Enhance'}
                  </Button>
                </div>
                <Textarea 
                  value={editForm.narration || ''} 
                  onChange={(e) => setEditForm({...editForm, narration: e.target.value})}
                  className="min-h-[60px] text-sm font-serif bg-black/50 border-white/10 resize-none focus-visible:ring-cyan-500/50 leading-relaxed"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Visual/Scene Description</label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2.5 text-[9px] text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 uppercase tracking-wider font-bold"
                      onClick={handleEnhanceVisuals}
                      disabled={isEnhancing}
                    >
                      {isEnhancing ? (
                        <div className="w-3 h-3 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mr-1.5" />
                      ) : (
                        <Sparkles className="w-3 h-3 mr-1.5" />
                      )}
                      {isEnhancing ? 'Enhancing...' : 'Enhance'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2.5 text-[9px] text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 uppercase tracking-wider font-bold"
                      onClick={handleRewriteTension}
                      disabled={isRewritingTension}
                    >
                      {isRewritingTension ? (
                        <div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mr-1.5" />
                      ) : (
                        <Zap className="w-3 h-3 mr-1.5" />
                      )}
                      {isRewritingTension ? 'Rewriting...' : 'Make Tense'}
                    </Button>
                  </div>
                </div>
                <Textarea 
                  value={editForm.visuals || ''} 
                  onChange={(e) => setEditForm({...editForm, visuals: e.target.value})}
                  className="min-h-[60px] text-xs font-mono bg-black/50 border-white/10 resize-none focus-visible:ring-purple-500/50 leading-relaxed"
                  placeholder="e.g., Medium shot, character walks into a dimly lit room, light catching dust particles in the air"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Sound</label>
                <Input 
                  value={editForm.sound || ''} 
                  onChange={(e) => setEditForm({...editForm, sound: e.target.value})}
                  className="h-8 text-xs font-mono bg-black/50 border-white/10 focus-visible:ring-blue-500/50"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Duration</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2.5 text-[9px] text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 uppercase tracking-wider font-bold"
                    onClick={async () => {
                      const suggested = await suggestDuration(editForm.narration || '');
                      setEditForm(prev => ({ ...prev, duration: suggested }));
                    }}
                  >
                    <Sparkles className="w-3 h-3 mr-1.5" /> Suggest
                  </Button>
                </div>
                <Input 
                  value={editForm.duration || ''} 
                  onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                  className="h-8 text-xs font-mono bg-black/50 border-white/10 focus-visible:ring-emerald-500/50"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-white/5 mt-4">
                <Button variant="ghost" size="sm" onClick={cancelEditing} className="h-8 text-[10px] uppercase tracking-wider font-bold hover:bg-white/5">
                  <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
                </Button>
                <Button variant="default" size="sm" onClick={saveSceneEdits} className="h-8 text-[10px] uppercase tracking-wider font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Save className="w-3.5 h-3.5 mr-1.5" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1 flex-1 pr-4">
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Narration</h4>
                  <p className="text-sm text-zinc-200 font-serif leading-relaxed italic line-clamp-2">"{scene.narration}"</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => startEditing(scene)}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              
              <div className="space-y-1.5 bg-black/20 p-3 rounded-lg border border-white/5">
                <h4 className="text-[9px] font-bold text-purple-400/80 uppercase tracking-widest flex items-center gap-1.5">
                  <ImageIcon className="w-3 h-3" /> Visual/Scene Description
                </h4>
                <p className="text-xs text-zinc-400 font-mono leading-relaxed line-clamp-2">{scene.visuals}</p>
              </div>

              <div className="space-y-1.5 bg-black/20 p-3 rounded-lg border border-white/5">
                <h4 className="text-[9px] font-bold text-blue-400/80 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Sound & BGM
                </h4>
                <p className="text-xs text-zinc-400 font-mono leading-relaxed line-clamp-1">{scene.sound}</p>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 mt-2">
                <span className="opacity-70">Duration:</span>
                <span className="text-cyan-400">{scene.duration}</span>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
