import React from 'react';
import { SoundscapeLibrary } from '../../components/Audio/SoundscapeLibrary';
import { Music, Play, Loader2, Volume2 } from 'lucide-react';
import { generateAudio } from '@/services/api/audio';
import { cn } from '@/lib/utils';
import { storyboardStyles as s } from '../storyboardStyles';
import { motion } from 'framer-motion';

interface Scene {
  id: string;
  originalIndex?: number;
  section: string;
  narration?: string;
  visuals?: string;
  sound: string;
  duration: string;
  linkedPrompt?: string;
  videoPrompt?: string;
  soulFocus?: string;
  vfxCompounds?: string;
  emotionalKey?: string;
  subtext?: string;
  assets?: string;
}

interface AudioTabProps {
  scenes?: Scene[];
}

export const AudioTab: React.FC<AudioTabProps> = ({ scenes = [] }) => {
  const [generatingId, setGeneratingId] = React.useState<string | null>(null);
  const [audioUrls, setAudioUrls] = React.useState<Record<string, string>>({});
  const [playingId, setPlayingId] = React.useState<string | null>(null);
  const [selectedTld, setSelectedTld] = React.useState<string>("com");

  const voiceProfiles = [
    { id: 'com', name: 'US (Neutral)', flag: '🇺🇸' },
    { id: 'co.uk', name: 'UK (Elegant)', flag: '🇬🇧' },
    { id: 'ca', name: 'Canada (Clean)', flag: '🇨🇦' },
    { id: 'co.in', name: 'India (Clear)', flag: '🇮🇳' },
    { id: 'com.au', name: 'Australia (Bold)', flag: '🇦🇺' },
  ];

  const handlePlayAudio = async (sceneId: string, text: string) => {
    const cacheKey = `${sceneId}_${selectedTld}`;
    if (audioUrls[cacheKey]) {
      const audio = new Audio(audioUrls[cacheKey]);
      setPlayingId(sceneId);
      audio.play();
      audio.onended = () => setPlayingId(null);
      return;
    }

    setGeneratingId(sceneId);
    try {
      const result = await generateAudio({ text, tld: selectedTld });
      if (result.success && result.audioUrl) {
        setAudioUrls(prev => ({ ...prev, [cacheKey]: result.audioUrl }));
        const audio = new Audio(result.audioUrl);
        setPlayingId(sceneId);
        audio.play();
        audio.onended = () => setPlayingId(null);
      }
    } catch (error) {
      console.error("Audio synthesis failed:", error);
    } finally {
      setGeneratingId(null);
    }
  };
  return (
    <div className={s.tabContent + " animate-in fade-in duration-700"}>
      {/* Header */}
      <div className={s.tabSectionHeader}>
        <div className={cn(s.tabHeaderIconBox, "bg-blue-500/10 border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.15)]")}>
          <Music className="w-8 h-8 text-blue-400 animate-pulse" />
        </div>
        <div className="text-left">
          <h2 className={s.tabSectionTitle}>Audio Sync</h2>
          <p className={s.tabSectionSubtitle}>
            BGM cues, SFX manifests, and soundscape orchestration
          </p>
        </div>

        {/* Voice Profile Selector */}
        <div className="ml-auto flex items-center gap-3 px-4 py-2 bg-[#050505]/60 border border-white/5 rounded-xl">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Profile:</span>
          <select 
            value={selectedTld}
            onChange={(e) => setSelectedTld(e.target.value)}
            className="bg-transparent text-xs font-bold text-blue-400 outline-none cursor-pointer"
          >
            {voiceProfiles.map(p => (
              <option key={p.id} value={p.id} className="bg-zinc-900 text-white">
                {p.flag} {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Per-scene sound cues */}
      {scenes.length > 0 && (
        <div className="space-y-6">
          <h3 className={s.tabGridTitle}>
            <Music className="w-4 h-4 text-blue-400" /> Scene Sound Manifest
          </h3>
          <div className="space-y-4 max-w-4xl mx-auto">
            {scenes.map((scene, i) => (
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.1 }}
                className="flex items-center gap-5 p-5 bg-gradient-to-r from-[#0c0c0c] to-[#040404] border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden text-left"
              >
                <span className="text-xs font-black text-zinc-600 font-mono w-6 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-black text-white uppercase tracking-widest">{scene.section}</p>
                  <p className="text-[11px] text-zinc-500 mt-1 font-bold uppercase tracking-tight leading-relaxed">{scene.sound || 'No sound cue specified'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Waveform visualizer bars */}
                  {[2, 4, 3, 5, 2, 4, 3].map((h, j) => (
                    <div
                      key={j}
                      className={cn(
                        "w-0.5 rounded-full transition-all duration-300",
                        playingId === scene.id ? "bg-blue-400 animate-pulse" : "bg-blue-500/40 group-hover:bg-blue-400/60"
                      )}
                      style={{ 
                        height: playingId === scene.id ? `${Math.random() * 20 + 5}px` : `${h * 3}px`, 
                        animationDelay: `${j * 100}ms` 
                      }}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => handlePlayAudio(scene.id, (scene as any).narration || scene.section)}
                  disabled={generatingId === scene.id}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                    generatingId === scene.id 
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      : "bg-white/5 border-white/5 hover:border-blue-500/40 text-zinc-500 hover:text-blue-400"
                  )}
                >
                  {generatingId === scene.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : playingId === scene.id ? (
                    <Volume2 className="w-4 h-4 text-blue-400 animate-pulse" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>

                <span className="text-xs font-black text-zinc-600 flex-shrink-0 w-8 text-right font-mono">{scene.duration || '5s'}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Full Soundscape Library */}
      <div className="pt-8 border-t border-white/5">
        <SoundscapeLibrary />
      </div>
    </div>
  );
};




