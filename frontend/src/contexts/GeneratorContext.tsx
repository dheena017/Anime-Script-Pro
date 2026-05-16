import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ProductionUnit } from '@/lib/sequence-utils';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { WorldLore } from '../services/api/world';
import { useLogDispatch } from './LogContext';
import {
  useGeneratorProgressEffect,
  useResolveProjectId,
  useGeneratorSaveCore,
  useGeneratorTelemetryEffects,
} from './generator/useGeneratorLifecycle';
import { AI_EVENTS } from '../services/generators/core';
// ── Stable context refs ── must be imported at the top of the file, not mid-module ──
import { GeneratorStateContext, GeneratorDispatchContext } from './GeneratorContextRefs';
import { 
  MOCK_STORY_BIBLE, 
  MOCK_WORLD_DATA, 
  MOCK_CAST_DATA, 
  MOCK_SERIES_PLAN, 
  MOCK_SCRIPT 
} from '../services/generators/mockData';


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
  numEpisodes: number;
  isIntelligenceOpen: boolean;
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
  syncCore: (projectId?: number, projectName?: string) => Promise<number | undefined>;
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
  setNumEpisodes: (n: number) => void;
  saveLocalSession: () => void;
  loadLocalSession: () => void;
  loadDemoProject: () => void;
  setIsIntelligenceOpen: (isOpen: boolean) => void;
}

// Re-export so other modules can still do:
//   import { GeneratorStateContext } from '@/contexts/GeneratorContext'
export { GeneratorStateContext, GeneratorDispatchContext };

export function GeneratorProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const location = useLocation();
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
  const [currentScriptId, setCurrentScriptId] = useState<string | null>(null);
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
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);

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

  const getSignal = useCallback(() => {
    if (abortController.signal.aborted) {
      const newController = new AbortController();
      setAbortController(newController);
      return newController.signal;
    }
    return abortController.signal;
  }, [abortController]);

  const showNotification = useCallback((message: string, type?: 'error' | 'success' | 'info') => {
    rawShowNotification(message, type);
  }, [rawShowNotification]);

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
  }, [abortController, showNotification]);

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
  const [numEpisodes, setNumEpisodes] = useState<number>(12);

  const resolveProjectId = useResolveProjectId(currentScriptId);

  const { addLog } = useLogDispatch();

  const syncCore = useGeneratorSaveCore({
    userId: user?.id,
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
  });

  const saveLocalSession = useCallback(() => {
    const data = {
      prompt,
      generatedWorld,
      generatedCharacters,
      generatedSeriesPlan,
    };
    localStorage.setItem('anime_manual_save', JSON.stringify(data));
    showNotification('Local session saved!', 'success');
  }, [prompt, generatedWorld, generatedCharacters, generatedSeriesPlan, showNotification]);

  const loadLocalSession = useCallback(() => {
    const saved = localStorage.getItem('anime_manual_save');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.prompt !== undefined) setPrompt(data.prompt);
        if (data.generatedWorld !== undefined) setGeneratedWorld(data.generatedWorld);
        if (data.generatedCharacters !== undefined) setGeneratedCharacters(data.generatedCharacters);
        if (data.generatedSeriesPlan !== undefined) setGeneratedSeriesPlan(data.generatedSeriesPlan);
        showNotification('Local session loaded!', 'success');
      } catch (e) {
        console.error('Failed to parse local session', e);
        showNotification('Failed to load local session', 'error');
      }
    } else {
      showNotification('No local session found', 'info');
    }
  }, [setPrompt, setGeneratedWorld, setGeneratedCharacters, setGeneratedSeriesPlan, showNotification]);

  const loadDemoProject = useCallback(() => {
    setPrompt(MOCK_STORY_BIBLE.logline);
    
    // World Data
    setGeneratedWorld(MOCK_WORLD_DATA.manifest);
    setGeneratedWorldLore(MOCK_WORLD_DATA.lore);
    setGeneratedWorldPowers(MOCK_WORLD_DATA.powers);
    setGeneratedWorldFactions(MOCK_WORLD_DATA.factions);
    setGeneratedWorldArchitecture(MOCK_WORLD_DATA.architecture);
    setGeneratedWorldAtlas(MOCK_WORLD_DATA.atlas);
    setGeneratedWorldCulture(MOCK_WORLD_DATA.culture);
    setGeneratedWorldSystems(MOCK_WORLD_DATA.systems);
    
    // Cast Data
    setCastData(MOCK_CAST_DATA);
    setGeneratedCharacters(MOCK_CAST_DATA.markdown);
    setCastList(MOCK_CAST_DATA.characters);
    if (MOCK_CAST_DATA.relationships) {
      setCharacterRelationships(JSON.stringify(MOCK_CAST_DATA.relationships));
    }
    
    // Series & Script
    setGeneratedSeriesPlan(MOCK_SERIES_PLAN);
    setGeneratedScript(MOCK_SCRIPT);
    
    showNotification('Demo project loaded! Welcome to Aetheria.', 'success');
  }, [
    setPrompt, 
    setGeneratedWorld, 
    setGeneratedWorldLore, 
    setGeneratedWorldPowers, 
    setGeneratedWorldFactions, 
    setGeneratedWorldArchitecture, 
    setGeneratedWorldAtlas, 
    setGeneratedWorldCulture, 
    setGeneratedWorldSystems, 
    setCastData,
    setGeneratedCharacters, 
    setCastList, 
    setCharacterRelationships,
    setGeneratedSeriesPlan, 
    setGeneratedScript, 
    showNotification
  ]);

  useGeneratorTelemetryEffects({
    userId: user?.id,
    addLog,
    setActiveModelAttempt,
    setFallbackHistory,
  });

  useGeneratorProgressEffect({
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
  });

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
    numEpisodes,
    isIntelligenceOpen,
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
    history: [],
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
    generatedWorldLore, generatedWorldPowers, generatedWorldFactions, generatedWorldArchitecture, 
    generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems,
    worldGenerationStatus, worldGenerationError, worldGenerationLatency, generatedAltText,
    recapperPersona, episode, session, numScenes, contentType, 
    isLoading, isGeneratingCharacters, isGeneratingMetadata, isGeneratingImagePrompts,
    isGeneratingSeries, isGeneratingDescription, isGeneratingWorld, 
    isGeneratingLore, isGeneratingPowers, isGeneratingFactions, 
    isGeneratingArchitecture, isGeneratingAtlas, isGeneratingCulture, isGeneratingSystems,
    isEditing, isSaving,
    isContinuingScript, isGeneratingVisuals, isGeneratingAltText, currentScriptId, 
    activeModelAttempt, fallbackHistory, castDNA, castDynamics, castIntegrity, isAnalyzingCast, generationProgress, numCharacters,
    genre, artStyle, storyboardScenes, storyboardVisuals, storyboardVideos, storyboardPrompts, isIntelligenceOpen
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
    setIsIntelligenceOpen,
    stopGeneration,
    getSignal,
    setNumCharacters,
    setNumEpisodes,
    saveLocalSession,
    loadLocalSession,
    loadDemoProject,
    setGlobalPrompt: setPrompt,
    setGlobalContentType: setContentType,
  }), [
    syncCore, addLog, showNotification, setGeneratedWorldLore, setGeneratedWorldPowers, setGeneratedWorldFactions,
    setGeneratedWorldArchitecture, setGeneratedWorldAtlas, setGeneratedWorldCulture, setGeneratedWorldSystems,
    setPromptLore, setPromptPowers, setPromptFactions, setPromptArchitecture, setPromptAtlas, setPromptCulture, setPromptSystems,
    stopGeneration, getSignal, saveLocalSession, loadLocalSession, loadDemoProject
  ]);

  return (
    <GeneratorStateContext.Provider value={state}>
      <GeneratorDispatchContext.Provider value={dispatch}>
        {children}
      </GeneratorDispatchContext.Provider>
    </GeneratorStateContext.Provider>
  );
}
