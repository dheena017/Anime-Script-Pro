import { generateWorld } from "./generators/worldGenerator";
import { generateCharacters } from "./generators/characterGenerator";
import { generateRelationships } from "./generators/characterGenerator";
import { generateSeriesPlan } from "./generators/seriesGenerator";
import { generateScript } from "./generators/scriptGenerator";
import { generateMetadata, generateYouTubeDescription, generateAltTexts, generateGrowthStrategy, generateDistributionStrategy } from "./generators/seoGenerator";
import { generateImagePrompts } from "./generators/imageGenerator";
import { generateProductionSequences, ProductionUnit } from "@/lib/sequence-utils";
import { apiRequest } from "@/lib/api-utils";
import { seoApi } from "@/services/api/seo";
import { VIBE_LIBRARY } from "@/lib/vibe-presets";

import { callAI } from "./generators/core";

export interface ProductionContext {
  prompt: string;
  theme?: string;
  contentType: string;
  model: string;
  userId: string;
  vibe?: string;
}

export interface OrchestrationResult {
  project: any;
  world: string;
  cast: any;
  relationships: any;
  series: any[];
  sequences: ProductionUnit[];
  script?: string;
  marketing?: {
    metadata: string;
    description: string;
    altText: string;
    growthStrategy: string;
    distributionStrategy: string;
    imagePrompts: string;
  };
}

/**
 * ProductionOrchestrator
 * Implements the 4-Phase architecture for autonomous "God Mode" production.
 */
export class ProductionOrchestrator {
  private context: ProductionContext;
  private project: any = null;

  constructor(context: ProductionContext) {
    this.context = context;
  }

  private async runPhase<T>(phaseName: string, operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      console.error(`[ORCHESTRATOR:${phaseName}] ${errorMsg}`, error);
      throw new Error(`${phaseName} failed: ${errorMsg}`);
    }
  }

  async executeFullCycle(onProgress?: (phase: string, data?: any) => void): Promise<OrchestrationResult> {
    try {
      // STATE 01: WORLD Lore
      if (onProgress) onProgress("SIGNAL_INIT: Synchronizing Universal Lore Parameters...");
      const world = await this.runPhase("WORLD_INIT", () => this.initializeFoundation());

      // STATE 02: Narrative SCALPEL
      if (onProgress) onProgress("PROTOCOL_SCALPEL: Fracturing Narrative into 60-Episode Arcs...");
      const { series } = await this.runPhase("SERIES_BUILD", () => this.buildSeries(world));

      // STATE 03: CHARACTER DNA
      if (onProgress) onProgress("SYNTHESIS_DNA: Extracting Visual DNA for Principal Cast...");
      const cast = await this.runPhase("CAST_BUILD", () => this.buildCast(world));

      // STATE 03B: RELATIONSHIP MATRIX
      if (onProgress) onProgress("RELATIONSHIP_MATRIX: Mapping Social Friction and Allegiance Lines...");
      const relationships = await this.runPhase("RELATIONSHIP_BUILD", () => this.buildRelationships(cast));

      // STATE 04: SERIES Roadmap
      if (onProgress) onProgress("ROADMAP_INIT: Finalizing Temporal Production Roadmap...");
      await this.runPhase("SERIES_PERSIST", () => this.saveSeriesPlan(series));

      // STATE 05: SCRIPT Engine
      if (onProgress) onProgress("MANIFEST_SCRIPT: Materializing Script Pilot via Shogun Engine...");
      const script = await this.runPhase("SCRIPT_MATERIALIZE", () => this.materializePilot(world, cast, series[0], relationships));

      // STATE 05B: PACKAGING ASSETS
      if (onProgress) onProgress("PACKAGING_ASSETS: Generating Metadata, Alt Text, Growth, and Image Prompts...");
      const marketing = await this.runPhase("MARKETING_PACKAGE", () => this.buildMarketingAssets(script));

      // STATE 06: VISUAL Manifest
      if (onProgress) onProgress("SCAFFOLD_VISUAL: Deploying 960-Unit Storyboard Grid...");
      const sequences = await this.runPhase("SCENE_SCAFFOLD", () => this.scaffoldGeneration(series));

      // STATE 07: GLOBAL Reach
      if (onProgress) onProgress("SEO_OPTIMIZE: Hardening Global Metadata for Premiere...");
      await this.prepareSEO();

      // STATE 08: ASSET Synthesis
      if (onProgress) onProgress("PROMPT_REFINERY: Refining Latent Visual Prompts...");
      await this.preparePrompts();

      // STATE 09: PREMIERE Hub
      if (onProgress) onProgress("PREMIERE_READY: Opening Screening Room Access Points...");
      await this.prepareScreening();

      // STATE 10: CORE Logic
      if (onProgress) onProgress("NEURAL_COMPLETE: Finalizing Studio Engine Parameters...");
      await new Promise(r => setTimeout(r, 1000)); // Final engine sync

      return {
        project: this.project,
        world,
        cast,
        relationships,
        series,
        sequences,
        script,
        marketing
      };
    } catch (error: any) {
      const errorMsg = error?.message || "Unknown Orchestration Error";
      console.error(`[ORCHESTRATOR-FAILURE] ${errorMsg}`, error);
      if (onProgress) onProgress(`CRITICAL_FAILURE: ${errorMsg}`);
      throw error; // Re-throw to let the UI handle the final notification
    }
  }

  private getCombinedPrompt(): string {
    return `${this.context.prompt}${this.context.theme ? `\n\nAesthetic Theme/Vibe: ${this.context.theme}` : ''}`;
  }

  private async initializeFoundation(): Promise<string> {
    const preset = VIBE_LIBRARY[this.context.vibe?.toLowerCase() || ""] || VIBE_LIBRARY["ufotable-noir"];

    // initialize project in PostgreSQL
    this.project = await apiRequest("/api/projects", {
      method: "POST",
      body: JSON.stringify({
        user_id: this.context.userId,
        title: `Production: ${this.context.prompt.slice(0, 30)}...`,
        content_type: this.context.contentType,
        prompt: this.context.prompt,
        vibe: preset.name,
        prod_metadata: {
          style_preset: preset,
          engine_version: "2.0-god-mode"
        }
      })
    });

    // Save production method to DB
    await apiRequest("/api/methods", {
      method: "POST",
      body: JSON.stringify({
        name: preset.name,
        description: `Autonomous production vibe for project ${this.project.id}`
      })
    });

    // Generate and save global World Lore
    const worldPrompt = this.getCombinedPrompt();
    const world = await generateWorld(worldPrompt, this.context.model, this.context.contentType);
    await apiRequest("/api/world-lore", {
      method: "POST",
      body: JSON.stringify({
        project_id: this.project.id,
        markdown_content: world,
        metadata: { source: "AI Core", version: "1.0" }
      })
    });

    return world;
  }

  private async buildSeries(world: string) {
    const architecturePrompt = this.getCombinedPrompt();
    // 1. Generate 5 Major Sessions (Arcs) dynamically via AI
    const sessions = await this.generateSessions(world);

    const savedSessions = await apiRequest<any[]>("/api/sessions", {
      method: "POST",
      body: JSON.stringify({ project_id: this.project.id, sessions })
    });

    // 2. Generate 60 Episode Narrative Flow (Series Plan)
    const series = await generateSeriesPlan(
      architecturePrompt,
      this.context.model,
      this.context.contentType,
      60,
      world
    );

    if (!Array.isArray(series)) throw new Error("Failed to generate series episodes.");

    return { series, savedSessions };
  }

  private async buildCast(world: string) {
    const architecturePrompt = this.getCombinedPrompt();
    // Generate Cast with Visual DNA (Global for all 960 units)
    const rawCast = await generateCharacters(architecturePrompt, this.context.model, this.context.contentType, world);

    // Process cast into a registry with "Visual DNA"
    const charactersList = (typeof rawCast !== 'string' && rawCast.characters) ? rawCast.characters : [];
    const cast = charactersList.map((c: any) => ({
      ...c,
      visual_dna: `[Trait: ${c.personality}, Appearance: ${c.appearance}]`
    }));

    // Save to DB
    await apiRequest("/api/characters", {
      method: "POST",
      body: JSON.stringify({ project_id: this.project.id, characters: cast })
    });

    return cast;
  }

  private async buildRelationships(cast: any[]) {
    const castAsText = cast.map((character: any) => `${character.name} (${character.archetype}): ${character.personality}`).join('\n');
    const relationships = await generateRelationships(
      this.context.contentType,
      castAsText,
      this.context.model,
      this.context.contentType
    );

    await apiRequest("/api/relationships", {
      method: "POST",
      body: JSON.stringify({
        project_id: this.project.id,
        relationships
      })
    });

    return relationships;
  }

  private async saveSeriesPlan(series: any[]) {
    // Fetch sessions created in buildSeries
    const savedSessions = await apiRequest<any[]>(`/api/sessions?project_id=${this.project.id}`);

    // Save Episodes to DB, linking them to their respective sessions
    for (const session of savedSessions) {
      const epStart = (session.session_number - 1) * 12;
      const epBatch = series.slice(epStart, epStart + 12);

      await apiRequest("/api/episodes", {
        method: "POST",
        body: JSON.stringify({
          project_id: this.project.id,
          session_id: session.id,
          episodes: epBatch.map((e: any, idx: number) => ({
            episode_number: epStart + idx + 1,
            title: e.title || `Episode ${epStart + idx + 1}`,
            hook: e.hook || '',
            summary: e.summary || ''
          }))
        })
      });
    }
  }

  private async scaffoldGeneration(_series: any[]): Promise<ProductionUnit[]> {
    console.info("%c[Phase 3] %cStarting Initial Scaffolding for 960 Skeletons...", 'color: #3b82f6; font-weight: bold;', 'color: #94a3b8;');

    // 1. Generate the 960 units blueprint (5 SESS * 12 EP * 16 SCEN)
    const sequences = generateProductionSequences(5, 12, 16);

    // Group sequences by episode to batch insert
    // This simulates the "bulkCreate" requested
    const dbEpisodes = await apiRequest<any[]>(`/api/episodes?project_id=${this.project.id}`);

    const allScenes: any[] = [];
    for (const ep of dbEpisodes) {
      const epSequences = sequences.filter(s => s.sess === Math.ceil(ep.episode_number / 12) && s.ep === ((ep.episode_number - 1) % 12) + 1);

      allScenes.push(...epSequences.map((_, idx) => ({
        episode_id: ep.id,
        scene_number: (ep.episode_number - 1) * 16 + (idx + 1),
        status: "QUEUED",
        visual_variance_index: Math.floor(idx / 4)
      })));
    }

    await apiRequest("/api/scenes", {
      method: "POST",
      body: JSON.stringify({
        project_id: this.project.id,
        scenes: allScenes
      })
    });

    console.info("%c[Orchestrator] %cSuccessfully scaffolded 960 scene records with visual variance markers.", 'color: #10b981; font-weight: bold;', 'color: #94a3b8;');

    return sequences;
  }

  private async generateSessions(world: string): Promise<any[]> {
    const systemInstruction = `
      You are an expert Story Architect for ${this.context.contentType}.
      Based on the provided World Lore and Prompt, create a 5-Session production arc.
      Each Session should represent a major narrative milestone.

      Return ONLY a JSON array with exactly 5 objects:
      [
        { "session_number": 1, "title": "Session Title", "summary": "Detailed summary of the session goals" },
        ...
      ]
    `;
    const prompt = `World Lore: ${world}\n\nProject Concept: ${this.context.prompt}\n\nGenerate the 5 major sessions.`;
    const orchestratorModel = this.context.model || "gemini-2.0-flash-exp";

    try {
      const result = await callAI(
        orchestratorModel,
        prompt,
        systemInstruction,
        0.85, // temperature
        2048, // maxTokens
        0.95, // topP
        40,   // topK
        180000 // timeoutMs
      );
      const cleanJson = result.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("Session Generation failed, using generic fallback arcs", e);
      return [
        { session_number: 1, title: "PHASE_01_INIT", summary: "Establishing narrative foundation and world-state." },
        { session_number: 2, title: "PHASE_02_DEVELOP", summary: "Synthesizing secondary conflicts and character friction." },
        { session_number: 3, title: "PHASE_03_TRANSITION", summary: "Architectural shift in narrative momentum." },
        { session_number: 4, title: "PHASE_04_PEAK", summary: "Peak intensity and climax orchestration." },
        { session_number: 5, title: "PHASE_05_CONCLUSION", summary: "Resolving all active narrative threads." }
      ];
    }
  }

  private async prepareSEO() {
    await seoApi.createEntry({
      keyword: `ANIME_${this.project.id}_${this.context.prompt.slice(0, 10).toUpperCase()}`,
      description: `Autonomous production metadata for ${this.context.prompt}`,
    });
  }

  private async preparePrompts() {
    await apiRequest("/api/prompts", {
      method: "POST",
      body: JSON.stringify({
        text: this.context.prompt,
        context: "MASTER_PRODUCTION_SEED"
      })
    });
  }

  private async prepareScreening() {
    const scripts = await apiRequest<any[]>(`/api/scripts?project_id=${this.project.id}`);
    if (scripts && scripts.length > 0) {
      await apiRequest("/api/screening_room_entries", {
        method: "POST",
        body: JSON.stringify({
          script_id: scripts[0].id,
          feedback: "Awaiting Initial Production Review..."
        })
      });
    }
  }

  private async materializePilot(world: string, cast: any, firstEpisode: any, relationships: any) {
    const scriptPrompt = `PILOT_PILOT: ${this.context.prompt}\n\nEPISODE_GOAL: ${firstEpisode.title} - ${firstEpisode.summary || firstEpisode.hook}`;

    // Convert cast to string if it's an array
    const castProfiles = Array.isArray(cast)
      ? cast.map(c => `${c.name} (${c.role}): ${c.personality}`).join('\n')
      : JSON.stringify(cast);

    const relationshipProfiles = Array.isArray(relationships)
      ? relationships.map((relationship: any) => `${relationship.source} -> ${relationship.target} [${relationship.type}]: ${relationship.description}`).join('\n')
      : JSON.stringify(relationships);

    const episodePlan = firstEpisode ? `${firstEpisode.title}\n${firstEpisode.summary || firstEpisode.hook || ''}` : null;

    const scriptMarkdown = await generateScript(
      scriptPrompt,
      this.context.vibe || "Energetic",
      "Anime Fans",
      "1",
      "1",
      "8", // 8 scenes for the pilot starter
      this.context.model,
      this.context.contentType,
      "SHOGUN_AI",
      relationshipProfiles,
      world,
      castProfiles,
      episodePlan
    );

    // Save Pilot Script to DB
    const dbEpisodes = await apiRequest<any[]>(`/api/episodes?project_id=${this.project.id}`);
    const firstEp = dbEpisodes.find(e => e.episode_number === 1);

    await apiRequest("/api/scripts", {
      method: "POST",
      body: JSON.stringify({
        project_id: this.project.id,
        episode_id: firstEp?.id,
        title: `PILOT: ${firstEpisode.title}`,
        content: scriptMarkdown
      })
    });

    return scriptMarkdown;
  }

  private async buildMarketingAssets(scriptMarkdown: string) {
    const [metadata, description, altText, growthStrategy, distributionStrategy, imagePrompts] = await Promise.all([
      generateMetadata(scriptMarkdown, this.context.model),
      generateYouTubeDescription(scriptMarkdown, this.context.model, this.context.contentType),
      generateAltTexts(scriptMarkdown, this.context.model),
      generateGrowthStrategy(scriptMarkdown, this.context.model, this.context.contentType),
      generateDistributionStrategy(scriptMarkdown, this.context.model),
      generateImagePrompts(scriptMarkdown, this.context.model)
    ]);

    await apiRequest("/api/prompts", {
      method: "POST",
      body: JSON.stringify({
        project_id: this.project.id,
        context: "MARKETING_PACKAGE",
        metadata,
        description,
        altText,
        growthStrategy,
        distributionStrategy,
        imagePrompts
      })
    });

    return {
      metadata,
      description,
      altText,
      growthStrategy,
      distributionStrategy,
      imagePrompts
    };
  }
}

export function phaseToPercent(phase: string): number {
  const p = (phase || '').toUpperCase();
  if (p.startsWith('SIGNAL_INIT')) return 3;
  if (p.startsWith('PROTOCOL_SCALPEL')) return 12;
  if (p.startsWith('SYNTHESIS_DNA')) return 22;
  if (p.startsWith('RELATIONSHIP_MATRIX')) return 30;
  if (p.startsWith('ROADMAP_INIT')) return 38;
  if (p.startsWith('MANIFEST_SCRIPT')) return 50;
  if (p.startsWith('PACKAGING_ASSETS')) return 60;
  if (p.startsWith('SCAFFOLD_VISUAL')) return 72;
  if (p.startsWith('SEO_OPTIMIZE')) return 82;
  if (p.startsWith('PROMPT_REFINERY')) return 88;
  if (p.startsWith('PREMIERE_READY')) return 94;
  if (p.startsWith('NEURAL_COMPLETE')) return 100;
  if (p.startsWith('CRITICAL_FAILURE')) return 100;
  return 0;
}
