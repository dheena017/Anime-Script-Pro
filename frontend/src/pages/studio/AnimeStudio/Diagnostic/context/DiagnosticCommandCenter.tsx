import React, { createContext, useContext, useState } from 'react';

export type ModuleStatus = 'idle' | 'syncing' | 'healthy' | 'error';

export interface ModuleHealth {
  id: string;
  name: string;
  status: ModuleStatus;
  lastSync: Date | null;
  version: string;
  loadTime: number;
}

interface DiagnosticContextType {
  modules: Record<string, ModuleHealth>;
  updateModuleStatus: (id: string, status: ModuleStatus) => void;
  updateModuleMetrics: (id: string, metrics: Partial<Pick<ModuleHealth, 'version' | 'loadTime'>>) => void;
  systemIntegrity: number;
}

const DiagnosticContext = createContext<DiagnosticContextType | null>(null);

export const useDiagnostic = () => {
  const context = useContext(DiagnosticContext);
  if (!context) throw new Error('useDiagnostic must be used within DiagnosticProvider');
  return context;
};

export const DiagnosticProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<Record<string, ModuleHealth>>({
    world: { id: 'world', name: 'World Engine', status: 'idle', lastSync: null, version: '1.0.0', loadTime: 0 },
    cast: { id: 'cast', name: 'Cast Nexus', status: 'idle', lastSync: null, version: '1.2.0', loadTime: 0 },
    series: { id: 'series', name: 'Series Architect', status: 'idle', lastSync: null, version: '1.0.1', loadTime: 0 },
    script: { id: 'script', name: 'Script Weaver', status: 'idle', lastSync: null, version: '2.1.0', loadTime: 0 },
    storyboard: { id: 'storyboard', name: 'Visualizer', status: 'idle', lastSync: null, version: '1.0.0', loadTime: 0 },
    assets: { id: 'assets', name: 'Asset Vault', status: 'idle', lastSync: null, version: '1.0.0', loadTime: 0 },
    prompts: { id: 'prompts', name: 'Prompt Library', status: 'idle', lastSync: null, version: '1.0.5', loadTime: 0 },
    seo: { id: 'seo', name: 'Meta Engine', status: 'idle', lastSync: null, version: '1.0.0', loadTime: 0 },
    screening: { id: 'screening', name: 'Review Suite', status: 'idle', lastSync: null, version: '1.0.0', loadTime: 0 },
  });

  const updateModuleStatus = React.useCallback((id: string, status: ModuleStatus) => {
    setModules(prev => {
      // Avoid state updates if the status and relevant fields haven't changed
      const current = prev[id];
      if (current && current.status === status) return prev;

      return {
        ...prev,
        [id]: { 
          ...prev[id], 
          status, 
          lastSync: status === 'healthy' ? new Date() : prev[id].lastSync 
        }
      };
    });
  }, []);

  const updateModuleMetrics = React.useCallback((id: string, metrics: Partial<Pick<ModuleHealth, 'version' | 'loadTime'>>) => {
    setModules(prev => ({
      ...prev,
      [id]: { ...prev[id], ...metrics }
    }));
  }, []);

  const systemIntegrity = Math.round((Object.values(modules).filter(m => m.status === 'healthy').length / Object.values(modules).length) * 100);

  return (
    <DiagnosticContext.Provider value={{ modules, updateModuleStatus, updateModuleMetrics, systemIntegrity }}>
      {children}
    </DiagnosticContext.Provider>
  );
};
