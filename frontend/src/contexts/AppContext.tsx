import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
  notification: { message: string; type: 'error' | 'success' | 'info' } | null;
  showNotification: (message: string, type?: 'error' | 'success' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userTier] = useState<string>('Enterprise Plan');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const showNotification = useCallback((message: string, type: 'error' | 'success' | 'info' = 'info') => {
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
      {notification && (
        <div className={`fixed bottom-8 right-8 z-[100] p-4 rounded-2xl border backdrop-blur-md animate-in slide-in-from-right-10 duration-500 shadow-2xl ${notification.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-red-500/20' :
          notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-emerald-500/20' :
            'bg-cyan-500/10 border-cyan-500/50 text-cyan-500 shadow-cyan-500/20'
          }`}>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${notification.type === 'error' ? 'bg-red-500' :
              notification.type === 'success' ? 'bg-emerald-500' :
                'bg-cyan-500'
              }`} />
            <p className="text-xs font-black uppercase tracking-widest">{notification.message}</p>
          </div>
        </div>
      )}
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



