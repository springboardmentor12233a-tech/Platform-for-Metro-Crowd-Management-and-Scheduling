# MetroFlow: AI Platform for Metro Crowd Management and Scheduling

## Milestone 1 Report

**Submitted by:** Muni Pujitha Punugoti  
**Branch name:** muni-pujitha  
**Frontend:** React  
**Backend:** Python FastAPI  
**Dataset:** Delhi Metro Dataset - EDA & Data Visualization

## 1. Project overview

MetroFlow is an AI based metro crowd management and scheduling platform. The goal of the system is to help metro authorities monitor passenger flow, identify crowded stations, and prepare the foundation for future AI based passenger demand forecasting and train scheduling optimization.

Milestone 1 focuses on project initialization, system design, authentication, role based access, and the basic crowd monitoring dashboard.

## 2. System architecture

The application follows a modular full stack architecture.

### Frontend layer

The frontend is developed using React. It contains the login page, dashboard page, stat cards, charts, congestion heatmap, and station wise monitoring table.

### Backend layer

The backend is developed using FastAPI. It exposes REST API endpoints for authentication, dashboard summary data, station crowd data, passenger trends, and congestion heatmap data.

### Authentication layer

JWT authentication is implemented. Two roles are created for Milestone 1:

- Admin
- Operator

### Data layer

SQLAlchemy is used as the ORM layer. The project runs with SQLite by default for easy local setup and can be switched to PostgreSQL using the `DATABASE_URL` environment variable.

### Dataset layer

The Delhi Metro dataset is loaded from CSV. The backend cleaning and seeding script prepares station and passenger flow records from the raw dataset.

## 3. User management module

The user management module provides login and role based access.

### Implemented users

| Username | Password | Role |
|---|---|---|
| admin | admin123 | admin |
| operator | operator123 | operator |

### Files used

```text
backend/app/auth.py
backend/app/routes/auth_routes.py
backend/app/models.py
backend/app/schemas.py
```

### Functionality

- Verifies username and password
- Creates JWT token
- Protects dashboard APIs
- Supports role based user structure

## 4. Dataset preparation and cleaning

The dataset is stored at:

```text
backend/data/delhi_metro_updated.csv
```

The dataset contains trip based passenger information with station names, travel date, fare, passenger count, ticket type, and travel remarks.

### Main columns used

```text
TripID
Date
From_Station
To_Station
Distance_km
Fare
Cost_per_passenger
Passengers
Ticket_Type
Remarks
```

### Cleaning steps

- Removed rows with missing date, station, or passenger values
- Trimmed station names
- Filled missing ticket type as `Unknown`
- Filled missing remarks as `normal`
- Converted numeric columns into valid numbers
- Created station records from unique source and destination station names
- Generated station capacity values for congestion percentage calculation

## 5. Crowd monitoring dashboard

The crowd monitoring dashboard displays:

- Total passengers
- Total trips
- Total stations
- Busiest station
- Passenger trend chart
- Ticket type split chart
- Passenger context by remarks
- Congestion heatmap
- Station wise crowd table

### Files used

```text
frontend/src/pages/Dashboard.jsx
frontend/src/components/StatCard.jsx
frontend/src/components/StationTable.jsx
frontend/src/components/HeatmapGrid.jsx
backend/app/services/crowd_service.py
backend/app/routes/dashboard_routes.py
```

## 6. Congestion tracking logic

The system calculates station congestion using passenger load and station capacity.

```text
Crowd Percentage = Current Station Load / Station Capacity * 100
```

### Congestion levels

| Crowd percentage | Status |
|---|---|
| 0 to 39.99 | Low |
| 40 to 69.99 | Moderate |
| 70 to 89.99 | High |
| 90 and above | Overcrowded |

## 7. Database schema

Milestone 1 uses three main tables.

### users

Stores admin and operator information.

### stations

Stores metro station name, line, and station capacity.

### passenger_flows

Stores trip level passenger movement details.

The detailed schema is provided in `docs/Database_Schema.md`.

## 8. API endpoints implemented

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/login | User login and JWT creation |
| GET | /api/auth/me | Get logged in user |
| GET | /api/dashboard/summary | Dashboard KPI cards and splits |
| GET | /api/dashboard/station-crowd | Station wise crowd status |
| GET | /api/dashboard/passenger-trend | Passenger trend chart |
| GET | /api/dashboard/heatmap | Congestion heatmap |
| GET | /api/stations | Station list |

## 9. UI wireframes

The UI planning includes:

- Login screen
- Dashboard overview
- KPI card section
- Trend chart section
- Congestion heatmap section
- Station wise table section

Detailed wireframes are provided in `docs/UI_Wireframes.md`.

## 10. Milestone 1 outcomes completed

- Project initialized with frontend and backend folders
- React frontend created
- FastAPI backend created
- JWT authentication implemented
- Admin and operator users created
- Dataset loading and cleaning implemented
- Crowd monitoring dashboard created
- Congestion tracking logic implemented
- Documentation added
- Postman collection added

## 11. Future scope

The following items are planned for upcoming milestones:

- Train scheduling workflows
- AI based passenger demand forecasting
- Frequency optimization
- Delay handling
- Alert and notification module
- Final deployment using Docker and cloud platform

## Submitted by

**Muni Pujitha Punugoti**
