import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateScript, generateCharacters, generateSeriesPlan, generateWorld, generateNarrativeBeats } from '@/services/geminiService';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';

// Sub-components
import { ProductionCore } from './components/Layout/ProductionCore';
import { StudioNavigation } from './components/Layout/StudioNavigation';
import { SessionLogs } from './components/Layout/SessionLogs';

export function StudioLayout({ type }: { type?: string }) {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const {
    prompt, setPrompt,
    setGeneratedScript,
    setGeneratedCharacters,
    setGeneratedSeriesPlan,
    tone, setTone,
    audience, setAudience,
    episode, setEpisode,
    session, setSession,
    contentType, setContentType,
    selectedModel, setSelectedModel,
    isLoading, setIsLoading,
    isGeneratingCharacters, setIsGeneratingCharacters,
    isGeneratingSeries, setIsGeneratingSeries,
    generatedScript,
    isSaving, setIsSaving,
    setCurrentScriptId,
    currentScriptId,
    history,
    setGeneratedMetadata,
    narrativeBeats, setNarrativeBeats,
    recapperPersona, setRecapperPersona,
    characterRelationships, setCharacterRelationships,
    visualData, numScenes, setNumScenes,
    generatedWorld, setGeneratedWorld, generatedCharacters
  } = useGenerator();

  React.useEffect(() => {
    if (type) setContentType(type);
  }, [type, setContentType]);

  const basePath = type ? `/${type.toLowerCase()}` : '';

  const handleSaveCurrent = async () => {
    if (!generatedScript || !user) return;
    setIsSaving(true);
    try {
      let scriptIdToUse = currentScriptId;
      if (currentScriptId) {
        await updateDoc(doc(db, 'scripts', currentScriptId), {
          script: generatedScript, episode, session, contentType, visualData, updatedAt: serverTimestamp()
        });
      } else {
        const docRef = await addDoc(collection(db, 'scripts'), {
          uid: user.uid, prompt: prompt || "Untitled Script", script: generatedScript, tone, audience, episode, session, contentType, model: selectedModel, visualData, createdAt: serverTimestamp()
        });
        setCurrentScriptId(docRef.id);
        scriptIdToUse = docRef.id;
      }
      if (scriptIdToUse) {
        await addDoc(collection(db, 'script_versions'), { uid: user.uid, scriptId: scriptIdToUse, script: generatedScript, createdAt: serverTimestamp() });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'scripts');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMasterGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      // 1. Generate World Lore
      const worldPromise = generateWorld(prompt, selectedModel, contentType);
      // 2. Generate Cast Profiles
      const castPromise = generateCharacters(prompt, selectedModel, contentType);
      // 3. Generate Narrative Beats
      const beatsPromise = generateNarrativeBeats(prompt, selectedModel, contentType);
      // 4. Generate Series Plan
      const seriesPromise = generateSeriesPlan(prompt, selectedModel, contentType);

      const [world, cast, beats, series] = await Promise.all([
        worldPromise, castPromise, beatsPromise, seriesPromise
      ]);

      if (world) setGeneratedWorld(world);
      if (cast) setGeneratedCharacters(cast);
      if (beats && Array.isArray(beats)) {
        const formattedBeats = beats.map((b: any, i: number) => `${i + 1}. ${b.label} (${b.duration}): ${b.description}`).join('\n');
        setNarrativeBeats(formattedBeats);
      }
      if (series && Array.isArray(series)) {
        const formattedSeries = series.map((s: any) => `${s.episode}: ${s.title}\n${s.hook}`).join('\n\n');
        setGeneratedSeriesPlan(formattedSeries);
      }

      // Success feedback or redirect
      navigate(`${basePath}/script`);
    } catch (error) {
       console.error("Master Generation Failed:", error);
    } finally {
       setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    navigate(`${basePath}/script`);
    const script = await generateScript(prompt, tone, audience, session, episode, numScenes, selectedModel, contentType, recapperPersona, narrativeBeats, characterRelationships, generatedWorld, generatedCharacters);
    setGeneratedScript(script);
    setCurrentScriptId(null);
    setIsLoading(false);
    if (user) {
      try {
        const docRef = await addDoc(collection(db, 'scripts'), {
          uid: user.uid, prompt, script, tone, audience, episode, session, contentType, model: selectedModel, recapperPersona, narrativeBeats, characterRelationships, generatedWorld, generatedCharacters, createdAt: serverTimestamp()
        });
        setCurrentScriptId(docRef.id);
        await addDoc(collection(db, 'script_versions'), { uid: user.uid, scriptId: docRef.id, script, createdAt: serverTimestamp() });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'scripts');
      }
    }
  };

  // Existing effect for initial mount and contentType
  React.useEffect(() => {
    if (type) setContentType(type);
  }, [type, setContentType]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <ProductionCore 
          prompt={prompt} setPrompt={setPrompt}
          tone={tone} setTone={setTone}
          audience={audience} setAudience={setAudience}
          session={session} setSession={setSession}
          episode={episode} setEpisode={setEpisode}
          numScenes={numScenes} setNumScenes={setNumScenes}
          selectedModel={selectedModel} setSelectedModel={setSelectedModel}
          recapperPersona={recapperPersona} setRecapperPersona={setRecapperPersona}
          narrativeBeats={narrativeBeats} setNarrativeBeats={setNarrativeBeats}
          characterRelationships={characterRelationships} setCharacterRelationships={setCharacterRelationships}
          worldBuilding={generatedWorld || ''}
          setWorldBuilding={setGeneratedWorld}
          castProfiles={generatedCharacters || ''}
          setCastProfiles={setGeneratedCharacters}
          handleGenerate={handleGenerate}
          handleMasterGenerate={handleMasterGenerate}
          handleSaveCurrent={handleSaveCurrent}
          isLoading={isLoading}
          isSaving={isSaving}
          generatedScript={generatedScript}
          currentScriptId={currentScriptId}
          user={user}
          basePath={basePath}
          navigate={navigate}
        />
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto max-h-[90vh] pr-2">
        <StudioNavigation basePath={basePath} />
        <div className="flex-1 min-h-[800px] bg-gradient-to-br from-[#111318] to-[#0a0b0e] border border-zinc-800 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl overflow-auto relative">
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          <div className="relative z-10 w-full h-full p-2">
            <Outlet />
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-12 mt-4">
        <SessionLogs 
          history={history}
          setPrompt={setPrompt}
          setTone={setTone}
          setAudience={setAudience}
          setEpisode={setEpisode}
          setSession={setSession}
          setContentType={setContentType}
          setSelectedModel={setSelectedModel}
          setGeneratedMetadata={setGeneratedMetadata}
        />
      </div>
    </div>
  );
}
