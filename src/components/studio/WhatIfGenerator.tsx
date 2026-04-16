import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, ArrowRight, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateWhatIfSummary } from '@/services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';

interface WhatIfGeneratorProps {
  scriptContext: string;
  model: string;
  onApplyChanges?: (summary: string) => void;
}

export function WhatIfGenerator({ scriptContext, model, onApplyChanges }: WhatIfGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<{prompt: string, result: string}[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim() || !scriptContext) return;
    setIsLoading(true);
    try {
      const summary = await generateWhatIfSummary(prompt, scriptContext, model);
      setResult(summary);
      setHistory(prev => [{ prompt, result: summary }, ...prev]);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'what-if-generator');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5" /> Scenario Engine
        </label>
        <div className="relative">
          <Textarea
            placeholder="What if the protagonist joins the villain?"
            className="min-h-[100px] bg-black/40 border-zinc-800 text-zinc-200 rounded-2xl p-4 text-sm resize-none focus:border-red-500/50"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            size="sm"
            className="absolute bottom-3 right-3 bg-red-600 hover:bg-red-500 text-white rounded-xl h-8 px-3"
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 mr-2" />
            )}
            {isLoading ? 'Simulating...' : 'Simulate'}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950/50">
        <div className="p-4 space-y-4">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="prose prose-invert prose-red max-w-none text-xs">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                </div>

                <div className="flex gap-2 pt-2 border-t border-zinc-800/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-[10px] font-black uppercase tracking-widest border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800"
                    onClick={() => {
                      try {
                        setPrompt('');
                        setResult('');
                      } catch (error) {
                        handleFirestoreError(error, OperationType.WRITE, 'what-if-generator');
                      }
                    }}
                  >
                    <RotateCcw className="w-3 h-3 mr-2 text-zinc-500" />
                    Reset
                  </Button>
                </div>
              </motion.div>
            ) : (
                <motion.div
                  key="placeholder"
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-700 mb-4 border border-zinc-800">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Awaiting Scenario</p>
                  <p className="text-xs text-zinc-600 italic mt-2">Explore alternate timelines and narrative ripples.</p>
                </motion.div>
              )}
          </AnimatePresence>

          {history.length > 1 && (
            <div className="pt-4 border-t border-zinc-800/50 space-y-3">
              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">Timeline History</p>
              {history.slice(1, 4).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(item.prompt);
                    setResult(item.result);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/50 transition-colors group"
                >
                  <p className="text-[10px] text-zinc-400 font-bold truncate group-hover:text-red-400 transition-colors italic">
                    "What if {item.prompt}?"
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
