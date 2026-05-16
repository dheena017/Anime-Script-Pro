import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { StudioLoading } from '@/pages/studio/components/studio/StudioLoading';
import { ProfileHeader } from './components/ProfileHeader';
import { ActivityTelemetry } from './components/ActivityTelemetry';
import { AchievementShelf } from './components/AchievementShelf';
import { NodeIntegrity } from './components/NodeIntegrity';
import { ProfileToolbar } from './components/ProfileToolbar';
import { AddPromptModal } from './components/AddPromptModal';
import { AddDNAModal } from './components/AddDNAModal';
import { VaultTab } from './tabs/VaultTab';
import { LibraryTab } from './tabs/LibraryTab';
import { ConfigTab } from './tabs/ConfigTab';
import { SecurityTab } from './tabs/SecurityTab';

type ProfileTab = 'vault' | 'library' | 'config' | 'security';

export function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('vault');

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'vault':
        return <VaultTab generations={generations} favorites={favorites} />;
      case 'library':
        return (
          <LibraryTab
            savedPrompts={savedPrompts}
            characters={characters}
            onAddPrompt={() => setShowPromptModal(true)}
            onAddDNA={() => setShowDNAModal(true)}
          />
        );
      case 'config':
        return (
          <ConfigTab
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            theme={theme}
            toggleTheme={toggleTheme}
            emailAlerts={emailAlerts}
            setEmailAlerts={setEmailAlerts}
          />
        );
      case 'security':
        return <SecurityTab onDeactivate={signOut} />;
      default:
        return <VaultTab generations={generations} favorites={favorites} />;
    }
  };

  return (
    <div className={`max-w-[1400px] mx-auto space-y-12 pb-32 font-sans select-none ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-zinc-50 text-black'}`}>
      {/* 1. ARCHITECT HEADER SECTION */}
      <ProfileHeader
        displayName={displayName}
        setDisplayName={setDisplayName}
        handle={handle}
        setHandle={setHandle}
        bio={bio}
        setBio={setBio}
        avatarUrl={avatarUrl}
        setAvatarUrl={setAvatarUrl}
        bannerUrl={bannerUrl}
        setBannerUrl={setBannerUrl}
        joinDate={joinDate}
        credits={credits}
        tier={tier}
        level={level}
        experience={experience}
        theme={theme}
        onSave={handleSave}
        onSignOut={signOut}
        saving={saving}
        syncStatus={syncStatus}
      />

      {/* 2. TELEMETRY & ACHIEVEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT: ACTIVITY & ACHIEVEMENTS */}
        <div className="lg:col-span-8 space-y-12">
          <ActivityTelemetry />

          <ProfileToolbar activeTab={activeTab} onTabChange={setActiveTab} />

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
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: ACHIEVEMENT SHELF & STATUS */}
        <div className="lg:col-span-4 space-y-12">
          <AchievementShelf />
          <NodeIntegrity />
        </div>
      </div>

      {/* 3. MODALS */}
      <AddPromptModal
        open={showPromptModal}
        onOpenChange={setShowPromptModal}
        newPrompt={newPrompt}
        setNewPrompt={setNewPrompt}
        onAdd={addPrompt}
      />

      <AddDNAModal
        open={showDNAModal}
        onOpenChange={setShowDNAModal}
        newDNA={newDNA}
        setNewDNA={setNewDNA}
        onAdd={addDNA}
      />

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
