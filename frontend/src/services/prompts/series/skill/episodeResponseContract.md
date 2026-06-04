EPISODE SCHEMA (Your array MUST contain exactly {{EPISODE_COUNT}} episode objects. Do not return fewer or more objects.):
Each episode object must include the following top-level fields:
- episode: zero-padded episode number such as "01"
- session: session number as an integer (e.g., 1)
- title: evocative episode title
- hook: 2-3 sentence cinematic hook
- summary: 120-180 word narrative synopsis
- setting: primary location name
- runtime: always "30m"
- focus_characters: array of key characters
- session_name: short cinematic arc name
- emotional_arc: internal character shift
- arc_progression: narrative momentum object
- theme_mapping: core theme and subtext goals object
- engagement_matrix: pacing and hook object
- production_palette: color, lighting, audio, and foley object
- detailed_episode_spec: cold open, acts, scenes, and continuity structure
- asset_matrix: sound, image, video, vfx, render priority, and scene count object
- risk_matrix: continuity, production, and content risk object
- neural_audit: logic, lore, and pacing validation object

Episode hierarchy rules:
- Episode count is the only top-level series count.
- Every episode must carry the requested internal scene count through asset_matrix.scene_count.
- Every episode should behave like one self-contained production unit in the season.

Each episode object must include dedicated episode-level prompt fields:
- episode_image_prompt
- episode_video_prompt
- episode_audio_prompt
- episode_music_prompt
- episode_system_rules

Every scene inside detailed_episode_spec must include dedicated AI prompt fields unless that scene includes a "frames" array.
- If a scene does not include a "frames" array, the scene must include:
  - image_prompt
  - video_prompt
  - audio_prompt
  - music_prompt
  - system_rules
- If a scene includes a "frames" array, do not include scene-level image_prompt, video_prompt, audio_prompt, music_prompt, or system_rules.
  - Every frame object must include its own image_prompt, video_prompt, audio_prompt, music_prompt, and system_rules.

{{SCENE_RESPONSE_CONTRACT}}
