import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
   Mic, 
   Play, 
   Square, 
   Music, 
   Volume2, 
   Waves,
   Sparkles,
   Scissors,
   Repeat
} from 'lucide-react';
import { SfxArchiveItem } from '@/components/studio/audio/SfxArchiveItem';
import { useGenerator } from '@/contexts/GeneratorContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';

export function AudioBayPage() {
  const { generatedScript } = useGenerator();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingSfx, setIsGeneratingSfx] = useState(false);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const handleTableRead = () => {
    if (!generatedScript || isPlaying) return;
    setIsPlaying(true);
    
    const lines = generatedScript.split('\n').filter(l => l.trim());
    let currentIdx = 0;

    const speakNext = () => {
      if (currentIdx >= lines.length) {
        setIsPlaying(false);
        setActiveSegment(null);
        setProgress(100);
        return;
      }

      setActiveSegment(currentIdx);
      setProgress((currentIdx / lines.length) * 100);
      
      const text = lines[currentIdx];
      const utterance = new SpeechSynthesisUtterance(text.replace(/\|/g, ' '));
      
      // Basic voice assignment simulation
      if (text.includes(':')) {
        utterance.pitch = 1.2; // Character voice simulation
      } else {
        utterance.pitch = 0.8; // Narrator simulation
      }

      utterance.onend = () => {
        currentIdx++;
        speakNext();
      };

      window.speechSynthesis.speak(utterance);
    };

    try {
      speakNext();
    } catch (error) {
       handleFirestoreError(error, OperationType.GET, 'audio-bay-read');
       setIsPlaying(false);
    }
  };

  const stopTableRead = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setActiveSegment(null);
  };

  const handleGenerateSfx = () => {
    setIsGeneratingSfx(true);
    setTimeout(() => setIsGeneratingSfx(false), 2000);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Header */}
      <div className="relative p-12 rounded-[40px] bg-zinc-950 border border-zinc-900 overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(220,38,38,0.1),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20">
                <Mic className="w-3 h-3 text-red-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Acoustic Engineering</span>
             </div>
             <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">AUDIO <span className="text-red-600">BAY</span></h1>
             <p className="text-zinc-500 max-w-xl text-sm font-medium leading-relaxed italic">
                Symphonic orchestration for the modern era. Narrative table reads, neural sound design, and lip-sync synchronization sequences.
             </p>
          </div>
          <div className="flex gap-4">
             <Button 
                onClick={isPlaying ? stopTableRead : handleTableRead}
                disabled={!generatedScript}
                className={`h-16 px-8 rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-2xl ${isPlaying ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-white text-black hover:bg-zinc-200'}`}
             >
                {isPlaying ? <Square className="w-4 h-4 mr-3" /> : <Play className="w-4 h-4 mr-3" />}
                {isPlaying ? 'ABORT READ' : 'START TABLE READ'}
             </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Left: Script Flow */}
         <div className="lg:col-span-7 space-y-6">
            <Card className="bg-zinc-950 border-zinc-900 rounded-[32px] overflow-hidden">
               <div className="p-6 border-b border-zinc-900 bg-zinc-900/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Volume2 className="w-4 h-4 text-red-500" />
                     <span className="text-xs font-black uppercase tracking-widest">Active Table Read Stream</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-48 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-red-600"
                        />
                     </div>
                     <span className="text-[10px] font-mono text-zinc-500">{Math.round(progress)}%</span>
                  </div>
               </div>
               <ScrollArea className="h-[500px] w-full p-8 font-mono text-xs text-zinc-500 leading-relaxed">
                  {generatedScript ? (
                    <div className="space-y-4">
                       {generatedScript.split('\n').filter(l => l.trim()).map((line, idx) => (
                         <div 
                           key={idx} 
                           className={`p-3 rounded-xl transition-all ${activeSegment === idx ? 'bg-red-600/10 text-white border border-red-500/20 shadow-[0_0_20px_rgba(220,38,38,0.1)]' : 'opacity-40 hover:opacity-100 hover:bg-zinc-900/50'}`}
                         >
                           {line}
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center italic">Initialize a script to begin the read sequence.</div>
                  )}
               </ScrollArea>
            </Card>
         </div>

         {/* Right: Sound Design & Logistics */}
         <div className="lg:col-span-5 space-y-8">
            {/* SFX Labs */}
            <Card className="p-8 bg-zinc-950 border-zinc-900 rounded-[32px] space-y-6">
               <div className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-red-500" />
                  <h3 className="text-sm font-black uppercase tracking-tight">AI SFX Labs</h3>
               </div>
               <div className="space-y-4">
                  <div className="relative">
                     <input 
                        type="text" 
                        placeholder="e.g., Blade clashes against shield with sparks..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl h-12 px-4 text-xs font-medium placeholder:text-zinc-700 focus:outline-none focus:border-red-500/50 transition-colors"
                     />
                     <Button 
                        size="sm" 
                        className="absolute right-2 top-2 bottom-2 rounded-xl bg-red-600 text-white hover:bg-red-700 px-4"
                        disabled={isGeneratingSfx}
                        onClick={handleGenerateSfx}
                      >
                        {isGeneratingSfx ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                     </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <SfxArchiveItem label="Sword_Clash_01.wav" />
                     <SfxArchiveItem label="Portal_Hum_V3.wav" />
                  </div>
               </div>
            </Card>

            {/* Lip Sync Integration */}
            <Card className="p-8 bg-zinc-950 border-zinc-900 rounded-[32px] space-y-6">
               <div className="flex items-center gap-3">
                  <Waves className="w-5 h-5 text-red-500" />
                  <h3 className="text-sm font-black uppercase tracking-tight">Lip-Sync Logistics</h3>
               </div>
               <p className="text-[11px] text-zinc-500 italic leading-relaxed">
                  Neural segmentation service. Exports dialogue stems perfectly aligned for Blender and Adobe Animate interpolation.
               </p>
               <Button className="w-full h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all font-black uppercase tracking-widest text-[10px]">
                  <Download className="w-4 h-4 mr-3" /> EXPORT SYNC DATA PACK
               </Button>
            </Card>
         </div>
      </div>
    </div>
  );
}

// SfxArchiveItem is now imported from components/studio/audio/SfxArchiveItem
