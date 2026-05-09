import React from 'react';
import { motion } from 'framer-motion';
import { Milestone, Activity, Volume2, Camera, Video, Layout as LayoutGrid, PlayCircle, MapPin, Clock, Users, Heart, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SeriesAssetMatrix {
  sound: string;
  image: string;
  video: string;
  scene_count: number | string;
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
  asset_matrix?: SeriesAssetMatrix;
}

interface SeriesCardProps {
  ep: SeriesEpisode;
  idx: number;
  isEditing: boolean;
  onUpdateEpisode: (index: number, updates: Partial<SeriesEpisode>) => void;
  onUpdateAssetMatrix: (index: number, updates: Partial<SeriesAssetMatrix>) => void;
  onFocusEpisode: (episodeNum: string) => void;
  onViewEpisode?: (episodeNum: string) => void;
}

export const SeriesCard = React.memo<SeriesCardProps>(({
  ep,
  idx,
  isEditing,
  onUpdateEpisode,
  onUpdateAssetMatrix,
  onFocusEpisode,
  onViewEpisode
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="relative z-10 h-full"
    >
      <Card className="bg-[#050505]/40 backdrop-blur-md border-studio/10 p-8 hover:border-studio/40 transition-all duration-700 group relative overflow-hidden rounded-[3rem] shadow-[0_0_0_rgba(6,182,212,0)] hover:shadow-[0_40px_80px_-20px_rgba(6,182,212,0.3)] border-t border-l border-white/10 group/card_inner h-full flex flex-col">

        {/* Cinematic Scanning Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] pointer-events-none" />

        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-studio/5 via-transparent to-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-studio/10 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:translate-x-12 group-hover:translate-y-12" />

        {/* Floating Watermark Icon - Holographic Mode */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.15] transition-all duration-1000 pointer-events-none transform group-hover:scale-125 group-hover:rotate-12 blur-[1px] group-hover:blur-0">
          <div className="flex flex-col items-end">
            <Milestone className="w-40 h-40 text-studio" />
            <div className="mt-[-20px] text-[12px] font-black uppercase tracking-[1em] text-studio/60 drop-shadow-studio">SYSTEM // 0X-N7</div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 flex-1">

          {/* Episode Number Badge (Left Sidebar) */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-black border-2 border-studio/20 group-hover:border-studio/50 flex flex-col items-center justify-center text-studio shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-500 transform group-hover:-translate-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-[-4px]">EP</span>
              <span className="font-black text-2xl leading-none">{ep.episode}</span>
            </div>

            {/* Visual connector dot */}
            <div className="hidden md:flex flex-1 w-px bg-gradient-to-b from-studio/30 to-transparent relative items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-studio/50 absolute top-4 group-hover:bg-studio transition-colors" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">

            {/* Header / Title */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] group-hover:text-studio/70 transition-colors">
                <span className="flex items-center gap-2"><Activity className="w-3 h-3 text-studio" /> Narrative Milestone</span>
                {ep.runtime && <span className="flex items-center gap-1.5 opacity-60"><Clock className="w-3 h-3" /> {ep.runtime}</span>}
              </div>

              {isEditing ? (
                <input
                  className="w-full bg-black/80 border border-studio/30 rounded-2xl px-6 py-4 text-3xl font-black text-white uppercase focus:border-studio focus:ring-2 focus:ring-studio/20 focus:outline-none transition-all shadow-studio"
                  value={ep.title}
                  onChange={(e) => onUpdateEpisode(idx, { title: e.target.value })}
                  placeholder="Episode Title"
                />
              ) : (
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter group-hover:text-studio group-hover:tracking-[0.02em] transition-all duration-700 leading-tight">
                  {ep.title}
                </h3>
              )}
            </div>

            {/* Hook / Synopsis */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-studio/40 to-transparent rounded-full" />
              <div className="pl-6">
                {isEditing ? (
                  <textarea
                    className="w-full bg-black/60 border border-studio/20 rounded-xl p-5 text-sm text-zinc-300 leading-relaxed font-medium focus:border-studio/50 focus:outline-none transition-all min-h-[120px] resize-none"
                    value={ep.hook}
                    onChange={(e) => onUpdateEpisode(idx, { hook: e.target.value })}
                    placeholder="Describe the main hook or synopsis..."
                  />
                ) : (
                  <p className="text-zinc-400 text-[15px] leading-relaxed font-medium italic group-hover:text-zinc-300 transition-colors">
                    "{ep.hook}"
                  </p>
                )}
              </div>
            </div>

            {/* Additional Production Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {ep.setting && (
                <div className="flex items-start gap-2 bg-black/20 p-3 rounded-xl border border-white/5 group-hover:border-studio/10">
                  <MapPin className="w-4 h-4 text-studio/70 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Primary Setting</p>
                    {isEditing ? (
                      <input className="w-full bg-transparent border-b border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-studio" value={ep.setting} onChange={(e) => onUpdateEpisode(idx, { setting: e.target.value })} />
                    ) : <p className="text-xs text-zinc-300 font-medium">{ep.setting}</p>}
                  </div>
                </div>
              )}

              {ep.focus_characters && ep.focus_characters.length > 0 && (
                <div className="flex items-start gap-2 bg-black/20 p-3 rounded-xl border border-white/5 group-hover:border-studio/10">
                  <Users className="w-4 h-4 text-purple-400/70 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Focus Cast</p>
                    {isEditing ? (
                      <input className="w-full bg-transparent border-b border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-studio" value={ep.focus_characters.join(', ')} onChange={(e) => onUpdateEpisode(idx, { focus_characters: e.target.value.split(',').map(s => s.trim()) })} />
                    ) : <p className="text-xs text-zinc-300 font-medium truncate">{ep.focus_characters.join(', ')}</p>}
                  </div>
                </div>
              )}

              {ep.emotional_arc && (
                <div className="flex items-start gap-2 bg-black/20 p-3 rounded-xl border border-white/5 group-hover:border-studio/10">
                  <Heart className="w-4 h-4 text-pink-400/70 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Emotional Arc</p>
                    {isEditing ? (
                      <input className="w-full bg-transparent border-b border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-studio" value={ep.emotional_arc} onChange={(e) => onUpdateEpisode(idx, { emotional_arc: e.target.value })} />
                    ) : <p className="text-xs text-zinc-300 font-medium truncate">{ep.emotional_arc}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Asset Matrix Data - Cyber Grid Mode */}
            {ep.asset_matrix && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 rounded-3xl border border-white/10 overflow-hidden bg-white/[0.02] backdrop-blur-md">

                {/* Sound */}
                <div className="p-5 border-r border-b md:border-b-0 border-white/10 hover:bg-studio/5 transition-colors group/asset">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 group-hover/asset:text-studio transition-colors">
                    <Volume2 className="w-3 h-3" /> Audio Forge
                  </p>
                  {isEditing ? (
                    <input
                      className="mt-2 w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:border-studio/50 focus:outline-none transition-all"
                      value={ep.asset_matrix.sound}
                      onChange={(e) => onUpdateAssetMatrix(idx, { sound: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1 text-[11px] text-zinc-300 font-bold truncate">{ep.asset_matrix.sound}</p>
                  )}
                </div>

                {/* Image */}
                <div className="p-5 border-b md:border-r md:border-b-0 border-white/10 hover:bg-purple-500/5 transition-colors group/asset">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 group-hover/asset:text-purple-400 transition-colors">
                    <Camera className="w-3 h-3" /> Visual Style
                  </p>
                  {isEditing ? (
                    <input
                      className="mt-2 w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:border-studio/50 focus:outline-none transition-all"
                      value={ep.asset_matrix.image}
                      onChange={(e) => onUpdateAssetMatrix(idx, { image: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1 text-[11px] text-zinc-300 font-bold truncate">{ep.asset_matrix.image}</p>
                  )}
                </div>

                {/* Video */}
                <div className="p-5 border-r border-white/10 hover:bg-blue-500/5 transition-colors group/asset">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 group-hover/asset:text-blue-400 transition-colors">
                    <Video className="w-3 h-3" /> Motion Engine
                  </p>
                  {isEditing ? (
                    <input
                      className="mt-2 w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:border-studio/50 focus:outline-none transition-all"
                      value={ep.asset_matrix.video}
                      onChange={(e) => onUpdateAssetMatrix(idx, { video: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1 text-[11px] text-zinc-300 font-bold truncate">{ep.asset_matrix.video}</p>
                  )}
                </div>

                {/* Scenes */}
                <div className="p-5 hover:bg-amber-500/5 transition-colors group/asset">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 group-hover/asset:text-amber-400 transition-colors">
                    <LayoutGrid className="w-3 h-3" /> Units
                  </p>
                  {isEditing ? (
                    <input
                      type="number"
                      className="mt-2 w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:border-studio/50 focus:outline-none transition-all"
                      value={ep.asset_matrix.scene_count}
                      onChange={(e) => onUpdateAssetMatrix(idx, { scene_count: parseInt(e.target.value) || 0 })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[11px] text-amber-500 font-black tracking-tighter">{ep.asset_matrix.scene_count} UNITS</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className={cn("w-1 h-1 rounded-full", i < (Number(ep.asset_matrix?.scene_count) / 4) ? "bg-amber-500" : "bg-zinc-800")} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Asset Status Quick Indicators */}
            {!isEditing && ep.asset_matrix && (
              <div className="flex items-center gap-6 px-2">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", ep.asset_matrix.sound ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-800")} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Audio Forge</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", ep.asset_matrix.image ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "bg-zinc-800")} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Visual DNA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", ep.asset_matrix.video ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-zinc-800")} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Motion Eng</span>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <Button
                variant="outline"
                onClick={() => onViewEpisode?.(parseInt(ep.episode).toString())}
                className="flex items-center gap-2 h-10 px-6 rounded-xl bg-transparent border-white/10 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300 group/btn"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Button>
              <Button
                variant="outline"
                onClick={() => onFocusEpisode(parseInt(ep.episode).toString())} // This will be handled by the parent to navigate
                className="h-10 px-6 rounded-xl bg-transparent border-studio/20 text-[11px] font-black uppercase tracking-widest text-studio hover:text-black hover:bg-studio hover:border-studio hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 group/btn"
              >
                Focus Episode <PlayCircle className="w-4 h-4 ml-2 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});



