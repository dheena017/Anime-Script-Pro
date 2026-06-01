import { useState, useEffect, startTransition } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { studioLog, reportTabChange } from '@/lib/dev-console-logs';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Globe, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Users2,
  Heart,
  MessageCircle,
  Plus
} from 'lucide-react';
import { CommunityLayout } from './CommunityLayout';
import { communityService, CommunityPost } from '@/services/api/community';
import { communityStyles as s } from './communityStyles';
import { sharedStyles as sh } from '../components/studio/shared/sharedStyles';
import { useApp } from '@/contexts/AppContext';

type CommunityTab = 'feed' | 'discussions' | 'collaborations' | 'showcase';

const tabs: { id: CommunityTab; label: string; icon: any }[] = [
  { id: 'feed', label: 'Neural Feed', icon: Globe },
  { id: 'discussions', label: 'Architect Forums', icon: MessageSquare },
  { id: 'collaborations', label: 'Joint Ops', icon: Users2 },
  { id: 'showcase', label: 'Vault Showcase', icon: Share2 },
];

export default function CommunityPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showNotification } = useApp();

  const getTabFromUrl = () => {
    const queryTab = searchParams.get('tab');
    if (tabs.find(t => t.id === queryTab)) return queryTab as CommunityTab;

    const path = location.pathname.split('/').pop();
    return tabs.find(t => t.id === path) ? (path as CommunityTab) : 'feed';
  };

  const [activeTab, setActiveTab] = useState<CommunityTab>(getTabFromUrl());
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    studioLog('Community', 'Community Nexus Interface active.', 'system');
  }, []);

  useEffect(() => {
    const tab = getTabFromUrl();
    if (tab !== activeTab) {
      reportTabChange('Community', tab, 'system');
      setActiveTab(tab);
    }
  }, [location.pathname, searchParams, activeTab]);

  const handleTabChange = (id: string) => {
    startTransition(() => {
      setActiveTab(id as CommunityTab);
      setSearchParams({ tab: id });
    });
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await communityService.getPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeTab]);

  const stats = [
    { label: "Active Nodes", value: "12.4K", icon: Activity, color: "text-blue-500" },
    { label: "Security", value: "ENCRYPTED", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Data Rate", value: "42GB/s", icon: Zap, color: "text-amber-500" },
  ];

  const bottomMetrics = (
    <>
      <div className="flex items-center gap-3">
        <Users className="w-4 h-4 text-[#bd4a4a]" />
        <div>
          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-none">Global Presence</p>
          <p className="text-xs font-black text-white uppercase tracking-tight">842 Architects Online Now</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <MessageCircle className="w-4 h-4 text-[#bd4a4a]" />
        <div>
          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-none">Signal Density</p>
          <p className="text-xs font-black text-white uppercase tracking-tight">High Interaction Flux Detected</p>
        </div>
      </div>
    </>
  );

  return (
    <CommunityLayout
      title="COMMUNITY NEXUS"
      subtitle="DECENTRALIZED ARCHITECT NETWORK & COLLABORATION CORE"
      brandIcon={Users}
      stats={stats}
      bottomMetrics={bottomMetrics}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      primaryAction={{
        label: "INITIALIZE BROADCAST",
        onClick: () => console.log("New Post"),
        icon: Plus
      }}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      <div className={sh.cardGrid}>
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="aspect-video bg-zinc-900/50 rounded-[3rem] animate-pulse border border-white/5" />
          ))
        ) : (
          posts.map((post) => (
            <div key={post.id} className={s.postCard}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#bd4a4a]/5 to-transparent opacity-0 transition-opacity duration-700 hover:opacity-100" />
              <div className={sh.cardHeader}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${post.author_id}`} alt="Author" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest">{post.author_name}</p>
                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Master Architect</p>
                  </div>
                </div>
                <div className={sh.badge}>
                  {post.category || 'General'}
                </div>
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className={sh.cardTitle}>{post.title}</h3>
                <p className={sh.cardSubtitle + " line-clamp-2"}>{post.content}</p>
              </div>
              <div className={sh.cardFooter}>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Heart onClick={() => showNotification?.('This feature is currently in development.', 'info')} className="w-3 h-3 text-zinc-600 hover:text-red-500 cursor-pointer transition-colors" />
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare onClick={() => showNotification?.('This feature is currently in development.', 'info')} className="w-3 h-3 text-zinc-600 hover:text-studio cursor-pointer transition-colors" />
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{post.comments_count}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 onClick={() => showNotification?.('This feature is currently in development.', 'info')} className="w-3 h-3 text-zinc-600 cursor-pointer" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </CommunityLayout>
  );
}
