import React, { createContext, useContext, useState } from 'react';

interface WorldState {
  architecture: string | null;
  atlas: string | null;
  historyLore: string | null;
  systems: string | null;
  culture: string | null;
  generatedWorld: string | null;
  isGeneratingWorld: boolean;
}

interface WorldDispatch {
  setArchitecture: (s: string | null) => void;
  setAtlas: (s: string | null) => void;
  setHistoryLore: (s: string | null) => void;
  setSystems: (s: string | null) => void;
  setCulture: (s: string | null) => void;
  setGeneratedWorld: (w: string | null) => void;
  setIsGeneratingWorld: (b: boolean) => void;
}

const WorldStateContext = createContext<WorldState | undefined>(undefined);
const WorldDispatchContext = createContext<WorldDispatch | undefined>(undefined);

export function WorldProvider({ children }: { children: React.ReactNode }) {
  const [architecture, setArchitecture] = useState<string | null>(null);
  const [atlas, setAtlas] = useState<string | null>(null);
  const [historyLore, setHistoryLore] = useState<string | null>(null);
  const [systems, setSystems] = useState<string | null>(null);
  const [culture, setCulture] = useState<string | null>(null);
  const [generatedWorld, setGeneratedWorld] = useState<string | null>(null);
  const [isGeneratingWorld, setIsGeneratingWorld] = useState(false);

  const state = { architecture, atlas, historyLore, systems, culture, generatedWorld, isGeneratingWorld };
  const dispatch = { setArchitecture, setAtlas, setHistoryLore, setSystems, setCulture, setGeneratedWorld, setIsGeneratingWorld };

  return (
    <WorldStateContext.Provider value={state}>
      <WorldDispatchContext.Provider value={dispatch}>
        {children}
      </WorldDispatchContext.Provider>
    </WorldStateContext.Provider>
  );
}

export const useWorldState = () => {
  const context = useContext(WorldStateContext);
  if (context === undefined) throw new Error('useWorldState must be used within WorldProvider');
  return context;
};

export const useWorldDispatch = () => {
  const context = useContext(WorldDispatchContext);
  if (context === undefined) throw new Error('useWorldDispatch must be used within WorldProvider');
  return context;
};
