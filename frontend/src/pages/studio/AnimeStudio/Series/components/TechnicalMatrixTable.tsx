import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Zap, 
  Cpu, 
  Music, 
  Activity, 
  User, 
  Film,
  Hash
} from 'lucide-react';

interface SceneData {
  scene?: string | number;
  section?: string;
  soulFocus?: string;
  narration?: string;
  visualDirection?: string;
  vfxCompounds?: string;
  audioForge?: string;
  emotionalKey?: string;
  // Fallbacks for the other format
  scene_id?: string;
  summary?: string;
  visual_direction?: string;
  vfx?: string;
  sound?: string;
  characters?: string[];
}

interface TechnicalMatrixTableProps {
  scenes: Array<SceneData | null | undefined>;
}

/**
 * TechnicalMatrixTable - The Neural Production Matrix
 * A high-density, professional table view for deep production auditing.
 */
export const TechnicalMatrixTable: React.FC<TechnicalMatrixTableProps> = ({ scenes }) => {
  return (
    <div className="w-full overflow-hidden rounded-[2rem] border border-white/5 bg-[#050505]/40 backdrop-blur-2xl shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="p-6 text-[10px] font-black text-studio uppercase tracking-[0.2em] whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Hash className="w-3 h-3" /> Scene #
                </div>
              </th>
              <th className="p-6 text-[10px] font-black text-studio uppercase tracking-[0.2em] whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Film className="w-3 h-3" /> Section
                </div>
              </th>
              <th className="p-6 text-[10px] font-black text-studio uppercase tracking-[0.2em] whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" /> Soul Focus
                </div>
              </th>
              <th className="p-6 text-[10px] font-black text-studio uppercase tracking-[0.2em] min-w-[250px]">
                Narration
              </th>
              <th className="p-6 text-[10px] font-black text-studio uppercase tracking-[0.2em] min-w-[250px]">
                Visual Direction
              </th>
              <th className="p-6 text-[10px] font-black text-studio uppercase tracking-[0.2em] min-w-[200px]">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3" /> VFX Compounds
                </div>
              </th>
              <th className="p-6 text-[10px] font-black text-studio uppercase tracking-[0.2em] min-w-[200px]">
                <div className="flex items-center gap-2">
                  <Music className="w-3 h-3" /> Audio Forge
                </div>
              </th>
              <th className="p-6 text-[10px] font-black text-studio uppercase tracking-[0.2em] whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Emotional Key
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {scenes.filter(Boolean).map((scene, idx) => {
              const safeScene = scene as SceneData;
              return (
              <tr 
                key={idx}
                className="group hover:bg-white/[0.02] transition-colors"
              >
                <td className="p-6 text-sm font-black text-white">{safeScene.scene || idx + 1}</td>
                <td className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{safeScene.section || 'Continuity'}</td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-studio/10 border border-studio/20 rounded-full text-[10px] font-black text-studio uppercase tracking-widest">
                    {safeScene.soulFocus || (safeScene.characters && safeScene.characters[0]) || 'Omniscient'}
                  </span>
                </td>
                <td className="p-6">
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed group-hover:text-zinc-200 transition-colors">
                    {safeScene.narration || safeScene.summary}
                  </p>
                </td>
                <td className="p-6">
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed group-hover:text-zinc-200 transition-colors">
                    {safeScene.visualDirection || safeScene.visual_direction}
                  </p>
                </td>
                <td className="p-6 text-xs text-zinc-500 font-medium italic group-hover:text-studio/60 transition-colors">
                  {safeScene.vfxCompounds || safeScene.vfx || 'Ambient Lighting'}
                </td>
                <td className="p-6 text-xs text-zinc-500 font-medium italic group-hover:text-studio/60 transition-colors">
                  {safeScene.audioForge || safeScene.sound || 'Atmospheric Hub'}
                </td>
                <td className="p-6">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-white transition-colors">
                    {safeScene.emotionalKey || 'Stable'}
                  </span>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
