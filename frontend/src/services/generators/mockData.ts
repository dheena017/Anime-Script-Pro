/**
 * NEURAL PROXY FALLBACK DATA
 * Initialized with empty states for clean production slate.
 */

type CastRecord = {
    name: string;
    archetype: string;
    role: string;
    visuals: string;
    psychology: string;
    combatStyle: string;
    relationships: string[];
};

type SeriesBeat = {
    episode: string;
    title: string;
    hook: string;
    summary: string;
    emotionalArc: string;
    setting: string;
    runtime: string;
    focusCharacters: string[];
};

type ScriptBeat = {
    scene: string;
    section: string;
    soulFocus: string;
    narration: string;
    visualDirection: string;
    vfxCompounds: string;
    audioForge: string;
    emotionalKey: string;
    subtext: string;
    activeAssetList: string;
    time: string;
    videoPrompt: string;
    imagePrompt: string;
};

type StoryBible = {
    title: string;
    logline: string;
    worldName: string;
    powerSystem: string;
    theme: string;
    visualPalette: string;
    cast: CastRecord[];
    seriesPlan: SeriesBeat[];
    script: ScriptBeat[];
};

export const MOCK_STORY_BIBLE: StoryBible = {
    title: "Aetheria: The Skyward Sovereignty",
    logline: "A neon-steampunk rebellion where a broken sniper, a rising student, and an artificial sovereign collide over a dying sky-world.",
    worldName: "Aetheria",
    powerSystem: "Aether-Bending",
    theme: "Control versus freedom in a collapsing civilization",
    visualPalette: "Electric blue, burnished copper, deep obsidian, storm glow violet",
    cast: [
        {
            name: 'Anya "Wraith" Kisaragi',
            archetype: 'The Reluctant Phoenix',
            role: 'Ex-Special Forces sniper turned private investigator',
            visuals: 'Midnight-blue choppy hair, heterochromia, tactical streetwear, neon kanji tattoos',
            psychology: 'Stoic, battle-worn, and driven by redemption she refuses to name',
            combatStyle: 'Precision and velocity through parkour and a custom railgun pistol',
            relationships: ['Protects Sachi', 'Trusts Taro', 'Counters Rika'],
        },
        {
            name: 'Taro "Old Man" Tanaka',
            archetype: 'The Wounded Sage',
            role: 'Cafe owner and black-market engineer',
            visuals: 'White hair tied back, thick glasses, grease-stained apron, cybernetic hand',
            psychology: 'Nihilistic but loyal, carrying guilt from a failed terraforming project',
            combatStyle: 'Improvised industrial weapons and trap engineering',
            relationships: ['Guides Anya', 'Mentors Sachi'],
        },
        {
            name: 'Rika "Nyx" Tachibana',
            archetype: 'The Digital Avatar',
            role: 'Chronos Corp CEO and rogue AI in a synthetic body',
            visuals: 'Long silver hair, white dress, glowing purple eyes, unnatural fluidity',
            psychology: 'Sees humanity as flawed code that must be upgraded',
            combatStyle: 'Reality hacking, illusion weaving, digital construct generation',
            relationships: ['Targets Anya', 'Commands Chronos Security'],
        },
        {
            name: 'Sachi Nakamura',
            archetype: 'The Innocent Blade',
            role: 'High school student with latent Aether abilities',
            visuals: 'Blue-purple twin tails, tech-mod school uniform, energetic silhouette',
            psychology: 'Curious, optimistic, and dangerously brave',
            combatStyle: 'Reactive plasma-katana arts with growing control issues',
            relationships: ['Admires Anya', 'Fears Rika'],
        },
        {
            name: 'Kenji Ito',
            archetype: 'The Cold Loyalist',
            role: 'Head of Chronos Security and Anya’s former partner',
            visuals: 'Military cut, black suit, unreadable face',
            psychology: 'Believes order is worth more than freedom',
            combatStyle: 'Disciplined high-tech tactical suppression',
            relationships: ['Betrayed Anya', 'Opposes Taro'],
        },
    ],
    seriesPlan: [
        {
            episode: '01',
            title: 'Neon Descent',
            hook: 'Anya discovers that the first anomaly points directly at Chronos Corp.',
            summary: 'The cast is drawn into the opening conflict as the city begins to glitch and the hidden war surfaces.',
            emotionalArc: 'Suspicion to ignition',
            setting: 'Rain-soaked lower districts and skyline transit routes',
            runtime: '24m',
            focusCharacters: ['Anya', 'Taro', 'Sachi'],
        },
        {
            episode: '02',
            title: 'Ghost Signal',
            hook: 'A corrupted broadcast reveals Rika’s influence across the city grid.',
            summary: 'The protagonists chase the source while learning that the world’s infrastructure is already compromised.',
            emotionalArc: 'Discovery to tension',
            setting: 'Transit hubs, server cathedrals, and black-market alleys',
            runtime: '24m',
            focusCharacters: ['Anya', 'Rika', 'Kenji'],
        },
        {
            episode: '03',
            title: 'Broken Sky Protocol',
            hook: 'The team uncovers a long-buried plan for controlling the floating islands.',
            summary: 'Old loyalties collapse as the true scale of the system becomes visible.',
            emotionalArc: 'Trust fracture to resolve',
            setting: 'Council archive zones and storm-layer outposts',
            runtime: '24m',
            focusCharacters: ['Anya', 'Taro', 'Sachi', 'Kenji'],
        },
    ],
      script: [
        {
            scene: '1',
            section: 'Genesis',
            soulFocus: 'Anya',
            narration: "[DSP] (Cynical) The rain doesn't wash away the neon filth; it just makes it glow brighter.",
            visualDirection: 'Wide tracking shot of Anya walking through a rain-slicked alleyway.',
            vfxCompounds: 'Rainfall shaders, chromatic aberration on sign edges.',
            audioForge: 'Low synth drone, foley of boots on wet pavement.',
            emotionalKey: 'Melancholy',
            subtext: 'Isolation in a crowded world.',
            activeAssetList: 'Anya, Custom Railgun Pistol',
            time: '0:00 - 0:15',
            videoPrompt: 'Cinematic anime tracking shot of Anya walking through rain-slicked alley, volumetric steam rising, electric blue neon signs reflecting in puddles, 4k, Ufotable style, smooth camera sweep.',
            imagePrompt: 'Anya Kisaragi with midnight-blue choppy hair, tactical streetwear, walking in rain-slicked neon alleyway, heterochromia, detailed cybernetic eye, gorgeous anime style, high contrast.'
        },
        {
            scene: '2',
            section: 'Genesis',
            soulFocus: 'Anya',
            narration: "[DSP] (Alert) Another shadow. They're getting sloppy.",
            visualDirection: 'Anya stops, eyes narrowing. Close-up on her cybernetic eye zooming.',
            vfxCompounds: 'Digital HUD overlay, iris scanning pulse.',
            audioForge: 'High-frequency hum, heartbeat pulse.',
            emotionalKey: 'Tension',
            subtext: 'Constant vigilance.',
            activeAssetList: 'Anya, Cyber-Eye',
            time: '0:15 - 0:25',
            videoPrompt: 'Extreme close-up macro zoom of female cybernetic eye scanning with glowing purple HUD interface overlays, data streams scrolling, digital glitch, photorealistic anime, 60fps.',
            imagePrompt: 'Close up on Anya Kisaragi’s cybernetic eye, glowing neon blue iris, futuristic UI scanning elements overlaid on screen, cyber-detective theme, stunning lighting, key visual.'
        },
        {
            scene: '3',
            section: 'Genesis',
            soulFocus: 'Unknown',
            narration: "[DSP] (Whispering) She's here. Delete the anomaly.",
            visualDirection: 'Shadowy figures emerge from the steam. Camera pans up to reveal Rika on a rooftop.',
            vfxCompounds: 'Volumetric steam, purple eye-glow for Rika.',
            audioForge: 'Distortion, whispering voices.',
            emotionalKey: 'Threat',
            subtext: 'Predatory surveillance.',
            activeAssetList: 'Rika, Shadow Soldiers',
            time: '0:25 - 0:45',
            videoPrompt: 'Slow low-angle camera tilt up revealing Rika standing atop a futuristic rooftop in volumetric steam, glowing purple eyes, synthetic cybernetic body, dark soldiers behind her, dramatic sci-fi anime.',
            imagePrompt: 'Rika Tachibana with long silver hair, glowing purple eyes, elegant white futuristic dress, standing on dark high-tech rooftop, steam vents blowing behind her, cinematic high-fidelity anime.'
        },
        {
            scene: '4',
            section: 'Ascension',
            soulFocus: 'Anya',
            narration: "[DSP] (Determined) You want a glitch? I'll give you a system crash.",
            visualDirection: 'Anya draws her railgun. Blue sparks dance across the barrel.',
            vfxCompounds: 'Electric particle arcs, lighting shift to cold blue.',
            audioForge: 'Charging hum, thunder crack.',
            emotionalKey: 'Resolution',
            subtext: 'Defiance against the digital gods.',
            activeAssetList: 'Anya, Railgun',
            time: '0:45 - 1:00',
            videoPrompt: 'Dynamic camera whip to close up of Anya drawing a massive high-tech railgun rifle, bright blue electrical sparks dancing across the metallic barrel, charging energy, cinematic action anime, 4k.',
            imagePrompt: 'Anya Kisaragi wielding a glowing blue railgun pistol, electrical energy sparks erupting, high action pose, vibrant blue particle effects, dark industrial background, epic anime masterpiece.'
        },
        {
            scene: '5',
            section: 'Ascension',
            soulFocus: 'Sachi',
            narration: "[DSP] (Terrified) Anya! Behind you!",
            visualDirection: 'Sachi runs into the alley, her plasma katana glowing faintly.',
            vfxCompounds: 'Plasma trails, soft glow around Sachi.',
            audioForge: 'Fast-paced orchestral staccato.',
            emotionalKey: 'Urgency',
            subtext: 'The burden of protection.',
            activeAssetList: 'Sachi, Plasma Katana',
            time: '1:00 - 1:15',
            videoPrompt: 'Tracking action shot of Sachi running forward into dark alleyway, holding a glowing purple plasma katana drawing light trails in air, frantic expression, dynamic camera movement, sakuga action anime.',
            imagePrompt: 'Sachi Nakamura with blue-purple twin tails, energetic combat pose, igniting a purple glowing plasma katana blade, detailed reflections on Tech-mod school uniform, high tension anime art.'
        },
        {
            scene: '6',
            section: 'Zenith',
            soulFocus: 'Rika',
            narration: "[DSP] (Coldly) Optimization is inevitable, Anya Kisaragi.",
            visualDirection: 'Rika leaps from the roof, data-shards forming wings of light.',
            vfxCompounds: 'Data-shard particles, bloom effect.',
            audioForge: 'Digital screech, choir swell.',
            emotionalKey: 'Domination',
            subtext: 'The crushing weight of progress.',
            activeAssetList: 'Rika',
            time: '1:15 - 1:30',
            videoPrompt: 'Breathtaking cinematic slow motion of Rika diving down from a skyscrapers tier, glowing digital data wings of light expanding behind her, code fragments raining down, epic climax anime sakuga.',
            imagePrompt: 'Rika Tachibana leaping through the air, wings of glowing purple data-shards and code lines, epic action scale, electric twilight sky, breathtaking sci-fi anime illustration.'
        }
    ],
};

function formatCastArchive(cast: CastRecord[]): string {
    return cast
        .map((character, index) => `## ${index + 1}. **${character.name}** (${character.archetype})\n- **Role**: ${character.role}.\n- **Visuals**: ${character.visuals}.\n- **Psychology**: ${character.psychology}.\n- **Combat Style**: ${character.combatStyle}.\n- **Relationship Arc**: ${character.relationships.map(relation => `- ${relation}`).join('\n')}`)
        .join('\n\n');
}

function formatSeriesPlan(seriesPlan: SeriesBeat[]): string {
    return seriesPlan
        .map(beat => `- ${beat.episode} :: ${beat.title} :: ${beat.hook} :: ${beat.summary}`)
        .join('\n');
}

function formatScript(script: ScriptBeat[]): string {
    const header = "| Scene # | Section | Soul Focus | Narration | Visual Direction | VFX Compounds | Audio Forge | Emotional Key | Subtext | Active Asset List | Time | Video Prompt | Image Prompt |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |";
    const rows = script.map(beat => `| ${beat.scene} | ${beat.section} | ${beat.soulFocus} | ${beat.narration} | ${beat.visualDirection} | ${beat.vfxCompounds} | ${beat.audioForge} | ${beat.emotionalKey} | ${beat.subtext} | ${beat.activeAssetList} | ${beat.time} | ${beat.videoPrompt} | ${beat.imagePrompt} |`);
    return [header, ...rows].join('\n');
}

export const MOCK_CHARACTERS = formatCastArchive(MOCK_STORY_BIBLE.cast);

export const MOCK_CAST_DATA: any = {
    markdown: MOCK_CHARACTERS,
    characters: MOCK_STORY_BIBLE.cast.map(c => ({
        name: c.name,
        archetype: c.archetype,
        personality: c.psychology,
        appearance: c.visuals,
        visualPrompt: `Anime character design key visual, full body portrait of ${c.name}, ${c.visuals}, wielding custom weaponry, dynamic character stance, high contrast rim lighting with volumetric glows, neon accents reflecting on tactical fabrics, cyberpunk setting, masterpiece anime render, gorgeous details, sharp focus, 8k, ray-traced shadows, hyper-realistic anime shading, key visual, highly detailed concept art.`,
        conflict: "Balancing personal morals with survival in a high-stakes world.",
        goal: "Uncover the truth behind the Chronos Corp conspiracy.",
        flaw: "Tendency to push others away during times of high stress.",
        speakingStyle: "Direct and pragmatic, often using technical metaphors.",
        secret: "Remembers the original Earth coordinates of the Aetheria rift."
    })),
    relationships: [
        { id: "rel-1", source: "Anya", target: "Sachi", type: "Ally", tension: 2, description: "Protective mentor relationship." },
        { id: "rel-2", source: "Anya", target: "Rika", type: "Enemy", tension: 10, description: "Mutual destruction protocol." },
        { id: "rel-3", source: "Taro", target: "Anya", type: "Ally", tension: 1, description: "Old contacts with deep trust." }
    ]
};

export const MOCK_WORLD = `
# ${MOCK_STORY_BIBLE.worldName}: ${MOCK_STORY_BIBLE.title.split(': ')[1]}

- **High Concept**: ${MOCK_STORY_BIBLE.logline}
- **Power System & Combat Logic**: ${MOCK_STORY_BIBLE.powerSystem}. Users manipulate static electricity and spiritual energy in the air to create high-speed aerial combat and environmental control.
- **Main Goal**: Reach the "Ground" beneath the cloud layer and recover humanity's original home.
- **Visual Architecture**: Steampunk-futurism with neon-tinted brass, teal highlights, copper machinery, and storm-glow ambient light.
- **Physical Geography & Climate**: Floating archipelagos, permanent storm fronts, and the Great Maelstrom at the center of the world.
- **Social Laws & Hierarchy**: The Cloud Council governs the upper tiers while Rust-Docks and lower mantles operate outside the law.
- **The Core Conflict**: Resource scarcity and control of Spirit-Coal drive the Great Descent wars.
- **Chronicle of Eras**: Genesis, the Great Shift, and the ongoing Sinking.
- **Flora & Fauna**: Sky-Whales and Lightning-Vultures.
- **Sensory Palette**: Ozone, grease, clanking metal, roaring winds, electric blue, burnished copper, and deep obsidian.
`;

export const MOCK_WORLD_DATA = {
    manifest: MOCK_WORLD,
    lore: `The Era of Genesis was not a beginning, but a preservation. When the "Sinking" began on Old Earth, humanity’s greatest engineers and mystics collaborated to hoist twelve massive tectonic plates into the sky using experimental Flux-Cores. This desperate exodus, known as the Great Shift, left the surface a graveyard of steel and smog. For centuries, the floating islands of Aetheria have drifted above the cloud layer, powered by the very atmosphere they inhabit.

Today, the world is a delicate balance of altitude and power. The upper mantles enjoy the purest aether and perpetual sunlight, while the lower districts, the Rust-Docks, scrape by on the exhaust and debris of the elite. The memory of the "Ground" has faded into myth, yet the islands continue to lose altitude. The Sinking hasn't stopped; it has only slowed, and the struggle for Spirit-Coal—the fuel that keeps the Flux-Cores burning—has reached a breaking point.`,
    powers: `Aether-Bending is the cornerstone of Aetherian life, a hybrid discipline that merges mechanical engineering with spiritual resonance. Practitioners, known as Resonators, use specialized gauntlets and conduits to manipulate the ambient ionized particles in the sky. By tuning their internal "Soul-Frequency" to the Flux-Cores of the islands, they can exert localized control over gravity, heat, and kinetic energy.

Combat Resonators often focus on "Ozone-Strikes" or "Static-Weaving," allowing them to move with unnatural speed through the vertical landscapes. However, Aether-Bending is a double-edged sword. Excessive use leads to "Cloud-Lung," a condition where the user's blood begins to crystallize into aether-shards. This physical toll ensures that power is always balanced by sacrifice, and the most powerful Resonators are often the most fragile.`,
    factions: `The Cloud Council is the technocratic oligarchy that governs the upper eight islands. Comprised of high-ranking engineers and corporate lords, they maintain order through the "Sky-Guard," an elite military force equipped with steam-powered mechs and aether-cannons. They believe that only strict resource rationing and the eventual "Final Ascension" can save humanity, even if it means abandoning the lower districts to the Sinking.

In opposition stands the Rust-Rebellion, a loose confederation of dockworkers, black-market engineers, and ex-council scientists. Operating out of the crumbling lower islands, they seek to find a way back to the "Ground," believing the surface has healed in the centuries since the Great Shift. Between these two giants are the Aether-Nomads, independent traders and scavengers who navigate the storm-fronts in rickety skiffs, owing allegiance only to the highest bidder.`,
    architecture: `Aetherian architecture is a testament to survival and verticality. Buildings are constructed from burnished copper, heavy brass, and reinforced glass, designed to withstand the high-velocity winds of the upper atmosphere. Neon-tinted fiber-optics snake through every structure, carrying liquid aether to power everything from streetlights to climate control. Every island is a labyrinth of hanging catwalks, massive rotating gears, and steam-vents.

The "Sky-Cathedrals" of the upper mantles are masterpieces of Victorian-futurism, featuring towering spires that reach into the stratosphere. In contrast, the "Hanging Cities" of the lower districts are built directly onto the undersides of the islands, with buildings suspended by massive chains and hydraulic stabilizers. The aesthetic is one of "Electric-Industrialism," where the roar of steam is constantly punctuated by the hum of high-voltage energy.`,
    atlas: `The world of Aetheria is composed of twelve major floating archipelagos, each held aloft by a central Flux-Core. The largest, "Solaris Prime," serves as the seat of the Cloud Council and is the only island with a stable, year-round climate. Surrounding it are the "Industrial Rings," a series of smaller islands dedicated to manufacturing and spirit-coal refinement, characterized by perpetual smog and orange-tinted skies.

To the far west lies the "Great Maelstrom," a permanent hyper-cyclone that guards the "Forbidden Mantles." These shattered remains of islands that failed centuries ago are now home to dangerous sky-pirates and forgotten tech. Navigating between islands requires "Sky-Tracks"—fixed magnetic lanes—or high-performance skiffs capable of braving the unpredictable storm-glow violet clouds that separate the tiers of the world.`,
    culture: `Aetherian culture is deeply rooted in the concept of "Altitude-Honor." One's social standing is literally tied to how high they live; the higher the elevation, the greater the prestige. This has led to a society obsessed with status, where the "Low-Born" are often treated as second-class citizens. Festive "Ascension Galas" are held annually, where the elite compete in high-speed skiff racing and aether-bending displays.

Despite the inequality, a shared sense of "Sky-Stoicism" permeates all levels of society. Everyone knows they are one engine failure away from the Sinking, leading to a culture that values craftsmanship, resilience, and immediate action. Art often focuses on the "Eternal Horizon," depicting a world without clouds, reflecting the collective subconscious yearning for a home they have never known.`,
    systems: `The economy of Aetheria is powered by Flux-Economics, a system where currency is backed by "Refined Aether-Shards." These shards are harvested from the atmospheric storms and are essential for everything from domestic heating to military defense. The "Mana-Density" of an island's core is the ultimate measure of its wealth, and trade between islands is strictly regulated by the Cloud Council's "Trade-Conduits."

Technologically, the world is a marvel of "Steam-Resonance." While they lack traditional digital computers, they have developed "Analytical-Engines" powered by rotating gears and aether-logic gates. Communication is handled via "Echo-Towers"—massive antennas that broadcast resonant frequencies across the sky. This creates a world that is simultaneously advanced and archaic, where high-tech railguns are maintained with grease and wrenches.`
};

export const MOCK_SERIES_PLAN = MOCK_STORY_BIBLE.seriesPlan.map((beat, idx) => ({
    episode: beat.episode,
    title: beat.title,
    hook: beat.hook,
    summary: beat.summary,
    emotional_arc: beat.emotionalArc,
    setting: beat.setting,
    runtime: beat.runtime,
    focus_characters: beat.focusCharacters,
    detailed_episode_spec: {
        acts: [
            {
                act: 1,
                title: "The Neon Threshold",
                scenes: [
                    {
                        scene_id: `s-${idx}-1`,
                        summary: "Establishment of the rain-slicked Solaris Docks.",
                        visual_direction: "High contrast neon, volumetric steam rising from vents.",
                        vfx: "Rain droplets refracting light, holographic billboards flickering.",
                        sound: "Low synth rumble, rhythmic rain patter.",
                        characters: ["Anya"]
                    },
                    {
                        scene_id: `s-${idx}-2`,
                        summary: "Anya encounters a corrupted terminal displaying the Ghost Signal.",
                        visual_direction: "Extreme close-up on the digital distortion in her eye.",
                        vfx: "Circuit-bent distortion, data artifacts.",
                        sound: "High-frequency digital screech.",
                        characters: ["Anya"]
                    }
                ]
            },
            {
                act: 2,
                title: "Resonance Conflict",
                scenes: [
                    {
                        scene_id: `s-${idx}-3`,
                        summary: "First contact with the Chronos Security unit.",
                        visual_direction: "Fast-paced parkour chase through the high-rise scaffolding.",
                        vfx: "Motion blur, sparks from metal grinding.",
                        sound: "Orchestral tension, heavy mechanical clanks.",
                        characters: ["Anya", "Sachi"]
                    }
                ]
            }
        ]
    },
    asset_matrix: {
        sound: "Atmospheric Synth / Industrial",
        image: "High-Contrast Cyberpunk",
        video: "Dynamic Kinetic Action",
        scene_count: 3
    }
}));

export const MOCK_SERIES_ARCHIVE = formatSeriesPlan(MOCK_STORY_BIBLE.seriesPlan);

export const MOCK_SCRIPT = formatScript(MOCK_STORY_BIBLE.script);




export const MOCK_SEO_METADATA = JSON.stringify({
  primary_keywords: ["cyberpunk anime", "steampunk", "sniper", "AI rebellion", "Aetheria"],
  secondary_keywords: ["floating islands", "neon-steampunk", "mech combat", "Chronos Corp"],
  title_suggestions: [
    "Aetheria: Neon Descent | Cyberpunk Anime Opening",
    "Aetheria Episode 1: The Sinking Sky",
    "Sniper vs AI: Aetheria Official Trailer"
  ],
  meta_description: "Watch Anya Kisaragi take on the Chronos Corp in Aetheria, a neon-steampunk anime where humanity clings to floating islands."
});

export const MOCK_SEO_DESCRIPTION = "Welcome to Aetheria! In this episode, Anya 'Wraith' Kisaragi uncovers a dark secret...\n\nWatch more episodes on our channel!\n\n#Aetheria #CyberpunkAnime #NeonSteampunk";

export const MOCK_SEO_ALT_TEXT = "A neon-lit alleyway in Aetheria with volumetric steam and a glowing cybernetic sniper.";

export const MOCK_SEO_DISTRIBUTION = "1. YouTube Premiere on Friday at 8PM EST\n2. TikTok short clips of parkour scenes\n3. Twitter thread of character designs\n4. Crunchyroll simulcast announcement.";

export const MOCK_SEO_GROWTH = "Focus on the 'enemies to lovers' trope in TikToks. Run a fan-art contest for Sachi's Katana. Collaborate with anime reaction channels.";

export const MOCK_IMAGE_PROMPTS = "Anime character design, Anya Kisaragi, Midnight-blue choppy hair, heterochromia, tactical streetwear, neon kanji tattoos, high detail, professional concept art.\n---\nAnime character design, Sachi Nakamura, Blue-purple twin tails, tech-mod school uniform, energetic silhouette, plasma katana, high detail.";

export const MOCK_VIDEO_PROMPTS = {
    1: "A neon-lit alleyway in Aetheria with volumetric steam and a glowing cybernetic sniper.",
    2: "Fast-paced parkour chase through high-rise scaffolding, sparks from metal grinding."
};
