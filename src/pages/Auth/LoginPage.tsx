import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ScrollText, 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/studio/script');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/studio/script');
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 selection:bg-red-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-zinc-900/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-zinc-950 border border-white/5 rounded-[40px] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex w-14 h-14 bg-red-600 rounded-2xl items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)] mb-2">
              <ScrollText className="text-white w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">Initialize Session</h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Access Neural Production Terminal</p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Authentication ID</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-red-500 transition-colors" />
                <Input 
                  type="email" 
                  placeholder="name@domain.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/40 border-zinc-900 focus:border-red-500/50 h-14 pl-12 rounded-2xl text-sm placeholder:text-zinc-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-red-500 transition-colors" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/40 border-zinc-900 focus:border-red-500/50 h-14 pl-12 rounded-2xl text-sm placeholder:text-zinc-800"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-600/10 border border-red-500/20 flex items-start gap-3 text-red-500 text-[11px] font-bold leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-xl"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-zinc-700 border-t-black rounded-full animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  Establish Connection
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-black text-zinc-700"><span className="bg-zinc-950 px-4 italic">Neural Bridge</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="h-14 rounded-2xl border-zinc-900 bg-black/20 text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button>
            <Button 
              variant="outline" 
              className="h-14 rounded-2xl border-zinc-900 bg-black/20 text-zinc-400 hover:text-white hover:bg-zinc-900"
              disabled={isLoading}
            >
              <Github className="w-4 h-4 mr-2" />
              Github
            </Button>
          </div>

          <p className="text-center mt-10 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            New here? <Link to="/register" className="text-red-500 hover:underline">Request Access</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
