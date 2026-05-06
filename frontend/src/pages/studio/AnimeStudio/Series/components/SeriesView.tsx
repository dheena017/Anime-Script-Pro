import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SeriesCard, SeriesEpisode, SeriesAssetMatrix } from './SeriesCard';

interface SeriesViewProps {
  plan: SeriesEpisode[];
  isEditing: boolean;
  onUpdateEpisode: (index: number, updates: Partial<SeriesEpisode>) => void;
  onUpdateAssetMatrix: (index: number, updates: Partial<SeriesAssetMatrix>) => void;
  onFocusEpisode: (episodeNum: string) => void;
  onViewEpisode?: (episodeNum: string) => void;
  viewMode?: 'grid' | 'list';
}

export function SeriesView({
  plan,
  isEditing,
  onUpdateEpisode,
  onUpdateAssetMatrix,
  onFocusEpisode,
  onViewEpisode,
  viewMode = 'list'
}: SeriesViewProps) {
  return (
    <div className="relative py-8">
      {/* Master Timeline Connector with Neural Pulse */}
      {viewMode === 'list' && (
        <div className="absolute left-[38px] md:left-[5.5rem] top-0 bottom-0 w-px bg-zinc-800 pointer-events-none hidden sm:block overflow-hidden">
        <motion.div 
          animate={{ 
            top: ["-20%", "100%"],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute w-full h-[300px] bg-gradient-to-b from-transparent via-studio/80 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.5)]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-studio/10 to-transparent" />
      </div>
      )}
      
      <div className={cn(
        "relative z-10",
        viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" : "flex flex-col gap-12"
      )}>
        {plan.map((ep, idx) => (
          <SeriesCard
            key={idx}
            ep={ep}
            idx={idx}
            isEditing={isEditing}
            onUpdateEpisode={onUpdateEpisode}
            onUpdateAssetMatrix={onUpdateAssetMatrix}
            onFocusEpisode={onFocusEpisode}
            onViewEpisode={onViewEpisode}
          />
        ))}
      </div>
    </div>
  );
}



