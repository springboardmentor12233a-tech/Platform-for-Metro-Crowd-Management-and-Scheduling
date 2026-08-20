import sqlite3

conn = sqlite3.connect("metroflow.db")
cur = conn.cursor()

cur.execute("UPDATE stations SET name = 'Kashmere Gate' WHERE LOWER(name) = LOWER('kashmere gate')")
cur.execute("UPDATE stations SET name = 'Dwarka Sector 21' WHERE LOWER(name) = LOWER('dwarka sector 21')")

conn.commit()
conn.close()
print("Names fixed!")