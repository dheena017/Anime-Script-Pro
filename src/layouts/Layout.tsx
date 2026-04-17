import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { 
  ScrollText, 
  Bot, 
  UserPlus,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export function Layout() {
  const [user] = useAuthState(auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const handleLogin = async () => {
    if (isLoggingIn || user) return;
    
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      // Force select account to avoid some auto-login issues in iframes
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      // Handle user cancellation silently
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("User cancelled login popup.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log("Popup request cancelled by a newer request.");
      } else {
        console.error("Login error:", error);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex font-sans selection:bg-red-500/30">
      {/* Background Accents - High-End Noir */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.06)_0%,transparent_70%)] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03)_0%,transparent_70%)] blur-[120px] rounded-full" />
      </div>

      <Sidebar />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 relative z-10">
        <header className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50 h-20 flex items-center">
          <div className="w-full max-w-[1600px] mx-auto px-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                className="lg:hidden text-zinc-500 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="flex items-center gap-3">
                 <div className="hidden lg:block">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-0.5">Terminal Status</p>
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                       <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-300 italic">Neural Sync Active</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              {user ? (
                <div className="flex items-center gap-4 group">
                  <div className="text-right hidden sm:block">
                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-200 group-hover:text-red-500 transition-colors">{user.displayName || 'Creator'}</p>
                    <button 
                      onClick={() => auth.signOut()}
                      className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors mt-0.5"
                    >
                      Disconnect
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-1 bg-red-600/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="relative w-10 h-10 rounded-xl border border-white/10 p-0.5 bg-zinc-900 shadow-xl" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="relative w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
                        <UserPlus className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                   <button onClick={() => navigate('/login')} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Sign In</button>
                   <Button 
                    onClick={() => navigate('/register')}
                    className="h-10 px-6 rounded-xl bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest text-[10px] shadow-2xl"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="relative z-10 flex-1">
          <Outlet />
        </main>

        <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-xl py-10 mt-auto">
          <div className="w-full max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 italic">© 2026 NEXUS CREATIVE SYSTEMS</p>
               </div>
               <div className="h-4 w-px bg-white/5" />
               <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-700 font-mono">Archive Ver: 4.2.0-STABLE</p>
            </div>
            
            <div className="flex items-center gap-10">
              {['Security', 'Terminal Specs', 'Privacy', 'Neural Support'].map(link => (
                <a key={link} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-red-500 transition-colors italic">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
