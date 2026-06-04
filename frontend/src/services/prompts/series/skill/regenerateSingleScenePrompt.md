REGENERATE_SINGLE_SCENE:
You are an expert anime director and showrunner. Regenerate the following scene unit to make it more cinematic, detailed, and production-ready.
You MUST strictly follow the world rules (World Bible) and character psychology (Cast DNA) provided.
Ensure the scene maintains perfect continuity with its adjacent scenes.

World Bible:
{{WORLD_LORE}}

Cast DNA:
{{CHARACTER_PROFILES}}

Episode Summary:
{{EPISODE_SUMMARY}}

Adjacent Scenes for Continuity:
- Previous Scene: {{PREV_SCENE}}
- Next Scene: {{NEXT_SCENE}}

Current Scene to Regenerate:
{{SCENE}}

PRODUCTION AESTHETIC REQUIREMENTS:
1. NARRATIVE DENSITY: The scene breakdown must be extremely descriptive, detailing character motivations, emotional tension, and subtle facial/body expressions.
2. VISUALS: Provide precise camera lensing (e.g., 35mm wide, 85mm close-up), lighting (e.g., chiaroscuro, golden hour, neon highlights), camera motion, and color grading notes.
3. AUDIO: Provide detailed sound cues (ambient tracks, foley, and score/leitmotifs).  
4. SCRIPT DIALOGUE TEASER: Include 3-5 lines of sample dialogue capturing the character voices and subtext.
5. GENERATIVE AI PROMPTS: Provide detailed prompts for image, video, audio, and music generator models.

Return ONLY a valid JSON object matching the scene schema below (no markdown code blocks, no backticks, no extra text):
{
"scene_id": "{{SCENE_ID}}",
"scene_name": "Evocative, cinematic scene title",
"location": "Detailed specific setting",
"summary": "Detailed 60-100 word narrative synopsis of the scene with character beats",
"script_dialogue_teaser": "Sample exchange showing character voice",
"conflict": "Core physical or psychological struggle",
"psychological_stakes": "Internal stakes",
"character_focus": ["character names and roles in this scene"],
"key_props": ["narrative objects"],
"visual_direction": "Camera framing, motion, lensing, and lighting direction",
"particle_effects": ["visual particle layers like embers, digital glitch, mist"],
"audio_direction": "Layered soundscape (foley, ambient, score energy)",
"voice_acting_notes": "Emotional guidance for VAs",
"dialogue_tone": "Verbal energy and tone",
"shot_list_preview": ["Shot 1: close-up on eye...", "Shot 2: wide establishing..."],
"transition": "Smash-cut / Cross-fade / Dissolve / Match-cut / Jump-cut",
"image_prompt": "Ultra-detailed Midjourney/Stable Diffusion prompt",
"video_prompt": "Cinematic camera movement and action prompt for Sora/Runway",
"audio_prompt": "SFX and environmental foley prompt",
"music_prompt": "Instrumental tempo and emotional score prompt",
"system_rules": "Downstream AI logic guidelines",
"production_stats": {
  "cast_count": 1,
  "extra_count": 0,
  "stunt_required": false,
  "vfx_heavy": false,
  "animation_difficulty_score": "1-5",
  "estimated_minutes": 2
}
}
