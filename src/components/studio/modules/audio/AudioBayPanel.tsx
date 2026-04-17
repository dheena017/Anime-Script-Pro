import React from 'react';
import { motion } from 'motion/react';
import { 
  Volume2, 
  Music, 
  Sparkles, 
  Waves,
  Download
} from 'lucide-react';
import { SfxArchiveItem } from '@/components/studio/audio/SfxArchiveItem';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AudioBayPanelProps {
  generatedScript: string | null;
  progress: number;
  activeSegment: number | null;
  isGeneratingSfx: boolean;
  onGenerateSfx: () => void;
}

export function AudioBayPanel({ 
  generatedScript, 
  progress, 
  activeSegment, 
  isGeneratingSfx, 
  onGenerateSfx 
}: AudioBayPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left: Script Flow */}
      <div className="lg:col-span-7 space-y-6">
        <Card className="bg-zinc-950 border-zinc-900 rounded-[32px] overflow-hidden">
          <div className="p-6 border-b border-zinc-900 bg-zinc-900/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-red-500" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Active Table Read Stream</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-48 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
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
                    className={`p-4 rounded-xl transition-all duration-500 ${activeSegment === idx ? 'bg-red-600/10 text-white border border-red-500/20 shadow-[0_0_25px_rgba(220,38,38,0.15)] scale-[1.02]' : 'opacity-30 hover:opacity-100 hover:bg-zinc-900/50'}`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center italic text-zinc-700 uppercase tracking-widest text-[10px] font-black">
                Initialize a script to begin the read sequence.
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>

      {/* Right: Sound Design & Logistics */}
      <div className="lg:col-span-5 space-y-8">
        {/* SFX Labs */}
        <Card className="p-10 bg-zinc-950 border-zinc-900 rounded-[40px] space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-all duration-1000" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
              <Music className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight text-white italic">AI SFX Labs</h3>
          </div>
          <div className="space-y-6">
            <div className="relative group/input">
              <input 
                type="text" 
                placeholder="e.g., Blade clashes against shield with sparks..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl h-14 px-6 text-xs font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/50 transition-all shadow-inner"
              />
              <Button 
                size="sm" 
                className="absolute right-2 top-2 bottom-2 rounded-xl bg-red-600 text-white hover:bg-red-500 px-5 shadow-lg group-hover/input:scale-105 transition-transform"
                disabled={isGeneratingSfx}
                onClick={onGenerateSfx}
              >
                {isGeneratingSfx ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SfxArchiveItem label="Sword_Clash_01.wav" />
              <SfxArchiveItem label="Portal_Hum_V3.wav" />
            </div>
          </div>
        </Card>

        {/* Lip Sync Integration */}
        <Card className="p-10 bg-zinc-950 border-zinc-900 rounded-[40px] space-y-8 shadow-2xl overflow-hidden relative">
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-600/5 rounded-full blur-[80px]" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <Waves className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight text-white italic">Lip-Sync Logistics</h3>
          </div>
          <p className="text-[11px] text-zinc-500 italic leading-relaxed font-medium">
            Neural segmentation service. Exports dialogue stems perfectly aligned for Blender and Adobe Animate interpolation.
          </p>
          <Button className="w-full h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-white/10 transition-all font-black uppercase tracking-widest text-[10px] shadow-xl">
             <Download className="w-4 h-4 mr-3 text-blue-500" /> EXPORT SYNC DATA PACK
          </Button>
        </Card>
      </div>
    </div>
  );
}
