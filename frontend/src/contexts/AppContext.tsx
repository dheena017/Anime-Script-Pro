import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { notificationService } from '@/services/api/notifications';
import { projectService } from '@/services/api/projects';

const LOCAL_USER_ID = 'local-dev-architect-id';

interface AppContextType {
  currentProject: any | null;
  setCurrentProject: (project: any) => void;
  notifications: any[];
  unreadCount: number;
  userTier: string;
  refreshAppData: () => Promise<void>;
  isFullscreen: boolean;
  setIsFullscreen: (f: boolean) => void;
  notification: { message: string; type: 'error' | 'success' | 'info' | 'warning' } | null;
  showNotification: (message: string, type?: 'error' | 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userTier] = useState<string>('Enterprise Plan');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' | 'info' | 'warning' } | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const showNotification = useCallback((message: string, type: 'error' | 'success' | 'info' | 'warning' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Fullscreen change listener - stable effect
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const refreshAppData = useCallback(async () => {
    // 1. Fetch Notifications from FastAPI
    const notifs = await notificationService.getNotifications(LOCAL_USER_ID);
    setNotifications(notifs);

    // 2. Fetch Projects from FastAPI
    try {
      const projects = await projectService.getProjects();
      if (projects && projects.length > 0 && !currentProject) {
        setCurrentProject(projects[0]);
      }
    } catch (e) {
      console.error("Failed to fetch projects in context:", e);
    }
  }, [currentProject]);

  // Only initialize once on mount - NOT on every render
  useEffect(() => {
    if (!hasInitialized) {
      refreshAppData();
      setHasInitialized(true);
    }
  }, [hasInitialized, refreshAppData]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.is_read).length, [notifications]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentProject,
    setCurrentProject,
    notifications,
    unreadCount,
    userTier,
    refreshAppData,
    isFullscreen,
    setIsFullscreen,
    notification,
    showNotification
  }), [currentProject, notifications, unreadCount, userTier, refreshAppData, isFullscreen, notification, showNotification]);

  return (
    <AppContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.message + notification.type}
            initial={{ opacity: 0, x: 120, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 120, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className={`fixed bottom-8 right-8 z-[9999] max-w-sm w-full pointer-events-auto`}
          >
            <div
              className={`relative flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden ${
                notification.type === 'error'
                  ? 'bg-red-950/80 border-red-500/40 text-red-300 shadow-red-900/40'
                  : notification.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 shadow-emerald-900/40'
                  : notification.type === 'warning'
                  ? 'bg-amber-950/80 border-amber-500/40 text-amber-300 shadow-amber-900/40'
                  : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 shadow-cyan-900/40'
              }`}
            >
              {/* Glow stripe */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                  notification.type === 'error'
                    ? 'bg-red-500'
                    : notification.type === 'success'
                    ? 'bg-emerald-500'
                    : notification.type === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-cyan-500'
                }`}
              />
              {/* Icon */}
              <div className="mt-0.5 shrink-0">
                {notification.type === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
                {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {notification.type === 'info' && <Info className="w-5 h-5 text-cyan-400" />}
              </div>
              {/* Message */}
              <p className="text-sm font-semibold leading-snug tracking-wide flex-1 pr-2">
                {notification.message}
              </p>
              {/* Dismiss */}
              <button
                onClick={() => setNotification(null)}
                className="shrink-0 mt-0.5 opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function useAppSafe() {
  return useContext(AppContext);
}



