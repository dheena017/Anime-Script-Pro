import React, { createContext, useContext, useState } from 'react';

interface CastState {
  castProfiles: string | null;
  castData: any | null;
  castList: any[];
  characterRelationships: string | null;
  isGeneratingCharacters: boolean;
  generatedCharacters?: string | null;
}

interface CastDispatch {
  setCastProfiles: (c: string | null) => void;
  setCastData: (d: any | null) => void;
  setCastList: (l: any[]) => void;
  setCharacterRelationships: (r: string | null) => void;
  setIsGeneratingCharacters: (b: boolean) => void;
  setGeneratedCharacters?: (c: string | null) => void;
}

const CastStateContext = createContext<CastState | undefined>(undefined);
const CastDispatchContext = createContext<CastDispatch | undefined>(undefined);

export function CastProvider({ children }: { children: React.ReactNode }) {
  const [castProfiles, setCastProfiles] = useState<string | null>(null);
  const [castData, setCastData] = useState<any | null>(null);
  const [castList, setCastList] = useState<any[]>([]);
  const [characterRelationships, setCharacterRelationships] = useState<string | null>(null);
  const [isGeneratingCharacters, setIsGeneratingCharacters] = useState(false);
  const [generatedCharacters, setGeneratedCharacters] = useState<string | null>(null);

  const state = { castProfiles, castData, castList, characterRelationships, isGeneratingCharacters, generatedCharacters };
  const dispatch = { setCastProfiles, setCastData, setCastList, setCharacterRelationships, setIsGeneratingCharacters, setGeneratedCharacters };

  return (
    <CastStateContext.Provider value={state}>
      <CastDispatchContext.Provider value={dispatch}>
        {children}
      </CastDispatchContext.Provider>
    </CastStateContext.Provider>
  );
}

export const useCastState = () => {
  const context = useContext(CastStateContext);
  if (context === undefined) throw new Error('useCastState must be used within CastProvider');
  return context;
};

export const useCastDispatch = () => {
  const context = useContext(CastDispatchContext);
  if (context === undefined) throw new Error('useCastDispatch must be used within CastProvider');
  return context;
};
