import React from 'react';
import { 
  Settings2, 
  User, 
  Shield, 
  Bell, 
  Database, 
  Cpu,
  CreditCard,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function SettingsPage() {
  const [user] = useAuthState(auth);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-500">Manage your account preferences and AI configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-1">
          {[
            { icon: User, label: 'Profile' },
            { icon: Shield, label: 'Security' },
            { icon: Bell, label: 'Notifications' },
            { icon: Cpu, label: 'AI Models' },
            { icon: Database, label: 'Data & Storage' },
            { icon: CreditCard, label: 'Billing' },
          ].map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          ))}
          <div className="pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => auth.signOut()}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg">Public Profile</CardTitle>
              <CardDescription>How others see you on Anime Script Pro.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-600">
                      {user?.displayName?.[0] || 'U'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="border-zinc-800 bg-zinc-900/50">Change Avatar</Button>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Display Name</label>
                  <div className="p-3 bg-black/50 border border-zinc-800 rounded-lg text-sm text-zinc-300">
                    {user?.displayName || 'Not set'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                  <div className="p-3 bg-black/50 border border-zinc-800 rounded-lg text-sm text-zinc-300">
                    {user?.email || 'Not set'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg">AI Configuration</CardTitle>
              <CardDescription>Default settings for your script generations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/30 border border-zinc-800 rounded-xl">
                <div>
                  <p className="text-sm font-bold">Default Model</p>
                  <p className="text-xs text-zinc-500">Gemini 3 Flash (Fast)</p>
                </div>
                <Button variant="outline" size="sm" className="border-zinc-800 bg-zinc-900/50">Change</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/30 border border-zinc-800 rounded-xl">
                <div>
                  <p className="text-sm font-bold">Auto-Save Scripts</p>
                  <p className="text-xs text-zinc-500">Automatically save every generation to cloud.</p>
                </div>
                <div className="w-10 h-5 bg-red-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
