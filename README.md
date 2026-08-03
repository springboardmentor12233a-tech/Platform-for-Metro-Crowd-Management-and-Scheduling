# MetroFlow: AI Platform for Metro Crowd Management and Scheduling

Submitted by: **Muni Pujitha Punugoti**

This repository contains the completed implementation for **Milestone 1, Milestone 2, and Milestone 3** of the Infosys Springboard Virtual Internship project.

## Completed scope

### Milestone 1: Project Initialization, Design Process and Core Setup

- Project objective and workflow planning
- React frontend setup
- Python FastAPI backend setup
- JWT authentication
- Admin and operator role-based access
- Crowd monitoring dashboard
- Congestion tracking and heatmap
- Database schema and documentation

### Milestone 2: Scheduling System and AI Prediction

- Train scheduling workflow
- Frequency adjustment recommendations
- Real-time operational monitoring
- AI crowd prediction using passenger dataset
- Passenger demand forecasting using Scikit-learn
- Traffic analysis report

### Milestone 3: Alerts, Notifications and Analytics

- Overcrowding and delay alerts
- Emergency announcement workflow
- Real-time schedule update view
- Analytics dashboard
- Congestion heatmaps
- Operational insights and reporting

## Tech stack used

- Frontend: React.js, Vite, Tailwind CSS, Recharts
- Backend: Python, FastAPI
- Authentication: JWT
- Database: SQLite for local demo, PostgreSQL-ready configuration
- Analytics and AI: Pandas, NumPy, Scikit-learn
- API testing: Swagger UI and Postman collection
- Version control: Git and GitHub

## Dataset used

The project uses the Delhi Metro ridership dataset file:

```text
backend/data/delhi_metro_updated.csv
```

Columns used:

```text
TripID, Date, From_Station, To_Station, Distance_km, Fare,
Cost_per_passenger, Passengers, Ticket_Type, Remarks
```


## Important note before running updated milestones

If you already ran the older Milestone 1 backend, delete the old database file before running this updated version:

```powershell
del backend\metroflow.db
```

If the file does not exist, ignore the message and continue. The new backend will create updated tables for scheduling, prediction, alerts, announcements, and analytics.

## How to run backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Open:

```text
http://127.0.0.1:8000/docs
```

## How to run frontend

Open a new terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Demo credentials

```text
Admin
username: admin
password: admin123

Operator
username: operator
password: operator123
```

## Main API groups

```text
/api/auth
/api/dashboard
/api/stations
/api/scheduling
/api/prediction
/api/alerts
/api/analytics
```

## GitHub branch

Use branch name:

```text
muni-pujitha
```

## Recommended commit message

```bash
git add .
git commit -m "Add Milestones 2 and 3 MetroFlow modules"
git push -u origin muni-pujitha
```
