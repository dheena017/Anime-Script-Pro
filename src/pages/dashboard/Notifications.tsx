import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Info,
  Trash2,
  MailOpen,
  RefreshCw,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { notificationService } from '@/services/api/notifications';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NotificationType = 'success' | 'warning' | 'error' | 'info' | 'all';

export default function NotificationsPage() {
  const { notifications, refreshAppData } = useApp();
  const [activeFilter, setActiveFilter] = useState<NotificationType>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await refreshAppData();
    } catch (err: any) {
      setError("Sync Interrupted: Unable to reach broadcast node.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      await refreshAppData();
    } catch (err) {
      setError("Protocol Error: Unable to update transmission status.");
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      await refreshAppData();
    } catch (err) {
      setError("Protocol Error: Data purge failed.");
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      await Promise.all(unread.map(n => notificationService.markAsRead(n.id)));
      await refreshAppData();
    } catch (err) {
      setError("Bulk Action Failed: Transmission override unsuccessful.");
    }
  };

  const purgeAll = async () => {
    if (!window.confirm("CRITICAL ACTION: Purge all broadcast data from this node?")) return;
    try {
      await Promise.all(notifications.map(n => notificationService.deleteNotification(n.id)));
      await refreshAppData();
    } catch (err) {
      setError("Bulk Action Failed: Node wipe incomplete.");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const filteredNotifications = notifications.filter(n => 
    activeFilter === 'all' ? true : n.type === activeFilter
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen pt-4 pb-20 max-w-5xl mx-auto px-4">
      {/* 1. HEADER & GLOBAL ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studio/10 border border-studio/20 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-studio">Active Sync</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
            <Bell className="w-10 h-10 text-[#bd4a4a]" />
            BROADCAST <span className="text-[#bd4a4a]">HUB</span>
          </h1>
          <p className="text-zinc-500 max-w-xl uppercase text-[10px] tracking-[0.3em] font-bold leading-relaxed">
            Status reports and updates for your account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-[10px] font-black uppercase tracking-widest rounded-xl h-10 px-4"
          >
            <RefreshCw className={cn("w-3 h-3 mr-2 text-studio", isRefreshing && "animate-spin")} />
            Sync Hub
          </Button>
          <div className="w-[1px] h-6 bg-zinc-800 mx-2" />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={purgeAll}
            className="text-zinc-500 hover:text-red-400 text-[10px] font-black uppercase tracking-widest"
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" />
            Purge All
          </Button>
        </div>
      </div>

      {/* 2. NEURAL FILTERS & BULK ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-800/50 pb-8">
        <div className="flex flex-wrap gap-2">
          {(['all', 'success', 'warning', 'error', 'info'] as NotificationType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
                activeFilter === type 
                  ? "bg-studio/20 border-studio/50 text-studio shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                  : "bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={markAllAsRead}
            className="border-[#bd4a4a]/30 bg-[#bd4a4a]/5 hover:bg-[#bd4a4a]/10 text-[#bd4a4a] text-[10px] font-black uppercase tracking-widest h-10 px-6 rounded-xl"
          >
            <MailOpen className="w-3.5 h-3.5 mr-2" />
            Mark {unreadCount} Read
          </Button>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
        >
          <ShieldAlert className="w-4 h-4 animate-pulse" />
          {error}
        </motion.div>
      )}

      {/* 3. BROADCAST LIST */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass border border-dashed border-zinc-800/50 rounded-[2.5rem] p-20 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-zinc-900/50 border border-zinc-800/50 rounded-3xl flex items-center justify-center mx-auto relative group">
                <div className="absolute inset-0 bg-studio/5 rounded-3xl animate-ping opacity-20" />
                <Bell className="w-8 h-8 text-zinc-700 group-hover:text-studio transition-colors" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Transmission Standby</h2>
                <p className="text-zinc-500 uppercase text-[10px] tracking-[0.3em] font-bold">No active broadcasts matching your current filter.</p>
              </div>
              <Button onClick={() => setActiveFilter('all')} variant="outline" className="h-10 px-8 rounded-xl text-[9px] font-black uppercase tracking-widest border-zinc-800">Reset Filters</Button>
            </motion.div>
          ) : (
            filteredNotifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "group relative overflow-hidden bg-[#0a0a0b]/40 backdrop-blur-md border rounded-[2rem] p-6 flex items-start gap-6 transition-all hover:translate-x-1",
                  notif.read ? "border-zinc-800/40 opacity-70" : "border-studio/30 bg-studio/[0.02] shadow-[0_0_30px_rgba(6,182,212,0.05)]"
                )}
              >
                {!notif.read && (
                  <div className="absolute top-0 left-0 w-[2px] h-full bg-studio shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                )}
                
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/50 group-hover:border-zinc-700 transition-colors">
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={cn(
                      "text-lg font-black tracking-tight uppercase",
                      notif.read ? "text-zinc-400" : "text-white"
                    )}>
                      {notif.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed max-w-2xl group-hover:text-zinc-300 transition-colors uppercase tracking-tight">
                    {notif.message}
                  </p>
                  
                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all">
                      {!notif.read && (
                        <button 
                          onClick={() => markAsRead(notif.id)}
                          className="text-[9px] font-black uppercase tracking-widest text-studio hover:text-white transition-colors flex items-center gap-2"
                        >
                          <MailOpen className="w-3.5 h-3.5" /> Establish Acknowledgment
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notif.id)}
                        className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-400 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Purge Memory
                      </button>
                    </div>
                    
                    <div className="p-2 rounded-lg bg-black/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-studio/10">
                      <ChevronRight className="w-4 h-4 text-zinc-700" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .glass {
          background: rgba(10, 10, 11, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
}





