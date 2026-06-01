import React, {
  createContext,
  useEffect,
  useState,
  startTransition,
  Suspense,
} from "react";
import {
  Outlet,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGeneratorState, useGeneratorDispatch } from "@/hooks/useGenerator";
import { useAuth } from "@/hooks/useAuth";
import { WorldHeader } from "./components/WorldHeader";
import { WorldToolbar } from "./components/WorldToolbar";
import {
  generateFactionSystem,
  generateLoreHistory,
  generatePowerSystem,
  generateWorld,
  generateArchitecture,
  generateAtlas,
  generateCulture,
  generateSystems,
} from "@/services/api/gemini";
import { WorldTabs, WorldTab } from "./tabs/WorldTabs";
import { StudioTabsProgressBar } from "@/pages/studio/components/studio/layout/StudioTabsProgressBar";

import {
  studioLog,
  reportTabChange,
  reportGeneration,
} from "@/lib/dev-console-logs";
import { StudioLoading } from "../../components/studio/StudioLoading";
import { worldStyles as s } from "./worldStyles";

export const WorldContext = createContext<{
  activeTab: WorldTab;
  setActiveTab: (tab: WorldTab) => void;
}>({
  activeTab: "manifest",
  setActiveTab: () => {},
});

export default function WorldLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as WorldTab) || "manifest";

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
    selectedModel,
    contentType,
    session,
    episode,
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
    generationProgress,
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
    setCharacterData,
    setCharacterList,
    setGeneratedCharacters,
    setCharacterRelationships,
    setCharacterDNA,
    setCharacterDynamics,
    setCharacterIntegrity,
    setGeneratedScript,
    setGeneratedImagePrompts,
    setGeneratedMetadata,
    setIsEditing,
    setGenerationProgress,
  } = useGeneratorDispatch();

  useAuth();

  const projectId = React.useMemo(() => {
    const parsedProjectId = currentScriptId
      ? Number.parseInt(currentScriptId, 10)
      : undefined;
    return Number.isFinite(parsedProjectId) ? parsedProjectId : undefined;
  }, [currentScriptId]);

  const handleSave = async () => {
    await syncCore(projectId);
  };

  // Generate the entire world and all specialized modules (lore, powers, factions, architecture, atlas, culture, systems)
  const handleGenerateAll = async () => {
    if (!prompt.trim()) {
      showNotification?.(
        "Please enter a story prompt first before building your world.",
        "error",
      );
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
    setCharacterData(null);
    setCharacterList([]);
    setGeneratedCharacters(null);
    setCharacterRelationships(null);
    setCharacterDNA(null);
    setCharacterDynamics(null);
    setCharacterIntegrity(null);
    setGeneratedScript(null);
    setGeneratedImagePrompts(null);
    setGeneratedMetadata(null);

    // Helper to run a module generator with its setter and prompt
    const runModule = async (
      name: string,
      generator: (
        p: string,
        m: string,
        c: string,
        base?: string,
      ) => Promise<string>,
      setter: (s: string) => void,
      flagSetter: (b: boolean) => void,
      modulePrompt: string | undefined,
      baseWorld: string | undefined,
    ) => {
      flagSetter(true);
      reportGeneration("WorldLayout", name, "request", "anime");
      try {
        const p = modulePrompt || prompt;
        const res = await generator(p, selectedModel, contentType, baseWorld);
        setter(res as any);
        reportGeneration("WorldLayout", name, "success", "anime", {
          length: res?.length || 0,
        });
        showNotification?.(`${name} generated successfully!`, "success");
      } catch (err: any) {
        reportGeneration("WorldLayout", name, "failure", "anime", err);
        showNotification?.(
          `Failed to generate ${name}: ` + (err?.message || "Unknown"),
          "error",
        );
      } finally {
        flagSetter(false);
      }
    };

    setGenerationProgress(10);
    // Fire all generation processes simultaneously
    await Promise.all([
      // Main Manifest
      (async () => {
        setIsGeneratingWorld(true);
        reportGeneration("WorldLayout", "World Manifest", "request", "anime");
        try {
          const res = await generateWorld(prompt, selectedModel, contentType);
          setGeneratedWorld(res);
          reportGeneration(
            "WorldLayout",
            "World Manifest",
            "success",
            "anime",
            { length: res?.length || 0 },
          );
          showNotification?.("World created successfully!", "success");
        } catch (e: any) {
          reportGeneration(
            "WorldLayout",
            "World Manifest",
            "failure",
            "anime",
            e,
          );
          showNotification?.(
            "Failed to create world: " + (e.message || "Unknown error"),
            "error",
          );
        } finally {
          setIsGeneratingWorld(false);
        }
      })(),

      // Specialized Modules
      runModule(
        "History",
        generateLoreHistory,
        setGeneratedWorldLore,
        setIsGeneratingLore,
        promptLore,
        undefined,
      ),
      runModule(
        "Factions",
        generateFactionSystem,
        setGeneratedWorldFactions,
        setIsGeneratingFactions,
        promptFactions,
        undefined,
      ),
      runModule(
        "Powers",
        generatePowerSystem,
        setGeneratedWorldPowers,
        setIsGeneratingPowers,
        promptPowers,
        undefined,
      ),
      runModule(
        "Architecture",
        generateArchitecture,
        setGeneratedWorldArchitecture,
        setIsGeneratingArchitecture,
        promptArchitecture,
        undefined,
      ),
      runModule(
        "Atlas",
        generateAtlas,
        setGeneratedWorldAtlas,
        setIsGeneratingAtlas,
        promptAtlas,
        undefined,
      ),
      runModule(
        "Culture",
        generateCulture,
        setGeneratedWorldCulture,
        setIsGeneratingCulture,
        promptCulture,
        undefined,
      ),
      runModule(
        "Systems",
        generateSystems,
        setGeneratedWorldSystems,
        setIsGeneratingSystems,
        promptSystems,
        undefined,
      ),
    ]);

    setGenerationProgress(100);
    showNotification?.("Full World Manifest Sequence Complete!", "success");

    // Reset progress after a short delay
    setTimeout(() => setGenerationProgress(0), 3000);
  };

  const handleTabChange = (tab: WorldTab) => {
    setSearchParams({ tab });
  };

  useEffect(() => {
    reportTabChange("WORLD", activeTab, "anime");
  }, [activeTab]);

  useEffect(() => {
    const handleGlobalGenerate = () => {
      studioLog(
        "WorldLayout",
        "Global world generation event received.",
        "anime",
      );
      handleGenerateAll();
    };
    window.addEventListener("studio-generate-world", handleGlobalGenerate);
    return () =>
      window.removeEventListener("studio-generate-world", handleGlobalGenerate);
  }, [handleGenerateAll]);

  const generationStatus = {
    manifest: isGeneratingWorld,
    lore: isGeneratingLore,
    powers: isGeneratingPowers,
    factions: isGeneratingFactions,
    architecture: isGeneratingArchitecture,
    atlas: isGeneratingAtlas,
    culture: isGeneratingCulture,
    systems: isGeneratingSystems,
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
    systems: !!generatedWorldSystems,
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

      <div className={s.tabs.tabsBar}>
        <div className={s.tabs.tabsBarGlow} />
        <div className={s.tabs.tabsBarInner}>
          <WorldTabs
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            loadingStates={generationStatus}
          />
        </div>
        <StudioTabsProgressBar progress={generationProgress} theme="cyan" />
      </div>

      {/* Toolbar Section */}
      {(generatedWorld ||
        generatedWorldLore ||
        generatedWorldPowers ||
        generatedWorldFactions ||
        generatedWorldArchitecture ||
        generatedWorldAtlas ||
        generatedWorldCulture ||
        generatedWorldSystems) && (
        <div className="mb-8 relative z-30">
          <WorldToolbar
            status={generatedWorld ? "active" : "empty"}
            session={session}
            episode={episode}
            content={
              activeTab === "manifest"
                ? generatedWorld
                : activeTab === "lore"
                  ? generatedWorldLore
                  : activeTab === "powers"
                    ? generatedWorldPowers
                    : activeTab === "factions"
                      ? generatedWorldFactions
                      : activeTab === "architecture"
                        ? generatedWorldArchitecture
                        : activeTab === "atlas"
                          ? generatedWorldAtlas
                          : activeTab === "culture"
                            ? generatedWorldCulture
                            : activeTab === "systems"
                              ? generatedWorldSystems
                              : generatedWorld
            }
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
            <Suspense
              fallback={
                <div className="flex-1 flex items-center justify-center p-20">
                  <StudioLoading message="Synchronizing World Node..." />
                </div>
              }
            >
              <WorldContext.Provider
                value={{ activeTab, setActiveTab: handleTabChange }}
              >
                <Outlet
                  context={{ activeTab, setActiveTab: handleTabChange }}
                />
              </WorldContext.Provider>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
