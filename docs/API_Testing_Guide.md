# API Testing Guide - Milestones 1 to 3

Start backend:

```powershell
cd backend
.\venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

Open Swagger UI:

```text
http://127.0.0.1:8000/docs
```

## Step 1: Login

Endpoint:

```text
POST /api/auth/login
```

Body:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Copy the returned `access_token` and authorize in Swagger using:

```text
Bearer <access_token>
```

## Milestone 1 APIs

```text
GET /api/dashboard/summary
GET /api/dashboard/station-crowd
GET /api/dashboard/passenger-trend
GET /api/dashboard/heatmap
GET /api/stations
```

## Milestone 2 APIs

```text
GET /api/scheduling/schedules
GET /api/scheduling/frequency-recommendations
GET /api/scheduling/operational-monitoring
GET /api/prediction/demand-forecast
GET /api/prediction/traffic-report
PATCH /api/scheduling/schedules/{schedule_id}
```

## Milestone 3 APIs

```text
GET /api/alerts
GET /api/alerts/announcements
POST /api/alerts/announcements
GET /api/alerts/real-time-updates
GET /api/analytics/report
```

## Expected result

The API should return JSON for crowd monitoring, station heatmaps, train schedules, AI forecasts, alerts, announcements, and analytics reports.
