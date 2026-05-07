#!/usr/bin/env python3
import sqlite3
import sys

db_path = "backend/database/db.sqlite"

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check current columns
    cursor.execute("PRAGMA table_info(worldlore)")
    columns = cursor.fetchall()
    print("Current worldlore columns:")
    for col in columns:
        print(f"  {col}")
    
    existing_cols = {col[1] for col in columns}
    print(f"\nExisting: {existing_cols}")
    
    # Required columns from model
    required_cols = {
        'manifest_blob', 'history_blob', 'factions_blob', 'powers_blob',
        'architecture_blob', 'atlas_blob', 'culture_blob', 'systems_blob',
        'prompt_manifest', 'prompt_history', 'prompt_factions', 'prompt_powers',
        'prompt_architecture', 'prompt_atlas', 'prompt_culture', 'prompt_systems'
    }
    
    missing = required_cols - existing_cols
    if missing:
        print(f"\nMissing columns: {missing}")
        print("\nAdding missing columns...")
        
        for col in missing:
            try:
                cursor.execute(f"ALTER TABLE worldlore ADD COLUMN {col} TEXT")
                print(f"  ✓ Added {col}")
            except sqlite3.OperationalError as e:
                print(f"  ✗ Error adding {col}: {e}")
        
        conn.commit()
        print("\n✅ Database schema updated!")
    else:
        print("\n✅ All columns exist!")
    
    conn.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
