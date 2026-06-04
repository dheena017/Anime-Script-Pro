EXPAND_EPISODE_DETAIL:
Produce a JSON object named "detailed_episode_spec" for the following episode summary.
You MUST base all generated scenes EXCLUSIVELY and EXHAUSTIVELY on the narrative, setting, plot points, emotional arc, and characters detailed in the provided Episode Summary below. Every scene must be a direct, high-fidelity dramatization of a specific segment of this exact episode's story. Do not invent generic, placeholder, or unrelated scenes.
Return only the JSON object for "detailed_episode_spec" (no markdown, no commentary).

Episode Summary:
{{EPISODE_SUMMARY}}

PRODUCTION REQUIREMENTS:
1. PACE: Target a high-fidelity 30-minute episode duration with complex narrative layering.
2. STRUCTURE: Provide "cold_open" (2-4 cinematic sentences) and 3 "acts".
3. DENSITY: The episode MUST contain EXACTLY {{NUM_SCENES}} scenes in total. 
 You must distribute them EXACTLY as follows:
 - Act 1: Exactly {{ACT1_SCENES}} scenes.
 - Act 2: Exactly {{ACT2_SCENES}} scenes.
 - Act 3: Exactly {{ACT3_SCENES}} scenes.
 Total must perfectly equal {{NUM_SCENES}}. Do not deviate.
4. SCENE SCHEMA:
 - scene_id: E{{EP_ID}}_A[ACT]_S[SCENE]
 - scene_name: A short cinematic title for the scene.
 - location: Specific setting with architectural and atmospheric notes.
 - summary: 60-100 word hyper-detailed narrative breakdown with specific dialogue beats and subtext.
 - script_dialogue_teaser: A sample exchange of 3-5 dialogue lines showing character voice.
 - conflict: The core physical and psychological struggle.
 - psychological_stakes: What the characters lose or gain internally in this scene.
 - character_focus: [Detailed list of character roles and motivations for this scene]
 - key_props: [Objects with specific visual or narrative significance]
 - visual_direction: Camera movement, lighting style, lensing (e.g. 35mm, 85mm), and color grading notes.
 - particle_effects: [E.g. floating dust, embers, heavy rain, digital glitches]
 - audio_direction: Layered soundscape (foley, ambient, music leitmotifs).
 - voice_acting_notes: Precise emotional, rhythmic, and tonal guidance for VAs.
 - dialogue_tone: The specific social dynamic and verbal energy of the scene.
 - shot_list_preview: [5-7 specific cinematic shots with framing and focus notes]
 - transition: Smash-cut / Cross-fade / Dissolve / Match-cut / Jump-cut
 - image_prompt: Ultra-specific, model-ready scene-level image prompt (Provide highly descriptive prompts to feed directly into downstream generative AI models)
 - video_prompt: Scene-level motion prompt for camera move and action timing.
 - audio_prompt: Scene-level foley and environmental soundscape prompt.
 - music_prompt: Scene-level underscore, BPM, and instrumentation prompt.
 - system_rules: Scene-level consistency instructions.
 - production_stats: { cast_count, extra_count, stunt_required, vfx_heavy, animation_difficulty_score: "1-5", estimated_minutes: 2-4 }

5. NARRATIVE LOGIC & CONTINUITY: 
 - Scenes MUST NOT BE RANDOM. Each scene MUST logically cause or lead into the next scene.
 - The overall progression of scenes MUST perfectly match the provided Episode Summary.
 - Act 1 must Setup the conflict, Act 2 must Escalate it, Act 3 must Resolve or Cliffhanger it.
 - Character actions MUST be strictly based on their Cast DNA and relationships. Do not invent out-of-character behavior.
 - Location jumps must make spatial and temporal sense.

6. METADATA: Provide ultra-detailed continuity_dependencies, foreshadowing (long-term payoffs), payoffs (from previous beats), thumbnail_prompts, and video_prompts.

7. NEURAL LOGIC AUDIT:
- Verify that every scene advances the plot OR the character arc.
- Ensure no dialogue contradicts the Cast DNA's primary motivation.
- Confirm atmospheric notes match the World Bible's tone.
