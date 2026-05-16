import { motion } from 'framer-motion';
import {
  User,
  LogOut,
  Calendar,
  Save,
  Loader2,
  Camera,
  AtSign,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface ProfileHeaderProps {
  displayName: string;
  setDisplayName: (name: string) => void;
  handle: string;
  setHandle: (handle: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  bannerUrl: string;
  setBannerUrl: (url: string) => void;
  joinDate: string;
  credits: number;
  tier: string;
  level: number;
  experience: number;
  theme: 'dark' | 'light';
  onSave: () => void;
  onSignOut: () => void;
  saving: boolean;
  syncStatus: 'idle' | 'success' | 'error';
}

export function ProfileHeader({
  displayName,
  setDisplayName,
  handle,
  setHandle,
  bio,
  setBio,
  avatarUrl,
  bannerUrl,
  joinDate,
  credits,
  tier,
  level,
  experience,
  onSave,
  onSignOut,
  saving,
  syncStatus
}: ProfileHeaderProps) {
  return (
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
                <span className="text-xs font-black uppercase tracking-widest text-white">Upload DNA</span>
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
                  className="bg-transparent border-none p-0 h-auto text-4xl md:text-4xl font-black tracking-tighter text-white uppercase italic focus:outline-none w-full max-w-2xl"
                  placeholder="ARCHITECT NAME"
                />
                <div className="flex gap-3">
                  <div className="px-4 py-1.5 bg-studio/20 border border-studio/30 text-studio text-xs font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-md">{tier} PROTOCOL</div>
                  <div className="px-4 py-1.5 bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-md">
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
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
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
                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest italic">Node Activated {joinDate}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            <Button
              onClick={onSave}
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
              onClick={onSignOut}
              variant="ghost"
              className="h-14 rounded-2xl font-black uppercase tracking-widest text-zinc-600 hover:text-white hover:bg-white/5 transition-colors text-xs"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" /> Deactivate Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
