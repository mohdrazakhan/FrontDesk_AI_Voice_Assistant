import sqlite3
import os

def normalize_status(db_path):
    if not os.path.exists(db_path):
        print(f"Database not found: {db_path}")
        return
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    # Map legacy lowercase to canonical
    status_map = {
        'pending': 'Pending',
        'resolved': 'Resolved',
        'delivered': 'Delivered',
        'answered': 'Answered',
    }
    for old, new in status_map.items():
        c.execute("UPDATE help_requests SET status = ? WHERE LOWER(status) = ?", (new, old))
    conn.commit()
    print("Status normalization complete.")
    conn.close()

if __name__ == "__main__":
    db_path = os.path.join(os.path.dirname(__file__), '..', 'project.db')
    normalize_status(db_path)
