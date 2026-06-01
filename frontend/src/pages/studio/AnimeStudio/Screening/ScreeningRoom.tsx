import { useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { apiRequest } from '@/lib/api-utils';
import { generateImagePrompts } from '@/services/api/gemini';

// Context
import { ScreeningContext } from './ScreeningLayout';

// Sub-components
import { ScreeningTab } from './Tabs/ScreeningTabs';
import { ScreeningViewport } from './components/ScreeningViewport';
import { ScreeningTimeline } from './components/ScreeningTimeline';
import { ScreeningMetadata } from './components/ScreeningMetadata';
import { ScreeningEmptyState } from './components/ScreeningEmptyState';
import { ScreeningLoadingPage } from './components/ScreeningLoadingPage';
import { RenderPhase, Scene } from './components/types';
import { Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

import { screeningStyles as s } from './screeningStyles';

export function ScreeningRoom() {
  const { activeTab } = useOutletContext<{ activeTab: ScreeningTab }>();
  const { setHandlers } = useContext(ScreeningContext);
  const {
    currentScriptId,
    generatedScript,
    selectedModel,
    session: activeSession,
  } = useGeneratorState();
  const {
    showNotification,
    setSession,
    loadDemoProject
  } = useGeneratorDispatch();

  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoPrompts, setVideoPrompts] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [renderPhases, setRenderPhases] = useState<RenderPhase[]>([
    { id: 'lore', label: 'Lore Vault Integration', status: 'pending' },
    { id: 'cast', label: 'Character Profile Sync', status: 'pending' },
    { id: 'script', label: 'Dialogue Synthesis', status: 'pending' },
    { id: 'visuals', label: 'Cinematic Rendering', status: 'pending' },
    { id: 'integrity', label: 'Manifest Integrity Check', status: 'pending' },
  ]);

  useEffect(() => {
    if (currentScriptId || generatedScript) {
      fetchScenes();
    }
  }, [currentScriptId, activeSession, generatedScript]);

  const fetchScenes = async () => {
    setIsLoading(true);
    try {
      if (currentScriptId) {
        const data = await apiRequest<any[]>(`/api/scenes?project_id=${currentScriptId}`);
        if (data && data.length > 0) {
          const filtered = data.filter(s => Math.ceil(s.scene_number / 192) === parseInt(activeSession));
          setScenes(filtered);
          return;
        }
      }

      if (generatedScript) {
        const lines = generatedScript.split('\n');
        const tableLines = lines.filter(l => l.includes('|') && !l.includes('---'));
        if (tableLines.length > 1) {
          const parsed = tableLines.slice(1).map((row, idx) => {
            const cells = row.split('|').filter(cell => cell.trim() !== "").map(cell => cell.trim());
            return {
              id: `temp-${idx}`,
              scene_number: idx + 1,
              status: 'SYNCED',
              script: cells[3] || cells[1] || 'Dialogue sync in progress...'
            } as Scene;
          });
          setScenes(parsed);
        } else {
          setScenes([]);
        }
      } else {
        setScenes([]);
      }
    } catch (error) {
      console.error("Failed to load screening room:", error);
      setScenes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullRender = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before rendering a preview.', 'error');
      return;
    }
    setIsRendering(true);
    setVideoUrl(null);
    setRenderError(null);
    setRenderPhases(prev => prev.map(p => ({ ...p, status: 'pending' })));

    try {
      for (let i = 0; i < renderPhases.length; i++) {
        setRenderPhases(prev => {
          const next = [...prev];
          next[i].status = 'active';
          if (i > 0) next[i - 1].status = 'done';
          return next;
        });
        await new Promise(r => setTimeout(r, 1200));
      }

      const prompts = await generateImagePrompts(generatedScript, selectedModel);
      setVideoPrompts(prompts);

      const result: any = await simulateVideoRender(prompts);
      if (result?.success && result.videoUrl) {
        setVideoUrl(result.videoUrl);
        setRenderPhases(prev => prev.map(p => ({ ...p, status: 'done' })));
        showNotification?.('Preview rendered successfully!', 'success');
      } else {
        throw new Error(result?.error || result?.detail || 'Video rendering is unavailable because the fallback clip has been removed.');
      }
    } catch (error: any) {
      const message = error?.message || 'Unknown error';
      console.error("Production synthesis failed:", message);
      setRenderError(message);
      showNotification?.('Failed to render preview: ' + message, 'error');
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    setHandlers({
      handleFullRender,
      isRendering,
      activeSession: parseInt(activeSession),
      setActiveSession: (s: number) => setSession(String(s))
    });
  }, [generatedScript, selectedModel, isRendering, activeSession]);

  const getLoadingMessage = () => {
    switch (activeTab) {
      case 'preview': return "Calibrating Visual Fidelity...";
      case 'sequences': return "Synchronizing Master Stems...";
      case 'dailies': return "Preparing Distribution Pack...";
      case 'archives': return "Indexing Production Vault...";
      case 'exports': return "Manifesting Final Render...";
      default: return "Preparing Screening Room...";
    }
  };

  const renderTabContent = () => {
    if (isLoading || isRendering) {
      return (
        <ScreeningLoadingPage 
          message={getLoadingMessage()} 
          subtext="AI model is synthesizing production manifests"
        />
      );
    }

    if (activeTab === 'preview') {
      return (
        <AnimatePresence mode="wait">
          {scenes.length === 0 && !isRendering ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ScreeningEmptyState 
                onLaunch={() => {
                  window.dispatchEvent(new CustomEvent('studio-generate-screening'));
                }} 
                onLoadDemo={loadDemoProject}
                isGenerating={isRendering} 
              />
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <ScreeningViewport
                    videoUrl={videoUrl}
                    isRendering={isRendering}
                    renderPhases={renderPhases}
                    onRender={handleFullRender}
                    activeSession={parseInt(activeSession)}
                    sceneCount={scenes.length}
                    videoPrompts={videoPrompts}
                    generatedScript={generatedScript}
                    renderError={renderError}
                  />
                </div>
                <div className="lg:col-span-1">
                  <ScreeningTimeline scenes={scenes} isLoading={isLoading} />
                </div>
              </div>
              <div className="mt-8">
                <ScreeningMetadata isRendering={isRendering} videoUrl={videoUrl} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
        <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 group hover:border-studio/30 transition-all duration-700">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
            <Monitor className="w-8 h-8 opacity-20 group-hover:opacity-60 transition-opacity" />
          </motion.div>
        </div>
        <p className="font-black uppercase tracking-[0.3em] text-xs max-w-[280px] text-center leading-loose">
          The <span className="text-studio">{activeTab} protocol</span> is currently being synchronized with the production core.
        </p>
      </div>
    );
  };

  return (
    <div data-testid="marker-screening-room">
      <Card className={s.page.container}>
        <div className={s.page.innerBorder} />

        <div className={s.page.contentWrapper}>
          <div className={s.page.contentArea}>
            {renderTabContent()}
          </div>
        </div>
      </Card>
    </div>
  );
}

// Neural Simulation Helpers
async function simulateVideoRender(_prompts: string) {
  throw new Error('Video rendering is unavailable because the fallback demo clip has been removed and no live renderer is configured.');
}



