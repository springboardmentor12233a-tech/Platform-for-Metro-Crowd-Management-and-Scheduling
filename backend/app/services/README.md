# Services

Contains business logic layer — the Service Layer in Clean Architecture.

## Purpose

Services orchestrate domain operations, calling repositories for data access
and applying business rules. Routes should only call services, never repositories directly.

## Planned Services (Future Milestones)

| File | Description |
|------|-------------|
| `auth_service.py` | User authentication and session management |
| `crowd_service.py` | Crowd density analysis and threshold alerting |
| `schedule_service.py` | Train scheduling optimization logic |
| `analytics_service.py` | Aggregation and reporting computations |
| `alert_service.py` | Alert generation, escalation, and notification |
| `train_service.py` | Real-time train tracking and status updates |

## Architecture

```
Routes (API Layer)
      ↓
Services (Business Logic) ← YOU ARE HERE
      ↓
Repositories (Data Access)
      ↓
Database (PostgreSQL)
```

## Status

Prepared for Milestone 2+. No service code is active in Milestone 1.
