# MetroFlow — System Architecture & Design

> **Version:** 1.0  
> **Last Updated:** July 7, 2026

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Component Breakdown](#2-component-breakdown)
3. [Transportation Workflows](#3-transportation-workflows)
4. [Data Flow Architecture](#4-data-flow-architecture)
5. [API Design Principles](#5-api-design-principles)
6. [Security Architecture](#6-security-architecture)

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Admin Panel  │  │  Operator    │  │  Public Dashboard        │  │
│  │  (Next.js)    │  │  Dashboard   │  │  (Read-Only View)        │  │
│  └──────┬───────┘  └──────┬───────┘  └────────────┬─────────────┘  │
│         │                 │                        │                │
│         └─────────────────┼────────────────────────┘                │
│                           │                                         │
│                    WebSocket + REST                                  │
└───────────────────────────┼─────────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────────┐
│                      API GATEWAY                                    │
│                  ┌────────┴────────┐                                │
│                  │   FastAPI        │                                │
│                  │   (Python)       │                                │
│                  │                  │                                │
│                  │  • REST API      │                                │
│                  │  • WebSocket     │                                │
│                  │  • Auth/JWT      │                                │
│                  │  • Rate Limiting │                                │
│                  └────────┬────────┘                                │
│                           │                                         │
│         ┌─────────────────┼─────────────────────┐                  │
│         │                 │                     │                    │
│   ┌─────┴──────┐  ┌──────┴──────┐  ┌───────────┴────────┐         │
│   │  User &    │  │  Crowd &    │  │  Scheduling &      │         │
│   │  Auth      │  │  Monitoring │  │  AI Prediction     │         │
│   │  Service   │  │  Service    │  │  Service            │         │
│   └─────┬──────┘  └──────┬──────┘  └───────────┬────────┘         │
│         │                │                      │                   │
└─────────┼────────────────┼──────────────────────┼───────────────────┘
          │                │                      │
┌─────────┼────────────────┼──────────────────────┼───────────────────┐
│         │           DATA LAYER                  │                   │
│   ┌─────┴──────┐  ┌──────┴──────┐  ┌───────────┴────────┐         │
│   │ PostgreSQL │  │   Redis     │  │     MongoDB        │         │
│   │            │  │             │  │                    │         │
│   │ • Users    │  │ • Sessions  │  │ • Raw sensor data  │         │
│   │ • Stations │  │ • Cache     │  │ • Time-series logs │         │
│   │ • Schedules│  │ • Real-time │  │ • ML model outputs │         │
│   │ • Alerts   │  │   pub/sub   │  │ • Event logs       │         │
│   │ • Trips    │  │ • Live      │  │                    │         │
│   │ • Analytics│  │   crowd     │  │                    │         │
│   └────────────┘  └─────────────┘  └────────────────────┘         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Breakdown

### 2.1 Frontend (Next.js)

| Component | Purpose |
|-----------|---------|
| **Admin Panel** | User management, system configuration, alert rules, schedule overrides |
| **Operator Dashboard** | Live crowd monitoring, schedule view, alert management |
| **Analytics View** | Historical reports, charts, heatmaps, KPI scorecards |
| **Public Dashboard** | Read-only station status and crowd levels (optional) |

### 2.2 Backend (FastAPI)

| Service | Responsibility |
|---------|---------------|
| **Auth Service** | JWT-based authentication, role-based access (RBAC), session management |
| **Crowd Service** | Ingests turnstile/ticketing data, computes real-time occupancy, triggers density alerts |
| **Schedule Service** | CRUD for train schedules, dynamic adjustment engine, conflict resolution |
| **AI Service** | Runs prediction models, serves forecasts, manages model versioning |
| **Alert Service** | Evaluates rules, generates alerts, manages notification delivery |
| **Analytics Service** | Aggregates daily/weekly/monthly stats, generates reports |

### 2.3 Data Stores

| Store | Technology | Purpose | Why This Store? |
|-------|-----------|---------|-----------------|
| **Primary DB** | PostgreSQL | Users, stations, schedules, alerts, trips, analytics | Relational integrity, ACID compliance, complex joins |
| **Cache** | Redis | Live crowd levels, session tokens, rate limiting | Sub-millisecond reads for real-time dashboard |
| **Document Store** | MongoDB | Raw sensor data, ML predictions, event logs | Flexible schema for time-series and unstructured ML outputs |

---

## 3. Transportation Workflows

### Workflow 1: Real-Time Crowd Monitoring

```
Turnstile/Ticket Data Arrives
        │
        ▼
┌─────────────────────┐
│  Ingest & Validate                             │  ← Validate data format, check for anomalies
│  (Crowd Service)                               │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Compute Net Flow                           │  ← diff() for cumulative counters, aggregate per station
│  per Station                                        │
└────────┬────────────┘
         │
         ├──────────────────────┐
         ▼                      ▼
┌─────────────────┐   ┌──────────────────┐
│  Update Redis                        │   │  Store Reading                           │
│  (Live Crowd)                        │   │  in PostgreSQL                          │
└────────┬────────┘   └──────────────────┘
         │
         ▼
┌─────────────────────┐
│  Evaluate Alert     │  ← Check: is current_occupancy > threshold?
│  Rules              │
└────────┬────────────┘
         │
    ┌────┴────┐
    │ YES     │ NO
    ▼         ▼
┌────────┐  (done)
│ Create │
│ Alert  │──▶ WebSocket push to Dashboard
└────────┘
```

### Workflow 2: AI Demand Prediction

```
Scheduled Trigger (every 15 min)
        │
        ▼
┌─────────────────────┐
│  Gather Features    │  ← Current crowd, weather, day/hour, events, holidays
│  (AI Service)       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Run Prediction     │  ← LSTM/XGBoost model: predict crowd for next 1h, 4h, 24h
│  Model              │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Store Prediction   │  ← Save to predictions table with model_version
│  in PostgreSQL      │
└────────┬────────────┘
         │
         ├──────────────────────┐
         ▼                      ▼
┌─────────────────┐   ┌──────────────────┐
│  Push to Redis  │   │  Feed to         │
│  (Dashboard)    │   │  Schedule Service │
└─────────────────┘   └──────────────────┘
```

### Workflow 3: Dynamic Schedule Optimization

```
Prediction Received (from AI Service)
        │
        ▼
┌─────────────────────────┐
│  Compare Predicted      │
│  Demand vs Current      │
│  Schedule Capacity      │
└────────┬────────────────┘
         │
    ┌────┴────────┐
    │ MISMATCH    │ OK
    ▼             ▼
┌─────────────┐  (no change)
│ Generate    │
│ Adjustment  │  ← Increase/decrease frequency, reroute, add trains
│ Proposal    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Admin Approval     │  ← Auto-approve if within policy; else notify operator
│  Check              │
└────────┬────────────┘
       │
       ▼
┌─────────────────────┐
│  Apply Schedule     │  ← Update schedules table, log adjustment reason
│  Change             │
└────────┬────────────┘
       │
       ▼
┌─────────────────────┐
│  Notify via         │  ← Push to operator dashboard, log in alerts
│  WebSocket          │
└─────────────────────┘
```

### Workflow 4: Alert & Notification Pipeline

```
Trigger Source
  │
  ├── Crowd threshold exceeded
  ├── AI predicts overcrowding
  ├── Train delay detected
  └── Manual operator trigger

  ▼
┌─────────────────────┐
│  Alert Engine       │  ← Match against alert_rules table
│  (Alert Service)    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Determine Severity │  ← LOW / MEDIUM / HIGH / CRITICAL
│  & Recipients       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Create Alert       │  ← Insert into alerts table
│  Record             │
└────────┬────────────┘
         │
         ├──────────────┐──────────────┐
         ▼              ▼              ▼
   ┌──────────┐  ┌──────────┐  ┌──────────────┐
   │ WebSocket│  │  Email   │  │ In-App       │
   │ (Live)   │  │ (Async)  │  │ Notification │
   └──────────┘  └──────────┘  └──────────────┘
```

---

## 4. Data Flow Architecture

```
                    ┌──────────────────────────────┐
                    │     EXTERNAL DATA SOURCES     │
                    │                              │
                    │  • Turnstile feeds            │
                    │  • Ticketing API              │
                    │  • Weather API                │
                    │  • Event calendars            │
                    └──────────────┬───────────────┘
                                   │
                              Data Ingestion
                                   │
                    ┌──────────────┴───────────────┐
                    │       PROCESSING LAYER        │
                    │                              │
                    │  1. Validate & Clean          │
                    │  2. Compute derived metrics   │
                    │  3. Aggregate per station     │
                    │  4. Feed ML pipeline          │
                    └──────────────┬───────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
         ┌────┴─────┐      ┌──────┴──────┐      ┌─────┴──────┐
         │PostgreSQL │      │   Redis     │      │  MongoDB   │
         │           │      │             │      │            │
         │Structured │      │Real-time    │      │Time-series │
         │Records    │      │State        │      │& ML Logs   │
         └─────┬─────┘      └──────┬──────┘      └────────────┘
               │                   │
               └─────────┬─────────┘
                         │
                  ┌──────┴──────┐
                  │  FastAPI    │
                  │  REST +     │
                  │  WebSocket  │
                  └──────┬──────┘
                         │
                  ┌──────┴──────┐
                  │  Next.js    │
                  │  Dashboard  │
                  └─────────────┘
```

---

## 5. API Design Principles

| Principle | Implementation |
|-----------|---------------|
| **RESTful** | Standard HTTP methods: GET, POST, PUT, DELETE |
| **Versioned** | All endpoints prefixed with `/api/v1/` |
| **Authenticated** | JWT Bearer tokens on all protected endpoints |
| **Paginated** | All list endpoints support `?page=1&limit=20` |
| **Real-time** | WebSocket at `/ws/dashboard` for live crowd updates |
| **Rate Limited** | Redis-based rate limiting per API key |

### Core Endpoint Groups

```
/api/v1/auth/          ← Login, register, refresh token, logout
/api/v1/users/         ← User CRUD, role management
/api/v1/stations/      ← Station info, crowd levels, search
/api/v1/lines/         ← Metro lines and connections
/api/v1/schedules/     ← Train schedules, adjustments
/api/v1/crowd/         ← Live crowd data, historical readings
/api/v1/predictions/   ← AI forecasts, model performance
/api/v1/alerts/        ← Alert CRUD, acknowledge, resolve
/api/v1/analytics/     ← Reports, aggregates, exports
/ws/dashboard          ← WebSocket for real-time updates
```

---

## 6. Security Architecture

| Layer | Mechanism |
|-------|-----------|
| **Authentication** | JWT access tokens (15 min) + refresh tokens (7 days) |
| **Authorization** | Role-based (Admin, Operator, Viewer) with permission matrix |
| **Password** | bcrypt hashing with salt |
| **API Security** | CORS whitelist, rate limiting, input validation (Pydantic) |
| **Data Security** | Parameterized queries (SQLAlchemy ORM), no raw SQL |
| **Transport** | HTTPS enforced in production |

### Role Permission Matrix

| Resource | Admin | Operator | Viewer |
|----------|-------|----------|--------|
| User management | ✅ Full | ❌ | ❌ |
| View dashboard | ✅ | ✅ | ✅ |
| View crowd data | ✅ | ✅ | ✅ |
| Manage schedules | ✅ | ✅ Edit | ❌ |
| Approve schedule changes | ✅ | ❌ | ❌ |
| Manage alerts | ✅ | ✅ Acknowledge | ✅ View only |
| Configure alert rules | ✅ | ❌ | ❌ |
| View analytics | ✅ | ✅ | ✅ |
| Export reports | ✅ | ✅ | ❌ |
| AI model management | ✅ | ❌ | ❌ |
