import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface StudioEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  isLoading?: boolean;
  isActionDisabled?: boolean;
  loadingLabel?: string;
  features?: Feature[];
  accentColor?: string; // e.g., 'fuchsia', 'cyan', 'studio'
  className?: string;
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
  className
}) => {

  const accentClass = {
    studio: 'text-studio border-studio/20 bg-studio/5 group-hover:border-studio/40 shadow-studio',
    fuchsia: 'text-fuchsia-500 border-fuchsia-500/20 bg-fuchsia-500/5 group-hover:border-fuchsia-500/40 shadow-fuchsia-500/20',
    cyan: 'text-cyan-500 border-cyan-500/20 bg-cyan-500/5 group-hover:border-cyan-500/40 shadow-cyan-500/20',
    amber: 'text-amber-500 border-amber-500/20 bg-amber-500/5 group-hover:border-amber-500/40 shadow-amber-500/20',
    indigo: 'text-indigo-500 border-indigo-500/20 bg-indigo-500/5 group-hover:border-indigo-500/40 shadow-indigo-500/20',
    emerald: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5 group-hover:border-emerald-500/40 shadow-emerald-500/20',
    rose: 'text-rose-500 border-rose-500/20 bg-rose-500/5 group-hover:border-rose-500/40 shadow-rose-500/20',
  }[accentColor] || 'text-studio border-studio/20 bg-studio/5 shadow-studio';



  return (
    <div className={cn(
      "relative flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] p-4 sm:p-12 lg:p-24 overflow-hidden rounded-[2rem] sm:rounded-[3rem] border border-zinc-900 bg-[#050505]",
      "animate-in fade-in zoom-in duration-700",
      className
    )}>


      {/* Floating particles or decorative elements could go here */}


      <div className="relative z-10 flex flex-col items-center text-center space-y-12 max-w-4xl mx-auto">
        {/* Main Icon */}
        <div className="group relative">

          <div className={cn(
            "relative w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-black border flex items-center justify-center transition-all duration-500 group-hover:scale-110",
            accentClass
          )}>
            <Icon className="w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 group-hover:rotate-12" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white text-shadow-studio leading-tight">
            {title}
          </h3>
          <p className="text-zinc-500 font-medium leading-relaxed uppercase tracking-widest text-[10px] md:text-xs max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Features Grid */}
        {features && features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="p-6 bg-black/40 border-zinc-900/50 backdrop-blur-md hover:border-studio/30 transition-all group/card overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-studio/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                <feature.icon className="w-6 h-6 text-studio/40 group-hover/card:text-studio mb-4 transition-colors relative z-10" />
                <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-300 mb-2 relative z-10">
                  {feature.title}
                </h4>
                <p className="text-[9px] text-zinc-600 font-bold uppercase leading-relaxed relative z-10">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4">
          <Button
            onClick={onAction}
            disabled={isLoading || isActionDisabled}
            className={cn(
              "btn-genesis w-full sm:w-auto",
              (isLoading || isActionDisabled) && "opacity-20 grayscale pointer-events-none"
            )}
          >

            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
            ) : (
              <Sparkles className="w-4 h-4 mr-3 group-hover:animate-pulse" />
            )}
            {isLoading ? (loadingLabel || 'Processing...') : actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};



