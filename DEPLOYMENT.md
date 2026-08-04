# MetroFlow AI: Deployment & Setup Guide

This guide details running MetroFlow AI locally or inside container environments.

---

## 🔑 Demo Access Credentials

To review the command center, register a new account on the landing page or use the following pre-provisioned demo operator access codes. They will automatically seed on the first signin attempt:

*   **System Administrator (admin)**:
    *   *Email*: `admin@metroflow.ai`
    *   *Password*: `admin123`
*   **Traffic Manager (manager)**:
    *   *Email*: `manager@metroflow.ai`
    *   *Password*: `manager123`
*   **Passenger Observer (user)**:
    *   *Email*: `user@metroflow.ai`
    *   *Password*: `user123`

---

## 🐳 Option 1: Docker Compose (Recommended)

To run the entire database, cache, backend, and frontend stack in isolated containers:

### 1. Configure Environmental Grounding
Ensure `docker-compose.yml` environment matches, and optionally place your Grok API variables in `backend/.env` or export them:
```bash
export XAI_API_KEY="your-grok-api-key"
export XAI_MODEL="grok-2-1212"
```

### 2. Build & Launch Containers
```bash
docker-compose up --build
```
This starts:
- **PostgreSQL** on port `5432`
- **MongoDB** on port `27017`
- **Redis** on port `6379`
- **FastAPI backend** on `http://localhost:5000`
- **Next.js frontend** on `http://localhost:3000`

---

## 🛠️ Option 2: Local Native Execution (Development)

### Prerequisites
1. **PostgreSQL** running locally with a database named `metroflow`.
2. **MongoDB** running locally.
3. **Redis** running locally (or unconfigured, the app falls back cache-free).

### 1. Seeding the Databases
Navigate to `backend` and run the data importer:
```bash
cd backend
# Activate virtual environment
.\venv\Scripts\activate
# Seed database schemas and records (Delhi Metro datasets)
python etl/import_passenger_data.py
```

### 2. Running the FastAPI Server
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload
```
API docs are available at `http://localhost:5000/docs`.

### 3. Launching Next.js UI Console
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to interact with the Operations Command Center.
