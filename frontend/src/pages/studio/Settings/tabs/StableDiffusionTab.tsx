import { useEffect, useState, useCallback } from 'react';
import { Sparkles, Wand2, Loader2, Save, Play, Image as ImageIcon, Sliders, Settings, RefreshCw, Cpu, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { callAIImage } from '@/services/generators/core';
import { settingsService } from '@/services/api/settings';
import {
  IMAGE_MODEL_GROUPS,
} from '@/lib/aiModels/imageModels';

export function StableDiffusionTab() {
  const [imageModel, setImageModel] = useState('gemini-3.1-flash-image-preview');
  
  // Synthesis Parameters
  const [cfgScale, setCfgScale] = useState(7.5);
  const [steps, setSteps] = useState(30);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, distorted, extra limbs, bad anatomy, bad hands, text signature');
  const [clipSkip, setClipSkip] = useState(2);
  const [seed, setSeed] = useState(-1);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Playground Sandbox State
  const [prompt, setPrompt] = useState('A cinematic anime storyboard frame, gorgeous cyberpunk samurai standing under neon cherry blossoms, volumetric lighting, highly detailed vector style, 8k resolution');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [synthesisTime, setSynthesisTime] = useState<number | null>(null);
  const [playgroundError, setPlaygroundError] = useState('');

  // Hydrate configurations
  useEffect(() => {
    async function hydrate() {
      try {
        const dbSettings = await settingsService.getSettings();
        if (dbSettings && dbSettings.ai_models) {
          const ai = dbSettings.ai_models;
          if (ai.image_engine) setImageModel(ai.image_engine);
          
          // Hydrate Stable Diffusion custom settings
          if (ai.stable_diffusion) {
            const sd = ai.stable_diffusion;
            if (sd.cfg_scale !== undefined) setCfgScale(sd.cfg_scale);
            if (sd.steps !== undefined) setSteps(sd.steps);
            if (sd.aspect_ratio !== undefined) setAspectRatio(sd.aspect_ratio);
            if (sd.negative_prompt !== undefined) setNegativePrompt(sd.negative_prompt);
            if (sd.clip_skip !== undefined) setClipSkip(sd.clip_skip);
            if (sd.seed !== undefined) setSeed(sd.seed);
          }
        }
      } catch (err) {
        console.error("Failed to hydrate Stable Diffusion settings:", err);
      } finally {
        setLoading(false);
      }
    }
    hydrate();
  }, []);

  // Sync to database
  const syncToCloud = useCallback(async (payloadOverrides = {}) => {
    setIsSaving(true);
    try {
      await settingsService.updateSettings({
        ai_models: {
          image_engine: imageModel,
          stable_diffusion: {
            cfg_scale: cfgScale,
            steps,
            aspect_ratio: aspectRatio,
            negative_prompt: negativePrompt,
            clip_skip: clipSkip,
            seed,
            ...payloadOverrides
          }
        }
      });
    } catch (err) {
      console.error("Stable Diffusion cloud sync failed:", err);
    } finally {
      setIsSaving(false);
    }
  }, [imageModel, cfgScale, steps, aspectRatio, negativePrompt, clipSkip, seed]);

  const selectModel = (id: string) => {
    setImageModel(id);
    setIsSaving(true);
    // Explicit sync inline
    settingsService.updateSettings({
      ai_models: {
        image_engine: id,
        stable_diffusion: {
          cfg_scale: cfgScale,
          steps,
          aspect_ratio: aspectRatio,
          negative_prompt: negativePrompt,
          clip_skip: clipSkip,
          seed
        }
      }
    }).finally(() => setIsSaving(false));
  };

  const handleRatioChange = (ratio: string) => {
    setAspectRatio(ratio);
    // Explicit sync
    setIsSaving(true);
    settingsService.updateSettings({
      ai_models: {
        image_engine: imageModel,
        stable_diffusion: {
          cfg_scale: cfgScale,
          steps,
          aspect_ratio: ratio,
          negative_prompt: negativePrompt,
          clip_skip: clipSkip,
          seed
        }
      }
    }).finally(() => setIsSaving(false));
  };

  const generateSandboxVisual = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setGeneratedImage(null);
    setSynthesisTime(null);
    setPlaygroundError('');

    const startTime = Date.now();
    try {
      const imageData = await callAIImage(prompt, imageModel);
      setGeneratedImage(imageData);
      setSynthesisTime((Date.now() - startTime) / 1000);
    } catch (e: any) {
      console.error("Sandbox generation failed:", e);
      setPlaygroundError(e.message || "Failed to communicate with the generative core. Please ensure your backend is online and keys are authenticated.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="w-full h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-fuchsia-400 animate-spin" /></div>;
  }

  // Model lists categorized
  const googleStudioModels = IMAGE_MODEL_GROUPS.googleStudio;
  const googleVertexModels = IMAGE_MODEL_GROUPS.googleVertex;
  const openWeightModels = IMAGE_MODEL_GROUPS.openWeights;
  const freeApiModels = IMAGE_MODEL_GROUPS.freeApi;
  const webPrototypingModels = IMAGE_MODEL_GROUPS.web;
  const paidHeavyweightModels = IMAGE_MODEL_GROUPS.premium;
  const nicheSpecializedModels = IMAGE_MODEL_GROUPS.niche;
  const aggregatorsModels = IMAGE_MODEL_GROUPS.aggregators;

  const renderModelCard = (item: any) => {
    const isSelected = imageModel === item.id;
    return (
      <div
        key={item.id}
        onClick={() => selectModel(item.id)}
        className={cn(
          "p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 relative overflow-hidden group",
          isSelected 
            ? "bg-fuchsia-500/10 border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.15)] ring-1 ring-fuchsia-500 transform scale-[1.01]" 
            : "bg-black/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40"
        )}
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase text-white tracking-wide">{item.name}</span>
          <span className={cn("px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded border shrink-0",
            isSelected ? "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10" : "text-zinc-500 border-zinc-800 bg-zinc-950"
          )}>
            {item.price}
          </span>
        </div>
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider leading-relaxed">{item.desc}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      {isSaving && (
        <div className="absolute -top-12 right-0 z-50 flex items-center gap-2 px-3 py-1.5 bg-fuchsia-500/20 border border-fuchsia-500/50 rounded-full animate-pulse">
          <Save className="w-3 h-3 text-fuchsia-400" />
          <span className="text-xs font-black uppercase tracking-widest text-white">Syncing Node...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Categorized Model Selector */}
          <Card className="bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-hidden rounded-[2.5rem]">
            <div className="absolute top-0 right-0 p-40 bg-fuchsia-500/5 blur-[150px] rounded-full pointer-events-none" />

            <CardHeader className="relative z-10 border-b border-zinc-900 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.15)]">
                  <ImageIcon className="w-5 h-5 text-fuchsia-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-white tracking-widest uppercase">Image Synthesis Node</CardTitle>
                  <CardDescription className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Configure professional generative image models and samplers.</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-8 pt-8 max-h-[640px] overflow-y-auto pr-1 custom-scrollbar">
              
              {/* Tier 1: Google AI Studio */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-blue-400" /> Google AI Studio (Generous Free SDKs)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {googleStudioModels.map(renderModelCard)}
                </div>
              </div>

              {/* Tier 2: Google Professional Vertex */}
              <div className="space-y-4 pt-4 border-t border-zinc-900/50">
                <h4 className="text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase flex items-center gap-2">
                  <Cpu className="w-3 h-3 text-cyan-400" /> Professional Vertex Tiers (Imagen 4 Series)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {googleVertexModels.map(renderModelCard)}
                </div>
              </div>

              {/* Tier 3: Open Weight Models */}
              <div className="space-y-4 pt-4 border-t border-zinc-900/50">
                <h4 className="text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase flex items-center gap-2">
                  <Wand2 className="w-3 h-3 text-emerald-400" /> Open-Weight Models (Hosting & Full Control)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {openWeightModels.map(renderModelCard)}
                </div>
              </div>

              {/* Tier 4: API Services */}
              <div className="space-y-4 pt-4 border-t border-zinc-900/50">
                <h4 className="text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase flex items-center gap-2">
                  <Activity className="w-3 h-3 text-orange-400" /> API Services (Generous Free Tiers)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {freeApiModels.map(renderModelCard)}
                </div>
              </div>

              {/* Tier 5: Web Prototyping */}
              <div className="space-y-4 pt-4 border-t border-zinc-900/50">
                <h4 className="text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase flex items-center gap-2">
                  <Settings className="w-3 h-3 text-purple-400" /> Web-Based Generators (Aesthetic Prototyping)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {webPrototypingModels.map(renderModelCard)}
                </div>
              </div>

              {/* Tier 6: Premium Heavyweights */}
              <div className="space-y-4 pt-4 border-t border-zinc-900/50">
                <h4 className="text-[10px] font-black tracking-[0.25em] text-fuchsia-400 uppercase flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-fuchsia-400 animate-pulse" /> The Premium Heavyweights (Paid APIs)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paidHeavyweightModels.map(renderModelCard)}
                </div>
              </div>

              {/* Tier 7: Specialized niche */}
              <div className="space-y-4 pt-4 border-t border-zinc-900/50">
                <h4 className="text-[10px] font-black tracking-[0.25em] text-amber-500 uppercase flex items-center gap-2">
                  <Sliders className="w-3 h-3 text-amber-500" /> Specialized & Niche Leaders (SVG Vectors & Typography)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {nicheSpecializedModels.map(renderModelCard)}
                </div>
              </div>

              {/* Tier 8: Aggregators */}
              <div className="space-y-4 pt-4 border-t border-zinc-900/50">
                <h4 className="text-[10px] font-black tracking-[0.25em] text-zinc-400 uppercase flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 text-zinc-400" /> Aggregator APIs (Seamless Multi-Routing)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aggregatorsModels.map(renderModelCard)}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Real-time Sandbox Playground */}
          <Card className="bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-hidden rounded-[2.5rem]">
            <CardHeader className="border-b border-zinc-900 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20">
                  <Play className="w-4 h-4 text-fuchsia-400" />
                </div>
                <div>
                  <CardTitle className="text-xs font-black text-white uppercase tracking-widest">Synthesis Playground Sandbox</CardTitle>
                  <CardDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Execute live sandbox renders immediately with active configuration.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Creative Sandbox Prompt</label>
                <textarea
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xs text-white focus:border-fuchsia-500/50 focus:outline-none transition-all resize-none font-bold"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  type="button"
                  disabled={generating || !prompt.trim()}
                  onClick={generateSandboxVisual}
                  className="w-full sm:w-auto px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-fuchsia-600/10"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Synthesizing Frame...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-white" />
                      Synthesize Sandbox Visual
                    </>
                  )}
                </button>

                {synthesisTime && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/20 font-black uppercase tracking-wider">
                    Compiled in {synthesisTime.toFixed(2)}s
                  </span>
                )}
              </div>

              {playgroundError && (
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-red-400 font-bold uppercase tracking-wider">
                  ⚠️ Error: {playgroundError}
                </div>
              )}

              {generatedImage && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Compiled Sandbox Visual</label>
                  <div className="relative rounded-2xl border border-zinc-800 overflow-hidden bg-black/60 shadow-inner group">
                    <img 
                      src={generatedImage} 
                      alt="Sandbox Generation Result" 
                      className="w-full h-auto object-contain max-h-[480px] transition-transform duration-700 group-hover:scale-[1.01]" 
                    />
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-[8px] text-zinc-400 font-black uppercase tracking-widest">
                      {aspectRatio} • {imageModel.split('-')[0].toUpperCase()}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        <div className="space-y-8">
          
          {/* Aspect Ratios Selector */}
          <Card className="bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-hidden rounded-[2.5rem]">
            <CardHeader className="border-b border-zinc-900 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20">
                  <Sliders className="w-4 h-4 text-fuchsia-400 animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-xs font-black text-white uppercase tracking-widest">Visual Framing</CardTitle>
                  <CardDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Configure aspect ratios and bounding boxes.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Camera Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: '1:1', label: 'Square (1:1)', w: 'h-10 w-10' },
                    { id: '16:9', label: 'Landscape (16:9)', w: 'h-6 w-11' },
                    { id: '9:16', label: 'Portrait (9:16)', w: 'h-11 w-6' },
                    { id: '4:3', label: 'Cinematic (4:3)', w: 'h-8 w-10' },
                  ].map((item) => {
                    const isSelected = aspectRatio === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleRatioChange(item.id)}
                        className={cn(
                          "p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center justify-between gap-3 text-center",
                          isSelected 
                            ? "bg-fuchsia-500/10 border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.15)] ring-1 ring-fuchsia-500 transform scale-[1.02]" 
                            : "bg-black/40 border-zinc-800 hover:border-zinc-700 text-zinc-400"
                        )}
                      >
                        <div className="h-12 flex items-center justify-center">
                          <div className={cn("rounded border border-zinc-700 bg-zinc-900 group-hover:bg-zinc-800 transition-colors", item.w, isSelected && "border-fuchsia-400 bg-fuchsia-500/20")} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hyperparameters Configuration */}
          <Card className="bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-hidden rounded-[2.5rem]">
            <CardHeader className="border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20">
                  <Sliders className="w-4 h-4 text-fuchsia-400" />
                </div>
                <CardTitle className="text-xs font-black text-white uppercase tracking-widest">Hyperparameters</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* CFG Scale */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">CFG Guidance Scale</label>
                  <span className="text-xs text-fuchsia-400 font-black">{cfgScale.toFixed(1)}</span>
                </div>
                <input
                  type="range" min="1" max="20" step="0.5" value={cfgScale}
                  onChange={(e) => setCfgScale(parseFloat(e.target.value))}
                  onMouseUp={() => syncToCloud()}
                  className="w-full accent-fuchsia-500 cursor-pointer h-1 bg-zinc-900 rounded-full appearance-none"
                />
              </div>

              {/* Steps */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Inference Steps</label>
                  <span className="text-xs text-fuchsia-400 font-black">{steps}</span>
                </div>
                <input
                  type="range" min="10" max="100" step="1" value={steps}
                  onChange={(e) => setSteps(parseInt(e.target.value))}
                  onMouseUp={() => syncToCloud()}
                  className="w-full accent-fuchsia-500 cursor-pointer h-1 bg-zinc-900 rounded-full appearance-none"
                />
              </div>

              {/* Clip Skip */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Clip Skip</label>
                  <span className="text-xs text-fuchsia-400 font-black">{clipSkip}</span>
                </div>
                <input
                  type="range" min="1" max="4" step="1" value={clipSkip}
                  onChange={(e) => setClipSkip(parseInt(e.target.value))}
                  onMouseUp={() => syncToCloud()}
                  className="w-full accent-fuchsia-500 cursor-pointer h-1 bg-zinc-900 rounded-full appearance-none"
                />
              </div>

              {/* Seed */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Seed</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(parseInt(e.target.value))}
                    onBlur={() => syncToCloud()}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-fuchsia-500/50 focus:outline-none transition-all font-mono"
                  />
                  <button
                    onClick={() => {
                      const newSeed = Math.floor(Math.random() * 10000000);
                      setSeed(newSeed);
                      syncToCloud({ seed: newSeed });
                    }}
                    className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-black uppercase rounded-xl transition-all tracking-widest text-zinc-400 hover:text-white shrink-0"
                  >
                    🎲
                  </button>
                </div>
              </div>

              {/* Negative Prompt */}
              <div className="space-y-3 pt-4 border-t border-zinc-900">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Negative Prompt Injector</label>
                <textarea
                  className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-xs text-zinc-400 focus:border-fuchsia-500/50 focus:outline-none transition-all resize-none leading-relaxed"
                  rows={3}
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  onBlur={() => syncToCloud()}
                />
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StableDiffusionTab;
