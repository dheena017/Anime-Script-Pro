import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, CloudRain, Wind, Mountain, Building as City, Trees, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface AmbientControllerProps {
  currentLine: string;
}

type Mode = 'Rain' | 'Wind' | 'City' | 'Forest' | 'Silence';

export function AmbientController({ currentLine }: AmbientControllerProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [activeMode, setActiveMode] = useState<Mode>('Silence');
  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      setActiveMode('Silence');
      return;
    }

    const line = currentLine.toUpperCase();
    if (line.includes('RAIN')) setActiveMode('Rain');
    else if (line.includes('WIND') || line.includes('STORM')) setActiveMode('Wind');
    else if (line.includes('CITY') || line.includes('STREET')) setActiveMode('City');
    else if (line.includes('FOREST') || line.includes('WOODS')) setActiveMode('Forest');
    else if (line.includes('INT.') || line.includes('EXT.')) setActiveMode('Silence');
  }, [currentLine, isEnabled]);

  const toggleAmbience = () => {
    if (!isEnabled && !audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    setIsEnabled(!isEnabled);
  };

  const getIcon = () => {
    switch (activeMode) {
      case 'Rain': return <CloudRain className="w-4 h-4 text-blue-400" />;
      case 'Wind': return <Wind className="w-4 h-4 text-zinc-400" />;
      case 'City': return <City className="w-4 h-4 text-amber-400" />;
      case 'Forest': return <Trees className="w-4 h-4 text-emerald-400" />;
      default: return <Volume2 className="w-4 h-4 text-zinc-600" />;
    }
  };

  return (
    <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-2 rounded-2xl">
      <div className="flex flex-col">
        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Immersive Atmos</span>
        <AnimatePresence mode="wait">
          <motion.span 
            key={activeMode}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic"
          >
            {isEnabled ? activeMode : 'Off-line'}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="h-6 w-px bg-white/5 mx-1" />

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "w-8 h-8 rounded-xl transition-all",
          isEnabled ? "bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "text-zinc-600"
        )}
        onClick={toggleAmbience}
      >
        {isEnabled ? getIcon() : <VolumeX className="w-4 h-4" />}
      </Button>

      {isEnabled && activeMode !== 'Silence' && (
        <div className="flex gap-0.5 items-end h-3">
          {[1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              animate={{ height: [4, 12, 6, 10, 4] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
              className="w-1 bg-red-500/40 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
