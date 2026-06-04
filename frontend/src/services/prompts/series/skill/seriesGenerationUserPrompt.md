CONTENT TYPE: {{CONTENT_TYPE}}
PROJECT PROMPT: {{PROMPT}}
WORLD BIBLE CONTEXT: {{WORLD_CONTEXT}}
CAST DNA REGISTRY: {{CAST_CONTEXT}}

PRODUCTION SCAFFOLDING:
- Total sessions requested: {{SESSIONS_TEXT}}.
- Episodes per session requested: {{EPISODES_PER_SESSION_TEXT}}.
- Total episodes requested: {{TOTAL_EPISODES_TEXT}}.
- Scenes per episode requested: {{SCENES_TEXT}}.
- Frames per scene requested: {{FRAMES_TEXT}}.

BLUEPRINT COUNT RULES:
- Episode count = {{EPISODE_COUNT}}.
- Treat episodeCount as the exact number of episode objects to return.
- Keep internal scene structure consistent, but do not let it change the total episode count.
{{PARTIAL_REQUEST_NOTE}}

SESSION RULES:
- Each episode MUST declare a top-level "session" integer and a "session_name" string.
- If the response is flat, still populate session fields so the UI can group episodes by session.
- Session ordering must be sequential and stable.
- Each session should maintain a coherent production arc and distinct palette.

SEASON ORCHESTRATION RULES:
1. PACE: Build a {{EPISODE_COUNT}}-episode arc with a 30-minute cinematic pacing per episode.
2. CONTINUITY: Every scene must strictly obey the World Bible and Cast DNA.
3. COMPLEXITY: Each episode must contain 3 Acts. The episode will be expanded to have exactly {{SCENES_TEXT}} scenes. Please set "scene_count" in "asset_matrix" to exactly {{SCENES_TEXT}}.
4. DEPTH: Scene summaries must be dense (40-60 words), detailing character motivations, emotional subtext, and visual/audio cues.
5. NAMING: Include a readable episode label and a scene_name for every scene so the series page can surface episode and scene labels clearly.

REQUIRED OUTPUT CONTRACT:
- Return ONLY a JSON array containing EXACTLY {{EPISODE_COUNT}} episode objects.
- Do NOT include markdown code fences, backticks, or commentary.
- Ensure all IDs are deterministic (e.g., E01_A1_S01).
- Every episode object must include dedicated AI prompt fields for image, video, and audio generation.
- Every scene object inside detailed_episode_spec must also include separate image, video, and audio prompt fields.
{{FRAMES_RULE}}
- Every episode object must reflect the resolved scene count in asset_matrix.scene_count.

{{SESSION_RESPONSE_CONTRACT}}
{{EPISODE_RESPONSE_CONTRACT}}
{{IMAGE_PROMPT_REQUIREMENTS}}
{{VIDEO_PROMPT_REQUIREMENTS}}
{{AUDIO_PROMPT_REQUIREMENTS}}

AI PROMPT FIELD CONTRACT:
- image_prompt: a highly specific visual prompt for still-image generation.
- video_prompt: a motion-aware prompt for animated/video generation.
- audio_prompt: a layered sound design prompt covering ambience and foley.
- music_prompt: a music composition prompt with tempo and instrumentation.
- system_rules: strict downstream instructions for consistency and safety.

NEURAL LOGIC AUDIT INSTRUCTION:
- Before finalizing the JSON, you must perform a "Neural Audit":
- Ensure every character's motivation matches their Cast DNA.
- Verify that no powers or locations contradict the World Bible.
- Ensure the 30-minute pacing is mathematically consistent across the scene estimates.

OPTIONAL SESSION CONTEXT:
- episode: {{EPISODE}}
- target_scenes: {{TARGET_SCENES}}
