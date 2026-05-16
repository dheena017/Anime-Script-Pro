import { useContext, useEffect, useState } from 'react';
import { useOutletContext, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Settings,
  Cpu, Layout as LayoutGrid, Activity, Zap, Search,
  RefreshCw, Plus, Trash2, ExternalLink
} from 'lucide-react';
import { getIconComponent, useTemplates, Template } from '@/hooks/useTemplates';
import { cn } from '@/lib/utils';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useEngineState, useEngineDispatch } from '@/contexts/generator';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/services/api/projects';
import { studioLog } from '@/lib/studio-logger';
// Context

import { EngineContext } from './EngineLayout';

// Components
import { TemplateCard } from '../Template/TemplateCard';
import { templateStyles as s } from '../Template/templateStyles';
import { VaultView } from '../Template/VaultView';
import { StudioSelector } from '@/pages/studio/components/selectors/StudioSelector';
import { EngineSelector } from '@/pages/studio/components/selectors/EngineSelector';
import { ToneSelector } from '@/pages/studio/components/selectors/ToneSelector';

// Tabs
import { EngineTab } from './tabs/EngineTabs';
import { EngineConsole } from './tabs/EngineConsole';
import { EngineCalibration } from './tabs/EngineCalibration';
import { EngineOptimization } from './tabs/EngineOptimization';
import { EngineLogs } from './tabs/EngineLogs';

export function EnginePage() {
  const { activeTab } = useOutletContext<{ activeTab: EngineTab }>();
  const { setHandlers } = useContext(EngineContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const {
    generatedScript,
    prompt,
    isGeneratingCharacters,
    isGeneratingMetadata,
    isGeneratingImagePrompts,
    isGeneratingWorld,
    isGeneratingVisuals,
  } = useGeneratorState();
  const {
    setIsSaving,
    setCurrentScriptId,
    setPrompt,
    setGeneratedScript,
    syncCore,
  } = useGeneratorDispatch();

  const { tone, selectedModel, contentType: localContentType } = useEngineState();
  const { templates, loading: loadingTemplates } = useTemplates();
  const { projects, loading: loadingProjects, refetch: refetchProjects } = useProjects();
  const { setTone, setSelectedModel, setContentType: setLocalContentType } = useEngineDispatch();
  const { deleteProject } = useProjects();

  const isGeneratingScript = isGeneratingCharacters || isGeneratingMetadata || isGeneratingImagePrompts || isGeneratingWorld || isGeneratingVisuals;

  const handleCreateNew = () => {
    navigate('/projects/new');
  };

  const handleApplyProject = (proj: Project) => {
    setPrompt(proj.prompt || '');
    setLocalContentType(proj.content_type || 'Anime');
    setTone(proj.vibe || 'Hype/Energetic');
    setSelectedModel(proj.model_used || 'Gemini-2.5-Flash');

    setSearchParams({ project_id: proj.id.toString() });
  };

  const handleDeleteProject = async (projectId: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  const handleSaveCurrent = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await syncCore();
      refetchProjects();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Neural Link: Ingest parameters from URL (e.g. from Landing Page or Dashboard redirect)
    const urlPrompt = searchParams.get('prompt');
    const urlStyle = searchParams.get('style');
    const urlTone = searchParams.get('tone') || urlStyle; // Style maps to Tone in this engine
    const urlModel = searchParams.get('model');
    const urlContentType = searchParams.get('type') || searchParams.get('contentType');
    const urlProjectId = searchParams.get('project_id');

    // Handle state from Dashboard navigation
    if (location.state?.projectId && !urlProjectId) {
      setSearchParams({ project_id: location.state.projectId.toString() }, { replace: true });
    }

    if (urlPrompt && urlPrompt !== prompt) {
      setPrompt(urlPrompt);
      studioLog('Engine', `Ingested creative directive: ${urlPrompt.substring(0, 30)}...`, 'info');
    }
    
    if (urlTone && urlTone !== tone) {
      setTone(urlTone);
    }

    if (urlModel && urlModel !== selectedModel) {
      setSelectedModel(urlModel);
    }

    if (urlContentType && urlContentType !== localContentType) {
      setLocalContentType(urlContentType);
    }
  }, [searchParams, location.state]);

  useEffect(() => {
    setHandlers({ handleSaveCurrent, isGenerating: isGeneratingScript });
  }, [generatedScript, user, prompt, tone, selectedModel, isGeneratingScript]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  const selectedTemplate = templates.find((t: Template) => t.id === selectedTemplateId);

  const renderTabContent = () => {
    if (isGeneratingScript) {
      return (
        <div className="flex flex-col items-center justify-center h-[600px] space-y-8">
          <div className="relative">
            <div className="w-20 h-20 border-2 border-studio/20 border-t-studio rounded-full animate-spin shadow-[0_0_50px_rgba(6,182,212,0.3)]" />
            <Cpu className="absolute inset-0 m-auto w-8 h-8 text-studio animate-pulse" />
          </div>
          <div className="text-center space-y-3">
            <p className="font-black tracking-[0.4em] text-xs uppercase text-studio animate-pulse">AI Generation in Progress</p>
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Building your cinematic narrative...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'status':
        const handleGenerate = () => {
          if (!prompt.trim()) return;
          // Determine the correct navigation prefix (project-specific or global studio)
          const pathPrefix = location.pathname.startsWith('/projects/') 
            ? location.pathname.split('/').slice(0, 3).join('/') 
            : '/studio';
            
          studioLog('Engine', `Initializing neural transition to World Builder...`, 'info');
          navigate(`${pathPrefix}/world`);
        }

        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Unified Dashboard Grid */}
            <div className="flex flex-col space-y-12 max-w-7xl mx-auto px-4">
              {/* Phase 1: Technical Configuration */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-10 py-8 bg-[#050505] border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <StudioSelector
                  value={localContentType}
                  onChange={(val) => setLocalContentType(val || 'Anime')}
                />

                <div className="hidden md:block w-px h-16 bg-white/5 relative z-10" />

                <EngineSelector
                  value={selectedModel}
                  onChange={(val) => setSelectedModel(val || 'Gemini-2.5-Flash')}
                />

                <div className="hidden md:block w-px h-16 bg-white/5 relative z-10" />

                <ToneSelector
                  value={tone}
                  onChange={(val) => setTone(val || 'Hype/Energetic')}
                />
              </div>

              {/* Phase 2: DNA Blueprint Matrix (High-Fidelity Cards) */}
              <div className="space-y-8">
                <div className="flex items-center justify-between px-8">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-white uppercase tracking-[0.4em]">Blueprint_Matrix</h4>
                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Select your narrative foundation</p>
                  </div>
                  <LayoutGrid className="w-4 h-4 text-zinc-800" />
                </div>

                <div className="flex items-center gap-8 overflow-x-auto pb-12 px-8 hide-scrollbar scroll-smooth snap-x">
                  {loadingTemplates ? (
                    [1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="min-w-[340px] h-[580px] rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-pulse" />
                    ))
                  ) : (
                    templates.map((t: Template) => {
                      const isActive = prompt === t.prompt;
                      const Icon = getIconComponent(t.icon);
                      // Real-time data mapping from DB
                      const displayImage = t.thumbnail || 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000&auto=format&fit=crop';
                      const displaySubtitle = t.vibe || t.category || 'STRUCTURAL_BLUEPRINT';
                      const displayTags = t.elements?.slice(0, 3) || ['NEURAL_DATA', 'STRUCTURAL'];
                      const displayLogic = t.stats?.complexity || 'STABLE';
                      const displayStability = t.stats?.success || '95%';

                      return (
                        <div
                          key={t.id}
                          className={cn(
                            "group/card relative min-w-[340px] bg-[#080808] border border-white/5 rounded-[2.5rem] transition-all duration-700 overflow-hidden snap-start flex flex-col shadow-2xl",
                            isActive && "border-studio/30 ring-1 ring-studio/20 shadow-[0_0_60px_rgba(6,182,212,0.15)] scale-[1.02]"
                          )}
                        >
                          {/* Card Visual Header */}
                          <div className="h-48 relative overflow-hidden">
                            <img
                              src={displayImage}
                              alt={t.name}
                              className="w-full h-full object-cover opacity-60 group-hover/card:scale-110 transition-transform duration-[2s]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />

                            <div className="absolute top-6 left-6 flex items-center gap-2">
                              <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
                                <span className="text-xs font-black text-amber-500 uppercase tracking-[0.2em]">{t.category?.toUpperCase() || 'CORE'}</span>
                              </div>
                            </div>

                            <div className="absolute bottom-4 left-8 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                              <span className="text-xs font-black text-white uppercase tracking-[0.2em] opacity-60">DATABASE_SYNC: READY</span>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-10 space-y-8">
                            <div className="flex items-start justify-between">
                              <div className={cn(
                                "w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-700",
                                isActive ? "bg-studio/10 border-studio/30 text-studio shadow-[0_0_20px_rgba(6,182,212,0.2)]" : "bg-white/5 border-white/5 text-zinc-700"
                              )}>
                                <Icon className="w-7 h-7" />
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-black text-zinc-700 uppercase tracking-[0.2em] block leading-none">ARCHITECTURE</span>
                                <span className="text-sm font-black text-zinc-400 mt-1 block">V{t.id}.0</span>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className={cn(
                                "text-2xl font-black uppercase tracking-tighter leading-none transition-colors duration-500",
                                isActive ? "text-studio" : "text-white"
                              )}>
                                {t.name}
                              </h4>
                              <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">{displaySubtitle}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {displayTags.map((tag: string) => (
                                <div key={tag} className="px-3 py-1.5 bg-studio/5 border border-studio/20 rounded-full">
                                  <span className="text-xs font-black text-studio italic uppercase tracking-widest">{tag}</span>
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <LayoutGrid className="w-3 h-3 text-studio/60" />
                                  <span className="text-xs font-black text-zinc-700 uppercase tracking-widest">LOGIC</span>
                                </div>
                                <span className="text-xs font-black text-white uppercase tracking-widest">{displayLogic}</span>
                              </div>
                              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <Activity className="w-3 h-3 text-studio/60" />
                                  <span className="text-xs font-black text-zinc-700 uppercase tracking-widest">STABILITY</span>
                                </div>
                                <span className="text-xs font-black text-white uppercase tracking-widest">{displayStability}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => setPrompt(t.prompt)}
                              className={cn(
                                "w-full h-14 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500",
                                isActive
                                  ? "bg-white text-black font-black uppercase tracking-[0.2em] text-xs shadow-2xl"
                                  : "bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white border border-white/5 font-black uppercase tracking-[0.2em] text-xs"
                              )}
                            >
                              <Zap className={cn("w-3.5 h-3.5", isActive ? "text-studio" : "text-zinc-700")} />
                              DEPLOY BLUEPRINT
                            </button>

                            <div className="text-center">
                              <span className="text-xs font-black text-zinc-800 uppercase tracking-[0.3em] hover:text-zinc-600 cursor-pointer transition-colors">EXAMINE_TECHNICAL_SPECS</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Phase 3: Narrative Architecture */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-8">
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">AI_Narrative_Architecture</span>
                </div>
                <div className="p-12 bg-[#050505] border border-white/5 rounded-[4rem] shadow-2xl transition-all hover:border-white/10 group/canvas min-h-[550px] max-h-[550px] flex flex-col relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

                  <div className="relative z-10 flex-1 overflow-y-auto hide-scrollbar pr-4">
                    <textarea
                      placeholder="Architect the detailed story arcs, world rules, and cinematic sequences..."
                      className="w-full bg-transparent border-none focus:ring-0 text-white text-xl font-medium resize-none leading-relaxed placeholder:text-zinc-900 tracking-tight min-h-[450px]"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Phase 4: System Initialization */}
              <div className="flex flex-col items-center gap-8 pt-10 pb-32">
                <button
                  onClick={() => handleGenerate()}
                  disabled={isGeneratingScript || !prompt.trim()}
                  className="group/launch relative w-full max-w-3xl h-24 bg-studio rounded-[3rem] flex items-center justify-center gap-6 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale shadow-[0_0_60px_rgba(6,182,212,0.2)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 opacity-0 group-hover/launch:opacity-100 transition-opacity duration-1000 rounded-[3rem]" />
                  <div className="relative z-10 flex items-center gap-6">
                    {isGeneratingScript ? (
                      <RefreshCw className="w-6 h-6 text-black animate-spin" />
                    ) : (
                      <Zap className="w-6 h-6 text-black group-hover/launch:scale-125 transition-transform duration-700" />
                    )}
                    <div className="text-left">
                      <span className="text-xs font-black text-black/60 uppercase tracking-[0.4em] block leading-none mb-1">System Launch Protocol</span>
                      <span className="text-xl font-black text-black uppercase tracking-[0.3em] italic leading-none">Start AI Generation</span>
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-10 opacity-30">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-studio" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Link: Stable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-studio" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Core: Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-studio" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Buffer: Clear</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'template':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center shadow-lg">
                  <LayoutGrid className="w-6 h-6 text-fuchsia-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Blueprint Matrix</h2>
                  <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.3em] mt-2">AI_Assets // Structural_Library</p>
                </div>
              </div>
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-focus-within:text-studio transition-colors" />
                <input
                  type="text"
                  placeholder="Search Narrative DNA..."
                  className="w-full h-11 bg-[#050505] border border-white/5 rounded-xl pl-12 pr-4 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:border-studio/30 transition-all placeholder:text-zinc-800"
                />
              </div>
            </div>

            <div className={s.grid}>
              {templates.map((t: Template, idx: number) => (
                <TemplateCard
                  key={`${t.id}-${idx}`}
                  template={t as any}
                  idx={idx}
                  handleUsePrompt={(p) => {
                    setPrompt(p);
                    setSearchParams({ tab: 'status' });
                  }}
                  setShowTemplateDetails={(id) => setSelectedTemplateId(Number(id))}
                />
              ))}
            </div>

            {selectedTemplate && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                <div className="w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                  <div className="absolute top-8 right-8 z-20">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedTemplateId(null)} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white">
                      <Settings className="w-5 h-5 rotate-45" />
                    </Button>
                  </div>

                  <div className="p-12 overflow-y-auto engine-scrollbar">
                    <div className="flex flex-col md:flex-row gap-12">
                      <div className="w-full md:w-1/3 space-y-6">
                        <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center border shadow-2xl", selectedTemplate.bg, selectedTemplate.border)}>
                          {(() => {
                            const Icon = getIconComponent(selectedTemplate.icon);
                            return <Icon className={cn("w-10 h-10", selectedTemplate.color)} />;
                          })()}
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{selectedTemplate.name}</h2>
                          <p className="text-xs font-black text-studio uppercase tracking-[0.3em]">{selectedTemplate.category} Blueprint</p>
                        </div>
                        <div className="pt-6 space-y-4">
                          {selectedTemplate.stats && Object.entries(selectedTemplate.stats).map(([key, val]) => (
                            <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                              <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{key}</span>
                              <span className="text-xs font-mono font-bold text-white uppercase">{val as string}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Core Directive</h4>
                          <div className="p-8 bg-black border border-white/5 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-studio" />
                            <p className="text-lg text-zinc-300 font-medium leading-relaxed italic">"{selectedTemplate.prompt}"</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">AI Elements</h4>
                          <div className="flex flex-wrap gap-3">
                            {selectedTemplate.elements.map((el: string) => (
                              <span key={el} className="px-5 py-3 bg-studio/10 border border-studio/20 text-studio text-xs font-black uppercase tracking-widest rounded-xl">
                                {el}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-10 flex gap-4">
                          <Button
                            onClick={() => {
                              setPrompt(selectedTemplate.prompt);
                              setSearchParams({ tab: 'status' });
                              setSelectedTemplateId(null);
                            }}
                            className="h-16 px-12 bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase tracking-[0.25em] rounded-full flex-1"
                          >
                            Deploy Foundation
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedTemplateId(null)}
                            className="h-16 px-10 bg-transparent border-zinc-800 text-zinc-500 hover:text-white rounded-full text-xs font-black uppercase tracking-[0.25em]"
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-12">
              <VaultView />
            </div>
          </div>
        );
      case 'console':
        return <EngineConsole />;
      case 'calibration':
        return <EngineCalibration />;
      case 'optimization':
        return <EngineOptimization />;
      case 'logs':
        return <EngineLogs />;
      default:
        return null;
    }
  };

  return (
    <div data-testid="marker-engine-config">
      <Card className={cn(
        "bg-[#030303] overflow-visible rounded-[3rem] relative group/card transition-all duration-700",
        "border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
      )}>
        <div className="w-full p-0">
          <div className="p-8 md:p-12 max-w-[1600px] mx-auto">
            {renderTabContent()}
          </div>
        </div>
      </Card>
    </div>
  );
}



