# Anime-Script-Pro: Workflow Architecture Analysis Summary

## Overview

I've analyzed the Anime-Script-Pro system and documented the complete generation workflow architecture. Here are the key findings:

---

## 1. Generation Flow: 6-Phase Pipeline

The system generates anime production assets through a **sequential 6-phase workflow**:

```
Phase 1: WORLD      (Foundation/Setting)
    ↓
Phase 2a: CAST      (Character DNA)
    ↓
Phase 2b: SERIES    (60-Episode Arc)
    ↓
Phase 3: SCRIPT     (Narrative/Dialogue)
    ↓
Phase 4: STORYBOARD (Visual Prompts)
    ↓
Phase 5: SEO        (Metadata/Marketing)
    ↓
Phase 6: DATABASE   (Persistence)
```

Each phase **feeds context to the next** (world informs characters, characters inform series, etc.) ensuring narrative consistency.

---

## 2. Generation Entry Points: 3 Locations

### ✅ Primary Entry Point: Engine Page
- **Button**: "Start AI Generation" on Engine page
- **File**: `EnginePage.tsx` (lines 475-490)
- **Current Status**: **INCOMPLETE** - only generates script + image prompts
- **Should Be**: Should trigger full 6-phase orchestration

### ⚠️ Secondary Entry Point: Studio Top Bar
- **Button**: "START GENERATION" button (top toolbar)
- **File**: `StudioTopBar.tsx` (lines 107-115)
- **Issue**: Dispatches event but no listener wired to master generation
- **Event**: `window.dispatchEvent(new CustomEvent('studio-generate-all'))`

### ✅ Complete Implementation: handleMasterGenerate()
- **File**: `Layout.tsx` (lines 125-220)
- **Status**: Fully implemented reference implementation
- **What It Does**: Executes all 6 phases sequentially
- **This is what Engine page should call!**

---

## 3. State Management: GeneratorContext

The entire workflow state flows through **GeneratorContext** - a dual-context system:

### Architecture Pattern:
```
GeneratorStateContext    ← Read-only (causes re-renders)
GeneratorDispatchContext ← Action functions (NO re-renders)
```

### Hook Usage:
```tsx
const state = useGeneratorState();        // read only
const dispatch = useGeneratorDispatch();  // actions only
```

### Key State Holds:
- **Inputs**: `prompt`, `tone`, `selectedModel`, `contentType`
- **Generated Assets**: 40+ state variables for each output
- **Status Flags**: 15+ boolean flags tracking generation progress
- **Navigation**: `currentScriptId`, `episode`, `session`

---

## 4. How State Flows Between Pages/Modules

### Pattern: Context → Page Components → UI

```
GeneratorContext (central state)
    ↓
Page Component (World, Cast, Script, etc.)
    ↓
useGeneratorState() → read generated data
    ↓
useGeneratorDispatch() → handle regeneration
    ↓
UI Updates
```

### Example: Script Page
```tsx
function ScriptLayout() {
  const { generatedScript, generatedSeriesPlan } = useGeneratorState();
  const { setGeneratedScript } = useGeneratorDispatch();
  
  return <EditorView script={generatedScript} />;
}
```

### Example: Storyboard Page
```tsx
function StoryboardLayout() {
  const { generatedScript, generatedImagePrompts } = useGeneratorState();
  const { setGeneratedImagePrompts } = useGeneratorDispatch();
  
  return <StoryboardGrid prompts={generatedImagePrompts} />;
}
```

---

## 5. Previous/Next Navigation Flow

### Phase Sequence:
```
Engine → World → Cast → Series → Script → Storyboard → SEO → Screening → (cycle)
```

### Implementation Pattern:
Each page has Previous/Next buttons with navigation callbacks:
```tsx
const onPrev = () => navigate(`/anime/cast`);
const onNext = () => navigate(`/anime/series`);
```

### ProductionFlowBar Tracks Progress:
- Shows which phase user is on (visual indicator)
- Shows completed phases (with checkmarks)
- Completion status based on: `generatedWorld`, `castList`, `generatedSeriesPlan`, `generatedScript`, etc.

---

## 6. Production Pipeline End-to-End

### Complete Execution Flow:

```
1. USER STARTS GENERATION
   └→ Engine Page "Start AI Generation" button clicked
      (Currently incomplete - should be fixed)

2. PHASE 1: WORLD GENESIS
   └→ generateWorld(prompt, model, contentType)
      └→ API: Gemini AI generates world lore
      └→ Output: 8-part world (manifest, history, powers, factions, architecture, atlas, culture, systems)
      └→ State: setGeneratedWorld(), setGeneratedWorldContent()

3. PHASE 2a: CHARACTER DNA
   └→ generateCharacters(prompt, model, contentType, world)
      └→ Input: World context for consistency
      └→ Output: Character profiles, relationships, DNA
      └→ State: setCastData(), setCastList(), setCharacterRelationships()

4. PHASE 2b: SERIES ARCHITECTURE
   └→ generateSeriesPlan(prompt, model, contentType, 12, world, cast)
      └→ Input: World + Cast (injected as context)
      └→ Output: Array of 60 episode plans
      └→ State: setGeneratedSeriesPlan()

5. PHASE 3: SCRIPT GENERATION
   └→ generateScriptStream(prompt, tone, audience, episode, session, scenes, model, contentType, persona, relationships, world, cast, seriesPlan)
      └→ Input: ALL previous outputs injected for consistency
      └→ Streaming: Receives partial script via callback
      └→ Output: Full screenplay with dialogue, action, cinematography notes
      └→ State: setGeneratedScript() (called multiple times during stream)

6. PHASE 4: STORYBOARD/VISUAL
   └→ generateImagePrompts(script, model)
      └→ Input: Script text
      └→ Output: Scene-by-scene visual prompts (camera, composition, color, lighting, motion)
      └→ State: setGeneratedImagePrompts(), setVisualData()

7. PHASE 5: SEO & METADATA
   └→ generateMetadata(script, model) + other functions
      └→ Parallel calls for:
         - generateMetadata() → SEO metadata
         - generateYouTubeDescription() → Video description
         - generateAltTexts() → Accessibility
         - generateGrowthStrategy() → Marketing strategy
         - generateDistributionStrategy() → Publishing plan
      └→ State: setGeneratedMetadata(), setGeneratedGrowthStrategy(), etc.

8. PHASE 6: DATABASE PERSISTENCE
   └→ syncCore(projectId)
      └→ Creates project record if new
      └→ Saves production content → /api/production-content
      └→ Saves world modules → /api/world/* (8 endpoints)
      └→ Saves cast data → /api/cast
      └→ Invalidates React Query caches
      └→ Returns projectId

9. NAVIGATION & COMPLETION
   └→ navigate(`/anime/world`)
   └→ ProductionFlowBar shows all phases complete
   └→ User can navigate through phases with Previous/Next
```

---

## 7. What Engine Page Should Trigger

### Current Broken State:
Engine page button calls incomplete `generateProductionAssets()` which only generates:
- Script
- Image Prompts
- ❌ Missing: World, Cast, Series, Metadata, Storyboard, etc.

### What It Should Do:
Call the complete `handleMasterGenerate()` from `Layout.tsx`:

```tsx
// In EnginePage.tsx, replace handleGenerate() with:
async function handleGenerate() {
  try {
    setIsLoading(true);
    await handleMasterGenerate();  // Full orchestration
    // handleMasterGenerate already:
    // - Generates all 6 phases
    // - Updates context state
    // - Calls syncCore() to save
    // - Navigates to /anime/world
  } catch (error) {
    showNotification(`Generation failed: ${error.message}`, 'error');
  } finally {
    setIsLoading(false);
  }
}
```

---

## 8. Key Architectural Insights

### 1. Context Injection Pattern
Each generator receives **previous outputs as context**:
- World generator: gets nothing (foundation)
- Character generator: **gets world** (for consistency)
- Series generator: **gets world + cast** (for narrative continuity)
- Script generator: **gets world + cast + series plan** (maximum context)

This ensures **narrative coherence** throughout the pipeline.

### 2. Streaming Support
Script generation uses streaming (Server-Sent Events pattern):
```tsx
generateScriptStream(..., (partial) => setGeneratedScript(partial))
```
Users see script build in real-time instead of waiting for completion.

### 3. State-Driven UI
Every UI page reads from the same context:
```tsx
useGeneratorState() → automatically shows latest generation
```
No prop drilling, automatic synchronization across pages.

### 4. Lazy Evaluation
- React Query caches fetches (worldLore, productionContent, castData)
- Only loads on first access or manual invalidation
- `syncCore()` invalidates caches after save

### 5. Modular Save Pattern
Separate API calls for each major component:
- Production API (script, metadata, storyboard)
- World API (8 separate endpoints for modularity)
- Character API (cast, relationships, DNA)

Allows **independent updates** without full resynchronization.

---

## 9. Files to Reference

### Core Orchestration
- `frontend/src/pages/studio/AnimeStudio/Layout.tsx` - handleMasterGenerate() (reference implementation)

### State Management
- `frontend/src/contexts/GeneratorContext.tsx` - Central state hub
- `frontend/src/hooks/useGenerator.ts` - Hook utilities

### Page Entry Points
- `frontend/src/pages/studio/AnimeStudio/Engine/EnginePage.tsx` - **NEEDS FIX**
- `frontend/src/pages/studio/AnimeStudio/World/WorldLayout.tsx`
- `frontend/src/pages/studio/AnimeStudio/Cast/CastLayout.tsx`
- `frontend/src/pages/studio/AnimeStudio/Series/SeriesLayout.tsx`
- `frontend/src/pages/studio/AnimeStudio/Script/ScriptLayout.tsx`
- `frontend/src/pages/studio/AnimeStudio/Storyboard/StoryboardLayout.tsx`
- `frontend/src/pages/studio/AnimeStudio/SEO/SEOLayout.tsx`

### Generator Services
- `frontend/src/services/generators/world.ts`
- `frontend/src/services/generators/characters.ts`
- `frontend/src/services/generators/series.ts`
- `frontend/src/services/generators/script.ts`
- `frontend/src/services/api/gemini.ts` (metadata, image prompts)

### Navigation & UI
- `frontend/src/pages/studio/components/studio/layout/ProductionFlowBar.tsx` - Phase progress bar

---

## 10. Quick Fix Checklist

To enable the Engine Page to trigger the complete workflow:

- [ ] Import `handleMasterGenerate` from `Layout.tsx`
- [ ] Replace incomplete `generateProductionAssets()` call
- [ ] Ensure all 6 generators are imported correctly
- [ ] Verify context state updates after each phase
- [ ] Test that `syncCore()` saves to database
- [ ] Confirm navigation to `/anime/world` after completion
- [ ] Verify ProductionFlowBar shows completion status

---

## 11. Advanced: Alternative Orchestration

There's also a `ProductionOrchestrator` class with a "God Mode" implementation:

**File**: `frontend/src/services/productionOrchestrator.ts`

This has a more advanced 10-phase orchestration with:
- Session generation (5 major story arcs)
- Scene scaffolding (960-scene grid)
- Production sequence generation
- Marketing asset bundling

Could be used for more ambitious automation.

---

## Summary

**The Anime-Script-Pro workflow is a sophisticated, context-aware generation pipeline** where:

1. ✅ **Generation starts from the Engine page** (currently broken)
2. ✅ **Flows through 6 sequential phases** (world → cast → series → script → storyboard → seo)
3. ✅ **State is centralized in GeneratorContext** (dual-context pattern for performance)
4. ✅ **Each phase feeds context to the next** (context injection for narrative consistency)
5. ✅ **Navigation happens through Previous/Next buttons** (Previous/Next pattern)
6. ✅ **Final persistence via syncCore()** (complete database save with cache invalidation)
7. ✅ **Progress tracked by ProductionFlowBar** (visual completion indicators)

**The KEY FIX**: Make Engine page button call `handleMasterGenerate()` instead of incomplete `generateProductionAssets()`.

---

## Documentation Files Created

1. **`WORKFLOW_ARCHITECTURE_REFERENCE.md`** - Comprehensive reference guide (60+ sections)
2. **Session Memory**: `workflow-architecture-findings.md` - Quick lookup notes
3. **This file**: `ARCHITECTURE_ANALYSIS_SUMMARY.md` - Executive summary
4. **Diagrams**: Two Mermaid workflows showing generation flow and state sequence

All files available in the workspace for your reference.
