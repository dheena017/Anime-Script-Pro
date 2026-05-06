import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Zap, 
  Sparkles, 
  Crown, 
  ArrowRight, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Database,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { marketingStyles as s } from './marketingStyles';

const PricingCard = ({ 
  title, 
  price, 
  features, 
  highlighted = false, 
  icon: Icon, 
  onSelect,
  nodeId,
  availability,
  efficiency
}: { 
  title: string; 
  price: string; 
  features: string[]; 
  highlighted?: boolean; 
  icon: React.ComponentType<{ className?: string }>; 
  onSelect: () => void;
  nodeId: string;
  availability: string;
  efficiency: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={cn(
      s.cardBase,
      highlighted ? s.cardHighlighted : s.cardDefault
    )}
  >
    {/* Background Glow */}
    <div className={cn(
      s.cardGlow,
      highlighted ? "bg-studio" : "bg-white"
    )} />

    {highlighted && (
      <div className="absolute top-8 right-10">
        <div className="px-5 py-2 rounded-full bg-studio text-black text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2">
           <Zap className="w-3 h-3 fill-black" /> Recommended
        </div>
      </div>
    )}
    
    <div className="flex items-center justify-between mb-12">
       <div className={cn(
         s.iconWrapper,
         highlighted ? s.iconHighlighted : s.iconDefault
       )}>
         <Icon className="w-8 h-8" />
       </div>
       <div className="text-right">
          <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-1">{nodeId}</div>
          <div className="flex items-center gap-2 justify-end">
             <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", availability === 'Optimal' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500")} />
             <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{availability}</span>
          </div>
       </div>
    </div>

    <div className="space-y-1 mb-10">
       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter group-hover:text-studio transition-colors">{title}</h3>
       <div className="flex items-baseline gap-2">
         <span className="text-5xl md:text-6xl font-black text-white italic tracking-tighter">{price}</span>
         <span className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px]">{price !== 'Free' ? '/MO' : 'TRIAL'}</span>
       </div>
    </div>

    <div className="space-y-4 mb-12 flex-grow">
      {features.map((feature, i) => (
        <div key={i} className="flex items-center gap-4 group/item">
          <div className={cn(
            "w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-300",
            highlighted ? "bg-studio/20 text-studio" : "bg-white/5 text-zinc-600 group-hover/item:bg-white/10"
          )}>
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] text-zinc-500 font-black uppercase tracking-widest group-hover/item:text-white transition-colors">{feature}</span>
        </div>
      ))}
    </div>

    {/* Telemetry Node */}
    <div className="mb-10 pt-8 border-t border-white/5 flex items-center justify-between">
       <div className="space-y-1">
          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Synthesis Efficiency</span>
          <div className="text-[10px] font-black text-studio uppercase italic">{efficiency}</div>
       </div>
       <Database className="w-4 h-4 text-zinc-800" />
    </div>

    <Button 
      onClick={onSelect}
      className={cn(
        "h-16 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[11px] transition-all relative overflow-hidden group/btn",
        highlighted 
          ? "bg-studio text-black hover:bg-white hover:scale-[1.02] shadow-3xl" 
          : "bg-white/5 text-white hover:bg-white hover:text-black"
      )}
    >
      Initialize Protocol <ArrowRight className="ml-3 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
    </Button>
  </motion.div>
);

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className={s.page}>
      {/* Visual Decor */}
      <div className={s.decorTop} />
      <div className={s.decorBottom} />

      <div className={s.wrapper}>
        
        {/* 1. HEADER PROTOCOL */}
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-studio/5 border border-studio/20 backdrop-blur-md"
          >
            <Cpu className="w-4 h-4 text-studio" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-studio">Production Tier Matrix V4.0</span>
          </motion.div>
          
          <div className="space-y-4">
             <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">
               Production <span className="text-studio">Power.</span>
             </h1>
             <p className="max-w-2xl mx-auto text-zinc-500 font-bold uppercase tracking-[0.2em] text-[11px] leading-relaxed">
               Scalable resources for solo creators and full-scale production studios.
             </p>
          </div>
        </div>

        {/* 2. TIER GRID */}
        <div className={s.tierGrid}>
          <PricingCard 
            title="Aspirant"
            price="Free"
            nodeId="NODE-T1-BASE"
            availability="Optimal"
            efficiency="Standard Sync"
            icon={Zap}
            onSelect={() => navigate('/login')}
            features={[
              "1 Active Project Shard",
              "Standard AI Generation",
              "Global Community Link",
              "720p Protocol Exports",
              "Standard Rendering Latency"
            ]}
          />
          <PricingCard 
            title="Architect"
            price="$29"
            nodeId="NODE-T2-PRO"
            availability="Optimal"
            efficiency="High-Bandwidth"
            highlighted={true}
            icon={Sparkles}
            onSelect={() => navigate('/login')}
            features={[
              "Unlimited Production Shards",
              "Priority Agent Swarm Access",
              "Advanced Character DNA V3",
              "4K Production Exports",
              "Custom Architect Templates",
              "Extended Archive Storage"
            ]}
          />
          <PricingCard 
            title="Master"
            price="$99"
            nodeId="NODE-T3-MAX"
            availability="Optimal"
            efficiency="Real-Time Sync"
            icon={Crown}
            onSelect={() => navigate('/login')}
            features={[
              "Everything in Architect",
              "White-label Protocol Exports",
              "Direct API Node Interface",
              "Dedicated Sub-agent Cluster",
              "24/7 Priority Support",
              "Zero-Latency Synthesis"
            ]}
          />
        </div>
        
        {/* 3. ENTERPRISE CLUSTER INTERFACE */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={s.enterprisePanel}
        >
          <div className={s.enterpriseOverlay} />
          <div className={s.enterpriseText}>
            <div className={s.enterpriseBadge}>
               <Globe className="w-5 h-5 text-studio" />
               <span className={s.enterpriseBadgeText}>Enterprise Protocol</span>
            </div>
            <div className={s.enterpriseHeadingCopy}>
               <h3 className={s.enterpriseHeading}>Need a Custom <br /> Production Cluster?</h3>
               <p className={s.enterpriseCopy}>
                 Dedicated neural infrastructure for large-scale anime production houses. Specialized sub-agent swarms and high-bandwidth API nodes.
               </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/contact')} 
            className={s.enterpriseButton}
          >
            INITIALIZE SALES LINK <ArrowRight className="ml-4 w-5 h-5" />
          </Button>
        </motion.div>

        {/* 4. TELEMETRY FOOTER */}
        <footer className={s.footerStats}>
           <div className="flex items-center gap-4">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Certified Secure Billing Node</span>
           </div>
           <div className="flex items-center gap-4">
              <Activity className="w-4 h-4 text-studio" />
              <span>Global Availability: 99.9%</span>
           </div>
           <div className="flex items-center gap-4">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Zero-Tax Protocol Processing</span>
           </div>
        </footer>
      </div>
    </div>
  );
}
