# MetroFlow — Soham_Parab Branch

AI-powered metro crowd management and scheduling platform. This branch contains my individual contribution to the MetroFlow project: backend API, frontend dashboard, and data analysis notebooks.

## Project Structure
## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python), SQLAlchemy, JWT (python-jose), Passlib (bcrypt) |
| Database | PostgreSQL |
| Frontend | React (Vite), Tailwind CSS, Axios, React Router, Recharts |
| Data Analysis | Jupyter Notebook, Pandas, NumPy, Matplotlib, Seaborn |

## Getting Started

### Backend Setup

\`\`\`bash
cd backend
python -m venv venv
.\venv\Scripts\Activate      # Windows
pip install -r requirements.txt
\`\`\`

Create the PostgreSQL database (default expected name: `metroflow`), then create the tables:
\`\`\`bash
python -m app.create_tables
\`\`\`

Run the API server:
\`\`\`bash
uvicorn app.main:app --reload
\`\`\`

API runs at `http://127.0.0.1:8000`. Interactive docs available at `http://127.0.0.1:8000/docs`.

### Frontend Setup

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

App runs at `http://localhost:5173`. Requires the backend to be running for login/dashboard functionality.

### Notebooks Setup

\`\`\`bash
cd notebooks
python -m venv venv
.\venv\Scripts\Activate
pip install jupyter pandas numpy matplotlib seaborn scikit-learn openpyxl
jupyter notebook
\`\`\`

## Milestone 1 — Status: Complete

- [x] Project initialization and architecture setup
- [x] Authentication (JWT-based register/login)
- [x] Operator management (role-based access control — admin/operator)
- [x] Crowd monitoring dashboard (station density cards + congestion chart)
- [x] System design and folder structure planning

Full write-up: see `MetroFlow_Milestone1_Documentation.docx`

## Data Analysis Notebooks

| Notebook | Dataset | Summary |
|---|---|---|
| `01_data_exploration.ipynb` | Delhi Metro Network (285 stations) | Station-level data: lines, layout types, coordinates, opening dates. Found and corrected 3 real coordinate errors (Lal Quila, Shyam Park, Hindon River) using verified DMRC/Wikidata sources. |
| `02_ridership_data_exploration.ipynb` | Delhi Metro Ridership (150,000 trips) | Ticketing/trip-level data: routes, fares, passenger counts. Cleaned station name inconsistencies (663 → 24 unique values) and removed invalid same-station trips. |

## API Endpoints (Backend)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Log in, returns JWT | Public |
| GET | `/operators/me` | Get own profile | Authenticated |
| GET | `/operators/` | List all operators | Admin only |
| PATCH | `/operators/{user_id}/deactivate` | Deactivate an operator | Admin only |

## Upcoming (Milestone 2)

- Train scheduling and frequency optimization workflows
- AI-based crowd prediction and passenger demand forecasting models
- Real-time operational monitoring