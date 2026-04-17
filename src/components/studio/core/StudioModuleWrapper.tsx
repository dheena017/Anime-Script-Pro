import React from 'react';
import { motion } from 'motion/react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { StudioInputPanel } from './StudioInputPanel';
import { useGenerator } from '@/contexts/GeneratorContext';
import { useStudioActions } from '@/hooks/useStudioActions';

interface StudioModuleWrapperProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  onAction?: () => void;
  actionLabel?: string;
  isActionLoading?: boolean;
  actionDisabled?: boolean;
  children: React.ReactNode;
}

export function StudioModuleWrapper({
  title,
  subtitle,
  description,
  icon,
  onAction,
  actionLabel = 'BEGIN FABRICATION',
  isActionLoading = false,
  actionDisabled = false,
  children
}: StudioModuleWrapperProps) {
  return (
    <div className="space-y-10">
      {/* Hero Header Panel */}
      <div className="relative p-12 rounded-[40px] bg-zinc-950 border border-white/5 overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(220,38,38,0.1),transparent_70%)]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20">
                <div className="text-red-500">{icon}</div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">{subtitle}</span>
             </div>
             <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter text-white">
               {title.split(' ').map((word, i) => (
                 <span key={i} className={i === 1 ? 'text-red-600' : ''}>
                   {word}{' '}
                 </span>
               ))}
             </h1>
             <p className="text-zinc-500 max-w-xl text-sm font-medium leading-relaxed italic border-l-2 border-red-600/20 pl-4">
                {description}
             </p>
          </div>
          {onAction && (
            <Button 
              onClick={onAction}
              disabled={actionDisabled || isActionLoading}
              className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] group/btn relative overflow-hidden active:scale-95"
            >
              <div className="relative z-10 flex items-center gap-3">
                {isActionLoading ? (
                    <div className="w-5 h-5 border-2 border-zinc-200 border-t-red-600 rounded-full animate-spin" />
                ) : (
                    <Wand2 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                )}
                {isActionLoading ? 'PROCESSING...' : actionLabel}
              </div>
            </Button>
          )}
        </div>
      </div>

      {/* Content Panel Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        {children}
      </div>
    </div>
  );
}
