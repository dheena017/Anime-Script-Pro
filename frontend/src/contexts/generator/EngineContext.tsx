import React, { createContext, useContext, useState } from 'react';

interface EngineState {
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  tone: string;
  audience: string;
  selectedModel: string;
  contentType: string;
}

interface EngineDispatch {
  setTemperature: (t: number) => void;
  setMaxTokens: (t: number) => void;
  setTopP: (p: number) => void;
  setTopK: (k: number) => void;
  setTone: (t: string) => void;
  setAudience: (a: string) => void;
  setSelectedModel: (m: string) => void;
  setContentType: (t: string) => void;
}

const EngineStateContext = createContext<EngineState | undefined>(undefined);
const EngineDispatchContext = createContext<EngineDispatch | undefined>(undefined);

export function EngineProvider({ children }: { children: React.ReactNode }) {
  const [temperature, setTemperature] = useState(0.85);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topP, setTopP] = useState(0.95);
  const [topK, setTopK] = useState(40);
  const [tone, setTone] = useState('Hype/Energetic');
  const [audience, setAudience] = useState('General Fans');
  const [selectedModel, setSelectedModel] = useState('Gemini-2.5-Flash');
  const [contentType, setContentType] = useState('Anime');

  const dispatch = {
    setTemperature,
    setMaxTokens,
    setTopP,
    setTopK,
    setTone,
    setAudience,
    setSelectedModel,
    setContentType,
  };

  const state = {
    temperature,
    maxTokens,
    topP,
    topK,
    tone,
    audience,
    selectedModel,
    contentType,
  };

  return (
    <EngineStateContext.Provider value={state}>
      <EngineDispatchContext.Provider value={dispatch}>
        {children}
      </EngineDispatchContext.Provider>
    </EngineStateContext.Provider>
  );
}

export const useEngineState = () => {
  const context = useContext(EngineStateContext);
  if (context === undefined) throw new Error('useEngineState must be used within EngineProvider');
  return context;
};

export const useEngineDispatch = () => {
  const context = useContext(EngineDispatchContext);
  if (context === undefined) throw new Error('useEngineDispatch must be used within EngineProvider');
  return context;
};
