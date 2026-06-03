import { useState, useEffect, startTransition } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { studioLog, reportTabChange } from '@/lib/dev-console-logs';
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
  Clock,
  BrainCircuit,
  Wand2
} from 'lucide-react';
import { SettingsLayout } from './SettingsLayout';

// Tab Components
import ProfileTab from './tabs/ProfileTab';
import { SecurityTab } from './tabs/SecurityTab';
import GeminiTab from './tabs/GeminiTab';
import { OpenAITab } from './tabs/OpenAITab';
import { GroqTab } from './tabs/GroqTab';
import { NvidiaTab } from './tabs/NvidiaTab';
import { StableDiffusionTab } from './tabs/StableDiffusionTab';
import NotificationsTab from './tabs/NotificationsTab';
import GlobalTab from './tabs/GlobalTab';
import AppearanceTab from './tabs/AppearanceTab';

type SettingsTab = 'profile' | 'security' | 'gemini' | 'openai' | 'groq' | 'nvidia' | 'stablediffusion' | 'quotas' | 'notifications' | 'global' | 'appearance';

const tabs: { id: SettingsTab; label: string; icon: any; desc: string }[] = [
  { id: 'profile', label: 'Architect Profile', icon: User, desc: 'Identity & Neural Bio' },
  { id: 'security', label: 'Security & Access', icon: Shield, desc: 'Encryption & Keys' },
  { id: 'gemini', label: 'Google Gemini Node', icon: BrainCircuit, desc: 'Primary AI Architecture' },
  { id: 'openai', label: 'OpenAI GPT Node', icon: Cpu, desc: 'Advanced LLM Frameworks' },
  { id: 'groq', label: 'Groq / Llama Node', icon: Activity, desc: 'Ultra High-Speed Core' },
  { id: 'nvidia', label: 'NVIDIA Core Node', icon: Cpu, desc: 'Specialty Models & Audio' },
  { id: 'stablediffusion', label: 'Stable Diffusion Node', icon: Wand2, desc: 'Image Synthesis & Samplers' },
  { id: 'notifications', label: 'Signal Config', icon: Bell, desc: 'Transmission Protocols' },
  { id: 'global', label: 'Network & Region', icon: Globe, desc: 'Geospatial Settings' },
  { id: 'appearance', label: 'Visual Interface', icon: Palette, desc: 'UI Aesthetics' },
];

export default function SettingsPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const getTabFromUrl = () => {
    const queryTab = searchParams.get('tab');
    if (tabs.find(t => t.id === queryTab)) return queryTab as SettingsTab;

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
  }, [location.pathname, searchParams, activeTab]);

  const handleTabChange = (id: string) => {
    startTransition(() => {
      setActiveTab(id as SettingsTab);
      setSearchParams({ tab: id });
    });
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
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'security': return <SecurityTab />;
      case 'gemini': return <GeminiTab />;
      case 'openai': return <OpenAITab />;
      case 'groq': return <GroqTab />;
      case 'nvidia': return <NvidiaTab />;
      case 'stablediffusion': return <StableDiffusionTab />;
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
