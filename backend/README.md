# MetroFlow Backend

FastAPI backend for Milestone 1.

## Run locally

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## API docs

```text
http://127.0.0.1:8000/docs
```

## Default users

```text
admin / admin123
operator / operator123
```

## Important endpoints

```text
POST /api/auth/login
GET /api/auth/me
GET /api/dashboard/summary
GET /api/dashboard/station-crowd
GET /api/dashboard/passenger-trend
GET /api/dashboard/heatmap
GET /api/stations
```
