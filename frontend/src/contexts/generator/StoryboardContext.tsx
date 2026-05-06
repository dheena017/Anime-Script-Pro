import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface StoryboardState {
  scenes: any[];
  visualData: Record<number, string[]>;
  videoData: Record<number, string>;
  isGeneratingVisuals: boolean;
  enhancingSceneIds: any;
}

type StoryboardAction =
  | { type: 'SET_SCENES'; payload: any[] }
  | { type: 'SET_VISUAL_DATA'; payload: Record<number, string[]> }
  | { type: 'SET_VIDEO_DATA'; payload: Record<number, string> }
  | { type: 'SET_GENERATING_VISUALS'; payload: boolean }
  | { type: 'SET_ENHANCING_SCENES'; payload: number[] }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_ENHANCING_SCENE'; payload: { id: number; isEnhancing: boolean } }
  | { type: 'UPDATE_SCENE'; id: number; updates: any }
  | { type: 'UPDATE_VISUAL_ITEM'; sceneIndex?: number; images?: string[]; payload?: { id: number; data: string[] } }
  | { type: 'UPDATE_VIDEO_ITEM'; sceneIndex?: number; url?: string; payload?: { id: number; data: string } };

const initialState: StoryboardState = {
  scenes: [],
  visualData: {},
  videoData: {},
  isGeneratingVisuals: false,
  enhancingSceneIds: [],
};

function storyboardReducer(state: StoryboardState, action: StoryboardAction): StoryboardState {
  switch (action.type) {
    case 'SET_SCENES':
      return { ...state, scenes: action.payload };
    case 'SET_VISUAL_DATA':
      return { ...state, visualData: action.payload };
    case 'SET_VIDEO_DATA':
      return { ...state, videoData: action.payload };
    case 'SET_GENERATING_VISUALS':
      return { ...state, isGeneratingVisuals: action.payload };
    case 'SET_ENHANCING_SCENES':
        return { ...state, enhancingSceneIds: action.payload };
      case 'SET_GENERATING':
        return { ...state, isGeneratingVisuals: action.payload };
      case 'SET_ENHANCING_SCENE':
        // payload: { id, isEnhancing }
        if (action.payload && typeof action.payload.id !== 'undefined') {
          const id = action.payload.id;
          const isEnhancing = action.payload.isEnhancing;
          const set = new Set(Array.isArray(state.enhancingSceneIds) ? state.enhancingSceneIds.map(String) : Array.from(state.enhancingSceneIds || []));
          if (isEnhancing) set.add(String(id)); else set.delete(String(id));
          return { ...state, enhancingSceneIds: set };
        }
        return state;
    case 'UPDATE_SCENE':
      return {
        ...state,
        scenes: state.scenes.map((s, idx) => idx === action.id ? { ...s, ...action.updates } : s)
      };
    case 'UPDATE_VISUAL_ITEM':
        // support both direct images and legacy payload shapes
        if (action.payload && typeof action.payload.id !== 'undefined') {
          return { ...state, visualData: { ...state.visualData, [action.payload.id]: action.payload.data } };
        }
        if (action.sceneIndex !== undefined) {
          return { ...state, visualData: { ...state.visualData, [action.sceneIndex]: action.images || [] } };
        }
        return state;
    case 'UPDATE_VIDEO_ITEM':
        if (action.payload && typeof action.payload.id !== 'undefined') {
          return { ...state, videoData: { ...state.videoData, [action.payload.id]: action.payload.data } };
        }
        if (action.sceneIndex !== undefined) {
          return { ...state, videoData: { ...state.videoData, [action.sceneIndex]: action.url || '' } };
        }
        return state;
    default:
      return state;
  }
}

const StoryboardContext = createContext<{
  state: StoryboardState;
  dispatch: React.Dispatch<StoryboardAction>;
} | undefined>(undefined);

export function StoryboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storyboardReducer, initialState);
  return (
    <StoryboardContext.Provider value={{ state, dispatch }}>
      {children}
    </StoryboardContext.Provider>
  );
}

export function useStoryboard() {
  const context = useContext(StoryboardContext);
  if (!context) throw new Error('useStoryboard must be used within StoryboardProvider');
  return context;
}
