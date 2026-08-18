import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

ML_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(ML_DIR, 'synthetic_footfall.csv')
MODEL_PATH = os.path.join(ML_DIR, 'metro_model.pkl')

STATION_CAPACITIES = {
    1: 1200,  # Whitefield (Kadugodi) (Purple Line)
    2: 1300,  # Krishnarajapura (K.R. Pura) (Purple Line)
    3: 1100,  # Indiranagar (Purple Line)
    4: 1800,  # Nadaprabhu Kempegowda Station, Majestic (Purple Line - Interchange)
    5: 900,   # Kengeri (Purple Line)
    6: 850,   # Madavara (Green Line)
    7: 1300,  # Yeshwanthpur (Green Line)
    8: 1800,  # Nadaprabhu Kempegowda Station, Majestic (Green Line - Interchange)
    9: 1000,  # Jayanagar (Green Line)
    10: 800,  # Silk Institute (Green Line)
    11: 1100, # RV Road (Yellow Line)
    12: 1250, # Jayadeva Hospital (Yellow Line)
    13: 1500, # Central Silk Board (Yellow Line)
    14: 1400, # Electronic City (Yellow Line)
    15: 950   # Delta Electronics Bommasandra (Yellow Line)
}

def generate_synthetic_data(num_days=30):
    """
    Generates realistic station footfall time-series data with morning (08:00-10:00)
    and evening (17:00-20:00) rush-hour peaks, weekend adjustments, and station-specific multipliers.
    """
    np.random.seed(42)
    records = []

    for day in range(num_days):
        day_of_week = day % 7
        is_weekend = 1 if day_of_week >= 5 else 0

        for hour in range(24):
            # Base diurnal curve
            if 6 <= hour <= 9:
                base_factor = 0.85 if hour in [8, 9] else 0.5  # Morning peak
            elif 17 <= hour <= 20:
                base_factor = 0.90 if hour in [17, 18, 19] else 0.65  # Evening peak
            elif 10 <= hour <= 16:
                base_factor = 0.35  # Mid-day
            elif 21 <= hour <= 23:
                base_factor = 0.20  # Late evening
            else:
                base_factor = 0.05  # Night/early morning

            if is_weekend:
                base_factor *= 0.55  # Lower commuter volume on weekends

            is_peak = 1 if (8 <= hour <= 9 or 17 <= hour <= 19) and not is_weekend else 0

            for station_id, capacity in STATION_CAPACITIES.items():
                # Add station specific multiplier & random noise
                station_multiplier = 1.1 if station_id in [1, 2, 10] else 0.9
                random_noise = np.random.normal(0, 0.05)
                
                final_factor = max(0.02, min(1.2, base_factor * station_multiplier + random_noise))
                passenger_count = int(capacity * final_factor)
                density_percentage = round((passenger_count / capacity) * 100, 2)

                records.append({
                    'day': day,
                    'station_id': station_id,
                    'hour': hour,
                    'day_of_week': day_of_week,
                    'is_weekend': is_weekend,
                    'is_peak': is_peak,
                    'capacity': capacity,
                    'passenger_count': passenger_count,
                    'density_percentage': density_percentage
                })

    df = pd.DataFrame(records)
    
    # Feature engineering: Create lag features for 1-hour prior passenger count
    df = df.sort_values(by=['station_id', 'day', 'hour']).reset_index(drop=True)
    df['lag_1h_footfall'] = df.groupby('station_id')['passenger_count'].shift(1).fillna(df['passenger_count'])
    
    df.to_csv(CSV_PATH, index=False)
    print(f"[ML Engine] Synthetic dataset generated with {len(df)} records at {CSV_PATH}")
    return df

def train_and_save_model(df=None):
    if df is None:
        if os.path.exists(CSV_PATH):
            df = pd.read_csv(CSV_PATH)
        else:
            df = generate_synthetic_data()

    feature_cols = ['station_id', 'hour', 'day_of_week', 'is_weekend', 'is_peak', 'lag_1h_footfall']
    X = df[feature_cols]
    y = df['passenger_count']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"[ML Engine] Model Trained. Test MAE: {mae:.2f} passengers, R2 Score: {r2:.4f}")

    joblib.dump(model, MODEL_PATH)
    print(f"[ML Engine] Model successfully saved to {MODEL_PATH}")
    return model, r2

if __name__ == '__main__':
    df = generate_synthetic_data()
    train_and_save_model(df)
