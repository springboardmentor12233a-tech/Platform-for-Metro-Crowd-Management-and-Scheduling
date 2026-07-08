# MetroFlow – AI Metro Crowd Management & Scheduling System

MetroFlow is an AI-powered metro analytics platform designed to analyze passenger movement, monitor station crowd levels, visualize operational insights, and support intelligent scheduling decisions using data analytics.

The project combines a modern React dashboard with a FastAPI backend to provide real-time analytical insights from metro transportation datasets.

---

## Project Objectives

- Analyze metro passenger movement
- Monitor station-wise crowd density
- Visualize passenger trends and revenue
- Identify busiest stations and routes
- Perform Exploratory Data Analysis (EDA)
- Build a scalable foundation for AI-based crowd prediction and scheduling

---

## Features

### Dashboard

- Total Passengers
- Total Trips
- Total Stations
- Total Revenue

### Analytics

- Passenger Trend Analysis
- Revenue Analysis
- Ticket Distribution
- Top 5 Busiest Stations
- Top 10 Routes

### Data Analysis

- Data Cleaning
- Feature Engineering
- Statistical Analysis
- Business Insights
- Dashboard-ready aggregated datasets

### UI

- Responsive Design
- Modern Glassmorphism UI
- Premium Dashboard Layout
- Interactive Charts
- Animated KPI Cards
- Sidebar Navigation

---

# Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Recharts
- Framer Motion
- Axios
- React Router
- React Icons
- Lucide React

## Backend

- FastAPI
- Uvicorn
- Pandas
- NumPy
- Pydantic

## Data Processing

- Pandas
- NumPy

---

# Project Structure

```
MetroFlow
│
├── backend
│   ├── api
│   ├── data
│   ├── services
│   ├── main.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   ├── layout
│   │   └── assets
│   │
│   ├── package.json
│   └── vite.config.js
│
├── datasets
│
├── README.md
│
└── .gitignore
```

---

# Exploratory Data Analysis (EDA)

The project includes a complete Exploratory Data Analysis process.

### Phase 1

- Data Understanding
- Missing Value Analysis
- Duplicate Detection
- Data Cleaning

### Phase 2

- Passenger Distribution
- Fare Distribution
- Distance Distribution
- Ticket Type Analysis
- Station Analysis

### Phase 3

- Passenger vs Fare
- Distance vs Fare
- Ticket Type vs Revenue
- Route Popularity
- Correlation Analysis

### Phase 4

- Feature Engineering
- Revenue Metrics
- Route Features
- Passenger Density
- Trend Analysis

### Phase 5

- Dashboard Visualizations
- Business Insights
- KPI Generation
- Reporting

---

# Dashboard Modules

- Dashboard Overview
- Passenger Trend
- Revenue Analysis
- Ticket Distribution
- Top Stations
- Top Routes

---

# Future Scope

- AI Crowd Prediction
- Passenger Demand Forecasting
- Route Recommendation
- Delay Prediction
- Live Metro Monitoring
- Alert Management
- Authentication & User Roles
- Cloud Deployment

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on

```
http://localhost:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# API Endpoints

| Endpoint | Description |
|-----------|-------------|
| `/dashboard/summary` | Dashboard KPI Summary |
| `/dashboard/passenger-trend` | Passenger Trend |
| `/dashboard/revenue-analysis` | Revenue Analysis |
| `/dashboard/ticket-distribution` | Ticket Distribution |
| `/dashboard/top-stations` | Top Stations |
| `/dashboard/top-routes` | Top Routes |

---

# Dashboard Preview

Current dashboard includes

- Premium Sidebar
- KPI Cards
- Passenger Trend
- Ticket Distribution
- Revenue Analysis
- Top Stations
- Top Routes

---

# Team

MetroFlow Development Team

Milestone 1

- Project Setup
- Dashboard Development
- Backend APIs
- Exploratory Data Analysis
- Data Visualization

---

# License

This project is developed for academic and educational purposes under the Infosys Springboard Internship Program.

---

# Acknowledgements

- Infosys Springboard
- FastAPI
- React
- Recharts
- Tailwind CSS
- Delhi Metro Open Dataset