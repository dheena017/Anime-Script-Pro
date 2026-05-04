import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   User,
   LogOut,
   Calendar,
   Save,
   Loader2,
   Camera,
   AtSign,
   Grid,
   BookOpen,
   Users,
   Command,
   Lock,
   Zap,
   Trophy,
   Activity,
   CheckCircle2,
   AlertCircle,
   Cpu,
   ShieldCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { StudioLoading } from '@/pages/studio/components/studio/StudioLoading';
import { ProfileVault } from '@/pages/profile/ProfileVault';
import { ProfileLibrary } from '@/pages/profile/ProfileLibrary';
import { ProfileSettings } from '@/pages/profile/ProfileSettings';
import { ProfileSecurity } from '@/pages/profile/ProfileSecurity';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';


// Custom GitHub Icon SVG since Lucide-react doesn't include brand icons

export function ProfilePage() {
   const { user, loading: authLoading, signOut } = useAuth();
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
   const [, setErrorMsg] = useState<string | null>(null);
   const [activeTab, setActiveTab] = useState<'vault' | 'library' | 'config' | 'security'>('vault');

   // Dialog States
   const [showPromptModal, setShowPromptModal] = useState(false);
   const [showDNAModal, setShowDNAModal] = useState(false);
   const [newPrompt, setNewPrompt] = useState({ label: '', text: '' });
   const [newDNA, setNewDNA] = useState({ name: '', prompt: '', seed: 12345 });

   // Profile State
   const [displayName, setDisplayName] = useState('');
   const [handle, setHandle] = useState('');
   const [bio, setBio] = useState('');
   const [avatarUrl, setAvatarUrl] = useState('');
   const [bannerUrl, setBannerUrl] = useState('');
   const [joinDate, setJoinDate] = useState('');

   // Library State
   const [savedPrompts, setSavedPrompts] = useState<any[]>([]);
   const [characters, setCharacters] = useState<any[]>([]);
   const [generations, setGenerations] = useState<any[]>([]);
   const [favorites, setFavorites] = useState<any[]>([]);

   // Config & Security State
   const [aspectRatio, setAspectRatio] = useState('16:9');
   const [defaultModelStyle, setDefaultModelStyle] = useState('Shonen');
   const [theme, setTheme] = useState<'dark' | 'light'>('dark');
   const [emailAlerts, setEmailAlerts] = useState({ upscale: true, generation: false, security: true });

   // Stats
   const [credits, setCredits] = useState(0);
   const [tier, setTier] = useState('Free');
   const [level, setLevel] = useState(1);
   const [experience, setExperience] = useState(0);

   useEffect(() => {
      const fetchEverything = async () => {
         if (!user) {
            if (!authLoading) setLoading(false);
            return;
         }

         setLoading(true);
         setErrorMsg(null);

         const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
         const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

         try {
            const [profileRes, balanceRes, assetsRes, favRes, promptsRes, charsRes, settingsRes] = await Promise.all([
               fetch(`/api/profiles/${user.id}`, { headers }),
               fetch(`/api/balances/${user.id}`, { headers }),
               fetch(`/api/assets/${user.id}`, { headers }),
               fetch(`/api/favorites/${user.id}`, { headers }),
               fetch(`/api/library/prompts/${user.id}`, { headers }),
               fetch(`/api/library/characters/${user.id}`, { headers }),
               fetch(`/api/settings/${user.id}`, { headers })
            ]);

            if (!profileRes.ok) throw new Error("Profile information unavailable.");

            const profile = await profileRes.json();
            const balance = await balanceRes.json();
            const settings = await settingsRes.json();

            setDisplayName(profile.display_name || 'Architect');
            setHandle(profile.handle || `user_${user.id.slice(0, 5)}`);
            setBio(profile.bio || 'Creating amazing stories.');
            setAvatarUrl(profile.avatar_url || '');
            setBannerUrl(profile.banner_url || '');
            setJoinDate(new Date(profile.join_date || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

            setCredits(balance.credits || 0);
            setTier(balance.current_tier || 'Free');
            setLevel(balance.level || 1);
            setExperience(balance.experience || 0);

            setGenerations(await assetsRes.json() || []);
            setFavorites(await favRes.json() || []);
            setSavedPrompts(await promptsRes.json() || []);
            setCharacters(await charsRes.json() || []);

            if (settings.studio_defaults) {
               setAspectRatio(settings.studio_defaults.aspectRatio || '16:9');
               setDefaultModelStyle(settings.studio_defaults.defaultModelStyle || 'Shonen');
               setTheme(settings.studio_defaults.theme || 'dark');
            }
            if (settings.notifications) {
               setEmailAlerts(settings.notifications.email || { upscale: true, generation: false, security: true });
            }

         } catch (error: any) {
            console.error("Dossier retrieval failure:", error);
            setErrorMsg(error.message || "Failed to establish secure link to dossier vault.");
         } finally {
            setLoading(false);
         }
      };

      fetchEverything();
   }, [user]);

   const handleSave = async () => {
      if (!user) return;
      setSaving(true);
      setSyncStatus('idle');
      setErrorMsg(null);

      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const headers: HeadersInit = {
         'Content-Type': 'application/json',
         ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      try {
         const profileUpdate = await fetch(`/api/profiles/${user.id}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ display_name: displayName, handle, bio, avatar_url: avatarUrl, banner_url: bannerUrl })
         });

         const settingsUpdate = await fetch(`/api/settings/${user.id}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
               studio_defaults: { aspectRatio, defaultModelStyle, theme },
               notifications: { email: emailAlerts }
            })
         });

         if (profileUpdate.ok && settingsUpdate.ok) {
            setSyncStatus('success');
            setTimeout(() => setSyncStatus('idle'), 3000);
         } else {
            throw new Error("Authorization refused. Sync failed.");
         }
      } catch (err: any) {
         setSyncStatus('error');
         setErrorMsg(err.message || "Dossier sync failure.");
      } finally {
         setSaving(false);
      }
   };

   const addPrompt = async () => {
      if (!user || !newPrompt.label) return;
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch(`/api/library/prompts`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
         },
         body: JSON.stringify({ ...newPrompt, user_id: user.id, prompt_text: newPrompt.text })
      });
      if (res.ok) {
         const saved = await res.json();
         setSavedPrompts([...savedPrompts, saved]);
         setShowPromptModal(false);
         setNewPrompt({ label: '', text: '' });
      }
   };

   const addDNA = async () => {
      if (!user || !newDNA.name) return;
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch(`/api/library/characters`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
         },
         body: JSON.stringify({ ...newDNA, user_id: user.id, visual_prompt: newDNA.prompt })
      });
      if (res.ok) {
         const saved = await res.json();
         setCharacters([...characters, saved]);
         setShowDNAModal(false);
         setNewDNA({ name: '', prompt: '', seed: 12345 });
      }
   };

   const toggleTheme = (newTheme: 'dark' | 'light') => {
      setTheme(newTheme);
      if (newTheme === 'dark') {
         document.documentElement.classList.add('dark');
      } else {
         document.documentElement.classList.remove('dark');
      }
   };

   if (authLoading || (user && loading)) {
      return <StudioLoading message="Loading your profile..." submessage="Getting your personal details ready..." />;
   }



   const tabs = [
      { id: 'vault', label: 'Vault', icon: Grid },
      { id: 'library', label: 'Library', icon: BookOpen },
      { id: 'config', label: 'Directives', icon: Command },
      { id: 'security', label: 'Security', icon: Lock }
   ];



   return (
      <div className={`max-w-[1400px] mx-auto space-y-12 pb-32 font-sans select-none ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-zinc-50 text-black'}`}>
         {/* 1. ARCHITECT HEADER SECTION */}
         <div className="relative rounded-[3rem] overflow-hidden border border-white/5 bg-black/40 backdrop-blur-xl shadow-3xl group/hero">
            <div className="relative min-h-[450px] md:h-[580px] flex flex-col">
               {bannerUrl ? (
                  <img src={bannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover/hero:scale-105 transition-transform duration-10000" alt="Banner" />
               ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-900 via-studio/10 to-fuchsia-500/10" />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

               <div className="relative z-10 mt-auto p-8 md:p-16 flex flex-col md:flex-row items-start md:items-end gap-10 w-full">
                  <div className="relative group/avatar shrink-0">
                     <div className="w-32 h-32 md:w-56 md:h-56 rounded-[2.5rem] bg-zinc-950 border-[6px] border-zinc-950 shadow-2xl overflow-hidden">
                        {avatarUrl ? (
                           <img src={avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                              <User className="w-16 h-16 text-zinc-800" />
                           </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer gap-2">
                           <Camera className="w-8 h-8 text-white" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-white">Upload DNA</span>
                        </div>
                     </div>
                     <div className="absolute -bottom-4 -right-4 p-4 rounded-3xl bg-studio shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-white/20">
                        <ShieldCheck className="w-6 h-6 text-white" />
                     </div>
                  </div>

                  <div className="flex-1 space-y-6 w-full">
                     <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-4">
                           <input
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              className="bg-transparent border-none p-0 h-auto text-4xl md:text-7xl font-black tracking-tighter text-white uppercase italic focus:outline-none w-full max-w-2xl"
                              placeholder="ARCHITECT NAME"
                           />
                           <div className="flex gap-3">
                              <div className="px-4 py-1.5 bg-studio/20 border border-studio/30 text-studio text-[10px] font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-md">{tier} PROTOCOL</div>
                              <div className="px-4 py-1.5 bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-md">
                                 {credits.toLocaleString()} CREDITS
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 group-hover/hero:translate-x-1 transition-transform">
                           <AtSign className="w-4 h-4 text-studio" />
                           <input
                              value={handle}
                              onChange={(e) => setHandle(e.target.value)}
                              className="bg-transparent border-none p-0 text-sm font-bold text-zinc-500 focus:outline-none lowercase tracking-[0.3em]"
                              placeholder="handle"
                           />
                        </div>
                     </div>

                     <div className="max-w-2xl">
                        <textarea
                           value={bio}
                           onChange={(e) => setBio(e.target.value)}
                           className="bg-transparent border-none p-0 w-full text-zinc-400 text-sm font-medium focus:outline-none resize-none italic leading-relaxed"
                           placeholder="Define your architectural mission statement..."
                           rows={2}
                        />
                     </div>

                     <div className="flex flex-wrap items-center gap-8 pt-4">
                        <div className="space-y-3 min-w-[280px]">
                           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                              <div className="flex items-center gap-2">
                                 <Cpu className="w-3 h-3 text-studio" />
                                 <span>Experience Level {level}</span>
                              </div>
                              <span>{experience.toLocaleString()} / {(level * 2000).toLocaleString()} XP</span>
                           </div>
                           <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                              <motion.div
                                 initial={{ width: 0 }}
                                 animate={{ width: `${Math.min((experience / (level * 2000)) * 100, 100)}%` }}
                                 className="h-full bg-gradient-to-r from-studio to-fuchsia-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                              />
                           </div>
                        </div>
                        <div className="flex items-center gap-3 py-2 px-5 bg-white/5 border border-white/10 rounded-2xl">
                           <Calendar className="w-4 h-4 text-studio" />
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Node Activated {joinDate}</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
                     <Button
                        onClick={handleSave}
                        disabled={saving}
                        className={cn(
                           "h-20 px-12 rounded-3xl font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 text-xs",
                           syncStatus === 'success' ? "bg-emerald-500 hover:bg-emerald-600" :
                              syncStatus === 'error' ? "bg-red-500 hover:bg-red-600" : "bg-studio hover:bg-studio/80"
                        )}
                     >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> :
                           syncStatus === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                              syncStatus === 'error' ? <AlertCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                        {syncStatus === 'success' ? 'Synchronized' : syncStatus === 'error' ? 'Sync Refused' : 'Sync Dossier'}
                     </Button>
                     <Button
                        onClick={signOut}
                        variant="ghost"
                        className="h-14 rounded-2xl font-black uppercase tracking-widest text-zinc-600 hover:text-white hover:bg-white/5 transition-colors text-[10px]"
                     >
                        <LogOut className="w-3.5 h-3.5 mr-2" /> Deactivate Link
                     </Button>
                  </div>
               </div>
            </div>
         </div>

         {/* 2. TELEMETRY & ACHIEVEMENTS */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* LEFT: ACTIVITY & ACHIEVEMENTS */}
            <div className="lg:col-span-8 space-y-12">

               {/* ACTIVITY TELEMETRY */}
               <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                     <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-studio" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">System Activity</h2>
                     </div>
                     <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Last 12 Solar Cycles</span>
                  </div>
                  <Card className="glass p-10 rounded-[3rem] border-white/5 flex gap-2 justify-between">
                     {Array.from({ length: 48 }).map((_, i) => (
                        <div
                           key={i}
                           className={cn(
                              "w-3 h-12 rounded-full transition-all hover:scale-y-125 cursor-pointer",
                              i % 7 === 0 ? "bg-studio shadow-[0_0_10px_rgba(6,182,212,0.5)]" :
                                 i % 3 === 0 ? "bg-studio/40" : "bg-zinc-900"
                           )}
                           title={`${i + 1} transmissions detected`}
                        />
                     ))}
                  </Card>
               </div>

               {/* TAB NAVIGATION */}
               <div className="flex justify-center">
                  <div className="flex bg-zinc-900/50 p-2 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                     {tabs.map((tab) => (
                        <button
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id as any)}
                           className={cn(
                              "flex items-center gap-3 px-8 py-4 rounded-[2rem] transition-all relative",
                              activeTab === tab.id ? "text-white" : "text-zinc-600 hover:text-zinc-400"
                           )}
                        >
                           {activeTab === tab.id && (
                              <motion.div layoutId="profile-tab" className="absolute inset-0 bg-white/5 border border-white/10 rounded-[2rem]" />
                           )}
                           <tab.icon className={cn("w-4 h-4 relative z-10", activeTab === tab.id && "text-studio")} />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{tab.label}</span>
                        </button>
                     ))}
                  </div>
               </div>

               {/* TAB CONTENT */}
               <div className="min-h-[600px]">
                  <AnimatePresence mode="wait">
                     <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                     >
                        {activeTab === 'vault' && <ProfileVault generations={generations} favorites={favorites} />}
                        {activeTab === 'library' && (
                           <ProfileLibrary
                              savedPrompts={savedPrompts}
                              characters={characters}
                              onAddPrompt={() => setShowPromptModal(true)}
                              onAddDNA={() => setShowDNAModal(true)}
                           />
                        )}
                        {activeTab === 'config' && (
                           <ProfileSettings
                              aspectRatio={aspectRatio}
                              setAspectRatio={setAspectRatio}
                              theme={theme}
                              toggleTheme={toggleTheme}
                              emailAlerts={emailAlerts}
                              setEmailAlerts={setEmailAlerts}
                           />
                        )}
                        {activeTab === 'security' && <ProfileSecurity onDeactivate={signOut} />}
                     </motion.div>
                  </AnimatePresence>
               </div>
            </div>

            {/* RIGHT: ACHIEVEMENT SHELF & STATUS */}
            <div className="lg:col-span-4 space-y-12">

               {/* ACHIEVEMENT SHELF */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                     <Trophy className="w-5 h-5 text-fuchsia-500" />
                     <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Achievement Shelf</h2>
                  </div>
                  <Card className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
                     {[
                        { title: 'Early Adopter', desc: 'First 10 creations', icon: Zap, color: 'text-studio', bg: 'bg-studio/10' },
                        { title: 'Master Architect', desc: 'Lvl 10 achieved', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                        { title: 'Data Weaver', desc: '50 assets archived', icon: Command, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
                     ].map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-6 group cursor-help">
                           <div className={cn("p-4 rounded-2xl transition-all group-hover:scale-110", badge.bg, badge.color)}>
                              <badge.icon className="w-6 h-6" />
                           </div>
                           <div className="space-y-1">
                              <h4 className="text-sm font-bold text-white uppercase tracking-tight">{badge.title}</h4>
                              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{badge.desc}</p>
                           </div>
                        </div>
                     ))}
                     <Button variant="outline" className="w-full border-zinc-800 rounded-2xl h-12 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">
                        View All Achievements
                     </Button>
                  </Card>
               </div>

               {/* NODE INTEGRITY */}
               <Card className="glass p-10 rounded-[3rem] border-white/5 bg-gradient-to-br from-studio/5 to-transparent">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-8">Node Integrity Monitor</h3>
                  <div className="space-y-8">
                     <div className="flex flex-col items-center justify-center p-10 rounded-full border-[8px] border-zinc-900 w-48 h-48 mx-auto relative">
                        <div className="absolute inset-0 rounded-full border-[8px] border-studio border-t-transparent animate-spin-slow opacity-20" />
                        <span className="text-5xl font-black text-white italic tracking-tighter">88%</span>
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Optimized</span>
                     </div>
                     <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest text-center leading-relaxed">
                        Identity node is performing at peak efficiency. Complete dossier setup for 100% sync.
                     </p>
                  </div>
               </Card>
            </div>
         </div>

         {/* 3. MODALS */}
         <Dialog open={showPromptModal} onOpenChange={setShowPromptModal}>
            <DialogContent className="bg-[#0a0a0b] border-white/5 rounded-[3rem] p-12 max-w-xl text-white shadow-3xl">
               <DialogHeader className="space-y-4">
                  <DialogTitle className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                     <Command className="w-8 h-8 text-studio" /> Forge Blueprint
                  </DialogTitle>
                  <DialogDescription className="text-xs font-black text-zinc-600 uppercase tracking-widest">Initialize a reusable project template.</DialogDescription>
               </DialogHeader>
               <div className="space-y-8 py-10">
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Protocol Name</Label>
                     <Input value={newPrompt.label} onChange={(e) => setNewPrompt({ ...newPrompt, label: e.target.value })} className="bg-zinc-900 border-zinc-800 rounded-2xl h-16 text-white font-bold px-6" placeholder="CYBERPUNK_NOIR_01" />
                  </div>
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Directives (AI Text)</Label>
                     <textarea value={newPrompt.text} onChange={(e) => setNewPrompt({ ...newPrompt, text: e.target.value })} className="w-full bg-zinc-900 border-zinc-800 rounded-[2rem] p-8 text-white font-medium text-sm min-h-[180px] focus:outline-none focus:border-studio/50 transition-all" placeholder="Enter production directives..." />
                  </div>
               </div>
               <DialogFooter>
                  <Button onClick={addPrompt} className="w-full h-20 bg-studio text-white font-black uppercase tracking-[0.4em] text-xs rounded-[2rem] shadow-2xl hover:bg-studio/80">Authorize Protocol</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         <Dialog open={showDNAModal} onOpenChange={setShowDNAModal}>
            <DialogContent className="bg-[#0a0a0b] border-white/5 rounded-[4rem] p-12 max-w-2xl text-white shadow-3xl">
               <DialogHeader className="space-y-4">
                  <DialogTitle className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                     <Users className="w-8 h-8 text-fuchsia-500" /> DNA Sequencing
                  </DialogTitle>
                  <DialogDescription className="text-xs font-black text-zinc-600 uppercase tracking-widest">Establish visual consistency for recurring cast members.</DialogDescription>
               </DialogHeader>
               <div className="grid grid-cols-2 gap-12 py-10">
                  <div className="space-y-8">
                     <div className="space-y-3">
                        <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Subject ID</Label>
                        <Input value={newDNA.name} onChange={(e) => setNewDNA({ ...newDNA, name: e.target.value })} className="bg-zinc-900 border-zinc-800 rounded-2xl h-16 text-white font-bold px-6" placeholder="PROTAGONIST_ALPHA" />
                     </div>
                     <div className="space-y-3">
                        <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">AI Seed</Label>
                        <Input type="number" value={newDNA.seed} onChange={(e) => setNewDNA({ ...newDNA, seed: parseInt(e.target.value) })} className="bg-zinc-900 border-zinc-800 rounded-2xl h-16 text-white font-bold px-6" />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Visual DNA (Physical Traits)</Label>
                     <textarea value={newDNA.prompt} onChange={(e) => setNewDNA({ ...newDNA, prompt: e.target.value })} className="w-full bg-zinc-900 border-zinc-800 rounded-[2rem] p-8 text-white font-medium text-sm min-h-[220px] focus:outline-none focus:border-fuchsia-500/50 transition-all" placeholder="Define visual markers..." />
                  </div>
               </div>
               <DialogFooter>
                  <Button onClick={addDNA} className="w-full h-20 bg-fuchsia-500 text-white font-black uppercase tracking-[0.4em] text-xs rounded-[2rem] shadow-2xl hover:bg-fuchsia-400 transition-all">Authorize DNA Link</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         <style>{`
            .glass {
               background: rgba(10, 10, 11, 0.4);
               backdrop-filter: blur(16px);
               -webkit-backdrop-filter: blur(16px);
            }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            @keyframes spin-slow {
               from { transform: rotate(0deg); }
               to { transform: rotate(360deg); }
            }
            .animate-spin-slow { animation: spin-slow 12s linear infinite; }
         `}</style>
      </div>
   );
}




