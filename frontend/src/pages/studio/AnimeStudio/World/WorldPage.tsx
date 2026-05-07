import { useGenerator } from '@/hooks/useGenerator';
import { useOutletContext } from 'react-router-dom';
import { WorldEmptyState } from './components/WorldEmptyState';
import { WorldTab } from './tabs/WorldTabs';
import { worldApi } from '@/services/api/world';
import { MOCK_WORLD_DATA } from '@/services/generators/mockData';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { sharedStyles } from '../../components/studio/shared/sharedStyles';
import { ArchitectureTab } from './tabs/ArchitectureTab';
import { AtlasTab } from './tabs/AtlasTab';
import { CultureTab } from './tabs/CultureTab';
import { FactionsTab } from './tabs/FactionsTab';
import { HistoryTab } from './tabs/HistoryTab';
import { ManifestTab } from './tabs/ManifestTab';
import { PowersTab } from './tabs/PowersTab';
import { SystemsTab } from './tabs/SystemsTab';

export function WorldPage() {
  const { user } = useAuth();
  const {
    isEditing,
    generatedWorld,
    generatedWorldLore,
    generatedWorldPowers,
    generatedWorldFactions,
    generatedWorldArchitecture,
    generatedWorldAtlas,
    generatedWorldCulture,
    generatedWorldSystems,
    isGeneratingWorld,
    isGeneratingLore,
    isGeneratingPowers,
    isGeneratingFactions,
    isGeneratingArchitecture,
    isGeneratingAtlas,
    isGeneratingCulture,
    isGeneratingSystems,
    setGeneratedWorld: updateGlobalWorld,
    setGeneratedWorldLore,
    setGeneratedWorldPowers,
    setGeneratedWorldFactions,
    setGeneratedWorldArchitecture,
    setGeneratedWorldAtlas,
    setGeneratedWorldCulture,
    setGeneratedWorldSystems,
    setIsGeneratingLore,
    setIsGeneratingPowers,
    setIsGeneratingFactions,
    setIsGeneratingArchitecture,
    setIsGeneratingAtlas,
    setIsGeneratingCulture,
    setIsGeneratingSystems,
    promptLore,
    promptPowers,
    promptFactions,
    promptArchitecture,
    promptAtlas,
    promptCulture,
    promptSystems,
    setPromptLore,
    setPromptPowers,
    setPromptFactions,
    setPromptArchitecture,
    setPromptAtlas,
    setPromptCulture,
    setPromptSystems,
    currentScriptId,
    showNotification
  } = useGenerator();

  const projectId = currentScriptId ? parseInt(currentScriptId) : undefined;

  const handleLoadDemo = () => {
    updateGlobalWorld(MOCK_WORLD_DATA.manifest);
    setGeneratedWorldLore(MOCK_WORLD_DATA.lore);
    setGeneratedWorldPowers(MOCK_WORLD_DATA.powers);
    setGeneratedWorldFactions(MOCK_WORLD_DATA.factions);
    setGeneratedWorldArchitecture(MOCK_WORLD_DATA.architecture);
    setGeneratedWorldAtlas(MOCK_WORLD_DATA.atlas);
    setGeneratedWorldCulture(MOCK_WORLD_DATA.culture);
    setGeneratedWorldSystems(MOCK_WORLD_DATA.systems);
    showNotification?.('Aetheria world lore loaded successfully.', 'success');
  };

  const { activeTab } = useOutletContext<{ activeTab: WorldTab }>();

  // Modular generation is now handled within the Neural Command Centers

  const renderContent = () => {
    const data: Record<string, string | null> = {
      manifest: generatedWorld,
      history: generatedWorldLore,
      powers: generatedWorldPowers,
      factions: generatedWorldFactions,
      architecture: generatedWorldArchitecture,
      atlas: generatedWorldAtlas,
      culture: generatedWorldCulture,
      systems: generatedWorldSystems
    };

    const isGenerating: Record<string, boolean> = {
      manifest: isGeneratingWorld,
      history: isGeneratingLore,
      powers: isGeneratingPowers,
      factions: isGeneratingFactions,
      architecture: isGeneratingArchitecture,
      atlas: isGeneratingAtlas,
      culture: isGeneratingCulture,
      systems: isGeneratingSystems
    };

    const content = data[activeTab];
    const generating = isGenerating[activeTab] || isGeneratingWorld;

    if (!content && !isEditing) {
      return (
        <WorldEmptyState 
          isGenerating={generating}
          label={activeTab === 'history' ? 'History' : activeTab}
        />
      );
    }

    switch (activeTab) {
      case 'manifest': return <ManifestTab />;
      case 'history': return <HistoryTab />;
      case 'powers': return <PowersTab />;
      case 'factions': return <FactionsTab />;
      case 'architecture': return <ArchitectureTab />;
      case 'atlas': return <AtlasTab />;
      case 'culture': return <CultureTab />;
      case 'systems': return <SystemsTab />;
      default: return null;
    }
  };

  return (
    <div data-testid="marker-world-architecture" className="space-y-8 pb-20">
      <div className={cn(sharedStyles.card, "!p-0 overflow-hidden border-zinc-500/30 bg-zinc-950/90")}>
        <div className="w-full p-8 lg:p-10 max-w-[1400px] mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
