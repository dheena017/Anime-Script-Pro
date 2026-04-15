import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Cpu, 
  Settings2, 
  Send, 
  UserPlus, 
  Layers, 
  History, 
  Edit3,
  Info,
  Users,
  Zap,
  Sword,
  Globe,
  Ghost,
  Brain,
  Hash,
  Clapperboard,
  Layout as LayoutIcon,
  Search,
  Image as ImageIcon,
  ScrollText,
  LayoutGrid
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
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateAnimeScript, generateCharacters, generateSeriesPlan } from '@/services/geminiService';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { cn } from '@/lib/utils';

const QUICK_TEMPLATES = [
  { 
    id: 'shonen', 
    label: 'Shonen Battle', 
    icon: Sword, 
    prompt: 'A high-stakes tournament where fighters use elemental powers to determine the next emperor.',
    color: 'text-orange-500'
  },
  { 
    id: 'isekai', 
    label: 'Dark Isekai', 
    icon: Globe, 
    prompt: 'A programmer is reborn in a cruel fantasy world as a minor villain destined to be defeated.',
    color: 'text-purple-500'
  },
  { 
    id: 'cyberpunk', 
    label: 'Cyberpunk', 
    icon: Zap, 
    prompt: 'A street racer in a neon-lit megacity uncovering a corporate conspiracy involving digital souls.',
    color: 'text-cyan-500'
  },
  { 
    id: 'slice', 
    label: 'Slice of Life', 
    icon: Ghost, 
    prompt: 'A group of high school students starting an occult research club in a genuinely haunted school.',
    color: 'text-green-500'
  },
  { 
    id: 'psych', 
    label: 'Psychological', 
    icon: Brain, 
    prompt: 'A detective who can enter the dreams of suspects to find the truth behind a series of impossible crimes.',
    color: 'text-blue-500'
  },
];

export function StudioLayout() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
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
    if (!prompt.trim()) return;
    setIsLoading(true);
    navigate('/studio/script');
    const script = await generateAnimeScript(prompt, tone, audience, selectedModel);
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
                    <button
                      key={template.id}
                      onClick={() => setPrompt(template.prompt)}
                      className="flex items-center gap-2 px-3 py-2 bg-black/40 hover:bg-zinc-800 border border-zinc-800 rounded-md transition-all group text-left"
                    >
                      <template.icon className={cn("w-3 h-3 transition-transform group-hover:scale-110", template.color)} />
                      <span className="text-[10px] font-medium text-zinc-400 group-hover:text-zinc-200">{template.label}</span>
                    </button>
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
                <Textarea 
                  placeholder="e.g., A dark fantasy about a vessel for a monster king..."
                  className="min-h-[120px] bg-black/50 border-zinc-800 focus:border-red-500/50 focus:ring-red-500/20 resize-none text-zinc-200"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
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
                    <SelectItem value="gemini-3-flash-preview">Gemini 3 Flash (Fast)</SelectItem>
                    <SelectItem value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Smart)</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o (OpenAI)</SelectItem>
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

              <div className="grid grid-cols-3 gap-2 pt-2">
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white border-none shadow-[0_0_15px_rgba(220,38,38,0.2)] text-xs h-9"
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Send className="w-3 h-3" />
                      Script
                    </div>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 text-xs h-9"
                  onClick={handleGenerateCharacters}
                  disabled={isGeneratingCharacters || !prompt.trim()}
                >
                  {isGeneratingCharacters ? (
                    <div className="w-3 h-3 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <UserPlus className="w-3 h-3" />
                      Cast
                    </div>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 text-xs h-9"
                  onClick={handleGenerateSeriesPlan}
                  disabled={isGeneratingSeries || !prompt.trim()}
                >
                  {isGeneratingSeries ? (
                    <div className="w-3 h-3 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3 h-3" />
                      Series
                    </div>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 text-xs h-9"
                  onClick={() => navigate('/studio/storyboard')}
                >
                  <div className="flex items-center gap-1.5">
                    <LayoutIcon className="w-3 h-3" />
                    Storyboard
                  </div>
                </Button>
                <Button 
                  variant="outline"
                  className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 text-xs h-9"
                  onClick={() => navigate('/studio/seo')}
                >
                  <div className="flex items-center gap-1.5">
                    <Search className="w-3 h-3" />
                    SEO
                  </div>
                </Button>
                <Button 
                  variant="outline"
                  className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 text-xs h-9"
                  onClick={() => navigate('/studio/prompts')}
                >
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3" />
                    Prompts
                  </div>
                </Button>
                <Button 
                  variant="outline"
                  className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 text-xs h-9"
                  onClick={() => navigate('/studio/template')}
                >
                  <div className="flex items-center gap-1.5">
                    <ScrollText className="w-3 h-3" />
                    Template
                  </div>
                </Button>
                <Button 
                  variant="outline"
                  className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 text-xs h-9"
                  onClick={() => navigate('/studio/framework')}
                >
                  <div className="flex items-center gap-1.5">
                    <LayoutGrid className="w-3 h-3" />
                    Framework
                  </div>
                </Button>
              </div>

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

        <Card className="bg-zinc-900/50 border-zinc-800 border-l-2 border-l-red-500/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-red-500" /> Character Studio
            </CardTitle>
            <CardDescription className="text-[10px] text-zinc-500">
              Design professional character sheets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white border-none shadow-[0_0_15px_rgba(220,38,38,0.2)]"
              onClick={handleGenerateCharacters}
              disabled={isGeneratingCharacters || !prompt.trim()}
            >
              {isGeneratingCharacters ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Designing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Generate Detailed Cast</span>
                </div>
              )}
            </Button>
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
