# MetroFlow API Testing Guide

## Base URL

```text
http://127.0.0.1:8000
```

## Swagger UI

```text
http://127.0.0.1:8000/docs
```

## Login first

Use this endpoint:

```text
POST /api/auth/login
```

Admin request body:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Operator request body:

```json
{
  "username": "operator",
  "password": "operator123"
}
```

Copy the access token and use it as Bearer token for protected APIs.

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
```

## Milestone 3 APIs

```text
GET /api/alerts
GET /api/alerts/real-time-updates
GET /api/alerts/announcements
GET /api/analytics/report
```

## Milestone 4 APIs

```text
GET /health
GET /api/milestone4/testing-report
GET /api/milestone4/deployment-readiness
GET /api/milestone4/final-demo-report
GET /api/milestone4/report
```

## Postman collection

Use:

```text
postman/MetroFlow_Milestone1_to_4.postman_collection.json
```
