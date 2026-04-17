import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Cpu, 
  Settings2, 
  History, 
  Info,
  Users,
  Hash,
  Clapperboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGenerator } from '@/contexts/GeneratorContext';
import { 
  generateAnimeScript, 
  generateCharacters, 
  generateSeriesPlan,
  MODEL_GROUPS 
} from '@/services/geminiService';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { cn } from '@/lib/utils';
import { StudioInputPanel } from '@/components/studio/core/StudioInputPanel';
import { useStudioActions } from '@/hooks/useStudioActions';
import { RecentScriptsPanel } from '@/components/studio/core/RecentScriptsPanel';

export function StudioLayout() {
  const lastSelectionRef = React.useRef<{ session: string; episode: string } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const generator = useGenerator();
  
  const {
    prompt, setPrompt, setGeneratedScript, tone, setTone,
    audience, setAudience, episode, setEpisode,
    session, setSession, selectedModel, setSelectedModel,
    isLoading, isGeneratingCharacters, isGeneratingSeries,
    generatedScript, isSaving, setCurrentScriptId,
    currentScriptId, history
  } = generator;

  const {
    handleSaveCurrent,
    handleGenerate,
    handleGenerateCharacters,
    handleGenerateSeriesPlan
  } = useStudioActions();

  React.useEffect(() => {
    if (!lastSelectionRef.current) {
      lastSelectionRef.current = { session, episode };
      return;
    }

    const changed =
      lastSelectionRef.current.session !== session ||
      lastSelectionRef.current.episode !== episode;

    lastSelectionRef.current = { session, episode };

    if (!changed) return;
    if (!prompt.trim()) return;

    void handleGenerate();
  }, [session, episode, prompt, handleGenerate]);

  const selectedTool: 'script' | 'cast' | 'series' | 'storyboard' | 'seo' | 'prompts' | 'example' | 'template' | 'framework' | 'whatif' | 'audio' | 'export' | undefined =
    location.pathname.includes('/studio/script')
      ? 'script'
      : location.pathname.includes('/studio/cast')
      ? 'cast'
      : location.pathname.includes('/studio/series')
      ? 'series'
      : location.pathname.includes('/studio/storyboard')
      ? 'storyboard'
      : location.pathname.includes('/studio/seo')
      ? 'seo'
      : location.pathname.includes('/studio/prompts')
      ? 'prompts'
      : location.pathname.includes('/studio/example')
      ? 'example'
      : location.pathname.includes('/studio/template')
      ? 'template'
      : location.pathname.includes('/studio/framework')
      ? 'framework'
      : location.pathname.includes('/studio/whatif')
      ? 'whatif'
      : location.pathname.includes('/studio/audio')
      ? 'audio'
      : location.pathname.includes('/studio/export')
      ? 'export'
      : undefined;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Input */}
      <div className="lg:col-span-4 space-y-8">
        <StudioInputPanel
          prompt={prompt}
          setPrompt={setPrompt}
          tone={tone}
          setTone={setTone}
          audience={audience}
          setAudience={setAudience}
          session={session}
          setSession={setSession}
          episode={episode}
          setEpisode={setEpisode}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          isLoading={isLoading}
          isGeneratingCast={isGeneratingCharacters}
          isGeneratingSeries={isGeneratingSeries}
          canGenerate={Boolean(prompt.trim())}
          onGenerateScript={handleGenerate}
          onGenerateCast={handleGenerateCharacters}
          onGenerateSeries={handleGenerateSeriesPlan}
          onSaveCurrent={handleSaveCurrent}
          isSaving={isSaving}
          hasGeneratedScript={Boolean(generatedScript)}
          currentScriptId={currentScriptId}
          selectedTool={selectedTool}
          onToolNavigate={(path) => navigate(path)}
        />

        <RecentScriptsPanel 
          history={history}
          onSelect={(item) => {
            setGeneratedScript(item.script);
            setCurrentScriptId(item.id);
            navigate('/studio/script');
          }}
        />
      </div>

      {/* Right Column: Content */}
      <div className="lg:col-span-8">
        <Outlet />
      </div>
    </div>
  );
}
