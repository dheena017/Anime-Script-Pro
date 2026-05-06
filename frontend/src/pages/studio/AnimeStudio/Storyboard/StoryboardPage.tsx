import React, { useEffect, useState } from 'react';
import { Layout as LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { useStoryboard, useEngineState } from '@/contexts/generator';
import { useOutletContext } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { DropResult } from '@hello-pangea/dnd';
import {
  enhanceSceneVisuals,
  generateSceneImage,
  enhanceNarration,
  rewriteForTension,
  suggestDuration,
  generateSceneVideo,
  generateScene
} from '@/services/api/gemini';
import { StoryboardTab } from './Tabs/StoryboardTabs';

// Sub-components
import { PlanningGuide } from './components/PlanningGuide';
import { StoryboardContext } from './StoryboardLayout';
import { DeferredRender } from '@/pages/studio/components/studio/DeferredRender';

// Modular tab components
import { FramesTab } from './Tabs/FramesTab';
import { AnglesTab } from './Tabs/AnglesTab';
import { CompositionTab } from './Tabs/CompositionTab';
import { AnimaticTab } from './Tabs/AnimaticTab';
import { AudioTab } from './Tabs/AudioTab';
import { StoryboardLoadingPage } from './components/StoryboardLoadingPage';
import { StoryboardEmptyState } from './components/StoryboardEmptyState';

interface Scene {
  id: string;
  originalIndex: number;
  section: string;
  narration: string;
  visuals: string;
  sound: string;
  duration: string;
  linkedPrompt?: string;
}

export function StoryboardPage() {
  const {
    generatedScript, setGeneratedScript,
    generatedImagePrompts,
    addLog
  } = useGenerator();

  const { state: storyboardState, dispatch: storyboardDispatch } = useStoryboard();
  const { scenes, visualData, videoData, isGeneratingVisuals, enhancingSceneIds } = storyboardState;
  const { selectedModel } = useEngineState();

  const promptList = React.useMemo(() => generatedImagePrompts
    ? generatedImagePrompts.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.includes('---'))
    : [], [generatedImagePrompts]);

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
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
  const [isManifestingSceneId, setIsManifestingSceneId] = useState<string | null>(null);

  const isGlobalEnhancing = isEnhancingAllNarration || isEnhancingAllVisuals;
  const lastScriptRef = React.useRef<string | null>(null);

  const parseStoryboard = (script: string | null): Scene[] => {
    if (!script) return [];
    const lines = script.split('\n');
    const tableLines = lines.filter(l => l.includes('|') && !l.includes('---'));
    if (tableLines.length <= 1) return [];

    return tableLines.slice(1).map((row, idx) => {
      const cells = row.split('|').filter(cell => cell.trim() !== "").map(cell => cell.trim());
      return {
        id: `scene-${Math.random().toString(36).substring(2, 9)}-${idx}`,
        originalIndex: idx,
        section: cells[0] || '',
        narration: cells[1] || '',
        visuals: cells[2] || '',
        sound: cells[3] || '',
        duration: cells[4] || '5s',
        linkedPrompt: cells[5] || ''
      };
    });
  };

  useEffect(() => {
    if (generatedScript !== lastScriptRef.current) {
      storyboardDispatch({ type: 'SET_SCENES', payload: parseStoryboard(generatedScript) });
      lastScriptRef.current = generatedScript;
    }
  }, [generatedScript, storyboardDispatch]);

  const updateScriptMarkdown = React.useCallback((items: Scene[]) => {
    let currentScript = generatedScript;
    if (!currentScript || !currentScript.includes('|')) {
      currentScript = "# Anime Script\n\n| Section | Voiceover Narration | Visual/Scene Description | Sound Effect/BGM Cues | Duration | Linked Prompt |\n| :--- | :--- | :--- | :--- | :--- | :--- |";
    }
    const lines = currentScript.split('\n');
    const tableHeaderIndex = lines.findIndex(l => l.includes('|') && l.toLowerCase().includes('section'));
    if (tableHeaderIndex !== -1) {
      const preTable = lines.slice(0, tableHeaderIndex + 2);
      let tableEndIndex = tableHeaderIndex + 2;
      while (tableEndIndex < lines.length && lines[tableEndIndex].includes('|')) tableEndIndex++;
      const postTable = lines.slice(tableEndIndex);
      const newTableRows = items.map(scene => `| ${scene.section} | ${scene.narration} | ${scene.visuals} | ${scene.sound} | ${scene.duration} | ${scene.linkedPrompt || ''} |`);
      const newScript = [...preTable, ...newTableRows, ...postTable].join('\n');
      lastScriptRef.current = newScript;
      setGeneratedScript(newScript);
    }
  }, [generatedScript, setGeneratedScript]);

  const handleDragEnd = React.useCallback((result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(scenes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    storyboardDispatch({ type: 'SET_SCENES', payload: items });
    updateScriptMarkdown(items);
  }, [scenes, updateScriptMarkdown, storyboardDispatch]);

  const handleEnhanceNarration = React.useCallback(async () => {
    if (!editForm.narration) return;
    setIsEnhancingNarration(true);
    try {
      const enhanced = await enhanceNarration(editForm.narration);
      setEditForm(prev => ({ ...prev, narration: enhanced }));
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
      const enhanced = await enhanceSceneVisuals(editForm.visuals, editForm.narration || '');
      setEditForm(prev => ({ ...prev, visuals: enhanced }));
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
      setEditForm(prev => ({ ...prev, visuals: rewritten }));
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
      setEditForm(prev => ({ ...prev, duration: suggested }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSuggestingDuration(false);
    }
  }, [editForm.narration]);

  const handleGenerateVisual = React.useCallback(async (originalIndex: number, visualsDescription: string) => {
    storyboardDispatch({ type: 'UPDATE_VISUAL_ITEM', payload: { id: originalIndex, data: ['loading'] } });
    try {
      const promises = Array(4).fill(0).map((_, i) => generateSceneImage(`${visualsDescription} Variation ${i + 1}`, selectedModel));
      const results = await Promise.all(promises);
      const images = results.map((url, i) => url || `https://picsum.photos/seed/${encodeURIComponent(visualsDescription.slice(0, 50))}-${originalIndex}-${i}/800/450`);
      storyboardDispatch({ type: 'UPDATE_VISUAL_ITEM', payload: { id: originalIndex, data: images } });
    } catch (error) {
      console.error("Failed to generate image:", error);
      const seed = encodeURIComponent(visualsDescription.slice(0, 50));
      const fallbacks = Array(4).fill(0).map((_, i) => `https://picsum.photos/seed/${seed}-${originalIndex}-${i}/800/450`);
      storyboardDispatch({ type: 'UPDATE_VISUAL_ITEM', payload: { id: originalIndex, data: fallbacks } });
    }
  }, [selectedModel, storyboardDispatch]);

  const handleGenerateVideo = React.useCallback(async (originalIndex: number, _imageUrl: string, prompt: string) => {
    storyboardDispatch({ type: 'UPDATE_VIDEO_ITEM', payload: { id: originalIndex, data: 'loading' } });
    try {
      const videoUrl = await generateSceneVideo(prompt, selectedModel);
      if (videoUrl) {
        storyboardDispatch({ type: 'UPDATE_VIDEO_ITEM', payload: { id: originalIndex, data: videoUrl } });
      } else {
        storyboardDispatch({ type: 'UPDATE_VIDEO_ITEM', payload: { id: originalIndex, data: "https://vjs.zencdn.net/v/oceans.mp4" } });
      }
    } catch (error) {
      console.error("Failed to generate video:", error);
      storyboardDispatch({ type: 'UPDATE_VIDEO_ITEM', payload: { id: originalIndex, data: "https://vjs.zencdn.net/v/oceans.mp4" } });
    }
  }, [selectedModel, storyboardDispatch]);

  const handleGenerateAll = React.useCallback(async () => {
    addLog("STORYBOARD", "PROCESSING", `Starting AI generation for ${scenes.length} scenes.`);
    storyboardDispatch({ type: 'SET_GENERATING', payload: true });

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      if (!visualData[scene.originalIndex] || visualData[scene.originalIndex].length === 0 || visualData[scene.originalIndex][0] === 'loading') {
        storyboardDispatch({ type: 'UPDATE_VISUAL_ITEM', payload: { id: scene.originalIndex, data: ['loading'] } });
        try {
          const promptToUse = scene.linkedPrompt || scene.visuals;
          const promises = Array(4).fill(0).map((_, idx) => generateSceneImage(`${promptToUse} Variation ${idx + 1}`, selectedModel));
          const results = await Promise.all(promises);
          const images = results.map((url, idx) => url || `https://picsum.photos/seed/${encodeURIComponent(promptToUse.slice(0, 50))}-${scene.originalIndex}-${idx}/800/450`);
          storyboardDispatch({ type: 'UPDATE_VISUAL_ITEM', payload: { id: scene.originalIndex, data: images } });
        } catch (error) {
          const promptToUse = scene.linkedPrompt || scene.visuals;
          const fallbacks = Array(4).fill(0).map((_, idx) => `https://picsum.photos/seed/${encodeURIComponent(promptToUse.slice(0, 50))}-${scene.originalIndex}-${idx}/800/450`);
          storyboardDispatch({ type: 'UPDATE_VISUAL_ITEM', payload: { id: scene.originalIndex, data: fallbacks } });
        }
      }
    }
    storyboardDispatch({ type: 'SET_GENERATING', payload: false });
    addLog("STORYBOARD", "COMPLETED", "AI generation finished. Storyboard is ready.");
  }, [scenes, visualData, selectedModel, addLog, storyboardDispatch]);

  const handleFullProductionLoop = React.useCallback(async () => {
    setIsProductionLoopActive(true);
    setProductionProgress(0);

    try {
      // Phase 1: Synthesize All Images
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        setProductionProgress(((i + 0.5) / scenes.length) * 50);
        await handleGenerateVisual(scene.originalIndex, scene.linkedPrompt || scene.visuals);
      }

      // Phase 2: Ignite All Motion Engines (Video)
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        setProductionProgress(50 + ((i + 0.5) / scenes.length) * 50);
        const currentVisuals = visualData[scene.originalIndex] || [];
        const imageUrl = currentVisuals[0] && currentVisuals[0] !== 'loading' ? currentVisuals[0] : `https://picsum.photos/seed/scene-${scene.originalIndex}/800/450`;
        await handleGenerateVideo(scene.originalIndex, imageUrl, scene.linkedPrompt || scene.visuals);
      }
    } catch (error) {
      console.error("Full Production Loop failed:", error);
    } finally {
      setIsProductionLoopActive(false);
      setProductionProgress(100);
    }
  }, [scenes, visualData, handleGenerateVisual, handleGenerateVideo]);

  const handleEnhanceAllNarration = React.useCallback(async () => {
    setIsEnhancingAllNarration(true);
    try {
      const updatedScenes = await Promise.all(scenes.map(async (scene) => {
        if (!scene.narration) return scene;
        const enhanced = await enhanceNarration(scene.narration);
        return { ...scene, narration: enhanced };
      }));
      storyboardDispatch({ type: 'SET_SCENES', payload: updatedScenes });
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
          type: 'SET_ENHANCING_SCENE',
          payload: { id: scene.id, isEnhancing: true }
        });

        const enhanced = await enhanceSceneVisuals(scene.visuals, scene.narration || '');
        currentScenes[i] = { ...scene, visuals: enhanced };

        storyboardDispatch({ type: 'SET_SCENES', payload: [...currentScenes] });
        storyboardDispatch({
          type: 'SET_ENHANCING_SCENE',
          payload: { id: scene.id, isEnhancing: false }
        });
      }
      updateScriptMarkdown(currentScenes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancingAllVisuals(false);
    }
  }, [scenes, updateScriptMarkdown, storyboardDispatch]);

  const handleManifestScene = React.useCallback(async (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    setIsManifestingSceneId(sceneId);
    addLog("STORYBOARD", "PROCESSING", `Generating AI data for Scene: ${scene.section}`);

    try {
      const result = await generateScene(
        generatedScript || '',
        `Scene Section: ${scene.section}\nExisting Context: ${scene.narration}\nVisuals to maintain: ${scene.visuals}`,
        selectedModel
      );

      if (result) {
        const updatedScenes = scenes.map(s => s.id === sceneId ? { ...s, ...result } : s);
        storyboardDispatch({ type: 'SET_SCENES', payload: updatedScenes });
        updateScriptMarkdown(updatedScenes);
        addLog("STORYBOARD", "COMPLETED", `Successfully manifested Scene: ${scene.section}`);
      }
    } catch (error) {
      console.error("Failed to manifest scene:", error);
      addLog("STORYBOARD", "ERROR", `Failed to manifest Scene: ${scene.section}`);
    } finally {
      setIsManifestingSceneId(null);
    }
  }, [scenes, generatedScript, selectedModel, storyboardDispatch, updateScriptMarkdown, addLog]);

  const handleAddScene = React.useCallback(() => {
    const nextIndex = scenes.length > 0 ? Math.max(...scenes.map(s => s.originalIndex)) + 1 : 0;
    const newScene: Scene = {
      id: `scene-${Math.random().toString(36).substring(2, 9)}-${nextIndex}`,
      originalIndex: nextIndex,
      section: 'New Scene',
      narration: 'Character narration or dialogue goes here...',
      visuals: 'Cinematic shot description...',
      sound: 'SFX and BGM cues',
      duration: '5s'
    };
    const updatedScenes = [...scenes, newScene];
    storyboardDispatch({ type: 'SET_SCENES', payload: updatedScenes });
    updateScriptMarkdown(updatedScenes);
    addLog("STORYBOARD", "MODIFIED", `Inserted new production unit at index ${nextIndex}.`);
  }, [scenes, updateScriptMarkdown, addLog, storyboardDispatch]);


  const startEditing = React.useCallback((scene: Scene) => {
    setEditingSceneId(scene.id);
    setEditForm(scene);
  }, []);

  const saveSceneEdits = React.useCallback(() => {
    if (!editingSceneId) return;
    const updatedScenes = scenes.map(scene => scene.id === editingSceneId ? { ...scene, ...editForm } as Scene : scene);
    storyboardDispatch({ type: 'SET_SCENES', payload: updatedScenes });
    updateScriptMarkdown(updatedScenes);
    addLog("STORYBOARD", "UPDATED", `Refined metadata for production unit ID: ${editingSceneId}.`);
    setEditingSceneId(null);
    setEditForm({});
  }, [editingSceneId, scenes, editForm, updateScriptMarkdown, addLog, storyboardDispatch]);

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
      isManifestingSceneId
    });
  }, [isGlobalEnhancing, scenes, isProductionLoopActive, productionProgress, isGuideOpen, isGeneratingVisuals, isManifestingSceneId, handleManifestScene]);

  const getLoadingMessage = () => {
    switch (activeTab) {
      case 'angles': return "Calculating Camera Vectors...";
      case 'composition': return "Mapping Spatial Balance...";
      case 'animatic': return "Igniting Motion Engines...";
      case 'audio': return "Synthesizing Audio Stems...";
      default: return "Initializing Visual Buffer...";
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

    if (scenes.length === 0 && activeTab !== 'animatic') {
      return (
        <StoryboardEmptyState
          onLaunch={() => {
            window.dispatchEvent(new CustomEvent('studio-generate-storyboard'));
          }}
          isGenerating={isGeneratingVisuals}
        />
      );
    }

    switch (activeTab) {
      case 'frames':
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
            cancelEditing={() => { setEditingSceneId(null); setEditForm({}); }}
            saveSceneEdits={saveSceneEdits}
            handleEnhanceNarration={handleEnhanceNarration}
            handleEnhanceVisuals={handleEnhanceVisuals}
            handleRewriteTension={handleRewriteTension}
            handleSuggestDuration={handleSuggestDuration}
            handleAddScene={handleAddScene}
            isGenerating={isGeneratingVisuals}
            handleManifestScene={handleManifestScene}
            isManifestingSceneId={isManifestingSceneId}
          />
        );
      case 'angles':
        return <AnglesTab />;
      case 'composition':
        return <CompositionTab scenes={scenes} />;
      case 'animatic':
        return <AnimaticTab scenes={scenes} videoData={videoData} />;
      case 'audio':
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
            cancelEditing={() => { setEditingSceneId(null); setEditForm({}); }}
            saveSceneEdits={saveSceneEdits}
            handleEnhanceNarration={handleEnhanceNarration}
            handleEnhanceVisuals={handleEnhanceVisuals}
            handleRewriteTension={handleRewriteTension}
            handleSuggestDuration={handleSuggestDuration}
            handleAddScene={handleAddScene}
            isGenerating={isGeneratingVisuals}
            handleManifestScene={handleManifestScene}
            isManifestingSceneId={isManifestingSceneId}
          />
        );
    }
  };

  return (
    <div data-testid="marker-visual-storyboard" className="storyboard-container">
      <AnimatePresence>
        {isGuideOpen && <PlanningGuide />}
      </AnimatePresence>

      <Card className={cn(
        "bg-[#030303]/40 backdrop-blur-md overflow-hidden rounded-[3rem] relative group/card transition-all duration-700",
        activeTab === 'frames'
          ? "border-fuchsia-500/20 shadow-[0_0_50px_rgba(217,70,239,0.15)] hover:border-fuchsia-500/40"
          : "border-zinc-800/30 hover:border-zinc-700"
      )}>
        <div className="w-full p-8 lg:p-10 max-w-[1400px] mx-auto">
          {activeTab === 'frames' && (
            <div className="flex justify-end mb-6">
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={cn("w-9 h-9 rounded-lg transition-all", viewMode === 'grid' ? "bg-studio text-black hover:bg-studio" : "text-zinc-500 hover:text-white")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={cn("w-9 h-9 rounded-lg transition-all", viewMode === 'list' ? "bg-studio text-black hover:bg-studio" : "text-zinc-500 hover:text-white")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          <DeferredRender delay={16} fallback={<div className="h-96 flex items-center justify-center opacity-10"><LayoutGrid className="w-12 h-12 animate-pulse" /></div>}>
            {renderTabContent()}
          </DeferredRender>
        </div>
      </Card>
    </div>

  );
}


