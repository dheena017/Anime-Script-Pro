import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface LogEntry {
  id: string;
  created_at: string;
  module: string;
  status: string;
  message?: string;
  model_used?: string;
}

interface LogContextType {
  masterLogs: LogEntry[];
  addLog: (module: string, status: string, message?: string, model_used?: string) => void;
  clearLogs: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

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

  const value = useMemo(() => ({
    masterLogs,
    addLog,
    clearLogs
  }), [masterLogs, addLog, clearLogs]);

  return (
    <LogContext.Provider value={value}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
};
