import os
import joblib
import numpy as np

MODEL_PATH = "ml_pipeline/models/crowd_model.pkl"

class MLService:
    def __init__(self):
        self.model_artifact = None
        self.load_model()

    def load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model_artifact = joblib.load(MODEL_PATH)
                print(f"ML Model loaded successfully from {MODEL_PATH}")
            except Exception as e:
                print(f"Error loading ML model from {MODEL_PATH}: {e}")
                self.model_artifact = None
        else:
            print(f"ML Model file not found at {MODEL_PATH}. Using fallback simulation rules.")
            self.model_artifact = None

    def predict(
        self,
        station_code: str,
        hour: int,
        day_of_week: int,
        month: int,
        is_holiday: bool,
        is_special_event: bool,
        weather: str,
        lag_passenger_count: int
    ) -> int:
        if self.model_artifact is not None:
            try:
                model = self.model_artifact["model"]
                station_map = self.model_artifact["station_mapping"]
                weather_map = self.model_artifact["weather_mapping"]
                
                # Encode inputs
                station_code_encoded = station_map.get(station_code, 0)
                weather_code = weather_map.get(weather, 0)
                
                # Features: station_code_encoded, hour_of_day, day_of_week, month, is_holiday, is_special_event, weather_code, lag_passenger_count
                input_data = np.array([[
                    station_code_encoded,
                    hour,
                    day_of_week,
                    month,
                    int(is_holiday),
                    int(is_special_event),
                    weather_code,
                    lag_passenger_count
                ]])
                
                prediction = model.predict(input_data)
                return int(max(prediction[0], 0))
            except Exception as e:
                print(f"Error executing model prediction: {e}. Falling back to simulation.")
                # fall through to simulation
        
        # Mathematical Fallback Simulation (Zero model startup dependencies)
        is_weekend = day_of_week >= 5
        is_peak = (8 <= hour <= 10) or (17 <= hour <= 19)
        
        # Load factors
        if is_weekend:
            base = 0.2
            if 12 <= hour <= 16:
                base = 0.4
        else:
            base = 0.15
            if is_peak:
                base = 0.75
            elif 11 <= hour <= 16:
                base = 0.4

        if weather in ["Rainy", "Stormy"]:
            base *= 1.15
        if is_holiday:
            base *= 0.7
        if is_special_event:
            base += 0.25

        # Capacity assumptions
        capacity_map = {"HUB": 5000, "NTH": 3000, "APT": 4000, "FID": 4500, "TEC": 3500, "UNI": 2500, "OLD": 2000, "STH": 3000}
        cap = capacity_map.get(station_code, 3000)
        
        # Calculate crowd metric using lag smoothing
        predicted_pct = min(max(base, 0.05), 0.95)
        raw_prediction = int(cap * predicted_pct)
        
        # Blend with lag count
        blended_prediction = int(0.7 * raw_prediction + 0.3 * lag_passenger_count)
        return min(max(blended_prediction, 0), cap)

ml_service = MLService()
