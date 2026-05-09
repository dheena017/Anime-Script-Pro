from sqlalchemy import Session, create_engine, select
import sys
import os
from datetime import datetime

# Add project root to path
sys.path.append(os.getcwd())

from backend.database.models.world import CastManifest

DATABASE_URL = "sqlite:///backend/database/anime_script_pro.db"
engine = create_engine(DATABASE_URL)

def seed_cast_manifest():
    user_id = "local-dev-architect-id"
    with Session(engine) as session:
        # Check if exists
        statement = select(CastManifest).where(CastManifest.user_id == user_id)
        existing = session.exec(statement).first()
        
        if not existing:
            print(f"Seeding CastManifest for {user_id}...")
            manifest = CastManifest(
                user_id=user_id,
                cast_list_blob="[]",
                relationships_blob="{}",
                dna_config_blob="{}",
                dynamics_blob="{}",
                integrity_blob="{}",
                updated_at=datetime.utcnow()
            )
            session.add(manifest)
            session.commit()
            print("Successfully seeded.")
        else:
            print(f"CastManifest for {user_id} already exists.")

if __name__ == "__main__":
    seed_cast_manifest()
