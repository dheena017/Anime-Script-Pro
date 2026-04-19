import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Sparkles, Clapperboard, Volume2, Maximize2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';
import { cn } from '@/lib/utils';

export function ExamplePage() {
  const { generatedScript, prompt, episode, session, history } = useGenerator();
  const [currentScene, setCurrentScene] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [activeScriptContent, setActiveScriptContent] = React.useState<string | null>(null);
  const [activeMetadata, setActiveMetadata] = React.useState({ ep: '', sess: '', prompt: '' });

  // Sync with global script by default, or loaded script
  React.useEffect(() => {
    if (generatedScript && !activeScriptContent) {
      setActiveScriptContent(generatedScript);
      setActiveMetadata({ ep: episode, sess: session, prompt: prompt });
    }
  }, [generatedScript, episode, session, prompt, activeScriptContent]);

  // Parse markdown table into scenes
  const scenes = React.useMemo(() => {
    const content = activeScriptContent || generatedScript;
    if (!content) return [];
    
    // Support both standard markdown tables and loose formatting
    const lines = content.split('\n').filter(l => l.includes('|') && !l.includes('---'));
    if (lines.length < 2) return [];

    return lines.slice(1).map(line => {
      const columns = line.split('|').filter(c => c.trim() !== '' || line.startsWith('|') || line.endsWith('|'));
      const cells = columns.map(c => c.trim());
      return {
        section: cells[0] || 'N/A',
        character: cells[1] || 'N/A',
        voiceover: cells[2] || 'N/A',
        visuals: cells[3] || 'N/A',
        audio: cells[4] || 'N/A'
      };
    }).filter(s => s.section !== 'Section');
  }, [activeScriptContent, generatedScript]);

  const sceneCount = scenes.length;

  React.useEffect(() => {
    let interval: any;
    if (isPlaying && currentScene < sceneCount - 1) {
      interval = setInterval(() => {
        setCurrentScene(prev => prev + 1);
      }, 8000);
    } else if (currentScene === sceneCount - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentScene, sceneCount]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\(.*\)/g, ''));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  React.useEffect(() => {
    if (isPlaying && scenes[currentScene]) {
       speak(scenes[currentScene].voiceover);
    }
  }, [currentScene, isPlaying]);

  const activeScene = scenes[currentScene];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold flex items-center gap-2 text-red-100 drop-shadow-[0_0_8px_rgba(220,38,38,0.3)]">
            <Play className="w-5 h-5 text-red-400" /> Screening Room
          </h2>
          <p className="text-red-500/60 font-bold uppercase tracking-[0.2em] text-[10px] bg-red-950/30 px-3 py-1 rounded-full border border-red-500/20 inline-block">
            Preview & Analytics
          </p>
        </div>
        <Button 
          size="sm" 
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest uppercase text-[10px]"
          onClick={() => {
            setCurrentScene(0);
            setIsPlaying(true);
          }}
          disabled={!activeScriptContent && !generatedScript}
        >
          <Sparkles className="w-3 h-3 mr-2" />
          Generate
        </Button>
      </div>

      {/* 1. EPISODE NAVIGATOR / ARCHIVE */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
         <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-red-600 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            <Sparkles className="w-3 h-3" /> Latest Production
         </div>
         {history.map((item) => (
           <button 
             key={item.id}
             onClick={() => {
               setActiveScriptContent(item.script);
               setActiveMetadata({ ep: item.episode, sess: item.session, prompt: item.prompt });
               setCurrentScene(0);
               setIsPlaying(false);
             }}
             className={cn(
               "shrink-0 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
               activeMetadata.ep === item.episode && activeMetadata.sess === item.session
                ? "bg-zinc-800 border-red-500 text-red-500 shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
             )}
           >
             S{item.session} E{item.episode}: {item.title}
           </button>
         ))}
      </div>

      {/* 2. CINEMATIC PLAYER */}
      <div className="relative aspect-video w-full bg-zinc-950 rounded-[2rem] border border-cyan-500/20 overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {!activeScriptContent && !generatedScript ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-black/40 backdrop-blur-3xl">
            <Clapperboard className="w-16 h-16 mb-6 text-zinc-800" />
            <h2 className="text-xl font-black text-zinc-500 uppercase tracking-[0.2em]">Screening Room Offline</h2>
            <p className="text-[10px] text-zinc-600 uppercase font-bold mt-2">Select an episode from your archive or generate a new script</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentScene}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 flex items-center justify-center p-12 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                
                <div className="relative z-10 space-y-6 max-w-3xl">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="inline-block px-4 py-1 bg-red-600/20 border border-red-600/40 rounded-full text-[10px] font-black tracking-[0.4em] text-red-500 uppercase"
                  >
                    {activeScene?.section}
                  </motion.div>
                  <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                    {activeScene?.visuals}
                  </h2>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="flex items-end justify-between gap-8">
                <div className="space-y-4 max-w-xl text-left">
                   <div className="flex items-center gap-3">
                     <div className="w-1 h-8 bg-red-600 rounded-full" />
                     <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Speaker: {activeScene?.character}</p>
                        <p className="text-lg font-bold text-zinc-100 italic">"{activeScene?.voiceover}"</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Volume2 className="w-3 h-3 text-red-500" /> {activeScene?.audio}</span>
                   </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                   <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Session {activeMetadata.sess} | Episode {activeMetadata.ep}</div>
                   <div className="flex items-center gap-2">
                     <Button 
                       size="icon" 
                       variant="ghost" 
                       className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white"
                       onClick={() => setCurrentScene(prev => Math.max(0, prev - 1))}
                     >
                       <SkipBack className="w-5 h-5" />
                     </Button>
                     <Button 
                       size="icon" 
                       className="h-16 w-16 rounded-3xl bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-transform hover:scale-105"
                       onClick={() => setIsPlaying(!isPlaying)}
                     >
                       {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current" />}
                     </Button>
                     <Button 
                       size="icon" 
                       variant="ghost" 
                       className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white"
                       onClick={() => setCurrentScene(prev => Math.min(sceneCount - 1, prev + 1))}
                     >
                       <SkipForward className="w-5 h-5" />
                     </Button>
                   </div>
                </div>
              </div>

              <div className="mt-8 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-red-600"
                   initial={{ width: 0 }}
                   animate={{ width: `${((currentScene + 1) / sceneCount) * 100}%` }}
                 />
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. PRODUCTION TIMELINE */}
      {scenes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-3 bg-black/40 border border-zinc-800 p-6 rounded-[2rem] overflow-hidden">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                 <Clapperboard className="w-4 h-4 text-red-500" /> Episode Timeline
               </h3>
               <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{currentScene + 1} / {sceneCount} Scenes</div>
             </div>
             <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
               {scenes.map((scene, idx) => (
                 <button 
                   key={idx}
                   onClick={() => { setCurrentScene(idx); setIsPlaying(false); }}
                   className={cn(
                     "shrink-0 w-48 aspect-video rounded-2xl border transition-all p-3 text-left flex flex-col justify-between group relative overflow-hidden",
                     currentScene === idx 
                      ? "bg-red-600/10 border-red-600/50 shadow-lg" 
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                   )}
                 >
                   {currentScene === idx && (
                     <div className="absolute top-2 right-2 flex gap-1">
                        <div className="w-1 h-2 bg-red-500 animate-pulse" />
                        <div className="w-1 h-3 bg-red-500 animate-pulse delay-75" />
                        <div className="w-1 h-2 bg-red-500 animate-pulse delay-150" />
                     </div>
                   )}
                   <div>
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1 group-hover:text-red-500 transition-colors">Scene {idx + 1}</p>
                      <p className="text-[10px] font-bold text-zinc-300 line-clamp-2 leading-relaxed">{scene.section}</p>
                   </div>
                   <p className="text-[9px] font-medium text-zinc-500 line-clamp-1 truncate">{activeMetadata.prompt}</p>
                 </button>
               ))}
             </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-600 to-red-900 p-6 rounded-[2rem] border-none shadow-xl flex flex-col justify-between">
             <div className="space-y-2 text-left">
                <Sparkles className="w-6 h-6 text-white mb-2" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Series View</h3>
                <p className="text-[10px] text-red-100/70 font-medium leading-relaxed italic">"Architecture is inhabited, and storytelling is an experience."</p>
             </div>
             <Button className="w-full bg-white text-red-600 hover:bg-zinc-100 font-black tracking-widest text-[10px] rounded-xl h-10 mt-6">
               <Maximize2 className="w-3 h-3 mr-2" /> FULLSCREEN
             </Button>
          </Card>
        </div>
      )}
    </motion.div>
  );
}
