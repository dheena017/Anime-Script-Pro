#!/usr/bin/env python3
"""Initialize the database with all required tables"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

async def init_db():
    from backend.database.connection import async_engine
    from backend.database.models import SQLModel
    
    print("🔄 Initializing database schema...")
    
    try:
        async with async_engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
        print("✅ Database schema initialized successfully!")
        await async_engine.dispose()
        return True
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    result = asyncio.run(init_db())
    sys.exit(0 if result else 1)
