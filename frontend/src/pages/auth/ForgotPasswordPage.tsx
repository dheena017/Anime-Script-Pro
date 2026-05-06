import { motion } from 'framer-motion';
import { ShieldCheck, Zap, ArrowLeft } from 'lucide-react';
import { AuthCard } from './components/AuthCard.jsx';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { useNavigate } from 'react-router-dom';

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#020203] flex items-center justify-center p-4 relative overflow-hidden font-sans">
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

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05, x: -5 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate('/login')}
        aria-label="Return to login"
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-zinc-500 hover:text-studio transition-colors group"
      >
        <div className="p-2 rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/50 group-hover:border-studio/50 group-hover:shadow-lg group-hover:shadow-studio/20 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Back to Login</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AuthCard title="Account Recovery" description="Protocol Alpha / Identity Restoration">
            <ForgotPasswordForm />
          </AuthCard>
        </motion.div>

        {/* Footer Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-center justify-between px-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 group"
        >
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">
            <motion.div
              className="flex items-center gap-1.5 group-hover:text-studio transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <ShieldCheck className="w-3 h-3 text-studio" />
              <span>Encrypted</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1.5 group-hover:text-yellow-500 transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>Fast Lane</span>
            </motion.div>
          </div>
          <motion.p
            className="text-[9px] uppercase tracking-[0.3em] font-black text-zinc-600"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Studio Architect v2.0
          </motion.p>
        </motion.div>
      </motion.div>
    </main>
  );
}

