import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useGenerator } from '@/hooks/useGenerator';
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
  Play
} from 'lucide-react';
import { 
  enhanceNarration, 
  enhanceSceneVisuals} from '@/services/api/gemini';

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

export function SceneViewPage() {
  const { sceneId } = useParams();
  const navigate = useNavigate();
  const { 
    generatedScript, setGeneratedScript,
    visualData, 
    videoData, 
    showNotification,
    addLog
  } = useGenerator();

  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(-1);
  const [editForm, setEditForm] = useState<Partial<Scene>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Parse storyboard from script
  useEffect(() => {
    if (!generatedScript) return;
    const lines = generatedScript.split('\n');
    const tableLines = lines.filter(l => l.includes('|') && !l.includes('---'));
    if (tableLines.length <= 1) return;
    
    const parsedScenes = tableLines.slice(1).map((row, idx) => {
      const cells = row.split('|').filter(cell => cell.trim() !== "").map(cell => cell.trim());
      return {
        id: `scene-${idx}`, // Simplified ID for navigation
        originalIndex: idx,
        section: cells[0] || '',
        narration: cells[1] || '',
        visuals: cells[2] || '',
        sound: cells[3] || '',
        duration: cells[4] || '5s',
        linkedPrompt: cells[5] || ''
      };
    });
    setScenes(parsedScenes);
    
    const index = parsedScenes.findIndex(s => s.id === sceneId || String(s.originalIndex) === sceneId);
    if (index !== -1) {
      setCurrentSceneIndex(index);
      setEditForm(parsedScenes[index]);
    }
  }, [generatedScript, sceneId]);

  const scene = scenes[currentSceneIndex];

  if (!scene) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-6">
        <div className="w-16 h-16 border-2 border-studio/20 border-t-studio rounded-full animate-spin" />
        <p className="text-studio font-black uppercase tracking-widest animate-pulse">Initializing Scene Nexus...</p>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    addLog("STORYBOARD", "SYNCING", `Persisting refinements for Scene ${currentSceneIndex + 1}...`);
    
    const updatedScenes = scenes.map((s, idx) => idx === currentSceneIndex ? { ...s, ...editForm } as Scene : s);
    
    // Update Script Markdown
    let currentScript = generatedScript || "";
    const lines = currentScript.split('\n');
    const tableHeaderIndex = lines.findIndex(l => l.includes('|') && l.toLowerCase().includes('section'));
    
    if (tableHeaderIndex !== -1) {
      const preTable = lines.slice(0, tableHeaderIndex + 2);
      let tableEndIndex = tableHeaderIndex + 2;
      while (tableEndIndex < lines.length && lines[tableEndIndex].includes('|')) tableEndIndex++;
      const postTable = lines.slice(tableEndIndex);
      const newTableRows = updatedScenes.map(s => `| ${s.section} | ${s.narration} | ${s.visuals} | ${s.sound} | ${s.duration} | ${s.linkedPrompt || ''} |`);
      const newScript = [...preTable, ...newTableRows, ...postTable].join('\n');
      setGeneratedScript(newScript);
    }
    
    setTimeout(() => {
      setIsSaving(false);
      showNotification?.("Scene saved successfully!", "success");
      addLog("STORYBOARD", "COMPLETED", `Scene ${currentSceneIndex + 1} manifest successfully archived.`);
    }, 500);
  };

  const handleEnhance = async (type: 'narration' | 'visuals') => {
    setIsEnhancing(true);
    try {
      if (type === 'narration' && editForm.narration) {
        const enhanced = await enhanceNarration(editForm.narration);
        setEditForm(prev => ({ ...prev, narration: enhanced }));
      } else if (type === 'visuals' && editForm.visuals) {
        const enhanced = await enhanceSceneVisuals(editForm.visuals, editForm.narration || '');
        setEditForm(prev => ({ ...prev, visuals: enhanced }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleNext = () => {
    if (currentSceneIndex < scenes.length - 1) {
      navigate(`../scenes/${currentSceneIndex + 1}`);
    }
  };

  const handlePrev = () => {
    if (currentSceneIndex > 0) {
      navigate(`../scenes/${currentSceneIndex - 1}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate('..')}
          className="text-zinc-500 hover:text-white uppercase font-black tracking-widest text-[10px] gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Matrix
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-6 py-2 bg-studio/5 border border-studio/20 rounded-2xl">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Production Unit</span>
            <span className="text-xl font-black text-studio font-mono">{String(currentSceneIndex + 1).padStart(2, '0')}</span>
            <span className="text-[10px] font-black text-zinc-700 uppercase">/ {String(scenes.length).padStart(2, '0')}</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrev}
              disabled={currentSceneIndex === 0}
              className="w-12 h-12 bg-black/40 border-white/10 rounded-2xl hover:border-studio/50 text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext}
              disabled={currentSceneIndex === scenes.length - 1}
              className="w-12 h-12 bg-black/40 border-white/10 rounded-2xl hover:border-studio/50 text-white transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-studio hover:bg-studio/80 text-black font-black uppercase tracking-widest px-8 rounded-2xl h-12 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Archive Edits
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Visual Engine Column */}
        <div className="space-y-8">
          <Card className="bg-black/60 backdrop-blur-md border-white/5 overflow-hidden rounded-[2.5rem] shadow-2xl relative group">
             <div className="aspect-video bg-[#030303] flex items-center justify-center relative overflow-hidden">
                {videoData?.[scene.originalIndex] ? (
                  <video 
                    src={videoData?.[scene.originalIndex]} 
                    autoPlay loop muted playsInline 
                    className="w-full h-full object-cover"
                  />
                ) : visualData?.[scene.originalIndex]?.[0] ? (
                  <img 
                    src={visualData?.[scene.originalIndex]?.[0]} 
                    alt="Scene Preview" 
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center">
                      <Film className="w-10 h-10 text-zinc-800" />
                    </div>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em]">Visual Synthesis Offline</p>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                   <div className="flex gap-4">
                      <Button className="h-12 px-6 bg-studio/10 hover:bg-studio text-studio hover:text-black border border-studio/30 rounded-2xl font-black uppercase tracking-widest transition-all">
                        <Play className="w-4 h-4 mr-2" /> Play Scene
                      </Button>
                   </div>
                   <div className="flex gap-2">
                      <Button size="icon" className="w-12 h-12 bg-black/60 border border-white/10 rounded-2xl hover:border-studio transition-all">
                        <Maximize2 className="w-5 h-5 text-zinc-400" />
                      </Button>
                   </div>
                </div>
             </div>

             <div className="p-8 space-y-8">
                <div className="grid grid-cols-3 gap-6">
                   <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Production Phase</p>
                      <p className="text-xs font-black text-white uppercase tracking-widest">{scene.section}</p>
                   </div>
                   <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Temporal Unit</p>
                      <p className="text-xs font-black text-studio uppercase tracking-widest">{scene.duration}</p>
                   </div>
                   <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Audio Status</p>
                      <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">Linked</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Soundscape Blueprint</h4>
                   <div className="p-6 bg-[#050505] border border-white/5 rounded-3xl text-sm text-zinc-400 font-medium leading-relaxed italic">
                      "{scene.sound}"
                   </div>
                </div>
             </div>
          </Card>
        </div>

        {/* Edit Engine Column */}
        <div className="space-y-8">
           <Card className="bg-black/60 backdrop-blur-md border-white/5 p-10 rounded-[2.5rem] shadow-2xl space-y-10">
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-studio" />
                          Narration Engine
                       </h3>
                       <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest ml-8">Edit the character voiceover and dialogue sequence.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEnhance('narration')}
                      disabled={isEnhancing}
                      className="h-10 px-6 bg-studio/5 border-studio/20 text-studio hover:bg-studio hover:text-black font-black uppercase tracking-widest text-[10px] rounded-xl transition-all"
                    >
                      {isEnhancing ? <Wand2 className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2" />}
                      Optimize
                    </Button>
                 </div>
                 <Textarea 
                   value={editForm.narration || ''}
                   onChange={(e) => setEditForm({...editForm, narration: e.target.value})}
                   className="min-h-[250px] bg-white/[0.02] border-white/10 rounded-3xl p-8 text-lg font-medium leading-relaxed text-zinc-300 focus:border-studio/50 focus:bg-studio/[0.01] transition-all resize-none shadow-inner"
                   placeholder="Enter dialogue or narration..."
                 />
              </div>

              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                          <Zap className="w-5 h-5 text-purple-400" />
                          Visual Manifest
                       </h3>
                       <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest ml-8">Define camera angles, lighting, and scene atmosphere.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEnhance('visuals')}
                      disabled={isEnhancing}
                      className="h-10 px-6 bg-purple-500/5 border-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-black font-black uppercase tracking-widest text-[10px] rounded-xl transition-all"
                    >
                      {isEnhancing ? <Wand2 className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2" />}
                      Enhance
                    </Button>
                 </div>
                 <Textarea 
                   value={editForm.visuals || ''}
                   onChange={(e) => setEditForm({...editForm, visuals: e.target.value})}
                   className="min-h-[250px] bg-white/[0.02] border-white/10 rounded-3xl p-8 text-base font-mono leading-relaxed text-zinc-400 focus:border-purple-500/50 focus:bg-purple-500/[0.01] transition-all resize-none shadow-inner"
                   placeholder="Describe the visual composition..."
                 />
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

