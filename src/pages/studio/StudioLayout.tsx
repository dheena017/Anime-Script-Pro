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
import { StudioInputPanel } from '@/components/studio/StudioInputPanel';
import { StudioToolPanels } from '@/components/studio/StudioToolPanels';

export function StudioLayout() {
  const lastSelectionRef = React.useRef<{ session: string; episode: string } | null>(null);

  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    prompt, setPrompt,
    setGeneratedScript,
    setGeneratedCharacters,
    setGeneratedSeriesPlan,
    tone, setTone,
    audience, setAudience,
    episode, setEpisode,
    session, setSession,
    selectedModel, setSelectedModel,
    isLoading, setIsLoading,
    isGeneratingCharacters, setIsGeneratingCharacters,
    isGeneratingSeries, setIsGeneratingSeries,
    generatedScript,
    isSaving, setIsSaving,
    setCurrentScriptId,
    currentScriptId,
    history
  } = useGenerator();

  const handleSaveCurrent = async () => {
    if (!generatedScript || !user) return;
    setIsSaving(true);
    try {
      if (currentScriptId) {
        await updateDoc(doc(db, 'scripts', currentScriptId), {
          script: generatedScript,
          episode: episode,
          session: session,
          updatedAt: serverTimestamp()
        });
      } else {
        const docRef = await addDoc(collection(db, 'scripts'), {
          uid: user.uid,
          prompt: prompt || "Untitled Script",
          script: generatedScript,
          tone: tone,
          audience: audience,
          episode: episode,
          session: session,
          model: selectedModel,
          createdAt: serverTimestamp()
        });
        setCurrentScriptId(docRef.id);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'scripts');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    navigate('/studio/script');
    const script = await generateAnimeScript(prompt, tone, audience, selectedModel, session, episode);
    setGeneratedScript(script);
    setCurrentScriptId(null);
    setIsLoading(false);

    if (user) {
      try {
        const docRef = await addDoc(collection(db, 'scripts'), {
          uid: user.uid,
          prompt: prompt,
          script: script,
          tone: tone,
          audience: audience,
          episode: episode,
          session: session,
          model: selectedModel,
          createdAt: serverTimestamp()
        });
        setCurrentScriptId(docRef.id);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'scripts');
      }
    }
  };

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

  const handleGenerateCharacters = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingCharacters(true);
    navigate('/studio/cast');
    const characters = await generateCharacters(prompt, selectedModel);
    setGeneratedCharacters(characters);
    setIsGeneratingCharacters(false);
  };

  const handleGenerateSeriesPlan = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingSeries(true);
    navigate('/studio/series');
    const plan = await generateSeriesPlan(prompt, selectedModel);
    setGeneratedSeriesPlan(plan);
    setIsGeneratingSeries(false);
  };

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

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <History className="w-4 h-4" /> Recent Scripts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[200px] px-6 py-4">
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((item, idx) => (
                    <button 
                      key={idx}
                      className="w-full text-left group"
                      onClick={() => {
                        setGeneratedScript(item.script);
                        setCurrentScriptId(item.id);
                        navigate('/studio/script');
                      }}
                    >
                      <p className="text-xs font-medium text-zinc-300 group-hover:text-red-400 transition-colors line-clamp-1">{item.title}</p>
                      <p className="text-[10px] text-zinc-600">{item.date}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-600">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-[10px]">No history yet.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Content */}
      <div className="lg:col-span-8">
        <Outlet />
      </div>
    </div>
  );
}
