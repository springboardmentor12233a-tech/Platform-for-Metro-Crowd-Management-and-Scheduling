# AI MetroFlow – AI Metro Crowd Management & Scheduling Platform

AI MetroFlow is a production-ready, high-fidelity crowd intelligence and train dispatch scheduling platform designed for metropolitan rapid transit networks. By combining a **Python FastAPI** backend, a **MongoDB** database, **WebSockets**, and a **React + Vite** frontend (visualized via **Leaflet Maps** and **Recharts**), the system enables operators to manage timetables, predict congestion trends, monitor crowd inflows/outflows, and resolve delays in real-time.

---

## 🏗️ Project Folder Structure

```text
AI_MetroFlow/
├── datasets/                   # Raw CSV datasets
│   ├── Delhi-Metro-Network.csv
│   └── delhi_metro_updated.csv
│   └── public_transport_delays.csv
├── ml/                         # Machine Learning pipeline
│   ├── train_models.py         # Data cleaning & training script
│   └── models/                 # Saved joblib models & metrics JSON
├── backend/                    # Python FastAPI service
│   ├── main.py                 # Application entrypoint
│   ├── config.py               # Env configurations
│   ├── database.py             # Motor client & csv database seeder
│   ├── auth.py                 # Hashing & JWT role checks
│   ├── models/                 # Pydantic schemas (User, Station, Train, etc.)
│   └── routers/                # API route handlers
├── frontend/                   # React Vite application
│   ├── src/
│   │   ├── components/         # Map, Sidebar, Navbar, Card, Guards
│   │   ├── context/            # Auth, Theme, WebSockets contexts
│   │   ├── pages/              # Dashboard, Map page, Scheduling, AI, Reports, CRUD
│   │   ├── services/           # Axios instance configuration
│   │   ├── index.css           # Tailwind v4 globals & theme colors
│   │   └── App.jsx             # Router and page mappings
│   ├── vite.config.js          # Vite configurations
│   └── index.html              # Main HTML mounting fonts & Leaflet CDNs
├── Dockerfile.backend          # Backend Docker compilation
├── Dockerfile.frontend         # Frontend Docker compilation
├── nginx.conf                  # Nginx production proxy rules
├── docker-compose.yml          # Container orchestrator
├── requirements.txt            # Python dependencies
└── README.md                   # Setup and Deployment Guide
```

---

## ⚡ Key Features

- **JWT Authentication & RBAC**: Roles for `Admin`, `Metro Operator`, and `Analyst` with restricted endpoint scopes.
- **Real-Time Map Operations**: Leaflet maps displaying metro line polyline shapes, glowing, color-coded stations indicating crowd occupancy (Green, Yellow, Orange, Red), and moving trains.
- **WebSocket Streaming**: Async WebSocket loop at `/api/crowd/ws` broadcasting live station counts, train locations, and alert events.
- **AI Forecasting**: Random Forest models trained on Delhi Metro datasets to predict passenger group sizes and delay minutes based on traffic index, weather, and calendar dates.
- **Operations Scheduling**: Platform assignment, delay time log adjustments, and a frequency optimizer calculating headway recommendations for peak/off-peak windows.
- **Analytics Export**: Compile reports of delays, occupancy ratios, and congestion trends, exporting them as CSV, Excel (`.xlsx`), or PDF documents.
- **Automated Alerts**: Automated triggers mapping Red-level stations or severe train delays, publishing live toast notifications to console clients.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /register`: Registers a new staff account (name, email, password, role).
- `POST /login`: Validates credentials (username/password), returns JWT token.
- `GET /profile`: Retrieves logged-in user profile details.
- `PUT /profile`: Updates profile details or theme/language preferences.
- `POST /change-password`: Changes password.
- `GET /users` (Admin only): Lists all registered staff users.
- `PUT /users/{id}/status` (Admin only): Toggles user account state (Active/Inactive).
- `DELETE /users/{id}` (Admin only): Deletes a user account.

### Stations (`/api/stations`)
- `GET /`: Lists all stations (supports search, line filter, status filter, and pagination).
- `GET /{id}`: Retrieves details for a specific station.
- `POST /` (Admin only): Creates a new station record.
- `PUT /{id}` (Admin/Operator): Updates station details.
- `DELETE /{id}` (Admin only): Deletes a station.

### Trains (`/api/trains`)
- `GET /`: Lists trains (supports search, status filter, and pagination).
- `GET /{id}`: Retrieves train details.
- `POST /` (Admin only): Registers a new train in the fleet.
- `PUT /{id}` (Admin/Operator): Edits train capacity, name, or service status.
- `DELETE /{id}` (Admin only): Deletes a train record.

### Schedules & Timetables (`/api/schedules`)
- `GET /`: Lists all schedules (supports filters for train, station, route, status).
- `GET /{id}`: Retrieves specific schedule details.
- `POST /` (Admin only): Creates a timetable entry.
- `PUT /{id}` (Admin/Operator): Edits platforms, logs delays, or updates status.
- `DELETE /{id}` (Admin only): Deletes a schedule entry.
- `POST /optimize-frequency` (Admin/Operator): Recommends optimal train headway schedules based on route demand.

### AI Predictions (`/api/predictions`)
- `GET /metrics` (Analyst/Admin): Returns trained models performance summaries (MAE, RMSE, confusion matrix, feature importances).
- `POST /demand` (Analyst/Admin): Predicts passenger demand group size.
- `POST /delay` (Analyst/Admin): Forecasts trip delay probabilities and duration.

### Alerts (`/api/alerts`)
- `GET /`: Lists alerts log history.
- `POST /` (Admin/Operator): Publishes an alert event, broadcasting it immediately over WebSockets.
- `PUT /{id}` (Admin/Operator): Resolves an active alert and logs operational notes.
- `DELETE /{id}` (Admin only): Deletes an alert entry.

### Reports & Export (`/api/reports`)
- `GET /generate` (Analyst/Admin): Compiles logs and streams downloads for `.csv`, `.xlsx`, or `.pdf` formats.

---

## 🚀 Local Development Setup

### Prerequisite
Ensure **Python 3.10+**, **Node.js v18+**, and **MongoDB** are installed and running locally.

### Step 1: Clone and Setup ML Models
First, install dependencies and pre-train the Random Forest classifiers:
```bash
pip install -r requirements.txt
python ml/train_models.py
```
*This output files `demand_model.pkl`, `delay_classifier.pkl`, `delay_regressor.pkl`, and `metrics.json` under `ml/models/`.*

### Step 2: Start the FastAPI Backend
Start the uvicorn development server:
```bash
# Set environment variables if needed: MONGO_URI
uvicorn backend.main:app --reload --port 8000
```
*Note: On startup, the backend automatically seeds default users, stations from Delhi-Metro-Network.csv, routes, mock trains, and initial timetable records if the database is blank.*
- Default accounts:
  - **Admin**: `admin@metroflow.com` (password: `admin123`)
  - **Operator**: `operator@metroflow.com` (password: `operator123`)
  - **Analyst**: `analyst@metroflow.com` (password: `analyst123`)

### Step 3: Run the React Frontend
Open another terminal pane, install Node dependencies, and start Vite:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🐳 Docker Deployment (Recommended)

To run the entire ecosystem (MongoDB, FastAPI backend, React frontend) with a single command:
```bash
docker-compose up --build
```
Access the application on:
- Frontend Client: `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/docs`

---

## ☁️ Railway Deployment Guide

To deploy AI MetroFlow to [Railway](https://railway.app):

### Step 1: Provision MongoDB
1. Open the Railway Console and click **New Project**.
2. Select **Provision MongoDB**. This will start a MongoDB Atlas/Cloud container and configure the internal variable `MONGODB_URL`.

### Step 2: Deploy the FastAPI Backend
1. Click **New Service** -> **GitHub Repo** and select the clone of this repository.
2. In the Service settings, configure variables:
   - `MONGO_URI`: Reference Railway's connection string: `${{MONGODB_URL}}`
   - `DATABASE_NAME`: `metroflow_db`
   - `JWT_SECRET`: Generate a random hash
   - `PORT`: `8000`
3. Under the build options, ensure the **Build Command** runs `python ml/train_models.py` or specify the Dockerfile:
   - Select **Dockerfile** and configure it to use `Dockerfile.backend`.

### Step 3: Deploy the React Frontend
1. Add another GitHub service pointing to the same repository.
2. In the settings, select **Dockerfile** and configure it to use `Dockerfile.frontend`.
3. Set service variables if needed.
4. Expose the frontend container port (port `80` inside the Nginx container) by adding a custom domain or clicking **Generate Domain** in the settings. Nginx will handle proxying all `/api/` calls internally to the backend!
