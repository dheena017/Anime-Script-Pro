import React, { createContext, useContext, useState, ReactNode } from 'react';

type SystemStatus = 'online' | 'degraded' | 'offline';

interface SystemContextType {
  status: SystemStatus;
  setStatus: (status: SystemStatus) => void;
  logs: string[];
  addLog: (log: string) => void;
  clearLogs: () => void;
  restartKernel: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<SystemStatus>('online');
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Core initialized']);

  const addLog = (log: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`].slice(-100));
  const clearLogs = () => setLogs([]);
  const restartKernel = () => {
    setStatus('degraded');
    addLog('Restarting system kernel...');
    setTimeout(() => {
      setStatus('online');
      addLog('Kernel restart complete.');
    }, 2000);
  };

  return (
    <SystemContext.Provider value={{ status, setStatus, logs, addLog, clearLogs, restartKernel }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
