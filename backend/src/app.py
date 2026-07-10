from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from predict import predict_crowd

app = Flask(__name__)
CORS(app)

# ==========================================
# Load Dataset
# ==========================================

df = pd.read_excel("data/MetroFlow_Dataset.xlsx")

# ==========================================
# Home API
# ==========================================

@app.route("/")
def home():
    return "AI MetroFlow Backend Running Successfully"

# ==========================================
# Prediction API
# ==========================================

@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    prediction = predict_crowd(data)

    recommendations = {
        "Low": "✅ Normal Operation",
        "Medium": "⚠ Increase Train Frequency",
        "High": "🚆 Deploy Extra Trains Immediately"
    }

    return jsonify({
        "Crowd_Level": prediction,
        "Recommendation": recommendations[prediction]
    })

# ==========================================
# Dashboard API
# ==========================================

@app.route("/dashboard", methods=["GET"])
def dashboard():

    response = {
        "stations": int(df["Station"].nunique()),
        "passengers": int(df["Passenger_Count"].sum()),
        "predictions": int(len(df)),
        "peak_hour": "8:00 AM"
    }

    return jsonify(response)

# ==========================================
# Monitoring API
# ==========================================

@app.route("/monitoring", methods=["GET"])
def monitoring():

    stations = []

    for station in df["Station"].unique():

        temp = df[df["Station"] == station]

        stations.append({

            "station": station,
            "passenger_count": int(temp["Passenger_Count"].mean()),
            "crowd_level": temp["Crowd_Level"].mode()[0],
            "occupancy": round(temp["Occupancy_Percent"].mean(), 2)

        })

    return jsonify(stations)

# ==========================================
# Reports API
# ==========================================

@app.route("/reports", methods=["GET"])
def reports():

    report = {

        "total_predictions": int(len(df)),

        "highest_crowded_station": df.groupby("Station")["Passenger_Count"].mean().idxmax(),

        "average_passengers": round(df["Passenger_Count"].mean(), 2),

        "peak_hour_records": int(df["Peak_Hour"].sum())

    }

    return jsonify(report)

# ==========================================
# Analytics API
# ==========================================

@app.route("/analytics", methods=["GET"])
def analytics():

    station_data = df.groupby("Station")["Passenger_Count"].mean()

    response = {

        "labels": station_data.index.tolist(),

        "values": station_data.values.tolist()

    }

    return jsonify(response)

# ==========================================
# Alerts API
# ==========================================

@app.route("/alerts", methods=["GET"])
def alerts():

    high = df[df["Crowd_Level"] == "High"]

    alerts = []

    for _, row in high.head(10).iterrows():

        alerts.append({

            "station": row["Station"],

            "time": row["Time"],

            "message": "Heavy Crowd Expected"

        })

    return jsonify(alerts)

# ==========================================
# Schedule Optimization API
# ==========================================

@app.route("/schedule", methods=["GET"])
def schedule():

    schedule_data = [

        {
            "Crowd_Level": "Low",
            "Current_Interval": "10 min",
            "Recommended_Interval": "10 min",
            "Action": "Normal Schedule"
        },

        {
            "Crowd_Level": "Medium",
            "Current_Interval": "10 min",
            "Recommended_Interval": "8 min",
            "Action": "Monitor Station"
        },

        {
            "Crowd_Level": "High",
            "Current_Interval": "10 min",
            "Recommended_Interval": "5 min",
            "Action": "Increase Train Frequency"
        }

    ]

    return jsonify(schedule_data)

# ==========================================
# Run Application
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)