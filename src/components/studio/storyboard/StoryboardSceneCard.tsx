import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock3,
  Edit2,
  GripVertical,
  Image as ImageIcon,
  Maximize2,
  MessageSquare,
  Music,
  Pause,
  PlayCircle,
  Plus,
  PlusCircle,
  Tag,
  Trash2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import type { Scene, ViewMode } from './types';

interface StoryboardSceneCardProps {
  scene: Scene;
  idx: number;
  viewMode: ViewMode;
  isDragging: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  visualData: Record<string, string>;
  sceneStatus: Record<string, string>;
  directorsNotes: Record<string, string>;
  alternateTakes: Record<string, Scene[]>;
  editingSceneId: string | null;
  editForm: Partial<Scene>;
  playingAudioId: string | null;
  calculateDuration: (narration: string) => number;
  getStatusColor: (status: string) => string;
  highlightNarrative: (text: string) => React.ReactNode;
  onGenerateVisual: (sceneId: string, description: string) => void;
  onGenerateBGM: (sceneId: string, soundDescription: string) => void;
  onSetSelectedImage: (value: { src: string; scene: number } | null) => void;
  onDeleteScene: (id: string) => void;
  onStartEditing: (scene: Scene) => void;
  onStatusChange: (sceneId: string, status: string) => void;
  onAddAlternateTake: (sceneId: string) => void;
  onSwapAlternateTake: (sceneId: string, takeIndex: number, sceneIndex: number) => void;
  onEditFormChange: (value: Partial<Scene>) => void;
  onDirectorsNoteChange: (sceneId: string, note: string) => void;
  onCancelEditing: () => void;
  onSaveSceneEdits: () => void;
  onPlayAudio: (scene: Scene) => void;
  onAddScene: (index: number) => void;
}

export function StoryboardSceneCard({
  scene,
  idx,
  viewMode,
  isDragging,
  dragHandleProps,
  visualData,
  sceneStatus,
  directorsNotes,
  alternateTakes,
  editingSceneId,
  editForm,
  playingAudioId,
  calculateDuration,
  getStatusColor,
  highlightNarrative,
  onGenerateVisual,
  onGenerateBGM,
  onSetSelectedImage,
  onDeleteScene,
  onStartEditing,
  onStatusChange,
  onAddAlternateTake,
  onSwapAlternateTake,
  onEditFormChange,
  onDirectorsNoteChange,
  onCancelEditing,
  onSaveSceneEdits,
  onPlayAudio,
  onAddScene,
}: StoryboardSceneCardProps) {
  return (
    <div className="relative group">
      <Card className={`bg-zinc-900/50 border-zinc-800 overflow-hidden transition-all duration-500 ${isDragging ? 'scale-[1.02] ring-4 ring-red-500/40 z-50 shadow-2xl' : 'hover:border-red-500/30'} ${viewMode === 'present' ? 'max-w-5xl mx-auto' : ''} rounded-2xl`}>
        <div className="flex flex-col md:flex-row min-h-[400px]">
          <div className="md:w-[45%] relative bg-zinc-950/60 border-r border-zinc-800 overflow-hidden">
            <AnimatePresence mode="wait">
              {visualData[scene.id] === 'loading' ? (
                <div key="load" className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-950">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-red-500/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <span className="text-[10px] text-red-500 uppercase tracking-[0.2em] font-black">Rendering</span>
                </div>
              ) : visualData[scene.id] ? (
                <motion.img key="img" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={visualData[scene.id]} />
              ) : (
                <div key="none" className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-zinc-950">
                  <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-6"><ImageIcon className="w-8 h-8 text-zinc-700" /></div>
                  <Button variant="ghost" size="sm" className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 h-10 px-6 rounded-full border border-red-500/20" onClick={() => onGenerateVisual(scene.id, scene.visuals)}>Generate Concept</Button>
                </div>
              )}
            </AnimatePresence>

            <div className="absolute top-6 left-6 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div {...dragHandleProps} className="bg-black/80 backdrop-blur-xl p-2 rounded-xl border border-white/10 shadow-xl cursor-grab active:cursor-grabbing hover:bg-red-500 hover:text-white transition-colors"><GripVertical className="w-4 h-4" /></div>
                <div className="bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl uppercase tracking-tighter">SCENE {idx + 1}</div>
              </div>
              <div className="bg-black/60 backdrop-blur-xl text-zinc-300 text-[9px] font-black px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 w-fit uppercase tracking-widest"><Clock3 className="w-3.5 h-3.5 text-zinc-500" /> {calculateDuration(scene.narration)}s</div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-8 gap-4">
              <Tooltip><TooltipTrigger><Button variant="secondary" size="icon" className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-2xl hover:bg-white hover:text-black border border-white/20 transition-all hover:-translate-y-1 active:scale-95" onClick={() => onSetSelectedImage({ src: visualData[scene.id], scene: idx + 1 })}><Maximize2 className="w-6 h-6" /></Button></TooltipTrigger><TooltipContent>Fullscreen Preview</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger><Button variant="secondary" size="icon" className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-2xl hover:bg-blue-600 hover:text-white border border-white/20 transition-all hover:-translate-y-1 active:scale-95" onClick={() => onGenerateBGM(scene.id, scene.sound)}><Music className="w-6 h-6" /></Button></TooltipTrigger><TooltipContent>Generate Lyria BGM</TooltipContent></Tooltip>
            </div>
          </div>

          <div className="md:w-[55%] p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <Select value={sceneStatus[scene.id] || 'Draft'} onValueChange={(v) => onStatusChange(scene.id, v || 'Draft')}>
                  <SelectTrigger className={`h-8 px-4 text-[9px] font-black uppercase tracking-[0.1em] border-none rounded-full shadow-lg transition-all ${getStatusColor(sceneStatus[scene.id] || 'Draft')}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 rounded-2xl p-2">
                    <SelectItem value="Draft" className="text-[9px] uppercase font-bold py-2 rounded-xl">Draft</SelectItem>
                    <SelectItem value="Revision" className="text-[9px] uppercase font-bold py-2 rounded-xl text-amber-400">Revision</SelectItem>
                    <SelectItem value="Ready" className="text-[9px] uppercase font-bold py-2 rounded-xl text-purple-400">Ready</SelectItem>
                    <SelectItem value="Completed" className="text-[9px] uppercase font-bold py-2 rounded-xl text-green-400">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant="ghost" size="icon" onClick={() => onAddAlternateTake(scene.id)} className={`h-6 w-6 rounded-full transition-all ${alternateTakes[scene.id]?.length ? 'text-blue-400 bg-blue-400/10' : 'text-zinc-600 hover:text-white'}`}>
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add Alternate Take</TooltipContent>
                  </Tooltip>

                  {alternateTakes[scene.id]?.map((take, tIdx) => (
                    <Tooltip key={take.id}>
                      <TooltipTrigger>
                        <Button variant="ghost" size="sm" className="h-6 w-6 rounded-full p-0 text-[10px] font-black bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white" onClick={() => onSwapAlternateTake(scene.id, tIdx, idx)}>
                          {String.fromCharCode(66 + tIdx)}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Swap to Version {String.fromCharCode(66 + tIdx)}</TooltipContent>
                    </Tooltip>
                  ))}
                  {(!alternateTakes[scene.id] || alternateTakes[scene.id].length === 0) && (
                    <span className="text-[9px] px-2 font-black text-zinc-700 uppercase tracking-tighter">V.A</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <Button variant="ghost" size="icon" onClick={() => onDeleteScene(scene.id)} className="h-9 w-9 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onStartEditing(scene)} className="h-9 w-9 text-zinc-600 hover:text-white hover:bg-white/5 rounded-xl"><Edit2 className="w-4 h-4" /></Button>
              </div>
            </div>

            {editingSceneId === scene.id ? (
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Beat Name</label>
                    <Input value={editForm.section || ''} onChange={e => onEditFormChange({ ...editForm, section: e.target.value })} className="h-10 text-xs bg-black/60 border-white/5 rounded-xl focus:border-red-500/50 transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Soundscape</label>
                    <Input value={editForm.sound || ''} onChange={e => onEditFormChange({ ...editForm, sound: e.target.value })} className="h-10 text-xs bg-black/60 border-white/5 rounded-xl focus:border-blue-500/50 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Narration Script</label>
                  <Textarea value={editForm.narration || ''} onChange={e => onEditFormChange({ ...editForm, narration: e.target.value })} className="min-h-[120px] text-lg bg-black/60 border-white/5 font-serif italic rounded-2xl focus:border-red-500/30 p-5 leading-relaxed" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase flex items-center gap-2"><Tag className="w-3.5 h-3.5" /> Directing Note</label>
                  <Textarea value={directorsNotes[scene.id] || ''} onChange={e => onDirectorsNoteChange(scene.id, e.target.value)} placeholder="Note for the production crew..." className="min-h-[60px] text-[10px] bg-red-600/[0.03] border-red-500/10 placeholder:text-zinc-700 rounded-xl" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <Button variant="ghost" size="sm" onClick={onCancelEditing} className="text-[10px] uppercase font-black tracking-widest px-6 h-10 rounded-xl">Discard</Button>
                  <Button size="sm" onClick={onSaveSceneEdits} className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest px-8 h-10 rounded-xl shadow-lg shadow-red-900/20">Commit Changes</Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-8">
                  <div className="cursor-pointer group/audio pb-6 border-b border-white/5" onClick={() => onPlayAudio(scene)}>
                    <div className="flex items-center gap-2 mb-4 text-zinc-500">
                      {playingAudioId === scene.id ? <Pause className="w-4 h-4 text-red-500 animate-pulse" /> : <PlayCircle className="w-4 h-4 transition-colors group-hover/audio:text-red-500" />}
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Narration</span>
                      <Badge variant="outline" className="text-[9px] uppercase ml-auto bg-white/5 border-white/10 px-3 tracking-tighter">{scene.section}</Badge>
                    </div>
                    <p className="text-xl text-zinc-100 font-serif italic leading-[1.6] group-hover/audio:text-white transition-colors">{highlightNarrative(scene.narration)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon className="w-4 h-4 opacity-50" /> Frame Focus</h5>
                      <p className="text-xs text-zinc-500 leading-relaxed font-medium line-clamp-3">{scene.visuals}</p>
                    </div>
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><Music className="w-4 h-4 opacity-50" /> Audio Cue</h5>
                      <p className="text-xs text-zinc-500 leading-relaxed font-medium line-clamp-2">{scene.sound}</p>
                    </div>
                  </div>
                </div>

                {directorsNotes[scene.id] && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-red-600/[0.03] border-l-4 border-red-600 rounded-r-xl">
                    <p className="text-[10px] font-black text-red-500/80 uppercase mb-2 flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Director's Directive</p>
                    <p className="text-[11px] text-zinc-400 italic font-medium leading-relaxed">"{directorsNotes[scene.id]}"</p>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110">
        <Button variant="ghost" size="sm" onClick={() => onAddScene(idx + 1)} className="h-10 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl px-6 text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center gap-3">
          <PlusCircle className="w-4 h-4" /> Insert Frame
        </Button>
      </div>
    </div>
  );
}
