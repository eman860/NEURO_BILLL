import sqlite3

def check_users():
    conn = sqlite3.connect('neurabills.db')
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, email, full_name FROM users")
        users = cursor.fetchall()
        print(f"Total users: {len(users)}")
        for u in users:
            print(u)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_users()
