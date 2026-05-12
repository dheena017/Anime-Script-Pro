import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect } from 'react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-utils';
import { engineApi } from '@/services/api/engine';
import { worldApi } from '@/services/api/world';
import { productionApi } from '@/services/api/production';
import { characterApi } from '@/services/api/characters';
import { projectService } from '@/services/api/projects';
import { AI_EVENTS } from '@/services/generators/core';

interface GeneratorQueriesParams {
  userId?: string;
  currentScriptId: string | null;
  episode: string;
}

interface ProjectHistoryItem {
  id: number;
  title: string;
  date: string;
  createdAt: string;
  prompt: string;
  vibe: string;
  contentType: string;
  modelUsed: string;
}

interface GeneratorQueriesResult {
  worldLore: any;
  production: any;
  castDataFromApi: any;
  projectHistory: ProjectHistoryItem[];
}

export function useResolveProjectId(currentScriptId: string | null) {
  return useCallback((overrideProjectId?: number) => {
    if (typeof overrideProjectId === 'number' && Number.isFinite(overrideProjectId)) {
      return overrideProjectId;
    }

    if (!currentScriptId) {
      return undefined;
    }

    const parsedProjectId = Number.parseInt(currentScriptId, 10);
    return Number.isFinite(parsedProjectId) ? parsedProjectId : undefined;
  }, [currentScriptId]);
}

export function useGeneratorQueries({ userId, currentScriptId, episode }: GeneratorQueriesParams): GeneratorQueriesResult {
  useQuery({
    queryKey: ['engineConfig', userId],
    queryFn: () => engineApi.getConfig(userId!),
    enabled: !!userId,
  });

  const { data: worldLore } = useQuery({
    queryKey: ['worldLore', userId, currentScriptId],
    queryFn: () => worldApi.getLore(userId!, currentScriptId ? parseInt(currentScriptId, 10) : undefined),
    enabled: !!userId && !!currentScriptId,
  });

  const { data: production } = useQuery({
    queryKey: ['productionContent', userId, currentScriptId, episode],
    queryFn: () => productionApi.getContent(userId!, currentScriptId ? parseInt(currentScriptId, 10) : undefined, episode),
    enabled: !!userId && !!currentScriptId,
  });

  const { data: castDataFromApi } = useQuery({
    queryKey: ['characterCast', userId, currentScriptId],
    queryFn: () => characterApi.getCast(userId!, currentScriptId ? parseInt(currentScriptId, 10) : undefined),
    enabled: !!userId && !!currentScriptId,
  });

  const { data: projectHistory = [] } = useQuery({
    queryKey: ['projectHistory', userId],
    queryFn: async () => {
      const projects = await apiRequest<any[]>(`/api/projects?user_id=${userId!}`, { label: 'Project History' });
      return (projects || []).map(p => ({
        id: p.id,
        title: p.name || 'Untitled',
        date: new Date(p.created_at).toLocaleDateString(),
        createdAt: p.created_at,
        prompt: p.prompt,
        vibe: p.vibe,
        contentType: p.content_type,
        modelUsed: p.model_used
      }));
    },
    enabled: !!userId,
  });

  return {
    worldLore,
    production,
    castDataFromApi,
    projectHistory,
  };
}

interface GeneratorSyncEffectsParams {
  userId?: string;
  currentScriptId: string | null;
  episode: string;
  production: any;
  worldLore: any;
  castDataFromApi: any;
  generatedScript: string | null;
  generatedWorld: string | null;
  castListLength: number;
  isGeneratingSeries: boolean;
  isGeneratingCharacters: boolean;
  isGeneratingWorld: boolean;
  isGeneratingLore: boolean;
  isGeneratingPowers: boolean;
  isGeneratingFactions: boolean;
  isGeneratingArchitecture: boolean;
  isGeneratingAtlas: boolean;
  isGeneratingCulture: boolean;
  isGeneratingSystems: boolean;
  hasLoadedProduction: MutableRefObject<boolean>;
  hasLoadedWorld: MutableRefObject<boolean>;
  hasLoadedCast: MutableRefObject<boolean>;
  setGeneratedScript: Dispatch<SetStateAction<string | null>>;
  setGeneratedSeriesPlan: Dispatch<SetStateAction<any[] | null>>;
  setGeneratedMetadata: Dispatch<SetStateAction<string | null>>;
  setGeneratedGrowthStrategy: Dispatch<SetStateAction<string | null>>;
  setGeneratedDistributionPlan: Dispatch<SetStateAction<string | null>>;
  setGeneratedWorldInternal: Dispatch<SetStateAction<string | null>>;
  setGeneratedWorldLore: Dispatch<SetStateAction<string | null>>;
  setGeneratedWorldPowers: Dispatch<SetStateAction<string | null>>;
  setGeneratedWorldFactions: Dispatch<SetStateAction<string | null>>;
  setGeneratedWorldArchitecture: Dispatch<SetStateAction<string | null>>;
  setGeneratedWorldAtlas: Dispatch<SetStateAction<string | null>>;
  setGeneratedWorldCulture: Dispatch<SetStateAction<string | null>>;
  setGeneratedWorldSystems: Dispatch<SetStateAction<string | null>>;
  setGeneratedWorldContent: Dispatch<SetStateAction<any>>;
  setCastList: Dispatch<SetStateAction<any[]>>;
  setCastProfiles: Dispatch<SetStateAction<any>>;
  setCharacterRelationships: Dispatch<SetStateAction<string | null>>;
  setCastDNA: Dispatch<SetStateAction<any>>;
  setCastDynamics: Dispatch<SetStateAction<any>>;
  setCastIntegrity: Dispatch<SetStateAction<any>>;
  setGeneratedImagePrompts: Dispatch<SetStateAction<string | null>>;
  setGeneratedDescription: Dispatch<SetStateAction<string | null>>;
  setGeneratedAltText: Dispatch<SetStateAction<string | null>>;
  setVisualData: Dispatch<SetStateAction<any>>;
  setVideoData: Dispatch<SetStateAction<any>>;
  setProductionSequence: Dispatch<SetStateAction<any[]>>;
  setGenerationProgress: Dispatch<SetStateAction<number>>;
  setPromptLore: Dispatch<SetStateAction<string>>;
  setPromptPowers: Dispatch<SetStateAction<string>>;
  setPromptFactions: Dispatch<SetStateAction<string>>;
  setPromptArchitecture: Dispatch<SetStateAction<string>>;
  setPromptAtlas: Dispatch<SetStateAction<string>>;
  setPromptCulture: Dispatch<SetStateAction<string>>;
  setPromptSystems: Dispatch<SetStateAction<string>>;
  setNumCharacters: Dispatch<SetStateAction<number>>;
}

export function useGeneratorSyncEffects(params: GeneratorSyncEffectsParams) {
  const {
    userId,
    currentScriptId,
    episode,
    production,
    worldLore,
    castDataFromApi,
    generatedScript,
    generatedWorld,
    castListLength,
    isGeneratingSeries,
    isGeneratingCharacters,
    isGeneratingWorld,
    isGeneratingLore,
    isGeneratingPowers,
    isGeneratingFactions,
    isGeneratingArchitecture,
    isGeneratingAtlas,
    isGeneratingCulture,
    isGeneratingSystems,
    hasLoadedProduction,
    hasLoadedWorld,
    hasLoadedCast,
    setGeneratedScript,
    setGeneratedSeriesPlan,
    setGeneratedMetadata,
    setGeneratedGrowthStrategy,
    setGeneratedDistributionPlan,
    setGeneratedWorldInternal,
    setGeneratedWorldLore,
    setGeneratedWorldPowers,
    setGeneratedWorldFactions,
    setGeneratedWorldArchitecture,
    setGeneratedWorldAtlas,
    setGeneratedWorldCulture,
    setGeneratedWorldSystems,
    setGeneratedWorldContent,
    setCastList,
    setCastProfiles,
    setCharacterRelationships,
    setCastDNA,
    setCastDynamics,
    setCastIntegrity,
    setGeneratedImagePrompts,
    setGeneratedDescription,
    setGeneratedAltText,
    setVisualData,
    setVideoData,
    setProductionSequence,
    setGenerationProgress,
    setPromptLore,
    setPromptPowers,
    setPromptFactions,
    setPromptArchitecture,
    setPromptAtlas,
    setPromptCulture,
    setPromptSystems,
    setNumCharacters,
  } = params;

  useEffect(() => {
    hasLoadedProduction.current = false;
    hasLoadedWorld.current = false;
    hasLoadedCast.current = false;
  }, [userId, hasLoadedProduction, hasLoadedWorld, hasLoadedCast]);

  useEffect(() => {
    hasLoadedProduction.current = false;
    hasLoadedWorld.current = false;
    hasLoadedCast.current = false;

    setGeneratedScript(null);
    setGeneratedSeriesPlan(null);
    setGeneratedMetadata(null);
    setGeneratedGrowthStrategy(null);
    setGeneratedDistributionPlan(null);
    setGeneratedWorldInternal(null);
    setGeneratedWorldLore(null);
    setGeneratedWorldPowers(null);
    setGeneratedWorldFactions(null);
    setGeneratedWorldArchitecture(null);
    setGeneratedWorldAtlas(null);
    setGeneratedWorldCulture(null);
    setGeneratedWorldSystems(null);
    setGeneratedWorldContent(null);
    setCastList([]);
    setCastProfiles(null);
    setCharacterRelationships('');
    setCastDNA(null);
    setCastDynamics(null);
    setCastIntegrity(null);
    setGeneratedImagePrompts(null);
    setGeneratedDescription(null);
    setGeneratedAltText(null);
    setVisualData([]);
    setVideoData([]);
    setProductionSequence([]);
    setGenerationProgress(0);
  }, [
    currentScriptId,
    episode,
    hasLoadedProduction,
    hasLoadedWorld,
    hasLoadedCast,
    setGeneratedScript,
    setGeneratedSeriesPlan,
    setGeneratedMetadata,
    setGeneratedGrowthStrategy,
    setGeneratedDistributionPlan,
    setGeneratedWorldInternal,
    setGeneratedWorldLore,
    setGeneratedWorldPowers,
    setGeneratedWorldFactions,
    setGeneratedWorldArchitecture,
    setGeneratedWorldAtlas,
    setGeneratedWorldCulture,
    setGeneratedWorldSystems,
    setGeneratedWorldContent,
    setCastList,
    setCastProfiles,
    setCharacterRelationships,
    setCastDNA,
    setCastDynamics,
    setCastIntegrity,
    setGeneratedImagePrompts,
    setGeneratedDescription,
    setGeneratedAltText,
    setVisualData,
    setVideoData,
    setProductionSequence,
    setGenerationProgress,
  ]);

  useEffect(() => {
    const canSync = !hasLoadedProduction.current || (!generatedScript && !isGeneratingSeries);

    if (production && canSync) {
      setGeneratedScript(production.script_content || null);
      setGeneratedSeriesPlan(production.series_plan || null);
      setGeneratedMetadata(production.seo_metadata || null);
      setGeneratedGrowthStrategy(production.growth_strategy || null);
      setGeneratedDistributionPlan(production.distribution_plan || null);
      setGeneratedImagePrompts(production.storyboard_prompts || null);
      setGeneratedDescription(production.youtube_description || null);
      setGeneratedAltText(production.alt_text_blob || null);
      hasLoadedProduction.current = true;
    }
  }, [
    production,
    generatedScript,
    isGeneratingSeries,
    currentScriptId,
    hasLoadedProduction,
    setGeneratedScript,
    setGeneratedSeriesPlan,
    setGeneratedMetadata,
    setGeneratedGrowthStrategy,
    setGeneratedDistributionPlan,
    setGeneratedImagePrompts,
    setGeneratedDescription,
    setGeneratedAltText,
  ]);

  useEffect(() => {
    const isGeneratingAnyWorld = isGeneratingWorld || isGeneratingLore || isGeneratingPowers || isGeneratingFactions || isGeneratingArchitecture || isGeneratingAtlas || isGeneratingCulture || isGeneratingSystems;
    const canSync = !hasLoadedWorld.current || (!generatedWorld && !isGeneratingAnyWorld);

    if (worldLore && canSync) {
      setGeneratedWorldInternal(worldLore.manifest_blob || null);
      setGeneratedWorldLore(worldLore.history_blob || null);
      setGeneratedWorldPowers(worldLore.powers_blob || null);
      setGeneratedWorldFactions(worldLore.factions_blob || null);
      setGeneratedWorldArchitecture(worldLore.architecture_blob || null);
      setGeneratedWorldAtlas(worldLore.atlas_blob || null);
      setGeneratedWorldCulture(worldLore.culture_blob || null);
      setGeneratedWorldSystems(worldLore.systems_blob || null);

      setPromptLore(worldLore.prompt_history || '');
      setPromptPowers(worldLore.prompt_powers || '');
      setPromptFactions(worldLore.prompt_factions || '');
      setPromptArchitecture(worldLore.prompt_architecture || '');
      setPromptAtlas(worldLore.prompt_atlas || '');
      setPromptCulture(worldLore.prompt_culture || '');
      setPromptSystems(worldLore.prompt_systems || '');

      setGeneratedWorldContent(worldLore);
      hasLoadedWorld.current = true;
    }
  }, [
    worldLore,
    generatedWorld,
    isGeneratingWorld,
    isGeneratingLore,
    isGeneratingPowers,
    isGeneratingFactions,
    isGeneratingArchitecture,
    isGeneratingAtlas,
    isGeneratingCulture,
    isGeneratingSystems,
    currentScriptId,
    hasLoadedWorld,
    setGeneratedWorldInternal,
    setGeneratedWorldLore,
    setGeneratedWorldPowers,
    setGeneratedWorldFactions,
    setGeneratedWorldArchitecture,
    setGeneratedWorldAtlas,
    setGeneratedWorldCulture,
    setGeneratedWorldSystems,
    setPromptLore,
    setPromptPowers,
    setPromptFactions,
    setPromptArchitecture,
    setPromptAtlas,
    setPromptCulture,
    setPromptSystems,
    setGeneratedWorldContent,
  ]);

  useEffect(() => {
    const canSync = !hasLoadedCast.current || (castListLength === 0 && !isGeneratingCharacters);

    if (castDataFromApi && canSync) {
      if (castDataFromApi.cast_list_blob || castDataFromApi.num_characters) {
        try {
          if (castDataFromApi.num_characters) {
            setNumCharacters(castDataFromApi.num_characters);
          }
          setCastList(castDataFromApi.cast_list_blob ? JSON.parse(castDataFromApi.cast_list_blob) : []);
        } catch (e) {
          console.error('Failed to parse cast list from API', e);
        }
      }
      setCharacterRelationships(castDataFromApi.relationships_blob || '');
      hasLoadedCast.current = true;
    }
  }, [
    castDataFromApi,
    castListLength,
    isGeneratingCharacters,
    currentScriptId,
    hasLoadedCast,
    setNumCharacters,
    setCastList,
    setCharacterRelationships,
  ]);
}

interface GeneratorSaveCoreParams {
  userId?: string;
  resolveProjectId: (overrideProjectId?: number) => number | undefined;
  setIsSaving: Dispatch<SetStateAction<boolean>>;
  addLog: (module: string, status: string, message?: string) => void;
  showNotification: (message: string, type?: 'error' | 'success' | 'info') => void;
  prompt: string;
  contentType: string;
  selectedModel: string;
  genre: string;
  artStyle: string;
  tone: string;
  generatedScript: string | null;
  generatedSeriesPlan: any[] | null;
  generatedMetadata: string | null;
  generatedImagePrompts: string | null;
  generatedGrowthStrategy: string | null;
  generatedDistributionPlan: string | null;
  generatedDescription: string | null;
  generatedAltText: string | null;
  generatedWorldContent: any;
  generatedWorld: string | null;
  generatedWorldLore: string | null;
  generatedWorldPowers: string | null;
  generatedWorldFactions: string | null;
  generatedWorldArchitecture: string | null;
  generatedWorldAtlas: string | null;
  generatedWorldCulture: string | null;
  generatedWorldSystems: string | null;
  promptLore: string;
  promptPowers: string;
  promptFactions: string;
  promptArchitecture: string;
  promptAtlas: string;
  promptCulture: string;
  promptSystems: string;
  castList: any[];
  characterRelationships: string | null;
  castDNA: any;
  castDynamics: any;
  castIntegrity: any;
  setCurrentScriptId: Dispatch<SetStateAction<string | null>>;
  queryClient: QueryClient;
}

export function useGeneratorSaveCore(params: GeneratorSaveCoreParams) {
  const {
    userId,
    resolveProjectId,
    setIsSaving,
    addLog,
    showNotification,
    prompt,
    contentType,
    selectedModel,
    genre,
    artStyle,
    tone,
    generatedScript,
    generatedSeriesPlan,
    generatedMetadata,
    generatedImagePrompts,
    generatedGrowthStrategy,
    generatedDistributionPlan,
    generatedDescription,
    generatedAltText,
    generatedWorldContent,
    generatedWorld,
    generatedWorldLore,
    generatedWorldPowers,
    generatedWorldFactions,
    generatedWorldArchitecture,
    generatedWorldAtlas,
    generatedWorldCulture,
    generatedWorldSystems,
    promptLore,
    promptPowers,
    promptFactions,
    promptArchitecture,
    promptAtlas,
    promptCulture,
    promptSystems,
    castList,
    characterRelationships,
    castDNA,
    castDynamics,
    castIntegrity,
    setCurrentScriptId,
    queryClient,
  } = params;

  return useCallback(async (projectId?: number, projectName?: string): Promise<number | undefined> => {
    if (!userId) {
      showNotification('Please log in to save your work', 'error');
      console.warn('[GeneratorContext] Save skipped: user is not logged in.');
      return undefined;
    }

    let resolvedProjectId = resolveProjectId(projectId);

    setIsSaving(true);
    addLog('SAVE', 'START', 'Starting project save...');
    console.info('[GeneratorContext] Project save started.', { projectId: resolvedProjectId });
    showNotification('Saving your project...', 'info');

    try {
      if (!resolvedProjectId) {
        addLog('PROJECT', 'CREATING', 'Creating new production record...');
        const title = projectName || prompt || 'Untitled Anime Project';
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            title: title,
            name: title,
            content_type: contentType || 'Anime',
            prompt: prompt,
            model_used: selectedModel,
          }),
        });

        if (res.ok) {
          const newProject = await res.json();
          resolvedProjectId = newProject.id;
          if (resolvedProjectId) {
            setCurrentScriptId(resolvedProjectId.toString());
          }
          addLog('PROJECT', 'CREATED', `New production initialized: ID ${resolvedProjectId}`);
        } else {
          const errBody = await res.text();
          console.error('[GeneratorContext] Project creation failed:', errBody);
          throw new Error(`Failed to initialize project record: ${errBody}`);
        }
      }

      addLog('PRODUCTION', 'SAVING', 'Saving script, series, and storyboard data...');
      console.info('[GeneratorContext] Saving production content.', { projectId: resolvedProjectId });
      await productionApi.updateContent(userId, {
        script_content: generatedScript,
        series_plan: generatedSeriesPlan,
        seo_metadata: generatedMetadata,
        storyboard: generatedImagePrompts,
        growth_strategy: generatedGrowthStrategy,
        distribution_plan: generatedDistributionPlan,
        youtube_description: generatedDescription,
        alt_texts: generatedAltText,
      }, resolvedProjectId);

      if (resolvedProjectId) {
        await projectService.updateProject(resolvedProjectId, {
          prompt: prompt,
          model_used: selectedModel,
          content_type: contentType,
          genre: genre,
          art_style: artStyle,
          tone: tone,
          description: prompt,
          status: 'IN_PROGRESS',
        });
      }

      if (generatedWorldContent || generatedWorld) {
        console.info('[GeneratorContext] Saving modular world content.', { projectId: resolvedProjectId });
        if (generatedWorld) {
          await worldApi.manifest.update(userId, generatedWorld, promptLore, resolvedProjectId);
        }
        if (generatedWorldLore) {
          await worldApi.history.update(userId, generatedWorldLore, promptLore, resolvedProjectId);
        }
        if (generatedWorldPowers) {
          await worldApi.powers.update(userId, generatedWorldPowers, promptPowers, resolvedProjectId);
        }
        if (generatedWorldFactions) {
          await worldApi.factions.update(userId, generatedWorldFactions, promptFactions, resolvedProjectId);
        }
        if (generatedWorldArchitecture) {
          await worldApi.architecture.update(userId, generatedWorldArchitecture, promptArchitecture, resolvedProjectId);
        }
        if (generatedWorldAtlas) {
          await worldApi.atlas.update(userId, generatedWorldAtlas, promptAtlas, resolvedProjectId);
        }
        if (generatedWorldCulture) {
          await worldApi.culture.update(userId, generatedWorldCulture, promptCulture, resolvedProjectId);
        }
        if (generatedWorldSystems) {
          await worldApi.systems.update(userId, generatedWorldSystems, promptSystems, resolvedProjectId);
        }
      }

      addLog('CAST', 'SAVING', 'Saving characters and relationships...');
      console.info('[GeneratorContext] Saving cast content.', { projectId: resolvedProjectId });
      await characterApi.updateCast(userId, {
        cast_list_blob: castList ? JSON.stringify(castList) : null,
        relationships_blob: characterRelationships,
        dna_config_blob: castDNA ? JSON.stringify(castDNA) : null,
        dynamics_blob: castDynamics ? JSON.stringify(castDynamics) : null,
        integrity_blob: castIntegrity ? JSON.stringify(castIntegrity) : null,
        prompt_cast: prompt,
      }, resolvedProjectId);

      addLog('PRODUCTION', 'SUCCESS', 'All project data saved successfully.');
      console.info('[GeneratorContext] Project save completed successfully.', { projectId: resolvedProjectId });
      showNotification('Project saved successfully', 'success');
      addLog('PROJECT', 'COMPLETE', 'Project fully saved to cloud.');

      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['productionContent', userId, resolvedProjectId?.toString()] });
      queryClient.invalidateQueries({ queryKey: ['worldLore', userId, resolvedProjectId?.toString()] });
      queryClient.invalidateQueries({ queryKey: ['characterCast', userId, resolvedProjectId?.toString()] });

      return resolvedProjectId;
    } catch (error: any) {
      console.error('[GeneratorContext] Save failed.', error);
      showNotification('Failed to save - please try again', 'error');
      addLog('PROJECT', 'ERROR', `Save failed: ${error.message || 'Network error'}`);
      return undefined;
    } finally {
      setIsSaving(false);
    }
  }, [
    userId,
    resolveProjectId,
    setIsSaving,
    addLog,
    showNotification,
    prompt,
    contentType,
    selectedModel,
    genre,
    artStyle,
    tone,
    generatedScript,
    generatedSeriesPlan,
    generatedMetadata,
    generatedImagePrompts,
    generatedGrowthStrategy,
    generatedDistributionPlan,
    generatedDescription,
    generatedAltText,
    generatedWorldContent,
    generatedWorld,
    generatedWorldLore,
    generatedWorldPowers,
    generatedWorldFactions,
    generatedWorldArchitecture,
    generatedWorldAtlas,
    generatedWorldCulture,
    generatedWorldSystems,
    promptLore,
    promptPowers,
    promptFactions,
    promptArchitecture,
    promptAtlas,
    promptCulture,
    promptSystems,
    castList,
    characterRelationships,
    castDNA,
    castDynamics,
    castIntegrity,
    setCurrentScriptId,
    queryClient,
  ]);
}

interface GeneratorTelemetryParams {
  userId?: string;
  addLog: (module: string, status: string, message?: string) => void;
  setActiveModelAttempt: Dispatch<SetStateAction<string | null>>;
  setFallbackHistory: Dispatch<SetStateAction<string[]>>;
}

export function useGeneratorTelemetryEffects({ userId, addLog, setActiveModelAttempt, setFallbackHistory }: GeneratorTelemetryParams) {
  useEffect(() => {
    const handleTelemetry = async (e: any) => {
      try {
        await engineApi.recordTelemetry({
          model: e.detail.model,
          latency_ms: e.detail.latency,
          status: e.detail.error ? 'ERROR' : 'SUCCESS',
          endpoint: 'studio_general',
          request_summary: e.detail.text?.substring(0, 100),
          error_message: e.detail.error,
          metadata: { fallbacks: e.detail.fallbacks },
        }, userId);
      } catch (err) {
        console.warn('%c[System] %cFailed to record remote telemetry:', 'color: #f59e0b; font-weight: bold', 'color: #94a3b8', err);
      }
    };

    const handleStart = (e: any) => {
      addLog('AI_ENGINE', 'STARTED', `Starting generation with ${e.detail.model}...`);
      setActiveModelAttempt(e.detail.model);
      setFallbackHistory([]);
    };

    const handleComplete = (e: any) => {
      addLog('AI_ENGINE', 'COMPLETED', `Generation complete via ${e.detail.model} (${e.detail.latency.toFixed(0)}ms)`);
      setActiveModelAttempt(null);
    };

    const handleFallback = (e: any) => {
      addLog('AI_ENGINE', 'RETRYING', `Retrying with ${e.detail.nextModel} (${e.detail.failedModel} was unavailable)`);
      setActiveModelAttempt(e.detail.nextModel);
      setFallbackHistory(prev => [...prev, e.detail.failedModel]);
    };

    AI_EVENTS.addEventListener('ai_generation_complete', handleTelemetry);
    AI_EVENTS.addEventListener('ai_generation_start', handleStart as EventListener);
    AI_EVENTS.addEventListener('ai_generation_complete', handleComplete as EventListener);
    AI_EVENTS.addEventListener('ai_fallback', handleFallback as EventListener);

    return () => {
      AI_EVENTS.removeEventListener('ai_generation_complete', handleTelemetry);
      AI_EVENTS.removeEventListener('ai_generation_start', handleStart as EventListener);
      AI_EVENTS.removeEventListener('ai_generation_complete', handleComplete as EventListener);
      AI_EVENTS.removeEventListener('ai_fallback', handleFallback as EventListener);
    };
  }, [userId, addLog, setActiveModelAttempt, setFallbackHistory]);
}

interface GeneratorProgressParams {
  isGeneratingCharacters: boolean;
  isGeneratingImagePrompts: boolean;
  isGeneratingSeries: boolean;
  isGeneratingDescription: boolean;
  isGeneratingWorld: boolean;
  isGeneratingVisuals: boolean;
  isGeneratingMetadata: boolean;
  isGeneratingDistribution: boolean;
  isGeneratingGrowthStrategy: boolean;
  isGeneratingAltText: boolean;
  setGenerationProgress: Dispatch<SetStateAction<number>>;
}

export function useGeneratorProgressEffect({
  isGeneratingCharacters,
  isGeneratingImagePrompts,
  isGeneratingSeries,
  isGeneratingDescription,
  isGeneratingWorld,
  isGeneratingVisuals,
  isGeneratingMetadata,
  isGeneratingDistribution,
  isGeneratingGrowthStrategy,
  isGeneratingAltText,
  setGenerationProgress,
}: GeneratorProgressParams) {
  useEffect(() => {
    const isAnyGenerating =
      isGeneratingCharacters ||
      isGeneratingImagePrompts ||
      isGeneratingSeries ||
      isGeneratingDescription ||
      isGeneratingWorld ||
      isGeneratingVisuals ||
      isGeneratingMetadata ||
      isGeneratingDistribution ||
      isGeneratingGrowthStrategy ||
      isGeneratingAltText;

    let interval: ReturnType<typeof setInterval> | null = null;

    if (isAnyGenerating) {
      setGenerationProgress(p => (p > 0 ? p : 3));
      interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 95) {
            return prev;
          }
          const inc = Math.random() * 6 + 1;
          return Math.min(95, Math.round((prev + inc) * 10) / 10);
        });
      }, 700);
    } else {
      setGenerationProgress(prev => (prev > 0 && prev < 100 ? 100 : prev));
      const timeout = setTimeout(() => setGenerationProgress(0), 800);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [
    isGeneratingCharacters,
    isGeneratingImagePrompts,
    isGeneratingSeries,
    isGeneratingDescription,
    isGeneratingWorld,
    isGeneratingVisuals,
    isGeneratingMetadata,
    isGeneratingDistribution,
    isGeneratingGrowthStrategy,
    isGeneratingAltText,
    setGenerationProgress,
  ]);
}
