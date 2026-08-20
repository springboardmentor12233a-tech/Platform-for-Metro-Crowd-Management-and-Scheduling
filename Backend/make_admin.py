import sqlite3
from passlib.hash import bcrypt

conn = sqlite3.connect("metroflow.db")
cur = conn.cursor()

new_password = "admin123"
hashed = bcrypt.hash(new_password)

cur.execute("UPDATE users SET hashed_password = ? WHERE username = 'farhan123'", (hashed,))
conn.commit()
conn.close()
print("Password reset done!")