import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Settings2, 
  Info,
  Users,
  Hash,
  Clapperboard,
  History,
  Zap,
  Target,
  Wand2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import { cn } from '@/lib/utils';
import { QUICK_TEMPLATES } from '@/data/studio/quickTemplates';
import { StudioToolPanels } from './StudioToolPanels';
import { MODEL_GROUPS } from '@/services/geminiService';
import { motion } from 'motion/react';

interface StudioInputPanelProps {
  prompt: string;
  setPrompt: (v: string) => void;
  tone: string;
  setTone: (v: string) => void;
  audience: string;
  setAudience: (v: string) => void;
  session: string;
  setSession: (v: string) => void;
  episode: string;
  setEpisode: (v: string) => void;
  selectedModel: string;
  setSelectedModel: (v: string) => void;
  isLoading: boolean;
  isGeneratingCast: boolean;
  isGeneratingSeries: boolean;
  isGeneratingAll?: boolean;
  canGenerate: boolean;
  onGenerateScript: () => void;
  onGenerateCast: () => void;
  onGenerateSeries: () => void;
  onGenerateAll?: () => void;
  onSaveCurrent: () => void;
  isSaving: boolean;
  hasGeneratedScript: boolean;
  currentScriptId: string | null;
  selectedTool?: string;
  onToolNavigate: (path: string) => void;
}

export function StudioInputPanel({
  prompt, setPrompt,
  tone, setTone,
  audience, setAudience,
  session, setSession,
  episode, setEpisode,
  selectedModel, setSelectedModel,
  isLoading,
  isGeneratingCast,
  isGeneratingSeries,
  isGeneratingAll,
  canGenerate,
  onGenerateScript,
  onGenerateCast,
  onGenerateSeries,
  onGenerateAll,
  onSaveCurrent,
  isSaving,
  hasGeneratedScript,
  currentScriptId,
  selectedTool,
  onToolNavigate
}: StudioInputPanelProps) {
  return (
    <Card className="overflow-hidden border-zinc-800/80 bg-zinc-950/70 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl rounded-[32px] group">
      <div className="h-1.5 w-full bg-zinc-900 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: isLoading ? '70%' : '100%' }}
          className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
        />
      </div>
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-2xl">
                    <Wand2 className="w-5 h-5" />
                </div>
                <div>
                   <CardTitle className="text-xl font-black tracking-tighter uppercase italic">ENGINE CONTROL</CardTitle>
                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Neural Generation Terminal</p>
                </div>
            </div>
            <div className="px-2 py-1 rounded-lg bg-red-600/10 border border-red-500/20 text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                System Ready
            </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 pt-4 space-y-8">
        {/* Templates */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] pl-1">Neural Templates</label>
          <Select
            value={QUICK_TEMPLATES.find((template) => template.prompt === prompt)?.id ?? null}
            onValueChange={(value) => {
              if (!value) return;
              const template = QUICK_TEMPLATES.find((item) => item.id === value);
              if (template) setPrompt(template.prompt);
            }}
          >
            <SelectTrigger className="h-12 w-full border-zinc-800 bg-zinc-900/50 text-zinc-300 shadow-sm transition-all hover:border-zinc-700 hover:bg-zinc-900 rounded-2xl">
              <SelectValue placeholder="Initalize from Preset" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300 rounded-2xl shadow-2xl">
              {QUICK_TEMPLATES.map((template) => (
                <SelectItem key={template.id} value={template.id} className="text-xs focus:bg-red-600/10 focus:text-red-500 my-1 rounded-xl">
                  <div className="flex items-center gap-3 p-1">
                    <div className={cn('p-2 rounded-lg bg-zinc-950 border border-white/5', template.color.replace('text-', 'text-'))}>
                       <template.icon className="h-4 w-4" />
                    </div>
                    <span className="font-bold tracking-tight uppercase">{template.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Input Terminal */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Prompt Terminal</label>
            <button 
              onClick={() => setPrompt('')}
              className="text-[10px] font-black text-zinc-700 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Clear Buffer
            </button>
          </div>
          <div className="relative group">
              <Textarea 
                placeholder="Declare your creative intent..."
                className="min-h-[140px] resize-none border-zinc-900 bg-black/40 text-zinc-200 focus:border-red-500/50 focus:ring-0 rounded-[28px] p-6 text-sm font-medium leading-relaxed italic placeholder:text-zinc-700 shadow-inner"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="absolute top-4 right-4 flex items-center gap-3">
                 <Target className="w-5 h-5 group-focus-within:text-red-500 transition-colors text-zinc-800" />
              </div>
          </div>
        </div>

        {/* Model Selection */}
        <div className="grid grid-cols-1 gap-6">
           <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5" /> Neural Model
                </label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="text-zinc-700 hover:text-red-500 transition-colors">
                            <Info className="w-3.5 h-3.5" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-zinc-950 border-zinc-800 text-zinc-300 p-4 max-w-xs space-y-3 rounded-2xl shadow-2xl">
                            <div className="space-y-2">
                                <p className="font-black text-red-500 text-[10px] tracking-widest uppercase">PRO MODELS UNLOCKED</p>
                                <p className="text-[11px] leading-relaxed text-zinc-500 italic">Advanced neural agents optimized for anime continuity and cinematic pacing.</p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={selectedModel} onValueChange={(value) => value && setSelectedModel(value)}>
                <SelectTrigger className="h-12 border-zinc-900 bg-zinc-900/40 text-zinc-200 hover:border-zinc-700 rounded-2xl shadow-sm">
                  <SelectValue placeholder="Select Neural Agent" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-300 rounded-[24px]">
                  {MODEL_GROUPS.map((group) => (
                    <SelectGroup key={group.name} className="py-2">
                      <SelectLabel className="text-[8px] text-zinc-700 font-black uppercase tracking-[0.3em] px-4 py-2 border-b border-zinc-900 mb-2">{group.name}</SelectLabel>
                      {group.models.map((m) => (
                        <SelectItem key={m.id} value={m.id} className="text-xs focus:bg-red-600/10 focus:text-red-500 mx-2 rounded-xl my-0.5">
                          <div className="flex flex-col gap-0.5 py-1">
                            <span className="font-black tracking-tight uppercase">{m.name}</span>
                            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">{m.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
           </div>
        </div>

        {/* Global Selects */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
             <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] pl-1">Session</label>
             <Select value={session} onValueChange={(value) => value && setSession(value)}>
                <SelectTrigger className="h-11 border-zinc-900 bg-zinc-900/30 text-zinc-300 rounded-xl">
                  <SelectValue placeholder="S01" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                   {[1,2,3,4,5].map(n => <SelectItem key={n} value={n.toString()} className="rounded-lg">S0{n}</SelectItem>)}
                </SelectContent>
             </Select>
             <Select value={tone} onValueChange={(value) => value && setTone(value)}>
                <SelectTrigger className="h-11 border-zinc-900 bg-zinc-900/30 text-zinc-300 rounded-xl">
                  <SelectValue placeholder="Select Tone" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                  <SelectItem value="Hype/Energetic" className="rounded-lg italic">Hype / Energetic</SelectItem>
                  <SelectItem value="Dark/Gritty" className="rounded-lg italic">Dark / Gritty</SelectItem>
                  <SelectItem value="Emotional/Sad" className="rounded-lg italic">Emotional / Sad</SelectItem>
                </SelectContent>
             </Select>
          </div>
          <div className="space-y-3">
             <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] pl-1">Demographic</label>
             <Select value={audience} onValueChange={(value) => value && setAudience(value)}>
                <SelectTrigger className="h-11 border-zinc-900 bg-zinc-900/30 text-zinc-300 rounded-xl">
                  <SelectValue placeholder="Select Target" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                  <SelectItem value="General Fans" className="rounded-lg italic">General Fans</SelectItem>
                  <SelectItem value="Hardcore Creators" className="rounded-lg italic">Hardcore Creators</SelectItem>
                </SelectContent>
             </Select>
          </div>
        </div>

        {/* Tools Section */}
        <div className="pt-4 border-t border-zinc-900/50">
           <StudioToolPanels
              selectedTool={selectedTool as any}
              canGenerate={canGenerate}
              isGeneratingScript={isLoading}
              isGeneratingCast={isGeneratingCast}
              isGeneratingSeries={isGeneratingSeries}
              isGeneratingAll={isGeneratingAll}
              onGenerateScript={onGenerateScript}
              onGenerateCast={onGenerateCast}
              onGenerateSeries={onGenerateSeries}
              onGenerateAll={onGenerateAll}
              onOpenStoryboard={() => onToolNavigate('/studio/storyboard')}
              onOpenSeo={() => onToolNavigate('/studio/seo')}
              onOpenPrompts={() => onToolNavigate('/studio/prompts')}
              onOpenWhatIf={() => onToolNavigate('/studio/whatif')}
              onOpenAudio={() => onToolNavigate('/studio/audio')}
              onOpenExport={() => onToolNavigate('/studio/export')}
              onOpenExample={() => onToolNavigate('/studio/example')}
              onOpenTemplate={() => onToolNavigate('/studio/template')}
              onOpenFramework={() => onToolNavigate('/studio/framework')}
            />
        </div>

        {hasGeneratedScript && (
          <Button 
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
            onClick={onSaveCurrent}
            disabled={isSaving}
          >
            {isSaving ? (
                <div className="w-5 h-5 border-2 border-zinc-700 border-t-red-500 rounded-full animate-spin mr-3" />
            ) : (
                <History className="w-4 h-4 mr-3 text-red-500" />
            )}
            {isSaving ? 'COMMITTING...' : (currentScriptId ? 'UPDATE PRODUCTION' : 'COMMIT TO ARCHIVE')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
