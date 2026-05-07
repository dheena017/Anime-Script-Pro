import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { generateMetadata } from '@/services/api/gemini';
import { useSEODispatch } from '@/contexts/generator';
import { SEOHeader } from './components/SEOHeader';
import { SEOToolbar } from './components/SEOToolbar';
import { SEOTabs, SEOTab } from './Tabs/SEOTabs';
import { SEOLoadingPage } from './components/SEOLoadingPage';

export const SEOContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function SEOLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [, setHandlers] = React.useState<any>({});

  const {
    generatedMetadata, setGeneratedMetadata,
    isLoading, setIsLoading,
    generatedScript, selectedModel, session, episode,
    showNotification, contentType,
    isSaving, 
    
    syncCore
  } = useGenerator();

  const {
    setGeneratedDescription, setGeneratedAltText,
    setGeneratedDistributionPlan
  } = useSEODispatch();

  useAuth();

  const handleSave = async () => {
    await syncCore();
  };

  const handleGenerateAll = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating SEO data.', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      // Clear existing data to show empty states for pending tabs
      setGeneratedMetadata(null);
      setGeneratedDescription(null);
      setGeneratedAltText(null);
      setGeneratedDistributionPlan(null);

      const { generateYouTubeDescription, generateAltTexts, generateDistributionStrategy } = await import('@/services/api/gemini');
      
      // Sequence SEO generations with Response and Report flow
      setSearchParams({ tab: 'keywords' });
      console.log('[SEOLayout] Requesting metadata/keywords generation...');
      const metadata = await generateMetadata(generatedScript, selectedModel);
      setGeneratedMetadata(metadata);
      console.log(`[SEOLayout] Metadata generated successfully. Response length: ${JSON.stringify(metadata)?.length || 0} chars.`);
      showNotification?.('Keywords indexed.', 'success');
      await new Promise(r => setTimeout(r, 2000));

      setSearchParams({ tab: 'description' });
      console.log('[SEOLayout] Requesting YouTube description generation...');
      const description = await generateYouTubeDescription(generatedScript, selectedModel);
      setGeneratedDescription(description);
      console.log(`[SEOLayout] Description generated successfully. Response length: ${description?.length || 0} chars.`);
      showNotification?.('Description synthesized.', 'success');
      await new Promise(r => setTimeout(r, 2000));

      setSearchParams({ tab: 'alt-texts' });
      console.log('[SEOLayout] Requesting alt texts generation...');
      const altText = await generateAltTexts(generatedScript, selectedModel);
      setGeneratedAltText(altText);
      console.log(`[SEOLayout] Alt texts generated successfully. Response length: ${altText?.length || 0} chars.`);
      showNotification?.('Alt texts generated.', 'success');
      await new Promise(r => setTimeout(r, 2000));

      setSearchParams({ tab: 'distribution' });
      console.log('[SEOLayout] Requesting distribution strategy generation...');
      const dist = await generateDistributionStrategy(generatedScript, selectedModel);
      setGeneratedDistributionPlan(dist);
      console.log(`[SEOLayout] Distribution strategy generated successfully. Response length: ${dist?.length || 0} chars.`);
      showNotification?.('Distribution plan ready.', 'success');
      await new Promise(r => setTimeout(r, 2000));

      showNotification?.('Full SEO Nexus synchronized!', 'success');
      setSearchParams({ tab: 'keywords' }); // Return to start
    } catch (e: any) {
      console.error('[SEOLayout] SEO synthesis failed:', e);
      showNotification?.('SEO synthesis failed: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const handleGlobalGenerate = () => handleGenerateAll();
    window.addEventListener('studio-generate-seo', handleGlobalGenerate);
    return () => window.removeEventListener('studio-generate-seo', handleGlobalGenerate);
  }, [handleGenerateAll]);

  const handleGenerate = handleGenerateAll;

  const activeTab = (searchParams.get('tab') as SEOTab) || 'keywords';

  React.useEffect(() => {
    console.log(`[SEOLayout] Active tab changed to: ${activeTab.toUpperCase()}`);
  }, [activeTab]);

  const handleTabChange = (tab: SEOTab) => {
    setSearchParams({ tab });
  };

  return (
    <SEOContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <div className="studio-module-header">
          <SEOHeader
            onRegenerate={handleGenerate}
            isGenerating={isLoading}
            onNext={() => navigate(`/${contentType.toLowerCase()}/prompts`)}
            onPrev={() => navigate(`/${contentType.toLowerCase()}/storyboard`)}
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={!!generatedMetadata}
            session={session}
            episode={episode}
          />
        </div>

        <div className="studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10 w-full flex justify-center">
            <SEOTabs activeTab={activeTab} setActiveTab={handleTabChange} />
          </div>
        </div>

        {generatedMetadata && !isLoading && (
          <div className="mb-8">
            <SEOToolbar
              status="active"
              session={session}
              episode={episode}
              content={JSON.stringify(generatedMetadata)}
            />
          </div>
        )}

        {isLoading ? (
          <SEOLoadingPage tab={activeTab} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet context={{ activeTab }} />
          </motion.div>
        )}
      </div>
    </SEOContext.Provider>
  );
}
