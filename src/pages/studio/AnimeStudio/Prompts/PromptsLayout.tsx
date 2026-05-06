import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import EpisodePackager from './components/EpisodePackager';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { generateImagePrompts, generateVideoPrompts } from '@/services/api/gemini';
import { PromptsHeader } from './components/PromptsHeader';
import { PromptsToolbar } from './components/PromptsToolbar';
import { PromptsTab } from './Tabs/PromptsTabs';
import { PromptsLoadingPage } from './components/PromptsLoadingPage';

export const PromptsContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function PromptsLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    generatedImagePrompts, setGeneratedImagePrompts,
    videoData, setVideoData,
    isLoading, setIsLoading,
    generatedScript, selectedModel, session, episode,
    showNotification,
    isSaving, setIsSaving,
    castProfiles, castData, generatedSeriesPlan, generatedMetadata,
    contentType
  } = useGenerator();

  const { user } = useAuth();

  const handleSave = async () => {
    if (!user?.id) {
      showNotification?.('Authentication Required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const { productionApi } = await import('@/services/api/production');
      await productionApi.updateContent(user.id, {
        cast_profiles: castProfiles,
        cast_data: castData,
        script_content: generatedScript,
        series_plan: generatedSeriesPlan,
        seo_metadata: generatedMetadata
      });
      showNotification?.('Prompts saved successfully!', 'success');
    } catch (e) {
      console.error("Manual sync failed:", e);
      showNotification?.('Sync Error', 'error');
    } finally {
      setIsSaving(false);
    }
  };


  // Generate both image and video prompts (all prompts modules)
  const handleGenerateAll = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating prompts.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Image prompts first (switch to image tab)
      setSearchParams({ tab: 'image' });
      console.log('[PromptsLayout] Requesting image prompts generation...');
      const prompts = await generateImagePrompts(generatedScript, selectedModel);
      setGeneratedImagePrompts(prompts as any);
      console.log(`[PromptsLayout] Image prompts generated successfully. Response length: ${prompts?.length || 0} chars.`);
      showNotification?.('Image prompts synthesized.', 'success');
      await new Promise((r) => setTimeout(r, 2000));

      // Then video prompts (switch to video tab)
      setSearchParams({ tab: 'video' });
      console.log('[PromptsLayout] Requesting video prompts generation...');
      const vprompts = await generateVideoPrompts(generatedScript, selectedModel);
      setVideoData(vprompts as any);
      console.log(`[PromptsLayout] Video prompts generated successfully. Response length: ${JSON.stringify(vprompts)?.length || 0} chars.`);
      showNotification?.('Video prompts synthesized.', 'success');
      await new Promise((r) => setTimeout(r, 2000));

      showNotification?.('All prompts generated successfully!', 'success');
    } catch (e: any) {
      console.error('[PromptsLayout] Failed to generate prompts:', e);
      showNotification?.('Failed to generate prompts: ' + (e.message || 'Unknown error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const activeTab = (searchParams.get('tab') as PromptsTab) || 'image';

  React.useEffect(() => {
    console.log(`[PromptsLayout] Active tab changed to: ${activeTab.toUpperCase()}`);
  }, [activeTab]);

  const handleTabChange = (tab: PromptsTab) => {
    setSearchParams({ tab });
  };

  return (
    <PromptsContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <div className="studio-module-header">
          <PromptsHeader
            onRegenerate={handlers.handleGenerate || handleGenerateAll}
            isGenerating={handlers.isGenerating || isLoading}
            onNext={() => navigate(`/${contentType.toLowerCase()}/screening`)}
            onPrev={() => navigate(`/${contentType.toLowerCase()}/seo`)}
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={activeTab === 'video' ? !!videoData : !!generatedImagePrompts}
            session={session}
            episode={episode}
          />
        </div>

        <div className="studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10 w-full flex justify-center">
            <PromptsToolbar
              status={generatedImagePrompts ? 'active' : 'empty'}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              session={session}
              episode={episode}
              content={generatedImagePrompts}
              showTabsOnly={true}
            />
          </div>
        </div>

        {(handlers.isGenerating || isLoading) ? (
          <PromptsLoadingPage tab={activeTab} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'video' ? <EpisodePackager /> : <Outlet context={{ activeTab }} />}
          </motion.div>
        )}
      </div>
    </PromptsContext.Provider>
  );
}



