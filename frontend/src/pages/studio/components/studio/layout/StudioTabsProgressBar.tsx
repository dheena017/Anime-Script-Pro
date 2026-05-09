import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudioTabsProgressBarProps {
  progress: number;
  theme?: 'cyan' | 'red' | 'purple' | 'amber';
}

export const StudioTabsProgressBar: React.FC<StudioTabsProgressBarProps> = ({ 
  progress, 
  theme = 'cyan' 
}) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const trickleRef = useRef<NodeJS.Timeout | null>(null);

  // Sync internal progress with external progress
  useEffect(() => {
    // When external progress jumps forward, we sync to it
    setInternalProgress(prev => Math.max(prev, progress));
    
    // Clear existing trickle
    if (trickleRef.current) clearInterval(trickleRef.current);

    // If progress is active but not complete, start trickling
    if (progress > 0 && progress < 100) {
      trickleRef.current = setInterval(() => {
        setInternalProgress(prev => {
          // Calculate a diminishing increment to simulate "realistic" slowdown as it nears completion
          const remaining = 100 - prev;
          const increment = Math.random() * (remaining * 0.01); 
          const next = prev + Math.max(increment, 0.05); // Minimum trickle
          return next >= 99.5 ? 99.5 : next; // Cap at 99.5 until explicitly set to 100
        });
      }, 500);
    }

    return () => {
      if (trickleRef.current) clearInterval(trickleRef.current);
    };
  }, [progress]);

  const themeColors = {
    cyan: 'from-cyan-400 via-cyan-500 to-cyan-300',
    red: 'from-red-400 via-red-500 to-red-300',
    purple: 'from-purple-400 via-purple-500 to-purple-300',
    amber: 'from-amber-400 via-amber-500 to-amber-300',
  };

  const glowColors = {
    cyan: 'rgba(6,182,212,0.5)',
    red: 'rgba(239,68,68,0.5)',
    purple: 'rgba(168,85,247,0.5)',
    amber: 'rgba(245,158,11,0.5)',
  };

  return (
    <AnimatePresence>
      {progress > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: '4px' }}
          exit={{ opacity: 0, height: 0 }}
          className="absolute bottom-0 left-0 w-full overflow-hidden bg-black/20"
        >
          {/* Main Progress Bar */}
          <motion.div 
            className={`h-full bg-gradient-to-r ${themeColors[theme]} relative`}
            initial={{ width: '0%' }}
            animate={{ width: `${internalProgress}%` }}
            transition={{ 
              type: "spring", 
              stiffness: 50, 
              damping: 20,
              mass: 1
            }}
            style={{
              boxShadow: `0 0 15px ${glowColors[theme]}`,
            }}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
            
            {/* Scanning Light Effect */}
            <motion.div
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>

          {/* Pulse Ripple (at the tip) */}
          <motion.div 
            className="absolute h-full w-[10px] blur-sm bg-white z-10"
            animate={{
              left: `${internalProgress}%`,
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ 
              transform: 'translateX(-50%)',
              backgroundColor: glowColors[theme] 
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
