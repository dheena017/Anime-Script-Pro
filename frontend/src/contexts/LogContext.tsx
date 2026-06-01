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

    // Print websocket telemetry logs beautiful styled in actual browser console
    const timeStr = log.created_at ? new Date(log.created_at).toLocaleTimeString() : new Date().toLocaleTimeString();
    const status = log.status || 'INFO';
    const badgeBg = 
      status === 'COMPLETED' || status === 'SUCCESS' || status === 'READY' || status === 'SYNCED' ? '#059669' :
      status === 'STARTING' || status === 'INITIALIZED' || status === 'GENERATING' || status === 'SYNTHESIZING' || status === 'PROCESSED' || status === 'SYNCING' ? '#0891b2' :
      status === 'RETRYING' || status === 'WARNING' ? '#d97706' : '#dc2626';

    const modelPart = log.model_used ? ` (Engine: ${log.model_used})` : '';
    console.log(
      `%c[${timeStr}] [TELEMETRY]%c %c ${log.module} %c %c ${status} %c ${log.message || ''}${modelPart}`,
      'color: #8b5cf6; font-family: monospace; font-weight: bold;',
      '',
      'color: #ffffff; background: #311042; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      '',
      `color: #ffffff; background: ${badgeBg}; padding: 2px 6px; border-radius: 4px; font-weight: bold;`,
      '',
      log.model_used ? 'color: #f472b6; font-weight: 500;' : 'color: inherit;'
    );
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
          if (!cancelled) console.error('Telemetry WebSocket Error:', err);
          timeout = window.setTimeout(connect, 5000);
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
      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      }
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

    // Print local frontend logs beautifully styled in actual browser console
    const timeStr = new Date().toLocaleTimeString();
    const badgeBg = 
      status === 'COMPLETED' || status === 'SUCCESS' || status === 'READY' || status === 'SYNCED' ? '#059669' :
      status === 'STARTING' || status === 'INITIALIZED' || status === 'GENERATING' || status === 'SYNTHESIZING' || status === 'PROCESSED' || status === 'SYNCING' ? '#0891b2' :
      status === 'RETRYING' || status === 'WARNING' ? '#d97706' : '#dc2626';

    const modelPart = model_used ? ` (Engine: ${model_used})` : '';
    console.log(
      `%c[${timeStr}]%c %c ${module} %c %c ${status} %c ${message || ''}${modelPart}`,
      'color: #6b7280; font-family: monospace;',
      '',
      'color: #ffffff; background: #1e1b4b; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      '',
      `color: #ffffff; background: ${badgeBg}; padding: 2px 6px; border-radius: 4px; font-weight: bold;`,
      '',
      model_used ? 'color: #a78bfa; font-weight: 500;' : 'color: inherit;'
    );
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
