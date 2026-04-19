import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';

// Sub-components
import { ScriptToolbar } from './components/Script/ScriptToolbar';
import { ScriptHeaderInfo } from './components/Script/ScriptHeaderInfo';
import { ScriptView } from './components/Script/ScriptView';
import { ScriptEmptyState } from './components/Script/ScriptEmptyState';

export function ScriptPage() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = React.useState(false);
  const {
    generatedScript, setGeneratedScript,
    setGeneratedMetadata,
    setGeneratedImagePrompts,
    selectedModel,
    isLoading, setIsLoading,
    isGeneratingMetadata, setIsGeneratingMetadata,
    isGeneratingImagePrompts, setIsGeneratingImagePrompts,
    isEditing, setIsEditing,
    isSaving, setIsSaving,
    isContinuingScript, setIsContinuingScript,
    currentScriptId, setCurrentScriptId,
    setEpisode, setSession, setVisualData,
    tone, audience, prompt, episode, session, contentType, numScenes,
    generatedWorld, generatedCharacters, narrativeBeats, characterRelationships
  } = useGenerator();

  const handleContinueScript = async () => {
    if (!generatedScript) return;
    setIsContinuingScript(true);
    try {
      const nextScenes = await continueScript(generatedScript, selectedModel, contentType);
      const lines = nextScenes.split('\n').filter(l => l.includes('|') && !l.includes('---') && !l.toLowerCase().includes('scene') && !l.toLowerCase().includes('section'));
      setGeneratedScript(generatedScript + '\n' + lines.join('\n'));
    } catch (error) {
      console.error(error);
    } finally {
      setIsContinuingScript(false);
    }
  };

  const handleNextEpisode = async () => {
    // 1. Calculate next episode/session
    let nextEp = parseInt(episode) + 1;
    let nextSess = parseInt(session);
    
    // Assume 12 episodes per session as a standard threshold for rollover
    if (nextEp > 12) {
      nextEp = 1;
      nextSess += 1;
    }

    // 2. Update state
    setEpisode(nextEp.toString());
    setSession(nextSess.toString());
    setGeneratedScript(null);
    setCurrentScriptId(null);
    setVisualData({});

    // 3. Trigger generation for the new unit
    setIsLoading(true);
    try {
      const script = await generateScript(
        prompt, tone, audience, 
        nextSess.toString(), nextEp.toString(), 
        numScenes, selectedModel, contentType, 
        'Dynamic/Hype', narrativeBeats, 
        characterRelationships, generatedWorld, generatedCharacters
      );
      setGeneratedScript(script);
      if (user) {
        await addDoc(collection(db, 'scripts'), { 
          uid: user.uid, prompt, script, tone, audience, 
          episode: nextEp.toString(), session: nextSess.toString(), 
          contentType, model: selectedModel, narrativeBeats, 
          characterRelationships, generatedWorld, generatedCharacters, 
          createdAt: serverTimestamp() 
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'scripts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateScript = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const script = await generateScript(prompt, tone, audience, session, episode, numScenes, selectedModel, contentType, 'Dynamic/Hype', narrativeBeats, characterRelationships, generatedWorld, generatedCharacters);
      setGeneratedScript(script);
      setCurrentScriptId(null);
      if (user) {
        await addDoc(collection(db, 'scripts'), { uid: user.uid, prompt, script, tone, audience, episode, session, contentType, model: selectedModel, narrativeBeats, characterRelationships, generatedWorld, generatedCharacters, createdAt: serverTimestamp() });
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
    doc.text(`${contentType} Script Pro - Production Script`, 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    const tableLines = generatedScript.split('\n').filter(l => l.includes('|') && !l.includes('---'));
    if (tableLines.length > 2) {
      const body = tableLines.slice(1).map(row => row.split('|').filter(cell => cell.trim() !== "").map(cell => cell.trim()));
      autoTable(doc, { 
        startY: 40, 
        head: [['Scene #', 'Section', 'Character', 'Voiceover', 'Visuals', 'Sound']], 
        body, 
        theme: 'grid', 
        headStyles: { fillColor: [6, 78, 94] } 
      });
    } else {
      doc.text(generatedScript, 14, 40, { maxWidth: 180 });
    }
    doc.save(`${contentType.toLowerCase()}-script.pdf`);
  };

  const handleSaveScript = async () => {
    if (!generatedScript || !user) return;
    setIsSaving(true);
    try {
      if (currentScriptId) {
        await updateDoc(doc(db, 'scripts', currentScriptId), { script: generatedScript, episode, session, updatedAt: serverTimestamp() });
      } else {
        const docRef = await addDoc(collection(db, 'scripts'), { uid: user.uid, prompt: prompt || "Untitled Script", script: generatedScript, tone, audience, episode, session, model: selectedModel, createdAt: serverTimestamp() });
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-studio text-shadow-studio">
          <Sparkles className="w-5 h-5 text-studio" /> Production Script
        </h2>
        <div className="flex items-center gap-2">
          <ScriptToolbar 
            generatedScript={generatedScript}
            exportToPDF={exportToPDF}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isSaving={isSaving}
            handleSaveScript={handleSaveScript}
          />
        </div>
      </div>

      <Card className="bg-[#050505]/50 border border-studio shadow-studio overflow-hidden">
        <ScriptHeaderInfo 
          isLiked={isLiked} setIsLiked={setIsLiked}
          generatedScript={generatedScript}
          calculateDuration={calculateDuration}
          handleGenerateScript={handleGenerateScript}
          isLoading={isLoading}
          prompt={prompt}
          handleContinueScript={handleContinueScript}
          isContinuingScript={isContinuingScript}
          handleNextEpisode={handleNextEpisode}
          handleGenerateMetadata={handleGenerateMetadata}
          isGeneratingMetadata={isGeneratingMetadata}
          handleGenerateImagePrompts={handleGenerateImagePrompts}
          isGeneratingImagePrompts={isGeneratingImagePrompts}
          playVoiceover={playVoiceover}
          session={session}
          episode={episode}
          narrativeBeats={narrativeBeats}
        />
        <div className="w-full p-0">
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
                  <div className="flex flex-col items-center justify-center h-[500px] text-studio">
                    <div className="w-10 h-10 border-2 border-studio/30 border-t-studio rounded-full animate-spin mb-6 shadow-studio" />
                    <p className="font-sans font-medium tracking-widest text-xs uppercase text-shadow-studio">Initializing Production Core...</p>
                  </div>
                ) : generatedScript ? (
                  <ScriptView 
                    generatedScript={generatedScript}
                    prompt={prompt}
                    session={session}
                    episode={episode}
                    audience={audience}
                  />
                ) : (
                  <ScriptEmptyState 
                    isLoading={isLoading}
                    prompt={prompt}
                    handleGenerateScript={handleGenerateScript}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
