# AI MetroFlow: AI Platform for Metro Crowd Management and Scheduling

[![Python](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react)](https://reactjs.org/)
[![AI Engine](https://img.shields.io/badge/AI-Scikit--Learn%20%7C%20TensorFlow-FF6F00?logo=tensorflow)](https://tensorflow.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20MongoDB%20%7C%20Redis-4169E1)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?logo=docker)](https://www.docker.com/)

**AI MetroFlow** is an enterprise-grade AI-powered metro crowd management, train scheduling optimization, and emergency analytics platform built strictly according to the project specifications up to **Milestone 3**.

---

## 🚀 Key Modules & Milestone Features

### Milestone 1: Week 1 & 2 — Project Initialization & Core Operations
- **Authentication & RBAC**: JWT Bearer token security with Role-Based Access Control (`admin` and `operator`).
- **Live Crowd Monitoring**: Real-time station entry/exit density tracking, net flow calculation, and station footfall ranking.
- **Congestion Tracking**: Dynamic threshold calculation triggering overcrowding warnings and critical bottleneck alerts.
- **Database Engine**: Dual-layer architecture for PostgreSQL, MongoDB, Redis, with seamless automatic SQLite/In-memory fallback for zero-dependency standalone execution.

### Milestone 2: Week 3 & 4 — Scheduling System & AI Prediction Engine
- **Train Schedule Management**: Interactive master train timetable viewer and search filter by metro line.
- **AI-Guided Headway Optimization**: Automated line occupancy analysis delivering real-time train frequency increase/maintain recommendations.
- **Delay Incident Management**: Operator delay logging tool with cause tracking and average delay statistics.
- **AI Passenger Demand Forecasting**: Machine Learning models (`GradientBoostingRegressor` and `RandomForestClassifier`) predicting entries/min, crowd risk level, and required train frequency with **99.95% classifier accuracy**.
- **Real-Time Live Feed**: WebSocket stream broadcasting live passenger counts and system operational health.

### Milestone 3: Week 5 & 6 — Emergency Announcements, Analytics & Export
- **Emergency Broadcast System**: Broadcast tool for operators/admins to push system-wide or line-specific emergency notices (`INFO`, `WARNING`, `CRITICAL`, `EMERGENCY`).
- **Operational Analytics Dashboard**: Interactive charts displaying passenger volume by metro line and hourly entry profiles.
- **Multi-Format Report Export**: One-click **PDF Export** (styled executive report via `ReportLab`) and **Excel Export** (multi-sheet operational workbook via `openpyxl`).
- **Executive AI Guidance**: Strategic operational directives generated for bottleneck mitigation and platform safety.

---

## 🛠️ Project Structure

```
Platform-for-Metro-Crowd-Management-and-Scheduling/
├── backend/
│   ├── data/                      # Synthetic transportation & ridership CSV datasets
│   ├── models/                    # Saved trained AI model binaries & metrics.json
│   ├── database.py                # Database connection manager (PG/Mongo/Redis + SQLite fallback)
│   ├── export_utils.py            # ReportLab PDF & openpyxl Excel export generators
│   ├── init_db.py                 # DB table creation & dataset importer script
│   ├── main.py                    # Main FastAPI Application REST & WebSocket Endpoints
│   ├── predict.py                 # AI Inference Engine for demand & crowd levels
│   ├── requirements.txt           # Python dependencies
│   └── train_model.py             # ML model training script
├── frontend/
│   ├── app.js                     # Core Frontend UI state, API calls, and chart rendering
│   ├── index.html                 # Modern Glassmorphic Dashboard UI
│   └── package.json               # Frontend dependencies
├── docker-compose.yml             # Docker multi-container orchestrator
├── Dockerfile                     # Backend container build script
├── .env.example                   # Environment configuration template
└── README.md                      # Project Documentation
```

---

## 💻 Quick Start Guide

### 1. Standalone Local Execution (Zero-Setup)

#### Backend Setup:
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Initialize database & import 10 transportation datasets
python init_db.py

# Train AI models
python train_model.py

# Launch FastAPI Backend
uvicorn main:app --reload --port 8000
```
Backend API will be accessible at: `http://127.0.0.1:8000`  
Swagger API Documentation: `http://127.0.0.1:8000/docs`

#### Frontend Setup:
Simply open `frontend/index.html` in any web browser, or serve it using any HTTP server:
```bash
cd frontend
python -m http.server 3000
```
Open `http://localhost:3000` in your browser.

---

### 2. Default Login Credentials

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Station Operator** | `operator` | `operatorpassword` | Resolve Alerts, Adjust Headway, Log Delays, Emergency Broadcasts |
| **System Admin** | `admin` | `adminpassword` | Full Control, Operator Directory Management, Analytics Export |

---

### 3. Docker Compose Deployment

To launch PostgreSQL, MongoDB, Redis, and the FastAPI Backend in containerized mode:
```bash
docker-compose up --build -d
```

---

## 📊 Performance Metrics

- **Crowd Level Classifier Accuracy**: `99.95%`
- **Passenger Demand Predictor MAE**: `41.95 entries/min`
- **API Response Latency**: `< 15ms`
- **WebSocket Streaming Speed**: Real-time push updates every `4` seconds

---

## 📜 License
This project is developed for Metro Crowd Management & Scheduling under Smart Transportation Guidelines.
