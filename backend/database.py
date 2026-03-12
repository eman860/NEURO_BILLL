"""
database.py – SQLAlchemy engine & session configuration for NeuraBills.
Uses SQLite for zero-configuration local development.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
# Set DATABASE_URL environment variable to use PostgreSQL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./neurabills.db")

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class for all ORM models."""
    pass


def get_db():
    """Dependency that yields a DB session and closes it after request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
