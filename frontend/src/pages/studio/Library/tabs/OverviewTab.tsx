import { motion } from 'framer-motion';
import { 
  Activity, 
  Database, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Users, 
  Film, 
  BookOpen, 
  Folder,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from 'react';
import { libraryApi, LibraryOverviewData } from '@/services/api/library';
import { useAuth } from '@/hooks/useAuth';

interface OverviewTabProps {
  searchTerm: string;
}

export default function OverviewTab({ searchTerm: _searchTerm }: OverviewTabProps) {
  const { user } = useAuth();
  const [overview, setOverview] = useState<LibraryOverviewData | null>(null);
  const stats = overview ? [
    { label: "Total Assets", value: String((overview.assets || []).length), change: "+12.5%", icon: Database, color: "text-blue-500" },
    { label: "Active Projects", value: String((overview.projects || []).length), change: "+2", icon: Activity, color: "text-[#bd4a4a]" },
    { label: "Storage Used", value: "842 GB", change: "70%", icon: Zap, color: "text-amber-500" },
    { label: "Security Status", value: "OPTIMAL", change: "SECURE", icon: ShieldCheck, color: "text-emerald-500" },
  ] : [];

  const recentCategories = overview ? [
    { name: 'Scripts', count: (overview.scripts || []).length, icon: FileText, color: 'bg-blue-500/10 text-blue-500' },
    { name: 'Characters', count: (overview.cast?.character_list_blob ? JSON.parse(overview.cast.character_list_blob).length : 0), icon: Users, color: 'bg-purple-500/10 text-purple-500' },
    { name: 'Storyboards', count: (overview.storyboards || []).length, icon: Film, color: 'bg-[#bd4a4a]/10 text-[#bd4a4a]' },
    { name: 'World Lore', count: overview.worldLore ? 1 : 0, icon: BookOpen, color: 'bg-emerald-500/10 text-emerald-500' },
    { name: 'Asset Packs', count: (overview.assets || []).length, icon: Folder, color: 'bg-amber-500/10 text-amber-500' },
  ] : [];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await libraryApi.fetchOverview(user?.id);
        if (mounted) setOverview(data);
      } catch (e) {
        console.error('Overview fetch failed', e);
      }
    })();
    return () => { mounted = false; };
  }, [user?.id]);

  return (
    <div className="space-y-8 p-1">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-zinc-950/50 border-white/5 hover:border-[#bd4a4a]/30 transition-colors group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.color} bg-black/40 ring-1 ring-white/5`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-tighter">{stat.change}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl font-black text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution Chart Placeholder */}
        <Card className="lg:col-span-2 bg-zinc-950/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-[#bd4a4a]">Asset Distribution</CardTitle>
            <BarChart3 className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border border-white/5 rounded-xl bg-black/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(189,74,74,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(189,74,74,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="z-10 text-center">
                <div className="flex items-end gap-2 h-32 mb-4">
                  {[40, 60, 30, 80, 50, 90, 45].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      className="w-8 bg-[#bd4a4a]/20 border border-[#bd4a4a]/40 rounded-t-sm"
                    />
                  ))}
                </div>
                <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">Neural Index Processing Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Categories */}
        <Card className="bg-zinc-950/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-[#bd4a4a]">Top Archives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCategories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 hover:border-[#bd4a4a]/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${cat.color}`}>
                    <cat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-[#bd4a4a] transition-colors">{cat.name}</p>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{cat.count} Items</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-[#bd4a4a] transition-colors" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
