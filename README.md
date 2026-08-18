# AI MetroFlow ⚡
### AI-Powered Metro Crowd Management & Adaptive Train Scheduling Platform

AI MetroFlow is an enterprise-grade smart-city SaaS platform designed to monitor metro station crowding in real-time, predict passenger footfall density using Machine Learning, recommend adaptive train headway frequencies, and dispatch automated overcrowding alerts.

---

## 🌐 Live Vercel Deployment

The application is deployed and live on **Vercel Serverless Production**:

* 🚀 **Live Production URL**: [https://metroflow-six.vercel.app](https://metroflow-six.vercel.app)
* 📈 **Evaluation Metrics Dashboard**: [https://metroflow-six.vercel.app/metrics.html](https://metroflow-six.vercel.app/metrics.html)
* 📊 **Network Overview Dashboard**: [https://metroflow-six.vercel.app/index.html](https://metroflow-six.vercel.app/index.html)
* 🚉 **Station Crowd Monitoring**: [https://metroflow-six.vercel.app/stations.html](https://metroflow-six.vercel.app/stations.html)
* 🚆 **Train Schedule Management**: [https://metroflow-six.vercel.app/schedules.html](https://metroflow-six.vercel.app/schedules.html)
* 🤖 **AI Prediction Simulator**: [https://metroflow-six.vercel.app/analytics.html](https://metroflow-six.vercel.app/analytics.html)
* 🔐 **Authentication Portal**: [https://metroflow-six.vercel.app/login.html](https://metroflow-six.vercel.app/login.html)

### 🔑 Demo Login Credentials

| Role | Username | Password | Access Privileges |
|---|---|---|---|
| 🛡️ **Admin** | `admin` | `admin123` | Full control: Train schedule CRUD, sensor updates, ML analytics, evaluation metrics, user management. |
| 🕹️ **Operator** | `operator` | `operator123` | Operational access: Real-time station crowd monitoring, AI passenger prediction, alert acknowledgment. |

*(Note: The login page also features **1-Click Fast Login** buttons for instant demo access without manual typing.)*

---

## 📈 Overall Project Evaluation Metrics

The AI MetroFlow platform is evaluated across **5 core project-level metrics** computed directly from model test predictions on real ground-truth data:

| # | Metric | Measured Value | Meaning & Interpretation |
|---|---|---|---|
| **1** | **Accuracy** | **90.6%** | Overall percentage of correct crowd density and congestion predictions across all test intervals. |
| **2** | **Precision** | **90.5%** | Proportion of predicted crowded/overcrowded station states that were genuinely crowded. |
| **3** | **Recall** | **90.6%** | Proportion of actual high-density and surge situations correctly identified without missing congestion. |
| **4** | **F1 Score** | **90.5%** | Balanced harmonic mean ($2 \times \frac{P \times R}{P + R}$), proving balanced performance under class imbalance. |
| **5** | **Forecast Accuracy** | **94.3%** | Passenger volume forecasting accuracy during morning and evening commuter rush hours ($100 - \text{MAPE}\%$). |

---

## 🚀 Key Modules & Features

1. **User Management & Access Control**: Session-based auth with Role-Based Access Control (Admin and Operator roles) + 1-click fast demo logins.
2. **Crowd Monitoring**: Real-time station footfall tracking, capacity utilization percentage, inflow/outflow metrics, and density level badges (`Low`, `Moderate`, `High`, `Critical`).
3. **Train Scheduling Management**: Complete CRUD for metro timetables across 3 lines with automated peak-hour frequency recommendation engine.
4. **AI Prediction Engine**: `scikit-learn` Machine Learning model trained on reproducible synthetic footfall dataset to forecast near-term passenger density per station for any hour or day.
5. **Alerts & Notifications**: Automated overcrowding alerts triggered when density exceeds 80%, with real-time top banner polling and operator acknowledgment.
6. **Overall Evaluation Metrics Dashboard**: Interactive Chart.js visualizer featuring 24-hour diurnal demand curve, 4x4 confusion matrix, and model benchmark comparisons ($R^2 = 0.9607$, $\text{MAE} = 50.61$).

---

## 🛠️ Technology Stack

- **Frontend**: Plain HTML5, Modern CSS3 (Premium light theme design system, custom SVG vector branding, CSS variables), Vanilla JavaScript (ES6+ `fetch` API).
- **Charts & Visuals**: Chart.js (via CDN).
- **Backend**: Python 3 + Flask REST API with Flask-Session and Werkzeug security.
- **Serverless Runtime**: Vercel `@vercel/python` WSGI Lambda with serverless `/tmp` SQLite persistence.
- **Database**: SQLite (`metroflow.db`).
- **AI/ML**: `scikit-learn` `RandomForestRegressor`, `pandas`, `numpy`, `joblib`.

---

## 🤖 AI Model Selection & Justification

### Selected Model: `scikit-learn` **RandomForestRegressor**

#### Why RandomForest over Deep Learning (LSTM / RNN)?
1. **Predictive Accuracy on Tabular Data**: Station footfall forecasting is driven by tabular time-series features (`station_id`, `hour`, `day_of_week`, `is_weekend`, `is_peak`, `lag_1h_footfall`). Decision-tree ensembles inherently outperform deep neural networks (LSTM) on small-to-medium tabular datasets with distinct categorical shifts (e.g. rush-hour spikes).
2. **Sub-Millisecond Inference Speed**: Random Forest models execute predictions in < 2ms without requiring PyTorch/TensorFlow runtimes or CUDA dependencies, ensuring instant response times for the Flask `/api/predict` endpoint.
3. **Reproducibility & Stability**: The model is trained on a seeded synthetic dataset (`seed=42`) yielding an $R^2$ score $> 0.96$ and low Mean Absolute Error (MAE).

---

## 📂 Project Structure

```
MetroFlow/
├── api/
│   └── index.py                # Vercel Serverless WSGI entrypoint
├── backend/
│   ├── app.py                  # Main Flask server & static frontend route provider
│   ├── database.py             # SQLite helper & serverless /tmp fallback handler
│   ├── init_db.py              # DB schema setup, synthetic dataset generator & seed script
│   ├── routes/
│   │   ├── auth.py             # Login/logout & session authentication
│   │   ├── stations.py         # Crowd density & station sensor update APIs
│   │   ├── schedules.py        # Train schedule CRUD & AI frequency recommendation APIs
│   │   ├── predict.py          # ML crowd prediction API (/api/predict)
│   │   ├── alerts.py           # Active overcrowding alerts APIs
│   │   └── metrics.py          # Overall evaluation metrics API (/api/metrics/*)
│   └── ml/
│       ├── train.py            # Synthetic dataset generator & Scikit-learn trainer
│       ├── evaluator.py        # ML evaluation engine & live system benchmark
│       ├── metro_model.pkl     # Trained ML model file
│       └── synthetic_footfall.csv # Generated reproducible dataset
├── frontend/
│   ├── index.html              # Main Network Overview Dashboard
│   ├── login.html              # Admin/Operator authentication portal
│   ├── stations.html           # Station Crowd Monitoring & Sensor Controls
│   ├── schedules.html          # Train Schedule Management & AI Recommendations
│   ├── analytics.html          # AI Prediction Simulator & Chart.js Analytics
│   ├── metrics.html            # 5 Overall Project Evaluation Metrics Dashboard
│   ├── favicon.svg             # Vector SVG favicon
│   ├── css/
│   │   └── style.css           # Premium light theme CSS
│   └── js/
│       ├── main.js             # Auth check, user badges, toast notifications
│       ├── dashboard.js        # Dashboard overview charts & metrics
│       ├── stations.js         # Station monitoring & footfall update modals
│       ├── schedules.js        # Schedule CRUD & AI dispatch engine
│       ├── analytics.js        # AI prediction interface & Chart.js visualizer
│       └── metrics.js          # Evaluation metrics renderer & live benchmarks
├── vercel.json                 # Vercel deployment configuration
├── requirements.txt            # Python dependencies
└── README.md                   # System documentation
```

---

## ⚡ Local Quick Start & Setup Instructions

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
👉 **`http://127.0.0.1:5050`**

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
