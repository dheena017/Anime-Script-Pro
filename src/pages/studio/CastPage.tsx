import React from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateCharacters } from '@/services/geminiService';
import { cn } from '@/lib/utils';

// Sub-components
import { CastHeader } from './components/Cast/CastHeader';
import { CastView } from './components/Cast/CastView';
import { CastEmptyState } from './components/Cast/CastEmptyState';
import { RelationshipLab } from './components/Cast/RelationshipLab';

export function CastPage() {
  const [activeTab, setActiveTab] = React.useState<'profiles' | 'relationships'>('profiles');
  const [isLiked, setIsLiked] = React.useState(false);
  const { 
    generatedCharacters, 
    setGeneratedCharacters, 
    isGeneratingCharacters, 
    setIsGeneratingCharacters,
    prompt,
    selectedModel,
    contentType
  } = useGenerator();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingCharacters(true);
    const characters = await generateCharacters(prompt, selectedModel, contentType);
    setGeneratedCharacters(characters);
    setIsGeneratingCharacters(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <CastHeader 
        isGeneratingCharacters={isGeneratingCharacters}
        handleGenerate={handleGenerate}
        prompt={prompt}
      />

      <div className="flex justify-center">
         <div className="flex p-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-xl">
            <button 
              onClick={() => setActiveTab('profiles')}
              className={cn(
                "px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'profiles' ? "bg-studio text-white shadow-studio" : "text-zinc-500 hover:text-studio"
              )}
            >
              Character Profiles
            </button>
            <button 
              onClick={() => setActiveTab('relationships')}
              className={cn(
                "px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'relationships' ? "bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(192,38,211,0.3)]" : "text-zinc-500 hover:text-fuchsia-400"
              )}
            >
              Relationship Matrix
            </button>
         </div>
      </div>

      <Card className="bg-[#050505]/50 border border-studio shadow-studio overflow-hidden min-h-[700px]">
        <div className="w-full p-0">
          <div className="p-12 max-w-5xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {activeTab === 'relationships' ? (
                <RelationshipLab />
              ) : isGeneratingCharacters ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-studio">
                  <div className="w-10 h-10 border-2 border-studio/30 border-t-studio rounded-full animate-spin mb-6 shadow-studio" />
                  <p className="font-sans font-medium tracking-widest text-xs uppercase text-shadow-studio">Sketching character souls...</p>
                </div>
              ) : generatedCharacters ? (
                <CastView 
                  generatedCharacters={generatedCharacters}
                  isLiked={isLiked}
                  setIsLiked={setIsLiked}
                />
              ) : (
                <CastEmptyState 
                  isGeneratingCharacters={isGeneratingCharacters}
                  handleGenerate={handleGenerate}
                  prompt={prompt}
                />
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
