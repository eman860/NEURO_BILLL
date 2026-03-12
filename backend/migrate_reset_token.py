"""
Migration script: Add reset_token and reset_token_expiry columns to users table.
Works with PostgreSQL. Safe to run multiple times.
"""
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    # Check existing columns (PostgreSQL compatible)
    result = conn.execute(text("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users'
    """))
    existing = {row[0] for row in result}
    print("Existing columns:", existing)

    if "reset_token" not in existing:
        conn.execute(text("ALTER TABLE users ADD COLUMN reset_token VARCHAR(255)"))
        conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_reset_token ON users (reset_token) WHERE reset_token IS NOT NULL"))
        print("Added reset_token column.")
    else:
        print("reset_token column already exists.")

    if "reset_token_expiry" not in existing:
        conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_expiry TIMESTAMP"))
        print("Added reset_token_expiry column.")
    else:
        print("reset_token_expiry column already exists.")

    conn.commit()

print("Migration complete.")
