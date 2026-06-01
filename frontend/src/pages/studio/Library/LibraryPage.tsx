import { useState, useEffect, startTransition } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { studioLog, reportTabChange } from '@/lib/dev-console-logs';
import {
  Folder,
  FileText,
  Film,
  Users,
  Star,
  Clock,
  Archive,
  BookOpen,
  Layout,
  Palette,
  Database,
  Cloud,
  Layers,
  Activity,
  ShieldCheck,
  Zap,
  Library as LibraryIcon
} from 'lucide-react';
import { LibraryLayout } from './LibraryLayout';

// Tab Components
import OverviewTab from './tabs/OverviewTab';
import ThemeTab from './tabs/ThemeTab';
import ScriptsTab from './tabs/ScriptsTab';
import CharactersTab from './tabs/CharactersTab';
import StoryboardsTab from './tabs/StoryboardsTab';
import WorldLoreTab from './tabs/WorldLoreTab';
import AssetPacksTab from './tabs/AssetPacksTab';
import FavoritesTab from './tabs/FavoritesTab';
import RecentTab from './tabs/RecentTab';
import ArchivedTab from './tabs/ArchivedTab';

type LibraryTab = 'overview' | 'theme' | 'scripts' | 'characters' | 'storyboards' | 'world' | 'assets' | 'favorites' | 'recent' | 'archived';

const tabs: { id: LibraryTab; label: string; icon: any }[] = [
  { id: 'overview', label: 'Overview', icon: Layout },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'scripts', label: 'Scripts', icon: FileText },
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'storyboards', label: 'Storyboards', icon: Film },
  { id: 'world', label: 'World Lore', icon: BookOpen },
  { id: 'assets', label: 'Asset Packs', icon: Folder },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'archived', label: 'Archived', icon: Archive },
];

export default function LibraryPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const getTabFromUrl = () => {
    const queryTab = searchParams.get('tab');
    if (tabs.find(t => t.id === queryTab)) return queryTab as LibraryTab;

    const path = location.pathname.split('/').pop();
    return tabs.find(t => t.id === path) ? (path as LibraryTab) : 'overview';
  };

  const [activeTab, setActiveTab] = useState<LibraryTab>(getTabFromUrl());
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    studioLog('Library', 'Library Vault Interface active.', 'system');
  }, []);

  useEffect(() => {
    const tab = getTabFromUrl();
    if (tab !== activeTab) {
      reportTabChange('Library', tab, 'system');
      setActiveTab(tab);
    }
  }, [location.pathname, searchParams, activeTab]);

  const handleTabChange = (id: string) => {
    startTransition(() => {
      setActiveTab(id as LibraryTab);
      setSearchParams({ tab: id });
    });
  };

  const stats = [
    { label: "Indexing", value: "98.2%", icon: Activity, color: "text-blue-500" },
    { label: "Security", value: "VERIFIED", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Latency", value: "12MS", icon: Zap, color: "text-amber-500" },
  ];

  const bottomMetrics = (
    <>
      <div className="flex items-center gap-3">
        <Database className="w-4 h-4 text-[#bd4a4a]" />
        <div>
          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-none">Archive Size</p>
          <p className="text-xs font-black text-white uppercase tracking-tight">42.8 GB / 1.2 TB</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Cloud className="w-4 h-4 text-blue-500" />
        <div>
          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-none">Cloud Sync</p>
          <p className="text-xs font-black text-white uppercase tracking-tight">Continuous Protection Active</p>
        </div>
      </div>
      <div className="flex items-center gap-6 ml-auto">
        <div className="flex items-center -space-x-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-6 h-6 rounded-full border border-black bg-zinc-900 overflow-hidden ring-1 ring-[#bd4a4a]/20">
              <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Contributor" className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="w-6 h-6 rounded-full bg-[#bd4a4a] flex items-center justify-center text-xs font-black text-white border border-black">
            +12
          </div>
        </div>
        <p className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-none">Active Contributors</p>
      </div>
    </>
  );

  const renderContent = () => {
    const commonProps = { searchTerm, viewMode, sortBy: 'recent' };
    
    switch (activeTab) {
      case 'overview': return <OverviewTab searchTerm={searchTerm} />;
      case 'theme': return <ThemeTab searchTerm={searchTerm} />;
      case 'scripts': return <ScriptsTab {...commonProps} />;
      case 'characters': return <CharactersTab {...commonProps} />;
      case 'storyboards': return <StoryboardsTab />;
      case 'world': return <WorldLoreTab />;
      case 'assets': return <AssetPacksTab {...commonProps} />;
      case 'favorites': return <FavoritesTab {...commonProps} />;
      case 'recent': return <RecentTab />;
      case 'archived': return <ArchivedTab />;
      default: return (
        <div className="py-20 text-center">
          <p className="text-zinc-500 uppercase font-black text-xs tracking-widest">Protocol {activeTab} coming soon...</p>
        </div>
      );
    }
  };

  return (
    <LibraryLayout
      title="LIBRARY VAULT"
      subtitle="DIGITAL ASSET INDEXING & PRODUCTION ARCHIVES"
      brandIcon={LibraryIcon}
      stats={stats}
      bottomMetrics={bottomMetrics}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      primaryAction={{
        label: "INITIALIZE NEW ASSET",
        onClick: () => console.log("New Asset"),
        icon: Layers
      }}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {renderContent()}
    </LibraryLayout>
  );
}
