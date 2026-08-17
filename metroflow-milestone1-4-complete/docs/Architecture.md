# MetroFlow Architecture - Milestones 1 to 3

## Architecture layers

1. **User Interface Layer**
   - React dashboard
   - Login page
   - Admin/operator role display
   - Crowd monitoring, schedules, forecasts, alerts, and analytics sections

2. **API Gateway Layer**
   - FastAPI routing
   - JWT authentication
   - Request validation
   - CORS support for React frontend

3. **Backend Services Layer**
   - Authentication service
   - Crowd monitoring service
   - Scheduling service
   - AI prediction service
   - Alert and notification service
   - Analytics service

4. **Transportation Analytics and Prediction Engine**
   - Pandas based data loading and cleaning
   - Station crowd calculations
   - Scikit-learn demand forecasting
   - Frequency recommendation logic
   - Congestion risk classification

5. **Data Storage Layer**
   - SQLite local database for demo execution
   - PostgreSQL-ready SQLAlchemy configuration
   - Delhi Metro dataset imported into passenger flow tables

## Data flow

```text
Delhi Metro CSV dataset
        ↓
FastAPI seed process
        ↓
SQLite/SQLAlchemy tables
        ↓
Crowd, scheduling, prediction, alert, and analytics services
        ↓
REST API endpoints
        ↓
React dashboard with charts and reports
```

## Milestone coverage

- Milestone 1: authentication, role-based access, dashboard, crowd monitoring, congestion tracking.
- Milestone 2: train schedules, frequency recommendations, AI forecast, traffic reports.
- Milestone 3: alerts, announcements, real-time updates, analytics, operational insights.

## Milestone 4 Architecture Extension

Milestone 4 adds a final validation and deployment layer on top of the existing MetroFlow architecture.

```text
React Dashboard
  -> Milestone 4 validation panel
  -> Testing status
  -> Deployment readiness
  -> Final demo flow

FastAPI Backend
  -> /health
  -> /api/milestone4/testing-report
  -> /api/milestone4/deployment-readiness
  -> /api/milestone4/final-demo-report

Docker Deployment Layer
  -> Frontend container
  -> Backend container
  -> PostgreSQL container
```

This completes the final workflow from local development to deployment-ready demonstration.
