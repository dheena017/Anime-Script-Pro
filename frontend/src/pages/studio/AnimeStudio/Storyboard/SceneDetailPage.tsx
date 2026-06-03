import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGeneratorState, useGeneratorDispatch } from "@/hooks/useGenerator";
import { useStoryboard } from "@/contexts/generator";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  ArrowLeft,
  Sparkles,
  Wand2,
  Zap,
  Maximize2,
  Film,
  Play,
  Copy,
  Download,
  Trash2,
} from "lucide-react";
import {
  enhanceNarration,
  enhanceSceneVisuals,
  generateVideo,
  generateVideoPrompts,
} from "@/services/api/gemini";

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

function SceneDetailInner({ sceneId }: { sceneId?: string | undefined }) {
  const navigate = useNavigate();
  const { generatedScript, visualData, videoData, selectedModel } =
    useGeneratorState();
  const { setGeneratedScript, showNotification, addLog } =
    useGeneratorDispatch();

  const { state: storyboardState, dispatch: storyboardDispatch } =
    useStoryboard();
  const { scenes: storyboardScenes } = storyboardState;

  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(-1);
  const [editForm, setEditForm] = useState<Partial<Scene>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    null,
  );
  const [renderError, setRenderError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "edit" | "metadata">(
    "preview",
  );
  const [isRenaming, setIsRenaming] = useState(false);
  const [sectionInput, setSectionInput] = useState("");
  const [autoSave, setAutoSave] = useState(false);
  const autoSaveTimer = useRef<number | null>(null);
  // Enhancement UI state
  const [stylePreset, setStylePreset] = useState<
    "cel" | "painterly" | "photoreal" | "none"
  >("none");
  const [vfxPresets, setVfxPresets] = useState<{
    bloom: boolean;
    chroma: boolean;
    grain: boolean;
  }>({ bloom: false, chroma: false, grain: false });
  const [trim, setTrim] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [audioTools, setAudioTools] = useState<{
    normalize: boolean;
    denoise: boolean;
  }>({ normalize: false, denoise: false });
  const [undoStack, setUndoStack] = useState<Partial<Scene>[]>([]);
  const [redoStack, setRedoStack] = useState<Partial<Scene>[]>([]);
  const [renderQueueLength, setRenderQueueLength] = useState<number>(0);
  const [resolution, setResolution] = useState<
    "1024x1024" | "1920x1080" | "2048x1024"
  >("1024x1024");
  const [aspect, setAspect] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [variations, setVariations] = useState<number>(1);
  const [autoVariations, setAutoVariations] = useState<boolean>(false);

  // Get scene from storyboard state or generatedScript, fallback to first scene
  useEffect(() => {
    const scenesSource =
      storyboardScenes && storyboardScenes.length > 0
        ? storyboardScenes
        : generatedScript?.scenes || [];

    if (!scenesSource || scenesSource.length === 0) {
      // no scenes available yet
      setCurrentSceneIndex(-1);
      setEditForm({});
      return;
    }

    // try to find exact match by id or originalIndex
    const idx = scenesSource.findIndex(
      (s: any) => s.id === sceneId || String(s.originalIndex) === sceneId,
    );
    if (idx !== -1) {
      // if storyboard is empty but we have generatedScript scenes, populate storyboardScenes so details live there
      if (
        (!storyboardScenes || storyboardScenes.length === 0) &&
        generatedScript?.scenes &&
        generatedScript.scenes.length > 0
      ) {
        storyboardDispatch({
          type: "SET_SCENES",
          payload: generatedScript.scenes,
        });
      }

      setCurrentSceneIndex(idx);
      setEditForm(scenesSource[idx]);
      return;
    }

    // if sceneId didn't match, but there's at least one scene, default to first scene
    // also ensure storyboardScenes gets populated with the full scenes so edits persist there
    if (
      (!storyboardScenes || storyboardScenes.length === 0) &&
      generatedScript?.scenes &&
      generatedScript.scenes.length > 0
    ) {
      storyboardDispatch({
        type: "SET_SCENES",
        payload: generatedScript.scenes,
      });
    }

    setCurrentSceneIndex(0);
    setEditForm(scenesSource[0]);
    setSectionInput(scenesSource[0]?.section || "");
  }, [storyboardScenes, generatedScript, sceneId]);

  // Use storyboard scenes when available, otherwise fallback to generatedScript.scenes
  const scenesList =
    storyboardScenes && storyboardScenes.length > 0
      ? storyboardScenes
      : generatedScript?.scenes || [];

  const scene: Scene = scenesList?.[currentSceneIndex] ?? {
    id: "loading",
    originalIndex: 0,
    section: "Loading Scene Manifest",
    narration: "",
    visuals: "",
    sound: "",
    duration: "",
    linkedPrompt: "",
    videoPrompt: "",
    soulFocus: "",
    vfxCompounds: "",
    emotionalKey: "",
    subtext: "",
    assets: "",
  };

  const previewUrl =
    generatedVideoUrl ||
    videoData?.[scene.originalIndex] ||
    visualData?.[scene.originalIndex]?.[0] ||
    "";
  const hasRenderedMedia = Boolean(
    generatedVideoUrl || videoData?.[scene.originalIndex],
  );
  const sceneProgress =
    scenesList.length > 0
      ? Math.round(((currentSceneIndex + 1) / scenesList.length) * 100)
      : 0;
  const coreNotes = [
    { label: "Section", value: scene.section || "Unassigned" },
    {
      label: "Duration",
      value: editForm.duration || scene.duration || "Unset",
    },
    { label: "Emotional Key", value: editForm.emotionalKey || "Unset" },
    { label: "Soul Focus", value: editForm.soulFocus || "Unset" },
  ];
  const qualityFlags = [
    {
      label: "Narration",
      value: editForm.narration || scene.narration ? "Defined" : "Missing",
    },
    {
      label: "Visuals",
      value: editForm.visuals || scene.visuals ? "Defined" : "Missing",
    },
    {
      label: "Sound",
      value: editForm.sound || scene.sound ? "Defined" : "Missing",
    },
    {
      label: "Video Prompt",
      value: editForm.videoPrompt || scene.videoPrompt ? "Defined" : "Missing",
    },
  ];
  const stylePills = [
    editForm.emotionalKey || scene.emotionalKey,
    editForm.soulFocus || scene.soulFocus,
    editForm.vfxCompounds || scene.vfxCompounds,
  ].filter(Boolean) as string[];

  const handleSave = async () => {
    // push current form to undo stack
    setUndoStack((prev) => [...prev, editForm]);
    setRedoStack([]);
    setIsSaving(true);
    try {
      const updatedScenes = scenesList.map((s, idx) =>
        idx === currentSceneIndex ? ({ ...s, ...editForm } as Scene) : s,
      );

      // Always write the full scenes into storyboard state so card details live in `storyboardScenes`.
      storyboardDispatch({ type: "SET_SCENES", payload: updatedScenes });

      // Also update generatedScript if available (keep both in sync)
      setGeneratedScript?.({
        ...(generatedScript || {}),
        scenes: updatedScenes,
      });

      setTimeout(() => {
        setIsSaving(false);
        showNotification?.("Scene archived successfully!", "success");
        addLog(
          "STORYBOARD",
          "COMPLETED",
          `Scene ${currentSceneIndex + 1} manifest updated.`,
        );
      }, 500);
    } catch (e) {
      setIsSaving(false);
      showNotification?.("Failed to save scene", "error");
    }
  };

  // Auto-save when editForm changes
  useEffect(() => {
    if (!autoSave) return;
    if (autoSaveTimer.current) window.clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = window.setTimeout(() => {
      handleSave();
    }, 800);
    return () => {
      if (autoSaveTimer.current) window.clearTimeout(autoSaveTimer.current);
    };
  }, [editForm, autoSave]);

  const handleTryRender = async () => {
    setRenderError(null);
    setIsRendering(true);
    addLog(
      "STORYBOARD",
      "RENDER",
      `Starting render for scene ${currentSceneIndex + 1}...`,
    );
    try {
      const promptToUse = editForm.linkedPrompt || editForm.visuals || "";
      if (!promptToUse || promptToUse.trim().length < 10) {
        throw new Error(
          "Prompt too short for rendering. Edit the scene visuals or linked prompt.",
        );
      }
      const sceneImages = visualData?.[scene?.originalIndex];
      const imageUrl =
        sceneImages && sceneImages.length > 0 && sceneImages[0] !== "loading"
          ? sceneImages[0]
          : undefined;
      const url = await generateVideo(
        promptToUse,
        selectedModel || undefined,
        undefined,
        imageUrl,
      );
      if (!url) throw new Error("Renderer returned no URL.");
      setGeneratedVideoUrl(url);
      storyboardDispatch({
        type: "UPDATE_VIDEO_ITEM",
        payload: { id: scene.originalIndex, data: url },
      });
      showNotification?.("Render completed!", "success");
      addLog(
        "STORYBOARD",
        "COMPLETED",
        `Render succeeded for scene ${currentSceneIndex + 1}.`,
      );
    } catch (error: any) {
      const message = error?.message || String(error) || "Unknown render error";
      setRenderError(message);
      showNotification?.(`Render failed: ${message}`, "error");
      addLog(
        "STORYBOARD",
        "ERROR",
        `Render failed for scene ${currentSceneIndex + 1}: ${message}`,
      );
    } finally {
      setIsRendering(false);
    }
  };

  const handleEnhance = async (
    type: "narration" | "visuals" | "videoPrompt",
  ) => {
    setIsEnhancing(true);
    try {
      if (type === "narration" && editForm.narration) {
        const enhanced = await enhanceNarration(editForm.narration);
        setEditForm((prev) => ({ ...prev, narration: enhanced }));
        showNotification?.("Narration optimized!", "success");
      } else if (type === "visuals" && editForm.visuals) {
        const enhanced = await enhanceSceneVisuals(
          editForm.visuals,
          editForm.narration || "",
        );
        setEditForm((prev) => ({ ...prev, visuals: enhanced }));
        showNotification?.("Visuals enhanced!", "success");
      } else if (type === "videoPrompt") {
        const promptInput = editForm.visuals || scene.visuals || "";
        if (!promptInput)
          throw new Error("Need scene visuals to generate a video prompt.");
        const generated = await generateVideoPrompts(
          promptInput,
          selectedModel || undefined,
          { singleScene: true },
        );
        setEditForm((prev) => ({ ...prev, videoPrompt: generated }));
        showNotification?.("Video Motion Prompt generated!", "success");
      }
    } catch (e: any) {
      showNotification?.(e.message || "Enhancement failed", "error");
    } finally {
      setIsEnhancing(false);
    }
  };

  // Enhancement helpers
  const applyStylePreset = (
    preset: "cel" | "painterly" | "photoreal" | "none",
  ) => {
    setStylePreset(preset);
    // merge preset hints into visuals / vfx
    const presetText = preset === "none" ? "" : `Style:${preset}; `;
    setEditForm((prev) => ({
      ...prev,
      visuals: `${presetText}${prev.visuals || scene.visuals || ""}`,
    }));
    showNotification?.(`Applied ${preset} preset`, "success");
  };

  const toggleVfx = (k: keyof typeof vfxPresets) => {
    setVfxPresets((prev) => {
      const next = { ...prev, [k]: !prev[k] };
      setEditForm((e) => ({
        ...e,
        vfxCompounds: `bloom:${String(next.bloom)},chroma:${String(next.chroma)},grain:${String(next.grain)}`,
      }));
      return next;
    });
  };

  const applyAudioTool = (tool: "normalize" | "denoise") => {
    if (tool === "normalize")
      setAudioTools((prev) => ({ ...prev, normalize: !prev.normalize }));
    if (tool === "denoise")
      setAudioTools((prev) => ({ ...prev, denoise: !prev.denoise }));
    showNotification?.(
      `${tool} ${audioTools[tool as keyof typeof audioTools] ? "disabled" : "enabled"}`,
      "info",
    );
  };

  const handleTrimChange = (k: "start" | "end", v: number) =>
    setTrim((prev) => ({ ...prev, [k]: Math.max(0, v) }));

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => [...prev, editForm]);
    setEditForm(last || {});
    showNotification?.("Undo", "info");
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setUndoStack((prev) => [...prev, editForm]);
    setEditForm(next || {});
    showNotification?.("Redo", "info");
  };

  const handleApplyToAll = () => {
    const updated = scenesList.map((s) => ({ ...s, ...editForm }));
    storyboardDispatch({ type: "SET_SCENES", payload: updated });
    setGeneratedScript?.({ ...(generatedScript || {}), scenes: updated });
    showNotification?.("Applied to all scenes", "success");
  };

  const handleAISuggestions = async () => {
    // stub: call enhancement API in future
    showNotification?.("AI suggestions generated (stub)", "info");
  };

  const handleNext = () => {
    if (currentSceneIndex < scenesList.length - 1) {
      navigate(
        `/studio/storyboard/scenes/${scenesList[currentSceneIndex + 1].originalIndex}`,
      );
    }
  };

  const handlePrev = () => {
    if (currentSceneIndex > 0) {
      navigate(
        `/studio/storyboard/scenes/${scenesList[currentSceneIndex - 1].originalIndex}`,
      );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification?.("Copied to clipboard!", "success");
  };

  const handleRenameToggle = () => {
    setIsRenaming((v) => {
      const next = !v;
      if (next) setSectionInput(editForm.section || scene?.section || "");
      return next;
    });
  };

  const handleRenameSave = () => {
    setEditForm((prev) => ({ ...prev, section: sectionInput }));
    setIsRenaming(false);
  };

  const handleDuplicate = () => {
    const newScene = {
      ...(scene as Scene),
      id: String(Date.now()),
      originalIndex: scenesList.length,
    } as Scene;
    const updated = [...scenesList];
    updated.splice(currentSceneIndex + 1, 0, newScene);
    storyboardDispatch({ type: "SET_SCENES", payload: updated });
    setGeneratedScript?.({ ...(generatedScript || {}), scenes: updated });
    navigate(`/studio/storyboard/scenes/${newScene.originalIndex}`);
    showNotification?.("Scene duplicated", "success");
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this scene?")) return;
    const updated = scenesList.filter((s, i) => i !== currentSceneIndex);
    storyboardDispatch({ type: "SET_SCENES", payload: updated });
    setGeneratedScript?.({ ...(generatedScript || {}), scenes: updated });
    showNotification?.("Scene deleted", "success");
    if (updated.length === 0) navigate("/studio/storyboard/video");
    else {
      const nextIndex = Math.min(currentSceneIndex, updated.length - 1);
      navigate(`/studio/storyboard/scenes/${updated[nextIndex].originalIndex}`);
    }
  };

  const handleFirst = () => {
    if (scenesList.length === 0) return;
    navigate(`/studio/storyboard/scenes/${scenesList[0].originalIndex}`);
  };

  const handleLast = () => {
    if (scenesList.length === 0) return;
    navigate(
      `/studio/storyboard/scenes/${scenesList[scenesList.length - 1].originalIndex}`,
    );
  };

  const handleJumpTo = (v: number) => {
    const idx = Math.max(0, Math.min(scenesList.length - 1, v - 1));
    navigate(`/studio/storyboard/scenes/${scenesList[idx].originalIndex}`);
  };

  const downloadVideo = () => {
    const url = generatedVideoUrl || videoData?.[scene.originalIndex];
    if (!url) {
      showNotification?.("No video to download", "error");
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = `scene-${scene.originalIndex}.mp4`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020203] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_18%)]" />
      <div className="pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full bg-studio/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[22rem] h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1680px] space-y-8 px-5 py-8 lg:px-8 xl:px-10">
        {/* Header */}
        <div className="flex flex-col gap-5 rounded-[2rem] border border-white/8 bg-white/[0.03] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/studio/storyboard/video")}
                className="h-11 gap-2 rounded-full border border-white/10 bg-black/30 px-5 font-black uppercase tracking-[0.28em] text-zinc-400 hover:border-studio/40 hover:bg-studio/10 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Storyboard
              </Button>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-studio/30 bg-studio/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.35em] text-studio">
                    Neural Scene Kernel
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">
                    Scene {String(currentSceneIndex + 1).padStart(2, "0")} of{" "}
                    {String(scenesList.length).padStart(2, "0")}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.35em] ${hasRenderedMedia ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-amber-400/30 bg-amber-400/10 text-amber-300"}`}
                  >
                    {hasRenderedMedia
                      ? "Rendered Media Ready"
                      : "Awaiting Render"}
                  </span>
                </div>

                <div className="flex flex-wrap items-end gap-4">
                  <h1 className="max-w-4xl text-3xl font-black uppercase tracking-tight text-white sm:text-4xl xl:text-5xl">
                    {scene.section || "Untitled Scene"}
                  </h1>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
                    <span className="text-2xl font-black text-studio font-mono">
                      {String(currentSceneIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">
                      progress {sceneProgress}%
                    </span>
                  </div>
                </div>

                <p className="max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                  {editForm.subtext ||
                    scene.subtext ||
                    "Curate narration, visuals, sound, and render data in a single cinematic control surface."}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:items-end">
              <div className="flex flex-wrap items-center justify-end gap-3">
                <label className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                  />{" "}
                  Auto-save
                </label>
                <Button
                  onClick={handleDuplicate}
                  variant="outline"
                  className="h-11 rounded-full border-white/10 bg-white/[0.03] px-4 font-black uppercase tracking-[0.25em] text-zinc-200 hover:border-studio/40 hover:bg-studio/10"
                >
                  Duplicate
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="h-11 rounded-full px-4 font-black uppercase tracking-[0.25em]"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-11 rounded-full bg-gradient-to-r from-studio to-cyan-300 px-6 font-black uppercase tracking-[0.25em] text-black shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:from-cyan-300 hover:to-studio"
                >
                  {isSaving ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Archive Scene
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFirst}
                  className="h-10 w-10 rounded-full border-white/10 bg-black/35 text-zinc-300 hover:border-studio/40 hover:bg-studio/10"
                >
                  ⏮
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  disabled={currentSceneIndex === 0}
                  className="h-10 w-10 rounded-full border-white/10 bg-black/35 text-white transition-all hover:border-studio/40 hover:bg-studio/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentSceneIndex === scenesList.length - 1}
                  className="h-10 w-10 rounded-full border-white/10 bg-black/35 text-white transition-all hover:border-studio/40 hover:bg-studio/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLast}
                  className="h-10 w-10 rounded-full border-white/10 bg-black/35 text-zinc-300 hover:border-studio/40 hover:bg-studio/10"
                >
                  ⏭
                </Button>
                <div className="flex items-center rounded-full border border-white/10 bg-black/35 px-3">
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, scenesList.length)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleJumpTo(
                          Number((e.target as HTMLInputElement).value),
                        );
                    }}
                    placeholder="#"
                    className="w-16 bg-transparent px-1 py-2 text-sm text-white outline-none placeholder:text-zinc-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
            <Card className="overflow-hidden rounded-[1.75rem] border-white/8 bg-black/55 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#070707]">
                {previewUrl ? (
                  visualData?.[scene.originalIndex]?.[0] &&
                  !hasRenderedMedia ? (
                    <img
                      src={previewUrl}
                      alt="Scene preview"
                      className="h-full w-full object-cover opacity-90"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  )
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.08),transparent_35%)] px-6 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] border border-white/8 bg-white/[0.03]">
                      <Film className="h-11 w-11 text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-black uppercase tracking-[0.3em] text-red-400">
                        No Preview Available
                      </p>
                      <p className="text-sm leading-6 text-zinc-500">
                        Generate a render or attach scene visuals to activate
                        the preview stage.
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-studio/30 bg-black/45 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-studio">
                    Live Scene Stage
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
                    {hasRenderedMedia ? "Playable" : "Draft"}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="rounded-[1.4rem] border border-white/10 bg-black/55 p-4 backdrop-blur-md">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                      Quick Metrics
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {coreNotes.slice(0, 2).map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3"
                        >
                          <div className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">
                            {item.label}
                          </div>
                          <div className="mt-1 text-sm font-black text-white">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {coreNotes.map((item) => (
                  <Card
                    key={item.label}
                    className="rounded-[1.4rem] border-white/8 bg-white/[0.03] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.32em] text-zinc-600">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-black uppercase tracking-wide text-white">
                      {item.value}
                    </p>
                  </Card>
                ))}
              </div>

              <Card className="rounded-[1.75rem] border-white/8 bg-white/[0.03] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-studio">
                      Scene DNA
                    </p>
                    <h2 className="mt-2 text-xl font-black uppercase tracking-tight text-white">
                      Directional notes and production readiness
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stylePills.length > 0 ? (
                      stylePills.map((pill) => (
                        <span
                          key={pill}
                          className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-300"
                        >
                          {pill}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">
                        No scene tags yet
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {qualityFlags.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/8 bg-black/35 px-4 py-4"
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                        {item.label}
                      </p>
                      <p
                        className={`mt-2 text-sm font-black uppercase tracking-wide ${item.value === "Defined" ? "text-emerald-300" : "text-zinc-500"}`}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="flex gap-4 border-b border-white/8">
                {["preview", "edit", "metadata"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`relative px-5 py-4 text-xs font-black uppercase tracking-[0.32em] transition-all ${
                      activeTab === tab
                        ? "text-studio"
                        : "text-zinc-600 hover:text-zinc-400"
                    }`}
                  >
                    {tab === "preview" && "Preview"}
                    {tab === "edit" && "Edit"}
                    {tab === "metadata" && "Details"}
                    {activeTab === tab && (
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-studio to-transparent" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === "preview" && (
            <div className="space-y-8">
              {/* Video Player */}
              <Card className="bg-black/80 backdrop-blur-md border-white/5 overflow-hidden rounded-3xl shadow-2xl">
                <div className="aspect-video bg-[#030303] flex items-center justify-center relative overflow-hidden group">
                  {generatedVideoUrl ? (
                    <video
                      src={generatedVideoUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : videoData?.[scene.originalIndex] ? (
                    <video
                      src={videoData?.[scene.originalIndex]}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : visualData?.[scene.originalIndex]?.[0] ? (
                    <img
                      src={visualData?.[scene.originalIndex]?.[0]}
                      alt="Scene Preview"
                      className="w-full h-full object-cover opacity-90"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-24 h-24 bg-white/[0.02] border-2 border-white/5 rounded-3xl flex items-center justify-center">
                        <Film className="w-12 h-12 text-zinc-700" />
                      </div>
                      <div className="text-center space-y-3">
                        <p className="text-lg font-bold text-red-400 uppercase tracking-widest">
                          No Video Available
                        </p>
                        <p className="text-sm text-zinc-500 max-w-md">
                          Generate a video render or upload scene visuals to
                          preview here.
                        </p>
                        {renderError && (
                          <p className="text-sm text-red-500 mt-4">
                            Error: {renderError}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 pointer-events-none" />

                  <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={handleTryRender}
                        disabled={isRendering}
                        className="h-12 px-6 bg-studio hover:bg-studio/90 text-black font-black uppercase tracking-widest rounded-xl transition-all"
                      >
                        {isRendering ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                            Rendering...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" /> Generate Video
                          </>
                        )}
                      </Button>

                      <div className="flex items-center gap-3">
                        <select
                          value={stylePreset}
                          onChange={(e) =>
                            applyStylePreset(e.target.value as any)
                          }
                          className="bg-black/30 px-3 py-2 rounded"
                        >
                          <option value="none">Style Preset</option>
                          <option value="cel">Cel</option>
                          <option value="painterly">Painterly</option>
                          <option value="photoreal">Photoreal</option>
                        </select>

                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            onClick={() => toggleVfx("bloom")}
                            variant={vfxPresets.bloom ? "default" : "ghost"}
                          >
                            Bloom
                          </Button>
                          <Button
                            size="icon"
                            onClick={() => toggleVfx("chroma")}
                            variant={vfxPresets.chroma ? "default" : "ghost"}
                          >
                            Chroma
                          </Button>
                          <Button
                            size="icon"
                            onClick={() => toggleVfx("grain")}
                            variant={vfxPresets.grain ? "default" : "ghost"}
                          >
                            Grain
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 ml-2">
                          <select
                            value={resolution}
                            onChange={(e) =>
                              setResolution(e.target.value as any)
                            }
                            className="bg-black/30 px-3 py-2 rounded text-sm"
                          >
                            <option value="1024x1024">1024×1024</option>
                            <option value="1920x1080">1920×1080</option>
                            <option value="2048x1024">2048×1024</option>
                          </select>
                          <select
                            value={aspect}
                            onChange={(e) => setAspect(e.target.value as any)}
                            className="bg-black/30 px-3 py-2 rounded text-sm"
                          >
                            <option value="1:1">1:1</option>
                            <option value="16:9">16:9</option>
                            <option value="9:16">9:16</option>
                          </select>
                          <input
                            type="number"
                            min={1}
                            max={6}
                            value={variations}
                            onChange={(e) =>
                              setVariations(Number(e.target.value))
                            }
                            className="w-16 px-2 py-1 rounded bg-black/30 text-sm"
                          />
                          <label className="flex items-center gap-2 text-xs text-zinc-400">
                            <input
                              type="checkbox"
                              checked={autoVariations}
                              onChange={(e) =>
                                setAutoVariations(e.target.checked)
                              }
                            />{" "}
                            Auto
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <Button
                        size="icon"
                        onClick={handleUndo}
                        disabled={undoStack.length === 0}
                        className="w-10 h-10"
                      >
                        ↶
                      </Button>
                      <Button
                        size="icon"
                        onClick={handleRedo}
                        disabled={redoStack.length === 0}
                        className="w-10 h-10"
                      >
                        ↷
                      </Button>
                      <Button
                        size="icon"
                        onClick={downloadVideo}
                        className="w-12 h-12 bg-black/60 border border-white/10 rounded-xl hover:border-studio hover:bg-studio/10 transition-all"
                      >
                        <Download className="w-5 h-5 text-zinc-400" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={() => copyToClipboard(JSON.stringify(scene))}
                        className="w-12 h-12 bg-black/60 border border-white/10 rounded-xl hover:border-studio hover:bg-studio/10 transition-all"
                      >
                        <Copy className="w-5 h-5 text-zinc-400" />
                      </Button>
                      <Button
                        size="icon"
                        className="w-12 h-12 bg-black/60 border border-white/10 rounded-xl hover:border-studio hover:bg-studio/10 transition-all"
                      >
                        <Maximize2 className="w-5 h-5 text-zinc-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white/[0.03] border-white/5 p-6 rounded-2xl space-y-2">
                  <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                    Section
                  </p>
                  <p className="text-sm font-black text-white uppercase tracking-wide">
                    {scene.section}
                  </p>
                </Card>
                <Card className="bg-white/[0.03] border-white/5 p-6 rounded-2xl space-y-2">
                  <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                    Duration
                  </p>
                  <p className="text-sm font-black text-studio uppercase tracking-wide">
                    {editForm.duration || scene.duration}
                  </p>
                </Card>
                <Card className="bg-white/[0.03] border-white/5 p-6 rounded-2xl space-y-2">
                  <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                    Emotional Key
                  </p>
                  <p className="text-sm font-black text-purple-400 uppercase tracking-wide">
                    {editForm.emotionalKey || "Unset"}
                  </p>
                </Card>
                <Card className="bg-white/[0.03] border-white/5 p-6 rounded-2xl space-y-2">
                  <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                    Soul Focus
                  </p>
                  <p className="text-sm font-black text-emerald-400 uppercase tracking-wide">
                    {editForm.soulFocus || "Unset"}
                  </p>
                </Card>
              </div>

              {/* Additional Metadata */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bg-white/[0.03] border-white/5 p-6 rounded-2xl space-y-2">
                  <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                    VFX Compounds
                  </p>
                  <p className="text-sm font-mono text-zinc-300 leading-relaxed">
                    {editForm.vfxCompounds || scene.vfxCompounds || "None"}
                  </p>
                </Card>
                <Card className="bg-white/[0.03] border-white/5 p-6 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                      Video Motion Prompt
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEnhance("videoPrompt")}
                      disabled={isEnhancing}
                      className="text-studio hover:bg-studio/10 text-xs h-6 px-2"
                    >
                      {isEnhancing ? (
                        <Wand2 className="w-3 h-3 animate-spin mr-1" />
                      ) : (
                        <Sparkles className="w-3 h-3 mr-1" />
                      )}{" "}
                      Generate
                    </Button>
                  </div>
                  <p className="text-sm font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {editForm.videoPrompt || scene.videoPrompt || "None"}
                  </p>
                </Card>
              </div>

              {/* Playback / Audio / Queue Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="p-4">
                  <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                    Playback
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="text-xs text-zinc-400">Start</label>
                    <input
                      type="number"
                      value={trim.start}
                      onChange={(e) =>
                        handleTrimChange("start", Number(e.target.value))
                      }
                      className="w-20 px-2 py-1 rounded bg-black/30"
                    />
                    <label className="text-xs text-zinc-400">End</label>
                    <input
                      type="number"
                      value={trim.end}
                      onChange={(e) =>
                        handleTrimChange("end", Number(e.target.value))
                      }
                      className="w-20 px-2 py-1 rounded bg-black/30"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <label className="text-xs text-zinc-400">Speed</label>
                    <input
                      type="range"
                      min={0.25}
                      max={2}
                      step={0.05}
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    />
                    <span className="text-xs text-zinc-300">
                      {playbackSpeed}x
                    </span>
                  </div>
                </Card>

                <Card className="p-4">
                  <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                    Audio Tools
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => applyAudioTool("normalize")}
                      variant={audioTools.normalize ? "default" : "outline"}
                    >
                      Normalize
                    </Button>
                    <Button
                      onClick={() => applyAudioTool("denoise")}
                      variant={audioTools.denoise ? "default" : "outline"}
                    >
                      Denoise
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button onClick={handleAISuggestions}>
                      AI Suggestions
                    </Button>
                    <Button onClick={handleApplyToAll} variant="outline">
                      Apply to All
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                    Render Queue
                  </p>
                  <div className="text-sm text-zinc-300 mt-2">
                    Jobs pending: {renderQueueLength}
                  </div>
                </Card>
              </div>

              {/* Sound Design */}
              <Card className="bg-white/[0.02] border-white/5 p-8 rounded-3xl space-y-4">
                <h4 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em]">
                  🎵 Soundscape Blueprint
                </h4>
                <div className="p-6 bg-black/50 border border-white/5 rounded-2xl text-sm text-zinc-300 font-medium leading-relaxed italic min-h-[120px]">
                  "{editForm.sound || scene.sound}"
                </div>
              </Card>

              {/* Visual Prompt */}
              <Card className="bg-white/[0.02] border-white/5 p-8 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em]">
                    🎨 Linked Visual Prompt
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      copyToClipboard(
                        editForm.linkedPrompt || scene.linkedPrompt || "",
                      )
                    }
                    className="text-studio hover:bg-studio/10 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                </div>
                <div className="p-6 bg-black/50 border border-white/5 rounded-2xl text-sm text-zinc-300 font-medium leading-relaxed min-h-[150px] max-h-[300px] overflow-y-auto">
                  {editForm.linkedPrompt ||
                    scene.linkedPrompt ||
                    "No linked prompt"}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "edit" && (
            <div className="space-y-8">
              {/* Narration */}
              <Card className="bg-white/[0.02] border-white/5 p-10 rounded-3xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-studio" />
                      Narration & Dialogue
                    </h3>
                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest ml-8">
                      Character voiceover, dialogue, and vocal direction.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnhance("narration")}
                    disabled={isEnhancing}
                    className="h-10 px-6 bg-studio/5 border-studio/20 text-studio hover:bg-studio hover:text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all"
                  >
                    {isEnhancing ? (
                      <Wand2 className="w-3 h-3 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-2" />
                    )}
                    Optimize
                  </Button>
                </div>
                <Textarea
                  value={editForm.narration || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, narration: e.target.value })
                  }
                  className="min-h-[300px] bg-black/50 border-white/10 rounded-2xl p-8 text-base font-medium leading-relaxed text-zinc-200 focus:border-studio/50 focus:bg-studio/[0.01] transition-all resize-none shadow-inner"
                  placeholder="Enter character dialogue, narration, or vocal direction..."
                />
              </Card>

              {/* Visual Manifest */}
              <Card className="bg-white/[0.02] border-white/5 p-10 rounded-3xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                      <Zap className="w-5 h-5 text-purple-400" />
                      Visual Manifest
                    </h3>
                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest ml-8">
                      Camera angles, lighting, composition, and cinematic
                      direction.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnhance("visuals")}
                    disabled={isEnhancing}
                    className="h-10 px-6 bg-purple-500/5 border-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all"
                  >
                    {isEnhancing ? (
                      <Wand2 className="w-3 h-3 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-2" />
                    )}
                    Enhance
                  </Button>
                </div>
                <Textarea
                  value={editForm.visuals || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, visuals: e.target.value })
                  }
                  className="min-h-[300px] bg-black/50 border-white/10 rounded-2xl p-8 text-base font-mono leading-relaxed text-zinc-200 focus:border-purple-500/50 focus:bg-purple-500/[0.01] transition-all resize-none shadow-inner"
                  placeholder="Describe camera angles, shot composition, lighting, atmosphere, and visual effects..."
                />
              </Card>

              {/* Sound */}
              <Card className="bg-white/[0.02] border-white/5 p-10 rounded-3xl space-y-6">
                <h3 className="text-lg font-black text-white uppercase tracking-widest">
                  🎵 Sound Design
                </h3>
                <Textarea
                  value={editForm.sound || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, sound: e.target.value })
                  }
                  className="min-h-[200px] bg-black/50 border-white/10 rounded-2xl p-8 text-base font-medium leading-relaxed text-zinc-200 focus:border-emerald-500/50 transition-all resize-none shadow-inner"
                  placeholder="Ambient sounds, background music, foley effects, and audio cues..."
                />
              </Card>
            </div>
          )}

          {activeTab === "metadata" && (
            <div className="space-y-8">
              <Card className="bg-white/[0.02] border-white/5 p-10 rounded-3xl space-y-8">
                <h3 className="text-lg font-black text-white uppercase tracking-widest">
                  Scene Metadata
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Duration */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                      Duration (seconds)
                    </label>
                    <input
                      type="text"
                      value={editForm.duration || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, duration: e.target.value })
                      }
                      className="w-full px-6 py-3 bg-black/50 border border-white/5 rounded-xl text-white font-mono focus:border-studio/50 focus:bg-studio/[0.01] transition-all"
                      placeholder="e.g. 5s, 10s, 15s"
                    />
                  </div>

                  {/* Soul Focus */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                      Soul Focus
                    </label>
                    <input
                      type="text"
                      value={editForm.soulFocus || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, soulFocus: e.target.value })
                      }
                      className="w-full px-6 py-3 bg-black/50 border border-white/5 rounded-xl text-white font-mono focus:border-studio/50 focus:bg-studio/[0.01] transition-all"
                      placeholder="e.g. Active Subject, Environmental"
                    />
                  </div>

                  {/* Emotional Key */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                      Emotional Key
                    </label>
                    <input
                      type="text"
                      value={editForm.emotionalKey || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          emotionalKey: e.target.value,
                        })
                      }
                      className="w-full px-6 py-3 bg-black/50 border border-white/5 rounded-xl text-white font-mono focus:border-studio/50 focus:bg-studio/[0.01] transition-all"
                      placeholder="e.g. Tension, Calm, Excitement"
                    />
                  </div>

                  {/* VFX Compounds */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                      VFX Compounds
                    </label>
                    <input
                      type="text"
                      value={editForm.vfxCompounds || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          vfxCompounds: e.target.value,
                        })
                      }
                      className="w-full px-6 py-3 bg-black/50 border border-white/5 rounded-xl text-white font-mono focus:border-studio/50 focus:bg-studio/[0.01] transition-all"
                      placeholder="e.g. Volumetric bloom, HSL color grade"
                    />
                  </div>
                </div>

                {/* Subtext */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                    Subtext & Meaning
                  </label>
                  <Textarea
                    value={editForm.subtext || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subtext: e.target.value })
                    }
                    className="min-h-[150px] bg-black/50 border-white/5 rounded-2xl p-6 text-sm text-zinc-200 focus:border-studio/50 transition-all resize-none"
                    placeholder="Psychological narrative undercurrent and thematic meaning..."
                  />
                </div>

                {/* Assets */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                    Key Assets & Props
                  </label>
                  <Textarea
                    value={editForm.assets || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, assets: e.target.value })
                    }
                    className="min-h-[150px] bg-black/50 border-white/5 rounded-2xl p-6 text-sm text-zinc-200 focus:border-studio/50 transition-all resize-none"
                    placeholder="Environment props, character equipment, set dressing..."
                  />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SceneDetailPage() {
  const { sceneId } = useParams();
  // Key the inner component by sceneId so it fully remounts when route param changes.
  return <SceneDetailInner key={sceneId || "none"} sceneId={sceneId} />;
}
