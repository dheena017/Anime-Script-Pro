import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sparkles, TriangleAlert } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#03050a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_30%),linear-gradient(180deg,rgba(2,6,23,1),rgba(3,5,10,1))]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-cyan-500/15 bg-white/5 p-8 shadow-[0_0_120px_rgba(6,182,212,0.08)] backdrop-blur-2xl md:p-12"
        >
          <div className="absolute -left-24 -top-24 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-8 flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/10"
            >
              <TriangleAlert className="h-9 w-9 text-cyan-300" />
            </motion.div>

            <p className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-cyan-300/70">
              System Node Not Found
            </p>

            <h1 className="bg-gradient-to-b from-white via-cyan-100 to-cyan-300 bg-clip-text text-4xl font-black tracking-tighter text-transparent md:text-4xl">
              404
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-300 md:text-base">
              The sector you are trying to access does not exist. Check the path, or return to the dashboard to continue navigating the Meta-OS.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-cyan-200 transition-colors hover:bg-cyan-400/15"
              >
                <Home className="h-4 w-4" />
                Return to Dashboard
              </motion.button>

              <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black/30 px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-zinc-400">
                <Sparkles className="h-4 w-4 text-fuchsia-400" />
                Meta-OS Recovery Mode
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
