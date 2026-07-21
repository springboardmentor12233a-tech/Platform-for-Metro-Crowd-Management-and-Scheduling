import joblib
import pandas as pd
from pathlib import Path

MODEL_PATH = Path(__file__).parent / "forecast_model.pkl"

model = joblib.load(MODEL_PATH)


def predict_forecast(station: str, forecast_date):

    forecast_date = pd.to_datetime(forecast_date)

    input_df = pd.DataFrame(
        [
            {
                "from_station": station,
                "year": forecast_date.year,
                "month": forecast_date.month,
                "day": forecast_date.day,
                "day_of_week": forecast_date.dayofweek,
            }
        ]
    )

    prediction = model.predict(input_df)

    return float(round(prediction[0], 2))