# MetroFlow — Soham_Parab Branch

AI-powered metro crowd management and scheduling platform. This branch contains my individual contribution to the MetroFlow project: backend API, frontend dashboard, AI prediction model, and data analysis notebooks.

## Project Structure
## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python), SQLAlchemy, JWT (python-jose), Passlib (bcrypt) |
| Database | PostgreSQL |
| Frontend | React (Vite), Tailwind CSS, Axios, React Router, Recharts |
| AI / ML | scikit-learn (Random Forest), joblib, Pandas, NumPy |
| Data Analysis | Jupyter Notebook, Matplotlib, Seaborn |

## Getting Started

### Backend Setup

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate      # Windows
pip install -r requirements.txt
```

Create the PostgreSQL database (default expected name: `metroflow`), then create the tables:
```bash
python -m app.create_tables
```

Run the API server:
```bash
uvicorn app.main:app --reload
```

API runs at `http://127.0.0.1:8000`. Interactive docs available at `http://127.0.0.1:8000/docs`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`. Requires the backend to be running for login, dashboard, and reports functionality.

### Notebooks Setup

```bash
cd notebooks
python -m venv venv
.\venv\Scripts\Activate
pip install jupyter pandas numpy matplotlib seaborn scikit-learn openpyxl joblib
jupyter notebook
```

## Milestone 1 — Status: Complete

- [x] Project initialization and architecture setup
- [x] Authentication (JWT-based register/login)
- [x] Operator management (role-based access control — admin/operator)
- [x] Crowd monitoring dashboard (station density cards + congestion chart)
- [x] System design and folder structure planning
- [x] Data preparation and cleaning (Delhi Metro Network + Ridership datasets)
- [x] Exploratory data analysis with verified corrections and documented findings

Full write-up: see `MetroFlow_Milestone1_Documentation.docx`

## Milestone 2 — Status: Complete

- [x] Train scheduling workflows (Train/Schedule models, CRUD endpoints)
- [x] Frequency adjustment system (rule-based, driven by live crowd density)
- [x] AI crowd prediction model (Random Forest, R² = 0.9666, trained on engineered realistic demand data)
- [x] Real-time operational monitoring (Live Mode with 30s auto-refresh)
- [x] Overcrowding alerts (automatic flagging of Critical-status stations)
- [x] Traffic analysis reports (busiest stations, peak hours, demand by line, weekday/weekend comparison — backend + frontend)

Full write-up: see `MetroFlow_Milestone2_Documentation.docx`

## Milestone 3 — Status: Complete

- [x] Notification and alert workflows (persisted Alert model — create, list, resolve)
- [x] Emergency announcement system (network-wide or station-scoped broadcasts)
- [x] Real-time schedule update features (live delay/status push to existing schedules)
- [x] Congestion heatmap (station × hour demand grid, colour-coded, with hover tooltips)
- [x] AI insights and recommendations (rule-based capacity, scheduling, resource allocation, and line-balance insights)

Full write-up: see `MetroFlow_Milestone3_Documentation.docx`

## Data Analysis Notebooks

| Notebook | Dataset | Summary |
|---|---|---|
| `01_data_exploration.ipynb` | Delhi Metro Network (285 stations) | Station-level data: lines, layout types, coordinates, opening dates. Found and corrected 3 real coordinate errors (Lal Quila, Shyam Park, Hindon River) using verified DMRC/Wikidata sources. |
| `02_ridership_data_exploration.ipynb` | Delhi Metro Ridership (150,000 trips) | Ticketing/trip-level data: routes, fares, passenger counts. Cleaned station name inconsistencies (663 → 24 unique values) and removed invalid same-station trips. Confirmed Fare/Passengers columns carry no real demand signal. |
| `03_crowd_demand_modeling.ipynb` | Engineered synthetic demand (149,340 station-hour records) | Built a realistic hourly demand dataset grounded in real Delhi Metro rush-hour patterns, since the ridership dataset's demand columns were confirmed synthetic/random. Trained and evaluated the Random Forest crowd prediction model used in the AI Prediction module. |

## API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Log in, returns JWT | Public |
| GET | `/operators/me` | Get own profile | Authenticated |
| GET | `/operators/` | List all operators | Admin only |
| PATCH | `/operators/{user_id}/deactivate` | Deactivate an operator | Admin only |
| POST | `/scheduling/trains` | Create a train | Admin only |
| GET | `/scheduling/trains` | List trains | Authenticated |
| POST | `/scheduling/schedules` | Create a schedule | Admin only |
| GET | `/scheduling/schedules` | List/filter schedules | Authenticated |
| GET | `/scheduling/schedules/{id}` | Get a schedule | Authenticated |
| PATCH | `/scheduling/schedules/{id}/adjust-frequency` | Adjust train frequency based on live density | Admin only |
| PATCH | `/scheduling/schedules/{id}/live-update` | Push a live delay/status update to a schedule | Admin only |
| GET | `/predictions/crowd` | Predict passenger demand for a station/hour | Authenticated |
| GET | `/monitoring/status` | Live station status + overcrowding alerts | Authenticated |
| GET | `/reports/traffic-summary` | Full traffic analysis report | Authenticated |
| GET | `/reports/busiest-stations` | Busiest stations report | Authenticated |
| GET | `/reports/peak-hours` | Peak hour analysis | Authenticated |
| GET | `/reports/demand-by-line` | Demand comparison by line | Authenticated |
| GET | `/reports/weekday-vs-weekend` | Weekday vs weekend comparison | Authenticated |
| GET | `/reports/congestion-heatmap` | Station × hour congestion heatmap data | Authenticated |
| GET | `/reports/ai-insights` | Rule-based AI insights and recommendations | Authenticated |
| POST | `/alerts/` | Create an alert | Admin only |
| GET | `/alerts/` | List alerts (active by default, filterable by type) | Authenticated |
| PATCH | `/alerts/{id}/resolve` | Resolve/deactivate an alert | Admin only |
| POST | `/alerts/emergency` | Broadcast an emergency announcement | Admin only |

## Upcoming (Milestone 4)

- Application testing and workflow validation
- UI responsiveness and system optimization
- Deployment via Docker and cloud environment
- Final project documentation and presentation