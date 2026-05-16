import React from 'react';

interface StudioContextWrapperProps {
  children: React.ReactNode;
}

/**
 * StudioContextWrapper
 *
 * Previously re-provided GlobalGeneratorProvider and ModularGeneratorProvider,
 * but this caused an HMR identity mismatch crash:
 *   - Vite HMR re-evaluates GeneratorContext.tsx → new context objects created
 *   - Inner providers attach values to new context objects
 *   - useGenerator.ts hooks still hold refs to OLD context objects
 *   - useContext(oldContext) returns undefined → "must be used within a GeneratorProvider"
 *
 * Fix: RootProviders already provides both contexts globally.
 * This component is now a transparent pass-through, kept for future
 * studio-specific logic (e.g., project-scoped resets via a reset action).
 */
export function StudioContextWrapper({ children }: StudioContextWrapperProps) {
  return <>{children}</>;
}
