# MetroFlow AI: Machine Learning Architecture

MetroFlow AI features four machine learning models running sequentially to predict counts, classifications, and scheduling optimizations.

---

## 📊 Summary of ML Models

| Model | Task / Purpose | Type | Scikit-learn Algorithm | Key Validation Metrics |
| :--- | :--- | :--- | :--- | :--- |
| **Model A** | Segment Trip Crowd Density | Regressor | `HistGradientBoostingRegressor` | MAE: **100.06**, R²: **0.9790** |
| **Model B** | Station Hourly Demand Forecast | Regressor | `HistGradientBoostingRegressor` (with Lag Feature) | MAE: **209.72**, R²: **0.8826** |
| **Model C** | Threshold Overcrowding Classification | Classifier | `HistGradientBoostingClassifier` | Accuracy: **94.66%**, F1: **0.9634** |
| **Model D** | Scheduling frequency optimizer | Rule-Engine | Headway Optimizer | Deterministic operational heuristics |

---

## 🔬 Model Details & Features

### Model A: Trip Crowd Density Regressor
- **Features**: `Hour`, `Day_Name`, `Month`, `Is_Holiday`, `Weather`, `From_Station`, `To_Station`, `Distance_km`, `Ticket_Type`, `Is_Interchange`.
- **Target**: `Passenger_Count` (Number of passengers on the transit segment).
- **Optimization**: Features categorical label encoders. Shrunk final model artifact size from 4.3 GB to **552 KB** while maintaining R² = 97.9%.

### Model B: Passenger Demand Forecaster
- **Features**: `Hour`, `Day_Name`, `Month`, `Is_Holiday`, `Weather`, `From_Station`, `Passenger_Lag_1` (prior hour's count).
- **Target**: Total station passenger load.
- **Usage**: Invoked recursively to calculate next 3-hour projection graphs.

### Model C: Congestion Status Classifier
- **Features**: `Hour`, `Day_Name`, `Month`, `Is_Holiday`, `Weather`, `From_Station`, `To_Station`, `Distance_km`, `Is_Interchange`.
- **Target**: `Congested` (Binary status: 1 = Over 1200 passengers per segment trip, 0 = Normal load).

### Model D: Scheduling recommendation
- **Inputs**: Model A prediction count, Model C congestion status, active line delays (from Postgres rolling stock registry).
- **Calculations**: Computes optimal headway spacing (minutes), train dispatch frequency (trains/hour), and spare vehicle allocations.

---

## 🛠️ Retraining the Models
To retrain and write updated pickle models, run:
```bash
cd backend
python ai/train_model.py
python ai/train_models_extra.py
```
This updates pickle files inside `backend/ai/models/` and generates performance score JSON logs.
