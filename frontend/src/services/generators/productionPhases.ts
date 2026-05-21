import { generateWorld } from '@/services/generators/world';
import { generateCharacters } from '@/services/generators/characters';
import { generateSeriesPlan } from '@/services/generators/series';
import { generateImagePrompts, generateMetadata } from '@/services/api/gemini';
import { generateScriptStream } from '@/services/generators/script';

export interface ProductionPhase {
  id: string;
  name: string;
  progress: number;
  message: string;
  action: (context: any) => Promise<any>;
}

export const productionPhases: ProductionPhase[] = [
  {
    id: 'WORLD',
    name: 'World Architecture',
    progress: 5,
    message: 'Building World Foundation and Setting...',
    action: async (ctx) => {
      const world = await generateWorld(ctx.prompt, ctx.selectedModel, 'Anime');
      ctx.setGeneratedWorld(world);
      return world;
    }
  },
  {
    id: 'CAST',
    name: 'Character Creation',
    progress: 25,
    message: 'Designing Character Profiles and Traits...',
    action: async (ctx) => {
      const castResult = await generateCharacters(ctx.prompt, ctx.selectedModel, 'Anime', ctx.world);
      if (typeof castResult === 'object' && castResult.characters) {
        ctx.setGeneratedCharacters(castResult.markdown);
        ctx.setCastData(castResult);
        ctx.setCastList(castResult.characters);
        if (castResult.relationships) {
          ctx.setCharacterRelationships(JSON.stringify(castResult.relationships));
        }
      } else {
        ctx.setGeneratedCharacters(castResult as string);
      }
      return castResult;
    }
  },
  {
    id: 'SERIES',
    name: 'Series Structure',
    progress: 40,
    message: 'Designing Series Overall Structure...',
    action: async (ctx) => {
      const seriesPlan = await generateSeriesPlan(
        ctx.prompt,
        ctx.selectedModel,
        'Anime',
        12,
        ctx.world,
        typeof ctx.castResult === 'string' ? ctx.castResult : ctx.castResult.markdown
      );
      ctx.setGeneratedSeriesPlan(seriesPlan);
      return seriesPlan;
    }
  },
  {
    id: 'SCRIPT',
    name: 'Script Writing',
    progress: 55,
    message: 'Generating Episode 1 Script (Streaming)...',
    action: async (ctx) => {
      const ep1Plan = ctx.seriesPlan?.find((ep: any) => parseInt(ep.episode) === 1);
      const script = await generateScriptStream(
        ctx.prompt, ctx.tone, ctx.audience, "1", "1", ctx.numScenes, ctx.selectedModel, 'Anime',
        ctx.recapperPersona, ctx.characterRelationships, ctx.world,
        typeof ctx.castResult === 'string' ? ctx.castResult : ctx.castResult.markdown,
        ep1Plan ? JSON.stringify(ep1Plan) : null,
        (partial) => {
          ctx.setGeneratedScript(partial);
        }
      );
      ctx.setGeneratedScript(script);
      return script;
    }
  },
  {
    id: 'STORYBOARD',
    name: 'Visual Planning',
    progress: 75,
    message: 'Creating Visual Descriptions for Scenes...',
    action: async (ctx) => {
      const visualPrompts = await generateImagePrompts(ctx.script, ctx.selectedModel);
      ctx.setGeneratedImagePrompts(visualPrompts);
      ctx.setVisualData({ 0: ["pending"] });
      return visualPrompts;
    }
  },
  {
    id: 'SEO',
    name: 'Content Metadata',
    progress: 90,
    message: 'Generating Content Metadata and Tags...',
    action: async (ctx) => {
      const seo = await generateMetadata(ctx.script, ctx.selectedModel);
      ctx.setGeneratedMetadata(seo);
      return seo;
    }
  }
];
