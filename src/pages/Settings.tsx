import React from 'react';
import { 
  Compass, 
  Search, 
  Cpu,
  Zap,
  Check,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { PageHeader, PageShell } from '@/components/page/PageShell';
import { AnimatePresence } from 'motion/react';

// New Components
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';
import { SettingsSection, SettingItem } from '@/components/settings/SettingsSection';

export function SettingsPage() {
  const [user] = useAuthState(auth);
  const [activeTab, setActiveTab] = React.useState('profile');
  const [autoSave, setAutoSave] = React.useState(true);

  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <SettingsSection 
            title="Creator Identity" 
            description="Manage your professional presence across the production block."
          >
            <div className="flex items-center gap-10 py-4">
              <div className="relative group">
                <div className="w-24 h-24 rounded-[32px] bg-zinc-900 border-2 border-zinc-800 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:rotate-3">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-zinc-700 uppercase">
                      {user?.displayName?.[0] || 'U'}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 bg-red-600 rounded-xl border-4 border-zinc-950 shadow-xl">
                   <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                   <h3 className="text-2xl font-black tracking-tight uppercase leading-none">{user?.displayName || 'Unnamed Creator'}</h3>
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{user?.email}</p>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-white">Update Bio</Button>
                   <Button variant="ghost" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-500">Reset Avatar</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-900/50">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">PUBLIC DISPLAY NAME</label>
                <div className="p-4 bg-zinc-950/50 border border-zinc-900 rounded-2xl text-sm font-bold text-white shadow-inner">
                  {user?.displayName || 'Unknown Terminal'}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">STUDIO ACCESS EMAIL</label>
                <div className="p-4 bg-zinc-950/50 border border-zinc-900 rounded-2xl text-sm font-bold text-white shadow-inner">
                  {user?.email || 'N/A'}
                </div>
              </div>
            </div>
          </SettingsSection>
        );
      case 'ai':
        return (
          <SettingsSection 
            title="AI CO-PILOT CONFIG" 
            description="Fine-tune the weights and architectural defaults of your script engine."
          >
            <SettingItem 
              label="Standard Generation Engine" 
              description="Select the default large language model to power your creative flows."
            >
              <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                 <Button variant="ghost" className="h-9 px-4 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-[9px] font-black uppercase tracking-widest">GEMINI 2.0</Button>
                 <Button variant="ghost" className="h-9 px-4 rounded-lg text-zinc-600 hover:text-white text-[9px] font-black uppercase tracking-widest">VISION 3.5</Button>
              </div>
            </SettingItem>

            <SettingItem 
              label="Autonomous Auto-Save" 
              description="Automatically commit your workspace mutations to the production cloud."
            >
              <button 
                onClick={() => setAutoSave(!autoSave)}
                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${autoSave ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'bg-zinc-800'}`}
              >
                 <div className={`w-6 h-6 rounded-full bg-white shadow-lg transition-transform duration-300 ${autoSave ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </SettingItem>

            <div className="p-6 rounded-[32px] bg-red-600/5 border border-red-500/10 flex items-start gap-6">
               <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                  <Cpu className="w-6 h-6 text-red-500" />
               </div>
               <div className="space-y-4 flex-1">
                  <div>
                    <h4 className="text-lg font-black tracking-tight uppercase leading-none mb-1">Advanced Neural Weights</h4>
                    <p className="text-xs text-zinc-500 font-medium italic">Unlocks creative randomness (Temperature) and token limits.</p>
                  </div>
                  <div className="h-[1px] w-full bg-zinc-900" />
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[10px] h-10 px-8 rounded-xl shadow-xl shadow-red-600/20">
                     Initialize Weights Hub
                  </Button>
               </div>
            </div>
          </SettingsSection>
        );
      default:
        return (
          <div className="p-20 text-center border-2 border-dashed border-zinc-900 rounded-[32px]">
             <PageHeader
               title="COMING SOON"
               subtitle="This control sector is currently under construction for v3.0."
               className="p-0 border-none m-0"
             />
          </div>
        )
    }
  }

  return (
    <PageShell className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <PageHeader
          title="CONTROL PANEL"
          subtitle="Architect your production environment and creative identity."
          icon={<Compass className="w-10 h-10 text-red-600" />}
          titleClassName="text-5xl font-black tracking-tighter uppercase italic"
          className="p-0 border-none bg-transparent"
        />
        <div className="flex items-center gap-2">
           <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">SYSTEM SECURE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <SettingsSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onSignOut={() => auth.signOut()} 
        />

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
             {renderContent()}
          </AnimatePresence>
        </div>
      </div>
    </PageShell>
  );
}

