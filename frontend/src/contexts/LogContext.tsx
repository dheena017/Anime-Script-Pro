import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface LogEntry {
  id: string;
  created_at: string;
  module: string;
  status: string;
  message?: string;
  model_used?: string;
}

interface LogStateContextType {
  masterLogs: LogEntry[];
}

interface LogDispatchContextType {
  addLog: (module: string, status: string, message?: string, model_used?: string) => void;
  clearLogs: () => void;
}

const LogStateContext = createContext<LogStateContextType | undefined>(undefined);
const LogDispatchContext = createContext<LogDispatchContextType | undefined>(undefined);

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [masterLogs, setMasterLogs] = useState<LogEntry[]>([]);

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
  }, []);

  const stateValue = useMemo(() => ({ masterLogs }), [masterLogs]);
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
