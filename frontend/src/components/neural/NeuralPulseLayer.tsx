import { motion } from 'framer-motion';

export function NeuralPulseLayer() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Optimized Neural Pulse */}
      <motion.div
        animate={{
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)]"
      />

      {/* Scanning Line Effect - CSS only for performance */}
      <div 
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-scan"
        style={{ 
          top: '-10%',
          animation: 'scan 20s linear infinite'
        }}
      />
      <style>{`
        @keyframes scan {
          from { transform: translateY(0); }
          to { transform: translateY(120vh); }
        }
      `}</style>
    </div>
  );
}



