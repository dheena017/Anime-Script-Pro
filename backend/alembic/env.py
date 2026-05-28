"""
Anime Script Pro — Alembic Migration Environment Configuration

This script configures the migration environment, mapping SQLModel schemas to the database context.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Context Model Loading
  4. Migration Execution Routines
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
from logging.config import fileConfig
import os
import sys

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from alembic import context
from sqlalchemy import engine_from_config, pool
from sqlmodel import SQLModel

# ==============================================================================
# 3. CONTEXT MODEL LOADING
# ==============================================================================
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.database import DATABASE_URL
import backend.database.models as models  # Ensure all models are loaded into SQLModel.metadata

# Setup Alembic configurations
config = context.config
if config.config_file_name:
    fileConfig(config.config_file_name)
config.set_main_option("sqlalchemy.url", DATABASE_URL)
target_metadata = SQLModel.metadata

# ==============================================================================
# 4. MIGRATION EXECUTION ROUTINES
# ==============================================================================

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    Configures context with the database URL and executes SQL statements directly.
    """
    url = DATABASE_URL
    context.configure(
        url=url, 
        target_metadata=target_metadata, 
        literal_binds=True, 
        compare_type=True,
        render_as_batch=True
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    Creates an engine and associates a connection with the migration context.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata, 
            compare_type=True,
            render_as_batch=True
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
