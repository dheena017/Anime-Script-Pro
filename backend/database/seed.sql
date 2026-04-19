-- Seed Data for Anime-Script-Pro
-- Populations categories and production templates based on UI constants.

-- 1. Seed Categories
INSERT INTO categories (name, description, icon, color) VALUES
('Action', 'High energy, intense pacing, and combat arcs.', 'Sword', 'text-orange-500'),
('Psychological', 'Mind-bending mysteries and psychological thrills.', 'Brain', 'text-blue-500'),
('Isekai', 'Reincarnation with a unique twist.', 'Globe', 'text-purple-500'),
('Sci-Fi', 'Dystopian futures, neon lights, and hackers.', 'Zap', 'text-cyan-500'),
('Horror', 'Supernatural events and urban legends.', 'Ghost', 'text-emerald-500'),
('Sports', 'High stakes, team spirit, and adrenaline.', 'Trophy', 'text-yellow-500'),
('Magical', 'Metamorphosis, friendship, and sparkling combat.', 'Heart', 'text-fuchsia-500'),
('Mystery', 'Gritty, hardboiled detective work with a twist.', 'Search', 'text-zinc-400'),
('Gourmet', 'High-stakes cooking, vibrant flavor visuals.', 'Flame', 'text-orange-400'),
('Dark Fantasy', 'Elegance, blood, and tragic heroism.', 'Ghost', 'text-red-700'),
('Music', 'Glitter, drama, and cosmic performances.', 'Heart', 'text-pink-400'),
('Adventure', 'Desolation, hope, and ancient machines.', 'Globe', 'text-amber-700')
ON CONFLICT (name) DO NOTHING;

-- 2. Seed Production Templates
-- Using subqueries to link to correctly named categories.
INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Shonen Battle', 'shonen', 'A high-stakes tournament where fighters use elemental powers to determine the next emperor.', 'Explosive & Hype', 'Advanced', '/shonen_battle_thumbnail_1776537245370.png', true FROM categories WHERE name = 'Action';

INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Dark Isekai', 'isekai', 'A programmer is reborn in a cruel fantasy world as a minor villain destined to be defeated.', 'Grim & Intelligent', 'Professional', '/dark_isekai_thumbnail_1776537262155.png', true FROM categories WHERE name = 'Isekai';

INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Cyberpunk', 'cyberpunk', 'A street racer in a neon-lit megacity uncovering a corporate conspiracy involving digital souls.', 'Neon & Chaotic', 'Expert', '/cyberpunk_thumbnail_1776537282821.png', true FROM categories WHERE name = 'Sci-Fi';

INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Supernatural School', 'supernatural-school', 'A group of high school students starting an occult research club in a genuinely haunted school.', 'Creepy & Nostalgic', 'Standard', '/supernatural_school_thumbnail_1776537301525.png', true FROM categories WHERE name = 'Horror';

INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Dream Detective', 'dream-detective', 'A detective who can enter the dreams of suspects to find the truth behind a series of impossible crimes.', 'Abstract & Tense', 'Professional', '/dream_detective_thumbnail_1776537317644.png', true FROM categories WHERE name = 'Psychological';

INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Mecha Rebellion', 'mecha', 'A disgraced pilot is forced to pilot an experimental, unstable mech to protect the last human colony.', 'Heavy & Epic', 'Advanced', '/mecha_rebellion_thumbnail_1776537334398.png', true FROM categories WHERE name = 'Sci-Fi';

INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Magical Girl Spark', 'magical-girl', 'A clumsy middle schooler discovers she is the guardian of a celestial seal and must fight cosmic shadows.', 'Glittery & Hopeful', 'Standard', '/magical_girl_thumbnail_1776537629295.png', true FROM categories WHERE name = 'Magical';

INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Volleyball Fever', 'sports-volleyball', 'An underdog volleyball team with zero tall players attempts to win the national championship through speed.', 'High Energy & Inspiring', 'Standard', '/sports_anime_thumbnail_1776537646600.png', true FROM categories WHERE name = 'Sports';

INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Detective Noir', 'mystery-noir', 'A cynical private investigator in a rain-soaked city investigating a crime committed by a ghost.', 'Melancholic & Sharp', 'Professional', '/detective_noir_thumbnail_1776537665824.png', true FROM categories WHERE name = 'Mystery';

INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Deadly Game', 'deadly-game', '100 strangers are trapped in a skyscraper where they must play childhood games for their lives.', 'Tense & Brutal', 'Professional', '/survival_game_thumbnail_1776537679688.png', true FROM categories WHERE name = 'Action';

INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Gourmet Battle', 'gourmet', 'A street food vendor with legendary knife skills travels the world to defeat the 7 Culinary Sins.', 'Vibrant & Intense', 'Standard', '/gourmet_battle_thumbnail_1776569538655.png', true FROM categories WHERE name = 'Gourmet';

INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Vampire Gothic', 'gothic', 'A vampire hunter who is slowly turning into a monster must track down the lord of the blood moon.', 'Elegant & Morbid', 'Professional', '/vampire_gothic_thumbnail_1776569560217.png', true FROM categories WHERE name = 'Dark Fantasy';

INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Racing Horizon', 'racing', 'An illegal street racer in Neo-Tokio uses a prototype engine to outrun a corrupt police force.', 'Fast & Electric', 'Advanced', '/racing_horizon_thumbnail_1776569584234.png', true FROM categories WHERE name = 'Sports';

INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Idol Stardom', 'music-idol', 'A virtual idol who gains a physical body must navigate the cutthroat industry of underground galactic music.', 'Dreamy & Energetic', 'Standard', '/idol_stardom_thumbnail_1776569606577.png', true FROM categories WHERE name = 'Music';

INSERT INTO production_templates (category_id, label, slug, prompt_template, vibe, complexity, thumbnail_url, is_system)
SELECT id, 'Rust Scavenger', 'post-apoc', 'A scavenger finds a working pre-war android in a wasteland and embarks on a journey to find the ancient sea.', 'Dusty & Contemplative', 'Professional', '/cyberpunk_thumbnail_1776537282821.png', true FROM categories WHERE name = 'Adventure';
