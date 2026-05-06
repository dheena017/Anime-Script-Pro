import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Terminal,
  Cpu,
  Globe,
  Lock,
  ArrowRight,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  ShieldAlert,
  MailCheck
} from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const prompt = params.get('prompt');
  const style = params.get('style');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const Fallback = () => (
    <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-pulse">
      <div className="w-12 h-12 border-2 border-zinc-800 border-t-[#bd4a4a] rounded-full animate-spin" />
      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Synchronizing with Matrix...</p>
    </div>
  );

  const getErrorMessage = (err: any) => {
    const message = err.message?.toLowerCase() || '';
    if (message.includes('invalid login credentials')) return 'Authentication Failed: Invalid Node Identity or Key.';
    if (message.includes('email not confirmed')) return 'Access Denied: Please verify your email first.';
    if (message.includes('user already registered')) return 'Identity Conflict: This node is already registered in the matrix.';
    if (message.includes('password is too short')) return 'Security Violation: Cryptographic key must be at least 6 characters.';
    return err.message || 'Something went wrong. Please try again.';
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('System Requirement: All identification fields must be populated.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ 
          email: trimmedEmail, 
          password: trimmedPassword 
        });
        if (signInError) throw signInError;

        if (prompt) {
          navigate('/dashboard', { state: { prompt, style } });
        } else {
          navigate('/dashboard');
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ 
          email: trimmedEmail, 
          password: trimmedPassword 
        });
        if (signUpError) throw signUpError;
        setSuccess(true);
      }
    } catch (err: any) {
      console.error('[AUTH_ERROR]', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#020203] overflow-hidden p-4 font-sans">
      {/* 1. LAYERED DEPTH BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#bd4a4a]/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-950/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(189,74,74,0.03)_50%,transparent_100%)] bg-[length:100%_20px] animate-[scan_8s_linear_infinite] opacity-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noiseFilter%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.65%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.15] brightness-50 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020203_100%)]" />
      </div>

      {/* 2. MAIN CONSOLE CONTAINER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <Card className="bg-black/40 border-zinc-800/50 backdrop-blur-md shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#bd4a4a] to-transparent shadow-[0_0_15px_rgba(189,74,74,0.8)]" />

          <CardHeader className="space-y-6 pb-8 pt-10 text-center relative">
            <motion.div
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1, type: 'spring' }}
              className="mx-auto w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-[0_0_30px_rgba(189,74,74,0.1)] relative group"
            >
              <div className="absolute inset-0 bg-[#bd4a4a]/5 rounded-3xl animate-ping group-hover:animate-none opacity-50" />
              <Cpu className="h-10 w-10 text-[#bd4a4a] drop-shadow-[0_0_10px_rgba(189,74,74,0.4)]" />
            </motion.div>

            <div className="space-y-2">
              <CardTitle className="text-4xl font-black tracking-tighter text-white uppercase italic">
                {mode === 'signin' ? 'Access' : 'Registration'} <span className="text-[#bd4a4a]">Portal</span>
              </CardTitle>
              <div className="flex items-center justify-center gap-2">
                <span className="h-[1px] w-8 bg-zinc-800" />
                <CardDescription className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">
                  {mode === 'signin' ? 'Secure Login' : 'Setup your account'}
                  With high precision.
                </CardDescription>
                <span className="h-[1px] w-8 bg-zinc-800" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 px-10 pb-12">
            <React.Suspense fallback={<Fallback />}>
              <AnimatePresence mode="wait">
                {success ? (
                <motion.div
                  key="success-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-center py-4"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <MailCheck className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">Email Sent</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Verification email sent to your inbox. <br />
                      Confirm the link to activate your account.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => { setSuccess(false); setMode('signin'); }}
                    className="w-full border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white uppercase font-black tracking-widest h-12 rounded-xl"
                  >
                    Return to Login
                  </Button>
                </motion.div>
              ) : (
                <motion.form 
                  key="auth-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleAuth} 
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black">Node Identity</Label>
                      <Terminal className="w-3 h-3 text-zinc-700" />
                    </div>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        placeholder="shogun@architect.pro"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="h-14 bg-zinc-900/50 border-zinc-800/80 focus:border-[#bd4a4a]/50 focus:ring-0 transition-all rounded-2xl pl-12 text-zinc-200 placeholder:text-zinc-700 font-medium"
                      />
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#bd4a4a] transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black">Cryptographic Key</Label>
                      {mode === 'signin' && <span className="text-[9px] uppercase font-bold text-zinc-700 hover:text-[#bd4a4a] cursor-pointer transition-colors">Lost Key?</span>}
                    </div>
                    <div className="relative group">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        placeholder="••••••••"
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="h-14 bg-zinc-900/50 border-zinc-800/80 focus:border-[#bd4a4a]/50 focus:ring-0 transition-all rounded-2xl pl-12 pr-12 text-zinc-200 placeholder:text-zinc-700 font-medium"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#bd4a4a] transition-colors" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-start gap-3"
                      >
                        <ShieldAlert className="w-4 h-4 flex-shrink-0 animate-pulse" />
                        <span className="leading-relaxed">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#bd4a4a] hover:bg-[#d45555] text-white font-black uppercase tracking-[0.2em] h-14 rounded-2xl shadow-[0_10px_30px_rgba(189,74,74,0.2)] transition-all active:scale-[0.98] group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {mode === 'signin' ? 'Log In' : 'Create Account'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </React.Suspense>

            {!success && (
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  disabled={loading}
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setError('');
                  }}
                  className="h-12 border-zinc-800/50 bg-black/20 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  {mode === 'signin' ? <UserPlus className="mr-2 h-4 w-4 text-[#bd4a4a]" /> : <LogIn className="mr-2 h-4 w-4 text-[#bd4a4a]" />}
                  {mode === 'signin' ? 'Create New Node' : 'Existing Node Login'}
                </Button>
              </div>
            )}

            <p className="text-center text-[10px] text-zinc-700 font-bold uppercase tracking-widest">
              By accessing you agree to the <span className="text-zinc-500 hover:text-white cursor-pointer">Protocol Terms</span>
            </p>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex items-center justify-between px-6"
        >
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-800">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
              <span>Asia-South-1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
              <span>Supabase Auth</span>
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-800">
            Studio Pro v2.04
          </p>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
      `}</style>
    </div>
  );
}




