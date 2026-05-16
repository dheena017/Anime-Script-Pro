import React from 'react';
import { LucideIcon, Sparkles, ArrowRight, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string; // Optional custom color for the feature icon/border
}

interface StudioEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
  isActionDisabled?: boolean;
  loadingLabel?: string;
  features?: Feature[];
  accentColor?: string; // e.g., 'fuchsia', 'cyan', 'studio'
  className?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  footerLabel?: string;
}

export const StudioEmptyState: React.FC<StudioEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  isLoading = false,
  isActionDisabled = false,
  loadingLabel,
  features,
  accentColor = 'studio',
  className,
  secondaryActionLabel,
  onSecondaryAction,
  footerLabel = "AI-POWERED GENERATION COMES NEXT"
}) => {

  const accentColors = {
    studio: 'from-studio/20 to-cyan-500/10 border-studio/30 text-studio shadow-[0_0_50px_rgba(6,182,212,0.15)]',
    fuchsia: 'from-fuchsia-500/20 to-purple-500/10 border-fuchsia-500/30 text-fuchsia-400 shadow-[0_0_50px_rgba(217,70,239,0.15)]',
    cyan: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.15)]',
    amber: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.15)]',
    emerald: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.15)]',
  };

  const currentAccent = accentColors[accentColor as keyof typeof accentColors] || accentColors.studio;

  return (
    <div className={cn(
      "relative flex flex-col items-center justify-center min-h-[600px] w-full p-8 md:p-12 lg:p-20 overflow-hidden",
      "animate-in fade-in duration-1000",
      className
    )}>
      {/* Background Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-studio/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-4xl bg-[#030303]/40 border border-white/5 rounded-[2.5rem] p-8 md:p-16 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center">
        {/* Glow behind icon */}
        <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 blur-[60px] opacity-20", currentAccent.split(' ')[0])} />

        {/* Icon Container */}
        <div className={cn(
          "relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br border flex items-center justify-center mb-10 group transition-all duration-500 hover:scale-105",
          currentAccent
        )}>
          <Icon className="w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_8px_currentColor]" />
        </div>

        {/* Content */}
        <div className="space-y-6 mb-10">
          <h2 className="text-3xl md:text-2xl font-black uppercase tracking-[0.25em] text-white leading-tight drop-shadow-sm">
            {title}
          </h2>
          <p className="text-zinc-500 font-bold leading-relaxed uppercase tracking-[0.2em] text-xs md:text-xs max-w-lg mx-auto">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-6">
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              disabled={isLoading || isActionDisabled}
              className={cn(
                "h-14 px-10 rounded-full font-black uppercase tracking-widest text-xs gap-3 transition-all duration-500",
                "bg-gradient-to-r from-studio to-cyan-500 text-black hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95",
                (isLoading || isActionDisabled) && "opacity-20 grayscale pointer-events-none"
              )}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {actionLabel}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}

          {secondaryActionLabel && (
            <button
              onClick={onSecondaryAction}
              className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-studio transition-colors flex items-center gap-2 group"
            >
              <Sparkles className="w-3 h-3 group-hover:animate-pulse" />
              {secondaryActionLabel}
            </button>
          )}
        </div>

        {/* Footer Text */}
        <div className="mt-16 pt-8 border-t border-white/5 w-full">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 flex items-center justify-center gap-2">
            <Rocket className="w-3 h-3 text-studio/60" />
            {footerLabel}
          </p>
        </div>
      </div>

      {/* Features Grid */}
      {features && features.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-12 relative z-10">
          {features.map((feature, i) => (
            <div
              key={i}
              className={cn(
                "p-8 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/10 hover:translate-y-[-4px] group/card relative overflow-hidden",
                feature.color ? `hover:shadow-[0_0_30px_${feature.color}15]` : "hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 transition-all duration-500 group-hover/card:scale-110",
                feature.color ? `text-${feature.color}-400` : "text-studio"
              )}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-zinc-200 mb-3">
                {feature.title}
              </h4>
              <p className="text-xs text-zinc-500 font-bold uppercase leading-relaxed tracking-wider">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



