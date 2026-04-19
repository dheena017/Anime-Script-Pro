-- Database Schema for Anime-Script-Pro
-- Enhanced version for "God Mode" Autonomous Production

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(100)
);

-- 3. Production Templates Table
CREATE TABLE IF NOT EXISTS production_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    label VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    prompt_template TEXT,
    vibe VARCHAR(100),
    complexity VARCHAR(50), -- 'Standard', 'Advanced', 'Professional', 'Expert'
    thumbnail_url TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Projects (Workspaces) Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    template_id UUID REFERENCES production_templates(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) DEFAULT 'Anime', -- 'Anime', 'Manhwa', 'Comic'
    description TEXT,
    initial_prompt TEXT,
    vibe VARCHAR(100),
    complexity VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'archived', 'trash'
    production_status VARCHAR(50) DEFAULT 'ideation', -- 'ideation', 'world_building', 'casting', 'scripting', 'storyboarding', 'rendering', 'completed'
    visibility VARCHAR(20) DEFAULT 'private', -- 'private', 'public', 'unlisted'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Project Tags (Many-to-Many)
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS project_tags (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

-- 6. World Lore Table
CREATE TABLE IF NOT EXISTS world_lore (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
    world_name VARCHAR(255),
    concept TEXT,
    geography TEXT,
    societal_structure TEXT,
    power_systems TEXT,
    political_conflict TEXT,
    lore_history TEXT,
    markdown_content TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Characters Table
CREATE TABLE IF NOT EXISTS characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100), -- 'Protagonist', 'Antagonist', 'Side Character'
    appearance TEXT,
    personality TEXT,
    backstory TEXT,
    abilities TEXT,
    image_url TEXT,
    voice_preset_id VARCHAR(100), -- For future TTS integration
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Character Relationships
CREATE TABLE IF NOT EXISTS character_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_a_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    character_b_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    relationship_type VARCHAR(100), -- 'Rival', 'Ally', 'Mentor', 'Family', etc.
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Episodes Table
CREATE TABLE IF NOT EXISTS episodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    episode_number INT NOT NULL,
    title VARCHAR(255),
    hook TEXT,
    summary TEXT,
    production_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, episode_number)
);

-- 10. Narrative Beats Table
CREATE TABLE IF NOT EXISTS narrative_beats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
    order_index INT NOT NULL,
    beat_type VARCHAR(100), -- 'Hook', 'Inciting Incident', 'Pinch Point', 'Climax', etc.
    content TEXT NOT NULL,
    emotional_intensity INT DEFAULT 5, -- 1-10 scale
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Scripts Table
CREATE TABLE IF NOT EXISTS scripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content_json JSONB, -- Array of scene objects
    full_text TEXT,
    version INT DEFAULT 1,
    is_final BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Scenes Table (Granular breakdown of Scripts)
CREATE TABLE IF NOT EXISTS scenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    script_id UUID REFERENCES scripts(id) ON DELETE CASCADE,
    scene_number INT NOT NULL,
    location TEXT,
    time_of_day VARCHAR(50),
    setting_description TEXT,
    action_notes TEXT,
    dialogue JSONB, -- Structured dialogue lines
    camera_direction TEXT,
    sound_cues TEXT,
    bgm_track TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Assets Table (Master Asset Tracker)
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    scene_id UUID REFERENCES scenes(id) ON DELETE SET NULL,
    asset_type VARCHAR(50), -- 'Image', 'Audio', 'Video', 'Model'
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    metadata JSONB, -- Resolution, Duration, Size, etc.
    provider VARCHAR(100), -- 'Gemini', 'Stable Diffusion', 'Midjourney', 'ElevenLabs'
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. SEO & Social Metadata
CREATE TABLE IF NOT EXISTS seo_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
    title_tag VARCHAR(255),
    meta_description TEXT,
    keywords TEXT[],
    og_title VARCHAR(255),
    og_description TEXT,
    og_image_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Generation History & Triple-Check Failover Log
CREATE TABLE IF NOT EXISTS generation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    module VARCHAR(100), 
    status VARCHAR(50), -- 'Success', 'Rate_Limited', 'Failed', 'Failover_Applied'
    model_primary VARCHAR(100),
    model_used VARCHAR(100),
    user_prompt TEXT,
    system_instruction TEXT,
    ai_response TEXT,
    latency_ms INT,
    token_usage INT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Comments and Feedback (Community)
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    rating INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_category_id ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_characters_project_id ON characters(project_id);
CREATE INDEX IF NOT EXISTS idx_episodes_project_id ON episodes(project_id);
CREATE INDEX IF NOT EXISTS idx_beats_episode_id ON narrative_beats(episode_id);
CREATE INDEX IF NOT EXISTS idx_scripts_episode_id ON scripts(episode_id);
CREATE INDEX IF NOT EXISTS idx_scenes_script_id ON scenes(script_id);
CREATE INDEX IF NOT EXISTS idx_assets_project_id ON assets(project_id);
CREATE INDEX IF NOT EXISTS idx_assets_scene_id ON assets(scene_id);
CREATE INDEX IF NOT EXISTS idx_logs_project_id ON generation_logs(project_id);
