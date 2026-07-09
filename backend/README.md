# MetroFlow Backend 

This is the Python FastAPI backend for the MetroFlow Crowd Management and Scheduling Platform.

## Tech Stack
* **Framework:** FastAPI (Python 3.12+)
* **Database:** PostgreSQL (with `asyncpg`)
* **ORM & Migrations:** SQLAlchemy 2.0 & Alembic
* **Package Manager:** `uv`
* **Security:** JWT (JSON Web Tokens) with `bcrypt`

## Local Setup Instructions

### 1. Database Setup
Ensure PostgreSQL 16+ is installed and running.
Create the database and set up the user:
```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
sudo -u postgres psql -c "CREATE DATABASE metroflow;"
```

### 2. Environment Variables
Copy the example config and fill it out if necessary (the defaults work for local dev):
```bash
cp .env.example .env
```

### 3. Install Dependencies
We use `uv` for lightning-fast dependency management.
```bash
uv sync
```

### 4. Database Migrations
Run Alembic to create the tables (like `users`) in your PostgreSQL database:
```bash
uv run python -m alembic upgrade head
```

### 5. Start the Server
Run the FastAPI development server:
```bash
uv run python -m uvicorn main:app --reload --port 8000
```

## API Documentation
Once the server is running, interactive API documentation is automatically generated:
* **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Running Tests
Tests are written with `pytest` and use transactional rollbacks to keep your database clean.
```bash
uv run pytest -v tests/
```
