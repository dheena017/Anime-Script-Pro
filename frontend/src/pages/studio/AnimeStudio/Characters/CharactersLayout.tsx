import React, { startTransition, Suspense } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGeneratorState, useGeneratorDispatch } from "@/hooks/useGenerator";
import { useAuth } from "@/hooks/useAuth";
import { useApp } from "@/contexts/AppContext";
import { CharacterHeader } from "./components/CharacterHeader";
import { CharacterEmptyState } from "./components/CharacterEmptyState";
import { CharacterToolbar, CharacterTab } from "./components/CharacterToolbar";
import { CharacterTabs } from "./Tabs/CharacterTabs";
import { AddLeadTab } from "./Tabs/AddLeadTab";
import { IntegrityTab } from "./Tabs/IntegrityTab";
import { VoiceTab } from "./Tabs/VoiceTab";
import { CombatTab } from "./Tabs/CombatTab";
import { ArcsTab } from "./Tabs/ArcsTab";
import { DynamicsTab } from "./Tabs/DynamicsTab";
import RelationshipsPage from "./Tabs/RelationshipsPage";
import CharactersPage from "./Tabs/CharactersPage";
import { TechnicalTab } from "./Tabs/TechnicalTab";
import { useStudioBasePath } from "@/hooks/useStudioBasePath";
import {
  generateCharacters,
  generateSceneImage,
} from "../../../../services/api/gemini";
import { CharactersLoadingPage } from "./CharactersLoadingPage";
import { MOCK_CAST_DATA } from "@/services/generators/mockData";
import {
  studioLog,
  reportTabChange,
  reportGeneration,
} from "@/lib/dev-console-logs";
import { StudioTabsProgressBar } from "@/pages/studio/components/studio/layout/StudioTabsProgressBar";

export const CharacterPageContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
  handleLoadDemo?: () => void;
  viewMode?: "grid" | "list";
  setViewMode?: (mode: "grid" | "list") => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}>({ setHandlers: () => { } });

export const CharacterTabActionsContext = React.createContext<{
  isAnalyzingCharacters?: boolean;
  handleGenerateCharacter?: () => Promise<any>;
  handleGenerateDNA?: () => Promise<any>;
  handleGenerateDynamics?: () => Promise<any>;
  handleGenerateIntegrity?: () => Promise<any>;
  handleSynthesizeSocialWeb?: () => Promise<void>;
  isGeneratingRelationships?: boolean;
}>({});

import { characterStyles as s } from "./characterStyles";

export default function CharactersLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = useStudioBasePath();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const queryTab = searchParams.get("tab");
  const allowedTabs = [
    "characters",
    "lead",
    "voice",
    "combat",
    "arcs",
    "dynamics",
    "relationships",
    "integrity",
    "technical",
  ];
  const activeTab: CharacterTab =
    queryTab && allowedTabs.includes(queryTab)
      ? (queryTab as CharacterTab)
      : "characters";

  const { showNotification } = useApp();
  const {
    prompt,
    selectedModel,
    contentType,
    generatedWorld,
    generatedWorldLore,
    generatedWorldPowers,
    generatedWorldFactions,
    generatedWorldArchitecture,
    generatedWorldAtlas,
    generatedWorldCulture,
    generatedWorldSystems,
    session,
    episode,
    generatedCharacters,
    isSaving,
    isGeneratingCharacters,
    isAnalyzingCharacters,
    generationProgress,
    numCharacters,
    characterList,
    isDemoMode,
  } = useGeneratorState();
  const { currentScriptId } = useGeneratorState();

  const projectId = React.useMemo(() => {
    const parsedProjectId = currentScriptId
      ? Number.parseInt(currentScriptId, 10)
      : undefined;
    return Number.isFinite(parsedProjectId) ? parsedProjectId : undefined;
  }, [currentScriptId]);

  const {
    setIsGeneratingCharacters,
    setCharacterData,
    setCharacterList,
    setGeneratedCharacters,
    setCharacterRelationships,
    syncCore,
    setCharacterDNA,
    setCharacterDynamics,
    setCharacterIntegrity,
    setGenerationProgress,
    loadDemoProject,
  } = useGeneratorDispatch();

  useAuth();

  const handleLoadDemo = () => {
    loadDemoProject();
  };

  const handleSave = async () => {
    await syncCore(projectId);
  };

  const getStudioBasePath = () => (
    currentScriptId ? `/projects/${currentScriptId}` : basePath
  );

  // Removed DNA, Dynamics, and Integrity generation as tabs were removed

  const handleGenerateAll = React.useCallback(async () => {
    if (!prompt.trim()) {
      showNotification?.(
        "Please enter a story prompt first before creating characters.",
        "error",
      );
      return;
    }

    setGenerationProgress(5);
    setIsGeneratingCharacters(true);
    try {
      // Clear existing data
      setCharacterData(null);
      setCharacterList([]);
      setGeneratedCharacters(null);
      setCharacterRelationships(null);
      setCharacterDNA(null);
      setCharacterDynamics(null);
      setCharacterIntegrity(null);

      // Consolidate all 8 dimensions of the custom world lore
      const worldSections: string[] = [];
      if (generatedWorld)
        worldSections.push(`=== WORLD MANIFEST ===\n${generatedWorld}`);
      if (generatedWorldLore)
        worldSections.push(`=== HISTORY & ERAS ===\n${generatedWorldLore}`);
      if (generatedWorldFactions)
        worldSections.push(
          `=== FACTIONS & POWER BALANCE ===\n${generatedWorldFactions}`,
        );
      if (generatedWorldPowers)
        worldSections.push(
          `=== SYSTEMS & MECHANICS ===\n${generatedWorldPowers}`,
        );
      if (generatedWorldArchitecture)
        worldSections.push(
          `=== VISUAL STYLE & ARCHITECTURE ===\n${generatedWorldArchitecture}`,
        );
      if (generatedWorldAtlas)
        worldSections.push(
          `=== GEOGRAPHY & ENVIRONMENT ===\n${generatedWorldAtlas}`,
        );
      if (generatedWorldCulture)
        worldSections.push(`=== CUSTOMS & ETHOS ===\n${generatedWorldCulture}`);
      if (generatedWorldSystems)
        worldSections.push(
          `=== TECHNOLOGICAL INFRASTRUCTURE ===\n${generatedWorldSystems}`,
        );

      const fullWorldLore = worldSections.join("\n\n");

      let result: any = null;
      if (handlers && handlers.handleGenerateCharacter) {
        try {
          studioLog(
            "CharactersLayout",
            "Calling registered character generation handler.",
            "anime",
          );
          await handlers.handleGenerateCharacter();
        } catch (hErr) {
          console.warn(
            "Registered handler for character generation failed:",
            hErr,
          );
        }
      } else {
        reportGeneration(
          "CharactersLayout",
          "Characters generation",
          "request",
          "anime",
        );
        result = await generateCharacters(
          prompt,
          selectedModel,
          contentType,
          fullWorldLore || undefined,
          numCharacters,
        );
        reportGeneration(
          "CharactersLayout",
          "Characters generation",
          "success",
          "anime",
          { length: JSON.stringify(result)?.length || 0 },
        );
      }

      setGenerationProgress(70);

      if (result) {
        if (typeof result === "object" && result !== null) {
          let updatedCharacters = result.characters || [];
          if ("characters" in result) {
            setCharacterData(result);
            setCharacterList(updatedCharacters);
            setGeneratedCharacters(JSON.stringify(result, null, 2));
          }
          if ("markdown" in result) {
            setGeneratedCharacters(result.markdown as string);
          }
          if (result.relationships) {
            setCharacterRelationships(JSON.stringify(result.relationships));
          }

          // Set character list and details directly without generating profile images
          if (
            Array.isArray(updatedCharacters) &&
            updatedCharacters.length > 0
          ) {
            setCharacterList(updatedCharacters);
            setGeneratedCharacters(JSON.stringify(result, null, 2));
          }
        } else {
          setGeneratedCharacters(result as string);
        }
      }

      setGenerationProgress(100);
      showNotification?.("Cast Nexus Synthesized.", "success");

      // Reset progress after a short delay
      setTimeout(() => setGenerationProgress(0), 3000);
    } catch (e: any) {
      reportGeneration(
        "CharactersLayout",
        "Full Cast Synthesization",
        "failure",
        "anime",
        e,
      );
      showNotification?.(
        "Failed to create cast: " + (e.message || "Unknown error"),
        "error",
      );
      setGenerationProgress(0);
    } finally {
      setIsGeneratingCharacters(false);
    }
  }, [
    prompt,
    selectedModel,
    contentType,
    generatedWorld,
    numCharacters,
    handlers,
    setCharacterData,
    setCharacterList,
    setGeneratedCharacters,
    setCharacterRelationships,
    setCharacterDNA,
    setCharacterDynamics,
    setCharacterIntegrity,
    setIsGeneratingCharacters,
    setGenerationProgress,
    showNotification,
    navigate,
  ]);

  const handleTabChange = (tab: CharacterTab) => {
    startTransition(() => {
      setSearchParams({ tab });
    });
  };

  const tabContent = React.useMemo(() => {
    switch (activeTab) {
      case "lead":
        return <AddLeadTab />;
      case "voice":
        return <VoiceTab />;
      case "combat":
        return <CombatTab />;
      case "arcs":
        return <ArcsTab />;
      case "dynamics":
        return <DynamicsTab />;
      case "relationships":
        return <RelationshipsPage />;
      case "integrity":
        return <IntegrityTab />;
      case "technical":
        return <TechnicalTab />;
      case "characters":
      default:
        return <CharactersPage />;
    }
  }, [activeTab]);

  React.useEffect(() => {
    const handleTriggerGenerate = () => {
      handleGenerateAll();
    };

    window.addEventListener(
      "studio-generate-characters",
      handleTriggerGenerate,
    );
    return () =>
      window.removeEventListener(
        "studio-generate-characters",
        handleTriggerGenerate,
      );
  }, [handleGenerateAll]);

  React.useEffect(() => {
    const handleProfileImageEvent = async (ev: any) => {
      try {
        const index = ev?.detail?.index;
        if (!characterList || characterList.length === 0) return;

        const charsCopy = [...characterList];

        const getCharacterPrompt = (c: any) => {
          const toText = (value: any): string => {
            if (typeof value === "string") return value;
            if (value == null) return "";
            if (Array.isArray(value)) return value.join(", ");
            if (typeof value === "object") {
              return Object.values(value)
                .map((val: any) =>
                  typeof val === "string" ? val : JSON.stringify(val),
                )
                .join(" | ");
            }
            return String(value);
          };
          const details = toText(
            c.visualPrompt ||
            c.appearance ||
            c.technicalModel?.visualDNA ||
            c.name,
          );
          return `Highly detailed anime concept art, key visual portrait of character ${c.name}: ${details}. High-fidelity illustration, gorgeous cinematic lighting, aesthetic rich coloring, premium studio grade quality.`;
        };

        if (typeof index === "number") {
          const i = index;
          const char = charsCopy[i];
          if (!char) return;
          const prompt = getCharacterPrompt(char);
          showNotification?.(
            `Generating profile image for ${char.name}...`,
            "info",
          );
          try {
            const imageUrl = await generateSceneImage(
              prompt,
              undefined,
              isDemoMode,
            );
            if (imageUrl) {
              charsCopy[i] = { ...char, imageUrl };
              setCharacterList([...charsCopy]);
              setGeneratedCharacters?.(
                JSON.stringify({ characters: charsCopy }, null, 2),
              );
              showNotification?.("Profile image generated.", "success");
            }
          } catch (err) {
            console.error("Profile image generation failed:", err);
            showNotification?.("Failed to generate profile image.", "error");
          }
        } else {
          // Generate for all characters
          showNotification?.("Generating profile images for cast...", "info");
          for (let i = 0; i < charsCopy.length; i++) {
            const char = charsCopy[i];
            if (!char) continue;
            try {
              const prompt = getCharacterPrompt(char);
              const img = await generateSceneImage(
                prompt,
                undefined,
                isDemoMode,
              );
              if (img) {
                charsCopy[i] = { ...char, imageUrl: img };
                setCharacterList([...charsCopy]);
              }
            } catch (imgErr) {
              console.error(
                `Failed to generate profile for ${char.name}:`,
                imgErr,
              );
            }
          }
          setGeneratedCharacters?.(
            JSON.stringify({ characters: charsCopy }, null, 2),
          );
          showNotification?.(
            "Cast profile images generation complete.",
            "success",
          );
        }
      } catch (e) {
        console.error("Error handling profile image event", e);
      }
    };

    window.addEventListener(
      "studio-generate-profile-image",
      handleProfileImageEvent,
    );
    return () =>
      window.removeEventListener(
        "studio-generate-profile-image",
        handleProfileImageEvent,
      );
  }, [
    characterList,
    generateSceneImage,
    isDemoMode,
    setCharacterList,
    setGeneratedCharacters,
    showNotification,
  ]);

  React.useEffect(() => {
    reportTabChange("CHARACTERS", activeTab, "anime");
  }, [activeTab]);

  React.useEffect(() => {
    const handleGlobalGenerate = () => {
      studioLog(
        "CharactersLayout",
        "Global character generation event received.",
        "anime",
      );
      handleGenerateAll();
    };
    window.addEventListener("studio-generate-characters", handleGlobalGenerate);
    return () =>
      window.removeEventListener(
        "studio-generate-characters",
        handleGlobalGenerate,
      );
  }, [handleGenerateAll]);

  const loadingStates = {
    characters: isGeneratingCharacters,
  };

  const hasContent = characterList && characterList.length > 0;

  return (
    <CharacterPageContext.Provider value={{
      setHandlers,
      handleLoadDemo,
      viewMode,
      setViewMode,
      searchQuery,
      setSearchQuery
    }}>
      <CharacterTabActionsContext.Provider
        value={{
          isAnalyzingCharacters,
          ...(handlers || {}),
        }}
      >
        <div className={s.container}>
          <div className={s.layout.moduleHeader}>
            <CharacterHeader
              isGenerating={
                handlers.isGenerating ||
                isGeneratingCharacters ||
                isAnalyzingCharacters
              }
              onRegenerate={handleGenerateAll}
              session={session}
              episode={episode}
              onPrev={() => {
                startTransition(() => {
                  navigate(`${getStudioBasePath()}/world`);
                });
              }}
              onNext={() => {
                startTransition(() => {
                  navigate(`${getStudioBasePath()}/series`);
                });
              }}
              onSave={handleSave}
              isSaving={isSaving}
              hasContent={hasContent}
            />
          </div>

          <div className={s.tabs.tabsBar}>
            <div className={s.tabs.tabsBarGlow} />
            <div className={s.tabs.tabsBarInner}>
              <CharacterTabs
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                loadingStates={loadingStates}
              />
            </div>
            <StudioTabsProgressBar progress={generationProgress} theme="cyan" />
          </div>

          {/* Toolbar Section */}
          {hasContent && (
            <div className="mb-8 relative z-30">
              <CharacterToolbar
                status={hasContent ? "active" : "empty"}
                session={session}
                episode={episode}
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                content={generatedCharacters}
              />
            </div>
          )}

          <div className="flex-1 flex flex-col min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.search}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex-1 flex flex-col"
              >
                <Suspense
                  fallback={
                    <div className="flex-1 flex items-center justify-center p-20">
                      <CharactersLoadingPage
                        tab={activeTab}
                        progress={generationProgress}
                      />
                    </div>
                  }
                >
                  {isGeneratingCharacters || isAnalyzingCharacters ? (
                    <CharactersLoadingPage
                      tab={activeTab}
                      progress={generationProgress}
                    />
                  ) : !hasContent ? (
                    <CharacterEmptyState
                      onLaunch={handleGenerateAll}
                      onLoadDemo={handleLoadDemo}
                      isGenerating={isGeneratingCharacters}
                    />
                  ) : (
                    <div className="flex-1 flex flex-col">{tabContent}</div>
                  )}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </CharacterTabActionsContext.Provider>
    </CharacterPageContext.Provider>
  );
}
