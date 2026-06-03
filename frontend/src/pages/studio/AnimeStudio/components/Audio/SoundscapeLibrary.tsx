import React, { useState } from 'react';
import { Music, Play, Disc, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

const MOCK_TRACKS = [
  { name: 'Neon Horizon', genre: 'Synthwave', bpm: 120, mood: 'Action' },
  { name: 'Midnight Duel', genre: 'Orchestral', bpm: 140, mood: 'Tense' },
  { name: 'Cherry Blossom', genre: 'Lo-Fi', bpm: 80, mood: 'Slice of Life' },
  { name: 'Digital Soul', genre: 'Cyberpunk', bpm: 128, mood: 'Dynamic' },
];

const SOUND_EFFECTS = [
  { name: 'Cinematic Impact', description: 'Deep rumble with a glassy tail.' },
  { name: 'Laser Zap', description: 'Sharp synth burst with a rapid pitch sweep.' },
  { name: 'Mystic Sparkle', description: 'Bright shimmer with soft reverb.' },
];

const playSoundEffect = (effectName: string) => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);

  const osc = ctx.createOscillator();
  const noise = ctx.createBufferSource();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - i / data.length);
  }
  noise.buffer = buffer;
  noise.connect(gain);

  osc.type = effectName === 'Laser Zap' ? 'square' : 'sawtooth';
  osc.frequency.setValueAtTime(effectName === 'Laser Zap' ? 900 : 120, now);
  osc.frequency.exponentialRampToValueAtTime(effectName === 'Laser Zap' ? 160 : 35, now + 0.28);
  osc.connect(gain);

  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  noise.start(now);
  osc.start(now);
  noise.stop(now + 0.3);
  osc.stop(now + 0.32);
};

export const SoundscapeLibrary: React.FC = () => {
  const [activeEffect, setActiveEffect] = useState<string | null>(null);

  const handlePlayEffect = (effectName: string) => {
    setActiveEffect(effectName);
    playSoundEffect(effectName);
    window.setTimeout(() => setActiveEffect(null), 400);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
          <Music className="w-4 h-4 text-studio" />
          AI Soundscape Curation
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MOCK_TRACKS.map((track) => (
          <Card key={track.name} className="bg-[#050505] border-zinc-800 p-3 hover:border-studio/30 transition-all group cursor-pointer relative overflow-hidden shadow-sm hover:shadow-studio/5">
            <div className="flex items-center gap-4 relative z-10">
               <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:text-studio transition-colors">
                  <Play className="w-4 h-4 fill-current" />
               </div>
               <div className="flex-1">
                  <h4 className="text-xs font-black uppercase text-white tracking-widest leading-none">{track.name}</h4>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-tighter mt-1">
                    {track.genre} • {track.bpm} BPM • {track.mood}
                  </p>
               </div>
               <div className="flex flex-col items-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                  <Activity className="w-3 h-3 text-zinc-500" />
                  <span className="text-xs text-zinc-600 font-mono">03:42</span>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-12 h-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <Disc className="w-full h-full text-white animate-spin-slow" />
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-2 border-t border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
            <Music className="w-4 h-4 text-studio" /> Sound Effects
          </h4>
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Demo playback</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SOUND_EFFECTS.map((effect) => (
            <Card key={effect.name} className="bg-[#050505] border-zinc-800 p-4 hover:border-studio/30 transition-all relative overflow-hidden shadow-sm hover:shadow-studio/5">
              <div className="flex flex-col gap-3">
                <div>
                  <h4 className="text-xs font-black uppercase text-white tracking-widest leading-none">{effect.name}</h4>
                  <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">{effect.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlayEffect(effect.name)}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white transition hover:border-studio/30 hover:bg-studio/10"
                >
                  {activeEffect === effect.name ? 'Playing...' : 'Play Effect'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};



