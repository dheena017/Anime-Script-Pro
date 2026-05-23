import { useEffect, useState, useCallback } from 'react';
import { Cpu, BrainCircuit, Activity, Sparkles, Wand2, Loader2, Save, Key, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { settingsService } from '@/services/api/settings';
import { ExternalModelNetwork } from '@/pages/settings/ExternalModelNetwork';
import { GeminiStatusCard } from '@/pages/settings/GeminiStatusCard';
import { getAIClient } from '@/services/generators/core';

export function AISynthesisTab() {
  const [model, setModel] = useState('gemini-2.0-flash');
  const [temperature, setTemperature] = useState(0.85);
  const [swarmMode, setSwarmMode] = useState(false);
  const [enforcer, setEnforcer] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState("You are the Ultimate Production Architect. Never output generic anime tropes. Always utilize 'Show, Don't Tell' rules. Treat every action line as a highly detailed camera directive.");

  const [mode, setMode] = useState('free');
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [nvidiaKey, setNvidiaKey] = useState('');
  const [dbModels, setDbModels] = useState<any[]>([]);

  const [showKey, setShowKey] = useState(false);
  const [showOpenai, setShowOpenai] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);
  const [showGroq, setShowGroq] = useState(false);
  const [showNvidia, setShowNvidia] = useState(false);

  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testError, setTestError] = useState('');

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Hydrate configurations from PostgreSQL via FastAPI
  useEffect(() => {
    async function hydrate() {
      try {
        const dbSettings = await settingsService.getSettings();
        if (dbSettings && dbSettings.ai_models) {
          const ai = dbSettings.ai_models;
          if (ai.primary_engine) setModel(ai.primary_engine);
          if (ai.temperature) setTemperature(ai.temperature);
          if (ai.swarm_mode !== undefined) setSwarmMode(ai.swarm_mode);
          if (ai.cinematic_enforcer !== undefined) setEnforcer(ai.cinematic_enforcer);
          if (ai.system_prompt) setSystemPrompt(ai.system_prompt);
          if (ai.gemini_api_key) setGeminiKey(ai.gemini_api_key);
          if (ai.openai_api_key) setOpenaiKey(ai.openai_api_key);
          if (ai.anthropic_api_key) setAnthropicKey(ai.anthropic_api_key);
          if (ai.groq_api_key) setGroqKey(ai.groq_api_key);
          if (ai.nvidia_api_key) setNvidiaKey(ai.nvidia_api_key);
          if (ai.mode) setMode(ai.mode);
        }
        
        // Dynamic fetch of all active AI models from database
        const modelsRes = await settingsService.getAIModels();
        if (modelsRes) {
          setDbModels(modelsRes);
        }
      } catch (err) {
        console.error("Failed to hydrate settings:", err);
      } finally {
        setLoading(false);
      }
    }
    hydrate();
  }, []);

  // Atomic Cloud Sync
  const syncToCloud = useCallback(async (payloadOverrides = {}) => {
    setIsSaving(true);
    try {
      if (geminiKey) {
        localStorage.setItem('gemini_api_key', geminiKey);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
      await settingsService.updateSettings({
        ai_models: {
          primary_engine: model,
          temperature,
          swarm_mode: swarmMode,
          cinematic_enforcer: enforcer,
          system_prompt: systemPrompt,
          gemini_api_key: geminiKey,
          openai_api_key: openaiKey,
          anthropic_api_key: anthropicKey,
          groq_api_key: groqKey,
          nvidia_api_key: nvidiaKey,
          mode,
          ...payloadOverrides
        }
      });
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setIsSaving(false);
    }
  }, [model, temperature, swarmMode, enforcer, systemPrompt, geminiKey, openaiKey, anthropicKey, groqKey, nvidiaKey, mode]);

  const handleModeToggle = (newMode: string) => {
    setMode(newMode);
    syncToCloud({ mode: newMode });
  };

  const getModelsByProvider = (providerName: string, fallbackText: string) => {
    const matched = dbModels
      .filter(m => m.provider?.toLowerCase() === providerName.toLowerCase() && m.is_active)
      .map(m => m.display_name || m.model_id);
    if (matched.length === 0) return fallbackText;
    return `Powers: ${matched.slice(0, 3).join(', ')}${matched.length > 3 ? '...' : ''}`;
  };

  const clearBrowserKey = async () => {
    localStorage.removeItem('gemini_api_key');
    setGeminiKey('');
    setTestStatus('idle');
    setTestError('');
    await syncToCloud({ gemini_api_key: '' });
  };

  const testConnection = async () => {
    if (!geminiKey) return;
    setIsTesting(true);
    setTestStatus('idle');
    setTestError('');

    try {
      const client = getAIClient(geminiKey);
      if (!client) throw new Error("Failed to initialize client");

      const models = await client.models.list();
      if (models) {
        setTestStatus('success');
      } else {
        throw new Error("No response from Gemini API");
      }
    } catch (e: any) {
      console.error("Gemini API Test Failed:", e);
      setTestStatus('error');
      setTestError(e.message || "Authentication failed. Check your API key and network connection.");
    } finally {
      setIsTesting(false);
    }
  };

  const toggleModel = (newModel: string) => { setModel(newModel); syncToCloud({ primary_engine: newModel }); };
  const toggleSwarm = () => { const n = !swarmMode; setSwarmMode(n); syncToCloud({ swarm_mode: n }); };
  const toggleEnforcer = () => { const n = !enforcer; setEnforcer(n); syncToCloud({ cinematic_enforcer: n }); };

  if (loading) {
    return <div className="w-full h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-studio animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      {isSaving && (
        <div className="absolute -top-12 right-0 z-50 flex items-center gap-2 px-3 py-1.5 bg-studio/20 border border-studio/50 rounded-full animate-pulse transition-all">
          <Save className="w-3 h-3 text-studio" />
          <span className="text-xs font-black uppercase tracking-widest text-white">Syncing to Cluster...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-hidden group rounded-[2.5rem]">
            <div className="absolute top-0 right-0 p-40 bg-studio/10 blur-[150px] rounded-full pointer-events-none" />

            <CardHeader className="relative z-10 border-b border-zinc-900 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-studio/10 rounded-xl border border-studio/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <BrainCircuit className="w-5 h-5 text-studio" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-white tracking-widest uppercase">AI Core Architecture</CardTitle>
                  <CardDescription className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Configure LLMs, token budgets, and secondary agent pipelines.</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-8 pt-8">
              <div className="space-y-4">
                <h4 className="text-xs font-black tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-2">
                  <Activity className="w-3 h-3 text-studio" /> Primary Inference Engine
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', desc: 'Max compute for complex lore.', badge: 'Production' },
                    { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', desc: 'High velocity synthesis.', badge: 'Standard' },
                    { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', desc: 'Next-gen reasoning speed.', badge: 'Advanced' }
                  ].map(engine => (
                    <div
                      key={engine.id}
                      onClick={() => toggleModel(engine.id)}
                      className={cn(
                        "relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-4 overflow-hidden",
                        model === engine.id ? "bg-studio/10 border-studio/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] transform scale-[1.02] ring-1 ring-studio" : "bg-black/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <Cpu className={cn("w-6 h-6", model === engine.id ? "text-studio" : "text-zinc-500")} />
                        <span className="px-2 py-0.5 bg-zinc-800 text-xs font-black uppercase tracking-widest text-white rounded">{engine.badge}</span>
                      </div>
                      <div>
                        <h5 className="text-sm font-black text-white uppercase tracking-widest">{engine.label}</h5>
                        <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-tight">{engine.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-900">
                <div className="space-y-8">
                  <div className="space-y-2 group">
                    <div className="flex justify-between">
                      <label className="text-xs font-black text-white uppercase tracking-widest group-hover:text-studio transition-colors">Model Temperature</label>
                      <span className="text-xs text-studio font-black">{temperature.toFixed(2)}</span>
                    </div>
                    <input
                      type="range" min="0" max="1" step="0.05" value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      onMouseUp={() => syncToCloud()}
                      className="w-full accent-studio cursor-pointer h-1.5 bg-zinc-900 rounded-full appearance-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div onClick={toggleEnforcer} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-white/5 rounded-xl transition-colors cursor-pointer group hover:bg-zinc-900">
                    <div className="flex gap-4 items-center">
                      <div className="bg-studio/10 p-2 rounded shrink-0"><Sparkles className="w-4 h-4 text-studio" /></div>
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-widest">Cinematic Enforcer</p>
                        <p className="text-xs font-bold text-zinc-600 tracking-wider mt-1 uppercase">Automated high-fidelity terminology.</p>
                      </div>
                    </div>
                    <div className={cn("w-8 h-4 rounded-full relative transition-colors", enforcer ? "bg-studio" : "bg-zinc-800")}>
                      <div className={cn("absolute top-0.5 w-3 h-3 rounded-full transition-transform", enforcer ? "left-[calc(100%-14px)] bg-white" : "left-0.5 bg-zinc-500")} />
                    </div>
                  </div>

                  <div onClick={toggleSwarm} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-white/5 rounded-xl transition-colors cursor-pointer group hover:bg-zinc-900">
                    <div className="flex gap-4 items-center">
                      <div className="bg-emerald-500/10 p-2 rounded shrink-0"><Wand2 className="w-4 h-4 text-emerald-500" /></div>
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-widest">AI Swarm</p>
                        <p className="text-xs font-bold text-zinc-600 tracking-wider mt-1 uppercase">Multi-agent consensus verification.</p>
                      </div>
                    </div>
                    <div className={cn("w-8 h-4 rounded-full relative transition-colors", swarmMode ? "bg-emerald-500" : "bg-zinc-800")}>
                      <div className={cn("absolute top-0.5 w-3 h-3 rounded-full transition-transform", swarmMode ? "left-[calc(100%-14px)] bg-white" : "left-0.5 bg-zinc-500")} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-900">
                <label className="text-xs font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">Global System Prompt Injector</label>
                <textarea
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xs text-studio font-mono focus:border-studio/50 focus:outline-none transition-all resize-none"
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
          {/* Inference Mode Toggle Card */}
          <Card className="bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-hidden group rounded-[2.5rem]">
            <CardHeader className="border-b border-zinc-900 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-studio/10 rounded-xl border border-studio/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <Activity className="w-4 h-4 text-studio animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-xs font-black text-white uppercase tracking-widest">Inference Mode</CardTitle>
                  <CardDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Choose your pricing and resource tier.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => handleModeToggle('free')}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 text-center",
                    mode === 'free' 
                      ? "bg-studio/10 border-studio/50 text-studio shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-studio transform scale-[1.02]" 
                      : "bg-black/40 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
                  )}
                >
                  <span className="text-xs font-black uppercase tracking-widest">Free Mode</span>
                  <span className="text-[9px] font-bold uppercase text-zinc-500">Fast standard models</span>
                </div>
                <div
                  onClick={() => handleModeToggle('paid')}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 text-center",
                    mode === 'paid' 
                      ? "bg-fuchsia-500/10 border-fuchsia-500/50 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.15)] ring-1 ring-fuchsia-500 transform scale-[1.02]" 
                      : "bg-black/40 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
                  )}
                >
                  <span className="text-xs font-black uppercase tracking-widest">Paid Mode</span>
                  <span className="text-[9px] font-bold uppercase text-zinc-500">Premium & custom keys</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide leading-relaxed pt-2 text-center">
                {mode === 'free' 
                  ? "⚡ FREE MODE active: Server sponsored. Enforces standard speed models without credit deductions."
                  : "💎 PAID MODE active: Access premium models. Deducts credits from your ledger unless custom API keys are loaded."}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-hidden group rounded-[2.5rem]">
            <CardHeader className="border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-studio/10 rounded-xl border border-studio/20">
                  <Key className="w-4 h-4 text-studio" />
                </div>
                <CardTitle className="text-xs font-black text-white uppercase tracking-widest">API Configuration</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Gemini API Key */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Gemini API Key</label>
                  <span className="text-[8px] font-black text-studio uppercase bg-studio/10 border border-studio/20 px-2 py-0.5 rounded tracking-tighter">
                    {getModelsByProvider('gemini', 'Powers: Gemini 2.0 Flash/Pro, 1.5 Pro')}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    onBlur={() => syncToCloud()}
                    placeholder="AIza..."
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-studio/50 focus:outline-none transition-all pr-12 font-mono"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-studio transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* OpenAI API Key */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">OpenAI API Key</label>
                  <span className="text-[8px] font-black text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded tracking-tighter">
                    {getModelsByProvider('openai', 'Powers: GPT-4o, GPT-4o Mini, o1 Preview')}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showOpenai ? "text" : "password"}
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    onBlur={() => syncToCloud()}
                    placeholder="sk-proj-..."
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-studio/50 focus:outline-none transition-all pr-12 font-mono"
                  />
                  <button
                    onClick={() => setShowOpenai(!showOpenai)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-studio transition-colors"
                  >
                    {showOpenai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Anthropic API Key */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Anthropic API Key</label>
                  <span className="text-[8px] font-black text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded tracking-tighter">
                    {getModelsByProvider('anthropic', 'Powers: Claude-3.5 Sonnet, Claude-3 Opus')}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showAnthropic ? "text" : "password"}
                    value={anthropicKey}
                    onChange={(e) => setAnthropicKey(e.target.value)}
                    onBlur={() => syncToCloud()}
                    placeholder="sk-ant-..."
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-studio/50 focus:outline-none transition-all pr-12 font-mono"
                  />
                  <button
                    onClick={() => setShowAnthropic(!showAnthropic)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-studio transition-colors"
                  >
                    {showAnthropic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Groq API Key */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Groq API Key</label>
                  <span className="text-[8px] font-black text-orange-400 uppercase bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded tracking-tighter">
                    {getModelsByProvider('groq', 'Powers: Llama-3-70b/8b, DeepSeek R1')}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showGroq ? "text" : "password"}
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    onBlur={() => syncToCloud()}
                    placeholder="gsk_..."
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-studio/50 focus:outline-none transition-all pr-12 font-mono"
                  />
                  <button
                    onClick={() => setShowGroq(!showGroq)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-studio transition-colors"
                  >
                    {showGroq ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* NVIDIA API Key */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">NVIDIA API Key</label>
                  <span className="text-[8px] font-black text-cyan-400 uppercase bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded tracking-tighter">
                    {getModelsByProvider('nvidia', 'Powers: Nemotron-70b, Llama-3.1-70b')}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showNvidia ? "text" : "password"}
                    value={nvidiaKey}
                    onChange={(e) => setNvidiaKey(e.target.value)}
                    onBlur={() => syncToCloud()}
                    placeholder="nvapi-..."
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-studio/50 focus:outline-none transition-all pr-12 font-mono"
                  />
                  <button
                    onClick={() => setShowNvidia(!showNvidia)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-studio transition-colors"
                  >
                    {showNvidia ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <GeminiStatusCard
                apiKey={geminiKey}
                onTest={testConnection}
                isTesting={isTesting}
                status={testStatus}
                lastError={testError}
                onClear={clearBrowserKey}
              />
            </CardContent>
          </Card>

          <ExternalModelNetwork />
        </div>
      </div>
    </div>
  );
}

export default AISynthesisTab;

