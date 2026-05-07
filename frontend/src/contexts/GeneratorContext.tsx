import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-utils';
import { ProductionUnit } from '@/lib/sequence-utils';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { engineApi } from '../services/api/engine';
import { worldApi, WorldLore } from '../services/api/world';
import { productionApi } from '../services/api/production';
import { characterApi } from '../services/api/characters';
import { AI_EVENTS } from '../services/generators/core';
import { useLogs } from './LogContext';

interface GeneratorState {
  generationProgress: any;
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
  castDNA?: any | null;
  castDynamics?: any | null;
  castIntegrity?: any | null;
  isAnalyzingCast: boolean;
  numCharacters: number;
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
  setCastDNA: (d: any | null) => void;
  setCastDynamics: (d: any | null) => void;
  setCastIntegrity: (i: any | null) => void;
  setIsAnalyzingCast: (l: boolean) => void;

  // Stop Generation
  stopGeneration: () => void;
  getSignal: () => AbortSignal;

  // Aliases for older APIs
  setGlobalPrompt: (p: string) => void;
  setGlobalContentType: (t: string) => void;
  setNumCharacters: (n: number) => void;
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
        manifest_blob: fullBlob,
        history_blob: generatedWorldLore,
        powers_blob: generatedWorldPowers,
        factions_blob: generatedWorldFactions,
        architecture_blob: generatedWorldArchitecture,
        atlas_blob: generatedWorldAtlas,
        culture_blob: generatedWorldCulture,
        systems_blob: generatedWorldSystems
      });
    } else {
      setGeneratedWorldContent(null);
    }
  }, [user?.id, generatedWorldLore, generatedWorldPowers, generatedWorldFactions, generatedWorldArchitecture, generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems]);

  const [activeModelAttempt, setActiveModelAttempt] = useState<string | null>(null);
  const [fallbackHistory, setFallbackHistory] = useState<string[]>([]);
  const [abortController, setAbortController] = useState<AbortController>(new AbortController());

  // Refs to track initial project load and avoid overwriting new generations with stale query data
  const hasLoadedProduction = React.useRef(false);
  const hasLoadedWorld = React.useRef(false);
  const hasLoadedCast = React.useRef(false);

  // Reset load flags when user changes
  useEffect(() => {
    hasLoadedProduction.current = false;
    hasLoadedWorld.current = false;
    hasLoadedCast.current = false;
  }, [user?.id]);

  const getSignal = useCallback(() => {
    if (abortController.signal.aborted) {
      const newController = new AbortController();
      setAbortController(newController);
      return newController.signal;
    }
    return abortController.signal;
  }, [abortController]);

  const stopGeneration = useCallback(() => {
    abortController.abort();
    setIsGeneratingWorld(false);
    setIsGeneratingLore(false);
    setIsGeneratingPowers(false);
    setIsGeneratingFactions(false);
    setIsGeneratingArchitecture(false);
    setIsGeneratingAtlas(false);
    setIsGeneratingCulture(false);
    setIsGeneratingSystems(false);
    setIsGeneratingCharacters(false);
    setIsGeneratingMetadata(false);
    setIsGeneratingImagePrompts(false);
    setIsGeneratingSeries(false);
    setIsGeneratingDescription(false);
    setIsGeneratingVisuals(false);
    setIsGeneratingAltText(false);
    setIsGeneratingGrowthStrategy(false);
    setIsGeneratingDistribution(false);
    showNotification("Generation stopped", "info");
    setAbortController(new AbortController());
  }, [abortController, rawShowNotification]);

  const showNotification = useCallback((message: string, type?: 'error' | 'success' | 'info') => {
    rawShowNotification(message, type);
  }, [rawShowNotification]);

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

  const { data: castDataFromApi } = useQuery({
    queryKey: ['characterCast', user?.id],
    queryFn: () => characterApi.getCast(user!.id),
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
  const [castDNA, setCastDNA] = useState<any | null>(null);
  const [castDynamics, setCastDynamics] = useState<any | null>(null);
  const [castIntegrity, setCastIntegrity] = useState<any | null>(null);
  const [isAnalyzingCast, setIsAnalyzingCast] = useState(false);
  const [numCharacters, setNumCharacters] = useState<number>(8);
  const [generationProgress, setGenerationProgress] = useState<number>(0);

  // Sync logic moved after ALL state declarations to avoid "used before declaration" errors
  useEffect(() => {
    // Only sync from server on initial load or if local state is empty and we aren't currently generating
    const canSync = !hasLoadedProduction.current || (!generatedScript && !isGeneratingSeries);
    
    if (production && canSync) {
      if (production.script_content) setGeneratedScript(production.script_content);
      if (production.series_plan) setGeneratedSeriesPlan(production.series_plan);
      if (production.seo_metadata) setGeneratedMetadata(production.seo_metadata);
      if (production.growth_strategy) setGeneratedGrowthStrategy(production.growth_strategy);
      if (production.distribution_plan) setGeneratedDistributionPlan(production.distribution_plan);
      hasLoadedProduction.current = true;
    }
  }, [production, generatedScript, isGeneratingSeries]);

  useEffect(() => {
    // Prevent overwriting active world building
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
  }, [worldLore, generatedWorld, isGeneratingWorld, isGeneratingLore, isGeneratingPowers, isGeneratingFactions, isGeneratingArchitecture, isGeneratingAtlas, isGeneratingCulture, isGeneratingSystems]);

  useEffect(() => {
    // Prevent overwriting active cast creation
    const canSync = !hasLoadedCast.current || (castList.length === 0 && !isGeneratingCharacters);

    if (castDataFromApi && canSync) {
      if (castDataFromApi.cast_list_blob || castDataFromApi.num_characters) {
        try {
          if (castDataFromApi.num_characters) {
            setNumCharacters(castDataFromApi.num_characters);
          }
          setCastList(castDataFromApi.cast_list_blob ? JSON.parse(castDataFromApi.cast_list_blob) : []);
        } catch (e) {
          console.error("Failed to parse cast list from API", e);
        }
      }
      setCharacterRelationships(castDataFromApi.relationships_blob || '');
      hasLoadedCast.current = true;
    }
  }, [castDataFromApi, castList.length, isGeneratingCharacters]);

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
            manifest_blob: generatedWorld,
            history_blob: generatedWorldLore,
            powers_blob: generatedWorldPowers,
            factions_blob: generatedWorldFactions,
            architecture_blob: generatedWorldArchitecture,
            atlas_blob: generatedWorldAtlas,
            culture_blob: generatedWorldCulture,
            systems_blob: generatedWorldSystems,
            prompt_history: promptLore,
            prompt_powers: promptPowers,
            prompt_factions: promptFactions,
            prompt_architecture: promptArchitecture,
            prompt_atlas: promptAtlas,
            prompt_culture: promptCulture,
            prompt_systems: promptSystems
          });
        } else if (generatedWorld) {
          await worldApi.updateLore(user.id, { 
            manifest_blob: generatedWorld,
            history_blob: generatedWorldLore,
            powers_blob: generatedWorldPowers,
            factions_blob: generatedWorldFactions,
            architecture_blob: generatedWorldArchitecture,
            atlas_blob: generatedWorldAtlas,
            culture_blob: generatedWorldCulture,
            systems_blob: generatedWorldSystems,
            prompt_history: promptLore,
            prompt_powers: promptPowers,
            prompt_factions: promptFactions,
            prompt_architecture: promptArchitecture,
            prompt_atlas: promptAtlas,
            prompt_culture: promptCulture,
            prompt_systems: promptSystems
          });
        }

        // Auto-save Cast Content
        await characterApi.updateCast(user.id, {
          cast_list_blob: castList ? JSON.stringify(castList) : null,
          relationships_blob: characterRelationships,
          prompt_cast: prompt, // Using global prompt as baseline for cast logic
          num_characters: numCharacters,
        });
      } catch (error) {
        console.error("%c[System] %cFailed to sync production/cast content:", 'color: #ef4444; font-weight: bold', 'color: #94a3b8', error);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [user?.id, generatedScript, generatedSeriesPlan, generatedMetadata, generatedGrowthStrategy, generatedDistributionPlan, generatedWorld, generatedWorldLore, generatedWorldPowers, generatedWorldFactions, generatedWorldArchitecture, generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems, production]);

  const { addLog } = useLogs();

  const syncCore = useCallback(async () => {
    if (!user?.id) {
      showNotification("Please log in to save your work", "error");
      return;
    }

    setIsSaving(true);
    addLog("SAVE", "START", "Starting project save...");
    showNotification("Saving your project...", "info");

    try {
      // PHASE 1: Production Asset Sync
      addLog("PRODUCTION", "SAVING", "Saving script, series, and storyboard data...");
      await productionApi.updateContent(user.id, {
        script_content: generatedScript,
        series_plan: generatedSeriesPlan,
        seo_metadata: generatedMetadata,
        storyboard: generatedImagePrompts,
        growth_strategy: generatedGrowthStrategy,
        distribution_plan: generatedDistributionPlan,
      });

      // PHASE 2: World Lore Sync
      if (generatedWorldContent || generatedWorld) {
        addLog("WORLD", "SAVING", "Saving world data...");
        await worldApi.updateLore(user.id, {
          ...(generatedWorldContent || {}),
          manifest_blob: generatedWorld,
          history_blob: generatedWorldLore,
          powers_blob: generatedWorldPowers,
          factions_blob: generatedWorldFactions,
          architecture_blob: generatedWorldArchitecture,
          atlas_blob: generatedWorldAtlas,
          culture_blob: generatedWorldCulture,
          systems_blob: generatedWorldSystems,
          prompt_history: promptLore,
          prompt_powers: promptPowers,
          prompt_factions: promptFactions,
          prompt_architecture: promptArchitecture,
          prompt_atlas: promptAtlas,
          prompt_culture: promptCulture,
          prompt_systems: promptSystems,
        });
      }

      // PHASE 3: Cast Manifest Sync (full: characters + DNA + dynamics + integrity)
      addLog("CAST", "SAVING", "Saving characters and relationships...");
      await characterApi.updateCast(user.id, {
        cast_list_blob: castList ? JSON.stringify(castList) : null,
        relationships_blob: characterRelationships,
        dna_config_blob: castDNA ? JSON.stringify(castDNA) : null,
        dynamics_blob: castDynamics ? JSON.stringify(castDynamics) : null,
        integrity_blob: castIntegrity ? JSON.stringify(castIntegrity) : null,
        prompt_cast: prompt,
      });

      addLog("PRODUCTION", "SUCCESS", "All project data saved successfully.");
      showNotification("Project saved successfully", "success");
      addLog("PROJECT", "COMPLETE", "Project fully saved to cloud.");
    } catch (error: any) {
      console.error("Save Failed:", error);
      showNotification("Failed to save — please try again", "error");
      addLog("PROJECT", "ERROR", `Save failed: ${error.message || 'Network error'}`);
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, generatedScript, generatedSeriesPlan, generatedMetadata, generatedImagePrompts, generatedGrowthStrategy, generatedDistributionPlan, generatedWorld, generatedWorldContent, generatedWorldLore, generatedWorldPowers, generatedWorldFactions, generatedWorldArchitecture, generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems, promptLore, promptPowers, promptFactions, promptArchitecture, promptAtlas, promptCulture, promptSystems, castList, characterRelationships, castDNA, castDynamics, castIntegrity, prompt, numCharacters, addLog, showNotification]);

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
      addLog("AI_ENGINE", "STARTED", `Starting generation with ${e.detail.model}...`);
      setActiveModelAttempt(e.detail.model);
      setFallbackHistory([]);
    };

    const handleComplete = (e: any) => {
      addLog("AI_ENGINE", "COMPLETED", `Generation complete via ${e.detail.model} (${e.detail.latency.toFixed(0)}ms)`);
      setActiveModelAttempt(null);
    };

    const handleFallback = (e: any) => {
      addLog("AI_ENGINE", "RETRYING", `Retrying with ${e.detail.nextModel} (${e.detail.failedModel} was unavailable)`);
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

  // Auto-progress: when any generation flag is active, animate generationProgress
  useEffect(() => {
    const isAnyGenerating = isGeneratingCharacters || isGeneratingImagePrompts || isGeneratingSeries || isGeneratingDescription || isGeneratingWorld || isGeneratingVisuals || isGeneratingMetadata || isGeneratingDistribution || isGeneratingGrowthStrategy || isGeneratingAltText;
    let interval: NodeJS.Timeout | null = null;

    if (isAnyGenerating) {
      setGenerationProgress(p => (p > 0 ? p : 3));
      interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 95) return prev;
          const inc = Math.random() * 6 + 1;
          return Math.min(95, Math.round((prev + inc) * 10) / 10);
        });
      }, 700);
    } else if (!isAnyGenerating) {
      // finish and reset
      setGenerationProgress(prev => (prev > 0 && prev < 100 ? 100 : prev));
      const t = setTimeout(() => setGenerationProgress(0), 800);
      return () => clearTimeout(t);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [isGeneratingCharacters, isGeneratingImagePrompts, isGeneratingSeries, isGeneratingDescription, isGeneratingWorld, isGeneratingVisuals, isGeneratingMetadata, isGeneratingDistribution, isGeneratingGrowthStrategy, isGeneratingAltText]);

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
    generationProgress,
    activeModelAttempt,
    fallbackHistory,
    castDNA,
    castDynamics,
    castIntegrity,
    isAnalyzingCast,
    numCharacters
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
    activeModelAttempt, fallbackHistory, castDNA, castDynamics, castIntegrity, isAnalyzingCast, generationProgress, numCharacters
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

    setGenerationProgress,

    // Visual setters
    setVisualData,
    setVideoData,
    setCastDNA,
    setCastDynamics,
    setCastIntegrity,
    setIsAnalyzingCast,
    stopGeneration,
    getSignal,
    setNumCharacters,
    // Aliases
    setGlobalPrompt: setPrompt,
    setGlobalContentType: setContentType,
  }), [syncCore, addLog, showNotification, setGeneratedWorldLore, setGeneratedWorldPowers, setGeneratedWorldFactions, setGeneratedWorldArchitecture, setGeneratedWorldAtlas, setGeneratedWorldCulture, setGeneratedWorldSystems, setPromptLore, setPromptPowers, setPromptFactions, setPromptArchitecture, setPromptAtlas, setPromptCulture, setPromptSystems, stopGeneration, getSignal]);

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
