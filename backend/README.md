# Backend — Metro Crowd Management API

FastAPI backend for the Metro Crowd Management and Scheduling platform.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | 0.111.0 | Web framework |
| Uvicorn | 0.30.1 | ASGI server |
| Pydantic | 2.7.1 | Data validation & settings |
| python-jose | 3.3.0 | JWT authentication |
| SQLAlchemy | 2.0.30 | ORM (prepared, not active) |
| PostgreSQL | — | Database (prepared, not active) |

## Project Structure

```
backend/
├── app/
│   ├── main.py                        # FastAPI application entry point
│   ├── api/
│   │   └── v1/
│   │       ├── router.py              # Aggregates all v1 routers
│   │       └── endpoints/
│   │           ├── health.py          # GET /health, /health/ready
│   │           ├── auth.py            # POST /auth/login, /auth/logout
│   │           ├── crowd.py           # GET /crowd, /crowd/{id}
│   │           ├── scheduling.py      # GET /schedules, /schedules/{id}
│   │           ├── analytics.py       # GET /analytics
│   │           ├── alerts.py          # GET /alerts, PATCH /alerts/{id}/resolve
│   │           └── trains.py          # GET /trains, /trains/{id}
│   ├── authentication/
│   │   ├── jwt_handler.py             # JWT create/decode/verify
│   │   └── dependencies.py            # FastAPI auth dependencies
│   ├── core/
│   │   └── config.py                  # Pydantic settings (env-based)
│   ├── database/
│   │   └── session.py                 # SQLAlchemy session (placeholder)
│   ├── models/                        # ORM models — Milestone 2+
│   ├── schemas/
│   │   ├── auth.py                    # Login, Token, UserProfile
│   │   ├── crowd.py                   # CrowdReading, CrowdSummary
│   │   ├── schedule.py                # TrainSchedule, ScheduleList
│   │   ├── analytics.py               # MetricPoint, AnalyticsSummary
│   │   ├── alerts.py                  # Alert, AlertList
│   │   └── trains.py                  # TrainStatus, TrainStatusList
│   ├── services/                      # Business logic — Milestone 2+
│   ├── repositories/                  # Data access — Milestone 2+
│   ├── middleware/
│   │   └── cors.py                    # CORS middleware configuration
│   ├── ai/                            # ML modules — Milestone 3+
│   ├── utils/
│   │   └── response.py                # Standardized response helpers
│   └── config/
│       └── settings.py                # Re-exports core settings
├── requirements.txt
└── .env.example
```

## Installation

```bash
# 1. Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your values
```

## Running

```bash
# Development (with auto-reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | API info | No |
| `GET` | `/api/v1/health` | Liveness probe | No |
| `GET` | `/api/v1/health/ready` | Readiness probe | No |
| `POST` | `/api/v1/auth/login` | Login → JWT token | No |
| `POST` | `/api/v1/auth/logout` | Logout | Yes |
| `GET` | `/api/v1/auth/me` | Current user | Yes |
| `GET` | `/api/v1/crowd` | All station crowd levels | Yes |
| `GET` | `/api/v1/crowd/{id}` | Station crowd by ID | Yes |
| `GET` | `/api/v1/trains` | All train statuses | Yes |
| `GET` | `/api/v1/trains/{id}` | Train status by ID | Yes |
| `GET` | `/api/v1/schedules` | All schedules | Yes |
| `GET` | `/api/v1/schedules/{id}` | Schedule by ID | Yes |
| `GET` | `/api/v1/analytics` | Analytics summary | Yes |
| `GET` | `/api/v1/analytics/export` | Export report (stub) | Yes |
| `GET` | `/api/v1/alerts` | All alerts | Yes |
| `PATCH` | `/api/v1/alerts/{id}/resolve` | Resolve alert | Yes |

## Interactive Docs

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Authentication (Milestone 1)

Login with demo credentials to get a JWT token:

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@metro.com", "password": "admin123"}'
```

Use the returned `access_token` as `Authorization: Bearer <token>` on protected routes.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | Metro Crowd Management API | Application name |
| `APP_VERSION` | 1.0.0 | API version |
| `DEBUG` | True | Debug mode |
| `SECRET_KEY` | (required) | JWT signing secret |
| `ALGORITHM` | HS256 | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 30 | Token TTL |
| `DATABASE_URL` | postgresql://... | DB connection (M2+) |
| `ALLOWED_ORIGINS` | http://localhost:5173 | CORS allowed origins |

## Milestone Roadmap

| Milestone | Changes |
|-----------|---------|
| **M1 (Current)** | Scaffold only — dummy JSON responses |
| **M2** | PostgreSQL integration, real auth, full CRUD |
| **M3** | AI/ML model inference endpoints |
| **M4** | WebSocket real-time updates |
| **M5** | Export, reporting, notification services |
