import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-utils';
import { ProductionUnit } from '@/lib/sequence-utils';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { engineApi } from '../services/api/engine';
import { worldApi, WorldLore } from '../services/api/world';
import { productionApi } from '../services/api/production';
import { AI_EVENTS } from '../services/generators/core';
import { useLogs } from './LogContext';

interface GeneratorState {
  storyboardPrompts: any;
  prompt: string;
  promptLore: string;
  promptPowers: string;
  promptFactions: string;
  promptArchitecture: string;
  promptAtlas: string;
  promptCulture: string;
  promptSystems: string;
  theme: string;
  generatedScript: string | null;
  generatedCharacters: string | null;
  generatedMetadata: string | null;
  generatedImagePrompts: string | null;
  generatedSeriesPlan: any[] | null;
  generatedDescription: string | null;
  generatedWorld: string | null;
  generatedWorldContent: WorldLore | null;
  generatedWorldLore: string | null;
  generatedWorldPowers: string | null;
  generatedWorldFactions: string | null;
  generatedWorldArchitecture: string | null;
  generatedWorldAtlas: string | null;
  generatedWorldCulture: string | null;
  generatedWorldSystems: string | null;
  isGeneratingLore: boolean;
  isGeneratingPowers: boolean;
  isGeneratingFactions: boolean;
  isGeneratingArchitecture: boolean;
  isGeneratingAtlas: boolean;
  isGeneratingCulture: boolean;
  isGeneratingSystems: boolean;
  worldGenerationStatus: 'idle' | 'loading' | 'success' | 'error';
  worldGenerationError: string | null;
  worldGenerationLatency: number;
  generatedAltText: string | null;
  recapperPersona: string;
  episode: string;
  session: string;
  numScenes: string;
  contentType: string;
  isLoading: boolean;
  isGeneratingCharacters: boolean;
  isGeneratingMetadata: boolean;
  isGeneratingImagePrompts: boolean;
  isGeneratingSeries: boolean;
  isGeneratingDescription: boolean;
  isGeneratingWorld: boolean;
  isEditing: boolean;
  isSaving: boolean;
  isContinuingScript: boolean;
  isGeneratingVisuals: boolean;
  isGeneratingAltText: boolean;
  currentScriptId: string | null;
  history: any[];
  productionSequence: ProductionUnit[];
  isLiked: boolean;
  generatedGrowthStrategy: string | null;
  isGeneratingGrowthStrategy: boolean;
  generatedDistributionPlan: string | null;
  isGeneratingDistribution: boolean;
  // Engine / Model settings (migrated but kept for compatibility)
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  selectedModel: string;
  tone: string;
  audience: string;

  // Cast / World compatibility
  castData?: any | null;
  castList?: any[];
  castProfiles?: any | null;
  characterRelationships?: string | null;

  // Visual / storyboard compatibility
  visualData?: any[];
  videoData?: any[];

  // SEO / series compatibility
  seoMetadata?: any | null;
  seriesPlan?: any[] | null;
  worldLore?: any | null;
  activeModelAttempt: string | null;
  fallbackHistory: string[];
}

interface GeneratorDispatch {
  setPrompt: (p: string) => void;
  setPromptLore: (p: string) => void;
  setPromptPowers: (p: string) => void;
  setPromptFactions: (p: string) => void;
  setPromptArchitecture: (p: string) => void;
  setPromptAtlas: (p: string) => void;
  setPromptCulture: (p: string) => void;
  setPromptSystems: (p: string) => void;
  setTheme: (t: string) => void;
  setGeneratedScript: (s: string | null) => void;
  setGeneratedCharacters: (c: string | null) => void;
  setGeneratedMetadata: (m: string | null) => void;
  setGeneratedImagePrompts: (p: string | null) => void;
  setGeneratedSeriesPlan: (s: any[] | null) => void;
  setGeneratedDescription: (d: string | null) => void;
  setGeneratedWorld: (w: string | null) => void;
  setGeneratedWorldContent: (w: WorldLore | null) => void;
  setGeneratedWorldLore: (l: string | null) => void;
  setGeneratedWorldPowers: (p: string | null) => void;
  setGeneratedWorldFactions: (f: string | null) => void;
  setGeneratedWorldArchitecture: (a: string | null) => void;
  setGeneratedWorldAtlas: (a: string | null) => void;
  setGeneratedWorldCulture: (c: string | null) => void;
  setGeneratedWorldSystems: (s: string | null) => void;
  setWorldGenerationStatus: (s: 'idle' | 'loading' | 'success' | 'error') => void;
  setWorldGenerationError: (e: string | null) => void;
  setWorldGenerationLatency: (l: number) => void;
  setGeneratedAltText: (a: string | null) => void;
  setRecapperPersona: (p: string) => void;
  syncCore: () => Promise<void>;
  addLog: (module: string, status: string, message?: string) => void;
  setEpisode: (e: string) => void;
  setSession: (s: string) => void;
  setNumScenes: (n: string) => void;
  setContentType: (t: string) => void;
  setIsLoading: (l: boolean) => void;
  setIsGeneratingCharacters: (l: boolean) => void;
  setIsGeneratingMetadata: (l: boolean) => void;
  setIsGeneratingImagePrompts: (l: boolean) => void;
  setIsGeneratingSeries: (l: boolean) => void;
  setIsGeneratingDescription: (l: boolean) => void;
  setIsGeneratingWorld: (l: boolean) => void;
  setIsGeneratingLore: (l: boolean) => void;
  setIsGeneratingPowers: (l: boolean) => void;
  setIsGeneratingFactions: (l: boolean) => void;
  setIsGeneratingArchitecture: (l: boolean) => void;
  setIsGeneratingAtlas: (l: boolean) => void;
  setIsGeneratingCulture: (l: boolean) => void;
  setIsGeneratingSystems: (l: boolean) => void;
  setIsEditing: (e: boolean) => void;
  setIsSaving: (s: boolean) => void;
  setIsContinuingScript: (c: boolean) => void;
  setIsGeneratingVisuals: (l: boolean) => void;
  setIsGeneratingAltText: (l: boolean) => void;
  setCurrentScriptId: (id: string | null) => void;
  setProductionSequence: (s: ProductionUnit[]) => void;
  setIsLiked: (l: boolean) => void;
  setGeneratedGrowthStrategy: (s: string | null) => void;
  setIsGeneratingGrowthStrategy: (l: boolean) => void;
  setGeneratedDistributionPlan: (s: string | null) => void;
  setIsGeneratingDistribution: (l: boolean) => void;
  showNotification: (message: string, type?: 'error' | 'success' | 'info') => void;
  // Backwards-compatible setters (no-ops or proxies)
  setTemperature: (t: number) => void;
  setMaxTokens: (n: number) => void;
  setTopP: (p: number) => void;
  setTopK: (k: number) => void;
  setSelectedModel: (m: string) => void;
  setTone: (t: string) => void;
  setAudience: (a: string) => void;

  setCastData: (d: any | null) => void;
  setCastList: (l: any[]) => void;
  setCastProfiles: (p: any | null) => void;
  setCharacterRelationships: (r: string | null) => void;

  setVisualData: (v: any) => void;
  setVideoData: (v: any) => void;

  // Aliases for older APIs
  setGlobalPrompt: (p: string) => void;
  setGlobalContentType: (t: string) => void;
}

export type GeneratorContextType = GeneratorState & GeneratorDispatch;

export const GeneratorStateContext = createContext<GeneratorState | undefined>(undefined);
export const GeneratorDispatchContext = createContext<GeneratorDispatch | undefined>(undefined);
export const GeneratorContext = createContext<GeneratorContextType | undefined>(undefined);

export function GeneratorProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { showNotification: rawShowNotification } = useApp();
  const [prompt, setPrompt] = useState('');
  const [promptLore, setPromptLore] = useState('');
  const [promptPowers, setPromptPowers] = useState('');
  const [promptFactions, setPromptFactions] = useState('');
  const [promptArchitecture, setPromptArchitecture] = useState('');
  const [promptAtlas, setPromptAtlas] = useState('');
  const [promptCulture, setPromptCulture] = useState('');
  const [promptSystems, setPromptSystems] = useState('');
  const [theme, setTheme] = useState('');
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [generatedCharacters, setGeneratedCharacters] = useState<string | null>(null);
  const [generatedMetadata, setGeneratedMetadata] = useState<string | null>(null);
  const [generatedImagePrompts, setGeneratedImagePrompts] = useState<string | null>(null);
  const [generatedSeriesPlan, setGeneratedSeriesPlan] = useState<any[] | null>(null);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  const [generatedWorld, setGeneratedWorldInternal] = useState<string | null>(null);
  const [generatedWorldContent, setGeneratedWorldContent] = useState<WorldLore | null>(null);
  const [generatedWorldLore, setGeneratedWorldLore] = useState<string | null>(null);
  const [generatedWorldPowers, setGeneratedWorldPowers] = useState<string | null>(null);
  const [generatedWorldFactions, setGeneratedWorldFactions] = useState<string | null>(null);
  const [generatedWorldArchitecture, setGeneratedWorldArchitecture] = useState<string | null>(null);
  const [generatedWorldAtlas, setGeneratedWorldAtlas] = useState<string | null>(null);
  const [generatedWorldCulture, setGeneratedWorldCulture] = useState<string | null>(null);
  const [generatedWorldSystems, setGeneratedWorldSystems] = useState<string | null>(null);
  const [isGeneratingLore, setIsGeneratingLore] = useState(false);
  const [isGeneratingPowers, setIsGeneratingPowers] = useState(false);
  const [isGeneratingFactions, setIsGeneratingFactions] = useState(false);
  const [isGeneratingArchitecture, setIsGeneratingArchitecture] = useState(false);
  const [isGeneratingAtlas, setIsGeneratingAtlas] = useState(false);
  const [isGeneratingCulture, setIsGeneratingCulture] = useState(false);
  const [isGeneratingSystems, setIsGeneratingSystems] = useState(false);
  const [worldGenerationStatus, setWorldGenerationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [worldGenerationError, setWorldGenerationError] = useState<string | null>(null);
  const [worldGenerationLatency, setWorldGenerationLatency] = useState<number>(0);
  const [generatedAltText, setGeneratedAltText] = useState<string | null>(null);
  const [generatedGrowthStrategy, setGeneratedGrowthStrategy] = useState<string | null>(null);
  const [isGeneratingGrowthStrategy, setIsGeneratingGrowthStrategy] = useState(false);
  const [generatedDistributionPlan, setGeneratedDistributionPlan] = useState<string | null>(null);
  const [isGeneratingDistribution, setIsGeneratingDistribution] = useState(false);

  // Helper to update world manifest
  const setGeneratedWorld = useCallback((fullBlob: string | null) => {
    setGeneratedWorldInternal(fullBlob);
    if (fullBlob) {
      setGeneratedWorldContent({
        user_id: user?.id || '',
        full_lore_blob: fullBlob,
        history_blob: generatedWorldLore,
        powers_blob: generatedWorldPowers,
        factions_blob: generatedWorldFactions
      });
    } else {
      setGeneratedWorldContent(null);
    }
  }, [user?.id, generatedWorldLore, generatedWorldPowers, generatedWorldFactions]);

  const [activeModelAttempt, setActiveModelAttempt] = useState<string | null>(null);
  const [fallbackHistory, setFallbackHistory] = useState<string[]>([]);

  const showNotification = useCallback((message: string, type?: 'error' | 'success' | 'info') => {
    rawShowNotification(message, type);
  }, [rawShowNotification]);

  // World Modular Lore State REMOVED (Migrated to WorldContext)

  // Engine Configuration State REMOVED (Migrated to EngineContext)

  // TanStack Queries for Caching
  useQuery({
    queryKey: ['engineConfig', user?.id],
    queryFn: () => engineApi.getConfig(user!.id),
    enabled: !!user?.id,
  });

  const { data: worldLore } = useQuery({
    queryKey: ['worldLore', user?.id],
    queryFn: () => worldApi.getLore(user!.id),
    enabled: !!user?.id,
  });

  const { data: production } = useQuery({
    queryKey: ['productionContent', user?.id],
    queryFn: () => productionApi.getContent(user!.id),
    enabled: !!user?.id,
  });

  const { data: projectHistory = [] } = useQuery({
    queryKey: ['projectHistory', user?.id],
    queryFn: async () => {
      const projects = await apiRequest<any[]>(`/api/projects?user_id=${user!.id}`, { label: 'Project History' });
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
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (production) {
      setGeneratedScript(production.script_content);
      setGeneratedSeriesPlan(production.series_plan);
      setGeneratedMetadata(production.seo_metadata);
      setGeneratedGrowthStrategy(production.growth_strategy);
      setGeneratedDistributionPlan(production.distribution_plan);
    }
  }, [production]);

  useEffect(() => {
    if (worldLore) {
      setGeneratedWorldInternal(worldLore.full_lore_blob);
      setGeneratedWorldLore(worldLore.history_blob || null);
      setGeneratedWorldPowers(worldLore.powers_blob || null);
      setGeneratedWorldFactions(worldLore.factions_blob || null);
      
      // Load modular prompts (Neural Seeds)
      setPromptLore(worldLore.prompt_lore || '');
      setPromptPowers(worldLore.prompt_powers || '');
      setPromptFactions(worldLore.prompt_factions || '');
      setPromptArchitecture(worldLore.prompt_architecture || '');
      setPromptAtlas(worldLore.prompt_atlas || '');
      setPromptCulture(worldLore.prompt_culture || '');
      setPromptSystems(worldLore.prompt_systems || '');
      
      setGeneratedWorldContent(worldLore);
    }
  }, [worldLore]);

  const [episode, setEpisode] = useState('1');
  const [session, setSession] = useState('1');
  const [numScenes, setNumScenes] = useState('6');
  const [recapperPersona, setRecapperPersona] = useState('');
  const [contentType, setContentType] = useState('Anime');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCharacters, setIsGeneratingCharacters] = useState(false);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [isGeneratingImagePrompts, setIsGeneratingImagePrompts] = useState(false);
  const [isGeneratingSeries, setIsGeneratingSeries] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingWorld, setIsGeneratingWorld] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isContinuingScript, setIsContinuingScript] = useState(false);
  const [isGeneratingVisuals, setIsGeneratingVisuals] = useState(false);
  const [isGeneratingAltText, setIsGeneratingAltText] = useState(false);
  const [currentScriptId, setCurrentScriptId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [productionSequence, setProductionSequence] = useState<ProductionUnit[]>([]);

  // Compatibility engine settings (kept local to avoid cross-context coupling)
  const [temperature, setTemperature] = useState(0.85);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topP, setTopP] = useState(0.95);
  const [topK, setTopK] = useState(40);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.1-flash');
  const [tone, setTone] = useState('Analytical');
  const [audience, setAudience] = useState('Developers');

  // Compatibility cast/world/visual placeholders
  const [castData, setCastData] = useState<any | null>(null);
  const [castList, setCastList] = useState<any[]>([]);
  const [castProfiles, setCastProfiles] = useState<any | null>(null);
  const [characterRelationships, setCharacterRelationships] = useState<string | null>('');
  const [visualData, setVisualData] = useState<any>([]);
  const [videoData, setVideoData] = useState<any>([]);

  // Removed specialized modular auto-saves (Handled by smaller contexts)

  // Auto-save Production Content (Remaining global fields)
  useEffect(() => {
    if (!user?.id || !production) return;

    const timeout = setTimeout(async () => {
      try {
        await productionApi.updateContent(user.id, {
          script_content: generatedScript,
          series_plan: generatedSeriesPlan,
          seo_metadata: generatedMetadata,
          growth_strategy: generatedGrowthStrategy,
          distribution_plan: generatedDistributionPlan
        });

        if (generatedWorldContent) {
          await worldApi.updateLore(user.id, {
            ...generatedWorldContent,
            full_lore_blob: generatedWorld,
            history_blob: generatedWorldLore,
            powers_blob: generatedWorldPowers,
            factions_blob: generatedWorldFactions,
            prompt_lore: promptLore,
            prompt_powers: promptPowers,
            prompt_factions: promptFactions,
            prompt_architecture: promptArchitecture,
            prompt_atlas: promptAtlas,
            prompt_culture: promptCulture,
            prompt_systems: promptSystems
          });
        } else if (generatedWorld) {
          await worldApi.updateLore(user.id, { 
            full_lore_blob: generatedWorld,
            history_blob: generatedWorldLore,
            powers_blob: generatedWorldPowers,
            factions_blob: generatedWorldFactions,
            prompt_lore: promptLore,
            prompt_powers: promptPowers,
            prompt_factions: promptFactions,
            prompt_architecture: promptArchitecture,
            prompt_atlas: promptAtlas,
            prompt_culture: promptCulture,
            prompt_systems: promptSystems
          });
        }
      } catch (error) {
        console.error("%c[System] %cFailed to sync production content:", 'color: #ef4444; font-weight: bold', 'color: #94a3b8', error);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [user?.id, generatedScript, generatedSeriesPlan, generatedMetadata, generatedGrowthStrategy, generatedDistributionPlan, generatedWorld, generatedWorldLore, generatedWorldPowers, generatedWorldFactions, production]);

  const { addLog } = useLogs();

  const syncCore = useCallback(async () => {
    if (!user?.id) {
      showNotification("Authentication required for synchronization", "error");
      return;
    }

    setIsSaving(true);
    addLog("SYNC", "INITIALIZED", "Initiating global state synchronization protocol...");
    showNotification("Synchronizing Core Manifest...", "info");

    try {
      // PHASE 3: Production Asset Sync (Remaining global fields)
      addLog("PRODUCTION", "SYNCING", "Persisting Script and Series manifests...");
      await productionApi.updateContent(user.id, {
        script_content: generatedScript,
        series_plan: generatedSeriesPlan,
        seo_metadata: generatedMetadata,
        growth_strategy: generatedGrowthStrategy,
        distribution_plan: generatedDistributionPlan
      });

      if (generatedWorldContent) {
        addLog("WORLD", "SYNCING", "Persisting Modular World Lore Manifest...");
        await worldApi.updateLore(user.id, {
          ...generatedWorldContent,
          full_lore_blob: generatedWorld,
          history_blob: generatedWorldLore,
          powers_blob: generatedWorldPowers,
          factions_blob: generatedWorldFactions,
          prompt_lore: promptLore,
          prompt_powers: promptPowers,
          prompt_factions: promptFactions,
          prompt_architecture: promptArchitecture,
          prompt_atlas: promptAtlas,
          prompt_culture: promptCulture,
          prompt_systems: promptSystems
        });
      } else if (generatedWorld) {
        addLog("WORLD", "SYNCING", "Persisting World Lore Manifest...");
        await worldApi.updateLore(user.id, { 
          full_lore_blob: generatedWorld,
          history_blob: generatedWorldLore,
          powers_blob: generatedWorldPowers,
          factions_blob: generatedWorldFactions,
          prompt_lore: promptLore,
          prompt_powers: promptPowers,
          prompt_factions: promptFactions,
          prompt_architecture: promptArchitecture,
          prompt_atlas: promptAtlas,
          prompt_culture: promptCulture,
          prompt_systems: promptSystems
        });
      }

      addLog("PRODUCTION", "COMPLETED", "Global production fields synchronized.");

      showNotification("CORE SYNCHRONIZED", "success");
      addLog("CORE", "SUCCESS", "Full system state synchronized with central database.");
    } catch (error: any) {
      console.error("Core Sync Failed:", error);
      showNotification("SYNCHRONIZATION FAILURE", "error");
      addLog("CORE", "FAILURE", `Sync failed: ${error.message || 'Network error'}`);
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, generatedScript, generatedSeriesPlan, generatedMetadata, generatedGrowthStrategy, generatedDistributionPlan, generatedWorld, generatedWorldLore, generatedWorldPowers, generatedWorldFactions, addLog, showNotification]);

  // Neural Telemetry & Thinking Stream Log Sync
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
          metadata: { fallbacks: e.detail.fallbacks }
        }, user?.id);
      } catch (err) {
        console.warn("%c[System] %cFailed to record remote telemetry:", 'color: #f59e0b; font-weight: bold', 'color: #94a3b8', err);
      }
    };

    const handleStart = (e: any) => {
      addLog("NEURAL_ENGINE", "INITIALIZED", `Activating ${e.detail.model} for synthesis...`);
      setActiveModelAttempt(e.detail.model);
      setFallbackHistory([]);
    };

    const handleComplete = (e: any) => {
      addLog("NEURAL_ENGINE", "COMPLETED", `Synthesis finished via ${e.detail.model} (${e.detail.latency.toFixed(0)}ms)`);
      setActiveModelAttempt(null);
    };

    const handleFallback = (e: any) => {
      addLog("NEURAL_ENGINE", "RETRYING", `Switching from ${e.detail.failedModel} to ${e.detail.nextModel} due to friction.`);
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
  }, [user?.id, addLog]);

  const state = useMemo<GeneratorState>(() => ({
    storyboardPrompts: generatedImagePrompts,
    prompt,
    promptLore,
    promptPowers,
    promptFactions,
    promptArchitecture,
    promptAtlas,
    promptCulture,
    promptSystems,
    theme,
    generatedScript,
    generatedCharacters,
    generatedMetadata,
    generatedImagePrompts,
    generatedSeriesPlan,
    generatedDescription,
    generatedWorld: generatedWorld,
    generatedWorldContent: generatedWorldContent,
    generatedWorldLore: generatedWorldLore,
    generatedWorldPowers: generatedWorldPowers,
    generatedWorldFactions: generatedWorldFactions,
    generatedWorldArchitecture: generatedWorldArchitecture,
    generatedWorldAtlas: generatedWorldAtlas,
    generatedWorldCulture: generatedWorldCulture,
    generatedWorldSystems: generatedWorldSystems,
    worldGenerationStatus,
    worldGenerationError,
    worldGenerationLatency,
    generatedAltText,
    recapperPersona,
    episode,
    session,
    numScenes,
    contentType,
    isLoading,
    isGeneratingCharacters,
    isGeneratingMetadata,
    isGeneratingImagePrompts,
    isGeneratingSeries,
    isGeneratingDescription,
    isGeneratingWorld,
    isGeneratingLore,
    isGeneratingPowers,
    isGeneratingFactions,
    isGeneratingArchitecture,
    isGeneratingAtlas,
    isGeneratingCulture,
    isGeneratingSystems,
    isEditing,
    isSaving,
    isContinuingScript,
    isGeneratingVisuals,
    isGeneratingAltText,
    currentScriptId,
    history: projectHistory,
    productionSequence,
    isLiked,
    generatedGrowthStrategy,
    isGeneratingGrowthStrategy,
    generatedDistributionPlan,
    isGeneratingDistribution
    ,
    // Engine compatibility
    temperature,
    maxTokens,
    topP,
    topK,
    selectedModel,
    tone,
    audience,

    // Cast / world compatibility
    castData,
    castList,
    castProfiles,
    characterRelationships,

    // Visual / storyboard compatibility
    visualData,
    videoData,

    // SEO / series
    seoMetadata: generatedMetadata,
    seriesPlan: generatedSeriesPlan,
    worldLore: null,
    activeModelAttempt,
    fallbackHistory
  }), [
    prompt, promptLore, promptPowers, promptFactions, promptArchitecture, promptAtlas, promptCulture, promptSystems,
    theme, generatedScript, generatedCharacters, generatedMetadata, 
    generatedImagePrompts, generatedSeriesPlan, generatedDescription, generatedWorld, generatedWorldContent,
    worldGenerationStatus, worldGenerationError, worldGenerationLatency, generatedAltText,
    recapperPersona, episode, session, numScenes, contentType, 
    isLoading, isGeneratingCharacters, isGeneratingMetadata, isGeneratingImagePrompts,
    isGeneratingSeries, isGeneratingDescription, isGeneratingWorld, 
    isGeneratingLore, isGeneratingPowers, isGeneratingFactions, 
    isGeneratingArchitecture, isGeneratingAtlas, isGeneratingCulture, isGeneratingSystems,
    isEditing, isSaving,
    isContinuingScript, isGeneratingVisuals, isGeneratingAltText, currentScriptId, 
    projectHistory, productionSequence, isLiked, 
    generatedGrowthStrategy, isGeneratingGrowthStrategy, generatedDistributionPlan, isGeneratingDistribution,
    generatedWorldLore, generatedWorldPowers, generatedWorldFactions,
    generatedWorldArchitecture, generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems
    , temperature, maxTokens, topP, topK, selectedModel, tone, audience,
    castData, castList, castProfiles, characterRelationships, visualData, videoData, generatedMetadata, generatedSeriesPlan,
    activeModelAttempt, fallbackHistory
  ]);

  const dispatch = useMemo<GeneratorDispatch>(() => ({
    setPrompt,
    setPromptLore,
    setPromptPowers,
    setPromptFactions,
    setPromptArchitecture,
    setPromptAtlas,
    setPromptCulture,
    setPromptSystems,
    setTheme,
    setGeneratedScript,
    setGeneratedCharacters,
    setGeneratedMetadata,
    setGeneratedImagePrompts,
    setGeneratedSeriesPlan,
    setGeneratedDescription,
    setGeneratedWorld,
    setGeneratedWorldContent,
    setGeneratedWorldLore,
    setGeneratedWorldPowers,
    setGeneratedWorldFactions,
    setGeneratedWorldArchitecture,
    setGeneratedWorldAtlas,
    setGeneratedWorldCulture,
    setGeneratedWorldSystems,
    setWorldGenerationStatus,
    setWorldGenerationError,
    setWorldGenerationLatency,
    setGeneratedAltText,
    setRecapperPersona,
    syncCore,
    addLog,
    setEpisode,
    setSession,
    setNumScenes,
    setContentType,
    setIsLoading,
    setIsGeneratingCharacters,
    setIsGeneratingMetadata,
    setIsGeneratingImagePrompts,
    setIsGeneratingSeries,
    setIsGeneratingDescription,
    setIsGeneratingWorld,
    setIsGeneratingLore,
    setIsGeneratingPowers,
    setIsGeneratingFactions,
    setIsGeneratingArchitecture,
    setIsGeneratingAtlas,
    setIsGeneratingCulture,
    setIsGeneratingSystems,
    setIsEditing,
    setIsSaving,
    setIsContinuingScript,
    setIsGeneratingVisuals,
    setIsGeneratingAltText,
    setCurrentScriptId,
    setProductionSequence,
    setIsLiked,
    setGeneratedGrowthStrategy,
    setIsGeneratingGrowthStrategy,
    setGeneratedDistributionPlan,
    setIsGeneratingDistribution,
    showNotification
    ,
    // Engine setters
    setTemperature,
    setMaxTokens,
    setTopP,
    setTopK,
    setSelectedModel,
    setTone,
    setAudience,

    // Cast / world setters
    setCastData,
    setCastList,
    setCastProfiles,
    setCharacterRelationships,

    // Visual setters
    setVisualData,
    setVideoData,

    // Aliases
    setGlobalPrompt: setPrompt,
    setGlobalContentType: setContentType,
  }), [syncCore, addLog, showNotification, setGeneratedWorldLore, setGeneratedWorldPowers, setGeneratedWorldFactions, setGeneratedWorldArchitecture, setGeneratedWorldAtlas, setGeneratedWorldCulture, setGeneratedWorldSystems, setPromptLore, setPromptPowers, setPromptFactions, setPromptArchitecture, setPromptAtlas, setPromptCulture, setPromptSystems]);

  const fullValue = useMemo(() => ({
    ...state,
    ...dispatch
  }), [state, dispatch]);

  return (
    <GeneratorStateContext.Provider value={state}>
      <GeneratorDispatchContext.Provider value={dispatch}>
        <GeneratorContext.Provider value={fullValue}>
          {children}
        </GeneratorContext.Provider>
      </GeneratorDispatchContext.Provider>
    </GeneratorStateContext.Provider>
  );
}
