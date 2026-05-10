# Anime-Script-Pro: Complete Workflow Architecture Reference

## Executive Summary

The Anime-Script-Pro system generates complete anime production assets through a **6-phase orchestrated workflow**:

```
Engine (Config) → World (Foundation) → Cast (Characters) → Series (Episodes) 
→ Script (Narrative) → Storyboard (Visual) → SEO (Metadata) → Screening (Review)
```

The workflow is triggered from the **Engine page** and flows through the GeneratorContext state management system, which synchronizes all data to the database via `syncCore()`.

---

## 1. GENERATION ENTRY POINTS

### 1.1 Primary: Engine Page "Start AI Generation" Button

**File**: `frontend/src/pages/studio/AnimeStudio/Engine/EnginePage.tsx` (Lines 475-490)

```tsx
<button onClick={() => handleGenerate()} ...>
  <Zap className="w-6 h-6 text-black" />
  Start AI Generation
</button>
```

**Current Behavior**:
- Calls `generateProductionAssets()` which only generates Script + Image Prompts
- **INCOMPLETE** - should trigger full orchestration

**What it SHOULD do**:
- Call the full `handleMasterGenerate()` from `Layout.tsx`
- Execute all 6 phases sequentially

### 1.2 Secondary: Studio Top Bar "Start Generation" Button

**File**: `frontend/src/pages/studio/components/studio/layout/StudioTopBar.tsx` (Lines 107-115)

```tsx
<Button onClick={() => window.dispatchEvent(new CustomEvent('studio-generate-all'))}>
  <Zap className="w-3 h-3" />
  Start Generation
</Button>
```

**Issue**: Event is dispatched but no listener is currently wired up to trigger master generation.

### 1.3 Complete Implementation: handleMasterGenerate()

**File**: `frontend/src/pages/studio/AnimeStudio/Layout.tsx` (Lines 125-220)

This is the **reference implementation** that should be used:

```tsx
const handleMasterGenerate = useCallback(async () => {
  setIsLoading(true);
  addGeneratorLog("MASTER_GENERATOR", "INITIALIZED", "Starting Full Production Cycle...");
  
  // PHASE 1: World
  const world = await generateWorld(prompt, selectedModel, 'Anime');
  setGeneratedWorld(world);
  
  // PHASE 2a: Characters
  const castResult = await generateCharacters(prompt, selectedModel, 'Anime', world);
  setCastData(castResult);
  
  // PHASE 2b: Series
  const seriesPlan = await generateSeriesPlan(prompt, selectedModel, 'Anime', 12, world, castResult.markdown);
  setGeneratedSeriesPlan(seriesPlan);
  
  // PHASE 3: Script
  const script = await generateScriptStream(
    prompt, tone, audience, "1", "1", numScenes, selectedModel, 'Anime',
    recapperPersona, characterRelationships, world, castResult.markdown, seriesPlan[0],
    (partial) => setGeneratedScript(partial)
  );
  setGeneratedScript(script);
  
  // PHASE 4: Storyboard
  const visualPrompts = await generateImagePrompts(script, selectedModel);
  setGeneratedImagePrompts(visualPrompts);
  
  // PHASE 5: SEO
  const seo = await generateMetadata(script, selectedModel);
  setGeneratedMetadata(seo);
  
  // PHASE 6: Save
  await syncCore();
  navigate(`${basePath}/world`);
  setIsLoading(false);
}, [...dependencies]);
```

---

## 2. STATE MANAGEMENT: GeneratorContext

### 2.1 Central Context Hub

**File**: `frontend/src/contexts/GeneratorContext.tsx`

**Pattern**: Dual-context design (State + Dispatch) for optimal React performance

#### GeneratorState (Read-Only)
```tsx
interface GeneratorState {
  // Input Parameters
  prompt: string;
  promptLore: string;
  promptPowers: string;
  promptFactions: string;
  promptArchitecture: string;
  promptAtlas: string;
  promptCulture: string;
  promptSystems: string;
  theme: string;
  
  // Generated Assets
  generatedScript: string | null;
  generatedCharacters: string | null;
  generatedWorld: string | null;
  generatedWorldLore: string | null;
  generatedWorldPowers: string | null;
  generatedWorldFactions: string | null;
  generatedWorldArchitecture: string | null;
  generatedWorldAtlas: string | null;
  generatedWorldCulture: string | null;
  generatedWorldSystems: string | null;
  generatedSeriesPlan: any[] | null;
  generatedImagePrompts: string | null;
  generatedMetadata: string | null;
  generatedGrowthStrategy: string | null;
  generatedDistributionPlan: string | null;
  generatedAltText: string | null;
  
  // Generation Status Flags
  isGeneratingCharacters: boolean;
  isGeneratingWorld: boolean;
  isGeneratingLore: boolean;
  isGeneratingPowers: boolean;
  isGeneratingFactions: boolean;
  isGeneratingArchitecture: boolean;
  isGeneratingAtlas: boolean;
  isGeneratingCulture: boolean;
  isGeneratingSystems: boolean;
  isGeneratingSeries: boolean;
  isGeneratingImagePrompts: boolean;
  isGeneratingMetadata: boolean;
  isGeneratingDescription: boolean;
  isGeneratingVisuals: boolean;
  isGeneratingAltText: boolean;
  isGeneratingGrowthStrategy: boolean;
  isGeneratingDistribution: boolean;
  
  // Engine Settings
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  selectedModel: string;
  tone: string;
  audience: string;
  contentType: string;
  
  // Navigation & Workflow
  currentScriptId: string | null;
  episode: string;
  session: string;
  numScenes: string;
  productionSequence: ProductionUnit[];
  
  // Cast Details
  castList: any[];
  castData: any | null;
  castDNA: any | null;
  castDynamics: any | null;
  castIntegrity: any | null;
  characterRelationships: string | null;
  
  // Visual Data
  visualData: any[];
  videoData: any[];
  storyboardPrompts: any;
}
```

#### GeneratorDispatch (Action Functions)
```tsx
interface GeneratorDispatch {
  // Setters for inputs
  setPrompt: (p: string) => void;
  setTheme: (t: string) => void;
  setTone: (t: string) => void;
  setSelectedModel: (m: string) => void;
  setContentType: (ct: string) => void;
  
  // Setters for generated assets
  setGeneratedScript: (s: string | null) => void;
  setGeneratedCharacters: (c: string | null) => void;
  setGeneratedWorld: (w: string | null) => void;
  setGeneratedSeriesPlan: (s: any[] | null) => void;
  setGeneratedImagePrompts: (p: string | null) => void;
  setGeneratedMetadata: (m: string | null) => void;
  
  // Setters for status flags
  setIsGeneratingCharacters: (b: boolean) => void;
  setIsGeneratingWorld: (b: boolean) => void;
  setIsGeneratingSeries: (b: boolean) => void;
  
  // Core persistence function
  syncCore: (projectId?: number) => Promise<number | undefined>;
  
  // Logging
  addLog: (module: string, status: string, message?: string) => void;
  
  // Stop & notifications
  stopGeneration: () => void;
  showNotification: (message: string, type?: 'error' | 'success' | 'info') => void;
}
```

### 2.2 Using the Context

**Hook Pattern**:
```tsx
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';

function MyComponent() {
  // Read state (causes re-renders on any state change)
  const { generatedScript, prompt } = useGeneratorState();
  
  // Dispatch actions (NO re-renders)
  const { setGeneratedScript, setPrompt } = useGeneratorDispatch();
  
  return (
    <div>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} />
      <button onClick={() => setGeneratedScript("...")}>Save Script</button>
    </div>
  );
}
```

### 2.3 Data Fetching & Syncing

**TanStack React Query Integration**:
```tsx
const { data: production } = useQuery({
  queryKey: ['productionContent', user?.id, currentScriptId],
  queryFn: () => productionApi.getContent(user!.id, currentScriptId ? parseInt(currentScriptId) : undefined),
  enabled: !!user?.id,
});

const { data: worldLore } = useQuery({
  queryKey: ['worldLore', user?.id, currentScriptId],
  queryFn: () => worldApi.getLore(user!.id, currentScriptId ? parseInt(currentScriptId) : undefined),
  enabled: !!user?.id,
});

const { data: castDataFromApi } = useQuery({
  queryKey: ['characterCast', user?.id, currentScriptId],
  queryFn: () => characterApi.getCast(user!.id, currentScriptId ? parseInt(currentScriptId) : undefined),
  enabled: !!user?.id,
});
```

---

## 3. PRODUCTION PHASES

### Phase 1: World Foundation

**Generator**: `frontend/src/services/generators/world.ts`
```tsx
const world = await generateWorld(prompt, selectedModel, contentType);
```

**Output**: String containing 8 world modules:
- Manifest (core setting)
- History (world backstory)
- Powers (magic/tech systems)
- Factions (organizations)
- Architecture (buildings/design)
- Atlas (geography)
- Culture (customs/society)
- Systems (rules/physics)

**State Updates**:
```tsx
setGeneratedWorld(fullBlob);
setGeneratedWorldContent({...}); // Structured object
```

---

### Phase 2a: Cast Synthesis

**Generator**: `frontend/src/services/generators/characters.ts`
```tsx
const castResult = await generateCharacters(prompt, selectedModel, contentType, generatedWorld);
```

**Input**: World context for consistency
**Output**: Object with:
- `characters`: Array of character profiles
- `markdown`: Formatted character documentation
- `relationships`: Character connection matrix
- DNA/dynamics/integrity data

**State Updates**:
```tsx
setCastData(castResult);
setCastList(castResult.characters);
setCharacterRelationships(JSON.stringify(castResult.relationships));
```

---

### Phase 2b: Series Architecture

**Generator**: `frontend/src/services/generators/series.ts`
```tsx
const seriesPlan = await generateSeriesPlan(
  prompt, 
  selectedModel, 
  contentType, 
  12, // episodes per session
  generatedWorld, 
  castMarkdown
);
```

**Input**: World + Cast for continuity
**Output**: Array of 60 episode plans with:
- Episode number
- Title
- Hook (opening)
- Summary
- Major beats
- Scene breakdown

**State Updates**:
```tsx
setGeneratedSeriesPlan(seriesPlan);
```

---

### Phase 3: Script Generation

**Generator**: `frontend/src/services/generators/script.ts`
```tsx
const script = await generateScriptStream(
  prompt,
  tone,
  audience,
  session,
  episode,
  numScenes,
  selectedModel,
  contentType,
  recapperPersona,
  characterRelationships,
  generatedWorld,
  generatedCharacters,
  episodePlan,
  (partial) => setGeneratedScript(partial) // Streaming callback
);
```

**Input**: All previous outputs (world, cast, series plan)
**Output**: Full screenplay with:
- Dialogue
- Scene descriptions
- Action beats
- Cinematography notes

**State Updates**:
```tsx
setGeneratedScript(script);
setGenerationProgress(50);
```

---

### Phase 4: Visual/Storyboard

**Generator**: `frontend/src/services/api/gemini.ts`
```tsx
const visualPrompts = await generateImagePrompts(script, selectedModel);
```

**Input**: Script text
**Output**: Scene-by-scene visual prompts for:
- Camera angles
- Composition
- Color palette
- Lighting
- Motion

**State Updates**:
```tsx
setGeneratedImagePrompts(visualPrompts);
setVisualData({ 0: ["pending"] });
```

---

### Phase 5: SEO & Metadata

**Generator**: `frontend/src/services/api/gemini.ts`
```tsx
const [metadata, description, altText, growthStrategy, distributionStrategy] = await Promise.all([
  generateMetadata(script, selectedModel),
  generateYouTubeDescription(script, selectedModel, contentType),
  generateAltTexts(script, selectedModel),
  generateGrowthStrategy(script, selectedModel, contentType),
  generateDistributionStrategy(script, selectedModel)
]);
```

**Output**:
- Title & description
- Keywords & tags
- YouTube-optimized description
- Growth marketing strategy
- Distribution recommendations
- Alt text for accessibility

**State Updates**:
```tsx
setGeneratedMetadata(metadata);
setGeneratedDescription(description);
setGeneratedGrowthStrategy(growthStrategy);
setGeneratedDistributionPlan(distributionStrategy);
```

---

### Phase 6: Data Persistence

**Function**: `syncCore(projectId)` in GeneratorContext

**Flow**:
1. Create project record if needed
2. Save production content (script, series, metadata, storyboard)
3. Save world modules (all 8 parts)
4. Save cast data (characters, relationships, DNA)
5. Invalidate React Query caches
6. Return project ID

**Endpoint Calls**:
```
POST /api/projects (if new)
POST /api/production-content (script, metadata, etc.)
POST /api/world/manifest (world blob)
POST /api/world/lore (history)
POST /api/world/powers (powers system)
POST /api/world/factions (factions)
POST /api/world/architecture (buildings)
POST /api/world/atlas (geography)
POST /api/world/culture (society)
POST /api/world/systems (rules)
POST /api/cast (characters + relationships)
```

---

## 4. NAVIGATION & PREVIOUS/NEXT FLOW

### 4.1 Phase Navigation Structure

**Phase Sequence**:
```
1. Engine          → World
2. World           → Cast
3. Cast            → Series
4. Series          → Script
5. Script          → Storyboard
6. Storyboard      → SEO
7. SEO             → Screening
8. Screening       → Engine (cycle)
```

### 4.2 Previous/Next Implementation

**Header Pattern** (used in all pages):
```tsx
// StoryboardHeader.tsx (example)
<Button onClick={onPrev}>
  <ChevronLeft /> PREVIOUS
</Button>

<Button onClick={onRegenerate}>
  <Sparkles /> GENERATE ALL
</Button>

<Button onClick={onNext}>
  NEXT <ChevronRight />
</Button>
```

**Navigation Callbacks**:
```tsx
const handlePrevious = () => navigate(`/anime/cast`);
const handleNext = () => navigate(`/anime/seo`);
```

### 4.3 Production Flow Bar

**File**: `frontend/src/pages/studio/components/studio/layout/ProductionFlowBar.tsx`

**Features**:
- Visual indicator of current phase
- Progress bar showing completed phases
- Completion checkmarks based on generated data
- Clickable phase navigation

```tsx
const PHASES = [
  { id: 'engine', label: 'Engine', path: '/engine', icon: Zap },
  { id: 'world', label: 'World', path: '/world', icon: Globe },
  { id: 'cast', label: 'Cast', path: '/cast', icon: UserPlus },
  { id: 'series', label: 'Series', path: '/series', icon: Layers },
  { id: 'script', label: 'Script', path: '/script', icon: ScrollText },
  { id: 'storyboard', label: 'Storyboard', path: '/storyboard', icon: ImageIcon },
  { id: 'seo', label: 'SEO', path: '/seo', icon: Search },
  { id: 'screening', label: 'Screening', path: '/screening', icon: Play },
];
```

---

## 5. KEY FILES REFERENCE

### Generation Services
| File | Purpose |
|------|---------|
| `frontend/src/services/generators/world.ts` | World lore generation |
| `frontend/src/services/generators/characters.ts` | Character synthesis |
| `frontend/src/services/generators/series.ts` | Series/episode planning |
| `frontend/src/services/generators/script.ts` | Script generation with streaming |
| `frontend/src/services/generators/image.ts` | Storyboard prompt generation |
| `frontend/src/services/generators/metadata.ts` | SEO/metadata generation |
| `frontend/src/services/generators/core.ts` | Core AI calling utility |

### State Management
| File | Purpose |
|------|---------|
| `frontend/src/contexts/GeneratorContext.tsx` | Central state management |
| `frontend/src/hooks/useGenerator.ts` | Context access hooks |
| `frontend/src/contexts/generator/EngineContext.tsx` | Engine-specific state |
| `frontend/src/contexts/generator/WorldContext.tsx` | World-specific state |
| `frontend/src/contexts/generator/CastContext.tsx` | Cast-specific state |
| `frontend/src/contexts/generator/SEOContext.tsx` | SEO-specific state |

### Page Components
| File | Purpose |
|------|---------|
| `frontend/src/pages/studio/AnimeStudio/Engine/EnginePage.tsx` | Generation entry point |
| `frontend/src/pages/studio/AnimeStudio/World/WorldLayout.tsx` | World builder UI |
| `frontend/src/pages/studio/AnimeStudio/Cast/CastLayout.tsx` | Cast designer UI |
| `frontend/src/pages/studio/AnimeStudio/Series/SeriesLayout.tsx` | Series planner UI |
| `frontend/src/pages/studio/AnimeStudio/Script/ScriptLayout.tsx` | Script editor UI |
| `frontend/src/pages/studio/AnimeStudio/Storyboard/StoryboardLayout.tsx` | Storyboard UI |
| `frontend/src/pages/studio/AnimeStudio/SEO/SEOLayout.tsx` | SEO editor UI |

### Layouts
| File | Purpose |
|------|---------|
| `frontend/src/pages/studio/AnimeStudio/Layout.tsx` | Master orchestration (handleMasterGenerate) |
| `frontend/src/pages/studio/AnimeStudio/Engine/EngineLayout.tsx` | Engine page wrapper |
| `frontend/src/pages/studio/AnimeStudio/World/WorldLayout.tsx` | World page wrapper |

### Navigation & UI
| File | Purpose |
|------|---------|
| `frontend/src/pages/studio/components/studio/layout/ProductionFlowBar.tsx` | Phase navigation bar |
| `frontend/src/pages/studio/AnimeStudio/components/layout/AnimeStudioTopBar.tsx` | Top toolbar |
| `frontend/src/pages/studio/components/studio/layout/StudioTopBar.tsx` | Studio-wide toolbar |

---

## 6. QUICK START: FIXING THE ENGINE PAGE

### Current Problem
Engine page "Start AI Generation" button only generates script + image prompts (incomplete workflow).

### Solution Steps

**Step 1**: Import the orchestration handler in EnginePage
```tsx
import { handleMasterGenerate } from '../Layout'; // Import from Layout.tsx
```

**Step 2**: Replace the incomplete `handleGenerate()` with orchestration
```tsx
const handleGenerate = () => {
  handleMasterGenerate();
};
```

**Step 3**: Alternative - Call the orchestrator directly
```tsx
<button 
  onClick={async () => {
    try {
      await handleMasterGenerate();
    } catch (error) {
      showNotification(`Generation failed: ${error.message}`, 'error');
    }
  }}
>
  Start AI Generation
</button>
```

---

## 7. DEBUGGING CHECKLIST

- [ ] Is `handleMasterGenerate` being called?
- [ ] Is context state updating after each phase?
- [ ] Are generation flags (`isGeneratingWorld`, `isGeneratingCharacters`, etc.) toggling correctly?
- [ ] Is `syncCore()` being called at the end?
- [ ] Are React Query caches being invalidated?
- [ ] Is navigation happening after completion?
- [ ] Are error notifications displaying?
- [ ] Is the ProductionFlowBar showing completed phases?

---

## 8. DATA FLOW SUMMARY

```
User Input (Prompt)
    ↓
Engine Context
    ↓
handleMasterGenerate()
    ├→ generateWorld() → setGeneratedWorld()
    ├→ generateCharacters() → setCastData()
    ├→ generateSeriesPlan() → setGeneratedSeriesPlan()
    ├→ generateScript() → setGeneratedScript()
    ├→ generateImagePrompts() → setGeneratedImagePrompts()
    ├→ generateMetadata() → setGeneratedMetadata()
    └→ syncCore() → API Calls
        ├→ POST /api/projects
        ├→ POST /api/production-content
        ├→ POST /api/world/*
        └→ POST /api/cast
            ↓
        Database Persistence
            ↓
        navigate(/anime/world)
            ↓
        ProductionFlowBar Shows Completion
            ↓
        User Navigates Through Phases (World → Cast → Series → Script → etc.)
```

---

## Final Note

The **Engine page is the gateway** to the entire production pipeline. Once the "Start AI Generation" button is properly wired to `handleMasterGenerate()`, the entire workflow will execute sequentially, with state flowing through the GeneratorContext and data persisting to the database via `syncCore()`.
