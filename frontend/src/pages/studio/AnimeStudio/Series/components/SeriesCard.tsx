import React from 'react';
import { 
  Milestone, 
  Activity, 
  PlayCircle, 
  MapPin, 
  Clock, 
  Users, 
  Eye, 
  Sparkles,
  Database,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SeriesAssetMatrix {
  sound: string;
  image: string;
  video: string;
  scene_count: number | string;
  estimated_minutes?: number;
}

export interface SeriesEpisode {
  detailed_episode_spec: any;
  episode: string;
  session?: number | string;
  session_name?: string;
  title: string;
  hook: string;
  setting?: string;
  runtime?: string;
  focus_characters?: string[];
  emotional_arc?: string;
  theme_mapping?: {
    core_theme: string;
    subtext_goals: string;
  };
  engagement_matrix?: {
    pacing_intensity: number;
    tension_peak: string;
  };
  production_palette?: {
    dominant_colors: string[];
    lighting_setup: string;
    audio_leitmotif: string;
  };
  asset_matrix?: SeriesAssetMatrix;
}

interface SeriesCardProps {
  ep: SeriesEpisode;
  idx: number;
  isEditing: boolean;
  onUpdateEpisode: (index: number, updates: Partial<SeriesEpisode>) => void;
  onUpdateAssetMatrix: (index: number, updates: Partial<SeriesAssetMatrix>) => void;
  onFocusEpisode: (episodeNum: string) => void;
  onViewEpisode?: (episodeNum: string, section?: string) => void;
}

/**
 * SeriesCard - The Mission Briefing
 * A high-fidelity production card that balances cinematic narrative with technical telemetry.
 */
export const SeriesCard = React.memo<SeriesCardProps>(({
  ep,
  idx,
  isEditing,
  onUpdateEpisode,
  onUpdateAssetMatrix,
  onFocusEpisode,
  onViewEpisode
}) => {
  const sceneCount = ep.asset_matrix?.scene_count || 0;
  const firstSceneName = ep.detailed_episode_spec?.acts?.[0]?.scenes?.[0]?.scene_name;

  return (
    <div className="group relative h-full">

      {/* Main Command Slate */}
      <div className="relative h-full flex flex-col overflow-hidden rounded-[2.5rem] bg-[#050505]/60 backdrop-blur-2xl border border-white/5 group-hover:border-studio/40 transition-all duration-700 shadow-2xl hover:shadow-studio/20">
        
        {/* Neural Sync Bar (Side Accent) */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-studio/40 via-studio/10 to-transparent group-hover:w-1.5 transition-all duration-500 overflow-hidden">
           <div className="absolute w-full h-32 bg-gradient-to-b from-transparent via-studio to-transparent shadow-[0_0_10px_#06b6d4]" />
        </div>

        {/* Diagnostic Background Effects */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-studio/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-1000 pointer-events-none transform group-hover:scale-110">
           <Cpu className="w-32 h-32 text-studio" />
        </div>

        <div className="relative z-10 p-8 flex-1 flex flex-col gap-8">
          
          {/* Briefing Header */}
          <div className="flex items-start justify-between">
             <div className="flex gap-6">
                <div className="flex flex-col items-center gap-2">
                   <div className="w-16 h-16 rounded-full bg-black border-2 border-studio/30 flex items-center justify-center text-2xl font-black text-studio shadow-[0_0_20px_rgba(6,182,212,0.15)] group-hover:border-studio transition-all duration-500">
                     {ep.episode}
                   </div>
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">ID-N7</span>
                </div>
                <div className="space-y-3">
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-studio/10 border border-studio/30 rounded-lg">
                            <Activity className="w-3 h-3 text-studio" />
                        <span className="text-[10px] font-black text-studio uppercase tracking-widest">Node Linked</span>
                      </div>
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> {ep.runtime || '24:00'}
                      </span>
                   </div>
                   <h3 className="text-4xl font-black text-studio uppercase tracking-[-0.05em] leading-none drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                     {ep.title}
                   </h3>
                   <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
                        Session {ep.session || '1'}: {ep.session_name || 'Unassigned'}
                      </span>
                     <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-700">|</span>
                     <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 truncate max-w-[16rem]">
                       Scene: {firstSceneName || 'Unassigned'}
                     </span>
                   </div>
                </div>
             </div>

             {/* Diagnostic Pips HUD */}
             <div className="flex flex-col gap-2.5">
                {[
                  { label: 'AUDIO', val: ep.asset_matrix?.sound, color: 'text-emerald-400', glow: 'shadow-[0_0_12px_#34d399]', dot: 'bg-emerald-400' },
                  { label: 'VISUAL', val: ep.asset_matrix?.image, color: 'text-purple-400', glow: 'shadow-[0_0_12px_#c084fc]', dot: 'bg-purple-400' },
                  { label: 'MOTION', val: ep.asset_matrix?.video, color: 'text-blue-400', glow: 'shadow-[0_0_12px_#60a5fa]', dot: 'bg-blue-400' }
                ].map((pip, i) => (
                  <div key={i} className="flex items-center justify-end gap-3 group/pip">
                     <span className={cn(
                       "text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300", 
                       pip.val ? "text-zinc-200" : "text-zinc-700"
                     )}>
                       {pip.label}
                     </span>
                     <div className={cn(
                       "w-1.5 h-1.5 rounded-full transition-all duration-500",
                       pip.val ? `${pip.dot} ${pip.glow}` : "bg-zinc-800"
                     )} />
                  </div>
                ))}
             </div>
          </div>

          {/* Narrative Briefing (Hook) */}
          <div className="relative group/hook">
             <div className="absolute inset-0 bg-black/60 rounded-3xl border border-white/10 group-hover/hook:border-studio/20 transition-all duration-500 shadow-inner" />
             <div className="relative p-8">
                <p className="text-xl text-zinc-200 font-medium italic leading-relaxed tracking-tight group-hover:text-white transition-colors">
                  "{ep.hook}"
                </p>
             </div>
          </div>

          {/* Production Matrix Badges */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-5 bg-black/40 border border-white/5 rounded-3xl hover:border-studio/30 transition-all duration-500 group/badge shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                   <MapPin className="w-4 h-4 text-studio/40 group-hover/badge:text-studio transition-colors" />
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Primary Context</span>
                </div>
                <p className="text-xs font-black text-zinc-100 group-hover:text-white uppercase truncate tracking-wide">
                  {ep.setting || 'Awaiting Sync'}
                </p>
             </div>
             <div className="p-5 bg-black/40 border border-white/5 rounded-3xl hover:border-purple-500/30 transition-all duration-500 group/badge shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                   <Users className="w-4 h-4 text-purple-400/40 group-hover/badge:text-purple-400 transition-colors" />
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Target Cast</span>
                </div>
                <p className="text-xs font-black text-zinc-100 group-hover:text-white uppercase truncate tracking-wide">
                  {ep.focus_characters?.[0] || 'Unassigned'}
                </p>
             </div>
             <div className="p-5 bg-black/40 border border-white/5 rounded-3xl hover:border-studio/30 transition-all duration-500 group/badge shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                   <Sparkles className="w-4 h-4 text-studio/40 group-hover/badge:text-studio transition-colors" />
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Thematic Pillar</span>
                </div>
                <p className="text-xs font-black text-zinc-100 group-hover:text-white uppercase truncate tracking-wide">
                  {ep.theme_mapping?.core_theme || 'Locked'}
                </p>
             </div>
              <div 
                onClick={() => onViewEpisode?.(ep.episode, 'scenes')}
                className="p-5 bg-black/40 border border-white/5 rounded-3xl hover:border-studio/30 transition-all duration-500 group/badge shadow-sm cursor-pointer hover:bg-studio/[0.02]"
              >
                 <div className="flex items-center gap-3 mb-2">
                    <Database className="w-4 h-4 text-studio/40 group-hover/badge:text-studio transition-colors" />
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Scene Units</span>
                 </div>
                 <p className="text-xs font-black text-zinc-100 group-hover:text-white uppercase tracking-wide">
                   {sceneCount} Production Units
                 </p>
              </div>
          </div>
        </div>

        {/* Action Dock */}
        <div className="p-6 bg-black/40 border-t border-white/5 flex gap-4 relative z-10 backdrop-blur-md">
            <Button
              variant="outline"
              onClick={() => onViewEpisode?.(ep.episode)}
              className="flex-1 h-14 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-xs font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white rounded-2xl transition-all group/btn"
            >
              <Eye className="w-4 h-4 mr-3 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
              View Mission
            </Button>
            <Button
              onClick={() => onFocusEpisode(ep.episode)}
              className="flex-1 h-14 bg-studio text-black hover:bg-studio/90 text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-studio/20 hover:shadow-studio/40 group/btn"
            >
              Focus Episode <PlayCircle className="w-5 h-5 ml-3 group-hover/btn:scale-110 transition-all" />
            </Button>
        </div>

        {/* Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20" />

      </div>
    </div>
  );
});
