import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useDiagnostic } from '../../Diagnostic/context/DiagnosticCommandCenter';
import { worldApi } from '@/services/api/world';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { WorldTab } from '../tabs/WorldTabs';

// --- Sub-Contexts for Individual Models ---

interface ModuleContextType {
  data: any;
  isGenerating: boolean;
  generate: (tuning?: any) => Promise<void>;
  update: (content: string) => void;
  save: () => Promise<void>;
}

const createModuleContext = (name: string) => createContext<ModuleContextType | null>(null);

export const ManifestContext = createModuleContext('Manifest');
export const HistoryContext = createModuleContext('History');
export const FactionsContext = createModuleContext('Factions');
export const PowersContext = createModuleContext('Powers');
export const ArchitectureContext = createModuleContext('Architecture');
export const AtlasContext = createModuleContext('Atlas');
export const CultureContext = createModuleContext('Culture');
export const SystemsContext = createModuleContext('Systems');

// --- Master World Command Center ---

interface WorldMasterContextType {
  activeTab: WorldTab;
  setActiveTab: (tab: WorldTab) => void;
  generateAll: () => Promise<void>;
  isGeneratingAny: boolean;
  progress: number;
}

export const WorldCommandCenterContext = createContext<WorldMasterContextType | null>(null);

export const useWorldCommandCenter = () => {
  const context = useContext(WorldCommandCenterContext);
  if (!context) throw new Error('useWorldCommandCenter must be used within WorldCommandCenterProvider');
  return context;
};

// Hooks for sub-modules
export const useFactions = () => useContext(FactionsContext)!;
export const usePowers = () => useContext(PowersContext)!;
export const useHistory = () => useContext(HistoryContext)!;
export const useManifest = () => useContext(ManifestContext)!;
export const useArchitecture = () => useContext(ArchitectureContext)!;
export const useAtlas = () => useContext(AtlasContext)!;
export const useCulture = () => useContext(CultureContext)!;
export const useSystems = () => useContext(SystemsContext)!;

export const WorldCommandCenterProvider: React.FC<{ children: React.ReactNode, activeTab: WorldTab, setActiveTab: (tab: WorldTab) => void }> = ({ 
  children, 
  activeTab,
  setActiveTab
}) => {
  const { user } = useAuth();
  const { 
    currentScriptId, showNotification,
    generatedWorld, setGeneratedWorld, isGeneratingWorld, setIsGeneratingWorld,
    generatedWorldLore, setGeneratedWorldLore, isGeneratingLore, setIsGeneratingLore,
    generatedWorldFactions, setGeneratedWorldFactions, isGeneratingFactions, setIsGeneratingFactions,
    generatedWorldPowers, setGeneratedWorldPowers, isGeneratingPowers, setIsGeneratingPowers,
    generatedWorldArchitecture, setGeneratedWorldArchitecture, isGeneratingArchitecture, setIsGeneratingArchitecture,
    generatedWorldAtlas, setGeneratedWorldAtlas, isGeneratingAtlas, setIsGeneratingAtlas,
    generatedWorldCulture, setGeneratedWorldCulture, isGeneratingCulture, setIsGeneratingCulture,
    generatedWorldSystems, setGeneratedWorldSystems, isGeneratingSystems, setIsGeneratingSystems,
    syncCore
  } = useGenerator();

  const { updateModuleStatus, updateModuleMetrics } = useDiagnostic();
  const projectId = currentScriptId ? parseInt(currentScriptId) : undefined;

  // --- Individual Module Logic ---

  const createModuleValue = useCallback((
    type: WorldTab,
    data: any,
    setData: (d: any) => void,
    isGenerating: boolean,
    setIsGenerating: (b: boolean) => void,
    api: any
  ): ModuleContextType => ({
    data,
    isGenerating,
    update: (content: string) => setData(content),
    generate: async (tuning?: any) => {
      if (!user?.id || !projectId) {
        showNotification?.('Session context missing.', 'error');
        return;
      }
      setIsGenerating(true);
      updateModuleStatus('world', 'syncing');
      try {
        const start = performance.now();
        const result = await api.generate(user.id, projectId, tuning);
        setData(result.content);
        updateModuleMetrics('world', { loadTime: Math.round(performance.now() - start) });
        updateModuleStatus('world', 'healthy');
        showNotification?.(`${type} synchronized.`, 'success');
      } catch (err: any) {
        updateModuleStatus('world', 'error');
        showNotification?.(`Generation failed: ${err.message}`, 'error');
      } finally {
        setIsGenerating(false);
      }
    },
    save: async () => {
      if (!user?.id || !projectId) return;
      try {
        await api.update(user.id, data, '', projectId);
        showNotification?.(`${type} saved to neural core.`, 'success');
      } catch (err) {
        showNotification?.(`Save failed for ${type}`, 'error');
      }
    }
  }), [user?.id, projectId, showNotification, updateModuleStatus, updateModuleMetrics]);

  const manifestValue = createModuleValue('manifest', generatedWorld, setGeneratedWorld, isGeneratingWorld, setIsGeneratingWorld, worldApi.manifest);
  const historyValue = createModuleValue('history', generatedWorldLore, setGeneratedWorldLore, isGeneratingLore, setIsGeneratingLore, worldApi.history);
  const factionsValue = createModuleValue('factions', generatedWorldFactions, setGeneratedWorldFactions, isGeneratingFactions, setIsGeneratingFactions, worldApi.factions);
  const powersValue = createModuleValue('powers', generatedWorldPowers, setGeneratedWorldPowers, isGeneratingPowers, setIsGeneratingPowers, worldApi.powers);
  const architectureValue = createModuleValue('architecture', generatedWorldArchitecture, setGeneratedWorldArchitecture, isGeneratingArchitecture, setIsGeneratingArchitecture, worldApi.architecture);
  const atlasValue = createModuleValue('atlas', generatedWorldAtlas, setGeneratedWorldAtlas, isGeneratingAtlas, setIsGeneratingAtlas, worldApi.atlas);
  const cultureValue = createModuleValue('culture', generatedWorldCulture, setGeneratedWorldCulture, isGeneratingCulture, setIsGeneratingCulture, worldApi.culture);
  const systemsValue = createModuleValue('systems', generatedWorldSystems, setGeneratedWorldSystems, isGeneratingSystems, setIsGeneratingSystems, worldApi.systems);

  // --- Master Orchestration ---

  const isGeneratingAny = isGeneratingWorld || isGeneratingLore || isGeneratingFactions || isGeneratingPowers || 
                         isGeneratingArchitecture || isGeneratingAtlas || isGeneratingCulture || isGeneratingSystems;

  const finishedCount = [
    generatedWorld, generatedWorldLore, generatedWorldFactions, generatedWorldPowers,
    generatedWorldArchitecture, generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems
  ].filter(Boolean).length;
  
  const progress = (finishedCount / 8) * 100;

  const masterValue: WorldMasterContextType = useMemo(() => ({
    activeTab,
    setActiveTab,
    isGeneratingAny,
    progress,
    generateAll: async () => {
      showNotification?.('Initiating Full World Synthesis...', 'info');
      // Sequential generation for coherence
      await manifestValue.generate();
      await historyValue.generate();
      await factionsValue.generate();
      await powersValue.generate();
      await architectureValue.generate();
      await atlasValue.generate();
      await cultureValue.generate();
      await systemsValue.generate();
      showNotification?.('World Synthesis Complete.', 'success');
    }
  }), [activeTab, setActiveTab, isGeneratingAny, progress, manifestValue, historyValue, factionsValue, powersValue, architectureValue, atlasValue, cultureValue, systemsValue, showNotification]);

  return (
    <WorldCommandCenterContext.Provider value={masterValue}>
      <ManifestContext.Provider value={manifestValue}>
        <HistoryContext.Provider value={historyValue}>
          <FactionsContext.Provider value={factionsValue}>
            <PowersContext.Provider value={powersValue}>
              <ArchitectureContext.Provider value={architectureValue}>
                <AtlasContext.Provider value={atlasValue}>
                  <CultureContext.Provider value={cultureValue}>
                    <SystemsContext.Provider value={systemsValue}>
                      {children}
                    </SystemsContext.Provider>
                  </CultureContext.Provider>
                </AtlasContext.Provider>
              </ArchitectureContext.Provider>
            </PowersContext.Provider>
          </FactionsContext.Provider>
        </HistoryContext.Provider>
      </ManifestContext.Provider>
    </WorldCommandCenterContext.Provider>
  );
};
