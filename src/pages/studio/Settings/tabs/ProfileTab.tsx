import { useState, useEffect } from 'react';
import { User, Camera, AtSign, Save, Shield } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { settingsService, UserProfile } from '@/services/api/settings';

export const ProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await settingsService.updateProfile(profile);
      // Success toast or notification
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-zinc-500 animate-pulse uppercase tracking-[0.3em] font-black">Syncing Architect Data...</div>;

  return (
    <div className="space-y-8">
      <Card className="settings-card border-none rounded-[2.5rem] overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-[#bd4a4a]/20 via-zinc-900 to-[#bd4a4a]/10 relative">
          <Button variant="ghost" className="absolute bottom-4 right-6 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
            <Camera className="w-3.5 h-3.5 mr-2" /> Change Banner
          </Button>
        </div>
        
        <CardContent className="p-10 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row items-end gap-8 mb-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-zinc-950 bg-zinc-900 shadow-2xl">
                <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile?.handle}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl backdrop-blur-sm">
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="flex-1 space-y-2 pb-2">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{profile?.display_name || 'Architect Unit'}</h2>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#bd4a4a]" /> System Admin <span className="text-zinc-800">/</span> {profile?.handle || '@handle'}
              </p>
            </div>
            
            <Button onClick={handleSave} disabled={saving} className="settings-button-primary rounded-2xl px-8 h-14 font-black uppercase tracking-widest">
              {saving ? 'Syncing...' : <><Save className="w-4 h-4 mr-3" /> Save Changes</>}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="settings-label ml-1">Display Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <Input 
                    value={profile?.display_name || ''} 
                    onChange={e => setProfile(p => p ? {...p, display_name: e.target.value} : null)}
                    className="settings-input h-14 pl-12 rounded-xl text-white font-bold" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="settings-label ml-1">Architect Handle</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <Input 
                    value={profile?.handle || ''} 
                    onChange={e => setProfile(p => p ? {...p, handle: e.target.value} : null)}
                    className="settings-input h-14 pl-12 rounded-xl text-white font-bold" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="settings-label ml-1">Neural Bio</label>
                <textarea 
                  className="settings-input w-full min-h-[145px] p-4 rounded-xl text-white font-bold text-sm focus:outline-none" 
                  value={profile?.bio || ''}
                  onChange={e => setProfile(p => p ? {...p, bio: e.target.value} : null)}
                  placeholder="Describe your design philosophy..."
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
