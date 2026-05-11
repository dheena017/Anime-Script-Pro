import React, { createContext, useEffect, useState, startTransition, Suspense } from 'react';
import { Outlet, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { WorldHeader } from './components/WorldHeader';
import { WorldToolbar } from './components/WorldToolbar';
import { 
  generateFactionSystem, 
  generateLoreHistory, 
  generatePowerSystem, 
  generateWorld,
  generateArchitecture,
  generateAtlas,
  generateCulture,
  generateSystems
} from '@/services/api/gemini';
import { WorldTabs, WorldTab } from './tabs/WorldTabs';
import { StudioTabsProgressBar } from '@/pages/studio/components/studio/layout/StudioTabsProgressBar';

import { studioLog, reportTabChange, reportGeneration } from '@/lib/studio-logger';
import { StudioLoading } from '../../components/studio/StudioLoading';

export const WorldContext = createContext<{
  activeTab: WorldTab;
  setActiveTab: (tab: WorldTab) => void;
}>({
  activeTab: 'manifest',
  setActiveTab: () => { },
});

export default function WorldLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as WorldTab) || 'manifest';

  const {
    isGeneratingWorld,
    isGeneratingLore,
    isGeneratingPowers,
    isGeneratingFactions,
    isGeneratingArchitecture,
    isGeneratingAtlas,
    isGeneratingCulture,
    isGeneratingSystems,
    prompt, 
    promptLore, 
    promptPowers, 
    promptFactions, 
    promptArchitecture, 
    promptAtlas, 
    promptCulture, 
    promptSystems,
    selectedModel, contentType,
    session, episode,
    generatedWorld,
    generatedWorldLore,
    generatedWorldPowers,
    generatedWorldFactions,
    generatedWorldArchitecture,
    generatedWorldAtlas,
    generatedWorldCulture,
    generatedWorldSystems,
    isSaving,
    currentScriptId,
    isEditing,
    generationProgress
  } = useGeneratorState();

  const {
    setIsGeneratingWorld,
    setIsGeneratingLore,
    setIsGeneratingPowers,
    setIsGeneratingFactions,
    setIsGeneratingArchitecture,
    setIsGeneratingAtlas,
    setIsGeneratingCulture,
    setIsGeneratingSystems,
    setGeneratedWorld,
    setGeneratedWorldLore,
    setGeneratedWorldPowers,
    setGeneratedWorldFactions,
    setGeneratedWorldArchitecture,
    setGeneratedWorldAtlas,
    setGeneratedWorldCulture,
    setGeneratedWorldSystems,
    showNotification,
    syncCore,
    setCastData,
    setCastList,
    setGeneratedCharacters,
    setCharacterRelationships,
    setCastDNA,
    setCastDynamics,
    setCastIntegrity,
    setGeneratedScript,
    setGeneratedImagePrompts,
    setGeneratedMetadata,
    setIsEditing,
    setGenerationProgress
  } = useGeneratorDispatch();

  useAuth();

  const projectId = React.useMemo(() => {
    const parsedProjectId = currentScriptId ? Number.parseInt(currentScriptId, 10) : undefined;
    return Number.isFinite(parsedProjectId) ? parsedProjectId : undefined;
  }, [currentScriptId]);

  const handleSave = async () => {
    await syncCore(projectId);
  };

  // Generate the entire world and all specialized modules (lore, powers, factions, architecture, atlas, culture, systems)
  const handleGenerateAll = async () => {
    if (!prompt.trim()) {
      showNotification?.('Please enter a story prompt first before building your world.', 'error');
      return;
    }

    // Clear existing data to show empty states for pending tabs
    setGeneratedWorld(null);
    setGeneratedWorldLore(null);
    setGeneratedWorldPowers(null);
    setGeneratedWorldFactions(null);
    setGeneratedWorldArchitecture(null);
    setGeneratedWorldAtlas(null);
    setGeneratedWorldCulture(null);
    setGeneratedWorldSystems(null);

    // Clear downstream dependencies
    setCastData(null);
    setCastList([]);
    setGeneratedCharacters(null);
    setCharacterRelationships(null);
    setCastDNA(null);
    setCastDynamics(null);
    setCastIntegrity(null);
    setGeneratedScript(null);
    setGeneratedImagePrompts(null);
    setGeneratedMetadata(null);

    // Helper to run a module generator with its setter and prompt
    const runModule = async (
      name: string,
      generator: (p: string, m: string, c: string, base?: string) => Promise<string>,
      setter: (s: string) => void,
      flagSetter: (b: boolean) => void,
      modulePrompt: string | undefined
    ) => {
      flagSetter(true);
      reportGeneration('WorldLayout', name, 'request', 'anime');
      try {
        const p = modulePrompt || prompt;
        const res = await generator(p, selectedModel, contentType, generatedWorld || undefined);
        setter(res as any);
        reportGeneration('WorldLayout', name, 'success', 'anime', { length: res?.length || 0 });
        showNotification?.(`${name} generated successfully!`, 'success');
      } catch (err: any) {
        reportGeneration('WorldLayout', name, 'failure', 'anime', err);
        showNotification?.(`Failed to generate ${name}: ` + (err?.message || 'Unknown'), 'error');
      } finally {
        flagSetter(false);
      }
    };

    // Generate manifest/world
    setGenerationProgress(5);
    setSearchParams({ tab: 'manifest' });
    setIsGeneratingWorld(true);
    reportGeneration('WorldLayout', 'World Manifest', 'request', 'anime');
    try {
      const world = await generateWorld(prompt, selectedModel, contentType);
      setGeneratedWorld(world);
      setGenerationProgress(15);
      reportGeneration('WorldLayout', 'World Manifest', 'success', 'anime', { length: world?.length || 0 });
      showNotification?.('World created successfully!', 'success');
    } catch (e: any) {
      reportGeneration('WorldLayout', 'World Manifest', 'failure', 'anime', e);
      showNotification?.('Failed to create world: ' + (e.message || 'Unknown error'), 'error');
    } finally {
      setIsGeneratingWorld(false);
    }
    await new Promise(r => setTimeout(r, 2000));

    // Run specialized modules sequentially with auto-tab flow
    setSearchParams({ tab: 'lore' });
    await runModule('History', generateLoreHistory, setGeneratedWorldLore, setIsGeneratingLore, promptLore);
    setGenerationProgress(30);
    await new Promise(r => setTimeout(r, 2000));
    
    setSearchParams({ tab: 'factions' });
    await runModule('Factions', generateFactionSystem, setGeneratedWorldFactions, setIsGeneratingFactions, promptFactions);
    setGenerationProgress(45);
    await new Promise(r => setTimeout(r, 2000));

    setSearchParams({ tab: 'powers' });
    await runModule('Powers', generatePowerSystem, setGeneratedWorldPowers, setIsGeneratingPowers, promptPowers);
    setGenerationProgress(60);
    await new Promise(r => setTimeout(r, 2000));
    
    setSearchParams({ tab: 'architecture' });
    await runModule('Architecture', generateArchitecture, setGeneratedWorldArchitecture, setIsGeneratingArchitecture, promptArchitecture);
    setGenerationProgress(70);
    await new Promise(r => setTimeout(r, 2000));
    
    setSearchParams({ tab: 'atlas' });
    await runModule('Atlas', generateAtlas, setGeneratedWorldAtlas, setIsGeneratingAtlas, promptAtlas);
    setGenerationProgress(80);
    await new Promise(r => setTimeout(r, 2000));
    
    setSearchParams({ tab: 'culture' });
    await runModule('Culture', generateCulture, setGeneratedWorldCulture, setIsGeneratingCulture, promptCulture);
    setGenerationProgress(90);
    await new Promise(r => setTimeout(r, 2000));
    
    setSearchParams({ tab: 'systems' });
    await runModule('Systems', generateSystems, setGeneratedWorldSystems, setIsGeneratingSystems, promptSystems);
    setGenerationProgress(100);
    await new Promise(r => setTimeout(r, 2000));

    showNotification?.('Full World Manifest Sequence Complete!', 'success');
    setSearchParams({ tab: 'manifest' });
    // Reset progress after a short delay
    setTimeout(() => setGenerationProgress(0), 3000);
  };

  const handleTabChange = (tab: WorldTab) => {
    setSearchParams({ tab });
  };

  useEffect(() => {
    reportTabChange('WorldLayout', activeTab, 'anime');
  }, [activeTab]);

  useEffect(() => {
    const handleGlobalGenerate = () => {
      studioLog('WorldLayout', 'Global world generation event received.', 'anime');
      handleGenerateAll();
    };
    window.addEventListener('studio-generate-world', handleGlobalGenerate);
    return () => window.removeEventListener('studio-generate-world', handleGlobalGenerate);
  }, [handleGenerateAll]);

  const generationStatus = {
    manifest: isGeneratingWorld,
    lore: isGeneratingLore,
    powers: isGeneratingPowers,
    factions: isGeneratingFactions,
    architecture: isGeneratingArchitecture,
    atlas: isGeneratingAtlas,
    culture: isGeneratingCulture,
    systems: isGeneratingSystems
  };

  const currentIsGenerating = (generationStatus as any)[activeTab];
  const isGeneratingAny = Object.values(generationStatus).some(Boolean);

  const hasData = {
    manifest: !!generatedWorld,
    lore: !!generatedWorldLore,
    powers: !!generatedWorldPowers,
    factions: !!generatedWorldFactions,
    architecture: !!generatedWorldArchitecture,
    atlas: !!generatedWorldAtlas,
    culture: !!generatedWorldCulture,
    systems: !!generatedWorldSystems
  };
  const hasCurrentData = (hasData as any)[activeTab];

  return (
    <div className="space-y-6">
      <div className="studio-module-header">
        <WorldHeader
          isGenerating={isGeneratingAny}
          onRegenerate={handleGenerateAll}
          prompt={prompt}
          session={session}
          episode={episode}
          onPrev={() => {
            startTransition(() => {
              navigate(`/studio/engine`);
            });
          }}
          onNext={() => {
            startTransition(() => {
              navigate(`/studio/cast`);
            });
          }}
          onSave={handleSave}
          isSaving={isSaving}
          hasContent={!!generatedWorld}
        />
      </div>

      <div className="studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10 w-full flex justify-center">
          <WorldTabs activeTab={activeTab} setActiveTab={handleTabChange} loadingStates={generationStatus} />
        </div>
        <StudioTabsProgressBar progress={generationProgress} theme="cyan" />
      </div>

      {/* Toolbar Section */}
      {(generatedWorld || generatedWorldLore || generatedWorldPowers || generatedWorldFactions || generatedWorldArchitecture || generatedWorldAtlas || generatedWorldCulture || generatedWorldSystems) && (
        <div className="mb-8 relative z-30">
          <WorldToolbar
            status={generatedWorld ? 'active' : 'empty'}
            session={session}
            episode={episode}
            content={activeTab === 'manifest' ? generatedWorld :
              activeTab === 'lore' ? generatedWorldLore :
                activeTab === 'powers' ? generatedWorldPowers :
                  activeTab === 'factions' ? generatedWorldFactions :
                    activeTab === 'architecture' ? generatedWorldArchitecture :
                      activeTab === 'atlas' ? generatedWorldAtlas :
                        activeTab === 'culture' ? generatedWorldCulture :
                          activeTab === 'systems' ? generatedWorldSystems :
                            generatedWorld}
            isEditing={isEditing}
            onEditingChange={setIsEditing}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname + location.search}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20"><StudioLoading message="Synchronizing World Node..." /></div>}>
              <WorldContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
                <Outlet context={{ activeTab, setActiveTab: handleTabChange }} />
              </WorldContext.Provider>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
