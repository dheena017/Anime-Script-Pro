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
        },
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
    const header = "| Scene # | Section | Soul Focus | Narration | Visual Direction | VFX Compounds | Audio Forge | Emotional Key | Subtext | Active Asset List | Time |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |";
    const rows = script.map(beat => `| ${beat.scene} | ${beat.section} | ${beat.soulFocus} | ${beat.narration} | ${beat.visualDirection} | ${beat.vfxCompounds} | ${beat.audioForge} | ${beat.emotionalKey} | ${beat.subtext} | ${beat.activeAssetList} | ${beat.time} |`);
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
        visualPrompt: `Anime character design, ${c.name}, ${c.visuals}, high detail, professional concept art.`,
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
    lore: `## The Era of Genesis\nIn the beginning, the Aether flowed freely...`,
    powers: `## Aether-Bending\nA mechanical and spiritual hybrid power system...`,
    factions: `## The Cloud Council\nA technocratic oligarchy ruling the upper mantles...`,
    architecture: `## Neon-Steampunk\nBrass foundations with glowing fiber-optic highlights...`,
    atlas: `## The Floating Isles\nTwelve major archipelagos suspended by Flux-Cores...`,
    culture: `## The Sinking Ethos\nA society obsessed with altitude and resource hoarding...`,
    systems: `## Flux-Economics\nCurrency based on mana-density and refined aether-shards...`
};

export const MOCK_SERIES_PLAN = MOCK_STORY_BIBLE.seriesPlan.map((beat) => ({
    episode: beat.episode,
    title: beat.title,
    hook: beat.hook,
    summary: beat.summary,
    emotional_arc: beat.emotionalArc,
    setting: beat.setting,
    runtime: beat.runtime,
    focus_characters: beat.focusCharacters,
}));

export const MOCK_SERIES_ARCHIVE = formatSeriesPlan(MOCK_STORY_BIBLE.seriesPlan);

export const MOCK_SCRIPT = formatScript(MOCK_STORY_BIBLE.script);



