# 🚇 MetroFlow – AI-Powered Metro Crowd Management & Scheduling System

> **Infosys Springboard Virtual Internship 7.0 – Individual Project**

MetroFlow is an AI-powered Metro Crowd Management and Scheduling System developed as an individual project during the **Infosys Springboard Virtual Internship 7.0 (Artificial Intelligence Track)**.

The system predicts passenger crowd density using Machine Learning, provides real-time analytics, monitors station occupancy, manages train schedules, and helps improve metro operations through an interactive dashboard.

---

# 📌 Features

- 🔐 JWT Authentication & Role-Based Access Control
- 📊 Real-Time Dashboard & Analytics
- 🤖 AI-Based Crowd Prediction
- 📈 24-Hour Crowd Forecast
- 🚉 Metro Station Management
- 🚆 Train Schedule Management
- 🚨 Alert Management
- 📄 CSV Report Export
- 📉 Peak Hour Analysis
- 📍 Station Occupancy Monitoring

---

# 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- Recharts

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication

### Database
- PostgreSQL

### Machine Learning
- Scikit-learn
- Random Forest Regressor
- Pandas
- NumPy
- Joblib

---

# 🤖 Machine Learning

The project uses a **Random Forest Regressor** to predict passenger crowd density.

### Input Features
- Station Code
- Hour of Day
- Day of Week
- Month
- Holiday
- Special Event
- Weather
- Previous Hour Passenger Count

### Prediction Output
- Predicted Passenger Count
- Occupancy Ratio
- Crowd Level
- Operational Recommendation

---

# 🏗️ System Architecture

```
React Frontend
       │
       ▼
 FastAPI Backend
       │
 ┌─────┴────────┐
 │              │
 ▼              ▼
PostgreSQL   ML Model
(Random Forest)
       │
       ▼
 Dashboard & Analytics
```

---

# 📂 Project Structure

```
MetroFlow
│
├── backend
│   ├── app
│   ├── ml_pipeline
│   ├── alembic
│   ├── requirements.txt
│   └── .env
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🔌 API Modules

- Authentication
- Stations
- Crowd Prediction
- Schedules
- Alerts
- Analytics

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/MetroFlow.git
cd MetroFlow
```

## Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend URL

```
http://localhost:8000
```

Swagger Documentation

```
http://localhost:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# 📊 Project Modules

- User Authentication
- Dashboard
- Crowd Intelligence
- Metro Stations
- Train Scheduling
- Alerts
- Analytics
- Machine Learning Prediction

---

# 🎯 Project Objectives

- Predict metro crowd density using Machine Learning.
- Improve passenger flow monitoring.
- Analyze station occupancy.
- Generate AI-based operational recommendations.
- Provide interactive dashboards for metro administrators.

---

# 📚 Learning Outcomes

Through this project, I gained practical experience in:

- FastAPI Backend Development
- React Frontend Development
- PostgreSQL Database Management
- REST API Development
- JWT Authentication
- Machine Learning Model Training
- Data Analytics
- API Integration
- Full Stack Application Development

---

# 🚀 Future Enhancements

- Live Metro GPS Tracking
- IoT Sensor Integration
- CCTV-Based Crowd Detection
- Weather API Integration
- SMS & Email Alerts
- Mobile Application
- Deep Learning Models (LSTM/XGBoost)
- Cloud Deployment with CI/CD

---

# 👨‍💻 Developer

**Rudra Prasad Panigrahi**

**B.Tech – Computer Science & Engineering**

**Infosys Springboard Virtual Internship 7.0**

**Artificial Intelligence Intern**

**Individual Project**

---

# 📄 License

This project is developed for educational and internship purposes under the **Infosys Springboard Virtual Internship 7.0**.

---

⭐ **If you found this project useful, consider giving it a Star on GitHub!**
