import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ScrollText, 
  Sparkles, 
  Zap, 
  Sword, 
  Brain, 
  Globe, 
  ChevronRight, 
  Activity,
  Wand2,
  Camera,
  Layers,
  RefreshCw,
  Heart,
  Search,
  Crosshair,
  Volume2,
  CheckCircle2,
  Lock,
  Trash2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';
import { COMPOUND_BEATS } from '@/constants';
import { generateNarrativeBeats, refineSingleBeat } from '@/services/geminiService';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function NarrativeBeatsPage() {
  const { 
    narrativeBeats, setNarrativeBeats, 
    prompt, selectedModel, contentType, 
    setGeneratedScript 
  } = useGenerator();
  
  const navigate = useNavigate();
  const [selectedBeatKey, setSelectedBeatKey] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [aiBeats, setAiBeats] = React.useState<any[] | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'timeline' | 'mastermind'>('grid');
  const [activeBeatIndex, setActiveBeatIndex] = React.useState<number | null>(null);

  const [refinementPrompt, setRefinementPrompt] = React.useState('');
  const [isRefining, setIsRefining] = React.useState<number | null>(null);

  const handleRefineSingleBeat = async (index: number) => {
    if (!aiBeats || !refinementPrompt.trim()) return;
    setIsRefining(index);
    const refined = await refineSingleBeat(aiBeats[index], refinementPrompt, prompt, selectedModel, contentType);
    if (refined) {
      const newBeats = [...aiBeats];
      newBeats[index] = refined;
      setAiBeats(newBeats);
      setRefinementPrompt('');
      setIsRefining(null);
    }
  };

  const handleApplyBeat = (beats: any[]) => {
    const formatted = beats.map((b, i: number) => `${i + 1}. ${b.label} (${b.duration}): ${b.description}`).join('\n');
    setNarrativeBeats(formatted);
  };

  const handleGenerateAIBeats = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const beats = await generateNarrativeBeats(prompt, selectedModel, contentType);
    if (beats) {
      setAiBeats(beats);
      setSelectedBeatKey('AI_GENERATED');
    }
    setIsGenerating(false);
  };

  const getIcon = (key: string) => {
    if (key.includes('Shonen')) return Sword;
    if (key.includes('Psychological')) return Brain;
    if (key.includes('Isekai')) return Globe;
    if (key.includes('Romance')) return Heart;
    if (key.includes('Mystery')) return Search;
    if (key.includes('Battle')) return Crosshair;
    return Zap;
  };

  const currentBeats = selectedBeatKey === 'AI_GENERATED' ? aiBeats : (selectedBeatKey ? (COMPOUND_BEATS as any)[selectedBeatKey].beats : null);

  const generateWavePath = (beats: any[]) => {
    if (!beats || beats.length === 0) return "";
    const points = beats.map((b: any, i: number) => {
      const x = (i / (beats.length - 1)) * 100;
      const y = 100 - (b.intensity || 5) * 10;
      return `${x},${y}`;
    });
    return `M 0,100 ` + points.map((p: string, i: number) => {
      const [x, y] = p.split(',');
      return `L ${x} ${y}`;
    }).join(' ') + ` L 100,100 Z`;
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black uppercase tracking-[0.2em] flex items-center gap-3 text-cyan-50 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <ScrollText className="w-8 h-8 text-cyan-400" /> Narrative Architect
          </h2>
          <p className="text-cyan-500/60 text-[10px] font-black uppercase tracking-[0.3em] pl-11">
            Structural Intelligence & Pacing Simulation Module
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
           <div className="flex bg-[#0a0a0a]/80 p-1 rounded-xl border border-zinc-800 shadow-xl">
             {(['grid', 'timeline', 'mastermind'] as const).map((mode) => (
               <Button
                 key={mode}
                 variant="ghost"
                 size="sm"
                 onClick={() => setViewMode(mode)}
                 className={cn(
                   "h-8 px-4 text-[9px] font-black uppercase tracking-widest transition-all",
                   viewMode === mode ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "text-zinc-500 hover:text-cyan-400"
                 )}
               >
                 {mode}
               </Button>
             ))}
           </div>
           
           <Button
             onClick={handleGenerateAIBeats}
             disabled={isGenerating || !prompt.trim()}
             className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.2em] text-[10px] h-10 px-6 shadow-[0_0_20px_rgba(249,115,22,0.3)] group transition-all"
           >
             {isGenerating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />}
             AI Brain Simulation
           </Button>
         </div>
      </div>

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card 
            onClick={() => setViewMode('mastermind')}
            className="group relative overflow-hidden cursor-pointer bg-[#050505]/50 border-orange-500/20 hover:border-orange-500/50 transition-all flex flex-col justify-between border-dashed border-2 min-h-[300px]"
          >
            <div className="relative h-40 overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop" 
                 alt="AI Brain" 
                 className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.2)] animate-pulse">
                   <Sparkles className="w-8 h-8 text-orange-500" />
                 </div>
               </div>
            </div>

            <div className="p-6 pt-2 space-y-3 relative z-10 flex-1">
              <h3 className="font-black text-xs uppercase tracking-widest text-orange-100 italic">Dynamic AI Mastermind</h3>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase tracking-wider">Let the AI analyze your prompt to architect a custom narrative structure specifically for this concept.</p>
              <Button size="sm" className="w-full mt-auto bg-orange-600/10 text-orange-400 border border-orange-500/30 group-hover:bg-orange-600 group-hover:text-white text-[9px] font-black uppercase tracking-widest transition-all">Invoke AI Core</Button>
            </div>
          </Card>

          {Object.entries(COMPOUND_BEATS).map(([key, data]: [string, any], idx) => {
            const Icon = getIcon(key);
            const isSelected = selectedBeatKey === key;
            
            return (
              <Card 
                key={key}
                onClick={() => {
                  setSelectedBeatKey(key);
                  setViewMode('timeline');
                }}
                className={cn(
                  "group relative overflow-hidden cursor-pointer transition-all duration-500 border border-zinc-800 bg-[#050505]/50 hover:border-cyan-500/50",
                  isSelected && "border-cyan-500 ring-1 ring-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] scale-[1.02]"
                )}
              >
                {data.thumbnail && (
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={data.thumbnail} 
                      alt={key} 
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-transparent to-transparent" />
                  </div>
                )}
                
                <div className="absolute top-4 right-4 p-4 opacity-[0.03] group-hover:opacity-10 transition-all group-hover:scale-125 z-20">
                  <Icon className="w-24 h-24 text-cyan-50" />
                </div>
                
                <div className="p-6 space-y-5 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:border-cyan-500/50 transition-all shadow-xl">
                      <Icon className="w-7 h-7 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-black uppercase tracking-widest text-[13px] text-zinc-100">{key}</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[9px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30 uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(6,182,212,0.1)]">{data.genre}</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                             <div key={i} className={cn("w-1 h-3 rounded-full", i < (data.intensity/2) ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-zinc-800")} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {data.beats.slice(0, 2).map((beat: any, bIdx: number) => (
                      <div key={bIdx} className="flex gap-3">
                         <span className="text-[9px] font-mono text-cyan-500/40 mt-1 font-black">0{bIdx+1}</span>
                         <p className="text-[11px] text-zinc-400 font-bold tracking-widest uppercase line-clamp-1 group-hover:text-cyan-200 transition-colors">{beat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-zinc-800/50">
                    <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">{data.beats.length} Sequential Segments</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-cyan-500 animate-in zoom-in" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:text-cyan-500 transition-colors" />
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {viewMode === 'mastermind' && (
        <Card className="bg-[#050505]/80 border-orange-500/20 p-12 rounded-[3rem] overflow-hidden relative group shadow-[0_0_50px_rgba(249,115,22,0.1)]">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
              <Brain className="w-full h-full text-orange-500" />
           </div>
           
           <div className="relative z-10 text-center space-y-12">
              <div className="space-y-4">
                 <div className="inline-block px-4 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-[10px] uppercase tracking-[0.4em] text-orange-500 font-black">
                    Neural Diagnostic Active
                 </div>
                 <h3 className="text-4xl font-black uppercase tracking-tighter text-white">Dynamic Narrative Synthesis</h3>
                 <p className="text-sm text-zinc-500 max-w-2xl mx-auto font-medium">
                   The Mastermind is analyzing your creative intent to architect a structure that maximizes retention and emotional payoff.
                 </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {[
                   { label: 'Prompt Decay', val: '0.002ms', color: 'text-emerald-500' },
                   { label: 'Thematic Weight', val: '88%', color: 'text-orange-500' },
                   { label: 'Structural Integrity', val: 'Stable', color: 'text-cyan-500' },
                 ].map((stat, i) => (
                   <div key={i} className="p-6 bg-black/40 border border-zinc-900 rounded-2xl space-y-1">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</p>
                      <p className={cn("text-2xl font-black uppercase tracking-widest", stat.color)}>{stat.val}</p>
                   </div>
                 ))}
              </div>

              <div className="p-1 border border-zinc-800 rounded-[2rem] bg-black/40 backdrop-blur-xl">
                 <div className="p-10 text-center space-y-6">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Mastermind Output</p>
                    {aiBeats ? (
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {aiBeats.map((beat, i) => (
                          <div key={i} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2 group/beat hover:border-orange-500/50 transition-all text-left">
                             <span className="text-[9px] font-black text-zinc-600 uppercase">Phase 0{i+1}</span>
                             <h4 className="text-[11px] font-black text-white uppercase tracking-wider truncate">{beat.label}</h4>
                             <div className="h-0.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500" style={{ width: `${beat.intensity * 10}%` }} />
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6 py-10">
                        <div className="w-20 h-20 bg-orange-500/5 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                           <RefreshCw className="w-10 h-10 text-orange-500 animate-spin" />
                        </div>
                        <p className="text-sm font-black text-zinc-600 uppercase tracking-[0.2em]">Awaiting Instruction...</p>
                      </div>
                    )}

                    <Button 
                      onClick={handleGenerateAIBeats}
                      disabled={isGenerating}
                      className="h-16 px-12 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.4em] text-xs rounded-2xl shadow-[0_15px_40px_rgba(249,115,22,0.3)] transition-all active:scale-95"
                    >
                      {isGenerating ? "Synthesizing Architecture..." : "INVOKE MASTERMIND CORE"}
                    </Button>
                 </div>
              </div>
           </div>
        </Card>
      )}

      {viewMode === 'timeline' && currentBeats && (
        <Card className="bg-[#050505]/50 border-zinc-800 p-10 overflow-hidden relative group rounded-[2.5rem] shadow-2xl">
           <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
           <div className="relative z-10 space-y-12">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-cyan-500/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                    <Activity className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-[0.2em] text-zinc-100">Global Tension Map</h4>
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em]">Simulated High-Retention Engagement Wave</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Emotional Peak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Pacing Flow</span>
                  </div>
                </div>
              </div>

              <div className="h-[250px] w-full relative px-6">
                 <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <path
                      d={generateWavePath(currentBeats)}
                      fill="url(#waveGradient)"
                      className="transition-all duration-1000 ease-in-out"
                    />
                    <path
                      d={generateWavePath(currentBeats).replace(/ L \d+,\d+ Z$/, "")}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-in-out"
                    />
                    
                    {currentBeats.map((b: any, i: number) => {
                      const x = (i / (currentBeats.length - 1)) * 100;
                      const y = 100 - (b.intensity || 5) * 10;
                      return (
                        <g key={i} className="group/dot cursor-pointer" onClick={() => setActiveBeatIndex(i)}>
                          <circle 
                            cx={`${x}%`} 
                            cy={`${y}%`} 
                            r="8" 
                            fill="#000" 
                            stroke={activeBeatIndex === i ? "#06b6d4" : "#f97316"} 
                            strokeWidth="3" 
                            className={cn("transition-all group-hover/dot:scale-150 shadow-2xl", activeBeatIndex === i && "shadow-[0_0_20px_rgba(6,182,212,0.5)]")}
                          />
                          <text 
                            x={`${x}%`} 
                            y={`${y - 20}%`} 
                            textAnchor="middle" 
                            className="text-[10px] font-black fill-cyan-400 opacity-0 group-hover/dot:opacity-100 transition-opacity uppercase tracking-widest drop-shadow-md"
                          >
                            {b.label}
                          </text>
                        </g>
                      );
                    })}
                 </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-10">
                 {currentBeats.map((beat: any, idx: number) => (
                   <div 
                    key={idx} 
                    onClick={() => setActiveBeatIndex(idx)}
                    className={cn(
                      "p-5 rounded-2xl border transition-all cursor-pointer group/card relative overflow-hidden",
                      activeBeatIndex === idx ? "bg-cyan-500/5 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.1)]" : "bg-black/40 border-zinc-900 hover:border-zinc-800"
                    )}
                   >
                     <div className="flex items-center justify-between mb-3 relative z-10">
                       <span className={cn("text-[10px] font-black uppercase tracking-widest", activeBeatIndex === idx ? "text-cyan-400" : "text-zinc-600")}>Phase 0{idx+1}</span>
                       <span className="text-[9px] font-mono text-zinc-700 font-bold">{beat.duration}</span>
                     </div>
                     <h5 className="text-[12px] font-black uppercase tracking-wide text-zinc-300 group-hover/card:text-cyan-50 transition-colors truncate relative z-10">{beat.label}</h5>
                     <div className={cn("absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-500", activeBeatIndex === idx ? "w-full opacity-100" : "w-0 opacity-0")} style={{ width: `${beat.intensity * 10}%` }} />
                   </div>
                 ))}
              </div>
           </div>
        </Card>
      )}

      <AnimatePresence mode="wait">
        {selectedBeatKey && currentBeats && (
          <motion.div
            key={selectedBeatKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                 <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                       <Layers className="w-6 h-6 text-cyan-400" />
                       <h4 className="text-lg font-black uppercase tracking-[0.25em] text-zinc-50 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">Component Architecture</h4>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-[#050505] border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-orange-400 hover:border-orange-500/30 transition-all h-10 px-6 rounded-xl"
                        onClick={() => setSelectedBeatKey(null)}
                      >
                        Reset Matrix
                      </Button>
                      <Button
                        size="sm"
                        className="bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_8px_20px_rgba(6,182,212,0.3)] h-10 px-8 rounded-xl active:scale-95 transition-all"
                        onClick={() => handleApplyBeat(currentBeats)}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Apply Schema
                      </Button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                    {currentBeats.map((beat: any, idx: number) => (
                      <Card 
                        key={idx} 
                        onClick={() => setActiveBeatIndex(idx)}
                        className={cn(
                          "relative overflow-hidden transition-all duration-500 border border-zinc-900 group/beat",
                          activeBeatIndex === idx ? "bg-[#0a0a0a] border-cyan-500/40 ring-1 ring-cyan-500/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] scale-[1.01]" : "bg-[#050505]/40 hover:bg-[#070707] border-transparent"
                        )}
                      >
                        <div className="flex flex-col md:flex-row p-8 gap-8">
                           <div className="flex flex-col items-center gap-3">
                              <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center text-[13px] font-black transition-all border shadow-lg",
                                activeBeatIndex === idx ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "bg-zinc-900/50 text-zinc-600 border-zinc-800"
                              )}>
                                0{idx+1}
                              </div>
                              <div className={cn("w-[2px] flex-1 bg-gradient-to-b from-zinc-800 to-transparent min-h-[50px] transition-all", activeBeatIndex === idx && "from-cyan-500/50")} />
                           </div>

                           <div className="flex-1 space-y-6">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                 <div className="space-y-1.5">
                                    <h5 className="text-base font-black uppercase tracking-widest text-zinc-50 group-hover/beat:text-cyan-400 transition-colors">{beat.label}</h5>
                                    <div className="flex items-center gap-3">
                                       <span className="text-[11px] text-zinc-500 uppercase font-black tracking-[0.3em] italic">{beat.duration}</span>
                                       <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                       <div className="flex items-center gap-1.5">
                                          <Activity className="w-3.5 h-3.5 text-orange-500" />
                                          <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Intensity {beat.intensity}/10</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex gap-3">
                                    <Button 
                                      size="sm" 
                                      className="bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black font-black uppercase tracking-[0.2em] text-[9px] h-10 px-6 rounded-xl border border-cyan-500/30 transition-all font-bold"
                                      onClick={() => {
                                        setGeneratedScript(null); // Clear old script to force new one
                                        navigate('/studio/script');
                                      }}
                                    >
                                       Generate Scene
                                    </Button>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-10 w-10 rounded-2xl text-zinc-600 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                                      onClick={() => {
                                        const updatedBeats = currentBeats.filter((_: any, i: number) => i !== idx);
                                        setNarrativeBeats(JSON.stringify(updatedBeats));
                                        if (activeBeatIndex === idx) setActiveBeatIndex(null);
                                      }}
                                    >
                                       <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className={cn(
                                        "h-10 w-10 rounded-2xl transition-all border shadow-lg",
                                        isRefining === idx ? "bg-orange-500 text-white border-orange-400 animate-pulse" : "text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 border-transparent hover:border-cyan-500/20"
                                      )}
                                      onClick={() => setIsRefining(isRefining === idx ? null : idx)}
                                    >
                                       {isRefining === idx ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                    </Button>
                                 </div>
                              </div>

                              {isRefining === idx && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="space-y-3 bg-orange-500/5 p-4 rounded-2xl border border-orange-500/20"
                                >
                                  <p className="text-[9px] font-black uppercase tracking-widest text-orange-400">Refinement Matrix</p>
                                  <div className="flex gap-2">
                                    <input 
                                      className="flex-1 bg-black/60 border border-orange-500/30 rounded-xl px-4 py-2 text-xs text-orange-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                                      placeholder="e.g., Make this scene more dark and mysterious..."
                                      value={refinementPrompt}
                                      onChange={(e) => setRefinementPrompt(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleRefineSingleBeat(idx)}
                                    />
                                    <Button 
                                      size="sm" 
                                      className="bg-orange-600 hover:bg-orange-500 text-white font-black"
                                      onClick={() => handleRefineSingleBeat(idx)}
                                    >
                                      Apply
                                    </Button>
                                  </div>
                                </motion.div>
                              )}

                              <p className="text-[13px] text-zinc-400 leading-relaxed font-medium italic border-l-2 border-cyan-500/10 pl-6 py-1">"{beat.description}"</p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-cyan-500/5">
                                 <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center shrink-0 shadow-lg">
                                       <Camera className="w-5 h-5 text-fuchsia-400" />
                                    </div>
                                    <div>
                                       <p className="text-[9px] font-black uppercase tracking-[0.25em] text-fuchsia-500/60 mb-1.5">Visual Aesthetic</p>
                                       <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wide truncate max-w-[250px]">{beat.vfx || 'High Contrast Noir Style'}</p>
                                    </div>
                                 </div>
                                 <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 shadow-lg">
                                       <Volume2 className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <div>
                                       <p className="text-[9px] font-black uppercase tracking-[0.25em] text-orange-500/60 mb-1.5">Audio Synthesis</p>
                                       <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wide truncate max-w-[250px]">{beat.audio || 'Bass-Heavy Dynamic BGM'}</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                      </Card>
                    ))}
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="p-8 rounded-[2.5rem] bg-[#050505]/80 border border-zinc-800/50 space-y-8 shadow-2xl relative overflow-hidden group/panel">
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none group-hover/panel:bg-orange-500/10 transition-colors duration-1000" />
                    
                    <div className="space-y-3">
                       <h5 className="text-[11px] font-black uppercase tracking-[0.25em] text-cyan-400 flex items-center gap-3">
                          <Wand2 className="w-5 h-5" /> Visual Intelligence
                       </h5>
                       <div className="p-5 rounded-2xl bg-black/60 border border-cyan-500/10 text-[11px] text-zinc-500 leading-relaxed font-mono shadow-inner group-hover/panel:border-cyan-500/30 transition-all">
                          {activeBeatIndex != null ? (
                             `Anime Cinematics, ${currentBeats[activeBeatIndex].label}, direction by Master Architect, ${currentBeats[activeBeatIndex].vfx}, intensity scale ${currentBeats[activeBeatIndex].intensity}, 8k ultra-noir, atmospheric fog --niji 6 --ar 21:9`
                          ) : (
                             "Select an architectural segment to generate a neural prompt..."
                          )}
                       </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-zinc-900">
                       <h5 className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-400 flex items-center gap-3">
                          <Volume2 className="w-5 h-5" /> Audio Engineering
                       </h5>
                       <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10 group-hover/panel:border-orange-500/30 transition-all">
                          <p className="text-[11px] text-orange-100/60 font-black uppercase tracking-[0.15em] leading-relaxed italic">
                             {activeBeatIndex != null ? (
                                `Recommended frequency: ${currentBeats[activeBeatIndex].intensity * 12 + 70} BPM pulse. Dynamic filter on ${currentBeats[activeBeatIndex].audio}. Pacing: ${currentBeats[activeBeatIndex].duration}.`
                             ) : (
                                "Selecting a segment reveals acoustic theory data..."
                             )}
                          </p>
                       </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-zinc-900">
                       <Button 
                          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.3em] text-[11px] h-14 rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.2)] active:scale-95 transition-all"
                          onClick={() => {
                            setGeneratedScript(null);
                            navigate('/studio/script');
                          }}
                       >
                          Neural Synthesis: All Scenes
                       </Button>
                       <Button 
                          className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-[0.3em] text-[11px] h-14 rounded-2xl shadow-[0_10px_30px_rgba(6,182,212,0.2)] active:scale-95 transition-all"
                          onClick={() => handleApplyBeat(currentBeats)}
                       >
                          Deploy Schema to Production
                       </Button>
                    </div>
                 </div>

                 <Card className="border-dashed border-zinc-800 bg-transparent flex flex-col items-center justify-center p-10 space-y-6 group hover:border-fuchsia-500/30 transition-all rounded-[2rem]">
                    <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 group-hover:border-fuchsia-500/30 transition-all shadow-xl">
                      <Lock className="w-8 h-8 text-zinc-700 group-hover:text-fuchsia-400 transition-all" />
                    </div>
                    <div className="text-center space-y-2">
                       <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-fuchsia-300">Neural Archive Node</p>
                       <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest italic leading-relaxed">Persist your logical variations to the neural cloud.</p>
                    </div>
                 </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
