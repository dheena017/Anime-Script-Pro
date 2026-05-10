import React from 'react';

import { Card } from '@/components/ui/card';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { continueScript, generateScript, generateMetadata, generateImagePrompts } from '@/services/api/gemini';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/api-utils';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScriptTab } from './Tabs/ScriptTabs';

// Sub-components
import { ScriptEmptyState } from './components/ScriptEmptyState';
import { ScriptContext } from './ScriptLayout';

// Modular tab views
import { TeleprompterTab } from './Tabs/TeleprompterTab';
import { LinguisticsTab } from './Tabs/LinguisticsTab';
import { BeatSheetTab } from './Tabs/BeatSheetTab';
import { DialogueTab } from './Tabs/DialogueTab';
import { MetadataTab } from './Tabs/MetadataTab';
import { CinematicsTab } from './Tabs/CinematicsTab';
import { AnalysisTab } from './Tabs/AnalysisTab';
import { AudioTab } from './Tabs/AudioTab';

export function ScriptPage() {
  const { user } = useAuth();
  const {
    generatedScript,
    selectedModel,
    isLoading,
    recapperPersona,
    tone, audience, prompt, episode, session, contentType, numScenes,
    generatedWorld, generatedCharacters, characterRelationships,
    generatedSeriesPlan,
    currentScriptId,
    visualData
  } = useGeneratorState();
  const {
    setGeneratedScript,
    setIsLoading,
    setIsContinuingScript,
    setIsGeneratingMetadata, setGeneratedMetadata,
    setIsGeneratingImagePrompts, setGeneratedImagePrompts,
    setIsGeneratingVisuals,
    setCurrentScriptId,
    setVisualData,
    setEpisode, setSession,
    showNotification
  } = useGeneratorDispatch();



  const lastKeystrokeRef = React.useRef(Date.now());
  const lastSavedContentRef = React.useRef(generatedScript);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastType = now - lastKeystrokeRef.current;

      if (timeSinceLastType > 3000 && generatedScript !== lastSavedContentRef.current && generatedScript) {
        saveContentToLocalStorage();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [generatedScript, currentScriptId]);

  const saveContentToLocalStorage = () => {
    if (!generatedScript) return;
    try {
      const key = `autosave_script_${currentScriptId || 'draft'}`;
      localStorage.setItem(key, generatedScript);
      lastSavedContentRef.current = generatedScript;
    } catch (e) {
      console.error("Failed to autosave:", e);
    }
  };

  const handleContinueScript = async () => {
    if (!generatedScript) return;
    setIsContinuingScript(true);
    try {
      const nextScenes = await continueScript(generatedScript, selectedModel, contentType);
      const lines = nextScenes.split('\n').filter((l: string) => l.includes('|') && !l.includes('---') && !l.toLowerCase().includes('scene') && !l.toLowerCase().includes('section'));
      setGeneratedScript(generatedScript + '\n' + lines.join('\n'));
    } catch (error) {
      console.error(error);
    } finally {
      setIsContinuingScript(false);
    }
  };

  const handleNextEpisode = async () => {
    if (!prompt.trim()) {
      showNotification?.('Please enter a story prompt first to generate the next episode.', 'error');
      return;
    }
    let nextEp = parseInt(episode) + 1;
    let nextSess = parseInt(session);
    const maxEpisodes = generatedSeriesPlan ? generatedSeriesPlan.length : 12;
    if (nextEp > maxEpisodes) {
      nextEp = 1;
      nextSess += 1;
    }
    setEpisode(nextEp.toString());
    setSession(nextSess.toString());
    setGeneratedScript(null);
    setCurrentScriptId(null);
    setVisualData({});
    setIsLoading(true);
    try {
      const currentEpisodePlan = generatedSeriesPlan?.find(ep => parseInt(ep.episode) === nextEp);
      const targetSceneCount = currentEpisodePlan?.asset_matrix?.scene_count?.toString() || numScenes;
      const script = await generateScript(prompt, tone, audience, nextSess.toString(), nextEp.toString(), targetSceneCount, selectedModel, contentType, recapperPersona, characterRelationships, generatedWorld, generatedCharacters, currentEpisodePlan ? JSON.stringify(currentEpisodePlan) : null);
      setGeneratedScript(script);
      if (user) {
        await apiRequest("/api/scripts", {
          method: 'POST',
          body: JSON.stringify({
            user_id: user.id,
            title: `EPISODE_${nextEp}`,
            content: script,
            metadata: { prompt, tone, audience, episode: nextEp.toString(), session: nextSess.toString(), contentType, model: selectedModel }
          })
        });
      }
      showNotification?.(`Episode ${nextEp} Synchronized`, 'success');
    } catch (error: any) {
      console.error("Failed to save new episode:", error);
      showNotification?.('Failed to generate episode: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevEpisode = async () => {
    let prevEp = parseInt(episode) - 1;
    let prevSess = parseInt(session);
    if (prevEp < 1) {
      if (prevSess > 1) {
        prevSess -= 1;
        const maxEpisodes = generatedSeriesPlan ? generatedSeriesPlan.length : 12;
        prevEp = maxEpisodes;
      } else {
        showNotification?.('Already at the first episode.', 'info');
        return;
      }
    }

    setEpisode(prevEp.toString());
    setSession(prevSess.toString());
    setGeneratedScript(null);
    setCurrentScriptId(null);
    setVisualData({});
    setIsLoading(true);

    try {
      if (user) {
        const scripts = await apiRequest<any[]>("/api/scripts");
        const foundScript = scripts.find(s => s.title === `EPISODE_${prevEp}`);
        if (foundScript) {
          setGeneratedScript(foundScript.content);
          setCurrentScriptId(foundScript.id);
          showNotification?.(`Loaded Episode ${prevEp} from Archives`, 'success');
          setIsLoading(false);
          return;
        }
      }

      // If not found in DB or no user, generate it using the series plan
      const currentEpisodePlan = generatedSeriesPlan?.find(ep => parseInt(ep.episode) === prevEp);
      const targetSceneCount = currentEpisodePlan?.asset_matrix?.scene_count?.toString() || numScenes;
      const script = await generateScript(prompt, tone, audience, prevSess.toString(), prevEp.toString(), targetSceneCount, selectedModel, contentType, recapperPersona, characterRelationships, generatedWorld, generatedCharacters, currentEpisodePlan ? JSON.stringify(currentEpisodePlan) : null);
      setGeneratedScript(script);
      if (user) {
        await apiRequest("/api/scripts", {
          method: 'POST',
          body: JSON.stringify({
            user_id: user.id,
            title: `EPISODE_${prevEp}`,
            content: script,
            metadata: { prompt, tone, audience, episode: prevEp.toString(), session: prevSess.toString(), contentType, model: selectedModel }
          })
        });
      }
      showNotification?.(`Episode ${prevEp} Synchronized`, 'success');
    } catch (error: any) {
      console.error("Failed to load prev episode:", error);
      showNotification?.('Failed to load previous episode.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const { projectId } = useParams();
  const navigate = useNavigate();

  const handleGenerateSEO = async () => {
    if (!generatedScript) return;

    // If we already have metadata, just navigate
    if (recapperPersona) {
      navigate(`/studio/seo`);
      return;
    }

    setIsGeneratingMetadata(true);
    try {
      const seo = await generateMetadata(generatedScript, selectedModel);
      setGeneratedMetadata(seo);
      showNotification?.('SEO data generated successfully!', 'success');
      navigate(`/studio/seo`);
    } catch (e: any) {
      showNotification?.('Failed to generate SEO data: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  const handleGeneratePrompts = async () => {
    if (!generatedScript) return;

    setIsGeneratingImagePrompts(true);
    try {
      const prompts = await generateImagePrompts(generatedScript, selectedModel);
      setGeneratedImagePrompts(prompts);
      showNotification?.('Image prompts generated successfully!', 'success');
      navigate(`/studio/prompts`);
    } catch (e: any) {
      showNotification?.('Failed to generate prompts: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsGeneratingImagePrompts(false);
    }
  };

  const handleGenerateVisuals = async () => {
    if (!generatedScript) return;
    setIsGeneratingVisuals(true);
    try {
      showNotification?.('Navigating to Storyboard Generator...', 'success');
      navigate(`/studio/storyboard`);
    } catch (e: any) {
      showNotification?.('Failed to generate storyboard: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsGeneratingVisuals(false);
    }
  };



  const exportToPDF = () => {
    if (!generatedScript) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`${contentType} Script Pro - Anime Script`, 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    const tableLines = generatedScript.split('\n').filter(l => l.includes('|') && !l.includes('---'));
    if (tableLines.length > 2) {
      const body = tableLines.slice(1).map(row => row.split('|').filter(cell => cell.trim() !== "").map(cell => cell.trim()));
      autoTable(doc, { startY: 40, head: [['Scene #', 'Section', 'Character', 'Voiceover', 'Visuals', 'Sound', 'Time']], body, theme: 'grid', headStyles: { fillColor: [6, 78, 94] } });
    } else {
      doc.text(generatedScript, 14, 40, { maxWidth: 180 });
    }
    doc.save(`${contentType.toLowerCase()}-script.pdf`);
  };




  const playVoiceover = (text: string | null) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text.replace(/\|/g, ' '));
    window.speechSynthesis.speak(utterance);
  };

  const { setHandlers } = React.useContext<any>(ScriptContext);
  const { activeTab } = useOutletContext<{ activeTab: ScriptTab }>();

  React.useEffect(() => {
    setHandlers({
      exportToPDF,
      handleGenerateSEO,
      handleGeneratePrompts,
      handleGenerateVisuals,
      handleContinueScript,
      handleNextEpisode,
      handlePrevEpisode,
      playVoiceover: () => playVoiceover(generatedScript)
    });
  }, [generatedScript, visualData, episode, session]);

  const renderTabContent = () => {
    // During streaming: show script as it arrives (don't block on isLoading)
    const isStreaming = isLoading && !!generatedScript;

    if (isLoading && !generatedScript) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] space-y-8">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-studio/20 border-t-studio rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
            <div className="absolute inset-0 m-auto w-2 h-2 bg-studio rounded-full animate-ping" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-black tracking-[0.3em] text-[10px] uppercase text-studio animate-pulse">Initializing Production Core...</p>
            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Sequencing neural script engine</p>
          </div>
        </div>
      );
    }

    if (!generatedScript) {
      return (
        <ScriptEmptyState
          onLaunch={() => {
            window.dispatchEvent(new CustomEvent('studio-generate-script'));
          }}
          isGenerating={isLoading}
        />
      );
    }

    if (generatedScript.startsWith('Error:')) {
      return (
        <div className="text-red-500 font-bold text-center py-8 text-lg">{generatedScript}</div>
      );
    }

    switch (activeTab) {
      case 'teleprompter':
        return (
          <TeleprompterTab
            generatedScript={generatedScript}
            prompt={prompt}
            session={session}
            episode={episode}
            audience={audience}
            visualData={visualData}
          />
        );
      case 'linguistics':
        return <LinguisticsTab />;
      case 'beats':
        return <BeatSheetTab />;
      case 'dialogue':
        return <DialogueTab />;
      case 'cinematics':
        return <CinematicsTab />;
      case 'analysis':
        return <AnalysisTab />;
      case 'audio':
        return <AudioTab />;
      case 'metadata':
        return (
          <MetadataTab
            session={session}
            episode={episode}
            prompt={prompt}
            tone={tone}
            audience={audience}
            contentType={contentType}
            selectedModel={selectedModel}
          />
        );
      default:
        return (
          <TeleprompterTab
            generatedScript={generatedScript}
            prompt={prompt}
            session={session}
            episode={episode}
            audience={audience}
            visualData={visualData}
          />
        );
    }
  };

  return (
    <div data-testid="marker-production-script">
      <Card className={cn(
        "bg-[#030303]/40 backdrop-blur-md overflow-hidden rounded-3xl relative group/card transition-all duration-700",
        activeTab === 'teleprompter'
          ? "border-studio/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] hover:border-studio/50"
          : "border-zinc-800/30 hover:border-zinc-700"
      )}>
        <div className={cn(
          "absolute inset-0 border-[1px] rounded-3xl pointer-events-none transition-colors duration-700",
          activeTab === 'teleprompter' ? "border-studio/20 group-hover/card:border-studio/40" : "border-white/5"
        )} />

        <div className="w-full p-0">
          <div className={cn(
            "p-8 lg:p-10 mx-auto",
            activeTab === 'teleprompter' ? "max-w-4xl" : "max-w-5xl"
          )}>
            {renderTabContent()}
          </div>
        </div>
      </Card>
    </div>
  );
}




