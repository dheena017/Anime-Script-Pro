import { useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Zap, 
  Globe, 
  UserPlus, 
  Layers, 
  ScrollText, 
  ImageIcon, 
  Search, 
  Play,
  Check
} from 'lucide-react';
import { useGeneratorState } from '@/hooks/useGenerator';

const PHASES = [
  { id: 'engine', label: 'Engine', path: '/engine', icon: Zap },
  { id: 'world', label: 'World', path: '/world', icon: Globe },
  { id: 'cast', label: 'Cast', path: '/cast', icon: UserPlus },
  { id: 'series', label: 'Series', path: '/series', icon: Layers },
  { id: 'storyboard', label: 'Storyboard', path: '/storyboard', icon: ImageIcon },
  { id: 'seo', label: 'SEO', path: '/seo', icon: Search },
  { id: 'screening', label: 'Screening', path: '/screening', icon: Play },
];

export function ProductionFlowBar({ basePath = '/anime' }: { basePath?: string }) {
  const location = useLocation();
  const { 
    generatedWorld, 
    characterList, 
    generatedSeriesPlan, 
    generatedScript, 
    storyboardPrompts, 
    generatedMetadata 
  } = useGeneratorState();

  const pathParts = location.pathname.split('/');
  const currentPath = pathParts[pathParts.length - 1] || 'engine';
  
  // Robust path matching
  const currentIndex = PHASES.findIndex(p => 
    currentPath.toLowerCase() === p.id.toLowerCase() || 
    location.pathname.toLowerCase().includes(p.path.toLowerCase())
  );

  // Real-data completion status
  const getPhaseStatus = (id: string) => {
    switch(id) {
      case 'engine': return true; // Engine is the starting point
      case 'world': return !!generatedWorld;
      case 'cast': return !!characterList?.length;
      case 'series': return !!generatedSeriesPlan?.length;
      case 'storyboard': return !!storyboardPrompts;
      case 'seo': return !!generatedMetadata;
      case 'screening': return false; // Screening is the final result
      default: return false;
    }
  };

  return (
    <div className="w-full px-8 py-6 mb-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto relative">
        {/* Background Line */}
        <div className="absolute top-5 left-0 w-full h-[1px] bg-zinc-900 z-0" />
        
        {/* Progress Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (PHASES.length - 1)) * 100}%` }}
          className="absolute top-5 left-0 h-[2px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-red-500 z-0 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          transition={{ duration: 0.8, ease: "circOut" }}
        />

        {PHASES.map((phase, index) => {
          const isActive = index === currentIndex;
          const isCompleted = getPhaseStatus(phase.id);
          const Icon = phase.icon;

          return (
            <div key={phase.id} className="relative z-10 flex flex-col items-center gap-3">
              <Link to={`${basePath}${phase.path}`} className="group/phase">
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-700 relative",
                    isActive 
                      ? "bg-black border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)] text-cyan-400" 
                      : isCompleted
                        ? "bg-zinc-900 border-zinc-700/50 text-studio/60"
                        : "bg-black border-zinc-900 text-zinc-800 hover:border-zinc-700 hover:text-zinc-500"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-studio flex items-center justify-center border border-black shadow-lg"
                      >
                        <Check className="w-2.5 h-2.5 text-black stroke-[4]" />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <Icon className={cn(
                    "w-4 h-4 transition-all duration-500",
                    isActive ? "animate-pulse" : "group-hover/phase:scale-110"
                  )} />
                  
                  {isActive && (
                    <>
                      <motion.div
                        layoutId="flow-ring"
                        className="absolute -inset-1.5 border border-cyan-500/30 rounded-[1.25rem]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                      <div className="absolute -inset-3 bg-cyan-500/5 rounded-full blur-xl animate-pulse" />
                    </>
                  )}
                </motion.div>
              </Link>
              
              <div className="flex flex-col items-center">
                <span className={cn(
                  "text-xs font-black uppercase tracking-[0.3em] transition-all duration-700",
                  isActive ? "text-white scale-110" : isCompleted ? "text-zinc-500" : "text-zinc-800"
                )}>
                  {phase.label}
                </span>
                {isActive && (
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="h-0.5 w-4 bg-cyan-500 mt-1 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" 
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Mobile compact flow bar: sticky bottom icon rail for small screens
export function ProductionFlowBarMobile({ basePath = '/anime' }: { basePath?: string }) {
  return (
    <div className="sm:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-[310] bg-[#050505]/95 backdrop-blur-md px-3 py-2 rounded-3xl shadow-2xl flex items-center gap-2 transform-gpu will-change-transform">
      {PHASES.map(phase => {
        const Icon = phase.icon;
        return (
          <a key={phase.id} href={`${basePath}${phase.path}`} className="w-10 h-10 rounded-lg flex items-center justify-center text-zinc-300 bg-transparent">
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
}

