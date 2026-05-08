"""Cast Generation Prompts for all content types."""


def CORE_GENERATION_PROMPT(content_type: str = "Anime") -> str:
    """Prompt for generating core character DNA."""
    return f"""
    Role: Lead Character Designer and Production Architect for {content_type}
    Task: Create 3-5 core characters that are production-ready for this world.
    
    For EACH character, provide a HYPER-DETAILED profile:
    
    - name: Unique character name
    - role: (Tier 1: Core Protagonist | Tier 2: Core Support | Tier 3: Catalyst)
    - archetype: Specific class/archetype (The Hero, The Mentor, The Shadow, etc.)
    
    **Visual Identity:**
    - visual_dna: Technical description for visual consistency across frames
    - vfx_signature: Particle effects, glowing nodes, or energy signatures unique to this character
    - lighting_logic: How they should be lit (rim lighting, high contrast shadow, subsurface scatter)
    - camera_choreography: How the camera moves for them (fast tracking, low-angle static, circular)
    - hair_style: Hyper-detailed description (length, texture, movement, highlights)
    - eye_details: Color, shape, and emotional "catchlight" positioning
    - clothing_materials: Weathered fabric, iridescent plates, metallic accents, etc.
    - body_language: Posture, gait, and physical mannerisms
    
    **Psychology:**
    - personality: Psychological summary (4-5 core traits)
    - goal: What they crave (power, redemption, love, truth, etc.)
    - flaw: Defining limitation that creates conflict
    - core_wound: Specific trauma shaping them (not cliché)
    - moral_dilemma: The impossible choice they must make
    - secret: Hidden truth others don't know
    - speaking_style: Vocabulary, syntax, verbal tics, accent patterns
    
    **Narrative Potential:**
    - character_arc: How they transform across the story
    - growth_vector: Direction and mechanism of change
    - breaking_point: What pushes them to their limit
    - redemption_path: Path to growth/healing if applicable
    
    Return only a JSON array of character objects. No preamble.
    """


def ARCHETYPES_GENERATION_PROMPT(content_type: str = "Anime") -> str:
    """Prompt for generating character archetype templates."""
    return f"""
    Role: Character Archetype Designer for {content_type}
    Task: Generate 8-12 distinct character archetypes that fit this world.
    
    For each archetype, provide:
    
    - name: Archetype identifier (The Hero, The Shadow, The Mentor, The Trickster, etc.)
    - description: What this archetype represents and its narrative role
    - typical_traits: List of 4-6 core psychological/behavioral traits
    - story_role: How they function in narrative (protagonist, antagonist, catalyst, comic relief, etc.)
    - visual_profile: Aesthetic guidelines (clothing style, color palette, silhouette)
    - motivation_core: What drives them fundamentally (power, duty, survival, love, etc.)
    - conflict_source: What creates their internal struggle
    - archetype_examples: 2-3 specific character types that fit this archetype
    - growth_potential: How characters of this type can evolve
    - narrative_hooks: Plot devices naturally suited to this archetype
    - relationship_patterns: How they typically relate to other archetypes
    
    Return only a JSON array of archetype objects. No preamble.
    """


def RELATIONSHIPS_GENERATION_PROMPT(content_type: str = "Anime") -> str:
    """Prompt for generating character relationship networks."""
    return f"""
    Role: Relationship Architect for {content_type}
    Task: Map character relationships and social networks.
    
    For each significant relationship, provide:
    - character_1: First character name
    - character_2: Second character name
    - relationship_type: (romance, rivalry, mentorship, family, alliance, sworn enemy, etc.)
    - connection_strength: (weak, moderate, intense)
    - shared_history: How they know each other and key shared experiences
    - tension_level: Current conflict scale (0-10)
    - power_dynamics: Who holds social/emotional power
    - defining_moment: Critical event that shaped this relationship
    - potential_arc: How this relationship evolves through the story
    - conflict_points: Specific areas of disagreement
    - redemption_path: Can this relationship heal/change?
    
    Also provide top-level structures:
    - family_structures: Bloodline hierarchies and inheritance
    - social_networks: Group associations and factions
    - mentor_relationships: Learning/growth connections
    - love_triangles: Complicated romantic dynamics
    - power_coalitions: Who aligns with whom?
    
    Return JSON with keys: relationships, family_trees, social_networks, conflict_pairs, ally_groups, love_triangles.
    """


def DYNAMICS_GENERATION_PROMPT(content_type: str = "Anime") -> str:
    """Prompt for generating character interaction dynamics."""
    return f"""
    Role: Behavioral Dynamics Specialist for {content_type}
    Task: Generate character interaction patterns and behavioral dynamics.
    
    Provide:
    
    **Interaction Patterns:**
    - How each character communicates with others
    - Speech quirks and verbal tics unique to each pairing
    - Emotional temperature (warm, cold, tense, playful, antagonistic)
    - Physical interaction styles (personal space, touch, gesture)
    
    **Conflict Dynamics:**
    - How characters argue or disagree
    - Escalation triggers (what causes fights to start?)
    - De-escalation strategies (what calms them down?)
    - Unresolved tensions simmering beneath surface
    - Violence escalation patterns
    
    **Group Dynamics:**
    - How the group behaves when assembled
    - Leadership structures and hierarchy
    - Coalition formations and alliances
    - Outsider/scapegoat roles
    - Group energy shifts based on who's present
    
    **Behavioral Triggers:**
    - What makes each character angry/sad/joyful/afraid
    - Trauma responses and coping mechanisms
    - Vulnerability moments and defenses
    - Healing/redemption pathways
    - Forbidden topics/sensitive subjects
    
    **Dialogue Matrices:**
    For key character pairs:
    - comfortable_exchanges: Natural, easy dialogue patterns
    - confrontational_exchanges: Conflict dialogue - who escalates, who backs down
    - intimate_moments: Vulnerable conversation styles
    - comedic_timing: How they banter and make each other laugh
    - inside_jokes: Shared references and shorthand
    
    Return JSON with keys: interaction_patterns, conflict_dynamics, group_dynamics, behavioral_triggers, dialogue_matrices.
    """
