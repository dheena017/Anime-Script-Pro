import { generateImagePrompts, generateVideoPrompts, generateMusicPrompts } from '@/services/api/gemini';

/**
 * Blueprint Markdown Generator
 * Converts AI-generated plan data + world/character context into a comprehensive markdown document
 */

interface BlueprintMarkdownParams {
  plan: any[];
  sessions: number;
  episodesPerSession: number;
  scenesPerEpisode: number;
  framesPerScene?: number;
  
  // World Context
  worldManifest?: string;
  worldLore?: string;
  worldPowers?: string;
  worldFactions?: string;
  worldAtlas?: string;
  worldSystems?: string;
  worldCulture?: string;
  worldArchitecture?: string;
  
  // Character Context
  characterList?: any[];
  characterDNA?: any;
  characterDynamics?: string;
  characterIntegrity?: string;
  characterRelationships?: string;
  
  // Generation Parameters
  model?: string;
  tone?: string;
  audience?: string;
  genre?: string;
  artStyle?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  contentType?: string;
  projectTitle?: string;
}

// ── PRIMARY EXPORTED GENERATORS ──────────────────────────────────────────────

export async function generateBlueprintMarkdown(params: BlueprintMarkdownParams): Promise<string> {
  const {
    plan,
    sessions,
    episodesPerSession,
    scenesPerEpisode,
    framesPerScene,
    worldManifest,
    worldLore,
    worldPowers,
    worldFactions,
    worldAtlas,
    worldSystems,
    worldCulture,
    worldArchitecture,
    characterList,
    characterDNA,
    characterDynamics,
    characterIntegrity,
    characterRelationships,
    model,
    tone,
    audience,
    genre,
    artStyle,
    temperature,
    maxTokens,
    topP,
    topK,
    contentType,
    projectTitle
  } = params;

  const totalEpisodes = sessions * episodesPerSession;
  const totalScenes = totalEpisodes * scenesPerEpisode;
  const totalFrames = Number.isFinite(framesPerScene ?? NaN) ? totalScenes * (framesPerScene as number) : undefined;
  const generatedDate = new Date().toLocaleString();

  // Helper: auto-fill missing prompts using generator functions
  async function fillMissingPrompts(): Promise<void> {
    if (!plan || !Array.isArray(plan) || plan.length === 0) return;

    const tasks: Promise<void>[] = [];

    plan.forEach((ep: any) => {
      const acts = ep.detailed_episode_spec?.acts || [];
      acts.forEach((act: any) => {
        const scenes = act.scenes || [];
        scenes.forEach((scene: any) => {
          tasks.push((async () => {
            try {
              const sceneText = scene.summary || scene.description || scene.visual_direction || '';

              if (Array.isArray(scene.frames) && scene.frames.length > 0) {
                await Promise.all(scene.frames.map(async (frame: any) => {
                  const frameText = frame.frame_description || frame.description || sceneText || '';
                  if (!frame.image_prompt) {
                    frame.image_prompt = await generateImagePrompts(String(frameText).slice(0, 1000));
                  }
                  if (!frame.video_prompt) {
                    frame.video_prompt = await generateVideoPrompts(String(frameText).slice(0, 1000));
                  }
                  if (!frame.music_prompt && !frame.audio_prompt) {
                    const music = await generateMusicPrompts(String(frameText).slice(0, 1000));
                    frame.music_prompt = frame.music_prompt || music;
                    frame.audio_prompt = frame.audio_prompt || music;
                  }
                }));
              } else {
                if (!scene.image_prompt) {
                  scene.image_prompt = await generateImagePrompts(String(sceneText).slice(0, 1000));
                }
                if (!scene.video_prompt) {
                  scene.video_prompt = await generateVideoPrompts(String(sceneText).slice(0, 1000));
                }
                if (!scene.music_prompt && !scene.audio_prompt) {
                  const music = await generateMusicPrompts(String(sceneText).slice(0, 1000));
                  scene.music_prompt = scene.music_prompt || music;
                  scene.audio_prompt = scene.audio_prompt || music;
                }
              }
            } catch (err) {
              console.warn('Non-fatal: Failed to auto-generate prompts for scene/frame:', err);
            }
          })());
        });
      });
    });

    await Promise.all(tasks);
  }

  await fillMissingPrompts();

  const resolvedSessions = Number.isFinite(sessions) && sessions > 0 ? sessions : 0;
  const groupedEpisodes: Record<string, any[]> = {};
  const hasSessionField = plan.some((episode) => typeof episode?.session === 'number' && Number.isFinite(episode.session));

  if (plan.length > 0) {
    if (hasSessionField) {
      plan.forEach((episode) => {
        const sessionKey = `Session ${Number(episode.session)}`;
        if (!groupedEpisodes[sessionKey]) groupedEpisodes[sessionKey] = [];
        groupedEpisodes[sessionKey].push(episode);
      });
    } else if (resolvedSessions > 0) {
      for (let sessionIndex = 0; sessionIndex < resolvedSessions; sessionIndex += 1) {
        const sessionKey = `Session ${sessionIndex + 1}`;
        groupedEpisodes[sessionKey] = plan.slice(
          sessionIndex * episodesPerSession,
          (sessionIndex + 1) * episodesPerSession,
        );
      }
    } else {
      groupedEpisodes['Session 1'] = plan;
    }
  }

  // Assign a global, sequential episode number for each episode in the grouped order
  const flattenedEpisodes: any[] = Object.entries(groupedEpisodes).flatMap(([_, eps]) => eps || []);
  flattenedEpisodes.forEach((ep, i) => {
    // prefer explicit ep.episode if provided, otherwise assign zero-padded global index
    ep.__displayEpisodeNumber = ep.episode || String(i + 1).padStart(2, '0');
  });

  let md = '';

  // ═══════════════════════════════════════════════════════════════════════════════════
  // HEADER & METADATA
  // ═══════════════════════════════════════════════════════════════════════════════════

  md += `# 🎬 Production Blueprint\n\n`;
  if (projectTitle) {
    md += `**Project:** ${projectTitle}\n\n`;
  }
  md += `**Generated:** ${generatedDate}\n\n`;

  // ═══════════════════════════════════════════════════════════════════════════════════
  // PRODUCTION SCAFFOLDING SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════════════

  md += `## 📊 Production Scaffolding\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| **Session Count** | ${sessions} |\n`;
  md += `| **Episodes Per Session** | ${episodesPerSession} |\n`;
  md += `| **Scenes Per Episode** | ${scenesPerEpisode} |\n`;
  md += `| **Frames Per Scene** | ${framesPerScene ?? 'N/A'} |\n`;
  md += `| **Total Episodes** | ${totalEpisodes} |\n`;
  md += `| **Total Scenes** | ${totalScenes} |\n`;
  md += `| **Total Frames** | ${totalFrames ?? 'N/A'} |\n`;
  md += `| **Est. Total Runtime** | ${totalEpisodes * 24}m |\n\n`;

  // ═══════════════════════════════════════════════════════════════════════════════════
  // AI ENGINE CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════════════

  md += `## ⚙️ AI Engine Configuration\n\n`;
  md += `| Parameter | Value |\n`;
  md += `|-----------|-------|`;
  md += `| **Model** | ${model || 'Not specified'} |\n`;
  md += `| **Temperature** | ${temperature ?? 'N/A'} |\n`;
  md += `| **Max Tokens** | ${maxTokens ?? 'N/A'} |\n`;
  md += `| **Top P** | ${topP ?? 'N/A'} |\n`;
  md += `| **Top K** | ${topK ?? 'N/A'} |\n`;
  md += `| **Content Type** | ${contentType || 'N/A'} |\n\n`;

  // ═══════════════════════════════════════════════════════════════════════════════════
  // CREATIVE DIRECTION
  // ═══════════════════════════════════════════════════════════════════════════════════

  md += `## 🎨 Creative Direction\n\n`;
  md += `| Aspect | Setting |\n`;
  md += `|--------|----------|\n`;
  md += `| **Tone** | ${tone || 'N/A'} |\n`;
  md += `| **Target Audience** | ${audience || 'N/A'} |\n`;
  md += `| **Genre** | ${genre || 'N/A'} |\n`;
  md += `| **Art Style** | ${artStyle || 'N/A'} |\n\n`;

  // ═══════════════════════════════════════════════════════════════════════════════════
  // WORLD BIBLE
  // ═══════════════════════════════════════════════════════════════════════════════════

  md += `## 🌍 World Bible\n\n`;

  if (worldManifest) {
    md += `### Manifest\n\n${worldManifest}\n\n`;
  }

  if (worldLore) {
    md += `### History & Lore\n\n${worldLore}\n\n`;
  }

  if (worldPowers) {
    md += `### Powers & Magic Systems\n\n${worldPowers}\n\n`;
  }

  if (worldFactions) {
    md += `### Factions & Organizations\n\n${worldFactions}\n\n`;
  }

  if (worldArchitecture) {
    md += `### Architecture & Infrastructure\n\n${worldArchitecture}\n\n`;
  }

  if (worldAtlas) {
    md += `### Atlas & Geography\n\n${worldAtlas}\n\n`;
  }

  if (worldCulture) {
    md += `### Culture & Customs\n\n${worldCulture}\n\n`;
  }

  if (worldSystems) {
    md += `### Systems & Mechanics\n\n${worldSystems}\n\n`;
  }

  // ═══════════════════════════════════════════════════════════════════════════════════
  // CAST DNA
  // ═══════════════════════════════════════════════════════════════════════════════════

  md += `## 👥 Cast DNA Registry\n\n`;

  if (characterList && characterList.length > 0) {
    md += `### Character List (${characterList.length} Entities)\n\n`;
    characterList.forEach((char, idx) => {
      const name = char.name || char.character_name || `Character ${idx + 1}`;
      const role = char.role || char.character_role || 'TBD';
      const description = char.description || char.character_description || char.bio || '';

      md += `#### ${idx + 1}. ${name}\n`;
      md += `- **Role:** ${role}\n`;
      if (description) {
        md += `- **Description:** ${description}\n`;
      }
      md += `\n`;
    });
  }

  if (characterDNA) {
    md += `### Character DNA Profiles\n\n`;
    if (typeof characterDNA === 'string') {
      md += `${characterDNA}\n\n`;
    } else if (typeof characterDNA === 'object') {
      md += `\`\`\`json\n${JSON.stringify(characterDNA, null, 2)}\n\`\`\`\n\n`;
    }
  }

  if (characterDynamics) {
    md += `### Psychological Dynamics\n\n${characterDynamics}\n\n`;
  }

  if (characterIntegrity) {
    md += `### Lore Integrity\n\n${characterIntegrity}\n\n`;
  }

  if (characterRelationships) {
    md += `### Social Web & Relationships\n\n${characterRelationships}\n\n`;
  }

  // ═══════════════════════════════════════════════════════════════════════════════════
  // PRODUCTION SERIES PLAN
  // ═══════════════════════════════════════════════════════════════════════════════════

  md += `## 🧭 Production Series Plan\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| **Requested Sessions** | ${sessions} |\n`;
  md += `| **Episodes Per Session** | ${episodesPerSession} |\n`;
  md += `| **Requested Total Episodes** | ${totalEpisodes} |\n`;
  md += `| **Actual Generated Episodes** | ${plan.length} |\n`;
  md += `| **Scenes Per Episode** | ${scenesPerEpisode} |\n`;
  md += `| **Requested Total Scenes** | ${totalScenes} |\n`;
  md += `| **Episode Match** | ${plan.length === totalEpisodes ? 'Exact' : `Mismatch (${plan.length}/${totalEpisodes})`} |\n\n`;

  // ═══════════════════════════════════════════════════════════════════════════════════
  // EPISODE ROADMAP
  // ═══════════════════════════════════════════════════════════════════════════════════

  md += `## 📺 Episode Roadmap\n\n`;

  if (!plan || plan.length === 0) {
    md += `*No episodes generated yet.*\n\n`;
  } else {
    // Session Summary
    md += `### Session Breakdown\n\n`;
    Object.entries(groupedEpisodes).forEach(([sessionName, episodes]) => {
      md += `#### ${sessionName} (${episodes.length} episodes)\n\n`;
      if (episodes.length === 0) {
        md += `*No episodes generated for this session.*\n\n`;
        return;
      }
      md += `| # | Title | Setting | Tone | Runtime |\n`;
      md += `|---|-------|---------|------|----------|\n`;

      episodes.forEach((ep, idx) => {
        const epNum = ep.__displayEpisodeNumber || (ep.episode || String(idx + 1).padStart(2, '0'));
        const title = ep.title || `Episode ${epNum}`;
        const setting = ep.setting || 'TBD';
        const epTone = ep.emotional_arc || tone || 'N/A';
        const runtime = ep.runtime || '24m';

        md += `| ${epNum} | ${title} | ${setting} | ${epTone} | ${runtime} |\n`;
      });

      md += `\n`;
    });

    // Detailed Episode Specs
    md += `### Detailed Episode Specifications\n\n`;

    Object.entries(groupedEpisodes).forEach(([sessionName, episodes]) => {
      if (episodes.length === 0) return;
      md += `#### ${sessionName}\n\n`;
      episodes.forEach((ep, idx) => {
        const epNum = ep.__displayEpisodeNumber || (ep.episode || String(idx + 1).padStart(2, '0'));
        const title = ep.title || `Episode ${epNum}`;

        md += `---\n`;
        // Insert machine-friendly episode symbol used by downstream tools
        md += `#sym:Episode ${epNum}\n\n`;
        md += `##### Episode ${epNum}: ${title}\n\n`;

        if (ep.hook) {
          md += `**Hook:** ${ep.hook}\n\n`;
        }

        if (ep.summary) {
          md += `**Summary:**\n${ep.summary}\n\n`;
        }

        if (ep.setting) {
          md += `**Setting:** ${ep.setting}\n\n`;
        }

        if (ep.emotional_arc) {
          md += `**Emotional Arc:** ${ep.emotional_arc}\n\n`;
        }

        if (ep.asset_matrix?.characters && ep.asset_matrix.characters.length > 0) {
          md += `**Featured Characters:**\n`;
          ep.asset_matrix.characters.forEach((char: any) => {
            const charName = typeof char === 'string' ? char : char.name || char;
            md += `- ${charName}\n`;
          });
          md += `\n`;
        }

        if (ep.asset_matrix) {
          md += `**Asset Matrix:**\n`;
          if (ep.asset_matrix.scene_count) {
            md += `- Scenes: ${ep.asset_matrix.scene_count}\n`;
          }
          if (ep.asset_matrix.locations && ep.asset_matrix.locations.length > 0) {
            md += `- Locations: ${ep.asset_matrix.locations.join(', ')}\n`;
          }
          if (ep.asset_matrix.vfx && ep.asset_matrix.vfx.length > 0) {
            md += `- VFX Elements: ${ep.asset_matrix.vfx.join(', ')}\n`;
          }
          md += `\n`;
        }

        if (ep.detailed_episode_spec?.acts && ep.detailed_episode_spec.acts.length > 0) {
          md += `**Acts & Scenes:**\n\n`;

          ep.detailed_episode_spec.acts.forEach((act: any, actIdx: number) => {
            const actName = act.name || `Act ${actIdx + 1}`;
            md += `**${actName}**\n\n`;

            if (act.description) {
              md += `${act.description}\n\n`;
            }

            if (act.scenes && act.scenes.length > 0) {
              act.scenes.forEach((scene: any, sceneIdx: number) => {
                const sceneNum = scene.scene_number || sceneIdx + 1;
                const sceneTitle = scene.title || scene.scene_title || `Scene ${sceneNum}`;
                const sceneType = scene.type || scene.scene_type || '';

                md += `- **Scene ${sceneNum}: ${sceneTitle}** ${sceneType ? `(${sceneType})` : ''}\n`;

                if (scene.description) {
                   md += `  - ${scene.description}\n`;
                }

                if (scene.characters) {
                  const charNames = Array.isArray(scene.characters)
                    ? scene.characters.map((c: any) => typeof c === 'string' ? c : c.name).join(', ')
                    : scene.characters;
                  md += `  - Characters: ${charNames}\n`;
                }

                if (scene.production_stats) {
                  if (scene.production_stats.vfx_heavy) {
                    md += `  - ⚠️ VFX Heavy\n`;
                  }
                  if (scene.production_stats.cast_count) {
                    md += `  - Cast Count: ${scene.production_stats.cast_count}\n`;
                  }
                }

                if (Array.isArray(scene.frames) && scene.frames.length > 0) {
                  md += `  - **Frames:** (${scene.frames.length} total)\n\n`;
                  
                  // Add frame beat summary if available
                  const beats = scene.frames
                    .filter((f: any) => f.beat_name)
                    .map((f: any) => f.beat_name)
                    .join(' → ');
                  
                  if (beats) {
                    md += `    > **Scene Arc:** ${beats}\n\n`;
                  }
                  
                  scene.frames.forEach((frame: any, frameIdx: number) => {
                    const frameIndex = frame.frame_number ?? frame.frameNumber ?? frame.frame_id ?? frameIdx + 1;
                    const frameDescription = frame.frame_description || frame.description || '';
                    md += renderFrame(frame, frameIndex, frameDescription);
                  });
                } else {
                  md += renderPromptBlock(scene.image_prompt, 'Image Prompt');
                  md += renderPromptBlock(scene.video_prompt, 'Video Prompt');
                  md += renderPromptBlock(scene.audio_prompt, 'Audio Prompt');
                  md += renderPromptBlock(scene.music_prompt, 'Music Prompt');
                  md += renderPromptBlock(scene.system_rules, 'System Rules');
                }

                md += `\n`;
              });
            }
          });

          md += `\n`;
        }

        if (ep.production_stats) {
          md += `**Production Stats:**\n`;
          if (ep.production_stats.vfx_heavy) {
            md += `- Heavy VFX Required: Yes\n`;
          }
          if (ep.production_stats.cast_count) {
            md += `- Cast Count: ${ep.production_stats.cast_count}\n`;
          }
          md += `\n`;
        }

        if (ep.engagement_matrix) {
          md += `**Engagement Matrix:**\n`;
          if (ep.engagement_matrix.pacing_intensity) {
            md += `- Pacing Intensity: ${ep.engagement_matrix.pacing_intensity}\n`;
          }
          if (ep.engagement_matrix.emotional_impact) {
            md += `- Emotional Impact: ${ep.engagement_matrix.emotional_impact}\n`;
          }
          md += `\n`;
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════════════════════════════════════════════

  md += `---\n\n`;
  md += `### 📝 Notes\n\n`;
  md += `This blueprint was generated by the Anime Script Pro AI Engine on ${generatedDate}.\n`;
  md += `All content is subject to review and revision.\n`;

  return md;
}

/**
 * Downloads the blueprint markdown as a file
 */
export function downloadBlueprintMarkdown(content: string, projectTitle?: string) {
  const filename = projectTitle
    ? `${projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-blueprint.md`
    : `production-blueprint-${new Date().getTime()}.md`;

  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── INTERNAL HELPERS & RENDERERS ─────────────────────────────────────────────

function renderFrame(promptObject: any, frameIndex: string | number, frameDescription?: string): string {
  let md = `    - **Frame ${frameIndex}**`;
  
  // Add beat information if available
  if (promptObject?.beat_name) {
    md += ` [${promptObject.beat_type?.toUpperCase() || 'BEAT'}] - ${promptObject.beat_name}`;
  }
  
  if (frameDescription) {
    md += `: ${frameDescription}`;
  }
  
  md += '\n';
  md += renderPromptBlock(promptObject?.image_prompt, 'Image Prompt', '      ');
  md += renderPromptBlock(promptObject?.video_prompt, 'Video Prompt', '      ');
  md += renderPromptBlock(promptObject?.audio_prompt, 'Audio Prompt', '      ');
  md += renderPromptBlock(promptObject?.music_prompt, 'Music Prompt', '      ');
  md += renderPromptBlock(promptObject?.system_rules, 'System Rules', '      ');
  return md + '\n';
}

function renderPromptBlock(prompt: unknown, label: string, indent: string = '  '): string {
  if (!prompt) return '';
  const text = String(prompt).trim();
  if (!text) return '';

  return `${indent}- **${label}:**\n\n${indent}  ${text.replace(/\n/g, `\n${indent}  `)}\n`;
}
