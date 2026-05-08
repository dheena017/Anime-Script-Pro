import sqlite3
import os
from loguru import logger

def get_db_connection():
    """
    Standardized helper to get a raw DB connection.
    Defaults to the project's SQLite database for local development.
    """
    db_path = os.getenv("DATABASE_PATH", "backend/database/anime_script_pro.db")
    
    # Ensure the path is absolute if relative
    if not os.path.isabs(db_path):
        # Assuming current working directory is project root
        db_path = os.path.join(os.getcwd(), db_path)
    
    try:
        conn = sqlite3.connect(db_path)
        # Enable row-like access if needed, or stick to raw for cursor compatibility
        # conn.row_factory = sqlite3.Row 
        return conn
    except Exception as e:
        logger.error(f"DATABASE: Failed to connect to SQLite at {db_path}: {e}")
        raise
