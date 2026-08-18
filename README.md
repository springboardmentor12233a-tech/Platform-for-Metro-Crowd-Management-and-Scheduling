# AI MetroFlow – AI Metro Crowd Management & Scheduling Platform

AI MetroFlow is a production-ready, high-fidelity crowd intelligence and train dispatch scheduling platform designed for metropolitan rapid transit networks (specifically Delhi Metro). By combining a Python FastAPI backend, a MongoDB database, WebSockets, and a React + Vite frontend (visualized via Leaflet Maps and Recharts), the system enables operators to manage timetables, predict congestion trends, monitor crowd inflows/outflows, and resolve delays in real-time.

---

 ## Project Folder Structure

```
AI_MetroFlow/
├── datasets/                   # Raw CSV datasets
│   ├── Delhi-Metro-Network.csv
│   ├── delhi_metro_updated.csv
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
│   │   ├── components/         # Map, Sidebar, Navbar, Guards
│   │   ├── context/            # Auth, Theme, WebSockets contexts
│   │   ├── pages/              # Dashboard, Map, Scheduling, AI, Reports, Users
│   │   ├── services/           # Axios instance configuration
│   │   ├── index.css           # Tailwind & theme colors
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

##  Key Features

- **JWT Authentication & RBAC**: Roles for `Admin`, `Operator`, and `Analyst` with restricted endpoint scopes.
- **Real-Time Map Operations**: Leaflet maps displaying metro line polyline shapes, glowing color-coded stations indicating crowd occupancy (`Green`, `Yellow`, `Orange`, `Red`), and moving trains.
- **WebSocket Streaming**: Async WebSocket loop at `/api/crowd/ws` broadcasting live station counts, train locations, and alert events.
- **AI Forecasting**: Random Forest models trained on Delhi Metro datasets to predict passenger group sizes and delay minutes based on traffic index, weather, and calendar dates.
- **Operations Scheduling**: Platform assignment, delay time log adjustments, and a frequency optimizer calculating headway recommendations for peak/off-peak windows.
- **Analytics Export**: Compile reports of delays, occupancy ratios, and congestion trends, exporting them as CSV, Excel (`.xlsx`), or PDF documents.

---

##  Pre-seeded Default Accounts

- **Admin**: `admin@metroflow.com` (password: `admin123`)
- **Operator**: `operator@metroflow.com` (password: `operator123`)
- **Analyst**: `analyst@metroflow.com` (password: `analyst123`)

---

##  Local Development Setup

### Prerequisite
Ensure Python 3.10+, Node.js v18+, and MongoDB (optional, in-memory fallback included) are installed.

### Step 1: Pre-train Machine Learning Models
```bash
pip install -r requirements.txt
python ml/train_models.py
```
*Outputs `demand_model.pkl`, `delay_classifier.pkl`, `delay_regressor.pkl`, and `metrics.json` under `ml/models/`.*

### Step 2: Start the FastAPI Backend
```bash
uvicorn backend.main:app --reload --port 8000
```
*API docs will be available at `http://localhost:8000/docs`.*

### Step 3: Run the React Frontend
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 🐳 Docker Deployment

To run the entire ecosystem (MongoDB, FastAPI backend, React frontend) with a single command:

```bash
docker-compose up --build
```

- **Frontend Client**: `http://localhost:3000`
- **Backend API Docs**: `http://localhost:8000/docs`
