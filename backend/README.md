# MetroFlow Backend - Milestones 1 to 3

FastAPI backend for MetroFlow, an AI Metro Crowd Management and Scheduling Platform.

## Completed modules

- Milestone 1: JWT login, admin/operator roles, station crowd dashboard APIs, congestion heatmap APIs.
- Milestone 2: train schedule APIs, frequency recommendation APIs, real-time operational monitoring APIs, AI demand forecasting APIs, traffic report APIs.
- Milestone 3: alert APIs, emergency announcement APIs, real-time update APIs, analytics report APIs, operational insight APIs.

## Run backend

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

## Login credentials

```text
Admin: admin / admin123
Operator: operator / operator123
```

## Dataset

The backend imports `backend/data/delhi_metro_updated.csv` during startup and creates a local SQLite database named `metroflow.db`.

If you change models or want fresh data, stop the server and delete `metroflow.db`, then run the backend again.
