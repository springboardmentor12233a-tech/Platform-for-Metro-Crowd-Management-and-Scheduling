# AI MetroFlow - Milestone 2 Documentation (Week 3 & 4)

## 1. API Documentation

### Train Scheduling API (`/api/schedules`)
- `GET /api/schedules` - Retrieve all schedules with pagination, filtering (station, train, date), and sorting.
- `POST /api/schedules` - Create a new train schedule. Requires `train_id`, `route_id`, `station_id`, `scheduled_arrival`, `scheduled_departure`.
- `PUT /api/schedules/{id}` - Update an existing schedule (delay minutes, platform, status).
- `DELETE /api/schedules/{id}` - Remove a train schedule.

### Machine Learning APIs (`/api/predictions`)
- `POST /api/predict-crowd` - Generates real-time predictions for crowd congestion at a specific station and time using a Random Forest Regressor. Returns predicted passenger count, congestion risk, crowd level, and confidence score.
- `POST /api/forecast-demand` - Generates a time-series forecast (hourly, daily, weekly) for passenger traffic based on historical patterns.

### Reports API (`/api/reports`)
- `GET /api/traffic-report` - Aggregated passenger flow metrics over time.
- `GET /api/frequency-report` - Recommendations for train dispatch frequencies.

## 2. ML Model Documentation

Two primary machine learning models are trained and serialized using `scikit-learn` and `joblib`. 
- **Model 1: Passenger Demand Regressor (`demand_model.pkl`)**
  - **Type:** Random Forest Regressor
  - **Features:** Station ID, Day of Week, Month, Is Weekend, Distance from Origin.
  - **Target:** Passenger Count.
  - **Performance:** MAE and RMSE are calculated during the pipeline build phase in `ml/train_models.py`.
- **Model 2: Delay Classifier/Regressor (`delay_classifier.pkl`, `delay_regressor.pkl`)**
  - **Type:** Random Forest Classifier & Regressor.
  - **Features:** Weather condition, Event Type, Time of Day.
  - **Target:** Probability of Delay & Delay Minutes.

## 3. Database Documentation

The MongoDB Atlas instance has been expanded to support the following collections:
- `schedules`: Stores train schedules. Fields include `train_number`, `train_name`, `route`, `stops` (Array of objects containing station code, arrival, departure).
- `predictions`: Logs historical predictions for accuracy tracking.
- `traffic_reports`: Stores cached analytics for fast dashboard loading.

*Note: Models utilize MongoDB `ObjectId` references to link schedules to stations and trains.*

## 4. Deployment Guide

1. Ensure Docker Desktop is running.
2. In the root directory, ensure `requirements.txt` contains all ML dependencies (`scikit-learn`, `pandas`, `joblib`).
3. Run the complete stack via Docker Compose:
```bash
docker compose up --build
```
This single command will:
- Build the React Frontend (Vite) on port 5173.
- Build the FastAPI Backend on port 8000.
- Execute `ml/train_models.py` inside the Docker build process to serialize the `.pkl` models before the FastAPI server boots.
- Reverse proxy everything securely via Nginx.
