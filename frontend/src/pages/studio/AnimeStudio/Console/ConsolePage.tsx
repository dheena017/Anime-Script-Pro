import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { apiRequest } from '@/lib/api-utils';
import { PROMPT_REGISTRY } from '@/services/prompts';
import {
  SlidersHorizontal,
  Globe,
  UserPlus,
  Layers,
  ScrollText,
  LayoutGrid,
  Folder,
  Search,
  Brain,
  Play,
  Cpu,
  Zap,
  Save,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Settings,
  Tv,
  CheckCircle2,
  Terminal,
  Activity,
  Maximize2,
  Minimize2,
  BookOpen
} from 'lucide-react';

export function ConsolePage() {
  const state = useGeneratorState();
  const dispatch = useGeneratorDispatch();

  // Unified extract state values
  const {
    prompt, theme, generatedScript, generatedCharacters,
    generatedMetadata, generatedImagePrompts, generatedSeriesPlan,
    generatedDescription, generatedWorld, generatedWorldLore,
    generatedWorldPowers, generatedWorldFactions, generatedWorldArchitecture,
    generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems,
    generatedAltText, recapperPersona, episode, session, numScenes,
    isLoading, isSaving, currentScriptId, productionSequence,
    generatedGrowthStrategy, generatedDistributionPlan, selectedModel,
    temperature, maxTokens, topP, topK, tone, audience, characterList,
    characterRelationships, storyboardVisuals, storyboardVideos,
    isDemoMode, isGeneratingWorld, isGeneratingCharacters,
    isGeneratingSeries, isGeneratingMetadata, isGeneratingImagePrompts
  } = state;

  const {
    setPrompt, setTone, setAudience, setEpisode, setSession, setNumScenes,
    setSelectedModel, setIsLoading, setIsSaving, setGeneratedScript,
    setGeneratedCharacters, setGeneratedSeriesPlan, setGeneratedWorld,
    setGeneratedWorldLore, setGeneratedWorldPowers, setGeneratedWorldFactions,
    setGeneratedWorldArchitecture, setGeneratedWorldAtlas, setGeneratedWorldCulture,
    setGeneratedWorldSystems, setCurrentScriptId, setCharacterData, setCharacterList,
    setCharacterRelationships, setGeneratedMetadata, setGeneratedImagePrompts,
    addLog, setTheme, setRecapperPersona, syncCore, setGenerationProgress,
    showNotification, loadDemoProject, clearProject, setStoryboardVideos
  } = dispatch;

  // Active section accordion state (which hubs are expanded)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    engine: true,
    world: false,
    cast: false,
    series: false,
    script: false,
    storyboard: false,
    assets: false,
    seo: false,
    prompts: false,
    screening: false
  });

  // Toggle helper
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Expand or collapse all
  const [allExpanded, setAllExpanded] = useState(false);
  const toggleAllSections = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    setExpandedSections({
      engine: nextState,
      world: nextState,
      cast: nextState,
      series: nextState,
      script: nextState,
      storyboard: nextState,
      assets: nextState,
      seo: nextState,
      prompts: nextState,
      screening: nextState
    });
  };

  // Inner-state tabs for specific accordion panels
  const [activeWorldSubTab, setActiveWorldSubTab] = useState<'lore' | 'powers' | 'factions' | 'systems'>('lore');
  const [activePromptSubTab, setActivePromptSubTab] = useState<keyof typeof PROMPT_REGISTRY>('worldPrompts');

  // Direct editing states
  const [promptInput, setPromptInput] = useState(prompt);
  const [scriptEditMode, setScriptEditMode] = useState(false);
  const [scriptInput, setScriptInput] = useState(generatedScript || '');

  // Synchronize internal inputs when context loads or updates
  useEffect(() => {
    setPromptInput(prompt);
  }, [prompt]);

  useEffect(() => {
    setScriptInput(generatedScript || '');
  }, [generatedScript]);

  // Video Compilation HUD States
  const [isCompilingVideo, setIsCompilingVideo] = useState(false);
  const [compiledVideoUrl, setCompiledVideoUrl] = useState<string | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [compileProgressPhase, setCompileProgressPhase] = useState<string>('idle');

  // Trigger Local Video Compilation via Backend
  const handleCompileVideo = async () => {
    if (!prompt.trim()) {
      showNotification?.('Please define a story prompt first to compile visual tracks.', 'error');
      return;
    }
    setIsCompilingVideo(true);
    setCompileError(null);
    setCompiledVideoUrl(null);
    addLog("VIDEO_COMPILER", "INITIALIZED", "Initializing Local Compilation Node...");

    try {
      setCompileProgressPhase('loading');
      await new Promise(r => setTimeout(r, 800));
      
      setCompileProgressPhase('visuals');
      addLog("VIDEO_COMPILER", "RENDERING", "Synthesizing cinematic framing scanlines...");
      await new Promise(r => setTimeout(r, 1200));

      setCompileProgressPhase('integrity');
      addLog("VIDEO_COMPILER", "COMPILING", "Running Ken Burns dynamic zoom scaling...");
      
      // Call live backend endpoint
      const res = await apiRequest<{ success: boolean; videoUrl: string; message?: string }>('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          model: "veo-2.0-generate-001",
          duration: 4
        })
      });

      if (res && res.success && res.videoUrl) {
        setCompiledVideoUrl(res.videoUrl);
        addLog("VIDEO_COMPILER", "SUCCESS", "Local animated scene compiled successfully.");
        showNotification?.('Futuristic visual compiled locally successfully!', 'success');
        
        // Sync to state storyboardVideos
        if (setStoryboardVideos) {
          setStoryboardVideos({ 0: res.videoUrl });
        }
      } else {
        throw new Error(res?.message || 'Video compilation returned empty payload.');
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Local compilation failed.';
      console.error(`MASTER_CONSOLE: Compilation error: ${errMsg}`);
      setCompileError(errMsg);
      addLog("VIDEO_COMPILER", "FAILURE", errMsg);
      showNotification?.(`Compilation Node Failed: ${errMsg}`, 'error');
    } finally {
      setIsCompilingVideo(false);
      setCompileProgressPhase('idle');
    }
  };

  // Propagate command prompt globals
  const handlePropagatePrompt = () => {
    if (!promptInput.trim()) {
      showNotification?.('Story prompt cannot be empty.', 'warning');
      return;
    }
    setPrompt(promptInput);
    addLog("MASTER_CONSOLE", "PROPAGATED", "Global story directive synchronized across all nodes.");
    showNotification?.('Story directive updated across all tabs!', 'success');
  };

  // Sync state script manually
  const handleSaveScriptEdits = () => {
    setGeneratedScript(scriptInput);
    setScriptEditMode(false);
    addLog("SCRIPT_EDITOR", "SAVED", "Script screenplay manifest updated directly.");
    showNotification?.('Script updated successfully!', 'success');
  };

  // Telemetry Checklist Items
  const checkStatus = (val: any) => {
    if (val === undefined || val === null) return 'idle';
    if (typeof val === 'string' && val.trim() === '') return 'idle';
    if (Array.isArray(val) && val.length === 0) return 'idle';
    return 'ready';
  };

  const getTelemetryPipeline = () => {
    return [
      { label: 'Creative Engine Parameters', status: prompt ? 'ready' : 'idle', desc: `Model: ${selectedModel}` },
      { label: 'World Lore Manifest', status: checkStatus(generatedWorld), desc: 'archipelagos, logic, steam mechanics' },
      { label: 'Cast DNA Profiles', status: checkStatus(generatedCharacters), desc: `${characterList?.length || 0} entities designed` },
      { label: 'Episodic Production Roadmap', status: checkStatus(generatedSeriesPlan), desc: '12 episodes structured' },
      { label: 'Screenplay Script Stems', status: checkStatus(generatedScript), desc: generatedScript ? `${generatedScript.length} characters written` : 'Pending dialogue synthesis' },
      { label: 'Visual Prompts Registry', status: checkStatus(generatedImagePrompts), desc: 'frame descriptors compiled' },
      { label: 'Marketing Alt & SEO Stems', status: checkStatus(generatedMetadata), desc: 'Keywords, metadata, tags ready' }
    ];
  };

  return (
    <div className="w-full flex flex-col space-y-8 pb-20 text-zinc-300 font-sans relative" data-testid="master-production-console">
      
      {/* GLOWING AMBIENT LIGHT DECORATIONS */}
      <div className="absolute top-[-50px] right-20 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[200px] left-10 w-[250px] h-[250px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ── TOP HEADER / HUB BANNER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-cyan-900/30 pb-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-white italic drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              Master <span className="text-cyan-400">Production</span> Console
            </h1>
          </div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-loose">
            Integrated neural workspace for holistic anime blueprint synthesis & simulation.
          </p>
        </div>

        {/* Global Hub Master Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={toggleAllSections}
            variant="outline"
            size="sm"
            className="border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider h-10 px-4"
          >
            {allExpanded ? <Minimize2 className="w-3.5 h-3.5 mr-2" /> : <Maximize2 className="w-3.5 h-3.5 mr-2" />}
            {allExpanded ? "Collapse All Panels" : "Expand All Panels"}
          </Button>

          <Button
            onClick={loadDemoProject}
            variant="outline"
            size="sm"
            className="border-purple-900/40 bg-purple-950/20 hover:bg-purple-950/40 text-purple-400 hover:text-purple-300 rounded-xl text-xs font-black uppercase tracking-wider h-10 px-5 shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2 animate-pulse text-purple-400" />
            Load Aetheria Core
          </Button>

          <Button
            onClick={clearProject}
            variant="outline"
            size="sm"
            className="border-red-900/40 bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold uppercase tracking-wider h-10 px-4 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" />
            Wipe sandbox
          </Button>

          <Button
            onClick={() => syncCore()}
            disabled={isLoading || isSaving}
            className="bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-black uppercase tracking-widest h-10 px-6 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] active:scale-95 transition-all duration-300"
          >
            <Save className="w-4 h-4 mr-2" />
            Sync Repository
          </Button>
        </div>
      </div>

      {/* ── PROJECT SUMMARY HUD ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        <Card className="bg-zinc-950/60 backdrop-blur-xl border border-cyan-900/20 p-5 rounded-2xl flex flex-col space-y-2">
          <span className="text-[10px] font-black text-cyan-400/70 tracking-[0.2em] uppercase">Core State Node</span>
          <span className="text-lg font-black text-white uppercase italic">{isDemoMode ? "Aetheria Core Ready" : "Local Sandbox Core"}</span>
          <span className="text-xs text-zinc-500 font-mono tracking-widest">ID: {currentScriptId || "UNREGISTERED"}</span>
        </Card>
        <Card className="bg-zinc-950/60 backdrop-blur-xl border border-cyan-900/20 p-5 rounded-2xl flex flex-col space-y-2">
          <span className="text-[10px] font-black text-purple-400/70 tracking-[0.2em] uppercase">Orchestration Model</span>
          <span className="text-lg font-black text-white uppercase italic">{selectedModel}</span>
          <span className="text-xs text-zinc-500 font-mono tracking-widest">Temp: {temperature} | Tokens: {maxTokens}</span>
        </Card>
        <Card className="bg-zinc-950/60 backdrop-blur-xl border border-cyan-900/20 p-5 rounded-2xl flex flex-col space-y-2">
          <span className="text-[10px] font-black text-emerald-400/70 tracking-[0.2em] uppercase">Production Elements</span>
          <span className="text-lg font-black text-white uppercase italic">{characterList?.length || 0} Active Entities</span>
          <span className="text-xs text-zinc-500 font-mono tracking-widest">{generatedSeriesPlan?.length || 0} Episodes structured</span>
        </Card>
        <Card className="bg-zinc-950/60 backdrop-blur-xl border border-cyan-900/20 p-5 rounded-2xl flex flex-col space-y-2">
          <span className="text-[10px] font-black text-pink-400/70 tracking-[0.2em] uppercase">Script Stems Status</span>
          <span className="text-lg font-black text-white uppercase italic">{generatedScript ? "Written & Synced" : "Pending Stems"}</span>
          <span className="text-xs text-zinc-500 font-mono tracking-widest">{generatedScript ? `${generatedScript.split('\n').length} screenplay lines` : "0 lines parsed"}</span>
        </Card>
      </div>

      {/* ── SPLIT PANEL LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start relative z-10">
        
        {/* ========================================== */}
        {/* LEFT HUD: STATUS FLOWS & COMMAND DIRECTIVE */}
        {/* ========================================== */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          
          {/* Active Command Prompt Box */}
          <Card className="bg-zinc-950/60 backdrop-blur-xl border border-cyan-900/30 p-5 rounded-3xl relative overflow-hidden flex flex-col space-y-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl" />
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)] animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-[0.22em] italic">Neural Global Directives</span>
            </div>
            
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-loose">
              Propagate a new overarching prompt directive down to all production tabs instantly.
            </p>

            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="e.g., A gritty neon steampunk anime centered around dynamic steam alchemy archipelagos..."
              className="w-full h-36 bg-black border border-zinc-800 focus:border-cyan-500/60 text-zinc-300 p-3 rounded-2xl text-xs outline-none resize-none font-mono focus:shadow-[0_0_15px_rgba(6,182,212,0.08)] transition-all placeholder:text-zinc-700"
            />

            <Button
              onClick={handlePropagatePrompt}
              className="w-full bg-zinc-900 border border-cyan-900/30 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl transition-all"
            >
              Propagate Settings
            </Button>
          </Card>

          {/* Telemetry Process Flow Checklist */}
          <Card className="bg-zinc-950/60 backdrop-blur-xl border border-zinc-900 p-6 rounded-3xl flex flex-col space-y-6">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-black text-white uppercase tracking-[0.2em] italic">Telemetry Channels</span>
            </div>

            <div className="flex flex-col space-y-4">
              {getTelemetryPipeline().map((flow, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  {flow.status === 'ready' ? (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)] mt-0.5 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-800 mt-1 shrink-0 bg-black animate-pulse" />
                  )}
                  <div className="flex flex-col space-y-1">
                    <span className={`font-bold uppercase tracking-wider text-[11px] ${flow.status === 'ready' ? 'text-white' : 'text-zinc-600'}`}>
                      {flow.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 leading-normal">{flow.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* System logs */}
          <Card className="bg-zinc-950/60 border border-zinc-900 p-5 rounded-3xl flex flex-col space-y-4 font-mono">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-black text-white uppercase tracking-[0.2em] italic">System Console</span>
            </div>

            <div className="h-44 overflow-y-auto bg-black p-3 rounded-2xl text-[10px] text-zinc-500 flex flex-col space-y-2 scrollbar-thin">
              <div className="text-cyan-500/70 font-bold">&gt; NEURAL REGISTER SYSTEM ACTIVE</div>
              <div className="text-zinc-600">[info] Framework initialised. Base path set.</div>
              {prompt && <div className="text-zinc-500">[sync] Logline parsed: &quot;{prompt.substring(0, 40)}...&quot;</div>}
              {generatedWorld && <div className="text-zinc-400">[loader] 6 Lore vaults synchronized successfully.</div>}
              {characterList && characterList.length > 0 && <div className="text-zinc-400">[entity] {characterList.length} neural characters loaded to DNA ledger.</div>}
              {generatedScript && <div className="text-emerald-500">[complete] Dialogue synthesis successfully synced.</div>}
            </div>
          </Card>

        </div>

        {/* ========================================== */}
        {/* RIGHT PANEL: 10 COMBINED DIMENSION CARD ACCORDIONS */}
        {/* ========================================== */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          
          {/* ACCORDION TRIGGER BANNER */}
          <div className="flex justify-between items-center px-2 py-1 text-xs">
            <span className="font-black text-zinc-500 uppercase tracking-widest">
              Dimension Matrices ({Object.values(expandedSections).filter(Boolean).length}/10 Active)
            </span>
            <span className="text-zinc-600 uppercase font-bold tracking-wider">
              Click any header tab to synthesize details
            </span>
          </div>

          {/* SECTION 1: CREATIVE ENGINE */}
          <Card className={`border transition-all duration-300 rounded-3xl overflow-hidden bg-zinc-950/40 backdrop-blur-xl ${expandedSections.engine ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 'border-zinc-900/60 hover:border-zinc-800'}`}>
            <div 
              onClick={() => toggleSection('engine')}
              className="flex justify-between items-center px-6 py-5 cursor-pointer select-none bg-black/40 hover:bg-black/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal className={`w-4 h-4 ${expandedSections.engine ? 'text-cyan-400 animate-pulse' : 'text-zinc-600'}`} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">01. Creative Engine Config</span>
              </div>
              {expandedSections.engine ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>

            <AnimatePresence initial={false}>
              {expandedSections.engine && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-cyan-900/20 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-loose">
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-1.5">
                        <label className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">Orchestration Model Engine</label>
                        <select
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="bg-black border border-zinc-800 focus:border-cyan-500/60 p-3 rounded-xl text-zinc-300 outline-none"
                        >
                          <option value="gemini-3.1-flash">Gemini 3.1 Flash (Standard speed / recommended)</option>
                          <option value="gemini-3.1-pro">Gemini 3.1 Pro (Premium reasoning / heavy credits)</option>
                          <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash (Legacy speed)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">Artistic Direction Tone</label>
                          <input
                            type="text"
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            placeholder="e.g. Gritty / Analytical"
                            className="bg-black border border-zinc-800 focus:border-cyan-500/60 p-3 rounded-xl text-zinc-300 outline-none"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">Target Viewer Audience</label>
                          <input
                            type="text"
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                            placeholder="e.g. Developers / Shounen"
                            className="bg-black border border-zinc-800 focus:border-cyan-500/60 p-3 rounded-xl text-zinc-300 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-zinc-400 uppercase tracking-wider">Inference Temperature</span>
                          <span className="font-mono text-cyan-400">{temperature}</span>
                        </div>
                        <div className="h-2 bg-black border border-zinc-800 rounded-full relative">
                          <div className="absolute left-0 top-0 h-full bg-cyan-500 rounded-full" style={{ width: `${(temperature || 0) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-zinc-600 leading-normal">
                          Controls creativity vs analytical consistency. Lower is conservative, higher is heavily speculative.
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 border-t border-zinc-900 pt-4 text-center">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-zinc-600 uppercase font-black tracking-wider">Max Output Tokens</span>
                          <span className="text-xs font-bold font-mono mt-1 text-white">{maxTokens || 2048}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-zinc-600 uppercase font-black tracking-wider">Session Token ID</span>
                          <span className="text-xs font-bold font-mono mt-1 text-white">{session || "1"}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-zinc-600 uppercase font-black tracking-wider">Total Stems Depth</span>
                          <span className="text-xs font-bold font-mono mt-1 text-white">{numScenes || "6"} scenes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* SECTION 2: WORLD BUILDER */}
          <Card className={`border transition-all duration-300 rounded-3xl overflow-hidden bg-zinc-950/40 backdrop-blur-xl ${expandedSections.world ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 'border-zinc-900/60 hover:border-zinc-800'}`}>
            <div 
              onClick={() => toggleSection('world')}
              className="flex justify-between items-center px-6 py-5 cursor-pointer select-none bg-black/40 hover:bg-black/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className={`w-4 h-4 ${expandedSections.world ? 'text-cyan-400 animate-pulse' : 'text-zinc-600'}`} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">02. World Lore Builder</span>
              </div>
              {expandedSections.world ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>

            <AnimatePresence initial={false}>
              {expandedSections.world && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-cyan-900/20 space-y-6">
                    <div className="flex border-b border-zinc-900 pb-2 gap-4">
                      {['lore', 'powers', 'factions', 'systems'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveWorldSubTab(tab as any)}
                          className={`text-[10px] font-black uppercase tracking-widest pb-1.5 border-b-2 transition-all ${activeWorldSubTab === tab ? 'text-cyan-400 border-cyan-500' : 'text-zinc-600 border-transparent hover:text-zinc-400'}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {activeWorldSubTab === 'lore' && (
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-zinc-400 uppercase tracking-widest">Chronology of Eras & Mythos</span>
                            <span className="text-[10px] text-zinc-600 font-mono">Dynamic lore content</span>
                          </div>
                          <textarea
                            value={generatedWorldLore || generatedWorld || 'Lore database uninitialized.'}
                            onChange={(e) => setGeneratedWorldLore(e.target.value)}
                            className="w-full h-48 bg-black/60 border border-zinc-800 focus:border-cyan-500/60 p-4 rounded-2xl text-xs font-mono outline-none resize-none leading-relaxed text-zinc-400"
                          />
                        </div>
                      )}
                      
                      {activeWorldSubTab === 'powers' && (
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-zinc-400 uppercase tracking-widest">Alchemical & Magic logic systems</span>
                            <span className="text-[10px] text-zinc-600 font-mono">Powers mechanics database</span>
                          </div>
                          <textarea
                            value={generatedWorldPowers || 'Powers sub-schema uninitialized. Enter custom magic constraints.'}
                            onChange={(e) => setGeneratedWorldPowers(e.target.value)}
                            className="w-full h-48 bg-black/60 border border-zinc-800 focus:border-cyan-500/60 p-4 rounded-2xl text-xs font-mono outline-none resize-none leading-relaxed text-zinc-400"
                          />
                        </div>
                      )}

                      {activeWorldSubTab === 'factions' && (
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-zinc-400 uppercase tracking-widest">Guilds, Empires & Factions manifest</span>
                            <span className="text-[10px] text-zinc-600 font-mono">Sociopolitical configurations</span>
                          </div>
                          <textarea
                            value={generatedWorldFactions || 'Factions sub-schema uninitialized. Outline sociopolitical structures.'}
                            onChange={(e) => setGeneratedWorldFactions(e.target.value)}
                            className="w-full h-48 bg-black/60 border border-zinc-800 focus:border-cyan-500/60 p-4 rounded-2xl text-xs font-mono outline-none resize-none leading-relaxed text-zinc-400"
                          />
                        </div>
                      )}

                      {activeWorldSubTab === 'systems' && (
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-zinc-400 uppercase tracking-widest">Technological and Scientific laws</span>
                            <span className="text-[10px] text-zinc-600 font-mono">Physics and mechanics</span>
                          </div>
                          <textarea
                            value={generatedWorldSystems || 'Scientific sub-schema uninitialized. Outline technical capabilities.'}
                            onChange={(e) => setGeneratedWorldSystems(e.target.value)}
                            className="w-full h-48 bg-black/60 border border-zinc-800 focus:border-cyan-500/60 p-4 rounded-2xl text-xs font-mono outline-none resize-none leading-relaxed text-zinc-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* SECTION 3: CAST DNA */}
          <Card className={`border transition-all duration-300 rounded-3xl overflow-hidden bg-zinc-950/40 backdrop-blur-xl ${expandedSections.cast ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 'border-zinc-900/60 hover:border-zinc-800'}`}>
            <div 
              onClick={() => toggleSection('cast')}
              className="flex justify-between items-center px-6 py-5 cursor-pointer select-none bg-black/40 hover:bg-black/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <UserPlus className={`w-4 h-4 ${expandedSections.cast ? 'text-cyan-400 animate-pulse' : 'text-zinc-600'}`} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">03. Cast DNA Registry</span>
              </div>
              {expandedSections.cast ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>

            <AnimatePresence initial={false}>
              {expandedSections.cast && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-cyan-900/20 space-y-6">
                    {!characterList || characterList.length === 0 ? (
                      <div className="py-8 text-center text-xs text-zinc-500 uppercase tracking-widest">
                        Cast DNA profiles not materialized. Load Aetheria Core to sync characters.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {characterList.map((char: any, idx: number) => (
                          <Card key={idx} className="bg-black/50 border border-zinc-900 p-5 rounded-2xl flex flex-col space-y-3 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
                            <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/5 rounded-full blur-lg" />
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col">
                                <span className="font-black text-xs text-white uppercase tracking-wider">{char.name}</span>
                                <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest mt-1">{char.archetype || char.role || "Entity"}</span>
                              </div>
                              <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">Dynamic alignment: {char.alignment || "Neutral"}</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{char.description || char.traits || "No details synthesized."}</p>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* SECTION 4: SERIES PLAN */}
          <Card className={`border transition-all duration-300 rounded-3xl overflow-hidden bg-zinc-950/40 backdrop-blur-xl ${expandedSections.series ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 'border-zinc-900/60 hover:border-zinc-800'}`}>
            <div 
              onClick={() => toggleSection('series')}
              className="flex justify-between items-center px-6 py-5 cursor-pointer select-none bg-black/40 hover:bg-black/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Layers className={`w-4 h-4 ${expandedSections.series ? 'text-cyan-400 animate-pulse' : 'text-zinc-600'}`} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">04. Episodic Series Plan</span>
              </div>
              {expandedSections.series ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>

            <AnimatePresence initial={false}>
              {expandedSections.series && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-cyan-900/20 space-y-4">
                    {!generatedSeriesPlan || generatedSeriesPlan.length === 0 ? (
                      <div className="py-8 text-center text-xs text-zinc-500 uppercase tracking-widest">
                        Episodic roadmap not structured. Compile core parameters first.
                      </div>
                    ) : (
                      <div className="h-[450px] overflow-y-auto pr-2 flex flex-col space-y-3 scrollbar-thin">
                        {generatedSeriesPlan.map((ep: any, idx: number) => (
                          <div key={idx} className="flex gap-4 items-start bg-black/40 p-4 border border-zinc-900 rounded-2xl hover:border-cyan-500/10 transition-all">
                            <div className="w-10 h-10 shrink-0 bg-cyan-950/20 border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                              <span className="font-mono text-cyan-400 text-xs font-black">{ep.episode || idx + 1}</span>
                            </div>
                            <div className="flex flex-col space-y-1.5 leading-relaxed text-xs">
                              <span className="font-bold text-white uppercase tracking-wider">{ep.title || "Untitled Episode"}</span>
                              <p className="text-zinc-400 leading-normal text-[11px] font-sans">{ep.synopsis || ep.hook || ep.description || "Hook parameters not computed."}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* SECTION 5: SCREENPLAY SCRIPT */}
          <Card className={`border transition-all duration-300 rounded-3xl overflow-hidden bg-zinc-950/40 backdrop-blur-xl ${expandedSections.script ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 'border-zinc-900/60 hover:border-zinc-800'}`}>
            <div 
              onClick={() => toggleSection('script')}
              className="flex justify-between items-center px-6 py-5 cursor-pointer select-none bg-black/40 hover:bg-black/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ScrollText className={`w-4 h-4 ${expandedSections.script ? 'text-cyan-400 animate-pulse' : 'text-zinc-600'}`} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">05. Screenplay Script Dialogue</span>
              </div>
              {expandedSections.script ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>

            <AnimatePresence initial={false}>
              {expandedSections.script && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-cyan-900/20 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-zinc-400 uppercase tracking-widest">Episode 1 Screenplay Script</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (scriptEditMode) {
                            handleSaveScriptEdits();
                          } else {
                            setScriptEditMode(true);
                          }
                        }}
                        className="border-zinc-800 bg-zinc-900 hover:bg-cyan-500/10 text-cyan-400 rounded-xl text-[10px] font-black uppercase tracking-wider"
                      >
                        {scriptEditMode ? "Save Changes Stems" : "Edit Raw Script Stems"}
                      </Button>
                    </div>

                    {!generatedScript ? (
                      <div className="py-8 text-center text-xs text-zinc-500 uppercase tracking-widest">
                        Screenplay dialogues not synthesized. Launch generation.
                      </div>
                    ) : scriptEditMode ? (
                      <textarea
                        value={scriptInput}
                        onChange={(e) => setScriptInput(e.target.value)}
                        className="w-full h-80 bg-black border border-cyan-950 p-4 rounded-2xl text-xs font-mono outline-none resize-none leading-relaxed text-zinc-300"
                      />
                    ) : (
                      <div className="h-80 overflow-y-auto bg-black/60 border border-zinc-900 rounded-2xl p-5 font-mono text-[11px] leading-relaxed text-zinc-400 scrollbar-thin">
                        {generatedScript.split('\n').map((line, idx) => {
                          // Format screenplay syntax
                          let lineClass = "text-zinc-500";
                          if (line.startsWith('SCENE') || line.startsWith('INT.') || line.startsWith('EXT.')) {
                            lineClass = "text-cyan-400 font-black tracking-wider uppercase mt-4 mb-1";
                          } else if (line.match(/^[A-Z\s]+$/)) {
                            lineClass = "text-white font-bold tracking-widest text-center mt-3 mb-0.5";
                          } else if (line.startsWith('(')) {
                            lineClass = "text-purple-400 italic text-center text-[10px]";
                          } else if (line.trim().length > 0) {
                            lineClass = "text-zinc-300 text-left pl-6 pr-6 leading-loose";
                          }
                          return (
                            <div key={idx} className={lineClass}>
                              {line}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* SECTION 6: STORYBOARD */}
          <Card className={`border transition-all duration-300 rounded-3xl overflow-hidden bg-zinc-950/40 backdrop-blur-xl ${expandedSections.storyboard ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 'border-zinc-900/60 hover:border-zinc-800'}`}>
            <div 
              onClick={() => toggleSection('storyboard')}
              className="flex justify-between items-center px-6 py-5 cursor-pointer select-none bg-black/40 hover:bg-black/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className={`w-4 h-4 ${expandedSections.storyboard ? 'text-cyan-400 animate-pulse' : 'text-zinc-600'}`} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">06. Storyboard Cinematic Frames</span>
              </div>
              {expandedSections.storyboard ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>

            <AnimatePresence initial={false}>
              {expandedSections.storyboard && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-cyan-900/20 space-y-4">
                    {!generatedImagePrompts ? (
                      <div className="py-8 text-center text-xs text-zinc-500 uppercase tracking-widest">
                        Cinematic visual prompts not indexed. Synthesize screenplay first.
                      </div>
                    ) : (
                      <div className="h-[450px] overflow-y-auto flex flex-col space-y-4 scrollbar-thin pr-2">
                        {generatedImagePrompts.split('\n').filter(l => l.trim().length > 0).map((row, idx) => (
                          <div key={idx} className="flex gap-4 items-start bg-black/40 p-4 border border-zinc-900 rounded-2xl">
                            <div className="w-12 h-12 shrink-0 bg-purple-950/20 border border-purple-500/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                              <span className="font-mono text-purple-400 text-xs font-bold">#{idx + 1}</span>
                            </div>
                            <div className="flex flex-col space-y-1.5 leading-relaxed text-xs">
                              <span className="font-bold text-white uppercase tracking-wider">Cinematic Frame Directive</span>
                              <p className="text-zinc-400 leading-normal text-[11px] font-sans">{row}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* SECTION 7: ASSETS MANIFEST */}
          <Card className={`border transition-all duration-300 rounded-3xl overflow-hidden bg-zinc-950/40 backdrop-blur-xl ${expandedSections.assets ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 'border-zinc-900/60 hover:border-zinc-800'}`}>
            <div 
              onClick={() => toggleSection('assets')}
              className="flex justify-between items-center px-6 py-5 cursor-pointer select-none bg-black/40 hover:bg-black/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Folder className={`w-4 h-4 ${expandedSections.assets ? 'text-cyan-400 animate-pulse' : 'text-zinc-600'}`} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">07. Assets blueprints gallery</span>
              </div>
              {expandedSections.assets ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>

            <AnimatePresence initial={false}>
              {expandedSections.assets && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-cyan-900/20 space-y-6">
                    <div className="flex flex-col space-y-2">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Neural visual frames</span>
                      <p className="text-[10px] text-zinc-600 leading-relaxed uppercase">
                        Materialized story visual blueprints compiled across standard scene scopes.
                      </p>
                    </div>

                    {Object.keys(storyboardVisuals || {}).length === 0 ? (
                      <div className="py-6 bg-black/50 rounded-2xl border border-zinc-900 text-center text-xs text-zinc-500 uppercase tracking-widest font-mono">
                        No frames indexed. Load Aetheria Core to sync visual databases.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(storyboardVisuals || {}).map(([sceneNum, urls]: any) => (
                          <div key={sceneNum} className="flex flex-col space-y-2 relative group overflow-hidden bg-black rounded-2xl border border-zinc-900 p-2 hover:border-cyan-500/30 transition-all duration-300">
                            <div className="w-full aspect-square bg-zinc-950 rounded-xl overflow-hidden relative">
                              {urls && urls[0] ? (
                                <img
                                  src={urls[0]}
                                  alt={`Scene ${sceneNum}`}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-zinc-600">PENDING_RENDER</div>
                              )}
                            </div>
                            <span className="text-[10px] font-mono font-bold text-center text-zinc-500">SCENE #{parseInt(sceneNum) + 1}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* SECTION 8: SEO & NEXUS */}
          <Card className={`border transition-all duration-300 rounded-3xl overflow-hidden bg-zinc-950/40 backdrop-blur-xl ${expandedSections.seo ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 'border-zinc-900/60 hover:border-zinc-800'}`}>
            <div 
              onClick={() => toggleSection('seo')}
              className="flex justify-between items-center px-6 py-5 cursor-pointer select-none bg-black/40 hover:bg-black/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Search className={`w-4 h-4 ${expandedSections.seo ? 'text-cyan-400 animate-pulse' : 'text-zinc-600'}`} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">08. Marketing SEO Nexus</span>
              </div>
              {expandedSections.seo ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>

            <AnimatePresence initial={false}>
              {expandedSections.seo && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-cyan-900/20 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Compelling Meta Descriptions</span>
                          <div className="bg-black border border-zinc-900 p-4 rounded-2xl text-[11px] font-sans leading-relaxed text-zinc-400">
                            {generatedDescription || "YouTube description metadata not formulated."}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Marketing Alt Visual Tags</span>
                          <div className="bg-black border border-zinc-900 p-4 rounded-2xl text-[11px] font-mono leading-relaxed text-zinc-400">
                            {generatedAltText || "Alternative accessibility descriptions uninitialized."}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Dynamic Growth Strategy Blueprint</span>
                          <div className="bg-black border border-zinc-900 p-4 rounded-2xl text-[11px] font-sans leading-relaxed text-zinc-400 h-44 overflow-y-auto scrollbar-thin">
                            {generatedGrowthStrategy || "Growth hacking analytics uncompiled."}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Marketing keywords cloud</span>
                          <div className="flex flex-wrap gap-2">
                            {generatedMetadata ? (
                              generatedMetadata.split(/,|\s+/).filter(k => k.trim().length > 2).map((k, i) => (
                                <span key={i} className="text-[10px] font-mono font-bold bg-cyan-950/20 text-cyan-400 px-3 py-1 rounded-full border border-cyan-900/30">
                                  #{k.trim().toLowerCase()}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-zinc-600 font-mono">No keywords indexed.</span>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* SECTION 9: PROMPTS REGISTRY */}
          <Card className={`border transition-all duration-300 rounded-3xl overflow-hidden bg-zinc-950/40 backdrop-blur-xl ${expandedSections.prompts ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 'border-zinc-900/60 hover:border-zinc-800'}`}>
            <div 
              onClick={() => toggleSection('prompts')}
              className="flex justify-between items-center px-6 py-5 cursor-pointer select-none bg-black/40 hover:bg-black/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Brain className={`w-4 h-4 ${expandedSections.prompts ? 'text-cyan-400 animate-pulse' : 'text-zinc-600'}`} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">09. Prompts registry catalog</span>
              </div>
              {expandedSections.prompts ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>

            <AnimatePresence initial={false}>
              {expandedSections.prompts && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-cyan-900/20 space-y-6">
                    <div className="flex border-b border-zinc-900 pb-2 gap-4">
                      {Object.keys(PROMPT_REGISTRY).slice(0, 5).map((moduleKey) => (
                        <button
                          key={moduleKey}
                          onClick={() => setActivePromptSubTab(moduleKey as any)}
                          className={`text-[10px] font-black uppercase tracking-widest pb-1.5 border-b-2 transition-all ${activePromptSubTab === moduleKey ? 'text-cyan-400 border-cyan-500' : 'text-zinc-600 border-transparent hover:text-zinc-400'}`}
                        >
                          {moduleKey.replace('Prompts', '')}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4 font-mono text-[11px] leading-relaxed text-zinc-400">
                      <div className="flex flex-col space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-zinc-400 uppercase tracking-widest">Active AI System Instructions</span>
                          <span className="text-[10px] text-zinc-600">Static instruction core file</span>
                        </div>
                        <div className="bg-black p-4 border border-zinc-900 rounded-2xl max-h-52 overflow-y-auto scrollbar-thin">
                          {JSON.stringify((PROMPT_REGISTRY as any)[activePromptSubTab], null, 2) || "Prompt module unavailable."}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* SECTION 10: SCREENING ROOM PREVIEW */}
          <Card className={`border transition-all duration-300 rounded-3xl overflow-hidden bg-zinc-950/40 backdrop-blur-xl ${expandedSections.screening ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 'border-zinc-900/60 hover:border-zinc-800'}`}>
            <div 
              onClick={() => toggleSection('screening')}
              className="flex justify-between items-center px-6 py-5 cursor-pointer select-none bg-black/40 hover:bg-black/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Play className={`w-4 h-4 ${expandedSections.screening ? 'text-cyan-400 animate-pulse' : 'text-zinc-600'}`} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">10. Screening Room compiler</span>
              </div>
              {expandedSections.screening ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>

            <AnimatePresence initial={false}>
              {expandedSections.screening && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-cyan-900/20 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      
                      <div className="md:col-span-2 space-y-4">
                        <div className="w-full aspect-video bg-black/60 border border-zinc-900 rounded-2xl relative overflow-hidden flex items-center justify-center">
                          
                          {isCompilingVideo ? (
                            <div className="flex flex-col items-center justify-center space-y-4 p-4 text-center">
                              <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
                              <span className="text-[10px] font-mono uppercase text-cyan-400 animate-pulse tracking-widest">
                                {compileProgressPhase === 'visuals' ? "Rendering cinematic framing..." : "Compiling Ken Burns MP4..."}
                              </span>
                            </div>
                          ) : compiledVideoUrl ? (
                            <video
                              src={compiledVideoUrl}
                              controls
                              autoPlay
                              loop
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center space-y-3 text-center p-4">
                              <Tv className="w-8 h-8 text-zinc-700 animate-pulse" />
                              <span className="text-[10px] font-mono uppercase text-zinc-600 tracking-widest">Compiler Stage Standby</span>
                            </div>
                          )}

                        </div>

                        {compileError && (
                          <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-2xl text-[10px] font-mono text-red-400">
                            Error compiling neural track: {compileError}
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-1 space-y-4 text-xs leading-relaxed">
                        <span className="font-bold text-zinc-400 uppercase tracking-widest text-[10px]">Cinematic compilation node</span>
                        <p className="text-zinc-500 leading-normal text-[11px] font-sans">
                          Build and animate your story prompt locally into a high-fidelity 4-second MP4 clip. Zero key configuration required!
                        </p>

                        <div className="h-px bg-zinc-900 w-full" />

                        <Button
                          onClick={handleCompileVideo}
                          disabled={isCompilingVideo}
                          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                        >
                          {isCompilingVideo ? "Rendering clip..." : "Compile Scene Clip"}
                        </Button>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

        </div>

      </div>

    </div>
  );
}
