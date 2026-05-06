// ==================== ERROR HANDLING & VALIDATION ====================

function validateMetadataScript(script: string | null): void {
  if (!script || typeof script !== 'string' || script.trim().length < 20) {
    throw new Error('Source script must be at least 20 characters long to generate meaningful metadata.');
  }
}

function validateMetadataContentType(contentType: string): void {
  if (!contentType || typeof contentType !== 'string' || contentType.trim().length < 2) {
    throw new Error('Content type must be a non-empty string with at least 2 characters.');
  }
}

function safeMetadataPromptGeneration<T>(input: T, validator: (input: T) => void, promptGenerator: (input: T) => string): string {
  try {
    validator(input);
    return promptGenerator(input);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `ERROR: ${message}`;
  }
}

// ==================== CORE METADATA PROMPTS ====================

export const METADATA_GENERATION_PROMPT = (script: string | null) =>
  safeMetadataPromptGeneration(script, validateMetadataScript, (sourceScript) => `
You are an anime-focused YouTube SEO strategist, growth editor, and packaging specialist.

SOURCE SCRIPT DATA:
${sourceScript}

PRIME DIRECTIVE:
- Base every title, description, tag, alt text concept, and thumbnail concept on the actual events, character arcs, visual motifs, and emotional beats present in the source script.
- Preserve canon from the wider content pipeline whenever it appears in the script: world-building rules, series arc context, scene-level continuity, character relationships, and narrative stakes.
- Do not invent major plot points, powers, settings, or character facts that are not supported by the script.
- Optimize for discoverability without sacrificing story truth.

CONTENT CONNECTIVITY RULES:
- Treat the script as the final downstream version of the world, series, and scene prompts.
- If the script references lore, faction politics, episode structure, or emotional beats, reflect those elements in the metadata.
- Keep terminology consistent with the story world so the metadata feels native to the series.
- Make titles and thumbnails align with the strongest visual and emotional hook in the script, not just the most generic keyword.

GENERATE A COMPLETE METADATA PACK:
1. **5 Viral-Style Titles**
   - High CTR, cinematic, and keyword-aware.
   - Use emotional hooks, stakes, mystery, or escalation.
   - Avoid clickbait that contradicts the actual content.
   - Prefer titles that feel like episode or arc names from the same universe.

2. **YouTube Description Blueprint**
   - Open with a strong hook and concise context.
   - Summarize the story arc, character stakes, and visual identity.
   - Mention relevant series/world keywords naturally.
   - Include a clear CTA and a comment prompt.

3. **15-20 SEO Tags**
   - Mix broad, niche, franchise, genre, and scene-specific keywords.
   - Include character names, world terms, and emotional descriptors when available.
   - Balance discoverability with precision.

4. **3 Thumbnail Concepts**
   - Describe focal subject, facial expression, composition, color contrast, text overlay idea, and emotional hook.
   - Tie each concept to the most clickable moment in the script.
   - Prefer readable shapes, strong silhouettes, and clear focal hierarchy.

5. **Packaging Notes**
   - Add a short section describing the main audience promise, the strongest hook, and the recommended visual branding approach.

QUALITY BAR:
- The output should feel like a full metadata production brief, not just a list.
- Prioritize specificity, consistency, and high-conversion packaging.
- Keep the tone aligned with the story world and audience expectations.

OUTPUT FORMAT:
Return clean Markdown with the following sections (each section MUST be introduced by the exact heading shown):
## Title Options
// Provide titles as a numbered list (1. ...)

## Description
// Full YouTube description copy here

## SEO Tags
// Comma-separated list of tags on a single line

## Thumbnail Concepts
// Provide 3 thumbnail concepts under this heading

## Packaging Notes
// Short packaging notes and audience promise
`);

export const YOUTUBE_DESCRIPTION_GENERATION_PROMPT = (contentType: string, script: string | null) =>
   safeMetadataPromptGeneration({ contentType, script }, (input) => {
    validateMetadataContentType(input.contentType);
    validateMetadataScript(input.script);
   }, ({ contentType, script: sourceScript }) => `
You are an anime-focused YouTube growth strategist and retention editor.

CONTENT TYPE:
${contentType}

SOURCE SCRIPT DATA:
${sourceScript}

PRIME DIRECTIVE:
- Base the description on the actual narrative events, characters, visual directions, and emotional turns found in the source script.
- Reflect the same world logic, scene progression, and character continuity used in the script, scene, series, and world prompts.
- Keep the description faithful to the story while still optimized for search and retention.

DESCRIPTION BLUEPRINT:
1. **Hook & About**
   - Write 2-3 paragraphs that summarize the premise and the emotional arc.
   - Make the opening compelling enough to hold attention immediately.
   - Use story-first language before SEO language.

2. **Chapters & Structure**
   - Add timestamps if the script provides clear sectioning.
   - Use chapter headings that reflect the story beats, not filler phrases.
   - Keep chapter names keyword-friendly and readable.

3. **Audience Engagement**
   - Include a question that invites comments.
   - Include a short CTA for likes, subs, or related content.
   - Keep the CTA aligned with the tone of the content.

4. **SEO Layer**
   - Weave in relevant anime, genre, arc, character, and emotional keywords naturally.
   - Avoid awkward keyword stuffing.
   - Match the vocabulary used in the story world where possible.

5. **Community Layer**
   - Add a short line encouraging viewers to share theories, reactions, or favorite moments.
   - Reinforce that the video is part of a larger content ecosystem.

QUALITY BAR:
- The description should read like a polished channel asset.
- It should be useful for both the algorithm and human viewers.

OUTPUT FORMAT:
Return clean Markdown with clear headings and readable paragraphs.
`);

export const ALT_TEXT_GENERATION_PROMPT = (script: string | null) =>
  safeMetadataPromptGeneration(script, validateMetadataScript, (sourceScript) => `
You are an accessibility-focused anime content specialist and visual SEO writer.

SOURCE SCRIPT DATA:
${sourceScript}

PRIME DIRECTIVE:
- Base all alt text on the actual scene imagery, character actions, emotional tone, and branding details found in the source script.
- Preserve continuity with the story world, scene-level composition, and character identities where possible.

TASK:
- Generate 10 concise alt text captions for key storyboard frames, hero images, or promotional visuals.
- Each caption must be one sentence maximum.
- Each caption should describe the image clearly enough for screen readers while still being usable as a discovery-friendly visual label.

CAPTION RULES:
- Mention the main subject, emotional tone, and any important visual cue.
- Keep language specific and natural.
- Avoid vague phrases like "cool scene" or "dramatic image."
- If a frame has a clear cinematic hook, make that hook legible in the alt text.

OUTPUT FORMAT:
Return a Markdown list with 10 items.
`);

export const GROWTH_STRATEGY_PROMPT = (contentType: string, script: string | null) =>
   safeMetadataPromptGeneration({ contentType, script }, (input) => {
    validateMetadataContentType(input.contentType);
    validateMetadataScript(input.script);
  }, ({ contentType, script: sourceScript }) => `
You are an anime growth strategist, community architect, and content repurposing planner.

CONTENT TYPE:
${contentType}

SOURCE SCRIPT DATA:
${sourceScript}

PRIME DIRECTIVE:
- Build the strategy from the actual narrative, character, and visual foundations in the source script.
- Keep the strategy aligned with the broader storytelling system: world, series, scene, and metadata outputs should reinforce each other.
- Every recommendation should be actionable, specific, and appropriate for ${contentType} content.

GROWTH STRATEGY AREAS:
1. **Educational Video Series**
   - Define topic clusters derived from the script's world, characters, or production process.
   - Propose a release cadence and a repeatable episode format.
   - Include title ideas, CTA ideas, and a basic outline template.

2. **Influencer Collaboration DNA**
   - Identify relevant creator niches and likely collaboration angles.
   - Draft a pitch concept that reflects the story's unique hook.
   - Suggest formats that fit anime audiences and adjacent fandoms.

3. **Live Stream Events**
   - Propose live event ideas that fit the content's tone and audience interests.
   - Include technical setup, moderation, and engagement ideas.

4. **Community & Engagement**
   - Recommend comment response patterns, theory prompts, and community tab ideas.
   - Include ways to turn viewer reactions into future content.

5. **Repurposing Matrix**
   - Explain how to convert the script into Shorts, Reels, TikToks, clips, and teaser assets.
   - Tie each repurposed asset to a specific hook from the script.

6. **ROI & Metrics**
   - Recommend the most relevant metrics for watch performance and audience growth.
   - Explain what success looks like and what should be monitored over time.

QUALITY BAR:
- The strategy should read like a practical content operations plan.
- Make the recommendations directly usable for a channel focused on story-driven anime content.

OUTPUT FORMAT:
Return professional Markdown with clear headings, bullet points, and short planning notes.
`);



