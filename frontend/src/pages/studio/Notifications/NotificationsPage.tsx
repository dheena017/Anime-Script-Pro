import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { studioLog, reportTabChange } from '@/lib/studio-logger';
import { 
  Bell, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Archive, 
  CheckCheck,
  Signal,
  Wifi,
  Radio
} from 'lucide-react';
import { NotificationsLayout } from './NotificationsLayout';
import * as Tab from './tabs/NotificationTabs';
import { notificationService, Notification } from '@/services/api/notifications';
import { useAuth } from '@/hooks/useAuth';

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
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromUrl = () => {
    const path = location.pathname.split('/').pop();
    return tabs.find(t => t.id === path) ? (path as NotificationTab) : 'all';
  };

  const [activeTab, setActiveTab] = useState<NotificationTab>(getTabFromUrl());
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const fetchNotifications = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  useEffect(() => {
    studioLog('Notifications', 'Signal Protocol Interface active.', 'system');
  }, []);

  useEffect(() => {
    const tab = getTabFromUrl();
    if (tab !== activeTab) {
      reportTabChange('Notifications', tab, 'system');
      setActiveTab(tab);
    }
    if (location.pathname === '/notifications') {
      navigate('/notifications/all', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleTabChange = (id: string) => {
    setActiveTab(id as NotificationTab);
    navigate(`/notifications/${id}`);
  };

  const markAsRead = async (id: string | number) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    await notificationService.markAsRead(numericId);
    setNotifications(prev => prev.map(n => n.id === numericId ? { ...n, is_read: true } : n));
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    await Promise.all(unread.map(n => notificationService.markAsRead(n.id)));
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const deleteNotification = async (id: string | number) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    await notificationService.deleteNotification(numericId);
    setNotifications(prev => prev.filter(n => n.id !== numericId));
  };

  const stats = [
    { label: "Throughput", value: "840 msg/s", icon: Signal, color: "text-blue-500" },
    { label: "Uplink", value: "STABLE", icon: Wifi, color: "text-emerald-500" },
    { label: "Latency", value: "4MS", icon: Radio, color: "text-amber-500" },
  ];

  const bottomMetrics = (
    <>
      <div className="flex items-center gap-3">
        <Bell className="w-4 h-4 text-[#bd4a4a]" />
        <div>
          <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none">Pending Alerts</p>
          <p className="text-[10px] font-black text-white uppercase tracking-tight">{notifications.filter(n => !n.is_read).length} Critical Signals</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <CheckCircle className="w-4 h-4 text-emerald-500" />
        <div>
          <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none">Status</p>
          <p className="text-[10px] font-black text-white uppercase tracking-tight">Real-time Synchronization Active</p>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    if (loading) return <div className="py-20 animate-pulse text-center text-zinc-600 uppercase tracking-widest text-[10px] font-black">Syncing Signals...</div>;

    const mapped = notifications.map(n => ({
      id: n.id.toString(),
      title: n.title,
      message: n.message,
      type: n.type.toLowerCase() as any,
      read: n.is_read,
      timestamp: new Date(n.created_at).toLocaleDateString()
    }));

    const filtered = mapped.filter(n => 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const props = { notifications: filtered, onMarkRead: markAsRead, onDelete: deleteNotification };

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
