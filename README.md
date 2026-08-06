# MetroFlow ⚡
### AI-Powered Metro Crowd Management & Adaptive Train Scheduling Platform

MetroFlow is a full-stack student project designed to monitor metro station crowding in real-time, predict passenger footfall density using Machine Learning, recommend adaptive train headway frequencies, and dispatch automated overcrowding alerts.

---

## 🚀 Key Modules & Features

1. **User Management & Access Control**: Session-based auth with Role-Based Access Control (Admin and Operator roles).
2. **Crowd Monitoring**: Real-time station footfall tracking, capacity utilization percentage, inflow/outflow metrics, and density level badges (`Low`, `Moderate`, `High`, `Critical`).
3. **Train Scheduling Management**: Complete CRUD for metro timetables across 4 lines with automated peak-hour frequency recommendation engine.
4. **AI Prediction Engine**: `scikit-learn` Machine Learning model trained on reproducible synthetic footfall dataset to forecast near-term passenger density per station for any hour or day.
5. **Alerts & Notifications**: Automated overcrowding alerts triggered when density exceeds 80%, with real-time top banner polling and operator acknowledgment.
6. **Analytics Dashboard**: Interactive Chart.js graphs displaying 24-hour diurnal passenger trends, capacity comparisons, and network congestion breakdowns.

---

## 🛠️ Technology Stack

- **Frontend**: Plain HTML5, Modern CSS3 (Glassmorphism design system, dark palette, CSS variables), Vanilla JavaScript (ES6+ `fetch` API).
- **Charts & Visuals**: Chart.js (via CDN).
- **Backend**: Python 3 + Flask REST API with Flask-Session and Werkzeug security.
- **Database**: SQLite (`metroflow.db`).
- **AI/ML**: `scikit-learn` `RandomForestRegressor`, `pandas`, `numpy`, `joblib`.

---

## 🤖 AI Model Selection & Justification

### Selected Model: `scikit-learn` **RandomForestRegressor**

#### Why RandomForest over Deep Learning (LSTM / RNN)?
1. **Predictive Accuracy on Tabular Data**: Station footfall forecasting is driven by tabular time-series features (`station_id`, `hour`, `day_of_week`, `is_weekend`, `is_peak`, `lag_1h_footfall`). Decision-tree ensembles inherently outperform deep neural networks (LSTM) on small-to-medium tabular datasets with distinct categorical shifts (e.g. rush-hour spikes).
2. **Sub-Millisecond Inference Speed**: Random Forest models execute predictions in < 2ms without requiring PyTorch/TensorFlow runtimes or CUDA dependencies, ensuring instant response times for the Flask `/api/predict` endpoint.
3. **Reproducibility & Stability**: The model is trained on a seeded synthetic dataset (`seed=42`) yielding an $R^2$ score $> 0.95$ and low Mean Absolute Error (MAE).

---

## 📂 Project Structure

```
MetroFlow/
├── backend/
│   ├── app.py                  # Main Flask server & static frontend route provider
│   ├── database.py             # SQLite helper & connection pooling
│   ├── init_db.py              # DB schema setup, synthetic dataset generator & seed script
│   ├── routes/
│   │   ├── auth.py             # Login/logout & session authentication
│   │   ├── stations.py         # Crowd density & station sensor update APIs
│   │   ├── schedules.py        # Train schedule CRUD & AI frequency recommendation APIs
│   │   ├── predict.py          # ML crowd prediction API (/api/predict)
│   │   └── alerts.py           # Active overcrowding alerts APIs
│   └── ml/
│       ├── train.py            # Synthetic dataset generator & Scikit-learn trainer
│       ├── metro_model.pkl     # Trained ML model file
│       └── synthetic_footfall.csv # Generated reproducible dataset
├── frontend/
│   ├── index.html              # Main Network Overview Dashboard
│   ├── login.html              # Admin/Operator authentication portal
│   ├── stations.html           # Station Crowd Monitoring & Sensor Controls
│   ├── schedules.html          # Train Schedule Management & AI Recommendations
│   ├── analytics.html          # AI Prediction Simulator & Chart.js Analytics
│   ├── css/
│   │   └── style.css           # Premium dark theme glassmorphism CSS
│   └── js/
│       ├── main.js             # Auth check, user badges, toast notifications
│       ├── dashboard.js        # Dashboard overview charts & metrics
│       ├── stations.js         # Station monitoring & footfall update modals
│       ├── schedules.js        # Schedule CRUD & AI dispatch engine
│       └── analytics.js        # AI prediction interface & Chart.js visualizer
├── requirements.txt            # Python dependencies
└── README.md                   # System documentation
```

---

## ⚡ Quick Start & Setup Instructions

### 1. Install Dependencies
Make sure Python 3.9+ is installed, then run:
```bash
pip install -r requirements.txt
```

### 2. Initialize Database & Train AI Model
Run the initialization script. This generates the synthetic footfall dataset (`synthetic_footfall.csv`), trains the `scikit-learn` model (`metro_model.pkl`), creates the SQLite database (`metroflow.db`), and seeds default users, stations, schedules, and alerts:
```bash
python backend/init_db.py
```

### 3. Run MetroFlow Flask Application
Start the Flask web server:
```bash
python backend/app.py
```

Open your browser and navigate to:
👉 **`http://127.0.0.1:5000`**

---

## 🔑 Default Credentials

- **Admin Account**:
  - Username: `admin`
  - Password: `admin123`
  - Privileges: Full access (Schedule CRUD, sensor update, analytics, user view)

- **Operator Account**:
  - Username: `operator`
  - Password: `operator123`
  - Privileges: Station crowd monitoring, schedule status updates, AI prediction
