import sqlite3
import datetime

def create_tables():
    """Creates all necessary database tables if they don't exist."""
    conn = sqlite3.connect('project.db', timeout=30.0, isolation_level=None)
    cursor = conn.cursor()

    # Create help_requests table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS help_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_identifier TEXT NOT NULL,
            question_text TEXT NOT NULL,
            details TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'pending',
            supervisor_answer TEXT,
            resolved_at TIMESTAMP,
            resolved_by TEXT,
            supervisor_assigned TEXT
        )
    ''')

    # Create knowledge_base table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS knowledge_base (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT UNIQUE NOT NULL,
            answer TEXT NOT NULL
        )
    ''')

    # Create supervisors table for authentication
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS supervisors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            role TEXT DEFAULT 'supervisor',
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            approved_by TEXT,
            approved_at TIMESTAMP,
            rejected_by TEXT,
            rejected_at TIMESTAMP,
            rejection_reason TEXT
        )
    ''')

    # Create registration_requests table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS registration_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            reviewed_by TEXT,
            reviewed_at TIMESTAMP,
            rejection_reason TEXT
        )
    ''')

    # Create session_logs table for tracking login/logout history
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS session_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            login_time TIMESTAMP NOT NULL,
            logout_time TIMESTAMP,
            session_duration INTEGER,
            ip_address TEXT,
            user_agent TEXT,
            FOREIGN KEY (username) REFERENCES supervisors(username)
        )
    ''')

    # Create user_activity table for tracking customer voice sessions
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id TEXT NOT NULL,
            start_time TIMESTAMP NOT NULL,
            last_heartbeat TIMESTAMP NOT NULL,
            duration_seconds REAL DEFAULT 0,
            status TEXT DEFAULT 'active'
        )
    ''')

    # Create bookmarks table for shared bookmarks across users
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookmarks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id INTEGER NOT NULL,
            bookmarked_by TEXT NOT NULL,
            bookmarked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (request_id) REFERENCES help_requests(id),
            FOREIGN KEY (bookmarked_by) REFERENCES supervisors(username),
            UNIQUE(request_id, bookmarked_by)
        )
    ''')

    # Add profile_pic column to supervisors table if it doesn't exist
    try:
        cursor.execute('ALTER TABLE supervisors ADD COLUMN profile_pic TEXT')
        print("✅ Added profile_pic column to supervisors table")
    except sqlite3.OperationalError:
        # Column already exists
        pass

    conn.commit()
    print("✅ All tables created successfully!")

    # Insert default admin user if no supervisors exist
    cursor.execute("SELECT COUNT(*) FROM supervisors")
    if cursor.fetchone()[0] == 0:
        cursor.execute('''
            INSERT INTO supervisors (username, password, email, full_name, role, status, approved_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', ('admin', 'admin123', 'admin@frontdesk.com', 'System Administrator', 'admin', 'approved', datetime.datetime.now()))
        
        cursor.execute('''
            INSERT INTO supervisors (username, password, email, full_name, role, status, approved_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', ('supervisor', 'super123', 'supervisor@frontdesk.com', 'Lead Supervisor', 'supervisor', 'approved', datetime.datetime.now()))
        
        conn.commit()
        print("✅ Default admin and supervisor accounts created!")

    # Add some initial knowledge
    try:
        cursor.execute("INSERT INTO knowledge_base (question, answer) VALUES (?, ?)", 
                       ('What are your hours?', 'We are open from 9 AM to 6 PM, Tuesday to Saturday.'))
        cursor.execute("INSERT INTO knowledge_base (question, answer) VALUES (?, ?)", 
                       ('Where are you located?', 'We are located at 123 Beauty Lane.'))
        conn.commit()
        print("✅ Initial knowledge inserted.")
    except sqlite3.IntegrityError:
        print("ℹ️  Initial knowledge already exists.")

    conn.close()


def add_sample_data():
    """Adds sample help requests for testing."""
    conn = sqlite3.connect('project.db', timeout=30.0, isolation_level=None)
    cursor = conn.cursor()

    sample_requests = [
        ('identity-D3tP', 'hey do you offer service?'),
        ('identity-D3tP', 'are u there'),
        ('identity-D3tP', 'hiiiiii'),
        ('identity-D3tP', 'hello'),
    ]

    try:
        cursor.executemany('''
            INSERT INTO help_requests (customer_identifier, question_text)
            VALUES (?, ?)
        ''', sample_requests)
        conn.commit()
        print(f"✅ Added {len(sample_requests)} sample help requests.")
    except sqlite3.IntegrityError:
        print("ℹ️  Sample data may already exist.")

    conn.close()


if __name__ == '__main__':
    create_tables()
    add_sample_data()
    print("\n✅ Database setup complete!")
