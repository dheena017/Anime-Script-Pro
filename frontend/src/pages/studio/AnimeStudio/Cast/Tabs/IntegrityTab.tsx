import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Search, RefreshCcw } from 'lucide-react';
import { useGeneratorState } from '@/hooks/useGenerator';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';
import { useNavigate } from 'react-router-dom';
import { CastTabActionsContext } from '../CastLayout';

export const IntegrityTab: React.FC = () => {
  const navigate = useNavigate();
  const { castList, contentType, castIntegrity } = useGeneratorState();
  const { handleGenerateIntegrity, isAnalyzingCast } = React.useContext(CastTabActionsContext);

  const characters = castList || [];
  const missingGoals = characters.filter(c => !c.goal || c.goal.toLowerCase().includes('redacted')).length;
  const placeholders = characters.filter(c => !c.personality || c.personality.toLowerCase().includes('underspecified')).length;
  const duplicateNames = new Set(characters.map(c => c.name)).size !== characters.length;

  if (characters.length === 0) {
    return (
      <StudioEmptyState
        icon={ShieldCheck}
        title="Integrity Scan Pending"
        description="Integrity checks require at least one character profile before verification can run."
        actionLabel="Open Cast Registry"
        onAction={() => navigate(`/${contentType.toLowerCase()}/cast?tab=registry`)}
        features={[
          { icon: CheckCircle2, title: 'Validation Rules', description: 'Enable duplicate and profile consistency checks' },
          { icon: Search, title: 'Anomaly Detection', description: 'Surface missing goals and weak personas' },
          { icon: AlertTriangle, title: 'Conflict Alerts', description: 'Detect narrative data mismatches early' }
        ]}
        accentColor="emerald"
      />
    );
  }

  const baseIntegrityScore = characters.length === 0 ? 0 : Math.round(
    ((characters.length - (missingGoals + placeholders)) / characters.length) * 100
  );

  const audit = castIntegrity || {
    integrityScore: baseIntegrityScore,
    statusMessage: baseIntegrityScore === 100
      ? "All character souls are perfectly synced with the narrative logic."
      : `Detected ${missingGoals + placeholders} existential inconsistencies in character data.`,
    stats: [
      { label: 'Integrity Score', value: `${baseIntegrityScore}%`, status: baseIntegrityScore > 80 ? 'Optimal' : 'Low', color: 'text-emerald-500' },
      { label: 'Missing Goals', value: missingGoals, status: missingGoals === 0 ? 'Verified' : 'Action Req', color: missingGoals === 0 ? 'text-emerald-500' : 'text-amber-500' },
      { label: 'Duplicate Check', value: duplicateNames ? 'Conflict' : 'Stable', status: !duplicateNames ? 'Verified' : 'Error', color: !duplicateNames ? 'text-emerald-500' : 'text-rose-500' },
      { label: 'Data Sync', value: placeholders === 0 ? 'Stable' : 'Weak', status: placeholders === 0 ? 'Verified' : 'Analysis Req', color: placeholders === 0 ? 'text-emerald-500' : 'text-amber-500' }
    ]
  };

  return (
    <div className="py-20 text-center space-y-12">
      <div className="flex justify-center mb-8">
      </div>

      <div className="relative inline-block">
        <div className={`absolute -inset-8 ${audit.integrityScore > 80 ? 'bg-emerald-500/10' : 'bg-amber-500/10'} blur-3xl rounded-full animate-pulse`} />
        {audit.integrityScore > 80 ? (
          <ShieldCheck className="w-24 h-24 text-emerald-500 mx-auto relative z-10" />
        ) : (
          <AlertTriangle className="w-24 h-24 text-amber-500 mx-auto relative z-10" />
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-black text-white uppercase tracking-widest">
          {audit.integrityScore === 100 ? "Database Integrity Optimal" : "Integrity Scan Complete"}
        </h2>
        <p className="text-zinc-500 max-w-md mx-auto text-sm font-medium">
          {audit.statusMessage}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto px-6">
        {audit.stats.map((stat: any, i: number) => (
          <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-3xl text-left space-y-2 backdrop-blur-sm">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-black text-white">{stat.value}</span>
              <span className={`text-[8px] font-bold ${stat.color} uppercase tracking-widest mb-1`}>{stat.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



