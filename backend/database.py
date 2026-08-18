import sqlite3
import os
import shutil

BASE_DB_PATH = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'metroflow.db'))

def get_db_path():
    # In Vercel serverless environment, runtime filesystem is read-only except /tmp
    if os.environ.get('VERCEL'):
        tmp_db = '/tmp/metroflow.db'
        if not os.path.exists(tmp_db) and os.path.exists(BASE_DB_PATH):
            try:
                shutil.copyfile(BASE_DB_PATH, tmp_db)
            except Exception as e:
                print(f"[DB] Warning copying DB to /tmp: {e}")
        return tmp_db if os.path.exists(tmp_db) else BASE_DB_PATH
    return BASE_DB_PATH

DB_PATH = get_db_path()

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def get_db():
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = dict_factory
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def query_db(query, args=(), one=False):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    conn.close()
    return (rv[0] if rv else None) if one else rv

def execute_db(query, args=()):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(query, args)
    conn.commit()
    last_id = cur.lastrowid
    conn.close()
    return last_id
