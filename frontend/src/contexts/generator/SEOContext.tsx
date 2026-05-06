import React, { createContext, useContext, useState } from 'react';

interface SEOState {
  generatedMetadata: string | null;
  generatedDescription: string | null;
  generatedAltText: string | null;
  generatedGrowthStrategy: string | null;
  generatedDistributionPlan: string | null;
  isGeneratingMetadata: boolean;
  isGeneratingDescription: boolean;
  isGeneratingAltText: boolean;
  isGeneratingGrowthStrategy: boolean;
  isGeneratingDistribution: boolean;
}

interface SEODispatch {
  setGeneratedMetadata: (m: string | null) => void;
  setGeneratedDescription: (d: string | null) => void;
  setGeneratedAltText: (a: string | null) => void;
  setGeneratedGrowthStrategy: (s: string | null) => void;
  setGeneratedDistributionPlan: (s: string | null) => void;
  setIsGeneratingMetadata: (b: boolean) => void;
  setIsGeneratingDescription: (b: boolean) => void;
  setIsGeneratingAltText: (b: boolean) => void;
  setIsGeneratingGrowthStrategy: (b: boolean) => void;
  setIsGeneratingDistribution: (b: boolean) => void;
}

const SEOStateContext = createContext<SEOState | undefined>(undefined);
const SEODispatchContext = createContext<SEODispatch | undefined>(undefined);

export function SEOProvider({ children }: { children: React.ReactNode }) {
  const [generatedMetadata, setGeneratedMetadata] = useState<string | null>(null);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  const [generatedAltText, setGeneratedAltText] = useState<string | null>(null);
  const [generatedGrowthStrategy, setGeneratedGrowthStrategy] = useState<string | null>(null);
  const [generatedDistributionPlan, setGeneratedDistributionPlan] = useState<string | null>(null);
  
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingAltText, setIsGeneratingAltText] = useState(false);
  const [isGeneratingGrowthStrategy, setIsGeneratingGrowthStrategy] = useState(false);
  const [isGeneratingDistribution, setIsGeneratingDistribution] = useState(false);

  const state = { 
    generatedMetadata, generatedDescription, generatedAltText, 
    generatedGrowthStrategy, generatedDistributionPlan,
    isGeneratingMetadata, isGeneratingDescription, isGeneratingAltText,
    isGeneratingGrowthStrategy, isGeneratingDistribution
  };
  
  const dispatch = { 
    setGeneratedMetadata, setGeneratedDescription, setGeneratedAltText, 
    setGeneratedGrowthStrategy, setGeneratedDistributionPlan,
    setIsGeneratingMetadata, setIsGeneratingDescription, setIsGeneratingAltText,
    setIsGeneratingGrowthStrategy, setIsGeneratingDistribution
  };

  return (
    <SEOStateContext.Provider value={state}>
      <SEODispatchContext.Provider value={dispatch}>
        {children}
      </SEODispatchContext.Provider>
    </SEOStateContext.Provider>
  );
}

export const useSEOState = () => {
  const context = useContext(SEOStateContext);
  if (context === undefined) throw new Error('useSEOState must be used within SEOProvider');
  return context;
};

export const useSEODispatch = () => {
  const context = useContext(SEODispatchContext);
  if (context === undefined) throw new Error('useSEODispatch must be used within SEOProvider');
  return context;
};
