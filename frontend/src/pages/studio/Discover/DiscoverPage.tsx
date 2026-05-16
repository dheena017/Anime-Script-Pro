import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { studioLog, reportTabChange } from '@/lib/studio-logger';
import { 
  Compass, 
  TrendingUp, 
  Clock, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Globe,
  Sparkles,
  Flame,
  Award,
  Layers
} from 'lucide-react';
import { DiscoverLayout } from './DiscoverLayout';
import { discoverService, DiscoverItem } from '@/services/api/discover';

type DiscoverTab = 'trending' | 'featured' | 'new' | 'community';

const tabs: { id: DiscoverTab; label: string; icon: any }[] = [
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'featured', label: 'Curated', icon: Award },
  { id: 'new', label: 'Latest', icon: Clock },
  { id: 'community', label: 'Community', icon: Globe },
];

export default function DiscoverPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromUrl = () => {
    const path = location.pathname.split('/').pop();
    return tabs.find(t => t.id === path) ? (path as DiscoverTab) : 'trending';
  };

  const [activeTab, setActiveTab] = useState<DiscoverTab>(getTabFromUrl());
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<DiscoverItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    studioLog('Discover', 'Discover Hub Interface active.', 'system');
  }, []);

  useEffect(() => {
    const tab = getTabFromUrl();
    if (tab !== activeTab) {
      reportTabChange('Discover', tab, 'system');
      setActiveTab(tab);
    }
    if (location.pathname === '/discover') {
      navigate('/discover/trending', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleTabChange = (id: string) => {
    setActiveTab(id as DiscoverTab);
    navigate(`/discover/${id}`);
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await discoverService.getDiscoverItems();
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeTab]);

  const stats = [
    { label: "Daily Reach", value: "1.2M", icon: Activity, color: "text-blue-500" },
    { label: "Integrity", value: "SECURE", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Sync Speed", value: "18MS", icon: Zap, color: "text-amber-500" },
  ];

  const bottomMetrics = (
    <>
      <div className="flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-[#bd4a4a]" />
        <div>
          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-none">Discover Mode</p>
          <p className="text-xs font-black text-white uppercase tracking-tight">AI-Enhanced Curation Active</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <TrendingUp className="w-4 h-4 text-[#bd4a4a]" />
        <div>
          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-none">Global Trends</p>
          <p className="text-xs font-black text-white uppercase tracking-tight">42 New Assets Indexed Today</p>
        </div>
      </div>
    </>
  );

  return (
    <DiscoverLayout
      title="DISCOVER HUB"
      subtitle="EXPLORE NEURAL ASSETS & ARCHITECTURAL BLUEPRINTS"
      brandIcon={Compass}
      stats={stats}
      bottomMetrics={bottomMetrics}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      primaryAction={{
        label: "SUBMIT NEW ASSET",
        onClick: () => console.log("Submit"),
        icon: Layers
      }}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      <div className="studio-card-grid">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-zinc-900/50 rounded-[3rem] animate-pulse border border-white/5" />
          ))
        ) : (
          items.map((item) => (
            <div key={item.id} className="studio-card">
              <div className="studio-card-glow" />
              <div className="card-header-row">
                <div className="card-icon-box">
                  <Sparkles className="w-5 h-5 text-studio" />
                </div>
                <div className="card-status-badge">
                  {item.category}
                </div>
              </div>
              <div className="card-title-section">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-subtitle">Manhwa Architecture // Level 4</p>
              </div>
              <div className="card-progress-section">
                <div className="progress-header">
                  <span>Usage Rate</span>
                  <span>{item.likes} / 1K</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill w-[70%]" />
                </div>
              </div>
              <div className="card-footer">
                <div className="footer-item">
                  <Clock className="footer-icon" />
                  <span className="footer-text">2 Hours Ago</span>
                </div>
                <div className="contributor-avatars">
                   <div className="avatar-ring bg-zinc-800" />
                   <div className="avatar-ring bg-zinc-700" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DiscoverLayout>
  );
}
