import { useContext } from 'react';
// Import from the stable refs file — NOT from GeneratorContext.tsx.
// This ensures the same context object is used across Vite HMR reloads.
// See contexts/GeneratorContextRefs.ts for the explanation.
import {
  GeneratorStateContext,
  GeneratorDispatchContext
} from '@/contexts/GeneratorContextRefs';

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
/**
 * Combined hook for both state and dispatch.
 */
export function useGenerator() {
  const state = useGeneratorState();
  const dispatch = useGeneratorDispatch();
  return { ...state, ...dispatch };
}
