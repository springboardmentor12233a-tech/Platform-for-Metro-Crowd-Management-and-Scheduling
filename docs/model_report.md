# MetroFlow - Machine Learning Model Report

Generated on: 2026-07-21 19:38:06
Model Architecture: Random Forest Regressor (n_estimators=50, max_depth=12)

---

## 1. Evaluation Performance Metrics
The model is validated on a hold-out test set (20% split):

* **Mean Absolute Error (MAE)**: 167.42 passengers
* **Root Mean Squared Error (RMSE)**: 231.64 passengers
* **Coefficient of Determination ($R^2$ Score)**: 0.9377

*Interpretation: An $R^2$ of 0.9377 indicates that over 93.8% of the hourly variance in station passenger volumes is explained by the input features (hour, day of week, events, weather, and lag occupancy).*

---

## 2. Feature Importance Analysis
Relative contribution of each feature to crowd forecasts:

| Rank | Feature Name | Relative Importance % |
| :---: | :--- | :---: |
| 1 | `lag_passenger_count` | 52.73% |
| 2 | `hour_of_day` | 26.04% |
| 3 | `station_code_encoded` | 14.17% |
| 4 | `is_special_event` | 3.41% |
| 5 | `day_of_week` | 2.95% |
| 6 | `weather_code` | 0.39% |
| 7 | `month` | 0.26% |
| 8 | `is_holiday` | 0.04% |

---

## 3. Integration & Deployment Details
* **Inference Endpoint**: Embedded inside FastAPI startup lifecycle.
* **Loading Mechanism**: Auto-loads `ml_pipeline/models/crowd_model.pkl` on application boot.
* **Dynamic Refinement**: Predictions are mapped against station capacity. If predicted occupancy exceeds 85%, automated warning events are emitted into the dashboard in real-time.
