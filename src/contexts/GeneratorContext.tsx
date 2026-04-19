import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  Timestamp 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/error-utils';

interface GeneratorContextType {
  prompt: string;
  setPrompt: (p: string) => void;
  generatedScript: string | null;
  setGeneratedScript: (s: string | null) => void;
  generatedCharacters: string | null;
  setGeneratedCharacters: (c: string | null) => void;
  generatedMetadata: string | null;
  setGeneratedMetadata: (m: string | null) => void;
  generatedImagePrompts: string | null;
  setGeneratedImagePrompts: (p: string | null) => void;
  generatedSeriesPlan: string | null;
  setGeneratedSeriesPlan: (s: string | null) => void;
  generatedDescription: string | null;
  setGeneratedDescription: (d: string | null) => void;
  generatedWorld: string | null;
  setGeneratedWorld: (w: string | null) => void;
  visualData: Record<number, string>;
  setVisualData: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  narrativeBeats: string | null;
  setNarrativeBeats: (b: string | null) => void;
  recapperPersona: string;
  setRecapperPersona: (p: string) => void;
  characterRelationships: string | null;
  setCharacterRelationships: (r: string | null) => void;
  tone: string;
  setTone: (t: string) => void;
  audience: string;
  setAudience: (a: string) => void;
  episode: string;
  setEpisode: (e: string) => void;
  session: string;
  setSession: (s: string) => void;
  numScenes: string;
  setNumScenes: (n: string) => void;
  contentType: string;
  setContentType: (t: string) => void;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  isLoading: boolean;
  setIsLoading: (l: boolean) => void;
  isGeneratingCharacters: boolean;
  setIsGeneratingCharacters: (l: boolean) => void;
  isGeneratingMetadata: boolean;
  setIsGeneratingMetadata: (l: boolean) => void;
  isGeneratingImagePrompts: boolean;
  setIsGeneratingImagePrompts: (l: boolean) => void;
  isGeneratingSeries: boolean;
  setIsGeneratingSeries: (l: boolean) => void;
  isGeneratingDescription: boolean;
  setIsGeneratingDescription: (l: boolean) => void;
  isGeneratingWorld: boolean;
  setIsGeneratingWorld: (l: boolean) => void;
  isEditing: boolean;
  setIsEditing: (e: boolean) => void;
  isSaving: boolean;
  setIsSaving: (s: boolean) => void;
  isContinuingScript: boolean;
  setIsContinuingScript: (c: boolean) => void;
  currentScriptId: string | null;
  setCurrentScriptId: (id: string | null) => void;
  history: any[];
}

const GeneratorContext = createContext<GeneratorContextType | undefined>(undefined);

export function GeneratorProvider({ children }: { children: React.ReactNode }) {
  const [user] = useAuthState(auth);
  const [prompt, setPrompt] = useState('');
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [generatedCharacters, setGeneratedCharacters] = useState<string | null>(null);
  const [generatedMetadata, setGeneratedMetadata] = useState<string | null>(null);
  const [generatedImagePrompts, setGeneratedImagePrompts] = useState<string | null>(null);
  const [generatedSeriesPlan, setGeneratedSeriesPlan] = useState<string | null>(null);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  const [generatedWorld, setGeneratedWorld] = useState<string | null>(null);
  const [visualData, setVisualData] = useState<Record<number, string>>({});
  const [narrativeBeats, setNarrativeBeats] = useState<string | null>(null);
  const [recapperPersona, setRecapperPersona] = useState('Dynamic/Hype');
  const [characterRelationships, setCharacterRelationships] = useState<string | null>(null);
  const [tone, setTone] = useState('Hype/Energetic');
  const [audience, setAudience] = useState('General Fans');
  const [episode, setEpisode] = useState('1');
  const [session, setSession] = useState('1');
  const [numScenes, setNumScenes] = useState('6');
  const [contentType, setContentType] = useState('Anime');
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCharacters, setIsGeneratingCharacters] = useState(false);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [isGeneratingImagePrompts, setIsGeneratingImagePrompts] = useState(false);
  const [isGeneratingSeries, setIsGeneratingSeries] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingWorld, setIsGeneratingWorld] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isContinuingScript, setIsContinuingScript] = useState(false);
  const [currentScriptId, setCurrentScriptId] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const q = query(
      collection(db, 'scripts'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.prompt ? (data.prompt.slice(0, 30) + (data.prompt.length > 30 ? '...' : '')) : 'Untitled',
          date: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toLocaleDateString() : 'Just now',
          script: data.script,
          prompt: data.prompt,
          tone: data.tone,
          audience: data.audience,
          episode: data.episode,
          session: data.session,
          contentType: data.contentType,
          model: data.model
        };
      });
      setHistory(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'scripts');
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <GeneratorContext.Provider value={{
      prompt, setPrompt,
      generatedScript, setGeneratedScript,
      generatedCharacters, setGeneratedCharacters,
      generatedMetadata, setGeneratedMetadata,
      generatedImagePrompts, setGeneratedImagePrompts,
      generatedSeriesPlan, setGeneratedSeriesPlan,
      generatedDescription, setGeneratedDescription,
      narrativeBeats, setNarrativeBeats,
      recapperPersona, setRecapperPersona,
      characterRelationships, setCharacterRelationships,
      tone, setTone,
      audience, setAudience,
      episode, setEpisode,
      session, setSession,
      numScenes, setNumScenes,
      contentType, setContentType,
      selectedModel, setSelectedModel,
      isLoading, setIsLoading,
      isGeneratingCharacters, setIsGeneratingCharacters,
      isGeneratingMetadata, setIsGeneratingMetadata,
      isGeneratingImagePrompts, setIsGeneratingImagePrompts,
      isGeneratingSeries, setIsGeneratingSeries,
      isGeneratingDescription, setIsGeneratingDescription,
      isGeneratingWorld, setIsGeneratingWorld,
      isEditing, setIsEditing,
      isSaving, setIsSaving,
      isContinuingScript, setIsContinuingScript,
      currentScriptId, setCurrentScriptId,
      history,
      visualData, setVisualData,
      generatedWorld, setGeneratedWorld
    }}>
      {children}
    </GeneratorContext.Provider>
  );
}

export function useGenerator() {
  const context = useContext(GeneratorContext);
  if (context === undefined) {
    throw new Error('useGenerator must be used within a GeneratorProvider');
  }
  return context;
}
