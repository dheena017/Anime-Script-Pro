import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Sparkles, 
  Clock, 
  Search, 
  Image as ImageIcon, 
  Download, 
  Save, 
  Edit3, 
  Play,
  Heart,
  Send,
  Clapperboard,
  Hash,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateMetadata, generateImagePrompts, continueScript, generateScript } from '@/services/geminiService';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { auth, db } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function ScriptPage() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = React.useState(false);
  const {
    generatedScript, setGeneratedScript,
    setGeneratedMetadata,
    setGeneratedImagePrompts,
    selectedModel, setSelectedModel,
    isLoading, setIsLoading,
    isGeneratingMetadata, setIsGeneratingMetadata,
    isGeneratingImagePrompts, setIsGeneratingImagePrompts,
    isEditing, setIsEditing,
    isSaving, setIsSaving,
    isContinuingScript, setIsContinuingScript,
    currentScriptId, setCurrentScriptId,
    tone, audience, prompt, episode, session, contentType
  } = useGenerator();

  const handleContinueScript = async () => {
    if (!generatedScript) return;
    setIsContinuingScript(true);
    try {
      const nextScenes = await continueScript(generatedScript, selectedModel, contentType);
      // Append new scenes to the existing script
      // We need to handle the markdown table joining
      const lines = nextScenes.split('\n').filter(l => l.includes('|') && !l.includes('---') && !l.toLowerCase().includes('section'));
      const newContent = generatedScript + '\n' + lines.join('\n');
      setGeneratedScript(newContent);
    } catch (error) {
      console.error("Error continuing script:", error);
    } finally {
      setIsContinuingScript(false);
    }
  };

  const handleGenerateScript = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const script = await generateScript(prompt, tone, audience, session, episode, selectedModel, contentType);
      setGeneratedScript(script);
      setCurrentScriptId(null);
      
      if (user) {
        await addDoc(collection(db, 'scripts'), {
          uid: user.uid,
          prompt: prompt,
          script: script,
          tone: tone,
          audience: audience,
          episode: episode,
          session: session,
          contentType: contentType,
          model: selectedModel,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'scripts');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDuration = (text: string | null) => {
    if (!text) return "0:00";
    const words = text.split(/\s+/).length;
    const minutes = Math.floor(words / 150);
    const seconds = Math.floor((words % 150) / (150 / 60));
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const exportToPDF = () => {
    if (!generatedScript) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Anime Script Pro - Production Script", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    const lines = generatedScript.split('\n');
    const tableData = [];
    let currentSection = "";
    
    const tableLines = lines.filter(l => l.includes('|') && !l.includes('---'));
    if (tableLines.length > 2) {
      const body = tableLines.slice(1).map(row => row.split('|').filter(cell => cell.trim() !== "").map(cell => cell.trim()));
      autoTable(doc, {
        startY: 40,
        head: [['Section', 'Character', 'Voiceover', 'Visuals', 'Sound']],
        body: body,
        theme: 'grid',
        headStyles: { fillColor: [220, 38, 38] }
      });
    } else {
      doc.text(generatedScript, 14, 40, { maxWidth: 180 });
    }
    
    doc.save("anime-script.pdf");
  };

  const handleSaveScript = async () => {
    if (!generatedScript || !user) return;
    setIsSaving(true);
    try {
      if (currentScriptId) {
        await updateDoc(doc(db, 'scripts', currentScriptId), {
          script: generatedScript,
          episode: episode,
          session: session,
          updatedAt: serverTimestamp()
        });
      } else {
        const docRef = await addDoc(collection(db, 'scripts'), {
          uid: user.uid,
          prompt: prompt || "Untitled Script",
          script: generatedScript,
          tone: tone,
          audience: audience,
          episode: episode,
          session: session,
          model: selectedModel,
          createdAt: serverTimestamp()
        });
        setCurrentScriptId(docRef.id);
      }
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'scripts');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateMetadata = async () => {
    if (!generatedScript) return;
    setIsGeneratingMetadata(true);
    navigate('/studio/seo');
    const metadata = await generateMetadata(generatedScript, selectedModel);
    setGeneratedMetadata(metadata);
    setIsGeneratingMetadata(false);
  };

  const handleGenerateImagePrompts = async () => {
    if (!generatedScript) return;
    setIsGeneratingImagePrompts(true);
    navigate('/studio/prompts');
    const prompts = await generateImagePrompts(generatedScript, selectedModel);
    setGeneratedImagePrompts(prompts);
    setIsGeneratingImagePrompts(false);
  };

  const playVoiceover = (text: string | null) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text.replace(/\|/g, ' '));
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-100 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Production Script
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {generatedScript && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 h-8 px-3"
                onClick={exportToPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              {isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-zinc-500 hover:text-zinc-300 h-8"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className={`border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 h-8 px-3 ${isEditing ? 'text-cyan-400 border-cyan-900/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-zinc-400 hover:text-cyan-300 hover:border-cyan-500/30'}`}
                onClick={() => {
                  if (isEditing) {
                    handleSaveScript();
                  } else {
                    setIsEditing(true);
                  }
                }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mr-2" />
                ) : (
                  isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Script')}
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="bg-[#050505]/50 border border-cyan-500/10 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="p-4 border-b border-cyan-500/10 bg-[#0a0a0a]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">AI Generated Script</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7 rounded-full transition-all duration-300",
                isLiked ? "text-fuchsia-400 bg-fuchsia-500/10 shadow-[0_0_10px_rgba(217,70,239,0.2)]" : "text-zinc-600 hover:text-fuchsia-400 hover:bg-[#0a0a0a]"
              )}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 relative z-10">
            <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono font-bold bg-black/50 px-2 py-1 rounded border border-zinc-800">
              <Clock className="w-3 h-3 text-cyan-500" />
              EST. {calculateDuration(generatedScript)}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-[10px] text-zinc-400 hover:text-cyan-300 hover:bg-cyan-900/20 uppercase tracking-widest font-bold"
                onClick={handleGenerateScript}
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
                  <div className="w-3 h-3 border border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mr-1.5" />
                ) : (
                  <Send className="w-3 h-3 mr-1.5" />
                )}
                {isLoading ? 'Generating...' : 'Generate Script'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-[10px] text-zinc-400 hover:text-cyan-300 hover:bg-cyan-900/20 uppercase tracking-widest font-bold"
                onClick={handleContinueScript}
                disabled={isContinuingScript || !generatedScript}
              >
                {isContinuingScript ? (
                  <div className="w-3 h-3 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mr-1" />
                ) : (
                  <Sparkles className="w-3 h-3 mr-1" />
                )}
                Continue
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-[10px] text-zinc-400 hover:text-cyan-300 hover:bg-cyan-900/20 uppercase tracking-widest font-bold"
                onClick={handleGenerateMetadata}
                disabled={isGeneratingMetadata}
              >
                <Search className="w-3 h-3 mr-1" /> SEO
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-[10px] text-zinc-400 hover:text-cyan-300 hover:bg-cyan-900/20 uppercase tracking-widest font-bold"
                onClick={handleGenerateImagePrompts}
                disabled={isGeneratingImagePrompts}
              >
                <ImageIcon className="w-3 h-3 mr-1" /> Prompts
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-[10px] text-zinc-400 hover:text-cyan-300 hover:bg-cyan-900/20 uppercase tracking-widest font-bold"
                onClick={() => playVoiceover(generatedScript)}
              >
                <Play className="w-3 h-3 mr-1" /> Listen
              </Button>
            </div>
          </div>
        </div>
        <ScrollArea className="h-[700px] w-full p-0">
          <div className="p-12 max-w-4xl mx-auto">
            {isEditing ? (
              <Textarea 
                className="min-h-[600px] bg-transparent border-none focus-visible:ring-0 text-zinc-300 font-mono text-sm resize-none leading-loose"
                value={generatedScript || ''}
                onChange={(e) => setGeneratedScript(e.target.value)}
              />
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-[500px] text-cyan-600">
                    <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                    <p className="font-sans font-medium tracking-widest text-xs uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">Initializing Production Core...</p>
                  </div>
                ) : generatedScript ? (
                  <div className="space-y-12">
                    {/* Editorial Script Header */}
                    <div className="border-b border-cyan-500/20 pb-12 mb-12 text-center space-y-4 relative">
                      <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        Official Production Script
                      </div>
                      <h1 className="text-4xl font-black text-cyan-50 leading-tight uppercase tracking-tight drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                        {prompt?.split(' ').slice(0, 5).join(' ') || "Untitled Sequence"}
                      </h1>
                      <div className="flex items-center justify-center gap-6 text-[11px] uppercase tracking-widest text-zinc-400 font-bold">
                        <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-cyan-500/20 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                          <Clapperboard className="w-3 h-3 text-cyan-400" />
                          Session {session}
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-fuchsia-500/20 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                          <Hash className="w-3 h-3 text-fuchsia-400" />
                          Episode {episode}
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-teal-500/20 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                          <Users className="w-3 h-3 text-teal-400" />
                          {audience}
                        </span>
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none 
                      prose-table:border-separate prose-table:border-spacing-0 prose-table:shadow-[0_0_30px_rgba(0,0,0,0.8)] prose-table:rounded-xl prose-table:overflow-hidden prose-table:border prose-table:border-cyan-500/20
                      prose-th:bg-[#0a0a0a] prose-th:text-cyan-400 prose-th:font-black prose-th:p-4 prose-th:text-left prose-th:border-b prose-th:border-cyan-500/30 prose-th:text-[10px] prose-th:uppercase prose-th:tracking-[0.2em] prose-th:font-sans
                      prose-td:p-5 prose-td:border-b prose-td:border-zinc-800/50 prose-td:text-[13px] prose-td:text-zinc-300 prose-td:align-top prose-td:leading-relaxed prose-td:font-sans prose-td:bg-[#050505]/50
                      prose-tr:hover:td:bg-cyan-900/10 prose-tr:hover:td:text-cyan-50
                      prose-h1:font-sans prose-h1:font-black prose-h1:tracking-tight prose-h1:text-cyan-100 prose-h1:uppercase
                      prose-h2:font-sans prose-h2:font-bold prose-h2:tracking-tight prose-h2:text-cyan-200 prose-h2:uppercase
                      prose-h3:font-sans prose-h3:font-bold prose-h3:tracking-tight prose-h3:text-cyan-300 prose-h3:uppercase
                      prose-strong:text-cyan-400 prose-strong:font-bold prose-strong:tracking-wide
                      overflow-x-auto no-scrollbar"
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedScript}</ReactMarkdown>
                    </div>

                    <div className="mt-24 pt-12 border-t border-cyan-500/10 text-center">
                      <p className="text-[10px] text-cyan-500/50 uppercase tracking-[0.5em] font-bold drop-shadow-[0_0_5px_rgba(6,182,212,0.2)]">
                        End of Sequence
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[500px] text-zinc-600">
                    <Sparkles className="w-16 h-16 mb-6 opacity-20" />
                    <p className="mb-8 font-sans font-medium text-xs uppercase tracking-widest">Awaiting prompt to initialize sequence.</p>
                    <Button 
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-none shadow-[0_0_20px_rgba(6,182,212,0.4)] font-bold tracking-[0.2em] uppercase text-xs h-12 px-8 rounded-full transition-all hover:scale-105 active:scale-95"
                      onClick={handleGenerateScript}
                      disabled={isLoading || !prompt.trim()}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                      ) : (
                        <Send className="w-4 h-4 mr-3" />
                      )}
                      Launch Production
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}
