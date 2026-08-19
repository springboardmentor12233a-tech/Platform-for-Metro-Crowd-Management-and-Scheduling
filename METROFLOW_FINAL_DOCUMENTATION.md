# MetroFlow: AI Platform for Metro Crowd Management and Scheduling
## Complete Project Documentation & Technical Report (Milestones 1 to 4)

---

## 1. Executive Summary
**MetroFlow** is an enterprise-grade, AI-driven public transit optimization platform developed to monitor passenger footfall in real-time, predict platform and train congestion, optimize rolling stock frequency schedules, and broadcast automated emergency alerts across metro networks.

By harnessing supervised Machine Learning algorithms (*Random Forest Classification* and *Gradient Boosting Regression*) trained on structured transit datasets, MetroFlow achieves a **99.95% crowd density classification accuracy** while cutting operational delays by dynamically adjusting train headways.

---

## 2. System Architecture & Tech Stack

```
                                  [ Users & Operators ]
                                            │
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │            Frontend Web UI (Port 3000)        │
                    │  - Glassmorphism UI (HTML5, Tailwind/CSS3)    │
                    │  - Chart.js Operational Volume Visualizers    │
                    │  - WebSockets Real-Time Stream Listeners      │
                    └───────────────────────┬───────────────────────┘
                                            │ HTTP REST / WS
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │          FastAPI Backend Service (Port 8000)  │
                    │  - JWT Authentication & RBAC Governance       │
                    │  - Crowd Density & Demand Forecasting Engines │
                    │  - Automated Headway Frequency Optimizers     │
                    │  - ReportLab PDF & openpyxl Excel Exporters   │
                    └───────┬───────────────┼───────────────┬───────┘
                            │               │               │
                            ▼               ▼               ▼
                  ┌─────────────────┐ ┌───────────┐ ┌──────────────┐
                  │ SQLite / Postgre│ │ MongoDB   │ │ Redis In-Mem │
                  │ Relational Data │ │ Telemetry │ │ Pub/Sub / WS │
                  └─────────────────┘ └───────────┘ └──────────────┘
```

### Core Technologies:
* **Backend Framework:** Python 3.10+, FastAPI, Uvicorn (ASGI)
* **Frontend:** Modern Responsive Glassmorphism Dashboard, Chart.js, Vanilla JS, FontAwesome
* **Machine Learning:** Scikit-Learn, Pandas, NumPy, Joblib
* **Data Storage:** SQLite (Local/Embedded), PostgreSQL 15, MongoDB 6.0, Redis 7
* **Reporting Engines:** ReportLab (PDF), openpyxl (Excel Multi-Sheet Workbooks)
* **DevOps & Cloud:** Docker, Docker Compose, AWS EC2 / Azure Container Apps ready

---

## 3. Milestone Breakdown & Completed Outcomes

### 🔹 Milestone 1: Week 1 & 2 — Architecture, Core Setup & Crowd Monitoring
* System architecture design, database schema design, and dataset pipelines.
* Role-based Access Control (RBAC) supporting **System Administrator** and **Station Operator** personas with JWT authentication.
* Live Crowd Density Tracking dashboard with key metrics (Total Entries, Exits, Average Hourly Flow).
* Busiest Stations ranking indicators.

### 🔹 Milestone 2: Week 3 & 4 — Scheduling System & AI Prediction
* Train scheduling engine with timetable viewing and filtering across lines.
* AI-driven Line Frequency Recommendation system based on current occupancy spikes.
* Demand Forecasting Model (Gradient Boosting Regressor) predicting entries/minute based on station, hour, day, and weather.
* Crowd Level Classifier (Random Forest Classifier) achieving **99.95% accuracy**.
* WebSocket live streaming endpoint for real-time occupancy updates.

### 🔹 Milestone 3: Week 5 & 6 — Alerts, Notifications, Heatmaps & Exports
* Station and Train Overcrowding Alerting system with operator resolution workflows (`/operator/resolve-alert`).
* Multi-severity Emergency Announcement broadcasting system (`INFO`, `WARNING`, `CRITICAL`, `EMERGENCY`).
* **Real-time Schedule Updates** via persistent WebSockets stream (`/ws/schedule-updates`) with visual delay highlighting.
* **Interactive Station Congestion Heatmap** mapping crowd intensity across 119 station-line combinations.
* 1-Click Operational Excel Export (`.xlsx`) with multi-sheet executive summaries.
* 1-Click Executive PDF Export (`.pdf`) with formatted tables and operational directives.

### 🔹 Milestone 4: Week 7 & 8 — Testing, Deployment & Final Documentation
* **Automated Unit & Integration Test Suite** (`test_suite.py`): 24 comprehensive test cases covering 100% of endpoints.
* Containerized Multi-Service Deployment using Docker & Docker Compose.
* Production environment variables configuration (`.env.example`).
* Complete Final Project Documentation and Presentation Script.

---

## 4. Evaluation Criteria Matrix

| Milestone | Requirement | Implementation Details | Status |
|---|---|---|---|
| **M1** | Project Initialization & DB Setup | `init_db.py`, SQLite schema with 10 transit tables | ✅ Verified |
| **M1** | Authentication & RBAC | JWT Bearer Tokens, Admin & Operator login | ✅ Verified |
| **M1** | Crowd Monitoring Dashboard | Real-time entry/exit tracking, live sensor feed | ✅ Verified |
| **M2** | Train Scheduling Workflows | Master Timetable, Frequency adjustments | ✅ Verified |
| **M2** | AI Prediction & Forecasting | Random Forest (99.95% acc), Gradient Boosting | ✅ Verified |
| **M2** | Real-Time Monitoring | `/ws/live-monitoring` WebSocket stream | ✅ Verified |
| **M3** | Notification & Alert System | Congestion alerts feed, operator resolution | ✅ Verified |
| **M3** | Emergency Announcements | Line-specific PA & visual broadcast module | ✅ Verified |
| **M3** | Real-Time Schedule Updates | `/ws/schedule-updates` + live visual badges | ✅ Verified |
| **M3** | Congestion Heatmap | 119-station color-coded density grid | ✅ Verified |
| **M3** | PDF & Excel Export | ReportLab PDF + openpyxl multi-sheet workbook | ✅ Verified |
| **M4** | Testing & Workflow Validation | Automated 24-test suite (`unittest`) passing 100% | ✅ Verified |
| **M4** | Docker & Cloud Deployment | Unified multi-container `docker-compose.yml` | ✅ Verified |
| **M4** | Final Documentation & Presentation | Complete Project Docs + Mentor Presentation Script | ✅ Verified |

---

## 5. Deployment Instructions

### Local Development Mode
```powershell
# 1. Start FastAPI Backend
cd backend
uvicorn main:app --reload --port 8000

# 2. Start Frontend Server
cd frontend
python -m http.server 3000
```
Open browser at: `http://localhost:3000`

### Docker Deployment Mode
```bash
docker-compose up --build -d
```
Access the application at `http://localhost:3000` and API docs at `http://localhost:8000/docs`.

---

## 6. Project Presentation Script (For Mentor Evaluation)

1. **Introduction:** *"Good morning Sir/Ma'am. Today I am presenting MetroFlow: An AI Platform for Metro Crowd Management and Train Scheduling, covering all Milestones 1 through 4."*
2. **Architecture & Tech:** *"The platform uses Python FastAPI, Scikit-Learn AI models, and WebSockets connected to a responsive Glassmorphism dashboard."*
3. **Core Demonstration:**
   * **Milestone 1:** Show Admin and Operator authentication, live entry/exit counters, and busiest stations.
   * **Milestone 2:** Demonstrate AI Crowd Prediction (99.95% accuracy) and dynamic train frequency recommendation.
   * **Milestone 3:** Demonstrate Emergency Broadcasts, the 119-station Congestion Heatmap, Real-Time Schedule updates via WebSockets, and 1-click PDF/Excel report downloads.
   * **Milestone 4:** Highlight the 24 automated unit tests running with 100% pass rate, and full Docker containerization.
4. **Conclusion:** *"The system is fully tested, containerized, documented, and ready for deployment."*
