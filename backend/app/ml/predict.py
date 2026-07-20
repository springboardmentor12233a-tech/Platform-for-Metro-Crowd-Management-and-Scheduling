import os
import joblib
import pandas as pd

# Current folder (app/ml)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model
model = joblib.load(os.path.join(BASE_DIR, "crowd_model.pkl"))

# Load encoders
from_station_encoder = joblib.load(os.path.join(BASE_DIR, "from_station_encoder.pkl"))
to_station_encoder = joblib.load(os.path.join(BASE_DIR, "to_station_encoder.pkl"))
ticket_encoder = joblib.load(os.path.join(BASE_DIR, "ticket_encoder.pkl"))
target_encoder = joblib.load(os.path.join(BASE_DIR, "target_encoder.pkl"))


def predict_crowd(from_station, to_station, distance, fare, ticket_type):

    from_station = from_station_encoder.transform([from_station])[0]
    to_station = to_station_encoder.transform([to_station])[0]
    ticket_type = ticket_encoder.transform([ticket_type])[0]

    input_data = pd.DataFrame({
        "From_Station": [from_station],
        "To_Station": [to_station],
        "Distance_km": [distance],
        "Fare": [fare],
        "Ticket_Type": [ticket_type]
    })

    prediction = model.predict(input_data)

    crowd = target_encoder.inverse_transform(prediction)

    return crowd[0]


if __name__ == "__main__":
    result = predict_crowd(
        from_station="Rajiv Chowk",
        to_station="Kashmere Gate",
        distance=12.5,
        fare=40,
        ticket_type="Smart Card"
    )

    print(result)