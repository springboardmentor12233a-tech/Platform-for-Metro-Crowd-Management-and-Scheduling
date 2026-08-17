# AI MetroFlow 🚇

**Platform for Metro Crowd Management and Scheduling**
*Developed as part of the Infosys Springboard Internship*

AI MetroFlow is a comprehensive, full-stack, AI-powered platform designed to revolutionize urban transit management. It provides metro operators, analysts, and administrators with real-time insights, predictive analytics, and dynamic scheduling capabilities to optimize passenger flow, reduce congestion, and improve overall transit efficiency.

---

## ✨ Key Features

*   **Real-Time Crowd Monitoring:** Live passenger counting and congestion tracking across all network stations using WebSockets for instant updates.
*   **AI-Powered Predictions:** Machine learning models (Random Forest) that forecast future station demand, detect anomalies, and predict train delays before they happen.
*   **Dynamic Scheduling:** Automated frequency adjustment algorithms that optimize train dispatch intervals based on predicted peak traffic hours.
*   **Congestion Heatmaps:** Interactive, geographical visualizations of crowd density across the entire metro network.
*   **Live Alerts & Announcements:** Instant WebSocket-powered broadcast system for emergency alerts, weather warnings, and platform changes.
*   **Analytics & Reporting:** Comprehensive dashboards and downloadable reports (CSV/PDF) for historical passenger trends and delay factors.

---

## 🛠️ Technology Stack

**Frontend:**
*   **React (Vite):** Fast, modern UI development.
*   **Tailwind CSS:** Highly customizable utility-first styling with Glassmorphic design language.
*   **Lucide React:** Beautiful, consistent iconography.
*   **Recharts:** Dynamic data visualization and charting.

**Backend:**
*   **FastAPI (Python):** High-performance asynchronous API server.
*   **MongoDB (Motor):** Flexible NoSQL database with asynchronous drivers for high concurrency.
*   **Scikit-Learn / Pandas:** Machine learning model execution and data processing.
*   **WebSockets:** Real-time bi-directional communication.
*   **JWT Authentication:** Secure role-based access control (Admin, Analyst, Operator).

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
*   Node.js (v18+)
*   Python (3.10+)
*   MongoDB (Running locally or via MongoDB Atlas)

### 1. Database Setup
Ensure your local MongoDB instance is running. The backend will automatically create the database (`metroflow_db`) and collections on the first run.

### 2. Backend Installation
Open a terminal and navigate to the `backend` folder:
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # On Windows
pip install -r requirements.txt
```

### 3. Frontend Installation
Open a new terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm install
```

---

## 💻 Running the Application

You need to run both the Backend and Frontend servers simultaneously in two separate terminals.

### Start the Backend (FastAPI)
```bash
cd backend
venv\Scripts\activate      # Ensure your virtual environment is active
uvicorn backend.main:app --reload --port 8000
```
*The backend API will be available at: http://127.0.0.1:8000*
*Interactive API Docs (Swagger UI): http://127.0.0.1:8000/docs*

### Start the Frontend (React)
```bash
cd frontend
npm run dev
```
*The frontend application will be available at: http://localhost:5173*

---

## 🔐 Default Test Accounts

When the database initializes, it automatically seeds default users with different roles for testing:

*   **Admin:** `admin@metroflow.com` | Password: `admin123`
*   **Analyst:** `analyst@metroflow.com` | Password: `analyst123`
*   **Operator:** `operator@metroflow.com` | Password: `operator123`

---

## 📂 Project Structure

```text
AI_MetroFlow/
│
├── backend/                  # FastAPI Python Backend
│   ├── main.py               # Application entry point & WebSocket hub
│   ├── database.py           # MongoDB connection & seeding logic
│   ├── auth.py               # JWT generation and validation
│   ├── models/               # Pydantic data schemas
│   ├── routers/              # API route controllers
│   ├── ml/                   # Pre-trained ML models & metrics
│   └── datasets/             # Source CSVs for analytics
│
├── frontend/                 # React UI
│   ├── index.html            # Main HTML wrapper
│   ├── vite.config.js        # Vite bundler configuration
│   ├── src/
│   │   ├── App.jsx           # Main router setup
│   │   ├── main.jsx          # React entry point
│   │   ├── pages/            # View components (Dashboard, Map, etc.)
│   │   ├── components/       # Reusable UI parts (Navbar, Sidebar, Cards)
│   │   └── index.css         # Global Tailwind styles
│
└── docs/                     # Additional Documentation
    ├── API_Documentation.md  
    └── Page_Descriptions.md  
```
