import { createContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useGenerator } from '@/hooks/useGenerator';
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
import { WorldTab } from './tabs/WorldTabs';
import './worldStyles/World.css';

export const WorldContext = createContext<{
  activeTab: WorldTab;
  setActiveTab: (tab: WorldTab) => void;
}>({
  activeTab: 'manifest',
  setActiveTab: () => { },
});

export default function WorldLayout() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<WorldTab>('manifest');

  const {
    isGeneratingWorld, setIsGeneratingWorld,
    isGeneratingLore, setIsGeneratingLore,
    isGeneratingPowers, setIsGeneratingPowers,
    isGeneratingFactions, setIsGeneratingFactions,
    isGeneratingArchitecture, setIsGeneratingArchitecture,
    isGeneratingAtlas, setIsGeneratingAtlas,
    isGeneratingCulture, setIsGeneratingCulture,
    isGeneratingSystems, setIsGeneratingSystems,
    prompt, 
    promptLore, 
    promptPowers, 
    promptFactions, 
    promptArchitecture, 
    promptAtlas, 
    promptCulture, 
    promptSystems,
    selectedModel, contentType,
    setGeneratedWorld,
    setGeneratedWorldLore,
    setGeneratedWorldPowers,
    setGeneratedWorldFactions,
    setGeneratedWorldArchitecture,
    setGeneratedWorldAtlas,
    setGeneratedWorldCulture,
    setGeneratedWorldSystems,
    session, episode, showNotification,
    generatedWorld,
    isSaving,
    syncCore
  } = useGenerator();

  useAuth();

  const handleSave = async () => {
    await syncCore();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Please enter a story prompt first before building your world.', 'error');
      return;
    }

    if (activeTab === 'manifest') {
      setIsGeneratingWorld(true);
      try {
        const result = await generateWorld(prompt, selectedModel, contentType);
        setGeneratedWorld(result);
        showNotification?.('World created successfully!', 'success');
      } catch (e: any) {
        console.error(e);
        showNotification?.('Failed to create world: ' + (e.message || 'Unknown error'), 'error');
      } finally {
        setIsGeneratingWorld(false);
      }
    } else {
      // Specialized generation
      const type = activeTab;
      const setters: Record<string, (l: boolean) => void> = {
        lore: setIsGeneratingLore,
        powers: setIsGeneratingPowers,
        factions: setIsGeneratingFactions,
        architecture: setIsGeneratingArchitecture,
        atlas: setIsGeneratingAtlas,
        culture: setIsGeneratingCulture,
        systems: setIsGeneratingSystems
      };
      
      const modulePrompts: Record<string, string> = {
        lore: promptLore,
        powers: promptPowers,
        factions: promptFactions,
        architecture: promptArchitecture,
        atlas: promptAtlas,
        culture: promptCulture,
        systems: promptSystems
      };

      const activePrompt = modulePrompts[type] || prompt;
      const setGenerating = setters[type];
      
      setGenerating(true);
      try {
        let result = '';
        if (type === 'lore') {
          result = await generateLoreHistory(activePrompt, selectedModel, contentType, generatedWorld || undefined);
          setGeneratedWorldLore(result);
        } else if (type === 'powers') {
          result = await generatePowerSystem(activePrompt, selectedModel, contentType, generatedWorld || undefined);
          setGeneratedWorldPowers(result);
        } else if (type === 'factions') {
          result = await generateFactionSystem(activePrompt, selectedModel, contentType, generatedWorld || undefined);
          setGeneratedWorldFactions(result);
        } else if (type === 'architecture') {
          result = await generateArchitecture(activePrompt, selectedModel, contentType, generatedWorld || undefined);
          setGeneratedWorldArchitecture(result);
        } else if (type === 'atlas') {
          result = await generateAtlas(activePrompt, selectedModel, contentType, generatedWorld || undefined);
          setGeneratedWorldAtlas(result);
        } else if (type === 'culture') {
          result = await generateCulture(activePrompt, selectedModel, contentType, generatedWorld || undefined);
          setGeneratedWorldCulture(result);
        } else if (type === 'systems') {
          result = await generateSystems(activePrompt, selectedModel, contentType, generatedWorld || undefined);
          setGeneratedWorldSystems(result);
        }
        showNotification?.(`${type.charAt(0).toUpperCase() + type.slice(1)} generated successfully!`, 'success');
      } catch (e: any) {
        showNotification?.(`Failed to generate ${type}: ` + e.message, 'error');
      } finally {
        setGenerating(false);
      }
    }
  };

  const handleTabChange = (tab: WorldTab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const handleGlobalGenerate = () => handleGenerate();
    window.addEventListener('studio-generate-world', handleGlobalGenerate);
    return () => window.removeEventListener('studio-generate-world', handleGlobalGenerate);
  }, [handleGenerate]);

  const generationStatus: Record<string, boolean> = {
    manifest: isGeneratingWorld,
    lore: isGeneratingLore,
    powers: isGeneratingPowers,
    factions: isGeneratingFactions,
    architecture: isGeneratingArchitecture,
    atlas: isGeneratingAtlas,
    culture: isGeneratingCulture,
    systems: isGeneratingSystems
  };

  const currentIsGenerating = generationStatus[activeTab];

  return (
    <div className="space-y-6">
      <div className="studio-module-header">
        <WorldHeader
          isGenerating={currentIsGenerating}
          onRegenerate={handleGenerate}
          prompt={prompt}
          session={session}
          episode={episode}
          onPrev={() => navigate('/anime/engine')}
          onNext={() => navigate('/anime/cast')}
          onSave={handleSave}
          isSaving={isSaving}
          hasContent={!!generatedWorld}
        />
      </div>

      <div className="studio-module-toolbar flex items-center justify-center p-2 bg-[#050505]/90 border border-white/5 rounded-xl mb-8">
        <WorldToolbar
          status={generatedWorld ? 'active' : 'empty'}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          session={session}
          episode={episode}
          content={generatedWorld}
        />
      </div>

      <WorldContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
        <Outlet context={{ activeTab, setActiveTab: handleTabChange }} />
      </WorldContext.Provider>
    </div>
  );
}
