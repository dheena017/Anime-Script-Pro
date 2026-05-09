import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-utils';
import { ProductionUnit } from '@/lib/sequence-utils';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { engineApi } from '../services/api/engine';
import { worldApi, WorldLore } from '../services/api/world';
import { productionApi } from '../services/api/production';
import { characterApi } from '../services/api/characters';
import { AI_EVENTS } from '../services/generators/core';
import { projectService } from '../services/api/projects';
import { useLogs } from './LogContext';

interface GeneratorState {
  generationProgress: any;
  storyboardScenes: any[];
  storyboardVisuals: Record<number, string[]>;
  storyboardVideos: Record<number, string>;
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
  genre: string;
  artStyle: string;

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
  syncCore: (projectId?: number) => Promise<number | undefined>;
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
  setGenerationProgress: (p: number) => void;
  setStoryboardScenes: (s: any[]) => void;
  setStoryboardVisuals: (v: Record<number, string[]>) => void;
  setStoryboardVideos: (v: Record<number, string>) => void;
  setStoryboardPrompts: (p: any) => void;
  showNotification: (message: string, type?: 'error' | 'success' | 'info') => void;
  // Backwards-compatible setters (no-ops or proxies)
  setTemperature: (t: number) => void;
  setMaxTokens: (n: number) => void;
  setTopP: (p: number) => void;
  setTopK: (k: number) => void;
  setSelectedModel: (m: string) => void;
  setTone: (t: string) => void;
  setAudience: (a: string) => void;
  setGenre: (g: string) => void;
  setArtStyle: (a: string) => void;

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

export const GeneratorStateContext = createContext<GeneratorState | undefined>(undefined);
export const GeneratorDispatchContext = createContext<GeneratorDispatch | undefined>(undefined);

export function GeneratorProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
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
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [storyboardScenes, setStoryboardScenes] = useState<any[]>([]);
  const [storyboardVisuals, setStoryboardVisuals] = useState<Record<number, string[]>>({});
  const [storyboardVideos, setStoryboardVideos] = useState<Record<number, string>>({});
  const [storyboardPrompts, setStoryboardPrompts] = useState<any>(null);

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
  const [genre, setGenre] = useState('');
  const [artStyle, setArtStyle] = useState('');

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

  // TanStack Queries for Caching
  const { data: engineConfig } = useQuery({
    queryKey: ['engineConfig', user?.id],
    queryFn: () => engineApi.getConfig(user!.id),
    enabled: !!user?.id,
  });

  const { data: worldLore } = useQuery({
    queryKey: ['worldLore', user?.id, currentScriptId],
    queryFn: () => worldApi.getLore(user!.id, currentScriptId ? parseInt(currentScriptId) : undefined),
    enabled: !!user?.id,
  });

  const { data: production } = useQuery({
    queryKey: ['productionContent', user?.id, currentScriptId],
    queryFn: () => productionApi.getContent(user!.id, currentScriptId ? parseInt(currentScriptId) : undefined),
    enabled: !!user?.id,
  });

  const { data: castDataFromApi } = useQuery({
    queryKey: ['characterCast', user?.id, currentScriptId],
    queryFn: () => characterApi.getCast(user!.id, currentScriptId ? parseInt(currentScriptId) : undefined),
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

  // Reset all loaded flags and clear memory when switching projects
  useEffect(() => {
    hasLoadedProduction.current = false;
    hasLoadedWorld.current = false;
    hasLoadedCast.current = false;

    // Clear current state to avoid "ghost data" from previous projects
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
  }, [currentScriptId]);


  // Sync logic moved after ALL state declarations to avoid "used before declaration" errors
  useEffect(() => {
    // Only sync from server on initial load or if local state is empty and we aren't currently generating
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
  }, [production, generatedScript, isGeneratingSeries, currentScriptId]);

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
  }, [worldLore, generatedWorld, isGeneratingWorld, isGeneratingLore, isGeneratingPowers, isGeneratingFactions, isGeneratingArchitecture, isGeneratingAtlas, isGeneratingCulture, isGeneratingSystems, currentScriptId]);

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
  }, [castDataFromApi, castList.length, isGeneratingCharacters, currentScriptId]);

  const resolveProjectId = useCallback((overrideProjectId?: number) => {
    if (typeof overrideProjectId === 'number' && Number.isFinite(overrideProjectId)) {
      return overrideProjectId;
    }

    if (!currentScriptId) {
      return undefined;
    }

    const parsedProjectId = Number.parseInt(currentScriptId, 10);
    return Number.isFinite(parsedProjectId) ? parsedProjectId : undefined;
  }, [currentScriptId]);

  // Auto-save Production Content (Remaining global fields)
  useEffect(() => {
    if (!user?.id || !production) return;

    const projectId = resolveProjectId();

    const timeout = setTimeout(async () => {
      try {
        await productionApi.updateContent(user.id, {
          script_content: generatedScript,
          series_plan: generatedSeriesPlan,
          seo_metadata: generatedMetadata,
          storyboard: generatedImagePrompts,
          growth_strategy: generatedGrowthStrategy,
          distribution_plan: generatedDistributionPlan,
          youtube_description: generatedDescription,
          alt_texts: generatedAltText
        }, projectId);

        if (projectId) {
          await projectService.updateProject(projectId, {
            prompt: prompt,
            model_used: selectedModel,
            content_type: contentType,
            genre: genre,
            art_style: artStyle,
            tone: tone,
            description: prompt, // Use prompt as description for now
            status: "IN_PROGRESS"
          });
        }

        // Auto-save World Lore (Modular)
        if (generatedWorld) await worldApi.manifest.update(user.id, generatedWorld, promptLore, projectId);
        if (generatedWorldLore) await worldApi.history.update(user.id, generatedWorldLore, promptLore, projectId);
        if (generatedWorldPowers) await worldApi.powers.update(user.id, generatedWorldPowers, promptPowers, projectId);
        if (generatedWorldFactions) await worldApi.factions.update(user.id, generatedWorldFactions, promptFactions, projectId);
        if (generatedWorldArchitecture) await worldApi.architecture.update(user.id, generatedWorldArchitecture, promptArchitecture, projectId);
        if (generatedWorldAtlas) await worldApi.atlas.update(user.id, generatedWorldAtlas, promptAtlas, projectId);
        if (generatedWorldCulture) await worldApi.culture.update(user.id, generatedWorldCulture, promptCulture, projectId);
        if (generatedWorldSystems) await worldApi.systems.update(user.id, generatedWorldSystems, promptSystems, projectId);

        // Auto-save Cast Content
        await characterApi.updateCast(user.id, {
          cast_list_blob: castList ? JSON.stringify(castList) : null,
          relationships_blob: characterRelationships,
          prompt_cast: prompt, // Using global prompt as baseline for cast logic
          num_characters: numCharacters,
        }, projectId);
      } catch (error) {
        console.error("%c[System] %cFailed to sync production/cast content:", 'color: #ef4444; font-weight: bold', 'color: #94a3b8', error);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [user?.id, generatedScript, generatedSeriesPlan, generatedMetadata, generatedGrowthStrategy, generatedDistributionPlan, generatedWorld, generatedWorldLore, generatedWorldPowers, generatedWorldFactions, generatedWorldArchitecture, generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems, production, resolveProjectId, prompt, selectedModel, contentType, tone, genre, artStyle, castList, characterRelationships, numCharacters]);

  const { addLog } = useLogs();

  const syncCore = useCallback(async (projectId?: number): Promise<number | undefined> => {
    if (!user?.id) {
      showNotification("Please log in to save your work", "error");
      console.warn("[GeneratorContext] Save skipped: user is not logged in.");
      return undefined;
    }

    let resolvedProjectId = resolveProjectId(projectId);

    setIsSaving(true);
    addLog("SAVE", "START", "Starting project save...");
    console.info("[GeneratorContext] Project save started.", { projectId: resolvedProjectId });
    showNotification("Saving your project...", "info");

    try {
      // PHASE 0: Create Project Record if missing
      if (!resolvedProjectId) {
        addLog("PROJECT", "CREATING", "Creating new production record...");
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            name: prompt || "Untitled Anime Project",
            content_type: contentType || 'Anime',
            prompt: prompt,
            model_used: selectedModel
          })
        });
        if (res.ok) {
          const newProject = await res.json();
          resolvedProjectId = newProject.id;
          if (resolvedProjectId) setCurrentScriptId(resolvedProjectId.toString());
          addLog("PROJECT", "CREATED", `New production initialized: ID ${resolvedProjectId}`);
        } else {
          throw new Error("Failed to initialize project record");
        }
      }

      // PHASE 1: Production Asset Sync
      addLog("PRODUCTION", "SAVING", "Saving script, series, and storyboard data...");
      console.info("[GeneratorContext] Saving production content.", { projectId: resolvedProjectId });
      await productionApi.updateContent(user.id, {
        script_content: generatedScript,
        series_plan: generatedSeriesPlan,
        seo_metadata: generatedMetadata,
        storyboard: generatedImagePrompts,
        growth_strategy: generatedGrowthStrategy,
        distribution_plan: generatedDistributionPlan,
        youtube_description: generatedDescription,
        alt_texts: generatedAltText,
      }, resolvedProjectId);

      // Persist Project Baseline
      if (resolvedProjectId) {
        await projectService.updateProject(resolvedProjectId, {
          prompt: prompt,
          model_used: selectedModel,
          content_type: contentType,
          genre: genre,
          art_style: artStyle,
          tone: tone,
          description: prompt,
          status: "IN_PROGRESS"
        });
      }

      // PHASE 2: World Lore Sync
      if (generatedWorldContent || generatedWorld) {
        // Full Modular Sync
        console.info("[GeneratorContext] Saving modular world content.", { projectId: resolvedProjectId });
        if (generatedWorld) await worldApi.manifest.update(user.id, generatedWorld, promptLore, resolvedProjectId);
        if (generatedWorldLore) await worldApi.history.update(user.id, generatedWorldLore, promptLore, resolvedProjectId);
        if (generatedWorldPowers) await worldApi.powers.update(user.id, generatedWorldPowers, promptPowers, resolvedProjectId);
        if (generatedWorldFactions) await worldApi.factions.update(user.id, generatedWorldFactions, promptFactions, resolvedProjectId);
        if (generatedWorldArchitecture) await worldApi.architecture.update(user.id, generatedWorldArchitecture, promptArchitecture, resolvedProjectId);
        if (generatedWorldAtlas) await worldApi.atlas.update(user.id, generatedWorldAtlas, promptAtlas, resolvedProjectId);
        if (generatedWorldCulture) await worldApi.culture.update(user.id, generatedWorldCulture, promptCulture, resolvedProjectId);
        if (generatedWorldSystems) await worldApi.systems.update(user.id, generatedWorldSystems, promptSystems, resolvedProjectId);
      }

      // PHASE 3: Cast Manifest Sync (full: characters + DNA + dynamics + integrity)
      addLog("CAST", "SAVING", "Saving characters and relationships...");
      console.info("[GeneratorContext] Saving cast content.", { projectId: resolvedProjectId });
      await characterApi.updateCast(user.id, {
        cast_list_blob: castList ? JSON.stringify(castList) : null,
        relationships_blob: characterRelationships,
        dna_config_blob: castDNA ? JSON.stringify(castDNA) : null,
        dynamics_blob: castDynamics ? JSON.stringify(castDynamics) : null,
        integrity_blob: castIntegrity ? JSON.stringify(castIntegrity) : null,
        prompt_cast: prompt,
      }, resolvedProjectId);

      addLog("PRODUCTION", "SUCCESS", "All project data saved successfully.");
      console.info("[GeneratorContext] Project save completed successfully.", { projectId: resolvedProjectId });
      showNotification("Project saved successfully", "success");
      addLog("PROJECT", "COMPLETE", "Project fully saved to cloud.");

      // Invalidate queries to refresh frontend data
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['productionContent', user.id, resolvedProjectId?.toString()] });
      queryClient.invalidateQueries({ queryKey: ['worldLore', user.id, resolvedProjectId?.toString()] });
      queryClient.invalidateQueries({ queryKey: ['characterCast', user.id, resolvedProjectId?.toString()] });

      // Reset loaded refs so the sync effects can trigger a fresh pull from the backend
      hasLoadedProduction.current = false;
      hasLoadedWorld.current = false;
      hasLoadedCast.current = false;

      return resolvedProjectId;
    } catch (error: any) {
      console.error("[GeneratorContext] Save failed.", error);
      showNotification("Failed to save — please try again", "error");
      addLog("PROJECT", "ERROR", `Save failed: ${error.message || 'Network error'}`);
      return undefined;
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, generatedScript, generatedSeriesPlan, generatedMetadata, generatedImagePrompts, generatedGrowthStrategy, generatedDistributionPlan, generatedWorld, generatedWorldContent, generatedWorldLore, generatedWorldPowers, generatedWorldFactions, generatedWorldArchitecture, generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems, promptLore, promptPowers, promptFactions, promptArchitecture, promptAtlas, promptCulture, promptSystems, castList, characterRelationships, castDNA, castDynamics, castIntegrity, prompt, contentType, selectedModel, numCharacters, tone, genre, artStyle, addLog, showNotification, resolveProjectId]);

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
    generatedWorld,
    generatedWorldContent,
    generatedWorldLore,
    generatedWorldPowers,
    generatedWorldFactions,
    generatedWorldArchitecture,
    generatedWorldAtlas,
    generatedWorldCulture,
    generatedWorldSystems,
    worldGenerationStatus,
    worldGenerationError,
    worldGenerationLatency,
    generatedAltText,
    recapperPersona,
    episode,
    session,
    numScenes,
    contentType,
    genre,
    artStyle,
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
    isGeneratingDistribution,
    storyboardScenes,
    storyboardVisuals,
    storyboardVideos,
    storyboardPrompts,
    temperature,
    maxTokens,
    topP,
    topK,
    selectedModel,
    tone,
    audience,
    castData,
    castList,
    castProfiles,
    characterRelationships,
    visualData,
    videoData,
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
    generatedWorldArchitecture, generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems,
    temperature, maxTokens, topP, topK, selectedModel, tone, audience,
    castData, castList, castProfiles, characterRelationships, visualData, videoData,
    activeModelAttempt, fallbackHistory, castDNA, castDynamics, castIntegrity, isAnalyzingCast, generationProgress, numCharacters,
    genre, artStyle, storyboardScenes, storyboardVisuals, storyboardVideos, storyboardPrompts
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
    setGenerationProgress,
    setStoryboardScenes,
    setStoryboardVisuals,
    setStoryboardVideos,
    setStoryboardPrompts,
    showNotification,
    setTemperature,
    setMaxTokens,
    setTopP,
    setTopK,
    setSelectedModel,
    setTone,
    setAudience,
    setGenre,
    setArtStyle,
    setCastData,
    setCastList,
    setCastProfiles,
    setCharacterRelationships,
    setVisualData,
    setVideoData,
    setCastDNA,
    setCastDynamics,
    setCastIntegrity,
    setIsAnalyzingCast,
    stopGeneration,
    getSignal,
    setNumCharacters,
    setGlobalPrompt: setPrompt,
    setGlobalContentType: setContentType,
  }), [
    syncCore, addLog, showNotification, setGeneratedWorldLore, setGeneratedWorldPowers, setGeneratedWorldFactions,
    setGeneratedWorldArchitecture, setGeneratedWorldAtlas, setGeneratedWorldCulture, setGeneratedWorldSystems,
    setPromptLore, setPromptPowers, setPromptFactions, setPromptArchitecture, setPromptAtlas, setPromptCulture, setPromptSystems,
    stopGeneration, getSignal
  ]);

  return (
    <GeneratorStateContext.Provider value={state}>
      <GeneratorDispatchContext.Provider value={dispatch}>
        {children}
      </GeneratorDispatchContext.Provider>
    </GeneratorStateContext.Provider>
  );
}
