import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Clock, 
  Download, 
  Save, 
  Edit3,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGenerator } from '@/contexts/GeneratorContext';
import {
  continueAnimeScript,
  formatScriptToStandard,
  generateSceneBreakdown,
  generateImagePrompts,
  generateLoreProfile,
  generateMetadata,
  rewriteScriptSelection,
  analyzePacing,
  generateDialogueVariations,
  translateScript,
} from '@/services/geminiService';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { auth, db } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { useNavigate } from 'react-router-dom';
import { SectionHeading } from '@/components/page/PageShell';
import { ScriptQuickActions } from '@/components/studio/ScriptQuickActions';
import { ScriptFocusMode } from '@/components/studio/ScriptFocusMode';
import { ScriptReadOnlyView } from '@/components/studio/ScriptReadOnlyView';
import { 
  calculateDuration, 
  extractDialogueLines,
  getCharacterStats,
  analyzeSentimentMap,
  extractDirectorNotes,
  detectBeats,
  extractLoreCandidates,
  getHighlightKind,
  Beat,
} from '@/components/studio/scriptWorkspaceUtils';

// Modular Components
import { WritingAssist } from './workspace/WritingAssist';
import { SnapshotManager } from './workspace/SnapshotManager';
import { EditorSection } from './workspace/EditorSection';
import { PreviewSection } from './workspace/PreviewSection';
import { DialogueContextMenu } from './workspace/DialogueContextMenu';
import { PacingIssues } from './workspace/PacingIssues';
import { ProductionAnalytics } from './workspace/ProductionAnalytics';
import { SentimentHeatmap } from './workspace/SentimentHeatmap';
import { BeatBoard } from './workspace/BeatBoard';
import { AmbientController } from './workspace/AmbientController';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ScriptWorkspace() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorScrollRef = useRef<HTMLPreElement | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  
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

  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
  const [isExpandingSelection, setIsExpandingSelection] = useState(false);
  const [isCondensingSelection, setIsCondensingSelection] = useState(false);
  const [isFormattingScreenplay, setIsFormattingScreenplay] = useState(false);
  const [isFormattingAnime, setIsFormattingAnime] = useState(false);
  const [isGeneratingBreakdown, setIsGeneratingBreakdown] = useState(false);
  const [loreProfiles, setLoreProfiles] = useState<Record<string, string>>({});
  const [loadingLore, setLoadingLore] = useState<Record<string, boolean>>({});
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [sceneBreakdown, setSceneBreakdown] = useState<string>('');
  const [snapshots, setSnapshots] = useState<Array<{ id: string; name: string; script: string; createdAt: string }>>([]);
  
  const [isAnalyzingPacing, setIsAnalyzingPacing] = useState(false);
  const [pacingIssues, setPacingIssues] = useState<Array<{type: string, issue: string, suggestion: string, segment: string}>>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, text: string } | null>(null);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [dialogueVariations, setDialogueVariations] = useState<string>('');
  
  // Analytics States
  const [charStats, setCharStats] = useState<Array<{name: string, count: number}>>([]);
  const [sentimentMap, setSentimentMap] = useState<string[]>([]);
  
  // Workflow States
  const [beats, setBeats] = useState<Beat[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [characterVoices, setCharacterVoices] = useState<Record<string, string>>({});

  const selectedText = useMemo(() => {
    if (!generatedScript) return '';
    return generatedScript.slice(selectionRange.start, selectionRange.end);
  }, [generatedScript, selectionRange]);

  const loreCandidates = useMemo(() => extractLoreCandidates(generatedScript || ''), [generatedScript]);
  const isLorePending = useMemo(() => Object.values(loadingLore).some(Boolean), [loadingLore]);
  const snapshotStorageKey = useMemo(() => `anime-script-snapshots:${currentScriptId || 'draft'}`, [currentScriptId]);

  const exportDialogueSides = () => {
    if (!generatedScript) return;
    const dialogue = extractDialogueLines(generatedScript);
    if (dialogue.length === 0) return;

    const sidesDocument = [
      'VOICE ACTOR SIDES',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      ...dialogue.map((line, index) => `${index + 1}. ${line}`),
      '',
      `Total Lines: ${dialogue.length}`,
    ].join('\n');

    const blob = new Blob([sidesDocument], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voice-actor-sides-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerateSceneBreakdown = async () => {
    if (!generatedScript) return;
    setIsGeneratingBreakdown(true);
    try {
      const breakdown = await generateSceneBreakdown(generatedScript, selectedModel);
      setSceneBreakdown(breakdown);
    } finally {
      setIsGeneratingBreakdown(false);
    }
  };

  const handleSaveSnapshot = () => {
    if (!generatedScript) return;
    const next = {
      id: crypto.randomUUID(),
      name: `Snapshot ${new Date().toLocaleTimeString()}`,
      script: generatedScript,
      createdAt: new Date().toISOString(),
    };
    setSnapshots((prev) => [next, ...prev].slice(0, 20));
  };

  const handleRestoreSnapshot = (snapshotId: string) => {
    const selected = snapshots.find((snapshot) => snapshot.id === snapshotId);
    if (!selected) return;
    setGeneratedScript(selected.script);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(snapshotStorageKey);
      if (!raw) {
        setSnapshots([]);
        return;
      }
      const parsed = JSON.parse(raw) as Array<{ id: string; name: string; script: string; createdAt: string }>;
      setSnapshots(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSnapshots([]);
    }
  }, [snapshotStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(snapshotStorageKey, JSON.stringify(snapshots));
    } catch {
      // Ignore localStorage errors
    }
  }, [snapshots, snapshotStorageKey]);

  const centerCaretLine = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const caretPosition = textarea.selectionEnd ?? 0;
    const beforeCaret = (generatedScript || '').slice(0, caretPosition);
    const lineIndex = beforeCaret.split('\n').length - 1;
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = Number.parseFloat(computedStyle.lineHeight || '20') || 20;
    const paddingTop = Number.parseFloat(computedStyle.paddingTop || '0') || 0;
    const targetScrollTop = Math.max(0, lineIndex * lineHeight - textarea.clientHeight / 2 + lineHeight / 2 - paddingTop);
    textarea.scrollTop = targetScrollTop;
    if (editorScrollRef.current) {
      editorScrollRef.current.scrollTop = targetScrollTop;
    }
  };

  const syncScroll = () => {
    const textarea = textareaRef.current;
    const overlay = editorScrollRef.current;
    const preview = previewScrollRef.current;
    if (textarea && overlay) {
      overlay.scrollTop = textarea.scrollTop;
      overlay.scrollLeft = textarea.scrollLeft;
    }
    if (preview && textarea) {
      preview.scrollTop = textarea.scrollTop;
    }
  };

  const syncSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    setSelectionRange({
      start: textarea.selectionStart ?? 0,
      end: textarea.selectionEnd ?? 0,
    });
  };

  const replaceSelection = (replacement: string) => {
    if (!generatedScript) return;
    const nextScript = `${generatedScript.slice(0, selectionRange.start)}${replacement}${generatedScript.slice(selectionRange.end)}`;
    setGeneratedScript(nextScript);
    const nextCursor = selectionRange.start + replacement.length;
    setSelectionRange({ start: nextCursor, end: nextCursor });
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(nextCursor, nextCursor);
      centerCaretLine();
    });
  };

  const fetchLoreProfile = async (entityName: string) => {
    if (!generatedScript || loreProfiles[entityName] || loadingLore[entityName]) return;
    setLoadingLore((prev) => ({ ...prev, [entityName]: true }));
    try {
      const profile = await generateLoreProfile(entityName, generatedScript, selectedModel);
      setLoreProfiles((prev) => ({ ...prev, [entityName]: profile }));
    } finally {
      setLoadingLore((prev) => ({ ...prev, [entityName]: false }));
    }
  };

  useEffect(() => {
    if (!generatedScript || !isEditing) return;
    const timer = window.setTimeout(() => {
      loreCandidates.slice(0, 5).forEach((candidate) => {
        void fetchLoreProfile(candidate);
      });
    }, 700);
    return () => window.clearTimeout(timer);
  }, [generatedScript, isEditing, loreCandidates]);

  // Handle Analytics Update
  useEffect(() => {
    if (!generatedScript) return;
    const timer = window.setTimeout(() => {
      setCharStats(getCharacterStats(generatedScript));
      setSentimentMap(analyzeSentimentMap(generatedScript));
      setBeats(detectBeats(generatedScript));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [generatedScript]);

  const handleSelectionRewrite = async (mode: 'expand' | 'condense') => {
    if (!generatedScript || !selectedText.trim()) return;
    if (mode === 'expand') setIsExpandingSelection(true);
    else setIsCondensingSelection(true);
    try {
      const rewritten = await rewriteScriptSelection(selectedText, generatedScript, mode, selectedModel);
      replaceSelection(rewritten);
    } finally {
      setIsExpandingSelection(false);
      setIsCondensingSelection(false);
    }
  };

  const handleFormatScript = async (format: 'screenplay' | 'anime') => {
    if (!generatedScript) return;
    if (format === 'screenplay') setIsFormattingScreenplay(true);
    else setIsFormattingAnime(true);
    try {
      const formatted = await formatScriptToStandard(generatedScript, format, selectedModel);
      setGeneratedScript(formatted);
    } finally {
      setIsFormattingScreenplay(false);
      setIsFormattingAnime(false);
    }
  };

  const handleAnalyzePacing = async () => {
    if (!generatedScript) return;
    setIsAnalyzingPacing(true);
    setPacingIssues([]);
    try {
      const issues = await analyzePacing(generatedScript, selectedModel);
      setPacingIssues(issues || []);
    } finally {
      setIsAnalyzingPacing(false);
    }
  };

  const handleGenerateVariations = async (text: string) => {
    if (!text || !generatedScript) return;
    setIsGeneratingVariations(true);
    setDialogueVariations('');
    try {
      const variations = await generateDialogueVariations(text, generatedScript, selectedModel);
      setDialogueVariations(variations);
    } finally {
      setIsGeneratingVariations(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    const selection = window.getSelection()?.toString();
    if (selection && selection.trim().length > 0) {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, text: selection.trim() });
    } else {
      setContextMenu(null);
    }
  };

  const renderHighlightedEditor = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const kind = getHighlightKind(line);
      const rowKey = `line-${index}`;
      const classNames: Record<string, string> = {
        'heading': 'text-amber-300 font-semibold',
        'character': 'text-sky-400 font-semibold',
        'dialogue': 'text-zinc-100',
        'table-heading': 'text-amber-300 font-semibold',
        'table-dialogue': 'text-zinc-100',
        'table-scene': 'text-sky-400',
        'table-sound': 'text-zinc-400 italic',
      };
      return <div key={rowKey} className={classNames[kind] || 'text-zinc-500'}>{line || ' '}</div>;
    });
  };

  const handleContinueScript = async () => {
    if (!generatedScript) return;
    setIsContinuingScript(true);
    try {
      const nextScenes = await continueAnimeScript(generatedScript, selectedModel);
      const lines = nextScenes.split('\n').filter((l: string) => l.includes('|') && !l.includes('---') && !l.toLowerCase().includes('section'));
      setGeneratedScript(generatedScript + '\n' + lines.join('\n'));
    } finally {
      setIsContinuingScript(false);
    }
  };

  const handleTranslate = async (lang: string) => {
    if (!generatedScript) return;
    setIsTranslating(true);
    try {
      const translated = await translateScript(generatedScript, lang, selectedModel);
      // Save current as snapshot first
      handleSaveSnapshot();
      setGeneratedScript(translated);
    } finally {
      setIsTranslating(false);
    }
  };

  const exportDirectorNotes = () => {
    if (!generatedScript) return;
    const notes = extractDirectorNotes(generatedScript);
    if (notes.length === 0) return;

    const notesContent = [
      'DIRECTOR\'S PRODUCTION NOTES',
      `Script: ${prompt || 'Untitled'}`,
      `Generated: ${new Date().toLocaleString()}`,
      '',
      ...notes.map((note, idx) => `${idx + 1}. ${note}`),
      '',
      `Total Notes: ${notes.length}`
    ].join('\n');

    const blob = new Blob([notesContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `directors-notes-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBeatJump = (lineIndex: number) => {
    if (!textareaRef.current) return;
    const lines = (generatedScript || '').split('\n');
    const targetCharIdx = lines.slice(0, lineIndex).join('\n').length + 1;
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(targetCharIdx, targetCharIdx);
    setActiveLineIndex(lineIndex);
    centerCaretLine();
  };

  const handleVoicePreview = (text: string) => {
    // 1. Determine speaker
    const speakerMatch = text.match(/^([A-Z][A-Z\s'-]+):/);
    const speaker = speakerMatch ? speakerMatch[1].trim() : '';
    
    // 2. Map voice
    const voiceId = characterVoices[speaker] || 'v1';
    const voiceProfile = [
      { id: 'v1', pitch: 1, rate: 1 },
      { id: 'v2', pitch: 0.7, rate: 0.9 },
      { id: 'v3', pitch: 1.2, rate: 1.1 },
      { id: 'v4', pitch: 0.8, rate: 0.8 },
      { id: 'v5', pitch: 1, rate: 1.5 },
    ].find(v => v.id === voiceId) || { pitch: 1, rate: 1 };

    // 3. Trigger speech
    const utterance = new SpeechSynthesisUtterance(text.split(':').slice(1).join(':') || text);
    utterance.pitch = voiceProfile.pitch;
    utterance.rate = voiceProfile.rate;
    window.speechSynthesis.speak(utterance);
  };

  const exportToPDF = () => {
    if (!generatedScript) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Anime Script Pro - Production Script", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    const lines = generatedScript.split('\n');
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
          episode, session,
          updatedAt: serverTimestamp()
        });
      } else {
        const docRef = await addDoc(collection(db, 'scripts'), {
          uid: user.uid,
          prompt: prompt || "Untitled Script",
          script: generatedScript,
          tone, audience, episode, session,
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

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={isFocusMode ? 'fixed inset-0 z-50 bg-zinc-950' : 'space-y-4'}
    >
      {isFocusMode ? (
        <ScriptFocusMode
          generatedScript={generatedScript || ''}
          editorScrollRef={editorScrollRef}
          textareaRef={textareaRef}
          onExit={() => setIsFocusMode(false)}
          onChange={(nextValue) => {
            setGeneratedScript(nextValue);
            requestAnimationFrame(() => { syncSelection(); centerCaretLine(); syncScroll(); });
          }}
          onSyncSelectAndScroll={() => { syncSelection(); centerCaretLine(); syncScroll(); }}
          onScroll={syncScroll}
          renderHighlightedEditor={renderHighlightedEditor}
        />
      ) : (
        <>
          <SectionHeading
            title="Production Script"
            icon={<Sparkles className="w-5 h-5 text-red-500" />}
            actions={
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {generatedScript && (
                  <>
                    <Button variant="outline" size="sm" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400" onClick={exportToPDF}>
                      <Download className="w-4 h-4 mr-2" /> PDF
                    </Button>
                    <Button variant="outline" size="sm" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400" onClick={() => setIsFocusMode(true)}>
                      Focus Mode
                    </Button>
                    <Button variant="outline" size="sm" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400" onClick={handleSaveSnapshot}>
                      <Camera className="w-4 h-4 mr-2" /> Save Snapshot
                    </Button>
                    {isEditing && (
                      <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-300" onClick={() => setIsEditing(false)} disabled={isSaving}>
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant="outline" size="sm"
                      className={`border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 ${isEditing ? 'text-red-400 border-red-900/30' : 'text-zinc-400'}`}
                      onClick={() => isEditing ? handleSaveScript() : setIsEditing(true)}
                      disabled={isSaving}
                    >
                      {isSaving ? <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mr-2" /> : (isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />)}
                      {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Script')}
                    </Button>
                  </>
                )}
              </div>
            }
          />

          <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-red-500">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Production Hub</span>
                </div>
                <div className="h-4 w-px bg-zinc-800" />
                <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">EST. RUNTIME: {calculateDuration(generatedScript)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono">
                  <Clock className="w-3 h-3" /> EST. {calculateDuration(generatedScript)}
                </div>
                <ScriptQuickActions
                  hasScript={Boolean(generatedScript)}
                  isContinuingScript={isContinuingScript}
                  isGeneratingMetadata={isGeneratingMetadata}
                  isGeneratingImagePrompts={isGeneratingImagePrompts}
                  onContinue={handleContinueScript}
                  onGenerateSeo={handleGenerateMetadata}
                  onGeneratePrompts={handleGenerateImagePrompts}
                  onListen={() => playVoiceover(generatedScript)}
                />
              </div>
            </div>

            <div className="bg-black/20 border-b border-zinc-800/50 p-3 flex items-center justify-between">
               <AmbientController currentLine={generatedScript?.split('\n')[activeLineIndex] || ''} />
               <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest italic pr-4">
                  Neural Ambience System Active
               </div>
            </div>

            <ScrollArea className="h-[600px] w-full p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <WritingAssist 
                    selectedText={selectedText}
                    hasScript={Boolean(generatedScript)}
                    isExpanding={isExpandingSelection}
                    isCondensing={isCondensingSelection}
                    isFormattingScreenplay={isFormattingScreenplay}
                    isFormattingAnime={isFormattingAnime}
                    isGeneratingBreakdown={isGeneratingBreakdown}
                    isAnalyzingPacing={isAnalyzingPacing}
                    onRewrite={handleSelectionRewrite}
                    onFormat={handleFormatScript}
                    onExportSides={exportDialogueSides}
                    onExportNotes={exportDirectorNotes}
                    onGenerateBreakdown={handleGenerateSceneBreakdown}
                    onAnalyzePacing={handleAnalyzePacing}
                    onTranslate={handleTranslate}
                    isTranslating={isTranslating}
                  />

                  <SnapshotManager snapshots={snapshots} onRestore={handleRestoreSnapshot} />

                  <PacingIssues 
                    issues={pacingIssues} 
                    onClear={() => setPacingIssues([])} 
                    onFindInScript={(seg) => {
                      if (textareaRef.current) {
                        const index = generatedScript?.indexOf(seg);
                        if (index !== undefined && index !== -1) {
                          textareaRef.current.focus();
                          textareaRef.current.setSelectionRange(index, index + seg.length);
                          syncSelection(); centerCaretLine();
                        }
                      }
                    }}
                  />

                  {sceneBreakdown && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300 mb-3">Auto Scene Breakdown</p>
                      <div className="prose prose-invert prose-emerald max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 text-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{sceneBreakdown}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="relative group">
                      <EditorSection 
                        generatedScript={generatedScript || ''}
                        editorScrollRef={editorScrollRef}
                        textareaRef={textareaRef}
                        selectionText={selectedText}
                        onScriptChange={(val) => { setGeneratedScript(val); requestAnimationFrame(() => { syncSelection(); syncScroll(); }); }}
                        onSelectionSync={() => { syncSelection(); syncScroll(); }}
                        onScroll={() => {
                          syncScroll();
                          if (textareaRef.current) {
                            const beforeCaret = generatedScript?.slice(0, textareaRef.current.selectionEnd) || '';
                            const idx = beforeCaret.split('\n').length - 1;
                            setActiveLineIndex(idx);
                          }
                        }}
                        onContextMenu={handleContextMenu}
                        renderHighlightedEditor={renderHighlightedEditor}
                      />
                      <SentimentHeatmap sentimentMap={sentimentMap} />
                    </div>

                    <div className="space-y-6">
                      <ProductionAnalytics 
                        characterStats={charStats}
                        sentimentMap={sentimentMap}
                        totalLines={generatedScript?.split('\n').length || 1}
                        characterVoices={characterVoices}
                        onAssignVoice={(c, v) => setCharacterVoices(prev => ({ ...prev, [c]: v }))}
                      />
                      <BeatBoard 
                        beats={beats} 
                        onBeatClick={handleBeatJump} 
                        activeLineIndex={activeLineIndex}
                      />
                      <PreviewSection 
                        generatedScript={generatedScript || ''}
                        previewScrollRef={previewScrollRef}
                        isLorePending={isLorePending}
                        loreCandidatesCount={loreCandidates.length}
                      />
                    </div>
                  </div>
                  
                  {contextMenu && (
                    <DialogueContextMenu 
                      {...contextMenu}
                      isGenerating={isGeneratingVariations}
                      variations={dialogueVariations}
                      onGenerate={handleGenerateVariations}
                      onPreview={handleVoicePreview}
                      onDismiss={() => { setDialogueVariations(''); setContextMenu(null); }}
                      onMouseLeave={() => !isGeneratingVariations && setContextMenu(null)}
                    />
                  )}
                </div>
              ) : (
                <ScriptReadOnlyView isLoading={isLoading} generatedScript={generatedScript || ''} />
              )}
            </ScrollArea>
          </Card>
        </>
      )}
    </motion.div>
  );
}
