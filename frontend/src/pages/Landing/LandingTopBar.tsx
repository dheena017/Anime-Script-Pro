import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Menu, 
  X, 
  ChevronRight, 
  Activity, 
  ShieldCheck, 
  LayoutGrid,
  ArrowRight,
  LifeBuoy,
  Mail,
  BookOpen,
  Video,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { NavItem, DropdownLink } from './ui/NavComponents';

export const LandingTopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll detection protocol (optimized with threshold check)
  useEffect(() => {
    let ticking = false;
    const threshold = 20;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          const isOverThreshold = window.scrollY > threshold;
          setIsScrolled(prev => {
            if (prev !== isOverThreshold) return isOverThreshold;
            return prev;
          });
          ticking = false;
        });
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const toggleMenu = (menu: string) => setActiveMenu(activeMenu === menu ? null : menu);

  const navLinks = [
    { label: 'Community', href: '/community' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Tutorials', href: '/tutorials' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-[background-color,padding] duration-300 transform-gpu will-change-transform",
        isScrolled 
          ? "bg-black border-b border-white/5 pt-0 px-0" 
          : "pt-8 px-6 bg-transparent"
      )}
    >
      <nav 
        className={cn(
          "max-w-7xl mx-auto transition-[height] duration-300 flex items-center justify-between px-8",
          isScrolled ? "h-16" : "h-20 rounded-[2rem] border border-transparent bg-transparent"
        )}
      >
        {/* 1. BRAND TERMINAL */}
        <div className="flex items-center gap-12">
          <a 
            href="/" 
            className="flex items-center gap-3 no-underline group"
          >
            <div className="w-9 h-9 rounded-xl bg-studio flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform">
               <Zap className="w-5 h-5 text-black fill-black" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-white italic">
              ANIME<span className="text-studio">SCRIPT</span> PRO
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-2">
            <NavItem label="Support" isOpen={activeMenu === 'support'} onClick={() => toggleMenu('support')}>
              <DropdownLink icon={LifeBuoy} title="Contact support" description="Get help from our technical specialists." href="#" />
              <DropdownLink icon={Mail} title="Email us" description="Direct line to our support inbox." href="mailto:support@animescript.pro" />
            </NavItem>

            <NavItem label="Tutorials" isOpen={activeMenu === 'tutorials'} onClick={() => toggleMenu('tutorials')}>
              <DropdownLink icon={BookOpen} title="Learn" description="Master the God Mode engine mechanics." href="/tutorials" />
              <DropdownLink icon={Video} title="Youtube Channel" description="Visual guides and production workflows." href="https://youtube.com" />
              <DropdownLink icon={Globe} title="Instagram Inspiration" description="Daily art and narrative snippets." href="https://instagram.com" />
            </NavItem>

            <a
              href="/community"
              className={cn(
                "px-5 py-2 text-xs font-black uppercase tracking-[0.2em] transition-colors no-underline",
                location.pathname === '/community' ? "text-studio" : "text-zinc-500 hover:text-white"
              )}
            >
              Community
            </a>
            <a
              href="/pricing"
              className={cn(
                "px-5 py-2 text-xs font-black uppercase tracking-[0.2em] transition-colors no-underline",
                location.pathname === '/pricing' ? "text-studio" : "text-zinc-500 hover:text-white"
              )}
            >
              Pricing
            </a>
          </div>
        </div>

        {/* 3. SYSTEM TELEMETRY & ACTIONS */}
        <div className="flex items-center gap-6">
          {/* System Health Pulse */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5">
             <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-40" />
             </div>
             <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Node-01 Online</span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-studio/10 border border-studio/30 text-studio hover:bg-studio hover:text-black font-black uppercase tracking-[0.2em] text-xs rounded-full px-8 h-11 transition-all flex items-center gap-2"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Command Center
              </Button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors hidden sm:block"
                >
                  Access Terminal
                </button>
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-white text-black hover:bg-studio hover:text-black font-black uppercase tracking-[0.2em] text-xs rounded-full px-8 h-11 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
                >
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
            
            <button
              className="lg:hidden p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE OVERLAY PROTOCOL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="lg:hidden mt-4 rounded-3xl border border-white/5 bg-black/90 backdrop-blur-2xl px-8 py-10 space-y-8 shadow-3xl overflow-hidden relative"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-studio/10 blur-3xl rounded-full" />
            
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group no-underline"
                >
                  <span className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors">
                    {link.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-studio transition-colors" />
                </a>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
               <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <Activity className="w-4 h-4 text-studio" />
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Global Load: Minimal</span>
               </div>
               <Button 
                onClick={() => navigate('/login')} 
                className="w-full h-16 bg-studio text-black font-black uppercase tracking-[0.2em] rounded-2xl text-xs flex items-center justify-center gap-3"
               >
                 Initialize Production <ShieldCheck className="w-4 h-4" />
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default LandingTopBar;


