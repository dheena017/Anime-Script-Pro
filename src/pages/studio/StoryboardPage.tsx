import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGenerator } from '@/contexts/GeneratorContext';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  enhanceSceneVisuals, 
  generateSceneImage, 
  enhanceNarration, 
  rewriteForTension, 
  suggestDuration 
} from '@/services/geminiService';

// Sub-components
import { StoryboardHeader } from './components/Storyboard/StoryboardHeader';
import { PlanningGuide } from './components/Storyboard/PlanningGuide';
import { SceneCard } from './components/Storyboard/SceneCard';
import { EmptyState } from './components/Storyboard/EmptyState';

interface Scene {
  id: string;
  originalIndex: number;
  section: string;
  narration: string;
  visuals: string;
  sound: string;
  duration: string;
}

export function StoryboardPage() {
  const [isLiked, setIsLiked] = useState(false);
  const { generatedScript, setGeneratedScript, visualData, setVisualData } = useGenerator();
  const [isGeneratingVisuals, setIsGeneratingVisuals] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Scene>>({});
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isEnhancingNarration, setIsEnhancingNarration] = useState(false);
  const [isRewritingTension, setIsRewritingTension] = useState(false);
  const [isEnhancingAllNarration, setIsEnhancingAllNarration] = useState(false);
  const [isEnhancingAllVisuals, setIsEnhancingAllVisuals] = useState(false);

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
        duration: '5s'
      };
    });
  };

  useEffect(() => {
    if (generatedScript !== lastScriptRef.current) {
      setScenes(parseStoryboard(generatedScript));
      lastScriptRef.current = generatedScript;
    }
  }, [generatedScript]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(scenes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setScenes(items);
    updateScriptMarkdown(items);
  };

  const updateScriptMarkdown = (items: Scene[]) => {
    let currentScript = generatedScript;
    if (!currentScript || !currentScript.includes('|')) {
      currentScript = "# Production Script\n\n| Section | Voiceover Narration | Visual/Scene Description | Sound Effect/BGM Cues |\n| :--- | :--- | :--- | :--- |";
    }
    const lines = currentScript.split('\n');
    const tableHeaderIndex = lines.findIndex(l => l.includes('|') && l.toLowerCase().includes('section'));
    if (tableHeaderIndex !== -1) {
      const preTable = lines.slice(0, tableHeaderIndex + 2);
      let tableEndIndex = tableHeaderIndex + 2;
      while (tableEndIndex < lines.length && lines[tableEndIndex].includes('|')) tableEndIndex++;
      const postTable = lines.slice(tableEndIndex);
      const newTableRows = items.map(scene => `| ${scene.section} | ${scene.narration} | ${scene.visuals} | ${scene.sound} |`);
      const newScript = [...preTable, ...newTableRows, ...postTable].join('\n');
      lastScriptRef.current = newScript;
      setGeneratedScript(newScript);
    }
  };

  const handleEnhanceNarration = async () => {
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
  };

  const handleEnhanceVisuals = async () => {
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
  };

  const handleRewriteTension = async () => {
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
  };

  const handleGenerateVisual = async (originalIndex: number, visualsDescription: string) => {
    setVisualData(prev => ({ ...prev, [originalIndex]: 'loading' }));
    try {
      const imageUrl = await generateSceneImage(visualsDescription);
      if (imageUrl) {
        setVisualData(prev => ({ ...prev, [originalIndex]: imageUrl }));
      } else {
        const seed = encodeURIComponent(visualsDescription.slice(0, 50));
        setVisualData(prev => ({ ...prev, [originalIndex]: `https://picsum.photos/seed/${seed}-${originalIndex}/800/450` }));
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
      const seed = encodeURIComponent(visualsDescription.slice(0, 50));
      setVisualData(prev => ({ ...prev, [originalIndex]: `https://picsum.photos/seed/${seed}-${originalIndex}/800/450` }));
    }
  };

  const handleGenerateAll = async () => {
    setIsGeneratingVisuals(true);
    const newVisualData = { ...visualData };
    for (const scene of scenes) {
      if (!newVisualData[scene.originalIndex] || newVisualData[scene.originalIndex] === 'loading') {
        setVisualData(prev => ({ ...prev, [scene.originalIndex]: 'loading' }));
        try {
          const imageUrl = await generateSceneImage(scene.visuals);
          newVisualData[scene.originalIndex] = imageUrl || `https://picsum.photos/seed/${encodeURIComponent(scene.visuals.slice(0, 50))}-${scene.originalIndex}/800/450`;
        } catch (error) {
          newVisualData[scene.originalIndex] = `https://picsum.photos/seed/${encodeURIComponent(scene.visuals.slice(0, 50))}-${scene.originalIndex}/800/450`;
        }
        setVisualData(prev => ({ ...prev, [scene.originalIndex]: newVisualData[scene.originalIndex] }));
      }
    }
    setIsGeneratingVisuals(false);
  };

  const handleEnhanceAllNarration = async () => {
    setIsEnhancingAllNarration(true);
    try {
      const updatedScenes = await Promise.all(scenes.map(async (scene) => {
        if (!scene.narration) return scene;
        const enhanced = await enhanceNarration(scene.narration);
        return { ...scene, narration: enhanced };
      }));
      setScenes(updatedScenes);
      updateScriptMarkdown(updatedScenes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancingAllNarration(false);
    }
  };

  const handleEnhanceAllVisuals = async () => {
    setIsEnhancingAllVisuals(true);
    try {
      const updatedScenes = await Promise.all(scenes.map(async (scene) => {
        if (!scene.visuals) return scene;
        const enhanced = await enhanceSceneVisuals(scene.visuals, scene.narration || '');
        return { ...scene, visuals: enhanced };
      }));
      setScenes(updatedScenes);
      updateScriptMarkdown(updatedScenes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancingAllVisuals(false);
    }
  };

  const handleAddScene = () => {
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
    setScenes(updatedScenes);
    updateScriptMarkdown(updatedScenes);
  };

  const handleLoadDemo = () => {
    const demoScenes: Scene[] = [{
      id: `demo-1`,
      originalIndex: 0,
      section: 'Rising Action',
      narration: 'Yuna: “You really think something will happen?” Riku: “When the moon glows like that… yeah. Something’s lurking.”',
      visuals: 'Two-shot of Yuna and Riku standing on a traditional wooden school balcony. Yuna looks up at the moon with a mix of skepticism and dread. Riku leans against the railing, his silhouette sharp against the massive, bioluminescent blood-red moon. Low-angle shot, cinematic lighting with heavy blues and deep reds.',
      sound: 'Low atmospheric drone, wind whistling through the corridor, distant crow caw.',
      duration: '10s'
    }];
    setScenes(demoScenes);
    updateScriptMarkdown(demoScenes);
  };

  const startEditing = (scene: Scene) => {
    setEditingSceneId(scene.id);
    setEditForm(scene);
  };

  const saveSceneEdits = () => {
    if (!editingSceneId) return;
    const updatedScenes = scenes.map(scene => scene.id === editingSceneId ? { ...scene, ...editForm } as Scene : scene);
    setScenes(updatedScenes);
    updateScriptMarkdown(updatedScenes);
    setEditingSceneId(null);
    setEditForm({});
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <StoryboardHeader 
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        isGuideOpen={isGuideOpen}
        setIsGuideOpen={setIsGuideOpen}
        handleAddScene={handleAddScene}
        scenesLength={scenes.length}
        handleEnhanceAllVisuals={handleEnhanceAllVisuals}
        handleEnhanceAllNarration={handleEnhanceAllNarration}
        handleGenerateAll={handleGenerateAll}
        isGlobalEnhancing={isGlobalEnhancing}
        isGeneratingVisuals={isGeneratingVisuals}
        isEnhancingAllVisuals={isEnhancingAllVisuals}
        isEnhancingAllNarration={isEnhancingAllNarration}
      />

      <AnimatePresence>
        {isGuideOpen && <PlanningGuide />}
      </AnimatePresence>

      <ScrollArea className="h-[700px] w-full pr-4">
        {scenes.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="storyboard">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                  {scenes.map((scene, idx) => (
                    <Draggable key={scene.id} draggableId={scene.id} index={idx}>
                      {(provided, snapshot) => (
                        <SceneCard 
                          scene={scene}
                          index={idx}
                          visualData={visualData}
                          editingSceneId={editingSceneId}
                          editForm={editForm}
                          isEnhancingNarration={isEnhancingNarration}
                          isEnhancing={isEnhancing}
                          isRewritingTension={isRewritingTension}
                          setEditForm={setEditForm}
                          handleGenerateVisual={handleGenerateVisual}
                          startEditing={startEditing}
                          cancelEditing={() => { setEditingSceneId(null); setEditForm({}); }}
                          saveSceneEdits={saveSceneEdits}
                          handleEnhanceNarration={handleEnhanceNarration}
                          handleEnhanceVisuals={handleEnhanceVisuals}
                          handleRewriteTension={handleRewriteTension}
                          suggestDuration={suggestDuration}
                          dragHandleProps={provided.dragHandleProps}
                          draggableProps={provided.draggableProps}
                          innerRef={provided.innerRef}
                          isDragging={snapshot.isDragging}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <EmptyState handleAddScene={handleAddScene} handleLoadDemo={handleLoadDemo} />
        )}
      </ScrollArea>
    </motion.div>
  );
}
