/**
 * Skeleton components for smooth loading states
 */

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const StatSkeleton = ({ className }: { className?: string }) => (
  <motion.div
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    className={cn("rounded-[2.5rem] bg-white/5 border border-white/5 p-8 h-40", className)}
  />
);

export const CardSkeleton = ({ className }: { className?: string }) => (
  <motion.div
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    className={cn("rounded-[2rem] bg-white/5 border border-white/5 p-6 h-32", className)}
  />
);

export const ProjectCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    className="rounded-[2rem] bg-white/5 border border-white/5 p-6 flex items-center gap-6"
  >
    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-white/[0.03] rounded w-3/4" />
      <div className="h-3 bg-white/[0.03] rounded w-1/2" />
    </div>
  </motion.div>
);

export const StatsGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {[...Array(4)].map((_, i) => (
      <StatSkeleton key={i} />
    ))}
  </div>
);

export const ProjectsGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[...Array(4)].map((_, i) => (
      <ProjectCardSkeleton key={i} />
    ))}
  </div>
);

export const SystemLogsSkeleton = () => (
  <div className="space-y-6">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="flex items-start gap-4"
      >
        <div className="w-1 h-1 rounded-full bg-white/[0.03] mt-2 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-white/[0.03] rounded w-full" />
          <div className="h-2 bg-white/[0.03] rounded w-1/3" />
        </div>
      </motion.div>
    ))}
  </div>
);
