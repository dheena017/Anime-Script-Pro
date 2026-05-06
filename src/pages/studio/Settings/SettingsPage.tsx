import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { studioLog, reportTabChange } from '@/lib/studio-logger';
import { 
  User, 
  Shield, 
  Cpu, 
  Bell, 
  Globe, 
  Palette,
  Settings as SettingsIcon,
  Activity,
  ShieldCheck,
  Zap,
  Trash2,
  RefreshCw,
  Clock
} from 'lucide-react';
import { SettingsLayout } from './SettingsLayout';

// Tab Components
import ProfileTab from './tabs/ProfileTab';
import { SecurityTab } from './tabs/SecurityTab';
import AISynthesisTab from './tabs/AISynthesisTab';
import NotificationsTab from './tabs/NotificationsTab';
import GlobalTab from './tabs/GlobalTab';
import AppearanceTab from './tabs/AppearanceTab';

type SettingsTab = 'profile' | 'security' | 'ai' | 'notifications' | 'global' | 'appearance';

const tabs: { id: SettingsTab; label: string; icon: any; desc: string }[] = [
  { id: 'profile', label: 'Architect Profile', icon: User, desc: 'Identity & Neural Bio' },
  { id: 'security', label: 'Security & Access', icon: Shield, desc: 'Encryption & Keys' },
  { id: 'ai', label: 'AI Synthesis Nodes', icon: Cpu, desc: 'Engine Configurations' },
  { id: 'notifications', label: 'Signal Config', icon: Bell, desc: 'Transmission Protocols' },
  { id: 'global', label: 'Network & Region', icon: Globe, desc: 'Geospatial Settings' },
  { id: 'appearance', label: 'Visual Interface', icon: Palette, desc: 'UI Aesthetics' },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromUrl = () => {
    const path = location.pathname.split('/').pop();
    return tabs.find(t => t.id === path) ? (path as SettingsTab) : 'profile';
  };

  const [activeTab, setActiveTab] = useState<SettingsTab>(getTabFromUrl());
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    studioLog('Settings', 'System Config Interface active.', 'system');
  }, []);

  useEffect(() => {
    const tab = getTabFromUrl();
    if (tab !== activeTab) {
      reportTabChange('Settings', tab, 'system');
      setActiveTab(tab);
    }
    if (location.pathname === '/settings') {
      navigate('/settings/profile', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleTabChange = (id: string) => {
    setActiveTab(id as SettingsTab);
    navigate(`/settings/${id}`);
  };

  const stats = [
    { label: "Core Load", value: "12%", icon: Activity, color: "text-blue-500" },
    { label: "Hardening", value: "MAXIMUM", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Uptime", value: "99.99%", icon: Zap, color: "text-amber-500" },
  ];

  const bottomMetrics = (
    <>
      <div className="header-bottom-item">
        <Clock className="header-bottom-icon" />
        <div className="header-bottom-text">
          <p className="header-bottom-label">Last Synchronization</p>
          <p className="header-bottom-value">2 Minutes Ago</p>
        </div>
      </div>
      <div className="header-bottom-item">
        <RefreshCw className="header-bottom-icon text-studio" />
        <div className="header-bottom-text">
          <p className="header-bottom-label">Auto-Save</p>
          <p className="header-bottom-value">Cloud Persistence Active</p>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'security': return <SecurityTab />;
      case 'ai': return <AISynthesisTab />;
      case 'notifications': return <NotificationsTab />;
      case 'global': return <GlobalTab />;
      case 'appearance': return <AppearanceTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <SettingsLayout
      title="INTERFACE CORE"
      subtitle="CONFIGURE NEURAL PARAMETERS & ARCHITECT PROFILE"
      brandIcon={SettingsIcon}
      stats={stats}
      bottomMetrics={bottomMetrics}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      primaryAction={{
        label: "RESTORE DEFAULTS",
        onClick: () => console.log("Restore"),
        icon: Trash2
      }}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {renderContent()}
    </SettingsLayout>
  );
}
