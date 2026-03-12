import os
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from database import Base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/neurabills")

try:
    print(f"Testing connection to {DATABASE_URL}...")
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        print("Successfully connected to the PostgreSQL database!")
        print("Checking if tables exist/can be created...")
        Base.metadata.create_all(bind=engine)
        print("Database schema is ready.")
except OperationalError as e:
    print("\n[ERROR] Failed to connect to PostgreSQL. Please ensure:")
    print("1. PostgreSQL server is running.")
    print("2. The database 'neurabills' exists.")
    print("3. The username and password are correct.")
    print(f"\nDetails:\n{e}")
except Exception as e:
    print(f"\n[ERROR] An unexpected error occurred: {e}")
