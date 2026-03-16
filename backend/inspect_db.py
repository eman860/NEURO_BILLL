import os
import psycopg2
from dotenv import load_dotenv

def inspect_db():
    load_dotenv()
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("Error: DATABASE_URL not found in .env")
        return
        
    try:
        print(f"Connecting to database...")
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        # Get tables
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [t[0] for t in cur.fetchall()]
        print(f"Tables found: {tables}")
        
        # Get counts for each table
        for table in tables:
            cur.execute(f"SELECT COUNT(*) FROM {table}")
            count = cur.fetchone()[0]
            print(f"- {table}: {count} rows")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_db()
