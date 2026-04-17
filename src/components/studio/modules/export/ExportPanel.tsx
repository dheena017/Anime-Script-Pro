import React from 'react';
import { motion } from 'motion/react';
import { 
  Film, 
  FileText, 
  Download, 
  Play, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ExportPanelProps {
  isRendering: boolean;
  renderProgress: number;
  isExportingDeck: boolean;
  onStartRender: () => void;
  onGeneratePitchDeck: () => void;
}

export function ExportPanel({ 
  isRendering, 
  renderProgress, 
  isExportingDeck, 
  onStartRender, 
  onGeneratePitchDeck 
}: ExportPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Animatic Export Card */}
      <Card className="relative group p-12 bg-zinc-950/40 backdrop-blur-3xl border-white/5 rounded-[48px] overflow-hidden space-y-10 shadow-2xl transition-all hover:bg-zinc-900/40">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
           <Film className="w-20 h-20 text-red-500" />
        </div>
        
        <div className="space-y-4 relative z-10">
           <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Animatic <span className="text-red-600">Render</span></h3>
           <p className="text-sm text-zinc-500 font-medium italic leading-relaxed max-w-sm">
              Neural stitching of storyboards, voice stems, and dialogue into a high-fidelity industry preview.
           </p>
        </div>

        <div className="space-y-8 relative z-10">
           {isRendering ? (
             <div className="space-y-5">
                <div className="flex justify-between items-end">
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Rendering Sequence...</span>
                   </div>
                   <span className="text-lg font-black text-white font-mono">{renderProgress}%</span>
                </div>
                <div className="h-3 w-full bg-zinc-900 border border-white/5 p-0.5 rounded-full overflow-hidden shadow-inner">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${renderProgress}%` }}
                     className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                   />
                </div>
             </div>
           ) : (
             <Button 
                onClick={onStartRender}
                className="w-full h-20 rounded-[24px] bg-white text-black hover:bg-red-600 hover:text-white transition-all duration-500 font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl group border-none"
             >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 mr-4 group-hover:bg-white/20 transition-colors">
                   <Play className="w-5 h-5 fill-current" />
                </div>
                Initialize Render
             </Button>
           )}
        </div>

        <div className="grid grid-cols-3 gap-4 opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
           {[1,2,3].map(i => (
             <div key={i} className="h-20 bg-zinc-900 rounded-2xl border border-white/5" />
           ))}
        </div>
      </Card>

      {/* Pitch Deck Card */}
      <Card className="relative group p-12 bg-zinc-950/40 backdrop-blur-3xl border-white/5 rounded-[48px] overflow-hidden space-y-10 shadow-2xl transition-all hover:bg-zinc-900/40">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
           <FileText className="w-20 h-20 text-purple-500" />
        </div>
        
        <div className="space-y-4 relative z-10">
           <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Pitch <span className="text-purple-600">Deck</span></h3>
           <p className="text-sm text-zinc-500 font-medium italic leading-relaxed max-w-sm">
              Automated compilation of world bibles, character archetypes, and lore into a cinematic pitch asset.
           </p>
        </div>

        <div className="space-y-6 relative z-10">
           <Button 
              onClick={onGeneratePitchDeck}
              disabled={isExportingDeck}
              className="w-full h-20 rounded-[24px] bg-zinc-900 border border-white/10 text-white hover:bg-purple-600 transition-all duration-500 font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl group"
           >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 mr-4 group-hover:bg-white/20 transition-colors">
                 {isExportingDeck ? <Loader2 className="w-5 h-5 animate-spin"/> : <Download className="w-5 h-5" />}
              </div>
              Synthesize Case Case
           </Button>
           <div className="flex items-center justify-center gap-8 py-2">
              <div className="flex items-center gap-2">
                 <CheckCircleIcon className="w-3 h-3 text-emerald-500" />
                 <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">PDF Logic Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                 <CheckCircleIcon className="w-3 h-3 text-emerald-500" />
                 <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">Visual Stitching OK</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-5 pt-4">
           <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-xl">
                   <Sparkles className="w-5 h-5 text-zinc-700" />
                </div>
              ))}
           </div>
           <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] italic">Aesthetic Refinement: Active</p>
        </div>
      </Card>
    </div>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
