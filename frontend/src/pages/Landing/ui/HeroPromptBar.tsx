import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RefreshCcw, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STYLE_OPTIONS, PLACEHOLDER_PROMPTS } from '../constants';
import { cn } from '@/lib/utils';

interface HeroPromptBarProps {
  promptText: string;
  setPromptText: (text: string) => void;
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  placeholderIndex: number;
  handleGenerate: () => void;
}

export const HeroPromptBar: React.FC<HeroPromptBarProps> = ({
  promptText,
  setPromptText,
  selectedStyle,
  setSelectedStyle,
  placeholderIndex,
  handleGenerate: onGenerate,
}) => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!promptText.trim()) {
      setError("DIRECTIVE REQUIRED FOR TRANSMISSION");
      setTimeout(() => setError(null), 3000);
      return;
    }

    onGenerate();
  };

  const randomizeDirective = () => {
    const random = PLACEHOLDER_PROMPTS[Math.floor(Math.random() * PLACEHOLDER_PROMPTS.length)];
    setPromptText(random);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-5xl mx-auto w-full space-y-6"
    >
      <div className="relative group">
        {/* Focus Aura */}
        <div className="absolute -inset-[2px] bg-gradient-to-r from-studio/40 via-fuchsia-500/40 to-studio/40 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-40 transition-opacity duration-700" />
        
        <div className="relative bg-[#0a0a0b]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 shadow-[0_30px_70px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 p-2">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0">
                   <Sparkles className="w-6 h-6 text-studio" />
                </div>
                <textarea
                  value={promptText}
                  onChange={(e) => {
                    setPromptText(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                  placeholder={PLACEHOLDER_PROMPTS[placeholderIndex]}
                  aria-label="Describe the anime art you want to generate"
                  rows={2}
                  className="flex-1 bg-transparent border-none outline-none text-white text-lg md:text-xl font-bold placeholder:text-zinc-700 py-2 resize-none max-h-[12rem] overflow-y-auto hide-scrollbar leading-relaxed uppercase tracking-tight"
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 px-2">
                <div className="flex items-center gap-3">
                   <button 
                    onClick={randomizeDirective}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                   >
                      <RefreshCcw className="w-3 h-3" /> Randomize
                   </button>
                   <AnimatePresence>
                     {error && (
                       <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-2 text-red-500 text-[9px] font-black uppercase tracking-widest"
                       >
                          <AlertCircle className="w-3.5 h-3.5" /> {error}
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isTransmitting}
                  className={cn(
                    "h-14 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all relative overflow-hidden group",
                    isTransmitting ? "bg-zinc-800 text-zinc-500" : "bg-studio text-black hover:bg-white hover:scale-105"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isTransmitting ? (
                      <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin" />
                        Transmitting...
                      </motion.div>
                    ) : (
                      <motion.span 
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 flex items-center"
                      >
                        <Send className="w-4 h-4 mr-3" />
                        Initialize Synthesis
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
          </div>
        </div>
      </div>

      {/* STYLE GRID MASTER */}
      <div className="bg-[#0a0a0b]/40 backdrop-blur-md rounded-3xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-studio" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Engine Styles</span>
           </div>
           <div className="flex items-center gap-2 text-zinc-600">
              <Info className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Select AI Style</span>
           </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style.label}
              onClick={() => setSelectedStyle(style.label)}
              title={style.desc}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all relative group overflow-hidden",
                selectedStyle === style.label
                  ? style.color + " ring-1 ring-white/10 scale-105 shadow-xl"
                  : "bg-zinc-900/50 text-zinc-600 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700"
              )}
            >
              {selectedStyle === style.label && (
                <motion.div 
                  layoutId="active-style"
                  className="absolute inset-0 bg-white/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                 {style.label}
                 {selectedStyle === style.label && <span className="text-[8px] opacity-40 italic">{style.node}</span>}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};


