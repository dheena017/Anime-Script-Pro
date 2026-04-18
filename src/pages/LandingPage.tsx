import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ScrollText, 
  Zap, 
  Shield, 
  Cpu,
  Globe,
  Clapperboard,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { auth, useAuthState } from '@/lib/storage';

export function LandingPage() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30 overflow-x-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(220,38,38,0.05),_transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,transparent_0%,#050505_100%)]" />
        
        {/* Animated Particles/Glowing Lines */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-900 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-transform hover:scale-110">
              <ScrollText className="text-white w-5 h-5" />
            </div>
            <span className="text-sm font-black tracking-[0.3em] uppercase italic">
              Anime Script <span className="text-red-500">Pro</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {['Engine', 'Features', 'Community', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-red-500 transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Button 
                onClick={() => navigate('/studio/script')}
                className="bg-red-600 hover:bg-red-500 text-white rounded-full px-6 h-10 font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(220,38,38,0.3)]"
              >
                Launch Studio
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  className="bg-white text-black hover:bg-zinc-200 rounded-full px-6 h-10 font-black uppercase tracking-widest text-[10px]"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
            <div className="space-y-10">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Nexus V2.0 Now Live</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-7xl lg:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] text-white">
                Forge Your <br />
                <span className="text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.4)]">Digital Legacy</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-zinc-500 text-lg font-medium leading-relaxed italic border-l-2 border-red-600/20 pl-6 max-w-lg">
                The world's most advanced AI-orchestrated production terminal for anime creators. Sequence, script, and simulate with neural precision.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
                <Button 
                  onClick={() => navigate(user ? '/studio/script' : '/register')}
                  className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-black uppercase tracking-[0.2em] text-[12px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] group relative overflow-hidden active:scale-95"
                >
                  <div className="relative z-10 flex items-center gap-3">
                    Start Creation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-16 px-10 rounded-2xl border-zinc-800 bg-black/40 text-zinc-400 hover:text-white hover:border-zinc-600 backdrop-blur-xl font-black uppercase tracking-[0.2em] text-[12px] active:scale-95"
                >
                  <Play className="w-4 h-4 mr-3" />
                  Watch Trailer
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-center gap-8 pt-10 border-t border-white/5">
                {[
                  { label: 'Creators', val: '24K+' },
                  { label: 'Scripts', val: '1.2M' },
                  { label: 'Accuracy', val: '99.9%' }
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-black text-white">{stat.val}</p>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div 
              variants={itemVariants}
              className="relative aspect-square lg:aspect-video rounded-[40px] overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
            >
              <img 
                src={`${window.location.protocol}//${window.location.host}/anime_noir_hero_1776465134038.png`} 
                alt="Studio Hero" 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-8 left-8 right-8 p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/5">
                <div className="flex items-center justify-between">
                   <div>
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Live Environment</p>
                      <p className="text-white font-bold tracking-tight">Production Studio • Terminal 04</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center animate-pulse">
                      <Zap className="w-5 h-5 text-red-500" />
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 space-y-4">
            <p className="text-[12px] font-black text-red-500 uppercase tracking-[0.4em]">Integrated Subsystems</p>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">Full Spectrum <span className="text-zinc-800">Control</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Cpu, name: 'Neural Engine', desc: 'State-of-the-art LLM optimization for narrative consistency and character voice.' },
              { icon: Clapperboard, name: 'Storyboard Synapse', desc: 'Real-time visual sequencing synchronized with your script timeline.' },
              { icon: Globe, name: 'Global Scale', desc: 'One-click localization and SEO optimization for maximum platform saturation.' },
              { icon: Zap, name: 'Instant Generation', desc: 'From spark to script in seconds. Zero latency creativity.' },
              { icon: Shield, name: 'Enterprise Grade', desc: 'Secured by biometric-level encryption and private archive protocols.' },
              { icon: Sparkles, name: 'Visual Fidelity', desc: 'High-res image synthesis tailored to your unique art style.' },
            ].map((feature, i) => (
              <motion.div 
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 hover:border-red-500/30 transition-all group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-red-600/10 transition-colors" />
                <feature.icon className="w-10 h-10 text-red-600 mb-8 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-2xl font-black uppercase italic tracking-tight text-white mb-4">{feature.name}</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-20 border-t border-white/5 bg-zinc-950 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg" />
              <span className="text-sm font-black tracking-[0.3em] uppercase italic">
                Anime Script <span className="text-red-500">Pro</span>
              </span>
            </div>
            <p className="text-zinc-600 max-w-sm text-sm font-medium leading-relaxed italic">
              Defying expectations. Redefining production. The future of anime storytelling starts here.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4">
              {['Studio', 'Features', 'API', 'Docs'].map(item => (
                <li key={item}>
                  <a href="#" className="text-xs text-zinc-500 hover:text-red-500 transition-colors uppercase tracking-widest font-bold">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              {['About', 'Discord', 'Twitter', 'Contact'].map(item => (
                <li key={item}>
                  <a href="#" className="text-xs text-zinc-500 hover:text-red-500 transition-colors uppercase tracking-widest font-bold">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 mt-20 flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">© 2026 NEXUS CREATIVE SYSTEMS. ALL RIGHTS RESERVED.</p>
           <div className="flex items-center gap-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest italic">All Systems Operational</p>
           </div>
        </div>
      </footer>
    </div>
  );
}
