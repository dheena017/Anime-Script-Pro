import React, { useEffect } from 'react';
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
import { jsPDF } from "jspdf";
import { SectionHeading } from '@/components/page/PageShell';
import { ScriptQuickActions } from '@/components/studio/ScriptQuickActions';
import { ScriptFocusMode } from '@/components/studio/ScriptFocusMode';
import { ScriptReadOnlyView } from '@/components/studio/ScriptReadOnlyView';
import { 
  getHighlightKind,
} from '@/components/studio/scriptWorkspaceUtils';

// Modular Components
import { WritingAssist } from './workspace/WritingAssist';
import { SnapshotManager } from './workspace/SnapshotManager';
import { EditorSection } from './workspace/EditorSection';
import { PreviewSection } from './workspace/PreviewSection';
import { DialogueContextMenu } from './workspace/DialogueContextMenu';
import { PacingIssues } from './workspace/PacingIssues';
import { SentimentHeatmap } from './workspace/SentimentHeatmap';
import { AmbientController } from './workspace/AmbientController';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useScriptWorkspace } from '@/hooks/useScriptWorkspace';
import { ScriptAnalytics } from './workspace/ScriptAnalytics';

export function ScriptWorkspace() {
  const {
    textareaRef, editorScrollRef, previewScrollRef,
    generatedScript, setGeneratedScript,
    selectedModel, isLoading, isEditing, setIsEditing,
    isSaving, setIsSaving, snapshots, setSnapshots,
    selectionRange, setSelectionRange, selectedText,
    isExpandingSelection, isCondensingSelection,
    isFormattingScreenplay, isFormattingAnime,
    isGeneratingBreakdown, sceneBreakdown, setSceneBreakdown,
    isFocusMode, setIsFocusMode,
    isAnalyzingPacing, pacingIssues, setPacingIssues,
    contextMenu, setContextMenu,
    isGeneratingVariations, dialogueVariations, setDialogueVariations,
    charStats, sentimentMap, beats,
    isTranslating, setIsTranslating,
    activeLineIndex, setActiveLineIndex,
    characterVoices, setCharacterVoices,
    loreCandidates, isLorePending,
    syncScroll, syncSelection,
    handleSaveScript, handleContinueScript,
    handleGenerateMetadata, handleGenerateImagePrompts,
    rewriteScriptSelection, formatScriptToStandard, analyzePacing, generateDialogueVariations, translateScript, generateSceneBreakdown,
    calculateDuration
  } = useScriptWorkspace();

  const handleGenerateBreakdown = async () => {
    if (!generatedScript) return;
    const breakdown = await generateSceneBreakdown(generatedScript, selectedModel);
    setSceneBreakdown(breakdown);
  };

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

  const syncSelectionAndScroll = () => {
    syncSelection();
    syncScroll();
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

  const handleSelectionRewrite = async (mode: 'expand' | 'condense') => {
    if (!generatedScript || !selectedText.trim()) return;
    const rewritten = await rewriteScriptSelection(selectedText, generatedScript, mode, selectedModel);
    replaceSelection(rewritten);
  };

  const handleFormatScript = async (format: 'screenplay' | 'anime') => {
    if (!generatedScript) return;
    const formatted = await formatScriptToStandard(generatedScript, format, selectedModel);
    setGeneratedScript(formatted);
  };

  const handleAnalyzePacing = async () => {
    if (!generatedScript) return;
    const issues = await analyzePacing(generatedScript, selectedModel);
    setPacingIssues(issues || []);
  };

  const handleGenerateVariations = async (text: string) => {
    if (!text || !generatedScript) return;
    const variations = await generateDialogueVariations(text, generatedScript, selectedModel);
    setDialogueVariations(variations);
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

  const handleTranslate = async (lang: string) => {
    if (!generatedScript) return;
    const translated = await translateScript(generatedScript, lang, selectedModel);
    setGeneratedScript(translated);
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
    const utterance = new SpeechSynthesisUtterance(text.split(':').slice(1).join(':') || text);
    window.speechSynthesis.speak(utterance);
  };

  const exportToPDF = () => {
    if (!generatedScript) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Production Script", 14, 22);
    doc.setFontSize(10);
    doc.text(generatedScript, 14, 40, { maxWidth: 180 });
    doc.save("anime-script.pdf");
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

  const playVoiceover = (text: string | null) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text.replace(/\|/g, ' '));
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [setContextMenu]);

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
            requestAnimationFrame(() => { syncSelectionAndScroll(); centerCaretLine(); });
          }}
          onSyncSelectAndScroll={syncSelectionAndScroll}
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

          <Card className="studio-panel">
            <div className="studio-panel-header flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-red-500">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Production Hub</span>
                </div>
                <div className="h-4 w-px bg-white/5" />
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
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
                  isContinuingScript={false}
                  isGeneratingMetadata={false}
                  isGeneratingImagePrompts={false}
                  onContinue={handleContinueScript}
                  onGenerateSeo={handleGenerateMetadata}
                  onGeneratePrompts={handleGenerateImagePrompts}
                  onListen={() => playVoiceover(generatedScript)}
                />
              </div>
            </div>

            <div className="bg-red-500/5 border-y border-white/5 p-3 flex items-center justify-between">
               <AmbientController currentLine={generatedScript?.split('\n')[activeLineIndex] || ''} />
               <div className="text-[10px] text-red-500/50 font-black uppercase tracking-[0.3em] italic pr-4">
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
                    onExportSides={() => {}}
                    onExportNotes={() => {}}
                    onGenerateBreakdown={handleGenerateBreakdown}
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
                        }
                      }
                    }}
                  />

                  {sceneBreakdown && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300 mb-3">Auto Scene Breakdown</p>
                      <div className="prose prose-invert prose-emerald max-w-none text-xs">
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
                      <ScriptAnalytics 
                        charStats={charStats}
                        sentimentMap={sentimentMap}
                        totalLines={generatedScript?.split('\n').length || 1}
                        characterVoices={characterVoices}
                        onAssignVoice={(c, v) => setCharacterVoices(prev => ({ ...prev, [c]: v }))}
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
