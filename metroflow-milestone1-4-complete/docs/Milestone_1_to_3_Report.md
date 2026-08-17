# MetroFlow: AI Platform for Metro Crowd Management and Scheduling

## Milestone 1 to Milestone 3 Completion Report

Submitted by: **Muni Pujitha Punugoti**

## Project overview

MetroFlow is an AI-powered metro crowd management and scheduling platform. The platform helps metro authorities monitor passenger flow, analyze station congestion, forecast passenger demand, optimize train frequency, generate alerts, and view operational reports from a centralized dashboard.

The implementation uses passenger and transportation datasets instead of CCTV or computer vision. The selected dataset is the Delhi Metro ridership dataset containing trip, station, passenger, fare, ticket type, and traffic context details.

## Tools and technologies used

| Area | Technology |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS, Recharts |
| Backend | Python, FastAPI |
| Authentication | JWT authentication |
| Database | SQLite for local demo, PostgreSQL-ready SQLAlchemy setup |
| AI and Analytics | Pandas, NumPy, Scikit-learn |
| API Testing | Swagger UI, Postman collection |
| Version Control | Git and GitHub |

## Dataset used

The project uses `delhi_metro_updated.csv`. Important columns used are:

- TripID
- Date
- From_Station
- To_Station
- Distance_km
- Fare
- Cost_per_passenger
- Passengers
- Ticket_Type
- Remarks

The dataset is loaded into the backend database during application startup. The system uses station and passenger flow fields to calculate station load, passenger trend, congestion percentage, ticket split, and traffic context analysis.

## Milestone 1: Project initialization, design process and core setup

### Completed work

1. Created a complete project structure with separate frontend, backend, documentation, dataset, and Postman folders.
2. Set up the backend using Python FastAPI.
3. Set up the frontend using React.js and Tailwind CSS.
4. Implemented JWT authentication.
5. Added Admin and Operator users.
6. Implemented role-aware dashboard access.
7. Imported Delhi Metro dataset into the backend.
8. Built crowd monitoring dashboard.
9. Added passenger trend chart, ticket type split, congestion heatmap, and station-wise crowd table.
10. Prepared architecture, database schema, API guide, and milestone documentation.

### Milestone 1 result

The system successfully supports authentication, role-based access, passenger density tracking, station-wise crowd monitoring, and congestion status display.

## Milestone 2: Scheduling system and AI prediction

### Completed work

1. Implemented train scheduling workflow.
2. Added train schedule records with train number, line, source, destination, departure time, arrival time, delay status, and frequency.
3. Added frequency adjustment recommendations based on station crowd level.
4. Added real-time operational monitoring metrics.
5. Built AI demand forecasting workflow using Scikit-learn Linear Regression.
6. Added passenger demand forecast for future dates.
7. Added station-level prediction and risk recommendation.
8. Added traffic analysis report based on passenger context such as peak, off-peak, weekend, festival, normal, and maintenance.

### Milestone 2 result

The system now supports train schedule management, delay handling, frequency recommendations, passenger demand forecasting, and traffic analysis reports.

## Milestone 3: Alerts, notifications and analytics

### Completed work

1. Implemented alert workflow for crowd and delay conditions.
2. Added overcrowding and delay alerts.
3. Added emergency announcement workflow.
4. Added real-time operational update API.
5. Built analytics dashboard for passenger traffic and station performance.
6. Added operational insight generation.
7. Integrated congestion heatmap with analytics report.
8. Added alert, announcement, update, and analytics sections in the React dashboard.

### Milestone 3 result

The platform now supports alert notifications, emergency announcements, real-time schedule updates, analytics reports, congestion heatmaps, and AI-based operational insights.

## Main backend API modules

| API Group | Purpose |
|---|---|
| /api/auth | Login and user authentication |
| /api/dashboard | Crowd monitoring dashboard |
| /api/stations | Station list and search |
| /api/scheduling | Train schedules and frequency optimization |
| /api/prediction | AI demand forecasting and traffic reports |
| /api/alerts | Alerts, announcements, real-time updates |
| /api/analytics | Analytics dashboard and operational insights |

## Login credentials

| Role | Username | Password |
|---|---|---|
| Admin | admin | admin123 |
| Operator | operator | operator123 |

## Final outcome

Milestones 1, 2, and 3 have been completed in a ready-to-run MetroFlow application. The project includes frontend, backend, dataset, APIs, analytics logic, AI prediction logic, alerts, documentation, and GitHub submission steps.

## Submitted by

Muni Pujitha Punugoti
