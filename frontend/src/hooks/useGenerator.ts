import { useContext } from 'react';
import { 
  GeneratorContext, 
  GeneratorStateContext, 
  GeneratorDispatchContext 
} from '@/contexts/GeneratorContext';

/**
 * Hook to access the full Generator context (State + Dispatch).
 * @deprecated Use useGeneratorState or useGeneratorDispatch for better performance.
 */
export function useGenerator() {
  const context = useContext(GeneratorContext);
  if (context === undefined) {
    throw new Error('useGenerator must be used within a GeneratorProvider');
  }
  return context;
}

/**
 * Hook to access ONLY the Generator state.
 * Components using this will re-render when ANY state in the generator changes.
 */
export function useGeneratorState() {
  const context = useContext(GeneratorStateContext);
  if (context === undefined) {
    throw new Error('useGeneratorState must be used within a GeneratorProvider');
  }
  return context;
}

/**
 * Hook to access ONLY the Generator dispatch functions.
 * Components using this will NOT re-render when state changes.
 */
export function useGeneratorDispatch() {
  const context = useContext(GeneratorDispatchContext);
  if (context === undefined) {
    throw new Error('useGeneratorDispatch must be used within a GeneratorProvider');
  }
  return context;
}
