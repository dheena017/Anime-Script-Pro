import os

mock_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "services", "generators", "mockData.ts"))
with open(mock_file, 'r', encoding='utf-8') as f:
    content = f.read()

if 'MOCK_SEO_METADATA' not in content:
    content += """
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

export const MOCK_SEO_DESCRIPTION = "Welcome to Aetheria! In this episode, Anya 'Wraith' Kisaragi uncovers a dark secret...\\n\\nWatch more episodes on our channel!\\n\\n#Aetheria #CyberpunkAnime #NeonSteampunk";

export const MOCK_SEO_ALT_TEXT = "A neon-lit alleyway in Aetheria with volumetric steam and a glowing cybernetic sniper.";

export const MOCK_SEO_DISTRIBUTION = "1. YouTube Premiere on Friday at 8PM EST\\n2. TikTok short clips of parkour scenes\\n3. Twitter thread of character designs\\n4. Crunchyroll simulcast announcement.";

export const MOCK_SEO_GROWTH = "Focus on the 'enemies to lovers' trope in TikToks. Run a fan-art contest for Sachi's Katana. Collaborate with anime reaction channels.";

export const MOCK_IMAGE_PROMPTS = "Anime character design, Anya Kisaragi, Midnight-blue choppy hair, heterochromia, tactical streetwear, neon kanji tattoos, high detail, professional concept art.\\n---\\nAnime character design, Sachi Nakamura, Blue-purple twin tails, tech-mod school uniform, energetic silhouette, plasma katana, high detail.";

export const MOCK_VIDEO_PROMPTS = {
    1: "A neon-lit alleyway in Aetheria with volumetric steam and a glowing cybernetic sniper.",
    2: "Fast-paced parkour chase through high-rise scaffolding, sparks from metal grinding."
};
"""
    with open(mock_file, 'w', encoding='utf-8') as f:
        f.write(content)
