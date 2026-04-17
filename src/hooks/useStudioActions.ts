import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { useGenerator } from '@/contexts/GeneratorContext';
import { 
  generateAnimeScript, 
  generateCharacters, 
  generateSeriesPlan 
} from '@/services/geminiService';

export function useStudioActions() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const generator = useGenerator();

  const {
    prompt, tone, audience, selectedModel, session, episode,
    generatedScript, currentScriptId, setGeneratedScript,
    setGeneratedCharacters, setGeneratedSeriesPlan,
    setCurrentScriptId, setIsLoading, setIsGeneratingCharacters,
    setIsGeneratingSeries, setIsSaving
  } = generator;

  const handleSaveCurrent = useCallback(async () => {
    if (!generatedScript || !user) return;
    setIsSaving(true);
    try {
      if (currentScriptId) {
        await updateDoc(doc(db, 'scripts', currentScriptId), {
          script: generatedScript,
          episode,
          session,
          updatedAt: serverTimestamp()
        });
      } else {
        const docRef = await addDoc(collection(db, 'scripts'), {
          uid: user.uid,
          prompt: prompt || "Untitled Script",
          script: generatedScript,
          tone,
          audience,
          episode,
          session,
          model: selectedModel,
          createdAt: serverTimestamp()
        });
        setCurrentScriptId(docRef.id);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'scripts');
    } finally {
      setIsSaving(false);
    }
  }, [generatedScript, user, currentScriptId, episode, session, prompt, tone, audience, selectedModel, setIsSaving, setCurrentScriptId]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    navigate('/studio/script');
    try {
      const script = await generateAnimeScript(prompt, tone, audience, selectedModel, session, episode);
      setGeneratedScript(script);
      setCurrentScriptId(null);
      
      if (user) {
        const docRef = await addDoc(collection(db, 'scripts'), {
          uid: user.uid,
          prompt,
          script,
          tone,
          audience,
          episode,
          session,
          model: selectedModel,
          createdAt: serverTimestamp()
        });
        setCurrentScriptId(docRef.id);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'scripts');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, tone, audience, selectedModel, session, episode, user, navigate, setIsLoading, setGeneratedScript, setCurrentScriptId]);

  const handleGenerateCharacters = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsGeneratingCharacters(true);
    navigate('/studio/cast');
    try {
      const characters = await generateCharacters(prompt, selectedModel);
      setGeneratedCharacters(characters);
    } finally {
      setIsGeneratingCharacters(false);
    }
  }, [prompt, selectedModel, navigate, setIsGeneratingCharacters, setGeneratedCharacters]);

  const handleGenerateSeriesPlan = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsGeneratingSeries(true);
    navigate('/studio/series');
    try {
      const plan = await generateSeriesPlan(prompt, selectedModel);
      setGeneratedSeriesPlan(plan);
    } finally {
      setIsGeneratingSeries(false);
    }
  }, [prompt, selectedModel, navigate, setIsGeneratingSeries, setGeneratedSeriesPlan]);

  return {
    handleSaveCurrent,
    handleGenerate,
    handleGenerateCharacters,
    handleGenerateSeriesPlan
  };
}
