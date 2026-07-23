# MetroFlow Requirements & Specification

This document details the system design, features, business rules, database schema, and machine learning specifications for **MetroFlow - Platform for Metro Crowd Management and Scheduling**.

---

## 1. System Overview

MetroFlow is designed to help transit operators monitor metro station crowds, predict occupancy spikes, dynamically adjust train frequencies, and trigger automated alerts when capacity thresholds are breached.

### High-level Architecture
* **Frontend**: React.js (built with Vite), styled using Vanilla CSS to implement a high-fidelity dark-mode interface with charts and diagrams.
* **Backend**: FastAPI (Python 3.10+), utilizing Pydantic for request validation, SQLAlchemy for database ORM, and PyJWT for secure user authorization.
* **Database**: PostgreSQL storing static configurations, historical crowd metrics, scheduling records, alerts, and audit logs.
* **Machine Learning**: An ML service embedded in FastAPI that loads a trained regression model (e.g., Random Forest or XGBoost) to forecast crowd densities up to 24 hours in advance.

---

## 2. Role-Based Access Control (RBAC)

The system supports four distinct roles, verified via JWT token payloads:
1. **Admin (`admin`)**:
   * Management of system users, roles, and static station configurations.
   * Full read/write access to all tables.
   * View system audit logs.
2. **Operator (`operator`)**:
   * Control-center view of all metro lines.
   * Create, modify, or delete train schedules.
   * Execute ML-driven scheduling optimizations.
   * Override system alerts.
3. **Station Master (`station_master`)**:
   * Specific to an assigned metro station.
   * Acknowledge and resolve local overcrowding alerts.
   * Update local station status (e.g., platform closures, escalator outages).
4. **Passenger (`passenger`)**:
   * Read-only access to view current train schedules, active delays, and estimated station crowd statuses.

---

## 3. Database Schema

The database consists of six core tables:

### 3.1. Stations
Stores static details and location coordinates of metro stations.
* `id`: UUID (Primary Key)
* `name`: String (Unique)
* `code`: String (e.g., "HUB", "NTH")
* `capacity`: Integer (Maximum passenger limit)
* `status`: String ("Active", "Maintenance", "Closed")
* `latitude`: Float
* `longitude`: Float
* `created_at`: Timestamp

### 3.2. Users
User accounts for authentication.
* `id`: UUID (Primary Key)
* `username`: String (Unique)
* `email`: String (Unique)
* `hashed_password`: String
* `role`: String ("admin", "operator", "station_master", "passenger")
* `station_id`: UUID (Nullable, Foreign Key references Stations)
* `created_at`: Timestamp

### 3.3. Schedules
Train timetable logs.
* `id`: UUID (Primary Key)
* `train_id`: String (e.g., "T-102")
* `line_name`: String (e.g., "Red Line", "Blue Line")
* `direction`: String ("Inbound", "Outbound")
* `departure_station_id`: UUID (Foreign Key references Stations)
* `arrival_station_id`: UUID (Foreign Key references Stations)
* `scheduled_departure`: Timestamp
* `scheduled_arrival`: Timestamp
* `actual_departure`: Timestamp (Nullable)
* `actual_arrival`: Timestamp (Nullable)
* `status`: String ("Scheduled", "On-Time", "Delayed", "Cancelled", "Completed")

### 3.4. CrowdMetrics
Historical logs of passenger volumes used for dashboard telemetry and ML training.
* `id`: UUID (Primary Key)
* `station_id`: UUID (Foreign Key references Stations)
* `passenger_count`: Integer (Active inside station)
* `inflow_rate`: Integer (Entries per minute)
* `outflow_rate`: Integer (Exits per minute)
* `weather`: String ("Clear", "Rainy", "Snowy", "Stormy")
* `is_special_event`: Boolean (Sports, concert, rally nearby)
* `is_holiday`: Boolean
* `recorded_at`: Timestamp

### 3.5. Alerts
System-generated warnings when occupancy exceeds safety margins.
* `id`: UUID (Primary Key)
* `station_id`: UUID (Foreign Key references Stations)
* `severity`: String ("Info", "Warning", "Critical")
* `description`: String
* `status`: String ("Active", "Acknowledged", "Resolved")
* `triggered_at`: Timestamp
* `resolved_at`: Timestamp (Nullable)
* `resolved_by`: UUID (Nullable, Foreign Key references Users)

### 3.6. AuditLogs
System logs for administrative tracking.
* `id`: UUID (Primary Key)
* `user_id`: UUID (Foreign Key references Users)
* `action`: String (e.g., "LOGIN", "CREATE_SCHEDULE", "RESOLVE_ALERT")
* `details`: Text
* `created_at`: Timestamp

---

## 4. Machine Learning & Forecasting Details

The forecasting pipeline takes tabular features and outputs predictions.

### Input Features:
1. `station_id` (One-hot encoded)
2. `hour_of_day` (0-23)
3. `day_of_week` (0-6)
4. `month` (1-12)
5. `is_holiday` (0 or 1)
6. `is_special_event` (0 or 1)
7. `weather_code` (mapped: Clear=0, Rainy=1, Snowy=2, Stormy=3)
8. `lag_passenger_count` (passenger count 1 hour ago)

### Target Variables:
1. **Passenger Occupancy Prediction** (Regression): Predict `passenger_count` for a given station-hour.
2. **Crowd Level Categorization** (derived):
   * *Low*: < 30% capacity
   * *Moderate*: 30% - 60% capacity
   * *Busy*: 60% - 85% capacity
   * *Overcrowded*: > 85% capacity (triggers alert)

### Schedule Optimization Algorithm:
An operator can run an optimization routine which checks forecasted peaks. If a station's forecasted occupancy exceeds 80%, the schedule recommendation system suggests adding headway adjustments (reducing interval between trains by 2-5 minutes) for the peak time window.
