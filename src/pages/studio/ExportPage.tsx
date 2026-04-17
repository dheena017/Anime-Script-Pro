import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Share2
} from 'lucide-react';
import { useGenerator } from '@/contexts/GeneratorContext';
import { jsPDF } from "jspdf";
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { ExportTopBar } from '@/components/studio/modules/export/ExportTopBar';
import { ExportPanel } from '@/components/studio/modules/export/ExportPanel';

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

      doc.addPage();
      doc.setTextColor(220, 38, 38);
      doc.setFontSize(18);
      doc.text("SERIES CONCEPT", 20, 30);
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(10);
      const splitSeries = doc.splitTextToSize(generatedSeriesPlan || "No series plan generated.", 170);
      doc.text(splitSeries, 20, 45);

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
    <div className="pb-20">
      <ExportTopBar>
        <ExportPanel
          isRendering={isRendering}
          renderProgress={renderProgress}
          isExportingDeck={isExportingDeck}
          onStartRender={startAnimaticRender}
          onGeneratePitchDeck={generatePitchDeck}
        />
      </ExportTopBar>

      <AnimatePresence>
        {exportComplete && (
          <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className="fixed bottom-10 right-10 z-[100] bg-emerald-500 text-white px-8 py-5 rounded-[24px] shadow-[0_20px_60px_rgba(16,185,129,0.3)] flex items-center gap-5 cursor-pointer hover:bg-emerald-400 transition-all active:scale-95"
             onClick={() => setExportComplete(false)}
          >
             <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
             </div>
             <div>
                <p className="text-sm font-black uppercase tracking-widest leading-none mb-1">Export Successful</p>
                <p className="text-[10px] opacity-80 font-black uppercase tracking-tighter">Neural Asset Synchronized</p>
             </div>
             <Share2 className="w-5 h-5 ml-4 opacity-40 hover:opacity-100" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
