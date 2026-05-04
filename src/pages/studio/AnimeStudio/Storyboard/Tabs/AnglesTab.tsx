import React from 'react';
import { Camera, Eye, Maximize2, RotateCcw, Triangle, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

const shotTypes = [
  { label: 'Extreme Wide', code: 'EWS', description: 'Establishes environment. Character is a tiny element in the vast world.', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20', icon: '🌐' },
  { label: 'Wide Shot', code: 'WS', description: 'Full character in frame with surrounding environment context.', color: 'from-studio/20 to-studio/5', border: 'border-studio/20', icon: '🏙️' },
  { label: 'Medium Shot', code: 'MS', description: 'Waist-up framing. Standard dialogue and action scenes.', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/20', icon: '🧍' },
  { label: 'Close-Up', code: 'CU', description: 'Face and shoulders. Emotional intensity and reaction moments.', color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/20', icon: '😤' },
  { label: 'Extreme Close-Up', code: 'ECU', description: 'Eyes, hands, or key object. Maximum dramatic tension.', color: 'from-rose-500/20 to-rose-500/5', border: 'border-rose-500/20', icon: '👁️' },
  { label: 'Over-the-Shoulder', code: 'OTS', description: 'Conversation framing. Keeps subject in spatial relation to speaker.', color: 'from-fuchsia-500/20 to-fuchsia-500/5', border: 'border-fuchsia-500/20', icon: '↩️' },
];

const angles = [
  { label: 'Eye Level', icon: Eye, desc: 'Neutral, naturalistic. Standard narrative perspective.' },
  { label: 'Low Angle', icon: Triangle, desc: 'Power, dominance. Makes subject appear imposing.' },
  { label: 'High Angle', icon: Maximize2, desc: 'Vulnerability, smallness. Used in defeat or reflection.' },
  { label: 'Dutch Angle', icon: RotateCcw, desc: 'Unease, psychological tension. Tilted horizon line.' },
  { label: 'POV Shot', icon: Move, desc: "First-person perspective. Audience inhabits character's view." },
];

export const AnglesTab: React.FC = () => {
  return (
    <div className="storyboard-tab-content">
      {/* Header */}
      <div className="tab-section-header">
        <div className="tab-header-icon-box bg-studio/10 border-studio/20 shadow-studio/10">
          <Camera className="w-8 h-8 text-studio" />
        </div>
        <div>
          <h2 className="tab-section-title">Shot Angles</h2>
          <p className="tab-section-subtitle">
            Camera blocking, lens selection, and cinematic framing guides
          </p>
        </div>
      </div>

      {/* Shot Types */}
      <div className="space-y-6">
        <h3 className="tab-grid-title">
          <Camera className="w-3 h-3" /> Shot Type Reference Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shotTypes.map((shot) => (
            <div
              key={shot.code}
              className={cn(
                "shot-type-card",
                shot.color, shot.border
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{shot.icon}</span>
                <span className="shot-code-badge">
                  {shot.code}
                </span>
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">{shot.label}</h4>
              <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">{shot.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Camera Angles */}
      <div className="space-y-6">
        <h3 className="tab-grid-title uppercase">
          Angle Diagnostics
        </h3>
        <div className="space-y-3 max-w-3xl">
          {angles.map((angle, i) => (
            <div
              key={i}
              className="angle-diagnostic-item"
            >
              <div className="angle-icon-box">
                <angle.icon className="w-5 h-5 text-studio" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">{angle.label}</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">{angle.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
