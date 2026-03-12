import psycopg2

def inspect_db():
    try:
        conn = psycopg2.connect('postgresql://postgres:postgres@localhost:5432/neurabills')
        cur = conn.cursor()
        
        # Get tables
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [t[0] for t in cur.fetchall()]
        print(f"Tables: {tables}")
        
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
