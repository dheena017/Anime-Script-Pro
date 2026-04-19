import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Layers, Sparkles, Heart, Table, Box, ChevronRight, Play, CloudUpload, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateSeriesPlan } from '@/services/geminiService';
import { cn } from '@/lib/utils';
import { generateProductionSequences } from '@/lib/sequence-utils';
import { db, auth } from '@/firebase';
import { collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { ManifestScaffolder } from '@/components/studio/ManifestArchitect';
import { BookOpen, Map, Milestone, ExternalLink, Activity } from 'lucide-react';

export function SeriesPage() {
  const [isLiked, setIsLiked] = React.useState(false);
  const [scaffoldConfig, setScaffoldConfig] = React.useState({ sess: 1, ep: 1, scen: 1 });
  const [showScaffolder, setShowScaffolder] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncProgress, setSyncProgress] = React.useState(0);
  const [lastSyncDate, setLastSyncDate] = React.useState<string | null>(null);
  
  const { 
    generatedSeriesPlan, 
    setGeneratedSeriesPlan, 
    isGeneratingSeries, 
    setIsGeneratingSeries,
    prompt,
    selectedModel,
    contentType,
    productionSequence,
    setProductionSequence,
    session,
    episode,
    setSession,
    setEpisode
  } = useGenerator();

  const totalEpisodesInManifest = React.useMemo(() => {
    // Unique list of Sess-Ep combinations
    const episodes = new Set(productionSequence.map(u => `S${u.sess}E${u.ep}`));
    return episodes.size || 5; // Fallback to 5 if no sequence
  }, [productionSequence]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingSeries(true);
    const plan = await generateSeriesPlan(prompt, selectedModel, contentType, totalEpisodesInManifest);
    setGeneratedSeriesPlan(plan);
    setIsGeneratingSeries(false);
  };

  const handleScaffold = () => {
    const sequence = generateProductionSequences(
      scaffoldConfig.sess,
      scaffoldConfig.ep,
      scaffoldConfig.scen
    );
    setProductionSequence(sequence);
  };

  const handleBulkSave = async () => {
    if (!auth.currentUser || productionSequence.length === 0) return;
    setIsSyncing(true);
    setSyncProgress(0);
    
    try {
      const CHUNK_SIZE = 500; // Firestore batch limit
      const totalChunks = Math.ceil(productionSequence.length / CHUNK_SIZE);

      for (let i = 0; i < productionSequence.length; i += CHUNK_SIZE) {
        const batch = writeBatch(db);
        const chunk = productionSequence.slice(i, i + CHUNK_SIZE);
        
        chunk.forEach((item) => {
          const docRef = doc(collection(db, 'production_units'));
          batch.set(docRef, {
            ...item,
            uid: auth.currentUser?.uid,
            status: 'planned',
            contentType,
            parentPrompt: prompt,
            createdAt: serverTimestamp()
          });
        });

        await batch.commit();
        setSyncProgress(Math.min(100, Math.round(((i + CHUNK_SIZE) / productionSequence.length) * 100)));
      }
      setLastSyncDate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Bulk sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const applySequenceItem = (sess: number, ep: number) => {
    setSession(sess.toString());
    setEpisode(ep.toString());
  };

  const handleManifestContinue = async (config: { sessions: number; episodes: number; scenes: number }) => {
    // First generate the local sequence
    const sequence = generateProductionSequences(
      config.sessions,
      config.episodes,
      config.scenes
    );
    setProductionSequence(sequence);
    
    // Then trigger the bulk save
    // We pass the sequence directly to avoid waiting for state update
    if (!auth.currentUser) return;
    setIsSyncing(true);
    setSyncProgress(0);
    
    try {
      const CHUNK_SIZE = 500;
      for (let i = 0; i < sequence.length; i += CHUNK_SIZE) {
        const batch = writeBatch(db);
        const chunk = sequence.slice(i, i + CHUNK_SIZE);
        
        chunk.forEach((item) => {
          const docRef = doc(collection(db, 'production_units'));
          batch.set(docRef, {
            ...item,
            uid: auth.currentUser?.uid,
            status: 'planned',
            contentType,
            parentPrompt: prompt,
            createdAt: serverTimestamp()
          });
        });

        await batch.commit();
        setSyncProgress(Math.min(100, Math.round(((i + CHUNK_SIZE) / sequence.length) * 100)));
      }
      setLastSyncDate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Bulk sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-studio text-shadow-studio">
            <Layers className="w-6 h-6 text-studio" />
            Series Plan
          </h2>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-studio/5 border border-studio/20 rounded-lg">
            <Box className="w-3 h-3 text-studio/50" />
            <span className="text-[10px] font-black text-studio/60 uppercase tracking-tighter">Unit</span>
            <span className="text-sm font-black text-white font-mono">S{session}-E{episode}</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowScaffolder(!showScaffolder)}
          className="border-studio/20 text-studio hover:bg-studio/10 uppercase tracking-widest text-[10px] font-black"
        >
          <Table className="w-3 h-3 mr-2" />
          {showScaffolder ? 'Hide Scaffolder' : 'Batch Production Scaffolder'}
        </Button>
      </div>

      <AnimatePresence>
        {showScaffolder && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <ManifestScaffolder 
              onContinue={handleManifestContinue} 
              isLoading={isSyncing} 
            />

            {lastSyncDate && !isSyncing && (
              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/5 py-2 rounded-full border border-green-500/10">
                <CheckCircle2 className="w-3 h-3" />
                Production Blueprint locked to database at {lastSyncDate}
              </div>
            )}

            {productionSequence.length > 0 && !isSyncing && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-4"
              >
                <div className="flex items-center justify-between px-4">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Table className="w-3 h-3" />
                    Generated Manifest: {productionSequence.length} Units
                  </span>
                </div>
                <ScrollArea className="h-[200px] border border-studio/10 rounded-3xl bg-[#050505]/80 backdrop-blur-xl">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-6">
                    {productionSequence.map((unit, idx) => (
                      <div 
                        key={idx}
                        className="p-3 bg-zinc-900/30 border border-studio/5 rounded-2xl hover:border-studio/30 transition-all group flex flex-col justify-between"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">S{unit.sess} E{unit.ep} SC{unit.scen}</span>
                          <span className="text-[10px] text-studio font-medium">Unit {idx + 1}</span>
                        </div>
                        <button 
                          onClick={() => applySequenceItem(unit.sess, unit.ep)}
                          className="mt-2 text-[8px] font-black uppercase tracking-widest text-zinc-500 hover:text-studio flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Jump <ChevronRight className="w-2 h-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="bg-[#050505]/50 border border-studio backdrop-blur-xl shadow-studio overflow-hidden min-h-[700px]">
        <div className="p-4 border-b border-studio/10 bg-[#0a0a0a]/80 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-500">
              <Layers className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Story Architecture</span>
            </div>
            <div className="w-[1px] h-4 bg-zinc-800" />
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7 rounded-full transition-all duration-300",
                isLiked ? "text-fuchsia-400 bg-fuchsia-500/10 shadow-[0_0_10px_rgba(217,70,239,0.2)]" : "text-zinc-600 hover:text-fuchsia-400 hover:bg-[#0a0a0a]"
              )}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            </Button>
          </div>
          <Button 
            size="sm" 
            className="bg-studio hover:bg-studio/80 text-white font-black tracking-widest uppercase text-xs h-9 px-6 shadow-studio"
            onClick={handleGenerate}
            disabled={isGeneratingSeries || !prompt.trim()}
          >
            {isGeneratingSeries ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Sparkles className="w-3 h-3 mr-2" />
            )}
            {isGeneratingSeries ? 'Generating...' : 'Generate'}
          </Button>
        </div>
        <div className="w-full p-0">
          <div className="p-12 max-w-4xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {isGeneratingSeries ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-studio">
                  <div className="w-10 h-10 border-2 border-studio/30 border-t-studio rounded-full animate-spin mb-6 shadow-studio" />
                  <p className="font-sans font-medium uppercase tracking-[0.2em] text-[10px] text-shadow-studio">Architecting narrative arcs...</p>
                </div>
              ) : generatedSeriesPlan ? (
                <div className="space-y-16">
                  <div className="border-b border-studio/20 pb-12 text-center space-y-4">
                    <div className="inline-block px-3 py-1 bg-studio/10 border border-studio/30 rounded-full text-[10px] uppercase tracking-[0.3em] text-studio font-bold shadow-studio">
                      Production Roadmap
                    </div>
                    <h1 className="text-5xl font-black text-studio text-shadow-studio uppercase tracking-widest leading-tight">
                      Master Sequence Plan
                    </h1>
                    <p className="text-zinc-500 italic max-w-lg mx-auto font-medium">
                      {totalEpisodesInManifest} Episodes mapped across the active manifest structure.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-12">
                    {generatedSeriesPlan.map((ep, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className="bg-black/40 border-studio/10 p-8 hover:border-studio/30 transition-all group relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Milestone className="w-24 h-24 text-studio" />
                          </div>
                          
                          <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-studio/10 border border-studio/20 flex items-center justify-center text-studio font-black text-xl">
                                {ep.episode}
                              </div>
                              <div className="space-y-1">
                                <h3 className="text-2xl font-black text-white uppercase tracking-wider group-hover:text-studio transition-colors">
                                  {ep.title}
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                  <Activity className="w-3 h-3" />
                                  Narrative Milestone
                                </div>
                              </div>
                            </div>

                            <div className="pl-16 space-y-4">
                              <p className="text-zinc-400 text-sm leading-relaxed border-l-2 border-studio/10 pl-6 italic">
                                {ep.hook}
                              </p>
                              
                              <div className="flex items-center gap-4 pt-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setEpisode(parseInt(ep.episode).toString())}
                                  className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-studio hover:bg-studio/10"
                                >
                                  Focus Episode <ChevronRight className="w-3 h-3 ml-2" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-24 pt-12 border-t border-studio/10 text-center">
                    <p className="text-[10px] text-studio/50 uppercase tracking-[0.5em] font-bold">
                      End of Master Sequence
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-zinc-600">
                  <Layers className="w-16 h-16 mb-6 opacity-10" />
                  <p className="mb-8 font-sans font-bold uppercase tracking-widest text-[10px]">Plan your series arc to see it here.</p>
                  <Button 
                    className="bg-studio hover:bg-studio/80 text-white border-none shadow-studio font-black tracking-[0.2em] uppercase text-xs h-12 px-8 rounded-full transition-all hover:scale-105 active:scale-95"
                    onClick={handleGenerate}
                    disabled={isGeneratingSeries || !prompt.trim()}
                  >
                    {isGeneratingSeries ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-3" />
                    )}
                    Build Series Plan
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
