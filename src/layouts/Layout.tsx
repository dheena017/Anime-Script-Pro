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
      {/* Background Accents - Atmospheric */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.08)_0%,transparent_70%)] blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0%,transparent_70%)] blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.03)_0%,transparent_70%)] blur-[80px] rounded-full mix-blend-screen" />
      </div>

      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="relative z-20 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden text-zinc-400 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
              <div className="lg:hidden flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                  <ScrollText className="text-white w-4 h-4" />
                </div>
                <span className="font-bold tracking-widest text-xs uppercase">Creator Studio <span className="text-red-500">Pro</span></span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-medium text-zinc-200">{user.displayName}</p>
                    <button 
                      onClick={() => auth.signOut()}
                      className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-zinc-800" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-zinc-400" />
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-white rounded-full animate-spin mr-2" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  {isLoggingIn ? 'Signing in...' : 'Sign In'}
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto">
          <Outlet />
        </main>

        <footer className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-md py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-zinc-500 text-xs tracking-widest uppercase font-medium">
              © 2026 Creator Studio Pro. Built for creators.
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs tracking-widest uppercase font-medium">Terms</a>
              <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs tracking-widest uppercase font-medium">Privacy</a>
              <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs tracking-widest uppercase font-medium">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
