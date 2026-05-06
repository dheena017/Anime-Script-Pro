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
import { useGenerator } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RelationshipCard } from '../../components/RelationshipCard';
import { generateRelationships } from '@/services/api/gemini';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';

export default function RelationshipsPage() {
  const navigate = useNavigate();
  const { 
    characterRelationships, 
    setCharacterRelationships, 
    contentType, 
    castList, 
    prompt, 
    selectedModel,
    showNotification 
  } = useGenerator();
  const [isGenerating, setIsGenerating] = useState(false);
  const hasCast = Array.isArray(castList) && castList.length > 0;

  if (!hasCast) {
    return (
      <StudioEmptyState
        icon={Workflow}
        title="Relationship Lab Empty"
        description="Generate your cast first to synthesize emotional threads, alliances, and rivalry arcs."
        actionLabel="Open Cast Registry"
        onAction={() => navigate(`/${contentType.toLowerCase()}/cast`)}
        features={[
          { icon: Sparkles, title: 'Social Graph Seed', description: 'Cast entities become relationship nodes' },
          { icon: Filter, title: 'Thread Filtering', description: 'Unlock tactical relation clustering' },
          { icon: Plus, title: 'Connection Forge', description: 'Create and tune core character links' }
        ]}
        accentColor="fuchsia"
      />
    );
  }

  // Parse relationships if they are stored as JSON string
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
          <div className="inline-block px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-[10px] uppercase tracking-widest text-fuchsia-400 font-bold">
            Relationship Lab
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
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
            onClick={() => navigate(`/${contentType.toLowerCase()}/cast/relationships/new`)}
          >
            <Plus className="w-5 h-5 mr-2" /> Establish Connection
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-zinc-900/40 border border-white/5 rounded-3xl backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search active threads..."
            className="pl-12 bg-black/40 border-zinc-800 focus:border-fuchsia-500/50 h-12 rounded-2xl"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-zinc-500 hover:text-white uppercase tracking-widest text-[10px] font-black">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <div className="w-px h-6 bg-zinc-800 mx-2" />
          <div className="flex items-center gap-4 px-4 py-2 bg-black/40 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Threads: {connections.length}</span>
            </div>
          </div>
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
                  onView={(id: string) => navigate(`/${contentType.toLowerCase()}/cast/relationships/${id}`)}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <StudioEmptyState
                icon={Workflow}
                title="Matrix Empty"
                description="No relationship threads exist yet. Synthesize the social web or manually register the first connection."
                actionLabel={isGenerating ? "Synthesizing..." : "Synthesize Social Web"}
                onAction={handleSynthesizeSocialWeb}
                isActionDisabled={isGenerating}
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

