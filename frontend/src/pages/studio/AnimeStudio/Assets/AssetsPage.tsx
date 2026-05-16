import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Search, Sparkles, Image as ImageIcon, MonitorPlay, Heart, Copy, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { generateMetadata, generateYouTubeDescription, generateImagePrompts } from '@/services/api/gemini';
import { MOCK_STORY_BIBLE } from '@/services/generators/mockData';
import { cn } from '@/lib/utils';
import { assetsStyles as s } from './assetsStyles';

import { useLocation, useOutletContext } from 'react-router-dom';
import { SEOEmptyState } from '../SEO/components/SEOEmptyState';

export function AssetsPage() {
  const location = useLocation();
  const { onLaunch } = useOutletContext<{ onLaunch: () => void }>();
  const {
    generatedMetadata,
    generatedDescription,
    generatedImagePrompts,
    isGeneratingMetadata,
    isGeneratingDescription,
    isGeneratingImagePrompts,
    generatedScript, selectedModel, 
  } = useGeneratorState();
  const {
    setGeneratedMetadata,
    setGeneratedDescription,
    setGeneratedImagePrompts,
    setIsGeneratingMetadata,
    setIsGeneratingDescription,
    setIsGeneratingImagePrompts,
    showNotification
  } = useGeneratorDispatch();

  const activeTab = location.pathname.includes('prompts') ? 'prompts' : 'seo';

  const handleGenerateAll = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating assets.', 'error');
      return;
    }
    
    setIsGeneratingMetadata(true);
    setIsGeneratingDescription(true);
    setIsGeneratingImagePrompts(true);

    try {
      const [meta, desc, prompts] = await Promise.all([
        generateMetadata(generatedScript, selectedModel),
        generateYouTubeDescription(generatedScript, selectedModel),
        generateImagePrompts(generatedScript, selectedModel)
      ]);
      
      setGeneratedMetadata(meta);
      setGeneratedDescription(desc);
      setGeneratedImagePrompts(prompts);
      showNotification?.('All assets generated successfully!', 'success');
    } catch (e: any) {
      showNotification?.('Failed to generate assets: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsGeneratingMetadata(false);
      setIsGeneratingDescription(false);
      setIsGeneratingImagePrompts(false);
    }
  };

  const handleGenerateSEO = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating SEO data.', 'error');
      return;
    }
    setIsGeneratingMetadata(true);
    setIsGeneratingDescription(true);
    try {
      const [meta, desc] = await Promise.all([
        generateMetadata(generatedScript, selectedModel),
        generateYouTubeDescription(generatedScript, selectedModel)
      ]);
      setGeneratedMetadata(meta);
      setGeneratedDescription(desc);
      showNotification?.('SEO metadata generated successfully!', 'success');
    } catch (e: any) {
      showNotification?.('Failed to generate SEO data: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsGeneratingMetadata(false);
      setIsGeneratingDescription(false);
    }
  };

  const handleGeneratePrompts = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating image prompts.', 'error');
      return;
    }
    setIsGeneratingImagePrompts(true);
    try {
      const prompts = await generateImagePrompts(generatedScript, selectedModel);
      setGeneratedImagePrompts(prompts);
      showNotification?.('Image prompts generated successfully!', 'success');
    } catch (e: any) {
      showNotification?.('Failed to generate image prompts: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsGeneratingImagePrompts(false);
    }
  };


  const hasAnyAsset = generatedMetadata || generatedDescription || generatedImagePrompts;

  return (
    <div data-testid="marker-assets-production" className={s.container}>
      {hasAnyAsset && (
        <div className={s.page.hero}>
          <div className="space-y-2">
            <div className={s.page.heroBadge}>
              <Sparkles className="w-4 h-4" />
              Shared story bible
            </div>
            <h2 className={s.page.heroTitle}>
              Asset generation for {MOCK_STORY_BIBLE.title}
            </h2>
            <p className={s.page.heroLogline}>
              {MOCK_STORY_BIBLE.logline}
            </p>
          </div>
          <div className={s.page.statGrid}>
            <div className={s.page.statCard}>
              <Search className="mx-auto mb-2 h-4 w-4 text-studio" />
              Metadata
            </div>
            <div className={s.page.statCard}>
              <MonitorPlay className="mx-auto mb-2 h-4 w-4 text-fuchsia-400" />
              Description
            </div>
            <div className={s.page.statCard}>
              <ImageIcon className="mx-auto mb-2 h-4 w-4 text-emerald-400" />
              Visual DNA
            </div>
          </div>
        </div>
      )}

      <Card className={s.page.mainCard}>
        <div className={s.page.innerBorder} />
        <div className={s.page.topGlow} />
        
        <div className="w-full p-0">
          <div className={s.page.mainCardInner}>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {!hasAnyAsset && !isGeneratingMetadata ? (
                <SEOEmptyState 
                  onLaunch={onLaunch}
                  isGenerating={isGeneratingMetadata || isGeneratingDescription || isGeneratingImagePrompts}
                />
              ) : (
                <div className="space-y-12">

                  <AnimatePresence mode="wait">
                    {activeTab === 'seo' ? (
                      <motion.div
                        key="seo"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-10"
                      >
                        <AssetCard 
                          title="Titles & Tags Protocol"
                          icon={Search}
                          content={generatedMetadata}
                          isGenerating={isGeneratingMetadata}
                          onGenerate={handleGenerateSEO}
                          color="studio"
                        />
                        
                        <AssetCard 
                          title="Manifest Description"
                          icon={MonitorPlay}
                          content={generatedDescription}
                          isGenerating={isGeneratingDescription}
                          onGenerate={handleGenerateSEO}
                          color="fuchsia"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="prompts"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <AssetCard 
                          title="Core Visual DNA"
                          icon={ImageIcon}
                          content={generatedImagePrompts}
                          isGenerating={isGeneratingImagePrompts}
                          onGenerate={handleGeneratePrompts}
                          color="cyan"
                          fullWidth
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AssetCard({ title, icon: Icon, content, isGenerating, onGenerate }: any) {
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <Card className={cn(
      s.card.wrapper,
      content ? `border-studio/30 shadow-[0_0_40px_rgba(0,0,0,0.3)]` : "border-white/5 hover:border-zinc-800"
    )}>
      <div className={s.card.gridOverlay} />
      
      <div className={s.card.header}>
        <div className="flex items-center gap-4">
          <div className={cn(
            s.card.iconBox,
            content ? `bg-studio/10 border-studio/30 text-studio` : "bg-zinc-900 border-zinc-800 text-zinc-600"
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className={s.card.title}>{title}</h4>
            <p className={s.card.subtitle}>AI Synthesis Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              s.card.actionIconButton,
              isLiked ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-zinc-600 border-white/5 bg-white/5 hover:text-red-400"
            )}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={cn(s.card.actionButton, "px-4 rounded-xl")}
            onClick={() => navigator.clipboard.writeText(content || '')}
            disabled={!content}
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            className={s.card.actionButtonPrimary}
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" /> : <Sparkles className="w-3.5 h-3.5 mr-2" />}
            {isGenerating ? 'Synthesizing...' : 'Regenerate'}
          </Button>
        </div>
      </div>
      
      <div className={s.card.contentArea}>
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-zinc-500 animate-in fade-in duration-500">
            <div className={s.card.loadingSpinner} />
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white drop-shadow-xl mb-3 italic">Generating Assets...</h4>
            <p className="text-xs text-zinc-600 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[200px] text-center">Creating premium visuals and metadata for your project</p>
          </div>
        ) : content ? (
          <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-1000 prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:font-medium prose-strong:text-studio prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className={s.card.emptyState}>
            <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover/empty:border-zinc-700 transition-all duration-700">
              <Icon className="w-10 h-10 opacity-20 group-hover/empty:opacity-40 transition-opacity" />
            </div>
            <p className="font-black uppercase tracking-[0.4em] text-xs max-w-[200px] text-center leading-loose">Start <span className="text-zinc-600">Generation</span> to create assets.</p>
          </div>
        )}
      </div>
    </Card>
  );
}

