import React from 'react';
import { Camera, Video, Monitor, Layers, ShieldCheck, Film } from 'lucide-react';
import { motion } from 'framer-motion';
import { parseScriptTable } from '../scriptUtils';

interface CinematicsTabProps {
  generatedScript: string | null;
}

export const CinematicsTab: React.FC<CinematicsTabProps> = ({ generatedScript }) => {
  const { shots, metadata } = React.useMemo(() => {
    const parsed = parseScriptTable(generatedScript);
    
    if (parsed.length === 0) {
      return {
        shots: [],
        metadata: {
          lens: '35mm Anamorphic',
          ratio: '2.39:1 Cinemascope',
          depth: 'High-Contrast Noir'
        }
      };
    }
    
    // Map dynamic lens and styling based on script content
    let lens = '35mm Anamorphic';
    let depth = 'High-Contrast Noir';
    const textBlob = parsed.map(s => s.visualDirection).join(' ').toLowerCase();
    
    if (textBlob.includes('cyber') || textBlob.includes('neon') || textBlob.includes('glitch')) {
      lens = '85mm Neural Prime';
      depth = 'Neon Cyberpunk';
    } else if (textBlob.includes('steampunk') || textBlob.includes('steam') || textBlob.includes('industrial')) {
      lens = '50mm Burnished Copper';
      depth = 'Steam-Ionized Palette';
    } else if (textBlob.includes('fantasy') || textBlob.includes('magic')) {
      lens = '24mm Ethereal Bloom';
      depth = 'Magic Realism Bloom';
    }
    
    const mappedShots = parsed.map((scene) => {
      const vis = scene.visualDirection.toLowerCase();
      let shotType = 'MCU. SOUL FOCUS';
      
      if (vis.includes('wide') || vis.includes('panoramic') || vis.includes('establishing')) {
        shotType = 'EXT. SHOT - WIDE';
      } else if (vis.includes('close-up') || vis.includes('close up') || vis.includes('detail') || vis.includes('focus on')) {
        shotType = 'CU. DETAIL - CLOSE';
      } else if (vis.includes('tracking') || vis.includes('steadicam') || vis.includes('follows')) {
        shotType = 'TRACKING SHOT';
      } else if (vis.includes('low angle') || vis.includes('low-angle')) {
        shotType = 'LOW-ANGLE DRAMATIC';
      } else if (vis.includes('high angle') || vis.includes('high-angle')) {
        shotType = 'HIGH-ANGLE PERSPECTIVE';
      } else if (vis.includes('pov') || vis.includes('point of view')) {
        shotType = 'POV PERSPECTIVE';
      } else {
        const words = scene.visualDirection
          .split(' ')
          .slice(0, 2)
          .map(w => w.replace(/[^a-zA-Z]/g, '').toUpperCase())
          .filter(w => w.length > 1);
        if (words.length > 0) {
          shotType = words.join(' ');
        }
      }
      
      return {
        id: `SCN_${String(scene.sceneNum).padStart(2, '0')}`,
        type: shotType,
        action: scene.visualDirection,
        videoPrompt: scene.videoPrompt,
        imagePrompt: scene.imagePrompt
      };
    });
    
    return {
      shots: mappedShots,
      metadata: {
        lens,
        ratio: '2.39:1 Cinemascope',
        depth
      }
    };
  }, [generatedScript]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12 space-y-12"
    >
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-[2rem] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(168,85,247,0.15)]"
        >
          <Camera className="w-8 h-8 text-purple-400" />
        </motion.div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Cinematic Core</h2>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">Camera sequencing and visual direction protocols</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { label: 'Primary Lens', value: metadata.lens, icon: Video, desc: 'Selected camera focal profile.' },
          { label: 'Aspect Ratio', value: metadata.ratio, icon: Monitor, desc: 'Thematic letterboxing setup.' },
          { label: 'Visual Depth', value: metadata.depth, icon: Layers, desc: 'Dominant cinematic grading style.' }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="p-8 bg-gradient-to-b from-[#0e0e0e] to-[#040404] border border-white/5 rounded-[2.5rem] space-y-4 hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.05)] transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/10 transition-all duration-500 group-hover:scale-110 group-hover:border-purple-500/20">
              <item.icon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">{item.label}</h3>
              <p className="text-xl font-black text-white mt-2 uppercase tracking-tight leading-tight">{item.value}</p>
              <p className="text-[11px] font-medium text-zinc-600 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-10 bg-gradient-to-b from-[#0c0c0c] to-[#030303] border border-white/5 rounded-[3rem] backdrop-blur-xl relative overflow-hidden group max-w-5xl mx-auto">
        <div className="absolute top-0 right-0 p-6 pointer-events-none">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping opacity-75" />
            <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse" />
          </div>
        </div>
        
        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-9 h-9 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
            <Film className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-xs font-black text-zinc-300 uppercase tracking-[0.3em]">Active Shot List</h4>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Camera setups parsed directly from script directives</p>
          </div>
        </div>

        <div className="space-y-4">
          {shots.length === 0 ? (
            <p className="text-xs text-zinc-500 uppercase font-black tracking-widest text-center py-6">No scene actions parsed.</p>
          ) : (
            shots.map((shot, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.2 }}
                className="flex flex-col gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/5 hover:border-purple-500/20 transition-all duration-300 group/shot"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-zinc-600 group-hover/shot:text-purple-400 transition-colors">{shot.id}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40 group-hover/shot:bg-purple-500 transition-colors" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">{shot.type}</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-medium italic md:max-w-xl leading-relaxed text-left md:text-right">{shot.action}</p>
                </div>

                {/* AI Storyboard Prompt Envelopes */}
                {(shot.videoPrompt || shot.imagePrompt) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pt-4 border-t border-white/5">
                    {shot.videoPrompt && (
                      <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10 space-y-1.5 relative overflow-hidden group/prompt text-left">
                        <div className="flex items-center gap-2">
                          <Video className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Neural Video Prompt</span>
                        </div>
                        <p className="text-[10px] font-mono text-amber-300/80 leading-relaxed max-h-24 overflow-y-auto select-all">{shot.videoPrompt}</p>
                      </div>
                    )}
                    {shot.imagePrompt && (
                      <div className="p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/10 space-y-1.5 relative overflow-hidden group/prompt text-left">
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Midjourney Image Prompt</span>
                        </div>
                        <p className="text-[10px] font-mono text-cyan-300/80 leading-relaxed max-h-24 overflow-y-auto select-all">{shot.imagePrompt}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};
