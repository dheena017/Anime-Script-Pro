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
  Play 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateMetadata, generateImagePrompts, continueAnimeScript } from '@/services/geminiService';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { auth, db } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { useNavigate } from 'react-router-dom';

export function ScriptPage() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const {
    generatedScript, setGeneratedScript,
    setGeneratedMetadata,
    setGeneratedImagePrompts,
    selectedModel,
    isLoading,
    isGeneratingMetadata, setIsGeneratingMetadata,
    isGeneratingImagePrompts, setIsGeneratingImagePrompts,
    isEditing, setIsEditing,
    isSaving, setIsSaving,
    isContinuingScript, setIsContinuingScript,
    currentScriptId, setCurrentScriptId,
    tone, audience, prompt, episode, session
  } = useGenerator();

  const handleContinueScript = async () => {
    if (!generatedScript) return;
    setIsContinuingScript(true);
    try {
      const nextScenes = await continueAnimeScript(generatedScript, selectedModel);
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
        head: [['Section', 'Voiceover', 'Visuals', 'Sound']],
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-red-500" />
          Production Script
        </h2>
        <div className="flex items-center gap-2">
          {generatedScript && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400"
                onClick={exportToPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              {isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-zinc-500 hover:text-zinc-300"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className={`border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 ${isEditing ? 'text-red-400 border-red-900/30' : 'text-zinc-400'}`}
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
                  <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mr-2" />
                ) : (
                  isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Script')}
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-500">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">AI Generated Script</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono">
              <Clock className="w-3 h-3" />
              EST. {calculateDuration(generatedScript)}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] text-zinc-400 hover:text-white"
                onClick={handleContinueScript}
                disabled={isContinuingScript || !generatedScript}
              >
                {isContinuingScript ? (
                  <div className="w-3 h-3 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mr-1" />
                ) : (
                  <Sparkles className="w-3 h-3 mr-1" />
                )}
                Continue
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] text-zinc-400 hover:text-white"
                onClick={handleGenerateMetadata}
                disabled={isGeneratingMetadata}
              >
                <Search className="w-3 h-3 mr-1" /> SEO
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] text-zinc-400 hover:text-white"
                onClick={handleGenerateImagePrompts}
                disabled={isGeneratingImagePrompts}
              >
                <ImageIcon className="w-3 h-3 mr-1" /> Prompts
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] text-zinc-400 hover:text-white"
                onClick={() => playVoiceover(generatedScript)}
              >
                <Play className="w-3 h-3 mr-1" /> Listen
              </Button>
            </div>
          </div>
        </div>
        <ScrollArea className="h-[600px] w-full p-6">
          {isEditing ? (
            <Textarea 
              className="min-h-[550px] bg-transparent border-none focus-visible:ring-0 text-zinc-300 font-mono text-sm resize-none"
              value={generatedScript || ''}
              onChange={(e) => setGeneratedScript(e.target.value)}
            />
          ) : (
            <div className="prose prose-invert prose-red max-w-none prose-table:border-collapse prose-th:border prose-th:border-zinc-800 prose-th:bg-zinc-900/80 prose-th:p-3 prose-th:text-left prose-td:border prose-td:border-zinc-800/50 prose-td:p-4 prose-td:align-top">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
                  <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-4" />
                  <p>Generating your masterpiece...</p>
                </div>
              ) : generatedScript ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedScript}</ReactMarkdown>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
                  <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                  <p>Generate a script to see it here.</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </Card>
    </motion.div>
  );
}
