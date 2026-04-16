import { useEffect, useMemo, useRef, useState } from 'react';
import { continueAnimeScript } from '@/services/geminiService';
import type { DropResult } from '@hello-pangea/dnd';
import type { Scene, ViewMode } from '@/components/studio/storyboard/types';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import {
  buildUpdatedStoryboardMarkdown,
  calculateSceneDuration,
  getStoryboardStatusColor,
  parseStoryboard,
} from '@/lib/storyboard';
import { useStoryboardHistory } from '@/hooks/useStoryboardHistory';

interface UseStoryboardStateArgs {
  generatedScript: string | null;
  setGeneratedScript: (script: string) => void;
  selectedModel: string;
}

export function useStoryboardState({ generatedScript, setGeneratedScript, selectedModel }: UseStoryboardStateArgs) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [visualData, setVisualData] = useState<Record<string, string>>({});
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Scene>>({});
  const [isContinuing, setIsContinuing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; scene: number } | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const [sceneStatus, setSceneStatus] = useState<Record<string, string>>({});
  const [directorsNotes, setDirectorsNotes] = useState<Record<string, string>>({});
  const [alternateTakes, setAlternateTakes] = useState<Record<string, Scene[]>>({});

  const [isPlayingAnimatic, setIsPlayingAnimatic] = useState(false);
  const [currentAnimaticIndex, setCurrentAnimaticIndex] = useState(0);

  const lastScriptRef = useRef<string | null>(null);
  const animaticTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { pastScripts, futureScripts, recordScriptChange, handleUndo, handleRedo } = useStoryboardHistory({
    generatedScript,
    setGeneratedScript,
  });

  useEffect(() => {
    if (generatedScript !== lastScriptRef.current) {
      setScenes(parseStoryboard(generatedScript));
      lastScriptRef.current = generatedScript;
    }
  }, [generatedScript]);

  useEffect(() => {
    return () => {
      if (animaticTimerRef.current) clearTimeout(animaticTimerRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  const totalRuntime = useMemo(() => {
    return scenes.reduce((acc, scene) => acc + calculateSceneDuration(scene.narration), 0);
  }, [scenes]);

  const updateScriptMarkdown = (items: Scene[]) => {
    const nextScript = buildUpdatedStoryboardMarkdown(generatedScript, items);
    if (!nextScript) return;
    recordScriptChange(nextScript);
    lastScriptRef.current = nextScript;
  };

  const addScene = (index: number) => {
    const newScene: Scene = {
      id: `sc-${Date.now()}`,
      originalIndex: scenes.length,
      section: 'Story Beat',
      narration: '...',
      visuals: 'New scene visuals...',
      sound: 'Ambience',
    };
    const updated = [...scenes];
    updated.splice(index, 0, newScene);
    setScenes(updated);
    updateScriptMarkdown(updated);
  };

  const deleteScene = (id: string) => {
    const updated = scenes.filter((scene) => scene.id !== id);
    setScenes(updated);
    updateScriptMarkdown(updated);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = [...scenes];
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setScenes(items);
    updateScriptMarkdown(items);
  };

  const startEditing = (scene: Scene) => {
    setEditingSceneId(scene.id);
    setEditForm(scene);
  };

  const cancelEditing = () => {
    setEditingSceneId(null);
    setEditForm({});
  };

  const saveSceneEdits = () => {
    if (!editingSceneId) return;
    const updated = scenes.map((scene) => (scene.id === editingSceneId ? ({ ...scene, ...editForm } as Scene) : scene));
    setScenes(updated);
    updateScriptMarkdown(updated);
    setEditingSceneId(null);
    setEditForm({});
  };

  const handleGenerateVisual = (sceneId: string, description: string) => {
    setVisualData((prev) => ({ ...prev, [sceneId]: 'loading' }));
    setTimeout(() => {
      const seed = encodeURIComponent(description.slice(0, 50));
      setVisualData((prev) => ({ ...prev, [sceneId]: `https://picsum.photos/seed/${seed}-${sceneId}/800/450` }));
    }, 1500);
  };

  const handleGenerateBGM = (_sceneId: string, soundDescription: string) => {
    setTimeout(() => {
      alert(`AI Background Music (Lyria) generated for: ${soundDescription}`);
    }, 2000);
  };

  const handleGenerateNext = async () => {
    if (!generatedScript) return;
    setIsContinuing(true);
    try {
      const nextScenesText = await continueAnimeScript(generatedScript, selectedModel);
      const newScenes = parseStoryboard(nextScenesText);
      const updated = [...scenes, ...newScenes];
      setScenes(updated);
      updateScriptMarkdown(updated);
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, 'storyboard-continuation');
    } finally {
      setIsContinuing(false);
    }
  };

  const playNextAnimaticFrame = (index: number) => {
    if (index >= scenes.length) {
      setIsPlayingAnimatic(false);
      return;
    }
    const duration = calculateSceneDuration(scenes[index].narration) * 1000;
    animaticTimerRef.current = setTimeout(() => {
      setCurrentAnimaticIndex(index + 1);
      playNextAnimaticFrame(index + 1);
    }, duration);
  };

  const handlePlayAnimatic = () => {
    if (scenes.length === 0) return;
    setIsPlayingAnimatic(true);
    setCurrentAnimaticIndex(0);
    playNextAnimaticFrame(0);
  };

  const stopAnimatic = () => {
    if (animaticTimerRef.current) clearTimeout(animaticTimerRef.current);
    setIsPlayingAnimatic(false);
  };

  const handleAddAlternateTake = (sceneId: string) => {
    const parentScene = scenes.find((scene) => scene.id === sceneId);
    if (!parentScene) return;
    const newTake = { ...parentScene, id: `${sceneId}-alt-${Date.now()}`, section: `${parentScene.section} (Alt)` };
    setAlternateTakes((prev) => ({ ...prev, [sceneId]: [...(prev[sceneId] || []), newTake] }));
    alert('Alternate take created! Switch between them to compare.');
  };

  const handleSwapAlternateTake = (sceneId: string, takeIndex: number, sceneIndex: number) => {
    const sceneAlternates = alternateTakes[sceneId];
    if (!sceneAlternates || !sceneAlternates[takeIndex]) return;
    const current = scenes[sceneIndex];
    if (!current) return;

    const updated = [...scenes];
    const updatedAlternates = [...sceneAlternates];
    updated[sceneIndex] = sceneAlternates[takeIndex];
    updatedAlternates[takeIndex] = current;
    setScenes(updated);
    setAlternateTakes((prev) => ({ ...prev, [sceneId]: updatedAlternates }));
    updateScriptMarkdown(updated);
  };

  const handlePlayAudio = (scene: Scene) => {
    if (playingAudioId === scene.id) {
      window.speechSynthesis.cancel();
      setPlayingAudioId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scene.narration);
    utterance.onend = () => setPlayingAudioId(null);
    setPlayingAudioId(scene.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleExport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const scenesHtml = scenes
      .map(
        (scene, i) => `
      <div style="page-break-inside: avoid; border: 1px solid #eee; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #cc0000;">Scene ${i + 1}: ${scene.section}</h3>
        <div style="display: flex; gap: 20px;">
          <div style="flex: 1;"><img src="${visualData[scene.id] || ''}" style="width: 100%; border-radius: 4px;" /></div>
          <div style="flex: 1;"><p><strong>Narration:</strong> "${scene.narration}"</p><p><strong>Visuals:</strong> ${scene.visuals}</p><p><strong>Status:</strong> ${sceneStatus[scene.id] || 'Draft'}</p></div>
        </div>
      </div>`
      )
      .join('');

    printWindow.document.write(
      `<html><head><title>Storyboard Export</title></head><body><h1 style="text-align:center">Visual Storyboard</h1>${scenesHtml}<script>setTimeout(() => window.print(), 500)</script></body></html>`
    );
    printWindow.document.close();
  };

  const highlightNarrative = (text: string) => {
    if (!text) return text;
    const words = text.split(/(\s+)/);
    return words.map((word, i) => {
      if (/^[A-Z][a-z]+/.test(word) && word.length > 2) {
        return (
          <span key={i} className="text-red-400 font-bold border-b border-red-500/30 cursor-help" title="Character/Asset Tagged">
            {word}
          </span>
        );
      }
      return word;
    });
  };

  const undo = () => {
    const previousScript = handleUndo();
    if (previousScript) {
      lastScriptRef.current = previousScript;
    }
  };

  const redo = () => {
    const nextScript = handleRedo();
    if (nextScript) {
      lastScriptRef.current = nextScript;
    }
  };

  return {
    viewMode,
    setViewMode,
    scenes,
    visualData,
    sceneStatus,
    directorsNotes,
    alternateTakes,
    editingSceneId,
    editForm,
    playingAudioId,
    selectedImage,
    setSelectedImage,
    isPlayingAnimatic,
    currentAnimaticIndex,
    setCurrentAnimaticIndex,
    pastScripts,
    futureScripts,
    totalRuntime,
    isContinuing,
    calculateDuration: calculateSceneDuration,
    getStatusColor: getStoryboardStatusColor,
    highlightNarrative,
    onDragEnd,
    addScene,
    deleteScene,
    startEditing,
    cancelEditing,
    saveSceneEdits,
    handleGenerateVisual,
    handleGenerateBGM,
    handleGenerateNext,
    handlePlayAnimatic,
    stopAnimatic,
    handleAddAlternateTake,
    handleSwapAlternateTake,
    handlePlayAudio,
    handleExport,
    setSceneStatus,
    setDirectorsNotes,
    setEditForm,
    undo,
    redo,
  };
}
