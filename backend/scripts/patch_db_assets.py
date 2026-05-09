import sqlite3
import os

db_path = r'f:\Project\Anime-Script-Pro\backend\database\anime_script_pro.db'

def patch_database():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Check existing columns
        cursor.execute("PRAGMA table_info(project_content)")
        columns = [row[1] for row in cursor.fetchall()]
        print(f"Current columns in project_content: {columns}")

        # Add missing columns
        new_columns = [
            ('youtube_description', 'TEXT'),
            ('alt_texts', 'TEXT')
        ]

        for col_name, col_type in new_columns:
            if col_name not in columns:
                print(f"Adding column {col_name} to project_content...")
                cursor.execute(f"ALTER TABLE project_content ADD COLUMN {col_name} {col_type}")
                print(f"Column {col_name} added.")
            else:
                print(f"Column {col_name} already exists.")

        conn.commit()
        print("Database patch applied successfully.")

    except Exception as e:
        print(f"Error patching database: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    patch_database()
