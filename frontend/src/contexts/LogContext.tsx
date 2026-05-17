import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { getBackendWsUrl, isBackendOnline } from '@/lib/api-utils';

export interface LogEntry {
  id: string;
  created_at: string;
  module: string;
  status: string;
  message?: string;
  model_used?: string;
}

export interface ProgressEntry {
  project_id: number;
  progress: number;
  current: number;
  total: number;
  message: string;
}

interface LogStateContextType {
  masterLogs: LogEntry[];
  dbLogs: LogEntry[];
  manifestationProgress: ProgressEntry | null;
}

interface LogDispatchContextType {
  addLog: (module: string, status: string, message?: string, model_used?: string) => void;
  clearLogs: () => void;
}

const LogStateContext = createContext<LogStateContextType | undefined>(undefined);
const LogDispatchContext = createContext<LogDispatchContextType | undefined>(undefined);

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [masterLogs, setMasterLogs] = React.useState<LogEntry[]>([]);
  const [dbLogs, setDbLogs] = React.useState<LogEntry[]>([]);
  const [manifestationProgress, setManifestationProgress] = React.useState<ProgressEntry | null>(null);

  const addDbLog = React.useCallback((log: LogEntry) => {
    setDbLogs(prev => [log, ...prev].slice(0, 100));
  }, []);

  React.useEffect(() => {
    const wsUrl = getBackendWsUrl('/ws/telemetry');
    let ws: WebSocket | null = null;
    let timeout: number | null = null;
    let cancelled = false;

    async function connect() {
      if (cancelled) return;
      const backendOnline = await isBackendOnline();
      if (cancelled || !backendOnline) {
        timeout = window.setTimeout(connect, 15000);
        return;
      }

      try {
        ws = new WebSocket(wsUrl);
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'PROGRESS') {
              setManifestationProgress(data);
            } else {
              // Add all other telemetry logs to dbLogs
              addDbLog(data);
            }
          } catch (e) {
            console.error('Failed to parse telemetry log', e);
          }
        };
        ws.onclose = () => {
          if (cancelled) return;
          timeout = window.setTimeout(connect, 5000);
        };
        ws.onerror = (err) => {
          if (!cancelled) {
            console.error('Telemetry WebSocket Error:', err);
          }
          ws?.close();
        };
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to connect to telemetry', e);
          timeout = window.setTimeout(connect, 15000);
        }
      }
    }

    connect();
    return () => {
      cancelled = true;
      if (ws) ws.close();
      if (timeout) clearTimeout(timeout);
    };
  }, [addDbLog]);

  const addLog = useCallback((module: string, status: string, message?: string, model_used?: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      module,
      status,
      message,
      model_used,
    };
    
    setMasterLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  const clearLogs = useCallback(() => {
    setMasterLogs([]);
    setDbLogs([]);
  }, []);

  const stateValue = useMemo(() => ({ masterLogs, dbLogs, manifestationProgress }), [masterLogs, dbLogs, manifestationProgress]);
  const dispatchValue = useMemo(() => ({ addLog, clearLogs }), [addLog, clearLogs]);

  return (
    <LogStateContext.Provider value={stateValue}>
      <LogDispatchContext.Provider value={dispatchValue}>
        {children}
      </LogDispatchContext.Provider>
    </LogStateContext.Provider>
  );
};

export const useLogs = () => {
  const state = useContext(LogStateContext);
  const dispatch = useContext(LogDispatchContext);
  
  if (state === undefined || dispatch === undefined) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  
  return { ...state, ...dispatch };
};

/**
 * Hook to access ONLY the log dispatch functions.
 * Components using this will NOT re-render when logs change.
 */
export const useLogDispatch = () => {
  const context = useContext(LogDispatchContext);
  if (context === undefined) {
    throw new Error('useLogDispatch must be used within a LogProvider');
  }
  return context;
};
