import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Pause, X, Music } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Scene } from './types';

interface AnimaticPlayerProps {
  scenes: Scene[];
  currentAnimaticIndex: number;
  visualData: Record<string, string>;
  onStop: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function AnimaticPlayer({
  scenes,
  currentAnimaticIndex,
  visualData,
  onStop,
  onPrev,
  onNext,
}: AnimaticPlayerProps) {
  const currentScene = scenes[currentAnimaticIndex];
  if (!currentScene) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
      <div className="absolute top-10 flex items-center justify-between w-full px-20 text-white">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-red-500 border-red-500 bg-red-500/5 px-4 py-1">LIVE ANIMATIC</Badge>
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Runtime: {currentAnimaticIndex + 1} / {scenes.length}</span>
        </div>
        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white" onClick={onStop}><X className="w-8 h-8" /></Button>
      </div>
      <div className="w-full max-w-6xl aspect-video bg-zinc-950 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(239,68,68,0.2)] relative border border-white/5">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentScene.id}
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            src={visualData[currentScene.id]}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black via-black/80 to-transparent">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} key={`text-${currentScene.id}`} className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-3xl text-zinc-100 font-serif italic leading-relaxed drop-shadow-lg font-medium">"{currentScene.narration}"</p>
            <div className="flex justify-center gap-6">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full bg-black/40 flex items-center gap-2"><Music className="w-3 h-3" /> {currentScene.sound}</span>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center gap-6 w-full max-w-md">
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" animate={{ width: `${((currentAnimaticIndex + 1) / scenes.length) * 100}%` }} />
        </div>
        <div className="flex items-center gap-8">
          <Button variant="ghost" size="icon" disabled={currentAnimaticIndex === 0} onClick={onPrev} className="text-zinc-500 hover:text-white"><ChevronDown className="w-6 h-6 rotate-90" /></Button>
          <Button variant="outline" className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700 border-none text-white shadow-lg" onClick={onStop}><Pause className="w-6 h-6" /></Button>
          <Button variant="ghost" size="icon" disabled={currentAnimaticIndex === scenes.length - 1} onClick={onNext} className="text-zinc-500 hover:text-white"><ChevronUp className="w-6 h-6 rotate-90" /></Button>
        </div>
      </div>
    </motion.div>
  );
}
