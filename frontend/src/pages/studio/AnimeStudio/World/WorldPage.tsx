import { useGenerator } from '@/hooks/useGenerator';
import { useOutletContext } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { sharedStyles } from '@/pages/studio/components/studio/shared/sharedStyles';
import { ManifestTab } from './tabs/ManifestTab';
import { HistoryTab } from './tabs/HistoryTab';
import { PowersTab } from './tabs/PowersTab';
import { FactionsTab } from './tabs/FactionsTab';
import { ArchitectureTab } from './tabs/ArchitectureTab';
import { AtlasTab } from './tabs/AtlasTab';
import { CultureTab } from './tabs/CultureTab';
import { SystemsTab } from './tabs/SystemsTab';
import { WorldEmptyState } from './components/WorldEmptyState';
import { WorldTab } from './tabs/WorldTabs';
import { Button } from '@/components/ui/button';
import { Zap, History, Users, Sparkles, Building2, Map, Globe, Cpu } from 'lucide-react';
import { worldApi } from '@/services/api/world';
import { MOCK_WORLD_DATA } from '@/services/generators/mockData';
import { useAuth } from '@/hooks/useAuth';

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
    prompt,
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

  const handleGenerateSpecialized = async (type: WorldTab) => {
    if (type === 'manifest') return;
    if (!user?.id) {
      showNotification?.('You must be logged in to generate world content.', 'error');
      return;
    }
    if (!projectId) {
      showNotification?.('Project context required for specialized generation.', 'error');
      return;
    }

    const setters: Record<string, (l: boolean) => void> = {
      lore: setIsGeneratingLore,
      powers: setIsGeneratingPowers,
      factions: setIsGeneratingFactions,
      architecture: setIsGeneratingArchitecture,
      atlas: setIsGeneratingAtlas,
      culture: setIsGeneratingCulture,
      systems: setIsGeneratingSystems
    };

    const status: Record<string, boolean> = {
      lore: isGeneratingLore,
      powers: isGeneratingPowers,
      factions: isGeneratingFactions,
      architecture: isGeneratingArchitecture,
      atlas: isGeneratingAtlas,
      culture: isGeneratingCulture,
      systems: isGeneratingSystems
    };

    const setGenerating = setters[type];
    const isGenerating = status[type];

    if (isGenerating) return;

    setGenerating(true);
    console.log(`[WorldPage] Requesting modular generation for: ${type.toUpperCase()}...`);
    try {
      let result: any;
      if (type === 'lore') {
        result = await worldApi.history.generate(user.id, projectId);
        setGeneratedWorldLore(result.content);
      } else if (type === 'powers') {
        result = await worldApi.powers.generate(user.id, projectId);
        setGeneratedWorldPowers(result.content);
      } else if (type === 'factions') {
        result = await worldApi.factions.generate(user.id, projectId);
        setGeneratedWorldFactions(result.content);
      } else if (type === 'architecture') {
        result = await worldApi.architecture.generate(user.id, projectId);
        setGeneratedWorldArchitecture(result.content);
      } else if (type === 'atlas') {
        result = await worldApi.atlas.generate(user.id, projectId);
        setGeneratedWorldAtlas(result.content);
      } else if (type === 'culture') {
        result = await worldApi.culture.generate(user.id, projectId);
        setGeneratedWorldCulture(result.content);
      } else if (type === 'systems') {
        result = await worldApi.systems.generate(user.id, projectId);
        setGeneratedWorldSystems(result.content);
      }
      showNotification?.(`${type.charAt(0).toUpperCase() + type.slice(1)} generated successfully!`, 'success');
    } catch (e: any) {
      console.error(`[WorldPage] Failed to generate ${type}:`, e);
      showNotification?.(`Failed to generate ${type}: ` + e.message, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const renderSpecializedEmpty = (type: Exclude<WorldTab, 'manifest'>) => {
    const config = {
      lore: { icon: History, label: 'Historical Timeline', color: 'text-fuchsia-400', desc: 'Expand your world\'s history with eras and legendary events.' },
      powers: { icon: Zap, label: 'Power System', color: 'text-amber-400', desc: 'Define mechanics, tiers, and limitations of your world\'s powers.' },
      factions: { icon: Users, label: 'Faction Politics', color: 'text-blue-400', desc: 'Create complex relationships between world factions and ideologies.' },
      architecture: { icon: Building2, label: 'Visual Style', color: 'text-orange-400', desc: 'Define the architectural aesthetic and visual motifs of your world.' },
      atlas: { icon: Map, label: 'World Atlas', color: 'text-cyan-400', desc: 'Map out the physical geography, biomes, and regional boundaries.' },
      culture: { icon: Globe, label: 'Societal Ethos', color: 'text-rose-400', desc: 'Profile the rituals, daily life, and cultural traditions of your people.' },
      systems: { icon: Cpu, label: 'World Dynamics', color: 'text-emerald-400', desc: 'Define ecosystems, signature technology, and mechanical systems.' }
    }[type];

    const status: Record<string, boolean> = {
      lore: isGeneratingLore,
      powers: isGeneratingPowers,
      factions: isGeneratingFactions,
      architecture: isGeneratingArchitecture,
      atlas: isGeneratingAtlas,
      culture: isGeneratingCulture,
      systems: isGeneratingSystems
    };

    const isGenerating = status[type];

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
        <div className={`p-4 rounded-full bg-white/5 border border-white/10 ${config.color}`}>
          <config.icon className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-lg font-black text-white uppercase tracking-tight">{config.label}</h3>
          <p className="text-xs text-zinc-500 leading-relaxed uppercase font-bold tracking-widest">{config.desc}</p>
        </div>
        <Button
          onClick={() => handleGenerateSpecialized(type)}
          disabled={isGenerating}
          className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 py-6 h-auto font-black uppercase tracking-widest text-[10px] gap-2 group transition-all"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
          )}
          Generate {type} Manifest
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    if (isGeneratingWorld && !generatedWorld) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] space-y-8">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-studio/20 border-t-studio rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
            <div className="absolute inset-0 m-auto w-2 h-2 bg-studio rounded-full animate-ping" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-black tracking-[0.3em] text-[10px] uppercase text-studio animate-pulse">Building your world's foundation...</p>
            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Creating history, geography, and lore</p>
          </div>
        </div>
      );
    }

    if (!generatedWorld) {
      return (
        <WorldEmptyState
          onLaunch={() => {
            window.dispatchEvent(new CustomEvent('studio-generate-world'));
          }}
          onLoadDemo={handleLoadDemo}
          isGenerating={isGeneratingWorld}
        />
      );
    }

    switch (activeTab) {
      case 'manifest':
        return (
          <ManifestTab
            isEditing={isEditing}
            content={generatedWorld || ''}
            onContentChange={(val: string) => updateGlobalWorld(val)}
            onGenerate={() => window.dispatchEvent(new CustomEvent('studio-generate-world'))}
            isGenerating={isGeneratingWorld}
          />
        );
      case 'lore':
        return generatedWorldLore ? (
          <HistoryTab
            isEditing={isEditing}
            content={generatedWorldLore}
            onContentChange={(val: string) => setGeneratedWorldLore(val)}
            onGenerate={() => handleGenerateSpecialized('lore')}
            isGenerating={isGeneratingLore}
            prompt={promptLore}
            onPromptChange={setPromptLore}
          />
        ) : renderSpecializedEmpty('lore');
      case 'powers':
        return generatedWorldPowers ? (
          <PowersTab
            isEditing={isEditing}
            content={generatedWorldPowers}
            onContentChange={(val: string) => setGeneratedWorldPowers(val)}
            onGenerate={() => handleGenerateSpecialized('powers')}
            isGenerating={isGeneratingPowers}
            prompt={promptPowers}
            onPromptChange={setPromptPowers}
          />
        ) : renderSpecializedEmpty('powers');
      case 'factions':
        return generatedWorldFactions ? (
          <FactionsTab
            isEditing={isEditing}
            content={generatedWorldFactions}
            onContentChange={(val: string) => setGeneratedWorldFactions(val)}
            onGenerate={() => handleGenerateSpecialized('factions')}
            isGenerating={isGeneratingFactions}
            prompt={promptFactions}
            onPromptChange={setPromptFactions}
          />
        ) : renderSpecializedEmpty('factions');
      case 'architecture':
        return generatedWorldArchitecture ? (
          <ArchitectureTab
            isEditing={isEditing}
            content={generatedWorldArchitecture}
            onContentChange={(val: string) => setGeneratedWorldArchitecture(val)}
            onGenerate={() => handleGenerateSpecialized('architecture')}
            isGenerating={isGeneratingArchitecture}
            prompt={promptArchitecture}
            onPromptChange={setPromptArchitecture}
          />
        ) : renderSpecializedEmpty('architecture');
      case 'atlas':
        return generatedWorldAtlas ? (
          <AtlasTab
            isEditing={isEditing}
            content={generatedWorldAtlas}
            onContentChange={(val: string) => setGeneratedWorldAtlas(val)}
            onGenerate={() => handleGenerateSpecialized('atlas')}
            isGenerating={isGeneratingAtlas}
            prompt={promptAtlas}
            onPromptChange={setPromptAtlas}
          />
        ) : renderSpecializedEmpty('atlas');
      case 'culture':
        return generatedWorldCulture ? (
          <CultureTab
            isEditing={isEditing}
            content={generatedWorldCulture}
            onContentChange={(val: string) => setGeneratedWorldCulture(val)}
            onGenerate={() => handleGenerateSpecialized('culture')}
            isGenerating={isGeneratingCulture}
            prompt={promptCulture}
            onPromptChange={setPromptCulture}
          />
        ) : renderSpecializedEmpty('culture');
      case 'systems':
        return generatedWorldSystems ? (
          <SystemsTab
            isEditing={isEditing}
            content={generatedWorldSystems}
            onContentChange={(val: string) => setGeneratedWorldSystems(val)}
            onGenerate={() => handleGenerateSpecialized('systems')}
            isGenerating={isGeneratingSystems}
            prompt={promptSystems}
            onPromptChange={setPromptSystems}
          />
        ) : renderSpecializedEmpty('systems');
      default:
        return null;
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
