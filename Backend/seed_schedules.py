import sqlite3

conn = sqlite3.connect("metroflow.db")
cur = conn.cursor()

# Fix existing row 2's name
cur.execute("UPDATE schedules SET station_name = 'Central Station' WHERE id = 2")

# Add schedules for remaining stations
new_schedules = [
    ("Kashmere Gate", "08:10", 6, "On Time"),
    ("Dwarka Sector 21", "08:20", 4, "On Time"),
    ("Rajiv Chowk", "08:05", 3, "Delayed"),
]

cur.executemany(
    "INSERT INTO schedules (station_name, departure_time, frequency_minutes, status) VALUES (?, ?, ?, ?)",
    new_schedules
)

conn.commit()
conn.close()
print("Schedules updated successfully!")