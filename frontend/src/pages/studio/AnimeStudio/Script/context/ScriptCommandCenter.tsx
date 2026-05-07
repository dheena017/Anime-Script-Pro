import { ScriptTab } from '../Tabs/ScriptTabs';
import { analyzeScript, AnalysisResponse } from '@/services/api/analysis';
import { useDiagnostic } from '../../Diagnostic/context/DiagnosticCommandCenter';
import React from 'react';

/**
 * The Command Center for the Script Studio.
 * This manages the unified state and data flow for all 8 production tabs.
 */

export interface ScriptDataContextType {
  // Core Data
  generatedScript: string | null;
  activeTab: ScriptTab;
  isAnalyzing: boolean;
  
  // High-Fidelity Technical Data
  technicalData: {
    cinematics: {
      shotList: Array<{ id: string; type: string; action: string }>;
      lenses: string[];
    };
    pulse: {
      energyLevels: number[];
      tensionScore: number;
    };
    audio: {
      vocalProfiles: Array<{ name: string; levels: number }>;
      bgmTrack: string;
    };
  };

  // Handlers
  handlers: {
    exportToPDF: () => void;
    generateSEO: () => void;
    generateVisuals: () => void;
    continueScript: () => void;
    playVoiceover: () => void;
  };
}

export const ScriptCommandCenterContext = React.createContext<ScriptDataContextType | null>(null);

export const useScriptCommandCenter = () => {
  const context = React.useContext(ScriptCommandCenterContext);
  if (!context) {
    throw new Error('useScriptCommandCenter must be used within a ScriptCommandCenterProvider');
  }
  return context;
};

interface ProviderProps {
  children: React.ReactNode;
  activeTab: ScriptTab;
  generatedScript: string | null;
  handlers: any;
}

export const ScriptCommandCenterProvider: React.FC<ProviderProps> = ({ 
  children, 
  activeTab, 
  generatedScript,
  handlers 
}) => {
  const { updateModuleStatus, updateModuleMetrics } = useDiagnostic();

  React.useEffect(() => {
    if (generatedScript && generatedScript.length > 0) {
      updateModuleStatus('script', 'healthy');
    }
  }, [generatedScript, updateModuleStatus]);

  const [technicalData, setTechnicalData] = React.useState<AnalysisResponse>({
    shot_list: [
      { id: 'SCN_01', type: 'EXT. CITY - WIDE', action: 'Drone sweep across the neon skyline.' },
      { id: 'SCN_02', type: 'INT. LAB - CLOSE', action: 'Focus on character eyes reflecting the data stream.' },
    ],
    lenses: ['35mm Anamorphic', '50mm Prime', '85mm Portrait'],
    energy_levels: Array.from({ length: 40 }, () => Math.random() * 100),
    tension_score: 78,
    vocal_profiles: [
      { name: 'Kaelen', levels: 65 },
      { name: 'Nova', levels: 85 },
    ],
    bgm_track: 'Synth-Wave #04'
  });

  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  React.useEffect(() => {
    const triggerAnalysis = async () => {
      if (!generatedScript || generatedScript.length < 100) return;
      
      setIsAnalyzing(true);
      updateModuleStatus('script', 'syncing');
      const start = performance.now();
      try {
        const data = await analyzeScript(generatedScript);
        setTechnicalData(data);
        updateModuleMetrics('script', { loadTime: Math.round(performance.now() - start) });
        updateModuleStatus('script', 'healthy');
      } catch (err) {
        console.error("Neural Analysis Failed:", err);
        updateModuleStatus('script', 'error');
      } finally {
        setIsAnalyzing(false);
      }
    };

    const timeout = setTimeout(triggerAnalysis, 2000); // Debounce
    return () => clearTimeout(timeout);
  }, [generatedScript]);

  const value: ScriptDataContextType = {
    generatedScript,
    activeTab,
    isAnalyzing,
    technicalData: {
      cinematics: {
        shotList: technicalData.shot_list,
        lenses: technicalData.lenses
      },
      pulse: {
        energyLevels: technicalData.energy_levels,
        tensionScore: technicalData.tension_score
      },
      audio: {
        vocalProfiles: technicalData.vocal_profiles,
        bgmTrack: technicalData.bgm_track
      }
    },
    handlers: {
      exportToPDF: handlers.exportToPDF || (() => {}),
      generateSEO: handlers.handleGenerateSEO || (() => {}),
      generateVisuals: handlers.handleGenerateVisuals || (() => {}),
      continueScript: handlers.handleContinueScript || (() => {}),
      playVoiceover: handlers.playVoiceover || (() => {}),
    }
  };

  return (
    <ScriptCommandCenterContext.Provider value={value}>
      {children}
    </ScriptCommandCenterContext.Provider>
  );
};
