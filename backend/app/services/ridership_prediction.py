import pandas as pd

from fastapi import HTTPException

from app.core.ml_model import (
    entry_model,
    exit_model,
    ridership_station_encoder,
)

from app.schemas.ridership_prediction import (
    RidershipPredictionRequest,
)


class RidershipPredictionService:

    @staticmethod
    def predict_ridership(
        request: RidershipPredictionRequest,
    ):

        # ======================================================
        # Validate Station Name
        # ======================================================

        try:
            station = ridership_station_encoder.transform(
                [request.station_name]
            )[0]

        except ValueError:

            raise HTTPException(
                status_code=400,
                detail={
                    "message": (
                        f"Invalid station name: '{request.station_name}'."
                    ),
                    "available_stations": list(
                        ridership_station_encoder.classes_
                    ),
                },
            )

        # ======================================================
        # Prepare Input
        # ======================================================

        X = pd.DataFrame(
            [
                {
                    "station_name": station,
                    "platform_count": request.platform_count,
                    "concourse_count": request.concourse_count,
                    "hour": request.hour,
                    "day": request.day,
                    "month": request.month,
                    "day_of_week": request.day_of_week,
                    "weekend": request.weekend,
                }
            ]
        )

        # ======================================================
        # Predict Entry Count
        # ======================================================

        predicted_entry = int(
            round(
                entry_model.predict(X)[0]
            )
        )

        # ======================================================
        # Predict Exit Count
        # ======================================================

        predicted_exit = int(
            round(
                exit_model.predict(X)[0]
            )
        )

        # ======================================================
        # Return Prediction
        # ======================================================

        return {
            "predicted_entry_count": predicted_entry,
            "predicted_exit_count": predicted_exit,
        }