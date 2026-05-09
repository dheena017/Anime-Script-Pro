import os
import sys
from sqlalchemy import Session, create_engine, select, sqlalchemy
from datetime import datetime, timedelta
from loguru import logger

# Add parent directory to path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.database.models import (
    Tutorial, CommunityPost, Project, Template, 
    UserProfile, UserBalance, MediaAsset, Category,
    Series, Episode, Script, HelpCategory, FAQ, DocSection, DocArticle, Notification,
    WorldLore, CastMember, NarrativeBeat, ReusableCharacter, Scene,
    UserFavorite, UserSettings, SavedPrompt
)


# Point to the exact database file used by the backend
DATABASE_URL = "sqlite:///backend/database/anime_script_pro.db"
engine = create_engine(DATABASE_URL)

LOCAL_USER_ID = "local-dev-architect-id"

# Production Blueprint Library (Centralized Data)
PRODUCTION_TEMPLATES = [
    Template(
        name="Shonen Catalyst", category="Action", icon="Sword", vibe="Kinetic & High-Retention",
        description="High energy, intense pacing, and structural conflict loops.",
        thumbnail="/shonen_battle_thumbnail_1776537245370.png",
        prompt="Generate a high-octane Shonen battle epic. Focus on a protagonist mastering a unique elemental energy system. Incorporate high-stakes tournament arcs, deep rivalries with complex motivations, and spectacular 'Bankai-level' power reveals. Ensure the pacing is relentless with tactical combat logic and clear power scalability.",
        color="text-orange-500", border="border-orange-500/50", bg="bg-orange-500/10",
        shadow="shadow-[0_0_15px_rgba(249,115,22,0.2)]", 
        elements=["Energy Matrices", "Power Scalability", "System Rivalries"],
        stats={"deployed": "42.4k", "success": "98%", "complexity": "Advanced"}
    ),
    Template(
        name="Dimensional Revision", category="Isekai", icon="Globe", vibe="Calculated & Immersive",
        description="Dimensional shift logic with a focus on system exploitation.",
        thumbnail="/dark_isekai_thumbnail_1776537262155.png",
        prompt="Architect a sophisticated Isekai/Regression saga. A modern-day tactical specialist is transported to a low-fantasy world teetering on political collapse. Focus on 'System Exploitation'—the protagonist using Earth-based logic or hidden 'game mechanics' to outmaneuver ancient magical nobilities. Detail the world-logic variance and the steady progression from an underdog to a global power player.",
        color="text-purple-500", border="border-purple-500/50", bg="bg-purple-500/10",
        shadow="shadow-[0_0_15px_rgba(168,85,247,0.2)]", 
        elements=["World-Logic Variance", "Strategic Dominance", "Progression Loops"],
        stats={"deployed": "28.1k", "success": "94%", "complexity": "Professional"}
    ),
    Template(
        name="Neural Cityscape", category="Sci-Fi", icon="Zap", vibe="Neon & Synthetic",
        description="Dystopian high-tech systems and urban decay dynamics.",
        thumbnail="/cyberpunk_thumbnail_1776537282821.png",
        prompt="Design a visceral Cyberpunk noir set in a rain-slicked, neon-drenched megacity. Center the narrative on a high-stakes investigation into a neural-interface conspiracy that threatens human autonomy. Emphasize the friction between 'High Tech and Low Life,' megacorporate hegemony, information warfare, and the psychological toll of bionic enhancement.",
        color="text-cyan-500", border="border-cyan-500/50", bg="bg-cyan-500/10",
        shadow="shadow-[0_0_15px_rgba(6,182,212,0.2)]", 
        elements=["Bionic Interfacing", "Information Warfare", "Corporate Hegemony"],
        stats={"deployed": "35.2k", "success": "99%", "complexity": "Expert"}
    ),
    Template(
        name="Supernatural Resonance", category="Horror", icon="Ghost", vibe="Unsettling & Human",
        description="Localized supernatural friction within group environments.",
        thumbnail="/supernatural_school_thumbnail_1776537301525.png",
        prompt="Generate an unsettling supernatural school-life mystery. Focus on a group of students investigating localized urban legends that are bleeding into reality. Create a thick, eerie atmosphere where social dynamics are as dangerous as the ghosts. Balance slice-of-life interactions with recursive horror elements and deep-seated human trauma.",
        color="text-emerald-500", border="border-emerald-500/50", bg="bg-emerald-500/10",
        shadow="shadow-[0_0_15px_rgba(16,185,129,0.2)]", 
        elements=["Eerie Atmosphere", "Recursive Mystery", "Social Dynamics"],
        stats={"deployed": "15.7k", "success": "92%", "complexity": "Standard"}
    ),
    Template(
        name="Cognitive Inquiry", category="Psychological", icon="Brain", vibe="Abstract & Tense",
        description="Internalized conflict and cognitive reality shifts.",
        thumbnail="/dream_detective_thumbnail_1776537317644.png",
        prompt="Engineer a mind-bending psychological thriller. Focus on 'Dream Architects' or 'Memory Detectives' who perform forensic analysis on human subconsciousness. Incorporate reality-shifting mental geometry, perception-logic puzzles, and high heuristic stakes where dying in the dream has permanent cognitive consequences. The tone should be abstract, tense, and deeply clinical.",
        color="text-blue-500", border="border-blue-500/50", bg="bg-blue-500/10",
        shadow="shadow-[0_0_15px_rgba(59,130,246,0.2)]", 
        elements=["Mental Geometry", "Perception Logic", "Heuristic Stakes"],
        stats={"deployed": "19.3k", "success": "95%", "complexity": "Professional"}
    ),
    Template(
        name="Mechanical Epoch", category="Sci-Fi", icon="Flame", vibe="Heavy & Scale-Driven",
        description="Industrial-scale combat and tactical hardware logic.",
        thumbnail="/mecha_rebellion_thumbnail_1776537334398.png",
        prompt="Design a grand-scale Mecha war drama. Focus on the tactical reality of industrial-scale combat, orbital mechanics, and the attrition of resource warfare. Center on a pilot assigned to an experimental, high-risk mobile suit during a desperate colony defense. Emphasize the 'Real Mecha' aesthetic—heavy machinery, complex physics, and the human cost of mechanized slaughter.",
        color="text-red-500", border="border-red-500/50", bg="bg-red-500/10",
        shadow="shadow-[0_0_15px_rgba(239,68,68,0.2)]", 
        elements=["Rigid Frames", "Orbital Mechanics", "Resource Attrition"],
        stats={"deployed": "21.8k", "success": "97%", "complexity": "Advanced"}
    ),
    Template(
        name="Celestial Paradigm", category="Magical", icon="Heart", vibe="Ethereal & Vibrant",
        description="Aesthetic-driven metamorphosis and moral clarity.",
        thumbnail="/magical_girl_thumbnail_1776537629295.png",
        prompt="Construct an ethereal Magical Girl/Boy odyssey with a cosmic horror twist. Focus on aesthetic-driven transformations (Metamorphosis) and the containment of 'Cosmic Shadows' that feed on human despair. Direct the AI to emphasize visual radiance, celestial energy seals, and the burden of magical responsibility. Ensure the theme of 'Aligned Unity' triumphs over absolute darkness.",
        color="text-fuchsia-500", border="border-fuchsia-500/50", bg="bg-fuchsia-500/10",
        shadow="shadow-[0_0_15px_rgba(217,70,239,0.2)]", 
        elements=["Dynamic Flux", "Visual Radiance", "Aligned Unity"],
        stats={"deployed": "14.2k", "success": "91%", "complexity": "Standard"}
    ),
    Template(
        name="Tactical Kinetic", category="Sports", icon="Trophy", vibe="Relentless & Focused",
        description="High-pacing athletic logic and group-synergy loops.",
        thumbnail="/sports_anime_thumbnail_1776537646600.png",
        prompt="Design a relentless, high-retention Sports epic. Focus on a specific niche (e.g., street racing, high-speed volleyball, or futuristic combat sports). Emphasize 'Strategic Velocity'—where games are won through split-second technical synergy and underdog skill-tree scaling. Detail the 'Peak Flow State' and the psychological pressure of championship-level competition.",
        color="text-yellow-500", border="border-yellow-500/50", bg="bg-yellow-500/10",
        shadow="shadow-[0_0_15px_rgba(234,179,8,0.2)]", 
        elements=["Strategic Velocity", "Skill-Tree Scaling", "Peak Flow State"],
        stats={"deployed": "16.9k", "success": "96%", "complexity": "Standard"}
    ),
    Template(
        name="Hardboiled Logic", category="Mystery", icon="Search", vibe="Gritty & Precise",
        description="Analytical deductive logic and atmospheric tension.",
        thumbnail="/detective_noir_thumbnail_1776537665824.png",
        prompt="Synthesize a gritty, hardboiled detective noir. The setting is a decaying, rain-saturated metropolis plagued by 'Anomalous Crimes' that defy conventional physics. Follow a cynical lead investigator using analytical friction and recursive clue-gathering to expose systemic rot. The tone must be precise, atmospheric, and uncompromisingly dark.",
        color="text-zinc-400", border="border-zinc-500/50", bg="bg-zinc-500/10",
        shadow="shadow-[0_0_15px_rgba(113,113,122,0.2)]", 
        elements=["Analytical Friction", "Systemic Rot", "Recursive Clues"],
        stats={"deployed": "13.5k", "success": "89%", "complexity": "Professional"}
    ),
    Template(
        name="Elimination Protocol", category="Action", icon="Hash", vibe="Brutal & Strategic",
        description="Tense social commentary and high-stakes games.",
        thumbnail="/survival_game_thumbnail_1776537679688.png",
        prompt="Architect a brutal, high-stakes Death Game narrative. Participants are forced into localized trap environments where survival depends on ruthless game-theory and social Darwinism. Emphasize the psychological stress, moral dilemmas, and the breakdown of human empathy under extreme duress. Each 'game' should be a metaphor for systemic social trauma.",
        color="text-rose-600", border="border-rose-600/50", bg="bg-rose-600/10",
        shadow="shadow-[0_0_15px_rgba(225,29,72,0.2)]", 
        elements=["Game Theory", "Social Darwinism", "Psychological Stress"],
        stats={"deployed": "17.4k", "success": "93%", "complexity": "Professional"}
    )
]

def seed_all():
    logger.info("Initializing Full Studio Ecosystem...")
    # sqlalchemy.metadata.create_all(engine) # Handled by fastapi_app.py
    
    with Session(engine) as session:
        # 1. Seed Tutorials
        if not session.exec(select(Tutorial)).first():
            logger.info("Injecting Learning Center protocols...")
            tutorials = [
                Tutorial(
                    title="Mastering the Neural Forge",
                    description="Learn how to architect high-fidelity world lore using the G2.0 Pro engine.",
                    icon_name="Brain", duration="12m", level="Advanced", category="Architecture",
                    content="Deep dive into world building...", video_url="https://example.com/neural-forge"
                ),
                Tutorial(
                    title="Visual DNA & Character Casting",
                    description="A guide to synthesizing persistent character identities and aesthetic signatures.",
                    icon_name="Users", duration="8m", level="Professional", category="Character Design",
                    content="Learn how to create persistent visual DNA...", video_url="https://example.com/character-casting"
                ),
                Tutorial(
                    title="One-Prompt Production Loop",
                    description="Everything you need to know about the 4-Phase autonomous production cycle.",
                    icon_name="Zap", duration="5m", level="Beginner", category="Production",
                    content="Master the autonomous loop...", video_url="https://example.com/one-prompt"
                ),
                Tutorial(
                    title="Cinematic Prompt Engineering",
                    description="Mastering the art of visual cues and camera directives for AI image synthesis.",
                    icon_name="Camera", duration="15m", level="Expert", category="Visuals",
                    content="Learn cinematic prompting...", video_url="https://example.com/prompts"
                )
            ]
            for t in tutorials: session.add(t)

        # 2. Seed Templates (Blueprints)
        logger.info("Cleaning up old blueprints...")
        existing_templates = session.exec(select(Template)).all()
        for t in existing_templates:
            session.delete(t)
        session.commit()

        logger.info("Forging Blueprint Library...")
        for t in PRODUCTION_TEMPLATES:
            session.add(t)


        # 3. Seed Projects (My Library)
        if not session.exec(select(Project)).first():
            logger.info("Archiving Sample Productions...")
            p1 = Project(
                user_id=LOCAL_USER_ID, title="Solo Leveling: Reborn", content_type="Manhwa", 
                genre="Action", art_style="Digital Webtoon", episode_length="24 min",
                description="A modern day hunter gains a unique leveling system.",
                status="completed", model_used="gemini-2.0-pro-exp",
                prod_metadata={"script": "The shadows rise as Jin-Woo stands before the gate...", "episode": 1, "session": 1}
            )
            p2 = Project(
                user_id=LOCAL_USER_ID, title="Neon Ghost 2099", content_type="Anime", 
                genre="Sci-Fi", art_style="Cyberpunk Noir", episode_length="22 min",
                description="A rogue AI hunter discovers their own neural origin.",
                status="in_progress", model_used="gemini-3-flash-preview",
                prod_metadata={"script": "Rain slicked streets of Neo-Tokyo reflect the neon pulse...", "episode": 3, "session": 5}
            )
            session.add(p1)
            session.add(p2)
            session.commit()

            logger.info("Generating Production Narratives...")
            series = Series(title="Solo Leveling Saga", summary="The ascent of the world's weakest hunter.")
            session.add(series)
            session.commit()

            ep1 = Episode(project_id=p1.id, series_id=series.id, episode_number=1, title="The Double Dungeon", hook="A routine raid turns into a nightmare.")
            session.add(ep1)
            session.commit()

            script = Script(title="Ep 1: Reawakening", content="[INT. DUNGEON - NIGHT]\nJin-Woo grips his broken dagger. The giant statue's eyes glow red.", project_id=p1.id, episode_id=ep1.id, series_id=series.id)
            session.add(script)

            logger.info("Synthesizing Master Manifest: Project X...")
            px = Project(
                user_id=LOCAL_USER_ID, title="Project X: The Last Protocol", content_type="Anime", 
                genre="Seinen Horror", art_style="Oil Painting / Gritty", episode_length="24 min",
                description="In a world where memories are currency, a memory-less detective hunts a digital ghost.",
                status="active", model_used="God Mode Engine v2.0",
                prod_metadata={"phase": "Production", "completion": 65}
            )
            session.add(px)
            session.commit()

            # World Lore
            lore = WorldLore(
                user_id=LOCAL_USER_ID, project_id=px.id,
                architecture="Brutalist megastructures built on the ruins of a digital ocean.",
                atlas="The Floating City of Memoria, divided into sectors based on memory quality.",
                history="The Great Erasure (2088) wiped 90% of global data; memory became the new gold standard.",
                systems="The Synapse Exchange: A biological marketplace for trading childhood memories for survival.",
                culture="A neo-feudal society where 'Rich' means having a full childhood history.",
                full_lore_blob="[MASTER LORE MANIFEST]\nLocation: Memoria\nYear: 2105\nCore Conflict: Memory Theft..."
            )
            session.add(lore)

            # Cast Members
            c1 = CastMember(
                project_id=px.id, name="Detective Kaine", role="Protagonist",
                description="Stoic, wears a cracked neural mask. Only has 3 days of memories.",
                visual_dna="Noir aesthetic, glowing cyan eyes, weathered trench coat with fiber-optic stitching."
            )
            c2 = CastMember(
                project_id=px.id, name="The Oracle", role="Antagonist",
                description="A digital entity living in the forgotten servers. Wants to erase the world's last memory.",
                visual_dna="Glitch-effect silhouette, shifting patterns of binary code, translucent skin."
            )
            session.add(c1)
            session.add(c2)

            # Narrative Beats
            b1 = NarrativeBeat(project_id=px.id, title="The Awakening", content="Kaine discovers his first memory shard.", order=1)
            session.add(b1)

        # 4. Seed Community Posts
        if not session.exec(select(CommunityPost)).first():
            logger.info("Broadcasting Social Hub transmissions...")
            posts = [
                CommunityPost(
                    user_id="SYSTEM_ARCHITECT", title="NEON SYNDICATE: The Full Pilot Arc",
                    content="Check out this 60-episode masterpiece generated with the Cyber Pulse blueprint.",
                    likes=1420, views=25000, tags=["Cyberpunk", "Action", "GodMode"]
                ),
                CommunityPost(
                    user_id="AnimeCreator_99", title="The Dragon's Breath - New Script",
                    content="Just finished the world lore for my new Shonen series. The magic system is based on actual thermal dynamics!",
                    likes=85, views=1200, tags=["Shonen", "Magic", "WorldBuilding"]
                )
            ]
            for p in posts: session.add(p)

        # 5. Seed Media Assets
        if not session.exec(select(MediaAsset)).first():
            logger.info("Indexing Visual DNA...")
            assets = [
                MediaAsset(user_id=LOCAL_USER_ID, name="Cyberpunk Noir Protagonist", url="https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800", asset_type="IMAGE", prompt="A gritty shonen protagonist in a neon-drenched cyberpunk alleyway, detailed techwear, cinematic lighting."),
                MediaAsset(user_id=LOCAL_USER_ID, name="Neo-Tokyo Horizon", url="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800", asset_type="IMAGE", prompt="Breathtaking wide shot of Neo-Tokyo skyline at sunset, floating megastructures, synthwave aesthetic."),
                MediaAsset(user_id=LOCAL_USER_ID, name="Neural Interface Core", url="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800", asset_type="IMAGE", prompt="Internal view of a neural processing core, glowing circuit paths, ethereal blue energy pulses.")
            ]
            for a in assets: session.add(a)

            # 5.5 Seed User Favorites
            if not session.exec(select(UserFavorite)).first():
                logger.info("Syncing Bookmarked Visions...")
                # Fetch the assets we just added to get their IDs
                session.flush()
                favs = [
                    UserFavorite(user_id=LOCAL_USER_ID, asset_id=assets[0].id),
                    UserFavorite(user_id=LOCAL_USER_ID, asset_id=assets[1].id)
                ]
                for f in favs: session.add(f)

        # 6. Seed User Data
        if not session.exec(select(UserProfile).where(UserProfile.user_id == LOCAL_USER_ID)).first():
            logger.info("Initializing Architect Credentials...")
            profile = UserProfile(
                user_id=LOCAL_USER_ID, 
                display_name="Lead Studio Architect",
                handle="architect",
                bio="Architect of the Anime Script Pro production environment.",
                avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Architect"
            )
            existing_balance = session.exec(select(UserBalance).where(UserBalance.user_id == LOCAL_USER_ID)).first()
            if existing_balance:
                existing_balance.credits = 15000
                existing_balance.level = 42
                existing_balance.experience = 8450
                session.add(existing_balance)
            else:
                balance = UserBalance(user_id=LOCAL_USER_ID, credits=15000, level=42, experience=8450)
                session.add(balance)
            
            # Update Settings with studio defaults
            settings = session.exec(select(UserSettings).where(UserSettings.user_id == LOCAL_USER_ID)).first()
            if not settings:
                settings = UserSettings(
                    user_id=LOCAL_USER_ID,
                    studio_defaults={
                        "aspectRatio": "16:9",
                        "defaultModelStyle": "Cyberpunk",
                        "theme": "dark"
                    },
                    notifications={"email": {"upscale": True, "generation": True, "security": True}}
                )
                session.add(settings)
            
            # Seed some Library data
            if not session.exec(select(SavedPrompt).where(SavedPrompt.user_id == LOCAL_USER_ID)).first():
                p1 = SavedPrompt(user_id=LOCAL_USER_ID, label="Cyber Noir Signature", prompt_text="High contrast, deep shadows, neon highlights, 90s anime style.")
                session.add(p1)
            
            if not session.exec(select(ReusableCharacter).where(ReusableCharacter.user_id == LOCAL_USER_ID)).first():
                c1 = ReusableCharacter(
                    user_id=LOCAL_USER_ID, 
                    name="Kaine (Dev Build)", 
                    visual_prompt="Spiky black hair, cybernetic left eye, worn-out grey duster coat.",
                    seed=9999,
                    reference_image_url="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=400"
                )
                session.add(c1)

            session.add(profile)

        # 7. Seed Notifications
        if not session.exec(select(Notification)).first():
            logger.info("Dispatching System Transmissions...")
            notifs = [
                Notification(user_id=LOCAL_USER_ID, title="Neural Engine Update", message="Gemini 2.0 Pro Experimental is now the default orchestrator.", type="INFO"),
                Notification(user_id=LOCAL_USER_ID, title="Production Sync Successful", message="Your 'Neon Ghost 2099' project is now synced with the cloud.", type="SUCCESS"),
                Notification(user_id=LOCAL_USER_ID, title="Low Credits Warning", message="Your Neural Credit balance is below 1000. Consider top-up.", type="WARNING"),
            ]
            for n in notifs: session.add(n)

        # 8. Seed Help & Documentation
        if not session.exec(select(HelpCategory)).first():
            logger.info("Populating Help Hub and Documentation Archive...")
            
            # Categories
            categories = [
                HelpCategory(slug="getting-started", label="Getting Started", sub="Kickstart your first production", icon="Zap", color="text-yellow-500", order=1),
                HelpCategory(slug="script-architecting", label="Script Logic", sub="Advanced narrative mapping", icon="FileText", color="text-cyan-500", order=2),
                HelpCategory(slug="neural-rendering", label="Neural Engine", sub="Optimizing AI generations", icon="Cpu", color="text-fuchsia-500", order=3),
                HelpCategory(slug="security-privacy", label="Safe Studio", sub="Encryption & data protocols", icon="ShieldCheck", color="text-emerald-500", order=4),
            ]
            for c in categories: session.add(c)

            # FAQs
            faqs = [
                FAQ(question="How do I bypass standard anime tropes?", answer="Enable 'Cinematic Enforcer' in AI Settings to force higher-order narrative logic into your script generations.", is_frequent=True, order=1),
                FAQ(question="What is the 'God Mode' orchestrator?", answer="It is our proprietary multi-agent pipeline that manages script, cast, and world consistency autonomously.", is_frequent=True, order=2),
                FAQ(question="Can I export my project to industry standards?", answer="Yes, our 'Distribution' phase supports Fountain, Final Draft, and PDF exports formatted for SAG-AFTRA standards.", is_frequent=True, order=3),
                FAQ(question="Is my script training your models?", answer="By default, no. You can explicitly opt-out of all telemetry in the 'Neural Security' settings.", is_frequent=True, order=4),
            ]
            for f in faqs: session.add(f)

            # Doc Sections
            sections = [
                DocSection(slug="introduction", label="Architect Introduction", icon="Globe", order=1),
                DocSection(slug="core-concepts", label="Neural Core Concepts", icon="Cpu", order=2),
                DocSection(slug="scripting", label="Script Logic Syntax", icon="Terminal", order=3),
                DocSection(slug="data-vault", label="Data Vault Protocols", icon="Database", order=4),
                DocSection(slug="api-reference", label="Direct API Access", icon="Code", order=5),
                DocSection(slug="security", label="Security Hardening", icon="Lock", order=6),
            ]
            for s in sections: session.add(s)

            # Doc Articles
            articles = [
                DocArticle(
                    section_slug="introduction", slug="architectural-foundation", title="The Architectural Foundation",
                    content="Welcome to the core documentation for Anime Script Pro. This manual details the underlying neural logic, API integrations, and narrative mapping protocols that drive the 'God Mode' production suite.",
                    protocol_id="Protocol 001", order=1
                ),
                DocArticle(
                    section_slug="core-concepts", slug="neural-scaffolding", title="The Neural Scaffolding",
                    content="Productions are built on a hierarchy of Scenes -> Episodes -> Series. Each layer inherits constraints from the 'World Lore' database to ensure your characters never violate the established physics or history of your universe.",
                    order=1
                )
            ]
            for a in articles: session.add(a)

        session.commit()
    logger.success("Full Studio Ecosystem successfully seeded.")

if __name__ == "__main__":
    seed_all()
