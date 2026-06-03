import React, { useEffect, useState } from "react";
import { Layout as LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useGeneratorState, useGeneratorDispatch } from "@/hooks/useGenerator";
import { useStoryboard, useEngineState } from "@/contexts/generator";
import { useOutletContext, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DropResult } from "@hello-pangea/dnd";
import {
  enhanceSceneVisuals,
  generateSceneImage,
  enhanceNarration,
  rewriteForTension,
  suggestDuration,
  generateVideo,
  generateScene,
} from "@/services/api/gemini";
import { StoryboardTab } from "./Tabs/StoryboardTabs";

// Sub-components
import { PlanningGuide } from "./components/PlanningGuide";
import { StoryboardContext } from "./StoryboardLayout";
import { DeferredRender } from "@/pages/studio/components/studio/DeferredRender";

// Modular tab components
import { FramesTab } from "./Tabs/FramesTab";
import { AnglesTab } from "./Tabs/AnglesTab";
import { CompositionTab } from "./Tabs/CompositionTab";
import { AnimaticTab } from "./Tabs/AnimaticTab";
import { AudioTab } from "./Tabs/AudioTab";
import { StoryboardLoadingPage } from "./components/StoryboardLoadingPage";
import { StoryboardEmptyState } from "./components/StoryboardEmptyState";

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

type StoryboardScriptInput =
  | string
  | null
  | undefined
  | { scenes?: Scene[]; script?: string | null; content?: string | null };

import { storyboardStyles as s } from "./storyboardStyles";

export const StoryboardPageContext = React.createContext<any>(null);

export function StoryboardPage() {
  const {
    generatedScript,
    generatedImagePrompts,
    generatedWorld,
    generatedWorldLore,
    generatedWorldPowers,
    generatedWorldFactions,
    generatedWorldArchitecture,
    generatedWorldAtlas,
    generatedWorldCulture,
    generatedWorldSystems,
    generatedCharacters,
    characterDNA,
    characterDynamics,
    characterIntegrity,
    characterRelationships,
    characterList,
  } = useGeneratorState();
  const { setGeneratedScript, addLog, loadDemoProject } =
    useGeneratorDispatch();

  const { state: storyboardState, dispatch: storyboardDispatch } =
    useStoryboard();
  const {
    scenes,
    visualData,
    videoData,
    isGeneratingVisuals,
    enhancingSceneIds,
  } = storyboardState;
  const { selectedModel } = useEngineState();

  const promptList = React.useMemo(
    () =>
      generatedImagePrompts
        ? generatedImagePrompts
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0 && !line.includes("---"))
        : [],
    [generatedImagePrompts],
  );

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Scene>>({});
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isEnhancingNarration, setIsEnhancingNarration] = useState(false);
  const [isRewritingTension, setIsRewritingTension] = useState(false);
  const [isSuggestingDuration, setIsSuggestingDuration] = useState(false);
  const [isEnhancingAllNarration, setIsEnhancingAllNarration] = useState(false);
  const [isEnhancingAllVisuals, setIsEnhancingAllVisuals] = useState(false);
  const [isProductionLoopActive, setIsProductionLoopActive] = useState(false);
  const [productionProgress, setProductionProgress] = useState(0);
  const [isManifestingSceneId, setIsManifestingSceneId] = useState<
    string | null
  >(null);

  const isGlobalEnhancing = isEnhancingAllNarration || isEnhancingAllVisuals;
  const lastScriptRef = React.useRef<string | null>(null);

  const serializeStoryboardScenes = (items: Scene[]): string => {
    if (!items || items.length === 0) return "";
    const header = [
      "# Anime Script",
      "",
      "| Section | Voiceover Narration | Visual/Scene Description | Sound Effect/BGM Cues | Duration | Linked Prompt |",
      "| :--- | :--- | :--- | :--- | :--- | :--- |",
    ];
    const rows = items.map(
      (scene) =>
        `| ${scene.section} | ${scene.narration} | ${scene.visuals} | ${scene.sound} | ${scene.duration} | ${scene.linkedPrompt || ""} |`,
    );
    return [...header, ...rows].join("\n");
  };

  const normalizeStoryboardScript = (script: StoryboardScriptInput): string => {
    if (!script) return "";
    if (typeof script === "string") return script;
    if (Array.isArray(script.scenes))
      return serializeStoryboardScenes(script.scenes);
    return script.script || script.content || "";
  };

  const parseStoryboard = (script: StoryboardScriptInput): Scene[] => {
    if (!script) return [];
    if (typeof script === "object" && Array.isArray(script.scenes)) {
      return script.scenes.map((scene, idx) => ({
        ...scene,
        originalIndex:
          typeof scene.originalIndex === "number" ? scene.originalIndex : idx,
        id: scene.id || `scene-${idx}`,
      }));
    }

    const scriptText = normalizeStoryboardScript(script);
    if (!scriptText) return [];

    const lines = scriptText.split("\n");
    const tableLines = lines.filter(
      (l) => l.includes("|") && !l.includes("---"),
    );
    if (tableLines.length <= 1) return [];

    return tableLines.slice(1).map((row, idx) => {
      const cells = row
        .split("|")
        .filter((cell) => cell.trim() !== "")
        .map((cell) => cell.trim());

      // If we have at least 11 columns, it's the premium 13-column format!
      if (cells.length >= 11) {
        return {
          id: `scene-${Math.random().toString(36).substring(2, 9)}-${idx}`,
          originalIndex: idx,
          section: cells[1] || "",
          soulFocus: cells[2] || "",
          narration: cells[3] || "",
          visuals: cells[4] || "",
          vfxCompounds: cells[5] || "",
          sound: cells[6] || "",
          emotionalKey: cells[7] || "",
          subtext: cells[8] || "",
          assets: cells[9] || "",
          duration: cells[10] || "5s",
          videoPrompt: cells[11] || "",
          linkedPrompt: cells[12] || "",
        };
      }

      // Legacy 6-column format fallback
      return {
        id: `scene-${Math.random().toString(36).substring(2, 9)}-${idx}`,
        originalIndex: idx,
        section: cells[0] || "",
        narration: cells[1] || "",
        visuals: cells[2] || "",
        sound: cells[3] || "",
        duration: cells[4] || "5s",
        linkedPrompt: cells[5] || "",
        videoPrompt: "",
      };
    });
  };

  useEffect(() => {
    if (generatedScript !== lastScriptRef.current) {
      const nextScenes = parseStoryboard(
        generatedScript as StoryboardScriptInput,
      );
      storyboardDispatch({ type: "SET_SCENES", payload: nextScenes });
      lastScriptRef.current = normalizeStoryboardScript(
        generatedScript as StoryboardScriptInput,
      );
    }
  }, [generatedScript, storyboardDispatch]);

  const updateScriptMarkdown = React.useCallback(
    (items: Scene[]) => {
      const currentScript = normalizeStoryboardScript(
        generatedScript as StoryboardScriptInput,
      );
      const scriptText =
        currentScript && currentScript.includes("|")
          ? currentScript
          : serializeStoryboardScenes(items);

      const lines = scriptText.split("\n");
      const tableHeaderIndex = lines.findIndex(
        (l) => l.includes("|") && l.toLowerCase().includes("section"),
      );
      if (tableHeaderIndex !== -1) {
        const preTable = lines.slice(0, tableHeaderIndex + 2);
        let tableEndIndex = tableHeaderIndex + 2;
        while (
          tableEndIndex < lines.length &&
          lines[tableEndIndex].includes("|")
        )
          tableEndIndex++;
        const postTable = lines.slice(tableEndIndex);

        const firstRow = lines[tableHeaderIndex];
        const isPremiumFormat = firstRow
          .split("|")
          .map((c) => c.trim().toLowerCase())
          .some(
            (c) => c.includes("video prompt") || c.includes("image prompt"),
          );

        const newTableRows = items.map((scene) => {
          if (isPremiumFormat) {
            const sceneNum = scene.originalIndex + 1;
            return `| ${sceneNum} | ${scene.section} | ${scene.soulFocus || ""} | ${scene.narration} | ${scene.visuals} | ${scene.vfxCompounds || ""} | ${scene.sound} | ${scene.emotionalKey || ""} | ${scene.subtext || ""} | ${scene.assets || ""} | ${scene.duration} | ${scene.videoPrompt || ""} | ${scene.linkedPrompt || ""} |`;
          }
          return `| ${scene.section} | ${scene.narration} | ${scene.visuals} | ${scene.sound} | ${scene.duration} | ${scene.linkedPrompt || ""} |`;
        });
        const newScript = [...preTable, ...newTableRows, ...postTable].join(
          "\n",
        );
        lastScriptRef.current = newScript;
        setGeneratedScript(newScript);
      }
    },
    [generatedScript, setGeneratedScript],
  );

  const handleDragEnd = React.useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const items = Array.from(scenes);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      storyboardDispatch({ type: "SET_SCENES", payload: items });
      updateScriptMarkdown(items);
    },
    [scenes, updateScriptMarkdown, storyboardDispatch],
  );

  const handleEnhanceNarration = React.useCallback(async () => {
    if (!editForm.narration) return;
    setIsEnhancingNarration(true);
    try {
      const enhanced = await enhanceNarration(editForm.narration);
      setEditForm((prev) => ({ ...prev, narration: enhanced }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancingNarration(false);
    }
  }, [editForm.narration]);

  const handleEnhanceVisuals = React.useCallback(async () => {
    if (!editForm.visuals) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceSceneVisuals(
        editForm.visuals,
        editForm.narration || "",
      );
      setEditForm((prev) => ({ ...prev, visuals: enhanced }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancing(false);
    }
  }, [editForm.visuals, editForm.narration]);

  const handleRewriteTension = React.useCallback(async () => {
    if (!editForm.visuals) return;
    setIsRewritingTension(true);
    try {
      const rewritten = await rewriteForTension(editForm.visuals);
      setEditForm((prev) => ({ ...prev, visuals: rewritten }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsRewritingTension(false);
    }
  }, [editForm.visuals]);

  const handleSuggestDuration = React.useCallback(async () => {
    if (!editForm.narration) return;
    setIsSuggestingDuration(true);
    try {
      const suggested = await suggestDuration(editForm.narration);
      setEditForm((prev) => ({ ...prev, duration: suggested }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSuggestingDuration(false);
    }
  }, [editForm.narration]);

  const handleGenerateVisual = React.useCallback(
    async (originalIndex: number, visualsDescription: string) => {
      storyboardDispatch({
        type: "UPDATE_VISUAL_ITEM",
        payload: { id: originalIndex, data: ["loading"] },
      });
      try {
        const scene = scenes.find((s) => s.originalIndex === originalIndex);

        // Premium 13-Topic hyper-accurate prompt synthesis
        const promptToUse =
          scene?.linkedPrompt ||
          [
            scene?.section ? `Setting: ${scene.section}.` : "",
            scene?.soulFocus ? `Subject Focus: ${scene.soulFocus}.` : "",
            visualsDescription ? `Action: ${visualsDescription}.` : "",
            scene?.assets ? `Objects & Elements: ${scene.assets}.` : "",
            scene?.sound ? `Environment Atmosphere: ${scene.sound}.` : "",
            scene?.emotionalKey
              ? `Visual Tone & Mood: ${scene.emotionalKey}.`
              : "",
            scene?.subtext
              ? `Psychological Undercurrent: ${scene.subtext}.`
              : "",
            scene?.vfxCompounds
              ? `Cinematography & Special Effects: ${scene.vfxCompounds}.`
              : "",
          ]
            .filter(Boolean)
            .join(" ");

        const promises = Array(4)
          .fill(0)
          .map((_, i) =>
            generateSceneImage(`${promptToUse} Variation ${i + 1}`),
          );
        const results = await Promise.all(promises);
        const images = results.map(
          (url, i) =>
            url ||
            `https://picsum.photos/seed/${encodeURIComponent(promptToUse.slice(0, 50))}-${originalIndex}-${i}/800/450`,
        );
        storyboardDispatch({
          type: "UPDATE_VISUAL_ITEM",
          payload: { id: originalIndex, data: images },
        });
      } catch (error) {
        console.error("Failed to generate image:", error);
        const scene = scenes.find((s) => s.originalIndex === originalIndex);

        const promptToUse =
          scene?.linkedPrompt ||
          [
            scene?.section ? `Setting: ${scene.section}.` : "",
            scene?.soulFocus ? `Subject Focus: ${scene.soulFocus}.` : "",
            visualsDescription ? `Action: ${visualsDescription}.` : "",
            scene?.assets ? `Objects & Elements: ${scene.assets}.` : "",
            scene?.sound ? `Environment Atmosphere: ${scene.sound}.` : "",
            scene?.emotionalKey
              ? `Visual Tone & Mood: ${scene.emotionalKey}.`
              : "",
            scene?.subtext
              ? `Psychological Undercurrent: ${scene.subtext}.`
              : "",
            scene?.vfxCompounds
              ? `Cinematography & Special Effects: ${scene.vfxCompounds}.`
              : "",
          ]
            .filter(Boolean)
            .join(" ");

        const seed = encodeURIComponent(promptToUse.slice(0, 50));
        const fallbacks = Array(4)
          .fill(0)
          .map(
            (_, i) =>
              `https://picsum.photos/seed/${seed}-${originalIndex}-${i}/800/450`,
          );
        storyboardDispatch({
          type: "UPDATE_VISUAL_ITEM",
          payload: { id: originalIndex, data: fallbacks },
        });
      }
    },
    [scenes, selectedModel, storyboardDispatch],
  );

  const handleGenerateVideo = React.useCallback(
    async (originalIndex: number, imageUrl: string, prompt: string) => {
      storyboardDispatch({
        type: "UPDATE_VIDEO_ITEM",
        payload: { id: originalIndex, data: "loading" },
      });
      try {
        const scene = scenes.find((s) => s.originalIndex === originalIndex);

        // Look up character image reference if scene has a soulFocus
        let referenceImageUrl = imageUrl;
        if (!referenceImageUrl && scene?.soulFocus && characterList) {
          const matchingChar = characterList.find(
            (c) =>
              c.name?.toLowerCase() === scene.soulFocus?.toLowerCase() ||
              scene.soulFocus?.toLowerCase().includes(c.name?.toLowerCase()),
          );
          if (matchingChar?.imageUrl) {
            referenceImageUrl = matchingChar.imageUrl;
            addLog(
              "STORYBOARD",
              "INFO",
              `Using visual profile of ${matchingChar.name} as reference for video generation.`,
            );
          }
        }

        // Premium 13-Topic hyper-accurate motion synthesis
        const promptToUse =
          scene?.videoPrompt ||
          [
            scene?.linkedPrompt ? `Concept Base: ${scene.linkedPrompt}.` : "",
            prompt ? `Shot Context: ${prompt}.` : "",
            scene?.soulFocus
              ? `Primary Character Motion: ${scene.soulFocus}.`
              : "",
            scene?.vfxCompounds
              ? `Lens Settings & Dynamic VFX: ${scene.vfxCompounds}.`
              : "",
            `Motion Spec: High-fidelity cinematic anime keyframe flow, smooth dynamic camera pan, highly detailed.`,
          ]
            .filter(Boolean)
            .join(" ");

        const videoUrl = await generateVideo(
          promptToUse,
          selectedModel,
          undefined,
          referenceImageUrl,
        );
        if (videoUrl) {
          storyboardDispatch({
            type: "UPDATE_VIDEO_ITEM",
            payload: { id: originalIndex, data: videoUrl },
          });
        } else {
          storyboardDispatch({
            type: "UPDATE_VIDEO_ITEM",
            payload: { id: originalIndex, data: "" },
          });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Failed to generate video:", message);
        addLog(
          "STORYBOARD",
          "ERROR",
          `Video render failed for scene ${originalIndex + 1}: ${message}`,
        );
        storyboardDispatch({
          type: "UPDATE_VIDEO_ITEM",
          payload: { id: originalIndex, data: "" },
        });
      }
    },
    [scenes, selectedModel, storyboardDispatch, characterList, addLog],
  );

    // Create an initial frame (visualData entry) for a scene index
    const createInitialFrameForScene = React.useCallback(
      (sceneIndex: number) => {
        try {
          const placeholder = `https://picsum.photos/seed/scene-${sceneIndex}-frame/800/450`;
          storyboardDispatch({
            type: "UPDATE_VISUAL_ITEM",
            payload: { id: sceneIndex, data: [placeholder] },
          });
        } catch (err) {
          console.warn("createInitialFrameForScene failed", err);
        }
      },
      [storyboardDispatch],
    );

  const handleGenerateAll = React.useCallback(async () => {
    addLog(
      "STORYBOARD",
      "PROCESSING",
      `Starting AI generation for ${scenes.length} scenes.`,
    );
    storyboardDispatch({ type: "SET_GENERATING", payload: true });

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      if (
        !visualData[scene.originalIndex] ||
        visualData[scene.originalIndex].length === 0 ||
        visualData[scene.originalIndex][0] === "loading"
      ) {
        storyboardDispatch({
          type: "UPDATE_VISUAL_ITEM",
          payload: { id: scene.originalIndex, data: ["loading"] },
        });
        try {
          const promptToUse =
            scene.linkedPrompt ||
            [
              scene.section ? `Setting: ${scene.section}.` : "",
              scene.soulFocus ? `Subject Focus: ${scene.soulFocus}.` : "",
              scene.visuals ? `Action: ${scene.visuals}.` : "",
              scene.assets ? `Objects & Elements: ${scene.assets}.` : "",
              scene.sound ? `Environment Atmosphere: ${scene.sound}.` : "",
              scene.emotionalKey
                ? `Visual Tone & Mood: ${scene.emotionalKey}.`
                : "",
              scene.subtext
                ? `Psychological Undercurrent: ${scene.subtext}.`
                : "",
              scene.vfxCompounds
                ? `Cinematography & Special Effects: ${scene.vfxCompounds}.`
                : "",
            ]
              .filter(Boolean)
              .join(" ");

          const promises = Array(4)
            .fill(0)
            .map((_, idx) =>
              generateSceneImage(`${promptToUse} Variation ${idx + 1}`),
            );
          const results = await Promise.all(promises);
          const images = results.map(
            (url, idx) =>
              url ||
              `https://picsum.photos/seed/${encodeURIComponent(promptToUse.slice(0, 50))}-${scene.originalIndex}-${idx}/800/450`,
          );
          storyboardDispatch({
            type: "UPDATE_VISUAL_ITEM",
            payload: { id: scene.originalIndex, data: images },
          });
        } catch (error) {
          const promptToUse =
            scene.linkedPrompt ||
            [
              scene.section ? `Setting: ${scene.section}.` : "",
              scene.soulFocus ? `Subject Focus: ${scene.soulFocus}.` : "",
              scene.visuals ? `Action: ${scene.visuals}.` : "",
              scene.assets ? `Objects & Elements: ${scene.assets}.` : "",
              scene.sound ? `Environment Atmosphere: ${scene.sound}.` : "",
              scene.emotionalKey
                ? `Visual Tone & Mood: ${scene.emotionalKey}.`
                : "",
              scene.subtext
                ? `Psychological Undercurrent: ${scene.subtext}.`
                : "",
              scene.vfxCompounds
                ? `Cinematography & Special Effects: ${scene.vfxCompounds}.`
                : "",
            ]
              .filter(Boolean)
              .join(" ");

          const fallbacks = Array(4)
            .fill(0)
            .map(
              (_, idx) =>
                `https://picsum.photos/seed/${encodeURIComponent(promptToUse.slice(0, 50))}-${scene.originalIndex}-${idx}/800/450`,
            );
          storyboardDispatch({
            type: "UPDATE_VISUAL_ITEM",
            payload: { id: scene.originalIndex, data: fallbacks },
          });
        }
      }
    }
    storyboardDispatch({ type: "SET_GENERATING", payload: false });
    addLog(
      "STORYBOARD",
      "COMPLETED",
      "AI generation finished. Storyboard is ready.",
    );
  }, [scenes, visualData, selectedModel, addLog, storyboardDispatch]);

  const handleFullProductionLoop = React.useCallback(async () => {
    setIsProductionLoopActive(true);
    setProductionProgress(0);

    try {
      // Phase 1: Synthesize All Images
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        setProductionProgress(((i + 0.5) / scenes.length) * 50);
        await handleGenerateVisual(
          scene.originalIndex,
          scene.linkedPrompt || scene.visuals,
        );
      }

      // Phase 2: Ignite All Motion Engines (Video)
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        setProductionProgress(50 + ((i + 0.5) / scenes.length) * 50);
        const currentVisuals = visualData[scene.originalIndex] || [];
        let imageUrl =
          currentVisuals[0] && currentVisuals[0] !== "loading"
            ? currentVisuals[0]
            : "";
        if (!imageUrl && scene.soulFocus && characterList) {
          const matchingChar = characterList.find(
            (c) =>
              c.name?.toLowerCase() === scene.soulFocus?.toLowerCase() ||
              scene.soulFocus?.toLowerCase().includes(c.name?.toLowerCase()),
          );
          if (matchingChar?.imageUrl) {
            imageUrl = matchingChar.imageUrl;
          }
        }
        if (!imageUrl) {
          imageUrl = `https://picsum.photos/seed/scene-${scene.originalIndex}/800/450`;
        }
        await handleGenerateVideo(
          scene.originalIndex,
          imageUrl,
          scene.linkedPrompt || scene.visuals,
        );
      }
    } catch (error) {
      console.error("Full Production Loop failed:", error);
    } finally {
      setIsProductionLoopActive(false);
      setProductionProgress(100);
    }
  }, [
    scenes,
    visualData,
    handleGenerateVisual,
    handleGenerateVideo,
    characterList,
  ]);

  const handleEnhanceAllNarration = React.useCallback(async () => {
    setIsEnhancingAllNarration(true);
    try {
      const updatedScenes = await Promise.all(
        scenes.map(async (scene) => {
          if (!scene.narration) return scene;
          const enhanced = await enhanceNarration(scene.narration);
          return { ...scene, narration: enhanced };
        }),
      );
      storyboardDispatch({ type: "SET_SCENES", payload: updatedScenes });
      updateScriptMarkdown(updatedScenes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancingAllNarration(false);
    }
  }, [scenes, updateScriptMarkdown, storyboardDispatch]);

  const handleEnhanceAllVisuals = React.useCallback(async () => {
    setIsEnhancingAllVisuals(true);
    try {
      let currentScenes = [...scenes];
      for (let i = 0; i < currentScenes.length; i++) {
        const scene = currentScenes[i];
        if (!scene.visuals) continue;

        storyboardDispatch({
          type: "SET_ENHANCING_SCENE",
          payload: { id: scene.id, isEnhancing: true },
        });

        const enhanced = await enhanceSceneVisuals(
          scene.visuals,
          scene.narration || "",
        );
        currentScenes[i] = { ...scene, visuals: enhanced };

        storyboardDispatch({ type: "SET_SCENES", payload: [...currentScenes] });
        storyboardDispatch({
          type: "SET_ENHANCING_SCENE",
          payload: { id: scene.id, isEnhancing: false },
        });
      }
      updateScriptMarkdown(currentScenes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancingAllVisuals(false);
    }
  }, [scenes, updateScriptMarkdown, storyboardDispatch]);

  const handleManifestScene = React.useCallback(
    async (sceneId: string) => {
      const scene = scenes.find((s) => s.id === sceneId);
      if (!scene) return;

      setIsManifestingSceneId(sceneId);
      addLog(
        "STORYBOARD",
        "PROCESSING",
        `Generating AI data for Scene: ${scene.section}`,
      );

      try {
        // Compile unified World and Cast DNA context dynamically
        const worldSections: string[] = [];
        if (generatedWorld)
          worldSections.push(`=== WORLD MANIFEST ===\n${generatedWorld}`);
        if (generatedWorldLore)
          worldSections.push(`=== HISTORY & ERAS ===\n${generatedWorldLore}`);
        if (generatedWorldFactions)
          worldSections.push(
            `=== FACTIONS & POWER BALANCE ===\n${generatedWorldFactions}`,
          );
        if (generatedWorldPowers)
          worldSections.push(
            `=== SYSTEMS & MECHANICS ===\n${generatedWorldPowers}`,
          );
        if (generatedWorldArchitecture)
          worldSections.push(
            `=== VISUAL STYLE & ARCHITECTURE ===\n${generatedWorldArchitecture}`,
          );
        if (generatedWorldAtlas)
          worldSections.push(
            `=== GEOGRAPHY & ENVIRONMENT ===\n${generatedWorldAtlas}`,
          );
        if (generatedWorldCulture)
          worldSections.push(
            `=== CUSTOMS & ETHOS ===\n${generatedWorldCulture}`,
          );
        if (generatedWorldSystems)
          worldSections.push(
            `=== TECHNOLOGICAL INFRASTRUCTURE ===\n${generatedWorldSystems}`,
          );
        const compiledWorldLore =
          worldSections.length > 0 ? worldSections.join("\n\n") : null;

        const castSections: string[] = [];
        if (generatedCharacters)
          castSections.push(`=== CAST SUMMARY ===\n${generatedCharacters}`);
        if (characterDNA)
          castSections.push(`=== IDENTITY & VOICE DNA ===\n${characterDNA}`);
        if (characterDynamics)
          castSections.push(
            `=== RELATIONSHIP DYNAMICS ===\n${characterDynamics}`,
          );
        if (characterIntegrity)
          castSections.push(
            `=== TECHNICAL DESIGN RULES ===\n${characterIntegrity}`,
          );
        if (characterRelationships)
          castSections.push(
            `=== INTERPERSONAL NETWORKS ===\n${characterRelationships}`,
          );
        const compiledCastDNA =
          castSections.length > 0 ? castSections.join("\n\n") : null;

        const result = await generateScene(
          generatedScript || "",
          `Scene Section: ${scene.section}\nExisting Context: ${scene.narration}\nVisuals to maintain: ${scene.visuals}`,
          selectedModel,
          compiledWorldLore,
          compiledCastDNA,
        );

        if (result) {
          const updatedScenes = scenes.map((s) =>
            s.id === sceneId ? { ...s, ...result } : s,
          );
          storyboardDispatch({ type: "SET_SCENES", payload: updatedScenes });
          updateScriptMarkdown(updatedScenes);
          addLog(
            "STORYBOARD",
            "COMPLETED",
            `Successfully manifested Scene: ${scene.section}`,
          );
        }
      } catch (error) {
        console.error("Failed to manifest scene:", error);
        addLog(
          "STORYBOARD",
          "ERROR",
          `Failed to manifest Scene: ${scene.section}`,
        );
      } finally {
        setIsManifestingSceneId(null);
      }
    },
    [
      scenes,
      generatedScript,
      selectedModel,
      storyboardDispatch,
      updateScriptMarkdown,
      addLog,
    ],
  );

  const handleAddScene = React.useCallback(async () => {
    const nextIndex =
      scenes.length > 0
        ? Math.max(...scenes.map((s) => s.originalIndex)) + 1
        : 0;
    const fallbackScene: Scene = {
      id: `scene-${Math.random().toString(36).substring(2, 9)}-${nextIndex}`,
      originalIndex: nextIndex,
      section: `SCENE ${nextIndex + 1} - INT. STUDIO - DAY`,
      narration: "Character narration or dialogue goes here...",
      visuals: "Cinematic shot description with camera details...",
      sound: "Ambient soundscape, BGM, and foley cues...",
      duration: "5s",
      soulFocus: "Active Subject",
      emotionalKey: "Tension",
      vfxCompounds: "Volumetric bloom, HSL color grade",
      assets: "Key environment props",
      subtext: "Psychological narrative undercurrent",
      linkedPrompt: "",
      videoPrompt: "",
    };

    if (!generatedScript) {
      const updatedScenes = [...scenes, fallbackScene];
      storyboardDispatch({ type: "SET_SCENES", payload: updatedScenes });
      updateScriptMarkdown(updatedScenes);
      addLog(
        "STORYBOARD",
        "MODIFIED",
        `Inserted new production unit at index ${nextIndex}.`,
      );
      // create an initial frame for the new scene
      createInitialFrameForScene(nextIndex);
      return;
    }

    setIsManifestingSceneId(`scene-${nextIndex}`);
    addLog(
      "STORYBOARD",
      "PROCESSING",
      `Generating new scene for unit ${nextIndex + 1}...`,
    );

    try {
      const worldSections: string[] = [];
      if (generatedWorld)
        worldSections.push(`=== WORLD MANIFEST ===\n${generatedWorld}`);
      if (generatedWorldLore)
        worldSections.push(`=== HISTORY & ERAS ===\n${generatedWorldLore}`);
      if (generatedWorldFactions)
        worldSections.push(
          `=== FACTIONS & POWER BALANCE ===\n${generatedWorldFactions}`,
        );
      if (generatedWorldPowers)
        worldSections.push(
          `=== SYSTEMS & MECHANICS ===\n${generatedWorldPowers}`,
        );
      if (generatedWorldArchitecture)
        worldSections.push(
          `=== VISUAL STYLE & ARCHITECTURE ===\n${generatedWorldArchitecture}`,
        );
      if (generatedWorldAtlas)
        worldSections.push(
          `=== GEOGRAPHY & ENVIRONMENT ===\n${generatedWorldAtlas}`,
        );
      if (generatedWorldCulture)
        worldSections.push(`=== CUSTOMS & ETHOS ===\n${generatedWorldCulture}`);
      if (generatedWorldSystems)
        worldSections.push(
          `=== TECHNOLOGICAL INFRASTRUCTURE ===\n${generatedWorldSystems}`,
        );
      const compiledWorldLore =
        worldSections.length > 0 ? worldSections.join("\n\n") : null;

      const castSections: string[] = [];
      if (generatedCharacters)
        castSections.push(`=== CAST SUMMARY ===\n${generatedCharacters}`);
      if (characterDNA)
        castSections.push(`=== IDENTITY & VOICE DNA ===\n${characterDNA}`);
      if (characterDynamics)
        castSections.push(
          `=== RELATIONSHIP DYNAMICS ===\n${characterDynamics}`,
        );
      if (characterIntegrity)
        castSections.push(
          `=== TECHNICAL DESIGN RULES ===\n${characterIntegrity}`,
        );
      if (characterRelationships)
        castSections.push(
          `=== INTERPERSONAL NETWORKS ===\n${characterRelationships}`,
        );
      const compiledCastDNA =
        castSections.length > 0 ? castSections.join("\n\n") : null;

      const generatedScene = await generateScene(
        generatedScript,
        `Create Scene ${nextIndex + 1} as a strong production unit for the storyboard. Build on the current script flow and expand the next beat into a usable scene draft.`,
        selectedModel,
        compiledWorldLore,
        compiledCastDNA,
      );

      const newScene: Scene = {
        ...fallbackScene,
        section: `SCENE ${nextIndex + 1}`,
        narration: generatedScene.narration,
        visuals: generatedScene.visuals,
        sound: generatedScene.sound,
        linkedPrompt: generatedScene.visuals,
      };

      const updatedScenes = [...scenes, newScene];
      storyboardDispatch({ type: "SET_SCENES", payload: updatedScenes });
      updateScriptMarkdown(updatedScenes);
      addLog(
        "STORYBOARD",
        "COMPLETED",
        `Generated and inserted Scene ${nextIndex + 1}.`,
      );
      // create an initial frame for the newly generated scene
      createInitialFrameForScene(nextIndex);
    } catch (error) {
      console.error("Failed to create scene:", error);
      const updatedScenes = [...scenes, fallbackScene];
      storyboardDispatch({ type: "SET_SCENES", payload: updatedScenes });
      updateScriptMarkdown(updatedScenes);
      addLog(
        "STORYBOARD",
        "ERROR",
        `Scene generation failed; inserted fallback scene ${nextIndex + 1}.`,
      );
      // ensure a frame exists even when generation fails
      createInitialFrameForScene(nextIndex);
    } finally {
      setIsManifestingSceneId(null);
    }
  }, [
    scenes,
    generatedScript,
    generatedWorld,
    generatedWorldLore,
    generatedWorldFactions,
    generatedWorldPowers,
    generatedWorldArchitecture,
    generatedWorldAtlas,
    generatedWorldCulture,
    generatedWorldSystems,
    generatedCharacters,
    characterDNA,
    characterDynamics,
    characterIntegrity,
    characterRelationships,
    selectedModel,
    updateScriptMarkdown,
    addLog,
    storyboardDispatch,
    createInitialFrameForScene,
  ]);

  const startEditing = React.useCallback((scene: Scene) => {
    setEditingSceneId(scene.id);
    setEditForm(scene);
  }, []);

  const saveSceneEdits = React.useCallback(() => {
    if (!editingSceneId) return;
    const updatedScenes = scenes.map((scene) =>
      scene.id === editingSceneId
        ? ({ ...scene, ...editForm } as Scene)
        : scene,
    );
    storyboardDispatch({ type: "SET_SCENES", payload: updatedScenes });
    updateScriptMarkdown(updatedScenes);
    addLog(
      "STORYBOARD",
      "UPDATED",
      `Refined metadata for production unit ID: ${editingSceneId}.`,
    );
    setEditingSceneId(null);
    setEditForm({});
  }, [
    editingSceneId,
    scenes,
    editForm,
    updateScriptMarkdown,
    addLog,
    storyboardDispatch,
  ]);

  const { setHandlers } = React.useContext<any>(StoryboardContext);
  const { activeTab } = useOutletContext<{ activeTab: StoryboardTab }>();

  React.useEffect(() => {
    setHandlers({
      handleEnhanceAllNarration,
      handleEnhanceAllVisuals,
      handleFullProductionLoop,
      handleGenerateAll,
      handleAddScene,
      isGlobalEnhancing,
      isProductionLoopActive,
      productionProgress,
      isGuideOpen,
      setIsGuideOpen,
      scenesLength: scenes.length,
      isGenerating: isGeneratingVisuals,
      handleManifestScene,
      isManifestingSceneId,
    });
  }, [
    isGlobalEnhancing,
    scenes,
    isProductionLoopActive,
    productionProgress,
    isGuideOpen,
    isGeneratingVisuals,
    isManifestingSceneId,
    handleManifestScene,
  ]);

  const getLoadingMessage = () => {
    switch (activeTab) {
      case "angles":
        return "Calculating Camera Vectors...";
      case "composition":
        return "Mapping Spatial Balance...";
      case "animatic":
        return "Igniting Motion Engines...";
      case "audio":
        return "Synthesizing Audio Stems...";
      default:
        return "Initializing Visual Buffer...";
    }
  };

  const renderTabContent = () => {
    if (isGeneratingVisuals) {
      return (
        <StoryboardLoadingPage
          message={getLoadingMessage()}
          subtext="AI model is rendering cinematic manifests"
        />
      );
    }

    if (scenes.length === 0 && activeTab !== "animatic") {
      return (
        <StoryboardEmptyState
          onLoadDemo={loadDemoProject}
          onLaunch={handleAddScene}
          isGenerating={isGeneratingVisuals}
        />
      );
    }

    switch (activeTab) {
      case "video":
        return (
          <FramesTab
            scenes={scenes}
            visualData={visualData}
            videoData={videoData}
            viewMode={viewMode}
            promptList={promptList}
            editingSceneId={editingSceneId}
            editForm={editForm}
            isEnhancingNarration={isEnhancingNarration}
            isEnhancing={isEnhancing}
            isRewritingTension={isRewritingTension}
            isSuggestingDuration={isSuggestingDuration}
            enhancingSceneIds={enhancingSceneIds}
            setEditForm={setEditForm}
            handleDragEnd={handleDragEnd}
            handleGenerateVisual={handleGenerateVisual}
            handleGenerateVideo={handleGenerateVideo}
            startEditing={startEditing}
            cancelEditing={() => {
              setEditingSceneId(null);
              setEditForm({});
            }}
            saveSceneEdits={saveSceneEdits}
            handleEnhanceNarration={handleEnhanceNarration}
            handleEnhanceVisuals={handleEnhanceVisuals}
            handleRewriteTension={handleRewriteTension}
            handleSuggestDuration={handleSuggestDuration}
            handleAddScene={handleAddScene}
            isGenerating={isGeneratingVisuals}
            handleManifestScene={handleManifestScene}
            isManifestingSceneId={isManifestingSceneId}
            onLoadDemo={loadDemoProject}
          />
        );
      case "angles":
        return <AnglesTab />;
      case "composition":
        return <CompositionTab scenes={scenes} />;
      case "animatic":
        return <AnimaticTab scenes={scenes} videoData={videoData} />;
      case "audio":
        return <AudioTab scenes={scenes} />;
      default:
        return (
          <FramesTab
            scenes={scenes}
            visualData={visualData}
            videoData={videoData}
            promptList={promptList}
            editingSceneId={editingSceneId}
            editForm={editForm}
            isEnhancingNarration={isEnhancingNarration}
            isEnhancing={isEnhancing}
            isRewritingTension={isRewritingTension}
            isSuggestingDuration={isSuggestingDuration}
            enhancingSceneIds={enhancingSceneIds}
            setEditForm={setEditForm}
            handleDragEnd={handleDragEnd}
            handleGenerateVisual={handleGenerateVisual}
            handleGenerateVideo={handleGenerateVideo}
            startEditing={startEditing}
            cancelEditing={() => {
              setEditingSceneId(null);
              setEditForm({});
            }}
            saveSceneEdits={saveSceneEdits}
            handleEnhanceNarration={handleEnhanceNarration}
            handleEnhanceVisuals={handleEnhanceVisuals}
            handleRewriteTension={handleRewriteTension}
            handleSuggestDuration={handleSuggestDuration}
            handleAddScene={handleAddScene}
            isGenerating={isGeneratingVisuals}
            handleManifestScene={handleManifestScene}
            isManifestingSceneId={isManifestingSceneId}
            onLoadDemo={loadDemoProject}
          />
        );
    }
  };

  const contextValue = React.useMemo(
    () => ({
      scenes,
      visualData,
      videoData,
      viewMode,
      promptList,
      editingSceneId,
      editForm,
      isEnhancingNarration,
      isEnhancing,
      isRewritingTension,
      isSuggestingDuration,
      enhancingSceneIds,
      setEditForm,
      handleDragEnd,
      handleGenerateVisual,
      handleGenerateVideo,
      startEditing,
      cancelEditing: () => {
        setEditingSceneId(null);
        setEditForm({});
      },
      saveSceneEdits,
      handleEnhanceNarration,
      handleEnhanceVisuals,
      handleRewriteTension,
      handleSuggestDuration,
      handleAddScene,
      isGenerating: isGeneratingVisuals,
      handleManifestScene,
      isManifestingSceneId,
      onLoadDemo: loadDemoProject,
    }),
    [
      scenes,
      visualData,
      videoData,
      viewMode,
      promptList,
      editingSceneId,
      editForm,
      isEnhancingNarration,
      isEnhancing,
      isRewritingTension,
      isSuggestingDuration,
      enhancingSceneIds,
      setEditForm,
      handleDragEnd,
      handleGenerateVisual,
      handleGenerateVideo,
      startEditing,
      saveSceneEdits,
      handleEnhanceNarration,
      handleEnhanceVisuals,
      handleRewriteTension,
      handleSuggestDuration,
      handleAddScene,
      isGeneratingVisuals,
      handleManifestScene,
      isManifestingSceneId,
      loadDemoProject,
    ],
  );

  return (
    <StoryboardPageContext.Provider value={contextValue}>
      <div
        data-testid="marker-visual-storyboard"
        className="storyboard-container"
      >
        <AnimatePresence>{isGuideOpen && <PlanningGuide />}</AnimatePresence>

        <Card
          className={cn(
            s.page.mainCard,
            activeTab === "video"
              ? s.page.mainCardFrames
              : s.page.mainCardNormal,
          )}
        >
          <div
            className={cn(
              s.page.innerBorder,
              activeTab === "video"
                ? "border-orange-500/20 group-hover/card:border-orange-500/40"
                : "border-white/5",
            )}
          />

          <div className={s.page.mainCardInner}>
            {activeTab === "video" && scenes.length > 0 && (
              <div className="flex justify-end mb-6">
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "w-9 h-9 rounded-lg transition-all",
                      viewMode === "grid"
                        ? "bg-studio text-black hover:bg-studio"
                        : "text-zinc-500 hover:text-white",
                    )}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "w-9 h-9 rounded-lg transition-all",
                      viewMode === "list"
                        ? "bg-studio text-black hover:bg-studio"
                        : "text-zinc-500 hover:text-white",
                    )}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            <DeferredRender
              delay={16}
              fallback={
                <div className="h-96 flex items-center justify-center opacity-10">
                  <LayoutGrid className="w-12 h-12 animate-pulse" />
                </div>
              }
            >
                {isGeneratingVisuals ? (
                  <StoryboardLoadingPage
                    message={getLoadingMessage()}
                    subtext="AI model is rendering cinematic manifests"
                  />
                ) : scenes.length === 0 && activeTab !== "animatic" && activeTab !== "composition" ? (
                  <StoryboardEmptyState
                    onLoadDemo={loadDemoProject}
                    onLaunch={handleAddScene}
                    isGenerating={isGeneratingVisuals}
                  />
                ) : (
                  <Outlet />
                )}
            </DeferredRender>
          </div>
        </Card>
      </div>
    </StoryboardPageContext.Provider>
  );
}
