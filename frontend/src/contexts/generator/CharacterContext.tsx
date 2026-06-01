import React, { createContext, useContext, useState } from 'react';

interface CharacterState {
  characterProfiles: string | null;
  characterData: any | null;
  characterList: any[];
  characterRelationships: string | null;
  isGeneratingCharacters: boolean;
  generatedCharacters?: string | null;
}

interface CharacterDispatch {
  setCharacterProfiles: (c: string | null) => void;
  setCharacterData: (d: any | null) => void;
  setCharacterList: (l: any[]) => void;
  setCharacterRelationships: (r: string | null) => void;
  setIsGeneratingCharacters: (b: boolean) => void;
  setGeneratedCharacters?: (c: string | null) => void;
}

const CharacterStateContext = createContext<CharacterState | undefined>(undefined);
const CharacterDispatchContext = createContext<CharacterDispatch | undefined>(undefined);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [characterProfiles, setCharacterProfiles] = useState<string | null>(null);
  const [characterData, setCharacterData] = useState<any | null>(null);
  const [characterList, setCharacterList] = useState<any[]>([]);
  const [characterRelationships, setCharacterRelationships] = useState<string | null>(null);
  const [isGeneratingCharacters, setIsGeneratingCharacters] = useState(false);
  const [generatedCharacters, setGeneratedCharacters] = useState<string | null>(null);

  const state = { characterProfiles, characterData, characterList, characterRelationships, isGeneratingCharacters, generatedCharacters };
  const dispatch = { setCharacterProfiles, setCharacterData, setCharacterList, setCharacterRelationships, setIsGeneratingCharacters, setGeneratedCharacters };

  return (
    <CharacterStateContext.Provider value={state}>
      <CharacterDispatchContext.Provider value={dispatch}>
        {children}
      </CharacterDispatchContext.Provider>
    </CharacterStateContext.Provider>
  );
}

export const useCharacterState = () => {
  const context = useContext(CharacterStateContext);
  if (context === undefined) throw new Error('useCharacterState must be used within CharacterProvider');
  return context;
};

export const useCharacterDispatch = () => {
  const context = useContext(CharacterDispatchContext);
  if (context === undefined) throw new Error('useCharacterDispatch must be used within CharacterProvider');
  return context;
};

// ── Backward-compat re-exports ─────────────────────────────────────────────
// These aliases allow gradual consumer migration without breaking imports.
export const CastProvider = CharacterProvider;
export const useCastState = useCharacterState;
export const useCastDispatch = useCharacterDispatch;
