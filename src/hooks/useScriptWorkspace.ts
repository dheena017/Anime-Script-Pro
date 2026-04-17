import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { useGenerator } from '@/contexts/GeneratorContext';
import { useNavigate } from 'react-router-dom';
import { 
  continueAnimeScript, 
  formatScriptToStandard, 
  generateSceneBreakdown, 
  generateLoreProfile,
  generateMetadata,
  generateImagePrompts,
  rewriteScriptSelection,
  analyzePacing,
  generateDialogueVariations,
  translateScript
} from '@/services/geminiService';
import { 
  detectBeats, 
  extractLoreCandidates,
  calculateDuration,
  Beat,
  getHighlightKind,
} from '@/components/studio/modules/script/scriptWorkspaceUtils';

export function useScriptWorkspace() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorScrollRef = useRef<HTMLPreElement | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  
  const generator = useGenerator();
  const {
    generatedScript, setGeneratedScript,
    setGeneratedMetadata,
    setGeneratedImagePrompts,
    selectedModel,
    isLoading,
    isEditing, setIsEditing,
    isSaving, setIsSaving,
    setIsContinuingScript,
    currentScriptId, setCurrentScriptId,
    setIsGeneratingMetadata,
    setIsGeneratingImagePrompts,
    prompt, tone, audience, episode, session
  } = generator;

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
  
  const [charStats, setCharStats] = useState<Array<{name: string, count: number}>>([]);
  const [sentimentMap, setSentimentMap] = useState<string[]>([]);
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

  // Snapshot Persistence
  useEffect(() => {
    try {
      const raw = localStorage.getItem(snapshotStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSnapshots(Array.isArray(parsed) ? parsed : []);
      }
    } catch { setSnapshots([]); }
  }, [snapshotStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(snapshotStorageKey, JSON.stringify(snapshots));
    } catch {}
  }, [snapshots, snapshotStorageKey]);

  const syncScroll = useCallback(() => {
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
  }, []);

  const syncSelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    setSelectionRange({
      start: textarea.selectionStart ?? 0,
      end: textarea.selectionEnd ?? 0,
    });
  }, []);

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

  const handleContinueScript = async () => {
    if (!generatedScript) return;
    setIsContinuingScript(true);
    try {
      const nextScenes = await continueAnimeScript(generatedScript, selectedModel);
      setGeneratedScript(generatedScript + '\n' + nextScenes);
    } finally {
      setIsContinuingScript(false);
    }
  };

  const handleGenerateMetadata = async () => {
    if (!generatedScript) return;
    setIsGeneratingMetadata(true);
    navigate('/studio/seo');
    try {
      const metadata = await generateMetadata(generatedScript, selectedModel);
      setGeneratedMetadata(metadata);
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  const handleGenerateImagePrompts = async () => {
    if (!generatedScript) return;
    setIsGeneratingImagePrompts(true);
    navigate('/studio/prompts');
    try {
      const gPrompts = await generateImagePrompts(generatedScript, selectedModel);
      setGeneratedImagePrompts(gPrompts);
    } finally {
      setIsGeneratingImagePrompts(false);
    }
  };

  // Lore Profile Logic
  const fetchLoreProfile = useCallback(async (entityName: string) => {
    if (!generatedScript || loreProfiles[entityName] || loadingLore[entityName]) return;
    setLoadingLore((prev) => ({ ...prev, [entityName]: true }));
    try {
      const profile = await generateLoreProfile(entityName, generatedScript, selectedModel);
      setLoreProfiles((prev) => ({ ...prev, [entityName]: profile }));
    } finally {
      setLoadingLore((prev) => ({ ...prev, [entityName]: false }));
    }
  }, [generatedScript, loreProfiles, loadingLore, selectedModel]);

  useEffect(() => {
    if (!generatedScript || !isEditing) return;
    const timer = window.setTimeout(() => {
      loreCandidates.slice(0, 5).forEach((candidate) => {
        void fetchLoreProfile(candidate);
      });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [generatedScript, isEditing, loreCandidates, fetchLoreProfile]);

  // Analytics Update
  useEffect(() => {
    if (!generatedScript) return;
    const timer = window.setTimeout(() => {
      setCharStats(getCharacterStats(generatedScript));
      setSentimentMap(analyzeSentimentMap(generatedScript));
      setBeats(detectBeats(generatedScript));
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [generatedScript]);

  return {
    textareaRef, editorScrollRef, previewScrollRef,
    generatedScript, setGeneratedScript,
    selectedModel, isLoading, isEditing, setIsEditing,
    isSaving, setIsSaving, currentScriptId, snapshots, setSnapshots,
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
  };
}
