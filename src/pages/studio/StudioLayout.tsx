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
import { QUICK_TEMPLATES } from '@/data/studio/quickTemplates';
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
      <div className="lg:col-span-4 space-y-6">
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-500" />
              Script Generator
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Describe your anime or concept to generate professional content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Quick Templates</label>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_TEMPLATES.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      size="sm"
                      onClick={() => setPrompt(template.prompt)}
                      className={cn(
                        'h-9 w-full justify-start gap-2 rounded-md border-zinc-800 bg-zinc-950/60 px-3 text-left text-xs font-semibold text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-900',
                        prompt === template.prompt && 'border-red-500 bg-red-600/90 text-white hover:border-red-500 hover:bg-red-600'
                      )}
                    >
                      <template.icon
                        className={cn(
                          'h-3.5 w-3.5 transition-transform group-hover/button:scale-110',
                          prompt === template.prompt ? 'text-white' : template.color
                        )}
                      />
                      <span className="truncate">{template.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Concept / Theme</label>
                  <button 
                    onClick={() => setPrompt('')}
                    className="text-[10px] text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="relative">
                  <Textarea 
                    placeholder="e.g., A dark fantasy about a vessel for a monster king..."
                    className="min-h-[120px] bg-black/50 border-zinc-800 focus:border-red-500/50 focus:ring-red-500/20 resize-none text-zinc-200 pr-16"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isLoading}
                    className="absolute bottom-2 right-2 h-6 px-2 text-[10px] font-bold uppercase tracking-wide bg-red-600 hover:bg-red-500 text-white"
                  >
                    {isLoading ? '...' : 'Gen'}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> AI Model
                  </label>
                  <Tooltip>
                    <TooltipTrigger className="text-zinc-500 hover:text-zinc-300 transition-colors">
                      <Info className="w-3 h-3" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-zinc-900 border-zinc-800 text-zinc-300 p-4 max-w-xs space-y-3">
                      <div className="space-y-1">
                        <p className="font-bold text-red-500 text-xs">Gemini 3 Flash</p>
                        <p className="text-[10px] leading-relaxed">Fastest model. Best for quick drafts.</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-red-500 text-xs">Gemini 3.1 Pro</p>
                        <p className="text-[10px] leading-relaxed">Highly intelligent. Best for complex narratives.</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="bg-black/50 border-zinc-800 text-zinc-300">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                    {MODEL_GROUPS.map((group) => (
                      <SelectGroup key={group.name} className="py-2">
                        <SelectLabel className="text-[10px] text-red-500/50 uppercase tracking-widest px-2 py-1">{group.name}</SelectLabel>
                        {group.models.map((m) => (
                          <SelectItem key={m.id} value={m.id} className="text-xs">
                            <div className="flex flex-col gap-0.5">
                              <span>{m.name}</span>
                              <span className="text-[9px] text-zinc-500 font-normal">{m.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Clapperboard className="w-3 h-3" /> Session
                  </label>
                  <Select value={session} onValueChange={setSession}>
                    <SelectTrigger className="bg-black/50 border-zinc-800 text-zinc-300">
                      <SelectValue placeholder="Session" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                      {[1, 2, 3, 4, 5].map(n => (
                        <SelectItem key={n} value={n.toString()}>Session {n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Episode
                  </label>
                  <Select value={episode} onValueChange={setEpisode}>
                    <SelectTrigger className="bg-black/50 border-zinc-800 text-zinc-300">
                      <SelectValue placeholder="Episode" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                        <SelectItem key={n} value={n.toString()}>Episode {n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Settings2 className="w-3 h-3" /> Tone
                  </label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="bg-black/50 border-zinc-800 text-zinc-300">
                      <SelectValue placeholder="Select Tone" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                      <SelectItem value="Hype/Energetic">Hype/Energetic</SelectItem>
                      <SelectItem value="Dark/Gritty">Dark/Gritty</SelectItem>
                      <SelectItem value="Emotional/Sad">Emotional/Sad</SelectItem>
                      <SelectItem value="Funny/Satirical">Funny/Satirical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3" /> Audience
                  </label>
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger className="bg-black/50 border-zinc-800 text-zinc-300">
                      <SelectValue placeholder="Select Audience" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                      <SelectItem value="General Fans">General Fans</SelectItem>
                      <SelectItem value="Hardcore Weebs">Hardcore Weebs</SelectItem>
                      <SelectItem value="Newcomers">Newcomers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <StudioToolPanels
                selectedTool={selectedTool}
                canGenerate={Boolean(prompt.trim())}
                isGeneratingScript={isLoading}
                isGeneratingCast={isGeneratingCharacters}
                isGeneratingSeries={isGeneratingSeries}
                onGenerateScript={handleGenerate}
                onGenerateCast={handleGenerateCharacters}
                onGenerateSeries={handleGenerateSeriesPlan}
                onOpenStoryboard={() => navigate('/studio/storyboard')}
                onOpenSeo={() => navigate('/studio/seo')}
                onOpenPrompts={() => navigate('/studio/prompts')}
                onOpenExample={() => navigate('/studio/example')}
                onOpenTemplate={() => navigate('/studio/template')}
                onOpenFramework={() => navigate('/studio/framework')}
                onOpenWhatIf={() => navigate('/studio/whatif')}
                onOpenAudio={() => navigate('/studio/audio')}
                onOpenExport={() => navigate('/studio/export')}
              />

              {generatedScript && (
                <Button 
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                  onClick={handleSaveCurrent}
                  disabled={isSaving || !user}
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-white rounded-full animate-spin mr-2" />
                  ) : (
                    <History className="w-4 h-4 mr-2" />
                  )}
                  {isSaving ? 'Saving...' : (currentScriptId ? 'Update Script' : 'Save to Library')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

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
