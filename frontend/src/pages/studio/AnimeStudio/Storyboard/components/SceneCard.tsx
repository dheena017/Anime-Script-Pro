import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ImageIcon,
  Sparkles,
  GripVertical,
  Wand2,
  Edit2,
  Zap,
  Maximize2,
  Film,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { storyboardStyles as s } from "../storyboardStyles";

interface Scene {
  id: string;
  originalIndex: number;
  section: string;
  narration: string;
  visuals: string;
  sound: string;
  duration: string;
  linkedPrompt?: string;
  videoPrompt?: string;
  soulFocus?: string;
  vfxCompounds?: string;
  emotionalKey?: string;
  subtext?: string;
  assets?: string;
}

interface SceneCardProps {
  scene: Scene;
  index: number;
  visualData: Record<number, string[]>;
  promptList: string[]; // Add this
  editingSceneId: string | null;
  editForm: Partial<Scene>;
  isEnhancingNarration: boolean;
  isEnhancing: boolean;
  isRewritingTension: boolean;
  isSuggestingDuration: boolean;
  setEditForm: React.Dispatch<React.SetStateAction<Partial<Scene>>>;
  handleGenerateVisual: (idx: number, visuals: string) => void;
  videoData?: Record<number, string>;
  handleGenerateVideo?: (idx: number, imageUrl: string, prompt: string) => void;
  startEditing: (scene: Scene) => void;
  cancelEditing: () => void;
  saveSceneEdits: () => void;
  handleEnhanceNarration: () => void;
  handleEnhanceVisuals: () => void;
  handleRewriteTension: () => void;
  handleSuggestDuration: () => void;
  dragHandleProps?: any;
  draggableProps?: any;
  innerRef?: (element: HTMLElement | null) => void;
  isDragging?: boolean;
  isBulkEnhancing?: boolean;
  handleManifestScene: (sceneId: string) => void;
  isManifestingScene?: boolean;
}

export const SceneCard = React.memo<SceneCardProps>(
  ({
    scene,
    index,
    visualData,
    promptList,
    editingSceneId,
    editForm,
    isEnhancingNarration,
    isEnhancing,
    isRewritingTension,
    isSuggestingDuration,
    setEditForm,
    handleGenerateVisual,
    videoData,
    handleGenerateVideo,
    startEditing,
    cancelEditing,
    saveSceneEdits,
    handleEnhanceNarration,
    handleEnhanceVisuals,
    handleRewriteTension,
    handleSuggestDuration,
    dragHandleProps,
    draggableProps,
    innerRef,
    isDragging,
    isBulkEnhancing,
    handleManifestScene,
    isManifestingScene,
  }) => {
    const navigate = useNavigate();
    return (
      <div
        ref={innerRef}
        {...draggableProps}
        style={{
          ...draggableProps?.style,
          opacity: isDragging ? 0.8 : 1,
        }}
        className="relative"
      >
        <Card
          className={cn(
            s.card.wrapper,
            isDragging ? s.card.dragging : s.card.normal,
            isBulkEnhancing && "border-studio/50 shadow-studio/10",
          )}
        >
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

          {isBulkEnhancing && (
            <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md z-[60] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
              <div className="w-12 h-12 border-4 border-studio/20 border-t-studio rounded-full animate-spin mb-6 shadow-studio" />
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-studio drop-shadow-studio mb-3">
                Architect Refining
              </h4>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em] leading-relaxed">
                Synthesizing advanced visual parameters...
              </p>
            </div>
          )}

          {isManifestingScene && (
            <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-xl z-[70] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-2 border-studio/10 border-t-studio rounded-full animate-[spin_3s_linear_infinite] shadow-[0_0_40px_rgba(6,182,212,0.2)]" />
                <div className="absolute inset-0 m-auto w-12 h-12 border-2 border-orange-500/10 border-b-orange-500 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
                <div className="absolute inset-0 m-auto w-4 h-4 bg-studio rounded-full animate-ping" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-[0.4em] text-white mb-4">
                Scene Manifestation
              </h4>
              <div className="space-y-2">
                <p className="text-xs text-studio font-black uppercase tracking-[0.3em] animate-pulse">
                  Processing Scene Data
                </p>
                <p className="text-xs text-zinc-600 font-bold uppercase tracking-[0.2em]">
                  Synchronizing Narration, Visuals & Audio
                </p>
              </div>
            </div>
          )}

          {/* Scene Image / Video Area */}
          <div className={s.card.imageArea}>
            {videoData?.[scene.originalIndex] &&
            videoData[scene.originalIndex] !== "loading" ? (
              <div className="relative w-full h-full">
                <video
                  src={videoData[scene.originalIndex]}
                  controls
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            ) : videoData?.[scene.originalIndex] === "loading" ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-studio/20 border-t-studio rounded-full animate-spin shadow-studio" />
                <p className="text-xs text-studio uppercase tracking-[0.3em] font-black animate-pulse">
                  Rendering Video...
                </p>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center">
                  <Film className="w-8 h-8 text-orange-400" />
                </div>
                <p className="text-xs text-zinc-600 uppercase tracking-[0.3em] font-bold mb-3">
                  No Scene Video
                </p>
                {handleGenerateVideo ? (
                  <Button
                    onClick={() => {
                      const currentVisuals =
                        visualData[scene.originalIndex] || [];
                      const imageUrl =
                        currentVisuals[0] && currentVisuals[0] !== "loading"
                          ? currentVisuals[0]
                          : undefined;
                      handleGenerateVideo(
                        scene.originalIndex,
                        imageUrl || "",
                        scene.linkedPrompt || scene.visuals || "",
                      );
                    }}
                    className="h-12 px-6 bg-orange-500 text-black font-black uppercase tracking-widest rounded-xl shadow-md"
                  >
                    <Film className="w-4 h-4 mr-2" /> Generate Video
                  </Button>
                ) : (
                  <p className="text-xs text-zinc-500">
                    Video generation is not available.
                  </p>
                )}
              </div>
            )}

            {/* Scene Label & Drag Handle */}
            <div className={s.card.labelBadge}>
              <div
                {...dragHandleProps}
                className="cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
              >
                <GripVertical className="w-4 h-4 text-studio opacity-60 hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-zinc-500">Scene</span>
              <span className="text-white font-mono">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Action Overlay */}
            <div className={s.card.actionOverlay}>
              <Button
                onClick={() =>
                  navigate(`/studio/storyboard/scenes/${scene.originalIndex}`)
                }
                className="bg-white text-black hover:bg-studio hover:text-black font-black uppercase tracking-widest text-xs h-10 px-6 rounded-xl shadow-2xl transition-all transform translate-y-4 group-hover:translate-y-0"
              >
                <Maximize2 className="w-3.5 h-3.5 mr-2" /> View Scene
              </Button>
              <Button
                onClick={() =>
                  handleGenerateVisual(
                    scene.originalIndex,
                    scene.linkedPrompt || scene.visuals,
                  )
                }
                variant="outline"
                className="bg-black/80 text-white border-white/20 hover:border-studio font-black uppercase tracking-widest text-xs h-10 px-6 rounded-xl shadow-2xl transition-all transform translate-y-4 group-hover:translate-y-0 delay-75"
              >
                <Wand2 className="w-3.5 h-3.5 mr-2" /> Regenerate Visual
              </Button>
              <Button
                onClick={() => handleManifestScene(scene.id)}
                variant="outline"
                className="bg-studio/10 text-studio border-studio/30 hover:bg-studio hover:text-black font-black uppercase tracking-widest text-xs h-10 px-6 rounded-xl shadow-2xl transition-all transform translate-y-4 group-hover:translate-y-0 delay-100"
              >
                <Zap className="w-3.5 h-3.5 mr-2" /> Manifest Scene
              </Button>
              {/* small overlay Generate Video removed; use image area control */}
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
              <div className="px-3 py-1.5 bg-[#050505]/80 backdrop-blur-md border border-white/10 rounded-xl inline-block shadow-2xl">
                <p className="text-xs text-zinc-300 font-black uppercase tracking-[0.2em]">
                  {scene.section}
                </p>
              </div>
            </div>
          </div>

          {/* Scene Content Area */}
          <div className={s.card.contentArea}>
            {editingSceneId === scene.id ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">
                    Section Protocol
                  </label>
                  <Input
                    value={editForm.section || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, section: e.target.value })
                    }
                    className="h-10 text-xs bg-white/[0.02] border-white/10 focus:border-studio/50 focus:bg-studio/[0.02] transition-all rounded-xl font-black uppercase tracking-widest text-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">
                      Narration Core
                    </label>
                    {/* Narration optimization removed */}
                  </div>
                  <Textarea
                    value={editForm.narration || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, narration: e.target.value })
                    }
                    className="min-h-[160px] text-sm bg-white/[0.02] border-white/10 focus:border-studio/50 focus:bg-studio/[0.02] resize-none transition-all rounded-xl leading-relaxed text-zinc-300 font-medium p-4"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">
                      Visual Blueprint
                    </label>
                    <div className="flex items-center gap-1.5">
                      {/* Visual enhancement & rewrite buttons removed */}
                    </div>
                  </div>
                  <Textarea
                    value={editForm.visuals || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, visuals: e.target.value })
                    }
                    className="min-h-[160px] text-xs font-mono bg-white/[0.02] border-white/10 focus:border-purple-500/50 focus:bg-purple-500/[0.02] resize-none transition-all rounded-xl leading-relaxed text-zinc-400 p-4"
                    placeholder="Specify camera angles, lighting, and cinematic composition..."
                  />
                </div>

                <div className="p-4 rounded-2xl bg-studio/[0.03] border border-studio/10 space-y-3">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-black text-studio uppercase tracking-[0.3em]">
                      Master AI Prompt
                    </label>
                    {promptList.length > 0 && (
                      <Select
                        onValueChange={(val: string | null) =>
                          setEditForm({
                            ...editForm,
                            linkedPrompt: val || undefined,
                          })
                        }
                      >
                        <SelectTrigger className="h-7 w-auto bg-studio/10 border-studio/20 text-xs text-white uppercase font-black px-3 rounded-lg hover:bg-studio/20 transition-all">
                          <SelectValue placeholder="SYMPHONY LIST" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0c0d11] border-white/10 rounded-xl overflow-hidden">
                          {promptList.map((p, i) => (
                            <SelectItem
                              key={i}
                              value={p}
                              className="text-xs text-zinc-500 focus:text-studio focus:bg-studio/5 uppercase font-black py-3 border-b border-white/5 last:border-0 cursor-pointer"
                            >
                              Prompt {String(i + 1).padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <Textarea
                    value={editForm.linkedPrompt || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, linkedPrompt: e.target.value })
                    }
                    className="min-h-[100px] text-xs font-mono bg-black/40 border-studio/20 focus:border-studio/50 focus:bg-black/60 resize-none transition-all rounded-xl leading-relaxed text-zinc-400"
                    placeholder="Enter artistic direction and visual guidance here..."
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-zinc-600 hover:text-zinc-400 uppercase tracking-[0.3em] font-black"
                      onClick={() =>
                        setEditForm({ ...editForm, linkedPrompt: "" })
                      }
                    >
                      Purge Prompt
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">
                      Acoustics
                    </label>
                    <Textarea
                      value={editForm.sound || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, sound: e.target.value })
                      }
                      className="min-h-[80px] text-xs font-mono bg-white/[0.02] border-white/10 focus:border-blue-500/50 focus:bg-blue-500/[0.02] resize-none transition-all rounded-xl leading-relaxed text-zinc-400"
                      placeholder="SFX/BGM cues..."
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">
                        Temporal
                      </label>
                      {/* Suggest duration removed */}
                    </div>
                    <Input
                      value={editForm.duration || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, duration: e.target.value })
                      }
                      className="h-10 text-xs font-mono bg-white/[0.02] border-white/10 focus:border-emerald-500/50 rounded-xl text-white"
                      placeholder="e.g. 5s"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">
                      Soul Focus
                    </label>
                    <Input
                      value={editForm.soulFocus || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, soulFocus: e.target.value })
                      }
                      className="h-10 text-xs bg-white/[0.02] border-white/10 focus:border-studio/50 focus:bg-studio/[0.02] rounded-xl font-bold uppercase tracking-wider text-white"
                      placeholder="e.g. Anya"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">
                      Emotional Key
                    </label>
                    <Input
                      value={editForm.emotionalKey || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          emotionalKey: e.target.value,
                        })
                      }
                      className="h-10 text-xs bg-white/[0.02] border-white/10 focus:border-orange-500/50 focus:bg-orange-500/[0.02] rounded-xl font-bold uppercase tracking-wider text-white"
                      placeholder="e.g. Tension"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">
                    Narrative Subtext
                  </label>
                  <Textarea
                    value={editForm.subtext || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subtext: e.target.value })
                    }
                    className="min-h-[80px] text-xs bg-white/[0.02] border-white/10 focus:border-studio/50 focus:bg-studio/[0.02] resize-none transition-all rounded-xl leading-relaxed text-zinc-400 p-3"
                    placeholder="Specify hidden motives, subtext, or internal character psychology..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">
                      VFX Compounds
                    </label>
                    <Input
                      value={editForm.vfxCompounds || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          vfxCompounds: e.target.value,
                        })
                      }
                      className="h-10 text-xs bg-white/[0.02] border-white/10 focus:border-purple-500/50 rounded-xl text-white font-mono"
                      placeholder="e.g. Volumetrics, lens bloom"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">
                      Active Assets
                    </label>
                    <Input
                      value={editForm.assets || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, assets: e.target.value })
                      }
                      className="h-10 text-xs bg-white/[0.02] border-white/10 focus:border-studio/50 rounded-xl text-white"
                      placeholder="e.g. Anya, Railgun"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-orange-400 uppercase tracking-[0.3em] ml-1">
                    Video Motion Prompt
                  </label>
                  <Textarea
                    value={editForm.videoPrompt || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, videoPrompt: e.target.value })
                    }
                    className="min-h-[100px] text-xs font-mono bg-black/40 border-orange-500/20 focus:border-orange-500/50 focus:bg-black/60 resize-none transition-all rounded-xl leading-relaxed text-zinc-400 p-3"
                    placeholder="High-fidelity cinematic prompt for video synthesis (Sora, Runway)..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEditing}
                    className="h-10 px-6 text-xs uppercase tracking-widest font-black rounded-xl hover:bg-white/5 text-zinc-500"
                  >
                    Abort
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={saveSceneEdits}
                    className="h-10 px-8 text-xs uppercase tracking-[0.2em] font-black bg-studio hover:bg-studio/80 text-black shadow-studio rounded-xl transition-all"
                  >
                    Commit Edits
                  </Button>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-700 space-y-4">
                <div className="flex justify-between items-start mb-5">
                  <div className={s.card.narrationBox}>
                    <h4 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">
                      Narration Layer
                    </h4>
                    <p className={s.card.narrationText}>
                      <span className="text-studio/40 font-serif mr-2 text-lg">
                        "
                      </span>
                      {scene.narration}
                      <span className="text-studio/40 font-serif ml-1 text-lg">
                        "
                      </span>
                    </p>
                  </div>
                </div>

                {/* Focus & Key Indicators */}
                {(scene.soulFocus || scene.emotionalKey) && (
                  <div className="grid grid-cols-2 gap-4">
                    {scene.soulFocus && (
                      <div className="px-4 py-2.5 bg-[#050505]/40 border border-white/5 rounded-xl text-left">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
                          👤 Soul Focus
                        </span>
                        <span className="text-xs font-black text-white uppercase tracking-wider">
                          {scene.soulFocus}
                        </span>
                      </div>
                    )}
                    {scene.emotionalKey && (
                      <div className="px-4 py-2.5 bg-[#050505]/40 border border-white/5 rounded-xl text-left">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
                          🔥 Emotional Key
                        </span>
                        <span className="text-xs font-black text-orange-400 uppercase tracking-wider">
                          {scene.emotionalKey}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Subtext Display */}
                {scene.subtext && (
                  <div className="px-4 py-3 bg-[#050505]/40 border border-white/5 rounded-2xl text-left">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
                      🧠 Narrative Subtext
                    </span>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-tight leading-relaxed">
                      {scene.subtext}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className={s.card.visualBlueprint}>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover/visual:opacity-100 transition-opacity duration-700" />
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <h4 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5" /> Visual Parameters
                      </h4>
                      {/* Visual generation removed */}
                    </div>
                    <p className={s.card.visualText}>{scene.visuals}</p>

                    {/* VFX & Active Assets Display */}
                    {scene.vfxCompounds && (
                      <div className="mt-4 pt-4 border-t border-white/5 text-left relative z-10">
                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-1">
                          ✨ VFX Compounds
                        </span>
                        <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                          {scene.vfxCompounds}
                        </p>
                      </div>
                    )}
                    {scene.assets && (
                      <div className="mt-3 pt-3 border-t border-white/5 text-left relative z-10">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
                          📦 Active Assets
                        </span>
                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                          {scene.assets}
                        </p>
                      </div>
                    )}

                    {scene.linkedPrompt && (
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-2 relative z-10 text-left">
                        <span className="text-xs font-black text-studio uppercase tracking-[0.3em] block ml-1">
                          Linked Scene Design
                        </span>
                        <p className="text-xs text-zinc-300 font-mono italic bg-black/40 p-3 rounded-lg whitespace-pre-wrap break-words transition-all cursor-default">
                          {scene.linkedPrompt}
                        </p>
                      </div>
                    )}

                    {scene.videoPrompt && (
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-2 relative z-10 text-left">
                        <span className="text-xs font-black text-orange-400 uppercase tracking-[0.3em] block ml-1">
                          Video Motion Prompt
                        </span>
                        <p className="text-xs text-zinc-300 font-mono italic bg-black/40 p-3 rounded-lg whitespace-pre-wrap break-words transition-all cursor-default">
                          {scene.videoPrompt}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={s.card.statBox}>
                      <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-3">
                        <Sparkles className="w-3.5 h-3.5" /> Audio Matrix
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono leading-relaxed italic">
                        {scene.sound || "No cues defined"}
                      </p>
                    </div>
                    <div
                      className={cn(
                        s.card.statBox,
                        "flex flex-col justify-between",
                      )}
                    >
                      <h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-3">
                        <Zap className="w-3.5 h-3.5" /> Temporal
                      </h4>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-black text-white font-mono tracking-tighter">
                          {scene.duration}
                        </span>
                        <span className="text-xs text-zinc-600 font-black uppercase tracking-widest mb-1">
                          Duration
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scene Card Footer - Action Hub */}
          <div className={s.card.footer}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate(`/studio/storyboard/scenes/${scene.originalIndex}`)
              }
              className="h-9 text-xs text-zinc-400 hover:text-studio hover:bg-studio/10 font-black uppercase tracking-widest rounded-xl transition-all gap-2"
            >
              <Maximize2 className="w-3.5 h-3.5" /> View Scene
            </Button>

            <div className="h-4 w-[1px] bg-zinc-800" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editingSceneId === scene.id
                  ? cancelEditing()
                  : startEditing(scene)
              }
              className={cn(
                "h-9 text-xs font-black uppercase tracking-widest rounded-xl transition-all gap-2",
                editingSceneId === scene.id
                  ? "text-red-400 hover:bg-red-400/10"
                  : "text-zinc-400 hover:text-white hover:bg-white/5",
              )}
            >
              {editingSceneId === scene.id ? (
                <>Abort Edit</>
              ) : (
                <>
                  <Edit2 className="w-3.5 h-3.5" /> Quick Edit
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  },
);
