/**
 * GeneratorContextRefs.ts
 *
 * IMPORTANT: Keep this file minimal and change it as rarely as possible.
 *
 * This file owns the singleton context objects for the Generator system.
 * They are extracted into their own module so that Vite HMR re-evaluations
 * of the large GeneratorContext.tsx file do NOT recreate these objects.
 *
 * If the context objects are recreated (e.g., on HMR), all existing
 * useContext() consumers still hold a reference to the OLD objects, so
 * useContext(oldContext) returns `undefined` → throws "must be used within
 * a GeneratorProvider".
 *
 * Separating creation here means:
 *  - GeneratorContext.tsx can be freely edited/HMR-refreshed
 *  - useGenerator.ts hooks always reference the same stable context objects
 */

import { createContext } from 'react';

// ── These types are inline-declared here to avoid circular imports ─────────
// The actual full GeneratorState / GeneratorDispatch types live in
// GeneratorContext.tsx. We use `any` here because this file must not import
// from GeneratorContext.tsx (that would re-introduce the HMR coupling).
// The hooks and provider cast appropriately on their end.
export const GeneratorStateContext = createContext<any>(undefined);
export const GeneratorDispatchContext = createContext<any>(undefined);
