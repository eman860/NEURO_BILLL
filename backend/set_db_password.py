import os
import getpass
import urllib.parse

def main():
    print("=====================================================")
    print("   NeuraBills Supabase Database Password Setup    ")
    print("=====================================================")
    print("\nPlease enter your Supabase Database Password.")
    print("For security, your typing will be hidden (no characters will appear).")
    
    password = getpass.getpass("\n[?] Supabase DB Password: ")
    
    if not password:
        print("\n[!] Error: Password cannot be empty.")
        return
        
    # URL encode the password to safely handle special characters in the connection string
    encoded_password = urllib.parse.quote_plus(password)
    
    env_file_path = os.path.join(os.path.dirname(__file__), ".env")
    
    try:
        if os.path.exists(env_file_path):
            with open(env_file_path, "r") as f:
                lines = f.readlines()
        else:
            lines = []
            
        new_lines = []
        replaced = False
        for line in lines:
            if line.startswith("DATABASE_URL="):
                new_line = f'DATABASE_URL="postgresql://postgres.fkvtowkfyxaqratwwwub:{encoded_password}@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"\n'
                new_lines.append(new_line)
                replaced = True
            else:
                new_lines.append(line)
                
        if not replaced:
            if lines and not lines[-1].endswith("\n"):
                new_lines.append("\n")
            new_lines.append(f'DATABASE_URL="postgresql://postgres.fkvtowkfyxaqratwwwub:{encoded_password}@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"\n')
            
        with open(env_file_path, "w") as f:
            f.writelines(new_lines)
            
        print("\n[✓] Success! Your .env file has been updated securely.")
        print("    You can now test the connection by running: python test_db.py")
        
    except Exception as e:
        print(f"\n[!] Error updating .env file: {e}")

if __name__ == "__main__":
    main()
