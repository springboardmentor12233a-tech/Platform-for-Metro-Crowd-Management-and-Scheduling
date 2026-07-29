# AI MetroFlow — Setup (3-file version)

Files:
- `index.html` — entire frontend (HTML + CSS + JS in one file)
- `app.py` — entire backend (Flask config, models, JWT auth, all REST APIs)
- `database.sql` — PostgreSQL schema + seed data

## Steps

1. Create a `.env` file next to `app.py`:
   ```
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=metroflow
   SECRET_KEY=some-random-string
   JWT_SECRET_KEY=another-random-string
   ```

2. Create the database and load the schema:
   ```bash
   createdb metroflow
   psql -d metroflow -f database.sql
   ```

3. Put `index.html` inside a `templates/` folder next to `app.py`
   (Flask's `render_template` looks there):
   ```
   MetroFlow/
     app.py
     database.sql
     requirements.txt
     templates/
       index.html
   ```

4. Install dependencies and run:
   ```bash
   pip install -r requirements.txt
   python app.py
   ```
   Visit `http://localhost:5000/`.

5. Demo logins (seeded in `database.sql`):
   - Admin: `admin@metroflow.com` / `admin123`
   - Operator: `operator@metroflow.com` / `operator123`
