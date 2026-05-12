import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ShieldCheck, Activity, Brain, Search, Shield, Sparkles, RefreshCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useGeneratorState } from '@/hooks/useGenerator';
import { useNavigate } from 'react-router-dom';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CastTabActionsContext } from './CastLayout';

export function DNAPage() {
  const navigate = useNavigate();
  const { castList, contentType, castDNA } = useGeneratorState();
  const { handleGenerateDNA, isAnalyzingCast } = React.useContext(CastTabActionsContext);
  const hasCast = castList && castList.length > 0;

  if (!hasCast) {
    return (
      <StudioEmptyState
        icon={Brain}
        title="Trait Analysis Unavailable"
        description="Character traits cannot be analyzed until your cast manifest is generated."
        actionLabel="Open Cast Registry"
        onAction={() => navigate(`/${contentType.toLowerCase()}/cast?tab=registry`)}
        features={[
          { icon: Sparkles, title: 'Identity Creation', description: 'Generate core identities and personality traits' },
          { icon: ShieldCheck, title: 'Logic Consistency', description: 'Enable stability and consistency metrics' },
          { icon: Search, title: 'Deep Analysis', description: 'Unlock detailed profiling across the full cast' }
        ]}
        accentColor="cyan"
      />
    );
  }

  const dna = castDNA || {
    cognitiveLoad: Math.min(100, castList.length * 15),
    emotionalFlux: Math.min(100, 45 + castList.length * 5),
    narrativeRole: "Pending",
    conflictBalance: "Neutral",
    archetypes: [
      { trait: 'Protagonists', value: 80 },
      { trait: 'Antagonists', value: 65 },
      { trait: 'Support', value: 50 },
      { trait: 'Foil', value: 35 },
      { trait: 'Rival', value: 20 }
    ],
    traitAnalysis: "Awaiting character creation and deep profile analysis...",
    weightDistribution: [20, 20, 20, 20, 20, 20, 20, 20],
    complexity: "---",
    resonance: "---",
    variance: "---"
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest italic">Character Trait Analysis</h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">Deep psychological and personality profiling</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Brain, label: "Mental Depth", value: `${dna.cognitiveLoad}%`, color: "text-studio" },
          { icon: Activity, label: "Emotional Intensity", value: `${dna.emotionalFlux}%`, color: "text-fuchsia-400" },
          { icon: ShieldCheck, label: "Narrative Importance", value: dna.narrativeRole, color: "text-emerald-400" },
          { icon: BarChart3, label: "Conflict Impact", value: dna.conflictBalance, color: "text-amber-400" }
        ].map((stat, idx) => (
          <Card key={idx} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col items-center gap-4 hover:border-studio/30 transition-all backdrop-blur-md">
            <stat.icon className={`w-6 h-6 ${stat.color} opacity-60`} />
            <div className="text-center">
              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="bg-[#030303] border-studio/20 p-10 rounded-[3rem] space-y-8">
          <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-studio" />
            Archetype Resonance Matrix
          </h3>
          <div className="space-y-6">
            {dna.archetypes.map((archetype: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <span>{archetype.trait}</span>
                  <span className="text-studio">{archetype.value}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${archetype.value}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-studio shadow-[0_0_8px_#06b6d4]" 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-[#030303] border-studio/20 p-10 rounded-[3rem] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-studio/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8">Narrative Synapse Scan</h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-zinc-500 text-sm font-medium leading-loose italic">
              {dna.synapseScan}
            </p>
          </div>
          <div className="mt-12 p-6 bg-studio/5 border border-studio/10 rounded-2xl">
            <p className="text-[10px] font-black text-studio uppercase tracking-widest text-center">
              {castDNA ? "Analysis Path Active" : "Input Required"}
            </p>
          </div>
        </Card>

        {/* Narrative Weight Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:col-span-2">
           <div className="p-10 bg-black/40 border border-white/5 rounded-[3rem] space-y-8 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-widest italic">Character Weight Distribution</h3>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">
                    {castDNA ? "AI SEQUENCING ACTIVE" : "AWAITING SEQUENCE DATA"}
                  </p>
                </div>
                <Search className="w-5 h-5 text-zinc-600" />
              </div>
              <div className="h-48 flex items-end gap-3 px-4">
                 {dna.weightDistribution.map((h: number, i: number) => (
                   <div key={i} className="flex-1 bg-gradient-to-t from-blue-500/40 to-blue-500/10 rounded-t-xl transition-all" style={{ height: `${h}%` }} />
                 ))}
              </div>
           </div>
           
           <div className="space-y-4">
              {[
                { label: 'Psychological Complexity', score: dna.complexity, desc: castDNA ? 'Live AI Bio Analysis' : 'Pending Manifestation', icon: Brain },
                { label: 'Thematic Resonance', score: dna.resonance, desc: castDNA ? 'Lore Cross-Reference' : 'Pending Manifestation', icon: Shield },
                { label: 'Dialogue Variance', score: dna.variance, desc: castDNA ? 'Voice Signature Verified' : 'Pending Manifestation', icon: Sparkles }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.03] transition-all backdrop-blur-sm">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.label}</span>
                      <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-blue-400 uppercase tracking-widest italic">{item.score}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}



