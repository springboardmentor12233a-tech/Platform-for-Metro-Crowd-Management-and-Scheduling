# MetroFlow: AI Platform for Metro Crowd Management and Scheduling

Milestone 1 project submitted by **Muni Pujitha Punugoti** for the Infosys Springboard Virtual Internship.

This project implements the Week 1 and Week 2 milestone scope:

- React frontend setup
- FastAPI backend setup
- JWT based authentication
- Admin and operator roles
- Crowd monitoring dashboard
- Station wise congestion tracking
- Dataset loading from Delhi Metro passenger data
- Architecture, database schema, UI wireframes, and milestone report

## Selected dataset

Dataset used for Milestone 1:

```text
Delhi Metro Dataset - EDA & Data Visualization
```

The dataset file is included at:

```text
backend/data/delhi_metro_updated.csv
```

Columns used:

```text
TripID, Date, From_Station, To_Station, Distance_km, Fare, Cost_per_passenger, Passengers, Ticket_Type, Remarks
```

## Folder structure

```text
metroflow-milestone1/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   ├── seed.py
│   │   ├── routes/
│   │   └── services/
│   ├── data/
│   │   └── delhi_metro_updated.csv
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── docs/
├── postman/
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Backend setup

Open a terminal inside the project folder.

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

Windows PowerShell:

```bash
venv\Scripts\activate
```

Mac or Linux:

```bash
source venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Run the backend.

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger API docs:

```text
http://127.0.0.1:8000/docs
```

The backend automatically creates a local SQLite database named `metroflow.db` and imports a sample from the Delhi Metro dataset on first run.

## Frontend setup

Open a second terminal.

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

## Demo login credentials

Admin:

```text
Username: admin
Password: admin123
```

Operator:

```text
Username: operator
Password: operator123
```

## GitHub branch commands

Use the branch name decided for this project:

```bash
git checkout -b muni-pujitha
git add .
git commit -m "Add Milestone 1 MetroFlow project setup"
git push -u origin muni-pujitha
```

## Milestone 1 deliverables included

- Working React UI
- Working FastAPI API
- Authentication and role based access
- Crowd monitoring dashboard
- Congestion status logic
- Dataset loading script
- Architecture documentation
- Database schema documentation
- UI wireframes
- Milestone 1 report
- Postman collection

## Notes

This milestone intentionally focuses on initialization, authentication, dashboard, and congestion tracking. Scheduling optimization, AI forecasting, alerts, cloud deployment, and Docker deployment are prepared structurally, but they belong to later milestones.
