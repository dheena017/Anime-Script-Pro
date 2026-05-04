import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Zap, Play, ArrowLeft, Sparkles, Lock } from 'lucide-react';
import { AuthCard } from './components/AuthCard.jsx';
import { LoginForm } from './components/LoginForm.jsx';
import { SocialLoginButton } from '@/pages/auth/components/SocialLoginButton.jsx';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import React, { useState } from 'react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

import { useAuth } from '@/hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showHeroPanel, setShowHeroPanel] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  React.useEffect(() => {
    setShowHeroPanel(window.innerWidth >= 1024);

    if (!loading && user) {
      const params = new URLSearchParams(location.search);
      const redirectPrompt = params.get('prompt');
      const redirectStyle = params.get('style');

      if (redirectPrompt && redirectStyle) {
        navigate(`/dashboard?prompt=${redirectPrompt}&style=${redirectStyle}`, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate, location.search]);

  return (
    <main
      className="min-h-screen bg-[#020203] flex items-center justify-center p-4 relative overflow-hidden font-sans"
      onMouseMove={handleMouseMove}
      style={{
        background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.05), transparent)`
      }}
    >
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-studio/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Back Button with Enhanced Styling */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05, x: -5 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/')}
        aria-label="Return to landing page"
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-zinc-500 hover:text-studio transition-colors group"
      >
        <div className="p-2 rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/50 group-hover:border-studio/50 group-hover:shadow-lg group-hover:shadow-studio/20 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Return to Base</span>
      </motion.button>



      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10"
      >
        {/* Left Side: Brand & Visual */}
        {showHeroPanel && (
          <div className="hidden lg:flex flex-col gap-8 pr-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-studio/10 to-purple-500/10 border border-studio/30 backdrop-blur-sm group hover:border-studio/50 transition-all cursor-pointer"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-studio to-studio-glow bg-clip-text text-transparent">System Online</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-7xl font-black italic tracking-tighter leading-[0.85] text-white"
              >
                STUDIO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-purple-500 to-studio animate-pulse">ARCHITECT.</span>
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-medium text-zinc-400 max-w-md"
              >
                Orchestrate your production <br />
                With neural-grade precision.
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="h-[1px] w-12 bg-gradient-to-r from-studio/30 to-transparent" />
                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">
                  Access Granted
                </p>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative group rounded-[2rem] overflow-hidden border border-zinc-800/50 bg-black/40 backdrop-blur-md p-1 shadow-2xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-studio/20 to-purple-500/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative aspect-video rounded-[1.8rem] overflow-hidden bg-zinc-900">
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/40 transition-all"
                  animate={{ backgroundColor: isHovered ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.4)" }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-studio/20 backdrop-blur-md flex items-center justify-center border border-studio/30 cursor-pointer"
                    whileHover={{ scale: 1.2, boxShadow: "0 0 30px rgba(6, 182, 212, 0.6)" }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Play className="w-6 h-6 text-studio fill-studio" />
                  </motion.div>
                </motion.div>
                <OptimizedImage
                  src="/shonen_battle_thumbnail_1776537245370.png"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                  alt="Production Preview"
                  fetchPriority="low"
                  width={800}
                  height={450}
                />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex gap-4 p-4 mt-2"
              >
                <div className="flex-1 space-y-2">
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-studio to-purple-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                      initial={{ width: "0%" }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] uppercase font-black tracking-widest text-zinc-500">
                    <span>Engine Warmup</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio to-studio-glow">65% READY</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* Right Side: Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center justify-between lg:hidden mb-4">
            <span className="text-xl font-black tracking-tighter uppercase text-white">
              AnimeScript <span className="text-studio">Pro</span>
            </span>
          </div>

          <AuthCard
            title="USER LOGIN"
            description="Access the God Mode production suite"
          >
            <LoginForm />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="relative my-8"
            >
              <div className="absolute inset-0 flex items-center">
                <motion.div
                  className="w-full border-t border-zinc-800"
                  animate={{
                    backgroundImage: [
                      "linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent)",
                      "linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                <span className="bg-[#0A0A0B] px-4 text-zinc-600 flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Secure Login Authorization
                  <Lock className="w-3 h-3" />
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <SocialLoginButton icon={GithubIcon}>GitHub</SocialLoginButton>
              <SocialLoginButton icon={() => (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.34-2.04 4.52-1.28 1.28-3.26 2.42-6.52 2.42-5.14 0-9.28-4.14-9.28-9.28s4.14-9.28 9.28-9.28c2.8 0 4.94 1.1 6.46 2.52l2.32-2.32c-2.02-1.92-4.9-3.48-8.78-3.48-6.62 0-12 5.38-12 12s5.38 12 12 12c3.58 0 6.3-1.18 8.44-3.4 2.22-2.22 2.92-5.32 2.92-7.82 0-.54-.04-1.04-.12-1.54h-11.24z" />
                </svg>
              )}>Google</SocialLoginButton>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-8 text-center text-xs text-zinc-500 font-medium"
            >
              Don't have an account?{' '}
              <motion.button
                onClick={() => navigate('/register')}
                className="text-studio hover:text-studio-glow font-bold transition-colors inline-flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Account
                <Sparkles className="w-3 h-3" />
              </motion.button>
            </motion.p>
          </AuthCard>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex items-center justify-center gap-6"
          >
            <motion.div
              className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-zinc-600"
              whileHover={{ color: "#06B6D4" }}
            >
              <ShieldCheck className="w-3 h-3 text-studio" />
              <span>Encrypted</span>
            </motion.div>
            <div className="w-[1px] h-3 bg-zinc-700" />
            <motion.div
              className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-zinc-600"
              whileHover={{ color: "#EAB308" }}
            >
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>Fast Lane</span>
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center text-[9px] uppercase tracking-[0.3em] font-black text-zinc-700"
          >
            Studio Architect v2.0
          </motion.p>
        </motion.div>
      </motion.div>
    </main>
  );
}

