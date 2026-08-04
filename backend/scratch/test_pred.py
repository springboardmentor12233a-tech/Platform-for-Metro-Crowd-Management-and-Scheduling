import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.prediction_service import predict_crowd
from app.schemas.prediction import CrowdPredictionRequest

req = CrowdPredictionRequest(
    hour=9,
    day_name="Monday",
    month=7,
    is_holiday=False,
    weather="Clear",
    from_station="Kashmere Gate",
    to_station="Rajiv Chowk",
    distance_km=4.5,
    ticket_type="Smart Card",
    is_interchange=True
)

try:
    res = predict_crowd(req)
    print("SUCCESS:", res)
except Exception as e:
    import traceback
    traceback.print_exc()
