import { useState, useEffect, startTransition } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { studioLog, reportTabChange } from '@/lib/dev-console-logs';
import { 
  Bell, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Archive, 
  CheckCheck,
  Signal,
  Wifi,
  Radio,
  Sparkles
} from 'lucide-react';
import { NotificationsLayout } from './NotificationsLayout';
import * as Tab from './tabs/NotificationTabs';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';

type NotificationTab = 'all' | 'unread' | 'system' | 'activity' | 'archived';

const tabs: { id: NotificationTab; label: string; icon: any }[] = [
  { id: 'all', label: 'All Signals', icon: Bell },
  { id: 'unread', label: 'Unread Ops', icon: AlertCircle },
  { id: 'system', label: 'System Core', icon: Info },
  { id: 'activity', label: 'Activity Logs', icon: CheckCircle },
  { id: 'archived', label: 'Archived', icon: Archive },
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const getTabFromUrl = () => {
    const queryTab = searchParams.get('tab');
    if (tabs.find(t => t.id === queryTab)) return queryTab as NotificationTab;

    const path = location.pathname.split('/').pop();
    return tabs.find(t => t.id === path) ? (path as NotificationTab) : 'all';
  };

  const [activeTab, setActiveTab] = useState<NotificationTab>(getTabFromUrl());
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    studioLog('Notifications', 'Signal Protocol Interface active.', 'system');
  }, []);

  useEffect(() => {
    const tab = getTabFromUrl();
    if (tab !== activeTab) {
      reportTabChange('Notifications', tab, 'system');
      setActiveTab(tab);
    }
  }, [location.pathname, searchParams, activeTab]);

  const handleTabChange = (id: string) => {
    startTransition(() => {
      setActiveTab(id as NotificationTab);
      setSearchParams({ tab: id });
    });
  };

  const handleMarkRead = async (id: string | number) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    await markAsRead(numericId);
  };

  const handleDeleteNotification = async (id: string | number) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    await deleteNotification(numericId);
  };

  const stats = [
    { label: "Throughput", value: "840 msg/s", icon: Signal, color: "text-blue-500" },
    { label: "Uplink", value: "STABLE", icon: Wifi, color: "text-emerald-500" },
    { label: "Latency", value: "4MS", icon: Radio, color: "text-amber-500" },
  ];

  const bottomMetrics = (
    <div className="flex items-center justify-between w-full flex-wrap gap-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Bell className="w-4 h-4 text-[#bd4a4a]" />
          <div>
            <p className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-none">Pending Alerts</p>
            <p className="text-xs font-black text-white uppercase tracking-tight">{notifications.filter(n => !n.is_read).length} Critical Signals</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <div>
            <p className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-none">Status</p>
            <p className="text-xs font-black text-white uppercase tracking-tight">Real-time Synchronization Active</p>
          </div>
        </div>
      </div>
      <div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/notifications/showcase')}
          className="border-[#bd4a4a]/40 bg-[#bd4a4a]/10 hover:bg-[#bd4a4a]/20 text-[#bd4a4a] font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl transition-all"
        >
          <Sparkles className="w-4 h-4 mr-2 animate-pulse" /> Launch Pop Showcase
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) return <div className="py-20 animate-pulse text-center text-zinc-600 uppercase tracking-widest text-xs font-black">Syncing Signals...</div>;

    const mapped = notifications.map(n => {
      // Map backend types to frontend categories for filtering
      let frontendType: 'system' | 'activity' | 'alert' = 'system';
      const backendType = n.type.toUpperCase();
      
      if (backendType === 'SUCCESS') frontendType = 'activity';
      else if (backendType === 'WARNING' || backendType === 'ALERT') frontendType = 'alert';
      else frontendType = 'system';

      return {
        id: n.id.toString(),
        title: n.title,
        message: n.message,
        type: frontendType,
        read: n.is_read,
        timestamp: n.created_at
      };
    });

    const filtered = mapped.filter(n => 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const props = { notifications: filtered, onMarkRead: handleMarkRead, onDelete: handleDeleteNotification };

    switch (activeTab) {
      case 'unread': return <Tab.UnreadTab {...props} />;
      case 'system': return <Tab.SystemTab {...props} />;
      case 'activity': return <Tab.ActivityTab {...props} />;
      case 'archived': return <Tab.ArchivedTab {...props} />;
      default: return <Tab.AllTab {...props} />;
    }
  };

  return (
    <NotificationsLayout
      title="NOTIFICATION CENTER"
      subtitle="REAL-TIME SIGNAL DECODING & SYSTEM ALERTS"
      brandIcon={Bell}
      stats={stats}
      bottomMetrics={bottomMetrics}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      primaryAction={{
        label: "MARK ALL AS READ",
        onClick: markAllAsRead,
        icon: CheckCheck
      }}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {renderContent()}
    </NotificationsLayout>
  );
}
