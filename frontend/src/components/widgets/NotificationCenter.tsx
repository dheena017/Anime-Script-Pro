import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ExternalLink, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { notificationService } from '@/services/api/notifications';
import { Link } from 'react-router-dom';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, refreshAppData } = useApp();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: number) => {
    await notificationService.markAsRead(id);
    refreshAppData();
  };

  const markAllAsRead = async () => {
    // For simplicity, we loop through and mark each as read
    // In a real app, you'd have a bulk mark as read endpoint
    const unread = notifications.filter(n => !n.is_read);
    await Promise.all(unread.map(n => notificationService.markAsRead(n.id)));
    refreshAppData();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#bd4a4a] rounded-full border-2 border-black animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100]"
          >
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Transmissions</h3>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-black">
                  {unreadCount} NEW
                </span>
              </div>
              <button 
                onClick={markAllAsRead}
                className="text-[10px] text-[#bd4a4a] hover:text-white transition-colors font-black uppercase tracking-widest"
              >
                Sync All
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="py-12 px-6 text-center">
                  <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800/50">
                    <Bell className="w-5 h-5 text-zinc-600" />
                  </div>
                  <p className="text-sm text-zinc-500 font-medium">Archived frequency clear.</p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">No active updates detected</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/50">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-4 transition-colors relative group hover:bg-white/[0.02] ${notif.is_read ? 'opacity-60' : 'bg-[#bd4a4a]/[0.02]'}`}
                    >
                      <div className="flex gap-4">
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.is_read ? 'bg-zinc-800' : 'bg-[#bd4a4a]'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-0.5">
                            <h4 className="text-xs font-bold text-zinc-200 truncate">{notif.title}</h4>
                            <span className="text-[9px] text-zinc-600 font-mono whitespace-nowrap">
                              {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 leading-relaxed mb-2">
                            {notif.message}
                          </p>
                          
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => markAsRead(notif.id)}
                              className="text-[9px] font-black uppercase tracking-widest text-[#bd4a4a] hover:text-white transition-colors"
                            >
                              Verify
                            </button>
                            {notif.path && (
                              <Link 
                                to={notif.path}
                                onClick={() => { setIsOpen(false); markAsRead(notif.id); }}
                                className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                              >
                                View <ExternalLink className="w-2 h-2" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/notifications" 
              onClick={() => setIsOpen(false)}
              className="block p-4 text-center border-t border-zinc-800 hover:bg-white/[0.02] transition-colors group"
            >
              <span className="text-[10px] font-black text-zinc-400 group-hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                Open Command Archive Center
                <X className="w-2.5 h-2.5" />
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

