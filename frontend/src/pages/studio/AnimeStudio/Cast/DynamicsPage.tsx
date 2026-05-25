import React from 'react';
import { GitBranch, ArrowRightLeft, Users, Zap, Workflow, RefreshCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useGeneratorState } from '@/hooks/useGenerator';
import { useStudioBasePath } from '@/hooks/useStudioBasePath';
import { useNavigate } from 'react-router-dom';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CastTabActionsContext } from './CastLayout';

export function DynamicsPage() {
  const navigate = useNavigate();
  const basePath = useStudioBasePath();
  const { characterRelationships, castList, castDynamics } = useGeneratorState();
  const { handleGenerateDynamics, isAnalyzingCast } = React.useContext(CastTabActionsContext);
  const hasCast = Array.isArray(castList) && castList.length > 0;

  if (!hasCast) {
    return (
      <StudioEmptyState
        icon={Workflow}
        title="Dynamics Offline"
        description="Relationship dynamics require a generated cast before conflict maps can be synthesized."
        actionLabel="Open Cast Registry"
        onAction={() => navigate(`${basePath}/cast?tab=registry`)}
        features={[
          { icon: Users, title: 'Character Network', description: 'Create cast nodes for relational analysis' },
          { icon: ArrowRightLeft, title: 'Thread Mapping', description: 'Enable ally and rival trajectories' },
          { icon: Zap, title: 'Tension Signals', description: 'Activate conflict simulation layers' }
        ]}
        accentColor="rose"
      />
    );
  }
  
  const connections = React.useMemo(() => {
    if (typeof characterRelationships === 'string') {
      try {
        return JSON.parse(characterRelationships);
      } catch (e) {
        return [];
      }
    }
    return characterRelationships || [];
  }, [characterRelationships]);

  const hasConnections = connections.length > 0;

  const dynamics = castDynamics || {
    growthArcs: [
      { label: 'Protagonist Path', progress: hasConnections ? 75 : 0, color: 'bg-fuchsia-500' },
      { label: 'Antagonist Counter', progress: hasConnections ? 45 : 0, color: 'bg-rose-500' },
      { label: 'Sub-plot Variance', progress: hasConnections ? 90 : 0, color: 'bg-studio' }
    ],
    conflictMapStatus: hasConnections 
      ? "[SIMULATION_ACTIVE]: Mapping character collision points..." 
      : "[STANDBY]: Awaiting relational metadata...",
    socialThreads: connections.length,
    tensionDynamics: connections.slice(0, 4)
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest italic">Character Dynamics</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">Growth simulation and conflict mapping</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="bg-[#030303] border-fuchsia-500/20 p-10 rounded-[3rem] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent" />
          <h3 className="text-xl font-black text-white uppercase tracking-widest mb-10 flex items-center gap-3">
            <Zap className="w-5 h-5 text-fuchsia-500" />
            Growth Arc Simulation
          </h3>
          <div className="space-y-12">
            {dynamics.growthArcs.map((arc: any, i: number) => (
              <div key={i} className="space-y-4">
                <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                  <span>{arc.label}</span>
                  <span className="text-white">{arc.progress}% Sync</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${arc.color} transition-all duration-1000`} style={{ width: `${arc.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-[#030303] border-fuchsia-500/20 p-10 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-[2.5rem] bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center">
            <GitBranch className="w-10 h-10 text-fuchsia-500" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Dynamic Conflict Map</h3>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mt-2 max-w-xs mx-auto">
              {dynamics.conflictMapStatus}
            </p>
          </div>
          {hasConnections ? (
            <div className="flex -space-x-4">
              {connections.slice(0, 5).map((_: any, i: number) => (
                <div key={i} className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <Users className="w-6 h-6" />
                </div>
              ))}
              {connections.length > 5 && (
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-500 text-xs font-black">
                  +{connections.length - 5}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-24 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-zinc-800 font-black uppercase text-xs tracking-widest">
              No Social Threads Detected
            </div>
          )}
        </Card>

        {/* Narrative Tension Dynamics - Consolidated from DynamicsTab */}
        <div className="space-y-8 lg:col-span-2">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Narrative Tension Dynamics</h3>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">
                {hasConnections ? "Visualizing specific pressure points and emotional collisions" : "Awaiting relationship synthesis"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(dynamics.tensionDynamics && dynamics.tensionDynamics.length > 0 ? dynamics.tensionDynamics : [null, null, null, null]).map((dynamic: any, i: number) => (
              <div key={i} className="relative group/dyn">
                <div className="absolute inset-0 bg-rose-500/5 blur-xl rounded-3xl opacity-0 group-hover/dyn:opacity-100 transition-opacity" />
                <div className="relative p-8 bg-black/40 border border-white/5 rounded-[2rem] space-y-6 text-center backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 mx-auto flex items-center justify-center">
                    <Workflow className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">
                      {dynamic ? dynamic.type : "---"}
                    </h3>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      {dynamic ? `${dynamic.source} vs ${dynamic.target}` : "Awaiting Thread"}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-xs font-black text-rose-400 uppercase tracking-widest italic">
                      {dynamic ? `${dynamic.tension}/10` : "0"} Tension
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
