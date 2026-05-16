import React from 'react';
import { motion } from 'framer-motion';
import { 
  Milestone, 
  Activity, 
  PlayCircle, 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  Eye, 
  Sparkles,
  Layers,
  ChevronRight,
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: idx * 0.05 }}
      className="group relative h-full"
    >
      {/* Main Command Slate */}
      <div className="relative h-full flex flex-col overflow-hidden rounded-[2.5rem] bg-[#050505]/60 backdrop-blur-2xl border border-white/5 group-hover:border-studio/40 transition-all duration-700 shadow-2xl hover:shadow-studio/20">
        
        {/* Neural Sync Bar (Side Accent) */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-studio/40 via-studio/10 to-transparent group-hover:w-1.5 transition-all duration-500 overflow-hidden">
           <motion.div 
             animate={{ top: ["-100%", "100%"] }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             className="absolute w-full h-32 bg-gradient-to-b from-transparent via-studio to-transparent shadow-[0_0_10px_#06b6d4]"
           />
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
                <div className="flex flex-col items-center gap-1">
                   <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-2xl font-black text-studio shadow-inner group-hover:border-studio/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all">
                     {ep.episode}
                   </div>
                   <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">ID-N7</span>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-studio/10 border border-studio/20 rounded-md">
                        <Activity className="w-2.5 h-2.5 text-studio" />
                        <span className="text-xs font-black text-studio uppercase tracking-widest">Node Linked</span>
                      </div>
                      <span className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {ep.runtime || '24:00'}
                      </span>
                   </div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-studio transition-colors duration-500 leading-none">
                     {ep.title}
                   </h3>
                </div>
             </div>

             {/* Diagnostic Pips HUD */}
             <div className="flex flex-col gap-2">
                {[
                  { label: 'AUDIO', val: ep.asset_matrix?.sound, color: 'text-emerald-400', bg: 'bg-emerald-400' },
                  { label: 'VISUAL', val: ep.asset_matrix?.image, color: 'text-purple-400', bg: 'bg-purple-400' },
                  { label: 'MOTION', val: ep.asset_matrix?.video, color: 'text-blue-400', bg: 'bg-blue-400' }
                ].map((pip, i) => (
                  <div key={i} className="flex items-center justify-end gap-3 group/pip">
                     <span className={cn("text-xs font-black uppercase tracking-widest transition-colors", pip.val ? pip.color : "text-zinc-700")}>{pip.label}</span>
                     <div className={cn(
                       "w-1.5 h-1.5 rounded-full transition-all duration-500",
                       pip.val ? `${pip.bg} shadow-[0_0_8px_rgba(255,255,255,0.3)]` : "bg-zinc-800"
                     )} />
                  </div>
                ))}
             </div>
          </div>

          {/* Narrative Briefing (Hook) */}
          <div className="relative group/hook">
             <div className="absolute inset-0 bg-white/[0.01] rounded-2xl border border-white/5 group-hover/hook:border-studio/10 transition-all" />
             <div className="relative p-6">
                <p className="text-lg text-zinc-300 font-medium italic leading-relaxed tracking-tight group-hover:text-zinc-100 transition-colors">
                  "{ep.hook}"
                </p>
             </div>
          </div>

          {/* Production Matrix Badges */}
          <div className="grid grid-cols-2 gap-3">
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-studio/20 transition-all group/badge">
                <div className="flex items-center gap-3 mb-1">
                   <MapPin className="w-3.5 h-3.5 text-studio/60 group-hover/badge:text-studio transition-colors" />
                   <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Primary Context</span>
                </div>
                <p className="text-xs font-black text-zinc-400 group-hover:text-zinc-200 uppercase truncate">{ep.setting || 'Awaiting Sync'}</p>
             </div>
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-purple-500/20 transition-all group/badge">
                <div className="flex items-center gap-3 mb-1">
                   <Users className="w-3.5 h-3.5 text-purple-400/60 group-hover/badge:text-purple-400 transition-colors" />
                   <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Target Cast</span>
                </div>
                <p className="text-xs font-black text-zinc-400 group-hover:text-zinc-200 uppercase truncate">{ep.focus_characters?.[0] || 'Unassigned'}</p>
             </div>
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-studio/20 transition-all group/badge">
                <div className="flex items-center gap-3 mb-1">
                   <Sparkles className="w-3.5 h-3.5 text-studio/60 group-hover/badge:text-studio transition-colors" />
                   <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Thematic Pillar</span>
                </div>
                <p className="text-xs font-black text-zinc-400 group-hover:text-zinc-200 uppercase truncate">{ep.theme_mapping?.core_theme || 'Locked'}</p>
             </div>
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-studio/20 transition-all group/badge">
                <div className="flex items-center gap-3 mb-1">
                   <Database className="w-3.5 h-3.5 text-studio/60 group-hover/badge:text-studio transition-colors" />
                   <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Scene Units</span>
                </div>
                <p className="text-xs font-black text-zinc-400 group-hover:text-zinc-200 uppercase">{sceneCount} Production Units</p>
             </div>
          </div>
        </div>

        {/* Action Dock */}
        <div className="p-4 bg-black/40 border-t border-white/5 flex gap-3 relative z-10">
            <Button
              onClick={() => onViewEpisode?.(ep.episode)}
              className="flex-1 h-12 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white rounded-xl transition-all group/btn"
            >
              <Eye className="w-4 h-4 mr-2 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
              View Briefing
            </Button>
            <Button
              onClick={() => onFocusEpisode(ep.episode)}
              className="flex-1 h-12 bg-studio text-black hover:bg-studio/80 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-studio/10 hover:shadow-studio/30 group/btn"
            >
              Focus Episode <PlayCircle className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-all" />
            </Button>
        </div>

        {/* Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20" />
      </div>
    </motion.div>
  );
});
