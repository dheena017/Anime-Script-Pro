import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
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
  LayoutGrid,
  BookOpen,
  FileText,
  Play,
  Settings,
  Disc,
  SlidersHorizontal,
  ArrowRight,
  Target,
  X
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
import { generateScript, generateCharacters, generateSeriesPlan } from '@/services/geminiService';
import { NARRATIVE_TEMPLATES } from '@/constants';
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

const STUDIO_NAV = [
  { icon: ScrollText, label: 'Script', path: '/script' },
  { icon: UserPlus, label: 'Cast', path: '/cast' },
  { icon: LayoutGrid, label: 'Storyboard', path: '/storyboard' },
  { icon: Layers, label: 'Series ARC', path: '/series' },
  { icon: Search, label: 'SEO', path: '/seo' },
  { icon: ImageIcon, label: 'Prompts', path: '/prompts' },
  { icon: BookOpen, label: 'Template', path: '/template' },
  { icon: FileText, label: 'Framework', path: '/framework' },
  { icon: Play, label: 'Example', path: '/example' },
];

export function StudioLayout({ type }: { type?: string }) {
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
    contentType, setContentType,
    selectedModel, setSelectedModel,
    isLoading, setIsLoading,
    isGeneratingCharacters, setIsGeneratingCharacters,
    isGeneratingSeries, setIsGeneratingSeries,
    generatedScript,
    isSaving, setIsSaving,
    setCurrentScriptId,
    currentScriptId,
    history,
    setGeneratedMetadata,
    narrativeBeats, setNarrativeBeats,
    recapperPersona, setRecapperPersona,
    characterRelationships, setCharacterRelationships,
    visualData, numScenes, setNumScenes
  } = useGenerator();

  React.useEffect(() => {
    if (type) {
      setContentType(type);
    }
  }, [type, setContentType]);

  const basePath = type ? `/${type.toLowerCase()}` : '';

  const handleSaveCurrent = async () => {
    if (!generatedScript || !user) return;
    setIsSaving(true);
    try {
      let scriptIdToUse = currentScriptId;
      if (currentScriptId) {
        await updateDoc(doc(db, 'scripts', currentScriptId), {
          script: generatedScript,
          episode: episode,
          session: session,
          contentType: contentType,
          visualData: visualData,
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
          contentType: contentType,
          model: selectedModel,
          visualData: visualData,
          createdAt: serverTimestamp()
        });
        setCurrentScriptId(docRef.id);
        scriptIdToUse = docRef.id;
      }

      // Save a version snapshot each time
      if (scriptIdToUse) {
        await addDoc(collection(db, 'script_versions'), {
          uid: user.uid,
          scriptId: scriptIdToUse,
          script: generatedScript,
          createdAt: serverTimestamp()
        });
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
    navigate(`${basePath}/script`);
    const script = await generateScript(prompt, tone, audience, session, episode, numScenes, selectedModel, contentType, recapperPersona, narrativeBeats, characterRelationships);
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
          contentType: contentType,
          model: selectedModel,
          recapperPersona: recapperPersona,
          narrativeBeats: narrativeBeats,
          characterRelationships: characterRelationships,
          createdAt: serverTimestamp()
        });
        setCurrentScriptId(docRef.id);

        // Initial version snapshot
        await addDoc(collection(db, 'script_versions'), {
          uid: user.uid,
          scriptId: docRef.id,
          script: script,
          createdAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'scripts');
      }
    }
  };

  const initialMount = React.useRef(true);

  React.useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    if (prompt.trim()) {
      handleGenerate();
    }
  }, [session, episode, contentType]);

  const handleGenerateCharacters = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingCharacters(true);
    navigate(`${basePath}/cast`);
    const characters = await generateCharacters(prompt, selectedModel, contentType);
    setGeneratedCharacters(characters);
    setIsGeneratingCharacters(false);
  };

  const handleGenerateSeriesPlan = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingSeries(true);
    navigate(`${basePath}/series`);
    const plan = await generateSeriesPlan(prompt, selectedModel, contentType);
    setGeneratedSeriesPlan(plan);
    setIsGeneratingSeries(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Input */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="bg-gradient-to-br from-[#111318] to-[#0a0b0e] border-cyan-500/20 shadow-[0_8px_32px_rgba(6,182,212,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
          <CardHeader className="pb-4 relative z-10">
            <CardTitle className="text-base font-black uppercase tracking-[0.15em] flex items-center gap-3 text-cyan-50 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              Production Core
            </CardTitle>
            <CardDescription className="text-cyan-500/60 text-[10px] uppercase tracking-wider font-bold">
              Mission Control / Series Config
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[11px] font-black text-cyan-400/80 uppercase tracking-[0.2em] drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-cyan-500 animate-pulse" />
                    Quick Templates
                  </label>
                  <button 
                    onClick={() => navigate(`${basePath}/template`)}
                    className="text-[10px] text-cyan-500 hover:text-cyan-300 flex items-center gap-1 transition-colors uppercase tracking-widest font-bold bg-cyan-950/30 px-2 py-1 rounded border border-cyan-500/20 hover:border-cyan-400/50"
                  >
                    Browse Library <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <Select onValueChange={(value) => {
                  const template = QUICK_TEMPLATES.find(t => t.id === value);
                  if (template) setPrompt(template.prompt);
                }}>
                  <SelectTrigger className="w-full h-10 rounded-xl bg-[#050505] border-cyan-500/20 text-cyan-100 hover:border-cyan-400/50 shadow-[0_4px_10px_rgba(0,0,0,0.5)] focus:ring-1 focus:ring-cyan-500/50 transition-all text-xs font-bold uppercase tracking-widest">
                    <SelectValue placeholder="Select a template..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950/95 backdrop-blur-2xl border-cyan-500/30 text-cyan-100">
                    {QUICK_TEMPLATES.map((template) => (
                      <SelectItem key={template.id} value={template.id} className="focus:bg-cyan-900/40 focus:text-cyan-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <template.icon className={cn("w-3.5 h-3.5", template.color)} />
                          <span className="text-xs font-bold uppercase tracking-wider">{template.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-cyan-400/80 uppercase tracking-[0.2em] drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] flex items-center gap-2">
                    <Target className="w-3 h-3 text-cyan-500 animate-pulse" />
                    Concept / Theme
                  </label>
                  <button 
                    onClick={() => setPrompt('')}
                    className="text-[10px] text-zinc-500 hover:text-cyan-400 transition-colors uppercase font-bold tracking-[0.2em] flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                </div>
                <Textarea 
                  placeholder="e.g., A dark fantasy about a vessel for a monster king..."
                  className="min-h-[140px] bg-[#020202] border border-cyan-500/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 resize-none text-cyan-50 rounded-xl shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] placeholder:text-zinc-600 transition-all font-medium text-[13px] leading-relaxed p-4"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              {/* STYLED TECHNOLOGICAL DASHBOARD */}
              <div className="relative rounded-2xl bg-[#050505]/50 border border-cyan-500/10 p-5 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden space-y-5">
                {/* Circuit lines background (simulated) */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                
                {/* Info Button top right */}
                <div className="absolute top-4 right-4 z-20">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-950/50 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-900 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                      <Info className="w-3 h-3" />
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-zinc-900 border-zinc-800 text-zinc-300 p-4 max-w-xs space-y-3 z-50">
                      <div className="space-y-1">
                        <p className="font-bold text-cyan-400 text-xs">Gemini 3 Flash</p>
                        <p className="text-[10px] leading-relaxed">Fastest model. Best for quick drafts.</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-cyan-400 text-xs">Gemini 3.1 Pro</p>
                        <p className="text-[10px] leading-relaxed">Highly intelligent. Best for complex narratives.</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="relative z-10 flex flex-col gap-4">
                  {/* Recapper Persona */}
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-zinc-200 uppercase tracking-widest flex items-center gap-1.5 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                       <Brain className="w-4 h-4 text-zinc-300 drop-shadow-md" /> PERSONA
                     </label>
                     <Select value={recapperPersona} onValueChange={setRecapperPersona}>
                       <SelectTrigger className="h-10 w-full rounded-full bg-[#0a0a0a]/80 border-fuchsia-500/30 text-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.1)] hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] focus:ring-1 focus:ring-fuchsia-500/50 transition-all font-semibold tracking-wide text-xs">
                         <SelectValue placeholder="Select Persona" />
                       </SelectTrigger>
                       <SelectContent className="bg-zinc-950/95 border-fuchsia-500/20 text-fuchsia-200">
                         {['Dynamic/Hype', 'Noir/Gritty', 'Analytical/Deep Dive', 'Somber/Reflective'].map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                  </div>

                  {/* Narrative Beats */}
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-zinc-200 uppercase tracking-widest flex items-center gap-1.5 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                       <ScrollText className="w-4 h-4 text-zinc-300 drop-shadow-md" /> NARRATIVE BEATS
                     </label>
                     <div className="flex gap-1 flex-wrap">
                       {Object.entries(NARRATIVE_TEMPLATES).map(([name, template]) => (
                         <Button
                           key={name}
                           variant="outline"
                           size="sm"
                           className="text-[10px] h-6 px-2 bg-zinc-800 border-zinc-700 hover:bg-cyan-950 hover:border-cyan-700 hover:text-cyan-200"
                           onClick={() => setNarrativeBeats(template)}
                         >
                           {name}
                         </Button>
                       ))}
                     </div>
                     <Textarea 
                       placeholder="e.g., Hook -> Backstory -> Climax -> Cliffhanger"
                       className="min-h-[80px] bg-[#020202] border border-zinc-500/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 resize-none text-zinc-300 rounded-xl font-medium text-[12px] p-3"
                       value={narrativeBeats || ''}
                       onChange={(e) => setNarrativeBeats(e.target.value)}
                     />
                  </div>

                  {/* Character Relationships */}
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-zinc-200 uppercase tracking-widest flex items-center gap-1.5 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                       <Users className="w-4 h-4 text-zinc-300 drop-shadow-md" /> RELATIONSHIPS
                     </label>
                     <Textarea 
                       placeholder="e.g., A fears B, C is secretly in love with A"
                       className="min-h-[80px] bg-[#020202] border border-zinc-500/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 resize-none text-zinc-300 rounded-xl font-medium text-[12px] p-3"
                       value={characterRelationships || ''}
                       onChange={(e) => setCharacterRelationships(e.target.value)}
                     />
                  </div>

                  {/* Model - Full Width */}
                  <div className="space-y-2 pr-10">
                     <label className="text-[11px] font-bold text-zinc-200 uppercase tracking-widest flex items-center gap-1.5 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] whitespace-nowrap">
                       <Settings className="w-4 h-4 text-zinc-300 drop-shadow-md" /> AI MODEL
                     </label>
                     <Select value={selectedModel} onValueChange={setSelectedModel}>
                       <SelectTrigger className="h-10 w-full rounded-full bg-[#0a0a0a]/80 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] focus:ring-cyan-500/50 transition-all font-semibold tracking-wide text-xs">
                         <SelectValue placeholder="Select Model" />
                       </SelectTrigger>
                       <SelectContent className="bg-zinc-900 border-zinc-800 text-cyan-300">
                         <SelectItem value="gemini-3-flash-preview">gemini-3-flash-preview</SelectItem>
                         <SelectItem value="gemini-3.1-pro-preview">gemini-3.1-pro-preview</SelectItem>
                         <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                       </SelectContent>
                     </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Session */}
                    <div className="space-y-1 overflow-hidden">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] whitespace-nowrap">
                         <Clapperboard className="w-3 h-3 shrink-0" /> <span className="truncate">SESS</span>
                       </label>
                       <Select value={session} onValueChange={setSession}>
                         <SelectTrigger className="h-8 w-full rounded-lg bg-[#0a0a0a]/80 border-orange-500/30 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.1)] hover:shadow-[0_0_15px_rgba(249,115,22,0.2)] focus:ring-orange-500/50 transition-all font-bold tracking-wide flex justify-center text-center [&>span]:w-full [&>span]:text-center text-[10px]">
                           <SelectValue placeholder="1" />
                         </SelectTrigger>
                         <SelectContent className="bg-zinc-900 border-zinc-800 text-orange-400">
                           {[1, 2, 3, 4, 5].map(n => (
                             <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                    </div>

                    {/* Episode */}
                    <div className="space-y-1 overflow-hidden">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] whitespace-nowrap">
                         <Disc className="w-3 h-3 shrink-0" /> <span className="truncate">EP</span>
                       </label>
                       <Select value={episode} onValueChange={setEpisode}>
                         <SelectTrigger className="h-8 w-full rounded-lg bg-[#0a0a0a]/80 border-fuchsia-500/30 text-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.1)] hover:shadow-[0_0_15px_rgba(217,70,239,0.2)] focus:ring-fuchsia-500/50 transition-all font-bold tracking-wide flex justify-center text-center [&>span]:w-full [&>span]:text-center text-[10px]">
                           <SelectValue placeholder="1" />
                         </SelectTrigger>
                         <SelectContent className="bg-zinc-900 border-zinc-800 text-fuchsia-400">
                           {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                             <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                    </div>
                    
                    {/* Scenes */}
                    <div className="space-y-1 overflow-hidden">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] whitespace-nowrap">
                         <LayoutGrid className="w-3 h-3 shrink-0" /> <span className="truncate">SCENES</span>
                       </label>
                       <Select value={numScenes} onValueChange={setNumScenes}>
                         <SelectTrigger className="h-8 w-full rounded-lg bg-[#0a0a0a]/80 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] focus:ring-cyan-500/50 transition-all font-bold tracking-wide flex justify-center text-center [&>span]:w-full [&>span]:text-center text-[10px]">
                           <SelectValue placeholder="6" />
                         </SelectTrigger>
                         <SelectContent className="bg-zinc-900 border-zinc-800 text-cyan-400">
                           {[4, 6, 8, 10, 12].map(n => (
                             <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     {/* Tone */}
                     <div className="space-y-2 overflow-hidden">
                       <label className="text-[11px] font-bold text-zinc-200 uppercase tracking-widest flex items-center gap-1.5 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] whitespace-nowrap">
                         <SlidersHorizontal className="w-4 h-4 shrink-0 text-zinc-300 drop-shadow-md" /> <span className="truncate">TONE</span>
                       </label>
                       <Select value={tone} onValueChange={setTone}>
                         <SelectTrigger className="h-10 w-full rounded-full bg-[#0a0a0a]/80 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] focus:ring-purple-500/50 transition-all font-bold tracking-wide text-xs">
                           <SelectValue placeholder="Select Tone" />
                         </SelectTrigger>
                         <SelectContent className="bg-zinc-900 border-zinc-800 text-purple-400">
                           <SelectItem value="Hype/Energetic">Hype/Energetic</SelectItem>
                           <SelectItem value="Dark/Gritty">Dark/Gritty</SelectItem>
                           <SelectItem value="Emotional/Sad">Emotional/Sad</SelectItem>
                           <SelectItem value="Funny/Satirical">Funny/Satirical</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     {/* Audience */}
                     <div className="space-y-2 overflow-hidden">
                       <label className="text-[11px] font-bold text-zinc-200 uppercase tracking-widest flex items-center gap-1.5 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] whitespace-nowrap">
                         <Users className="w-4 h-4 shrink-0 text-zinc-300 drop-shadow-md" /> <span className="truncate">AUDIENCE</span>
                       </label>
                       <Select value={audience} onValueChange={setAudience}>
                         <SelectTrigger className="h-10 w-full rounded-full bg-[#0a0a0a]/80 border-teal-500/50 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.2)] hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] focus:ring-teal-500/50 transition-all font-bold tracking-wide text-[10px] sm:text-xs">
                           <SelectValue placeholder="Select Audience" />
                         </SelectTrigger>
                         <SelectContent className="bg-zinc-900 border-zinc-800 text-teal-400">
                           <SelectItem value="General Fans">General Fans</SelectItem>
                           <SelectItem value="Hardcore Weebs">Hardcore Weebs</SelectItem>
                           <SelectItem value="Newcomers">Newcomers</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                  </div>
                </div>

                {/* Generate Button moved slightly inside */}
                <div className="pt-4 relative z-10">
                <Button 
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white border-none shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] font-black tracking-widest uppercase text-xs h-11 transition-all"
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Generate Production Script
                    </div>
                  )}
                </Button>
              </div>

              {generatedScript && (
                <Button 
                  className="w-full relative z-10 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 h-10 text-xs font-bold tracking-widest uppercase"
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Main Content Area */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Studio Navigation - Technical Production Switcher Style */}
        <div className="flex bg-[#0a0a0a]/80 p-2 rounded-[2rem] border border-cyan-500/20 backdrop-blur-2xl self-start overflow-x-auto no-scrollbar max-w-full shadow-[0_4px_25px_rgba(0,0,0,0.5)] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-cyan-500/50 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
          {STUDIO_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={`${basePath}${item.path}`}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-6 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all whitespace-nowrap relative group border",
                isActive 
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-105 z-10" 
                  : "text-zinc-500 border-transparent hover:border-cyan-500/20 hover:text-cyan-200 hover:bg-white/[0.02]"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-cyan-400" : "text-zinc-600")} />
                  {item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-cyan-500/20 blur-xl -z-10 rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Dynamic Content Container styling applied to children via Outlet */}
        <div className="flex-1 min-h-[800px] bg-gradient-to-br from-[#111318] to-[#0a0b0e] border border-zinc-800 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden relative">
           <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
           <div className="relative z-10 w-full h-full p-2">
             <Outlet />
           </div>
        </div>
      </div>
      
      {/* Session Logs moved to bottom */}
      <div className="lg:col-span-12 mt-4">
        <Card className="bg-gradient-to-br from-[#111318] to-[#0a0b0e] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px]" />
          <CardHeader className="p-5 border-b border-zinc-800/50 relative z-10 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-[0.15em] flex items-center gap-2 text-cyan-100">
              <History className="w-4 h-4 text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" /> Active Session Logs
            </CardTitle>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              {history.length} Entries
            </span>
          </CardHeader>
          <CardContent className="p-0 relative z-10">
            <ScrollArea className="h-48 w-full">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 py-10">
                  <History className="w-10 h-10 mb-4 opacity-20" />
                  <p className="text-xs uppercase tracking-widest font-semibold">No active terminal logs.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/50">
                  {history.map((record, index) => (
                    <div 
                      key={index} 
                      className="p-4 hover:bg-cyan-900/10 transition-colors cursor-pointer group flex items-start gap-4"
                      onClick={() => {
                        setPrompt(record.prompt);
                        setTone(record.tone || 'Hype/Energetic');
                        setAudience(record.audience || 'General Fans');
                        setEpisode(record.episode || '1');
                        setSession(record.session || '1');
                        setContentType(record.contentType || 'youtube');
                        setSelectedModel(record.model || 'gemini-3-flash-preview');
                        if (record.metadata) {
                          setGeneratedMetadata(record.metadata);
                        }
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#0a0a0a] border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all">
                        <span className="text-[10px] font-mono text-cyan-500/70 group-hover:text-cyan-300">{(history.length - index).toString().padStart(2, '0')}</span>
                      </div>
                      <div className="space-y-2 flex-1">
                        <p className="text-xs text-zinc-300 font-medium line-clamp-1 group-hover:text-cyan-200 transition-colors">
                          {record.prompt}
                        </p>
                        <div className="flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-widest">
                          {record.timestamp && (
                            <span className="text-zinc-500 font-mono bg-black/50 px-1.5 py-0.5 rounded border border-zinc-800">
                              {new Date(record.timestamp).toLocaleTimeString()}
                            </span>
                          )}
                          <span className="text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">{record.model || 'Flash'}</span>
                          <span className="text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">{record.tone || 'Action'}</span>
                          <span className="text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">{record.audience || 'General'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
