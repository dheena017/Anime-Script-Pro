import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Film, 
  FileText, 
  Download, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useGenerator } from '@/contexts/GeneratorContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';

export function ExportPage() {
  const { generatedScript, generatedCharacters, generatedSeriesPlan, prompt } = useGenerator();
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [isExportingDeck, setIsExportingDeck] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const startAnimaticRender = () => {
    setIsRendering(true);
    setRenderProgress(0);
    
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          setExportComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const generatePitchDeck = () => {
    setIsExportingDeck(true);
    try {
      const doc = new jsPDF();
      
      // Title Page
      doc.setFillColor(20, 20, 20);
      doc.rect(0, 0, 210, 297, 'F');
      doc.setTextColor(220, 38, 38);
      doc.setFontSize(40);
      doc.text("PITCH DECK", 105, 100, { align: 'center' });
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text(prompt || "UNTITLED PROJECT", 105, 120, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("PRODUCED BY ANIME SCRIPT PRO NEURAL ENGINE", 105, 280, { align: 'center' });

      // Series Concept
      doc.addPage();
      doc.setTextColor(220, 38, 38);
      doc.setFontSize(18);
      doc.text("SERIES CONCEPT", 20, 30);
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(10);
      const splitSeries = doc.splitTextToSize(generatedSeriesPlan || "No series plan generated.", 170);
      doc.text(splitSeries, 20, 45);

      // Cast
      doc.addPage();
      doc.setTextColor(220, 38, 38);
      doc.setFontSize(18);
      doc.text("CHARACTER ARCHETYPES", 20, 30);
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(10);
      const splitCast = doc.splitTextToSize(generatedCharacters || "No character data generated.", 170);
      doc.text(splitCast, 20, 45);

      doc.save(`${prompt || 'anime'}-pitch-deck.pdf`);
      setExportComplete(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'pdf-export');
    } finally {
      setIsExportingDeck(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Header */}
      <div className="relative p-12 rounded-[40px] bg-zinc-950 border border-zinc-900 overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(220,38,38,0.1),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 mx-auto md:mx-0">
                <Package className="w-3 h-3 text-red-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Logistics & Finalization</span>
             </div>
             <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">EXPORT <span className="text-red-600">ENGINE</span></h1>
             <p className="text-zinc-500 max-w-xl text-sm font-medium leading-relaxed italic">
                From neural concept to production-ready assets. Stitch animatics, synthesize pitch decks, and deploy your vision to the industry.
             </p>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl space-y-4 min-w-[280px]">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Project Health</span>
                <span className="text-[10px] font-black text-emerald-500 uppercase">Production Ready</span>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight text-zinc-400">
                   <span>Neural Integrity</span>
                   <span>98%</span>
                </div>
                <Progress value={98} className="h-1 bg-zinc-800" indicatorClassName="bg-emerald-500" />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Animatic Export Card */}
         <Card className="relative group p-10 bg-zinc-950 border-zinc-900 rounded-[40px] overflow-hidden space-y-8">
            <div className="absolute top-0 right-0 p-8">
               <Film className="w-12 h-12 text-zinc-900 transition-colors group-hover:text-red-900/20" />
            </div>
            
            <div className="space-y-4 relative z-10">
               <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Animatic <span className="text-red-600">Render</span></h3>
               <p className="text-sm text-zinc-500 font-medium italic leading-relaxed max-w-xs">
                  Neural stitching of storyboards, voice stems, and dialogue into a playable .mp4 preview.
               </p>
            </div>

            <div className="space-y-6">
               {isRendering ? (
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">Rendering Sequence...</span>
                       <span className="text-sm font-black text-white font-mono">{renderProgress}%</span>
                    </div>
                    <Progress value={renderProgress} className="h-3 bg-zinc-900 border border-white/5" indicatorClassName="bg-gradient-to-r from-red-600 to-red-400" />
                 </div>
               ) : (
                 <Button 
                    onClick={startAnimaticRender}
                    className="w-full h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-black uppercase tracking-widest text-xs"
                 >
                    <Play className="w-4 h-4 mr-3" /> Initialize Render
                 </Button>
               )}
            </div>

            <div className="grid grid-cols-3 gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
               <div className="h-16 bg-zinc-900 rounded-xl" />
               <div className="h-16 bg-zinc-900 rounded-xl" />
               <div className="h-16 bg-zinc-900 rounded-xl" />
            </div>
         </Card>

         {/* Pitch Deck Card */}
         <Card className="relative group p-10 bg-zinc-950 border-zinc-900 rounded-[40px] overflow-hidden space-y-8">
            <div className="absolute top-0 right-0 p-8">
               <FileText className="w-12 h-12 text-zinc-900 transition-colors group-hover:text-red-900/20" />
            </div>
            
            <div className="space-y-4 relative z-10">
               <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Pitch <span className="text-red-600">Deck</span></h3>
               <p className="text-sm text-zinc-500 font-medium italic leading-relaxed max-w-xs">
                  Automated formatting of characters, lore, and storyboard into a cinematic industry-standard PDF.
               </p>
            </div>

            <div className="space-y-4">
               <Button 
                  onClick={generatePitchDeck}
                  disabled={isExportingDeck}
                  className="w-full h-16 rounded-2xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-all font-black uppercase tracking-widest text-xs"
               >
                  {isExportingDeck ? <Loader2 className="w-4 h-4 mr-3 animate-spin"/> : <Download className="w-4 h-4 mr-3" />}
                  Generate PDF Deck
               </Button>
               <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest text-center">
                  Includes: Concept, 3 Archetypes, Story Arcs
               </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
               <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-zinc-950 flex items-center justify-center">
                       <Sparkles className="w-4 h-4 text-zinc-700" />
                    </div>
                  ))}
               </div>
               <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Aesthetic Optimization Active</span>
            </div>
         </Card>
      </div>

      <AnimatePresence>
        {exportComplete && (
          <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className="fixed bottom-10 right-10 z-[100] bg-emerald-500 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 cursor-pointer hover:bg-emerald-600 transition-all"
             onClick={() => setExportComplete(false)}
          >
             <CheckCircle2 className="w-6 h-6" />
             <div>
                <p className="text-xs font-black uppercase tracking-widest">Export Successful</p>
                <p className="text-[10px] opacity-80 font-bold uppercase tracking-tighter">Asset ready for distribution</p>
             </div>
             <Share2 className="w-5 h-5 ml-4 opacity-50" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
