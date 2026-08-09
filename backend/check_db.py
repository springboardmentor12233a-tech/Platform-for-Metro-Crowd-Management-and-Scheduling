import sqlite3

conn = sqlite3.connect('metroflow.db')
conn.row_factory = sqlite3.Row
c = conn.cursor()

c.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r['name'] for r in c.fetchall()]
print('Tables:', tables)

c.execute('SELECT username, role FROM users')
users = c.fetchall()
print('Users:', [(u['username'], u['role']) for u in users])

if 'emergency_announcements' not in tables:
    print('Creating emergency_announcements table...')
    c.execute('''CREATE TABLE IF NOT EXISTS emergency_announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        line TEXT,
        station TEXT,
        severity TEXT NOT NULL,
        broadcast_by TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1
    )''')
    conn.commit()
    print('Table created!')
else:
    c.execute('SELECT COUNT(*) as cnt FROM emergency_announcements')
    print('Announcements count:', c.fetchone()['cnt'])

if 'alerts_resolution' not in tables:
    print('Creating alerts_resolution table...')
    c.execute('''CREATE TABLE IF NOT EXISTS alerts_resolution (
        alert_id TEXT PRIMARY KEY,
        resolved_by TEXT NOT NULL,
        resolved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolution_notes TEXT NOT NULL
    )''')
    conn.commit()
    print('alerts_resolution table created!')
else:
    print('alerts_resolution: OK')

conn.close()
print('DB check complete!')
