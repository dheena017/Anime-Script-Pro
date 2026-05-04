import React, { useState, useEffect } from 'react';
import { Play, Cpu, Zap, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { RenderPhase } from './types';

interface ScreeningViewportProps {
  videoUrl: string | null;
  isRendering: boolean;
  renderPhases: RenderPhase[];
  onRender: () => void;
  activeSession: number;
  sceneCount: number;
  videoPrompts: string | null;
  generatedScript?: string | null;
}

export const ScreeningViewport: React.FC<ScreeningViewportProps> = ({
  videoUrl,
  isRendering,
  renderPhases,
  onRender,
  activeSession,
  sceneCount,
  videoPrompts,
  generatedScript
}) => {
  const [currentSubtitle, setCurrentSubtitle] = useState<string>("");
  const [subIndex, setSubIndex] = useState(0);

  useEffect(() => {
    if (videoUrl && generatedScript) {
      const lines = generatedScript.split('\n')
        .filter(l => l.includes('|') && !l.includes('---') && !l.includes('Scene #'))
        .map(l => l.split('|')[4]?.trim())
        .filter(Boolean);
      
      if (lines.length > 0) {
        const interval = setInterval(() => {
          setSubIndex(prev => (prev + 1) % lines.length);
          setCurrentSubtitle(lines[subIndex]);
        }, 4000);
        return () => clearInterval(interval);
      }
    }
  }, [videoUrl, generatedScript, subIndex]);

  return (
    <div className="lg:col-span-3 space-y-6">
      <Card className="aspect-video bg-black border-studio/20 relative overflow-hidden group shadow-2xl rounded-3xl">
        {videoUrl ? (
          <div className="relative w-full h-full">
            <video 
              src={videoUrl} 
              autoPlay 
              loop
              muted
              className="w-full h-full object-cover brightness-75 contrast-125"
            />
            {/* Cinematic Overlays */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
            
            {/* Subtitle Engine */}
            <div className="absolute bottom-20 left-10 right-10 flex flex-col items-center justify-center text-center space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={subIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-2xl"
                >
                  <p className="text-white text-xl font-black uppercase tracking-tight text-shadow-studio drop-shadow-2xl">
                    {currentSubtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Neural Watermark */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-studio flex items-center justify-center">
                <Hash className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Video Unit-01</span>
                <span className="text-[8px] font-bold text-studio/60 uppercase tracking-widest mt-1">Status: Masterpiece Premiere</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />

            <div className="absolute inset-0 flex items-center justify-center">
              {isRendering ? (
                <div className="w-full max-w-md px-12 space-y-8">
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-2 border-studio/20 flex items-center justify-center">
                        <Cpu className="w-10 h-10 text-studio animate-spin" />
                      </div>
                      <div className="absolute -inset-4 border border-studio/10 rounded-full animate-ping" />
                    </div>
                    <p className="text-studio font-black uppercase tracking-[0.5em] text-xs animate-pulse">AI Video Assembly Active</p>
                  </div>
                  
                  <div className="space-y-3">
                    {renderPhases.map((phase) => (
                      <div key={phase.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full transition-all duration-500",
                            phase.status === 'done' ? "bg-green-500" : phase.status === 'active' ? "bg-studio animate-pulse scale-125" : "bg-zinc-800"
                          )} />
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest transition-colors",
                            phase.status === 'active' ? "text-white" : "text-zinc-600"
                          )}>{phase.label}</span>
                        </div>
                        <span className="text-[8px] font-mono text-zinc-700">
                          {phase.status === 'done' ? 'COMPLETE' : phase.status === 'active' ? 'PROCESSING...' : 'WAITING'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div 
                    onClick={onRender}
                    className="w-24 h-24 rounded-full bg-studio/10 border border-studio/30 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer backdrop-blur-md group-hover:border-studio group-hover:bg-studio/20"
                  >
                    <Play className="w-10 h-10 text-studio fill-current" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-studio font-black uppercase tracking-[0.4em] text-xs">
                      Awaiting Composition
                    </p>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Arc {activeSession}: {sceneCount} Units Synced</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between pointer-events-none">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <div className="px-2 py-0.5 bg-red-600 text-white text-[8px] font-black uppercase rounded sm">Live</div>
               <span className="text-white font-black uppercase tracking-widest text-sm">Unit Preview Mode</span>
            </div>
            <div className="flex gap-4 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-studio" /> 4K AI Video</span>
              <span>FPS: 24 (Cinematic)</span>
            </div>
          </div>
        </div>
      </Card>

      {videoPrompts && (
        <Card className="bg-[#050505] border-fuchsia-500/20 p-6 rounded-2xl animate-in fade-in zoom-in duration-500">
           <h4 className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap className="w-3 h-3" /> Director's Video Synthesis
           </h4>
           <ScrollArea className="h-32">
              <div className="text-[11px] text-zinc-500 font-medium leading-relaxed prose prose-invert max-w-none">
                <ReactMarkdown>{videoPrompts}</ReactMarkdown>
              </div>
           </ScrollArea>
        </Card>
      )}
    </div>
  );
};



