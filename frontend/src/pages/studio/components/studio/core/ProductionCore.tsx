import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Sparkles,
  Brain,
  X,
  Target,
  Users,
  History,
  PanelRightClose
} from 'lucide-react';
import { useTemplates, getIconComponent } from '@/hooks/useTemplates';
import { cn } from '@/lib/utils';
import TextareaAutosize from 'react-textarea-autosize';
import { useGeneratorState } from '@/hooks/useGenerator';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { StudioSelector } from '@/pages/studio/components/selectors/StudioSelector';
import { EngineSelector } from '@/pages/studio/components/selectors/EngineSelector';
import { ToneSelector } from '@/pages/studio/components/selectors/ToneSelector';


interface ProductionCoreProps {
  isOpen: boolean;
  onToggle: () => void;
  prompt: string;
  setPrompt: (p: string) => void;
  tone: string;
  setTone: (t: string) => void;
  audience: string;
  setAudience: (a: string) => void;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  handleSaveCurrent: () => void;
  isLoading: boolean;
  isSaving: boolean;
  generatedScript: string | null;
  currentScriptId: string | null;
  user: any;
  contentType: string;
  setContentType?: (type: string) => void;
  showNotification?: (msg: string, type: any) => void;
  
  // Optional props
  session?: string;
  setSession?: (s: string) => void;
  episode?: string;
  setEpisode?: (e: string) => void;
  numScenes?: string;
  setNumScenes?: (n: string) => void;
  recapperPersona?: string;
  setRecapperPersona?: (p: string) => void;
  characterRelationships?: string;
  setCharacterRelationships?: (r: string | null) => void;
  worldBuilding?: string;
  setWorldBuilding?: (w: string | null) => void;
  castProfiles?: string;
  setCastProfiles?: (c: string | null) => void;
  handleGenerate?: () => void;
  handleMasterGenerate?: () => void;
  basePath?: string;
  navigate?: any;
  theme?: 'cyan' | 'violet' | 'amber';
  setTheme?: (t: string) => void;
}

export const ProductionCore = React.memo<ProductionCoreProps>((props) => {
  const {
    isOpen,
    onToggle,
    prompt,
    setPrompt,
    tone,
    setTone,
    audience,
    setAudience,
    selectedModel,
    setSelectedModel,
    handleSaveCurrent,
    isLoading,
    isSaving,
    generatedScript,
    currentScriptId,
    user,
    contentType,
    setContentType,
    handleGenerate,
    handleMasterGenerate,
    theme = 'cyan'
  } = props;

  const themeMap = {
    cyan: { 
      primary: 'text-cyan-400', 
      accent: 'text-cyan-500',
      border: 'border-cyan-500/20', 
      bg: 'bg-cyan-500/10',
      glow: 'drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]',
      btn: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/20'
    },
    violet: { 
      primary: 'text-violet-400', 
      accent: 'text-violet-500',
      border: 'border-violet-500/20', 
      bg: 'bg-violet-500/10',
      glow: 'drop-shadow-[0_0_15px_rgba(139,92,246,0.4)]',
      btn: 'bg-violet-600 hover:bg-violet-500 shadow-violet-500/20'
    },
    amber: { 
      primary: 'text-amber-400', 
      accent: 'text-amber-500',
      border: 'border-amber-500/20', 
      bg: 'bg-amber-500/10',
      glow: 'drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]',
      btn: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
    },
  };

  const colors = themeMap[theme] || themeMap.cyan;

  const [localContentType, setLocalContentType] = React.useState(contentType || 'Anime');
  const { templates } = useTemplates();
  const { activeModelAttempt, fallbackHistory } = useGeneratorState();

  React.useEffect(() => {
    if (setContentType) setContentType(localContentType);
  }, [localContentType, setContentType]);

  React.useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  const sidebarContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.aside
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed right-0 top-0 h-screen w-full sm:w-[420px] lg:w-[480px] glass-panel border-l flex flex-col z-[400] shadow-[-20px_0_100px_rgba(0,0,0,1)] overflow-hidden",
              colors.border
            )}
          >
            {/* HEADER SECTION */}
            <div className={cn(
              "p-4 sm:p-8 border-b flex items-center justify-between bg-gradient-to-br from-transparent via-transparent to-transparent shrink-0 relative overflow-hidden",
              colors.border,
              colors.bg
            )}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
              <div className="space-y-1 relative z-10">
                <h1 className={cn(
                  "text-xl font-black uppercase tracking-[0.25em] flex items-center gap-3",
                  colors.primary,
                  colors.glow
                )}>
                  <Brain className="w-5 h-5 animate-pulse" />
                  Creative Engine
                </h1>
                <p className={cn("text-[10px] font-bold uppercase tracking-widest flex items-center gap-2", colors.primary, "opacity-60")}>
                  <span className="w-4 h-[1px] bg-zinc-800" /> System Configuration
                </p>
              </div>
              <button
                onClick={onToggle}
                className={cn("p-2 rounded-lg transition-all", colors.primary, "opacity-40 hover:opacity-100 hover:bg-white/5")}
              >
                <PanelRightClose className="w-5 h-5" />
              </button>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-4 sm:p-6 space-y-4 pb-40">

              {/* NEURAL TELEMETRY */}
              {(isLoading || activeModelAttempt) && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("p-4 border rounded-2xl space-y-3 relative overflow-hidden group", colors.bg, colors.border)}
                >
                  <div className={cn("absolute top-0 left-0 w-1 h-full animate-pulse", colors.accent.replace('text', 'bg'))} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCcw className={cn("w-3 h-3 animate-spin", colors.primary)} />
                      <span className={cn("text-[9px] font-black uppercase tracking-widest", colors.primary)}>AI Connected</span>
                    </div>
                    {fallbackHistory.length > 0 && (
                      <div className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[8px] font-black text-amber-500 uppercase tracking-tighter flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        Fallback Mode
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                      Current: <span className={colors.primary}>{activeModelAttempt || selectedModel}</span>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* SELECT STUDIO TYPE */}
              <StudioSelector 
                value={localContentType} 
                onChange={(val) => { if (val) setLocalContentType(val); }}
                className="mb-6"
              />

              {/* QUICK TEMPLATES */}
              <div className="space-y-2">
                <label className={cn("text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 glow-text", colors.primary)}>
                  <Sparkles className="w-3.5 h-3.5" />
                  QUICK TEMPLATES
                </label>
                <Select
                  key={prompt}
                  onValueChange={(value) => {
                    if (!value) return;
                    const selected = templates.find(t => String(t.id) === value);
                    if (selected) {
                      setPrompt(selected.prompt);
                    }
                  }}
                >
                  <SelectTrigger className={cn("h-10 bg-black/40 text-zinc-200 hover:bg-white/5 transition-all font-bold tracking-widest text-xs uppercase rounded-xl neo-border", colors.border)}>
                    <SelectValue placeholder="Select Blueprint..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800">
                    {templates.map((t) => {
                      const Icon = getIconComponent(t.icon);
                      return (
                        <SelectItem key={t.id} value={String(t.id)}>
                          <div className="flex items-center gap-2">
                            <Icon className={cn("w-3 h-3", t.color)} />
                            <span>{t.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* CONCEPT */}
              <div className="space-y-2">
                <label className={cn("text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-colors glow-text", colors.primary)}>
                  <Target className="w-3.5 h-3.5" />
                  CONCEPT
                </label>
                <div className="relative group">
                  <TextareaAutosize
                    placeholder="Describe your core narrative concept and structural requirements..."
                    className={cn("w-full min-h-[100px] max-h-[300px] overflow-y-auto hide-scrollbar bg-black border focus:border-white/20 text-zinc-100 placeholder:text-zinc-800 rounded-2xl p-4 text-xs font-medium resize-none transition-all shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]", colors.border)}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <button onClick={() => setPrompt('')} className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-white transition-all">
                    <span className="text-[10px] font-black uppercase mr-2">Clear</span>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* ADVANCE CONFIGS */}
              <div className="pt-8 border-t border-zinc-800 grid grid-cols-2 gap-4">
                <EngineSelector 
                  value={selectedModel} 
                  onChange={(val) => { if (val) setSelectedModel(val); }}
                />
                <ToneSelector 
                  value={tone} 
                  onChange={(val) => { if (val) setTone(val); }}
                />
                <div className="space-y-1 col-span-2">
                  <label className={cn("text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2", colors.primary, "opacity-40")}>
                    <Users className="w-3 h-3" /> AUDIENCE
                  </label>
                  <Select value={audience} onValueChange={(val) => { if (val) setAudience(val); }}>
                    <SelectTrigger className={cn("h-9 bg-black border text-zinc-200 text-[10px] font-bold uppercase rounded-xl", colors.border)}>
                      <SelectValue placeholder="Audience" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-800">
                      <SelectItem value="General Fans">General</SelectItem>
                      <SelectItem value="Hardcore Weebs">Hardcore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="pt-8 space-y-4">
                <Button
                  onClick={handleMasterGenerate || handleGenerate}
                  disabled={isLoading || !prompt}
                  className={cn(
                    "btn-genesis w-full h-14 text-[9px] tracking-[0.4em] transition-all",
                    (isLoading || !prompt) && "opacity-20 grayscale pointer-events-none",
                    colors.btn
                  )}
                >
                  <Sparkles className="w-4 h-4 fill-white/20" />
                  GENERATE PRODUCTION PLAN
                </Button>

                {generatedScript && (
                  <Button
                    onClick={handleSaveCurrent}
                    disabled={isSaving || !user}
                    className={cn(
                      "w-full h-12 text-[10px] font-black uppercase tracking-[0.2em] border rounded-xl transition-all flex items-center justify-center gap-3 group",
                      colors.bg, colors.border, colors.primary
                    )}
                  >
                    <History className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    {isSaving ? 'Synchronizing...' : (currentScriptId ? 'Update Manifest' : 'Commit to Library')}
                  </Button>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return sidebarContent;
});
