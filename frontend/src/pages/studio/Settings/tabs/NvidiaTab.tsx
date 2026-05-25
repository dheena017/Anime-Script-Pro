import { useEffect, useState, useCallback } from 'react';
import { Cpu, Activity, Loader2, Save, Key, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { settingsService } from '@/services/api/settings';

export function NvidiaTab() {
  const [model, setModel] = useState('nemotron-70b');
  const [temperature, setTemperature] = useState(0.8);
  const [systemPrompt, setSystemPrompt] = useState("You are the ultimate voice dialogue and narration compiler. Focus on rich character voices.");
  const [mode, setMode] = useState('free');

  const [nvidiaKey, setNvidiaKey] = useState('');
  const [dbModels, setDbModels] = useState<any[]>([]);
  const [showKey, setShowKey] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Hydrate from database
  useEffect(() => {
    async function hydrate() {
      try {
        const dbSettings = await settingsService.getSettings();
        if (dbSettings && dbSettings.ai_models) {
          const ai = dbSettings.ai_models;
          if (ai.primary_engine && (ai.primary_engine.includes('nvidia') || ai.primary_engine.includes('nemotron') || ai.primary_engine.includes('orpheus') || ai.primary_engine.includes('canopylabs'))) setModel(ai.primary_engine);
          if (ai.temperature) setTemperature(ai.temperature);
          if (ai.nvidia_system_prompt) setSystemPrompt(ai.nvidia_system_prompt);
          if (ai.nvidia_api_key) setNvidiaKey(ai.nvidia_api_key);
          if (ai.mode) setMode(ai.mode);
        }
        
        const modelsRes = await settingsService.getAIModels();
        if (modelsRes) {
          setDbModels(modelsRes.filter((m: any) => m.provider?.toLowerCase() === 'nvidia'));
        }
      } catch (err) {
        console.error("Failed to hydrate NVIDIA settings:", err);
      } finally {
        setLoading(false);
      }
    }
    hydrate();
  }, []);

  // Sync to cloud settings
  const syncToCloud = useCallback(async (payloadOverrides = {}) => {
    setIsSaving(true);
    try {
      await settingsService.updateSettings({
        ai_models: {
          nvidia_api_key: nvidiaKey,
          nvidia_system_prompt: systemPrompt,
          mode,
          ...payloadOverrides
        }
      });
    } catch (err) {
      console.error("NVIDIA cloud sync failed:", err);
    } finally {
      setIsSaving(false);
    }
  }, [nvidiaKey, systemPrompt, mode]);

  const toggleModel = (newModel: string) => {
    setModel(newModel);
    syncToCloud({ primary_engine: newModel });
  };

  if (loading) {
    return <div className="w-full h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-cyan-400 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      {isSaving && (
        <div className="absolute -top-12 right-0 z-50 flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/50 rounded-full animate-pulse">
          <Save className="w-3 h-3 text-cyan-400" />
          <span className="text-xs font-black uppercase tracking-widest text-white">Syncing Node...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-hidden rounded-[2.5rem]">
            <div className="absolute top-0 right-0 p-40 bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

            <CardHeader className="relative z-10 border-b border-zinc-900 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-white tracking-widest uppercase">NVIDIA Core Node</CardTitle>
                  <CardDescription className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Configure specialized Nemotron reasoning, translation, and high-fidelity speech synthesis nodes.</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-8 pt-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-2">
                    <Activity className="w-3 h-3 text-cyan-400" /> NVIDIA Engines
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    NVIDIA Tiers
                  </span>
                </div>

                {/* Subtitle */}
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 text-xs text-zinc-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-ping shrink-0 bg-cyan-400" />
                    <span className="font-bold uppercase tracking-wider text-[10px] text-zinc-400">
                      Configure your cloud configurations for custom specialized audio dialog.
                    </span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border shrink-0 text-cyan-400 border-cyan-500/20 bg-cyan-500/5">
                    NVIDIA Node
                  </span>
                </div>

                {/* Models Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                  {dbModels.map(engine => {
                    const isSelected = model === engine.model_id;
                    const ringClass = engine.is_free
                      ? "bg-studio/10 border-studio/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-studio transform scale-[1.01]"
                      : "bg-fuchsia-500/10 border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.15)] ring-1 ring-fuchsia-500 transform scale-[1.01]";

                    return (
                      <div
                        key={engine.model_id}
                        onClick={() => toggleModel(engine.model_id)}
                        className={cn(
                          "relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-3 overflow-hidden",
                          isSelected ? ringClass : "bg-black/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <Cpu className={cn("w-5 h-5", isSelected ? (engine.is_free ? "text-studio" : "text-fuchsia-400") : "text-zinc-500")} />
                          <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded border border-cyan-500/20 text-cyan-400 bg-cyan-500/10">
                            NVIDIA
                          </span>
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-white uppercase tracking-widest leading-tight truncate" title={engine.display_name || engine.model_id}>
                            {engine.display_name || engine.model_id}
                          </h5>
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/[0.03]">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight truncate max-w-[120px]" title={engine.model_id}>
                              {engine.model_id}
                            </span>
                            <span className={cn("text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border",
                              engine.is_free 
                                ? "text-studio bg-studio/5 border-studio/20" 
                                : "text-fuchsia-400 bg-fuchsia-400/5 border-fuchsia-400/20"
                            )}>
                              {engine.is_free ? "FREE" : `${(engine.cost_per_token * 1_000_000).toFixed(2)}c/M`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-900">
                <div className="space-y-2 group">
                  <div className="flex justify-between">
                    <label className="text-xs font-black text-white uppercase tracking-widest group-hover:text-cyan-400 transition-colors">Audio Directives Temperature</label>
                    <span className="text-xs text-cyan-400 font-black">{temperature.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.05" value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    onMouseUp={() => syncToCloud()}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-zinc-900 rounded-full appearance-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-900">
                <label className="text-xs font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">NVIDIA Specialty Voice Directives</label>
                <textarea
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xs text-cyan-400 font-mono focus:border-cyan-500/50 focus:outline-none transition-all resize-none"
                  rows={3}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  onBlur={() => syncToCloud()}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-hidden rounded-[2.5rem]">
            <CardHeader className="border-b border-zinc-900 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                  <Key className="w-4 h-4 text-cyan-400" />
                </div>
                <CardTitle className="text-xs font-black text-white uppercase tracking-widest">NVIDIA API Auth</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">NVIDIA API Key</label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={nvidiaKey}
                    onChange={(e) => setNvidiaKey(e.target.value)}
                    onBlur={() => syncToCloud()}
                    placeholder="nvapi-..."
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500/50 focus:outline-none transition-all pr-12 font-mono"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-cyan-400 transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default NvidiaTab;
