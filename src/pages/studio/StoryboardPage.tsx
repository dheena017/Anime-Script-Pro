import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Layout, Sparkles, Image as ImageIcon, Wand2, GripVertical, ChevronDown, ChevronUp, BookOpen, MapPin, Users, Heart, Target, Edit2, Save, X, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGenerator } from '@/contexts/GeneratorContext';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { enhanceSceneVisuals } from '@/services/geminiService';

interface Scene {
  id: string;
  originalIndex: number;
  section: string;
  narration: string;
  visuals: string;
  sound: string;
}

export function StoryboardPage() {
  const { generatedScript, setGeneratedScript } = useGenerator();
  const [isGeneratingVisuals, setIsGeneratingVisuals] = useState(false);
  const [visualData, setVisualData] = useState<Record<number, string>>({});
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Scene>>({});
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isEnhancingAll, setIsEnhancingAll] = useState(false);

  const parseStoryboard = (script: string | null): Scene[] => {
    if (!script) return [];
    const lines = script.split('\n');
    const tableLines = lines.filter(l => l.includes('|') && !l.includes('---'));
    if (tableLines.length <= 1) return [];
    
    return tableLines.slice(1).map((row, idx) => {
      const cells = row.split('|').filter(cell => cell.trim() !== "").map(cell => cell.trim());
      return {
        id: `scene-${idx}`,
        originalIndex: idx,
        section: cells[0] || '',
        narration: cells[1] || '',
        visuals: cells[2] || '',
        sound: cells[3] || ''
      };
    });
  };

  useEffect(() => {
    setScenes(parseStoryboard(generatedScript));
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
    if (generatedScript) {
      const lines = generatedScript.split('\n');
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
        setGeneratedScript(newScript);
      }
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

  const handleGenerateVisual = (originalIndex: number, visualsDescription: string) => {
    setVisualData(prev => ({ ...prev, [originalIndex]: 'loading' }));
    
    // Simulate AI visual generation based on description
    setTimeout(() => {
      // Use a hash of the description to get a consistent but unique image
      const seed = encodeURIComponent(visualsDescription.slice(0, 50));
      setVisualData(prev => ({ 
        ...prev, 
        [originalIndex]: `https://picsum.photos/seed/${seed}-${originalIndex}/800/450` 
      }));
    }, 1500);
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

  const handleEnhanceAllVisuals = async () => {
    setIsEnhancingAll(true);
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
      setIsEnhancingAll(false);
    }
  };

  const handleGenerateAll = () => {
    setIsGeneratingVisuals(true);
    scenes.forEach((scene) => {
      handleGenerateVisual(scene.originalIndex, scene.visuals);
    });
    setTimeout(() => setIsGeneratingVisuals(false), 2000);
  };

  const appendToVisuals = (text: string) => {
    setEditForm(prev => ({
      ...prev,
      visuals: prev.visuals ? `${prev.visuals.trim()} ${text}` : text
    }));
  };

  const visualSuggestions = [
    "Medium shot", "Close-up", "Dutch tilt", "Wide shot", 
    "Dimly lit", "High contrast", "Neon glow",
    "Light catching dust particles", "Dynamic motion blur"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3 font-serif tracking-wide">
            <Layout className="w-6 h-6 text-red-500" />
            Visual Storyboard
          </h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 ml-9">Plan your shots and generate visual concepts</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/5 text-zinc-400 uppercase tracking-wider text-[10px] font-bold h-9"
            onClick={() => setIsGuideOpen(!isGuideOpen)}
          >
            <BookOpen className="w-3.5 h-3.5 mr-2" />
            Planning Guide
            {isGuideOpen ? <ChevronUp className="w-3.5 h-3.5 ml-2" /> : <ChevronDown className="w-3.5 h-3.5 ml-2" />}
          </Button>
          {scenes.length > 0 && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 uppercase tracking-wider text-[10px] font-bold h-9"
                onClick={handleEnhanceAllVisuals}
                disabled={isEnhancingAll || isGeneratingVisuals}
              >
                {isEnhancingAll ? (
                  <div className="w-3.5 h-3.5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                )}
                {isEnhancingAll ? 'Enhancing...' : 'Refine All Visuals'}
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] uppercase tracking-wider text-[10px] font-bold h-9"
                onClick={handleGenerateAll}
                disabled={isGeneratingVisuals || isEnhancingAll}
              >
                {isGeneratingVisuals ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5 mr-2" />
                )}
                {isGeneratingVisuals ? 'Rendering All...' : 'Generate All Visuals'}
              </Button>
            </>
          )}
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />
            <h3 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-red-500"></span>
              Step-by-Step Scene Planning
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-semibold">
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
                          <Card className={`bg-black/40 backdrop-blur-xl border-white/5 overflow-hidden group hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)] transition-all duration-500 ${snapshot.isDragging ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)] scale-[1.02] z-50 relative' : ''}`}>
                            <div className="aspect-video bg-zinc-950/50 flex items-center justify-center border-b border-white/5 relative overflow-hidden">
                              {visualData[scene.originalIndex] === 'loading' ? (
                                <div className="flex flex-col items-center gap-3">
                                  <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                                  <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-medium">Generating Frame...</p>
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
                                    className="mt-4 h-8 text-[10px] text-red-500 hover:text-red-400 hover:bg-red-500/10 uppercase tracking-wider font-semibold"
                                    onClick={() => handleGenerateVisual(scene.originalIndex, scene.visuals)}
                                  >
                                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                    Generate Visual
                                  </Button>
                                </div>
                              )}
                              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold px-2.5 py-1.5 rounded shadow-lg flex items-center gap-1.5 uppercase tracking-widest">
                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing mr-1">
                                  <GripVertical className="w-3.5 h-3.5 opacity-50 hover:opacity-100 transition-opacity" />
                                </div>
                                Scene {String(idx + 1).padStart(2, '0')}
                              </div>
                              {visualData[scene.originalIndex] && visualData[scene.originalIndex] !== 'loading' && (
                                <button 
                                  onClick={() => handleGenerateVisual(scene.originalIndex, scene.visuals)}
                                  className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md border border-white/10 hover:bg-red-600 hover:border-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                                  title="Regenerate Visual"
                                >
                                  <Wand2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                <p className="text-[10px] text-zinc-200 font-semibold uppercase tracking-widest line-clamp-1">{scene.section}</p>
                              </div>
                            </div>
                            <div className="p-5 space-y-4 relative">
                              {editingSceneId === scene.id ? (
                                <div className="space-y-3">
                                  <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Section</label>
                                    <Input 
                                      value={editForm.section || ''} 
                                      onChange={(e) => setEditForm({...editForm, section: e.target.value})}
                                      className="h-8 text-xs bg-black/50 border-white/10 focus-visible:ring-red-500/50"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Narration</label>
                                    <Textarea 
                                      value={editForm.narration || ''} 
                                      onChange={(e) => setEditForm({...editForm, narration: e.target.value})}
                                      className="min-h-[60px] text-sm font-serif bg-black/50 border-white/10 resize-none focus-visible:ring-red-500/50 leading-relaxed"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Visual Direction</label>
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
                                    </div>
                                    <Textarea 
                                      value={editForm.visuals || ''} 
                                      onChange={(e) => setEditForm({...editForm, visuals: e.target.value})}
                                      className="min-h-[60px] text-xs font-mono bg-black/50 border-white/10 resize-none focus-visible:ring-purple-500/50 leading-relaxed"
                                      placeholder="e.g., Medium shot, character walks into a dimly lit room, light catching dust particles in the air"
                                    />
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                      {visualSuggestions.map((suggestion, i) => (
                                        <Badge 
                                          key={i}
                                          variant="outline" 
                                          className="text-[9px] px-2 py-0.5 h-5 cursor-pointer hover:bg-white/5 border-white/10 text-zinc-400 transition-colors uppercase tracking-wider"
                                          onClick={() => appendToVisuals(suggestion)}
                                        >
                                          <Plus className="w-2.5 h-2.5 mr-1" />
                                          {suggestion}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Sound</label>
                                    <Input 
                                      value={editForm.sound || ''} 
                                      onChange={(e) => setEditForm({...editForm, sound: e.target.value})}
                                      className="h-8 text-xs font-mono bg-black/50 border-white/10 focus-visible:ring-blue-500/50"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2 pt-3 border-t border-white/5 mt-4">
                                    <Button variant="ghost" size="sm" onClick={cancelEditing} className="h-8 text-[10px] uppercase tracking-wider font-bold hover:bg-white/5">
                                      <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
                                    </Button>
                                    <Button variant="default" size="sm" onClick={saveSceneEdits} className="h-8 text-[10px] uppercase tracking-wider font-bold bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]">
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
                                      <ImageIcon className="w-3 h-3" /> Visual Direction
                                    </h4>
                                    <p className="text-xs text-zinc-400 font-mono leading-relaxed line-clamp-2">{scene.visuals}</p>
                                  </div>

                                  <div className="space-y-1.5 bg-black/20 p-3 rounded-lg border border-white/5">
                                    <h4 className="text-[9px] font-bold text-blue-400/80 uppercase tracking-widest flex items-center gap-1.5">
                                      <Sparkles className="w-3 h-3" /> Sound & BGM
                                    </h4>
                                    <p className="text-xs text-zinc-400 font-mono leading-relaxed line-clamp-1">{scene.sound}</p>
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
            <p>Generate a script with a table to see the storyboard.</p>
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}
