import React from 'react';
import { motion } from 'framer-motion';

/**
 * NEURAL SPEED PROTOCOL
 * Parallax speed lines for high-velocity hero sections.
 */
export const SpeedLines: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "200%", opacity: [0, 1, 0] }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
          style={{ top: `${Math.random() * 100}%` }}
          className="absolute h-px w-64 bg-gradient-to-r from-transparent via-studio to-transparent"
        />
      ))}
    </div>
  );
};

/**
 * TERMINAL SCANLINE OVERLAY
 * Subtle moving scanline to simulate production monitors.
 */
export const DigitalScanline: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden opacity-[0.03]">
       {/* Horizontal Pulse */}
       <motion.div 
         animate={{ y: ["0%", "100%"] }}
         transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
         className="w-full h-24 bg-gradient-to-b from-transparent via-studio to-transparent"
       />
       {/* Static Grid Lines */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
    </div>
  );
};

/**
 * NEURAL GLOW EMITTERS
 * Dynamic background pulses.
 */
export const NeuralGlow: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
       <motion.div 
         animate={{ 
           scale: [1, 1.2, 1],
           opacity: [0.1, 0.2, 0.1]
         }}
         transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
         className="absolute -top-1/4 -right-1/4 w-full h-full bg-studio/20 rounded-full blur-[160px]"
       />
       <motion.div 
         animate={{ 
           scale: [1.2, 1, 1.2],
           opacity: [0.1, 0.15, 0.1]
         }}
         transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
         className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-fuchsia-500/10 rounded-full blur-[160px]"
       />
    </div>
  );
};

/**
 * ARCHITECTURAL HUD DECORATION
 * Vertical HUD markers and coordinate readouts.
 */
export const HUDDecoration: React.FC = () => (
  <>
    {/* Left HUD Bar */}
    <div className="fixed inset-y-0 left-0 w-12 z-[90] pointer-events-none hidden xl:flex flex-col items-center justify-between py-24 opacity-30">
      <div className="flex flex-col items-center gap-12">
        <span className="text-[8px] font-black text-studio uppercase tracking-[0.5em] rotate-90 origin-center whitespace-nowrap">SECTOR-01</span>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-[1px] h-32 bg-gradient-to-b from-transparent via-studio to-transparent" />
        ))}
      </div>
      <div className="flex flex-col items-center gap-4">
         <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
         <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Active</span>
      </div>
    </div>

    {/* Right HUD Bar */}
    <div className="fixed inset-y-0 right-0 w-12 z-[90] pointer-events-none hidden xl:flex flex-col items-center justify-between py-24 opacity-30">
       <div className="flex flex-col items-center gap-4">
          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest tabular-nums">35.6895</span>
          <div className="w-px h-12 bg-white/10" />
       </div>
       <div className="flex flex-col items-center gap-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-[1px] h-32 bg-gradient-to-b from-transparent via-fuchsia-500 to-transparent" />
        ))}
        <span className="text-[8px] font-black text-fuchsia-500 uppercase tracking-[0.5em] rotate-90 origin-center whitespace-nowrap">NODE-ID: 842</span>
      </div>
    </div>
  </>
);

