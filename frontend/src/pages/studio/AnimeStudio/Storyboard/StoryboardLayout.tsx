import React, { startTransition, Suspense } from "react";
import {
  Outlet,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGeneratorState, useGeneratorDispatch } from "@/hooks/useGenerator";
import { useAuth } from "@/hooks/useAuth";
import { generateImagePrompts } from "@/services/api/gemini";

import { StoryboardHeader } from "./components/StoryboardHeader";
import { StoryboardToolbar } from "./components/StoryboardToolbar";
import { StoryboardTabs, StoryboardTab } from "./Tabs/StoryboardTabs";

import { StoryboardLoadingPage } from "./components/StoryboardLoadingPage";
import { StoryboardEmptyState } from "./components/StoryboardEmptyState";
import { StudioTabsProgressBar } from "@/pages/studio/components/studio/layout/StudioTabsProgressBar";
import { storyboardStyles as s } from "./storyboardStyles";

export const StoryboardContext = React.createContext<{
  setHandlers: (handlers: any) => void;
}>({ setHandlers: () => {} });

export default function StoryboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    generatedScript,
    generatedImagePrompts,
    isGeneratingImagePrompts,
    generatedSeriesPlan,
    numScenes,
    selectedModel,
    isSaving,
    contentType,
    generationProgress,
    currentScriptId,
    session,
    episode,
    isEditing,
  } = useGeneratorState();
  const {
    setGeneratedImagePrompts,
    setIsGeneratingImagePrompts,
    showNotification,
    syncCore,
    setIsEditing,
    setGenerationProgress,
    loadDemoProject,
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

  const getStoryboardTabPath = (tab: string) => (
    currentScriptId ? `/projects/${currentScriptId}/storyboard/${tab}` : `/studio/storyboard/${tab}`
  );

  const handleGenerate = async () => {
    if (!generatedScript) {
      showNotification?.(
        "Please write a script first before creating your storyboard.",
        "error",
      );
      return;
    }
    const navigateToTab = (tab: string) => {
      navigate(getStoryboardTabPath(tab));
    };

    setGenerationProgress(5);
    setIsGeneratingImagePrompts(true);
    console.log("[StoryboardLayout] Requesting image prompts generation...");
    try {
      navigateToTab("video");
      const prompts = await generateImagePrompts(
        generatedScript,
        selectedModel,
      );
      setGeneratedImagePrompts(prompts);
      // If the page-level handlers are registered (from StoryboardPage), auto-create initial scenes
      // when there are no scenes yet. This makes "Generate All" also populate the storyboard.
      try {
        const shouldSeedScenes =
          handlers &&
          typeof handlers.scenesLength !== "undefined" &&
          handlers.scenesLength === 0 &&
          typeof handlers.handleAddScene === "function";
        if (shouldSeedScenes) {
          // Derive seed count from available blueprint data (no prompt)
          let seedCount: number | undefined;
          try {
            if (
              generatedSeriesPlan &&
              Array.isArray(generatedSeriesPlan) &&
              generatedSeriesPlan.length > 0
            ) {
              const first = generatedSeriesPlan[0] as any;
              seedCount =
                first?.asset_matrix?.scene_count ||
                first?.scenes ||
                first?.scene_count;
            }
            if (!seedCount && numScenes) {
              const parsed = parseInt(String(numScenes), 10);
              if (Number.isFinite(parsed) && parsed > 0) seedCount = parsed;
            }
          } catch (e) {
            // ignore and fallback below
          }

          // Normalize, validate and cap seedCount to avoid runtime errors
          const parsedSeed = Number.isFinite(Number(seedCount))
            ? Math.floor(Number(seedCount))
            : NaN;
          let finalSeed = Number.isFinite(parsedSeed) ? parsedSeed : NaN;
          if (!Number.isFinite(finalSeed) || finalSeed <= 0) finalSeed = 1; // safe default
          // Cap to a sensible upper bound (Blueprint UI allows up to 40 scenes)
          finalSeed = Math.min(40, Math.max(1, finalSeed));

          for (let i = 0; i < finalSeed; i++) {
            // handlers.handleAddScene is async in the page context
            // eslint-disable-next-line no-await-in-loop
            try {
              await handlers.handleAddScene();
            } catch (err) {
              console.warn(
                "[StoryboardLayout] handler.handleAddScene failed for seed",
                i,
                err,
              );
              // continue seeding remaining scenes
            }
            setGenerationProgress(30 + Math.round(((i + 1) / finalSeed) * 10));
          }
        }
      } catch (e) {
        console.warn("[StoryboardLayout] seeding scenes failed", e);
      }

      // Ensure progress is at least at the 30% mark after prompts and seeding
      setGenerationProgress(30);
      console.log(
        `[StoryboardLayout] Image prompts generated successfully. Response length: ${prompts?.length || 0} chars.`,
      );
      await new Promise((r) => setTimeout(r, 2000));

      navigateToTab("angles");
      setGenerationProgress(45);
      await new Promise((r) => setTimeout(r, 2000));

      navigateToTab("composition");
      setGenerationProgress(60);
      await new Promise((r) => setTimeout(r, 2000));

      navigateToTab("animatic");
      setGenerationProgress(75);
      await new Promise((r) => setTimeout(r, 2000));

      navigateToTab("audio");
      setGenerationProgress(90);
      await new Promise((r) => setTimeout(r, 2000));

      navigateToTab("video");
      setGenerationProgress(100);
      showNotification?.("Full Storyboard Sequence Generated!", "success");

      // Reset progress after a short delay
      setTimeout(() => setGenerationProgress(0), 3000);
    } catch (e: any) {
      console.error("[StoryboardLayout] Failed to generate visuals:", e);
      showNotification?.(
        "Failed to generate visuals: " + (e.message || "Error"),
        "error",
      );
      setGenerationProgress(0);
    } finally {
      setIsGeneratingImagePrompts(false);
    }
  };

  const activeTab = React.useMemo(() => {
    const segments = location.pathname.split("/");
    const lastSegment = segments[segments.length - 1];
    const validTabs: StoryboardTab[] = [
      "video",
      "angles",
      "composition",
      "animatic",
      "audio",
    ];
    if (validTabs.includes(lastSegment as StoryboardTab)) {
      return lastSegment as StoryboardTab;
    }
    return "video";
  }, [location.pathname]);

  const handleTabChange = (tab: StoryboardTab) => {
    navigate(getStoryboardTabPath(tab));
  };

  React.useEffect(() => {
    console.log(
      `[StoryboardLayout] Active tab changed to: ${activeTab.toUpperCase()}`,
    );
  }, [activeTab]);

  React.useEffect(() => {
    const handleGlobalGenerate = () => {
      console.log(
        "[StoryboardLayout] Global storyboard generation event received.",
      );
      if (handlers.handleGenerateAll && handlers.scenesLength > 0) {
        handlers.handleGenerateAll();
      } else {
        handleGenerate();
      }
    };
    window.addEventListener("studio-generate-storyboard", handleGlobalGenerate);
    return () =>
      window.removeEventListener(
        "studio-generate-storyboard",
        handleGlobalGenerate,
      );
  }, [handlers.handleGenerateAll, handlers.scenesLength, handleGenerate]);

  return (
    <StoryboardContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <div className="studio-module-header">
          <StoryboardHeader
            onRegenerate={
              handlers.handleGenerateAll && handlers.scenesLength > 0
                ? handlers.handleGenerateAll
                : handleGenerate
            }
            isGenerating={handlers.isGenerating || isGeneratingImagePrompts}
            onNext={() => {
              startTransition(() => {
                navigate(`${currentScriptId ? `/projects/${currentScriptId}` : '/studio'}/seo`);
              });
            }}
            onPrev={() => {
              startTransition(() => {
                navigate(`${currentScriptId ? `/projects/${currentScriptId}` : '/studio'}/engine`);
              });
            }}
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={!!generatedImagePrompts}
            session={session}
            episode={episode}
            progress={handlers.productionProgress || generationProgress}
          />
        </div>

        <div className={s.tabs.tabsBar}>
          <div className={s.tabs.tabsBarGlow} />
          <div className={s.tabs.tabsBarInner}>
            <StoryboardTabs
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />
          </div>
          <StudioTabsProgressBar
            progress={generationProgress || handlers.productionProgress || 0}
            theme="cyan"
          />
        </div>

        {/* Toolbar Section */}
        {generatedImagePrompts && (
          <div className="mb-8 relative z-30">
            <StoryboardToolbar
              status={generatedImagePrompts ? "active" : "empty"}
              session={session}
              episode={episode}
              content={generatedImagePrompts}
              onEnhanceNarration={handlers.handleEnhanceAllNarration}
              onEnhanceVisuals={handlers.handleEnhanceAllVisuals}
              isGlobalEnhancing={handlers.isGlobalEnhancing}
              onAddScene={handlers.handleAddScene}
              isEditing={isEditing}
              onEditingChange={setIsEditing}
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
                    <StoryboardLoadingPage
                      tab={activeTab}
                      progress={generationProgress}
                    />
                  </div>
                }
              >
                {handlers.isGenerating || isGeneratingImagePrompts ? (
                  <StoryboardLoadingPage
                    tab={activeTab}
                    progress={generationProgress}
                  />
                ) : !generatedImagePrompts ? (
                  <StoryboardEmptyState
                    onLaunch={handleGenerate}
                    onLoadDemo={loadDemoProject}
                    isGenerating={isGeneratingImagePrompts}
                  />
                ) : (
                  <Outlet context={{ activeTab }} />
                )}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </StoryboardContext.Provider>
  );
}
