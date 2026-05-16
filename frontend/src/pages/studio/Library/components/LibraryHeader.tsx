import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { sharedStyles as s } from '../../components/studio/shared/sharedStyles';

export interface Stat {
  label: string;
  value: string;
  icon: any;
  color?: string;
}

interface LibraryHeaderProps {
  title: string;
  subtitle: string;
  brandIcon: any;
  version?: string;
  status?: string;
  stats?: Stat[];
  bottomMetrics?: React.ReactNode;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  title, subtitle, brandIcon: BrandIcon, version = "4.2.0", status = "SYSTEM ONLINE", stats = [], bottomMetrics
}) => {
  return (
    <header className={s.moduleHeader}>
      <div className={s.headerMain}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={s.brandSection}>
          <div className="relative">
            <div className="absolute inset-0 bg-[#bd4a4a] blur-3xl opacity-20 animate-pulse" />
            <div className="relative p-6 bg-zinc-950 border border-[#bd4a4a]/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(189,74,74,0.15)]">
              <BrandIcon className="w-10 h-10 text-[#bd4a4a]" />
            </div>
          </div>
          <div className={s.titleSection}>
            <div className={s.headerBadges}>
              <span className={cn(s.headerBadge, s.headerBadgeRed)}>Version {version}</span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-emerald-500/20 rounded-full">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">{status}</span>
              </div>
            </div>
            <h1 className={s.headerTitle}>
              {title.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-zinc-800 mx-2">/</span>}
                  <span className={i === 1 ? "text-[#bd4a4a]" : "text-white"}>{word}</span>
                </React.Fragment>
              ))}
            </h1>
            <p className={s.headerSubtitle}>{subtitle}</p>
          </div>
        </motion.div>

        <div className={s.statsGrid}>
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={s.statCard}>
              <div className={s.statLabel}>
                <stat.icon className={cn("w-3.5 h-3.5", stat.color || "text-[#bd4a4a]")} />
                <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
              </div>
              <span className={s.statValue}>{stat.value}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {bottomMetrics && (
        <div className="flex flex-wrap items-center gap-12 pt-4">
          {bottomMetrics}
        </div>
      )}
    </header>
  );
};

