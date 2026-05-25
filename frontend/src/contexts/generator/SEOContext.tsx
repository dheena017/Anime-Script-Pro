import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';

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
  const globalState = useGeneratorState();
  const globalDispatch = useGeneratorDispatch();

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

  // Sync Global to Local (e.g. on Load Demo or load session)
  useEffect(() => {
    if (globalState.generatedMetadata !== generatedMetadata) {
      setGeneratedMetadata(globalState.generatedMetadata);
    }
  }, [globalState.generatedMetadata]);

  useEffect(() => {
    if (globalState.generatedDescription !== generatedDescription) {
      setGeneratedDescription(globalState.generatedDescription);
    }
  }, [globalState.generatedDescription]);

  useEffect(() => {
    if (globalState.generatedAltText !== generatedAltText) {
      setGeneratedAltText(globalState.generatedAltText);
    }
  }, [globalState.generatedAltText]);

  useEffect(() => {
    if (globalState.generatedGrowthStrategy !== generatedGrowthStrategy) {
      setGeneratedGrowthStrategy(globalState.generatedGrowthStrategy);
    }
  }, [globalState.generatedGrowthStrategy]);

  useEffect(() => {
    if (globalState.generatedDistributionPlan !== generatedDistributionPlan) {
      setGeneratedDistributionPlan(globalState.generatedDistributionPlan);
    }
  }, [globalState.generatedDistributionPlan]);

  // Sync generating states Global to Local
  useEffect(() => {
    if (globalState.isGeneratingMetadata !== isGeneratingMetadata) {
      setIsGeneratingMetadata(globalState.isGeneratingMetadata);
    }
  }, [globalState.isGeneratingMetadata]);

  useEffect(() => {
    if (globalState.isGeneratingDescription !== isGeneratingDescription) {
      setIsGeneratingDescription(globalState.isGeneratingDescription);
    }
  }, [globalState.isGeneratingDescription]);

  useEffect(() => {
    if (globalState.isGeneratingAltText !== isGeneratingAltText) {
      setIsGeneratingAltText(globalState.isGeneratingAltText);
    }
  }, [globalState.isGeneratingAltText]);

  useEffect(() => {
    if (globalState.isGeneratingGrowthStrategy !== isGeneratingGrowthStrategy) {
      setIsGeneratingGrowthStrategy(globalState.isGeneratingGrowthStrategy);
    }
  }, [globalState.isGeneratingGrowthStrategy]);

  useEffect(() => {
    if (globalState.isGeneratingDistribution !== isGeneratingDistribution) {
      setIsGeneratingDistribution(globalState.isGeneratingDistribution);
    }
  }, [globalState.isGeneratingDistribution]);

  // Sync Local to Global (when user generates or updates SEO)
  useEffect(() => {
    if (generatedMetadata !== globalState.generatedMetadata) {
      globalDispatch.setGeneratedMetadata(generatedMetadata);
    }
  }, [generatedMetadata]);

  useEffect(() => {
    if (generatedDescription !== globalState.generatedDescription) {
      globalDispatch.setGeneratedDescription(generatedDescription);
    }
  }, [generatedDescription]);

  useEffect(() => {
    if (generatedAltText !== globalState.generatedAltText) {
      globalDispatch.setGeneratedAltText(generatedAltText);
    }
  }, [generatedAltText]);

  useEffect(() => {
    if (generatedGrowthStrategy !== globalState.generatedGrowthStrategy) {
      globalDispatch.setGeneratedGrowthStrategy(generatedGrowthStrategy);
    }
  }, [generatedGrowthStrategy]);

  useEffect(() => {
    if (generatedDistributionPlan !== globalState.generatedDistributionPlan) {
      globalDispatch.setGeneratedDistributionPlan(generatedDistributionPlan);
    }
  }, [generatedDistributionPlan]);

  // Sync generating states Local to Global
  useEffect(() => {
    if (isGeneratingMetadata !== globalState.isGeneratingMetadata) {
      globalDispatch.setIsGeneratingMetadata(isGeneratingMetadata);
    }
  }, [isGeneratingMetadata]);

  useEffect(() => {
    if (isGeneratingDescription !== globalState.isGeneratingDescription) {
      globalDispatch.setIsGeneratingDescription(isGeneratingDescription);
    }
  }, [isGeneratingDescription]);

  useEffect(() => {
    if (isGeneratingAltText !== globalState.isGeneratingAltText) {
      globalDispatch.setIsGeneratingAltText(isGeneratingAltText);
    }
  }, [isGeneratingAltText]);

  useEffect(() => {
    if (isGeneratingGrowthStrategy !== globalState.isGeneratingGrowthStrategy) {
      globalDispatch.setIsGeneratingGrowthStrategy(isGeneratingGrowthStrategy);
    }
  }, [isGeneratingGrowthStrategy]);

  useEffect(() => {
    if (isGeneratingDistribution !== globalState.isGeneratingDistribution) {
      globalDispatch.setIsGeneratingDistribution(isGeneratingDistribution);
    }
  }, [isGeneratingDistribution]);

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
