import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Workflow,
  Filter,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useStudioBasePath } from '@/hooks/useStudioBasePath';
import { Button } from '@/components/ui/button';
import { generateRelationships } from '@/services/api/gemini';
import { CastEmptyState } from '../../components/CastEmptyState';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';
import { CastContext } from '../../CastLayout';
import { RelationshipCard } from '../../components/RelationshipCard';

export default function RelationshipsPage() {
  const navigate = useNavigate();
  const basePath = useStudioBasePath();
  const { handleLoadDemo } = React.useContext(CastContext);
  const { 
    characterRelationships, 
    contentType, 
    castList, 
    prompt, 
    selectedModel,
    isGeneratingCharacters
  } = useGeneratorState();
  const { setCharacterRelationships, showNotification } = useGeneratorDispatch();

  const [isGenerating, setIsGenerating] = useState(false);
  const hasCast = Array.isArray(castList) && castList.length > 0;

  // ⚠️ HOOK RULE: useMemo must be called at the top level — BEFORE any early return
  const connections = React.useMemo(() => {
    if (typeof characterRelationships === 'string' && characterRelationships.trim()) {
      try {
        return JSON.parse(characterRelationships);
      } catch (e) {
        console.error("Failed to parse relationships:", e);
        return [];
      }
    }
    return Array.isArray(characterRelationships) ? characterRelationships : [];
  }, [characterRelationships]);

  if (!hasCast) {
    return (
      <CastEmptyState
        onLaunch={() => {
          window.dispatchEvent(new CustomEvent('studio-generate-cast'));
        }}
        onLoadDemo={handleLoadDemo}
        isGenerating={isGeneratingCharacters}
      />
    );
  }

  const handleRemove = (id: string) => {
    const newList = connections.filter((c: any) => c.id !== id);
    setCharacterRelationships(JSON.stringify(newList));
  };

  const handleSynthesizeSocialWeb = async () => {
    if (!castList || castList.length === 0) {
      showNotification?.("You need a cast first before synthesizing a social web.", "error");
      return;
    }

    setIsGenerating(true);
    try {
      const castNames = castList.map((c: any) => c.name).join(", ");
      const result = await generateRelationships(prompt, castNames, selectedModel, contentType);
      
      if (result && Array.isArray(result)) {
        // Add IDs safely if missing
        const processedResult = result.map((rel, idx) => {
          if (rel.id) return rel;
          return {
            ...rel,
            id: `rel-${Date.now()}-${idx}`
          };
        });
        setCharacterRelationships(JSON.stringify(processedResult));
        showNotification?.("Social web synthesized successfully!", "success");
      }
    } catch (error) {
      console.error("Failed to synthesize relationships:", error);
      showNotification?.("Synthesis failed. Check engine status.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-xs uppercase tracking-widest text-fuchsia-400 font-bold">
            Relationship Lab
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Emotional <span className="text-fuchsia-500">Dynamics</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium max-w-md">
            Engineering the emotional friction and tactical alliances that drive your plot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={isGenerating}
            className="border-fuchsia-500/30 bg-fuchsia-500/5 text-fuchsia-500 font-black uppercase tracking-wider hover:bg-fuchsia-500/10 h-12 px-8 rounded-2xl transition-all group"
            onClick={handleSynthesizeSocialWeb}
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            )}
            {isGenerating ? "Synthesizing..." : "Synthesize Social Web"}
          </Button>

          <Button
            className="bg-fuchsia-600 text-white font-black uppercase tracking-wider hover:bg-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.3)] h-12 px-8 rounded-2xl"
            onClick={() => navigate(`${basePath}/cast/relationships/new`)}
          >
            <Plus className="w-5 h-5 mr-2" /> Establish Connection
          </Button>
        </div>
      </div>


      {/* Relationships Grid - Two per row on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <AnimatePresence mode="popLayout">
          {connections.length > 0 ? (
            connections.map((conn: any, idx: number) => (
              <motion.div
                key={conn.id || idx}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <RelationshipCard
                  connection={conn}
                  onRemove={handleRemove}
                  onView={(id: string) => navigate(`${basePath}/cast/relationships/${id}`)}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <StudioEmptyState
                icon={Workflow}
                title="Matrix Empty"
                description="No relationship threads exist yet. Synthesize the social web or manually register the first connection."
                features={[
                  { icon: Sparkles, title: 'Auto Synthesis', description: 'Generate conflicts and alliances from cast data' },
                  { icon: Filter, title: 'Thread Controls', description: 'Classify bonds by emotional intensity' },
                  { icon: Plus, title: 'Manual Link', description: 'Create your first direct relationship record' }
                ]}
                accentColor="fuchsia"
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

