# MetroFlow — AI Platform for Metro Crowd Management & Scheduling

MetroFlow (MetroVision) is an AI-powered metro crowd management and scheduling platform that helps metro authorities monitor passenger flow, predict crowd density, and optimize train scheduling in real time. It analyzes passenger traffic patterns, station congestion, train occupancy, ticketing data, and peak-hour demand to reduce overcrowding and improve operations.

The platform integrates a **FastAPI (Python) backend**, a **React + Tailwind CSS frontend**, **PostgreSQL/MongoDB/Redis** data layer, and an **AI analytics engine** (with Gemini-based assistant) into a single control-room style operations dashboard.

> ✅ **Project Status: COMPLETE** — All 4 milestones (Weeks 1–8) have been implemented, tested, and deployed.

---

## Table of Contents

- [Objective](#objective)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Modules Implemented](#modules-implemented)
- [Milestone Summary](#milestone-summary)
  - [Milestone 1 — Project Initialization, Design & Core Setup](#milestone-1-week-1--2--project-initialization-design-process--core-setup)
  - [Milestone 2 — Scheduling System & AI Prediction](#milestone-2-week-3--4--scheduling-system--ai-prediction)
  - [Milestone 3 — Alerts, Notifications & Analytics](#milestone-3-week-5--6--alerts-notifications--analytics)
  - [Milestone 4 — Testing, Deployment & Documentation](#milestone-4-week-7--8--testing-deployment--documentation)
- [Evaluation Criteria — Status](#evaluation-criteria--status)
- [Performance Metrics](#performance-metrics)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Design System](#design-system)
- [Data Sources & AI Training Datasets](#data-sources--ai-training-datasets)
- [Future Scope](#future-scope)
- [License & Acknowledgements](#license--acknowledgements)

---

## Objective

Build an AI-powered metro crowd management and scheduling platform that:

- Monitors passenger flow and predicts crowd density in real time
- Optimizes train scheduling and frequency during peak hours
- Analyzes passenger traffic patterns, station congestion, train occupancy, ticketing data, and peak-hour demand
- Integrates AI analytics, scheduling automation, crowd prediction, and operational monitoring into one centralized application
- Applies to metro rail systems, smart city transportation, urban mobility management, and public transit optimization

The platform **does not use computer vision or CCTV image processing** — all crowd and demand modeling is driven by ticketing, sensor, and operational datasets.

---

## Architecture

```
                         USER INTERFACE (Web / Mobile App)
   Dashboard | Live Monitoring | Train Status | Schedules | Operators | Alerts | Analytics | Settings
                                        │
                         API GATEWAY LAYER (FastAPI)
        Routing | JWT Authentication | Request Filtering | Rate Limiting | Security Validation
                                        │
                        BACKEND SERVICES (FastAPI)
 ┌───────────────┬────────────────┬─────────────────┬───────────────┬──────────────────┐
 │ Crowd          │ Scheduling     │ AI Prediction    │ Alert         │ Analytics        │
 │ Monitoring     │ Service        │ Service          │ Service       │ Service          │
 │ Service        │                │                  │               │                  │
 └───────────────┴────────────────┴─────────────────┴───────────────┴──────────────────┘
                                        │
              TRANSPORTATION ANALYTICS & PREDICTION ENGINE (Python)
        ML Models | Demand Forecasting | Traffic Pattern Analysis | Schedule Optimization | Anomaly Detection
                                        │
                          DATA & STORAGE LAYER
        PostgreSQL | MongoDB | Redis (cache) | Time Series DB | Analytics Data Store
                                        │
                              INFRASTRUCTURE
        Docker | Kubernetes | Cloud (AWS/Azure) | Monitoring | Backup & Recovery
```

External integrations: Email service, SMS service, mobile push notifications, public address system, and third-party transit APIs.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Vite, Tailwind CSS, Framer Motion, Recharts, Axios, React Router, Lucide React |
| **Backend** | Python, FastAPI, Uvicorn, Pydantic |
| **Database** | PostgreSQL, MongoDB, Redis |
| **AI & Analytics** | TensorFlow, Scikit-learn, Pandas, NumPy, Google Gemini (AI Assistant) |
| **Real-time** | Socket.IO |
| **Auth** | JWT Authentication, Role-Based Access Control (RBAC) |
| **Dev & Deployment** | VS Code, Git + GitHub, Docker & Docker Compose, AWS / Azure, Postman |

---

## Modules Implemented

1. **User Management Module** — Admin/operator login, RBAC (`require_roles` dependency across ~15 backend routers), profile management, soft-delete/deactivation with audit history preserved.
2. **Crowd Monitoring Module** — Passenger density tracking from ticketing/sensor datasets, congestion monitoring, station-wise analytics, inflow/outflow analysis.
3. **Scheduling Management Module** — Train schedule management, peak-hour optimization, frequency adjustment, delay handling.
4. **AI Prediction Module** — Crowd prediction models, passenger demand forecasting, traffic pattern analysis, smart recommendations via Gemini-powered `AIAssistant` with dashboard context passing.
5. **Alert & Notification Module** — Overcrowding alerts, delay notifications, emergency announcements, real-time updates.
6. **Analytics Dashboard Module** — Passenger traffic analytics, station performance reports, operational monitoring, AI prediction insights, Activity Logs with pagination/filtering/sorting/CSV export/date-range filtering and a details drawer.

---

## Milestone Summary

### Milestone 1 (Week 1 & 2) — Project Initialization, Design Process & Core Setup ✅

- Defined project objectives and transportation workflows
- Designed system architecture and database schema
- Created UI wireframes and operational workflow planning
- Set up frontend and backend environments
- Implemented authentication and role-based access system (JWT + RBAC)
- Built the crowd monitoring dashboard
- Developed congestion tracking features

**Outcomes:** Working authentication, functional crowd monitoring dashboard, established architecture and DB design.

### Milestone 2 (Week 3 & 4) — Scheduling System & AI Prediction ✅

- Implemented train scheduling workflows
- Developed frequency adjustment system
- Added real-time operational monitoring
- Built crowd prediction models using passenger datasets
- Trained passenger demand forecasting algorithms
- Generated traffic analysis reports

**Outcomes:** Functional AI prediction & forecasting system, real-time crowd prediction insights, scheduling and operational monitoring live.

### Milestone 3 (Week 5 & 6) — Alerts, Notifications & Analytics ✅

- Implemented notification and alert workflows
- Built emergency announcement system
- Added real-time schedule update features
- Developed analytics and reporting dashboards
- Generated congestion heatmaps and operational insights
- Built the full dark control-room design system across `KPICard`, `StationStatusTable`, `LiveAlertPanel`, `StationCard`, `MetroNetworkMap`, `LiveIncidentTimeline`
- Built Activity Logs page (pagination, filtering, sorting, CSV export, date range filter, details drawer)

**Outcomes:** Real-time communication/alert systems live, transportation analytics and reporting complete, AI insight generation integrated.

### Milestone 4 (Week 7 & 8) — Testing, Deployment & Documentation ✅

- Performed application testing and workflow validation
- Improved UI responsiveness and system optimization (component-level bug fixes, Rules-of-Hooks fixes, Tailwind v4 dynamic class fixes)
- Deployed platform using Docker and cloud environments
- Prepared final project documentation and presentation
- Demonstrated the complete MetroFlow platform end-to-end

**Outcomes:** Full deployment and testing experience gained, platform stability and usability improved, live demonstration completed, professional documentation delivered.

---

## Evaluation Criteria — Status

| Milestone | Criteria | Status |
|---|---|---|
| **Milestone 1 (Week 2)** | Project initialization & architecture setup | ✅ Completed |
| | Authentication & operator management | ✅ Implemented |
| | Crowd monitoring dashboard | ✅ Functional |
| | System design & UI planning | ✅ Completed |
| **Milestone 2 (Week 4)** | Train scheduling workflows | ✅ Implemented |
| | AI prediction & forecasting system | ✅ Functional |
| | Traffic analysis reports | ✅ Generated |
| | Real-time monitoring | ✅ Integrated |
| **Milestone 3 (Week 6)** | Notification & alert system | ✅ Implemented |
| | Analytics dashboard & congestion heatmaps | ✅ Functional |
| | Operational reporting workflows | ✅ Working |
| | AI insights & recommendations | ✅ Integrated |
| **Milestone 4 (Week 8)** | Fully deployed frontend & backend | ✅ Deployed |
| | Testing & validation | ✅ Completed |
| | Documentation & presentation | ✅ Prepared |
| | End-to-end platform demonstration | ✅ Successful |

---

## Performance Metrics

**Crowd Monitoring:** passenger density estimation accuracy, congestion prediction accuracy, real-time update latency
**Scheduling:** schedule optimization efficiency, delay reduction rate, train frequency recommendation accuracy
**AI Prediction:** crowd forecasting accuracy, passenger demand forecasting accuracy, peak-hour prediction accuracy
**System:** API response time, concurrent monitoring handling, database query performance

---

## Project Structure

```
MetroFlow
│
├── backend
│   ├── api
│   │   ├── auth/            # JWT, password reset, RBAC (require_roles)
│   │   ├── users/           # profile, soft-delete/deactivation, activity logs
│   │   ├── crowd/           # crowd monitoring endpoints
│   │   ├── scheduling/      # train scheduling endpoints
│   │   ├── prediction/      # AI prediction & Gemini assistant
│   │   ├── alerts/          # alert & notification endpoints
│   │   └── analytics/       # dashboard/analytics endpoints
│   ├── data
│   ├── services
│   ├── main.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── KPICard.jsx
│   │   │   ├── StationStatusTable.jsx
│   │   │   ├── LiveAlertPanel.jsx
│   │   │   ├── StationCard.jsx
│   │   │   ├── MetroNetworkMap.jsx
│   │   │   ├── LiveIncidentTimeline.jsx
│   │   │   ├── AIAssistant.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   └── ActivityLogs.jsx
│   │   ├── layout/
│   │   └── assets/
│   ├── package.json
│   └── vite.config.js
│
├── datasets
├── README.md
└── .gitignore
```

---

## Installation & Setup

### Clone Repository

```bash
git clone <repository-url>
cd MetroFlow
```

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on **http://localhost:8000**

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## API Endpoints

| Endpoint | Description |
|---|---|
| `/auth/login` | Operator/admin login (JWT) |
| `/auth/reset-password` | Password reset flow |
| `/users/profile` | Profile management |
| `/users/activity-logs` | Paginated activity logs with filters/CSV export |
| `/dashboard/summary` | Dashboard KPI summary |
| `/dashboard/passenger-trend` | Passenger trend |
| `/crowd/density` | Real-time passenger density |
| `/crowd/heatmap` | Congestion heatmap data |
| `/scheduling/trains` | Train schedule management |
| `/scheduling/frequency` | Peak-hour frequency adjustment |
| `/prediction/crowd-forecast` | AI crowd prediction |
| `/prediction/demand-forecast` | Passenger demand forecasting |
| `/alerts` | Overcrowding / delay / emergency alerts |
| `/analytics/reports` | Station performance & operational reports |

---

## Design System

Dark "control-room" visual theme applied across the platform:

| Token | Value | Usage |
|---|---|---|
| Teal | `#2DD4BF` | Primary accents, healthy status |
| Amber | `#F5B942` | Warnings, delay indicators |
| Rose | `#F2545B` | Critical alerts, overcrowding |
| Background | `#10141C` | App background |

---

## Data Sources & AI Training Datasets

> The platform does **not** use computer vision or CCTV image processing. All crowd monitoring and forecasting is trained on transportation and operational passenger data.

- **Passenger Datasets:** Smart card/ticketing data, passenger entry & exit records, station footfall, metro ridership
- **Transportation Datasets:** Train GPS/status, train occupancy, schedule & delay logs, peak-hour traffic
- **Public Transportation Datasets:** Open transit data, smart city mobility datasets, government transportation statistics, urban mobility research datasets

**AI Model Applications:** crowd monitoring (density estimation, congestion analysis), demand forecasting (passenger demand, peak-hour forecasting), scheduling optimization (frequency recommendations, delay impact prediction, resource utilization).

---

## Future Scope

- Route recommendation engine
- Deeper delay-impact prediction models
- Live third-party transit API integration
- Expanded cloud auto-scaling (Kubernetes-based)
- Mobile app companion for operators

---

## License & Acknowledgements

This project was developed for academic and educational purposes.

**Acknowledgements:** FastAPI · React · Recharts · Tailwind CSS · TensorFlow · PostgreSQL · MongoDB · Google Gemini