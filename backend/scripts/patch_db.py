import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///backend/database/anime_script_pro.db")

async def migrate():
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE worldlore ADD COLUMN prompt_history VARCHAR;"))
            print("Successfully added prompt_history to worldlore.")
        except Exception as e:
            print(f"Migration error or column already exists: {e}")

asyncio.run(migrate())
