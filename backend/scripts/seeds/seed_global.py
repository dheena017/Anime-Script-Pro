import asyncio
import os
import sys
from sqlalchemy import Session, create_engine, select, sqlalchemy
from datetime import datetime
from loguru import logger

# Add parent directory to path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.database.models import Tutorial, CommunityPost, Project, Template

# Point to the exact database file used by the backend
DATABASE_URL = "sqlite:///backend/database/anime_script_pro.db"
engine = create_engine(DATABASE_URL)

TUTORIALS_DATA = [
    {
        "title": "Mastering the Neural Forge",
        "description": "Learn how to architect high-fidelity world lore using the G2.0 Pro engine.",
        "icon_name": "Brain",
        "duration": "12m",
        "level": "Advanced",
        "category": "Architecture",
        "content": "Deep dive into world building...",
        "video_url": "https://example.com/neural-forge"
    },
    {
        "title": "Visual DNA & Character Casting",
        "description": "A guide to synthesizing persistent character identities and aesthetic signatures.",
        "icon_name": "Users",
        "duration": "8m",
        "level": "Professional",
        "category": "Character Design",
        "content": "Learn how to create persistent visual DNA...",
        "video_url": "https://example.com/character-casting"
    },
    {
        "title": "One-Prompt Production Loop",
        "description": "Everything you need to know about the 4-Phase autonomous production cycle.",
        "icon_name": "Zap",
        "duration": "5m",
        "level": "Beginner",
        "category": "Production",
        "content": "Master the autonomous loop...",
        "video_url": "https://example.com/one-prompt"
    }
]

def seed_global():
    # Force table creation
    sqlalchemy.metadata.create_all(engine)
    
    with Session(engine) as session:
        # 1. Seed Tutorials
        logger.info("Cleaning up old tutorials...")
        existing_tuts = session.exec(select(Tutorial)).all()
        for e in existing_tuts:
            session.delete(e)
        session.commit()
        
        logger.info(f"Injecting {len(TUTORIALS_DATA)} tutorials...")
        for t in TUTORIALS_DATA:
            tut = Tutorial(**t)
            session.add(tut)
        
        # 2. Seed Community Posts (Dummy Data for now)
        logger.info("Initializing Community Feed...")
        existing_posts = session.exec(select(CommunityPost)).all()
        for e in existing_posts:
            session.delete(e)
        session.commit()

        # We'll add one featured post
        post = CommunityPost(
            user_id="SYSTEM_ARCHITECT",
            title="NEON SYNDICATE: The Full Pilot Arc",
            content="Check out this 60-episode masterpiece generated with the Cyber Pulse blueprint.",
            likes=1420,
            views=25000,
            tags=["Cyberpunk", "Action", "GodMode"]
        )
        session.add(post)
        
        session.commit()
        logger.success("Global Ecosystem (Tutorials & Community) is now Live.")

if __name__ == "__main__":
    seed_global()
