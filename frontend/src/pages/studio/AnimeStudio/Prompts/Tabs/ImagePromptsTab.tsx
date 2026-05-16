import React from 'react';
import { Image, Sparkles, Copy, RefreshCw, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ImagePromptsTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const ImagePromptsTab: React.FC<ImagePromptsTabProps> = ({
  content,
  isGenerating,
  onGenerate
}) => {
  const prompts = content ? content.split('\n').filter(p => p.trim().length > 0) : [];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="py-10 space-y-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[2rem] bg-studio/10 border border-studio/20 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <Image className="w-8 h-8 text-studio" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Visual Manifest</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mt-1">
              Core archetypes and environmental descriptors
            </p>
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="h-14 px-8 bg-studio text-black font-black uppercase tracking-widest text-xs rounded-2xl flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale group shadow-[0_0_30px_rgba(6,182,212,0.2)]"
        >
          {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isGenerating ? 'Synthesizing...' : 'Re-Generate Manifest'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {prompts.length > 0 ? (
          prompts.map((prompt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group relative bg-[#080808] border-white/5 hover:border-studio/30 transition-all duration-500 overflow-hidden rounded-[2rem]">
                <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="p-8 flex items-start gap-8 relative z-10">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-zinc-500 font-mono italic">
                    #{String(i + 1).padStart(2, '0')}
                  </div>
                  
                  <div className="flex-grow space-y-4">
                    <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                      {prompt.replace(/^\d+\.\s*/, '')}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleCopy(prompt)}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-studio transition-colors"
                      >
                        <Copy className="w-3 h-3" /> Copy DNA
                      </button>
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-studio transition-colors">
                        <Eye className="w-3 h-3" /> View Artifact
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="p-20 bg-black/40 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
              <Sparkles className="w-8 h-8 text-zinc-700" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-3 italic">Void Detected</h3>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
              No visual archetypes have been synthesized yet. Launch the manifest engine to manifest your vision.
            </p>
            <button
              onClick={onGenerate}
              className="mt-10 h-12 px-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all"
            >
              Synthesize DNA
            </button>
          </Card>
        )}
      </div>
    </div>
  );
};



