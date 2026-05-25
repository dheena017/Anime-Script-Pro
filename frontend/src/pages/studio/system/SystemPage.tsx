import { useState, useEffect, startTransition } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { studioLog, reportTabChange } from '@/lib/studio-logger';
import { 
  Terminal, 
  Shield, 
  Activity, 
  BookOpen, 
  MessageSquare, 
  Compass,
  Globe,
  Radio,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { SystemLayout } from './SystemLayout';

// Tab Components
import CommandMapTab from './tabs/CommandMapTab';
import SystemHealthTab from './tabs/SystemHealthTab';
import DocumentationTab from './tabs/DocumentationTab';
import TerminalTab from './tabs/TerminalTab';

type SystemTab = 'map' | 'health' | 'docs' | 'terminal' | 'feedback';

const tabs: { id: SystemTab; label: string; icon: any; desc: string }[] = [
  { id: 'map', label: 'Command Map', icon: Compass, desc: 'Universal Node Access' },
  { id: 'health', label: 'System Health', icon: Activity, desc: 'Real-time Telemetry' },
  { id: 'docs', label: 'Documentation', icon: BookOpen, desc: 'Architect Guidelines' },
  { id: 'terminal', label: 'Direct Uplink', icon: Terminal, desc: 'API Command Center' },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare, desc: 'Developer Comms' },
];

export default function SystemPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const getTabFromUrl = () => {
    const queryTab = searchParams.get('tab');
    if (tabs.find(t => t.id === queryTab)) return queryTab as SystemTab;

    const path = location.pathname.split('/').pop();
    return tabs.find(t => t.id === path) ? (path as SystemTab) : 'map';
  };

  const [activeTab, setActiveTab] = useState<SystemTab>(getTabFromUrl());
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    studioLog('System', 'System Protocol Interface active.', 'system');
  }, []);

  useEffect(() => {
    const tab = getTabFromUrl();
    if (tab !== activeTab) {
      reportTabChange('System', tab, 'system');
      setActiveTab(tab);
    }
  }, [location.pathname, searchParams, activeTab]);

  const handleTabChange = (id: string) => {
    startTransition(() => {
      setActiveTab(id as SystemTab);
      setSearchParams({ tab: id });
    });
  };

  const stats = [
    { label: "Core Sync", value: "STABLE", icon: Activity, color: "text-blue-500" },
    { label: "Node Health", value: "EXCELLENT", icon: Shield, color: "text-emerald-500" },
    { label: "Network", value: "ENCRYPTED", icon: Globe, color: "text-amber-500" },
  ];

  const bottomMetrics = (
    <>
      <div className="header-bottom-item">
        <HardDrive className="header-bottom-icon" />
        <div className="header-bottom-text">
          <p className="header-bottom-label">Storage Array</p>
          <p className="header-bottom-value">84% Capacity utilized</p>
        </div>
      </div>
      <div className="header-bottom-item">
        <Radio className="header-bottom-icon text-studio" />
        <div className="header-bottom-text">
          <p className="header-bottom-label">Uplink Status</p>
          <p className="header-bottom-value">Signal Strength: 100%</p>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'map': return <CommandMapTab />;
      case 'health': return <SystemHealthTab />;
      case 'docs': return <DocumentationTab />;
      case 'terminal': return <TerminalTab />;
      default: return <CommandMapTab />;
    }
  };

  return (
    <SystemLayout
      title="SYSTEM CONTROL"
      subtitle="ARCHITECTURAL ORCHESTRATION & NEURAL NODE MANAGEMENT"
      brandIcon={Terminal}
      stats={stats}
      bottomMetrics={bottomMetrics}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      primaryAction={{
        label: "INITIALIZE DIAGNOSTICS",
        onClick: () => console.log("Diag"),
        icon: RefreshCw
      }}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {renderContent()}
    </SystemLayout>
  );
}
