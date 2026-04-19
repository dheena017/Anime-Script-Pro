import { Sword, Globe, Zap, Ghost, Brain, Flame, Heart, Trophy, Search, Hash } from 'lucide-react';

export const CATEGORIES = ['All', 'Action', 'Psychological', 'Isekai', 'Sci-Fi', 'Horror', 'Slice of Life', 'Mystery', 'Sports', 'Magical', 'Gourmet', 'Dark Fantasy', 'Music', 'Adventure'];

export const QUICK_TEMPLATES = [
  { 
    id: 'shonen', 
    category: 'Action',
    label: 'Shonen Battle', 
    icon: Sword, 
    thumbnail: '/shonen_battle_thumbnail_1776537245370.png',
    prompt: 'A high-stakes tournament where fighters use elemental powers to determine the next emperor.',
    color: 'text-orange-500',
    border: 'border-orange-500/50',
    bg: 'bg-orange-500/10',
    shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.2)]',
    description: 'High energy, intense pacing, and tournament arcs.',
    elements: ['Tournament Arcs', 'Power Systems', 'Rivalries'],
    vibe: 'Explosive & Hype',
    stats: { deployed: '12.4k', success: '98%', complexity: 'Advanced' }
  },
  { 
    id: 'isekai', 
    category: 'Isekai',
    label: 'Dark Isekai', 
    icon: Globe, 
    thumbnail: '/dark_isekai_thumbnail_1776537262155.png',
    prompt: 'A programmer is reborn in a cruel fantasy world as a minor villain destined to be defeated.',
    color: 'text-purple-500',
    border: 'border-purple-500/50',
    bg: 'bg-purple-500/10',
    shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    description: 'Reincarnation with a dark and gritty twist.',
    elements: ['Moral Ambiguity', 'Complex Systems', 'Survival'],
    vibe: 'Grim & Intelligent',
    stats: { deployed: '8.1k', success: '94%', complexity: 'Professional' }
  },
  { 
    id: 'cyberpunk', 
    category: 'Sci-Fi',
    label: 'Cyberpunk', 
    icon: Zap, 
    thumbnail: '/cyberpunk_thumbnail_1776537282821.png',
    prompt: 'A street racer in a neon-lit megacity uncovering a corporate conspiracy involving digital souls.',
    color: 'text-cyan-500',
    border: 'border-cyan-500/50',
    bg: 'bg-cyan-500/10',
    shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    description: 'Dystopian futures, neon lights, and hackers.',
    elements: ['Neon Aesthetics', 'High Tech Low Life', 'Bio-Augments'],
    vibe: 'Neon & Chaotic',
    stats: { deployed: '15.2k', success: '99%', complexity: 'Expert' }
  },
  { 
    id: 'slice', 
    category: 'Horror',
    label: 'Supernatural School', 
    icon: Ghost, 
    thumbnail: '/supernatural_school_thumbnail_1776537301525.png',
    prompt: 'A group of high school students starting an occult research club in a genuinely haunted school.',
    color: 'text-emerald-500',
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-500/10',
    shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    description: 'Supernatural events mingling with daily life.',
    elements: ['Mystery', 'High School Life', 'Urban Legends'],
    vibe: 'Creepy & Nostalgic',
    stats: { deployed: '5.7k', success: '92%', complexity: 'Standard' }
  },
  { 
    id: 'psych', 
    category: 'Psychological',
    label: 'Dream Detective', 
    icon: Brain, 
    thumbnail: '/dream_detective_thumbnail_1776537317644.png',
    prompt: 'A detective who can enter the dreams of suspects to find the truth behind a series of impossible crimes.',
    color: 'text-blue-500',
    border: 'border-blue-500/50',
    bg: 'bg-blue-500/10',
    shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    description: 'Mind-bending mysteries and psychological thrills.',
    elements: ['Mental Landscapes', 'Surrealism', 'Crime Solving'],
    vibe: 'Abstract & Tense',
    stats: { deployed: '9.3k', success: '95%', complexity: 'Professional' }
  },
  { 
    id: 'mecha', 
    category: 'Sci-Fi',
    label: 'Mecha Rebellion', 
    icon: Flame, 
    thumbnail: '/mecha_rebellion_thumbnail_1776537334398.png',
    prompt: 'A disgraced pilot is forced to pilot an experimental, unstable mech to protect the last human colony.',
    color: 'text-red-500',
    border: 'border-red-500/50',
    bg: 'bg-red-500/10',
    shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    description: 'Giant robots and interstellar warfare.',
    elements: ['Mechanical Detail', 'War Drama', 'Zero-G Combat'],
    vibe: 'Heavy & Epic',
    stats: { deployed: '11.8k', success: '97%', complexity: 'Advanced' }
  },
  { 
    id: 'magical', 
    category: 'Magical',
    label: 'Magical Girl Spark', 
    icon: Heart, 
    thumbnail: '/magical_girl_thumbnail_1776537629295.png',
    prompt: 'A clumsy middle schooler discovers she is the guardian of a celestial seal and must fight cosmic shadows.',
    color: 'text-fuchsia-500',
    border: 'border-fuchsia-500/50',
    bg: 'bg-fuchsia-500/10',
    shadow: 'shadow-[0_0_15px_rgba(217,70,239,0.2)]',
    description: 'Metamorphosis, friendship, and sparkling combat.',
    elements: ['Transformation', 'Cuteness & Power', 'Teamwork'],
    vibe: 'Glittery & Hopeful',
    stats: { deployed: '4.2k', success: '91%', complexity: 'Standard' }
  },
  { 
    id: 'sports', 
    category: 'Sports',
    label: 'Volleyball Fever', 
    icon: Trophy, 
    thumbnail: '/sports_anime_thumbnail_1776537646600.png',
    prompt: 'An underdog volleyball team with zero tall players attempts to win the national championship through speed.',
    color: 'text-yellow-500',
    border: 'border-yellow-500/50',
    bg: 'bg-yellow-500/10',
    shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.2)]',
    description: 'High stakes, team spirit, and adrenaline.',
    elements: ['Training Arcs', 'Rivalries', 'Tactical Plays'],
    vibe: 'High Energy & Inspiring',
    stats: { deployed: '6.9k', success: '96%', complexity: 'Standard' }
  },
  { 
    id: 'mystery', 
    category: 'Mystery',
    label: 'Detective Noir', 
    icon: Search, 
    thumbnail: '/detective_noir_thumbnail_1776537665824.png',
    prompt: 'A cynical private investigator in a rain-soaked city investigating a crime committed by a ghost.',
    color: 'text-zinc-400',
    border: 'border-zinc-500/50',
    bg: 'bg-zinc-500/10',
    shadow: 'shadow-[0_0_15px_rgba(113,113,122,0.2)]',
    description: 'Gritty, hardboiled detective work with a twist.',
    elements: ['Rainy Aesthetics', 'Cynical Mono', 'Clues & Deductions'],
    vibe: 'Melancholic & Sharp',
    stats: { deployed: '3.5k', success: '89%', complexity: 'Professional' }
  },
  { 
    id: 'survival', 
    category: 'Action',
    label: 'Deadly Game', 
    icon: Hash, 
    thumbnail: '/survival_game_thumbnail_1776537679688.png',
    prompt: '100 strangers are trapped in a skyscraper where they must play childhood games for their lives.',
    color: 'text-rose-600',
    border: 'border-rose-600/50',
    bg: 'bg-rose-600/10',
    shadow: 'shadow-[0_0_15px_rgba(225,29,72,0.2)]',
    description: 'Tension, betrayal, and high-stakes games.',
    elements: ['Elimination', 'Social Commentary', 'Psych Games'],
    vibe: 'Tense & Brutal',
    stats: { deployed: '7.4k', success: '93%', complexity: 'Professional' }
  },
  { 
    id: 'gourmet', 
    category: 'Gourmet',
    label: 'Gourmet Battle', 
    icon: Flame, 
    thumbnail: '/gourmet_battle_thumbnail_1776569538655.png',
    prompt: 'A street food vendor with legendary knife skills travels the world to defeat the 7 Culinary Sins.',
    color: 'text-orange-400',
    border: 'border-orange-400/50',
    bg: 'bg-orange-400/10',
    shadow: 'shadow-[0_0_15px_rgba(251,146,60,0.2)]',
    description: 'High-stakes cooking, vibrant flavor visuals.',
    elements: ['Kitchen Choreography', 'Flavor Metaphors', 'Creative Stakes'],
    vibe: 'Vibrant & Intense',
    stats: { deployed: '2.1k', success: '88%', complexity: 'Standard' }
  },
  { 
    id: 'gothic', 
    category: 'Dark Fantasy',
    label: 'Vampire Gothic', 
    icon: Ghost, 
    thumbnail: '/vampire_gothic_thumbnail_1776569560217.png',
    prompt: 'A vampire hunter who is slowly turning into a monster must track down the lord of the blood moon.',
    color: 'text-red-700',
    border: 'border-red-700/50',
    bg: 'bg-red-700/10',
    shadow: 'shadow-[0_0_15px_rgba(185,28,28,0.2)]',
    description: 'Elegance, blood, and tragic heroism.',
    elements: ['Gothic Horror', 'Tragic Heroes', 'Dark Magic'],
    vibe: 'Elegant & Morbid',
    stats: { deployed: '3.8k', success: '92%', complexity: 'Professional' }
  },
  { 
    id: 'racing', 
    category: 'Sports',
    label: 'Racing Horizon', 
    icon: Zap, 
    thumbnail: '/racing_horizon_thumbnail_1776569584234.png',
    prompt: 'An illegal street racer in Neo-Tokio uses a prototype engine to outrun a corrupt police force.',
    color: 'text-lime-500',
    border: 'border-lime-500/50',
    bg: 'bg-lime-500/10',
    shadow: 'shadow-[0_0_15px_rgba(132,204,22,0.2)]',
    description: 'High-speed chases, drift mechanics, and adrenaline.',
    elements: ['Vehicle Customization', 'Night Cityscapes', 'Drafting'],
    vibe: 'Fast & Electric',
    stats: { deployed: '5.2k', success: '95%', complexity: 'Advanced' }
  },
  { 
    id: 'idol', 
    category: 'Music',
    label: 'Idol Stardom', 
    icon: Heart, 
    thumbnail: '/idol_stardom_thumbnail_1776569606577.png',
    prompt: 'A virtual idol who gains a physical body must navigate the cutthroat industry of underground galactic music.',
    color: 'text-pink-400',
    border: 'border-pink-400/50',
    bg: 'bg-pink-400/10',
    shadow: 'shadow-[0_0_15px_rgba(244,114,182,0.2)]',
    description: 'Glitter, drama, and cosmic performances.',
    elements: ['Performance VFX', 'Industry Intrigue', 'Fan Culture'],
    vibe: 'Dreamy & Energetic',
    stats: { deployed: '2.8k', success: '90%', complexity: 'Standard' }
  },
  { 
    id: 'post-apoc', 
    category: 'Adventure',
    label: 'Rust Scavenger', 
    icon: Globe, 
    thumbnail: '/cyberpunk_thumbnail_1776537282821.png',
    prompt: 'A scavenger finds a working pre-war android in a wasteland and embarks on a journey to find the ancient sea.',
    color: 'text-amber-700',
    border: 'border-amber-700/50',
    bg: 'bg-amber-700/10',
    shadow: 'shadow-[0_0_15px_rgba(180,83,9,0.2)]',
    description: 'Desolation, hope, and ancient machines.',
    elements: ['Wasteland Survival', 'Lost Tech', 'Loneliness'],
    vibe: 'Dusty & Contemplative',
    stats: { deployed: '4.6k', success: '94%', complexity: 'Professional' }
  },
];

export const templateMarkdown = `
# Professional Anime Recap Template

Use this structure to ensure high retention and engagement on YouTube.

## 1. The Hook (0:00 - 0:15)
- **Goal:** Stop the scroll.
- **Visual:** Most intense action or biggest mystery.
- **Audio:** High-impact SFX, immediate BGM start.

## 2. The Setup (0:15 - 1:00)
- **Goal:** Establish context and stakes.
- **Visual:** Character introductions, world-building shots.
- **Audio:** Narrative-driven BGM, clear voiceover.

## 3. The Conflict (1:00 - 3:30)
- **Goal:** Build tension and momentum.
- **Visual:** Choreographed action, emotional micro-expressions.
- **Audio:** Layered SFX (clashes, magic, environment).

## 4. The Climax (3:30 - 4:30)
- **Goal:** Deliver the payoff.
- **Visual:** Dynamic camera angles (Dutch tilts, tracking shots).
- **Audio:** Peak BGM intensity, resonant SFX.

## 5. The Outro (4:30 - 5:00)
- **Goal:** Drive action (Subscribe/Next Video).
- **Visual:** Cliffhanger shot, end cards.
- **Audio:** Fade out BGM, final impactful SFX.

---

### Standard Script Table Format
| Section | Voiceover Narration | Visual/Scene Description | Sound Effect/BGM Cues |
| :--- | :--- | :--- | :--- |
| [Name] | [Spoken Lines] | [Camera + Lighting + Action] | [BGM + SFX Layers] |
`;
