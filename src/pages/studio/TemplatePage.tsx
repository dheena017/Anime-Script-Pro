import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGenerator } from '@/contexts/GeneratorContext';
import { useNavigate } from 'react-router-dom';

// Sub-components
import { TemplateCard } from './components/Template/TemplateCard';
import { TemplateDetailModal } from './components/Template/TemplateDetailModal';
import { StructureView } from './components/Template/StructureView';
import { VaultView } from './components/Template/VaultView';

// Constants
import { CATEGORIES, QUICK_TEMPLATES, templateMarkdown } from './templateConstants';

export function TemplatePage() {
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompts' | 'structure' | 'custom'>('prompts');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showTemplateDetails, setShowTemplateDetails] = useState<string | null>(null);
  
  const { setPrompt } = useGenerator();
  const navigate = useNavigate();

  const handleUsePrompt = (promptText: string) => {
    setPrompt(promptText);
    navigate('..', { relative: 'path' });
  };

  const filteredTemplates = QUICK_TEMPLATES.filter(t => {
    const matchesSearch = t.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedTemplateData = QUICK_TEMPLATES.find(t => t.id === showTemplateDetails);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-[0.2em] flex items-center gap-3 text-cyan-50 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
            <ScrollText className="w-8 h-8 text-cyan-400" /> Forge Library
          </h2>
          <p className="text-cyan-500/60 font-bold uppercase tracking-[0.2em] text-[10px] bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-500/20 inline-block">
            Production-Ready Frameworks & Blueprints
          </p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-[#0a0a0a] rounded-full border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          {(['prompts', 'structure', 'custom'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab 
                  ? `${tab === 'prompts' ? 'bg-cyan-500' : tab === 'structure' ? 'bg-orange-500' : 'bg-purple-500'} text-white shadow-[0_0_15px_rgba(0,0,0,0.4)]` 
                  : "text-zinc-500 hover:text-white"
              )}
            >
              {tab === 'prompts' ? 'Blueprints' : tab === 'structure' ? 'Standard' : 'Vault'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'prompts' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-y border-zinc-800/50 py-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 max-w-full">
              {CATEGORIES.map(cat => (
                <Badge
                  key={cat}
                  variant="outline"
                  className={cn(
                    "cursor-pointer px-3 py-1 text-[9px] uppercase tracking-widest font-bold transition-all border-zinc-800",
                    selectedCategory === cat ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50" : "text-zinc-500 hover:text-cyan-400"
                  )}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-600" />
              <Input 
                placeholder="Find Blueprint..."
                className="pl-10 h-9 bg-black/40 border-cyan-500/10 focus:border-cyan-500/40 text-[11px] rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, idx) => (
              <TemplateCard 
                key={template.id}
                template={template}
                idx={idx}
                handleUsePrompt={handleUsePrompt}
                setShowTemplateDetails={setShowTemplateDetails}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showTemplateDetails && selectedTemplateData && (
          <TemplateDetailModal 
            template={selectedTemplateData}
            onClose={() => setShowTemplateDetails(null)}
            handleUsePrompt={handleUsePrompt}
          />
        )}
      </AnimatePresence>

      {activeTab === 'structure' && (
        <StructureView 
          templateMarkdown={templateMarkdown}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
        />
      )}

      {activeTab === 'custom' && <VaultView />}
    </motion.div>
  );
}
