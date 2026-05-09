import os
import sys
from sqlalchemy import Session, create_engine, select, sqlalchemy
from loguru import logger

# Add parent directory to path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.database.models import Template

# Point to the exact database file used by the backend
DATABASE_URL = "sqlite:///backend/database/anime_script_pro.db"
engine = create_engine(DATABASE_URL)

from backend.scripts.seeds.seed_all import PRODUCTION_TEMPLATES

def seed():
    # Force table creation
    logger.info("Ensuring tables are created...")
    sqlalchemy.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Clear existing templates
        logger.info("Cleaning up old blueprints...")
        existing = session.execute(select(Template)).all()
        for e in existing:
            session.delete(e)
        session.commit()
        
        logger.info(f"Injecting {len(PRODUCTION_TEMPLATES)} fresh blueprints...")
        for template in PRODUCTION_TEMPLATES:
            # Create a new instance for this session if needed, 
            # or just add the existing one (sqlalchemy might complain if attached to another session)
            # Since seed_all is likely not running at the same time, we can just add them.
            # However, PRODUCTION_TEMPLATES are already Template objects created in seed_all.
            # We need to make sure they are not bound to another session.
            new_template = Template(
                name=template.name,
                description=template.description,
                category=template.category,
                icon=template.icon,
                thumbnail=template.thumbnail,
                prompt=template.prompt,
                color=template.color,
                border=template.border,
                bg=template.bg,
                shadow=template.shadow,
                elements=template.elements,
                vibe=template.vibe,
                stats=template.stats
            )
            session.add(new_template)
        
        session.commit()
        logger.success("Forge Library is now powered by the Centralized Blueprint Archive.")
if __name__ == "__main__":
    seed()
