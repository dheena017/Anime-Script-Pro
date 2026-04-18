import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Layout, Sparkles, Image as ImageIcon, Wand2, GripVertical, ChevronDown, ChevronUp, BookOpen, MapPin, Users, Heart, Target, Edit2, Save, X, Plus, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGenerator } from '@/contexts/GeneratorContext';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { enhanceSceneVisuals, generateSceneImage, enhanceNarration, rewriteForTension, suggestDuration } from '@/services/geminiService';
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
      const preTable = lines.slice(0, tableHeaderIndex + 2); // Header + separator
      
      // Find where the table ends
      let tableEndIndex = tableHeaderIndex + 2;
      while (tableEndIndex < lines.length && lines[tableEndIndex].includes('|')) {
        tableEndIndex++;
      }
      
      const postTable = lines.slice(tableEndIndex);
      
      const newTableRows = items.map(scene => 
        `| ${scene.section} | ${scene.narration} | ${scene.visuals} | ${scene.sound} |`
      );
      
      const newScript = [...preTable, ...newTableRows, ...postTable].join('\n');
      lastScriptRef.current = newScript;
      setGeneratedScript(newScript);
    }
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
    
    const updatedScenes = scenes.map(scene => 
      scene.id === editingSceneId ? { ...scene, ...editForm } as Scene : scene
    );
    
    setScenes(updatedScenes);
    updateScriptMarkdown(updatedScenes);
    setEditingSceneId(null);
    setEditForm({});
  };

  const handleGenerateVisual = async (originalIndex: number, visualsDescription: string) => {
    setVisualData(prev => ({ ...prev, [originalIndex]: 'loading' }));
    
    try {
      const imageUrl = await generateSceneImage(visualsDescription);
      if (imageUrl) {
        setVisualData(prev => ({ 
          ...prev, 
          [originalIndex]: imageUrl 
        }));
      } else {
        const seed = encodeURIComponent(visualsDescription.slice(0, 50));
        setVisualData(prev => ({ 
          ...prev, 
          [originalIndex]: `https://picsum.photos/seed/${seed}-${originalIndex}/800/450` 
        }));
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
      const seed = encodeURIComponent(visualsDescription.slice(0, 50));
      setVisualData(prev => ({ 
        ...prev, 
        [originalIndex]: `https://picsum.photos/seed/${seed}-${originalIndex}/800/450` 
      }));
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

  const handleGenerateAll = async () => {
    setIsGeneratingVisuals(true);
    const newVisualData = { ...visualData };
    
    for (const scene of scenes) {
      if (!newVisualData[scene.originalIndex] || newVisualData[scene.originalIndex] === 'loading') {
        setVisualData(prev => {
          const next = { ...prev };
          next[scene.originalIndex] = 'loading';
          return next;
        });
        
        try {
          const imageUrl = await generateSceneImage(scene.visuals);
          if (imageUrl) {
            newVisualData[scene.originalIndex] = imageUrl;
          } else {
             const seed = encodeURIComponent(scene.visuals.slice(0, 50));
             newVisualData[scene.originalIndex] = `https://picsum.photos/seed/${seed}-${scene.originalIndex}/800/450`;
          }
        } catch (error) {
          console.error(`Failed to generate image for scene ${scene.originalIndex}:`, error);
          const seed = encodeURIComponent(scene.visuals.slice(0, 50));
          newVisualData[scene.originalIndex] = `https://picsum.photos/seed/${seed}-${scene.originalIndex}/800/450`;
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
      console.error("Failed to enhance all narration:", error);
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
      console.error("Failed to enhance all visuals:", error);
    } finally {
      setIsEnhancingAllVisuals(false);
    }
  };

  const handleAddScene = () => {
    const nextIndex = scenes.length > 0 
      ? Math.max(...scenes.map(s => s.originalIndex)) + 1 
      : 0;
    
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
    const demoScenes: Scene[] = [
      {
        id: `demo-1`,
        originalIndex: 0,
        section: 'Rising Action',
        narration: 'Yuna: “You really think something will happen?” Riku: “When the moon glows like that… yeah. Something’s lurking.”',
        visuals: 'Two-shot of Yuna and Riku standing on a traditional wooden school balcony. Yuna looks up at the moon with a mix of skepticism and dread. Riku leans against the railing, his silhouette sharp against the massive, bioluminescent blood-red moon. Low-angle shot, cinematic lighting with heavy blues and deep reds.',
        sound: 'Low atmospheric drone, wind whistling through the corridor, distant crow caw.',
        duration: '10s'
      }
    ];
    setScenes(demoScenes);
    updateScriptMarkdown(demoScenes);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black uppercase tracking-[0.15em] flex items-center gap-3 text-cyan-50 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
          <Layout className="w-6 h-6 text-cyan-400" />
          Visual Storyboard
        </h2>
        <p className="text-cyan-500/60 font-bold uppercase tracking-widest text-xs">
          Plan your shots, refine camera angles, and generate visual concepts.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/50 pb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full transition-all duration-300 border border-transparent flex-shrink-0",
              isLiked ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]" : "text-zinc-600 hover:text-cyan-400 hover:bg-zinc-800/50"
            )}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-800 bg-[#0a0a0a]/50 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-zinc-400 uppercase tracking-wider text-[10px] font-bold h-9 transition-colors"
            onClick={() => setIsGuideOpen(!isGuideOpen)}
          >
            <BookOpen className="w-3.5 h-3.5 mr-2" />
            Planning Guide
            {isGuideOpen ? <ChevronUp className="w-3.5 h-3.5 ml-2" /> : <ChevronDown className="w-3.5 h-3.5 ml-2" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-800 bg-[#0a0a0a]/50 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-zinc-400 uppercase tracking-wider text-[10px] font-bold h-9 transition-colors"
            onClick={handleAddScene}
          >
            <Plus className="w-3.5 h-3.5 mr-2" />
            Add Scene
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {scenes.length > 0 ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 uppercase tracking-wider text-[10px] font-bold h-9 shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all"
                onClick={handleEnhanceAllVisuals}
                disabled={isGlobalEnhancing || isGeneratingVisuals}
              >
                {isEnhancingAllVisuals ? (
                  <div className="w-3.5 h-3.5 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                )}
                {isEnhancingAllVisuals ? 'Enhancing...' : 'Refine Camera & Visuals'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 uppercase tracking-wider text-[10px] font-bold h-9 shadow-[0_0_15px_rgba(249,115,22,0.1)] transition-all"
                onClick={handleEnhanceAllNarration}
                disabled={isGlobalEnhancing || isGeneratingVisuals}
              >
                {isEnhancingAllNarration ? (
                  <div className="w-3.5 h-3.5 border-2 border-orange-500/30 border-t-orange-400 rounded-full animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                )}
                {isEnhancingAllNarration ? 'Enhancing...' : 'Refine All Narration'}
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] uppercase tracking-wider text-[10px] font-bold h-9 transition-all"
                onClick={handleGenerateAll}
                disabled={isGeneratingVisuals || isGlobalEnhancing}
              >
                {isGeneratingVisuals ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5 mr-2" />
                )}
                {isGeneratingVisuals ? 'Rendering All...' : 'Render Frames'}
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {isGuideOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <Card className="bg-black/40 backdrop-blur-xl border-white/5 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
            <h3 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-cyan-500"></span>
              Step-by-Step Scene Planning
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                  <MapPin className="w-4 h-4" /> Setting
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Define the environment, time of day, and atmosphere. How does the location reflect the scene's tone?
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-semibold">
                  <Users className="w-4 h-4" /> Characters
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Who is present? What are their current states, motivations, and power dynamics in this specific moment?
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-semibold">
                  <Heart className="w-4 h-4" /> Mood
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Establish the emotional tone. Is it tense, melancholic, energetic, or mysterious? Use lighting and color to convey this.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                  <Target className="w-4 h-4" /> Outcomes
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  What changes by the end? Note any information revealed, character growth, or plot advancement.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <ScrollArea className="h-[700px] w-full pr-4">
        {scenes.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="storyboard">
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10"
                >
                  {scenes.map((scene, idx) => (
                    <Draggable key={scene.id} draggableId={scene.id} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.8 : 1,
                          }}
                        >
                          <Card className={`bg-gradient-to-br from-[#111318] to-[#0a0b0e] border transition-all duration-500 overflow-hidden group hover:scale-[1.02] ${snapshot.isDragging ? 'border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.3)] scale-[1.02] z-50 relative' : 'border-zinc-800 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]'}`}>
                            <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                            <div className="aspect-video bg-zinc-950/50 flex items-center justify-center border-b border-white/5 relative overflow-hidden z-10">
                              {visualData[scene.originalIndex] === 'loading' ? (
                                <div className="flex flex-col items-center gap-3">
                                  <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                                  <p className="text-[9px] text-cyan-400 uppercase tracking-widest font-medium">Generating Frame...</p>
                                </div>
                              ) : visualData[scene.originalIndex] ? (
                                <img 
                                  src={visualData[scene.originalIndex]} 
                                  alt={`Scene ${idx + 1}`} 
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
                              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-cyan-500/30 text-cyan-100 text-[9px] font-bold px-2.5 py-1.5 rounded shadow-[0_0_10px_rgba(6,182,212,0.2)] flex items-center gap-1.5 uppercase tracking-widest">
                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing mr-1">
                                  <GripVertical className="w-3.5 h-3.5 opacity-70 hover:opacity-100 transition-opacity text-cyan-400" />
                                </div>
                                Scene {String(idx + 1).padStart(2, '0')}
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
            <Layout className="w-12 h-12 mb-4 opacity-20" />
            <p className="mb-6">Generate a script with a table to see the storyboard.</p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800"
                onClick={handleAddScene}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Scene
              </Button>
              <Button 
                variant="ghost" 
                className="text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5"
                onClick={handleLoadDemo}
              >
                <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
                Load Example Scene
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}
