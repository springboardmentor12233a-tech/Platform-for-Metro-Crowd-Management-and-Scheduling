# MetroFlow — AI Metro Crowd Management & Scheduling Platform

> **Version:** 1.0  
> **Start Date:** July 1, 2026  
> **Timeline:** 8 Weeks  
> **Team:** Aditya Machal

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Objectives](#objectives)
3. [Core Modules](#core-modules)
4. [Tech Stack](#tech-stack)
5. [Data Strategy](#data-strategy)
6. [Project Structure](#project-structure)
7. [Documentation Index](#documentation-index)
8. [Milestones & Timeline](#milestones--timeline)

---

## Project Overview

MetroFlow is an AI-powered platform designed to help metro authorities modernize their operations by moving away from static scheduling towards a dynamic, data-driven approach. The platform monitors passenger flows in real-time, predicts crowd densities, and optimizes train schedules to reduce overcrowding and improve overall efficiency.

**Key Constraint:** The platform does **not** use computer vision or CCTV image processing. All AI models rely entirely on structured and semi-structured datasets (ticketing data, GPS data, schedule logs, weather data).

---

## Objectives

- Monitor passenger density at stations in real-time using ticketing and sensor data
- Predict crowd sizes and demand using AI/ML forecasting models
- Dynamically optimize train schedules based on predicted demand
- Generate real-time alerts for overcrowding, delays, and emergencies
- Provide comprehensive analytics dashboards for operational monitoring

---

## Core Modules

| Module | Description | Status |
|--------|-------------|--------|
| **User Management** | Admin/operator login, role-based access, profiles | 🔲 Not Started |
| **Crowd Monitoring** | Passenger density tracking, heatmaps, station congestion | 🔲 Not Started |
| **Scheduling Management** | Dynamic train scheduling, frequency adjustments, delay handling | 🔲 Not Started |
| **AI Prediction** | Demand forecasting, crowd prediction, traffic pattern analysis | 🔲 Not Started |
| **Alert & Notification** | Overcrowding alerts, delay notifications, emergency announcements | 🔲 Not Started |
| **Analytics Dashboard** | Passenger traffic reports, station performance, operational KPIs | 🔲 Not Started |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js / Next.js, Tailwind CSS |
| **API Gateway & Backend** | Python, FastAPI |
| **AI & Analytics** | TensorFlow, Scikit-learn, Pandas, NumPy |
| **Database (User/System)** | PostgreSQL |
| **Database (Operational)** | MongoDB |
| **Cache / Real-time** | Redis |
| **Real-time Communication** | Socket.IO |
| **Cloud & DevOps** | Docker, Kubernetes, AWS/Azure |

---

## Data Strategy

All AI models are trained on structured/tabular data:

- **Passenger Datasets:** Smart card/ticketing data, entry/exit records, station footfall
- **Transportation Datasets:** Train GPS/status, occupancy records, schedule/delay logs
- **External Datasets:** Weather data, calendar/holidays, event data, city demographics

See [Data Documentation](docs/data/DATA_DICTIONARY.md) for full details.

---

## Project Structure

```
Metroflow/
├── README.md                    ← This file
├── docs/                        ← Project documentation
│   ├── data/
│   │   ├── DATA_DICTIONARY.md   ← Dataset descriptions & column definitions
│   │   ├── DATA_COLLECTION.md   ← Data sourcing & collection log
│   │   └── EDA_FINDINGS.md      ← EDA insights & observations
│   ├── architecture/
│   │   └── SYSTEM_DESIGN.md     ← Architecture & system design docs
│   ├── modules/
│   │   └── MODULE_SPECS.md      ← Module specifications & requirements
│   ├── api/
│   │   └── API_REFERENCE.md     ← API endpoint documentation
│   └── deployment/
│       └── DEPLOYMENT.md        ← Deployment & DevOps guide
├── data/                        ← Raw datasets
│   ├── ticketing/               ← Delhi Metro ticketing data
│   ├── entry_exit/              ← TfL & MTA entry/exit data
│   ├── ridership/               ← London transport journey data
│   ├── network_dynamics/        ← Metro network structure data
│   ├── schedules/               ← Indian Railways schedule data
│   ├── delays/                  ← Transport delay logs
│   └── sensor/                  ← MetroPT-3 sensor data
├── eda_delhi_metro.py           ← EDA script for Delhi Metro
├── eda_mta_turnstile.py         ← EDA script for MTA Turnstile
├── backend/                     ← FastAPI backend (TBD)
└── frontend/                    ← Next.js frontend (TBD)
```

---

## Documentation Index

| Document | Path | Description |
|----------|------|-------------|
| **README** | `README.md` | Project overview & quickstart |
| **Data Dictionary** | `docs/data/DATA_DICTIONARY.md` | Column definitions for all datasets |
| **Data Collection Log** | `docs/data/DATA_COLLECTION.md` | Sources, download dates, licenses |
| **EDA Findings** | `docs/data/EDA_FINDINGS.md` | Key insights from exploratory analysis |
| **System Design** | `docs/architecture/SYSTEM_DESIGN.md` | Architecture diagrams & design decisions |
| **Module Specs** | `docs/modules/MODULE_SPECS.md` | Detailed module requirements |
| **API Reference** | `docs/api/API_REFERENCE.md` | Endpoint documentation |
| **Deployment Guide** | `docs/deployment/DEPLOYMENT.md` | Docker, CI/CD, cloud setup |

---

## Milestones & Timeline

| Milestone | Weeks | Deliverables | Status |
|-----------|-------|-------------|--------|
| **M1: Core Setup** | 1–2 (Jul 1–14) | Architecture, DB schema, UI wireframes, basic dashboard |  In Progress |
| **M2: Scheduling & AI** | 3–4 (Jul 15–28) | Scheduling workflows, AI crowd prediction models |  Not Started |
| **M3: Alerts & Analytics** | 5–6 (Jul 29–Aug 11) | Notification system, congestion heatmaps, analytics |  Not Started |
| **M4: Deployment** | 7–8 (Aug 12–25) | Testing, Docker/Cloud deployment, final docs |  Not Started |
